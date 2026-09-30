/* Read-only advertising preview. Reuses the product's actual 3D village and
   characters; never loads app/main.js, authentication, progress or storage. */
const $ = selector => document.querySelector(selector);
const I=window.NMPromoI18n,tr=(ko,en,zh)=>I?I.text(ko,en,zh):ko;
const words=(ko,en,zh)=>({ko,en,zh}),localized=value=>I?I.pick(value):value.ko;
const scene = $('#townScene');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const stops = {
  friends:{ title:words('숫자 친구와 함께 걸어요.','Walk with your number friends.','和数字朋友一起散步。'), copy:words('길을 눌러 마을을 탐험해 보세요.','Tap a path and explore the village.','点一下小路，探索村庄。'), at:[1,-1,53] },
  learning:{ title:words('오늘은 어떤 마법을 배울까요?','What magic will you discover today?','今天会发现什么魔法？'), copy:words('이야기로 만나고, 직접 풀며 이해해요.','Meet an idea in a story, then solve it yourself.','在故事中相遇，动手解题来理解。'), at:[2,-9,35], view:'labs', action:words('직접 체험하기','Try the labs','动手体验') },
  paper:{ title:words('이해한 수학을, 내 손으로.','Put your understanding on paper.','把理解的数学亲手写出来。'), copy:words('교과 연산부터 창의 연산과 문장제까지.','Curriculum practice, creative calculation and word problems.','从课内运算到创意运算和应用题。'), at:[12,-7,36], view:'worksheet', action:words('학습지 펼치기','Open worksheets','展开学习单') },
  closet:{ title:words('나와 함께할 숫자 친구.','Your own number friend.','专属于你的数字朋友。'), copy:words('숫자와 색, 모자를 골라 나만의 친구를 꾸며요.','Choose a number, colour and hat to make a friend your own.','选择数字、颜色和帽子，装扮自己的朋友。'), at:[-19,-7,34] },
  journey:{ title:words('작은 발견이 다음 배움으로.','Each discovery leads to the next.','小小发现，通往下一步学习。'), copy:words('수 감각에서 시작하는 하나의 학습 여정.','One learning journey, beginning with number sense.','从数感出发的一段学习旅程。'), at:[-4,-15,44], view:'roadmap', action:words('학습 여정 보기','See the journey','查看学习旅程') }
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
  $('#tourTitle').textContent=localized(stop.title);
  $('#tourCopy').textContent=localized(stop.copy);
  document.querySelectorAll('[data-stop]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.stop===id)));
  const action=$('#tourAction');
  action.hidden=!stop.view;
  action.replaceChildren(document.createTextNode((stop.action?localized(stop.action):'')+' '));
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
        lang:I?.getLanguage()||'ko',
        spots:[
          {id:'numberland',open:true,label:words('수의 나라','Number Land','数字王国')},
          {id:'beginner',open:true,label:words('배움의 도서관','Learning Library','学习图书馆')},
          {id:'intermediate',open:true,label:words('생각이 자라는 집','House of Ideas','思考成长屋')},
          {id:'advanced',open:true,label:words('도전의 탑','Challenge Tower','挑战之塔')},
          {id:'_theater',open:true,label:words('학습지와 연습','Worksheets and Practice','学习单与练习')},
          {id:'_closet',open:true,label:words('마법사 옷장',"Wizard’s Wardrobe",'魔法师衣橱')}
        ],
        characters:[
          {id:'player',role:'player',model:{kind:'girl'},name:words('나','Me','我'),at:'plaza',lines:[words('길을 눌러 봐! 함께 걸어가자.','Tap a path! Let’s walk together.','点一下小路，我们一起走吧！')]},
          {id:'buddy',role:'buddy',model:{kind:'buddy',buddy:{number:5,color:'blue'}},lines:[words('오늘은 어떤 수를 만날까?','What number will we meet today?','今天会遇到哪个数字呢？')]},
          {id:'poco',role:'npc',model:{kind:'buddy',buddy:{number:3,color:'gold'}},at:'numberland',wander:true,lines:[words('안녕! 나는 3이야.','Hi! I’m 3.','你好！我是3。')]},
          {id:'momo',role:'npc',model:{kind:'buddy',buddy:{number:8,color:'pink'}},at:'harbor',wander:true,lines:[words('안녕! 나는 8이야.','Hi! I’m 8.','你好！我是8。')]},
          {id:'doc',role:'npc',model:{kind:'doc'},name:words('독쌤','Doc-T','独先生'),at:'academy',still:true,lines:[words('배움의 마을에 온 걸 환영해!','Welcome to our learning village!','欢迎来到学习村庄！')]}
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
      controller.setLang(I?.getLanguage()||'ko');
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
  if(window.parent===window) location.href='./?lang='+(I?.getLanguage()||'ko')+'#'+view;
  else tellParent({type:'nm-promo-route',view});
});
$('#viewLeft').addEventListener('click',()=>{if(controller){const {cam}=controller.debug;setCamera(cam.x-9,cam.z,cam.d);}});
$('#viewRight').addEventListener('click',()=>{if(controller){const {cam}=controller.debug;setCamera(cam.x+9,cam.z,cam.d);}});
$('#viewReset').addEventListener('click',()=>chooseStop('friends'));
window.addEventListener('message',event=>{
  if(event.origin!==location.origin || event.source!==window.parent) return;
  if(event.data?.type==='nm-promo-active') setActive(event.data.active);
  if(event.data?.type==='nm-promo-language'&&['ko','en','zh'].includes(event.data.lang)&&event.data.lang!==I?.getLanguage())I?.setLanguage(event.data.lang,{persist:false});
});
window.addEventListener('pagehide',()=>{
  cancelAnimationFrame(cameraFrame); controller?.dispose(); controller=null;
});
window.addEventListener('pageshow',event=>{if(event.persisted&&active)mount();});
function translateVillage(){
 document.title=tr('수의 마법 · 마을 둘러보기','Numbers of Magic · Village','数字魔法 · 探索村庄');
 const bindings=[['.village','aria-label',tr('수의 마법 마을 소개','Numbers of Magic village tour','数字魔法村庄介绍')],['#townScene','aria-label',tr('실제 수의 마법 3D 마을','The real Numbers of Magic 3D village','真实的数字魔法3D村庄')],['#villageLoading',null,tr('✦ 마을에 도착하는 중','✦ Arriving in the village','✦ 正在抵达村庄')],['#villageFallback img','alt',tr('실제 수의 마법 3D 마을의 도서관, 숫자 친구, 학습 공간','The real 3D village: library, number friends and learning spaces','真实3D村庄中的图书馆、数字朋友与学习空间')],['#villageFallback p',null,tr('이 기기에서는 마을 사진으로 둘러봅니다.','This device shows a photograph of the village.','此设备通过村庄照片进行浏览。')],['.heading h1',null,tr('배움이 모이는 마을','A village of discoveries','汇聚学习的村庄')],['.view-controls','aria-label',tr('마을 시점 조절','Village camera controls','村庄视角控制')],['#viewLeft','aria-label',tr('마을 왼쪽 보기','Look left','向左看')],['#viewRight','aria-label',tr('마을 오른쪽 보기','Look right','向右看')],['#viewReset','aria-label',tr('마을 전체 보기','See the whole village','查看整个村庄')],['#viewReset',null,tr('전체','All','全景')],['.tour','aria-label',tr('마을에서 하는 일','Things to discover','村庄里的活动')],['.tour-tabs','aria-label',tr('마을 소개 장면','Village tour stops','村庄介绍场景')],['[data-stop="friends"]',null,tr('숫자 친구','Friends','数字朋友')],['[data-stop="learning"]',null,tr('오늘의 배움','Learning','今日学习')],['[data-stop="paper"]',null,tr('종이 학습지','Worksheets','纸质学习单')]];
 bindings.forEach(([selector,attribute,value])=>{const node=$(selector);if(attribute)node.setAttribute(attribute,value);else node.textContent=value;});
 chooseStop(selected,false);controller?.setLang(I?.getLanguage()||'ko');
}
window.addEventListener('nm-promo-languagechange',translateVillage);translateVillage();
mount();
