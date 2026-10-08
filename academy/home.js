'use strict';
const programs={
  numbers:{title:'수는, 펼치면 쉬워진다.',copy:'7에서 2를 옮겨 10을 만들어요. 남은 5를 더하면?',detail:'넘버스 매직 · 수의 마법',image:'assets/numbers.png',alt:'기존 8+7 마법 노트의 실제 입체 블록 장면',url:'https://lete-on.gfieldacademy.net/number_magic/promo/',trial:'trial.html',trialTitle:'8+7, 직접 펼쳐 보기',notice:'기존 마법 노트의 비채점 체험입니다. 체험은 학습 진도와 점수에 반영되지 않습니다.'},
  geometry:{title:'보이지 않는 곳까지 생각해요.',copy:'같은 모양을 쌓고, 보는 방향을 바꿔 확인해요.',detail:'지오메트리 · 공간과 도형',image:'assets/geometry.png',alt:'실제 지오메트리 똑같이 쌓기 게임의 입체 큐브 장면',url:'https://lete-on.gfieldacademy.net/geometry/world-map/',trial:'https://lete-on.gfieldacademy.net/geometry/games/copy-build/',trialTitle:'같은 모양으로 쌓아 보기',notice:'기존 지오메트리 체험이 열립니다. 가로 화면에서 더 넓게 조작할 수 있습니다.'},
  science:{title:'“왜 그럴까?”를 직접 확인해요.',copy:'고리 자석을 뒤집으면, 탑의 높이는 어떻게 달라질까요?',detail:'지필드 사이언스 · 독쌤 과학 탐구',image:'assets/science.png',alt:'지필드 사이언스의 실제 3D 고리 자석 탑 실험 장면',url:'https://lete-on.gfieldacademy.net/science-lab/v2/',trial:'https://lete-on.gfieldacademy.net/science-lab/v2/#/s41-u01/2/lab',trialTitle:'고리 자석 탑, 직접 실험하기',notice:'지필드 사이언스의 기존 실험실입니다. 가상 모형이며 실제 교구 실험을 대신하지 않습니다. 표에 적기를 누르면 해당 기기에 실험 기록이 저장됩니다.'}
};
const tabs=[...document.querySelectorAll('[role=tab]')], dialog=document.querySelector('#trial-dialog');
let selected='numbers',opener=null,loadTimer=null,loadGeneration=0;
const scene=document.querySelector('.scene'),video=document.querySelector('#scene-video'),motionButton=document.querySelector('#motion-control'),motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused=motionPreference.matches,inView=true;
function syncMotion(){
  motionButton.textContent=motionPaused?'움직임 재생':'움직임 멈추기';
  if(motionPaused||!inView||document.hidden||dialog.open)video.pause();
  else video.play().catch(e=>{if(e.name==='AbortError')return;motionPaused=true;motionButton.textContent='움직임 재생';});
}
function selectMotion(key){video.pause();scene.classList.remove('has-motion');motionButton.hidden=true;video.src='assets/'+key+'.mp4';video.load();syncMotion();}
video.addEventListener('loadeddata',()=>{scene.classList.add('has-motion');motionButton.hidden=false;syncMotion();});
video.addEventListener('error',()=>{scene.classList.remove('has-motion');motionButton.hidden=true;});
motionButton.addEventListener('click',()=>{motionPaused=!motionPaused;syncMotion();});
motionPreference.addEventListener('change',()=>{motionPaused=motionPreference.matches;syncMotion();});
document.addEventListener('visibilitychange',syncMotion);
new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;syncMotion();},{threshold:.1}).observe(scene);
function selectProgram(key){
  const p=programs[key];if(!p)return;selected=key;
  for(const tab of tabs){const active=tab.dataset.program===key;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;}
  document.querySelector('#program-panel').setAttribute('aria-labelledby','tab-'+key);
  document.querySelector('#program-title').textContent=p.title;document.querySelector('#program-copy').textContent=p.copy;document.querySelector('#program-detail').textContent=p.detail;
  const image=document.querySelector('#scene-image');image.src=p.image;image.alt=p.alt;
  document.querySelector('#program-link').href=p.url;
  selectMotion(key);
}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectProgram(tab.dataset.program));tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%tabs.length;else if(e.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;e.preventDefault();selectProgram(tabs[next].dataset.program);tabs[next].focus();});});
function loadTrial(){
  const p=programs[selected],status=document.querySelector('#trial-status'),retry=document.querySelector('#retry-trial');
  clearTimeout(loadTimer);const generation=++loadGeneration;
  status.hidden=false;status.textContent='체험을 준비하고 있습니다.';retry.hidden=true;
  const frame=document.createElement('iframe');frame.title=p.trialTitle;frame.allow='fullscreen';frame.referrerPolicy='strict-origin-when-cross-origin';
  document.querySelector('#trial-frame-host').replaceChildren(frame);
  frame.addEventListener('load',()=>{if(generation!==loadGeneration)return;clearTimeout(loadTimer);status.hidden=true;});
  frame.addEventListener('error',()=>{if(generation!==loadGeneration)return;status.hidden=false;status.textContent='체험을 불러오지 못했습니다. 다시 불러오거나 새 창에서 열어 주세요.';retry.hidden=false;});
  frame.src=p.trial;
  loadTimer=setTimeout(()=>{if(generation!==loadGeneration)return;status.hidden=false;status.textContent='체험이 보이지 않으면 새 창에서 열어 주세요.';retry.hidden=false;},16000);
}
document.querySelector('#open-trial').addEventListener('click',()=>{opener=document.activeElement;const p=programs[selected];document.querySelector('#trial-title').textContent=p.trialTitle;document.querySelector('#trial-notice').textContent=p.notice;document.querySelector('#external-trial').href=p.trial;dialog.showModal();video.pause();loadTrial();});
function unloadTrial(){clearTimeout(loadTimer);loadGeneration++;document.querySelector('#trial-frame-host').replaceChildren();}
function closeTrial(){unloadTrial();dialog.close();opener?.focus();}
document.querySelector('#close-trial').addEventListener('click',closeTrial);
document.querySelector('#retry-trial').addEventListener('click',loadTrial);
dialog.addEventListener('cancel',e=>{e.preventDefault();closeTrial();});
dialog.addEventListener('close',()=>{if(dialog.open)return;unloadTrial();opener?.focus();syncMotion();});
dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeTrial();});
selectMotion(selected);
