import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import AnimatedCircuit from "./components/AnimatedCircuit";
import { defaultSiteContent } from "./content/defaultSiteContent";
import { trackContactClick, trackCtaClick } from "./lib/analytics/ga4";
import { loadPublishedSiteContent } from "./lib/contentApi";
import { isDraftPreviewRequest, loadDraftPreviewContent } from "./lib/draftPreview";

const fadeUp = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const detailPageRoutes = {
  "strony-cms": "webCms",
  "qa-automatyzacja": "qaAutomation",
  "automatyzacja-testowanie": "qaAutomation",
  "tester-istqb": "qaAutomation",
  gamedev: "gamedev",
};

const routeActiveAliases = {
  "automatyzacja-testowanie": "qa-automatyzacja",
  "tester-istqb": "qa-automatyzacja",
};

const homeRouteSlugs = new Set(["", "/"]);

const HOME_SECTIONS = [
  { id: "start", label: "Start" },
  { id: "projects", label: "Projekty" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Kontakt" },
];

const floatingNavItems = [
  { label: "Start", shortLabel: "Start", href: "#start", icon: "home" },
  { label: "Strony i CMS", shortLabel: "CMS", href: "#/strony-cms", icon: "monitor" },
  {
    label: "QA i automatyzacja",
    shortLabel: "QA",
    href: "#/qa-automatyzacja",
    icon: "shield-check",
  },
  { label: "GameDev", shortLabel: "Game", href: "#/gamedev", icon: "gamepad" },
  { label: "Projekty", shortLabel: "Projekty", href: "#projects", icon: "folder" },
  { label: "FAQ", shortLabel: "FAQ", href: "#faq", icon: "badge" },
  { label: "Kontakt", shortLabel: "Kontakt", href: "#contact", icon: "phone" },
];

const sectionAliases = {
  oferta: "oferta",
  realizacje: "projects",
  kontakt: "contact",
};

const sectionLabelsById = Object.fromEntries(
  HOME_SECTIONS.map((section) => [section.id, section.label]),
);

const routeLabelsBySlug = {
  "strony-cms": "Strony i CMS",
  "qa-automatyzacja": "QA",
  "automatyzacja-testowanie": "QA",
  "tester-istqb": "QA",
  gamedev: "GameDev",
};

function getRouteSlug(routeHash = "") {
  return String(routeHash || "")
    .replace(/^#\/?/, "")
    .replace(/^\/+|\/+$/g, "");
}

function isRouteHref(href = "") {
  return String(href).startsWith("#/");
}

function normalizeSectionId(sectionId = "") {
  const value = String(sectionId || "").trim();
  return sectionAliases[value] || value;
}

function getSectionIdFromHref(href = "") {
  const value = String(href || "");
  if (!value.startsWith("#") || isRouteHref(value)) return "";
  return normalizeSectionId(value.replace(/^#/, ""));
}

function getRouteSlugFromHref(href = "") {
  return isRouteHref(href) ? getRouteSlug(href) : "";
}

function isHomeRoute(routeSlug = "") {
  return homeRouteSlugs.has(routeSlug);
}

function getInitialActiveSectionId(routeSlug = "") {
  if (detailPageRoutes[routeSlug]) return "start";
  if (isHomeRoute(routeSlug)) return "start";
  return normalizeSectionId(routeSlug) || "start";
}

function getActiveSectionLabel({ routeSlug, activeSectionId }) {
  return routeLabelsBySlug[routeSlug] || sectionLabelsById[activeSectionId] || "Start";
}

function isNavItemActive(item, { routeSlug, activeSectionId }) {
  const itemRouteSlug = getRouteSlugFromHref(item.href);
  if (itemRouteSlug) {
    if (detailPageRoutes[routeSlug])
      return routeSlug === itemRouteSlug || routeActiveAliases[routeSlug] === itemRouteSlug;
    return routeSlug === itemRouteSlug;
  }

  const sectionId = getSectionIdFromHref(item.href);
  if (sectionId) {
    if (detailPageRoutes[routeSlug]) return false;
    return activeSectionId === sectionId;
  }

  return isHomeRoute(routeSlug) && activeSectionId === "start";
}

function getActiveHomeSectionId() {
  if (typeof window === "undefined" || typeof document === "undefined") return "start";

  const checkpoint = window.innerHeight * 0.35;
  let activeId = "start";
  let closestDistance = Number.POSITIVE_INFINITY;

  for (const section of HOME_SECTIONS) {
    const element = document.getElementById(section.id);
    if (!element) continue;

    const rect = element.getBoundingClientRect();
    const distance = Math.abs(rect.top - checkpoint);

    if (rect.top <= checkpoint) {
      activeId = section.id;
      closestDistance = distance;
      continue;
    }

    if (activeId === "start" && distance < closestDistance) {
      activeId = section.id;
      closestDistance = distance;
    }
  }

  return activeId;
}

function Icon({ name, className = "h-5 w-5" }) {
  const common = {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    "aria-hidden": "true",
  };

  switch (name) {
    case "arrow-right":
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="m13 5 7 7-7 7" />
        </svg>
      );
    case "badge":
      return (
        <svg {...common}>
          <path d="M8 2h8l2 4-6 4-6-4 2-4z" />
          <path d="M12 10v12" />
          <path d="m8 15-3 5 7-2 7 2-3-5" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      );
    case "chevron-down":
      return (
        <svg {...common}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      );
    case "external-link":
      return (
        <svg {...common}>
          <path d="M15 3h6v6" />
          <path d="M10 14 21 3" />
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        </svg>
      );
    case "folder":
      return (
        <svg {...common}>
          <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
        </svg>
      );
    case "gamepad":
      return (
        <svg {...common}>
          <path d="M6 12h4" />
          <path d="M8 10v4" />
          <path d="M15 13h.01" />
          <path d="M18 11h.01" />
          <path d="M7 8h10a5 5 0 0 1 4.8 6.4l-.7 2.3a2.2 2.2 0 0 1-3.7.9L15 15H9l-2.4 2.6a2.2 2.2 0 0 1-3.7-.9l-.7-2.3A5 5 0 0 1 7 8z" />
        </svg>
      );
    case "globe":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
    case "home":
      return (
        <svg {...common}>
          <path d="m3 11 9-8 9 8" />
          <path d="M5 10v10h14V10" />
          <path d="M9 20v-6h6v6" />
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      );
    case "menu":
      return (
        <svg {...common}>
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h16" />
        </svg>
      );
    case "x":
      return (
        <svg {...common}>
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      );
    case "monitor":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <path d="M8 20h8" />
          <path d="M12 16v4" />
        </svg>
      );
    case "palette":
      return (
        <svg {...common}>
          <path d="M12 3a9 9 0 0 0 0 18h1.5a1.5 1.5 0 0 0 0-3H12a2 2 0 0 1 0-4h3a6 6 0 0 0 0-12h-3z" />
          <circle cx="7.5" cy="10" r=".6" fill="currentColor" stroke="none" />
          <circle cx="10" cy="7" r=".6" fill="currentColor" stroke="none" />
          <circle cx="14" cy="7" r=".6" fill="currentColor" stroke="none" />
        </svg>
      );
    case "phone":
      return (
        <svg {...common}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.32 1.77.59 2.61a2 2 0 0 1-.45 2.11L8 9.69a16 16 0 0 0 6.31 6.31l1.25-1.25a2 2 0 0 1 2.11-.45c.84.27 1.71.47 2.61.59A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    case "shield-check":
      return (
        <svg {...common}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-5" />
        </svg>
      );
    case "sparkles":
      return (
        <svg {...common}>
          <path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
          <path d="m19 14 .8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14z" />
          <path d="m5 14 .8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
        </svg>
      );
  }
}

function runContentSelfTests(content) {
  const errors = [];
  if (content.services.items.length < 1)
    errors.push("services powinno zawierać przynajmniej 1 element");
  if (content.benefits.items.length < 4)
    errors.push("benefits powinno zawierać przynajmniej 4 elementy");
  if (content.process.items.length < 2) errors.push("process powinno mieć przynajmniej 2 kroki");
  if (!content.packages.items.some((pack) => pack.highlighted))
    errors.push("jeden pakiet powinien być wyróżniony");
  if (content.faq.items.length < 3) errors.push("FAQ powinno mieć przynajmniej 3 pytania");
  return errors;
}

function SectionTitle({ eyebrow, title, text }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      variants={stagger}
      className="mx-auto mb-12 max-w-3xl text-center"
    >
      <motion.p
        variants={fadeUp}
        className="mb-3 text-sm font-semibold uppercase tracking-[0.26em] text-cyan-300"
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        variants={fadeUp}
        className="text-3xl font-black tracking-tight text-white md:text-5xl"
      >
        {title}
      </motion.h2>
      {text && (
        <motion.p variants={fadeUp} className="mt-5 text-lg leading-8 text-slate-300">
          {text}
        </motion.p>
      )}
    </motion.div>
  );
}

function SectionDecor({ variant = "parallel", position = "right", className = "" }) {
  const positionClass =
    position === "left"
      ? "left-0 top-16 -translate-x-1/3"
      : position === "center"
        ? "left-1/2 top-10 -translate-x-1/2"
        : "right-0 top-16 translate-x-1/3";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute z-0 block opacity-28 sm:opacity-35 md:opacity-55 ${positionClass} ${className}`}
    >
      <AnimatedCircuit variant={variant} className="h-28 w-52 sm:h-32 sm:w-64 md:h-44 md:w-96" />
    </div>
  );
}

function NavLink({ item, active, variant = "desktop", onNavigate }) {
  const isFloating = variant === "floating";
  const isMobile = variant === "mobile";
  const baseClass =
    "min-w-0 rounded-full font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300";
  const stateClass = active
    ? isFloating
      ? "bg-gradient-to-r from-cyan-300 to-violet-300 px-3 py-2 text-slate-950 shadow-lg shadow-cyan-400/25 ring-1 ring-white/40"
      : "bg-cyan-300/15 px-3 py-2 text-cyan-100 ring-1 ring-cyan-300/35"
    : isFloating
      ? "px-3 py-2 text-slate-300 hover:bg-white/[0.08] hover:text-cyan-200"
      : isMobile
        ? "bg-white/5 px-4 py-3 text-slate-200 hover:bg-white/10 hover:text-cyan-200"
        : "px-3 py-2 text-slate-300 hover:bg-white/5 hover:text-cyan-300";

  return (
    <a
      href={item.href}
      onClick={(event) => onNavigate(event, item.href)}
      aria-label={isFloating ? item.label : undefined}
      aria-current={active ? "page" : undefined}
      className={`${baseClass} ${stateClass} ${isFloating ? "text-xs sm:text-sm" : ""}`}
    >
      <span className="block min-w-0 break-words">
        {isFloating && item.shortLabel ? item.shortLabel : item.label}
      </span>
    </a>
  );
}

function Header({ settings, hero, routeSlug, activeSectionId, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [routeSlug]);

  return (
    <header className="relative z-40 border-b border-white/10 bg-[#050816]/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 md:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-cyan-400/40 bg-slate-950/70 shadow-lg shadow-blue-500/20">
            <Icon name="globe" className="h-5 w-5 text-cyan-300" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-wide text-white">{settings.siteName}</p>
            <p className="text-xs text-cyan-200/70">{settings.tagline}</p>
          </div>
        </div>
        <nav aria-label="Główna nawigacja" className="hidden items-center gap-1 text-sm lg:flex">
          {settings.navItems.map((item) => (
            <NavLink
              key={`${item.label}-${item.href}`}
              item={item}
              active={isNavItemActive(item, { routeSlug, activeSectionId })}
              onNavigate={onNavigate}
            />
          ))}
        </nav>
        <a
          href={hero.primaryCta.href}
          onClick={(event) => {
            trackCtaClick(hero.primaryCta.label, "header");
            onNavigate(event, hero.primaryCta.href);
          }}
          className="hidden rounded-full gradient-button px-5 py-2.5 text-sm font-semibold shadow-lg shadow-blue-500/25 transition hover:scale-105 lg:inline-flex"
        >
          {hero.primaryCta.label}
        </a>
        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="rounded-lg border border-white/10 bg-white/5 p-3 text-white transition-all lg:hidden"
          aria-label={isOpen ? "Zamknij menu" : "Otwórz menu"}
          aria-expanded={isOpen}
        >
          <Icon name={isOpen ? "x" : "menu"} className="h-5 w-5" />
        </button>
      </div>
      {isOpen && (
        <div className="border-t border-white/10 bg-[#050816]/95 px-6 py-4 lg:hidden">
          <nav aria-label="Menu mobilne" className="flex flex-col gap-3 text-sm text-slate-200">
            {settings.navItems.map((item) => (
              <NavLink
                key={`${item.label}-${item.href}`}
                item={item}
                active={isNavItemActive(item, { routeSlug, activeSectionId })}
                variant="mobile"
                onNavigate={(event, href) => {
                  onNavigate(event, href);
                  setIsOpen(false);
                }}
              />
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

function FloatingNavIconLink({ item, active, onNavigate }) {
  return (
    <a
      href={item.href}
      onClick={(event) => onNavigate(event, item.href)}
      aria-label={item.label}
      aria-current={active ? "page" : undefined}
      title={item.label}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-current transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 ${
        active
          ? "border-cyan-200/70 bg-gradient-to-br from-cyan-300 to-violet-300 text-slate-950 shadow-lg shadow-cyan-400/30"
          : "border-white/10 bg-white/[0.06] text-slate-300 hover:border-cyan-300/35 hover:bg-white/[0.1] hover:text-cyan-100"
      }`}
    >
      <Icon name={item.icon} className="h-5 w-5" />
    </a>
  );
}

