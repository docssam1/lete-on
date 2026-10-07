// Presentation for the build-only deck. The original lesson rig and circuit stay intact.
import {createRig} from './model.js?v=3';
import {THREE} from '../../../scenes/_kit.js';

export function createAssemblyRig(canvas){
 const rig=createRig(canvas),{stage,parts,wires}=rig,root=parts.A.parent;
 const holders=root.children.filter(o=>o.userData.cellParts);
 const socket=root.children.find(o=>o.isGroup&&o.children.some(c=>c.isPointLight));
 const sw=root.children.find(o=>o.isGroup&&o!==socket&&!o.userData.cellParts&&!Object.values(parts).includes(o));
 const home=new Map([...Object.values(parts),socket,sw,...holders].map(p=>[p,p.position.clone()]));
 const originalTick=stage.update;
 const wireOrder=['wire1','wire2','junction','wirelow','wirehigh'];
 let motion=null;
 function set(options={}){
  const {id='parts',demo=false}=options;
  motion=null;
  const baseId=['holders','frame','inspect'].includes(id)?'assembly':id;
  const result=rig.set({...options,id:baseId,exploded:false,demo:false});
  [...home].forEach(([p,pos])=>p.position.copy(pos));
  const early=['parts','paper'].includes(id),wireIndex=wireOrder.indexOf(id);
  const complete=['assembly','inspect','test','finish'].includes(id);
  const panelNames=early?Object.keys(parts):id==='socket'?['B']:id==='switch'||wireIndex>=0?['B','D']:id==='holders'?['A']:id==='frame'?['A','B','C','F1','F2']:Object.keys(parts);
  for(const [name,p] of Object.entries(parts)){
   p.visible=panelNames.includes(name);
   if(p.userData.paper)p.userData.paper.visible=id!=='parts';
  }
  socket.visible=early||id==='socket'||id==='switch'||wireIndex>=0||id==='frame'||complete;
  sw.visible=early||id==='switch'||wireIndex>=0||id==='frame'||complete;
  holders.forEach(b=>{b.visible=early||wireIndex>=0||id==='holders'||id==='frame'||complete;b.userData.cellParts.forEach(c=>c.visible=id==='test'&&c.visible);});
  for(const [name,w] of Object.entries(wires))w.visible=wireIndex>=0?wireOrder.indexOf(name)<=wireIndex:id==='frame'||complete;
  const move=(objects,offset)=>objects.forEach(p=>p.position.add(new THREE.Vector3(...offset)));
  const deltas={socket:[0,0,0],sw:[0,0,0],holders:[0,0,0]};
  if(early){
   const offsets={A:[0,-.05,2.8],B:[0,.9,2.3],C:[0,1.8,-1.3],D:[0,0,2.3],E:[0,0,-2.3],F1:[-2.4,0,0],F2:[2.4,0,0]};
   for(const [name,p] of Object.entries(parts))move([p],offsets[name]);
   deltas.socket=offsets.B;deltas.sw=offsets.D;deltas.holders=offsets.A;
  }else if(id==='frame'){deltas.sw=[0,0,1.05];}
  move([socket],deltas.socket);move([sw],deltas.sw);move(holders,deltas.holders);
  // Keep wire ends attached to the component they describe, including loose front switch.
  for(const [name,w] of Object.entries(wires)){
   const curve=w.geometry.parameters.path,points=curve.points.map(p=>p.clone());
   if(name==='wire2')points[points.length-1].add(new THREE.Vector3(...deltas.sw));
   if(name==='wirelow'||name==='wirehigh')points[points.length-1].add(new THREE.Vector3(...deltas.sw));
   w.geometry.dispose();w.geometry=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),50,.027,7,false);
  }
  root.userData.assemblyStage=id;
  stage.setView({theta:.57,phi:1.08,frame:null});
  if(demo&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
   if(wireIndex>=0){const w=wires[id];w.geometry.setDrawRange(0,0);motion={type:'wire',w,total:w.geometry.index.count,t:0};}
   else if(id==='paper'){const items=Object.values(parts).filter(p=>p.userData.paper).map(p=>p.userData.paper);items.forEach(p=>p.material.opacity=.05);motion={type:'paper',items,t:0};}
   else {
    const groups=id==='frame'?[[parts.A],[parts.B,socket],[parts.C],[parts.F1],[parts.F2]]:id==='assembly'?[[parts.D,sw],[parts.E]]:id==='holders'?holders.map(p=>[p]):id==='socket'?[[socket]]:id==='switch'?[[sw]]:[];
    const items=groups.flatMap((group,i)=>group.map(p=>{const to=p.position.clone();const offset=id==='assembly'?[0,0,group[0]===parts.E?-.7:.7]:id==='frame'?[group[0]===parts.F1?-.6:group[0]===parts.F2?.6:0,group[0]===parts.B||group[0]===parts.C?.6:0,0]:id==='holders'?[0,.55,0]:id==='socket'?[0,.7,0]:[0,0,.7];move([p],offset);return {p,to,from:p.position.clone(),delay:i*.07};}));
    if(items.length){motion={type:'parts',items,t:0};root.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromPoints(stage._framePoints());items.forEach(({p,to,from})=>{const box=new THREE.Box3().setFromObject(p);box.translate(to.clone().sub(from));bounds.union(box);});stage.setView({theta:.57,phi:1.08,frame:[bounds.min.toArray(),bounds.max.toArray()]});}
   }
  }
  return result;
 }
 stage.update=(dt,t,raw)=>{
  originalTick(dt,t,raw);if(!motion)return;
  motion.t=Math.min(1,motion.t+(raw??dt)*.55);const m=motion,a=m.t*m.t*(3-2*m.t);
  if(m.type==='wire')m.w.geometry.setDrawRange(0,Math.floor(m.total*a/3)*3);
  else if(m.type==='paper')m.items.forEach(p=>p.material.opacity=.05+.5*a);
  else m.items.forEach(({p,from,to,delay})=>{const f=THREE.MathUtils.clamp((m.t-delay)/(1-delay),0,1);p.position.lerpVectors(from,to,f*f*(3-2*f));});
  if(m.t===1){motion=null;stage.setView({theta:.57,phi:1.08,frame:null});}
 };
 return {...rig,set};
}
