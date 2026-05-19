import React, { useEffect, useMemo, useState } from "react";
import { Eye, LogOut, RefreshCw, Save, ShieldAlert, UploadCloud } from "lucide-react";
import { defaultSiteContent } from "../content/defaultSiteContent";
import { validateSectionData } from "../content/siteContentSchema";
import { getCurrentMembership, loadDraftSiteContent, publishContentEntry, saveContentDraft } from "../lib/contentApi";
import { adminHashPath, isSupabaseConfigured, requireSupabase, siteId, supabase } from "../lib/supabaseClient";
import AnalyticsPanel from "./AnalyticsPanel";
import ContactSectionForm from "./sections/ContactSectionForm";
import FaqSectionForm from "./sections/FaqSectionForm";
import HeroSectionForm from "./sections/HeroSectionForm";
import SeoSectionForm from "./sections/SeoSectionForm";
import ServicesSectionForm from "./sections/ServicesSectionForm";
import SettingsSectionForm from "./sections/SettingsSectionForm";

const sections = [
  { key: "hero", label: "Hero", Form: HeroSectionForm },
  { key: "services", label: "Oferta", Form: ServicesSectionForm },
  { key: "faq", label: "FAQ", Form: FaqSectionForm },
  { key: "contact", label: "Kontakt", Form: ContactSectionForm },
  { key: "seo", label: "SEO", Form: SeoSectionForm },
  { key: "settings", label: "Ustawienia", Form: SettingsSectionForm },
  { key: "stats", label: "Statystyki", Form: null },
];

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const { error: signInError } = await requireSupabase().auth.signInWithPassword({ email, password });
    if (signInError) setError("Nie udalo sie zalogowac. Sprawdz dane i sproboj ponownie.");
    setBusy(false);
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[#050816] px-6 text-white">
      <form onSubmit={submit} className="w-full max-w-md rounded-lg border border-white/10 bg-white/[0.045] p-7 shadow-2xl shadow-blue-500/10">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">Panel CMS</p>
        <h1 className="text-3xl font-black">Logowanie administratora</h1>
        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Email</span>
            <input className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-white outline-none focus:border-cyan-300/70" value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" required />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Haslo</span>
            <input className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-white outline-none focus:border-cyan-300/70" value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" required />
          </label>
        </div>
        {error && <p className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">{error}</p>}
        <button disabled={busy} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-400 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-300 disabled:opacity-60">
          {busy ? "Logowanie..." : "Zaloguj"}
        </button>
      </form>
    </div>
  );
}

