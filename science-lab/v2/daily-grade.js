// Daily Test 채점 — 네트워크·API 없이 이 기기에서만(MSG 초·과·심 「Daily Test · 채점과 첨삭」을 이 사이트의 문항 계약에 맞춰 옮김).
// 채점 규칙
//  · 고르기·표·빈칸 고르기: 정답과 같으면 ○, 다르면 ✕(오답 보기·칸에 걸린 오개념으로 잇는다).
//  · 단답: 정답 목록과 같으면 ○. 이 단원의 낱말 목록에 있는 「다른」 낱말이면 ✕. 그 어느 쪽도 아니면 추측하지 않고 「검토 필요」.
//  · 서술: 단원 판정표(data/units/<u>.judge.js)로 핵심 생각이 모두 있으면 ○, 오개념 문장이면 ✕, 그 밖(일부·다른 말)은 「검토 필요」.
//  · 「검토 필요」는 점수와 분모에서 뺀다. 빈칸은 「안 푼 문항」.
//  · 스스로 체크(자신 있어요/헷갈려요)는 채점과 따로 두고 점수에 넣지 않는다.
import { judgeText, judgeShort, norm } from './judge.js';

const blank = (v) => v == null || (Array.isArray(v) ? v.every((x) => blank(x)) : !String(v).trim());

// 이 단원에서 「확실히 다른 답」으로 볼 수 있는 낱말들: 빈칸·낱말 칩의 보기와 다른 단답 문항의 정답
export function vocabOf(pool, misc) {
  const V = new Set();
  for (const C of Object.values(misc?.cloze || {})) for (const opts of C.options || []) for (const o of opts) V.add(norm(o));
  for (const [, [opts]] of Object.entries(misc?.bookChips || {})) for (const o of opts || []) V.add(norm(o));
  for (const it of pool) if (it.answerContract?.type === 'short-text') for (const a of [it.answerContract.answer, ...(it.answerContract.accepted || [])]) V.add(norm(a));
  return V;
}

// status: correct | wrong | review | blank. detail은 progress.record()에 그대로 넘긴다.
export function gradeDaily(it, value, { misc, judge, vocab } = {}) {
  const ac = it.answerContract;
  if (blank(value)) return { status: 'blank' };
  if (ac.type === 'single-choice') {
    const i = Number(value), ok = i === ac.answer;
    return { status: ok ? 'correct' : 'wrong', detail: { picked: i } };
  }
  if (ac.type === 'multi-choice') {
    const picked = [].concat(value).map(Number), ok = picked.length === ac.answers.length && ac.answers.every((a) => picked.includes(a));
    return { status: ok ? 'correct' : 'wrong', detail: { picked: picked.filter((p) => !ac.answers.includes(p)) } };
  }
  if (ac.type === 'short-text') {
    if (judgeShort(value, ac.accepted?.length ? ac.accepted : [ac.answer]).st === 'ok') return { status: 'correct', detail: { typed: String(value) } };
    if (vocab?.has(norm(value))) return { status: 'wrong', detail: { typed: String(value) } };
    return { status: 'review', reason: 'text', detail: { typed: String(value) } };
  }
  if (ac.type === 'cloze') {
    const vals = [].concat(value), slots = ac.blanks.map((b, k) => {
      const v = vals[k]; if (blank(v)) return 'blank';
      if (judgeShort(v, b.accepted?.length ? b.accepted : [b.answer]).st === 'ok') return 'correct';
      return misc?.cloze?.[it.id] || vocab?.has(norm(v)) ? 'wrong' : 'review';
    });
    if (slots.includes('blank')) return { status: 'blank', slots };
    const wrongBlanks = slots.map((s, k) => (s === 'wrong' ? k : -1)).filter((k) => k >= 0);
    const status = wrongBlanks.length ? 'wrong' : slots.every((s) => s === 'correct') ? 'correct' : 'review';
    return { status, slots, reason: status === 'review' ? 'text' : undefined, detail: { wrongBlanks } };
  }
  if (ac.type === 'table-fill') {
    const cells = ac.rows.map((r, ri) => r.answer.map((a, ci) => { const v = value?.[ri]?.[ci]; return blank(v) ? 'blank' : String(v) === String(a) ? 'correct' : 'wrong'; }));
    const flat = cells.flat();
    if (flat.includes('blank')) return { status: 'blank', cells };
    const ok = flat.every((c) => c === 'correct');
    return { status: ok ? 'correct' : 'wrong', cells, detail: { wrongCells: !ok } };
  }
  if (ac.type === 'written-explanation') {
    const r = judgeText(value, judge?.[it.id], { tries: 1 });
    if (r.st === 'ok') return { status: 'correct', judged: r };
    if (r.st === 'wrong') return { status: 'wrong', judged: r, detail: { m: r.wrong?.m ? [r.wrong.m] : [] } };
    return { status: 'review', reason: 'written', judged: r };
  }
  return { status: 'review', reason: 'type' };
}

export function summarize(rows) {
  const n = (s) => rows.filter((r) => r.status === s).length;
  const correct = n('correct'), wrong = n('wrong');
  return { correct, wrong, confirmed: correct + wrong, review: n('review'), blank: n('blank'), total: rows.length };
}

// 이번 Daily Test의 첫 채점으로만 오개념을 진단: 서로 다른 두 문항 → 확정, 한 문항 → 의심
export function diagnoseDaily(firstRows) {
  const by = {};
  for (const r of firstRows) if (r.status === 'wrong') for (const m of r.m || []) (by[m] = by[m] || new Set()).add(r.id);
  return Object.entries(by).map(([m, ids]) => ({ m, items: [...ids], status: ids.size >= 2 ? 'confirmed' : 'suspected' }))
    .sort((a, b) => (a.status === b.status ? b.items.length - a.items.length : a.status === 'confirmed' ? -1 : 1));
}

// 「아홉 문항 채점하기」처럼 쓰는 고유어 수(1~20)
const NUMS = ['', '한', '두', '세', '네', '다섯', '여섯', '일곱', '여덟', '아홉', '열', '열한', '열두', '열세', '열네', '열다섯', '열여섯', '열일곱', '열여덟', '열아홉', '스무'];
export const countWord = (n) => NUMS[n] || String(n);
