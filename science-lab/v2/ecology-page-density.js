// Reflow related checks without changing questions, pictures or drawing pages.
export const ECOLOGY_DENSITY_VERSION='20261124-ecology-page-density';
const unit='c22-s42-u02',prior='c95290e947b76aa7',cache=new WeakMap();
function fingerprint(value){let a=2166136261,b=3335557771;for(const c of JSON.stringify(value)){const n=c.charCodeAt(0);a=Math.imul(a^n,16777619);b=Math.imul(b^n,2246822519);}return(a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');}
const ids=p=>p.blocks.flatMap(b=>b.ids||[]),number=id=>Number(id?.split('-w').at(-1));
const spans=[
 {first:61,last:66,sizes:[3,3],titles:['생물이 살아갈 곳을 지켜요','생태계를 지키는 방법을 찾아요'],templates:[0,2]},
 {first:69,last:78,sizes:[3,4,3],titles:['생태계를 지키는 행동을 골라요','오염과 보전 방법을 정리해요','보전 활동을 이어 생각해요'],templates:[0,1,3]}
];
export function withEcologyPageDensity(w){
 if(w?.unit!==unit||fingerprint(w)!==prior)return w;if(cache.has(w))return cache.get(w);
 function arrange(input){const pages=[];for(let i=0;i<input.length;i++){
  const p=input[i],span=spans.find(s=>number(ids(p)[0])===s.first);if(!span){pages.push(p);continue;}
  const originals=[],all=[];let j=i;
  while(all.length<span.last-span.first+1){const next=input[j++];if(!next||next.blocks.length!==1||next.blocks[0].type!=='questions')throw Error('Ecology density would move non-question content');originals.push(next);all.push(...ids(next));}
  if(all.length!==span.last-span.first+1||all.some((id,k)=>id!==unit+'-w'+String(span.first+k).padStart(3,'0')))throw Error('Incomplete ecology density span');
  for(const p of originals)if(!span.templates.some(k=>JSON.stringify(originals[k].rail)===JSON.stringify(p.rail)))throw Error('Ecology density would lose a side note');
  let at=0;for(let k=0;k<span.sizes.length;k++){const group=all.slice(at,at+span.sizes[k]);at+=span.sizes[k];pages.push({...originals[span.templates[k]],layout:'ecology-density',title:span.titles[k],section:'확인 문제 '+number(group[0])+'~'+number(group.at(-1)),blocks:[{type:'questions',ids:group}]});}
  i=j-1;
 }return pages;}
 const result={...w,pages:arrange(w.pages),teacherStudentPages:arrange(w.teacherStudentPages)};cache.set(w,result);return result;
}
