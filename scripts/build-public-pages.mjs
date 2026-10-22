// Produce a real HTML entry for the clean project URL on static hosting.
// Use the same component, content and SEO helpers as the client application.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { createServer, resolveConfig } from "vite";

const config = await resolveConfig({}, "build");
const output = resolve(config.root, config.build.outDir);
const server = await createServer({
  server: { middlewareMode: true, watch: null, hmr: false, ws: false },
  appType: "custom",
});
try {
  const [{ default: Page }, { defaultSiteContent: content }, seo] = await Promise.all([
    server.ssrLoadModule("/src/components/DirectorAssistantPage.jsx"),
    server.ssrLoadModule("/src/content/defaultSiteContent.js"),
    server.ssrLoadModule("/src/lib/seo.js"),
  ]);
  const page = content.pages.directorAssistant;
  const dom = new JSDOM(await readFile(resolve(output, "index.html"), "utf8"));
  globalThis.document = dom.window.document;
  seo.applySeo(seo.getPublicRouteSeo({ content, activePage: page }));
  seo.applyStructuredData(content, page);
  document.querySelector("#root").innerHTML = renderToStaticMarkup(
    React.createElement(Page, {
      page,
      settings: content.settings,
      basePath: document.querySelector("base")?.getAttribute("href") || config.base,
      standalone: true,
    }),
  );
  const directory = resolve(output, "director-assistant");
  await mkdir(directory, { recursive: true });
  await writeFile(resolve(directory, "index.html"), dom.serialize());
  const urls = [seo.normalizeBaseUrl(content.seo.canonical)];
  if (!page.seo.noindex) urls.push(seo.getPublicRouteSeo({ content, activePage: page }).canonical);
  const escapeXml = (value) =>
    value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
  await writeFile(
    resolve(output, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`).join("\n")}\n</urlset>\n`,
  );
  console.log("Generated /director-assistant/ with static content, SEO and sitemap.");
} finally {
  delete globalThis.document;
  await server.close();
}
