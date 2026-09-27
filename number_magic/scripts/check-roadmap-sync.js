#!/usr/bin/env node
'use strict';
/* 실제 HTML 태그 순서와 등록 데이터를 따로 읽는다. 폴더 전수 로딩만으로는
 * index/drill/ws 중 한 화면에서 빠진 script를 검출할 수 없다.
 * node number_magic/scripts/check-roadmap-sync.js [--self-test]
 * 테스트용 readFile/exists 주입은 메모리에서만 동작하며 원본을 바꾸지 않는다. */
const fs=require('fs'),path=require('path'),vm=require('vm');
const ROOT=path.resolve(__dirname,'..');
const STORY_ONLY={
  'T-AD1':'교과 드릴을 재사용하는 큰 수 연결 카드',
  'T-NS1':'교과 드릴을 재사용하는 자릿값 연결 카드',
  'T-DV1':'교과 드릴을 재사용하는 나눗셈 입문 카드',
  'T-FR1':'교과 드릴을 재사용하는 분수 입문 카드',
  'T-ML1':'교과 드릴을 재사용하는 곱셈 연결 카드',
  'T-DV2':'교과 드릴을 재사용하는 나머지 연결 카드',
  'T-FR2':'교과 드릴을 재사용하는 가분수 연결 카드',
  'T-FR3':'교과 드릴을 재사용하는 약분 연결 카드',
  'T-DV3':'교과 드릴을 재사용하는 약수 연결 카드',
  'T-DC1':'교과 드릴을 재사용하는 소수 입문 카드',
  'T-MX1':'교과 드릴을 재사용하는 혼합계산 연결 카드',
  'T-DV4':'교과 드릴을 재사용하는 나눗셈 확장 카드',
  'T-DV5':'교과 드릴을 재사용하는 큰 몫 연결 카드'
};
const DATA_SCRIPT=/^(?:engine\/(?:rng|generators)\.js|engine\/threads\/[^/]+\.js|data\/units\/[^/]+\.js|data\/(?:threads|middle-concepts|courses|roadmap|stages|labs|drill-topics)\.js)$/;
function scriptTags(html){
  const clean=html.replace(/<!--[\s\S]*?-->/g,'');
  return [...clean.matchAll(/<script\b([^>]*)>/gi)].flatMap(m=>{
    const src=/\bsrc\s*=\s*(["'])(.*?)\1/i.exec(m[1]);
    return src?[{src:src[2].split(/[?#]/)[0].replace(/^\.\//,''),delayed:/\b(?:async|defer)(?:\s|=|$)/i.test(m[1])}]:[];
  });
}
function check(options={}){
  const root=options.root||ROOT;
  const read=options.readFile||((f)=>fs.readFileSync(f,'utf8'));
  const exists=options.exists||fs.existsSync;
  const errors=[],warnings=[],counts={};
  const fail=(code,message)=>errors.push({code,message});
  const make=()=>{const w={console};w.window=w;return vm.createContext(w);};
  const run=(w,f)=>{try{vm.runInContext(read(path.join(root,f)),w,{filename:f,timeout:5000});}catch(e){fail('SCRIPT_EVAL',f+': '+e.message);}};
  const files=folder=>fs.readdirSync(path.join(root,folder)).filter(f=>f.endsWith('.js')).sort().map(f=>folder+'/'+f);
  const full=make();
  ['engine/rng.js','engine/generators.js',...files('engine/threads'),'data/threads.js','data/middle-concepts.js',...files('data/units'),
    'data/courses.js','data/roadmap.js','data/stages.js','data/labs.js','data/drill-topics.js'].forEach(f=>run(full,f));
  const U=full.NM_UNITS||{},T=full.NM_THREADS||{},C=Object.values(full.NM_COURSES||{}),chapters=full.NM_ROADMAP?.chapters||[],stages=full.NM_STAGES||[];
  const pages={};
  for(const page of ['index.html','drill.html','ws.html']){
    const w=make(),seen=new Set(),tags=scriptTags(read(path.join(root,page)));
    for(const tag of tags){
      if(/^(?:https?:)?\/\//.test(tag.src))continue;
      if(!exists(path.resolve(root,tag.src)))fail('SCRIPT_FILE',page+': '+tag.src);
      if(!DATA_SCRIPT.test(tag.src))continue;
      if(seen.has(tag.src))fail('SCRIPT_DUPLICATE',page+': '+tag.src);
      if(tag.delayed)fail('SCRIPT_ORDER',page+': data/engine script must be synchronous: '+tag.src);
      seen.add(tag.src);run(w,tag.src);
    }
    pages[page]=w;
    for(const id of Object.keys(full.NM_MIDDLE_CONCEPTS || {})){
      if(!w.NM_MIDDLE_CONCEPTS?.[id])fail('CONCEPT_NOT_LOADED',page+': '+id);
      if(!T[id])fail('CONCEPT_THREAD',id);
    }
    for(const [id,t] of Object.entries(T)){
      if(!w.NM_THREADS?.[id])fail('THREAD_NOT_LOADED',page+': '+id);
      if(typeof w.NM_TGEN?.[t.gen]!=='function')fail('GENERATOR_NOT_LOADED',page+': '+id+' / '+t.gen);
    }
    const required=page==='index.html'?['NM_UNITS','NM_COURSES','NM_ROADMAP','NM_STAGES','NM_LABS']:
      page==='drill.html'?['NM_DRILL_TOPICS']:['NM_COURSES','NM_STAGES','NM_LABS'];
    for(const key of required)if(!w[key])fail('PAGE_DATA',page+': '+key);
  }
  for(const id of Object.keys(U))if(!pages['index.html'].NM_UNITS?.[id])fail('UNIT_NOT_LOADED','index.html: '+id);
  const checkUnitGenerators=(value,where)=>{
    if(!value||typeof value!=='object')return;
    for(const [key,child] of Object.entries(value)){
      if(key==='generator'&&typeof child==='string'&&typeof pages['index.html'].NM_GEN?.[child]!=='function'&&typeof pages['index.html'].NM_TGEN?.[child]!=='function')
        fail('UNIT_GENERATOR',where+'.'+key+': '+child);
      if(child&&typeof child==='object')checkUnitGenerators(child,where+'.'+key);
    }
  };
  for(const [id,u] of Object.entries(U))checkUnitGenerators(u,id);
  if(!/var\s+TOPICS\s*=\s*window\.NM_DRILL_TOPICS\s*;/.test(read(path.join(root,'drill.html'))))
    fail('MENU_BINDING','drill.html must use NM_DRILL_TOPICS');

  const roadUnits=new Set(),paperUnits=new Set(),chapterIds=new Set(),courseIds=new Set();
  const localLink=(link,where)=>{
    if(typeof link!=='string'||!link.trim()){fail('LINK_INVALID',where);return;}
    if(/^https?:\/\//.test(link)){warnings.push('외부 링크 네트워크 확인 필요: '+link);return;}
    const target=path.resolve(root,link.split(/[?#]/)[0]);
    if(!exists(target)||(!path.extname(target)&&!exists(path.join(target,'index.html'))))fail('LINK_MISSING',where+': '+link);
  };
  const main=read(path.join(root,'app/main.js'));
  for(const ch of chapters){
    if(chapterIds.has(ch.id))fail('CHAPTER_DUPLICATE',ch.id);
    chapterIds.add(ch.id);
    const kinds=[!!ch.units?.length,!!ch.game,!!ch.link].filter(Boolean).length;
    if(kinds!==1)fail('CHAPTER_KIND',ch.id+': use one of units/game/link');
    if(ch.game&&!new RegExp("\\b(?:id|mg\\.id)\\s*===\\s*['\"]"+ch.game+"['\"]").test(main))fail('GAME_MISSING',ch.id+': '+ch.game);
    if(ch.link)localLink(ch.link,ch.id);
    for(const id of ch.units||[]){
      if(!U[id])fail('ROAD_UNIT_UNKNOWN',ch.id+': '+id);
      if(roadUnits.has(id))fail('ROAD_UNIT_DUPLICATE',ch.id+': '+id);
      roadUnits.add(id);
    }
  }
  const validLevel=(id,lv,where)=>{
    if(!T[id]){fail('THREAD_UNKNOWN',where+': '+id);return;}
    if(!T[id].levels.some(l=>l.id===lv))fail('LEVEL_UNKNOWN',where+': '+id+'@'+lv);
  };
  // buildCourses는 잘못된 레벨을 clamp하고 모르는 재료를 거른다. 원본 SPEC도 검사한다.
  for(const spec of full.NM_COURSE_SPEC||[]){
    for(const raw of [...(spec.drills||[]),...(spec.creative||[]),...(spec.perSessionDrills||[]).flat()]){
      const match=/^([A-Z]+\d+)(?:@(\d+))?$/.exec(raw);
      if(!match){fail('SPEC_REFERENCE','course '+spec.id+': '+raw);continue;}
      validLevel(match[1],match[2]?Number(match[2]):1,'course SPEC '+spec.id);
    }
    for(const id of (spec.magic||[]).flat())if(!U[id]&&!T[id])fail('MAGIC_UNKNOWN','course SPEC '+spec.id+': '+id);
  }
  for(const c of C){
    if(courseIds.has(c.order))fail('COURSE_DUPLICATE',String(c.order));
    courseIds.add(c.order);
    for(const s of c.sessions||[]){
      for(const id of s.magic||[]){
        if(U[id])paperUnits.add(id);
        else if(!T[id])fail('MAGIC_UNKNOWN','course '+c.order+': '+id);
      }
      for(const value of Object.values(s))if(Array.isArray(value))for(const d of value){
        if(d&&typeof d==='object'&&(d.t||d.thread))validLevel(d.t||d.thread,d.lv??d.level??1,'course '+c.order);
      }
    }
  }
  for(const id of Object.keys(U)){
    if(!roadUnits.has(id))fail('UNIT_NOT_IN_ROADMAP',id);
    if(!paperUnits.has(id)&&!STORY_ONLY[id])fail('UNIT_NOT_IN_COURSES',id);
  }
  for(const id of Object.keys(STORY_ONLY))if(!U[id]||paperUnits.has(id))fail('STALE_EXCEPTION',id);
  const chapterStages={},courseStages={},stageKeys=new Set();
  for(const st of stages){
    if(stageKeys.has(st.key))fail('STAGE_DUPLICATE',st.key);
    stageKeys.add(st.key);
    for(const id of st.chapters||[]){
      if(!chapterIds.has(id))fail('STAGE_CHAPTER_UNKNOWN',st.key+': '+id);
      (chapterStages[id]??=[]).push(st.key);
    }
    for(const c of C)if(c.order>=st.courses?.from&&c.order<=st.courses?.to)(courseStages[c.order]??=[]).push(st.key);
  }
  for(const id of chapterIds)if(chapterStages[id]?.length!==1)fail('CHAPTER_STAGE','exactly one stage required: '+id);
  for(const id of courseIds)if(courseStages[id]?.length!==1)fail('COURSE_STAGE','exactly one stage required: '+id);
  // 교과 과정과 개념 계보의 순서는 다를 수 있다. 재배치는 교육적 판단으로 남긴다.
  const differences=[];
  for(const c of C)for(const id of new Set((c.sessions||[]).flatMap(s=>s.magic||[]))){
    const ch=chapters.find(ch=>(ch.units||[]).includes(id));
    if(ch&&courseStages[c.order]?.[0]!==chapterStages[ch.id]?.[0])differences.push({unit:id,course:c.order,chapter:ch.id});
  }
  if(differences.length)warnings.push('과정/스토리 단계 차이 '+differences.length+'건 — 복습·전략 순서 포함, 편성 검토 대상');
  for(const lab of full.NM_LABS?.list||[])localLink(lab.file,'labs.list');
  for(const [id,links] of Object.entries(full.NM_LABS?.byUnit||{})){
    if(!U[id])fail('LAB_UNIT_UNKNOWN',id);
    for(const link of [].concat(links))localLink(link,'labs.byUnit '+id);
  }
  const menu=pages['drill.html'].NM_DRILL_TOPICS||[],menuKeys=new Set(),catIds=new Set();
  for(const cat of menu){
    if(catIds.has(cat.id))fail('MENU_CATEGORY_DUPLICATE',cat.id);
    catIds.add(cat.id);
    if(!['school','magic'].includes(cat.section))fail('MENU_SECTION',cat.id);
    for(const sub of cat.subs||[]){
      const key=sub.thread+'@'+sub.level;
      if(menuKeys.has(key))fail('MENU_DUPLICATE',key);
      menuKeys.add(key);validLevel(sub.thread,sub.level,'menu');
      if(!sub.label)fail('MENU_LABEL',key);
    }
  }
  for(const [id,t] of Object.entries(T))for(const lv of t.levels)if(!menuKeys.has(id+'@'+lv.id))fail('MENU_MISSING',id+'@'+lv.id);
  Object.assign(counts,{units:Object.keys(U).length,threads:Object.keys(T).length,levels:Object.values(T).reduce((n,t)=>n+t.levels.length,0),menu:menuKeys.size,chapters:chapters.length,courses:C.length,stageDifferences:differences.length});
  return {errors,warnings,counts};
}
function main(){
  const result=check();
  console.log(JSON.stringify(result.counts));
  for(const w of result.warnings)console.log('[검토] '+w);
  for(const e of result.errors)console.error('['+e.code+'] '+e.message);
  if(result.errors.length){process.exitCode=1;return;}
  console.log('통과 — index/drill/ws 로딩·과정·지도·단계·메뉴·실험실 연결');
  if(process.argv.includes('--self-test'))require('./check-roadmap-sync.test.js').run();
}
module.exports={check,scriptTags,ROOT};
if(require.main===module){try{main();}catch(e){console.error(e.stack);process.exitCode=1;}}
