// 회원의 질문과 현재 진도로 승인 자료를 찾는다. 추가 설명만 사용자가 요청한다.
(function(g){
 'use strict';
 const doc=g.document;
 const el=(tag,attrs={},text)=>{const n=doc.createElement(tag);for(const [k,v]of Object.entries(attrs))n.setAttribute(k,v);if(text!=null)n.textContent=text;return n;};
 const clean=s=>String(s||'').replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,'[이메일 제외]').replace(/0?1[016789][ -]?\d{3,4}[ -]?\d{4}\b/g,'[연락처 제외]');
 const button=el('button',{type:'button',class:'customer-counsel-open'},'자료로 상담하기');
 const dialog=el('dialog',{class:'customer-counsel','aria-labelledby':'customerCounselTitle'});
 const header=el('header',{class:'cc-header'});
 const close=el('button',{type:'button','aria-label':'자료 상담 닫기'},'닫기');
 header.append(el('h2',{id:'customerCounselTitle'},'지금 공부, 함께 살펴볼까요?'),close);
 const intro=el('p',{class:'cc-intro'},'궁금한 점과 현재 진도를 적어 주세요. 학원 상담은 다닐 수 있는 지역도 함께 적으면 관련 지점과 과정을 찾아드립니다.');
 const form=el('form',{class:'cc-form'});
 const stageLabel=el('label',{},'학교 단계');
 const stage=el('select',{'aria-label':'학교 단계'});
 for(const [value,title]of [['preschool','유아'],['elementary','초등'],['middle','중등'],['high','고등']])stage.append(el('option',{value},title));
 stageLabel.append(stage);
 const regionLabel=el('label',{},'통학 가능한 지역 · 수업 방식 (선택)');
 const region=el('input',{type:'text',maxlength:'120',placeholder:'예: 부산 센텀·사직 / 목동 / 온라인만 희망'});
 regionLabel.append(region);
 const progressLabel=el('label',{},'현재 진도와 풀이 모습');
 const progress=el('textarea',{rows:'3',maxlength:'2000',placeholder:'예: 중1-1 개념원리 3단원, 쎈 기본 문제는 혼자 풀고 함수에서 자주 막혀요.'});
 progressLabel.append(progress);
 const preparation=el('details',{class:'cc-preparation'});
 preparation.append(el('summary',{},'현재·마친 교재와 혼자 풀 수 있는 범위 (선택)'));
 const currentLabel=el('label',{},'현재 공부 중인 교재와 범위');
 const currentBooks=el('textarea',{rows:'2',maxlength:'600',placeholder:'예: 디딤돌 4-1 분수, 현재 연산 교재의 나눗셈 단원'});
 currentLabel.append(currentBooks);preparation.append(currentLabel);
 const booksLabel=el('label',{},'마친 교재와 범위');
 const completedBooks=el('textarea',{rows:'2',maxlength:'600',placeholder:'예: 쎈 중3-2까지. 심화 문제는 일부 남았어요.'});
 booksLabel.append(completedBooks);
 const soloLabel=el('label',{},'도움 없이 혼자 풀 수 있는 범위');
 const soloRange=el('textarea',{rows:'2',maxlength:'600',placeholder:'예: 식·함수는 혼자 풀고 기하 증명은 힌트가 필요해요.'});
 soloLabel.append(soloRange);preparation.append(booksLabel,soloLabel);
 const questionLabel=el('label',{},'어떤 점이 궁금하세요?');
 const question=el('textarea',{rows:'3',maxlength:'1000',required:'',placeholder:'예: 선행을 이어가도 될까요? 지금은 어떤 공부를 보완하면 좋을까요?'});
 questionLabel.append(question);
 const submit=el('button',{type:'submit',class:'cc-primary'},'관련 자료 찾아보기');
 form.append(stageLabel,regionLabel,progressLabel,preparation,questionLabel,submit);
 const previous=el('div',{class:'cc-previous'});
 const includePrevious=el('input',{type:'checkbox'});
 const previousLabel=el('label',{class:'cc-use-previous',hidden:''});
 previousLabel.append(includePrevious,doc.createTextNode('지난 보완·재점검 결과도 함께 상담하기'));
 form.insertBefore(previousLabel,submit);
 const status=el('p',{class:'cc-status',role:'status','aria-live':'polite'});
 const result=el('section',{class:'cc-result',hidden:'','aria-labelledby':'ccSummaryTitle'});
 const aiButton=el('button',{type:'button',class:'cc-more',hidden:''},'추가 설명 받기');
 const aiHint=el('p',{class:'cc-ai-hint',hidden:''},'추가 설명을 요청할 때만 질문·지역·진도·관련 승인 자료를 AI에 보냅니다.');
 const moreStatus=el('p',{class:'cc-status',role:'status','aria-live':'polite'});
 const detail=el('div',{class:'cc-detail',hidden:''});
 const contact=el('a',{href:'https://open.kakao.com/me/gfield',target:'_blank',rel:'noopener noreferrer',class:'cc-contact'},'독쌤에게 직접 상담하기');
 dialog.append(header,intro,previous,form,status,result,aiButton,aiHint,moreStatus,detail,contact);
 let busy=false,last=null,opened=false,generation=0;
 let displayedRevision='',previousText='';
 let showEvidence=()=>{};
 let somaOwner='';
 const member=()=>g.RoadmapMember?.user_id;
 function refreshPrevious(){
  previous.replaceChildren();
  if(!g.RoadmapGuest)g.RoadmapCounselPlan?.renderPrevious(previous);
  let saved='';
  try{if(!g.RoadmapGuest)saved=g.RoadmapCounselPlan?.previousSummary()||'';}catch{}
  if(saved&&!previousText)includePrevious.checked=true;
  if(last&&saved!==previousText&&includePrevious.checked)invalidate();
  previousText=saved;
  previousLabel.hidden=!saved;
 }
 function context(){
  const value={question:clean(question.value),progress:clean(progress.value),region:clean(region.value),currentBooks:clean(currentBooks.value),completedBooks:clean(completedBooks.value),soloRange:clean(soloRange.value),stage:stage.value};
  if(previousText&&includePrevious.checked){
   value.previous=clean(previousText).slice(0,600);
  }
  return value;
 }
 function selectedSchool(){
  try{
   const saved=JSON.parse(g.PlannerStorage?.getItem(g.PlannerHighschool.KEY)||'null');
   if(saved?.schools?.length===1)return g.PlannerHighschoolData.schools.find(s=>s.id===saved.schools[0])?.name;
  }catch{}
  return '';
 }
 const lock=value=>{busy=value;for(const n of [stage,region,progress,currentBooks,completedBooks,soloRange,question,includePrevious,submit,aiButton,...result.querySelectorAll('.cc-followup input,.cc-followup textarea,.cc-followup button')])n.disabled=value;dialog.setAttribute('aria-busy',String(value));};
 const messages={login_required:'로그인 후 자료 상담을 이용할 수 있습니다.',question_missing:'궁금한 내용을 조금 더 적어 주세요.',sources_missing:'추가 설명에 참고할 승인 자료를 찾지 못했습니다. 독쌤에게 직접 문의해 주세요.',ai_not_configured:'추가 설명 연결을 준비하고 있습니다. 아래 자료 안내를 먼저 확인해 주세요.',too_many_attempts:'오늘의 추가 설명 사용 횟수를 마쳤습니다. 자료 안내는 계속 이용할 수 있습니다.',ai_unavailable:'추가 설명을 가져오지 못했습니다. 자료 안내는 아래에서 계속 확인할 수 있습니다.'};
 function render(data,c){
  result.replaceChildren();detail.replaceChildren();detail.hidden=true;moreStatus.textContent='';
  const sources=data.sources||[],interviews=el('div',{class:'cc-interviews'});
  const related=el('details',{class:'cc-references'}),evidence=new Map();
  showEvidence=i=>{const article=evidence.get(sources[i]?.id);if(!article)return;related.open=true;article.scrollIntoView({block:'nearest'});article.focus({preventScroll:true});};
  function cited(text,ids=[],className=''){
   const p=el('p',className?{class:className}:{},text);
   for(const id of [...new Set(ids)]){
    const i=sources.findIndex(source=>source.id===id);if(i<0)continue;
    const link=el('button',{type:'button',class:'cc-citation','aria-label':sources[i].title+' 근거 보기'},'['+(i+1)+'] 근거');
    link.onclick=()=>showEvidence(i);
    p.append(doc.createTextNode(' '),link);
   }
   return p;
  }
  const count=g.RoadmapCounselInterview?.render(interviews,c.question,{...c,sources,schoolName:selectedSchool()})||0;
  result.append(el('h3',{id:'ccSummaryTitle'},count?'학교별 면접·기출 자료':'먼저 이렇게 살펴보세요'));
  if(count)result.append(interviews);
  if(sources.length||!count){
   if(data.paragraphs?.length){
    for(const [i,p]of data.paragraphs.entries())result.append(cited(p.text,p.sourceIds,i===0?'cc-summary':''));
   }else{
    if(data.summary)result.append(cited(data.summary,sources.slice(0,1).map(r=>r.id),'cc-summary'));
    if(data.explanation)result.append(cited(data.explanation,sources.map(r=>r.id)));
   }
  }
  if(!count&&(c.currentBooks||c.completedBooks||c.soloRange)){
   const applied=el('div',{class:'cc-applied'});
   applied.append(el('p',{},'이번 안내에 함께 반영했어요.'));
   if(c.currentBooks)applied.append(el('p',{},'현재 교재 · '+c.currentBooks));
   if(c.completedBooks)applied.append(el('p',{},'마친 교재 · '+c.completedBooks));
   if(c.soloRange)applied.append(el('p',{},'독립 풀이 범위 · '+c.soloRange));
   result.append(applied);
  }
  const somaHost=el('div');
  const somaHandled=!count&&g.RoadmapCounselSoma?.mount(somaHost,{...c,sources},{openSource:id=>showEvidence(sources.findIndex(r=>r.id===id))});
  if(somaHandled)result.append(somaHost);
  if(!count&&!somaHandled&&data.followup?.fields?.length){
   const follow=el('form',{class:'cc-followup'}),answers=new Map();
   follow.append(el('h4',{},'시작할 과정을 더 좁혀볼까요?'),el('p',{},data.followup.message));
   for(const field of data.followup.fields){
    if(!['completedBooks','soloRange'].includes(field.key))continue;
    const label=el('label',{},field.label),input=el('textarea',{rows:'2',maxlength:'600',required:'',placeholder:field.placeholder||''});
    input.oninput=()=>input.setCustomValidity('');
    label.append(input);follow.append(label);answers.set(field.key,input);
   }
   const areaLabel=el('label',{},'통학 가능한 동네·지점 (선택)');
   const area=el('input',{type:'text',maxlength:'120',placeholder:'예: 부산 사직까지 다닐 수 있어요.'});
   areaLabel.append(area);follow.append(areaLabel,el('button',{type:'submit',class:'cc-primary'},'답변 반영해 다시 안내받기'));
   follow.onsubmit=event=>{
    event.preventDefault();if(busy)return;
    for(const input of answers.values())input.setCustomValidity(input.value.trim()?'':'교재나 풀이 범위를 적어 주세요.');
    if(!follow.reportValidity())return;
    if(answers.has('completedBooks'))completedBooks.value=clean(answers.get('completedBooks').value).trim();
    if(answers.has('soloRange'))soloRange.value=clean(answers.get('soloRange').value).trim();
    if(area.value.trim())region.value=clean(area.value).trim();
    lookup();
   };
   result.append(follow);
  }
  const plan=el('div',{class:'cc-plan'});
  result.append(plan);
  if(!count&&!somaHandled&&sources.length)g.RoadmapCounselPlan?.mount(plan,{...c,sources});
  if(sources.length){
   related.append(el('summary',{},'상담 근거 자료 '+sources.length+'건 보기'));
   for(const [i,r]of sources.entries()){
    const item=el('article',{class:'cc-source',tabindex:'-1'});evidence.set(r.id,item);
    item.append(el('h4',{},(i+1)+'. '+r.title),el('p',{},r.body));
    const source=el('p',{class:'cc-source-note'},[r.source||'원장님 승인 자료',r.checked_on?'자료 확인 '+r.checked_on:''].filter(Boolean).join(' · '));
    const urls=[...new Set((r.source||'').match(/https:\/\/[^\s<>"'()[\]{}]+/g)||[])];
    for(const [j,url]of urls.entries())source.append(doc.createTextNode(' '),el('a',{href:url,target:'_blank',rel:'noopener noreferrer'},urls.length===1?'원문 열기':'원문 '+(j+1)+' 열기'));
    item.append(source);related.append(item);
   }
   result.append(related);
  }
  if(data.next&&!count&&!somaHandled&&!plan.childElementCount)result.append(el('p',{class:'cc-next'},data.next));
  result.hidden=false;aiButton.hidden=!data.aiAvailable;aiHint.hidden=!data.aiAvailable;
  displayedRevision=data.revision||'';
  return count;
 }
 async function lookup(event){
  event?.preventDefault();if(busy||!form.reportValidity())return;
  refreshPrevious();
  last=null;result.hidden=true;aiButton.hidden=true;aiHint.hidden=true;detail.hidden=true;
  const request=++generation,owner=member();
  lock(true);status.textContent='현재 진도에 맞는 승인 자료를 찾고 있습니다.';moreStatus.textContent='';
  try{
   const c=context(),data=await g.RoadmapMembership.counsel({action:'lookup',...c});
   if(request!==generation||owner!==member())return;
   last=c;const interviewCount=render(data,c);status.textContent=interviewCount?'학교별 자료를 확인해 주세요.':data.sources.length?'승인 자료를 바탕으로 정리했습니다.':'질문에 맞는 자료를 더 확인해 볼까요?';
  }catch(e){if(request===generation&&owner===member())status.textContent=messages[e.message]||'자료를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.';}
  finally{if(request===generation)lock(false);}
 }
 // Checking a task can happen inside the consultation before this dialog closes.
 doc.addEventListener('close',event=>{
  if(dialog.open&&event.target.matches?.('.cp-checklist'))refreshPrevious();
 },true);
 form.onsubmit=lookup;
 aiButton.onclick=async()=>{
  if(busy||!last)return;
  const request=++generation,owner=member();
  lock(true);moreStatus.textContent='관련 자료로 추가 설명을 만들고 있습니다.';
  try{
   const c=last,data=await g.RoadmapMembership.counsel({action:'explain',...c});
   if(request!==generation||owner!==member())return;
   if(data.revision!==displayedRevision)render(data,c);
   detail.replaceChildren();
   for(const text of String(data.detail||'').split(/\n+/).filter(Boolean)){
    const heading=text.trim().match(/^\*\*([^*]+)\*\*$/);
    const paragraph=el(heading?'h4':'p');
    for(const part of (heading?heading[1]:text).split(/(\[\d+\])/g)){
     const i=part.match(/^\[(\d+)\]$/)?.[1];
     if(i&&data.sources[Number(i)-1]){
      const cite=el('button',{type:'button',class:'cc-citation','aria-label':data.sources[Number(i)-1].title+' 근거 보기'},part+' 근거');
      cite.onclick=()=>showEvidence(Number(i)-1);paragraph.append(cite);
     }else paragraph.append(doc.createTextNode(part));
    }
    detail.append(paragraph);
   }
   detail.hidden=false;moreStatus.textContent=data.reused?'앞서 정리한 설명을 다시 보여드립니다.':'현재 진도에 맞춘 추가 설명입니다. 자료의 출처와 함께 확인해 주세요.';
  }catch(e){if(request===generation&&owner===member())moreStatus.textContent=messages[e.message]||'추가 설명을 가져오지 못했습니다. 자료 안내를 확인해 주세요.';}
  finally{if(request===generation)lock(false);}
 };
 function invalidate(){
  generation++;last=null;result.hidden=true;aiButton.hidden=true;aiHint.hidden=true;detail.hidden=true;moreStatus.textContent='';
  status.textContent='입력한 조건으로 자료를 다시 찾아보세요.';
 }
 form.addEventListener('input',invalidate);
 form.addEventListener('change',invalidate);
 dialog.addEventListener('close',()=>{generation++;if(busy){lock(false);moreStatus.textContent='';status.textContent='';}});
 close.onclick=()=>dialog.close();
 button.onclick=()=>{
  if(somaOwner&&somaOwner!==member()){for(const field of [currentBooks,completedBooks,soloRange,progress,question,region])field.value='';opened=false;invalidate();}
  somaOwner=member()||'';
  refreshPrevious();
  if(!opened){stage.value=g.RoadmapMember?.school||'elementary';opened=true;}
  if(!progress.value){
   try{
    const draft=JSON.parse(g.PlannerStorage.getItem('gfield.demo2.v1')||'null');
    if(draft&&g.PlannerIntake)progress.value=clean(g.PlannerIntake.summary(draft.answers||{},draft.fields||{}).slice(1).map(r=>String(r.text||'').trim()).filter(text=>text&&text!=='미선택').join('\n')).slice(0,2000);
   }catch{}
  }
  dialog.showModal();
  if(g.RoadmapGuest){form.hidden=true;status.textContent='자료 상담은 회원 로그인 후 이용할 수 있습니다.';contact.textContent='로그인하고 자료 상담하기';contact.href='account.html?next=planner.html';contact.removeAttribute('target');}
  else question.focus();
 };
 doc.body.classList.add('customer-counsel-ready');
 doc.body.append(dialog);
 const contactLink=doc.querySelector('.docssam-contact-link');
 if(contactLink)contactLink.before(button);else doc.querySelector('.top')?.append(button);
})(window);
