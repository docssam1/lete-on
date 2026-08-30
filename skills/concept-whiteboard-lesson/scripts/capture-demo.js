#!/usr/bin/env node
/* ============================================================
   README용 데모 캡처 — 전후 정지화면 + 짧은 시연 영상
   ============================================================
   왜 스크립트로 두는가: 스킬의 예시는 "실제 화면"이어야 값이 있다.
   손으로 찍으면 유닛이 바뀔 때마다 옛 화면이 README에 남고, 그건
   이 스킬이 잡으려는 결함(화면과 설명이 어긋남)을 스킬 자신이
   저지르는 꼴이 된다. 그래서 다시 돌릴 수 있게 만든다.

   쓰는 법:
     node scripts/capture-demo.js before          # 지금 상태(정지화면)
     node scripts/capture-demo.js after A-05      # 애니메이션 적용 후
     node scripts/capture-demo.js video A-05      # 시연 영상(webm→mp4)

   결과물은 assets/ 아래. README가 그 경로를 그대로 가리킨다.
   ============================================================ */
'use strict';

const { spawn, execFileSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '../../..');      /* lete-on */
const APP  = path.join(REPO, 'number_magic');
const OUT  = path.resolve(__dirname, '../assets');
const PORT = process.env.DEMO_PORT || 8841;

/* ⚠ 저장소 루트를 서빙한다. number_magic/을 루트로 서빙하면 index.html의
   `../geometry/worksheet/render.js`가 루트 밖으로 나가 404가 되고, 404는
   pageerror를 내지 않으므로 GW_RENDER가 undefined인 채 애니메이션만 조용히
   사라진다(실제로 그렇게 "적용 전과 똑같은 적용 후" 그림이 한 번 나왔다).
   운영 배포도 저장소 루트가 웹 루트다(.../number_magic/). */

const mode = process.argv[2] || 'before';
const unit = process.argv[3] || 'A-05';
/* after 모드에서 몇 번째 beat를 찍을지. beat 1은 문제만 놓인 상태라
   README 그림으로는 약하다 — 묶는 호가 그려진 뒤가 이 스킬의 요점이다. */
const beat = parseInt(process.argv[4] || '0', 10);

function loadPlaywright(){
  for(const c of ['playwright', '/opt/node22/lib/node_modules/playwright']){
    try { return require(c); } catch(e){}
  }
  console.error('playwright를 찾지 못했습니다.');
  process.exit(2);
}

function serve(){
  return new Promise((resolve, reject) => {
    const py = spawn('python3', ['-m', 'http.server', String(PORT)], { cwd: REPO, stdio: 'ignore' });
    const t0 = Date.now();
    (function ping(){
      http.get(`http://localhost:${PORT}/number_magic/index.html`, r => { r.resume(); resolve(py); })
        .on('error', () => {
          if(Date.now() - t0 > 8000) return reject(new Error('정적 서버 기동 실패'));
          setTimeout(ping, 150);
        });
    })();
  });
}

/* 온보딩을 지나 해당 유닛의 개념(마법 노트) 화면으로 직행한다.
   S는 IIFE 안이라 밖에서 못 만지므로, S가 읽고 쓰는 localStorage를 직접 세팅하고 새로고침한다. */
