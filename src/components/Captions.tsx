import React from "react";
import { useCurrentFrame, spring, useVideoConfig } from "remotion";

interface CaptionSegment {
  startFrame: number;
  endFrame: number;
  text: string;
  highlightColor?: string;
}

const CAPTION_SEGMENTS: CaptionSegment[] = [
  // Shot 1
  { startFrame: 0, endFrame: 210, text: "3:00 AM. A MIMIC IS LOOSE.", highlightColor: "#EF4444" },
  { startFrame: 210, endFrame: 420, text: "IT STEALS TRUSTED VOICES.", highlightColor: "#F87171" },

  // Shot 2
  { startFrame: 420, endFrame: 600, text: "SOMEONE BANGS ON THE GLASS." },
  { startFrame: 600, endFrame: 780, text: "WAIT... WHO IS CALLING?", highlightColor: "#22C55E" },

  // Shot 3 (Choice 1)
  { startFrame: 780, endFrame: 1080, text: "CHOOSE: WHAT DO YOU DO?", highlightColor: "#FACC15" },

  // Shot 4
  { startFrame: 1080, endFrame: 1340, text: "VOICE: 'LET ME IN, MAN...'" },
  { startFrame: 1340, endFrame: 1420, text: "THAT IS NOT HIM.", highlightColor: "#EF4444" },
  { startFrame: 1420, endFrame: 1560, text: "IT BROKE THE GLASS!", highlightColor: "#DC2626" },

  // Shot 5
  { startFrame: 1560, endFrame: 1780, text: "RUN TO THE BACK CORRIDOR!" },
  { startFrame: 1780, endFrame: 1980, text: "IT'S RIGHT BEHIND YOU!", highlightColor: "#EF4444" },

  // Shot 6 (Choice 2)
  { startFrame: 1980, endFrame: 2460, text: "DEAD END. WHERE DO YOU GO?", highlightColor: "#FACC15" },

  // Shot 7
  { startFrame: 2460, endFrame: 2640, text: "INTO THE FREEZER! LOCK IT!" },
  { startFrame: 2640, endFrame: 2880, text: "SEALED SHUT. YOU'RE SAFE..." },

  // Shot 8
  { startFrame: 2880, endFrame: 3180, text: "...OR ARE YOU?", highlightColor: "#93C5FD" },
  { startFrame: 3180, endFrame: 3300, text: "IT WAS ALREADY INSIDE.", highlightColor: "#FFFFFF" },
];

export const Captions: React.FC = () => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentSegment = CAPTION_SEGMENTS.find(
    (s) => currentFrame >= s.startFrame && currentFrame < s.endFrame
  );

  if (!currentSegment) return null;

  const segmentFrame = currentFrame - currentSegment.startFrame;
  const pop = spring({
    frame: segmentFrame,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.6 },
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 280, // Instagram safe zone: top > 240px
        left: 540,
        transform: `translateX(-50%) scale(${pop})`,
        width: 900,
        textAlign: "center",
        zIndex: 60,
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          fontFamily: "system-ui, -apple-system, 'Inter', sans-serif",
          fontSize: 52,
          fontWeight: 900,
          color: currentSegment.highlightColor || "#FFFFFF",
          textTransform: "uppercase",
          letterSpacing: "-0.01em",
          lineHeight: 1.15,
          textShadow: `
            0 4px 16px rgba(0, 0, 0, 0.95),
            0 2px 4px rgba(0, 0, 0, 0.9),
            0 0 30px rgba(0, 0, 0, 0.8)
          `,
          padding: "8px 24px",
          display: "inline-block",
        }}
      >
        {currentSegment.text}
      </span>
    </div>
  );
};

