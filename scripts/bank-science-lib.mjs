// 과학 탐구 랩 — 단원평가 원문을 문제은행에 넣는 공용 도구.
// 원장 지시(2026-10-09): 원문을 그대로 쓰고, 거기에 유사문항을 더해 문제은행을 만든다. 원문은 git의 정적 파일로 둔다
// (Supabase에 두면 사용자가 늘수록 요청 비용이 생긴다). 저장소는 유료 전환 후 비공개로 바꾼다.
//
// 입력(전사 작업 폴더): set1~4.json(원문, 정답 및 풀이 PDF와 대조) · map.json(원문→유형) · sim/*.json(원문 1문항당 유사 1문항)
//   · figmap.json + figs/*.webp(원문 그림을 시험지에서 잘라 낸 것)
// 출력: data/units/<u>.source.js(원문) · .similar.js(유사) · .taxonomy.js · .misc.js · .judge.js · 레슨 문항 유형 · 교재 확인 문제 키
import { readFileSync, writeFileSync, readdirSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'science-lab');
const UNITS = join(ROOT, 'data', 'units');
const CIRC = '①②③④⑤';
const uniq = (a) => [...new Set(a.filter((x) => x != null && String(x).trim() !== ''))];
const js = (o) => JSON.stringify(o, null, 2);
const load = async (f) => import(pathToFileURL(join(UNITS, f)).href + `?t=${Date.now()}`);
// 문제은행만 있는 새 단원(5단계 수업 없음)은 보조 파일이 아직 없다 — 빈 것에서 시작한다.
const loadOr = async (f, empty) => (existsSync(join(UNITS, f)) ? load(f) : empty);

function contract(x, cfg, key) {
  const circ = [...String(x.answer)].filter((c) => CIRC.includes(c)).map((c) => CIRC.indexOf(c));
  if (x.choices && circ.length === 1) return { type: 'single-choice', answer: circ[0], accepted: [circ[0]] };
  if (x.choices && circ.length > 1) return { type: 'multi-choice', answers: circ };
  if (x.format === '서술형') {
    const req = cfg.required[`src:${key}`]; if (!req) throw new Error(`서술형 ${key} 채점 요소(required) 없음`);
    return { type: 'written-explanation', sample: x.answer, rubric: { required: req, pass: '채점 기준을 모두 담으면 정답', criteria: (x.rubric || []).map((r) => (r.ratio ? `${r.criterion} (${r.ratio})` : r.criterion)) } };
  }
  return { type: 'short-text', answer: x.answer, accepted: uniq([x.answer, ...(x.accepted || []), ...(cfg.accept?.[key] || [])]) };
}

