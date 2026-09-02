#!/usr/bin/env node
/* 개념 애니메이션 화면 촬영 — PC(1280) · 모바일(430) · A4 인쇄
   개념애니-설계.md §6-2 "PC·모바일·A4 셋 다".
   실행: node number_magic/scripts/shot-concept-scenes.cjs [출력디렉터리]
   내부 도구다(저장소에 그림은 남기지 않는다). */
'use strict';
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const OUT = process.argv[2] || '/tmp/nm-shots';
fs.mkdirSync(OUT, { recursive: true });

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.mp4': 'video/mp4',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.mp3': 'audio/mpeg' };

function serve(){
  return new Promise(res => {
    const s = http.createServer((req, rep) => {
      const u = decodeURIComponent(req.url.split('?')[0]);
      const f = path.join(ROOT, u);
      if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rep.writeHead(404); rep.end(); return; }
      rep.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(rep);
    });
    s.listen(0, '127.0.0.1', () => res(s));
  });
}

const SCENES = [
  { unit: 'A-05', name: 'a05-group' },
  { unit: 'C-06', name: 'c06-placeshift' },
  { unit: 'M-11', name: 'm11-notation' }
];

(async () => {
  const server = await serve();
  const base = 'http://127.0.0.1:' + server.address().port + '/number_magic/index.html?enter=1';
  const browser = await chromium.launch();
  const errors = [];

  async function open(page, unit){
    await page.addInitScript(u => {
      localStorage.setItem('nm_state_v1', JSON.stringify({
        lang: 'ko', view: 'unit', unit: u, step: 'discover', sub: {}, coins: 0,
        onboarded: true, name: '테스트', progress: {},
        character: { number: 3, color: 'blue', bg: 'plain', cape: 'none' }
      }));
      localStorage.setItem('nm_trial_ok', '1');
    }, unit);
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.waitForSelector('.cs-svg', { timeout: 15000 });
    await page.waitForTimeout(400);
  }

  for (const sc of SCENES) {
    for (const [tag, w, h] of [['pc', 1280, 900], ['mobile', 430, 900]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
      const page = await ctx.newPage();
      /* 외부 CDN(폰트)은 이 검사 환경의 프록시가 막는다 — 앱 결함이 아니라 환경이다. */
      const envNoise = t => /ERR_TUNNEL_CONNECTION_FAILED|ERR_NAME_NOT_RESOLVED|cdn\.jsdelivr/.test(t);
      page.on('console', m => { if (m.type() === 'error' && !envNoise(m.text())) errors.push(sc.unit + '/' + tag + ': ' + m.text()); });
      page.on('pageerror', e => errors.push(sc.unit + '/' + tag + ' pageerror: ' + e.message));
      await open(page, sc.unit);

      /* 첫 beat */
      await page.locator('.cs-wrap').first().screenshot({ path: path.join(OUT, sc.name + '-' + tag + '-beat1.png') });
      /* 각 beat를 하나씩 넘기며 — 시선 판단용 */
      const beats = await page.locator('.cs-wrap').first().locator('.cs-dot').count();
      for (let i = 1; i < beats; i++) {
        await page.locator('.cs-wrap').first().locator('[data-a="next"]').click();
        await page.waitForTimeout(450);
        await page.locator('.cs-wrap').first().screenshot({ path: path.join(OUT, sc.name + '-' + tag + '-beat' + (i + 1) + '.png') });
      }
      /* 유닛 화면 전체(문맥: mathSteps가 그대로 남아 있는지) */
      await page.screenshot({ path: path.join(OUT, sc.name + '-' + tag + '-full.png'), fullPage: tag === 'pc' });
      /* 가로 스크롤이 생기지 않았는지 */
      const ovf = await page.evaluate(() => {
        const el = document.scrollingElement;
        return { sw: el.scrollWidth, cw: el.clientWidth };
      });
      if (ovf.sw > ovf.cw + 1) errors.push(sc.unit + '/' + tag + ': 가로 넘침 ' + ovf.sw + '>' + ovf.cw);
      await ctx.close();
    }

    /* A4 인쇄 — 애니메이션이 없는 매체다. 마지막 상태 한 장이 설명이 되어야 한다. */
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 1000 } });
    const page = await ctx.newPage();
    page.on('pageerror', e => errors.push(sc.unit + '/print pageerror: ' + e.message));
    await open(page, sc.unit);
    await page.emulateMedia({ media: 'print' });
    await page.waitForTimeout(700);
    /* 인쇄 매체에서 모든 객체가 보이는가 (첫 beat 상태로 두고 확인) */
    const printState = await page.evaluate(() => {
      const g = Array.from(document.querySelectorAll('.cs-obj'));
      const hidden = g.filter(x => Number(getComputedStyle(x).opacity) < 0.99).length;
      const ctl = document.querySelector('.cs-ctl');
      const scriptLines = document.querySelectorAll('.cs-transcript li').length;
      /* computed style만 보면 "보인다"고 나오는데 실제 종이는 백지일 수 있다 —
         앱 껍데기가 100dvh + overflow:hidden이라 잘려 나가기 때문이다. 실제로
         그 결함이 이 검사를 통과했었다. 그래서 **화면에 칠해지는 위치**를 본다:
         장면이 인쇄 지면 안에 들어와 있고 크기가 0이 아닌지. */
      const wrap = document.querySelector('.cs-wrap');
      const r = wrap ? wrap.getBoundingClientRect() : null;
      const de = document.documentElement;
      return { total: g.length, hidden: hidden, ctlShown: ctl ? getComputedStyle(ctl).display !== 'none' : null,
               scriptLines: scriptLines,
               rect: r ? { w: Math.round(r.width), h: Math.round(r.height), top: Math.round(r.top) } : null,
               docH: de.scrollHeight, clipped: getComputedStyle(de).overflow,
               flagged: de.classList.contains('nm-has-cscene') };
    });
    if (!printState.rect || printState.rect.w < 50 || printState.rect.h < 50)
      errors.push(sc.unit + '/print: 장면이 지면에 크기 없이 나온다 ' + JSON.stringify(printState.rect));
    if (!printState.flagged) errors.push(sc.unit + '/print: nm-has-cscene 표식이 안 붙었다(인쇄 잠금 미해제)');
    if (printState.docH < 200) errors.push(sc.unit + '/print: 문서 높이가 ' + printState.docH + ' — 백지로 나간다');
    if (printState.hidden !== 0) errors.push(sc.unit + '/print: 인쇄인데 안 보이는 객체 ' + printState.hidden + '/' + printState.total);
    if (printState.ctlShown) errors.push(sc.unit + '/print: 재생 컨트롤이 인쇄에 남았다');
    if (!printState.scriptLines) errors.push(sc.unit + '/print: 대본이 비었다');
    await page.pdf({ path: path.join(OUT, sc.name + '-a4.pdf'), format: 'A4', printBackground: true,
                     margin: { top: '12mm', bottom: '12mm', left: '10mm', right: '10mm' } });
    await page.screenshot({ path: path.join(OUT, sc.name + '-print.png'), fullPage: true });
    console.log(sc.unit + ' print: 객체 ' + printState.total + '개 전부 보임, 대본 ' + printState.scriptLines + '줄');
    await ctx.close();
  }

  /* 인쇄 잠금 해제가 학습지·시험 인쇄 경로로 새지 않는지 — 개념 장면이 없는
     화면에서는 표식이 붙으면 안 된다(붙으면 exam.js·print.html의 인쇄 CSS와 섞인다). */
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await page.addInitScript(() => {
      localStorage.setItem('nm_state_v1', JSON.stringify({
        lang: 'ko', view: 'exam', unit: null, step: null, sub: {}, coins: 0,
        onboarded: true, name: '테스트', progress: {},
        character: { number: 3, color: 'blue', bg: 'plain', cape: 'none' }
      }));
    });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.waitForTimeout(700);
    const leaked = await page.evaluate(() => ({
      flagged: document.documentElement.classList.contains('nm-has-cscene'),
      scenes: document.querySelectorAll('.cs-wrap').length
    }));
    if (leaked.flagged || leaked.scenes)
      errors.push('학습지 화면에 개념 장면 표식이 샜다: ' + JSON.stringify(leaked));
    else console.log('학습지 화면: 표식 없음 (인쇄 경로 무간섭)');
    await ctx.close();
  }

  await browser.close();
  server.close();
  if (errors.length) { console.log('\n결함 ' + errors.length + '건:'); errors.forEach(e => console.log('  ✗ ' + e)); process.exit(1); }
  console.log('\n콘솔·페이지 에러 0건 · 가로 넘침 없음 · 인쇄 상태 정상. 그림: ' + OUT);
})();
