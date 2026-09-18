import "../../geometry/worksheet/generators.js";
import "../../geometry/worksheet/render.js";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-data.js?v=20260905e";
import { guidedConceptVisual } from "./golden-bell-guided-experiences.js";

// Keep this list aligned with the explicit branches in guidedConceptVisual().
const SUPPORTED_FAMILIES = new Set([
  "balance-order-chain",
  "digital-transform",
  "double-fold-symmetry",
  "dual-shape-color-cycle",
  "equal-line",
  "equalize-transfer",
  "fold-symmetry",
  "four-number-promise",
  "line-card-placement",
  "magic-line-target",
  "mirror-direction",
  "multiple-direction",
  "number-condition-filter",
  "one-to-one-logic",
  "relative-order",
  "shape-substitution",
  "six-bundle-equation",
  "sum-grid-placement",
  "vertical-cryptarithm-carry"
]);
const BOOK_SEVEN_GUIDED_FAMILIES = new Set([
  "arithmetic-sequence",
  "assumption-score",
  "calendar-weekday",
  "clock-reading",
  "closed-loop",
  "multiplication-equation",
  "reverse-digits",
  "reverse-growth",
  "shape-sequence",
  "venn-diagram"
]);

// Every guided lesson in the current course-one corpus must render.
const UNSUPPORTED_ALLOWLIST = Object.freeze([]);

function isSupportedFamily(family) {
  return typeof family === "string" && (
    family.startsWith("book2-") ||
    family.startsWith("book3-") ||
    family.startsWith("book4-") ||
    family === "book06-source" ||
    BOOK_SEVEN_GUIDED_FAMILIES.has(family) ||
    family.startsWith("book08-") ||
    family.startsWith("book09-") ||
    SUPPORTED_FAMILIES.has(family)
  );
}

function lessonKey(record) {
  return `${record.bookId}/${record.lessonId} | ${record.family ?? "<missing>"}`;
}

