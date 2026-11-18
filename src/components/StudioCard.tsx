import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";

interface StudioLayoutProps {
  badge: string;
  headline: string;
  subtitle?: string;
  darkMode?: boolean; // kept for compatibility, all scenes now use the darkroom aesthetic
  children: React.ReactNode;
  headerOpacity?: number;
  headerTranslateY?: number;
  bgOpacity?: number;
}

export const StudioLayout: React.FC<StudioLayoutProps> = ({
  badge,
  headline,
  subtitle,
  children,
  headerOpacity = 1,
  headerTranslateY = 0,
  bgOpacity = 1,
}) => {
  const frame = useCurrentFrame();

  // Subtle natural camera drift mimicking a handheld darkroom film camera
  const driftX = Math.sin(frame * 0.025) * 3;
  const driftY = Math.cos(frame * 0.02) * 2.5;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.darkroomBg,
        opacity: bgOpacity,
        overflow: "hidden",
      }}
    >
      {/* 1. Warm Tungsten Spotlight over Obsidian Vault Floor */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 75% 65% at 50% 42%, rgba(245, 158, 11, 0.065) 0%, rgba(20, 24, 32, 0.45) 50%, rgba(9, 10, 13, 0.98) 85%)",
          pointerEvents: "none",
        }}
      />

      {/* 2. Natural Camera Drift Container */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${driftX}px, ${driftY}px)`,
        }}
      >
        {/* Editorial Header System (Strictly below y: 220px Reels Safe-Zone) */}
        <div
          style={{
            position: "absolute",
            top: 240,
            left: 65,
            right: 145, // clear right 140px Reels UI
            opacity: headerOpacity,
            transform: `translateY(${headerTranslateY}px)`,
            zIndex: 50,
          }}
        >
          {/* Pill Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "7px 18px",
              borderRadius: 999,
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              marginBottom: 14,
              backdropFilter: "blur(12px)",
            }}
          >
            <span
              style={{
                fontFamily: theme.fonts.mono,
                fontSize: 17,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: theme.colors.textPrimary,
              }}
            >
              {badge}
            </span>
          </div>

          {/* Display Headline */}
          <h1
            style={{
              fontFamily: theme.fonts.display,
              fontSize: 66,
              fontWeight: 800,
              letterSpacing: "-0.035em",
              lineHeight: 1.05,
              color: theme.colors.textPrimary,
              margin: "0 0 10px 0",
              textShadow: "0 4px 18px rgba(0, 0, 0, 0.8)",
            }}
          >
            {headline}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p
              style={{
                fontFamily: theme.fonts.display,
                fontSize: 25,
                fontWeight: 450,
                letterSpacing: "-0.01em",
                lineHeight: 1.35,
                color: theme.colors.textSecondary,
                margin: 0,
                maxWidth: 780,
                textShadow: "0 2px 8px rgba(0, 0, 0, 0.6)",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Center Floating Evidence Card Slot (Inside safe area: x: 65-935, y: 480-1510) */}
        <div
          style={{
            position: "absolute",
            top: 480,
            left: 65,
            width: 820,
            height: 980,
            zIndex: 30,
          }}
        >
          {children}
        </div>
      </div>
    </AbsoluteFill>
  );
};

interface FloatingCardProps {
  children: React.ReactNode;
  darkMode?: boolean;
  style?: React.CSSProperties;
}

export const FloatingCard: React.FC<FloatingCardProps> = ({
  children,
  style,
}) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 22,
        overflow: "hidden",
        backgroundColor: theme.colors.cardDarkSurface,
        border: `1px solid ${theme.colors.cardBorder}`,
        boxShadow: theme.colors.cardShadow,
        position: "relative",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
