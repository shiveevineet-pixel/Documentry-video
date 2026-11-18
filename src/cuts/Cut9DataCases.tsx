import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { StudioLayout, FloatingCard } from "../components/StudioCard";
import { theme } from "../theme";

export const Cut9DataCases: React.FC = () => {
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

  // Massive rapid numeric counter from 0 to 12,618 in 70 frames
  const countProgress = interpolate(frame, [10, 80], [0, 12618], {
    easing: theme.ease.outExpo,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const formattedCount = Math.round(countProgress).toLocaleString();

  return (
    <StudioLayout
      badge="• STATISTICAL RECORD // 17-YEAR ARCHIVE"
      headline="17 years of tracking."
      subtitle="Every sighting logged between 1952 and 1969."
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `translateY(${translateY}px)`,
          opacity,
        }}
      >
        <FloatingCard>
          <div
            style={{
              padding: "48px 40px",
              height: "100%",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              background: "linear-gradient(180deg, #FFFFFF 0%, #FAFAF7 100%)",
            }}
          >
            {/* Top Stat Header */}
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "6px 14px",
                  borderRadius: 6,
                  backgroundColor: "rgba(0,0,0,0.04)",
                  border: "1px solid rgba(0,0,0,0.08)",
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    fontFamily: theme.fonts.mono,
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color: "#57534E",
                  }}
                >
                  USAF OFFICIAL RECORD // 1952–1969
                </span>
              </div>

              <div
                style={{
                  fontFamily: theme.fonts.mono,
                  fontSize: 18,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  color: "#78716C",
                  textTransform: "uppercase",
                }}
              >
                Total Sightings Investigated
              </div>

              {/* Massive 140px Tabular Number */}
              <div
                style={{
                  fontFamily: theme.fonts.display,
                  fontSize: 136,
                  fontWeight: 900,
                  letterSpacing: "-0.05em",
                  color: theme.colors.headlineDark,
                  lineHeight: 1,
                  margin: "16px 0 20px 0",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {formattedCount}
              </div>

              <p
                style={{
                  fontFamily: theme.fonts.display,
                  fontSize: 22,
                  color: "#57534E",
                  lineHeight: 1.4,
                  margin: 0,
                  maxWidth: 680,
                }}
              >
                Detailed military witness reports, radar plots, and pilot testimonies
                compiled into classified dossier binders.
              </p>
            </div>

            {/* Bottom 3 Grid Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 16,
              }}
            >
              <div
                style={{
                  padding: "20px 18px",
                  borderRadius: 14,
                  backgroundColor: "#F5F3EE",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <div
                  style={{
                    fontFamily: theme.fonts.mono,
                    fontSize: 12,
                    color: "#78716C",
                    letterSpacing: "0.08em",
                  }}
                >
                  ACTIVE DURATION
                </div>
                <div
                  style={{
                    fontFamily: theme.fonts.display,
                    fontSize: 26,
                    fontWeight: 800,
                    color: theme.colors.headlineDark,
                    marginTop: 6,
                  }}
                >
                  17 Years
                </div>
              </div>

              <div
                style={{
                  padding: "20px 18px",
                  borderRadius: 14,
                  backgroundColor: "#F5F3EE",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <div
                  style={{
                    fontFamily: theme.fonts.mono,
                    fontSize: 12,
                    color: "#78716C",
                    letterSpacing: "0.08em",
                  }}
                >
                  TOTAL PAGES
                </div>
                <div
                  style={{
                    fontFamily: theme.fonts.display,
                    fontSize: 26,
                    fontWeight: 800,
                    color: theme.colors.headlineDark,
                    marginTop: 6,
                  }}
                >
                  140,000+
                </div>
              </div>

              <div
                style={{
                  padding: "20px 18px",
                  borderRadius: 14,
                  backgroundColor: "#F5F3EE",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <div
                  style={{
                    fontFamily: theme.fonts.mono,
                    fontSize: 12,
                    color: "#78716C",
                    letterSpacing: "0.08em",
                  }}
                >
                  COMMAND HQ
                </div>
                <div
                  style={{
                    fontFamily: theme.fonts.display,
                    fontSize: 26,
                    fontWeight: 800,
                    color: theme.colors.headlineDark,
                    marginTop: 6,
                  }}
                >
                  WPAFB
                </div>
              </div>
            </div>
          </div>
        </FloatingCard>
      </div>
    </StudioLayout>
  );
};
