import React from "react";
import { AbsoluteFill } from "remotion";
import { HEIGHT, WIDTH } from "../config";

/**
 * Uma camada de profundidade. Cada camada é um SVG 1080×1920 independente,
 * para que possamos mover (parallax) e desfocar (profundidade de campo) separadamente.
 */
export const Layer: React.FC<{
  children: React.ReactNode;
  /** Deslocamento em px (parallax). */
  x?: number;
  y?: number;
  scale?: number;
  /** Desfoque em px (profundidade de campo). */
  blur?: number;
  opacity?: number;
  origin?: string;
  blend?: React.CSSProperties["mixBlendMode"];
}> = ({ children, x = 0, y = 0, scale = 1, blur = 0, opacity = 1, origin = "50% 60%", blend }) => (
  <AbsoluteFill
    style={{
      transform: `translate(${x}px, ${y}px) scale(${scale})`,
      transformOrigin: origin,
      filter: blur > 0 ? `blur(${blur}px)` : undefined,
      opacity,
      mixBlendMode: blend,
    }}
  >
    <svg
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      style={{ overflow: "visible", position: "absolute", inset: 0 }}
    >
      {children}
    </svg>
  </AbsoluteFill>
);

/**
 * Câmera: aproximação lenta e deriva sutil aplicadas a toda a cena.
 * `push` é o zoom total ao longo de `durationInFrames`.
 */
export const Camera: React.FC<{
  children: React.ReactNode;
  frame: number;
  durationInFrames: number;
  push?: number;
  startScale?: number;
  panX?: number;
  panY?: number;
  origin?: string;
}> = ({ children, frame, durationInFrames, push = 0.08, startScale = 1.04, panX = 0, panY = 0, origin = "50% 55%" }) => {
  const t = Math.min(1, Math.max(0, frame / durationInFrames));
  // easeInOut sinusoidal: começa e termina sem trancos
  const e = 0.5 - Math.cos(Math.PI * t) / 2;
  const s = startScale + push * e;
  const breathe = Math.sin(frame / 55) * 2.2;
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${panX * e}px, ${panY * e + breathe}px) scale(${s})`,
        transformOrigin: origin,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
