#!/usr/bin/env node
'use strict';

/** Validate and optionally upload the private Purple/Red vocabulary packs. */
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const apply = args.includes('--apply');
const fileArg = args.find((arg) => !arg.startsWith('--'));
if (!fileArg) {
  console.error('Usage: node scripts/import-vocabulary-workshop.js <private-json> [--apply]');
  process.exit(2);
}

const url = process.env.SUPABASE_URL || 'https://fgahqumaldheqettmvqg.supabase.co';
const key = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
if (apply && !key) {
  console.error('Missing SUPABASE_KEY (or SUPABASE_SERVICE_ROLE_KEY / SUPABASE_ANON_KEY).');
  process.exit(2);
}

const payload = JSON.parse(fs.readFileSync(path.resolve(fileArg), 'utf8'));
if (!payload.validation || payload.validation.ok !== true) throw new Error('Private extraction validation has not passed.');
const books = payload.books || [];
if (books.length !== 2) throw new Error(`Expected 2 books, found ${books.length}.`);

const expected = { 'vocabulary-workshop-purple': 14, 'vocabulary-workshop-red': 12 };
const rows = [];
for (const book of books) {
  if (book.units.length !== expected[book.bookId]) throw new Error(`${book.bookId}: wrong unit count.`);
  for (const unit of book.units) {
    if (!Array.isArray(unit.words) || unit.words.length !== 10) throw new Error(`${unit.lessonId}: needs 10 words.`);
    const terms = new Set();
    const words = unit.words.map(([term, definition]) => {
      if (!term || !definition) throw new Error(`${unit.lessonId}: blank term or definition.`);
      if (terms.has(term)) throw new Error(`${unit.lessonId}: duplicate ${term}.`);
      terms.add(term);
      return [term, definition];
    });
    rows.push({
      book_id: book.bookId,
      lesson_id: unit.lessonId,
      original_passage: [],
      original_questions: { kind: 'vocabulary-pack', words },
    });
  }
}
if (rows.length !== 26) throw new Error(`Expected 26 rows, found ${rows.length}.`);

async function upsert(row) {
  const response = await fetch(`${url.replace(/\/$/, '')}/rest/v1/lesson_content?on_conflict=book_id,lesson_id`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(row),
  });
  if (!response.ok) throw new Error(`${row.lesson_id}: ${response.status} ${await response.text()}`);
}

(async () => {
  console.log(`Validated ${rows.length} private vocabulary units (${rows.length * 10} words). mode=${apply ? 'APPLY' : 'DRY-RUN'}`);
  if (!apply) return;
  for (const row of rows) {
    await upsert(row);
    console.log(`${row.lesson_id}: upserted`);
  }
})().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
