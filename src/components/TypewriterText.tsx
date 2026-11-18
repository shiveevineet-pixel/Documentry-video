import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";

interface TypewriterTextProps {
  text: string;
  startFrame?: number;
  framesPerChar?: number;
  style?: React.CSSProperties;
  showCursor?: boolean;
  cursorColor?: string;
  onCharacterRender?: (charIndex: number) => void;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  startFrame = 0,
  framesPerChar = 2,
  style = {},
  showCursor = true,
  cursorColor = theme.colors.tungstenAmber,
}) => {
  const frame = useCurrentFrame();
  const relativeFrame = Math.max(0, frame - startFrame);

  const visibleCharCount = Math.min(
    text.length,
    Math.floor(relativeFrame / framesPerChar)
  );

  const displayedText = text.slice(0, visibleCharCount);
  const isTyping = visibleCharCount < text.length && frame >= startFrame;
  const cursorBlink = Math.floor(frame / 8) % 2 === 0;

  return (
    <span
      style={{
        fontFamily: theme.fonts.typewriter,
        whiteSpace: "pre-wrap",
        display: "inline-block",
        ...style,
      }}
    >
      {displayedText}
      {showCursor && (isTyping || cursorBlink) && (
        <span
          style={{
            display: "inline-block",
            width: "0.55em",
            height: "1.1em",
            backgroundColor: cursorColor,
            marginLeft: "2px",
            verticalAlign: "text-bottom",
            boxShadow: `0 0 8px ${cursorColor}`,
          }}
        />
      )}
    </span>
  );
};
