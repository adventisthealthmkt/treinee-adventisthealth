import React from "react";
import { AbsoluteFill } from "remotion";
import { Layer } from "./Layer";
import { Clouds, Grass, Haze, Hill, Motes, PALETTE, Sky, Sun } from "./nature";
import { lerp } from "../lib/motion";

/**
 * Campo de Belém ao entardecer, em camadas com parallax.
 * `t` (0..1) é o progresso da câmera; `dusk` (0..1) escurece e esquenta a luz.
 * `children` é desenhado no plano médio (personagens).
 */
export const Field: React.FC<{
  frame: number;
  t: number;
  dusk?: number;
  sunX?: number;
  sunY?: number;
  horizonY?: number;
  children?: React.ReactNode;
  foreground?: boolean;
}> = ({ frame, t, dusk = 0, sunX = 700, sunY = 930, horizonY = 1010, children, foreground = true }) => {
  const sky: [string, string, string, string] = [
    mix("#3b2a22", "#24170f", dusk),
    mix("#8a5d3c", "#6b3f25", dusk),
    mix("#e0a865", "#d98a48", dusk),
    mix("#f6d29a", "#f2b06a", dusk),
  ];
  const sunI = 1 - dusk * 0.45;
  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.night }}>
      <Layer x={-t * 10}>
        <Sky stops={sky} horizon={horizonY / 1920} />
        <Clouds frame={frame} seed={1} y={[260, 640]} color="#f3c88c" shade="#9a6a48" opacity={0.42} speed={0.18} />
        <Sun x={sunX} y={sunY} r={64} intensity={sunI} />
      </Layer>
      <Layer x={-t * 22}>
        <Hill baseY={horizonY - 10} amp={46} seed={2.1} freq={0.003} top={mix("#c99a6c", "#b47d50", dusk)} bottom="#a07650" />
        <Haze y={horizonY + 10} height={160} color="#f4cf98" opacity={0.6} />
        <Hill baseY={horizonY + 70} amp={60} seed={5.3} freq={0.0042} top="#94683f" bottom="#6d4a2e" rim={PALETTE.rim} />
        <Haze y={horizonY + 90} height={120} color="#e9b97d" opacity={0.35} />
      </Layer>
      <Layer x={-t * 36}>
        <Hill baseY={horizonY + 190} amp={44} seed={8.7} freq={0.0035} top="#6e4b2d" bottom="#3e2a1a" rim={PALETTE.rim} />
        <Grass frame={frame} seed={11} y={horizonY + 200} count={120} height={[14, 36]} color="#4d351f" rim="#d8a764" wind={0.5} spread={200} />
      </Layer>
      <Layer x={-t * 56}>
        <Hill baseY={horizonY + 330} amp={30} seed={3.9} freq={0.0028} top="#4a3220" bottom="#22160d" rim="#e7b673" />
        <Grass frame={frame} seed={12} y={horizonY + 330} count={160} height={[30, 80]} color="#3a2817" rim="#e3b06c" wind={0.7} spread={500} />
        {children}
      </Layer>
      <Layer x={-t * 40}>
        <Motes frame={frame} seed={4} count={36} area={[0, 500, 1080, 1500]} opacity={0.45} />
      </Layer>
      {foreground && (
        <Layer x={-t * 120} blur={7}>
          <Grass frame={frame} seed={13} y={1900} count={70} height={[160, 380]} color="#1f140c" rim="#c48d4c" wind={1.2} spread={60} />
        </Layer>
      )}
    </AbsoluteFill>
  );
};

/** Mistura duas cores hex. */
export const mix = (a: string, b: string, t: number) => {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const c = [16, 8, 0].map((s) => Math.round(lerp((pa >> s) & 255, (pb >> s) & 255, Math.min(1, Math.max(0, t)))));
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};
