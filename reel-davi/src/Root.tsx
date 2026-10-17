import React from "react";
import { Composition } from "remotion";
import { DaviReel, DaviReelProps } from "./DaviReel";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./config";

export const RemotionRoot: React.FC = () => (
  <>
    {/* Versão com narração (hoje: voz-guia sintética; troque pelos arquivos definitivos). */}
    <Composition
      id="DaviReel"
      component={DaviReel}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{ withVoice: true, musicVolume: 0.55, musicDucked: 0.18 } satisfies DaviReelProps}
    />
    {/* Versão só com trilha e legendas (sem narração). */}
    <Composition
      id="DaviReelSemVoz"
      component={DaviReel}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{ withVoice: false, musicVolume: 0.7, musicDucked: 0.7 } satisfies DaviReelProps}
    />
  </>
);
