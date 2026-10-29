import assert from "node:assert/strict";
import {foleySamples,createMaterialAudio} from "./material-audio.js";
const kinds=["wood-pick","wood-place","paper-grab","paper-fold","peg-touch","band-stretch","band-release"];
const summary=[];
for(const kind of kinds){
  const data=foleySamples(kind),again=foleySamples(kind);
  assert.deepEqual(data,again);
  assert.ok(data.every(Number.isFinite));
  const peak=Math.max(...data),rms=Math.sqrt(data.reduce((s,v)=>s+v*v,0)/data.length);
  assert.ok(peak>.015&&peak<.65&&rms>.003&&rms<.15);
  assert.ok(Math.abs(data[0])<.0001&&Math.abs(data.at(-1))<.003,"No boundary click");
  summary.push({kind,samples:data.length,peak,rms});
}
assert.throws(()=>foleySamples("unknown"),RangeError);
globalThis.window=new EventTarget();globalThis.document=new EventTarget();document.hidden=false;
const storage=new Map();globalThis.localStorage={getItem:key=>storage.get(key),setItem:(key,value)=>storage.set(key,value)};
let created=0,starts=0,stops=0,closed=0;
class FakeAudio {
  state="running";sampleRate=44100;destination={};
  constructor(){created++;}
  createBuffer(){return {copyToChannel(){}};}
  createBufferSource(){return {connect(){},disconnect(){},start(){starts++;},stop(){stops++;this.onended?.();}};}
  createGain(){return {gain:{value:0},connect(){},disconnect(){}};}
  resume(){return Promise.resolve();}
  close(){closed++;return Promise.resolve();}
}
globalThis.AudioContext=FakeAudio;
const audio=createMaterialAudio();assert.equal(created,0,"No context on page load");
assert.equal(audio.play("wood-pick"),true);assert.equal(created,1);
for(let i=0;i<8;i++)audio.play("wood-place");
assert.equal(starts,9);assert.ok(stops>=5,"Rapid input caps active voices at four");
audio.setMuted(true);const count=starts;assert.equal(audio.play("paper-grab"),false);assert.equal(starts,count);
audio.setMuted(false);document.hidden=true;assert.equal(audio.play("wood-place"),false);
document.hidden=false;audio.play("paper-grab");window.dispatchEvent(new Event("blur"));assert.ok(stops>=9);
storage.set("gfield-audio-muted","true");window.dispatchEvent(new Event("storage"));assert.equal(audio.muted,true);
audio.destroy();assert.equal(closed,1);assert.equal(audio.play("wood-pick"),false);
storage.set("gfield-audio-muted","false");
let resolveResume;
class DelayedAudio extends FakeAudio {
  state="suspended";
  resume(){return new Promise(resolve=>{resolveResume=()=>{this.state="running";resolve();};});}
}
globalThis.AudioContext=DelayedAudio;
const delayed=createMaterialAudio(),before=starts;
assert.equal(delayed.play("wood-pick"),true);assert.equal(starts,before);
delayed.stop();resolveResume();await new Promise(resolve=>setTimeout(resolve,0));
assert.equal(starts,before,"A cancelled first gesture cannot sound after audio unlock");
delayed.play("paper-grab");assert.equal(starts,before+1);delayed.destroy();
const volatile=createMaterialAudio();localStorage.setItem=()=>{throw new Error("Quota");};
volatile.setMuted(true);assert.equal(volatile.muted,true);assert.equal(volatile.play("wood-place"),false);
volatile.setMuted(false);assert.equal(volatile.muted,false,"Mute remains usable when saving preferences fails");volatile.destroy();
console.log(JSON.stringify({status:"PASS",summary,lifecycleChecks:true,auralReview:false}));
