import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const deferred=()=>{let resolve,reject;const promise=new Promise((yes,no)=>{resolve=yes;reject=no;});return{promise,resolve,reject};};
const scene=id=>({id,view:{},beats:[{text:id+' 장면',dur:1}],build(){}});
const element=()=>({innerHTML:'',textContent:'',children:[],onclick:null,onchange:null,value:'1',classList:{toggle(){}},setAttribute(){}});
const gate=()=>({module:deferred(),load:deferred(),started:deferred(),waitLoad:false});
function harness(mode){
 const stages=[],players=[],errors=[],writes=[],keys=new Set(),watches=[],gates=new Map([['a',gate()],['b',gate()]]),locks=new Set();let view,fullscreen;
 function newView(){
  if(view)view.canvas.isConnected=false;
  const nodes=Object.fromEntries(['stage','caption','dots','transcript','btnPlay','btnVoice','speed','btnPrev','btnNext','btnReplay','cap','step','ctl'].map(k=>[k,element()]));
  const canvas={isConnected:true},map={'canvas':canvas,'.cap':nodes.cap,'.cap span':nodes.caption,'.stage3d-step':nodes.step,'[data-a=play]':nodes.btnPlay,'[data-a=prev]':nodes.btnPrev,'[data-a=next]':nodes.btnNext,'.ctl':nodes.ctl};
  view={...nodes,canvas,querySelector:s=>map[s],isConnected:true};view.stage=canvas;return view;
 }
 const host={isConnected:true,set innerHTML(value){this.html=value;newView();},querySelector:s=>s==='.stage3d'?view:view.querySelector(s)};
 class Stage{constructor(canvas){this.canvas=canvas;this.disposed=false;this.disposals=0;stages.push(this);}dispose(){this.disposed=true;this.disposals++;}}
 class Player{
  constructor(stage){this.stage=stage;this.onChange=()=>{};this.index=0;this.playing=false;this.done=false;this.voice=false;this.actions=[];players.push(this);}
  async load(mod){this.loaded=mod.id;const g=gates.get(mod.id);g.started.resolve();if(g.waitLoad)await g.load.promise;this.beats=mod.beats;}
  stop(){this.actions.push('stop');}toggle(){this.actions.push('toggle');}next(){this.actions.push('next');}prev(){this.actions.push('prev');}replay(){this.actions.push('replay');}setVoice(){this.actions.push('voice');}setSpeed(){this.actions.push('speed');}goto(){this.actions.push('goto');}play(){this.playing=true;this.actions.push('play');this.onChange();}
 }
 const document={getElementById:id=>view[id],addEventListener:(type,fn)=>keys.add(fn),removeEventListener:(type,fn)=>keys.delete(fn),querySelector:()=>fullscreen?.canvas.isConnected?fullscreen:null,documentElement:{classList:{remove:cls=>locks.delete(cls)}}};
 const watchDetached=(canvas,cleanup)=>{let done=false;const finish=()=>{if(!done){done=true;cleanup();}};watches.push({canvas,finish});if(!canvas.isConnected)finish();return finish;};
 const context=vm.createContext({Stage,Player,document,console:{error:e=>errors.push(e)},sceneRequest:0,stage:null,player:null,esc:s=>String(s),store:{unit:()=>({}),patch:(id,patch)=>writes.push({id,patch})},HINT3D:'',REDUCED:false,addLandscape(){}});
 const modules=async spec=>{
  let exports;
  if(spec.includes('engine.js'))exports={Stage,Player,watchDetached};
  else{const name=spec.match(/\/([ab])\.js/)[1];await gates.get(name).module.promise;exports={default:scene(name)};}
  const m=new vm.SyntheticModule(Object.keys(exports),function(){for(const[k,v]of Object.entries(exports))this.setExport(k,v);},{context});await m.link(()=>{});await m.evaluate();return m;
 };
 const source=fs.readFileSync(new URL(mode==='v1'?'../app.js':'../v2/mounts.js',import.meta.url),'utf8');
 let api;
 if(mode==='v1'){
  const teardown=source.slice(source.indexOf('function teardown3D('),source.indexOf('\nfunction topbar('));
  const mount=source.slice(source.indexOf('async function mount3D('),source.indexOf('\nfunction mountQuiz('));
  api=new vm.Script(teardown+'\n'+mount+'\n({mount3D,teardown3D})',{importModuleDynamically:modules}).runInContext(context);
 }else api={mount3D:new vm.Script(source.slice(source.indexOf('export async function mount3D(')).replace('export async function','async function')+'\nmount3D',{importModuleDynamically:modules}).runInContext(context)};
 return{stages,players,errors,writes,keys,gates,host,locks,setFullscreen(){fullscreen=view;locks.add('fl-lock');},get view(){return view;},
  start(id){if(mode==='v1'){newView();return api.mount3D({id,scene:id});}return api.mount3D(host,id,{autoplay:true,onDone:()=>writes.push({done:id})});},
  leave(){if(mode==='v1')api.teardown3D();host.isConnected=false;if(view)view.canvas.isConnected=false;this.flush();},
  flush(){for(const w of watches)if(!w.canvas.isConnected)w.finish();},
  async ready(id){gates.get(id).module.resolve();const pending=this.start(id);await pending;return pending;},
 };
}
async function run(mode){
 const cases=[];
 {
  const h=harness(mode),a=h.start('a'),old=h.view;h.leave();h.host.isConnected=true;h.gates.get('b').module.resolve();await h.start('b');const current=h.players.at(-1),caption=h.view.caption.innerHTML+ h.view.caption.textContent;h.gates.get('a').module.resolve();await a;
  assert.equal(h.players.at(-1),current,'late import must not create/use the current player');assert.equal(current.loaded,'b');assert.equal(h.view.caption.innerHTML+h.view.caption.textContent,caption);assert.equal(old.transcript.innerHTML,'');assert.equal(h.writes.length,0);h.leave();cases.push('late import after navigation');
 }
 {
  const h=harness(mode);h.gates.get('a').module.resolve();h.gates.get('a').waitLoad=true;const a=h.start('a');await h.gates.get('a').started.promise;const abandoned=h.stages[0];h.leave();assert.equal(abandoned.disposed,true,'pending load resources must be disposed immediately');h.host.isConnected=true;h.gates.get('b').module.resolve();await h.start('b');const current=h.players.at(-1);h.gates.get('a').load.resolve();await a;assert.equal(h.players.at(-1),current);assert.equal(current.loaded,'b');assert.equal(h.writes.length,0);h.leave();cases.push('leave during player load');
 }
 {
  const h=harness(mode),a=h.start('a');h.leave();h.host.isConnected=true;h.gates.get('b').module.resolve();await h.start('b');const current=h.view,caption=current.caption.innerHTML+current.caption.textContent;h.gates.get('a').module.reject(Error('old import failed'));await a;assert.equal(h.view,current);assert.equal(current.caption.innerHTML+current.caption.textContent,caption);assert.equal(current.cap.textContent,'');assert.equal(h.errors.length,0);h.leave();cases.push('stale import rejection');
 }
 {
  const h=harness(mode);h.gates.get('a').module.resolve();await h.start('a');const old=h.players[0],oldSync=old.onChange,oldClick=h.view.btnPlay.onclick,oldKey=[...h.keys][0];h.leave();h.host.isConnected=true;h.gates.get('b').module.resolve();await h.start('b');const current=h.players.at(-1),actions=current.actions.slice(),beforeWrites=h.writes.length;old.done=true;oldSync();oldClick?.();oldKey?.({target:{matches:()=>false},key:' ',preventDefault(){}});assert.deepEqual(current.actions,actions);assert.equal(h.writes.length,beforeWrites);h.leave();cases.push('stale callbacks and controls');
 }
 {
  const h=harness(mode);h.gates.get('a').module.reject(Error('current failure'));await h.start('a');assert(mode==='v1'?h.view.caption.innerHTML.includes('불러오지'):h.view.cap.textContent.includes('보여 줄 수 없어요'));assert(h.stages.every(s=>s.disposed));assert.equal(h.writes.length,0);h.leave();cases.push('current import error');
 }
 {
  const h=harness(mode);h.gates.get('a').module.resolve();h.gates.get('a').waitLoad=true;const a=h.start('a');await h.gates.get('a').started.promise;h.leave();h.host.isConnected=true;h.gates.get('b').module.resolve();await h.start('b');const current=h.view,caption=current.caption.innerHTML+current.caption.textContent;h.gates.get('a').load.reject(Error('old build failed'));await a;assert.equal(h.view,current);assert.equal(current.caption.innerHTML+current.caption.textContent,caption);assert.equal(current.cap.textContent,'');assert.equal(h.errors.length,0);assert.equal(h.writes.length,0);h.leave();cases.push('stale player-load rejection');
 }
 {
  const h=harness(mode);h.gates.get('a').module.resolve();h.gates.get('a').waitLoad=true;const pending=h.start('a');await h.gates.get('a').started.promise;h.gates.get('a').load.reject(Error('current build failed'));await pending;assert(h.stages.every(stage=>stage.disposed&&stage.disposals===1));assert(mode==='v1'?h.view.caption.innerHTML.includes('불러오지'):h.view.cap.textContent.includes('보여 줄 수 없어요'));assert.equal(h.writes.length,0);h.leave();cases.push('current player-load error cleanup');
 }
 if(mode==='v2'){
  const h=harness(mode),a=h.start('a');h.gates.get('b').module.resolve();await h.start('b');const current=h.players.at(-1);h.gates.get('a').module.resolve();await a;assert.equal(h.players.length,1);assert.equal(h.players[0],current);h.leave();cases.push('same host remount while importing');
  const live=harness(mode);live.gates.get('a').module.resolve();await live.start('a');live.gates.get('b').module.resolve();await live.start('b');live.setFullscreen();live.flush();assert(live.locks.has('fl-lock'),'old cleanup must retain a new fullscreen owner');live.leave();assert(!live.locks.has('fl-lock'));cases.push('fullscreen ownership during stale cleanup');
 }
 return{mode,cases,browserVerified:false};
}
console.log(JSON.stringify(await run(process.argv[2])));
