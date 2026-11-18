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

export const Beat2Roswell: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring on Frame 0 (composition frame 210)
  const cardEntrance = spring({
    frame,
    fps,
    config: theme.spring.cardSnap,
  });
  const cardTranslateY = interpolate(cardEntrance, [0, 1], [40, 0]);
  const cardScale = interpolate(cardEntrance, [0, 1], [0.96, 1]);

  // Amber highlighter sweep on "recovered a crashed disc" (local frame 140 to 200)
  const highlightProgress = interpolate(frame, [140, 195], [0, 100], {
    easing: theme.ease.outExpo,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // RETRACTED Stamp Slam on "and days later, the story was retracted" (local frame 370 / composition frame 580)
  const stampSpring = spring({
    frame: frame - 370,
    fps,
    config: theme.spring.heavyImpact,
  });
  const stampScale = interpolate(stampSpring, [0, 1], [2.6, 1.0]);
  const stampOpacity = interpolate(stampSpring, [0, 1], [0, 0.98]);

  // Impact shake when RETRACTED stamp slams (frame 370 to 378)
  const isStampShaking = frame >= 370 && frame <= 378;
  const shakeX = isStampShaking ? Math.sin((frame - 370) * 3) * 7 : 0;
  const shakeY = isStampShaking ? Math.cos((frame - 370) * 3.5) * 6 : 0;

  // Header state transition: July 8, 1947 -> Story Retracted (around frame 370)
  const isRetracted = frame >= 370;
  const headline = isRetracted ? "Story Retracted." : "July 8, 1947.";
  const subtitle = isRetracted
    ? "Hours later, the disc was officially reclassified as a weather balloon."
    : "A local newspaper reports the military recovered a crashed disc near Roswell.";
  const badge = isRetracted ? "• CASE FILE 01 // PRESS RETRACTION" : "• CASE FILE 01 // ROSWELL, NM";

  // Slow continuous Ken Burns camera push
  const imageZoom = interpolate(frame, [0, 570], [1.36, 1.44], {
    easing: theme.ease.inOut,
  });

  return (
    <StudioLayout badge={badge} headline={headline} subtitle={subtitle}>
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `translateY(${cardTranslateY}px) scale(${cardScale}) translate(${shakeX}px, ${shakeY}px)`,
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
              position: "relative",
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
              ROSWELL DAILY RECORD // ARCHIVAL SCAN
            </span>
            <span
              style={{
                fontFamily: theme.fonts.mono,
                fontSize: 14,
                fontWeight: 700,
                color: isRetracted ? theme.colors.crimsonClassified : theme.colors.textAmber,
              }}
            >
              {isRetracted ? "OFFICIAL RETRACTION" : "JULY 8, 1947"}
            </span>
          </div>

          {/* Newspaper Viewport with strict crop hiding modern book header */}
          <div
            style={{
              width: "100%",
              height: "calc(100% - 52px)",
              overflow: "hidden",
              position: "relative",
              backgroundColor: "#16181E",
            }}
          >
            <Img
              src={staticFile("Assets/2nd proof.jpg")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 70%",
                transform: `scale(${imageZoom})`,
                filter: "contrast(1.12) brightness(0.92)",
              }}
            />

            {/* Glowing amber highlighter sweep over headline on "recovered a crashed disc" */}
            <div
              style={{
                position: "absolute",
                top: "16%",
                left: "58%",
                width: `${(highlightProgress * 38) / 100}%`,
                height: "6%",
                backgroundColor: theme.colors.amberHighlighter,
                mixBlendMode: "multiply",
                borderRadius: 4,
                boxShadow: "0 0 16px rgba(245, 158, 11, 0.6)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "22.5%",
                left: "58%",
                width: `${(Math.max(0, highlightProgress - 15) * 36) / 85}%`,
                height: "6%",
                backgroundColor: theme.colors.amberHighlighter,
                mixBlendMode: "multiply",
                borderRadius: 4,
                boxShadow: "0 0 16px rgba(245, 158, 11, 0.6)",
                pointerEvents: "none",
              }}
            />

            {/* CRIMSON RETRACTED STAMP SLAM on "and days later, the story was retracted" */}
            {frame >= 370 && (
              <div
                style={{
                  position: "absolute",
                  top: "32%",
                  left: "18%",
                  padding: "16px 36px",
                  border: `6px solid ${theme.colors.crimsonClassified}`,
                  borderRadius: 10,
                  transform: `scale(${stampScale}) rotate(-14deg)`,
                  opacity: stampOpacity,
                  backgroundColor: "rgba(10, 12, 16, 0.7)",
                  boxShadow: "0 10px 35px rgba(220, 38, 38, 0.45)",
                  zIndex: 40,
                  pointerEvents: "none",
                }}
              >
                <span
                  style={{
                    fontFamily: theme.fonts.display,
                    fontSize: 52,
                    fontWeight: 900,
                    letterSpacing: "0.2em",
                    color: theme.colors.crimsonClassified,
                    textTransform: "uppercase",
                    display: "block",
                    lineHeight: 1,
                    textShadow: "0 0 15px rgba(220, 38, 38, 0.7)",
                  }}
                >
                  RETRACTED
                </span>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 6,
                    borderTop: `2px solid ${theme.colors.crimsonClassified}`,
                    paddingTop: 4,
                  }}
                >
                  <span
                    style={{
                      fontFamily: theme.fonts.mono,
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      color: theme.colors.crimsonClassified,
                    }}
                  >
                    8TH AIR FORCE
                  </span>
                  <span
                    style={{
                      fontFamily: theme.fonts.mono,
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      color: theme.colors.crimsonClassified,
                    }}
                  >
                    GEN. RAMEY
                  </span>
                </div>
              </div>
            )}

            {/* Bottom Insight Badge */}
            <div
              style={{
                position: "absolute",
                bottom: 24,
                left: 24,
                right: 24,
                padding: "14px 20px",
                borderRadius: 12,
                backgroundColor: "rgba(15, 18, 24, 0.92)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: theme.fonts.mono,
                    fontSize: 13,
                    fontWeight: 600,
                    color: theme.colors.textMuted,
                    display: "block",
                  }}
                >
                  HISTORICAL DOCUMENTATION
                </span>
                <span
                  style={{
                    fontFamily: theme.fonts.display,
                    fontSize: 19,
                    fontWeight: 700,
                    color: theme.colors.textPrimary,
                  }}
                >
                  "RAAF Captures Flying Saucer On Ranch"
                </span>
              </div>
              <span
                style={{
                  fontFamily: theme.fonts.mono,
                  fontSize: 13,
                  fontWeight: 700,
                  color: isRetracted ? theme.colors.crimsonClassified : theme.colors.textAmber,
                  padding: "6px 12px",
                  borderRadius: 6,
                  backgroundColor: isRetracted
                    ? "rgba(220, 38, 38, 0.12)"
                    : "rgba(245, 158, 11, 0.12)",
                }}
              >
                {isRetracted ? "REDACTED // 1947" : "ARCHIVED"}
              </span>
            </div>
          </div>
        </FloatingCard>
      </div>
    </StudioLayout>
  );
};