export async function importUnit(cfg) {
  const { unit, dir } = cfg, date = cfg.date;
  const M = JSON.parse(readFileSync(join(dir, 'map.json'), 'utf8'));
  const figmap = existsSync(join(dir, 'figmap.json')) ? JSON.parse(readFileSync(join(dir, 'figmap.json'), 'utf8')) : {};
  const sets = [1, 2, 3, 4].filter((s) => existsSync(join(dir, `set${s}.json`)));
  const orig = sets.flatMap((s) => JSON.parse(readFileSync(join(dir, `set${s}.json`), 'utf8')).map((x) => ({ ...x, set: s, key: `${s}-${x.no}` })));
  const sim = Object.fromEntries(readdirSync(join(dir, 'sim')).filter((f) => f.endsWith('.json')).flatMap((f) => JSON.parse(readFileSync(join(dir, 'sim', f), 'utf8'))).map((x) => [x.key, x]));
  for (const [k, fix] of Object.entries(cfg.patchSim || {})) fix(sim[k]);
  const TYPE = cfg.types, EL = Object.fromEntries(Object.entries(TYPE).map(([id, t]) => [id, t.element]));
  for (const o of orig) { if (!M.map[o.key]) throw new Error(`유형 없음 ${o.key}`); if (!sim[o.key]) throw new Error(`유사문항 없음 ${o.key}`); if (sim[o.key].T !== M.map[o.key]) throw new Error(`유형 불일치 ${o.key}`); }

  // 그림 — 시험지에서 잘라 낸 원문 그림
  const figDir = join(ROOT, 'assets', 'bank', unit); mkdirSync(figDir, { recursive: true });
  for (const name of new Set(Object.values(figmap))) copyFileSync(join(dir, 'figs', `${name}.webp`), join(figDir, `${name}.webp`));

  const tax = (type, format) => ({ curriculum: '2022 개정', grade: cfg.grade, semester: cfg.semester, unit: cfg.uKey, area: cfg.area, element: EL[type], type, format, level: '기본', track: '교과' });
  const source = orig.map((o) => {
    const type = M.map[o.key], ac = contract(o, cfg, o.key), rub = (o.rubric || []).map((r) => (r.ratio ? `${r.criterion} (${r.ratio})` : r.criterion));
    return {
      id: `${unit}-o${o.set}-${String(o.no).padStart(2, '0')}`, status: 'verified',
      sourceRef: { type: 'original', set: o.set, no: o.no, page: o.page, sourceId: `${cfg.sourceId}-set${o.set}`, edition: cfg.single ? cfg.edition : `${cfg.edition} 세트${o.set}`, course: cfg.course, unit: cfg.unitLabel },
      taxonomy: { ...tax(type, o.format), topic: o.topic, concept: o.concept },
      prompt: o.prompt, givens: o.givens ?? null, choices: o.choices ? o.choices.map((c) => c.replace(/^[①②③④⑤]\s*/, '')) : null,
      figure: figmap[o.key] ? `assets/bank/${unit}/${figmap[o.key]}.webp` : null, figureNote: o.figure?.note ?? null,
      visualModel: null, variantRules: null, responseContract: ac.type, answerContract: ac,
      explanation: rub.length ? `${o.explanation}\n[채점 기준] ${rub.join(' / ')}` : o.explanation,
      evidence: { checkedBy: 'Claude', date, gates: ['source', 'answer'], against: '정답 및 풀이', note: o.uncertain || undefined },
    };
  });
  const similar = orig.map((o, i) => {
    const r = sim[o.key], type = r.T;
    const ac = r.kind === 'sc' ? { type: 'single-choice', answer: r.answer, accepted: [r.answer] }
      : r.kind === 'mc' ? { type: 'multi-choice', answers: r.answer }
      : r.kind === 'st' ? { type: 'short-text', answer: r.answer, accepted: uniq([r.answer, ...(r.accepted || [])]) }
      : { type: 'written-explanation', sample: r.sample, rubric: { required: r.required, pass: '채점 기준을 모두 담으면 정답' } };
    return {
      id: `${unit}-v${String(i + 1).padStart(3, '0')}`, status: 'authored', sourceRef: { type: 'similar', of: { set: o.set, no: o.no } },
      taxonomy: tax(type, r.fmt), prompt: r.prompt, givens: r.givens ?? null, choices: r.choices ?? null, visualModel: null, variantRules: null,
      responseContract: ac.type, answerContract: ac, explanation: r.explanation,
      evidence: { checkedBy: 'Claude', date, gates: ['science', 'answer'] },
    };
  });
  const idOf = Object.fromEntries(orig.flatMap((o, i) => [[`src:${o.key}`, source[i].id], [`sim:${o.key}`, similar[i].id]]));

  // 분류 체계
  const { taxonomy: oldTx } = await loadOr(`${unit}.taxonomy.js`, { taxonomy: { title: cfg.unitTitle, standards: [] } });
  const authored = Object.fromEntries(Object.entries(cfg.lessonTypes || {}).map(([b, t]) => [`${unit}-${b}`, t]));
  const taxonomy = { unit, curriculum: '2022 개정', grade: cfg.grade, semester: cfg.semester, title: oldTx.title, area: cfg.area, standards: oldTx.standards || [],
    elements: cfg.elements, types: Object.entries(TYPE).map(([id, t]) => ({ id, element: t.element, name: t.name, desc: t.desc })),
    formats: ['선택형', '단답형', '서술형'], sources: Object.fromEntries(orig.map((o) => [o.key, [M.map[o.key], o.format]])), authored };
  writeFileSync(join(UNITS, `${unit}.taxonomy.js`), `// ${cfg.title} — 2022 개정 교육과정 기준 분류. 유형(types)은 단원평가 세트1~4 원문 ${orig.length}문항을 실제로 나눈 결과다.\n// sources = 원문 (세트-번호) → [유형, 형식]. 원문 자체는 ${unit}.source.js.\nexport const taxonomy = ${js(taxonomy)};\n`);
  writeFileSync(join(UNITS, `${unit}.source.js`), `// ${cfg.title} — 단원평가 원문 ${orig.length}문항(${cfg.edition} 세트${sets.join('·')}). 시험지를 그대로 옮기고 정답 및 풀이와 대조했다.\n// 원장 지시(2026-10-09): 원문을 그대로 문제은행에 쓴다. 그림은 시험지에서 잘라 낸 것(assets/bank/${unit}/).\nexport const source = ${js(source)};\n`);
  writeFileSync(join(UNITS, `${unit}.similar.js`), `// ${cfg.title} — 유사문항 ${similar.length} (창작). 원문 1문항당 1개, 같은 유형·난이도로 상황과 물체를 바꿨다. of = 짝이 되는 원문 (세트, 번호).\nexport const similar = ${js(similar)};\n`);

  // 레슨 문항 유형을 새 분류로
  const fresh = !existsSync(join(UNITS, `${unit}.js`));
  const U = fresh ? { unit: { id: unit, course: cfg.course.replace('초등 ', ''), no: cfg.no, title: cfg.unitTitle, domain: cfg.area, sources: {} }, items: [] } : await load(`${unit}.js`);
  for (const it of U.items) { const t = authored[it.id]; if (!t) throw new Error(`레슨 문항 유형 없음 ${it.id}`); it.taxonomy = { ...it.taxonomy, element: EL[t], type: t, concept: TYPE[t].name }; }
  U.unit.sources = { ...U.unit.sources, bank: [`data/units/${unit}.source.js`] };
  const head = fresh ? `// ${cfg.title} — 문제은행 단원(5단계 수업은 아직 없음). 원문은 ${unit}.source.js, 유사문항은 ${unit}.similar.js.\n` : readFileSync(join(UNITS, `${unit}.js`), 'utf8').match(/^(\/\/.*\n)*/)[0];
  writeFileSync(join(UNITS, `${unit}.js`), `${head}export const unit = ${js(U.unit)};\nexport const items = ${js(U.items)};\n`);

  // 오개념표 — 원문과 짝 유사문항은 같은 오개념을 공유한다
  const misc = { ...(await loadOr(`${unit}.misc.js`, { misconceptions: {}, distractors: {}, typed: {}, remedy: {}, written: {} })) };
  const keepB = (o) => Object.fromEntries(Object.entries(o || {}).filter(([k]) => /-b\d+$/.test(k)));
  misc.misconceptions = { ...misc.misconceptions };
  for (const [m, el] of Object.entries(cfg.mElement || {})) misc.misconceptions[m] = { ...misc.misconceptions[m], element: el };
  Object.assign(misc.misconceptions, cfg.newMis);
  misc.remedy = { ...misc.remedy, ...Object.fromEntries(Object.entries(cfg.newMis).map(([m, v]) => [m, { step: v.step || 3 }])) };
  for (const m of Object.values(misc.misconceptions)) delete m.step;
  misc.distractors = keepB(misc.distractors); misc.typed = keepB(misc.typed); misc.written = keepB(misc.written);
  const tag = (it, m) => {
    const ac = it.answerContract;
    if (ac.type === 'written-explanation') { misc.written[it.id] = { partial: [] }; return; }
    if (!m) return;
    if (ac.type === 'single-choice' || ac.type === 'multi-choice') { const ok = new Set([].concat(ac.answer ?? ac.answers)); misc.distractors[it.id] = Object.fromEntries(it.choices.map((_, i) => i).filter((i) => !ok.has(i)).map((i) => [i, m])); }
    else misc.typed[it.id] = { any: m };
  };
  orig.forEach((o, i) => { const m = cfg.mFix?.[o.key] || sim[o.key].m || null; tag(similar[i], m); tag(source[i], m); });
  const order = ['misconceptions', 'distractors', 'typed', 'cloze', 'cells', 'remedy', 'bookChips', 'written'];
  const keys = [...order.filter((k) => k in misc), ...Object.keys(misc).filter((k) => !order.includes(k) && k !== 'default')];
  writeFileSync(join(UNITS, `${unit}.misc.js`), keys.map((k) => `export const ${k} = ${js(misc[k])};`).join('\n') + '\n');

  // 쓰기 판정표 — 옛 유사문항 키를 지우고 새 원문·유사 서술형을 넣는다
  const { judge: J0 } = await loadOr(`${unit}.judge.js`, { judge: {} });
  const judge = Object.fromEntries(Object.entries(J0).filter(([k]) => !/-v\d+$/.test(k)));
  for (const [k, v] of Object.entries(cfg.judge)) { if (!idOf[k]) throw new Error(`판정표 키 ${k}`); judge[idOf[k]] = v; }
  writeFileSync(join(UNITS, `${unit}.judge.js`), `export const judge = ${js(judge)};\n`);

  // 교재 확인 문제·형성평가 키(세트-번호)
  const bookF = join(ROOT, 'data', 'book', `${unit}.book.js`);
  if (cfg.book && existsSync(bookF)) {
    let t = readFileSync(bookF, 'utf8');
    const arr = (a) => `[\n${a.map((k) => `    "${k}"`).join(',\n')}\n  ]`;
    t = t.replace(/"check": \[[^\]]*\]/, `"check": ${arr(cfg.book.check)}`).replace(/("formative": \{\s*"items": )\[[^\]]*\]/, (_, p) => `${p}${arr(cfg.book.formative).replace(/\n  \]$/, '\n    ]').replace(/\n {4}"/g, '\n      "')}`);
    for (const k of [...cfg.book.check, ...cfg.book.formative]) if (!sim[k]) throw new Error(`교재 키 ${k} 없음`);
    writeFileSync(bookF, t);
  }
  console.log(`${unit}: 원문 ${source.length} · 유사 ${similar.length} · 그림 ${new Set(Object.values(figmap)).size} · 유형 ${Object.keys(TYPE).length}`);
}
