// Optional, memory-only assistance. The existing questionnaire and source roadmap
// remain usable when the local AI endpoint is absent, disabled, or unavailable.
import {collectSafeCourseFacts, validateAIRequest, validateAIResponse, eligibleExplanationFacts, AI_BOOKS} from './ai-contract.mjs';

const AXES={application:'교과 기본·응용',depth:'교과 심화',thinking:'사고력 교재',arithmetic:'연산 교재'};
const STATES={unentered:'미입력',not_started:'아직 따로 안 함',unknown:'모름',in_progress:'진행 중',done:'완료로 입력'};
const DIRECTIONS={maintain:'지금 흐름 유지',fast:'선행을 더 빠르게',consolidate:'현재 범위 다지기',deepen:'심화 더하기',undecided:'아직 정하지 않음'};
const BOOK_NAMES=new Map(AI_BOOKS.map(book=>[book.id,book.name]));
const scopeText=scope=>scope?`${scope.level==='middle'?'중등':'초등'} ${scope.grade}-${scope.semester}`:'범위 미입력';
const completionText=book=>book.completion==='unknown'?book.completionInput==='unentered'?'진행 상태 미입력':book.completionInput==='legacy'?'진행 상태 미확인':'모름':STATES[book.completion];
const safeFacts=state=>collectSafeCourseFacts(state);
const contextOf=(state,facts)=>JSON.stringify([state?.id||'',state?.wizard?.step||'',facts]);
const paragraph=(text,className='')=>{const p=document.createElement('p');p.textContent=text;if(className)p.className=className;return p;};

