import React, { useEffect, useState } from "react";
import { ExternalLink, RefreshCw, ShieldAlert } from "lucide-react";
import { getAnalyticsConfig } from "../lib/analytics/ga4";
import { clearAnalyticsReportCache, fetchGa4Report } from "./analyticsApi";

function formatNumber(value) {
  return new Intl.NumberFormat("pl-PL").format(Number(value || 0));
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

function DataTable({ title, emptyText, columns, rows }) {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/45 p-5">
      <h3 className="text-lg font-black text-white">{title}</h3>
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

function ErrorMessage({ error }) {
  const code = error?.code || "";
  const fallback = error?.message || "Nie udalo sie pobrac statystyk.";
  const messages = {
    ga4_not_configured: "Brakuje konfiguracji GA4 w sekretach Supabase Edge Function.",
    ga4_access_denied: "Service account nie ma dostepu do GA4 property.",
    ga4_rate_limited: "Przekroczono limit Google Analytics Data API. Sprobuj pozniej.",
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
              Dane ponizej sa pobierane przez Supabase Edge Function `ga4-report`. Sekrety Google
              zostaja po stronie backendu.
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
        </dl>
      </div>

      {error && <ErrorMessage error={error} />}

      {loading && !report && (
        <div className="rounded-lg border border-white/10 bg-white/[0.035] p-6 text-sm text-slate-300">
          Pobieranie statystyk z GA4...
        </div>
      )}

      {report?.noData && (
        <div className="rounded-lg border border-amber-300/30 bg-amber-500/10 p-4 text-sm text-amber-50">
          GA4 zwrocilo poprawna odpowiedz, ale dla wybranego zakresu nie ma jeszcze danych.
        </div>
      )}

      {report && (
        <>
          <dl className="grid gap-4 md:grid-cols-4">
            <MetricCard label="Users 7 dni" value={report.summary?.users7d} />
            <MetricCard label="Users 30 dni" value={report.summary?.users30d} />
            <MetricCard label="Page views 7 dni" value={report.summary?.pageViews7d} />
            <MetricCard label="Page views 30 dni" value={report.summary?.pageViews30d} />
          </dl>

          <div className="grid gap-5 xl:grid-cols-2">
            <DataTable
              title="Najpopularniejsze sciezki"
              emptyText="Brak danych o sciezkach."
              rows={report.topPages || []}
              columns={[
                { key: "path", label: "Sciezka" },
                { key: "pageViews", label: "Views", format: formatNumber },
                { key: "users", label: "Users", format: formatNumber },
              ]}
            />
            <DataTable
              title="CTA i kontakt"
              emptyText="Brak eventow cta_click/contact_click/form_submit."
              rows={report.trackedEvents || []}
              columns={[
                { key: "eventName", label: "Event" },
                { key: "count", label: "Liczba", format: formatNumber },
              ]}
            />
            <DataTable
              title="Zrodla ruchu"
              emptyText="Brak danych o zrodlach ruchu."
              rows={report.trafficSources || []}
              columns={[
                { key: "sourceMedium", label: "Source / medium" },
                { key: "sessions", label: "Sessions", format: formatNumber },
                { key: "users", label: "Users", format: formatNumber },
              ]}
            />
          </div>
        </>
      )}
    </div>
  );
}
