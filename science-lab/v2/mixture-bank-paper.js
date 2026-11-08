import {workbook as currentWorkbook} from '../data/book/c22-s52-u01.workbook.js?v=20261106-mixture-readable-workbook';
import {makeWorkbookPaper} from './revised-workbook-paper.js?v=20261108-learning-note-roles';
import {wireBankPrint} from './bank-print-ready.js?v=20261108-bank-print-ready';
// 교재와 정답표는 동일한96문항·해설 객체를 사용한다.
import {chapter,art,quickPages} from '../data/book/c22-s52-u01.book.js';
import {renderEditorialChapter} from './book-editorial.js';
const printArt=Object.fromEntries(Object.entries(art).map(([key,markup])=>[key,markup.replaceAll('AI 실사형 설명 이미지','문항을 설명하는 그림')]));
export function priorMixtureBankPaperHtml({mode='student'}={}){
 const ch=mode==='answers'?{...chapter,pages:chapter.teacherPages,teacherPages:[]}:mode==='quick'?{...chapter,pages:quickPages,teacherPages:[]}:chapter;
 return `<div class="mixture-print" data-mixture-mode="${mode}"><nav class="mixture-print-tools no-print"><a class="btn" href="#/${chapter.unit}/start">처음으로</a>${[['student','학생용 교재'],['teacher','교사용 교재'],['answers','정답·해설'],['quick','빠른 정답표']].map(([k,t])=>`<a class="btn" href="#/${chapter.unit}/print/${k}">${t}</a>`).join('')}<button class="btn primary" data-mixture-print disabled>A4 인쇄</button><p role="status" data-mixture-status>그림과 글꼴을 준비하고 있어요.</p></nav>${renderEditorialChapter(ch,printArt,{teacher:mode!=='student'})}</div>`;
}
export function wirePriorMixtureBankPaper(root){return wireBankPrint(root,{buttonSelector:'[data-mixture-print]',statusSelector:'[data-mixture-status]',handwriting:true,serif:true});}

// The current bank and workbook share the same manuscript; the earlier paper remains above.
const currentPaper=makeWorkbookPaper(currentWorkbook,{}, {route:'print',toolLabel:'혼합물 문항집 고르기'});
export const mixtureBankPaperHtml=currentPaper.workbookPaper;
export const wireMixtureBankPaper=currentPaper.wireWorkbookPaper;
