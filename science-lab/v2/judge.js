// 쓰기 답 로컬 판정 — API 없이 기기 안에서. 아이에게 "예시 답과 비슷한가요?"를 묻지 않는다(원장 2026-09-30).
//
// 두 갈래:
//   1) 단답(short-text): 문항의 accepted 목록과 비교. 뒤에 붙은 말끝("응결해요")은 봐준다.
//   2) 서술(쓰기 칸·written-explanation): 단원 판정표(data/units/<u>.judge.js)의 핵심 생각(need)이 들어 있는지 본다.
//      - 규칙으로 가릴 수 없는 열린 문항(open: 아이디어 여러 개·설계)은 'review' — 선생님 확인, 필요할 때만 API.
//      - 두 번 써도 규칙에 안 걸리는데 답이 충분히 길면 'review'(다른 말로 맞게 썼을 수 있다) — 틀렸다고 하지 않는다.
//
// 판정표 한 항목(판정표 파일 머리 주석에 전체 설명):
//   { kind?: 'hypo', open?: true,
//     need: [{ t: '핵심 생각', ask: '빠졌을 때 되묻는 말', any: ['정규식', …], all?: ['정규식', …], not?: ['정규식'], count?: 2 }],
//     wrong?: [{ any: ['정규식'], m?: 'M09', say: '되묻는 말' }],
//     ex: { ok: ['통과해야 할 답'], part: ['부분'], no: ['통과하면 안 되는 답'] } }
//   정규식은 공백·문장부호를 없앤 글(norm)에 건다. 부정("~지 않다", "안 ~")이 바로 붙은 곳은 맞은 것으로 치지 않는다.

// 「기체: 화산 가스」의 쌍점은 「는」으로 바꿔 둔다 — 짝짓기 답(상태: 물질)을 「기체는 화산 가스」와 같게 읽으려고
export const norm = (s) => String(s ?? '').normalize('NFC').toLowerCase()
  .replace(/\s*[:=]\s*/g, '는')
  .replace(/(\d)\.(\d)/g, '$1점$2')   // 54.0 g ≠ 540 g — 소수점은 지우지 않는다
  .replace(/</g, '작').replace(/>/g, '큼')   // (가) < (나) ≠ (가) > (나) — 부등호도 지우지 않는다
  .replace(/ㄱ/g, '㉠').replace(/ㄴ/g, '㉡').replace(/ㄷ/g, '㉢').replace(/ㄹ/g, '㉣').replace(/ㅁ/g, '㉤').replace(/ㅂ/g, '㉥').replace(/ㅅ/g, '㉦').replace(/ㅇ/g, '㉧')   // 낱자 ㄱ·ㄴ은 글자 속에 없으니 늘 기호(「ㄴ, 」「ㄴ이」도)
  .replace(/[^0-9a-z가-힣㉠-㉧○×]/g, '');

const RX = new Map();
const rx = (p) => { let r = RX.get(p); if (!r) { r = new RegExp(p, 'g'); RX.set(p, r); } r.lastIndex = 0; return r; };

// 부정이 붙은 자리인가: 앞에 '안/못', 뒤에 '~지 않/못'
function negated(t, i, end) {
  const before = t.slice(Math.max(0, i - 1), i), after = t.slice(end, end + 4);
  const word = t.slice(Math.max(0, i - 2), i);   // 「오랫동안·편안·불안」의 안은 부정이 아니다
  return (/[안못]/.test(before) && !/^(동|편|불|평)안$/.test(word)) || /^[가-힣]?지(않|못|말)/.test(after) || /^[가-힣]?(않|없)/.test(after);
}
// 부정 아닌 곳에서 맞은 서로 다른 글 조각들
function hits(t, pats) {
  const out = new Set();
  for (const p of pats || []) { const r = rx(p); let m; while ((m = r.exec(t))) { if (!m[0]) { r.lastIndex++; continue; } if (!negated(t, m.index, m.index + m[0].length)) out.add(m[0]); } }
  return out;
}
const has = (t, pats) => hits(t, pats).size > 0;

function metNeed(t, n) {
  if (n.not && (n.not || []).some((p) => rx(p).test(t))) return false;
  if (n.all && !n.all.every((p) => has(t, [p]))) return false;
  if (!n.any) return true;
  return hits(t, n.any).size >= (n.count || 1);
}

// 단답: 정답 목록과 같거나, 정답 뒤에 말끝만 붙은 경우(최대 4글자)
export function judgeShort(text, accepted) {
  const t = norm(text); if (!t) return { st: 'empty' };
  for (const a of accepted || []) {
    const k = norm(a); if (!k) continue;
    const rest = t.slice(k.length);   // 말끝(「예요」 등)만 허용 — 기호·숫자가 더 붙으면(「ㄱ, ㄷ」에 「ㄹ」) 다른 답이다
    if (t === k || (t.startsWith(k) && rest.length <= 4 && !/^(이|가)?아니/.test(rest) && !/[㉠-㉧0-9○×]/.test(rest))) return { st: 'ok' };
  }
  return { st: 'no' };
}

// 서술: 결과 { st: 'ok'|'part'|'miss'|'wrong'|'review'|'empty', met: [t], missing: [{t, ask}], wrong: {m, say}? }
export function judgeText(text, key, { tries = 1, reviewLen = 15 } = {}) {
  const raw = String(text ?? '').trim(), t = norm(raw);
  if (!t) return { st: 'empty', met: [], missing: [] };
  if (!key || key.open) return { st: 'review', met: [], missing: [], why: key ? 'open' : 'nokey' };
  const met = [], missing = [];
  for (const n of key.need || []) (metNeed(t, n) ? met : missing).push({ t: n.t, ask: n.ask });
  const w = (key.wrong || []).find((x) => has(t, x.any));
  if (w) return { st: 'wrong', met: met.map((x) => x.t), missing, wrong: { m: w.m || null, say: w.say } };
  if (!missing.length) return { st: 'ok', met: met.map((x) => x.t), missing };
  // 두 번째에도 모자란데, 핵심 생각이 하나라도 있고 충분히 긴 답은 다른 말로 맞게 썼을 수 있다 → 틀렸다고 하지 않고 선생님(필요하면 API)에게.
  // 핵심 생각이 하나도 없으면 딴 이야기일 가능성이 크니 예시 답을 보여 준다(그 답을 "잘 썼다"고 하지 않게).
  if (tries >= 2 && met.length && t.length >= reviewLen) return { st: 'review', met: met.map((x) => x.t), missing, why: 'unsure' };
  return { st: met.length ? 'part' : 'miss', met: met.map((x) => x.t), missing };
}

// 문항(answerContract)이나 판정표 항목 하나를 받아 판정
export function judgeItem({ text, ac, key, tries }) {
  if (ac?.type === 'short-text') return judgeShort(text, ac.accepted?.length ? ac.accepted : [ac.answer]);
  return judgeText(text, key, { tries });
}
