#!/usr/bin/env node
'use strict';

/*
 * Checks the created practice sets — 추가 학습 (extraLearning) and 유사 지문
 * (newPassage) — against the rules they are written to. It reads only public
 * data files in reading-world/data; the licensed originals stay in Supabase and
 * are represented here by their word count alone, which gives nothing away.
 *
 *   node scripts/check-practice-sets.js               # every lesson
 *   node scripts/check-practice-sets.js lesson7 cd3   # named lessons only
 *
 * Exits non-zero if anything fails, so it can gate a commit.
 *
 * ── What a practice set has to satisfy ────────────────────────────────────────
 *  1. Length      85–125% of the licensed original it practises. A passage far
 *                 shorter than the original cannot carry twelve strategies.
 *  2. Vocabulary  유사 지문 must use all twelve of the lesson's words, in the exact
 *                 form taught — a lesson teaching "reply" is not served by a
 *                 passage that only ever says "replied". 추가 학습 carries the
 *                 original's subject and form instead, so its job is continuity,
 *                 not vocabulary; gaps there are reported but not counted as
 *                 failures. (Levels B and D were rewritten to satisfy both.)
 *  3. Questions   exactly twelve, in the fixed strategy order for that book.
 *                 Level D writes Recognising / Identifying Author's Purpose /
 *                 Summarising where B and C write Recognizing / Understanding
 *                 Author's Purpose / Distinguishing Between Real and Make-believe.
 *  4. Shape       each question is [strategy, stem, [4 choices], letter, why];
 *                 the four choices are distinct, the letter is A–D, the choice it
 *                 points at is not empty, and the explanation is a real sentence.
 *  5. Answers     exactly 3A / 3B / 3C / 3D. This is the one that matters most:
 *                 a set skewed towards one letter can be passed by pressing that
 *                 letter, which is a strategy a young reader really does find.
 *  6. Keys        no two sets in a book share the same twelve-letter answer key.
 *
 * Rule 6 is cosmetic next to the others and is reported separately.
 *
 * The rules above are the whole specification. Anyone — or anything — writing a
 * replacement passage can be handed this file and checked against it; a model's
 * own report that "the distribution is 3/3/3/3" is not evidence, and has been
 * wrong here more than once.
 */

const fs = require('fs');
const path = require('path');

const DATA = path.join(__dirname, '..', 'reading-world', 'data');

// Word counts of the licensed originals. Numbers only — never the text.
const ORIGINAL_WORDS = {
  lesson1: 294, lesson2: 247, lesson3: 287, lesson4: 233, lesson5: 219,
  lesson6: 255, lesson7: 204, lesson8: 298, lesson9: 306, lesson10: 288,
  lc1: 269, lc2: 279, lc3: 348, lc4: 373, lc5: 305,
  lc6: 570, lc7: 517, lc8: 614, lc9: 787, lc10: 550,
  cd1: 214, cd2: 337, cd3: 318, cd4: 302, cd5: 93, cd6: 649, cd7: 625, cd8: 615,
  cd9: 680, cd10: 701, cd11: 310, cd12: 179, cd13: 270, cd14: 318, cd15: 335,
  // Bricks Reading 250 Level 1, counted off the publisher's dictation script.
  // The series name is a word-count tier and it holds: 215-242, mean 231.
  br1: 231, br2: 237, br3: 223, br4: 228, br5: 224, br6: 229, br7: 229,
  br8: 240, br9: 232, br10: 236, br11: 236, br12: 228, br13: 215, br14: 227,
  br15: 240, br16: 236, br17: 242, br18: 234, br19: 233, br20: 221,
};

// Every lesson the checker looks at. This used to be derived from
// ORIGINAL_WORDS, which quietly excluded the three books whose originals have
// never been measured — Reading Prime, WonderSkills and Subject Link were
// skipped in silence for as long as they have existed, and "70 sets all pass"
// meant seventy sets were looked at rather than that the app was clean. The
// list is explicit now, and a lesson missing from ORIGINAL_WORDS simply skips
// the length rule (see checkSet) instead of vanishing.
const range = (prefix, n) => Array.from({ length: n }, (_, i) => `${prefix}${i + 1}`);
const ALL_LESSONS = [
  ...range('lesson', 10), ...range('lc', 10), ...range('cd', 15),
  ...range('rp', 7), ...range('ws', 12), ...range('sl', 16),
  ...range('br', 20),
];

