import React from "react";
import {
  Sequence,
  OffthreadVideo,
  staticFile,
  AbsoluteFill,
  Audio,
} from "remotion";
import { CameraShake } from "./components/CameraShake";
import { Captions } from "./components/Captions";
import { ChoiceOverlay } from "./components/ChoiceOverlay";
import { IncomingCallBadge } from "./components/IncomingCallBadge";

export interface MimicShortProps {
  showSafeZoneOverlay?: boolean;
}

export const MimicShort: React.FC<MimicShortProps> = ({
  showSafeZoneOverlay = false,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* 1. CAMERA SHAKE & VIDEO SHOTS LAYER */}
      <CameraShake>
        {/* Shot 1: 0:00–0:07 (Frames 0–420) - Hook & Radio Warning */}
        <Sequence from={0} durationInFrames={420} name="Shot 01 - Hook & Radio">
          <OffthreadVideo
            src={staticFile("renders/shot_01.mp4")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Sequence>

        {/* Shot 2: 0:07–0:13 (Frames 420–780) - The Knock & Phone Call */}
        <Sequence from={420} durationInFrames={360} name="Shot 02 - Knock & Call">
          <OffthreadVideo
            src={staticFile("renders/shot_02.mp4")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Sequence>

        {/* Shot 3: 0:13–0:18 (Frames 780–1080) - Choice 1 (A vs B) */}
        <Sequence from={780} durationInFrames={300} name="Shot 03 - Choice 1">
          <OffthreadVideo
            src={staticFile("renders/shot_03.mp4")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Sequence>

        {/* Shot 4: 0:18–0:26 (Frames 1080–1560) - Reveal & Glass Breach */}
        <Sequence from={1080} durationInFrames={480} name="Shot 04 - Reveal & Breach">
          <OffthreadVideo
            src={staticFile("renders/shot_04.mp4")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Sequence>

        {/* Shot 5: 0:26–0:33 (Frames 1560–1980) - Hallway Sprint */}
        <Sequence from={1560} durationInFrames={420} name="Shot 05 - Hallway Sprint">
          <OffthreadVideo
            src={staticFile("renders/shot_05.mp4")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Sequence>

        {/* Shot 6: 0:33–0:41 (Frames 1980–2460) - Choice 2 (A vs B) */}
        <Sequence from={1980} durationInFrames={480} name="Shot 06 - Choice 2">
          <OffthreadVideo
            src={staticFile("renders/shot_06.mp4")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Sequence>

        {/* Shot 7: 0:41–0:48 (Frames 2460–2880) - Locked Inside */}
        <Sequence from={2460} durationInFrames={420} name="Shot 07 - Locked Inside">
          <OffthreadVideo
            src={staticFile("renders/shot_07.mp4")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Sequence>

        {/* Shot 8: 0:48–0:55 (Frames 2880–3300) - The Twist Ending */}
        <Sequence from={2880} durationInFrames={420} name="Shot 08 - The Twist Ending">
          <OffthreadVideo
            src={staticFile("renders/shot_08.mp4")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Sequence>
      </CameraShake>

      {/* 2. INTERACTIVE UI OVERLAYS & CAPTIONS */}

      {/* Shot 2 Floating UI Callout over ringing phone (Frames 600–780) */}
      <Sequence from={600} durationInFrames={180} name="UI - Incoming Call Callout">
        <IncomingCallBadge />
      </Sequence>

      {/* Shot 3 Choice 1 Overlay (Frames 780–1080) - B highlights at frame 960 (relative 180) */}
      <Sequence from={780} durationInFrames={300} name="UI - Choice 1 (A vs B)">
        <ChoiceOverlay
          choiceA={{
            id: "A",
            label: "UNLOCK FRONT DOOR",
            anchor: { x: 340, y: 840 },
            badge: { x: 380, y: 1040 },
          }}
          choiceB={{
            id: "B",
            label: "ANSWER STORE PHONE",
            anchor: { x: 740, y: 1180 },
            badge: { x: 700, y: 1380 },
          }}
          selectedChoice="B"
          selectionFrame={180}
        />
      </Sequence>

      {/* Shot 6 Choice 2 Overlay (Frames 1980–2460) - A highlights at frame 2340 (relative 360) */}
      <Sequence from={1980} durationInFrames={480} name="UI - Choice 2 (A vs B)">
        <ChoiceOverlay
          choiceA={{
            id: "A",
            label: "WALK-IN FREEZER",
            anchor: { x: 820, y: 960 },
            badge: { x: 720, y: 1180 },
          }}
          choiceB={{
            id: "B",
            label: "ROOF ACCESS LADDER",
            anchor: { x: 260, y: 800 },
            badge: { x: 360, y: 1000 },
          }}
          selectedChoice="A"
          selectionFrame={360}
        />
      </Sequence>

      {/* High-retention Top-Center Captions */}
      <Captions />

      {/* 3. AUDIO SEQUENCE SLOTS (Ready for upcoming ElevenLabs voice & SFX tracks) */}
      <Sequence from={0} durationInFrames={420} name="Audio - 01 Narrator Hook">
        {/* Placeholder slot: Add <Audio src={staticFile("audio/01_narrator_hook.mp3")} /> */}
      </Sequence>
      <Sequence from={420} durationInFrames={360} name="Audio - 02 Knock & Phone Ring">
        {/* Placeholder slot: Add <Audio src={staticFile("audio/02_knock_and_phone.mp3")} /> */}
      </Sequence>
      <Sequence from={780} durationInFrames={300} name="Audio - 03 Choice One Selection">
        {/* Placeholder slot: Add <Audio src={staticFile("audio/03_choice_one.mp3")} /> */}
      </Sequence>
      <Sequence from={1080} durationInFrames={480} name="Audio - 04 Mimic Voice & Glass Shatter">
        {/* Placeholder slot: Add <Audio src={staticFile("audio/04_breach_scream.mp3")} /> */}
      </Sequence>
      <Sequence from={1560} durationInFrames={420} name="Audio - 05 Hallway Sprint Footsteps">
        {/* Placeholder slot: Add <Audio src={staticFile("audio/05_sprint_footsteps.mp3")} /> */}
      </Sequence>
      <Sequence from={1980} durationInFrames={480} name="Audio - 06 Choice Two Selection">
        {/* Placeholder slot: Add <Audio src={staticFile("audio/06_choice_two.mp3")} /> */}
      </Sequence>
      <Sequence from={2460} durationInFrames={420} name="Audio - 07 Heavy Door Slam & Lock">
        {/* Placeholder slot: Add <Audio src={staticFile("audio/07_door_slam.mp3")} /> */}
      </Sequence>
      <Sequence from={2880} durationInFrames={420} name="Audio - 08 Twist Reveal & Jump Snap">
        {/* Placeholder slot: Add <Audio src={staticFile("audio/08_twist_ending.mp3")} /> */}
      </Sequence>

      {/* 4. INSTAGRAM REELS SAFE ZONE INSPECTOR OVERLAY */}
      {showSafeZoneOverlay && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderTop: "240px solid rgba(239, 68, 68, 0.25)",
            borderBottom: "360px solid rgba(239, 68, 68, 0.25)",
            borderRight: "140px solid rgba(239, 68, 68, 0.25)",
            pointerEvents: "none",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              padding: "12px 24px",
              backgroundColor: "rgba(0,0,0,0.75)",
              color: "#EF4444",
              fontWeight: 800,
              fontSize: 22,
              borderRadius: 8,
              fontFamily: "monospace",
            }}
          >
            INSTAGRAM REELS SAFE ZONE ACTIVE
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

