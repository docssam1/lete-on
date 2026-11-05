import test from'node:test';import assert from'node:assert/strict';
import{wireWorkbookPrint}from'./workbook-print-ready.js?v=20261104-earth-motion-book';import{revisedTextbookPaper,revisedTextbookUnits}from'./revised-textbook.js';
const defer=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return{promise,resolve,reject};},tick=()=>new Promise(resolve=>setImmediate(resolve));
function image(complete=false,naturalWidth=0){const events=new Map();return{complete,naturalWidth,events,addEventListener:(type,fn)=>events.set(type,fn),removeEventListener:(type,fn)=>{if(events.get(type)===fn)events.delete(type);},emit(type){this.complete=true;this.naturalWidth=type==='load'?100:0;events.get(type)?.();}};}
function host(images=[]){const events=new Map(),button={disabled:false,addEventListener:(type,fn)=>events.set(type,fn),removeEventListener:(type,fn)=>{if(events.get(type)===fn)events.delete(type);}},status={textContent:'준비 중'};return{isConnected:true,events,button,status,querySelector:s=>s==='[data-workbook-print]'?button:status,querySelectorAll:()=>images,click:()=>events.get('click')?.()};}
function environment(t,fonts){let prints=0;const old=Object.fromEntries(['document','window','scrollTo'].map(key=>[key,Object.getOwnPropertyDescriptor(globalThis,key)]));globalThis.document={fonts};globalThis.window={print:()=>prints++};globalThis.scrollTo=()=>{};t.after(()=>{for(const[key,descriptor]of Object.entries(old)){if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key];}});return()=>prints;}
const fonts=()=>({load:async()=>[{}],ready:Promise.resolve()});
test('그림·본문의 두 굵기·손글씨체와 글꼴 준비가 모두 끝난 뒤에만 인쇄한다',async t=>{
 const normal=defer(),fontSet=defer(),calls=[],prints=environment(t,{load:(font,text)=>{calls.push({font,text});return font.startsWith('400')?normal.promise:Promise.resolve([{}]);},ready:fontSet.promise}),cached=image(true,100),late=image(),h=host([cached,late]),dispose=wireWorkbookPrint(h);
 assert.equal(h.button.disabled,true);assert.equal(calls.length,3);assert(calls.every(x=>x.text.includes('과학')));assert(calls.some(x=>x.font==='400 12px Pretendard'));assert(calls.some(x=>x.font==='700 12px Pretendard'));assert(calls.some(x=>x.font==='700 18px Gaegu'));h.click();assert.equal(prints(),0);
 late.emit('load');await tick();assert.equal(h.button.disabled,true);normal.resolve([{}]);await tick();assert.equal(h.button.disabled,true);fontSet.resolve();await tick();assert.equal(h.button.disabled,false);assert.equal(late.events.size,0);assert.equal(h.status.textContent,'그림과 글꼴이 준비되었어요.');h.click();assert.equal(prints(),1);h.isConnected=false;h.click();assert.equal(prints(),1);dispose();assert.equal(h.events.size,0);
});
test('이미 캐시된 깨진 그림과 늦게 실패한 그림 모두 인쇄를 막고 대기 이벤트를 정리한다',async t=>{
 const prints=environment(t,fonts());
 for(const cached of[true,false]){const broken=image(cached,0),pending=image(),h=host([broken,pending]),dispose=wireWorkbookPrint(h);if(!cached)broken.emit('error');await tick();assert.equal(h.button.disabled,true);assert(h.status.textContent.includes('그림 또는 글꼴'));assert.equal(broken.events.size,0);assert.equal(pending.events.size,0);pending.emit('load');await tick();h.click();assert.equal(prints(),0);dispose();}
});
test('본문 글꼴 요청이 실패하거나 선언된 글꼴이 없으면 대체 글꼴로 인쇄하지 않는다',async t=>{
 const config=fonts(),prints=environment(t,config);
 for(const missing of[true,false]){config.load=async font=>{if(font.startsWith('400')){if(missing)return[];throw Error('offline font missing');}return[{}];};const im=image(),h=host([im]),dispose=wireWorkbookPrint(h);await tick();assert.equal(h.button.disabled,true);assert(h.status.textContent.includes('교재를 다시 열어'));assert.equal(im.events.size,0);h.click();assert.equal(prints(),0);dispose();}
});
test('교재를 닫은 뒤 늦게 끝난 준비와 이전 단추 콜백은 화면·인쇄를 바꾸지 않는다',async t=>{
 const wait=defer(),prints=environment(t,{load:()=>wait.promise,ready:Promise.resolve()}),im=image(true,100),h=host([im]),dispose=wireWorkbookPrint(h),oldClick=h.events.get('click');dispose();assert.equal(im.events.size,0);assert.equal(h.button.disabled,true);wait.resolve([{}]);im.emit('load');await tick();assert.equal(h.status.textContent,'준비 중');oldClick();assert.equal(prints(),0);assert.equal(h.events.size,0);
 const late=image(),other=host([late]),close=wireWorkbookPrint(other),loaded=late.events.get('load');close();late.naturalWidth=100;loaded();await tick();assert.equal(other.button.disabled,true);assert.equal(other.status.textContent,'준비 중');assert.equal(late.events.size,0);
});
test('교재 두 개의 인쇄 준비와 해제는 서로 영향을 주지 않는다',async t=>{
 const prints=environment(t,fonts()),a=host([image(true,100)]),im=image(),b=host([im]),first=wireWorkbookPrint(a),second=wireWorkbookPrint(b);await tick();assert.equal(a.button.disabled,false);assert.equal(b.button.disabled,true);first();im.emit('load');await tick();assert.equal(a.button.disabled,true);assert.equal(b.button.disabled,false);b.click();assert.equal(prints(),1);second();
});
test('감염병 교재는 인쇄 명조 두 굵기까지 기다리며 누락 시 인쇄를 막는다',async t=>{
 const serif=defer(),calls=[],config={load:font=>{calls.push(font);return font.includes('Noto Serif KR')?serif.promise:Promise.resolve([{}]);},ready:Promise.resolve()},prints=environment(t,config),h=host();
 const original=h.querySelector;h.querySelector=s=>s==='[data-paper-unit]'?{dataset:{paperUnit:'c22-s32-u04'}}:original(s);
 const dispose=wireWorkbookPrint(h);await tick();assert.equal(calls.length,5);assert(calls.includes('400 12px "Noto Serif KR"'));assert(calls.includes('700 12px "Noto Serif KR"'));assert.equal(h.button.disabled,true);h.click();assert.equal(prints(),0);
 serif.resolve([{}]);await tick();assert.equal(h.button.disabled,false);dispose();
 config.load=async font=>font==='700 12px "Noto Serif KR"'?[]:[{}];const missing=host();missing.dataset={paperUnit:'c22-s32-u04'};const close=wireWorkbookPrint(missing);await tick();assert.equal(missing.button.disabled,true);assert(missing.status.textContent.includes('교재를 다시 열어'));missing.click();assert.equal(prints(),0);close();
});
test('검수한 교재들의 실제 인쇄 경로가 같은 준비 처리 함수를 사용한다',async()=>{
 for(const unit of revisedTextbookUnits){const paper=await revisedTextbookPaper(unit);assert.equal(paper.wireWorkbookPaper,wireWorkbookPrint);for(const mode of['student','teacher','answers','quick'])assert(paper.workbookPaper({mode}).includes('data-workbook-print disabled'));}
});
test('기후 교재도 인쇄 명조가 누락되면 인쇄를 시작하지 않는다',async t=>{
 const wait=defer(),calls=[],prints=environment(t,{load:font=>{calls.push(font);return font.includes('Noto Serif KR')?wait.promise:Promise.resolve([{}]);},ready:Promise.resolve()}),h=host();h.dataset={paperUnit:'c22-s42-u04'};const close=wireWorkbookPrint(h);await tick();assert.equal(calls.length,5);assert.equal(h.button.disabled,true);wait.resolve([]);await tick();assert.equal(h.button.disabled,true);assert(h.status.textContent.includes('교재를 다시 열어'));h.click();assert.equal(prints(),0);close();
});

