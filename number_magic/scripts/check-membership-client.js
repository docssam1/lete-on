/* app/membership.js VM 단위 검사 — 인증/fetch/performance 전부 주입한 가짜. 외부 통신·저장 없음.
   실행: node number_magic/scripts/check-membership-client.js */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), assert = require('assert');
const SRC = fs.readFileSync(path.join(__dirname, '..', 'app', 'membership.js'), 'utf8');
const tick = async (n) => { for (let i = 0; i < (n || 6); i++) await new Promise(r => setImmediate(r)); };
const T0 = Date.parse('2026-10-21T00:00:00Z');

function deferred() { let res, rej; const p = new Promise((a, b) => { res = a; rej = b; }); return { p, res, rej }; }
function reply(body, ok) { return { ok: ok !== false, status: ok === false ? 400 : 200, json: async () => body }; }
function member(uid, extra) {
  return Object.assign({ userId: uid, canUse: true, status: 'active', endsAt: new Date(T0 + 10000).toISOString(), serverNow: new Date(T0).toISOString() }, extra || {});
}

function makeAuth(uid, opts) {
  opts = opts || {};
  const a = {
    uid, pw: !!opts.pw, token: opts.token || 'jwt-' + uid, listeners: [],
    async getSession() { return a.uid ? { access_token: a.token, user: { id: a.uid } } : null; },
    requiresPassword() { return a.pw; },
    peek() { return a.uid ? { user: { id: a.uid } } : null; },
    onChange(fn) { a.listeners.push(fn); },
    ready() { return Promise.resolve(); },
    fire() { a.listeners.forEach(f => f()); },
    set(u, pw) { a.uid = u; a.pw = !!pw; a.fire(); },
  };
  return a;
}

function setup(auth, handler, profile) {
  const env = { perf: 1000, clock: T0, calls: [], storageWrites: [] };
  const storage = { setItem: (k, v) => env.storageWrites.push([k, v]), getItem: () => null, removeItem() {}, clear() {} };
  class FakeDate extends Date { static now() { return env.clock; } }
  const ctx = vm.createContext({
    performance: { now: () => env.perf }, Date: FakeDate, console,
    localStorage: storage, sessionStorage: storage,
    fetch: async (url, init) => {
      const body = JSON.parse(init.body);
      env.calls.push({ url, init, body });
      return handler(body, env.calls.length - 1);
    },
  });
  ctx.window = ctx;
  vm.runInContext(SRC, ctx);
  const M = ctx.NM_MEMBERSHIP;
  M.configure({ url: 'https://example.test', anonKey: 'anon', auth, profileName: profile || (() => null) });
  env.M = M;
  return env;
}

const ok = (uid, extra) => (body) => reply({ membership: member(uid, extra), settings: null, contact: { registered: false } });
const tests = [];
const test = (name, fn) => tests.push([name, fn]);

test('no auth: no request, canUse false', async () => {
  const e = setup(makeAuth(null), ok('u1'));
  await tick();
  assert.strictEqual(await e.M.refresh(true), null);
  assert.strictEqual(e.calls.length, 0);
  assert.strictEqual(e.M.canUse(), false);
  assert.strictEqual(e.M.snapshot().membership, null);
});

test('password pending: no request', async () => {
  const a = makeAuth('u1', { pw: true });
  const e = setup(a, ok('u1'));
  await tick();
  await e.M.refresh(true);
  assert.strictEqual(e.calls.length, 0);
  assert.strictEqual(e.M.canUse(), false);
  a.fire(); await tick();
  assert.strictEqual(e.calls.length, 0);
});

test('request uses correct JWT, anon key, action + user id only from token', async () => {
  const e = setup(makeAuth('u1', { token: 'JWT.abc' }), ok('u1'));
  await tick();
  assert.strictEqual(e.calls.length, 1);
  const c = e.calls[0];
  assert.strictEqual(c.url, 'https://example.test/functions/v1/nm-membership');
  assert.strictEqual(c.init.method, 'POST');
  assert.strictEqual(c.init.headers.Authorization, 'Bearer JWT.abc');
  assert.strictEqual(c.init.headers.apikey, 'anon');
  assert.deepStrictEqual(c.body, { action: 'status' });      // userId/phone 등 클라이언트가 정한 신원 없음
  assert.strictEqual(e.M.canUse(), true);
});

test('profileName is the only extra field sent with status', async () => {
  const e = setup(makeAuth('u1'), ok('u1'), () => '아이');
  await tick();
  assert.deepStrictEqual(e.calls[0].body, { action: 'status', profileName: '아이' });
});

