#!/usr/bin/env node
/* ============================================================
   화면 풀이 가능성 검사기 — 424개 유형·레벨 전수
   ============================================================
   2026-08-28. 이날 찾은 가장 큰 결함은 "정답을 알아도 화면에 입력할 방법이
   없는" 문항이었다. 답이 여러 칸인 유형(분수 [분자,분모] 등 99개 레벨)은
   "8, 9"처럼 쉼표로 받는데 입력칸이 type=number라 쉼표를 칠 수가 없었고,
   소수 답(6개 레벨)은 parseInt에 잘려 6.8이 6이 됐다. 둘 다 채점을 통과할
   수 없는 상태였는데, 아무도 그 유형을 화면으로 끝까지 풀어 보지 않아서
   드러나지 않았다.

   그래서 이 검사기는 눈으로 보는 대신 **실제로 풀어 본다**: 유형·레벨마다
   문항 하나를 만들고, 엔진이 알려 준 정답을 그대로 입력칸에 쳐 넣고,
   제출해서 만점이 나오는지 본다. 만점이 아니면 그 유형은 학생도 못 맞힌다.

   쓰는 법:
     node scripts/check-answerable.js            # 전체
     node scripts/check-answerable.js MD3 DC4    # 지정 스레드만
   실패가 하나라도 있으면 exit 1.
   ============================================================ */
'use strict';

const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

const ROOT = path.resolve(__dirname, '..');
const PORT = process.env.NM_CHECK_PORT || 8792;
const ONLY = process.argv.slice(2).map(s => s.toUpperCase());

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
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const pageErrors = [];
  page.on('pageerror', e => pageErrors.push(e.message));
  await page.goto(`http://localhost:${PORT}/drill.html`, { waitUntil: 'networkidle' });

  const targets = await page.evaluate(only => {
    const out = [];
    const TH = window.NM_THREADS || {};
    for(const id of Object.keys(TH)){
      if(only.length && !only.includes(id)) continue;
      for(const lv of (TH[id].levels || [])){
        out.push({ id, lv: lv.id, name: (TH[id].name && TH[id].name.ko) || id,
                   lvLabel: (lv.label && lv.label.ko) || '' });
      }
    }
    return out;
  }, ONLY);

  if(!targets.length){
    console.error('검사 대상이 없습니다.' + (ONLY.length ? ` (${ONLY.join(', ')})` : ''));
    await browser.close(); server.kill(); process.exit(2);
  }

  /* 검사용 컨테이너 하나를 만들어 두고 계속 재사용한다 */
  await page.evaluate(() => {
    let c = document.getElementById('__chk__');
    if(!c){ c = document.createElement('div'); c.id = '__chk__'; document.body.appendChild(c); }
  });

  const fails = [];
  let done = 0;

  for(const t of targets){
    const r = await page.evaluate(async ({ id, lv }) => {
      const N = 3;                       /* 유형당 3문항이면 형식 문제는 다 드러난다 */
      const container = document.getElementById('__chk__');
      container.innerHTML = '';

      /* runExam은 config.seed를 안에서 다시 hashSeed로 돌린다 — 같은 문항을
         얻으려면 여기서도 똑같이 해시해야 한다(안 그러면 다른 문제와 비교하게 된다). */
      const SEED = 'chk20260828';
      let probs;
      try { probs = NM_EXAM.buildProblems(id, lv, N, NM_RNG.hashSeed(SEED)); }
      catch(e){ return { err: '생성 실패: ' + e.message }; }
      if(!probs || probs.length !== N) return { err: '문항 수 부족' };

      /* 엔진이 아는 정답을 사람이 치듯 문자열로 만든다 */
      const typed = probs.map(p => Array.isArray(p.answer)
        ? p.answer.join(', ')
        : String(p.answer));

      return await new Promise(resolve => {
        let settled = false;
        const timer = setTimeout(() => { if(!settled){ settled = true; resolve({ err: '시간 초과' }); } }, 4000);

        try {
          NM_EXAM.runExam({ thread: id, level: lv, count: N, timer: 0, seed: SEED },
            container,
            result => {
              if(settled) return;
              settled = true; clearTimeout(timer);
              resolve({ score: result.score, total: result.total,
                        typed, answers: result.answers.map(a => String(a)) });
            });
        } catch(e){
          if(!settled){ settled = true; clearTimeout(timer); resolve({ err: 'runExam 예외: ' + e.message }); }
          return;
        }

        /* 화면에 실제로 입력하고 제출한다 — 입력칸이 값을 못 받으면 여기서 드러난다 */
        (function step(i){
          if(settled) return;
          if(i >= N) return;
          const inp = container.querySelector('#nm-ex-ans');
          const btn = container.querySelector('#nm-ex-submit');
          if(!inp || !btn){
            settled = true; clearTimeout(timer);
            return resolve({ err: '입력칸/버튼 없음' });
          }
          inp.value = typed[i];
          inp.dispatchEvent(new Event('input', { bubbles: true }));
          /* 입력칸이 값을 그대로 담았는지 — type=number에 "8, 9"를 넣으면 ''이 된다 */
          if(inp.value !== typed[i]){
            settled = true; clearTimeout(timer);
            return resolve({ err: `입력칸이 답을 담지 못함(type=${inp.type}): "${typed[i]}" → "${inp.value}"` });
          }
          btn.click();
          setTimeout(() => step(i + 1), 0);
        })(0);
      });
    }, { id: t.id, lv: t.lv });

    const tag = `${t.id}L${t.lv} ${t.name}/${t.lvLabel}`;
    if(r.err) fails.push(`${tag} — ${r.err}`);
    else if(r.score !== r.total)
      fails.push(`${tag} — 정답을 그대로 넣었는데 ${r.score}/${r.total} (입력 "${r.typed[0]}" → 저장 "${r.answers[0]}")`);

    if(++done % 40 === 0) process.stdout.write(`  … ${done}/${targets.length}\n`);
  }

  await browser.close();
  server.kill();

  console.log(`\n검사한 유형·레벨: ${targets.length}`);
  if(pageErrors.length){
    console.log(`\n[FAIL] 페이지 에러 ${pageErrors.length}건`);
    [...new Set(pageErrors)].slice(0, 5).forEach(e => console.log('   ' + e));
  }
  if(fails.length){
    console.log(`\n[FAIL] ${fails.length}건 — 정답을 알아도 화면으로 맞힐 수 없는 유형`);
    fails.forEach(f => console.log('   ' + f));
    process.exit(1);
  }
  console.log('\n통과 — 전 유형이 화면으로 풀린다.');
  if(pageErrors.length) process.exit(1);
})().catch(e => { console.error(e); process.exit(2); });
