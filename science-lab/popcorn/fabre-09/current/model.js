import {THREE,mat,label,roundedBoxGeometry} from '../../../scenes/_kit.js';
import {Stage} from '../../../engine.js';
export function circuitState({mode='stand',position='off',cell1=true,cell2=true}={}){
 let volts=0,active=[];
 if(mode==='one'){if(cell1){volts=1.5;active=['wire1','wire2','junction','wirelow'];}}
 else if(mode==='series'){if(cell1&&cell2){volts=3;active=['wire1','wire2','junction','wirehigh'];}}
 else if(mode==='parallel'){if(cell1||cell2){volts=1.5;active=['wire1','wire2',...(cell1?['wirelow']:[]),...(cell2?['wirehigh']:[])];}}
 else if(mode==='stand'){if(position==='low'&&cell1){volts=1.5;active=['wire1','wire2','junction','wirelow'];}else if(position==='high'&&cell1&&cell2){volts=3;active=['wire1','wire2','junction','wirehigh'];}}
 else throw new RangeError('unknown circuit');
 return {volts,lit:volts>0,brightness:volts===3?'밝게 켜짐':volts>0?'약하게 켜짐':'꺼짐',active};
}
const mesh=(geo,m,x=0,y=0,z=0)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;return o;};
function starPath(r){const p=new THREE.Path();for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,rr=i%2?r*.46:r;const x=Math.cos(a)*rr,y=Math.sin(a)*rr;i?p.lineTo(x,y):p.moveTo(x,y);}p.closePath();return p;}
function panel(name,horizontal=false){const g=new THREE.Group();const w=name==='F'?2.65:3.4,h=horizontal?2.65:3.5;const shape=new THREE.Shape();shape.moveTo(-w/2,-h/2);shape.lineTo(w/2,-h/2);shape.lineTo(w/2,h/2);shape.lineTo(-w/2,h/2);shape.closePath();if(name!=='A'&&name!=='B')shape.holes.push(starPath(.88));if(name==='D'){const opening=new THREE.Path();opening.moveTo(-.45,-1.48);opening.lineTo(-.45,-.91);opening.lineTo(.45,-.91);opening.lineTo(.45,-1.48);opening.closePath();shape.holes.push(opening);}const face=mesh(new THREE.ExtrudeGeometry(shape,{depth:.105,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.015,bevelThickness:.012}),mat(0x405d70,{roughness:.68}));g.add(face);
 if(name!=='A'&&name!=='B'){const s=new THREE.Shape();const bottom=name==='D'?-.9:-1.38;s.moveTo(-1.35,bottom);s.lineTo(1.35,bottom);s.lineTo(1.35,1.38);s.lineTo(-1.35,1.38);s.closePath();const paper=mesh(new THREE.ShapeGeometry(s),new THREE.MeshPhysicalMaterial({color:0xf5efd6,roughness:.9,transparent:true,opacity:.55,side:THREE.DoubleSide}),0,0,.03);g.add(paper);g.userData.paper=paper;}
 for(const x of [-w/2+.25,w/2-.25])for(const y of [-h*.37,h*.37])g.add(mesh(roundedBoxGeometry(.15,.22,.12,.02,2),mat(0xcbd3d4),x,y,.04));
 if(horizontal)g.rotation.x=-Math.PI/2;g.name=name;return g;}