async function gotoConcept(page, uid){
  await page.goto(`http://localhost:${PORT}/number_magic/index.html?enter=1`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  if(await page.$('#obGo')){
    await page.fill('#obName', '예시');
    await page.click('#obGo');
    await page.waitForTimeout(900);
  }
  await page.evaluate(u => {
    const K = 'nm_state_v1';
    const s = JSON.parse(localStorage.getItem(K) || '{}');
    s.unit = u; s.step = 'discover'; s.sub = {}; s.view = 'unit'; s.tierId = null;
    localStorage.setItem(K, JSON.stringify(s));
  }, uid);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
}

/* 애니메이션은 기존 마법 노트 *아래에* 붙는다. 그대로 뷰포트를 찍으면
   화면 밖이라 "적용 전"과 똑같은 그림이 나온다 — 실제로 그렇게 한 번
   찍혔다. .cs-wrap으로 스크롤하고, 없으면 실패로 알린다(조용히 옛 화면을
   내보내는 것이 이 스크립트의 최악의 실패다). */
async function focusScene(page){
  const el = await page.$('.cs-wrap');
  if(!el){
    throw new Error('.cs-wrap 없음 — 이 유닛에 개념 애니메이션이 없거나 렌더 실패');
  }
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  return el;
}

(async () => {
  const { chromium } = loadPlaywright();
  fs.mkdirSync(OUT, { recursive: true });
  const server = await serve();
  const browser = await chromium.launch({ executablePath: process.env.DEMO_CHROMIUM || '/opt/pw-browsers/chromium' });

  try {
    if(mode === 'video'){
      /* 시연 영상 — 애니메이션이 있어야 의미가 있다. 정적 화면을 녹화하면
         "움직이지 않는 영상"이 남으므로, 실제로 beat가 도는지 먼저 확인할 것. */
      const ctx = await browser.newContext({
        viewport: { width: 1100, height: 760 },
        recordVideo: { dir: path.join(OUT, '_raw'), size: { width: 1100, height: 760 } }
      });
      const page = await ctx.newPage();
      await gotoConcept(page, unit);
      await focusScene(page);
      /* 재생을 눌러야 beat가 돈다. 안 누르면 정지 화면만 녹화된다. */
      const play = await page.$('.cs-play');
      if(!play) throw new Error('재생 버튼(.cs-play)을 찾지 못했습니다');
      await play.click();
      await page.waitForTimeout(11000);   /* beat가 도는 시간 — 실제 길이에 맞춰 조정 */
      await ctx.close();                 /* close 해야 webm이 flush 된다 */

      const raw = fs.readdirSync(path.join(OUT, '_raw')).filter(f => f.endsWith('.webm'))[0];
      const src = path.join(OUT, '_raw', raw);
      const dst = path.join(OUT, `demo-${unit.toLowerCase().replace(/-/g, '')}.mp4`);
      execFileSync('ffmpeg', ['-y', '-i', src, '-vf', 'scale=1100:-2', '-c:v', 'libx264',
                              '-pix_fmt', 'yuv420p', '-crf', '26', '-movflags', '+faststart', dst],
                   { stdio: 'ignore' });
      fs.rmSync(path.join(OUT, '_raw'), { recursive: true, force: true });
      console.log('저장:', dst);
    } else {
      const page = await browser.newPage({ viewport: { width: 1100, height: 820 }, deviceScaleFactor: 2 });
      const errs = [];
      page.on('pageerror', e => errs.push(e.message));
      await gotoConcept(page, unit);
      /* A-05 → a05. 하이픈을 남기면 README가 가리키는 이름과 어긋난다. */
      const slug = unit.toLowerCase().replace(/-/g, '');
      const name = mode === 'after'
        ? `after-${slug}-animated.png`
        : `before-${slug}-text-only.png`;
      if(mode === 'after'){
        const el = await focusScene(page);
        for(let i = 0; i < beat; i++){
          const next = await page.$('.cs-ctl button:last-of-type, .cs-next');
          if(!next) throw new Error('다음 beat 버튼을 찾지 못했습니다');
          await next.click();
          await page.waitForTimeout(900);
        }
        await el.screenshot({ path: path.join(OUT, name) });   /* 장면만 잘라 찍는다 */
      } else {
        await page.screenshot({ path: path.join(OUT, name) });
      }
      console.log('저장:', path.join(OUT, name));
      if(errs.length) console.log('⚠ pageerror', errs.length, '건:', errs[0]);
    }
  } finally {
    await browser.close();
    server.kill();
  }
})().catch(e => { console.error(e); process.exit(2); });
