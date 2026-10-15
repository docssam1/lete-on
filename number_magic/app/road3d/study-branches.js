// Actual meshes, shared Numbers material/renderer kit; no CSS pseudo-3D or new curriculum.
import {makeKit,THREE} from '../hero3d/kit.js';
export async function mountStudyBranches(host,projection,options){
  if(!host||!host.isConnected)return null;
  const o=options||{},canvas=document.createElement('canvas');canvas.setAttribute('aria-hidden','true');host.appendChild(canvas);
  let k;try{k=makeKit(15,{live:true,canvas,width:host.clientWidth,height:360});}catch(_){canvas.remove();return null;}
  const {r,scene,cam}=k;let stopObservers=()=>{};
  const release=()=>{const seen=new Set();scene.traverse(obj=>{if(obj.geometry&&!seen.has(obj.geometry)){seen.add(obj.geometry);obj.geometry.dispose();}for(const m of (Array.isArray(obj.material)?obj.material:[obj.material]).filter(Boolean)){if(seen.has(m))continue;seen.add(m);for(const v of Object.values(m))if(v&&v.isTexture&&!seen.has(v)){seen.add(v);v.dispose();}m.dispose();}});r.dispose();r.forceContextLoss();canvas.remove();host.querySelector('.pd-study-labels')?.remove();};
  try{
  scene.background=new THREE.Color('#eaf1e8');k.lights({env:false});
  const labels=document.createElement('div');labels.className='pd-study-labels';labels.setAttribute('aria-hidden','true');host.appendChild(labels);
  const t=(ko,en,zh)=>o.lang==='en'?en:o.lang==='zh'?zh:ko;
  const fixedLabels=[],routeLabels=[];
  const label=(title,position,axis=false)=>{const el=document.createElement('span');el.className='pd-study-label'+(axis?' is-axis':'');el.textContent=title;labels.appendChild(el);if(position)fixedLabels.push({el,position});return el;};
  const ink=new THREE.MeshStandardMaterial({color:'#263c44',roughness:.6});
  const gold=new THREE.MeshStandardMaterial({color:'#ac8650',metalness:.55,roughness:.35});
  const board=new THREE.Mesh(k.rbox(13,.3,7,.18),k.woodMat('#c5aa7b'));board.position.set(0,-.3,0);board.receiveShadow=true;scene.add(board);
  const group=new THREE.Group();scene.add(group);
  const colors=['#246d62','#b66d39','#515faf'],materials=[],beads=[],paths=[];
  const until=Math.max(1,o.until),total=projection.remaining;
  const reviewEnd=scenario=>{
    if(!projection.input.reviewSessions)return 0;
    for(let n=1;n<scenario.points.length;n++){
      const a=scenario.points[n-1],b=scenario.points[n];
      if(a.review<projection.input.reviewSessions&&b.review>=projection.input.reviewSessions)
        return n-1+(projection.input.reviewSessions-a.review)/(b.frequency*projection.unitsPerVisit);
    }
    return null;
  };
  const point=(p,i)=>{
    const split=Math.max(0,Math.min(1,(p.week-projection.input.holdWeeks)/projection.input.rampWeeks));
    return new THREE.Vector3(-5.6+11.2*p.week/until,.16+4*p.done/total,split?[0,-2,2][i]*split:0);
  };
  for(let i=0;i<3;i++){
    const s=projection.scenarios[i],times=new Set(Array.from({length:until+1},(_,n)=>n));
    for(const t of [reviewEnd(s),s.arrivalWeeks])if(t!==null&&t>=0&&t<=until)times.add(t);
    const pts=Array.from(times).sort((a,b)=>a-b).map(t=>point(window.NM_STUDY_PROJECTION.atWeek(projection,i,t),i));
    const material=new THREE.MeshStandardMaterial({color:colors[i],metalness:.25,roughness:.42,transparent:true,opacity:1});materials.push(material);
    // Linear segments preserve plateau, review completion and monotone progress.
    // A smoothing spline can dip below the data and falsely imply lost progress.
    const curve=new THREE.CurvePath();for(let n=1;n<pts.length;n++)curve.add(new THREE.LineCurve3(pts[n-1],pts[n]));
    const path=new THREE.Mesh(new THREE.TubeGeometry(curve,Math.max(60,pts.length*3),.095,10,false),material);path.userData.route=i;path.castShadow=true;group.add(path);paths.push(path);
    const bead=new THREE.Mesh(new THREE.SphereGeometry(.17,20,16),material.clone());bead.castShadow=true;group.add(bead);beads.push(bead);
    if(i&&!projection.input.reviewed){path.visible=false;bead.visible=false;}
    const tag=label([t('유지','Keep','保持'),t('+5분','+5 min','+5分'),t('주 +1회','+1/week','每周+1次')][i]);tag.classList.add('is-route');tag.style.borderColor=colors[i];routeLabels.push(tag);
  }
  // Planned support work leaves and rejoins the same start, not a second syllabus.
  if(projection.input.reviewSessions>0){
    const end=reviewEnd(projection.scenarios[0]);
    const first=end!==null&&end<=until?window.NM_STUDY_PROJECTION.atWeek(projection,0,end):null;
    if(first){const p0=point(projection.scenarios[0].points[0],0),p1=point(first,0),mid=p0.clone().lerp(p1,.5);mid.z=-1.1;mid.y=.12;
      group.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(p0,mid,p1),32,.045,8,false),gold));}
  }
  const start=new THREE.Mesh(new THREE.CylinderGeometry(.3,.38,.18,24),gold);start.position.set(-5.6,.02,0);group.add(start);
  const goalSheet=new THREE.Mesh(new THREE.PlaneGeometry(6.1,5.1),new THREE.MeshBasicMaterial({color:'#a2834a',transparent:true,opacity:.12,side:THREE.DoubleSide,depthWrite:false}));goalSheet.rotation.y=Math.PI/2;goalSheet.position.set(-5.6+11.2*projection.deadlineWeeks/until,2.15,0);group.add(goalSheet);
  label(t('목표일','Target date','目标日'),new THREE.Vector3(goalSheet.position.x,4.8,0));
  for(let n=0;n<=4;n++){
    const x=-5.6+11.2*n/4;
    const bar=new THREE.Mesh(new THREE.BoxGeometry(.018,.012,5.3),ink);bar.position.set(x,-.137,0);scene.add(bar);
    label(Math.round(until*n/4)+t('주','w','周'),new THREE.Vector3(x,0,2.9),true);
  }
  // Milestones derive from existing canonical course-session boundaries.
  const axis=new THREE.Mesh(new THREE.CylinderGeometry(.018,.018,4.4,8),gold);axis.position.set(-5.95,2,0);scene.add(axis);
  const marked=new Set(Array.from({length:Math.min(8,projection.milestones.length)},(_,n)=>Math.round(n*(projection.milestones.length-1)/Math.max(1,Math.min(8,projection.milestones.length)-1))));
  projection.milestones.forEach((m,i)=>{const h=.16+4*m.to/total;const pin=new THREE.Mesh(new THREE.SphereGeometry(.065,10,8),gold);pin.position.set(-5.95,h,0);scene.add(pin);if(marked.has(i))label(m.course,new THREE.Vector3(-6.3,h,0),true);});
  let az=.28,selected=0,week=o.week||0,disposed=false,visible=true,raf=0;
  const place=(el,p,dy=0)=>{const v=p.clone().project(cam),w=host.clientWidth,h=host.clientHeight;const x=Math.max(30,Math.min(w-30,(v.x+1)*w/2)),y=Math.max(12,Math.min(h-12,(1-v.y)*h/2+dy));el.style.left=x+'px';el.style.top=y+'px';};
  const render=()=>{raf=0;if(disposed||document.hidden||!visible||!host.isConnected)return;r.render(scene,cam);host.dataset.renderer='webgl';fixedLabels.forEach(x=>place(x.el,x.position));routeLabels.forEach((el,i)=>{el.hidden=(!projection.input.reviewed&&i>0)||(week<=projection.input.holdWeeks&&i!==selected);el.style.opacity=i===selected?'1':'.7';place(el,beads[i].position,[-21,-43,1][i]);});};
  const draw=()=>{if(!raf&&!disposed&&visible&&!document.hidden)raf=requestAnimationFrame(render);};
  const camera=()=>{const width=Math.max(1,host.clientWidth),height=Math.max(1,host.clientHeight);r.setSize(width,height,false);cam.aspect=width/height;cam.fov=width<500?53:40;cam.position.set(14*Math.sin(az),10,16*Math.cos(az));cam.lookAt(0,1.65,0);cam.updateProjectionMatrix();draw();};
  const updateWeek=n=>{week=Math.max(0,Math.min(until,n));for(let i=0;i<3;i++){const p=window.NM_STUDY_PROJECTION.atWeek(projection,i,week);beads[i].position.copy(point(p,i));}host.dataset.week=String(week);draw();};
  const select=i=>{selected=i;materials.forEach((m,n)=>{m.opacity=n===i?1:.32;});host.dataset.selected=String(i);draw();};
  const ray=new THREE.Raycaster();ray.params.Line={threshold:.3};const pointer=new THREE.Vector2();
  const click=e=>{const box=canvas.getBoundingClientRect();pointer.set((e.clientX-box.left)/box.width*2-1,-(e.clientY-box.top)/box.height*2+1);ray.setFromCamera(pointer,cam);const hit=ray.intersectObjects(paths)[0];if(hit&&o.onSelect)o.onSelect(hit.object.userData.route);};
  const lost=e=>{if(disposed)return;e.preventDefault();host.dataset.renderer='unavailable';canvas.hidden=true;if(o.onUnavailable)o.onUnavailable();};
  canvas.addEventListener('click',click);canvas.addEventListener('webglcontextlost',lost);
  const resize=new ResizeObserver(camera);resize.observe(host);
  const intersection=new IntersectionObserver(es=>{visible=es.some(e=>e.isIntersecting);if(visible)draw();});intersection.observe(host);
  const vis=()=>{if(!document.hidden)draw();};document.addEventListener('visibilitychange',vis);
  stopObservers=()=>{cancelAnimationFrame(raf);resize.disconnect();intersection.disconnect();document.removeEventListener('visibilitychange',vis);canvas.removeEventListener('click',click);canvas.removeEventListener('webglcontextlost',lost);};
  camera();updateWeek(week);select(selected);
  return {select,week:updateWeek,orbit(direction){az=direction===0?.28:Math.max(-.9,Math.min(.9,az+direction*.25));camera();},
    _debug:{renderer:r},
    dispose(){if(disposed)return;disposed=true;stopObservers();release();host.dataset.renderer='disposed';},
    debug(){return {week,selected,beads:beads.map(x=>x.position.toArray()),curves:paths.length,meshes:scene.children.length,disposed};}};
  }catch(error){stopObservers();release();throw error;}
}
