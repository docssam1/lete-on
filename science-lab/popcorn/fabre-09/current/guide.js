// One fixed popcorn guide. Mouth and body follow real audio playback, never a silent timer.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let soundOff = false;
export function createGuide(host) {
  host.innerHTML = `<div class="sprite-window" role="img" aria-label="흰 실험복을 입은 코미"><span class="sprite"></span></div><div><b class="guide-name">코미</b><p class="guide-caption"></p><button type="button" data-guide="play">설명 다시 듣기</button><button type="button" data-guide="mute" aria-pressed="false">소리 끄기</button><span class="voice-state" aria-live="polite"></span></div>`;
  const audio = new Audio(); audio.preload = 'auto';
  const caption = host.querySelector('.guide-caption'), status = host.querySelector('.voice-state'), play = host.querySelector('[data-guide=play]'), mute = host.querySelector('[data-guide=mute]');
  let map = {}, line = '', text = '', muted = soundOff, timer, praiseTimer, disposed = false, version = 0, done, idlePose='idle';
  mute.setAttribute('aria-pressed',String(muted));mute.textContent=muted?'소리 켜기':'소리 끄기';
  const ready = fetch('assets/audio/voices.json').then(r => {if(!r.ok) throw Error('voice manifest');return r.json();}).then(m => {map=m.lines;}).catch(()=>{});
  function motionEnd() { clearInterval(timer); timer = null; host.classList.remove('speaking'); host.dataset.pose = idlePose; }
  function flap() {
    idlePose='idle'; motionEnd(); if (audio.paused || audio.ended || muted || document.hidden) return;
    host.classList.add('speaking'); status.textContent = '말하는 중'; play.textContent = '잠깐 멈추기';
    const tick = () => {
      if (audio.paused || audio.ended || document.hidden) {motionEnd();return;}
      // Closed-mouth pauses between syllables, driven by the current media clock.
      host.dataset.pose = reduced.matches || Math.floor(audio.currentTime * 8) % 4 ? 'talk' : 'idle';
    };
    tick(); timer = setInterval(tick, 80);
  }
  audio.addEventListener('playing', flap);
  audio.addEventListener('waiting', () => {motionEnd();status.textContent='소리 불러오는 중';});
  audio.addEventListener('pause', () => {motionEnd();play.textContent='이어서 듣기';});
  audio.addEventListener('ended', () => {motionEnd();play.textContent='설명 다시 듣기';status.textContent='이제 직접 해 보세요';done?.();});
  audio.addEventListener('error', () => {motionEnd();status.textContent='소리를 불러오지 못했어요. 글 안내를 읽어 주세요.';});
  async function speak() {
    const request = ++version; await ready;
    if (disposed || request !== version || muted || document.hidden) return;
    const entry=map[line]; if(!entry){status.textContent='글 안내를 읽어 주세요';return;}
    const src = new URL('assets/audio/'+entry.file,location.href).href;
    if(audio.src!==src){audio.pause();audio.src=src;}else if(audio.ended) audio.currentTime=0;
    try{await audio.play();}catch{motionEnd();status.textContent='설명 듣기를 눌러 주세요';}
  }
  function set(id, words, auto = true, onEnd) {
    idlePose='idle'; ++version; audio.pause(); motionEnd(); clearTimeout(praiseTimer); done=onEnd;
    line=id;text=words;caption.textContent=text;status.textContent=muted?'소리 꺼짐':'직접 해 볼 준비';play.textContent='설명 듣기';
    audio.removeAttribute('src');audio.load();if(auto&&!muted)void speak();
  }
  play.addEventListener('click',()=>{if(!audio.paused){++version;audio.pause();motionEnd();status.textContent='잠깐 쉬는 중';}else void speak();});
  mute.addEventListener('click',()=>{muted=!muted;soundOff=muted;mute.setAttribute('aria-pressed',String(muted));mute.textContent=muted?'소리 켜기':'소리 끄기';if(muted){++version;audio.pause();motionEnd();status.textContent='소리 꺼짐';}else void speak();});
  const hide=()=>{if(document.hidden){++version;audio.pause();motionEnd();}};
  document.addEventListener('visibilitychange',hide);
  return {set, audio, pause:()=>{++version;audio.pause();motionEnd();}, wait:()=>{idlePose='idle';motionEnd();status.textContent='초안을 읽고 고쳐 주세요';}, listen:()=>{idlePose='listen';++version;clearTimeout(praiseTimer);audio.pause();motionEnd();host.dataset.pose='listen';status.textContent='네 생각을 듣고 있어요';}, praise:()=>{if(!audio.paused) return;clearTimeout(praiseTimer);idlePose='praise';host.dataset.pose='praise';status.textContent='잘했어요! 다음 단계로 가 볼까요?';praiseTimer=setTimeout(()=>{idlePose='idle';host.dataset.pose='idle';},1600);}, dispose:()=>{disposed=true;++version;audio.pause();audio.removeAttribute('src');audio.load();motionEnd();clearTimeout(praiseTimer);document.removeEventListener('visibilitychange',hide);}};
}
