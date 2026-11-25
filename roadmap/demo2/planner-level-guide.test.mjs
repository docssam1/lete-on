import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';

const listeners={};
const window={document:{addEventListener(type,handler){listeners[type]=handler;}}};
const ctx=vm.createContext({window});
for(const filename of ['planner-levels.js','planner-standard-data.js','planner-academy-data.js','planner-level-guide.js']){
 vm.runInContext(readFileSync(new URL(filename,import.meta.url),'utf8'),ctx,{filename});
}
const guide=window.PlannerLevelGuide;

test('ages use calendar years and elementary grades keep January and February in the same school year',()=>{
 assert.equal(guide.monthOf('pre:4',1),-12);
 assert.equal(guide.monthOf('pre:7',11),34);
 assert.equal(guide.monthOf('grade:2',3),50);
 assert.equal(guide.monthOf('grade:2',1),60);
 assert.equal(guide.monthOf('grade:2',2),61);
 assert.equal(guide.monthOf('grade:3',3),62);
 assert.equal(guide.monthOf('grade:7',3),null);
 const fallback=guide.model({learner:'grade:7',month:13});
 assert.equal(fallback.label,'7세 11월');
});

test('an identical L-number names the exact age- or grade-specific course and books',()=>{
 const preschool=guide.model({learner:'pre:7',month:11});
 const elementary=guide.model({learner:'grade:2',month:3});
 assert.equal(preschool.rows.map(row=>row.id).join(','),Array.from({length:14},(_,i)=>'L'+i).join(','));
 const young=preschool.rows.find(row=>row.id==='L7');
 assert.equal(young.name,'초등 2-1 교과');
 assert.equal(young.books.comp,'초등팩토 1 PRE 1031 기본');
 const older=elementary.rows.find(row=>row.id==='L7');
 assert.equal(older.name,'초등 5-1 교과');
 assert.equal(older.books.comp,'1031 초급');
 assert.equal(older.books.calc,'기적의 계산법 9');
 assert.equal(guide.describe('L7',preschool.at),young.name);
 assert.equal(guide.describe('L7',elementary.at),older.name);
});

test('real gaps stay blank and a separately recorded depth course remains visible',()=>{
 const data=guide.model({learner:'pre:7',month:11});
 const depth=data.rows.find(row=>row.id==='L10');
 assert.equal(depth.books.school,'');
 assert.equal(depth.books.depth,'1-2 심화 (최상위 수학)');
 assert.equal(depth.name,'초등 1-2 심화');
 const earlier=guide.model({learner:'pre:7',month:3});
 assert.equal(earlier.rows.find(row=>row.id==='L13').name,'이 시기 자료 없음');
 assert.match(guide.render({learner:'pre:4',month:1}),/4세 1월 기준표에 기록된 과정이 없습니다/);
});

test('the controls and table expose readable labels and support compact source-only use',()=>{
 const html=guide.render({learner:'grade:2',month:3,open:true});
 assert.match(html,/<details class="level-guide" open>/);
 assert.match(html,/<label>나이 또는 학년<select data-level-guide-learner>/);
 assert.match(html,/<option value="grade:2" selected>초2<\/option>/);
 assert.match(html,/<caption>초2 3월 기준<\/caption>/);
 assert.match(html,/<th scope="row"><strong>초등 5-1 교과<\/strong> <small class="level-guide-code">L7<\/small>/);
 assert.match(html,/<th scope="col">교과 심화<\/th>/);
 assert.equal(guide.model({details:null}).columns.some(([id])=>id==='depth'),false);
});

test('an embedded guide uses the result screen’s existing disclosure and learner',()=>{
 const html=guide.render({learner:'grade:3',month:11,embedded:true});
 assert.doesNotMatch(html,/<details|<summary/);
 assert.match(html,/<option value="grade:3" selected>초3<\/option>/);
 assert.match(html,/<caption>초3 11월 기준<\/caption>/);
});
test('benchmark names and month gaps use the separate Premier1 middle-school entry milestone',()=>{
 const model=guide.model({learner:'pre:7',month:11});
 assert.equal(model.premierStart,51);
 assert.deepEqual(Array.from(model.rows.slice(0,5),r=>r.benchmark.difference),[8,5,2,-1,-4]);
 assert.equal(model.rows[2].benchmark.name,'챌린지 합격 후 진도');
 assert.equal(model.rows[5].benchmark,null);
 const html=guide.render();
 assert.match(html,/중1-1 시작 시점/);
 assert.match(html,/프리미어1보다 8개월 빠름/);
 assert.match(html,/프리미어1보다 1개월 늦음/);
 assert.match(html,/goal=contest">이후 KMO 준비/);
 assert.match(html,/admissions=private">자사고 지원 조건·합격 준비/);
 assert.equal(guide.model({academy:{}}).rows[0].benchmark.difference,null);
});

test('changing a selector refreshes both caption and rows without replacing the controls',()=>{
 const elements={
  '[data-level-guide-learner]':{value:'grade:2'},
  '[data-level-guide-month]':{value:'3'},
  '.level-guide-selection':{},
  'caption':{},
  'tbody':{}
 };
 const root={querySelector(selector){return elements[selector];}};
 listeners.change({target:{matches(){return true;},closest(){return root;}}});
 assert.equal(elements['.level-guide-selection'].textContent,'초2 3월 기준의 참고 진도');
 assert.equal(elements.caption.textContent,'초2 3월 기준');
 assert.match(elements.tbody.innerHTML,/중2-1 교과/);
 assert.equal(elements['[data-level-guide-month]'].value,'3');
});
