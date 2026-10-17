# Reel — "Ele nem sabia" (1 Samuel 16:1–13)

Reel vertical, cinematográfico e contemplativo, feito com **Remotion + React + TypeScript**.

Tema: *Deus pode estar agindo na nossa vida mesmo quando não conseguimos perceber.*

| | |
|---|---|
| Formato | 1080 × 1920 (9:16), 30 fps, MP4 H.264 + AAC |
| Duração | 75 s (2250 frames) |
| Composições | `DaviReel` (com narração) e `DaviReelSemVoz` (só trilha + legendas) |

---

## Início rápido

```bash
cd reel-davi
npm install
npm run studio          # abre o Remotion Studio para revisar no navegador
npm run preview         # prévia rápida em meia resolução → out/previa-davi-reel.mp4
npm run render          # versão final com narração   → out/davi-reel-voz-guia.mp4
npm run render:sem-voz  # versão final sem narração   → out/davi-reel-sem-voz.mp4
```

> Se o Remotion não conseguir baixar o Chrome headless, aponte para um Chromium já
> instalado: `REMOTION_CHROME=/caminho/do/chrome npm run render`
> (ou `--browser-executable=/caminho` no comando).

---

## Estrutura

```
reel-davi/
├─ public/
│  ├─ audio/
│  │  ├─ trilha.wav              trilha instrumental original (gerada por scripts/generate_music.py)
│  │  └─ narracao/cena-1..6.wav  narração — HOJE É UMA VOZ-GUIA SINTÉTICA (ver abaixo)
│  ├─ fonts/                     Cormorant Garamond + Inter (licença OFL), embutidas
│  └─ images/                    grain.png (grão de filme) + suas fotos/vídeos opcionais
├─ scripts/
│  ├─ generate_guide_voice.py    gera a voz-guia (Piper TTS) e os tempos das legendas
│  └─ generate_music.py          sintetiza a trilha (piano + pad + grave + reverb)
└─ src/
   ├─ config.ts                  duração de cada cena, início da narração, áreas seguras
   ├─ DaviReel.tsx               timeline: cenas, dissolvências, trilha, narração, ducking
   ├─ Root.tsx                   composições DaviReel / DaviReelSemVoz
   ├─ data/
   │  ├─ narration.json          TEXTO da narração/legendas (blocos curtos + palavras em destaque)
   │  ├─ narration-timing.json   TEMPOS de cada bloco (segundos)
   │  └─ visuals.ts              fotos/vídeos reais opcionais por plano
   ├─ scenes/Scene1..6.tsx       uma cena por arquivo (visual + textos em destaque)
   └─ components/                câmera/parallax, paisagem, personagens, tipografia, look de filme
```

### Timeline

| Cena | Tempo aprox. | Visual | Texto em destaque |
|---|---|---|---|
| 1 — Gancho | 0–7 s | Jovem pastor de costas no campo, ovelhas, câmera se aproxima | "Davi não fazia ideia do que estava acontecendo na casa dele." (sincronizado com a voz) |
| 2 — Contexto | 7–18 s | Casa simples: Samuel diante dos irmãos (contraluz) → Davi no campo | "Ele nem sabia." |
| 3 — Conexão humana | 18–30 s | Pessoa olhando pela janela → pessoa andando na rua ao entardecer | "Você nunca sabe o que pode acontecer em seguida." |
| 4 — Reflexão | 30–44 s | Pessoa num banco; céu nublado que se abre em luz dourada | "E se Deus estiver agindo sem você perceber?" |
| 5 — Metáfora | 44–58 s | Caderno com páginas virando → estrada até o horizonte | "Conhecemos a promessa. Não conhecemos todos os capítulos." |
| 6 — Fechamento | 58–75 s | O pastor se levanta e caminha rumo ao horizonte; fade-out | "Confie no Autor, mesmo sem conhecer o próximo capítulo." + 1 Samuel 16:1–13 |

---

## Sobre os assets (o que é real e o que é provisório)

- **Imagens:** todas as cenas são **ilustrações cinematográficas desenhadas em código**
  (SVG em camadas com parallax, contraluz, névoa, grão e vinheta). Não há fotos de
  terceiros. Para trocar por fotos/vídeos licenciados, veja "Usar fotos ou vídeos reais".
- **Trilha:** composição original sintetizada por `scripts/generate_music.py`
  (sem samples). Pode ser usada livremente ou substituída por uma trilha licenciada.
- **Narração:** a voz atual é uma **voz-guia sintética** (Piper TTS, voz
  `pt-br-edresson-low`, dataset sob CC BY 4.0 — crédito: Edresson Casanova,
  *TTS-Portuguese-Corpus*). Ela serve para validar ritmo e sincronia; **não** tem a
  naturalidade de um locutor e deve ser trocada pela narração definitiva antes de publicar.
- **Fontes:** Cormorant Garamond e Inter, SIL Open Font License (cópias em `public/fonts`).

---

