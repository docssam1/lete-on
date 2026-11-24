// Reflow related short checks while preserving question objects and drawing pages.
export const EARLY_DENSITY_VERSION='20261124-early-science-page-density';
const configs={
 's41-u03':{prior:'15d7093864cec22e',spans:[
  {first:3,last:8,sizes:[3,3],titles:['흐르는 물의 작용을 찾아요','흙 언덕을 같은 조건으로 비교해요']},
  {first:27,last:29,sizes:[3],titles:['화산과 모형을 비교해요']},
  {first:61,last:70,sizes:[3,3,4],titles:['대피할 길과 피해를 살펴요','몸을 보호하고 안전하게 이동해요','자료를 찾고 안전하게 연습해요']}
 ]},
 's41-u04':{prior:'689725429543957c',spans:[
  {first:24,last:26,sizes:[3],titles:['관찰한 특징으로 생물을 나누어요']},
  {first:49,last:52,sizes:[4],titles:['생활 속 영향을 조사하고 발표해요'],teacherSizes:[2,2],teacherTitles:['생활 속 영향과 자료를 이어요','자료를 살펴보고 발표를 준비해요']},
  {first:76,last:78,sizes:[3],titles:['이용 사례를 소개하고 질문을 들어요']}
 ]}
};
const cache=new WeakMap(),ids=p=>p.blocks.flatMap(b=>b.ids||[]),number=id=>Number(id?.split('-w').at(-1)),same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function fingerprint(value){let a=2166136261,b=3335557771;for(const c of JSON.stringify(value)){const n=c.charCodeAt(0);a=Math.imul(a^n,16777619);b=Math.imul(b^n,2246822519);}return(a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');}
function sideNotes(pages){
 const first=pages[0].rail;if(pages.every(p=>same(p.rail,first)))return first;
 if(pages.some(p=>p.rail.length!==first.length))throw Error('Different side-note structures');
 return first.map((note,i)=>{
  const notes=pages.map(p=>p.rail[i]);if(notes.every(n=>same(n,note)))return note;
  if(notes.some(n=>n.title!==note.title||Object.keys(n).some(k=>!['title','text','items'].includes(k))))throw Error('Unsupported side-note content');
  const texts=[...new Set(notes.flatMap(n=>[...(n.text?[n.text]:[]),...(n.items||[])]))];
  return{title:note.title,items:texts};
 });
}
export function withEarlySciencePageDensity(w){
 const config=configs[w?.unit];if(!config||fingerprint(w)!==config.prior)return w;if(cache.has(w))return cache.get(w);
 function arrange(input,teacher=false){const output=[];for(let i=0;i<input.length;i++){
  const p=input[i],span=config.spans.find(s=>number(ids(p)[0])===s.first);if(!span){output.push(p);continue;}
  const originals=[],all=[];let j=i;
  while(all.length<span.last-span.first+1){const next=input[j++];if(!next||next.blocks.length!==1||next.blocks[0].type!=='questions')throw Error('Density would move non-question content');originals.push(next);all.push(...ids(next));}
  if(all.length!==span.last-span.first+1||all.some((id,k)=>id!==w.unit+'-w'+String(span.first+k).padStart(3,'0')))throw Error('Incomplete density span');
  for(const old of originals)for(const key of Object.keys(old))if(!['title','section','blocks','rail','layout'].includes(key)&&!same(old[key],p[key]))throw Error('Density would lose page metadata');
  const sizes=teacher&&span.teacherSizes||span.sizes,titles=teacher&&span.teacherTitles||span.titles;let at=0;for(let k=0;k<sizes.length;k++){const group=all.slice(at,at+sizes[k]);at+=sizes[k];const notesFrom=originals.filter(p=>ids(p).some(id=>group.includes(id)));output.push({...notesFrom[0],layout:'early-science-density',title:titles[k],section:'확인 문제 '+number(group[0])+'~'+number(group.at(-1)),blocks:[{type:'questions',ids:group}],rail:sideNotes(notesFrom)});}
  if(at!==all.length)throw Error('Density did not place every question');i=j-1;
 }return output;}
 const result={...w,pages:arrange(w.pages),teacherStudentPages:arrange(w.teacherStudentPages,true)};cache.set(w,result);return result;
}
