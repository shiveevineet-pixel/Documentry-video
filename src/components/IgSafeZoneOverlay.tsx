import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";

interface IgSafeZoneOverlayProps {
  visible?: boolean;
}

export const IgSafeZoneOverlay: React.FC<IgSafeZoneOverlayProps> = ({
  visible = true,
}) => {
  if (!visible) return null;

  const { top, bottom, right, left, feed4x5 } = theme.safeZone;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        zIndex: 9999,
        fontFamily: theme.fonts.tech,
        fontSize: 13,
        letterSpacing: "0.08em",
      }}
    >
      {/* Top Header Exclusion (220px) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: top,
          background: "rgba(255, 30, 30, 0.12)",
          borderBottom: "1px dashed rgba(255, 60, 60, 0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          color: "rgba(255, 100, 100, 0.9)",
        }}
      >
        <span>▲ INSTAGRAM HEADER EXCLUSION ZONE (0 - 220px)</span>
        <span>NO TITLES / LOGOS</span>
      </div>

      {/* Right Side Action Stack Exclusion (140px) */}
      <div
        style={{
          position: "absolute",
          top,
          right: 0,
          width: right,
          bottom,
          background: "rgba(255, 160, 0, 0.12)",
          borderLeft: "1px dashed rgba(255, 180, 0, 0.6)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          color: "rgba(255, 200, 80, 0.85)",
          textAlign: "center",
          padding: "8px",
          fontSize: 11,
        }}
      >
        <div style={{ transform: "rotate(90deg)", whiteSpace: "nowrap" }}>
          RIGHT ICONS (LIKE / COMMENT / SHARE / AUDIO)
        </div>
      </div>

      {/* Bottom Caption/Scrubber Exclusion (340px) */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: bottom,
          background: "rgba(255, 30, 30, 0.14)",
          borderTop: "1px dashed rgba(255, 60, 60, 0.6)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 24px",
          color: "rgba(255, 100, 100, 0.9)",
          gap: 6,
        }}
      >
        <div style={{ fontWeight: 700 }}>
          ▼ INSTAGRAM CAPTION & AUDIO TICKER ZONE (1580px - 1920px)
        </div>
        <div style={{ fontSize: 11, color: "rgba(255, 140, 140, 0.8)" }}>
          Keep kinetic subtitles above Y: 1560px (ideal placement ~1280px-1450px)
        </div>
      </div>

      {/* 4:5 Grid Crop Compatibility Box (1080 x 1350) */}
      <div
        style={{
          position: "absolute",
          top: feed4x5.top,
          left: 0,
          width: "100%",
          height: feed4x5.height,
          border: "2px solid rgba(57, 255, 20, 0.35)",
          boxShadow: "inset 0 0 20px rgba(57, 255, 20, 0.05)",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 12,
            background: "rgba(11, 13, 16, 0.8)",
            padding: "3px 8px",
            borderRadius: 3,
            color: theme.colors.tungstenAmber,
            fontSize: 11,
            border: "1px solid rgba(224, 159, 62, 0.4)",
          }}
        >
          4:5 FEED PROFILE GRID SAFE REGION (Y: 285px — 1635px)
        </div>
      </div>

      {/* Corner crosshairs for technical precision */}
      <div
        style={{
          position: "absolute",
          top: top + 10,
          left: left,
          color: "rgba(255, 255, 255, 0.4)",
          fontSize: 10,
        }}
      >
        + SAFE_TL [{left}, {top}]
      </div>
      <div
        style={{
          position: "absolute",
          bottom: bottom + 10,
          left: left,
          color: "rgba(255, 255, 255, 0.4)",
          fontSize: 10,
        }}
      >
        + SAFE_BL [{left}, 1580]
      </div>
    </AbsoluteFill>
  );
};
