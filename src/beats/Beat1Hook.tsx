import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../theme";

export const Beat1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Initial heavy dossier slam spring on Frame 0
  const slamSpring = spring({
    frame,
    fps,
    config: theme.spring.heavyImpact,
  });
  const dossierScale = interpolate(slamSpring, [0, 1], [1.4, 1.0]);
  const dossierOpacity = interpolate(slamSpring, [0, 1], [0, 1]);

  // Screen shake on initial slam (frames 0 to 8)
  const isShakingInitial = frame <= 8;
  const shakeX = isShakingInitial ? Math.sin(frame * 2.5) * 8 : 0;
  const shakeY = isShakingInitial ? Math.cos(frame * 3.0) * 6 : 0;

  // Title 1: "70 YEARS OF FILES." (frames 15-80)
  const title1Spring = spring({
    frame: frame - 15,
    fps,
    config: theme.spring.cardSnap,
  });
  const title1Y = interpolate(title1Spring, [0, 1], [30, 0]);
  const title1Opacity = interpolate(title1Spring, [0, 1], [0, 1]);

  // Title 2: "FINALLY OPENED." exactly on the spoken words "Finally opened" (frame 140 / 2.33s)
  const title2Spring = spring({
    frame: frame - 140,
    fps,
    config: theme.spring.slam,
  });
  const title2Scale = interpolate(title2Spring, [0, 1], [1.6, 1.0]);
  const title2Opacity = interpolate(title2Spring, [0, 1], [0, 1]);

  // Shake when "FINALLY OPENED" hits (frame 140 to 148)
  const isShakingSecond = frame >= 140 && frame <= 148;
  const shake2X = isShakingSecond ? Math.sin((frame - 140) * 3) * 7 : 0;
  const shake2Y = isShakingSecond ? Math.cos((frame - 140) * 3.5) * 5 : 0;

  // Camera slow push-in
  const camScale = interpolate(frame, [0, 210], [1.0, 1.05], {
    easing: theme.ease.inOut,
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.darkroomBg,
        overflow: "hidden",
        transform: `scale(${camScale}) translate(${shakeX + shake2X}px, ${shakeY + shake2Y}px)`,
      }}
    >
      {/* Warm Tungsten Vault Spotlight */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(245, 158, 11, 0.08) 0%, rgba(18, 22, 28, 0.5) 50%, rgba(9, 10, 13, 0.98) 85%)",
          pointerEvents: "none",
        }}
      />

      {/* Main Archival Dossier Center Lockup */}
      <div
        style={{
          position: "absolute",
          top: 340,
          left: 65,
          right: 145, // respect right 140px safe-zone
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          opacity: dossierOpacity,
          transform: `scale(${dossierScale})`,
          zIndex: 20,
        }}
      >
        {/* Pill Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "8px 20px",
            borderRadius: 999,
            backgroundColor: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            marginBottom: 28,
            backdropFilter: "blur(12px)",
          }}
        >
          <span
            style={{
              fontFamily: theme.fonts.mono,
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "0.14em",
              color: theme.colors.textPrimary,
              textTransform: "uppercase",
            }}
          >
            • TOP SECRET // RECORD GROUP 341
          </span>
        </div>

        {/* Line 1: "70 YEARS OF FILES." */}
        <div
          style={{
            opacity: title1Opacity,
            transform: `translateY(${title1Y}px)`,
          }}
        >
          <h1
            style={{
              fontFamily: theme.fonts.display,
              fontSize: 82,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1.02,
              color: theme.colors.textPrimary,
              margin: 0,
              textShadow: "0 8px 30px rgba(0, 0, 0, 0.9)",
            }}
          >
            70 YEARS OF FILES.
          </h1>
        </div>

        {/* Line 2: "FINALLY OPENED." (slams in on exact spoken words) */}
        <div
          style={{
            marginTop: 18,
            opacity: title2Opacity,
            transform: `scale(${title2Scale})`,
            transformOrigin: "left center",
          }}
        >
          <h1
            style={{
              fontFamily: theme.fonts.display,
              fontSize: 82,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1.02,
              color: theme.colors.crimsonClassified,
              margin: 0,
              textShadow: "0 0 40px rgba(220, 38, 38, 0.6), 0 8px 30px rgba(0, 0, 0, 0.9)",
            }}
          >
            FINALLY OPENED.
          </h1>
        </div>

        {/* Heavy Classified Folder Line Marker */}
        <div
          style={{
            marginTop: 48,
            width: 160,
            height: 4,
            backgroundColor: theme.colors.crimsonClassified,
            boxShadow: "0 0 16px rgba(220, 38, 38, 0.6)",
          }}
        />

        {/* Archival metadata card */}
        <div
          style={{
            marginTop: 40,
            padding: "20px 24px",
            borderRadius: 14,
            backgroundColor: "rgba(19, 22, 28, 0.85)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.7)",
            maxWidth: 680,
          }}
        >
          <div
            style={{
              fontFamily: theme.fonts.mono,
              fontSize: 14,
              color: theme.colors.textMuted,
              letterSpacing: "0.1em",
              marginBottom: 6,
            }}
          >
            DECLASSIFICATION ORDER: EO 13526
          </div>
          <div
            style={{
              fontFamily: theme.fonts.display,
              fontSize: 22,
              fontWeight: 700,
              color: theme.colors.textPrimary,
            }}
          >
            Project Blue Book Archive Files (1947–2024)
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
