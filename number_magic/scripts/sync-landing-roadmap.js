#!/usr/bin/env node
/* landing.html 의 '학습 단계 로드맵'(열 단계)을 실제 과정 편성(data/courses.js NM_COURSES)에 묶는다.
   하드코딩 문구는 과정이 재편되면 조용히 썩는다 — 실제로 중학 3개 과정(29~37)은 45주·85세션인데
   48주·92세션으로 적혀 있었고, 고1·공통수학2의 배울 내용에는 복소수·고차방정식·순열조합·집합·명제·
   유리/무리함수가 통째로 빠져 있었다.

   node scripts/sync-landing-roadmap.js          # 검사만(어긋나면 exit 1)
   node scripts/sync-landing-roadmap.js --write  # landing.html 을 실데이터로 갱신

   동기화 범위: ① 각 단계의 meta(과정 범위·주 2회 주수·주 1회 세션 수·유닛 수) 3개 언어
   ② 단계 2·3·4·6·7·8·9·10 의 learn(= 과정 제목을 순서대로 이어 붙임) 3개 언어
   ③ rmNote1(연산 구간·전 구간 주수와 개월) 3개 언어.
   손으로 쓴 learn 을 유지하는 단계: 1(과정이 1개뿐), 5(경시의 탑 — 제목이 은유적). 이 둘은 meta 만 맞춘다.
   주수 = 과정마다 ceil(세션/2) 의 합(주 2회, 과정 경계에서 한 장 남으면 한 주를 채움). */