function normalizeFrame(html) {
  return String(html)
    .replace(/\sdata-book\d+-guided-step="[^"]*"/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const guidedLessons = [];
for (const book of GOLDEN_BELL_BOOKS) {
  for (const lesson of book.lessons || []) {
    if (lesson.experience?.kind !== "guided-concept") continue;
    guidedLessons.push({
      bookId: book.id,
      lessonId: lesson.id,
      family: lesson.experience.family,
      experience: lesson.experience
    });
  }
}

const failures = [];
const supportedExceptions = [];
const supportedEmptyFrames = [];
const unsupportedExceptions = [];
const unsupportedRenderedFrames = [];
const frameRecords = new Map();
let beatCalls = 0;

for (const record of guidedLessons) {
  const beats = record.experience.beats;
  if (!Array.isArray(beats) || beats.length === 0) {
    failures.push(`${lessonKey(record)} has no guided beats`);
    frameRecords.set(lessonKey(record), []);
    continue;
  }

  const supported = isSupportedFamily(record.family);
  const rendered = [];
  for (let step = 0; step < beats.length; step += 1) {
    beatCalls += 1;
    try {
      const html = guidedConceptVisual(record.experience, step);
      const normalized = normalizeFrame(html);
      rendered.push({ step, html: normalized, error: null });
      if (supported && !normalized) {
        supportedEmptyFrames.push(`${lessonKey(record)} beat=${step + 1}`);
      }
      if (!supported && normalized) {
        unsupportedRenderedFrames.push(`${lessonKey(record)} beat=${step + 1}`);
      }
    } catch (error) {
      const detail = `${lessonKey(record)} beat=${step + 1}: ${error?.message || error}`;
      rendered.push({ step, html: "", error: detail });
      (supported ? supportedExceptions : unsupportedExceptions).push(detail);
    }
  }
  frameRecords.set(lessonKey(record), rendered);
}

const unsupportedLessons = guidedLessons
  .filter((record) => !isSupportedFamily(record.family))
  .sort((left, right) => lessonKey(left).localeCompare(lessonKey(right)));
const expectedUnsupported = UNSUPPORTED_ALLOWLIST
  .map(([bookId, lessonId, family]) => ({ bookId, lessonId, family }))
  .sort((left, right) => lessonKey(left).localeCompare(lessonKey(right)));
const observedUnsupportedKeys = unsupportedLessons.map(lessonKey);
const expectedUnsupportedKeys = expectedUnsupported.map(lessonKey);

console.log(`UNSUPPORTED_GUIDED_FAMILIES count=${unsupportedLessons.length}`);
for (const record of unsupportedLessons) {
  console.log(`- ${record.bookId}/${record.lessonId} | ${record.family ?? "<missing>"}`);
}

if (JSON.stringify(observedUnsupportedKeys) !== JSON.stringify(expectedUnsupportedKeys)) {
  const observed = new Set(observedUnsupportedKeys);
  const expected = new Set(expectedUnsupportedKeys);
  const added = observedUnsupportedKeys.filter((key) => !expected.has(key));
  const removed = expectedUnsupportedKeys.filter((key) => !observed.has(key));
  failures.push(`unsupported allowlist drift; added=[${added.join(", ")}]; removed=[${removed.join(", ")}]`);
}

if (supportedExceptions.length) failures.push(`supported renderer exceptions: ${supportedExceptions.join("; ")}`);
if (supportedEmptyFrames.length) failures.push(`supported empty HTML: ${supportedEmptyFrames.join("; ")}`);
if (unsupportedExceptions.length) failures.push(`unsupported renderer exceptions: ${unsupportedExceptions.join("; ")}`);
if (unsupportedRenderedFrames.length) {
  failures.push(`unsupported families now render; update support rules and allowlist: ${unsupportedRenderedFrames.join("; ")}`);
}

for (const targetLessonId of ["number-inference", "relative-order-running"]) {
  const matches = guidedLessons.filter((record) => record.lessonId === targetLessonId);
  if (matches.length !== 1) {
    failures.push(`${targetLessonId}: expected exactly one guided lesson, found ${matches.length}`);
    continue;
  }
  const record = matches[0];
  const frames = frameRecords.get(lessonKey(record)) || [];
  const lastBeat = record.experience.beats.length - 1;
  const finalFrame = frames.find((frame) => frame.step === lastBeat);
  if (!finalFrame || finalFrame.error || !finalFrame.html) {
    failures.push(`${lessonKey(record)} did not render its final beat`);
    continue;
  }
  console.log(`FINAL_BEAT_RENDER_OK id=${record.bookId}/${record.lessonId} beat=${lastBeat + 1}`);
}

const bookNinePhases = ["problem", "organize", "calculate", "verify"];
const bookNineFamilies = ["book09-area", "book09-cube", "book09-magic", "book09-consecutive"];

function independentlyCalculateBookNine(record) {
  const visual = record.experience.model?.visual;
  if (record.family === "book09-area") {
    const points = visual.points.map(([x, y]) => [Number(x), Number(y)]);
    return Math.abs(points.reduce((sum, [x, y], index) => {
      const [nextX, nextY] = points[(index + 1) % points.length];
      return sum + x * nextY - nextX * y;
    }, 0)) / 2;
  }
  if (record.family === "book09-cube") {
    return visual.map.flat().reduce((sum, height) => sum + Number(height), 0);
  }
  if (record.family === "book09-magic") {
    const size = Number(visual.size);
    const blank = visual.shown.findIndex((value) => !Number.isFinite(Number(value)));
    const rowStart = Math.floor(blank / size) * size;
    const row = visual.shown.slice(rowStart, rowStart + size);
    return Number(visual.lineSum) - row.reduce((sum, value) => Number.isFinite(Number(value)) ? sum + Number(value) : sum, 0);
  }
  if (record.family === "book09-consecutive") {
    let total = 0;
    for (let value = Number(visual.from); value <= Number(visual.to); value += 1) total += value;
    return total;
  }
  throw new Error(`${record.family}: no independent calculation`);
}

for (const family of bookNineFamilies) {
  const matches = guidedLessons.filter((record) => record.family === family);
  if (matches.length !== 1) {
    failures.push(`${family}: expected exactly one guided lesson, found ${matches.length}`);
    continue;
  }
  const record = matches[0];
  const phases = record.experience.beats.map((beat) => beat.phase);
  if (JSON.stringify(phases) !== JSON.stringify(bookNinePhases)) {
    failures.push(`${lessonKey(record)} phases=${JSON.stringify(phases)} expected=${JSON.stringify(bookNinePhases)}`);
  }
  const frames = frameRecords.get(lessonKey(record)) || [];
  if (frames.length !== bookNinePhases.length) {
    failures.push(`${lessonKey(record)} rendered ${frames.length} frames instead of ${bookNinePhases.length}`);
    continue;
  }
  for (const [index, phase] of bookNinePhases.entries()) {
    const frame = frames[index];
    if (frame.error || !frame.html.includes(`data-book09-phase="${phase}"`)) {
      failures.push(`${lessonKey(record)} beat=${index + 1} is not the ${phase} frame`);
    }
    if (/\b(?:NaN|undefined)\b/.test(frame.html)) {
      failures.push(`${lessonKey(record)} beat=${index + 1} contains an invalid computed value`);
    }
    const expectedRole = phase === "problem" ? "given" : phase === "verify" ? "verify" : "action";
    if (!frame.html.includes(`data-color-role="${expectedRole}"`)) {
      failures.push(`${lessonKey(record)} beat=${index + 1} lacks ${expectedRole} color semantics`);
    }
    const expectedColor = phase === "problem" ? "#187fa9" : phase === "verify" ? "#16734b" : "#d39b20";
    if (!frame.html.includes(expectedColor)) {
      failures.push(`${lessonKey(record)} beat=${index + 1} does not visibly use its ${expectedRole} color`);
    }
    if (phase !== "verify" && /data-book09-(?:answer|check)=/.test(frame.html)) {
      failures.push(`${lessonKey(record)} beat=${index + 1} exposes answer or verification data before verify`);
    }
    if (phase !== "verify" && frame.html.includes("#16734b")) {
      failures.push(`${lessonKey(record)} beat=${index + 1} uses the verified color before verify`);
    }
    if (phase !== "verify" && /data-total=/.test(frame.html)) {
      failures.push(`${lessonKey(record)} beat=${index + 1} exposes a hidden total before verify`);
    }
  }
  if (!frames[2].html.includes("data-book09-expression")) {
    failures.push(`${lessonKey(record)} calculate frame has no unresolved expression`);
  }
  if (!frames[3].html.includes("data-book09-answer=") || !frames[3].html.includes("data-book09-check=")) {
    failures.push(`${lessonKey(record)} verify frame lacks the answer or independent check`);
  }
  const renderedAnswer = frames[3].html.match(/data-book09-answer="([^"]+)"/)?.[1];
  const independentAnswer = independentlyCalculateBookNine(record);
  if (Number(renderedAnswer) !== independentAnswer) {
    failures.push(`${lessonKey(record)} verify answer ${renderedAnswer} differs from independent model calculation ${independentAnswer}`);
  }
  if (new Set(frames.map((frame) => frame.html)).size !== bookNinePhases.length) {
    failures.push(`${lessonKey(record)} does not have four unique semantic frames`);
  }
  console.log(`BOOK09_PHASE_RENDER_OK id=${record.bookId}/${record.lessonId} phases=${bookNinePhases.join("->")} answerHiddenBeforeVerify=pass`);
}

