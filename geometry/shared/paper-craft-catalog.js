import {resultActivity} from './paper-craft-reverse.js?v=20261018-3';
import {stackActivity} from './paper-craft-stack.js?v=20261018-3';
import {clipHalfPlane} from '../games/paper-fold/reverse-fold.js?v=20261018-3';
import {line,square,paperAfter,layerStages,foldLayers,initialLayers,unfoldMarks,unfoldCuts,partitionPaper,classify,targetNumbers,polygonCentroid,polygonArea,inside,box,intersectConvex,layerDepth} from './paper-craft-model.js?v=20261018-3';
import {buildFoldLineProblem,buildFoldResultProblem} from '../games/paper-fold/reverse-fold.js?v=20261018-3';

// These are newly authored activities matched to the documented learning actions.
// Learning actions were reviewed against all 33 source sheets. Figures, numbers,
// and answer choices below are authored practice, not copies of source questions.
const records=[
 ['A01','cut','두 번 접어 무늬 오리기','double'],['A02','cut','대각선 가위 마술','diagonal'],['A03','cut','삼각 종이의 비밀','diagonal'],
 ['A04','number','잘린 숫자 보물','cut'],['A05','number','접으면 만나는 숫자','cut'],['A06','number','대각선 숫자 짝꿍','diagonal'],
 ['A07','sort','세모와 마름모를 찾아라','classify'],['A08','punch','동그라미 꽃이 피었네','round'],['A09','punch','접은 선 위의 구멍','six'],['A10','punch','세 번 접는 별빛 종이','three'],
 ['A11','cut','한 번 접는 가위 마술','single'],['A12','cut','ㄴ자 종이 퍼즐','l-grid'],
 ['B01','cut','격자 무늬 탐험','grid3'],['B02','cut','세모·마름모 무늬','diamond'],['B03','cut','대각선 무늬 탐험','diagonal'],['B04','cut','반대쪽 대각선 탐험','anti'],
 ['B05','number','숫자 조각을 모아라','cut'],['B06','number','잘린 수·남은 수 보물','remain'],['B07','number','삼각 종이 숫자 보물','diagonal'],
 ['B08','cut','반원과 마름모 도장','half-diamond'],['B09','sort','조각 분류 공방','classify'],
 ['C01','top','맨 위 숫자의 비밀','top-one'],['C02','punch','나만의 구멍 무늬','design'],['C03','punch','한 겹씩 빛이 쏙','intermediate'],['C04','punch','거울 무늬 탐정','mixed-complex'],['C05','punch','세모·네모의 여행','mixed-three'],
 ['C06','reverse','접는 선 마술사','line'],['C07','reverse','만들 수 있는 모양 찾기','parallelogram'],['C08','reverse','사각 종이 접기 마술','trapezoid'],
 ['C09','stack','벽지 붙이기 공방','build'],['C10','stack','맨 위부터 살짝 벗겨 봐','peel'],['C11','stack','겹친 종이 보물찾기','peel6'],['C12','stack','맨 위 단서와 맨 아래 보물','conditional']
];
export const families={cut:'가위 마술',punch:'빛나는 구멍',sort:'조각 분류',number:'숫자 보물',top:'겹 속의 숫자',reverse:'접기 탐정',stack:'색종이 쌓기'};
export const catalog=records.map(([ref,family,title,recipe])=>Object.freeze({ref:'PF-'+ref,family,title,recipe,variants:family==='top'?1:family==='reverse'?3:4,sourceStatus:'action-reviewed'}));
const axes={h:line(0,1,.5,1),v:line(1,0,.5,1),d:line(1,-1,0,1),a:line(-1,-1,-1,1)};
const circle=(x,y,r=.035)=>({kind:'circle',center:{x,y},radius:r,shape:'circle'});
const polygon=(points,shape='triangle')=>({kind:'polygon',poly:points.map(([x,y])=>({x,y})),shape});
const rect=(x,y,w,h)=>polygon([[x,y],[x+w,y],[x+w,y+h],[x,y+h]],'square');
const rotatePoint=(p,t)=>{for(let i=0;i<t;i++)p={x:1-p.y,y:p.x};return p;};
const rotateFold=(f,t)=>{let a={x:f.nx*f.c,y:f.ny*f.c},b={x:a.x-f.ny,y:a.y+f.nx},moving={x:a.x+f.nx*f.moving*.1,y:a.y+f.ny*f.moving*.1};a=rotatePoint(a,t);b=rotatePoint(b,t);moving=rotatePoint(moving,t);const nx=-(b.y-a.y),ny=b.x-a.x;return line(nx,ny,nx*a.x+ny*a.y,(nx*moving.x+ny*moving.y-(nx*a.x+ny*a.y))>0?1:-1);};
const rotateMark=(m,t)=>m.kind==='circle'?{...m,center:rotatePoint(m.center,t)}:{...m,poly:m.poly.map(p=>rotatePoint(p,t))};
function craftSpec(meta,variant){
  let folds=[axes.h,axes.v],marks=[],cuts=[];const r=meta.recipe;
  if(['diagonal','anti'].includes(r))folds=r==='anti'?[axes.a,axes.d]:[axes.d,axes.a];
  if(r==='single')folds=[axes.v];
  if(r==='l-grid')folds=[axes.d];
  if(r==='three')folds=[axes.d,axes.a,line(1,0,.5,1)];
  if(r==='six')folds=[axes.d,axes.a];
  if(['design','mixed-complex'].includes(r))folds=[axes.d,axes.a,line(1,-1,-.5,-1),line(1,1,1.5,1)];
  if(r==='mixed-three')folds=[axes.h,axes.v,axes.d];
  const packet=paperAfter(folds),center=polygonCentroid(packet),b=box(packet),width=b.right-b.left,height=b.bottom-b.top;
  if(meta.family==='sort'){
    folds=[axes.h,axes.v];
    cuts=[[{x:0,y:0},{x:.5,y:.5}],[{x:0,y:.5},{x:.5,y:0}]];
    if(meta.ref==='PF-B09'&&variant===0)cuts=cuts.slice(0,1);
  }else if(meta.family==='cut'){
    if(r==='l-grid')marks=[polygon([[0,.5],[.25,.5],[.25,.75],[.5,.75],[.5,1],[0,1]],'L')];
    else if(r==='grid3')marks=[rect(0,0,.25,.25),rect(.25,.25,.25,.25)];
    else if(r==='diamond')marks=variant%2?[polygon([[.5,.5],[.25,.5],[.5,.25]],'triangle')]:[polygon([[0,0],[.5,0],[.25,.25]],'triangle')];
    else if(r==='half-diamond')marks=variant%2?[polygon([[.5,.5],[.4,.5],[.5,.4]],'triangle')]:[circle(.5,0,.10)];
    else if(r==='single')marks=variant%2?[polygon([[0,0],[.16,0],[0,.16]],'triangle'),polygon([[0,1],[.16,1],[0,.84]],'triangle')]:[polygon([[0,.35],[0,.65],[.2,.5]],'triangle')];
    else if(r==='double')marks=[polygon([[0,0],[.18,0],[0,.18]],'triangle'),polygon([[.5,.5],[.32,.5],[.5,.32]],'triangle')];
    else {const raw=variant%2?rect(.25,.5,.25,.5):rect(0,.75,1,.25);marks=[{kind:'polygon',shape:'other',poly:intersectConvex(raw.poly,packet)}];}
  }else if(r==='six')marks=[circle(.35,.82),circle(.25,.75)];
  else if(r==='round')marks=[circle(.5,.25,.06),circle(.25,.5,.06)];
  else if(['design','mixed-complex'].includes(r))marks=[rect(.57,.72,.05,.05),polygon([[.37,.72],[.42,.75],[.37,.79]],'triangle')];
  else if(r==='mixed-three')marks=[rect(.07,.32,.04,.04),polygon([[.18,.35],[.22,.39],[.16,.40]],'triangle')];
  else if(['mixed','intermediate'].includes(r))marks=[rect(.09,.10,.07,.07),polygon([[.32,.30],[.39,.37],[.29,.39]],'triangle')];
  else marks=[circle(center.x,center.y,Math.min(width,height)*.07)];
  folds=folds.map(f=>rotateFold(f,variant));marks=marks.map(m=>rotateMark(m,variant));cuts=cuts.map(s=>s.map(p=>rotatePoint(p,variant)));
  const paperStages=[square(),...folds.map((_,i)=>paperAfter(folds.slice(0,i+1)))],markStages=unfoldMarks(marks,folds,paperStages),allCuts=unfoldCuts(cuts,folds),pieces=cuts.length?partitionPaper(allCuts).map((poly,i)=>({id:String(i),poly,shape:classify(poly)})):[];
  return {folds,marks,markStages,cuts,allCuts,pieces,gridSize:['grid3','l-grid','diamond','diagonal','anti','double','single'].includes(r)?4:0,design:r==='design',stages:layerStages(folds),paperStages};
}
function numberSpec(meta,variant){
  const diagonal=meta.recipe==='diagonal';let folds=diagonal?[axes.d,axes.a]:[axes.h,axes.v];
  let marks=diagonal?[{kind:'polygon',shape:'other',poly:intersectConvex(rect(.25,.5,.25,.5).poly,paperAfter(folds))}]:[rect(0,0,.25,.25)];
  folds=folds.map(f=>rotateFold(f,variant));marks=marks.map(m=>rotateMark(m,variant));
  const numbers=Array.from({length:16},(_,i)=>(i*5+variant*3)%9+1),cut=targetNumbers(folds,marks),askRemain=meta.recipe==='remain'&&variant%2===1,target=askRemain?numbers.map((_,i)=>i).filter(i=>!cut.includes(i)):cut;
  return {folds,marks,markStages:unfoldMarks(marks,folds),stages:layerStages(folds,true),paperStages:[square(),...folds.map((_,i)=>paperAfter(folds.slice(0,i+1)))],numbers,target,answer:target.reduce((sum,i)=>sum+numbers[i],0),askRemain};
}
let topSpecCache;
function topSpec(){
  if(topSpecCache)return topSpecCache;
  // Sixteen triangular cells on a rotated square, as in the reviewed source action.
  const cells=[[[.5,0],[.25,.25],[.5,.25]],[[.5,0],[.5,.25],[.75,.25]],[[0,.5],[.25,.25],[.25,.5]],[[.25,.25],[.25,.5],[.5,.5]],[[.25,.25],[.5,.25],[.5,.5]],[[.5,.25],[.75,.25],[.5,.5]],[[.75,.25],[.75,.5],[.5,.5]],[[.75,.25],[1,.5],[.75,.5]],[[0,.5],[.25,.5],[.25,.75]],[[.25,.5],[.5,.5],[.25,.75]],[[.5,.5],[.5,.75],[.25,.75]],[[.5,.5],[.5,.75],[.75,.75]],[[.5,.5],[.75,.5],[.75,.75]],[[.75,.5],[1,.5],[.75,.75]],[[.25,.75],[.5,.75],[.5,1]],[[.5,.75],[.75,.75],[.5,1]]];
  const sourceLayers=cells.map((points,id)=>{const poly=points.map(([x,y])=>({x,y}));return {id,front:true,ink:[1,0,0,1],poly,dot:polygonCentroid(poly)};});
  // The source does not specify printing on the back. Turn once explicitly so the
  // single-sided ink is really visible when original cell 1 reaches the top.
  const initial=sourceLayers.map(l=>({...l,front:false,ink:[-1,0,0,1],poly:l.poly.map(p=>({x:1-p.x,y:p.y})),dot:{x:1-l.dot.x,y:l.dot.y}}));
  const folds=[line(1,0,.5,-1),line(0,1,.5,1),line(1,1,1,1),line(0,1,.25,-1)],diamond=[{x:.5,y:0},{x:1,y:.5},{x:.5,y:1},{x:0,y:.5}],stages=folds.reduce((ls,f)=>[...ls,foldLayers(ls.at(-1),f)],[initial]);
  const paperStages=folds.reduce((polys,f)=>[...polys,clipHalfPlane(polys.at(-1),f,-f.moving)], [diamond]);
  const footprint=paperStages.at(-1),center=polygonCentroid(footprint),r=.025;
  const marks=[polygon([[center.x-r,center.y-r],[center.x+r,center.y-r],[center.x,center.y+r]],'triangle')];
  return topSpecCache={folds,stages,sourceLayers,initialTurn:true,marks,markStages:unfoldMarks(marks,folds),paperStages,numbers:Array.from({length:16},(_,i)=>i+1),topNumber:1};
}
export function buildActivity(id){
  const match=/^(PF-[ABC]\d{2})-([1-4])$/.exec(id);if(!match)throw Error('Unknown activity');const meta=catalog.find(p=>p.ref===match[1]);if(!meta||Number(match[2])>meta.variants)throw Error('Unknown activity');const variant=Number(match[2])-1;
  let spec;if(meta.family==='number')spec=numberSpec(meta,variant);else if(meta.family==='top')spec=topSpec();else if(meta.family==='stack')spec=stackActivity(meta,variant);else if(meta.family==='reverse')spec=meta.recipe==='line'?(variant===1?resultActivity('rectangle',variant):buildFoldLineProblem('rectangle',Math.floor(variant/2))):resultActivity(meta.recipe,variant%3);else spec=craftSpec(meta,variant);
  if(['PF-C04','PF-C05'].includes(meta.ref)){
    const final=spec.markStages.at(-1),copy=()=>JSON.parse(JSON.stringify(final)),turned=copy(),moved=copy(),triangle=turned.find(m=>m.shape==='triangle'),center=polygonCentroid(triangle.poly);
    triangle.poly=triangle.poly.map(q=>({x:2*center.x-q.x,y:2*center.y-q.y}));
    const squareMark=moved.find(m=>m.shape==='square');squareMark.poly=squareMark.poly.map(q=>({x:q.x+(polygonCentroid(squareMark.poly).x<.5?.025:-.025),y:q.y}));
    const correct=variant%3;spec.patternOptions=[turned,moved];spec.patternOptions.splice(correct,0,final);spec.patternAnswer=correct;
  }
  if(spec.stages)spec.depths=spec.stages.map(layerDepth);
  return {...meta,...spec,id,variant,cutPlan:meta.family==='cut',revision:meta.family==='cut'?'paper-craft-cut-plan-20261021-1':'paper-craft-20261018-1'};
}
export const activityIds=catalog.flatMap(p=>Array.from({length:p.variants},(_,i)=>`${p.ref}-${i+1}`));
