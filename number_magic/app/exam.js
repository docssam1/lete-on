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
  .nm-print-qr-wrap { margin-left: auto; display: flex; flex-direction: column; align-items: center; gap: 2px; }
  .nm-print-qr-code { font-family: monospace; font-size: 10px; }
  .nm-print-qr-wrap svg { width: 21mm; height: 21mm; shape-rendering: crispEdges; }
  .nm-print-qr-cap { font-size: 8px; color: #333; max-width: 26mm; text-align: center; line-height: 1.15; }
  .nm-print-concept-page { page-break-after: always; break-after: page; }
  .nm-cp-body { margin-top: 6px; }
  .nm-cp-block { margin-bottom: 16px; }
  .nm-cp-badge { display: inline-block; font-size: 11px; background: #eee; border-radius: 10px; padding: 2px 10px; margin-bottom: 4px; }
  .nm-cp-title { margin: 0 0 6px; font-size: 16px; }
  .nm-cp-sentence { margin: 0; font-size: 13px; line-height: 1.6; }
  .nm-cp-stage { margin-bottom: 10px; }
  .nm-cp-stage-h { font-weight: bold; font-size: 13px; margin-bottom: 2px; }
  .nm-cp-stage-d { font-size: 12.5px; line-height: 1.6; }
  .nm-cp-mathsteps { margin: 6px 0; font-size: 13px; }
  .nm-cp-mathsteps > div { margin: 2px 0; }
  .nm-cp-arrow { color: #888; }
  .nm-cp-rule { background: #f4f4f4; border-radius: 6px; padding: 8px 10px; font-size: 12px; margin-top: 6px; }
  .nm-cp-rule p { margin: 4px 0 0; }
}
@media screen {
  .nm-print-sheet { display: none; }
}`;
  document.head.appendChild(s);
})();

/* ── 내부 헬퍼 ─────────────────────────────── */
const $ = (sel, ctx) => (ctx || document).querySelector(sel);
const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

/* KaTeX 미로딩(CDN 지연·차단) 시 폴백 — LaTeX 명령어를 사람이 읽는 기호로 치환한다.
   engine/threads/*.js 전수 스캔(2026-08-25)으로 뽑은 실사용 명령어 전부 포함.
   치환표에 없는 명령어가 새로 생기면 마지막 줄에서 백슬래시만 벗겨진 채 이름이
   그대로 남는다(예: "\\foo" → "foo") — 여전히 읽을 수는 있고, 옛 동작과 같다. */
function texToPlain(tex){
  let s = String(tex==null?'':tex);
  s = s.replace(/\\square/g,'□');
  s = s.replace(/\\dfrac\{([^{}]*)\}\{([^{}]*)\}/g,'$1/$2');
  s = s.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g,'$1/$2');
  s = s.replace(/\\sqrt\{([^{}]*)\}/g,'√$1');
  s = s.replace(/\\text\{([^{}]*)\}/g,'$1');
  s = s.replace(/\\times/g,'×');
  s = s.replace(/\\div/g,'÷');
  s = s.replace(/\\cdot/g,'×');
  s = s.replace(/\\bigcirc/g,'○');
  s = s.replace(/\\cdots/g,'⋯');
  s = s.replace(/\\dots/g,'…');
  s = s.replace(/\\Rightarrow/g,'⇒');
  s = s.replace(/\\rightarrow/g,'→');
  s = s.replace(/\\therefore/g,'∴');
  s = s.replace(/\\gcd/g,'gcd');
  s = s.replace(/\\qquad/g,'    ');
  s = s.replace(/\\quad/g,'  ');
  s = s.replace(/\\[;,!]/g,' ');
  s = s.replace(/[{}]/g,'');
  s = s.replace(/\\/g,'');
  return s;
}

function renderKaTeX(tex, el){
  if(window.katex){
    try{ katex.render(tex, el, {throwOnError:false}); return; }catch(_){}
  }
  el.textContent = texToPlain(tex);
}

function esc(str){ return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

/* 다칸 답(배열) 표기: [3,5] → "3, 5". 단일 답은 그대로.
   answerShape가 있으면(분수 정답) 이 대신 ansTex()의 \dfrac 수식을 쓴다 — fmtAns는
   answerShape 없는 배열(다칸 답 일반형)에만 쓴다. */
function fmtAns(a){ return Array.isArray(a) ? a.join(', ') : a; }
/* answerShape 정답을 KaTeX tex로: 'fraction'→[n,d]='\dfrac{n}{d}', 'mixed'→[w,n,d]='w\dfrac{n}{d}'.
   answerShape 없으면 null(호출부가 fmtAns로 폴백). */
function ansTex(p){
  if(!p||!p.answerShape||!Array.isArray(p.answer))return null;
  if(p.answerShape==='fraction'){
    const [n,d]=p.answer;
    return `\\dfrac{${n}}{${d}}`;
  }
  if(p.answerShape==='mixed'){
    const [w,n,d]=p.answer;
    return `${w}\\dfrac{${n}}{${d}}`;
  }
  return null;
}
/* 정답 셀 HTML — answerShape면 KaTeX용 <span data-tex>, 아니면 기존 텍스트.
   호출부는 innerHTML을 채운 뒤 반드시 '.nm-ans-tex'에 renderKaTeX을 돌려야 한다
   (기존 '.nm-vp-tex' 루프와 같은 패턴 — 아래 각 render()에 추가돼 있음). */
function ansHtml(p){
  const tex=ansTex(p);
  if(tex)return `<span class="nm-ans-tex" data-tex="${esc(tex)}"></span>`;
  return esc(String(fmtAns(p.answer)));
}
/* 다칸 답 채점: raw는 콤마로 구분한 사용자 입력 문자열("3, 5" 등), answer는 problem.answer.
   answer가 배열이 아니면 기존 parseFloat 비교와 동일. */
function matchesAnswer(raw, answer){
  if(Array.isArray(answer)){
    const parts=String(raw==null?'':raw).split(',').map(s=>parseFloat(s.trim()));
    return parts.length===answer.length && parts.every((v,i)=>v===answer[i]);
  }
  return parseFloat(raw)===answer;
}

/* ── 학습지 ID QR + 개념 연동 (2026-08-25) ──────────────────
   QR에 담는 URL은 불변 규약: https://docssam1.github.io/lete-on/number_magic/?ws=<학습지ID>
   학습지 ID(=worksheetCode에서 '#'을 뗀 값)는 스레드·레벨·문항수·시드를 그대로 담고 있어서
   나중에 문항을 재생성할 수 있다(과정-로드맵.md §11) — 채점 회수는 Phase 2. */
const WS_BASE_URL = 'https://docssam1.github.io/lete-on/number_magic/?ws=';
function wsUrlFromCode(code){ return WS_BASE_URL + String(code||'').replace(/^#/,''); }

/* QR을 <img>/canvas가 아니라 인라인 SVG(경로 하나)로 그린다 — 인쇄 시 canvas는
   프린트 다이얼로그가 뜨는 타이밍에 따라 비어 있는 채로 인쇄될 위험이 있어 제외
   (작업 지시 §2 "canvas면 인쇄 누락 위험"). SVG는 일반 DOM이라 항상 같이 인쇄된다. */
function qrSvg(text){
  if(!window.qrcode) return ''; // vendor/qrcode.js 미로딩 — 캡션·코드 텍스트만으로 폴백
  let q;
  try{
    q = window.qrcode(0, 'M'); // typeNumber 0=자동, 오류정정 M(15%) — 학습지 인쇄 잉크 번짐 대비
    q.addData(text);
    q.make();
  }catch(e){ return ''; }
  const n = q.getModuleCount();
  const quiet = 4; // 모듈 단위 여백(표준 권장치) — 폰 카메라 인식률 확보
  const size = n + quiet*2;
  let d = '';
  for(let r=0;r<n;r++){
    for(let c=0;c<n;c++){
      if(q.isDark(r,c)) d += `M${c+quiet} ${r+quiet}h1v1h-1z`;
    }
  }
  return `<svg viewBox="0 0 ${size} ${size}" class="nm-qr-svg" role="img" aria-label="QR code">`
       + `<rect width="${size}" height="${size}" fill="#fff"/><path d="${d}" fill="#000"/></svg>`;
}

/* 헤더에 들어가는 코드+QR+캡션 블록(문제지·정답지 공용 스타일과 별개로 우측 정렬). */
function qrHeaderBlockHtml(code){
  return `<div class="nm-print-qr-wrap">
    <span class="nm-print-qr-code">${esc(code)}</span>
    ${qrSvg(wsUrlFromCode(code))}
    <span class="nm-print-qr-cap">QR을 찍으면 개념 설명이 열려요</span>
  </div>`;
}

/* 스레드+레벨 → 관련 유닛 해석. threads.js의 단일 unit 필드로는 표현이 안 되는
   레벨별 유닛(ML12·ML16·ML17처럼 같은 제너레이터를 여러 유닛이 나눠 쓰는 경우)만
   여기서 오버라이드한다 — main.js의 학습지 도우미 화면(?ws=)도 이 함수를 그대로 쓴다. */
const UNIT_LEVEL_OVERRIDE = {
  ML12:{1:'C-02',2:'C-04',3:'C-34'},
  ML16:{1:'C-16',2:'C-28'},
  ML17:{1:'C-17',2:'C-29'},
};
function resolveConceptUnit(threadId, level){
  const th = (window.NM_THREADS||{})[threadId];
  if(!th) return null;
  const ov = UNIT_LEVEL_OVERRIDE[threadId];
  const uid = (ov && ov[level]) || th.unit || null;
  const u = uid ? (window.NM_UNITS||{})[uid] : null;
  return { threadId, thread:th, unitId:uid, unit:(u && u.discover) ? u : null };
}

/* 다국어 안내: exam.js는 처음부터 한글 전용이다(이름/날짜/점수 라벨, "정답지 / Answer Key" 등
   전부 하드코딩 한국어 — S.lang을 참조하는 코드가 없다). 개념 페이지도 같은 관례를 따른다. */
function pickKo(field){ return field ? (field.ko || field.en || '') : ''; }

/* 개념 페이지의 계단식 수식(mathSteps) — cellHtml과 같은 data-tex 패턴, 호출부가
   렌더 후 '.nm-cp-tex'에 renderKaTeX을 돌려야 한다. */
function mathStepsHtmlPrint(steps){
  if(!steps || !steps.length) return '';
  return `<div class="nm-cp-mathsteps">` + steps.map((tex,i) =>
    (i ? '<div class="nm-cp-arrow">↓</div>' : '') + `<div class="nm-cp-tex" data-tex="${esc(tex)}"></div>`
  ).join('') + `</div>`;
}

/* 유형 하나(스레드+레벨)의 개념 블록 — 관련 유닛이 있으면 그 유닛의 마법 노트(제목·앞
   1~2단계·규칙)를, 없으면 threads.js의 concept 필드를, 그것도 없으면 이름만. */
function conceptBlockHtml(threadId, level){
  const info = resolveConceptUnit(threadId, level);
  if(!info) return '';
  const nm = (info.thread.name && info.thread.name.ko) || threadId;
  if(info.unit){
    const u = info.unit, d = u.discover;
    const title = (u.title && u.title.ko) || nm;
    const stages = (d.stages||[]).slice(0,2); // 학습지 한 장 분량으로 축약 — 도입부면 충분
    const stagesHtml = stages.map(s => `<div class="nm-cp-stage">`
        + (s.head ? `<div class="nm-cp-stage-h">${esc(pickKo(s.head))}</div>` : '')
        + (s.desc ? `<div class="nm-cp-stage-d">${pickKo(s.desc)}</div>` : '') // desc는 <b> 등 자체 저작 HTML 포함(main.js stepDiscover와 동일하게 그대로 삽입)
        + mathStepsHtmlPrint(s.mathSteps)
        + `</div>`).join('');
    const ruleHtml = d.rule ? `<div class="nm-cp-rule"><b>마법의 규칙</b><p>${esc(pickKo(d.rule))}</p></div>` : '';
    return `<div class="nm-cp-block">
      <div class="nm-cp-badge">📓 ${esc(nm)}</div>
      <h3 class="nm-cp-title">${esc(title)}</h3>
      ${stagesHtml}${ruleHtml}
    </div>`;
  }
  if(info.thread.concept){
    return `<div class="nm-cp-block">
      <h3 class="nm-cp-title">${esc(nm)}</h3>
      <p class="nm-cp-sentence">${esc(pickKo(info.thread.concept))}</p>
    </div>`;
  }
  return `<div class="nm-cp-block"><h3 class="nm-cp-title">${esc(nm)}</h3></div>`;
}

/* items: [{thread,level}, ...] — 현재는 학습지 한 장이 스레드 하나뿐이라 늘 1개짜리
   배열이지만, 나중에 혼합 학습지가 생겨도 이 함수는 그대로 여러 유형을 순서대로
   이어붙인다(작업 지시 §5-4, "넘치면 자연 페이지 나눔" — 높이를 고정하지 않는다). */
function conceptPageHtml(items, code){
  const blocks = items.map(it => conceptBlockHtml(it.thread, it.level)).join('');
  if(!blocks) return '';
  return `<div class="nm-print-concept-page">
  <div class="nm-print-header">
    <h2 style="margin:0">Numbers of Magic — 개념 노트</h2>
    <div style="display:flex;gap:24px;margin-top:8px;font-size:0.9em;align-items:flex-start">
      <span>이름: <span style="display:inline-block;width:120px;border-bottom:1px solid #000">&nbsp;</span></span>
      ${qrHeaderBlockHtml(code)}
    </div>
  </div>
  <div class="nm-cp-body">${blocks}</div>
</div>`;
}

/* "첫 장에 개념 넣기" 토글 — localStorage에 기억, 기본값 끔(기존 인쇄 결과 무변경). */
const CONCEPT_TOGGLE_KEY = 'nm_ws_concept_page';
function getConceptPageOn(){ try{ return localStorage.getItem(CONCEPT_TOGGLE_KEY)==='1'; }catch(e){ return false; } }
function setConceptPageOn(v){ try{ localStorage.setItem(CONCEPT_TOGGLE_KEY, v?'1':'0'); }catch(e){} }
function conceptToggleRowHtml(){
  return `<label class="nm-ex-concept-toggle">
    <input type="checkbox" id="nm-ex-concept-chk" ${getConceptPageOn()?'checked':''}>
    <span>📖 첫 장에 개념 넣기</span>
  </label>`;
}
function bindConceptToggle(container){
  const chk = container.querySelector('#nm-ex-concept-chk');
  if(chk) chk.addEventListener('change', () => setConceptPageOn(chk.checked));
}

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

  /* LaTeX→평문 치환(KaTeX 미로딩 폴백). drill.html 등 다른 스코프도 이걸 재사용한다. */
  texToPlain,
  /* answerShape 정답 → \dfrac tex(테스트/검증용 노출). */
  ansTex,

  /* 학습지 코드 생성 */
  worksheetCode(config){
    const { thread, level, count, seed } = config;
    return `#${thread}-L${level}x${count}-${seed}`;
  },

  /* 학습지 코드 → 설정 파싱 (main.js의 ?ws= 도우미 화면이 사용). 실패 시 null. */
  parseWorksheetCode,

  /* 학습지 ID(코드) → 개념 화면 QR URL. main.js도 같은 규약을 써야 하면 이걸 재사용할 것. */
  worksheetUrl: wsUrlFromCode,

  /* QR 인라인 SVG 문자열(모듈 격자 그대로, 폰트/이미지 의존 없음). */
  qrSvg,

  /* 스레드+레벨 → 관련 유닛 해석({threadId, thread, unitId, unit}) — 학습지 도우미
     화면(main.js)과 인쇄 개념 페이지가 같은 매핑을 쓴다. */
  resolveConceptUnit,

  /* ── 1. 시험 설정 화면 ── */
  renderExamSetup(container, onStart){
    /* 2026-07-13: 디딤돌 연산 실제 목차(사용자 캡처, ebook.didimdol.co.kr) 기준 교과 순서 +
       docssam만의 2단 구성 — 각 학기는 두 층으로 이뤄진다:
       ① 교과 핵심: 실제 디딤돌 책의 학습 진행 순서 그대로 (학년 배치·순서 검증됨)
       ② ✨연산 마법(magic:true): 그 학기 내용과 맞물리는 "계산이 빨라지는 전략" 스킬 —
          보수·두배수·짝묶기·더 빼고 돌려받기·식의 변형·몇십곱·19단/99단/기준곱·가우스 합·
          제곱수·배수판별 등 수의 마법 고유 스레드를 학년 난이도에 맞춰 배치.
          단순 반복 드릴이 아니라 "원리로 빨라지는" 경험이 이 앱의 정체성. */
    const GRADES = {
      '1A':{label:'1학년 1학기',emoji:'🌱',subs:[
        {label:'모으기 · 가르기',thread:'NS2',level:2,desc:'9까지',
          concept:'두 수를 모으거나, 하나의 수를 둘로 가를 수 있어요.\n예) 3과 4를 모으면 7 / 7을 가르면 3과 4'},
        {label:'합이 9까지인 덧셈',thread:'AD1',level:1,desc:'한 자리 덧셈',
          concept:'두 수를 더해요(+). 합이 9를 넘지 않아요.\n예) 3 + 2 = 5'},
        {label:'한 자리 수의 뺄셈',thread:'SB1',level:1,desc:'9까지',
          concept:'큰 수에서 작은 수를 빼요(−).\n예) 7 − 3 = 4'},
        {label:'10 가르기 · 모으기',thread:'NS3',level:2,desc:'보수 10',
          concept:'더하면 10이 되는 두 수를 찾아요.\n예) 3 + □ = 10  →  □ = 7'},
        {label:'보수 5 마법',thread:'NS3',level:1,desc:'더해서 5',magic:true,
          concept:'더해서 5가 되는 짝(1·4, 2·3)을 외워두면\n손가락을 안 세도 셈이 빨라져요!'},
        {label:'두 배 수 마법',thread:'NS5',level:1,desc:'1~10 두 배',magic:true,
          concept:'1+1=2, 2+2=4, 3+3=6 … 두 배 수는 눈 감고도!\n4+5는 "4+4보다 1 큰 수"로 바로 나와요.'},
      ]},
      '1B':{label:'1학년 2학기',emoji:'🌿',subs:[
        {label:'세 수의 덧셈',thread:'AD2',level:2,desc:'10 만들어 더하기',
          concept:'세 수를 더할 때 합이 10이 되는 두 수를 먼저 찾아 묶어요.\n예) 3 + 7 + 5 = 10 + 5 = 15'},
        {label:'받아올림 있는 덧셈',thread:'AD2',level:1,desc:'몇+몇',
          concept:'한 자리 수끼리 더해서 10이 넘으면 받아올림해요.\n예) 8 + 5 = 13'},
        {label:'두 자리 + 한 자리',thread:'AD3',level:1,desc:'올림 없음',
          concept:'두 자리 수에 한 자리 수를 더해요. 일의 자리 합이 9 이하예요.\n예) 32 + 5 = 37'},
        {label:'두 자리 − 한 자리',thread:'SB3',level:1,desc:'내림 없음',
          concept:'두 자리 수에서 한 자리 수를 빼요. 일의 자리가 충분해요.\n예) 47 − 3 = 44'},
        {label:'몇십 덧뺄 마법',thread:'AD4',level:1,desc:'10·20·30…',magic:true,
          concept:'몇십끼리는 십 묶음으로 세면 한 번에!\n예) 20+30 → 2묶음+3묶음 = 5묶음 = 50'},
        {label:'몇십−몇 마법',thread:'SB2',level:1,desc:'30−7 같은 꼴',magic:true,
          concept:'몇십에서 한 자리를 뺄 때는 10에서 먼저 빼요.\n예) 30−7 → 10−7=3 → 20+3=23'},
      ]},
      '2A':{label:'2학년 1학기',emoji:'🌷',subs:[
        {label:'(두)+(한) 받아올림',thread:'AD3',level:2,desc:'몇십몇+몇',
          concept:'일의 자리 합이 10 이상이면 십의 자리로 올려요.\n예) 37 + 5 = 42  (7+5=12, 1 올림)'},
        {label:'(두)+(두) 올림 1회',thread:'AD5',level:1,desc:'몇십몇+몇십몇',
          concept:'두 자리 수끼리 더해요. 일의 자리에서 한 번 받아올림해요.\n예) 24 + 38 = 62'},
        {label:'(두)+(두) 올림 자유',thread:'AD5',level:2,desc:'올림 1~2회',
          concept:'받아올림이 한 번 또는 두 번 있을 수 있어요.\n예) 78 + 65 = 143'},
        {label:'(두)−(한) 받아내림',thread:'SB3',level:2,desc:'몇십몇−몇',
          concept:'일의 자리가 모자라면 십의 자리에서 10을 빌려요.\n예) 43 − 7 = 36'},
        {label:'(두)−(두) 받아내림',thread:'SB4',level:2,desc:'몇십몇−몇십몇',
          concept:'두 자리 수끼리 빼요. 받아내림에 주의해요.\n예) 73 − 48 = 25'},
        {label:'더 빼고 돌려받기',thread:'SB5',level:1,desc:'−9는 −10+1',magic:true,
          concept:'7, 8, 9를 뺄 때는 10을 빼고 돌려받아요!\n예) 45−9 = 45−10+1 = 36\n받아내림 없이도 답이 나오는 마법!'},
        {label:'100−수 마법',thread:'SB2',level:2,desc:'100에서 빼기',magic:true,
          concept:'100에서 뺄 때는 몇십을 먼저, 몇을 나중에.\n예) 100−36 → 100−30=70 → 70−6=64'},
      ]},
      '2B':{label:'2학년 2학기',emoji:'🌻',subs:[
        {label:'2 · 5단 곱셈구구',thread:'ML2',level:4,desc:'2단, 5단',
          concept:'같은 수를 여러 번 더하는 것이 곱셈이에요.\n2단: 2×1=2, 2×2=4 …\n5단은 끝자리가 항상 0 또는 5!'},
        {label:'3 · 6단 곱셈구구',thread:'ML2',level:5,desc:'3단, 6단',
          concept:'3단: 3×1=3, 3×2=6, 3×3=9 …\n6단은 3단의 두 배예요: 6×n = 3×n×2'},
        {label:'4 · 8단 곱셈구구',thread:'ML3',level:4,desc:'4단, 8단',
          concept:'4단: 4×1=4, 4×2=8 …\n8단은 4단의 두 배예요: 8×n = 4×n×2'},
        {label:'7 · 9단 곱셈구구',thread:'ML3',level:5,desc:'7단, 9단',
          concept:'9단 팁: 십의 자리는 1씩 늘고, 일의 자리는 1씩 줄어요.\n예) 9×1=09, 9×2=18, 9×3=27 …'},
        {label:'곱셈구구 종합',thread:'ML4',level:1,desc:'2~9단 혼합',
          concept:'2단부터 9단까지 모두 섞어서 연습해요.\n팁: a×b = b×a (순서를 바꿔도 같아요!)'},
        {label:'배와 반 마법',thread:'ML1',level:1,desc:'×2 감각',magic:true,
          concept:'두 배에 익숙해지면 구구단이 반으로 줄어요!\n4단 = 2단의 두 배, 8단 = 4단의 두 배, 6단 = 3단의 두 배'},
        {label:'거꾸로 구구단',thread:'ML4',level:2,desc:'□×n = 답',magic:true,
          concept:'곱셈식의 빈칸을 구구단으로 거꾸로 찾아요.\n예) 3×□=18 → 3단에서 18 찾기 → □=6\n3학년 나눗셈을 미리 준비하는 마법!'},
      ]},
      '3A':{label:'3학년 1학기',emoji:'🌼',subs:[
        {label:'세 자리 덧셈',thread:'AD6',level:2,desc:'3자리+3자리',
          concept:'일→십→백 자리 순서로 더해요. 받아올림이 연속될 수 있어요.\n예) 357 + 486 = 843'},
        {label:'세 자리 뺄셈',thread:'SB6',level:1,desc:'3자리−3자리',
          concept:'일→십→백 자리 순서로 빼요. 모자라면 윗 자리에서 빌려요.\n예) 623 − 358 = 265'},
        {label:'나눗셈의 기초',thread:'DV2',level:1,desc:'구구단 안에서',
          concept:'같은 수씩 나누는 것이 나눗셈이에요.\n예) 12 ÷ 4 = 3  →  4씩 3묶음\n곱셈의 반대로 생각해요: 4 × □ = 12'},
        {label:'(두)×(한)',thread:'ML6',level:2,desc:'두 자리 곱셈',
          concept:'두 자리 수 × 한 자리 수. 자리를 나눠 곱한 뒤 더해요.\n예) 23 × 4 = (20×4) + (3×4) = 80 + 12 = 92'},
        {label:'짝 묶기 마법',thread:'AD8',level:1,desc:'합10 짝 먼저',magic:true,
          concept:'여러 수를 더할 땐 합이 10이 되는 짝부터!\n예) 3+7+5+5 = (3+7)+(5+5) = 10+10 = 20'},
        {label:'식 변형 마법',thread:'SB7',level:1,desc:'끼리끼리 묶기',magic:true,
          concept:'순서를 바꿔 계산하기 쉬운 짝을 만들어요.\n예) 23+15+7+5 = (23+7)+(15+5) = 30+20 = 50'},
      ]},
      '3B':{label:'3학년 2학기',emoji:'🍀',subs:[
        {label:'(세)×(한)',thread:'ML7',level:2,desc:'세 자리 곱셈',
          concept:'세 자리 수 × 한 자리 수를 세로셈으로 계산해요.\n예) 234 × 3 = 702'},
        {label:'(두)×(두)',thread:'ML8',level:1,desc:'두 자리×두 자리',
          concept:'두 자리 수끼리 곱해요. 분배법칙으로 나눠 계산해요.\n예) 23 × 14 = (23×10) + (23×4) = 230 + 92 = 322'},
        {label:'나머지 있는 나눗셈',thread:'DV3',level:1,desc:'두 자리÷한 자리',
          concept:'나눠도 남는 수가 나머지예요. 나머지 < 나누는 수!\n예) 17 ÷ 5 = 3 … 2  (5×3=15, 17−15=2)'},
        {label:'(세)÷(한) 나머지없음',thread:'DV4',level:1,desc:'몫이 딱 떨어짐',
          concept:'세 자리 수를 한 자리 수로 나눠요. 몫이 딱 떨어져요.\n예) 132 ÷ 4 = 33'},
        {label:'(세)÷(한) 나머지있음',thread:'DV4',level:2,desc:'나머지 있음',
          concept:'나눠도 남는 수(나머지)가 생겨요.\n예) 137 ÷ 4 = 34 … 1  (확인: 4×34+1=137)'},
        {label:'몇십 곱 마법',thread:'ML5',level:2,desc:'20×30 한 번에',magic:true,
          concept:'몇십×몇십은 앞자리끼리 곱하고 0을 붙여요.\n예) 20×30 → 2×3=6 → 600\n큰 곱셈의 어림값도 이걸로 빨라져요!'},
        {label:'크게 빼고 돌려받기',thread:'SB5',level:2,desc:'−98은 −100+2',magic:true,
          concept:'끝이 7·8·9인 수를 뺄 때는 몇십·몇백으로 올려 빼고 돌려받아요.\n예) 234−98 = 234−100+2 = 136'},
      ]},
      '4A':{label:'4학년 1학기',emoji:'🌺',subs:[
        {label:'(세)×(두)',thread:'ML9',level:1,desc:'세 자리×두 자리',
          concept:'세 자리 수와 두 자리 수의 곱셈이에요.\n예) 234 × 56 = 13104'},
        {label:'(두)÷(두)',thread:'DV5',level:1,desc:'두 자리로 나누기',
          concept:'두 자리 수로 나누는 나눗셈이에요. 몫을 어림해서 찾아요.\n예) 78 ÷ 13 = 6'},
        {label:'(세)÷(두)',thread:'DV5',level:2,desc:'세 자리÷두 자리',
          concept:'세 자리 수를 두 자리 수로 나눠요.\n예) 456 ÷ 12 = 38'},
        {label:'19단 마법',thread:'ML10',level:1,desc:'11~19단 암산',magic:true,
          concept:'교차 계산법으로 19단도 암산!\n예) 13×12 = (13+2)×10 + 3×2 = 150+6 = 156'},
        {label:'큰 수 ×2 · ÷2',thread:'ML1',level:3,desc:'네 자리 감각',magic:true,
          concept:'교과서 "큰 수" 단원과 짝꿍!\n큰 수도 두 배·반으로 다루면 수 감각이 자라요.\n예) 2400의 반 = 1200 / 3200의 두 배 = 6400'},
      ]},
      '4B':{label:'4학년 2학기',emoji:'🍁',subs:[
        {label:'가분수 ↔ 대분수',thread:'FR2',level:1,desc:'서로 바꾸기',
          concept:'가분수는 나눗셈으로 대분수로!\n예) 7/3 = 2와1/3 (7÷3 = 2 … 1)'},
        {label:'동분모 분수 덧·뺄',thread:'FR1',level:1,desc:'진분수',
          concept:'분모가 같으면 분자끼리만 더하거나 빼요. 분모는 그대로!\n예) 3/7 + 2/7 = 5/7'},
        {label:'대분수의 덧셈',thread:'FR3',level:1,desc:'동분모, 올림 없음',
          concept:'정수끼리, 분수끼리 따로 더해요!\n예) 1과2/6 + 2와3/6 = 3과5/6'},
        {label:'대분수의 뺄셈',thread:'FR3',level:2,desc:'동분모, 받아내림',
          concept:'분수 부분이 부족하면 정수에서 1을 빌려요!\n예) 3과1/4 − 1과3/4 = 1과2/4'},
        {label:'소수 덧·뺄',thread:'DC1',level:1,desc:'소수 한 자리',
          concept:'소수점 아래 한 자리 수의 덧뺄셈.\n소수점끼리 자리를 맞춰 계산해요.\n예) 2.5 + 1.3 = 3.8'},
        {label:'99단 마법',thread:'ML10',level:2,desc:'99×n = 100n−n',magic:true,
          concept:'99를 곱할 땐 100을 곱하고 한 번 빼요.\n예) 99×23 = 2300−23 = 2277'},
        {label:'여러 수 한 번에',thread:'AD8',level:3,desc:'두 자리 섞인 덧셈',magic:true,
          concept:'수가 많아도 짝을 찾으면 무섭지 않아요!\n예) 14+6+8+2+5 = 20+10+5 = 35'},
      ]},
      '5A':{label:'5학년 1학기',emoji:'⭐',subs:[
        {label:'사칙 혼합계산',thread:'MX1',level:1,desc:'괄호 없음',
          concept:'괄호가 없으면 곱셈·나눗셈을 먼저 계산해요.\n예) 3 + 2 × 5 = 3 + 10 = 13'},
        {label:'괄호 혼합계산',thread:'MX1',level:2,desc:'소괄호',
          concept:'괄호 안을 가장 먼저 계산해요.\n예) (3+2) × 5 = 5 × 5 = 25'},
        {label:'최대공약수',thread:'DV7',level:2,desc:'GCD',
          concept:'두 수의 공통 약수 중 가장 큰 수예요.\n예) 12와 18의 최대공약수 = 6'},
        {label:'최소공배수',thread:'DV7',level:3,desc:'LCM',
          concept:'두 수의 공통 배수 중 가장 작은 수예요.\n예) 4와 6의 최소공배수 = 12'},
        {label:'약분',thread:'FR5',level:1,desc:'기약분수',
          concept:'분자와 분모를 공약수로 나눠 더 간단한 분수로 만들어요.\n예) 6/8 = 3/4 (2로 약분)'},
        {label:'이분모 분수 덧·뺄',thread:'FR4',level:1,desc:'통분',
          concept:'분모가 다르면 통분(공통분모 만들기)을 먼저 해요.\n예) 1/2 + 1/3 = 3/6 + 2/6 = 5/6'},
        {label:'배수 판별 마법',thread:'DV6',level:2,desc:'3·6·9 배수 찾기',magic:true,
          concept:'자릿수의 합이 3의 배수면 그 수도 3의 배수!\n예) 234 → 2+3+4=9 → 3의 배수\n약분할 공약수가 눈에 보이는 마법이에요.'},
        {label:'가우스의 합 마법',thread:'MX2',level:1,desc:'1~n 한 번에',magic:true,
          concept:'1부터 n까지의 합 = n×(n+1)÷2\n예) 1+2+…+10 = 10×11÷2 = 55\n수학자 가우스가 초등학생 때 쓴 방법!'},
      ]},
      '5B':{label:'5학년 2학기',emoji:'🌙',subs:[
        {label:'분수와 자연수의 곱셈',thread:'FR6',level:2,desc:'대분수 포함',
          concept:'자연수를 분자에 곱해요.\n예) 3 × 2/5 = 6/5 = 1과1/5'},
        {label:'진분수의 곱셈',thread:'FR6',level:1,desc:'진분수×진분수',
          concept:'분자끼리, 분모끼리 곱해요!\n예) 2/3 × 3/4 = 6/12 = 1/2'},
        {label:'분수와 소수',thread:'FR8',level:1,desc:'서로 변환',
          concept:'분수를 소수로, 소수를 분수로 바꿔요.\n예) 1/4 = 0.25'},
        {label:'소수의 곱셈',thread:'DC2',level:1,desc:'자연수·소수',
          concept:'정수처럼 곱한 뒤 소수점을 옮겨요.\n예) 0.3 × 0.2 = 0.06'},
        {label:'세 분수 곱 마법',thread:'FR6',level:3,desc:'약분 먼저!',magic:true,
          concept:'곱하기 전에 약분부터 하면 계산이 훨씬 작아져요.\n분자 셋·분모 셋을 한꺼번에 곱해요!'},
        {label:'25×4 기준곱 마법',thread:'ML10',level:3,desc:'25×4=100 활용',magic:true,
          concept:'25×4=100, 125×8=1000을 알면 큰 곱셈이 순식간에!\n예) 25×16 = 25×4×4 = 100×4 = 400'},
      ]},
      '6A':{label:'6학년 1학기',emoji:'🏆',subs:[
        {label:'분수·자연수 곱나눗셈',thread:'FR6',level:2,desc:'분수의 나눗셈 준비',
          concept:'분수와 자연수를 곱하는 연습으로 나눗셈의 기초를 다져요.\n예) 4/5 × 3 = 12/5 = 2와2/5'},
        {label:'소수 나눗셈',thread:'DC3',level:1,desc:'소수÷자연수',
          concept:'소수를 10배 해서 정수로 계산한 뒤 다시 나눠요.\n예) 3.6 ÷ 4 = 0.9'},
        {label:'비와 비율',thread:'MX3',level:1,desc:'백분율',
          concept:'비율에 100을 곱하면 백분율(%)이에요.\n예) 3/4 = 0.75 = 75%'},
        {label:'제곱수 마법',thread:'ML11',level:1,desc:'11²~20² 암기',magic:true,
          concept:'11²=121, 12²=144 … 20²=400\n제곱수를 외워두면 중학교 제곱근이 쉬워져요!'},
        {label:'홀짝 수열의 합',thread:'MX2',level:2,desc:'홀수 합 = n²',magic:true,
          concept:'1+3+5+…+(2n−1) = n² (홀수 n개의 합)\n2+4+6+…+2n = n×(n+1)\n규칙을 알면 더하지 않고도 답이 보여요!'},
      ]},
      '6B':{label:'6학년 2학기',emoji:'🎓',subs:[
        {label:'분수의 나눗셈',thread:'FR7',level:1,desc:'분수÷분수',
          concept:'나누기는 역수의 곱셈! ÷를 ×로 바꾸고 뒤 분수를 뒤집어 곱해요.\n예) 1/2 ÷ 1/4 = 1/2 × 4/1 = 2'},
        {label:'소수의 나눗셈',thread:'DC3',level:1,desc:'나누어떨어짐',
          concept:'소수 나눗셈 총정리.\n예) 4.8 ÷ 6 = 0.8'},
        {label:'비와 비율 종합',thread:'MX3',level:2,desc:'할·푼·리',
          concept:'우리나라식 소수 비율 표현이에요.\n예) 0.354 → 3할 5푼 4리'},
        {label:'혼합계산 끝판왕',thread:'MX1',level:3,desc:'중괄호까지',magic:true,
          concept:'소괄호→중괄호→곱나눗셈→덧뺄셈 순서로!\n예) {(3+5)×4−2} = {32−2} = 30\n초등 연산 6년의 총결산이에요.'},
        {label:'분수·소수 총정리',thread:'MX5',level:1,desc:'졸업 기념 마법',magic:true,
          concept:'분수와 소수를 자유자재로 넘나들며 총정리해요.\n약분·통분·변환까지 한 판에!'},
      ]},
      /* 2026-07-13: 예비 중등은 사용자 지시로 "중1 교육과정 순서"를 따른다:
         ① 소인수분해(자연수의 성질) → ② 정수와 유리수 → ③ 문자와 식·방정식 → ④ 정비례와 반비례.
         참고: 디딤돌 Pre중등 책(Drive OCR 확인)은 비례→방정식→정수 순이지만, 중1 진도 순서로 재배열함.
         ①은 기존 생성기(DV8/DV7/ML11)가 있어 바로 풀 수 있고, ②~④는 표 완성·등식의 성질형
         문제라 대응 생성기가 없어 comingSoon(개념 카드만) — 억지 매핑 대신 준비중으로 명시. */
      'PRE':{label:'예비 중등',emoji:'🚀',subs:[
        {label:'소수(素數) 판별',thread:'DV8',level:1,desc:'소수 찾기',
          concept:'약수가 1과 자기 자신뿐인 수가 소수예요.\n예) 2, 3, 5, 7, 11, 13 …\n주의: 1은 소수가 아니에요!\n중1 첫 단원 "소인수분해"의 출발점.'},
        {label:'소인수분해',thread:'DV8',level:2,desc:'소수의 곱으로',
          concept:'수를 소수의 곱으로 나타내요.\n예) 12 = 2 × 2 × 3 = 2² × 3\n작은 소수(2, 3, 5…)부터 차례로 나눠 봐요.'},
        {label:'거듭제곱',thread:'ML11',level:3,desc:'2ⁿ·3ⁿ·5ⁿ',
          concept:'같은 수를 여러 번 곱하면 거듭제곱!\n예) 2×2×2 = 2³ = 8\n소인수분해 결과를 지수로 표현할 때 꼭 필요해요.'},
        {label:'최대공약수·최소공배수',thread:'DV7',level:2,desc:'소인수분해로',
          concept:'중1에서는 소인수분해를 이용해 최대공약수를 구해요.\n예) 12=2²×3, 18=2×3² → 공통 소인수 2×3 = 6'},
        {label:'약수의 개수',thread:'DV8',level:3,desc:'(지수+1) 곱',
          concept:'소인수분해하면 약수의 개수를 세지 않고도 알 수 있어요!\n예) 12 = 2²×3 → (2+1)×(1+1) = 6개'},
        {label:'정수와 유리수',desc:'음수·수직선',comingSoon:true,
          concept:'0보다 작은 수(음수)를 포함한 정수·유리수를 수직선 위에서 비교해요.\n절댓값: 수직선에서 0으로부터 떨어진 거리.\n예) -3의 절댓값은 3'},
        {label:'덧셈·뺄셈 방정식',desc:'등식의 성질',comingSoon:true,
          concept:'모르는 수 x가 있는 등식을 방정식이라 해요.\n등식의 양쪽에 같은 수를 더하거나 빼도 등식은 그대로 성립해요.\n예) x − 9 = 12 → 양쪽에 9를 더하면 x = 21'},
        {label:'곱셈·나눗셈 방정식',desc:'등식의 성질',comingSoon:true,
          concept:'등식의 양쪽에 같은 수를 곱하거나(0이 아닌 수로) 나누어도 등식은 그대로 성립해요.\n예) x ÷ 5 = 20 → 양쪽에 5를 곱하면 x = 100'},
        {label:'혼합 방정식',desc:'×,+,− / ÷,+,−',comingSoon:true,
          concept:'x×(수)나 x÷(수)를 한 덩어리로 먼저 구한 다음 x를 구해요.\n예) x×4+5=17 → x×4=12 → x=3'},
        {label:'정비례와 반비례',desc:'대응 관계 표',comingSoon:true,
          concept:'두 수 x, y가 있을 때\n· 정비례: x가 2배, 3배… 되면 y도 2배, 3배… 돼요. (y = 정해진 수 × x)\n· 반비례: x가 2배, 3배… 되면 y는 반으로, 1/3로… 줄어요. (x × y = 정해진 수)\n예) 세발자전거 수와 전체 바퀴 수 → 정비례 / 넓이가 일정한 직사각형의 가로·세로 → 반비례'},
        {label:'제곱근 마법',thread:'MX4',level:1,desc:'√121~√400',magic:true,
          concept:'제곱해서 그 수가 되는 수를 찾아요.\n예) √144 = 12 (12×12=144)\n중3 내용을 살짝 맛보는 보너스 마법!'},
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
      {key:'SB', emoji:'➖', label:'뺄셈',        desc:'받아내림·빼기 전략'},
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
    ${conceptToggleRowHtml()}
    <div class="nm-ex-actions" style="margin-top:10px">
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
      ${(() => {
        const chip = (s,i) => `
      <button class="nm-ex-topic-chip${i===selIdx?' nm-ex-topic-sel':''}${s.comingSoon?' nm-ex-topic-soon':''}${s.magic?' nm-ex-topic-magic':''}" data-idx="${i}">
        ${opts.showGrade && s.grade ? `<span class="nm-ex-tchip-grade">${s.grade==='PRE'?'Pre':s.grade}</span>` : ''}
        <span class="nm-ex-tchip-name">${s.magic?'✨ ':''}${esc(s.label)}</span>
        <span class="nm-ex-tchip-desc">${s.comingSoon?'🚧 준비중':esc(s.desc)}</span>
      </button>`;
        const core  = subs.map((s,i)=>({s,i})).filter(x=>!x.s.magic);
        const magic = subs.map((s,i)=>({s,i})).filter(x=>x.s.magic);
        return core.map(x=>chip(x.s,x.i)).join('')
          + (magic.length ? `<div class="nm-ex-topics-label">✨ 연산 마법 — 계산이 빨라지는 전략</div>`
              + magic.map(x=>chip(x.s,x.i)).join('') : '');
      })()}
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
        bindConceptToggle(container);

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
    ${conceptToggleRowHtml()}
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
      bindConceptToggle(container);
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
      problems.forEach((p,i)=>{ if(matchesAnswer(answers[i],p.answer)) score++; });
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
                           .filter(x=>!matchesAnswer(x.myAns,x.p.answer));

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
          <td class="nm-correct-ans">${ansHtml(w.p)}</td>
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
    $$('.nm-ans-tex', container).forEach(el => {
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

    const conceptHtml = getConceptPageOn() ? conceptPageHtml([{thread, level}], code) : '';

    sheet.innerHTML = `
${conceptHtml}
<div class="nm-print-header">
  <h2 style="margin:0">Numbers of Magic — ${esc(thName)} 학습지</h2>
  <div style="display:flex;gap:24px;margin-top:8px;font-size:0.9em">
    <span>이름: <span style="display:inline-block;width:120px;border-bottom:1px solid #000">&nbsp;</span></span>
    <span>날짜: <span style="display:inline-block;width:100px;border-bottom:1px solid #000">&nbsp;</span></span>
    <span>점수: <span style="display:inline-block;width:60px;border-bottom:1px solid #000">&nbsp;</span> / ${count}</span>
    ${qrHeaderBlockHtml(code)}
  </div>
</div>
<div class="nm-print-grid" id="nm-print-problems"></div>
<div class="nm-print-answer-key">
  <h3 style="margin:0 0 8px 0">정답지 / Answer Key — <span style="font-family:monospace;font-size:0.85em">${esc(code)}</span></h3>
  <div class="nm-ak-grid" id="nm-print-answers"></div>
</div>`;

    document.body.appendChild(sheet);

    sheet.querySelectorAll('.nm-cp-tex').forEach(el => renderKaTeX(el.dataset.tex||'', el));

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
      ak.appendChild(document.createTextNode(`${i+1}. `));
      const akTex = ansTex(p);
      if(akTex){
        const akSpan = document.createElement('span');
        renderKaTeX(akTex, akSpan);
        ak.appendChild(akSpan);
      } else {
        ak.appendChild(document.createTextNode(String(fmtAns(p.answer))));
      }
      answerGrid.appendChild(ak);
    });

    setTimeout(() => { window.print(); }, 350);
  },

  /* ── 4b. 혼합 학습지 인쇄(편지함 봉투용) ──────────────────────
     items: [{thread,level,count,seed,label?}] — 한 봉투에 담긴 여러 드릴을
     한 번의 인쇄로 이어붙인다(과정-로드맵.md §12 "혼합 학습지"). 문항 생성·
     정답 렌더링은 renderPrint의 단일 항목 로직을 그대로 재사용하고, 항목별로
     자기 학습지 코드(#THREAD-Lx-COUNTxSEED)를 그대로 갖는다 — 기존 ?ws=
     도우미 화면이 그 코드를 이미 그대로 이해하므로 새 규약이 필요 없다.
     envelopeCode는 표지에만 쓰는 표시용 라벨(예: W2026-W35-C4). */
  renderPrintMulti(items, envelopeCode){
    if(!items || !items.length) return;
    const old = document.querySelector('.nm-print-sheet');
    if(old) old.remove();

    const built = items.map(cfg => {
      const numericSeed = NM_RNG.hashSeed(cfg.seed);
      const problems = buildProblems(cfg.thread, cfg.level, cfg.count, numericSeed);
      applyWordProblems(problems, cfg.wordType, numericSeed);
      const code = NM_EXAM.worksheetCode(cfg);
      const th = (window.NM_THREADS || {})[cfg.thread] || {};
      return { cfg, problems, code, thName: (th.name||{}).ko || cfg.thread };
    });

    const sheet = document.createElement('div');
    sheet.className = 'nm-print-sheet';
    sheet.setAttribute('aria-hidden', 'true');

    const conceptHtml = getConceptPageOn()
      ? conceptPageHtml(items.map(it => ({thread:it.thread, level:it.level})), envelopeCode)
      : '';

    const sectionsHtml = built.map((b,i) => `
<div class="nm-print-header"${i>0 ? ' style="page-break-before:always"' : ''}>
  <h2 style="margin:0">Numbers of Magic — ${esc(b.thName)} 학습지</h2>
  <div style="display:flex;gap:24px;margin-top:8px;font-size:0.9em">
    <span>이름: <span style="display:inline-block;width:120px;border-bottom:1px solid #000">&nbsp;</span></span>
    <span>날짜: <span style="display:inline-block;width:100px;border-bottom:1px solid #000">&nbsp;</span></span>
    <span>점수: <span style="display:inline-block;width:60px;border-bottom:1px solid #000">&nbsp;</span> / ${b.cfg.count}</span>
    ${qrHeaderBlockHtml(b.code)}
  </div>
</div>
<div class="nm-print-grid" id="nm-print-problems-${i}"></div>`).join('');

    const answerSectionsHtml = built.map((b,i) => `
<div class="nm-print-answer-key">
  <h3 style="margin:0 0 8px 0">정답지 / Answer Key — ${esc(b.thName)} <span style="font-family:monospace;font-size:0.85em">${esc(b.code)}</span></h3>
  <div class="nm-ak-grid" id="nm-print-answers-${i}"></div>
</div>`).join('');

    sheet.innerHTML = `
${conceptHtml}
<div class="nm-print-header">
  <h2 style="margin:0">Numbers of Magic — 📬 ${esc(envelopeCode||'')}</h2>
  <div style="display:flex;gap:24px;margin-top:8px;font-size:0.9em">
    <span>이름: <span style="display:inline-block;width:120px;border-bottom:1px solid #000">&nbsp;</span></span>
    <span>날짜: <span style="display:inline-block;width:100px;border-bottom:1px solid #000">&nbsp;</span></span>
  </div>
</div>
${sectionsHtml}
${answerSectionsHtml}`;

    document.body.appendChild(sheet);
    sheet.querySelectorAll('.nm-cp-tex').forEach(el => renderKaTeX(el.dataset.tex||'', el));

    built.forEach((b,i) => {
      const problemGrid = sheet.querySelector(`#nm-print-problems-${i}`);
      const answerGrid  = sheet.querySelector(`#nm-print-answers-${i}`);
      b.problems.forEach((p, qi) => {
        const card = document.createElement('div');
        card.className = 'nm-print-item';
        const numEl = document.createElement('div');
        numEl.className = 'nm-q-num';
        numEl.textContent = `${qi+1}.`;
        const texEl = document.createElement('div');
        texEl.className = 'nm-q-tex';
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
        ak.appendChild(document.createTextNode(`${qi+1}. `));
        const akTex = ansTex(p);
        if(akTex){
          const akSpan = document.createElement('span');
          renderKaTeX(akTex, akSpan);
          ak.appendChild(akSpan);
        } else {
          ak.appendChild(document.createTextNode(String(fmtAns(p.answer))));
        }
        answerGrid.appendChild(ak);
      });
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
          ansRow = `<span class="nm-vp-ans-val">${ansHtml(p)}</span>`;
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
          ansRow = `<span class="nm-vp-ans-val">${ansHtml(p)}</span>`;
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
        const isMulti=Array.isArray(p.answer);
        if(mode==='online'){
          ansRow = isMulti
            ? `<input class="nm-vp-inp nm-vp-inp-sm" type="text" inputmode="decimal" data-idx="${i}" autocomplete="off" placeholder="예: 3, 5">`
            : `<input class="nm-vp-inp nm-vp-inp-sm" type="number" inputmode="numeric" data-idx="${i}" autocomplete="off" placeholder="?">`;
        } else if(mode==='answer'){
          ansRow = `<span class="nm-vp-ans-val">${ansHtml(p)}</span>`;
        } else {
          ansRow = '';
        }
        inner = `<div class="nm-vp-inline">
  <div class="nm-vp-tex" data-tex="${esc(p.tex||'')}"></div>
  ${ansRow}
</div>`;
      }
      const stateClass = graded && mode==='online'
        ? (matchesAnswer(userAnswers[i],p.answer) ? ' nm-ws-ok' : (userAnswers[i]!=='' ? ' nm-ws-err' : ''))
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
      container.querySelectorAll('.nm-ans-tex').forEach(el => renderKaTeX(el.dataset.tex||'', el));

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
        problems.forEach((p,i)=>{ if(matchesAnswer(userAnswers[i],p.answer)) gradeScore++; });
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
      const conceptHtml = getConceptPageOn() ? conceptPageHtml([{thread, level}], code) : '';

      sheet.innerHTML = `
${conceptHtml}
<div class="nm-print-header">
  <h2 style="margin:0;font-size:16px">${esc(label||thread)} 연산 학습지</h2>
  <div style="display:flex;gap:20px;margin-top:6px;font-size:12px">
    <span>이름: <span style="display:inline-block;width:100px;border-bottom:1px solid #000">&nbsp;</span></span>
    <span>날짜: <span style="display:inline-block;width:80px;border-bottom:1px solid #000">&nbsp;</span></span>
    <span>점수: <span style="display:inline-block;width:50px;border-bottom:1px solid #000">&nbsp;</span> / ${count}</span>
    ${qrHeaderBlockHtml(code)}
  </div>
</div>
<div class="nm-print-ws-grid" id="nm-pw-probs"></div>
<div class="nm-print-answer-key">
  <h3 style="margin:0 0 6px;font-size:13px">정답지 — <span style="font-family:monospace;font-size:11px">${esc(code)}</span></h3>
  <div class="nm-print-ak-grid" id="nm-pw-aks"></div>
</div>`;
      document.body.appendChild(sheet);

      sheet.querySelectorAll('.nm-cp-tex').forEach(el => renderKaTeX(el.dataset.tex||'', el));

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
        ak.appendChild(document.createTextNode(`${circled(i+1)} `));
        const pwTex = ansTex(p);
        if(pwTex){
          const pwSpan = document.createElement('span');
          renderKaTeX(pwTex, pwSpan);
          ak.appendChild(pwSpan);
        } else {
          ak.appendChild(document.createTextNode(String(fmtAns(p.answer))));
        }
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
          const score = wrongProblems.filter((p,i)=>matchesAnswer(answers[i],p.answer)).length;
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
