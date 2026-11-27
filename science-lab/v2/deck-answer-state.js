import{judgeShort}from'./judge.js';
export const deckPredictionKey=(unit,ch)=>{const suffix=ch.predictionKey||(ch.revisedThinkingClassroom?'thinking-v1':'');return`${unit}:predict${suffix?':'+suffix:''}`;};
export const deckSlideRecordKey=(ch,slide)=>ch.revisedThinkingClassroom&&slide.item?`item:${slide.item}${slide.questionVersion?`:version:${slide.questionVersion}`:''}`:slide.memoKey||slide.id;
export function judgeDeckCloze(text,contract,key){
 const match=/:blank:(\d+)$/.exec(key);if(contract?.type!=='cloze'||!match)return null;const blank=contract.blanks[Number(match[1])];if(!blank)return null;
 const result=judgeShort(text,blank.accepted?.length?blank.accepted:[blank.answer]);return{...result,st:result.st==='no'?'miss':result.st,short:true,missing:[]};
}

// 편집된 수업의 교사 확인에는 당시 문제를 함께 보존한다.
export function deckQuestionSnapshot(slide,pool){const q=slide.questionVersion&&pool.find(q=>q.id===slide.item);return q?JSON.parse(JSON.stringify(q)):undefined;}

// Keep each revised question's input and teacher-review keys tied to its version.
// Older unversioned records remain untouched in the store.
export function withVersionedQuestionSlides(slides,pool){
 const byId=new Map(pool.map(q=>[q.id,q]));let next=slides;
 slides.forEach((slide,i)=>{
  const q=byId.get(slide.item);if(!q?.contentVersion)return;
  const base=`test:item:${q.id}`,version=String(q.contentVersion),body=slide.body.replace(/data-k="([^"]*)"/g,(attribute,key)=>{
   if(key!==base&&!key.startsWith(base+':'))return attribute;
   const suffix=key.slice(base.length).replace(/^:version:[^:]*/,'');
   return `data-k="${base}:version:${version}${suffix}"`;
  });
  if(slide.questionVersion===q.contentVersion&&body===slide.body)return;
  if(next===slides)next=slides.slice();next[i]={...slide,body,questionVersion:q.contentVersion};
 });
 return next;
}
