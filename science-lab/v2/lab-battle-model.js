// 기존 가상 실험의 기록만 비교한다. 실제 교구 판정과 학생 성적은 별도로 다룬다.
const order = () => ['1팀의 결정이 더 큼', '결정의 크기가 같음', '2팀의 결정이 더 큼'];
const freeze = (title, field, targets) => ({ title, question: `두 팀의 ${field === 'mass' ? '무게' : '높이'}는 어떻게 될까요?`, choices: field === 'mass' ? ['1팀이 더 무거움', '무게가 같음', '2팀이 더 무거움'] : ['1팀이 더 높음', '높이가 같음', '2팀이 더 높음'], field, targets });
const hill = (title, targets) => ({ title, question: '어느 팀에서 흙이 더 많이 깎일까요?', choices: ['1팀에서 더 많이 깎임', '깎인 흙의 양이 같음', '2팀에서 더 많이 깎임'], field: 'cut', targets });
const volcano = (title, field, targets) => ({ title, question: field === 'crystal' ? '어느 팀의 백반 결정이 더 클까요?' : '어느 팀에서 연기가 더 많이 날까요?', choices: field === 'crystal' ? order() : ['1팀에서 더 많이 남', '연기의 양이 같음', '2팀에서 더 많이 남'], field, targets });
const pond = (title, targets) => ({ title, question: '우리 팀의 식물을 이 장소에 심으면 살기에 알맞을까요?', choices: ['살기에 알맞음', '살기에 알맞지 않음'], field: 'habitat', targets });

export const LAB_BATTLE_ROUNDS = {
  's41-u02': [
    freeze('물과 얼음, 무게 줄세우기', 'mass', [{ ml: 100, state: '물' }, { ml: 100, state: '얼음' }]),
    freeze('물의 양을 바꾸어 비교하기', 'mass', [{ ml: 60, state: '얼음' }, { ml: 140, state: '얼음' }]),
    freeze('같은 물의 양, 높이 비교하기', 'height', [{ ml: 140, state: '얼음' }, { ml: 140, state: '물' }]),
  ],
  's41-u03': [
    hill('경사만 바꾸어 보기', [{ slope: '완만', water: '많이' }, { slope: '가파름', water: '많이' }]),
    hill('물의 양만 바꾸어 보기', [{ slope: '완만', water: '많이' }, { slope: '완만', water: '적게' }]),
    hill('가파른 언덕에서 물의 양 비교하기', [{ slope: '가파름', water: '적게' }, { slope: '가파름', water: '많이' }]),
  ],
  's41-u03b': [
    volcano('백반 물을 식히는 방법 비교하기', 'crystal', [{ exp: '식히기', cond: '얼음물(빨리)' }, { exp: '식히기', cond: '상자(천천히)' }]),
    volcano('가상 화산의 가열 조건 비교하기', 'smoke', [{ exp: '화산 모형', cond: '불 강하게' }, { exp: '화산 모형', cond: '불 약하게' }]),
    volcano('역할을 바꾸어 결정 비교하기', 'crystal', [{ exp: '식히기', cond: '상자(천천히)' }, { exp: '식히기', cond: '얼음물(빨리)' }]),
  ],
  's42-u01': [
    pond('부레옥잠을 심을 곳 찾기', [{ plant: '부레옥잠', where: '땅' }, { plant: '부레옥잠', where: '깊은 물' }]),
    pond('물속 식물의 자리 찾기', [{ plant: '수련', where: '깊은 물' }, { plant: '검정말', where: '땅' }]),
    pond('부들이 살기 좋은 곳 찾기', [{ plant: '부들', where: '물가' }, { plant: '부들', where: '깊은 물' }]),
  ],
};

const finite = (value) => typeof value === 'number' && Number.isFinite(value) && value >= 0;
export function validBattleRow(unit, row) {
  if (!row || typeof row !== 'object') return false;
  if (unit === 's41-u02') return ['물', '얼음'].includes(row.state) && [60, 100, 140].includes(row.ml) && finite(row.height) && finite(row.mass);
  if (unit === 's41-u03') return ['완만', '가파름'].includes(row.slope) && ['적게', '많이'].includes(row.water) && finite(row.cut) && finite(row.pile);
  if (unit === 's41-u03b') return (row.exp === '식히기' && ['얼음물(빨리)', '상자(천천히)'].includes(row.cond) && /^(작은|큰) 결정 \d+개$/.test(row.result))
    || (row.exp === '화산 모형' && ['불 강하게', '불 약하게'].includes(row.cond) && /^연기 (많이|조금), 흘러나온 양 \d+칸, 식으니 굳음$/.test(row.result));
  if (unit === 's42-u01') return ['부레옥잠', '수련', '검정말', '부들'].includes(row.plant) && ['땅', '물가', '깊은 물'].includes(row.where) && typeof row.ok === 'boolean' && typeof row.result === 'string' && !!row.result;
  return false;
}

export function matchesBattleTarget(unit, row, target) {
  return validBattleRow(unit, row) && Object.entries(target).every(([key, value]) => row[key] === value);
}
export function battleTargetText(unit, target) {
  if (unit === 's41-u02') return `${target.ml} mL · ${target.state}`;
  if (unit === 's41-u03') return `경사 ${target.slope} · 물 ${target.water}`;
  if (unit === 's41-u03b') return `${target.exp === '식히기' ? '백반 식히기' : '가상 화산'} · ${target.cond}`;
  return `${target.plant} · ${target.where}`;
}
export function battleRowText(unit, row) {
  if (unit === 's41-u02') return `${row.ml} mL ${row.state} · ${row.mass} g · 높이 ${row.height}칸`;
  if (unit === 's41-u03') return `${row.slope} · 물 ${row.water} · 깎임 ${row.cut}칸 · 쌓임 ${row.pile}칸`;
  if (unit === 's41-u03b') return `${row.cond} · ${row.result}`;
  return `${row.plant} · ${row.where} · ${row.result}`;
}
function score(round, row) {
  if (round.field === 'crystal') return row.result.startsWith('큰') ? 1 : 0;
  if (round.field === 'smoke') return row.result.startsWith('연기 많이') ? 1 : 0;
  return row[round.field];
}
export function battleVerdict(unit, round, rows, predictions) {
  if (!Array.isArray(rows) || rows.length !== 2 || !Array.isArray(predictions) || predictions.length !== 2
      || rows.some((row, i) => !matchesBattleTarget(unit, row, round.targets[i]))
      || predictions.some(value => !Number.isInteger(value) || value < 0 || value >= round.choices.length)) return null;
  const answers = round.field === 'habitat' ? rows.map(row => row.ok ? 0 : 1) : (() => {
    const [a, b] = rows.map(row => score(round, row));
    const answer = Math.abs(a - b) < 1e-6 ? 1 : a > b ? 0 : 2;
    return [answer, answer];
  })();
  return { answers, ok: predictions.map((value, i) => value === answers[i]) };
}