const STRATEGIES = {
  'cars-level-b': [
    'Finding Main Idea', 'Recalling Facts and Details', 'Understanding Sequence',
    'Recognizing Cause and Effect', 'Comparing and Contrasting', 'Making Predictions',
    'Finding Word Meaning in Context', 'Drawing Conclusions and Making Inferences',
    'Distinguishing Between Fact and Opinion', "Understanding Author's Purpose",
    'Interpreting Figurative Language', 'Distinguishing Between Real and Make-believe',
  ],
  'cars-level-d': [
    'Finding Main Idea', 'Recalling Facts and Details', 'Understanding Sequence',
    'Recognising Cause and Effect', 'Comparing and Contrasting', 'Making Predictions',
    'Finding Word Meaning in Context', 'Drawing Conclusions and Making Inferences',
    'Distinguishing Between Fact and Opinion', "Identifying Author's Purpose",
    'Interpreting Figurative Language', 'Summarising',
  ],
};
STRATEGIES['cars-level-c'] = STRATEGIES['cars-level-b'];
// The three non-CARS books follow the B/C spelling of the twelve strategies.
STRATEGIES['reading-prime-1'] = STRATEGIES['cars-level-b'];
STRATEGIES['wonderskills-adv3'] = STRATEGIES['cars-level-b'];
STRATEGIES['subject-link-4'] = STRATEGIES['cars-level-b'];
// Bricks Reading asks nine questions of its own — one MCQ, three true/false,
// four MCQ, one MCQ, three options throughout — and labels no strategy per
// question. That shape belongs to the licensed original. The created sets are
// written to the CARS twelve on instruction, so they are checked against it.
// Ten Word Box words per unit rather than twelve; rule 2 counts whatever the
// lesson teaches, so nothing there needs changing.
STRATEGIES['bricks-reading-250-1'] = STRATEGIES['cars-level-b'];

const MIN_PCT = 85;
const MAX_PCT = 125;
const LETTERS = 'ABCD';

// Typographic and straight apostrophes are the same letter as far as these
// checks are concerned; the data files disagree with each other about which to
// use and that is not worth failing a lesson over.
const norm = s => String(s == null ? '' : s).replace(/[‘’]/g, "'").trim();
const words = arr => (arr || []).reduce(
  (n, p) => n + String(p).split(/\s+/).filter(Boolean).length, 0);

