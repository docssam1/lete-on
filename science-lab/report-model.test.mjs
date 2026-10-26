// node --test science-lab/report-model.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { TEMPLATES, FORMS, formTemplate, prefill, chartData, withMean, locate, segments, emptyReport, validReport, textKeys, obsKey, treeNode, splitTree, syncTree, treeAt, treeLeaves, treeIssues, unsplitTree, tableTouched } from './report-model.js';
import { reportCfg, REPORTS, primaryContest } from './data/reports.js';
import { UNITS, LEVEL_OF, LEVELS, CONTESTS, CONTEST_OF, contestsOf } from './data/curriculum.js';
import { TECHNIQUES, SCENES, WORKS } from './data/invent-gallery.js';
import { OBSERVE_SETS } from './data/observe-sets.js';
import { SAMPLES } from './data/observe-samples.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

test('양식: 과학탐구 초등 9칸·중등 11칸, 대회 양식 6개 모두 결과 표 칸(result) 하나와 점검 4개 이상', () => {
  assert.equal(TEMPLATES.elem.cells.length, 9); assert.equal(TEMPLATES.mid.cells.length, 11);
  for (const [ct, byLevel] of Object.entries(FORMS)) for (const [lv, t] of Object.entries(byLevel)) {
    const tables = t.cells.filter((c) => c.kind === 'table'); assert.equal(tables.length, 1, `${ct}.${lv}`); assert.equal(tables[0].key, 'result', `${ct}.${lv}`);
    assert.ok(t.checks.length >= 4, `${ct}.${lv}`); assert.equal(new Set(t.cells.map((c) => c.key)).size, t.cells.length, `${ct}.${lv} 칸 key 중복`);
    assert.ok(t.cells.length <= (lv === 'elem' ? 10 : 12), `${ct}.${lv} 칸이 너무 많다`);
    if (lv === 'mid') assert.ok(t.cells.length >= byLevel.elem.cells.length - 1, `${ct}: 중등이 초등보다 칸이 적다`);
  }
  assert.equal(formTemplate('nope', 'elem'), TEMPLATES.elem);
});
test('대회: 15실험 모두 대회가 하나 이상, 대회마다 실험이 있다', () => {
  for (const u of UNITS) { const cs = contestsOf(u); assert.ok(cs.length && cs.every(Boolean), u.id); }
  for (const c of CONTESTS) assert.ok(UNITS.some((u) => contestsOf(u).includes(c)), c.id);
  for (const [id, list] of Object.entries(CONTEST_OF)) for (const c of list) assert.ok(FORMS[c], `${id}: ${c}`);
  assert.equal(primaryContest('seed'), 'inquiry'); assert.equal(primaryContest('spider'), 'nature'); assert.equal(primaryContest('top'), 'invent');
});
test('자연관찰 양식: 대회 과제 유형(관찰그림·분류 나무·벤 다이어그램)이 초등·중등 모두에 있다', () => {
  for (const lv of ['elem', 'mid']) { const kinds = FORMS.nature[lv].cells.map((c) => c.kind); for (const k of ['obs', 'tree', 'venn', 'table']) assert.ok(kinds.includes(k), `${lv}: ${k}`); }
  const T = FORMS.nature.mid, keys = textKeys(T, { __obs: 3 });
  assert.ok(keys.includes('sheet.0') && keys.includes('sheet.2') && !keys.includes('sheet.3'), '관찰그림 칸은 대상 수만큼');
  assert.ok(['venn.a', 'venn.both', 'venn.b'].every((k) => keys.includes(k)), '벤 세 구역');
  assert.ok(keys.includes('classify'), '분류 나무 칸에도 기준 설명 글');
  assert.ok(!keys.includes('result'), '표 칸은 글 칸이 아니다');
  assert.equal(obsKey('sheet', 2, 'label'), 'sheet.2.label');
});
test('발명 양식: 내 생각(gate) 칸이 수상작 갤러리 칸보다 앞에 있다', () => {
  for (const lv of ['elem', 'mid']) { const cs = FORMS.invent[lv].cells, g = cs.findIndex((c) => c.gate), y = cs.findIndex((c) => c.gallery); assert.ok(g >= 0 && y > g, lv); }
  const ids = new Set(TECHNIQUES.map((t) => t.id)), scenes = new Set(SCENES.map((t) => t.id));
  for (const w of WORKS) { assert.ok(w.name && w.problem && w.idea && w.award, JSON.stringify(w).slice(0, 60)); assert.ok(w.tech.length && w.tech.every((t) => ids.has(t)), w.name); assert.ok(scenes.has(w.scene), w.name); assert.ok(['elem', 'mid'].includes(w.level), w.name); }
});
test('분류 나무: 갈래 나누기·칩 옮기기·대상 바뀜·점검', () => {
  const r = treeNode(['①', '②', '③', '④']);
  assert.deepEqual(treeIssues(r).map((x) => x.kind), ['open']);
  splitTree(r, ['①', '③']); assert.deepEqual(r.yes.items, ['①', '③']); assert.deepEqual(r.no.items, ['②', '④']);
  assert.deepEqual(treeIssues(r).map((x) => x.kind).sort(), ['noq', 'open', 'open']);
  r.q = '잎이 물 위에 뜨나요?'; splitTree(r.yes, ['①']); r.yes.q = '잎에 갈라진 틈이 있나요?';
  assert.equal(treeAt(r, 'r.y.y').items[0], '①'); assert.deepEqual(treeAt(r, 'r.y.n').items, ['③']);
  splitTree(r, ['①', '③', '②']); assert.deepEqual(r.no.items, ['④']); assert.deepEqual(r.yes.yes.items, ['①'], '아래 갈래는 유지');
  assert.deepEqual(r.yes.no.items, ['②', '③'], '새로 온 것은 그렇지 않다 쪽(순서는 처음 목록 순)');
  syncTree(r, ['①', '②', '④', '⑤']); assert.deepEqual(treeLeaves(r).flat().sort(), ['①', '②', '④', '⑤'], '없어진 것은 빠지고 새 것은 남는다');
  splitTree(r.no, []); assert.ok(treeIssues(r).some((x) => x.kind === 'empty'));
  unsplitTree(r.no); r.no.items.length === 1 || assert.ok(treeIssues(r).some((x) => x.kind === 'open'));
});
test('15실험 전부 초등 또는 중등으로 분류되고, 설정이 있는 실험은 분류와 같다', () => {
  for (const u of UNITS) assert.ok(LEVELS.some((l) => l.id === LEVEL_OF[u.id]), u.id);
  for (const [id, r] of Object.entries(REPORTS)) if (UNITS.some((u) => u.id === id)) assert.equal(r.level, LEVEL_OF[id], id);
  assert.equal(LEVEL_OF.seed, 'elem'); assert.equal(LEVEL_OF.hotwater, 'mid');
});
test('미리 채우기: 탐구 문제·변인·준비물·순서가 실험 자료에서 들어가고 수준에 따라 변인 이름이 다르다', () => {
  const seed = UNITS.find((u) => u.id === 'seed'), hot = UNITS.find((u) => u.id === 'hotwater');
  const e = prefill(seed, reportCfg('seed'), 'elem'), m = prefill(hot, reportCfg('hotwater'), 'mid');
  assert.match(e.question, /싹튼 개수/); assert.match(e.vars, /^바꿀 것: /); assert.match(e.steps, /^1\. /); assert.ok(!e.method);
  assert.match(m.question, /얼 때까지/); assert.match(m.vars, /독립 변인/); assert.match(m.method, /^1\. /); assert.ok(!m.steps);
});
test('가이드·질문: 공통 문구에 실험 문구가 더해지고, 모든 대회 양식의 글 칸마다 가이드·질문이 하나 이상', () => {
  const c = reportCfg('seed'); assert.ok(c.guide.predict.length >= 2); assert.ok(c.asks.learned.some((q) => q.includes('60℃')));
  const d = reportCfg('bubble'); assert.equal(d.level, 'elem'); assert.ok(d.guide.motive.length >= 1);   // 설정 없는 실험도 공통은 있다
  for (const [ct, byLevel] of Object.entries(FORMS)) for (const [lv, t] of Object.entries(byLevel)) {
    const cfg = reportCfg('bubble', lv, ct);
    for (const cell of t.cells.filter((x) => x.ask && x.kind !== 'table')) { assert.ok(cfg.guide[cell.key]?.length, `${ct}.${lv}.${cell.key} 가이드`); assert.ok(cfg.asks[cell.key]?.length, `${ct}.${lv}.${cell.key} 질문`); }
  }
  const n = reportCfg('bubble', 'elem', 'nature'); assert.equal(n.contest, 'nature'); assert.deepEqual(n.table.columns.slice(0, 2), ['번호', '이름(모르면 생김새)'], '기본 대회가 아니고 by 설정도 없으면 그 대회 기본 표');
  assert.equal(reportCfg('seed', 'elem', 'nature').table.columns[1], '3일', 'by.nature가 있으면 그 표');
  assert.equal(reportCfg('seed', 'elem', 'inquiry').table.rows[0], '4℃');
});
test('미리 채우기: 자연관찰 연습은 대상 수만큼 이름표(물풀 8종), 발명은 불편함 칸', () => {
  const ob = { id: 'observe-water', title: 'x', activity: { materials: ['자'], steps: ['본다'] } };
  const p = prefill(ob, reportCfg('observe-water', 'mid', 'nature'), 'mid', 'nature');
  assert.equal(p.__obs, 8); assert.equal(p['sheet.0.label'], '①'); assert.match(p.target, /연못/);
  const top = UNITS.find((u) => u.id === 'top'), q = prefill(top, { ...reportCfg('top', 'elem', 'invent'), problem: '팽이가 금방 멈춘다' }, 'elem', 'invent');
  assert.equal(q.motive, '팽이가 금방 멈춘다'); assert.match(q.steps, /^1\. /);
  assert.ok(!tableTouched({ columns: ['a', 'b'], rows: [['4℃', ''], ['', '']] })); assert.ok(tableTouched({ columns: ['a', 'b'], rows: [['4℃', '3']] }));
});
test('표 → 그래프: 숫자 열이 여럿이면 꺾은선, 하나면 막대. 평균 열은 회차 열에서 계산', () => {
  const t = { columns: ['물의 온도', '3일', '5일', '7일'], rows: [['4℃', '2', '6', '8'], ['60℃', '0', '1', '1'], ['', '', '', '']] };
  const c = chartData(t); assert.equal(c.type, 'line'); assert.deepEqual(c.x, ['3일', '5일', '7일']); assert.equal(c.series.length, 2); assert.equal(c.max, 8);
  const b = chartData({ columns: ['조건', '시간(분)'], rows: [['맹물', '38'], ['소금물', '52']] }); assert.equal(b.type, 'bar');
  assert.equal(chartData({ columns: ['조건', '1회'], rows: [['', '']] }), null);
  const m = withMean({ columns: ['조건', '1회', '2회', '3회'], rows: [['맹물', '38', '41', '52']] });
  assert.deepEqual(m.columns, ['조건', '1회', '2회', '3회', '평균']); assert.equal(m.rows[0][4], '43.7');
  assert.deepEqual(withMean(m).columns, m.columns, '두 번 불러도 평균 열이 하나');
});
test('첨삭 닻: 위 글이 바뀌어 밀려도 같은 낱말을 다시 잡고, 지워지면 lost로 간다', () => {
  const m = { id: 'a', cell: 'learned', s: 10, e: 13, t: '않았다', kind: 'fix', text: '않았다' };
  assert.deepEqual(locate('씨앗이 거의 않았다 싹트지', m) ? locate('씨앗이 거의 않았다 싹트지', m) : null, [7, 10]);
  const v2 = '새 문장을 앞에 넣었다. 씨앗이 거의 않았다 싹트지';
  const r = segments(v2, [m, { id: 'b', cell: 'learned', s: 0, e: 3, t: '없는글', kind: 'hl' }]);
  assert.equal(r.lost.length, 1); assert.ok(r.parts.some((p) => p.text === '않았다' && p.marks.length === 1));
  assert.equal(r.parts.map((p) => p.text).join(''), v2, '조각을 이으면 원문');
});
test('빈 보고서는 형식 검사를 통과하고, 깨진 것은 거른다', () => {
  const seed = UNITS.find((u) => u.id === 'seed'), r = emptyReport(seed, reportCfg('seed'), 'elem');
  assert.ok(validReport(r)); assert.equal(r.table.rows.length, 4); assert.equal(r.table.rows[0][0], '4℃');
  assert.ok(!validReport({ ...r, level: 'high' })); assert.ok(!validReport({ ...r, marks: 'x' }));
  assert.equal(r.contest, 'inquiry'); assert.ok(!validReport({ ...r, contest: 'sports' })); const old = { ...r }; delete old.contest; assert.ok(validReport(old), '대회 구분 전 보고서도 읽는다');
});

