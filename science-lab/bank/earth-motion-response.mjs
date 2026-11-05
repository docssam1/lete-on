// 지구의 운동: 공개 전 원고와 독립 연습의 응답 계약. 앱 연결은 별도 검수 뒤 한다.
const empty=v=>v==null||typeof v==='string'&&!v.trim()||Array.isArray(v)&&v.length===0;
const norm=v=>String(v??'').normalize('NFKC').replace(/\s+/g,'').replace(/[.!?。]+$/g,'');
const ending=/^(?:입니다|이에요|예요|에요|이다|이야|야|요)$/;
const matches=(v,accepted)=>typeof v==='string'&&accepted.some(a=>{
 const s=norm(v),t=norm(a);return s===t||s.startsWith(t)&&ending.test(s.slice(t.length));
});
const choice=v=>{
 if(typeof v==='number')return Number.isInteger(v)&&v>=0&&v<5?v:NaN;
 if(typeof v!=='string')return NaN;
 const s=v.trim();return /^[0-4]$/.test(s)?Number(s):/^[①②③④⑤]$/.test(s)?'①②③④⑤'.indexOf(s):NaN;
};
function parts(v,n){
 if(Array.isArray(v))return v.length===n?Array.from(v):null;
 if(typeof v!=='string')return null;
 const s=v.trim().normalize('NFC'),markers=[...s.matchAll(/㉠|㉡|\([12]\)/g)];
 if(!markers.length){const a=s.split(/[,/;\n]+/).map(x=>x.trim()).filter(Boolean);return a.length===n?a:null;}
 if(markers.length!==n||s.slice(0,markers[0].index).trim())return null;
 const found=new Map();
 for(let i=0;i<markers.length;i++){
  const m=markers[i],index=['㉠','(1)'].includes(m[0])?0:1;
  const value=s.slice(m.index+m[0].length,markers[i+1]?.index??s.length).replace(/^\s*[:=\-]\s*/,'').replace(/[\s,;/]+$/g,'').trim();
  if(found.has(index)||index>=n||!value)return null;found.set(index,value);
 }
 return Array.from({length:n},(_,i)=>found.get(i));
}
export function checkEarthMotionResponse(q,value){
 const c=q.responseContract;if(!c)throw Error('지구의 운동 응답 계약이 없습니다.');
 if(empty(value))return {status:'empty'};
 // 모호한 원문과 열린 설명은 공식 답을 입력해도 자동 정답이 되지 않는다.
 if(c.teacherRequired)return {status:'review'};
 let ok=false;
 switch(c.kind){
  case 'single-choice':ok=choice(value)===c.answer;break;
  case 'multi-choice':{
   let a=Array.isArray(value)?value:typeof value==='string'?value.split(/[\s,·/]+/).filter(Boolean):null;
   if(typeof value==='string'&&/^[①②③④⑤]+$/.test(value.replace(/[\s,·/]+/g,'')))a=[...value.replace(/[\s,·/]+/g,'')];
   const b=a?Array.from(a,choice):null;ok=!!b&&b.length===c.answers.length&&b.every(Number.isInteger)&&new Set(b).size===b.length&&b.every(x=>c.answers.includes(x));break;
  }
  case 'short-text':ok=matches(value,c.accepted);break;
  case 'ordered-word-parts':{const a=parts(value,c.parts.length);ok=!!a&&a.every((x,i)=>matches(x,c.parts[i].accepted));break;}
  default:throw Error('지원하지 않는 지구의 운동 응답 계약: '+c.kind);
 }
 return {status:ok?'correct':'wrong'};
}
