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

export const Cut8RedactionStamp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Macro zoom on the key paragraph
  const macroEntrance = spring({
    frame,
    fps,
    config: theme.spring.cardSnap,
  });
  const zoomScale = interpolate(macroEntrance, [0, 1], [1.1, 1.52]);

  // Redaction slide-away wipe (frames 15 to 45)
  const redactionWipe = interpolate(frame, [15, 45], [0, 100], {
    easing: theme.ease.outExpo,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Stamp Slam Spring at frame 45
  const stampSpring = spring({
    frame: frame - 45,
    fps,
    config: theme.spring.slam,
  });
  const stampScale = interpolate(stampSpring, [0, 1], [2.4, 1]);
  const stampOpacity = interpolate(stampSpring, [0, 1], [0, 0.95]);

  // 5-frame impact camera shake right when stamp hits (frame 45 to 52)
  const isShaking = frame >= 45 && frame <= 52;
  const shakeX = isShaking ? Math.sin((frame - 45) * 3) * 6 : 0;
  const shakeY = isShaking ? Math.cos((frame - 45) * 3.5) * 5 : 0;

  return (
    <StudioLayout
      badge="• CLASSIFIED LEVEL 4 // DECLASSIFICATION"
      headline="Beyond known science."
      subtitle="Internal memos confirmed capabilities outside human tech."
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `translate(${shakeX}px, ${shakeY}px)`,
        }}
      >
        <FloatingCard>
          {/* Card Top Header */}
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
              MEMORANDUM ANALYSIS // SECTION 4
            </span>
            <span
              style={{
                fontFamily: theme.fonts.mono,
                fontSize: 14,
                fontWeight: 700,
                color: theme.colors.crimsonRed,
              }}
            >
              DECONTROLLED
            </span>
          </div>

          {/* Macro Viewport */}
          <div
            style={{
              width: "100%",
              height: "calc(100% - 52px)",
              overflow: "hidden",
              position: "relative",
              backgroundColor: "#ECE8DD",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                transform: `scale(${zoomScale})`,
                transformOrigin: "50% 45%",
              }}
            >
              <Img
                src={staticFile("Assets/proof 3.jpeg")}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  filter: "contrast(1.15) brightness(0.96)",
                }}
              />

              {/* Redaction Bar sliding off to reveal document text */}
              <div
                style={{
                  position: "absolute",
                  top: "42%",
                  left: "22%",
                  width: "56%",
                  height: 26,
                  backgroundColor: theme.colors.redactedInk,
                  borderRadius: 2,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
                  transform: `translateX(${redactionWipe * 5}px)`,
                  opacity: interpolate(redactionWipe, [0, 100], [1, 0]),
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* CRIMSON DECLASSIFIED STAMP SLAM */}
            <div
              style={{
                position: "absolute",
                top: "40%",
                left: "24%",
                padding: "16px 36px",
                border: `6px solid ${theme.colors.crimsonRed}`,
                borderRadius: 8,
                transform: `scale(${stampScale}) rotate(-12deg)`,
                opacity: stampOpacity,
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                boxShadow: "0 8px 24px rgba(185, 28, 28, 0.3)",
                pointerEvents: "none",
                zIndex: 30,
              }}
            >
              <span
                style={{
                  fontFamily: theme.fonts.display,
                  fontSize: 44,
                  fontWeight: 900,
                  letterSpacing: "0.22em",
                  color: theme.colors.crimsonRed,
                  textTransform: "uppercase",
                  display: "block",
                  lineHeight: 1,
                  textShadow: "0 0 1px rgba(185, 28, 28, 0.6)",
                }}
              >
                DECLASSIFIED
              </span>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 6,
                  borderTop: `2px solid ${theme.colors.crimsonRed}`,
                  paddingTop: 4,
                }}
              >
                <span
                  style={{
                    fontFamily: theme.fonts.mono,
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color: theme.colors.crimsonRed,
                  }}
                >
                  AUTH: EO 13526
                </span>
                <span
                  style={{
                    fontFamily: theme.fonts.mono,
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color: theme.colors.crimsonRed,
                  }}
                >
                  AIR FORCE DEPT
                </span>
              </div>
            </div>

            {/* Bottom Insight Card */}
            <div
              style={{
                position: "absolute",
                bottom: 24,
                left: 24,
                right: 24,
                padding: "16px 20px",
                borderRadius: 12,
                backgroundColor: "rgba(255, 255, 255, 0.94)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                opacity: interpolate(frame, [50, 75], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              <span
                style={{
                  fontFamily: theme.fonts.display,
                  fontSize: 19,
                  fontWeight: 600,
                  color: theme.colors.headlineDark,
                  lineHeight: 1.35,
                }}
              >
                "Physical characteristics cannot be attributed to any known aircraft."
              </span>
            </div>
          </div>
        </FloatingCard>
      </div>
    </StudioLayout>
  );
};
