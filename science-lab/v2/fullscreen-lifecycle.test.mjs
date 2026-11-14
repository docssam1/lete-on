import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
const source=fs.readFileSync(new URL('./mounts.js',import.meta.url),'utf8'),begin=source.includes('const landscapeOwners =')?source.indexOf('const landscapeOwners ='):source.indexOf('export function addLandscape('),end=source.indexOf('\nconst REDUCED',begin),body=source.slice(begin,end).replace('export function','function');
const deferred=()=>{let resolve,reject;const promise=new Promise((yes,no)=>{resolve=yes;reject=no;});return{promise,resolve,reject};};
function fixture(){
 const watched=[],pending=[],exits=[],focus=[];let nativeElement=null;
 class Element{
  constructor(tag='div'){this.tag=tag;this.childNodes=[];this.parentNode=null;this.events=new Map();this.attributes={};this.className='';this.onclick=null;this.isRoot=false;}
  get isConnected(){return this.isRoot||!!this.parentNode?.isConnected;}
  get classList(){const element=this;return{contains:word=>element.className.split(/\s+/).includes(word),add(...words){element.className=[...new Set([...element.className.split(/\s+/).filter(Boolean),...words])].join(' ');},remove(...words){element.className=element.className.split(/\s+/).filter(w=>!words.includes(w)).join(' ');},toggle(word,on){const has=this.contains(word),next=on===undefined?!has:on;next?this.add(word):this.remove(word);return next;}};}
  appendChild(node){node.remove();this.childNodes.push(node);node.parentNode=this;return node;}
  append(...nodes){nodes.forEach(n=>this.appendChild(n));}
  prepend(node){node.remove();this.childNodes.unshift(node);node.parentNode=this;}
  insertBefore(node,before){node.remove();const i=this.childNodes.indexOf(before);assert(i>=0);this.childNodes.splice(i,0,node);node.parentNode=this;}
  remove(){if(this.parentNode){const a=this.parentNode.childNodes;a.splice(a.indexOf(this),1);this.parentNode=null;}}
  setAttribute(k,v){this.attributes[k]=String(v);}
  focus(){focus.push(this);}
  querySelector(selector){const match=node=>selector.startsWith('.')?node.classList.contains(selector.slice(1)):node.tag===selector;for(const child of this.childNodes){if(match(child))return child;const found=child.querySelector(selector);if(found)return found;}return null;}
  addEventListener(type,fn){if(!this.events.has(type))this.events.set(type,new Set());this.events.get(type).add(fn);}
  removeEventListener(type,fn){this.events.get(type)?.delete(fn);}
  dispatchEvent(event){for(const fn of [...this.events.get(event.type)||[]])fn(event);return true;}
 }
 const root=new Element('body');root.isRoot=true;const document=new Element('document');document.body=root;document.documentElement=new Element('html');document.createElement=tag=>new Element(tag);document.createComment=()=>new Element('#comment');document.querySelector=selector=>root.querySelector(selector);Object.defineProperty(document,'fullscreenElement',{get:()=>nativeElement});document.exitFullscreen=()=>{exits.push(nativeElement);nativeElement=null;document.dispatchEvent({type:'fullscreenchange'});return Promise.resolve();};
 const watchDetached=(node,cleanup)=>{let done=false;const release=()=>{if(!done){done=true;cleanup();}};watched.push({node,release});if(!node.isConnected)release();return release;};
 const context=vm.createContext({document,watchDetached,Event:class{constructor(type){this.type=type;}}}),mount=new vm.Script(body+'\naddLandscape').runInContext(context);
 function make({api=true}={}){
  const host=new Element(),view=new Element(),canvas=new Element('canvas'),text=new Element('p'),controls=new Element();view.append(canvas);host.append(view,text,controls);root.append(host);let moved=0;canvas.addEventListener('stage:moved',()=>moved++);
  if(api)host.requestFullscreen=()=>{const gate=deferred();pending.push({host,...gate});return gate.promise;};
  const dispose=mount(host,controls);return{host,view,canvas,text,controls,dispose,get moved(){return moved;},get open(){return controls.querySelector('.fl-open')||host.querySelector('.fl-open');},get close(){return host.querySelector('.fl-close');}};
 }
 return{make,remount:(host,into)=>mount(host,into),pending,exits,focus,document,root,flush(){for(const w of watched)if(!w.node.isConnected)w.release();},native(host){nativeElement=host;document.dispatchEvent({type:'fullscreenchange'});},settle(index,{native=true,reject=false}={}){const p=pending[index];if(reject)p.reject(Error('fullscreen unavailable'));else{if(native)this.native(p.host);p.resolve();}},listeners(){return document.events.get('fullscreenchange')?.size||0;}};
}
test('전체화면 해제는 캔버스·조작판 순서를 복구하고 이벤트와 단추를 남기지 않는다',async()=>{
 const f=fixture(),a=f.make({api:false}),original=a.host.childNodes.slice(0,3);const enter=a.open.onclick;await enter();assert(a.host.classList.contains('full-land'));assert.equal(a.canvas.parentNode,a.host);assert.equal(a.moved,1);a.host.querySelector('.fl-fold').onclick();assert.equal(a.host.querySelector('.fl-fold').attributes['aria-expanded'],'false');a.close.onclick();assert.deepEqual(a.host.childNodes.slice(0,3),original);assert.equal(a.canvas.parentNode,a.view);assert.equal(a.moved,2);assert(!f.document.documentElement.classList.contains('fl-lock'));assert.equal(typeof a.dispose,'function');a.dispose();a.dispose();assert.equal(f.listeners(),0);assert.equal(a.host.events.get('keydown')?.size||0,0);assert.equal(a.open,null);await enter();assert.equal(a.host.querySelector('.fl-panel'),null);
});
test('요청 중 화면을 떠나면 늦게 열린 자기 전체화면만 닫고 분리된 단추로 초점을 옮기지 않는다',async()=>{
 const f=fixture(),a=f.make(),button=a.open,pending=button.onclick();a.host.remove();f.flush();assert.equal(f.listeners(),0);const focused=f.focus.length;f.settle(0);await pending;assert.equal(f.exits.length,1);assert.equal(f.exits[0],a.host);assert.equal(f.document.fullscreenElement,null);assert.equal(f.focus.length,focused);assert(!a.host.classList.contains('full-land'));
});
test('오래된 요청의 완료와 정리는 새 전체화면의 잠금·네이티브 화면을 닫지 않는다',async()=>{
 const f=fixture(),a=f.make(),first=a.open.onclick();a.close.onclick();const b=f.make(),second=b.open.onclick();f.settle(1);await second;const before=f.exits.length;a.host.remove();f.flush();f.settle(0,{native:false});await first;assert.equal(f.document.fullscreenElement,b.host);assert.equal(f.exits.length,before);assert(f.document.documentElement.classList.contains('fl-lock'));b.dispose();assert.equal(f.listeners(),0);
});
test('같은 화면을 닫고 다시 열었을 때 옛 요청이 새 세션을 닫지 않는다',async()=>{
 const f=fixture(),a=f.make(),first=a.open.onclick();a.close.onclick();const second=a.open.onclick();f.settle(1);await second;f.settle(0,{native:false});await first;assert.equal(f.exits.length,0);assert(a.host.classList.contains('full-land'));assert.equal(f.document.fullscreenElement,a.host);a.dispose();assert.equal(f.exits.length,1);
});
test('API 거절·없는 기기와 외부 Escape에서도 겹침 화면을 닫고 반복 생성해도 이벤트가 쌓이지 않는다',async()=>{
 const f=fixture(),a=f.make(),pending=a.open.onclick();f.settle(0,{reject:true});await pending;assert(a.host.classList.contains('full-land'));a.host.dispatchEvent({type:'keydown',key:'Escape'});assert(!a.host.classList.contains('full-land'));a.host.remove();f.flush();assert.equal(f.listeners(),0);
 for(let i=0;i<20;i++){const b=f.make({api:false});await b.open.onclick();b.host.remove();f.flush();assert.equal(f.listeners(),0);assert.equal(b.host.events.get('keydown')?.size||0,0);}
 const c=f.make(),last=c.open.onclick();f.settle(1);await last;f.native(null);assert(!c.host.classList.contains('full-land'));c.dispose();assert.equal(f.listeners(),0);
});

