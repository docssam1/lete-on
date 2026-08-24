#!/usr/bin/env node
'use strict';

/*
 * A second pass over the created practice sets, after check-practice-sets.js has
 * passed. That checker guards the mechanical rules — length, vocabulary, the
 * strategy order, the 3/3/3/3 split. It cannot see whether a question is any
 * good. This one goes after the three failures CLAUDE.md calls out by name,
 * picking the ones that leave a trace in the data:
 *
 *   Q7  Word Meaning       the word being asked about must appear in the passage.
 *   Q11 Figurative         the phrase being asked about must appear in the
 *                          passage, quoted the way the passage says it. A stem
 *                          that quotes a phrase the reader cannot find is not
 *                          answerable.
 *   Q6  Predictions        the answer must not be a sentence the passage already
 *                          states. Flagged when the answer's content words are
 *                          nearly all present in one passage sentence — that is
 *                          restatement wearing a prediction's clothes.
 *   any  Distractors       the Level D scaffold padded short choice lists with
 *                          fixed filler ("The passage does not support this
 *                          idea."). Any survivor means a set is still generated.
 *
 * Everything here is a candidate, not a verdict: a flag says look at this one.
 *
 *   node scripts/check-question-quality.js            # every lesson
 *   node scripts/check-question-quality.js lc3 cd8    # named lessons only
 */

const path = require('path');

const DATA = path.join(__dirname, '..', 'reading-world', 'data');

const FILLER = [
  'The passage does not support this idea.',
  'This choice changes an important detail from the passage.',
  'This choice focuses on something that never happened.',
  'This choice gives the opposite of what the passage explains.',
  'No one learned anything from the experience.',
  'The main character disliked every part of the event.',
  'The problem could never happen again.',
  'Nothing at all would change.',
  'Everyone would immediately abandon the plan.',
  'The opposite result would happen for no clear reason.',
  'They were completely alike in every way.',
  'They had nothing in common at all.',
];

// Words too common to count as evidence that an answer echoes the passage.
const STOP = new Set(('a an the and or but if then than that this these those of in on at to for from with '
  + 'by as is are was were be been being do does did will would can could should may might must have has had '
  + 'not no it its he she they them his her their you your i we our who what when where why how there here '
  + 'more most very much many some any all one two into out up down over under again also so because').split(' '));

