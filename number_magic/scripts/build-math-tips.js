#!/usr/bin/env node
/* ============================================================
   data/math-tips.js 생성기 — 수학 팁(기억 고리)
   ============================================================
   원장 2026-09-08: "중고등 수학 팁 — 잘 기억하고 이해할 수 있는 스킬이나 팁들",
   그리고 "이런 것들을 검색해서 제일 꿀팁을 넣어". 그래서 팁의 hook 은 지어낸 것보다
   실제로 쓰이는 암기법을 먼저 찾아 쓰고, 출처를 source:'known'|'own' 으로 남긴다.

   왜 생성기인가 — 팁은 62개 × 3필드 × 3언어 = 558개 문자열이다. 손으로 붙여 넣으면
   따옴표 하나에 파일이 깨지고, 어느 것이 원장 문장이고 어느 것이 초안인지도 섞인다.
   여기서 JSON 을 읽어 한 번에 찍고, **원장이 직접 준 팁(OWNER)은 항상 이깁니다** —
   초안이 같은 id 를 내도 덮어쓰지 않는다.

   쓰는 법:
     node scripts/build-math-tips.js /tmp/md-tips-A.json /tmp/md-tips-B.json
   검사(쓰지 않고 확인만):
     node scripts/build-math-tips.js --check /tmp/md-tips-A.json …
   ============================================================ */
'use strict';
const fs = require('fs'), path = require('path');

/* 원장이 직접 준 팁 — 채팅 원문(2026-09-08). 다른 어떤 입력보다 우선한다. */
const OWNER = {
  DV8: {
    hook:{ ko:'제곱수만 약수가 홀수 개! 소수의 제곱은 딱 3개.',
           en:'Only perfect squares have an odd number of divisors — a prime squared has exactly 3.',
           zh:'只有平方数的约数是奇数个——质数的平方恰好3个。' },
    why:{ ko:'약수는 a×b 짝으로 세는데, 제곱수는 √n×√n 한 짝이 같은 수라 하나로만 세어져요.',
          en:'Divisors come in pairs a×b; for a square the pair √n×√n is one number, so it counts once.',
          zh:'约数按a×b成对出现，平方数里√n×√n这一对是同一个数，只算一次。' },
    mistake:{ ko:'36의 약수를 짝으로 세다 6을 두 번 세지 않기 — 답은 9개.',
              en:'Counting 6 twice in the pairs of 36 — the answer is 9, not 10.',
              zh:'数36的约数时把6算两次——答案是9个，不是10个。' } },
  MD42: {
    hook:{ ko:'Σ는 "여기서부터 저기까지 더해라"예요 — 그냥 가우스 덧셈!',
           en:'Σ just says "add from here to there" — it is Gauss addition in a coat.',
           zh:'Σ就是"从这里加到那里"——不过是高斯求和换了件衣服。' },
    why:{ ko:'아래 k=1은 시작, 위 n은 끝. 항을 하나씩 늘어놓으면 늘 하던 덧셈이에요.',
          en:'k=1 below is the start, n on top is the end; write the terms out and it is ordinary addition.',
          zh:'下面的k=1是起点，上面的n是终点；把各项写出来，就是普通的加法。' },
    mistake:{ ko:'상수를 Σ 안에 두면 개수만큼 더해요 — Σ(k=1~n) 3은 3이 아니라 3n.',
              en:'A constant inside Σ is added n times — Σ 3 from 1 to n is 3n, not 3.',
              zh:'常数在Σ里要加n次——Σ 3（k从1到n）是3n，不是3。' } },
};

const args = process.argv.slice(2);
const checkOnly = args.includes('--check');
const files = args.filter(a => a !== '--check');
/* 입력이 없으면 원장 팁만으로 찍는다 — 초안이 아직 없을 때도 파일이 늘 유효하게 있다. */

const L = ['ko','en','zh'], F = ['hook','why','mistake'];
const tips = {}, problems = [];

for(const [id, v] of Object.entries(OWNER)) tips[id] = Object.assign({ source:'owner' }, v);

for(const f of files){
  if(!fs.existsSync(f)){ problems.push(`입력 없음: ${f}`); continue; }
  const obj = JSON.parse(fs.readFileSync(f,'utf8'));
  for(const [id, v] of Object.entries(obj)){
    if(OWNER[id]) continue;                     /* 원장 문장은 안 덮는다 */
    tips[id] = { source: v.source === 'known' ? 'known' : 'own',
      hook:v.hook, why:v.why, mistake:v.mistake };
  }
}

