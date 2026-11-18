#!/usr/bin/env node
/* ============================================================
   상담판 단계표 만들기 — 2026-11-17
   원장 「지금 무슨 책 몇 권을 하고 있고 두 자리 받아내림은 되고 … 정보가 부족하면 더 물어볼 수 있도록」
   → 「상담 버전」 → 「응 그렇게 만들어」.

   상담판(consult.html)은 문제를 풀게 하지 않고 보호자에게 묻는다. 묻는 기술의 차례는
   기적의 계산법 권별 주제(data/placement-books.js 의 coverage — 출판사 주제 메타데이터와 우리 유형을
   이어 둔 것)를 뼈대로 쓴다: 예비초등 1~5권 → 초등 1~12권 = 17단계.
   소마셈 2019년 발행본 P~D 46권(soma-p-2019.js·book-volume-topics.js)과 두뇌로 과정 1~25(dunoro-courses.js)도
   같은 꼴로 사다리를 만든다(원장 2026-11-17 「대응 해야지 · 로드맵 진도 다 줬잖아」). 구몬수학 6A~F도 단계 순서대로 넣었다(2026-11-17). 원리셈은 권별 진도표가 없어 아직 없다.
   단계마다
     - 그 단계에서 새로 나오는 유형(앞 단계에 없던 스레드) 먼저, 많아야 6개
     - 이름은 우리 유형 이름(NM_THREADS, 3개 언어)
     - 보호자가 아이에게 내 볼 예시 한 문제(우리 생성기로 만든 것, 시드 고정 — 교재 문항이 아니다)
     - 그 유형·레벨이 처음 나오는 우리 과정(NM_COURSES 의 회차 드릴)
   을 data/consult-ladder.js 로 쓴다. 앱 엔진을 통째로 싣지 않으려고 미리 계산해 둔다.

   쓰는 법: node scripts/build-consult-ladder.js         # 다시 만들기
           node scripts/build-consult-ladder.js --check # 지금 파일이 최신인지(아니면 exit 1)
   ============================================================ */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'data/consult-ladder.js');

function load(){
  const box = { console, URL, setTimeout, clearTimeout, navigator: { language: 'ko' },
    document: { currentScript: null, addEventListener(){}, querySelector(){ return null; }, querySelectorAll(){ return []; },
      createElement(){ return { style: {}, setAttribute(){}, appendChild(){} }; }, documentElement: { lang: 'ko' } },
    localStorage: { getItem(){ return null; }, setItem(){} }, location: { search: '', hash: '', pathname: '/' }, addEventListener(){} };
  box.window = box; box.globalThis = box; vm.createContext(box);
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').replace(/<!--[\s\S]*?-->/g, '');
  for(const m of html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/g)){
    const f = m[1].split(/[?#]/)[0];
    if(!/^(engine\/|data\/)/.test(f)) continue;
    vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), box, { filename: f });
  }
  if(!box.NM_PLACEMENT_BOOKS) vm.runInContext(fs.readFileSync(path.join(ROOT, 'data/placement-books.js'), 'utf8'), box);
  return box;
}

const W = load();
if(!W.NM_HIGH_PACING) vm.runInContext(fs.readFileSync(path.join(ROOT, 'data/high-pacing.js'), 'utf8'), W);
const TH = W.NM_THREADS, COURSES = W.NM_COURSES, BOOKS = W.NM_PLACEMENT_BOOKS, TGEN = W.NM_TGEN, RNG = W.NM_RNG;

/* 과정 차례 — order 순. 첫 등장 = 회차 드릴(복습 표시 제외)에서 그 유형·레벨이 처음 나오는 과정 */
const courseList = Object.keys(COURSES).filter(k => /^C\d+$/.test(k))
  .map(k => ({ key: k, n: +k.slice(1), c: COURSES[k] }))
  .sort((a, b) => (a.c.order ?? a.n) - (b.c.order ?? b.n));