function FloatingSectionNav({ items, activeSectionId, routeSlug, visible, onNavigate }) {
  const activeLabel = getActiveSectionLabel({ routeSlug, activeSectionId });

  return (
    <div
      className={`fixed left-1/2 top-3 z-[60] w-fit max-w-[calc(100vw-1rem)] -translate-x-1/2 transition duration-300 sm:max-w-[calc(100vw-2rem)] ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-5 opacity-0"
      }`}
    >
      <div className="max-w-full overflow-hidden rounded-2xl border border-cyan-300/20 bg-slate-950/75 px-2.5 py-2 shadow-[0_0_30px_rgba(34,211,238,0.12)] backdrop-blur-2xl ring-1 ring-violet-300/10 sm:px-3">
        <div className="flex min-w-0 flex-col gap-2 lg:flex-row lg:items-center">
          <div className="inline-flex max-w-full flex-none items-center justify-center gap-2 self-center rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold text-cyan-100">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
            <span className="min-w-0 truncate">Aktualnie: {activeLabel}</span>
          </div>
          <div className="flex w-full max-w-full min-w-0 items-center justify-start gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] min-[390px]:justify-center sm:hidden [&::-webkit-scrollbar]:hidden">
            {items.map((item) => (
              <FloatingNavIconLink
                key={`${item.label}-${item.href}`}
                item={item}
                active={isNavItemActive(item, { routeSlug, activeSectionId })}
                onNavigate={onNavigate}
              />
            ))}
          </div>
          <nav
            aria-label="Pływająca nawigacja sekcji"
            className="hidden min-w-0 justify-center gap-1 overflow-x-auto pb-1 text-sm [scrollbar-width:none] sm:flex lg:flex-wrap lg:pb-0"
          >
            {items.map((item) => (
              <NavLink
                key={`${item.label}-${item.href}`}
                item={item}
                active={isNavItemActive(item, { routeSlug, activeSectionId })}
                variant="floating"
                onNavigate={onNavigate}
              />
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}

function CtaLink({ href, label, location, variant = "primary", onNavigate }) {
  const isPrimary = variant === "primary";

  return (
    <a
      className={`inline-flex min-w-0 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition ${
        isPrimary
          ? "gradient-button text-white shadow-xl shadow-blue-500/25 hover:scale-105"
          : "border border-white/15 bg-white/5 text-slate-100 hover:border-cyan-300/50 hover:bg-white/10"
      }`}
      href={href}
      onClick={(event) => {
        trackCtaClick(label, location);
        if (onNavigate) onNavigate(event, href);
      }}
    >
      <span className="min-w-0 break-words">{label}</span>
      <Icon name="arrow-right" className="h-4 w-4 flex-none" />
    </a>
  );
}

function NetworkMonitorLogo() {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className="relative mx-auto w-full max-w-[540px] rounded-lg border border-cyan-400/35 bg-slate-950/65 p-4 shadow-2xl shadow-blue-500/20 backdrop-blur"
    >
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-400/15 via-transparent to-violet-500/15" />
      <div className="relative aspect-[16/10] rounded-lg border-2 border-transparent bg-slate-950 p-7 [background:linear-gradient(#050816,#050816)_padding-box,linear-gradient(135deg,#1d9bff,#9a4dff)_border-box]">
        <svg
          viewBox="0 0 420 250"
          className="h-full w-full overflow-visible"
          role="img"
          aria-label="Animowane logo monitora z globem sieciowym"
        >
          <defs>
            <linearGradient id="globeGradient" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#28b8ff" />
              <stop offset="55%" stopColor="#4f6bff" />
              <stop offset="100%" stopColor="#b245ff" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <motion.ellipse
            cx="210"
            cy="124"
            rx="146"
            ry="48"
            fill="none"
            stroke="url(#globeGradient)"
            strokeWidth="9"
            strokeLinecap="round"
            filter="url(#glow)"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "210px 124px" }}
          />
          <motion.g
            animate={{ rotate: [0, -360] }}
            transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "210px 124px" }}
          >
            <circle
              cx="210"
              cy="124"
              r="90"
              fill="none"
              stroke="url(#globeGradient)"
              strokeWidth="4"
            />
            <ellipse
              cx="210"
              cy="124"
              rx="38"
              ry="90"
              fill="none"
              stroke="url(#globeGradient)"
              strokeWidth="2"
              opacity="0.9"
            />
            <ellipse
              cx="210"
              cy="124"
              rx="72"
              ry="90"
              fill="none"
              stroke="url(#globeGradient)"
              strokeWidth="2"
              opacity="0.65"
            />
            <path d="M120 124H300" stroke="url(#globeGradient)" strokeWidth="2" opacity="0.9" />
            <path
              d="M132 82C180 102 240 102 288 82"
              stroke="url(#globeGradient)"
              strokeWidth="2"
              opacity="0.65"
            />
            <path
              d="M132 166C180 146 240 146 288 166"
              stroke="url(#globeGradient)"
              strokeWidth="2"
              opacity="0.65"
            />
            {[
              [120, 124, 8],
              [150, 88, 6],
              [168, 158, 7],
              [210, 124, 7],
              [274, 92, 7],
              [284, 154, 6],
              [302, 124, 5],
            ].map(([cx, cy, r], index) => (
              <motion.circle
                key={index}
                cx={cx}
                cy={cy}
                r={r}
                fill="url(#globeGradient)"
                filter="url(#glow)"
                animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2.2, repeat: Infinity, delay: index * 0.18 }}
              />
            ))}
          </motion.g>
        </svg>
      </div>
      <div
        className="mx-auto h-8 w-24 bg-gradient-to-r from-blue-500 to-violet-500"
        style={{ clipPath: "polygon(25% 0, 75% 0, 92% 100%, 8% 100%)" }}
      />
      <div className="mx-auto h-3 w-44 rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
    </motion.div>
  );
}

