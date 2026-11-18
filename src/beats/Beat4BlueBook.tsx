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

export const Beat4BlueBook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring on Frame 0
  const entrance = spring({
    frame,
    fps,
    config: theme.spring.cardSnap,
  });
  const translateY = interpolate(entrance, [0, 1], [40, 0]);
  const cardScale = interpolate(entrance, [0, 1], [0.96, 1]);

  // Document push-in camera motion
  const docZoom = interpolate(frame, [0, 480], [1.1, 1.25], {
    easing: theme.ease.inOut,
  });

  // Black Redaction reveal bars (sliding / opening during frames 90 to 240)
  const redactionBar1 = interpolate(frame, [60, 120], [1, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.ease.outExpo,
  });
  const redactionBar2 = interpolate(frame, [110, 170], [1, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.ease.outExpo,
  });

  // Stamp slam on "stamped its findings declassified" (local frame 330 / 27.0s in VO)
  const stampSpring = spring({
    frame: frame - 330,
    fps,
    config: theme.spring.heavyImpact,
  });
  const stampScale = interpolate(stampSpring, [0, 1], [2.6, 1.0]);
  const stampOpacity = interpolate(stampSpring, [0, 1], [0, 0.96]);

  // Screen shake on stamp slam (frames 330 to 340)
  const isStampShaking = frame >= 330 && frame <= 340;
  const shakeX = isStampShaking ? Math.sin((frame - 330) * 3) * 8 : 0;
  const shakeY = isStampShaking ? Math.cos((frame - 330) * 3.5) * 6 : 0;

  const isDeclassified = frame >= 330;
  const badge = isDeclassified
    ? "• USAF ARCHIVE // DECLASSIFIED 1969"
    : "• CASE FILE 03 // WRIGHT-PATTERSON AFB";
  const headline = isDeclassified
    ? "Stamped Declassified."
    : "Everything Documented.";
  const subtitle = isDeclassified
    ? "Air Force Directive concluded in 1969 — closing official public study."
    : "Project Blue Book: The Air Force's systematic study of unidentified craft.";

  return (
    <StudioLayout badge={badge} headline={headline} subtitle={subtitle}>
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `translateY(${translateY}px) scale(${cardScale}) translate(${shakeX}px, ${shakeY}px)`,
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
                  backgroundColor: isDeclassified
                    ? theme.colors.crimsonClassified
                    : theme.colors.textAmber,
                  boxShadow: isDeclassified
                    ? "0 0 10px rgba(220, 38, 38, 0.8)"
                    : "0 0 8px rgba(245, 158, 11, 0.5)",
                }}
              />
              <span
                style={{
                  fontFamily: theme.fonts.mono,
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  color: isDeclassified
                    ? theme.colors.crimsonClassified
                    : theme.colors.textSecondary,
                  textTransform: "uppercase",
                }}
              >
                {isDeclassified ? "STATUS: DECLASSIFIED" : "RESTRICTED DOCUMENT // AFR 200-2"}
              </span>
            </div>
            <span
              style={{
                fontFamily: theme.fonts.mono,
                fontSize: 13,
                color: theme.colors.textMuted,
              }}
            >
              RECORD ID: PB-1952-WPAFB
            </span>
          </div>

          {/* Archival Scan Canvas */}
          <div
            style={{
              flex: 1,
              position: "relative",
              overflow: "hidden",
              backgroundColor: "#16171B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* The Real Declassified Blue Book Scan */}
            <div
              style={{
                width: "100%",
                height: "100%",
                transform: `scale(${docZoom})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Img
                src={staticFile("Assets/proof 3.jpeg")}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  filter: "contrast(1.15) brightness(0.95)",
                }}
              />
            </div>

            {/* Dynamic Classified Redaction Strips */}
            <div
              style={{
                position: "absolute",
                top: "32%",
                left: "14%",
                width: "55%",
                height: 22,
                backgroundColor: "#0D0E11",
                transform: `scaleX(${redactionBar1})`,
                transformOrigin: "right center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.7)",
                border: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                paddingLeft: 8,
              }}
            >
              <span
                style={{
                  fontFamily: theme.fonts.mono,
                  fontSize: 10,
                  color: "#52525B",
                  letterSpacing: "0.15em",
                }}
              >
                CLASSIFIED ATFLIR
              </span>
            </div>

            <div
              style={{
                position: "absolute",
                top: "44%",
                left: "22%",
                width: "60%",
                height: 22,
                backgroundColor: "#0D0E11",
                transform: `scaleX(${redactionBar2})`,
                transformOrigin: "right center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.7)",
                border: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                paddingLeft: 8,
              }}
            >
              <span
                style={{
                  fontFamily: theme.fonts.mono,
                  fontSize: 10,
                  color: "#52525B",
                  letterSpacing: "0.15em",
                }}
              >
                SECDEF MEMO 47-B
              </span>
            </div>

            {/* Tactical Crosshairs & Document Grids */}
            <div
              style={{
                position: "absolute",
                top: 24,
                right: 24,
                padding: "6px 12px",
                borderRadius: 4,
                backgroundColor: "rgba(0, 0, 0, 0.75)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                fontFamily: theme.fonts.mono,
                fontSize: 12,
                color: theme.colors.textAmber,
                letterSpacing: "0.05em",
              }}
            >
              MICROFICHE ROLL #08
            </div>

            {/* Heavy Crimson Rubber Stamp: DECLASSIFIED */}
            {frame >= 330 && (
              <div
                style={{
                  position: "absolute",
                  top: "42%",
                  left: "50%",
                  transform: `translate(-50%, -50%) rotate(-12deg) scale(${stampScale})`,
                  opacity: stampOpacity,
                  padding: "18px 40px",
                  borderRadius: 8,
                  border: `6px solid ${theme.colors.crimsonClassified}`,
                  backgroundColor: "rgba(220, 38, 38, 0.16)",
                  boxShadow: `0 0 45px rgba(220, 38, 38, 0.5), inset 0 0 20px rgba(220, 38, 38, 0.25)`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 30,
                  pointerEvents: "none",
                }}
              >
                <div
                  style={{
                    fontFamily: theme.fonts.mono,
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.3em",
                    color: theme.colors.crimsonClassified,
                    marginBottom: 4,
                  }}
                >
                  USAF PROJECT BLUE BOOK
                </div>
                <div
                  style={{
                    fontFamily: theme.fonts.display,
                    fontSize: 54,
                    fontWeight: 900,
                    letterSpacing: "0.14em",
                    color: theme.colors.crimsonClassified,
                    lineHeight: 1,
                    textTransform: "uppercase",
                    textShadow: "0 2px 10px rgba(0,0,0,0.8)",
                  }}
                >
                  DECLASSIFIED
                </div>
                <div
                  style={{
                    fontFamily: theme.fonts.mono,
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.2em",
                    color: theme.colors.crimsonClassified,
                    marginTop: 6,
                  }}
                >
                  DIR. EXEMPTION 4 // NAT. ARCHIVES
                </div>
              </div>
            )}

            {/* Subtle Vignette Overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse at center, transparent 40%, rgba(9, 10, 13, 0.7) 100%)",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Card Bottom Inspection Footer */}
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
                DOCUMENT TYPE
              </div>
              <div
                style={{
                  fontFamily: theme.fonts.display,
                  fontSize: 16,
                  fontWeight: 600,
                  color: theme.colors.textPrimary,
                }}
              >
                Official U.S. Air Force Memo
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
                DISCLOSURE STATUS
              </div>
              <div
                style={{
                  fontFamily: theme.fonts.mono,
                  fontSize: 14,
                  fontWeight: 700,
                  color: isDeclassified
                    ? theme.colors.crimsonClassified
                    : theme.colors.textAmber,
                }}
              >
                {isDeclassified ? "PUBLIC RELEASE" : "RESTRICTED ACCESS"}
              </div>
            </div>
          </div>
        </FloatingCard>
      </div>
    </StudioLayout>
  );
};
