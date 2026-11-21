import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {withThink} from './think-merge.js';
import {revisedTextbookUnits} from './revised-textbook.js';
import {wireWorkbookPrint} from './workbook-print-ready.js?v=20261108-bank-print-ready';

const source=await readFile(new URL('./v2.js',import.meta.url),'utf8'),start=source.indexOf('const UNITS = ')+14,end=source.indexOf('\n// 문제은행만',start);
const loaders=new vm.Script('('+source.slice(start,end).trim().replace(/;$/,'')+')',{importModuleDynamically:s=>import(new URL(s,new URL('./v2.js',import.meta.url)).href)}).runInContext(vm.createContext({withThink}));
const cases=(await Promise.all([...revisedTextbookUnits].map(async unit=>({unit,data:await loaders[unit]()})))).filter(c=>c.data.bankPaper).map(c=>({...c,html:c.data.bankPaper({...c.data,mode:'student'})}));
const defer=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return{promise,resolve,reject};};
const tick=()=>new Promise(resolve=>setImmediate(resolve));
function image(complete=false,naturalWidth=0){const events=new Map();return{complete,naturalWidth,events,addEventListener(type,fn){events.set(type,fn);},removeEventListener(type,fn){if(events.get(type)===fn)events.delete(type);},emit(type){this.complete=true;this.naturalWidth=type==='load'?100:0;events.get(type)?.();}};}
function host(html,images=[]){
 const tag=[...html.matchAll(/<button\b[^>]*>/g)].map(m=>m[0]).find(s=>/data-[\w-]*print\b|onclick="print\(\)"/.test(s)),attribute=tag?.match(/\b(data-[\w-]*print)\b/)?.[1];
 const statusAttribute=html.match(/<p\b[^>]*\b(data-[\w-]*status)\b/)?.[1],events=new Map(),button={disabled:/\bdisabled\b/.test(tag||''),addEventListener(type,fn){events.set(type,fn);},removeEventListener(type,fn){if(events.get(type)===fn)events.delete(type);}},status={textContent:'준비 중'};
 return{isConnected:true,dataset:{},events,button,status,tag,attribute,querySelector(selector){
  if(attribute&&selector==='['+attribute+']')return button;
  if(statusAttribute&&selector==='['+statusAttribute+']')return status;
  if(selector==='.revised-workbook-print'&&html.includes('revised-workbook-print'))return{classList:{contains:name=>name==='revised-workbook-print'}};
  if(selector==='[data-paper-unit]'){const unit=html.match(/data-paper-unit="([^"]+)"/)?.[1];return unit?{dataset:{paperUnit:unit}}:null;}
  return null;
 },querySelectorAll:selector=>selector==='img'?images:[],click(){events.get('click')?.();}};
}
function environment(t){let prints=0;const before=Object.fromEntries(['document','window','scrollTo'].map(key=>[key,Object.getOwnPropertyDescriptor(globalThis,key)]));globalThis.document={fonts:{load:async()=>[{}],ready:Promise.resolve()}};globalThis.window={print:()=>prints++};globalThis.scrollTo=()=>{};t.after(()=>{for(const[key,value]of Object.entries(before)){if(value)Object.defineProperty(globalThis,key,value);else delete globalThis[key];}});return()=>prints;}

test('every current bank paper exposes a disabled print control and a release handler',()=>{
 assert.equal(cases.length,21);
 for(const {unit,data}of cases)for(const mode of ['student','teacher','answers','quick']){
  const html=data.bankPaper({...data,mode}),h=host(html);assert(h.attribute,unit+' '+mode+' print attribute');assert(h.button.disabled,unit+' '+mode+' starts disabled');assert(!/onclick=/.test(h.tag));assert.equal(typeof data.wireBankPaper,'function',unit+' print wiring');assert(!html.includes('AI 실사형 설명 이미지'),unit+' '+mode+' obsolete caption');
 }
});

