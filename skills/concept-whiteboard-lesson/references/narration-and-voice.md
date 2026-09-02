# Narration, languages, and voice

## Not English-only

The predecessor skill was built for English lessons. **This one is not.** A lesson is authored in every language the app ships — here Korean, English and Chinese — and none of them is a translation pass bolted on afterwards.

- Write each beat's narration **in each language directly**. A sentence that is natural in Korean often needs a different object, counter or clause order to be natural in Chinese; a literal rendering reads as broken to a parent.
- Subtitles are the **source artifact**. They are the on-screen caption, the printed explanation, and the string the voice layer speaks. One artifact, three uses.
- Check for language contamination before shipping — Korean left in the `en` field, Latin-only text sitting in `zh`. Automate it; this codebase has shipped that bug.
- Line breaking differs by language. `word-break: keep-all` is a Korean rule. Chinese breaks between characters; English needs ordinary wrapping. Set them per language or one of the three will overflow.

## The voice chain — exactly what plays

Do not describe this as "browser speech". It is a three-tier fallback, and which tier answers depends on whether a recording exists for that **exact string**.

```
say(text)
 └─ lang = S.lang (default 'ko')
    1. NM_TTS_MAP[lang][text] exists?      → play that MP3
       └─ .play() rejects (autoplay block, network) → fall through to 2
    2. Web Speech API (SpeechSynthesisUtterance)
       lang = ko-KR | en-US | zh-CN,  rate 1,  pitch 1.2
    3. throws → silent (never blocks the lesson)
```

| Tier | Engine | Cost | Where it comes from |
|---|---|---|---|
| 1 | Pre-rendered MP3 on object storage | paid at generation | `scripts/generate-nm-audio.js` → `data/tts-map.js` (481 entries) |
| 2 | Web Speech API, on device | free | browser built-in |
| 3 | silence | — | failure is never fatal |

### Why the map is keyed by text, and why that matters

`NM_TTS_MAP[lang]` maps **the sentence itself** to a URL. This is the safe design: edit a sentence and its key no longer matches, so playback falls through to tier 2 and speaks **the current text**. Audio cannot silently contradict what is on screen.

The unsafe alternative is keying by filename or lesson id. A sibling app in this repo did that, rewrote its passages, and the old recordings kept matching — reading content that no longer existed. It needed a hand-maintained staleness table to suppress them. **Do not introduce id-keyed audio.**

## Choosing a tier for a new lesson

**Default: author subtitles, ship tier 2.** Do not generate MP3s for a lesson whose wording is still moving. Every sentence edit orphans its recording, and the real cost of paid TTS is re-generation, not first generation.

Promote a lesson to tier 1 only when all of these are true:
- the wording is settled,
- the audience cannot read it (pre-readers — for them speech is required, not optional), **or** pronunciation quality is a real, reported complaint,
- and someone owns re-running generation when the text next changes.

Because tier 1 is a cache in front of tier 2, promotion is additive and reversible: add rows to the map, and remove them to fall back. Author in text and this stays true. Author in audio first and it does not.

## Wiring it in a lesson

- Voice is a **toggle, never a dependency**. Every beat must be fully understandable with sound off — the subtitle carries it. Print has no sound at all, so this is not optional.
- Advance beats on the learner's action or an explicit duration, **not on audio ending**. Tier 2 timing varies by device and voice; tier 3 has no ending at all.
- Cancel any in-flight utterance before starting the next beat (`speechSynthesis.cancel()`), or beats overlap when a child skips ahead.
- Speak the same string that is displayed. If they diverge, the child hears one thing and reads another.
