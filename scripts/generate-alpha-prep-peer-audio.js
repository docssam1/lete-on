#!/usr/bin/env node
'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const https = require('node:https');
const path = require('node:path');
const vm = require('node:vm');

const GOOGLE_TTS_KEY = process.env.GOOGLE_TTS_KEY || '';
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://fgahqumaldheqettmvqg.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const DRY_RUN = process.argv.includes('--dry-run');
const WRITE_MANIFEST = process.argv.includes('--write-manifest');
const STORAGE_ROOT = 'alpha-prep/peers';
const MANIFEST_FILE = path.join(__dirname, '../reading-world/alpha-prep/peer-audio-manifest.json');
const AUDIO_CONFIG = { audioEncoding: 'MP3', speakingRate: 0.96, pitch: 2 };

function loadAlphaPrepData() {
  const sourcePath = path.join(__dirname, '../reading-world/alpha-prep/data.js');
  const context = vm.createContext({ window: {} });
  vm.runInContext(fs.readFileSync(sourcePath, 'utf8'), context, { filename: sourcePath });
  return context.window;
}

function fingerprint(task) {
  return crypto.createHash('sha256').update(JSON.stringify({
    text: task.text,
    voice: task.voice,
    audioConfig: AUDIO_CONFIG,
  })).digest('hex');
}

function buildTasks(data) {
  const answers = data.ALPHA_PREP_PEER_ANSWERS || {};
  const sets = data.ALPHA_PREP_SETS || [];
  const peers = data.ALPHA_PREP_PEERS || [];
  const passageIds = new Set(sets.flatMap((set) => set.passages || []).map((passage) => passage.id));
  const answerIds = Object.keys(answers);
  if (passageIds.size !== 20 || answerIds.length !== 20) {
    throw new Error(`Expected 20 passages and 20 peer answers, found ${passageIds.size} and ${answerIds.length}.`);
  }
  answerIds.forEach((id) => {
    if (!passageIds.has(id)) throw new Error(`Peer answer does not match a passage: ${id}`);
    if (String(answers[id]).trim().split(/\s+/).length < 12) throw new Error(`Peer answer is too short: ${id}`);
  });
  if (peers.length !== 3 || new Set(peers.map((peer) => peer.id)).size !== 3) {
    throw new Error(`Expected three fixed peers, found ${peers.length}.`);
  }
  peers.forEach((peer) => {
    if (!peer.id || !peer.voice || !['female', 'male'].includes(peer.gender)) throw new Error(`Invalid peer voice settings: ${JSON.stringify(peer)}`);
  });
  const tasks = sets.flatMap((set, setIndex) => (set.passages || []).map((passage, passageIndex) => {
    const peer = peers[(setIndex + passageIndex) % peers.length];
    const task = {
      passageId: passage.id,
      peerId: peer.id,
      gender: peer.gender,
      voice: peer.voice,
      text: String(answers[passage.id]).trim(),
      storagePath: `${STORAGE_ROOT}/${passage.id}-${peer.id}.mp3`,
    };
    task.fingerprint = fingerprint(task);
    return task;
  }));
  if (tasks.length !== 20) throw new Error(`Expected 20 audio tasks, found ${tasks.length}.`);
  return tasks;
}

