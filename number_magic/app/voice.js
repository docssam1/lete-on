/* One narration channel. Only the current OmniVoice recordings are used. */
(function(root){
'use strict';
let active=null,run=0,channel=null,starting=false;
const RATE=0.8;
/* 언어마다 재생 속도(연결표 tts-map-omni.js 의 NM_TTS_OMNI_RATE). 없으면 0.8.
   2026-11-11 누미 한국어 새 목소리는 정상 속도로 만들어 1.0, 영어·중국어는 그대로 0.8. */
const rateOf=lang=>Number(root.NM_TTS_OMNI_RATE?.[lang||'ko'])||RATE;
const cache=new Map();
const base=new URL('../',document.currentScript.src);
function stop(){
  run++;starting=false;
  if(active){try{active.pause();active.currentTime=0;}catch(e){}active=null;}
  // Also cancel device speech left by an older page or activity.
  try{root.speechSynthesis?.cancel();}catch(e){}
}
try{channel=new BroadcastChannel('nm-narration');channel.onmessage=()=>stop();}catch(e){}
function say(text,lang){
  stop();
  if(document.visibilityState==='hidden')return null;
  const url=root.NM_TTS_OMNI?.[lang||'ko']?.[text];
  if(!url)return null; // Keep the visible explanation; never switch to another voice.
  const ticket=run;
  try{
    channel?.postMessage('stop');
    let a=cache.get(url);
    if(!a){a=new Audio(new URL(url,base).href);cache.set(url,a);}
    active=a;starting=true;a.currentTime=0;
    a.playbackRate=rateOf(lang);a.preservesPitch=true;
    if('webkitPreservesPitch' in a)a.webkitPreservesPitch=true;
    Promise.resolve(a.play()).then(()=>{
      if(ticket===run)starting=false;
      if(ticket!==run&&active!==a)a.pause();
    }).catch(()=>{if(ticket===run){try{a.pause();}catch(e){}active=null;starting=false;}});
    return a;
  }catch(e){if(ticket===run){active=null;starting=false;}return null;}
}
root.addEventListener('pagehide',stop);
root.document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
root.NM_VOICE={say,stop,isSpeaking:()=>!!active&&(starting||!active.paused)&&!active.ended,rate:RATE,rateOf};
})(window);
