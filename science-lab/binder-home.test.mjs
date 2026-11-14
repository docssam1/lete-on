import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {binderResources,filterBinderResources,defaultBinderResource,binderPreviewHtml,mountBinderHome} from './binder-home.js';
import {ORDERED,DOMAINS,LEVELS,CONTESTS,domainOf,levelOf,contestsOf} from './data/curriculum.js';
import {OBSERVE_SETS} from './data/observe-sets.js';

// Event/HTML collection only; this fixture does not emulate browser layout.
class Element {
 constructor(dataset={}){this.dataset=dataset;this.events=new Map();this.attributes={};this.value='';this.textContent='';this.html='';this.buttons=[];this.focused=false;}
 set innerHTML(html){
  this.html=html;
  this.buttons=[...html.matchAll(/data-resource-key="([^"]+)"/g)].map(match=>new Element({resourceKey:match[1]}));
 }
 get innerHTML(){return this.html;}
 addEventListener(type,handler){if(!this.events.has(type))this.events.set(type,new Set());this.events.get(type).add(handler);}
 removeEventListener(type,handler){this.events.get(type)?.delete(handler);}
 emit(type,event={}){for(const handler of this.events.get(type)||[])handler({target:this,preventDefault(){},...event});}
 setAttribute(key,value){this.attributes[key]=value;}
 focus(){this.focused=true;}
 closest(selector){return selector==='[data-resource-key]'&&this.dataset.resourceKey||selector==='[data-binder-reset]'&&this.dataset.binderReset?this:null;}
 querySelectorAll(selector){assert.equal(selector,'[data-resource-key]');return this.buttons;}
}
function host(){
 const root=new Element();
 root.nodes=new Map(['.binder-list','#binder-content','.binder-search input','.binder-result','.binder-skip'].map(key=>[key,new Element()]));
 root.querySelector=selector=>{const key=selector==='.binder-content'?'#binder-content':selector;assert(root.nodes.has(key),selector);return root.nodes.get(key);};
 root.querySelectorAll=selector=>{
  if(selector==='[data-domain]')return root.domains??=(['',...DOMAINS.map(d=>d.id)].map(domain=>new Element({domain})));
  if(selector==='[data-filter]')return root.filters??=['kind','level','contest'].map(filter=>new Element({filter}));
  throw Error(selector);
 };
 return root;
}
function mount(){
 const originalDocument=globalThis.document,originalLocation=globalThis.location;
 const doc=new Element(),location={hash:'#/'},root=host();
 const state=Object.fromEntries(ORDERED.map((unit,i)=>[unit.id,{quizBest:i===1?2:0,updatedAt:i===1?20:0,report:{sentinel:'preserve actual activity'},videoDone:false}]));
 const before=JSON.stringify(state),reads=new Map();
 globalThis.document=doc;globalThis.location=location;
 const dispose=mountBinderHome(root,{store:{unit:id=>{reads.set(id,(reads.get(id)||0)+1);return state[id];},patch(){throw Error('Browsing must not write');}},footer:()=>'<footer>기존 안내</footer>'});
 return {root,doc,location,dispose,state,reads,unchanged:()=>assert.equal(JSON.stringify(state),before),close(){dispose();if(originalDocument===undefined)delete globalThis.document;else globalThis.document=originalDocument;if(originalLocation===undefined)delete globalThis.location;else globalThis.location=originalLocation;}};
}
test('원래15자료와 자연관찰8세트의 ID·경로·수준·영역·대회 연결을 보존한다',()=>{
 assert.equal(binderResources.length,ORDERED.length+OBSERVE_SETS.length);
 assert.equal(new Set(binderResources.map(r=>r.key)).size,23);
 for(const unit of ORDERED){const r=binderResources.find(r=>r.unit===unit);assert.equal(r.href,'#/u/'+unit.id);assert.equal(r.domain,domainOf(unit).id);assert.equal(r.level,levelOf(unit).id);assert.deepEqual(r.contests,contestsOf(unit).map(c=>c.id));}
 for(const set of OBSERVE_SETS){const r=binderResources.find(r=>r.set===set);assert.equal(r.href,'#/observe/'+set.id);assert.equal(r.level,set.level);assert.deepEqual(r.contests,['nature']);}
 assert.notEqual(defaultBinderResource().unit.part,'A');
 assert.equal(defaultBinderResource([]),undefined);
});
test('영역·수준·대회·자료 필터를 함께 적용하고 검색은 여러 낱말과 공백을 읽는다',()=>{
 for(const domain of DOMAINS)for(const level of LEVELS)for(const contest of CONTESTS){
  const actual=filterBinderResources({domain:domain.id,level:level.id,contest:contest.id});
  const expected=binderResources.filter(r=>r.domain===domain.id&&r.level===level.id&&r.contests.includes(contest.id));
  assert.deepEqual(new Set(actual.map(r=>r.key)),new Set(expected.map(r=>r.key)));
 }
 assert.equal(filterBinderResources({kind:'observe'}).length,OBSERVE_SETS.length);
 assert(filterBinderResources({query:'  곤충  장소  '}).some(r=>r.id==='observe-insects'));
 assert.deepEqual(filterBinderResources({query:'　곤충　장소　'}),filterBinderResources({query:'곤충 장소'}));
 assert.equal(filterBinderResources({query:'없는검색어<test>'}).length,0);
 const nature=filterBinderResources({contest:'nature'});assert(nature.slice(0,OBSERVE_SETS.length).every(r=>r.kind==='observe'));
});
test('모든 미리보기의 실험·관찰·보고서 경로가 열리고 기록 없음은 완료로 표시하지 않는다',()=>{
 for(const r of binderResources){
  const html=binderPreviewHtml(r,{quizBest:'<img src=x>',videoDone:true});
  assert(html.includes(`href="${r.href}"`));assert(!html.includes('undefined'));assert(!html.includes('[object Object]'));assert(!html.includes('<img src=x>'));
  if(r.kind==='unit'){assert(html.includes(`href="#/u/${r.id}/report"`));assert(html.includes('확인 문제 기록 없음'));assert(html.includes('실험 장면 봄'));}
  else assert(!html.includes('확인 문제 최고'));
  assert(!html.includes('<svg'));assert(!html.includes('완료'));
 }
 assert(binderPreviewHtml(null).includes('찾는 자료가 없어요'));
 const html=binderPreviewHtml(defaultBinderResource(),{quizBest:0});assert(html.includes('최고 0/3'));
});
test('실제 선택·검색·필터·빈 결과 복구는 진도나 URL을 바꾸지 않고 열기만 기존 경로로 이동한다',()=>{
 const mounted=mount();try{
  const {root,location}=mounted,list=root.querySelector('.binder-list'),content=root.querySelector('#binder-content'),input=root.querySelector('.binder-search input');
  assert.equal(list.buttons.length,23);assert(root.innerHTML.includes('href="./v2/#/"'));assert(root.innerHTML.includes('href="#/field"'));
  for(const c of CONTESTS)assert(root.innerHTML.includes(`href="#/contest/${c.id}"`));
  const observation=list.buttons.find(b=>b.dataset.resourceKey==='observe:observe-insects');list.emit('click',{target:observation});
  assert(content.innerHTML.includes('observe:observe-insects'));assert.equal(location.hash,'#/');
  input.emit('keydown',{key:'Enter'});assert.equal(location.hash,'#/observe/observe-insects');location.hash='#/';
  const kind=root.filters.find(s=>s.dataset.filter==='kind');kind.value='observe';kind.emit('change');assert.equal(list.buttons.length,8);
  input.value='없는 검색어';input.emit('input');assert.equal(list.buttons.length,0);assert(content.innerHTML.includes('찾는 자료가 없어요'));
  list.emit('click',{target:new Element({binderReset:true})});assert.equal(list.buttons.length,23);assert.equal(input.value,'');assert.equal(kind.value,'');
  assert.equal(location.hash,'#/');mounted.unchanged();assert.equal(mounted.reads.size,ORDERED.length);assert([...mounted.reads.values()].every(n=>n===1));
 }finally{mounted.close();}
});
test('키보드로 자료를 고르고 건너뛰며 해제 뒤 남은 콜백은 동작하지 않는다',()=>{
 const mounted=mount();try{
  const {root,doc,location}=mounted,list=root.querySelector('.binder-list'),input=root.querySelector('.binder-search input'),content=root.querySelector('#binder-content');
  list.emit('keydown',{target:list.buttons[0],key:'End'});assert(list.buttons.at(-1).focused);assert(content.innerHTML.includes(list.buttons.at(-1).dataset.resourceKey));
  doc.emit('keydown',{ctrlKey:true,key:'/'});assert(input.focused);
  root.querySelector('.binder-skip').emit('click');assert(content.focused);
  const late=[...input.events.get('keydown')][0],before=content.innerHTML;
  mounted.dispose();assert([...doc.events.values()].every(handlers=>handlers.size===0));
  late({key:'Enter'});assert.equal(location.hash,'#/');assert.equal(content.innerHTML,before);mounted.unchanged();
 }finally{mounted.close();}
});
test('앱의 실제 홈 함수가 서류철 마운트와 해제 핸들러를 연결한다',()=>{
 const source=fs.readFileSync(new URL('./app.js',import.meta.url),'utf8');
 const body=source.slice(source.indexOf('function renderHome()'),source.indexOf('function renderUnit(u)'));
 const mounted=mount();mounted.dispose();
 try{
  const context=vm.createContext({mountBinderHome,$app:mounted.root,store:{unit:()=>({})},footer:()=>''});
  const off=new vm.Script('let homeOff;\n'+body+'\nrenderHome();homeOff;').runInContext(context);
  assert.equal(typeof off,'function');assert(mounted.root.innerHTML.includes('나의 과학 서류철'));assert.equal(mounted.root.querySelector('.binder-list').buttons.length,23);off();
 }finally{mounted.close();}
});
