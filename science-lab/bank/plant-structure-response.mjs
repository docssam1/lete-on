// Isolated response contract for the plant structure bank; runtime opt-in is a later gate.
const empty=v=>v==null||typeof v==='string'&&!v.trim()||Array.isArray(v)&&v.length===0;
const norm=v=>String(v??'').normalize('NFKC').replace(/\s+/g,'').replace(/[.!?。]+$/g,'');
const endings=/^(?:입니다|이에요|예요|에요|이다|이야|야|요)$/;
const textMatches=(v,accepted)=>{
 if(typeof v!=='string')return false;
 const t=norm(v);return accepted.some(a=>{const k=norm(a);return t===k||t.startsWith(k)&&endings.test(t.slice(k.length));});
};
const choice=v=>{
 if(typeof v==='number')return Number.isInteger(v)&&v>=0&&v<5?v:NaN;
 if(typeof v!=='string')return NaN;
 const s=v.trim();if(/^[0-4]$/.test(s))return Number(s);
 return /^[①②③④⑤]$/.test(s)?'①②③④⑤'.indexOf(s):NaN;
};
const labels=v=>{
 const a=Array.isArray(v)?v:typeof v==='string'?v.normalize('NFC').split(/[\s,·/와과]+/).filter(Boolean):null;
 // Compact compatibility letters are allowed; words and duplicated letters are not.
 const b=a?.flatMap(s=>typeof s==='string'&&/^[ㄱ-ㅎ]+$/.test(s)?[...s]:[s]);
 return b?.every(s=>typeof s==='string'&&/^[ㄱ-ㅎ]$/.test(s))?b:null;
};
const boolean=v=>{
 if(v===true||v===false)return v;
 if(typeof v!=='string')return null;
 const s=v.trim().toUpperCase();if(['O','○','◯','TRUE'].includes(s))return true;
 if(['X','×','✕','FALSE'].includes(s))return false;return null;
};
const partValues=(v,n,isBoolean)=>{
 if(Array.isArray(v))return v.length===n?v:null;
 if(typeof v!=='string')return null;
 const s=v.trim().normalize('NFC');
 // Named parts may be entered out of display order, but must bind to the right slot.
 const marker=/㉠|㉡|\([12]\)/g;
 const matches=[...s.matchAll(marker)];
 if(matches.length){
  if(matches.length!==n||s.slice(0,matches[0].index).trim())return null;
  const found=new Map();
  for(let i=0;i<matches.length;i++){
   const m=matches[i],index=['㉠','(1)'].includes(m[0])?0:1;
   if(found.has(index)||index>=n)return null;
   const value=s.slice(m.index+m[0].length,matches[i+1]?.index??s.length).replace(/^\s*[:=\-]\s*/,'').replace(/[\s,;/]+$/g,'').trim();
   if(!value)return null;found.set(index,value);
  }
  return Array.from({length:n},(_,i)=>found.get(i));
 }
 const a=s.split(/[,/;\n]+/).map(x=>x.trim()).filter(Boolean);if(a.length===n)return a;
 if(isBoolean){const b=s.replace(/\s+/g,'');if(/^[OX○◯×✕]{2}$/i.test(b))return [...b];}
 return null;
};
export function checkPlantStructureResponse(q,value){
 const c=q.responseContract;if(!c)throw Error('식물 응답 계약이 없습니다.');
 if(empty(value))return {status:'empty'};
 if(c.teacherRequired)return {status:'review'};
 let ok=false;
 switch(c.kind){
  case 'single-choice':ok=choice(value)===c.answer;break;
  case 'multi-choice':{
   let a=Array.isArray(value)?value:typeof value==='string'?value.split(/[\s,·/]+/).filter(Boolean):null;
   if(typeof value==='string'&&/^[①②③④⑤]+$/.test(value.replace(/[\s,·/]+/g,'')))a=[...value.replace(/[\s,·/]+/g,'')];
   const b=a?.map(choice);ok=!!b&&b.length===c.answers.length&&b.every(Number.isInteger)&&new Set(b).size===b.length&&b.every(x=>c.answers.includes(x));break;
  }
  case 'short-text':ok=textMatches(value,c.accepted);break;
  case 'unordered-label-set':{
   const a=labels(value);ok=!!a&&a.length===c.answers.length&&new Set(a).size===a.length&&a.every(x=>c.answers.includes(x));break;
  }
  case 'ordered-word-parts':{
   const a=partValues(value,c.parts.length,false);ok=!!a&&a.every((v,i)=>textMatches(v,c.parts[i].accepted));break;
  }
  case 'ordered-boolean-parts':{
   const a=partValues(value,c.answers.length,true);ok=!!a&&a.every((v,i)=>boolean(v)===c.answers[i]);break;
  }
  default:throw Error('지원하지 않는 식물 응답 계약: '+c.kind);
 }
 return {status:ok?'correct':'wrong'};
}