const identicalFrameCandidates = [];
for (const record of guidedLessons.filter((item) => isSupportedFamily(item.family))) {
  const frames = (frameRecords.get(lessonKey(record)) || []).filter((frame) => !frame.error && frame.html);
  const uniqueFrames = new Set(frames.map((frame) => frame.html));
  if (frames.length > 1 && uniqueFrames.size < frames.length) {
    identicalFrameCandidates.push({
      id: `${record.bookId}/${record.lessonId}`,
      family: record.family,
      beats: frames.length,
      unique: uniqueFrames.size,
      duplicates: frames.length - uniqueFrames.size
    });
  }
}

const duplicateFrameCount = identicalFrameCandidates.reduce((sum, item) => sum + item.duplicates, 0);
console.log(`IDENTICAL_FRAME_CANDIDATES count=${identicalFrameCandidates.length} duplicateFrames=${duplicateFrameCount}`);
for (const candidate of identicalFrameCandidates) {
  console.log(`- ${candidate.id} | ${candidate.family} | beats=${candidate.beats} unique=${candidate.unique} duplicates=${candidate.duplicates}`);
}

if (failures.length) {
  throw new Error(`GOLDEN_BELL_GUIDED_EXPERIENCE_AUDIT_FAILED\n- ${failures.join("\n- ")}`);
}

const supportedLessonCount = guidedLessons.length - unsupportedLessons.length;
console.log(
  `GOLDEN_BELL_GUIDED_EXPERIENCE_AUDIT_OK books=${GOLDEN_BELL_BOOKS.length} ` +
  `guidedLessons=${guidedLessons.length} beats=${beatCalls} supportedLessons=${supportedLessonCount} ` +
  `unsupportedLessons=${unsupportedLessons.length} supportedExceptions=0 supportedEmptyHtml=0`
);