test('15실험 전부 보고서 설정(탐구 문제 또는 불편함·결과 표)이 있고, 두 번째 대회 설정(by)도 양식이 맞는다', () => {
  for (const u of UNITS) {
    const r = REPORTS[u.id]; assert.ok(r, u.id); assert.ok(r.table?.columns?.length >= 2 && r.table.rows.length >= 2, `${u.id} 표`);
    const ct = primaryContest(u.id); assert.ok(ct === 'nature' ? r.target && r.obs?.length : ct === 'invent' ? r.problem : r.question, `${u.id} 미리 채울 글(${ct})`);
    for (const [c2, b] of Object.entries(r.by || {})) { assert.ok(CONTEST_OF[u.id].includes(c2), `${u.id}.by.${c2}는 그 실험의 대회가 아니다`); assert.ok(c2 === 'inquiry' ? b.question : c2 === 'nature' ? b.target : b.problem, `${u.id}.by.${c2}`); }
  }
  const t = reportCfg('top', 'elem', 'inquiry'); assert.match(t.question, /지름/); assert.equal(t.table.rows[0], '4 cm'); assert.equal(reportCfg('top', 'elem', 'invent').table.rows[0], '기존 팽이');
  const s = reportCfg('seed', 'elem', 'nature'); assert.equal(s.obs.length, 4); assert.ok(!s.question, '자연관찰 양식에는 탐구 문제가 안 간다');
});
test('자연관찰 연습 세트: 보고서 설정·대회·표본 모듈이 갖춰져 있고, 빼는 칸은 양식에 있는 칸이다', () => {
  assert.equal(OBSERVE_SETS.length, 7);
  for (const S of OBSERVE_SETS) {
    assert.equal(S.unit.id, S.id); assert.ok(REPORTS[S.id]?.obs?.length, `${S.id} 설정`); assert.deepEqual(CONTEST_OF[S.id], ['nature'], S.id);
    assert.ok(['elem', 'mid'].includes(S.level) && REPORTS[S.id].level === S.level, `${S.id} 수준`);
    assert.ok(S.mod.SPECIMENS.length >= 3 && S.mod.VIEWS.angle && typeof S.mod.mountSpecimen === 'function' && S.mod.TOOLS.length, `${S.id} 표본 모듈`);
    assert.equal(REPORTS[S.id].obs.length, S.mod.SPECIMENS.length, `${S.id}: 이름표 수 = 표본 수`);
    const keys = FORMS.nature[S.level].cells.map((c) => c.key); for (const k of S.unit.reportSkip) assert.ok(keys.includes(k), `${S.id} skip ${k}`);
    for (const k of Object.keys(S.unit.reportPatch || {})) assert.ok(keys.includes(k) && !S.unit.reportSkip.includes(k), `${S.id} patch ${k}`);
    if (S.unit.reportOrder) assert.deepEqual(S.unit.reportOrder.slice().sort(), keys.filter((k) => !S.unit.reportSkip.includes(k)).sort(), `${S.id} 칸 순서는 양식의 칸을 모두 한 번씩`);
    const tb = reportCfg(S.id, S.level, 'nature').table; assert.ok(tb.columns.length >= 2 && tb.rows.length >= 3, `${S.id} 표`);
    assert.ok(S.steps.length >= 5 && S.lead.length > 30);
  }
});

