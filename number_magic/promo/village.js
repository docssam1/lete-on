/* Read-only advertising preview. Reuses the product's actual 3D village and
   characters; never loads app/main.js, authentication, progress or storage. */
const $ = selector => document.querySelector(selector);
const scene = $('#townScene');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const stops = {
  friends:{ title:'숫자 친구와 함께 걸어요.', copy:'길을 눌러 마을을 탐험해 보세요.', at:[1,-1,53] },
  learning:{ title:'오늘은 어떤 마법을 배울까요?', copy:'이야기로 만나고, 직접 풀며 이해해요.', at:[2,-9,35], view:'labs', action:'직접 체험하기' },
  paper:{ title:'이해한 수학을, 내 손으로.', copy:'교과 연산부터 창의 연산과 문장제까지.', at:[12,-7,36], view:'worksheet', action:'학습지 펼치기' },
  closet:{ title:'나와 함께할 숫자 친구.', copy:'숫자와 색, 모자를 골라 나만의 친구를 꾸며요.', at:[-19,-7,34] },
  journey:{ title:'작은 발견이 다음 배움으로.', copy:'수 감각에서 시작하는 하나의 학습 여정.', at:[-4,-15,44], view:'roadmap', action:'학습 여정 보기' }
};
let controller = null;
let active = true;
let cameraFrame = 0;
let selected = 'friends';
let mountPromise = null;

function tellParent(message){
  if(window.parent !== window) window.parent.postMessage(message, location.origin);
}

function setCamera(x,z,d){
  if(!controller) return;
  cancelAnimationFrame(cameraFrame);
  const {cam,placeCam,renderer,scene:world,camera} = controller.debug;
  const start = {x:cam.x,z:cam.z,d:cam.d};
  const startTime = performance.now();
  const duration = reducedMotion ? 0 : 1000;
  // Cancel the product's follow-player mode through its supported key input.
  // Both interactive drag and the visible view buttons then remain predictable.
  scene.querySelector('canvas')?.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight'}));
  function move(now){
    cameraFrame = 0;
    if(!active || !controller) return;
    const t = duration ? Math.min(1,(now-startTime)/duration) : 1;
    const eased = t*t*(3-2*t);
    cam.x = start.x+(x-start.x)*eased;
    cam.z = start.z+(z-start.z)*eased;
    cam.d = start.d+(d-start.d)*eased;
    placeCam();
    // In reduced-motion mode the core can be idle; render the final pose too.
    renderer.render(world,camera);
    if(t<1) cameraFrame=requestAnimationFrame(move);
  }
  cameraFrame=requestAnimationFrame(move);
}

function chooseStop(id, move=true){
  const stop=stops[id];
  if(!stop) return;
  selected=id;
  $('#tourTitle').textContent=stop.title;
  $('#tourCopy').textContent=stop.copy;
  document.querySelectorAll('[data-stop]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.stop===id)));
  const action=$('#tourAction');
  action.hidden=!stop.view;
  action.replaceChildren(document.createTextNode((stop.action||'')+' '));
  if(stop.view){ const arrow=document.createElement('span'); arrow.textContent='↗'; arrow.setAttribute('aria-hidden','true'); action.append(arrow); }
  if(move) setCamera(...stop.at);
}

function fallback(){
  controller?.dispose(); controller=null;
  $('#villageLoading').hidden=true;
  $('#villageFallback').hidden=false;
  document.documentElement.dataset.renderer='image';
  document.querySelectorAll('.view-controls button').forEach(button=>button.disabled=true);
  tellParent({type:'nm-promo-ready',module:'village',renderer:'image'});
}

async function mount(){
  if(controller || mountPromise) return mountPromise;
  mountPromise=(async()=>{
    try{
      const {mountTown3D}=await import('../app/town3d/town3d.js');
      const ctl=await mountTown3D(scene,{
        lang:'ko',
        spots:[
          {id:'numberland',open:true,label:'수의 나라'},
          {id:'beginner',open:true,label:'배움의 도서관'},
          {id:'intermediate',open:true,label:'생각이 자라는 집'},
          {id:'advanced',open:true,label:'도전의 탑'},
          {id:'_theater',open:true,label:'학습지와 연습'},
          {id:'_closet',open:true,label:'마법사 옷장'}
        ],
        characters:[
          {id:'player',role:'player',model:{kind:'girl'},name:'나',at:'plaza',lines:['길을 눌러 봐! 함께 걸어가자.']},
          {id:'buddy',role:'buddy',model:{kind:'buddy',buddy:{number:5,color:'blue'}},lines:['오늘은 어떤 수를 만날까?']},
          {id:'poco',role:'npc',model:{kind:'buddy',buddy:{number:3,color:'gold'}},at:'numberland',wander:true,lines:['안녕! 나는 3이야.']},
          {id:'momo',role:'npc',model:{kind:'buddy',buddy:{number:8,color:'pink'}},at:'harbor',wander:true,lines:['안녕! 나는 8이야.']},
          {id:'doc',role:'npc',model:{kind:'doc'},name:'독쌤',at:'academy',still:true,lines:['배움의 마을에 온 걸 환영해!']}
        ],
        onSpot:id=>chooseStop(({numberland:'friends',beginner:'learning',intermediate:'learning',advanced:'journey',_theater:'paper',_closet:'closet'})[id]),
        onReady(){
          $('#villageLoading').hidden=true;
          document.documentElement.dataset.renderer='webgl';
          tellParent({type:'nm-promo-ready',module:'village',renderer:'webgl'});
        }
      });
      if(!ctl){fallback();return;}
      controller=ctl;
      scene.hidden=!active;
      if(active) setCamera(...stops[selected].at);
    }catch(error){
      console.warn('[promo village] 3D unavailable; showing actual village photograph.',error);
      fallback();
    }finally{ mountPromise=null; }
  })();
  return mountPromise;
}

function setActive(value){
  active=Boolean(value);
  document.documentElement.dataset.active=String(active);
  // The reused renderer has its own IntersectionObserver; display:none stops
  // its RAF loop and wakes it on re-entry without touching student state.
  scene.hidden=!active;
  if(!active){cancelAnimationFrame(cameraFrame);cameraFrame=0;}
  else mount();
}

document.querySelectorAll('[data-stop]').forEach(button=>button.addEventListener('click',()=>chooseStop(button.dataset.stop)));
$('#tourAction').addEventListener('click',()=>{
  const view=stops[selected].view;
  if(!view) return;
  if(window.parent===window) location.href='./#'+view;
  else tellParent({type:'nm-promo-route',view});
});
$('#viewLeft').addEventListener('click',()=>{if(controller){const {cam}=controller.debug;setCamera(cam.x-9,cam.z,cam.d);}});
$('#viewRight').addEventListener('click',()=>{if(controller){const {cam}=controller.debug;setCamera(cam.x+9,cam.z,cam.d);}});
$('#viewReset').addEventListener('click',()=>chooseStop('friends'));
window.addEventListener('message',event=>{
  if(event.origin!==location.origin || event.source!==window.parent) return;
  if(event.data?.type==='nm-promo-active') setActive(event.data.active);
});
window.addEventListener('pagehide',()=>{
  cancelAnimationFrame(cameraFrame); controller?.dispose(); controller=null;
});
window.addEventListener('pageshow',event=>{if(event.persisted&&active)mount();});
mount();
