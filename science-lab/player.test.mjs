import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as THREE from '../world-explorer/vendor/three.module.js';
import {Player,captionReadSeconds} from './engine.js';

const long='같은 비눗물로 만든 두 방울의 크기와 사이의 면을 살펴보고, 관찰한 특징을 서로 비교해 보아요. '.repeat(3).trim();
async function player({texts=[long,'다음 장면을 살펴봐요.'],duration=1}={}){
 const root=new THREE.Group(),samples=[];
 const stage={root,resetCount:0,clear:()=>root.clear(),setView(){},resetView(){this.resetCount++;}};
 const instance=new Player(stage);
 await instance.load({view:{},build(_kit,world){world.add('object',new THREE.Object3D());return{};},beats:texts.map(text=>({text,dur:duration,show:['object'],anim:p=>samples.push(p)}))});
 return {instance,stage,samples};
}
function advance(instance,seconds){
 for(let elapsed=0;elapsed<seconds-1e-8;){const raw=Math.min(.1,seconds-elapsed);elapsed+=raw;instance._tick(.01,elapsed,raw);}
}
function untilNext(instance,limit=180){
 const index=instance.index;let elapsed=0;
 while(instance.index===index&&!instance.done&&elapsed<limit){advance(instance,.1);elapsed+=.1;}
 assert(elapsed<limit,'clock must remain bounded without speech callbacks');return elapsed;
}
function speech({speakError=false,cancelError=false,missing=false}={}){
 const original={synthesis:globalThis.speechSynthesis,utterance:globalThis.SpeechSynthesisUtterance};
 const spoken=[],api={cancels:0,cancel(){this.cancels++;if(cancelError)throw Error('cancel unavailable');},speak(utterance){if(speakError)throw Error('speech unavailable');spoken.push(utterance);}};
 if(missing){delete globalThis.speechSynthesis;delete globalThis.SpeechSynthesisUtterance;}
 else{globalThis.speechSynthesis=api;globalThis.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};}
 return {api,spoken,restore(){if(original.synthesis===undefined)delete globalThis.speechSynthesis;else globalThis.speechSynthesis=original.synthesis;if(original.utterance===undefined)delete globalThis.SpeechSynthesisUtterance;else globalThis.SpeechSynthesisUtterance=original.utterance;}};
}
test('긴 자막은 동작이 끝난 뒤에도 읽을 시간을 주고 물체의 동작 시간은 바꾸지 않는다',async()=>{
 const {instance,samples}=await player();instance.play();advance(instance,3);
 assert.equal(instance.p,1);assert(samples.includes(1));assert.equal(instance.index,0);
 const displayed=3+untilNext(instance);assert(displayed>=long.length/10);assert.equal(instance.index,1);
});
test('짧은 장면의 시간 진행과 raw 경과 시간·멈춤 상태를 유지한다',async()=>{
 const {instance}=await player({texts:['확인해요.','다음이에요.']});instance.play();
 instance._tick(.01,1,1);assert.equal(instance.p,1);assert.equal(instance.readElapsed,1);
 instance.pause();advance(instance,100);assert.equal(instance.readElapsed,1);assert.equal(instance.index,0);
 instance.play();assert(untilNext(instance)<3);assert.equal(instance.index,1);
});
test('음성 API가 없어도 멈춤·재생·이동·음성 끄기는 예외 없이 자막으로 진행한다',async()=>{
 const mock=speech({missing:true});try{
  const {instance}=await player();instance.setVoice(true);instance.play();advance(instance,2);
  assert.doesNotThrow(()=>{instance.pause();instance.play();instance.setVoice(false);instance.next();instance.prev();instance.stop();});
  instance.play();untilNext(instance);assert.equal(instance.index,1);
 }finally{mock.restore();}
});
test('음성이 끝났다는 콜백이 없어도 고정된 읽기 시간 뒤 진행하며 속도 상한을 반영한다',async()=>{
 const mock=speech();try{
  for(const speed of [.75,1,1.5]){
   const {instance}=await player();instance.setSpeed(speed);instance.setVoice(true);instance.play();advance(instance,6);
   assert.equal(instance.index,0);assert.equal(mock.spoken.at(-1).lang,'ko-KR');assert.equal(mock.spoken.at(-1).rate,Math.min(1.4,.95*speed));
   const elapsed=6+untilNext(instance);assert(elapsed>=captionReadSeconds(long,{voice:true,speed}));assert.equal(instance.index,1);instance.stop();
  }
 }finally{mock.restore();}
});
test('음성 실패나 거부가 자막 진행을 막지 않는다',async()=>{
 for(const failure of [{speakError:true},{cancelError:true}]){
  const mock=speech(failure);try{
   const {instance}=await player();assert.doesNotThrow(()=>instance.setVoice(true));instance.play();
   assert.equal(instance._speechForTiming,false);untilNext(instance);assert.equal(instance.index,1);
   assert.doesNotThrow(()=>{instance.pause();instance.stop();});
  }finally{mock.restore();}
 }
});
test('마지막 장면을 멈췄다 재생하면 같은 자막을 다시 읽고 이전 음성 콜백은 새 음성을 건드리지 않는다',async()=>{
 const mock=speech();try{
  const {instance}=await player({texts:[long]});instance.setVoice(true);instance.play();advance(instance,3);
  assert.equal(instance.p,1);assert.equal(instance.done,false);const old=mock.spoken.at(-1);
  instance.pause();instance.play();assert.equal(instance.index,0);assert.equal(instance.done,false);assert.equal(instance.readElapsed,0);
  const current=mock.spoken.at(-1);assert.notEqual(current,old);assert.equal(current.text,long);
  old.onend();old.onerror();assert.equal(instance._utterance,current);assert.equal(instance._speechForTiming,true);
  const before=mock.api.cancels;instance.stop();assert.equal(mock.api.cancels,before+1);assert.equal(instance._utterance,null);
 }finally{mock.restore();}
});
test('수동 다음·마지막 종료·다시 재생은 읽기 시간 대기 없이 동작한다',async()=>{
 const mock=speech();try{
  const {instance,stage}=await player();instance.setVoice(true);instance.play();
  instance.next();assert.equal(instance.index,1);assert.equal(instance.readElapsed,0);
  instance.next();assert.equal(instance.done,true);assert.equal(instance.playing,false);assert.equal(instance._utterance,null);
  instance.replay();assert.equal(stage.resetCount,1);assert.equal(instance.index,0);assert.equal(instance.done,false);assert(instance.playing);instance.stop();
 }finally{mock.restore();}
});
test('음성을 끈 다른 플레이어는 재생 중인 음성을 취소하지 않고 속도 변경은 현재 자막을 새 속도로 읽는다',async()=>{
 const mock=speech();try{
  const {instance}=await player();instance.setVoice(true);instance.play();const original=mock.spoken.at(-1),cancels=mock.api.cancels;
  const quiet=(await player()).instance;quiet.play();quiet.pause();quiet.stop();assert.equal(mock.api.cancels,cancels);assert.equal(instance._utterance,original);
  instance.setSpeed(1.5);assert.notEqual(mock.spoken.at(-1),original);assert.equal(mock.spoken.at(-1).rate,1.4);assert.equal(instance.readElapsed,0);
  const current=mock.spoken.at(-1);current.onend();const after=mock.api.cancels;instance.stop();assert.equal(mock.api.cancels,after);
 }finally{mock.restore();}
});
test('줄인 움직임에서는 동작을 즉시 보여 주고 긴 자막은 그대로 읽을 시간을 둔다',()=>{
 const source=fs.readFileSync(new URL('./engine.js',import.meta.url),'utf8');
 const body=source.slice(source.indexOf('export class Player')).replace('export class Player','class Player');
 const context=vm.createContext({REDUCED:true,captionReadSeconds,ease:{io:x=>x}});
 const ReducedPlayer=new vm.Script(body+'\nPlayer').runInContext(context);
 const instance=new ReducedPlayer({resetView(){}});instance.beats=[{text:long,dur:1},{text:'다음',dur:1}];
 instance.goto(0,true);assert.equal(instance.p,1);advance(instance,3);assert.equal(instance.index,0);
 untilNext(instance);assert.equal(instance.index,1);assert.equal(instance.p,1);
});

