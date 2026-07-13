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
        {label:'9까지의 수',thread:'NS1',level:1,desc:'1~9 읽기'},
        {label:'모으기 · 가르기',thread:'NS2',level:2,desc:'수 가르기'},
        {label:'덧셈 기초',thread:'AD1',level:1,desc:'합 9 이하'},
        {label:'뺄셈 기초',thread:'SB1',level:1,desc:'9 이하 뺄셈'},
      ]},
      '1B':{label:'1학년 2학기',emoji:'🌿',subs:[
        {label:'보수 10 찾기',thread:'NS3',level:2,desc:'더해서 10'},
        {label:'받아올림 덧셈',thread:'AD2',level:1,desc:'합 10 이상'},
        {label:'세 수 덧셈',thread:'AD2',level:2,desc:'세 수 더하기'},
        {label:'몇십 덧셈',thread:'AD4',level:1,desc:'10·20·30 +'},
      ]},
      '2A':{label:'2학년 1학기',emoji:'🌷',subs:[
        {label:'(두)+(한) 올림없음',thread:'AD3',level:1,desc:'받아올림 없음'},
        {label:'(두)+(한) 올림있음',thread:'AD3',level:2,desc:'받아올림'},
        {label:'(두)−(한) 내림없음',thread:'SB3',level:1,desc:'받아내림 없음'},
        {label:'(두)−(한) 내림있음',thread:'SB3',level:2,desc:'받아내림'},
      ]},
      '2B':{label:'2학년 2학기',emoji:'🌻',subs:[
        {label:'(두)+(두)',thread:'AD5',level:2,desc:'두 자리 덧셈'},
        {label:'(두)−(두)',thread:'SB4',level:2,desc:'두 자리 뺄셈'},
        {label:'구구단 2·3단',thread:'ML2',level:1,desc:'2단, 3단'},
        {label:'구구단 4·5단',thread:'ML2',level:2,desc:'4단, 5단'},
      ]},
      '3A':{label:'3학년 1학기',emoji:'🌼',subs:[
        {label:'세 자리 덧셈',thread:'AD6',level:2,desc:'3자리+3자리'},
        {label:'세 자리 뺄셈',thread:'SB6',level:1,desc:'3자리−3자리'},
        {label:'구구단 전체',thread:'ML4',level:1,desc:'2~9단 혼합'},
        {label:'나눗셈 기초',thread:'DV2',level:1,desc:'나누어 떨어짐'},
      ]},
      '3B':{label:'3학년 2학기',emoji:'🍀',subs:[
        {label:'구구단 6·7단',thread:'ML3',level:1,desc:'6단, 7단'},
        {label:'구구단 8·9단',thread:'ML3',level:2,desc:'8단, 9단'},
        {label:'□ 채우기',thread:'ML4',level:2,desc:'빈칸 인수 찾기'},
        {label:'(두)×(한)',thread:'ML6',level:2,desc:'두 자리 곱셈'},
        {label:'나머지 있는 나눗셈',thread:'DV3',level:1,desc:'나머지 있음'},
      ]},
      '4A':{label:'4학년 1학기',emoji:'🌺',subs:[
        {label:'(세)÷(한) 나머지없음',thread:'DV4',level:1,desc:'나머지 없음'},
        {label:'(세)÷(한) 나머지있음',thread:'DV4',level:2,desc:'나머지 있음'},
        {label:'배수 × ÷ 2',thread:'ML1',level:1,desc:'두 배와 반으로'},
        {label:'몇백 덧셈',thread:'AD4',level:1,desc:'몇십·몇백 덧셈'},
      ]},
      '4B':{label:'4학년 2학기',emoji:'🍁',subs:[
        {label:'소수 덧·뺄 (1자리)',thread:'DC1',level:1,desc:'소수 한 자리'},
        {label:'소수 덧·뺄 (2자리)',thread:'DC1',level:2,desc:'소수 두 자리'},
        {label:'분수 덧·뺄 (동분모)',thread:'FR1',level:1,desc:'같은 분모'},
        {label:'보정 빼기 7·8·9',thread:'SB5',level:1,desc:'더 빼고 돌려받기'},
      ]},
      '5A':{label:'5학년 1학기',emoji:'⭐',subs:[
        {label:'이분모 분수 덧·뺄',thread:'FR4',level:1,desc:'다른 분모 통분'},
        {label:'짝 묶어 더하기',thread:'AD8',level:1,desc:'짝 10 묶기'},
        {label:'식 변형 끼리끼리',thread:'SB7',level:1,desc:'같은 자리 묶기'},
      ]},
      '5B':{label:'5학년 2학기',emoji:'🌙',subs:[
        {label:'이분모 분수 심화',thread:'FR4',level:1,desc:'다른 분모 통분'},
        {label:'소수 덧·뺄 심화',thread:'DC1',level:2,desc:'소수 두 자리'},
        {label:'10 만들기 전략',thread:'SB7',level:2,desc:'받아올림 그룹화'},
      ]},
      '6A':{label:'6학년 1학기',emoji:'🏆',subs:[
        {label:'이분모 분수 종합',thread:'FR4',level:1,desc:'다른 분모 통분'},
        {label:'(세)÷(한) 심화',thread:'DV4',level:2,desc:'나머지 있음'},
        {label:'보수 100 응용',thread:'NS4',level:2,desc:'더해서 100'},
      ]},
      '6B':{label:'6학년 2학기',emoji:'🎓',subs:[
        {label:'분수 종합',thread:'FR1',level:1,desc:'동분모 분수'},
        {label:'이분모 분수 종합',thread:'FR4',level:1,desc:'이분모 분수'},
        {label:'소수 종합',thread:'DC1',level:2,desc:'소수 두 자리'},
      ]},
    };
    const GRADE_ORDER = ['1A','1B','2A','2B','3A','3B','4A','4B','5A','5B','6A','6B'];
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

    function showGradePick(){
      container.innerHTML = `
<div class="nm-ex-form-wrap">
  <div class="nm-ex-form-head">
    <button class="nm-ex-back-btn" id="nm-ex-back-grade">← 뒤로</button>
    <span class="nm-ex-form-title">학년·학기 선택</span>
  </div>
  <div class="nm-ex-form-body">
    <div class="nm-ex-grade-grid">
      ${GRADE_ORDER.map(g => `
      <button class="nm-ex-grade-btn" data-grade="${g}">
        <span class="nm-ex-grade-key">${GRADES[g].emoji} ${g}</span>
        <span class="nm-ex-grade-sub">${GRADES[g].label}</span>
      </button>`).join('')}
    </div>
  </div>
</div>`;
      container.querySelector('#nm-ex-back-grade').addEventListener('click', showSectionPick);
      container.querySelectorAll('.nm-ex-grade-btn').forEach(btn => {
        btn.addEventListener('click', () => showGradeTopics(btn.dataset.grade));
      });
    }

    function showGradeTopics(gradeKey){
      const g = GRADES[gradeKey];
      let selIdx = 0;
      let chosenCount = 20;

      function render(){
        container.innerHTML = `
<div class="nm-ex-form-wrap">
  <div class="nm-ex-form-head">
    <button class="nm-ex-back-btn" id="nm-ex-back-topics">← 뒤로</button>
    <span class="nm-ex-form-title">${g.emoji} ${gradeKey} — ${g.label}</span>
  </div>
  <div class="nm-ex-form-body">
    <p class="nm-ex-label">주제 선택</p>
    <div class="nm-ex-grade-topics">
      ${g.subs.map((s,i) => `
      <button class="nm-ex-topic-chip${i===selIdx?' nm-ex-topic-sel':''}" data-idx="${i}">
        <span class="nm-ex-tchip-name">${esc(s.label)}</span>
        <span class="nm-ex-tchip-desc">${esc(s.desc)}</span>
      </button>`).join('')}
    </div>
    <p class="nm-ex-label" style="margin-top:18px">문항 수</p>
    <div class="nm-ex-count-btns">
      ${COUNT_OPTS.map(n => `<button class="nm-ex-cnt-btn${n===chosenCount?' sel':''}" data-n="${n}">${n}문항</button>`).join('')}
    </div>
    <div class="nm-ex-actions" style="margin-top:22px">
      <button id="nm-ex-grid-start" class="nm-ex-btn-primary">▶ 학습 시작</button>
    </div>
  </div>
</div>`;

        container.querySelector('#nm-ex-back-topics').addEventListener('click', showGradePick);

        container.querySelectorAll('.nm-ex-topic-chip').forEach(chip => {
          chip.addEventListener('click', () => { selIdx = parseInt(chip.dataset.idx); render(); });
        });

        container.querySelectorAll('.nm-ex-cnt-btn').forEach(btn => {
          btn.addEventListener('click', () => { chosenCount = parseInt(btn.dataset.n); render(); });
        });

        container.querySelector('#nm-ex-grid-start').addEventListener('click', () => {
          const sub = g.subs[selIdx];
          onStart && onStart({
            thread: sub.thread,
            level:  sub.level,
            count:  chosenCount,
            timer:  0,
            seed:   NM_RNG.newCode(),
            layout: 'grid',
            label:  sub.label,
          });
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
    const { thread, level, count, seed } = config;
    const numericSeed = NM_RNG.hashSeed(seed);
    const problems = buildProblems(thread, level, count, numericSeed);
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
      renderKaTeX(p.tex || '', texEl);
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

  /* ── 그리드 학습지 (11math 스타일, 전체 문제 동시 표시) ── */
  function runGridExam(cfg){
    const { thread, level, count, seed, label } = cfg;
    const numericSeed = NM_RNG.hashSeed(seed);
    const problems = buildProblems(thread, level, count, numericSeed);
    const inputs = [];
    const code = NM_EXAM.worksheetCode(cfg);

    container.innerHTML = `
<div class="nm-grid-sheet">
  <div class="nm-grid-header">
    <span class="nm-grid-badge">${esc(label || thread)}</span>
    <span class="nm-grid-code">${esc(code)}</span>
  </div>
  <div class="nm-prob-grid" id="nm-prob-grid"></div>
  <div class="nm-grid-actions" id="nm-grid-actions">
    <button id="nm-grid-grade" class="nm-ex-btn-primary">채점하기 ✓</button>
    <button id="nm-grid-back" class="nm-ex-btn-secondary">주제 바꾸기</button>
  </div>
</div>`;

    const grid = container.querySelector('#nm-prob-grid');
    problems.forEach((p, i) => {
      const cell = document.createElement('div');
      cell.className = 'nm-prob-cell';

      const numEl = document.createElement('span');
      numEl.className = 'nm-prob-num';
      numEl.textContent = i + 1;

      const texEl = document.createElement('div');
      texEl.className = 'nm-prob-tex';

      const inp = document.createElement('input');
      inp.className = 'nm-prob-ans';
      inp.type = 'number';
      inp.inputMode = 'numeric';
      inp.placeholder = '?';
      inp.autocomplete = 'off';

      cell.appendChild(numEl);
      cell.appendChild(texEl);
      cell.appendChild(inp);
      grid.appendChild(cell);

      renderKaTeX(p.tex || '', texEl);
      inputs.push(inp);
    });

    inputs.forEach((inp, i) => {
      inp.addEventListener('keydown', e => {
        if(e.key === 'Enter' && i + 1 < inputs.length){ inputs[i+1].focus(); }
      });
    });

    container.querySelector('#nm-grid-back').addEventListener('click', showSetup);

    container.querySelector('#nm-grid-grade').addEventListener('click', function gradeAll(){
      this.removeEventListener('click', gradeAll);
      let score = 0;
      const cells = container.querySelectorAll('.nm-prob-cell');
      problems.forEach((p, i) => {
        const raw = inputs[i].value.trim();
        const val = raw === '' ? NaN : parseFloat(raw);
        const correct = val === p.answer;
        if(correct) score++;
        cells[i].classList.add(correct ? 'correct' : 'wrong');
        inputs[i].disabled = true;
        const fb = document.createElement('div');
        fb.className = 'nm-prob-feedback';
        fb.textContent = correct ? '✓' : String(p.answer);
        cells[i].appendChild(fb);
      });
      const pct = Math.round(score / problems.length * 100);
      const actionsDiv = container.querySelector('#nm-grid-actions');
      actionsDiv.innerHTML = `
<div class="nm-grid-score ${pct>=80?'nm-grid-pass':'nm-grid-fail'}">${score}/${problems.length} (${pct}%)</div>
<button id="nm-grid-again" class="nm-ex-btn-primary">계속 연습 🔄</button>
<button id="nm-grid-back2" class="nm-ex-btn-secondary">주제 바꾸기</button>
<button id="nm-grid-print" class="nm-ex-btn-ghost">🖨️ 인쇄</button>`;
      container.querySelector('#nm-grid-again').addEventListener('click', () => {
        runGridExam({...cfg, seed: NM_RNG.newCode()});
      });
      container.querySelector('#nm-grid-back2').addEventListener('click', showSetup);
      container.querySelector('#nm-grid-print').addEventListener('click', () => {
        NM_EXAM.renderPrint({thread, level, count, seed});
      });
    });
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
