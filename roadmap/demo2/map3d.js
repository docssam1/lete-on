/* ============================================================
   성장 로드맵 3D 맵 (보여주기용) — 원장님 2026-10-20 "3D 맵 제대로 그리고 수의 나라 살펴봐"
   - 수의 나라(number_magic)와 같은 three.js(world-explorer/vendor)와 아이 캐릭터(number_magic/app/char3d)를
     읽기만 해서 쓴다. 수의 나라 파일은 고치지 않는다.
   - 시안 UX: 구름 위 떠 있는 섬들(이정표) · 보라 빛 점선 길 · 섬마다 소품(책·주판·학교·천문대·깃발·플라스크) ·
     생각하는 황소는 길 옆 노란 갈래 섬. 글자는 HTML 카드(번역·스크린리더·선명함).
   사용: const ctl = await mountMap3D(host, milestones); ctl.update(milestones); ctl.dispose();
         milestones = Planner.milestones(plan) → {main:[{m,kind,title,sub,icon}], branch:[...]}
   WebGL 이 없으면 null 을 돌려준다(그때는 CSS 맵을 쓴다).
   ============================================================ */
import * as THREE from '../../world-explorer/vendor/three.module.js';

const COL = { now:'#7c4dff', step:'#efe4d0', gift:'#f5d7ef', sci:'#e2f0c9', branch:'#ffd978' };

function canvasTex(w,h,draw){ const c=document.createElement('canvas'); c.width=w; c.height=h; draw(c.getContext('2d'),w,h); const t=new THREE.CanvasTexture(c); t.colorSpace=THREE.SRGBColorSpace; return t; }
const M=(color,o={})=>new THREE.MeshStandardMaterial(Object.assign({color,roughness:.75,metalness:0},o));

