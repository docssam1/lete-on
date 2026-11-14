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
 const intro=el('p',{class:'cc-intro'},'궁금한 점과 현재 진도를 적어 주세요. 승인된 지필드 자료에서 관련 안내를 찾아드립니다.');
 const form=el('form',{class:'cc-form'});
 const stageLabel=el('label',{},'학교 단계');
 const stage=el('select',{'aria-label':'학교 단계'});
 for(const [value,title]of [['preschool','유아'],['elementary','초등'],['middle','중등'],['high','고등']])stage.append(el('option',{value},title));
 stageLabel.append(stage);
 const progressLabel=el('label',{},'현재 진도와 풀이 모습');
 const progress=el('textarea',{rows:'3',maxlength:'2000',placeholder:'예: 중1-1 개념원리 3단원, 쎈 기본 문제는 혼자 풀고 함수에서 자주 막혀요.'});
 progressLabel.append(progress);
 const questionLabel=el('label',{},'어떤 점이 궁금하세요?');
 const question=el('textarea',{rows:'3',maxlength:'1000',required:'',placeholder:'예: 선행을 이어가도 될까요? 지금은 어떤 공부를 보완하면 좋을까요?'});
 questionLabel.append(question);
 const submit=el('button',{type:'submit',class:'cc-primary'},'관련 자료 찾아보기');
 form.append(stageLabel,progressLabel,questionLabel,submit);
 const status=el('p',{class:'cc-status',role:'status','aria-live':'polite'});
 const result=el('section',{class:'cc-result',hidden:'','aria-labelledby':'ccSummaryTitle'});
 const aiButton=el('button',{type:'button',class:'cc-more',hidden:''},'추가 설명 받기');
 const aiHint=el('p',{class:'cc-ai-hint',hidden:''},'추가 설명을 요청할 때만 질문·진도·관련 승인 자료를 AI에 보냅니다.');
 const moreStatus=el('p',{class:'cc-status',role:'status','aria-live':'polite'});
 const detail=el('div',{class:'cc-detail',hidden:''});
 const contact=el('a',{href:'https://open.kakao.com/me/gfield',target:'_blank',rel:'noopener noreferrer',class:'cc-contact'},'독쌤에게 직접 상담하기');
 dialog.append(header,intro,form,status,result,aiButton,aiHint,moreStatus,detail,contact);
 let busy=false,last=null,opened=false;
 const context=()=>({question:clean(question.value),progress:clean(progress.value),stage:stage.value});
 const lock=value=>{busy=value;for(const n of [stage,progress,question,submit,aiButton])n.disabled=value;dialog.setAttribute('aria-busy',String(value));};
 const messages={login_required:'로그인 후 자료 상담을 이용할 수 있습니다.',question_missing:'궁금한 내용을 조금 더 적어 주세요.',sources_missing:'추가 설명에 참고할 승인 자료를 찾지 못했습니다. 독쌤에게 직접 문의해 주세요.',ai_not_configured:'추가 설명 연결을 준비하고 있습니다. 아래 자료 안내를 먼저 확인해 주세요.',too_many_attempts:'오늘의 추가 설명 사용 횟수를 마쳤습니다. 자료 안내는 계속 이용할 수 있습니다.',ai_unavailable:'추가 설명을 가져오지 못했습니다. 자료 안내는 아래에서 계속 확인할 수 있습니다.'};
 function render(data){
  result.replaceChildren();detail.replaceChildren();detail.hidden=true;moreStatus.textContent='';
  result.append(el('h3',{id:'ccSummaryTitle'},'먼저 이렇게 살펴보세요'),el('p',{class:'cc-summary'},data.summary),el('p',{},data.explanation));
  for(const [i,r]of (data.sources||[]).entries()){
   const item=el('article',{class:'cc-source'});
   item.append(el('h4',{},(i+1)+'. '+r.title),el('p',{},r.body));
   const source=el('p',{class:'cc-source-note'},[r.checked_on?'자료 확인 '+r.checked_on:'확인일 미등록',r.source||'원장님 승인 자료'].join(' · '));
   const url=(r.source||'').match(/https:\/\/[^\s]+/);
   if(url)source.append(doc.createTextNode(' '),el('a',{href:url[0],target:'_blank',rel:'noopener noreferrer'},'출처 열기'));
   item.append(source);result.append(item);
  }
  result.append(el('p',{class:'cc-next'},data.next));
  result.hidden=false;aiButton.hidden=!data.aiAvailable;aiHint.hidden=!data.aiAvailable;
 }
 async function lookup(event){
  event?.preventDefault();if(busy||!form.reportValidity())return;
  last=null;result.hidden=true;aiButton.hidden=true;aiHint.hidden=true;detail.hidden=true;
  lock(true);status.textContent='현재 진도에 맞는 승인 자료를 찾고 있습니다.';moreStatus.textContent='';
  try{
   const c=context(),data=await g.RoadmapMembership.counsel({action:'lookup',...c});
   last=c;render(data);status.textContent=data.sources.length?'승인 자료를 바탕으로 정리했습니다.':'질문에 맞는 자료를 더 확인해 볼까요?';
  }catch(e){status.textContent=messages[e.message]||'자료를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.';}
  finally{lock(false);}
 }
 form.onsubmit=lookup;
 aiButton.onclick=async()=>{
  if(busy||!last)return;
  lock(true);moreStatus.textContent='관련 자료로 추가 설명을 만들고 있습니다.';
  try{
   const data=await g.RoadmapMembership.counsel({action:'explain',...last});
   render(data);
   for(const text of String(data.detail||'').split(/\n+/).filter(Boolean)){
    const heading=text.trim().match(/^\*\*([^*]+)\*\*$/);
    detail.append(el(heading?'h4':'p',{},heading?heading[1]:text));
   }
   detail.hidden=false;moreStatus.textContent=data.reused?'앞서 정리한 설명을 다시 보여드립니다.':'현재 진도에 맞춘 추가 설명입니다. 자료의 출처와 함께 확인해 주세요.';
  }catch(e){moreStatus.textContent=messages[e.message]||'추가 설명을 가져오지 못했습니다. 자료 안내를 확인해 주세요.';}
  finally{lock(false);}
 };
 form.addEventListener('input',()=>{last=null;result.hidden=true;aiButton.hidden=true;aiHint.hidden=true;detail.hidden=true;moreStatus.textContent='';status.textContent='입력한 조건으로 자료를 다시 찾아보세요.';});
 form.addEventListener('change',()=>{last=null;result.hidden=true;aiButton.hidden=true;aiHint.hidden=true;detail.hidden=true;moreStatus.textContent='';status.textContent='입력한 조건으로 자료를 다시 찾아보세요.';});
 close.onclick=()=>dialog.close();
 button.onclick=()=>{
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
