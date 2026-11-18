import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../theme";

const HOTSPOTS = [
  {
    name: "ROSWELL // NEW MEXICO",
    year: "1947",
    coords: "33.3943° N, 104.5230° W",
    desc: "RECOVERED DEBRIS // RAAF RECORD",
  },
  {
    name: "WASHINGTON D.C. AIRSPACE",
    year: "1952",
    coords: "38.9072° N, 77.0369° W",
    desc: "AIRPORT RADAR & F-94 INTERCEPT",
  },
  {
    name: "PHOENIX LIGHTS // ARIZONA",
    year: "1997",
    coords: "33.4484° N, 112.0740° W",
    desc: "1-MILE WIDE V-SHAPED CRAFT",
  },
  {
    name: "USS NIMITZ // PACIFIC",
    year: "2004",
    coords: "31.7500° N, 117.8000° W",
    desc: "TIC-TAC // AN/SPY-1 SENSOR LOCK",
  },
];

export const Beat6Telemetry: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Three rapid cuts:
  // Cut A (0 - 180): Big Counter
  // Cut B (180 - 360): Bar Graph
  // Cut C (360 - 600): Coordinate Flash Cuts
  const isCutA = frame < 180;
  const isCutB = frame >= 180 && frame < 360;
  const isCutC = frame >= 360;

  // Counter 0 to 12,618 in 40 frames
  const countProgress = interpolate(frame, [0, 45], [0, 1], {
    easing: theme.ease.outExpo,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const currentCount = Math.floor(countProgress * 12618);

  // Bar progress for Cut B
  const barFrame = frame - 180;
  const barProgress = interpolate(barFrame, [0, 45], [0, 1], {
    easing: theme.ease.outExpo,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const currentUnexplained = Math.floor(barProgress * 701);
  const barWidthPercent = barProgress * 75;

  // Coordinate index for Cut C (every 60 frames = 1s)
  const cutCIndex = Math.min(3, Math.floor((frame - 360) / 60));
  const currentHotspot = HOTSPOTS[cutCIndex] ?? HOTSPOTS[0];
  const hotspotSpring = spring({
    frame: (frame - 360) % 60,
    fps,
    config: theme.spring.slam,
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#11100E",
        overflow: "hidden",
      }}
    >
      {/* Background warm archival grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, #1A1714 0%, #100D0B 75%, #080706 100%)",
        }}
      />

      {/* CUT A: Giant Counter (0 - 180) */}
      {isCutA && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 60px",
          }}
        >
          <div
            style={{
              backgroundColor: theme.colors.archivalPaper,
              border: "1px solid #DCD6CB",
              borderRadius: 6,
              padding: "48px 40px",
              boxShadow: "0 25px 60px rgba(0,0,0,0.8)",
              width: "100%",
              maxWidth: 820,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: theme.fonts.typewriter,
                fontSize: 14,
                color: theme.colors.charcoalMuted,
                letterSpacing: "0.18em",
                fontWeight: 700,
                marginBottom: 12,
              }}
            >
              PROJECT BLUE BOOK (1952–1969)
            </div>

            <div
              style={{
                fontFamily: theme.fonts.editorial,
                fontSize: 120,
                lineHeight: 0.9,
                color: theme.colors.charcoalInk,
                letterSpacing: "-0.01em",
              }}
            >
              {currentCount.toLocaleString()}
            </div>

            <div
              style={{
                fontFamily: theme.fonts.bodySans,
                fontSize: 22,
                fontWeight: 800,
                color: theme.colors.charcoalInk,
                letterSpacing: "0.08em",
                marginTop: 18,
                textTransform: "uppercase",
              }}
            >
              INVESTIGATED CASES
            </div>

            <div
              style={{
                marginTop: 16,
                fontFamily: theme.fonts.typewriter,
                fontSize: 12,
                color: theme.colors.charcoalLight,
              }}
            >
              U.S. AIR FORCE OFFICIAL AUDIT REPORT
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* CUT B: Unexplained Bar Graph (180 - 360) */}
      {isCutB && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 60px",
          }}
        >
          <div
            style={{
              backgroundColor: theme.colors.archivalPaper,
              border: `2px solid ${theme.colors.crimsonStamp}`,
              borderRadius: 6,
              padding: "48px 40px",
              boxShadow: `0 25px 60px rgba(0,0,0,0.85), 0 0 30px ${theme.colors.crimsonGlow}`,
              width: "100%",
              maxWidth: 820,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: theme.fonts.typewriter,
                    fontSize: 13,
                    color: theme.colors.crimsonStamp,
                    fontWeight: 800,
                    letterSpacing: "0.15em",
                  }}
                >
                  SCIENTIFIC ANOMALY RESIDUAL
                </div>
                <div
                  style={{
                    fontFamily: theme.fonts.editorial,
                    fontSize: 38,
                    color: theme.colors.charcoalInk,
                    marginTop: 4,
                  }}
                >
                  OFFICIALLY UNEXPLAINED
                </div>
              </div>

              <div
                style={{
                  fontFamily: theme.fonts.editorial,
                  fontSize: 84,
                  lineHeight: 0.9,
                  color: theme.colors.crimsonStamp,
                }}
              >
                {currentUnexplained}
              </div>
            </div>

            {/* High-Contrast Comparative Bar */}
            <div
              style={{
                marginTop: 24,
                width: "100%",
                height: 36,
                backgroundColor: "#DCD6CB",
                borderRadius: 4,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: `${barWidthPercent}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, #8B1414 0%, ${theme.colors.crimsonStamp} 100%)`,
                }}
              />
            </div>

            <div
              style={{
                marginTop: 16,
                display: "flex",
                justifyContent: "space-between",
                fontFamily: theme.fonts.typewriter,
                fontSize: 12,
                color: theme.colors.charcoalMuted,
              }}
            >
              <span>NO METEOROLOGICAL EXPLANATION</span>
              <span style={{ color: theme.colors.crimsonStamp, fontWeight: 700 }}>
                RADAR & MULTI-PILOT CORROBORATION
              </span>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* CUT C: Rapid Coordinate Flash Cuts (360 - 600, 1s each) */}
      {isCutC && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 60px",
          }}
        >
          <div
            style={{
              backgroundColor: theme.colors.archivalPaper,
              border: "1px solid #DCD6CB",
              borderRadius: 6,
              padding: "44px 36px",
              boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
              width: "100%",
              maxWidth: 820,
              transform: `scale(${interpolate(hotspotSpring, [0, 1], [0.92, 1])})`,
              opacity: hotspotSpring,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "2px solid #2B2620",
                paddingBottom: 10,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  backgroundColor: theme.colors.charcoalInk,
                  color: "#FFF",
                  fontFamily: theme.fonts.typewriter,
                  fontSize: 16,
                  fontWeight: 800,
                  padding: "4px 14px",
                  borderRadius: 3,
                }}
              >
                {currentHotspot.year}
              </div>
              <div
                style={{
                  fontFamily: theme.fonts.typewriter,
                  fontSize: 12,
                  color: theme.colors.crimsonStamp,
                  fontWeight: 800,
                }}
              >
                SECTOR FLASH // HOTSPOT {cutCIndex + 1} OF 4
              </div>
            </div>

            <div
              style={{
                fontFamily: theme.fonts.editorial,
                fontSize: 48,
                lineHeight: 1.05,
                color: theme.colors.charcoalInk,
                textTransform: "uppercase",
              }}
            >
              {currentHotspot.name}
            </div>

            <div
              style={{
                fontFamily: theme.fonts.typewriter,
                fontSize: 18,
                color: theme.colors.tungstenAmber,
                fontWeight: 700,
                marginTop: 8,
              }}
            >
              {currentHotspot.coords}
            </div>

            <div
              style={{
                marginTop: 18,
                fontFamily: theme.fonts.bodySans,
                fontSize: 14,
                color: theme.colors.charcoalMuted,
                fontWeight: 600,
                borderTop: "1px dashed #DCD6CB",
                paddingTop: 12,
              }}
            >
              {currentHotspot.desc}
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
