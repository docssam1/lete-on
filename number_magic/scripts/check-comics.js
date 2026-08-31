#!/usr/bin/env node
/* ============================================================
   수학사 만화 파트 검사기
   - node scripts/check-comics.js --part data/story-comics-src/M-08.js  (한 파트)
   - node scripts/check-comics.js                                        (src 전체)
   실패(FAIL)는 exit 1. 경고(warn)는 통과하되 반드시 읽고 고칠 수 있으면 고칠 것.
   ============================================================ */
'use strict';
const fs=require('fs'), path=require('path');
const H=require('./comic-helpers.js');
const ROOT=path.join(__dirname,'..');
const SRC=path.join(ROOT,'data/story-comics-src');

/* 허용 팔레트: C 값 + 기존 손그림 6편이 쓰던 소수의 예외 */
const PALETTE=new Set(Object.values(H.C).map(c=>c.toLowerCase())
  .concat(['#fff','#ffffff','#eac996','#dfe7db','#e0d6bd','#8d97ad','#2b3a67','#5b8dd9','#e08a2e','#ffd9c4','#c2571f','#b8541f']));

const HANGUL=/[가-힣]/;

function checkPart(file){
  const errs=[],warns=[];
  const id=path.basename(file,'.js');
  let out;
  /* 원장 지시(2026-08-31): 막대 사람 금지 — 소스에 stick( 이 남아 있으면 경고 */
  try{
    const src=fs.readFileSync(path.resolve(file),'utf8');
    if(/\bstick\(/.test(src)) warns.push('stick() 사용 — 막대 사람 금지, 캐릭터 프리셋(king·sage·greek·scholar·wig·boy·girl·shepherd·scribe·merchant·astronomer·numi)으로 교체할 것');
  }catch(e){}
  try{
    delete require.cache[require.resolve(path.resolve(file))];
    const mod=require(path.resolve(file));
    if(typeof mod!=='function')throw new Error('module.exports가 function(H)가 아님');
    out=mod(H);
  }catch(e){ return {id,errs:['로드/실행 실패: '+e.message],warns:[]}; }

  if(!out||!Array.isArray(out.panels)) errs.push('panels 배열이 없음');
  else{
    if(out.panels.length!==4) errs.push('컷 수 '+out.panels.length+' — 정확히 4컷이어야 함');
    out.panels.forEach((p,i)=>{
      const n=i+1;
      /* 캡션 */
      if(!p.text||typeof p.text!=='object'){errs.push(n+'컷: text 없음');return;}
      for(const l of ['ko','en','zh']){
        const v=p.text[l];
        if(typeof v!=='string'||!v.trim()) errs.push(n+'컷: text.'+l+' 비었음');
      }
      if(p.text.en&&HANGUL.test(p.text.en)) errs.push(n+'컷: en 캡션에 한글');
      if(p.text.zh&&HANGUL.test(p.text.zh)) errs.push(n+'컷: zh 캡션에 한글');
      if(p.text.ko&&!HANGUL.test(p.text.ko)) warns.push(n+'컷: ko 캡션에 한글이 없음(수식만?)');
      if(p.text.ko&&(p.text.ko.length<20||p.text.ko.length>130))
        warns.push(n+'컷: ko 캡션 길이 '+p.text.ko.length+'자(권장 40~90)');
      /* 그림 */
      if(typeof p.art!=='string'){errs.push(n+'컷: art가 문자열이 아님');return;}
      if(!p.art.startsWith('<svg viewBox="0 0 200 140"')) errs.push(n+'컷: viewBox 0 0 200 140이 아님');
      /* 외부 참조 금지 — 단, 캐릭터 PNG(assets/images/characters/<이름>.png)만 허용.
         스크립트·javascript:·그 밖의 href는 여전히 금지한다. */
      if(/<script|javascript:/i.test(p.art)) errs.push(n+'컷: 스크립트 금지');
      for(const m of p.art.matchAll(/href\s*=\s*"([^"]*)"/gi)){
        if(!/^assets\/images\/characters\/[a-z]+\.png$/.test(m[1]))
          errs.push(n+'컷: 허용되지 않은 외부 참조 href="'+m[1].slice(0,40)+'"');
      }
      for(const m of p.art.matchAll(/<image\b([^>]*)>/gi)){
        if(!/href\s*=\s*"assets\/images\/characters\//.test(m[1]))
          errs.push(n+'컷: <image>는 캐릭터 PNG만 허용');
      }
      /* 태그 균형 */
      const stack=[]; let bad=false;
      for(const m of p.art.matchAll(/<(\/?)([a-zA-Z]+)([^>]*?)(\/?)>/g)){
        const[,close,tag,,self]=m;
        if(self)continue;
        if(close){ if(stack.pop()!==tag){bad=true;break;} }
        else stack.push(tag);
      }
      if(bad||stack.length) errs.push(n+'컷: SVG 태그 균형 깨짐'+(stack.length?' (미닫힘: '+stack.join(',')+')':''));
      /* 요소 밀도 */
      const elCnt=(p.art.match(/<(rect|circle|ellipse|line|path|polygon|polyline|text|g|image)\b/g)||[]).length;
      if(elCnt>40) errs.push(n+'컷: 요소 '+elCnt+'개 — 너무 복잡함(최대 40)');
      else if(elCnt>20) warns.push(n+'컷: 요소 '+elCnt+'개(권장 ≤15) — 뭉개지지 않는지 확인');
      /* 팔레트 */
      for(const c of new Set((p.art.match(/#[0-9a-fA-F]{3,6}\b/g)||[]).map(x=>x.toLowerCase()))){
        if(!PALETTE.has(c)) warns.push(n+'컷: 팔레트 밖 색 '+c+' — C 팔레트를 쓸 것');
      }
      /* 그림 속 설명 문장 금지(휴리스틱): text 요소 내용이 낱말 4개 이상이면 경고 */
      for(const t of p.art.matchAll(/<text[^>]*>([^<]*)<\/text>/g)){
        const words=t[1].trim().split(/\s+/).filter(Boolean);
        if(words.length>=4) warns.push(n+'컷: 그림 속 글자가 문장 같음("'+t[1].trim().slice(0,30)+'…") — 기호·숫자·이야기 낱말만');
        if(HANGUL.test(t[1])) warns.push(n+'컷: 그림 속 한글 "'+t[1].trim().slice(0,20)+'" — 3언어 공용이라 곤란');
      }
    });
  }
  return {id,errs,warns};
}

const argPart=process.argv.indexOf('--part');
const files=argPart>=0?[process.argv[argPart+1]]
  :fs.readdirSync(SRC).filter(f=>f.endsWith('.js')).map(f=>path.join(SRC,f));
let fails=0,warnCnt=0;
for(const f of files){
  const r=checkPart(f);
  if(r.errs.length){fails++;console.log('✗ '+r.id);r.errs.forEach(e=>console.log('   FAIL '+e));}
  r.warns.forEach(w=>{warnCnt++;console.log('   warn '+r.id+': '+w);});
}
console.log('파트 '+files.length+' · 실패 '+fails+' · 경고 '+warnCnt);
process.exit(fails?1:0);
