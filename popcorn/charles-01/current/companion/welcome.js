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
  <p class="welcome-invitation">우리와 함께 자석 이야기를 만나러 가요.<span class="welcome-audio-status" role="status" aria-live="polite"></span></p>`;

  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const animations = new Set();
  let status = 'idle', disposed = false, continuationSent = false;
  let started = false, generation = 0;
  const sound=document.createElement('audio');
  sound.src=asset('welcome-brand.wav?v=20261015-welcome-audio-1');
  sound.preload='auto';sound.hidden=true;sound.loop=false;host.append(sound);
  let soundState='idle',soundEverPlayed=false,soundAttempt=0,pausedForVisibility=false,awaitingGesture=false;
  let audioStartedAt=null,motionStartedAt=null,lastAudioError=null;
  const visible = () => host.isConnected && !document.hidden && !host.closest('[hidden]');
  let lastVisible=visible();
  const state = () => ({status, started, reducedMotion:media.matches,
    playedThisVisit, activeAnimations:[...animations].filter(a=>a.playState==='running').length,
    characterCount:host.querySelectorAll('.welcome-friend').length,
    kernelCount:host.querySelectorAll('.welcome-kernel').length, continuationSent, disposed,
    audio:{state:soundState,everPlayed:soundEverPlayed,awaitingGesture,currentTime:sound.currentTime,duration:Number.isFinite(sound.duration)?sound.duration:null,paused:sound.paused,muted:sound.muted,volume:sound.volume,source:sound.currentSrc||sound.src,error:lastAudioError,audioStartedAt,motionStartedAt}});
  function updateSound(){
    host.dataset.welcomeAudio=soundState;
    host.querySelector('.welcome-audio-status').textContent=soundState==='playing'?'팝콘실험실의 입장 소리를 재생하고 있어요.':'';
  }
  function settleVisual() {
    if(disposed)return;
    generation++;
    for(const animation of animations) animation.cancel();
    animations.clear(); status='finished'; host.dataset.welcomeState=status;
  }
  function stopSound(next='idle',reset=true){
    soundAttempt++;soundState=next;pausedForVisibility=false;awaitingGesture=false;
    sound.pause();if(reset){try{sound.currentTime=0;}catch{}}
    updateSound();
  }
  function finish(){if(disposed)return;stopSound(soundEverPlayed?'ended':soundState==='error'?'error':'idle');settleVisual();}
  function animate(node, keyframes, options) {
    if(!node?.animate)return;
    const animation=node.animate(keyframes,{duration:700,easing:'cubic-bezier(.2,.7,.25,1)',fill:'both',...options});
    animations.add(animation);return animation;
  }
  function runMotion(offset=0) {
    if(disposed||!visible())return false;
    settleVisual();started=true;
    if(media.matches||!host.animate)return true;
    status='playing';host.dataset.welcomeState=status;
    motionStartedAt=performance.now()-offset;
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
    for(const animation of animations)if(offset>0)animation.currentTime=offset;
    Promise.all([...animations].map(animation=>animation.finished.catch(()=>null))).then(()=>{
      if(!disposed&&generation===token)settleVisual();
    });
    return true;
  }
  function playSound({resume=false}={}){
    if(disposed||!visible())return false;
    const token=++soundAttempt;
    if(soundState==='error')sound.load();
    soundState='loading';lastAudioError=null;updateSound();
    if(!resume){try{sound.currentTime=0;}catch{}}
    const success=()=>{
      if(disposed||token!==soundAttempt||!visible()){if(!visible())sound.pause();return;}
      soundState='playing';soundEverPlayed=true;awaitingGesture=false;audioStartedAt=performance.now()-sound.currentTime*1000;
      if(resume&&status==='paused'){
        for(const animation of animations)if(animation.playState==='paused')animation.play();
        status='playing';host.dataset.welcomeState=status;
      }else if(!resume)runMotion(sound.currentTime*1000);
      updateSound();
    };
    const failure=error=>{
      if(disposed||token!==soundAttempt)return;
      lastAudioError=error?.name||'MediaError';soundState=error?.name==='NotAllowedError'?'blocked':'error';
      awaitingGesture=visible()&&!continuationSent;
      updateSound();if(!resume&&visible())runMotion();
    };
    try{const result=sound.play();if(result?.then)result.then(success,failure);else success();}catch(error){failure(error);}
    return true;
  }
  function start(){
    if(disposed||started||!visible())return false;
    started=true;
    if(playedThisVisit){settleVisual();return true;}
    playedThisVisit=true;return playSound();
  }
  function replay(){if(disposed||!visible())return false;started=true;playedThisVisit=true;return playSound();}
  // Keep the introduction automatic. A blocked browser can use the first real
  // interaction on this screen; navigation keeps its own action and never waits.
  function unlockSound(event){
    if(!event.isTrusted||!awaitingGesture||disposed||!visible()||continuationSent)return;
    if(event.type==='keydown'&&(event.repeat||!['Enter',' '].includes(event.key)))return;
    if(event.target instanceof Element&&event.target.closest('a,button,input,select,textarea,summary,[contenteditable]'))return;
    awaitingGesture=false;playSound();
  }
  const soundEnded=()=>{if(!disposed){soundState='ended';updateSound();}};
  const soundError=()=>{if(!disposed){soundAttempt++;soundState='error';awaitingGesture=visible()&&!continuationSent;lastAudioError='MediaError-'+(sound.error?.code||0);updateSound();if(!started||status==='idle')runMotion();}};
  sound.addEventListener('ended',soundEnded);sound.addEventListener('error',soundError);
  function syncVisibility(){
    if(disposed)return;
    const nowVisible=visible();
    if(nowVisible&&!lastVisible)continuationSent=false;
    lastVisible=nowVisible;
    if(host.closest('[hidden]')){
      finish();
    }else if(!nowVisible) {
      pausedForVisibility=soundState==='playing';
      if(soundState==='playing'||soundState==='loading'){soundAttempt++;soundState='paused';sound.pause();updateSound();}
      for(const animation of animations)if(animation.playState==='running')animation.pause();
      if(status==='playing')status='paused';
    } else if(pausedForVisibility){
      pausedForVisibility=false;playSound({resume:true});
    } else if(status==='paused') {
      for(const animation of animations)if(animation.playState==='paused')animation.play();
      status='playing';
    } else if(!started)start();
    host.dataset.welcomeState=status;
  }
  const route=()=>queueMicrotask(syncVisibility);
  const preference=()=>{if(media.matches)settleVisual();};
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
    document.removeEventListener('click',unlockSound);document.removeEventListener('touchend',unlockSound);document.removeEventListener('keydown',unlockSound);
    sound.removeEventListener('ended',soundEnded);sound.removeEventListener('error',soundError);
    sound.removeAttribute('src');sound.load();sound.remove();
    mounted.delete(host);
  }
  document.addEventListener('click',unlockSound,{passive:true});document.addEventListener('touchend',unlockSound,{passive:true});document.addEventListener('keydown',unlockSound);
  document.addEventListener('visibilitychange',syncVisibility);
  window.addEventListener('popcornlab:route',route);
  window.addEventListener('hashchange',route);
  media.addEventListener('change',preference);
  const api={start,replay,finish,continue:continueToStory,getState:state,getAudio:()=>sound,dispose};mounted.set(host,api);
  updateSound();start();
  return api;
}
