import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../theme";
import { TypewriterText } from "../components/TypewriterText";

export const Scene1Radar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Continuous handheld camera drift
  const driftX = Math.sin(frame * 0.03) * 3;
  const driftY = Math.cos(frame * 0.025) * 3;
  const driftRotate = Math.sin(frame * 0.02) * 0.15;

  // 1940s CRT Oscilloscope center in 4:5 safe zone
  const scopeCenterX = 540;
  const scopeCenterY = 660;
  const scopeRadius = 260;

  // Sweep angle: smooth 360 deg every 60 frames (2 seconds)
  const sweepAngle = (frame * 6) % 360;

  // Blip position at angle 42 deg, distance 175px
  const blipAngle = 42;
  const blipDist = 175;
  const blipRad = (blipAngle * Math.PI) / 180;
  const blipX = scopeCenterX + blipDist * Math.cos(blipRad);
  const blipY = scopeCenterY + blipDist * Math.sin(blipRad);

  // Ping bloom timing
  const pingOffsets = [7, 67, 127, 187];
  const lastPing = pingOffsets.filter((f) => frame >= f).pop() ?? -100;
  const pingAge = frame - lastPing;
  const pingOpacity = Math.max(0, 1 - pingAge / 25);
  const pingWave = pingAge * 2.2;

  // Bold editorial hook entrance (Frames 15-45)
  const hookSpring = spring({
    frame: frame - 15,
    fps,
    config: theme.spring.heavyImpact,
  });
  const hookScale = interpolate(hookSpring, [0, 1], [0.88, 1]);
  const hookY = interpolate(hookSpring, [0, 1], [30, 0]);

  // Whip zoom at frame 210 -> 240 into blip
  const zoomProgress = interpolate(frame, [210, 240], [0, 1], {
    easing: theme.ease.in,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cameraScale = interpolate(zoomProgress, [0, 1], [1, 5.0]);
  const cameraTranslateX = interpolate(
    zoomProgress,
    [0, 1],
    [0, -(blipX - scopeCenterX) * 3.6]
  );
  const cameraTranslateY = interpolate(
    zoomProgress,
    [0, 1],
    [0, -(blipY - scopeCenterY) * 3.6]
  );
  const blurAmount = interpolate(zoomProgress, [0, 0.7, 1], [0, 2, 7]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0D0C0B",
        transform: `
          scale(${cameraScale}) 
          translate(${cameraTranslateX + driftX}px, ${cameraTranslateY + driftY}px) 
          rotate(${driftRotate}deg)
        `,
        filter: blurAmount > 0 ? `blur(${blurAmount}px)` : undefined,
      }}
    >
      {/* 1940s Vintage Oscilloscope Background Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(224, 159, 62, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(224, 159, 62, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          backgroundPosition: "center center",
        }}
      />

      {/* Top Archival Telemetry Header (Inside safe zone) */}
      <div
        style={{
          position: "absolute",
          top: theme.safeZone.top + 15,
          left: theme.safeZone.left,
          right: theme.safeZone.right + 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: theme.fonts.typewriter,
          fontSize: 13,
          color: theme.colors.tungstenAmber,
          letterSpacing: "0.14em",
          borderBottom: "1px solid rgba(224, 159, 62, 0.25)",
          paddingBottom: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              display: "inline-block",
              width: 7,
              height: 7,
              borderRadius: "50%",
              backgroundColor: theme.colors.tungstenAmber,
              boxShadow: `0 0 10px ${theme.colors.tungstenAmber}`,
            }}
          />
          <span>RADAR STATION // AN/CPS-1</span>
        </div>
        <div style={{ color: theme.colors.charcoalLight }}>FREQ: 1.25 GHz</div>
        <div style={{ color: theme.colors.crimsonStamp, fontWeight: 700 }}>
          DECLASSIFIED ARCHIVE
        </div>
      </div>

      {/* 1940s CRT Phosphor-Amber Oscilloscope Assembly */}
      <div
        style={{
          position: "absolute",
          left: scopeCenterX - scopeRadius,
          top: scopeCenterY - scopeRadius,
          width: scopeRadius * 2,
          height: scopeRadius * 2,
        }}
      >
        {/* Outer Heavy Bakelite / Brass Housing Bezel */}
        <div
          style={{
            position: "absolute",
            inset: -14,
            borderRadius: "50%",
            border: "4px solid #2B231A",
            boxShadow: `
              0 0 35px rgba(224, 159, 62, 0.15),
              inset 0 0 50px rgba(0, 0, 0, 0.95)
            `,
          }}
        />

        {/* Amber Phosphor CRT Screen Backing */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            backgroundColor: "#161109",
            boxShadow: "inset 0 0 60px rgba(224, 159, 62, 0.2)",
          }}
        />

        {/* Concentric Range Circles */}
        {[0.25, 0.5, 0.75, 1.0].map((ratio, idx) => {
          const r = scopeRadius * ratio;
          return (
            <div
              key={idx}
              style={{
                position: "absolute",
                left: scopeRadius - r,
                top: scopeRadius - r,
                width: r * 2,
                height: r * 2,
                borderRadius: "50%",
                border: "1px dashed rgba(224, 159, 62, 0.28)",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 3,
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontFamily: theme.fonts.typewriter,
                  fontSize: 10,
                  color: "rgba(224, 159, 62, 0.5)",
                }}
              >
                {ratio * 40} MILES
              </span>
            </div>
          );
        })}

        {/* Crosshair Graticule */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: scopeRadius,
            width: 1,
            backgroundColor: "rgba(224, 159, 62, 0.35)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: scopeRadius,
            height: 1,
            backgroundColor: "rgba(224, 159, 62, 0.35)",
          }}
        />

        {/* Rotating Amber Sweep Cone with Persistence */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            transform: `rotate(${sweepAngle}deg)`,
            transformOrigin: "center center",
            background:
              "conic-gradient(from 0deg, rgba(224, 159, 62, 0.5) 0deg, rgba(224, 159, 62, 0.12) 40deg, transparent 80deg)",
            pointerEvents: "none",
          }}
        >
          {/* Leading Sweep Line */}
          <div
            style={{
              position: "absolute",
              top: scopeRadius,
              left: scopeRadius,
              width: scopeRadius,
              height: 2,
              background:
                "linear-gradient(90deg, #FFFFFF 0%, #E09F3E 70%, transparent 100%)",
              boxShadow: "0 0 12px #E09F3E",
              transformOrigin: "0 0",
            }}
          />
        </div>

        {/* Radar Target Blip */}
        <div
          style={{
            position: "absolute",
            left: blipX - (scopeCenterX - scopeRadius) - 8,
            top: blipY - (scopeCenterY - scopeRadius) - 8,
            width: 16,
            height: 16,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: "#FFF7ED",
              boxShadow: "0 0 14px #E09F3E, 0 0 28px #E09F3E",
              margin: "3px auto",
            }}
          />

          {/* Sonar Ping Shockwave */}
          {pingOpacity > 0 && (
            <div
              style={{
                position: "absolute",
                left: -pingWave,
                top: -pingWave,
                width: 16 + pingWave * 2,
                height: 16 + pingWave * 2,
                borderRadius: "50%",
                border: "2px solid #E09F3E",
                opacity: pingOpacity,
                boxShadow: "0 0 14px rgba(224, 159, 62, 0.8)",
                pointerEvents: "none",
              }}
            />
          )}

          {/* Target Data Tag */}
          <div
            style={{
              position: "absolute",
              left: 20,
              top: -10,
              fontFamily: theme.fonts.typewriter,
              fontSize: 10,
              color: theme.colors.tungstenAmber,
              whiteSpace: "nowrap",
              background: "rgba(13, 12, 11, 0.85)",
              padding: "2px 6px",
              border: "1px solid rgba(224, 159, 62, 0.5)",
              borderRadius: 2,
            }}
          >
            TARGET-09 [1,200 MPH]
          </div>
        </div>
      </div>

      {/* Kinetic Hook & Editorial Typography (Safe Zone below scope) */}
      <div
        style={{
          position: "absolute",
          top: 1010,
          left: theme.safeZone.left,
          right: theme.safeZone.right,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 20,
        }}
      >
        {/* High-Retention Hook Title */}
        <div
          style={{
            opacity: hookSpring,
            transform: `scale(${hookScale}) translateY(${hookY}px)`,
            fontFamily: theme.fonts.editorial,
            fontSize: 48,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: theme.colors.archivalPaper,
            textTransform: "uppercase",
            textShadow: "0 4px 20px rgba(0,0,0,0.95)",
          }}
        >
          THE U.S. GOVERNMENT{" "}
          <span
            style={{
              color: theme.colors.tungstenAmber,
              textShadow: `0 0 25px ${theme.colors.tungstenAmber}`,
            }}
          >
            HID THESE FILES
          </span>{" "}
          FOR 70 YEARS.
        </div>

        {/* Classification Badge */}
        {frame >= 50 && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(185, 28, 28, 0.15)",
              border: `1px solid ${theme.colors.crimsonStamp}`,
              padding: "6px 18px",
              borderRadius: 3,
            }}
          >
            <span
              style={{
                fontFamily: theme.fonts.typewriter,
                fontSize: 12,
                color: theme.colors.crimsonStamp,
                letterSpacing: "0.18em",
                fontWeight: 700,
              }}
            >
              RESTRICTED DISCLOSURE // TOP SECRET
            </span>
          </div>
        )}

        {/* Typewriter Coordinates Telemetry */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginTop: 6,
            fontFamily: theme.fonts.typewriter,
            fontSize: 19,
            color: theme.colors.archivalPaper,
            letterSpacing: "0.06em",
          }}
        >
          <TypewriterText
            text="JUNE 24, 1947 // MOUNT RAINIER, WA"
            startFrame={75}
            framesPerChar={1.5}
            cursorColor={theme.colors.tungstenAmber}
          />
          <TypewriterText
            text="9 CRAFT. 1,200 MPH. NO PROPULSION."
            startFrame={135}
            framesPerChar={1.5}
            style={{ color: theme.colors.tungstenAmber, fontWeight: 700 }}
            cursorColor={theme.colors.tungstenAmber}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
