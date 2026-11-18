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

export const Cut12FlirMacro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Macro zoom on craft
  const entrance = spring({
    frame,
    fps,
    config: theme.spring.cardSnap,
  });
  const zoomScale = interpolate(entrance, [0, 1], [1.1, 1.68]);

  // Subtle rotation indicator
  const rotAngle = interpolate(frame, [0, 300], [0, 18]);

  // Animated telemetry numbers
  const azimuth = (156 + Math.sin(frame * 0.05) * 4).toFixed(1);
  const elevation = (-2.4 + Math.cos(frame * 0.04) * 0.6).toFixed(1);

  return (
    <StudioLayout
      darkMode={true}
      badge="• ANOMALOUS AERODYNAMICS // SENSOR LOCK"
      headline="No wings. No exhaust."
      subtitle="Rotating against 120-knot winds with zero propulsion."
    >
      <FloatingCard darkMode={true}>
        {/* Card Header */}
        <div
          style={{
            height: 52,
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            backgroundColor: "rgba(10, 12, 16, 0.95)",
            zIndex: 10,
            position: "relative",
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
            OPTICAL FLIR TELEMETRY // 1.65X ZOOM
          </span>
          <span
            style={{
              fontFamily: theme.fonts.mono,
              fontSize: 14,
              fontWeight: 700,
              color: "#34D399",
            }}
          >
            DIRECT TARGET LOCK
          </span>
        </div>

        {/* Viewport */}
        <div
          style={{
            width: "100%",
            height: "calc(100% - 52px)",
            overflow: "hidden",
            position: "relative",
            backgroundColor: "#050608",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              transform: `scale(${zoomScale})`,
              transformOrigin: "52% 48%",
            }}
          >
            <Img
              src={staticFile("Assets/proof 4.webp")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                filter: "contrast(1.35) brightness(1.1)",
              }}
            />

            {/* Tactical Bounding Box locking onto the craft */}
            <div
              style={{
                position: "absolute",
                top: "44%",
                left: "48%",
                width: 90,
                height: 90,
                transform: `translate(-50%, -50%) rotate(${rotAngle}deg)`,
                border: "2px solid #34D399",
                boxShadow: "0 0 16px rgba(52, 211, 153, 0.6)",
                pointerEvents: "none",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: -20,
                  left: 0,
                  fontFamily: theme.fonts.mono,
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#34D399",
                  letterSpacing: "0.08em",
                }}
              >
                GIMBAL CRAFT
              </span>
            </div>
          </div>

          {/* Live Flight Telemetry Readout Grid */}
          <div
            style={{
              position: "absolute",
              top: 24,
              left: 24,
              padding: "12px 18px",
              borderRadius: 8,
              backgroundColor: "rgba(10, 14, 20, 0.88)",
              border: "1px solid rgba(255, 255, 255, 0.14)",
              backdropFilter: "blur(8px)",
              fontFamily: theme.fonts.mono,
              fontSize: 13,
              lineHeight: 1.6,
              color: "#E2E8F0",
            }}
          >
            <div>AZ: {azimuth}° | EL: {elevation}°</div>
            <div>WIND: 120 KT // 250° HDG</div>
            <div style={{ color: "#34D399", fontWeight: 700 }}>EXHAUST PLUME: 0.0% DETECTED</div>
          </div>

          {/* Bottom Audio Quote Card */}
          <div
            style={{
              position: "absolute",
              bottom: 24,
              left: 24,
              right: 24,
              padding: "16px 20px",
              borderRadius: 12,
              backgroundColor: "rgba(18, 22, 30, 0.92)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
            }}
          >
            <span
              style={{
                fontFamily: theme.fonts.display,
                fontSize: 19,
                fontWeight: 600,
                color: "#FFFFFF",
                lineHeight: 1.35,
              }}
            >
              "Look at that thing, dude! It's rotating!"
            </span>
            <span
              style={{
                display: "block",
                fontFamily: theme.fonts.mono,
                fontSize: 13,
                color: "#94A3B8",
                marginTop: 6,
              }}
            >
              — F/A-18 SUPER HORNET WEAPONS SYSTEM OFFICER
            </span>
          </div>
        </div>
      </FloatingCard>
    </StudioLayout>
  );
};
