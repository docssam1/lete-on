#!/usr/bin/env node
/* Numbers of Magic — 주간 학습지 PDF 생성·업로드 (GitHub Actions 'NM weekly worksheets', 월 06:30 KST)
 *
 * 흐름: nm_contacts(동의·활성) → 학생별 nm_profiles.state.weeklyDigest.courseKey → number_magic/ws.html 을
 *       헤드리스 크롬으로 열어 A4 PDF → Supabase Storage 'nm-worksheets/<week>/<token>.pdf'(공개 읽기) →
 *       nm_weekly_pdf(profile_name, week_key, url) upsert.  weekly-notify(월 08:00 KST)가 이 URL을 문자에 넣는다.
 * 문항은 ws.html 이 앱 편지함 봉투와 같은 규칙(주차+과정 → 시드)으로 만들므로, 앱에서 보는 학습지와 같다.
 *
 * env: SUPABASE_SERVICE_ROLE_KEY(필수) · SUPABASE_URL(기본 프로젝트) · BASE_URL(기본: 저장소 루트를 로컬로 띄움)
 *      WEEK(주차 강제, 예 2026-W36) · DRY=1(업로드 없이 PDF만 ./out/ 에)
 * 수동: node scripts/nm-weekly-worksheets.cjs --name 홍길동 --course C4 [--cadence w2] [--amount 0.7|0.85|1|1.25|1.5]
 *       고등 C38~C73 은 과목별 3개월 편성. --session N 은 기존 회차 번호(1부터)로 묶음 시작 위치를 지정한다.
 *       중등 C29~C37 는 학년당 20묶음. 각 학년의 1학기 연산은 주2묶음 기본10주이며 주1묶음은 느린 개인 설정이다.
 *       --start-date YYYY-MM-DD [--speed 0.7|0.85|1|1.25|1.5] 는 시작일로부터 해당 주의 다음 묶음을 고른다.
 *       기존 주 2회는 k=1,2 두 벌. 서버가 확정한 개인 계획은 전체 주간 배정을 k=1 한 벌로 만든다.
 *       개인 계획 snapshot은 system_delivery의 config만 사용하며 현재 기기 state로 우회하지 않는다.
 */
'use strict';
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const http = require('http');
const { spawn } = require('child_process');

const SB_URL = (process.env.SUPABASE_URL || 'https://fgahqumaldheqettmvqg.supabase.co').replace(/\/$/, '');
const DRY = process.env.DRY === '1';
const ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const argOf = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : ''; };

function kstWeekKey() {
  const now = new Date(Date.now() + 9 * 3600000);
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const dayNum = (d.getUTCDay() + 6) % 7; d.setUTCDate(d.getUTCDate() - dayNum + 3);
  const ft = new Date(Date.UTC(d.getUTCFullYear(), 0, 4)); const fd = (ft.getUTCDay() + 6) % 7; ft.setUTCDate(ft.getUTCDate() - fd + 3);
  const wk = 1 + Math.round((d - ft) / (7 * 86400000));
  return `${d.getUTCFullYear()}-W${String(wk).padStart(2, '0')}`;
}
const WEEK = process.env.WEEK || kstWeekKey();
const AMOUNTS = [0.7, 0.85, 1, 1.25, 1.5];
const amountOf = (value) => { const n = Number(value); return AMOUNTS.includes(n) ? n : 1; };
const HIGH_PLAN_VERSION = '20261023-high3m';
const HIGH_PLAN_COURSE = /^C(3[89]|[4-6][0-9])$/;
const CALCULUS_PLAN_VERSION = '20261024-calculus3m';
const CALCULUS_PLAN_COURSE = /^C7[0-3]$/;
const MIDDLE_PLAN_VERSION = '20261023-middle25';
const MIDDLE_PLAN_COURSE = /^C(29|3[0-7])$/;
const DELIVERY_PLAN_VERSION = '20261024-personal1';
const deliveryApi = () => require('../number_magic/app/delivery-plan.js');
const sessionIndexOf = (value) => { const n = Number(value); return Number.isInteger(n) && n >= 1 && n <= 1000 ? n : null; };
const planVersionOf = (courseKey) => HIGH_PLAN_COURSE.test(courseKey) ? HIGH_PLAN_VERSION : MIDDLE_PLAN_COURSE.test(courseKey) ? MIDDLE_PLAN_VERSION : CALCULUS_PLAN_COURSE.test(courseKey) ? CALCULUS_PLAN_VERSION : null;
const studyPlanOf = (target) => !!planVersionOf(target.courseKey) && target.highPlanVersion === planVersionOf(target.courseKey);
const dateOf = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(value + 'T00:00:00Z');
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value ? value : null;
};
const highStartDateOf = (target) => dateOf(target.highStartDate || target.startDate);
const highSpeedOf = (target) => amountOf(target.highSpeed || target.speed || 1);
function personalPlanOf(target) {
  if (target.deliveryPlanVersion == null) {
    if (target.learningPlan != null) throw new Error('invalid_delivery_plan');
    return null;
  }
  if (target.deliveryPlanVersion !== DELIVERY_PLAN_VERSION) throw new Error('unsupported_delivery_plan');
  const plan = deliveryApi().normalize(target.learningPlan);
  if (!plan) throw new Error('invalid_delivery_plan');
  return plan;
}
function jobsForTarget(target) {
  return personalPlanOf(target) ? [1] : target.cadence === 'w2' ? [1, 2] : [1];
}

