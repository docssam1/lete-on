// The approved characters welcome the learner once per page visit.
// Navigation belongs to the existing five-menu shell and its always-available Next.
const mounted = new WeakMap();
let playedThisVisit = false;
const asset = name => new URL(`../assets/${name}`, import.meta.url).href;

export function mountWelcome(host, {onContinue = () => {}} = {}) {
  if (!host) throw new Error('환영 장면을 표시할 영역이 필요해요.');
  if (mounted.has(host)) return mounted.get(host);
  if (!document.querySelector('link[data-popcorn-welcome]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet'; link.href = new URL('./welcome.css', import.meta.url).href;
    link.dataset.popcornWelcome = 'true'; document.head.append(link);
  }
  const kernels = [
    [12,22,-20,1],[25,9,12,2],[41,5,-14,3],[66,8,22,4],
    [85,24,-15,2],[91,61,27,1],[10,72,-28,4],[73,83,16,3]
  ];
  host.classList.add('popcorn-welcome');
  host.innerHTML = `<div class="welcome-heading">
    <p class="welcome-pop-sounds" aria-hidden="true"><span>팝!</span><span>팍!</span></p>
    <h1 class="welcome-title" id="welcome-title" aria-label="팝콘실험실"><span aria-hidden="true">${[...'팝콘실험실'].map((letter,i)=>`<span class="welcome-syllable" data-syllable="${i}">${letter}</span>`).join('')}</span></h1>
    <p class="welcome-subtitle">샤를 1호 · 먹이를 먹는 자석 악어</p>
  </div>
  <div class="welcome-company" aria-label="랩코니와 조수 스타리, 버터비가 함께 맞이해요.">
    <div class="welcome-table" aria-hidden="true"></div>
    <div class="welcome-kernels" aria-hidden="true">${kernels.map(([x,y,rotation,variant],i)=>`<span class="welcome-kernel" style="--kernel-x:${x}%;--kernel-y:${y}%;--kernel-rotation:${rotation}deg" data-kernel="${i}"><img src="${asset(`welcome-popcorn-${String(variant).padStart(2,'0')}.png`)}" alt="" width="90" height="90" draggable="false"></span>`).join('')}</div>
    <figure class="welcome-friend welcome-starry"><div class="welcome-character-motion"><img src="${asset('starry.png')}" alt="별 모양 조수 스타리" width="1368" height="1156" draggable="false"></div><figcaption>스타리</figcaption></figure>
    <figure class="welcome-friend welcome-labconi"><div class="welcome-character-motion"><img src="${asset('labconi-charles.png')}" alt="샤를 의상을 입고 맞이하는 랩코니" width="1220" height="1280" draggable="false"></div><figcaption>랩코니</figcaption></figure>
    <figure class="welcome-friend welcome-butterbee"><div class="welcome-character-motion"><img src="${asset('butterbee.png')}" alt="손을 들어 인사하는 조수 버터비" width="1280" height="1280" draggable="false"></div><figcaption>버터비</figcaption></figure>
  </div>
  <p class="welcome-invitation">우리와 함께 자석 이야기를 만나러 가요.</p>`;

  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const animations = new Set();
  let status = 'idle', disposed = false, continuationSent = false;
  let started = false, generation = 0;
  const visible = () => host.isConnected && !document.hidden && !host.closest('[hidden]');
  let lastVisible=visible();
  const state = () => ({status, started, reducedMotion:media.matches,
    playedThisVisit, activeAnimations:[...animations].filter(a=>a.playState==='running').length,
    characterCount:host.querySelectorAll('.welcome-friend').length,
    kernelCount:host.querySelectorAll('.welcome-kernel').length, continuationSent, disposed});
  function finish() {
    if(disposed)return;
    generation++;
    for(const animation of animations) animation.cancel();
    animations.clear(); status='finished'; host.dataset.welcomeState=status;
  }
  function animate(node, keyframes, options) {
    if(!node?.animate)return;
    const animation=node.animate(keyframes,{duration:700,easing:'cubic-bezier(.2,.7,.25,1)',fill:'both',...options});
    animations.add(animation);return animation;
  }
  function start() {
    if(disposed||started||status==='finished'||!visible())return false;
    started=true;
    if(playedThisVisit||media.matches||!host.animate){playedThisVisit=true;finish();return true;}
    playedThisVisit=true;status='playing';host.dataset.welcomeState=status;
    const token=++generation;
    host.querySelectorAll('.welcome-syllable').forEach((node,i)=>animate(node,[
      {opacity:0,transform:'translateY(25px) scale(.54) rotate(-7deg)',offset:0},
      {opacity:1,transform:'translateY(-5px) scale(1.06) rotate(2deg)',offset:.7},
      {opacity:1,transform:'none',offset:1}
    ],{duration:470,delay:100+i*105}));
    host.querySelectorAll('.welcome-pop-sounds span').forEach((node,i)=>animate(node,[
      {opacity:0,transform:'scale(.45)'},{opacity:1,transform:'scale(1.08)',offset:.65},{opacity:1,transform:'none'}
    ],{duration:400,delay:80+i*170}));
    host.querySelectorAll('.welcome-kernel').forEach((node,i)=>{
      const [x,y]=kernels[i];
      const rect=host.querySelector('.welcome-company').getBoundingClientRect();
      const dx=(50-x)*rect.width/100,dy=(84-y)*rect.height/100;
      animate(node,[
        {opacity:0,transform:`translate(${dx}px,${dy}px) scale(.3) rotate(-40deg)`,offset:0},
        {opacity:1,transform:`translate(${dx*.22}px,${-32-i%3*8}px) scale(1.08) rotate(12deg)`,offset:.6},
        {opacity:1,transform:'none',offset:1}
      ],{duration:970,delay:i*55});
    });
    animate(host.querySelector('.welcome-labconi .welcome-character-motion'),[
      {opacity:0,transform:'translateY(38px) scale(.88)'},
      {opacity:1,transform:'translateY(-3px) scale(1.015)',offset:.75},
      {opacity:1,transform:'none'}
    ],{duration:780,delay:210});
    for(const [name,direction,delay] of [['starry',-1,330],['butterbee',1,450]])
      animate(host.querySelector(`.welcome-${name} .welcome-character-motion`),[
        {opacity:0,transform:`translate(${direction*100}px,30px) rotate(${direction*17}deg) scale(.72)`},
        {opacity:1,transform:`translate(${-direction*5}px,-7px) rotate(${-direction*3}deg) scale(1.025)`,offset:.75},
        {opacity:1,transform:'none'}
      ],{duration:900,delay});
    Promise.all([...animations].map(animation=>animation.finished.catch(()=>null))).then(()=>{
      if(!disposed&&generation===token)finish();
    });
    return true;
  }
  function syncVisibility(){
    if(disposed)return;
    const nowVisible=visible();
    if(nowVisible&&!lastVisible)continuationSent=false;
    lastVisible=nowVisible;
    if(!nowVisible) {
      for(const animation of animations)if(animation.playState==='running')animation.pause();
      if(status==='playing')status='paused';
    } else if(status==='paused') {
      for(const animation of animations)if(animation.playState==='paused')animation.play();
      status='playing';
    } else if(!started)start();
    host.dataset.welcomeState=status;
  }
  const route=()=>queueMicrotask(syncVisibility);
  const preference=()=>{if(media.matches){playedThisVisit=true;finish();}};
  function continueToStory(){
    if(disposed||continuationSent)return;
    continuationSent=true;finish();onContinue();
  }
  function dispose(){
    if(disposed)return;
    finish();disposed=true;status='disposed';
    document.removeEventListener('visibilitychange',syncVisibility);
    window.removeEventListener('popcornlab:route',route);
    window.removeEventListener('hashchange',route);
    media.removeEventListener('change',preference);
    mounted.delete(host);
  }
  document.addEventListener('visibilitychange',syncVisibility);
  window.addEventListener('popcornlab:route',route);
  window.addEventListener('hashchange',route);
  media.addEventListener('change',preference);
  const api={start,finish,continue:continueToStory,getState:state,dispose};mounted.set(host,api);
  if(media.matches){playedThisVisit=true;finish();}else start();
  return api;
}