## Como substituir a voz

1. Grave a narração definitiva **separada por cena** (6 arquivos), com um respiro
   de ~0,2 s no início. Salve como WAV ou MP3 com os mesmos nomes:
   `public/audio/narracao/cena-1.wav` … `cena-6.wav`
   (se usar MP3, troque a extensão em `src/DaviReel.tsx`, linha do `<Audio … narracao/>`).
2. Ajuste os tempos das legendas em `src/data/narration-timing.json`. Para cada cena,
   `chunks` tem um item por bloco de legenda, na mesma ordem de `narration.json`:
   ```json
   "cena-2": { "duration": 10.63, "chunks": [
     { "start": 0.0,  "end": 2.85 },   // "Enquanto Samuel estava diante dos seus irmãos"
     { "start": 3.07, "end": 5.6 },    // "para identificar o futuro rei de Israel,"
     ...
   ]}
   ```
   `start`/`end` são segundos **dentro do arquivo de áudio da cena**. Dá para medir
   no Audacity, no Premiere ou no próprio Remotion Studio (a forma de onda aparece
   na timeline). As palavras de cada bloco surgem proporcionalmente dentro desse intervalo.
3. Se a fala ficar mais longa, aumente a duração da cena (ver "Ajustar a duração").
4. Se quiser que a narração comece antes/depois dentro da cena, mude `narrationAt`
   em `src/config.ts`.
5. Renderize de novo: `npm run render`.

Volume: a trilha abaixa automaticamente durante a fala (`musicVolume` → `musicDucked`,
definidos em `src/Root.tsx`).

### Regerar a voz-guia (opcional)

```bash
# baixe o Piper (github.com/rhasspy/piper/releases) e uma voz pt-BR
PIPER_BIN=/caminho/piper PIPER_MODEL=/caminho/pt-br-edresson-low.onnx npm run voz-guia
```
O script lê `narration.json`, gera os 6 WAVs e reescreve `narration-timing.json`
automaticamente. `LENGTH_SCALE=1.2` deixa a fala mais lenta.

---

## Como alterar os textos

- **Narração / legendas:** `src/data/narration.json`. Cada `chunk` é um bloco de
  legenda (mantenha blocos curtos, até ~45 caracteres). `emphasis` lista palavras
  ou expressões destacadas em dourado. Se mudar o texto, regrave/regere a voz e
  atualize `narration-timing.json` (mesmo número de blocos).
  `"showCaptions": false` na cena 1 evita repetir a frase, que já aparece como título.
- **Textos em destaque (títulos serifados):** em cada `src/scenes/SceneN.tsx`,
  no componente `<Headline lines={[...]} emphasis={[...]} />`. Cada item de
  `lines` é uma linha; `from` é o segundo em que aparece; `y` é a altura na tela.
- **Referência final:** `<Reference text="1 Samuel 16:1–13" />` em `Scene6.tsx`.

Áreas seguras do Instagram estão em `SAFE` (`src/config.ts`): os textos ficam entre
250 px do topo e 440 px da base, longe da coluna de ícones à direita.

---

## Como ajustar a duração

Em `src/config.ts`, `SCENES` define a duração de cada cena em **frames** (30 fps):

```ts
{ id: "cena-4", duration: 465, narrationAt: 0.6 },  // 15,5 s
```

- Duração total = soma das cenas − 5 × `TRANSITION` (30 frames de dissolvência).
  O total é calculado sozinho (`TOTAL_FRAMES`); o reel precisa ficar entre 60 e 75 s.
- Os movimentos de câmera se esticam automaticamente para a nova duração.
- Os textos em destaque das cenas 4, 5 e 6 aparecem logo após o fim da narração
  da cena, então acompanham as mudanças de tempo da voz.
- Se mudar a duração total, gere a trilha no mesmo tamanho:
  `DURATION=72 npm run trilha`.

---

## Usar fotos ou vídeos reais

Coloque arquivos licenciados (ou gerados por ferramentas de IA com direito de uso)
em `public/images/` e indique o caminho em `src/data/visuals.ts`:

```ts
"cena-1": "images/pastor-campo.jpg",
"cena-5-estrada": "images/estrada.mp4",
```

Fotos ganham zoom lento e pan (Ken Burns); vídeos rodam sem som. Os textos,
legendas, transições e o acabamento de cinema continuam iguais. Use imagens
verticais com pelo menos 1080 × 1920.

---

## Diretrizes de conteúdo respeitadas

- Reflexão pessoal, não pregação; sem efeitos religiosos clichês, raios celestiais
  ou representações de Deus.
- O texto bíblico **não** diz que Davi estava triste ou desanimado — o vídeo só
  mostra que ele estava no campo, cuidando das ovelhas. A reflexão sobre dias
  comuns e difíceis pertence à experiência contemporânea (cenas 3 e 4).
- Sem promessa de promoção, prosperidade ou conquistas: o foco é confiança,
  esperança e a beleza de caminhar com Deus.
