import { Easing, interpolate } from "remotion";

/** Curva suave padrão (sem acelerações bruscas). */
export const ease = Easing.bezier(0.45, 0, 0.25, 1);

/** 0→1 entre dois frames, com easing e clamp. */
export const progress = (frame: number, from: number, to: number, easing = ease) =>
  interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** Fade in/out: sobe em [a,b], desce em [c,d]. */
export const fadeWindow = (frame: number, a: number, b: number, c: number, d: number) =>
  Math.min(progress(frame, a, b), 1 - progress(frame, c, d));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Ruído suave determinístico (soma de senos) para movimentos orgânicos. */
export const drift = (t: number, seed: number) =>
  Math.sin(t * 0.9 + seed) * 0.6 + Math.sin(t * 0.37 + seed * 2.1) * 0.4;
