#!/usr/bin/env node
'use strict';

/**
 * Merge private CARS Plus D layout metadata into Supabase lesson_content rows.
 *
 * IMPORTANT:
 * - This script contains NO licensed textbook wording.
 * - Pass the private metadata JSON as a local file that is NOT committed to Git.
 * - Existing original_passage and question items are preserved.
 * - Default mode is dry-run; pass --apply to write.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_KEY=... \
 *     node scripts/apply-cars-d-private-meta.js /path/to/cars-d-private-meta.json
 *
 *   SUPABASE_URL=... SUPABASE_KEY=... \
 *     node scripts/apply-cars-d-private-meta.js /path/to/cars-d-private-meta.json --apply
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const apply = args.includes('--apply');
const fileArg = args.find(a => !a.startsWith('--'));

if (!fileArg) {
  console.error('Usage: node scripts/apply-cars-d-private-meta.js <private-meta.json> [--apply]');
  process.exit(2);
}

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL and/or SUPABASE_KEY (or SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY).');
  process.exit(2);
}

const inputPath = path.resolve(fileArg);
let payload;
try {
  payload = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
} catch (err) {
  console.error(`Could not read private metadata JSON: ${err.message}`);
  process.exit(2);
}

const bookId = payload.bookId || 'cars-level-d';
const lessons = payload.lessons || {};
const ids = Object.keys(lessons).sort((a, b) => Number(a.replace(/\D/g, '')) - Number(b.replace(/\D/g, '')));
if (!ids.length) {
  console.error('No lessons found in payload.lessons.');
  process.exit(2);
}

function headers(prefer) {
  const h = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
  };
  if (prefer) h.Prefer = prefer;
  return h;
}

function endpoint(lessonId, select) {
  const u = new URL('/rest/v1/lesson_content', SUPABASE_URL);
  u.searchParams.set('book_id', `eq.${bookId}`);
  u.searchParams.set('lesson_id', `eq.${lessonId}`);
  if (select) u.searchParams.set('select', select);
  return u.toString();
}

function extractItems(raw) {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === 'object') {
    if (Array.isArray(raw.items)) return raw.items;
    if (Array.isArray(raw.questions)) return raw.questions;
  }
  return null;
}

function extractMeta(raw) {
  if (!raw || Array.isArray(raw) || typeof raw !== 'object') return {};
  return raw.meta || raw.layout || {};
}

function mergeMedia(oldMedia, newMedia) {
  const map = new Map();
  (Array.isArray(oldMedia) ? oldMedia : []).forEach(m => {
    if (m && m.type) map.set(m.type, { ...m });
  });
  (Array.isArray(newMedia) ? newMedia : []).forEach(m => {
    if (m && m.type) map.set(m.type, { ...(map.get(m.type) || {}), ...m });
  });
  return [...map.values()];
}

function mergeMeta(oldMeta, newMeta) {
  const merged = { ...(oldMeta || {}), ...(newMeta || {}) };
  if ((oldMeta && oldMeta.visualQuestions) || (newMeta && newMeta.visualQuestions)) {
    merged.visualQuestions = {
      ...((oldMeta && oldMeta.visualQuestions) || {}),
      ...((newMeta && newMeta.visualQuestions) || {}),
    };
  }
  if ((oldMeta && oldMeta.media) || (newMeta && newMeta.media)) {
    merged.media = mergeMedia(oldMeta && oldMeta.media, newMeta && newMeta.media);
  }
  return merged;
}

function validateLessonMeta(id, meta) {
  if (!meta || typeof meta !== 'object' || Array.isArray(meta)) {
    throw new Error(`${id}: metadata must be an object`);
  }
  if (meta.visualQuestions && typeof meta.visualQuestions !== 'object') {
    throw new Error(`${id}: visualQuestions must be an object`);
  }
  if (meta.media && !Array.isArray(meta.media)) {
    throw new Error(`${id}: media must be an array`);
  }
}

async function readRow(id) {
  const res = await fetch(endpoint(id, 'original_questions'), { headers: headers() });
  if (!res.ok) throw new Error(`${id}: GET failed ${res.status} ${await res.text()}`);
  const rows = await res.json();
  if (!rows || !rows.length) throw new Error(`${id}: no lesson_content row found`);
  if (rows.length > 1) throw new Error(`${id}: multiple lesson_content rows found`);
  return rows[0];
}

async function patchRow(id, originalQuestions) {
  const res = await fetch(endpoint(id), {
    method: 'PATCH',
    headers: headers('return=minimal'),
    body: JSON.stringify({ original_questions: originalQuestions }),
  });
  if (!res.ok) throw new Error(`${id}: PATCH failed ${res.status} ${await res.text()}`);
}

(async () => {
  console.log(`CARS D private metadata: ${ids.length} lesson(s), mode=${apply ? 'APPLY' : 'DRY-RUN'}`);
  let changed = 0;

  for (const id of ids) {
    const incoming = lessons[id];
    validateLessonMeta(id, incoming);

    const row = await readRow(id);
    const raw = row.original_questions;
    const items = extractItems(raw);
    if (!items || !items.length) throw new Error(`${id}: original question items are missing; refusing to overwrite`);

    const oldMeta = extractMeta(raw);
    const mergedMeta = mergeMeta(oldMeta, incoming);
    const next = { items, meta: mergedMeta };

    const visualCount = Object.keys(mergedMeta.visualQuestions || {}).length;
    const mediaCount = Array.isArray(mergedMeta.media) ? mergedMeta.media.length : 0;
    console.log(`${id}: questions=${items.length}, visualMeta=${visualCount}, mediaMeta=${mediaCount}${mergedMeta.instruction ? ', instruction=yes' : ''}`);

    if (apply) await patchRow(id, next);
    changed++;
  }

  console.log(`${apply ? 'Updated' : 'Validated'} ${changed} lesson(s). Private text was not printed.`);
})().catch(err => {
  console.error(err.message || err);
  process.exit(1);
});
