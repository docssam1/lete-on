// 「교과 연결 사고력」 단원의 편집 교재(문제집형 A4) 공용 생성기 — gen-science-workbook-<단원>.mjs 가 부른다.
// 쓰는 파일: data/book/<U>.workbook.js (문항·쪽·교사용 해설 쪽·빠른 정답표·교재 전용 그림).
// 그리는 곳: v2/book-editorial.js(지면 규약) · v2/think-workbook-paper.js(#/<U>/workbook/student|teacher|answers|quick).
// 지키는 것(어기면 멈춘다): 객관식 보기 5개·중복 없음, 정답 자리 쏠림 ≤2, 정답이 눈에 띄게 가장 긴 보기 아님,
// 모든 문항이 어느 쪽에든 실림(빠짐·중복 없음), 문항 형식 8가지 중 6가지 이상 사용, 쪽마다 오른쪽 날개 있음.
import fs from 'node:fs';
const R = new URL('../science-lab/', import.meta.url).pathname;
const J = (o) => JSON.stringify(o, null, 1);
const MARK = ['①', '②', '③', '④', '⑤'];

export function workbook({ U, title, semester, no, theme, misconception, criteria, misByTopic = {} }) {
  const questions = [], pages = [], teacherNotes = {}, errors = [];
  let rot = 0;
  const KEYS = [2, 4, 1, 0, 3];
  const add = (form, topic, prompt, answer, explanation, extra = {}) => {
    const n = questions.length + 1;
    questions.push({ id: `${U}-w${String(n).padStart(3, '0')}`, no: n, form, topic, prompt, answer, explanation,
      misconception: extra.mis || misByTopic[topic] || misconception, criteria: extra.crit || criteria, ...Object.fromEntries(Object.entries(extra).filter(([k]) => !['mis', 'crit'].includes(k))) });
    return n;
  };
  const api = {
    // 객관식: opts[0]이 정답. 정답 자리는 미리 정한 순환(①~⑤ 고르게)으로 넣는다.
    C: (topic, prompt, opts, why, x = {}) => {
      if (opts.length !== 5 || new Set(opts).size !== 5) throw Error(`보기 5개·중복 없음: ${prompt}`);
      const key = x.key ?? KEYS[rot++ % 5], choices = opts.slice(1); choices.splice(key, 0, opts[0]);
      const L = choices.map((c) => c.length), top = Math.max(...L), second = [...L].sort((a, b) => b - a)[1];
      if (L[key] === top && L.filter((v) => v === top).length === 1 && top - second >= 3) errors.push(`${questions.length + 1}번 정답이 눈에 띄게 가장 긴 보기(${L.join('/')}, 정답 ${L[key]})`);
      return add('choice', topic, prompt, `${MARK[key]} ${opts[0]}`, why, { ...x, choices, key });
    },
    M: (topic, prompt, choices, keys, why, x = {}) => add('multi', topic, prompt, keys.map((i) => MARK[i]).join(', '), why, { choices, key: keys, ...x }),
    B: (topic, prompt, answer, why, x = {}) => add('blank', topic, prompt, answer, why, x),
    S: (topic, prompt, answer, why, x = {}) => add('short', topic, prompt, answer, why, x),
    X: (topic, prompt, parts, answer, why, x = {}) => add('match', topic, prompt, answer, why, { parts, answerPerPart: true, ...x }),
    O: (topic, prompt, given, answer, why, x = {}) => add('order', topic, prompt, answer, why, { given, ...x }),
    W: (topic, prompt, answer, why, crit, x = {}) => add('written', topic, prompt, answer, why, { lines: 3, crit, ...x }),
    D: (topic, prompt, answer, why, crit, x = {}) => add('draw', topic, prompt, answer, why, { drawing: 'large', crit, ...x }),
    // 쪽 블록
    T: (text) => ({ type: 'text', text }), H: (text) => ({ type: 'heading', text }), L: (items, ordered = false) => ({ type: 'list', items, ordered }),
    FIG: (key, caption) => ({ type: 'diagram', key, caption }), F: (title, hint, lines = 3, draw = false) => ({ type: 'field', title, hint, lines, draw }),
    TB: (heads, rows) => ({ type: 'table', heads, rows }), EX: (question, steps, answer) => ({ type: 'example', question, steps, answer }),
    Q: (a, b = a) => ({ type: 'questions', ids: questions.slice(a - 1, b).map((q) => q.id) }),
    N: (title, text, write = 0) => ({ title, text, ...(write ? { write } : {}) }), NL: (title, items) => ({ title, items }),
    GAL: (items, { numbered = false, cols = 9, credit = '' } = {}) => { const it = items.filter(Boolean); return it.length ? { type: 'gallery', items: it, numbered, cols: Math.min(cols, it.length), credit } : null; },
    // 블록 자리에 null 을 두면 빠진다(사진이 아직 없을 때). 단원평가·준비 점검은 짧은 문항을 2단으로(layout 'two').
    P: (section, title, blocks, rail, lead = '', kind = 'learn', teacherNote = '') => { pages.push({ section, title, blocks: blocks.filter(Boolean), rail, lead, kind, ...(['test', 'check'].includes(kind) ? { layout: 'two' } : {}), ...(teacherNote ? { teacherNote } : {}) }); },
    questions, pages, teacherNotes,
  };
  api.build = ({ figures = {}, gen }) => {
    if (errors.length) throw Error(errors.join('\n'));
    // 빠짐·중복 검사
    const used = pages.flatMap((p) => p.blocks.filter((b) => b.type === 'questions').flatMap((b) => b.ids));
    const miss = questions.filter((q) => !used.includes(q.id)).map((q) => q.no), dup = used.filter((id, i) => used.indexOf(id) !== i);
    if (miss.length || dup.length) throw Error(`쪽에 안 실린 문항 ${miss} · 두 번 실린 문항 ${dup}`);
    const pos = [0, 0, 0, 0, 0]; questions.filter((q) => q.form === 'choice').forEach((q) => pos[q.key]++);
    if (Math.max(...pos) - Math.min(...pos) > 2) throw Error(`정답 위치 쏠림 ${pos}`);
    const forms = new Set(questions.map((q) => q.form));
    if (forms.size < 6) throw Error(`문항 형식이 ${forms.size}가지뿐(${[...forms]})`);
    for (const p of pages) if (!p.rail?.length) throw Error(`오른쪽 날개 없음: ${p.title}`);
    // 교사용 해설 쪽: 서술·그림은 쪽당 3문항, 나머지는 4문항
    const teacherPages = [];
    for (let i = 0; i < questions.length;) {
      const heavy = questions.slice(i, i + 4).some((q) => ['written', 'draw'].includes(q.form)), n = heavy ? 3 : 4, part = questions.slice(i, i + n);
      teacherPages.push({ section: `정답·해설 ${part[0].no}~${part.at(-1).no}`, title: '정답·풀이·인정 답안', kind: 'answers', blocks: [{ type: 'solutions', ids: part.map((q) => q.id) }],
        rail: [{ title: '채점할 때', text: '서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요.' }, { title: '다시 가르칠 때', text: '틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요.' }] });
      i += n;
    }
    const quickPages = [];
    for (let i = 0; i < questions.length; i += 16) {
      const part = questions.slice(i, i + 16);
      quickPages.push({ section: '빠른 정답표', title: `${part[0].no}~${part.at(-1).no}번`, kind: 'quick',
        blocks: [{ type: 'table', heads: ['번호', '형식 · 주제', '정답'], rows: part.map((q) => [String(q.no), `${q.form === 'choice' ? '객관식' : q.form === 'multi' ? '모두 고르기' : q.form === 'blank' ? '빈칸' : q.form === 'short' ? '단답' : q.form === 'match' ? '연결' : q.form === 'order' ? '순서' : q.form === 'draw' ? '그림' : '서술'} · ${q.topic}`, ['written', 'draw'].includes(q.form) ? '교사 확인(해설 쪽)' : q.form === 'choice' ? q.answer.slice(0, 1) : q.answer]) }],
        rail: [{ title: '쓰는 법', text: '채점만 빠르게 할 때 써요. 풀이와 인정 답안은 정답·해설 쪽에 있어요.' }] });
    }
    const out = { unit: U, title, semester, no, theme, richText: true, questions, pages, teacherPages, quickPages, figures };
    fs.writeFileSync(R + `data/book/${U}.workbook.js`, `// ${title} — 편집 교재(문제집형 A4). scripts/${gen} 가 만든다(직접 고치지 말 것).\n// 그리는 곳: v2/think-workbook-paper.js → #/${U}/workbook/student|teacher|answers|quick\nexport const workbook = ${J(out)};\n`);
    console.log(U, '교재', pages.length, '쪽 · 해설', teacherPages.length, '쪽 · 빠른 정답', quickPages.length, '쪽 · 문항', questions.length, '· 정답 위치', pos.join('·'), '· 형식', [...forms].join(','));
  };
  return api;
}

