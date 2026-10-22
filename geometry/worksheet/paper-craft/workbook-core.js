import {catalog,activityIds,buildActivity} from '../../shared/paper-craft-catalog.js?v=20261021-4';
import {insideWithMargin,unfoldMarks,polygonArea,polygonCentroid,classify} from '../../shared/paper-craft-model.js?v=20261018-3';
import {makeTenPlan} from '../../games/number-paper/calculation-help.js?v=2';
export const modes=['questions','answers','both','quick'];
export function customPattern(p,raw){
  if(!p.design||typeof raw!=='string'||raw.length>3000)throw Error('Invalid pattern');
  const marks=JSON.parse(raw);if(!Array.isArray(marks)||!marks.length||marks.length>3)throw Error('Invalid pattern');
  for(const m of marks){
    if(m.kind!=='polygon'||!['triangle','square'].includes(m.shape)||!Array.isArray(m.poly)||m.poly.length!==(m.shape==='triangle'?3:4))throw Error('Invalid stamp');
    if(!m.poly.every(q=>Number.isFinite(q.x)&&Number.isFinite(q.y)&&insideWithMargin(p.paperStages.at(-1),q))||polygonArea(m.poly)<.00005||polygonArea(m.poly)>.04)throw Error('Stamp outside paper');
    if(m.shape==='triangle'&&classify(m.poly)!=='triangle'||m.shape==='square'&&classify(m.poly)!=='rhombus')throw Error('Invalid stamp shape');
    if(m.shape==='square'&&m.poly.some((a,i)=>{const b=m.poly[(i+1)%4],c=m.poly[(i+2)%4];return Math.abs((b.x-a.x)*(c.x-b.x)+(b.y-a.y)*(c.y-b.y))>1e-7;}))throw Error('Invalid square angle');
  }
  for(let i=0;i<marks.length;i++)for(let j=i+1;j<marks.length;j++){const a=polygonCentroid(marks[i].poly),b=polygonCentroid(marks[j].poly);if(Math.hypot(a.x-b.x,a.y-b.y)<=.14)throw Error('Stamps too close');}
  return {...p,marks,markStages:unfoldMarks(marks,p.folds,p.paperStages),customPattern:raw};
}
export function selectionFor(params){
  const selected=params.has('ids')?params.get('ids').split(','):catalog.filter(p=>!params.get('family')||params.get('family')==='all'||p.family===params.get('family')).map(p=>p.ref+'-1').slice(0,Math.max(1,Math.min(33,Number(params.get('count'))||5)));
  try{
    if(!selected.length||selected.length>40||selected.some(id=>!activityIds.includes(id))||new Set(selected).size!==selected.length)throw Error('Invalid IDs');
    let entries=selected.map(buildActivity);if(params.get('method')==='connect')entries=entries.map(p=>p.family==='stack'&&!p.build?{...p,connect:true}:p);if(params.has('pattern')){if(entries.length!==1)throw Error('Pattern needs exactly one paper');entries=[customPattern(entries[0],params.get('pattern'))];}
    return {entries,error:false,fromGame:params.has('ids')};
  }catch{return {entries:[],error:true,fromGame:params.has('ids')};}
}
export const complex=p=>p.cutPlan||['top','reverse','stack','sort'].includes(p.family)||!!p.patternOptions||['l-grid','grid3'].includes(p.recipe)||p.folds?.length>=3;
export function pagePlan(entries,mode='questions',duplex=false){
  if(!modes.includes(mode))throw Error('Invalid print mode');const pages=[];
  const add=kind=>{let batch=[];const flush=()=>{if(batch.length){pages.push({kind,entries:batch});batch=[];}};for(const p of entries){if(complex(p)){flush();pages.push({kind,entries:[p]});}else {batch.push(p);if(batch.length===2)flush();}}flush();};
  if(mode==='quick'){for(let i=0;i<entries.length;i+=6)pages.push({kind:'quick',entries:entries.slice(i,i+6)});}
  else {if(['questions','both'].includes(mode))add('questions');if(mode==='both'&&duplex&&pages.length%2)pages.push({kind:'blank',entries:[]});if(['answers','both'].includes(mode))add('answers');}
  return pages.map((p,i)=>({...p,number:i+1,total:pages.length}));
}
export function answerFor(p){
  if(p.family==='number'){const numbers=p.target.map(i=>p.numbers[i]);return {kind:'number',value:p.answer,numbers,plan:makeTenPlan(numbers)};}
  if(p.family==='sort')return {kind:'sort',triangle:p.pieces.filter(x=>x.shape==='triangle').length,rhombus:p.pieces.filter(x=>x.shape==='rhombus').length,total:p.pieces.length};
  if(p.family==='stack')return {kind:'stack',top:p.top,bottom:p.bottom,bottomToTop:p.order,topToBottom:[...p.order].reverse()};
  if(p.family==='reverse')return {kind:'reverse',keys:p.answerKeys||[p.answerKey]};
  return {kind:'pattern',count:p.markStages.at(-1).length,topNumber:p.topNumber||null,stages:p.markStages};
}