function battery(x,z){const g=new THREE.Group();g.position.set(x,.25,z);const holder=mesh(roundedBoxGeometry(1.35,.23,.63,.04,3),mat(0x26333b));g.add(holder);const body=mesh(new THREE.CylinderGeometry(.23,.23,1.05,32),mat(0xcb8d46,{metalness:.55,roughness:.32}),0,.25);body.rotation.z=Math.PI/2;g.add(body);const top=mesh(new THREE.CylinderGeometry(.13,.13,.04,24),mat(0xe3e8ec,{metalness:.8,roughness:.2}),-.57,.25);top.rotation.z=Math.PI/2;g.add(top);const band=mesh(new THREE.CylinderGeometry(.237,.237,.17,32),mat(0xe5e6e6,{metalness:.55,roughness:.32}),.41,.25);band.rotation.z=Math.PI/2;g.add(band);const plus=label('+',{size:.19,color:'#ba432b'});plus.position.set(-.55,.60,.30);g.add(plus);const minus=label('−',{size:.19,color:'#1c3449'});minus.position.set(.55,.60,.30);g.add(minus);g.userData.cell=body;g.userData.cellParts=[body,top,band];return g;}
function wire(points,color){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));return mesh(new THREE.TubeGeometry(curve,50,.027,7,false),mat(color,{roughness:.48}));}
export function createRig(canvas){
 const stage=new Stage(canvas),root=new THREE.Group();stage.root.add(root);const parts={};
 parts.A=panel('A',true);parts.A.position.set(0,.12,0);root.add(parts.A);
 parts.B=panel('B',true);parts.B.position.set(0,1.65,0);root.add(parts.B);
 parts.C=panel('C',true);parts.C.position.set(0,3.55,0);root.add(parts.C);
 parts.D=panel('D');parts.D.position.set(0,1.83,1.3);root.add(parts.D);
 parts.E=panel('E');parts.E.position.set(0,1.83,-1.3);root.add(parts.E);
 for(const [id,x] of [['F1',-1.7],['F2',1.7]]){parts[id]=panel('F');parts[id].rotation.y=Math.PI/2;parts[id].position.set(x,1.83,0);root.add(parts[id]);}
 const socket=new THREE.Group();socket.position.set(0,1.76,0);socket.add(mesh(new THREE.CylinderGeometry(.38,.43,.22,36),mat(0xdad7ca,{roughness:.5}),0,.08));socket.add(mesh(new THREE.CylinderGeometry(.2,.23,.24,32),mat(0x9e7b35,{metalness:.75,roughness:.3}),0,.28));for(let i=0;i<6;i++){const ring=mesh(new THREE.TorusGeometry(.219,.013,6,32),mat(0xa38241,{metalness:.75}),0,.18+i*.035);ring.rotation.x=Math.PI/2;socket.add(ring);}
 const bulbmat=new THREE.MeshPhysicalMaterial({color:0xecf8ff,roughness:.08,transparent:true,opacity:.32,clearcoat:1,side:THREE.DoubleSide,depthWrite:false});const bulb=mesh(new THREE.SphereGeometry(.42,40,28),bulbmat,0,.65);bulb.scale.y=1.16;socket.add(bulb);
 const filamat=mat(0x9a5e2d,{roughness:.45});const filament=wire([[-.10,.39,0],[-.1,.69,0],[.1,.69,0],[.1,.39,0]],0x9a5e2d);filament.material=filamat;socket.add(filament);const light=new THREE.PointLight(0xffcc70,0,5);light.position.set(0,.66,.25);socket.add(light);root.add(socket);
 const batteries=[battery(-.77,.38),battery(.76,.38)];batteries.forEach(b=>root.add(b));
 const sw=new THREE.Group();sw.position.set(0,.65,1.46);sw.add(mesh(roundedBoxGeometry(.79,.51,.22,.06,4),mat(0x2d333c)));const rocker=mesh(roundedBoxGeometry(.58,.32,.16,.07,4),mat(0x596470),0,.04,.19);sw.add(rocker);const terminals={low:[-.28,.32,1.49],common:[0,.32,1.49],high:[.28,.32,1.49]};for(const x of [-.28,0,.28])sw.add(mesh(new THREE.CylinderGeometry(.045,.045,.18,12),mat(0xc8ae67,{metalness:.85}),x,-.29,0));root.add(sw);
 const wires={};const paths={wire1:[[-1.32,.5,.38],[-1.70,.9,.76],[-.42,1.89,.22]],wire2:[[.40,1.89,.22],[.80,1.12,1.06],terminals.common],junction:[[-.22,.50,.38],[.02,.32,.73],[.21,.50,.38]],wirelow:[[.02,.32,.73],[-.50,.27,1.17],terminals.low],wirehigh:[[1.31,.50,.38],[1.50,.28,1.10],terminals.high]};
 for(const [id,pts]of Object.entries(paths)){wires[id]=wire(pts,id==='wire1'?0xc44b3a:id==='junction'?0xb05d42:0x273d4a);wires[id].name=id;root.add(wires[id]);}
 const title=label('',{size:.29});title.position.set(0,4.12,0);root.add(title);
 const focus=label('',{size:.26});focus.visible=false;root.add(focus);
 const original=new Map(Object.values(parts).map(p=>[p,p.position.clone()]));let animation=null;let snap={};
 function set({id='welcome',mode='stand',position='off',cell1=true,cell2=true,exploded=false,highlight=true,demo=false}={}){
   snap={id,mode,position,cell1,cell2,exploded};animation=null;const order=['paper','socket','switch','wire1','wire2','junction','wirelow','wirehigh','assembly','test','record','concept','quiz','report','finish'];const ix=order.indexOf(id);const full=['welcome','safe','predict','compare','parts','test','record','concept','quiz','report','finish'].includes(id);const assembly=ix>=8||full;
   for(const [key,p]of Object.entries(parts)){p.visible=assembly||['parts','paper','assembly'].includes(id)||key==='B'&&ix>=1||key==='D'&&id==='switch';p.position.copy(original.get(p));p.traverse(o=>{if(o.material?.emissive)o.material.emissive.setHex(0);});if(p.userData.paper)p.userData.paper.visible=id!=='parts';}
   socket.visible=full||ix>=1;sw.visible=full||ix>=2;batteries.forEach((b,i)=>{b.visible=full||ix>=3;b.userData.cellParts.forEach(c=>c.visible=i===0?cell1:cell2);});
   for(const [key,w]of Object.entries(wires)){w.visible=full||ix>=order.indexOf(key);w.material.emissive.setHex(highlight&&key===id?(id==='wire1'?0x6b231b:0x4c9c80):0);}
   if(exploded||['parts','paper'].includes(id)){const offsets={A:[0,-.05,2.8],B:[0,.9,2.3],C:[0,1.8,-1.3],D:[0,.0,2.3],E:[0,0,-2.3],F1:[-2.4,0,0],F2:[2.4,0,0]};for(const [key,p]of Object.entries(parts))p.position.add(new THREE.Vector3(...offsets[key]));}
   if(['socket','switch'].includes(id)){const p=parts[id==='socket'?'B':'D'];p.visible=true;p.traverse(o=>{if(o.material?.emissive)o.material.emissive.setHex(highlight?0x254b3b:0);});}
   // Compare actual cell topologies; the stand selector wiring is a different circuit.
   socket.position.set(0,id==='compare'?.55:1.76,id==='compare'?-1.25:0);sw.position.set(0,.65,1.46);Object.values(parts).forEach(p=>{if(p.userData.paper)p.userData.paper.material.opacity=.55;});
   let shownPaths=paths;
   if(id==='compare'){
     Object.values(parts).forEach(p=>p.visible=false);sw.visible=false;
     const p1=[-1.32,.5,.38],n1=[-.22,.5,.38],p2=[.21,.5,.38],n2=[1.31,.5,.38],lp=[-.35,.70,-1.25],ln=[.35,.70,-1.25];
     shownPaths={wire1:[p1,[-1.5,.45,-.5],lp],wire2:[ln,[.8,.40,-.4],mode==='series'?n2:n1],junction:[n1,[0,.33,.72],p2],wirelow:[p1,[-.5,.28,1.05],p2],wirehigh:[n1,[.5,.30,.85],n2]};
     wires.wire1.visible=mode!=='parallel'||cell1;wires.wire2.visible=mode!=='parallel'||cell1;
     wires.junction.visible=mode==='series';wires.wirelow.visible=mode==='parallel';wires.wirehigh.visible=mode==='parallel';
     // Remaining parallel cell still feeds the lamp when the first cell is removed.
     if(mode==='parallel'&&!cell1&&cell2){shownPaths.wire1=[p2,[-.30,.45,-.65],lp];shownPaths.wire2=[ln,[1.2,.38,-.6],n2];wires.wire1.visible=wires.wire2.visible=true;}
     if(mode==='one')batteries[1].visible=false;
   }
   for(const [key,w]of Object.entries(wires)){w.geometry.dispose();w.geometry=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(shownPaths[key].map(p=>new THREE.Vector3(...p))),50,.027,7,false);}
   title.visible=false;focus.visible=false;batteries.forEach(b=>b.children.filter(c=>c.userData.isLabel).forEach(c=>c.visible=id==='compare'||id.startsWith('wire')||id==='junction'));
   const focused=id==='socket'?'B':id==='switch'?'D':null;if(focused){focus.material.map?.dispose();const next=label(focused==='B'?'B · 전구판':'D · 앞판',{size:.26});focus.material.dispose();focus.material=next.material;focus.position.copy(parts[focused].position).add(new THREE.Vector3(0,.4,.45));focus.visible=true;}
   const result=circuitState({mode,position,cell1,cell2});const powered=['test','compare','concept'].includes(id)?result:{...result,volts:0,lit:false};bulbmat.color.setHex(powered.lit?0xffd371:0xecf8ff);bulbmat.emissive.setHex(powered.lit?0xffaf34:0);bulbmat.emissiveIntensity=powered.volts===3?.68:.2;filamat.emissive.setHex(powered.lit?0xffb248:0);filamat.emissiveIntensity=powered.volts===3?2.2:1;light.intensity=powered.volts===3?14:powered.lit?3:0;Object.values(parts).forEach(p=>{if(p.userData.paper){p.userData.paper.material.color.setHex(powered.lit?0xffd683:0xf5efd6);p.userData.paper.material.emissive.setHex(powered.lit?0xffc348:0);p.userData.paper.material.emissiveIntensity=powered.volts===3?1.25:powered.lit?.25:0;}});rocker.rotation.z=position==='low'?.20:position==='high'?-.20:0;
   stage.frameHidden=false;stage.setView({theta:.57,phi:1.08});
   if(demo&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
     if(wires[id]){const p=wires[id];p.geometry.setDrawRange(0,0);animation={type:'wire',p,total:p.geometry.index.count,t:0};}
     else if(id==='assembly'&&!exploded){const offsets={A:[0,0,.65],B:[0,.55,.45],C:[0,.65,0],D:[0,0,.75],E:[0,0,-.65],F1:[-.65,0,0],F2:[.65,0,0]};const items=Object.entries(parts).map(([key,p])=>{const to=p.position.clone();p.position.add(new THREE.Vector3(...offsets[key]));return {p,to,from:p.position.clone()};});animation={type:'parts',items,t:0};stage.setView({theta:.57,phi:1.08,frame:[[-2.5,.03,-2.1],[2.5,4.4,2.25]]});}
     else if(id==='socket'||id==='switch'){const p=id==='socket'?socket:sw,to=p.position.clone();p.position[id==='socket'?'y':'z']+=.7;animation={type:'parts',items:[{p,to,from:p.position.clone()}],t:0};stage.setView({theta:.57,phi:1.08,frame:[[-1.85,.03,-1.5],[1.85,3.75,2.45]]});}
     else if(id==='paper'){const items=Object.values(parts).filter(p=>p.userData.paper).map(p=>p.userData.paper);items.forEach(p=>p.material.opacity=.05);animation={type:'paper',items,t:0};}
   }
   return result;
 }
 stage.update=(dt,t,raw)=>{if(animation){animation.t=Math.min(1,animation.t+(raw??dt)*.5);const a=animation.t*animation.t*(3-2*animation.t);if(animation.type==='wire')animation.p.geometry.setDrawRange(0,Math.floor(animation.total*a/3)*3);else if(animation.type==='paper')animation.items.forEach(p=>p.material.opacity=.05+.5*a);else animation.items.forEach(({p,from,to},i)=>{const f=Math.min(1,Math.max(0,(animation.t-i*.06)/(1-i*.06)));p.position.lerpVectors(from,to,f*f*(3-2*f));});if(animation.t===1)animation=null;}};
 return {stage,set,parts,wires,dispose:()=>stage.dispose()};
}
