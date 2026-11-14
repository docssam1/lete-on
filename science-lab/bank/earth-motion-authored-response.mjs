// Fixed authored workbook contracts. No storage, network or performance-completion writer.
import {checkEarthMotionResponse} from './earth-motion-response.mjs';
const empty=v=>v==null||typeof v==='string'&&!v.trim()||Array.isArray(v)&&(v.length===0||Object.keys(v).length===v.length&&v.every(x=>typeof x==='string'&&!x.trim()));
const equal=(a,b)=>Array.isArray(a)&&a.length===b.length&&Array.from(a).every((v,i)=>v===b[i]);
const label=v=>typeof v==='string'&&/^[ㄱ-ㅎ]$/.test(v.trim())?v.trim():null;
function labels(value){
 if(Array.isArray(value))return Array.from(value,label);
 if(typeof value!=='string')return null;
 const s=value.normalize('NFC').replace(/[\s,·→>\-]/g,'');
 return /^[ㄱ-ㅎ]+$/.test(s)?[...s]:null;
}
function numberedLabels(value,n){
 if(typeof value!=='string'||!/[()]|[0-9]/.test(value))return labels(value);
 const matches=[...value.matchAll(/\((\d+)\)\s*([ㄱ-ㅎ])/g)];
 if(matches.length!==n||value.replace(/\((\d+)\)\s*([ㄱ-ㅎ])/g,'').replace(/[\s,·;/]/g,''))return null;
 const found=new Map();for(const m of matches){const i=Number(m[1])-1;if(i<0||i>=n||found.has(i))return null;found.set(i,m[2]);}
 return Array.from({length:n},(_,i)=>found.get(i));
}
function termParts(value,parts){
 const n=parts.length;if(Array.isArray(value))return value.length===n?Array.from(value):null;
 if(typeof value!=='string')return null;
 const s=value.trim(),matches=[...s.matchAll(/㉠|㉡|㉢|\([1-3]\)/g)];
 if(!matches.length)return n===1?[s]:s.split(/[,/;\n]/).map(v=>v.trim());
 if(matches.length!==n||s.slice(0,matches[0].index).trim())return null;
 const found=new Map();for(let i=0;i<matches.length;i++){
  const m=matches[i],index=m[0][0]==='('?Number(m[0][1])-1:'㉠㉡㉢'.indexOf(m[0]);
  const v=s.slice(m.index+m[0].length,matches[i+1]?.index??s.length).replace(/^\s*[:=\-]\s*/,'').replace(/[\s,;/]+$/g,'').trim();
  if(index<0||index>=n||found.has(index)||!v)return null;found.set(index,v);
 }
 return Array.from({length:n},(_,i)=>found.get(i));
}
export function checkAuthoredEarthMotionResponse(q,value){
 const c=q.responseContract;if(!c)throw Error('지구의 운동 창작 응답 계약이 없습니다.');
 if(empty(value))return {status:'empty'};
 if(c.teacherRequired)return {status:'review'};
 if(c.kind==='ordered-label-parts')return {status:equal(numberedLabels(value,c.answers.length),c.answers)?'correct':'wrong'};
 if(c.kind==='ordered-label-sequence')return {status:equal(labels(value),c.sequence)?'correct':'wrong'};
 if(c.kind==='ordered-term-parts'){
  const a=termParts(value,c.parts);const ok=a?.length===c.parts.length&&Array.from(a).every((v,i)=>typeof v==='string'&&checkEarthMotionResponse({responseContract:{kind:'short-text',accepted:c.parts[i].accepted}},v).status==='correct');
  return {status:ok?'correct':'wrong'};
 }
 return checkEarthMotionResponse(q,value);
}
