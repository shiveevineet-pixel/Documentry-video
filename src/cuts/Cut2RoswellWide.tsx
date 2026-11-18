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

export const Cut2RoswellWide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for floating card
  const cardEntrance = spring({
    frame,
    fps,
    config: theme.spring.cardSnap,
  });
  const cardTranslateY = interpolate(cardEntrance, [0, 1], [40, 0]);
  const cardScale = interpolate(cardEntrance, [0, 1], [0.96, 1]);
  const cardOpacity = interpolate(cardEntrance, [0, 1], [0, 1]);

  // Subtle continuous Ken Burns camera push inside the card
  const imageZoom = interpolate(frame, [0, 120], [1.36, 1.41], {
    easing: theme.ease.inOut,
  });

  return (
    <StudioLayout
      badge="• CASE FILE 01 // NEW MEXICO"
      headline="July 8, 1947."
      subtitle="The military announces a captured disc in Roswell."
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
          {/* Top subtle card metadata header */}
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
              ROSWELL DAILY RECORD // FRONT PAGE
            </span>
            <span
              style={{
                fontFamily: theme.fonts.mono,
                fontSize: 15,
                color: "#A8A29E",
              }}
            >
              JULY 8, 1947
            </span>
          </div>

          {/* Archival Newspaper Clipping with strict crop hiding modern header */}
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
              src={staticFile("Assets/2nd proof.jpg")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 70%", // cleanly crops below modern book title
                transform: `scale(${imageZoom})`,
                filter: "contrast(1.08) brightness(0.98)",
              }}
            />

            {/* Subtle vintage vignette inside card */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                boxShadow: "inset 0 0 60px rgba(0,0,0,0.12)",
                pointerEvents: "none",
              }}
            />
          </div>
        </FloatingCard>
      </div>
    </StudioLayout>
  );
};
