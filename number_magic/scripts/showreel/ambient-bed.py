#!/usr/bin/env python3
"""쇼릴 배경 소리 — 저작권 없는 '신비로운' 패드 + 장면 전환 차임을 수식으로 만든다(numpy/scipy).
compose.js 가 부른다:  python3 ambient-bed.py <out.wav> <총 길이 초> <장면 시작 초,...> <목소리 구간 a-b,...>
- 패드: 부드러운 사인 화음(살짝 어긋난 음정 두 겹 → 맥놀이), 장면마다 화음이 천천히 바뀐다(4초 교차).
- 차임: 장면 시작마다 오음음계 높은 음 3개를 종소리(배음 1·2.76·5.4, 지수 감쇠)로 흩뿌린다.
- 잔향: 지수 감쇠 잡음 IR(2.4초)과 FFT 합성곱.
- 목소리가 나오는 동안은 패드를 7dB 더 내린다(부드러운 램프). 최종 음량은 compose.js 가 LUFS 로 맞춘다.
"""
import sys, wave
import numpy as np
from scipy.signal import fftconvolve

SR = 48000
out, total = sys.argv[1], float(sys.argv[2])
starts = [float(x) for x in sys.argv[3].split(',') if x]
voice = [tuple(map(float, v.split('-'))) for v in sys.argv[4].split(',') if v] if len(sys.argv) > 4 else []
# v3: 장면 전환 '휙'(걸러진 잡음 스윕) 시각들 + 활기 모드(8분음표 첼레스타 아르페지오, 낮은 박동)
whoosh = [float(x) for x in sys.argv[5].split(',') if x] if len(sys.argv) > 5 else []
LIVELY = len(sys.argv) > 6 and sys.argv[6] in ('v3', 'v4')
SWELL = len(sys.argv) > 6 and sys.argv[6] == 'v4'   # 마지막 장면(엔딩 카드)에서 살짝 부풀었다가 D 장조로 맺는다
BED_START = float(sys.argv[7]) if len(sys.argv) > 7 else 0.0   # 이 시각 전(인트로 영상 자체 소리)은 비운다
n = int(total * SR)
t = np.arange(n) / SR
rng = np.random.default_rng(7)

def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)

# 화음(미디 음) — D 장조 주변의 떠 있는 화음들(9·sus 로 해결되지 않는 느낌)
CHORDS = [
    [50, 57, 62, 64, 69],   # D add9
    [47, 54, 59, 62, 66],   # Bm11 느낌
    [43, 50, 55, 57, 62],   # G add9
    [45, 52, 57, 59, 64],   # A sus2
    [48, 55, 60, 62, 67],   # C add9 (신비로운 b7 색)
    [50, 57, 62, 66, 69],   # D maj
]
pad = np.zeros(n)
bounds = starts + [total]
for i, s0 in enumerate(starts):
    s1 = bounds[i + 1]
    a, b = max(0.0, s0 - 2.0), min(total, s1 + 2.0)
    ia, ib = int(a * SR), int(b * SR)
    tt = t[ia:ib]
    env = np.clip((tt - a) / 2.0, 0, 1) * np.clip((b - tt) / 2.0, 0, 1)
    env = env * env * (3 - 2 * env)
    ch = CHORDS[i % len(CHORDS)]
    seg = np.zeros(ib - ia)
    for k, m in enumerate(ch):
        f = hz(m)
        amp = 0.9 / (1 + 0.35 * k)
        lfo = 0.75 + 0.25 * np.sin(2 * np.pi * (0.07 + 0.013 * k) * tt + k)
        for det in (-0.12, 0.12):  # 센트가 아니라 Hz — 느린 맥놀이
            seg += amp * lfo * np.sin(2 * np.pi * (f + det) * tt + rng.uniform(0, 6.28))
        seg += 0.18 * amp * lfo * np.sin(2 * np.pi * 2 * f * tt)  # 옅은 옥타브
    pad[ia:ib] += seg * env
pad /= np.max(np.abs(pad)) + 1e-9
if SWELL and len(starts):
    s_last = starts[-1]
    ramp = np.clip((t - s_last) / 2.5, 0, 1); ramp = ramp * ramp * (3 - 2 * ramp)
    pad *= 1 + 0.7 * ramp
    # 맺음 화음(D 장조, 마지막 2.5초에서 조용히 떠오른다)
    ia = int(max(0, total - 3.2) * SR); q = np.arange(n - ia) / SR
    env = np.clip(q / 1.6, 0, 1) ** 2
    fin = np.zeros(n - ia)
    for k, m in enumerate([50, 57, 62, 66, 69, 74]):
        fin += (0.9 / (1 + 0.3 * k)) * np.sin(2 * np.pi * hz(m) * q)
    pad[ia:] += 0.35 * fin / (np.max(np.abs(fin)) + 1e-9) * env
    pad /= np.max(np.abs(pad)) + 1e-9

# 목소리 구간에서 패드를 더 낮춘다
duck = np.ones(n)
for a, b in voice:
    ia, ib = int(max(0, a - 0.25) * SR), int(min(total, b + 0.35) * SR)
    duck[ia:ib] = 0.45