/* ---- 소품 ---- */
function tree(s=1){
  const g=new THREE.Group();
  const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.05*s,.07*s,.35*s,6),M('#8a6a4a')); trunk.position.y=.17*s; g.add(trunk);
  const greens=['#9fbf6e','#8fb562','#b2cc82'];
  for(let i=0;i<3;i++){ const b=new THREE.Mesh(new THREE.IcosahedronGeometry((.22-.04*i)*s,1),M(greens[i],{flatShading:true})); b.position.set((i-1)*.07*s,(.42+.13*i)*s,(i%2?.05:-.04)*s); g.add(b); }
  g.traverse(o=>{ if(o.isMesh){ o.castShadow=true; } }); return g;
}
function books(){
  const g=new THREE.Group(), cs=['#7c5cd6','#e8b04b','#5e9ad6','#d66b8a','#6bb38a'];
  cs.forEach((c,i)=>{ const b=new THREE.Mesh(new THREE.BoxGeometry(.7-.05*i,.12,.5),M(c)); b.position.set(.03*i,.06+.12*i,0); b.rotation.y=(i%2?.12:-.08); g.add(b); });
  const open=new THREE.Group(); [-1,1].forEach(sd=>{ const p=new THREE.Mesh(new THREE.BoxGeometry(.42,.03,.55),M('#fbf6ea')); p.position.set(sd*.21,0,0); p.rotation.z=sd*-.18; open.add(p); });
  open.position.set(-.6,.12,.35); open.rotation.y=.4; g.add(open); return g;
}
function abacus(){
  const g=new THREE.Group(), wood=M('#9a6b43');
  const f1=new THREE.Mesh(new THREE.BoxGeometry(1,.08,.08),wood), f2=f1.clone(); f1.position.y=.08; f2.position.y=.78; g.add(f1,f2);
  [-.5,.5].forEach(x=>{ const p=new THREE.Mesh(new THREE.BoxGeometry(.08,.78,.08),wood); p.position.set(x,.43,0); g.add(p); });
  const bc=['#e86a6a','#f3b34a','#6bb3e8','#8ccf6b','#b48ee8'];
  for(let r=0;r<4;r++){ const rod=new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,.92,6),M('#ccc')); rod.rotation.z=Math.PI/2; rod.position.y=.22+r*.15; g.add(rod);
    for(let k=0;k<5;k++){ const b=new THREE.Mesh(new THREE.SphereGeometry(.055,12,10),M(bc[(r+k)%5],{roughness:.4})); b.scale.x=.7; b.position.set(-.38+k*.1+(k>2?.2:0),.22+r*.15,0); g.add(b); } }
  const blk=new THREE.Mesh(new THREE.BoxGeometry(.25,.25,.25),M('#7c5cd6')); blk.position.set(.65,.13,.25); g.add(blk);
  const tri=new THREE.Mesh(new THREE.ConeGeometry(.17,.3,3),M('#f3b34a')); tri.position.set(.55,.15,-.3); g.add(tri);
  return g;
}
function school(){
  const g=new THREE.Group();
  const body=new THREE.Mesh(new THREE.BoxGeometry(1.2,.6,.6),M('#f4ecdf')); body.position.y=.3; g.add(body);
  const roof=new THREE.Mesh(new THREE.CylinderGeometry(0,.55,.4,4,1),M('#7c5cd6')); roof.scale.set(1.55,1,.8); roof.rotation.y=Math.PI/4; roof.position.y=.8; g.add(roof);
  const tower=new THREE.Mesh(new THREE.BoxGeometry(.3,.5,.3),M('#efe3d1')); tower.position.set(0,1.05,0); g.add(tower);
  const tr=new THREE.Mesh(new THREE.ConeGeometry(.24,.3,4),M('#6a45c4')); tr.rotation.y=Math.PI/4; tr.position.set(0,1.45,0); g.add(tr);
  for(let i=-2;i<=2;i++){ const w=new THREE.Mesh(new THREE.BoxGeometry(.13,.16,.02),M('#ffd98a',{emissive:'#ffcf6a',emissiveIntensity:.5})); w.position.set(i*.22,.36,.31); g.add(w); }
  const door=new THREE.Mesh(new THREE.BoxGeometry(.18,.26,.02),M('#8a5a3a')); door.position.set(0,.13,.31); g.add(door);
  return g;
}
function observatory(){
  const g=new THREE.Group();
  const base=new THREE.Mesh(new THREE.CylinderGeometry(.42,.46,.35,24),M('#efe7f6')); base.position.y=.17; g.add(base);
  const dome=new THREE.Mesh(new THREE.SphereGeometry(.42,24,16,0,Math.PI*2,0,Math.PI/2),M('#c9b5ef',{roughness:.35,metalness:.2})); dome.position.y=.35; g.add(dome);
  const scope=new THREE.Mesh(new THREE.CylinderGeometry(.07,.1,.8,16),M('#e6c27a',{metalness:.6,roughness:.3})); scope.position.set(.55,.55,.1); scope.rotation.z=-.9; g.add(scope);
  const tri=new THREE.Mesh(new THREE.CylinderGeometry(.02,.02,.5,6),M('#555')); tri.position.set(.45,.25,.1); g.add(tri);
  const planet=new THREE.Mesh(new THREE.SphereGeometry(.14,20,16),M('#9b7be0',{roughness:.3})); planet.position.set(-.45,.9,0); g.add(planet);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.22,.015,8,40),M('#f3c76a',{metalness:.5})); ring.rotation.x=1.2; ring.position.copy(planet.position); g.add(ring);
  return g;
}
function flag(color='#7c4dff'){
  const g=new THREE.Group();
  const pole=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,1.3,8),M('#8a6a4a')); pole.position.y=.65; g.add(pole);
  const cloth=new THREE.Mesh(new THREE.PlaneGeometry(.5,.3,6,1),M(color,{side:THREE.DoubleSide})); cloth.position.set(.26,1.12,0); g.add(cloth); g.userData.cloth=cloth;
  const tgt=new THREE.Group(); ['#ffffff','#e86a6a','#ffffff','#e86a6a'].forEach((c,i)=>{ const r=new THREE.Mesh(new THREE.CylinderGeometry(.42-i*.1,.42-i*.1,.03,32),M(c)); r.position.y=.02+i*.012; tgt.add(r); }); tgt.position.set(-.6,0,.2); g.add(tgt);
  return g;
}
function flask(){
  const g=new THREE.Group();
  const pts=[]; for(let i=0;i<=12;i++){ const t=i/12; pts.push(new THREE.Vector2(t<.6?.32*Math.sin(Math.PI*t/1.2+.4):.09,t*.8)); }
  const glass=new THREE.Mesh(new THREE.LatheGeometry(pts,24),M('#bfe6d8',{transparent:true,opacity:.7,roughness:.1})); g.add(glass);
  const liq=new THREE.Mesh(new THREE.SphereGeometry(.24,20,14,0,Math.PI*2,Math.PI/2,Math.PI/2),M('#7bd389',{emissive:'#3fae5a',emissiveIntensity:.3})); liq.position.y=.26; g.add(liq);
  const globe=new THREE.Mesh(new THREE.SphereGeometry(.22,24,18),M('#7fb6e8')); globe.position.set(.6,.3,0); g.add(globe);
  return g;
}
function signpost(){
  const g=new THREE.Group(), wood=M('#a57a52');
  const post=new THREE.Mesh(new THREE.BoxGeometry(.08,1.1,.08),wood); post.position.y=.55; g.add(post);
  [.85,.62,.4].forEach((y,i)=>{ const b=new THREE.Mesh(new THREE.BoxGeometry(.6,.14,.04),wood); b.position.set(.22*(i%2?-1:1),y,0); g.add(b); });
  return g;
}
function pin(){
  const g=new THREE.Group(), mat=M('#7c4dff',{emissive:'#5b2fd0',emissiveIntensity:.35,roughness:.3});
  const head=new THREE.Mesh(new THREE.SphereGeometry(.22,24,18),mat); head.position.y=.55; g.add(head);
  const tip=new THREE.Mesh(new THREE.ConeGeometry(.2,.45,24),mat); tip.rotation.x=Math.PI; tip.position.y=.25; g.add(tip);
  const dot=new THREE.Mesh(new THREE.SphereGeometry(.09,16,12),M('#ffffff')); dot.position.set(0,.55,.17); g.add(dot);
  return g;
}
function propFor(m){
  if(m.kind==='branch') return signpost();
  if(/교과 완료/.test(m.title)) return books();
  if(/계통/.test(m.title)) return abacus();
  if(/중등 시작/.test(m.title)) return school();
  if(m.kind==='gift') return observatory();
  if(/응시/.test(m.title)) return flag();
  if(m.kind==='sci') return flask();
  return new THREE.Group();
}

