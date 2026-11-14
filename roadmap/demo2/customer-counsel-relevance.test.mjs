import test from 'node:test';
import assert from 'node:assert/strict';
import {selectKnowledge, answerFromSources} from '../supabase/roadmap-counsel/search.mjs';

const approved = (id, title, body, stage = 'all') => ({id, title, body, stage, status: 'approved'});
const notes = [
 approved('academy','천개의고원은 어떤 점을 보고 선택하면 좋을까요?',
  '요약\n읽기·쓰기와 여러 국어 영역을 함께 공부합니다.\n\n학부모님들의 의견\n과제 부담이 비교적 적어 수학과 병행하기 좋았다는 의견도 있습니다.\n\n선택 전 확인\n현재 학년의 글쓰기 피드백 방식과 주당 과제를 직접 확인해 주세요.', 'elementary'),
 approved('reading','기파랑은 문풀이나 글쓰기 중 무엇을 보완할 때 비교하나요?',
  '비문학 지문을 이해하지 못하는지, 이해했지만 선택지를 판단하기 어려운지 먼저 구분합니다.', 'elementary'),
 approved('math','수학 숙제와 심화 문제를 어떻게 병행하나요?', '수학과 심화 교재의 과제량을 살펴보세요.'),
 approved('mock','중학생은 고1·고2 기출을 언제 풀면 좋을까요?',
  '요약\n기출은 학생 수준에 맞춰 풀 수 있습니다.\n\n상담 안내\n아직 배우지 않은 문항은 배운 범위 수행률 계산에서 제외합니다.', 'middle'),
 approved('ox','초등 단원 테스트는 O/X로 무엇을 확인하나요?',
  '요약\n문항별 O/X로 기록합니다. 혼자 맞힌 문항은 O, 틀렸거나 도움을 받아 해결한 문항은 X로 구분합니다.', 'elementary'),
 approved('help','심화에서 힌트를 주는 방법', '혼자 시작하기 어렵다면 힌트를 주세요.'),
 approved('books','고등수학은 기본 정석만 끝내고 다음 진도로 가나요?',
  '기본 정석으로 개념을 배우고 쎈을 함께 공부한 뒤, 다음 선행과 배운 범위의 심화를 이어갑니다.'),
 approved('algebra','경시 대수는 어떤 내용을 점검하나요?', '대수에서 식과 방정식을 공부합니다.'),
 approved('prep','공통수학 쎈을 더 복습할까요, 대수로 갈까요?', '쎈의 오답을 다시 봅니다.'),
 approved('school','외대부고·민사고·상산고·하나고는 어떻게 비교하나요?',
  '각 학교의 공식 면접 안내와 공개 기출을 살펴봅니다.', 'middle'),
 approved('general','초등 면접을 준비하는 방법', '문제 풀이와 면접 연습을 함께 합니다.', 'elementary')
];
const query = (question, options = {}, sources = notes) => {
 const context = {question, ...options};
 const rows = selectKnowledge(sources, context);
 return {ids: rows.map(row => row.id), ...answerFromSources(rows, context)};
};

test('천고의 숙제 부담을 묻는 질문은 천개의고원 수강 경험에서 직접 답한다', () => {
 const result = query('천고는 숙제가 많아요? 수학이랑 같이 할 만한가요?', {stage:'elementary', progress:'수학 심화 문제'});
 assert.deepEqual(result.ids, ['academy']);
 assert.match(result.summary, /과제 부담.*병행.*의견/);
 assert.doesNotMatch(result.summary, /요약|상담 안내/u);
 assert.deepEqual(query('천개의 고원은요?').ids, ['academy']);
 assert.deepEqual(query('천고마비').ids, []);
});

test('계속 수강할지 묻고 선지 판단을 언급한 경우에만 비문학 보완 자료가 함께 나온다', () => {
 const result = query('초5인데 천고 계속 다닐까요? 글쓰기는 좋아하고 비문학 선지가 약해요.');
 assert.deepEqual(result.ids, ['academy', 'reading']);
 assert.match(result.explanation, /비문학.*선택지/);
});

test('모평 미학습 문항과 힌트로 맞힌 문항은 각각 승인된 채점 근거 한 건으로 답한다', () => {
 const missed = query('고1 6월 거 풀다가 틀렸는데 그 단원은 아직 안 배웠어요. 이것도 X예요?', {stage:'middle'});
 assert.deepEqual(missed.ids, ['mock']);
 assert.match(missed.summary, /배우지 않은.*수행률.*제외/);
 const helped = query('지난주에 푼 문제, 엄마가 힌트를 줘서 맞았는데 동그라미 쳐도 돼요?', {stage:'elementary'});
 assert.deepEqual(helped.ids, ['ox']);
 assert.match(helped.summary, /도움을 받아.*X/);
 const learned = query('이미 배운 단원인데 혼자 못 풀었어요. X로 표시할까요?', {stage:'elementary'});
 assert.deepEqual(learned.ids, ['ox']);
 assert.match(learned.summary, /틀렸거나.*X/);
});

test('정석과 쎈 다음에 대수를 배울지 묻는 질문은 두 교재를 다루는 과정에 연결한다', () => {
 const result = query('정석이랑 쎈 한 바퀴 했는데 이제 대수 가도 돼요?');
 assert.deepEqual(result.ids, ['books']);
 assert.match(result.summary, /정석.*쎈.*다음 선행/);
});

