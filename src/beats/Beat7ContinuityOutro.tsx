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
import { StudioLayout, FloatingCard } from "../components/StudioCard";
import { theme } from "../theme";

export const Beat7ContinuityOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase selection:
  // Phase 1 (0 to 150): Split comparative view "70 years apart, the same anomalies"
  // Phase 2 (150 to 360): Rapid 4-case flash "Roswell, the Capitol, Blue Book, Gimbal"
  // Phase 3 (360 to 630): Final Darkroom Statement "The files are open. The answers remain classified."
  const isPhase1 = frame < 150;
  const isPhase2 = frame >= 150 && frame < 360;
  const isPhase3 = frame >= 360;

  // Phase 1 Entrance
  const p1Spring = spring({
    frame,
    fps,
    config: theme.spring.cardSnap,
  });
  const p1Y = interpolate(p1Spring, [0, 1], [40, 0]);

  // Phase 2 Rapid Cut Index (150-205: Roswell, 205-260: Capitol, 260-310: BlueBook, 310-360: Gimbal)
  let flashCase = {
    title: "ROSWELL",
    year: "1947",
    tag: "CRASHED DISC RETRACTED",
    img: "Assets/2nd proof.jpg",
  };
  if (frame >= 205 && frame < 260) {
    flashCase = {
      title: "THE CAPITOL",
      year: "1952",
      tag: "RESTRICTED AIRSPACE INCIDENT",
      img: "Assets/images.jpeg",
    };
  } else if (frame >= 260 && frame < 310) {
    flashCase = {
      title: "PROJECT BLUE BOOK",
      year: "1952–1969",
      tag: "701 UNEXPLAINED CASES",
      img: "Assets/proof 3.jpeg",
    };
  } else if (frame >= 310 && frame < 360) {
    flashCase = {
      title: "NAVY GIMBAL",
      year: "2017",
      tag: "AUTHENTICATED FLIR CAPTURE",
      img: "Assets/proof 4.webp",
    };
  }

  // Phase 3 Slam 1: "THE FILES ARE OPEN." (frame 360)
  const openSpring = spring({
    frame: frame - 360,
    fps,
    config: theme.spring.slam,
  });
  const openScale = interpolate(openSpring, [0, 1], [1.5, 1.0]);
  const openOpacity = interpolate(openSpring, [0, 1], [0, 1]);

  // Phase 3 Slam 2: "THE ANSWERS REMAIN CLASSIFIED." (frame 470)
  const classifiedSpring = spring({
    frame: frame - 470,
    fps,
    config: theme.spring.heavyImpact,
  });
  const classifiedScale = interpolate(classifiedSpring, [0, 1], [2.2, 1.0]);
  const classifiedOpacity = interpolate(classifiedSpring, [0, 1], [0, 1]);

  // Shake on final stamp slam (frame 470 to 480)
  const isClassifiedShake = frame >= 470 && frame <= 480;
  const shakeX = isClassifiedShake ? Math.sin((frame - 470) * 3) * 8 : 0;
  const shakeY = isClassifiedShake ? Math.cos((frame - 470) * 3.5) * 6 : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.darkroomBg,
        overflow: "hidden",
      }}
    >
      {/* Background Spotlight */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(245, 158, 11, 0.08) 0%, rgba(18, 22, 28, 0.6) 50%, rgba(9, 10, 13, 0.98) 90%)",
          pointerEvents: "none",
        }}
      />

      {isPhase1 && (
        /* ============================================================ */
        /* PHASE 1: SPLIT COMPARISON (0 - 150)                          */
        /* ============================================================ */
        <StudioLayout
          badge="• 1947 VS 2017 // HISTORICAL CONTINUITY"
          headline="70 Years Apart."
          subtitle="Separated by seven decades, the identical flight kinematics remain unexplained."
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              transform: `translateY(${p1Y}px)`,
            }}
          >
            <FloatingCard>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  position: "relative",
                  backgroundColor: "#0F1116",
                }}
              >
                {/* Left Side: 1947 Roswell */}
                <div
                  style={{
                    flex: 1,
                    position: "relative",
                    borderRight: "1px solid rgba(255, 255, 255, 0.12)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      padding: "12px 16px",
                      backgroundColor: "rgba(0,0,0,0.6)",
                      fontFamily: theme.fonts.mono,
                      fontSize: 12,
                      fontWeight: 700,
                      color: theme.colors.textAmber,
                      letterSpacing: "0.08em",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    1947: ROSWELL RECORD
                  </div>
                  <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
                    <Img
                      src={staticFile("Assets/2nd proof.jpg")}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        filter: "contrast(1.1) brightness(0.9)",
                      }}
                    />
                  </div>
                </div>

                {/* Right Side: 2017 Gimbal */}
                <div
                  style={{
                    flex: 1,
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      padding: "12px 16px",
                      backgroundColor: "rgba(0,0,0,0.6)",
                      fontFamily: theme.fonts.mono,
                      fontSize: 12,
                      fontWeight: 700,
                      color: theme.colors.radarGreen,
                      letterSpacing: "0.08em",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    2017: US NAVY FLIR
                  </div>
                  <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
                    <Img
                      src={staticFile("Assets/proof 4.webp")}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        filter: "contrast(1.15) brightness(0.95)",
                      }}
                    />
                  </div>
                </div>

                {/* Center Connecting Badge */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    padding: "10px 20px",
                    borderRadius: 999,
                    backgroundColor: "#090A0D",
                    border: `1.5px solid ${theme.colors.crimsonClassified}`,
                    boxShadow: "0 0 25px rgba(220, 38, 38, 0.6)",
                    fontFamily: theme.fonts.mono,
                    fontSize: 13,
                    fontWeight: 800,
                    color: theme.colors.textPrimary,
                    letterSpacing: "0.12em",
                    whiteSpace: "nowrap",
                    zIndex: 20,
                  }}
                >
                  70-YEAR CORRELATION
                </div>
              </div>
            </FloatingCard>
          </div>
        </StudioLayout>
      )}

      {isPhase2 && (
        /* ============================================================ */
        /* PHASE 2: RAPID 4-CASE FLASH (150 - 360)                      */
        /* ============================================================ */
        <StudioLayout
          badge="• INVESTIGATIVE EVIDENCE // SUMMARY"
          headline={flashCase.title}
          subtitle={flashCase.tag}
        >
          <div style={{ width: "100%", height: "100%" }}>
            <FloatingCard>
              {/* Header */}
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
                    fontSize: 14,
                    fontWeight: 700,
                    color: theme.colors.textAmber,
                  }}
                >
                  CASE SUMMARY: {flashCase.year}
                </span>
                <span
                  style={{
                    fontFamily: theme.fonts.mono,
                    fontSize: 13,
                    color: theme.colors.textMuted,
                  }}
                >
                  ARCHIVE REPOSITORY
                </span>
              </div>

              {/* Real Archival Image Full Presentation */}
              <div
                style={{
                  flex: 1,
                  position: "relative",
                  overflow: "hidden",
                  backgroundColor: "#0D0E12",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Img
                  src={staticFile(flashCase.img)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    filter: "contrast(1.15) brightness(0.95)",
                  }}
                />

                {/* Big Stamp Label */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 24,
                    left: 24,
                    padding: "8px 18px",
                    borderRadius: 4,
                    backgroundColor: "rgba(0, 0, 0, 0.85)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    fontFamily: theme.fonts.mono,
                    fontSize: 16,
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                    color: theme.colors.textPrimary,
                  }}
                >
                  {flashCase.title} // {flashCase.year}
                </div>
              </div>
            </FloatingCard>
          </div>
        </StudioLayout>
      )}

      {isPhase3 && (
        /* ============================================================ */
        /* PHASE 3: FINAL DARKROOM STATEMENT (360 - 630)                */
        /* ============================================================ */
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 60px",
            transform: `translate(${shakeX}px, ${shakeY}px)`,
            zIndex: 30,
          }}
        >
          {/* Top Pill Badge */}
          <div
            style={{
              padding: "8px 24px",
              borderRadius: 999,
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.14)",
              marginBottom: 40,
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: theme.colors.crimsonClassified,
                boxShadow: "0 0 10px rgba(220, 38, 38, 0.8)",
              }}
            />
            <span
              style={{
                fontFamily: theme.fonts.mono,
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "0.15em",
                color: theme.colors.textSecondary,
                textTransform: "uppercase",
              }}
            >
              PROJECT BLUE BOOK ARCHIVE
            </span>
          </div>

          {/* Statement Line 1: THE FILES ARE OPEN. */}
          <div
            style={{
              fontFamily: theme.fonts.display,
              fontSize: 66,
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: theme.colors.textPrimary,
              textAlign: "center",
              transform: `scale(${openScale})`,
              opacity: openOpacity,
              marginBottom: 32,
            }}
          >
            THE FILES ARE OPEN.
          </div>

          {/* Statement Line 2 / Heavy Crimson Stamp: THE ANSWERS REMAIN CLASSIFIED. */}
          {frame >= 470 && (
            <div
              style={{
                transform: `scale(${classifiedScale}) rotate(-2deg)`,
                opacity: classifiedOpacity,
                padding: "24px 38px",
                borderRadius: 12,
                border: `5px solid ${theme.colors.crimsonClassified}`,
                backgroundColor: "rgba(220, 38, 38, 0.14)",
                boxShadow:
                  "0 0 50px rgba(220, 38, 38, 0.6), inset 0 0 25px rgba(220, 38, 38, 0.2)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: theme.fonts.mono,
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.25em",
                  color: theme.colors.crimsonClassified,
                  marginBottom: 6,
                }}
              >
                FINAL VERDICT // 1947–PRESENT
              </div>
              <div
                style={{
                  fontFamily: theme.fonts.display,
                  fontSize: 48,
                  fontWeight: 900,
                  letterSpacing: "0.04em",
                  color: theme.colors.crimsonClassified,
                  lineHeight: 1.1,
                  textTransform: "uppercase",
                  textShadow: "0 2px 12px rgba(0,0,0,0.9)",
                }}
              >
                THE ANSWERS REMAIN CLASSIFIED.
              </div>
            </div>
          )}

          {/* Bottom National Archive Disclaimer */}
          <div
            style={{
              position: "absolute",
              bottom: 340, // Above bottom 340px safe zone
              left: 60,
              right: 140, // Outside right 140px safe zone
              textAlign: "center",
              fontFamily: theme.fonts.mono,
              fontSize: 12,
              color: theme.colors.textMuted,
              letterSpacing: "0.05em",
            }}
          >
            RECORD GROUP 341 // NATIONAL ARCHIVES & RECORDS ADMINISTRATION
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
