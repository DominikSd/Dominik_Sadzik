import React, { useEffect, useState } from "react";
import { BarChart3, ExternalLink, RefreshCw, ShieldAlert } from "lucide-react";
import { getAnalyticsConfig } from "../lib/analytics/ga4";
import { clearAnalyticsReportCache, fetchGa4Report } from "./analyticsApi";

function formatNumber(value) {
  return new Intl.NumberFormat("pl-PL").format(Number(value || 0));
}

function formatDateTime(value) {
  if (!value) return "Brak daty";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Brak daty";

  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function deviceLabel(value) {
  const labels = {
    desktop: "Desktop",
    mobile: "Mobile",
    tablet: "Tablet",
  };

  return labels[value] || value || "Nieznane";
}

function MetricCard({ label, value, hint }) {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/55 p-4">
      <dt className="text-sm text-slate-400">{label}</dt>
      <dd className="mt-2 text-3xl font-black text-white">{formatNumber(value)}</dd>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

function DataTable({ title, description, emptyText, columns, rows }) {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/45 p-5">
      <h3 className="text-lg font-black text-white">{title}</h3>
      {description && <p className="mt-1 text-sm leading-6 text-slate-400">{description}</p>}
      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-slate-400">{emptyText}</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.16em] text-slate-500">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="border-b border-white/10 pb-3 font-semibold">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {rows.map((row, index) => (
                <tr key={`${title}-${index}`} className="text-slate-200">
                  {columns.map((column) => (
                    <td key={column.key} className="py-3 pr-4">
                      {column.format ? column.format(row[column.key]) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Notice({ title, text, tone = "cyan" }) {
  const toneClass =
    tone === "amber"
      ? "border-amber-300/30 bg-amber-500/10 text-amber-50"
      : "border-cyan-300/25 bg-cyan-500/10 text-cyan-50";

  return (
    <div className={`rounded-lg border p-4 ${toneClass}`}>
      <p className="font-bold">{title}</p>
      <p className="mt-1 text-sm leading-6">{text}</p>
    </div>
  );
}

function ErrorMessage({ error }) {
  const code = error?.code || "";
  const fallback = error?.message || "Nie udalo sie pobrac statystyk.";
  const messages = {
    ga4_not_configured:
      "Statystyki GA4 nie sa jeszcze skonfigurowane. Uzupelnij sekrety Edge Function i sprawdz Property ID GA4.",
    ga4_access_denied: "Service account nie ma dostepu do GA4 property.",
    ga4_rate_limited: "Przekroczono limit Google Analytics Data API. Sprobuj pozniej.",
    google_auth_failed: "Nie udalo sie uwierzytelnic service account Google.",
    not_authenticated: "Sesja wygasla. Zaloguj sie ponownie.",
    not_authorized: "Twoje konto nie ma dostepu do statystyk tej strony.",
  };

  return (
    <div className="rounded-lg border border-red-300/30 bg-red-500/10 p-4 text-red-50">
      <div className="flex gap-3">
        <ShieldAlert className="mt-0.5 h-5 w-5 flex-none" />
        <div>
          <p className="font-bold">Nie mozna wyswietlic raportu</p>
          <p className="mt-1 text-sm leading-6">{messages[code] || fallback}</p>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPanel() {
  const analytics = getAnalyticsConfig();
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function loadReport({ forceRefresh = false } = {}) {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGa4Report({ forceRefresh });
      setReport(data);
    } catch (reportError) {
      setError(reportError);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReport();
  }, []);

  const refresh = () => {
    clearAnalyticsReportCache();
    loadReport({ forceRefresh: true });
  };

  const summary = report?.summary || {};

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-white/10 bg-slate-950/55 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Google Analytics 4
            </p>
            <h3 className="mt-2 text-2xl font-black">
              {analytics.isConfigured ? "Raport GA4" : "GA4 nie jest skonfigurowane we frontendzie"}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Dane ponizej sa pobierane przez Supabase Edge Function ga4-report. Sekrety Google
              zostaja po stronie backendu, a raport moze miec opoznienie wzgledem Google Analytics.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={refresh}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10 disabled:opacity-60"
            >
              <RefreshCw className="h-4 w-4" /> {loading ? "Odswiezanie..." : "Odswiez"}
            </button>
            <a
              href="https://analytics.google.com/analytics/web/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-3 py-2 text-sm font-black text-slate-950 hover:bg-cyan-300"
            >
              <ExternalLink className="h-4 w-4" /> Google Analytics
            </a>
          </div>
        </div>
        <dl className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
            <dt className="text-sm text-slate-400">Measurement ID</dt>
            <dd className="mt-1 font-mono text-sm text-white">
              {analytics.measurementId || "Brak VITE_GA_MEASUREMENT_ID"}
            </dd>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
            <dt className="text-sm text-slate-400">Zgoda w tej przegladarce</dt>
            <dd className="mt-1 text-sm font-semibold text-white">
              {analytics.consent || "Nie wybrano"}
            </dd>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
            <dt className="text-sm text-slate-400">Cache raportu</dt>
            <dd className="mt-1 text-sm font-semibold text-white">
              {report?.clientCache?.hit
                ? `UI cache, ${report.clientCache.ageSeconds}s`
                : report?.cache?.hit
                  ? `Edge cache, ${report.cache.ageSeconds}s`
                  : "Swieze dane"}
            </dd>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
            <dt className="text-sm text-slate-400">Wygenerowano</dt>
            <dd className="mt-1 text-sm font-semibold text-white">
              {formatDateTime(report?.generatedAt)}
            </dd>
          </div>
        </dl>
      </div>

      {!analytics.isConfigured && (
        <Notice
          title="Tracking frontendu nie jest jeszcze skonfigurowany"
          text="Uzupelnij publiczne VITE_GA_MEASUREMENT_ID. Raport w panelu nadal wymaga sekretow Edge Function po stronie Supabase."
          tone="amber"
        />
      )}

      {error && <ErrorMessage error={error} />}

      {loading && !report && (
        <div className="rounded-lg border border-white/10 bg-white/[0.035] p-6 text-sm text-slate-300">
          Pobieranie statystyk z GA4...
        </div>
      )}

      {report?.noData && (
        <Notice
          title="Brak danych dla wybranego okresu"
          text="Brak danych dla wybranego okresu. GA4 moze potrzebowac czasu na zebranie statystyk."
          tone="amber"
        />
      )}

      {report && (
        <>
          <div className="rounded-lg border border-white/10 bg-slate-950/45 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-200">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Podsumowanie ruchu</h3>
                <p className="text-sm text-slate-400">Zakresy: ostatnie 7 dni i ostatnie 30 dni.</p>
              </div>
            </div>
          </div>

          <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Aktywni uzytkownicy 7 dni" value={summary.users7d} />
            <MetricCard label="Aktywni uzytkownicy 30 dni" value={summary.users30d} />
            <MetricCard label="Odslony 7 dni" value={summary.pageViews7d} />
            <MetricCard label="Odslony 30 dni" value={summary.pageViews30d} />
            <MetricCard label="Sesje 7 dni" value={summary.sessions7d} />
            <MetricCard label="Sesje 30 dni" value={summary.sessions30d} />
            <MetricCard label="Eventy 7 dni" value={summary.eventCount7d} />
            <MetricCard label="Eventy 30 dni" value={summary.eventCount30d} />
          </dl>

          <div className="grid gap-5 xl:grid-cols-2">
            <DataTable
              title="Najpopularniejsze sciezki"
              description="Najczesciej odwiedzane podstrony w ostatnich 30 dniach."
              emptyText="Brak danych o sciezkach."
              rows={report.topPages || []}
              columns={[
                { key: "path", label: "Sciezka" },
                { key: "pageViews", label: "Views", format: formatNumber },
                { key: "users", label: "Users", format: formatNumber },
              ]}
            />
            <DataTable
              title="Akcje uzytkownikow"
              description="Bezpieczne eventy: cta_click, contact_click i form_submit."
              emptyText="Brak eventow cta_click/contact_click/form_submit."
              rows={report.topEvents || report.trackedEvents || []}
              columns={[
                { key: "eventName", label: "Event" },
                { key: "count", label: "Liczba", format: formatNumber },
              ]}
            />
            <DataTable
              title="Zrodla ruchu"
              description="Najczestsze source / medium wedlug sesji."
              emptyText="Brak danych o zrodlach ruchu."
              rows={report.trafficSources || []}
              columns={[
                { key: "sourceMedium", label: "Source / medium" },
                { key: "sessions", label: "Sessions", format: formatNumber },
                { key: "users", label: "Users", format: formatNumber },
              ]}
            />
            <DataTable
              title="Urzadzenia"
              description="Ogolny podzial ruchu bez profilowania pojedynczych uzytkownikow."
              emptyText="Brak danych o urzadzeniach."
              rows={report.devices || []}
              columns={[
                { key: "deviceCategory", label: "Urzadzenie", format: deviceLabel },
                { key: "users", label: "Users", format: formatNumber },
                { key: "sessions", label: "Sessions", format: formatNumber },
              ]}
            />
          </div>
        </>
      )}
    </div>
  );
}
