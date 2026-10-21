import {markKey,polygonCentroid,markContains,inside,insideWithMargin,box,unfoldMarks} from './paper-craft-model.js?v=20261018-3';
import {foldOnce,signatureKey} from '../games/paper-fold/reverse-fold.js?v=20261018-3';
import {placedCut,matchesCutPlan,cutAnchor} from './paper-craft-cut-plan.js?v=20261021-4';
export const markAnchor=m=>m.kind==='circle'?m.center:polygonCentroid(m.poly);
export const freshSession=p=>({phase:p.family==='reverse'?'experiment':p.family==='stack'?(p.build?'build':'peel'):p.initialTurn?'turn':'fold',fold:0,worked:[],opened:0,stamped:[],collected:[],sorted:{},peeled:[],built:[],resolved:[],target:0,trial:null,tries:[],input:'',help:false,customMarks:[],cutPlacements:[]});
export function designMark(p,value){
  if(!value||!['triangle','square'].includes(value.shape)||!Number.isFinite(value.x)||!Number.isFinite(value.y))return null;
  const packet=p.paperStages.at(-1),b=box(packet),r=Math.min(b.right-b.left,b.bottom-b.top)*.08,{x,y}=value;
  const points=value.shape==='triangle'?[[x,y-r],[x+r,y+r],[x-r,y+r]]:[[x-r,y-r],[x+r,y-r],[x+r,y+r],[x-r,y+r]];
  const poly=points.map(([x,y])=>({x:Math.round(x*1e5)/1e5,y:Math.round(y*1e5)/1e5}));
  if(!poly.every(point=>insideWithMargin(packet,point)))return null;
  return {kind:'polygon',shape:value.shape,poly};
}
export const withDesign=(p,s)=>p.design&&s.customMarks.length?{...p,marks:s.customMarks,markStages:unfoldMarks(s.customMarks,p.folds,p.paperStages)}:p;
export function newMarks(p,opened){const before=new Set(p.markStages[opened].map(markKey));return p.markStages[opened+1].filter(m=>!before.has(markKey(m)));}
export function numberGroups(p){
  const left=new Set(p.target),groups=[];
  while(left.size){const ids=[left.values().next().value];left.delete(ids[0]);for(let i=0;i<ids.length;i++)for(const d of [-4,4,-1,1]){const n=ids[i]+d;if(n<0||n>15||Math.abs(n%4-ids[i]%4)+Math.abs(Math.floor(n/4)-Math.floor(ids[i]/4))!==1)continue;if(left.delete(n))ids.push(n);}groups.push(ids.sort((a,b)=>a-b));}return groups;
}
const finishUnfold=(p,s)=>{if(p.family==='sort')s.phase='sort';else if(p.family==='number')s.phase='collect';else s.phase='discover';};
const predictionPhase=(p,s)=>p.patternOptions&&s.opened===p.folds.length-1?'choose-pattern':newMarks(p,s.opened).length?'predict':'open';
const clone=s=>JSON.parse(JSON.stringify(s));
export function act(p,previous,type,value){
  p=withDesign(p,previous);
  const s=clone(previous);let accepted=false;
  if(type==='turn'&&s.phase==='turn'){s.phase='fold';accepted=true;}
  if(type==='fold'&&s.phase==='fold'){
    s.fold++;accepted=true;if(s.fold===p.folds.length)s.phase=p.design?'design':'work';
  }
  if(type==='design'&&s.phase==='design'&&s.customMarks.length<3){const m=designMark(p,value);if(m&&s.customMarks.every(other=>Math.hypot(markAnchor(m).x-markAnchor(other).x,markAnchor(m).y-markAnchor(other).y)>.14)){s.customMarks.push(m);accepted=true;}}
  if(type==='design-finish'&&s.phase==='design'&&s.customMarks.length){s.phase=predictionPhase(p,s);accepted=true;}
  if(type==='place-cut'&&p.cutPlan&&s.phase==='work'&&placedCut(p,value?.index,value)){
    s.cutPlacements[value.index]={x:value.x,y:value.y};accepted=true;
  }
  if(type==='cut-check'&&p.cutPlan&&s.phase==='work'&&matchesCutPlan(p,s.cutPlacements)){
    s.worked=p.marks.map((_,i)=>i);s.phase='open';accepted=true;
  }
  if(type==='work'&&!p.cutPlan&&s.phase==='work'){
    const count=p.cuts?.length||p.marks.length;if(Number.isInteger(value)&&value>=0&&value<count&&!s.worked.includes(value)){s.worked.push(value);accepted=true;if(s.worked.length===count)s.phase=p.cuts?.length?'open':predictionPhase(p,s);}
  }
  if(type==='predict'&&s.phase==='predict'){
    const marks=newMarks(p,s.opened);if(Number.isInteger(value)&&value>=0&&value<marks.length&&!s.stamped.includes(value)){s.stamped.push(value);accepted=true;if(s.stamped.length===marks.length)s.phase='open';}
  }
  if(type==='open'&&s.phase==='open'){
    s.opened++;s.stamped=[];accepted=true;if(s.opened===p.folds.length)finishUnfold(p,s);else s.phase=p.cutPlan||p.cuts?.length?'open':predictionPhase(p,s);
  }
  if(type==='pattern'&&s.phase==='choose-pattern'&&value===p.patternAnswer){s.phase='open';accepted=true;}
  if(type==='sort'&&s.phase==='sort'){
    const piece=p.pieces.find(x=>x.id===value?.id);if(piece&&!s.sorted[piece.id]&&piece.shape===value.shape){s.sorted[piece.id]=piece.shape;accepted=true;if(Object.keys(s.sorted).length===p.pieces.length)s.phase='done';}
  }
  if(type==='collect'&&s.phase==='collect'){
    const group=numberGroups(p)[value];if(group&&!group.some(id=>s.collected.includes(id))){s.collected.push(...group);accepted=true;if(s.collected.length===p.target.length)s.phase='calculate';}
  }
  if(type==='input'&&s.phase==='calculate'){s.input=String(value).slice(0,4);accepted=true;}
  if(type==='sum'&&s.phase==='calculate'&&/^\d+$/.test(s.input.trim())&&Number(s.input)===p.answer){s.phase='done';accepted=true;}
  if(type==='help'&&s.phase==='calculate'){s.help=!s.help;accepted=true;}
  if(type==='discover'&&s.phase==='discover'){
    const marks=p.markStages.at(-1);if(Number.isInteger(value)&&value>=0&&value<marks.length&&!s.collected.includes(value)){s.collected.push(value);accepted=true;if(s.collected.length===marks.length)s.phase='done';}
  }
  // Accept the legacy clue action during replay without adding a separate question.
  if(type==='bottom'&&p.conditionTop&&s.phase==='peel'&&!s.peeled.length&&!s.legacyBottom&&value===p.bottom){s.legacyBottom=true;accepted=true;}
  if(type==='paper'&&['peel','build'].includes(s.phase)){
    const values=s.phase==='build'?s.built:s.peeled,order=s.phase==='build'?p.order:[...p.order].reverse();if(value===order[values.length]){values.push(value);accepted=true;if(values.length===order.length)s.phase='done';}
  }
  if(type==='target'&&s.phase==='experiment'&&Number.isInteger(value)&&p.resultOptions?.[value]&&!s.resolved.includes(p.resultOptions[value].key)){s.target=value;s.trial=null;s.tries=[];accepted=true;}
  if(type==='trial'&&s.phase==='experiment'){
    const choices=p.lineChoices||p.creaseHints,c=choices[value];if(c){const result=foldOnce(p.paper,c.line,c.movingSign);if(result){s.trial={line:value,pieces:result.pieces};if(!s.tries.includes(value))s.tries.push(value);accepted=true;}}
  }
  if(type==='claim'&&s.phase==='experiment'&&s.trial){
    if(p.interaction==='fold-line-pick'){
      if(value==='yes'&&signatureKey(s.trial.pieces)===p.resultSignature){s.phase='done';accepted=true;}
    }else{
      const target=p.resultOptions[s.target],same=signatureKey(s.trial.pieces)===target.signature;
      if(value==='yes'&&same||value==='no'&&!target.correct&&s.tries.length===p.creaseHints.length){s.resolved.push(target.key);accepted=true;s.trial=null;s.tries=[];const next=p.resultOptions.findIndex(x=>!s.resolved.includes(x.key));if(next<0)s.phase='done';else s.target=next;}
    }
  }
  return {state:accepted?s:previous,accepted};
}
// Store accepted actions, then replay them; a saved "done" flag cannot bypass play.
export function restoreSession(p,actions){let state=freshSession(p),valid=[];if(!Array.isArray(actions))return {state,actions:valid};for(const action of actions.slice(0,500)){if(!Array.isArray(action)||action.length!==2)break;const result=act(p,state,...action);if(!result.accepted)break;state=result.state;valid.push(action);}return {state,actions:valid};}
// Preserve earlier folds, actual cuts, opened layers and completion. Old click
// targets become the learner's historical marks, never new answer targets.
export function upgradeCutActions(p,actions){
  if(!p.cutPlan)return actions;
  const legacy=restoreSession({...p,cutPlan:false},actions);let state=freshSession(p),upgraded=[];
  const append=(type,value=null)=>{const r=act(p,state,type,value);if(r.accepted){state=r.state;upgraded.push([type,value]);}};
  for(const [type,value] of legacy.actions){
    if(type==='work'){append('place-cut',{index:value,...cutAnchor(p.marks[value])});if(p.marks.every((_,i)=>state.cutPlacements[i]))append('cut-check');}
    else if(!['predict','pattern'].includes(type))append(type,value);
  }
  return upgraded;
}
