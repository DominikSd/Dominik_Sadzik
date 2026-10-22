// Measure only consecutive animation frames, never idle time or a hidden tab.
export class CursorPerformanceMonitor {
  constructor(config) {
    this.config = config;
    this.reset();
  }

  reset() {
    this.previous = null;
    this.elapsed = 0;
    this.frames = 0;
    this.slow = 0;
    this.expensive = 0;
  }

  sample(now, renderMs) {
    const previous = this.previous;
    this.previous = now;
    if (previous === null) return false;
    const interval = now - previous;
    if (interval <= 0 || interval > this.config.performanceMaxGapMs) {
      this.reset();
      this.previous = now;
      return false;
    }
    this.elapsed += interval;
    this.frames++;
    if (interval > this.config.performanceSlowFrameMs) this.slow++;
    if (renderMs > this.config.performanceRenderBudgetMs) this.expensive++;
    if (this.elapsed < this.config.performanceWindowMs || this.frames < 12) return false;
    const degraded =
      this.elapsed / this.frames > this.config.performanceAverageFrameMs ||
      this.slow / this.frames >= 0.4 ||
      this.expensive / this.frames >= 0.4;
    this.reset();
    this.previous = now;
    return degraded;
  }
}
