"""Gera a trilha instrumental original (piano + pad + grave) do reel.

Tudo é sintetizado aqui, sem samples nem material de terceiros.

Uso:
  python3 scripts/generate_music.py            # 75 s, grava public/audio/trilha.wav
  DURATION=70 python3 scripts/generate_music.py

Estrutura (acompanha o roteiro):
  0–18 s   piano esparso, curioso e introspectivo
  18–43 s  entra um pad suave
  43–57 s  crescimento sutil (pad mais cheio, grave, piano mais presente)
  57–fim   volta a ficar esparso; acorde final sereno com fade-out
"""
import os
import wave
from pathlib import Path

import numpy as np
from scipy.signal import fftconvolve, butter, sosfilt

ROOT = Path(__file__).resolve().parent.parent
SR = 48000
DURATION = float(os.environ.get("DURATION", "75"))
BPM = 64
BEAT = 60 / BPM
rng = np.random.default_rng(16)


def midi_hz(n: float) -> float:
    return 440.0 * 2 ** ((n - 69) / 12)


# Acordes (MIDI) — Si menor / Sol / Ré / Lá, com nonas e sétimas suaves.
CHORDS = {
    "Bm9": [47, 54, 57, 61, 62, 66],
    "Gmaj7": [43, 50, 54, 57, 59, 62],
    "D/F#": [42, 50, 54, 57, 62, 64],
    "Asus4": [45, 52, 57, 59, 62, 64],
    "A": [45, 52, 57, 61, 64, 66],
    "Dmaj9": [38, 50, 54, 57, 61, 64],
    "Em9": [40, 50, 55, 59, 62, 66],
}
PROGRESSION = ["Bm9", "Gmaj7", "D/F#", "Asus4", "Bm9", "Gmaj7", "Em9", "Asus4", "Gmaj7", "Dmaj9"]
CHORD_LEN = 8 * BEAT  # ~7,5 s por acorde


def section_energy(t: float) -> float:
    """Curva de intensidade 0..1 ao longo do tempo."""
    pts = [(0, 0.15), (7, 0.25), (18, 0.4), (30, 0.55), (43, 0.75), (54, 0.85), (58, 0.5), (68, 0.3), (DURATION, 0.2)]
    xs, ys = zip(*pts)
    return float(np.interp(t, xs, ys))


def piano_note(freq: float, dur: float, vel: float) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for h in range(1, 9):
        f = freq * h * np.sqrt(1 + 0.0004 * h * h)  # leve inarmonicidade
        if f > SR / 2.2:
            break
        amp = (1 / h ** 1.6) * (1.0 if h == 1 else 0.8)
        decay = np.exp(-t * (0.55 + 0.45 * h) * (0.6 + freq / 900))
        out += amp * decay * np.sin(2 * np.pi * f * t + rng.uniform(0, 2 * np.pi))
    attack = np.minimum(1, t / 0.006)
    out *= attack
    # "martelo" macio
    hammer = rng.normal(0, 1, min(n, int(0.02 * SR))) * np.exp(-np.arange(min(n, int(0.02 * SR))) / (0.003 * SR))
    out[: len(hammer)] += 0.03 * hammer
    release = np.ones(n)
    r = int(0.4 * SR)
    release[-r:] = np.linspace(1, 0, r) ** 2
    return out * release * vel


def pad_chord(notes: list[int], dur: float, vel: float) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for note in notes[1:]:
        for detune in (-0.12, 0.0, 0.11):
            f = midi_hz(note + detune)
            vib = 1 + 0.0015 * np.sin(2 * np.pi * 0.21 * t + rng.uniform(0, 6))
            ph = 2 * np.pi * np.cumsum(f * vib) / SR
            out += np.sin(ph) + 0.18 * np.sin(2 * ph) + 0.06 * np.sin(3 * ph)
    env = np.minimum(1, t / 2.4) * np.minimum(1, (dur - t) / 2.6).clip(0, 1)
    return out * env * vel / (len(notes) * 3)


def bass_note(note: int, dur: float, vel: float) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = midi_hz(note - 12)
    out = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(4 * np.pi * f * t)
    env = np.minimum(1, t / 0.8) * np.exp(-t * 0.25) * np.minimum(1, (dur - t) / 1.2).clip(0, 1)
    return out * env * vel


