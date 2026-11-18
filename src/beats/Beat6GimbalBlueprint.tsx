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

export const Beat6GimbalBlueprint: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Part A vs Part B switch at local frame 210 (0:41.5 in VO)
  const isBlueprintMode = frame >= 210;

  // Camera drift
  const camScale = interpolate(frame, [0, 690], [1.0, 1.05], {
    easing: theme.ease.inOut,
  });

  // Entrance spring on Frame 0
  const entrance = spring({
    frame,
    fps,
    config: theme.spring.cardSnap,
  });
  const translateY = interpolate(entrance, [0, 1], [40, 0]);

  // Part B Blueprint entrance spring
  const bpFrame = Math.max(0, frame - 210);
  const bpEntrance = spring({
    frame: bpFrame,
    fps,
    config: theme.spring.punch,
  });
  const bpScale = interpolate(bpEntrance, [0, 1], [0.94, 1.0]);

  // Callout 1: "NO WINGS" at local frame 330 (0:43.5 in VO)
  const callout1Spring = spring({
    frame: frame - 330,
    fps,
    config: theme.spring.slam,
  });
  const callout1Scale = interpolate(callout1Spring, [0, 1], [1.4, 1.0]);
  const callout1Opacity = interpolate(callout1Spring, [0, 1], [0, 1]);

  // Callout 2: "NO EXHAUST" at local frame 450 (0:45.5 in VO)
  const callout2Spring = spring({
    frame: frame - 450,
    fps,
    config: theme.spring.slam,
  });
  const callout2Scale = interpolate(callout2Spring, [0, 1], [1.4, 1.0]);
  const callout2Opacity = interpolate(callout2Spring, [0, 1], [0, 1]);

  // Callout 3: "ROTATING IN MID-AIR" at local frame 570 (0:47.5 in VO)
  const callout3Spring = spring({
    frame: frame - 570,
    fps,
    config: theme.spring.slam,
  });
  const callout3Scale = interpolate(callout3Spring, [0, 1], [1.4, 1.0]);
  const callout3Opacity = interpolate(callout3Spring, [0, 1], [0, 1]);

  // Physical rotation of the craft on "rotating in mid-air" (frames 570 to 680)
  const rotationProgress = interpolate(frame, [570, 660], [0, 1], {
    easing: theme.ease.outExpo,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const craftRotation = interpolate(rotationProgress, [0, 1], [0, 115]);

  // Screen shake on rotation activation
  const isRotatingShake = frame >= 570 && frame <= 578;
  const shakeX = isRotatingShake ? Math.sin((frame - 570) * 3) * 6 : 0;
  const shakeY = isRotatingShake ? Math.cos((frame - 570) * 3.5) * 5 : 0;

  // Header dynamic update
  const badge = isBlueprintMode
    ? "• ATFLIR TARGETING POD // TELEMETRY ANALYSIS"
    : "• 2017 // DOD OFFICIAL DECLASSIFICATION";
  const headline = isBlueprintMode
    ? "Defying Aerodynamics."
    : "2017. Pentagon Confirms.";
  const subtitle = isBlueprintMode
    ? "Object exhibits zero aerodynamic control surfaces, no wings, and zero thermal plume."
    : "Declassified US Navy FLIR capture authenticated by the Department of Defense.";

  return (
    <StudioLayout badge={badge} headline={headline} subtitle={subtitle}>
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `translateY(${translateY}px) scale(${camScale}) translate(${shakeX}px, ${shakeY}px)`,
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
                  backgroundColor: theme.colors.radarGreen,
                  boxShadow: "0 0 10px rgba(52, 211, 153, 0.8)",
                }}
              />
              <span
                style={{
                  fontFamily: theme.fonts.mono,
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  color: theme.colors.radarGreen,
                  textTransform: "uppercase",
                }}
              >
                {isBlueprintMode
                  ? "SYSTEM: RAYTHEON AN/ASQ-228 ATFLIR"
                  : "NAVY VIDEO: GIMBAL.WMV // UNCLASSIFIED"}
              </span>
            </div>
            <span
              style={{
                fontFamily: theme.fonts.mono,
                fontSize: 13,
                color: theme.colors.textMuted,
              }}
            >
              F/A-18F SUPER HORNET
            </span>
          </div>

          {/* Main Visual Content */}
          <div
            style={{
              flex: 1,
              position: "relative",
              overflow: "hidden",
              backgroundColor: "#0A0C10",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {!isBlueprintMode ? (
              /* PART A: REAL NAVY GIMBAL CAPTURE (0 - 210) */
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* The Real Navy FLIR Frame */}
                <Img
                  src={staticFile("Assets/proof 4.webp")}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    filter: "contrast(1.2) brightness(0.95)",
                  }}
                />

                {/* Military HUD Overlays */}
                <div
                  style={{
                    position: "absolute",
                    top: 24,
                    left: 24,
                    fontFamily: theme.fonts.mono,
                    fontSize: 13,
                    color: theme.colors.radarGreen,
                    letterSpacing: "0.08em",
                    lineHeight: 1.6,
                    textShadow: "0 0 8px rgba(52, 211, 153, 0.6)",
                  }}
                >
                  <div>ALT: 25,010 FT</div>
                  <div>MACH: 0.58</div>
                  <div>MODE: NAR // WFOV</div>
                </div>

                <div
                  style={{
                    position: "absolute",
                    top: 24,
                    right: 24,
                    fontFamily: theme.fonts.mono,
                    fontSize: 13,
                    color: theme.colors.radarGreen,
                    letterSpacing: "0.08em",
                    lineHeight: 1.6,
                    textAlign: "right",
                    textShadow: "0 0 8px rgba(52, 211, 153, 0.6)",
                  }}
                >
                  <div>TGT: UNKNOWN</div>
                  <div>RNG: 8.2 NM</div>
                  <div>IR: WHITE HOT</div>
                </div>

                {/* Dynamic Tracking Reticle */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 140,
                    height: 140,
                    border: "2px solid rgba(52, 211, 153, 0.8)",
                    borderRadius: 4,
                    boxShadow: "0 0 15px rgba(52, 211, 153, 0.4)",
                    pointerEvents: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      border: "2px solid rgba(52, 211, 153, 0.9)",
                      borderRadius: "50%",
                    }}
                  />
                </div>
              </div>
            ) : (
              /* PART B: CUSTOM VISUAL B - UAP BLUEPRINT WITH CALLOUTS (210 - 690) */
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  transform: `scale(${bpScale})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Custom Generated Blueprint Background */}
                <Img
                  src={staticFile("Assets/generated/uap_blueprint.jpg")}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "contrast(1.15) brightness(0.9)",
                    transform: `rotate(${craftRotation * 0.15}deg)`,
                  }}
                />

                {/* Center Rotating Craft Overlay Graphic */}
                <div
                  style={{
                    position: "absolute",
                    top: "48%",
                    left: "50%",
                    transform: `translate(-50%, -50%) rotate(${craftRotation}deg)`,
                    width: 220,
                    height: 120,
                    pointerEvents: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {/* Glowing Aerodynamic Hull Ring */}
                  <div
                    style={{
                      width: 180,
                      height: 80,
                      borderRadius: "50%",
                      border: `2px solid ${
                        frame >= 570
                          ? theme.colors.crimsonClassified
                          : "rgba(56, 189, 248, 0.8)"
                      }`,
                      boxShadow:
                        frame >= 570
                          ? "0 0 25px rgba(220, 38, 38, 0.8)"
                          : "0 0 20px rgba(56, 189, 248, 0.6)",
                      backgroundColor: "rgba(14, 21, 33, 0.4)",
                    }}
                  />
                </div>

                {/* CALLOUT 1: NO WINGS (Frame 330+) */}
                {frame >= 330 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "22%",
                      left: "8%",
                      transform: `scale(${callout1Scale})`,
                      opacity: callout1Opacity,
                      padding: "10px 18px",
                      borderRadius: 6,
                      backgroundColor: "rgba(10, 12, 16, 0.94)",
                      border: `1.5px solid ${theme.colors.crimsonClassified}`,
                      boxShadow: "0 0 20px rgba(220, 38, 38, 0.4)",
                      zIndex: 20,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: theme.fonts.mono,
                        fontSize: 14,
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                        color: theme.colors.crimsonClassified,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <span>✕</span>
                      <span>NO WINGS / SURFACES</span>
                    </div>
                    <div
                      style={{
                        fontFamily: theme.fonts.mono,
                        fontSize: 11,
                        color: theme.colors.textSecondary,
                        marginTop: 4,
                      }}
                    >
                      Zero flight control surfaces detected
                    </div>
                  </div>
                )}

                {/* CALLOUT 2: NO EXHAUST (Frame 450+) */}
                {frame >= 450 && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "24%",
                      right: "8%",
                      transform: `scale(${callout2Scale})`,
                      opacity: callout2Opacity,
                      padding: "10px 18px",
                      borderRadius: 6,
                      backgroundColor: "rgba(10, 12, 16, 0.94)",
                      border: `1.5px solid ${theme.colors.crimsonClassified}`,
                      boxShadow: "0 0 20px rgba(220, 38, 38, 0.4)",
                      zIndex: 20,
                      textAlign: "right",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: theme.fonts.mono,
                        fontSize: 14,
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                        color: theme.colors.crimsonClassified,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: 8,
                      }}
                    >
                      <span>ZERO THERMAL PLUME</span>
                      <span>✕</span>
                    </div>
                    <div
                      style={{
                        fontFamily: theme.fonts.mono,
                        fontSize: 11,
                        color: theme.colors.textSecondary,
                        marginTop: 4,
                      }}
                    >
                      No combustion or heat signature
                    </div>
                  </div>
                )}

                {/* CALLOUT 3: ROTATING IN MID-AIR (Frame 570+) */}
                {frame >= 570 && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "10%",
                      left: "50%",
                      transform: `translateX(-50%) scale(${callout3Scale})`,
                      opacity: callout3Opacity,
                      padding: "12px 24px",
                      borderRadius: 8,
                      backgroundColor: "rgba(220, 38, 38, 0.16)",
                      border: `2px solid ${theme.colors.crimsonClassified}`,
                      boxShadow: "0 0 30px rgba(220, 38, 38, 0.6)",
                      zIndex: 25,
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 22,
                        color: theme.colors.crimsonClassified,
                        display: "inline-block",
                        transform: `rotate(${craftRotation}deg)`,
                      }}
                    >
                      ↻
                    </span>
                    <div>
                      <div
                        style={{
                          fontFamily: theme.fonts.mono,
                          fontSize: 15,
                          fontWeight: 900,
                          letterSpacing: "0.1em",
                          color: theme.colors.crimsonClassified,
                        }}
                      >
                        ROTATING 120° IN MID-AIR
                      </div>
                      <div
                        style={{
                          fontFamily: theme.fonts.mono,
                          fontSize: 11,
                          color: theme.colors.textPrimary,
                          marginTop: 2,
                        }}
                      >
                        Defying standard aerodynamic lift mechanics
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Subtle Vignette Overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse at center, transparent 40%, rgba(9, 10, 13, 0.8) 100%)",
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
                RECORDING SENSOR
              </div>
              <div
                style={{
                  fontFamily: theme.fonts.display,
                  fontSize: 16,
                  fontWeight: 600,
                  color: theme.colors.textPrimary,
                }}
              >
                Forward-Looking Infrared (FLIR)
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
                AUTHENTICATION
              </div>
              <div
                style={{
                  fontFamily: theme.fonts.mono,
                  fontSize: 14,
                  fontWeight: 700,
                  color: theme.colors.radarGreen,
                }}
              >
                OFFICIAL DOD RECORD
              </div>
            </div>
          </div>
        </FloatingCard>
      </div>
    </StudioLayout>
  );
};
