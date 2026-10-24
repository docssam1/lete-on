#!/usr/bin/env node
'use strict';
// Only mocked RPC/storage functions and an explicit offline test key are used.
// Requiring the generator never executes its CLI or reads a service credential.
const assert=require('node:assert/strict'),crypto=require('node:crypto'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{spawnSync}=require('node:child_process');
const DP=require('../number_magic/app/delivery-plan.js'),WS=require('./nm-weekly-worksheets.cjs');
const week='2026-W44',phone='01000000001',name='Synthetic learner',key='offline-test-key',ext=DP.EXTENSION_VERSION;
let checks=0;const check=fn=>{fn();checks++;};
function plan(extra={}){return {courseKey:'C31',sessionIndex:11,startDate:'2026-10-26',speed:1,amount:1.25,cadence:'w2',pace:'p2',middleExtensions:{1:ext},extensionAnchor:{grade:1,index:3,resume:{courseKey:'C32',sessionIndex:5}},...extra};}
function config(p=plan(),extra={}){return {courseKey:p.courseKey,sessionIndex:p.sessionIndex,amount:p.amount,cadence:p.cadence,k:1,week,deliveryPlanVersion:DP.VERSION,learningPlan:p,wholeWeek:true,...extra};}
function mock(delivery,state={}){
  const calls=[];
  const request=async(path,init={})=>{
    calls.push({path,init});
    if(path.startsWith('/rest/v1/nm_contacts?'))return [{profile_name:name,phone}];
    if(path==='/rest/v1/rpc/nm_membership_rpc'){
      const payload=JSON.parse(init.body);
      assert.deepEqual(payload,{p_action:'system_delivery',p_payload:{profileName:name,phone,week,k:1}});
      if(delivery instanceof Error)throw delivery;
      return delivery;
    }
    if(path.startsWith('/rest/v1/nm_profiles?'))return [{state}];
    throw new Error('unexpected_mock_path');
  };
  return {request,calls};
}
async function main(){
  check(()=>assert.equal(WS.DELIVERY_PLAN_VERSION,DP.VERSION));
  const manual=await WS.listTargets({request:async()=>{throw new Error('manual target must not request a server snapshot');},args:['--name',name,'--course','C4','--cadence','w2'],week});
  check(()=>assert.equal(manual[0].courseKey,'C4'));check(()=>assert.deepEqual(WS.jobsForTarget(manual[0]),[1,2]));
  const dry=spawnSync(process.execPath,[path.join(__dirname,'nm-weekly-worksheets.cjs')],{env:{DRY:'1'},encoding:'utf8'});
  check(()=>assert.equal(dry.status,1));check(()=>assert.match(dry.stderr,/DRY 자동 조회/,'automatic dry runs stop before any RPC, even without a service key'));
  const t=WS.worksheetTarget({name,deliveryPlanVersion:DP.VERSION,learningPlan:plan(),amount:.7,cadence:'w1'});
  check(()=>assert.equal(t.amount,1.25));check(()=>assert.equal(t.cadence,'w2'));
  check(()=>assert.deepEqual(WS.jobsForTarget(t),[1],'personal whole-week w2 is one PDF rather than duplicated k1/k2'));
  const url=new URL(WS.buildWorksheetUrl('https://example.invalid',week,t,1));
  check(()=>assert.deepEqual(DP.decode(url.searchParams.get('dp')),DP.normalize(plan())));
  check(()=>assert.equal(url.searchParams.get('w'),week));check(()=>assert.equal(url.searchParams.get('k'),'1'));
  check(()=>assert.equal(url.searchParams.get('dv'),DP.VERSION));
  check(()=>assert.equal(url.searchParams.get('cad'),'w2'));check(()=>assert.equal(url.searchParams.get('amt'),'1.25'));
  check(()=>assert.equal(url.searchParams.get('hp'),null));check(()=>assert.equal(url.searchParams.get('hs'),null));
  check(()=>assert.throws(()=>WS.buildWorksheetUrl('https://example.invalid',week,t,2),/whole_week_only/));
  check(()=>assert.throws(()=>WS.worksheetToken(key,week,t,2),/whole_week_only/));
  const token=WS.worksheetToken(key,week,t,1);
  check(()=>assert.match(token,/^[0-9a-f]{32}$/));
  check(()=>assert.equal(token,WS.worksheetToken(key,week,{...t,learningPlan:{...plan(),avatar:'ignored',name:'ignored'}},1)));
  const variations=[plan({speed:.85}),plan({amount:.7}),plan({cadence:'w1'}),plan({startDate:'2026-11-02'}),plan({extensionAnchor:{grade:1,index:4,resume:{courseKey:'C32',sessionIndex:5}}}),plan({extensionAnchor:{grade:1,index:3,resume:{courseKey:'C32',sessionIndex:6}}}),plan({middleExtensions:{1:ext,2:ext}})];
  for(const p of variations)check(()=>assert.notEqual(token,WS.worksheetToken(key,week,{...t,learningPlan:p},1),'all schedule/amount/selection/resume changes create another immutable PDF identity'));
  check(()=>assert.notEqual(token,WS.worksheetToken(key,'2026-W45',t,1)));
  check(()=>assert.notEqual(token,WS.worksheetToken(key,week,{...t,name:'Another synthetic learner'},1)));
  const legacy={name,courseKey:'C4',cadence:'w2',amount:1.25};
  for(const k of [1,2]){
    check(()=>assert.equal(WS.buildWorksheetUrl('https://example.invalid',week,legacy,k),`https://example.invalid/number_magic/ws.html?w=${week}&c=C4&n=${encodeURIComponent(name)}&k=${k}&cad=w2&amt=1.25&auto=0`));
    check(()=>assert.equal(WS.worksheetToken(key,week,legacy,k),crypto.createHmac('sha256',key).update(`${name}|${week}|C4|a1.25${k===2?'|k2':''}`).digest('hex').slice(0,8)));
  }
  check(()=>assert.deepEqual(WS.jobsForTarget(legacy),[1,2]));
  const personal=mock({managed:true,canUse:true,config:config(),wholeWeek:true,deliveryPlanVersion:DP.VERSION},{learningPlan:plan({speed:1.5})});
  const selected=await WS.listTargets({request:personal.request,args:[],week});
  check(()=>assert.equal(selected.length,1));check(()=>assert.deepEqual(selected[0].learningPlan,DP.normalize(plan())));
  check(()=>assert.equal(personal.calls.some(c=>c.path.startsWith('/rest/v1/nm_profiles?')),false,'server snapshot is final; later profile state is not read'));
  const managedLegacy=mock({managed:true,canUse:true,config:{week,k:1,courseKey:'C38',sessionIndex:7,cadence:'w2',amount:.85,highPlanVersion:WS.HIGH_PLAN_VERSION,highStartDate:'2026-10-26',highSpeed:1.5}},{weeklyDigest:{courseKey:'C4'}});
  const managedTargets=await WS.listTargets({request:managedLegacy.request,args:[],week});
  check(()=>assert.equal(managedTargets[0].courseKey,'C38'));check(()=>assert.equal(managedTargets[0].sessionIndex,7));
  check(()=>assert.equal(managedLegacy.calls.some(c=>c.path.startsWith('/rest/v1/nm_profiles?')),false));
  const state={learningPlan:plan(),weeklyDigest:{courseKey:'C4'},roadCadence:'w2',roadAmount:.85};
  for(const delivery of [{managed:false},{managed:true,canUse:true,link:null},{managed:true,canUse:true,link:null,personalPlanLegacy:true}]){
    const fallback=mock(delivery,state),result=await WS.listTargets({request:fallback.request,args:[],week});
    if(delivery.personalPlanLegacy===true){
      check(()=>assert.equal(result[0].courseKey,'C4'));
      check(()=>assert.equal(result[0].deliveryPlanVersion,undefined,'only the server-confirmed old baseline retains the original digest fallback'));
      check(()=>assert.equal(result[0].amount,.85));
    }else check(()=>assert.equal(result[0].skipReason,'personal-snapshot-missing','an assigned plan cannot fall back to unrelated generic content'));
  }
  for(const delivery of [{managed:false},{managed:true,canUse:true,link:null}]){
    const fallback=mock(delivery,{weeklyDigest:{courseKey:'C4'},roadCadence:'w2',roadAmount:.85}),result=await WS.listTargets({request:fallback.request,args:[],week});
    check(()=>assert.equal(result[0].courseKey,'C4','profiles with no personal plan retain their original fallback'));
    check(()=>assert.equal(result[0].deliveryPlanVersion,undefined));
  }
  for(const delivery of [new Error('offline'),{error:'invalid_learning_plan',status:400},{managed:true,canUse:false},{managed:true},null,
    {managed:true,canUse:true,config:config(plan(),{deliveryPlanVersion:'future'})},
    {managed:true,canUse:true,config:config(plan(),{deliveryPlanVersion:undefined})},
    {managed:true,canUse:true,config:config(plan(),{amount:.7})},
    {managed:true,canUse:true,config:config(plan(),{week:'2026-W45'})},
    {managed:true,canUse:true,config:config(plan(),{k:2})},
    {managed:true,canUse:true,wholeWeek:true,deliveryPlanVersion:DP.VERSION},
    {managed:true,canUse:true,wholeWeek:true,deliveryPlanVersion:DP.VERSION,config:null},
    {managed:true,canUse:true,wholeWeek:true,deliveryPlanVersion:'future',config:config()},
    {managed:true,canUse:true,wholeWeek:false,deliveryPlanVersion:DP.VERSION,config:config()},
    {managed:true,canUse:true,wholeWeek:true,deliveryPlanVersion:DP.VERSION,config:{week,k:1,courseKey:'C4',sessionIndex:1,cadence:'w1',amount:1}}]){
    const denied=mock(delivery,state),result=await WS.listTargets({request:denied.request,args:[],week});
    check(()=>assert(result[0].skipReason));check(()=>assert.equal(denied.calls.some(c=>c.path.startsWith('/rest/v1/nm_profiles?')),false,'bad or denied RPCs never bypass the gate via current profile state'));
  }
  const twoContacts=mock({managed:false},{weeklyDigest:{courseKey:'C4'}}),request=async(path,init)=>path.startsWith('/rest/v1/nm_contacts?')?[{profile_name:name,phone:'invalid'},{profile_name:name,phone}]:twoContacts.request(path,init);
  const deduped=await WS.listTargets({request,args:[],week});check(()=>assert.equal(deduped.length,1));
  const invalidContact=await WS.listTargets({request:async()=>[{profile_name:name,phone:'invalid'}],args:[],week});
  check(()=>assert.equal(invalidContact[0].skipReason,'contact-unavailable'));
  const stored=[];const save=async(path,init)=>{stored.push({path,init});return {};};
  const first=await WS.storeWorksheetPdf(save,key,week,t,1,Buffer.from('mock PDF'),'https://example.invalid');
  check(()=>assert.equal(stored[0].init.headers['x-upsert'],'false'));check(()=>assert(first.url.endsWith('/'+token+'.pdf')));
  check(()=>assert.equal(JSON.parse(stored[1].init.body).k,1));
  check(()=>assert.equal(first.reused,false));
  const reused=[];const duplicate=async(path,init)=>{reused.push({path,init});if(path.startsWith('/storage/'))throw Object.assign(new Error('exists'),{status:409});return {};};
  const again=await WS.storeWorksheetPdf(duplicate,key,week,t,1,Buffer.from('replacement is not written'),'https://example.invalid');
  check(()=>assert.equal(again.reused,true));check(()=>assert.equal(reused.length,2));check(()=>assert.equal(reused[0].init.headers['x-upsert'],'false'));
  const oldDuplicate=async(path)=>{if(path.startsWith('/storage/'))throw Object.assign(new Error('exists'),{status:400,code:'Duplicate'});return {};};
  const duplicate400=await WS.storeWorksheetPdf(oldDuplicate,key,week,t,1,Buffer.from('mock'),'https://example.invalid');
  check(()=>assert.equal(duplicate400.reused,true,'the documented legacy standard-upload duplicate response also reuses the old PDF'));
  await assert.rejects(()=>WS.storeWorksheetPdf(async()=>{throw Object.assign(new Error('invalid'),{status:400,code:'InvalidRequest'});},key,week,t,1,Buffer.from('mock')),/invalid/);checks++;
  await assert.rejects(()=>WS.storeWorksheetPdf(async()=>{throw Object.assign(new Error('failed'),{status:503});},key,week,t,1,Buffer.from('mock')),/failed/);checks++;
  const old=[];await WS.storeWorksheetPdf(async(path,init)=>{old.push({path,init});},key,week,legacy,2,Buffer.from('legacy'),'https://example.invalid');
  check(()=>assert.equal(old[0].init.headers['x-upsert'],'true','old object behavior is preserved'));check(()=>assert.equal(JSON.parse(old[1].init.body).k,2));
  const root=path.resolve(__dirname,'../number_magic'),w={console};w.window=w;vm.createContext(w);
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8').replace(/<!--[\s\S]*?-->/g,'');
  for(const tag of html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/g)){
    const file=tag[1].split(/[?#]/)[0];if(!/^(engine\/|data\/)/.test(file))continue;
    vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),w);if(file==='data/high-pacing.js')break;
  }
  const courses=JSON.parse(JSON.stringify(w.NM_COURSES)),E=require('../number_magic/data/middle-extension.js');
  function wk(offset){const ms=Date.parse('2026-10-26T00:00:00Z')+offset*7*86400000,y=new Date(ms+3*86400000).getUTCFullYear(),jan4=Date.UTC(y,0,4),first=jan4-(new Date(jan4).getUTCDay()+6)%7*86400000;return y+'-W'+String(1+Math.round((ms-first)/(7*86400000))).padStart(2,'0');}
  for(const grade of [1,2,3])for(const includeExtension of [false,true]){
    const p=plan({courseKey:{1:'C29',2:'C32',3:'C35'}[grade],sessionIndex:1,amount:1});delete p.extensionAnchor;
    p.middleExtensions=includeExtension?{[grade]:E.version}:{};
    const target=WS.targetFromConfig(name,config(p),week),all=[];
    for(let offset=0;offset<(includeExtension?16:10);offset++)for(const k of WS.jobsForTarget(target)){
      const decoded=DP.decode(new URL(WS.buildWorksheetUrl('https://example.invalid',wk(offset),target,k)).searchParams.get('dp'));
      all.push(...DP.assignment(courses,decoded,wk(offset)).weekLessons);
    }
    const core=all.filter(ref=>ref.kind!=='middle-extension'&&courses[ref.courseKey].tier==='middle'+grade);
    const sources=core.flatMap(ref=>ref.sourceIndices.map(i=>ref.courseKey+':'+i));
    const expected=Object.keys(courses).filter(key=>courses[key].tier==='middle'+grade).flatMap(key=>courses[key].sessions.map((_,i)=>key+':'+i));
    check(()=>assert.equal(core.length,20,'the PDF target schedules twenty whole-week core bundles once in ten standard weeks'));
    check(()=>assert.deepEqual(sources,expected,'PDF core sources have no loss or k2 duplication'));
    check(()=>assert.deepEqual(all.filter(ref=>ref.kind==='middle-extension').map(ref=>ref.extensionId),includeExtension?Array.from({length:12},(_,i)=>'M'+grade+'E-'+String(i+1).padStart(2,'0')):[]));
  }
  console.log('NM_WEEKLY_PERSONAL_OK checks='+checks+' serverSnapshotPriority=true noStatePlanBypass=true wholeWeekOnePdf=true immutablePersonalPdf=true legacyUrlsAndTokensUnchanged=true realNetworkWrites=0');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
