import React, { useMemo } from "react";
import { motion } from "framer-motion";

export default function AnimatedCircuit({ variant = "full", className = "", flip = false, colorFrom = "#28b8ff", colorTo = "#b245ff" }) {
  const uid = useMemo(() => Math.random().toString(36).slice(2, 9), []);
  const gradId = `circuitGrad-${uid}`;
  const glowId = `circuitGlow-${uid}`;

  // Path coordinates for a simple orthogonal circuit. Use relative small canvas.
  const coords = [
    [6, 14],
    [68, 14],
    [68, 34],
    [132, 34],
    [132, 66],
    [48, 66],
    [48, 94],
  ];

  const xs = coords.map((p) => p[0]);
  const ys = coords.map((p) => p[1]);

  // Variants: full has two moving dots, small has one.
  const dots = variant === "full" ? [
    { dur: 6.2, delay: 0 },
    { dur: 9.0, delay: 2.4 }
  ] : [ { dur: 7.5, delay: 0 } ];

  // Flip horizontally if needed
  const transformStyle = flip ? { transform: "scaleX(-1)" } : undefined;

  return (
    <div className={`pointer-events-none ${className}`} style={transformStyle} aria-hidden>
      <svg viewBox="0 0 180 110" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMinYMin meet">
        <defs>
          <linearGradient id={gradId} x1="0" x2="1">
            <stop offset="0%" stopColor={colorFrom} stopOpacity="0.95" />
            <stop offset="100%" stopColor={colorTo} stopOpacity="0.95" />
          </linearGradient>
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* thin orthogonal lines */}
        <g stroke={`url(#${gradId})`} strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" opacity={variant === "full" ? 0.75 : 0.45}>
          <path d="M6 14 H68 V34 H132" fill="none" />
          <path d="M132 34 V66 H48 V94" fill="none" />
        </g>

        {/* small junction nodes */}
        <g fill={`url(#${gradId})`} opacity={0.9}>
          {coords.map((p, i) => (
            <circle key={i} cx={p[0]} cy={p[1]} r={i % 2 === 0 ? 1.6 : 1.2} opacity={0.9} />
          ))}
        </g>

        {/* animated dots */}
        {dots.map((d, i) => (
          <motion.circle
            key={i}
            r={3.2}
            fill={colorFrom}
            style={{ filter: `url(#${glowId})` }}
            animate={{ cx: xs, cy: ys, opacity: [0.85, 1, 0.85], r: [3.2, 4.2, 3.2] }}
            transition={{ duration: d.dur, repeat: Infinity, ease: "linear", delay: d.delay }}
          />
        ))}

        {/* subtle overlay line to create soft glow along path (low opacity) */}
        <g stroke={`url(#${gradId})`} strokeWidth={2} strokeLinecap="round" opacity={0.08}>
          <path d="M6 14 H68 V34 H132 V66 H48 V94" fill="none" />
        </g>
      </svg>
    </div>
  );
}
