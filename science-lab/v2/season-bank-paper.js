import{elementaryPromptCurrentItems}from'../data/book/elementary-question-prompts.js?v=20261108-elementary-question-prompts';
import{seasonPairCurrentItems}from'./season-pair-language.js?v=20261108-season-pair-language';
import{currentBankWorkbook}from'./current-bank-workbook.js?v=20261108-earth-motion-pair-language';
import{workbook as currentWorkbook}from'../data/book/c22-s62-u01.workbook.js?v=20261108-elementary-question-prompts';
import{seasonReadableCurrentItems}from'../data/book/c22-s62-u01.editorial.js?v=20261106-season-readable-workbook';
import{bankBook}from'../data/book/c22-s62-u01.bank-book.js';
import{items}from'../data/units/c22-s62-u01.js';
import{seasonReadablePriorWorkbook as workbook}from'../data/book/c22-s62-u01.workbook.js?v=20261108-elementary-question-prompts';
import{seasonCurrentItems,SEASON_CHANGED_NUMBERS}from'./season-question-language.js?v=20261106-season-readable-workbook';
import{seasonLanguage}from'../data/book/c22-s62-u01.editorial.js?v=20261104-season-book';
import{makeWorkbookPaper}from'./revised-workbook-paper.js?v=20261108-learning-note-roles';
const clone=x=>JSON.parse(JSON.stringify(x)),current=new Map(seasonCurrentItems(items).map(q=>[q.id,q])),byId=new Map(workbook.questions.map(q=>[q.id,q]));
const questions=bankBook.questions.map(q=>{const it=current.get(q.sourceItemId||q.id);if(!it?.contentVersion)return q;if(!SEASON_CHANGED_NUMBERS.includes(q.sourceBookNo))return{...seasonLanguage(q),responseContract:clone(it.responseContract),answerContract:clone(it.answerContract)};const w=byId.get(q.sourceBookQuestionId);return{...q,...clone(w),id:q.id,no:q.no,sourceItemId:q.sourceItemId,sourceBookQuestionId:q.sourceBookQuestionId,sourceBookNo:q.sourceBookNo,answerContract:clone(it.answerContract)};});
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const table=rows=>`<table class="ed-table season-book-table"><thead><tr>${['번호','형식','정답'].map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(q=>`<tr><th scope="row">${q.no}</th><td>${esc(q.formLabel)}</td><td>${esc(q.responseContract.teacherRequired?'교사 확인':q.answer)}</td></tr>`).join('')}</tbody></table>`;
const figures=seasonLanguage({...bankBook.figures,...workbook.figures});for(let start=0;start<questions.length;start+=24){const rows=questions.slice(start,start+24);figures['season-bank-quick-'+start]='<div class="season-quick-grid">'+[rows.slice(0,12),rows.slice(12)].filter(r=>r.length).map(table).join('')+'</div>';}
export const seasonBankBook={...seasonLanguage(bankBook),theme:'#2f6b4a',questions:questions.map(q=>({...q,misconception:seasonLanguage(q.misconception)})),figures};
// 위 BankBook은 기존 원고 대조용으로 보존한다. 실제 인쇄는 현재 교재를 쓴다.
export const currentSeasonBankBook=currentBankWorkbook(seasonBankBook,currentWorkbook,elementaryPromptCurrentItems(seasonPairCurrentItems(seasonReadableCurrentItems(Array.from(current.values()),'c22-s62-u01'),'c22-s62-u01'),'c22-s62-u01'));
const paper=makeWorkbookPaper(currentSeasonBankBook,{}, {route:'print',toolLabel:'198문항집 고르기',modes:[['student','학생 문제지'],['teacher','교사 해설'],['answers','정답·해설만'],['quick','빠른 정답표']]});
export const bankPaper=paper.workbookPaper;export const wireBankPaper=paper.wireWorkbookPaper;
