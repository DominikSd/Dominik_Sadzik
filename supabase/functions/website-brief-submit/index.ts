import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type BriefPayload = {
  site_id?: string;
  name?: string;
  email?: string;
  phone?: string | null;
  preferred_contact?: string | null;
  current_website?: string | null;
  project_type?: string[];
  website_goals?: string[];
  cms_needs?: string | null;
  materials?: Record<string, string>;
  style_preferences?: string[];
  inspiration_links?: string | null;
  addons?: string[];
  deadline?: string | null;
  budget?: string | null;
  project_description?: string | null;
  consent_contact?: boolean;
  source?: string;
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

function errorResponse(code: string, message: string, status = 400) {
  return jsonResponse({ error: { code, message } }, status);
}

function getPublishableKey() {
  const publishableKeys = Deno.env.get("SUPABASE_PUBLISHABLE_KEYS");
  if (publishableKeys) {
    const parsed = JSON.parse(publishableKeys);
    if (parsed.default) return parsed.default;
  }

  return Deno.env.get("SUPABASE_ANON_KEY") || "";
}

function cleanText(value: unknown, maxLength = 1000) {
  const text = String(value || "").trim();
  return text ? text.slice(0, maxLength) : null;
}

function cleanArray(value: unknown, maxLength = 12) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => cleanText(item, 120))
    .filter(Boolean)
    .slice(0, maxLength) as string[];
}

function cleanMaterials(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  const allowedKeys = ["logo", "texts", "photos", "domain", "businessEmail", "socialProfiles"];
  return Object.fromEntries(
    allowedKeys
      .map((key) => [key, cleanText((value as Record<string, unknown>)[key], 80)])
      .filter(([, option]) => option),
  );
}

function normalizePayload(input: BriefPayload) {
  const payload = {
    site_id: cleanText(input.site_id, 80),
    name: cleanText(input.name, 160),
    email: cleanText(input.email, 180),
    phone: cleanText(input.phone, 80),
    preferred_contact: cleanText(input.preferred_contact, 80),
    current_website: cleanText(input.current_website, 300),
    project_type: cleanArray(input.project_type),
    website_goals: cleanArray(input.website_goals),
    cms_needs: cleanText(input.cms_needs, 180),
    materials: cleanMaterials(input.materials),
    style_preferences: cleanArray(input.style_preferences),
    inspiration_links: cleanText(input.inspiration_links, 1200),
    addons: cleanArray(input.addons, 16),
    deadline: cleanText(input.deadline, 120),
    budget: cleanText(input.budget, 300),
    project_description: cleanText(input.project_description, 3000),
    consent_contact: Boolean(input.consent_contact),
    source: "brief_form",
  };

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email || "");
  const hasProjectContext = payload.project_type.length > 0 || Boolean(payload.project_description);

  if (!payload.site_id) throw new Error("site_id_required");
  if (!payload.name || payload.name.length < 2) throw new Error("name_required");
  if (!payload.email || !emailOk) throw new Error("email_invalid");
  if (!hasProjectContext) throw new Error("project_context_required");
  if (!payload.consent_contact) throw new Error("consent_required");

  return payload;
}

function escapeHtml(value: unknown) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function list(values: string[]) {
  return values.length > 0 ? values.map(escapeHtml).join(", ") : "brak odpowiedzi";
}

function materialsList(materials: Record<string, string>) {
  const labels: Record<string, string> = {
    logo: "Logo",
    texts: "Teksty",
    photos: "Zdjęcia/grafiki",
    domain: "Domena",
    businessEmail: "Firmowa poczta",
    socialProfiles: "Profile social media",
  };

  const rows = Object.entries(materials).map(([key, value]) => `${labels[key] || key}: ${value}`);
  return rows.length > 0 ? rows.map(escapeHtml).join("<br>") : "brak odpowiedzi";
}

