import test from'node:test';import assert from'node:assert/strict';import fs from'node:fs';import vm from'node:vm';
import{withThink}from'./think-merge.js';import{revisedTextbookUnits}from'./revised-textbook.js';import{revisedClassroom,classroomQuestions}from'./revised-lesson.js';import{buildSlides}from'./deck.js';import{thinkingCheckQuestion}from'./thinking-check-question.js';
const code=fs.readFileSync(new URL('./v2.js',import.meta.url),'utf8'),a=code.indexOf('const UNITS = ')+14,b=code.indexOf('\n// 문제은행만',a),loaders=new vm.Script('('+code.slice(a,b).trim().replace(/;$/,'')+')',{importModuleDynamically:s=>import(new URL(s,new URL('./v2.js',import.meta.url)).href)}).runInContext(vm.createContext({withThink}));

test('all 32 student and teacher decks show every required question image exactly once, including both bacteria questions',async()=>{
 let decks=0,slides=0,pictures=0;const bacteria=[],geology=[],gas=[];
 for(const unit of revisedTextbookUnits){const data=await loaders[unit](),mod=await revisedClassroom(unit,await import('../data/book/'+unit+'.book.js')),pool=classroomQuestions(mod,[...(data.similar||[]),...(data.items||[])]),before=JSON.stringify({mod,pool});
  for(const mode of ['self','teach']){const deck=buildSlides(mod.chapter,mod.art,mod.plan,pool,mode);decks++;slides+=deck.length;
   for(const slide of deck){if(!slide.item)continue;const q=pool.find(q=>q.id===slide.item);assert(q);const images=q.observationPhotos?.map(p=>p.src)||[q.figure].filter(Boolean);if(!images.length)continue;pictures++;
    const sources=[...slide.body.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map(m=>m[1]);for(const src of images)assert.equal(sources.filter(s=>s==='../'+src).length,1,unit+' '+mode+' '+q.id);
    if(q.id==='c22-s42-u03-b42')gas.push([mode,q.id]);
    if(q.id==='c22-s51-u01-b001')geology.push([mode,q.id]);
    if(['s41-u04-b09','s41-u04-b16'].includes(q.id)){bacteria.push([mode,q.id]);assert(slide.body.indexOf('<img')<slide.body.indexOf('dk-ans'));assert(slide.body.includes(q.figureNote));if(mode==='self')assert(!slide.body.includes('dk-ans rv'));else assert(slide.body.includes('dk-ans rv'));}
   }
  }
  assert.equal(JSON.stringify({mod,pool}),before,unit+' mutated classroom data');
 }
 assert.equal(decks,64);assert.equal(slides,3048);assert.equal(pictures,18);assert.deepEqual(gas,[['self','c22-s42-u03-b42'],['teach','c22-s42-u03-b42']]);assert.deepEqual(geology,[['self','c22-s51-u01-b001'],['teach','c22-s51-u01-b001']]);assert.deepEqual(bacteria,[['self','s41-u04-b09'],['self','s41-u04-b16'],['teach','s41-u04-b09'],['teach','s41-u04-b16']]);
});

test('native source images, HD copies, labeled photos and custom classroom figures keep prompts, tables, keys and response controls',()=>{
 const q={id:'fixture',status:'authored',prompt:'Read the picture & table.',figure:'assets/bank/c22-s42-u01/moon-s1-q08.webp',figureNote:'A picture "with" a caption',givens:{조건:['same place','same time'],기록:{머리:['time','value'],행:[['10:00',3]]}},choices:['one','two'],answerContract:{type:'single-choice',answer:0},explanation:'Explanation.'},before=structuredClone(q);
 for(const teacher of [false,true]){
  const html=thinkingCheckQuestion(q,1,teacher);assert(html.includes('moon-s1-q08.webp'));assert(html.includes('moon-s1-q08-hd.webp'));assert(html.includes('A picture &quot;with&quot; a caption'));assert(html.includes('<ul class="dk-given-list">'));assert(html.includes('<table'));assert.equal((html.match(/<img\b/g)||[]).length,1);assert(html.includes('data-key="0"'));assert.equal(html.includes('dk-ans rv'),teacher);
  const custom=thinkingCheckQuestion(q,1,teacher,{figureHtml:'<figure data-custom="yes">custom</figure>'});assert(custom.includes('data-custom="yes"'));assert(!custom.includes('<img'));const omitted=thinkingCheckQuestion(q,1,teacher,{figureHtml:''});assert(!omitted.includes('<img'));assert(omitted.includes('Read the picture &amp; table.'));
 }
 const labeled=thinkingCheckQuestion({...q,photoLabels:['A','B'],photoCredit:'Photographer'},1,false);assert(labeled.includes('bank-photo-figure'));assert(labeled.includes('Photographer'));
 const cloze={...q,choices:null,givens:{record:q.givens.기록},answerContract:{type:'cloze',blanks:[{answer:'answer'}]}};
 const html=thinkingCheckQuestion(cloze,2,false,{recordKey:'saved-key'});assert(html.includes('<img'));assert(html.includes('<table'));assert(html.includes('data-k="saved-key:blank:0"'));assert(html.includes('class="dk-ans" hidden'));
 const written=thinkingCheckQuestion({...q,choices:null,answerContract:{type:'written-explanation',sample:'Example'}},3,false,{recordKey:'written-key'});assert(written.includes('<img'));assert(written.includes('data-k="written-key"'));assert.deepEqual(q,before);
});
