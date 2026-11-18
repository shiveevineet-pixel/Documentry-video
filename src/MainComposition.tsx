import React from "react";
import {
  AbsoluteFill,
  Sequence,
  staticFile,
  Audio,
} from "remotion";
import { Beat1Hook } from "./beats/Beat1Hook";
import { Beat2Roswell } from "./beats/Beat2Roswell";
import { Beat3CapitolRadar } from "./beats/Beat3CapitolRadar";
import { Beat4BlueBook } from "./beats/Beat4BlueBook";
import { Beat5DataAnomalies } from "./beats/Beat5DataAnomalies";
import { Beat6GimbalBlueprint } from "./beats/Beat6GimbalBlueprint";
import { Beat7ContinuityOutro } from "./beats/Beat7ContinuityOutro";
import { FilmGrain } from "./components/FilmGrain";
import { IgSafeZoneOverlay } from "./components/IgSafeZoneOverlay";
import { theme } from "./theme";

export interface MainCompositionProps {
  showSafeZoneOverlay?: boolean;
}

export const MainComposition: React.FC<MainCompositionProps> = ({
  showSafeZoneOverlay = false,
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.darkroomBg,
        overflow: "hidden",
      }}
    >
      {/* ============================================================ */}
      {/* 1. MASTER VOICE-OVER TRACK (User's Final Voiceover)           */}
      {/* ============================================================ */}
      <Audio
        src={staticFile("Assets/Final voiceover.mp3")}
        volume={1.0}
        startFrom={0}
      />

      {/* ============================================================ */}
      {/* 2. SUBTLE AMBIENT TENSION DRONE BED (0.13 volume)             */}
      {/* ============================================================ */}
      <Audio
        src={staticFile("audio/ambient_drone.wav")}
        volume={0.13}
        startFrom={0}
      />

      {/* ============================================================ */}
      {/* 3. SYNCED CINEMATIC SFX (Zero synth beeps; real Foley hits)   */}
      {/* ============================================================ */}
      {/* Frame 0: Initial Dossier Impact */}
      <Sequence from={0} durationInFrames={60} name="SFX: Intro Impact">
        <Audio src={staticFile("audio/cinematic/impact-cine.mp3")} volume={0.65} />
      </Sequence>

      {/* Frame 140: Beat 1 Finally Opened Slam */}
      <Sequence from={140} durationInFrames={45} name="SFX: Finally Opened Slam">
        <Audio src={staticFile("audio/cinematic/heavy_stamp.wav")} volume={0.7} />
      </Sequence>

      {/* Frame 210: Beat 2 Roswell Whoosh */}
      <Sequence from={210} durationInFrames={40} name="SFX: Beat 2 Whoosh">
        <Audio src={staticFile("audio/cinematic/whoosh-fast.mp3")} volume={0.5} />
      </Sequence>

      {/* Frame 580: Beat 2 RETRACTED Stamp Slam */}
      <Sequence from={580} durationInFrames={45} name="SFX: Retracted Stamp">
        <Audio src={staticFile("audio/cinematic/heavy_stamp.wav")} volume={0.75} />
      </Sequence>

      {/* Frame 780: Beat 3 Capitol Transition */}
      <Sequence from={780} durationInFrames={40} name="SFX: Capitol Whoosh">
        <Audio src={staticFile("audio/cinematic/whoosh-big.mp3")} volume={0.55} />
      </Sequence>

      {/* Frame 990: Beat 3 Radar Scope Snap */}
      <Sequence from={990} durationInFrames={30} name="SFX: Radar Snap">
        <Audio src={staticFile("audio/cinematic/transition-snap.mp3")} volume={0.5} />
      </Sequence>

      {/* Frame 1140: Beat 3 Hypersonic Outrun Streak */}
      <Sequence from={1140} durationInFrames={35} name="SFX: Hypersonic Outrun">
        <Audio src={staticFile("audio/cinematic/swoosh-quick.mp3")} volume={0.6} />
      </Sequence>

      {/* Frame 1290: Beat 4 Blue Book Memo Entrance */}
      <Sequence from={1290} durationInFrames={40} name="SFX: Blue Book Whoosh">
        <Audio src={staticFile("audio/cinematic/whoosh-fast.mp3")} volume={0.5} />
      </Sequence>

      {/* Frame 1620: Beat 4 DECLASSIFIED Stamp Slam */}
      <Sequence from={1620} durationInFrames={45} name="SFX: Declassified Stamp">
        <Audio src={staticFile("audio/cinematic/heavy_stamp.wav")} volume={0.75} />
      </Sequence>

      {/* Frame 1770: Beat 5 Data Rollup Entrance */}
      <Sequence from={1770} durationInFrames={35} name="SFX: Data Snap">
        <Audio src={staticFile("audio/cinematic/transition-snap.mp3")} volume={0.5} />
      </Sequence>

      {/* Frame 2070: Beat 5 701 UNEXPLAINED Slam */}
      <Sequence from={2070} durationInFrames={60} name="SFX: 701 Anomaly Impact">
        <Audio src={staticFile("audio/cinematic/impact-cine.mp3")} volume={0.7} />
      </Sequence>

      {/* Frame 2280: Beat 6 FLIR Gimbal Entrance */}
      <Sequence from={2280} durationInFrames={40} name="SFX: FLIR Whoosh">
        <Audio src={staticFile("audio/cinematic/whoosh-big.mp3")} volume={0.55} />
      </Sequence>

      {/* Frame 2490: Beat 6 Blueprint Mode Snap */}
      <Sequence from={2490} durationInFrames={30} name="SFX: Blueprint Snap">
        <Audio src={staticFile("audio/cinematic/transition-snap.mp3")} volume={0.5} />
      </Sequence>

      {/* Frame 2610: Beat 6 NO WINGS Callout */}
      <Sequence from={2610} durationInFrames={25} name="SFX: No Wings Tick">
        <Audio src={staticFile("audio/cinematic/click-camera.mp3")} volume={0.6} />
      </Sequence>

      {/* Frame 2730: Beat 6 NO EXHAUST Callout */}
      <Sequence from={2730} durationInFrames={25} name="SFX: No Exhaust Tick">
        <Audio src={staticFile("audio/cinematic/click-camera.mp3")} volume={0.6} />
      </Sequence>

      {/* Frame 2850: Beat 6 ROTATING IN MID-AIR Arc */}
      <Sequence from={2850} durationInFrames={35} name="SFX: Rotating Swoosh">
        <Audio src={staticFile("audio/cinematic/swoosh-quick.mp3")} volume={0.65} />
      </Sequence>

      {/* Frame 2970: Beat 7 Split Continuity Entrance */}
      <Sequence from={2970} durationInFrames={40} name="SFX: Split Whoosh">
        <Audio src={staticFile("audio/cinematic/whoosh-big.mp3")} volume={0.55} />
      </Sequence>

      {/* Frame 3120: Beat 7 Flash 1 - Roswell */}
      <Sequence from={3120} durationInFrames={25} name="SFX: Flash Roswell">
        <Audio src={staticFile("audio/cinematic/transition-snap.mp3")} volume={0.45} />
      </Sequence>

      {/* Frame 3175: Beat 7 Flash 2 - Capitol */}
      <Sequence from={3175} durationInFrames={25} name="SFX: Flash Capitol">
        <Audio src={staticFile("audio/cinematic/transition-snap.mp3")} volume={0.45} />
      </Sequence>

      {/* Frame 3230: Beat 7 Flash 3 - Blue Book */}
      <Sequence from={3230} durationInFrames={25} name="SFX: Flash Blue Book">
        <Audio src={staticFile("audio/cinematic/transition-snap.mp3")} volume={0.45} />
      </Sequence>

      {/* Frame 3280: Beat 7 Flash 4 - Gimbal */}
      <Sequence from={3280} durationInFrames={25} name="SFX: Flash Gimbal">
        <Audio src={staticFile("audio/cinematic/transition-snap.mp3")} volume={0.45} />
      </Sequence>

      {/* Frame 3330: Beat 7 THE FILES ARE OPEN Slam */}
      <Sequence from={3330} durationInFrames={60} name="SFX: Files Open Slam">
        <Audio src={staticFile("audio/cinematic/impact-cine.mp3")} volume={0.7} />
      </Sequence>

      {/* Frame 3440: Beat 7 ANSWERS REMAIN CLASSIFIED Final Stamp Slam */}
      <Sequence from={3440} durationInFrames={60} name="SFX: Final Stamp Slam">
        <Audio src={staticFile("audio/cinematic/heavy_stamp.wav")} volume={0.8} />
      </Sequence>

      {/* ============================================================ */}
      {/* 4. VISUAL STORYBOARD BEATS (Strictly 3600 Frames // 60.00s)   */}
      {/* ============================================================ */}

      {/* Beat 1: Hook Slam & 70 Years Intro (0 - 210 | 3.5s) */}
      <Sequence from={0} durationInFrames={210} name="Beat 01: Hook Slam">
        <Beat1Hook />
      </Sequence>

      {/* Beat 2: 1947 Roswell Newspaper & Retraction (210 - 780 | 9.5s) */}
      <Sequence from={210} durationInFrames={570} name="Beat 02: Roswell">
        <Beat2Roswell />
      </Sequence>

      {/* Beat 3: 1952 Capitol UFO & Cold War Radar Scope (780 - 1290 | 8.5s) */}
      <Sequence from={780} durationInFrames={510} name="Beat 03: Capitol & Radar">
        <Beat3CapitolRadar />
      </Sequence>

      {/* Beat 4: Project Blue Book Memo & Declassified Stamp (1290 - 1770 | 8.0s) */}
      <Sequence from={1290} durationInFrames={480} name="Beat 04: Blue Book Memo">
        <Beat4BlueBook />
      </Sequence>

      {/* Beat 5: 12,618 Sightings & 701 Unexplained (1770 - 2280 | 8.5s) */}
      <Sequence from={1770} durationInFrames={510} name="Beat 05: Data & 701 Anomalies">
        <Beat5DataAnomalies />
      </Sequence>

      {/* Beat 6: 2017 Navy GIMBAL & UAP Blueprint (2280 - 2970 | 11.5s) */}
      <Sequence from={2280} durationInFrames={690} name="Beat 06: GIMBAL & Blueprint">
        <Beat6GimbalBlueprint />
      </Sequence>

      {/* Beat 7: Split Comparison, 4-Flash & Outro Verdict (2970 - 3600 | 10.5s) */}
      <Sequence from={2970} durationInFrames={630} name="Beat 07: Continuity & Outro">
        <Beat7ContinuityOutro />
      </Sequence>

      {/* ============================================================ */}
      {/* 5. OVERLAYS (Film Grain & Safe Zones)                        */}
      {/* ============================================================ */}
      <FilmGrain opacity={0.035} />
      <IgSafeZoneOverlay visible={showSafeZoneOverlay} />
    </AbsoluteFill>
  );
};
