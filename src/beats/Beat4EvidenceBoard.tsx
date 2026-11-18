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

export const Beat4EvidenceBoard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Fast 2.5D camera glide across dark desk
  const camPanX = interpolate(frame, [0, durationInFrames], [20, -50], {
    easing: theme.ease.inOut,
  });
  const camPanY = interpolate(frame, [0, durationInFrames], [30, -30], {
    easing: theme.ease.inOut,
  });
  const camZoom = interpolate(frame, [0, durationInFrames], [1.02, 1.14], {
    easing: theme.ease.inOut,
  });

  // Staccato Slam Entrances (every 45 frames)
  // Item 1: Roswell Newspaper (frame 0)
  const item1Spring = spring({ frame: frame - 0, fps, config: theme.spring.slam });
  // Item 2: Capitol UFO Photo (frame 45)
  const item2Spring = spring({ frame: frame - 45, fps, config: theme.spring.slam });
  // Item 3: Blue Book Memo (frame 90)
  const item3Spring = spring({ frame: frame - 90, fps, config: theme.spring.slam });

  // Animated Red String draw progress
  const line1Progress = interpolate(frame, [50, 95], [0, 1], {
    easing: theme.ease.outExpo,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const line2Progress = interpolate(frame, [95, 140], [0, 1], {
    easing: theme.ease.outExpo,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#13100E",
        overflow: "hidden",
        transform: `translate(${camPanX}px, ${camPanY}px) scale(${camZoom})`,
        transformOrigin: "center center",
      }}
    >
      {/* Dark Mahogany / Evidence Cork Desk Surface */}
      <div
        style={{
          position: "absolute",
          inset: -150,
          background:
            "radial-gradient(ellipse at 50% 45%, #241D17 0%, #140F0C 70%, #0A0806 100%)",
        }}
      />

      {/* Animated Red Yarn Connections (SVG) */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: 1080,
          height: 1920,
          pointerEvents: "none",
          zIndex: 15,
        }}
      >
        <filter id="string-drop-shadow">
          <feDropShadow dx="3" dy="5" stdDeviation="4" floodColor="#000000" floodOpacity="0.8" />
        </filter>

        {/* Line 1: From Roswell to Capitol Photo */}
        {frame >= 50 && (
          <path
            d="M 310 440 Q 420 520 720 540"
            stroke={theme.colors.crimsonStamp}
            strokeWidth="3.5"
            fill="none"
            filter="url(#string-drop-shadow)"
            strokeDasharray="450"
            strokeDashoffset={450 * (1 - line1Progress)}
          />
        )}

        {/* Line 2: From Capitol Photo to Hero Memo */}
        {frame >= 95 && (
          <path
            d="M 720 540 Q 560 760 480 920"
            stroke={theme.colors.crimsonStamp}
            strokeWidth="3.5"
            fill="none"
            filter="url(#string-drop-shadow)"
            strokeDasharray="480"
            strokeDashoffset={480 * (1 - line2Progress)}
          />
        )}
      </svg>

      {/* ITEM 1: Roswell Newspaper (Assets/2nd proof.jpg) */}
      <div
        style={{
          position: "absolute",
          top: 310,
          left: theme.safeZone.left,
          width: 290,
          padding: "10px 10px 24px 10px",
          backgroundColor: "#F0EADB",
          boxShadow: "0 18px 40px rgba(0,0,0,0.85), 0 3px 8px rgba(0,0,0,0.5)",
          transform: `
            scale(${interpolate(item1Spring, [0, 1], [1.5, 1])})
            rotate(${interpolate(item1Spring, [0, 1], [-12, -4])}deg)
          `,
          opacity: item1Spring,
          zIndex: 10,
        }}
      >
        {/* Pushpin */}
        <div
          style={{
            position: "absolute",
            top: -8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 16,
            height: 16,
            borderRadius: "50%",
            backgroundColor: theme.colors.crimsonStamp,
            boxShadow: "0 4px 8px rgba(0,0,0,0.7)",
            border: "2px solid #550707",
          }}
        />
        <div style={{ width: "100%", height: 210, overflow: "hidden" }}>
          <Img
            src={staticFile("Assets/2nd proof.jpg")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div
          style={{
            fontFamily: theme.fonts.typewriter,
            fontSize: 10,
            color: "#333",
            marginTop: 6,
            fontWeight: 700,
          }}
        >
          EVIDENCE #1 // ROSWELL 1947
        </div>
      </div>

      {/* ITEM 2: Capitol UFO Photo (Assets/images.jpeg) */}
      <div
        style={{
          position: "absolute",
          top: 420,
          right: theme.safeZone.right + 20,
          width: 280,
          padding: "10px 10px 24px 10px",
          backgroundColor: "#F4F1EA",
          boxShadow: "0 18px 40px rgba(0,0,0,0.85)",
          transform: `
            scale(${interpolate(item2Spring, [0, 1], [1.5, 1])})
            rotate(${interpolate(item2Spring, [0, 1], [14, 5])}deg)
          `,
          opacity: item2Spring,
          zIndex: 12,
        }}
      >
        {/* Pushpin */}
        <div
          style={{
            position: "absolute",
            top: -8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 16,
            height: 16,
            borderRadius: "50%",
            backgroundColor: theme.colors.crimsonStamp,
            boxShadow: "0 4px 8px rgba(0,0,0,0.7)",
            border: "2px solid #550707",
          }}
        />
        <div style={{ width: "100%", height: 210, overflow: "hidden" }}>
          <Img
            src={staticFile("Assets/images.jpeg")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div
          style={{
            fontFamily: theme.fonts.typewriter,
            fontSize: 10,
            color: "#333",
            marginTop: 6,
            fontWeight: 700,
          }}
        >
          EVIDENCE #2 // CAPITOL 1952
        </div>
      </div>

      {/* ITEM 3: Declassified Blue Book Memo (Assets/proof 3.jpeg) */}
      <div
        style={{
          position: "absolute",
          top: 760,
          left: theme.safeZone.left + 20,
          right: theme.safeZone.right + 40,
          height: 620,
          backgroundColor: "#EDE8DC",
          boxShadow: "0 25px 60px rgba(0,0,0,0.9)",
          borderRadius: 4,
          border: "1px solid #D2CABA",
          transform: `
            scale(${interpolate(item3Spring, [0, 1], [1.6, 1])})
            rotate(${interpolate(item3Spring, [0, 1], [-8, -1.5])}deg)
          `,
          opacity: item3Spring,
          zIndex: 20,
          overflow: "hidden",
        }}
      >
        <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
          <Img
            src={staticFile("Assets/proof 3.jpeg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top center",
              filter: "contrast(1.15)",
            }}
          />
        </div>
      </div>

      {/* Safe-Zone Documentary Bottom Banner */}
      <div
        style={{
          position: "absolute",
          bottom: theme.safeZone.bottom + 15,
          left: theme.safeZone.left,
          right: theme.safeZone.right + 25,
          backgroundColor: "rgba(19, 16, 14, 0.94)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(224, 159, 62, 0.4)",
          padding: "14px 20px",
          borderRadius: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 30,
        }}
      >
        <div
          style={{
            fontFamily: theme.fonts.editorial,
            fontSize: 26,
            color: theme.colors.archivalPaper,
            letterSpacing: "0.02em",
          }}
        >
          CONNECTING THE DECLASSIFIED NODES
        </div>
        <div
          style={{
            fontFamily: theme.fonts.typewriter,
            fontSize: 11,
            color: theme.colors.tungstenAmber,
            fontWeight: 700,
          }}
        >
          1947 — 1969
        </div>
      </div>
    </AbsoluteFill>
  );
};
