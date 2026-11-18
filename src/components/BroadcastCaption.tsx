import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

interface BroadcastCaptionProps {
  text: string;
  startFrame?: number;
  highlightWord?: string;
  y?: number;
}

export const BroadcastCaption: React.FC<BroadcastCaptionProps> = ({
  text,
  startFrame = 0,
  highlightWord,
  y = 1260,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < startFrame) return null;

  const entrance = spring({
    frame: frame - startFrame,
    fps,
    config: theme.spring.snappy,
  });

  const translateY = interpolate(entrance, [0, 1], [15, 0]);
  const opacity = entrance;

  const words = text.split(" ");

  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: theme.safeZone.left,
        right: theme.safeZone.right + 20, // clear right 140px buttons
        display: "flex",
        justifyContent: "center",
        zIndex: 300,
        pointerEvents: "none",
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(20, 20, 19, 0.88)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: 6,
          padding: "14px 28px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.7)",
          display: "inline-flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "8px 10px",
          maxWidth: "88%",
        }}
      >
        {words.map((word, idx) => {
          const isHighlight =
            highlightWord &&
            word.toLowerCase().includes(highlightWord.toLowerCase());

          return (
            <span
              key={idx}
              style={{
                fontFamily: theme.fonts.bodySans,
                fontSize: 28,
                fontWeight: isHighlight ? 800 : 600,
                color: isHighlight ? theme.colors.tungstenAmber : "#FFFFFF",
                letterSpacing: "0.01em",
                lineHeight: 1.2,
                textTransform: "uppercase",
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
