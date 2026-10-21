import assert from 'node:assert/strict';
import {activityIds,buildActivity} from './paper-craft-catalog.js?v=20261021-4';
import {cutAnchor,placedCut,matchesCutPlan} from './paper-craft-cut-plan.js?v=20261021-4';
import {freshSession,act,restoreSession,upgradeCutActions,newMarks} from './paper-craft-session.js?v=20261021-4';
import {renderScene} from './paper-craft-svg.js?v=20261021-4';
import {panelsFor,replyPanels,taskText} from '../worksheet/paper-craft/render.js?v=20261021-4';
import {translation} from '../worksheet/paper-craft/i18n.js?v=20261021-4';
let count=0;
for(const id of activityIds){
  const p=buildActivity(id);if(!p.cutPlan)continue;count++;
  let s=freshSession(p),actions=[];const step=(type,value=null)=>{const r=act(p,s,type,value);assert(r.accepted,id+' '+type);s=r.state;actions.push([type,value]);assert.deepEqual(restoreSession(p,actions).state,s);};
  for(const f of p.folds)step('fold');
  assert.equal(act(p,s,'work',0).accepted,false,'index-only cut bypass blocked');
  assert.equal(act(p,s,'cut-check').accepted,false,'blank plan blocked');
  assert.equal(placedCut(p,0,{x:NaN,y:0}),null);assert.equal(placedCut(p,0,{x:2,y:2}),null);
  const target=p.marks.map(cutAnchor);assert(matchesCutPlan(p,target));
  const wrong=target.map((q,i)=>p.paperStages.at(-1).find(v=>Math.hypot(v.x-q.x,v.y-q.y)>.15));
  wrong.forEach((q,index)=>step('place-cut',{index,...q}));
  assert.equal(s.phase,'work');assert.equal(s.worked.length,0,'wrong marks never cut');
  assert.equal(act(p,s,'cut-check').accepted,false,'wrong plan must stay editable');
  for(const lang of ['ko','en','zh','ja']){
    const t=translation(lang),initial=renderScene(p,{...s,cutPlacements:[]},t);
    assert.equal((initial.match(/data-cut-surface/g)||[]).length,1,'one complete input surface');
    assert(!initial.includes('data-action="work"'),'no correct-place focus targets');
    assert(!initial.includes('class="cut-preview"'),'no prefilled cut outline');
    const conditions=panelsFor(p,t),response=replyPanels(p,t);
    assert.equal(conditions.at(-1).label,t.cutGoal);assert.deepEqual(conditions.at(-1).marks,p.markStages.at(-1));
    assert(conditions.slice(0,-1).every(panel=>!panel.marks?.length&&!panel.cuts?.length),'no folded cut solution in student conditions');
    assert(response.every(panel=>!panel.marks?.length),'blank student cut response');
    assert.deepEqual(panelsFor(p,t,true)[0].marks,p.marks,'teacher cut positions');assert.equal(taskText(p,t),t.cutPlanTask);
  }
  target.forEach((q,index)=>step('place-cut',{index,...q}));step('cut-check');assert.equal(s.phase,'open');
  for(const f of p.folds)step('open');assert.equal(s.phase,'discover');
  const old={...p,cutPlan:false};let legacy=freshSession(old),oldActions=[];
  while(legacy.phase!=='done'){
    const type=legacy.phase==='fold'?'fold':legacy.phase==='work'?'work':legacy.phase==='predict'?'predict':legacy.phase==='open'?'open':'discover';
    const value=type==='work'?p.marks.findIndex((_,i)=>!legacy.worked.includes(i)):type==='predict'?newMarks(p,legacy.opened).findIndex((_,i)=>!legacy.stamped.includes(i)):type==='discover'?legacy.collected.length:null;
    const r=act(old,legacy,type,value);assert(r.accepted);legacy=r.state;oldActions.push([type,value]);
    const migrated=restoreSession(p,upgradeCutActions(p,oldActions)).state;
    assert.equal(migrated.fold,legacy.fold);assert.equal(migrated.opened,legacy.opened);assert.deepEqual(migrated.collected,legacy.collected);
    if(legacy.phase==='done')assert.equal(migrated.phase,'done','completed history preserved');
  }
}
const squares=buildActivity('PF-B01-1');assert(matchesCutPlan(squares,squares.marks.map(cutAnchor).reverse()),'identical stencils interchangeable');
console.log(JSON.stringify({cutActivities:count,fullPaperInput:true,wrongPlacementEditable:true,noPreplacedTargets:true,teacherStudentSeparation:true,replay:true,identicalStencilsInterchangeable:true}));
