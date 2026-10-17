import * as THREE from './vendor/three-r180/three.module.js';
import {buildProgressRoadmap} from './progress-roadmap.mjs';

const mounts=new WeakMap();
const emptyLabels={unknown:'잘 모르겠다고 답한 진도예요.',not_started:'아직 따로 하지 않은 진도예요.',unentered:'아직 입력한 교재 진도가 없어요.'};
export function buildProgressSceneModel(state,data,track='',courseId=''){
 const roadmap=buildProgressRoadmap(state,data),lane=roadmap.lanes.find(x=>x.track===track)||roadmap.lanes.find(x=>x.records.length)||roadmap.lanes[0];
 const record=lane.records.find(x=>x.courseId===courseId)||lane.records.at(-1)||null;
 const nodes=record?[{id:record.courseId,kind:'recorded_current',label:record.current.label,caption:'입력한 진도',progress:record.current.progress,source:record.source,calendarDate:null},...record.next.slice(0,2).map(x=>({id:x.id,kind:x.kind,label:x.label,caption:x.kind==='unconfirmed'?'확인 필요':x.order===1?'다음 비교 과정':'그다음 비교 과정',progress:x.kind==='unconfirmed'?'자료 확인 필요':'원표 비교 · 시점 미정',source:x.source,calendarDate:null}))]:[];
 return {kind:'read_only_progress_scene',track:lane.track,trackLabel:lane.label,axes:roadmap.lanes.map(x=>({track:x.track,label:x.label,count:x.records.length})),courses:lane.records.map(x=>({id:x.courseId,label:x.current.label})),courseId:record?.courseId||'',nodes,emptyText:emptyLabels[lane.emptyState]||emptyLabels.unentered,scopeReference:record?.sourceMatchKind==='scope_reference',mixedSourceAxes:record?.mixedSourceAxes||false,automaticApply:false,automaticPromotion:false,calendarDates:null,mastery:null};
}
function disposeTree(tree){
 const geometries=new Set(),materials=new Set(),textures=new Set();
 tree.traverse(o=>{if(o.geometry)geometries.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])if(m){materials.add(m);for(const key of ['map','alphaMap','normalMap','roughnessMap','metalnessMap'])if(m[key])textures.add(m[key]);}o.shadow?.map?.dispose();});
 for(const x of textures)x.dispose();for(const x of materials)x.dispose();for(const x of geometries)x.dispose();
}
function labelSprite(doc,text){
 const canvas=doc.createElement('canvas');canvas.width=512;canvas.height=320;
 const ctx=canvas.getContext('2d');if(!ctx)return null;
 ctx.clearRect(0,0,512,320);ctx.fillStyle='#433b57';ctx.font='600 48px "Malgun Gothic",sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
 const lines=[];let line='';for(const ch of String(text)){if(ctx.measureText(line+ch).width>470&&line){lines.push(line);line=ch;}else line+=ch;}if(line)lines.push(line);
 const shown=lines.slice(0,4);if(lines.length>4)shown[3]=shown[3].slice(0,-1)+'…';const y=(320-shown.length*60)/2+30;
 shown.forEach((value,i)=>ctx.fillText(value,256,y+i*60,480));
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
 const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,depthTest:false}));sprite.scale.set(2.65,1.66,1);return sprite;
}

