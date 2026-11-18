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

export const Cut6EvidenceStack: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Staggered fan-out spring for 3 cards
  const fanSpring = spring({
    frame,
    fps,
    config: theme.spring.cardSnap,
  });

  const leftX = interpolate(fanSpring, [0, 1], [0, -110]);
  const leftRotate = interpolate(fanSpring, [0, 1], [0, -6]);

  const rightX = interpolate(fanSpring, [0, 1], [0, 110]);
  const rightRotate = interpolate(fanSpring, [0, 1], [0, 6]);

  const centerScale = interpolate(fanSpring, [0, 1], [0.92, 1.04]);

  return (
    <StudioLayout
      badge="• DECLASSIFIED DOSSIER // CROSS-REFERENCE"
      headline="Everything documented."
      subtitle="Thousands of military witness reports and radar logs."
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Left Card: Roswell 1947 */}
        <div
          style={{
            position: "absolute",
            width: 480,
            height: 680,
            borderRadius: 20,
            overflow: "hidden",
            backgroundColor: "#FFFFFF",
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.12)",
            transform: `translateX(${leftX}px) rotate(${leftRotate}deg)`,
            zIndex: 10,
          }}
        >
          <div
            style={{
              padding: "10px 16px",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              backgroundColor: "#FCFBF8",
            }}
          >
            <span
              style={{
                fontFamily: theme.fonts.mono,
                fontSize: 13,
                fontWeight: 600,
                color: "#78716C",
              }}
            >
              EXHIBIT A // 1947
            </span>
          </div>
          <div style={{ width: "100%", height: "calc(100% - 41px)", overflow: "hidden" }}>
            <Img
              src={staticFile("Assets/2nd proof.jpg")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 68%",
                transform: "scale(1.3)",
              }}
            />
          </div>
        </div>

        {/* Right Card: Capitol 1952 */}
        <div
          style={{
            position: "absolute",
            width: 480,
            height: 680,
            borderRadius: 20,
            overflow: "hidden",
            backgroundColor: "#FFFFFF",
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.12)",
            transform: `translateX(${rightX}px) rotate(${rightRotate}deg)`,
            zIndex: 15,
          }}
        >
          <div
            style={{
              padding: "10px 16px",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              backgroundColor: "#FCFBF8",
            }}
          >
            <span
              style={{
                fontFamily: theme.fonts.mono,
                fontSize: 13,
                fontWeight: 600,
                color: "#78716C",
              }}
            >
              EXHIBIT B // 1952
            </span>
          </div>
          <div style={{ width: "100%", height: "calc(100% - 41px)", overflow: "hidden" }}>
            <Img
              src={staticFile("Assets/images.jpeg")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 45%",
              }}
            />
          </div>
        </div>

        {/* Center Hero Card: Blue Book Memo */}
        <div
          style={{
            position: "absolute",
            width: 520,
            height: 740,
            borderRadius: 22,
            overflow: "hidden",
            backgroundColor: "#FFFFFF",
            border: "1px solid rgba(0,0,0,0.12)",
            boxShadow: "0 35px 80px rgba(0,0,0,0.22), 0 10px 30px rgba(0,0,0,0.08)",
            transform: `scale(${centerScale})`,
            zIndex: 25,
          }}
        >
          <div
            style={{
              padding: "12px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(0,0,0,0.08)",
              backgroundColor: "#F9F8F5",
            }}
          >
            <span
              style={{
                fontFamily: theme.fonts.mono,
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: theme.colors.headlineDark,
              }}
            >
              PRIMARY MEMO // USAF ARCHIVE
            </span>
            <span
              style={{
                fontFamily: theme.fonts.mono,
                fontSize: 12,
                fontWeight: 700,
                color: theme.colors.crimsonRed,
                padding: "4px 8px",
                borderRadius: 4,
                backgroundColor: "rgba(185, 28, 28, 0.08)",
              }}
            >
              CLASSIFIED
            </span>
          </div>
          <div style={{ width: "100%", height: "calc(100% - 47px)", overflow: "hidden" }}>
            <Img
              src={staticFile("Assets/proof 3.jpeg")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 40%",
                filter: "contrast(1.08) brightness(0.98)",
              }}
            />
          </div>
        </div>
      </div>
    </StudioLayout>
  );
};
