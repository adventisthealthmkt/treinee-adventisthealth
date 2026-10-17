import narration from "./data/narration.json";
import timing from "./data/narration-timing.json";

export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;

/** Duração das dissolvências entre cenas (em frames). */
export const TRANSITION = 30;

/**
 * Áreas seguras do Instagram Reels (px em 1080×1920).
 * Topo: nome/ícones. Base: legenda do post, botões e áudio. Direita: curtir/comentar/compartilhar.
 */
export const SAFE = { top: 250, bottom: 440, left: 90, right: 150 };

/**
 * Margem lateral dos textos. É simétrica para que o texto fique centralizado no quadro;
 * 120 px de cada lado já mantém o texto longe da coluna de ícones à direita.
 */
export const TEXT_MARGIN = 120;

export type SceneId = "cena-1" | "cena-2" | "cena-3" | "cena-4" | "cena-5" | "cena-6";

export type SceneConfig = {
  id: SceneId;
  /** Duração da cena em frames (inclui a dissolvência de saída). */
  duration: number;
  /** Em que segundo (relativo ao início da cena) a narração começa. */
  narrationAt: number;
};

/**
 * Timeline. Total = soma das durações − 5 dissolvências.
 * 225 + 375 + 375 + 465 + 450 + 510 − 5×30 = 2250 frames = 75 s.
 */
export const SCENES: SceneConfig[] = [
  { id: "cena-1", duration: 225, narrationAt: 1.0 },
  { id: "cena-2", duration: 375, narrationAt: 0.9 },
  { id: "cena-3", duration: 375, narrationAt: 1.2 },
  { id: "cena-4", duration: 465, narrationAt: 0.8 },
  { id: "cena-5", duration: 450, narrationAt: 1.0 },
  { id: "cena-6", duration: 510, narrationAt: 1.4 },
];

export const TOTAL_FRAMES =
  SCENES.reduce((acc, s) => acc + s.duration, 0) - TRANSITION * (SCENES.length - 1);

/** Frame global em que cada cena começa. */
export const sceneStart = (id: SceneId): number => {
  let start = 0;
  for (const s of SCENES) {
    if (s.id === id) return start;
    start += s.duration - TRANSITION;
  }
  throw new Error(`Cena desconhecida: ${id}`);
};

export const sceneConfig = (id: SceneId): SceneConfig => {
  const s = SCENES.find((x) => x.id === id);
  if (!s) throw new Error(`Cena desconhecida: ${id}`);
  return s;
};

export type Chunk = {
  text: string;
  emphasis: string[];
  /** Segundos relativos ao início da CENA (já somado narrationAt). */
  start: number;
  end: number;
};

type TimingFile = Record<string, { duration: number; chunks: { start: number; end: number }[] }>;

/** Blocos de legenda de uma cena, já posicionados no tempo da cena. */
export const sceneChunks = (id: SceneId): Chunk[] => {
  const script = narration.scenes.find((s) => s.id === id);
  const t = (timing as TimingFile)[id];
  if (!script || !t) return [];
  const offset = sceneConfig(id).narrationAt;
  return script.chunks.map((c, i) => ({
    text: c.text,
    emphasis: (c as { emphasis?: string[] }).emphasis ?? [],
    start: offset + t.chunks[i].start,
    end: offset + t.chunks[i].end,
  }));
};

export const sceneShowsCaptions = (id: SceneId): boolean =>
  narration.scenes.find((s) => s.id === id)?.showCaptions !== false;

/** Fim da narração da cena, em segundos relativos à cena. */
export const narrationEnd = (id: SceneId): number => {
  const chunks = sceneChunks(id);
  return chunks.length ? chunks[chunks.length - 1].end : 0;
};

/** Intervalos (em frames globais) em que há narração — usados para abaixar a trilha. */
export const narrationWindows = (): [number, number][] =>
  SCENES.flatMap((s) =>
    sceneChunks(s.id).map(
      (c) => [sceneStart(s.id) + c.start * FPS, sceneStart(s.id) + c.end * FPS] as [number, number],
    ),
  );
