#!/usr/bin/env node
/* ============================================================
   매거진 기사 검사기 (2026-09-20)
   ------------------------------------------------------------
   매거진은 앱·학습지 양쪽에 같은 글이 나가고 세 언어를 모두 싣는다. 손으로 쓴
   데이터 파일이라 한 칸만 비어도 그 언어에서 빈 문단이 인쇄된다 — 그래서 검사한다.

   보는 것: ①3언어 12칸이 다 찼는가 ②영·중 칸에 한글이 섞였는가 ③그림이 있는가
   (원장 지시: 글만 있으면 안 된다) ④viewBox·팔레트·태그 균형 ⑤그림 속 한글
   (세 언어가 그림 한 벌을 공유하므로 한글이 들어가면 다른 언어에서 깨진다)
   ⑥id 중복 ⑦나이대(age) 표기.

   쓰는 법: node scripts/check-magazine.js
   ============================================================ */
'use strict';
const fs=require('fs'), path=require('path'), vm=require('vm');
const ROOT=path.join(__dirname,'..');
const w={window:null,console};w.window=w;
vm.runInContext(fs.readFileSync(path.join(ROOT,'data/magazine.js'),'utf8'), vm.createContext(w), {filename:'magazine.js'});
const M=w.NM_MAGAZINE;
if(!M||!Array.isArray(M.articles)){console.error('NM_MAGAZINE.articles 를 읽지 못했습니다.');process.exit(2);}

const PALETTE=new Set(['#1a2233','#16417c','#0e2c57','#c9a063','#f5d98b','#d9534f','#2e9e6b',
  '#8b6bc7','#fdf6e3','#f1f0ec','#8a6d46','#4a5468','#b0b7c3','#fdfaf3','#7ea4d6','#5b8dd9','#fff','#ffffff']);
const HANGUL=/[가-힣]/;
const AGES=['young','mid','senior'];
let fails=0, warns=0;
const seen=new Set();

function l3(o,where,errs){
  if(!o||typeof o!=='object'){errs.push(where+' 없음');return;}
  for(const l of ['ko','en','zh']){
    const v=o[l];
    if(typeof v!=='string'||!v.trim()) errs.push(where+'.'+l+' 비었음');
    else if(l!=='ko'&&HANGUL.test(v)) errs.push(where+'.'+l+' 에 한글');
    else if(l==='ko'&&!HANGUL.test(v)) errs.push(where+'.ko 에 한글이 없음');
  }
}

function art(a,where,vb,errs,warnsArr){
  if(typeof a!=='string'||!a.trim()){errs.push(where+' 그림 없음 — 매거진은 글만으로 싣지 않는다');return;}
  if(!a.startsWith('<svg viewBox="'+vb+'"')) errs.push(where+' viewBox 가 '+vb+' 가 아님');
  if(/<script|javascript:|href\s*=/i.test(a)) errs.push(where+' 외부 참조·스크립트 금지');
  const stack=[];let bad=false;
  for(const m of a.matchAll(/<(\/?)([a-zA-Z]+)([^>]*?)(\/?)>/g)){
    const[,close,tag,,self]=m;
    if(self)continue;
    if(close){ if(stack.pop()!==tag){bad=true;break;} } else stack.push(tag);
  }
  if(bad||stack.length) errs.push(where+' SVG 태그 균형 깨짐'+(stack.length?' (미닫힘: '+stack.join(',')+')':''));
  for(const c of new Set((a.match(/#[0-9a-fA-F]{3,6}\b/g)||[]).map(x=>x.toLowerCase())))
    if(!PALETTE.has(c)) warnsArr.push(where+' 팔레트 밖 색 '+c);
  for(const t of a.matchAll(/<text[^>]*>([^<]*)<\/text>/g))
    if(HANGUL.test(t[1])) errs.push(where+' 그림 속 한글 "'+t[1].trim().slice(0,16)+'" — 세 언어가 그림을 공유한다');
  const el=(a.match(/<(rect|circle|ellipse|line|path|polygon|polyline|text|g)\b/g)||[]).length;
  if(el>60) warnsArr.push(where+' 요소 '+el+'개 — 너무 복잡함');
}

l3(M.name,'name',[]); /* 제호는 아래 총평에서 함께 본다 */
M.articles.forEach((a,i)=>{
  const errs=[],wa=[], id=a.id||('#'+(i+1));
  if(!a.id) errs.push('id 없음');
  else if(seen.has(a.id)) errs.push('id 중복');
  else seen.add(a.id);
  l3(a.kicker,'kicker',errs); l3(a.title,'title',errs); l3(a.lede,'lede',errs);
  l3(a.close,'close',errs);   l3(a.source,'source',errs);
  art(a.art,'표제',  '0 0 320 170',errs,wa);
  if(!Array.isArray(a.body)||a.body.length<2) errs.push('body 가 2절 미만 — 기사로 짧다');
  else a.body.forEach((b,j)=>{
    l3(b.h,(j+1)+'절 h',errs); l3(b.p,(j+1)+'절 p',errs);
    art(b.art,(j+1)+'절','0 0 320 130',errs,wa);
    if(b.p&&b.p.ko&&(b.p.ko.length<40||b.p.ko.length>320))
      wa.push((j+1)+'절 ko 본문 '+b.p.ko.length+'자(권장 60~260)');
  });
  if(!Array.isArray(a.age)||!a.age.length) errs.push('age 없음 — 어느 나이대에 실을지 정해야 한다');
  else a.age.forEach(g=>{ if(AGES.indexOf(g)<0) errs.push('age "'+g+'" 는 young·mid·senior 가 아님'); });
  if(!a.fit||typeof a.fit!=='object') errs.push('fit 없음(빈 배열이라도 둘 것)');
  if(errs.length){fails++;console.log('✗ '+id);errs.forEach(e=>console.log('   FAIL '+e));}
  wa.forEach(x=>{warns++;console.log('   warn '+id+': '+x);});
});
console.log('기사 '+M.articles.length+' · 실패 '+fails+' · 경고 '+warns);
if(!fails) console.log('통과 — 세 언어가 다 찼고, 모든 절에 그림이 있다.');
process.exit(fails?1:0);
