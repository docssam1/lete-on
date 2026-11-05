import fs from'node:fs';import vm from'node:vm';import assert from'node:assert/strict';
import*as model from'../../scenes/bread-model.js';
// Run the actual controller with its 2D fallback. The engine/DOM are controlled doubles.
const context=vm.createContext({console,matchMedia:()=>({matches:true}),setInterval(){throw Error('동작 줄이기에서는 타이머를 시작하지 않는다');},clearInterval(){}});
async function mock(exports){const m=new vm.SyntheticModule(Object.keys(exports),function(){for(const[k,v]of Object.entries(exports))this.setExport(k,v);},{context});await m.link(()=>{});await m.evaluate();return m;}
let detachedDispose;
const engine=await mock({Stage:{canWebGL:()=>false},watchDetached:(_el,dispose)=>{detachedDispose=dispose;}}),rig=await mock({}),data=await mock(model);
const module=new vm.SourceTextModule(fs.readFileSync(new URL('../lab-bread.js',import.meta.url),'utf8'),{context,importModuleDynamically:async spec=>spec==='../engine.js'?engine:rig});
await module.link(spec=>{assert.equal(spec,'../scenes/bread-model.js');return data;});await module.evaluate();
const controls=new Map(),waters=model.WATERS.map((_w,i)=>({dataset:{water:String(i)},setAttribute(){}}));
const control=()=>({disabled:false,textContent:'',innerHTML:'',style:{setProperty(){}},setAttribute(){}});
const host={isConnected:true,innerHTML:'',querySelector:selector=>{if(!controls.has(selector))controls.set(selector,control());return controls.get(selector);},querySelectorAll:()=>waters};
const legacy={water:model.WATERS[0],...model.breadModel(model.WATERS[0])},rows=[legacy],snapshot=JSON.stringify(rows),saved=[];
const handle=await module.namespace.mountBread(host,{rows,onRecord:newRows=>saved.push(structuredClone(newRows))});
assert(host.innerHTML.includes('부피와 모습은 미리 정해진 모형의 결과'));assert(host.innerHTML.includes('실제 효모의 생사를 확인할 수는 없어요'));assert(host.innerHTML.includes('70 ℃)은 화면에서만 비교'));
const record=host.querySelector('[data-record]'),run=host.querySelector('[data-run]'),tip=host.querySelector('[data-tip]');
for(let i=0;i<3;i++){waters[i].onclick();assert(record.disabled);record.onclick();assert.equal(saved.length,i);run.onclick();assert.equal(record.disabled,false);if(i===2){assert(tip.textContent.includes('실제 효모의 생사를 확인한 결과는 아니에요'));assert(!tip.textContent.includes('효모가 죽었어요'));}record.onclick();const last=saved.at(-1).at(-1);assert.deepEqual(last,{water:model.WATERS[i],...model.breadModel(model.WATERS[i])});}
assert.equal(JSON.stringify(rows),snapshot);assert.deepEqual(saved.at(-1)[0],legacy);detachedDispose();record.onclick();assert.equal(saved.length,3);handle.dispose();
console.log(JSON.stringify({actualBreadController:true,conditions:3,lockedBeforeRun:true,modelAssumptionsVisible:true,noLivenessProofClaim:true,originalModelRowsAndValuesUnchanged:true,disposeStopsRecords:true,engineAndDomStubbed:true,forceReducedMotion:true,browserVerified:false,webGLVerified:false}));