export function mountAIHelper(anchor,{getState}){
 if(!anchor)return null;
 const helper=document.createElement('details');helper.className='ai-helper';helper.dataset.aiHelper='';
 helper.innerHTML=`<summary>독샘 설명 더 보기 <span>선택</span></summary><div class="ai-helper-body">
  <p class="ai-local-summary" data-ai-local-summary></p>
  <div class="ai-mode-tabs" role="tablist" aria-label="선택 도움말">
   <button type="button" role="tab" aria-selected="true" aria-controls="ai-explain-panel" id="ai-explain-tab" data-ai-mode="explain">설명 보기</button>
   <button type="button" role="tab" aria-selected="false" aria-controls="ai-parse-panel" id="ai-parse-tab" data-ai-mode="parse-book">교재 문장 정리</button>
  </div>
  <div id="ai-explain-panel" role="tabpanel" aria-labelledby="ai-explain-tab">
   <p class="ai-send-label">설명에 사용할 항목</p><p class="ai-facts-summary" data-ai-facts-summary></p>
   <details class="ai-payload-details"><summary>보낼 항목 전체 보기</summary><pre data-ai-safe-payload></pre></details>
  </div>
  <div id="ai-parse-panel" role="tabpanel" aria-labelledby="ai-parse-tab" hidden>
   <label class="ai-book-field" for="ai-book-phrase">교재 이름·과정·범위만 적어 주세요</label>
   <input id="ai-book-phrase" type="text" autocomplete="off" maxlength="120" placeholder="예: 중등 쎈 1-2 완료" data-ai-book-phrase>
   <p class="ai-input-help">초등·중등을 함께 적어 주세요. 이름이나 상담 내용은 빼 주세요.</p>
   <p class="ai-phrase-preview" data-ai-phrase-preview>보낼 문장: 아직 입력하지 않았어요.</p>
  </div>
  <p class="ai-service-status" data-ai-service-status role="status">기본 설명은 연결 없이 볼 수 있어요.</p>
  <div class="ai-request-actions"><button type="button" data-ai-request disabled>설명 더 보기</button><button type="button" class="quiet" data-ai-cancel hidden>취소</button></div>
  <p class="ai-request-message" data-ai-message role="status" hidden></p>
  <div class="ai-response" data-ai-response hidden aria-live="polite"></div>
 </div>`;
 anchor.after(helper);
 const q=selector=>helper.querySelector(selector),requestButton=q('[data-ai-request]'),cancelButton=q('[data-ai-cancel]');
 let disposed=false,mode='explain',status=null,statusController=null,controller=null,epoch=0,busy=false;
 const isCurrent=(token,context)=>!disposed&&helper.isConnected&&helper.open&&token===epoch&&context===contextOf(getState(),safeFacts(getState()));
 function clearResponse(){q('[data-ai-response]').replaceChildren();q('[data-ai-response]').hidden=true;q('[data-ai-message]').hidden=true;}
 function canRequest(){return status?.enabled===true&&status?.available===true&&(status.mode==='mock'||status.mode==='live'&&status.liveEnabled===true&&status.freeTierConfirmed===true);}
 function updateButton(){
  const mock=status?.mode==='mock';
  requestButton.textContent=busy?'확인하고 있어요…':mock?(mode==='explain'?'가상 응답으로 설명 보기':'가상 응답으로 문장 정리'):mode==='explain'?'설명 더 보기':'문장 정리 미리보기';
  requestButton.disabled=busy||!canRequest()||(mode==='parse-book'&&!q('[data-ai-book-phrase]').value.trim());cancelButton.hidden=!busy;
 }
 function invalidate({message=false}={}){
  epoch++;controller?.abort();controller=null;busy=false;clearResponse();updateButton();
  if(message){q('[data-ai-message]').textContent='입력이 바뀌어 이전 응답을 닫았어요.';q('[data-ai-message]').hidden=false;}
 }
 function refreshFacts(){
  const facts=safeFacts(getState()),recorded=facts.axes.filter(axis=>axis.books.length||['in_progress','done'].includes(axis.state));
  const answered=facts.axes.filter(axis=>!axis.books.length&&['not_started','unknown'].includes(axis.state));
  q('[data-ai-local-summary]').textContent=recorded.length?`${recorded.map(axis=>AXES[axis.axis]).join('·')} 학습 기록을 남겼어요. 각 과정은 따로 비교하고, 이해도는 진단에서 확인해요.`:answered.length?`학습 여부에 대한 답을 남겼어요. 아는 과정부터 추가해도 괜찮아요. 교과·사고력·연산은 각각 따로 살펴봐요.`:'아는 학습부터 기록해도 괜찮아요. 교과·사고력·연산은 각각 따로 살펴봐요.';
  if(getState()?.wizard?.academies?.length)q('[data-ai-local-summary]').textContent+=' 사고력 학원 경험은 별도로 기록했어요.';
  q('[data-ai-facts-summary]').textContent=`${DIRECTIONS[facts.direction]||DIRECTIONS.undecided} · `+facts.axes.map(axis=>`${AXES[axis.axis]}: ${axis.books.length?axis.books.map(book=>`${BOOK_NAMES.get(book.bookId)} ${scopeText(book.scope)} (${completionText(book)})`).join(', '):STATES[axis.state]}`).join(' / ');
  q('[data-ai-safe-payload]').textContent=JSON.stringify({kind:'explain',facts},null,2);
  return facts;
 }
 async function readStatus(){
  statusController?.abort();statusController=new AbortController();const own=statusController;
  const timeout=setTimeout(()=>own.abort(),3000);
  try{
   const response=await fetch('api/ai/status',{cache:'no-store',credentials:'same-origin',signal:own.signal});
   const value=await response.json();if(disposed||!helper.isConnected||statusController!==own)return;
   status=response.ok&&value?.ok===true?value:null;
   q('[data-ai-service-status]').textContent=canRequest()?status.mode==='mock'?'지금은 외부 전송 없는 가상 응답 시험입니다.':'버튼을 누르면 위 학습 항목만 AI로 보내요. 이름과 전체 기록은 보내지 않아요.':'AI 연결을 사용할 수 없어 기본 설명으로 이어갑니다.';
  }catch{if(!disposed&&statusController===own){status=null;q('[data-ai-service-status]').textContent='AI 연결을 사용할 수 없어 기본 설명으로 이어갑니다.';}}
  finally{clearTimeout(timeout);if(!disposed)updateButton();}
 }
 function displayResponse(result,responseMode){
  const output=q('[data-ai-response]');output.replaceChildren();
  output.append(paragraph(responseMode==='mock'?'가상 응답 미리보기':'AI 참고 설명','ai-response-label'));
  if(mode==='explain'){
   output.append(paragraph(result.text));
  }else{
   const list=document.createElement('ul');list.className='ai-candidates';
   for(const candidate of result.candidates){
    const item=document.createElement('li'),name=document.createElement('strong');name.textContent=candidate.bookName;
    item.append(name,paragraph(`${AXES[candidate.axis]} · ${scopeText(candidate.scope)} · ${completionText(candidate)}`));list.append(item);
   }
   output.append(list,paragraph('미리보기입니다. 교재 선택은 아래 학습 정보 수정에서 확인해 주세요.','ai-input-help'));
  }
  output.append(paragraph('현재 계획·학습 기록에는 저장되지 않아요.','ai-input-help'));output.hidden=false;
 }
 function fail(message){const p=q('[data-ai-message]');p.textContent=message;p.hidden=false;}
 async function request(){
  if(busy||!canRequest())return;
  invalidate();const facts=refreshFacts(),payload=mode==='explain'?{kind:mode,facts}:{kind:mode,text:q('[data-ai-book-phrase]').value.trim()};
  if(mode==='parse-book'&&!payload.text)return;
  const prepared=validateAIRequest(payload);if(!prepared.valid){fail(mode==='parse-book'?'교재 이름과 초등·중등 범위만 적어 주세요.':'설명할 학습 항목을 확인하지 못했어요. 기본 로드맵은 그대로 볼 수 있어요.');return;}
  const context=contextOf(getState(),facts),token=epoch,own=new AbortController();controller=own;busy=true;updateButton();
  let timedOut=false;const timeout=setTimeout(()=>{timedOut=true;own.abort();},10000);
  try{
   const response=await fetch('api/ai',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify(prepared.value),signal:own.signal});
   const data=await response.json();if(!isCurrent(token,context))return;
   if(!response.ok||data?.ok!==true){
    const code=String(data?.error?.code||'').toLowerCase();fail(['quota','quota_exceeded','rate_limit','rate_limited'].includes(code)?'지금은 응답 한도에 도달했어요. 기본 로드맵은 그대로 볼 수 있어요.':['timeout','timed_out'].includes(code)?'응답이 늦어 기본 설명으로 이어갑니다.':['invalid_input','invalid_book_phrase','bad_request'].includes(code)?'교재 이름과 초등·중등 범위를 확인해 주세요.':['disabled','live_disabled','service_disabled'].includes(code)?'AI 연결을 사용할 수 없어 기본 설명으로 이어갑니다.':'응답을 준비하지 못했어요. 기본 로드맵은 그대로 볼 수 있어요.');return;
   }
   const checked=validateAIResponse(mode,data);if(!checked.valid||checked.mode!==status?.mode){fail('응답을 확인하지 못해 기본 설명을 유지했어요.');return;}
   const matchesRequest=mode==='parse-book'?JSON.stringify(checked.result.candidates[0])===JSON.stringify(prepared.candidate):checked.result.factIds.every(id=>eligibleExplanationFacts(facts).some(fact=>fact.id===id));
   if(!matchesRequest){fail('현재 입력과 다른 응답이라 기본 설명을 유지했어요.');return;}
   displayResponse(checked.result,checked.mode);
  }catch{if(isCurrent(token,context)){fail(timedOut?'응답이 늦어 기본 설명으로 이어갑니다.':'응답을 준비하지 못했어요. 기본 로드맵은 그대로 볼 수 있어요.');}}
  finally{clearTimeout(timeout);if(!disposed&&token===epoch){busy=false;controller=null;updateButton();}}
 }
 helper.addEventListener('toggle',()=>{
  if(helper.open){refreshFacts();if(status===null)readStatus();}else invalidate();
 });
 // This optional helper is inside the result form; its temporary inputs never
 // enter that form's persistence handlers and Enter never submits the roadmap.
 helper.addEventListener('input',event=>{event.stopPropagation();invalidate();if(event.target.matches('[data-ai-book-phrase]'))q('[data-ai-phrase-preview]').textContent=event.target.value.trim()?`보낼 문장: ${event.target.value.trim()}`:'보낼 문장: 아직 입력하지 않았어요.';updateButton();});
 helper.addEventListener('change',event=>event.stopPropagation());
 helper.addEventListener('keydown',event=>{
  if(event.target.matches('[data-ai-book-phrase]')&&event.key==='Enter'){event.preventDefault();return;}
  if(event.target.matches('[data-ai-mode]')&&['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();const tabs=[...helper.querySelectorAll('[data-ai-mode]')],next=event.key==='Home'?tabs[0]:event.key==='End'?tabs[1]:tabs.find(tab=>tab!==event.target);next.click();next.focus();}
 });
 helper.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button)return;
  if(button.dataset.aiMode){invalidate();mode=button.dataset.aiMode;for(const tab of helper.querySelectorAll('[data-ai-mode]')){const active=tab.dataset.aiMode===mode;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;}q('#ai-explain-panel').hidden=mode!=='explain';q('#ai-parse-panel').hidden=mode!=='parse-book';updateButton();}
  else if(button.hasAttribute('data-ai-request'))request();
  else if(button.hasAttribute('data-ai-cancel')){invalidate();fail('응답 요청을 취소했어요.');}
 });
 refreshFacts();q('#ai-parse-tab').tabIndex=-1;updateButton();
 return {invalidate,dispose(){disposed=true;epoch++;controller?.abort();statusController?.abort();helper.remove();}};
}
