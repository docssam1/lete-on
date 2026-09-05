#!/usr/bin/env node
/* Numbers of Magic — 알리고 릴레이 (사설서버용, 의존성 0, Node 18+)
 *
 * Supabase Edge Function `weekly-notify`(고정 IP 없음)가 알리고 IP 화이트리스트를 통과하도록,
 * 알리고에 IP를 등록해 둔 사설서버에서 이 파일 하나를 돌린다. 설계: number_magic/알림서비스-설계.md §8-2.
 *
 *   POST /notify/send   헤더 X-Relay-Key   본문 {receiver, msg, title?, msg_type?:'SMS'|'LMS'}
 *                       → {ok:true|false, detail:{알리고 응답}}
 *   GET  /notify/health → {ok:true, testmode}
 *
 * 환경변수(필수): RELAY_KEY, ALIGO_API_KEY, ALIGO_USER_ID, ALIGO_SENDER(알리고에 등록한 발신번호)
 * 환경변수(선택): PORT=8090, ALIGO_TESTMODE=Y (알리고 testmode_yn=Y — 실제 발송 없이 응답만), MAX_PER_HOUR=200
 *
 * 실행:  RELAY_KEY=… ALIGO_API_KEY=… ALIGO_USER_ID=… ALIGO_SENDER=010… node relay.js
 * 상시:  relay.service 참조(systemd).
 */
'use strict';
const http = require('http');

const PORT = Number(process.env.PORT || 8090);
const RELAY_KEY = process.env.RELAY_KEY || '';
const ALIGO = {
  key: process.env.ALIGO_API_KEY || '',
  user_id: process.env.ALIGO_USER_ID || '',
  sender: process.env.ALIGO_SENDER || '',
  testmode: String(process.env.ALIGO_TESTMODE || 'N').toUpperCase() === 'Y' ? 'Y' : 'N',
};
const MAX_PER_HOUR = Number(process.env.MAX_PER_HOUR || 200);

for (const [k, v] of Object.entries({ RELAY_KEY, ALIGO_API_KEY: ALIGO.key, ALIGO_USER_ID: ALIGO.user_id, ALIGO_SENDER: ALIGO.sender })) {
  if (!v) { console.error(`[relay] 환경변수 ${k} 가 비어 있습니다.`); process.exit(1); }
}
if (typeof fetch !== 'function') { console.error('[relay] Node 18 이상이 필요합니다 (global fetch).'); process.exit(1); }

/* 키가 새어도 피해를 묶기 위한 시간당 상한 */
let windowStart = Date.now(), sentInWindow = 0;
function underLimit() {
  const now = Date.now();
  if (now - windowStart > 3600000) { windowStart = now; sentInWindow = 0; }
  return sentInWindow < MAX_PER_HOUR;
}

function json(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(body) });
  res.end(body);
}
function mask(phone) { return String(phone).replace(/^(\d{3})\d+(\d{4})$/, '$1****$2'); }

function readBody(req, limit = 64 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', c => { size += c.length; if (size > limit) { reject(new Error('body too large')); req.destroy(); } else chunks.push(c); });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

async function sendAligo({ receiver, msg, title, msg_type }) {
  const form = new URLSearchParams({
    key: ALIGO.key, user_id: ALIGO.user_id, sender: ALIGO.sender,
    receiver, msg, msg_type: msg_type || 'LMS', testmode_yn: ALIGO.testmode,
  });
  if ((msg_type || 'LMS') !== 'SMS') form.set('title', title || '[Numbers of Magic] 학습 안내');
  const r = await fetch('https://apis.aligo.in/send/', { method: 'POST', body: form });
  const text = await r.text();
  try { return JSON.parse(text); } catch (_) { return { result_code: '-999', message: text.slice(0, 200) }; }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (req.method === 'GET' && url.pathname === '/notify/health') return json(res, 200, { ok: true, testmode: ALIGO.testmode === 'Y' });
  if (req.method !== 'POST' || url.pathname !== '/notify/send') return json(res, 404, { ok: false, detail: 'not found' });
  if (!RELAY_KEY || req.headers['x-relay-key'] !== RELAY_KEY) return json(res, 403, { ok: false, detail: 'bad key' });

  let b = {};
  try { b = JSON.parse(await readBody(req) || '{}'); } catch (e) { return json(res, 400, { ok: false, detail: 'bad json' }); }
  const receiver = String(b.receiver || '').replace(/\D/g, '');
  const msg = String(b.msg || '');
  if (!/^01\d{8,9}$/.test(receiver)) return json(res, 400, { ok: false, detail: 'bad receiver' });
  if (!msg.trim()) return json(res, 400, { ok: false, detail: 'empty msg' });
  if (!underLimit()) return json(res, 429, { ok: false, detail: 'hourly limit' });

  try {
    const j = await sendAligo({ receiver, msg, title: b.title, msg_type: b.msg_type === 'SMS' ? 'SMS' : 'LMS' });
    const ok = String(j.result_code) === '1';
    sentInWindow += 1;
    console.log(`[relay] ${new Date().toISOString()} ${mask(receiver)} ${ok ? 'OK' : 'FAIL'} code=${j.result_code} ${j.message || ''}`);
    return json(res, 200, { ok, detail: j });
  } catch (e) {
    console.error('[relay] aligo error', e && e.message);
    return json(res, 502, { ok: false, detail: String(e && e.message || e) });
  }
});

server.listen(PORT, () => console.log(`[relay] listening on :${PORT} testmode=${ALIGO.testmode} limit=${MAX_PER_HOUR}/h`));