test('새 세트(잎 재기·강낭콩·곰팡이): 잰 값이 그림과 맞고, 비율로만 갈리며, 날이 갈수록 줄지 않는다', async () => {
  const lk = await import('./scenes/specimens-leafkey.js'), gr = await import('./scenes/specimens-grow.js'), md = await import('./scenes/specimens-mold.js');
  const specs = lk.SPECIMENS.map((f) => f()), range = (sp, k) => { const v = sp.leaves.map((l) => l[k]); return [Math.min(...v), Math.max(...v)]; };
  const [c, z] = [specs[2], specs[3]];
  assert.ok(range(c, 'L')[0] < range(z, 'L')[1], '③·④ 길이는 겹친다(길이 하나로는 못 나눈다)');
  assert.ok(range(c, 'r')[1] < 2.0 && range(z, 'r')[0] > 2.0, '③·④ 길이÷폭은 2.0을 사이에 두고 갈린다');
  assert.ok(range(specs[0], 'r')[1] < 2.2 && range(specs[1], 'r')[0] > 2.2, '①·② 작은잎 길이÷폭은 2.2를 사이에 두고 갈린다');
  assert.ok(range(specs[0], 'count')[1] >= range(specs[1], 'count')[0], '①·② 작은잎 수는 겹친다');
  for (const s of gr._specs) for (const k of ['H', 'leaves', 'stem']) assert.ok(s[k].every((v, i) => !i || v >= s[k][i - 1]), `${s.id} ${k}는 줄지 않는다`);
  const H = (id) => gr._specs.find((s) => s.id === id).H.at(-1); assert.ok(H('bean-shade') > H('bean-sun') && H('bean-sun') > H('bean-dry'), '그늘이 가장 크게 웃자라고 물 적은 화분이 가장 작다');
  for (const f of md.SPECIMENS) { const s = f(), v = md.DAYS.map((d) => md.coverage(s, d).pct); assert.ok(v.every((x, i) => !i || x >= v[i - 1]) && v[0] === 0 && v.at(-1) > 50 && v.at(-1) <= 100, `${s.id} 덮은 넓이 ${v}`); }
  const { SAMPLES: X } = await import('./data/observe-samples.js'); assert.deepEqual(X['observe-mold'].table.map((r) => r.slice(1).map(Number)), md.SPECIMENS.map((f) => md.DAYS.map((d) => md.coverage(f(), d).pct)), '곰팡이 예시 표 = 그림에서 센 값');
  assert.deepEqual(X['observe-grow'].table.map((r) => r.slice(1).map(Number)), gr._specs.map((s) => s.H.slice(1)), '강낭콩 예시 표 = 표본의 키');
});

