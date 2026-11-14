// Seasons practice contracts. Pure local checking; no storage or completion writer.
const isEmpty=v=>v==null||typeof v==='string'&&!v.trim()||Array.isArray(v)&&(v.length===0||Object.keys(v).length===v.length&&v.every(x=>typeof x==='string'&&!x.trim()));
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
function labels(value){
 const one=v=>typeof v==='string'&&/^[ㄱ-ㅎ]$/.test(v.trim())?v.trim():null;
 if(Array.isArray(value))return Array.from(value,one);
 if(typeof value!=='string')return null;
 const s=value.normalize('NFC').replace(/[\s,·→>\-]/g,'');
 return /^[ㄱ-ㅎ]+$/.test(s)?[...s]:null;
}
function parts(value,contracts){
 const n=contracts.length;
 if(Array.isArray(value))return value.length===n?Array.from(value):null;
 if(typeof value!=='string')return null;
 const s=value.trim().normalize('NFC'),markers=[...s.matchAll(/㉠|㉡|㉢|㉣|\([1-4]\)/g)];
 if(!markers.length){
  // ‘단위/칸’의 /는 단위의 일부다. 인정한 단위 안의 /와 답 사이 구분자를 나눈다.
  const protectedSlash=new Set();
  for(const unit of new Set(contracts.flatMap(p=>p.units||[]).filter(u=>u.includes('/')))){
   let at=s.indexOf(unit);while(at!==-1){for(let i=0;i<unit.length;i++)if(unit[i]==='/')protectedSlash.add(at+i);at=s.indexOf(unit,at+unit.length);}
  }
  const a=[];let start=0;
  for(let i=0;i<s.length;i++)if(/[,;\n]/.test(s[i])||s[i]==='/'&&!protectedSlash.has(i)){a.push(s.slice(start,i).trim());start=i+1;}
  a.push(s.slice(start).trim());return a.length===n?a:null;
 }
 if(markers.length!==n||s.slice(0,markers[0].index).trim())return null;
 const found=new Map();
 for(let i=0;i<markers.length;i++){
  const m=markers[i],index=m[0][0]==='('?Number(m[0][1])-1:'㉠㉡㉢㉣'.indexOf(m[0]);
  const v=s.slice(m.index+m[0].length,markers[i+1]?.index??s.length).replace(/^\s*[:=\-]\s*/,'').replace(/[\s,;/]+$/g,'').trim();
  if(found.has(index)||index>=n||index<0||!v)return null;found.set(index,v);
 }
 return Array.from({length:n},(_,i)=>found.get(i));
}
function numeric(value,c){
 if(typeof value==='number')return !c.unitRequired&&Number.isFinite(value)&&Math.abs(value-c.value)<=(c.tolerance??0);
 if(typeof value!=='string')return false;
 const m=value.trim().normalize('NFKC').match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*([^\d\s].*?)?\s*$/);
 if(!m||!Number.isFinite(Number(m[1])))return false;
 const unit=(m[2]||'').trim().replace(/[.!?。]+$/g,'');
 const validUnit=unit?c.units.some(u=>unit===u||unit.startsWith(u)&&ending.test(unit.slice(u.length))):!c.unitRequired;
 return validUnit&&Math.abs(Number(m[1])-c.value)<=(c.tolerance??0);
}
export function checkSeasonResponse(q,value){
 const c=q.responseContract;if(!c)throw Error('계절의 변화 응답 계약이 없습니다.');
 if(isEmpty(value))return {status:'empty'};
 if(c.teacherRequired)return {status:'review'};
 let correct=false;
 switch(c.kind){
  case 'single-choice':correct=choice(value)===c.answer;break;
  case 'multi-choice':{
   let a=Array.isArray(value)?Array.from(value):typeof value==='string'?value.split(/[\s,·/]+/).filter(Boolean):null;
   if(typeof value==='string'&&/^[①②③④⑤]+$/.test(value.replace(/[\s,·/]+/g,'')))a=[...value.replace(/[\s,·/]+/g,'')];
   const b=a?.map(choice);correct=!!b&&b.length===c.answers.length&&b.every(Number.isInteger)&&new Set(b).size===b.length&&b.every(x=>c.answers.includes(x));break;
  }
  case 'short-text':correct=matches(value,c.accepted);break;
  case 'ordered-term-parts':{const a=parts(value,c.parts);correct=!!a&&a.every((v,i)=>c.parts[i].kind==='number-unit'?numeric(v,c.parts[i]):matches(v,c.parts[i].accepted));break;}
  case 'ordered-label-sequence':{const a=labels(value);correct=!!a&&a.length===c.sequence.length&&a.every((v,i)=>v===c.sequence[i]);break;}
  case 'unordered-labels':{const a=labels(value);correct=!!a&&a.length===c.answers.length&&new Set(a).size===a.length&&a.every(v=>c.answers.includes(v));break;}
  case 'number-unit':correct=numeric(value,c);break;
  default:throw Error('지원하지 않는 계절 응답 계약: '+c.kind);
 }
 return {status:correct?'correct':'wrong'};
}
