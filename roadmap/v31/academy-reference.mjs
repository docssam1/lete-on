import {esc} from './intake.mjs';
import {sourceReviewMarkup} from './source-review.mjs';
const clone=x=>structuredClone(x);
export const E1_SOURCE=Object.freeze({title:'2026 7세 E1반 운영 로드맵',copyId:'2026_7세_E1반_사용자첨부.png',hash:'fc546cbcb3a1dfd1c1261e8d4e65687bdd1e281c7424ef63ade3816080a5484d',version:'2026-E1-user-photo-v1',appliesYear:2026,targetClass:'7세 E1반',sourceStatus:'user_provided',officialScheduleConfirmed:false,role:'class_case_reference',sourcePosition:'인쇄표 더클래식1·2행 / 하단 S1·S2 손글씨',scopeNote:'사용자 설명상 주2회 높은반·S반 바로 아래 사례. 모든 E1반·매년 공통 기준으로 일반화하지 않음.'});
export function academyContext(s){
 const items=[...(s.workspace?.learningItems||[]),...(s.workspace?.activityItems||[])].filter(x=>x.source?.caseId==='fields-e1-2026');
 return {target:s.wizard?.quick?.target||'undecided',premier:s.goals?.premier||'undecided',source:clone(E1_SOURCE),items:clone(items),automaticEnrollment:false,automaticPromotion:false};
}
export const ACADEMY_LEARNING_SOURCE=Object.freeze({date:'2026-10-10',sourceStatus:'user_provided',source:'사용자 직접 정정: 필즈는 교과를 하지 않음 / 소마는 교과를 함',officialScopeConfirmed:false,role:'roadmap_operation_reference'});
export function academyLearningNote(){return '<p class="note" data-academy-learning-note>소마에서 배운 교과는 따로 기록해요. 필즈 수업은 사고력에 기록하고, 교과·연산은 별도로 공부한 내용만 알려주세요.</p>';}
export function academyPreparationMarkup(){return '<details data-academy-preparation><summary>소마·필즈가 어떤 곳인가요?</summary><p>소마는 사고력과 교과를 함께 다루고, 필즈 수업에는 교과를 포함하지 않아요. 소마 준비는 사고력 선행을, 필즈 준비는 수업 외 연산 기반과 교과 보완을 살펴봅니다.</p><p class="note">사용자 로드맵 기준 · 2026-10-10 정정. 학원명으로 아이의 교과 범위나 완료 여부를 정하지 않습니다.</p></details>';}
export function academyReferenceMarkup(context,{actions=true}={}){
 const c=context||{},items=c.items||[],events=items.filter(x=>x.kind==='event');
 return `<details class="academy-reference-info"><summary>소마·필즈가 궁금해요 · 학습 준비와 선발 정보</summary><p>소마는 사고력과 교과를 함께 다루고, 필즈의 교과는 별도 학습입니다. 학원 경험만으로 아이의 교과 진도를 만들지 않아요.</p><ul><li>필즈 준비: 수업 외 연산 기반과 교과 보완을 살펴봅니다.</li><li>소마 준비: 수업을 따라가기 위한 사고력 선행 준비를 살펴봅니다. 교과는 실제 공부한 범위를 따로 남겨요.</li></ul><p class="note">교과 운영 구분은 2026-10-10 사용자 직접 정정입니다. 공식 공통 운영 요강을 확인한 설명은 아닙니다.</p>${sourceReviewMarkup()}<details><summary>2026 7세 E1반 사례 보기</summary><p>주2회 높은반이며 S반 바로 아래라는 사용자 설명이 있는 사례입니다.</p><p>더클래식 1과정과 함께 2026년 1~6월 필즈 입문, 7월부터 필즈 실력을 진행합니다. 실력의 종료 월과 세부 권별 월 배치는 이번 연결에 입력하지 않았습니다.</p><p>선발 참고: 2026년 7월 S1, 11월 S2. 사용자 제공 일정이며 공식 모집 공고를 확인한 일정이 아닙니다.</p><p>E1 유지 계획과 S반 선발은 별개입니다. 선발 이후 S반 학습 진도는 이 사례에서 만들지 않습니다.</p><p>일부 S반 희망 학생의 소마 주1회·필즈 주2회·서브 병행 사례가 있습니다. 서브의 내용·교재·횟수는 미확인입니다.</p><p class="note">2026년 · 7세 E1반 · 사용자 첨부 인쇄표와 손글씨 메모. 다른 반·연도의 공통 기준으로 사용하지 않습니다.</p>${actions&&!items.length?'<button type="button" data-academy-reference>이 사례를 월별 계획에서 비교해 보기</button>':''}</details>${events.length?`<p data-academy-current-events>내 계획에 참고한 선발: ${events.map(x=>`${esc(x.title)} · ${esc(x.plan?.start?.value||'시점 미정')} · ${esc(({considering:'고민 중',planned:'예정',confirmed:'하기로 정함',completed:'실제로 마침'})[x.actionStatus]||'미정')}`).join(' / ')}</p>`:''}<p class="note">선발 일정은 학습 진도·성취율에 합산하지 않습니다. 등록·합격·진급 여부를 뜻하지 않습니다.</p></details>`;
}
export function academyReferenceOperations(s){
 if(academyContext(s).items.length)throw Error('이미 참고한 사례가 있습니다. 월별 목록에서 해당 항목의 수정안을 만들어 주세요.');
 const month=v=>({precision:'month',value:v}),unknown={precision:'unknown',value:''};
 const source=(key,position)=>({...clone(E1_SOURCE),caseId:'fields-e1-2026',caseKey:key,sourcePosition:position});
 const id=k=>`e1-reference-${k}-${crypto.randomUUID()}`;
 const learn=(key,title,start,end,position)=>({id:id(key),kind:'learning',axis:'thinking',subtrack:'thinking',title,bookName:title,volume:'',scope:'해당 E1반 사례 참고',status:'planned',plan:{start:month(start),end:end?month(end):unknown,confirmed:false},source:source(key,position),autoSummary:{version:1,purpose:'academy',text:[title,start,end||'종료 월 미확인','2026 7세 E1반 사용자 제공 사례'].join(' / ')},userNote:'',note:''});
 const event=(key,title,start)=>({id:id(key),kind:'event',axis:'thinking',title,action:'participation',intent:'undecided',actionStatus:'considering',institution:'필즈더클래식',program:key.toUpperCase(),recruitmentYear:'2026',plan:{start:month(start),end:month(start),confirmed:false},source:source(key,`하단 손글씨 ${key.toUpperCase()} 선발 메모 + 사용자 지시서`),autoSummary:{version:1,purpose:'academy',text:`${title} / ${start} / 2026 7세 E1반 사용자 제공 일정`},userNote:'',note:''});
 const items=[learn('classic1','더클래식 1과정 · E1 유지 사례','2026-01','', '인쇄 더클래식1행 · 2026 표시구간 시작 (종료 월 연결 미정)'),learn('intro','필즈 입문 · E1 유지 사례','2026-01','2026-06','인쇄 더클래식2행 · 7세1~6월'),learn('skill','필즈 실력 · E1 유지 사례','2026-07','','인쇄 더클래식2행 · 7세7월부터'),event('s1','S1 선발 · 사용자 제공 참고','2026-07'),event('s2','S2 선발 · 사용자 제공 참고','2026-11')];
 return items.map(item=>({id:`op-${crypto.randomUUID()}`,type:item.kind==='event'?'event.upsert':'learning.upsert',item}));
}
