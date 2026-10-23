// node --test science-lab/report-model.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { TEMPLATES, FORMS, formTemplate, prefill, chartData, withMean, locate, segments, emptyReport, validReport, textKeys, obsKey, treeNode, splitTree, syncTree, treeAt, treeLeaves, treeIssues, unsplitTree, tableTouched } from './report-model.js';
import { reportCfg, REPORTS, primaryContest } from './data/reports.js';
import { UNITS, LEVEL_OF, LEVELS, CONTESTS, CONTEST_OF, contestsOf } from './data/curriculum.js';
import { TECHNIQUES, SCENES, WORKS } from './data/invent-gallery.js';

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
  const n = reportCfg('seed', 'elem', 'nature'); assert.equal(n.contest, 'nature'); assert.deepEqual(n.table.columns.slice(0, 2), ['번호', '이름(모르면 생김새)'], '기본 대회가 아니면 그 대회 기본 표');
  assert.equal(reportCfg('seed', 'elem', 'inquiry').table.rows[0], '4℃');
});
test('미리 채우기: 자연관찰 연습은 대상 4개 이름표, 발명은 불편함 칸', () => {
  const ob = { id: 'observe-water', title: 'x', activity: { materials: ['자'], steps: ['본다'] } };
  const p = prefill(ob, reportCfg('observe-water', 'mid', 'nature'), 'mid', 'nature');
  assert.equal(p.__obs, 4); assert.equal(p['sheet.0.label'], '①'); assert.match(p.target, /연못/);
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
