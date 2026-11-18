import React from "react";
import {
  AbsoluteFill,
  interpolate,
  staticFile,
  Img,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../theme";
import { BroadcastCaption } from "../components/BroadcastCaption";

export const Beat7FlirGimbal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Dynamic Zoom Punches every 150 frames (2.5s)
  // 0-150: 1.05x
  // 150-300: 1.35x
  // 300-450: 1.65x
  // 450-600: 1.40x
  // 600-750: 1.80x
  // 750-900: 2.10x (extreme macro lock on gimbal craft)
  const punchPhase = Math.floor(frame / 150);
  const zoomPunches = [1.05, 1.35, 1.65, 1.45, 1.85, 2.15];
  const targetZoom = zoomPunches[Math.min(zoomPunches.length - 1, punchPhase)];

  // Aggressive 60fps military micro-jitter
  const jitterX = Math.sin(frame * 0.8) * 3 + Math.sin(frame * 1.5) * 1.5;
  const jitterY = Math.cos(frame * 0.7) * 3 + Math.cos(frame * 1.3) * 1.5;

  // Targeting reticle coordinates (locked in center 4:5 safe area)
  const reticleX = 500;
  const reticleY = 780;

  // Real-time changing Navy ATFLIR telemetry numbers (at 60fps)
  const azimuth = (156.4 + frame * 0.04).toFixed(1);
  const elevation = (-3.2 + Math.sin(frame * 0.03) * 0.3).toFixed(1);
  const range = (25.2 - frame * 0.015).toFixed(1);

  // Rotating Gimbal target angle
  const reticleRoll = Math.sin(frame * 0.02) * 12;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.flirObsidian,
        overflow: "hidden",
      }}
    >
      {/* 1. Real Pentagon GIMBAL FLIR Footage: Assets/proof 4.webp */}
      <AbsoluteFill
        style={{
          transform: `scale(${targetZoom}) translate(${jitterX}px, ${jitterY}px)`,
          transformOrigin: "center 45%",
          transition: "transform 0.08s ease-out",
        }}
      >
        <Img
          src={staticFile("Assets/proof 4.webp")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 45%",
            filter: "contrast(1.25) brightness(0.96)",
          }}
        />
      </AbsoluteFill>

      {/* 2. CRT Scanlines & Analog Distortion */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(10, 14, 18, 0) 50%, rgba(0, 0, 0, 0.45) 50%)",
          backgroundSize: "100% 3px",
          opacity: 0.22,
          pointerEvents: "none",
        }}
      />

      {/* 3. Top ATFLIR Header Bar (Inside Safe Zone) */}
      <div
        style={{
          position: "absolute",
          top: theme.safeZone.top + 15,
          left: theme.safeZone.left,
          right: theme.safeZone.right + 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: theme.fonts.tech,
          fontSize: 13,
          letterSpacing: "0.15em",
          borderBottom: "1px solid rgba(226, 232, 240, 0.3)",
          paddingBottom: 8,
          color: theme.colors.flirReticle,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: theme.colors.flirReticleGreen,
              boxShadow: `0 0 10px ${theme.colors.flirReticleGreen}`,
            }}
          />
          <span>ATFLIR // U.S. NAVY VFA-41</span>
        </div>
        <div style={{ color: "#FFF", fontWeight: 700 }}>
          ZOOM: {targetZoom.toFixed(1)}X
        </div>
        <div style={{ color: theme.colors.crimsonStamp, fontWeight: 700 }}>
          [TRACK: AUTO]
        </div>
      </div>

      {/* 4. Live Pitch Ladder & Horizon Marker */}
      <div
        style={{
          position: "absolute",
          left: 170,
          top: reticleY - 140,
          width: 40,
          height: 280,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderLeft: "2px solid rgba(226, 232, 240, 0.35)",
          paddingLeft: 8,
          fontFamily: theme.fonts.tech,
          fontSize: 10,
          color: "rgba(226, 232, 240, 0.7)",
        }}
      >
        <span>+10</span>
        <span>+05</span>
        <span style={{ color: theme.colors.flirReticleGreen, fontWeight: 800 }}>
          -- 00 --
        </span>
        <span>-05</span>
        <span>-10</span>
      </div>

      {/* 5. Live Rotating ATFLIR Reticle Tracking Gate */}
      <div
        style={{
          position: "absolute",
          left: reticleX - 160,
          top: reticleY - 160,
          width: 320,
          height: 320,
          transform: `rotate(${reticleRoll}deg)`,
          transformOrigin: "center center",
          pointerEvents: "none",
        }}
      >
        {/* Reticle Arms */}
        <div
          style={{
            position: "absolute",
            top: 160,
            left: 0,
            width: 75,
            height: 2,
            backgroundColor: "#FFFFFF",
            boxShadow: "0 0 6px #FFF",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 160,
            right: 0,
            width: 75,
            height: 2,
            backgroundColor: "#FFFFFF",
            boxShadow: "0 0 6px #FFF",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 160,
            top: 0,
            width: 2,
            height: 75,
            backgroundColor: "#FFFFFF",
            boxShadow: "0 0 6px #FFF",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 160,
            bottom: 0,
            width: 2,
            height: 75,
            backgroundColor: "#FFFFFF",
            boxShadow: "0 0 6px #FFF",
          }}
        />

        {/* Center Target Box */}
        <div
          style={{
            position: "absolute",
            left: 105,
            top: 105,
            width: 110,
            height: 110,
            border: "1px solid rgba(226, 232, 240, 0.4)",
          }}
        >
          {/* Green Corners */}
          <div
            style={{
              position: "absolute",
              top: -1,
              left: -1,
              width: 14,
              height: 14,
              borderTop: `3px solid ${theme.colors.flirReticleGreen}`,
              borderLeft: `3px solid ${theme.colors.flirReticleGreen}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: -1,
              right: -1,
              width: 14,
              height: 14,
              borderTop: `3px solid ${theme.colors.flirReticleGreen}`,
              borderRight: `3px solid ${theme.colors.flirReticleGreen}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -1,
              left: -1,
              width: 14,
              height: 14,
              borderBottom: `3px solid ${theme.colors.flirReticleGreen}`,
              borderLeft: `3px solid ${theme.colors.flirReticleGreen}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -1,
              right: -1,
              width: 14,
              height: 14,
              borderBottom: `3px solid ${theme.colors.flirReticleGreen}`,
              borderRight: `3px solid ${theme.colors.flirReticleGreen}`,
            }}
          />
        </div>
      </div>

      {/* 6. Real-Time Azimuth / Elevation / Range Telemetry */}
      <div
        style={{
          position: "absolute",
          top: reticleY - 110,
          left: theme.safeZone.left,
          display: "flex",
          flexDirection: "column",
          gap: 6,
          fontFamily: theme.fonts.tech,
          fontSize: 12,
          color: theme.colors.flirReticle,
        }}
      >
        <div>AZ: {azimuth}°</div>
        <div>EL: {elevation}°</div>
        <div>RNG: {range} NM</div>
        <div style={{ color: "#FFF" }}>TAS: 480 KTS</div>
      </div>

      <div
        style={{
          position: "absolute",
          top: reticleY - 110,
          right: theme.safeZone.right + 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 6,
          fontFamily: theme.fonts.tech,
          fontSize: 12,
          color: theme.colors.flirReticle,
        }}
      >
        <div>IR: W-HOT</div>
        <div>FOV: 1.2°</div>
        <div style={{ color: theme.colors.crimsonStamp, fontWeight: 700 }}>
          TGT: GIMBAL
        </div>
      </div>

      {/* 7. Broadcast Documentary Lower-Third locked at Y: 1260px */}
      <BroadcastCaption
        text="2017: THE PENTAGON ADMITS IT'S REAL."
        startFrame={30}
        highlightWord="REAL."
        y={1260}
      />
    </AbsoluteFill>
  );
};
