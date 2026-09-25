/* ============================================================
   Numbers of Magic — MD89·MD90 중등 적용(활용) 생성기 (2026-09-25)
   근거: 원장 "교과 연산과 창의 연산 문장제가 적절히 연결" · GPT 인수인계서 §3 B
   ("중등은 억지스러운 이야기보다 교과 적용 문제를 우선"). 회차 세 층 검사
   (scripts/check-session-roles.js)가 과정 29(정수의 세계)·35(제곱근의 세계)에
   적용 문제가 한 회차도 없다고 잡았다. 두 과정의 교과 연산을 그대로 쓰는 적용만 만든다.

   MD89 정수의 활용 — 부호가 있는 양이 실제로 쓰이는 자리. 덧셈·뺄셈만(과정 29 범위,
        곱셈 MD4 는 과정 30 에서 연다).
        temp(기온) · altitude(해발·해저) · level(기준보다 높고 낮은 수위, 여러 번 오르내림)
   MD90 제곱근의 활용 — 정사각형의 넓이와 한 변. 근호를 정리하고(MD16) 같은 근호끼리
        더하고 뺀다(MD83). 도형의 성질을 추론하는 기하는 넣지 않는다 — 넓이 공식 하나만.
        side(넓이 → 한 변) · joined(두 정사각형을 이어 붙인 가로) · diff(한 변의 차)

   계약: NM_TGEN[gen](params, rng), Math.random 금지. 답은 정수 몇 개.
   답을 먼저 고르고 이야기의 수를 역산한다. 음수는 괄호로(par). 풀이 마지막 줄 빈칸 = 답 전체.
   말투: 중등은 합니다체.
   ============================================================ */
