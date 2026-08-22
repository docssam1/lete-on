#!/usr/bin/env node
'use strict';

/** Validate and optionally upload the publisher MP3 tracks for Levels 1, 2, and 3. */
const fs = require('fs');
const path = require('path');

function parseArgs() {
  const options = { apply: process.argv.includes('--apply') };
  for (let index = 2; index < process.argv.length; index += 1) {
    const arg = process.argv[index];
    if (!arg.startsWith('--') || arg === '--apply') continue;
    options[arg.slice(2)] = process.argv[index + 1];
    index += 1;
  }
  if (![1, 2, 3].some(level => options[`level${level}-dir`])) {
    throw new Error('Usage: node scripts/import-bricks-250-audio.js [--level1-dir DIR] [--level2-dir DIR] [--level3-dir DIR] [--apply]');
  }
  return options;
}

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://fgahqumaldheqettmvqg.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnYWhxdW1hbGRoZXFldHRtdnFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NjAzNDcsImV4cCI6MjA5NzIzNjM0N30.iUXLFteDc_xIp_Xj506BKTxnZRYMObmTYQ2Dgh9RAqs';

async function upload(filePath, storagePath) {
  const response = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/audio/${storagePath}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'audio/mpeg',
      'x-upsert': 'true',
    },
    body: fs.readFileSync(filePath),
  });
  if (!response.ok) throw new Error(`${storagePath}: ${response.status} ${await response.text()}`);
}

async function main() {
  const options = parseArgs();
  const tasks = [];
  for (const level of [1, 2, 3]) {
    if (!options[`level${level}-dir`]) continue;
    const dir = path.resolve(options[`level${level}-dir`]);
    for (let unit = 1; unit <= 20; unit += 1) {
      const track = `Track${String(unit + 1).padStart(2, '0')}.mp3`;
      const filePath = path.join(dir, track);
      if (!fs.existsSync(filePath)) throw new Error(`Missing Level ${level} ${track}: ${filePath}`);
      const size = fs.statSync(filePath).size;
      if (size < 100000) throw new Error(`Suspiciously small Level ${level} ${track}: ${size} bytes`);
      const lessonId = level === 1 ? `br${unit}` : `brl${level}-${String(unit).padStart(2, '0')}`;
      tasks.push({ filePath, storagePath: `bricks-reading-250-${level}/${lessonId}-original.mp3` });
    }
  }

  console.log(`Validated ${tasks.length} publisher MP3 tracks. mode=${options.apply ? 'APPLY' : 'DRY-RUN'}`);
  if (!options.apply) return;
  for (const task of tasks) {
    await upload(task.filePath, task.storagePath);
    console.log(`${task.storagePath}: uploaded`);
  }
}

main().catch(error => {
  console.error(error.message || error);
  process.exit(1);
});
