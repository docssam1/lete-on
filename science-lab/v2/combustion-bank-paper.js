import{bankBook}from'../data/book/c22-s62-u02.bank-book.js';
import{items}from'../data/units/c22-s62-u02.js';
import{combustionReadablePriorWorkbook as workbook}from'../data/book/c22-s62-u02.workbook.js?v=20261106-combustion-readable-workbook';
import{combustionCurrentItems,COMBUSTION_CHANGED_NUMBERS}from'./combustion-question-language.js?v=20261106-combustion-readable-workbook';
import{combustionLanguage}from'../data/book/c22-s62-u02.editorial.js?v=20261104-combustion-book';
import{makeWorkbookPaper}from'./revised-workbook-paper.js?v=20261104-earth-motion-book';
const clone=x=>JSON.parse(JSON.stringify(x)),current=new Map(combustionCurrentItems(items).map(q=>[q.id,q])),byId=new Map(workbook.questions.map(q=>[q.id,q]));
const questions=bankBook.questions.map(q=>{const it=current.get(q.sourceItemId||q.id);if(!it?.contentVersion)return q;if(!COMBUSTION_CHANGED_NUMBERS.includes(q.sourceBookNo))return{...combustionLanguage(q),choices:it.choices?clone(it.choices):null,responseContract:clone(it.responseContract),answerContract:clone(it.answerContract)};const w=byId.get(q.sourceBookQuestionId);return{...q,...clone(w),id:q.id,no:q.no,sourceItemId:q.sourceItemId,sourceBookQuestionId:q.sourceBookQuestionId,sourceBookNo:q.sourceBookNo,answerContract:clone(it.answerContract)};});
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const table=rows=>`<table class="ed-table combustion-book-table"><thead><tr>${['번호','형식','정답'].map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(q=>`<tr><th scope="row">${q.no}</th><td>${esc(q.formLabel)}</td><td>${esc(q.responseContract.teacherRequired?'교사 확인':q.answer)}</td></tr>`).join('')}</tbody></table>`;
const figures=combustionLanguage({...bankBook.figures,...workbook.figures});for(let start=0;start<questions.length;start+=24){const rows=questions.slice(start,start+24);figures['combustion-bank-quick-'+start]='<div class="combustion-quick-grid">'+[rows.slice(0,12),rows.slice(12)].filter(r=>r.length).map(table).join('')+'</div>';}
export const combustionBankBook={...combustionLanguage(bankBook),theme:'#2f6b4a',questions:questions.map(q=>({...q,misconception:combustionLanguage(q.misconception)})),figures};
const paper=makeWorkbookPaper(combustionBankBook,{}, {route:'print',toolLabel:'198문항집 고르기',modes:[['student','학생 문제지'],['teacher','교사 해설'],['answers','정답·해설만'],['quick','빠른 정답표']]});
export const bankPaper=paper.workbookPaper;export const wireBankPaper=paper.wireWorkbookPaper;
