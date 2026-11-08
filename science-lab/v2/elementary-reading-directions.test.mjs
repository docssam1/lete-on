import test from 'node:test';
import assert from 'node:assert/strict';
import {withElementaryReadingDirections,ELEMENTARY_DIRECTIONS,ELEMENTARY_DIRECTIONS_UNITS} from '../data/book/elementary-reading-directions.js';
import {revisedTextbook,revisedTextbookPaper,revisedTextbookUnits} from './revised-textbook.js';
import {makeWorkbookPaper} from './revised-workbook-paper.js';

test('reviewed student directions preserve all 3080 questions, answer books, rails, figures and writing space',async()=>{
 let units=0,pages=0,fields=0,questions=0;
 const seen={};
 function compare(before,after,path,unit){
  if(before===after)return;
  if(typeof before==='string'&&typeof after==='string'){
   assert.match(path,/^(pages|teacherStudentPages)\/\d+\/(title|lead|blocks\/)/);
   assert.equal(after,ELEMENTARY_DIRECTIONS[unit]?.[before],unit+' '+path);
   if(path.startsWith('pages/')){fields++;(seen[unit]??=new Set()).add(before);}
   return;
  }
  assert(before&&after&&typeof before==='object'&&typeof after==='object',unit+' '+path);
  assert.deepEqual(Object.keys(after),Object.keys(before),unit+' '+path+' keys');
  for(const key of Object.keys(before))compare(before[key],after[key],path?path+'/'+key:key,unit);
 }
 for(const unit of revisedTextbookUnits){
  const {workbook:before}=await import(`../data/book/${unit}.workbook.js`),saved=structuredClone(before),after=withElementaryReadingDirections(before);
  questions+=before.questions.length;compare(before,after,'',unit);
  assert.deepEqual(before,saved);assert.equal(withElementaryReadingDirections(after),after);
  for(const key of ['questions','teacherPages','quickPages','figures'])assert.equal(after[key],before[key]);
  if(after!==before)units++;
  for(const key of ['pages','teacherStudentPages'])for(let i=0;i<(before[key]||[]).length;i++){
   const old=before[key][i],current=after[key][i];assert.equal(current.rail,old.rail);
   if(key==='pages'&&old!==current)pages++;
   const writing=p=>(p.blocks||[]).filter(b=>b.type==='field').map(b=>[b.lines,b.draw]);
   assert.deepEqual(writing(current),writing(old));
  }
 }
 assert.deepEqual({units,pages,fields,questions},{units:13,pages:31,fields:70,questions:3080});
 for(const unit of ELEMENTARY_DIRECTIONS_UNITS)assert.deepEqual([...seen[unit]].sort(),Object.keys(ELEMENTARY_DIRECTIONS[unit]).sort());
});

test('actual web and all 128 print modes use the same reviewed directions and keep answers unchanged',async()=>{
 for(const unit of revisedTextbookUnits){
  const {workbook:before}=await import(`../data/book/${unit}.workbook.js`),{art}=await import(`../data/book/${unit}.workbook-art.js`);
  const expected=withElementaryReadingDirections(before),web=await revisedTextbook(unit,{chapter:{unit},art:{}}),paper=await revisedTextbookPaper(unit);
  assert.deepEqual(web.workbook,expected);assert.equal(web.chapter.pages,web.workbook.pages);assert.equal(web.chapter.questions,web.workbook.questions);assert.deepEqual(web.chapter.questions,before.questions);
  const currentPaper=makeWorkbookPaper(expected,art),previousPaper=makeWorkbookPaper(before,art);
  for(const mode of ['student','teacher','answers','quick']){
   const html=paper.workbookPaper({mode});assert.equal(html,currentPaper.workbookPaper({mode}),unit+' '+mode);
   if(['answers','quick'].includes(mode)||!ELEMENTARY_DIRECTIONS_UNITS.includes(unit))assert.equal(html,previousPaper.workbookPaper({mode}));
   if(mode==='student')assert(!/class="ed-key"|class="ed-solution"/.test(html));
  }
 }
});

test('unsupported units, future wording, questions and figures retain their own text and identity',()=>{
 for(const unit of ['legacy','other','__proto__','constructor','toString']){const wb={unit};assert.equal(withElementaryReadingDirections(wb),wb);}
 const text='판단 한정',opaque=['questions','solutions','diagram','gallery'].map(type=>({type,text,ids:[text],key:text}));
 const untouched={kind:'learn',title:'a future heading',blocks:[{type:'text',text:'a future explanation'},...opaque],rail:[{title:text,text}]};
 const wb={unit:'s31-u03',pages:[untouched],teacherStudentPages:[untouched],questions:[{prompt:text,answer:text}],teacherPages:[],quickPages:[]};
 assert.equal(withElementaryReadingDirections(wb),wb);
 const other={...untouched,blocks:[{type:'heading',text},...opaque]},edited=withElementaryReadingDirections({...wb,pages:[other]});
 assert.equal(edited.pages[0].blocks[0].text,'사진에서 알 수 있는 것');
 assert.equal(edited.pages[0].rail,other.rail);assert.equal(edited.questions,wb.questions);
 for(let i=1;i<other.blocks.length;i++)assert.equal(edited.pages[0].blocks[i],other.blocks[i]);
});
