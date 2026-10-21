import {stackConnectionPoints} from '../../shared/paper-craft-stack.js?v=20261019-1';
import {square,box,polygonCentroid} from '../../shared/paper-craft-model.js?v=20261018-3';
import {chordSegments} from '../../games/paper-fold/reverse-fold.js?v=20261018-3';
import {paperSurface,polygonPath,escapeHtml,colors} from '../../shared/paper-craft-svg.js?v=20261021-4';
import {answerFor,complex} from './workbook-core.js?v=20261021-4';
const e=escapeHtml;
export function foldLabel(f,t){const dx=-f.nx*f.moving,dy=-f.ny*f.moving;if(Math.abs(dx)>.1&&Math.abs(dy)>.1)return dx>0?(dy>0?'↘':'↗'):(dy>0?'↙':'↖');return Math.abs(dx)>.7?(dx>0?'→':'←'):(dy>0?'↓':'↑');}
export function panelSvg(panel,id){
  let poly=panel.poly||square(),b=box(poly),zoom=panel.zoom,margin=zoom?Math.max(b.right-b.left,b.bottom-b.top)*.07:.04,v=zoom?`${b.left-margin} ${b.top-margin} ${b.right-b.left+margin*2} ${b.bottom-b.top+margin*2}`:'-.04 -.04 1.08 1.08';
  if(panel.papers)return `<svg xmlns="http://www.w3.org/2000/svg" class="sheet-picture" viewBox="0 0 1 1" role="img" aria-label="${e(panel.label)}">${panel.papers.map(p=>`<path d="${polygonPath(p.poly)}" fill="${colors[p.color]}" stroke="#40546b" stroke-width=".003"/>`).join('')}${panel.connection?`<polyline points="${panel.connection.map(q=>`${q.x},${q.y}`).join(' ')}" fill="none" stroke="#ffffff" stroke-width=".018" stroke-linejoin="round"/><polyline class="answer-connection" points="${panel.connection.map(q=>`${q.x},${q.y}`).join(' ')}" fill="none" stroke="#2456c4" stroke-width=".007" stroke-linejoin="round"/>`:''}${panel.papers.map(p=>`<circle cx="${p.label.x}" cy="${p.label.y}" r=".033" fill="${colors[p.color]}"/><text x="${p.label.x}" y="${p.label.y}" text-anchor="middle" dominant-baseline="middle" font-size=".055" fill="#182230" font-weight="800">${p.id}</text>`).join('')}</svg>`;
  if(panel.pieces)return `<svg xmlns="http://www.w3.org/2000/svg" class="sheet-picture" viewBox="-.08 -.08 1.16 1.16" role="img" aria-label="${e(panel.label)}">${panel.pieces.map(p=>`<path d="${polygonPath(p)}" fill="#dcebf9" stroke="#40546b" stroke-width=".004"/>`).join('')}</svg>`;
  const body=paperSurface(poly,{marks:panel.marks||[],cuts:panel.cuts||[],numbers:panel.numbers,physicalLayers:panel.layers,layers:panel.depth||1,fill:panel.blank?'#fff':'#ffe394',gridSize:panel.grid?4:panel.gridSize,id}).replaceAll('font-size=".085"','font-size=".125"');
  const grid='';
  const crease=(panel.creases||[]).map(c=>`<path d="M${c[0].x} ${c[0].y}L${c[1].x} ${c[1].y}" stroke="#596572" stroke-width=".005" stroke-dasharray=".025 .018"/>`).join('');
  const targets=(panel.targets||[]).map(i=>`<rect x="${i%4/4+.009}" y="${Math.floor(i/4)/4+.009}" width=".232" height=".232" fill="none" stroke="#2456c4" stroke-width=".009"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" class="sheet-picture" viewBox="${v}" role="img" aria-label="${e(panel.label)}">${body}${grid}${crease}${targets}</svg>`;
}
const figure=(panel,id)=>`<figure><figcaption>${e(panel.label)}</figcaption>${panelSvg(panel,id)}</figure>`;
export function panelsFor(p,t,answers=false){
  if(p.family==='stack')return [{label:t.sourcePaper,papers:p.papers,connection:answers&&p.connect?stackConnectionPoints(p,[...p.order].reverse()):undefined}];
  if(p.family==='reverse')return [{label:t.sourcePaper,poly:p.paper,creases:answers&&p.lineChoices?[p.lineChoices.find(c=>c.correct).chord]:[]},...(p.resultOptions||[{key:'',pieces:p.resultPieces}]).map(o=>({label:t.goal+' '+o.key.toUpperCase(),pieces:o.pieces}))];
  const panels=p.paperStages.map((poly,i)=>({label:i===0?t.first+' · '+foldLabel(p.folds[0],t):`${i} ${t.folded} ${i<p.folds.length?foldLabel(p.folds[i],t):''}`,poly,numbers:i===0||p.family==='top'&&i<p.folds.length?p.numbers:undefined,layers:p.family==='top'&&i!==p.folds.length?(i===0?p.sourceLayers:p.stages[i]):undefined,depth:p.depths[i].max,grid:i===0&&!!p.numbers&&p.family!=='top',gridSize:p.gridSize,creases:i<p.folds.length?chordSegments(poly,p.folds[i]):[]}));
  if(p.initialTurn)panels[0].label=t.first+' · '+t.turnFirst+' · '+foldLabel(p.folds[0],t);
  panels[panels.length-1]={label:t.zoom,poly:p.paperStages.at(-1),marks:p.marks,cuts:p.cuts||[],depth:p.depths.at(-1).max,gridSize:p.gridSize,zoom:true};
  if(p.cutPlan&&!answers){
    panels[panels.length-1]={label:t.cutResponse,poly:p.paperStages.at(-1),depth:p.depths.at(-1).max,gridSize:p.gridSize,zoom:true};
    panels.push({label:t.cutGoal,poly:p.paperStages[0],marks:p.markStages.at(-1),gridSize:p.gridSize});
  }
  if(answers)panels.splice(0,panels.length-1);
  if(answers)for(let i=1;i<=p.folds.length;i++)panels.push({label:`${i} ${t.undoFold}`,poly:p.paperStages[p.folds.length-i],marks:p.markStages[i],cuts:i===p.folds.length?p.allCuts||[]:[],depth:p.depths[p.folds.length-i].max,numbers:p.family==='number'&&i===p.folds.length?p.numbers:undefined,targets:p.family==='number'&&i===p.folds.length?p.target:[],grid:p.family==='number'&&i===p.folds.length,gridSize:p.gridSize,zoom:true});
  return panels;
}
export function replyPanels(p,t){
  if(['stack','reverse'].includes(p.family))return [];
  if(p.cutPlan)return [{label:t.cutResponse,poly:p.paperStages.at(-1),blank:true,gridSize:p.gridSize,zoom:true}];
  return p.paperStages.slice(0,-1).reverse().map((poly,i)=>({label:`${i+1} ${t.predict}`,poly,blank:true,numbers:p.family==='number'&&i===p.folds.length-1?p.numbers:undefined,grid:p.family==='number'&&i===p.folds.length-1,gridSize:p.gridSize,zoom:true,creases:chordSegments(poly,p.folds[p.folds.length-i-1])}));
}
export function taskText(p,t){return p.cutPlan?t.cutPlanTask:p.connect?t.connectTask:p.patternOptions?t.choiceTask:p.family==='number'?(p.askRemain?t.numberRemain:t.numberCut):p.family==='top'?t.topTask:p.family==='sort'?t.sortTask:p.family==='stack'?t.stackTask+' ('+(p.build?t.bottomOrderLabel:t.orderLabel)+')':p.family==='reverse'?t.reverseTask:t.patternTask;}
export function solutionLines(p,t){
  const a=answerFor(p);
  if(a.kind==='number'){const groups=a.plan.filter(s=>s.kind==='make-ten'),last=a.plan.at(-1);return [a.numbers.join(' + '),...groups.map(g=>g.contributions.map(c=>c.take).join(' + ')+' = 10'+g.contributions.filter(c=>c.after>0).map(c=>` (${c.before} = ${c.take} + ${c.after})`).join('')),groups.length?`${last.tenCount*10} + ${last.remainder} = ${last.total}`:`${a.numbers.join(' + ')} = ${last.total}`];}
  if(a.kind==='sort')return [`${t.triangleCount}: ${a.triangle}`,`${t.rhombusCount}: ${a.rhombus}`,`${t.totalPieces}: ${a.triangle} + ${a.rhombus} = ${a.total}`];
  if(a.kind==='stack')return [`${t.topLabel}: ${a.top}`,`${t.bottomLabel}: ${a.bottom}`,`${p.build?t.bottomOrderLabel:t.orderLabel}: ${(p.build?a.bottomToTop:a.topToBottom).join(' → ')}`];
  if(a.kind==='reverse')return [t.reverseHint,`${t.answer}: ${a.keys.map(k=>k.toUpperCase()).join(', ')}`];
  if(p.patternOptions)return [t.patternHint,`${t.answer}: ${String.fromCharCode(65+p.patternAnswer)}`];
  if(p.family==='cut')return [p.cutPlan?t.cutPlanHint:t.patternHint];
  return [t.patternHint,...(a.topNumber?[`${t.topNumber}: ${a.topNumber}`]:[]),`${t.discover}: ${a.count}`];
}
function cutouts(p,t){return `<div class="cutouts"><h3>${e(t.cutouts)}</h3><div>${[...p.papers].sort((a,b)=>a.id.localeCompare(b.id)).map(paper=>`<span style="--paper:${colors[paper.color]};--paper-width:${(paper.poly[1].x-paper.poly[0].x)*90}mm;--paper-height:${(paper.poly[2].y-paper.poly[1].y)*90}mm">${paper.id}</span>`).join('')}</div></div>`;}
function card(p,n,t,answers=false){
  const panels=panelsFor(p,t,answers),prefix=`${answers?'a':'q'}-${n}`,conditions=answers?panels:panels;
  let extra='';
  if(answers){extra=`<div class="solution-lines">${solutionLines(p,t).map(line=>`<p>${e(line)}</p>`).join('')}</div>`;if(p.family==='reverse'&&p.resultOptions)extra+=`<div class="answer-folds">${p.resultOptions.filter(o=>o.correct).map((o,i)=>figure({label:o.key.toUpperCase(),poly:p.paper,creases:[o.chord]},prefix+'-crease-'+i)).join('')}</div>`;}
  else if(p.family==='stack')extra=(p.connect?'':cutouts(p,t))+`<p class="written">${e(t.topLabel)} _____　${e(t.bottomLabel)} _____</p><p class="written">${e(p.build?t.bottomOrderLabel:t.orderLabel)} ${p.papers.map(()=>'<span class="order-box"></span>').join('')}</p>`;
  else if(p.family==='reverse')extra=`<div class="reverse-response">${p.lineChoices?p.lineChoices.map(c=>figure({label:c.key.toUpperCase(),poly:p.paper,creases:[c.chord]},prefix+'-line-'+c.key)).join(''):p.resultOptions.map(o=>`<label><span class="paper-check"></span> ${o.key.toUpperCase()}</label>`).join('')}</div><div class="writing-space">${e(t.working)}</div>`;
  else if(p.patternOptions)extra=`<div class="reply-pictures pattern-intermediate">${replyPanels(p,t).slice(0,-1).map((panel,i)=>figure(panel,prefix+'-r-'+i)).join('')}</div><div class="pattern-answers">${p.patternOptions.map((marks,i)=>figure({label:String.fromCharCode(65+i),poly:p.paperStages[0],marks},prefix+'-option-'+i)).join('')}</div><p class="written">${e(t.answer)} ______</p>`;
  else {extra=`<div class="reply-pictures">${replyPanels(p,t).map((panel,i)=>figure(panel,prefix+'-r-'+i)).join('')}</div>`;if(p.family==='sort')extra+=`<div class="count-boxes"><p>${e(t.triangleCount)} _____</p><p>${e(t.rhombusCount)} _____</p><p>${e(t.totalPieces)} _____</p></div>`;else if(p.family==='number')extra+=`<div class="writing-space">${e(t.working)} <span>${e(t.sum)} ______</span></div>`;else if(p.family==='top')extra+=`<p class="written">${e(t.topNumber)} ______</p>`;}
  return `<article class="activity-card ${complex(p)?'complex':''} family-${p.family} ${p.connect?'connect-activity':''} ${answers?'solution':''} ${p.patternOptions?'pattern-choice-activity':''}" data-activity-id="${p.id}"><h2>${n}. ${e(t.lang==='ko'?p.title:t.families[['cut','punch','sort','number','top','reverse','stack'].indexOf(p.family)])}</h2><p class="task">${e(taskText(p,t))}</p>${p.conditionTop?`<p class="condition">${e(t.condition)}${p.conditionTop}</p>`:''}<div class="condition-pictures">${conditions.map((panel,i)=>figure(panel,prefix+'-c-'+i)).join('')}</div>${extra}</article>`;
}
export function quickAnswer(p,t){const a=answerFor(p);if(a.kind==='number')return String(a.value);if(p.patternOptions)return `${t.answer}: ${String.fromCharCode(65+p.patternAnswer)}`;if(p.family==='cut')return t.answer+' →';if(p.family==='top')return `${t.topNumber}: ${a.topNumber} · ${t.discover}: ${a.count}`;if(a.kind==='pattern')return `${t.discover}: ${a.count}`;return solutionLines(p,t).at(-1);}
function quickCard(p,n,t){const a=answerFor(p),lines=solutionLines(p,t),picture=['cut','punch','top'].includes(p.family)?figure({label:'',poly:p.cutPlan?p.paperStages.at(-1):p.paperStages[0],marks:p.cutPlan?p.marks:p.markStages.at(-1),zoom:p.cutPlan},'quick-'+n):'';return `<article class="quick-row" data-activity-id="${p.id}"><b>${n}</b><div><strong>${e(t.lang==='ko'?p.title:t.families[['cut','punch','sort','number','top','reverse','stack'].indexOf(p.family)])}</strong><p>${e(quickAnswer(p,t))}</p></div>${picture}</article>`;}
export function renderPages(plan,entries,t,name=''){
  return plan.map(page=>{
    if(page.kind==='blank')return '<section class="sheet duplex-blank" aria-label="duplex blank"></section>';
    const title=page.kind==='questions'?t.title:page.kind==='quick'?t.quickTitle:t.teacher;
    return `<section class="sheet" data-kind="${page.kind}"><header class="sheet-header"><div><b>GFIELD</b><h1>${e(title)}</h1></div><p>${e(t.name)} ${e(name)||'____________'}　${e(t.date)} __________</p></header><div class="sheet-body ${page.entries.length===1?'single':''}">${page.entries.map(p=>page.kind==='quick'?quickCard(p,entries.indexOf(p)+1,t):card(p,entries.indexOf(p)+1,t,page.kind==='answers')).join('')}</div><footer class="sheet-footer"><span>GFIELD · PAPER PLAY</span><b>${page.number} / ${page.total}</b></footer></section>`;
  }).join('');
}
