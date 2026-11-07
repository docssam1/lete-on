import test from'node:test';import assert from'node:assert/strict';import{mountLifeCompare}from'./lab-life-compare.js';import{LIFE_EXPERIMENTS,LIFE_PLANS,lifeCompareRecord}from'./life-compare-model.js';
function host(){const events=new Map(),controls=new Map();return{innerHTML:'',events,addEventListener:(type,fn)=>events.set(type,fn),removeEventListener:(type,fn)=>{if(events.get(type)===fn)events.delete(type);},querySelector:s=>{if(!controls.has(s))controls.set(s,{disabled:false,focus(){}});return controls.get(s);},change:(field,value)=>events.get('change')?.({target:{value,matches:s=>s===`[data-life-compare-${field}]`}}),action:value=>events.get('click')?.({target:{closest:()=>({dataset:{lifeCompareAct:value}})}})};}
const record=h=>{h.change('judgment','unknown');h.action('reveal');h.action('record');};
test('판단 전 결과를 감추고 여덟 조건·계획을 모두 비교해야 완료를 전달한다',()=>{
 const h=host(),saved=[],handle=mountLifeCompare(h,{onRecord:(rows,info)=>saved.push({rows,info})});assert(h.innerHTML.includes('가상 자료 비교 0/8'));assert(!h.innerHTML.includes('5일 뒤 · 가상 자료'));h.action('reveal');assert(!h.innerHTML.includes('5일 뒤 · 가상 자료'));record(h);assert.equal(saved.length,1);assert.equal(saved[0].info.done,1);assert.equal(saved[0].info.complete,false);assert.equal(handle.rows[0].judgment,'unknown');h.action('record');assert.equal(saved.length,1);
 h.action('again');record(h);assert.equal(saved.length,2);assert.equal(saved[1].info.done,1);
 for(const experiment of Object.keys(LIFE_EXPERIMENTS))for(const plan of Object.keys(LIFE_PLANS)){h.change('experiment',experiment);h.change('plan',plan);record(h);}
 assert.equal(saved.at(-1).info.complete,true);assert.equal(saved.at(-1).info.done,8);assert(h.innerHTML.includes('가상 자료 비교 8/8'));assert(h.innerHTML.includes('다른 계획도 살펴보아요'));handle.dispose();assert.equal(h.events.size,0);
});
test('교사 화면은 학생의 행을 쓰지 않고 전달한 사본 변경은 내부 기록을 바꾸지 않는다',()=>{
 const row=lifeCompareRecord('germ-temp','mixed','no'),before=structuredClone(row),h=host();const handle=mountLifeCompare(h,{personal:false,rows:[row],onRecord:rows=>{rows[0].material.results[0][1]='5개';}});assert.equal(handle.rows.length,0);record(h);assert.equal(handle.rows[0].material.results[0][1],'0개');assert.deepEqual(row,before);handle.dispose();
});
test('유효한 가상 기록만 복구하며 정지·비활성·해제 뒤에는 기록하지 않는다',()=>{
 const row=lifeCompareRecord('germ-temp','mixed','no'),h=host();let active=true,calls=0;const handle=mountLifeCompare(h,{rows:[row,{...row,kind:'실제 관찰'}],isActive:()=>active,onRecord:()=>calls++});assert.equal(handle.rows.length,1);const clone=handle.rows;clone[0].material.results[0][1]='5개';assert.equal(handle.rows[0].material.results[0][1],'0개');
 handle.pause();record(h);assert.equal(calls,0);handle.resume();active=false;record(h);assert.equal(calls,0);active=true;record(h);assert.equal(calls,1);const click=h.events.get('click');handle.dispose();click({target:{closest:()=>({dataset:{lifeCompareAct:'record'}})}});assert.equal(calls,1);assert.equal(h.innerHTML,'');
});
test('서로 다른 창의 선택 상자 이름표는 고유하다',()=>{
 const a=host(),b=host(),x=mountLifeCompare(a),y=mountLifeCompare(b),ids=h=>[...h.innerHTML.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids(a).length,3);assert(ids(a).every(id=>!ids(b).includes(id)));for(const h of[a,b])for(const id of ids(h))assert(h.innerHTML.includes(`for="${id}"`));x.dispose();y.dispose();
});
