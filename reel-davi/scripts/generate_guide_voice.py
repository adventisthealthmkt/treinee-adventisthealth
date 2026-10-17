"""Gera a VOZ-GUIA (temporária) da narração com Piper TTS e escreve os tempos das legendas.

Uso:
  PIPER_BIN=/caminho/piper PIPER_MODEL=/caminho/pt-br-edresson-low.onnx \
    python3 scripts/generate_guide_voice.py

Saídas:
  public/audio/narracao/cena-N.wav   (um arquivo por cena, 48 kHz mono)
  src/data/narration-timing.json     (início/fim de cada bloco de legenda, em segundos,
                                      relativos ao início do áudio da cena)

Ao trocar pela narração definitiva, substitua os .wav e ajuste os tempos no JSON
(veja o README).
"""
import json
import os
import subprocess
import tempfile
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
PIPER_BIN = os.environ.get("PIPER_BIN", "piper")
PIPER_MODEL = os.environ["PIPER_MODEL"]
LENGTH_SCALE = os.environ.get("LENGTH_SCALE", "1.12")  # >1 = fala mais lenta
SR = 48000

# Pausas entre blocos: curta após vírgula/sem pontuação, maior após ponto/interrogação/dois-pontos.
PAUSE_SHORT = 0.22
PAUSE_LONG = 0.55


def synth(text: str) -> np.ndarray:
    with tempfile.TemporaryDirectory() as tmp:
        raw = Path(tmp) / "raw.wav"
        out = Path(tmp) / "out.wav"
        subprocess.run(
            [PIPER_BIN, "-m", PIPER_MODEL, "--length_scale", LENGTH_SCALE,
             "--sentence_silence", "0", "-f", str(raw)],
            input=text.encode("utf-8"), check=True, capture_output=True,
        )
        # Reamostra para 48 kHz, corta graves e silêncio nas pontas, aquece levemente o timbre.
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw), "-af",
             "silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
             "silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
             "highpass=f=80,lowpass=f=7200,equalizer=f=180:t=q:w=1:g=2.5,"
             f"aresample={SR}",
             "-ac", "1", "-sample_fmt", "s16", str(out)],
            check=True,
        )
        with wave.open(str(out)) as w:
            return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768


def main() -> None:
    script = json.loads((ROOT / "src/data/narration.json").read_text())
    timing = {}
    for scene in script["scenes"]:
        parts, chunks, t = [], [], 0.0
        for i, chunk in enumerate(scene["chunks"]):
            audio = synth(chunk["text"])
            dur = len(audio) / SR
            chunks.append({"start": round(t, 3), "end": round(t + dur, 3)})
            parts.append(audio)
            t += dur
            if i < len(scene["chunks"]) - 1:
                pause = PAUSE_LONG if chunk["text"].rstrip()[-1] in ".?:!" else PAUSE_SHORT
                parts.append(np.zeros(int(pause * SR), dtype=np.float32))
                t += pause
        full = np.concatenate(parts)
        full *= 0.89 / max(1e-6, np.abs(full).max())
        path = ROOT / f"public/audio/narracao/{scene['id']}.wav"
        with wave.open(str(path), "wb") as w:
            w.setnchannels(1)
            w.setsampwidth(2)
            w.setframerate(SR)
            w.writeframes((full * 32767).astype(np.int16).tobytes())
        timing[scene["id"]] = {"duration": round(len(full) / SR, 3), "chunks": chunks}
        print(f"{scene['id']}: {len(full) / SR:.2f}s")
    (ROOT / "src/data/narration-timing.json").write_text(json.dumps(timing, indent=2) + "\n")


if __name__ == "__main__":
    main()