const norm = s => String(s == null ? '' : s).replace(/[‘’]/g, "'").replace(/[“”]/g, '"');
const flat = arr => norm((arr || []).join(' '));
const content = s => norm(s).toLowerCase().replace(/[^a-z0-9' ]/g, ' ')
  .split(/\s+/).filter(w => w.length > 2 && !STOP.has(w));

// ws*.js assign into window.LESSONS without creating it, so it has to exist
// before anything loads.
function loadLessons() {
  global.window = { LESSONS: {} };
  const load = f => { try { require(path.join(DATA, f)); } catch (e) { /* optional */ } };
  for (let i = 1; i <= 10; i++) load(`lesson${i}.js`);
  for (let i = 1; i <= 10; i++) load(`lc${i}.js`);
  load('cd1.js');
  load('cars-d-engine.js');
  for (let i = 2; i <= 15; i++) load(`cd${i}-data.js`);
  for (let i = 1; i <= 7; i++) load(`rp${i}.js`);
  for (let i = 1; i <= 12; i++) load(`ws${i}.js`);
  for (let i = 1; i <= 16; i++) load(`sl${i}.js`);
  for (let i = 1; i <= 20; i++) load(`br${i}.js`);
  return global.window;
}

function setsFor(win, id) {
  if (id === 'lesson1') {
    const L = win.LESSON1;
    if (!L) return null;
    return [['추가 학습', L.originalExtraPassage, L.originalExtraQuestions],
      ['유사 지문', L.extraPassage, L.extraQuestions]];
  }
  const L = (win.LESSONS || {})[id];
  if (!L) return null;
  return [['추가 학습', (L.extraLearning || {}).passage, (L.extraLearning || {}).questions],
    ['유사 지문', (L.newPassage || {}).passage, (L.newPassage || {}).questions]];
}

// The stem asks about a word or phrase; pull it back out. Two house styles are
// in use: B and C quote it, Level D writes "the word X means" bare. The quote
// often ends a sentence, so its final full stop belongs to the stem rather than
// to the phrase and has to come off before searching the passage.
function quoted(stem) {
  const s = norm(stem);
  // A possessive earlier in the stem ("the coach's word 'recharge'") must not be
  // read as the opening quote, so the mark has to follow a non-letter.
  const m = s.match(/(?:^|[^A-Za-z])'([^']{2,80})'/)
    || s.match(/"([^"]{2,80})"/)
    || s.match(/\bthe (?:word|phrase) ([a-z][a-z'-]*)\b/i)
    // Level C also writes "In the story, a silo is" and "The story says Grace
    // paused before her turn", naming the word without marking it.
    || s.match(/^In [^,]+, an? ([a-z][a-z'-]*) (?:is|means)\b/i)
    || s.match(/^The \w+ says \w+ ([a-z][a-z'-]*)\b/i);
  return m ? String(m[1] || m[2]).replace(/[.,;:!?]+$/, '').trim() : null;
}

function checkQuoted(passage, q, n, label) {
  const phrase = quoted(q[1]);
  if (!phrase) return `Q${n} ${label}: 인용 어구 없음 — 지문에서 찾을 대상이 문항에 없음`;
  const hay = flat(passage).toLowerCase();
  if (hay.includes(phrase.toLowerCase())) return null;
  // A phrase can be quoted with the passage's inflection trimmed; say so rather
  // than claiming it is absent outright.
  const parts = content(phrase);
  const present = parts.filter(w => hay.includes(w));
  return present.length === parts.length
    ? `Q${n} ${label}: '${phrase}' 축자 불일치 (낱말은 모두 지문에 있음)`
    : `Q${n} ${label}: '${phrase}' 지문에 없음`;
}

// A prediction or a conclusion that merely repeats a sentence the passage
// already contains. Both strategies fail the same way: the answer can be found
// by matching text instead of by thinking.
function checkRestated(passage, q, n, label) {
  const answer = content(q[2]['ABCD'.indexOf(q[3])]);
  if (answer.length < 4) return null;
  const sentences = flat(passage).split(/(?<=[.!?])\s+/);
  let worst = null;
  sentences.forEach(s => {
    const bag = new Set(content(s));
    const hit = answer.filter(w => bag.has(w)).length / answer.length;
    if (hit >= 0.8 && (!worst || hit > worst.hit)) worst = { hit, s: s.trim() };
  });
  return worst
    ? `Q${n} ${label}: 정답이 지문 문장을 되풀이함 (${Math.round(worst.hit * 100)}% 일치) — "${worst.s.slice(0, 70)}…"`
    : null;
}

function checkFiller(q, n) {
  const hits = (q[2] || []).filter(c => FILLER.includes(norm(c).trim()));
  return hits.length ? `Q${n} 오답: 스캐폴드 상투구 ${hits.length}개` : null;
}

// lc8's prediction failed this way: every wrong choice was a refusal, so the one
// choice that was not a refusal stood out without reading anything. A question
// whose distractors are all negative is answerable by shape alone.
const NEGATIVE = /\b(never|refuse[sd]?|not|no one|nobody|nothing|stop(?:ped)?\s+(?:going|helping|trying)|throw\s+it\s+away|give\s+up|ignore[sd]?|forget|forgot)\b/i;
function checkNegativeDistractors(q, n) {
  const idx = 'ABCD'.indexOf(q[3]);
  const wrongs = (q[2] || []).filter((_, i) => i !== idx);
  if (wrongs.length !== 3) return null;
  const neg = wrongs.filter(c => NEGATIVE.test(norm(c))).length;
  if (neg === 3 && !NEGATIVE.test(norm(q[2][idx]))) {
    return `Q${n} 오답: 오답 3개가 전부 부정형 — 정답만 긍정이라 읽지 않아도 골라짐`;
  }
  return null;
}

// CLAUDE.md's rule for Q12: a wrong choice must be plausible-but-impossible, not
// the childish "an animal talks". A young reader dismisses those on sight.
const TALKING_ANIMAL = /\b(dog|cat|cow|owl|spider|turtle|rabbit|bird|fish|horse|bear|elephant|whale|tree|flower)s?\b[^.]{0,40}\b(talk|talks|talked|speak|speaks|spoke|says|said|sings|sang|laughs|laughed|reads|read|writes|wrote)\b/i;
function checkChildishDistractor(q, n) {
  const idx = 'ABCD'.indexOf(q[3]);
  const hits = (q[2] || []).filter((c, i) => i !== idx && TALKING_ANIMAL.test(norm(c)));
  return hits.length ? `Q${n} 오답: 유치한 '동물이 말한다'류 ${hits.length}개 — ${JSON.stringify(hits[0])}` : null;
}

// Length is the oldest test-wise cue there is: if the longest choice is usually
// the right one, a reader learns to pick the long one. One question proves
// nothing, so this is judged over the whole set of twelve.
function checkLengthCue(questions) {
  let longest = 0;
  questions.forEach(q => {
    const lens = (q[2] || []).map(c => norm(c).length);
    // "Who was the umpire?" answered with four names cannot be padded into
    // fairness, and no child picks a name for being three letters longer. Only
    // choices with room to differ are judged.
    if (Math.max(...lens) < 25) return;
    const max = Math.max(...lens);
    if (lens[('ABCD').indexOf(q[3])] === max && lens.filter(l => l === max).length === 1) longest++;
  });
  return longest >= 6
    ? `세트 전체: 12문항 중 ${longest}개에서 정답이 가장 긴 보기 — 길이만 보고 찍을 수 있음`
    : null;
}

function main() {
  const win = loadLessons();
  const range = (p, n) => [...Array(n)].map((_, i) => `${p}${i + 1}`);
  const ids = process.argv.slice(2).length ? process.argv.slice(2)
    : range('lesson', 10).concat(range('lc', 10), range('cd', 15),
        range('rp', 7), range('ws', 12), range('sl', 16));

  let flagged = 0;
  let sets = 0;

  ids.forEach(id => {
    const found = setsFor(win, id);
    if (!found) { console.log(`${id}  레슨을 찾을 수 없음`); return; }
    found.forEach(([label, passage, questions]) => {
      if (!passage || !questions || questions.length !== 12) return;
      sets++;
      const notes = [];
      notes.push(checkQuoted(passage, questions[6], 7, '어휘'));
      notes.push(checkQuoted(passage, questions[10], 11, '비유'));
      notes.push(checkRestated(passage, questions[5], 6, '예측'));
      notes.push(checkRestated(passage, questions[7], 8, '추론'));
      notes.push(checkChildishDistractor(questions[11], 12));
      notes.push(checkLengthCue(questions));
      questions.forEach((q, i) => {
        notes.push(checkFiller(q, i + 1));
        notes.push(checkNegativeDistractors(q, i + 1));
      });
      const real = notes.filter(Boolean);
      if (real.length) {
        flagged += real.length;
        console.log(`\n${id} / ${label}`);
        real.forEach(x => console.log(`  ${x}`));
      }
    });
  });

  console.log(flagged
    ? `\n검토 대상 ${flagged}건 / 세트 ${sets}개`
    : `\n세트 ${sets}개 — 검토 대상 없음`);
}

main();
