import React from "react";
import {
  interpolate,
  spring,
  staticFile,
  Img,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { StudioLayout, FloatingCard } from "../components/StudioCard";
import { theme } from "../theme";

export const Cut3RoswellMacro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Snappy punch zoom directly into the right-hand "FLYING SAUCER" column
  const macroEntrance = spring({
    frame,
    fps,
    config: theme.spring.cardSnap,
  });
  const macroScale = interpolate(macroEntrance, [0, 1], [1.0, 1.25]);

  // Amber highlighter sweep across the headline text ONLY (starts frame 18, finishes frame 55)
  // Strictly on the newspaper text column on the right — NEVER over the face!
  const highlightProgress = interpolate(frame, [18, 55], [0, 100], {
    easing: theme.ease.outExpo,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <StudioLayout
      badge="• PRESS BULLETIN // RETRACTION"
      headline="Captured in print."
      subtitle="Hours later, the official story was retracted."
    >
      <FloatingCard>
        {/* Card header */}
        <div
          style={{
            height: 52,
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            backgroundColor: "#FCFBF8",
            zIndex: 10,
            position: "relative",
          }}
        >
          <span
            style={{
              fontFamily: theme.fonts.mono,
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: "#78716C",
            }}
          >
            MACRO DETAIL // HEADLINE TRANSCRIPT
          </span>
          <span
            style={{
              fontFamily: theme.fonts.mono,
              fontSize: 15,
              fontWeight: 700,
              color: theme.colors.crimsonRed,
            }}
          >
            RETRACTED 24H LATER
          </span>
        </div>

        {/* Zoomed headline viewport */}
        <div
          style={{
            width: "100%",
            height: "calc(100% - 52px)",
            overflow: "hidden",
            position: "relative",
            backgroundColor: "#ECE8DD",
          }}
        >
          {/* Shifted & Scaled to center the newspaper headline and hide top book header */}
          <div
            style={{
              position: "absolute",
              top: "-22%",
              left: "-38%",
              width: "155%",
              height: "145%",
              transform: `scale(${macroScale})`,
              transformOrigin: "70% 40%",
            }}
          >
            <Img
              src={staticFile("Assets/2nd proof.jpg")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                filter: "contrast(1.15) brightness(0.97)",
              }}
            />

            {/* Amber highlighter sweep strictly over the headline column */}
            <div
              style={{
                position: "absolute",
                top: "29%",
                left: "64%",
                width: `${(highlightProgress * 32) / 100}%`,
                height: "6%",
                backgroundColor: theme.colors.highlighterAmber,
                mixBlendMode: "multiply",
                borderRadius: 4,
                boxShadow: "0 0 10px rgba(245, 158, 11, 0.4)",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "absolute",
                top: "36%",
                left: "64%",
                width: `${(Math.max(0, highlightProgress - 15) * 30) / 85}%`,
                height: "6%",
                backgroundColor: theme.colors.highlighterAmber,
                mixBlendMode: "multiply",
                borderRadius: 4,
                boxShadow: "0 0 10px rgba(245, 158, 11, 0.4)",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Precision telemetry readout callout */}
          <div
            style={{
              position: "absolute",
              bottom: 24,
              left: 24,
              right: 24,
              padding: "14px 20px",
              borderRadius: 12,
              backgroundColor: "rgba(255, 255, 255, 0.94)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              opacity: interpolate(frame, [20, 40], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: theme.fonts.mono,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#78716C",
                  display: "block",
                }}
              >
                EVIDENCE 01 // PRESS ARCHIVE
              </span>
              <span
                style={{
                  fontFamily: theme.fonts.display,
                  fontSize: 20,
                  fontWeight: 700,
                  color: theme.colors.headlineDark,
                }}
              >
                RAAF Captures Flying Saucer On Ranch
              </span>
            </div>
            <span
              style={{
                fontFamily: theme.fonts.mono,
                fontSize: 14,
                fontWeight: 700,
                color: theme.colors.crimsonRed,
                padding: "6px 12px",
                borderRadius: 6,
                backgroundColor: "rgba(185, 28, 28, 0.08)",
              }}
            >
              CONFIRMED
            </span>
          </div>
        </div>
      </FloatingCard>
    </StudioLayout>
  );
};
