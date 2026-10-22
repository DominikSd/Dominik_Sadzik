import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/react";
import EnergyCursor from "./EnergyCursor.jsx";
import { ParticleEngine } from "./ParticleEngine.js";
import { cursorConfig } from "./cursorConfig.js";
import { getCursorZone } from "./cursorZone.js";

let media;
let context;
let frames;
function pointer(target, x = 100, y = 100, type = "mouse", name = "pointermove") {
  const event = new Event(name, { bubbles: true });
  Object.assign(event, { clientX: x, clientY: y, pointerType: type });
  target.dispatchEvent(event);
}
function step(now = 100) {
  const pending = [...frames.values()];
  frames.clear();
  pending.forEach((callback) => callback(now));
}

beforeEach(() => {
  media = [];
  frames = new Map();
  let id = 0;
  vi.stubGlobal("requestAnimationFrame", (callback) => {
    frames.set(++id, callback);
    return id;
  });
  vi.stubGlobal("cancelAnimationFrame", (key) => frames.delete(key));
  vi.stubGlobal("matchMedia", (query) => {
    const result = {
      matches: !query.includes("reduced"),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    media.push(result);
    return result;
  });
  context = Object.fromEntries(
    ["clearRect", "setTransform", "beginPath", "arc", "fill", "stroke"].map((name) => [
      name,
      vi.fn(),
    ]),
  );
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(context);
  vi.stubGlobal(
    "MutationObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  document.elementFromPoint = vi.fn(() => null);
});

afterEach(() => {
  cleanup();
  delete document.elementFromPoint;
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("EnergyCursor safeguards", () => {
  it("waits for rendering before hiding native cursor, then restores it for forms and touch", () => {
    render(
      <>
        <EnergyCursor />
        <button>Go</button>
        <input />
      </>,
    );
    pointer(document.querySelector("button"));
    expect(document.documentElement.hasAttribute("data-energy-cursor")).toBe(false);
    step();
    expect(document.documentElement.dataset.energyCursor).toBe("active");
    expect(document.querySelector(".energy-cursor").dataset.hover).toBe("true");
    pointer(document.querySelector("input"));
    expect(document.documentElement.hasAttribute("data-energy-cursor")).toBe(false);
    pointer(document.body);
    step();
    pointer(document.body, 100, 100, "touch", "pointerdown");
    expect(document.documentElement.hasAttribute("data-energy-cursor")).toBe(false);
  });

  it("stops idle rendering and cleans up frames, listeners and native cursor on unmount", () => {
    const { unmount } = render(
      <React.StrictMode>
        <EnergyCursor />
      </React.StrictMode>,
    );
    pointer(document.body);
    step();
    expect(frames.size).toBe(0);
    pointer(document.body, 200, 200);
    expect(frames.size).toBe(1);
    unmount();
    expect(frames.size).toBe(0);
    expect(document.documentElement.hasAttribute("data-energy-cursor")).toBe(false);
    expect(media.every((m) => m.removeEventListener.mock.calls.length === 1)).toBe(true);
    pointer(document.body);
    expect(frames.size).toBe(0);
  });

  it("honors live reduced-motion changes and keyboard/blur fallback", () => {
    render(<EnergyCursor />);
    pointer(document.body);
    step();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.documentElement.hasAttribute("data-energy-cursor")).toBe(false);
    pointer(document.body);
    step();
    fireEvent.blur(window);
    expect(document.documentElement.hasAttribute("data-energy-cursor")).toBe(false);
    media[1].matches = true;
    media[1].addEventListener.mock.calls[0][1]();
    pointer(document.body);
    expect(frames.size).toBe(0);
  });

  it("keeps native cursor when canvas initialization or rendering fails", () => {
    context.setTransform.mockImplementation(() => {
      throw new Error("GPU unavailable");
    });
    render(<EnergyCursor />);
    pointer(document.body);
    step();
    expect(document.documentElement.hasAttribute("data-energy-cursor")).toBe(false);
  });

  it("returns to native after sustained jank and stays disabled across input and resize", () => {
    let now = 0;
    vi.spyOn(performance, "now").mockImplementation(() => now);
    render(<EnergyCursor />);
    pointer(document.body);
    step(now);
    for (let i = 1; i <= 40; i++) {
      now = i * 50;
      pointer(document.body, 100 + i * 4, 100);
      step(now);
    }
    expect(document.querySelector(".energy-cursor").dataset.disabled).toBe("performance");
    expect(document.documentElement.hasAttribute("data-energy-cursor")).toBe(false);
    expect(frames.size).toBe(0);
    expect(document.querySelector(".energy-cursor canvas").width).toBe(0);
    pointer(document.body, 400, 200);
    fireEvent.resize(window);
    pointer(document.body, 500, 200);
    step(3000);
    expect(document.documentElement.hasAttribute("data-energy-cursor")).toBe(false);
    expect(frames.size).toBe(0);
  });

  it("reuses event targets and activates native-cursor hiding just once", () => {
    let now = 0;
    vi.spyOn(performance, "now").mockImplementation(() => now);
    const { unmount } = render(<EnergyCursor />);
    const set = vi.spyOn(document.documentElement, "setAttribute");
    for (let i = 0; i < 10; i++) {
      now = i * 16;
      pointer(document.body, 100 + i * 4, 100);
      step(now);
    }
    expect(document.elementFromPoint).not.toHaveBeenCalled();
    expect(set.mock.calls.filter(([name]) => name === "data-energy-cursor")).toHaveLength(1);
    unmount();
  });

  it("clears only drawn particle bounds, including the final expiry frame", () => {
    const engine = new ParticleEngine(context, cursorConfig);
    engine.emit(100, 100, 0);
    engine.draw(0, 1920, 1080);
    context.clearRect.mockClear();
    engine.draw(30, 1920, 1080);
    expect(context.clearRect).toHaveBeenCalledWith(95, 95, 10, 10);
    engine.draw(500, 1920, 1080);
    context.clearRect.mockClear();
    engine.draw(600, 1920, 1080);
    expect(context.clearRect).not.toHaveBeenCalled();
  });

  it("detects nested map nodes, dragging, editable ancestors and native opt-out", () => {
    const zone = document.createElement("div");
    zone.innerHTML =
      '<div data-cursor-zone="map" data-cursor-state="dragging"><button data-cursor-target="node"><span>node</span></button></div>';
    expect(getCursorZone(zone.querySelector("span"))).toEqual({
      native: false,
      map: true,
      dragging: true,
      hover: true,
    });
    zone.setAttribute("contenteditable", "true");
    expect(getCursorZone(zone.querySelector("span")).native).toBe(true);
    zone.removeAttribute("contenteditable");
    zone.dataset.cursor = "native";
    expect(getCursorZone(zone.querySelector("span")).native).toBe(true);
  });

  it("bounds particles and expires particles and the single click pulse", () => {
    const engine = new ParticleEngine(context, cursorConfig);
    for (let n = 0; n < 100; n++) engine.emit(n, n, n * 40);
    expect(engine.particles.length).toBe(cursorConfig.maxParticles);
    engine.pulse = { x: 0, y: 0, born: 4000 };
    expect(engine.draw(4000, 100, 100)).toBe(true);
    expect(engine.draw(4500, 100, 100)).toBe(false);
    expect(engine.particles).toHaveLength(0);
  });
});
