#!/usr/bin/env node
'use strict';

/**
 * Validate and optionally upload the licensed Bricks Reading 250 questions.
 * Question wording stays in a local, gitignored JSON file; this script only
 * carries the validated arrays to lesson_content.original_questions.
 */
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const apply = args.includes('--apply');
const fileArg = args.find(arg => !arg.startsWith('--'));
if (!fileArg) {
  console.error('Usage: node scripts/import-bricks-250-questions.js <private-question-json> [--apply]');
  process.exit(2);
}

const url = process.env.SUPABASE_URL || 'https://fgahqumaldheqettmvqg.supabase.co';
const key = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
if (apply && !key) {
  console.error('Missing SUPABASE_KEY (or SUPABASE_SERVICE_ROLE_KEY / SUPABASE_ANON_KEY).');
  process.exit(2);
}

const payload = JSON.parse(fs.readFileSync(path.resolve(fileArg), 'utf8'));
const rows = [];

function lessonId(level, unit) {
  return level === 1 ? `br${unit}` : `brl${level}-${String(unit).padStart(2, '0')}`;
}

function validateQuestion(question, level, unit, index) {
  const label = `Level ${level} Unit ${unit} question ${index + 1}`;
  if (!Array.isArray(question) || question.length < 4) throw new Error(`${label}: invalid row`);
  if (typeof question[0] !== 'string' || !question[0].trim()) throw new Error(`${label}: strategy missing`);
  if (typeof question[1] !== 'string' || !question[1].trim()) throw new Error(`${label}: prompt missing`);
  const expectedChoices = index >= 1 && index <= 3 ? 2 : 3;
  if (!Array.isArray(question[2]) || question[2].length !== expectedChoices || question[2].some(choice => typeof choice !== 'string' || !choice.trim())) {
    throw new Error(`${label}: expected ${expectedChoices} non-empty choices`);
  }
  const allowedAnswers = expectedChoices === 2 ? ['A', 'B'] : ['A', 'B', 'C'];
  if (!allowedAnswers.includes(String(question[3] || '').toUpperCase())) throw new Error(`${label}: invalid answer`);
}

for (const level of [1, 2, 3]) {
  const units = payload.levels?.[String(level)] || [];
  if (units.length !== 20) throw new Error(`Level ${level}: expected 20 units, found ${units.length}`);
  units.forEach((unit, index) => {
    const unitNumber = Number(unit.unit);
    if (unitNumber !== index + 1) throw new Error(`Level ${level}: expected unit ${index + 1}, found ${unit.unit}`);
    if (!Array.isArray(unit.questions) || unit.questions.length !== 9) {
      throw new Error(`Level ${level} Unit ${unitNumber}: expected 9 questions`);
    }
    unit.questions.forEach((question, questionIndex) => validateQuestion(question, level, unitNumber, questionIndex));
    rows.push({
      level,
      unit: unitNumber,
      bookId: `bricks-reading-250-${level}`,
      lessonId: lessonId(level, unitNumber),
      questions: unit.questions,
    });
  });
}

if (rows.length !== 60) throw new Error(`Expected 60 lesson rows, found ${rows.length}`);

function headers(prefer) {
  const result = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  };
  if (prefer) result.Prefer = prefer;
  return result;
}

function endpoint(row, select) {
  const base = `${url.replace(/\/$/, '')}/rest/v1/lesson_content`;
  const query = `book_id=eq.${encodeURIComponent(row.bookId)}&lesson_id=eq.${encodeURIComponent(row.lessonId)}`;
  return `${base}?${query}${select ? `&select=${select}` : ''}`;
}

async function update(row) {
  const response = await fetch(endpoint(row), {
    method: 'PATCH',
    headers: headers('return=minimal'),
    body: JSON.stringify({ original_questions: row.questions }),
  });
  if (!response.ok) throw new Error(`${row.bookId}/${row.lessonId}: ${response.status} ${await response.text()}`);
}

async function verify(row) {
  const response = await fetch(endpoint(row, 'original_questions'), { headers: headers() });
  if (!response.ok) throw new Error(`${row.bookId}/${row.lessonId}: verification failed (${response.status})`);
  const body = await response.json();
  if (body.length !== 1 || !Array.isArray(body[0].original_questions) || body[0].original_questions.length !== 9) {
    throw new Error(`${row.bookId}/${row.lessonId}: verification returned the wrong question count`);
  }
}

(async () => {
  console.log(`Validated 60 Bricks Reading 250 lessons / 540 licensed questions. mode=${apply ? 'APPLY' : 'DRY-RUN'}`);
  console.log('Licensed wording is not printed.');
  if (!apply) return;
  for (const row of rows) {
    await update(row);
    await verify(row);
    console.log(`Level ${row.level} Unit ${row.unit}: updated and verified`);
  }
  console.log('Bricks Reading 250 original-question import complete.');
})().catch(error => {
  console.error(error.message || error);
  process.exit(1);
});
