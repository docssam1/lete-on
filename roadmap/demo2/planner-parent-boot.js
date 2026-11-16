/* Loaded after member authentication and the six current-study dependencies. */
(function(g){
'use strict';
async function mount({loadFull,member,saved}){
 const doc=g.document,host=doc.createElement('main');host.id='parentBoot';
 host.innerHTML='<header><h1>우리 아이 공부 지도</h1><a href="https://open.kakao.com/me/gfield" target="_blank" rel="noopener noreferrer">독쌤에게 물어보기</a><a href="account.html?next=planner.html">내 계정</a></header><section aria-label="현재 공부 입력"></section>';
 doc.body.classList.add('parent-boot');doc.body.append(host);
 const entry=host.querySelector('section');
 const open=async(next,advanced,study=false)=>{
  g.RoadmapSpeed?.mark('roadmap_start');if(study)g.RoadmapSpeed?.mark('study_start');
  const current=await g.RoadmapMembership.status();
  if(!current||current.user_id!==member.user_id)throw Error('로그인 상태가 바뀌었어요. 내 계정에서 다시 확인해 주세요.');
  g.RoadmapParentPending={answers:next,advanced:!!advanced,study,saved};
  try{await loadFull();}catch(error){const retry=doc.createElement('button');retry.type='button';retry.textContent='새로고침 후 다시 열기';retry.onclick=()=>location.reload();entry.append(retry);throw error;}
  doc.body.classList.remove('parent-boot');host.remove();
  g.RoadmapSpeed?.ready('roadmap_ready','#journeyMap,.parent-own-learning');
 };
 if(saved?.completed){
  const summary=g.PlannerIntake.summary(saved.answers||{},saved.fields||{}).filter(r=>['school','deepBook','thinking','calc'].includes(r.key));
  const h=doc.createElement('h2');h.textContent='현재 공부에서 이어서 학습해요.';entry.append(h);
  for(const row of summary){const p=doc.createElement('p');p.textContent=row.label+' · '+row.text;entry.append(p);}
  const study=doc.createElement('button');study.type='button';study.className='parent-primary';study.textContent='학습하기';
  const map=doc.createElement('button');map.type='button';map.className='parent-advanced';map.textContent='전체 로드맵 보기';
  const change=doc.createElement('details'),label=doc.createElement('summary'),form=doc.createElement('div');label.textContent='현재 공부 바꾸기';change.append(label,form);
  const start=async studyNow=>{study.disabled=map.disabled=true;try{await open(saved.answers,false,studyNow);}catch(error){study.disabled=map.disabled=false;const p=doc.createElement('p');p.setAttribute('role','alert');p.textContent=error.message;entry.append(p);}};
  study.onclick=()=>start(true);map.onclick=()=>start(false);entry.append(study,map,change);
  g.PlannerParentFlow.mount(form,{answers:saved.answers||{},member:g.RoadmapMember,onSubmit:next=>open(next,false)});
  return host;
 }
 g.PlannerParentFlow.mount(entry,{answers:saved?.answers||{},member:g.RoadmapMember,onSubmit:next=>open(next,false),onAdvanced:()=>open(null,true).catch(error=>{const p=doc.createElement('p');p.setAttribute('role','alert');p.textContent=error.message;entry.append(p);})});
 // The private member screen may open now; optional tools remain unfetched.
 return host;
}
g.RoadmapParentBoot=Object.freeze({mount});
})(window);
