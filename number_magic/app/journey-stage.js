/* Rendering owns no answers or progression. Positions project stable semantic IDs.
   No answer-bearing raster, SVG billboard, or autoplay completion is used. */
export function createStage(stage,T,chars,initial,onSelect,onLost){
 const canvas=document.createElement('canvas');canvas.setAttribute('role','img');canvas.setAttribute('aria-label',stage.parentElement.querySelector('h2').textContent);
 const renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'low-power'}),scene=new T.Scene(),camera=new T.OrthographicCamera(-6,6,6,-6,.1,100);
 const geometries=new Set(),materials=new Set(),pieces=new Map(),poses=new Map(),extras=[],labels=[],decorations=[];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let v=initial,disposed=false,raf=0,last=0,time=0,until=0,pawn=null,visible=true,sceneKey=null,down=null;
 const geo=g=>(geometries.add(g),g),mat=color=>{const m=new T.MeshPhysicalMaterial({color,roughness:.31,metalness:.02,clearcoat:.6,clearcoatRoughness:.24});materials.add(m);return m;};
 const teal=mat('#248c90'),orange=mat('#ea9a40'),cream=mat('#f8f0d8'),dark=mat('#455850'),well=mat('#a3b3a5'),white=mat('#fffcf2'),selected=mat('#f2cf5b');
 scene.background=new T.Color('#e8eadf');renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;
 const sun=new T.DirectionalLight('#fff1dd',3);sun.position.set(-6,14,10);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-12,right:12,top:12,bottom:-12,near:1,far:40});sun.shadow.normalBias=.025;scene.add(sun,new T.HemisphereLight('#fcfff6','#82988b',2));
 const fill=new T.DirectionalLight('#deecff',.8);fill.position.set(7,5,-8);scene.add(fill);
 const box=(w,h,d,r=.12)=>{const shape=new T.Shape(),x=-w/2,y=-d/2;shape.moveTo(x+r,y);shape.lineTo(x+w-r,y);shape.quadraticCurveTo(x+w,y,x+w,y+r);shape.lineTo(x+w,y+d-r);shape.quadraticCurveTo(x+w,y+d,x+w-r,y+d);shape.lineTo(x+r,y+d);shape.quadraticCurveTo(x,y+d,x,y+d-r);shape.lineTo(x,y+r);shape.quadraticCurveTo(x,y,x+r,y);const b=Math.min(h/3,r/2),g=new T.ExtrudeGeometry(shape,{depth:h-b*2,bevelEnabled:true,bevelSegments:3,bevelSize:b,bevelThickness:b,curveSegments:6});g.rotateX(-Math.PI/2);g.translate(0,b,0);return geo(g);};
 const tile=box(.64,.32,.64,.14),commonTile=box(.54,.26,.54,.11),ribbon=box(.69,.08,.32,.06),sphere=geo(new T.SphereGeometry(.31,20,14)),circle=geo(new T.CylinderGeometry(.115,.115,.026,16)),stripe=box(.40,.027,.065,.02),recess=box(.73,.04,.73,.13),tray=box(1,.055,1,.05),trackDot=geo(new T.SphereGeometry(.13,12,8));
 function mesh(g,m,x=0,y=0,z=0,parent=scene){const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
 function extra(g,m,x,y,z){const o=mesh(g,m,x,y,z);extras.push(o);return o;}
 function label(text,x,y,z,id){const el=document.createElement('span');el.textContent=text;if(id)el.dataset.object=id;stage.querySelector('.nm-journey-labels').appendChild(el);labels.push({el,p:new T.Vector3(x,y,z)});return el;}
 function clearScene(){for(const o of pieces.values())scene.remove(o);pieces.clear();poses.clear();for(const o of [...extras,...decorations])scene.remove(o);extras.length=0;decorations.length=0;pawn?.dispose();pawn=null;labels.length=0;stage.querySelector('.nm-journey-labels').replaceChildren();}
 function pose(o,p,snap){const prior=poses.get(o);if(prior&&prior.to.equals(p)&&!snap)return;const instant=snap||reduced.matches;poses.set(o,{from:instant?p.clone():o.position.clone(),to:p.clone(),start:performance.now()-(instant?900:0)});if(instant)o.position.copy(p);}
 const mobile=()=>stage.clientWidth<600;
 const largeText=()=>parseFloat(getComputedStyle(stage.querySelector('.nm-journey-labels')).fontSize)>=30;
 function tenSlot(i,side){return new T.Vector3((mobile()?-1.68:side==='left'?-3.1:1.6)+(i%5)*.84,.16,(mobile()?side==='left'?-1.75:1.4:-.6)+Math.floor(i/5)*.9);}
 function layout(o,index){
  if(v.kind==='ten')return tenSlot(o.slot,o.group);
  if(v.word==='divide'){const n=o.origin==='A'?index:index-v.a,k=v.groupSize||Math.max(v.a,v.b);return new T.Vector3(-3.4+n*.7+Math.floor(n/k)*.18,.16,o.origin==='A'?-1.2:1.0);}
  if(v.phase<2||v.word){const column=(index<(v.a)?index:index-v.a);if(v.groupSize){const group=Math.floor(column/v.groupSize),cell=column%v.groupSize,step=Math.ceil(Math.min(v.groupSize,o.origin==='A'?v.a:v.b)/3)*.68+.6;return new T.Vector3((o.origin==='A'?-4.3:1.3)+(group%2)*2.3+(cell%3)*.68,.16,-1.5+Math.floor(group/2)*step+Math.floor(cell/3)*.68);}
   return new T.Vector3((o.origin==='A'?-3:1.7)+(column%3)*.72,.16,-1.2+Math.floor(column/3)*.86);
  }
  if(!v.rearranged)return new T.Vector3((index%v.b-(v.b-1)/2)*.78,.16,(Math.floor(index/v.b)-(v.a-1)/2)*.82);
  const section=Math.floor(index/12),local=index%12,group=Math.floor(local/v.greatest),cell=local%v.greatest;
  return new T.Vector3((section%2?.6:-4.4)+(group%3)*1.6+cell*.68,.16,(Math.floor(section/2)?1.5:-2.0)+Math.floor(group/3)*1.05);
 }
 function build(){
  clearScene();sceneKey=v.id;
  const line=v.kind==='integer';extra(box(line?18:mobile()&&v.kind==='ten'?5.7:11,.28,line?4.3:8,.4),cream,0,-.4,0);
  if(v.kind==='ten'){
   for(const side of ['left','right']){const p=tenSlot(4,side);extra(box(4.6,.16,2.45,.23),well,p.x-1.68,-.10,p.z+.45);for(let i=0;i<10;i++){const p=tenSlot(i,side);extra(recess,dark,p.x,.05,p.z);}}
  }
  if(line){
   extra(box(17.4,.10,.70,.12),well,0,-.06,.1);
   for(let n=-8;n<=8;n++){extra(box(.03,.035,.36,.01),dark,n,.04,.34);if(n===0||(!mobile()&&!largeText())||n%2===0)label(n<0?'−'+Math.abs(n):String(n),n,.09,.95,'tick-'+n);}
   const zero=extra(geo(new T.TorusGeometry(.19,.035,8,24)),teal,0,.08,.13);zero.rotation.x=-Math.PI/2;
   pawn=chars.makeCharacter(T,{kind:'boy',height:4.2,props:false,blob:false,shadows:true});scene.add(pawn.object);pawn.object.position.set(v.position,.08,0);pawn.faceNow(v.face===null?0:v.face*Math.PI/2);
   label('',0,.1,2.3,'path');
  }
 }
 function sync(next,snap=false){
  if(disposed)return;const old=v;v=next;const boundary=sceneKey!==v.id;
  if(boundary||mobile()!==stage.__journeyMobile||largeText()!==stage.__journeyLargeText){stage.__journeyMobile=mobile();stage.__journeyLargeText=largeText();build();snap=true;}
    if(v.kind==='integer'){
   pose(pawn.object,new T.Vector3(v.position,.08,0),snap);
   if(v.face!==null){if(snap||reduced.matches)pawn.faceNow(v.face*Math.PI/2);else pawn.face(v.face*Math.PI/2);}
   pawn.setWalking(!snap&&pawn.object.position.distanceTo(poses.get(pawn.object).to)>.01,1.0,v.walk===-1&&v.phase>=4);
   const path=labels.find(l=>l.el.dataset.object==='path');path.el.textContent=v.phase>=4?v.path.slice(1).map(n=>n<0?'−'+Math.abs(n):String(n)).join(' → '):'';
  }else{
   const live=new Set(v.objects.map(o=>o.id));for(const [id,o]of pieces)if(!live.has(id)){scene.remove(o);pieces.delete(id);poses.delete(o);}
   for(let i=0;i<v.objects.length;i++){
    const d=v.objects[i];let o=pieces.get(d.id);if(!o){o=new T.Group();const body=mesh(v.kind==='ten'&&v.word?sphere:v.word==='divide'?ribbon:v.kind==='common'?commonTile:tile,d.mark==='stripe'?orange:teal,0,0,0,o);body.userData.body=true;mesh(d.mark==='stripe'?stripe:circle,white,0,v.word==='divide'?.10:v.word&&v.kind==='ten'?.29:v.kind==='common'?.285:.35,0,o);o.userData.id=d.id;scene.add(o);pieces.set(d.id,o);o.position.copy(layout(d,i));}
    o.visible=!(v.kind==='common'&&(v.phase===1||v.word==='meet'&&v.model==='meet'));o.userData.origin=d.origin;o.userData.group=d.group;o.userData.slot=d.slot;o.userData.selected=v.selected.includes(d.id);
    o.children[0].material=v.selected.includes(d.id)?selected:d.mark==='stripe'?orange:teal;pose(o,layout(d,i),snap);
   }
   // Count labels are observed counts only; the final answer is not pre-rendered.
   for(const l of labels)l.el.remove();labels.length=0;for(const o of decorations)scene.remove(o);decorations.length=0;
   const decorate=(g,m,x,y,z,sx=1,sz=1)=>{const o=mesh(g,m,x,y,z);o.scale.set(sx,1,sz);decorations.push(o);return o;};
   if(v.kind==='ten'){const p=tenSlot(4,'left'),q=tenSlot(4,'right');label(String(v.a+v.moved.length),p.x-1.6,.2,p.z+1.65,'left-count');label(String(v.b-v.moved.length),q.x-1.6,.2,q.z+1.65,'right-count');}
   else if(v.phase===1||v.word==='meet'&&v.model==='meet'){
    for(const [key,n,list,z,m]of [['A',v.a,v.trackA,-1.2,teal],['B',v.b,v.trackB,1.2,orange]]){
     decorate(tray,well,0,.02,z,9.6,.35);label(String(n),-5,.2,z-.7,'track-name-'+key);label('0',-4.5,.2,z+.5,'zero-'+key);
     for(const value of list){decorate(trackDot,m,-4.5+value*.18,.18,z);label(String(value),-4.5+value*.18,.2,z+.5,'track-'+key+'-'+value);}
    }
   }else if(v.rearranged){for(let section=0;section<Math.ceil(v.objects.length/12);section++)label(`${section*12+1}–${Math.min((section+1)*12,v.objects.length)}`,section%2?1.7:-3, .2,Math.floor(section/2)?3.7:.15,'section-'+section);
    for(let i=0;i<v.objects.length;i+=v.greatest){const p=layout(v.objects[i],i);decorate(tray,well,p.x+(v.greatest-1)*.34,.03,p.z,v.greatest*.68+.18,.85);}
   }else if(v.word==='divide'){label(`${v.a} m`,-4.5,.2,-1.2,'ribbon-A');label(`${v.b} m`,-4.5,.2,1.0,'ribbon-B');if(v.groupSize)for(const origin of ['A','B']){const n=origin==='A'?v.a:v.b;for(let i=0;i<n;i+=v.groupSize){const d=v.objects.find(o=>o.origin===origin&&o.slot===i),p=layout(d,origin==='A'?i:v.a+i),size=Math.min(v.groupSize,n-i);decorate(tray,size===v.groupSize?well:selected,p.x+(size-1)*.35,.03,p.z,size*.7+.12,.6);label(`${size} m`,p.x+(size-1)*.35,.2,p.z+.6,'ribbon-'+origin+'-'+i);}}}
   else if(v.phase===0&&v.groupSize){for(const origin of ['A','B']){const n=origin==='A'?v.a:v.b;for(let i=0;i<n;i+=v.groupSize){const d=v.objects.find(o=>o.origin===origin&&o.slot===i),p=layout(d,origin==='A'?i:v.a+i),size=Math.min(v.groupSize,n-i),rows=Math.ceil(size/3),cols=Math.min(3,size);decorate(tray,size===v.groupSize?well:selected,p.x+(cols-1)*.34,.03,p.z+(rows-1)*.34,cols*.68+.12,rows*.68+.12);}}}
  }
  until=performance.now()+1000;resize();wake();
 }
 function labelPositions(){scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);for(const l of labels){const p=l.p.clone().project(camera);l.el.style.left=`${(p.x+1)*50}%`;l.el.style.top=`${(1-p.y)*50}%`;}}
 function resize(){if(disposed)return;const w=stage.clientWidth||1,h=stage.clientHeight||1;renderer.setSize(w,h,false);const aspect=w/h,width=v.kind==='integer'?19:mobile()&&v.kind==='ten'?6.4:v.kind==='common'?10.6:12,height=Math.max(v.kind==='integer'?5.8:8.5,width/aspect);camera.left=-height*aspect/2;camera.right=height*aspect/2;camera.top=height/2;camera.bottom=-height/2;camera.position.set(0,14,13);camera.lookAt(0,0,0);camera.updateProjectionMatrix();labelPositions();}
 function frame(now){raf=0;if(disposed||document.hidden||!visible)return;if(!stage.isConnected){dispose();return;}const dt=Math.min(.05,(now-(last||now))/1000);last=now;time+=dt;let moving=false;
  for(const [o,p]of poses){const f=reduced.matches?1:Math.max(0,Math.min(1,(now-p.start)/650)),e=f*f*(3-2*f);o.position.lerpVectors(p.from,p.to,e);if(f<1){moving=true;if(v.kind!=='integer')o.position.y+=Math.sin(f*Math.PI)*.55;}}
  if(pawn){if(!moving)pawn.setWalking(false);if(!reduced.matches)pawn.update(dt,time);}renderer.render(scene,camera);labelPositions();if(!reduced.matches||now<until)raf=requestAnimationFrame(frame);
 }
 function wake(){if(!disposed&&!raf&&visible&&!document.hidden){last=performance.now();raf=requestAnimationFrame(frame);}}
 const ro=new ResizeObserver(()=>{if(disposed)return;if(stage.__journeyMobile!==mobile()||stage.__journeyLargeText!==largeText())sync(v,true);else{resize();wake();}});ro.observe(stage);
 const styleObserver=new MutationObserver(()=>{if(!disposed&&stage.__journeyLargeText!==largeText())sync(v,true);});styleObserver.observe(document.head,{childList:true});
 const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)wake();else{cancelAnimationFrame(raf);raf=0;}},{threshold:.01});io.observe(stage);
 const ray=new T.Raycaster(),pointer=new T.Vector2();
 const pointerDown=e=>{down={id:e.pointerId,x:e.clientX,y:e.clientY};},pointerCancel=()=>{down=null;};
 const pointerUp=e=>{if(down?.id===e.pointerId&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<12&&v.kind==='ten'&&v.phase===1){const r=canvas.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,1-(e.clientY-r.top)/r.height*2);ray.setFromCamera(pointer,camera);const hit=ray.intersectObjects([...pieces.values()],true)[0];if(hit){let o=hit.object;while(!o.userData.id&&o.parent)o=o.parent;const d=v.objects.find(d=>d.id===o.userData.id);if(d?.origin==='right'&&d.group==='right')onSelect(d.id);}}down=null;};
 const visibility=()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;pawn?.setWalking(false);}else wake();},reduce=()=>{sync(v,true);};
 const lost=e=>{e.preventDefault();dispose();onLost();};
 canvas.addEventListener('pointerdown',pointerDown);canvas.addEventListener('pointerup',pointerUp);canvas.addEventListener('pointercancel',pointerCancel);canvas.addEventListener('webglcontextlost',lost);document.addEventListener('visibilitychange',visibility);reduced.addEventListener('change',reduce);
 stage.appendChild(canvas);sync(initial,true);
 function dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(raf);ro.disconnect();io.disconnect();styleObserver.disconnect();document.removeEventListener('visibilitychange',visibility);reduced.removeEventListener('change',reduce);canvas.removeEventListener('pointerdown',pointerDown);canvas.removeEventListener('pointerup',pointerUp);canvas.removeEventListener('pointercancel',pointerCancel);canvas.removeEventListener('webglcontextlost',lost);clearScene();geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());sun.shadow.map?.dispose();renderer.dispose();try{renderer.forceContextLoss();}catch{}canvas.remove();}
 return {sync,dispose,inspect:()=>({renderer:'webgl',scene:v.id,objects:[...pieces.values()].map(o=>({id:o.userData.id,origin:o.userData.origin,group:o.userData.group,position:o.position.toArray()})),person:pawn?{position:pawn.object.position.toArray(),facing:pawn.object.rotation.y,walk:v.walk,human:pawn.recipe.human}:null,ticks:v.kind==='integer'?Array.from({length:17},(_,i)=>i-8):[],camera:{position:camera.position.toArray(),left:camera.left,right:camera.right}})};
}
