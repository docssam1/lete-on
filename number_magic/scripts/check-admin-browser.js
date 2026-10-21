#!/usr/bin/env node
/* Standalone browser check for number_magic/admin.html.
   - local static server over number_magic/
   - deterministic mock nm-membership endpoint via Playwright routing (no real network)
   - every non-local request is aborted; no real email/admin/phone/SMS is ever used. */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const { chromium } = require('./lib/playwright');

const ROOT = path.join(__dirname, '..');
const ENDPOINT = 'https://fgahqumaldheqettmvqg.supabase.co/functions/v1/nm-membership';
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.json': 'application/json' };

/* fake, per-run values that exist only inside this test */
const GOOD_USER = 'mock-admin-' + crypto.randomBytes(3).toString('hex');
const GOOD_CODE = 'mock-code-' + crypto.randomBytes(6).toString('hex');
const TOKEN = 'mock-token-' + crypto.randomBytes(6).toString('hex');
const PUBLIC_KEY = 'mock-public-key';
const MSG = '[테스트] 오늘의 학습지입니다.\n아래 링크를 확인하세요.';

let failures = 0;
function ok(cond, msg) { if (cond) console.log('  ok  ' + msg); else { failures++; console.error('  FAIL ' + msg); } }

function staticServer() {
  return new Promise((resolve) => {
    const s = http.createServer((req, res) => {
      const u = decodeURIComponent(req.url.split('?')[0]);
      const f = path.normalize(path.join(ROOT, u === '/' ? '/admin.html' : u));
      if (!f.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
      fs.readFile(f, (e, b) => {
        if (e) { res.writeHead(404); return res.end(); }
        res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); res.end(b);
      });
    });
    s.listen(0, '127.0.0.1', () => resolve(s));
  });
}

function makeMock() {
  const m = {
    calls: [], grants: [], revokes: [], links: [], learning: [], previews: 0, sends: [], logouts: 0,
    members: [
      { userId: 'u1', email: 'parent-a@example.test', plan: 'six_month', startsAt: '2026-03-01', endsAt: '2026-09-01', trialStartedAt: null, trialEndsAt: null, status: 'active', canUse: true, phoneMasked: '010-****-1234',
        profiles: [{ name: '테스트학생', settings: null, phoneMasked: '010-****-1234', hasConsent: true }] },
      { userId: 'u2', email: 'parent-b@example.test', plan: null, startsAt: null, endsAt: null, trialStartedAt: '2026-10-01', trialEndsAt: '2026-10-08', status: 'trial', canUse: true, profiles: [] }
    ],
    unlinked: [{ name: '미연결학생' }, { name: '긴이름미연결학생테스트' }]
  };
  m.handle = (body) => {
    m.calls.push(body.action);
    const json = (status, data) => ({ status, data });
    if (body.action === 'admin_login') {
      return body.username === GOOD_USER && body.code === GOOD_CODE ? json(200, { token: TOKEN, expiresAt: '2099-01-01T00:00:00Z' }) : json(401, { error: '<b>raw server error</b>' });
    }
    if (body.adminToken !== TOKEN) return json(401, { error: 'no' });
    switch (body.action) {
      case 'admin_logout': m.logouts++; return json(200, { ok: true });
      case 'admin_list': {
        const list = body.query ? m.members.filter((x) => x.email === body.query) : m.members;
        return json(200, { members: list, unlinkedProfiles: m.unlinked });
      }
      case 'admin_grant': {
        m.grants.push({ email: body.email, plan: body.plan });
        let mem = m.members.find((x) => x.email === body.email);
        if (!mem) { mem = { userId: 'u' + (m.members.length + 1), email: body.email, profiles: [] }; m.members.push(mem); }
        /* the server may report a paid grant as 'paid' or 'active'; the UI must treat both as in use */
        Object.assign(mem, { plan: body.plan, startsAt: '2026-10-21', endsAt: body.plan === 'annual' ? '2027-10-21' : '2027-04-21', status: body.plan === 'annual' ? 'paid' : 'active', canUse: true });
        return json(200, { member: mem });
      }
      case 'admin_revoke': {
        m.revokes.push(body.userId);
        const mem = m.members.find((x) => x.userId === body.userId); if (mem) { mem.status = 'revoked'; mem.canUse = false; }
        return json(200, { ok: true });
      }
      case 'admin_link':
        m.links.push({ email: body.email, profileName: body.profileName });
        if (body.email === 'conflict@example.test') return json(409, { error: '<img src=x onerror=alert(1)>' });
        m.unlinked = m.unlinked.filter((x) => x.name !== body.profileName);
        return json(200, { ok: true });
      case 'admin_set_learning': m.learning.push(body); return json(200, { settings: Object.assign({}, body, { action: undefined, adminToken: undefined, profileName: undefined }) });
      case 'admin_preview_worksheet': m.previews++; return json(200, { previewId: 'pv-1', message: MSG, link: 'https://example.test/ws/1', phoneMasked: '010-****-1234', messageType: 'LMS', expiresAt: '2099-01-01T00:10:00Z' });
      case 'admin_send_worksheet': m.sends.push(body.previewId); return json(200, { ok: true, status: 'sent', phoneMasked: '010-****-1234' });
      default: return json(400, { error: 'unknown' });
    }
  };
  return m;
}

