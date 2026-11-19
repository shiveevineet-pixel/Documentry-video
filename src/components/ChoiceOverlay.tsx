import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface ChoiceItem {
  id: "A" | "B";
  label: string;
  anchor: { x: number; y: number }; // Target point on screen (0-1080, 0-1920)
  badge: { x: number; y: number };  // Pill center position (0-1080, 0-1920)
}

interface ChoiceOverlayProps {
  choiceA: ChoiceItem;
  choiceB: ChoiceItem;
  selectedChoice: "A" | "B";
  selectionFrame: number; // relative frame when selection activates
}

export const ChoiceOverlay: React.FC<ChoiceOverlayProps> = ({
  choiceA,
  choiceB,
  selectedChoice,
  selectionFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring animation for the whole overlay (0 to 20 frames)
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Selection spring animation
  const isSelected = frame >= selectionFrame;
  const selectSpring = spring({
    frame: Math.max(0, frame - selectionFrame),
    fps,
    config: { damping: 10, stiffness: 180, mass: 0.8 },
  });

  const renderChoicePill = (choice: ChoiceItem) => {
    const isThisSelected = isSelected && selectedChoice === choice.id;
    const isOtherSelected = isSelected && selectedChoice !== choice.id;

    // Scale pop calculation
    const baseScale = enterSpring;
    const popScale = isThisSelected ? interpolate(selectSpring, [0, 0.4, 1], [1, 1.15, 1.06]) : 1;
    const currentScale = baseScale * popScale;
    const opacity = isOtherSelected ? 0.4 : 1.0;

    const bgColor = isThisSelected ? "#FACC15" : "rgba(15, 23, 42, 0.88)";
    const textColor = isThisSelected ? "#09090B" : "#F8FAFC";
    const borderColor = isThisSelected ? "#FEF08A" : "rgba(255, 255, 255, 0.35)";
    const shadow = isThisSelected
      ? "0 0 35px rgba(250, 204, 21, 0.7), 0 8px 24px rgba(0, 0, 0, 0.6)"
      : "0 10px 25px rgba(0, 0, 0, 0.65)";

    return (
      <div
        key={choice.id}
        style={{
          position: "absolute",
          left: choice.badge.x,
          top: choice.badge.y,
          transform: `translate(-50%, -50%) scale(${currentScale})`,
          opacity,
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "16px 28px",
          borderRadius: 48,
          backgroundColor: bgColor,
          border: `2.5px solid ${borderColor}`,
          backdropFilter: "blur(12px)",
          boxShadow: shadow,
          transition: "opacity 0.2s ease, background-color 0.15s ease",
          zIndex: isThisSelected ? 50 : 30,
          pointerEvents: "none",
        }}
      >
        {/* Choice Letter Tag */}
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            backgroundColor: isThisSelected ? "#000000" : "#38BDF8",
            color: isThisSelected ? "#FACC15" : "#0F172A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 900,
            fontSize: 22,
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          {choice.id}
        </div>

        {/* Choice Label */}
        <div
          style={{
            fontSize: 26,
            fontWeight: 800,
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "0.02em",
            color: textColor,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          {choice.label}
        </div>
      </div>
    );
  };

  const renderLeaderLine = (choice: ChoiceItem) => {
    // Leader line from anchor dot to badge center
    const x1 = choice.anchor.x;
    const y1 = choice.anchor.y;
    const x2 = choice.badge.x;
    const y2 = choice.badge.y;

    // Line drawing progress
    const drawProgress = Math.min(1, enterSpring);
    const currX2 = interpolate(drawProgress, [0, 1], [x1, x2]);
    const currY2 = interpolate(drawProgress, [0, 1], [y1, y2]);

    const isThisSelected = isSelected && selectedChoice === choice.id;
    const strokeColor = isThisSelected ? "#FACC15" : "#FFFFFF";
    const strokeWidth = isThisSelected ? 3.5 : 2.5;

    return (
      <g key={`line-${choice.id}`}>
        {/* Anchor point target dot */}
        <circle
          cx={x1}
          cy={y1}
          r={7 * enterSpring}
          fill={strokeColor}
          filter="drop-shadow(0 0 6px rgba(0,0,0,0.8))"
        />
        <circle
          cx={x1}
          cy={y1}
          r={14 * enterSpring}
          fill="none"
          stroke={strokeColor}
          strokeWidth={1.5}
          opacity={0.7}
        />

        {/* Connecting leader line */}
        <line
          x1={x1}
          y1={y1}
          x2={currX2}
          y2={currY2}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          filter="drop-shadow(0 2px 5px rgba(0,0,0,0.7))"
        />
      </g>
    );
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 40,
      }}
    >
      {/* SVG Leader Lines */}
      <svg
        width={1080}
        height={1920}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }}
      >
        {renderLeaderLine(choiceA)}
        {renderLeaderLine(choiceB)}
      </svg>

      {/* Choice Badges */}
      {renderChoicePill(choiceA)}
      {renderChoicePill(choiceB)}
    </div>
  );
};

