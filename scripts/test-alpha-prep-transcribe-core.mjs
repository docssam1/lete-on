#!/usr/bin/env node
import assert from 'node:assert/strict';
import {
  appendTranscriptionFields,
  buildPrompt,
  extensionForAudioType,
  extractTranscript,
  MAX_AUDIO_BYTES,
  parseContext,
  validateAudioMetadata,
} from '../supabase/functions/alpha-prep-transcribe/core.mjs';

const context = parseContext(JSON.stringify({
  passageTitle: 'Why City Trees Need Room',
  passageGenre: 'Nonfiction',
  question: 'What does <absorb> mean?\nExplain your answer.',
  keywords: ['absorb', 'packed', 'absorb', 'rainwater'],
}));
assert.equal(context.question, 'What does absorb mean? Explain your answer.');
assert.deepEqual(context.keywords, ['absorb', 'packed', 'rainwater']);

const prompt = buildPrompt(context);
assert.match(prompt, /seven-year-old child/);
assert.match(prompt, /Korean or American accent/);
assert.match(prompt, /Latin alphabet only/);
assert.match(prompt, /Do not evaluate pronunciation/);
assert.match(prompt, /Preserve grammar mistakes, repetitions, unfinished phrases, and numbers exactly/);
assert.match(prompt, /Why City Trees Need Room/);
assert.match(prompt, /absorb, packed, rainwater/);

assert.deepEqual(validateAudioMetadata({ size: 2048, type: 'audio/webm;codecs=opus' }, '1420'), {
  type: 'audio/webm',
  durationMs: 1420,
});
assert.throws(() => validateAudioMetadata({ size: MAX_AUDIO_BYTES + 1, type: 'audio/webm' }, 1000), /audio_size_invalid/);
assert.throws(() => validateAudioMetadata({ size: 2048, type: 'audio/aac' }, 1000), /audio_type_invalid/);
assert.throws(() => validateAudioMetadata({ size: 2048, type: 'audio/webm' }, 100_000), /audio_duration_invalid/);
assert.throws(() => parseContext('{bad json'), /context_invalid/);

const form = appendTranscriptionFields(new FormData(), context);
assert.equal(form.get('model'), 'gpt-transcribe');
assert.equal(form.get('language'), 'en');
assert.equal(form.has('languages[]'), false);
assert.equal(form.has('keywords[]'), false);
assert.equal(extensionForAudioType('audio/mp4'), 'm4a');
assert.equal(extensionForAudioType('audio/webm'), 'webm');
assert.equal(extractTranscript({ text: 'I think  I goed there at 2:00.' }), 'I think I goed there at 2:00.');
assert.throws(() => extractTranscript({ text: '' }), /transcript_invalid/);

console.log('alpha-prep transcribe core: ok');