function buildWorksheetUrl(base, week, target, k) {
  const personal = personalPlanOf(target);
  if (personal) {
    if (k !== 1) throw new Error('personal_plan_whole_week_only');
    return `${base}/number_magic/ws.html?dv=${DELIVERY_PLAN_VERSION}&dp=${deliveryApi().encode(personal)}&w=${week}&c=${encodeURIComponent(personal.courseKey)}&n=${encodeURIComponent(target.name)}&k=1&cad=${personal.cadence}&amt=${personal.amount}&auto=0`;
  }
  const original = `${base}/number_magic/ws.html?w=${week}&c=${encodeURIComponent(target.courseKey)}&n=${encodeURIComponent(target.name)}&k=${k}&cad=${target.cadence}&amt=${target.amount || 1}&auto=0`;
  // Unmarked targets retain the original URL, selection, and seed contract.
  if (!studyPlanOf(target)) return original;
  const sessionIndex = sessionIndexOf(target.sessionIndex);
  const startDate = highStartDateOf(target);
  return original + `&hp=1&highPlanVersion=${target.highPlanVersion}` + (sessionIndex ? `&p=1&s=${sessionIndex}` : '')
    + (startDate ? `&hs=${startDate}&hv=${highSpeedOf(target)}` : '');
}

function worksheetToken(key, week, target, k) {
  const personal = personalPlanOf(target);
  if (personal) {
    if (k !== 1) throw new Error('personal_plan_whole_week_only');
    const snapshot = JSON.stringify([DELIVERY_PLAN_VERSION,target.name,week,deliveryApi().encode(personal),personal.amount,k]);
    return crypto.createHmac('sha256', key || 'dry').update(snapshot).digest('hex').slice(0, 32);
  }
  let source = `${target.name}|${week}|${target.courseKey}|a${target.amount || 1}${k > 1 ? '|k' + k : ''}`;
  if (studyPlanOf(target)) {
    source += `|hp${target.highPlanVersion}|s${sessionIndexOf(target.sessionIndex) || 1}`;
    const startDate = highStartDateOf(target);
    if (startDate) source += `|hs${startDate}|hv${highSpeedOf(target)}`;
  }
  return crypto.createHmac('sha256', key || 'dry').update(source).digest('hex').slice(0, 8);
}

function worksheetTarget(target) {
  const personal = personalPlanOf(target);
  if (personal) return {...target,courseKey:personal.courseKey,sessionIndex:personal.sessionIndex,
    cadence:personal.cadence,amount:personal.amount,learningPlan:personal,wholeWeek:true};
  const version = planVersionOf(target.courseKey);
  if (version) {
    target.highPlanVersion = version;
    const startDate = highStartDateOf(target);
    if (startDate) { target.highStartDate = startDate; target.highSpeed = highSpeedOf(target); }
  }
  return target;
}

async function sb(pathname, init = {}) {
  const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const r = await fetch(SB_URL + pathname, { ...init, headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, ...(init.headers || {}) } });
  if (!r.ok) {
    const body=await r.text();
    const error = new Error(`${init.method || 'GET'} ${pathname} → ${r.status} ${body.slice(0, 200)}`);
    try{const payload=JSON.parse(body);error.code=payload.code||payload.error;error.storageMessage=payload.message;}catch(_){}
    error.status = r.status; throw error;
  }
  const t = await r.text(); try { return JSON.parse(t); } catch (_) { return t; }
}

