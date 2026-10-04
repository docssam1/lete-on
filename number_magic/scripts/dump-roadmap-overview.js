/* 연산 로드맵 전체(과정 → 세션 → 마법 유닛·드릴 스레드)를 한 장의 HTML 표로 펼친다.
   사용: node scripts/dump-roadmap-overview.js [출력경로]  (기본 roadmap-overview.html) */
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');
global.window=global;global.document=undefined;
const load=f=>{try{require(path.join(root,f))}catch(e){console.error('load',f,e.message)}};
load('data/threads.js');
for(const f of fs.readdirSync(path.join(root,'data/units')))load('data/units/'+f);
load('data/courses.js');
const T=window.NM_THREADS,U=window.NM_UNITS||{},C=window.NM_COURSES;
const ko=v=>v&&(typeof v==='string'?v:v.ko)||'';
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const tName=id=>{const b=String(id).split('@')[0];return T[b]?ko(T[b].name):'?';};
const lvLabel=(id,lv)=>{const t=T[id];if(!t||!t.levels)return '';const l=t.levels.find(x=>x.id===lv);return l?ko(l.label):'';};
const uTitle=id=>{const u=U[id];return u?ko(u.title||u.name):(T[id]?ko(T[id].name):'');};
const tierName={level0:'유아/예비',level1:'LEVEL 1',level2:'LEVEL 2',level3:'LEVEL 3',level4:'LEVEL 4'};
let rows='';
const ids=Object.keys(C).sort((a,b)=>C[a].order-C[b].order);
for(const id of ids){const c=C[id];
  rows+=`<h2 id="${id}">${id} · ${esc(ko(c.title))} <small>${esc(tierName[c.tier]||c.tier)} · ${c.sessions.length}세션${c.boss?' · 보스':''}${c.comingSoon?' · 준비중':''}</small></h2><table><tr><th>세션</th><th>마법(유닛)</th><th>필산 드릴 (스레드·레벨·문항수)</th></tr>`;
  c.sessions.forEach((s,i)=>{
    const magic=(s.magic||[]).map(m=>`<b>${m}</b> ${esc(uTitle(m))}`).join('<br>')||'—';
    const dr=(s.test?s.pool:s.drills||[]).map(d=>{const b=String(d.t).split('@')[0];return `<b>${esc(d.t)}</b> ${esc(tName(d.t))} <i>Lv${d.lv}${lvLabel(b,d.lv)?' '+esc(lvLabel(b,d.lv)):''}</i> ×${d.count||d.n||''}`}).join('<br>')||'—';
    rows+=`<tr><td>${s.test?'테스트':i+1}</td><td>${magic}</td><td>${dr}</td></tr>`;});
  rows+='</table>';}
const toc=ids.map(id=>`<a href="#${id}">${id} ${esc(ko(C[id].title))}</a>`).join(' · ');
fs.writeFileSync(process.argv[2]||path.join(root,'roadmap-overview.html'),`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>연산 로드맵 전체</title>
<style>body{font:14px/1.5 system-ui,sans-serif;margin:16px;color:#1a2233;background:#fff}h1{font-size:20px}h2{font-size:16px;margin:22px 0 6px;border-top:2px solid #16417c;padding-top:10px}h2 small{font-weight:400;color:#667}table{border-collapse:collapse;width:100%;margin-bottom:6px}td,th{border:1px solid #d6dbe4;padding:4px 8px;vertical-align:top;font-size:13px}th{background:#eef2f9;text-align:left}td:first-child{width:52px;text-align:center}i{color:#8b6bc7;font-style:normal}.toc{font-size:12px;line-height:1.9}.toc a{color:#16417c;text-decoration:none;white-space:nowrap}@media(prefers-color-scheme:dark){body{background:#12161f;color:#e6e9f0}td,th{border-color:#2d3648}th{background:#1c2434}.toc a{color:#8fb4ff}h2{border-color:#8fb4ff}}</style>
<h1>연산 로드맵 전체 — ${ids.length}과정</h1><div class="toc">${toc}</div>${rows}`);
console.log('과정',ids.length,'→',process.argv[2]||'roadmap-overview.html');
