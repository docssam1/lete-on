#!/usr/bin/env node
/* ============================================================
   시작점 상담(consult.html) 검사기 — 2026-11-17
   ① 규칙(app/consult-rules.js)을 화면 없이 여러 경우로 돌려 시작 과정·더 묻기를 확인한다.
   ② 화면을 세 언어 × 휴대폰·PC 폭으로 끝까지 눌러 본다(가로 넘침·오류·빈 글자·예비초등 권 이름).
   ③ 단계표(data/consult-ladder.js)가 최신인지 본다(build-consult-ladder.js --check).
   쓰는 법: node scripts/check-consult-browser.js   (실패가 있으면 exit 1)
   화면 사진: NM_CONSULT_ARTIFACTS=<폴더>
   ============================================================ */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http'), { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const fails = [];
const ok = (cond, msg) => { if(!cond) fails.push(msg); };

/* ③ 단계표 최신 */
try { execFileSync(process.execPath, [path.join(__dirname, 'build-consult-ladder.js'), '--check'], { stdio: 'pipe' }); }
catch(e){ fails.push('data/consult-ladder.js 가 낡았다 — node scripts/build-consult-ladder.js'); }

/* ① 규칙 */
global.window = global;
require(path.join(ROOT, 'data/consult-ladder.js'));
const R = require(path.join(ROOT, 'app/consult-rules.js'));
const LAD = global.NM_CONSULT_LADDER.ladder, idx = id => LAD.findIndex(s => s.id === id);
function run(profile, answer, probe){
  const s = R.newState(); Object.assign(s.profile, profile);
  const log = [];
  for(let g = 0; g < 40; g++){
    const q = R.next(s);
    if(q.type === 'done') break;
    if(q.type === 'skills'){
      const m = {}; LAD[q.step].skills.filter(k => !s.answers[k.ref]).forEach(k => { m[k.ref] = answer(k, q.step); });
      R.answerSkills(s, q.step, m); log.push(q.why + ':' + q.step);
    } else if(q.type === 'probe'){ R.answerProbe(s, q.ref, probe ? probe(q.ref) : 'wrong'); log.push('probe'); }
    else if(q.type === 'fingers'){ s.fingers = 'no'; log.push('fingers'); }
    else { fails.push('규칙: 예상 밖 질문 ' + q.type); break; }
  }
  return { s, log, r: R.result(s) };
}
const v3 = idx('elem-2021-v3'), v4 = idx('elem-2021-v4');
let x = run({ age: 'g2', book: 'miracle', edition: 'elem', volume: 3, progress: 'middle' },
  (k, st) => k.ref.startsWith('SB4') ? 'shaky' : st <= v3 ? 'good' : 'notyet');
