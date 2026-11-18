import React, { useMemo } from "react";
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

export const Scene2EvidenceBoard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Handheld camera breathing drift
  const driftX = Math.sin(frame * 0.03) * 3;
  const driftY = Math.cos(frame * 0.025) * 3;
  const driftRotate = Math.sin(frame * 0.02) * 0.15;

  // Camera Crane / Tilt down and Dolly-Zoom onto hero memo
  const panY = interpolate(frame, [0, 90, 240], [30, -40, -60], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dollyZoom = interpolate(frame, [80, 190, 420], [1.0, 1.15, 1.18], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Dynamic Depth of Field: background items blur as camera focuses on hero memo
  const dofBlur = interpolate(frame, [80, 160], [0, 4.0], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dofDim = interpolate(frame, [80, 160], [1.0, 0.65], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Redaction bars wipe away starting at frame 110
  const redactionWipe = spring({
    frame: frame - 110,
    fps,
    config: theme.spring.smooth,
  });
  const redactionWidth = interpolate(redactionWipe, [0, 1], [100, 0]);
  const redactionOpacity = interpolate(redactionWipe, [0, 0.8, 1], [1, 0.5, 0]);

  // Stamp Slam trigger at frame 170
  const stampFrame = 170;
  const stampSpring = spring({
    frame: frame - stampFrame,
    fps,
    config: theme.spring.heavyImpact,
  });

  // Camera Shake on stamp impact (12 frames)
  const shakeIntensity = interpolate(
    frame,
    [stampFrame, stampFrame + 14],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const shakeX = Math.sin(frame * 2.8) * 12 * shakeIntensity;
  const shakeY = Math.cos(frame * 3.2) * 10 * shakeIntensity;

  // Particle dust splatter on stamp impact
  const dustBurst = interpolate(frame, [stampFrame, stampFrame + 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const particles = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      angle: (i / 18) * 2 * Math.PI,
      distance: 60 + (i % 5) * 22,
      size: 2.5 + (i % 3) * 2,
    }));
  }, []);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#12100E",
        transform: `
          translate(${shakeX + driftX}px, ${panY + shakeY + driftY}px) 
          scale(${dollyZoom}) 
          rotate(${driftRotate}deg)
        `,
        transformOrigin: "center 850px",
      }}
    >
      {/* Dark Aged Mahogany / Evidence Corkboard Surface */}
      <div
        style={{
          position: "absolute",
          inset: -150,
          background:
            "radial-gradient(ellipse at 50% 42%, #221B16 0%, #130E0B 70%, #0A0807 100%)",
        }}
      />

      {/* BACKGROUND EVIDENCE ITEMS (With Dynamic Depth of Field) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          filter: dofBlur > 0 ? `blur(${dofBlur}px)` : undefined,
          opacity: dofDim,
          transition: "filter 0.2s ease, opacity 0.2s ease",
          zIndex: 10,
        }}
      >
        {/* Red Yarn Connecting Pins */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: 1080,
            height: 1920,
            pointerEvents: "none",
          }}
        >
          <filter id="yarn-shadow">
            <feDropShadow dx="3" dy="5" stdDeviation="4" floodColor="#000000" floodOpacity="0.8" />
          </filter>
          <path
            d="M 220 370 Q 360 440 540 600"
            stroke={theme.colors.crimsonStamp}
            strokeWidth="3.5"
            fill="none"
            filter="url(#yarn-shadow)"
            opacity="0.85"
          />
          <path
            d="M 540 600 Q 710 680 840 480"
            stroke={theme.colors.crimsonStamp}
            strokeWidth="3"
            fill="none"
            filter="url(#yarn-shadow)"
            opacity="0.8"
          />
        </svg>

        {/* Real Archival Photo 1: 1952 Washington D.C. UFO Sighting (images.jpeg) */}
        <div
          style={{
            position: "absolute",
            top: 290,
            left: theme.safeZone.left,
            width: 250,
            padding: "10px 10px 24px 10px",
            backgroundColor: "#F4F1EA",
            boxShadow: "0 15px 35px rgba(0,0,0,0.8), 0 2px 6px rgba(0,0,0,0.5)",
            transform: "rotate(-5deg)",
          }}
        >
          {/* Metallic Pushpin */}
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
              boxShadow: "0 3px 8px rgba(0,0,0,0.7)",
              border: "2px solid #5A0808",
              zIndex: 3,
            }}
          />
          <div
            style={{
              width: "100%",
              height: 190,
              overflow: "hidden",
              border: "1px solid #D2CBBD",
            }}
          >
            <Img
              src={staticFile("Assets/images.jpeg")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "contrast(1.1) brightness(0.95)",
              }}
            />
          </div>
          <div
            style={{
              fontFamily: theme.fonts.typewriter,
              fontSize: 10,
              color: "#222",
              marginTop: 6,
              fontWeight: 700,
              letterSpacing: "0.04em",
            }}
          >
            U.S. CAPITOL // 07.19.1952
          </div>
        </div>

        {/* Real Archival Photo 2: 1947 Roswell Newspaper Clipping (2nd proof.jpg) */}
        <div
          style={{
            position: "absolute",
            top: 310,
            right: theme.safeZone.right + 20,
            width: 240,
            padding: "10px 10px 22px 10px",
            backgroundColor: "#EFEBDD",
            boxShadow: "0 15px 35px rgba(0,0,0,0.8), 0 2px 6px rgba(0,0,0,0.5)",
            transform: "rotate(4deg)",
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
              boxShadow: "0 3px 8px rgba(0,0,0,0.7)",
              border: "2px solid #5A0808",
              zIndex: 3,
            }}
          />
          <div
            style={{
              width: "100%",
              height: 190,
              overflow: "hidden",
              border: "1px solid #CFC7B4",
            }}
          >
            <Img
              src={staticFile("Assets/2nd proof.jpg")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top center",
                filter: "contrast(1.08) sepia(0.15)",
              }}
            />
          </div>
          <div
            style={{
              fontFamily: theme.fonts.typewriter,
              fontSize: 10,
              color: "#222",
              marginTop: 6,
              fontWeight: 700,
              letterSpacing: "0.04em",
            }}
          >
            ROSWELL RECORD // 07.08.1947
          </div>
        </div>
      </div>

      {/* FOREGROUND HERO MEMORANDUM DOCUMENT: Real Declassified Scan (proof 3.jpeg) */}
      <div
        style={{
          position: "absolute",
          top: 520,
          left: theme.safeZone.left + 10,
          right: theme.safeZone.right + 30, // clears right buttons
          minHeight: 890,
          backgroundColor: "#EDE9DF",
          boxShadow: `
            0 30px 70px rgba(0,0,0,0.9),
            0 8px 20px rgba(0,0,0,0.6),
            inset 0 0 50px rgba(180, 170, 150, 0.4)
          `,
          borderRadius: 4,
          border: "1px solid #D5CEBE",
          zIndex: 20,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Real Document Scan as Base */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 520,
            overflow: "hidden",
            borderBottom: "2px solid #443C31",
          }}
        >
          <Img
            src={staticFile("Assets/proof 3.jpeg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top center",
              filter: "contrast(1.15) brightness(0.96) sepia(0.08)",
            }}
          />
          {/* Subtle paper vignette over scan */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              boxShadow: "inset 0 0 30px rgba(40, 30, 20, 0.35)",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Lower Case Context & Redaction Reveal Area */}
        <div
          style={{
            padding: "24px 28px 32px 28px",
            backgroundColor: "#F2EFE9",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Case metadata bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "1px dashed #A89F8B",
              paddingBottom: 10,
              fontFamily: theme.fonts.typewriter,
              fontSize: 12,
              color: "#332D26",
            }}
          >
            <div>
              <strong>CASE:</strong> #1952-07 // D.C. INQUIRY
            </div>
            <div>
              <strong>AUTH:</strong> WRIGHT-PATTERSON AFB
            </div>
            <div style={{ color: theme.colors.crimsonStamp, fontWeight: 700 }}>
              RESTRICTED
            </div>
          </div>

          {/* DYNAMIC REDACTION REVEAL BOX */}
          <div
            style={{
              position: "relative",
              padding: "18px 18px",
              margin: "18px 0",
              backgroundColor: "rgba(20, 20, 19, 0.05)",
              borderLeft: `4px solid ${theme.colors.crimsonStamp}`,
              borderRadius: 2,
            }}
          >
            <div
              style={{
                fontFamily: theme.fonts.tech,
                fontSize: 11,
                color: theme.colors.crimsonStamp,
                fontWeight: 700,
                letterSpacing: "0.14em",
                marginBottom: 6,
              }}
            >
              [OFFICIAL SCIENTIFIC CONCLUSION // EXCERPT]:
            </div>

            {/* Revealed Text Underneath */}
            <div
              style={{
                fontWeight: 800,
                fontSize: 20,
                lineHeight: 1.35,
                color: theme.colors.charcoalInk,
                fontFamily: theme.fonts.typewriter,
                letterSpacing: "0.01em",
              }}
            >
              "UNIDENTIFIED AERIAL PHENOMENA — BEYOND KNOWN CAPABILITIES."
            </div>

            {/* Sliding Real Ink Redaction Bars */}
            <div
              style={{
                position: "absolute",
                top: 36,
                left: 14,
                right: 14,
                bottom: 14,
                pointerEvents: "none",
                display: redactionWidth <= 0 ? "none" : "block",
              }}
            >
              <div
                style={{
                  width: `${redactionWidth}%`,
                  height: "100%",
                  backgroundColor: theme.colors.redactedBar,
                  opacity: redactionOpacity,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.6)",
                }}
              />
            </div>
          </div>

          <div
            style={{
              fontFamily: theme.fonts.typewriter,
              fontSize: 12,
              color: "#5C5446",
              lineHeight: 1.5,
            }}
          >
            CONCLUSION: Atmospheric inversion and radar distortion ruled out by
            Civil Aeronautics Administration and Air Force Technical Intelligence.
          </div>
        </div>

        {/* Heavy Crimson "DECLASSIFIED" Stamp */}
        {frame >= stampFrame && (
          <div
            style={{
              position: "absolute",
              top: 470,
              left: 40,
              right: 40,
              transform: `
                scale(${interpolate(stampSpring, [0, 1], [2.2, 1])})
                rotate(-13deg)
              `,
              opacity: interpolate(stampSpring, [0, 1], [0.85, 0.96]),
              border: `6px solid ${theme.colors.crimsonStamp}`,
              padding: "14px 20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(185, 28, 28, 0.08)",
              boxShadow: `
                0 0 25px ${theme.colors.crimsonGlow},
                inset 0 0 15px rgba(185, 28, 28, 0.2)
              `,
              zIndex: 50,
            }}
          >
            <div
              style={{
                fontFamily: theme.fonts.editorial,
                fontSize: 62,
                fontWeight: 900,
                color: theme.colors.crimsonStamp,
                letterSpacing: "0.14em",
                lineHeight: 0.9,
                textTransform: "uppercase",
              }}
            >
              DECLASSIFIED
            </div>
            <div
              style={{
                fontFamily: theme.fonts.tech,
                fontSize: 12,
                color: theme.colors.crimsonStamp,
                letterSpacing: "0.22em",
                marginTop: 6,
                fontWeight: 700,
              }}
            >
              AUTH: EXECUTIVE ORDER 13526 // SEC. 3.3
            </div>
          </div>
        )}

        {/* Particle ink/dust splatter on stamp impact */}
        {dustBurst > 0 && dustBurst < 1 && (
          <div
            style={{
              position: "absolute",
              top: 530,
              left: "50%",
              pointerEvents: "none",
              zIndex: 60,
            }}
          >
            {particles.map((p, idx) => {
              const x = Math.cos(p.angle) * p.distance * dustBurst;
              const y = Math.sin(p.angle) * p.distance * dustBurst;
              const pOpacity = (1 - dustBurst) * 0.75;
              return (
                <div
                  key={idx}
                  style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width: p.size,
                    height: p.size,
                    borderRadius: "50%",
                    backgroundColor: theme.colors.crimsonStamp,
                    opacity: pOpacity,
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
