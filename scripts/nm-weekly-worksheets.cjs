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
 * 수동: node scripts/nm-weekly-worksheets.cjs --name 홍길동 --course C4 [--cadence w2]   (연락처 없이 한 명만; w2면 k=1,2 두 벌)
 */
'use strict';
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const http = require('http');
const { spawn } = require('child_process');

const SB_URL = (process.env.SUPABASE_URL || 'https://fgahqumaldheqettmvqg.supabase.co').replace(/\/$/, '');
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
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

async function sb(pathname, init = {}) {
  const r = await fetch(SB_URL + pathname, { ...init, headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, ...(init.headers || {}) } });
  if (!r.ok) throw new Error(`${init.method || 'GET'} ${pathname} → ${r.status} ${(await r.text()).slice(0, 200)}`);
  const t = await r.text(); try { return JSON.parse(t); } catch (_) { return t; }
}

async function listTargets() {
  const name = argOf('--name'), course = argOf('--course');
  if (name) return [{ name, courseKey: course || '', cadence: argOf('--cadence') === 'w2' ? 'w2' : 'w1' }];
  const contacts = await sb('/rest/v1/nm_contacts?select=profile_name&active=eq.true&consent=eq.true');
  const names = [...new Set(contacts.map(c => c.profile_name).filter(Boolean))];
  const out = [];
  for (const n of names) {
    const prof = await sb(`/rest/v1/nm_profiles?select=state&name=eq.${encodeURIComponent(n)}&limit=1`);
    const st = prof && prof[0] && prof[0].state || {};
    out.push({ name: n, courseKey: st.weeklyDigest && st.weeklyDigest.courseKey || '', cadence: st.roadCadence === 'w2' ? 'w2' : 'w1' });
  }
  return out;
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
      if (!t.courseKey) { console.log(`[ws] skip ${t.name}: weeklyDigest.courseKey 없음(앱에서 로드맵을 아직 안 열었음)`); skip++; continue; }
      const ks = t.cadence === 'w2' ? [1, 2] : [1]; // 주 2회반은 그 주 학습지 두 벌
      for (const k of ks) {
      const url = `${base}/number_magic/ws.html?w=${WEEK}&c=${encodeURIComponent(t.courseKey)}&n=${encodeURIComponent(t.name)}&k=${k}&cad=${t.cadence}&auto=0`;
      const page = await browser.newPage({ viewport: { width: 900, height: 1200 } });
      try {
        await page.goto(url, { waitUntil: 'load', timeout: 60000 });
        await page.waitForFunction(() => window.NM_WS_READY, null, { timeout: 30000 });
        const ready = await page.evaluate(() => window.NM_WS_READY);
        if (ready !== true) throw new Error('ws.html 렌더 실패: ' + await page.evaluate(() => (document.querySelector('.ws-err') || {}).textContent));
        const fonts = await page.evaluate(() => ({ pretendard: document.fonts.check('16px Pretendard'), gowun: document.fonts.check('16px "Gowun Batang"'), status: document.fonts.status }));
        if (!fonts.pretendard) console.warn(`[ws] ${t.name}: Pretendard 미로딩(${JSON.stringify(fonts)}) — 시스템 한글 글꼴로 대체됨`);
        await page.emulateMedia({ media: 'print' });
        const pdf = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' } });
        const token = crypto.createHmac('sha256', KEY || 'dry').update(`${t.name}|${WEEK}|${t.courseKey}${k > 1 ? '|' + k : ''}`).digest('hex').slice(0, 8); // 8자: 단문(90바이트) 짧은 링크(/w/)용
        const objPath = `${WEEK}/${token}.pdf`;
        if (DRY) { fs.writeFileSync(path.join(outDir, objPath.replace('/', '_')), pdf); console.log(`[ws] DRY ${t.name} k=${k} → out/${objPath.replace('/', '_')} (${pdf.length}B)`); okN++; continue; }
        await sb(`/storage/v1/object/nm-worksheets/${objPath}`, { method: 'POST', headers: { 'Content-Type': 'application/pdf', 'x-upsert': 'true' }, body: pdf });
        const publicUrl = `${SB_URL}/storage/v1/object/public/nm-worksheets/${objPath}`;
        await sb('/rest/v1/nm_weekly_pdf', { method: 'POST', headers: { 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates' },
          body: JSON.stringify({ profile_name: t.name, week_key: WEEK, k, course_key: t.courseKey, url: publicUrl }) });
        console.log(`[ws] ok ${t.name} ${t.courseKey} k=${k} → ${publicUrl} (${pdf.length}B)`); okN++;
      } catch (e) { console.error(`[ws] FAIL ${t.name} k=${k}: ${e && e.message || e}`); fail++; }
      finally { await page.close(); }
      }
    }
  } finally { await browser.close(); if (srv) srv.kill(); }
  console.log(`[ws] done ok=${okN} skip=${skip} fail=${fail}`);
  if (fail) process.exit(1);
}
main().catch((e) => { console.error('[ws] error', e); process.exit(1); });
