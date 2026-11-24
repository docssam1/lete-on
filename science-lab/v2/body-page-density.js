// Keep complete same-topic questions together. Drawing and observation pages stay intact.
export const BODY_DENSITY_VERSION='20261124-body-page-density';
const unit='c22-s51-u04',prior='1d76bc67f8ca1c25',cache=new WeakMap();
function fingerprint(value){let a=2166136261,b=3335557771;for(const c of JSON.stringify(value)){const n=c.charCodeAt(0);a=Math.imul(a^n,16777619);b=Math.imul(b^n,2246822519);}return(a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');}
const groups=[[5,8,"뼈와 근육의 역할"],[11,16,"음식물의 길과 영양소 흡수"],[17,22,"심장과 혈액의 역할"],[23,28,"공기의 길과 호흡 모형"],[29,34,"오줌과 음식물 찌꺼기의 길"],[35,40,"같은 시간 동안 몸의 변화를 비교해요"],[41,44,"질병과 예방 행동"],[63,68,"관찰 조건과 근육의 움직임"],[92,96,"여러 기관의 기능을 다시 살펴요"]];
const ids=p=>p.blocks.flatMap(b=>b.ids||[]),no=id=>Number(id.split('-').at(-1));
export function withBodyPageDensity(w){
 if(w?.unit!==unit||fingerprint(w)!==prior)return w;if(cache.has(w))return cache.get(w);
 function arrange(input,teacher=false){
  const map=new Map(),pages=[];
  for(let i=0;i<input.length;i++){
   const p=input[i],g=groups.filter(([a])=>!teacher||[35,41].includes(a)).find(([a])=>p.kind==='practice'&&no(ids(p)[0])===a);
   if(!g){map.set(i,pages.length);pages.push(p);continue;}
   const originals=[];let j=i;
   while(j<input.length&&input[j].kind==='practice'&&ids(input[j]).length&&ids(input[j]).every(id=>no(id)>=g[0]&&no(id)<=g[1]))originals.push(input[j++]);
   const all=originals.flatMap(ids);if(all.length!==g[1]-g[0]+1)throw Error('Incomplete body page group '+g[0]);
   for(let k=i;k<j;k++)map.set(k,pages.length);
   const rail=p.rail.map((note,k)=>({...note,text:[...new Set(originals.map(p=>p.rail[k].text).filter(Boolean))].join(' ')}));
   pages.push({...p,layout:'body-density',section:'연습 '+g[0]+'~'+g[1],title:g[2],blocks:[{type:'questions',ids:all}],rail,...(originals.some(p=>p.teacherNote)?{teacherNote:originals.map(p=>p.teacherNote).filter(Boolean).join(' ')}:{})});i=j-1;
  }
  return pages.map(p=>({...p,blocks:p.blocks.map(b=>b.type==='table'&&b.heads?.[0]==='궁금한 내용'?{...b,rows:b.rows.map(row=>{const match=String(row[1]).match(/^(\d+)~(\d+)쪽$/);return match?[row[0],(map.get(+match[1]-1)+1)+'~'+(map.get(+match[2]-1)+1)+'쪽',...row.slice(2)]:row;})}:b)}));
 }
 const result={...w,pages:arrange(w.pages),teacherStudentPages:arrange(w.teacherStudentPages,true)};cache.set(w,result);return result;
}
