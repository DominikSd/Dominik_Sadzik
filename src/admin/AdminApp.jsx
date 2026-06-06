import React, { useEffect, useMemo, useState } from "react";
import { Eye, LogOut, RefreshCw, Save, ShieldAlert, UploadCloud } from "lucide-react";
import { defaultSiteContent } from "../content/defaultSiteContent";
import { validateSectionData } from "../content/siteContentSchema";
import { getCmsConfigurationHelpText } from "../lib/env";
import {
  getCurrentMembership,
  loadDraftSiteContent,
  publishContentEntry,
  saveContentDraft,
} from "../lib/contentApi";
import {
  adminHashPath,
  isSupabaseConfigured,
  missingPublicEnvVars,
  siteId,
  supabase,
} from "../lib/supabaseClient";
import AnalyticsPanel from "./AnalyticsPanel";
import ContactSectionForm from "./sections/ContactSectionForm";
import FaqSectionForm from "./sections/FaqSectionForm";
import FeatureCardsSectionForm from "./sections/FeatureCardsSectionForm";
import HeroSectionForm from "./sections/HeroSectionForm";
import PagesSectionForm from "./sections/PagesSectionForm";
import PortfolioSectionForm from "./sections/PortfolioSectionForm";
import SeoSectionForm from "./sections/SeoSectionForm";
import ServicesSectionForm from "./sections/ServicesSectionForm";
import SettingsSectionForm from "./sections/SettingsSectionForm";
import LoginPanel from "./auth/LoginPanel.jsx";
import ErrorBoundary from "../components/ErrorBoundary.jsx";

const sections = [
  { key: "hero", label: "Hero", Form: HeroSectionForm },
  { key: "services", label: "Oferta", Form: ServicesSectionForm },
  {
    key: "automationQa",
    label: "Automatyzacja i QA",
    Form: (props) => (
      <FeatureCardsSectionForm
        {...props}
        addLabel="Dodaj kartę QA"
        showCertificate
        showSecondaryCta
      />
    ),
  },
  {
    key: "gamedevTeaser",
    label: "GameDev",
    Form: (props) => <FeatureCardsSectionForm {...props} addLabel="Dodaj kartę GameDev" />,
  },
  { key: "pages", label: "Nowe podstrony", Form: PagesSectionForm },
  { key: "portfolio", label: "Projekty", Form: PortfolioSectionForm },
  { key: "faq", label: "FAQ", Form: FaqSectionForm },
  { key: "contact", label: "Kontakt", Form: ContactSectionForm },
  { key: "seo", label: "SEO", Form: SeoSectionForm },
  { key: "settings", label: "Ustawienia", Form: SettingsSectionForm },
  { key: "stats", label: "Statystyki", Form: null },
];

