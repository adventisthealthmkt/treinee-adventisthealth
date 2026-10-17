import React, { useMemo } from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { FPS, narrationEnd, sceneChunks, sceneConfig } from "../config";
import { Camera, Layer } from "../components/Layer";
import { Grass, Haze, Hill, Motes, Sky, Sun, useSvgId } from "../components/nature";
import { Captions, Headline } from "../components/Typography";
import { Dissolve, Shot } from "../components/Shot";
import { progress } from "../lib/motion";

const PAGE_W = 380;
const PAGE_H = 540;

/** Linhas manuscritas ilegíveis (só textura de escrita). */
const Handwriting: React.FC<{ seed: number; x0: number; faint?: boolean }> = ({ seed, x0, faint }) => {
  const lines = useMemo(
    () =>
      new Array(13).fill(0).map((_, j) => {
        const y = -205 + j * 34;
        const len = (j === 0 ? 0.5 : 0.65 + random(`hw${seed}${j}`) * 0.3) * (PAGE_W - 80);
        const start = x0 + 40 + (j === 0 ? 40 : 0);
        let d = `M${start},${y}`;
        for (let x = 0; x < len; x += 9) {
          const a = 3 + random(`a${seed}${j}${x}`) * 6;
          d += ` q4.5,${-a} 9,0`;
          if (random(`sp${seed}${j}${x}`) < 0.12) {
            x += 10;
            d += ` m10,0`;
          }
        }
        return { d, skip: random(`sk${seed}${j}`) < 0.12 };
      }),
    [seed, x0],
  );
  return (
    <g fill="none" stroke="#4a3626" strokeWidth={2} strokeLinecap="round" opacity={faint ? 0.18 : 0.62}>
      {lines.map((l, i) => (l.skip ? null : <path key={i} d={l.d} />))}
    </g>
  );
};

const PageBase: React.FC<{ side: -1 | 1; seed: number }> = ({ side, seed }) => {
  const id = useSvgId("page");
  const x = side === -1 ? -PAGE_W : 0;
  return (
    <g>
      <defs>
        <linearGradient id={id} x1={side === -1 ? "1" : "0"} y1="0" x2={side === -1 ? "0" : "1"} y2="0">
          <stop offset="0" stopColor="#b89c76" />
          <stop offset="0.12" stopColor="#e6d6b8" />
          <stop offset="1" stopColor="#f1e5cd" />
        </linearGradient>
      </defs>
      <rect x={x} y={-PAGE_H / 2} width={PAGE_W} height={PAGE_H} fill={`url(#${id})`} />
      {new Array(14).fill(0).map((_, j) => (
        <line key={j} x1={x + 24} x2={x + PAGE_W - 24} y1={-210 + j * 34 + 6} y2={-210 + j * 34 + 6} stroke="#b9a283" strokeWidth={1} opacity={0.45} />
      ))}
      <Handwriting seed={seed} x0={x} />
    </g>
  );
};

/** Página virando (projeção 2D de uma rotação em torno da lombada). */
const TurningPage: React.FC<{ p: number; seedFront: number; seedBack: number }> = ({ p, seedFront, seedBack }) => {
  if (p <= 0 || p >= 1) return null;
  const theta = p * Math.PI;
  const w = Math.cos(theta) * PAGE_W; // >0 lado direito, <0 lado esquerdo
  const lift = Math.sin(theta) * 34;
  const front = w > 0;
  const shade = front ? 0.12 + 0.5 * (1 - Math.cos(theta)) : 0.1 + 0.4 * (1 + Math.cos(theta));
  const d = `M0,${-PAGE_H / 2} Q${w * 0.5},${-PAGE_H / 2 - lift} ${w},${-PAGE_H / 2 - lift * 0.4} L${w},${PAGE_H / 2 - lift * 0.4} Q${w * 0.5},${PAGE_H / 2 - lift} 0,${PAGE_H / 2} Z`;
  const sx = Math.abs(Math.cos(theta));
  return (
    <g>
      {/* sombra projetada da página */}
      <path d={d} fill="#2a1a0e" opacity={0.18 * Math.sin(theta)} transform={`translate(${16 * Math.sin(theta)} 18)`} style={{ filter: "blur(10px)" }} />
      <path d={d} fill={front ? "#efe2c8" : "#e9dcc2"} />
      <g transform={`scale(${(w > 0 ? 1 : -1) * sx} 1)`} opacity={0.9}>
        <Handwriting seed={front ? seedFront : seedBack} x0={0} faint={!front} />
      </g>
      <path d={d} fill="#3a2414" opacity={shade * 0.55} />
    </g>
  );
};