k = int(0.35 * SR)
duck = np.convolve(duck, np.ones(k) / k, mode='same')
pad *= duck

# 차임
PENTA = [74, 76, 78, 81, 83, 86, 88, 90, 93]
chime = np.zeros(n)
for i, s0 in enumerate(starts):
    notes = rng.choice(PENTA, 3, replace=False)
    notes.sort()
    for j, m in enumerate(notes):
        st = s0 + 0.05 + j * 0.16
        L = int(3.2 * SR)
        ia = int(st * SR)
        if ia >= n:
            continue
        ib = min(n, ia + L)
        tt = np.arange(ib - ia) / SR
        f = hz(m)
        v = (np.sin(2 * np.pi * f * tt) * np.exp(-tt * 2.2)
             + 0.35 * np.sin(2 * np.pi * f * 2.76 * tt) * np.exp(-tt * 4.5)
             + 0.15 * np.sin(2 * np.pi * f * 5.4 * tt) * np.exp(-tt * 8.0))
        v *= np.clip(tt / 0.004, 0, 1)
        chime[ia:ib] += v * (0.55 - 0.1 * j)
chime /= np.max(np.abs(chime)) + 1e-9

arp = np.zeros(n); pulse = np.zeros(n); wh = np.zeros(n)
if LIVELY:
    BPM = 104.0; step = 60.0 / BPM / 2   # 8분음표
    for i, s0 in enumerate(starts):
        s1 = bounds[i + 1]
        ch = CHORDS[i % len(CHORDS)]
        notes = [m + 24 for m in ch[1:]] + [ch[2] + 36]
        pat = [0, 2, 1, 3, 2, 4, 1, 3]
        k = 0; tt0 = s0 + 0.15
        while tt0 < s1 - 0.1:
            m = notes[pat[k % len(pat)] % len(notes)]
            ia = int(tt0 * SR); L2 = int(0.9 * SR); ib = min(n, ia + L2)
            if ia < n:
                q = np.arange(ib - ia) / SR; f = hz(m)
                v = (np.sin(2 * np.pi * f * q) + 0.3 * np.sin(2 * np.pi * 2 * f * q) * np.exp(-q * 6)) * np.exp(-q * 5.5) * np.clip(q / 0.003, 0, 1)
                arp[ia:ib] += v * (0.8 if k % 2 == 0 else 0.55)
            k += 1; tt0 += step
        # 낮은 박동(4분음표, 부드러운 킥 느낌의 사인 드롭)
        tt0 = s0 + 0.15
        while tt0 < s1 - 0.1:
            ia = int(tt0 * SR); ib = min(n, ia + int(0.35 * SR))
            if ia < n:
                q = np.arange(ib - ia) / SR
                pulse[ia:ib] += np.sin(2 * np.pi * (58 + 50 * np.exp(-q * 30)) * q) * np.exp(-q * 11)
            tt0 += step * 2
    arp /= np.max(np.abs(arp)) + 1e-9; pulse /= np.max(np.abs(pulse)) + 1e-9
for w0 in whoosh:
    ia = int(max(0, w0 - 0.45) * SR); ib = min(n, ia + int(0.9 * SR))
    q = np.arange(ib - ia) / SR
    noise = rng.standard_normal(ib - ia)
    # 올라가는 대역 통과: 간단히 두 번 미분·적분 대신 이동 평균 길이를 줄여 가며 밝아지게
    env = np.sin(np.pi * np.clip(q / 0.9, 0, 1)) ** 2
    bright = np.convolve(noise, np.ones(6) / 6, mode='same') - np.convolve(noise, np.ones(40) / 40, mode='same')
    wh[ia:ib] += bright * env
if len(whoosh): wh /= np.max(np.abs(wh)) + 1e-9
dry = 0.85 * pad + 0.28 * chime + (0.34 * arp * duck + 0.16 * pulse * duck + 0.22 * wh if LIVELY else 0)
# 잔향 — 좌우를 다른 IR 로(넓게)
L = int(2.4 * SR)
tt = np.arange(L) / SR
def ir(seed):
    r = np.random.default_rng(seed).standard_normal(L) * np.exp(-tt * 2.6)
    r[0] = 0
    return r / np.sqrt(np.sum(r ** 2))
wl = fftconvolve(dry, ir(1))[:n]
wr = fftconvolve(dry, ir(2))[:n]
left = 0.6 * dry + 0.55 * wl
right = 0.6 * dry + 0.55 * wr
# 끝 페이드
fade = np.clip((total - t) / 2.5, 0, 1) * np.clip((t - BED_START) / 1.2, 0, 1)
st = np.stack([left * fade, right * fade], axis=1)
st /= np.max(np.abs(st)) + 1e-9
st *= 0.5
pcm = (st * 32767).astype('<i2')
with wave.open(out, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print(f'bed {total:.2f}s {len(starts)} scenes {len(voice)} voice spans -> {out}')