test('expiry uses server clock + monotonic performance, not Date.now', async () => {
  const e = setup(makeAuth('u1'), ok('u1'));
  await tick();
  assert.strictEqual(e.M.canUse(), true);
  e.clock = T0 + 365 * 86400000;               // 기기 시계를 앞으로 돌려도 영향 없음
  assert.strictEqual(e.M.canUse(), true);
  e.clock = T0 - 365 * 86400000;
  e.perf = 1000 + 9999; assert.strictEqual(e.M.canUse(), true);
  e.perf = 1000 + 10000; assert.strictEqual(e.M.canUse(), false);   // 경계: 만료 시각 이상이면 불가
  e.perf = 1000 + 20000; assert.strictEqual(e.M.canUse(), false);
  e.perf = 500;                                // performance 역행해도 경과는 0 이하로 가지 않음
  assert.strictEqual(e.M.canUse(), true);
});

test('trial uses trialEndsAt; missing/invalid end is false', async () => {
  let e = setup(makeAuth('u1'), ok('u1', { status: 'trial', trialEndsAt: new Date(T0 + 5000).toISOString(), endsAt: new Date(T0 + 99999999).toISOString() }));
  await tick();
  assert.strictEqual(e.M.canUse(), true);
  e.perf += 5000; assert.strictEqual(e.M.canUse(), false);
  e = setup(makeAuth('u1'), ok('u1', { status: 'trial', trialEndsAt: undefined }));
  await tick(); assert.strictEqual(e.M.canUse(), false);
  e = setup(makeAuth('u1'), ok('u1', { endsAt: 'garbage' }));
  await tick(); assert.strictEqual(e.M.canUse(), false);
  e = setup(makeAuth('u1'), ok('u1', { canUse: false }));
  await tick(); assert.strictEqual(e.M.canUse(), false);
});

test('no persisted entitlement and no raw phone anywhere', async () => {
  const phone = '010-1234-5678';
  const e = setup(makeAuth('u1'), (b) => reply(b.action === 'register_contact'
    ? { contact: { registered: true } }
    : { membership: member('u1'), contact: { registered: b.action === 'status' && e && e.calls.length > 1 } }));
  await tick();
  await e.M.registerContact(phone, true, true);
  assert.deepStrictEqual(e.storageWrites, []);
  assert.ok(!JSON.stringify(e.M.snapshot()).includes('1234'));
  assert.ok(!JSON.stringify(e.M.snapshot()).includes('5678'));
  const reg = e.calls.find(c => c.body.action === 'register_contact');
  assert.strictEqual(reg.body.phone, phone);
  assert.strictEqual(reg.body.collectionConsent, true);
  assert.strictEqual(reg.body.smsConsent, true);
  // 동의는 정확히 true 일 때만
  await e.M.registerContact(phone, 'yes', 1);
  const reg2 = e.calls.filter(c => c.body.action === 'register_contact')[1];
  assert.strictEqual(reg2.body.collectionConsent, false);
  assert.strictEqual(reg2.body.smsConsent, false);
});

test('fail closed: network error / malformed JSON / bad shape / wrong identity', async () => {
  const cases = {
    network: () => { throw new Error('offline'); },
    http500: () => reply({ error: 'x' }, false),
    bodyError: () => reply({ error: 'forbidden', membership: member('u1') }),
    malformedJson: () => ({ ok: true, json: async () => { throw new SyntaxError('bad'); } }),
    noMembership: () => reply({}),
    wrongIdentity: () => reply({ membership: member('someone-else') }),
    canUseNotBoolean: () => reply({ membership: member('u1', { canUse: 'true' }) }),
    badServerNow: () => reply({ membership: member('u1', { serverNow: 'nope' }) }),
    missingServerNow: () => reply({ membership: member('u1', { serverNow: undefined }) }),
  };
  for (const [name, h] of Object.entries(cases)) {
    const e = setup(makeAuth('u1'), h);
    await tick();
    assert.strictEqual(e.M.canUse(), false, name);
    assert.strictEqual(e.M.snapshot().error, true, name);
    assert.strictEqual(e.M.snapshot().membership, null, name);
  }
});

test('previously valid entitlement is dropped after a failed refresh', async () => {
  let fail = false;
  const e = setup(makeAuth('u1'), () => { if (fail) throw new Error('offline'); return reply({ membership: member('u1') }); });
  await tick(); assert.strictEqual(e.M.canUse(), true);
  fail = true; await e.M.refresh(true);
  assert.strictEqual(e.M.canUse(), false);
});

