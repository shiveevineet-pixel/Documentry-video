import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";

export const IncomingCallBadge: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enter = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 140 },
  });

  // Ring vibration
  const vib = Math.sin(frame * 1.2) * 4;
  const pulse = Math.sin(frame * 0.4) > 0;

  return (
    <div
      style={{
        position: "absolute",
        left: 540,
        top: 1320 + vib,
        transform: `translate(-50%, -50%) scale(${enter})`,
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "18px 36px",
        borderRadius: 48,
        backgroundColor: "rgba(15, 23, 42, 0.92)",
        border: "2.5px solid #22C55E",
        boxShadow: pulse
          ? "0 0 40px rgba(34, 197, 94, 0.8), 0 12px 30px rgba(0, 0, 0, 0.8)"
          : "0 0 15px rgba(34, 197, 94, 0.4), 0 12px 30px rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(16px)",
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      {/* Blinking Call Icon Indicator */}
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          backgroundColor: pulse ? "#22C55E" : "#15803D",
          boxShadow: pulse ? "0 0 16px #22C55E" : "none",
          transition: "all 0.15s ease",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#86EFAC",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          STORE LANDLINE
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          CALL: BEST FRIEND
        </div>
      </div>
    </div>
  );
};

