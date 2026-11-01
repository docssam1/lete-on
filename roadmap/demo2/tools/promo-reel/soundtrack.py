"""Original instrumental bed: soft plucked chords and a sparse bell melody. No samples."""
import math, random, struct, sys, wave
RATE, LENGTH = 32000, 25
samples = [0.0] * (RATE * LENGTH)
rng = random.Random(31)

def note(at, midi, duration, volume, bell=False):
    frequency = 440 * 2 ** ((midi - 69) / 12)
    for n in range(int(RATE * duration)):
        pos = int(at * RATE) + n
        if pos >= len(samples):
            break
        t = n / RATE
        envelope = min(1, t / .015) * math.exp(-t * (2.6 if bell else 1.9))
        tone = math.sin(2 * math.pi * frequency * t)
        tone += .19 * math.sin(2 * math.pi * frequency * 2 * t) * math.exp(-t * 3)
        tone += .07 * math.sin(2 * math.pi * frequency * 3 * t) * math.exp(-t * 6)
        samples[pos] += volume * envelope * tone

# Dmaj7 – Aadd9 – Bm7 – Gmaj7, 96 bpm. Deliberately light enough to read captions.
chords = [(50, 57, 61, 66), (45, 52, 59, 64), (47, 54, 57, 62), (43, 50, 54, 59)]
for bar in range(10):
    start = bar * 2.5
    chord = chords[bar % 4]
    note(start, chord[0], 2.4, .12)
    for k in range(8):
        note(start + k * .3125, chord[1 + k % 3] + 12, 1.1, .055)
    if bar % 2 == 0:
        for k, pitch in enumerate([chord[2] + 24, chord[1] + 24, chord[3] + 12]):
            note(start + .625 + k * .625, pitch, 1.6, .038, True)

peak = max(abs(s) for s in samples)
with wave.open(sys.argv[1], 'wb') as out:
    out.setparams((2, 2, RATE, 0, 'NONE', 'not compressed'))
    buf = bytearray()
    for i, value in enumerate(samples):
        t = i / RATE
        fade = min(1, t / .8, (LENGTH - t) / 1.8)
        level = int(value / peak * 19000 * max(0, fade))
        buf.extend(struct.pack('<hh', level, level))
    out.writeframes(buf)
