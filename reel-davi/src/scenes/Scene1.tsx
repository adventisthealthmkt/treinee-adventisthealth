import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { sceneChunks, sceneConfig } from "../config";
import { Camera } from "../components/Layer";
import { Field } from "../components/Field";
import { Sheep, ShepherdSeated } from "../components/characters";
import { Headline } from "../components/Typography";
import { Shot } from "../components/Shot";

/** CENA 1 — Gancho: o jovem pastor no campo; a câmera se aproxima devagar. */
export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { duration } = sceneConfig("cena-1");
  const chunks = sceneChunks("cena-1");
  const t = frame / duration;
  return (
    <AbsoluteFill>
      <Shot id="cena-1">
        <Camera frame={frame} durationInFrames={duration} startScale={1.0} push={0.12} origin="46% 72%">
          <Field frame={frame} t={t}>
            <Sheep frame={frame} x={250} y={1300} scale={0.42} seed={1} dir={-1} />
            <Sheep frame={frame} x={700} y={1290} scale={0.38} seed={2} />
            <Sheep frame={frame} x={900} y={1335} scale={0.5} seed={3} dir={-1} />
            <Sheep frame={frame} x={120} y={1440} scale={0.72} seed={4} />
            <ShepherdSeated frame={frame} x={500} y={1600} scale={1.02} />
            <Sheep frame={frame} x={840} y={1560} scale={0.92} seed={5} dir={-1} />
            <Sheep frame={frame} x={210} y={1660} scale={1.05} seed={6} />
          </Field>
        </Camera>
      </Shot>
      <Headline
        lines={["Davi não fazia ideia", "do que estava acontecendo", "na casa dele."]}
        syncTo={chunks}
        from={chunks[0]?.start ?? 1}
        emphasis={["ideia"]}
        y={600}
        size={74}
      />
    </AbsoluteFill>
  );
};
