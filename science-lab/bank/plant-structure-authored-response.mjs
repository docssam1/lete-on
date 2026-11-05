// Explicit contract for authored plant practice; no network, storage or score writer.
import {checkPlantStructureResponse} from './plant-structure-response.mjs';
const empty=v=>v==null||typeof v==='string'&&!v.trim()||Array.isArray(v)&&v.length===0;
const same=(a,b)=>Array.isArray(a)&&a.length===b.length&&a.every((x,i)=>x===b[i]);
const sequence=v=>{
 if(Array.isArray(v))return v.every(x=>typeof x==='string'&&/^[ㄱ-ㅎ]$/.test(x))?v:null;
 if(typeof v!=='string')return null;
 const s=v.normalize('NFC').replace(/[\s,·→>\-]/g,'');
 return /^[ㄱ-ㅎ]+$/.test(s)?[...s]:null;
};
function parts(v,n){
 if(Array.isArray(v))return sequence(v);
 if(typeof v!=='string')return null;
 if(!/\(\d+\)/.test(v))return sequence(v);
 const matches=[...v.matchAll(/\((\d+)\)\s*([ㄱ-ㅎ])/g)];
 if(matches.length!==n||v.replace(/\((\d+)\)\s*([ㄱ-ㅎ])/g,'').replace(/[\s,·;]/g,''))return null;
 const indexes=matches.map(m=>Number(m[1]));
 if(new Set(indexes).size!==n||indexes.some(i=>i<1||i>n))return null;
 return matches.map(m=>[Number(m[1]),m[2]]).sort((a,b)=>a[0]-b[0]).map(p=>p[1]);
}
export function checkAuthoredPlantResponse(q,value){
 const c=q.responseContract;if(!c)throw Error('식물 창작 응답 계약이 없습니다.');
 if(empty(value))return {status:'empty'};
 if(c.teacherRequired)return {status:'review'};
 if(c.kind==='ordered-label-parts')return {status:same(parts(value,c.answers.length),c.answers)?'correct':'wrong'};
 if(c.kind==='ordered-label-sequence')return {status:same(sequence(value),c.sequence)?'correct':'wrong'};
 return checkPlantStructureResponse(q,value);
}