'use strict';
const fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'..');
global.window=global;
new Function('window',fs.readFileSync(path.join(ROOT,'data/threads.js'),'utf8'))(window);
for(const f of fs.readdirSync(path.join(ROOT,'data/units'))){try{new Function('window',fs.readFileSync(path.join(ROOT,'data/units',f),'utf8'))(window)}catch(e){}}
new Function('window',fs.readFileSync(path.join(ROOT,'data/courses.js'),'utf8'))(window);
const C=window.NM_COURSES;
const ids=Object.keys(C).sort((a,b)=>C[a].order-C[b].order);
const num=id=>+id.slice(1);
const STAGES=[['level0'],['level1'],['level2'],['level3'],['challenge'],['middle1','middle2','middle3'],['highmath1'],['highmath2'],['algebra'],['calculus1']];
const HAND_LEARN=new Set([1,5]);
const st=STAGES.map((tiers,i)=>{
  const cs=ids.filter(id=>tiers.includes(C[id].tier));
  const units=new Set();cs.forEach(id=>C[id].sessions.forEach(s=>(s.magic||[]).forEach(m=>units.add(m))));
  return {n:i+1,cs,from:num(cs[0]),to:num(cs[cs.length-1]),
    sessions:cs.reduce((a,id)=>a+C[id].sessions.length,0),
    weeks:cs.reduce((a,id)=>a+Math.ceil(C[id].sessions.length/2),0),units:units.size};
});
const sum=(a,f)=>a.reduce((x,s)=>x+f(s),0);
const arith=st.slice(0,4); /* 과정 0~25 = 단계 1~4 */
const A={w:sum(arith,s=>s.weeks),s:sum(arith,s=>s.sessions)}, ALL={w:sum(st,s=>s.weeks),s:sum(st,s=>s.sessions)};
const ym=w=>{const m=Math.round(w/4.345);return {y:Math.floor(m/12),m:m%12};};
const esc=s=>String(s).replace(/'/g,"\\'");
const joinT=(s,l)=>s.cs.map(id=>{const t=C[id].title;return (t[l]||t.ko).replace(/&/g,'&amp;');}).join(l==='zh'?'、':', ');

let html=fs.readFileSync(path.join(ROOT,'landing.html'),'utf8');
const orig=html;
function replaceAll(re,fn){html=html.replace(re,fn);}

/* meta — 앞부분(과정 범위·주수·세션수)만 갈아끼우고 꼬리표(학교보다…·실험실 2)는 보존 */
for(const s of st){
  const rng=(a,b,sep)=>a===b?String(a):a+sep+b;
  const k=`rm${s.n}meta`;
  const koHead=`과정 ${rng(s.from,s.to,'~')} · 주 2회 기준 ${s.weeks}주(주 1회 ${s.sessions}주)`;
  const enHead=`${s.from===s.to?'Course':'Courses'} ${rng(s.from,s.to,'–')} · ${s.weeks} weeks at two sheets a week (${s.sessions} at one)`;
  const zhHead=`课程${rng(s.from,s.to,'~')} · 每周2次约${s.weeks}周(每周1次${s.sessions}周)`;
  const reKo=/과정 [\d~]+ · 주 2회 기준 \d+주\(주 1회 \d+주\)/,reEn=/Courses? [\d–]+ · \d+ weeks at two sheets a week \(\d+ at one\)/,reZh=/课程[\d~]+ · 每周2次约\d+周\(每周1次\d+周\)/;
  /* 해당 키가 들어 있는 줄·태그 안에서만 */
  const fix=(text)=>text
    .replace(new RegExp(`(data-i18n="${k}">)([^<]*)`),(m,a,b)=>a+b.replace(reKo,koHead).replace(/유닛 \d+/,s.n===1?`유닛 ${s.units}`:'$&'))
    .replace(new RegExp(`(${k}:')((?:[^'\\\\]|\\\\.)*)'`,'g'),(m,a,b)=>{
      let v=b;
      if(reKo.test(v))v=v.replace(reKo,koHead).replace(/유닛 \d+/,s.n===1?`유닛 ${s.units}`:'$&');
      else if(reEn.test(v))v=v.replace(reEn,enHead).replace(/\d+ units/,s.n===1?`${s.units} units`:'$&');
      else if(reZh.test(v))v=v.replace(reZh,zhHead).replace(/\d+个单元/,s.n===1?`${s.units}个单元`:'$&');
      return a+v+"'";});
  html=fix(html);
}
/* learn — 과정 제목을 그대로 */
for(const s of st){
  if(HAND_LEARN.has(s.n))continue;
  const k=`rm${s.n}learn`;
  html=html.replace(new RegExp(`(data-i18n="${k}">)[^<]*`),`$1${joinT(s,'ko')}`);
  let seen=0;
  html=html.replace(new RegExp(`(${k}:')(?:[^'\\\\]|\\\\.)*'`,'g'),(m,a)=>{const l=['ko','en','zh'][seen++]||'ko';return a+esc(joinT(s,l))+"'";});
}
/* rmNote1 */
{const a=ym(A.w),b=ym(ALL.w);
 const ko=`연산 구간(과정 0~25)은 ${A.w}주 약 ${a.y}년 ${a.m}개월, 유아부터 미적분Ⅰ까지 전 구간은 ${ALL.w}주 약 ${b.y}년 ${b.m}개월입니다. 주 1회로 천천히 가면 각각 ${A.s}주와 ${ALL.s}주가 됩니다.`;
 const en=`The arithmetic track (Courses 0–25) runs ${A.w} weeks, about ${a.y} year${a.y===1?'':'s'} ${a.m} months, and the whole way from age 5 to Calculus I runs ${ALL.w} weeks, about ${b.y} years ${b.m} months. One sheet a week stretches those to ${A.s} and ${ALL.s} weeks.`;
 const zh=`运算段（课程0~25）约${A.w}周、${a.y}年${a.m}个月；从幼儿到微积分Ⅰ的全程约${ALL.w}周、${b.y}年${b.m}个月。若选每周1次，则分别为${A.s}周和${ALL.s}周。`;
 html=html.replace(/연산 구간\(과정 0~25\)은[^<'\\]*(?=<\/p>|')/g,ko);
 html=html.replace(/The arithmetic track \(Courses 0–25\)[^'<]*(?=')/g,en);
 html=html.replace(/运算段（课程0~25）[^'<]*(?=')/g,zh);}
const changed=html!==orig;
if(process.argv.includes('--write')){
  if(changed){fs.writeFileSync(path.join(ROOT,'landing.html'),html);console.log('landing.html 갱신');}else console.log('이미 일치');
  st.forEach(s=>console.log(`단계 ${s.n}: 과정 ${s.from}~${s.to} · ${s.weeks}주 · ${s.sessions}세션 · 유닛 ${s.units}`));
  console.log(`연산 구간 ${A.w}주/${A.s}세션 · 전체 ${ALL.w}주/${ALL.s}세션`);
}else{
  console.log(changed?'✗ landing.html 로드맵이 실제 과정 편성과 어긋남 — node scripts/sync-landing-roadmap.js --write':'✓ landing.html 로드맵 = 실제 과정 편성');
  process.exit(changed?1:0);
}
