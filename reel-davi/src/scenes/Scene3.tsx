import React, { useMemo } from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { FPS, sceneChunks, sceneConfig } from "../config";
import { Camera, Layer } from "../components/Layer";
import { Walker } from "../components/characters";
import { Clouds, Haze, Motes, Sky, Sun, useSvgId } from "../components/nature";
import { Captions, Headline } from "../components/Typography";
import { Dissolve, Shot } from "../components/Shot";

/** Silhueta de cidade com algumas janelas acesas. */
export const Skyline: React.FC<{ seed: number; baseY: number; color: string; lit?: number; minH?: number; maxH?: number }> = ({
  seed,
  baseY,
  color,
  lit = 0.25,
  minH = 120,
  maxH = 420,
}) => {
  const buildings = useMemo(() => {
    const out: { x: number; w: number; h: number; wins: { x: number; y: number }[] }[] = [];
    let x = -300;
    let i = 0;
    while (x < 1400) {
      const w = 70 + random(`b${seed}${i}w`) * 120;
      const h = minH + random(`b${seed}${i}h`) * (maxH - minH);
      const wins: { x: number; y: number }[] = [];
      for (let wy = baseY - h + 24; wy < baseY - 20; wy += 34) {
        for (let wx = x + 14; wx < x + w - 18; wx += 26) {
          if (random(`w${seed}${i}${wx}${wy}`) < lit) wins.push({ x: wx, y: wy });
        }
      }
      out.push({ x, w, h, wins });
      x += w + random(`b${seed}${i}g`) * 10;
      i++;
    }
    return out;
  }, [seed, baseY, lit, minH, maxH]);
  return (
    <g>
      {buildings.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={baseY - b.h} width={b.w} height={b.h + 600} fill={color} />
          {b.wins.map((w, j) => (
            <rect key={j} x={w.x} y={w.y} width={10} height={14} fill="#ffcf8a" opacity={0.55} />
          ))}
        </g>
      ))}
    </g>
  );
};

/** Alguém olhando pela janela no fim da tarde. */
const Window: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => {
  const wall = useSvgId("wall3");
  const glow = useSvgId("glow3");
  const t = frame / duration;
  return (
    <Camera frame={frame} durationInFrames={duration} startScale={1.04} push={0.08} origin="42% 55%">
      <AbsoluteFill style={{ backgroundColor: "#140d08" }}>
        {/* exterior (através do vidro) */}
        <Layer x={-t * 10}>
          <Sky stops={["#4a3428", "#a8704a", "#e6ab6c", "#f5cf98"]} horizon={0.6} />
          <Clouds frame={frame} seed={31} y={[420, 760]} color="#f2c58a" shade="#9b6c4a" opacity={0.45} speed={0.15} />
          <Sun x={760} y={1060} r={56} intensity={0.95} />
          <Haze y={1120} height={200} color="#f2c48a" opacity={0.5} />
          <Skyline seed={3} baseY={1230} color="#7a5539" lit={0.05} minH={60} maxH={220} />
          <Skyline seed={4} baseY={1330} color="#4a3322" lit={0.12} minH={90} maxH={300} />
        </Layer>
        {/* parede e caixilhos */}
        <Layer>
          <defs>
            <linearGradient id={wall} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#24170f" />
              <stop offset="1" stopColor="#3a271a" />
            </linearGradient>
            <radialGradient id={glow} cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#f6c98d" stopOpacity={0.4} />
              <stop offset="1" stopColor="#f6c98d" stopOpacity={0} />
            </radialGradient>
          </defs>
          <path
            fillRule="evenodd"
            d="M-300,-300 H1400 V2300 H-300 Z M150,360 H930 V1460 H150 Z"
            fill={`url(#${wall})`}
          />
          <rect x={150} y={900} width={780} height={22} fill="#1d130c" />
          <rect x={530} y={360} width={22} height={1100} fill="#1d130c" />
          <rect x={130} y={1450} width={820} height={40} fill="#2e1f14" />
          <rect x={130} y={1490} width={820} height={18} fill="#1a110a" />
          {/* luz da janela no peitoril e no chão */}
          <ellipse cx={560} cy={1520} rx={600} ry={200} fill={`url(#${glow})`} />
          {/* planta no peitoril */}
          <rect x={790} y={1385} width={70} height={66} rx={8} fill="#2a1b11" />
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const a = -60 + i * 24 + Math.sin(frame / 50 + i) * 2;
            return (
              <ellipse
                key={i}
                cx={825}
                cy={1345}
                rx={14}
                ry={56}
                fill="#2e2216"
                transform={`rotate(${a} 825 1390)`}
              />
            );
          })}
        </Layer>
        {/* cortina desfocada à direita */}
        <Layer x={-t * 40} blur={8}>
          <path d="M930,300 Q1000,800 960,1500 L1200,1500 L1200,300 Z" fill="#5a3d27" opacity={0.85} />
          <path d="M950,300 Q1010,800 980,1500" stroke="#c9915a" strokeWidth={6} fill="none" opacity={0.4} />
        </Layer>
        <Layer x={-t * 26}>
          <Motes frame={frame} seed={33} count={22} area={[160, 400, 920, 1440]} opacity={0.4} />
          <Walker frame={frame} x={350} y={1960} scale={1.3} walking={false} variant="modern" staff={false} fill="#1d140d" />
        </Layer>
      </AbsoluteFill>
    </Camera>
  );
};