def add(buf: np.ndarray, sig: np.ndarray, start: float, pan: float = 0.0) -> None:
    i = int(start * SR)
    if i >= buf.shape[1]:
        return
    sig = sig[: buf.shape[1] - i]
    left = np.cos((pan + 1) * np.pi / 4)
    right = np.sin((pan + 1) * np.pi / 4)
    buf[0, i : i + len(sig)] += sig * left
    buf[1, i : i + len(sig)] += sig * right


def reverb_ir(seconds: float = 3.2) -> np.ndarray:
    n = int(seconds * SR)
    t = np.arange(n) / SR
    ir = np.stack([rng.normal(0, 1, n), rng.normal(0, 1, n)]) * np.exp(-t / 0.75)
    sos = butter(2, 5200, "low", fs=SR, output="sos")
    ir = sosfilt(sos, ir, axis=1)
    ir[:, : int(0.012 * SR)] *= np.linspace(0, 1, int(0.012 * SR))
    return ir / np.abs(ir).sum(axis=1, keepdims=True) * 18


def main() -> None:
    total = int((DURATION + 4) * SR)
    dry = np.zeros((2, total))
    pad = np.zeros((2, total))

    # Motivo melódico (graus relativos às notas do acorde), tocado de forma esparsa.
    pattern = [0, 3, 4, 2, 5, 3, 4, 1]
    for ci, name in enumerate(PROGRESSION):
        notes = CHORDS[name]
        c0 = ci * CHORD_LEN
        if c0 >= DURATION:
            break
        e = section_energy(c0)
        # piano: mais notas quando a energia cresce
        step = 2 if e < 0.35 else 1
        for b in range(0, 8, step):
            t = c0 + b * BEAT + rng.uniform(-0.015, 0.02)
            if t > DURATION - 2:
                break
            idx = pattern[(b + ci) % len(pattern)]
            note = notes[1 + idx % (len(notes) - 1)] + 12
            vel = 0.22 * (0.75 + 0.5 * section_energy(t)) * rng.uniform(0.82, 1.0)
            if b == 0:
                vel *= 1.15
            add(dry, piano_note(midi_hz(note), 4.5, vel), t, pan=np.clip((note - 72) / 18, -0.6, 0.6))
            if b in (0, 4) and section_energy(t) > 0.5:
                add(dry, piano_note(midi_hz(notes[1]), 4.5, vel * 0.55), t + 0.01, pan=-0.25)
        # nota grave do piano no início do acorde
        add(dry, piano_note(midi_hz(notes[0] + 12), 6.0, 0.16 * (0.7 + e)), c0, pan=-0.3)
        # pad entra depois da introdução
        if c0 >= 7:
            add(pad, pad_chord(notes, CHORD_LEN + 2.5, 0.20 * e), c0 - 1.0)
        if 28 <= c0 < 60:
            add(pad, bass_note(notes[0], CHORD_LEN + 1.5, 0.10 * e), c0)

    # Acorde final que se sustenta
    final_t = min(len(PROGRESSION) * CHORD_LEN, DURATION - 7)
    for i, note in enumerate(CHORDS["Dmaj9"][1:]):
        add(dry, piano_note(midi_hz(note + 12), 7.0, 0.13), final_t + i * 0.12, pan=(i - 2) * 0.15)

    sos = butter(2, 2600, "low", fs=SR, output="sos")
    pad = sosfilt(sos, pad, axis=1)
    mix = dry + pad
    ir = reverb_ir()
    wet = np.stack([fftconvolve(mix[c], ir[c])[:total] for c in range(2)])
    out = 0.62 * mix + 0.55 * wet
    hp = butter(2, 45, "high", fs=SR, output="sos")
    out = sosfilt(hp, out, axis=1)

    n = int(DURATION * SR)
    out = out[:, :n]
    t = np.arange(n) / SR
    fade = np.minimum(1, t / 2.5) * np.minimum(1, (DURATION - t) / 5.0).clip(0, 1)
    out *= fade
    out *= 0.89 / np.abs(out).max()

    path = ROOT / "public/audio/trilha.wav"
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((out.T * 32767).astype(np.int16).tobytes())
    print(f"ok: {path} ({DURATION:.1f}s)")


if __name__ == "__main__":
    main()