test('예시 보고서: 세트마다 있고, 관찰그림 수 = 표본 수, 그림은 그릴 수 있는 선 조각이 충분하며 NaN이 없다, 분류 나무가 끝까지 나뉜다', () => {
  const leaves = (n) => (n.yes ? [...leaves(n.yes), ...leaves(n.no)] : [n.items]);
  for (const S of OBSERVE_SETS) {
    const X = SAMPLES[S.id]; assert.ok(X, S.id); assert.equal(X.obs.length, S.mod.SPECIMENS.length, `${S.id} 관찰그림 수`);
    for (const o of X.obs) { const svg = o.draw(); assert.ok(svg.startsWith('<svg') && svg.includes('</svg>'), o.label); assert.ok(!/NaN|undefined/.test(svg), `${S.id} ${o.label} 좌표`); assert.ok((svg.match(/class="dz"/g) || []).length >= 8, `${S.id} ${o.label} 선 조각`); assert.ok((svg.match(/class="dz-t"/g) || []).length >= 3, `${S.id} ${o.label} 이름표`); assert.ok(/\[본 것\]|\[관찰한 사실\]/.test(o.text) && /추정/.test(o.text), `${S.id} ${o.label} 글: 사실과 추정`); }
    const skip = S.unit.reportSkip;
    if (!skip.includes('classify')) { assert.ok(X.tree && X.classify, `${S.id} 분류 나무`); const lv = leaves(X.tree); assert.ok(lv.every((l) => l.length === 1), `${S.id} 분류 나무 끝까지`); assert.deepEqual(lv.flat().sort(), X.tree.items.slice().sort(), `${S.id} 분류 나무 대상`); }
    if (!skip.includes('adapt')) assert.ok(X.adapt, `${S.id} 유리한 점`); if (!skip.includes('env') && S.level === 'elem') assert.ok(X.env, `${S.id} 비교 칸`);
    for (const e of X.extra || []) { assert.ok(e.title && e.text, `${S.id} 추가 칸`); if (e.draw) assert.ok(!/NaN|undefined/.test(e.draw()), `${S.id} ${e.title} 그림`); }
    for (const r of X.table) assert.equal(r.length, reportCfg(S.id, S.level, 'nature').table.columns.length, `${S.id} 예시 표 칸 수`);
    for (const k of ['a', 'both', 'b', 'la', 'lb']) assert.ok(X.venn[k], `${S.id} 벤 ${k}`);
    assert.ok(X.target && X.next && X.table.length >= 3 && X.who.name, S.id);
    if (S.id === 'observe-insects') { assert.ok(X.env.includes('방법'), '두 장소 비교에 확인 방법'); assert.ok(X.adaptDraw().includes('<svg')); }
  }
});

