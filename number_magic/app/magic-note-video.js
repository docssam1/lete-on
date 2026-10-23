/* 마법 노트 영상 재생기 — data/magic-note-videos.js 의 state(t)를 그리기만 한다(그림이 수를 정하지 않는다).
   조작: 재생/멈춤 · 처음부터 · 자막 · 닫기. 멈춰도 t 가 그대로라 다시 틀면 같은 화면에서 이어진다.
   소리: 대사·수 이름은 NM_VOICE(누미 OmniVoice 녹음)로만 낸다. 녹음이 없는 줄은 자막만 보인다.
   움직임 줄이기 설정이면 장면별 정지 화면을 「다음」으로 넘긴다. 닫거나 화면이 바뀌면 타이머·소리를 모두 정리한다. */
(function(root){
'use strict';
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let current=null;
const CAP_KEY='nm_mnv_captions_v1';

function close(){if(current)current.close();}

function open(id,opts){
  close();
  const data=root.NM_MAGIC_NOTE_VIDEOS&&root.NM_MAGIC_NOTE_VIDEOS.get(id);
  if(!data)return null;
  opts=opts||{};
  const lang=opts.lang||'ko';
  const lk=(ko,en,zh)=>lang==='en'?en:lang==='zh'?zh:ko;
  const reduce=!!(root.matchMedia&&root.matchMedia('(prefers-reduced-motion: reduce)').matches);
  let captions=true;try{captions=localStorage.getItem(CAP_KEY)!=='off';}catch(e){}
  const opener=document.activeElement;

  const wrap=document.createElement('div');
  wrap.className='mnv';wrap.setAttribute('role','dialog');wrap.setAttribute('aria-modal','true');
  wrap.setAttribute('aria-label',(data.title[lang]||data.title.ko)+' · '+lk('영상','video','视频'));
  wrap.innerHTML=`<div class="mnv-box">
    <div class="mnv-stage" aria-hidden="true"><div class="mnv-bg"></div><div class="mnv-layer"></div></div>
    <p class="mnv-cap" aria-live="polite"></p>
    <div class="mnv-progress" aria-hidden="true"><i></i></div>
    <div class="mnv-bar">
      ${reduce?`<button type="button" class="mnv-btn" data-act="prev">${lk('이전','Back','上一步')}</button><button type="button" class="mnv-btn primary" data-act="next">${lk('다음','Next','下一步')}</button>`
        :`<button type="button" class="mnv-btn primary" data-act="play"></button>`}
      <button type="button" class="mnv-btn" data-act="restart">${lk('처음부터','Restart','从头看')}</button>
      <button type="button" class="mnv-btn" data-act="cc" aria-pressed="${captions}">${lk('자막','Captions','字幕')}</button>
      <button type="button" class="mnv-btn" data-act="close">${lk('닫기','Close','关闭')}</button>
    </div>
    <div class="mnv-end" hidden><button type="button" class="mnv-btn" data-act="again">${lk('다시 보기','Watch again','再看一次')}</button><button type="button" class="mnv-btn primary" data-act="try">${lk('직접 해 보기','Try it myself','自己试试')}</button></div>
  </div>`;
  document.body.appendChild(wrap);
  const stage=wrap.querySelector('.mnv-stage'),layer=wrap.querySelector('.mnv-layer'),bg=wrap.querySelector('.mnv-bg');
  const cap=wrap.querySelector('.mnv-cap'),bar=wrap.querySelector('.mnv-progress i'),end=wrap.querySelector('.mnv-end');
  const playBtn=wrap.querySelector('[data-act=play]');
  const nodes=new Map();
  const fit=()=>{const w=stage.clientWidth||1;stage.style.setProperty('--u',(w/100)+'px');};
  let ro=null;try{ro=new ResizeObserver(fit);ro.observe(stage);}catch(e){root.addEventListener('resize',fit);}
  fit();

  /* ---- 그리기 ---- */
  function node(key,cls,html){
    let n=nodes.get(key);
    if(!n){n=document.createElement('div');n.className=cls;if(html!=null)n.innerHTML=html;layer.appendChild(n);nodes.set(key,n);}
    n.dataset.live='1';return n;
  }
  function place(n,x,y,extra){n.style.left=x+'%';n.style.top=y+'%';n.style.transform='translate(-50%,-50%)'+(extra||'');}
  function draw(s){
    nodes.forEach(n=>{n.dataset.live='';});
    bg.dataset.bg=s.bg;bg.style.setProperty('--dusk',s.dusk||0);
    if(s.numi){const n=node('numi','mnv-numi',`<img alt="" src="assets/characters/${esc(s.numi.src)}.png">`);
      const img=n.firstChild,src=`assets/characters/${s.numi.src}.png`;if(!img.src.endsWith(src))img.src=src;
      n.style.width=s.numi.size+'%';place(n,s.numi.x,s.numi.y);}
    if(s.note){const n=node('note','mnv-note');
      const html=(s.note.title?`<b class="mnv-note-t">${esc(s.note.title)}</b><span class="mnv-note-s">${esc(s.note.sub||'')}</span>`:'')+
        s.note.lines.map(l=>`<span class="mnv-note-l" style="--p:${l.p.toFixed(3)}">✦ ${esc(l.text)}</span>`).join('');
      if(n._html!==html){n.innerHTML=html;n._html=html;}
      n.style.opacity=s.note.open;n.style.transform=`scaleY(${0.6+0.4*s.note.open})`;}
    if(s.sparkle!=null&&s.sparkle>0&&s.sparkle<1){const n=node('spark','mnv-spark','✦ ✦ ✦');n.style.opacity=Math.sin(s.sparkle*Math.PI);}
    if(s.pouch){const n=node('pouch','mnv-obj mnv-pouch','👝');place(n,84,68);}
    s.objects.forEach(o=>{
      if(!o.show)return;
      if(o.kind==='pebble'){const n=node(o.id,'mnv-pebble');place(n,o.x,o.y);n.style.opacity=o.fade;return;}
      const n=node(o.id,'mnv-obj','<span class="mnv-e"></span><span class="mnv-badge"></span>');
      n.firstChild.textContent=o.emo;
      const b=n.lastChild;b.textContent=o.badge||'';b.hidden=!o.badge;b.classList.toggle('bad',o.tone==='bad');b.style.opacity=o.fade==null?1:o.fade;
      n.classList.toggle('done',!!o.done);
      place(n,o.x,o.y,` translateY(${(-o.hop*0.35).toFixed(3)}em) translateX(${((o.shake||0)*0.12).toFixed(3)}em)${o.flip?' scaleX(-1)':''}`);
      b.style.transform=o.flip?'scaleX(-1)':'';
    });
    if(s.wand){const n=node('wand','mnv-wand','🪄');place(n,s.wand.x,s.wand.y);}
    if(s.lasso>0){const n=node('lasso','mnv-lasso');n.style.setProperty('--p',s.lasso);}
    if(s.big&&s.big.scale>0){const n=node('big','mnv-big');n.textContent=s.big.text;place(n,s.big.x,s.big.y,` scale(${s.big.scale.toFixed(3)})`);}
    nodes.forEach((n,k)=>{if(!n.dataset.live){n.remove();nodes.delete(k);}});
    cap.textContent=captions?s.caption:'';cap.hidden=!captions||!s.caption;
    bar.style.width=(100*s.t/data.duration).toFixed(2)+'%';
  }

  /* ---- 소리 ---- */
  const voice=root.NM_VOICE;
  function sayCue(c){if(voice&&c)voice.say(c.text[lang]||c.text.ko,lang);}
  function stopVoice(){if(voice)voice.stop();}

  /* ---- 재생 ---- */
  let t=0,playing=false,raf=0,last=0,stepIndex=-1,closed=false;
  function frame(now){
    if(!playing)return;
    const dt=Math.min(0.25,(now-last)/1000);last=now;
    const prev=t;t=Math.min(data.duration,t+dt);
    data.cues.forEach(c=>{if(c.t>prev&&c.t<=t)sayCue(c);});
    draw(data.state(t,lang));
    if(t>=data.duration){pause();end.hidden=false;end.querySelector('[data-act=try]').focus();return;}
    raf=requestAnimationFrame(frame);
  }
  function play(){
    if(playing||closed)return;
    if(t>=data.duration)t=0;
    end.hidden=true;playing=true;last=performance.now();
    // 대사 한가운데서 다시 틀면 그 대사를 처음부터 다시 들려준다.
    const line=data.cues.filter(c=>!('word' in c)&&c.t<=t).pop();
    if(t>0&&line&&t-line.t<3)sayCue(line);
    syncPlay();raf=requestAnimationFrame(frame);
  }
  function pause(){playing=false;cancelAnimationFrame(raf);stopVoice();syncPlay();}
  function syncPlay(){if(playBtn){playBtn.textContent=playing?lk('멈춤','Pause','暂停'):lk('재생','Play','播放');playBtn.setAttribute('aria-label',playBtn.textContent);}}
  function restart(){pause();t=0;stepIndex=-1;end.hidden=true;draw(data.state(0,lang));if(reduce)step(1);else play();}
  function step(d){
    stepIndex=Math.max(0,Math.min(data.steps.length-1,stepIndex+d));
    const st=data.steps[stepIndex];t=st.t;stopVoice();draw(data.state(t,lang));
    if(st.say){const c=data.cues.find(x=>x.key===st.say);sayCue(c);}
    wrap.querySelector('[data-act=prev]').disabled=stepIndex===0;
    const atEnd=stepIndex===data.steps.length-1;
    wrap.querySelector('[data-act=next]').disabled=atEnd;end.hidden=!atEnd;
  }

  const onVis=()=>{if(document.hidden&&playing)pause();};
  const onKey=e=>{
    if(e.key==='Escape'){e.preventDefault();api.close();}
    else if(e.key===' '&&!reduce&&e.target===wrap){e.preventDefault();playing?pause():play();}
    else if(e.key==='Tab'){const f=[...wrap.querySelectorAll('button:not([disabled])')].filter(b=>b.offsetParent!==null);
      if(!f.length)return;const i=f.indexOf(document.activeElement);
      if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus();}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus();}}
  };
  wrap.addEventListener('keydown',onKey);
  document.addEventListener('visibilitychange',onVis);
  wrap.addEventListener('click',e=>{
    const b=e.target.closest('[data-act]');if(!b)return;
    const act=b.dataset.act;
    if(act==='play')playing?pause():play();
    else if(act==='restart'||act==='again')restart();
    else if(act==='prev')step(-1);
    else if(act==='next')step(1);
    else if(act==='cc'){captions=!captions;b.setAttribute('aria-pressed',String(captions));try{localStorage.setItem(CAP_KEY,captions?'on':'off');}catch(_){}draw(data.state(t,lang));}
    else if(act==='close')api.close();
    else if(act==='try'){api.close();if(opts.onTry)opts.onTry();}
  });

  const api={
    id,
    close(){
      if(closed)return;closed=true;pause();
      document.removeEventListener('visibilitychange',onVis);
      if(ro)ro.disconnect();else root.removeEventListener('resize',fit);
      wrap.remove();if(current===api)current=null;
      if(opener&&opener.isConnected&&opener.focus)opener.focus();
    },
    /* 검사·디버그용: 지금 시각과 화면 상태 */
    get time(){return t;},get playing(){return playing;},
    seek(x){t=Math.max(0,Math.min(data.duration,x));draw(data.state(t,lang));}
  };
  current=api;
  draw(data.state(0,lang));
  if(reduce)step(1);else{play();}
  (playBtn||wrap.querySelector('[data-act=next]')).focus();
  return api;
}

function available(id,lang){const data=root.NM_MAGIC_NOTE_VIDEOS?.get(id),map=root.NM_TTS_OMNI?.[lang||'ko'];return !!data&&!!map&&data.cues.every(c=>!!map[c.text[lang||'ko']||c.text.ko]);}
root.NM_MAGIC_NOTE_PLAYER={open,close,available,get current(){return current;}};
})(window);
