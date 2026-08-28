#!/usr/bin/env node
/**
 * One-off transport: upload the local reading-world/assets/images/library/**
 * illustration files to Supabase Storage (bucket `library-images`) and print the
 * resulting public URLs. This script's own source is fine to keep in git;
 * the image files it uploads are NOT meant to stay in git — they live only
 * on this throwaway branch long enough for this workflow to read them, then
 * the branch gets deleted. Nothing here ships to main/GitHub Pages.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://fgahqumaldheqettmvqg.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const SRC_DIR = path.join(__dirname, '../reading-world/assets/images/library');

if (!SUPABASE_KEY) {
  console.error('❌ Set SUPABASE_SERVICE_ROLE_KEY before uploading images.');
  process.exit(1);
}

function httpRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function uploadFile(buf, storagePath) {
  const res = await httpRequest({
    hostname: new URL(SUPABASE_URL).hostname,
    path: `/storage/v1/object/library-images/${storagePath}`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'apikey': SUPABASE_KEY,
      'Content-Type': 'image/jpeg',
      'x-upsert': 'true',
    },
  }, buf);
  if (res.status !== 200 && res.status !== 201) throw new Error(`Supabase upload ${res.status} (${storagePath}): ${res.body.toString().slice(0, 200)}`);
  return `${SUPABASE_URL}/storage/v1/object/public/library-images/${storagePath}`;
}

(async () => {
  const bookDirs = fs.readdirSync(SRC_DIR).filter(f => fs.statSync(path.join(SRC_DIR, f)).isDirectory());
  let count = 0;
  for (const bookId of bookDirs) {
    const files = fs.readdirSync(path.join(SRC_DIR, bookId)).filter(f => f.endsWith('.jpg'));
    for (const file of files) {
      const buf = fs.readFileSync(path.join(SRC_DIR, bookId, file));
      const storagePath = `${bookId}/${file}`;
      const url = await uploadFile(buf, storagePath);
      console.log(`✓ ${storagePath} (${(buf.length / 1024).toFixed(0)}KB) -> ${url}`);
      count++;
    }
  }
  console.log(`\nUploaded ${count} files.`);
})().catch(e => { console.error('❌', e.message); process.exit(1); });