test('물의 상태 변화도 명조가 모두 준비되어야 인쇄한다',async t=>{
 const wait=defer(),calls=[],prints=environment(t,{load:font=>{calls.push(font);return font.includes('Noto Serif KR')?wait.promise:Promise.resolve([{}]);},ready:Promise.resolve()}),h=host();h.dataset={paperUnit:'s41-u02'};const close=wireWorkbookPrint(h);await tick();assert.equal(calls.length,5);assert.equal(h.button.disabled,true);h.click();assert.equal(prints(),0);wait.resolve([{}]);await tick();assert.equal(h.button.disabled,false);h.click();assert.equal(prints(),1);close();
});

test('땅의 변화도 인쇄 명조가 누락되면 인쇄를 막는다',async t=>{
 const wait=defer(),calls=[],prints=environment(t,{load:font=>{calls.push(font);return font.includes('Noto Serif KR')?wait.promise:Promise.resolve([{}]);},ready:Promise.resolve()}),h=host();h.dataset={paperUnit:'s41-u03'};const close=wireWorkbookPrint(h);await tick();assert.equal(calls.length,5);h.click();assert.equal(prints(),0);wait.resolve([]);await tick();assert.equal(h.button.disabled,true);assert(h.status.textContent.includes('교재를 다시 열어'));close();
});

