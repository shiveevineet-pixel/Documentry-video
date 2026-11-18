import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { StudioLayout, FloatingCard } from "../components/StudioCard";
import { theme } from "../theme";

export const Cut10DataUnexplained: React.FC = () => {
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

  // Bar fill progress (frames 10 to 60)
  const barProgress = interpolate(frame, [10, 60], [0, 100], {
    easing: theme.ease.outExpo,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <StudioLayout
      badge="• CATEGORY: UNIDENTIFIED // RESIDUAL ANOMALIES"
      headline="701 left unexplained."
      subtitle="Cases that defied all conventional or weather explanations."
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
            {/* Top Stat Section */}
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "6px 14px",
                  borderRadius: 6,
                  backgroundColor: "rgba(185, 28, 28, 0.08)",
                  border: "1px solid rgba(185, 28, 28, 0.2)",
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    fontFamily: theme.fonts.mono,
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color: theme.colors.crimsonRed,
                  }}
                >
                  UNKNOWN AERIAL PHENOMENA // 5.5% RESIDUAL
                </span>
              </div>

              <div
                style={{
                  fontFamily: theme.fonts.display,
                  fontSize: 120,
                  fontWeight: 900,
                  letterSpacing: "-0.05em",
                  color: theme.colors.crimsonRed,
                  lineHeight: 1,
                  margin: "12px 0 16px 0",
                }}
              >
                701
              </div>

              <p
                style={{
                  fontFamily: theme.fonts.display,
                  fontSize: 22,
                  color: "#57534E",
                  lineHeight: 1.4,
                  margin: 0,
                }}
              >
                Categorized by the Air Force as strictly <strong>"Unidentified"</strong> after
                exhausting astronomical, atmospheric, and aircraft models.
              </p>

              {/* Horizontal Comparison Bar */}
              <div style={{ marginTop: 36 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: theme.fonts.mono,
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#78716C",
                    marginBottom: 10,
                  }}
                >
                  <span>EXPLAINED: 11,917 (94.5%)</span>
                  <span style={{ color: theme.colors.crimsonRed, fontWeight: 700 }}>
                    UNEXPLAINED: 701 (5.5%)
                  </span>
                </div>

                <div
                  style={{
                    width: "100%",
                    height: 24,
                    backgroundColor: "#E2E8F0",
                    borderRadius: 999,
                    overflow: "hidden",
                    display: "flex",
                  }}
                >
                  {/* Explained portion */}
                  <div
                    style={{
                      width: `${(barProgress * 94.5) / 100}%`,
                      height: "100%",
                      backgroundColor: "#94A3B8",
                    }}
                  />
                  {/* Unexplained portion */}
                  <div
                    style={{
                      width: `${(barProgress * 5.5) / 100}%`,
                      height: "100%",
                      backgroundColor: theme.colors.crimsonRed,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom 4 Historical Incident Pills */}
            <div>
              <div
                style={{
                  fontFamily: theme.fonts.mono,
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: "#78716C",
                  marginBottom: 14,
                  textTransform: "uppercase",
                }}
              >
                KEY UNRESOLVED INCIDENTS
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                {[
                  { name: "ROSWELL INCIDENT", year: "1947", loc: "NEW MEXICO" },
                  { name: "CAPITOL AIRSPACE", year: "1952", loc: "WASHINGTON D.C." },
                  { name: "PHOENIX LIGHTS", year: "1997", loc: "ARIZONA" },
                  { name: "USS NIMITZ / FLIR", year: "2004", loc: "PACIFIC OCEAN" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "12px 16px",
                      borderRadius: 10,
                      backgroundColor: "#F5F3EE",
                      border: "1px solid rgba(0,0,0,0.06)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontFamily: theme.fonts.display,
                          fontSize: 15,
                          fontWeight: 700,
                          color: theme.colors.headlineDark,
                          display: "block",
                        }}
                      >
                        {item.name}
                      </span>
                      <span
                        style={{
                          fontFamily: theme.fonts.mono,
                          fontSize: 12,
                          color: "#78716C",
                        }}
                      >
                        {item.loc}
                      </span>
                    </div>
                    <span
                      style={{
                        fontFamily: theme.fonts.mono,
                        fontSize: 13,
                        fontWeight: 700,
                        color: theme.colors.crimsonRed,
                      }}
                    >
                      {item.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FloatingCard>
      </div>
    </StudioLayout>
  );
};
