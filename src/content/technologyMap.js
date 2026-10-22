// Site-specific copy and navigation live here; graph components only render data.
export const mapCopy = {
  title: "Mapa portfolio",
  description: "Odkryj usługi, realizacje i kompetencje. Wybierz obszar, który Cię interesuje.",
  director: { title: "Director Assistant", description: "Opis projektu w przygotowaniu." },
  seo: {
    title: "Mapa portfolio",
    description: "Interaktywna mapa usług, projektów i kompetencji.",
  },
};

// Semantic keys keep content independent from the UI icon library.
const nodeIcons = {
  services: "globe",
  projects: "folder",
  qa: "shield",
  about: "person",
  contact: "contact",
  websites: "monitor",
  cms: "settings",
  seo: "search",
  cooperation: "handshake",
  "director-assistant": "dashboard",
  "web-projects": "browser",
  "graphic-projects": "palette",
  gamedev: "gamepad",
  testing: "checklist",
  istqb: "award",
  automation: "automation",
  technologies: "cpu",
  skills: "tools",
  experience: "compass",
  brief: "form",
  email: "email",
};

function projectIcon(item, graphic) {
  const metadata = [item.category, item.type, ...(item.tags || [])].join(" ");
  if (graphic) {
    if (/branding|identyfikac|logo/i.test(item.title)) return "brand";
    if (
      /druk|wizytów|wizytow|ulotk|plakat|teczk|karta promocyjna/i.test(
        [item.title, metadata].join(" "),
      )
    )
      return "print";
    if (/branding|identyfikac|logo/i.test(metadata)) return "brand";
    return "palette";
  }
  if (/cms/i.test(metadata)) return "settings";
  if (/aplikac|application|dashboard/i.test(metadata)) return "application";
  if (/stron|www|website|web|landing/i.test(metadata)) return "monitor";
  return "file";
}

const entry = (id, label, description, href, extra = {}) => ({
  id,
  label,
  description,
  href,
  icon: nodeIcons[id] || "file",
  ...extra,
});

export function createTechnologyMap(content) {
  const pages = content.pages || {};
  const projectItems = (content.portfolio.items || []).map((item, index) => {
    const graphic = /grafik|branding|druk/i.test(
      [item.category, item.type, ...(item.tags || [])].join(" "),
    );
    return entry(`project-${index}`, item.title.replace(/\s+/g, " "), item.text, "#projects", {
      status: item.status,
      graphic,
      icon: projectIcon(item, graphic),
    });
  });
  const groups = [
    entry(
      "services",
      "Strony WWW i CMS",
      pages.webCms?.hero?.description || content.services.text,
      "#/strony-cms",
      {
        category: "Usługi",

        color: "cyan",
        featured: true,
        children: [
          entry("websites", "Strony internetowe", content.services.text, "#/strony-cms"),
          entry(
            "cms",
            "Autorski CMS",
            pages.webCms?.sections?.cmsPanel?.description,
            "#/strony-cms",
          ),
          entry("seo", "SEO", "Tytuły, opisy i podstawy widoczności strony w Google.", "#offer"),
          entry(
            "cooperation",
            "Współpraca",
            pages.webCms?.sections?.process?.description || content.process.text,
            "#process",
          ),
        ],
      },
    ),
    entry("projects", "Projekty", content.portfolio.text, "#projects", {
      category: "Projekty",

      color: "violet",
      children: [
        entry(
          "director-assistant",
          pages.directorAssistant?.hero?.title || mapCopy.director.title,
          pages.directorAssistant?.hero?.description || mapCopy.director.description,
          `${import.meta.env?.BASE_URL || "/"}director-assistant/`,
        ),
        entry(
          "web-projects",
          "Projekty web",
          "Strony internetowe, demonstracje i lekki panel CMS.",
          "#projects",
          { children: projectItems.filter((item) => !item.graphic) },
        ),
        entry(
          "graphic-projects",
          "Projekty graficzne",
          "Branding, wizytówki i materiały graficzne.",
          "#projects",
          { children: projectItems.filter((item) => item.graphic) },
        ),
        entry("gamedev", "GameDev", pages.gamedev?.hero?.description, "#/gamedev"),
      ],
    }),
    entry("qa", "QA / Automatyzacja", pages.qaAutomation?.hero?.description, "#/qa-automatyzacja", {
      category: "QA",

      color: "blue",
      children: [
        entry(
          "testing",
          "Testowanie oprogramowania",
          pages.qaAutomation?.sections?.testing?.description,
          "#/qa-automatyzacja",
        ),
        entry(
          "istqb",
          "ISTQB",
          pages.qaAutomation?.sections?.istqbCertificate?.description,
          "#/tester-istqb",
        ),
        entry(
          "automation",
          "Automatyzacja",
          pages.qaAutomation?.sections?.automation?.description,
          "#/qa-automatyzacja",
        ),
      ],
    }),
    entry("about", "O mnie", content.whyMe.text, "#why-me", {
      category: "O mnie",

      color: "violet",
      children: [
        entry(
          "technologies",
          "Technologie",
          "React · Vite · Tailwind CSS · Supabase · Vitest",
          "#/portfolio",
        ),
        entry("skills", "Kompetencje", pages.portfolio?.hero?.description, "#/portfolio"),
        entry("experience", "Podejście do pracy", content.whyMe.text, "#why-me"),
      ],
    }),
    entry("contact", "Kontakt", content.contact.text, "#contact", {
      category: "Kontakt",

      color: "cyan",
      children: [
        entry(
          "brief",
          "Opisz swój projekt",
          "Przejdź do formularza i opisz, jakiej strony potrzebujesz.",
          "#/opisz-strone",
        ),
        ...(content.contact.email
          ? [
              entry(
                "email",
                "E-mail",
                "Napisz wiadomość w sprawie współpracy.",
                `mailto:${content.contact.email}`,
              ),
            ]
          : []),
      ],
    }),
  ];
  const decorate = (item, parent = null, inherited = {}) => ({
    ...inherited,
    ...item,
    parent,
    ...(item.children?.length
      ? {
          children: item.children.map((child) =>
            decorate(child, item.id, {
              category: item.category || inherited.category,
              color: item.color || inherited.color,
            }),
          ),
        }
      : { children: undefined }),
  });
  return {
    center: decorate(groups[0]),
    groups: groups.slice(1).map((group) => decorate(group)),
  };
}

export function flattenMapItems(model) {
  const visit = (item) => [item, ...(item.children || []).flatMap(visit)];
  return [model.center, ...model.groups].flatMap(visit);
}

export function expansionPath(model, id, expanded) {
  const items = flattenMapItems(model);
  const item = items.find((node) => node.id === id);
  if (!item?.children?.length) return expanded;
  const path = [];
  let current = item;
  while (current) {
    path.unshift(current.id);
    current = items.find((node) => node.id === current.parent);
  }
  return expanded.includes(id) ? path.slice(0, -1) : path;
}
