/* Presentation-only navigation. No learning choices or timeline rates change. */
(function(g){
'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const LABELS={book:'교과 교재',range:'연결 범위',deep:'심화 교재',deepScope:'심화 범위',cadence:'병행 방식',calc:'연산',checkpoint:'풀이 확인',tempo:'속도',allocation:'학습량 활용',load:'추가 회차',summary:'계획 확인'};
function steps(state={}){return ['book','range','deep',...(state.deep==='none'?[]:['deepScope','cadence']),'calc','checkpoint','tempo',...(state.tempo==='gradual'?['allocation',...(state.allocation==='advance'?['load']:[])]:[]),'summary'];}
function transition(state={},page='book'){
 const order=steps(state),index=Math.max(0,order.indexOf(page)),key=order[index],missing=order.slice(0,index+1).find(k=>k!=='summary'&&!state[k]);
 return {order,index,page:key,label:LABELS[key],previous:index?order[index-1]:null,next:index<order.length-1?order[index+1]:null,canNext:key!=='summary'&&!missing};
}
function render({standard=false,accepted=false,flow,page,state={},career=null}={}){
 if(standard)return '<nav class="plan-travel plan-standard-travel" aria-label="표준 계획에서 이어가기"><div><small>표준 계획을 먼저 살펴보세요</small><strong>'+(accepted?'표준 계획으로 이어갑니다.':'우리 아이에게 맞게 더 그려볼까요?')+'</strong></div><button type="button" data-standard-accept aria-pressed="'+accepted+'">'+(accepted?'표준 계획 선택됨':'이대로 공부하기')+'</button><button type="button" data-roadmap-mode="custom">맞춤 조정 →</button></nav>';
 if(flow==='language')return '<nav class="plan-travel" aria-label="영어·국어 설계 이동"><div class="plan-travel-top"><button type="button" data-flow-overview="home">← 전체 갈림길</button><span>영어·국어 학습 설계</span><button type="button" data-flow-choices>선택 화면</button></div></nav>';
 if(flow==='career'&&career)return '<nav class="plan-travel" aria-label="진로 탐색 이동"><div class="plan-travel-top"><button type="button" data-roadmap-mode="standard">← 표준 계획</button><span>'+esc(career.label)+' · '+(career.index+1)+' / '+career.count+'</span><button type="button" data-flow-choices>선택 화면</button></div><div class="plan-travel-steps"><button type="button" '+(career.previous?'data-career-page="'+career.previous+'"':'data-flow-overview="home"')+'>← 이전 갈림길</button><button type="button" '+(career.next?'data-career-page="'+career.next+'"':'data-flow-map')+(career.next&&!career.canNext?' disabled':'')+'>'+(career.next?'다음 갈림길 →':'선택한 경로 보기 →')+'</button></div></nav>';
 const m=transition(state,page);
 return '<nav class="plan-travel" aria-label="맞춤 설계 이동"><div class="plan-travel-top"><button type="button" data-roadmap-mode="standard">← 표준 계획</button><span>'+(flow==='transition'?esc(m.label)+' · '+(m.index+1)+' / '+m.order.length:'우리 아이 맞춤 설계')+'</span><button type="button" data-flow-choices>선택 화면</button></div>'+(flow==='transition'?'<div class="plan-travel-steps"><button type="button" '+(m.previous?'data-transition-open="'+m.previous+'"':'data-flow-overview="home"')+'>← '+(m.previous?'이전 갈림길':'전체 갈림길')+'</button><button type="button" '+(m.next?'data-transition-open="'+m.next+'"':'data-flow-map')+(m.next&&!m.canNext?' disabled':'')+'>'+(m.next?'다음 갈림길 →':'선택한 계획 보기 →')+'</button></div>':'<button type="button" class="plan-design-entry" data-transition-open="book">교재·범위와 병행 방식 조정 →</button>')+'</nav>';
}
let referenceSlots=null;
function references(doc,active){
 const dialog=doc.getElementById('planReferences'),host=doc.getElementById('planReferencesBody');if(!dialog||!host)return;
 if(active&&!referenceSlots){referenceSlots=[];for(const node of [doc.querySelector('main>.input-details'),doc.getElementById('milestoneDetails')]){if(!node)continue;const slot=doc.createComment('original planning reference');node.before(slot);host.append(node);referenceSlots.push({node,slot});}}
 if(!active&&referenceSlots){if(dialog.open)dialog.close();for(const {node,slot} of referenceSlots)slot.replaceWith(node);referenceSlots=null;}
}
g.PlannerPlanNavigation=Object.freeze({steps,transition,render,references});
})(window);
