(function(){
 'use strict';if(!DATA.somaSourceReuse)return;
 relationshipNames['source-response-candidate-reuse']='기존 소마 본문 분석의 응답별 연결 후보';
 const rowById=new Map([...DATA.sourceRecords,...DATA.lookupCorpus].map(r=>[r.id,r]));
 function evidence(row){
  const a=row.sourceResponseAlignment,band=row.sourceSpecificAssessment.level;
  return `<details class="soma-source-evidence"><summary>교재 위치와 기존 판단 근거</summary><ul>${row.sourceLocations.map(l=>`<li>${escape(l.display)}${l.sourceIsTeacherReferenceOnly?' · 학생 쪽수 확인 전':''}</li>`).join('')}</ul><p>출처의 난도 후보: ${band==null?'보류':band+' · 공통 난도 채택 전'}</p><p>${escape(row.sourceSpecificAssessment.rationale||'원문 조건과 응답을 먼저 확인합니다.')}</p>${a.interpretationHolds.length?`<p><b>보존한 확인 항목</b></p><ul>${a.interpretationHolds.map(h=>'<li>'+escape(h)+'</li>').join('')}</ul>`:''}<p class="meta">새 원문·정답 검토가 아닙니다. 교재의 호와 PDF·인쇄 쪽수, 교사 참조 위치를 구별했습니다.</p></details>`;
 }
 const previousCard=sourceCard;
 sourceCard=function(row){
  const html=previousCard(row);if(!row.somaReuseStage)return html;
  return html.replace(/<\/article>$/,evidence(row)+'</article>');
 };
 function decorate(){for(const card of document.querySelectorAll('#lookup-results [data-source-id],#identification [data-source-id]')){const row=rowById.get(card.dataset.sourceId);if(row?.somaReuseStage&&!card.querySelector('.soma-source-evidence'))card.insertAdjacentHTML('beforeend',evidence(row));}}
 const observer=new MutationObserver(decorate);for(const id of['lookup-results','identification'])observer.observe(document.getElementById(id),{childList:true,subtree:true});decorate();
 const style=document.createElement('style');style.textContent='.soma-reuse-figure{display:block;width:100%;max-width:480px;height:auto;margin:12px auto;max-height:260px}.soma-source-evidence{overflow-wrap:anywhere}.soma-source-evidence li{line-height:1.8}@media print{.problem-card[data-normalization-stage="soma-reuse"]{display:inline-block;width:100%;box-sizing:border-box;break-inside:avoid;margin:0 0 7mm;padding:0 0 5mm}.problem-card[data-normalization-stage="soma-reuse"] .write{height:30mm}.problem-card[data-normalization-stage="soma-reuse"] .soma-reuse-figure{max-width:360px;max-height:40mm;margin:4px auto}}';document.head.append(style);render();
}());
