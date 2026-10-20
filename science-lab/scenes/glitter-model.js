// 반짝이 가루 손 모형(3-2 Ⅳ 감염병과 건강한 생활) 수치 — 브라우저·Node 테스트 공용, THREE 없음.
// 여섯 친구(A~F) 가운데 A의 손에만 반짝이 가루를 묻히고, 정해진 짝끼리 차례로 악수한다. 반짝이는 병원체가 아니라 「손으로 옮겨 가는 것」을 보여 주는 표식이다.
// 짝은 교재 활동의 종이 카드 규칙과 같다: 1차례 A-B·C-D·E-F, 2차례 B-C·D-E·F-A, 3차례 C-D·E-F·A-B.
// 「B·D·F가 손 씻기」 규칙: 차례마다 악수 전에 B·D·F가 손을 씻어 반짝이를 지운다(학습용 규칙 — 실제 손 씻기가 병원체를 얼마나 없애는지의 값이 아니다).
export const FRIENDS = ['A', 'B', 'C', 'D', 'E', 'F'];
export const ROUNDS = [[['A', 'B'], ['C', 'D'], ['E', 'F']], [['B', 'C'], ['D', 'E'], ['F', 'A']], [['C', 'D'], ['E', 'F'], ['A', 'B']]];
export const RULES = ['손 씻기 없음', 'B·D·F가 차례마다 손 씻기'];
export const WASHERS = [[], ['B', 'D', 'F']];

// 차례(1~3)를 마친 뒤 반짝이가 묻은 친구들
export function glitterAfter(round, rule = 0) {
  if (!(round >= 0 && round <= 3)) throw new RangeError('unknown round');
  let marked = new Set(['A']);
  for (let r = 0; r < round; r++) {
    for (const w of WASHERS[rule]) marked.delete(w);
    const next = new Set(marked);
    for (const [a, b] of ROUNDS[r]) if (marked.has(a) || marked.has(b)) { next.add(a); next.add(b); }
    marked = next;
  }
  return FRIENDS.filter((f) => marked.has(f));
}
export function glitterModel(round, rule = 0) {
  const who = glitterAfter(round, rule);
  return { round, rule: RULES[rule], who, n: who.length, result: `${who.length}명(${who.join('·')})` };
}
