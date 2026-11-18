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

export const Cut5CapitolMacro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Snappy punch zoom on the luminous orb cluster
  const macroEntrance = spring({
    frame,
    fps,
    config: theme.spring.cardSnap,
  });
  const macroScale = interpolate(macroEntrance, [0, 1], [1.1, 1.62]);
  const macroY = interpolate(macroEntrance, [0, 1], [0, 80]);

  // Reticle ring pulse
  const reticlePulse = 1 + 0.06 * Math.sin(frame * 0.2);
  const reticleOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <StudioLayout
      badge="• INTERCEPT SPEED // MACH 10+"
      headline="Defying interceptors."
      subtitle="Instantaneous acceleration beyond 7,000 mph."
    >
      <FloatingCard>
        {/* Card Header */}
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
            TARGET TELEMETRY // D.C. AIRSPACE
          </span>
          <span
            style={{
              fontFamily: theme.fonts.mono,
              fontSize: 15,
              fontWeight: 700,
              color: theme.colors.crimsonRed,
            }}
          >
            F-94 INTERCEPT FAILED
          </span>
        </div>

        {/* Zoomed Viewport */}
        <div
          style={{
            width: "100%",
            height: "calc(100% - 52px)",
            overflow: "hidden",
            position: "relative",
            backgroundColor: "#161616",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              transform: `scale(${macroScale}) translateY(${macroY}px)`,
              transformOrigin: "48% 28%",
            }}
          >
            <Img
              src={staticFile("Assets/images.jpeg")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 45%",
                filter: "contrast(1.22) brightness(1.08)",
              }}
            />

            {/* Precision Callout Ring over the glowing orbs */}
            <div
              style={{
                position: "absolute",
                top: "24%",
                left: "40%",
                width: 140,
                height: 140,
                borderRadius: "50%",
                border: "2px dashed #34D399",
                boxShadow: "0 0 20px rgba(52, 211, 153, 0.6)",
                transform: `scale(${reticlePulse}) translate(-50%, -50%)`,
                opacity: reticleOpacity,
                pointerEvents: "none",
              }}
            >
              {/* Center crosshair pip */}
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
          </div>

          {/* Telemetry pill overlay */}
          <div
            style={{
              position: "absolute",
              top: 24,
              right: 24,
              padding: "10px 16px",
              borderRadius: 8,
              backgroundColor: "rgba(15, 23, 42, 0.88)",
              border: "1px solid rgba(52, 211, 153, 0.4)",
              backdropFilter: "blur(8px)",
              opacity: reticleOpacity,
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
                color: "#94A3B8",
                marginTop: 4,
              }}
            >
              38°53'23"N 77°00'32"W • VEL: UNKNOWN
            </div>
          </div>

          {/* Bottom quote card */}
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
              opacity: interpolate(frame, [25, 45], [0, 1], {
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
              "Saucers outran military jets as soon as they approached."
            </span>
            <span
              style={{
                display: "block",
                fontFamily: theme.fonts.mono,
                fontSize: 13,
                color: "#78716C",
                marginTop: 6,
              }}
            >
              — CAPT. EDWARD RUPPELT, BLUE BOOK DIRECTOR
            </span>
          </div>
        </div>
      </FloatingCard>
    </StudioLayout>
  );
};
