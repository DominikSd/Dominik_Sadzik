import React, { useEffect, useState } from "react";
import { BarChart3, ExternalLink, MousePointerClick, RefreshCw, ShieldAlert } from "lucide-react";
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

function cleanPath(value) {
  const rawPath = String(value || "").trim();
  if (!rawPath || rawPath === "(not set)") return "";

  const hashIndex = rawPath.indexOf("#");
  const beforeHash = hashIndex >= 0 ? rawPath.slice(0, hashIndex) : rawPath;
  const hash = hashIndex >= 0 ? rawPath.slice(hashIndex) : "";
  const withoutQuery = beforeHash.split("?")[0] || "/";
  const cleanHash = hash ? `#${hash.slice(1).split("?")[0].split("&")[0]}` : "";
  const path = `${withoutQuery.startsWith("/") ? withoutQuery : `/${withoutQuery}`}${cleanHash}`;

  return path.replace(/\/{2,}/g, "/");
}

function normalizePath(value) {
  const path = cleanPath(value);
  if (!path) return "";
  return path === "/" ? "/" : path.replace(/\/+$/, "");
}

function appRootPath() {
  return normalizePath(import.meta.env.BASE_URL || "/");
}

function toSentence(value) {
  const text = String(value || "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  if (!text) return "";
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
}

function routeLabelFromSegment(value) {
  const segment = String(value || "")
    .trim()
    .toLowerCase();
  const labels = {
    "strony-cms": "Strony i CMS",
    "qa-automatyzacja": "QA i automatyzacja",
    "automatyzacja-testowanie": "QA i automatyzacja",
    "tester-istqb": "QA i automatyzacja",
    gamedev: "GameDev",
    projects: "Projekty",
    faq: "FAQ",
    contact: "Kontakt",
  };

  return labels[segment] || toSentence(segment);
}

function hashRouteSegment(path) {
  const hashIndex = String(path || "").indexOf("#");
  if (hashIndex < 0) return "";

  return String(path)
    .slice(hashIndex + 1)
    .split("?")[0]
    .split("&")[0]
    .replace(/^\/+|\/+$/g, "");
}

function isHomePagePath(value) {
  const path = cleanPath(value);
  const normalizedPath = normalizePath(path);
  const normalizedRoot = appRootPath();
  const routeSegment = hashRouteSegment(path);

  if (path.includes("#")) return !routeSegment;
  return normalizedPath === "/" || normalizedPath === normalizedRoot;
}

function formatPagePath(value) {
  const path = cleanPath(value);
  const normalizedPath = normalizePath(path);
  const normalizedRoot = appRootPath();
  const routeSegment = hashRouteSegment(path);

  if (!path) {
    return { label: "Nieznana strona", detail: "" };
  }

  if (routeSegment) {
    return {
      label: routeLabelFromSegment(routeSegment),
      detail: path,
    };
  }

  if (normalizedPath === "/" || normalizedPath === normalizedRoot) {
    return { label: "Strona główna", detail: path };
  }

  const segment = normalizedPath.split("/").filter(Boolean).pop();
  return {
    label: routeLabelFromSegment(segment) || "Nieznana strona",
    detail: path,
  };
}

function formatEventName(value) {
  const eventName = String(value || "")
    .trim()
    .toLowerCase();
  const labels = {
    cta_click: "Przyciski oferty i wyceny",
    contact_click: "Kliknięcie kontaktu",
    form_submit: "Wysłanie formularza",
    page_view: "Wyświetlenie strony",
  };

  if (labels[eventName]) return labels[eventName];
  return eventName ? `Inna akcja: ${toSentence(eventName).toLowerCase()}` : "Inna akcja";
}

function getNavClickToken(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^nav_click_/, "");
}

function formatNavClickName(value) {
  const token = getNavClickToken(value);
  const labels = {
    start: "Start",
    strony_i_cms: "Strony i CMS",
    cms: "Strony i CMS",
    qa: "QA",
    qa_i_automatyzacja: "QA",
    gamedev: "GameDev",
    game_dev: "GameDev",
    projekty: "Projekty",
    faq: "FAQ",
    kontakt: "Kontakt",
  };

  return labels[token] || toSentence(token) || "Inna zakładka";
}