function targetFromConfig(name, config, week) {
  if (!config || typeof config !== 'object' || Array.isArray(config)
    || config.week != null && config.week !== week || config.k != null && config.k !== 1) throw new Error('invalid_delivery_snapshot');
  if (Object.prototype.hasOwnProperty.call(config,'deliveryPlanVersion') || Object.prototype.hasOwnProperty.call(config,'learningPlan')) {
    const plan=deliveryApi().fromConfig(config);
    if(!plan)throw new Error('invalid_delivery_snapshot');
    return worksheetTarget({name,deliveryPlanVersion:config.deliveryPlanVersion,learningPlan:plan,deliverySource:'server'});
  }
  if (!/^C(?:0|[1-9]\d?)$/.test(config.courseKey || '') || Number(config.courseKey.slice(1)) > 73
    || !['w1','w2'].includes(config.cadence) || !AMOUNTS.includes(Number(config.amount))) throw new Error('invalid_delivery_snapshot');
  // The server's managed snapshot wins over a possibly newer or older profile
  // cache. Retain the exact old high-plan marker rather than inferring a new one.
  return {name,courseKey:config.courseKey,cadence:config.cadence,amount:Number(config.amount),
    sessionIndex:sessionIndexOf(config.sessionIndex),highPlanVersion:config.highPlanVersion,
    highStartDate:config.highStartDate,highSpeed:config.highSpeed,deliverySource:'server'};
}
async function listTargets(options = {}) {
  const request = options.request || sb,week = options.week || WEEK;
  const option = options.args ? k => {const i=options.args.indexOf(k);return i<0?'':options.args[i+1]||'';} : argOf;
  const name = option('--name'), course = option('--course');
  if (name) {
    const sessionArg = option('--session'), sessionIndex = sessionIndexOf(sessionArg);
    if (sessionArg && !sessionIndex) throw new Error('--session 은 1~1000 사이의 기존 회차 번호여야 합니다.');
    const startDateArg = option('--start-date'), startDate = dateOf(startDateArg), speedArg = option('--speed');
    if (startDateArg && !startDate) throw new Error('--start-date 는 실제 YYYY-MM-DD 날짜여야 합니다.');
    if (speedArg && !AMOUNTS.includes(Number(speedArg))) throw new Error('--speed 는 0.7, 0.85, 1, 1.25, 1.5 중 하나여야 합니다.');
    return [worksheetTarget({ name, courseKey: course || '', cadence: option('--cadence') === 'w2' ? 'w2' : 'w1', amount: amountOf(option('--amount') || 1), sessionIndex, startDate, speed: amountOf(speedArg || 1) })];
  }
  const contacts = await request('/rest/v1/nm_contacts?select=profile_name,phone&active=eq.true&consent=eq.true');
  const names = [...new Set(contacts.map(c => c.profile_name).filter(Boolean))];
  const out = [];
  for (const n of names) {
    const contact = contacts.find(c => c.profile_name === n && /^01\d{8,9}$/.test(String(c.phone || '').replace(/\D/g,'')));
    if (!contact) {out.push({name:n,skipReason:'contact-unavailable'});continue;}
    let delivery;
    try {
      delivery = await request('/rest/v1/rpc/nm_membership_rpc',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({p_action:'system_delivery',p_payload:{profileName:n,phone:String(contact.phone).replace(/\D/g,''),week,k:1}})});
      if (!delivery || typeof delivery !== 'object' || delivery.error || typeof delivery.managed !== 'boolean'
        || delivery.managed && delivery.canUse !== true) {out.push({name:n,skipReason:'membership-denied'});continue;}
      const personalMarked=Object.prototype.hasOwnProperty.call(delivery,'deliveryPlanVersion')
        || Object.prototype.hasOwnProperty.call(delivery,'wholeWeek');
      if (personalMarked && (delivery.deliveryPlanVersion!==DELIVERY_PLAN_VERSION || delivery.wholeWeek!==true || delivery.config==null))
        throw new Error('invalid_delivery_snapshot');
      if (delivery.config != null) {
        const target=targetFromConfig(n,delivery.config,week);
        if(personalMarked && !personalPlanOf(target))throw new Error('invalid_delivery_snapshot');
        out.push(target);continue;
      }
    } catch (_) {out.push({name:n,skipReason:'delivery-snapshot-unavailable'});continue;}
    // Unowned legacy profiles and owned profiles without an assigned snapshot
    // keep their previous digest fallback. Never read st.learningPlan here.
    const prof = await request(`/rest/v1/nm_profiles?select=state&name=eq.${encodeURIComponent(n)}&limit=1`);
    const st = prof && prof[0] && prof[0].state || {};
    if(st.learningPlan!=null && delivery.personalPlanLegacy!==true){out.push({name:n,skipReason:'personal-snapshot-missing'});continue;}
    const digest = st.weeklyDigest || {};
    out.push(worksheetTarget({ name: n, courseKey: digest.courseKey || '', cadence: st.roadCadence === 'w2' ? 'w2' : 'w1', amount: amountOf(st.roadAmount), sessionIndex: sessionIndexOf(digest.sessionIndex),
      highStartDate: digest.highStartDate, startDate: digest.startDate, highSpeed: digest.highSpeed, speed: digest.speed }));
  }
  return out;
}

