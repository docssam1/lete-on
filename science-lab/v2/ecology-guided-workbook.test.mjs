import test from 'node:test';
import assert from 'node:assert/strict';
import {workbook} from '../data/book/c22-s42-u02.workbook.js';
import {review} from '../data/language/c22-s42-u02.js';
import {reviewTextTree,reviewWorkbookTableText,reviewStudentWorkbook} from './student-language-review.js';
import {withElementaryReadingDirections} from '../data/book/elementary-reading-directions.js';
import {withObservedPhotoAlt} from '../data/book/observation-language.js';
import {withEcologyGuidedWorkbook} from './ecology-guided-workbook.js';
import {revisedTextbook,revisedTextbookPaper} from './revised-textbook.js';

const unit=workbook.unit;
const original=withObservedPhotoAlt(withElementaryReadingDirections(workbook));
const prior=reviewWorkbookTableText(reviewTextTree(original,review.text),review);
const ids=pages=>pages.flatMap(p=>p.blocks.flatMap(b=>b.ids||[]));

test('guided study removes duplicate writing without losing any question, material or answer contract',()=>{
 const saved=structuredClone(prior),next=withEcologyGuidedWorkbook(prior);
 assert.notEqual(next,prior);assert.deepEqual(prior,saved);
 assert.equal(next.pages.length,48);assert.deepEqual(ids(next.pages),ids(prior.pages));assert.equal(new Set(ids(next.pages)).size,80);
 for(const key of Object.keys(prior))if(!['pages','teacherStudentPages'].includes(key))assert.equal(next[key],prior[key],key);
 assert.equal(next.teacherStudentPages,next.pages);
 assert(next.pages.every(p=>!p.rail.some(n=>n.write)));
 const concept=next.pages.filter(p=>!ids([p]).length),fields=concept.flatMap(p=>p.blocks).filter(b=>b.type==='field');
 assert.equal(concept.length,12);assert.equal(fields.filter(b=>!b.draw).length,2);
 assert(fields.some(b=>b.draw));assert(fields.some(b=>b.lines===1));
 assert(concept.some(p=>p.blocks.some(b=>b.type==='text'&&b.text.includes('날카로운 쓰레기'))));
 assert(concept.some(p=>p.blocks.some(b=>b.type==='table'&&b.rows.some(row=>row.join('').includes('생물 요소 / 비생물 요소')))));
 assert(!JSON.stringify(concept).includes('다음 쪽의 모형 표'));
});

test('unreviewed future changes and other units are never silently overwritten',()=>{
 const next=withEcologyGuidedWorkbook(prior);assert.equal(withEcologyGuidedWorkbook(next),next);
 for(const patch of [{unit:'other'},{pages:prior.pages.slice(1)},{teacherStudentPages:[]},{questions:prior.questions.map((q,i)=>i? q:{...q,prompt:q.prompt+' future'})},{figures:{...prior.figures,future:'new figure'}}]){
  const future={...prior,...patch};assert.equal(withEcologyGuidedWorkbook(future),future);
 }
});

test('the actual web and print entry points share the same question order and keep student answers hidden',async()=>{
 const reviewed=await reviewStudentWorkbook(unit,original),book=await revisedTextbook(unit,await import('../data/book/'+unit+'.book.js'));
 assert.deepEqual(book.workbook.pages,reviewed.pages);assert.deepEqual(book.workbook.questions,reviewed.questions);
 const paper=await revisedTextbookPaper(unit),student=paper.workbookPaper({mode:'student'}),teacher=paper.workbookPaper({mode:'teacher'});
 const matches=html=>[...html.matchAll(/data-question="([^"]+)"/g)].map(m=>m[1]);
 assert.deepEqual(matches(student),ids(prior.pages));assert.deepEqual(matches(teacher),ids(prior.pages));
 assert(!student.includes('class="ed-key"'));assert(student.includes('워밍업'));assert(student.includes('한 문장으로 마무리'));
 assert(teacher.includes('ed-solution'));
});
