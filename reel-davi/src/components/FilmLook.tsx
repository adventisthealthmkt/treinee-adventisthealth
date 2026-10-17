import React from "react";
import { AbsoluteFill, Img, random, staticFile, useCurrentFrame } from "remotion";

/**
 * Acabamento de cinema aplicado sobre o vídeo inteiro:
 * gradação quente, vinheta, vazamento de luz discreto e grão de filme.
 */
export const FilmLook: React.FC<{ warmth?: number }> = ({ warmth = 1 }) => {
  const frame = useCurrentFrame();
  // grão muda a cada 2 frames (cadência de película)
  const g = Math.floor(frame / 2);
  const gx = Math.floor(random(`gx${g}`) * 512);
  const gy = Math.floor(random(`gy${g}`) * 512);
  const leak = 0.1 + 0.05 * Math.sin(frame / 90);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* gradação: sombras marrom-terra, altas luzes douradas */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, rgba(64,40,20,0.18) 0%, rgba(214,160,90,0.10) 55%, rgba(40,24,12,0.25) 100%)",
          mixBlendMode: "soft-light",
          opacity: warmth,
        }}
      />
      {/* vazamento de luz quente, muito sutil */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 45% at ${78 + 6 * Math.sin(frame / 140)}% 18%, rgba(255,196,120,${leak}) 0%, rgba(255,196,120,0) 70%)`,
          mixBlendMode: "screen",
        }}
      />
      {/* vinheta */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 85% 70% at 50% 48%, rgba(0,0,0,0) 55%, rgba(14,9,6,0.55) 100%)",
        }}
      />
      {/* grão */}
      <AbsoluteFill style={{ opacity: 0.085, mixBlendMode: "overlay" }}>
        <Img
          src={staticFile("images/grain.png")}
          style={{
            position: "absolute",
            width: 2048,
            height: 2560,
            left: -gx,
            top: -gy,
            objectFit: "none",
            imageRendering: "pixelated",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
