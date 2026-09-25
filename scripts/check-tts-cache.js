#!/usr/bin/env node
/**
 * TTS 재합성 캐시 검사기 — 돈이 걸린 판단이라 눈으로 믿지 않는다
 *
 * 캐시가 잘못되면 두 방향으로 다친다.
 *   · 너무 잘 건너뛰면 — 지문을 고쳤는데 옛 음성이 그대로 남는다(아이가 다른 글을 듣는다)
 *   · 너무 안 건너뛰면 — 매 푸시마다 20만 자가 다시 나간다(고치려던 바로 그 문제)
 * 그래서 "글이 바뀌면 반드시 다시 만들고, 안 바뀌면 반드시 안 만든다"를 직접 확인한다.
 *
 * 쓰는 법: node scripts/check-tts-cache.js
 */
'use strict';
const cache = require('./tts-cache.js');
let fail = 0;
const ok = (cond, what) => { if (cond) console.log('  ✓ ' + what); else { fail++; console.log('  ✗ ' + what); } };

console.log('해시');
const a = cache.hashOf('Hello there.', 'en-US-Neural2-F');
ok(a === cache.hashOf('Hello there.', 'en-US-Neural2-F'), '같은 글·같은 목소리 → 같은 해시(건너뛴다)');
ok(a !== cache.hashOf('Hello there!', 'en-US-Neural2-F'), '글이 한 글자 바뀌면 → 다른 해시(다시 만든다)');
ok(a !== cache.hashOf('Hello there.', 'en-US-Chirp3-HD-Leda'), '목소리를 바꾸면 → 다른 해시(다시 만든다)');
ok(a !== cache.hashOf('Hello there. ', 'en-US-Neural2-F'), '끝의 공백도 구분한다');
ok(/^[0-9a-f]{20}$/.test(a), '해시는 16진수 20자');
ok(cache.hashOf('', '') === cache.hashOf('', ''), '빈 글도 터지지 않는다');

console.log('명세 읽기');
const req = res => async () => res;
(async () => {
  ok(Object.keys(await cache.load(req({ status: 404, body: '' }), 'https://x.co', 'k', 'n')).length === 0,
     '명세가 아직 없으면 빈 것으로 시작(첫 실행은 전부 만든다)');
  ok(Object.keys(await cache.load(req({ status: 200, body: '{{깨짐' }), 'https://x.co', 'k', 'n')).length === 0,
     '명세가 깨져 있으면 빈 것으로 — 옛 해시로 잘못 건너뛰지 않는다');
  const m = await cache.load(req({ status: 200, body: '{"a/b.mp3":"deadbeef"}' }), 'https://x.co', 'k', 'n');
  ok(m['a/b.mp3'] === 'deadbeef', '정상 명세는 그대로 읽는다');
  ok(Object.keys(await cache.load(async () => { throw new Error('net'); }, 'https://x.co', 'k', 'n')).length === 0,
     '네트워크가 죽어도 터지지 않고 빈 것으로(음성은 만들어진다)');

  console.log('명세 쓰기');
  let got = null;
  await cache.save(async (buf, p, ct) => { got = { p, ct, body: buf.toString('utf8') }; }, { 'x.mp3': 'h' }, 'n');
  ok(got && got.p === '_tts-n.json', '명세는 audio/_tts-<이름>.json 으로 올라간다');
  ok(got && got.ct === 'application/json', 'MP3 가 아니라 JSON 으로 올린다');
  ok(got && JSON.parse(got.body)['x.mp3'] === 'h', '내용이 그대로 실린다');
  let threw = false;
  try { await cache.save(async () => { throw new Error('업로드 실패'); }, {}, 'n'); } catch (e) { threw = true; }
  ok(!threw, '명세 업로드가 실패해도 실행을 죽이지 않는다(다음 실행이 다시 만들 뿐)');

  console.log('');
  console.log(fail ? `실패 ${fail}건` : '통과 — 글이 바뀌면 다시 만들고, 그대로면 안 만든다.');
  process.exit(fail ? 1 : 0);
})();
