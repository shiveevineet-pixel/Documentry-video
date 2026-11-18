import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

interface DustParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  opacity: number;
}

export const DustMotes: React.FC<{ count?: number }> = ({ count = 40 }) => {
  const frame = useCurrentFrame();

  const particles = useMemo<DustParticle[]>(() => {
    const list: DustParticle[] = [];
    for (let i = 0; i < count; i++) {
      // Deterministic pseudo-randomness based on index
      const seed = (i * 9301 + 49297) % 233280;
      const x = (seed % 1080);
      const y = ((seed * 7) % 1920);
      const size = 1.5 + ((seed % 4) * 0.8);
      const speed = 0.4 + ((seed % 10) * 0.1);
      const drift = 0.5 + ((seed % 5) * 0.2);
      const opacity = 0.15 + ((seed % 6) * 0.05);
      list.push({ id: i, x, y, size, speed, drift, opacity });
    }
    return list;
  }, [count]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 505 }}>
      {particles.map((p) => {
        // Floating 2.5D physics
        const currentY = (p.y - frame * p.speed + 1920 * 10) % 1920;
        const currentX = p.x + Math.sin(frame * 0.02 + p.id) * (20 * p.drift);
        const flicker = 0.8 + 0.3 * Math.sin(frame * 0.05 + p.id * 2);

        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: currentX,
              top: currentY,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: "rgba(229, 222, 201, 0.45)",
              boxShadow: `0 0 ${p.size * 2}px rgba(229, 222, 201, 0.3)`,
              opacity: p.opacity * flicker,
              transform: `scale(${1 + Math.sin(frame * 0.03 + p.id) * 0.2})`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
