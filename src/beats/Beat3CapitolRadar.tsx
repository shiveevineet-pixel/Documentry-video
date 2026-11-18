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

export const Beat3CapitolRadar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Part A vs Part B switch at local frame 210 (16.5s in composition)
  const isRadarVisual = frame >= 210;

  // Camera drift
  const camScale = interpolate(frame, [0, 510], [1.0, 1.05], {
    easing: theme.ease.inOut,
  });

  // Part A Animations (Frames 0 to 210)
  const orbsEntrance = spring({
    frame,
    fps,
    config: theme.spring.cardSnap,
  });
  const orbsScale = interpolate(orbsEntrance, [0, 1], [0.95, 1.0]);
  const reticlePulse = 1 + 0.05 * Math.sin(frame * 0.25);

  // Part B Animations (Frames 210 to 510) - Custom Visual A
  const radarFrame = Math.max(0, frame - 210);
  const radarEntrance = spring({
    frame: radarFrame,
    fps,
    config: theme.spring.punch,
  });
  const radarScale = interpolate(radarEntrance, [0, 1], [0.94, 1.0]);

  // F-94 Interceptors vectoring toward center (frames 0 to 150 of Part B)
  const jetProgress = interpolate(radarFrame, [0, 140], [0, 1], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const jet1X = interpolate(jetProgress, [0, 1], [-180, -60]);
  const jet1Y = interpolate(jetProgress, [0, 1], [180, 40]);

  // Hypersonic Outrun Streak on "The objects outran them all" (radarFrame 150 / composition frame 1140 / 19.0s)
  const outrunProgress = interpolate(radarFrame, [145, 185], [0, 1], {
    easing: theme.ease.outExpo,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ufoStreakX = interpolate(outrunProgress, [0, 1], [40, 420]);
  const ufoStreakY = interpolate(outrunProgress, [0, 1], [-40, -320]);
  const ufoOpacity = interpolate(outrunProgress, [0, 0.8, 1], [1, 1, 0]);

  // Radar sweep angle
  const sweepAngle = (radarFrame * 3.5) % 360;

  return (
    <StudioLayout
      badge={
        isRadarVisual
          ? "• AIR DEFENSE INTERCEPT // F-94 STARFIRE"
          : "• 1952 // RESTRICTED AIRSPACE"
      }
      headline={isRadarVisual ? "Scrambled & Outrun." : "Over the Capitol."}
      subtitle={
        isRadarVisual
          ? "Air Force jets vector toward targets; objects accelerate beyond 7,200 MPH."
          : "July 1952: Unidentified luminous craft hover directly above the Capitol dome."
      }
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${camScale})`,
        }}
      >
        {!isRadarVisual ? (
          /* PART A: 1952 U.S. CAPITOL SIGHTING */
          <FloatingCard style={{ transform: `scale(${orbsScale})` }}>
            <div
              style={{
                height: 52,
                padding: "0 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                backgroundColor: "rgba(16, 19, 24, 0.95)",
              }}
            >
              <span
                style={{
                  fontFamily: theme.fonts.mono,
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  color: theme.colors.textSecondary,
                }}
              >
                WASHINGTON NATIONAL AIRPORT // RADAR & VISUAL
              </span>
              <span
                style={{
                  fontFamily: theme.fonts.mono,
                  fontSize: 14,
                  fontWeight: 700,
                  color: theme.colors.radarGreen,
                }}
              >
                VISUAL CONFIRMATION
              </span>
            </div>

            <div
              style={{
                width: "100%",
                height: "calc(100% - 52px)",
                overflow: "hidden",
                position: "relative",
                backgroundColor: "#0D0E12",
              }}
            >
              <Img
                src={staticFile("Assets/images.jpeg")}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center 45%",
                  filter: "contrast(1.2) brightness(1.05)",
                }}
              />

              {/* Tactical Pulsing Reticle Rings around glowing orbs */}
              <div
                style={{
                  position: "absolute",
                  top: "22%",
                  left: "38%",
                  width: 140,
                  height: 140,
                  borderRadius: "50%",
                  border: "2px dashed #34D399",
                  boxShadow: "0 0 25px rgba(52, 211, 153, 0.7)",
                  transform: `scale(${reticlePulse}) translate(-50%, -50%)`,
                  pointerEvents: "none",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "#34D399",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </div>

              {/* Tactical Telemetry Badge */}
              <div
                style={{
                  position: "absolute",
                  top: 24,
                  right: 24,
                  padding: "10px 18px",
                  borderRadius: 8,
                  backgroundColor: "rgba(10, 14, 20, 0.9)",
                  border: "1px solid rgba(52, 211, 153, 0.4)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div
                  style={{
                    fontFamily: theme.fonts.mono,
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#34D399",
                    letterSpacing: "0.1em",
                  }}
                >
                  TARGET GROUP // D.C. AIRSPACE
                </div>
                <div
                  style={{
                    fontFamily: theme.fonts.mono,
                    fontSize: 12,
                    color: "#A1A1AA",
                    marginTop: 4,
                  }}
                >
                  38°53'23"N 77°00'32"W • 7 TARGETS
                </div>
              </div>

              {/* Bottom Quote Pill */}
              <div
                style={{
                  position: "absolute",
                  bottom: 24,
                  left: 24,
                  right: 24,
                  padding: "14px 20px",
                  borderRadius: 12,
                  backgroundColor: "rgba(15, 18, 24, 0.94)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <span
                  style={{
                    fontFamily: theme.fonts.display,
                    fontSize: 18,
                    fontWeight: 600,
                    color: theme.colors.textPrimary,
                  }}
                >
                  "Objects hovered over the White House and Capitol dome."
                </span>
                <span
                  style={{
                    display: "block",
                    fontFamily: theme.fonts.mono,
                    fontSize: 12,
                    color: theme.colors.textMuted,
                    marginTop: 4,
                  }}
                >
                  — CIVIL AERONAUTICS ADMINISTRATION (CAA) LOGS
                </span>
              </div>
            </div>
          </FloatingCard>
        ) : (
          /* PART B: CUSTOM VISUAL A — 1952 RADAR INTERCEPT DISPLAY */
          <FloatingCard style={{ transform: `scale(${radarScale})` }}>
            <div
              style={{
                height: 52,
                padding: "0 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid rgba(52, 211, 153, 0.2)",
                backgroundColor: "rgba(8, 12, 10, 0.95)",
              }}
            >
              <span
                style={{
                  fontFamily: theme.fonts.mono,
                  fontSize: 15,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: "#34D399",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "#34D399",
                    boxShadow: "0 0 10px #34D399",
                  }}
                />
                RADAR SCOPE // AIR DEFENSE SECTOR
              </span>
              <span
                style={{
                  fontFamily: theme.fonts.mono,
                  fontSize: 13,
                  fontWeight: 700,
                  color: radarFrame >= 150 ? theme.colors.crimsonClassified : "#F59E0B",
                }}
              >
                {radarFrame >= 150 ? "TARGET OUTRUN // MACH 9+" : "INTERCEPT IN PROGRESS"}
              </span>
            </div>

            <div
              style={{
                width: "100%",
                height: "calc(100% - 52px)",
                overflow: "hidden",
                position: "relative",
                backgroundColor: "#050807",
              }}
            >
              {/* Generated Radar Scope Screen Asset */}
              <Img
                src={staticFile("Assets/generated/radar_scope.jpg")}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  filter: "contrast(1.25) brightness(1.1)",
                }}
              />

              {/* Dynamic Animated Radar Sweep Line Overlay */}
              <div
                style={{
                  position: "absolute",
                  top: "46%",
                  left: "50%",
                  width: 320,
                  height: 2,
                  background:
                    "linear-gradient(90deg, rgba(52, 211, 153, 0.9) 0%, rgba(52, 211, 153, 0) 100%)",
                  transformOrigin: "left center",
                  transform: `rotate(${sweepAngle}deg)`,
                  boxShadow: "0 0 12px rgba(52, 211, 153, 0.8)",
                  pointerEvents: "none",
                }}
              />

              {/* F-94 Starfire Interceptor Blips Vectoring */}
              <div
                style={{
                  position: "absolute",
                  top: "46%",
                  left: "50%",
                  transform: `translate(${jet1X}px, ${jet1Y}px)`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  pointerEvents: "none",
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    border: "2px solid #60A5FA",
                    transform: "rotate(45deg)",
                    boxShadow: "0 0 10px #60A5FA",
                  }}
                />
                <span
                  style={{
                    fontFamily: theme.fonts.mono,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#93C5FD",
                    marginTop: 4,
                  }}
                >
                  F-94 [450 KTS]
                </span>
              </div>

              {/* Hypersonic UFO Target Blip & Escape Vector Trail */}
              <div
                style={{
                  position: "absolute",
                  top: "46%",
                  left: "50%",
                  transform: `translate(${ufoStreakX}px, ${ufoStreakY}px)`,
                  opacity: ufoOpacity,
                  pointerEvents: "none",
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    backgroundColor: "#34D399",
                    boxShadow: "0 0 25px #34D399, 0 0 50px #34D399",
                  }}
                />
                {radarFrame >= 145 && (
                  <div
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 16,
                      width: 220,
                      height: 3,
                      background:
                        "linear-gradient(270deg, rgba(52, 211, 153, 0.9) 0%, transparent 100%)",
                      transform: "rotate(38deg)",
                      transformOrigin: "right center",
                      boxShadow: "0 0 15px #34D399",
                    }}
                  />
                )}
              </div>

              {/* Real-time Telemetry Overlay Card */}
              <div
                style={{
                  position: "absolute",
                  bottom: 20,
                  left: 20,
                  right: 20,
                  padding: "14px 18px",
                  borderRadius: 10,
                  backgroundColor: "rgba(5, 10, 8, 0.92)",
                  border: "1px solid rgba(52, 211, 153, 0.3)",
                  backdropFilter: "blur(8px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ fontFamily: theme.fonts.mono, fontSize: 13, color: "#94A3B8" }}>
                  <div>INTERCEPTOR SPEED: 520 MPH</div>
                  <div style={{ color: "#34D399", fontWeight: 700, marginTop: 4 }}>
                    TARGET ESCAPE SPEED: 7,200+ MPH (MACH 9.4)
                  </div>
                </div>
                <span
                  style={{
                    fontFamily: theme.fonts.mono,
                    fontSize: 13,
                    fontWeight: 700,
                    color: radarFrame >= 150 ? theme.colors.crimsonClassified : "#34D399",
                    padding: "6px 12px",
                    borderRadius: 6,
                    backgroundColor: "rgba(255, 255, 255, 0.06)",
                  }}
                >
                  {radarFrame >= 150 ? "RADAR LOCK LOST" : "PURSUIT"}
                </span>
              </div>
            </div>
          </FloatingCard>
        )}
      </div>
    </StudioLayout>
  );
};
