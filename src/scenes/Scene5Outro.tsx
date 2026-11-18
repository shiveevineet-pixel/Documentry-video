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

export const Scene5Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Handheld camera breathing drift
  const driftX = Math.sin(frame * 0.03) * 3;
  const driftY = Math.cos(frame * 0.025) * 3;
  const driftRotate = Math.sin(frame * 0.02) * 0.15;

  // Rapid Montage Phase: frames 0 to 48 (4 frames per cut = 12 cuts)
  const isMontage = frame < 48;
  const montageCutIndex = Math.floor(frame / 4);

  // Staggered Title Entrances
  const badgeSpring = spring({
    frame: frame - 55,
    fps,
    config: theme.spring.snappy,
  });

  const titleSpring = spring({
    frame: frame - 70,
    fps,
    config: theme.spring.smooth,
  });

  const subtextSpring = spring({
    frame: frame - 95,
    fps,
    config: theme.spring.smooth,
  });

  const footerSpring = spring({
    frame: frame - 120,
    fps,
    config: theme.spring.smooth,
  });

  // Loop Transition: collapse into warm amber dot on frames 220 to 240
  // Matches exact radar center of Scene 1 (X: 540, Y: 660)
  const loopCollapse = interpolate(frame, [220, 240], [0, 1], {
    easing: theme.ease.in,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const contentScale = interpolate(loopCollapse, [0, 1], [1, 0.01]);
  const contentOpacity = interpolate(loopCollapse, [0, 0.85, 1], [1, 0.35, 0]);

  const radarDotX = 540;
  const radarDotY = 660;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0D0C0B",
        transform: `
          translate(${driftX}px, ${driftY}px) 
          rotate(${driftRotate}deg)
        `,
      }}
    >
      {/* 1. FAST RHYTHMIC MONTAGE CUTS (Frames 0 - 48) — Macro crops of real evidence */}
      {isMontage && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#000",
            overflow: "hidden",
          }}
        >
          {/* Cut 0 & 4: Macro crop of 1952 Capitol UFO photo */}
          {(montageCutIndex === 0 || montageCutIndex === 4) && (
            <AbsoluteFill style={{ transform: "scale(1.4) rotate(-3deg)" }}>
              <Img
                src={staticFile("Assets/images.jpeg")}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  border: "20px solid #B91C1C",
                }}
              />
            </AbsoluteFill>
          )}

          {/* Cut 1 & 5: Macro crop of Roswell newspaper clipping */}
          {(montageCutIndex === 1 || montageCutIndex === 5) && (
            <AbsoluteFill style={{ transform: "scale(1.3) rotate(2deg)" }}>
              <Img
                src={staticFile("Assets/2nd proof.jpg")}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center 20%",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "40%",
                  left: "10%",
                  right: "10%",
                  backgroundColor: "#B91C1C",
                  color: "#FFF",
                  fontFamily: theme.fonts.editorial,
                  fontSize: 52,
                  textAlign: "center",
                  padding: "10px",
                }}
              >
                ROSWELL 1947
              </div>
            </AbsoluteFill>
          )}

          {/* Cut 2 & 6: Macro crop of Blue Book Memo */}
          {(montageCutIndex === 2 || montageCutIndex === 6) && (
            <AbsoluteFill style={{ transform: "scale(1.5)" }}>
              <Img
                src={staticFile("Assets/proof 3.jpeg")}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "35%",
                  left: "5%",
                  right: "5%",
                  height: 100,
                  backgroundColor: "#141413",
                  color: "#FFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: theme.fonts.editorial,
                  fontSize: 48,
                  letterSpacing: "0.1em",
                }}
              >
                DECLASSIFIED
              </div>
            </AbsoluteFill>
          )}

          {/* Cut 3 & 7: Macro crop of Navy GIMBAL FLIR footage */}
          {(montageCutIndex === 3 || montageCutIndex >= 7) && (
            <AbsoluteFill style={{ transform: "scale(1.35)" }}>
              <Img
                src={staticFile("Assets/proof 4.webp")}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "30%",
                  left: "10%",
                  right: "10%",
                  border: "4px solid #E09F3E",
                  color: "#E09F3E",
                  fontFamily: theme.fonts.tech,
                  fontSize: 36,
                  textAlign: "center",
                  padding: "8px",
                  fontWeight: 800,
                }}
              >
                GIMBAL 2017
              </div>
            </AbsoluteFill>
          )}
        </AbsoluteFill>
      )}

      {/* 2. EDITORIAL OUTRO CARD (Frames 48 - 240) */}
      {!isMontage && (
        <AbsoluteFill
          style={{
            transform: `scale(${contentScale})`,
            transformOrigin: `${radarDotX}px ${radarDotY}px`,
            opacity: contentOpacity,
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

          {/* Outro Typography Stack (Centered in 4:5 Safe Zone) */}
          <div
            style={{
              position: "absolute",
              top: 660,
              left: theme.safeZone.left,
              right: theme.safeZone.right,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 28,
            }}
          >
            {/* Archive Header Tag */}
            <div
              style={{
                opacity: badgeSpring,
                transform: `scale(${interpolate(badgeSpring, [0, 1], [0.9, 1])})`,
                fontFamily: theme.fonts.typewriter,
                fontSize: 13,
                color: theme.colors.tungstenAmber,
                letterSpacing: "0.2em",
                border: "1px solid rgba(224, 159, 62, 0.4)",
                padding: "8px 24px",
                borderRadius: 3,
                background: "rgba(224, 159, 62, 0.08)",
                boxShadow: "0 0 20px rgba(224, 159, 62, 0.12)",
              }}
            >
              PROJECT BLUE BOOK ARCHIVE // DECLASSIFIED
            </div>

            {/* STACKED BOLD EDITORIAL TITLE */}
            <div
              style={{
                opacity: titleSpring,
                transform: `
                  scale(${interpolate(titleSpring, [0, 1], [0.85, 1])})
                  translateY(${interpolate(titleSpring, [0, 1], [30, 0])}px)
                `,
                fontFamily: theme.fonts.editorial,
                fontSize: 78,
                lineHeight: 0.95,
                color: theme.colors.archivalPaper,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                textShadow: "0 8px 35px rgba(0,0,0,0.95)",
              }}
            >
              THE FILES{" "}
              <span
                style={{
                  color: theme.colors.tungstenAmber,
                  textShadow: `0 0 40px ${theme.colors.tungstenAmber}`,
                }}
              >
                ARE OPEN.
              </span>
            </div>

            {/* Subtext */}
            <div
              style={{
                opacity: subtextSpring,
                transform: `
                  scale(${interpolate(subtextSpring, [0, 1], [0.9, 1])})
                  translateY(${interpolate(subtextSpring, [0, 1], [25, 0])}px)
                `,
                fontFamily: theme.fonts.typewriter,
                fontSize: 26,
                color: theme.colors.archivalPaper,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                lineHeight: 1.3,
                fontWeight: 700,
              }}
            >
              THE ANSWERS{" "}
              <span
                style={{
                  color: theme.colors.crimsonStamp,
                  fontWeight: 800,
                  textShadow: `0 0 25px ${theme.colors.crimsonGlow}`,
                }}
              >
                REMAIN CLASSIFIED.
              </span>
            </div>

            {/* Footer / Replay Callout */}
            <div
              style={{
                opacity: footerSpring,
                marginTop: 20,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontFamily: theme.fonts.typewriter,
                  fontSize: 15,
                  color: theme.colors.charcoalLight,
                }}
              >
                <span>SYS_STATUS: READY &gt;</span>
                <span
                  style={{
                    width: 12,
                    height: 20,
                    backgroundColor: theme.colors.tungstenAmber,
                    display: Math.floor(frame / 8) % 2 === 0 ? "inline-block" : "none",
                    boxShadow: `0 0 10px ${theme.colors.tungstenAmber}`,
                  }}
                />
              </div>
              <div
                style={{
                  fontFamily: theme.fonts.typewriter,
                  fontSize: 12,
                  color: "rgba(242, 239, 233, 0.45)",
                  letterSpacing: "0.1em",
                }}
              >
                HOLD TO REPLAY // SHARE THE ARCHIVE
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* 3. SEAMLESS LOOP CONNECTOR: Warm amber dot matching Scene 1 radar ping */}
      {loopCollapse > 0 && (
        <div
          style={{
            position: "absolute",
            left: radarDotX,
            top: radarDotY,
            transform: "translate(-50%, -50%)",
            width: interpolate(loopCollapse, [0, 1], [0, 28]),
            height: interpolate(loopCollapse, [0, 1], [0, 28]),
            borderRadius: "50%",
            backgroundColor: "#FFFFFF",
            boxShadow: `0 0 35px #E09F3E, 0 0 70px #E09F3E`,
            opacity: loopCollapse,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
