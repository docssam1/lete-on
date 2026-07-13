/* ============================================================
   Numbers of Magic — 시험(Exam) & 인쇄 학습지 모듈
   CURRICULUM_DESIGN.md §6 구현.
   의존: engine/rng.js (NM_RNG), data/threads.js (NM_THREADS),
         engine/generators.js or thread generators (NM_TGEN)
   ============================================================ */
(function(){
'use strict';

/* ── 인쇄 CSS 주입 (1회) ─────────────────────────────── */
(function injectPrintCSS(){
  if(document.getElementById('nm-print-style')) return;
  const s = document.createElement('style');
  s.id = 'nm-print-style';
  s.textContent = `
@media print {
  body > *:not(.nm-print-sheet) { display: none !important; }
  .nm-print-sheet { display: block !important; font-family: sans-serif; }
  .nm-print-answer-key { page-break-before: always; }
  .nm-print-header { border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 16px; }
  .nm-print-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .nm-print-item { border: 1px solid #ccc; border-radius: 4px; padding: 10px; min-height: 48px; }
  .nm-print-item .nm-q-num { font-weight: bold; font-size: 0.8em; color: #555; }
  .nm-print-item .nm-q-tex { font-size: 1.1em; margin-top: 4px; }
  .nm-print-blank { display: inline-block; min-width: 40px; border-bottom: 2px solid #000; }
  .nm-print-answer-key .nm-ak-grid { display: grid; grid-template-columns: repeat(5,1fr); gap: 6px; }
  .nm-print-answer-key .nm-ak-item { font-size: 0.9em; }
}
@media screen {
  .nm-print-sheet { display: none; }
}`;
  document.head.appendChild(s);
})();

/* ── 내부 헬퍼 ─────────────────────────────── */
const $ = (sel, ctx) => (ctx || document).querySelector(sel);
const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

function renderKaTeX(tex, el){
  if(window.katex){
    try{ katex.render(tex, el, {throwOnError:false}); return; }catch(_){}
  }
  el.textContent = tex.replace(/\\square/g,'□').replace(/\\/g,'');
}

function esc(str){ return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

/* 원형 번호 ①②③... */
function circled(n){
  if(n>=1&&n<=20) return String.fromCharCode(0x245F+n);
  if(n>=21&&n<=35) return String.fromCharCode(0x3250+n-20);
  return '('+n+')';
}

/* 세로셈 파싱: "a OP b = \square" 형태 */
function parseVert(tex){
  const m = (tex||'').match(/^([\d.]+)\s*([+\-×÷]|\\times|\\div)\s*([\d.]+)\s*=\s*\\square\s*$/);
  if(!m) return null;
  const opMap={'\\times':'×','\\div':'÷','-':'−'};
  return {a:m[1], op:opMap[m[2]]||m[2], b:m[3]};
}

/* ── 문장제(Word Problem) 변환 ─────────────────────────
   단순 사칙 "a OP b = □" 문제를 교과서식 문장제로 감싼다.
   시드 rng로 이름·소재를 뽑아 인쇄 재현성 유지. */
const WP_NAMES=['민수','지우','서연','하준','다은','시우','유나','도윤','예준','소율'];
const WP_ITEMS=[['사과','개'],['구슬','개'],['색종이','장'],['스티커','장'],['사탕','개'],['동화책','권'],['연필','자루'],['쿠키','개'],['딱지','장'],['블록','개']];
function kJosa(word, withBatchim, without){
  const code = word.charCodeAt(word.length-1);
  if(code<0xAC00||code>0xD7A3) return word+without;
  return ((code-0xAC00)%28>0) ? word+withBatchim : word+without;
}
function wordifyProblem(p, rng){
  const v = parseVert(p.tex||'');
  if(!v) return null;
  if(v.a.indexOf('.')>=0 || v.b.indexOf('.')>=0) return null; /* 소수는 숫자식 유지 */
  const a=+v.a, b=+v.b;
  if(!isFinite(a)||!isFinite(b)||a>100000||b>100000) return null;
  const name = WP_NAMES[(rng()*WP_NAMES.length)|0];
  const pick = WP_ITEMS[(rng()*WP_ITEMS.length)|0];
  const item=pick[0], unit=pick[1];
  const nameJ = kJosa(name,'이는','는');
  const itemJ = kJosa(item,'을','를');
  const bUnitJ = b+kJosa(unit,'을','를');
  switch(v.op){
    case '+':
      return `${nameJ} ${itemJ} ${a}${unit} 가지고 있어요. ${bUnitJ} 더 받으면 모두 몇 ${unit}일까요?`;
    case '−': case '-':
      if(a<b) return null;
      return `${nameJ} ${itemJ} ${a}${unit} 가지고 있었는데 ${bUnitJ} 친구에게 주었어요. 남은 ${kJosa(item,'은','는')} 몇 ${unit}일까요?`;
    case '×':
      return `${item} 한 묶음에 ${a}${unit}씩 들어 있어요. ${b}묶음에는 ${kJosa(item,'이','가')} 모두 몇 ${unit} 있을까요?`;
    case '÷':
      if(b===0 || a%b!==0) return null; /* 나머지 있으면 문장제 제외 */
      return `${nameJ} ${itemJ} ${a}${unit} 가지고 있어요. ${b}명이 똑같이 나누어 가지면 한 명이 몇 ${unit}씩 가질까요?`;
  }
  return null;
}
/* wordType: 'none' | 'mix'(약 1/3) | 'all' */
function applyWordProblems(problems, wordType, numericSeed){
  if(!wordType || wordType==='none') return problems;
  const rng = NM_RNG.mulberry32(((numericSeed>>>0) ^ 0x5f3759df)>>>0);
  problems.forEach((p,i)=>{
    if(wordType==='mix' && i%3!==1) return;
    const w = wordifyProblem(p, rng);
    if(w) p.word = w;
  });
  return problems;
}

/* 스레드 레벨 params 가져오기 */
function getLevelParams(threadId, lv){
  const th = (window.NM_THREADS || {})[threadId];
  if(!th) return {};
  const lvObj = (th.levels || []).find(l => l.id === lv);
  return lvObj ? lvObj.params : {};
}

/* 생성기 호출: NM_TGEN[genKey](params, rng) → problem */
function generateProblem(threadId, lv, rng){
  const th = (window.NM_THREADS || {})[threadId];
  if(!th){ return {tex:`[${threadId} ?]`, answer:0, prompt:{ko:'',en:'',zh:''}}; }
  const genKey = th.gen;
  const params = getLevelParams(threadId, lv);
  const gen = (window.NM_TGEN || {})[genKey];
  if(gen){ return gen(params, rng); }
  const a = Math.floor(rng()*90)+10, b = Math.floor(rng()*9)+1;
  return { tex:`${a} + ${b} = \\square`, answer:a+b, prompt:{ko:`${a}+${b}=?`,en:`${a}+${b}=?`,zh:`${a}+${b}=?`} };
}

/* 문제 배열 생성 (시드 재현 가능) */
function buildProblems(threadId, lv, count, seed){
  const rng = NM_RNG.mulberry32(seed);
  const problems = [];
  for(let i=0;i<count;i++){
    problems.push(generateProblem(threadId, lv, rng));
  }
  return problems;
}

/* 학습지 코드 → 설정 파싱 */
function parseWorksheetCode(code){
  const m = code.match(/^#?([A-Z0-9]+)-L(\d+)x(\d+)-([a-z0-9]+)$/i);
  if(!m) return null;
  return { thread:m[1], level:parseInt(m[2]), count:parseInt(m[3]), seed:m[4] };
}

/* ────────────────────────────────────────────────────────
   공개 API
   ──────────────────────────────────────────────────────── */
const NM_EXAM = {

  /* 학습지 코드 생성 */
  worksheetCode(config){
    const { thread, level, count, seed } = config;
    return `#${thread}-L${level}x${count}-${seed}`;
  },

  /* ── 1. 시험 설정 화면 ── */
  renderExamSetup(container, onStart){
    const GRADES = {
      '1A':{label:'1학년 1학기',emoji:'🌱',subs:[
        {label:'9까지의 수',thread:'NS1',level:1,desc:'1~9 읽기',
          concept:'1부터 9까지의 수를 세고 읽어요.\n예) 사과 5개 → 오(5)'},
        {label:'모으기 · 가르기',thread:'NS2',level:2,desc:'수 가르기',
          concept:'두 수를 모으거나, 하나의 수를 둘로 가를 수 있어요.\n예) 3과 4를 모으면 7 / 7을 가르면 3과 4'},
        {label:'덧셈 기초',thread:'AD1',level:1,desc:'합 9 이하',
          concept:'두 수를 더해요(+). 합이 9를 넘지 않아요.\n예) 3 + 2 = 5'},
        {label:'뺄셈 기초',thread:'SB1',level:1,desc:'9 이하 뺄셈',
          concept:'큰 수에서 작은 수를 빼요(−).\n예) 7 − 3 = 4'},
      ]},
      '1B':{label:'1학년 2학기',emoji:'🌿',subs:[
        {label:'보수 10 찾기',thread:'NS3',level:2,desc:'더해서 10',
          concept:'더하면 10이 되는 두 수를 찾아요.\n예) 3 + □ = 10  →  □ = 7'},
        {label:'받아올림 덧셈',thread:'AD2',level:1,desc:'합 10 이상',
          concept:'두 수의 합이 10 이상이면 10을 윗 자리로 올려요(받아올림).\n예) 8 + 5 = 13'},
        {label:'세 수 덧셈',thread:'AD2',level:2,desc:'세 수 더하기',
          concept:'세 수를 차례로 더해요. 합이 10이 되는 짝을 먼저 찾으면 빨라요.\n예) 2 + 8 + 4 = 10 + 4 = 14'},
        {label:'몇십 덧셈',thread:'AD4',level:1,desc:'10·20·30 +',
          concept:'10, 20, 30처럼 묶음 단위로 더해요.\n예) 20 + 30 = 50'},
      ]},
      '2A':{label:'2학년 1학기',emoji:'🌷',subs:[
        {label:'(두)+(한) 올림없음',thread:'AD3',level:1,desc:'받아올림 없음',
          concept:'두 자리 수 + 한 자리 수. 일의 자리 합이 9 이하일 때.\n예) 32 + 5 = 37'},
        {label:'(두)+(한) 올림있음',thread:'AD3',level:2,desc:'받아올림',
          concept:'일의 자리 합이 10 이상이면 십의 자리로 올려요.\n예) 37 + 5 = 42  (7+5=12, 1 올림)'},
        {label:'(두)−(한) 내림없음',thread:'SB3',level:1,desc:'받아내림 없음',
          concept:'두 자리 수 − 한 자리 수. 일의 자리가 충분할 때.\n예) 47 − 3 = 44'},
        {label:'(두)−(한) 내림있음',thread:'SB3',level:2,desc:'받아내림',
          concept:'일의 자리가 모자라면 십의 자리에서 10을 빌려요(받아내림).\n예) 43 − 7 = 36  (13−7=6, 십의 자리 1 줄임)'},
      ]},
      '2B':{label:'2학년 2학기',emoji:'🌻',subs:[
        {label:'(두)+(두)',thread:'AD5',level:2,desc:'두 자리 덧셈',
          concept:'두 자리 수끼리 더해요. 받아올림에 주의!\n예) 47 + 36 = 83'},
        {label:'(두)−(두)',thread:'SB4',level:2,desc:'두 자리 뺄셈',
          concept:'두 자리 수끼리 빼요. 받아내림에 주의!\n예) 73 − 48 = 25'},
        {label:'구구단 2·3단',thread:'ML2',level:1,desc:'2단, 3단',
          concept:'같은 수를 여러 번 더하는 것이 곱셈이에요.\n2단: 2×1=2, 2×2=4, 2×3=6 …\n3단: 3×1=3, 3×2=6, 3×3=9 …'},
        {label:'구구단 4·5단',thread:'ML2',level:2,desc:'4단, 5단',
          concept:'4단: 4×1=4, 4×2=8, 4×3=12 …\n5단: 5×1=5, 5×2=10, 5×5=25 …\n5단은 끝자리가 항상 0 또는 5!'},
      ]},
      '3A':{label:'3학년 1학기',emoji:'🌼',subs:[
        {label:'세 자리 덧셈',thread:'AD6',level:2,desc:'3자리+3자리',
          concept:'일→십→백 자리 순서로 더해요. 받아올림이 연속될 수 있어요.\n예) 357 + 486 = 843'},
        {label:'세 자리 뺄셈',thread:'SB6',level:1,desc:'3자리−3자리',
          concept:'일→십→백 자리 순서로 빼요. 모자라면 윗 자리에서 빌려요.\n예) 623 − 358 = 265'},
        {label:'구구단 전체',thread:'ML4',level:1,desc:'2~9단 혼합',
          concept:'2단부터 9단까지 모두 익혀요.\n팁: a×b = b×a (순서를 바꿔도 같아요!)'},
        {label:'나눗셈 기초',thread:'DV2',level:1,desc:'나누어 떨어짐',
          concept:'같은 수씩 나누는 것이 나눗셈이에요.\n예) 12 ÷ 4 = 3  →  4씩 3묶음\n곱셈의 반대로 생각해요: 4 × □ = 12'},
      ]},
      '3B':{label:'3학년 2학기',emoji:'🍀',subs:[
        {label:'구구단 6·7단',thread:'ML3',level:1,desc:'6단, 7단',
          concept:'6단: 6×6=36, 6×7=42, 6×8=48, 6×9=54\n7단: 7×7=49, 7×8=56, 7×9=63\n헷갈리는 것 따로 외워요!'},
        {label:'구구단 8·9단',thread:'ML3',level:2,desc:'8단, 9단',
          concept:'8단: 8×8=64, 8×9=72\n9단 팁: 십의 자리는 1씩 늘고, 일의 자리는 1씩 줄어요.\n예) 9×1=09, 9×2=18, 9×3=27 …'},
        {label:'□ 채우기',thread:'ML4',level:2,desc:'빈칸 인수 찾기',
          concept:'곱셈식의 빈칸을 구구단으로 찾아요.\n예) 3 × □ = 18  →  3단에서 18 찾기  →  □ = 6'},
        {label:'(두)×(한)',thread:'ML6',level:2,desc:'두 자리 곱셈',
          concept:'두 자리 수 × 한 자리 수. 자리를 나눠 곱한 뒤 더해요.\n예) 23 × 4 = (20×4) + (3×4) = 80 + 12 = 92'},
        {label:'나머지 있는 나눗셈',thread:'DV3',level:1,desc:'나머지 있음',
          concept:'나눠도 남는 수가 나머지예요. 나머지 < 나누는 수!\n예) 17 ÷ 5 = 3 … 2  (5×3=15, 17−15=2)'},
      ]},
      '4A':{label:'4학년 1학기',emoji:'🌺',subs:[
        {label:'(세)÷(한) 나머지없음',thread:'DV4',level:1,desc:'나머지 없음',
          concept:'세 자리 수를 한 자리 수로 나눠요. 몫이 딱 떨어져요.\n예) 132 ÷ 4 = 33  (백의 자리부터 차례로 나눔)'},
        {label:'(세)÷(한) 나머지있음',thread:'DV4',level:2,desc:'나머지 있음',
          concept:'나눠도 남는 수(나머지)가 생겨요.\n예) 137 ÷ 4 = 34 … 1  (확인: 4×34+1=137)'},
        {label:'배수 × ÷ 2',thread:'ML1',level:1,desc:'두 배와 반으로',
          concept:'두 배 = ×2, 반 = ÷2\n예) 24의 두 배 = 48 / 24의 반 = 12\n짝수만 반으로 나눌 수 있어요!'},
        {label:'몇백 덧셈',thread:'AD4',level:1,desc:'몇십·몇백 덧셈',
          concept:'100, 200 … 단위의 덧셈.\n예) 300 + 400 = 700\n일, 십 자리가 모두 0이면 백의 자리만 더해요.'},
      ]},
      '4B':{label:'4학년 2학기',emoji:'🍁',subs:[
        {label:'소수 덧·뺄 (1자리)',thread:'DC1',level:1,desc:'소수 한 자리',
          concept:'소수점 아래 한 자리 수의 덧뺄셈.\n소수점끼리 자리를 맞춰 계산해요.\n예) 2.5 + 1.3 = 3.8'},
        {label:'소수 덧·뺄 (2자리)',thread:'DC1',level:2,desc:'소수 두 자리',
          concept:'소수 두 자리까지. 자리를 맞추고, 빈 자리는 0으로 채워요.\n예) 1.24 + 0.36 = 1.60'},
        {label:'분수 덧·뺄 (동분모)',thread:'FR1',level:1,desc:'같은 분모',
          concept:'분모가 같으면 분자끼리만 더하거나 빼요. 분모는 그대로!\n예) 3/7 + 2/7 = 5/7'},
        {label:'보정 빼기 7·8·9',thread:'SB5',level:1,desc:'더 빼고 돌려받기',
          concept:'7, 8, 9로 뺄 때 10을 빼고 나서 모자란 만큼 돌려받아요.\n예) 15 − 8 = 15 − 10 + 2 = 7'},
      ]},
      '5A':{label:'5학년 1학기',emoji:'⭐',subs:[
        {label:'이분모 분수 덧·뺄',thread:'FR4',level:1,desc:'다른 분모 통분',
          concept:'분모가 다르면 통분(공통분모 만들기)을 먼저 해요.\n예) 1/2 + 1/3 = 3/6 + 2/6 = 5/6\n통분: 두 분모의 최소공배수를 찾아요.'},
        {label:'짝 묶어 더하기',thread:'AD8',level:1,desc:'짝 10 묶기',
          concept:'합이 10이 되는 짝을 먼저 묶어 계산해요.\n예) 3 + 7 + 5 + 5 = (3+7) + (5+5) = 10 + 10 = 20'},
        {label:'식 변형 끼리끼리',thread:'SB7',level:1,desc:'같은 자리 묶기',
          concept:'같은 자리 수끼리 먼저 묶어 계산해요.\n예) 24 + 31 = (20+30) + (4+1) = 50 + 5 = 55'},
      ]},
      '5B':{label:'5학년 2학기',emoji:'🌙',subs:[
        {label:'이분모 분수 심화',thread:'FR4',level:1,desc:'다른 분모 통분',
          concept:'대분수도 통분해요. 자연수 부분과 분수 부분을 따로 계산해요.\n예) 1½ + 2⅓ = 1³⁄₆ + 2²⁄₆ = 3⁵⁄₆'},
        {label:'소수 덧·뺄 심화',thread:'DC1',level:2,desc:'소수 두 자리',
          concept:'소수 두 자리의 덧뺄셈 반복 연습.\n받아올림·받아내림에 주의!\n예) 3.47 + 1.85 = 5.32'},
        {label:'10 만들기 전략',thread:'SB7',level:2,desc:'받아올림 그룹화',
          concept:'받아올림을 그룹으로 처리해요.\n예) 19 + 23 → 19를 20으로 올리고 23에서 1을 빼면 20 + 22 = 42'},
      ]},
      '6A':{label:'6학년 1학기',emoji:'🏆',subs:[
        {label:'이분모 분수 종합',thread:'FR4',level:1,desc:'다른 분모 통분',
          concept:'통분 → 분자 계산 → 약분(필요시) 순서를 익혀요.\n예) 2/3 + 3/4 = 8/12 + 9/12 = 17/12 = 1과 5/12'},
        {label:'(세)÷(한) 심화',thread:'DV4',level:2,desc:'나머지 있음',
          concept:'세 자리 ÷ 한 자리. 몫과 나머지를 구하고, 검산으로 확인해요.\n검산: (나누는 수 × 몫) + 나머지 = 나뉘는 수'},
        {label:'보수 100 응용',thread:'NS4',level:2,desc:'더해서 100',
          concept:'더하면 100이 되는 두 수를 찾아요.\n예) 37 + □ = 100  →  □ = 63\n응용: 계산 전략으로 활용!'},
      ]},
      '6B':{label:'6학년 2학기',emoji:'🎓',subs:[
        {label:'분수 종합',thread:'FR1',level:1,desc:'동분모 분수',
          concept:'같은 분모 분수의 덧뺄셈 총정리.\n진분수, 가분수, 대분수 변환도 함께 연습해요.'},
        {label:'이분모 분수 종합',thread:'FR4',level:1,desc:'이분모 분수',
          concept:'다른 분모 분수의 덧뺄셈 총정리.\n통분 → 계산 → 약분/대분수 변환까지 한 번에!'},
        {label:'소수 종합',thread:'DC1',level:2,desc:'소수 두 자리',
          concept:'소수의 덧뺄셈 총정리.\n자리 맞추기, 받아올림·내림, 끝자리 0 처리 모두 확인해요.'},
      ]},
      /* 2026-07-13: 실제 "디딤돌 연산 6B pre중등.pdf"(Drive)를 OCR로 확인한 실제 목차를 그대로 반영.
         이전 버전(소인수분해·GCD·LCM·거듭제곱·제곱근 등)은 교재를 확인하지 않고 임의로 채운 것이었음 — 폐기.
         실제 책은 초등 계산 총정리가 아니라 중학 대수 입문(비례식·방정식·음수)이며, 표 완성형 비례식
         문제와 등식의 성질을 이용한 방정식 풀이 문제는 기존 NM_TGEN에 대응하는 생성기가 없어
         온라인/인쇄 문제를 만들어낼 수 없음. 없는 걸 있는 척 다른 스레드로 억지로 채우지 않고
         comingSoon으로 명시 — 실제 목차만 보여주고 생성기가 준비되면 thread/level을 채울 것.*/
      'PRE':{label:'예비 중등',emoji:'🚀',subs:[
        {label:'정비례와 반비례',desc:'대응 관계 표',comingSoon:true,
          concept:'두 수 x, y가 있을 때\n· 정비례: x가 2배, 3배… 되면 y도 2배, 3배… 돼요. (y = 정해진 수 × x)\n· 반비례: x가 2배, 3배… 되면 y는 배, 배… 돼요. (x × y = 정해진 수)\n예) 세발자전거 수와 전체 바퀴 수 → 정비례 / 넓이가 일정한 직사각형의 가로·세로 → 반비례'},
        {label:'덧셈·뺄셈 방정식',desc:'등식의 성질',comingSoon:true,
          concept:'모르는 수 x가 있는 등식을 방정식이라 해요.\n등식의 양쪽에 같은 수를 더하거나 빼도 등식은 그대로 성립해요.\n예) x − 9 = 12 → 양쪽에 9를 더하면 x = 21'},
        {label:'곱셈·나눗셈 방정식',desc:'등식의 성질',comingSoon:true,
          concept:'등식의 양쪽에 같은 수를 곱하거나(0이 아닌 수로) 나누어도 등식은 그대로 성립해요.\n예) x ÷ 5 = 20 → 양쪽에 5를 곱하면 x = 100'},
        {label:'혼합 방정식',desc:'×,+,− / ÷,+,−',comingSoon:true,
          concept:'x×(수)나 x÷(수)를 한 덩어리로 먼저 구한 다음 x를 구해요.\n예) x×4+5=17 → x×4=12 → x=3'},
        {label:'정수와 유리수',desc:'음수·수직선',comingSoon:true,
          concept:'0보다 작은 수(음수)를 포함한 정수·유리수를 수직선 위에서 비교해요.\n절댓값: 수직선에서 0으로부터 떨어진 거리.\n예) -3의 절댓값은 3'},
      ]},
    };
    const GRADE_ORDER = ['1A','1B','2A','2B','3A','3B','4A','4B','5A','5B','6A','6B','PRE'];
    const threads = window.NM_THREADS || {};
    const COUNT_OPTS = [10, 20, 30, 50];

    function showSectionPick(){
      container.innerHTML = `
<div class="nm-ex-sec-wrap">
  <h2 class="nm-ex-sec-title">📝 학습지 / Exam</h2>
  <p class="nm-ex-sec-sub">어떤 방식으로 공부할까요?</p>
  <div class="nm-ex-sec-row">
    <button class="nm-ex-sec-card" data-sec="grade">
      <div class="nm-ex-sec-emo">📚</div>
      <div class="nm-ex-sec-name">교과 연산 연습</div>
      <div class="nm-ex-sec-desc">1A ~ 6B 학기별 주제 선택</div>
    </button>
    <button class="nm-ex-sec-card" data-sec="magic">
      <div class="nm-ex-sec-emo">✨</div>
      <div class="nm-ex-sec-name">수의 마법 탐험</div>
      <div class="nm-ex-sec-desc">스레드 직접 선택</div>
    </button>
  </div>
</div>`;
      container.querySelector('[data-sec="grade"]').addEventListener('click', showGradePick);
      container.querySelector('[data-sec="magic"]').addEventListener('click', showMagicForm);
    }

    /* ── 과정(영역)별 코스 구성: GRADES에서 스레드 접두사로 묶어 파생 ── */
    const COURSE_DEFS = [
      {key:'AD', emoji:'➕', label:'덧셈',        desc:'한 자리부터 네 자리까지'},
      {key:'SB', emoji:'➖', label:'뺄셈',        desc:'받아내림·보정 빼기'},
      {key:'ML', emoji:'✖️', label:'곱셈',        desc:'구구단부터 거듭제곱까지'},
      {key:'DV', emoji:'➗', label:'나눗셈',      desc:'나머지·약수·소인수분해'},
      {key:'FR', emoji:'🍕', label:'분수',        desc:'동분모부터 곱나눗셈까지'},
      {key:'DC', emoji:'🔢', label:'소수',        desc:'덧뺄셈·곱나눗셈'},
      {key:'NS', emoji:'🎲', label:'수 감각',     desc:'모으기·가르기·보수'},
      {key:'MX', emoji:'🧩', label:'혼합·중등 준비', desc:'혼합계산·제곱근·비율'},
    ];
    function buildCourse(prefix){
      const items = [], seen = {};
      GRADE_ORDER.forEach(gk => {
        GRADES[gk].subs.forEach(s => {
          if(!s.thread || !s.thread.startsWith(prefix)) return;
          const id = s.thread + '-L' + s.level;
          if(seen[id]) return;
          seen[id] = true;
          items.push(Object.assign({}, s, {grade:gk}));
        });
      });
      return items;
    }

    let pickMode = 'grade'; // 'grade' | 'course'

    function showGradePick(){
      const isGrade = pickMode==='grade';
      container.innerHTML = `
<div class="nm-ex-form-wrap">
  <div class="nm-ex-form-head">
    <button class="nm-ex-back-btn" id="nm-ex-back-grade">← 뒤로</button>
    <span class="nm-ex-form-title">교과 연산 연습</span>
    <div class="nm-ws-tabs nm-ex-mode-tabs">
      <button class="nm-ws-tab${isGrade?' active':''}" data-mode="grade">학년·학기별</button>
      <button class="nm-ws-tab${!isGrade?' active':''}" data-mode="course">과정별</button>
    </div>
  </div>
  <div class="nm-ex-form-body">
    ${isGrade ? `
    <div class="nm-ex-grade-grid">
      ${GRADE_ORDER.map(g => `
      <button class="nm-ex-grade-btn${g==='PRE'?' nm-ex-grade-pre':''}" data-grade="${g}">
        <span class="nm-ex-grade-key">${GRADES[g].emoji} ${g==='PRE'?'Pre':g}</span>
        <span class="nm-ex-grade-sub">${GRADES[g].label}</span>
      </button>`).join('')}
    </div>` : `
    <div class="nm-ex-grade-grid nm-ex-course-grid">
      ${COURSE_DEFS.map(c => `
      <button class="nm-ex-grade-btn" data-course="${c.key}">
        <span class="nm-ex-grade-key">${c.emoji} ${c.label}</span>
        <span class="nm-ex-grade-sub">${c.desc}</span>
      </button>`).join('')}
    </div>`}
  </div>
</div>`;
      container.querySelector('#nm-ex-back-grade').addEventListener('click', showSectionPick);
      container.querySelectorAll('.nm-ex-mode-tabs .nm-ws-tab').forEach(btn => {
        btn.addEventListener('click', () => { pickMode = btn.dataset.mode; showGradePick(); });
      });
      container.querySelectorAll('[data-grade]').forEach(btn => {
        btn.addEventListener('click', () => {
          const g = GRADES[btn.dataset.grade];
          showTopics({
            title: `${g.emoji} ${btn.dataset.grade==='PRE'?'':btn.dataset.grade+' — '}${g.label}`,
            subs: g.subs,
          });
        });
      });
      container.querySelectorAll('[data-course]').forEach(btn => {
        btn.addEventListener('click', () => {
          const c = COURSE_DEFS.find(x => x.key===btn.dataset.course);
          showTopics({
            title: `${c.emoji} ${c.label} 과정`,
            subs: buildCourse(c.key),
            showGrade: true,
          });
        });
      });
    }

    /* ── 주제 선택 화면 (학년별·과정별 공용) ──
       문항 수 + 유형(숫자/문장제) + 하단 실시간 미리보기 */
    const WORD_OPTS = [
      {key:'none', label:'숫자 연산'},
      {key:'mix',  label:'문장제 섞기'},
      {key:'all',  label:'문장제만'},
    ];
    function showTopics(opts){
      const subs = opts.subs;
      let selIdx = 0;
      let chosenCount = 20;
      let wordType = 'none';
      let previewSeed = NM_RNG.newCode();

      function makeConfig(){
        const sub = subs[selIdx];
        return {
          thread:   sub.thread,
          level:    sub.level,
          count:    chosenCount,
          timer:    0,
          seed:     NM_RNG.newCode(),
          layout:   'grid',
          label:    sub.label,
          concept:  sub.concept || '',
          wordType: wordType,
        };
      }

      function previewCells(){
        const sub = subs[selIdx];
        const nSeed = NM_RNG.hashSeed(previewSeed);
        const probs = buildProblems(sub.thread, sub.level, 4, nSeed);
        applyWordProblems(probs, wordType, nSeed);
        return probs.map((p,i) => {
          let inner;
          if(p.word){
            inner = `<div class="nm-vp-word nm-vp-word-sm">${esc(p.word)}</div>`;
          } else {
            const v = parseVert(p.tex);
            inner = v
              ? `<div class="nm-vp nm-vp-sm">
                   <div class="nm-vp-row nm-vp-top">${esc(v.a)}</div>
                   <div class="nm-vp-row nm-vp-mid"><span class="nm-vp-op">${esc(v.op)}</span><span class="nm-vp-b">${esc(v.b)}</span></div>
                   <div class="nm-vp-line"></div>
                   <div class="nm-vp-row nm-vp-bot">&nbsp;</div>
                 </div>`
              : `<div class="nm-vp-tex" data-tex="${esc(p.tex||'')}"></div>`;
          }
          return `<div class="nm-ws-cell nm-ws-cell-sm${p.word?' nm-ws-wide':''}">
            <span class="nm-ws-cnum">${circled(i+1)}</span>${inner}
          </div>`;
        }).join('');
      }

      function render(){
        const sub = subs[selIdx];
        const isComingSoon = !!sub.comingSoon;
        const bodyHtml = isComingSoon ? `
    <div class="nm-ex-comingsoon">
      <div class="nm-ex-comingsoon-badge">🚧 문제 생성기 준비 중</div>
      <p class="nm-ex-comingsoon-desc">실제 교재 목차를 확인해 주제명은 정확하지만,
        이 단원은 아직 문제를 자동으로 만드는 생성기가 없어서 온라인/인쇄 문제를 낼 수 없어요.
        아래는 이 단원에서 배우는 내용이에요.</p>
      <div class="nm-grid-concept-body nm-ex-comingsoon-concept">${esc(sub.concept||'').replace(/\n/g,'<br>')}</div>
    </div>` : `
    <p class="nm-ex-label" style="margin-top:18px">문항 수</p>
    <div class="nm-ex-count-btns">
      ${COUNT_OPTS.map(n => `<button class="nm-ex-cnt-btn${n===chosenCount?' sel':''}" data-n="${n}">${n}문항</button>`).join('')}
    </div>
    <p class="nm-ex-label" style="margin-top:18px">문제 유형</p>
    <div class="nm-ex-count-btns">
      ${WORD_OPTS.map(w => `<button class="nm-ex-cnt-btn${w.key===wordType?' sel':''}" data-w="${w.key}">${w.label}</button>`).join('')}
    </div>
    <div class="nm-ex-actions" style="margin-top:22px">
      <button id="nm-ex-grid-start" class="nm-ex-btn-primary">▶ 온라인으로 풀기</button>
      <button id="nm-ex-print-start" class="nm-ex-btn-secondary">🖨️ 인쇄하여 풀기</button>
    </div>
    <div class="nm-ex-preview">
      <div class="nm-ex-preview-hd">
        <span class="nm-ex-label" style="margin:0">👀 미리보기</span>
        <button id="nm-ex-preview-dice" class="nm-ex-btn-ghost">🎲 다른 문제</button>
      </div>
      <div class="nm-ws-grid nm-ws-grid-preview">${previewCells()}</div>
    </div>`;

        container.innerHTML = `
<div class="nm-ex-form-wrap">
  <div class="nm-ex-form-head">
    <button class="nm-ex-back-btn" id="nm-ex-back-topics">← 뒤로</button>
    <span class="nm-ex-form-title">${opts.title}</span>
  </div>
  <div class="nm-ex-form-body">
    <p class="nm-ex-label">주제 선택</p>
    <div class="nm-ex-grade-topics">
      ${subs.map((s,i) => `
      <button class="nm-ex-topic-chip${i===selIdx?' nm-ex-topic-sel':''}${s.comingSoon?' nm-ex-topic-soon':''}" data-idx="${i}">
        ${opts.showGrade && s.grade ? `<span class="nm-ex-tchip-grade">${s.grade==='PRE'?'Pre':s.grade}</span>` : ''}
        <span class="nm-ex-tchip-name">${esc(s.label)}</span>
        <span class="nm-ex-tchip-desc">${s.comingSoon?'🚧 준비중':esc(s.desc)}</span>
      </button>`).join('')}
    </div>
    ${bodyHtml}
  </div>
</div>`;

        container.querySelectorAll('.nm-vp-tex').forEach(el => renderKaTeX(el.dataset.tex||'', el));

        container.querySelector('#nm-ex-back-topics').addEventListener('click', showGradePick);

        container.querySelectorAll('.nm-ex-topic-chip').forEach(chip => {
          chip.addEventListener('click', () => { selIdx = parseInt(chip.dataset.idx); render(); });
        });

        if(isComingSoon) return;

        container.querySelectorAll('[data-n]').forEach(btn => {
          btn.addEventListener('click', () => { chosenCount = parseInt(btn.dataset.n); render(); });
        });
        container.querySelectorAll('[data-w]').forEach(btn => {
          btn.addEventListener('click', () => { wordType = btn.dataset.w; render(); });
        });
        container.querySelector('#nm-ex-preview-dice').addEventListener('click', () => {
          previewSeed = NM_RNG.newCode(); render();
        });

        container.querySelector('#nm-ex-grid-start').addEventListener('click', () => {
          onStart && onStart(makeConfig());
        });
        container.querySelector('#nm-ex-print-start').addEventListener('click', () => {
          NM_EXAM.renderPrint(makeConfig());
        });
      }
      render();
    }

    function showMagicForm(){
      const threadKeys = Object.keys(threads);
      let currentSeed = NM_RNG.newCode();

      function refreshLevels(){
        const t = threads[threadSel.value] || {};
        levelSel.innerHTML = (t.levels || [{id:1,label:{ko:'기본'}}]).map(l =>
          `<option value="${l.id}">${l.id} — ${esc((l.label||{}).ko||'')}</option>`
        ).join('');
        refreshCode();
      }
      function refreshCode(){
        codePreview.textContent = NM_EXAM.worksheetCode({
          thread: threadSel.value,
          level:  parseInt(levelSel.value)||1,
          count:  parseInt(container.querySelector('#nm-ex-count').value)||20,
          seed:   currentSeed,
        });
      }
      function getConfig(){
        return {
          thread: threadSel.value,
          level:  parseInt(levelSel.value)||1,
          count:  parseInt(container.querySelector('#nm-ex-count').value)||20,
          timer:  0,
          seed:   currentSeed,
          layout: 'grid',
          label:  threadSel.value,
        };
      }

      container.innerHTML = `
<div class="nm-ex-form-wrap">
  <div class="nm-ex-form-head">
    <button class="nm-ex-back-btn" id="nm-ex-back-magic">← 뒤로</button>
    <span class="nm-ex-form-title">✨ 수의 마법 탐험</span>
  </div>
  <div class="nm-ex-form-body">
    <div class="nm-ex-form-row">
      <label class="nm-ex-label">스레드</label>
      <select class="nm-ex-select" id="nm-ex-thread">
        ${threadKeys.map(k=>`<option value="${k}">${k} — ${esc((threads[k].name||{}).ko||k)}</option>`).join('')}
      </select>
    </div>
    <div class="nm-ex-form-row">
      <label class="nm-ex-label">레벨</label>
      <select class="nm-ex-select" id="nm-ex-level"></select>
    </div>
    <div class="nm-ex-form-row">
      <label class="nm-ex-label">문항 수</label>
      <select class="nm-ex-select" id="nm-ex-count">
        ${[10,15,20,25,30,40,50].map(n=>`<option value="${n}"${n===20?' selected':''}>${n}</option>`).join('')}
      </select>
    </div>
    <div class="nm-ex-code-row">
      코드: <code id="nm-ex-code-preview"></code>
      <button id="nm-ex-new-seed" class="nm-ex-btn-ghost">🎲 새 코드</button>
    </div>
    <div class="nm-ex-actions">
      <button id="nm-ex-start" class="nm-ex-btn-primary">▶ 학습지 시작</button>
      <button id="nm-ex-print" class="nm-ex-btn-secondary">🖨️ 인쇄</button>
    </div>
  </div>
</div>`;

      const threadSel   = container.querySelector('#nm-ex-thread');
      const levelSel    = container.querySelector('#nm-ex-level');
      const codePreview = container.querySelector('#nm-ex-code-preview');

      container.querySelector('#nm-ex-back-magic').addEventListener('click', showSectionPick);
      threadSel.addEventListener('change', refreshLevels);
      levelSel.addEventListener('change', refreshCode);
      container.querySelector('#nm-ex-count').addEventListener('change', refreshCode);
      container.querySelector('#nm-ex-new-seed').addEventListener('click', () => {
        currentSeed = NM_RNG.newCode(); refreshCode();
      });
      container.querySelector('#nm-ex-start').addEventListener('click', () => {
        onStart && onStart(getConfig());
      });
      container.querySelector('#nm-ex-print').addEventListener('click', () => {
        NM_EXAM.renderPrint(getConfig());
      });

      refreshLevels();
    }

    showSectionPick();
  },

  /* ── 2. 시험 실행 (순차) ── */
  runExam(config, container, onDone){
    const { thread, level, count, timer, seed } = config;
    const numericSeed = NM_RNG.hashSeed(seed);
    const problems = buildProblems(thread, level, count, numericSeed);
    const answers  = new Array(count).fill(null);
    let current    = 0;
    let startTime  = Date.now();
    let timerInterval = null;
    let timeLeft   = timer > 0 ? timer : Infinity;

    function render(){
      const p = problems[current];
      const pct = Math.round(((current)/count)*100);
      container.innerHTML = `
<div class="nm-exam-run">
  <div class="nm-exam-header">
    <div class="nm-exam-progress">
      <div class="nm-progress-bar" style="width:${pct}%"></div>
    </div>
    <div class="nm-exam-info">
      <span class="nm-q-counter">${current+1} / ${count}</span>
      ${timer>0?`<span class="nm-timer" id="nm-ex-timer-disp">⏱ ${fmtTime(timeLeft)}</span>`:''}
    </div>
  </div>
  <div class="nm-exam-question">
    <div class="nm-q-tex" id="nm-ex-qtex"></div>
    ${(p.prompt && p.prompt.ko) ? `<p class="nm-q-hint">${esc(p.prompt.ko)}</p>` : ''}
  </div>
  <div class="nm-exam-input">
    <input id="nm-ex-ans" type="number" placeholder="답 / Answer" autocomplete="off"
           style="font-size:1.4em;width:120px;text-align:center;padding:8px">
    <button id="nm-ex-submit" class="nm-btn nm-btn-primary" style="margin-left:8px">확인 ✓</button>
  </div>
  <div class="nm-exam-nav">
    <button id="nm-ex-prev" class="nm-btn nm-btn-small" ${current===0?'disabled':''}>← 이전</button>
    <button id="nm-ex-skip" class="nm-btn nm-btn-small">건너뛰기 →</button>
  </div>
</div>`;

      renderKaTeX((p.tex||''), $('#nm-ex-qtex', container));

      const input = $('#nm-ex-ans', container);
      if(answers[current] !== null){ input.value = answers[current]; }
      input.focus();

      $('#nm-ex-submit', container).addEventListener('click', submitAnswer);
      input.addEventListener('keydown', e => { if(e.key==='Enter') submitAnswer(); });
      $('#nm-ex-prev',   container).addEventListener('click', () => { current--; render(); });
      $('#nm-ex-skip',   container).addEventListener('click', () => { current++; if(current>=count) finish(); else render(); });
    }

    function submitAnswer(){
      const v = parseInt($('#nm-ex-ans', container).value);
      if(!isNaN(v)){ answers[current] = v; }
      current++;
      if(current >= count){ finish(); }
      else { render(); }
    }

    function finish(){
      clearInterval(timerInterval);
      const elapsed = Math.round((Date.now()-startTime)/1000);
      let score = 0;
      problems.forEach((p,i)=>{ if(answers[i]===p.answer) score++; });
      onDone && onDone({ score, total:count, time:elapsed, problems, answers, seed, thread, level });
    }

    function fmtTime(s){
      if(!isFinite(s)) return '';
      const m=Math.floor(s/60), sec=s%60;
      return `${m}:${String(sec).padStart(2,'0')}`;
    }

    if(timer > 0){
      timerInterval = setInterval(()=>{
        timeLeft--;
        const el = document.getElementById('nm-ex-timer-disp');
        if(el) el.textContent = `⏱ ${fmtTime(timeLeft)}`;
        if(timeLeft <= 0){ clearInterval(timerInterval); finish(); }
      }, 1000);
    }

    render();
  },

  /* ── 3. 결과 화면 ── */
  renderResult(result, container, onReplay){
    const { score, total, time, problems, answers, seed, thread, level } = result;
    const pct = Math.round(score/total*100);
    const passed = pct >= 80;
    const m = Math.floor(time/60), sec = time%60;

    const wrongs = problems.map((p,i)=>({p,i,myAns:answers[i]}))
                           .filter(x=>x.myAns !== x.p.answer);

    container.innerHTML = `
<div class="nm-exam-result">
  <div class="nm-result-score ${passed?'nm-pass':'nm-fail'}">
    <div class="nm-score-num">${score} / ${total}</div>
    <div class="nm-score-pct">${pct}%</div>
    <div class="nm-score-label">${passed?'✅ 통과! Pass!':'❌ 재시험 Retry'}</div>
    <div class="nm-score-time">⏱ ${m}:${String(sec).padStart(2,'0')}</div>
  </div>
  ${wrongs.length===0 ? '<p class="nm-result-perfect">🎉 전부 맞혔어요! Perfect score!</p>' : `
  <div class="nm-result-wrongs">
    <h3>오답 목록 / Wrong Answers</h3>
    <table class="nm-result-table">
      <thead><tr><th>#</th><th>문제</th><th>내 답</th><th>정답</th></tr></thead>
      <tbody>
        ${wrongs.map(w=>`<tr>
          <td>${w.i+1}</td>
          <td class="nm-rtex" data-tex="${esc(w.p.tex||'')}"></td>
          <td class="nm-wrong-ans">${w.myAns??'—'}</td>
          <td class="nm-correct-ans">${w.p.answer}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`}
  <div class="nm-result-actions">
    <button id="nm-res-retry-wrong" class="nm-btn nm-btn-primary" ${wrongs.length===0?'disabled':''}>
      📖 오답만 다시
    </button>
    <button id="nm-res-new" class="nm-btn nm-btn-secondary">🎲 새 시험</button>
    <button id="nm-res-print" class="nm-btn nm-btn-secondary">🖨️ 학습지 인쇄</button>
  </div>
  <div class="nm-result-code">학습지 코드: <code>${NM_EXAM.worksheetCode({thread,level,count:total,seed})}</code></div>
</div>`;

    $$('.nm-rtex', container).forEach(el => {
      renderKaTeX(el.dataset.tex || '', el);
    });

    $('#nm-res-new', container).addEventListener('click', () => {
      onReplay && onReplay({mode:'new', thread, level, count:total});
    });

    $('#nm-res-print', container).addEventListener('click', () => {
      NM_EXAM.renderPrint({thread, level, count:total, seed});
    });

    $('#nm-res-retry-wrong', container).addEventListener('click', () => {
      if(wrongs.length===0) return;
      onReplay && onReplay({mode:'wrongs', wrongs, thread, level});
    });
  },

  /* ── 4. 인쇄 학습지 ── */
  renderPrint(config){
    const { thread, level, count, seed, wordType } = config;
    const numericSeed = NM_RNG.hashSeed(seed);
    const problems = buildProblems(thread, level, count, numericSeed);
    applyWordProblems(problems, wordType, numericSeed);
    const code = NM_EXAM.worksheetCode(config);

    const old = document.querySelector('.nm-print-sheet');
    if(old) old.remove();

    const sheet = document.createElement('div');
    sheet.className = 'nm-print-sheet';
    sheet.setAttribute('aria-hidden', 'true');

    const th = (window.NM_THREADS || {})[thread] || {};
    const thName = (th.name||{}).ko || thread;

    sheet.innerHTML = `
<div class="nm-print-header">
  <h2 style="margin:0">Numbers of Magic — ${esc(thName)} 학습지</h2>
  <div style="display:flex;gap:24px;margin-top:8px;font-size:0.9em">
    <span>이름: <span style="display:inline-block;width:120px;border-bottom:1px solid #000">&nbsp;</span></span>
    <span>날짜: <span style="display:inline-block;width:100px;border-bottom:1px solid #000">&nbsp;</span></span>
    <span>점수: <span style="display:inline-block;width:60px;border-bottom:1px solid #000">&nbsp;</span> / ${count}</span>
    <span style="margin-left:auto;font-family:monospace;font-size:0.85em">${esc(code)}</span>
  </div>
</div>
<div class="nm-print-grid" id="nm-print-problems"></div>
<div class="nm-print-answer-key">
  <h3 style="margin:0 0 8px 0">정답지 / Answer Key — <span style="font-family:monospace;font-size:0.85em">${esc(code)}</span></h3>
  <div class="nm-ak-grid" id="nm-print-answers"></div>
</div>`;

    document.body.appendChild(sheet);

    const problemGrid  = sheet.querySelector('#nm-print-problems');
    const answerGrid   = sheet.querySelector('#nm-print-answers');

    problems.forEach((p, i) => {
      const card = document.createElement('div');
      card.className = 'nm-print-item';
      const numEl  = document.createElement('div');
      numEl.className = 'nm-q-num';
      numEl.textContent = `${i+1}.`;
      const texEl = document.createElement('div');
      texEl.className  = 'nm-q-tex';
      card.appendChild(numEl);
      card.appendChild(texEl);
      if(p.word){
        texEl.textContent = p.word;
        const blank = document.createElement('div');
        blank.textContent = '답: __________';
        blank.style.marginTop = '6px';
        card.appendChild(blank);
      } else {
        renderKaTeX(p.tex || '', texEl);
      }
      problemGrid.appendChild(card);

      const ak = document.createElement('div');
      ak.className = 'nm-ak-item';
      ak.textContent = `${i+1}. ${p.answer}`;
      answerGrid.appendChild(ak);
    });

    setTimeout(() => { window.print(); }, 350);
  }

}; // end NM_EXAM

window.NM_EXAM = NM_EXAM;

/* ── 전역 진입 함수 (main.js에서 호출) ── */
window.examScreen = function(container){
  if(!container){ container = document.getElementById('nm-main') || document.body; }
  container.innerHTML = '';

  function showSetup(){
    container.innerHTML = '';
    NM_EXAM.renderExamSetup(container, cfg => showExam(cfg));
  }

  /* ── 그리드 학습지 (11math 스타일) ── */
  function runGridExam(cfg){
    const { thread, level, count, seed, label, concept, wordType } = cfg;
    const numericSeed = NM_RNG.hashSeed(seed);
    const problems = buildProblems(thread, level, count, numericSeed);
    applyWordProblems(problems, wordType, numericSeed);
    const code = NM_EXAM.worksheetCode(cfg);
    const userAnswers = new Array(count).fill('');
    let activeTab = 'problems'; // 'problems' | 'answers'
    let graded = false;
    let gradeScore = 0;

    /* 문제 셀 HTML 생성 */
    function cellHtml(p, i, mode){
      // mode: 'online' | 'blank' | 'answer'
      const v = p.word ? null : parseVert(p.tex);
      const num = circled(i+1);
      let inner;
      let wide = false;
      if(p.word){
        wide = true;
        let ansRow;
        if(mode==='online'){
          ansRow = `<input class="nm-vp-inp nm-vp-inp-sm" type="number" inputmode="numeric" data-idx="${i}" autocomplete="off" placeholder="답">`;
        } else if(mode==='answer'){
          ansRow = `<span class="nm-vp-ans-val">${p.answer}</span>`;
        } else {
          ansRow = `<span class="nm-vp-blank">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>`;
        }
        inner = `<div class="nm-vp-wordwrap">
  <div class="nm-vp-word">${esc(p.word)}</div>
  <div class="nm-vp-word-ans">${ansRow}</div>
</div>`;
      } else if(v){
        let ansRow;
        if(mode==='online'){
          ansRow = `<input class="nm-vp-inp" type="number" inputmode="numeric" data-idx="${i}" autocomplete="off">`;
        } else if(mode==='answer'){
          ansRow = `<span class="nm-vp-ans-val">${p.answer}</span>`;
        } else {
          ansRow = `<span class="nm-vp-blank">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>`;
        }
        inner = `<div class="nm-vp">
  <div class="nm-vp-row nm-vp-top">${esc(v.a)}</div>
  <div class="nm-vp-row nm-vp-mid"><span class="nm-vp-op">${esc(v.op)}</span><span class="nm-vp-b">${esc(v.b)}</span></div>
  <div class="nm-vp-line"></div>
  <div class="nm-vp-row nm-vp-bot">${ansRow}</div>
</div>`;
      } else {
        /* 세로셈 불가 → 인라인 KaTeX */
        let ansRow;
        if(mode==='online'){
          ansRow = `<input class="nm-vp-inp nm-vp-inp-sm" type="number" inputmode="numeric" data-idx="${i}" autocomplete="off" placeholder="?">`;
        } else if(mode==='answer'){
          ansRow = `<span class="nm-vp-ans-val">${p.answer}</span>`;
        } else {
          ansRow = '';
        }
        inner = `<div class="nm-vp-inline">
  <div class="nm-vp-tex" data-tex="${esc(p.tex||'')}"></div>
  ${ansRow}
</div>`;
      }
      const stateClass = graded && mode==='online'
        ? (parseFloat(userAnswers[i])===p.answer ? ' nm-ws-ok' : (userAnswers[i]!=='' ? ' nm-ws-err' : ''))
        : '';
      return `<div class="nm-ws-cell${wide?' nm-ws-wide':''}${stateClass}" data-ci="${i}">
  <span class="nm-ws-cnum">${num}</span>
  ${inner}
</div>`;
    }

    function render(){
      const mode = activeTab==='answers' ? 'answer' : 'online';
      const conceptHtml = (concept && activeTab==='problems')
        ? `<details class="nm-grid-concept">
             <summary class="nm-grid-concept-sum">📖 개념 보기</summary>
             <div class="nm-grid-concept-body">${esc(concept).replace(/\n/g,'<br>')}</div>
           </details>`
        : '';
      const scoreHtml = graded && activeTab==='problems'
        ? `<div class="nm-grid-score ${gradeScore/count>=0.8?'nm-grid-pass':'nm-grid-fail'}">${gradeScore}/${count} (${Math.round(gradeScore/count*100)}%)</div>`
        : '';

      container.innerHTML = `
<div class="nm-ws-wrap">
  <div class="nm-ws-hd">
    <div class="nm-ws-hd-left">
      <span class="nm-grid-badge">${esc(label||thread)}</span>
      <span class="nm-grid-code">${esc(code)}</span>
    </div>
    <div class="nm-ws-tabs">
      <button class="nm-ws-tab${activeTab==='problems'?' active':''}" data-tab="problems">문제지</button>
      <button class="nm-ws-tab${activeTab==='answers'?' active':''}" data-tab="answers">정답지</button>
    </div>
  </div>
  ${conceptHtml}
  <div class="nm-ws-grid">
    ${problems.map((p,i)=>cellHtml(p,i,mode)).join('')}
  </div>
  <div class="nm-ws-foot">
    ${scoreHtml}
    ${activeTab==='problems'&&!graded ? '<button id="nm-ws-grade" class="nm-ex-btn-primary">채점하기 ✓</button>' : ''}
    ${activeTab==='problems'&&graded ? '<button id="nm-ws-again" class="nm-ex-btn-primary">계속 연습 🔄</button>' : ''}
    <button id="nm-ws-print" class="nm-ex-btn-secondary">🖨️ 출력하기</button>
    <button id="nm-ws-new" class="nm-ex-btn-secondary">다른 문제지</button>
    <button id="nm-ws-back" class="nm-ex-btn-ghost">← 주제 바꾸기</button>
  </div>
</div>`;

      /* KaTeX 인라인 렌더 */
      container.querySelectorAll('.nm-vp-tex').forEach(el => renderKaTeX(el.dataset.tex||'', el));

      /* 입력값 복원 + Enter 이동 */
      const inps = [...container.querySelectorAll('.nm-vp-inp')];
      inps.forEach((inp,idx_) => {
        const idx = parseInt(inp.dataset.idx);
        if(userAnswers[idx]!=='') inp.value = userAnswers[idx];
        inp.addEventListener('input', ()=>{ userAnswers[idx]=inp.value; });
        inp.addEventListener('keydown', e=>{
          if(e.key==='Enter'){ const nx=inps[inps.indexOf(inp)+1]; if(nx) nx.focus(); }
        });
      });

      /* 탭 전환 */
      container.querySelectorAll('.nm-ws-tab').forEach(btn=>{
        btn.addEventListener('click', ()=>{
          activeTab = btn.dataset.tab;
          render();
        });
      });

      /* 채점 */
      const gradeBtn = container.querySelector('#nm-ws-grade');
      if(gradeBtn) gradeBtn.addEventListener('click', ()=>{
        graded = true; gradeScore = 0;
        problems.forEach((p,i)=>{ if(parseFloat(userAnswers[i])===p.answer) gradeScore++; });
        render();
      });

      /* 계속 연습 */
      const againBtn = container.querySelector('#nm-ws-again');
      if(againBtn) againBtn.addEventListener('click', ()=>runGridExam({...cfg, seed:NM_RNG.newCode()}));

      /* 출력 */
      container.querySelector('#nm-ws-print').addEventListener('click', ()=>printWorksheet());

      /* 다른 문제지 */
      container.querySelector('#nm-ws-new').addEventListener('click', ()=>runGridExam({...cfg, seed:NM_RNG.newCode()}));

      /* 주제 바꾸기 */
      container.querySelector('#nm-ws-back').addEventListener('click', showSetup);
    }

    function printWorksheet(){
      const old = document.querySelector('.nm-print-sheet');
      if(old) old.remove();
      const sheet = document.createElement('div');
      sheet.className = 'nm-print-sheet';
      sheet.setAttribute('aria-hidden','true');
      sheet.innerHTML = `
<div class="nm-print-header">
  <h2 style="margin:0;font-size:16px">${esc(label||thread)} 연산 학습지</h2>
  <div style="display:flex;gap:20px;margin-top:6px;font-size:12px">
    <span>이름: <span style="display:inline-block;width:100px;border-bottom:1px solid #000">&nbsp;</span></span>
    <span>날짜: <span style="display:inline-block;width:80px;border-bottom:1px solid #000">&nbsp;</span></span>
    <span>점수: <span style="display:inline-block;width:50px;border-bottom:1px solid #000">&nbsp;</span> / ${count}</span>
    <span style="margin-left:auto;font-family:monospace;font-size:11px">${esc(code)}</span>
  </div>
</div>
<div class="nm-print-ws-grid" id="nm-pw-probs"></div>
<div class="nm-print-answer-key">
  <h3 style="margin:0 0 6px;font-size:13px">정답지 — <span style="font-family:monospace;font-size:11px">${esc(code)}</span></h3>
  <div class="nm-print-ak-grid" id="nm-pw-aks"></div>
</div>`;
      document.body.appendChild(sheet);

      const probGrid = sheet.querySelector('#nm-pw-probs');
      const akGrid   = sheet.querySelector('#nm-pw-aks');

      problems.forEach((p,i)=>{
        const v = p.word ? null : parseVert(p.tex);
        const cell = document.createElement('div');
        cell.className = 'nm-print-ws-cell';
        if(p.word){
          cell.className += ' nm-print-ws-wide';
          cell.innerHTML = `<span class="nm-print-cnum">${circled(i+1)}</span>
<div class="nm-print-word">${esc(p.word)}</div>
<div class="nm-print-word-blank">답: __________</div>`;
        } else if(v){
          cell.innerHTML = `<span class="nm-print-cnum">${circled(i+1)}</span>
<div class="nm-print-vp">
  <div class="nm-print-vp-top">${esc(v.a)}</div>
  <div class="nm-print-vp-mid"><span class="nm-print-vp-op">${esc(v.op)}</span>${esc(v.b)}</div>
  <div class="nm-print-vp-line"></div>
  <div class="nm-print-vp-bot">&nbsp;</div>
</div>`;
        } else {
          const texEl = document.createElement('div');
          texEl.className = 'nm-vp-tex';
          renderKaTeX(p.tex||'', texEl);
          cell.innerHTML = `<span class="nm-print-cnum">${circled(i+1)}</span>`;
          cell.appendChild(texEl);
        }
        probGrid.appendChild(cell);

        const ak = document.createElement('div');
        ak.className = 'nm-print-ak-item';
        ak.textContent = `${circled(i+1)} ${p.answer}`;
        akGrid.appendChild(ak);
      });

      setTimeout(()=>window.print(), 350);
    }

    render();
  }

  function showExam(cfg){
    container.innerHTML = '';
    if(cfg.layout === 'grid'){ runGridExam(cfg); }
    else { NM_EXAM.runExam(cfg, container, result => showResult(result)); }
  }

  function showResult(result){
    container.innerHTML = '';
    NM_EXAM.renderResult(result, container, opts => {
      if(opts.mode === 'new'){
        const newSeed = NM_RNG.newCode();
        showExam({...opts, seed:newSeed});
      } else if(opts.mode === 'wrongs'){
        const wrongProblems = opts.wrongs.map(w => w.p);
        const cfg2 = {
          thread: opts.thread, level: opts.level,
          count: wrongProblems.length, timer:0, seed: NM_RNG.newCode()
        };
        runWrongsExam(wrongProblems, cfg2, container);
      }
    });
  }

  function runWrongsExam(wrongProblems, cfg, cnt){
    cnt.innerHTML = '';
    const answers = new Array(wrongProblems.length).fill(null);
    let current = 0;

    function render(){
      const p = wrongProblems[current];
      cnt.innerHTML = `
<div class="nm-exam-run">
  <h3>오답 재시험 (${current+1}/${wrongProblems.length})</h3>
  <div class="nm-q-tex" id="nm-ex-qtex2"></div>
  <input id="nm-ex-ans2" type="number" placeholder="답" style="font-size:1.4em;width:120px;text-align:center;padding:8px">
  <button id="nm-ex-sub2" class="nm-btn nm-btn-primary" style="margin-left:8px">확인</button>
</div>`;
      renderKaTeX(p.tex||'', document.getElementById('nm-ex-qtex2'));
      const inp = document.getElementById('nm-ex-ans2');
      if(answers[current]!==null) inp.value = answers[current];
      inp.focus();
      document.getElementById('nm-ex-sub2').addEventListener('click', () => {
        const v = parseInt(inp.value);
        if(!isNaN(v)) answers[current] = v;
        current++;
        if(current >= wrongProblems.length){
          const score = wrongProblems.filter((p,i)=>answers[i]===p.answer).length;
          cnt.innerHTML = `<div class="nm-exam-result">
            <div class="nm-result-score">오답 재시험: ${score}/${wrongProblems.length} 맞혔어요!</div>
            <button id="nm-ex-back" class="nm-btn nm-btn-primary">메뉴로 돌아가기</button>
          </div>`;
          document.getElementById('nm-ex-back').addEventListener('click', showSetup);
        } else { render(); }
      });
      inp.addEventListener('keydown', e => { if(e.key==='Enter') document.getElementById('nm-ex-sub2').click(); });
    }
    render();
  }

  showSetup();
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_EXAM;
})();
