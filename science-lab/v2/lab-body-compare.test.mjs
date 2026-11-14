import test from'node:test';import assert from'node:assert/strict';import{mountBodyCompare}from'./lab-body-compare.js';import{BODY_CASE_IDS,bodyCompareRecord}from'./body-compare-model.js';
import{bodyCase}from'./body-compare-model.js';import{workbook}from'../data/book/c22-s51-u04.workbook.js';
function host(){const events=new Map(),controls=new Map();return{innerHTML:'',events,addEventListener:(t,f)=>events.set(t,f),removeEventListener:(t,f)=>{if(events.get(t)===f)events.delete(t);},querySelector:s=>{if(!controls.has(s))controls.set(s,{disabled:false,focus(){}});return controls.get(s);},change:(field,value)=>events.get('change')?.({target:{value,matches:s=>s===`[data-body-compare-${field}]`}}),action:value=>events.get('click')?.({target:{closest:()=>({dataset:{bodyCompareAct:value}})}})};}
const save=h=>{h.change('prediction','unknown');h.action('reveal');h.action('record');};
test('사진·경로 그림을 먼저 살피고 생각을 고른 뒤에 설명과 사진 설명을 연다',()=>{
 const h=host(),handle=mountBodyCompare(h);
 for(const id of BODY_CASE_IDS){h.change('case',id);const m=bodyCase(id);assert(!h.innerHTML.includes(m.reason));assert(!h.innerHTML.includes('<figcaption'));assert(!h.innerHTML.includes('<p class="ed-photo-note">'));
  if(m.figureKey){const html=workbook.figures[m.figureKey],image=html.match(/<img[^>]+src="([^"]+)"/)?.[1];if(image)assert(h.innerHTML.includes(image));else assert(h.innerHTML.includes('<svg'));const caption=html.match(/<(?:figcaption|p class="ed-photo-note")[^>]*>([\s\S]*?)<\/(?:figcaption|p)>/)?.[1];if(caption){assert(!h.innerHTML.includes('>'+caption+'<'),id);h.change('prediction','unknown');h.action('reveal');assert(h.innerHTML.includes('>'+caption+'<'));}}
  h.change('prediction','unknown');h.action('reveal');assert(h.innerHTML.includes(m.reason));
 }
 handle.dispose();
});
test('먼저 판단한 뒤 조건의 근거를 열고 여덟 자료를 모두 비교해야 완료한다',()=>{
 const h=host(),saved=[],handle=mountBodyCompare(h,{onRecord:(rows,info)=>saved.push({rows,info})});assert(!h.innerHTML.includes('자료를 살펴보면'));h.action('reveal');h.action('record');assert.equal(saved.length,0);h.change('prediction','unknown');h.action('reveal');h.change('prediction','all');h.action('record');assert.equal(handle.rows[0].prediction,'unknown');h.action('record');assert.equal(saved.length,1);h.action('again');save(h);assert.equal(saved.at(-1).info.done,1);for(const id of BODY_CASE_IDS){h.change('case',id);save(h);}assert.equal(saved.at(-1).info.complete,true);assert(h.innerHTML.includes('직접 관찰하고 모형을 만들며 건강한 생활도 실천해요'));assert(h.innerHTML.includes('직접 관찰하고 모형을 만든 결과와도 비교해 보아요'));handle.dispose();assert.equal(h.events.size,0);
});
test('교사는 학생 행에 접근하지 않고 복구·조회·콜백도 원본 사본을 보존한다',()=>{
 const a=host(),teacher=mountBodyCompare(a,{personal:false,get rows(){throw Error('학생 행 접근 금지');}});assert.equal(teacher.rows.length,0);teacher.dispose();const row=bodyCompareRecord('movement','compare'),h=host(),handle=mountBodyCompare(h,{rows:[row,{...row,kind:'직접 실험'}],onRecord:rows=>{rows[0].material.rows[0][1]='999g';}});assert.equal(handle.rows.length,1);row.material.rows[0][1]='999g';assert.equal(handle.rows[0].material.rows[0][1],'두 용수철이 놓인 모양과 길이');const copy=handle.rows;copy[0].prediction='bone';assert.equal(handle.rows[0].prediction,'compare');save(h);assert.equal(handle.rows[0].material.rows[0][1],'두 용수철이 놓인 모양과 길이');handle.dispose();
});
test('정지·비활성·해제 뒤에는 기록하지 않고 선택 상자 이름표는 고유하다',()=>{
 let active=true,calls=0;const a=host(),b=host(),x=mountBodyCompare(a,{isActive:()=>active,onRecord:()=>calls++}),y=mountBodyCompare(b),ids=h=>[...h.innerHTML.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids(a).length,2);assert(ids(a).every(id=>!ids(b).includes(id)));for(const id of ids(a))assert(a.innerHTML.includes(`for="${id}"`));x.pause();save(a);assert.equal(calls,0);x.resume();active=false;save(a);assert.equal(calls,0);active=true;save(a);assert.equal(calls,1);const click=a.events.get('click');x.dispose();click({target:{closest:()=>({dataset:{bodyCompareAct:'again'}})}});assert.equal(a.innerHTML,'');assert.equal(calls,1);y.dispose();
});
