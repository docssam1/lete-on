import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {workbook as w} from '../data/book/c22-s61-u03.workbook.js';
import {PLANT_RAIL_NOTES,withPlantStructureEditorial} from '../data/book/c22-s61-u03.editorial.js';
import {questions as original} from '../data/book/c22-s61-u03.questions.js';
import {source} from '../data/units/c22-s61-u03.source.js';
import {similar} from '../data/units/c22-s61-u03.similar.js';
import {unit,items,bankPaper} from '../data/units/c22-s61-u03.js';
import {BANK,READY} from './units-index.js';
import {revisedTextbookPaper} from './revised-textbook.js';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

test('식물 교재는 94쪽128문항8형식·예제8개·13개 큰 그림칸을 학생과 교사에게 제공한다',async()=>{
 assert.equal(w.pages.length,94);assert.deepEqual(w.teacherStudentPages,w.pages);
 assert.equal(w.questions.length,128);assert.equal(w.teacherPages.length,53);assert.equal(w.quickPages.length,5);
 assert.equal(new Set(w.questions.map(q=>q.form)).size,8);
 assert.equal(w.questions.filter(q=>q.drawing==='large').length,8);
 assert.equal(w.pages.flatMap(p=>p.blocks).filter(b=>b.type==='field'&&b.draw).length,5);
 assert.equal(w.pages.flatMap(p=>p.blocks).filter(b=>b.type==='example').length,8);
 assert.deepEqual(w.pages.flatMap(p=>p.blocks.filter(b=>b.type==='questions').flatMap(b=>b.ids)),w.questions.map(q=>q.id));
 const paper=await revisedTextbookPaper(w.unit);
 for(const[mode,n,answers]of[['student',94,0],['teacher',147,128],['answers',53,128],['quick',5,0]]){
  const h=paper.workbookPaper({mode});assert.equal((h.match(/class="bk-page /g)||[]).length,n);
  assert.equal((h.match(/data-solution=/g)||[]).length,answers);
  if(mode==='student')assert(!h.includes('class="ed-key"'));
  assert(!/undefined|\[object Object\]|AI 실사형 설명 이미지/.test(h));
 }
});
test('기본은 현미경 관찰·기관 기능 실험·특징 소개이며 중학교 세부 내용은 오른쪽에서 읽는다',()=>{
 assert(w.pages[0].blocks.some(b=>b.title==='워밍업'));
 assert.deepEqual(w.pages[1].blocks[0].heads,['배울 내용','해 볼 활동']);
 assert.equal(PLANT_RAIL_NOTES.length,94);
 for(let k=0;k<3;k++)assert.equal(new Set(PLANT_RAIL_NOTES.map(r=>r[k])).size,94);
 const body=JSON.stringify(w.pages.map(p=>p.blocks));assert(!/물관|체관|삼투|엽록체/.test(body));
 assert(!/호흡|기체 교환/.test(JSON.stringify(w.questions)));
 assert(w.pages[24].rail[1].text.includes('물관과 체관'));
 assert(w.pages[35].rail[1].text.includes('엽록체'));
 assert(w.pages[46].blocks[0].rows.some(r=>r[0]==='증산 작용'));
 assert.throws(()=>withPlantStructureEditorial({...w,unit:'other'}));
});
test('과학 내용으로 바꾼 단답·빈칸은 응답 계약과 빠른표에 같은 답이 나온다',()=>{
 for(const[no,answer]of[[114,'광합성'],[120,'증산 작용'],[121,'뿌리']]){
  const q=w.questions[no-1];assert.equal(q.answer,answer);assert(q.responseContract.accepted.includes(answer));
  assert(w.figures['plant-quick-112'].includes(`<th scope="row">${no}</th><td>${no===121?'단답':'빈칸'}</td><td>${answer}</td>`));
 }
 for(let i=0;i<128;i++){
  const q=w.questions[i],old=original[i];assert.equal(q.id,old.id);assert.equal(q.no,old.no);assert.equal(q.form,old.form);
  assert.deepEqual(q.key,old.key);
  if(q.form==='choice')assert(q.answer.includes(q.choices[q.key]));
  if(q.responseContract.sample!==undefined)assert.equal(q.responseContract.sample,q.answer);
 }
 assert(w.questions[118].answer.includes('물 손실'));assert(w.questions[124].answer.includes('고구마는 뿌리'));
});
test('실제 세포·사과꽃 사진과 출처 표시를 쓰고 두 실험 도해는 자료 그림으로 구별한다',()=>{
 assert(w.figures.cells.includes('c22-s61-u03-onion-kot.jpg'));assert(w.figures.cells.includes('CC BY-SA 4.0'));
 assert(w.figures.flower.includes('c22-s61-u03-apple-higginson.jpg'));assert(w.figures.flower.includes('CC BY-SA 3.0'));
 assert(w.figures.stem.includes('자료 그림'));assert(w.figures.transpiration.includes('비교 그림'));
 assert(!w.figures.cells.includes('s4-q02.webp'));assert(!w.figures.flower.includes('s1-q07.webp'));
});
test('원문75·독립짝75·창작128과 원문5보류를 보존하고 검수한 전체 사고력 수업에 연결한다',()=>{
 assert.equal(source.length,75);assert.equal(similar.length,75);assert.equal(items.length,128);
 assert.deepEqual([1,2,3,4].map(n=>source.filter(q=>q.sourceRef.set===n).length),[10,20,20,25]);
 assert.deepEqual(source.filter(q=>q.sourceRef.reviewOnly).map(q=>`${q.sourceRef.set}-${q.sourceRef.no}`),['3-16','3-20','4-10','4-13','4-14']);
 assert(!BANK[w.unit].bankOnly&&!READY[w.unit].bankOnly);assert.equal(READY[w.unit].lesson,true);
 for(const mode of['student','teacher','answers','quick']){
  const h=bankPaper({unit,source,similar,items,mode});assert.equal((h.match(/data-paper-item=/g)||[]).length,278);assert(!h.includes('[object Object]'));
  if(mode==='teacher')assert.equal((h.match(/<b>인쇄된 공식 답 참고:/g)||[]).length,5);
  if(['answers','quick'].includes(mode))assert(!h.includes('<img'));
 }
 const css=fs.readFileSync(new URL('./plant-structure-book.css',import.meta.url),'utf8');assert(css.includes('min-height:120mm'));
});
test('실제 시작·웹 교재·교재4인쇄·은행4인쇄 경로는 학생 저장을 읽거나 쓰지 않는다',()=>{
 const r=JSON.parse(execFileSync(process.execPath,['--experimental-vm-modules',fileURLToPath(new URL('./tests/plant-structure-workbook-routes.mjs',import.meta.url))],{encoding:'utf8',timeout:15000,stdio:['ignore','pipe','pipe']}));
 assert.equal(r.actualWorkbookRouterBranch,4);assert.equal(r.actualBankPrintRouterBranch,4);
 assert(r.productionUnitLoaderExecuted&&!r.fullClassroomPending);assert.equal(r.studentStorageReads,0);assert.equal(r.studentStorageWrites,0);
});
