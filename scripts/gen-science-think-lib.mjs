// 「교과 연결 사고력」 수업 데이터 공용 생성기 — gen-science-think-<단원>.mjs 가 부른다.
// 쓰는 파일(문제은행 파일은 건드리지 않는다):
//   data/units/<U>.think.js   수업 문항(unit·items) + 판정표(judge) + 오개념 보충(misc)
//   data/book/<U>.book.js     교재·수업 화면(chapter·art·plan) — 기본 수업 틀(deck.js buildSlides · book.js renderChapter)
//   data/book/<U>.interact.js 예상·설계·떠올리기·오늘 배운 것 고르기
//   data/voice/<U>.voice.json 독쌤 대사(음성 파일은 모든 기능을 마친 뒤 한꺼번에 — 없으면 기기 음성)
import fs from 'node:fs';
const R = new URL('../science-lab/', import.meta.url).pathname;
const J = (o) => JSON.stringify(o, null, 2);
const DATE = '2026-10-19';

export function buildThink(o) {
  const { U, P, T, STD, NAME, Q, MISC, JUDGE, LINES, chapter, plan, interact, grade, semester, area, course, title } = o;
  const EV = { checkedBy: 'Claude', date: DATE, gates: ['curriculum-2022', 'science', 'answer', 'choice-length'] };
  const fmtOf = { cloze: '서술형', table: '서술형', sc: '선택형', wr: '서술형' };
  const tax = (q) => ({ curriculum: '2022 개정', grade, semester, unit: U.slice(-3), area, element: T[q.T], type: q.T, standard: STD[T[q.T]], format: fmtOf[q.kind],
    level: q.level || '기본', track: '교과', topic: NAME[q.T], concept: NAME[q.T], inquirySkill: NAME[q.T] });
  const ac = (q) => {
    if (q.kind === 'cloze') return { type: 'cloze', blanks: q.blanks.map((b) => (Array.isArray(b) ? { answer: b[0], accepted: b } : { answer: b, accepted: [b] })) };
    if (q.kind === 'table') return { type: 'table-fill', rowHead: q.rowHead, columns: [q.col], options: { [q.col]: q.options }, rows: q.rows.map(([label, a]) => ({ label, answer: [a] })) };
    if (q.kind === 'sc') return { type: 'single-choice', answer: q.answer, accepted: [q.answer] };
    return { type: 'written-explanation', sample: q.sample, rubric: { required: q.need.map((n) => n.t), pass: '핵심 생각을 모두 담으면 정답' } };
  };
  const rc = { cloze: 'cloze', table: 'table-fill', sc: 'single-choice', wr: 'written-explanation' };
  const id = (q) => `${U}-t${String(q.no).padStart(2, '0')}`;
  const items = Q.map((q) => ({ id: id(q), status: 'authored', prompt: q.prompt, givens: null, choices: q.choices || null, responseContract: rc[q.kind], answerContract: ac(q),
    explanation: q.kind === 'wr' ? q.exText : q.ex, taxonomy: tax(q),
    sourceRef: { type: 'authored-lesson', edition: '2022 개정 사고력 수업', note: '사고력 수업(예상→모형→개념→적용)의 창작 문항. 모형 수치는 모형 값이며 실제 측정·학생 수행 기록이 아님.' },
    visualModel: null, variantRules: null, evidence: EV }));

  // 정답 자리 · 「정답이 눈에 띄게 가장 긴 보기」 검사(bank/audit.mjs와 같은 기준) — 어기면 멈춘다
  const pos = [0, 0, 0, 0, 0];
  for (const q of Q.filter((x) => x.kind === 'sc')) {
    if (q.choices.length !== 5) throw new Error(`${id(q)} 보기 5개가 아님`);
    pos[q.answer]++; const L = q.choices.map((c) => c.length), a = q.answer;
    if (L[a] === Math.max(...L) && L.filter((x) => x === L[a]).length === 1 && Math.max(...L) - [...L].sort((x, y) => y - x)[1] >= 3) throw new Error(`${id(q)} 정답이 눈에 띄게 가장 긴 보기`);
    if (new Set(q.choices).size !== 5) throw new Error(`${id(q)} 보기 중복`);
  }
  if (Math.max(...pos) - Math.min(...pos) > 2) throw new Error(`정답 위치 쏠림 ${pos}`);

  // 판정표: 수업 쓰기 칸(deck:*) + 서술 문항
  const ask = (n) => ({ ...n, ask: n.ask || `“${n.t}”에 대해 조금 더 써 볼까요?` });
  const judge = Object.fromEntries(Object.entries(JUDGE).map(([k, v]) => [k, { ...v, need: v.need.map(ask) }]));
  for (const q of Q.filter((x) => x.kind === 'wr')) judge[id(q)] = { need: q.need.map(ask), ...(q.wrong ? { wrong: q.wrong } : {}), ex: q.ex };

  // 오개념 보충(문제은행 misc에 더한다 — v2.js 로더가 합친다)
  const misc = { misconceptions: MISC, distractors: {}, cloze: {}, cells: {}, written: {}, remedy: {}, bookChips: {} };
  for (const q of Q) {
    if (q.kind === 'sc') misc.distractors[id(q)] = Object.fromEntries(Object.entries(q.m).map(([k, m]) => [String(k), m]));
    if (q.kind === 'cloze') misc.cloze[id(q)] = { options: q.chips, wrong: q.m };
    if (q.kind === 'table') misc.cells[id(q)] = q.m;
    if (q.kind === 'wr') misc.written[id(q)] = { partial: [] };
  }
  for (const [m, step] of Object.entries(o.remedy || {})) misc.remedy[m] = { step };
  for (const [w, a, b, m] of o.bookChips || []) misc.bookChips[w] = [[w, a, b], m];
  // 오개념 표의 근거 문항이 있는지(없는 N은 진단에서 안 잡힌다)
  for (const m of Object.keys(MISC)) {
    const used = JSON.stringify([misc.distractors, misc.cloze, misc.cells, judge]).includes(`"${m}"`);
    if (!used) throw new Error(`${m} 근거 문항 없음`);
  }
  const unit = { id: `${U}-think`, course, no: Number(U.slice(-2)), title: `${title} · 사고력 수업 문항`, domain: area };
  fs.writeFileSync(R + `data/units/${U}.think.js`, `// ${title} — 사고력 수업 문항·판정표·오개념 보충. scripts/${o.gen || `gen-science-think-${U.replace(/-/g, '')}.mjs`} 가 만든다(직접 고치지 말 것).
export const unit = ${J(unit)};
export const items = ${J(items)};
export const judge = ${J(judge)};
export const misc = ${J(misc)};
`);

  // 교재 그림: 3D 모형 렌더(tools/book-art.html → assets/book/<U>-<shot>.webp) + SVG 도표
  const art = {};
  for (const [k, [shot, alt, w, h]] of Object.entries(o.art)) art[k] = `<figure class="bk-photo bk-render"><img src="../assets/book/${U}-${shot}.webp" alt="${alt}" width="${w}" height="${h}"></figure>`;
  Object.assign(art, o.svg || {});
  fs.writeFileSync(R + `data/book/${U}.book.js`, `// ${title} — 교과 연결 사고력 수업·교재(기본 수업 틀). scripts/gen-science-think-${U.replace(/-/g, '')}.mjs 가 만든다.
// 예전 탐구 기록 앱(활동 기록·보고서)은 선택 기능으로 옮겼다 — data/units/${U}.records.js · #/${U}/records
export const art = ${J(art)};
export const chapter = ${J(chapter)};
export const plan = ${J(plan)};
`);
  fs.writeFileSync(R + `data/book/${U}.interact.js`, `// ${title} — 수업 화면 고르기 활동(형식은 s41-u01.interact.js 머리 주석).\nexport const interact = ${J(interact)};\n`);
  const voice = { voice: 'docssam-omnivoice', note: '안내 문장만 준비. 새 음성은 모든 기능 완료 후 생성. 기존 공용 음성·전신 캐릭터 재사용. Google TTS 사용 안 함.',
    slides: Object.fromEntries(Object.keys(LINES).map((k) => [k, `${P}-${k}`])), lines: Object.entries(LINES).map(([k, text]) => ({ id: `${P}-${k}`, text })) };
  fs.writeFileSync(R + `data/voice/${U}.voice.json`, J(voice) + '\n');
  console.log(U, 'items', items.length, '정답 위치', pos.join('·'), 'judge', Object.keys(judge).length);
}
