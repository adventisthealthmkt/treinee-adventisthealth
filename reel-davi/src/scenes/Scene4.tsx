import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS, narrationEnd, sceneChunks, sceneConfig } from "../config";
import { Camera, Layer } from "../components/Layer";
import { ShepherdSeated } from "../components/characters";
import { Clouds, Grass, Haze, Hill, Motes, Sky, Sun } from "../components/nature";
import { mix } from "../components/Field";
import { Captions, Headline } from "../components/Typography";
import { Shot } from "../components/Shot";
import { Skyline } from "./Scene3";
import { progress } from "../lib/motion";

/** Árvore em silhueta, com folhagem balançando de leve. */
const Tree: React.FC<{ frame: number; x: number; y: number; scale?: number; color: string; rim: string }> = ({
  frame,
  x,
  y,
  scale = 1,
  color,
  rim,
}) => {
  const blobs = [
    [0, -720, 210],
    [-150, -640, 160],
    [150, -650, 170],
    [-60, -860, 150],
    [110, -820, 140],
    [-230, -760, 110],
    [250, -760, 110],
  ];
  const sway = Math.sin(frame / 60) * 6;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M-26,0 C-20,-200 -30,-400 -10,-600 L14,-600 C30,-400 24,-200 30,0 Z" fill={color} />
      <path d="M0,-420 C-60,-480 -110,-520 -160,-600 L-148,-608 C-90,-540 -40,-500 6,-450 Z" fill={color} />
      <g transform={`translate(${sway} 0)`}>
        {blobs.map(([bx, by, r], i) => (
          <circle key={`r${i}`} cx={bx + 6} cy={by - 4} r={r} fill={rim} opacity={0.35} />
        ))}
        {blobs.map(([bx, by, r], i) => (
          <circle key={i} cx={bx} cy={by} r={r} fill={color} />
        ))}
      </g>
    </g>
  );
};

/** CENA 4 — Reflexão: um dia comum; o céu nublado se abre em luz de fim de tarde. */
export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const { duration } = sceneConfig("cena-4");
  const chunks = sceneChunks("cena-4");
  const end = narrationEnd("cena-4");
  const t = frame / duration;
  // céu: nublado → dourado, acompanhando a pergunta da narração
  const k = progress(frame, 1.5 * FPS, (end + 0.5) * FPS);
  const sky: [string, string, string, string] = [
    mix("#4c4a48", "#3d2a20", k),
    mix("#76726c", "#9a6440", k),
    mix("#9c958c", "#e3a765", k),
    mix("#b9b0a3", "#f6d39c", k),
  ];
  const land = (a: string, b: string) => mix(a, b, k);
  return (
    <AbsoluteFill>
      <Shot id="cena-4">
        <Camera frame={frame} durationInFrames={duration} startScale={1.02} push={0.1} panY={-20} origin="50% 70%">
          <AbsoluteFill style={{ backgroundColor: "#141210" }}>
            <Layer x={-t * 12}>
              <Sky stops={sky} horizon={0.6} />
              <Sun x={720} y={1010} r={58} intensity={k} />
              <Clouds frame={frame} seed={41} count={9} y={[250, 900]} color={mix("#8d8780", "#f3c88c", k)} shade={mix("#5f5a55", "#9a6a48", k)} opacity={0.85 - k * 0.45} speed={0.35} blur={26} />
              <Clouds frame={frame} seed={42} count={6} y={[150, 600]} color={mix("#a39d95", "#f6d6a6", k)} opacity={0.7 - k * 0.4} speed={0.5} blur={30} />
              <Haze y={1110} height={220} color={mix("#c8c0b4", "#f3c68a", k)} opacity={0.6} />
            </Layer>
            <Layer x={-t * 22}>
              <Skyline seed={7} baseY={1160} color={land("#6c6862", "#8a6040")} lit={0.03} minH={40} maxH={170} />
              <Haze y={1150} height={120} color={mix("#c8c0b4", "#f0c084", k)} opacity={0.5} />
              <Skyline seed={8} baseY={1230} color={land("#4c4844", "#5a3d27")} lit={0.08} minH={50} maxH={210} />
            </Layer>
            <Layer x={-t * 40}>
              <Hill baseY={1290} amp={22} seed={6.2} freq={0.003} top={land("#4e4b40", "#5c4128")} bottom={land("#2b2a25", "#2a1b10")} rim={mix("#9e978c", "#ffd79a", k)} />
              <Grass frame={frame} seed={44} y={1300} count={160} height={[18, 46]} color={land("#2d2b24", "#3a2817")} rim={mix("#77736a", "#e3b06c", k)} wind={0.8} spread={500} />
              <Motes frame={frame} seed={45} count={26} area={[200, 700, 1000, 1500]} opacity={0.45 * k} />
              {/* banco com alguém sentado, de costas */}
              <ShepherdSeated frame={frame} x={560} y={1690} scale={0.62} variant="modern" showStaff={false} fill="#1f1a15" rim={mix("#9e978c", "#ffd79a", k)} />
              <g fill="#17110c">
                <rect x={330} y={1600} width={460} height={18} rx={4} />
                <rect x={330} y={1632} width={460} height={18} rx={4} />
                <rect x={350} y={1600} width={14} height={150} />
                <rect x={756} y={1600} width={14} height={150} />
                <rect x={318} y={1668} width={484} height={14} rx={4} />
              </g>
            </Layer>
            <Layer x={-t * 90} blur={5}>
              <Tree frame={frame} x={60} y={1960} scale={1.25} color={land("#1d1c19", "#1a110a")} rim={mix("#77736a", "#d39b5a", k)} />
            </Layer>
          </AbsoluteFill>
        </Camera>
      </Shot>
      <Captions chunks={chunks} />
      <Headline
        lines={["E se Deus estiver agindo", "sem você perceber?"]}
        from={end + 0.25}
        emphasis={["agindo"]}
        stagger={0.6}
        y={700}
        size={80}
      />
    </AbsoluteFill>
  );
};
