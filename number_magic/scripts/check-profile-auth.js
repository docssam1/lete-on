'use strict';
// Offline checks for app/profile-auth.js using mocked fetch/storage/location/history.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const SRC = fs.readFileSync(path.join(__dirname, '..', 'app', 'profile-auth.js'), 'utf8');
const KEY = 'nm_guardian_session_v1';
const URL_BASE = 'https://example.test';
const nowS = () => Math.floor(Date.now() / 1000);

function jsonRes(status, body) {
  const text = typeof body === 'string' ? body : JSON.stringify(body);
  return { ok: status >= 200 && status < 300, status, text: async () => text };
}

function makeEnv(opts = {}) {
  const data = Object.assign({}, opts.storage || {});
  const calls = [];
  const replaced = [];
  const storage = {
    getItem: (k) => {
      if (opts.failRead) throw new Error('read fail');
      return Object.prototype.hasOwnProperty.call(data, k) ? data[k] : null;
    },
    setItem: (k, v) => {
      if (opts.failWrite) throw new Error('quota');
      data[k] = String(v);
    },
    removeItem: (k) => {
      if (opts.failRemove) throw new Error('remove fail');
      delete data[k];
    }
  };
  const handlers = {};
  const location = { origin: 'https://app.test', pathname: '/number_magic/', search: '', hash: opts.hash || '' };
  const history = { replaceState: (s, t, u) => { replaced.push(u); location.hash = ''; } };
  const sandbox = {
    localStorage: storage, location, history, console: { log() {}, error() {}, warn() {} },
    addEventListener: (type, fn) => { (handlers[type] = handlers[type] || []).push(fn); },
    fetch: async (url, init) => {
      calls.push({ url, init, body: init && init.body ? JSON.parse(init.body) : undefined });
      return opts.handler(url, init, calls);
    }
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(SRC, sandbox);
  sandbox.NM_PROFILE_AUTH.configure({ url: URL_BASE, anonKey: 'anon-test' });
  const fire = (type, ev) => (handlers[type] || []).forEach((fn) => fn(ev));
  return { auth: sandbox.NM_PROFILE_AUTH, data, calls, replaced, location, fire, storage };
}

const mkSession = (over) => Object.assign({
  access_token: 'at-1', refresh_token: 'rt-1', expires_at: nowS() + 3600,
  user: { id: 'u1', email: 'g@example.test', user_metadata: { id: 'evil' } }
}, over);

const tests = [];
const test = (name, fn) => tests.push([name, fn]);
const rejects = async (p) => { try { await p; } catch (e) { return e; } assert.fail('expected rejection'); };

test('unauthenticated makes no requests', async () => {
  const env = makeEnv({ handler: () => { throw new Error('no call'); } });
  await env.auth.ready();
  assert.strictEqual(env.auth.peek(), null);
  assert.strictEqual(await env.auth.getSession(), null);
  await env.auth.signOut();
  assert.strictEqual(env.calls.length, 0);
});

test('invalid/array stored JSON and failing reads are tolerated', async () => {
  for (const raw of ['not json', '[1,2]', '{"access_token":1}', 'null']) {
    const env = makeEnv({ storage: { [KEY]: raw }, handler: () => { throw new Error('no call'); } });
    await env.auth.ready();
    assert.strictEqual(env.auth.peek(), null);
  }
  const env = makeEnv({ failRead: true, handler: () => { throw new Error('no call'); } });
  assert.strictEqual(await env.auth.getSession(), null);
});

test('sendEmail request shape and validation', async () => {
  const env = makeEnv({ handler: () => jsonRes(200, {}) });
  await rejects(env.auth.sendEmail('nope'));
  await rejects(env.auth.sendEmail(['a@b.co']));
  assert.strictEqual(env.calls.length, 0);
  await env.auth.sendEmail('guardian@example.test');
  const c = env.calls[0];
  assert.strictEqual(c.init.method, 'POST');
  assert.ok(c.url.startsWith(URL_BASE + '/auth/v1/otp?redirect_to='));
  assert.strictEqual(new (require('url').URL)(c.url).searchParams.get('redirect_to'), 'https://app.test/number_magic/?enter=1');
  assert.deepStrictEqual(c.body, { email: 'guardian@example.test', create_user: true });
  assert.strictEqual(c.init.headers.apikey, 'anon-test');
  assert.strictEqual(c.init.headers['Content-Type'], 'application/json');
});

test('sendEmail errors are sanitized with status', async () => {
  const env = makeEnv({ handler: () => jsonRes(429, { msg: 'rate limit for guardian@example.test' }) });
  const e = await rejects(env.auth.sendEmail('guardian@example.test'));
  assert.strictEqual(e.status, 429);
  assert.ok(!/guardian@example/.test(e.message));
});

test('verifyEmail failures do not persist', async () => {
  let mode = 'bad';
  const env = makeEnv({ handler: () => mode === 'bad' ? jsonRes(403, { msg: 'Token has expired' }) : mode === 'arr' ? jsonRes(200, [1]) : jsonRes(200, { access_token: 'x', refresh_token: 'y', expires_in: 3600 }) });
  let e = await rejects(env.auth.verifyEmail('g@example.test', '123456'));
  assert.strictEqual(e.status, 403);
  mode = 'arr';
  await rejects(env.auth.verifyEmail('g@example.test', '123456'));
  mode = 'nouser';
  await rejects(env.auth.verifyEmail('g@example.test', '123456'));
  await rejects(env.auth.verifyEmail('g@example.test', ''));
  assert.strictEqual(env.data[KEY], undefined);
  assert.strictEqual(env.auth.peek(), null);
});

test('verifyEmail persists verified user and peek has no tokens', async () => {
  const env = makeEnv({ handler: () => jsonRes(200, { access_token: 'at', refresh_token: 'rt', expires_in: 3600, user: { id: 'u9', email: 'g@example.test', user_metadata: { id: 'evil' } } }) });
  let events = 0;
  env.auth.onChange(() => { events++; throw new Error('listener boom'); });
  const view = await env.auth.verifyEmail('g@example.test', '123456');
  const c = env.calls[0];
  assert.ok(c.url.endsWith('/auth/v1/verify'));
  assert.deepStrictEqual(c.body, { email: 'g@example.test', token: '123456', type: 'email' });
  assert.strictEqual(view.user.id, 'u9');
  assert.strictEqual(events, 1);
  assert.strictEqual(JSON.parse(env.data[KEY]).user.id, 'u9');
  const p = env.auth.peek();
  assert.deepStrictEqual(Object.keys(p).sort(), ['expires_at', 'user']);
  assert.ok(!JSON.stringify(p).includes('at') || !('access_token' in p));
  assert.strictEqual((await env.auth.getSession()).access_token, 'at');
});

test('storage failure is not reported as saved', async () => {
  const env = makeEnv({ failWrite: true, handler: () => jsonRes(200, { access_token: 'at', refresh_token: 'rt', expires_in: 3600, user: { id: 'u9', email: 'g@example.test' } }) });
  await rejects(env.auth.verifyEmail('g@example.test', '123456'));
  assert.strictEqual(env.auth.peek(), null);
});

test('valid session needs no refresh; unsubscribe works', async () => {
  const env = makeEnv({ storage: { [KEY]: JSON.stringify(mkSession()) }, handler: () => { throw new Error('no call'); } });
  const s = await env.auth.getSession();
  assert.strictEqual(s.user.id, 'u1');
  assert.strictEqual(env.calls.length, 0);
  let n = 0;
  const off = env.auth.onChange(() => n++);
  off();
  await env.auth.signOut();
  assert.strictEqual(n, 0);
});

test('expiring session refreshes once under concurrency', async () => {
  let release;
  const gate = new Promise((r) => { release = r; });
  const env = makeEnv({
    storage: { [KEY]: JSON.stringify(mkSession({ expires_at: nowS() + 30 })) },
    handler: async () => { await gate; return jsonRes(200, { access_token: 'at-2', refresh_token: 'rt-2', expires_in: 3600, user: { id: 'u1', email: 'g@example.test' } }); }
  });
  const ps = [env.auth.getSession(), env.auth.getSession(), env.auth.getSession()];
  await new Promise((r) => setTimeout(r, 10));
  release();
  const rs = await Promise.all(ps);
  assert.strictEqual(env.calls.length, 1);
  assert.ok(env.calls[0].url.endsWith('/auth/v1/token?grant_type=refresh_token'));
  assert.deepStrictEqual(env.calls[0].body, { refresh_token: 'rt-1' });
  rs.forEach((r) => assert.strictEqual(r.access_token, 'at-2'));
  assert.strictEqual(JSON.parse(env.data[KEY]).refresh_token, 'rt-2');
});

test('network refresh failure preserves refresh token and allows retry', async () => {
  let fail = true;
  const env = makeEnv({
    storage: { [KEY]: JSON.stringify(mkSession({ expires_at: nowS() - 5 })) },
    handler: async () => {
      if (fail) throw new Error('offline');
      return jsonRes(200, { access_token: 'at-3', refresh_token: 'rt-3', expires_in: 3600, user: { id: 'u1', email: 'g@example.test' } });
    }
  });
  assert.strictEqual(await env.auth.getSession(), null); // expired token never used
  assert.strictEqual(JSON.parse(env.data[KEY]).refresh_token, 'rt-1');
  fail = false;
  assert.strictEqual((await env.auth.getSession()).access_token, 'at-3');
  assert.strictEqual(env.calls.length, 2);
});

test('invalid refresh token (400/401) clears auth', async () => {
  for (const st of [400, 401]) {
    const env = makeEnv({
      storage: { [KEY]: JSON.stringify(mkSession({ expires_at: nowS() + 10 })), nm_state_v1: '{"k":1}' },
      handler: () => jsonRes(st, { error_description: 'Invalid Refresh Token' })
    });
    assert.strictEqual(await env.auth.getSession(), null);
    assert.strictEqual(env.data[KEY], undefined);
    assert.strictEqual(env.auth.peek(), null);
    assert.strictEqual(env.data.nm_state_v1, '{"k":1}');
  }
});

test('expired session without refresh token is dropped', async () => {
  const env = makeEnv({ storage: { [KEY]: JSON.stringify(mkSession({ expires_at: nowS() - 5, refresh_token: '' })) }, handler: () => { throw new Error('no call'); } });
  assert.strictEqual(await env.auth.getSession(), null);
  assert.strictEqual(env.data[KEY], undefined);
});

const HASH_OK = '#access_token=hat&refresh_token=hrt&expires_in=3600&token_type=bearer';
const userHandler = (id) => (url, init) => {
  assert.strictEqual(init.method, 'GET');
  assert.ok(url.endsWith('/auth/v1/user'));
  assert.strictEqual(init.headers.Authorization, 'Bearer hat');
  return jsonRes(200, { id, email: 'g@example.test', user_metadata: { id: 'evil' } });
};

test('URL hash is validated, removed, held pending; explicit confirm persists and logs in', async () => {
  const env = makeEnv({ hash: HASH_OK, handler: userHandler('u7') });
  let events = 0;
  env.auth.onChange(() => events++);
  await env.auth.ready();
  assert.strictEqual(env.location.hash, '');
  assert.deepStrictEqual(env.replaced, ['/number_magic/']);
  // not logged in, nothing persisted
  assert.strictEqual(env.auth.peek(), null);
  assert.strictEqual(await env.auth.getSession(), null);
  assert.strictEqual(env.data[KEY], undefined);
  const pend = env.auth.pendingLink();
  assert.deepStrictEqual(JSON.parse(JSON.stringify(pend)), { id: 'u7', email: 'g@example.test' });
  assert.ok(!JSON.stringify(pend).includes('hat'));
  assert.ok(events >= 1); // UI redraw when candidate ready
  const view = await env.auth.confirmLink();
  assert.strictEqual(view.user.id, 'u7');
  assert.strictEqual(env.auth.peek().user.id, 'u7');
  assert.strictEqual(env.auth.pendingLink(), null);
  const stored = JSON.parse(env.data[KEY]);
  assert.strictEqual(stored.access_token, 'hat');
  assert.strictEqual(stored.refresh_token, 'hrt');
  assert.strictEqual((await env.auth.getSession()).user.id, 'u7');
});

test('same-page email link stays pending until explicit confirmation', async () => {
  const env=makeEnv({handler:()=>jsonRes(200,{id:'u7',email:'g@example.test'})});
  await env.auth.ready();
  env.location.hash='#access_token=hat&refresh_token=hrt&expires_in=3600';
  env.fire('hashchange',{});
  await new Promise(r=>setTimeout(r,0));
  assert.strictEqual(env.location.hash,'');
  assert.strictEqual(env.auth.pendingLink().id,'u7');
  assert.strictEqual(await env.auth.getSession(),null);
  assert.strictEqual(env.data[KEY],undefined);
  await env.auth.confirmLink();
  assert.strictEqual(env.auth.peek().user.id,'u7');
});

test('forged/bad URL hash is rejected but hash still removed', async () => {
  const hashes = [
    '#access_token=forged&refresh_token=hrt&expires_in=3600',
    '#access_token=onlyaccess&expires_in=3600'
  ];
  for (const h of hashes) {
    const env = makeEnv({ hash: h, handler: () => jsonRes(401, { msg: 'invalid JWT' }) });
    await env.auth.ready();
    assert.strictEqual(env.auth.peek(), null);
    assert.strictEqual(env.auth.pendingLink(), null);
    assert.strictEqual(env.data[KEY], undefined);
    assert.strictEqual(env.replaced.length, 1);
    await rejects(env.auth.confirmLink());
  }
  // valid status but no user id
  const env = makeEnv({ hash: HASH_OK, handler: () => jsonRes(200, { email: 'x@example.test' }) });
  await env.auth.ready();
  assert.strictEqual(env.auth.pendingLink(), null);
  assert.strictEqual(env.data[KEY], undefined);
});

test('confirmLink rejects with identity code when signed in as a different user', async () => {
  const env = makeEnv({ storage: { [KEY]: JSON.stringify(mkSession()) }, hash: HASH_OK, handler: userHandler('u7') });
  await env.auth.ready();
  assert.strictEqual(env.auth.peek().user.id, 'u1');
  assert.strictEqual(env.auth.pendingLink().id, 'u7');
  const e = await rejects(env.auth.confirmLink());
  assert.strictEqual(e.code, 'identity');
  assert.strictEqual(JSON.parse(env.data[KEY]).user.id, 'u1');
  assert.strictEqual(env.auth.peek().user.id, 'u1');
  // logout discards candidate and never restores it
  env.calls.length = 0;
  await env.auth.signOut();
  assert.strictEqual(env.auth.pendingLink(), null);
  const e2 = await rejects(env.auth.confirmLink());
  assert.strictEqual(e2.code, 'nolink');
  assert.strictEqual(env.auth.peek(), null);
  assert.strictEqual(env.data[KEY], undefined);
});

test('confirmLink for same user while signed in replaces tokens', async () => {
  const env = makeEnv({ storage: { [KEY]: JSON.stringify(mkSession()) }, hash: HASH_OK, handler: userHandler('u1') });
  await env.auth.ready();
  await env.auth.confirmLink();
  assert.strictEqual(JSON.parse(env.data[KEY]).access_token, 'hat');
});

test('cancelLink discards candidate without persisting', async () => {
  const env = makeEnv({ hash: HASH_OK, handler: userHandler('u7') });
  await env.auth.ready();
  let events = 0;
  env.auth.onChange(() => events++);
  env.auth.cancelLink();
  assert.strictEqual(env.auth.pendingLink(), null);
  assert.strictEqual(events, 1);
  assert.strictEqual(env.data[KEY], undefined);
  assert.strictEqual(env.auth.peek(), null);
  await rejects(env.auth.confirmLink());
});

test('stale hash validation response is ignored after signOut', async () => {
  let release;
  const gate = new Promise((r) => { release = r; });
  const env = makeEnv({ hash: HASH_OK, handler: async () => { await gate; return jsonRes(200, { id: 'u7', email: 'g@example.test' }); } });
  const rp = env.auth.ready();
  while (!env.calls.length) await new Promise((r) => setTimeout(r, 0));
  await env.auth.signOut();
  release();
  await rp;
  assert.strictEqual(env.auth.pendingLink(), null);
  assert.strictEqual(env.auth.peek(), null);
});

test('cross-tab storage signout clears session and candidate', async () => {
  const env = makeEnv({ storage: { [KEY]: JSON.stringify(mkSession()) }, handler: () => { throw new Error('no call'); } });
  assert.strictEqual((await env.auth.getSession()).user.id, 'u1');
  let last = 'unset';
  env.auth.onChange((v) => { last = v; });
  delete env.data[KEY];
  env.fire('storage', { key: KEY, newValue: null });
  assert.strictEqual(env.auth.peek(), null);
  assert.strictEqual(last, null);
  assert.strictEqual(await env.auth.getSession(), null);
  // unrelated keys are ignored
  env.data[KEY] = JSON.stringify(mkSession());
  env.fire('storage', { key: 'other', newValue: 'x' });
  assert.strictEqual(env.auth.peek(), null);
});

test('local removeItem failure on signOut is reported as storage error', async () => {
  const env = makeEnv({
    failRemove: true,
    storage: { [KEY]: JSON.stringify(mkSession()) },
    handler: async () => jsonRes(204, '')
  });
  await env.auth.ready();
  const e = await rejects(env.auth.signOut());
  assert.strictEqual(e.code, 'storage');
  assert.strictEqual(env.auth.peek(), null); // memory cleared regardless
});

test('signOut clears only guardian key and works offline', async () => {
  const env = makeEnv({
    storage: { [KEY]: JSON.stringify(mkSession()), nm_state_v1: '{"progress":5}' },
    handler: async () => { throw new Error('offline'); }
  });
  await env.auth.signOut();
  const c = env.calls[0];
  assert.ok(c.url.endsWith('/auth/v1/logout?scope=local'));
  assert.strictEqual(c.init.headers.Authorization, 'Bearer at-1');
  assert.strictEqual(env.data[KEY], undefined);
  assert.strictEqual(env.data.nm_state_v1, '{"progress":5}');
  assert.strictEqual(env.auth.peek(), null);
});

test('a late refresh cannot restore a signed-out session', async () => {
  let resolveRefresh, refreshCalls = 0;
  const env = makeEnv({storage:{[KEY]:JSON.stringify(mkSession({expires_at:nowS()-1}))}, handler:async url=>{
    if(url.includes('grant_type=refresh_token')){
      if(++refreshCalls===1)return new Promise(r=>{resolveRefresh=r;});
      return jsonRes(200,{access_token:'at-direct',refresh_token:'rt-direct',expires_in:3600});
    }
    return jsonRes(204,'');
  }});
  const pending=env.auth.getSession();
  while(!resolveRefresh)await new Promise(r=>setTimeout(r,0));
  await env.auth.signOut();
  // signOut's own direct refresh yields a token for logout only; never a session
  const lo=env.calls.find(c=>c.url.includes('/logout'));
  assert.ok(lo);
  assert.strictEqual(lo.init.headers.Authorization,'Bearer at-direct');
  assert.strictEqual(env.auth.peek(),null);
  resolveRefresh(jsonRes(200,mkSession()));
  assert.strictEqual(await pending,null);
  assert.strictEqual(env.auth.peek(),null);
  assert.strictEqual(env.data[KEY],undefined);
});

const verifyBody = { access_token: 'at-new', refresh_token: 'rt-new', expires_in: 3600, user: { id: 'u2', email: 'n@example.test' } };

test('delayed refresh cannot overwrite a newer verify', async () => {
  let resolveRefresh;
  const env = makeEnv({
    storage: { [KEY]: JSON.stringify(mkSession({ expires_at: nowS() + 10 })) },
    handler: async (url) => {
      if (url.includes('grant_type=refresh_token')) return new Promise((r) => { resolveRefresh = r; });
      return jsonRes(200, verifyBody);
    }
  });
  const pending = env.auth.getSession();
  while (!resolveRefresh) await new Promise((r) => setTimeout(r, 0));
  await env.auth.verifyEmail('n@example.test', '123456');
  resolveRefresh(jsonRes(200, { access_token: 'at-old2', refresh_token: 'rt-old2', expires_in: 3600, user: { id: 'u1', email: 'g@example.test' } }));
  await pending;
  assert.strictEqual(env.auth.peek().user.id, 'u2');
  assert.strictEqual(JSON.parse(env.data[KEY]).access_token, 'at-new');
  assert.strictEqual((await env.auth.getSession()).access_token, 'at-new');
});

test('delayed logout cannot clear a newer verify', async () => {
  let resolveLogout;
  const env = makeEnv({
    storage: { [KEY]: JSON.stringify(mkSession()) },
    handler: async (url) => {
      if (url.includes('/logout')) return new Promise((r) => { resolveLogout = r; });
      return jsonRes(200, verifyBody);
    }
  });
  const so = env.auth.signOut();
  assert.strictEqual(env.auth.peek(), null); // local session cleared immediately
  assert.strictEqual(env.data[KEY], undefined);
  while (!resolveLogout) await new Promise((r) => setTimeout(r, 0));
  await env.auth.verifyEmail('n@example.test', '123456');
  resolveLogout(jsonRes(204, ''));
  await so;
  assert.strictEqual(env.auth.peek().user.id, 'u2');
  assert.strictEqual(JSON.parse(env.data[KEY]).access_token, 'at-new');
});

const PW = 'correct-horse-battery';
const userBody = (id) => ({ id, email: 'g@example.test' });
const pendingStore = (over) => ({ [KEY]: JSON.stringify(mkSession(Object.assign({ password_setup_pending: true }, over))) });
const waitFor = async (fn) => { while (!fn()) await new Promise((r) => setTimeout(r, 0)); };
const noPassword = (env) => {
  assert.ok(!Object.values(env.data).some((v) => String(v).includes(PW)), 'password stored');
};

test('verifyEmail sets pending flag before persist/emit; link confirm too', async () => {
  const env = makeEnv({ handler: () => jsonRes(200, { access_token: 'at', refresh_token: 'rt', expires_in: 3600, user: { id: 'u9', email: 'g@example.test' } }) });
  assert.strictEqual(env.auth.requiresPassword(), false);
  let seen = null;
  env.auth.onChange(() => { seen = { req: env.auth.requiresPassword(), stored: JSON.parse(env.data[KEY]).password_setup_pending }; });
  const view = await env.auth.verifyEmail('g@example.test', '123456');
  assert.deepStrictEqual(seen, { req: true, stored: true });
  assert.strictEqual(env.auth.requiresPassword(), true);
  assert.deepStrictEqual(Object.keys(view).sort(), ['expires_at', 'user']);
  assert.deepStrictEqual(Object.keys(env.auth.peek()).sort(), ['expires_at', 'user']);

  const env2 = makeEnv({ hash: HASH_OK, handler: userHandler('u7') });
  await env2.auth.ready();
  assert.strictEqual(env2.auth.requiresPassword(), false);
  let seen2 = null;
  env2.auth.onChange(() => { if (env2.auth.peek()) seen2 = { req: env2.auth.requiresPassword(), stored: JSON.parse(env2.data[KEY]).password_setup_pending }; });
  await env2.auth.confirmLink();
  assert.deepStrictEqual(seen2, { req: true, stored: true });
});

test('legacy session defaults false; flag restores; metadata never authorizes', async () => {
  const legacy = makeEnv({ storage: { [KEY]: JSON.stringify(mkSession()) }, handler: () => { throw new Error('no call'); } });
  await legacy.auth.ready();
  assert.strictEqual(legacy.auth.requiresPassword(), false);
  const meta = makeEnv({ storage: { [KEY]: JSON.stringify(mkSession({ user: { id: 'u1', email: 'g@example.test', user_metadata: { password_setup_pending: true }, password_setup_pending: true } })) }, handler: () => { throw new Error('no call'); } });
  await meta.auth.ready();
  assert.strictEqual(meta.auth.requiresPassword(), false);
  const pend = makeEnv({ storage: pendingStore(), handler: () => { throw new Error('no call'); } });
  await pend.auth.ready();
  assert.strictEqual(pend.auth.requiresPassword(), true);
  // cross-tab restore
  const tab = makeEnv({ handler: () => { throw new Error('no call'); } });
  tab.data[KEY] = JSON.stringify(mkSession({ password_setup_pending: true }));
  tab.fire('storage', { key: KEY });
  assert.strictEqual(tab.auth.requiresPassword(), true);
});

test('refresh preserves pending flag and ignores server-supplied flag', async () => {
  const body = (flag) => ({ access_token: 'at-2', refresh_token: 'rt-2', expires_in: 3600, password_setup_pending: flag, user: { id: 'u1', email: 'g@example.test' } });
  const a = makeEnv({ storage: pendingStore({ expires_at: nowS() + 30 }), handler: () => jsonRes(200, body(false)) });
  assert.strictEqual((await a.auth.getSession()).access_token, 'at-2');
  assert.strictEqual(a.auth.requiresPassword(), true);
  assert.strictEqual(JSON.parse(a.data[KEY]).password_setup_pending, true);
  const b = makeEnv({ storage: { [KEY]: JSON.stringify(mkSession({ expires_at: nowS() + 30 })) }, handler: () => jsonRes(200, body(true)) });
  await b.auth.getSession();
  assert.strictEqual(b.auth.requiresPassword(), false);
  assert.strictEqual(JSON.parse(b.data[KEY]).password_setup_pending, false);
});

test('setPassword validation, mismatch and no-session make no requests', async () => {
  const env = makeEnv({ storage: pendingStore(), handler: () => { throw new Error('no call'); } });
  await env.auth.ready();
  await rejects(env.auth.setPassword('short', 'short'));
  await rejects(env.auth.setPassword(undefined, undefined));
  await rejects(env.auth.setPassword('x'.repeat(129), 'x'.repeat(129)));
  const e = await rejects(env.auth.setPassword(PW, PW + '!'));
  assert.strictEqual(e.code, 'mismatch');
  assert.ok(!e.message.includes(PW));
  assert.strictEqual(env.calls.length, 0);
  assert.strictEqual(env.auth.requiresPassword(), true);
  const none = makeEnv({ handler: () => { throw new Error('no call'); } });
  const e2 = await rejects(none.auth.setPassword(PW, PW));
  assert.strictEqual(e2.code, 'nosession');
  assert.strictEqual(none.calls.length, 0);
  // boundaries are accepted
  const ok = makeEnv({ storage: pendingStore(), handler: () => jsonRes(200, userBody('u1')) });
  await ok.auth.setPassword('x'.repeat(8), 'x'.repeat(8));
  await ok.auth.setPassword('y'.repeat(128), 'y'.repeat(128));
});

test('setPassword request shape, clears flag, stores no password', async () => {
  const env = makeEnv({ storage: pendingStore(), handler: () => jsonRes(200, userBody('u1')) });
  let events = 0;
  env.auth.onChange(() => events++);
  const view = await env.auth.setPassword(PW, PW);
  const c = env.calls[0];
  assert.strictEqual(c.init.method, 'PUT');
  assert.strictEqual(c.url, URL_BASE + '/auth/v1/user');
  assert.strictEqual(c.init.headers.Authorization, 'Bearer at-1');
  assert.strictEqual(c.init.headers.apikey, 'anon-test');
  assert.deepStrictEqual(c.body, { password: PW });
  assert.deepStrictEqual(Object.keys(view).sort(), ['expires_at', 'user']);
  assert.strictEqual(env.auth.requiresPassword(), false);
  assert.strictEqual(JSON.parse(env.data[KEY]).password_setup_pending, false);
  assert.strictEqual(events, 1);
  noPassword(env);
  assert.ok(!JSON.stringify(env.auth.peek()).includes(PW));
});

test('setPassword HTTP failure keeps flag and never echoes password', async () => {
  for (const st of [422, 401, 429, 500]) {
    const env = makeEnv({ storage: pendingStore(), handler: () => jsonRes(st, { msg: 'Password ' + PW + ' is too weak', error_description: PW }) });
    const e = await rejects(env.auth.setPassword(PW, PW));
    assert.strictEqual(e.status, st);
    assert.ok(!e.message.includes(PW));
    assert.strictEqual(env.auth.requiresPassword(), true);
    assert.strictEqual(JSON.parse(env.data[KEY]).password_setup_pending, true);
    noPassword(env);
  }
  const net = makeEnv({ storage: pendingStore(), handler: async () => { throw new Error('offline ' + PW); } });
  const e = await rejects(net.auth.setPassword(PW, PW));
  assert.ok(!e.message.includes(PW));
  assert.strictEqual(net.auth.requiresPassword(), true);
});

test('setPassword requires server response for the same user id', async () => {
  for (const body of [{ id: 'u2' }, {}, [1], null]) {
    const env = makeEnv({ storage: pendingStore(), handler: () => jsonRes(200, body) });
    await rejects(env.auth.setPassword(PW, PW));
    assert.strictEqual(env.auth.requiresPassword(), true);
    assert.strictEqual(JSON.parse(env.data[KEY]).password_setup_pending, true);
  }
});

test('setPassword storage failure is not reported as saved', async () => {
  const opts = { storage: pendingStore(), handler: () => jsonRes(200, userBody('u1')) };
  const env = makeEnv(opts);
  await env.auth.ready();
  opts.failWrite = true;
  const e = await rejects(env.auth.setPassword(PW, PW));
  assert.strictEqual(e.code, 'storage');
  assert.strictEqual(env.auth.requiresPassword(), true);
  assert.strictEqual(JSON.parse(env.data[KEY]).password_setup_pending, true);
});

test('late setPassword response after signOut or account change cannot apply', async () => {
  let release;
  const gate = new Promise((r) => { release = r; });
  const handler = async (url, init) => {
    if (init.method === 'PUT') { await gate; return jsonRes(200, userBody('u1')); }
    return jsonRes(204, '');
  };
  const env = makeEnv({ storage: pendingStore(), handler });
  const p = env.auth.setPassword(PW, PW);
  await waitFor(() => env.calls.some((c) => c.init.method === 'PUT'));
  await env.auth.signOut();
  release();
  const e = await rejects(p);
  assert.strictEqual(e.code, 'cancelled');
  assert.strictEqual(env.auth.peek(), null);
  assert.strictEqual(env.auth.requiresPassword(), false);
  assert.strictEqual(env.data[KEY], undefined);

  let release2;
  const gate2 = new Promise((r) => { release2 = r; });
  const env2 = makeEnv({ storage: pendingStore(), handler: async () => { await gate2; return jsonRes(200, userBody('u1')); } });
  const p2 = env2.auth.setPassword(PW, PW);
  await waitFor(() => env2.calls.length > 0);
  env2.data[KEY] = JSON.stringify(mkSession({ access_token: 'at-other', user: { id: 'u5', email: 'o@example.test' }, password_setup_pending: true }));
  env2.fire('storage', { key: KEY });
  release2();
  await rejects(p2);
  assert.strictEqual(env2.auth.peek().user.id, 'u5');
  assert.strictEqual(env2.auth.requiresPassword(), true);
  assert.strictEqual(JSON.parse(env2.data[KEY]).user.id, 'u5');
});

test('signInWithPassword success: request shape, flag false, no password stored', async () => {
  const env = makeEnv({ handler: () => jsonRes(200, { access_token: 'atp', refresh_token: 'rtp', expires_in: 3600, password_setup_pending: true, user: { id: 'u3', email: 'g@example.test' } }) });
  let seen = null;
  env.auth.onChange(() => { seen = JSON.parse(env.data[KEY]).password_setup_pending; });
  const view = await env.auth.signInWithPassword(' g@example.test ', PW);
  const c = env.calls[0];
  assert.strictEqual(c.init.method, 'POST');
  assert.strictEqual(c.url, URL_BASE + '/auth/v1/token?grant_type=password');
  assert.deepStrictEqual(c.body, { email: 'g@example.test', password: PW });
  assert.strictEqual(view.user.id, 'u3');
  assert.deepStrictEqual(Object.keys(view).sort(), ['expires_at', 'user']);
  assert.strictEqual(seen, false);
  assert.strictEqual(env.auth.requiresPassword(), false);
  assert.strictEqual(JSON.parse(env.data[KEY]).access_token, 'atp');
  noPassword(env);
});

test('signInWithPassword failures do not persist or expose password', async () => {
  const env0 = makeEnv({ handler: () => { throw new Error('no call'); } });
  await rejects(env0.auth.signInWithPassword('nope', PW));
  await rejects(env0.auth.signInWithPassword('g@example.test', ''));
  await rejects(env0.auth.signInWithPassword('g@example.test', 'x'.repeat(129)));
  assert.strictEqual(env0.calls.length, 0);
  for (const st of [400, 401, 429, 500]) {
    const env = makeEnv({ handler: () => jsonRes(st, { msg: 'bad ' + PW + ' for g@example.test', error_description: PW }) });
    const e = await rejects(env.auth.signInWithPassword('g@example.test', PW));
    assert.strictEqual(e.status, st);
    assert.ok(!e.message.includes(PW));
    assert.strictEqual(env.data[KEY], undefined);
    assert.strictEqual(env.auth.peek(), null);
  }
  for (const body of [[1], { access_token: 'x', refresh_token: 'y', expires_in: 3600 }, { access_token: 'x', expires_in: 3600, user: { id: 'u' } }]) {
    const env = makeEnv({ handler: () => jsonRes(200, body) });
    await rejects(env.auth.signInWithPassword('g@example.test', PW));
    assert.strictEqual(env.data[KEY], undefined);
  }
  const net = makeEnv({ handler: async () => { throw new Error('offline ' + PW); } });
  assert.ok(!(await rejects(net.auth.signInWithPassword('g@example.test', PW))).message.includes(PW));
  const fw = makeEnv({ failWrite: true, handler: () => jsonRes(200, { access_token: 'a', refresh_token: 'r', expires_in: 3600, user: { id: 'u3' } }) });
  const e = await rejects(fw.auth.signInWithPassword('g@example.test', PW));
  assert.strictEqual(e.code, 'storage');
  assert.strictEqual(fw.auth.peek(), null);
});

test('late signInWithPassword response after signOut cannot apply', async () => {
  let release;
  const gate = new Promise((r) => { release = r; });
  const env = makeEnv({ handler: async () => { await gate; return jsonRes(200, { access_token: 'atp', refresh_token: 'rtp', expires_in: 3600, user: { id: 'u3', email: 'g@example.test' } }); } });
  const p = env.auth.signInWithPassword('g@example.test', PW);
  await waitFor(() => env.calls.length > 0);
  await env.auth.signOut();
  release();
  const e = await rejects(p);
  assert.strictEqual(e.code, 'cancelled');
  assert.strictEqual(env.auth.peek(), null);
  assert.strictEqual(env.data[KEY], undefined);
});

(async () => {
  let failed = 0;
  for (const [name, fn] of tests) {
    try { await fn(); console.log('ok   - ' + name); }
    catch (e) { failed++; console.log('FAIL - ' + name + ': ' + (e && e.message)); }
  }
  if (failed) { console.log(failed + ' failed'); process.exit(1); }
  console.log('profile-auth: all ' + tests.length + ' checks passed');
})();
