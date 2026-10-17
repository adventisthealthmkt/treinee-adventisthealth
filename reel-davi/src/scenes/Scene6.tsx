import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { FPS, narrationEnd, sceneChunks, sceneConfig } from "../config";
import { Camera } from "../components/Layer";
import { Field } from "../components/Field";
import { Sheep, ShepherdSeated, Walker } from "../components/characters";
import { Captions, Headline, Reference } from "../components/Typography";
import { Shot } from "../components/Shot";
import { progress } from "../lib/motion";

/** CENA 6 — Fechamento: o pastor se levanta e caminha rumo ao horizonte. */
export const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const { duration } = sceneConfig("cena-6");
  const chunks = sceneChunks("cena-6");
  const end = narrationEnd("cena-6");
  const t = frame / duration;
  const s = frame / FPS;

  const rise = progress(frame, 2.4 * FPS, 4.0 * FPS);
  const swap = progress(frame, 2.4 * FPS, 2.9 * FPS);
  const walk = interpolate(s, [4.0, 16.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.35, 0, 0.45, 1),
  });
  const walking = s > 3.8 && s < 16.5;
  const dusk = progress(frame, 3 * FPS, 16 * FPS);
  // escurece devagar para dar lugar ao texto final
  const dim = progress(frame, (end - 0.6) * FPS, (end + 2.4) * FPS) * 0.78;

  return (
    <AbsoluteFill>
      <Shot id="cena-6" zoom={[1.12, 1.02]}>
        <Camera frame={frame} durationInFrames={duration} startScale={1.08} push={-0.06} origin="55% 60%">
          <Field frame={frame} t={t} dusk={dusk} sunY={930 + dusk * 70}>
            <Sheep frame={frame} x={260} y={1300} scale={0.42} seed={21} dir={-1} />
            <Sheep frame={frame} x={760} y={1300} scale={0.4} seed={22} />
            <Sheep frame={frame} x={120} y={1440} scale={0.72} seed={24} />
            <Sheep frame={frame} x={900} y={1340} scale={0.5} seed={23} dir={-1} walk={walking ? 0.05 : 0} />
            {swap < 1 && (
              <g opacity={1 - swap}>
                <ShepherdSeated frame={frame} x={500} y={1600} scale={1.02} />
              </g>
            )}
            {swap > 0 && (
              <g opacity={swap}>
                <Walker
                  frame={frame}
                  x={interpolate(walk, [0, 1], [500, 650])}
                  y={interpolate(walk, [0, 1], [1600, 1150])}
                  scale={interpolate(walk, [0, 1], [0.92, 0.16])}
                  walking={walking}
                  cycle={36}
                  rise={rise}
                />
              </g>
            )}
            <Sheep frame={frame} x={820} y={1560} scale={0.92} seed={25} dir={-1} />
            <Sheep frame={frame} x={200} y={1660} scale={1.05} seed={26} walk={walking ? 0.12 : 0} />
          </Field>
        </Camera>
      </Shot>
      <AbsoluteFill style={{ backgroundColor: "#120b07", opacity: dim }} />
      <Captions chunks={chunks} />
      <Headline
        lines={["Confie no Autor,", "mesmo sem conhecer", "o próximo capítulo."]}
        from={end + 0.4}
        emphasis={["Autor"]}
        stagger={0.8}
        y={820}
        size={88}
      />
      <Reference text="1 Samuel 16:1–13" from={end + 2.4} y={1080} />
    </AbsoluteFill>
  );
};
