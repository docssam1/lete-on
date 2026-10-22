import fs from 'node:fs';
import path from 'node:path';
import {catalog,buildActivity} from '../../shared/paper-craft-catalog.js?v=20261021-4';
import {inside,markContains} from '../../shared/paper-craft-model.js?v=20261018-3';
import {selectionFor,pagePlan,answerFor,complex} from './workbook-core.js?v=20261021-4';
import {panelsFor,replyPanels,solutionLines,taskText,quickAnswer} from './render.js?v=20261021-4';
import {translation} from './i18n.js?v=20261021-4';
const args=process.argv.slice(2),get=k=>args[args.indexOf(k)+1],output=get('--output');if(!args.includes('--output')||!output)throw Error('--output is required');fs.mkdirSync(output,{recursive:true});
const t={...translation('ko'),lang:'ko'},all=catalog.map(x=>buildActivity(x.ref+'-1')),demo=selectionFor(new URLSearchParams({ids:args.includes('--ids')?get('--ids'):'PF-A10-1,PF-A10-2,PF-A10-3,PF-A10-4',...(args.includes('--pattern')?{pattern:get('--pattern')}:{})}));if(demo.error)throw Error('Invalid demo selection');
function panelData(panel){
  const labels=[];
  if(panel.layers&&panel.numbers)panel.layers.forEach((l,i)=>{if(l.front&&l.dot&&!panel.layers.slice(i+1).some(above=>inside(above.poly,l.dot)))labels.push({point:l.dot,ink:l.ink,value:panel.numbers[l.id]});});
  else if(panel.numbers)panel.numbers.forEach((value,i)=>labels.push({value,point:{x:i%4/4+.125,y:Math.floor(i/4)/4+.125}}));
  return {...panel,inkLabels:labels.filter(l=>!(panel.marks||[]).some(m=>markContains(m,l.point)))};
}
function activity(p){return {id:p.id,title:p.title,family:p.family,recipe:p.recipe,cutPlan:p.cutPlan,build:p.build,connect:p.connect,complex:complex(p),task:taskText(p,t),conditionTop:p.conditionTop,condition:panelsFor(p,t).map(panelData),solutions:panelsFor(p,t,true).map(panelData),replies:replyPanels(p,t).map(panelData),answer:answerFor(p),solutionLines:solutionLines(p,t),quickAnswer:quickAnswer(p,t),papers:p.papers,patternOptions:p.patternOptions,patternAnswer:p.patternAnswer,lineChoices:p.lineChoices?.map(c=>({key:c.key,chord:c.chord,paper:p.paper})),resultOptions:p.resultOptions?.map(o=>({key:o.key,correct:o.correct,chord:o.chord,pieces:o.pieces})),customPattern:p.customPattern};}
const specs=[['paper-craft-questions-33',all,'questions',false],['paper-craft-answers-33',all,'answers',false],['paper-craft-quick-33',all,'quick',false],[args.includes('--demo-name')?get('--demo-name'):'paper-craft-three-fold-play',demo.entries.map(p=>args.includes('--connect')&&p.family==='stack'&&!p.build?{...p,connect:true}:p),'both',true]];
const documents=specs.map(([name,entries,mode,duplex])=>({name,mode,duplex,entries:entries.map(activity),pages:pagePlan(entries,mode,duplex).map(page=>({...page,entries:page.entries.map(p=>p.id)}))}));
fs.writeFileSync(path.join(output,'print-plan.json'),JSON.stringify({text:t,documents,scope:'Newly authored practice with learning actions reviewed against all33 original sheets; figures, numbers and official answers are not copies.'},null,2));console.log(JSON.stringify(documents.map(d=>({name:d.name,pages:d.pages.length,activities:d.entries.length}))));
