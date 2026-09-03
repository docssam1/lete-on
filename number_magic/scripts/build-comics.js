#!/usr/bin/env node
/* ============================================================
   수학사 만화 빌드 — data/story-comics-src/*.js(헬퍼 사용 소스)를 실행해
   data/story-comics.js(런타임 순수 데이터)를 통째로 생성한다.
   손으로 story-comics.js를 고치지 말 것 — 소스 파트를 고치고 다시 빌드.
   ============================================================ */
'use strict';
const fs=require('fs'), path=require('path');
const {execSync}=require('child_process');
const H=require('./comic-helpers.js');
const ROOT=path.join(__dirname,'..');
const SRC=path.join(ROOT,'data/story-comics-src');
const OUT=path.join(ROOT,'data/story-comics.js');

/* 빌드 전 검사기 통과가 조건 */
execSync('node '+path.join(__dirname,'check-comics.js'),{stdio:'inherit'});

const ids=fs.readdirSync(SRC).filter(f=>f.endsWith('.js')).map(f=>path.basename(f,'.js'))
  .sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
let body='';
for(const id of ids){
  const out=require(path.join(SRC,id+'.js'))(H);
  const panels=out.panels.map(p=>'  {art:'+JSON.stringify(p.art)
    +',\n   text:{ko:'+JSON.stringify(p.text.ko)+',\n         en:'+JSON.stringify(p.text.en)
    +',\n         zh:'+JSON.stringify(p.text.zh)+'}}').join(',\n');
  body+="'"+id+"':{panels:[\n"+panels+"\n]},\n\n";
}
const header=`/* ============================================================
   Numbers of Magic — 수학사 네 컷 만화 (생성 파일 — 손으로 고치지 말 것)

   소스: data/story-comics-src/<유닛>.js (유닛당 1파일, 헬퍼는 scripts/comic-helpers.js)
   빌드: node scripts/build-comics.js  (검사기 check-comics.js 통과가 선행 조건)
   저작 규칙: 수학사만화-설계.md

   개념 노트(stepDiscover)가 NM_COMICS[유닛id]를 찾으면 🏛 산문 한 줄 대신
   네 컷 만화를 렌더한다. 미등록 유닛은 종전대로 산문.
   그림은 전부 원본 도형 SVG(3언어 공용), 캡션은 해당 유닛 story.history의 재화.
   ============================================================ */
(function(){
'use strict';
window.NM_COMICS = {

`;
fs.writeFileSync(OUT,header+body+'};\n})();\n');
console.log('빌드 완료: '+ids.length+'편 → data/story-comics.js ('+fs.statSync(OUT).size+' bytes)');
