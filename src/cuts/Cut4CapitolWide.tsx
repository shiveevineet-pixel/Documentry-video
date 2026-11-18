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

export const Cut4CapitolWide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const cardEntrance = spring({
    frame,
    fps,
    config: theme.spring.cardSnap,
  });
  const cardTranslateY = interpolate(cardEntrance, [0, 1], [35, 0]);
  const cardScale = interpolate(cardEntrance, [0, 1], [0.96, 1]);
  const cardOpacity = interpolate(cardEntrance, [0, 1], [0, 1]);

  // Subtle Ken Burns drift
  const imgScale = interpolate(frame, [0, 120], [1.02, 1.08], {
    easing: theme.ease.inOut,
  });

  return (
    <StudioLayout
      badge="• RADAR ANOMALY // RESTRICTED AIRSPACE"
      headline="Over the Capitol."
      subtitle="July 1952: Unidentified objects tracked on D.C. radar."
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `translateY(${cardTranslateY}px) scale(${cardScale})`,
          opacity: cardOpacity,
        }}
      >
        <FloatingCard>
          {/* Card Top Meta */}
          <div
            style={{
              height: 52,
              padding: "0 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              backgroundColor: "#FCFBF8",
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
              WASHINGTON NATIONAL AIRPORT // RADAR LOG
            </span>
            <span
              style={{
                fontFamily: theme.fonts.mono,
                fontSize: 15,
                color: "#A8A29E",
              }}
            >
              JULY 19–20, 1952
            </span>
          </div>

          {/* Photo Container */}
          <div
            style={{
              width: "100%",
              height: "calc(100% - 52px)",
              overflow: "hidden",
              position: "relative",
              backgroundColor: "#1A1A1A",
            }}
          >
            <Img
              src={staticFile("Assets/images.jpeg")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 45%",
                transform: `scale(${imgScale})`,
                filter: "contrast(1.15) brightness(1.05)",
              }}
            />

            {/* Subtle radar sweep line animation across photo */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                backgroundColor: "rgba(52, 211, 153, 0.6)",
                boxShadow: "0 0 12px rgba(52, 211, 153, 0.8)",
                transform: `translateY(${interpolate(frame, [0, 120], [0, 920])}px)`,
                pointerEvents: "none",
              }}
            />

            {/* Bottom info strip */}
            <div
              style={{
                position: "absolute",
                bottom: 24,
                left: 24,
                right: 24,
                padding: "12px 18px",
                borderRadius: 10,
                backgroundColor: "rgba(18, 20, 24, 0.88)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontFamily: theme.fonts.mono,
                  fontSize: 14,
                  letterSpacing: "0.08em",
                  color: "#E2E8F0",
                }}
              >
                TARGETS TRACKED BY 3 INDEPENDENT RADARS
              </span>
              <span
                style={{
                  fontFamily: theme.fonts.mono,
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#34D399",
                }}
              >
                7 TARGETS
              </span>
            </div>
          </div>
        </FloatingCard>
      </div>
    </StudioLayout>
  );
};