function Hero({ hero, onNavigate }) {
  return (
    <section
      id="start"
      className="relative overflow-x-hidden px-6 pb-16 pt-12 md:min-h-[calc(100vh-80px)] md:px-10 md:pb-20 md:pt-16 md:flex md:items-center scroll-mt-24"
    >
      <div className="pointer-events-none absolute left-4 top-6 z-0 md:left-12 md:top-10">
        <div className="block md:hidden">
          <AnimatedCircuit variant="mini" className="h-24 w-40 opacity-35" />
        </div>
        <div className="hidden md:block">
          <AnimatedCircuit variant="stair" className="h-40 w-64 opacity-65" />
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-6 right-4 z-0 md:bottom-10 md:right-12">
        <div className="block md:hidden">
          <AnimatedCircuit variant="mini" flip className="h-20 w-36 opacity-30" />
        </div>
        <div className="hidden md:block">
          <AnimatedCircuit variant="branch" flip className="h-44 w-72 opacity-55" />
        </div>
      </div>
      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 md:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-white/5 px-4 py-2 text-sm text-cyan-100 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.9)]" />
            {hero.eyebrow}
          </div>
          <h1 className="max-w-4xl text-4xl font-black leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            {hero.title} <span className="gradient-text">{hero.highlightedTitle}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
            {hero.description}
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <a
              className="inline-flex items-center justify-center gap-2 rounded-full gradient-button px-7 py-4 text-sm font-bold shadow-xl shadow-blue-500/25 transition hover:scale-105"
              href={hero.primaryCta.href}
              onClick={(event) => {
                trackCtaClick(hero.primaryCta.label, "hero");
                onNavigate(event, hero.primaryCta.href);
              }}
            >
              {hero.primaryCta.label} <Icon name="arrow-right" className="h-4 w-4" />
            </a>
            <a
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-4 text-sm font-semibold text-slate-100 backdrop-blur transition hover:border-cyan-300/50 hover:bg-white/10"
              href={hero.secondaryCta.href}
              onClick={(event) => {
                trackCtaClick(hero.secondaryCta.label, "hero_secondary");
                onNavigate(event, hero.secondaryCta.href);
              }}
            >
              {hero.secondaryCta.label}
            </a>
          </div>
          <div className="mt-10 grid max-w-xl gap-3 sm:grid-cols-3">
            {hero.stats.map((stat) => (
              <div
                key={`${stat.value}-${stat.label}`}
                className="rounded-lg border border-white/10 bg-white/[0.045] p-4 text-center sm:text-left"
              >
                <p className="text-2xl font-black text-cyan-200">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <NetworkMonitorLogo />
        </div>
      </div>
    </section>
  );
}

function ServicesSection({ services }) {
  return (
    <section
      id="oferta"
      className="relative overflow-hidden px-6 py-20 md:px-10 lg:py-24 scroll-mt-24"
    >
      <div className="pointer-events-none absolute right-2 top-8 z-0 hidden opacity-55 md:block">
        <AnimatedCircuit variant="longDrop" className="h-28 w-80" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionTitle eyebrow={services.eyebrow} title={services.title} text={services.text} />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="grid gap-5 md:grid-cols-3"
        >
          {services.items.map((service) => (
            <motion.div
              key={service.title}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="group rounded-lg border border-white/10 bg-white/[0.045] p-7 text-center backdrop-blur transition hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-white/[0.07] hover:shadow-2xl hover:shadow-cyan-500/10 sm:text-left"
            >
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/25 to-violet-500/25 text-cyan-200 ring-1 ring-white/10 transition group-hover:scale-110 sm:mx-0">
                <Icon name={service.icon} className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">{service.title}</h3>
              <p className="mt-3 leading-7 text-slate-400">{service.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FeatureCardsSection({ section, id, cardCountClass = "md:grid-cols-3" }) {
  return (
    <section
      id={id}
      className="relative overflow-hidden px-4 py-20 sm:px-6 md:px-10 lg:py-24 scroll-mt-24"
    >
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="grid min-w-0 gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
          <div className="min-w-0 text-center sm:text-left">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.26em] text-cyan-300">
              {section.eyebrow}
            </p>
            <h2 className="break-words text-3xl font-black tracking-tight text-white md:text-5xl">
              {section.title}
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">{section.text}</p>
            {section.certificateNote && (
              <div className="mt-6 rounded-lg border border-emerald-300/25 bg-emerald-400/10 p-4 text-sm font-semibold text-emerald-100">
                {section.certificateNote}
              </div>
            )}
            <div className="mt-8 flex min-w-0 flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:items-start">
              <CtaLink href={section.ctaHref} label={section.ctaLabel} location={id} />
              {section.secondaryCtaLabel && section.secondaryCtaHref && (
                <CtaLink
                  href={section.secondaryCtaHref}
                  label={section.secondaryCtaLabel}
                  location={`${id}_secondary`}
                  variant="secondary"
                />
              )}
            </div>
          </div>
          <div className={`grid min-w-0 gap-5 ${cardCountClass}`}>
            {section.cards.map((card) => (
              <article
                key={card.title}
                className="min-w-0 rounded-lg border border-white/10 bg-white/[0.045] p-6 text-center backdrop-blur transition hover:-translate-y-1 hover:border-cyan-300/35 hover:shadow-2xl hover:shadow-cyan-500/10 sm:text-left"
              >
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/25 to-violet-500/25 text-cyan-200 ring-1 ring-white/10 sm:mx-0">
                  <Icon name={card.icon} className="h-5 w-5" />
                </div>
                <h3 className="break-words text-xl font-bold text-white">{card.title}</h3>
                <p className="mt-3 break-words leading-7 text-slate-400">{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AreasSection({ services, automationQa, gamedevTeaser }) {
  const areas = [
    {
      icon: "monitor",
      eyebrow: "Główna oferta",
      title: "Strony i CMS",
      text: "Strony internetowe, wizytówki online i lekki panel do edycji najważniejszych treści.",
      href: "#/strony-cms",
      cta: "Zobacz ofertę CMS",
      tone: "from-cyan-400/20 to-blue-500/15",
      points: services.items.slice(0, 3).map((item) => item.title),
    },
    {
      icon: "shield-check",
      eyebrow: "Dodatkowa kompetencja",
      title: "QA i automatyzacja",
      text: automationQa.text,
      href: "#/qa-automatyzacja",
      cta: "Zobacz QA",
      tone: "from-blue-400/20 to-indigo-500/15",
      points: ["ISTQB", "testy stron", "raportowanie błędów"],
    },
    {
      icon: "gamepad",
      eyebrow: "Projekty interaktywne",
      title: "GameDev",
      text: gamedevTeaser.text,
      href: "#/gamedev",
      cta: "Zobacz GameDev",
      tone: "from-violet-400/20 to-fuchsia-500/15",
      points: ["prototypy", "logika", "interakcje"],
    },
  ];

  return (
    <section
      id="areas"
      className="relative overflow-hidden px-4 py-20 sm:px-6 md:px-10 lg:py-24 scroll-mt-24"
    >
      <SectionDecor variant="parallel" position="right" className="top-24 opacity-30" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionTitle
          eyebrow="Obszary pracy"
          title="Główna oferta jest webowa, a dodatkowe kompetencje rozwijają temat"
          text="Możesz zacząć od strony internetowej z panelem CMS, a dodatkowo skorzystać z mojego podejścia do jakości, testowania i projektów interaktywnych."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {areas.map((area) => (
            <a
              key={area.title}
              href={area.href}
              aria-label={`${area.cta}: ${area.title}`}
              className={`group block min-w-0 rounded-lg border border-white/10 bg-gradient-to-br ${area.tone} p-6 text-center backdrop-blur transition hover:-translate-y-1 hover:border-cyan-300/35 hover:shadow-2xl hover:shadow-cyan-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 sm:text-left`}
            >
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-slate-950/55 text-cyan-200 sm:mx-0">
                <Icon name={area.icon} className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
                {area.eyebrow}
              </p>
              <h3 className="mt-3 text-2xl font-black text-white">{area.title}</h3>
              <p className="mt-3 min-w-0 break-words leading-7 text-slate-300">{area.text}</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2 sm:justify-start">
                {area.points.map((point) => (
                  <span
                    key={`${area.title}-${point}`}
                    className="rounded-full bg-slate-950/45 px-3 py-1 text-xs font-semibold text-cyan-100 ring-1 ring-white/10"
                  >
                    {point}
                  </span>
                ))}
              </div>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition group-hover:text-cyan-100">
                {area.cta}
                <Icon name="arrow-right" className="h-4 w-4" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitsSection({ benefits }) {
  return (
    <section
      id="korzysci"
      className="relative overflow-hidden px-6 py-20 md:px-10 lg:py-24 scroll-mt-24"
    >
      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 rounded-lg border border-white/10 bg-white/[0.045] p-7 text-center backdrop-blur sm:text-left md:grid-cols-[0.85fr_1.15fr] md:p-10 card">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.26em] text-cyan-300">
            {benefits.eyebrow}
          </p>
          <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">
            {benefits.title}
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">{benefits.text}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {benefits.items.map((item) => (
            <div
              key={item}
              className="flex flex-col items-center gap-3 rounded-lg border border-white/10 bg-slate-950/35 p-4 text-center sm:flex-row sm:items-start sm:text-left"
            >
              <div className="mt-1 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-violet-500">
                <Icon name="check" className="h-3.5 w-3.5 text-white" />
              </div>
              <p className="text-slate-200">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessSection({ process }) {
  return (
    <section
      id="proces"
      className="relative overflow-hidden px-6 py-20 md:px-10 lg:py-24 scroll-mt-24"
    >
      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionTitle eyebrow={process.eyebrow} title={process.title} text={process.text} />
        <div className="relative mx-auto max-w-4xl">
          <div className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-blue-500 via-violet-500 to-transparent md:block" />
          <div className="space-y-5">
            {process.items.map((item) => (
              <div
                key={item.step}
                className="relative rounded-lg border border-white/10 bg-white/[0.045] p-6 text-center backdrop-blur transition hover:border-violet-300/35 hover:shadow-2xl hover:shadow-violet-500/10 sm:text-left md:ml-16"
              >
                <div className="absolute -left-[4.55rem] top-6 hidden h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-violet-500 text-sm font-black text-white shadow-lg shadow-blue-500/30 md:flex">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="mt-2 leading-7 text-slate-400">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const portfolioMockupTones = {
  cyan: {
    frame: "from-cyan-400/30 via-blue-500/15 to-slate-950",
    accent: "from-cyan-300 to-blue-400",
    glow: "shadow-cyan-500/10",
  },
  violet: {
    frame: "from-violet-400/30 via-fuchsia-500/15 to-slate-950",
    accent: "from-violet-300 to-fuchsia-400",
    glow: "shadow-violet-500/10",
  },
  blue: {
    frame: "from-blue-400/30 via-indigo-500/15 to-slate-950",
    accent: "from-blue-300 to-indigo-400",
    glow: "shadow-blue-500/10",
  },
  emerald: {
    frame: "from-emerald-400/30 via-cyan-500/15 to-slate-950",
    accent: "from-emerald-300 to-cyan-400",
    glow: "shadow-emerald-500/10",
  },
};

function getPortfolioStatusLabel(status) {
  if (status === "projekt wlasny") return "projekt własny";
  return status || "projekt koncepcyjny";
}

function PortfolioMockup({ item }) {
  const tone = portfolioMockupTones[item.mockupTone] || portfolioMockupTones.cyan;

  if (item.screenshotUrl) {
    return (
      <img
        src={item.screenshotUrl}
        alt={`Podgląd projektu: ${item.title}`}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    );
  }

  return (
    <div
      className={`relative h-full overflow-hidden bg-gradient-to-br ${tone.frame} shadow-2xl ${tone.glow}`}
    >
      <div className="absolute left-4 right-4 top-4 flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-950/70 p-2">
        <span className="h-2 w-2 rounded-full bg-red-300/80" />
        <span className="h-2 w-2 rounded-full bg-amber-300/80" />
        <span className="h-2 w-2 rounded-full bg-emerald-300/80" />
        <span className="ml-2 h-2 min-w-0 flex-1 rounded-full bg-white/10" />
      </div>
      <div className="absolute inset-x-4 bottom-4 top-16 rounded-lg border border-white/10 bg-slate-950/60 p-4 backdrop-blur">
        <div className={`mb-4 h-2 w-24 rounded-full bg-gradient-to-r ${tone.accent}`} />
        <div className="grid h-[calc(100%-1.5rem)] min-h-0 gap-3">
          <div className="rounded-lg border border-white/10 bg-white/10 p-3">
            <div className="h-2 w-3/4 rounded-full bg-white/30" />
            <div className="mt-2 h-2 w-1/2 rounded-full bg-white/15" />
          </div>
          <div className="grid min-h-0 grid-cols-3 gap-2">
            <div className="rounded-lg bg-white/10" />
            <div className="rounded-lg bg-white/10" />
            <div className="rounded-lg bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

function PortfolioSection({ portfolio }) {
  return (
    <section
      id="realizacje"
      className="relative overflow-hidden px-4 py-20 sm:px-6 md:px-10 lg:py-24 scroll-mt-24"
    >
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <SectionTitle eyebrow={portfolio.eyebrow} title={portfolio.title} text={portfolio.text} />
        <div className="grid min-w-0 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {portfolio.items.map((item, index) => (
            <article
              key={item.title}
              className="group flex min-w-0 flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[0.045] backdrop-blur transition hover:-translate-y-1 hover:border-cyan-300/35 hover:shadow-2xl hover:shadow-cyan-500/10"
            >
              <div className="relative aspect-[16/10] min-w-0 overflow-hidden bg-slate-950">
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                    aria-label={`Otwórz projekt: ${item.title}`}
                    className="block h-full w-full"
                  >
                    <PortfolioMockup item={item} />
                  </a>
                ) : (
                  <PortfolioMockup item={item} />
                )}
                <span className="absolute left-4 top-4 rounded-full border border-cyan-300/30 bg-slate-950/75 px-3 py-1 text-xs font-semibold text-cyan-100 backdrop-blur">
                  Projekt 0{index + 1}
                </span>
                {item.href && (
                  <span className="pointer-events-none absolute bottom-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-slate-950/75 text-cyan-200 opacity-0 backdrop-blur transition group-hover:opacity-100">
                    <Icon name="external-link" className="h-4 w-4" />
                  </span>
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col p-5 text-center sm:p-6 sm:text-left">
                <div className="mb-4 flex min-w-0 flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <span className="max-w-full rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
                    {item.type || "Projekt"}
                  </span>
                  {item.category && (
                    <span className="max-w-full rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                      {item.category}
                    </span>
                  )}
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.status === "realizacja"
                        ? "border border-emerald-300/25 bg-emerald-400/10 text-emerald-100"
                        : "border border-violet-300/25 bg-violet-400/10 text-violet-100"
                    }`}
                  >
                    {getPortfolioStatusLabel(item.status)}
                  </span>
                </div>
                <h3 className="min-w-0 whitespace-pre-line break-words text-xl font-bold text-white">
                  {item.title}
                </h3>
                <p className="mt-3 min-w-0 flex-1 break-words leading-7 text-slate-400">
                  {item.text}
                </p>
                {item.details && (
                  <div className="mt-4 rounded-lg border border-white/10 bg-slate-950/45 p-3 text-sm leading-6 text-slate-300">
                    <span className="font-semibold text-cyan-200">Co zrobiłem: </span>
                    {item.details}
                  </div>
                )}
                {item.tags?.length > 0 && (
                  <div className="mt-5 flex min-w-0 flex-wrap justify-center gap-2 sm:justify-start">
                    {item.tags.map((tag) => (
                      <span
                        key={`${item.title}-${tag}`}
                        className="max-w-full break-words rounded-full bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100 ring-1 ring-cyan-300/15"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {item.href && (
                  <a
                    className="mt-6 inline-flex min-w-0 items-center gap-2 self-center break-words text-sm font-semibold text-cyan-300 hover:text-cyan-200 sm:self-start"
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  >
                    <span className="min-w-0">{item.linkLabel || "Zobacz projekt"}</span>
                    <Icon name="external-link" className="h-4 w-4 flex-none" />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PackagesSection({ packages }) {
  return (
    <section
      id="pakiety"
      className="relative overflow-hidden px-6 py-20 md:px-10 lg:py-24 scroll-mt-24"
    >
      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionTitle eyebrow={packages.eyebrow} title={packages.title} text={packages.text} />
        <div className="grid gap-5 md:grid-cols-3">
          {packages.items.map((pack) => (
            <div
              key={pack.name}
              className={`relative rounded-lg border p-7 text-center backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl sm:text-left ${pack.highlighted ? "border-cyan-300/40 bg-gradient-to-br from-blue-500/18 to-violet-500/18 shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/15" : "border-white/10 bg-white/[0.045] hover:border-violet-300/35 hover:shadow-violet-500/10"}`}
            >
              {pack.highlighted && (
                <div className="absolute -top-4 left-7 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-1.5 text-xs font-bold text-white">
                  Najczęściej wybierane
                </div>
              )}
              <h3 className="text-2xl font-black text-white">{pack.name}</h3>
              <p className="mt-3 leading-7 text-slate-400">{pack.desc}</p>
              <div className="mt-6 space-y-3">
                {pack.points.map((point) => (
                  <div
                    key={point}
                    className="flex items-center justify-center gap-3 text-slate-200 sm:justify-start"
                  >
                    <Icon name="check" className="h-4 w-4 text-cyan-300" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection({ faq }) {
  const [open, setOpen] = useState(0);
  return (
    <section
      id="faq"
      className="relative overflow-hidden px-6 py-20 md:px-10 lg:py-24 scroll-mt-24"
    >
      <div className="relative z-10 mx-auto max-w-4xl">
        <SectionTitle eyebrow={faq.eyebrow} title={faq.title} text={faq.text} />
        <div className="space-y-4">
          {faq.items.map((item, index) => (
            <div
              key={item.question}
              className="rounded-lg border border-white/10 bg-white/[0.045] backdrop-blur"
            >
              <button
                type="button"
                onClick={() => setOpen(open === index ? -1 : index)}
                className="flex w-full items-center justify-between gap-4 p-6 text-center sm:text-left"
              >
                <span className="flex-1 font-bold text-white">{item.question}</span>
                <Icon
                  name="chevron-down"
                  className={`h-5 w-5 text-cyan-300 transition ${open === index ? "rotate-180" : ""}`}
                />
              </button>
              <div className={`${open === index ? "block" : "hidden"}`}>
                <p className="px-6 pb-6 text-center leading-7 text-slate-400 sm:text-left">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection({ contact }) {
  const contactActions = [
    contact.email
      ? {
          className:
            "inline-flex w-full min-w-0 items-center justify-center gap-2 rounded-full gradient-button px-5 py-4 text-center text-sm font-bold shadow-xl shadow-blue-500/25 transition hover:scale-105 sm:w-auto sm:px-7",
          href: `mailto:${contact.email}`,
          icon: "mail",
          label: contact.emailButtonLabel,
          type: "email",
        }
      : null,
    contact.phone
      ? {
          className:
            "inline-flex w-full min-w-0 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-4 text-center text-sm font-semibold text-slate-100 backdrop-blur transition hover:border-cyan-300/50 hover:bg-white/10 sm:w-auto sm:px-7",
          href: `tel:${contact.phone.replace(/\s/g, "")}`,
          icon: "phone",
          label: contact.phoneButtonLabel,
          type: "phone",
        }
      : null,
  ].filter(Boolean);

  const contactRows = [
    contact.phone
      ? ["phone", "Telefon", contact.phone, `tel:${contact.phone.replace(/\s/g, "")}`, "phone"]
      : null,
    contact.email ? ["mail", "E-mail", contact.email, `mailto:${contact.email}`, "email"] : null,
    contact.www ? ["globe", "WWW", contact.www, null, null] : null,
  ].filter(Boolean);

  return (
    <section
      id="contact"
      className="relative overflow-hidden px-4 py-20 sm:px-6 md:px-10 lg:pb-24 lg:pt-20 scroll-mt-24"
    >
      <SectionDecor variant="branch" position="right" className="top-10 opacity-35" />
      <SectionDecor variant="mini" position="left" className="top-[58%] opacity-30" />
      <div className="relative z-10 mx-auto w-full max-w-7xl overflow-hidden rounded-lg border border-white/10 bg-white/[0.045] p-5 text-center backdrop-blur sm:p-7 sm:text-left md:p-10">
        <div className="grid min-w-0 gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] md:items-center">
          <div className="min-w-0">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.26em] text-cyan-300">
              {contact.eyebrow}
            </p>
            <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">
              {contact.title}
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">{contact.text}</p>
            <div className="mt-8 flex min-w-0 flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:items-start">
              {contactActions.map((action) => (
                <a
                  key={action.type}
                  className={action.className}
                  href={action.href}
                  onClick={() => trackContactClick(action.type, "contact_cta")}
                >
                  <span className="min-w-0 break-words">{action.label}</span>
                  <Icon name={action.icon} className="h-4 w-4 flex-none" />
                </a>
              ))}
            </div>
          </div>
          <div className="w-full min-w-0 rounded-lg border border-cyan-300/20 bg-slate-950/55 p-4 shadow-2xl shadow-blue-500/10 sm:p-6">
            {contactRows.map(([icon, label, value, href, contactType]) => (
              <div
                key={label}
                className="mb-5 flex min-w-0 flex-col items-center gap-3 text-center last:mb-0 sm:flex-row sm:items-start sm:text-left"
              >
                <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg border border-cyan-300/30 bg-white/5 text-cyan-200 sm:h-12 sm:w-12">
                  <Icon name={icon} className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-slate-400">{label}</p>
                  {href ? (
                    <a
                      className="break-words font-semibold text-white [overflow-wrap:anywhere] hover:text-cyan-200"
                      href={href}
                      onClick={() => trackContactClick(contactType, "contact_card")}
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="break-words font-semibold text-white [overflow-wrap:anywhere]">
                      {value}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PageHero({ page, onNavigate }) {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-12 sm:px-6 md:px-10 md:pb-20 md:pt-16">
      <div className="pointer-events-none absolute right-4 top-8 opacity-40 md:right-12">
        <AnimatedCircuit variant="branch" flip className="h-36 w-64" />
      </div>
      <div className="relative z-10 mx-auto max-w-5xl">
        <a
          href="#"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-cyan-100 hover:bg-white/10"
        >
          <Icon name="arrow-right" className="h-4 w-4 rotate-180" />
          Strona główna
        </a>
        <p className="text-sm font-semibold uppercase tracking-[0.26em] text-cyan-300">
          {page.hero.eyebrow}
        </p>
        <h1 className="mt-4 max-w-4xl break-words text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
          {page.hero.title}
        </h1>
        {page.hero.subtitle && (
          <p className="mt-4 text-xl font-semibold text-cyan-100">{page.hero.subtitle}</p>
        )}
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">
          {page.hero.description}
        </p>
        <div className="mt-8">
          <CtaLink
            href={page.hero.ctaHref}
            label={page.hero.ctaLabel}
            location={page.slug}
            onNavigate={onNavigate}
          />
        </div>
      </div>
    </section>
  );
}

function PageMediaGallery({ mediaItems = [] }) {
  if (!mediaItems.length) return null;

  return (
    <div className="mt-8 grid min-w-0 gap-4 md:grid-cols-3">
      {mediaItems.map((item) => (
        <article
          key={item.src}
          className="min-w-0 overflow-hidden rounded-lg border border-white/10 bg-slate-950/45 text-center"
        >
          <div className="flex aspect-[16/10] items-center justify-center overflow-hidden bg-slate-950">
            <img
              src={item.src}
              alt={item.alt}
              className="h-full w-full object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="p-4">
            <h3 className="break-words text-lg font-bold text-white">{item.title}</h3>
            {item.description && (
              <p className="mt-2 break-words text-sm leading-6 text-slate-300">
                {item.description}
              </p>
            )}
            {item.tags?.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={`${item.src}-${tag}`}
                    className="rounded-full bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100 ring-1 ring-cyan-300/15"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {item.demoSrc && (
              <a
                href={item.demoSrc}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-200/50 hover:bg-cyan-300/15"
              >
                {item.demoLabel || "Zobacz animację"}
                <Icon name="external-link" className="h-4 w-4" />
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

function PageSectionList({ sectionKey, section, onNavigate }) {
  const isCta = Boolean(section.ctaLabel);

  return (
    <section id={sectionKey} className="px-4 py-10 scroll-mt-28 sm:px-6 md:px-10">
      <div
        className={`mx-auto max-w-6xl rounded-lg border border-white/10 p-6 text-center backdrop-blur sm:text-left md:p-8 ${
          isCta ? "bg-cyan-400/10" : "bg-white/[0.045]"
        }`}
      >
        <div className="grid min-w-0 gap-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className="min-w-0">
            <h2 className="break-words text-2xl font-black text-white md:text-3xl">
              {section.title}
            </h2>
            {section.description && (
              <p className="mt-4 break-words leading-7 text-slate-300">{section.description}</p>
            )}
            {isCta && (
              <div className="mt-6 flex justify-center sm:justify-start">
                <CtaLink
                  href={section.ctaHref}
                  label={section.ctaLabel}
                  location="page_final"
                  onNavigate={onNavigate}
                />
              </div>
            )}
          </div>
          {!isCta && (
            <div className="grid min-w-0 gap-3 sm:grid-cols-2">
              {section.items.map((item) => (
                <div
                  key={item}
                  className="flex min-w-0 flex-col items-center gap-3 rounded-lg border border-white/10 bg-slate-950/40 p-4 text-center sm:flex-row sm:items-start sm:text-left"
                >
                  <div className="mt-1 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-violet-500">
                    <Icon name="check" className="h-3.5 w-3.5 text-white" />
                  </div>
                  <p className="min-w-0 break-words text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <PageMediaGallery mediaItems={section.mediaItems} />
      </div>
    </section>
  );
}

function ServiceDetailPage({ page, contact, onNavigate }) {
  return (
    <>
      <PageHero page={page} onNavigate={onNavigate} />
      {Object.entries(page.sections).map(([key, section]) => (
        <PageSectionList key={key} sectionKey={key} section={section} onNavigate={onNavigate} />
      ))}
      <ContactSection contact={contact} />
    </>
  );
}

export default function LandingPage({ routeHash = "" }) {
  const draftPreview = useMemo(() => {
    if (typeof window === "undefined" || !isDraftPreviewRequest(window.location.search)) {
      return null;
    }

    return loadDraftPreviewContent();
  }, []);
  const [content, setContent] = useState(() => draftPreview?.content || defaultSiteContent);
  const [cmsWarning, setCmsWarning] = useState("");
  const [activeSectionId, setActiveSectionId] = useState("start");
  const [isFloatingNavVisible, setIsFloatingNavVisible] = useState(false);
  const selfTestErrors = useMemo(() => runContentSelfTests(content), [content]);

  useEffect(() => {
    if (draftPreview?.content) {
      setCmsWarning(
        "Podgląd draftu CMS. Ta wersja jest widoczna tylko lokalnie w tej przeglądarce.",
      );
      return undefined;
    }

    let cancelled = false;
    loadPublishedSiteContent().then((result) => {
      if (cancelled) return;
      setContent(result.content);
      setCmsWarning(
        result.usedFallback
          ? "CMS jest niedostępny lub nieskonfigurowany. Strona używa treści domyślnej."
          : "",
      );
    });
    return () => {
      cancelled = true;
    };
  }, [draftPreview]);

  const routeSlug = getRouteSlug(routeHash);
  const pageKey = detailPageRoutes[routeSlug];
  const activePage = pageKey ? content.pages?.[pageKey] : null;

  useEffect(() => {
    setActiveSectionId(getInitialActiveSectionId(routeSlug));
  }, [routeSlug]);

  useEffect(() => {
    let frame = 0;

    const updateNavigationState = () => {
      frame = 0;
      setIsFloatingNavVisible(window.scrollY > 160);
      if (!activePage) setActiveSectionId(getActiveHomeSectionId());
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateNavigationState);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [activePage, routeSlug]);

  useEffect(() => {
    if (activePage) {
      const frame = window.requestAnimationFrame(() => {
        if (routeSlug === "tester-istqb") {
          document.getElementById("istqbCertificate")?.scrollIntoView({ block: "start" });
          return;
        }
        window.scrollTo({ top: 0 });
      });

      return () => window.cancelAnimationFrame(frame);
    }

    if (isHomeRoute(routeSlug)) return undefined;

    const frame = window.requestAnimationFrame(() => {
      const section = document.getElementById(normalizeSectionId(routeSlug));
      if (section) section.scrollIntoView({ block: "start" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activePage, routeSlug]);

  useEffect(() => {
    const seo = activePage?.seo;
    document.title = seo?.title || content.seo.metaTitle;
    const description = document.querySelector('meta[name="description"]');
    if (description)
      description.setAttribute("content", seo?.description || content.seo.metaDescription);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle)
      ogTitle.setAttribute("content", seo?.ogTitle || seo?.title || content.seo.metaTitle);

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute(
        "content",
        seo?.ogDescription || seo?.description || content.seo.metaDescription,
      );
    }
  }, [activePage, content.seo]);

  const handleNavigate = (event, href) => {
    if (String(href || "").startsWith("#/")) return;

    event.preventDefault();
    const sectionId = getSectionIdFromHref(href);

    if (!sectionId) {
      setActiveSectionId("start");
      if (activePage) {
        window.location.hash = "#/";
        return;
      }

      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (activePage) {
      setActiveSectionId(sectionId);
      window.location.hash = `#${sectionId}`;
      return;
    }

    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}#${sectionId}`,
      );
      setActiveSectionId(sectionId);
      return;
    }

    window.location.hash = `#${sectionId}`;
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050816] text-white">
      <div className="page-gradient" />
      {(selfTestErrors.length > 0 || cmsWarning) && (
        <div className="fixed bottom-4 left-4 z-50 max-w-sm rounded-lg border border-amber-400/40 bg-amber-950/90 p-4 text-sm text-amber-100 shadow-2xl">
          <p className="font-bold">Ostrzeżenie CMS:</p>
          {cmsWarning && <p className="mt-2">{cmsWarning}</p>}
          {selfTestErrors.length > 0 && (
            <ul className="mt-2 list-disc pl-5">
              {selfTestErrors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          )}
        </div>
      )}
      <Header
        settings={content.settings}
        hero={content.hero}
        routeSlug={routeSlug}
        activeSectionId={activeSectionId}
        onNavigate={handleNavigate}
      />
      <FloatingSectionNav
        items={floatingNavItems}
        activeSectionId={activeSectionId}
        routeSlug={routeSlug}
        visible={isFloatingNavVisible}
        onNavigate={handleNavigate}
      />
      <main className="relative z-10 overflow-visible">
        {activePage ? (
          <ServiceDetailPage
            page={activePage}
            contact={content.contact}
            onNavigate={handleNavigate}
          />
        ) : (
          <>
            <Hero hero={content.hero} onNavigate={handleNavigate} />
            <ServicesSection services={content.services} />

            <AreasSection
              services={content.services}
              automationQa={content.automationQa}
              gamedevTeaser={content.gamedevTeaser}
            />

            <section id="projects" className="relative overflow-hidden scroll-mt-28">
              <SectionDecor variant="parallel" position="left" className="top-20 opacity-30" />
              <PortfolioSection portfolio={content.portfolio} />
            </section>

            <FaqSection faq={content.faq} />
            <ContactSection contact={content.contact} />
          </>
        )}
      </main>
      <footer className="relative z-10 border-t border-white/10 px-6 py-8 text-center text-sm text-slate-500 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 md:flex-row md:justify-between">
          <span>{content.settings.footerText}</span>
          <nav className="flex flex-wrap justify-center gap-4 text-slate-400">
            <a href="#/strony-cms" className="hover:text-cyan-300">
              Strony i CMS
            </a>
            <a href="#/qa-automatyzacja" className="hover:text-cyan-300">
              QA
            </a>
            <a href="#/gamedev" className="hover:text-cyan-300">
              GameDev
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
