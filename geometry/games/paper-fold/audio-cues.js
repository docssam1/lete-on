/* Stable Foldy MP3 URLs. Audio files are generated once and checked into the app. */

export const AUDIO_CUE_CACHE_VERSION = "paper-fold-audio-2";

const LANGUAGES = ["ko", "zh", "ja", "en"];
const CUE_KEYS = [
  "tutorial1",
  "tutorial2",
  "tutorial3",
  "hintReady",
  "hintFolded",
  "successGood",
  "successGreat",
  "successPop",
];

const filename = {
  tutorial1: "tutorial1",
  tutorial2: "tutorial2",
  tutorial3: "tutorial3",
  hintReady: "hint-ready",
  hintFolded: "hint-folded",
  successGood: "success-good",
  successGreat: "success-great",
  successPop: "success-pop",
};

const cueUrl = (lang, cue) => `../../assets/audio/foldy/paper-fold/${lang}/${filename[cue]}.mp3`;

export const AUDIO_CUES = Object.freeze(Object.fromEntries(LANGUAGES.map((lang) => [lang, Object.freeze(
  Object.fromEntries(CUE_KEYS.map((cue) => [cue, cueUrl(lang, cue)]))
)])));

export function audioCueUrl(language, cue) {
  const lang = AUDIO_CUES[language] ? language : "ko";
  const url = AUDIO_CUES[lang][cue] || AUDIO_CUES.ko[cue];
  return `${url}?v=${AUDIO_CUE_CACHE_VERSION}`;
}

export function validateAudioCueMap() {
  const expected = CUE_KEYS.slice().sort().join("|");
  return LANGUAGES.every((lang) => Object.keys(AUDIO_CUES[lang]).sort().join("|") === expected);
}

if (!validateAudioCueMap()) throw new Error("Paper-fold audio cue language parity failed");
