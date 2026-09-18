import assert from "node:assert/strict";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-data.js";
import { renderBook07Guided } from "./golden-bell-book07-guided.js";

const TARGETS = Object.freeze([
  ["shared-polygon-matchsticks", "shape-sequence"],
  ["closed-loop-planting", "closed-loop"],
  ["venn-overlap-all", "venn-diagram"],
  ["calendar-weekday", "calendar-weekday"],
  ["clock-reading", "clock-reading"],
  ["multiplication-equation", "multiplication-equation"],
  ["arithmetic-sequence", "arithmetic-sequence"],
  ["assumption-score", "assumption-score"],
  ["reverse-growth", "reverse-growth"],
  ["reverse-digits", "reverse-digits"]
]);

const PHASES = Object.freeze(["given", "organize", "calculate", "verify"]);
const BLUE = "#187fa9";
const GOLD = "#d39b20";
const GREEN = "#16734b";
const WEEKDAYS = Object.freeze(["일", "월", "화", "수", "목", "금", "토"]);

function strictMatch(prompt, pattern, family) {
  const match = String(prompt || "").match(pattern);
  assert.ok(match, `${family}: current check prompt does not match the independent audit parser`);
  return match;
}

function independentAnswer(experience) {
  const prompt = experience.check?.prompt;
  switch (experience.family) {
    case "shape-sequence": {
      const [, shape, countText] = strictMatch(prompt, /정(삼각형|사각형|오각형|육각형)\s*(\d+)개/u, experience.family);
      const sides = { 삼각형: 3, 사각형: 4, 오각형: 5, 육각형: 6 }[shape];
      const count = Number(countText);
      return String(sides + (count - 1) * (sides - 1));
    }
    case "closed-loop": {
      const [, count, spacing] = strictMatch(prompt, /나무\s*(\d+)그루를\s*(\d+)m\s*간격/u, experience.family);
      return String(Number(count) * Number(spacing));
    }
    case "venn-diagram": {
      const [, total, left, right] = strictMatch(prompt, /전체\s*(\d+)명,\s*A\s*(\d+)명,\s*B\s*(\d+)명/u, experience.family);
      return String(Number(left) + Number(right) - Number(total));
    }
    case "calendar-weekday": {
      const [, start, days] = strictMatch(prompt, /([일월화수목금토])요일에서\s*(\d+)일\s*뒤/u, experience.family);
      return `${WEEKDAYS[(WEEKDAYS.indexOf(start) + Number(days)) % 7]}요일`;
    }
    case "clock-reading": {
      const [, minuteMark] = strictMatch(prompt, /긴바늘이\s*(\d+),\s*짧은바늘이\s*(\d+)와\s*(\d+)\s*사이/u, experience.family);
      return String((Number(minuteMark) % 12) * 5);
    }
    case "multiplication-equation": {
      const [, factor, product] = strictMatch(prompt, /(\d+)\s*×\s*□\s*=\s*(\d+)/u, experience.family);
      return String(Number(product) / Number(factor));
    }
    case "arithmetic-sequence": {
      const [, rawValues, rawPosition] = strictMatch(prompt, /^([\d,\s]+)에서\s*(\d+)번째\s*수/u, experience.family);
      const values = rawValues.split(",").map((value) => Number(value.trim()));
      const step = values[1] - values[0];
      return String(values[0] + (Number(rawPosition) - 1) * step);
    }
    case "assumption-score": {
      const [, low, high, count, total] = strictMatch(prompt, /(\d+)점과\s*(\d+)점\s*문제를\s*(\d+)개\s*풀어\s*(\d+)점이면/u, experience.family);
      return String((Number(total) - Number(low) * Number(count)) / (Number(high) - Number(low)));
    }
    case "reverse-growth": {
      const [, multiplierWord, fullDay, targetDay] = strictMatch(prompt, /매일\s*(두|세|\d+)\s*배가 되어\s*(\d+)일째\s*가득 차면\s*(\d+)일째/u, experience.family);
      const multiplier = { 두: 2, 세: 3 }[multiplierWord] ?? Number(multiplierWord);
      return String(1 / (multiplier ** (Number(fullDay) - Number(targetDay))));
    }
    case "reverse-digits": {
      const [, difference] = strictMatch(prompt, /차가\s*(\d+)이면\s*자리 차/u, experience.family);
      return String(Number(difference) / 9);
    }
    default:
      throw new Error(`${experience.family}: missing independent calculation`);
  }
}

function answerFrom(html) {
  return html.match(/data-book07-answer="([^"]+)"/u)?.[1];
}

function contentFrom(html) {
  const match = html.match(/<div data-book07-content[^>]*>([\s\S]*)<\/div><\/div>$/u);
  assert.ok(match, "guided frame has no content wrapper");
  return match[1].replace(/\s+/gu, " ").trim();
}

