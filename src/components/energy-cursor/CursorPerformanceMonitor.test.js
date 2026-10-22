import { describe, expect, it } from "vitest";
import { CursorPerformanceMonitor } from "./CursorPerformanceMonitor.js";
import { cursorConfig } from "./cursorConfig.js";

describe("cursor performance fallback", () => {
  it.each([50, 100, 200])("detects sustained slow frames at %i ms", (interval) => {
    const monitor = new CursorPerformanceMonitor(cursorConfig);
    let disabled = false;
    for (let now = 0; now <= 3000; now += interval) disabled ||= monitor.sample(now, 1);
    expect(disabled).toBe(true);
  });
  it("tolerates normal 60/120 Hz, occasional jank and 30 Hz", () => {
    for (const interval of [8.33, 16.67, 33.33]) {
      const monitor = new CursorPerformanceMonitor(cursorConfig);
      let now = 0;
      for (let i = 0; i < 300; i++) {
        now += i === 40 ? 120 : interval;
        expect(monitor.sample(now, 1)).toBe(false);
      }
    }
  });
  it("does not count idle or background gaps and detects expensive drawing", () => {
    const monitor = new CursorPerformanceMonitor(cursorConfig);
    monitor.sample(0, 1);
    expect(monitor.sample(10000, 1)).toBe(false);
    monitor.reset();
    expect(monitor.sample(20000, 1)).toBe(false);
    let disabled = false;
    for (let i = 1; i <= 110; i++) disabled ||= monitor.sample(20000 + i * 16.67, 10);
    expect(disabled).toBe(true);
  });
});