/* 검사 — 세 언어가 다 있고, LaTeX(백슬래시)가 없고, 길이가 사람이 읽을 만한지. */
const MAXKO = { hook:52, why:80, mistake:70 };   /* 원장 문장은 조금 길어 여유를 둔다 */
for(const [id, t] of Object.entries(tips)){
  for(const f of F){
    if(!t[f]){ problems.push(`${id}.${f} 없음`); continue; }
    for(const l of L){
      const v = t[f][l];
      if(!v) problems.push(`${id}.${f}.${l} 비어 있음`);
      else if(/\\/.test(v)) problems.push(`${id}.${f}.${l} 백슬래시(LaTeX) 들어 있음`);
    }
    if(t[f].ko && t[f].ko.length > MAXKO[f]) problems.push(`${id}.${f}.ko ${t[f].ko.length}자 (최대 ${MAXKO[f]})`);
  }
}
/* 실존하는 스레드에만 붙는지 — 오타 id 는 조용히 안 나올 뿐이라 눈에 안 띈다. */
const th = fs.readFileSync(path.join(__dirname,'..','data','threads.js'),'utf8');
for(const id of Object.keys(tips)) if(!th.includes(`\n${id}:{`)) problems.push(`${id} — threads.js 에 없는 스레드`);

const known = Object.values(tips).filter(t=>t.source==='known').length;
const own   = Object.values(tips).filter(t=>t.source==='own').length;
const owner = Object.values(tips).filter(t=>t.source==='owner').length;
console.log(`팁 ${Object.keys(tips).length}개 — 원장 ${owner} · 알려진 암기법 ${known} · 자체 ${own}`);
if(problems.length){ console.log(`\n실패 ${problems.length}건`); problems.forEach(p=>console.log('  ✗ '+p)); process.exit(1); }
console.log('통과 — 세 언어·평문·길이·스레드 id 모두 정상.');
if(checkOnly) process.exit(0);

const body = Object.keys(tips).sort().map(id => {
  const t = tips[id];
  const fld = f => `  ${f}:{ ${L.map(l=>`${l}:${JSON.stringify(t[f][l])}`).join(',\n         ')} }`;
  return `T[${JSON.stringify(id)}] = { source:${JSON.stringify(t.source)},\n${F.map(fld).join(',\n')} };`;
}).join('\n\n');

const out = `/* ============================================================
   Numbers of Magic — 수학 팁(기억 고리) 데이터  ※ 생성 파일, 손으로 고치지 말 것
   만드는 법: node scripts/build-math-tips.js /tmp/md-tips-A.json /tmp/md-tips-B.json
   원장 2026-09-08: "중고등 수학 팁 — 잘 기억하고 이해할 수 있는 스킬이나 팁들",
   "이런 것들을 검색해서 제일 꿀팁을 넣어".

   학습지 회차 첫 장의 개념 패널(exam.js w2ConceptPanelHtml) 안, 개념 문장 아래에 붙는다.
   온라인 회차 탭도 같은 마크업이라 화면에도 같이 나온다. 팁이 없는 스레드는 조용히 생략.

   형식: NM_MATH_TIPS[스레드id] = { source, hook, why, mistake }  (뒤 셋은 {ko,en,zh})
     hook    — 기억 고리. 외워지는 한 줄.
     why     — 왜 그런지 한 문장. 규칙을 되풀이하지 않는다.
     mistake — 가장 흔한 실수 하나와 그걸 잡는 확인법.
     source  — 'owner' 원장이 직접 준 문장 · 'known' 실제로 쓰이는 암기법 · 'own' 자체 작성
   평문만(LaTeX 금지 — 개념 패널은 esc() 로 그대로 찍는다).
   ============================================================ */
(function(){
'use strict';
window.NM_MATH_TIPS = window.NM_MATH_TIPS || {};
const T = window.NM_MATH_TIPS;

${body}
})();
`;
fs.writeFileSync(path.join(__dirname,'..','data','math-tips.js'), out);
console.log('data/math-tips.js 씀 — ' + Object.keys(tips).length + '개');
