import test from'node:test';import assert from'node:assert/strict';
import{mountAnimalCompare}from'./lab-animal-compare.js';import{classifyRecord}from'./animal-classify.js';
function host(){
 const events=new Map(),controls=new Map();return{innerHTML:'',events,
 addEventListener(type,fn){events.set(type,fn);},removeEventListener(type,fn){if(events.get(type)===fn)events.delete(type);},
 querySelector(selector){if(!controls.has(selector))controls.set(selector,{disabled:false,focus(){}});return controls.get(selector);},
 criterion(value){events.get('change')?.({target:{value,matches:s=>s==='[data-animal-criterion]'}});},
 place(id,value){events.get('change')?.({target:{value,dataset:{animalPlace:id},matches:s=>s==='[data-animal-place]'}});},
 action(value){events.get('click')?.({target:{closest:()=>({dataset:{animalCompareAct:value}})}});},
 };
}
const choose=(h)=>{for(const id of['pigeon','bat','dragonfly','tiger'])h.place(id,'unknown');};
test('자료는 먼저 분류한 뒤 열리며 같은 기준 두 번은 두 기준 완료가 아니다',()=>{
 const h=host(),records=[],handle=mountAnimalCompare(h,{onRecord:(rows,info)=>records.push({rows,info})});
 assert(!h.innerHTML.includes('data-animal-fact='));h.action('observe');assert(!h.innerHTML.includes('data-animal-fact='));
 choose(h);h.action('observe');assert.equal((h.innerHTML.match(/data-animal-fact=/g)||[]).length,4);assert(h.innerHTML.includes('오답으로 채점하지 않아요'));
 h.action('record');assert.equal(records.length,1);assert.equal(records[0].info.complete,false);assert.equal(handle.rows[0].placements.pigeon,'unknown');
 h.action('record');assert.equal(records.length,1);
 h.action('again');choose(h);h.action('observe');h.action('record');assert.equal(records.length,2);assert.equal(records[1].info.complete,false);
 h.criterion('feathers');assert(!h.innerHTML.includes('data-animal-fact='));choose(h);h.action('observe');h.action('record');assert.equal(records.length,3);assert.equal(records[2].info.complete,true);
 assert.deepEqual(handle.rows.map(r=>r.criterion),['wings','wings','feathers']);handle.dispose();assert.equal(h.events.size,0);assert.equal(h.innerHTML,'');
});
test('교사 화면에는 학생 기록을 넣지 않고 부모에게 전달하는 기록은 사본이다',()=>{
 const existing=classifyRecord('feathers',{pigeon:'yes',bat:'no',dragonfly:'no',tiger:'no'}),before=structuredClone(existing),h=host();
 const handle=mountAnimalCompare(h,{personal:false,rows:[existing],onRecord:rows=>{rows[0].placements.pigeon='no';}});assert.equal(handle.rows.length,0);choose(h);h.action('observe');h.action('record');assert.equal(handle.rows[0].placements.pigeon,'unknown');assert.deepEqual(existing,before);handle.dispose();
});
test('유효한 저장 기록만 복구하고 일시정지·비활성·해제 뒤에는 기록하지 않는다',()=>{
 const valid=classifyRecord('feathers',{pigeon:'yes',bat:'unknown',dragonfly:'no',tiger:'no'}),h=host();let active=true,calls=0;
 const handle=mountAnimalCompare(h,{rows:[valid,{...valid,groups:{}}],isActive:()=>active,onRecord:()=>calls++});assert.equal(handle.rows.length,1);
 const snapshot=handle.rows;snapshot[0].placements.pigeon='no';assert.equal(handle.rows[0].placements.pigeon,'yes');
 handle.pause();choose(h);h.action('observe');assert(!h.innerHTML.includes('data-animal-fact='));handle.resume();
 active=false;choose(h);h.action('observe');assert(!h.innerHTML.includes('data-animal-fact='));active=true;choose(h);h.action('observe');h.action('record');assert.equal(calls,1);
 const click=h.events.get('click');handle.dispose();click({target:{closest:()=>({dataset:{animalCompareAct:'record'}})}});assert.equal(calls,1);
});
test('사진 자료 여러 창의 선택 상자 이름표가 겹치지 않는다',()=>{
 const a=host(),b=host(),x=mountAnimalCompare(a),y=mountAnimalCompare(b);const ids=h=>[...h.innerHTML.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert(ids(a).length>=5);assert(ids(a).every(id=>!ids(b).includes(id)));for(const h of[a,b])for(const id of ids(h))assert(h.innerHTML.includes(`for="${id}"`));x.dispose();y.dispose();
});
