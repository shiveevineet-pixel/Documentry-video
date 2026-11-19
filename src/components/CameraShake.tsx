import React from "react";
import { useCurrentFrame } from "remotion";

interface ShakeEvent {
  frame: number;
  duration: number;
  intensity: number;
}

interface CameraShakeProps {
  children: React.ReactNode;
  shakes?: ShakeEvent[];
}

export const CameraShake: React.FC<CameraShakeProps> = ({
  children,
  shakes = [
    { frame: 480, duration: 8, intensity: 16 },    // Shot 2: Glass bang impact
    { frame: 1420, duration: 16, intensity: 32 },  // Shot 4: Glass shatter breach
    { frame: 2620, duration: 12, intensity: 24 },  // Shot 7: Freezer door slam
    { frame: 3285, duration: 15, intensity: 28 },  // Shot 8: Mimic jump-snap
  ],
}) => {
  const currentFrame = useCurrentFrame();

  let offsetX = 0;
  let offsetY = 0;
  let rot = 0;
  let scale = 1.0;

  for (const shake of shakes) {
    const diff = currentFrame - shake.frame;
    if (diff >= 0 && diff < shake.duration) {
      const progress = diff / shake.duration;
      const decay = Math.exp(-progress * 4.5);
      // High-frequency pseudo-random deterministic shake
      const freq1 = Math.sin(diff * 1.7) * Math.cos(diff * 2.3);
      const freq2 = Math.cos(diff * 2.1) * Math.sin(diff * 1.9);
      
      offsetX += freq1 * shake.intensity * decay;
      offsetY += freq2 * shake.intensity * decay;
      rot += freq1 * 1.2 * decay;
      scale += decay * 0.02;
    }
  }

  // Red flash frame check at frame 1420
  const isFlashFrame = currentFrame >= 1420 && currentFrame <= 1423;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        position: "relative",
        transform: `translate3d(${offsetX}px, ${offsetY}px, 0px) rotate(${rot}deg) scale(${scale})`,
        transformOrigin: "center center",
      }}
    >
      {children}
      {isFlashFrame && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(239, 68, 68, 0.45)",
            mixBlendMode: "screen",
            pointerEvents: "none",
            zIndex: 999,
          }}
        />
      )}
    </div>
  );
};

