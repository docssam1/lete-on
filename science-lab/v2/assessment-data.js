// 원문 세트와 창작 평가의 자료 출처를 섞지 않는다.
export function assessmentPool(mod, bank) {
  const authored = (mod.items || []).filter((q) => q.status === 'authored' && q.sourceRef?.type === 'authored-assessment');
  if (bank?.mixedSourceAssessment) return [...(mod.source || []), ...authored];
  return bank?.authored
    ? authored
    : mod.source || [];
}

export function assessmentRelated(unit, bank, item, step = 3) {
  const target = bank?.reviewUnits?.[item.taxonomy?.element] || unit;
  return `#/${target}/${step}`;
}
