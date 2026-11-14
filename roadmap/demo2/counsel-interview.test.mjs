import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const ctx = vm.createContext({ window: {}, URL });
for (const file of ['planner-highschool-data.js', 'planner-highschool-profiles.js', 'counsel-interview.js']) {
  vm.runInContext(fs.readFileSync(new URL(file, import.meta.url), 'utf8'), ctx, { filename: file });
}
const { buildCards, render } = ctx.window.RoadmapCounselInterview;
const ids = cards => Array.from(cards, row => row.school.id);

test('explicit schools take priority and preserve the order of a comparison', () => {
  assert.deepEqual(ids(buildCards('민족사관고하고 외대부, 상산고 면접은?', { schoolName: '하나고' })),
    ['minjok', 'hafs', 'sangsan']);
  assert.deepEqual(ids(buildCards('기출 어떻게 연습하죠?', { schoolName: 'sshs' })), ['sshs']);
  for (const q of ['서울대 면접 기출', '의대 면접', '현대청운고 면접', '모평 일정',
    '고1 6월 기출', '모평 기출', '수능 기출', '단원평가 기출', '상산고 고2 9월 모의고사 기출', 'KMO 기출']) {
    assert.deepEqual(ids(buildCards(q, { schoolName: 'sshs' })), []);
  }
});

test('a single school in current progress grounds an interview question, without silently picking between schools', () => {
  assert.deepEqual(ids(buildCards('면접 기출 하나 보여줘', { progress: '중3. 용인외고를 준비해요.', schoolName: 'sshs' })), ['hafs']);
  assert.deepEqual(ids(buildCards('면접은?', { progress: '상산고 또는 하나고 고민 중' })), []);
  assert.deepEqual(ids(buildCards('6월 모평 기출?', { progress: '상산고를 준비해요.' })), []);
  assert.deepEqual(ids(buildCards('경기과고 면접 기출', { progress: '상산고를 준비해요.' })), ['gs']);
});

test('uses published guides, preserves year and stage, and separates practice from original papers', () => {
  assert.match(buildCards('경기과고 2026학년도 기출')[0].paper.stage, /2단계/);
  assert.equal(buildCards('경기과고 2022년 기출')[0].paper, undefined);
  assert.equal(buildCards('외대부고 2026학년도 면접')[0].notice.kind, '공식 면접 안내');
  for (const name of ['민사고', '하나고', '상산고', '외대부고']) {
    const row = buildCards(name + ' 면접')[0];
    assert.equal(row.paper, undefined);
    assert.ok(row.practice && row.guide.url.startsWith('https://'));
  }
});

test('school reports add only their approved text and exact source, including older admission years', () => {
  const source = '학교 게시물 https://admission.hafs.hs.kr/?id=50&act=board.read&code=1415&page=3';
  const approved = { body: '관리자가 승인한 상담 본문', source };
  assert.equal(buildCards('외대부고 면접')[0].report, undefined);
  assert.equal(buildCards('외대부고 면접', { sources: [approved] })[0].report.body, approved.body);
  assert.equal(buildCards('외대부고 2027년 면접', { sources: [approved] })[0].report, null);
  assert.equal(buildCards('외대부고 면접', { sources: [{ ...approved, source: source.replace('id=50', 'id=501') }] })[0].report, undefined);
});

test('actual result cards include the school question number, source links and a separate practice heading', () => {
  const doc = { createElement(tag) { return { tag, children: [], append(...items) { this.children.push(...items); } }; } };
  const container = doc.createElement('section');
  container.ownerDocument = doc;
  assert.equal(render(container, '경기과학고 2026년 면접 기출'), 1);
  const all = n => [n, ...n.children.flatMap(all)];
  const nodes = all(container);
  assert.ok(nodes.some(n => n.textContent?.includes('수학 2번')));
  assert.ok(nodes.some(n => n.tag === 'h5' && /연습/.test(n.textContent)));
  assert.ok(nodes.filter(n => n.tag === 'a').every(n => n.href.startsWith('https://') && n.rel.includes('noopener')));
});
