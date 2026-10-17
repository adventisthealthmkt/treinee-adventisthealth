import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { PHOTOS } from "../data/visuals";

/**
 * Um plano: usa a foto/vídeo licenciado configurado em data/visuals.ts, se houver;
 * caso contrário, renderiza a ilustração em código.
 */
export const Shot: React.FC<{
  id: string;
  children: React.ReactNode;
  /** Zoom de Ken Burns para fotos. */
  zoom?: [number, number];
  pan?: [number, number];
}> = ({ id, children, zoom = [1.06, 1.16], pan = [0, -30] }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const src = PHOTOS[id];
  if (!src) return <AbsoluteFill>{children}</AbsoluteFill>;
  const t = Math.min(1, frame / durationInFrames);
  const e = 0.5 - Math.cos(Math.PI * t) / 2;
  const style: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: `translate(${pan[0] * e}px, ${pan[1] * e}px) scale(${zoom[0] + (zoom[1] - zoom[0]) * e})`,
  };
  const isVideo = /\.(mp4|webm|mov)$/i.test(src);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#1a120c" }}>
      {isVideo ? <OffthreadVideo src={staticFile(src)} muted style={style} /> : <Img src={staticFile(src)} style={style} />}
    </AbsoluteFill>
  );
};

/** Dissolvência entre dois planos dentro de uma mesma cena. */
export const Dissolve: React.FC<{
  at: number;
  length?: number;
  a: React.ReactNode;
  b: React.ReactNode;
}> = ({ at, length = 24, a, b }) => {
  const frame = useCurrentFrame();
  const t = Math.min(1, Math.max(0, (frame - at) / length));
  const o = 0.5 - Math.cos(Math.PI * t) / 2;
  return (
    <AbsoluteFill>
      {o < 1 && <AbsoluteFill>{a}</AbsoluteFill>}
      {o > 0 && <AbsoluteFill style={{ opacity: o }}>{b}</AbsoluteFill>}
    </AbsoluteFill>
  );
};
