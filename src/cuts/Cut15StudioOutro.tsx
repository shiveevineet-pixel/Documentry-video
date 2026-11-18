import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../theme";

export const Cut15StudioOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const entrance = spring({
    frame,
    fps,
    config: theme.spring.cardSnap,
  });
  const translateY = interpolate(entrance, [0, 1], [30, 0]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  // Seamless loop cross-fade on final 25 frames (frames 455 to 480)
  // Fades out into the exact initial state of Cut 1
  const loopFadeProgress = interpolate(frame, [455, 480], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 35%, #FFFFFF 0%, #F5F3EE 50%, #E6E2D8 100%)",
        overflow: "hidden",
      }}
    >
      {/* Studio Radial Floor Light */}
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
          top: 360,
          left: 70,
          right: 150, // clear right 140px Reels UI
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          transform: `translateY(${translateY}px)`,
          opacity: opacity * (1 - loopFadeProgress * 0.2),
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
            • ARCHIVE STATUS: OPEN
          </span>
        </div>

        {/* Stacked Outro Headline */}
        <h1
          style={{
            fontFamily: theme.fonts.display,
            fontSize: 78,
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1.06,
            color: theme.colors.headlineDark,
            margin: "0 0 16px 0",
          }}
        >
          The files are open.
        </h1>

        <h1
          style={{
            fontFamily: theme.fonts.display,
            fontSize: 78,
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1.06,
            color: theme.colors.crimsonRed,
            margin: "0 0 40px 0",
          }}
        >
          The answers remain classified.
        </h1>

        {/* Hairline Divider */}
        <div
          style={{
            width: 140,
            height: 3,
            backgroundColor: theme.colors.headlineDark,
            opacity: 0.3,
            marginBottom: 36,
          }}
        />

        {/* Floating Call to Action Card */}
        <div
          style={{
            padding: "24px 32px",
            borderRadius: 16,
            backgroundColor: "#FFFFFF",
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: theme.colors.cardShadowLight,
            maxWidth: 680,
          }}
        >
          <div
            style={{
              fontFamily: theme.fonts.mono,
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "#78716C",
              marginBottom: 8,
              textTransform: "uppercase",
            }}
          >
            PROJECT BLUE BOOK ARCHIVE
          </div>
          <div
            style={{
              fontFamily: theme.fonts.display,
              fontSize: 24,
              fontWeight: 700,
              color: theme.colors.headlineDark,
            }}
          >
            National Archives Record Group 341
          </div>
        </div>
      </div>

      {/* Seamless Loop Cross-Dissolve Target Overlay */}
      {loopFadeProgress > 0 && (
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at 50% 35%, #FFFFFF 0%, #F5F3EE 50%, #E6E2D8 100%)",
            opacity: loopFadeProgress,
            zIndex: 100,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 380,
              left: 70,
              right: 150,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "10px 22px",
                borderRadius: 999,
                backgroundColor: theme.colors.pillBadgeBg,
                border: `1px solid ${theme.colors.pillBadgeBorder}`,
                marginBottom: 36,
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
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
