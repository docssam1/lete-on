import fs from'node:fs';import vm from'node:vm';import assert from'node:assert/strict';
import{buildSlides}from'../deck.js';import{revisedClassroom,classroomQuestions}from'../revised-lesson.js';import*as book from'../../data/book/c22-s62-u02.book.js';import{items}from'../../data/units/c22-s62-u02.js';import{similar}from'../../data/units/c22-s62-u02.similar.js';
// 실제 renderDeck의 교사 이벤트 분기를 실행한다. 브라우저/CSS 검증은 아니다.
const mod=await revisedClassroom('c22-s62-u02',book),data={items,similar},pool=classroomQuestions(mod,[...data.similar,...data.items]),slides=buildSlides(mod.chapter,mod.art,mod.plan,pool,'teach'),source=fs.readFileSync(new URL('../deck.js',import.meta.url),'utf8'),combustion=source.slice(source.indexOf('export function renderDeck('),source.indexOf('// 말로 쓰기:')).replace('export function','function');
const events=new Map(),control=()=>({classList:{add(){},remove(){},toggle(){}},addEventListener(){},setAttribute(){}}),lab={dataset:{mount:'lab'}},stage={isConnected:true,querySelector:s=>s==='[data-mount]'?lab:null,querySelectorAll:()=>[],addEventListener:(t,f)=>events.set(t,f)},controls=new Map();let options,mounts=0;
const app={innerHTML:'',querySelector:s=>{if(s==='.dk-stage')return stage;if(s==='[data-a=battle]')return null;if(!controls.has(s))controls.set(s,control());return controls.get(s);}};
const context=vm.createContext({buildSlides,location:{hash:''},addEventListener(){},removeEventListener(){},console,app,mod,pool,index:slides.findIndex(s=>s.id==='lab')+1,mount:(_host,o)=>{mounts++;options=o;},deckSlideIndex:(_ch,_slides,idx)=>idx-1,esc:s=>String(s),mountLabBattle(){throw Error('물질의 연소 자료 비교를 원래 기록 앱의 배틀로 보내면 안 됩니다.');}});
const stub=new vm.SyntheticModule(['dropGuide'],function(){this.setExport('dropGuide',()=>{});},{context});await stub.link(()=>{});await stub.evaluate();
new vm.Script('let battle=true,notesOn=true,recog=null;const memo={get:()=>""};\n'+combustion+'\nrenderDeck(app,{u:"c22-s62-u02",ch:mod.chapter,art:mod.art,plan:mod.plan,similar:pool,mode:"teach",idx:index,mountLab:mount});',{importModuleDynamically:async spec=>{assert.equal(spec,'./docssam.js');return stub;}}).runInContext(context);
assert.equal(mounts,1);assert.equal(options.personal,false);assert.equal(options.rows.length,0);assert(!app.innerHTML.includes('data-a="battle"'));
events.get('click')({target:{closest:selector=>selector.includes('.combustion-compare')?{}:null}});assert.equal(context.location.hash,'');
events.get('click')({target:{closest:()=>null}});assert.notEqual(context.location.hash,'');
// 실제 학생 renderDeck 분기: 모든 직접 활동은 안내가 끝나도 타이머를 만들지 않는다.
const studentSlides=buildSlides(mod.chapter,mod.art,mod.plan,pool,'self'),direct=studentSlides.filter(s=>s.kind==='activity');
for(const slide of direct){
 const controls=new Map(),stage={isConnected:true,querySelector:()=>null,querySelectorAll:()=>[],addEventListener(){}},app={innerHTML:'',querySelector:s=>{if(s==='.dk-stage')return stage;if(!controls.has(s))controls.set(s,{classList:{add(){},remove(){},toggle(){}},style:{setProperty(){}},addEventListener(){},setAttribute(){}});return controls.get(s);}};
 let speech=0;
 const guide={alive:true,paused:false,reset(){},say(value){speech++;assert.equal(value.text,mod.chapter.slideCues[slide.id]);return Promise.resolve();}};
 const ctx=vm.createContext({buildSlides,deckSlideIndex:(_ch,_slides,idx)=>idx-1,app,mod,pool,index:studentSlides.indexOf(slide)+1,location:{hash:''},addEventListener(){},removeEventListener(){},esc:s=>String(s),guideFor:()=>Promise.resolve({V:{slides:{}},guide}),wireMoods(){},judgeTable:()=>({}),performance:{now:()=>0},setTimeout(){throw Error('실제 활동에서 자동 넘김 타이머를 만들면 안 됩니다.');},clearTimeout(){},console});
 new vm.Script('let battle=false,notesOn=false,recog=null,guideAvoid=null;const memo={get:()=>""};\n'+combustion+'\nrenderDeck(app,{u:"c22-s62-u02",ch:mod.chapter,art:mod.art,plan:mod.plan,similar:pool,mode:"self",idx:index});').runInContext(ctx);
 await Promise.resolve();await Promise.resolve();assert.equal(speech,1);assert.equal(ctx.location.hash,'');
 guide.onPause(true);guide.paused=false;guide.onPause(false);assert.equal(ctx.location.hash,'');
 controls.get('[data-a=next]').onclick();assert.equal(ctx.location.hash,`#/c22-s62-u02/lab-class/self/${studentSlides.indexOf(slide)+2}`);
}
console.log(JSON.stringify({teacherMounts:1,teacherPersonal:false,staleLegacyBattleIgnored:true,comparisonClickDoesNotAdvance:true,outsideClickAdvances:true,manualActivities:direct.length,noTimerOnActivity:true,explicitNextWorks:true,browserVerified:false}));
