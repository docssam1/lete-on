// 승인 자료를 질문과 현재 진도에 맞춰 고른다. 검색과 요약에는 모델을 사용하지 않는다.
const STOP=new Set(['어떻게','무엇','우리','아이','학생','지금','현재','질문','상담','해주세요','알려주세요','좋을까요','해야','하는','있나요','있어요','정도','그냥','대해','학습','공부']);
export function clean(value,max=2000){
 return String(value??'').normalize('NFC').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f<>]/g,'')
  .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,'[이메일 제외]')
  .replace(/(?:\+82[ -]?)?0?1[016789][ -]?\d{3,4}[ -]?\d{4}\b/g,'[연락처 제외]').trim().slice(0,max);
}
function terms(value){
 return [...new Set(clean(value).toLowerCase().match(/[가-힣a-z0-9]+/g)||[])]
  .map(t=>t.replace(/(에서는|으로는|에서|까지|부터|보다|에게|처럼|하고|이랑|이라|으로|들을|들이|은|는|을|를|이|가|와|과)$/,''))
  .filter(t=>t.length>=2&&!STOP.has(t));
}
function matching(text,word){
 if(text.includes(word))return 1;
 if(word.length<4||!/^[가-힣]+$/.test(word))return 0;
 for(let i=0;i<word.length-1;i++)if(text.includes(word.slice(i,i+2)))return .3;
 return 0;
}
export function selectKnowledge(rows,{question,progress='',stage='all'}){
 const q=terms(question),p=terms(progress);
 if(!q.length)return [];
 return rows.filter(r=>r.status==='approved'&&(r.stage==='all'||stage==='all'||r.stage===stage)).map(r=>{
  const title=r.title.toLowerCase(),body=r.body.toLowerCase();
  const questionScore=q.reduce((n,t)=>n+matching(title,t)*5+matching(body,t),0);
  const progressScore=p.reduce((n,t)=>n+matching(title+' '+body,t),0);
  return {r,questionScore,score:questionScore+Math.min(progressScore,3)+(r.kind==='knowhow'?1:0)};
 }).filter(x=>x.questionScore>=1).sort((a,b)=>b.score-a.score||b.r.updated_at.localeCompare(a.r.updated_at)||a.r.id.localeCompare(b.r.id))
  .slice(0,3).map(x=>x.r);
}
export function answerFromSources(rows,{progress=''}){
 if(!rows.length)return {summary:'이 질문에 맞는 승인 자료를 아직 찾지 못했습니다.',explanation:'현재 교재와 단원, 혼자 풀 수 있는 범위, 가장 궁금한 점을 조금 더 구체적으로 적어 주세요. 자료로 확인하기 어려운 내용은 독쌤에게 상담을 요청해 주세요.',next:'새 자료가 승인되면 다시 질문할 때 함께 살펴볼 수 있습니다.'};
 const first=rows[0],sentences=first.body.match(/[^.!?。！？]+[.!?。！？]?/g)||[first.body];
 return {
  summary:sentences.slice(0,2).join('').trim(),
  explanation:(progress?'적어 주신 현재 진도와 함께 살펴볼 자료를 찾았습니다. ':'질문과 관련된 자료를 찾았습니다. ')+
   '아래 안내에서 지금 해당하는 내용을 먼저 확인해 주세요. 자료의 확인일과 현재 학교·학원의 공식 안내도 함께 확인하시면 좋겠습니다.',
  next:'우선 적용할 공부 한 가지를 정하고, 혼자 풀 수 있는 범위와 어려웠던 유형을 다음 점검 때 확인해 주세요.'
 };
}
