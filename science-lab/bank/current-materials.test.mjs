import test from 'node:test';
import assert from 'node:assert/strict';
import {items,unit} from '../data/units/c22-s32-u01.js';
import {source} from '../data/units/c22-s32-u01.source.js';
import {source as legacySource} from '../data/units/s32-u04.source.js';
import {similar} from '../data/units/c22-s32-u01.similar.js';
import {similar as legacySimilar} from '../data/units/s32-u04.similar.js';
import {taxonomy} from '../data/units/c22-s32-u01.taxonomy.js';
import {judge} from '../data/units/c22-s32-u01.judge.js';
// 2026-10-20: 기본 수업은 사고력 수업(v2/think-lessons.test.mjs)으로 바뀌었다. 여기서는 선택 기능으로 옮긴 탐구 기록장·기록 교재(records)가 예전대로 동작하는지 본다.
import {recordsLesson as lesson} from '../data/units/c22-s32-u01.records.js';
import {chapter,art,plan} from '../data/book/c22-s32-u01.records-book.js';
import {renderChapter} from '../v2/book.js';
import {buildSlides} from '../v2/deck.js';
import {gradeDaily,vocabOf} from '../v2/daily-grade.js';
import * as misc from '../data/units/c22-s32-u01.misc.js';
import {contentUnitOfItem} from '../v2/content-unit.js';
const count=fn=>items.reduce((o,q)=>(o[fn(q)]=(o[fn(q)]||0)+1,o),{});
test('새 단원은 기존 위치·문항을 덮어쓰지 않고 세 기준과 보충64개를 연결한다',()=>{
 assert.equal(unit.id,'c22-s32-u01');assert.equal(unit.no,1);assert.equal(source,legacySource);assert.equal(similar,legacySimilar);assert.equal(items.length,64);assert.equal(new Set([...source,...similar,...items].map(q=>q.id)).size,204);assert.deepEqual(taxonomy.standards.map(s=>s.code),['4과05-01','4과05-02','4과05-03']);assert.deepEqual(count(q=>q.taxonomy.standard),{'4과05-01':32,'4과05-03':32});assert(Object.values(count(q=>q.taxonomy.type)).every(n=>n===8));
 for(const q of [...source,...similar])assert(q.id.startsWith('s32-u04-'));
 for(const q of items){assert.equal(contentUnitOfItem(q.id),'c22-s32-u01');assert.equal(q.sourceRef.type,'authored-supplement');}
 for(const id of['s31-mid-o1-15','s32-u04-v019','s41-u03b-b01','s31-fin-f2-30','s41-u01-a01'])assert(contentUnitOfItem(id));
 assert.equal(contentUnitOfItem('../private'),null);
});
test('자료 해석56개는 답 계약으로 판정하고 다양한 설계 설명8개는 교사 확인한다',()=>{
 const vocab=vocabOf(items,misc);let correct=0,review=0;const pos=Array(5).fill(0);
 for(const q of items){const ac=q.answerContract;const r=gradeDaily(q,ac.answers||ac.sample||ac.answer,{misc,judge,vocab});if(ac.type==='written-explanation'){assert.equal(r.status,'review');assert(judge[q.id].open);review++;}else{assert.equal(r.status,'correct',q.id);correct++;}if(ac.type==='single-choice'){pos[ac.answer]++;for(const strip of[false,true]){const l=q.choices.map(s=>(strip?s.replace(/\s/g,''):s).length);assert(l[ac.answer]<Math.max(...l.filter((_,i)=>i!==ac.answer))+3,q.id);}}}
 assert.equal(correct,56);assert.equal(review,8);assert.deepEqual(pos,[8,8,8,8,8]);
});
test('5E·교재·두 수업 모드는 실제 문항과 여섯 기록 활동을 쓴다',()=>{
 const pool=[...items,...similar],ids=new Set(pool.map(q=>q.id));for(const id of [...lesson.explain.cards,lesson.explain.table,...lesson.explain.miniTest,...lesson.elaborate.items,...lesson.evaluate.items,...chapter.formative.items,...chapter.check])assert(ids.has(id),id);assert(lesson.includePairedItems);assert.equal(chapter.activities.length,6);assert.equal(chapter.pages.length,32);
 const student=renderChapter(chapter,art,pool),teacher=renderChapter(chapter,art,pool,{teacher:true});assert(!student.includes('교사 안내:'));assert(!student.includes('class="bk-ans"'));assert(teacher.includes('class="bk-ans"'));assert(student.includes('3-2'));assert(!student.includes('3-1'));assert.equal((student.match(/GFIELD · 지필드/g)||[]).length,32);
 for(const mode of['self','teach']){const slides=buildSlides(chapter,art,plan,pool,mode);assert.equal(slides.length,mode==='self'?51:52);assert.equal(slides.filter(s=>s.mount==='lab').length,6);assert(slides.some(s=>s.ses===2));const firstDesign=slides.findIndex(s=>s.phase==='design');assert(slides.findIndex(s=>s.phase==='concept')<firstDesign);}
});
