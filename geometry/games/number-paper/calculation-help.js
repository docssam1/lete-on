import {piecesFor} from './activity-model.js?v=3';
export const HELP_PLAN_VERSION=2;
// Prefer whole-number partners (5+5 first), then whole-number groups, and only
// split a quantity when no whole-number group makes ten. Paper stays intact.
function exactTen(available) {
  const ids=available.map((v,i)=>({v,i})).filter(x=>x.v>0).sort((a,b)=>b.v-a.v||a.i-b.i);
  const five=ids.filter(x=>x.v===5);if(five.length>=2)return five.slice(0,2).map(x=>x.i);
  function search(size,start,sum,picked) {
    if(!size)return sum===10?picked:null;
    for(let n=start;n<=ids.length-size;n++){
      if(sum+ids[n].v>10)continue;
      const match=search(size-1,n+1,sum+ids[n].v,[...picked,ids[n].i]);if(match)return match;
    }
    return null;
  }
  for(let size=1;size<=Math.min(10,ids.length);size++){
    const match=search(size,0,0,[]);if(match)return match;
  }
  return null;
}
export function makeTenPlan(numbers) {
  if(!Array.isArray(numbers)||!numbers.length||numbers.length>16||numbers.some(v=>!Number.isSafeInteger(v)||v<1||v>9))throw new TypeError('Up to sixteen quantities from 1 to 9 required');
  const available=[...numbers],used=()=>numbers.map((n,i)=>n-available[i]),steps=[];
  const sum=numbers.reduce((n,v)=>n+v,0);
  while(available.reduce((n,v)=>n+v,0)>=10){
    const usedBefore=used(),whole=exactTen(available);
    const ids=whole||available.map((v,i)=>({v,i})).filter(x=>x.v>0).sort((a,b)=>b.v-a.v||a.i-b.i).map(x=>x.i);
    let need=10;const contributions=[];
    for(const index of ids){
      const before=available[index],take=Math.min(before,need);available[index]-=take;need-=take;
      contributions.push({index,before,take,after:available[index]});if(!need)break;
    }
    const split=contributions.find(c=>c.after>0);
    steps.push({kind:'make-ten',strategy:split?'split':contributions.length===2?'pair':'group',contributions,usedBefore,usedAfter:used(),tenCount:steps.length+1,left:10-contributions.at(-1).take,number:contributions.at(-1).take,total:10});
  }
  steps.push({kind:'finish',tenCount:steps.length,remainder:available.reduce((n,v)=>n+v,0),available:[...available],usedBefore:used(),usedAfter:used(),left:steps.length*10,number:available.reduce((n,v)=>n+v,0),total:sum});
  return steps;
}
export function additionSteps(p) {
  return makeTenPlan(piecesFor(p).flatMap(piece=>piece.cells.map(id=>p.grid[Math.floor(id/4)][id%4])));
}
export function restoreHelp(p,model,value) {
  if(model.phase!=='done'||value?.assisted!==true)return {};
  const last=additionSteps(p).length-1,compatible=value.helpPlanVersion===HELP_PLAN_VERSION;
  const step=compatible&&Number.isInteger(value.helpStep)?Math.max(0,Math.min(last,value.helpStep)):0;
  return {assisted:true,helpPlanVersion:HELP_PLAN_VERSION,helpStep:step,helpOpen:value.helpOpen===true,helpPacked:compatible&&value.helpPacked===true};
}
export function requestHelp(p,model,calculation) {
  if(model.phase!=='done'||calculation.solved)return calculation;
  return {...calculation,...restoreHelp(p,model,{...calculation,assisted:true}),helpOpen:true};
}
export function nextHelp(p,model,calculation) {
  if(model.phase!=='done'||calculation.solved||!calculation.helpOpen)return calculation;
  const steps=additionSteps(p),step=steps[calculation.helpStep];
  if(step.kind==='make-ten'&&!calculation.helpPacked)return {...calculation,helpPacked:true};
  return {...calculation,helpStep:Math.min(steps.length-1,calculation.helpStep+1),helpPacked:false};
}
