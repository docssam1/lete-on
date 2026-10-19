import assert from 'node:assert/strict';
import {catalog,activityIds,buildActivity} from '../../shared/paper-craft-catalog.js?v=20261018-3';
import {selectionFor,pagePlan,answerFor,customPattern} from './workbook-core.js?v=20261018-3';
import {renderPages,panelsFor,replyPanels,solutionLines,quickAnswer} from './render.js?v=20261018-3';
import {translation} from './i18n.js?v=20261018-3';
import {freshSession,act,withDesign} from '../../shared/paper-craft-session.js?v=20261018-3';
const ids=catalog.map(p=>p.ref+'-1'),selected=selectionFor(new URLSearchParams({ids:ids.join(',')}));assert(!selected.error);assert.equal(selected.entries.length,33);
const reversed=[...ids].reverse();assert.deepEqual(selectionFor(new URLSearchParams({ids:reversed.join(',')})).entries.map(p=>p.id),reversed);
for(const lang of ['ko','en','zh','ja']){
  const connected=selectionFor(new URLSearchParams({ids:'PF-C10-1,PF-C11-1,PF-C12-1',method:'connect'})),t={...translation(lang),lang};
  assert(!connected.error);assert(connected.entries.every(p=>p.connect));
  const question=renderPages(pagePlan(connected.entries,'questions'),connected.entries,t),answer=renderPages(pagePlan(connected.entries,'answers'),connected.entries,t);
  assert(question.includes(t.connectTask));assert(!question.includes('class="cutouts"'));assert(!question.includes('class="answer-connection"'),'no answer line on questions');
  assert.equal((answer.match(/class="answer-connection"/g)||[]).length,3,'matching one-line teacher diagrams');
}
for(const ids of ['',',','PF-A01-1,PF-A01-1','PF-A00-1','PF-C01-4','<script>'])assert(selectionFor(new URLSearchParams({ids})).error);
for(const p of selected.entries){const a=answerFor(p);assert(a.kind);assert(panelsFor(p,{...translation('ko'),lang:'ko'}).length);if(p.family==='number')assert.equal(a.value,a.numbers.reduce((s,n)=>s+n,0));}
let renders=0;
for(const lang of ['ko','en','zh','ja'])for(const mode of ['questions','answers','both','quick']){
  const t={...translation(lang),lang},plan=pagePlan(selected.entries,mode,true),html=renderPages(plan,selected.entries,t,'<script>bad</script>');assert(!html.includes('<script>'));assert(!/NaN|undefined/.test(html));
  if(mode==='both'){const firstAnswer=plan.findIndex(p=>p.kind==='answers');assert.equal(firstAnswer%2,0);assert.equal(firstAnswer===plan.filter(p=>p.kind==='questions').length?0:1,plan.filter(p=>p.kind==='blank').length);}
  if(mode==='questions')assert(!html.includes('class="solution-lines"'));
  const svgIds=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(svgIds).size,svgIds.length,'duplicate SVG masks');renders++;
}
for(const id of activityIds)for(const lang of ['ko','en','zh','ja']){
  const p=buildActivity(id),t={...translation(lang),lang};for(const mode of ['questions','answers']){const html=renderPages(pagePlan([p],mode),[p],t);assert(!/undefined|NaN/.test(html));renders++;
    if(p.family==='stack'){
      const label=p.build?t.bottomOrderLabel:t.orderLabel;
      assert(html.includes(label),'match the game direction');
      if(mode==='answers')assert(solutionLines(p,t).includes(`${label}: ${(p.build?p.order:[...p.order].reverse()).join(' → ')}`));
    }
  }
}
const p=buildActivity('PF-C02-1');let s=freshSession(p);for(let i=0;i<p.folds.length;i++)s=act(p,s,'fold').state;s=act(p,s,'design',{shape:'square',x:.6,y:.75}).state;const same=customPattern(p,JSON.stringify(s.customMarks));assert.deepEqual(same.markStages,withDesign(p,s).markStages);
assert.throws(()=>customPattern(p,'[]'));assert.throws(()=>customPattern(p,'[{"kind":"polygon","shape":"square","poly":[{"x":2,"y":2}]}]'));
assert.throws(()=>customPattern(p,JSON.stringify([{kind:'polygon',shape:'square',poly:[{x:.6,y:.67},{x:.66,y:.75},{x:.6,y:.83},{x:.54,y:.75}]}])),'a rhombus is not necessarily square');
assert.throws(()=>customPattern(p,JSON.stringify([...s.customMarks,...s.customMarks])),'overlapping stamps');
assert.equal(act(p,s,'design',{shape:'square',x:.49,y:.2}).accepted,false,'stamp may not cross the fold');
assert(quickAnswer(buildActivity('PF-C01-1'),translation('ko')).includes('맨 위의 수: 1'));
assert(selectionFor(new URLSearchParams({ids:'PF-C02-1,PF-C02-2',pattern:JSON.stringify(s.customMarks)})).error);
const count=mode=>pagePlan(selected.entries,mode).length;
console.log(JSON.stringify({types:33,activityVariants:activityIds.length,multilingualRenders:renders,questionsPages:count('questions'),answersPages:count('answers'),quickPages:count('quick'),selectionOrder:true,customPatternIdentity:true,duplex:true,answerSeparation:true,uniqueSvgIds:true},null,2));