test('다양한 생물도 인쇄 명조가 누락되면 인쇄를 막는다',async t=>{
 const wait=defer(),calls=[],prints=environment(t,{load:font=>{calls.push(font);return font.includes('Noto Serif KR')?wait.promise:Promise.resolve([{}]);},ready:Promise.resolve()}),h=host();h.dataset={paperUnit:'s41-u04'};const close=wireWorkbookPrint(h);await tick();assert.equal(calls.length,5);h.click();assert.equal(prints(),0);wait.resolve([]);await tick();assert.equal(h.button.disabled,true);assert(h.status.textContent.includes('교재를 다시 열어'));close();
});

for(const [unit,title]of[['c22-s42-u03','기체'],['c22-s51-u01','지층'],['c22-s51-u02','빛'],['c22-s51-u04','우리 몸'],['c22-s52-u01','혼합물'],['c22-s52-u02','열'],['c22-s52-u03','날씨'],['c22-s52-u04','자원'],['c22-s61-u01','산과 염기'],['c22-s61-u02','운동'],['c22-s61-u03','식물 구조'],['c22-s61-u04','지구 운동']])test(`${title}도 명조 준비를 기다리고 누락 시 인쇄를 막는다`,async t=>{
 const wait=defer(),calls=[],config={load:font=>{calls.push(font);return font.includes('Noto Serif KR')?wait.promise:Promise.resolve([{}]);},ready:Promise.resolve()},prints=environment(t,config),h=host();h.dataset={paperUnit:unit};const close=wireWorkbookPrint(h);await tick();assert.equal(calls.length,5);assert.equal(h.button.disabled,true);h.click();assert.equal(prints(),0);wait.resolve([{}]);await tick();assert.equal(h.button.disabled,false);h.click();assert.equal(prints(),1);close();
 config.load=async font=>font==='700 12px "Noto Serif KR"'?[]:[{}];const missing=host();missing.dataset={paperUnit:unit};const dispose=wireWorkbookPrint(missing);await tick();assert.equal(missing.button.disabled,true);missing.click();assert.equal(prints(),1);dispose();
});
