import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/fonts";
import { Chunk, FPS, SAFE, TEXT_MARGIN, WIDTH } from "../config";
import { progress } from "../lib/motion";
import { PALETTE } from "./nature";

// Fontes embutidas em public/fonts (licença OFL) — o render não depende de internet.
export const SERIF = "Cormorant Garamond";
export const SANS = "Inter";
const FONTS = [
  { family: SERIF, file: "cormorant-garamond-latin-500-normal.woff2", weight: "500", style: "normal" },
  { family: SERIF, file: "cormorant-garamond-latin-600-normal.woff2", weight: "600", style: "normal" },
  { family: SERIF, file: "cormorant-garamond-latin-500-italic.woff2", weight: "500", style: "italic" },
  { family: SANS, file: "inter-latin-500-normal.woff2", weight: "500", style: "normal" },
  { family: SANS, file: "inter-latin-600-normal.woff2", weight: "600", style: "normal" },
];
for (const f of FONTS) {
  loadFont({ family: f.family, url: staticFile(`fonts/${f.file}`), weight: f.weight, style: f.style });
}

const normalize = (w: string) =>
  w
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");

/** Índices das palavras que pertencem a alguma expressão destacada. */
const emphasisIndices = (words: string[], emphasis: string[]) => {
  const set = new Set<number>();
  const norm = words.map(normalize);
  for (const phrase of emphasis) {
    const p = phrase.split(/\s+/).map(normalize);
    for (let i = 0; i + p.length <= norm.length; i++) {
      if (p.every((w, j) => norm[i + j] === w)) p.forEach((_, j) => set.add(i + j));
    }
  }
  return set;
};

/** Momento (s) em que cada palavra começa, proporcional ao comprimento das palavras. */
const wordTimes = (words: string[], start: number, end: number) => {
  const weights = words.map((w) => w.replace(/[^\p{L}\p{N}]/gu, "").length + 2);
  const total = weights.reduce((a, b) => a + b, 0);
  let acc = 0;
  return weights.map((w) => {
    const t = start + (acc / total) * (end - start) * 0.92;
    acc += w;
    return t;
  });
};

const Word: React.FC<{
  word: string;
  appear: number;
  frame: number;
  emphasized: boolean;
  emphasisStyle: React.CSSProperties;
  last: boolean;
}> = ({ word, appear, frame, emphasized, emphasisStyle, last }) => {
  // A frase inteira aparece centralizada em tom apagado; cada palavra acende quando é falada.
  const p = progress(frame, appear * FPS - 2, appear * FPS + 9);
  return (
    <span
      style={{
        display: "inline-block",
        opacity: 0.32 + 0.68 * p,
        transform: `translateY(${(1 - p) * 3}px)`,
        // sem espaço depois da última palavra, para não deslocar o texto do centro
        marginRight: last ? 0 : "0.26em",
        ...(emphasized ? emphasisStyle : null),
      }}
    >
      {word}
    </span>
  );
};

/**
 * Legendas da narração: um bloco curto por vez, palavras surgindo em sincronia.
 * Posicionadas acima da área ocupada pela interface do Instagram.
 */
