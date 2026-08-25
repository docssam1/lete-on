import {
  levels, readyLevels, validateLevels, targetPoints, acceptsAnswer, allPlacements,
  isClosed, vertexCount, edgeCount, pointOnSegment, segmentsIntersect,
  hasSelfIntersection, polygonArea, answerKey
} from "./levels.js";
import { LANGUAGES, messages, text } from "./i18n.js";
import { AUDIO_CUES, AUDIO_CUE_KEYS, validateAudioCueMap } from "./audio-cues.js";
import { existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";

function assert(condition, message) {
  if (!condition) throw new Error(`Geoboard self-test: ${message}`);
}

validateLevels();
assert(levels.length === 5, "five levels must be declared");
assert(readyLevels.length === 2, "only levels 1 and 2 may be playable in this release");

const ids = readyLevels.flatMap((level) => level.problems.map((problem) => problem.id));
assert(ids.length === 20 && new Set(ids).size === 20, "the 20 ready problems need unique ids");

for (const level of readyLevels) {
  for (const problem of level.problems) {
    const target = targetPoints(problem);
    assert(acceptsAnswer(problem, target), `${problem.id} rejects its target`);
    assert(acceptsAnswer(problem, [...target].reverse()), `${problem.id} rejects reverse tap order`);

    if (problem.kind === "closed") {
      problem.vertices.forEach((_, start) => {
        const ring = [...problem.vertices.slice(start), ...problem.vertices.slice(0, start)];
        assert(acceptsAnswer(problem, [...ring, ring[0]]), `${problem.id} rejects start corner ${start}`);
      });
    }

    const accepted = allPlacements(problem).filter((candidate) => acceptsAnswer(problem, candidate));
    assert(accepted.length === 1, `${problem.id} has ${accepted.length} accepted placements`);
    assert(answerKey(accepted[0]) === answerKey(target), `${problem.id} accepts the wrong placement`);
  }
}

const square = [[0, 0], [2, 0], [2, 2], [0, 2], [0, 0]];
const openPath = [[0, 0], [1, 0], [1, 2]];
const bowTie = [[0, 0], [2, 2], [0, 2], [2, 0], [0, 0]];
assert(isClosed(square) && !isClosed(openPath), "open/closed detection failed");
assert(vertexCount(square) === 4 && vertexCount(openPath) === 3, "vertex counting failed");
assert(edgeCount(square) === 4 && edgeCount(openPath) === 2, "edge counting failed");
assert(pointOnSegment([1, 1], [0, 0], [2, 2]), "point-on-segment missed a point");
assert(!pointOnSegment([1, 2], [0, 0], [2, 2]), "point-on-segment accepted an off-line point");
assert(segmentsIntersect([0, 0], [2, 2], [0, 2], [2, 0]), "crossing segments were missed");
assert(!segmentsIntersect([0, 0], [1, 0], [0, 2], [1, 2]), "separate segments were marked crossing");
assert(hasSelfIntersection(bowTie) && !hasSelfIntersection(square), "self-intersection detection failed");
assert(polygonArea(square) === 4, "polygon area calculation failed");

const koreanKeys = Object.keys(messages.ko).sort();
for (const lang of LANGUAGES) {
  assert(JSON.stringify(Object.keys(messages[lang]).sort()) === JSON.stringify(koreanKeys), `${lang} locale keys differ from Korean`);
  assert(text(lang, "levelLabel", { level: 2 }).includes("2"), `${lang} level label does not interpolate`);
  assert(messages[lang].successGreat === "GREAT JOB!", `${lang} success text drifted`);
}

assert(validateAudioCueMap(), "audio cue keys differ between languages");
for (const lang of LANGUAGES) {
  for (const cue of AUDIO_CUE_KEYS) {
    const audioPath = fileURLToPath(new URL(AUDIO_CUES[lang][cue], import.meta.url));
    assert(existsSync(audioPath), `${lang}/${cue} audio file is missing`);
    assert(statSync(audioPath).size >= 256, `${lang}/${cue} audio file is empty`);
  }
}

console.log(`Geoboard self-test passed: ${ids.length} problems, ${LANGUAGES.length} locales, ${AUDIO_CUE_KEYS.length} audio cues.`);
