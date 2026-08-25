import { validateLevels, levels } from "./levels.js";
import { AUDIO_CUES, validateAudioCueMap } from "./audio-cues.js";

if (!validateLevels()) throw new Error("Paper-fold level validation failed");
if (!validateAudioCueMap()) throw new Error("Paper-fold audio cue validation failed");
if (levels.length !== 5 || levels.some((level) => level.problems.length !== 10)) throw new Error("Paper-fold pool size regression");
if (Object.values(AUDIO_CUES).some((cues) => Object.keys(cues).length !== 8)) throw new Error("Paper-fold audio cue count regression");

console.log("Paper-fold self-test passed: 50 problems, 5 levels, 4 locales, 8 audio cues.");