// 3D 렌더 사진 블록(실사형 설명 그림). 모형 값임을 그림 밑에 밝힌다.
export const photo = (U, shot, alt, note, credit = '3D 모형 렌더 · 모형 값(실제 측정이 아님)') =>
  `<div class="ed-photo"><img src="../assets/book/${U}-${shot}.webp" alt="${alt}" loading="eager"><p class="ed-photo-note">${note}</p><small class="ed-photo-credit">${credit}</small></div>`;

// 실사형 설명 사진(원장 PC에서 만든 AI 사진 · scripts/book-photos.py → assets/book/<U>-photo-<key>.webp).
// 파일이 있으면 그 경로를, 없으면 null(그 자리는 3D 렌더로 대신하거나 블록을 뺀다).
export const PHOTO_CREDIT = 'AI 실사형 설명 이미지 · 실제 사진 아님';
export const photoSrc = (U, key) => (fs.existsSync(R + `assets/book/${U}-photo-${key}.webp`) ? `../assets/book/${U}-photo-${key}.webp` : null);
export const renderSrc = (U, shot) => `../assets/book/${U}-${shot}.webp`;
// 사진이 있으면 사진, 없으면 3D 렌더 — 갤러리 칸 하나
export const cell = (U, key, shot, alt, cap) => { const src = photoSrc(U, key) || (shot ? renderSrc(U, shot) : null); return src ? { src, alt, cap } : null; };
// 사진만(없으면 null) — 개념 사진처럼 대신할 렌더가 없는 칸
export const only = (U, key, alt, cap) => { const src = photoSrc(U, key); return src ? { src, alt, cap } : null; };
