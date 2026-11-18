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

export const Cut11FlirWide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const entrance = spring({
    frame,
    fps,
    config: theme.spring.cardSnap,
  });
  const translateY = interpolate(entrance, [0, 1], [35, 0]);
  const scale = interpolate(entrance, [0, 1], [0.96, 1]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  // Subtle FLIR scanline shift
  const scanlineY = (frame * 1.5) % 8;

  return (
    <StudioLayout
      darkMode={true}
      badge="• DOD RELEASE // U.S. NAVY FLIR"
      headline="2017: Pentagon confirmation."
      subtitle="U.S. Navy infrared footage officially acknowledged."
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `translateY(${translateY}px) scale(${scale})`,
          opacity,
        }}
      >
        <FloatingCard darkMode={true}>
          {/* Top Tactical Metadata */}
          <div
            style={{
              height: 52,
              padding: "0 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              backgroundColor: "rgba(10, 12, 16, 0.95)",
            }}
          >
            <span
              style={{
                fontFamily: theme.fonts.mono,
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: "0.1em",
                color: "#94A3B8",
              }}
            >
              F/A-18F ATFLIR POD // SENSOR CAPTURE
            </span>
            <span
              style={{
                fontFamily: theme.fonts.mono,
                fontSize: 14,
                fontWeight: 700,
                color: "#34D399",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "#34D399",
                  boxShadow: "0 0 8px #34D399",
                }}
              />
              AUTOTRACK LOCK
            </span>
          </div>

          {/* FLIR Screen Viewport */}
          <div
            style={{
              width: "100%",
              height: "calc(100% - 52px)",
              overflow: "hidden",
              position: "relative",
              backgroundColor: "#050608",
            }}
          >
            <Img
              src={staticFile("Assets/proof 4.webp")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 48%",
                filter: "contrast(1.25) brightness(1.05)",
              }}
            />

            {/* Subtle horizontal scanline effect */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "linear-gradient(rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.4) 50%)",
                backgroundSize: "100% 4px",
                backgroundPosition: `0px ${scanlineY}px`,
                opacity: 0.15,
                pointerEvents: "none",
              }}
            />

            {/* ATFLIR HUD Crosshair Overlay */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 180,
                height: 180,
                pointerEvents: "none",
              }}
            >
              {/* Center Box */}
              <div
                style={{
                  position: "absolute",
                  top: "35%",
                  left: "35%",
                  width: "30%",
                  height: "30%",
                  border: "2px solid rgba(255, 255, 255, 0.75)",
                  boxShadow: "0 0 10px rgba(52, 211, 153, 0.3)",
                }}
              />
              {/* Crosshair tics */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  width: 2,
                  height: 40,
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  transform: "translateX(-50%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  width: 2,
                  height: 40,
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  transform: "translateX(-50%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  width: 40,
                  height: 2,
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  transform: "translateY(-50%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  width: 40,
                  height: 2,
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  transform: "translateY(-50%)",
                }}
              />
            </div>

            {/* Tactical HUD Coordinates & Telemetry */}
            <div
              style={{
                position: "absolute",
                bottom: 24,
                left: 24,
                right: 24,
                padding: "14px 20px",
                borderRadius: 10,
                backgroundColor: "rgba(10, 14, 20, 0.85)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ fontFamily: theme.fonts.mono, fontSize: 13, color: "#94A3B8" }}>
                <span>MODE: NAR // IR: BLACK HOT</span>
                <span style={{ marginLeft: 20 }}>RNG: 4.2 NM</span>
              </div>
              <div
                style={{
                  fontFamily: theme.fonts.mono,
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#34D399",
                }}
              >
                UNIDENTIFIED ANOMALY
              </div>
            </div>
          </div>
        </FloatingCard>
      </div>
    </StudioLayout>
  );
};
