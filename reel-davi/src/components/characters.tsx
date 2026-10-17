import React, { useMemo } from "react";
import { random } from "remotion";
import { PALETTE, useSvgId } from "./nature";

/**
 * Desenha a mesma forma duas vezes: primeiro na cor da luz de recorte,
 * deslocada na direção da luz e desfocada; depois a silhueta por cima.
 * O resultado é um contorno luminoso de contraluz, como no fim de tarde.
 */
export const RimLit: React.FC<{
  rim: string;
  fill: string;
  dx?: number;
  dy?: number;
  glow?: number;
  rimOpacity?: number;
  children: (fill: string) => React.ReactNode;
}> = ({ rim, fill, dx = 0, dy = -3, glow = 2.2, rimOpacity = 0.95, children }) => {
  const id = useSvgId("rimBlur");
  return (
    <>
      <defs>
        <filter id={id} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={glow} />
        </filter>
      </defs>
      <g transform={`translate(${dx} ${dy})`} filter={`url(#${id})`} opacity={rimOpacity}>
        {children(rim)}
      </g>
      <g>{children(fill)}</g>
    </>
  );
};

/** Cabelo cacheado: círculo com pequenos volumes na borda superior. */
const CurlyHead: React.FC<{ cx: number; cy: number; r: number; fill: string; seed: number }> = ({
  cx,
  cy,
  r,
  fill,
  seed,
}) => {
  const curls = useMemo(
    () =>
      new Array(13).fill(0).map((_, i) => {
        const a = Math.PI * (1.02 + (i / 12) * 0.96);
        return { a, rr: r * (0.3 + random(`h${seed}${i}`) * 0.12) };
      }),
    [r, seed],
  );
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={fill} />
      {curls.map((c, i) => (
        <circle key={i} cx={cx + Math.cos(c.a) * r * 0.92} cy={cy + Math.sin(c.a) * r * 0.92} r={c.rr} fill={fill} />
      ))}
    </g>
  );
};

/** Jovem pastor sentado no chão, visto de costas. Origem: centro da base. */
export const ShepherdSeated: React.FC<{
  frame: number;
  x: number;
  y: number;
  scale?: number;
  rim?: string;
  fill?: string;
  /** "ancient" = túnica, cabelo cacheado e cajado; "modern" = blusa e cabelo curto. */
  variant?: "ancient" | "modern";
  showStaff?: boolean;
}> = ({ frame, x, y, scale = 1, rim = PALETTE.rim, fill = "#2b1f16", variant = "ancient", showStaff = true }) => {
  const breathe = 1 + Math.sin(frame / 42) * 0.006;
  const headTilt = Math.sin(frame / 120) * 1.6;
  const body =
    "M-160,0 C-166,-90 -142,-196 -112,-243 C-96,-268 -62,-284 -28,-290 L28,-290 C62,-284 96,-268 112,-243 C142,-196 166,-90 160,0 Z";
  const modernBody =
    "M-150,0 C-156,-90 -140,-200 -116,-246 C-100,-272 -62,-286 -26,-292 L26,-292 C62,-286 100,-272 116,-246 C140,-200 156,-90 150,0 Z";
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {showStaff && variant === "ancient" && (
        <RimLit rim={rim} fill="#24180f" dx={-2} dy={-2}>
          {(f) => <line x1={178} y1={30} x2={236} y2={-430} stroke={f} strokeWidth={10} strokeLinecap="round" />}
        </RimLit>
      )}
      <g transform={`scale(1 ${breathe})`}>
        <RimLit rim={rim} fill={fill}>
          {(f) => (
            <g>
              <path d={variant === "ancient" ? body : modernBody} fill={f} />
              <rect x={-21} y={-312} width={42} height={30} rx={10} fill={f} />
              <g transform={`rotate(${headTilt} 0 -300)`}>
                {variant === "ancient" ? (
                  <CurlyHead cx={0} cy={-344} r={48} fill={f} seed={3} />
                ) : (
                  <path d="M-44,-338 C-46,-380 -26,-398 0,-398 C28,-398 46,-380 44,-338 C44,-314 26,-298 0,-298 C-26,-298 -44,-314 -44,-338 Z" fill={f} />
                )}
                <ellipse cx={-46} cy={-332} rx={7} ry={12} fill={f} />
                <ellipse cx={46} cy={-332} rx={7} ry={12} fill={f} />
              </g>
            </g>
          )}
        </RimLit>
        {/* dobras do tecido e alça da bolsa, sutis */}
        <g opacity={0.5} fill="none" stroke="#1b130d" strokeWidth={5} strokeLinecap="round">
          <path d="M-62,-232 Q-74,-120 -94,-6" />
          <path d="M44,-240 Q60,-120 76,-6" />
          <path d="M-8,-250 Q-2,-140 -14,-10" opacity={0.6} />
        </g>
        {variant === "ancient" && (
          <path d="M84,-262 L104,-244 L-122,-46 L-140,-64 Z" fill="#4a3424" opacity={0.75} />
        )}
        {/* luz quente refletida no ombro voltado ao sol */}
        <path d="M60,-282 C96,-268 116,-240 128,-200" stroke={rim} strokeWidth={4} fill="none" opacity={0.35} />
      </g>
    </g>
  );
};