async function storeWorksheetPdf(request,key,week,target,k,pdf,sbUrl=SB_URL) {
  const token=worksheetToken(key,week,target,k),objPath=`${week}/${token}.pdf`,personal=!!personalPlanOf(target);
  let reused=false;
  try {
    await request(`/storage/v1/object/nm-worksheets/${objPath}`,{method:'POST',headers:{'Content-Type':'application/pdf','x-upsert':personal?'false':'true'},body:pdf});
  }catch(error){
    const duplicate=error.status===409||error.status===400&&(['Duplicate','ResourceAlreadyExists','KeyAlreadyExists','already_exists'].includes(error.code)
      ||/^(?:the )?(?:resource|asset) already exists\.?$/i.test(error.storageMessage||''));
    if(!personal||!duplicate)throw error;
    reused=true;
  }
  const url=`${sbUrl}/storage/v1/object/public/nm-worksheets/${objPath}`;
  await request('/rest/v1/nm_weekly_pdf',{method:'POST',headers:{'Content-Type':'application/json',Prefer:'resolution=merge-duplicates'},
    body:JSON.stringify({profile_name:target.name,week_key:week,k,course_key:target.courseKey,url})});
  return {url,objPath,reused};
}

function startStaticServer() {
  return new Promise((resolve) => {
    const srv = spawn(process.execPath, ['-e', `
      const http=require('http'),fs=require('fs'),path=require('path');const root=${JSON.stringify(ROOT)};
      const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf','.json':'application/json'};
      http.createServer((q,s)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join(root,p);
        if(!f.startsWith(root)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){s.writeHead(404);return s.end();}
        s.writeHead(200,{'Content-Type':mime[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(s);}).listen(0,'127.0.0.1',function(){console.log('PORT '+this.address().port)});
    `], { stdio: ['ignore', 'pipe', 'inherit'] });
    srv.stdout.on('data', (d) => { const m = String(d).match(/PORT (\d+)/); if (m) resolve({ srv, base: `http://127.0.0.1:${m[1]}` }); });
  });
}