function request(method, storagePath, body, contentType) {
  const base = new URL(SUPABASE_URL);
  const encodedPath = storagePath.split('/').map(encodeURIComponent).join('/');
  const isRead = method === 'HEAD';
  const requestPath = isRead
    ? `/storage/v1/object/public/audio/${encodedPath}`
    : `/storage/v1/object/audio/${encodedPath}`;
  const headers = {};
  if (!isRead) {
    headers.Authorization = `Bearer ${SUPABASE_KEY}`;
    headers.apikey = SUPABASE_KEY;
    headers['Content-Type'] = contentType;
    headers['x-upsert'] = 'true';
    headers['Content-Length'] = body.length;
  }
  return new Promise((resolve, reject) => {
    const req = https.request({ hostname: base.hostname, path: requestPath, method, headers }, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

function manifestFor(tasks) {
  return {
    version: 1,
    audioConfig: AUDIO_CONFIG,
    files: Object.fromEntries(tasks.map((task) => [task.storagePath, {
      fingerprint: task.fingerprint,
      passageId: task.passageId,
      peerId: task.peerId,
      gender: task.gender,
      voice: task.voice,
    }])),
  };
}

function readManifest() {
  if (!fs.existsSync(MANIFEST_FILE)) throw new Error('Peer audio manifest is missing. Run with --write-manifest and review it before synthesis.');
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8'));
  if (!manifest || manifest.version !== 1 || !manifest.files) throw new Error('Peer audio manifest is invalid.');
  return manifest;
}

async function objectExists(storagePath) {
  const response = await request('HEAD', storagePath);
  return response.status === 200;
}

function synthesize(text, voice) {
  const payload = Buffer.from(JSON.stringify({
    input: { text },
    voice: { languageCode: 'en-US', name: voice },
    audioConfig: AUDIO_CONFIG,
  }));
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'texttospeech.googleapis.com',
      path: `/v1/text:synthesize?key=${encodeURIComponent(GOOGLE_TTS_KEY)}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': payload.length },
    }, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const body = Buffer.concat(chunks);
        if (res.statusCode !== 200) {
          reject(new Error(`Google TTS ${res.statusCode}: ${body.toString('utf8').slice(0, 300)}`));
          return;
        }
        const audio = Buffer.from(JSON.parse(body.toString('utf8')).audioContent || '', 'base64');
        if (audio.length < 1000) {
          reject(new Error(`Google TTS returned an invalid MP3 (${audio.length} bytes).`));
          return;
        }
        resolve(audio);
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function upload(storagePath, body, contentType) {
  const response = await request('POST', storagePath, body, contentType);
  if (response.status !== 200 && response.status !== 201) {
    throw new Error(`Supabase upload failed for ${storagePath} (${response.status}): ${response.body.toString('utf8').slice(0, 240)}`);
  }
}

async function main() {
  const tasks = buildTasks(loadAlphaPrepData());
  const characters = tasks.reduce((total, task) => total + task.text.length, 0);
  console.log(`Alpha Prep peer audio: ${tasks.length} files, ${characters.toLocaleString()} characters`);
  console.log(`Peers: ${[...new Set(tasks.map((task) => `${task.peerId}=${task.voice}`))].join(', ')}`);
  if (WRITE_MANIFEST) {
    fs.writeFileSync(MANIFEST_FILE, `${JSON.stringify(manifestFor(tasks), null, 2)}\n`);
    console.log(`Wrote manifest: ${MANIFEST_FILE}`);
    return;
  }
  if (DRY_RUN) {
    console.log('Dry run complete: no API calls or uploads were made.');
    return;
  }
  if (!GOOGLE_TTS_KEY) throw new Error('GOOGLE_TTS_KEY is required.');
  if (!SUPABASE_KEY) throw new Error('SUPABASE_SERVICE_ROLE_KEY is required.');

  const manifest = readManifest();
  tasks.forEach((task) => {
    const approved = manifest.files[task.storagePath];
    if (!approved || approved.fingerprint !== task.fingerprint) {
      throw new Error(`Manifest approval is missing or stale for ${task.storagePath}. Run with --write-manifest and commit the reviewed result first.`);
    }
  });
  let generated = 0;
  let skipped = 0;
  for (const task of tasks) {
    if (await objectExists(task.storagePath)) {
      skipped += 1;
      console.log(`skip (audio input unchanged): ${task.passageId}-${task.peerId}`);
      continue;
    }
    const audio = await synthesize(task.text, task.voice);
    await upload(task.storagePath, audio, 'audio/mpeg');
    generated += 1;
    console.log(`generated: ${task.passageId}-${task.peerId} (${audio.length} bytes)`);
  }
  console.log(`Complete: generated=${generated}, skipped=${skipped}, total=${tasks.length}`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.stack || error);
    process.exitCode = 1;
  });
}

module.exports = { AUDIO_CONFIG, buildTasks, fingerprint, loadAlphaPrepData, manifestFor };
