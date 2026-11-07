import{currentBankWorkbook}from'./current-bank-workbook.js?v=20261107-current-bank-workbook';
import{workbook as currentWorkbook}from'../data/book/c22-s61-u04.workbook.js?v=20261106-earth-motion-readable-workbook';
import{earthMotionReadableCurrentItems}from'../data/book/c22-s61-u04.editorial.js?v=20261106-earth-motion-readable-workbook';
import{observationCurrentItems}from'../data/book/observation-language.js';
import{bankBook}from'../data/book/c22-s61-u04.bank-book.js';
import{items}from'../data/units/c22-s61-u04.js';
import{observationPriorWorkbook as workbook}from'../data/book/c22-s61-u04.workbook.js?v=20261104-earth-motion-questions';
import{earthMotionCurrentItems,EARTH_MOTION_CHANGED_NUMBERS}from'./earth-motion-question-language.js?v=20261104-earth-motion-questions';
import{makeWorkbookPaper}from'./revised-workbook-paper.js?v=20261108-learning-note-roles';
const clone=x=>JSON.parse(JSON.stringify(x));
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const current=new Map(earthMotionCurrentItems(items).map(q=>[q.id,q]));
const bookQuestions=new Map(workbook.questions.map(q=>[q.id,q]));
const questions=bankBook.questions.map(q=>{
 if(!EARTH_MOTION_CHANGED_NUMBERS.includes(q.sourceBookNo))return q;
 const w=bookQuestions.get(q.sourceBookQuestionId),it=current.get(q.sourceItemId);
 return{...q,...clone(w),id:q.id,no:q.no,sourceItemId:q.sourceItemId,sourceBookQuestionId:q.sourceBookQuestionId,sourceBookNo:q.sourceBookNo,answerContract:clone(it.answerContract)};
});
const table=rows=>`<table class="ed-table earth-book-table"><thead><tr>${['번호','형식','정답'].map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(q=>`<tr><th scope="row">${q.no}</th><td>${esc(q.formLabel)}</td><td>${esc(q.responseContract?.teacherRequired?'교사 확인':q.answer)}</td></tr>`).join('')}</tbody></table>`;
const figures={...bankBook.figures,...workbook.figures};
for(let start=0;start<questions.length;start+=24){const rows=questions.slice(start,start+24);figures['bank-quick-'+start]='<div class="earth-quick-grid">'+[rows.slice(0,12),rows.slice(12)].filter(a=>a.length).map(table).join('')+'</div>';}
export const earthMotionBankBook={...bankBook,theme:'#2f6b4a',questions,figures};
// 위 BankBook은 기존 원고 대조용으로 보존한다. 실제 인쇄는 현재 교재를 쓴다.
export const currentEarthMotionBankBook=currentBankWorkbook(earthMotionBankBook,currentWorkbook,earthMotionReadableCurrentItems(observationCurrentItems(Array.from(current.values()),'c22-s61-u04'),'c22-s61-u04'));
const paper=makeWorkbookPaper(currentEarthMotionBankBook,{}, {route:'print',toolLabel:'167문항집 고르기',modes:[['student','학생 문제지'],['teacher','교사 해설'],['answers','정답·해설만'],['quick','빠른 정답표']]});
export const bankPaper=paper.workbookPaper;
export const wireBankPaper=paper.wireWorkbookPaper;
