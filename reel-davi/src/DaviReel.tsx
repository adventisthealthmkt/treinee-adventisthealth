import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { FPS, SCENES, SceneId, TOTAL_FRAMES, TRANSITION, narrationWindows } from "./config";
import { FilmLook } from "./components/FilmLook";
import { Scene1 } from "./scenes/Scene1";
import { Scene2 } from "./scenes/Scene2";
import { Scene3 } from "./scenes/Scene3";
import { Scene4 } from "./scenes/Scene4";
import { Scene5 } from "./scenes/Scene5";
import { Scene6 } from "./scenes/Scene6";

export type DaviReelProps = {
  /** Inclui a narração (public/audio/narracao/cena-N.wav). */
  withVoice: boolean;
  /** Volume da trilha (0–1) quando não há narração tocando. */
  musicVolume: number;
  /** Volume da trilha (0–1) enquanto a narração fala. */
  musicDucked: number;
};

const COMPONENTS: Record<SceneId, React.FC> = {
  "cena-1": Scene1,
  "cena-2": Scene2,
  "cena-3": Scene3,
  "cena-4": Scene4,
  "cena-5": Scene5,
  "cena-6": Scene6,
};

const WINDOWS = narrationWindows();
const RAMP = 12; // frames para abaixar/subir a trilha

/** 0..1: quanto a trilha deve ser abaixada neste frame. */
const duckAmount = (f: number) => {
  let d = 0;
  for (const [a, b] of WINDOWS) {
    const v = Math.min(
      interpolate(f, [a - RAMP, a], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      interpolate(f, [b, b + RAMP * 2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    );
    d = Math.max(d, v);
  }
  return d;
};

export const DaviReel: React.FC<DaviReelProps> = ({ withVoice, musicVolume, musicDucked }) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 24], [1, 0], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [TOTAL_FRAMES - 24, TOTAL_FRAMES - 1], [0, 1], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "#0e0906" }}>
      <TransitionSeries>
        {SCENES.flatMap((scene, i) => {
          const Scene = COMPONENTS[scene.id];
          const items = [
            <TransitionSeries.Sequence key={scene.id} durationInFrames={scene.duration} name={scene.id}>
              <Scene />
              {withVoice && (
                <Sequence from={Math.round(scene.narrationAt * FPS)} name={`narração ${scene.id}`} layout="none">
                  <Audio src={staticFile(`audio/narracao/${scene.id}.wav`)} volume={1} />
                </Sequence>
              )}
            </TransitionSeries.Sequence>,
          ];
          if (i < SCENES.length - 1) {
            items.push(
              <TransitionSeries.Transition
                key={`${scene.id}-t`}
                presentation={fade()}
                timing={linearTiming({ durationInFrames: TRANSITION })}
              />,
            );
          }
          return items;
        })}
      </TransitionSeries>

      <Audio
        src={staticFile("audio/trilha.wav")}
        volume={(f) => {
          const base = withVoice ? musicVolume - (musicVolume - musicDucked) * duckAmount(f) : musicVolume;
          return base;
        }}
      />

      <FilmLook />
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: Math.max(fadeIn, fadeOut), pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
