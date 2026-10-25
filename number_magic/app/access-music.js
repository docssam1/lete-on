/* Login-book ambience. Reuses the approved desk/promo track and its mute choice. */
(function(){
  'use strict';
  var audio=document.getElementById('access-ambience');
  var buttons=Array.from(document.querySelectorAll('[data-access-music]'));
  if(!audio||!buttons.length)return;
  var key='nm_desk_music_v1',wanted=true,needsGesture=true,hasGesture=false;
  var suspended=false,pending=false,run=0,fade=0,watch=0;
  try{wanted=localStorage.getItem(key)!=='off';}catch(e){}
  audio.volume=0;audio.loop=true;
  function label(on){
    var select=document.getElementById('access-language'),lang=select?select.value:'ko';
    return lang==='en'?(on?'Turn off background music':'Turn on background music'):
      lang==='zh'?(on?'关闭背景音乐':'开启背景音乐'):(on?'배경음 끄기':'배경음 켜기');
  }
  function sync(){
    var enabled=wanted&&!needsGesture,text=label(enabled);
    buttons.forEach(function(b){
      b.setAttribute('aria-pressed',String(enabled));b.setAttribute('aria-label',text);b.title=text;
      var t=b.querySelector('[data-access-music-text]');if(t)t.textContent=text;
      b.querySelector('[data-access-music-icon]').textContent=enabled?'♪':'♫';
    });
  }
  function blocked(){return !wanted||suspended||document.hidden||!!(window.NM_VOICE&&window.NM_VOICE.isSpeaking&&window.NM_VOICE.isSpeaking());}
  function stop(){run++;pending=false;clearInterval(fade);fade=0;audio.pause();audio.volume=0;}
  function start(){
    if(blocked()||needsGesture||pending||!audio.paused)return;
    var ticket=++run;pending=true;audio.volume=0;
    try{
      Promise.resolve(audio.play()).then(function(){
        if(ticket!==run){if(blocked())stop();return;}
        pending=false;if(blocked()){stop();return;}
        clearInterval(fade);var step=0;
        fade=setInterval(function(){
          if(blocked()){stop();return;}
          step++;audio.volume=Math.min(.22,step*.022);
          if(step>=10){clearInterval(fade);fade=0;}
        },60);
        sync();
      }).catch(function(){if(ticket===run){pending=false;needsGesture=true;sync();}});
    }catch(e){pending=false;needsGesture=true;sync();}
  }
  function reconcile(){if(blocked()){if(!audio.paused||pending)stop();}else start();}
  function unlock(ev){
    if(ev.target.closest&&ev.target.closest('[data-access-music]'))return;
    hasGesture=true;needsGesture=false;sync();start();
  }
  buttons.forEach(function(b){b.addEventListener('click',function(){
    wanted=!wanted||needsGesture;hasGesture=true;needsGesture=false;
    try{localStorage.setItem(key,wanted?'on':'off');}catch(e){}
    if(wanted)start();else stop();sync();
  });});
  document.addEventListener('pointerdown',unlock,true);
  document.addEventListener('keydown',unlock,true);
  document.addEventListener('visibilitychange',reconcile);
  document.getElementById('access-language').addEventListener('change',sync);
  window.addEventListener('storage',function(e){if(e.key===key){wanted=e.newValue!=='off';reconcile();sync();}});
  function watchSpeech(){clearInterval(watch);watch=setInterval(reconcile,180);}
  window.addEventListener('pagehide',function(){suspended=true;clearInterval(watch);watch=0;stop();});
  window.addEventListener('pageshow',function(){suspended=false;watchSpeech();if(hasGesture)reconcile();});
  sync();watchSpeech();
})();