async function noOverflow(page, label) {
  const r = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, bw: document.body.scrollWidth }));
  ok(r.sw <= r.cw && r.bw <= r.cw, `no horizontal overflow ${label} (scroll ${r.sw}/${r.bw} <= ${r.cw})`);
}

(async () => {
  const server = await staticServer();
  const base = 'http://127.0.0.1:' + server.address().port;
  const mock = makeMock();
  const blocked = [];
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.addInitScript((k) => { window.NM_PUBLIC_ANON_KEY = k; }, PUBLIC_KEY);

  await ctx.route('**/*', async (route) => {
    const req = route.request(); const url = req.url();
    if (url.startsWith(base)) {
      return route.continue(); /* real app/learning-plan.js is used */
    }
    if (url === ENDPOINT) {
      if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': 'POST' } });
      let body = {}; try { body = JSON.parse(req.postData() || '{}'); } catch (e) { /* ignore */ }
      if (req.headers()['apikey'] !== PUBLIC_KEY) mock.badKey = true;
      if (body.action === 'admin_send_worksheet') await new Promise((r) => setTimeout(r, 400));
      const out = mock.handle(body);
      return route.fulfill({ status: out.status, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(out.data) });
    }
    blocked.push(req.method() + ' ' + url);
    return route.abort();
  });

  const page = await ctx.newPage();
  const dialogs = []; page.on('dialog', (d) => { dialogs.push(d.message()); d.dismiss(); });
  const errors = []; page.on('pageerror', (e) => errors.push(String(e)));

  try {
    console.log('login');
    await page.goto(base + '/admin.html');
    ok(await page.inputValue('#login-username') === '' && await page.inputValue('#login-code') === '', 'login fields not prefilled');
    ok(await page.getAttribute('#login-code', 'type') === 'password', 'approval code field is password type');
    ok(mock.calls.length === 0, 'no API call on load');
    await page.fill('#login-username', 'wrong-user'); await page.fill('#login-code', 'wrong-code');
    await page.click('#login-submit');
    await page.waitForFunction(() => /올바르지 않습니다/.test(document.getElementById('login-status').textContent));
    ok(!(await page.locator('#login-status').innerHTML()).includes('<b>'), 'wrong credentials: generic error, no raw server HTML');
    ok(await page.isHidden('#admin-view'), 'wrong credentials keep admin hidden');
    ok(await page.evaluate(() => sessionStorage.length === 0), 'no session stored after failed login');
    await noOverflow(page, 'login 1280');

    await page.fill('#login-username', GOOD_USER); await page.fill('#login-code', GOOD_CODE);
    await page.click('#login-submit');
    await page.waitForSelector('#admin-view:not([hidden])');
    await page.waitForSelector('.member');
    ok(mock.calls.includes('admin_list'), 'list loaded after login');
    ok(await page.locator('.member').count() === 2, 'NM members listed');
    ok(await page.inputValue('#login-code') === '', 'approval code field cleared after submit');
    const store = await page.evaluate(() => JSON.stringify([Object.entries(localStorage), Object.entries(sessionStorage)]));
    ok(!store.includes(GOOD_CODE) && !store.includes(GOOD_USER), 'no username/code in web storage');
    ok(await page.evaluate(() => localStorage.length === 0), 'nothing in localStorage');
    ok(await page.evaluate((t) => sessionStorage.getItem('nm_admin_session_v1').includes(t), TOKEN), 'token only in sessionStorage');
    ok(!(await page.content()).includes(GOOD_CODE), 'code not in DOM');
    ok(mock.previews === 0 && mock.sends.length === 0, 'no SMS preview/send on login/load');
    ok(await page.locator('#summary dd').count() >= 4, 'membership summary visible');
    ok((await page.locator('#unlinked-list li').count()) === 2, 'unlinked records section lists records');

    console.log('search');
    await page.fill('#search-email', 'parent-b@example.test'); await page.click('#search-form button[type=submit]');
    await page.waitForFunction(() => document.querySelectorAll('.member').length === 1);
    ok(true, 'exact email search filters list');
    await page.click('#search-reset');
    await page.waitForFunction(() => document.querySelectorAll('.member').length === 2);

    console.log('grant');
    ok(await page.locator('input[name=grant-plan]').count() === 2, 'only two plan options (6 months / 1 year)');
    await page.fill('#grant-email', 'new-person@example.test');
    await page.check('input[name=grant-plan][value=six_month]');
    await page.click('#grant-form button[type=submit]');
    ok(await page.isVisible('#grant-confirm'), 'grant review confirmation shown');
    const ct = await page.textContent('#grant-confirm-text');
    ok(ct.includes('6개월') && ct.includes('new-person@example.test'), 'confirmation shows term and email');
    ok(mock.grants.length === 0, 'no grant call before confirm');
    await page.click('#grant-do');
    await page.waitForFunction(() => document.querySelectorAll('.member').length === 3);
    ok(mock.grants.length === 1 && mock.grants[0].plan === 'six_month', 'six_month grant sent');
    await page.fill('#grant-email', 'parent-b@example.test');
    await page.check('input[name=grant-plan][value=annual]');
    await page.click('#grant-form button[type=submit]');
    ok((await page.textContent('#grant-confirm-text')).includes('1년'), 'annual confirmation shows 1년');
    await page.click('#grant-do');
    await page.waitForFunction(() => document.querySelectorAll('.badge.on').length >= 3);
    ok(mock.grants.length === 2 && mock.grants[1].plan === 'annual', 'annual grant sent');
    ok(/이용 중 · 이용 가능/.test(await page.locator('.member', { hasText: 'parent-b@example.test' }).locator('.badge').textContent()), 'paid status shown as in use');

    console.log('revoke');
    await page.locator('.member').first().getByRole('button', { name: '이용 해지' }).click();
    ok(await page.isVisible('#revoke-dialog') && mock.revokes.length === 0, 'revoke confirmation before call');
    await page.click('#revoke-do');
    await page.waitForFunction(() => /해지/.test(document.querySelector('.member .badge').textContent));
    ok(mock.revokes[0] === 'u1', 'revoke sent for chosen member');
    ok(/이용 불가/.test(await page.locator('.member .badge').first().textContent()), 'revoked status shown');

    console.log('link');
    await page.selectOption('#link-profile', '미연결학생');
    await page.fill('#link-email', 'conflict@example.test');
    await page.click('#link-form button[type=submit]');
    ok(await page.isVisible('#link-confirm') && mock.links.length === 0, 'link confirmation before call');
    await page.click('#link-do');
    await page.waitForFunction(() => /충돌/.test(document.getElementById('link-status').textContent));
    ok(!(await page.locator('#link-status').innerHTML()).includes('<img'), 'conflict: generic message, nothing reflected');
    ok(await page.locator('#unlinked-list li').count() === 2, 'conflict keeps unlinked record');
    await page.fill('#link-email', 'parent-b@example.test');
    await page.click('#link-form button[type=submit]'); await page.click('#link-do');
    await page.waitForFunction(() => document.querySelectorAll('#unlinked-list li').length === 1);
    ok(mock.links.length === 2, 'successful link removes record from unlinked list');
    ok(/한 명/.test(await page.textContent('#sec-students')), 'one-student-per-email note shown');

    console.log('learning settings + roadmap');
    const stu = page.locator('.student').first();
    const courseSel = stu.locator('select[id$="-course"]');
    const opts = await courseSel.locator('option').evaluateAll((o) => o.map((x) => x.value));
    ok(opts.length > 1 && opts.every((v) => /^C\d+$/.test(v)), 'course options come from NM_COURSES (C-keys)');
    const target = opts[Math.min(3, opts.length - 1)];
    await courseSel.selectOption(target);
    const sessCount = await stu.locator('select[id$="-session"] option').count();
    await stu.locator('select[id$="-session"]').selectOption(String(Math.min(2, sessCount)));
    await stu.locator('select[id$="-speed"]').selectOption('1.25');
    await stu.locator('select[id$="-amount"]').selectOption('0.85');
    await stu.locator('select[id$="-cadence"]').selectOption('w2');
    await stu.locator('select[id$="-grade"]').selectOption('1');
    const startDate = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10); /* always in the future */
    await stu.locator('input[type=date]').fill(startDate);
    ok(/주 2회/.test(await stu.locator('.learn-summary').textContent()), 'summary shows weekly count');
    ok(await stu.locator('.roadmap tbody tr').count() === 12, 'monthly roadmap rows visible (real NM_LEARNING_PLAN)');
    const first = await stu.locator('.roadmap tbody tr').first().textContent();
    ok(/\d{4}-\d{2}/.test(first) && /초\d/.test(first) && first.includes(target + ' · '), 'roadmap row has month + grade + real course label');
    ok(/\d+–\d+회차/.test(first), 'roadmap row has real session range');
    await stu.locator('select[id$="-cadence"]').selectOption('w1');
    ok(/주 1회/.test(await stu.locator('.learn-summary').textContent()), 'preview refreshes live');
    await stu.locator('select[id$="-cadence"]').selectOption('w2');
    const links = await stu.locator('.advice a').evaluateAll((a) => a.map((x) => x.href));
    ok(links.length >= 1 && links.every((h) => /^https:\/\//.test(h)), 'real advice renders only https source links');
    await stu.getByRole('button', { name: '학습 설정 저장' }).click();
    await page.waitForFunction(() => /저장되었습니다/.test(document.querySelector('.student .status').textContent));
    const L = mock.learning[0];
    const now = new Date(); const ay = now.getMonth() + 1 >= 3 ? now.getFullYear() : now.getFullYear() - 1;
    ok(L && L.courseKey === target && L.speed === 1.25 && L.amount === 0.85 && L.cadence === 'w2' && L.startDate === startDate, 'saved start/pace/amount/cadence');
    ok(L && L.entryYear === ay && L.sessionIndex === Math.min(2, sessCount), 'entryYear from grade (March school year) + 1-based session');

    console.log('sms');
    await stu.getByRole('button', { name: '학습지 문자 전송' }).click();
    await page.waitForSelector('.sms-box:not([hidden])');
    ok(mock.previews === 1 && mock.sends.length === 0, 'preview made, zero sends before confirm');
    const boxText = await stu.locator('.sms-box').textContent();
    ok(boxText.includes('010-****-1234') && !/010-\d{4}-\d{4}/.test(boxText), 'recipient is masked');
    ok(boxText.includes('LMS'), 'LMS label shown');
    ok(await stu.locator('.sms-msg').textContent() === MSG, 'exact message shown');
    const a = stu.locator('.sms-box a');
    ok(await a.getAttribute('target') === '_blank' && /noopener/.test(await a.getAttribute('rel')), 'link opens new tab with noopener');
    await stu.getByRole('button', { name: '이 내용으로 전송' }).dblclick();
    await page.waitForFunction(() => /전송 완료/.test(document.querySelector('.sms-box .status').textContent));
    ok(mock.sends.length === 1, 'double-click sends exactly once');
    ok(await stu.getByRole('button', { name: '이 내용으로 전송' }).isDisabled(), 'send disabled after success');
    ok(mock.badKey !== true, 'public apikey header sent');

    console.log('layout');
    await noOverflow(page, 'desktop 1280');
    await page.setViewportSize({ width: 390, height: 844 });
    await noOverflow(page, 'mobile 390');
    const small = await page.evaluate(() => [...document.querySelectorAll('.nm-admin .btn, .nm-admin select, .nm-admin input[type=text],.nm-admin input[type=email]')]
      .filter((e) => e.offsetParent && e.getBoundingClientRect().height < 43).length);
    ok(small === 0, 'visible controls are >= 44px tall on mobile');
    ok(await page.evaluate(() => getComputedStyle(document.body).wordBreak === 'keep-all'), 'Korean keep-all');
    await page.setViewportSize({ width: 1280, height: 900 });

    console.log('logout');
    await page.click('#logout-btn');
    await page.waitForSelector('#login-view:not([hidden])');
    ok(await page.evaluate(() => sessionStorage.length === 0 && localStorage.length === 0), 'logout clears token');
    ok(await page.isHidden('#admin-view') && await page.locator('#members .member').count() === 0, 'admin data removed from DOM');
    await page.waitForFunction(() => true); await new Promise((r) => setTimeout(r, 200));
    ok(mock.logouts === 1, 'admin_logout sent');

    ok(dialogs.length === 0, 'no script dialogs triggered');
    ok(errors.length === 0, 'no page errors' + (errors.length ? ': ' + errors.join('|') : ''));
    ok(blocked.length === 0, 'no external requests attempted' + (blocked.length ? ': ' + blocked.join(',') : ''));
  } catch (e) {
    failures++; console.error('  FAIL unexpected error:', e && e.message);
  } finally {
    await browser.close(); server.close();
  }
  if (failures) { console.error('\nadmin browser check: ' + failures + ' failure(s)'); process.exit(1); }
  console.log('\nadmin browser check: all passed');
})();
