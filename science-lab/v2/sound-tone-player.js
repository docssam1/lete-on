// 같은 자 모형의 주파수와 세기만 재생한다. 녹음·마이크·자동 재생은 사용하지 않는다.
import {rulerModel} from '../scenes/ruler-model.js';
export const TONE_DURATION=.85,TONE_MAX_GAIN=.08;
export function createSoundTonePlayer({createContext=()=>{const C=globalThis.AudioContext||globalThis.webkitAudioContext;return C?new C():null;},isActive=()=>true,setInterval:every=globalThis.setInterval,clearInterval:cancel=globalThis.clearInterval}={}){
 let context=null,node=null,gain=null,timer=null,serial=0,disposed=false;
 const disconnect=()=>{if(timer!==null){cancel(timer);timer=null;}const n=node,g=gain;node=null;gain=null;if(n){n.onended=null;try{n.stop();}catch{}try{n.disconnect();}catch{}}if(g)try{g.disconnect();}catch{}};
 const stop=()=>{serial++;disconnect();};
 return{
  async play(len,strength){
   const m=rulerModel(len,strength);stop();const turn=serial;
   if(disposed||!isActive())return{started:false,reason:'inactive'};
   try{
    context ||= createContext();if(!context)return{started:false,reason:'unavailable'};
    if(context.state==='closed')return{started:false,reason:'unavailable'};
    if(context.state!=='running')await context.resume();
    if(disposed||turn!==serial||!isActive())return{started:false,reason:'inactive'};
    if(context.state!=='running')return{started:false,reason:'unavailable'};
    node=context.createOscillator();gain=context.createGain();const n=node,g=gain,t=context.currentTime;
    n.type='sine';n.frequency.setValueAtTime(m.hz,t);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(TONE_MAX_GAIN*m.amp,t+.025);g.gain.setValueAtTime(TONE_MAX_GAIN*m.amp,t+.65);g.gain.linearRampToValueAtTime(0,t+TONE_DURATION);
    n.connect(g);g.connect(context.destination);n.onended=()=>{if(node===n)disconnect();};n.start(t);n.stop(t+TONE_DURATION);
    timer=every(()=>{if(!isActive())stop();},50);
    return{started:true,reason:'playing'};
   }catch{if(turn===serial)stop();return{started:false,reason:'unavailable'};}
  },stop,
  dispose(){if(disposed)return;disposed=true;stop();if(context&&context.state!=='closed')try{const closing=context.close();closing?.catch?.(()=>{});}catch{}context=null;},
 };
}