/** Alguém andando na rua ao entardecer, visto de costas. */
const Street: React.FC<{ frame: number; duration: number; startFrame: number }> = ({ frame, duration, startFrame }) => {
  const local = Math.max(0, frame - startFrame);
  const len = duration - startFrame;
  const t = local / len;
  const vx = 540;
  const vy = 1010;
  const road = useSvgId("road");
  const side = useSvgId("side");
  const pedestrians = [
    { x: 470, y: 1110, s: 0.16, c: 40 },
    { x: 610, y: 1080, s: 0.12, c: 36 },
    { x: 660, y: 1130, s: 0.18, c: 44 },
  ];
  return (
    <Camera frame={local} durationInFrames={len} startScale={1.02} push={0.1} origin="50% 52%">
      <AbsoluteFill style={{ backgroundColor: "#140d08" }}>
        <Layer>
          <Sky stops={["#3e2b22", "#99633f", "#e3a464", "#f7d39d"]} horizon={0.53} />
          <Sun x={vx + 10} y={vy - 30} r={60} intensity={1} />
          <Haze y={vy} height={260} color="#f4c88c" opacity={0.65} />
        </Layer>
        <Layer x={-t * 20}>
          <defs>
            <linearGradient id={road} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#d8a46a" />
              <stop offset="0.25" stopColor="#7a5538" />
              <stop offset="1" stopColor="#2a1c12" />
            </linearGradient>
            <linearGradient id={side} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#b9875a" />
              <stop offset="1" stopColor="#3b291b" />
            </linearGradient>
          </defs>
          {/* rua e calçadas em perspectiva */}
          <path d={`M${vx - 6},${vy} L${vx + 6},${vy} L1500,1920 L-420,1920 Z`} fill={`url(#${road})`} />
          <path d={`M${vx - 6},${vy} L-420,1920 L-80,1920 Z`} fill={`url(#${side})`} opacity={0.9} />
          <path d={`M${vx + 6},${vy} L1500,1920 L1160,1920 Z`} fill={`url(#${side})`} opacity={0.9} />
          {/* prédios dos dois lados */}
          <path d={`M${vx - 20},${vy - 120} L${vx - 20},${vy + 6} L-300,1500 L-300,-200 Z`} fill="#2a1c13" />
          <path d={`M${vx + 20},${vy - 160} L${vx + 20},${vy + 6} L1400,1500 L1400,-200 Z`} fill="#24180f" />
          {/* janelas acesas em perspectiva */}
          {new Array(9).fill(0).map((_, i) => {
            const k = 0.12 + i * 0.1;
            const xl = vx - 20 - (vx + 280) * k;
            const yl = vy - 80 - 300 * k;
            const xr = vx + 20 + (880) * k;
            return (
              <g key={i} opacity={0.5}>
                <rect x={xl} y={yl} width={14 + 40 * k} height={20 + 60 * k} fill="#f5c27f" opacity={i % 3 === 0 ? 0.9 : 0.25} />
                <rect x={xr} y={yl - 60 * k} width={14 + 40 * k} height={20 + 60 * k} fill="#f5c27f" opacity={i % 2 ? 0.8 : 0.2} />
              </g>
            );
          })}
          {/* postes */}
          {[0.25, 0.5, 0.8].map((k, i) => {
            const x = vx + 30 + 760 * k;
            const y = vy + 900 * k;
            return (
              <g key={i}>
                <rect x={x} y={y - 820 * k - 60} width={6 + 10 * k} height={820 * k + 60} fill="#1a110a" />
                <circle cx={x + 4} cy={y - 820 * k - 60} r={8 + 16 * k} fill="#ffd9a0" opacity={0.75} />
                <circle cx={x + 4} cy={y - 820 * k - 60} r={60 + 90 * k} fill="#ffd9a0" opacity={0.08} />
              </g>
            );
          })}
          {pedestrians.map((p, i) => (
            <Walker key={i} frame={frame + i * 11} x={p.x} y={p.y} scale={p.s} cycle={p.c} variant="modern" staff={false} fill="#1c130c" />
          ))}
          <Motes frame={frame} seed={34} count={26} area={[100, 700, 980, 1500]} opacity={0.35} />
        </Layer>
        <Layer>
          <Walker
            frame={frame}
            x={500 + t * 20}
            y={1840 - t * 220}
            scale={1.15 - t * 0.38}
            cycle={32}
            variant="modern"
            staff={false}
            fill="#1b120b"
          />
        </Layer>
      </AbsoluteFill>
    </Camera>
  );
};

/** CENA 3 — Conexão humana: do campo antigo para a vida de hoje. */
export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { duration } = sceneConfig("cena-3");
  const chunks = sceneChunks("cena-3");
  const cut = Math.round(((chunks[2]?.start ?? 6) - 0.5) * FPS);
  return (
    <AbsoluteFill>
      <Dissolve
        at={cut}
        length={26}
        a={
          <Shot id="cena-3-janela">
            <Window frame={frame} duration={duration} />
          </Shot>
        }
        b={
          <Shot id="cena-3-rua">
            <Street frame={frame} duration={duration} startFrame={cut} />
          </Shot>
        }
      />
      <Headline
        lines={["Você nunca sabe", "o que pode acontecer", "em seguida."]}
        from={(chunks[3]?.start ?? 9) - 0.2}
        stagger={0.55}
        emphasis={["em", "seguida"]}
        y={600}
        size={80}
      />
      <Captions chunks={chunks} />
    </AbsoluteFill>
  );
};
