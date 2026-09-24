#!/usr/bin/env node
'use strict';
/* Independent finite-pool / mixed-sheet regression. No fixtures are registered in
 * the application outside this process. Run with --browser for actual editor,
 * replacement, failed-print and preview/print parity checks (Playwright needed).
 * NM_UNIQUE_ARTIFACTS optionally writes only generated QA evidence, never sources.
 */
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..');
const report={core:[],browser:[],failures:[]};
const plain=x=>JSON.parse(JSON.stringify(x));
function stable(value){
  if(Array.isArray(value))return value.map(stable);
  if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().map(k=>[k,stable(value[k])]));
  return typeof value==='string'?value.replace(/\s+/g,' ').trim():value;
}
// Independent student-visible signature: deliberately does not call problemKey.
function signature(p){
  const fields=['tex','word','wordAsk','choices','prompt','graph','solutionGraph','scatterPlot','numberLine','numline','array','cubes','pairs','table',
    'pts','items','beads','clock','fraction','dir','a','b','whole','seq','blank','rows','left','right','rightType','gridMode','total','emoji',
    'layout','mark','chars','interaction','mmode','examples','target','startCount','tallyGroups','input','rule','cells','askMode','askType',
    'basketA','basketB','wordEqn','base10','meaning','picCap','answer'];
  return JSON.stringify(stable(Object.fromEntries(fields.filter(k=>p[k]!==undefined).map(k=>[k,p[k]]))));
}
function signatures(ps){return Array.from(ps,signature);}
function unique(ps,label){assert.equal(new Set(signatures(ps)).size,ps.length,label||'Student-visible variants repeat');}
function harness(real=false){
  const store=new Map(),w={console,Set,Map,Math,JSON,Date,URL,URLSearchParams,setTimeout,clearTimeout};
  w.window=w;
  w.document={getElementById:()=>({}),querySelector:()=>null,querySelectorAll:()=>[],head:{appendChild(){}},body:{appendChild(){}}};
  w.localStorage={getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v))};
  vm.createContext(w);
  const load=f=>vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),w,{filename:f});
  load('engine/rng.js');
  if(real){
    load('engine/generators.js');
    for(const f of fs.readdirSync(path.join(root,'engine/threads')).filter(f=>f.endsWith('.js')).sort())load('engine/threads/'+f);
    load('data/threads.js');
  }else w.NM_THREADS={};
  load('app/exam.js');
  function register(id,size=1000,kind='number',levels=1){
    const gen='qa_'+id;
    w.NM_THREADS[id]={id,gen,name:{ko:id,en:id,zh:id},levels:Array.from({length:levels},(_,i)=>({id:i+1,label:{ko:'QA '+(i+1)},params:{mode:'qa'+(i+1),size,kind,source:id,level:i+1}}))};
    w.NM_TGEN[gen]=(p,rng)=>{
      const n=Math.floor(rng()*p.size),source=p.source+'L'+p.level;
      const common={answerType:'number',widget:'numpad',prompt:{ko:'검수용 문항',en:'QA fixture',zh:'验证题'}};
      if(p.kind==='graph')return {...common,tex:'y = \\square',answer:1,graph:{kind:'line',a:n+1,b:0,xr:5,yr:5},_qaVariant:n};
      if(p.kind==='word')return {...common,word:{ko:`카드 ${n}를 고르세요.`,en:`Choose card ${n}.`,zh:`选择卡片 ${n}。`},wordAsk:{ko:'어느 카드인가요?'},choices:{ko:[`카드 ${n}`,'다른 카드']},answer:1,_qaVariant:n};
      return {...common,tex:`${source}: ${n} + 1 = \\square`,answer:n+1,_qaVariant:n,_qaSource:source};
    };
  }
  return {w,api:w.NM_EXAM,register};
}
function core(name,fn){
  try{const details=fn();report.core.push({name,status:'pass',...(details||{})});console.log('PASS '+name);}
  catch(e){report.core.push({name,status:'fail',error:e.message});report.failures.push({stage:'core',name,error:e.message,stack:e.stack});console.error('FAIL '+name+': '+e.message);}
}
function exhaustion(fn){
  let err;try{fn();}catch(e){err=e;}
  assert(err,'Exhausted finite pool returned repeated questions instead of refusing the set');
  assert.equal(err.code,'NM_UNIQUE_POOL_EXHAUSTED');
  return err;
}
core('finite pool fails closed, including duplicates past retry budget',()=>{
  const {w,api,register}=harness();register('QA1',1);
  let draws=0;const gen=w.NM_TGEN.qa_QA1;w.NM_TGEN.qa_QA1=(...args)=>{draws++;return gen(...args);};
  exhaustion(()=>api.buildProblems('QA1',1,2,17));
  assert(draws>=2&&draws<=10000,'Finite pool detection must be bounded');
  return {draws};
});
core('negative fixture: changing an invisible id cannot disguise a duplicate',()=>{
  const {w,api,register}=harness();register('QA1',1);
  let id=0;const gen=w.NM_TGEN.qa_QA1;w.NM_TGEN.qa_QA1=(...args)=>({...gen(...args),id:++id,__slot:id,__ramp:!!(id%2)});
  exhaustion(()=>api.buildProblems('QA1',1,2,23));
});
core('seeded generation is deterministic and contains no repeats',()=>{
  const {api,register}=harness();register('QA1',1000);
  for(let seed=0;seed<100;seed++){
    const a=api.buildProblems('QA1',1,36,seed),b=api.buildProblems('QA1',1,36,seed);
    assert.deepEqual(signatures(a),signatures(b));unique(a);assert.equal(a.length,36);
  }
  return {seeds:100,questions:3600};
});
core('mixed slots keep their original thread AND level after replacement',()=>{
  const {api,register}=harness();register('QA1',1000, 'number',2);register('QB1',1000,'number',2);
  const mix=[{t:'QA1',lv:1},{t:'QB1',lv:2}],base=api.buildProblems('QA1',1,10,19,null,mix);
  const changed=api.buildProblems('QA1',1,10,19,{'1':'mixreplace'},mix);
  assert.equal(changed[1]._qaSource,'QB1L2');assert.notEqual(signature(changed[1]),signature(base[1]));
  for(let i=0;i<10;i++)if(i!==1)assert.equal(signature(changed[i]),signature(base[i]),'Unselected mixed slot changed');
  unique(changed);
});
core('replacement excludes the selected old variant as well as other slots',()=>{
  const {w,api,register}=harness();register('QA1',3);
  const base=api.buildProblems('QA1',1,2,43),old=base[0]._qaVariant;
  let replacementSeed;
  for(let n=0;n<10000;n++){
    const s='same'+n,rng=w.NM_RNG.mulberry32(w.NM_RNG.hashSeed(s+'#0'));
    if(Math.floor(rng()*3)===old){replacementSeed=s;break;}
  }
  assert(replacementSeed,'Fixture could not select the current old variant first');
  const changed=api.buildProblems('QA1',1,2,43,{0:replacementSeed});
  assert.notEqual(changed[0]._qaVariant,old,'The selected old variant was accepted again');
  assert.equal(signature(changed[1]),signature(base[1]));unique(changed);
  return {forcedFirstDraw:old};
});
core('replacement fails instead of retaining an old variant when every alternative is used',()=>{
  const {api,register}=harness();register('QA1',2);
  exhaustion(()=>api.buildProblems('QA1',1,2,53,{0:'exhaustedreplacement'}));
});
core('same-seed rounds share exclusions; resolved codes replay exactly in isolation',()=>{
  const {w,api,register}=harness();register('QA1',1000);
  const seen=new Set(),seed='shared';
  const a=api.buildProblems('QA1',1,24,w.NM_RNG.hashSeed(seed),null,null,seen);
  const b=api.buildProblems('QA1',1,24,w.NM_RNG.hashSeed(seed),null,null,seen);
  unique([...a,...b]);assert.equal(seen.size,48);
  assert(b.resolvedOverrides&&Object.keys(b.resolvedOverrides).length,'Collision replacements must survive code serialization');
  const code=api.worksheetCode({thread:'QA1',level:1,count:24,seed,overrides:b.resolvedOverrides});
  const replay=api.parseWorksheetCode(code);
  assert(replay,'Resolved code is not parseable');
  const c=api.buildProblems(replay.thread,replay.level,replay.count,w.NM_RNG.hashSeed(replay.seed),replay.overrides);
  assert.deepEqual(signatures(c),signatures(b),'Printed round code replays different questions');
  return {questions:48,resolvedOverrides:Object.keys(b.resolvedOverrides).length};
});
core('shared exclusions are transactional when generation exhausts',()=>{
  const {api,register}=harness();register('QA1',2);
  const first=api.buildProblems('QA1',1,1,71),seen=new Set([api.problemKey(first[0])]);
  const before=Array.from(seen);
  exhaustion(()=>api.buildProblems('QA1',1,2,79,null,null,seen));
  assert.deepEqual(Array.from(seen),before,'Failed build contaminated exclusions for subsequent recovery');
  const recovered=api.buildProblems('QA1',1,1,79,null,null,seen);
  unique([...first,...recovered]);assert.equal(seen.size,2);
});
core('different graph geometry survives identical expression and answer',()=>{
  const {api,register}=harness();register('QA1',12,'graph');
  const ps=api.buildProblems('QA1',1,12,83);unique(ps);assert.equal(new Set(ps.map(p=>p.graph.a)).size,12);
  const a={tex:'x',answer:2,graph:{kind:'line',a:1,b:0}},b={answer:2,graph:{b:0,a:1,kind:'line'},tex:'x'};
  assert.equal(api.problemKey(a),api.problemKey(b),'Object property insertion order must not disguise the same graph');
});
core('word-only questions and choices are not collapsed to the same answer index',()=>{
  const {api,register}=harness();register('QA1',12,'word');
  const ps=api.buildProblems('QA1',1,12,89);unique(ps);assert.equal(ps.length,12);
  const a={word:{ko:'고르세요'},wordAsk:{ko:'같은 값을 고르세요'},choices:{ko:['1','2']},answer:1};
  const b={...a,choices:{ko:['3','4']}};
  assert.notEqual(api.problemKey(a),api.problemKey(b),'Different visible choices must be part of the identity');
});
core('a printed prompt is part of the identity when the bare expression is ambiguous',()=>{
  const {api}=harness();
  const multiple10={tex:'10\\square',answer:0,prompt:{ko:'10의 배수가 되게 하세요.'}};
  const multiple5={tex:'10\\square',answer:5,prompt:{ko:'5의 배수가 되게 하세요.'}};
  assert.notEqual(api.problemKey(multiple10),api.problemKey(multiple5),
    'DV6-style prompts change the learner-visible mathematical task');
  const hiddenHintA={tex:'2+3=\\square',answer:5,prompt:{ko:'먼저 2를 보세요.'}};
  const hiddenHintB={tex:'2+3=\\square',answer:5,prompt:{ko:'먼저 3을 보세요.'}};
  assert.equal(api.problemKey(hiddenHintA),api.problemKey(hiddenHintB),
    'A non-printed hint must not create a cosmetic variant');
});
core('worksheet replay offsets are bounded and malformed codes fail closed',()=>{
  const {api}=harness();
  assert.equal(api.parseWorksheetCode('#QA1-L1x10-safe~e.1024'),null);
  assert.equal(api.parseWorksheetCode('#QA1-L1x10-safe~gs0.999999999'),null);
  assert.throws(()=>api.worksheetCode({thread:'QA1',level:1,count:10,seed:'safe',exampleSkip:1024}),e=>e&&e.name==='RangeError');
  assert.throws(()=>api.worksheetCode({thread:'QA1',level:1,count:10,seed:'safe',guideSkips:[0,1024]}),e=>e&&e.name==='RangeError');
  const edge=api.worksheetCode({thread:'QA1',level:1,count:10,seed:'safe',exampleSkip:1023,guideSkips:[1023]});
  assert.equal(api.parseWorksheetCode(edge).exampleSkip,1023);
  assert.equal(api.parseWorksheetCode(edge).guideSkips[0],1023);
});
core('public mixed-set builder excludes collisions across identical rounds',()=>{
  const {api,register}=harness();register('QA1',1000);
  const items=[{thread:'QA1',level:1,seed:'twice',wordType:'none'},{thread:'QA1',level:1,seed:'twice',wordType:'none'}];
  const a=api.buildMixedProblemSet(items,24),b=api.buildMixedProblemSet(items,24);
  assert.equal(a.flat.length,24);unique(a.flat);assert.deepEqual(signatures(a.flat),signatures(b.flat));
});
core('actual middle-school generators: repeated types stay unique and reproducible',()=>{
  const {w,api}=harness(true);let questions=0;
  for(const [t,lv] of [
    ['MD2',2],['MD9',5],['MD11',4],['MD13',1],['MD13',4],['MD15',2],['MD15',4],
    ['MD63',1],['MD64',2],['MD64',4],['MD69',3],['MD84',4],['MD85',3],['MD86',5],['MD87',3],['MD88',2]
  ]){
    assert(w.NM_THREADS[t]&&w.NM_THREADS[t].levels.some(l=>l.id===lv),'Missing real regression level '+t+'/'+lv);
    const seen=new Set(),seed=w.NM_RNG.hashSeed('real'+t);
    const a=api.buildProblems(t,lv,12,seed,null,null,seen),b=api.buildProblems(t,lv,12,seed,null,null,seen);
    unique([...a,...b],t+' repeats');questions+=a.length+b.length;
    const replay=api.buildProblems(t,lv,12,seed,b.resolvedOverrides);
    assert.deepEqual(signatures(replay),signatures(b),t+' replay changed');
  }
  return {questions};
});
core('ML25 finite levels reserve distinct teaching variants after 12 practice questions',()=>{
  const {w,api}=harness(true);
  for(let lv=1;lv<=4;lv++){
    const seen=new Set(),seed=w.NM_RNG.hashSeed('ML25/'+lv);
    const practice=api.buildProblems('ML25',lv,12,seed,null,null,seen);
    const teaching=api.buildProblems('ML25',lv,4,seed^0x9e3779b9,null,null,seen);
    unique([...practice,...teaching],'ML25 L'+lv+' repeats');
    assert.equal(seen.size,16,'ML25 L'+lv+' must expose exactly 16 reserved variants');
  }
  return {levels:4,questions:64};
});
core('NL14 and NL16 tally levels reserve 12 practice, one example and three guided variants',()=>{
  const {w,api}=harness(true);
  for(const [thread,level] of [['NL14',1],['NL14',2],['NL16',1],['NL16',2]]){
    const seen=new Set(),base=thread+'/'+level+'/finite';
    const practice=api.buildProblems(thread,level,12,w.NM_RNG.hashSeed(base+'/practice'),null,null,seen);
    const example=api.buildProblems(thread,level,1,w.NM_RNG.hashSeed(base+'/example'),null,null,seen);
    const guided=api.buildProblems(thread,level,3,w.NM_RNG.hashSeed(base+'/guided'),null,null,seen);
    const all=[...practice,...example,...guided];
    unique(all,thread+' L'+level+' repeats across practice/example/guided');
    assert.equal(seen.size,16,thread+' L'+level+' must reserve 16 learner-visible variants');
    if(thread==='NL14') assert(new Set(all.map(p=>p.startCount)).size>1,
      thread+' L'+level+' did not vary the visible starting tally');
    else assert(new Set(all.map(p=>JSON.stringify(p.tallyGroups))).size===16,
      thread+' L'+level+' repeated a visible tally grouping');
  }
  return {levels:4,practiceQuestions:48,examples:4,guidedQuestions:12};
});
core('DC6 finite levels reserve distinct teaching variants after 12 practice questions',()=>{
  const {w,api}=harness(true);
  for(let lv=1;lv<=3;lv++){
    const seen=new Set(),seed=w.NM_RNG.hashSeed('DC6/'+lv);
    const practice=api.buildProblems('DC6',lv,12,seed,null,null,seen);
    const teaching=api.buildProblems('DC6',lv,4,seed^0x9e3779b9,null,null,seen);
    unique([...practice,...teaching],'DC6 L'+lv+' repeats');
    assert.equal(seen.size,16,'DC6 L'+lv+' must reserve 16 visible variants');
  }
  return {levels:3,questions:48};
});
core('NL finite levels reserve 12 practice, one example and three guided variants',()=>{
  const {w,api}=harness(true);
  const levels=[['NL4',3],['NL5',3],['NL6',1],['NL12',1]];
  for(const [thread,level] of levels){
    const seen=new Set();
    const practice=api.buildProblems(thread,level,12,w.NM_RNG.hashSeed('NL-practice/'+thread+'/'+level),null,null,seen);
    const example=api.buildProblems(thread,level,1,w.NM_RNG.hashSeed('NL-example/'+thread+'/'+level),null,null,seen);
    const guided=api.buildProblems(thread,level,3,w.NM_RNG.hashSeed('NL-guided/'+thread+'/'+level),null,null,seen);
    const all=[...practice,...example,...guided];
    unique(all,thread+' L'+level+' repeats across practice/example/guided');
    assert.equal(all.length,16,thread+' L'+level+' did not produce the full learner-visible set');
    assert.equal(seen.size,16,thread+' L'+level+' did not reserve all 16 visible identities');
    exhaustion(()=>api.buildProblems(thread,level,17,w.NM_RNG.hashSeed('NL-exhaust/'+thread+'/'+level)));
  }
  return {levels:levels.length,practice:48,examples:4,guided:12,questions:64};
});
core('MD82 number-line levels reserve all four teaching variants',()=>{
  const {w,api}=harness(true);
  for(let lv=1;lv<=3;lv++){
    const seen=new Set(),seed=w.NM_RNG.hashSeed('MD82/'+lv);
    const practice=api.buildProblems('MD82',lv,12,seed,null,null,seen);
    const teaching=api.buildProblems('MD82',lv,4,seed^0x85ebca6b,null,null,seen);
    unique([...practice,...teaching],'MD82 L'+lv+' repeats');
    assert.equal(seen.size,16,'MD82 L'+lv+' must reserve 16 visible variants');
  }
  return {levels:3,questions:48};
});

