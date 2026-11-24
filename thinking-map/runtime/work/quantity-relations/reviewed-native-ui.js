(function () {
 'use strict';
 if (!DATA.reviewedNativeReuse) return;
 const drawGraph=graph, sampleById=new Map(DATA.specimens.map(s=>[s.instanceId,s]));
 graph=function(){
  drawGraph();
  const host=el('type-position'),ids=[...new Set([...(byType[type].reviewedNativeSpecimenIds||[]),...(byType[type].sourceBoundReviewedSpecimenIds||[])])];
  if(!host||!ids.length)return;
  const section=document.createElement('section');section.className='normalization-context reviewed-native-context';
  section.innerHTML=`<h3>기존에 검산한 예시</h3><p class="meta">기존 분석의 문제·정답·풀이를 재사용했습니다. 교재 원문과 조건·난도가 같은지는 별도 확인합니다.</p>${ids.map(id=>{
   const s=sampleById.get(id),row=DATA.lookupCorpus.find(r=>r.reviewedSpecimenIds?.includes(id)),band=studentDifficultyBand(s);
   return `<article class="normalization-profile" data-reviewed-instance="${escape(id)}"><h4>${escape(s.name)}</h4><p class="difficulty">${band==null?'난도 확인 중':'이 예시의 난도 후보 '+band+' · 교사 확인 전'}</p>${s.responseAdaptation?`<p class="meta">${escape(typeof s.responseAdaptation==='string'?s.responseAdaptation:'기존 분석의 응답 범위를 구분한 예시입니다.')}</p>`:''}<button data-preview-source="${escape(row.id)}" data-reviewed-instance="${escape(id)}">검산한 문제 보기</button></article>`;
  }).join('')}`;host.append(section);
 };
 el('stats').insertAdjacentHTML('beforeend',`<br>기존 검산 예시 ${DATA.reviewedNativeReuse.counts.existingExamples+(DATA.sourceBoundReview?.counts.existingExamples||0)}개를 은행 ${DATA.reviewedNativeReuse.counts.nativeIDs+(DATA.sourceBoundReview?.counts.nativeIDs||0)}개 분류에 재연결`);
 render();
}());
