import React, { useId, useMemo } from "react";
import { random } from "remotion";
import { HEIGHT, WIDTH } from "../config";

/** Paleta da direção de arte. */
export const PALETTE = {
  night: "#140d09",
  earth: "#2a1d14",
  earthMid: "#4a3423",
  clay: "#7a5636",
  sand: "#c9a77c",
  beige: "#e8d6b8",
  cream: "#f4e9d6",
  gold: "#e2b56c",
  goldDeep: "#c98f43",
  rim: "#ffd79a",
};

/** id estável e único para gradientes/filtros SVG (cada instância precisa do seu). */
export const useSvgId = (prefix: string) => `${prefix}-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

export type SkyStops = [string, string, string, string];

/** Céu em degradê vertical. stops: topo, meio-alto, perto do horizonte, horizonte. */
export const Sky: React.FC<{ stops: SkyStops; horizon?: number }> = ({ stops, horizon = 0.62 }) => {
  const id = useSvgId("sky");
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={stops[0]} />
          <stop offset={horizon * 0.55} stopColor={stops[1]} />
          <stop offset={horizon * 0.9} stopColor={stops[2]} />
          <stop offset={horizon} stopColor={stops[3]} />
          <stop offset="1" stopColor={stops[3]} />
        </linearGradient>
      </defs>
      <rect x={-400} y={-400} width={WIDTH + 800} height={HEIGHT + 800} fill={`url(#${id})`} />
    </>
  );
};

/** Sol baixo com halo amplo e suave (sem raios). */
export const Sun: React.FC<{ x: number; y: number; r?: number; intensity?: number; color?: string }> = ({
  x,
  y,
  r = 70,
  intensity = 1,
  color = "#ffe2a8",
}) => {
  const id = useSvgId("sun");
  const id2 = useSvgId("sunCore");
  return (
    <>
      <defs>
        <radialGradient id={id}>
          <stop offset="0" stopColor={color} stopOpacity={0.75 * intensity} />
          <stop offset="0.25" stopColor="#f6bf74" stopOpacity={0.35 * intensity} />
          <stop offset="1" stopColor="#f0a85a" stopOpacity={0} />
        </radialGradient>
        <radialGradient id={id2}>
          <stop offset="0" stopColor="#fff6e2" stopOpacity={intensity} />
          <stop offset="0.7" stopColor="#ffe6b5" stopOpacity={0.9 * intensity} />
          <stop offset="1" stopColor="#ffd590" stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r * 11} fill={`url(#${id})`} />
      <circle cx={x} cy={y} r={r} fill={`url(#${id2})`} />
    </>
  );
};

/** Nuvens: elipses suaves que derivam devagar. */
export const Clouds: React.FC<{
  frame: number;
  seed: number;
  count?: number;
  y: [number, number];
  color: string;
  opacity?: number;
  speed?: number;
  blur?: number;
  shade?: string;
}> = ({ frame, seed, count = 7, y, color, opacity = 0.6, speed = 0.25, blur = 18, shade }) => {
  const id = useSvgId("cloudBlur");
  const clouds = useMemo(
    () =>
      new Array(count).fill(0).map((_, i) => ({
        x: random(`c${seed}${i}x`) * (WIDTH + 800) - 400,
        y: y[0] + random(`c${seed}${i}y`) * (y[1] - y[0]),
        w: 260 + random(`c${seed}${i}w`) * 420,
        h: 40 + random(`c${seed}${i}h`) * 70,
        s: 0.6 + random(`c${seed}${i}s`) * 0.8,
      })),
    [count, seed, y],
  );
  return (
    <>
      <defs>
        <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={blur} />
        </filter>
      </defs>
      <g filter={`url(#${id})`} opacity={opacity}>
        {clouds.map((c, i) => {
          const span = WIDTH + 1200;
          const x = ((((c.x + frame * speed * c.s + 600) % span) + span) % span) - 600;
          return (
            <g key={i}>
              {shade && <ellipse cx={x + 20} cy={c.y + c.h * 0.35} rx={c.w * 0.5} ry={c.h * 0.55} fill={shade} />}
              <ellipse cx={x} cy={c.y} rx={c.w * 0.5} ry={c.h * 0.5} fill={color} />
              <ellipse cx={x - c.w * 0.22} cy={c.y - c.h * 0.25} rx={c.w * 0.26} ry={c.h * 0.45} fill={color} />
              <ellipse cx={x + c.w * 0.18} cy={c.y - c.h * 0.18} rx={c.w * 0.3} ry={c.h * 0.5} fill={color} />
            </g>
          );
        })}
      </g>
    </>
  );
};

