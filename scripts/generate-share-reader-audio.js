#!/usr/bin/env node
/**
 * Generate the two direct-share Sophie story MP3s plus exact sentence timepoints.
 * Uses the same Neural2-F voice, rate, Supabase project, and GitHub secret as the
 * existing Reading World audio pipeline.
 */

const fs = require('fs');
const https = require('https');
const path = require('path');

const GOOGLE_TTS_KEY = process.env.GOOGLE_TTS_KEY;
const VOICE_NAME = 'en-US-Neural2-F';
const SPEAKING_RATE = 0.95;
const SUPABASE_URL = 'https://fgahqumaldheqettmvqg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnYWhxdW1hbGRoZXFldHRtdnFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NjAzNDcsImV4cCI6MjA5NzIzNjM0N30.iUXLFteDc_xIp_Xj506BKTxnZRYMObmTYQ2Dgh9RAqs';
const STORIES_PATH = path.join(__dirname, '../reading-world/share/sophie-stories/stories.json');
const OUT_DIR = path.join(__dirname, '../audio-generated/sophie-stories');

const stories = JSON.parse(fs.readFileSync(STORIES_PATH, 'utf8'));

function request(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

function escapeSsml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'
  })[char]);
}

function storySegments(story) {
  const segments = [];
  if (story.title) segments.push({ type: 'title', text: story.title });
  story.paragraphs.forEach((paragraph, paragraphIndex) => {
    paragraph.forEach((text, sentenceIndex) => segments.push({ type: 'sentence', paragraphIndex, sentenceIndex, text }));
  });
  return segments;
}

function buildSsml(story, segments) {
  let segmentIndex = 0;
  const pieces = ['<speak>'];
  if (story.title) {
    pieces.push(`<p><s><mark name="segment-${segmentIndex}"/>${escapeSsml(story.title)}</s></p>`);
    segmentIndex++;
  }
  story.paragraphs.forEach((paragraph) => {
    pieces.push('<p>');
    paragraph.forEach((sentence) => {
      pieces.push(`<s><mark name="segment-${segmentIndex}"/>${escapeSsml(sentence)}</s>`);
      segmentIndex++;
    });
    pieces.push('</p>');
  });
  pieces.push('<mark name="story-end"/><break time="1ms"/></speak>');
  if (segmentIndex !== segments.length) throw new Error(`Segment count mismatch for ${story.id}`);
  return pieces.join('');
}

async function synthesize(story) {
  const segments = storySegments(story);
  const payload = JSON.stringify({
    input: { ssml: buildSsml(story, segments) },
    voice: { languageCode: 'en-US', name: VOICE_NAME },
    audioConfig: { audioEncoding: 'MP3', speakingRate: SPEAKING_RATE },
    enableTimePointing: ['SSML_MARK']
  });

  const response = await request({
    hostname: 'texttospeech.googleapis.com',
    path: `/v1beta1/text:synthesize?key=${encodeURIComponent(GOOGLE_TTS_KEY)}`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) }
  }, payload);

  if (response.status !== 200) throw new Error(`Google TTS ${response.status}: ${response.body.toString().slice(0, 500)}`);
  const data = JSON.parse(response.body.toString());
  const marks = new Map((data.timepoints || []).map((point) => [point.markName, Number(point.timeSeconds)]));
  const storyEnd = marks.get('story-end');
  if (!Number.isFinite(storyEnd)) throw new Error(`Google TTS did not return the ending timepoint for ${story.id}`);

  const timingSegments = segments.map((segment, index) => {
    const start = marks.get(`segment-${index}`);
    const end = index + 1 < segments.length ? marks.get(`segment-${index + 1}`) : storyEnd;
    if (!Number.isFinite(start) || !Number.isFinite(end)) throw new Error(`Missing timepoint for ${story.id} segment ${index}`);
    return { index, start, end, text: segment.text };
  });

  return {
    mp3: Buffer.from(data.audioContent, 'base64'),
    timings: {
      storyId: story.id,
      voice: VOICE_NAME,
      speakingRate: SPEAKING_RATE,
      duration: storyEnd,
      generatedAt: new Date().toISOString(),
      segments: timingSegments
    }
  };
}

async function upload(buffer, storagePath, contentType) {
  const url = new URL(SUPABASE_URL);
  const response = await request({
    hostname: url.hostname,
    path: `/storage/v1/object/audio/${storagePath}`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': contentType,
      'Content-Length': buffer.length,
      'x-upsert': 'true'
    }
  }, buffer);
  if (response.status !== 200 && response.status !== 201) {
    throw new Error(`Supabase upload ${response.status}: ${response.body.toString().slice(0, 300)}`);
  }
}

async function main() {
  if (!GOOGLE_TTS_KEY) throw new Error('Set GOOGLE_TTS_KEY before running this script.');
  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const story of stories) {
    process.stdout.write(`Generating ${story.id} with ${VOICE_NAME}... `);
    const { mp3, timings } = await synthesize(story);
    const timingBuffer = Buffer.from(`${JSON.stringify(timings, null, 2)}\n`);
    fs.writeFileSync(path.join(OUT_DIR, `${story.id}.mp3`), mp3);
    fs.writeFileSync(path.join(OUT_DIR, `${story.id}.timings.json`), timingBuffer);
    await upload(mp3, `sophie-stories/${story.id}.mp3`, 'audio/mpeg');
    await upload(timingBuffer, `sophie-stories/${story.id}.timings.json`, 'application/json; charset=utf-8');
    console.log(`${mp3.length.toLocaleString()} bytes, ${timings.segments.length} exact sentence marks`);
  }
  console.log('Sophie story audio and sentence timing files uploaded successfully.');
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { buildSsml, escapeSsml, storySegments };
