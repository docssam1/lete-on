/* Caller-boundary QA only. All auth/data/network responses are synthetic.
 * Executes actual diagnosis/viewer HTML inline code with a spy generation provider.
 * Does NOT assert server authorization or the underlying generator's correctness. */
'use strict';
const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const assert = require('assert/strict');
const crypto = require('crypto');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '../..');
const out = path.join(root, 'hyper-focus/output/qa/hyperfocus-type-boundary');
const sources = Object.fromEntries(['diagnosis.html', 'mock/viewer.html', 'mock/access-policy.js', 'mock/secure-practice-loader.js'].map(p => [p, fs.readFileSync(path.join(root, 'hyper-focus', p), 'utf8')]));
const sha = s => crypto.createHash('sha256').update(s).digest('hex');
const results = [];
let browser;
async function test(name, run) {
  // The protected viewer no longer executes the client-side spy generator used below.
  // Retain the original regression cases as history, not as false passes. The new
  // transport/expiry/render tests live in validate_hyperfocus_remote_practice.cjs.
  if (!name.startsWith('diagnosis-') && sources['mock/viewer.html'].includes('secure-practice-loader.js')) {
    results.push({ name, status: 'superseded', evidence: 'Protected practice viewer: run validate_hyperfocus_remote_practice.cjs separately.' });
    return;
  }
  try { const evidence = await run(); results.push({ name, status: 'passed', evidence }); }
  catch (error) { results.push({ name, status: 'failed', error: error.stack }); }
}
async function pageFor(options = {}) {
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const intercepted = [];
  await context.route('**/*', async route => {
    const request = route.request(), url = new URL(request.url());
    intercepted.push({ method: request.method(), pathname: url.pathname, origin: url.origin });
    const relative = url.pathname.replace(/^\/hyper-focus\//, '');
    if (url.origin === 'http://hf-boundary.test' && sources[relative]) {
      let body = sources[relative];
      // In-memory negative control only: no source file is modified.
      if (options.removePostPrepareGuard && relative === 'mock/viewer.html') {
        const guarded = /(await HFMock\.preparePractice\(typeIds\);else if\(!remoteMode\)await HFMock\.prepareExam\(examId\);\s*)if\(!guardPractice\(\)\)return;/;
        assert.match(body, guarded); body = body.replace(guarded, '$1');
      }
      return route.fulfill({ status: 200, contentType: relative.endsWith('.js') ? 'application/javascript' : 'text/html', body });
    }
    // Never send a request, including fonts, student assets, RPCs or script CDNs.
    return route.fulfill({ status: 200, contentType: request.resourceType() === 'script' ? 'application/javascript' : 'text/plain', body: '' });
  });
  await page.addInitScript(opts => {
    const state = window.__qa = {
      allowed: opts.allowed || [1], active: true, identity: { studentId: 'qa-student-a', name: '검수학생' },
      prepare: 0, create: 0, print: 0, allowCalls: [], ready: 0, preparedIds: [], createArgs: [], rpc: [], opened: [],
      remote: opts.remote !== false, pending: Boolean(opts.pending), release: null
    };
    window.GFIELD_CONFIG = {};
    window.GFIELD_HF_DATA = { students: [], studentCode: {}, studentType: {}, access: {} };
    window.GFIELD_HF_SUPABASE_CONFIG = { features: { secureMockDelivery: false, securePracticeDelivery: false } };
    window.Chart = class { destroy() {} };
    window.alert = () => {};
    window.confirm = () => false;
    window.print = () => { state.print++; };
    window.open = url => { state.opened.push(String(url)); return null; };
    const member = { backend: state.remote ? 'supabase' : 'legacy', role: 'student', userId: state.identity.studentId, name: state.identity.name, permissions: ['hyperfocus'] };
    const client = {
      from: () => ({ select: () => ({ order: async () => ({ data: [], error: null }) }) }),
      rpc: async (name, args) => {
        state.rpc.push({ name, args });
        return { data: [{ rate: Math.round((54 - args.p_wrong_type_ids.length) / 54 * 100) }], error: null };
      }
    };
    window.GFieldHFPortalAuth = {
      ready: async () => opts.noSession ? null : member,
      isSupabaseEnabled: () => state.remote,
      canAccess: (m, permission) => Boolean(m && m.permissions.includes(permission)),
      client: async () => client
    };
    if (!opts.noTypeAccess) window.HFTypeAccess = {
      ready: async () => { state.ready++; if (opts.rejectReady) throw Error('synthetic access unavailable'); },
      watermarkIdentity: () => ({ ...state.identity }),
      allowType: (id, scope) => { state.allowCalls.push({ id, scope }); return state.active && state.allowed.includes(id); }
    };
    window.HFVariationBank = { READY_TYPE_IDS: [] };
    window.HFMockBlueprints = { reviewExamId: 'qa-only-exam' };
    window.HFMock = {
      safeStudent: value => String(value || '학생'), normalizeSeed: value => Number(value) || 1, makeSeed: () => 9917,
      preparePractice: async ids => {
        state.prepare++; state.preparedIds.push([...ids]);
        if (state.pending) await new Promise(resolve => { state.release = resolve; });
      },
      createPractice: (ids, opts) => {
        state.create++; state.createArgs.push({ ids: [...ids], ...opts });
        window.HFAccessPolicy.validatePracticeRequest(opts);
        return { title: '검수 전용 문제지', subtitle: '실제 학생 자료 아님', questions: ids.flatMap(id => Array.from({ length: opts.countPerType }, (_, i) => ({
          number: i + 1, typeCode: String(id), typeTitle: '가상 유형', difficultyLabel: opts.difficulty, prompt: '가상 문제',
          problemHtml: '<svg viewBox="0 0 100 50"><rect x="5" y="5" width="70" height="30"/></svg>', answerText: '검수 전용 답'
        }))) };
      }
    };
  }, options);
  const suffix = options.diagnosis ? 'diagnosis.html?section=similar' : `mock/viewer.html?mode=practice&types=${options.types || '1'}&count=${options.count || 2}&seed=17&student=위조이름`;
  await page.goto(`http://hf-boundary.test/hyper-focus/${suffix}`, { waitUntil: 'load' });
  await page.waitForFunction(() => Boolean(window.__qa));
  if (options.pending) await page.waitForFunction(() => Boolean(window.__qa.release));
  else if (!options.diagnosis) await page.waitForFunction(() => !document.querySelector('#pages')?.textContent.includes('문제지를 만드는 중입니다.'));
  else await page.waitForFunction(() => typeof worksheetAvailability === 'function' && document.querySelector('#view-area')?.dataset.built === '1');
  return { page, context, errors, intercepted, async close() { await context.close(); } };
}
async function withPage(options, run) { const fixture = await pageFor(options); try { return await run(fixture); } finally { await fixture.close(); } }
async function state(page) { return page.evaluate(() => ({ prepare: __qa.prepare, create: __qa.create, print: __qa.print, questions: document.querySelectorAll('.question').length, solutions: document.querySelectorAll('.solution').length, text: document.querySelector('#pages')?.textContent || '', url: location.href })); }
async function expire(page, event) { await page.evaluate(event => { __qa.active = false; if (event) dispatchEvent(new Event(event)); }, event); }
function block(source, start, end) { const a = source.indexOf(start), b = source.indexOf(end, a + start.length); assert.ok(a >= 0 && b > a, `Missing source anchors ${start}`); return source.slice(a, b).replace(/\r\n/g, '\n'); }

(async () => {
  browser = await chromium.launch({ headless: true });
  for (const [name, options] of [
    ['unauthorized-type-never-prepares-or-generates', { allowed: [1], types: '2' }],
    ['forged-mixed-type-url-blocks-whole-request', { allowed: [1], types: '1,2' }],
    ['missing-type-access-fails-closed', { noTypeAccess: true }],
    ['access-ready-rejection-without-grant-fails-closed', { allowed: [], rejectReady: true }],
    ['missing-session-fails-before-type-or-generator', { noSession: true }],
    ['invalid-type-url-fails-closed', { types: '999' }]
  ]) await test(name, () => withPage(options, async ({ page, errors }) => {
    const s = await state(page); assert.equal(s.prepare, 0); assert.equal(s.create, 0); assert.equal(s.questions, 0); assert.deepEqual(errors, []); return s;
  }));
  await test('allowed-one-type-two-problems-canonical-watermark', () => withPage({}, async ({ page, errors }) => {
    const s = await state(page); assert.equal(s.prepare, 1); assert.equal(s.create, 1); assert.equal(s.questions, 2);
    assert.match(s.text, /검수학생/); assert.doesNotMatch(s.text, /위조이름/); assert.ok(!new URL(s.url).searchParams.has('student'));
    await page.locator('#answerBtn').click(); assert.equal(await page.locator('.solutions.show').count(), 1);
    await page.evaluate(() => dispatchEvent(new Event('hf-type-access-change'))); assert.equal((await state(page)).questions, 2);
    assert.deepEqual(errors, []); return s;
  }));
  for (const event of ['beforeprint', 'hf-type-access-change']) await test(`expiry-${event}-clears-problems-and-answers`, () => withPage({}, async ({ page }) => {
    await expire(page, event); const s = await state(page); assert.equal(s.questions, 0); assert.equal(s.solutions, 0); assert.equal(s.create, 1); return s;
  }));
  for (const button of ['answerBtn', 'regenBtn', 'print']) await test(`expired-${button}-guard-without-change-event`, () => withPage({}, async ({ page }) => {
    const url = page.url(); await expire(page);
    await page.evaluate(button => (button === 'print' ? document.querySelector('.actions .gold') : document.getElementById(button)).click(), button);
    const s = await state(page); assert.equal(s.questions, 0); assert.equal(s.solutions, 0); assert.equal(s.print, 0); assert.equal(s.url, url); assert.equal(s.create, 1); return s;
  }));
  for (const field of ['studentId', 'name']) await test(`identity-${field}-change-with-same-grants-clears`, () => withPage({}, async ({ page }) => {
    await page.evaluate(field => { __qa.identity[field] = '다른검수계정'; dispatchEvent(new Event('hf-type-access-change')); }, field);
    const s = await state(page); assert.equal(s.questions, 0); assert.equal(s.solutions, 0); return s;
  }));
  for (const change of ['expiry', 'identity']) await test(`async-prepare-${change}-must-not-generate`, () => withPage({ pending: true }, async ({ page }) => {
    await page.evaluate(change => { if (change === 'expiry') __qa.active = false; else __qa.identity.studentId = 'qa-student-b'; dispatchEvent(new Event('hf-type-access-change')); __qa.release(); }, change);
    await page.waitForTimeout(60); const s = await state(page); assert.equal(s.create, 0, JSON.stringify(s)); assert.equal(s.questions, 0); return s;
  }));
  await test('negative-control-missing-post-prepare-guard-is-detected', () => withPage({ pending: true, removePostPrepareGuard: true }, async ({ page }) => {
    await page.evaluate(() => { __qa.active = false; dispatchEvent(new Event('hf-type-access-change')); __qa.release(); });
    await page.waitForTimeout(60); const s = await state(page);
    assert.equal(s.create, 1, 'Deliberately broken in-memory boundary must reproduce one forbidden generation.');
    assert.equal(s.questions, 0); return { forbiddenGenerationDetected: true, create: s.create, sourceFilesChanged: false };
  }));
  await test('legacy-existing-two-problems-remain-available', () => withPage({ remote: false, allowed: [] }, async ({ page, errors }) => {
    const s = await state(page); assert.equal(s.prepare, 1); assert.equal(s.create, 1); assert.equal(s.questions, 2);
    assert.equal(await page.evaluate(() => __qa.allowCalls.length), 0); assert.equal(await page.evaluate(() => HFAccessPolicy.FREE_PER_DIFFICULTY), 2);
    await page.locator('#answerBtn').click(); assert.equal(await page.locator('.solutions.show').count(), 1); assert.deepEqual(errors, []); return s;
  }));
  await test('diagnosis-denied-worksheet-preserves-selected-wrong-types-and-records', () => withPage({ diagnosis: true, allowed: [1] }, async ({ page, errors }) => {
    return page.evaluate(async () => {
      selectedSet.clear(); [1, 2, 54].forEach(id => selectedSet.add(id)); renderSimilarUI();
      const before = JSON.stringify(studentHistory); const url = location.href;
      await createSelectedWorksheet();
      const result = { ids: [...selectedSet], before, after: JSON.stringify(studentHistory), availability: [worksheetAvailability(1), worksheetAvailability(2)], status: document.getElementById('worksheet-build-status').textContent, urlUnchanged: url === location.href, rpc: __qa.rpc.length };
      if (JSON.stringify(result.ids) !== '[1,2,54]' || result.before !== result.after || !result.urlUnchanged || result.rpc) throw Error(JSON.stringify(result));
      if (!result.availability[0].same || Object.values(result.availability[1]).some(Boolean)) throw Error(JSON.stringify(result));
      return result;
    }).then(result => { assert.deepEqual(errors, []); return result; });
  }));
  await test('diagnosis-54-type-scoring-ignores-worksheet-grants', () => withPage({ diagnosis: true, allowed: [1] }, async ({ page, errors }) => {
    const result = await page.evaluate(async () => {
      selectedSet.clear(); [1, 2, 54].forEach(id => selectedSet.add(id));
      await submitNewAttempt();
      return { ids: [...selectedSet], record: studentHistory[0], rpc: __qa.rpc, typeCount: new Set(data.flatMap(c => c.items.map(i => i.id))).size };
    });
    assert.equal(result.typeCount, 54); assert.deepEqual(result.ids, [1, 2, 54]); assert.equal(result.record.rate, 94); assert.deepEqual(result.record.wrongIds, [1, 2, 54]);
    assert.equal(result.rpc.length, 1); assert.equal(result.rpc[0].name, 'hf_submit_diagnosis'); assert.deepEqual(result.rpc[0].args.p_wrong_type_ids, [1, 2, 54]); assert.deepEqual(errors, []); return result;
  }));
  await test('diagnosis-legacy-builder-preserves-two-question-request', () => withPage({ diagnosis: true, remote: false, allowed: [] }, async ({ page }) => {
    const result = await page.evaluate(async () => { selectedSet.add(2); renderSimilarUI(); await createSelectedWorksheet(); return { opened: __qa.opened, ids: [...selectedSet], allowCalls: __qa.allowCalls }; });
    assert.equal(result.opened.length, 1); const url = new URL(result.opened[0]); assert.equal(url.searchParams.get('count'), '2'); assert.equal(url.searchParams.get('types'), '2'); assert.equal(result.allowCalls.length, 0); return result;
  }));
  await test('diagnosis-approved-type-navigates-to-guarded-two-problem-viewer', () => withPage({ diagnosis: true, allowed: [1] }, async ({ page, errors }) => {
    await page.evaluate(() => { selectedSet.add(1); renderSimilarUI(); });
    await Promise.all([page.waitForURL('**/mock/viewer.html?**'), page.evaluate(() => createSelectedWorksheet())]);
    if (sources['mock/viewer.html'].includes('secure-practice-loader.js')) {
      await page.waitForFunction(() => Boolean(window.HFPracticeBootstrap));
      await page.evaluate(() => HFPracticeBootstrap.ready);
      const s = await state(page);
      assert.equal(new URL(s.url).searchParams.get('types'), '1'); assert.equal(new URL(s.url).searchParams.get('count'), '2');
      assert.equal(s.prepare, 0); assert.equal(s.create, 0); assert.equal(s.questions, 0);
      assert.match(s.text, /비공개 서버 전달 검수 중/); assert.deepEqual(errors, []);
      return { ...s, note: 'Diagnosis request preserved; readiness-off protected viewer cannot generate a local fallback.' };
    }
    await page.waitForFunction(() => document.querySelectorAll('.question').length === 2);
    const s = await state(page); assert.equal(new URL(s.url).searchParams.get('types'), '1'); assert.equal(new URL(s.url).searchParams.get('count'), '2');
    assert.equal(s.prepare, 1); assert.equal(s.create, 1); assert.deepEqual(errors, []); return s;
  }));
  await test('diagnosis-selection-scoring-and-record-code-byte-preserved', async () => {
    const baseline = cp.execFileSync('git', ['-c', `safe.directory=${root.replace(/\\/g, '/')}`, 'show', 'HEAD:hyper-focus/diagnosis.html'], { cwd: root, encoding: 'utf8', maxBuffer: 2 * 1024 * 1024 });
    const sections = [
      ['catalog-and-selectedSet', 'const data=', 'const HF_MEMBERS='],
      ['selection', 'function toggleItem(', 'function showLoginFromPreview('],
      ['record-and-score', 'function loadAttempt(', 'function setView('],
      ['result-and-diagnosis', 'function renderResultUI(', '</script>']
    ];
    return sections.map(([name, start, end]) => { const old = block(baseline, start, end), current = block(sources['diagnosis.html'], start, end); assert.equal(current, old, name); return { name, sha256: sha(current) }; });
  });
  await browser.close();
  const report = { generatedAt: new Date().toISOString(), scope: 'Actual diagnosis caller HTML; synthetic auth/type grants, intercepted network only. Legacy viewer cases are superseded when the protected loader exists; its separate QA is required. No backend enforcement claim.', sources: Object.fromEntries(Object.entries(sources).map(([name, body]) => [name, sha(body)])), passed: results.filter(r => r.status === 'passed').length, failed: results.filter(r => r.status === 'failed').length, superseded: results.filter(r => r.status === 'superseded').length, results };
  fs.mkdirSync(out, { recursive: true }); fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2)); if (report.failed) process.exitCode = 1;
})().catch(async error => { if (browser) await browser.close(); console.error(error); process.exitCode = 1; });