test('중단하거나 새 load가 시작되면 대기 중이던 옛 장면을 만들지 않는다',async()=>{
 const root=new THREE.Group(),built=[],stage={root,clear:()=>root.clear(),setView(){}};
 const instance=new Player(stage),mod=id=>({view:{},beats:[{text:id}],build(){built.push(id);return{};}});
 const canceled=instance.load(mod('canceled'));instance.stop();assert.equal(await canceled,false);assert.deepEqual(built,[]);
 const old=instance.load(mod('old')),current=instance.load(mod('current'));assert.equal(await old,false);assert.equal(await current,true);assert.deepEqual(built,['current']);assert.equal(instance.beats[0].text,'current');
});
test('해제된 무대나 DOM에서 빠진 캔버스에는 늦은 장면을 만들지 않는다',async()=>{
 for(const state of ['disposed','detached']){
  const root=new THREE.Group(),canvas={isConnected:true};let built=0;
  const stage={root,canvas,clear:()=>root.clear(),setView(){}},instance=new Player(stage),pending=instance.load({view:{},beats:[],build(){built++;return{};}});
  if(state==='disposed')stage.disposed=true;else canvas.isConnected=false;
  assert.equal(await pending,false,state);assert.equal(built,0,state);assert.equal(instance.index,-1);
 }
});
