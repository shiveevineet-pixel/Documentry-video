import React from "react";
import { AbsoluteFill } from "remotion";

export const DeskLighting: React.FC<{
  intensity?: number;
}> = ({ intensity = 1 }) => {
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 450 }}>
      {/* Warm tungsten desk-lamp radial pool of light */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 65% 55% at 50% 48%, rgba(255, 230, 180, 0.12) 0%, rgba(20, 18, 16, 0.4) 65%, rgba(10, 9, 8, 0.92) 100%)",
          mixBlendMode: "multiply",
          opacity: intensity,
        }}
      />
      {/* Subtle warm center glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 45%, rgba(224, 159, 62, 0.08) 0%, transparent 60%)",
          mixBlendMode: "screen",
          opacity: intensity,
        }}
      />
    </AbsoluteFill>
  );
};
