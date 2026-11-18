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

export const Cut7BlueBookHero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const entrance = spring({
    frame,
    fps,
    config: theme.spring.cardSnap,
  });
  const translateY = interpolate(entrance, [0, 1], [40, 0]);
  const scale = interpolate(entrance, [0, 1], [0.95, 1]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  // Subtle continuous push-in
  const docScale = interpolate(frame, [0, 180], [1.02, 1.07], {
    easing: theme.ease.inOut,
  });

  return (
    <StudioLayout
      badge="• USAF INVESTIGATION // 1952–1969"
      headline="Project Blue Book."
      subtitle="Official Air Force scientific inquiry into UAP sightings."
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `translateY(${translateY}px) scale(${scale})`,
          opacity,
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
              MEMO ARCHIVE // WRIGHT-PATTERSON AFB
            </span>
            <span
              style={{
                fontFamily: theme.fonts.mono,
                fontSize: 14,
                fontWeight: 700,
                color: theme.colors.crimsonRed,
              }}
            >
              LEVEL 4 CLASSIFICATION
            </span>
          </div>

          {/* Document Content Viewport */}
          <div
            style={{
              width: "100%",
              height: "calc(100% - 52px)",
              overflow: "hidden",
              position: "relative",
              backgroundColor: "#ECE8DD",
            }}
          >
            <Img
              src={staticFile("Assets/proof 3.jpeg")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                transform: `scale(${docScale})`,
                filter: "contrast(1.12) brightness(0.97)",
              }}
            />

            {/* Heavy Black Redaction Bars across key findings */}
            <div
              style={{
                position: "absolute",
                top: "38%",
                left: "22%",
                width: "56%",
                height: 22,
                backgroundColor: theme.colors.redactedInk,
                borderRadius: 2,
                boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "43%",
                left: "22%",
                width: "48%",
                height: 22,
                backgroundColor: theme.colors.redactedInk,
                borderRadius: 2,
                boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "48%",
                left: "22%",
                width: "52%",
                height: 22,
                backgroundColor: theme.colors.redactedInk,
                borderRadius: 2,
                boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
              }}
            />

            {/* Bottom Tag */}
            <div
              style={{
                position: "absolute",
                bottom: 24,
                left: 24,
                right: 24,
                padding: "12px 18px",
                borderRadius: 10,
                backgroundColor: "rgba(255, 255, 255, 0.92)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(0,0,0,0.08)",
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
                  color: "#57534E",
                }}
              >
                DIRECTORATE OF INTELLIGENCE // MEMORANDUM
              </span>
              <span
                style={{
                  fontFamily: theme.fonts.mono,
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#141413",
                }}
              >
                RESTRICTED ACCESS
              </span>
            </div>
          </div>
        </FloatingCard>
      </div>
    </StudioLayout>
  );
};
