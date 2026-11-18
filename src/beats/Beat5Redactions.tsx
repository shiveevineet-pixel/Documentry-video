import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  Img,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../theme";

export const Beat5Redactions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Jump-cut phases every 90-120 frames
  // Phase 0: 0-90 (Overview)
  // Phase 1: 90-180 (Paragraph 1 Rip)
  // Phase 2: 180-300 (Hero Quote Reveal)
  // Phase 3: 300-480 (Stamp Slam)
  const isPhase1 = frame >= 90 && frame < 180;
  const isPhase2 = frame >= 180 && frame < 300;
  const isPhase3 = frame >= 300;

  // Zoom scale and center depending on jump-cut phase
  const targetScale = isPhase3 ? 1.5 : isPhase2 ? 1.35 : isPhase1 ? 1.2 : 1.05;
  const targetPanY = isPhase3 ? -90 : isPhase2 ? -60 : isPhase1 ? -30 : 0;

  // Redaction bar rip animations
  const rip1 = spring({ frame: frame - 90, fps, config: theme.spring.slam });
  const rip2 = spring({ frame: frame - 180, fps, config: theme.spring.slam });

  // Stamp Slam at frame 300
  const stampFrame = 300;
  const stampSpring = spring({
    frame: frame - stampFrame,
    fps,
    config: theme.spring.heavyImpact,
  });

  // 6-Frame impact shake
  const isShaking = frame >= stampFrame && frame < stampFrame + 14;
  const shakeX = isShaking ? Math.sin((frame - stampFrame) * 2.8) * 14 : 0;
  const shakeY = isShaking ? Math.cos((frame - stampFrame) * 3.2) * 12 : 0;

  const particles = useMemo(() => {
    return Array.from({ length: 16 }).map((_, i) => ({
      angle: (i / 16) * 2 * Math.PI,
      distance: 65 + (i % 4) * 20,
      size: 3 + (i % 3) * 2,
    }));
  }, []);

  const dustBurst = interpolate(frame, [stampFrame, stampFrame + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#100D0B",
        overflow: "hidden",
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      {/* Real Declassified Memo (Assets/proof 3.jpeg) with dynamic jump-cut framing */}
      <AbsoluteFill
        style={{
          transform: `scale(${targetScale}) translateY(${targetPanY}px)`,
          transformOrigin: "center 45%",
          transition: "transform 0.1s ease-out",
        }}
      >
        <Img
          src={staticFile("Assets/proof 3.jpeg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 28%",
            filter: "contrast(1.2) brightness(0.95)",
          }}
        />
      </AbsoluteFill>

      {/* Archival Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 50%, transparent 40%, rgba(16, 13, 11, 0.75) 85%, #0B0907 100%)",
        }}
      />

      {/* DYNAMIC REDACTION SLIDER OVERLAY */}
      {frame >= 90 && (
        <div
          style={{
            position: "absolute",
            top: 740,
            left: theme.safeZone.left + 15,
            right: theme.safeZone.right + 25,
            backgroundColor: "rgba(242, 239, 233, 0.95)",
            backdropFilter: "blur(6px)",
            border: `3px solid ${theme.colors.crimsonStamp}`,
            borderRadius: 4,
            padding: "20px 24px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.9)",
            zIndex: 25,
          }}
        >
          <div
            style={{
              fontFamily: theme.fonts.typewriter,
              fontSize: 11,
              color: theme.colors.crimsonStamp,
              fontWeight: 800,
              letterSpacing: "0.14em",
              marginBottom: 8,
            }}
          >
            [DECLASSIFIED SECTION 3 // SCIENTIFIC AUDIT]:
          </div>

          <div
            style={{
              position: "relative",
              fontWeight: 800,
              fontSize: 24,
              lineHeight: 1.3,
              color: theme.colors.charcoalInk,
              fontFamily: theme.fonts.typewriter,
            }}
          >
            "UNIDENTIFIED AERIAL PHENOMENA — BEYOND KNOWN CAPABILITIES."

            {/* Violent redaction bar rip away */}
            {frame < 220 && (
              <div
                style={{
                  position: "absolute",
                  inset: -4,
                  backgroundColor: theme.colors.redactedBar,
                  transform: `translateX(${interpolate(rip2, [0, 1], [0, 105])}%)`,
                  opacity: interpolate(rip2, [0, 0.8, 1], [1, 0.8, 0]),
                  boxShadow: "0 4px 15px rgba(0,0,0,0.8)",
                  pointerEvents: "none",
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* Crimson DECLASSIFIED Stamp Slam (Frame 300) */}
      {frame >= stampFrame && (
        <div
          style={{
            position: "absolute",
            top: 610,
            left: theme.safeZone.left + 20,
            right: theme.safeZone.right + 30,
            transform: `
              scale(${interpolate(stampSpring, [0, 1], [2.4, 1])})
              rotate(-12deg)
            `,
            opacity: interpolate(stampSpring, [0, 1], [0.85, 0.98]),
            border: `7px solid ${theme.colors.crimsonStamp}`,
            padding: "16px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(185, 28, 28, 0.10)",
            boxShadow: `0 0 35px ${theme.colors.crimsonGlow}`,
            zIndex: 40,
          }}
        >
          <div
            style={{
              fontFamily: theme.fonts.editorial,
              fontSize: 70,
              fontWeight: 900,
              color: theme.colors.crimsonStamp,
              letterSpacing: "0.14em",
              lineHeight: 0.9,
              textTransform: "uppercase",
            }}
          >
            DECLASSIFIED
          </div>
          <div
            style={{
              fontFamily: theme.fonts.typewriter,
              fontSize: 13,
              color: theme.colors.crimsonStamp,
              letterSpacing: "0.2em",
              marginTop: 6,
              fontWeight: 700,
            }}
          >
            AUTH: U.S. AIR FORCE // DIRECTIVE 200-2
          </div>
        </div>
      )}

      {/* Particle ink splatter burst */}
      {dustBurst > 0 && dustBurst < 1 && (
        <div
          style={{
            position: "absolute",
            top: 670,
            left: "50%",
            pointerEvents: "none",
            zIndex: 45,
          }}
        >
          {particles.map((p, idx) => {
            const x = Math.cos(p.angle) * p.distance * dustBurst;
            const y = Math.sin(p.angle) * p.distance * dustBurst;
            return (
              <div
                key={idx}
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  width: p.size,
                  height: p.size,
                  borderRadius: "50%",
                  backgroundColor: theme.colors.crimsonStamp,
                  opacity: (1 - dustBurst) * 0.8,
                }}
              />
            );
          })}
        </div>
      )}
    </AbsoluteFill>
  );
};
