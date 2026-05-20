import React, { useId } from "react";
import { motion } from "framer-motion";

const circuitVariants = {
  stair: {
    viewBox: "0 0 220 140",
    lineOpacity: 0.72,
    paths: ["M12 28 H76 V66 H142 V46 H204", "M76 66 V110 H126", "M142 46 V92 H178"],
    nodes: [
      { x: 12, y: 28, r: 2 },
      { x: 76, y: 66, r: 3 },
      { x: 126, y: 110, r: 2.4 },
      { x: 204, y: 46, r: 3.6 },
    ],
    tracks: [
      {
        points: [
          [12, 28],
          [76, 28],
          [76, 66],
          [142, 66],
          [142, 46],
          [204, 46],
        ],
        duration: 6.2,
        delay: 0.2,
      },
    ],
  },
  longDrop: {
    viewBox: "0 0 320 120",
    lineOpacity: 0.66,
    paths: ["M16 34 H132 V82 H190 V54 H304", "M132 34 H214", "M248 54 V94 H286"],
    nodes: [
      { x: 16, y: 34, r: 2 },
      { x: 132, y: 82, r: 4.8, ring: true },
      { x: 214, y: 34, r: 2.6 },
      { x: 304, y: 54, r: 3.2 },
    ],
    tracks: [
      {
        points: [
          [304, 54],
          [190, 54],
          [190, 82],
          [132, 82],
          [132, 34],
          [16, 34],
        ],
        duration: 9.4,
        delay: 1.1,
        reverse: true,
        radius: 3.4,
      },
    ],
  },
  parallel: {
    viewBox: "0 0 260 130",
    lineOpacity: 0.64,
    paths: ["M18 36 H116 V62 H238", "M38 76 H150 V98 H220", "M116 36 V22 H174", "M150 76 V54 H202"],
    nodes: [
      { x: 18, y: 36, r: 2 },
      { x: 238, y: 62, r: 3.1 },
      { x: 38, y: 76, r: 2 },
      { x: 220, y: 98, r: 2.8 },
      { x: 174, y: 22, r: 2.4 },
    ],
    tracks: [
      {
        points: [
          [18, 36],
          [116, 36],
          [116, 62],
          [238, 62],
        ],
        duration: 7.5,
        delay: 0.4,
        radius: 3,
      },
      {
        points: [
          [220, 98],
          [150, 98],
          [150, 76],
          [38, 76],
        ],
        duration: 8.8,
        delay: 2.2,
        radius: 2.7,
      },
    ],
  },
  corner: {
    viewBox: "0 0 180 180",
    lineOpacity: 0.62,
    paths: ["M18 18 H136 V64", "M42 44 H104 V112 H158", "M72 76 H18 V142"],
    nodes: [
      { x: 18, y: 18, r: 2.2 },
      { x: 136, y: 64, r: 3.4, ring: true },
      { x: 158, y: 112, r: 2.8 },
      { x: 18, y: 142, r: 2.4 },
    ],
    tracks: [
      {
        points: [
          [18, 18],
          [136, 18],
          [136, 64],
        ],
        duration: 5.8,
        delay: 0.7,
        radius: 3,
      },
      {
        points: [
          [158, 112],
          [104, 112],
          [104, 44],
          [42, 44],
        ],
        duration: 8.6,
        delay: 3,
        radius: 2.6,
      },
    ],
  },
  vertical: {
    viewBox: "0 0 150 260",
    lineOpacity: 0.58,
    paths: [
      "M74 18 V68 H116 V118 H62 V168 H100 V238",
      "M74 68 H28",
      "M62 168 H22 V214",
      "M100 208 H132",
    ],
    nodes: [
      { x: 74, y: 18, r: 2.4 },
      { x: 116, y: 118, r: 3.8 },
      { x: 22, y: 214, r: 2.6 },
      { x: 100, y: 238, r: 3.2, ring: true },
    ],
    tracks: [
      {
        points: [
          [74, 18],
          [74, 68],
          [116, 68],
          [116, 118],
          [62, 118],
          [62, 168],
          [100, 168],
          [100, 238],
        ],
        duration: 10.4,
        delay: 1.4,
        radius: 3.1,
      },
    ],
  },
  branch: {
    viewBox: "0 0 260 170",
    lineOpacity: 0.68,
    paths: ["M18 86 H112 V44 H210", "M112 86 V132 H236", "M70 86 V28", "M166 44 V78 H228"],
    nodes: [
      { x: 18, y: 86, r: 2 },
      { x: 70, y: 28, r: 2.6 },
      { x: 210, y: 44, r: 3.4 },
      { x: 236, y: 132, r: 3.2 },
      { x: 228, y: 78, r: 2.6 },
    ],
    tracks: [
      {
        points: [
          [18, 86],
          [112, 86],
          [112, 44],
          [210, 44],
        ],
        duration: 7.1,
        delay: 0.9,
        radius: 3.2,
      },
      {
        points: [
          [236, 132],
          [112, 132],
          [112, 86],
          [70, 86],
          [70, 28],
        ],
        duration: 9.8,
        delay: 3.5,
        radius: 2.7,
      },
    ],
  },
  mini: {
    viewBox: "0 0 130 90",
    lineOpacity: 0.46,
    paths: ["M12 24 H54 V46 H100", "M54 46 V72 H84", "M84 24 H116"],
    nodes: [
      { x: 12, y: 24, r: 1.8 },
      { x: 54, y: 46, r: 2.4 },
      { x: 100, y: 46, r: 2.2 },
      { x: 84, y: 72, r: 1.8 },
    ],
    tracks: [
      {
        points: [
          [12, 24],
          [54, 24],
          [54, 46],
          [100, 46],
        ],
        duration: 6.9,
        delay: 1.8,
        radius: 2.5,
      },
    ],
  },
};

