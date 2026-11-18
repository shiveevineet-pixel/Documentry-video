import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  Img,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../theme";
import { BroadcastCaption } from "../components/BroadcastCaption";

export const Beat3Capitol: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Rapid camera push into the glowing orbs above Capitol: scale 1.05 -> 1.55
  const camScale = interpolate(frame, [0, durationInFrames], [1.05, 1.55], {
    easing: theme.ease.inOut,
  });
  const panY = interpolate(frame, [0, durationInFrames], [0, -40]);

  // Handheld micro-shake
  const shakeX = Math.sin(frame * 0.4) * 2.5;
  const shakeY = Math.cos(frame * 0.33) * 2.5;

  // Spotlight ring revealing orbs
  const spotlightScale = interpolate(frame, [0, 60], [1.8, 1], {
    easing: theme.ease.outExpo,
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0A0A0B",
        overflow: "hidden",
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      {/* Real 1952 Washington D.C. Sighting Photo: Assets/images.jpeg */}
      <AbsoluteFill
        style={{
          transform: `scale(${camScale}) translateY(${panY}px)`,
          transformOrigin: "center 45%",
        }}
      >
        <Img
          src={staticFile("Assets/images.jpeg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 42%",
            filter: "contrast(1.22) brightness(0.92)",
          }}
        />
      </AbsoluteFill>

      {/* Dramatic Circular Vignette Isolating the Orbs Above Capitol Dome */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 45%, transparent 22%, rgba(10, 10, 11, 0.75) 60%, #0A0A0B 95%)",
          transform: `scale(${spotlightScale})`,
        }}
      />

      {/* Target Marker Ring on Orbs */}
      <div
        style={{
          position: "absolute",
          top: 660,
          left: 540,
          transform: "translate(-50%, -50%)",
          width: 320,
          height: 160,
          border: "1px dashed rgba(224, 159, 62, 0.5)",
          borderRadius: 8,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -12,
            left: 10,
            fontFamily: theme.fonts.typewriter,
            fontSize: 10,
            color: theme.colors.tungstenAmber,
            background: "#0A0A0B",
            padding: "2px 6px",
            border: "1px solid rgba(224, 159, 62, 0.4)",
          }}
        >
          AN/FPS-3 RADAR-VISUAL INTERCEPT
        </div>
      </div>

      {/* Top Telemetry Header (Inside Safe Zone) */}
      <div
        style={{
          position: "absolute",
          top: theme.safeZone.top + 15,
          left: theme.safeZone.left,
          right: theme.safeZone.right + 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: theme.fonts.typewriter,
          fontSize: 12,
          color: theme.colors.archivalPaper,
          letterSpacing: "0.15em",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
          paddingBottom: 6,
        }}
      >
        <span>CASE #1952-07 // WASHINGTON D.C.</span>
        <span style={{ color: theme.colors.crimsonStamp, fontWeight: 700 }}>
          EYES ONLY
        </span>
      </div>

      {/* Clean High-Contrast Documentary Lower-Third (Y: 1260px) */}
      <BroadcastCaption
        text="JULY 1952: OVER THE WHITE HOUSE."
        startFrame={20}
        highlightWord="WHITE"
        y={1260}
      />
    </AbsoluteFill>
  );
};
