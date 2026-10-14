import * as THREE from './vendor/three-r180/three.module.js';

// A view of an applied snapshot. It never writes plans, dates, records or levels.
const axisNames={curriculum:'수학 교과',application:'교과 개념·응용',depth:'교과 심화',thinking:'사고력',arithmetic:'연산',science:'과학',gifted:'영재원',other:'다른 과목',competition:'대회'};
const colors={curriculum:0x2456c4,application:0x2456c4,depth:0x6855aa,thinking:0x347980,arithmetic:0x5b7092,science:0x497a51,gifted:0x766447,other:0x67707c,competition:0x85605c};
function monthOf(x){const v=typeof x==='string'?x:x?.value||x?.month||x?.key||'';return /^\d{4}-\d{2}/.test(v)&&(!x?.precision||['date','month'].includes(x.precision))?v.slice(0,7):null;}
function resourceLabel(text){
 const c=document.createElement('canvas');c.width=512;c.height=80;const ctx=c.getContext('2d');
 ctx.clearRect(0,0,c.width,c.height);ctx.fillStyle='#182230';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='28px "Malgun Gothic", sans-serif';ctx.fillText(text,256,40,500);
 const texture=new THREE.CanvasTexture(c),material=new THREE.SpriteMaterial({map:texture,transparent:true,depthTest:false});
 const sprite=new THREE.Sprite(material);sprite.scale.set(3.4,.53,1);return sprite;
}
export function mountRoadmapScene(host,projection,{onSelect=()=>{},selectedMonth}={}){
 const snapshotId=projection.snapshotId||projection.snapshot?.id||'미적용';
 host.replaceChildren();host.dataset.snapshotId=snapshotId;host.dataset.renderer='preparing';
 const info=document.createElement('p');info.className='scene-note';info.textContent='가로는 월, 나란한 길은 학습 영역입니다. 높이는 실력이나 수준을 뜻하지 않습니다.';
 const toolbar=document.createElement('div');toolbar.className='scene-toolbar';
 const canvas=document.createElement('canvas');canvas.setAttribute('aria-label','같은 월별 계획의 3D 보기. 항목 선택은 아래 목록에서도 할 수 있습니다.');canvas.style.cssText='display:block;width:100%;height:360px;touch-action:pan-y;border:1px solid #d8dee8;border-radius:6px;background:#f5f6f8';
 host.append(info,toolbar,canvas);
 const gl=canvas.getContext('webgl2',{antialias:true,alpha:true});
 if(!gl){canvas.remove();const fallback=document.createElement('p');fallback.role='status';fallback.textContent='이 기기에서는 3D 보기를 사용할 수 없습니다. 월표와 그래프에서 같은 계획을 볼 수 있습니다.';host.append(fallback);host.dataset.renderer='unavailable';return {dispose(){},update(){}};}
 const renderer=new THREE.WebGLRenderer({canvas,context:gl,antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
 const scene=new THREE.Scene();scene.background=new THREE.Color('#f5f6f8');
 const camera=new THREE.OrthographicCamera(-12,12,7,-7,.1,150);const group=new THREE.Group();scene.add(group);
 const items=projection.monthlyRows||projection.items||projection.allItems||[];
 const rawMonths=projection.months||projection.rangeMonths||projection.range?.months||[];
 let months=rawMonths.map(monthOf).filter(Boolean);
 if(!months.length){months=[...new Set(items.flatMap(x=>x.months||[monthOf(x.start||x.planStart||x.period?.start),monthOf(x.end||x.planEnd||x.period?.end)]).map(monthOf).filter(Boolean))].sort();}
 if(!months.length&&selectedMonth)months=[selectedMonth];
 const lanes=[...new Set(items.map(x=>x.axis||x.track||x.area).filter(Boolean))];if(!lanes.length)lanes.push('application','thinking','arithmetic');
 const span=Math.max(1,months.length),laneSpan=Math.max(1,lanes.length),width=span*1.35;
 const positionX=i=>(i-(span-1)/2)*1.35,positionZ=i=>(i-(laneSpan-1)/2)*1.6;
 const hits=[],resources=[];
 const add=o=>{group.add(o);resources.push(o);return o;};
 for(let l=0;l<lanes.length;l++){
  const rail=add(new THREE.Mesh(new THREE.BoxGeometry(width,.025,.9),new THREE.MeshBasicMaterial({color:0xe4e9f0})));rail.position.set(0,-.14,positionZ(l));
  const label=add(resourceLabel(axisNames[lanes[l]]||lanes[l]));label.position.set(-width/2-1.8,.06,positionZ(l));
 }
 for(let m=0;m<months.length;m++){
  const line=add(new THREE.Mesh(new THREE.BoxGeometry(.012,.02,laneSpan*1.6),new THREE.MeshBasicMaterial({color:0xc4cddb})));line.position.set(positionX(m),-.1,0);
  const label=add(resourceLabel(months[m]));label.position.set(positionX(m),.08,positionZ(laneSpan-1)+1.2);label.scale.set(1.25,.24,1);
 }
 const visible=[];
 for(const item of items){
  const axis=item.axis||item.track||item.area,l=lanes.indexOf(axis);if(l<0)continue;
  const start=monthOf(item.startMonth||item.start||item.planStart||item.period?.start),end=monthOf(item.endMonth||item.end||item.planEnd||item.period?.end);
  const itemMonths=Array.isArray(item.months)?item.months.map(monthOf).filter(Boolean):!start&&end?[end]:months.filter(m=>(!start||m>=start)&&(!end||m<=end)&&(start||end));
  const indexes=itemMonths.map(m=>months.indexOf(m)).filter(i=>i>=0);if(!indexes.length)continue;
  const first=Math.min(...indexes),last=Math.max(...indexes),actual=item.kind==='actual'||item.role==='actual'||item.layer==='actual',official=item.kind==='official'||item.role==='official';
  const material=new THREE.MeshBasicMaterial({color:official?0x986846:colors[axis]||0x67707c,transparent:!actual,opacity:actual?1:.72,wireframe:!actual&&!official});
  const mesh=add(new THREE.Mesh(new THREE.BoxGeometry((last-first+1)*1.35-.18,.22,.52),material));
  const overlapping=visible.filter(x=>x.axis===axis&&!(x.last<first||x.first>last)).length;
  mesh.position.set((positionX(first)+positionX(last))/2,.08+overlapping*.28,positionZ(l));mesh.userData.itemId=item.itemId||item.id;mesh.userData.title=item.title||item.name||item.course||'학습 항목';hits.push(mesh);visible.push({axis,first,last,item});
 }
 const selection=document.createElement('p');selection.className='scene-selection';selection.setAttribute('role','status');selection.textContent=visible.length?'항목을 누르면 월 상세와 같은 기록을 볼 수 있습니다.':'월이 정해진 항목이 없습니다. 시점 미정 목록의 기록은 그대로 보관됩니다.';host.append(selection);
 const list=document.createElement('div');list.className='scene-item-list';list.style.cssText='display:flex;gap:8px;flex-wrap:wrap';
 for(const {item} of visible){const button=document.createElement('button');button.type='button';button.textContent=(item.kind==='actual'?'실제 · ':item.kind==='official'?'공식 · ':'계획 · ')+(item.title||item.name||item.course||'학습 항목');button.addEventListener('click',()=>onSelect(item.itemId||item.id));list.append(button);}host.append(list);
 let yaw=-.52,zoom=1,disposed=false,drag=null;
 function draw(){if(disposed)return;const w=Math.max(260,host.clientWidth),h=360;renderer.setSize(w,h,false);const extent=Math.max(width+9,laneSpan*2.7,16)/zoom;camera.left=-extent/2;camera.right=extent/2;camera.top=extent*h/w/2;camera.bottom=-camera.top;camera.updateProjectionMatrix();camera.position.set(14*Math.sin(yaw),15,14*Math.cos(yaw));camera.lookAt(-.4,0,0);renderer.render(scene,camera);}
 for(const [text,fn] of [['왼쪽 회전',()=>yaw-=.16],['오른쪽 회전',()=>yaw+=.16],['확대',()=>zoom=Math.min(2,zoom+.15)],['축소',()=>zoom=Math.max(.6,zoom-.15)],['보기 초기화',()=>{yaw=-.52;zoom=1;}]]){const b=document.createElement('button');b.type='button';b.textContent=text;b.addEventListener('click',()=>{fn();draw();});toolbar.append(b);}
 const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
 function down(e){drag={x:e.clientX,y:e.clientY,yaw};}
 function up(e){if(!drag)return;const distance=Math.abs(e.clientX-drag.x)+Math.abs(e.clientY-drag.y);if(distance<8){const rect=canvas.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(hits)[0];if(hit){selection.textContent=hit.object.userData.title;onSelect(hit.object.userData.itemId);}}drag=null;}
 function move(e){if(!drag)return;if(Math.abs(e.clientX-drag.x)>8){yaw=drag.yaw+(e.clientX-drag.x)*.005;draw();}}
 function lost(e){e.preventDefault();host.dataset.renderer='unavailable';canvas.hidden=true;selection.textContent='3D 갱신을 기다리고 있습니다. 월표와 그래프의 기록은 그대로 볼 수 있습니다.';}
 canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',up);canvas.addEventListener('webglcontextlost',lost);
 const observer=new ResizeObserver(draw);observer.observe(host);draw();host.dataset.renderer='ready';canvas.dataset.snapshotId=snapshotId;
 return {update(){draw();},dispose(){disposed=true;observer.disconnect();canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerup',up);canvas.removeEventListener('webglcontextlost',lost);for(const o of resources){o.geometry?.dispose();const mats=Array.isArray(o.material)?o.material:[o.material];for(const m of mats){m?.map?.dispose();m?.dispose();}}renderer.dispose();renderer.forceContextLoss();}};
}
