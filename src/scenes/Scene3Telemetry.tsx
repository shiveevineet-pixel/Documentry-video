import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../theme";

interface SightingLocation {
  id: string;
  name: string;
  coords: string;
  year: string;
  elevation: string;
  delay: number;
}

const SIGHTING_DATA: SightingLocation[] = [
  {
    id: "roswell",
    name: "ROSWELL, NEW MEXICO",
    coords: "33.3943° N, 104.5230° W",
    year: "1947",
    elevation: "3,570 FT",
    delay: 130,
  },
  {
    id: "dc",
    name: "WASHINGTON D.C. AIRSPACE",
    coords: "38.9072° N, 77.0369° W",
    year: "1952",
    elevation: "AIRPORT RADAR",
    delay: 180,
  },
  {
    id: "phoenix",
    name: "PHOENIX, ARIZONA",
    coords: "33.4484° N, 112.0740° W",
    year: "1997",
    elevation: "MULTI-WITNESS",
    delay: 230,
  },
  {
    id: "nimitz",
    name: "USS NIMITZ // PACIFIC",
    coords: "31.7500° N, 117.8000° W",
    year: "2004",
    elevation: "AN/SPY-1 RADAR",
    delay: 280,
  },
];

export const Scene3Telemetry: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Handheld camera breathing drift
  const driftX = Math.sin(frame * 0.03) * 3;
  const driftY = Math.cos(frame * 0.025) * 3;
  const driftRotate = Math.sin(frame * 0.02) * 0.15;

  // Staggered springs for editorial cards
  const headerSpring = spring({ frame: frame - 10, fps, config: theme.spring.snappy });
  const card1Spring = spring({ frame: frame - 25, fps, config: theme.spring.smooth });
  const card2Spring = spring({ frame: frame - 60, fps, config: theme.spring.smooth });
  const card3Spring = spring({ frame: frame - 95, fps, config: theme.spring.smooth });

  // Counter: 0 to 12,618
  const countProgress = interpolate(frame, [25, 105], [0, 1], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const currentCount = Math.floor(countProgress * 12618);

  // Unexplained: 0 to 701
  const barProgress = interpolate(frame, [65, 140], [0, 1], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const currentUnexplained = Math.floor(barProgress * 701);
  const barWidthPercent = barProgress * 68;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#11100F",
        transform: `
          translate(${driftX}px, ${driftY}px) 
          rotate(${driftRotate}deg)
        `,
      }}
    >
      {/* Warm archival background plate */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 45%, #1C1916 0%, #100E0C 80%, #080706 100%)",
        }}
      />

      {/* Main Container - Shifted left to clear right 140px Instagram button stack */}
      <div
        style={{
          position: "absolute",
          top: theme.safeZone.top + 10,
          left: theme.safeZone.left,
          right: theme.safeZone.right + 25,
          bottom: theme.safeZone.bottom + 10,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Vox-Style Editorial Header */}
        <div
          style={{
            opacity: headerSpring,
            transform: `translateY(${interpolate(headerSpring, [0, 1], [20, 0])}px)`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderBottom: "2px solid #2B2620",
            paddingBottom: 8,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: theme.fonts.typewriter,
                fontSize: 12,
                color: theme.colors.tungstenAmber,
                letterSpacing: "0.15em",
                fontWeight: 700,
              }}
            >
              PROJECT BLUE BOOK INVESTIGATION // 1952–1969
            </div>
            <div
              style={{
                fontFamily: theme.fonts.editorial,
                fontSize: 36,
                color: theme.colors.archivalPaper,
                letterSpacing: "-0.01em",
                lineHeight: 1.1,
                marginTop: 2,
              }}
            >
              DECLASSIFIED CASE TELEMETRY
            </div>
          </div>
          <div
            style={{
              fontFamily: theme.fonts.tech,
              fontSize: 11,
              color: "#333",
              background: theme.colors.archivalPaper,
              padding: "4px 10px",
              borderRadius: 3,
              fontWeight: 800,
              letterSpacing: "0.08em",
            }}
          >
            USAF AUDIT
          </div>
        </div>

        {/* TOP MODULE: Vox-style Big Number Counter Card */}
        <div
          style={{
            opacity: card1Spring,
            transform: `translateY(${interpolate(card1Spring, [0, 1], [25, 0])}px)`,
            backgroundColor: theme.colors.archivalPaper,
            borderRadius: 4,
            padding: "24px 28px",
            boxShadow: "0 15px 35px rgba(0,0,0,0.7), 0 2px 5px rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            border: "1px solid #DCD6CB",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: theme.fonts.bodySans,
                fontSize: 12,
                fontWeight: 700,
                color: theme.colors.charcoalMuted,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              TOTAL OFFICIAL SIGHTINGS INVESTIGATED
            </div>
            <div
              style={{
                fontFamily: theme.fonts.editorial,
                fontSize: 70,
                lineHeight: 1.0,
                color: theme.colors.charcoalInk,
                marginTop: 4,
                letterSpacing: "0.01em",
              }}
            >
              {currentCount.toLocaleString()}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 4,
              fontFamily: theme.fonts.typewriter,
              fontSize: 11,
              color: theme.colors.charcoalMuted,
            }}
          >
            <span>USAF REGULATION 200-2</span>
            <span style={{ color: theme.colors.tungstenAmber, fontWeight: 700 }}>
              17 CONSECUTIVE YEARS
            </span>
            <span style={{ color: theme.colors.charcoalInk, fontWeight: 700 }}>
              OFFICIALLY CATALOGUED
            </span>
          </div>
        </div>

        {/* MIDDLE MODULE: Unexplained Cases Comparative Bar */}
        <div
          style={{
            opacity: card2Spring,
            transform: `translateY(${interpolate(card2Spring, [0, 1], [25, 0])}px)`,
            backgroundColor: theme.colors.archivalPaper,
            borderRadius: 4,
            padding: "22px 28px",
            boxShadow: "0 15px 35px rgba(0,0,0,0.7)",
            border: `1px solid #DCD6CB`,
            borderLeft: `6px solid ${theme.colors.crimsonStamp}`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: theme.fonts.bodySans,
                  fontSize: 12,
                  fontWeight: 800,
                  color: theme.colors.crimsonStamp,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                OFFICIALLY CLASSIFIED AS "UNIDENTIFIED"
              </div>
              <div
                style={{
                  fontFamily: theme.fonts.typewriter,
                  fontSize: 11,
                  color: theme.colors.charcoalMuted,
                  marginTop: 3,
                }}
              >
                No astronomical, meteorological, or aircraft explanation
              </div>
            </div>
            <div
              style={{
                fontFamily: theme.fonts.editorial,
                fontSize: 52,
                color: theme.colors.crimsonStamp,
                lineHeight: 1,
              }}
            >
              {currentUnexplained} CASES
            </div>
          </div>

          {/* High Contrast Comparative Bar */}
          <div
            style={{
              marginTop: 14,
              width: "100%",
              height: 22,
              backgroundColor: "#DCD6CB",
              borderRadius: 3,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                width: `${barWidthPercent}%`,
                height: "100%",
                background: `linear-gradient(90deg, #8B1414 0%, ${theme.colors.crimsonStamp} 100%)`,
                boxShadow: `0 0 10px rgba(185, 28, 28, 0.4)`,
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: theme.fonts.typewriter,
              fontSize: 11,
              color: theme.colors.charcoalMuted,
              marginTop: 8,
            }}
          >
            <span>5.5% SCIENTIFIC RESIDUAL RATE</span>
            <span style={{ color: theme.colors.crimsonStamp, fontWeight: 700 }}>
              VERIFIED RADAR & SIGHTING OVERLAPS
            </span>
          </div>
        </div>

        {/* BOTTOM MODULE: Vox-Style Clean Coordinate Callouts Table */}
        <div
          style={{
            flex: 1,
            opacity: card3Spring,
            transform: `translateY(${interpolate(card3Spring, [0, 1], [25, 0])}px)`,
            backgroundColor: theme.colors.archivalPaper,
            borderRadius: 4,
            padding: "20px 24px",
            boxShadow: "0 15px 35px rgba(0,0,0,0.7)",
            border: "1px solid #DCD6CB",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #DCD6CB",
              paddingBottom: 8,
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontFamily: theme.fonts.bodySans,
                fontSize: 12,
                fontWeight: 800,
                color: theme.colors.charcoalInk,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              PRIMARY HISTORICAL HOTSPOTS (1947–2004)
            </span>
            <span
              style={{
                fontFamily: theme.fonts.typewriter,
                fontSize: 10,
                color: theme.colors.charcoalMuted,
              }}
            >
              GEOGRAPHIC TELEMETRY
            </span>
          </div>

          {/* Coordinate Rows */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              flex: 1,
              justifyContent: "space-around",
            }}
          >
            {SIGHTING_DATA.map((loc) => {
              const rowSpring = spring({
                frame: frame - loc.delay,
                fps,
                config: theme.spring.snappy,
              });

              if (frame < loc.delay) return null;

              return (
                <div
                  key={loc.id}
                  style={{
                    opacity: rowSpring,
                    transform: `translateX(${interpolate(rowSpring, [0, 1], [-20, 0])}px)`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 14px",
                    backgroundColor: "#FAF8F5",
                    border: "1px solid #E5E1D8",
                    borderRadius: 3,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        backgroundColor: theme.colors.charcoalInk,
                        color: theme.colors.archivalPaper,
                        fontFamily: theme.fonts.typewriter,
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: 2,
                      }}
                    >
                      {loc.year}
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: theme.fonts.bodySans,
                          fontSize: 13,
                          fontWeight: 700,
                          color: theme.colors.charcoalInk,
                        }}
                      >
                        {loc.name}
                      </div>
                      <div
                        style={{
                          fontFamily: theme.fonts.typewriter,
                          fontSize: 10,
                          color: theme.colors.charcoalLight,
                        }}
                      >
                        {loc.coords}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      fontFamily: theme.fonts.typewriter,
                      fontSize: 10,
                      color: theme.colors.crimsonStamp,
                      fontWeight: 700,
                      background: "rgba(185, 28, 28, 0.08)",
                      padding: "4px 8px",
                      borderRadius: 2,
                      border: "1px solid rgba(185, 28, 28, 0.25)",
                    }}
                  >
                    {loc.elevation}
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              borderTop: "1px solid #DCD6CB",
              paddingTop: 8,
              marginTop: 10,
              display: "flex",
              justifyContent: "space-between",
              fontFamily: theme.fonts.typewriter,
              fontSize: 10,
              color: theme.colors.charcoalMuted,
            }}
          >
            <span>SOURCE: NATIONAL ARCHIVES RECORD GROUP 341</span>
            <span style={{ color: theme.colors.charcoalInk, fontWeight: 700 }}>
              VERIFIED RADAR TRACKS
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