test('actual bank handlers wait for reading fonts, FontFaceSet and images and ignore stale clicks',async t=>{
 const prints=environment(t);
 for(const {unit,data,html}of cases){
  const reading=defer(),fontSet=defer(),calls=[];document.fonts={load:(font,text)=>{calls.push({font,text});return font.startsWith('400')?reading.promise:Promise.resolve([{}]);},ready:fontSet.promise};
  const late=image(),h=host(html,[image(true,100),late]),close=data.wireBankPaper(h),before=prints();
  assert(calls.some(c=>c.font==='400 12px "Pretendard Variable"'),unit+' normal reading font');assert(calls.some(c=>c.font==='700 12px "Pretendard Variable"'),unit+' bold reading font');assert(calls.every(c=>c.text?.includes('과학')));
  if(unit==='c22-s52-u01'&&!html.includes('revised-workbook-print'))assert(calls.some(c=>c.font.includes('Noto Serif KR')));
  if(html.includes('revised-workbook-print'))assert(!calls.some(c=>c.font.includes('Noto Serif KR')));
  h.click();assert.equal(prints(),before);late.emit('load');await tick();assert(h.button.disabled);
  reading.resolve([{}]);await tick();assert(h.button.disabled);fontSet.resolve();await tick();assert.equal(h.button.disabled,false,unit+' ready');
  h.click();assert.equal(prints(),before+1);const stale=h.events.get('click');h.isConnected=false;h.click();assert.equal(prints(),before+1);close();stale();assert.equal(prints(),before+1);assert(h.button.disabled);assert.equal(h.events.size,0);assert.equal(late.events.size,0);
 }
});

test('closing any bank page removes pending image handlers and blocks delayed callbacks',async t=>{
 const prints=environment(t);
 for(const {unit,data,html}of cases){
  const wait=defer();document.fonts={load:()=>wait.promise,ready:Promise.resolve()};
  const late=image(),h=host(html,[late]),before=prints(),close=data.wireBankPaper(h),loaded=late.events.get('load'),click=h.events.get('click');
  assert(loaded,unit+' pending image');close();assert.equal(late.events.size,0);assert.equal(h.events.size,0);assert(h.button.disabled);
  late.naturalWidth=100;loaded();wait.resolve([{}]);await tick();assert.equal(h.status.textContent,'준비 중');assert(h.button.disabled);h.button.disabled=false;click();assert.equal(prints(),before);
 }
});

test('print readiness waits for page preparation and ignores completion after disposal',async t=>{
 const prints=environment(t),html=cases.find(c=>c.unit==='s41-u04').html;
 for(const failure of [false,true]){
  document.fonts={load:async()=>[{}],ready:Promise.resolve()};const wait=defer(),h=host(html),before=prints();let calls=0;
  const close=wireWorkbookPrint(h,{buttonSelector:'[data-biology-print]',statusSelector:'[data-print-status]',fonts:['400 12px "Pretendard Variable"'],prepare:()=>{calls++;return wait.promise;},scroll:false});
  await tick();assert.equal(calls,1);assert(h.button.disabled);h.click();assert.equal(prints(),before);
  if(failure)wait.reject(Error('fixture layout'));else wait.resolve();await tick();assert.equal(h.button.disabled,failure);if(!failure){h.click();assert.equal(prints(),before+1);}else assert(h.status.textContent.includes('못했어요'));close();
 }
 const wait=defer(),h=host(html);document.fonts={load:async()=>[{}],ready:Promise.resolve()};let called=false;
 const close=wireWorkbookPrint(h,{buttonSelector:'[data-biology-print]',statusSelector:'[data-print-status]',fonts:['400 12px "Pretendard Variable"'],prepare:()=>{called=true;return wait.promise;},scroll:false});await tick();assert(called);close();wait.resolve();await tick();assert(h.button.disabled);assert.equal(h.status.textContent,'준비 중');
});

test('cached or late image errors and missing or rejected fonts keep every bank paper disabled',async t=>{
 const prints=environment(t);
 for(const {unit,data,html}of cases)for(const failure of ['cached-image','late-image','missing-font','rejected-font','font-set']){
  document.fonts={load:async font=>{if(font.startsWith('400')&&failure==='missing-font')return[];if(font.startsWith('400')&&failure==='rejected-font')throw Error('fixture missing font');return[{}];},ready:failure==='font-set'?Promise.reject(Error('fixture font set')):Promise.resolve()};
  const bad=image(failure==='cached-image',0),pending=image(),h=host(html,failure.includes('image')?[bad,pending]:[pending]),before=prints(),close=data.wireBankPaper(h);
  if(failure==='late-image')bad.emit('error');await tick();assert(h.button.disabled,unit+' '+failure);assert(h.status.textContent.includes('못했어요'),unit+' failure status');assert.equal(pending.events.size,0);assert.equal(bad.events.size,0);pending.emit('load');await tick();h.click();assert.equal(prints(),before);close();
 }
});
