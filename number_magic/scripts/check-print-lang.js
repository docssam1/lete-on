#!/usr/bin/env node
/* ============================================================
   학습지 인쇄 — 언어별 회귀 검사기 (ko · en · zh 전수)
   ============================================================
   2026-08-30. 인쇄 모듈이 한국어 한 벌만 찍던 것을 세 언어로 고치며 함께 넣었다.

   왜 따로 두는가 — check-print.js는 언어를 건드리지 않는다. 그래서 그 검사기가
   통과한다는 말은 "한국어 학습지가 멀쩡하다"까지만 보장한다. 인쇄가 세 언어를
   찍기 시작한 뒤로는, 중국어로 뽑으면 한국어가 나오거나 본문이 통째로 비어도
   그 검사기는 여전히 통과한다. 그 구멍을 이 파일이 막는다.

     [FAIL] 빈 카드 — 그 언어에서 문항 본문이 비었다
     [FAIL] 언어 오염 — 영어/중국어 학습지에 한글이 섞였다(픽이 ko로 떨어졌다는 뜻)
     [FAIL] 중국어인데 중국어가 없다 — 로마자·숫자만 남았다
     [FAIL] 문장제(WP)가 본문·물음·보기를 못 그렸다
     [FAIL] 칸 넘침 — 언어마다 줄바꿈 규칙이 달라 여기서 갈린다
     [FAIL] 페이지 에러

   ⚠️ check-print.js와 달리 프린트 미디어를 흉내 낸다(emulateMedia). 인쇄 CSS는
   전부 @media print 안에 있고, 화면 미디어에서는 시트가 display:none이라 칸
   너비가 0으로 잡힌다 — 그 상태로 재면 칸 넘침은 영영 걸리지 않는다.

   언어는 앱이 쓰는 저장 키(nm_state_v1)로 넣는다. exam.js의 examLang()이
   S.lang → 이 키 → 한국어 순으로 떨어지고, drill.html엔 S가 없기 때문이다.

   쓰는 법:
     node scripts/check-print-lang.js              # 전체 × 3개 언어
     node scripts/check-print-lang.js WP1 NS2      # 지정 스레드만
   실패가 하나라도 있으면 exit 1.
   ============================================================ */
'use strict';

const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

const ROOT = path.resolve(__dirname, '..');
const PORT = process.env.NM_CHECK_PORT || 8793;
const ONLY = process.argv.slice(2).map(s => s.toUpperCase());
const LANGS = ['ko', 'en', 'zh'];

const HANGUL = /[가-힣ㄱ-ㅎㅏ-ㅣ]/;
const HAN    = /[㐀-䶿一-鿿]/;

function loadPlaywright(){
  for(const c of ['playwright', '/opt/node22/lib/node_modules/playwright']){
    try { return require(c); } catch(e){}
  }
  console.error('playwright를 찾지 못했습니다. `npm i -D playwright` 후 다시 실행하세요.');
  process.exit(2);
}

function serve(){
  return new Promise((resolve, reject) => {
    const py = spawn('python3', ['-m', 'http.server', String(PORT)], { cwd: ROOT, stdio: 'ignore' });
    py.on('error', reject);
    const t0 = Date.now();
    (function ping(){
      http.get(`http://localhost:${PORT}/drill.html`, res => { res.resume(); resolve(py); })
        .on('error', () => {
          if(Date.now() - t0 > 8000) return reject(new Error('정적 서버 기동 실패'));
          setTimeout(ping, 150);
        });
    })();
  });
}