/** Pessoa em pé ou caminhando, vista de costas. Origem: entre os pés. */
export const Walker: React.FC<{
  frame: number;
  x: number;
  y: number;
  scale?: number;
  walking?: boolean;
  /** Ciclo de passos (frames por passada completa). */
  cycle?: number;
  rim?: string;
  fill?: string;
  variant?: "ancient" | "modern";
  staff?: boolean;
  /** 0..1 — para a animação "levantar-se" (0 = agachado, 1 = em pé). */
  rise?: number;
}> = ({
  frame,
  x,
  y,
  scale = 1,
  walking = true,
  cycle = 34,
  rim = PALETTE.rim,
  fill = "#2a1e15",
  variant = "ancient",
  staff = true,
  rise = 1,
}) => {
  const ph = walking ? (frame / cycle) * Math.PI * 2 : 0;
  const bob = walking ? -Math.abs(Math.sin(ph)) * 6 : Math.sin(frame / 45) * 1.5;
  const legL = walking ? Math.max(0, Math.sin(ph)) : 0;
  const legR = walking ? Math.max(0, Math.sin(ph + Math.PI)) : 0;
  const sway = walking ? Math.sin(ph) * 4 : 0;
  const armSwing = walking ? Math.sin(ph) * 7 : 0;
  const crouch = 1 - rise;
  const hemY = variant === "ancient" ? -118 : -236;
  return (
    <g transform={`translate(${x} ${y + bob + crouch * 120}) scale(${scale})`}>
      <g transform={`scale(1 ${1 - crouch * 0.3})`}>
        {staff && variant === "ancient" && (
          <RimLit rim={rim} fill="#24180f" dx={-2} dy={-2}>
            {(f) => (
              <line
                x1={112 + armSwing * 1.4}
                y1={-6 - legR * 10}
                x2={128 + armSwing * 0.6}
                y2={-600}
                stroke={f}
                strokeWidth={9}
                strokeLinecap="round"
              />
            )}
          </RimLit>
        )}
        <RimLit rim={rim} fill={fill} dy={-3}>
          {(f) => (
            <g>
              {/* pernas: a perna que sobe "encurta" vista de costas */}
              <rect x={-44 + sway * 0.4} y={-170 + legL * 20} width={36} height={170 - legL * 22} rx={14} fill={f} />
              <rect x={8 + sway * 0.4} y={-170 + legR * 20} width={36} height={170 - legR * 22} rx={14} fill={f} />
              <ellipse cx={-26 + sway * 0.4} cy={-2 - legL * 22} rx={24} ry={10} fill={f} />
              <ellipse cx={26 + sway * 0.4} cy={-2 - legR * 22} rx={24} ry={10} fill={f} />
              {/* braços */}
              <path
                d={`M-86,-430 Q${-108 - armSwing},-330 ${-100 - armSwing},-250 L${-78 - armSwing},-246 Q${-80 - armSwing * 0.5},-330 -60,-420 Z`}
                fill={f}
              />
              <path d={`M86,-430 Q114,-340 ${108 + armSwing},-262 L${88 + armSwing},-256 Q86,-330 60,-420 Z`} fill={f} />
              {/* tronco / túnica */}
              {variant === "ancient" ? (
                <path
                  d={`M-90,-428 C-70,-450 -30,-456 0,-456 C30,-456 70,-450 90,-428 L${100 + sway},${hemY} Q0,${hemY + 14} ${-100 + sway},${hemY} Z`}
                  fill={f}
                />
              ) : (
                <>
                  <path
                    d={`M-92,-428 C-72,-452 -30,-458 0,-458 C30,-458 72,-452 92,-428 L${86 + sway * 0.5},${hemY} Q0,${hemY + 8} ${-86 + sway * 0.5},${hemY} Z`}
                    fill={f}
                  />
                  <rect x={-58} y={hemY - 10} width={116} height={78} rx={10} fill={f} />
                </>
              )}
              <rect x={-18} y={-474} width={36} height={28} rx={10} fill={f} />
              {variant === "ancient" ? (
                <CurlyHead cx={0} cy={-506} r={42} fill={f} seed={9} />
              ) : (
                <path d="M-39,-500 C-41,-536 -22,-552 0,-552 C24,-552 41,-536 39,-500 C39,-480 22,-466 0,-466 C-22,-466 -39,-480 -39,-500 Z" fill={f} />
              )}
            </g>
          )}
        </RimLit>
        {variant === "ancient" && (
          <path d="M70,-436 L88,-420 L-76,-176 L-92,-192 Z" fill="#46311f" opacity={0.7} />
        )}
      </g>
    </g>
  );
};

