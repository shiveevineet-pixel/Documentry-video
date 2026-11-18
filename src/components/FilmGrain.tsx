import React from "react";
import { AbsoluteFill } from "remotion";

// Ultra-performant lightweight static noise tile (Zero per-frame CPU overhead)
const NOISE_SVG = `data:image/svg+xml;utf8,<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23n)" opacity="0.4"/></svg>`;

export const FilmGrain: React.FC<{ opacity?: number }> = ({ opacity = 0.04 }) => {
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        zIndex: 500,
        backgroundImage: `url('${NOISE_SVG}')`,
        backgroundRepeat: "repeat",
        opacity,
        mixBlendMode: "multiply",
      }}
    />
  );
};