function assertFrame(html, family, phase) {
  assert.ok(html.trim(), `${family}/${phase}: empty HTML`);
  assert.doesNotMatch(html, /\b(?:NaN|undefined)\b|>null</u, `${family}/${phase}: invalid computed token`);
  assert.match(html, new RegExp(`data-book07-family="${family}"`, "u"), `${family}/${phase}: family marker missing`);
  assert.match(html, new RegExp(`data-book07-phase="${phase}"`, "u"), `${family}/${phase}: phase marker missing`);
  assert.match(html, /width:min\(100%,560px\);max-width:100%;min-width:0/u, `${family}/${phase}: mobile-safe root sizing missing`);
  if (phase === "given") {
    assert.match(html, new RegExp(BLUE, "iu"), `${family}/${phase}: given blue missing`);
    assert.match(html, /data-color-role="given"/u);
    assert.doesNotMatch(html, new RegExp(GOLD, "iu"), `${family}/${phase}: action gold leaked into the given stage`);
  } else if (phase === "verify") {
    assert.match(html, new RegExp(GREEN, "iu"), `${family}/${phase}: verify green missing`);
    assert.match(html, /data-color-role="verify"/u);
    assert.match(html, /data-book07-answer="[^"]+"/u, `${family}/${phase}: answer marker missing`);
    assert.match(html, /data-book07-check="[^"]+"/u, `${family}/${phase}: check marker missing`);
  } else {
    assert.match(html, new RegExp(GOLD, "iu"), `${family}/${phase}: action gold missing`);
    assert.match(html, /data-color-role="action"/u);
  }
  if (phase !== "verify") {
    assert.doesNotMatch(html, /data-book07-(?:answer|check)=/u, `${family}/${phase}: answer or check leaked before verify`);
    assert.doesNotMatch(html, new RegExp(GREEN, "iu"), `${family}/${phase}: verify green leaked before verify`);
    assert.doesNotMatch(html, /data-color-role="verify"/u, `${family}/${phase}: verify role leaked before verify`);
  }
}

const book = GOLDEN_BELL_BOOKS.find((item) => item.id === "book-07");
assert.ok(book, "book-07 is missing");

const seenFamilies = new Set();
let frameCount = 0;

for (const [lessonId, family] of TARGETS) {
  const matches = book.lessons.filter((lesson) => lesson.id === lessonId && lesson.experience?.family === family);
  assert.equal(matches.length, 1, `${lessonId}/${family}: expected exactly one actual lesson`);
  const experience = matches[0].experience;
  assert.equal(experience.kind, "guided-concept", `${lessonId}/${family}: not a guided concept`);
  assert.ok(Array.isArray(experience.beats) && experience.beats.length >= 3, `${lessonId}/${family}: actual beats missing`);
  seenFamilies.add(family);

  const sourceBeats = experience.beats;
  const phaseBeats = [
    { ...sourceBeats[0], phase: "given", action: "draw" },
    { ...sourceBeats[Math.min(1, sourceBeats.length - 1)], phase: "organize", action: "transform" },
    { ...sourceBeats[Math.min(1, sourceBeats.length - 1)], phase: "calculate", action: "calculate" },
    { ...sourceBeats[sourceBeats.length - 1], phase: "verify", action: "verify" }
  ];
  const frames = phaseBeats.map((beat, step) => renderBook07Guided(experience, beat, step));
  frames.forEach((html, index) => assertFrame(html, family, PHASES[index]));
  frameCount += frames.length;

  assert.equal(new Set(frames).size, PHASES.length, `${family}: identical full frames detected`);
  assert.equal(new Set(frames.map(contentFrom)).size, PHASES.length, `${family}: identical semantic content frames detected`);
  assert.match(frames[2], /data-book07-expression/u, `${family}: calculation frame has no unresolved expression`);

  const expected = independentAnswer(experience);
  const rendered = answerFrom(frames[3]);
  assert.equal(rendered, expected, `${family}: rendered answer ${rendered} differs from independent model answer ${expected}`);
  assert.ok(contentFrom(frames[3]).includes(expected), `${family}: verified answer is not visible in the final content`);

  const actualFrames = sourceBeats.map((beat, step) => renderBook07Guided(experience, beat, step));
  actualFrames.forEach((html, index) => {
    const expectedPhase = index === 0 ? "given" : beatPhase(sourceBeats[index], index);
    assertFrame(html, family, expectedPhase);
  });
  assert.equal(new Set(actualFrames.map(contentFrom)).size, actualFrames.length, `${family}: actual data beats render identical semantic frames`);

  const corrupted = { ...experience, model: { ...(experience.model || {}), answer: "__wrong__" } };
  assert.throws(
    () => renderBook07Guided(corrupted, phaseBeats[3], 3),
    /disagrees with the model calculation/u,
    `${family}: a declared model-answer mismatch was not rejected`
  );

  console.log(`BOOK07_GUIDED_OK family=${family} phases=${PHASES.join("->")} answer=${expected}`);
}

function beatPhase(beat, step) {
  if (beat?.action === "verify" || beat?.phase === "verify") return "verify";
  if (beat?.action === "calculate" || beat?.phase === "calculate") return "calculate";
  if (beat?.action === "transform" || beat?.phase === "organize") return "organize";
  return step === 0 ? "given" : "organize";
}

assert.equal(seenFamilies.size, TARGETS.length, "not all ten Book 7 families were audited");
assert.deepEqual([...seenFamilies].sort(), TARGETS.map(([, family]) => family).sort());

console.log(`GOLDEN_BELL_BOOK07_GUIDED_AUDIT_OK families=${seenFamilies.size} semanticFrames=${frameCount} actualData=pass answerLeak=0 modelMismatch=blocked`);