(function(){
'use strict';
const NM_TGEN = window.NM_TGEN = window.NM_TGEN || {};
const { R, pick } = NM_RNG;
function L3(ko, en, zh){ return { ko, en, zh }; }
function par(n){ return n < 0 ? `(${n})` : String(n); }
function signed(n){ return n < 0 ? `-${Math.abs(n)}` : `+${n}`; }
function hasNeg(v){ return Array.isArray(v) ? v.some(x => x < 0) : v < 0; }
function wordItem(story, ask, unit, answer, solution, tex){
  const prompt = {};
  ['ko','en','zh'].forEach(l => { prompt[l] = story[l] + (l === 'zh' ? '' : ' ') + ask[l]; });
  const p = { prompt, word: story, wordAsk: ask, wordUnit: unit,
    answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer), solution: solution || [] };
  if(tex) p.tex = tex;
  return p;
}

/* ── MD89 — 정수의 활용 ── */
NM_TGEN['md89_intApply'] = function (params, rng) {
  const mode = params.mode || 'temp';
  const C = L3('℃', '°C', '℃');

  if (mode === 'altitude') {
    const kind = pick(rng, ['gap', 'rise']);
    if (kind === 'gap') {
      const h = R(rng, 4, 30) * 10, d = R(rng, 2, 15) * 10;   /* 해발 h, 해저 -d */
      const ans = h - (-d);
      return wordItem(
        L3(`해수면을 0m로 하면 등대 꼭대기는 해발 ${h}m이고, 잠수부는 해저 ${d}m, 곧 ${-d}m에 있습니다.`,
           `Taking sea level as 0 m, the top of a lighthouse is ${h} m above sea level and a diver is ${d} m below, that is, at ${-d} m.`,
           `以海平面为0m，灯塔顶在海拔${h}m，潜水员在海面下${d}m，即${-d}m处。`),
        L3('두 곳의 높이 차는 몇 m입니까?', 'How many metres apart are they in height?', '两处的高度差是多少m？'),
        L3('m', 'm', 'm'), ans,
        [{ tex:`${h}-${par(-d)}` }, { tex:`=${h}+${d}=\\square`, blank:ans }]);
    }
    const d = R(rng, 3, 20) * 5, u = R(rng, 1, 30) * 5;        /* -d 에서 u 만큼 올라온다 */
    const ans = -d + u;
    return wordItem(
      L3(`해저 ${d}m, 곧 ${-d}m에 있던 잠수정이 ${u}m 올라왔습니다.`,
         `A submersible at ${d} m below sea level, that is ${-d} m, rose ${u} m.`,
         `一艘潜水器原在海面下${d}m，即${-d}m处，上升了${u}m。`),
      L3('잠수정의 위치는 몇 m입니까? (해수면 0m, 아래는 음수)', 'Where is it now, in metres? (sea level 0 m, below is negative)', '潜水器现在的位置是多少m？(海平面0m，以下为负数)'),
      L3('m', 'm', 'm'), ans,
      [{ tex:`${par(-d)}+${u}=\\square`, blank:ans }]);
  }

  if (mode === 'level') {
    /* 기준 수위보다 몇 cm — 세 번의 변화. 과정 29 의 덧셈·뺄셈만. */
    const start = -R(rng, 2, 12);
    const rain = R(rng, 5, 25), out = R(rng, 3, 20), rain2 = R(rng, 2, 12);
    const ans = start + rain - out + rain2;
    return wordItem(
      L3(`저수지의 수위가 기준보다 ${-start}cm 낮은, 곧 ${start}cm였습니다. 비가 와서 ${rain}cm 올라갔고, 물을 내보내 ${out}cm 내려갔다가, 다시 비가 와서 ${rain2}cm 올라갔습니다.`,
         `A reservoir was ${-start} cm below its reference level, that is ${start} cm. Rain raised it ${rain} cm, releasing water lowered it ${out} cm, and more rain raised it ${rain2} cm.`,
         `水库水位比基准低${-start}cm，即${start}cm。下雨上升了${rain}cm，放水下降了${out}cm，又下雨上升了${rain2}cm。`),
      L3('지금 수위는 기준보다 몇 cm입니까? (낮으면 음수)', 'How many cm from the reference level is it now? (below is negative)', '现在水位比基准高多少cm？(低于基准为负数)'),
      L3('cm', 'cm', 'cm'), ans,
      [{ tex:`${par(start)}+${rain}-${out}+${rain2}` },
       { tex:`=${start + rain}-${out}+${rain2}=${start + rain - out}+${rain2}=\\square`, blank:ans }]);
  }

  /* temp(기본) — 기온 */
  const kind = pick(rng, ['gap', 'rise', 'fall']);
  if (kind === 'gap') {
    const lo = -R(rng, 2, 15), hi = R(rng, 1, 18);
    const ans = hi - lo;
    return wordItem(
      L3(`어느 날 새벽 기온은 ${lo}℃이고, 낮 기온은 ${hi}℃였습니다.`,
         `One day the dawn temperature was ${lo}°C and the daytime temperature was ${hi}°C.`,
         `某天凌晨气温是${lo}℃，白天气温是${hi}℃。`),
      L3('낮 기온은 새벽보다 몇 ℃ 높습니까?', 'How many degrees warmer was the day than the dawn?', '白天比凌晨高多少℃？'),
      C, ans,
      [{ tex:`${hi}-${par(lo)}` }, { tex:`=${hi}+${-lo}=\\square`, blank:ans }]);
  }
  if (kind === 'rise') {
    const t = -R(rng, 3, 15), r = R(rng, 2, 20);
    const ans = t + r;
    return wordItem(
      L3(`아침 기온이 ${t}℃였는데, 한낮까지 ${r}℃ 올랐습니다.`,
         `The morning temperature was ${t}°C, and it rose ${r}°C by midday.`,
         `早上气温是${t}℃，到中午升高了${r}℃。`),
      L3('한낮 기온은 몇 ℃입니까?', 'What was the midday temperature?', '中午气温是多少℃？'),
      C, ans,
      [{ tex:`${par(t)}+${r}=\\square`, blank:ans }]);
  }
  const t = R(rng, 1, 10), f = R(rng, t + 2, t + 15);
  const ans = t - f;
  return wordItem(
    L3(`저녁 기온이 ${t}℃였는데, 밤사이 ${f}℃ 내려갔습니다.`,
       `The evening temperature was ${t}°C, and it fell ${f}°C overnight.`,
       `傍晚气温是${t}℃，夜里下降了${f}℃。`),
    L3('새벽 기온은 몇 ℃입니까?', 'What was the dawn temperature?', '凌晨气温是多少℃？'),
    C, ans,
    [{ tex:`${t}-${f}=\\square`, blank:ans }]);
};

/* ── MD90 — 제곱근의 활용(정사각형의 넓이와 한 변) ──
   넓이는 k²·s(s 는 제곱인수가 없는 수)로 만들어 한 변이 k√s 로 정리되게 한다. 계수는 늘 2 이상 —
   답칸에 1√3 같은 표기가 나오지 않게 한다. */
const SQFREE = [2, 3, 5, 6, 7, 10];
/* 답 [계수, 근호 안] 을 정답지·예시에 k√s cm 로 찍는다 — 없으면 "8, 6cm" 로 나갔다 */
function radicalAnswer(p){ p.answerShape = 'coeffRadical'; p.wordAnswerTex = `${p.answer[0]}\\sqrt{${p.answer[1]}}`; return p; }
NM_TGEN['md90_rootApply'] = function (params, rng) {
  const mode = params.mode || 'side';
  const CM = L3('cm', 'cm', 'cm');
  const s = pick(rng, SQFREE);
  const fmt = (k) => `${k}\\sqrt{${s}}`;
  const ansTex = `\\square\\sqrt{\\square}\\ \\text{cm}`;

  if (mode === 'joined' || mode === 'diff') {
    let a = R(rng, 2, 6), b = R(rng, 2, 6);
    if (mode === 'diff') { if (a < b) [a, b] = [b, a]; if (a - b < 2) a = b + 2; }
    const A = a * a * s, B = b * b * s;
    const k = mode === 'joined' ? a + b : a - b;
    const story = mode === 'joined'
      ? L3(`넓이가 ${A}cm²인 정사각형과 ${B}cm²인 정사각형을 한 변이 겹치도록 나란히 붙였습니다.`,
           `A square of area ${A} cm² and a square of area ${B} cm² are placed side by side along one edge.`,
           `把面积为${A}cm²的正方形和面积为${B}cm²的正方形并排拼在一起。`)
      : L3(`넓이가 ${A}cm²인 정사각형과 ${B}cm²인 정사각형이 있습니다.`,
           `There is a square of area ${A} cm² and a square of area ${B} cm².`,
           `有面积为${A}cm²和${B}cm²的两个正方形。`);
    const ask = mode === 'joined'
      ? L3('붙인 도형의 가로 길이를 a√b 꼴로 나타내면 몇 cm입니까?', 'Write the total width in the form a√b cm.', '拼成图形的总长写成a√b的形式是多少cm？')
      : L3('두 정사각형의 한 변의 길이의 차를 a√b 꼴로 나타내면 몇 cm입니까?', 'Write the difference of their side lengths in the form a√b cm.', '两个正方形边长之差写成a√b的形式是多少cm？');
    const op = mode === 'joined' ? '+' : '-';
    return radicalAnswer(wordItem(story, ask, CM, [k, s], [
      { tex:`\\sqrt{${A}}=\\sqrt{${a * a}\\times${s}}=${fmt(a)},\\quad \\sqrt{${B}}=${fmt(b)}` },
      { tex:`${fmt(a)}${op}${fmt(b)}=\\square\\sqrt{\\square}`, blank:[k, s] }
    ], ansTex));
  }

  /* side(기본) — 넓이 → 한 변 */
  const k = R(rng, 2, 9);
  const A = k * k * s;
  return radicalAnswer(wordItem(
    L3(`넓이가 ${A}cm²인 정사각형이 있습니다.`,
       `A square has an area of ${A} cm².`,
       `有一个面积为${A}cm²的正方形。`),
    L3('한 변의 길이를 a√b 꼴로 나타내면 몇 cm입니까?', 'Write its side length in the form a√b cm.', '把边长写成a√b的形式是多少cm？'),
    CM, [k, s], [
      { tex:`\\text{한 변}=\\sqrt{${A}}` },
      { tex:`\\sqrt{${A}}=\\sqrt{${k * k}\\times${s}}=\\square\\sqrt{\\square}`, blank:[k, s] }
    ], ansTex));
};

if (typeof module !== 'undefined' && module.exports) module.exports = NM_TGEN;
})();
