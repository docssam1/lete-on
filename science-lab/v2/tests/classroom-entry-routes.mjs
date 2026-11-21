import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import * as textbook from '../revised-textbook.js';
import * as revised from '../revised-lesson.js';
import {withThink} from '../think-merge.js';
import {BANK, READY} from '../units-index.js';
import {curriculumBankHtml} from '../bank-catalog.js';

// Execute production loaders and page functions. DOM rendering is collected;
// this test does not open a browser or read real student storage.
const source=fs.readFileSync(new URL('../v2.js',import.meta.url),'utf8');
const base=new URL('../',import.meta.url);
let rendered='',storageCalls=0,subPages=0;
const forbidden=()=>{storageCalls++;throw Error('Student storage must not be accessed');};
const context=vm.createContext({
 ...textbook,...revised,withThink,BANK:structuredClone(BANK),READY:structuredClone(READY),
 BOOKX:{},$app:{innerHTML:'',querySelectorAll:()=>[]},
 esc:s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),
 placeLabel:()=>'',placeNow:()=>'',scrollTo(){},
 location:{replace:href=>{throw Error('Unexpected redirect '+href);}},
 frame:(_u,_L,_step,html)=>{rendered=html;},
 itemHtml:q=>`<div data-question="${q.id}"></div>`,
 bankLabel:()=>'',groupLabel:(_b,n)=>`세트${n}`,store:{get:forbidden,set:forbidden},
 localStorage:{getItem:forbidden,setItem:forbidden},
});
async function mock(exports){
 const module=new vm.SyntheticModule(Object.keys(exports),function(){
  for(const [key,value]of Object.entries(exports))this.setExport(key,value);
 },{context});
 await module.link(()=>{});await module.evaluate();return module;
}
const countModule=await mock({countNeeds:()=>0});
const modules=new Map();
async function load(spec){
 if(spec.split('?')[0]==='./check.js')return countModule;
 const href=new URL(spec,base).href;
 if(!modules.has(href))modules.set(href,import(href).then(mock));
 return modules.get(href);
}
const section=(from,to)=>source.slice(source.indexOf(from),source.indexOf(to));
const script=[
 section('const UNITS = {','// 문제은행만'),
 section('const RECORDS_BOOKS =','// 교재·수업 화면 위쪽'),
 section('function pageSub(','// 준비물 페이지'),
 section('async function pageStart(','async function pageReading('),
 '({UNITS,pageStart,pageSub})',
].join('\n');
const pages=new vm.Script(script,{filename:fileURLToPath(new URL('../v2.js',import.meta.url)),importModuleDynamically:load}).runInContext(context);
const primaryLink=html=>html.match(/<a class="btn primary" href="([^"]+)"[^>]*>([^<]+)<\/a>/);
const moreLink=html=>html.match(/<p class="start-more"><a href="([^"]+)">([^<]+)<\/a>/);
let first;
for(const unit of textbook.revisedTextbookUnits){
 const data=await pages.UNITS[unit]();
 context.BOOKX=data;
 assert(data.lesson&&data.taxonomy?.elements.length,unit+' production data');
 if(!first)first={unit,data};
 await pages.pageStart(unit,data.lesson);
 const more=moreLink(context.$app.innerHTML);
 assert.equal(more?.[1],`#/${unit}/lab-class/self/1`,unit+' start route');
 assert.equal(more?.[2],'사고력 수업으로 보기');
 for(const element of data.taxonomy.elements){
  pages.pageSub(unit,data.lesson,element.id);
  const primary=primaryLink(rendered);
  assert.equal(primary?.[1],`#/${unit}/lab-class/self/1`,unit+' sub '+element.id);
  assert.equal(primary?.[2],'사고력 수업으로 배우기');
  for(const other of data.taxonomy.elements)assert(rendered.includes(`#/${unit}/sub/${other.id}`));
  subPages++;
 }
}
// Registered current lessons need not retain a legacy engage block.
const {unit,data}=first;context.BOOKX=data;
pages.pageSub(unit,{...data.lesson,engage:undefined},data.taxonomy.elements[0].id);
assert.equal(primaryLink(rendered)?.[1],`#/${unit}/lab-class/self/1`);
for(const flag of ['lesson','bankOnly']){
 const before=context.READY[unit];context.READY[unit]={...before,[flag]:flag==='lesson'?false:true};
 pages.pageSub(unit,data.lesson,data.taxonomy.elements[0].id);
 assert.equal(primaryLink(rendered),null,'unsupported lesson '+flag);
 context.READY[unit]=before;
}
const bankBefore=context.BANK[unit];context.BANK[unit]={...bankBefore,bankOnly:true};
pages.pageSub(unit,data.lesson,data.taxonomy.elements[0].id);assert.equal(primaryLink(rendered),null);
context.BANK[unit]=bankBefore;

// Genuine legacy lessons retain their existing entry point.
const legacyUnit='s42-u02',legacy=await pages.UNITS[legacyUnit]();context.BOOKX=legacy;
pages.pageSub(legacyUnit,legacy.lesson,legacy.taxonomy.elements[0].id);
assert.equal(primaryLink(rendered)?.[1],`#/${legacyUnit}/1`);
assert.equal(primaryLink(rendered)?.[2],'5단계 탐구로 배우기');
await pages.pageStart(legacyUnit,legacy.lesson);
assert.equal(moreLink(context.$app.innerHTML)?.[1],`#/${legacyUnit}/1`);

const catalog=curriculumBankHtml(BANK);
for(const unit of textbook.revisedTextbookUnits){
 assert(catalog.includes(`href="#/${unit}/lab-class/self/1"`),unit+' catalog route');
 assert(catalog.includes(`href="#/${unit}/start"`),unit+' catalog start');
 assert(!catalog.includes(`href="#/${unit}/1"`),unit+' stale catalog entry');
 assert(!catalog.includes(`href="#/${unit}/2/lab"`),unit+' default optional record entry');
 const disabled=curriculumBankHtml({...BANK,[unit]:{...BANK[unit],lesson:false}});
 assert(!disabled.includes(`href="#/${unit}/lab-class/self/1"`));
 const bankOnly=curriculumBankHtml({...BANK,[unit]:{...BANK[unit],bankOnly:true}});
 assert(!bankOnly.includes(`href="#/${unit}/lab-class/self/1"`));
 assert(!bankOnly.includes(`href="#/${unit}/1"`));
}
assert(!curriculumBankHtml({}).includes('/lab-class/'));
assert.equal(storageCalls,0);
console.log(JSON.stringify({currentUnits:textbook.revisedTextbookUnits.size,subPages,catalogUnits:32,legacyRoutesPreserved:true,unsupportedLessonsHidden:true,studentStorageCalls:storageCalls,browserVerified:false}));