/* 회차 드릴에 없으면 창의 칸(회차 creative)에서 처음 나오는 과정 — placement-plan.js locate() 와 같은 차례 */
function firstCourse(t, lv){
  const hit = (pred, col) => courseList.find(({ c }) => (c.sessions || []).some(s => (s[col] || []).some(d => !d.review && pred(d))));
  for(const col of ['drills', 'creative']){
    const exact = hit(d => d.t === t && d.lv === lv, col);
    if(exact) return { key: exact.key, exact: true };
  }
  for(const col of ['drills', 'creative']){
    const any = hit(d => d.t === t, col);
    if(any) return { key: any.key, exact: false };
  }
  return null;
}

/* 예시 문제 — 보호자가 아이에게 그대로 내 볼 짧은 식 하나. 그림 위젯만 있는 유형은 예시 없음.
   { q: 묻는 식(KaTeX), a: 답이 채워진 식(KaTeX) }. 「… = □」로 끝나는 꼴을 먼저 고른다(아이에게 말로 내기 쉽다).
   생성기가 소수 답을 □/100 칸으로 받는 꼴이면 보호자에게는 소수로 보인다. */
function fill(tex, answers){
  let i = 0;
  return tex.replace(/\\square/g, () => String(answers[Math.min(i++, answers.length - 1)]));
}
function example(t, lv){
  const th = TH[t], gen = th && TGEN[th.gen];
  if(!gen) return null;
  const lvObj = (th.levels || []).find(l => l.id === lv) || {};
  let best = null;
  for(let i = 0; i < 60; i++){
    let p;
    try { p = gen(Object.assign({}, lvObj.params || {}), RNG.mulberry32(RNG.hashSeed('consult|' + t + '@' + lv + '|' + i))); } catch(e){ continue; }
    const tex = p && typeof p.tex === 'string' ? p.tex.trim() : '';
    if(!tex || tex.length > 46 || /\\text|\\begin|\\boxed|\[|\\,\\%|\\%/.test(tex) || !/\\square/.test(tex)) continue;
    const ans = (Array.isArray(p.answer) ? p.answer : [p.answer]).filter(v => v !== undefined && v !== null);
    if(!ans.length || ans.some(v => typeof v !== 'number' || !Number.isFinite(v))) continue;
    const eq = tex.lastIndexOf('=');
    if(eq < 0) continue;
    const lhs = tex.slice(0, eq).trim(), rhs = tex.slice(eq + 1).trim();
    let ex = null, rank = 9;
    if(rhs === '\\square' && !/\\square/.test(lhs)){ ex = { q: lhs + ' = \\square', a: lhs + ' = ' + ans[0] }; rank = 0; }
    else if(/\\square/.test(lhs) && !/\\square/.test(rhs) && ans.length === 1){ ex = { q: tex, a: fill(tex, ans) }; rank = 1; }
    else {
      const dec = /^\\d?frac\{\\square\}\{(10|100|1000)\}$/.exec(rhs);
      if(dec && ans.length === 1){ const v = ans[0] / +dec[1]; ex = { q: lhs + ' = \\square', a: lhs + ' = ' + String(+v.toFixed(3)) }; rank = 2; }
      else if(/^\d*\.?\\square$/.test(rhs) && ans.length === 1){ ex = { q: lhs + ' = \\square', a: fill(tex, ans) }; rank = 2; }
      else if(!/\\square/.test(lhs)){ ex = { q: tex, a: fill(tex, ans) }; rank = 3; }
    }
    if(ex && (!best || rank < best.rank)) best = Object.assign(ex, { rank });
    if(best && best.rank === 0) break;
  }
  if(!best) return null;
  delete best.rank;
  return best;
}

/* 교재마다 사다리 하나. 행 = { id, group, volume, title(3개 언어 이름), topic(한국어 주제 — 교재가 공개한 짧은 주제 요약), refs } */
function buildLadder(rows){
  const seen = new Set();
  return rows.map(row => {
    const byThread = new Map();
    row.refs.forEach(r => { const [t, lv] = r.split('@'); if(TH[t] && (!byThread.has(t) || byThread.get(t) < +lv)) byThread.set(t, +lv); });
    const all = [...byThread.entries()].map(([t, lv]) => ({ t, lv, isNew: !seen.has(t) }));
    all.forEach(x => seen.add(x.t));
    const picked = all.filter(x => x.isNew).concat(all.filter(x => !x.isNew)).slice(0, 6);
    const skills = picked.map(({ t, lv }) => {
      const th = TH[t], lvObj = (th.levels || []).find(l => l.id === lv) || {};
      const fc = firstCourse(t, lv);
      return { ref: t + '@' + lv, name: th.name, level: lvObj.label || null, course: fc ? fc.key : null, example: example(t, lv) };
    });
    return { id: row.id, group: row.group, volume: row.volume, title: row.title, topic: row.topic, skills };
  });
}
const L3 = (ko, en, zh) => ({ ko, en, zh });
/* 기적의 계산법 — 예비초등 2023판 1~5권 → 초등 2021판 1~12권 (placement-books.js 권별 coverage) */
const miracleRows = BOOKS.getSteps('miracle').filter(s => /^(pre-2023|elem-2021)-v\d+$/.test(s.id)).map(s => {
  const m = /^(pre-2023|elem-2021)-v(\d+)$/.exec(s.id), v = +m[2], pre = m[1] === 'pre-2023';
  return { id: s.id, group: m[1], volume: v,
    title: pre ? L3('예비초등 ' + v + '권', 'Pre-school vol. ' + v, '学前第' + v + '册') : L3('초등 ' + v + '권', 'Elementary vol. ' + v, '小学第' + v + '册'),
    topic: (String(s.label.ko).split('—')[1] || '').trim(), refs: s.coverage || [] };
});
/* 소마셈 2019년 발행본 P1~P8 → K → A → B → C → D1~D6 (soma-p-2019.js · book-volume-topics.js) */
const somaRows = [];
[['P', 'NM_SOMA_P_2019'], ['K', 'NM_SOMA_K_2019'], ['A', 'NM_SOMA_A_2019'], ['B', 'NM_SOMA_B_2019'], ['C', 'NM_SOMA_C_2019'], ['D', 'NM_SOMA_D_2019']].forEach(([stage, key]) => {
  const d = W[key];
  if(!d) throw new Error('소마셈 표 없음: ' + key);
  d.courses.forEach(c => somaRows.push({ id: 'soma-' + stage.toLowerCase() + '-v' + c.course, group: stage, volume: c.course,
    title: L3(stage + c.course + '권', 'Vol. ' + stage + c.course, stage + c.course + '册'), topic: String(c.topics || ''), refs: c.refs }));
});
/* 두뇌로 과정 1~25 (dunoro-courses.js — 과정표에 적힌 연산을 우리 유형으로 옮긴 것) */
const dunoroRows = W.NM_DUNORO_COURSES.courses.map(c => ({ id: 'dunoro-' + c.course, group: 'level-' + c.level, volume: c.course,
  title: L3('과정 ' + c.course, 'Course ' + c.course, '课程' + c.course), topic: String(c.topics || ''), refs: c.refs }));
/* 구몬수학 6A~I — 교원구몬 「구몬수학 진도체크표」(6A~2A · A~F · G~I, 원장 제공 사진 2026-11-18)의 교재 번호 구간대로.
   원장 2026-11-17 「구몬은 A부터 알파벳 순서대로 1학년 2학년 이런 과정」 → 「구몬 진도표로 검색」 → 진도체크표 사진.
   공식 안내(kumon.co.kr/Subject/Math): 24단계 — 구몬수학 6A~I · 구몬수학 플러스 J~SS. 인정테스트 「자기 학년 기준」
   유아 2A · 초1 A · 초2 B · 초3 C(→ D 초4 · E 초5 · F 초6 · G~I 중학). 단계마다 교재 1~200번.
   한 줄 = 그 단계의 교재 번호 구간 하나(진도체크표의 「교재 내용」을 짧게 묶음). 우리 유형 대응은 우리 판단.
   고등(구몬수학 플러스, 원장 2026-11-18 「우리도 고등 과정 있는 거 아니야?」): J~O(진도체크표 J~O) · SM 1~80 · SP 1~40은
   우리 고등 과정(공통수학1·2 · 대수 · 미적분Ⅰ, C38~C73) 유형에 맞췄다. N 뒤쪽·O는 미적분Ⅱ(초월함수) 내용이라 우리에게 가장
   가까운 미적분Ⅰ 유형으로 잇는다. 우리 앱에 없는 내용 — SV(벡터) · SP 41~90(이항정리·확률) · SS(통계) — 은 줄로 만들지 않는다. */
const KUMON_GRADE = { '6A': ['유아', 'Pre-K', '幼儿'], '5A': ['유아', 'Pre-K', '幼儿'], '4A': ['유아', 'Pre-K', '幼儿'], '3A': ['유아', 'Pre-K', '幼儿'], '2A': ['유아', 'Pre-K', '幼儿'],
  A: ['초1', 'Gr 1', '小1'], B: ['초2', 'Gr 2', '小2'], C: ['초3', 'Gr 3', '小3'], D: ['초4', 'Gr 4', '小4'], E: ['초5', 'Gr 5', '小5'], F: ['초6', 'Gr 6', '小6'],
  G: ['중1', 'Gr 7', '初1'], H: ['중2', 'Gr 8', '初2'], I: ['중3', 'Gr 9', '初3'],
  J: ['고등', 'High school', '高中'], K: ['고등', 'High school', '高中'], L: ['고등', 'High school', '高中'], M: ['고등', 'High school', '高中'],
  N: ['고등', 'High school', '高中'], O: ['고등', 'High school', '高中'], SM: ['고등', 'High school', '高中'], SP: ['고등', 'High school', '高中'] };
const kumonRows = [
  ['6A', '1~200', '10까지 수 세기 · 숫자 읽기 · 동그라미 수', ['NL1@1', 'NL1@2']],
  ['5A', '1~200', '30까지 숫자 읽기 · 50까지 수 배열', ['NL4@1', 'NL7@1', 'NL1@2']],
  ['4A', '1~200', '숫자 덧쓰기 · 10·20·30까지 연습 · 50까지의 수', ['NL4@1', 'NL7@1', 'NL2@2']],
  ['3A', '1~70', '100·120까지의 수', ['NL4@1', 'NS1@7', 'NL7@1']],
  ['3A', '71~200', '더하기 1·2·3', ['AD1@1', 'NL2@2', 'NL2@3']],
  ['2A', '1~110', '더하기 4~7', ['AD1@1', 'NS2@2', 'NS3@1']],
  ['2A', '111~200', '더하기 8·9·10', ['AD2@1', 'NS3@2', 'NL6@1']],
  ['A', '1~80', '덧셈(더해서 20까지 · 28까지)', ['AD2@1', 'AD3@1', 'AD3@2', 'AD10@1']],
  ['A', '81~200', '뺄셈(빼기 1~5 · 20 빼기까지)', ['SB1@1', 'SB1@2', 'SB2@1', 'SB3@1', 'SB3@2']],
  ['B', '1~100', '세로셈 덧셈(합 100까지 · 두 자리 · 세 자리)', ['AD5@1', 'AD5@2', 'AD5@7', 'AD6@4', 'AD6@7']],
  ['B', '101~200', '세로셈 뺄셈(두 자리 · 세 자리)', ['SB4@1', 'SB4@2', 'SB4@4', 'SB6@2', 'SB6@6']],
  ['C', '1~50', '곱셈구구(3단~9단까지)', ['ML2@1', 'ML2@3', 'ML3@3', 'ML4@1']],
  ['C', '51~110', '두 자리 × 한 자리 · 세·네 자리 × 한 자리', ['ML6@2', 'ML6@6', 'ML7@3', 'ML7@5']],
  ['C', '111~200', '나눗셈 기초 · 나머지 있는 나눗셈 · 두·세 자리 ÷ 한 자리', ['DV2@1', 'DV3@1', 'DV18@4', 'DV19@3', 'DV4@2']],
  ['D', '1~80', '두·세 자리 × 두 자리 · 곱셈과 나눗셈', ['ML8@2', 'ML8@4', 'ML9@3', 'EL2@3']],
  ['D', '81~150', '두 자리 수로 나누기 · 몫이 두 자리 이상', ['DV5@1', 'DV5@3', 'DV5@4']],
  ['D', '151~200', '분수(가분수·대분수) · 약분', ['FR2@1', 'FR5@1', 'DV7@2']],
  ['E', '1~140', '분수의 덧셈·뺄셈(같은 분모 · 다른 분모)', ['FR1@1', 'FR4@1', 'FR4@2', 'FR3@2', 'FR5@2']],
  ['E', '141~200', '분수의 곱셈·나눗셈 · 두 분수의 사칙 계산', ['FR6@1', 'FR6@2', 'FR7@1', 'FR7@4']],
  ['F', '1~130', '세 분수 계산 · 계산 순서 · 세 개 이상의 분수 계산', ['FR6@3', 'MX1@2', 'MX1@3', 'FR4@2']],
  ['F', '131~200', '분수와 소수 · 문장제 · 소수', ['FR8@1', 'DC1@2', 'DC2@6', 'DC3@3', 'MX5@1']],
  ['G', '1~100', '양수와 음수의 사칙 계산', ['MD2@2', 'MD3@2', 'MD4@4', 'MD6@2']],
  ['G', '101~200', '문자식의 값 · 식의 계산 · 일차방정식', ['MD48@2', 'MD49@3', 'MD50@3']],
  ['H', '1~110', '이원·삼원 연립방정식 · 방정식의 응용', ['MD63@2', 'MD63@3', 'MD72@1']],
  ['H', '111~200', '단항식·다항식 계산 · 곱셈 공식 · 인수분해', ['MD11@1', 'MD13@1', 'MD19@1', 'MD19@3', 'MD20@2']],
  ['I', '1~100', '제곱근 · 이차방정식 · 부등식', ['MD15@1', 'MD17@1', 'MD66@1', 'MD66@3', 'MD64@2']],
  ['I', '101~200', '일차함수와 그래프 · 이차함수와 그래프', ['MD65@3', 'MD74@2', 'MD78@2', 'MD67@2']],
  ['J', '1~60', '식의 계산 · 인수분해', ['MD21@3', 'MD22@3', 'MD91@2', 'MD25@2']],
  ['J', '61~110', '분수식 · 무리수 · 이차방정식', ['MD130@2', 'MD132@2', 'MD28@3']],
  ['J', '111~150', '이차방정식과 복소수 · 판별식 · 근과 계수의 관계 · 연립방정식', ['MD95@2', 'MD97@2', 'MD26@2', 'MD27@2', 'MD104@2']],
  ['J', '151~200', '다항식의 나눗셈 · 나머지정리 · 인수정리 · 항등식·부등식의 증명', ['MD21@3', 'MD24@2', 'MD93@2', 'MD23@2', 'MD126@2']],
  ['K', '1~100', '이차함수의 그래프 · 최대·최소 · 이차부등식', ['MD99@2', 'MD100@2', 'MD29@2']],
  ['K', '101~120', '고차함수 · 고차방정식과 고차부등식', ['MD101@2', 'MD102@2']],
  ['K', '121~170', '분수함수 · 무리함수와 그 방정식·부등식', ['MD131@2', 'MD133@2', 'MD130@2', 'MD132@2']],
  ['K', '171~200', '지수함수 · 지수방정식과 지수부등식', ['MD36@2', 'MD136@2', 'MD52@2', 'MD54@1']],
  ['L', '1~30', '로그의 계산 · 로그함수 · 로그방정식과 로그부등식', ['MD37@2', 'MD38@2', 'MD138@2', 'MD53@2', 'MD54@2']],
  ['L', '31~110', '극한과 도함수 · 접선 · 극대·극소 · 최대·최소 · 방정식·부등식 활용', ['MD43@2', 'MD44@2', 'MD45@2', 'MD60@2', 'MD157@2', 'MD158@2']],
  ['L', '111~200', '부정적분과 정적분 · 넓이 · 부피 · 속도와 거리', ['MD46@2', 'MD159@2', 'MD61@2', 'MD62@2']],
  ['M', '1~100', '점과 직선 · 원 · 자취 · 부등식의 영역', ['MD31@2', 'MD32@2', 'MD33@2', 'MD34@2', 'MD35@2', 'MD119@2']],
  ['M', '101~150', '삼각함수의 성질 · 그래프 · 삼각방정식과 삼각부등식', ['MD140@2', 'MD39@2', 'MD142@2', 'MD143@2', 'MD57@2', 'MD144@2']],
  ['M', '151~200', '삼각함수의 덧셈정리 · 사인법칙과 코사인법칙 · 삼각형의 넓이', ['MD55@2', 'MD56@2', 'MD145@2']],
  ['N', '1~60', '등차·등비수열 · 여러 가지 수열 · 점화식 · 수학적 귀납법', ['MD40@2', 'MD41@2', 'MD42@2', 'MD149@2', 'MD152@2', 'MD153@2']],
  ['N', '61~200', '수열의 극한과 급수 · 함수의 극한과 연속 · 여러 가지 미분법', ['MD43@3', 'MD58@2', 'MD59@2', 'MD44@3', 'MD154@2']],
  ['O', '1~50', '접선과 법선 · 증가·감소와 극값 · 최대·최소 · 미분의 응용', ['MD45@2', 'MD156@2', 'MD60@2', 'MD157@3', 'MD158@3']],
  ['O', '51~200', '부정적분 · 치환·부분적분 · 정적분 · 넓이·부피 · 속도와 거리 · 미분방정식', ['MD46@3', 'MD159@3', 'MD61@2', 'MD62@3']],
  ['SM', '1~40', '행렬의 덧셈·뺄셈·곱셈 · 역행렬 · 연립일차방정식과 행렬', ['MD30@2', 'MD30@3']],
  ['SM', '41~80', '함수 · 일차변환', ['MD127@2', 'MD128@2', 'MD129@2']],
  ['SP', '1~40', '경우의 수 · 순열 · 조합', ['MD110@2', 'MD111@3', 'MD112@2', 'MD113@2', 'MD114@2']]
].map(([lv, range, topic, refs], i) => ({ id: 'kumon-' + lv.toLowerCase() + '-' + range.split('~')[0], group: lv, volume: i + 1,
  title: L3(lv + ' ' + range + ' (' + KUMON_GRADE[lv][0] + ' 기준)', 'Level ' + lv + ' ' + range + ' (' + KUMON_GRADE[lv][1] + ')', lv + ' ' + range + '（' + KUMON_GRADE[lv][2] + '）'), topic, refs }));
const ladders = { miracle: buildLadder(miracleRows), soma: buildLadder(somaRows), dunoro: buildLadder(dunoroRows), kumon: buildLadder(kumonRows) };
const ladder = [].concat(ladders.miracle, ladders.soma, ladders.dunoro, ladders.kumon);
/* 과정마다 회차별 새 드릴(복습 제외) s, 고등 학습 묶음 번호 b(studyPlan 과정만 — 화면에 「학습 묶음 N」으로) */
const HP = W.NM_HIGH_PACING;
const courses = {};
courseList.forEach(({ key, n, c }) => {
  const ss = c.sessions || [];
  courses[key] = { n, order: c.order ?? n, tier: c.tier, title: c.title,
    s: ss.map(x => (x.drills || []).filter(d => !d.review).map(d => d.t + '@' + d.lv)) };
  if(c.comingSoon) courses[key].soon = true;
  if(c.studyPlan && HP) courses[key].b = ss.map((_, i) => HP.lessonIndex(c, i + 1) + 1);
});
/* 「이 권(단계)까지 끝냈어요」 다음 시작점 — 단계마다 after = { course, session }(원장 2026-11-18 「구몬 진도로는 우리 과정도 세분화」).
   과정 = 다음 단계의 새 계산이 처음 나오는 과정 가운데 가장 앞(다음 단계가 없으면 끝낸 단계 가장 뒤 과정의 다음 과정).
   회차 = 그 과정에서 끝낸 단계까지의 기술·앞 과정 내용만 있는 앞 회차를 건너뛴 첫 회차(app/consult-rules.js refineStart). */
const { refineStart, knownMap } = require('../app/consult-rules.js');
const ready = courseList.filter(({ key }) => !courses[key].soon);
const orderOf = k => courses[k] ? courses[k].order : Infinity;
function addAfter(steps, rows){
  steps.forEach((st, i) => {
    const next = steps[i + 1];
    const known = knownMap(rows.slice(0, i + 1).flatMap(r => r.refs).filter(r => TH[r.split('@')[0]]));
    /* 다음 단계의 기술 가운데 끝낸 단계까지 아직 안 나온 것(같은 유형이면 더 높은 레벨)만 본다 — 다음 권에 다시 나오는
       앞 권 계산이 시작점을 끌어내리지 않게. 모두 이미 나온 것이면 다음 단계 기술 전부로. */
    let key = null;
    if(next){
      const fresh = next.skills.filter(k => { const j = k.ref.lastIndexOf('@'); return !(known.get(k.ref.slice(0, j)) >= +k.ref.slice(j + 1)); });
      const ks = (fresh.length ? fresh : next.skills).map(k => k.course).filter(k => courses[k]);
      if(ks.length) key = ks.sort((a, b) => orderOf(a) - orderOf(b))[0];
    }
    if(!key){
      const done = Math.max(-1, ...st.skills.map(k => orderOf(k.course)).filter(Number.isFinite));
      key = (ready.find(x => orderOf(x.key) > done) || ready[ready.length - 1]).key;
    }
    if(courses[key].soon) key = (ready.find(x => orderOf(x.key) >= orderOf(key)) || ready[ready.length - 1]).key;
    st.after = refineStart(courses, key, known);
  });
}
addAfter(ladders.miracle, miracleRows); addAfter(ladders.soma, somaRows); addAfter(ladders.dunoro, dunoroRows); addAfter(ladders.kumon, kumonRows);

const body = '/* 자동 생성 — node scripts/build-consult-ladder.js (손으로 고치지 않는다).\n' +
  '   기적의 계산법·소마셈(2019)·두뇌로 권별 주제 → 우리 유형·예시 문제·처음 나오는 과정. 예시는 우리 생성기 문제다(교재 문항 아님). */\n' +
  'window.NM_CONSULT_LADDER = ' + JSON.stringify({ version: 3, ladders, courses }) + ';\n';

if(process.argv.includes('--check')){
  const now = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if(now !== body){ console.error('data/consult-ladder.js 가 낡았다 — node scripts/build-consult-ladder.js'); process.exit(1); }
  console.log('consult-ladder 최신'); process.exit(0);
}
fs.writeFileSync(OUT, body);
const missing = ladder.flatMap(st => st.skills.filter(k => !k.course).map(k => st.id + ' ' + k.ref));
const noEx = ladder.flatMap(st => st.skills.filter(k => !k.example).map(k => st.id + ' ' + k.ref));
console.log(`기적 ${ladders.miracle.length} · 소마셈 ${ladders.soma.length} · 두뇌로 ${ladders.dunoro.length} · 구몬 ${ladders.kumon.length}단계 · 기술 ${ladder.reduce((a, s) => a + s.skills.length, 0)} · ${(body.length / 1024).toFixed(1)}KB`);
if(missing.length) console.log('과정 없음:', missing.join(' | '));
if(noEx.length) console.log('예시 없음:', noEx.join(' | '));