function loadLessons() {
  // ws*.js assign into window.LESSONS without creating it first, so it has to
  // exist before anything is loaded.
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

// Lesson 1 of Level B predates window.LESSONS and is still a flat global under
// its own key, with differently named fields. Everything else is uniform.
function setsFor(win, id) {
  if (id === 'lesson1') {
    const L = win.LESSON1;
    if (!L) return null;
    return {
      bookId: 'cars-level-b', words: L.words || [], sets: [
        ['추가 학습', L.originalExtraPassage, L.originalExtraQuestions],
        ['유사 지문', L.extraPassage, L.extraQuestions],
      ],
    };
  }
  const L = (win.LESSONS || {})[id];
  if (!L) return null;
  return {
    bookId: L.bookId, words: L.words || [], sets: [
      ['추가 학습', (L.extraLearning || {}).passage, (L.extraLearning || {}).questions],
      ['유사 지문', (L.newPassage || {}).passage, (L.newPassage || {}).questions],
    ],
  };
}

function checkSet(id, label, passage, questions, vocab, bookId) {
  const problems = [];
  const notes = [];
  // Only 유사 지문 is written around the twelve words; see rule 2.
  const vocabRequired = label === '유사 지문';
  if (!passage || !questions) return { problems: ['세트 없음'], notes, key: '', pct: 0, n: 0 };

  const total = words(passage);
  const target = ORIGINAL_WORDS[id];
  const pct = target ? Math.round((total / target) * 100) : null;
  if (pct !== null && (pct < MIN_PCT || pct > MAX_PCT)) {
    problems.push(`길이 ${pct}% (${MIN_PCT}–${MAX_PCT}% 밖)`);
  }

  const text = norm(passage.join(' ')).toLowerCase();
  const missing = vocab
    .map(w => String(w[0]))
    .filter(w => !text.includes(norm(w).toLowerCase().split(' ')[0]));
  if (missing.length) {
    (vocabRequired ? problems : notes).push(`미사용 어휘: ${missing.join(', ')}`);
  }

  if (questions.length !== 12) problems.push(`문항 ${questions.length}개`);

  const canon = STRATEGIES[bookId];
  if (canon) {
    const wrong = questions
      .map((q, i) => (norm(q[0]) !== norm(canon[i]) ? `Q${i + 1}` : null))
      .filter(Boolean);
    if (wrong.length) problems.push(`전략 불일치: ${wrong.join(',')}`);
  }

  const bad = questions.map((q, i) => {
    if (!Array.isArray(q) || q.length !== 5) return `Q${i + 1}(형식)`;
    if (!Array.isArray(q[2]) || q[2].length !== 4) return `Q${i + 1}(보기수)`;
    if (new Set(q[2].map(norm)).size !== 4) return `Q${i + 1}(보기중복)`;
    if (!LETTERS.includes(q[3])) return `Q${i + 1}(정답문자)`;
    if (!norm(q[2][LETTERS.indexOf(q[3])])) return `Q${i + 1}(정답공백)`;
    if (norm(q[4]).length < 20) return `Q${i + 1}(해설)`;
    return null;
  }).filter(Boolean);
  if (bad.length) problems.push(bad.join(' '));

  const count = { A: 0, B: 0, C: 0, D: 0 };
  questions.forEach(q => { if (LETTERS.includes(q[3])) count[q[3]]++; });
  const dist = `${count.A}/${count.B}/${count.C}/${count.D}`;
  if (dist !== '3/3/3/3') problems.push(`분포 ${dist}`);

  return { problems, notes, key: questions.map(q => q[3]).join(''), pct, n: total, dist };
}

function main() {
  const win = loadLessons();
  const requested = process.argv.slice(2);
  const ids = requested.length ? requested : ALL_LESSONS;

  let failures = 0;
  const keys = new Map();
  const rows = [];

  ids.forEach(id => {
    const lesson = setsFor(win, id);
    if (!lesson) { rows.push([id, '', '', '', '레슨을 찾을 수 없음']); failures++; return; }
    lesson.sets.forEach(([label, passage, questions]) => {
      const r = checkSet(id, label, passage, questions, lesson.words, lesson.bookId);
      if (r.problems.length) failures++;
      if (r.key) {
        const where = `${id}/${label}`;
        if (keys.has(r.key)) keys.set(r.key, keys.get(r.key).concat(where));
        else keys.set(r.key, [where]);
      }
      const status = r.problems.length ? r.problems.join(' · ')
        : (r.notes.length ? `OK  (참고: ${r.notes.join(' · ')})` : 'OK');
      const size = r.n ? (r.pct === null ? `${r.n}단어` : `${r.n}단어 ${r.pct}%`) : '';
      rows.push([id, label, size, r.dist || '', status]);
    });
  });

  const w = n => rows.reduce((m, r) => Math.max(m, String(r[n]).length), 0);
  const pad = (s, n) => String(s) + ' '.repeat(Math.max(0, n - String(s).length));
  rows.forEach(r => console.log(
    `${pad(r[0], w(0))}  ${pad(r[1], w(1))}  ${pad(r[2], w(2))}  ${pad(r[3], w(3))}  ${r[4]}`));

  const dupes = [...keys.entries()].filter(([, where]) => where.length > 1);
  if (dupes.length) {
    console.log('\n정답 키 중복 (경미):');
    dupes.forEach(([key, where]) => console.log(`  ${key}  ${where.join(', ')}`));
  }

  console.log(failures
    ? `\n실패 ${failures}건 / 세트 ${rows.length}개`
    : `\n세트 ${rows.length}개 전부 통과`);
  process.exit(failures ? 1 : 0);
}

main();