export default function AdminApp() {
  const [session, setSession] = useState(null);
  const [membership, setMembership] = useState(null);
  const [content, setContent] = useState(defaultSiteContent);
  const [activeKey, setActiveKey] = useState("hero");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [developerMode, setDeveloperMode] = useState(false);

  const activeSection = useMemo(() => sections.find((section) => section.key === activeKey), [activeKey]);
  const canWrite = membership?.role === "owner" || membership?.role === "editor";

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const currentMembership = await getCurrentMembership();
      setMembership(currentMembership);
      if (currentMembership) {
        const result = await loadDraftSiteContent();
        setContent(result.content);
      }
    } catch (refreshError) {
      console.error("Admin CMS refresh failed.", refreshError);
      setError(refreshError.message || "Nie udalo sie pobrac danych CMS.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return undefined;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (!data.session) setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession) {
        setMembership(null);
        setLoading(false);
      }
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) refresh();
  }, [session]);

  useEffect(() => {
    document.title = "Panel CMS - Dominik Sadzik";
  }, []);

  async function saveActiveSection() {
    if (activeKey === "stats") return;
    setStatus("");
    setError("");
    try {
      validateSectionData(activeKey, content[activeKey]);
      await saveContentDraft(activeKey, content[activeKey]);
      setStatus("Draft zapisany.");
    } catch (saveError) {
      console.error("Save draft failed.", saveError);
      setError(saveError.message || "Nie udalo sie zapisac draftu.");
    }
  }

  async function publishActiveSection() {
    if (activeKey === "stats") return;
    setStatus("");
    setError("");
    try {
      await publishContentEntry(activeKey);
      setStatus("Sekcja opublikowana. Draft zostal jako robocza kopia opublikowanej wersji.");
      await refresh();
    } catch (publishError) {
      console.error("Publish failed.", publishError);
      setError(publishError.message || "Nie udalo sie opublikowac sekcji.");
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#050816] px-6 text-white">
        <div className="max-w-xl rounded-lg border border-amber-300/30 bg-amber-500/10 p-6">
          <ShieldAlert className="mb-4 h-8 w-8 text-amber-200" />
          <h1 className="text-2xl font-black">CMS nie jest skonfigurowany</h1>
          <p className="mt-3 leading-7 text-amber-50/85">
            Uzupelnij zmienne z `.env.example`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SITE_ID` oraz `VITE_ADMIN_HASH_PATH`.
          </p>
        </div>
      </div>
    );
  }

  if (!session) return <LoginForm />;

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-[#050816] text-white">Ladowanie panelu...</div>;
  }

  if (!membership) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#050816] px-6 text-white">
        <div className="max-w-xl rounded-lg border border-red-300/30 bg-red-500/10 p-6">
          <ShieldAlert className="mb-4 h-8 w-8 text-red-200" />
          <h1 className="text-2xl font-black">Brak dostepu</h1>
          <p className="mt-3 leading-7 text-red-50/85">To konto nie znajduje sie na whitelist `site_members` dla tej strony.</p>
          <button onClick={() => supabase.auth.signOut()} className="mt-5 rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">
            Wyloguj
          </button>
        </div>
      </div>
    );
  }

  const ActiveForm = activeSection.Form;
  const isStats = activeKey === "stats";

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <header className="border-b border-white/10 bg-slate-950/80 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">CMS Etap 1A</p>
            <h1 className="text-2xl font-black">Panel zarzadzania trescia</h1>
            <p className="mt-1 text-sm text-slate-400">Site ID: {siteId} | Rola: {membership.role}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={`#/${adminHashPath}`} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/10">
              <Eye className="h-4 w-4" /> Panel
            </a>
            <button onClick={refresh} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/10">
              <RefreshCw className="h-4 w-4" /> Odswiez
            </button>
            <button onClick={() => supabase.auth.signOut()} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/10">
              <LogOut className="h-4 w-4" /> Wyloguj
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.key}
              onClick={() => setActiveKey(section.key)}
              className={`w-full rounded-lg px-4 py-3 text-left text-sm font-semibold transition ${
                activeKey === section.key ? "bg-cyan-400 text-slate-950" : "border border-white/10 bg-white/[0.045] text-slate-200 hover:bg-white/10"
              }`}
            >
              {section.label}
            </button>
          ))}
        </aside>

        <section className="rounded-lg border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-blue-500/10 md:p-7">
          <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Edycja sekcji</p>
              <h2 className="mt-1 text-3xl font-black">{activeSection.label}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {!isStats && <button
                disabled={!canWrite}
                onClick={saveActiveSection}
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2.5 text-sm font-black text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save className="h-4 w-4" /> Zapisz draft
              </button>}
              {!isStats && <button
                disabled={!canWrite}
                onClick={publishActiveSection}
                className="inline-flex items-center gap-2 rounded-lg border border-cyan-300/30 bg-cyan-400/10 px-4 py-2.5 text-sm font-bold text-cyan-100 hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <UploadCloud className="h-4 w-4" /> Opublikuj
              </button>}
            </div>
          </div>

          {!isStats && !canWrite && (
            <div className="mb-5 rounded-lg border border-amber-300/30 bg-amber-500/10 p-4 text-sm text-amber-50">
              Masz role viewer, wiec mozesz przegladac panel, ale nie zapiszesz zmian.
            </div>
          )}
          {status && <div className="mb-5 rounded-lg border border-emerald-300/30 bg-emerald-500/10 p-4 text-sm text-emerald-50">{status}</div>}
          {error && <div className="mb-5 rounded-lg border border-red-300/30 bg-red-500/10 p-4 text-sm text-red-50">{error}</div>}

          {isStats ? (
            <AnalyticsPanel />
          ) : (
            <ActiveForm
              value={content[activeKey]}
              onChange={(nextSection) => setContent((current) => ({ ...current, [activeKey]: nextSection }))}
            />
          )}

          {!isStats && <div className="mt-8 border-t border-white/10 pt-5">
            <label className="inline-flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" checked={developerMode} onChange={(event) => setDeveloperMode(event.target.checked)} />
              Tryb deweloperski
            </label>
            {developerMode && (
              <pre className="mt-4 max-h-96 overflow-auto rounded-lg border border-white/10 bg-slate-950/80 p-4 text-xs text-slate-300">
                {JSON.stringify(content[activeKey], null, 2)}
              </pre>
            )}
          </div>}
        </section>
      </main>
    </div>
  );
}