const Notebook: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => {
  const table = useSvgId("table");
  const light = useSvgId("light");
  const turn1 = progress(frame, 18, 62);
  const turn2 = progress(frame, 92, 136);
  const leftSeed = turn2 >= 1 ? 4 : turn1 >= 1 ? 2 : 0;
  const rightSeed = turn2 >= 0.5 ? 5 : turn1 >= 0.5 ? 3 : 1;
  const grain = useMemo(
    () =>
      new Array(26).fill(0).map((_, i) => ({
        y: -200 + i * 90 + random(`tg${i}`) * 40,
        a: random(`ta${i}`) * 30,
      })),
    [],
  );
  return (
    <Camera frame={frame} durationInFrames={duration} startScale={1.06} push={0.1} origin="52% 46%">
      <AbsoluteFill style={{ backgroundColor: "#2a1b10" }}>
        <Layer>
          <defs>
            <linearGradient id={table} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#6a4a30" />
              <stop offset="1" stopColor="#2e1e12" />
            </linearGradient>
            <linearGradient id={light} x1="1" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffd9a0" stopOpacity={0.5} />
              <stop offset="0.6" stopColor="#ffd9a0" stopOpacity={0.12} />
              <stop offset="1" stopColor="#ffd9a0" stopOpacity={0} />
            </linearGradient>
          </defs>
          <rect x={-300} y={-300} width={1700} height={2600} fill={`url(#${table})`} />
          {grain.map((g, i) => (
            <path
              key={i}
              d={`M-300,${g.y} C200,${g.y + g.a} 700,${g.y - g.a} 1400,${g.y + g.a * 0.5}`}
              stroke="#8a6444"
              strokeWidth={2 + (i % 3)}
              fill="none"
              opacity={0.16}
            />
          ))}
          <g transform="translate(560 900) rotate(-6)">
            {/* sombra do caderno */}
            <rect x={-PAGE_W - 6} y={-PAGE_H / 2 + 14} width={PAGE_W * 2 + 28} height={PAGE_H + 10} fill="#1a0f07" opacity={0.45} style={{ filter: "blur(14px)" }} />
            <rect x={-PAGE_W - 10} y={-PAGE_H / 2 - 8} width={PAGE_W * 2 + 20} height={PAGE_H + 16} rx={6} fill="#5b3a22" />
            <PageBase side={-1} seed={leftSeed} />
            <PageBase side={1} seed={rightSeed} />
            <line x1={0} x2={0} y1={-PAGE_H / 2} y2={PAGE_H / 2} stroke="#8a6c4c" strokeWidth={2} opacity={0.6} />
            <TurningPage p={turn1} seedFront={1} seedBack={2} />
            <TurningPage p={turn2} seedFront={3} seedBack={4} />
            {/* caneta */}
            <g transform="translate(330 380) rotate(-28)">
              <rect x={-170} y={-9} width={300} height={18} rx={9} fill="#2a1a0f" />
              <rect x={-170} y={-9} width={300} height={5} rx={3} fill="#b78b57" opacity={0.5} />
              <path d="M130,-9 L168,0 L130,9 Z" fill="#c9a56c" />
            </g>
          </g>
          {/* luz natural da janela e sombra do caixilho */}
          <rect x={-300} y={-300} width={1700} height={2600} fill={`url(#${light})`} style={{ mixBlendMode: "screen" }} />
          <g opacity={0.22} style={{ filter: "blur(18px)" }}>
            <rect x={-200} y={420} width={1600} height={60} fill="#120a05" transform="rotate(-24 540 900)" />
            <rect x={640} y={-300} width={60} height={2400} fill="#120a05" transform="rotate(-24 540 900)" />
          </g>
          <Motes frame={frame} seed={51} count={20} area={[300, 300, 1000, 1200]} opacity={0.3} />
        </Layer>
      </AbsoluteFill>
    </Camera>
  );
};

