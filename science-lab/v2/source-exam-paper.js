import {groupLabel, bankLabel, sourceCaption} from './source-presentation.js';
import {isStructuredSource} from './source-content.js?v=20261108-source-schema';

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function route(unit,set){
 if(typeof unit!=='string'||!/^[a-z0-9-]+$/.test(unit)||!Number.isSafeInteger(set)||set<1)throw Error('문제지의 단원과 세트를 확인해 주세요.');
 return '#/'+unit+'/exam/'+set;
}
export const sourcePaperMode=mode=>mode==='paper'?'student':mode==='paper-teacher'?'teacher':null;
export function sourceExamPrintLinks(unit,set){
 const href=route(unit,set);
 return '<a class="btn" href="'+href+'/paper">문제지 인쇄</a><a class="btn" href="'+href+'/paper-teacher">교사 해설 인쇄</a>';
}
const marks=['①','②','③','④','⑤'];
function contractText(q,a){
 if(!a)return '';
 if(a.type==='single-choice')return [marks[a.answer],q.choices?.[a.answer]].filter(v=>v!=null).join(' ');
 if(a.type==='multi-choice')return a.answers.map(i=>[marks[i],q.choices?.[i]].filter(v=>v!=null).join(' ')).join(' · ');
 if(a.type==='cloze')return a.blanks.map(b=>b.answer).join(' · ');
 if(a.type==='table-fill')return a.rows.map(r=>r.label+': '+r.answer.join(' · ')).join(' / ');
 return String(a.sample??a.answer??'');
}
function legacyReviewHtml(q){
 const summary=q.reviewSummary||contractText(q,q.answerContract),printed=contractText(q,q.printedAnswerContract);
 return '<section class="source-exam-review"><p><b>선생님과 확인해요.</b> 이 문항은 자동으로 맞고 틀림을 정하지 않아요.</p><p><b>확인할 점:</b> '+esc(summary)+'</p>'+(printed?'<p><b>인쇄된 답 참고:</b> '+esc(printed)+' · 자동 정오 판정 보류</p>':'')+(q.explanation?'<p>'+esc(q.explanation)+'</p>':'')+'</section>';
}
// 원문 본문·그림·응답 공간은 실제 수업의 인쇄 렌더러를 공유한다.
export function sourceExamPaperHtml({unit,set,bank,title,list,mode='student',renderItem}){
 const href=route(unit,set);
 if(!['student','teacher'].includes(mode)||typeof renderItem!=='function'||!Array.isArray(list)||!list.length)throw Error('인쇄할 원문을 확인해 주세요.');
 const ids=new Set();
 for(const q of list){
  if(!q?.id||ids.has(q.id)||q.sourceRef?.type!=='original'||q.sourceRef.set!==set||!q.answerContract)throw Error('원문 세트의 문항을 확인해 주세요.');
  ids.add(q.id);
 }
 const teacher=mode==='teacher',name=groupLabel(bank,set),label=bankLabel(bank);
 const questionTitle=title||label,heading=questionTitle===label?label+' · '+name:questionTitle+' · '+label+' · '+name;
 const body=list.map(q=>{
  const number=q.sourceRef.originalNo??q.sourceRef.no;
  if(number==null||String(number).trim()==='')throw Error('원래 문항 번호가 없습니다.');
  const legacyReview=q.sourceRef.reviewOnly===true&&!isStructuredSource(q);
  return '<article class="source-exam-question" data-paper-item="'+esc(q.id)+'"><p class="source-exam-origin">'+esc(sourceCaption(q.sourceRef))+'</p>'+renderItem(q,{print:true,show:teacher&&!legacyReview,no:String(number)})+(teacher&&legacyReview?legacyReviewHtml(q):'')+'</article>';
 }).join('');
 return '<header class="top no-print"><div class="wrap"><a class="back" href="'+href+'">‹ 문제 풀기로</a><h1>'+esc(questionTitle)+' · '+(teacher?'교사 해설':'문제지')+'</h1><button type="button" class="btn" onclick="print()">인쇄</button>'+sourceExamPrintLinks(unit,set)+'</div></header>'
  +'<main class="source-exam-paper'+(teacher?' source-exam-teacher':'')+'"><header class="source-exam-heading"><p>GFIELD · 지필드</p><h1>'+esc(heading)+'</h1><p>'+(teacher?'교사용 · 정답과 해설':'학생용 · 이름 ____________________')+'</p></header>'
  +'<div class="source-exam-intro"><p>'+list.length+'문항 · 자료를 읽고 답해요. 원래 문제 번호를 그대로 두었어요.</p>'+(bank?.sourceScopeNote?'<p>'+esc(bank.sourceScopeNote)+'</p>':'')+(bank?.sourceExcerptOnly?'<p>이 자료는 관련 문제를 골라 묶은 것이에요.</p>':'')+(teacher?'<p>선생님 확인이 필요한 답은 자동으로 맞고 틀림을 정하지 않아요.</p>':'')+'</div>'+body+'</main>';
}
