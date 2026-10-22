export class ParticleEngine {
  constructor(context, config) {
    this.context = context;
    this.config = config;
    this.particles = [];
    this.lastEmission = -Infinity;
    this.pulse = null;
    this.bounds = null;
  }

  emit(x, y, now) {
    const c = this.config;
    if (now - this.lastEmission < c.particleInterval) return;
    this.lastEmission = now;
    if (this.particles.length >= c.maxParticles) this.particles.shift();
    const color = Math.random();
    this.particles.push({
      x,
      y,
      born: now,
      size: c.particleMinSize + Math.random() * (c.particleMaxSize - c.particleMinSize),
      color: color < 0.12 ? c.violet : color < 0.5 ? c.blue : c.cyan,
    });
  }

  draw(now, width, height) {
    const ctx = this.context;
    const c = this.config;
    if (this.bounds) {
      const { left, top, right, bottom } = this.bounds;
      ctx.clearRect(left, top, right - left, bottom - top);
      this.bounds = null;
    }
    const include = (x, y, radius) => {
      const left = Math.max(0, x - radius),
        top = Math.max(0, y - radius);
      const right = Math.min(width, x + radius),
        bottom = Math.min(height, y + radius);
      if (!this.bounds) this.bounds = { left, top, right, bottom };
      else {
        this.bounds.left = Math.min(this.bounds.left, left);
        this.bounds.top = Math.min(this.bounds.top, top);
        this.bounds.right = Math.max(this.bounds.right, right);
        this.bounds.bottom = Math.max(this.bounds.bottom, bottom);
      }
    };
    this.particles = this.particles.filter((p) => now - p.born < c.particleLifetime);
    for (const p of this.particles) {
      const life = 1 - (now - p.born) / c.particleLifetime;
      include(p.x, p.y, c.particleMaxSize + 2);
      ctx.globalAlpha = life * life * c.particleOpacity;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, (p.size / 2) * (0.5 + life / 2), 0, Math.PI * 2);
      ctx.fill();
    }
    if (this.pulse) {
      const progress = (now - this.pulse.born) / c.pulseDuration;
      if (progress >= 1) this.pulse = null;
      else {
        include(this.pulse.x, this.pulse.y, c.ringSize / 2 + progress * 16 + 3);
        ctx.globalAlpha = (1 - progress) * 0.45;
        ctx.strokeStyle = c.cyan;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.pulse.x, this.pulse.y, c.ringSize / 2 + progress * 16, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
    return this.particles.length > 0 || this.pulse !== null;
  }

  clear(width, height) {
    this.particles = [];
    this.pulse = null;
    this.lastEmission = -Infinity;
    if (this.bounds) {
      const { left, top, right, bottom } = this.bounds;
      this.context.clearRect(left, top, right - left, bottom - top);
      this.bounds = null;
    }
  }
}
