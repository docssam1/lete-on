(function () {
 'use strict';
 if (!DATA.a1Normalization) return;
 relationshipNames['native-response-variants-not-item-classification']='기존 은행의 응답별 연결 후보';
 relationshipNames['same-core-different-response-scope']='같은 풀이 원리 · 구할 것의 범위 비교';
 const examples = new Map([...(DATA.specimens || []), ...(DATA.providerSpecimens || []), ...(DATA.normalizationExamples || [])].map(s => [s.instanceId, s]));
 const responseSets = [DATA.a1Normalization, DATA.a1CoreNormalization, DATA.a2Normalization, DATA.a3Normalization, DATA.a4Normalization, DATA.a5Normalization, DATA.g1ClockNormalization, DATA.g1GeometryNormalization, DATA.g2Normalization, DATA.g3Normalization, DATA.g4Normalization, DATA.g5Normalization, DATA.book2Normalization, DATA.book1Normalization, DATA.book1FoldGakuroNormalization, DATA.book4Normalization, DATA.book5Normalization, DATA.book6Normalization, DATA.book7Normalization, DATA.book8Normalization, DATA.book9Normalization, DATA.book10Normalization, DATA.defaultNormalization, DATA.crossBookAlignmentNormalization, DATA.familyAlignmentNormalization, DATA.remainingAlignmentNormalization, DATA.somaReuseNormalization, DATA.somaAuthoringNormalization].filter(Boolean);
 const refs = responseSets.flatMap(s => s.profileExamples);
 const allProfiles = responseSets.flatMap(s => s.profiles);
 const rows = DATA.lookupCorpus;
 const drawGraph = graph;
 graph = function () {
  drawGraph();
  const host = el('type-position'), profiles = allProfiles.filter(p => (p.typeIds || [p.typeId]).includes(type));
  if (!host || !profiles.length) return;
  const section = document.createElement('section'); section.className = 'normalization-context';
  section.innerHTML = `<h3>구할 것에 따라 살펴보기</h3><p class="meta">같은 풀이 원리를 쓰더라도 표현·연산·끝 조건에 따라 필요한 능력이 달라집니다. 아래 난도는 확인한 예시의 연구 후보입니다.</p>${profiles.map(p => {
   const ref = refs.find(r => r.profileId === p.id), sample = examples.get(ref.instanceId);
   const source = rows.find(r => sample.sourcePositionIds?.includes(r.id));
   const button = source ? `<button data-preview-source="${escape(source.id)}" ${DATA.specimens.some(s=>s.instanceId===sample.instanceId)?'data-reviewed-instance':'data-provider-instance'}="${escape(sample.instanceId)}">이 예시 문제 보기</button>` : '';
   return `<article class="normalization-profile" data-profile="${escape(p.id)}"><div class="normalization-heading"><h4>${escape(p.label)}</h4><span class="difficulty">예시 난도 후보 ${p.candidateBand}</span></div><dl><dt>먼저 할 수 있어야 할 것</dt><dd>${escape(p.minimumCapabilities.join(' · '))}</dd><dt>난도가 달라지는 조건</dt><dd>${escape(p.difficultyChanges)}</dd></dl>${button}<small>${['a1-core-answer-check.json','a2-answer-check.json','a3-answer-check.json','a4-answer-check.json','a5-answer-check.json','g1-clock-answer-check.json','g1-geometry-answer-check.json','g2-answer-check.json','g3-answer-check.json','g4-answer-check.json','g5-answer-check.json','book2-answer-check.json','book1-answer-check.json','book1fg-answer-check.json','book4-answer-check.json','book5-answer-check.json','book6-answer-check.json','book7-answer-check.json','book8-answer-check.json','book9-answer-check.json','book10-answer-check.json','default-answer-check.json'].includes(sample.validation.verificationArtifact) && sample.reusedProviderExample ? '기존 저장 예시 재사용 · 이번 답 확인' : sample.reusedProviderExample ? '기존 예시와 답 검증 재사용' : ['original-crossbook-model-variant','original-family-response-variant','original-remaining-response-variant'].includes(sample.origin) ? '기존 분석의 관계로 만든 새 문항 · 답 확인' : sample.origin === 'derived-response-projection' ? '기존 분석에서 구할 것을 나눈 새 예시 · 답 확인' : '기존 생성기의 다른 응답 예시 · 답 확인'}</small></article>`;
  }).join('')}`;
  const connected = DATA.sourceRecords.filter(r => r.typeIds.includes(type));
  const grouped = new Map();
  for (const r of connected) {
   const key = r.book + ' / ' + (r.printedIssue || (r.unitNumber != null ? r.unitNumber + '단원' : '단원 번호 확인 중'));
   if (!grouped.has(key)) grouped.set(key, {row:r, count:0}); grouped.get(key).count++;
  }
  section.insertAdjacentHTML('beforeend', `<details class="normalization-reappearance"><summary>이 유형과 연결된 교재·단원 ${grouped.size}곳</summary><p class="meta">같은 풀이가 다시 나오는 위치를 살펴보세요. 은행 유형·목차에서 연결한 위치는 개별 응답과 난도 확인 전입니다.</p><ul>${[...grouped].map(([label, g]) => `<li><b>${escape(label)}${g.row.unitTitle ? ' · '+escape(g.row.unitTitle) : ''}</b> · ${g.count}건 <button data-preview-source="${escape(g.row.id)}">교재 위치 보기</button></li>`).join('')}</ul></details>`);
  host.append(section);
 };
 const css = document.createElement('style');
 css.textContent = '.normalization-context{margin-top:24px;border-top:2px solid #dfe5dc;padding-top:22px}.normalization-profile{border:1px solid #d6ded4;border-left:4px solid #407f70;border-radius:8px;margin:14px 0;padding:16px}.normalization-heading{display:flex;gap:12px;justify-content:space-between;align-items:baseline}.normalization-heading h4{margin:0;line-height:1.6}.normalization-profile dl{font-size:13px;line-height:1.8;margin:12px 0}.normalization-profile dt{font-weight:700;margin-top:10px}.normalization-profile dd{margin:3px 0 0;overflow-wrap:anywhere}.normalization-profile small{display:block;color:var(--muted);margin-top:10px}.normalization-reappearance li{margin:10px 0;line-height:1.8}.normalization-context button{white-space:normal;min-height:44px}@media(max-width:600px){.normalization-heading{display:block}.normalization-heading .difficulty{display:block;margin-top:5px}.normalization-profile{padding:12px}}';
 document.head.append(css);
 render();
}());
