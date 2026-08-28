#!/usr/bin/env node
/**
 * One-off transport: upload a real book PDF from reading-world/assets/library-pdf-src/
 * to Supabase Storage (bucket `library-pdfs`) and print the resulting URL.
 * The PDF itself is not meant to stay in git — it lives only on the throwaway
 * branch long enough for this workflow to read it. Nothing here ships to
 * main/GitHub Pages.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://fgahqumaldheqettmvqg.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const SRC_DIR = path.join(__dirname, '../reading-world/assets/library-pdf-src');

if (!SUPABASE_KEY) {
  console.error('❌ Set SUPABASE_SERVICE_ROLE_KEY before uploading PDFs.');
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
    path: `/storage/v1/object/library-pdfs/${storagePath}`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'apikey': SUPABASE_KEY,
      'Content-Type': 'application/pdf',
      'x-upsert': 'true',
    },
  }, buf);
  if (res.status !== 200 && res.status !== 201) throw new Error(`Supabase upload ${res.status} (${storagePath}): ${res.body.toString().slice(0, 200)}`);
  return `${SUPABASE_URL}/storage/v1/object/public/library-pdfs/${storagePath}`;
}

(async () => {
  const files = fs.readdirSync(SRC_DIR).filter(f => f.endsWith('.pdf'));
  let count = 0;
  for (const file of files) {
    const buf = fs.readFileSync(path.join(SRC_DIR, file));
    const url = await uploadFile(buf, file);
    console.log(`✓ ${file} (${(buf.length / 1024).toFixed(0)}KB) -> ${url}`);
    count++;
  }
  console.log(`\nUploaded ${count} file(s).`);
})().catch(e => { console.error('❌', e.message); process.exit(1); });