/* ---- 섬 ---- */
function island(m,r){
  const g=new THREE.Group();
  const top=new THREE.Mesh(new THREE.CylinderGeometry(r,r*.97,.32,40),M(COL[m.kind]||COL.step,{roughness:.9}));
  top.position.y=-.16; top.receiveShadow=true; g.add(top);
  const grass=new THREE.Mesh(new THREE.CylinderGeometry(r*1.01,r*1.01,.08,40),M(m.kind==='now'?'#9b7bff':m.kind==='branch'?'#f3c94e':'#b9cf8c',{roughness:.9}));
  grass.position.y=-.33; g.add(grass);
  const rock=new THREE.Mesh(new THREE.ConeGeometry(r*.98,r*1.5,9,3),M('#b8a9cc',{flatShading:true,roughness:1}));
  rock.rotation.x=Math.PI; rock.position.y=-.37-r*.75; rock.castShadow=true; g.add(rock);
  // 바위 결
  const pos=rock.geometry.attributes.position; for(let i=0;i<pos.count;i++){ const y=pos.getY(i); if(y<r*.7){ pos.setX(i,pos.getX(i)*(0.9+Math.random()*.2)); pos.setZ(i,pos.getZ(i)*(0.9+Math.random()*.2)); } } rock.geometry.computeVertexNormals();
  // 가장자리 돌
  for(let i=0;i<14;i++){ const a=i/14*Math.PI*2, s=new THREE.Mesh(new THREE.DodecahedronGeometry(.07+Math.random()*.05),M('#d8cde6',{flatShading:true})); s.position.set(Math.cos(a)*r*.96,-.02,Math.sin(a)*r*.96); g.add(s); }
  const prop=propFor(m); prop.position.set(r*.12,0,-r*.15); prop.traverse(o=>{ if(o.isMesh){ o.castShadow=true; o.receiveShadow=true; } }); g.add(prop); g.userData.prop=prop;
  const nT=m.kind==='now'?2:3; for(let i=0;i<nT;i++){ const a=1.2+i*1.6+Math.random()*.4, t=tree(.8+Math.random()*.5); t.position.set(Math.cos(a)*r*.72,0,Math.sin(a)*r*.72); g.add(t); }
  return g;
}
function cloud(){
  const g=new THREE.Group(), mat=new THREE.MeshStandardMaterial({color:'#ffffff',emissive:'#f4ecff',emissiveIntensity:.55,roughness:1,transparent:true,opacity:.95});
  for(let i=0;i<6;i++){ const s=new THREE.Mesh(new THREE.SphereGeometry(.6+Math.random()*.6,16,12),mat); s.position.set(i*.7-1.8,Math.random()*.3,Math.random()*.6); s.scale.y=.6; g.add(s); }
  return g;
}