/** Uma estrada que segue até o horizonte. */
const Road: React.FC<{ frame: number; duration: number; startFrame: number }> = ({ frame, duration, startFrame }) => {
  const local = Math.max(0, frame - startFrame);
  const len = duration - startFrame;
  const t = local / len;
  const road = useSvgId("road5");
  const hy = 1000;
  return (
    <Camera frame={local} durationInFrames={len} startScale={1.0} push={0.22} origin="52% 52%">
      <AbsoluteFill style={{ backgroundColor: "#140d08" }}>
        <Layer x={-t * 8}>
          <Sky stops={["#3a281f", "#91603e", "#e1a564", "#f7d6a0"]} horizon={hy / 1920} />
          <Sun x={600} y={hy - 40} r={62} intensity={1} />
        </Layer>
        <Layer x={-t * 16}>
          <Hill baseY={hy + 6} amp={40} seed={1.3} freq={0.0034} top="#c49465" bottom="#9b7049" />
          <Haze y={hy + 20} height={160} color="#f6d29c" opacity={0.6} />
          <Hill baseY={hy + 80} amp={46} seed={4.4} freq={0.004} top="#8b6039" bottom="#5a3d25" rim="#ffd79a" />
        </Layer>
        <Layer>
          <defs>
            <linearGradient id={road} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f0cf9c" />
              <stop offset="0.3" stopColor="#b9875a" />
              <stop offset="1" stopColor="#5a3e28" />
            </linearGradient>
          </defs>
          <path d={`M-200,${hy + 120} L1400,${hy + 120} L1400,2100 L-200,2100 Z`} fill="#4a321e" />
          <Grass frame={frame} seed={52} y={hy + 130} count={200} height={[10, 40]} color="#5a3e24" rim="#e3b06c" wind={0.6} spread={600} />
          {/* estrada sinuosa em perspectiva */}
          <Grass frame={frame} seed={53} y={hy + 560} count={90} height={[40, 120]} color="#3a2817" rim="#e3b06c" wind={0.8} spread={500} />
          <path
            d={`M582,${hy + 112} C566,${hy + 320} 420,${hy + 620} 90,2100 L1000,2100 C720,${hy + 620} 606,${hy + 320} 590,${hy + 112} Z`}
            fill={`url(#${road})`}
          />
          {/* marcas de rodas/pegadas, sutis */}
          <path d={`M584,${hy + 140} C570,${hy + 360} 470,${hy + 640} 330,2100`} stroke="#8a6444" strokeWidth={10} fill="none" opacity={0.25} />
          <path d={`M588,${hy + 140} C604,${hy + 360} 640,${hy + 640} 760,2100`} stroke="#8a6444" strokeWidth={10} fill="none" opacity={0.25} />
          <Motes frame={frame} seed={54} count={24} area={[100, 800, 1000, 1500]} opacity={0.4} />
        </Layer>
        <Layer x={-t * 100} blur={6}>
          <Grass frame={frame} seed={55} y={1940} count={34} height={[140, 300]} color="#1f140c" rim="#c48d4c" wind={1.1} spread={40} />
        </Layer>
      </AbsoluteFill>
    </Camera>
  );
};

/** CENA 5 — A metáfora: o caderno e a estrada. */
export const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const { duration } = sceneConfig("cena-5");
  const chunks = sceneChunks("cena-5");
  const end = narrationEnd("cena-5");
  const cut = Math.round(((chunks[2]?.start ?? 6) - 0.4) * FPS);
  return (
    <AbsoluteFill>
      <Dissolve
        at={cut}
        length={28}
        a={
          <Shot id="cena-5-caderno">
            <Notebook frame={frame} duration={duration} />
          </Shot>
        }
        b={
          <Shot id="cena-5-estrada">
            <Road frame={frame} duration={duration} startFrame={cut} />
          </Shot>
        }
      />
      <Captions chunks={chunks} />
      <Headline
        lines={["Conhecemos a promessa.", "Não conhecemos", "todos os capítulos."]}
        from={end + 0.25}
        emphasis={["promessa", "capítulos"]}
        stagger={0.75}
        y={640}
        size={80}
      />
    </AbsoluteFill>
  );
};
