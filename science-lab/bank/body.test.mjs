import test from 'node:test';import assert from 'node:assert/strict';import{readFileSync,existsSync}from'node:fs';import{createHash}from'node:crypto';
import{unit,items,bankPaper}from'../data/units/c22-s51-u04.js';import{source}from'../data/units/c22-s51-u04.source.js';import{similar}from'../data/units/c22-s51-u04.similar.js';import{taxonomy}from'../data/units/c22-s51-u04.taxonomy.js';import{judge}from'../data/units/c22-s51-u04.judge.js';import*as misc from'../data/units/c22-s51-u04.misc.js';import{gradeDaily,vocabOf}from'../v2/daily-grade.js';import{BANK,READY,BOOK_UNITS}from'../v2/units-index.js';import{bankFor2022}from'../v2/curriculum-2022.js';import{curriculumBankHtml}from'../v2/bank-catalog.js';
const all=[...source,...similar,...items],opt={misc,judge,vocab:vocabOf(all,misc)},read=n=>JSON.parse(readFileSync(new URL('./work/c22s51u04/'+n,import.meta.url))),val=q=>q.answerContract.sample??q.answerContract.answer??q.answerContract.answers;
test('우리 몸은 옛6-2 관련58원문/58독립짝/96교재문항이며 원번호·쪽·발문·그림을 보존한다',async()=>{
 assert.equal(all.length,212);assert.equal(new Set(all.map(q=>q.id)).size,212);assert.deepEqual([1,2,3,4].map(s=>source.filter(q=>q.sourceRef.set===s).length),[13,12,17,16]);
 const raw=read('source-reviewed.json'),key=read('official-key-reviewed.json');
 const freeze=read('source-freeze-20261018.json');assert.equal(freeze.fileCount,16);for(const [path,sha]of Object.entries(freeze.sha256))assert.equal(createHash('sha256').update(readFileSync(new URL('./work/c22s51u04/'+path,import.meta.url))).digest('hex'),sha,path);
 for(const q of source){const r=raw.find(r=>r.key===`${q.sourceRef.set}-${q.sourceRef.no}`);assert(r);assert.equal(q.prompt,r.prompt);assert.equal(q.sourceRef.course,'초등 6-2');assert.equal(q.sourceRef.page,r.page);assert.equal(q.sourceRef.originalNo,r.no);assert.equal(q.printedExplanation,r.printedExplanation);assert.equal(r.answer,key[r.key]);assert.equal(q.figure,r.figure);assert.equal(similar.filter(v=>v.sourceRef.of.set===r.set&&v.sourceRef.of.no===r.no).length,1);if(q.figure)assert(existsSync(new URL('../'+q.figure,import.meta.url)));if(!q.sourceRef.reviewOnly)assert.deepEqual(q.choices,r.choices);}
 const excluded=read('source-range-review.json').rows.filter(r=>!r.currentScopeCandidate);assert.equal(excluded.length,12);for(const e of excluded)assert(!source.some(q=>q.sourceRef.set===e.set&&q.sourceRef.no===e.question));
 assert.equal(bankFor2022('s51-u04',BANK).contentId,unit.id);assert(!READY[unit.id].bankOnly&&BANK[unit.id].sourceExcerptOnly&&BANK[unit.id].lesson&&BOOK_UNITS.has(unit.id));assert.equal(taxonomy.standards.length,3);
 const old=await import('../data/units/s51-u04.js');assert.notEqual(old.unit.title,unit.title);assert(old.items.every(q=>!all.some(n=>n.id===q.id)));
});
test('212응답은170자동/42교사확인이고 보류6의 인쇄답과 선택지를 별도 보존한다',()=>{
 let auto=0,review=0;for(const q of all){const a=q.answerContract,r=gradeDaily(q,val(q),opt);assert.equal(r.status,a.type==='written-explanation'?'review':'correct',q.id);r.status==='correct'?auto++:review++;assert.equal(gradeDaily(q,'',opt).status,'blank',q.id);
 if(a.type==='single-choice')for(let i=0;i<q.choices.length;i++)if(i!==a.answer)assert.equal(gradeDaily(q,i,opt).status,'wrong',q.id);
 if(a.type==='multi-choice'){assert.equal(gradeDaily(q,[...a.answers].reverse(),opt).status,'correct');assert.equal(gradeDaily(q,a.answers.slice(0,1),opt).status,'wrong');const extra=q.choices.findIndex((_,i)=>!a.answers.includes(i));assert.equal(gradeDaily(q,[...a.answers,extra],opt).status,'wrong');}
 if(a.type==='short-text')for(const answer of a.accepted)assert.equal(gradeDaily(q,answer,opt).status,'correct',q.id+':'+answer);
 if(a.type==='written-explanation'){assert(judge[q.id].open);assert.equal(gradeDaily(q,'다른 설명은 교사와 확인',opt).status,'review');}}
 assert.equal(auto,170);assert.equal(review,42);const holds=source.filter(q=>q.sourceRef.reviewOnly);assert.deepEqual(holds.map(q=>`${q.sourceRef.set}-${q.sourceRef.no}`),['1-3','1-8','2-10','3-9','3-11','4-6']);for(const q of holds){assert(q.printedAnswerContract);assert.equal(q.givens['원문 선택지'].length,5);assert.equal(gradeDaily(q,q.printedAnswerContract.answer??q.printedAnswerContract.answers,opt).status,'review');}
 const error=holds.find(q=>q.id.endsWith('o4-06'));assert.equal(error.printedAnswerContract.answer,3);assert.match(error.explanation,/조합/);
});
test('모든 짝은 원문 없이 자체 조건으로 풀며 펌프의1회량/같은시간총량과 기관 경로를 구별한다',()=>{
 assert.equal(new Set([...similar,...items].map(q=>JSON.stringify([q.prompt,q.givens,q.choices]))).size,154);assert.equal(new Set(similar.map(q=>q.prompt)).size,58);for(const q of similar)assert(!source.some(s=>s.prompt===q.prompt));
 const count=xs=>xs.reduce((a,q)=>(a[q.responseContract]=(a[q.responseContract]||0)+1,a),{});assert.deepEqual(count(similar),{'single-choice':31,'short-text':20,'written-explanation':4,'multi-choice':3});
 const positions=[0,0,0,0,0];for(const q of similar.filter(q=>q.responseContract==='single-choice'))positions[q.answerContract.answer]++;assert.deepEqual(positions,[7,6,6,6,6]);
 const pump=similar.find(q=>q.id.endsWith('p2-10'));assert.deepEqual(pump.answerContract.answers,[0,2]);assert.equal(pump.givens['표']['행'][0][3],pump.givens['표']['행'][1][3]);assert.match(pump.explanation,/18mL/);assert.match(pump.explanation,/36mL/);
 const pair=similar.find(q=>q.id.endsWith('p3-11'));assert.equal(pair.choices[pair.answerContract.answer],'50mL에서70mL로 늘어난다.');assert.match(pair.givens['자료'],/실제 측정 아님/);
 for(const q of similar.filter(q=>q.figure)){assert.match(q.photoCredit,/AI 실사형/);assert(!q.figure.endsWith('.svg'));assert.equal(q.visualModel.actualStudentEvidence,false);assert(q.photoLabels.length>0);}
 const naming=source.find(q=>q.id.endsWith('o2-11'));assert(!/배설|콩팥/.test(naming.figureNote));
 assert.equal(items.filter(q=>q.bookResponseForm==='draw').length,4);assert.equal(items.filter(q=>q.bookResponseForm==='blank').length,18);assert.equal(items.find(q=>q.workbookRef.no===86).answerContract.answer,'2일');
});
test('네 문항집은 같은212번호와 자료를 쓰며 학생/교사/해설만/빠른표 경계를 지킨다',()=>{
 for(const mode of ['student','teacher','answers','quick']){const h=bankPaper({unit,source,similar,items,mode});assert.equal((h.match(/data-paper-item=/g)||[]).length,212);assert(!h.includes('[object Object]'));assert(h.includes('옛6-2 관련 원문58'));assert(h.includes('원문6개'));assert(!h.includes('용해와 용액'));if(mode==='student')assert(!h.includes('class="solution-key"'));if(mode==='teacher'||mode==='answers'){assert.equal((h.match(/class="solution-key"/g)||[]).length,212);assert.equal((h.match(/인쇄된 공식 답 참고/g)||[]).length,6);}if(mode==='answers'||mode==='quick')assert(!h.includes('<img'));}
 const h=curriculumBankHtml(BANK);assert(h.includes('#/c22-s51-u04/start'));assert(h.includes('#/c22-s51-u04/1'));assert(h.includes('20개 단원의 원문 1298문항'));assert(h.includes('우리 몸의 구조와 기능'));
});
