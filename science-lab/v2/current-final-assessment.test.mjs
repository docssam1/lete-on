import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {unit,items} from '../data/units/c22-s32-fin.js';
import {taxonomy} from '../data/units/c22-s32-fin.taxonomy.js';
import {similar} from '../data/units/c22-s32-fin.similar.js';
import {judge} from '../data/units/c22-s32-fin.judge.js';
import * as misc from '../data/units/c22-s32-fin.misc.js';
import {BANK} from './units-index.js';
import {assessmentsFor2022} from './curriculum-2022.js';
import {assessmentPool,assessmentRelated} from './assessment-data.js';
import {assessmentPaperHtml} from './assessment-paper.js';
import {gradeDaily,vocabOf} from './daily-grade.js';
const count=(rows,key)=>rows.reduce((a,q)=>(a[key(q)]=(a[key(q)]||0)+1,a),{});
test('현행3-2 기말60개는 네 단원·열두 기준·A/B 각30개를 따로 평가한다',()=>{
 assert.equal(items.length,60);assert.equal(new Set(items.map(q=>q.id)).size,60);
 assert.deepEqual(count(items,q=>q.sourceRef.set),{1:30,2:30});
 assert.deepEqual(count(items,q=>q.taxonomy.element),{E1:15,E2:15,E3:15,E4:15});
 assert.deepEqual(count(items,q=>q.responseContract),{'single-choice':40,'multi-choice':8,'short-text':8,'written-explanation':4});
 assert.equal(taxonomy.standards.length,12);assert.equal(new Set(items.map(q=>q.taxonomy.standard)).size,12);
 assert(Object.values(count(items,q=>q.taxonomy.standard)).every(n=>n===5));
 assert(Object.values(count(items,q=>q.taxonomy.type)).every(n=>n===5));
 for(const q of items){assert(q.taxonomy.topic&&q.taxonomy.concept&&q.taxonomy.inquirySkill);assert(q.explanation.length>20);assert.equal(q.status,'authored');}
 for(const q of items)for(const v of Object.values(q.givens||{}))if(v?.머리)assert.equal(v.caption,'가상 관찰 자료');
 const tx=JSON.parse(readFileSync(new URL('../bank/taxonomy/c22-s32-fin.json',import.meta.url)));assert.equal(tx.authoredTotal,60);assert.equal(tx.sourceTotal,0);
});
test('원문·짝을 만들지 않고 기존 평가와 별도 ID로 현행 범위를 연결한다',()=>{
 assert(!existsSync(new URL('../data/units/c22-s32-fin.source.js',import.meta.url)));
 assert.equal(similar.length,0);assert.deepEqual(taxonomy.sources,{});assert.equal(unit.sources.originalExamAvailable,false);
 const a=assessmentsFor2022('3-2',BANK);assert.equal(a.length,2);assert.equal(a[1].contentId,'c22-s32-fin');assert.match(a[1].scope,/물체와 물질.*지구와 바다.*소리의 성질.*감염병과 건강한 생활/);
 assert.equal(BANK['s32-mid'].n,40);assert.equal(BANK['s32-fin'].n,40);
 assert.deepEqual(assessmentPool({items,source:[]},BANK[unit.id]),items);
 for(const q of items)assert.equal(assessmentRelated(unit.id,BANK[unit.id],q),`#/c22-s32-u0${q.taxonomy.element.slice(1)}/3`);
});
test('40단일선택 위치·길이·60답 계약과 열린 설명의 교사 확인을 검증한다',()=>{
 const vocab=vocabOf(items,misc);
 for(const f of[1,2]){const pos=[0,0,0,0,0];for(const q of items.filter(q=>q.sourceRef.set===f&&q.responseContract==='single-choice')){const a=q.answerContract.answer;pos[a]++;for(const spaces of[true,false]){const len=q.choices.map(s=>(spaces?s:s.replace(/\s/g,'')).length);assert(len[a]<Math.max(...len.filter((_,i)=>i!==a))+3,q.id);}}assert.deepEqual(pos,[4,4,4,4,4]);}
 for(const q of items){const ac=q.answerContract,opts={misc,judge,vocab};assert.equal(gradeDaily(q,'',opts).status,'blank',q.id);const val=ac.answers||ac.sample||ac.answer;
  assert.equal(gradeDaily(q,val,opts).status,ac.type==='written-explanation'?'review':'correct',q.id);
  if(ac.type==='single-choice')assert.equal(gradeDaily(q,(ac.answer+1)%5,opts).status,'wrong');
  if(ac.type==='multi-choice'){assert.equal(gradeDaily(q,[ac.answers[0]],opts).status,'wrong');assert.equal(gradeDaily(q,[...ac.answers,([0,1,2,3,4].find(i=>!ac.answers.includes(i)))],opts).status,'wrong');}
  if(ac.type==='short-text')for(const val of ac.accepted)assert.equal(gradeDaily(q,val,opts).status,'correct');
  if(ac.type==='written-explanation'){assert(judge[q.id].open);assert.equal(judge[q.id].need.length,0);assert.equal(gradeDaily(q,'근거를 더 확인해야 하는 새로운 설명',opts).status,'review');}
 }
});
test('기말 인쇄 제목·학기·범위와 답 분리를 설정에서 읽고 3-1 기말은 유지한다',()=>{
 for(const form of[1,2]){const list=items.filter(q=>q.sourceRef.set===form);const args={unit:unit.id,bank:BANK[unit.id],list,form};const student=assessmentPaperHtml(args),teacher=assessmentPaperHtml({...args,teacher:true});
 assert(student.includes('기말평가 · 창작'));assert(student.includes('3학년 2학기'));assert(!student.includes('3학년 1학기'));assert(student.includes('학교별 공식 시험 범위와 별개'));assert(!student.includes('class="ap-key"'));assert.equal((teacher.match(/class="ap-key"/g)||[]).length,30);assert.equal((student.match(/class="ap-writing"/g)||[]).length,2);
 const escaped=assessmentPaperHtml({...args,bank:{...BANK[unit.id],label:'<script>x</script>',scope:['<img>'],courseLabel:'<iframe>'}});assert(!escaped.includes('<script>'));assert(!escaped.includes('<img>'));assert(!escaped.includes('<iframe>'));
 }
 const old=assessmentPaperHtml({unit:'s31-fin',bank:BANK['s31-fin'],list:[],form:1});assert(old.includes('기말평가 · 창작'));assert(old.includes('3학년 1학기'));assert(old.includes('생물의 한살이'));assert(!old.includes('학교별 공식 시험 범위와 별개'));
});