ok(x.r.start === 'C3' && x.r.reason.kind === 'shaky', '규칙: 기적 3권 중간·받아내림 헷갈림 → 과정 3 이어야 함 (' + x.r.start + ')');
ok(!x.log.some(l => l.startsWith('up') || l.startsWith('down')), '규칙: 섞인 답이면 위아래로 더 묻지 않아야 함');
x = run({ age: 'g2', book: 'miracle', edition: 'elem', volume: 3, progress: 'end' }, (k, st) => st <= v4 ? 'good' : 'notyet');
ok(x.log.filter(l => l.startsWith('up')).length >= 1, '규칙: 다 잘하면 한 단계 위를 물어야 함');
ok(x.r.start === 'C8' && x.r.reason.kind === 'new', '규칙: 4권까지 잘함 → 5권 첫 내용(과정 8) (' + x.r.start + ')');
x = run({ age: 'g1', book: 'none' }, () => 'shaky');
ok(x.log.filter(l => l.startsWith('down')).length === 2, '규칙: 다 헷갈리면 아래로 두 번까지 (' + x.log + ')');
ok(x.s.asked.length <= R.MAX_STEPS, '규칙: 단계는 다섯 번까지');
x = run({ age: 'g3', book: 'miracle', edition: 'elem', volume: 5, progress: 'start' }, () => 'unsure');
ok(x.log.filter(l => l === 'probe').length <= 3, '규칙: 아이에게 내 볼 문제는 세 개까지 (' + x.log.filter(l => l === 'probe').length + ')');
ok(x.s.asked.length <= R.MAX_STEPS, '규칙: 모르겠어요가 많아도 단계는 다섯 번까지');
ok(x.r.needCheck, '규칙: 확인 못 한 것이 남으면 진단을 권해야 함');
x = run({ age: 'g2', book: 'miracle', edition: 'elem', volume: 3, progress: 'middle' }, () => 'unsure', () => 'right');
ok(x.r.good.length > 0 && x.r.unknown.length > 0, '규칙: 내 봐서 맞힌 것은 잘해요로, 안 내 본 것은 확인 필요로');
x = run({ age: 'm' }, () => 'good');
ok(x.r.middle && x.log.length === 0, '규칙: 중학생 이상은 묻지 않고 진단으로');
x = run({ age: 'k5', book: 'none' }, () => 'good');
ok(!!x.r.start, '규칙: 5세 다 잘함 → 시작 과정이 있어야 함');
/* 빈틈: 잘하는 것보다 앞 과정의 「안 배움」은 시작점을 끌어내리지 않는다 */
x = run({ age: 'g2', book: 'miracle', edition: 'elem', volume: 3, progress: 'middle' }, k => k.ref.startsWith('EL1') ? 'notyet' : 'good');
ok(!x.r.notyet.some(k => k.ref.startsWith('ML')), '규칙: 잘하는 구구단은 안 배움에 들지 않음');
ok(x.r.start !== 'C0' && x.r.start !== 'C1', '규칙: 앞 과정의 안 배움 하나로 시작점이 내려가면 안 됨 (' + x.r.start + ')');
/* 모든 기술은 과정이 있다 */
LAD.forEach(st => st.skills.forEach(k => ok(!!k.course, '단계표: ' + st.id + ' ' + k.ref + ' 과정 없음')));

