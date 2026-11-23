import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const code=readFileSync(new URL('./membership-gate.js',import.meta.url),'utf8');
const defer=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return {promise,resolve,reject};};
const tick=()=>new Promise(resolve=>setImmediate(resolve));
function harness(count=3,early=0,delivery={}){
 const auth=defer(),prepare=defer(),scripts=[],events=[],timers=new Map(),classes=new Set(['member-checking']);let next=0;
 const node=tag=>({tag,children:[],textContent:'',removed:false,append(...x){this.children.push(...x);},appendChild(x){this.children.push(x);},replaceChildren(){this.children=[];},remove(){this.removed=true;},setAttribute(){}});
 const box=node('status'),name={value:''},menu=node('menu');
 const placeholders=Array.from({length:count},(_,i)=>({dataset:{memberSrc:`part-${i}.js`,...(i<early?{parentBoot:''}:{})}}));
 const document={hidden:false,documentElement:{dataset:delivery,classList:{add:x=>classes.add(x),remove:x=>classes.delete(x)}},getElementById:id=>id==='memberGateStatus'?box:name,querySelector:()=>menu,querySelectorAll:selector=>selector.startsWith('link')?[]:placeholders,createElement:node,addEventListener(){},body:{appendChild(s){scripts.push(s);events.push(`request:${s.src}`);}}};
 const location={search:'',replace:x=>events.push('redirect:'+x),reload:()=>events.push('reload')};
 const window={PlannerStorage:{getItem:()=>null},RoadmapParentBoot:{mount:args=>{events.push('compact-entry');window.bootOptions=args;}},RoadmapCloud:{prepare:()=>{events.push('prepare');return prepare.promise;},mount:()=>events.push('mount')},addEventListener(){}};
 const result=vm.runInNewContext(code,{document,window,location,RoadmapMembership:{status:()=>auth.promise},setTimeout:(f,ms)=>{const id=++next;timers.set(id,{f,ms});return id;},clearTimeout:id=>timers.delete(id)});
 return {auth,prepare,scripts,events,timers,box,classes,result,window,location};
}
async function start(h){h.auth.resolve({user_id:'synthetic',student_name:'테스트'});await tick();h.prepare.resolve();await tick();}
test('authentication and storage must finish before any downloads; all 114 requests are then appended together',async()=>{
 const h=harness(114);assert.equal(h.scripts.length,0);h.auth.resolve({user_id:'test'});await tick();assert.deepEqual(h.events,['prepare']);h.prepare.resolve();await tick();assert.equal(h.scripts.length,114);assert.equal(h.events.includes('mount'),false);
 for(let i=0;i<114;i++){const s=h.scripts[i];assert.equal(s.src,`part-${i}.js`);assert.equal(s.async,false);s.onload();}
 await h.result;assert.equal(h.events.at(-1),'mount');assert.equal(h.classes.has('member-checking'),false);assert.equal(h.timers.size,0);
});
test('out-of-order network arrivals retain execution order with ordered classic-script browser semantics',async()=>{
 const h=harness();await start(h);const ready=new Set(),executed=[];let cursor=0;
 const arrival=i=>{ready.add(i);while(ready.has(cursor)){const s=h.scripts[cursor];assert.equal(s.async,false);executed.push(cursor++);s.onload();}};
 arrival(2);arrival(1);assert.deepEqual(executed,[]);assert.equal(h.events.includes('mount'),false);arrival(0);await h.result;assert.deepEqual(executed,[0,1,2]);
});
test('one delayed script keeps gate closed until it executes',async()=>{
 const h=harness();await start(h);h.scripts[0].onload();h.scripts[1].onload();await tick();assert.equal(h.classes.has('member-checking'),true);assert.equal(h.events.includes('mount'),false);assert.match(h.box.textContent,/2\/3/);h.scripts[2].onload();await h.result;assert.equal(h.classes.has('member-checking'),false);
});
test('per-file timeout cancels pending loads, keeps gate closed, and offers full-page retry',async()=>{
 const h=harness();await start(h);assert.ok([...h.timers.values()].every(t=>t.ms===30000));h.scripts[0].onload();[...h.timers.values()][0].f();await h.result;
 assert.equal(h.classes.has('member-checking'),true);assert.equal(h.events.includes('mount'),false);assert.match(h.box.children.map(x=>x.textContent).join(' '),/응답 시간이 초과.*part-1.js/);assert.equal(h.timers.size,0);assert.equal(h.scripts[2].removed,true);h.box.children.find(x=>x.tag==='button').onclick();assert.equal(h.events.at(-1),'reload');
});
test('download failure never mounts or opens protected UI',async()=>{
 const h=harness();await start(h);h.scripts[1].onerror();await h.result;assert.equal(h.classes.has('member-checking'),true);assert.equal(h.events.includes('mount'),false);assert.match(h.box.children.map(x=>x.textContent).join(' '),/part-1.js/);
});
test('no session redirects without fetching or preparing storage',async()=>{
 const h=harness();h.auth.resolve(null);await h.result;assert.equal(h.scripts.length,0);assert.equal(h.window.RoadmapMember,undefined);assert.match(h.events[0],/^redirect:/);assert.equal(h.classes.has('member-checking'),true);
});
test('storage failure does not start script downloads',async()=>{
 const h=harness();h.auth.resolve({user_id:'test'});await tick();h.prepare.reject(new Error('private server detail'));await h.result;assert.equal(h.scripts.length,0);assert.equal(h.classes.has('member-checking'),true);assert.doesNotMatch(h.box.children.map(x=>x.textContent).join(' '),/private server detail/);
});
test('consult mode opens only for a server-verified review account, hydrates its own student before loading the consulting planner',async()=>{
 const h=harness(2);h.auth.resolve({user_id:'review-1',student_name:'',review:true});await tick();
 const consult=h.scripts[0];assert.match(consult.src,/^planner-consult\.js\?v=/);assert.equal(h.events.includes('prepare'),false);
 h.window.RoadmapConsult={prepare:m=>({owner:m.user_id+'.c.abc',name:'가나',student:'abc',accountId:m.user_id}),afterCloud:()=> '가나',mount:()=>h.events.push('consult-mount')};
 consult.onload();await tick();await tick();
 assert.equal(h.window.RoadmapMember.user_id,'review-1.c.abc');assert.equal(h.window.RoadmapMember.consult,true);assert.equal(h.window.RoadmapMember.student_name,'가나');
 assert.equal(h.events.includes('prepare'),true);assert.equal(h.scripts.length,1);h.prepare.resolve();await tick();
 for(const s of h.scripts.slice(1))s.onload();await h.result;
 assert.equal(h.events.includes('consult-mount'),true);assert.equal(h.events.at(-1),'mount');
 assert.equal(h.window.RoadmapMember.consultAccount,'review-1');assert.equal(h.window.RoadmapMember.consultStudent,'abc');
});
test('an ordinary member never loads the consult script',async()=>{
 const h=harness(1);await start(h);for(const s of h.scripts)s.onload();await h.result;
 assert.equal(h.scripts.some(s=>/planner-consult/.test(s.src)),false);assert.equal(h.window.RoadmapMember.consult,false);
});

