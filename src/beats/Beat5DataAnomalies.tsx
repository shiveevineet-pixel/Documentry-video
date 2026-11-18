import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { StudioLayout, FloatingCard } from "../components/StudioCard";
import { theme } from "../theme";

export const Beat5DataAnomalies: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Switch to Anomaly focus at local frame 300 (0:34.5 in VO on "and 701 were left unexplained")
  const isAnomalyFocus = frame >= 300;

  // Entrance spring on Frame 0
  const entrance = spring({
    frame,
    fps,
    config: theme.spring.cardSnap,
  });
  const translateY = interpolate(entrance, [0, 1], [40, 0]);

  // Rolling counter for total cases (0 -> 12,618)
  const countProgress = interpolate(frame, [15, 170], [0, 12618], {
    easing: theme.ease.outExpo,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const displayTotalCount = Math.round(countProgress).toLocaleString();

  // Rolling counter for unexplained (0 -> 701)
  const anomalyCountProgress = interpolate(frame, [305, 380], [0, 701], {
    easing: theme.ease.outExpo,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const displayAnomalyCount = Math.round(anomalyCountProgress);

  // Transition spring to Anomaly Focus at frame 300
  const anomalySpring = spring({
    frame: frame - 300,
    fps,
    config: theme.spring.slam,
  });
  const anomalyScale = interpolate(anomalySpring, [0, 1], [1.3, 1.0]);
  const anomalyCardScale = interpolate(anomalySpring, [0, 1], [1.0, 1.03]);

  // Impact shake when 701 slams in
  const isAnomalyShaking = frame >= 300 && frame <= 308;
  const shakeX = isAnomalyShaking ? Math.sin((frame - 300) * 3) * 6 : 0;
  const shakeY = isAnomalyShaking ? Math.cos((frame - 300) * 3.5) * 5 : 0;

  // Bar chart fill animations
  const barFill1 = interpolate(frame, [40, 120], [0, 94.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.ease.outExpo,
  });
  const barFill2 = interpolate(frame, [70, 150], [0, 5.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.ease.outExpo,
  });

  const badge = isAnomalyFocus
    ? "• CLASSIFICATION BREAKDOWN // UNRESOLVED"
    : "• PROJECT BLUE BOOK // 17-YEAR ARCHIVE";
  const headline = isAnomalyFocus
    ? "701 Left Unexplained."
    : "17 Years. 12,618 Cases.";
  const subtitle = isAnomalyFocus
    ? "Cases where radar tracking, pilot testimony, and physical evidence defied explanation."
    : "Between 1952 and 1969, the United States Air Force systematically tracked every reported craft.";

  return (
    <StudioLayout badge={badge} headline={headline} subtitle={subtitle}>
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `translateY(${translateY}px) scale(${anomalyCardScale}) translate(${shakeX}px, ${shakeY}px)`,
        }}
      >
        <FloatingCard>
          {/* Card Top Metadata Header */}
          <div
            style={{
              height: 52,
              padding: "0 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              backgroundColor: "rgba(16, 19, 24, 0.95)",
              zIndex: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: isAnomalyFocus
                    ? theme.colors.crimsonClassified
                    : theme.colors.radarGreen,
                  boxShadow: isAnomalyFocus
                    ? "0 0 10px rgba(220, 38, 38, 0.8)"
                    : "0 0 8px rgba(52, 211, 153, 0.6)",
                }}
              />
              <span
                style={{
                  fontFamily: theme.fonts.mono,
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  color: isAnomalyFocus
                    ? theme.colors.crimsonClassified
                    : theme.colors.textSecondary,
                  textTransform: "uppercase",
                }}
              >
                {isAnomalyFocus
                  ? "CATEGORY: ZERO EXPLANATION (701)"
                  : "DATA REGISTRY: 1952–1969 FINAL REPORT"}
              </span>
            </div>
            <span
              style={{
                fontFamily: theme.fonts.mono,
                fontSize: 13,
                color: theme.colors.textMuted,
              }}
            >
              AIR FORCE RECORD GROUP 341
            </span>
          </div>

          {/* Tactical Visual Display Area */}
          <div
            style={{
              flex: 1,
              position: "relative",
              overflow: "hidden",
              backgroundColor: "#111318",
              padding: "36px 32px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Background Grid Pattern */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
                opacity: 0.6,
                pointerEvents: "none",
              }}
            />

            {!isAnomalyFocus ? (
              /* PART A: 12,618 TOTAL CASES ROLLUP */
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  justifyContent: "space-between",
                  zIndex: 2,
                }}
              >
                {/* Hero Number */}
                <div>
                  <div
                    style={{
                      fontFamily: theme.fonts.mono,
                      fontSize: 14,
                      fontWeight: 600,
                      letterSpacing: "0.15em",
                      color: theme.colors.textAmber,
                      marginBottom: 8,
                      textTransform: "uppercase",
                    }}
                  >
                    TOTAL SIGHTINGS INVESTIGATED
                  </div>
                  <div
                    style={{
                      fontFamily: theme.fonts.display,
                      fontSize: 88,
                      fontWeight: 900,
                      letterSpacing: "-0.04em",
                      lineHeight: 0.95,
                      color: theme.colors.textPrimary,
                    }}
                  >
                    {displayTotalCount}
                  </div>
                  <div
                    style={{
                      fontFamily: theme.fonts.mono,
                      fontSize: 13,
                      color: theme.colors.textMuted,
                      marginTop: 10,
                      letterSpacing: "0.04em",
                    }}
                  >
                    17 CONSECUTIVE YEARS OF LOGGED AIR FORCE REPORTS
                  </div>
                </div>

                {/* Comparative Distribution Breakdown */}
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 8,
                        fontFamily: theme.fonts.mono,
                        fontSize: 13,
                      }}
                    >
                      <span style={{ color: theme.colors.textSecondary }}>
                        IDENTIFIED (AIRCRAFT / WEATHER / STARS)
                      </span>
                      <span style={{ color: theme.colors.textPrimary, fontWeight: 700 }}>
                        11,917 (94.5%)
                      </span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: 12,
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                        borderRadius: 6,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${barFill1}%`,
                          height: "100%",
                          backgroundColor: "#3B82F6",
                          borderRadius: 6,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 8,
                        fontFamily: theme.fonts.mono,
                        fontSize: 13,
                      }}
                    >
                      <span style={{ color: theme.colors.crimsonClassified, fontWeight: 700 }}>
                        OFFICIALLY UNEXPLAINED
                      </span>
                      <span style={{ color: theme.colors.crimsonClassified, fontWeight: 800 }}>
                        701 (5.5%)
                      </span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: 12,
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                        borderRadius: 6,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${barFill2}%`,
                          height: "100%",
                          backgroundColor: theme.colors.crimsonClassified,
                          borderRadius: 6,
                          boxShadow: "0 0 12px rgba(220, 38, 38, 0.8)",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Archival Note Pill */}
                <div
                  style={{
                    padding: "12px 18px",
                    borderRadius: 8,
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span style={{ color: theme.colors.textAmber, fontSize: 16 }}>⚠</span>
                  <span
                    style={{
                      fontFamily: theme.fonts.mono,
                      fontSize: 12,
                      color: theme.colors.textSecondary,
                      letterSpacing: "0.02em",
                      lineHeight: 1.4,
                    }}
                  >
                    INVESTIGATION CRITERIA: ALL MULTI-RADAR AND TRAINED OBSERVER CONTACTS.
                  </span>
                </div>
              </div>
            ) : (
              /* PART B: 701 UNEXPLAINED ANOMALIES FOCUS */
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  justifyContent: "space-between",
                  transform: `scale(${anomalyScale})`,
                  transformOrigin: "center center",
                  zIndex: 2,
                }}
              >
                {/* Massive 701 Hero Display */}
                <div>
                  <div
                    style={{
                      fontFamily: theme.fonts.mono,
                      fontSize: 14,
                      fontWeight: 700,
                      letterSpacing: "0.2em",
                      color: theme.colors.crimsonClassified,
                      marginBottom: 4,
                      textTransform: "uppercase",
                    }}
                  >
                    UNRESOLVED PHENOMENA
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 16,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: theme.fonts.display,
                        fontSize: 104,
                        fontWeight: 900,
                        letterSpacing: "-0.05em",
                        lineHeight: 0.9,
                        color: theme.colors.crimsonClassified,
                        textShadow: "0 0 35px rgba(220, 38, 38, 0.6)",
                      }}
                    >
                      {displayAnomalyCount}
                    </span>
                    <span
                      style={{
                        fontFamily: theme.fonts.mono,
                        fontSize: 22,
                        fontWeight: 700,
                        color: theme.colors.textSecondary,
                      }}
                    >
                      / 12,618
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: theme.fonts.mono,
                      fontSize: 13,
                      color: theme.colors.textAmber,
                      marginTop: 8,
                      letterSpacing: "0.06em",
                      fontWeight: 600,
                    }}
                  >
                    NO RECOGNIZABLE PROPULSION OR KNOWN AIRCRAFT PROFILE
                  </div>
                </div>

                {/* Notable Unresolved Case Badges */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    {
                      id: "CASE #0144",
                      loc: "WASHINGTON D.C. // 1952",
                      desc: "Mach 9 radar lock + visual scrambles",
                    },
                    {
                      id: "CASE #0821",
                      loc: "SOCORRO, NM // 1964",
                      desc: "Landing marks & officer Lonnie Zamora",
                    },
                    {
                      id: "CASE #1042",
                      loc: "MINOT AFB, ND // 1968",
                      desc: "Echo flight ICBM warhead shutdown",
                    },
                  ].map((c, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "10px 16px",
                        borderRadius: 6,
                        backgroundColor: "rgba(220, 38, 38, 0.08)",
                        border: "1px solid rgba(220, 38, 38, 0.25)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontFamily: theme.fonts.mono,
                            fontSize: 12,
                            fontWeight: 700,
                            color: theme.colors.crimsonClassified,
                            marginRight: 10,
                          }}
                        >
                          {c.id}
                        </span>
                        <span
                          style={{
                            fontFamily: theme.fonts.mono,
                            fontSize: 12,
                            color: theme.colors.textPrimary,
                          }}
                        >
                          {c.loc}
                        </span>
                      </div>
                      <span
                        style={{
                          fontFamily: theme.fonts.mono,
                          fontSize: 11,
                          color: theme.colors.textSecondary,
                        }}
                      >
                        {c.desc}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Final Verdict Banner */}
                <div
                  style={{
                    padding: "12px 16px",
                    borderRadius: 6,
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    fontFamily: theme.fonts.mono,
                    fontSize: 12,
                    color: theme.colors.textSecondary,
                    textAlign: "center",
                    letterSpacing: "0.06em",
                  }}
                >
                  NATIONAL ARCHIVES RECORD: CLASSIFIED FINDINGS REMAIN UNRESOLVED
                </div>
              </div>
            )}

            {/* Subtle Vignette Overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse at center, transparent 40%, rgba(9, 10, 13, 0.75) 100%)",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Card Bottom Footer */}
          <div
            style={{
              padding: "18px 24px",
              backgroundColor: "rgba(16, 19, 24, 0.98)",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: theme.fonts.mono,
                  fontSize: 12,
                  color: theme.colors.textMuted,
                  letterSpacing: "0.08em",
                  marginBottom: 2,
                }}
              >
                AIR FORCE CONCLUSION
              </div>
              <div
                style={{
                  fontFamily: theme.fonts.display,
                  fontSize: 16,
                  fontWeight: 600,
                  color: theme.colors.textPrimary,
                }}
              >
                No Threat to National Security
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontFamily: theme.fonts.mono,
                  fontSize: 12,
                  color: theme.colors.textMuted,
                  letterSpacing: "0.08em",
                  marginBottom: 2,
                }}
              >
                INDEPENDENT SCIENTIFIC REVIEW
              </div>
              <div
                style={{
                  fontFamily: theme.fonts.mono,
                  fontSize: 14,
                  fontWeight: 700,
                  color: theme.colors.crimsonClassified,
                }}
              >
                5.5% ANOMALOUS RESIDUAL
              </div>
            </div>
          </div>
        </FloatingCard>
      </div>
    </StudioLayout>
  );
};
