#!/usr/bin/env python3
"""숏릴 음악·효과음 — 남의 음원을 쓰지 않고 여기서 직접 합성한다(표준 라이브러리만).

    python3 soundtrack.py <sfx.json> <out.wav>

sfx.json = {"length": 초, "scenes": [장면 시작 초...], "sfx": [{"type": "tap"|"good", "t": 초}]}  (record.cjs 가 만든다)
음악: 120bpm, C–G–Am–F 한 마디씩 — 킥·하이햇·베이스·뜯는 소리 아르페지오. 장면이 바뀔 때 짧은 휙 소리,
누를 때 톡, 맞힐 때 딩동. 끝은 조용히 줄여 영상이 처음으로 돌아갈 때 튀지 않게 한다.
"""
import json, math, random, struct, sys, wave

RATE = 32000
spec = json.load(open(sys.argv[1], encoding="utf-8"))
LENGTH = float(spec["length"])
N = int(LENGTH * RATE)
music = [0.0] * N
fx = [0.0] * N
rnd = random.Random(7)


def note(n):  # MIDI 번호 → Hz
    return 440.0 * 2 ** ((n - 69) / 12)


def add(buf, start, samples, gain):
    i0 = int(start * RATE)
    for k, v in enumerate(samples):
        i = i0 + k
        if 0 <= i < N:
            buf[i] += v * gain


def tone(freq, dur, attack=0.004, decay=6.0, shape="tri"):
    out = []
    for k in range(int(dur * RATE)):
        t = k / RATE
        ph = (freq * t) % 1.0
        v = 4 * abs(ph - 0.5) - 1 if shape == "tri" else math.sin(2 * math.pi * freq * t)
        env = min(1.0, t / attack) * math.exp(-decay * t)
        out.append(v * env)
    return out


def kick():
    out, ph = [], 0.0
    for k in range(int(0.22 * RATE)):
        t = k / RATE
        f = 50 + 90 * math.exp(-t * 28)
        ph += f / RATE
        out.append(math.sin(2 * math.pi * ph) * math.exp(-t * 14))
    return out


def hat():
    out, prev = [], 0.0
    for k in range(int(0.05 * RATE)):
        x = rnd.uniform(-1, 1)
        y = x - prev  # 낮은 소리를 덜어 낸 쉬익
        prev = x
        out.append(y * math.exp(-k / RATE * 70))
    return out


BPM = 120
BEAT = 60 / BPM
CHORDS = [[48, 55, 60, 64, 67], [43, 50, 59, 62, 67], [45, 52, 57, 60, 64], [41, 48, 57, 60, 65]]  # C G Am F (베이스 + 화음)
KICK, HAT = kick(), hat()
beat = 0
while beat * BEAT < LENGTH:
    t = beat * BEAT
    chord = CHORDS[(beat // 4) % 4]
    if beat % 2 == 0:
        add(music, t, KICK, 0.55)
    add(music, t + BEAT / 2, HAT, 0.12)
    for half in (0, 1):  # 베이스: 8분음표로 뜯기
        add(music, t + half * BEAT / 2, tone(note(chord[0]), 0.22, decay=9, shape="sin"), 0.32)
    arp = chord[2:] + [chord[3] + 12]
    for q in range(4):  # 아르페지오: 16분음표
        add(music, t + q * BEAT / 4, tone(note(arp[(beat * 4 + q) % len(arp)] + 12), 0.16, decay=14), 0.10)
    beat += 1

# 장면이 바뀔 때 휙
for s in spec.get("scenes", [])[1:]:
    sw, prev = [], 0.0
    dur = 0.28
    for k in range(int(dur * RATE)):
        t = k / RATE
        x = rnd.uniform(-1, 1)
        a = 0.08 + 0.5 * (t / dur)  # 점점 밝아지는 쉬익
        prev = prev + a * (x - prev)
        sw.append(prev * math.sin(math.pi * t / dur))
    add(fx, max(0.0, s - 0.16), sw, 0.55)

for e in spec.get("sfx", []):
    if e["type"] == "tap":
        pop = []
        for k in range(int(0.05 * RATE)):
            t = k / RATE
            pop.append(math.sin(2 * math.pi * (1300 - 6000 * t) * t) * math.exp(-t * 70))
        add(fx, e["t"], pop, 0.45)
    else:  # 맞혔어요: 도·미·솔·도 빠르게
        for j, n in enumerate([72, 76, 79, 84]):
            add(fx, e["t"] + j * 0.07, tone(note(n), 0.5, decay=5), 0.32)
            add(fx, e["t"] + j * 0.07, tone(note(n + 12), 0.3, decay=9, shape="sin"), 0.10)

mix = []
for i in range(N):
    t = i / RATE
    fade = min(1.0, t / 0.4, (LENGTH - t) / 1.2)
    mix.append(music[i] * fade + fx[i])
peak = max(1e-9, max(abs(v) for v in mix))
scale = 0.9 / peak
with wave.open(sys.argv[2], "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(RATE)
    w.writeframes(b"".join(struct.pack("<h", int(max(-1, min(1, v * scale)) * 32767)) for v in mix))
print(f"soundtrack {LENGTH:.1f}초 · 효과음 {len(spec.get('sfx', []))}개")
