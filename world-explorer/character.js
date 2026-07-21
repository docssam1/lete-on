import * as THREE from './vendor/three.module.js';

function color(value){ return new THREE.MeshStandardMaterial({color:value,roughness:.78,metalness:.02,flatShading:true}); }
function mesh(parent,geometry,material,position=[0,0,0],rotation=[0,0,0],scale=[1,1,1]){
  const item=new THREE.Mesh(geometry,material); item.position.set(...position); item.rotation.set(...rotation); item.scale.set(...scale); item.castShadow=true; item.receiveShadow=true; parent.add(item); return item;
}

function createHat(type,tint){
  const root=new THREE.Group(), fabric=color(tint), gold=color('#f1c553');
  if(type==='none') return root;
  if(type==='crown'){
    mesh(root,new THREE.CylinderGeometry(.34,.4,.24,10),gold,[0,.02,0]);
    for(let i=0;i<5;i++){const a=i*Math.PI*2/5;mesh(root,new THREE.ConeGeometry(.11,.36,5),gold,[Math.sin(a)*.3,.28,Math.cos(a)*.3]);}
    mesh(root,new THREE.SphereGeometry(.07,8,6),color('#d95050'),[0,.5,0]); return root;
  }
  if(type==='safari'){
    mesh(root,new THREE.CylinderGeometry(.39,.45,.25,16),fabric,[0,.02,0]);
    mesh(root,new THREE.CylinderGeometry(.68,.68,.07,20),fabric,[0,-.09,0]);
    mesh(root,new THREE.TorusGeometry(.43,.035,6,18),color('#69452d'),[0,-.01,0],[Math.PI/2,0,0]); return root;
  }
  if(type==='wizard'){
    mesh(root,new THREE.ConeGeometry(.4,.92,18),fabric,[0,.32,0],[0,0,-.12]);
    mesh(root,new THREE.CylinderGeometry(.65,.65,.06,20),fabric,[0,-.13,0]);
    for(const [x,y,z] of [[.14,.38,.33],[-.18,.18,.35],[.07,.65,.19]]) mesh(root,new THREE.SphereGeometry(.055,7,5),gold,[x,y,z]); return root;
  }
  if(type==='beret'){
    mesh(root,new THREE.SphereGeometry(.46,16,8),fabric,[0,.02,0],[0,0,.1],[1,.48,1]);
    mesh(root,new THREE.CylinderGeometry(.035,.045,.13,8),fabric,[0,.24,0]); return root;
  }
  mesh(root,new THREE.CylinderGeometry(.43,.47,.22,12),fabric,[0,0,0]);
  if(type==='cap') mesh(root,new THREE.BoxGeometry(.56,.08,.3),fabric,[0,-.05,.39]);
  else mesh(root,new THREE.CylinderGeometry(.62,.62,.07,18),fabric,[0,-.1,0]);
  return root;
}

export function createExplorerCharacter(profile,hatType=profile.hat){
  const root=new THREE.Group(), model=new THREE.Group(); root.add(model);
  const refs={root,model};
  const skin=color(profile.skin), skinLight=color(profile.skin), hair=color(profile.hair), jacket=color(profile.jacket), jacketDark=color(profile.jacket), scarf=color(profile.scarf);
  const trousers=color('#314f66'), shoes=color('#49382e'), shirt=color('#f3e7c9'), leather=color('#9a5d32');
  const hips=new THREE.Group(); hips.position.y=1.12; model.add(hips); mesh(hips,new THREE.BoxGeometry(.68,.42,.45),trousers);
  refs.leftLeg=new THREE.Group(); refs.rightLeg=new THREE.Group(); refs.leftLeg.position.set(-.22,-.16,0); refs.rightLeg.position.set(.22,-.16,0); hips.add(refs.leftLeg,refs.rightLeg);
  for(const leg of [refs.leftLeg,refs.rightLeg]){mesh(leg,new THREE.CylinderGeometry(.13,.15,.72,8),trousers,[0,-.36,0]);mesh(leg,new THREE.BoxGeometry(.34,.2,.56),shoes,[0,-.76,.12]);}
  const torso=new THREE.Group(); torso.position.y=1.72; model.add(torso); mesh(torso,new THREE.BoxGeometry(1.02,1.05,.62),jacket); mesh(torso,new THREE.BoxGeometry(.38,.78,.08),shirt,[0,.02,.335]);
  refs.leftArm=new THREE.Group(); refs.rightArm=new THREE.Group(); refs.leftArm.position.set(-.64,.32,0); refs.rightArm.position.set(.64,.32,0); torso.add(refs.leftArm,refs.rightArm);
  for(const [arm,side] of [[refs.leftArm,-1],[refs.rightArm,1]]){mesh(arm,new THREE.CylinderGeometry(.12,.14,.78,8),jacket,[0,-.35,0],[0,0,side*.05]);mesh(arm,new THREE.SphereGeometry(.145,10,8),skinLight,[0,-.78,.02]);}
  const pack=new THREE.Group(); pack.position.set(0,-.02,-.45); torso.add(pack); mesh(pack,new THREE.BoxGeometry(.83,.87,.36),leather);
  mesh(model,new THREE.CylinderGeometry(.12,.15,.18,8),skin,[0,2.34,0]); const head=new THREE.Group();head.position.set(0,2.72,0);model.add(head);
  mesh(head,new THREE.SphereGeometry(.43,16,12),skinLight,[0,0,0],[0,0,0],[1,1.08,.98]);mesh(head,new THREE.SphereGeometry(.445,16,8,0,Math.PI*2,0,Math.PI*.56),hair,[0,.05,-.01]);
  mesh(head,new THREE.SphereGeometry(.045,8,6),color('#2e2927'),[-.15,.02,.4]);mesh(head,new THREE.SphereGeometry(.045,8,6),color('#2e2927'),[.15,.02,.4]);
  const hat=createHat(hatType,profile.jacket);hat.position.set(0,.39,0);head.add(hat);
  const scarfRoot=new THREE.Group();scarfRoot.position.set(0,2.28,.05);model.add(scarfRoot);mesh(scarfRoot,new THREE.TorusGeometry(.29,.09,7,18),scarf,[0,0,0],[Math.PI/2,0,0]);refs.scarfTail=mesh(scarfRoot,new THREE.BoxGeometry(.17,.65,.08),scarf,[.26,-.3,-.2],[.15,0,-.18]);
  root.scale.setScalar(.92); return refs;
}
