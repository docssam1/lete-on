import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, symlinkSync, rmSync, realpathSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { validateInput, buildContent, privatePath, validateResult, callApi } from './review.mjs';

const input = { version: 1, items: [{ id: 'synthetic-question', prompt: 'A bag has 2 red counters and 3 blue counters. How many counters?' }] };
const result = { items: [{ id: 'synthetic-question', status: 'solved', answer_values: ['5'], reasoning: 'Two plus three counters.', issues: [] }] };
const options = { content: buildContent(input), model: 'synthetic-model', apiKey: 'unit-test-placeholder', inputRate: 3, outputRate: 15 };
const response = data => ({ ok: true, status: 200, json: async () => data });

test('only question fields are admitted; embedded answer keys and duplicate IDs are rejected', () => {
  assert.equal(validateInput(input), input);
  for (const key of ['answer', 'solution', 'expected', 'metadata']) {
    assert.throws(() => validateInput({ ...input, items: [{ ...input.items[0], [key]: 'secret-answer' }] }));
  }
  assert.throws(() => validateInput({ ...input, items: [input.items[0], input.items[0]] }));
  assert.throws(() => validateInput({ ...input, items: Array.from({ length: 7 }, (_, i) => ({ id: `q${i}`, prompt: 'Question' })) }));
  assert.throws(() => buildContent({ ...input, items: [{ ...input.items[0], image: '/private/source.png', image_question_only: false }] }));
});

test('symlinks and other checkouts cannot redirect private output into Git', () => {
  const dir = mkdtempSync(join(tmpdir(), 'hse-review-test-'));
  try {
    const checkout = join(dir, 'checkout'); mkdirSync(checkout); mkdirSync(join(checkout, '.git'));
    const alias = join(dir, 'alias'); symlinkSync(checkout, alias);
    assert.throws(() => privatePath(join(alias, 'new-output', 'review.json')));
    assert.equal(privatePath(join(dir, 'private', 'review.json')), join(realpathSync(dir), 'private', 'review.json'));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('wrong source IDs and missing output are rejected before result can be accepted', () => {
  assert.equal(validateResult(result, input), result);
  assert.throws(() => validateResult({ items: [] }, input));
  assert.throws(() => validateResult({ items: [{ ...result.items[0], id: 'another-source' }] }, input));
  assert.throws(() => validateResult({ items: [{ ...result.items[0], answer_values: [] }] }, input));
});

test('API counts schema and images before generation; no tools or expected answers are sent', async () => {
  const calls = [];
  const fetched = async (url, init) => {
    calls.push({ url, body: JSON.parse(init.body) });
    assert.equal(init.headers['x-api-key'], 'unit-test-placeholder');
    assert(!Object.hasOwn(calls.at(-1).body, 'tools'));
    return calls.length === 1 ? response({ input_tokens: 100 })
      : response({ model: 'synthetic-model', stop_reason: 'end_turn', usage: { input_tokens: 100, output_tokens: 50 }, content: [{ type: 'text', text: JSON.stringify(result) }] });
  };
  const output = await callApi(options, fetched);
  assert.equal(calls.length, 2);
  assert(calls[0].url.endsWith('/messages/count_tokens'));
  assert.deepEqual(calls[0].body.output_config, calls[1].body.output_config);
  assert(!JSON.stringify(calls).includes('secret-answer'));
  assert.equal(output.billing, 'anthropic-api');
  assert(Math.abs(output.cost_estimate_usd - 0.00105) < 1e-10);
  assert.deepEqual(output.result, result);
});

test('missing credentials never trigger any request', async () => {
  let calls = 0;
  await assert.rejects(callApi({ ...options, apiKey: '' }, async () => { calls++; }), /missing/);
  assert.equal(calls, 0);
});

test('input-token and price ceilings stop generation after token counting', async () => {
  for (const [overrides, count] of [[{}, 12001], [{ inputRate: 100000 }, 100]]) {
    let calls = 0;
    await assert.rejects(callApi({ ...options, ...overrides }, async () => {
      calls++; return response({ input_tokens: count });
    }));
    assert.equal(calls, 1);
  }
});

test('authentication and generation failures are not retried', async () => {
  let calls = 0;
  await assert.rejects(callApi(options, async () => { calls++; return { ok: false, status: 401 }; }), /401/);
  assert.equal(calls, 1);
  calls = 0;
  await assert.rejects(callApi(options, async () => {
    calls++;
    return calls === 1 ? response({ input_tokens: 100 }) : response({ stop_reason: 'max_tokens', content: [{ type: 'text', text: '{}' }] });
  }), /Incomplete/);
  assert.equal(calls, 2);
});
