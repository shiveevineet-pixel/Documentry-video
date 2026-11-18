import React from "react";
import {
  interpolate,
  spring,
  staticFile,
  Img,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { StudioLayout, FloatingCard } from "../components/StudioCard";
import { theme } from "../theme";

export const Cut14RapidRecap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 4 slices of 120 frames each:
  // 0-120: Roswell
  // 120-240: Capitol
  // 240-360: Blue Book
  // 360-480: Gimbal
  const currentSlice = Math.min(3, Math.floor(frame / 120));
  const sliceFrame = frame % 120;

  // Snappy punch spring for each cut
  const punch = spring({
    frame: sliceFrame,
    fps,
    config: theme.spring.cardSnap,
  });
  const translateY = interpolate(punch, [0, 1], [30, 0]);
  const scale = interpolate(punch, [0, 1], [0.95, 1]);

  const items = [
    {
      badge: "• 1947 // CRASH RETRIEVAL",
      headline: "ROSWELL.",
      subtitle: "The headline the military couldn't erase.",
      src: "Assets/2nd proof.jpg",
      position: "center 68%",
      imgScale: 1.32,
      darkMode: false,
    },
    {
      badge: "• 1952 // D.C. AIRSPACE LOCK",
      headline: "CAPITOL.",
      subtitle: "Radar confirmed objects over the White House.",
      src: "Assets/images.jpeg",
      position: "center 45%",
      imgScale: 1.25,
      darkMode: false,
    },
    {
      badge: "• 1969 // 12,618 CASES INVESTIGATED",
      headline: "BLUE BOOK.",
      subtitle: "701 official cases left unexplained forever.",
      src: "Assets/proof 3.jpeg",
      position: "center 40%",
      imgScale: 1.15,
      darkMode: false,
    },
    {
      badge: "• 2017 // NAVY FLIR SENSOR CONFIRMATION",
      headline: "GIMBAL.",
      subtitle: "Modern military optics confirm the exact same physics.",
      src: "Assets/proof 4.webp",
      position: "center 48%",
      imgScale: 1.35,
      darkMode: true,
    },
  ];

  const current = items[currentSlice];

  return (
    <StudioLayout
      darkMode={current.darkMode}
      badge={current.badge}
      headline={current.headline}
      subtitle={current.subtitle}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `translateY(${translateY}px) scale(${scale})`,
        }}
      >
        <FloatingCard darkMode={current.darkMode}>
          {/* Card Top Meta */}
          <div
            style={{
              height: 52,
              padding: "0 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: current.darkMode
                ? "1px solid rgba(255,255,255,0.1)"
                : "1px solid rgba(0,0,0,0.06)",
              backgroundColor: current.darkMode ? "#0A0D12" : "#FCFBF8",
            }}
          >
            <span
              style={{
                fontFamily: theme.fonts.mono,
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: current.darkMode ? "#34D399" : theme.colors.crimsonRed,
              }}
            >
              ARCHIVE RECORD {currentSlice + 1} OF 4
            </span>
            <span
              style={{
                fontFamily: theme.fonts.mono,
                fontSize: 14,
                color: current.darkMode ? "#94A3B8" : "#A8A29E",
              }}
            >
              VERIFIED HISTORICAL ASSET
            </span>
          </div>

          {/* Full Card Image Viewport */}
          <div
            style={{
              width: "100%",
              height: "calc(100% - 52px)",
              overflow: "hidden",
              position: "relative",
              backgroundColor: current.darkMode ? "#050608" : "#ECE8DD",
            }}
          >
            <Img
              src={staticFile(current.src)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: current.position,
                transform: `scale(${current.imgScale})`,
                filter: current.darkMode
                  ? "contrast(1.3) brightness(1.1)"
                  : "contrast(1.1) brightness(0.98)",
              }}
            />
          </div>
        </FloatingCard>
      </div>
    </StudioLayout>
  );
};
