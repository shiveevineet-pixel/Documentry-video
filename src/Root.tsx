import React from "react";
import { Composition } from "remotion";
import { MimicShort } from "./MimicShort";
import { MainComposition } from "./MainComposition";

export const Root: React.FC = () => {
  return (
    <>
      {/* 55-second 1080x1920 60fps vertical 3D horror short "THE 3:00 AM MIMIC" (3300 frames) */}
      <Composition
        id="MimicShort"
        component={MimicShort}
        durationInFrames={3300}
        fps={60}
        width={1080}
        height={1920}
        defaultProps={{
          showSafeZoneOverlay: false,
        }}
      />

      {/* Studio Inspection Composition (with Instagram Reels Safe-Zone Overlay) */}
      <Composition
        id="MimicShort-ReelsSafeZone"
        component={MimicShort}
        durationInFrames={3300}
        fps={60}
        width={1080}
        height={1920}
        defaultProps={{
          showSafeZoneOverlay: true,
        }}
      />

      {/* Existing compositions */}
      <Composition
        id="ProjectBlueBook"
        component={MainComposition}
        durationInFrames={3600}
        fps={60}
        width={1080}
        height={1920}
        defaultProps={{
          showSafeZoneOverlay: false,
        }}
      />
    </>
  );
};
