import React from "react";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import TechnologyMap from "./TechnologyMap.jsx";
import {
  createTechnologyMap,
  flattenMapItems,
  expansionPath,
} from "../../content/technologyMap.js";
import { defaultSiteContent } from "../../content/defaultSiteContent.js";
import { buildGraph, branchFocusIds, mapPanExtent, emptyViewAnchor } from "./mapLayout.js";
import { trackContactClick } from "../../lib/analytics/ga4.js";

vi.mock("../../lib/analytics/ga4.js", () => ({
  trackNavigationClick: vi.fn(),
  trackContactClick: vi.fn(),
}));
vi.mock("./TechnologyGraph.jsx", () => ({ default: () => <div>Graph tested in browser</div> }));
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
const model = createTechnologyMap(defaultSiteContent);

function setup() {
  const onNavigate = vi.fn((event) => event.preventDefault());
  render(<TechnologyMap content={defaultSiteContent} onNavigate={onNavigate} full />);
  return { onNavigate, tree: screen.getByRole("navigation", { name: "Mobilna mapa portfolio" }) };
}

describe("Technology map content and navigation", () => {
  it("chooses project symbols from metadata and keeps unknown projects neutral", () => {
    const content = {
      ...defaultSiteContent,
      portfolio: {
        ...defaultSiteContent.portfolio,
        items: [
          { title: "Strona", category: "Strony WWW", tags: [] },
          { title: "Panel", category: "CMS", tags: [] },
          { title: "Branding i wizytówki", category: "Grafika", tags: ["druk"] },
          { title: "Okładka teczki", category: "Grafika", tags: [] },
          { title: "Aplikacja", category: "Aplikacja", tags: [] },
          { title: "Eksperyment", tags: [] },
        ],
      },
    };
    const items = flattenMapItems(createTechnologyMap(content));
    expect(
      items
        .filter((item) => item.id.startsWith("project-"))
        .sort((a, b) => a.id.localeCompare(b.id))
        .map((item) => item.icon),
    ).toEqual(["monitor", "settings", "brand", "print", "application", "file"]);
    expect(items.find((item) => item.id === "projects").icon).toBe("folder");
    expect(items.find((item) => item.id === "director-assistant").icon).toBe("dashboard");
  });
  it("recovers from empty gaps between branches without moving a view that contains nodes", () => {
    const nodes = buildGraph(model, ["projects", "web-projects"], null, vi.fn()).nodes;
    expect(emptyViewAnchor(nodes, { x: 600, y: 300, zoom: 1 }, 1200, 600)).toBeNull();
    const anchor = emptyViewAnchor(nodes, { x: -5000, y: -5000, zoom: 1.7 }, 1200, 600);
    expect(nodes.some((node) => node.data.shape === anchor)).toBe(true);
    expect(emptyViewAnchor([], { x: 0, y: 0, zoom: 1 }, 1200, 600)).toBeNull();
  });
  it("updates navigation limits for opened branches and viewport size", () => {
    expect(mapPanExtent([], 1200, 600)).toBeUndefined();
    const initial = buildGraph(model, [], null, vi.fn()).nodes;
    const expanded = buildGraph(model, ["projects", "web-projects"], null, vi.fn()).nodes;
    const a = mapPanExtent(initial, 1200, 600);
    const b = mapPanExtent(expanded, 1200, 600);
    expect(b[1][0]).toBeGreaterThan(a[1][0]);
    for (const node of expanded) {
      expect(node.position.x).toBeGreaterThan(b[0][0]);
      expect(node.position.y).toBeGreaterThan(b[0][1]);
      expect(node.position.x + node.data.shape.width).toBeLessThan(b[1][0]);
      expect(node.position.y + node.data.shape.height).toBeLessThan(b[1][1]);
    }
    expect(mapPanExtent(initial, 800, 600)[1][0]).toBeLessThan(a[1][0]);
  });
  it("groups projects and reveals specific work only on the next level", () => {
    const projects = model.groups.find((node) => node.id === "projects");
    expect(projects.children.map((node) => node.id)).toEqual([
      "director-assistant",
      "web-projects",
      "graphic-projects",
      "gamedev",
    ]);
    const first = buildGraph(model, ["projects"], "projects", vi.fn());
    expect(first.nodes.some((node) => node.id === "project-0")).toBe(false);
    const path = expansionPath(model, "web-projects", ["projects"]);
    expect(path).toEqual(["projects", "web-projects"]);
    const second = buildGraph(model, path, "project-0", vi.fn());
    expect(second.nodes.some((node) => node.id === "project-0")).toBe(true);
    expect(second.edges.find((edge) => edge.id === "services-projects").className).toBe(
      "map-edge-active",
    );
    expect(second.edges.find((edge) => edge.id === "projects-web-projects").className).toBe(
      "map-edge-active",
    );
    expect(branchFocusIds(model, path)).toContain("project-0");
    expect(branchFocusIds(model, path)).not.toContain("qa");
    expect(expansionPath(model, "web-projects", path)).toEqual(["projects"]);
    expect(expansionPath(model, "projects", path)).toEqual([]);
  });
  it("spreads nodes across the map without overlapping cards", () => {
    for (const path of [
      [],
      ["services"],
      ["qa"],
      ["projects"],
      ["projects", "web-projects"],
      ["projects", "graphic-projects"],
    ]) {
      const { nodes } = buildGraph(model, path, null, vi.fn());
      const center = nodes.find((node) => node.id === "services");
      expect(center.position).toEqual({ x: -100, y: -100 });
      expect(new Set(nodes.map((node) => Math.round(node.position.x))).size).toBeGreaterThan(2);
      nodes.forEach((node, i) =>
        nodes.slice(i + 1).forEach((other) => {
          const width = (n) => (n.data.leaf ? 190 : n.data.size);
          const height = (n) => (n.data.leaf ? 90 : n.data.size);
          const overlap =
            node.position.x < other.position.x + width(other) &&
            node.position.x + width(node) > other.position.x &&
            node.position.y < other.position.y + height(other) &&
            node.position.y + height(node) > other.position.y;
          expect(overlap).toBe(false);
        }),
      );
    }
  });
  it("supports nested groups through the mobile/list navigation", () => {
    const { tree } = setup();
    fireEvent.click(within(tree).getByRole("button", { name: "Projekty", exact: true }));
    expect(
      within(tree).queryByRole("button", { name: "Strona Centrum Terapii Neuronest" }),
    ).toBeNull();
    fireEvent.click(within(tree).getByRole("button", { name: "Projekty web", exact: true }));
    expect(
      within(tree).getByRole("button", { name: "Strona Centrum Terapii Neuronest" }),
    ).toBeTruthy();
    fireEvent.click(within(tree).getByRole("button", { name: "Projekty graficzne", exact: true }));
    expect(
      within(tree).queryByRole("button", { name: "Strona Centrum Terapii Neuronest" }),
    ).toBeNull();
    expect(within(tree).getByRole("button", { name: /Branding/ })).toBeTruthy();
  });

  it("starts with the offer at the center and highlights an active leaf path without hiding other categories", () => {
    const initial = buildGraph(model, [], null, vi.fn());
    expect(initial.nodes).toHaveLength(5);
    expect(initial.edges).toHaveLength(4);
    const expanded = buildGraph(model, ["qa"], "istqb", vi.fn());
    expect(expanded.nodes).toHaveLength(8);
    expect(expanded.edges.find((e) => e.id === "services-qa").className).toBe("map-edge-active");
    expect(expanded.edges.find((e) => e.id === "qa-istqb").className).toBe("map-edge-active");
  });
  it("reads current published project and contact data, with the Director presentation link", () => {
    const current = createTechnologyMap({
      ...defaultSiteContent,
      contact: { ...defaultSiteContent.contact, email: "example@example.test" },
      portfolio: {
        text: "Current",
        items: [{ title: "Published project", text: "Published description", tags: ["React"] }],
      },
    });
    const projects = current.groups.find((g) => g.id === "projects");
    expect(flattenMapItems(current).find((n) => n.id === "project-0").label).toBe(
      "Published project",
    );
    expect(projects.children.find((n) => n.id === "director-assistant").href).toBe(
      "/director-assistant/",
    );
    expect(
      current.groups.find((g) => g.id === "contact").children.find((n) => n.id === "email").href,
    ).toBe("mailto:example@example.test");
    expect(current.groups.flatMap((g) => g.children).some((n) => n.id === "cv")).toBe(false);
  });
  it("expands/collapses branches and opens Director Assistant details with its presentation CTA", () => {
    const { tree } = setup();
    const projects = within(tree).getByRole("button", { name: /Projekty/ });
    expect(projects.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(projects);
    fireEvent.click(within(tree).getByRole("button", { name: "Director Assistant" }));
    const panel = screen.getByRole("complementary", { name: "Szczegóły: Director Assistant" });
    expect(
      within(panel).getByText(defaultSiteContent.pages.directorAssistant.hero.description),
    ).toBeTruthy();
    expect(within(panel).getByRole("link").getAttribute("href")).toBe("/director-assistant/");
    fireEvent.keyDown(panel, { key: "Escape" });
    expect(
      screen.queryByRole("complementary", { name: "Szczegóły: Director Assistant" }),
    ).toBeNull();
    fireEvent.click(projects);
    expect(projects.getAttribute("aria-expanded")).toBe("false");
    expect(within(tree).queryByRole("button", { name: "Director Assistant" })).toBeNull();
  });
  it("navigates to existing destinations without audience controls", () => {
    const { tree, onNavigate } = setup();
    expect(screen.queryByRole("group", { name: "Wyróżnij ścieżkę" })).toBeNull();
    expect(within(tree).getByRole("button", { name: /QA/ })).toBeTruthy();
    fireEvent.click(within(tree).getByRole("button", { name: /Strony WWW/ }));
    const panel = screen.getByRole("complementary", { name: "Szczegóły: Strony WWW i CMS" });
    const link = within(panel).getByRole("link");
    expect(link.getAttribute("href")).toBe("#/strony-cms");
    fireEvent.click(link);
    expect(onNavigate).toHaveBeenCalled();
  });
  it("uses the contact event without passing the address to analytics", () => {
    const { tree } = setup();
    fireEvent.click(within(tree).getByRole("button", { name: /Kontakt/ }));
    fireEvent.click(within(tree).getByRole("button", { name: "E-mail" }));
    const link = within(screen.getByRole("complementary", { name: "Szczegóły: E-mail" })).getByRole(
      "link",
    );
    link.addEventListener("click", (event) => event.preventDefault());
    fireEvent.click(link);
    expect(trackContactClick).toHaveBeenCalledWith("email", "technology_map");
  });
});
