(function(){
const $=id=>document.getElementById(id), P=Planner, I=PlannerIntake, D=DemoContent;
const opt=(el,list,sel)=>{ el.innerHTML=list.map(([v,t])=>`<option value="${v}"${String(v)===String(sel)?' selected':''}>${t}</option>`).join(''); };
const state={hwOn:'1',gifted:'1',planMode:'table',kmo:'switch'};
const d=new Date(); $('year').value=d.getFullYear();
opt($('mon'),[3,4,5,6,7,8,9,10,11,12,1,2].map(m=>[m,m+'월']),d.getMonth()+1);
opt($('school'),[...Array.from({length:12},(_,i)=>[i+1,P.SEM(i+1)+' 디딤돌']),[13,'계통 · 대수 정리'],...P.MID.map((x,i)=>[14+i,x+' 원리해설'])],9);
opt($('comp'),P.COMP.map((c,i)=>[i,c[0]]),4);
opt($('calc'),P.CALC.map((c,i)=>[i,c[0]]),9);
const months=n=>Array.from({length:n},(_,i)=>[i+1,(i+1)+'개월']);
opt($('schoolLeft'),months(4),1); opt($('compLeft'),months(7),7);
opt($('calcLeft'),months(6),1);

// 레벨: 고르면 그 레벨의 '지금 진도'를 레벨표에서 읽어 채운다(앞으로는 예시 로드맵 규칙)
const LV=window.PLANNER_LEVELS||[];
opt($('level'),[['ex','예시 · 대치 소마 A2→A1 정도 (L8~L9)'],...LV.map(l=>[l.id,`${l.id} · ${l.summary}`]),['manual','직접 입력']],'ex');
const EX={school:9,schoolLeft:1,comp:4,compLeft:7,calc:9,calcLeft:1,speed:2};
const at=(bs,m)=>bs.find(b=>b[1]<=m&&b[2]>=m);
const nextOf=(bs,m,re)=>bs.filter(b=>b[2]>=m&&(!re||re.test(b[0]))).sort((a,b)=>a[1]-b[1])[0];
function schoolIdx(t){ let r=t.match(/^(\d)-(\d)/); if(r) return 2*(+r[1]-1)+(+r[2]); if(/계통|여유/.test(t)) return 13; r=t.match(/^중(\d)-(\d)/); if(r) return 14+2*(+r[1]-1)+(+r[2]-1); return null; }
function compIdx(t){ const K=[/초등팩토 1|킨더|키즈/,/필즈 베이직/,/1031 입문/,/TOT/,/1031 초급/,/1031 중급/,/3% 1과정/,/왕수학 응용 4/]; const i=K.findIndex(re=>re.test(t)); return i<0?null:i; }
function calcIdx(t){ let r=t.match(/기적의 계산법 (\d+)/); if(r) return +r[1]-1; if(/소마셈/.test(t)) return 1; const i=P.CALC.findIndex(c=>t.includes(c[0].replace('기적의 ',''))); return i<0?null:i; }
function hwOptions(){
  const g=+$('grade').value, now=P.mOf(g,+$('mon').value), A0=P.mOf(g,3), list=[];
  for(let m=now+2;m<=Math.min(A0+45,P.mOf(4,11));m++) if(m%12===10||m%12===1) list.push([m,`${P.label(m)}${m%12===1?' (편입)':''}`]);
  const cur=$('hw').value; opt($('hw'),list,list.some(x=>String(x[0])===cur)?cur:((list.find(x=>x[0]%12===1)||list[0]||[''])[0]));
}
function setSeg(k,v){ state[k]=String(v); document.querySelectorAll(`.seg[data-k="${k}"] button`).forEach(b=>{const on=b.dataset.v===String(v);b.classList.toggle('on',on);b.setAttribute('aria-pressed',String(on));}); }
function applyLevel(){
  const id=$('level').value; if(id==='manual') return;
  const set=(k,v)=>{ $(k).value=String(v); };
  if($('band').value!=='D') $('band').value=P.bandOf(id); $('speed').disabled=['C','D'].includes($('band').value);
  if(id==='ex'){ Object.entries(EX).forEach(([k,v])=>set(k,v)); hwOptions(); setSeg('hwOn',1); return; }
  const L=LV.find(l=>l.id===id), now=P.mOf(+$('grade').value,+$('mon').value);
  const sb=(at(L.school,now)&&schoolIdx(at(L.school,now)[0])!=null)?at(L.school,now):nextOf(L.school,now,/^\d-\d|^중|계통|여유/);
  if(sb){ set('school',schoolIdx(sb[0])); set('schoolLeft',Math.min(4,Math.max(1,sb[1]>now?sb[2]-sb[1]+1:sb[2]-now+1))); }
  const cb=at(L.comp,now)||nextOf(L.comp,now), ck=cb&&compIdx(cb[0]);
  if(ck!=null){ set('comp',ck); set('compLeft',Math.min(7,Math.max(1,cb[1]>now?P.COMP[ck][1]:cb[2]-now+1))); }
  const kb=at(L.calc,now)||nextOf(L.calc,now), kk=kb&&calcIdx(kb[0]);
  if(kk!=null){ set('calc',kk); set('calcLeft',Math.min(6,Math.max(1,kb[1]>now?kb[2]-kb[1]+1:kb[2]-now+1))); }
  set('speed',+id.slice(1)>=10?3:2);
  hwOptions(); const E=L.hwExam;
  if(E!=null&&[...$('hw').options].some(o=>o.value===String(E))){ set('hw',E); setSeg('hwOn',1); } else setSeg('hwOn',0);
}
function read(){ const on=state.hwOn==='1'; return {band:$('band').value,grade:+$('grade').value,mon:+$('mon').value,year:+$('year').value,school:+$('school').value,schoolLeft:+$('schoolLeft').value,comp:+$('comp').value,compLeft:+$('compLeft').value,calc:+$('calc').value,calcLeft:+$('calcLeft').value,speed:+$('speed').value,
  hw:on&&$('hw').value?$('hw').value:'none',hwDeep:on&&$('hwDeep').checked,hwMid:on&&$('hwMid').checked,gifted:state.gifted==='1',kmo:state.kmo}; }
function draw(){
  const profile=I.profile(answers,intakeFields());drawIntake(profile);if(I.sourceMode(answers,intakeFields())){drawSourceProfile(profile);return;}
  const o=read(), plan=P.build(o); lastPlan=plan; const nm=$('name').value.trim()||'우리 아이';
  $('who').textContent=nm; $('who2').textContent=nm;
  $('hwOpts').style.display=state.hwOn==='1'&&['A','B'].includes(plan.band)?'block':'none';
  $('kmoChoice').style.display=plan.band==='D'?'block':'none';
  $('warn').innerHTML=plan.warn.map(w=>`<div class="warn">⚠ ${w}</div>`).join('');
  const R=k=>(plan.rows.find(r=>r.key===k)||{blocks:[]}).blocks, cur=k=>{ const b=R(k).find(x=>x[1]<=plan.now&&x[2]>=plan.now); return b?b[0]:'—'; };
  const strip=t=>t.replace(/<br>.*$/,'');
  $('nowItems').innerHTML=[['📘','교과',strip(cur('school'))],['💡',plan.band==='D'?'경시':'사고력',strip(cur('comp'))],['➕','연산',strip(cur('calc'))]].map(([i,a,b])=>`<div class="item"><span class="ic">${i}</span><div><small>${a}</small><b>${b}</b></div></div>`).join('');
  const ms=P.milestones(plan), steps=ms.main.filter(x=>x.kind!=='now'&&x.m>plan.now), next=steps[0], later=steps[1];
  $('dNow').innerHTML=`● 현재 <small>${P.label(plan.now)} · ${cur('school').replace(/ 디딤돌.*/,'')}</small>`;
  $('dNext').innerHTML=next?`⚑ 다음 과정 <small>${next.title} · ${P.label(next.m)}</small>`:'⚑ 다음 과정';
  $('dLater').innerHTML=later?`⌖ 그다음 <small>${later.title} · ${P.label(later.m)}</small>`:'⌖ 시기 미정';
  drawMap(mapMilestones(plan));
  drawRoutes(plan);
  saveDraft();
  $('tbl').innerHTML=P.renderTable(plan); if(plan.A1-plan.A0>50) $('tbl').querySelector('table').classList.add('wide'); $('simple').innerHTML=P.renderSimple(plan);
  $('tbl').style.display=state.planMode==='table'?'block':'none'; $('simple').style.display=state.planMode==='simple'?'block':'none';
  $('stages').innerHTML=P.narrative(plan).map(y=>`<div class="stg"><h4>${y.title}</h4>
    <div class="mrow">${y.months.map(c=>`<div class="mc${c.now?' now':''}${c.past?' past':''}"><b>${c.mon}</b>${c.starts.map(t=>`<span class="st">${t}</span>`).join('')}${c.issues.map(t=>`<span class="is">${t}</span>`).join('')}</div>`).join('')}</div>
    <dl class="cm">${y.items.map(it=>`<dt>${it.label}</dt><dd>${it.text}</dd>`).join('')}</dl></div>`).join('');
  const lvName=$('level').selectedOptions[0].textContent;
  $('repItems').innerHTML=[['📖','현재 학습',`${strip(cur('school'))} · ${strip(cur('comp'))}`],['👤','기준 레벨',`${lvName} · ${plan.bandName}`],['💡','다음 과정',next?`${next.title} (${P.label(next.m)})`:'—'],['📅','다음 확인','학습 경험 후 조정 · 경로는 언제든 바꿀 수 있어요']]
    .map(([i,a,b])=>`<div class="ritem"><span class="ic">${i}</span><div><small>${a}</small><b>${b}</b></div></div>`).join('');
  const bg=P.bookGuide(plan);
  $('books').innerHTML=bg.stages.map(st=>`<div class="bk${st.now?' now':''}"><h4>${st.stage}${st.now?' <span>지금</span>':''}</h4>${st.rows.map(([l,b])=>`<p><small>${l}</small>${b}</p>`).join('')}</div>`).join('')+`<p class="bk-note">${bg.note}</p>`;
}
// 3D 맵: three.js(map3d.js, 수의 나라와 같은 three · 아이 캐릭터). WebGL 이 없으면 CSS 맵.
let map3d=null, mapBusy=null, mapNext=null, map3dFailed=false;
function drawMap(ms){
  if(map3dFailed){ $('map').innerHTML='<p class="map-unavailable">3D를 불러오지 못했어요. 위 갈림길과 아래 이정표에서 같은 경로를 확인할 수 있어요.</p>'; return; }
  mapNext=ms; if(mapBusy) return;
  mapBusy=(async()=>{ while(mapNext){ const d=mapNext; mapNext=null;
    try{ if(!map3d){ const mod=await import('./map3d.js'); map3d=await mod.mountMap3D($('map'),d,{}); if(!map3d) throw new Error('no webgl'); } else await map3d.update(d); }
    catch(e){ console.warn('[map3d]',e); map3dFailed=true; $('map').innerHTML='<p class="map-unavailable">3D를 불러오지 못했어요. 위 갈림길과 아래 이정표에서 같은 경로를 확인할 수 있어요.</p>'; break; } }
    mapBusy=null; })();
}
let lastPlan=null;
function showView(v){ document.querySelectorAll('.nav button,.dock .vsw button').forEach(b=>b.classList.toggle('on',b.dataset.v===v)); document.querySelectorAll('.view').forEach(x=>x.classList.toggle('on',x.id===v)); if(v==='vmap'&&map3dFailed) P.bindMap($('map')); }
document.querySelectorAll('.nav button,.dock .vsw button').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.v)));
document.querySelectorAll('.seg').forEach(s=>s.addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return; setSeg(s.dataset.k,b.dataset.v); draw(); }));
['hw','hwDeep','hwMid'].forEach(id=>$(id).addEventListener('change',()=>{ $('level').value='manual'; draw(); }));
$('openSet').onclick=()=>ask('age'); $('detailSet').onclick=()=>{ $('drawer').inert=false; $('drawer').classList.add('on'); $('closeSet').focus(); }; $('closeSet').onclick=()=>{ $('drawer').classList.remove('on'); $('drawer').inert=true; $('detailSet').focus(); };
document.addEventListener('keydown',e=>{if(!$('drawer').classList.contains('on'))return;if(e.key==='Escape')$('closeSet').click();if(e.key==='Tab'){const list=[...$('drawer').querySelectorAll('button,select,input,summary')].filter(x=>!x.disabled&&x.offsetParent);const first=list[0],last=list.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
const PROG=['school','schoolLeft','comp','compLeft','calc','calcLeft','speed','band'];
$('ctl').addEventListener('change',e=>{ const id=e.target.id;
  if(id==='grade'){answers.grade=$('grade').value;if(answers.age){const y=5+Math.floor(P.mOf(+$('grade').value,+$('mon').value)/12);answers.age=y<=9?String(y):'older';}} const savedHw=state.hwOn; if(id==='grade'||id==='mon'){if(answers.age){if(answers.age==='older'){const y=5+Math.floor(P.mOf(+$('grade').value,+$('mon').value)/12);if(y<=9)answers.age=String(y);}const changes=I.fieldChanges(answers,intakeFields(),'age');Object.entries(changes).forEach(([k,v])=>$(k).value=v);hwOptions();}else{hwOptions();applyLevel();}} else if(id==='level') applyLevel(); if(PROG.includes(id)) $('level').value='manual';if(answers.age)syncDetailedAnswers(id); if(Object.hasOwn(answers,'hw'))setSeg('hwOn',savedHw);
  $('speed').disabled=['C','D'].includes($('band').value); draw(); });
$('name').addEventListener('input',draw);

const answers={}, history=[];let completed=false;
const storageKey='gfield.demo2.v1';
const draftIds=['level','band','year','grade','mon','school','schoolLeft','comp','compLeft','calc','calcLeft','speed','hw','hwDeep','hwMid'];
function saveDraft(){try{sessionStorage.setItem(storageKey,JSON.stringify({version:1,answers,history,completed,question,state,fields:Object.fromEntries(draftIds.map(id=>[id,$(id).type==='checkbox'?$(id).checked:$(id).value]))}));}catch{}}
function restoreDraft(){try{const d=JSON.parse(sessionStorage.getItem(storageKey));if(d?.version!==1)return false;for(const id of draftIds){const v=d.fields?.[id];if(v===undefined)continue;if($(id).type==='checkbox')$(id).checked=!!v;else if(id!=='hw')$(id).value=String(v);}hwOptions();if([...$('hw').options].some(o=>o.value===d.fields.hw))$('hw').value=d.fields.hw;Object.assign(answers,d.answers);Object.assign(state,d.state);Object.keys(state).forEach(k=>setSeg(k,state[k]));history.push(...(d.history||[]));completed=!!d.completed;$('speed').disabled=['C','D'].includes($('band').value);if(completed)finish();else{draw();ask(questionOrder().includes(d.question)?d.question:'age');}return true;}catch{return false;}}
let question='age';
function syncDetailedAnswers(id){
 const all=id==='level';
 if(all||['school','schoolLeft'].includes(id)){const n=+$('school').value;answers.school=n<=6?P.SEM(n):'advanced';if(n>6)answers.schoolExact=String(n);}
 if(all||['comp','compLeft'].includes(id)){const n=+$('comp').value;answers.thinking=({0:'초등팩토',1:'PRE 1031',2:'1031 입문',4:'1031 초급'})[n]||'advanced';if(n===1)answers.preDone='1';if(answers.thinking==='advanced')answers.compExact=String(n);answers.thinkingStatus='progress';}
 if(all||['calc','calcLeft'].includes(id)){const n=+$('calc').value;answers.calc=n>=1&&n<=5?'기적의 계산법 '+(n+1)+'권':'advanced';if(answers.calc==='advanced')answers.calcExact=String(n);answers.calcStatus='progress';}
}
function intakeFields(){return {grade:$('grade').value,mon:$('mon').value,band:$('band').value,speed:$('speed').value};}
function questionOrder(){return I.order(answers,intakeFields());}
function ask(key){
 const order=questionOrder();if(!order.includes(key)){const next=order.find(k=>!Object.hasOwn(answers,k));if(next)ask(next);else finish();return;}
 question=key;completed=false;document.body.classList.add('questioning');$('conversation').hidden=false;
 const [title,help,options]=I.questions(answers,intakeFields())[key];$('questionTitle').textContent=title;$('questionHelp').textContent=help;
 $('questionStep').textContent='질문 '+(order.indexOf(key)+1)+' / '+order.length+' · 언제든 바꿀 수 있어요';$('questionOptions').dataset.question=key;
 $('questionOptions').innerHTML=options.map(([v,t])=>`<button data-answer="${v}" aria-pressed="${String(answers[key])===v}">${t}${String(answers[key])===v?'<span>선택됨</span>':''}</button>`).join('');
 $('questionBack').disabled=!history.length;saveDraft();requestAnimationFrame(()=>$('questionTitle').focus({preventScroll:true}));
}
function finish(){completed=true;document.body.classList.remove('questioning');$('conversation').hidden=true;draw();showView('vmap');}
$('questionOptions').onclick=e=>{const b=e.target.closest('[data-answer]');if(!b)return;const key=question,v=b.dataset.answer;answers[key]=v;if(key==='age'&&v==='older'&&+answers.grade<(+$('mon').value<3?2:3))delete answers.grade;history.push(key);
 if(key==='hw'||key==='gifted')setSeg(key==='hw'?'hwOn':'gifted',v);
 else {const changes=I.fieldChanges(answers,intakeFields(),key);Object.entries(changes).forEach(([k,value])=>{if($(k))$(k).value=value;});if(!['age','grade'].includes(key))$('level').value='manual';if(key==='age'||key==='grade')hwOptions();}
 const revisit=key==='age'&&v==='older'?'grade':key==='thinking'&&v==='advanced'?'compExact':key==='thinking'&&v==='PRE 1031'&&answers.thinkingStatus?'preDone':key==='school'&&v==='advanced'?'schoolExact':key==='calc'&&v==='advanced'?'calcExact':null;const next=revisit||questionOrder().find(k=>!Object.hasOwn(answers,k));if(next)ask(next);else finish();
};
$('questionBack').onclick=()=>{let key;do{key=history.pop();}while(key&&!questionOrder().includes(key));if(key)ask(key);};
$('useExample').onclick=()=>{finish();};
function mapMilestones(plan){const ms=plan.sourceProfile?I.milestones(answers,intakeFields(),plan.sourceProfile):P.milestones(plan);ms.forks.forEach(f=>{if(answers[f.id==='hw'?'hw':'gifted']==='pending'){f.pending=true;f.reason='아직 고민 중이에요. 준비 일정은 추가하지 않았어요.';}});return ms;}
function drawRoutes(plan){
 const ms=mapMilestones(plan);
 $('routeChoices').innerHTML=ms.forks.map(f=>{
   const key=f.id==='hw'?'hw':'gifted',pending=answers[key]==='pending',unknown=!Object.hasOwn(answers,key);
   const choices=[[true,f.yes],[false,f.no]].map(([yes,t])=>{const selected=!pending&&yes===f.selected;return `<button data-fork-choice="${f.id}" data-value="${yes?'1':'0'}" aria-pressed="${selected}"><small>${yes?'선택':'미선택'} 경로</small>${t}${selected?`<b>${unknown?'예시 경로':'✓ 현재 경로'}</b>`:''}</button>`;}).join('');
   const undecided=`<button data-fork-choice="${f.id}" data-value="pending" aria-pressed="${pending}">아직 고민 중</button>`;
   return `<section class="route-choice" aria-label="${f.title} 경로"><strong>${f.title} 경로</strong>${pending||unknown?`<small class="pending-choice">${pending?'아직 고민 중 · 준비 일정 미추가':'아직 미정 · 예시 경로 표시'}</small>`:''}<div class="fork-options" data-fork="${f.id}"><span class="fork-origin">기존 학습</span>${choices}${undecided}<span class="fork-rejoin">다음 학습에 합류</span></div><p>${f.reason}</p></section>`;
 }).join('');
 if(['A','B'].includes(plan.band)&&!ms.forks.some(f=>f.id==='hw'))$('routeChoices').insertAdjacentHTML('afterbegin','<section class="route-choice" aria-label="생각하는 황소 시험 안내"><strong>생각하는 황소 시험 안내</strong><p>이 예시의 시험 선택은 초4 11월까지예요. 현재 학년에서는 교과·사고력 학습을 이어가요.</p></section>');
 if(['C','D'].includes(plan.band)&&Object.hasOwn(answers,'hw')){const choice={1:'네',0:'아니요',pending:'아직 고민 중'}[answers.hw];$('routeChoices').insertAdjacentHTML('afterbegin',`<section class="route-choice" aria-label="생각하는 황소 고려 답변"><strong>생각하는 황소 고려 · ${choice}</strong><p>답은 보존했어요. 이 묶음에는 생각하는 황소 준비 일정을 추가하지 않아요.</p></section>`);}
 $('answerSummary').textContent=plan.sourceProfile?plan.sourceProfile.nowLabel+' · 답을 바꾸면 다음 학습도 함께 바뀌어요.':P.label(plan.now)+' · '+plan.band+' '+plan.bandName+' · 선택한 답을 바꾸거나 상세 조정할 수 있어요.';
 $('mapList').innerHTML=ms.main.map((m,i)=>`<button data-focus="${i}"><b>${i+1}. ${m.title}</b><small>${m.sub}</small></button>`).join('');
}
$('routeChoices').onclick=e=>{const b=e.target.closest('[data-fork-choice]');if(!b)return;const k=b.dataset.forkChoice==='hw'?'hwOn':'gifted';setSeg(k,b.dataset.value);answers[k==='hwOn'?'hw':'gifted']=b.dataset.value;draw();};
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function drawIntake(profile){
 const fields=intakeFields(),items=I.summary(answers,fields),source=I.sourceMode(answers,fields);document.body.classList.toggle('source-mode',source);
 $('intakeSummary').hidden=!answers.age;$('intakeSummary').innerHTML=items.map(it=>`<div class="answer-chip"><button data-edit="${it.key}"><small>${it.label}</small><b>${esc(it.text)}</b></button>${['thinking','calc'].includes(it.key)&&answers[it.key]?`<button class="answer-status" data-edit="${it.key}Status" aria-label="${it.label} 진행 상태 바꾸기">상태 바꾸기</button>`:''}</div>`).join('');
 $('sourceProfile').hidden=!answers.age;const best=profile.comparison.best;
 $('sourceProfile').innerHTML=best?`<details class="source-comparison"><summary>학습 균형 보기 · 가까운 진도 예시 ${best.id}</summary><p>다섯 가지 진도 예시와 비교했어요. 합격이나 지원 자격을 뜻하지 않아요.</p><div class="level-comparison">${profile.comparison.levels.map(l=>`<span class="${l.id===best.id?'closest':''}"><b>${l.id}</b><small>${esc(l.shortSummary.replace(/황소/g,'생각하는 황소'))}</small>${D.fmtSigned(l.avg)}</span>`).join('')}</div><p>${best.bothOK?'교과와 연산이 현재 사고력 학습을 함께 받쳐주고 있어요.':'사고력과 교과·연산의 속도를 함께 살펴보면 좋아요.'}</p></details>`:'';
}
$('intakeSummary').onclick=e=>{const b=e.target.closest('[data-edit]');if(b)ask(b.dataset.edit);};
function drawSourceProfile(profile){
 const fields=intakeFields(),items=I.summary(answers,fields).slice(1),ms=I.milestones(answers,fields,profile),plan={sourceProfile:profile,now:profile.now,band:'source',choices:{hw:answers.hw==='1',gifted:answers.gifted==='1'}};lastPlan=plan;
 $('who').textContent='우리 아이';$('who2').textContent='우리 아이';$('hwOpts').style.display='none';$('kmoChoice').style.display='none';$('warn').innerHTML='';
 $('nowItems').innerHTML=items.map(it=>`<div class="item"><div><small>${it.label}</small><b>${esc(it.text)}</b></div></div>`).join('');
 const labels={school:'교과',thinking1:'사고력',calc:'연산'};
 const plans=profile.rows.map(row=>{const actual=items.find(i=>i.key===(row.key==='thinking1'?'thinking':row.key));return `<section class="intake-plan-card"><h3>${labels[row.key]}</h3><p class="intake-current">지금 · ${esc(actual?.text||row.current.shortText)}</p><ol>${row.remaining.slice(0,4).map((b,i)=>`<li><b>${esc(b.sourceCurrent?actual?.text.replace(/ 진행 중$/,'')||b.shortText:b.shortText)}</b><small>${D.labelMonth(b.remainingStart)}~${D.labelMonth(b.e)}</small></li>`).join('')||'<li>다음 단계는 학습을 확인하며 정해요.</li>'}</ol></section>`;}).join('');
 const missing=items.filter(it=>!profile.rows.some(r=>(r.key==='thinking1'?'thinking':r.key)===it.key)).map(it=>`<section class="intake-plan-card"><h3>${it.label}</h3><p class="intake-current">지금 · ${esc(it.text)}</p><p>다음 단계는 실제 진도를 확인하며 정해요.</p></section>`).join('');
 $('tbl').innerHTML=(plans+missing)?`<div class="intake-plan">${plans}${missing}</div>`:'<p>답을 더하면 현재 과정과 다음 학습을 함께 볼 수 있어요.</p>';$('simple').innerHTML=$('tbl').innerHTML;
 $('tbl').style.display=state.planMode==='table'?'block':'none';$('simple').style.display=state.planMode==='simple'?'block':'none';
 $('stages').innerHTML=items.map(it=>`<div class="stg"><h4>${it.label}</h4><p>${esc(it.text)}을 기준으로 이어갈 학습을 살펴봐요.</p></div>`).join('');
 $('repItems').innerHTML=items.map(it=>`<div class="ritem"><div><small>${it.label}</small><b>${esc(it.text)}</b></div></div>`).join('');
 $('books').innerHTML=profile.rows.map(row=>`<div class="bk"><h4>${labels[row.key]}</h4><p>${esc(row.current.shortText)}</p>${row.next?`<p><small>다음 예시</small>${esc(row.next.shortText)}</p>`:'<p>이후 단계는 학습을 확인하며 정해요.</p>'}</div>`).join('')+`<p class="bk-note">진행 중인 과정은 진도 예시의 중간 지점으로 보고 있어요. 실제 학습 속도에 맞춰 조정해 주세요.</p><details><summary>함께 보는 학습</summary>${D.originalRows().filter(r=>['thinking2','home'].includes(r.key)).map(r=>`<h4>${esc(r.shortTitle)}</h4><p>${r.blocks.map(b=>esc(D.shortText(b.text))).join(' · ')}</p>`).join('')}</details>`;
 $('dNow').innerHTML='● 현재 <small>'+profile.nowLabel+'</small>';$('dNext').innerHTML=ms.main[1]?'다음 · '+esc(ms.main[1].title):'다음 학습 확인';$('dLater').innerHTML=ms.main[2]?'함께 · '+esc(ms.main[2].title):'학습 속도에 맞춰 조정';
 drawMap(ms);drawRoutes(plan);saveDraft();
}
$('mapList').onclick=e=>{const b=e.target.closest('[data-focus]');if(b&&map3d)map3d.focus(+b.dataset.focus);};

hwOptions(); applyLevel();if(!restoreDraft()){draw();ask('age');}
})();