/** Figura em pé no interior da casa (contraluz da porta). Origem: pés. */
export const Figure: React.FC<{
  frame: number;
  x: number;
  y: number;
  h?: number;
  fill?: string;
  rim?: string;
  headcloth?: boolean;
  elder?: boolean;
  seed: number;
}> = ({ frame, x, y, h = 1, fill = "#1c130d", rim = "#f2c27a", headcloth = true, elder = false, seed }) => {
  const sway = Math.sin(frame / (60 + seed * 7) + seed) * 1.2;
  return (
    <g transform={`translate(${x} ${y}) scale(${h}) rotate(${sway + (elder ? -4 : 0)} 0 0)`}>
      <RimLit rim={rim} fill={fill} dx={-3} dy={-2} glow={2.6}>
        {(f) => (
          <g>
            <path d="M-82,0 L-74,-250 C-72,-300 -56,-318 -26,-326 L26,-326 C56,-318 72,-300 74,-250 L82,0 Z" fill={f} />
            <path d="M-74,-250 Q-92,-150 -86,-40 L-70,-40 Q-74,-150 -60,-240 Z" fill={f} />
            <path d="M74,-250 Q92,-150 86,-40 L70,-40 Q74,-150 60,-240 Z" fill={f} />
            <rect x={-14} y={-346} width={28} height={30} rx={8} fill={f} />
            <ellipse cx={0} cy={-378} rx={30} ry={36} fill={f} />
            {headcloth && <path d="M-36,-392 C-36,-430 36,-430 36,-392 L46,-318 Q0,-304 -46,-318 Z" fill={f} />}
            {elder && (
              <>
                <path d="M-22,-360 Q0,-290 22,-360 Z" fill={f} />
                {/* chifre de azeite nas mãos */}
                <path d="M-40,-232 C-10,-262 30,-262 52,-226 L44,-216 C28,-240 0,-242 -32,-222 Z" fill={f} />
              </>
            )}
          </g>
        )}
      </RimLit>
    </g>
  );
};

/** Ovelha em silhueta com lã iluminada por trás. Origem: base das patas. */
export const Sheep: React.FC<{
  frame: number;
  x: number;
  y: number;
  scale?: number;
  dir?: 1 | -1;
  seed: number;
  rim?: string;
  fill?: string;
  wool?: string;
  /** desloca-se lentamente (px por frame). */
  walk?: number;
}> = ({ frame, x, y, scale = 1, dir = 1, seed, rim = PALETTE.rim, fill = "#3a2b1f", wool = "#6b5440", walk = 0 }) => {
  const graze = (Math.sin(frame / (48 + seed * 3) + seed * 2) + 1) / 2; // 0 = cabeça levantada, 1 = pastando
  const headRot = 10 + graze * 34;
  const woolBumps = useMemo(
    () =>
      new Array(9).fill(0).map((_, i) => ({
        x: -46 + i * 11.5 + (random(`s${seed}${i}`) - 0.5) * 6,
        y: -82 + Math.sin((i / 8) * Math.PI) * -12 + (random(`sy${seed}${i}`) - 0.5) * 6,
        r: 15 + random(`sr${seed}${i}`) * 7,
      })),
    [seed],
  );
  const step = walk ? Math.sin(frame / 7 + seed) * 3 : 0;
  const id = useSvgId("wool");
  return (
    <g transform={`translate(${x + frame * walk * dir} ${y}) scale(${scale * dir} ${scale})`}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={wool} />
          <stop offset="1" stopColor={fill} />
        </linearGradient>
      </defs>
      {/* patas */}
      {[-34, -16, 22, 38].map((lx, i) => (
        <rect key={i} x={lx + (i % 2 ? step : -step)} y={-40} width={8} height={40} rx={3} fill="#1f160f" />
      ))}
      <RimLit rim={rim} fill={`url(#${id})`} dy={-3} glow={2}>
        {(f) => (
          <g>
            <ellipse cx={0} cy={-62} rx={60} ry={34} fill={f} />
            {woolBumps.map((b, i) => (
              <circle key={i} cx={b.x} cy={b.y} r={b.r} fill={f} />
            ))}
          </g>
        )}
      </RimLit>
      {/* cabeça */}
      <g transform={`rotate(${headRot} 52 -70)`}>
        <RimLit rim={rim} fill="#241a12" dy={-2} glow={1.6}>
          {(f) => (
            <g>
              <ellipse cx={74} cy={-74} rx={22} ry={13} fill={f} transform="rotate(18 74 -74)" />
              <ellipse cx={60} cy={-86} rx={10} ry={5} fill={f} transform="rotate(-30 60 -86)" />
            </g>
          )}
        </RimLit>
      </g>
    </g>
  );
};
