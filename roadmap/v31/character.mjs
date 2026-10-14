const FILES={listen:'docssam-math-A1-mouth-closed.png',half:'docssam-math-A2-mouth-half.png',open:'docssam-math-A3-mouth-open.png',o:'docssam-math-A4-mouth-o.png',blink:'docssam-math-A5-eyes-closed.png',surprise:'docssam-math-B1-surprised.png',think:'docssam-math-B2-puzzled-thinking.png',praise:'docssam-math-B3-praise.png',encourage:'docssam-math-B4-encourage.png',happy:'docssam-math-B5-happy-thumbs-up.png'};
export function characterMarkup(){return `<figure id="docssam" class="docssam"><img src="assets/math-docssam/${FILES.listen}" alt="정장 차림의 DOCSSAM 전신 캐릭터" width="1024" height="1536"></figure>`;}
export function mountCharacter(el,mood='listen'){
 const img=el.querySelector('img'),reduced=matchMedia('(prefers-reduced-motion: reduce)'),cache=new Map();let timer=null,audio=null,removeListeners=[];
 function show(key){const file=FILES[key]||FILES.listen;img.src='assets/math-docssam/'+file;el.dataset.pose=key;}
 show(mood);
 // Use complete, existing frames; no invented face overlay or regenerated image.
 function stop(){clearInterval(timer);timer=null;el.dataset.speaking='false';show(mood);}
 function detach(){stop();removeListeners.forEach(f=>f());removeListeners=[];audio=null;}
 return {mood(key){mood=FILES[key]?key:'listen';if(!timer)show(mood);},
  attachNarration(a,{exactTextMatch=false}={}){
   detach();if(!exactTextMatch||!(a instanceof HTMLAudioElement))return false;
   audio=a;const start=()=>{stop();if(a.paused||a.ended)return;el.dataset.speaking='true';timer=setInterval(()=>{if(a.paused||a.ended){stop();return;}show(reduced.matches?'half':['half','open','o','listen'][Math.floor(a.currentTime*8)%4]);},120);};
   for(const [event,fn] of [['playing',start],['pause',stop],['waiting',stop],['ended',stop],['error',stop]]){a.addEventListener(event,fn);removeListeners.push(()=>a.removeEventListener(event,fn));}
   return true;
  },destroy:detach};
}
