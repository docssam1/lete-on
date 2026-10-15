import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync(new URL('../personality/index.html', import.meta.url), 'utf8');
const config = fs.readFileSync(new URL('../personality/service-config.js', import.meta.url), 'utf8');
// Run the actual chat functions with controlled DOM, transport and time.
const state = html.slice(html.indexOf('let chatCount = 0;'), html.indexOf('// --- 화면 전환 ---'));
const chat = html.slice(html.indexOf('function updateChatCounter()'), html.indexOf("document.getElementById('chat-form').addEventListener"));
function setup(fetchImpl, endpoint) {
  const messages = [];
  const elements = Object.fromEntries(['chat-counter', 'chat-input', 'chat-submit', 'chat-window'].map(id => [id, {
    value: '', style: {}, disabled: false, appendChild: div => messages.push(div)
  }]));
  const timers = new Map();
  let nextTimer = 0;
  const context = vm.createContext({
    window: {}, fetch: fetchImpl, AbortController,
    document: { getElementById: id => elements[id], createElement: () => ({}) },
    setTimeout: (fn, ms) => { const id = ++nextTimer; timers.set(id, { fn, ms }); return id; },
    clearTimeout: id => timers.delete(id),
    predefinedAnswers: { recommended: 'Prepared answer' }, studentInfo: { name: 'Test', age: 7 },
    personalityResult: { label: 'Test' }, KNOWLEDGE_BASE_TEXT: '', mathLevelLabel: {}, mathAdvanceLabel: {}
  });
  vm.runInContext(config, context);
  if (endpoint !== undefined) context.window.LETEON_PERSONALITY_CHAT_URL = endpoint;
  vm.runInContext(state + chat, context);
  return { context, messages, elements, timers,
    send: q => vm.runInContext(`sendChat(${JSON.stringify(q)})`, context),
    count: () => vm.runInContext('chatCount', context) };
}
const response = text => ({ ok: true, json: async () => ({ candidates: [{ content: { parts: [{ text }] } }] }) });
let calls = 0;
const success = setup(async (url, options) => {
  calls++;
  assert.equal(url, 'https://approved.example/identify-chat');
  assert.equal(options.method, 'POST');
  assert.equal(JSON.parse(options.body).query, 'question');
  assert.ok(options.signal);
  return response('Answer');
}, 'https://approved.example/identify-chat');
await success.send('question');
assert.equal(success.count(), 1);
assert.equal(success.messages.at(-1).textContent, 'Answer');
assert.equal(success.timers.size, 0);
await success.send('recommended');
assert.equal(calls, 1);
assert.equal(success.count(), 1);
for (const timer of success.timers.values()) timer.fn();
assert.equal(success.messages.at(-1).textContent, 'Prepared answer');

for (const failure of [
  async () => ({ ok: false, status: 500 }),
  async () => { throw new TypeError('network'); },
  async () => ({ ok: true, json: async () => { throw new SyntaxError('HTML'); } }),
  async () => response(''),
  async () => ({ ok: true, json: async () => ({}) })
]) {
  const failed = setup(failure);
  vm.runInContext('chatCount = 4', failed.context);
  failed.elements['chat-input'].disabled = true;
  failed.elements['chat-submit'].disabled = true;
  await failed.send('question');
  assert.equal(failed.count(), 4);
  assert.equal(failed.elements['chat-input'].disabled, false);
  assert.equal(failed.elements['chat-submit'].disabled, false);
  assert.match(failed.messages.at(-1).textContent, /질문 횟수는 차감되지/);
  assert.equal(failed.timers.size, 0);
}
const timeout = setup(async (_url, options) => new Promise((resolve, reject) => {
  options.signal.addEventListener('abort', () => reject(new Error('aborted')));
}));
const pending = timeout.send('question');
assert.equal([...timeout.timers.values()][0].ms, 30_000);
[...timeout.timers.values()][0].fn();
await pending;
assert.equal(timeout.count(), 0);
assert.equal(timeout.timers.size, 0);

const disabled = setup(async () => { throw new Error('must not fetch'); }, '');
await disabled.send('question');
assert.equal(disabled.count(), 0);
assert.match(disabled.messages.at(-1).textContent, /추천 질문/);
const exhausted = setup(async () => { throw new Error('must not fetch'); });
vm.runInContext('chatCount = 5', exhausted.context);
await exhausted.send('question');
assert.equal(exhausted.elements['chat-input'].disabled, true);
await exhausted.send('recommended');
assert.equal(exhausted.count(), 5);

// A late response from before a restart must neither change counts nor publish an answer.
for (const ok of [true, false]) {
  let finish;
  const stale = setup(() => new Promise(resolve => { finish = resolve; }));
  const request = stale.send('question');
  vm.runInContext('chatSession++; chatCount = 0;', stale.context);
  finish(ok ? response('Old answer') : { ok: false });
  await request;
  assert.equal(stale.count(), 0);
  assert.equal(stale.messages.at(-1).textContent, '답변을 생성하고 있습니다...');
  assert.equal(stale.timers.size, 0);
}
assert.match(html, /chatSession\+\+;\s+chatCount = 0;/);
assert.match(html, /<script src="service-config.js"><\/script>/);
console.log('personality chat resilience: all checks passed');
