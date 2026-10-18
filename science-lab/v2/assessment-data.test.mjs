import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {unit,items} from '../data/units/s31-fin.js';
import {source} from '../data/units/s31-mid.source.js';
import {similar} from '../data/units/s31-fin.similar.js';
import {taxonomy} from '../data/units/s31-fin.taxonomy.js';
import {judge} from '../data/units/s31-fin.judge.js';
import * as misc from '../data/units/s31-fin.misc.js';
import {BANK} from './units-index.js';
import {assessmentPool,assessmentRelated} from './assessment-data.js';
import {assessmentPaperHtml} from './assessment-paper.js';
import {curriculumBankHtml} from './bank-catalog.js';
import {gradeDaily,vocabOf} from './daily-grade.js';
import {judgeText} from './judge.js';
const count=(rows,key)=>rows.reduce((m,q)=>(m[key(q)]=(m[key(q)]||0)+1,m),{});

test('창작 기말 60개를 A/B 각 30개·단원별 15개·유형별 5개로 구성한다',()=>{
 assert.equal(items.length,60);assert.equal(new Set(items.map(q=>q.id)).size,60);
 assert.deepEqual(count(items,q=>q.sourceRef.set),{1:30,2:30});
 assert.deepEqual(count(items,q=>q.taxonomy.element),{E1:15,E2:15,E3:15,E4:15});
 const publicTax=JSON.parse(readFileSync(new URL('../bank/taxonomy/s31-fin.json',import.meta.url)));assert.equal(publicTax.sourceTotal,0);assert.equal(publicTax.authoredTotal,60);assert.deepEqual(publicTax.authoredFormatCounts,{'선택형':48,'단답형':8,'서술형':4});assert(publicTax.types.every(t=>t.authoredCount===5));
 assert.equal(taxonomy.types.length,12);assert(Object.values(count(items,q=>q.taxonomy.type)).every(n=>n===5));
 assert.deepEqual(count(items,q=>q.responseContract),{'single-choice':40,'multi-choice':8,'short-text':8,'written-explanation':4});
 const standards=new Set(taxonomy.standards.map(s=>s.code));assert.equal(standards.size,13);assert.equal(new Set(items.map(q=>q.taxonomy.standard)).size,13);
 for(const q of items){assert(standards.has(q.taxonomy.standard));assert.equal(taxonomy.authored[q.id],q.taxonomy.type);assert.equal(q.status,'authored');}
});

test('존재하지 않는 원문이나 1:1 짝을 만들지 않고 실제 원문 경로를 유지한다',()=>{
 assert(!existsSync(new URL('../data/units/s31-fin.source.js',import.meta.url)));
 assert.equal(unit.sources.originalExamAvailable,false);assert.equal(similar.length,0);assert.deepEqual(taxonomy.sources,{});
 assert.equal(BANK['s31-fin'].n,0);assert.equal(BANK['s31-fin'].authored,60);
 assert.equal(assessmentPool({source,items},BANK['s31-fin']).length,60);
 assert.equal(assessmentPool({source,items},BANK['s31-mid']),source);
 assert.deepEqual(assessmentPool({source,items:[{status:'verified',sourceRef:{type:'original'}},{status:'authored',sourceRef:{type:'authored-practice'}}]},BANK['s31-fin']),[]);
 for(const q of items){assert.equal(q.sourceRef.type,'authored-assessment');assert(!q.sourceRef.of);}
 const html=curriculumBankHtml(BANK);assert(html.includes('창작 60문항'));assert(html.includes('원문 1298문항'));assert(!html.includes('원문 491문항'));
});

test('고르기 정답 위치·길이와 모든 답 형식의 실제 판정을 검증한다',()=>{
 const vocab=vocabOf(items,misc);
 for(const form of[1,2]){const pos=Array(5).fill(0);for(const q of items.filter(q=>q.sourceRef.set===form&&q.responseContract==='single-choice')){const a=q.answerContract.answer;pos[a]++;for(const spaces of[true,false]){const len=q.choices.map(s=>(spaces?s:s.replace(/\s/g,'')).length);assert(len[a]<Math.max(...len.filter((_,i)=>i!==a))+3,q.id);}}assert.deepEqual(pos,[4,4,4,4,4]);}
 for(const q of items){const ac=q.answerContract,key=judge[q.id],value=ac.answers||ac.sample||ac.answer;assert.equal(gradeDaily(q,value,{misc,judge,vocab}).status,'correct',q.id);assert.equal(gradeDaily(q,'',{misc,judge,vocab}).status,'blank');
 if(ac.type==='multi-choice'){assert.equal(ac.answers.length,2);assert.equal(new Set(ac.answers).size,2);assert.equal(gradeDaily(q,[ac.answers[0]],{misc,judge,vocab}).status,'wrong');}
 if(ac.type==='short-text'){for(const a of ac.accepted)assert.equal(gradeDaily(q,a,{misc,judge,vocab}).status,'correct');assert.equal(gradeDaily(q,'알 수 없는 말',{misc,judge,vocab}).status,'review');}
 if(key){assert.equal(key.need.length,1);for(const tries of[1,2]){for(const a of key.ex.ok)assert.equal(judgeText(a,key,{tries}).st,'ok',q.id+' '+a);for(const a of key.ex.no)assert.notEqual(judgeText(a,key,{tries}).st,'ok',q.id+' '+a);}}
 }
});

test('기말·중간의 관련 학습은 해당 실제 단원으로 돌아간다',()=>{
 for(const q of items)assert.equal(assessmentRelated('s31-fin',BANK['s31-fin'],q),`#/s31-u0${q.taxonomy.element.slice(1)}/3`);
 for(const q of source)assert.equal(assessmentRelated('s31-mid',BANK['s31-mid'],q),`#/s31-u0${q.taxonomy.element.slice(1)}/3`);
 assert.equal(assessmentRelated('s31-u03',BANK['s31-u03'],{taxonomy:{element:'E3'}}),'#/s31-u03/3');
});

test('학생 문제지와 교사 해설은 답·쓰기 공간·출처를 구분한다',()=>{
 for(const form of[1,2]){const list=items.filter(q=>q.sourceRef.set===form),student=assessmentPaperHtml({unit:unit.id,bank:BANK[unit.id],list,form}),teacher=assessmentPaperHtml({unit:unit.id,bank:BANK[unit.id],list,form,teacher:true});assert.equal((student.match(/data-paper-item=/g)||[]).length,30);assert.equal((teacher.match(/class="ap-key"/g)||[]).length,30);assert(!student.includes('class="ap-key"'));assert.equal((student.match(/class="ap-writing"/g)||[]).length,2);assert.equal((student.match(/class="ap-short"/g)||[]).length,4);assert(student.includes('직접 작성한 평가'));assert(teacher.includes('공식 배점표로 사용하지'));assert(student.includes('GFIELD · 지필드'));}
 const q={...items[0],prompt:'<script>notExecutable</script>',choices:['<img onerror="1">']};const h=assessmentPaperHtml({unit:unit.id,bank:BANK[unit.id],list:[q],form:1});assert(!h.includes('<script>'));assert(!h.includes('<img'));assert(h.includes('&lt;script&gt;'));
});