test('한 줄 코드 뒤에 // 주석을 붙여 줄 나머지가 주석이 된 곳이 없다(세 번 겪은 사고)', () => {
  const dir = path.dirname(fileURLToPath(import.meta.url));
  const files = ['observe.js', 'observe-sample.js', 'report.js', 'sketch.js', 'app.js', ...fs.readdirSync(path.join(dir, 'scenes')).filter((f) => /^(_|specimens-)/.test(f)).map((f) => 'scenes/' + f), ...fs.readdirSync(path.join(dir, 'data')).filter((f) => /^(observe|pencil|reports|invent|curriculum)/.test(f)).map((f) => 'data/' + f)];
  const bad = [];
  // 네 번째 사고(곰팡이 색이 검게): 주석 뒤에 `col[i * 3] = …`가 있었는데 옛 꼴은 이걸 못 잡았다
  for (const f of files) fs.readFileSync(path.join(dir, f), 'utf8').split('\n').forEach((line, i) => { const k = line.indexOf('// '); if (k < 0 || /https?:\/\//.test(line)) return; const tail = line.slice(k + 3); if ((/[;{}]\s*(const|let|var|if|else|for|return|[A-Za-z_$][\w$]*\s*[(.=])/.test(tail) || /[)\s][A-Za-z_$][\w$]*(\[[^\]]*\])+\s*=[^=]/.test(tail) || /;\s*[A-Za-z_$]/.test(tail)) && !/^\s*\/\//.test(line)) bad.push(`${f}:${i + 1}`); });
  assert.deepEqual(bad, []);
});

test('대회 폴더: 대회마다 안내가 있고, 연습 세트 고리가 실제 세트를 가리키며, 「확인 못 함」을 지어내지 않게 근거가 붙어 있다', async () => {
  const { CONTESTS } = await import('./data/curriculum.js');
  const { CONTEST_GUIDE: G } = await import('./data/contests.js');
  const ids = new Set(OBSERVE_SETS.map((s) => s.id));
  for (const c of CONTESTS) {
    const g = G[c.id]; assert.ok(g, c.id);
    for (const k of ['icon', 'color', 'lead']) assert.ok(g[k], `${c.id} ${k}`);
    for (const k of ['names', 'facts', 'day', 'cautions', 'train', 'src']) assert.ok(Array.isArray(g[k]) && g[k].length, `${c.id} ${k}`);
    assert.ok(g.judge.src && g.judge.rows.length >= 3 && g.judge.rows.every((r) => r.length === 3), `${c.id} 심사`);
    for (const [, set] of g.tasks?.rows || []) if (set) assert.ok(ids.has(set), `${c.id} 과제 → ${set}`);
    assert.ok(g.cautions.some((t) => /요강/.test(t)), `${c.id} 그해 요강 확인 안내`);
  }
});
