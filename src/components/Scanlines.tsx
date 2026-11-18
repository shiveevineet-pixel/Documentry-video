import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

export const Scanlines: React.FC<{
  scanlineOpacity?: number;
  vignetteOpacity?: number;
}> = ({ scanlineOpacity = 0.12, vignetteOpacity = 0.55 }) => {
  const frame = useCurrentFrame();
  const scanlineY = (frame * 1.5) % 8;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 510 }}>
      {/* CRT Scanline bars */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.45) 50%)",
          backgroundSize: "100% 4px",
          backgroundPosition: `0px ${scanlineY}px`,
          opacity: scanlineOpacity,
          mixBlendMode: "overlay",
        }}
      />

      {/* Cinematic Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(11, 13, 16, 0.4) 75%, rgba(5, 7, 9, 0.95) 100%)",
          opacity: vignetteOpacity,
          mixBlendMode: "multiply",
        }}
      />

      {/* CRT Lens Curvature Glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 50%, rgba(57, 255, 20, 0.02) 0%, transparent 60%)",
          mixBlendMode: "screen",
        }}
      />
    </AbsoluteFill>
  );
};
