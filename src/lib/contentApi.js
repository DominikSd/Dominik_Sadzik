import { CONTENT_SCHEMA_VERSION, defaultSiteContent } from "../content/defaultSiteContent";
import {
  editableSectionKeys,
  getCollectionForKey,
  normalizeSiteContent,
  validateSectionData,
} from "../content/siteContentSchema";
import { requireSupabase, siteId, supabase, isSupabaseConfigured } from "./supabaseClient";

function mergeEntries(entries) {
  const merged = { ...defaultSiteContent };

  for (const entry of entries || []) {
    if (
      entry?.key &&
      entry.data &&
      Object.prototype.hasOwnProperty.call(defaultSiteContent, entry.key)
    ) {
      merged[entry.key] = entry.data;
    }
  }

  // If some published entries lost Polish diacritics we prefer values
  // from `defaultSiteContent` for those string fields. This walks the
  // merged object and replaces string fields with the default when the
  // published value contains no Polish letters but the default does.
  function applyDiacriticsFallback(target, reference) {
    const polishRegex = /[ąćęłńóśżźĄĆĘŁŃÓŚŻŹ]/;

    function walk(t, r) {
      if (typeof t !== "object" || t === null) return t;
      for (const key of Object.keys(t)) {
        const tv = t[key];
        const rv = r?.[key];
        if (typeof tv === "string" && typeof rv === "string") {
          // if target string lacks Polish letters but reference has them,
          // use reference value to restore diacritics
          if (!polishRegex.test(tv) && polishRegex.test(rv)) {
            t[key] = rv;
          }
        } else if (Array.isArray(tv) && Array.isArray(rv)) {
          // traverse arrays elementwise when possible
          for (let i = 0; i < tv.length; i++) {
            if (typeof tv[i] === "object" && tv[i] !== null) {
              walk(tv[i], rv[i] || {});
            } else if (typeof tv[i] === "string" && typeof rv[i] === "string") {
              if (!polishRegex.test(tv[i]) && polishRegex.test(rv[i])) tv[i] = rv[i];
            }
          }
        } else if (typeof tv === "object" && tv !== null && typeof rv === "object" && rv !== null) {
          walk(tv, rv);
        }
      }
    }

    walk(target, reference);
  }

  applyDiacriticsFallback(merged, defaultSiteContent);

  return normalizeSiteContent(merged);
}

export async function loadPublishedSiteContent() {
  if (!isSupabaseConfigured) {
    const error = new Error("Supabase CMS is not configured; using defaultSiteContent.");
    console.warn(error.message);
    return { content: defaultSiteContent, usedFallback: true, error };
  }

  try {
    const { data, error } = await supabase
      .from("content_entries")
      .select("collection,key,data,content_schema_version")
      .eq("site_id", siteId)
      .eq("status", "published");

    if (error) throw error;

    return { content: mergeEntries(data), usedFallback: false, error: null };
  } catch (error) {
    console.error("CMS published content failed; using defaultSiteContent.", error);
    return { content: defaultSiteContent, usedFallback: true, error };
  }
}

export async function loadDraftSiteContent() {
  const client = requireSupabase();

  const [{ data: published, error: publishedError }, { data: draft, error: draftError }] =
    await Promise.all([
      client
        .from("content_entries")
        .select("collection,key,data,content_schema_version,updated_at")
        .eq("site_id", siteId)
        .eq("status", "published"),
      client
        .from("content_entries")
        .select("collection,key,data,content_schema_version,updated_at")
        .eq("site_id", siteId)
        .eq("status", "draft"),
    ]);

  if (publishedError) throw publishedError;
  if (draftError) throw draftError;

  return {
    content: mergeEntries([...(published || []), ...(draft || [])]),
    entries: { published: published || [], draft: draft || [] },
  };
}

export async function saveContentDraft(key, value) {
  const client = requireSupabase();
  if (!editableSectionKeys.includes(key)) {
    throw new Error(`Section is not editable in this CMS stage: ${key}`);
  }

  const data = validateSectionData(key, value);
  const { data: draftId, error } = await client.rpc("save_content_draft", {
    p_site_id: siteId,
    p_collection: getCollectionForKey(key),
    p_key: key,
    p_content_schema_version: CONTENT_SCHEMA_VERSION,
    p_data: data,
  });

  if (error) throw error;
  return draftId;
}

export async function publishContentEntry(key) {
  const client = requireSupabase();
  if (!editableSectionKeys.includes(key)) {
    throw new Error(`Section is not publishable in this CMS stage: ${key}`);
  }

  const { data: publishedId, error } = await client.rpc("publish_content_entry", {
    p_site_id: siteId,
    p_collection: getCollectionForKey(key),
    p_key: key,
  });

  if (error) throw error;
  return publishedId;
}

export async function getCurrentMembership() {
  const client = requireSupabase();
  const { data: userResult, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  const userId = userResult.user?.id;
  if (!userId) return null;

  const { data, error } = await client
    .from("site_members")
    .select("site_id,user_id,email,role,active")
    .eq("site_id", siteId)
    .eq("user_id", userId)
    .eq("active", true)
    .maybeSingle();

  if (error) throw error;
  return data;
}
