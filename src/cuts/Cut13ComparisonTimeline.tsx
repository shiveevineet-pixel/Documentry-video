import React from "react";
import {
  interpolate,
  spring,
  staticFile,
  Img,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { StudioLayout } from "../components/StudioCard";
import { theme } from "../theme";

export const Cut13ComparisonTimeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const entrance = spring({
    frame,
    fps,
    config: theme.spring.cardSnap,
  });
  const translateY = interpolate(entrance, [0, 1], [30, 0]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  // Timeline line draw progress
  const lineProgress = interpolate(frame, [15, 60], [0, 100], {
    easing: theme.ease.outExpo,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <StudioLayout
      badge="• HISTORICAL CONTINUITY // 1952 vs 2017"
      headline="70 years apart."
      subtitle="Same flight characteristics from 1952 to modern Navy sensors."
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transform: `translateY(${translateY}px)`,
          opacity,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Top Comparison Card: 1952 Project Blue Book Memo */}
        <div
          style={{
            height: 420,
            width: "100%",
            borderRadius: 20,
            overflow: "hidden",
            backgroundColor: "#FFFFFF",
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
            display: "flex",
          }}
        >
          {/* Card Left Info */}
          <div
            style={{
              width: "48%",
              padding: "28px 24px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              backgroundColor: "#FAF9F5",
              borderRight: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: theme.fonts.mono,
                  fontSize: 14,
                  fontWeight: 700,
                  color: theme.colors.crimsonRed,
                }}
              >
                1952 // AIR FORCE
              </span>
              <h2
                style={{
                  fontFamily: theme.fonts.display,
                  fontSize: 26,
                  fontWeight: 800,
                  color: theme.colors.headlineDark,
                  margin: "8px 0 10px 0",
                }}
              >
                Project Blue Book
              </h2>
              <p
                style={{
                  fontFamily: theme.fonts.display,
                  fontSize: 17,
                  color: "#57534E",
                  lineHeight: 1.35,
                  margin: 0,
                }}
              >
                "Objects exhibit instant acceleration and zero aerodynamic drag."
              </p>
            </div>
            <span
              style={{
                fontFamily: theme.fonts.mono,
                fontSize: 12,
                color: "#78716C",
              }}
            >
              MEMO ARCHIVE #341
            </span>
          </div>

          {/* Card Right Image */}
          <div style={{ width: "52%", height: "100%", overflow: "hidden" }}>
            <Img
              src={staticFile("Assets/proof 3.jpeg")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 30%",
              }}
            />
          </div>
        </div>

        {/* Central Connecting Timeline Node */}
        <div
          style={{
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Connecting Vertical Bar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: 3,
              backgroundColor: theme.colors.headlineDark,
              opacity: (lineProgress / 100) * 0.3,
            }}
          />
          {/* Center Pill */}
          <div
            style={{
              padding: "6px 18px",
              borderRadius: 999,
              backgroundColor: "#141413",
              color: "#FFFFFF",
              fontFamily: theme.fonts.mono,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.1em",
              zIndex: 10,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            IDENTICAL ANOMALIES
          </div>
        </div>

        {/* Bottom Comparison Card: 2017 Pentagon GIMBAL */}
        <div
          style={{
            height: 420,
            width: "100%",
            borderRadius: 20,
            overflow: "hidden",
            backgroundColor: "#0D0F12",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
            display: "flex",
          }}
        >
          {/* Card Left Info */}
          <div
            style={{
              width: "48%",
              padding: "28px 24px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              backgroundColor: "rgba(20, 24, 32, 0.95)",
              borderRight: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: theme.fonts.mono,
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#34D399",
                }}
              >
                2017 // DOD RELEASE
              </span>
              <h2
                style={{
                  fontFamily: theme.fonts.display,
                  fontSize: 26,
                  fontWeight: 800,
                  color: "#FFFFFF",
                  margin: "8px 0 10px 0",
                }}
              >
                U.S. Navy GIMBAL
              </h2>
              <p
                style={{
                  fontFamily: theme.fonts.display,
                  fontSize: 17,
                  color: "#94A3B8",
                  lineHeight: 1.35,
                  margin: 0,
                }}
              >
                "Rotating against wind shear with zero visible propulsion or heat wake."
              </p>
            </div>
            <span
              style={{
                fontFamily: theme.fonts.mono,
                fontSize: 12,
                color: "#64748B",
              }}
            >
              ATFLIR VIDEO ARCHIVE
            </span>
          </div>

          {/* Card Right Image */}
          <div style={{ width: "52%", height: "100%", overflow: "hidden" }}>
            <Img
              src={staticFile("Assets/proof 4.webp")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 48%",
                filter: "contrast(1.2)",
              }}
            />
          </div>
        </div>
      </div>
    </StudioLayout>
  );
};
