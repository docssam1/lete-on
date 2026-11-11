import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
const read=n=>readFileSync(new URL(n,import.meta.url),'utf8');
const G=createRequire(import.meta.url)('./planner-guest.js');
const tick=()=>new Promise(r=>setImmediate(r));

test('a tour is asked for by name and keeps only its own flag and a chosen goal',()=>{
 for(const yes of ['?guest=1','?goal=contest&guest=1','?guest=1&goal=medicine'])assert.equal(G.requested(yes),true,yes);
 for(const no of ['','?guest=0','?guest=11','?xguest=1','?guest=true','?next=guest=1x'])assert.equal(G.requested(no),false,no);
 assert.equal(G.tourSearch('?guest=1'),'?guest=1');
 assert.equal(G.tourSearch('?guest=1&goal=contest'),'?guest=1&goal=contest');
 assert.equal(G.tourSearch('?view=seniors&academy=schools&books=math&ox=1&weekly=1&checklist=1&assessment=1&guest=1'),'?guest=1');
 assert.equal(G.tourSearch('?guest=1&goal=<script>'),'?guest=1');
});
function stores(){
 const log=[];const make=name=>{const m=new Map();return {getItem:k=>{log.push(['get',name,k]);return m.has(k)?m.get(k):null;},setItem:(k,v)=>{log.push(['set',name,k]);m.set(k,String(v));},removeItem:k=>{log.push(['remove',name,k]);m.delete(k);},get length(){return m.size;},key:i=>[...m.keys()][i],m};};
 return {log,localStorage:make('local'),sessionStorage:make('session')};
}
test('while looking around nothing is read from or written to the device, and values last only in the page',()=>{
 const s=stores();s.localStorage.m.set('gfield.demo2.saved.draft','{"old":"plan"}');s.sessionStorage.m.set('gfield.demo2.draft','{"old":"tab"}');
 const g={localStorage:s.localStorage,sessionStorage:s.sessionStorage,RoadmapGuest:true,RoadmapMember:{user_id:'guest',guest:true}};g.window=g;
 vm.runInNewContext(read('planner-storage.js'),{window:g,globalThis:g,self:g});
 const P=g.PlannerStorage;assert.ok(P);
 assert.equal(P.getItem('gfield.demo2.draft'),null);
 P.setItem('gfield.demo2.draft','{"grade":3}');assert.equal(P.getItem('gfield.demo2.draft'),'{"grade":3}');
 P.removeItem('gfield.demo2.draft');assert.equal(P.getItem('gfield.demo2.draft'),null);
 assert.deepEqual(s.log,[]);assert.equal(P.status(),'memory');
 assert.equal(s.localStorage.m.get('gfield.demo2.saved.draft'),'{"old":"plan"}');
});
test('a member still saves as before',()=>{
 const s=stores();const g={localStorage:s.localStorage,sessionStorage:s.sessionStorage,RoadmapMember:{user_id:'u1'}};g.window=g;
 vm.runInNewContext(read('planner-storage.js'),{window:g,globalThis:g,self:g});
 g.PlannerStorage.setItem('gfield.demo2.draft','x');assert.ok(s.log.some(e=>e[0]==='set'&&e[1]==='local'));assert.equal(g.PlannerStorage.status(),'durable');
});
function gate({search,status,count=2}){
 const events=[],classes=new Set(['member-checking']),scripts=[];
 const node=tag=>({tag,children:[],textContent:'',append(...x){this.children.push(...x);},appendChild(x){this.children.push(x);},replaceChildren(){this.children=[];},remove(){events.push('remove:'+tag);},setAttribute(){}});
 const box=node('status');
 const document={hidden:false,documentElement:{classList:{add:x=>classes.add(x),remove:x=>classes.delete(x)}},getElementById:id=>id==='memberGateStatus'?box:{value:''},querySelector:()=>node('menu'),querySelectorAll:()=>Array.from({length:count},(_,i)=>({dataset:{memberSrc:`part-${i}.js`}})),createElement:node,addEventListener(){},body:{appendChild(s){scripts.push(s);}}};
 const location={search,replace:x=>events.push('redirect:'+x),reload(){}};
 const window={RoadmapCloud:{prepare:()=>{events.push('prepare');},mount:()=>events.push('mount')},addEventListener(){},history:{replaceState:(a,b,url)=>events.push('url:'+url)},
  RoadmapGuestTour:{requested:G.requested,tourSearch:G.tourSearch,start:()=>events.push('tour')}};
 const result=vm.runInNewContext(read('membership-gate.js'),{document,window,location,RoadmapMembership:{status},setTimeout:()=>1,clearTimeout(){}});
 return {events,classes,scripts,window,result};
}
test('the tour opens without a session, never prepares or mounts account storage, and drops member deep links',async()=>{
 const h=gate({search:'?guest=1&view=seniors&ox=1',status:async()=>null});await tick();
 assert.equal(h.scripts.length,1);assert.match(h.scripts[0].src,/^planner-guest\.js\?v=/);assert.equal(h.window.RoadmapGuest,undefined);h.scripts.shift().onload();await tick();
 assert.equal(h.window.RoadmapGuest,true);assert.equal(h.window.RoadmapMember.guest,true);assert.equal(h.window.RoadmapMember.user_id,'guest');
 assert.deepEqual(h.events,['url:planner.html?guest=1']);assert.equal(h.classes.has('member-checking'),true);
 h.scripts.forEach(s=>s.onload());await h.result;
 assert.deepEqual(h.events,['url:planner.html?guest=1','remove:status','tour']);assert.equal(h.classes.has('member-checking'),false);
 assert.ok(!h.events.includes('prepare')&&!h.events.includes('mount'));
});
test('the tour also opens when the account server cannot be reached',async()=>{
 const h=gate({search:'?guest=1',status:async()=>{throw new Error('offline');}});await tick();h.scripts.shift().onload();await tick();h.scripts.forEach(s=>s.onload());await h.result;
 assert.equal(h.events.at(-1),'tour');assert.equal(h.window.RoadmapGuest,true);
});
test('without the tour flag nothing changes: no session still goes to sign-in, a failed check still stays closed',async()=>{
 const a=gate({search:'',status:async()=>null});await a.result;assert.match(a.events[0],/^redirect:account\.html/);assert.equal(a.window.RoadmapGuest,undefined);assert.equal(a.scripts.length,0);
 const b=gate({search:'?view=seniors',status:async()=>{throw new Error('offline');}});await b.result;assert.equal(b.scripts.length,0);assert.equal(b.classes.has('member-checking'),true);assert.equal(b.window.RoadmapGuest,undefined);
});
test('a signed-in member who follows the tour link stays a member',async()=>{
 const h=gate({search:'?guest=1',status:async()=>({user_id:'u1',student_name:'테스트'})});await tick();await tick();h.scripts.forEach(s=>s.onload());await h.result;
 assert.equal(h.window.RoadmapGuest,undefined);assert.equal(h.window.RoadmapMember.user_id,'u1');assert.ok(h.events.includes('prepare')&&h.events.includes('mount'));assert.ok(!h.events.includes('tour'));
});
test('the member-only rooms are named in one list, and the main page offers the tour and says nothing is saved',()=>{
 for(const sel of ['#openAcademyStories','[data-academy-story-open]','[data-math-books-open]','#openCase','[data-ox-open]','#plannerOxCheck>summary','[data-learning-evidence-open="mock"]','[data-learning-evidence-open="papers"]'])assert.ok(G.LOCKED.split(',').includes(sel),sel);
 assert.equal(G.MARK,'둘러보기 · 저장되지 않습니다');
 const html=read('account.html');assert.ok(html.split('href="planner.html?guest=1"').length>=3);assert.match(html,/살펴보기는 로드맵이 만들어지는 데까지이며, 입력한 내용은 저장되지 않습니다/);
 for(const sel of ['.nav [data-v="vplan"]','.nav [data-v="vrep"]','#workspace-tab-graph','#workspace-tab-table','#workspace-tab-records','#openReport','[data-learning-evidence-open]','[data-roadmap-mode="custom"]'])assert.ok(G.LOCKED.split(',').includes(sel),sel);
 assert.doesNotMatch(G.LOCKED,/workspace-tab-map|openSet|standard-stage|data-start/);
 const css=read('planner-guest.css');for(const hidden of ['#plannerWeeklyCheck','.learning-evidence-access','#workspace-panel-graph','#workspace-panel-table','#vplan','#vrep'])assert.ok(css.includes(hidden),hidden);
 const planner=read('planner.html');assert.doesNotMatch(planner,/planner-guest\.js/);assert.match(read('membership-gate.js'),/TOUR_SRC='planner-guest\.js\?v=/);assert.match(planner,/planner-guest\.css/);
 assert.doesNotMatch(read('planner-guest.js'),/localStorage|sessionStorage|fetch\(|XMLHttpRequest|RoadmapMembership/);
});
