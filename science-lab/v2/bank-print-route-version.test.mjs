import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {withThink} from './think-merge.js';
import {revisedTextbookUnits} from './revised-textbook.js';

const entry=new URL('./v2.js',import.meta.url),source=await readFile(entry,'utf8');
const start=source.indexOf('const UNITS = ')+14,end=source.indexOf('\n// 문제은행만',start);
const expression='('+source.slice(start,end).trim().replace(/;$/,'')+')';
const routes=()=>new vm.Script(expression,{importModuleDynamically:spec=>import(new URL(spec,entry).href)}).runInContext(vm.createContext({withThink}));
const reviewed=[
 ['c22-s51-u03','solution','Solution'],['c22-s42-u03','gas','Gas'],
 ['c22-s51-u01','geology','Geology'],['c22-s51-u02','light','Light'],
 ['c22-s51-u04','body','Body'],['c22-s52-u02','heat','Heat'],
 ['c22-s52-u03','weather','Weather'],['c22-s52-u04','energy','Energy'],
 ['c22-s61-u01','acid','Acid'],['c22-s61-u02','motion','Motion'],
 ['c22-s61-u03','plant-structure','PlantStructure'],
];

test('eleven bank routes explicitly select the reviewed renderer and preparation handler together',async()=>{
 const loaders=routes();
 for(const [unit,file,name]of reviewed){
  const data=await loaders[unit](),paper=await import(`./${file}-bank-paper.js?v=20261108-bank-print-ready`);
  const renderer=name[0].toLowerCase()+name.slice(1)+'BankPaperHtml';
  assert.equal(data.bankPaper,paper[renderer],unit+' current renderer');
  assert.equal(data.wireBankPaper,paper['wire'+name+'BankPaper'],unit+' current preparation');
 }
});

test('all current routes ignore stale inherited print exports without changing their questions or four-mode markup',async()=>{
 const normal=routes(),context=vm.createContext({withThink}),stalePrint=()=> 'stale paper',staleWire=()=>{};
 const modules=new Map();
 const cached=new vm.Script(expression,{importModuleDynamically:async spec=>{
  const url=new URL(spec,entry),actual=await import(url.href);
  if(!url.pathname.includes('/data/units/')||(!actual.bankPaper&&!actual.wireBankPaper))return actual;
  if(!modules.has(spec)){
   const exports={...actual};
   if(exports.bankPaper)exports.bankPaper=stalePrint;
   if(exports.wireBankPaper)exports.wireBankPaper=staleWire;
   const mod=new vm.SyntheticModule(Object.keys(exports),function(){for(const [key,value]of Object.entries(exports))this.setExport(key,value);},{context});
   await mod.link(()=>{});await mod.evaluate();modules.set(spec,mod);
  }
  return modules.get(spec);
 }}).runInContext(context);
 let banks=0,modes=0;
 for(const unit of revisedTextbookUnits){
  const expected=await normal[unit](),current=await cached[unit]();
  for(const key of ['items','source','similar'])assert.equal(JSON.stringify(current[key]),JSON.stringify(expected[key]),unit+' '+key);
  assert.equal(current.bankPaper,expected.bankPaper,unit+' renderer with cached unit');
  assert.equal(current.wireBankPaper,expected.wireBankPaper,unit+' preparation with cached unit');
  if(!current.bankPaper)continue;
  assert.notEqual(current.bankPaper,stalePrint);assert.notEqual(current.wireBankPaper,staleWire);banks++;
  for(const mode of ['student','teacher','answers','quick']){
   assert(current.bankPaper({...current,mode})===expected.bankPaper({...expected,mode}),unit+' '+mode+' unchanged markup');modes++;
  }
 }
 assert.equal(revisedTextbookUnits.size,32);assert.equal(banks,21);assert.equal(modes,84);
});