/** Gera o contorno de uma cordilheira/colina a partir de senos sobrepostos. */
export const ridgePath = (baseY: number, amp: number, seed: number, freq = 0.004, bottom = HEIGHT + 600) => {
  const pts: string[] = [];
  for (let x = -500; x <= WIDTH + 500; x += 14) {
    const y =
      baseY -
      amp *
        (0.55 * Math.sin(x * freq + seed) +
          0.3 * Math.sin(x * freq * 2.3 + seed * 1.7) +
          0.15 * Math.sin(x * freq * 5.1 + seed * 3.1));
    pts.push(`${x},${y.toFixed(1)}`);
  }
  return `M-500,${bottom} L${pts.join(" L")} L${WIDTH + 500},${bottom} Z`;
};

/** Colina com leve degradê vertical (topo iluminado, base mais escura). */
export const Hill: React.FC<{
  baseY: number;
  amp: number;
  seed: number;
  freq?: number;
  top: string;
  bottom: string;
  rim?: string;
}> = ({ baseY, amp, seed, freq, top, bottom, rim }) => {
  const id = useSvgId("hill");
  const d = ridgePath(baseY, amp, seed, freq);
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
      </defs>
      <g>
        {rim && <path d={d} fill="none" stroke={rim} strokeWidth={3} opacity={0.55} transform="translate(0 -1.5)" />}
        <path d={d} fill={`url(#${id})`} />
      </g>
    </>
  );
};

/** Faixa de névoa/atmosfera horizontal. */
export const Haze: React.FC<{ y: number; height: number; color: string; opacity?: number }> = ({
  y,
  height,
  color,
  opacity = 0.6,
}) => {
  const id = useSvgId("haze");
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity={0} />
          <stop offset="0.5" stopColor={color} stopOpacity={opacity} />
          <stop offset="1" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={-400} y={y - height / 2} width={WIDTH + 800} height={height} fill={`url(#${id})`} />
    </>
  );
};

/** Capim em primeiro plano, balançando com o vento. */
export const Grass: React.FC<{
  frame: number;
  seed: number;
  y: number;
  count?: number;
  height?: [number, number];
  color: string;
  rim?: string;
  wind?: number;
  spread?: number;
}> = ({ frame, seed, y, count = 140, height = [60, 180], color, rim, wind = 1, spread = 60 }) => {
  const blades = useMemo(
    () =>
      new Array(count).fill(0).map((_, i) => ({
        x: random(`g${seed}${i}x`) * (WIDTH + 200) - 100,
        y: y + random(`g${seed}${i}y`) * spread,
        h: height[0] + random(`g${seed}${i}h`) * (height[1] - height[0]),
        w: 2.5 + random(`g${seed}${i}w`) * 4,
        lean: (random(`g${seed}${i}l`) - 0.5) * 50,
        ph: random(`g${seed}${i}p`) * Math.PI * 2,
      })),
    [count, seed, y, height, spread],
  );
  return (
    <g>
      {blades.map((b, i) => {
        const sway = Math.sin(frame / 38 + b.ph + b.x * 0.004) * 9 * wind + Math.sin(frame / 17 + b.ph) * 2 * wind;
        const tipX = b.x + b.lean + sway;
        const tipY = b.y - b.h;
        const cx = b.x + (b.lean + sway) * 0.35;
        const cy = b.y - b.h * 0.55;
        const d = `M${b.x - b.w},${b.y} Q${cx},${cy} ${tipX},${tipY} Q${cx + b.w * 0.3},${cy} ${b.x + b.w},${b.y} Z`;
        return (
          <g key={i}>
            {rim && <path d={d} fill={rim} opacity={0.5} transform="translate(1.5 -2)" />}
            <path d={d} fill={color} />
          </g>
        );
      })}
    </g>
  );
};

/** Partículas de pólen/poeira suspensas na luz (bem discretas). */
export const Motes: React.FC<{
  frame: number;
  seed: number;
  count?: number;
  area?: [number, number, number, number];
  color?: string;
  opacity?: number;
}> = ({ frame, seed, count = 40, area = [0, 300, WIDTH, 1300], color = "#ffe4b0", opacity = 0.55 }) => {
  const motes = useMemo(
    () =>
      new Array(count).fill(0).map((_, i) => ({
        x: area[0] + random(`m${seed}${i}x`) * (area[2] - area[0]),
        y: area[1] + random(`m${seed}${i}y`) * (area[3] - area[1]),
        r: 1.2 + random(`m${seed}${i}r`) * 3.2,
        ph: random(`m${seed}${i}p`) * 100,
        sp: 0.2 + random(`m${seed}${i}s`) * 0.5,
      })),
    [count, seed, area],
  );
  return (
    <g>
      {motes.map((m, i) => {
        const x = m.x + Math.sin((frame + m.ph) / 50) * 24 + frame * m.sp * 0.4;
        const y = m.y + Math.cos((frame + m.ph) / 70) * 18 - frame * m.sp * 0.25;
        const tw = 0.5 + 0.5 * Math.sin((frame + m.ph * 3) / 23);
        return <circle key={i} cx={x} cy={y} r={m.r} fill={color} opacity={opacity * (0.35 + 0.65 * tw)} />;
      })}
    </g>
  );
};