async function browserChecks(){
  // Deliberately a real browser and public editor API, not a fake DOM renderer.
  const {chromium}=require('playwright'),http=require('http');
  const server=http.createServer((req,res)=>{
    const f=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));
    if(!f.startsWith(root+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);return res.end();}
    res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png'})[path.extname(f)]||'application/octet-stream');
    fs.createReadStream(f).pipe(res);
  });
  await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
  try{
    browser=await chromium.launch(process.env.NM_CHROMIUM?{executablePath:process.env.NM_CHROMIUM}:{});
    const page=await browser.newPage({viewport:{width:1440,height:1050}}),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.route('**/*',r=>!['GET','HEAD'].includes(r.request().method())||/supabase|google-analytics/.test(r.request().url())?r.abort():r.continue());
    await page.addInitScript(()=>{window.NM_NO_AUTOPRINT=true;window.__printCalls=0;window.print=()=>{window.__printCalls++;};localStorage.setItem('nm_state_v1',JSON.stringify({lang:'ko',onboarded:true,name:'중복 검수',cloudLinked:false,progress:{}}));});
    await page.goto('http://127.0.0.1:'+server.address().port+'/drill.html',{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForFunction(()=>window.NM_EXAM&&window.NM_THREADS);
    await page.evaluate(()=>{
      function reg(t,size){
        NM_THREADS[t]={id:t,gen:'qa_'+t,name:{ko:'중복 검수 '+t,en:'Uniqueness QA',zh:'重复验证'},levels:[{id:1,label:{ko:'기본'},params:{mode:'fixture',size}}]};
        NM_TGEN['qa_'+t]=(p,rng)=>{const n=Math.floor(rng()*p.size);return {tex:`${n} + 1 = \\square`,answer:n+1,answerType:'number',widget:'numpad',prompt:{ko:'계산하세요.',en:'Calculate.',zh:'计算。'}};};
      }
      reg('QA1',1000);reg('QB1',2);
      window.__qaItems=[{thread:'QA1',level:1,count:10,seed:'samebrowser',noTeach:true},{thread:'QA1',level:1,count:10,seed:'samebrowser',noTeach:true}];
      NM_EXAM.openPrintEditor(__qaItems,'중복 검수',{count:10});
    });
    function values(selector){return page.locator(selector+' .nm-w2-item').evaluateAll(es=>es.map(e=>{const tex=e.querySelector('.nm-w2-tex'),c=e.cloneNode(true);c.querySelectorAll('.nm-w2-numrow,.nm-pe-cell-swap').forEach(x=>x.remove());return tex?tex.dataset.tex:c.textContent.replace(/\s+/g,' ').trim();}));}
    function slotValues(){return page.locator('#nm-pe-overlay .nm-w2-item').evaluateAll(es=>Object.fromEntries(es.map(e=>{const tex=e.querySelector('.nm-w2-tex'),c=e.cloneNode(true);c.querySelectorAll('.nm-w2-numrow,.nm-pe-cell-swap').forEach(x=>x.remove());return [e.closest('.nm-pe-round').dataset.round+':'+e.dataset.slot,tex?tex.dataset.tex:c.textContent.replace(/\s+/g,' ').trim()];})));}
    const preview=await values('#nm-pe-overlay');assert.equal(preview.length,20);assert.equal(new Set(preview).size,20,'Editor repeats a variant across identical rounds');
    const original=await values('#nm-pe-overlay .nm-pe-round[data-round="0"]');
    for(let i=0;i<10;i++){
      const before=await slotValues();
      await page.locator('#nm-pe-overlay .nm-pe-round[data-round="0"] .nm-w2-item[data-slot="0"] .nm-pe-cell-swap').click();
      const after=await slotValues();assert.equal(new Set(Object.values(after)).size,20);
      assert.notDeepEqual(after,before,'Cell replacement retained the old variant');
      const changes=Object.keys(after).filter(k=>after[k]!==before[k]);
      assert.deepEqual(changes,['0:0'],'Cell replacement changed other slots: '+JSON.stringify(changes.map(k=>({slot:k,before:before[k],after:after[k]}))));
    }
    // Force the next generated seed to draw the current already-overridden
    // variant first. Random swaps alone almost never exercise this regression.
    const beforeForced=await slotValues();
    const forced=await page.evaluate(()=>{
      const code=document.querySelector('.nm-pe-round[data-round="0"]').dataset.code,cfg=NM_EXAM.parseWorksheetCode(code);
      const p=NM_EXAM.buildProblems(cfg.thread,cfg.level,cfg.count,NM_RNG.hashSeed(cfg.seed),cfg.overrides).find(p=>p.__slot===0);
      const n=Number(p.tex.match(/^\d+/)[0]);let found;
      for(let i=0;i<100000;i++){const s='forced'+i;if(Math.floor(NM_RNG.mulberry32(NM_RNG.hashSeed(s+'#0'))()*1000)===n){found=s;break;}}
      if(!found)throw Error('Could not build current-variant repeat fixture');
      const original=NM_RNG.newCode;let first=true;window.__qaRestoreNewCode=()=>{NM_RNG.newCode=original;};
      NM_RNG.newCode=()=>first?(first=false,found):original();
      return {n,seed:found};
    });
    await page.locator('#nm-pe-overlay .nm-pe-round[data-round="0"] .nm-w2-item[data-slot="0"] .nm-pe-cell-swap').click();
    await page.evaluate(()=>__qaRestoreNewCode());
    const afterForced=await slotValues();
    assert.notEqual(afterForced['0:0'],beforeForced['0:0'],'Forced next seed re-selected current overridden variant '+JSON.stringify(forced));
    assert.deepEqual(Object.keys(afterForced).filter(k=>afterForced[k]!==beforeForced[k]),['0:0'],'Forced replacement changed unselected variants');
    assert.equal(new Set(Object.values(afterForced)).size,20);
    const selected=await values('#nm-pe-overlay');
    await page.locator('#nm-pe-print').click();
    assert.deepEqual(await values('.nm-print-sheet'),selected,'Printed problems differ from the selected preview');
    report.browser.push({name:'cross-round uniqueness, ten random and one forced-repeat cell replacements, preview/print parity',status:'pass',questions:20,originalQuestions:original.length});

    // Teaching selections are part of the replay contract. The second copy of
    // an identical round must serialize the skips it needed to avoid every
    // practice/example/guided collision, then reproduce that teaching exactly
    // when its worksheet code is opened alone.
    await page.evaluate(()=>NM_EXAM.openPrintEditor([
      {thread:'QA1',level:1,count:10,seed:'teachingreplay'},
      {thread:'QA1',level:1,count:10,seed:'teachingreplay'}
    ],'예시 재현 검수',{count:10}));
    const teachingSnapshot=sel=>page.locator(sel).evaluateAll(es=>es.map(e=>({
      text:e.textContent.replace(/\s+/g,' ').trim(),
      tex:Array.from(e.querySelectorAll('[data-tex]'),x=>x.getAttribute('data-tex'))
    })));
    const secondCode=await page.locator('.nm-pe-round[data-round="1"]').getAttribute('data-code');
    assert(/~(?:e|gs[0-2])\./.test(secondCode),'Collision-resolved teaching skips were not serialized');
    const secondTeaching=await teachingSnapshot('.nm-pe-round[data-round="1"] .nm-w2-example, .nm-pe-round[data-round="1"] .nm-w2-guide-item');
    await page.evaluate(code=>{
      const cfg=NM_EXAM.parseWorksheetCode(code);
      if(!cfg)throw Error('Could not parse teaching replay code');
      NM_EXAM.openPrintEditor([cfg],'예시 단독 재현',{count:cfg.count});
    },secondCode);
    assert.deepEqual(await teachingSnapshot('.nm-pe-round[data-round="0"] .nm-w2-example, .nm-pe-round[data-round="0"] .nm-w2-guide-item'),secondTeaching,
      'Standalone worksheet code changed the selected example/guided variants');

    // Changing 10 -> 20 invalidates old exact teaching offsets. A 30-variant
    // fixture still has enough room (20 practice + 4 teaching) and must rebuild
    // instead of reporting false exhaustion.
    await page.evaluate(()=>{
      NM_THREADS.QC1={id:'QC1',gen:'qa_QC1',name:{ko:'수 변경 검수'},levels:[{id:1,label:{ko:'기본'},params:{mode:'fixture',size:30}}]};
      NM_TGEN.qa_QC1=(p,rng)=>{const n=Math.floor(rng()*p.size);return {tex:`${n} + 2 = \\square`,answer:n+2,answerType:'number',widget:'numpad'};};
      NM_EXAM.openPrintEditor([{thread:'QC1',level:1,seed:'cnt0'}],'문항 수 변경 검수',{count:10});
    });
    await page.locator('#nm-pe-count-seg button[data-n="20"]').click();
    assert.equal(await page.locator('[data-nm-unique-error]').count(),0,'Count change reused stale teaching offsets and falsely exhausted');
    assert.equal(await page.locator('.nm-pe-round .nm-w2-item').count(),20);
    assert(await page.locator('#nm-pe-print').isEnabled());

    // A fixed type+level already in the mix cannot be selected a second time.
    await page.locator('#nm-pe-add').click();
    const usedType=page.locator('.nm-pe-pick-item[data-t="QC1"][data-lv="1"]').last();
    assert(await usedType.isDisabled(),'Picker permits the same fixed type+level twice');
    await page.locator('.nm-pe-pick-backdrop').click({position:{x:2,y:2}});

    // Repeated graph rounds keep one concept/example page and reserve distinct
    // learner graphs for both practice rounds.
    await page.evaluate(()=>NM_EXAM.openPrintEditor([
      {thread:'MD51',level:1,kind:'drawing',mode:'direct',variant:'basic',count:1,seed:'graph-repeat'},
      {thread:'MD51',level:1,kind:'drawing',mode:'direct',variant:'basic',count:1,seed:'graph-repeat'}
    ],'그래프 중복 검수',{pacing:true,count:1}));
    assert.equal(await page.locator('.nm-draw-teaching').count(),1,'Repeated graph rounds duplicated the fixed concept example');
    const graphTex=await page.locator('.nm-draw-practice .nm-draw-item .nm-w2-tex').evaluateAll(es=>es.map(e=>e.dataset.tex));
    assert.equal(graphTex.length,2);assert.equal(new Set(graphTex).size,2,'Repeated graph rounds reused a practice graph');
    report.browser.push({name:'teaching replay, count-change rebuild, disabled duplicate picker and graph lesson uniqueness',status:'pass'});

    await page.evaluate(()=>NM_EXAM.openPrintEditor([{thread:'QB1',level:1,count:10,seed:'finite',noTeach:true},{thread:'QA1',level:1,count:10,seed:'recover',noTeach:true}],'부족한 변형 검수',{count:10}));
    assert(await page.locator('#nm-pe-overlay [data-nm-unique-error][role="alert"]').isVisible(),'Pool exhaustion lacks a visible accessible error');
    assert(await page.locator('#nm-pe-print').isDisabled(),'Printing remains enabled after failed generation');
    assert.equal(await page.locator('#nm-pe-overlay .nm-pe-round[data-round="0"] .nm-w2-item').count(),0,'Failed round displays partial or duplicated questions');
    await page.locator('#nm-pe-overlay [data-remove-btn="0"]').click();
    assert.equal(await page.locator('#nm-pe-overlay [data-nm-unique-error]').count(),0,'Recovered editor retains stale exhaustion error');
    assert(await page.locator('#nm-pe-print').isEnabled(),'Printing does not recover after removing the exhausted type');
    assert.equal((await values('#nm-pe-overlay')).length,10);
    assert.deepEqual(errors,[],'Editor raised uncaught browser errors');
    report.browser.push({name:'visible exhaustion, disabled print, no partial round, successful recovery',status:'pass'});
    if(process.env.NM_UNIQUE_ARTIFACTS){fs.mkdirSync(process.env.NM_UNIQUE_ARTIFACTS,{recursive:true});await page.screenshot({path:path.join(process.env.NM_UNIQUE_ARTIFACTS,'uniqueness-recovered-editor.png')});}
  }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
}
(async()=>{
  if(process.argv.includes('--browser')){
    try{await browserChecks();console.log('PASS browser uniqueness / failure recovery');}
    catch(e){report.failures.push({stage:'browser',error:e.message,stack:e.stack});console.error('FAIL browser: '+e.stack);}
  }
  const summary={corePass:report.core.filter(t=>t.status==='pass').length,coreFail:report.core.filter(t=>t.status==='fail').length,browserPass:report.browser.length,browserRequested:process.argv.includes('--browser'),failures:report.failures.length};
  if(process.env.NM_UNIQUE_ARTIFACTS){fs.mkdirSync(process.env.NM_UNIQUE_ARTIFACTS,{recursive:true});fs.writeFileSync(path.join(process.env.NM_UNIQUE_ARTIFACTS,'worksheet-uniqueness-results.json'),JSON.stringify({...report,summary},null,2));}
  console.log(JSON.stringify(summary));process.exitCode=report.failures.length?1:0;
})();