function findNavClick(rows, tokens) {
  const wantedTokens = new Set(tokens);
  return (rows || []).find((row) => wantedTokens.has(getNavClickToken(row.eventName))) || {};
}

function formatTrafficSource(value) {
  const source = String(value || "")
    .trim()
    .toLowerCase();
  const labels = {
    "(direct) / (none)": "Wejście bezpośrednie",
    "(not set)": "Brak danych",
    "google / organic": "Google",
    "google / cpc": "Reklama Google",
    "facebook / referral": "Facebook",
    "l.facebook.com / referral": "Facebook",
    "instagram / referral": "Instagram",
    "l.instagram.com / referral": "Instagram",
    "github.com / referral": "GitHub",
  };

  if (labels[source]) return labels[source];
  return toSentence(source.replace(/\s+\/\s+/g, " z ")) || "Brak danych";
}

function deviceLabel(value) {
  const device = String(value || "")
    .trim()
    .toLowerCase();
  const labels = {
    desktop: "Komputer",
    mobile: "Telefon",
    tablet: "Tablet",
  };

  return labels[device] || "Inne urządzenie";
}

function MetricCard({ label, value, hint }) {
  return (
    <div className="min-w-0 rounded-lg border border-white/10 bg-slate-950/55 p-4">
      <dt className="text-sm text-slate-400">{label}</dt>
      <dd className="mt-2 text-3xl font-black text-white">{formatNumber(value)}</dd>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

function AnalyticsSection({ title, description, icon: IconComponent, children }) {
  return (
    <section className="rounded-lg border border-white/10 bg-slate-950/45 p-5">
      <div className="flex items-start gap-3">
        {IconComponent && (
          <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-200">
            <IconComponent className="h-5 w-5" />
          </div>
        )}
        <div className="min-w-0">
          <h3 className="text-lg font-black text-white">{title}</h3>
          {description && <p className="mt-1 text-sm leading-6 text-slate-400">{description}</p>}
        </div>
      </div>
      <div className="mt-5 min-w-0">{children}</div>
    </section>
  );
}

function NavClickHighlight({ label, row }) {
  return (
    <div className="rounded-lg border border-cyan-300/15 bg-cyan-400/10 p-4">
      <p className="text-sm font-semibold text-cyan-100">{label}</p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-cyan-100/60">Kliknięcia</p>
          <p className="mt-1 text-2xl font-black text-white">{formatNumber(row.clicks)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-cyan-100/60">Osoby</p>
          <p className="mt-1 text-2xl font-black text-white">{formatNumber(row.users)}</p>
        </div>
      </div>
    </div>
  );
}

function NavigationClicksPanel({ rows }) {
  const safeRows = rows || [];
  const totalClicks = safeRows.reduce((sum, row) => sum + Number(row.clicks || 0), 0);
  const cms = findNavClick(safeRows, ["strony_i_cms", "cms"]);
  const qa = findNavClick(safeRows, ["qa", "qa_i_automatyzacja"]);
  const gamedev = findNavClick(safeRows, ["gamedev", "game_dev"]);

  return (
    <AnalyticsSection
      icon={MousePointerClick}
      title="Kliknięcia w zakładki"
      description="Pokazuje, w które części strony użytkownicy klikają najczęściej. Dane obejmują kliknięcia z menu, pływającej nawigacji, kart i stopki."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <NavClickHighlight label="Strony i CMS" row={cms} />
        <NavClickHighlight label="QA" row={qa} />
        <NavClickHighlight label="GameDev" row={gamedev} />
      </div>
      {totalClicks === 0 && (
        <div className="mt-4 rounded-lg border border-amber-300/25 bg-amber-500/10 p-4 text-sm leading-6 text-amber-50">
          To nowy pomiar. Zera są normalne, jeśli najnowsza wersja strony nie zebrała jeszcze
          kliknięć albo GA4 nie przetworzyło danych. Po kilku kliknięciach w menu odczekaj chwilę i
          użyj przycisku „Odśwież dane”.
        </div>
      )}
      <div className="mt-5">
        <DataTable
          title="Wszystkie klikane zakładki"
          description="Pełna lista kliknięć w zakładki z ostatnich 30 dni."
          emptyText="Brak danych o kliknięciach w zakładki. Nowe dane pojawią się po kliknięciach użytkowników i odświeżeniu raportu GA4."
          rows={safeRows}
          columns={[
            { key: "eventName", label: "Zakładka", format: formatNavClickName },
            { key: "clicks", label: "Kliknięcia", format: formatNumber },
            { key: "users", label: "Osoby", format: formatNumber },
          ]}
        />
      </div>
    </AnalyticsSection>
  );
}

function renderColumnValue(column, row) {
  if (column.render) return column.render(row);
  const value = row[column.key];
  return column.format ? column.format(value, row) : value;
}

function DataTable({ title, description, emptyText, columns, rows }) {
  const safeRows = rows || [];
  const [primaryColumn, ...metricColumns] = columns;

  return (
    <div className="min-w-0 rounded-lg border border-white/10 bg-slate-950/45 p-5">
      <h3 className="text-lg font-black text-white">{title}</h3>
      {description && <p className="mt-1 text-sm leading-6 text-slate-400">{description}</p>}
      {safeRows.length === 0 ? (
        <p className="mt-4 text-sm text-slate-400">{emptyText}</p>
      ) : (
        <div className="mt-4 space-y-3">
          {safeRows.map((row, index) => (
            <div
              key={`${title}-${index}`}
              className="min-w-0 rounded-lg border border-white/10 bg-white/[0.035] p-4 text-sm text-slate-200 sm:flex sm:items-center sm:justify-between sm:gap-4"
            >
              <div className="min-w-0 flex-1 break-words [overflow-wrap:anywhere]">
                {renderColumnValue(primaryColumn, row)}
              </div>
              <div className="mt-3 grid min-w-0 grid-cols-2 gap-2 sm:mt-0 sm:flex sm:flex-wrap sm:justify-end">
                {metricColumns.map((column) => (
                  <div
                    key={column.key}
                    className="min-w-0 rounded-md bg-slate-950/45 px-3 py-2 sm:min-w-[5.75rem]"
                  >
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-slate-500">
                      {column.label}
                    </p>
                    <p className="mt-1 break-words font-black text-white [overflow-wrap:anywhere]">
                      {renderColumnValue(column, row)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
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
  const fallback = "Nie udało się pobrać statystyk. Spróbuj ponownie za chwilę.";
  const messages = {
    ga4_not_configured:
      "Statystyki GA4 nie są jeszcze skonfigurowane. Sprawdź sekrety Supabase Edge Function.",
    ga4_access_denied:
      "Konto serwisowe nie ma dostępu do tej usługi Google Analytics albo Google Analytics Data API nie jest włączone.",
    ga4_rate_limited: "Przekroczono limit Google Analytics Data API. Spróbuj później.",
    google_auth_failed: "Nie udało się uwierzytelnić service account Google.",
    not_authenticated: "Zaloguj się ponownie, aby zobaczyć statystyki.",
    not_authorized: "Twoje konto nie ma dostępu do statystyk tej strony.",
    supabase_not_configured: "Publiczna konfiguracja Supabase dla frontendu jest niekompletna.",
    edge_function_unreachable:
      "Nie można połączyć się z Supabase Edge Function. Funkcja może nie być wdrożona, projekt Supabase może być nieosiągalny albo frontend może wskazywać inny projekt.",
    edge_function_not_found:
      "Supabase nie znalazł funkcji ga4-report. Najczęściej oznacza to brak deployu funkcji w tym projekcie Supabase.",
    edge_function_forbidden:
      "Supabase odrzucił request do funkcji. Sprawdź sesję użytkownika, JWT funkcji i uprawnienia site_members.",
    edge_function_runtime_error:
      "Funkcja ga4-report zwróciła błąd serwera. Sprawdź logi funkcji w Supabase.",
    edge_supabase_not_configured:
      "Edge Function nie ma wymaganej konfiguracji Supabase. Sprawdź sekrety i zmienne funkcji w projekcie Supabase.",
  };

  return (
    <div className="rounded-lg border border-red-300/30 bg-red-500/10 p-4 text-red-50">
      <div className="flex gap-3">
        <ShieldAlert className="mt-0.5 h-5 w-5 flex-none" />
        <div>
          <p className="font-bold">Nie można wyświetlić raportu</p>
          <p className="mt-1 text-sm leading-6">{messages[code] || fallback}</p>
          {(error?.endpoint || error?.status || error?.checks?.length > 0) && (
            <div className="mt-3 rounded-lg border border-red-200/20 bg-red-950/25 p-3 text-xs leading-5 text-red-50/90">
              {error?.endpoint && (
                <p className="break-all">
                  <span className="font-semibold">Endpoint:</span> {error.endpoint}
                </p>
              )}
              {error?.status && (
                <p>
                  <span className="font-semibold">HTTP status:</span> {error.status}
                </p>
              )}
              {error?.checks?.length > 0 && (
                <ul className="mt-2 list-disc space-y-1 pl-4">
                  {error.checks.map((check) => (
                    <li key={check}>{check}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
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
  const topContentPages = (report?.topPages || []).filter((row) => !isHomePagePath(row.path));

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
              Dane poniżej są pobierane przez Supabase Edge Function ga4-report. Sekrety Google
              zostają po stronie backendu, a raport może mieć opóźnienie względem Google Analytics.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={refresh}
              disabled={loading}
              aria-label="Odśwież dane statystyk"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10 disabled:opacity-60"
            >
              <RefreshCw className="h-4 w-4" /> {loading ? "Odświeżanie..." : "Odśwież dane"}
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
            <dt className="text-sm text-slate-400">Zgoda w tej przeglądarce</dt>
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
                  : "Świeże dane"}
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
          text="Uzupełnij publiczne VITE_GA_MEASUREMENT_ID. Raport w panelu nadal wymaga sekretów Edge Function po stronie Supabase."
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
          text="Brak danych dla wybranego okresu. GA4 może potrzebować czasu na zebranie statystyk."
          tone="amber"
        />
      )}

      {report && (
        <>
          <AnalyticsSection
            icon={BarChart3}
            title="Ruch na stronie"
            description="Dane z ostatnich 7 i 30 dni. Sprawdź, ile osób odwiedza stronę i które elementy przyciągają najwięcej uwagi."
          >
            <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <h4 className="text-sm font-black uppercase tracking-[0.16em] text-cyan-200">
                  Odwiedzający
                </h4>
                <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                  <MetricCard
                    label="Unikalni odwiedzający (7 dni)"
                    value={summary.totalUsers7d}
                    hint="Osoby, które odwiedziły stronę w wybranym okresie."
                  />
                  <MetricCard
                    label="Unikalni odwiedzający (30 dni)"
                    value={summary.totalUsers30d}
                    hint="Osoby, które odwiedziły stronę w wybranym okresie."
                  />
                  <MetricCard
                    label="Nowi odwiedzający (7 dni)"
                    value={summary.newUsers7d}
                    hint="Osoby, które pierwszy raz odwiedziły stronę."
                  />
                  <MetricCard
                    label="Nowi odwiedzający (30 dni)"
                    value={summary.newUsers30d}
                    hint="Osoby, które pierwszy raz odwiedziły stronę."
                  />
                  <MetricCard
                    label="Powracający odwiedzający (7 dni)"
                    value={summary.returningUsers7d}
                    hint="Szacunkowo: unikalni odwiedzający minus nowi odwiedzający."
                  />
                  <MetricCard
                    label="Powracający odwiedzający (30 dni)"
                    value={summary.returningUsers30d}
                    hint="Szacunkowo: unikalni odwiedzający minus nowi odwiedzający."
                  />
                </dl>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <h4 className="text-sm font-black uppercase tracking-[0.16em] text-cyan-200">
                  Aktywność
                </h4>
                <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                  <MetricCard
                    label="Aktywni odwiedzający (7 dni)"
                    value={summary.activeUsers7d}
                    hint="Osoby aktywne według definicji GA4."
                  />
                  <MetricCard
                    label="Aktywni odwiedzający (30 dni)"
                    value={summary.activeUsers30d}
                    hint="Osoby aktywne według definicji GA4."
                  />
                  <MetricCard
                    label="Odsłony (7 dni)"
                    value={summary.pageViews7d}
                    hint="Ile razy wyświetlono strony."
                  />
                  <MetricCard
                    label="Odsłony (30 dni)"
                    value={summary.pageViews30d}
                    hint="Ile razy wyświetlono strony."
                  />
                  <MetricCard
                    label="Wizyty (7 dni)"
                    value={summary.sessions7d}
                    hint="Liczba sesji na stronie."
                  />
                  <MetricCard
                    label="Wizyty (30 dni)"
                    value={summary.sessions30d}
                    hint="Liczba sesji na stronie."
                  />
                  <MetricCard
                    label="Akcje (7 dni)"
                    value={summary.eventCount7d}
                    hint="Kliknięcia i inne mierzone działania."
                  />
                  <MetricCard
                    label="Akcje (30 dni)"
                    value={summary.eventCount30d}
                    hint="Kliknięcia i inne mierzone działania."
                  />
                </dl>
              </div>
            </div>
          </AnalyticsSection>

          <NavigationClicksPanel rows={report.navClicks || []} />

          <div className="grid min-w-0 gap-5 xl:grid-cols-2">
            <DataTable
              title="Najczęściej odwiedzane podstrony"
              description="Podstrony, które odwiedzano najczęściej w ostatnich 30 dniach. Strona główna jest pomijana, bo zwykle naturalnie zbiera najwięcej wejść."
              emptyText="Brak danych o odwiedzanych podstronach dla tego okresu."
              rows={topContentPages}
              columns={[
                {
                  key: "path",
                  label: "Strona",
                  render: (row) => {
                    const page = formatPagePath(row.path);
                    return (
                      <div>
                        <p className="font-black text-white">{page.label}</p>
                        {page.detail && (
                          <p className="mt-1 text-xs text-slate-500">{page.detail}</p>
                        )}
                      </div>
                    );
                  },
                },
                { key: "pageViews", label: "Odsłony", format: formatNumber },
                { key: "users", label: "Odwiedzający", format: formatNumber },
              ]}
            />
            <DataTable
              title="Najczęstsze działania"
              description="Najczęściej wykonywane akcje poza samym przechodzeniem między zakładkami."
              emptyText="Nie zarejestrowano jeszcze kliknięć ani wysłanych formularzy."
              rows={report.topEvents || report.trackedEvents || []}
              columns={[
                { key: "eventName", label: "Działanie", format: formatEventName },
                { key: "count", label: "Liczba", format: formatNumber },
              ]}
            />
            <DataTable
              title="Skąd trafiają odwiedzający"
              description="Najczęstsze źródła wejść na stronę."
              emptyText="Brak danych o źródłach ruchu."
              rows={report.trafficSources || []}
              columns={[
                { key: "sourceMedium", label: "Źródło", format: formatTrafficSource },
                { key: "sessions", label: "Wizyty", format: formatNumber },
                { key: "users", label: "Odwiedzający", format: formatNumber },
              ]}
            />
            <DataTable
              title="Z jakich urządzeń korzystają odwiedzający"
              description="Podział ruchu według typu urządzenia."
              emptyText="Brak danych o urządzeniach."
              rows={report.devices || []}
              columns={[
                { key: "deviceCategory", label: "Urządzenie", format: deviceLabel },
                { key: "users", label: "Odwiedzający", format: formatNumber },
                { key: "sessions", label: "Wizyty", format: formatNumber },
              ]}
            />
          </div>
        </>
      )}
    </div>
  );
}
