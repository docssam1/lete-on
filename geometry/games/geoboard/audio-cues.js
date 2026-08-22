/* Stable Geoboard Cubi audio URLs. Success cues reuse the shared Cubi pack. */

export const AUDIO_CUE_CACHE_VERSION = "geoboard-audio-1";

const LANGUAGES = ["ko", "zh", "ja", "en"];
const cues = [
  "tutorial1",
  "tutorial2",
  "tutorial3",
  "tutorial4",
  "tutorial-practice",
  "tutorial-complete",
  "hint-open",
  "hint-closed",
];

const tutorialUrl = (lang, cue) => `../../assets/audio/cubi/geoboard/${lang}/${cue}.mp3`;
const sharedSuccessUrl = (lang, file) => `../../assets/audio/cubi/success/${lang}/${file}.mp3`;

export const AUDIO_CUES = Object.freeze(Object.fromEntries(LANGUAGES.map((lang) => [lang, Object.freeze({
  tutorial1: tutorialUrl(lang, "tutorial1"),
  tutorial2: tutorialUrl(lang, "tutorial2"),
  tutorial3: tutorialUrl(lang, "tutorial3"),
  tutorial4: tutorialUrl(lang, "tutorial4"),
  tutorialPractice: tutorialUrl(lang, "tutorial-practice"),
  tutorialComplete: tutorialUrl(lang, "tutorial-complete"),
  hintOpen: tutorialUrl(lang, "hint-open"),
  hintClosed: tutorialUrl(lang, "hint-closed"),
  successGood: sharedSuccessUrl(lang, "good-job"),
  successGreat: sharedSuccessUrl(lang, "great-job"),
  successPop: sharedSuccessUrl(lang, "success"),
})])));

export const AUDIO_CUE_KEYS = Object.freeze([
  ...cues.map((cue) => cue.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())),
  "successGood",
  "successGreat",
  "successPop",
]);

export function audioCueUrl(language, key) {
  const lang = AUDIO_CUES[language] ? language : "ko";
  const url = AUDIO_CUES[lang][key] || AUDIO_CUES.ko[key];
  return `${url}?v=${AUDIO_CUE_CACHE_VERSION}`;
}

export function validateAudioCueMap() {
  const expected = [...AUDIO_CUE_KEYS].sort().join("|");
  return LANGUAGES.every((lang) => Object.keys(AUDIO_CUES[lang]).sort().join("|") === expected);
}

if (!validateAudioCueMap()) throw new Error("Geoboard audio cue language parity failed");