export default function AdminApp() {
  const [session, setSession] = useState(null);
  const [membership, setMembership] = useState(null);
  const [content, setContent] = useState(defaultSiteContent);
  const [savedContent, setSavedContent] = useState(defaultSiteContent);
  const [activeKey, setActiveKey] = useState("hero");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [developerMode, setDeveloperMode] = useState(false);

  const activeSection = useMemo(
    () => sections.find((section) => section.key === activeKey) || sections[0],
    [activeKey],
  );
  const canWrite = membership?.role === "owner" || membership?.role === "editor";
  const isStats = activeKey === "stats";
  const hasUnsavedChanges = useMemo(() => {
    if (isStats) return false;
    return JSON.stringify(content[activeKey]) !== JSON.stringify(savedContent[activeKey]);
  }, [activeKey, content, isStats, savedContent]);
  const hasAnyUnsavedChanges = useMemo(() => {
    return sections
      .filter((section) => section.Form)
      .some(
        (section) =>
          JSON.stringify(content[section.key]) !== JSON.stringify(savedContent[section.key]),
      );
  }, [content, savedContent]);

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const currentMembership = await getCurrentMembership();
      setMembership(currentMembership);
      if (currentMembership) {
        const result = await loadDraftSiteContent();
        setContent(result.content);
        setSavedContent(result.content);
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

  useEffect(() => {
    const beforeUnload = (event) => {
      if (!hasAnyUnsavedChanges) return undefined;
      event.preventDefault();
      event.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [hasAnyUnsavedChanges]);

  async function saveActiveSection() {
    if (activeKey === "stats") return;
    setStatus("");
    setError("");
    try {
      if (!canWrite) {
        setError(
          "Nie masz uprawnień do zapisu. Poproś właściciela strony o rolę owner albo editor.",
        );
        return;
      }
      validateSectionData(activeKey, content[activeKey]);
      await saveContentDraft(activeKey, content[activeKey]);
      setSavedContent((current) => ({ ...current, [activeKey]: content[activeKey] }));
      setStatus("Draft zapisany. Zmiana nie jest jeszcze publiczna, dopoki jej nie opublikujesz.");
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
      if (!canWrite) {
        setError(
          "Nie masz uprawnień do publikacji. Poproś właściciela strony o rolę owner albo editor.",
        );
        return;
      }
      if (hasUnsavedChanges) {
        await saveContentDraft(activeKey, content[activeKey]);
      }
      await publishContentEntry(activeKey);
      setStatus(
        "Sekcja opublikowana. Draft zostal jako robocza kopia ostatnio opublikowanej wersji.",
      );
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
          <p className="mt-3 leading-7 text-amber-50/85">{getCmsConfigurationHelpText()}</p>
          <div className="mt-4 rounded-lg border border-amber-200/20 bg-slate-950/40 p-4">
            <p className="text-sm font-bold text-amber-100">Brakujace zmienne:</p>
            <ul className="mt-2 list-inside list-disc font-mono text-sm text-amber-50/90">
              {missingPublicEnvVars.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (!session) return <LoginPanel />;

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#050816] text-white">
        Ladowanie panelu...
      </div>
    );
  }

  if (!membership) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#050816] px-6 text-white">
        <div className="max-w-xl rounded-lg border border-red-300/30 bg-red-500/10 p-6">
          <ShieldAlert className="mb-4 h-8 w-8 text-red-200" />
          <h1 className="text-2xl font-black">Brak dostępu</h1>
          <p className="mt-3 leading-7 text-red-50/85">
            To konto nie znajduje się na liście `site_members` dla tej strony. Poproś właściciela o
            dodanie użytkownika z właściwym `user_id`.
          </p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="mt-5 rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            Wyloguj
          </button>
        </div>
      </div>
    );
  }

  const ActiveForm = activeSection.Form;

  return (
    <ErrorBoundary
      title="Wystąpił błąd w panelu CMS"
      description="Przepraszamy, coś poszło nie tak podczas ładowania panelu. Odśwież stronę lub sprawdź konsolę."
    >
      <div className="min-h-screen bg-[#050816] text-white">
        <header className="border-b border-white/10 bg-slate-950/80 px-6 py-4 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
                CMS Etap 1A
              </p>
              <h1 className="text-2xl font-black">Panel zarządzania treścią</h1>
              <p className="mt-1 text-sm text-slate-400">
                Site ID: {siteId} | Rola: {membership.role}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={`#/${adminHashPath}`}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
              >
                <Eye className="h-4 w-4" /> Panel
              </a>
              <button
                onClick={refresh}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
              >
                <RefreshCw className="h-4 w-4" /> Odśwież
              </button>
              <button
                onClick={() => supabase.auth.signOut()}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
              >
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
                  activeKey === section.key
                    ? "bg-cyan-400 text-slate-950"
                    : "border border-white/10 bg-white/[0.045] text-slate-200 hover:bg-white/10"
                }`}
              >
                {section.label}
              </button>
            ))}
          </aside>

          <section className="rounded-lg border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-blue-500/10 md:p-7">
            <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                  Edycja sekcji
                </p>
                <h2 className="mt-1 text-3xl font-black">{activeSection.label}</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {!isStats && (
                  <button
                    disabled={!canWrite}
                    onClick={saveActiveSection}
                    className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2.5 text-sm font-black text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" /> Zapisz draft
                  </button>
                )}
                {!isStats && (
                  <button
                    disabled={!canWrite}
                    onClick={publishActiveSection}
                    className="inline-flex items-center gap-2 rounded-lg border border-cyan-300/30 bg-cyan-400/10 px-4 py-2.5 text-sm font-bold text-cyan-100 hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <UploadCloud className="h-4 w-4" /> Opublikuj
                  </button>
                )}
              </div>
            </div>

            {!isStats && !canWrite && (
              <div className="mb-5 rounded-lg border border-amber-300/30 bg-amber-500/10 p-4 text-sm text-amber-50">
                Nie masz uprawnień do zapisu. Rola viewer może przeglądać panel, ale nie może
                zapisywać ani publikować zmian.
              </div>
            )}
            {hasUnsavedChanges && (
              <div className="mb-5 rounded-lg border border-cyan-300/30 bg-cyan-400/10 p-4 text-sm text-cyan-50">
                Masz nieopublikowane zmiany w tej sekcji. Zapisz draft, a potem opublikuj, żeby
                zmiana pojawiła się na stronie.
              </div>
            )}
            {status && (
              <div className="mb-5 rounded-lg border border-emerald-300/30 bg-emerald-500/10 p-4 text-sm text-emerald-50">
                {status}
              </div>
            )}
            {error && (
              <div className="mb-5 rounded-lg border border-red-300/30 bg-red-500/10 p-4 text-sm text-red-50">
                {error}
              </div>
            )}

            {isStats ? (
              <AnalyticsPanel />
            ) : ActiveForm ? (
              <ActiveForm
                value={content[activeKey]}
                onChange={(nextSection) =>
                  setContent((current) => ({ ...current, [activeKey]: nextSection }))
                }
              />
            ) : (
              <div className="rounded-lg border border-red-300/30 bg-red-500/10 p-6 text-red-50">
                Nie można wyświetlić formularza tej sekcji. Odśwież stronę lub wybierz inną sekcję.
              </div>
            )}

            {!isStats && (
              <div className="mt-8 border-t border-white/10 pt-5">
                <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={developerMode}
                    onChange={(event) => setDeveloperMode(event.target.checked)}
                  />
                  Tryb deweloperski
                </label>
                {developerMode && (
                  <pre className="mt-4 max-h-96 overflow-auto rounded-lg border border-white/10 bg-slate-950/80 p-4 text-xs text-slate-300">
                    {JSON.stringify(content[activeKey], null, 2)}
                  </pre>
                )}
              </div>
            )}
          </section>
        </main>
      </div>
    </ErrorBoundary>
  );
}
