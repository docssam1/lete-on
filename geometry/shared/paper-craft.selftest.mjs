import {cutAnchor} from './paper-craft-cut-plan.js?v=20261021-1';
import assert from 'node:assert/strict';
import {catalog,activityIds,buildActivity} from './paper-craft-catalog.js?v=20261018-3';
import {polygonArea,polygonCentroid,inside,markKey,partitionPaper} from './paper-craft-model.js?v=20261018-3';
import {act,freshSession,restoreSession,newMarks,numberGroups,withDesign} from './paper-craft-session.js?v=20261018-3';
import {visibleRelations,topAt,stackConnectionPoints,papersOnStroke} from './paper-craft-stack.js?v=20261019-1';
import {renderScene,renderMotion} from './paper-craft-svg.js?v=20261018-3';
import {translation} from '../games/paper-craft/i18n.js?v=20261018-3';

const close=(a,b)=>assert(Math.abs(a-b)<1e-5,`${a} != ${b}`);
const cross=(a,b,c)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
const onSegment=(a,b,c)=>Math.abs(cross(a,b,c))<1e-10&&c.x>=Math.min(a.x,b.x)-1e-10&&c.x<=Math.max(a.x,b.x)+1e-10&&c.y>=Math.min(a.y,b.y)-1e-10&&c.y<=Math.max(a.y,b.y)+1e-10;
const intersects=(a,b,c,d)=>cross(a,b,c)*cross(a,b,d)<0&&cross(c,d,a)*cross(c,d,b)<0||onSegment(a,b,c)||onSegment(a,b,d)||onSegment(c,d,a)||onSegment(c,d,b);
const project=(point,folds)=>{let q={...point};for(const f of folds){const d=(q.x*f.nx+q.y*f.ny-f.c)/(f.nx*f.nx+f.ny*f.ny);if(d*f.moving>1e-7)q={x:q.x-2*d*f.nx,y:q.y-2*d*f.ny};}return q;};
const topologicalOrders=(papers,relations)=>{let count=0;function visit(prefix){if(count>2)return;if(prefix.length===papers.length){count++;return;}for(const p of papers)if(!prefix.includes(p.id)&&relations.filter(r=>r[1]===p.id).every(r=>prefix.includes(r[0])))visit([...prefix,p.id]);}visit([]);return count;};
let transitions=0,sorts=0,stages=0;
assert.equal(catalog.length,33);assert.equal(new Set(activityIds).size,activityIds.length);
for(const id of activityIds){
  const p=buildActivity(id);let state=freshSession(p),actions=[];
  const step=(type,value=null)=>{const html=renderScene(withDesign(p,state),state,translation('ko'));assert(!/undefined|NaN/.test(html),id+' scene');if(['fold','open'].includes(state.phase)){const motion=renderMotion(withDesign(p,state),state);assert(!/undefined|NaN/.test(motion.html),id+' motion');}const result=act(withDesign(p,state),state,type,value);assert(result.accepted,`${id} ${state.phase} rejects ${type}`);state=result.state;actions.push([type,value]);assert.deepEqual(restoreSession(p,actions).state,state);transitions++;};
  if(p.stages){
    const initialArea=polygonArea(p.paperStages[0]);for(const stage of p.stages){close(stage.reduce((sum,l)=>sum+polygonArea(l.poly),0),initialArea);for(const layer of stage)for(const q of layer.poly)assert(q.x>=-1e-6&&q.x<=1+1e-6&&q.y>=-1e-6&&q.y<=1+1e-6);stages++;}
    p.paperStages.forEach((poly,i)=>{assert(p.depths[i].min>=1&&p.depths[i].max>=p.depths[i].min);assert(polygonArea(poly)<=initialArea+1e-6);});
    const packet=p.paperStages.at(-1);
    for(const m of p.marks)if(m.kind==='polygon')assert(m.poly.every(q=>inside(packet,q)),id+' cut outside folded paper');else assert(inside(packet,m.center),id+' punch center outside folded paper');
    for(const seg of p.cuts||[])assert(seg.every(q=>inside(packet,q)),id+' scissor line outside folded paper');
  }
  if(p.target){
    const expected=[];for(let n=0;n<16;n++){const q=project({x:n%4/4+.125,y:Math.floor(n/4)/4+.125},p.folds),hit=p.marks.some(m=>inside(m.poly,q));if(hit!==p.askRemain)expected.push(n);}
    assert.deepEqual(p.target,expected);assert.equal(p.answer,expected.reduce((sum,n)=>sum+p.numbers[n],0));
    assert.deepEqual(numberGroups(p).flat().sort((a,b)=>a-b),p.target);
  }
  if(p.family==='sort'){
    const four=p.ref==='PF-B09'&&p.variant===0;assert.equal(p.pieces.length,four?4:12);close(p.pieces.reduce((sum,x)=>sum+polygonArea(x.poly),0),1);
    assert.equal(p.pieces.filter(x=>x.shape==='triangle').length,four?4:8);assert.equal(p.pieces.filter(x=>x.shape==='rhombus').length,four?0:4);
    assert.notEqual(partitionPaper(p.allCuts.slice(0,1)).length,p.pieces.length);sorts++;
  }
  if(p.family==='top'){const last=p.stages.at(-1).at(-1);assert.equal(last.id,0);assert.equal(last.front,true);assert(p.initialTurn);assert(p.stages[0].every(l=>!l.front));}
  if(p.family==='stack'){
    assert.equal(new Set(p.papers.map(x=>x.id)).size,p.papers.length);assert.deepEqual(visibleRelations(p.papers),p.visibleRelations);
    p.papers.forEach((paper,i)=>{assert.equal(topAt(p.papers,paper.label),i,'label occluded');close(polygonArea(paper.poly),polygonArea(p.papers[0].poly));});assert.equal(topologicalOrders(p.papers,p.relations),1);
    if(p.conditionTop)assert(topologicalOrders(p.papers,p.visibleRelations)>1);
    const route=stackConnectionPoints(p,[...p.order].reverse());
    for(let i=0;i<route.length-1;i++)for(let j=i+2;j<route.length-1;j++)assert(!intersects(route[i],route[i+1],route[j],route[j+1]),'one line without crossings or overlaps');
    for(const paper of p.papers)assert.deepEqual(papersOnStroke(p,paper.label,paper.label,.01),[paper.id],'tap anchor');
    const pair=p.papers.slice(0,2);assert.deepEqual(papersOnStroke(p,pair[0].label,pair[1].label,.01).filter(id=>pair.some(p=>p.id===id)),pair.map(p=>p.id),'ordered fast pointer segment');
    if(!p.build){
      const connected=renderScene(p,{...freshSession(p),peeled:[...p.order].reverse(),phase:'done'},{...translation('ko'),stackMode:'connect'});
      assert.equal((connected.match(/class="stack-face"/g)||[]).length,p.papers.length,'connection keeps every paper');
      assert.equal((connected.match(/class="connect-line"/g)||[]).length,1,'one continuous line');
      assert.equal((connected.match(/class="connect-step"/g)||[]).length,p.papers.length,'each paper visited once');
    }
    assert.equal(state.phase,p.build?'build':'peel');
    const sequence=p.build?p.order:[...p.order].reverse();
    assert.equal(act(p,state,'paper',sequence[1]).accepted,false,'wrong next paper');
    const first=act(p,state,'paper',sequence[0]);assert(first.accepted);
    assert.equal(act(p,first.state,'paper',sequence[0]).accepted,false,'duplicate paper');
    assert.deepEqual(restoreSession(p,[['paper',sequence[0]]]).state,first.state,'resume ordered papers');
    if(p.conditionTop){
      const legacy=restoreSession(p,[['bottom',p.bottom],['paper',p.top]]);
      assert.equal(legacy.actions.length,2,'preserve the former bottom-clue move');
      assert.deepEqual(legacy.state.peeled,[p.top]);
      assert.equal(act(p,legacy.state,'bottom',p.bottom).accepted,false);
    }
  }
  assert.equal(act(p,state,'sum').accepted,false);assert.equal(act(p,state,'open').accepted,false);
  for(let safety=0;state.phase!=='done'&&safety<150;safety++){
    const effective=withDesign(p,state);
    switch(state.phase){
      case 'turn':step('turn');break;
      case 'fold':step('fold');break;
      case 'design':
        if(!state.customMarks.length)step('design',{shape:'triangle',...polygonCentroid(p.paperStages.at(-1))});else step('design-finish');break;
      case 'work':{if(p.cutPlan){const index=p.marks.findIndex((_,i)=>!state.cutPlacements[i]);if(index<0)step('cut-check');else step('place-cut',{index,...cutAnchor(p.marks[index])});break;}const count=p.cuts?.length||p.marks.length;step('work',Array.from({length:count},(_,i)=>i).find(i=>!state.worked.includes(i)));break;}
      case 'predict':{const marks=newMarks(effective,state.opened);assert(marks.length);step('predict',marks.findIndex((_,i)=>!state.stamped.includes(i)));break;}
      case 'choose-pattern':{
        assert.equal(act(p,state,'pattern',(p.patternAnswer+1)%3).accepted,false);
        const signatures=p.patternOptions.map(ms=>ms.map(markKey).sort().join('|'));assert.equal(new Set(signatures).size,3);assert.equal(signatures[p.patternAnswer],p.markStages.at(-1).map(markKey).sort().join('|'));
        for(const ms of p.patternOptions)for(const m of ms)assert(m.poly.every(q=>inside(p.paperStages[0],q)));
        step('pattern',p.patternAnswer);break;
      }
      case 'open':step('open');break;
      case 'sort':{const piece=p.pieces.find(x=>!state.sorted[x.id]);assert.equal(act(p,state,'sort',{id:piece.id,shape:piece.shape==='triangle'?'rhombus':'triangle'}).accepted,false);step('sort',{id:piece.id,shape:piece.shape});break;}
      case 'collect':step('collect',numberGroups(p).findIndex(g=>!g.some(id=>state.collected.includes(id))));break;
      case 'calculate':step('input',String(p.answer+1));assert.equal(act(p,state,'sum').accepted,false);step('help');assert.equal(state.input,String(p.answer+1));step('input',String(p.answer));step('sum');break;
      case 'discover':step('discover',effective.markStages.at(-1).findIndex((_,i)=>!state.collected.includes(i)));break;
      case 'bottom':assert.equal(act(p,state,'bottom',p.top).accepted,false);step('bottom',p.bottom);break;
      case 'build':step('paper',p.order[state.built.length]);break;
      case 'peel':step('paper',[...p.order].reverse()[state.peeled.length]);break;
      case 'experiment':{
        if(p.lineChoices){step('trial',p.lineChoices.findIndex(c=>c.correct));step('claim','yes');}
        else {const target=p.resultOptions[state.target];if(target.correct){step('trial',p.creaseHints.findIndex(c=>Math.abs(c.line.c-target.line.c)<1e-5&&Math.abs(c.line.nx-target.line.nx)<1e-5));step('claim','yes');}else {for(let i=0;i<p.creaseHints.length;i++)step('trial',i);step('claim','no');}}
        break;
      }
      default:assert.fail(state.phase);
    }
  }
  assert.equal(state.phase,'done',id);assert.deepEqual(restoreSession(p,actions).state,state);
  assert.equal(restoreSession(p,[['sum',null],...actions]).state.phase,freshSession(p).phase);
}
assert.throws(()=>buildActivity('PF-C01-4'));assert.throws(()=>buildActivity('<script>'));
// A child can cut outside the last corner's landing area: unfold that corner
// directly instead of waiting forever for a nonexistent mirrored hole.
{
  const p=buildActivity('PF-C02-1');let s=freshSession(p);
  for(const fold of p.folds)s=act(p,s,'fold').state;
  const design=act(p,s,'design',{shape:'triangle',x:.35,y:.725});assert(design.accepted);
  assert.equal(newMarks(withDesign(p,design.state),0).length,0);
  const finished=act(p,design.state,'design-finish');assert(finished.accepted);assert.equal(finished.state.phase,'open');
}
console.log(JSON.stringify({types:catalog.length,activities:activityIds.length,physicalStages:stages,validatedSorts:sorts,acceptedTransitions:transitions,independentNumberProjection:true,uniqueStackOrders:true,frontBackInk:true,replayedRestoration:true},null,2));