(async () => {
  const { chromium } = loadPlaywright();
  const server = await serve();
  const browser = await chromium.launch({
    executablePath: process.env.NM_CHROMIUM || '/opt/pw-browsers/chromium'
  });

  const fails = [], warns = [];
  const counts = {};
  let pageErrors = [];

  for(const lang of LANGS){
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    page.on('pageerror', e => pageErrors.push(`[${lang}] ${e.message}`));
    await page.addInitScript(l => {
      window.print = () => {};
      /* 표지·개념장까지 켜고 본다 — 그쪽에도 하드코딩 한국어가 있었다 */
      try{
        localStorage.setItem('nm_state_v1', JSON.stringify({ lang: l }));
        localStorage.setItem('nm_ws_concept_page', '1');
        localStorage.setItem('nm_ws_cover', '1');
      }catch(e){}
    }, lang);
    await page.goto(`http://localhost:${PORT}/drill.html`, { waitUntil: 'networkidle' });
    /* 인쇄 CSS를 실제로 적용시킨다 — 이게 없으면 칸 너비가 0이라 넘침을 못 잰다 */
    await page.emulateMedia({ media: 'print' });

    const targets = await page.evaluate(only => {
      const out = [];
      const TH = window.NM_THREADS || {};
      for(const id of Object.keys(TH)){
        if(only.length && !only.includes(id)) continue;
        for(const lv of (TH[id].levels || [])) out.push({ id, lv: lv.id, name: (TH[id].name||{}).ko || id });
      }
      return out;
    }, ONLY);

    if(!targets.length){
      console.error('검사 대상이 없습니다.' + (ONLY.length ? ` (${ONLY.join(', ')})` : ''));
      await browser.close(); server.kill(); process.exit(2);
    }

    let done = 0, wpLevels = 0;
    for(const t of targets){
      const r = await page.evaluate(async ({ id, lv }) => {
        const COUNT = 12;
        const res = { err:null, cards:0, keys:0, empty:[], overflow:0, prose:'', wp:null };
        document.querySelectorAll('.nm-print-sheet').forEach(e => e.remove());
        try { NM_EXAM.renderPrint({ thread:id, level:lv, count:COUNT, seed:'lang1' }); }
        catch(e){ res.err = 'throw: ' + e.message; return res; }
        await new Promise(r => setTimeout(r, 30));

        const sheet = document.querySelector('.nm-print-sheet');
        if(!sheet){ res.err = '인쇄 시트 없음'; return res; }
        res.lang = sheet.getAttribute('lang');

        const cards = [...sheet.querySelectorAll('.nm-print-item')];
        res.cards = cards.length;
        res.keys  = sheet.querySelectorAll('.nm-ak-item').length;

        /* 글로 된 부분만 모은다 — 수식(.nm-q-tex)은 어느 언어에서나 같아서
           언어 판정의 근거가 못 된다. 머리글·정답지 제목·QR 캡션·표지·개념장,
           그리고 카드의 질문 줄·문장제 본문·물음·보기가 판정 대상이다. */
        const proseSel = '.nm-print-header h2, .nm-print-answer-key h3, .nm-print-qr-cap,'
          + ' .nm-print-cover, .nm-print-concept-page, .nm-print-ask, .nm-print-word,'
          + ' .nm-print-wordask, .nm-print-choices, .nm-print-word-blank';
        res.prose = [...sheet.querySelectorAll(proseSel)].map(e => e.textContent).join(' ');

        cards.forEach((c, i) => {
          if(!c.textContent.replace(/\s+/g,'').length) res.empty.push(i+1);
          if(c.scrollWidth > c.clientWidth + 2) res.overflow++;
        });

        /* 문장제 — 본문·물음이 있어야 인쇄물만 보고 풀 수 있다(WP 스레드의 계약) */
        const words = [...sheet.querySelectorAll('.nm-print-word')];
        if(words.length){
          res.wp = { n: words.length, noBody: 0, noAsk: 0, fewChoices: 0, sample: '' };
          words.forEach(w => {
            const card = w.closest('.nm-print-item');
            if(!w.textContent.trim()) res.wp.noBody++;
            const ask = card.querySelector('.nm-print-wordask');
            if(!ask || !ask.textContent.trim()) res.wp.noAsk++;
            const li = card.querySelectorAll('.nm-print-choices li');
            if(li.length === 1) res.wp.fewChoices++;
            if(!res.wp.sample) res.wp.sample = w.textContent.trim().slice(0, 60);
          });
        }
        return res;
      }, { id: t.id, lv: t.lv });

      const tag = `[${lang}] ${t.id}L${t.lv} ${t.name}`;
      if(r.err){ fails.push(`${tag} — 인쇄 실패: ${r.err}`); }
      else {
        if(r.cards !== 12) fails.push(`${tag} — 인쇄 문항 ${r.cards}/12`);
        if(r.keys !== 12)  fails.push(`${tag} — 정답 ${r.keys}/12`);
        if(r.empty.length) fails.push(`${tag} — 빈 카드 ${r.empty.length}개 (${r.empty.slice(0,4).join(',')}번)`);
        if(r.overflow)     fails.push(`${tag} — 칸 넘침 ${r.overflow}건`);
        if(r.lang !== lang) fails.push(`${tag} — 시트 lang이 "${r.lang}"`);

        const prose = String(r.prose || '');
        if(!prose.replace(/\s+/g,'').length) fails.push(`${tag} — 글로 된 부분이 통째로 빔`);
        if(lang === 'ko' && !HANGUL.test(prose)) fails.push(`${tag} — 한국어 학습지에 한글이 없음`);
        if(lang !== 'ko' && HANGUL.test(prose))
          fails.push(`${tag} — 한글이 섞임: ${(prose.match(/[가-힣][^\s]*(\s[가-힣][^\s]*)?/)||[''])[0]}`);
        if(lang === 'zh' && !HAN.test(prose)) fails.push(`${tag} — 중국어 학습지에 한자가 없음`);

        if(r.wp){
          wpLevels++;
          if(r.wp.noBody) fails.push(`${tag} — 문장제 본문이 빔 ${r.wp.noBody}/${r.wp.n}`);
          if(r.wp.noAsk)  fails.push(`${tag} — 문장제 물음이 빔 ${r.wp.noAsk}/${r.wp.n}`);
          if(r.wp.fewChoices) fails.push(`${tag} — 보기가 하나뿐인 문장제 ${r.wp.fewChoices}건`);
        }
      }
      counts[lang] = (counts[lang] || 0) + 1;
      if(++done % 120 === 0) process.stdout.write(`  [${lang}] … ${done}/${targets.length}\n`);
    }
    console.log(`  [${lang}] ${done}개 유형·레벨 · 문장제 인쇄 ${wpLevels}개`);
    await page.close();
  }

  await browser.close();
  server.kill();

  console.log('\n언어별 검사한 유형·레벨: ' + LANGS.map(l => `${l} ${counts[l]||0}`).join(' · '));
  if(pageErrors.length){
    console.log(`\n[FAIL] 페이지 에러 ${pageErrors.length}건`);
    [...new Set(pageErrors)].slice(0, 5).forEach(e => console.log('   ' + e));
  }
  if(warns.length){
    console.log(`\n[WARN] ${warns.length}건`);
    warns.forEach(w => console.log('   ' + w));
  }
  if(fails.length){
    console.log(`\n[FAIL] ${fails.length}건`);
    fails.slice(0, 40).forEach(f => console.log('   ' + f));
    if(fails.length > 40) console.log(`   … 외 ${fails.length - 40}건`);
    process.exit(1);
  }
  console.log('\n통과 — 세 언어 모두 제 언어로, 칸 안에 인쇄된다.');
  if(pageErrors.length) process.exit(1);
})().catch(e => { console.error(e); process.exit(2); });
