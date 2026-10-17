import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS, sceneChunks, sceneConfig } from "../config";
import { Camera, Layer } from "../components/Layer";
import { Field } from "../components/Field";
import { Figure, Sheep, Walker } from "../components/characters";
import { Motes, useSvgId } from "../components/nature";
import { Captions, Headline } from "../components/Typography";
import { Dissolve, Shot } from "../components/Shot";

/** Interior de uma casa simples: Samuel diante dos irmãos, contraluz da porta. */
const HouseInterior: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => {
  const wall = useSvgId("wall");
  const door = useSvgId("door");
  const spill = useSvgId("spill");
  const lamp = useSvgId("lamp");
  const flicker = 0.85 + 0.08 * Math.sin(frame / 3.1) + 0.05 * Math.sin(frame / 7.3);
  const t = frame / duration;
  const brothers = [
    { x: 470, h: 1.0 },
    { x: 590, h: 1.08 },
    { x: 700, h: 0.96 },
    { x: 805, h: 1.05 },
    { x: 905, h: 0.98 },
    { x: 1010, h: 1.1 },
    { x: 1110, h: 0.94 },
  ];
  return (
    <Camera frame={frame} durationInFrames={duration} startScale={1.08} push={0.06} panX={-60} origin="40% 60%">
      <AbsoluteFill style={{ backgroundColor: "#160e09" }}>
        <Layer x={-t * 14}>
          <defs>
            <linearGradient id={wall} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#4a3220" />
              <stop offset="0.45" stopColor="#2c1d13" />
              <stop offset="1" stopColor="#1a110b" />
            </linearGradient>
            <linearGradient id={door} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#c98a4f" />
              <stop offset="0.55" stopColor="#f3c789" />
              <stop offset="0.75" stopColor="#d9a466" />
              <stop offset="1" stopColor="#8a6040" />
            </linearGradient>
            <radialGradient id={spill} cx="0.2" cy="0.1" r="1">
              <stop offset="0" stopColor="#f7c98a" stopOpacity={0.55} />
              <stop offset="1" stopColor="#f7c98a" stopOpacity={0} />
            </radialGradient>
            <radialGradient id={lamp}>
              <stop offset="0" stopColor="#ffd38f" stopOpacity={0.9 * flicker} />
              <stop offset="0.2" stopColor="#f0a85a" stopOpacity={0.35 * flicker} />
              <stop offset="1" stopColor="#f0a85a" stopOpacity={0} />
            </radialGradient>
          </defs>
          <rect x={-300} y={-200} width={1700} height={1700} fill={`url(#${wall})`} />
          {/* porta aberta para o exterior */}
          <rect x={60} y={560} width={250} height={860} rx={6} fill={`url(#${door})`} />
          <path d="M60,1180 Q140,1150 200,1170 T310,1160 L310,1420 L60,1420 Z" fill="#7a5638" opacity={0.7} />
          <rect x={40} y={540} width={24} height={900} fill="#1b120c" />
          <rect x={306} y={540} width={24} height={900} fill="#1b120c" />
          <rect x={40} y={530} width={290} height={34} fill="#1b120c" />
          {/* nicho com lamparina */}
          <rect x={860} y={760} width={120} height={110} rx={50} fill="#120b07" />
          <ellipse cx={920} cy={850} rx={34} ry={12} fill="#3a2616" />
          <circle cx={920} cy={828} r={260} fill={`url(#${lamp})`} />
          <ellipse cx={924} cy={826} rx={6} ry={12} fill="#fff1cf" opacity={flicker} />
          {/* piso */}
          <rect x={-300} y={1420} width={1700} height={700} fill="#24170e" />
          <path d="M60,1420 L310,1420 L760,1920 L-200,1920 Z" fill={`url(#${spill})`} />
        </Layer>
        <Layer x={-t * 30}>
          <Motes frame={frame} seed={21} count={30} area={[40, 600, 520, 1400]} opacity={0.5} />
          <Figure frame={frame} x={250} y={1470} h={1.1} seed={0} elder rim="#ffd08a" />
          {brothers.map((b, i) => (
            <Figure key={i} frame={frame} x={b.x} y={1470 + (i % 2) * 30} h={b.h} seed={i + 1} headcloth={i % 3 !== 1} />
          ))}
        </Layer>
        <Layer x={-t * 70} blur={10}>
          <rect x={-200} y={1700} width={1500} height={400} fill="#0f0905" />
          <path d="M-200,1760 Q300,1690 1300,1740 L1300,2100 L-200,2100 Z" fill="#0b0704" />
        </Layer>
      </AbsoluteFill>
    </Camera>
  );
};

/** Davi no campo, em pé com o cajado, cuidando das ovelhas. */
const DavidAtWork: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => {
  const t = frame / duration;
  return (
    <Camera frame={frame} durationInFrames={duration} startScale={1.02} push={0.07} panX={30} origin="55% 70%">
      <Field frame={frame} t={t} sunX={300} sunY={940}>
        <Sheep frame={frame} x={160} y={1320} scale={0.4} seed={11} />
        <Sheep frame={frame} x={420} y={1360} scale={0.45} seed={12} dir={-1} />
        <Sheep frame={frame} x={960} y={1380} scale={0.55} seed={13} dir={-1} />
        <Walker frame={frame} x={640} y={1560} scale={0.82} walking={false} />
        <Sheep frame={frame} x={360} y={1500} scale={0.78} seed={14} walk={0.25} />
        <Sheep frame={frame} x={860} y={1610} scale={0.95} seed={15} dir={-1} />
        <Sheep frame={frame} x={120} y={1700} scale={1.1} seed={16} />
      </Field>
    </Camera>
  );
};

/** CENA 2 — Contexto: a casa e o campo, ao mesmo tempo. */
export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { duration } = sceneConfig("cena-2");
  const chunks = sceneChunks("cena-2");
  const cut = Math.round(((chunks[2]?.start ?? 6.5) - 0.5) * FPS);
  return (
    <AbsoluteFill>
      <Dissolve
        at={cut}
        length={26}
        a={
          <Shot id="cena-2-casa">
            <HouseInterior frame={frame} duration={duration} />
          </Shot>
        }
        b={
          <Shot id="cena-2-campo">
            <DavidAtWork frame={frame} duration={duration} />
          </Shot>
        }
      />
      <Headline lines={["Ele nem sabia."]} from={(chunks[2]?.start ?? 7) + 0.6} emphasis={["sabia"]} y={640} size={96} />
      <Captions chunks={chunks} />
    </AbsoluteFill>
  );
};