async function main() {
  // system_delivery creates a frozen server snapshot. A dry run must not call
  // it; use an explicit synthetic/manual target for a local-only PDF instead.
  if (DRY && !argOf('--name')) throw new Error('DRY 자동 조회는 서버 snapshot을 생성하므로 사용할 수 없습니다. --name과 --course로 수동 대상을 지정하세요.');
  const KEY = DRY ? '' : process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!KEY && !DRY) throw new Error('SUPABASE_SERVICE_ROLE_KEY 가 없습니다 (DRY=1 이면 생략 가능)');
  const targets = await listTargets();
  console.log(`[ws] week=${WEEK} targets=${targets.length}`);
  if (!targets.length) return;

  const { chromium } = require('playwright');
  let base = process.env.BASE_URL, srv = null;
  if (!base) { const s = await startStaticServer(); base = s.base; srv = s.srv; }
  const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  const outDir = path.join(ROOT, 'out'); if (DRY) fs.mkdirSync(outDir, { recursive: true });
  let okN = 0, skip = 0, fail = 0;
  try {
    for (const t of targets) {
      if (t.skipReason) {console.log(`[ws] skip ${t.name}: ${t.skipReason}`);skip++;continue;}
      if (!t.courseKey) { console.log(`[ws] skip ${t.name}: weeklyDigest.courseKey 없음(앱에서 로드맵을 아직 안 열었음)`); skip++; continue; }
      const ks = jobsForTarget(t),personal = personalPlanOf(t);
      for (const k of ks) {
      const url = buildWorksheetUrl(base, WEEK, t, k);
      const page = await browser.newPage({ viewport: { width: 900, height: 1200 } });
      try {
        await page.goto(url, { waitUntil: 'load', timeout: 60000 });
        const exhausted = personal ? await page.evaluate(({plan,weekKey})=>{
          const delivery=window.NM_DELIVERY_PLAN;
          if(!delivery||!window.NM_COURSES)throw new Error('delivery_plan_unavailable');
          return !delivery.assignment(window.NM_COURSES,plan,weekKey)?.weekLessons?.length;
        },{plan:personal,weekKey:WEEK}) : studyPlanOf(t) && await page.evaluate(({ courseKey, k, sessionIndex, version, startDate, speed, cadence, weekKey }) => {
          const pacing = window.NM_HIGH_PACING, course = window.NM_COURSES && window.NM_COURSES[courseKey];
          if (!(pacing && course && course.studyPlan && course.studyPlan.version === version)) return false;
          // Dated plans can continue into the next course; inspect the whole assignment.
          if (startDate) return typeof pacing.assignment === 'function'
            && !pacing.assignment(window.NM_COURSES, { courseKey, k, startSession: sessionIndex, startDate, speed, cadence, weekKey });
          return !pacing.select(course, { k, startSession: sessionIndex });
        }, { courseKey: t.courseKey, k, sessionIndex: sessionIndexOf(t.sessionIndex), version: t.highPlanVersion,
          startDate: highStartDateOf(t), speed: highSpeedOf(t), cadence: t.cadence, weekKey: WEEK });
        if (exhausted) { console.log(`[ws] skip ${t.name} k=${k}: 다음 수업 묶음 없음`); skip++; continue; }
        await page.waitForFunction(() => window.NM_WS_READY, null, { timeout: 30000 });
        const ready = await page.evaluate(() => window.NM_WS_READY);
        if (ready !== true) throw new Error('ws.html 렌더 실패: ' + await page.evaluate(() => (document.querySelector('.ws-err') || {}).textContent));
        const fonts = await page.evaluate(() => ({ pretendard: document.fonts.check('16px Pretendard'), gowun: document.fonts.check('16px "Gowun Batang"'), status: document.fonts.status }));
        if (!fonts.pretendard) console.warn(`[ws] ${t.name}: Pretendard 미로딩(${JSON.stringify(fonts)}) — 시스템 한글 글꼴로 대체됨`);
        await page.emulateMedia({ media: 'print' });
        const pdf = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' } });
        const token = worksheetToken(KEY, WEEK, t, k); // 고등 묶음 버전·시작 회차도 별도 파일로 보존한다.
        const objPath = `${WEEK}/${token}.pdf`;
        if (DRY) { fs.writeFileSync(path.join(outDir, objPath.replace('/', '_')), pdf); console.log(`[ws] DRY ${t.name} k=${k} → out/${objPath.replace('/', '_')} (${pdf.length}B)`); okN++; continue; }
        const {url:publicUrl}=await storeWorksheetPdf(sb,KEY,WEEK,t,k,pdf);
        console.log(`[ws] ok ${t.name} ${t.courseKey} k=${k} → ${publicUrl} (${pdf.length}B)`); okN++;
      } catch (e) { console.error(`[ws] FAIL ${t.name} k=${k}: ${e && e.message || e}`); fail++; }
      finally { await page.close(); }
      }
    }
  } finally { await browser.close(); if (srv) srv.kill(); }
  console.log(`[ws] done ok=${okN} skip=${skip} fail=${fail}`);
  if (fail) process.exit(1);
}
module.exports = { HIGH_PLAN_VERSION, MIDDLE_PLAN_VERSION, CALCULUS_PLAN_VERSION, DELIVERY_PLAN_VERSION, buildWorksheetUrl, worksheetToken, worksheetTarget, sessionIndexOf, dateOf,
  jobsForTarget,targetFromConfig,listTargets,storeWorksheetPdf };
if (require.main === module) main().catch((e) => { console.error('[ws] error', e); process.exit(1); });