test('학교의 정식명칭과 약칭을 같은 학교로 매칭하고 요청하지 않은 면접 정보를 섞지 않는다', () => {
 for (const question of ['상산고랑 외대부고 면접 문제 실제로 하나 볼 수 있을까요?', '민족사관고등학교와 상산고등학교는요?']) {
  assert.deepEqual(query(question, {stage:'middle'}).ids, ['school']);
 }
 assert.deepEqual(query('상산고랑 외대부고 면접', {stage:'elementary'}).ids, []);
});

test('재점검 때 선택한 지난 상담을 활용하고 일반 질문에 이전 상담을 끌어오지 않는다', () => {
 const sources = [approved('function','함수 그래프 복습', '다시 풀 때는 함수 그래프의 축을 확인합니다.'),
  approved('triangle','삼각형 기하 복습', '각도를 확인합니다.')];
 const previous = '함수 그래프 복습';
 assert.deepEqual(query('지난 상담 이어서 재점검 해주세요', {previous}, sources).ids, ['function']);
 assert.deepEqual(query('삼각형 기하 복습', {previous}, sources).ids, ['triangle']);
 assert.deepEqual(query('축구 취미', {previous,progress:'함수 그래프 복습'}, sources).ids, []);
});

test('채점 기준을 직접 담은 자료가 승인 취소되거나 학년이 맞지 않으면 임의로 규칙을 답하지 않는다', () => {
 const question = '엄마가 힌트 줘서 맞혔는데 동그라미 쳐도 돼요?';
 const snapshot = notes.map(row => row.id === 'ox' ? {...row, status:'pending'} : row);
 assert.deepEqual(query(question, {}, snapshot).ids, []);
 assert.deepEqual(query(question, {stage:'middle'}).ids, []);
 assert.deepEqual(query(question, {}, notes).ids, ['ox']);
});

test('학교·경시·학평 기출은 서로 대체하지 않고 새로 승인된 해당 학교 기출을 바로 좁혀 찾는다', () => {
 const q = '경기과고 2026학년도 기출을 보여줘요';
 assert.deepEqual(query(q, {stage:'middle'}).ids, []);
 assert.deepEqual(query('올해 KMO 경시 기출을 풀고 싶어요', {stage:'middle'}).ids, []);
 const addition = approved('gsa','경기과학고 입학전형 면접 기출','공개된 면접 문항입니다.', 'middle');
 const competition = approved('kmo','KMO 1차 기출','경시 기출 문제를 풀어봅니다.');
 assert.deepEqual(query(q, {stage:'middle'}, [...notes, addition, competition]).ids, ['gsa']);
 assert.deepEqual(query('KMO 1차 기출', {stage:'middle'}, [...notes, addition, competition]).ids, ['kmo']);
});

test('중학생은 전 학년 승인된 독립 해결 정의를 보되 초등 전용 O/X 표기를 일반화하지 않는다', () => {
 const principles = approved('principle','공부한 분량과 혼자 풀 수 있는 분량',
  '공부한 분량을 기록합니다. “혼자 풀 수 있어요”는 도움 없이 해결하는 수준을 뜻합니다.');
 const result = query('엄마가 힌트를 줘서 맞았는데 동그라미 쳐도 돼요?', {stage:'middle'}, [...notes, principles]);
 assert.deepEqual(result.ids, ['principle']);
 assert.match(result.summary, /도움 없이/);
 assert.doesNotMatch(result.summary, /O\/X|X로/);
});

test('교재 단원 복습 질문에 교과서를 언급만 한 학교 선택 자료를 함께 싣지 않는다', () => {
 const school = approved('curriculum','학교 이름보다 교육과정표를 먼저 펼쳐보세요.',
  '고교를 선택할 때 쎈 공통수학1 이후의 과목을 확인합니다.', 'middle');
 const result = query('중1인데 쎈 공통수학1 이차방정식에서 힌트를 자꾸 봐요. 이번 주 어떻게 복습할까요?', {stage:'middle'}, [...notes, school]);
 assert.ok(result.ids.includes('books') || result.ids.includes('prep'));
 assert.ok(!result.ids.includes('curriculum'));
});

test('두 학교 면접을 함께 물으면 학교별 승인 기출·사례가 종합 비교보다 먼저 나온다', () => {
 const hafs = approved('hafs-report','외대부고 2026학년도 입학전형 영향평가 보고서',
  '학교에서 공개한 면접 응시자 사례입니다.', 'middle');
 const hana = approved('hana-report','하나고 2026학년도 면접 응시 사례',
  '공식 보고서의 면접 사례입니다.', 'middle');
 const schools = [...notes, hafs, hana];
 assert.deepEqual(query('외대부고랑 상산고 면접 하나 보여주세요', {stage:'middle'}, schools).ids, ['hafs-report','school']);
 assert.deepEqual(query('하나고랑 외대부고 면접 기출', {stage:'middle'}, schools).ids, ['hana-report','hafs-report']);
 assert.deepEqual(query('상산고랑 외대부고 면접', {stage:'middle'}, [...notes, {...hafs, status:'pending'}]).ids, ['school']);
 assert.deepEqual(query('외대부고와 하나고 2027학년도 기출', {stage:'middle'}, schools).ids, ['school']);
});
