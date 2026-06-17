import { requireSupabase, siteId } from "./supabaseClient";

function emptyToNull(value) {
  const trimmed = String(value || "").trim();
  return trimmed || null;
}

function normalizeArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

export async function submitWebsiteBrief(form) {
  const client = requireSupabase();

  const payload = {
    site_id: siteId,
    name: String(form.name || "").trim(),
    email: String(form.email || "").trim(),
    phone: emptyToNull(form.phone),
    preferred_contact: emptyToNull(form.preferredContact),
    current_website: emptyToNull(form.currentWebsite),
    project_type: normalizeArray(form.projectTypes),
    website_goals: normalizeArray(form.websiteGoals),
    cms_needs: emptyToNull(form.cmsNeeds),
    materials: form.materials || {},
    style_preferences: normalizeArray(form.stylePreferences),
    inspiration_links: emptyToNull(form.inspirationLinks),
    addons: normalizeArray(form.addons),
    deadline: emptyToNull(form.deadline),
    budget: emptyToNull(form.budget),
    project_description: emptyToNull(form.projectDescription),
    consent_contact: Boolean(form.consentContact),
    source: "brief_form",
  };

  const { error } = await client.from("website_briefs").insert(payload);
  if (error) throw error;

  return { ok: true };
}
