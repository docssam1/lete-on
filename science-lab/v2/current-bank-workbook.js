import{electricityPairPrintQuestion,electricityPairPrintFigures}from'./electricity-pair-language.js?v=20261108-electricity-pair-language';
// 별도 문항집 인쇄에도 현재 교재와 연습의 원고를 쓴다.
// 원문·독립 짝은 실제 문항 ID로 구별하며 과거 문항/저장 답안은 고치지 않는다.
export const CURRENT_BANK_WORKBOOK_VERSION='20261108-current-bank-workbook-pairs';
const clone=value=>structuredClone(value);
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function currentBankWorkbook(priorBook,workbook,items){
 if(priorBook.unit!==workbook.unit)throw Error('문항집과 현재 교재의 단원이 다릅니다.');
 const byQuestion=new Map(workbook.questions.map(q=>[q.id,q]));
 const byItem=new Map(items.map(q=>[q.id,q]));
 const presentationKeys=new Set(workbook.questions.flatMap(q=>Object.keys(q)));
 for(const key of ['choices','givens','given','parts','options','table','figure','requirements','verificationModel','matching','sequence'])presentationKeys.add(key);
 const seen=new Set();
 const questions=priorBook.questions.map(old=>{
  const current=byItem.get(old.sourceItemId);
  if(current?.sourceRef?.type==='authored-pair')return electricityPairPrintQuestion(old,current);
  if(current?.status!=='authored'||current.sourceRef?.type!=='authored-supplement')return old;
  const q=byQuestion.get(current.bookQuestionId);
  if(!q||q.id!==old.sourceBookQuestionId)return old;
  if(seen.has(q.id))throw Error('현재 교재 문항이 문항집에 중복 연결되었습니다.');
  seen.add(q.id);
  if(current.prompt!==q.prompt||current.explanation!==q.explanation||JSON.stringify(current.responseContract)!==JSON.stringify(q.responseContract))throw Error('현재 연습과 교재의 원고가 다릅니다.');
  const next=clone(q);
  // 문항집 번호와 실제 출처/연결 정보는 그대로 둔다.
  for(const[key,value]of Object.entries(old))if(!presentationKeys.has(key)||['sourceRef','origin','status','sourceContract'].includes(key))next[key]=clone(value);
  next.id=old.id;next.no=old.no;next.answerContract=clone(current.answerContract);
  next.contentVersion=current.contentVersion||1;
  return next;
 });
 if(seen.size!==workbook.questions.length)throw Error('현재 교재와 연결되지 않은 인쇄 문항이 있습니다.');
 const figures=electricityPairPrintFigures({...priorBook.figures,...workbook.figures},questions),byNumber=new Map(questions.map(q=>[q.no,q])),quickSeen=new Set();
 const quickKeys=new Set(priorBook.quickPages.flatMap(page=>page.blocks.filter(b=>b.type==='diagram').map(b=>b.key)));
 for(const key of quickKeys){
  if(typeof figures[key]!=='string')throw Error('문항집 빠른 정답표가 없습니다.');
  figures[key]=figures[key].replace(/(<tr><th scope="row">)(\d+)(<\/th><td>)([\s\S]*?)(<\/td><td>)([\s\S]*?)(<\/td><\/tr>)/g,(_row,a,n,b,_form,c,_answer,d)=>{
   const q=byNumber.get(Number(n));if(!q||quickSeen.has(q.id))throw Error('문항집 빠른 정답표의 번호가 다릅니다.');
   quickSeen.add(q.id);return a+n+b+esc(q.formLabel)+c+esc(q.responseContract?.teacherRequired?'교사 확인':q.answer)+d;
  });
 }
 if(quickSeen.size!==questions.length)throw Error('문항집 빠른 정답표에 빠진 문항이 있습니다.');
 return {...priorBook,questions,figures,presentationVersion:CURRENT_BANK_WORKBOOK_VERSION};
}
