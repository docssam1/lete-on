/* Layout-only decoration. Learning state, course durations and curve data are
   owned by the existing models. Every connector follows its rendered pin. */
(function(global){
 'use strict';
 const NS='http://www.w3.org/2000/svg',mounted=new WeakMap();
 let serial=0;
 function node(doc,name,attributes){const el=doc.createElementNS(NS,name);for(const [key,value]of Object.entries(attributes||{}))el.setAttribute(key,String(value));return el;}
 function unmount(root){const previous=mounted.get(root);if(previous)previous.dispose();mounted.delete(root);}
 function decorate(root,model){
  if(!root)return;
  unmount(root);
  const terrain=root.querySelector('.course-terrain'),route=terrain?.querySelector('.course-route');
  if(!terrain||!route)return;
  const doc=root.ownerDocument,bases=Array.from(terrain.querySelectorAll('.course-stop .stop-base'));
  terrain.classList.toggle('is-extended',bases.length>3);
  const markerId='planner-route-tip-'+(++serial),defs=node(doc,'defs'),marker=node(doc,'marker',{id:markerId,viewBox:'0 0 10 10',refX:8,refY:5,markerWidth:5,markerHeight:5,orient:'auto'});
  marker.append(node(doc,'path',{d:'M1 1L8 5L1 9',class:'presentation-path-arrow'}));defs.append(marker);
  const wash=node(doc,'path',{class:'presentation-path-wash'}),outline=node(doc,'path',{class:'presentation-path-outline'}),line=node(doc,'path',{class:'presentation-path-line','marker-end':'url(#'+markerId+')'});
  // Replace only decorative connectors, including any previous annotation copy.
  route.replaceChildren(defs,wash,outline,line);
  let frame=0,disposed=false;
  const draw=()=>{
   frame=0;if(disposed||!terrain.isConnected)return;
   const rect=terrain.getBoundingClientRect();if(rect.width<=0||rect.height<=0)return;
   const popover=terrain.querySelector('.course-popover');
   if(popover){const height=Math.ceil(popover.getBoundingClientRect().height);if(terrain.style.getPropertyValue('--popover-height')!==height+'px')terrain.style.setProperty('--popover-height',height+'px');}
   const points=bases.map(base=>{const box=base.getBoundingClientRect();return {x:box.left+box.width/2-rect.left,y:box.top+box.height/2-rect.top};});
   route.setAttribute('viewBox','0 0 '+rect.width+' '+rect.height);
   let d='';
   points.forEach((point,index)=>{if(!index){d='M'+point.x+' '+point.y;return;}const previous=points[index-1],dx=point.x-previous.x,dy=point.y-previous.y;if(Math.abs(dx)<30){d+=' C'+(previous.x+Math.min(55,rect.width*.1))+' '+(previous.y+dy*.35)+' '+(point.x+Math.min(55,rect.width*.1))+' '+(point.y-dy*.35)+' '+point.x+' '+point.y;}else{d+=' C'+(previous.x+dx*.43)+' '+(previous.y+18)+' '+(point.x-dx*.35)+' '+(point.y+18)+' '+point.x+' '+point.y;}});
   for(const path of [wash,outline,line])path.setAttribute('d',d);
   line.setAttribute('visibility',points.length>1?'visible':'hidden');
  };
  const schedule=()=>{if(!disposed&&!frame)frame=global.requestAnimationFrame(draw);};
  const observer=new ResizeObserver(schedule);observer.observe(terrain);bases.forEach(base=>observer.observe(base.closest('.course-stop')));const popover=terrain.querySelector('.course-popover');if(popover)observer.observe(popover);
  // Visibility changes trigger ResizeObserver; relocating the live panel into
  // fullscreen preserves the same nodes and is also measured on the next frame.
  global.addEventListener('resize',schedule,{passive:true});
  const dialog=doc.getElementById('atlasFullscreen');dialog?.addEventListener('close',schedule);
  doc.fonts?.ready?.then(schedule);
  const state={refresh:schedule,dispose(){disposed=true;observer.disconnect();global.removeEventListener('resize',schedule);dialog?.removeEventListener('close',schedule);if(frame)global.cancelAnimationFrame(frame);frame=0;}};
  mounted.set(root,state);schedule();
 }
 function refresh(root){mounted.get(root)?.refresh();}
 global.PlannerPresentation=Object.freeze({decorate,refresh,unmount});
})(typeof window!=='undefined'?window:globalThis);