function buildEmail(payload: ReturnType<typeof normalizePayload>) {
  const subject = `Nowe zgłoszenie ze strony: ${payload.name}`;
  const text = [
    `Nowe zgłoszenie ze strony`,
    ``,
    `Imię/firma: ${payload.name}`,
    `E-mail: ${payload.email}`,
    `Telefon: ${payload.phone || "-"}`,
    `Preferowany kontakt: ${payload.preferred_contact || "-"}`,
    `Obecna strona/social media: ${payload.current_website || "-"}`,
    ``,
    `Typ strony: ${payload.project_type.join(", ") || "-"}`,
    `Cel strony: ${payload.website_goals.join(", ") || "-"}`,
    `CMS: ${payload.cms_needs || "-"}`,
    `Styl: ${payload.style_preferences.join(", ") || "-"}`,
    `Dodatki: ${payload.addons.join(", ") || "-"}`,
    `Termin: ${payload.deadline || "-"}`,
    `Budżet: ${payload.budget || "-"}`,
    ``,
    `Materiały: ${JSON.stringify(payload.materials)}`,
    ``,
    `Inspiracje: ${payload.inspiration_links || "-"}`,
    ``,
    `Opis projektu:`,
    payload.project_description || "-",
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.55;">
      <h1 style="font-size: 22px;">Nowe zgłoszenie ze strony</h1>
      <p><strong>Imię/firma:</strong> ${escapeHtml(payload.name)}</p>
      <p><strong>E-mail:</strong> ${escapeHtml(payload.email)}</p>
      <p><strong>Telefon:</strong> ${escapeHtml(payload.phone || "-")}</p>
      <p><strong>Preferowany kontakt:</strong> ${escapeHtml(payload.preferred_contact || "-")}</p>
      <p><strong>Obecna strona/social media:</strong> ${escapeHtml(payload.current_website || "-")}</p>
      <hr>
      <p><strong>Typ strony:</strong> ${list(payload.project_type)}</p>
      <p><strong>Cel strony:</strong> ${list(payload.website_goals)}</p>
      <p><strong>CMS:</strong> ${escapeHtml(payload.cms_needs || "-")}</p>
      <p><strong>Materiały:</strong><br>${materialsList(payload.materials)}</p>
      <p><strong>Styl:</strong> ${list(payload.style_preferences)}</p>
      <p><strong>Inspiracje:</strong><br>${escapeHtml(payload.inspiration_links || "-").replace(/\n/g, "<br>")}</p>
      <p><strong>Dodatki:</strong> ${list(payload.addons)}</p>
      <p><strong>Termin:</strong> ${escapeHtml(payload.deadline || "-")}</p>
      <p><strong>Budżet:</strong> ${escapeHtml(payload.budget || "-")}</p>
      <hr>
      <p><strong>Opis projektu:</strong><br>${escapeHtml(payload.project_description || "-").replace(/\n/g, "<br>")}</p>
    </div>
  `;

  return { subject, text, html };
}

async function sendNotificationEmail(payload: ReturnType<typeof normalizePayload>) {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  const to = Deno.env.get("BRIEF_NOTIFICATION_EMAIL");
  const from = Deno.env.get("BRIEF_FROM_EMAIL");

  if (!apiKey || !to || !from) {
    return { sent: false, skipped: true };
  }

  const email = buildEmail(payload);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: payload.email,
      subject: email.subject,
      text: email.text,
      html: email.html,
    }),
  });

  if (!response.ok) {
    throw new Error(`email_send_failed:${response.status}`);
  }

  return { sent: true, skipped: false };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return errorResponse("method_not_allowed", "Ta funkcja obsługuje tylko POST.", 405);
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const databaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || getPublishableKey();

    if (!supabaseUrl || !databaseKey) {
      return errorResponse("supabase_not_configured", "Formularz nie jest skonfigurowany.", 503);
    }

    const payload = normalizePayload((await req.json()) as BriefPayload);
    const client = createClient(supabaseUrl, databaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const usingServiceRole = Boolean(Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
    const insertQuery = client.from("website_briefs").insert(payload);
    const insertResult = usingServiceRole
      ? await insertQuery.select("id").single()
      : await insertQuery;

    if (insertResult.error) {
      throw new Error(`brief_insert_failed:${insertResult.error.message}`);
    }

    let emailSent = false;
    let emailSkipped = false;

    try {
      const emailResult = await sendNotificationEmail(payload);
      emailSent = emailResult.sent;
      emailSkipped = emailResult.skipped;
    } catch (emailError) {
      console.error("website_brief_email_failed", emailError);
    }

    return jsonResponse({
      ok: true,
      leadId: (insertResult.data as { id?: string } | null)?.id || null,
      emailSent,
      emailSkipped,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "brief_submit_failed";

    if (
      [
        "site_id_required",
        "name_required",
        "email_invalid",
        "project_context_required",
        "consent_required",
      ].includes(message)
    ) {
      return errorResponse("invalid_payload", "Niepoprawne dane formularza.", 400);
    }

    console.error("website_brief_submit_failed", error);
    return errorResponse(
      "brief_submit_failed",
      "Nie udało się wysłać formularza. Spróbuj ponownie później.",
      500,
    );
  }
});