export const Captions: React.FC<{ chunks: Chunk[]; hideAfter?: number }> = ({ chunks, hideAfter }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const activeIndex = chunks.findIndex((c, i) => {
    const next = chunks[i + 1];
    const until = next ? next.start - 0.05 : c.end + 0.9;
    return t >= c.start - 0.1 && t < until;
  });
  if (activeIndex < 0) return null;
  if (hideAfter !== undefined && t > hideAfter) return null;
  const c = chunks[activeIndex];
  const next = chunks[activeIndex + 1];
  const until = next ? next.start - 0.05 : c.end + 0.9;
  const out = Math.min(
    progress(frame, (c.start - 0.1) * FPS, (c.start + 0.1) * FPS),
    1 - progress(frame, (until - 0.22) * FPS, until * FPS),
  );
  const words = c.text.split(/\s+/);
  const times = wordTimes(words, c.start, c.end);
  const em = emphasisIndices(words, c.emphasis);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* sombra difusa para leitura sobre qualquer imagem */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1180,
          height: 360,
          background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(12,8,5,0.42) 0%, rgba(12,8,5,0) 100%)",
          opacity: out,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: TEXT_MARGIN,
          width: WIDTH - TEXT_MARGIN * 2,
          bottom: SAFE.bottom + 70,
          minHeight: 150,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          textAlign: "center",
          opacity: out,
        }}
      >
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 48,
            lineHeight: 1.32,
            letterSpacing: "0.005em",
            color: PALETTE.cream,
            textShadow: "0 2px 14px rgba(10,6,3,0.7), 0 1px 2px rgba(10,6,3,0.6)",
          }}
        >
          {words.map((w, i) => (
            <Word
              key={i}
              word={w}
              appear={times[i]}
              frame={frame}
              emphasized={em.has(i)}
              emphasisStyle={{ color: PALETTE.gold, fontWeight: 600 }}
              last={i === words.length - 1}
            />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

type HeadlineProps = {
  /** Cada item é uma linha (quebra controlada). */
  lines: string[];
  /** segundos (relativos à cena) */
  from: number;
  to?: number;
  emphasis?: string[];
  /** posição vertical do centro do bloco */
  y?: number;
  size?: number;
  /** atraso entre linhas (s) */
  stagger?: number;
  /** Revelar palavra a palavra sincronizado com estes blocos de narração. */
  syncTo?: Chunk[];
  align?: "center" | "left";
};

/** Texto em destaque, serifado e elegante. */
export const Headline: React.FC<HeadlineProps> = ({
  lines,
  from,
  to,
  emphasis = [],
  y = 760,
  size = 82,
  stagger = 0.7,
  syncTo,
  align = "center",
}) => {
  const frame = useCurrentFrame();
  const out = to === undefined ? 1 : 1 - progress(frame, (to - 0.6) * FPS, to * FPS);
  if (frame < from * FPS - 15 || out <= 0) return null;

  // tempos de cada palavra: sincronizados com a narração ou por linha
  const allWords = lines.flatMap((l, li) => l.split(/\s+/).map((w) => ({ w, li })));
  let times: number[];
  if (syncTo && syncTo.length) {
    const chunkWords = syncTo.map((c) => wordTimes(c.text.split(/\s+/), c.start, c.end)).flat();
    times = allWords.map((_, i) => chunkWords[Math.min(i, chunkWords.length - 1)] ?? from);
  } else {
    times = allWords.map(({ li }) => from + li * stagger);
  }
  const em = emphasisIndices(
    allWords.map((x) => x.w),
    emphasis,
  );

  let k = 0;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: TEXT_MARGIN,
          width: WIDTH - TEXT_MARGIN * 2,
          top: y,
          transform: "translateY(-50%)",
          textAlign: align,
          opacity: out,
          fontFamily: SERIF,
          fontWeight: 500,
          fontSize: size,
          lineHeight: 1.12,
          letterSpacing: "-0.005em",
          color: PALETTE.cream,
          textShadow: "0 3px 24px rgba(10,6,3,0.55), 0 1px 3px rgba(10,6,3,0.45)",
        }}
      >
        {lines.map((line, li) => (
          <div key={li} style={{ marginBottom: "0.08em", whiteSpace: "nowrap" }}>
            {line.split(/\s+/).map((w, wi, lineWords) => {
              const i = k++;
              const appear = times[i];
              const p = progress(frame, appear * FPS - 2, appear * FPS + (syncTo ? 10 : 22));
              // sincronizado com a voz: a frase já aparece inteira e centralizada, apagada
              const base = syncTo ? progress(frame, from * FPS - 12, from * FPS) * 0.28 : 0;
              return (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    opacity: base + (1 - base) * p,
                    transform: `translateY(${(1 - p) * (syncTo ? 4 : 14)}px)`,
                    filter: syncTo ? undefined : `blur(${(1 - p) * 8}px)`,
                    marginRight: wi === lineWords.length - 1 ? 0 : "0.24em",
                    ...(em.has(i) ? { color: PALETTE.gold, fontStyle: "italic" } : null),
                  }}
                >
                  {w}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** Referência bíblica discreta. */
export const Reference: React.FC<{ text: string; from: number; y?: number }> = ({ text, from, y = 1060 }) => {
  const frame = useCurrentFrame();
  const p = progress(frame, from * FPS, from * FPS + 30);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: y,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 30,
          letterSpacing: "0.28em",
          paddingLeft: "0.28em", // compensa o espaçamento após a última letra
          textTransform: "uppercase",
          color: PALETTE.sand,
          opacity: p * 0.9,
        }}
      >
        <div style={{ width: 60, height: 1, background: PALETTE.goldDeep, margin: "0 auto 28px", opacity: 0.8 }} />
        {text}
      </div>
    </AbsoluteFill>
  );
};