export async function mountMap3D(host, ms){
  if(!host) return null;
  let r; try{r=new THREE.WebGLRenderer({antialias:true,powerPreference:'low-power'});}catch{return null;}
  host.innerHTML='';host.classList.add('m3g');host.appendChild(r.domElement);
  r.setPixelRatio(Math.min(devicePixelRatio||1,1.5));r.outputColorSpace=THREE.SRGBColorSpace;
  const scene=new THREE.Scene();scene.background=new THREE.Color('#edf0f7');
  scene.add(new THREE.HemisphereLight('#ffffff','#b4bfd2',2.2));
  const sun=new THREE.DirectionalLight('#fff',2.6);sun.position.set(-10,20,12);scene.add(sun);
  const cam=new THREE.OrthographicCamera(-20,20,12,-12,.1,200),world=new THREE.Group();scene.add(world);
  const labels=document.createElement('div');labels.className='m3g-labels';host.appendChild(labels);
  const leaders=document.createElementNS('http://www.w3.org/2000/svg','svg');leaders.classList.add('map-leaders');host.insertBefore(leaders,labels);
  const controls=document.createElement('div');controls.className='map-controls';controls.innerHTML='<button data-map="zoomIn" aria-label="지도 확대">+</button><button data-map="zoomOut" aria-label="지도 축소">−</button><button data-map="reset">전체 보기</button><button data-map="current">현재 위치</button>';host.appendChild(controls);
  let viewMode='all';let items=[],data=ms,az=0,cameraReady=false,el=.84,zoom=1,drag=null,interactive=true,focusIndex=0,raf=0,needsLayout=true;

  const target=new THREE.Vector3(),bounds=new THREE.Box3();
  const charMod=import('../../number_magic/app/char3d/char3d.js').catch(()=>null);let kid=null;
  function clear(){world.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>m.dispose());}});world.clear();labels.innerHTML='';leaders.innerHTML='';items=[];kid=null;}
  function add(m,pos,radius=1.1){const g=island(m,radius);g.position.copy(pos);world.add(g);
    if(m.alternate)g.traverse(o=>{if(o.isMesh){o.material.transparent=true;o.material.opacity=.32;}});
    const it={m,g,pos,el:document.createElement('button'),line:document.createElementNS('http://www.w3.org/2000/svg','line')};
    it.el.type='button';it.el.className='m3g-card k-'+m.kind+(m.chosen?' chosen':'')+(m.alternate?' alternate':'');it.el.setAttribute('aria-label',m.title+' '+m.sub);it.el.onclick=()=>{focusIndex=items.indexOf(it);needsLayout=true;};
    labels.appendChild(it.el);leaders.appendChild(it.line);items.push(it);return it;
  }
  function pathBetween(points,chosen=true){
    const c=new THREE.CatmullRomCurve3(points,false,'centripetal'),material=new THREE.MeshBasicMaterial({color:chosen?'#7951cc':'#b9c3d2',transparent:true,opacity:chosen?1:.6});
    if(chosen){const glow=new THREE.Mesh(new THREE.TubeGeometry(c,50,.16,6,false),new THREE.MeshBasicMaterial({color:'#a98be0',transparent:true,opacity:.16}));world.add(glow);
      const n=Math.max(4,Math.round(c.getLength()/.45));for(let i=0;i<n;i++){const u=i/n,mesh=new THREE.Mesh(new THREE.CapsuleGeometry(.055,.14,3,6),material);mesh.position.copy(c.getPointAt(u));mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),c.getTangentAt(u));world.add(mesh);}
    }else world.add(new THREE.Mesh(new THREE.TubeGeometry(c,50,.035,5,false),material));
  }
  async function build(next){
    clear();data=next;
    const main=[...next.main,...next.forks.map(f=>({m:f.m,kind:'junction',badge:'갈림길',title:f.title+' 갈림길',sub:f.reason,fork:f}))].sort((a,b)=>a.m-b.m);
    const n=main.length,P=main.map((m,i)=>new THREE.Vector3((i-(n-1)/2)*4,0,Math.sin(i*.7)*1.8));
    main.forEach((m,i)=>add({...m,mainIndex:next.main.indexOf(m)},P[i],m.kind==='now'?1.4:.95));
    for(let i=0;i<n-1;i++){
      const a=P[i].clone().setY(.1),b=P[i+1].clone().setY(.1),fork=main[i].fork;
      if(fork){
        [true,false].forEach((yes,j)=>{
          const p=a.clone().lerp(b,.5);p.z+=(yes?1:-1)*4.3;
          const chosen=!fork.pending&&yes===fork.selected,m={kind:'branch',forkId:fork.id,badge:yes?'준비':'계속',title:fork.title+' '+(yes?'선택':'미선택'),sub:yes?fork.yes:fork.no,chosen,alternate:!chosen};
          add(m,p,.9);pathBetween([a,a.clone().lerp(p,.45),p,p.clone().lerp(b,.55),b],chosen);
        });
      }else pathBetween([a,a.clone().lerp(b,.5).add(new THREE.Vector3(0,.2,0)),b]);
    }
    // Last decision still rejoins the continuing curriculum.
    if(main.at(-1)?.fork){const i=n-1,a=P[i].clone().setY(.1),b=a.clone().add(new THREE.Vector3(4,0,0)),fork=main[i].fork;
      [true,false].forEach(yes=>{const p=a.clone().lerp(b,.5);p.z+=(yes?1:-1)*4.3;const chosen=!fork.pending&&yes===fork.selected;add({kind:'branch',forkId:fork.id,badge:yes?'준비':'계속',title:fork.title+' '+(yes?'선택':'미선택'),sub:yes?fork.yes:fork.no,chosen,alternate:!chosen},p,.9);pathBetween([a,p,b],chosen);});add({kind:'step',title:'다음 학습에 합류',sub:'교과·과학 진도 계속'},b,.9);
    }
    const now=items.find(it=>it.m.kind==='now');if(now){const mod=await charMod;if(mod?.makeCharacter){try{kid=mod.makeCharacter(THREE,{kind:'boy',height:1.25});now.g.add(kid.object);}catch{kid=null;}}}
    bounds.setFromObject(world);bounds.getCenter(target);focusIndex=Math.min(focusIndex,items.length-1);fit();
    host.dataset.forkEdges=String(next.forks.length*4);host.dataset.selectedForkEdges=String(next.forks.filter(f=>!f.pending).length*2);
  }
  function place(){cam.position.set(target.x+35*Math.cos(el)*Math.sin(az),target.y+35*Math.sin(el),target.z+35*Math.cos(el)*Math.cos(az));cam.lookAt(target);cam.updateMatrixWorld();}
  function fit(){
    const w=host.clientWidth||800,h=host.clientHeight||540;if(!cameraReady&&host.clientWidth>0){az=w<560?-Math.PI/2:0;cameraReady=true;}r.setSize(w,h,false);
    let box=bounds; if(viewMode==='current'){const f=data.forks.slice().sort((a,b)=>a.m-b.m)[0],j=items.findIndex(it=>it.m.fork?.id===f?.id);const subset=items.filter((it,i)=>it.m.kind==='now'||it.m.forkId===f?.id||i===j||i===j+1);box=new THREE.Box3();subset.forEach(it=>box.expandByObject(it.g));}box.getCenter(target);place();
    // Fit every island extent in camera space; no fixed-distance cap at portrait ratios.
    let x=0,y=0;for(const a of [box.min.x,box.max.x])for(const b of [box.min.y,box.max.y])for(const c of [box.min.z,box.max.z]){const v=new THREE.Vector3(a,b,c).applyMatrix4(cam.matrixWorldInverse);x=Math.max(x,Math.abs(v.x));y=Math.max(y,Math.abs(v.y));}
    const aspect=w/h,half=Math.max(y+2,(x+2)/aspect);cam.top=half;cam.bottom=-half;cam.left=-half*aspect;cam.right=half*aspect;cam.zoom=zoom;cam.updateProjectionMatrix();needsLayout=true;
  }
  controls.onclick=e=>{const b=e.target.closest('[data-map]');if(!b)return;switch(b.dataset.map){case'zoomIn':zoom=Math.min(2.2,zoom+.2);break;case'zoomOut':zoom=Math.max(.7,zoom-.2);break;case'current':viewMode='current';focusIndex=items.findIndex(it=>it.m.kind==='now');zoom=1;break;case'reset':viewMode='all';az=host.clientWidth<560?-Math.PI/2:0;el=.84;zoom=1;break;case'move':interactive=!interactive;host.classList.toggle('is-interactive',interactive);b.setAttribute('aria-pressed',String(interactive));b.textContent=interactive?'스크롤 모드':'돌려 보기';break;}fit();};
  const cv=r.domElement;cv.addEventListener('pointerdown',e=>{if(!interactive||e.pointerType==='touch')return;drag=[e.clientX,e.clientY,az,el];cv.setPointerCapture(e.pointerId);});
  cv.addEventListener('pointermove',e=>{if(!drag)return;az=drag[2]-(e.clientX-drag[0])*.005;el=Math.max(.35,Math.min(1.35,drag[3]+(e.clientY-drag[1])*.004));fit();});
  ['pointerup','pointercancel','lostpointercapture'].forEach(t=>cv.addEventListener(t,()=>drag=null));
  function layout(){
    const w=host.clientWidth,h=host.clientHeight,mobile=w<560,placed=[];
    const order=items.map((it,i)=>({it,i})).sort((a,b)=>(b.i===focusIndex)-(a.i===focusIndex));
    for(const {it,i} of order){
      const nearest=data.forks.slice().sort((a,b)=>a.m-b.m)[0],junction=items.findIndex(x=>x.m.fork?.id===nearest?.id),visible=viewMode==='all'||it.m.kind==='now'||it.m.forkId===nearest?.id||i===junction||i===junction+1;
      it.el.hidden=!visible;it.line.style.display=visible?'':'none';if(!visible)continue;
      const v=it.g.position.clone().add(new THREE.Vector3(0,1.6,0)).project(cam),px=(v.x/2+.5)*w,py=(-v.y/2+.5)*h,isFocus=mobile&&i===focusIndex;
      it.el.classList.toggle('is-focus',isFocus);it.el.innerHTML='<b>'+(mobile&&!isFocus?(it.m.mainIndex>=0?String(it.m.mainIndex+1):it.m.badge||it.m.title.slice(0,2)):it.m.title)+'</b><small>'+it.m.sub+'</small>';
      const ew=it.el.offsetWidth,eh=it.el.offsetHeight;
      let x=Math.max(8,Math.min(w-ew-8,px-ew/2)),y=Math.max(72,Math.min(h-eh-8,py-eh-20));
      if(isFocus){x=12;y=72;}
      const overlaps=(x,y)=>placed.some(q=>x<q.x+q.w+6&&x+ew+6>q.x&&y<q.y+q.h+6&&y+eh+6>q.y);
      if(overlaps(x,y)){
        let best=null;for(let yy=72;yy<=h-eh-8;yy+=mobile?38:12)for(let xx=8;xx<=w-ew-8;xx+=mobile?38:12){if(!overlaps(xx,yy)){const score=(xx+ew/2-px)**2+(yy+eh-py)**2;if(!best||score<best.score)best={x:xx,y:yy,score};}}
        if(best){x=best.x;y=best.y;}
      }
      placed.push({x,y,w:ew,h:eh});it.el.style.transform=`translate(${x}px,${y}px)`;it.el.style.zIndex=String(isFocus?3:1);
      it.line.setAttribute('x1',String(px));it.line.setAttribute('y1',String(py));it.line.setAttribute('x2',String(x+ew/2));it.line.setAttribute('y2',String(y+eh));
    }
  }
  const ro=new ResizeObserver(fit);ro.observe(host);
  function frame(){raf=requestAnimationFrame(frame);if(!host.offsetParent)return;if(needsLayout){place();layout();r.render(scene,cam);needsLayout=false;}}
  await build(ms);frame();
  return {update:build,focus:index=>{const i=items.findIndex(it=>it.m.mainIndex===index);if(i>=0){focusIndex=i;needsLayout=true;}},dispose(){cancelAnimationFrame(raf);ro.disconnect();clear();r.dispose();host.innerHTML='';}};
}
