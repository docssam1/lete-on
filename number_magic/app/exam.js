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
  // KaTeX 없으면 텍스트 폴백
  el.textContent = tex.replace(/\\square/g,'□').replace(/\\/g,'');
}

function esc(str){ return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

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
  // 생성기 없으면 스텁
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
  // 형식: #THREAD-LlvxCOUNT-SEED  예) #AD2-L1x20-k3f9z
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

  /* ── 1. 시험 설정 화면 (섹션 선택 → 주제 설정) ── */
  renderExamSetup(container, onStart){
    const TOPICS = {
      school:[
        {label:'덧셈', icon:'＋', color:'#3b82f6', subs:[
          {label:'한 자리 덧셈 (올림 없음)', thread:'AD1', level:1, desc:'합 9 이하'},
          {label:'받아올림 덧셈', thread:'AD2', level:1, desc:'합 10 이상'},
          {label:'세 수 더하기', thread:'AD2', level:2, desc:'세 수 받아올림'},
          {label:'두 자리 + 한 자리', thread:'AD3', level:2, desc:'받아올림 포함'},
          {label:'두 자리 + 두 자리', thread:'AD5', level:2, desc:'받아올림 자유'},
          {label:'세 자리 덧셈', thread:'AD6', level:2, desc:'3자리 + 3자리'},
          {label:'몇십 · 몇백 더하기', thread:'AD4', level:1, desc:'10s + 10s'},
        ]},
        {label:'뺄셈', icon:'－', color:'#ef4444', subs:[
          {label:'한 자리 뺄셈', thread:'SB1', level:1, desc:'9 이하'},
          {label:'두 자리 − 한 자리 (내림 없음)', thread:'SB3', level:1, desc:'받아내림 없음'},
          {label:'두 자리 − 한 자리 (내림)', thread:'SB3', level:2, desc:'받아내림 있음'},
          {label:'두 자리 − 두 자리', thread:'SB4', level:2, desc:'받아내림 있음'},
          {label:'세 자리 뺄셈', thread:'SB6', level:1, desc:'3자리 − 3자리'},
          {label:'보정 빼기 (7·8·9)', thread:'SB5', level:1, desc:'더 빼고 돌려받기'},
        ]},
        {label:'곱셈', icon:'×', color:'#10b981', subs:[
          {label:'구구단 2 · 3단', thread:'ML2', level:1, desc:'2단, 3단'},
          {label:'구구단 4 · 5단', thread:'ML2', level:2, desc:'4단, 5단'},
          {label:'구구단 6 · 7단', thread:'ML3', level:1, desc:'6단, 7단'},
          {label:'구구단 8 · 9단', thread:'ML3', level:2, desc:'8단, 9단'},
          {label:'구구단 전체 (2~9단)', thread:'ML4', level:1, desc:'혼합'},
          {label:'□ 채우기 (역구구)', thread:'ML4', level:2, desc:'빈칸 인수 찾기'},
          {label:'두 자리 × 한 자리', thread:'ML6', level:2, desc:'분배 암산'},
          {label:'배수 (×2 / ÷2)', thread:'ML1', level:1, desc:'두 배와 반으로'},
        ]},
        {label:'나눗셈', icon:'÷', color:'#f59e0b', subs:[
          {label:'두 자리 ÷ 한 자리 (나머지 없음)', thread:'DV2', level:1, desc:'나누어 떨어짐'},
          {label:'나머지 있는 나눗셈', thread:'DV3', level:1, desc:'2자리 ÷ 1자리'},
          {label:'세 자리 ÷ 한 자리', thread:'DV4', level:1, desc:'나머지 없음'},
          {label:'세 자리 ÷ 한 자리 (나머지)', thread:'DV4', level:2, desc:'나머지 있음'},
        ]},
      ],
      magic:[
        {label:'수 감각', icon:'🔢', color:'#0ea5e9', subs:[
          {label:'보수 10 찾기', thread:'NS3', level:2, desc:'더해서 10 만들기'},
          {label:'보수 100 찾기', thread:'NS4', level:2, desc:'더해서 100 만들기'},
          {label:'자릿값 읽기', thread:'NS1', level:1, desc:'두·세 자리 자릿값'},
          {label:'모으기 · 가르기', thread:'NS2', level:2, desc:'9까지 수 가르기'},
        ]},
        {label:'창의수연', icon:'🧠', color:'#8b5cf6', subs:[
          {label:'짝 묶어 더하기 (한 자리)', thread:'AD8', level:1, desc:'4개 수, 짝 10 묶기'},
          {label:'짝 묶어 더하기 (두 자리)', thread:'AD8', level:3, desc:'두 자리 수 포함'},
          {label:'식의 변형 — 끼리끼리', thread:'SB7', level:1, desc:'같은 자리 묶기'},
          {label:'식의 변형 — 10 만들기', thread:'SB7', level:2, desc:'받아올림 그룹화'},
        ]},
        {label:'소수 · 분수', icon:'🔵', color:'#6366f1', subs:[
          {label:'소수 덧·뺄 (1자리)', thread:'DC1', level:1, desc:'소수 한 자리'},
          {label:'소수 덧·뺄 (2자리)', thread:'DC1', level:2, desc:'소수 두 자리'},
          {label:'진분수 덧·뺄 (같은 분모)', thread:'FR1', level:1, desc:'동분모'},
          {label:'이분모 덧·뺄', thread:'FR4', level:1, desc:'다른 분모'},
        ]},
      ]
    };

    let seed = NM_RNG.newCode();

    /* ── 1단계: 섹션 선택 ── */
    function showSectionPick(){
      container.innerHTML = `
<div class="nm-ex-sec-wrap">
  <div class="nm-ex-sec-title">📝 학습지 &amp; 시험</div>
  <div class="nm-ex-sec-sub">연습할 영역을 선택하세요</div>
  <div class="nm-ex-sec-grid">
    <button class="nm-ex-sec-card" data-sec="school">
      <div class="nm-ex-sec-icon">🏫</div>
      <div class="nm-ex-sec-name">교과 연산</div>
      <div class="nm-ex-sec-desc">덧셈 · 뺄셈 · 곱셈 · 나눗셈</div>
    </button>
    <button class="nm-ex-sec-card nm-ex-sec-magic" data-sec="magic">
      <div class="nm-ex-sec-icon">🧙</div>
      <div class="nm-ex-sec-name">Numbers of Magic</div>
      <div class="nm-ex-sec-desc">창의수연 · 수 감각 · 분수 · 소수</div>
    </button>
  </div>
</div>`;
      container.querySelectorAll('.nm-ex-sec-card').forEach(btn=>{
        btn.addEventListener('click', ()=>{ seed=NM_RNG.newCode(); showTopicForm(btn.dataset.sec); });
      });
    }

    /* ── 2단계: 주제 설정 ── */
    function showTopicForm(section){
      const cats = TOPICS[section];
      let topicKey = null;

      function parseTopic(key){
        if(!key) return null;
        const [ci,si] = key.split(':').map(Number);
        return cats[ci]&&cats[ci].subs[si] ? cats[ci].subs[si] : null;
      }

      function codeText(sub){
        const cnt = parseInt((container.querySelector('#nm-ex-count')||{}).value)||10;
        return NM_EXAM.worksheetCode({thread:sub.thread, level:sub.level, count:cnt, seed});
      }

      function optionsHtml(){
        let h = '<option value="">— 주제 선택 —</option>';
        cats.forEach((cat,ci)=>{
          h += `<optgroup label="${esc(cat.icon+' '+cat.label)}">`;
          cat.subs.forEach((sub,si)=>{
            h += `<option value="${ci}:${si}">${esc(sub.label)} — ${esc(sub.desc)}</option>`;
          });
          h += '</optgroup>';
        });
        return h;
      }

      const secLabel = section==='school'?'🏫 교과 연산':'🧙 Numbers of Magic';

      container.innerHTML = `
<div class="nm-ex-form-wrap">
  <div class="nm-ex-form-head">
    <button class="nm-ex-back-btn" id="nm-ex-back-sec">← 다시 선택</button>
    <span class="nm-ex-sec-chip">${esc(secLabel)}</span>
  </div>
  <div class="nm-ex-form-body">
    <div class="nm-ex-form-row">
      <label class="nm-ex-label">주제</label>
      <select class="nm-ex-select" id="nm-ex-topic">${optionsHtml()}</select>
    </div>
    <div class="nm-ex-form-row">
      <label class="nm-ex-label">문항 수</label>
      <select class="nm-ex-select" id="nm-ex-count">
        ${[5,10,15,20,30].map(n=>`<option value="${n}"${n===10?' selected':''}>${n}문제</option>`).join('')}
      </select>
    </div>
    <div class="nm-ex-form-row">
      <label class="nm-ex-label">타이머</label>
      <select class="nm-ex-select" id="nm-ex-timer">
        <option value="0">없음</option>
        <option value="180">3분</option>
        <option value="300" selected>5분</option>
        <option value="600">10분</option>
      </select>
    </div>
    <div class="nm-ex-code-row" id="nm-ex-code-row" style="display:none">
      <span class="nm-ex-code-label">코드</span>
      <code class="nm-ex-code-val" id="nm-ex-code-val"></code>
      <button class="nm-ex-dice" id="nm-ex-dice" title="새 코드">🎲</button>
    </div>
    <div class="nm-ex-actions">
      <button class="nm-ex-btn-primary" id="nm-ex-start" disabled>▶ 연습 시작</button>
      <button class="nm-ex-btn-secondary" id="nm-ex-print" disabled>🖨 학습지</button>
    </div>
  </div>
</div>`;

      function refresh(){
        const sub = parseTopic(topicKey);
        const codeRow = container.querySelector('#nm-ex-code-row');
        const codeVal = container.querySelector('#nm-ex-code-val');
        const startBtn = container.querySelector('#nm-ex-start');
        const printBtn = container.querySelector('#nm-ex-print');
        if(sub){
          codeRow.style.display='flex';
          codeVal.textContent = codeText(sub);
          startBtn.disabled=false; printBtn.disabled=false;
        } else {
          codeRow.style.display='none';
          startBtn.disabled=true; printBtn.disabled=true;
        }
      }

      container.querySelector('#nm-ex-back-sec').addEventListener('click', showSectionPick);
      container.querySelector('#nm-ex-topic').addEventListener('change', function(){ topicKey=this.value||null; refresh(); });
      container.querySelector('#nm-ex-count').addEventListener('change', ()=>refresh());
      container.querySelector('#nm-ex-dice').addEventListener('click', ()=>{ seed=NM_RNG.newCode(); refresh(); });

      container.querySelector('#nm-ex-start').addEventListener('click', ()=>{
        const sub=parseTopic(topicKey); if(!sub) return;
        onStart && onStart({
          thread:sub.thread, level:sub.level,
          count:parseInt(container.querySelector('#nm-ex-count').value)||10,
          timer:parseInt(container.querySelector('#nm-ex-timer').value)||0,
          seed, _section:section, _topicKey:topicKey
        });
      });

      container.querySelector('#nm-ex-print').addEventListener('click', ()=>{
        const sub=parseTopic(topicKey); if(!sub) return;
        NM_EXAM.renderPrint({thread:sub.thread, level:sub.level,
          count:parseInt(container.querySelector('#nm-ex-count').value)||10, seed});
      });

      refresh();
    }

    showSectionPick();
  },

  /* ── 2. 시험 실행 ── */
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
      // 이미 답했으면 표시
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
    <button id="nm-res-more" class="nm-ex-btn-primary">🔄 계속 연습</button>
    <button id="nm-res-retry-wrong" class="nm-ex-btn-secondary" ${wrongs.length===0?'disabled':''}>📖 오답만 다시</button>
    <button id="nm-res-new" class="nm-ex-btn-secondary">🎲 새 문제</button>
  </div>
  <div class="nm-result-actions" style="margin-top:6px">
    <button id="nm-res-print" class="nm-ex-btn-ghost">🖨 학습지 인쇄</button>
    <button id="nm-res-setup" class="nm-ex-btn-ghost">← 주제 바꾸기</button>
  </div>
  <div class="nm-result-code">코드: <code>${NM_EXAM.worksheetCode({thread,level,count:total,seed})}</code></div>
</div>`;

    $$('.nm-rtex', container).forEach(el => {
      renderKaTeX(el.dataset.tex || '', el);
    });

    $('#nm-res-more', container).addEventListener('click', () => {
      onReplay && onReplay({mode:'more', thread, level, count:total});
    });
    $('#nm-res-new', container).addEventListener('click', () => {
      onReplay && onReplay({mode:'new', thread, level, count:total});
    });
    $('#nm-res-print', container).addEventListener('click', () => {
      NM_EXAM.renderPrint({thread, level, count:total, seed});
    });
    $('#nm-res-setup', container).addEventListener('click', () => {
      onReplay && onReplay({mode:'setup'});
    });
    $('#nm-res-retry-wrong', container).addEventListener('click', () => {
      if(wrongs.length===0) return;
      onReplay && onReplay({mode:'wrongs', wrongs, thread, level});
    });
  },

  /* ── 4. 인쇄 학습지 ── */
  renderPrint(config){
    const { thread, level, count, seed } = config;
    const numericSeed = NM_RNG.hashSeed(seed);
    const problems = buildProblems(thread, level, count, numericSeed);
    const code = NM_EXAM.worksheetCode(config);

    // 기존 인쇄 시트 제거
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
      // 문제 카드
      const card = document.createElement('div');
      card.className = 'nm-print-item';
      const numEl  = document.createElement('div');
      numEl.className = 'nm-q-num';
      numEl.textContent = `${i+1}.`;
      const texEl = document.createElement('div');
      texEl.className  = 'nm-q-tex';
      card.appendChild(numEl);
      card.appendChild(texEl);
      renderKaTeX(p.tex || '', texEl);
      problemGrid.appendChild(card);

      // 정답
      const ak = document.createElement('div');
      ak.className = 'nm-ak-item';
      ak.textContent = `${i+1}. ${p.answer}`;
      answerGrid.appendChild(ak);
    });

    // 약간 딜레이 후 인쇄 (KaTeX 렌더 완료 대기)
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

  function showExam(cfg){
    container.innerHTML = '';
    NM_EXAM.runExam(cfg, container, result => showResult(result));
  }

  function showResult(result){
    container.innerHTML = '';
    NM_EXAM.renderResult(result, container, opts => {
      if(opts.mode === 'more'){
        // 새 문제로 바로 계속 (같은 설정)
        showExam({...result, seed:NM_RNG.newCode()});
      } else if(opts.mode === 'new'){
        showExam({...opts, seed:NM_RNG.newCode()});
      } else if(opts.mode === 'setup'){
        showSetup();
      } else if(opts.mode === 'wrongs'){
        // 오답 문제만 재시험
        const wrongProblems = opts.wrongs.map(w => w.p);
        const cfg2 = {
          thread: opts.thread, level: opts.level,
          count: wrongProblems.length, timer:0, seed: NM_RNG.newCode()
        };
        // 오답 문제를 직접 주입하는 미니 런너
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
          // 결과 보여주기
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