test('session switched mid-request (guardian_changed) is rejected', async () => {
  const a = makeAuth('u1'); const d = deferred();
  const e = setup(a, () => d.p);
  await tick();
  a.uid = 'u2'; // onChange 없이 peek 만 바뀐 경우도 응답을 받아들이면 안 된다
  d.res(reply({ membership: member('u1') }));
  await tick();
  assert.strictEqual(e.M.canUse(), false);
});

test('stale owner response after logout is ignored', async () => {
  const a = makeAuth('u1'); const d = deferred();
  const e = setup(a, () => d.p);
  await tick();
  assert.strictEqual(e.calls.length, 1);
  a.set(null);                                  // 로그아웃 → clear()
  d.res(reply({ membership: member('u1') }));
  await tick();
  assert.strictEqual(e.M.canUse(), false);
  assert.strictEqual(e.M.snapshot().membership, null);
  assert.strictEqual(e.M.snapshot().owner, null);
});

test('stale response for owner A ignored after switching to owner B', async () => {
  const a = makeAuth('uA'); const dA = deferred();
  const e = setup(a, (b, i) => i === 0 ? dA.p : reply({ membership: member('uB', { endsAt: new Date(T0 + 50000).toISOString() }) }));
  await tick();
  a.set('uB'); await tick();
  dA.res(reply({ membership: member('uA') }));
  await tick();
  const s = e.M.snapshot();
  assert.strictEqual(s.owner, 'uB');
  assert.strictEqual(s.membership.userId, 'uB');
  assert.strictEqual(e.M.canUse(), true);
});

test('logout then same user login quickly: old in-flight response ignored', async () => {
  const a = makeAuth('u1'); const d1 = deferred(); const d2 = deferred();
  const e = setup(a, (b, i) => i === 0 ? d1.p : d2.p);
  await tick();
  a.set(null); a.set('u1'); await tick();
  d1.res(reply({ membership: member('u1', { canUse: true }) }));
  await tick();
  assert.strictEqual(e.M.canUse(), false, '옛 요청 응답으로 열리면 안 된다');
  d2.res(reply({ membership: member('u1') })); await tick();
  assert.strictEqual(e.M.canUse(), true);
});

test('registerContact: same-owner status refresh in flight does not clobber result', async () => {
  const a = makeAuth('u1'); const s1 = deferred(), r = deferred(), s2 = deferred();
  const queue = { status: [s1.p, s2.p], register_contact: [r.p] };
  const e = setup(a, (b) => queue[b.action].shift());
  await tick();                                  // S1 대기
  const reg = e.M.registerContact('010-1', true, true);
  await tick();
  r.res(reply({ ok: true }));
  await tick();
  assert.strictEqual(e.calls.filter(c => c.body.action === 'status').length, 1, 'S1 끝나기 전 새 status 금지');
  s1.res(reply({ membership: member('u1'), contact: { registered: false } }));   // 옛 응답(가입 전)
  await tick();
  s2.res(reply({ membership: member('u1'), contact: { registered: true } }));
  await reg;
  assert.deepStrictEqual(e.calls.map(c => c.body.action), ['status', 'register_contact', 'status']);
  assert.strictEqual(e.M.contactReady(), true);
});

test('registerContact: owner changes during register -> guardian_changed, no refresh for new owner mixed in', async () => {
  const a = makeAuth('u1'); const r = deferred();
  const e = setup(a, (b) => b.action === 'register_contact' ? r.p : reply({ membership: member(a.uid) }));
  await tick();
  const reg = e.M.registerContact('010-1', true, true);
  await tick();
  a.uid = 'u2';
  r.res(reply({ ok: true }));
  await assert.rejects(reg, /guardian_changed/);
});

test('registerContact without auth rejects and sends nothing', async () => {
  const e = setup(makeAuth(null), ok('u1'));
  await tick();
  await assert.rejects(e.M.registerContact('010', true, true));
  assert.strictEqual(e.calls.length, 0);
});

test('password-required auth change clears entitlement', async () => {
  const a = makeAuth('u1');
  const e = setup(a, ok('u1'));
  await tick(); assert.strictEqual(e.M.canUse(), true);
  a.set('u1', true);
  assert.strictEqual(e.M.canUse(), false);
  assert.strictEqual(e.M.snapshot().membership, null);
});

(async () => {
  let fail = 0;
  for (const [name, fn] of tests) {
    try { await fn(); console.log('ok   - ' + name); }
    catch (err) { fail++; console.log('FAIL - ' + name + '\n       ' + (err && err.message)); }
  }
  console.log(fail ? fail + ' FAILED' : 'all ' + tests.length + ' passed');
  process.exit(fail ? 1 : 0);
})();
