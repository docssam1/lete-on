/* ============================================================
   성장 로드맵 3D 맵 (보여주기용) — 원장님 2026-10-20 "3D 맵 제대로 그리고 수의 나라 살펴봐"
   - 수의 나라(number_magic)와 같은 three.js(world-explorer/vendor)와 아이 캐릭터(number_magic/app/char3d)를
     읽기만 해서 쓴다. 수의 나라 파일은 고치지 않는다.
   - 시안 UX: 구름 위 떠 있는 섬들(이정표) · 보라 빛 점선 길 · 섬마다 소품(책·주판·학교·천문대·깃발·플라스크) ·
     황소는 길 옆 노란 갈래 섬. 글자는 HTML 카드(번역·스크린리더·선명함).
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

export async function mountMap3D(host, ms, opts={}){
  if(!host) return null;
  let r;
  try{ r=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'}); }catch(e){ return null; }
  host.innerHTML=''; host.classList.add('m3g'); host.appendChild(r.domElement);
  const labels=document.createElement('div'); labels.className='m3g-labels'; host.appendChild(labels);
  r.setPixelRatio(Math.min(window.devicePixelRatio||1,1.6)); r.shadowMap.enabled=true; r.shadowMap.type=THREE.PCFShadowMap;
  r.toneMapping=THREE.ACESFilmicToneMapping; r.toneMappingExposure=1.05; r.outputColorSpace=THREE.SRGBColorSpace;
  const scene=new THREE.Scene();
  scene.background=canvasTex(16,256,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,0,h); gr.addColorStop(0,'#cbb8f2'); gr.addColorStop(.45,'#efe2fb'); gr.addColorStop(.75,'#fbeee2'); gr.addColorStop(1,'#efe4fa'); g.fillStyle=gr; g.fillRect(0,0,w,h); });
  scene.fog=new THREE.Fog('#efe4fa',26,58);
  const cam=new THREE.PerspectiveCamera(36,1,.1,200);
  scene.add(new THREE.HemisphereLight('#f6efff','#c9b48f',1.1));
  const sun=new THREE.DirectionalLight('#fff3df',2.2); sun.position.set(-8,14,10); sun.castShadow=true; sun.shadow.mapSize.set(2048,2048);
  Object.assign(sun.shadow.camera,{left:-20,right:20,top:20,bottom:-20,near:1,far:60}); sun.shadow.bias=-.0005; scene.add(sun);
  // 구름 바다
  const sea=new THREE.Mesh(new THREE.CircleGeometry(60,48),new THREE.MeshStandardMaterial({color:'#efe7fb',roughness:1})); sea.rotation.x=-Math.PI/2; sea.position.y=-5.5; scene.add(sea);
  const clouds=new THREE.Group(); scene.add(clouds);
  for(let i=0;i<18;i++){ const c=cloud(); const a=Math.random()*Math.PI*2, d=12+Math.random()*14; c.position.set(Math.cos(a)*d,-6+Math.random()*1.5,Math.sin(a)*d*.8); c.scale.setScalar(1.2+Math.random()*1.5); clouds.add(c); }
  for(let i=0;i<8;i++){ const c=cloud(); c.position.set((Math.random()-.5)*40,4+Math.random()*4,-14-Math.random()*8); c.scale.setScalar(1.5+Math.random()); clouds.add(c); }

  const world=new THREE.Group(); scene.add(world);
  let items=[], kid=null, dashes=[], target=new THREE.Vector3(), raf=0, t0=performance.now();
  const charMod=import('../../number_magic/app/char3d/char3d.js').catch(()=>null);

  function clear(){ while(world.children.length){ const o=world.children.pop(); o.traverse(x=>{ if(x.geometry) x.geometry.dispose(); }); } labels.innerHTML=''; items=[]; dashes=[]; kid=null; }
  async function build(data){
    clear();
    const main=data.main, br=data.branch, n=main.length;
    // 섬 자리: 앞 왼쪽(현재)에서 뒤 오른쪽으로 굽이치며 조금씩 높아진다
    const P=main.map((m,i)=>{ const t=n>1?i/(n-1):0; return new THREE.Vector3(-13+t*26,(t*2.4)+Math.sin(i*1.3)*.35,4.5-t*9+Math.sin(t*Math.PI*2)*3); });
    const R=main.map(m=>m.kind==='now'?2.1:1.7);
    main.forEach((m,i)=>{ const g=island(m,R[i]); g.position.copy(P[i]); world.add(g); items.push({m,g,r:R[i],base:P[i].y,ph:i*.9}); });
    // 길: 섬 사이를 아치로 잇는 보라 빛 점선
    const pathPts=[]; for(let i=0;i<n;i++){ pathPts.push(P[i].clone().setY(P[i].y+.06)); if(i<n-1){ const a=P[i],b=P[i+1], mid=a.clone().lerp(b,.5); mid.y=Math.max(a.y,b.y)+.25; const off=new THREE.Vector3(-(b.z-a.z),0,b.x-a.x).normalize().multiplyScalar(.6); pathPts.push(a.clone().lerp(b,.3).add(off).setY(a.y+.1),mid.add(off),a.clone().lerp(b,.7).add(off).setY(b.y+.1)); } }
    const curve=new THREE.CatmullRomCurve3(pathPts,false,'centripetal');
    const glow=new THREE.Mesh(new THREE.TubeGeometry(curve,400,.22,10,false),new THREE.MeshBasicMaterial({color:'#b79cff',transparent:true,opacity:.28,depthWrite:false})); world.add(glow);
    const dashMat=M('#7c4dff',{emissive:'#6a3cf0',emissiveIntensity:.9,roughness:.3}), N=Math.round(curve.getLength()/.55);
    for(let i=0;i<N;i++){ const d=new THREE.Mesh(new THREE.CapsuleGeometry(.08,.22,4,8),dashMat); d.castShadow=false; world.add(d); dashes.push({d,curve,u:i/N}); }
    // 갈래(황소): 해당 구간 옆 노란 섬 + 금빛 점선
    br.forEach((m,j)=>{ let k=main.findIndex(x=>x.m>=m.m); k=k<0?n-1:Math.max(1,k); const a=P[k-1],b=P[k]; const mid=a.clone().lerp(b,.5), side=new THREE.Vector3(b.z-a.z,0,-(b.x-a.x)).normalize();
      const pos=mid.clone().add(side.multiplyScalar(5.2+j*.6)); pos.y=mid.y-1.4; const g=island(m,1.35); g.position.copy(pos); world.add(g); items.push({m,g,r:1.05,base:pos.y,ph:j*1.7+.3});
      const c2=new THREE.CatmullRomCurve3([mid.clone().setY(mid.y+.1),mid.clone().lerp(pos,.5).setY((mid.y+pos.y)/2+.6),pos.clone().setY(pos.y+.06)]);
      const gm=M('#f2b632',{emissive:'#e09a10',emissiveIntensity:.6}), NN=Math.round(c2.getLength()/.55); for(let i=0;i<NN;i++){ const d=new THREE.Mesh(new THREE.CapsuleGeometry(.07,.18,4,8),gm); world.add(d); dashes.push({d,curve:c2,u:i/NN}); } });
    // 지금 여기: 아이(수의 나라 캐릭터) + 핀
    const now=items.find(x=>x.m.kind==='now');
    if(now){ const p=pin(); p.position.set(-.55,1.75,.35); now.g.add(p); now.pin=p;
      const mod=await charMod; if(mod&&mod.makeCharacter){ try{ kid=mod.makeCharacter(THREE,{kind:opts.kid==='girl'?'girl':'boy',height:1.35}); kid.object.position.set(.45,0,.55); kid.faceNow(-.5); now.g.add(kid.object); setTimeout(()=>kid&&kid.wave(),600); }catch(e){ kid=null; } } }
    // 카드
    items.forEach(it=>{ const el=document.createElement('div'); el.className='m3g-card k-'+it.m.kind; el.innerHTML=`<span class="i">${it.m.icon}</span><b>${it.m.title}</b><small>${it.m.sub}</small>`; labels.appendChild(el); it.el=el; });
    // 카메라 목표
    const box=new THREE.Box3(); items.forEach(it=>box.expandByPoint(it.g.position)); box.getCenter(target); target.y+=.3; target.x-=(opts.left||0);
    fit();
  }
  // 카메라: 끌어서 돌리기 · 휠 확대
  let az=-.18, el=.46, dist=27, drag=null;
  const fit=()=>{ const w=host.clientWidth||800, h=host.clientHeight||600; r.setSize(w,h,false); cam.aspect=w/h; dist=Math.max(24,Math.min(50,31*Math.max(1,1.5/(w/h)))); cam.updateProjectionMatrix(); };
  const place=()=>{ cam.position.set(target.x+dist*Math.cos(el)*Math.sin(az),target.y+dist*Math.sin(el),target.z+dist*Math.cos(el)*Math.cos(az)); cam.lookAt(target); };
  const cv=r.domElement; cv.style.touchAction='none';
  cv.addEventListener('pointerdown',e=>{ drag=[e.clientX,e.clientY,az,el]; cv.setPointerCapture(e.pointerId); });
  cv.addEventListener('pointermove',e=>{ if(!drag) return; az=drag[2]-(e.clientX-drag[0])*.005; el=Math.max(.25,Math.min(1.1,drag[3]+(e.clientY-drag[1])*.004)); });
  cv.addEventListener('pointerup',()=>{ drag=null; });
  cv.addEventListener('wheel',e=>{ if(!e.ctrlKey&&!e.shiftKey) return; e.preventDefault(); dist=Math.max(14,Math.min(48,dist+e.deltaY*.02)); },{passive:false});
  const ro=new ResizeObserver(fit); ro.observe(host);
  const v=new THREE.Vector3();
  function frame(){
    raf=requestAnimationFrame(frame);
    const t=(performance.now()-t0)/1000;
    items.forEach(it=>{ it.g.position.y=it.base+Math.sin(t*.8+it.ph)*.08; });
    dashes.forEach(o=>{ const u=(o.u+t*.025)%1, p=o.curve.getPointAt(u), q=o.curve.getTangentAt(u); o.d.position.copy(p); o.d.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),q); });
    clouds.children.forEach((c,i)=>{ c.position.x+=Math.sin(i)*.002; });
    items.forEach(it=>{ if(it.pin) it.pin.position.y=1.75+Math.sin(t*2.2)*.12; const cl=it.g.userData.prop&&it.g.userData.prop.userData.cloth; if(cl) cl.rotation.y=Math.sin(t*3+it.ph)*.25; });
    if(kid) kid.update(1/60,t);
    place(); r.render(scene,cam);
    const w=host.clientWidth, h=host.clientHeight;
    items.forEach(it=>{ v.copy(it.g.position); v.y+=it.m.kind==='now'?2.9:2.3; v.project(cam); const x=(v.x*.5+.5)*w, y=(-v.y*.5+.5)*h;
      it.el.style.transform=`translate(-50%,-100%) translate(${x}px,${y}px)`; it.el.style.opacity=v.z<1?1:0; it.el.style.zIndex=String(1000-Math.round(v.z*1000)); });
  }
  await build(ms); frame();
  return {
    update:async d=>{ await build(d); },
    dispose(){ cancelAnimationFrame(raf); ro.disconnect(); clear(); r.dispose(); r.forceContextLoss&&r.forceContextLoss(); host.innerHTML=''; }
  };
}
