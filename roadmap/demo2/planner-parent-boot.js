/* Loaded after member authentication and the six current-study dependencies. */
(function(g){
'use strict';
const planKey='gfield.demo2.v1';
function initialMode(answers={}){
 // Resume the existing editor if an older plan already contains answers. A quick
 // submission describes a single activity, so it must never replace those axes.
 return Object.keys(answers).length?'detail':'quick';
}
function showDraft(host,answers,{onDetail,onMap}){
 const doc=host.ownerDocument,view=doc.createElement('section');
 view.className='parent-draft-view';
 view.innerHTML=g.PlannerParentFlow.draftMarkup(answers);
 const actions=doc.createElement('div');actions.className='parent-draft-actions';
 const detail=doc.createElement('button'),map=doc.createElement('button');
 detail.type=map.type='button';
 detail.dataset.parentDraftDetail='';detail.className='parent-advanced';detail.textContent='다른 공부 추가·수정';
 map.dataset.parentDraftMap='';map.className='parent-primary';map.textContent='전체 로드맵 보기';
 const error=doc.createElement('p');error.setAttribute('role','alert');error.hidden=true;
 const run=async callback=>{
  detail.disabled=map.disabled=true;error.hidden=true;
  try{await callback();}catch(e){error.textContent=e.message||'다시 한번 열어 주세요.';error.hidden=false;}
  finally{detail.disabled=map.disabled=false;}
 };
 detail.onclick=()=>run(onDetail);map.onclick=()=>run(onMap);
 actions.append(map,detail);view.append(actions,error);host.replaceChildren(view);
 const title=view.querySelector('h2');if(title){title.tabIndex=-1;title.focus({preventScroll:true});}
}
async function mount({loadFull,member,saved}){
 const doc=g.document,host=doc.createElement('main');host.id='parentBoot';
 host.innerHTML='<header><h1>우리 아이 공부 지도</h1><a href="https://open.kakao.com/me/gfield" target="_blank" rel="noopener noreferrer">독쌤에게 물어보기</a><a href="account.html?next=planner.html">내 계정</a></header><section aria-label="현재 공부 입력"></section>';
 doc.body.classList.add('parent-boot');doc.body.append(host);
 const entry=host.querySelector('section');
 const verifyMember=async()=>{
  const current=await g.RoadmapMembership.status();
  if(!current||current.user_id!==member.user_id)throw Error('로그인 상태가 바뀌었어요. 내 계정에서 다시 확인해 주세요.');
 };
 const open=async(next,advanced,study=false,learner)=>{
  g.RoadmapSpeed?.mark('roadmap_start');if(study)g.RoadmapSpeed?.mark('study_start');
  await verifyMember();
  g.RoadmapParentPending={answers:next,advanced:!!advanced,learner,study,saved};
  try{await loadFull();}catch(error){const retry=doc.createElement('button');retry.type='button';retry.textContent='새로고침 후 다시 열기';retry.onclick=()=>location.reload();retry.dataset.parentRetry='true';entry.querySelector('[data-parent-retry]')?.remove();(entry.querySelector('.parent-slide-footer')||entry).append(retry);throw error;}
  doc.body.classList.remove('parent-boot','parent-slide-open');host.remove();
  g.RoadmapSpeed?.ready('roadmap_ready','#journeyMap,.parent-own-learning');
 };
 const edit=(mode,answers)=>{
  entry.replaceChildren();
  g.PlannerParentFlow.mount(entry,{mode,answers,member:g.RoadmapMember,onSubmit:submit,
   onAdvanced:learner=>open(null,true,false,learner).catch(error=>{const p=doc.createElement('p');p.setAttribute('role','alert');p.textContent=error.message;entry.append(p);})});
 };
 const preview=answers=>{
  doc.body.classList.remove('parent-slide-open');delete host.dataset.slideEditing;
  showDraft(entry,answers,{onDetail:()=>edit('detail',answers),onMap:()=>open(answers,false)});
  g.RoadmapSpeed?.ready('roadmap_ready','.parent-math-draft');
 };
 const submit=async next=>{
  if(!next.parentFlow?.quickDraft)return open(next,false);
  await verifyMember();
  // Keep the same member/student document and any earlier records. Only materialize
  // the detailed planner on request; the initial preview needs the entry bundle alone.
  saved={...saved,...(saved?.version===1?{legacyDraft:saved}:{}),version:2,answers:next,completed:false,question:'mathDraft'};
  g.PlannerStorage.setItem(planKey,JSON.stringify(saved));
  preview(next);
 };
 if(saved?.answers?.parentFlow?.quickDraft&&!saved.completed&&saved.question==='mathDraft'){
  preview(saved.answers);return host;
 }
 if(saved?.completed&&g.PlannerParentFlow.inputModel(saved.answers||{},member).grade){
  const summary=g.PlannerIntake.summary(saved.answers||{},saved.fields||{}).filter(r=>['school','deepBook','thinking','calc'].includes(r.key));
  const h=doc.createElement('h2');h.textContent='현재 공부에서 이어서 학습해요.';entry.append(h);
  for(const row of summary){
   const p=doc.createElement('p'),stage=row.key==='thinking'&&saved.answers?.parentFlow?.thinkingStage;
   p.textContent=stage?'현재 학습 · '+stage:row.label+' · '+row.text;entry.append(p);
  }
  entry.insertAdjacentHTML('beforeend',g.PlannerParentFlow.balanceNotice(saved.answers||{}));
  const study=doc.createElement('button');study.type='button';study.className='parent-primary';study.textContent='학습하기';
  const map=doc.createElement('button');map.type='button';map.className='parent-advanced';map.textContent='전체 로드맵 보기';
  const change=doc.createElement('details'),label=doc.createElement('summary'),form=doc.createElement('div');label.textContent='현재 공부 바꾸기';change.append(label,form);
  const start=async studyNow=>{study.disabled=map.disabled=true;try{await open(saved.answers,false,studyNow);}catch(error){study.disabled=map.disabled=false;const p=doc.createElement('p');p.setAttribute('role','alert');p.textContent=error.message;entry.append(p);}};
  study.onclick=()=>start(true);map.onclick=()=>start(false);entry.append(study,map,change);
  g.PlannerParentFlow.mount(form,{answers:saved.answers||{},member:g.RoadmapMember,mode:'detail',onSubmit:next=>open(next,false)});
  return host;
 }
 edit(initialMode(saved?.answers||{}),saved?.answers||{});
 // The private member screen may open now; optional tools remain unfetched.
 return host;
}
g.RoadmapParentBoot=Object.freeze({mount,showDraft,initialMode});
})(window);
