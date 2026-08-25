# Cubi Audio Direction

GFIELD Cube Town now uses generated Cubi MP3 files first. Browser speech is retained only as a fallback when an MP3 is missing or cannot be played.

## Voice Style

- Bright cartoon character voice.
- Slightly high, playful, and energetic.
- Short phrases with rhythm.
- Friendly, but not babyish.
- Feels like a cube friend in a children's learning game.
- Tutorial voice appears only at the beginning.
- Normal play should rely mostly on small sound effects.
- Success can use stronger character voice effects.

## Cue Rules

- Placement: wood tap effect only.
- Wrong placement: soft short effect plus a small Cubi nod or bubble.
- Tutorial: Cubi speaks with a large front overlay only on the first level-one tutorial.
- Success: one of `SUCCESS!`, `GREAT JOB!`, or `GOOD JOB!` plays as a character voice effect.
- Mute button controls both effects and Cubi MP3 voice.

## File Layout

```text
geometry/assets/audio/cubi/
  success/
    ko/
      good-job.mp3
      great-job.mp3
      success.mp3
    zh/
    ja/
    en/
  tutorial/
    ko/
      drag-from-tray.mp3
      place-on-guide.mp3
      stack-up.mp3
    zh/
    ja/
    en/
  geoboard/
    ko/
      tutorial1.mp3
      tutorial2.mp3
      tutorial3.mp3
      tutorial4.mp3
      tutorial-practice.mp3
      tutorial-complete.mp3
      hint-open.mp3
      hint-closed.mp3
    zh/
    ja/
    en/
```

The three tutorial cues are generated in all four languages. Success phrases remain English but use the language-specific Cubi voice so the character sound stays consistent with the selected language.
Placement and wrong-answer feedback remain lightweight WebAudio effects and are not part of this MP3 pack.

## Generation

Run from the repository root:

```text
node scripts/generate-cubi-audio.js
node scripts/generate-geoboard-audio.js
```

The scripts use the installed `edge-tts` package. The Cube Town pack creates 24 non-empty MP3 files, and the Geoboard pack creates 32 files covering the four tutorial scenes, guided practice, practice completion, and two hints in four languages. Tutorial lines use a youthful pitch and slightly quick delivery. Success cues use a faster, higher, stronger setting and are shared instead of duplicated per game.

## Current Code Hook

`geometry/app.js` has `cubiAudioProfile`.

```js
const cubiAudioProfile = {
  useMp3: true,
  cacheVersion: "20260815-1",
  tutorial: { ko: {}, zh: {}, ja: {}, en: {} },
  success: { ko: {}, zh: {}, ja: {}, en: {} }
};
```

`geometry/app.js` maps language and cue keys to these files. A media load, decode, or autoplay failure invokes the original `speechSynthesis` path. The existing placement and wrong-answer WebAudio effects are unchanged, and `gfield-audio-muted` still controls every sound.
