import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../theme";

export const Cut1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Snappy spring entrance for pill badge
  const pillSpring = spring({
    frame,
    fps,
    config: theme.spring.cardSnap,
  });
  const pillTranslateY = interpolate(pillSpring, [0, 1], [-20, 0]);
  const pillOpacity = interpolate(pillSpring, [0, 1], [0, 1]);

  // Word 1: "70 years of files." (frames 10-60)
  const line1Spring = spring({
    frame: frame - 10,
    fps,
    config: theme.spring.slam,
  });
  const line1Scale = interpolate(line1Spring, [0, 1], [0.92, 1]);
  const line1Opacity = interpolate(line1Spring, [0, 1], [0, 1]);
  const line1Y = interpolate(line1Spring, [0, 1], [30, 0]);

  // Word 2: "Finally opened." (frames 55-105)
  const line2Spring = spring({
    frame: frame - 55,
    fps,
    config: theme.spring.punch,
  });
  const line2Scale = interpolate(line2Spring, [0, 1], [0.94, 1]);
  const line2Opacity = interpolate(line2Spring, [0, 1], [0, 1]);
  const line2Y = interpolate(line2Spring, [0, 1], [25, 0]);

  // Subtle studio camera drift
  const cameraScale = interpolate(frame, [0, 120], [1, 1.025], {
    easing: theme.ease.inOut,
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 35%, #FFFFFF 0%, #F5F3EE 50%, #E6E2D8 100%)",
        overflow: "hidden",
        transform: `scale(${cameraScale})`,
      }}
    >
      {/* Studio radial illumination */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 45%, rgba(217, 119, 6, 0.03) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Main Content (centered inside the 4:5 feed safe region) */}
      <div
        style={{
          position: "absolute",
          top: 380,
          left: 70,
          right: 150, // respect right 140px Reels UI
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          zIndex: 20,
        }}
      >
        {/* Pill Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "10px 22px",
            borderRadius: 999,
            backgroundColor: theme.colors.pillBadgeBg,
            border: `1px solid ${theme.colors.pillBadgeBorder}`,
            marginBottom: 36,
            opacity: pillOpacity,
            transform: `translateY(${pillTranslateY}px)`,
          }}
        >
          <span
            style={{
              fontFamily: theme.fonts.mono,
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: theme.colors.pillBadgeText,
            }}
          >
            • DECLASSIFIED ARCHIVE // UAP FILES
          </span>
        </div>

        {/* Line 1: "70 years of files." */}
        <div
          style={{
            opacity: line1Opacity,
            transform: `translateY(${line1Y}px) scale(${line1Scale})`,
            transformOrigin: "left center",
          }}
        >
          <h1
            style={{
              fontFamily: theme.fonts.display,
              fontSize: 84,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1.04,
              color: theme.colors.headlineDark,
              margin: 0,
            }}
          >
            70 years of files.
          </h1>
        </div>

        {/* Line 2: "Finally opened." */}
        <div
          style={{
            marginTop: 20,
            opacity: line2Opacity,
            transform: `translateY(${line2Y}px) scale(${line2Scale})`,
            transformOrigin: "left center",
          }}
        >
          <h1
            style={{
              fontFamily: theme.fonts.display,
              fontSize: 84,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1.04,
              color: theme.colors.crimsonRed,
              margin: 0,
            }}
          >
            Finally opened.
          </h1>
        </div>

        {/* Minimal vector divider */}
        <div
          style={{
            marginTop: 50,
            width: 140,
            height: 3,
            backgroundColor: theme.colors.headlineDark,
            opacity: interpolate(frame, [40, 80], [0, 0.4], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        />

        {/* Editorial Subtitle */}
        <p
          style={{
            fontFamily: theme.fonts.mono,
            fontSize: 22,
            letterSpacing: "0.06em",
            color: theme.colors.subtitleDark,
            marginTop: 28,
            textTransform: "uppercase",
            opacity: interpolate(frame, [60, 95], [0, 0.85], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          RECORD GROUP 341 // NATIONAL ARCHIVES
        </p>
      </div>
    </AbsoluteFill>
  );
};
