import assert from 'node:assert/strict';import {fileURLToPath,pathToFileURL} from 'node:url';
const root=fileURLToPath(new URL('../../../',import.meta.url)),load=p=>import(pathToFileURL(root+p));
const {revisedTextbookUnits}=await load('science-lab/v2/revised-textbook.js'),{revisedClassroom}=await load('science-lab/v2/revised-lesson.js');
let audio=0;
const decode=s=>s.replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&'),attrs=s=>Object.fromEntries([...s.matchAll(/([\w:-]+)(?:="([^"]*)")?/g)].map(m=>[m[1],decode(m[2]||'')])),dataset=a=>Object.fromEntries(Object.entries(a).filter(([k])=>k.startsWith('data-')).map(([k,v])=>[k.slice(5).replace(/-([a-z])/g,(_m,x)=>x.toUpperCase()),v]));
export function host(){const events=new Map(),controls=new Map();return{innerHTML:'',addEventListener:(t,f)=>events.set(t,f),removeEventListener:t=>events.delete(t),querySelector:s=>{if(!controls.has(s))controls.set(s,{disabled:false,textContent:'',focus(){}});return controls.get(s);},change:(a,value)=>events.get('change')?.({target:{value,dataset:dataset(a),matches:s=>{const m=s.match(/^\[([^\]=]+)(?:="([^"]+)")?\]$/);return !!m&&Object.hasOwn(a,m[1])&&(m[2]===undefined||m[2]===a[m[1]]);}}}),click:a=>events.get('click')?.({target:{closest:s=>{const m=s.match(/^\[([^\]=]+)/);return m&&Object.hasOwn(a,m[1])?{dataset:dataset(a)}:null;}}})};}
export const selects=html=>[...html.matchAll(/<select([^>]*)>([\s\S]*?)<\/select>/g)].map(m=>({attrs:attrs(m[1]),options:[...m[2].matchAll(/<option([^>]*)>([\s\S]*?)<\/option>/g)].map(o=>({attrs:attrs(o[1]),value:Object.hasOwn(attrs(o[1]),'value')?attrs(o[1]).value:decode(o[2].replace(/<[^>]+>/g,''))})).filter(o=>o.value!=='')}));
const combinations=controls=>controls.length?combinations(controls.slice(1)).flatMap(rest=>controls[0].options.map(o=>[{attrs:controls[0].attrs,value:o.value},...rest])):[[]],caseControl=s=>Object.keys(s.attrs).some(k=>k.startsWith('data-')&&!/-(prediction|judgment|place)$/.test(k)),button=(html,value)=>{const a=[...html.matchAll(/<button([^>]*)>/g)].map(m=>attrs(m[1])).find(a=>Object.entries(a).some(([k,v])=>k.endsWith('-act')&&v===value));assert(a,'button '+value);return a;},normalize=html=>html.replace(/((?:animal|plant|life|ecology|material|earth-sea|sound|infection|climate|sky|water|solution|ground|biology|magnet|gas|geology|light|mixture|body|heat|weather|energy|acid|motion|plant-structure|earth-motion|season|combustion|electricity|career)-compare-)\d+/g,'$1INSTANCE');
const options=onRecord=>({onRecord,createPlayer:()=>({play(){audio++;throw Error('audio should not play')},stop(){},dispose(){}}),document:{hidden:false,addEventListener(){},removeEventListener(){}}});

export async function comparisonCaseAxes(kind){
 const name=kind.replace(/-compare$/,''),prefix='data-'+kind+'-';
 if(name==='animal'){const m=await load('science-lab/v2/animal-classify.js');return {'data-animal-criterion':Object.keys(m.CLASSIFY_CRITERIA)};}
 if(name==='plant'){const m=await load('science-lab/v2/plant-classify.js');return {'data-plant-criterion':Object.keys(m.LEAF_CRITERIA)};}
 const model=await load('science-lab/v2/'+name+'-compare-model.js');
 if(name==='life')return {[prefix+'experiment']:Object.keys(model.LIFE_EXPERIMENTS),[prefix+'plan']:Object.keys(model.LIFE_PLANS)};
 const special={material:['test','TESTS'],ecology:['condition','CHANGES'],'earth-sea':['plan','EARTH_SEA_PLAN_IDS'],sky:['plan','SKY_PLAN_IDS'],sound:['pair','SOUND_PAIR_IDS'],infection:['round','INFECTION_ROUNDS'],climate:['level','CLIMATE_LEVELS']},entry=Object.hasOwn(special,name)?special[name]:['case',name.toUpperCase().replaceAll('-','_')+'_CASE_IDS'];
 assert(Array.isArray(model[entry[1]]),kind+' model axes');return {[prefix+entry[0]]:model[entry[1]].map(String)};
}
export async function assertComparisonCaseControls(kind,controls){
 const axes=await comparisonCaseAxes(kind),keys=controls.map(s=>{const keys=Object.keys(s.attrs).filter(k=>k.startsWith('data-'));assert.equal(keys.length,1,kind+' control identity');return keys[0];});
 assert.deepEqual([...keys].sort(),Object.keys(axes).sort(),kind+' complete case controls');
 for(const [i,key]of keys.entries())assert.deepEqual(controls[i].options.map(o=>String(o.value)),axes[key].map(String),kind+' '+key+' complete values');
 return axes;
}
export async function exerciseComparisonWidgets(){
 let reads=0,writes=0,network=0;audio=0;const old=new Map(['localStorage','fetch'].map(key=>[key,Object.getOwnPropertyDescriptor(globalThis,key)]));
 Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem(){reads++;throw Error('student read')},setItem(){writes++;throw Error('student write')}}});Object.defineProperty(globalThis,'fetch',{configurable:true,value:()=>{network++;throw Error('network')}});
 try{
const units=[],snapshots=[],skipped=[];
for(const unit of revisedTextbookUnits){
 const book=await load('science-lab/data/book/'+unit+'.book.js'),mod=await revisedClassroom(unit,book),mount=mod.classroomLab?.mount;if(typeof mount!=='function'){skipped.push({unit,kind:mod.classroomLab?.kind||null});continue;}
 const probe=host(),handle=mount(probe,options(()=>{throw Error('unexpected mount record')})),controls=selects(probe.innerHTML).filter(caseControl);await assertComparisonCaseControls(mod.classroomLab.kind,controls);const cases=combinations(controls);handle.dispose();
 for(const controls of cases){
  const h=host();let emitted,calls=0;const mountHandle=mount(h,options((rows,info)=>{calls++;emitted={rows,info}}));assert.equal(calls,0);for(const c of controls)await h.change(c.attrs,c.value);
  const start=normalize(h.innerHTML);
  for(const select of selects(h.innerHTML).filter(s=>!caseControl(s)))await h.change(select.attrs,select.options.find(o=>o.value==='unknown')?.value||select.options[0].value);
  const reveal=[...h.innerHTML.matchAll(/<button([^>]*)>/g)].map(m=>attrs(m[1])).find(a=>Object.entries(a).some(([k,v])=>k.endsWith('-act')&&['reveal','observe'].includes(v)));assert(reveal,unit+' reveal');await h.click(reveal);const shown=normalize(h.innerHTML);await h.click(button(h.innerHTML,'record'));assert.equal(calls,1,unit+' record');assert.equal(mountHandle.rows.length,1);assert.deepEqual(mountHandle.rows,emitted.rows);
  const record=normalize(h.innerHTML),saved=structuredClone(emitted),restoredHost=host();let restoreCalls=0;const restored=mount(restoredHost,{...options(()=>restoreCalls++),rows:emitted.rows});assert.equal(restoreCalls,0);assert.deepEqual(restored.rows,saved.rows);assert.deepEqual(emitted,saved);restored.dispose();mountHandle.dispose();
  snapshots.push({unit,kind:mod.classroomLab.kind,case:controls.map(c=>({data:Object.keys(c.attrs).find(k=>k.startsWith('data-')),value:c.value})),start,shown,record,emitted});
 }
 units.push({unit,kind:mod.classroomLab.kind,cases:cases.length});
}
assert.equal(units.length,31);assert.deepEqual(skipped,[{unit:'s31-u01',kind:null}]);assert.equal(reads+writes+network+audio,0);return {units,skipped,snapshots,reads,writes,network,audio,actualBrowserVerified:false};
 }finally{for(const [key,descriptor]of old)if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key];}
}
