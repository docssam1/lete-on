// 창작 운동 문항의 응답 계약. 수업·Daily·소단원과 독립 검산에서 같은 판정을 사용합니다.
const empty=v=>v===null||v===undefined||typeof v==='string'&&!v.trim()||Array.isArray(v)&&v.length===0;
const norm=v=>String(v??'').normalize('NFKC').replace(/\s+/g,'').replace(/[.!?。]/g,'');
const ending=/^(?:요|예요|에요|이에요|입니다|이다|다|이야|야|해요|합니다|한다|함|라고요|이라고요)$/;
const symbols=v=>{
 if(Array.isArray(v))return v;
 let s=String(v).trim();
 s=s.replace(/[\s,→>\-]/g,'');return /^[ㄱ-ㅎ]+$/.test(s)?[...s]:null;
};
const partValues=(v,n)=>{
 if(Array.isArray(v))return v;
 const s=String(v);if(!/\(\d+\)/.test(s))return symbols(v);
 const matches=[...s.matchAll(/\((\d+)\)\s*([ㄱ-ㅎ])/g)];
 if(matches.length!==n||s.replace(/\((\d+)\)\s*([ㄱ-ㅎ])/g,'').replace(/[\s,]/g,''))return null;
 const pairs=matches.map(m=>[Number(m[1]),m[2]]);
 if(new Set(pairs.map(p=>p[0])).size!==n||pairs.some(p=>p[0]<1||p[0]>n))return null;
 return pairs.sort((a,b)=>a[0]-b[0]).map(p=>p[1]);
};
const same=(a,b)=>Array.isArray(a)&&a.length===b.length&&a.every((v,i)=>v===b[i]);
const asNumber=v=>typeof v==='number'?v:/^\d+$/.test(String(v))?Number(v):NaN;
export function checkAuthoredMotionResponse(q,value){
 const c=q.responseContract;if(!c)throw Error('응답 계약이 없습니다.');
 if(empty(value))return {status:'empty'};
 if(c.teacherRequired)return {status:'review'};
 let ok=false;
 if(c.kind==='single-choice')ok=asNumber(value)===c.answer;
 else if(c.kind==='multi-choice'){
  const a=Array.isArray(value)?value.map(asNumber):null;
  ok=!!a&&new Set(a).size===a.length&&same(a.sort((x,y)=>x-y),[...c.answers].sort((x,y)=>x-y));
 }else if(c.kind==='ordered-parts')ok=same(partValues(value,c.answers.length),c.answers);
 else if(c.kind==='ordered-sequence')ok=same(symbols(value),c.sequence);
 else if(c.kind==='coordinate-pair'){
  let s=String(value).trim();if(s.startsWith('(')&&s.endsWith(')'))s=s.slice(1,-1);
  const m=s.match(/^\s*(\d+)\s*,\s*(\d+)\s*$/)||s.match(/^가로\s*(\d+)\s*[,·]?\s*세로\s*(\d+)\s*$/);
  ok=!!m&&same([Number(m[1]),Number(m[2])],c.values);
 }else if(c.kind==='unordered-label-set'){
  const a=Array.isArray(value)?value:String(value).replace(/[\s,·와과]/g,'').split('');
  ok=new Set(a).size===a.length&&same([...a].sort(),[...c.values].sort());
 }else if(c.kind==='quantity'){
  const s=String(value).replace(/\s+/g,'');
  const m=s.match(/^([0-9]+(?:\.[0-9]+)?)(?:m\/s|미터\/초|미터매초)$/)||s.match(/^초속([0-9]+(?:\.[0-9]+)?)(?:m|미터)$/)||s.match(/^1초에([0-9]+(?:\.[0-9]+)?)(?:m|미터)$/);
  ok=!!m&&Number(m[1])===c.value;
 }else if(c.kind==='short-text'){const t=norm(value);ok=c.accepted.some(a=>{const k=norm(a);return k&&(t===k||t.startsWith(k)&&ending.test(t.slice(k.length)));});}
 else throw Error('지원하지 않는 검수 계약: '+c.kind);
 return {status:ok?'correct':'wrong'};
}
