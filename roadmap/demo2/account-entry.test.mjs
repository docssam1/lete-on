import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const read=n=>readFileSync(new URL(n,import.meta.url),'utf8');
const tick=()=>new Promise(r=>setImmediate(r));
async function setup(member=null,options={}){
 const nodes=new Map(),listeners={},calls=[];
 const node=id=>{if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',hidden:true,value:'',classList:{toggle(){}},focus(){},querySelector:selector=>node(id+selector),querySelectorAll:()=>[],addEventListener:(type,fn)=>{listeners[id+type]=fn;}});return nodes.get(id);};
 const document={getElementById:node,addEventListener:(type,fn)=>{listeners['doc'+type]=fn;}};
 const A={destination:x=>{calls.push(['destination',x]);return 'planner.html?books=math';},status:async()=>member,message:()=> '연결을 확인해 주세요.',call:async(...a)=>{calls.push(a);return {member:{}};},accept:r=>r.member};
 const location={search:options.query||'?next=planner.html%3Fbooks%3Dmath',assign:x=>calls.push(['assign',x])};
 const admin={signIn:async(...args)=>{calls.push(['admin-login',...args]);if(options.adminReject)throw Object.assign(new Error('admin_required'),{status:401});},getSession:async()=>options.adminSession||null};
 vm.runInNewContext(read('account.js'),{document,location,GFIELD_FIELDS_ADMIN_AUTH:admin,RoadmapMembership:A,RoadmapPolicy:{},URLSearchParams,Date,clearInterval(){},FormData:class{constructor(t){this.data=t.data;}get(k){return this.data[k];}}});await tick();
 return {node,calls,click:action=>listeners.memberContentclick({target:{closest:()=>({dataset:{action}})}}),external:entry=>listeners.docclick({target:{closest:()=>({dataset:{accountEntry:entry}})}})};
}
test('first visit presents free email verification; existing approval login stays selectable',async()=>{
 const h=await setup();assert.match(h.node('memberContent').innerHTML,/이메일로 무료 시작/);assert.match(h.node('memberContent').innerHTML,/emailConsent.*required/);assert.match(h.node('memberContent').innerHTML,/data-action="signup" aria-pressed="true"/);
 h.click('login');assert.match(h.node('memberContent').innerHTML,/기존 회원 로그인/);assert.match(h.node('memberContent').innerHTML,/승인번호/);assert.match(h.node('memberContent').innerHTML,/data-action="login" aria-pressed="true"/);
 h.external('signup');assert.match(h.node('memberContent').innerHTML,/이메일로 무료 시작/);
});
test('existing username/approval and email/pin submissions retain APIs and next destination',async()=>{
 for(const [identifier,expected,credentials]of [['review-user','review-login',{username:'review-user',code:'12345678'}],['Parent@Example.com','login',{email:'parent@example.com',pin:'12345678'}]]){
  const h=await setup();h.click('login');h.node('loginForm').onsubmit({preventDefault(){},target:{data:{identifier,code:'12345678'},reset(){}}});await tick();
  assert.deepEqual(JSON.parse(JSON.stringify(h.calls.find(x=>x[0]===expected))),[expected,credentials]);assert.deepEqual(h.calls.at(-1),['assign','planner.html?books=math']);assert.deepEqual(h.calls[0],['destination','planner.html?books=math']);
 }
});
test('authenticated review member stays on existing account screen even from free-start link',async()=>{
 const h=await setup({review:true,username:'synthetic'});assert.match(h.node('memberContent').innerHTML,/내 계정/);h.external('signup');assert.match(h.node('memberContent').innerHTML,/내 계정/);assert.doesNotMatch(h.node('memberContent').innerHTML,/emailForm/);
});
test('first-screen CTA precedes video and makes no instant verification promise',()=>{
 const html=read('account.html');assert.ok(html.indexOf('이메일로 무료 시작하기')<html.indexOf('account-stage'));assert.match(html,/data-account-entry="login"/);assert.doesNotMatch(html+read('account.js'),/1초.*인증|인증.*1초|즉시 인증/);
});

test('the same login form routes DOCSSAM through verified admin authentication, never review fallback',async()=>{
 for(const reject of [false,true]){
  const h=await setup(null,{adminReject:reject});h.click('login');
  h.node('loginForm').onsubmit({preventDefault(){},target:{data:{identifier:'docssam',code:'12345678'},reset(){}}});await tick();
  assert.deepEqual(h.calls.find(x=>x[0]==='admin-login'),['admin-login','DOCSSAM','12345678']);
  assert.equal(h.calls.some(x=>x[0]==='review-login'),false);
  assert.equal(h.calls.some(x=>x[0]==='assign'&&x[1]==='admin.html'),!reject);
 }
});
test('an admin destination uses the ordinary login form and reuses an existing admin session',async()=>{
 const noSession=await setup(null,{query:'?next=admin.html'});
 assert.match(noSession.node('memberContent').innerHTML,/기존 회원 로그인/);
 const existing=await setup(null,{query:'?next=admin.html',adminSession:{user:{app_metadata:{role:'admin'}}}});
 assert.deepEqual(existing.calls.at(-1),['assign','admin.html']);
 const html=read('admin.html');assert.doesNotMatch(html,/adminLoginForm|관리자 승인번호/);assert.match(html,/account.html\?next=admin.html/);
});
