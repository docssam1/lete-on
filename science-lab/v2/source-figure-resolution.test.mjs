import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import * as presentation from './source-presentation.js';
import * as content from './source-content.js';
import {photoFigureHtml} from './photo-figure.js';
import {seasonAnswerHint} from './season-answer-hint.js';
import {withThink} from './think-merge.js';
import {teacherKeyHtml} from './daily.js';
import {sourceExamPaperHtml} from './source-exam-paper.js';
import {snapshotDailyPaper,resolveDailyPaper} from './daily-paper-state.js';
const old='assets/bank/c22-s42-u01/moon-s1-q08.webp',hd='assets/bank/c22-s42-u01/moon-s1-q08-hd.webp';
const src=fs.readFileSync(new URL('./v2.js',import.meta.url),'utf8');
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ctx=vm.createContext({esc,CIRC:['①','②','③','④','⑤'],FIG:{},MISC:null,...presentation,...content,photoFigureHtml,seasonAnswerHint,writtenPracticeHtml:()=>''});
const start=src.indexOf('function blanksHtml('),end=src.indexOf('let FIG =',start);
const itemHtml=new vm.Script(src.slice(start,end)+'\nitemHtml').runInContext(ctx);
const daily=fs.readFileSync(new URL('./daily.js',import.meta.url),'utf8');
const dailyFigure=new vm.Script(daily.slice(daily.indexOf('const figHtml ='),daily.indexOf('const givensHtml ='))+'\nfigHtml').runInContext(ctx);
const a=src.indexOf('const UNITS = ')+14,b=src.indexOf('\n// 문제은행만',a);
const loaders=new vm.Script('('+src.slice(a,b).trim().replace(/;$/,'')+')',{importModuleDynamically:s=>import(new URL(s,new URL('./v2.js',import.meta.url)).href)}).runInContext(vm.createContext({withThink}));
test('달 관찰 원문2개의 학습·Daily Test·시험지·통합 문항집은 선명한 사본과 기존 크기를 쓴다',async()=>{
 const data=await loaders['c22-s42-u01'](),list=data.source.filter(q=>q.figure===old),before=JSON.stringify(data.source);
 assert.equal(list.length,2);
 const attrs=presentation.sourceFigureImageAttrs(old);
 for(const [index,html] of [
  ...list.map(q=>itemHtml(q)),...list.map(q=>dailyFigure(q)),
  sourceExamPaperHtml({unit:data.unit.id,set:5,bank:{sourceExcerptOnly:true},title:data.unit.title,list,renderItem:itemHtml}),
  data.bankPaper({...data,mode:'student'}),
  data.bankPaper({...data,mode:'teacher'}),
 ].entries()){assert(html.includes(attrs),'render path '+index);assert(html.includes('srcset="../'+hd+' 1x"'));assert(html.includes('width="359" height="172"'));}
 const student=sourceExamPaperHtml({unit:data.unit.id,set:5,bank:{},title:data.unit.title,list,renderItem:itemHtml});
 const key=teacherKeyHtml({u:data.unit.id,ch:{title:data.unit.title},list,misc:data.misc});assert(!key.includes('<img'));assert(!key.includes('-hd.webp'));
 assert(!student.includes('class="ans"'));assert(!student.includes('<input'));assert.equal(JSON.stringify(data.source),before);
 const state={paper:snapshotDailyPaper(list),answers:Object.fromEntries(list.map(q=>[q.id,'이전 답']))};
 assert.equal(resolveDailyPaper(list,state).readOnly,false);assert(!JSON.stringify(data.source).includes('-hd.webp'));
});
test('선명한 사본과 원래 그림의 해시를 구별하고 다른 그림 경로와 속성 인용을 보존한다',()=>{
 const hash=path=>createHash('sha256').update(fs.readFileSync(new URL('../'+path,import.meta.url))).digest('hex');
 assert.equal(hash(old),'5098fb89bb577b1090ef3c71c76e18c17c4cb777859fb0cf46fe7ec87b4de0ee');
 assert.equal(hash(hd),'aa2555ccce482013f41efa6eb5fd6fe0b36727f86e7d94a75396591b966e2c3f');
 const bytes=fs.readFileSync(new URL('../'+hd,import.meta.url));assert.equal(bytes.toString('ascii',0,4),'RIFF');
 const bank=new URL('../assets/bank/',import.meta.url);
 for(const path of fs.readdirSync(bank,{recursive:true}).filter(p=>/\.(?:webp|png|jpe?g)$/.test(p))){
  const source='assets/bank/'+path;
  if(source!==old)assert.equal(presentation.sourceFigureImageAttrs(source),'src="../'+source+'"');
 }
 for(const value of ['constructor','__proto__','assets/a" onerror="x','assets/a&b.webp'])assert.equal(presentation.sourceFigureImageAttrs(value),'src="../'+esc(value)+'"');
});
