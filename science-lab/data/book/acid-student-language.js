export const ACID_STUDENT_LANGUAGE_VERSION='20261105-acid-student-language';
const clone=x=>JSON.parse(JSON.stringify(x));
export function acidStudentLanguage(value){
 if(typeof value==='string')return value
  .replaceAll('손가락으로 시료를 문지른다','손가락으로 재료를 문지른다')
  .replaceAll('서로 다른 처음 양의 두 시료','처음 양이 서로 다른 두 용액')
  .replaceAll('처음 시료량/지시약량','처음 용액과 지시약의 양')
  .replaceAll('미지 시료','성질을 모르는 용액').replaceAll('실험 시료','실험용 용액')
  .replaceAll('시료량','용액의 양').replaceAll('시료색','용액의 색')
  .replace(/시료(?=\d)/g,'용액 ').replaceAll('시료','용액');
 if(Array.isArray(value))return value.map(acidStudentLanguage);
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,acidStudentLanguage(v)]));
 return value;
}
function presentation(q,book=false){
 const next={...q};for(const key of(book?['topic','prompt','choices','given','parts']:['prompt','choices','givens']))if(Object.hasOwn(q,key))next[key]=acidStudentLanguage(q[key]);
 if(!book&&q.taxonomy?.topic)next.taxonomy={...q.taxonomy,topic:acidStudentLanguage(q.taxonomy.topic)};
 return JSON.stringify(next)===JSON.stringify(q)?q:next;
}
// Apply after the 20261104 content revision so both earlier presentations remain restorable.
export function acidStudentCurrentItems(rows){return rows.map(q=>{
 if(!/^c22-s61-u01-b\d+$/.test(q.id)||q.workbookRef?.unit!=='c22-s61-u01'||q.status!=='authored'||q.sourceRef?.type==='similar'||q.contentVersion===ACID_STUDENT_LANGUAGE_VERSION)return q;
 const next=presentation(q);if(next===q)return q;
 const diagnosticOverride=q.diagnosticOverride?.version===(q.contentVersion||1)?{...clone(q.diagnosticOverride),version:ACID_STUDENT_LANGUAGE_VERSION}:q.diagnosticOverride;
 return {...next,...(diagnosticOverride?{diagnosticOverride}:{}),contentVersion:ACID_STUDENT_LANGUAGE_VERSION,previousVersions:[...(q.previousVersions?clone(q.previousVersions):[]),{...clone(q),version:q.contentVersion||1}]};
});}
const altText={
 observe:'같은 모양의 뚜껑이 있는 병 세 개에 맑은 무색·옅은 노란색·옅은 푸른색 액체가 따로 담긴 설명 장면.',
 phenol:'서로 다른 병의 무색·분홍빛 액체와 장갑 낀 교사가 들고 있는 스포이트를 보여 주는 설명 장면.',
 mixing:'서로 다른 병 세 개에 붉은색·보라색·푸른색 액체를 놓은 설명 장면.',
};
export function withAcidStudentLanguage(wb){
 if(wb.unit!=='c22-s61-u01'||wb.questions.length!==128||wb.pages.length!==99||wb.teacherStudentPages?.length!==99)throw Error('산과 염기 표현 편집 대상이 다릅니다.');
 const page=p=>({...p,title:acidStudentLanguage(p.title),section:acidStudentLanguage(p.section),blocks:p.blocks.map(b=>b.type==='questions'?b:acidStudentLanguage(b)),rail:p.rail.map(r=>r.title==='더 알아보기'?r:{...r,text:acidStudentLanguage(r.text)})});
 return {...wb,questions:wb.questions.map(q=>presentation(q,true)),pages:wb.pages.map(page),teacherStudentPages:wb.teacherStudentPages.map(page),figures:Object.fromEntries(Object.entries(wb.figures).map(([key,html])=>[key,html.replace(/>([^<]*)</g,(_,text)=>'>'+acidStudentLanguage(text)+'<').replace(/\balt="([^"]*)"/g,(match)=>altText[key]?'alt="'+altText[key]+'"':match)]))};
}
