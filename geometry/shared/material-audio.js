const MUTE_KEY = "gfield-audio-muted";
const DURATIONS = { "wood-pick":.095, "wood-place":.19, "paper-grab":.16, "paper-fold":.38,
  "peg-touch":.07,"band-stretch":.15,"band-release":.11 };
const LABELS = {
  ko:["소리 켜기","소리 끄기"], en:["Turn sound on","Mute sound"],
  zh:["开启声音","关闭声音"], ja:["音を出す","音を消す"]
};

// Short, deterministic material foley. No voice assets or external samples are changed.
export function foleySamples(kind, sampleRate = 44100) {
  if (!DURATIONS[kind]) throw new RangeError("Unknown material cue");
  const samples = new Float32Array(Math.ceil(DURATIONS[kind] * sampleRate));
  let seed=872341, smooth=0, previous=0;
  for (let i=0;i<samples.length;i++) {
    seed=(Math.imul(seed,1664525)+1013904223)>>>0;
    const noise=seed/2147483648-1, t=i/sampleRate;
    smooth += .16*(noise-smooth);
    if (kind.startsWith("wood")||kind==="peg-touch") {
      const peg=kind==="peg-touch",pickup=kind==="wood-pick",k=peg?1.8:pickup?1.24:1;
      const attack=Math.min(1,t/.0015);
      const body=(Math.sin(t*2*Math.PI*287*k)*.22*Math.exp(-t*51)
        +Math.sin(t*2*Math.PI*613*k)*.13*Math.exp(-t*68)
        +Math.sin(t*2*Math.PI*1193*k)*.065*Math.exp(-t*94));
      samples[i]=attack*(body+(noise-smooth)*.27*Math.exp(-t*170)+smooth*.17*Math.exp(-t*75))*(peg?.32:pickup?.46:.78)*(peg?Math.min(1,(samples.length-i)/(.01*sampleRate)):1);
    } else if (kind.startsWith("band")) {
      const release=kind==="band-release",frequency=release?205:155;
      const phase=2*Math.PI*frequency*(t+.035*(1-Math.exp(-t*22)));
      const envelope=Math.min(1,t/.003)*Math.exp(-t*35)*Math.min(1,(samples.length-i)/(.018*sampleRate));
      samples[i]=(Math.sin(phase)*.17+Math.sin(phase*2.03)*.075+Math.sin(phase*3.8)*.03+(noise-smooth)*.035)*envelope;
    } else {
      const fold=kind==="paper-fold";
      const envelope=Math.sin(Math.PI*i/samples.length)**1.4;
      const crinkles=.24+.76*(.5+.5*Math.sin(2*Math.PI*(fold?24:39)*t+2*Math.sin(t*83)))**4;
      const high=noise-previous;previous=noise;
      samples[i]=(.22*(noise-smooth)+.035*high)*envelope*crinkles*(fold?.65:.45);
    }
  }
  return samples;
}

export function createMaterialAudio() {
  let context=null, disposed=false, muted=false, lastUnlock=null, epoch=0, volatileMute=null;
  const voices=new Set(), buffers=new Map(), listeners=new Set();
  const abort=new AbortController();
  const options={signal:abort.signal};
  const readMute=()=>{if(volatileMute!==null)return volatileMute;try{return localStorage.getItem(MUTE_KEY)==="true";}catch{return muted;}};
  muted=readMute();
  function stop() {
    epoch++;
    for(const voice of [...voices]) {try{voice.stop();}catch{/* Already ended. */}}
    voices.clear();
  }
  function notify(){for(const listener of listeners)listener(muted);}
  function sync(){const next=readMute();if(next!==muted){muted=next;if(muted)stop();notify();}}
  function unlock() {
    if(disposed||muted||document.hidden)return;
    const Audio=globalThis.AudioContext||globalThis.webkitAudioContext;
    if(!Audio)return;
    if(!context)try{context=new Audio();}catch{return;}
    if(context.state==="suspended"&&!lastUnlock) {
      lastUnlock=context.resume().catch(()=>{}).finally(()=>{lastUnlock=null;});
    }
  }
  function play(kind) {
    sync();
    if(disposed||muted||document.hidden)return false;
    // Calls originate in accepted pointer/keyboard actions, never page load.
    unlock();
    if(!context)return false;
    if(context.state!=="running") {
      const acceptedAt=epoch;
      if(!lastUnlock)return false;
      lastUnlock.then(()=>{
        if(!disposed&&!muted&&!document.hidden&&epoch===acceptedAt&&context.state==="running")play(kind);
      });
      return true;
    }
    if(!buffers.has(kind)) {
      const data=foleySamples(kind,context.sampleRate),buffer=context.createBuffer(1,data.length,context.sampleRate);
      buffer.copyToChannel(data,0);buffers.set(kind,buffer);
    }
    if(voices.size>=4){const oldest=voices.values().next().value;try{oldest.stop();}catch{}voices.delete(oldest);}
    const source=context.createBufferSource(),gain=context.createGain();
    gain.gain.value=.55;source.buffer=buffers.get(kind);source.connect(gain);gain.connect(context.destination);
    source.onended=()=>{voices.delete(source);source.disconnect();gain.disconnect();};
    voices.add(source);source.start();
    return true;
  }
  function setMuted(value) {
    muted=!!value;try{localStorage.setItem(MUTE_KEY,String(muted));volatileMute=null;}catch{volatileMute=muted;}
    if(muted)stop();else unlock();
    window.dispatchEvent(new Event("gfield-audio-change"));notify();
  }
  window.addEventListener("storage",sync,options);
  window.addEventListener("gfield-audio-change",sync,options);
  window.addEventListener("blur",stop,options);
  document.addEventListener("visibilitychange",()=>{if(document.hidden)stop();},options);
  return {play,unlock,stop,setMuted,get muted(){sync();return muted;},
    subscribe(listener){listeners.add(listener);return()=>listeners.delete(listener);},
    destroy(){disposed=true;stop();abort.abort();listeners.clear();buffers.clear();context?.close().catch(()=>{});}
  };
}

export function bindMaterialAudioButton(button,audio,language=()=>document.documentElement.lang) {
  Object.assign(button.style,{width:"44px",height:"44px",minWidth:"44px",minHeight:"44px",padding:"0",display:"grid",placeItems:"center",flexShrink:"0"});
  function update() {
    const muted=audio.muted,labels=LABELS[language()]||LABELS.ko;
    button.title=labels[muted?0:1];button.setAttribute("aria-label",button.title);
    button.setAttribute("aria-pressed",String(!muted));
    // Lucide volume-2 / volume-x paths, ISC licensed with the project's icon set.
    button.innerHTML=`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m11 5-6 4H2v6h3l6 4V5Z"/>${muted?'<path d="m22 9-6 6m0-6 6 6"/>':'<path d="M15.54 8.46a5 5 0 0 1 0 7.08m3.53-10.61a10 10 0 0 1 0 14.14"/>'}</svg>`;
  }
  const click=()=>{audio.setMuted(!audio.muted);update();};
  button.addEventListener("click",click);
  const unsubscribe=audio.subscribe(update);update();
  return {update,destroy(){unsubscribe();button.removeEventListener("click",click);}};
}
