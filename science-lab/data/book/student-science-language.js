// 뜻과 답은 유지하고, 검수한 두 단원의 조사와 전기 표현만 바로잡는다.
export const STUDENT_SCIENCE_LANGUAGE_VERSION='20261104-student-science-language';
const replacements={
 'c22-s62-u04':[['일를','일을'],['일와','일과'],['관계을','관계를'],['알 수 있는 것를','알 수 있는 것을'],['남은 아직 알 수 없는 것','더 알아볼 것'],['과학과의 관계의 근거','과학과 관련됨을 설명하는 근거']],
 'c22-s62-u03':[['전류를 켠 조건의 작용','전지를 연결했을 때의 변화'],['전류를 켠 때','전지를 연결했을 때']]
};
export function studentScienceLanguage(value,unit){
 const rules=replacements[unit];if(!rules)return value;
 if(typeof value==='string')return rules.reduce((s,[a,b])=>s.replaceAll(a,b),value);
 if(Array.isArray(value))return value.map(v=>studentScienceLanguage(v,unit));
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,studentScienceLanguage(v,unit)]));
 return value;
}
export function withStudentScienceLanguage(book){
 const next=studentScienceLanguage(book,book.unit);if(book.unit!=='c22-s62-u04')return next;
 for(const key of['pages','teacherStudentPages'])if(next[key])next[key]=next[key].map((p,i)=>{
  if(i===65)return{...p,blocks:p.blocks.map(b=>b.type==='example'?{...b,question:'사진과 음악에 모두 관심이 있어요. 두 분야에서 어떤 과학을 찾아볼까요?',steps:[['관심 있는 일 떠올리기','사진을 찍거나 악기의 음높이를 맞추는 일을 알아보아요.'],['관련된 과학 찾기','사진에는 빛이, 악기 조율에는 진동과 소리가 관련돼요.'],['자료로 알아보기','그 일을 어떻게 하는지 자료를 읽고 어떤 도구와 과학을 이용하는지 찾아요.']],answer:'관심 있는 일이 여러 가지여도 괜찮아요. 각 일에서 이용하는 과학을 찾아볼 수 있어요.'}:b)};
  if(i===66)return{...p,blocks:p.blocks.map(b=>b.type==='text'&&b.text.startsWith('악기수리원과 조율사는')?{...b,text:'악기수리원과 조율사는 악기의 상태와 소리를 살피고 음높이를 맞추는 일을 해요. 소리를 들어 비교하고 측정 도구도 이용해요.'}:b.type==='text'&&b.text.startsWith('함께 묻기:')?{...b,text:'소리를 듣고 비교하는 일에는 어떤 과학이 관련될까요?'}:b.type==='text'&&b.text.startsWith('읽을 때의 범위:')?{...b,text:'어떤 악기의 상태를 살피는지, 소리를 비교할 때 어떤 도구를 사용하는지 자료에서 찾아보아요.'}:b)};
  if(i===79)return{...p,blocks:p.blocks.map(b=>b.type==='example'?{...b,question:'전자 피아노도 해머로 현을 쳐서 소리를 낼까요?',steps:[['피아노의 구조 살펴보기','해머가 현을 치면 현이 떨리고 울림판으로 진동이 전달돼요.'],['전자 피아노 알아보기','전자 피아노가 소리를 내는 방법은 그 악기의 구조를 설명한 자료에서 찾아요.'],['직업과 연결하기','조율사와 악기 수리원이 하는 일을 알아볼 때 악기의 구조와 소리 나는 방법을 함께 살펴요.']],answer:'악기의 종류에 따라 소리를 내는 방법이 달라질 수 있어요. 한 악기의 설명을 모든 악기에 그대로 적용할 수는 없어요.'}:b)};
  return p;
 });
 return next;
}
const clone=value=>JSON.parse(JSON.stringify(value));
export function withStudentScienceQuestionLanguage(rows,unit){return rows.map(q=>{
 if(!q.id?.startsWith(unit+'-')||q.contentVersion===STUDENT_SCIENCE_LANGUAGE_VERSION)return q;
 const{previousVersions,diagnosticOverride,contentVersion,...presentation}=q,next=studentScienceLanguage(presentation,unit);
 if(JSON.stringify(next)===JSON.stringify(presentation))return q;
 return{...next,...(diagnosticOverride?{diagnosticOverride:{...clone(diagnosticOverride),version:STUDENT_SCIENCE_LANGUAGE_VERSION}}:{}),contentVersion:STUDENT_SCIENCE_LANGUAGE_VERSION,previousVersions:[...(previousVersions?clone(previousVersions):[]),{...clone(q),version:contentVersion||1}]};
});}
