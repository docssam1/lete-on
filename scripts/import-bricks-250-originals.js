#!/usr/bin/env node
'use strict';

/** Validate and optionally upload private Bricks 250 Level 2/3 originals. */
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const apply = args.includes('--apply');
const fileArg = args.find((arg) => !arg.startsWith('--'));
if (!fileArg) {
  console.error('Usage: node scripts/import-bricks-250-originals.js <private-normalized-json> [--apply]');
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
for (const level of [2, 3]) {
  const units = payload.levels?.[String(level)] || [];
  if (units.length !== 20) throw new Error(`Level ${level}: expected 20 units, found ${units.length}.`);
  for (const unit of units) {
    const lessonId = `brl${level}-${String(unit.unit).padStart(2, '0')}`;
    const passage = unit.original?.paragraphs;
    if (!Array.isArray(passage) || !passage.length) throw new Error(`${lessonId}: original passage missing.`);
    if (unit.original?.needsReview) throw new Error(`${lessonId}: source is still marked needsReview.`);
    const wordCount = passage.join(' ').trim().split(/\s+/).filter(Boolean).length;
    if (wordCount < 180 || wordCount > 330) throw new Error(`${lessonId}: suspicious original length ${wordCount}.`);
    rows.push({
      book_id: `bricks-reading-250-${level}`,
      lesson_id: lessonId,
      original_passage: passage,
    });
  }
}
if (rows.length !== 40) throw new Error(`Expected 40 rows, found ${rows.length}.`);

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
  console.log(`Validated ${rows.length} private Bricks originals. mode=${apply ? 'APPLY' : 'DRY-RUN'}`);
  if (!apply) return;
  for (const row of rows) {
    await upsert(row);
    console.log(`${row.lesson_id}: upserted`);
  }
})().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
