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

export const Scene4FlirHud: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Handheld camera breathing drift
  const driftX = Math.sin(frame * 0.03) * 3;
  const driftY = Math.cos(frame * 0.025) * 3;
  const driftRotate = Math.sin(frame * 0.02) * 0.15;

  // Continuous Ken Burns slow dolly push on real FLIR footage
  const footageScale = interpolate(frame, [0, durationInFrames], [1.02, 1.15], {
    easing: theme.ease.inOut,
  });
  const footagePanX = interpolate(frame, [0, durationInFrames], [0, -18]);
  const footagePanY = interpolate(frame, [0, durationInFrames], [0, -12]);

  // Reticle Center (Safe Zone center, shifted slightly to clear right buttons)
  const reticleX = 500;
  const reticleY = 780;

  // Real-time changing Navy ATFLIR telemetry numbers
  const azimuth = (154.2 + frame * 0.06).toFixed(1);
  const elevation = (-3.2 + Math.sin(frame * 0.02) * 0.4).toFixed(1);
  const range = (26.8 - frame * 0.02).toFixed(1);

  // Subtle analog scanline flicker
  const flirFlicker = 0.94 + 0.1 * Math.sin(frame * 1.8);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.flirObsidian,
        transform: `
          translate(${driftX}px, ${driftY}px) 
          rotate(${driftRotate}deg)
        `,
        overflow: "hidden",
      }}
    >
      {/* 1. Real Pentagon GIMBAL Infrared Footage (Assets/proof 4.webp) */}
      <div
        style={{
          position: "absolute",
          inset: -40,
          transform: `scale(${footageScale}) translate(${footagePanX}px, ${footagePanY}px)`,
          filter: "contrast(1.2) brightness(0.95)",
        }}
      >
        <Img
          src={staticFile("Assets/proof 4.webp")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 45%",
          }}
        />
      </div>

      {/* 2. Analog FLIR CRT scanline texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(10, 14, 18, 0) 50%, rgba(0, 0, 0, 0.45) 50%)",
          backgroundSize: "100% 3px",
          opacity: 0.18 * flirFlicker,
          pointerEvents: "none",
        }}
      />

      {/* 3. Top ATFLIR Header Bar (Inside safe zone) */}
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
          borderBottom: "1px solid rgba(226, 232, 240, 0.25)",
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
        <div style={{ color: "#FFF", fontWeight: 700 }}>NAR // WIDE</div>
        <div style={{ color: theme.colors.crimsonStamp, fontWeight: 700 }}>
          [TRACK: AUTO]
        </div>
      </div>

      {/* 4. Lateral Pitch Ladder */}
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
          color: "rgba(226, 232, 240, 0.65)",
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

      {/* 5. Live ATFLIR Targeting Reticle & Tracking Gate */}
      <div
        style={{
          position: "absolute",
          left: reticleX - 160,
          top: reticleY - 160,
          width: 320,
          height: 320,
          pointerEvents: "none",
        }}
      >
        {/* Reticle Crosshair Arms */}
        <div
          style={{
            position: "absolute",
            top: 160,
            left: 0,
            width: 75,
            height: 2,
            backgroundColor: "#FFFFFF",
            boxShadow: "0 0 6px rgba(255,255,255,0.7)",
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
            boxShadow: "0 0 6px rgba(255,255,255,0.7)",
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
            boxShadow: "0 0 6px rgba(255,255,255,0.7)",
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
            boxShadow: "0 0 6px rgba(255,255,255,0.7)",
          }}
        />

        {/* Center Tracking Gate Brackets */}
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
          {/* Green Tracking Corners */}
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

      {/* 6. Telemetry Numeric Readouts */}
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
          letterSpacing: "0.12em",
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
          letterSpacing: "0.12em",
        }}
      >
        <div>IR: W-HOT</div>
        <div>FOV: 1.2°</div>
        <div style={{ color: theme.colors.crimsonStamp, fontWeight: 700 }}>
          TGT: GIMBAL
        </div>
      </div>

      {/* 7. Broadcast Lower-Third Caption locked at Y: 1260px */}
      <BroadcastCaption
        text="2017: THE PENTAGON ADMITS THE FOOTAGE IS REAL."
        startFrame={60}
        highlightWord="REAL."
        y={1260}
      />
    </AbsoluteFill>
  );
};
