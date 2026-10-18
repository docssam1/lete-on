import {bank,answerFor} from '../../games/number-paper/core.js?v=number-paper-1';
import {additionSteps} from '../../games/number-paper/calculation-help.js?v=6';
import {piecesFor} from '../../games/number-paper/activity-model.js?v=3';
export const PRINT_MODES=['questions','answers','both','quick'];
export function selectionFor(params){
  const activity=['cut','remain','all'].includes(params.get('activity'))?params.get('activity'):'cut';
  if(params.has('ids')){
    const ids=params.get('ids').split(',');
    if(!ids.length||ids.length>40||new Set(ids).size!==ids.length||ids.some(id=>!bank.some(p=>p.id===id)))return {entries:[],activity,error:true,fromGame:true};
    return {entries:ids.map(id=>bank.find(p=>p.id===id)),activity,error:false,fromGame:true};
  }
  const pool=bank.filter(p=>activity==='all'||p.activity===activity);
  const n=Number(params.get('count')||5),count=[5,10,20,40].includes(n)?Math.min(n,pool.length):5;
  return {entries:pool.slice(0,count),activity,error:false,fromGame:false};
}
export const basketNumbers=p=>piecesFor(p).flatMap(piece=>piece.cells.map(id=>p.grid[Math.floor(id/4)][id%4]));
export const targetCells=p=>piecesFor(p).flatMap(piece=>piece.cells).sort((a,b)=>a-b);
export function solutionFor(p){
  const steps=additionSteps(p);
  return {numbers:basketNumbers(p),cells:targetCells(p),answer:answerFor(p),groups:steps.filter(s=>s.kind==='make-ten').map(s=>({terms:s.contributions.map(c=>c.take),splits:s.contributions.filter(c=>c.after>0).map(c=>[c.before,c.take,c.after])})),finish:steps.at(-1)};
}
export const finalEquation=sol=>sol.finish.left?`${sol.finish.left} + ${sol.finish.number} = ${sol.answer}`:`${sol.numbers.join(' + ')} = ${sol.answer}`;
function groups(entries,size=2){
  const pages=[];
  for(const p of entries){const last=pages.at(-1);if(!last||last.length===size||last[0].activity!==p.activity)pages.push([p]);else last.push(p);}
  return pages;
}
export function pagePlan(entries,mode='questions',duplex=false){
  if(!PRINT_MODES.includes(mode))mode='questions';
  const pages=[];
  if(mode==='questions'||mode==='both')for(const rows of groups(entries))pages.push({kind:'questions',entries:rows});
  if(mode==='both'&&duplex&&pages.length%2)pages.push({kind:'blank',entries:[]});
  if(mode==='answers'||mode==='both')for(const rows of groups(entries))pages.push({kind:'answers',entries:rows});
  if(mode==='quick')for(const rows of groups(entries,20))pages.push({kind:'quick',entries:rows});
  return pages.map((p,i)=>({...p,number:i+1,total:pages.length}));
}
