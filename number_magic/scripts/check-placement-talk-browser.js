#!/usr/bin/env node
/* 한 질문씩 고르기 검사기 — 2026-11-18 (원장 「박스로 길게 말고 대화형으로 하나씩 보여 주고 선택하도록」)
   ① 시작 고르기(main.js screenStartChoice): 진단 / 하던 교재 → 교재 → 끝낸 권 → 「과정 N · M회차부터」 → 시작
   ② 진단 기준 고르기(placement-ui.js talk): 나이 → 어디까지(배운 범위·끝낸 교재·아직 안 배움) → … → 「화면에서 풀기」로 1번 문제
   ③ 「바꾸기」로 그 질문부터 다시, 「한 화면에서 모두 고르기」 ↔ 「하나씩 물어보며 고르기」(기기에 기억)
   ④ 휴대폰·PC에서 가로 넘침 없음, 페이지 오류 없음, 화면에 「어디부터 시작할까요」 같은 말 없음
   화면 사진: NM_TALK_ARTIFACTS 폴더(없으면 찍지 않음). 실패하면 exit 1. */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http'), assert = require('node:assert/strict');
const { chromium } = require('./lib/playwright');
const ROOT = path.resolve(__dirname, '../..'), OUT = process.env.NM_TALK_ARTIFACTS || '';
const MIME = { '.js': 'application/javascript', '.css': 'text/css', '.html': 'text/html', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.ttf': 'font/ttf' };
const server = http.createServer((req, res) => {
  const f = path.resolve(ROOT, '.' + decodeURIComponent(req.url.split('?')[0]));
  if(!f.startsWith(ROOT + path.sep) || !fs.existsSync(f) || !fs.statSync(f).isFile()){ res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type', MIME[path.extname(f)] || 'application/octet-stream'); res.end(fs.readFileSync(f));
});
const shot = async (p, name) => { if(OUT){ fs.mkdirSync(OUT, { recursive: true }); await p.screenshot({ path: path.join(OUT, name + '.png') }); } };
const noOverflow = p => p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
async function enter(b, base, lang, width){
  const ctx = await b.newContext({ viewport: { width, height: 844 }, reducedMotion: 'reduce' });
  await ctx.route('**/*', r => r.request().url().startsWith('http://127.0.0.1') ? r.continue() : r.abort());
  const p = await ctx.newPage(), errors = [];
  p.on('pageerror', e => errors.push(e.message));
  await p.goto(base + 'access.html?lang=' + lang);
  await p.click('#open-book'); await p.click('#preview-link'); await p.waitForURL(/index\.html/);
  await p.waitForSelector('#obAvNext', { timeout: 20000 });
  await p.locator('[data-av]').first().click(); await p.click('#obAvNext');
  await p.waitForSelector('[data-level]'); await p.click('[data-level="a7"]'); await p.click('#obGrNext');
  await p.waitForSelector('#obName'); await p.fill('#obName', '하늘'); await p.click('#obGo');
  await p.waitForSelector('.nm-sc-card1', { timeout: 15000 });
  return { ctx, p, errors };
}
const pick = (p, key, val) => p.click(`[data-pick="${key}"][data-val="${val}"]`);
(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const base = 'http://127.0.0.1:' + server.address().port + '/number_magic/';
  const b = await chromium.launch({ args: ['--disable-webgl', '--disable-webgl2'] });
  const out = [];
  for(const [lang, width] of [['ko', 390], ['ko', 1280], ['en', 390]]){
    const tag = lang + '-' + width;
    /* ① 시작 고르기 — 교재 길 */
    let { ctx, p, errors } = await enter(b, base, lang, width);
    assert.equal(await p.locator('.nm-sc-picks button').count(), 2, tag + ' 첫 질문 단추 둘');
    /* 글꼴: 저장소의 Pretendard 가변 글꼴이 실제로 그려지는지(CDN·기기 글꼴로 빠지지 않게) */
    assert.ok(await p.evaluate(async () => { await document.fonts.ready; return [...document.fonts].some(f => f.family.replace(/["']/g, '') === 'Pretendard' && f.status === 'loaded'); }), tag + ' Pretendard 글꼴 불러옴');
    await shot(p, 'start-1-' + tag);
    await pick(p, 'way', 'book'); await p.waitForSelector('[data-pick="book"]');
    await pick(p, 'book', 'kumon'); await p.waitForSelector('[data-pick="step"]', { timeout: 10000 });
    await pick(p, 'step', 'kumon-2a-111'); await p.waitForSelector('#scBookGo');
    const startText = (await p.textContent('.nm-sc-place')).replace(/\s+/g, ' ');
    assert.match(startText, lang === 'ko' ? /과정 1.*2회차부터/ : /Course 1.*lesson 2/, tag + ' 시작 과정·회차: ' + startText);
    assert.equal(await p.locator('.nm-sc-card1').count(), 1, tag + ' 창 하나에 한 질문');
    assert.ok(await noOverflow(p), tag + ' 시작 고르기 넘침');
    await shot(p, 'start-2-' + tag);
    await p.click('.nm-sc-back'); await p.waitForSelector('[data-pick="step"]'); await p.click('.nm-sc-back'); await p.waitForSelector('[data-pick="book"]');
    assert.equal(await p.locator('#scBookGo').count(), 0, tag + ' 바꾸기 → 교재부터 다시');
    await pick(p, 'book', 'miracle'); await p.waitForSelector('[data-pick="step"]', { timeout: 10000 });
    await p.locator('[data-pick="step"]').nth(6).click(); await p.waitForSelector('#scBookGo');
    await p.click('#scBookGo'); await p.waitForTimeout(800);
    assert.ok(await p.evaluate(() => !document.querySelector('.nm-sc-card1')), tag + ' 시작 후 과정 길로');
    assert.deepEqual(errors, [], tag + ' 오류(시작 고르기)');
    await ctx.close();

    /* ② 진단 — 배운 범위 길 */
    ({ ctx, p, errors } = await enter(b, base, lang, width));
    await pick(p, 'way', 'diag');
    await p.waitForSelector('.pd-ask', { timeout: 15000 });
    const body = await p.evaluate(() => document.querySelector('#screen').innerText);
    assert.ok(!/어디부터 시작|어디서부터 시작|Where shall we/.test(body), tag + ' 상투 문구 없음');
    if(await p.locator('[data-pick="level"]').count()) await pick(p, 'level', 'a7');
    await p.waitForSelector('[data-pick="route"]'); await shot(p, 'diag-1-' + tag);
    await pick(p, 'route', 'age'); await p.waitForSelector('[data-pick="band"]');
    await pick(p, 'band', 'elementary'); await p.waitForSelector('[data-pick="stage"]');
    await shot(p, 'diag-2-' + tag);
    await p.locator('[data-pick="stage"]').nth(3).click(); await p.waitForSelector('#pdStart:not([disabled])');
    assert.ok(await p.locator('#pdPaper').count() === 1, tag + ' 종이로 풀기');
    assert.ok(await noOverflow(p), tag + ' 진단 대화 넘침');
    await shot(p, 'diag-3-' + tag);
    /* 바꾸기 → 범위 다시 */
    await p.click('.pd-ask-back'); await p.waitForSelector('[data-pick="stage"]'); await p.click('.pd-ask-back'); await p.waitForSelector('[data-pick="band"]');
    assert.equal(await p.locator('#pdStart').count(), 0, tag + ' 바꾸기 → 시작 단추 사라짐');
    await pick(p, 'band', 'elementary'); await p.locator('[data-pick="stage"]').nth(2).click();
    /* 한 화면 양식 ↔ 대화형 */
    await p.click('#pdFormMode'); await p.waitForSelector('#pdLevel');
    assert.equal(await p.evaluate(() => localStorage.getItem('nm_pd_form')), '1', tag + ' 양식 기억');
    await p.click('.pd-form-mode'); await p.waitForSelector('.pd-ask');
    assert.equal(await p.evaluate(() => localStorage.getItem('nm_pd_form')), '0', tag + ' 대화형 기억');
    await p.click('#pdStart'); await p.waitForSelector('.pd-question', { timeout: 15000 });
    assert.deepEqual(errors, [], tag + ' 오류(진단 배운 범위)');
    await ctx.close();

    /* ③ 진단 — 끝낸 교재 길 · 아직 안 배움 길 */
    ({ ctx, p, errors } = await enter(b, base, lang, width));
    await pick(p, 'way', 'diag'); await p.waitForSelector('.pd-ask', { timeout: 15000 });
    if(await p.locator('[data-pick="level"]').count()) await pick(p, 'level', 'a7');
    await pick(p, 'route', 'book'); await p.waitForSelector('[data-pick="series:0"]');
    const series = await p.locator('[data-pick="series:0"]').first().getAttribute('data-val');
    await pick(p, 'series:0', series); await p.waitForSelector('[data-pick="step:0"]');
    await p.locator('[data-pick="step:0"]').nth(1).click(); await p.waitForSelector('[data-pick="more"]');
    await pick(p, 'more', 'no'); await p.waitForSelector('#pdStart:not([disabled])', { timeout: 10000 });
    await shot(p, 'diag-book-' + tag);
    for(let i = 0; i < 6 && !(await p.locator('[data-pick="route"]').count()); i++){ await p.click('.pd-ask-back'); await p.waitForTimeout(80); }
    await p.waitForSelector('[data-pick="route"]');
    await pick(p, 'route', 'unlearned'); await p.waitForSelector('#pdStart:not([disabled])', { timeout: 10000 });
    await p.click('#pdStart'); await p.waitForSelector('.pd-question', { timeout: 15000 });
    assert.deepEqual(errors, [], tag + ' 오류(진단 교재·안 배움)');
    await ctx.close();
    out.push(tag);
  }
  await b.close(); server.close();
  console.log('PLACEMENT_TALK_BROWSER_OK ' + out.join(' '));
})().catch(e => { console.error(e); process.exit(1); });