/* ② 화면 */
const { chromium } = require('./lib/playwright');
const ART = process.env.NM_CONSULT_ARTIFACTS;
const TYPES = { '.js': 'application/javascript', '.html': 'text/html', '.css': 'text/css', '.png': 'image/png', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf' };
const server = http.createServer((req, res) => {
  const f = path.resolve(ROOT, '.' + decodeURIComponent(req.url.split('?')[0]));
  if(!f.startsWith(ROOT + path.sep) || !fs.existsSync(f) || !fs.statSync(f).isFile()){ res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type', TYPES[path.extname(f)] || 'application/octet-stream'); res.end(fs.readFileSync(f));
});
(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const base = 'http://127.0.0.1:' + server.address().port;
  const browser = await chromium.launch();
  for(const lang of ['ko', 'en', 'zh']) for(const vp of [{ w: 390, h: 844, n: 'phone' }, { w: 1280, h: 900, n: 'pc' }]){
    const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
    const errs = [];
    page.on('pageerror', e => errs.push(e.message));
    await page.addInitScript(l => { try { localStorage.setItem('nm_landing_lang', l); } catch(e){} }, lang);
    await page.route('**/*', r => r.request().url().startsWith(base) ? r.continue() : r.abort());
    await page.goto(base + '/consult.html');
    const tag = lang + '/' + vp.n;
    const check = async where => {
      const sw = await page.evaluate(() => document.documentElement.scrollWidth);
      ok(sw <= vp.w, tag + ' ' + where + ': 가로 넘침 ' + sw);
      const blank = await page.evaluate(() => [...document.querySelectorAll('#app button, #app h1, #app h2')].filter(e => !e.textContent.trim()).length);
      ok(blank === 0, tag + ' ' + where + ': 빈 글자 ' + blank);
    };
    const shot = async n => { if(ART && vp.n === 'phone'){ fs.mkdirSync(ART, { recursive: true }); await page.screenshot({ path: path.join(ART, lang + '-' + n + '.png'), fullPage: true }); } };
    await check('intro'); await shot('0-intro');
    await page.click('[data-act=begin]'); await check('age');
    // 예비초등 권 이름 확인을 위해 뒤로 갔다 오기
    await page.click('[data-act=age][data-v=g1]'); await page.click('[data-act=book][data-v=miracle]'); await check('volume'); await shot('1-volume');
    const preTitle = await page.$eval('.vol[data-ed=pre] b', e => e.textContent);
    ok(/예비|Pre|学前/.test(preTitle), tag + ': 예비초등 권 이름이 「' + preTitle + '」');
    await page.click('[data-act=back]'); await page.click('[data-act=back]');
    ok(await page.evaluate(() => NM_CONSULT_UI.current && NM_CONSULT_UI.current.type) === 'age', tag + ': 이전 단추가 나이 질문으로 돌아가지 않음');
    await page.click('[data-act=age][data-v=g2]'); await page.click('[data-act=book][data-v=miracle]');
    await page.click('[data-act=volume][data-ed=elem][data-v="3"]'); await page.click('[data-act=progress][data-v=middle]');
    let sawProbe = false, sawSkills = false;
    for(let g = 0; g < 12; g++){
      const t = await page.evaluate(() => NM_CONSULT_UI.current && NM_CONSULT_UI.current.type);
      if(t === 'skills'){
        sawSkills = true;
        const refs = await page.$$eval('.skill', els => els.map(e => e.dataset.ref));
        ok(await page.$eval('[data-act=next]', b => b.disabled), tag + ': 다 답하기 전에 「다음」이 눌림');
        for(const r of refs) await page.click(`.opt[data-ref="${r}"][data-v="${r.startsWith('SB4') ? 'shaky' : r.startsWith('ML3') ? 'unsure' : 'good'}"]`);
        await check('skills'); if(g === 0) await shot('2-skills');
        await page.click('[data-act=next]');
      } else if(t === 'probe'){
        sawProbe = true; await page.click('[data-act=reveal]');
        ok(await page.$eval('.probe-a', e => e.textContent.trim().length > 0), tag + ': 답 보기가 비었음');
        await check('probe'); await shot('3-probe');
        await page.click('[data-act=probe][data-v=right]');
      } else if(t === 'fingers'){ await check('fingers'); await page.click('[data-act=fingers][data-v=sometimes]'); }
      else break;
    }
    ok(sawSkills && sawProbe, tag + ': 기술 질문·내 보기 질문이 나와야 함');
    await page.waitForSelector('.start');
    await check('result'); await shot('4-result');
    const res = await page.evaluate(() => ({ h: document.querySelector('.start h2').textContent, sum: NM_CONSULT_UI.summaryText(), lvl: !!document.querySelector('a[href="level-test.html"]'), trial: !!document.querySelector('a[href="index.html?enter=1"]') }));
    ok(/3/.test(res.h), tag + ': 결과가 과정 3이 아님 — ' + res.h);
    ok(res.lvl && res.trial, tag + ': 결과 화면에 진단·체험 링크가 없음');
    ok(!/[가-힣]{2,}/.test(res.sum.replace(/\(기적의 계산법\)|기적의 계산법/g, '')) || lang === 'ko', tag + ': 결과 요약에 한국어가 섞임');
    // 언어 바꾸기가 상태를 잃지 않는다
    await page.click('.langbtn[data-lang=' + (lang === 'ko' ? 'en' : 'ko') + ']');
    ok(await page.$('.start') !== null, tag + ': 언어를 바꾸니 결과가 사라짐');
    // 중학생 경로
    await page.click('[data-act=restart]'); await page.click('[data-act=begin]'); await page.click('[data-act=age][data-v=m]');
    ok(await page.$('a[href="level-test.html"].primary') !== null, tag + ': 중학생 → 진단 평가 단추가 앞에 와야 함');
    ok(errs.length === 0, tag + ': 오류 ' + errs.join(' | '));
    await page.close();
  }
  await browser.close(); server.close();
  if(fails.length){ console.error('실패 ' + fails.length + '건'); fails.forEach(f => console.error(' - ' + f)); process.exit(1); }
  console.log('통과 — 규칙 여러 경우 · 화면 세 언어 × 휴대폰/PC · 단계표 최신');
})().catch(e => { console.error(e); process.exit(1); });