export function mountProgressScene(host,{state,data}={}){
 mounts.get(host)?.dispose();
 const doc=host.ownerDocument||document,root=doc.createElement('section');root.className='progress-scene';root.dataset.progressScene='';
 const make=(tag,cls,text='')=>{const node=doc.createElement(tag);if(cls)node.className=cls;if(text)node.textContent=text;return node;};
 const title=make('h3','progress-scene-title','진도 지도로 살펴보기');
 const axes=make('div','progress-scene-axes');axes.setAttribute('role','group');axes.setAttribute('aria-label','살펴볼 학습 영역');
 const courseLabel=make('label','progress-scene-course-label','기록한 교재');const courseSelect=make('select','progress-scene-course');courseSelect.dataset.progressSceneCourse='';courseLabel.append(courseSelect);
 const viewport=make('div','progress-scene-viewport'),canvas=make('canvas','progress-scene-canvas');canvas.setAttribute('aria-label','입력한 현재 진도와 다음 원표 비교 과정. 아래 버튼에서도 같은 항목을 선택할 수 있어요.');canvas.style.touchAction='pan-y';
 const fallback=make('p','progress-scene-fallback');fallback.setAttribute('role','status');fallback.hidden=true;viewport.append(canvas,fallback);
 const toolbar=make('div','progress-scene-toolbar');toolbar.setAttribute('role','group');toolbar.setAttribute('aria-label','지도 보기 조절');
 for(const [action,label]of [['left','왼쪽 보기'],['right','오른쪽 보기'],['reset','보기 초기화']]){const button=make('button','',label);button.type='button';button.dataset.progressSceneAction=action;toolbar.append(button);}
 const list=make('div','progress-scene-node-list');list.setAttribute('role','group');list.setAttribute('aria-label','지도와 같은 진도 항목');
 const readout=make('div','progress-scene-readout');readout.setAttribute('role','status');readout.setAttribute('aria-live','polite');
 const note=make('p','progress-scene-note','다음 과정은 원표 비교예요. 개인 일정·완료·합격을 정한 계획이 아니에요.');
 root.append(title,axes,courseLabel,viewport,toolbar,list,readout,note);host.replaceChildren(root);host.dataset.renderer='preparing';
 let model=buildProgressSceneModel(state,data),index=0,yaw=-.25,disposed=false,renderer=null,scene=null,camera=null,stage=null,observer=null,drag=null,hits=[],rings=[];
 const cleanup=[];const listen=(target,type,fn,options)=>{target.addEventListener(type,fn,options);cleanup.push(()=>target.removeEventListener(type,fn,options));};
 root.dataset.reducedMotion=String(globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches??false);
 function readSelection(){
  readout.replaceChildren();const node=model.nodes[index];
  if(!node){readout.append(make('p','',`${model.trackLabel} · ${model.emptyText}`));return;}
  readout.append(make('span','progress-scene-readout-caption',node.caption),make('strong','',node.label),make('span','',node.progress));
  if(node.kind==='source_comparison')readout.append(make('p','',model.scopeReference?'같은 학습 범위의 원표 비교이며, 이 교재의 기간은 확인하지 않았어요.':'자료에서 이어지는 비교 과정이에요. 자동으로 시작하거나 진급하지 않아요.'));
  if(model.mixedSourceAxes)readout.append(make('p','', '교과·심화가 함께 담긴 원표를 참고해요. 입력한 두 진도는 따로 유지해요.'));
  for(const button of list.children)button.setAttribute('aria-pressed',String(Number(button.dataset.progressSceneNode)===index));
 }
 function draw(){
  if(disposed||!renderer||!scene||!camera||!model.nodes.length)return;
  const width=Math.max(220,host.clientWidth||320),height=width>=600?360:300;renderer.setSize(width,height,false);
  const extent=Math.max(8.8,model.nodes.length*2.9+.5);camera.left=-extent/2;camera.right=extent/2;camera.top=extent*height/width/2;camera.bottom=-camera.top;camera.updateProjectionMatrix();
  camera.position.set(11*Math.sin(yaw),9.5,12*Math.cos(yaw));camera.lookAt(0,.7,0);
  rings.forEach((ring,i)=>{ring.material.color.setHex(i===index?0x8063b7:i===0?0xa190bc:0xd6cde4);ring.scale.setScalar(i===index?1.06:1);});renderer.render(scene,camera);
 }
 function initializeRenderer(){
  try{
   const gl=canvas.getContext('webgl2',{alpha:true,antialias:true});if(!gl)throw Error('WebGL unavailable');
   renderer=new THREE.WebGLRenderer({canvas,context:gl,alpha:true,antialias:true});renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio||1,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;
   scene=new THREE.Scene();scene.background=new THREE.Color('#f8f5ef');camera=new THREE.OrthographicCamera(-5,5,4,-4,.1,80);
   scene.add(new THREE.HemisphereLight(0xfffaf0,0xc1b5d0,2.2));const sunlight=new THREE.DirectionalLight(0xfffaf0,3.2);sunlight.position.set(-4,9,6);sunlight.castShadow=true;sunlight.shadow.mapSize.set(1024,1024);sunlight.shadow.camera.left=-7;sunlight.shadow.camera.right=7;sunlight.shadow.camera.top=6;sunlight.shadow.camera.bottom=-6;sunlight.shadow.normalBias=.035;scene.add(sunlight);
   stage=new THREE.Group();scene.add(stage);return true;
  }catch{renderer?.dispose();renderer=null;host.dataset.renderer='unavailable';canvas.hidden=true;fallback.hidden=false;fallback.textContent='이 기기에서는 3D 대신 아래의 같은 진도 항목으로 살펴볼 수 있어요.';return false;}
 }
 const material=color=>new THREE.MeshStandardMaterial({color,roughness:.82,metalness:0});
 function mesh(geometry,color,parent=stage){const item=new THREE.Mesh(geometry,material(color));item.castShadow=true;item.receiveShadow=true;parent.add(item);return item;}
 function rebuildGeometry(){
  if(!renderer||!stage)return;disposeTree(stage);stage.clear();hits=[];rings=[];
  const count=model.nodes.length,positions=model.nodes.map((_,i)=>new THREE.Vector3((i-(count-1)/2)*2.85,0,i%2?.06:.28));
  const floor=mesh(new THREE.BoxGeometry(Math.max(9,count*3.1),.12,4.8),0xf3efe6);floor.position.y=-.3;
  positions.forEach((position,i)=>{
   if(i){const a=positions[i-1],b=position,curve=new THREE.CatmullRomCurve3([new THREE.Vector3(a.x+.85,-.04,a.z),new THREE.Vector3((a.x+b.x)/2,-.03,(a.z+b.z)/2-.15),new THREE.Vector3(b.x-.85,-.04,b.z)]);const path=mesh(new THREE.TubeGeometry(curve,20,.085,8,false),0xd9cfe6);path.castShadow=false;}
   const node=model.nodes[i],group=new THREE.Group();group.position.copy(position);stage.add(group);
   const platform=mesh(new THREE.CylinderGeometry(.91,.98,.23,40),i===0?0xe7ddf2:0xf8f5fa,group);platform.userData.nodeIndex=i;hits.push(platform);
   const ring=mesh(new THREE.TorusGeometry(.84,.033,8,48),0xd6cde4,group);ring.rotation.x=Math.PI/2;ring.position.y=.13;rings.push(ring);
   if(node.kind!=='unconfirmed'){
    const book=new THREE.Group();book.position.set(0,.71,0);book.rotation.y=-.2;book.rotation.z=.04;group.add(book);
    const pages=mesh(new THREE.BoxGeometry(.69,.94,.21),0xfffcf4,book);pages.userData.nodeIndex=i;hits.push(pages);
    for(const z of [-.13,.13]){const cover=mesh(new THREE.BoxGeometry(.82,1.06,.045),i===0?0x8d75b6:0xbfb0d5,book);cover.position.z=z;cover.userData.nodeIndex=i;hits.push(cover);}
    const spine=mesh(new THREE.BoxGeometry(.075,1.06,.3),i===0?0x725b9d:0xa995c4,book);spine.position.x=-.39;
    const band=mesh(new THREE.BoxGeometry(.54,.04,.015),0xe8dff3,book);band.position.set(.035,.22,.16);
   }
   if(i===0){const stem=mesh(new THREE.CylinderGeometry(.026,.026,.49,10),0x8063b7,group);stem.position.set(-.66,1.06,.18);const pin=mesh(new THREE.SphereGeometry(.105,16,12),0x8063b7,group);pin.position.set(-.66,1.36,.18);}
   const label=labelSprite(doc,node.label);if(label){label.position.set(position.x,2.17,position.z);stage.add(label);}
  });draw();
 }
 function renderView(){
  axes.replaceChildren();for(const axis of model.axes){const button=make('button','',axis.label);button.type='button';button.dataset.progressSceneTrack=axis.track;button.setAttribute('aria-pressed',String(axis.track===model.track));axes.append(button);}
  courseSelect.replaceChildren();for(const course of model.courses){const option=make('option','',course.label);option.value=course.id;option.selected=course.id===model.courseId;courseSelect.append(option);}courseLabel.hidden=model.courses.length<2;
  list.replaceChildren();list.style.gridTemplateColumns=`repeat(${Math.max(1,model.nodes.length)},minmax(0,1fr))`;model.nodes.forEach((node,i)=>{const button=make('button','');button.type='button';button.dataset.progressSceneNode=String(i);button.append(make('span','progress-scene-button-caption',node.caption),make('strong','',node.label));list.append(button);});
  if(!model.nodes.length){canvas.hidden=true;toolbar.hidden=true;fallback.hidden=false;fallback.textContent=`${model.trackLabel} · ${model.emptyText}`;host.dataset.renderer='empty';}
  else{toolbar.hidden=false;if(!renderer)initializeRenderer();if(renderer){canvas.hidden=false;fallback.hidden=true;host.dataset.renderer='ready';rebuildGeometry();}}
  readSelection();
 }
 listen(root,'click',event=>{event.stopPropagation();const button=event.target.closest?.('button');if(!button)return;
  if(button.dataset.progressSceneTrack){const track=button.dataset.progressSceneTrack;model=buildProgressSceneModel(state,data,track);index=0;yaw=-.25;renderView();for(const item of axes.children)if(item.dataset.progressSceneTrack===track)item.focus?.({preventScroll:true});}
  else if(button.dataset.progressSceneNode!==undefined){index=Number(button.dataset.progressSceneNode);readSelection();draw();}
  else if(button.dataset.progressSceneAction){const action=button.dataset.progressSceneAction;yaw=action==='reset'?-.25:Math.max(-.7,Math.min(.7,yaw+(action==='left'?-.16:.16)));draw();}
 });
 listen(root,'input',event=>event.stopPropagation());listen(root,'change',event=>{event.stopPropagation();if(event.target===courseSelect){model=buildProgressSceneModel(state,data,model.track,courseSelect.value);index=0;renderView();}});
 const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
 listen(canvas,'pointerdown',event=>{drag={x:event.clientX,y:event.clientY,yaw};});
 listen(canvas,'pointermove',event=>{if(!drag)return;const dx=event.clientX-drag.x,dy=event.clientY-drag.y;if(Math.abs(dx)>10&&Math.abs(dx)>Math.abs(dy)){yaw=Math.max(-.7,Math.min(.7,drag.yaw+dx*.005));draw();}});
 listen(canvas,'pointerup',event=>{if(!drag)return;const distance=Math.abs(event.clientX-drag.x)+Math.abs(event.clientY-drag.y);drag=null;if(distance>9||!renderer||!camera)return;const rect=canvas.getBoundingClientRect();pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(hits,false)[0];if(hit){index=hit.object.userData.nodeIndex;readSelection();draw();}});
 listen(canvas,'pointercancel',()=>{drag=null;});listen(canvas,'pointerleave',()=>{drag=null;});
 listen(canvas,'webglcontextlost',event=>{event.preventDefault();canvas.hidden=true;fallback.hidden=false;fallback.textContent='3D 표시가 중단됐어요. 아래 버튼에서 같은 진도를 계속 살펴볼 수 있어요.';host.dataset.renderer='unavailable';});
 const Resize=globalThis.ResizeObserver;if(Resize){observer=new Resize(draw);observer.observe(host);}else if(globalThis.addEventListener)listen(globalThis,'resize',draw);
 const api={dispose(){if(disposed)return;disposed=true;drag=null;observer?.disconnect();for(const remove of cleanup)remove();if(scene)disposeTree(scene);renderer?.dispose();renderer?.forceContextLoss();scene?.clear();if(root.parentNode===host)host.removeChild(root);if(mounts.get(host)===api){mounts.delete(host);host.dataset.renderer='disposed';}}};
 mounts.set(host,api);renderView();return api;
}