test('취소한 옛 요청이 뒤늦게 네이티브 화면을 차지해도 새 화면은 겹침 모드로 남는다',async()=>{
 const f=fixture(),a=f.make(),old=a.open.onclick();a.close.onclick();const b=f.make(),current=b.open.onclick();f.settle(1);await current;a.host.remove();f.flush();f.settle(0);await old;assert.equal(f.document.fullscreenElement,null);assert(b.host.classList.contains('full-land'));assert(f.document.documentElement.classList.contains('fl-lock'));assert.equal(f.exits.at(-1),a.host);b.dispose();assert.equal(f.listeners(),0);
});

test('같은 host의 내용을 바꾸고 다시 붙여도 이전 조작판을 되살리거나 새 전체화면을 닫지 않는다',async()=>{
 const f=fixture(),a=f.make(),old=a.open.onclick(),oldPanel=a.host.querySelector('.fl-panel');
 for(const node of [...a.host.childNodes])node.remove();
 const view=f.document.createElement('div'),canvas=f.document.createElement('canvas'),controls=f.document.createElement('div');view.append(canvas);a.host.append(view,controls);
 const dispose=f.remount(a.host,controls);assert.equal(f.listeners(),1);assert(!a.host.classList.contains('full-land'));assert.equal(a.host.childNodes.length,3);assert.equal(a.text.parentNode,oldPanel);
 const current=controls.querySelector('.fl-open').onclick();f.settle(1);await current;f.settle(0);await old;f.flush();assert(a.host.classList.contains('full-land'));assert.equal(f.document.fullscreenElement,a.host);assert.equal(f.exits.length,0);assert.equal(f.listeners(),1);assert.equal(a.text.parentNode,oldPanel);dispose();assert.equal(f.listeners(),0);assert.equal(canvas.parentNode,view);
});