test('compact entry fetches only its authenticated dependencies until a result is requested',async()=>{
 const h=harness(8,2);assert.equal(h.scripts.length,0);await start(h);assert.equal(h.scripts.length,2);
 h.scripts.forEach(s=>s.onload());await h.result;assert.equal(h.classes.has('member-checking'),false);assert.ok(h.events.includes('compact-entry'));assert.equal(h.events.includes('mount'),false);
 const full=h.window.bootOptions.loadFull();assert.equal(h.scripts.length,8);assert.deepEqual(h.scripts.map(s=>s.src),Array.from({length:8},(_,i)=>`part-${i}.js`));h.scripts.slice(2).forEach(s=>s.onload());await full;
 assert.equal(h.events.filter(e=>e==='mount').length,1);await h.window.bootOptions.loadFull();assert.equal(h.scripts.length,8);
});
test('a requested study deep link opens its full tools without showing a second intake',async()=>{
 const h=harness(4,2);h.location.search='?checklist=1';await start(h);assert.equal(h.scripts.length,4);h.scripts.forEach(s=>s.onload());await h.result;
 assert.equal(h.events.includes('compact-entry'),false);assert.ok(h.events.includes('mount'));
});
test('failure of a compact dependency keeps the protected screen closed and never fetches tools',async()=>{
 const h=harness(5,2);await start(h);h.scripts[0].onerror();await h.result;assert.equal(h.classes.has('member-checking'),true);assert.equal(h.scripts.length,2);assert.equal(h.events.includes('compact-entry'),false);
});
test('verified entry assets download during cloud preparation but never mount before hydration',async()=>{
 const h=harness(8,2);h.auth.resolve({user_id:'synthetic'});await tick();
 assert.equal(h.scripts.length,2);h.scripts.forEach(s=>s.onload());await tick();
 assert.equal(h.events.includes('compact-entry'),false);assert.equal(h.classes.has('member-checking'),true);
 h.prepare.resolve();await h.result;assert.equal(h.events.includes('compact-entry'),true);
});
test('staged delivery loads one entry bundle and one ordered runtime bundle, each only once',async()=>{
 const h=harness(125,7,{entryBundle:'planner-entry.hash.js',runtimeBundle:'planner-runtime.hash.js'});
 await start(h);assert.equal(h.scripts.length,1);assert.equal(h.scripts[0].src,'planner-entry.hash.js');h.scripts[0].onload();await h.result;
 assert.equal(h.events.includes('compact-entry'),true);const full=h.window.bootOptions.loadFull();await tick();
 assert.equal(h.scripts.length,2);assert.equal(h.scripts[1].src,'planner-runtime.hash.js');assert.equal(h.scripts[1].async,false);h.scripts[1].onload();await full;
 await h.window.bootOptions.loadFull();assert.equal(h.scripts.length,2);assert.equal(h.events.filter(e=>e==='mount').length,1);
});
test('an entry bundle error keeps member data closed and does not request the runtime bundle',async()=>{
 const h=harness(125,7,{entryBundle:'planner-entry.hash.js',runtimeBundle:'planner-runtime.hash.js'});await start(h);h.scripts[0].onerror();await h.result;
 assert.equal(h.classes.has('member-checking'),true);assert.equal(h.events.includes('compact-entry'),false);assert.equal(h.scripts.length,1);
});
