import {sourceExamPaperHtml} from './source-exam-paper.js?v=20261115-print-images';
import {sourceQuestionPrintHtml,sourceQuestionKeyHtml,sourceAnswerText,needsSourceTeacherReview} from './source-content.js?v=20261114-source-integration';
import {sourceCaption} from './source-presentation.js';
import {wireBankPrint} from './bank-print-ready.js?v=20261108-bank-print-ready';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const modes={student:'학생 문제지',teacher:'교사 해설',answers:'정답·해설만',quick:'빠른 정답표'};
export function withSourceBankPaper(mod){
 if(!mod.source?.length||typeof mod.bankPaper!=='function')return mod;
 const basePaper=mod.bankPaper;
 const bankPaper=(options={})=>{
  const data={...mod,...options},mode=data.mode||'student';
  if(!modes[mode])throw Error('문항집 종류를 확인해 주세요.');
  const rows=data.source,sets=[...new Set(rows.map(q=>q.sourceRef.set))],unit=data.unit.id,title=data.unit.title;
  const baseHtml=basePaper(data).replace(/<nav class="(?:think-workbook-tools|geo-tools) no-print"[^>]*>[\s\S]*?<\/nav>/,''),total=rows.length+mod.items.length+(mod.similar?.length||0);
  const header='<header class="top no-print source-bank-tools"><div class="wrap"><a class="back" href="#/'+unit+'/start">‹ 수업·교재로</a><h1>'+esc(title)+' · 전체 '+total+'문항집</h1><button type="button" class="btn" data-workbook-print disabled>A4 인쇄</button><p role="status" data-workbook-status>그림과 글꼴을 준비하고 있어요.</p>'+Object.entries(modes).map(([key,label])=>'<a class="btn" href="#/'+unit+'/print/'+key+'"'+(key===mode?' aria-current="page"':'')+'>'+label+'</a>').join('')+'</div></header>';
  let originals;
  if(mode==='student'||mode==='teacher'){
   originals=sets.map(set=>sourceExamPaperHtml({unit,set,title,bank:{label:'옛단원 연계 원문',sourceExcerptOnly:true,sourceScopeNote:'지금 배우는 내용과 관련된 문제를 골랐어요.'},list:rows.filter(q=>q.sourceRef.set===set),mode,renderItem:sourceQuestionPrintHtml,tools:false})).join('');
  }else{
   const keys=rows.map(q=>{
    const body=mode==='answers'?sourceQuestionKeyHtml(q):'<p><b>'+(needsSourceTeacherReview(q)?'교사 확인':esc(sourceAnswerText(q)))+'</b></p>';
    return '<article class="source-exam-question" data-paper-item="'+esc(q.id)+'"><p class="source-exam-origin">'+esc(sourceCaption(q.sourceRef))+'</p>'+body+'</article>';
   }).join('');
   originals='<main class="source-exam-paper source-bank-keys"><header class="source-exam-heading"><h1>'+esc(title)+' · 원문 '+modes[mode]+'</h1><p>원래 세트와 문제 번호를 확인해요.</p></header>'+keys+'</main>';
  }
  return header+'<div class="source-bank-combined" data-paper-unit="'+esc(unit)+'">'+originals+'<section class="source-bank-practice">'+baseHtml+'</section></div>';
 };
 bankPaper.basePaper=basePaper;
 return {...mod,bankPaper};
}
export function wireSourceBankPrint(root){return wireBankPrint(root,{buttonSelector:'[data-workbook-print]',statusSelector:'[data-workbook-status]',handwriting:true,serif:true});}
