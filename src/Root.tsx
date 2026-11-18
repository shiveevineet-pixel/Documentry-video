import React from "react";
import { Composition } from "remotion";
import { MainComposition } from "./MainComposition";

export const Root: React.FC = () => {
  return (
    <>
      {/* Primary 60fps Composition (60 seconds = 3600 frames) */}
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

      {/* Studio Inspection Composition (with Instagram Reels Safe-Zone Overlay) */}
      <Composition
        id="ProjectBlueBook-ReelsSafeZone"
        component={MainComposition}
        durationInFrames={3600}
        fps={60}
        width={1080}
        height={1920}
        defaultProps={{
          showSafeZoneOverlay: true,
        }}
      />
    </>
  );
};
