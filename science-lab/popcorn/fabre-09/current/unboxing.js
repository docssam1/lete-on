// Reuse the approved photos. Crops are CSS windows, not modified source images.
const crops=[['A',50,100,310,465,-190,-45,-17],['B',350,310,325,145,-140,130,12],['C',690,190,335,345,0,-140,-8],['D',1040,100,330,465,145,-100,15],['E',1370,100,330,465,195,85,-12],['F1',1730,130,195,415,-30,125,-15],['F2',1940,130,200,415,65,125,14]];
export function partsMarkup(src){return `<figure class="assembly-photo assembly-detach"><div class="detach-board" aria-label="A부터 F까지 부품 분리 위치">${crops.map(([name,x,y,w,h])=>`<button type="button" class="detach-part" data-detach="${name}" aria-pressed="false" aria-label="${name} 부품 분리 위치 살펴보기"><span class="part-crop" style="--px:${x}px;--py:${y}px;--pw:${w}px;--ph:${h}px;background-image:url('${src}')"></span><b>${name}</b><span class="detach-label">눌러 떼어보기</span></button>`).join('')}</div><figcaption>AI 실사형 부품 설명 · 화면에서는 눌러 분리 위치를 살펴요. 실제 홈을 따라 떼는 작업은 교구에서 해요.</figcaption></figure>`;}

export function createUnboxing({packageSrc,partsSrc,onComplete}){
 let audio,muted=false,sources=new Set(),overlay,timers=[],version=0;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const loaded=Promise.all([packageSrc,partsSrc].map(src=>{const img=new Image();img.src=src;return img.decode().catch(()=>{});}));
 function silence(){for(const source of sources){try{source.stop();}catch{}}sources.clear();}
 function prime(){if(muted)return;try{if(!audio||audio.state==='closed')audio=new (window.AudioContext||window.webkitAudioContext)();void audio.resume().catch(()=>{});}catch{}}
 function rip(kind='tear'){if(!audio||muted||audio.state!=='running')return;const now=audio.currentTime;
  // Three uneven, quiet crackles: a short plastic tear, started only by a click.
  for(const [i,delay] of (kind==='sway'?[0,.24,.52,.78]:[0,.15,.33]).entries()){
   const duration=kind==='sway'?.09:.13+i*.025,buffer=audio.createBuffer(1,Math.ceil(audio.sampleRate*duration),audio.sampleRate),data=buffer.getChannelData(0);
   for(let n=0;n<data.length;n++)data[n]=(Math.random()*2-1)*(.35+.65*Math.abs(Math.sin(n*.047)));
   const source=audio.createBufferSource(),filter=audio.createBiquadFilter(),gain=audio.createGain();source.buffer=buffer;source.soundKind=kind;filter.type=kind==='sway'?'bandpass':'highpass';filter.frequency.value=kind==='sway'?1800:1100;filter.Q.value=.7;
   gain.gain.setValueAtTime(0,now+delay);gain.gain.linearRampToValueAtTime(kind==='sway'?.025:.085,now+delay+.012);gain.gain.exponentialRampToValueAtTime(.001,now+delay+duration);
   source.connect(filter);filter.connect(gain);gain.connect(audio.destination);sources.add(source);source.onended=()=>{sources.delete(source);source.disconnect();filter.disconnect();gain.disconnect();};source.start(now+delay);
  }
 }
 function finish(){version++;timers.forEach(clearTimeout);timers=[];silence();overlay?.remove();overlay=null;onComplete();}
 async function play(){
  prime();version++;const request=version;timers.forEach(clearTimeout);timers=[];overlay?.remove();
  overlay=document.createElement('section');overlay.className='unboxing-scene';overlay.setAttribute('aria-label','봉투 뜯기와 준비물 꺼내기');
  overlay.innerHTML=`<div class="unboxing-tools"><button type="button" data-unbox-sound aria-pressed="${muted}">${muted?'봉투 소리 켜기':'봉투 소리 끄기'}</button><button type="button" data-unbox-skip>바로 준비하기 →</button></div><p class="unboxing-caption" role="status">봉투를 준비하고 있어요…</p><div class="unboxing-stage"><span class="unboxing-rays" aria-hidden="true"></span><div class="unboxing-pouch"><div class="unboxing-inner" aria-hidden="true">${Array.from({length:3},(_,i)=>`<span class="unboxing-loose loose-${i}" style="--loose:${i}"><img src="${packageSrc}" alt=""></span>`).join('')}</div><span class="unboxing-half pouch-left"><img src="${packageSrc}" alt="전지 없이 준비물이 담긴 봉투"></span><span class="unboxing-half pouch-right" aria-hidden="true"><img src="${packageSrc}" alt=""></span>${Array.from({length:6},(_,i)=>`<span class="unboxing-seal" style="--strip:${i};--tear-delay:${i*85}ms" aria-hidden="true"><img src="${packageSrc}" alt=""></span>`).join('')}</div><div class="unboxing-parts" aria-hidden="true">${crops.map(([name,x,y,w,h,dx,dy,rotation],i)=>`<span class="unboxing-part" style="--px:${x}px;--py:${y}px;--pw:${w}px;--ph:${h}px;--dx:${dx}px;--dy:${dy}px;--turn:${rotation}deg;--part-delay:${i*45}ms;background-image:url('${partsSrc}')"></span>`).join('')}</div></div><p class="unboxing-note">AI 실사형 설명 이미지 · 실제 포장과 부품은 교구에서 확인해요.</p>`;
  document.body.append(overlay);overlay.querySelector('[data-unbox-skip]').focus({preventScroll:true});
  overlay.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-unbox-skip'))finish();if(b.hasAttribute('data-unbox-sound')){muted=!muted;b.setAttribute('aria-pressed',String(muted));b.textContent=muted?'봉투 소리 켜기':'봉투 소리 끄기';if(muted)silence();else prime();}});
  await loaded;if(request!==version||!overlay)return;
  overlay.classList.add('is-ready');overlay.querySelector('.unboxing-caption').textContent='찰랑찰랑… 준비물이 들어 있어요';
  if(reduced.matches){finish();return;}
  rip('sway');
  timers.push(setTimeout(()=>{if(request!==version||!overlay)return;overlay.classList.add('is-tearing');overlay.querySelector('.unboxing-caption').textContent='투두둑! 봉투가 열려요';rip();},1300));
  timers.push(setTimeout(()=>{if(request===version&&overlay)overlay.querySelector('.unboxing-caption').textContent='이제 판에서 부품을 하나씩 떼어요';},2750));
  timers.push(setTimeout(()=>{if(request===version)finish();},4150));
 }
 function cancel(){version++;timers.forEach(clearTimeout);timers=[];silence();overlay?.remove();overlay=null;}
 const hidden=()=>{if(document.hidden){silence();if(overlay)finish();}};document.addEventListener('visibilitychange',hidden);
 return {play,cancel,dispose(){cancel();document.removeEventListener('visibilitychange',hidden);void audio?.close().catch(()=>{});}};
}
