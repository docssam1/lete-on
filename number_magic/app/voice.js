/* One narration channel. Only the current OmniVoice recordings are used. */
(function(root){
'use strict';
let active=null,run=0,channel=null;
const cache=new Map();
const base=new URL('../',document.currentScript.src);
function stop(){
  run++;
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
    active=a;a.currentTime=0;
    Promise.resolve(a.play()).then(()=>{
      if(ticket!==run&&active!==a)a.pause();
    }).catch(()=>{if(ticket===run){try{a.pause();}catch(e){}active=null;}});
    return a;
  }catch(e){return null;}
}
root.addEventListener('pagehide',stop);
root.document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
root.NM_VOICE={say,stop};
})(window);