const variantAliases = {
  full: "stair",
  small: "mini",
};

export default function AnimatedCircuit({
  variant = "stair",
  className = "",
  flip = false,
  colorFrom = "#38bdf8",
  colorTo = "#a855f7",
}) {
  const uid = useId().replace(/:/g, "");
  const gradId = `circuitGrad-${uid}`;
  const glowId = `circuitGlow-${uid}`;
  const config = circuitVariants[variantAliases[variant] || variant] || circuitVariants.stair;
  const transformStyle = flip ? { transform: "scaleX(-1)" } : undefined;

  return (
    <div className={`pointer-events-none ${className}`} style={transformStyle} aria-hidden="true">
      <svg
        viewBox={config.viewBox}
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={gradId} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={colorFrom} stopOpacity="0.96" />
            <stop offset="55%" stopColor="#2563eb" stopOpacity="0.82" />
            <stop offset="100%" stopColor={colorTo} stopOpacity="0.92" />
          </linearGradient>
          <filter id={glowId} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="3.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g
          stroke={`url(#${gradId})`}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={config.lineOpacity}
        >
          {config.paths.map((path) => (
            <path key={path} d={path} fill="none" />
          ))}
        </g>

        <g stroke={`url(#${gradId})`} strokeWidth="2.4" strokeLinecap="round" opacity="0.09">
          {config.paths.map((path) => (
            <path key={`glow-${path}`} d={path} fill="none" />
          ))}
        </g>

        <g fill={`url(#${gradId})`}>
          {config.nodes.map((node, index) => (
            <g key={`${node.x}-${node.y}-${index}`}>
              {node.ring && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.r + 5}
                  fill="none"
                  stroke={`url(#${gradId})`}
                  strokeWidth="1"
                  opacity="0.34"
                />
              )}
              <circle
                cx={node.x}
                cy={node.y}
                r={node.r}
                opacity="0.92"
                filter={`url(#${glowId})`}
              />
            </g>
          ))}
        </g>

        {config.tracks.map((track, index) => {
          const points = track.reverse ? [...track.points].reverse() : track.points;
          const radius = track.radius || 3;

          return (
            <motion.circle
              key={`${variant}-${index}`}
              r={radius}
              fill={index % 2 === 0 ? colorFrom : colorTo}
              style={{ filter: `url(#${glowId})` }}
              animate={{
                cx: points.map((point) => point[0]),
                cy: points.map((point) => point[1]),
                r: [radius * 0.85, radius * 1.28, radius],
                opacity: [0.55, 1, 0.72],
              }}
              transition={{
                duration: track.duration,
                repeat: Infinity,
                ease: "linear",
                delay: track.delay,
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
