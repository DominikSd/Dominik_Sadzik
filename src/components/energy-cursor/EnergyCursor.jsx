import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cursorConfig as config } from "./cursorConfig.js";
import { getCursorZone } from "./cursorZone.js";
import { ParticleEngine } from "./ParticleEngine.js";
import "./energyCursor.css";

export default function EnergyCursor() {
  const layerRef = useRef(null);
  const canvasRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia) return;
    const capability = window.matchMedia("(any-pointer: fine) and (any-hover: hover)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;
    const layer = layerRef.current;
    let engine;
    let frame = 0;
    let failed = false;
    let visible = false;
    let width = 0;
    let height = 0;
    let point = null;
    let ring = null;
    let emissionPoint = null;
    let lastTime = 0;

    const allowed = () => capability.matches && !reduced.matches && !failed;
    function hide() {
      root.removeAttribute("data-energy-cursor");
      layer.dataset.visible = "false";
      visible = false;
      point = ring = emissionPoint = null;
      cancelAnimationFrame(frame);
      frame = 0;
      try {
        engine?.clear(width, height);
      } catch {
        failed = true;
      }
    }
    function fail() {
      failed = true;
      hide();
    }
    function resize() {
      try {
        hide();
        if (!allowed()) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (!context) return fail();
        width = window.innerWidth;
        height = window.innerHeight;
        const dpr = Math.min(
          window.devicePixelRatio || 1,
          config.maxDpr,
          Math.sqrt(config.maxCanvasPixels / (width * height)),
        );
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        engine = new ParticleEngine(context, config);
      } catch {
        fail();
      }
    }
    function schedule() {
      if (!frame && visible) frame = requestAnimationFrame(draw);
    }
    function draw(now) {
      frame = 0;
      try {
        if (!visible || !point) return;
        const blend = 1 - Math.exp(-Math.min(now - lastTime, 64) / config.followMs);
        lastTime = now;
        ring.x += (point.x - ring.x) * blend;
        ring.y += (point.y - ring.y) * blend;
        const moving = Math.hypot(point.x - ring.x, point.y - ring.y) > 0.1;
        if (!moving) ring = { ...point };
        dotRef.current.style.transform = `translate3d(${point.x}px, ${point.y}px, 0)`;
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
        const particles = engine.draw(now, width, height);
        // Hide the native pointer only after the replacement has actually rendered.
        layer.dataset.visible = "true";
        root.setAttribute("data-energy-cursor", "active");
        if (moving || particles) schedule();
      } catch {
        fail();
      }
    }
    function syncTarget(target) {
      const zone = getCursorZone(target);
      if (zone.native) {
        hide();
        return false;
      }
      layer.dataset.map = String(zone.map);
      layer.dataset.hover = String(zone.hover);
      layer.dataset.dragging = String(zone.dragging);
      return true;
    }
    function move(event) {
      try {
        if (event.pointerType !== "mouse" || !allowed() || !engine || document.hidden) {
          hide();
          return;
        }
        if (!syncTarget(document.elementFromPoint(event.clientX, event.clientY) || event.target))
          return;
        const now = performance.now();
        point = { x: event.clientX, y: event.clientY };
        if (!visible) {
          ring = { ...point };
          lastTime = now;
          emissionPoint = { ...point };
        }
        visible = true;
        if (
          Math.hypot(point.x - emissionPoint.x, point.y - emissionPoint.y) >=
          config.particleDistance
        ) {
          engine.emit(point.x, point.y, now);
          emissionPoint = { ...point };
        }
        schedule();
      } catch {
        fail();
      }
    }
    function refreshTarget() {
      try {
        if (!point) return;
        syncTarget(document.elementFromPoint(point.x, point.y));
      } catch {
        fail();
      }
    }
    function down(event) {
      if (event.pointerType !== "mouse") return hide();
      move(event);
      if (visible) {
        engine.pulse = { ...point, born: performance.now() };
        schedule();
      }
    }
    function leave(event) {
      if (!event.relatedTarget) hide();
    }
    const observer = new MutationObserver(refreshTarget);
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: [
        "data-cursor-state",
        "data-cursor-zone",
        "data-cursor-target",
        "data-cursor",
        "disabled",
        "open",
      ],
    });
    const listeners = [
      [document, "pointermove", move],
      [document, "pointerover", move],
      [document, "pointerdown", down],
      [document, "pointerout", leave],
      [document, "pointercancel", hide],
      [document, "keydown", hide],
      [document, "visibilitychange", hide],
      [document, "scroll", refreshTarget],
      [window, "blur", hide],
      [window, "resize", resize],
      [window, "hashchange", hide],
      [window, "popstate", hide],
    ];
    listeners.forEach(([target, type, handler]) =>
      target.addEventListener(type, handler, { passive: true, capture: true }),
    );
    capability.addEventListener("change", resize);
    reduced.addEventListener("change", resize);
    resize();
    return () => {
      hide();
      observer.disconnect();
      listeners.forEach(([target, type, handler]) =>
        target.removeEventListener(type, handler, true),
      );
      capability.removeEventListener("change", resize);
      reduced.removeEventListener("change", resize);
    };
  }, []);

  return createPortal(
    <div
      ref={layerRef}
      className="energy-cursor"
      aria-hidden="true"
      style={{
        "--energy-cyan": config.cyan,
        "--energy-blue": config.blue,
        "--energy-dot-size": `${config.dotSize}px`,
        "--energy-ring-size": `${config.ringSize}px`,
        "--energy-hover-size": `${config.hoverSize}px`,
      }}
    >
      <canvas ref={canvasRef} />
      <div ref={dotRef} className="energy-cursor__dot" />
      <div ref={ringRef} className="energy-cursor__ring" />
    </div>,
    document.body,
  );
}
