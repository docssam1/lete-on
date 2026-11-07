import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';import assert from 'node:assert/strict';import {pathToFileURL,fileURLToPath} from 'node:url';
const root=path.resolve(fileURLToPath(new URL('../../../',import.meta.url))),load=p=>import(pathToFileURL(root+'/'+p)),{withThink}=await load('science-lab/v2/think-merge.js'),{revisedTextbookUnits}=await load('science-lab/v2/revised-textbook.js'),{BANK}=await load('science-lab/v2/units-index.js'),{curriculumBankHtml}=await load('science-lab/v2/bank-catalog.js');
let reads=0,writes=0,network=0;globalThis.localStorage={getItem(){reads++;throw Error('student read')},setItem(){writes++;throw Error('student write')}};globalThis.fetch=()=>{network++;throw Error('network')};
const src=fs.readFileSync(root+'/science-lab/v2/v2.js','utf8'),start=src.indexOf('const UNITS = ')+14,end=src.indexOf('\n// 문제은행만',start),context=vm.createContext({withThink}),dynamic=async spec=>{const exports=await load(path.posix.normalize('science-lab/v2/'+spec.split('?')[0])),m=new vm.SyntheticModule(Object.keys(exports),function(){for(const[k,v]of Object.entries(exports))this.setExport(k,v)},{context});await m.link(()=>{});await m.evaluate();return m;},loaders=new vm.Script('('+src.slice(start,end).trim().replace(/;$/,'')+')',{importModuleDynamically:dynamic}).runInContext(context),units=[];
const catalog=curriculumBankHtml(BANK);let sourceCount=0,pendingPracticeCount=0;const pending=[];
const printNames={'s41-u04':['biology','biologyBankPaperHtml'],'c22-s42-u01':['sky','skyBankPaperHtml'],'c22-s42-u02':['ecology','ecologyBankPaperHtml'],'c22-s42-u04':['climate','climateBankPaperHtml']};
for(const unit of revisedTextbookUnits){
 const data=await loaders[unit](),b=BANK[unit],source=data.source||[],similar=data.similar||[],items=data.items||[];assert(b);assert.equal(b.n,source.length,unit+' source');assert.equal(b.supplement||0,items.length,unit+' practice');sourceCount+=source.length;
 const total=source.length+similar.length+items.length;
 if(b.lessonSupplement){assert.equal(b.lessonSupplement,items.filter(q=>q.sourceRef?.type==='authored-lesson').length);}
 if(b.paperLabel){const n=Number(b.paperLabel.match(/\d+/)[0]);assert.equal(n,total,unit+' paper label');}
 if(b.sourcePending){assert.equal(b.n,0);assert.deepEqual(b.sets,[]);assert.equal(data.unit.sources.originalExamAvailable,false);assert(!catalog.includes('#/'+unit+'/exam/'));pending.push(unit);pendingPracticeCount+=items.length;}
 let printed=0;
 if(data.bankPaper){for(const mode of unit==='s41-u04'?['student','teacher','answers']:['student','teacher','answers','quick']){
  const html=data.bankPaper({...data,mode}),ids=[...html.matchAll(/(?:data-paper-item|data-question)="([^"]+)"/g)].map(m=>m[1]);
  if(['student','teacher'].includes(mode)){assert.equal(ids.length,total,unit+' '+mode);assert.equal(new Set(ids).size,total);}
  if(printNames[unit]){assert(html.includes('보충'+items.length+' ='+total+'문항.'),unit+' header');assert.equal(data.bankPaper,(await load('science-lab/v2/'+printNames[unit][0]+'-bank-paper.js'))[printNames[unit][1]]);printed++;}
 }}
 units.push({unit,source:source.length,similar:similar.length,practice:items.length,total,catalogSupplement:b.supplement||0,lessonSupplement:b.lessonSupplement||0,paperLabel:b.paperLabel||null,headerModesChecked:printed});
}
assert(catalog.includes('23개 단원의 원문 '+sourceCount+'문항'));assert(catalog.includes('별도로 '+pending.length+'개 단원의 창작 학습 '+pendingPracticeCount+'문항'));assert.equal(reads+writes+network,0);
console.log(JSON.stringify({units,sourceCount,pending,pendingPracticeCount,productionUnitLoadersExecuted:units.length,headerModesChecked:units.reduce((n,u)=>n+u.headerModesChecked,0),studentReads:reads,studentWrites:writes,network,browserVerified:false}));
