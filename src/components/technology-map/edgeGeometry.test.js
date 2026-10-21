import { describe, expect, it } from "vitest";
import { boundaryPoint, connectionGeometry } from "./edgeGeometry.js";
import { buildGraph } from "./mapLayout.js";
import { createTechnologyMap } from "../../content/technologyMap.js";
import { defaultSiteContent } from "../../content/defaultSiteContent.js";

const circle = { x: 0, y: 0, width: 186, height: 186, radius: 93 };

describe("map connection boundaries", () => {
  it("attaches in each quadrant of the circle instead of a shared right-hand handle", () => {
    for (const x of [-300, 300])
      for (const y of [-300, 300]) {
        const target = { ...circle, x, y, width: 112, height: 112, radius: 56 };
        const { start, end } = connectionGeometry(circle, target);
        expect(Math.sign(start.x)).toBe(Math.sign(x));
        expect(Math.sign(start.y)).toBe(Math.sign(y));
        expect(Math.hypot(start.x, start.y)).toBeCloseTo(93, 5);
        expect(Math.hypot(end.x - x, end.y - y)).toBeCloseTo(56, 5);
        expect(Math.sign(end.x - x)).toBe(-Math.sign(x));
        expect(Math.sign(end.y - y)).toBe(-Math.sign(y));
      }
  });
  it("uses the visible rounded card edge, including its corners", () => {
    const card = { x: 0, y: 0, width: 190, height: 90, radius: 14 };
    expect(boundaryPoint(card, { x: 300, y: 0 }).x).toBeCloseTo(95, 5);
    expect(boundaryPoint(card, { x: 0, y: -300 }).y).toBeCloseTo(-45, 5);
    const corner = boundaryPoint(card, { x: 190, y: 90 });
    expect(corner.x).toBeLessThan(95);
    expect(corner.y).toBeLessThan(45);
    expect(Math.hypot(corner.x - 81, corner.y - 31)).toBeCloseTo(14, 5);
  });
  it("keeps curves advancing toward the destination without loops at every map level", () => {
    const model = createTechnologyMap(defaultSiteContent);
    for (const expanded of [
      [],
      ["services"],
      ["qa"],
      ["about"],
      ["contact"],
      ["projects", "web-projects"],
      ["projects", "graphic-projects"],
    ]) {
      const { edges } = buildGraph(model, expanded, null, () => {});
      edges.forEach((edge) => {
        expect(edge.type).toBe("technology");
        const { start, end, c1, c2, path } = connectionGeometry(
          edge.data.sourceShape,
          edge.data.targetShape,
        );
        expect(path).not.toMatch(/NaN|Infinity/);
        const dx = end.x - start.x,
          dy = end.y - start.y;
        const squareDistance = dx * dx + dy * dy;
        const progress = (point) =>
          ((point.x - start.x) * dx + (point.y - start.y) * dy) / squareDistance;
        expect(progress(c1)).toBeCloseTo(1 / 3, 8);
        expect(progress(c2)).toBeCloseTo(2 / 3, 8);
        const deviation =
          Math.abs((c1.x - start.x) * dy - (c1.y - start.y) * dx) / Math.sqrt(squareDistance);
        expect(deviation).toBeLessThanOrEqual(22.000001);
      });
    }
  });
  it("handles horizontal, vertical and coincident centers without invalid coordinates", () => {
    for (const target of [{ ...circle, x: 300 }, { ...circle, y: -300 }, circle]) {
      expect(connectionGeometry(circle, target).path).not.toMatch(/NaN|Infinity/);
    }
  });
});
