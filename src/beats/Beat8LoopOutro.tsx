import React from "react";
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

const ASSETS = [
  "Assets/proof 3.jpeg",
  "Assets/images.jpeg",
  "Assets/2nd proof.jpg",
  "Assets/proof 4.webp",
];

export const Beat8LoopOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: 6-frame-per-cut strobe montage (frames 0 to 240)
  const isStrobe = frame < 240;
  const strobeIndex = Math.floor(frame / 6) % ASSETS.length;
  const currentAsset = ASSETS[strobeIndex];

  // Phase 2: Slams to black title card at frame 240
  const slamSpring = spring({
    frame: frame - 240,
    fps,
    config: theme.spring.slam,
  });

  const subtextSpring = spring({
    frame: frame - 300,
    fps,
    config: theme.spring.slam,
  });

  // Phase 3: Final 20 frames (700 to 720) collapse cleanly into Frame 0 opening crop
  const loopProgress = interpolate(frame, [700, 720], [0, 1], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const outroScale = interpolate(loopProgress, [0, 1], [1, 2.4]);
  const outroOpacity = interpolate(loopProgress, [0, 0.8, 1], [1, 0.4, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0D0C0A",
        overflow: "hidden",
      }}
    >
      {/* 1. 6-FRAME STROBE MONTAGE OF ALL 4 REAL ASSETS */}
      {isStrobe && (
        <AbsoluteFill
          style={{
            backgroundColor: "#000",
            overflow: "hidden",
          }}
        >
          <Img
            src={staticFile(currentAsset)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${1.2 + (frame % 6) * 0.05}) rotate(${(frame % 12) - 6}deg)`,
              filter: (frame % 12 < 6) ? "contrast(1.4) brightness(1.1)" : "contrast(1.5) invert(0.85)",
            }}
          />
          {/* Rapid Flashing Redaction / Timestamp Stamp */}
          <div
            style={{
              position: "absolute",
              top: "45%",
              left: "10%",
              right: "10%",
              backgroundColor: frame % 12 < 6 ? theme.colors.crimsonStamp : theme.colors.charcoalInk,
              color: "#FFF",
              fontFamily: theme.fonts.editorial,
              fontSize: 56,
              textAlign: "center",
              padding: "12px",
              boxShadow: "0 0 40px rgba(0,0,0,0.9)",
            }}
          >
            {frame % 24 < 12 ? "DECLASSIFIED" : "RESTRICTED"}
          </div>
        </AbsoluteFill>
      )}

      {/* 2. SLAM TO BLACK TITLE CARD (Frames 240 - 720) */}
      {!isStrobe && (
        <AbsoluteFill
          style={{
            backgroundColor: "#0D0C0A",
            transform: `scale(${outroScale})`,
            transformOrigin: "center 40%",
            opacity: outroOpacity,
          }}
        >
          {/* Subtle amber grid */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `
                linear-gradient(rgba(224, 159, 62, 0.04) 1px, transparent 1px),
                linear-gradient(90deg, rgba(224, 159, 62, 0.04) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />

          {/* Outro Typography Stack (Safe Zone) */}
          <div
            style={{
              position: "absolute",
              top: 680,
              left: theme.safeZone.left,
              right: theme.safeZone.right,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 24,
            }}
          >
            {/* Tag */}
            <div
              style={{
                fontFamily: theme.fonts.typewriter,
                fontSize: 13,
                color: theme.colors.tungstenAmber,
                letterSpacing: "0.2em",
                border: "1px solid rgba(224, 159, 62, 0.4)",
                padding: "8px 24px",
                borderRadius: 3,
                background: "rgba(224, 159, 62, 0.08)",
              }}
            >
              PROJECT BLUE BOOK ARCHIVE
            </div>

            {/* STACKED BOLD EDITORIAL TITLE */}
            <div
              style={{
                fontFamily: theme.fonts.editorial,
                fontSize: 82,
                lineHeight: 0.95,
                color: theme.colors.archivalPaper,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                transform: `
                  scale(${interpolate(slamSpring, [0, 1], [0.8, 1])})
                  translateY(${interpolate(slamSpring, [0, 1], [30, 0])}px)
                `,
                opacity: slamSpring,
                textShadow: "0 8px 35px rgba(0,0,0,0.95)",
              }}
            >
              THE FILES{" "}
              <span
                style={{
                  color: theme.colors.tungstenAmber,
                  textShadow: `0 0 35px ${theme.colors.tungstenAmber}`,
                }}
              >
                ARE OPEN.
              </span>
            </div>

            {/* Subtext */}
            <div
              style={{
                fontFamily: theme.fonts.typewriter,
                fontSize: 26,
                color: theme.colors.archivalPaper,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                lineHeight: 1.3,
                fontWeight: 700,
                transform: `
                  scale(${interpolate(subtextSpring, [0, 1], [0.85, 1])})
                  translateY(${interpolate(subtextSpring, [0, 1], [25, 0])}px)
                `,
                opacity: subtextSpring,
              }}
            >
              THE TRUTH{" "}
              <span
                style={{
                  color: theme.colors.crimsonStamp,
                  fontWeight: 800,
                  textShadow: `0 0 25px ${theme.colors.crimsonGlow}`,
                }}
              >
                IS STILL HIDDEN.
              </span>
            </div>

            {/* Replay Indicator */}
            <div
              style={{
                marginTop: 24,
                fontFamily: theme.fonts.typewriter,
                fontSize: 12,
                color: "rgba(242, 239, 233, 0.5)",
                letterSpacing: "0.12em",
              }}
            >
              [REPLAY ARCHIVE // SHARE INVESTIGATION]
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* 3. SEAMLESS LOOP CONNECTOR: Frame 0 Document Macro Image */}
      {loopProgress > 0 && (
        <AbsoluteFill
          style={{
            opacity: loopProgress,
            transform: `scale(${interpolate(loopProgress, [0, 1], [1.1, 2.4])})`,
            transformOrigin: "center 40%",
          }}
        >
          <Img
            src={staticFile("Assets/proof 3.jpeg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              filter: "brightness(0.4) contrast(1.3)",
            }}
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
