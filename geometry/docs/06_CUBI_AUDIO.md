# Cubi Audio Direction

GFIELD Cube Town uses temporary browser speech while the Cubi voice pack is not ready.
The final sound should use short MP3 files with a cartoon mascot tone, not teacher narration and not plain TTS.

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

## Planned File Layout

```text
geometry/assets/audio/cubi/
  success/
    good-job.mp3
    great-job.mp3
    success.mp3
  effects/
    wood-place-01.mp3
    wood-place-02.mp3
    wrong-soft.mp3
  tutorial/
    ko/
      drag-from-tray.mp3
      place-on-guide.mp3
      stack-up.mp3
      return-to-tray.mp3
    zh/
    ja/
    en/
```

## Current Code Hook

`geometry/app.js` has `cubiAudioProfile`.

```js
const cubiAudioProfile = {
  useMp3: false,
  success: {
    successGood: "./assets/audio/cubi/success/good-job.mp3",
    successGreat: "./assets/audio/cubi/success/great-job.mp3",
    successPop: "./assets/audio/cubi/success/success.mp3"
  }
};
```

When final MP3 files are added, set `useMp3` to `true`.
Until then, the app falls back to temporary browser speech for success voice only.
