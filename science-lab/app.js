import { binderUnitIndexHtml, binderUnitMobileIndexHtml, binderUnitNotesHtml } from './binder-unit.js?v=20261104-binder-unit';
import { mountBinderHome } from './binder-home.js?v=20261104-binder';
// 지필드 과학 탐구 랩 — 라우터·화면. 데이터는 data/curriculum.js, 3D는 engine.js + scenes/*.js
import { UNITS, unitById, DOMAINS, ORDERED, domainOf, LEVELS, levelOf, CONTESTS, contestsOf } from './data/curriculum.js';
import { Stage, Player } from './engine.js';
import { renderReport } from './report.js';
import { renderObserve } from './observe.js';
import { OBSERVE_SETS, STAGES } from './data/observe-sets.js';
import { CONTEST_GUIDE } from './data/contests.js';
import { renderContest } from './contest.js';
import { renderField } from './field.js';

const $app = document.getElementById('app');
const STORE_KEY = 'sciLab.v1';
const store = {
  read() { try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); } catch (_) { return {}; } },
  write(d) { try { localStorage.setItem(STORE_KEY, JSON.stringify(d)); } catch (_) { /* private mode */ } },
  unit(id) { return this.read()[id] || {}; },
  patch(id, p) { const d = this.read(); d[id] = { ...(d[id] || {}), ...p, updatedAt: Date.now() }; this.write(d); },
};
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const LETTERS = ['A', 'B', 'C', 'D'];

let stage = null, player = null; // 현재 유닛의 3D
let sceneRequest = 0;
let reportOff = null;             // 탐구보고서 화면 정리

function route() {
  const h = location.hash.replace(/^#\/?/, '');
  const m = h.match(/^u\/([\w-]+)(\/report)?/);
  teardown3D(); homeOff?.(); homeOff = null; unitOff?.(); unitOff = null; reportOff?.(); reportOff = null;
  if (/^field\b/.test(h)) reportOff = renderField($app, h.replace(/^field\/?/, '')).destroy;
  else if (/^contest\//.test(h)) reportOff = renderContest($app, { topbar, footer }, h.split('/')[1] || '').destroy;
  else if (/^observe\b/.test(h)) reportOff = renderObserve($app, { topbar, footer }, h.split('/')[1] || '').destroy;
  else if (m && unitById(m[1]) && m[2]) reportOff = renderReport(unitById(m[1]), $app, { topbar, footer, contest: (h.match(/[?&]ct=(\w+)/) || [])[1] || '' }).destroy;
  else if (m && unitById(m[1])) renderUnit(unitById(m[1])); else renderHome();
  window.scrollTo({ top: 0, behavior: 'instant' });
}
function teardown3D() { sceneRequest++; if (player) { player.stop(); if (player._offKey) player._offKey(); } if (stage) stage.dispose(); stage = null; player = null; }

function topbar(backHref, backLabel = '실험실') {
  const done = UNITS.filter((u) => store.unit(u.id).quizBest >= 2).length;
  return `<header class="topbar"><div class="wrap">
    <a class="brand" href="#/"><span class="mark">⚗</span>GFIELD<small>/SCIENCE-INQUIRY-LAB</small></a>
    <span class="spacer"></span>
    ${backHref ? `<a class="back" href="${backHref}">← ${esc(backLabel)}</a>` : ''}
    <span class="progress-pill">확인 ${done}/${UNITS.length}</span>
  </div></header>`;
}
function footer() {
  return `<footer><div class="wrap">
    <p>개념·활동·3D 장면은 지필드가 직접 쓰고 그렸습니다. 초등·중등 수준에 맞춘 탐구보고서 양식과 선생님 첨삭이 함께 있습니다.</p>
    <p>3D 장면은 원본 도형으로만 그렸고 외부 저작물을 포함하지 않습니다. 음성은 기기의 읽어 주기 기능(Web Speech)을 씁니다.</p>
  </div></footer>`;
}

// 홈은 서류철 차례와 미리보기. 실험·관찰·대회·보고서 라우터는 유지한다.
let homeOff = null, unitOff = null;
function renderHome() {
  homeOff = mountBinderHome($app, { store, footer });
}

function renderUnit(u) {
  const d = domainOf(u), mine = ORDERED.filter((x) => domainOf(x) === d);
  const idx = ORDERED.indexOf(u), prev = ORDERED[idx - 1], next = ORDERED[idx + 1];   // 이전·다음도 영역 순서
  const s = store.unit(u.id);
  $app.innerHTML = `<div class="science-binder binder-experiment"><a class="binder-skip binder-unit-skip" href="#/u/${u.id}" data-to="concept">개념 본문으로 건너뛰기</a>${topbar('#/', '서류철')}
  <main class="opened" style="--tab:${d.color}">
    <div class="wrap unit-head folder-label">
      <span class="label-tab">${d.en}</span>
      <div class="crumb"><span class="tag" style="background:${d.color};color:#fff;border-radius:999px;padding:2px 8px;font-size:11px;font-weight:700">${esc(d.title)}</span><span>${mine.indexOf(u) + 1}/${mine.length}</span><span>·</span><span class="lv">${esc(levelOf(u).title)}</span><span>·</span><span>EXP-${String(ORDERED.indexOf(u) + 1).padStart(2, '0')}</span></div>
      <h1>${esc(u.title)}</h1><p class="sub">${esc(u.sub)}</p>
      ${u.note ? `<div class="note">${esc(u.note)}</div>` : ''}
    </div>
    <nav class="tabs" aria-label="서류철 안의 자료"><div class="wrap">
      <a href="#/u/${u.id}" data-to="concept" class="on">① 개념</a><a href="#/u/${u.id}" data-to="video">② 3D 실험</a><a href="#/u/${u.id}" data-to="activity">③ 탐구 활동</a><a href="#/u/${u.id}" data-to="discuss">④ 토론</a><a href="#/u/${u.id}" data-to="quiz">⑤ 확인</a><a href="#/u/${u.id}/report" class="report-tab">⑥ 탐구보고서</a>
    </div></nav>
    ${binderUnitMobileIndexHtml(u)}
    <div class="binder-unit-layout">${binderUnitIndexHtml(u)}<div class="binder-unit-pages">
    <section class="wrap section sheet" id="concept" tabindex="-1"><h2><span class="step">STEP 1</span>개념</h2><p class="lead">${esc(u.concept.lead)}</p>
      <div class="points">${u.concept.points.map(([b, t]) => `<div class="point"><b>${esc(b)}</b><span>${esc(t)}</span></div>`).join('')}</div>
      <div class="terms">${u.concept.terms.map(([t, d]) => `<span class="term"><b>${esc(t)}</b>${esc(d)}</span>`).join('')}</div>
    </section>
    <section class="wrap section sheet" id="video"><h2><span class="step">STEP 2</span>3D 실험 보기</h2><p class="lead">재생을 누르면 실험이 한 단계씩 그려집니다. 화면을 끌면 돌려 볼 수 있고, 자막을 누르면 그 장면으로 갑니다.</p>
      <div class="stage">
        <canvas id="stage" aria-label="3D 실험 장면"></canvas>
        <div class="caption" id="caption"><span class="idx">장면 1</span>불러오는 중…</div>
        <div class="dots" id="dots"></div>
        <div class="controls">
          <button class="btn primary" id="btnPlay">▶ 재생</button>
          <button class="btn" id="btnPrev" title="이전 장면">⏮</button>
          <button class="btn" id="btnNext" title="다음 장면">⏭</button>
          <button class="btn" id="btnReplay" title="처음부터">↺ 처음</button>
          <span class="sp"></span>
          <button class="btn" id="btnVoice" aria-pressed="false" title="읽어 주기">🔈 음성</button>
          <select id="speed" aria-label="속도"><option value="0.75">0.75×</option><option value="1" selected>1×</option><option value="1.5">1.5×</option></select>
        </div>
      </div>
      <div class="transcript" id="transcript"></div>
      <p class="hint">음성을 켜면 자막을 읽어 줘요. 멈췄다 재생하면 현재 장면의 자막을 처음부터 다시 읽어요. 소리가 나지 않을 때도 자막으로 배울 수 있어요.</p>
    </section>
    <section class="wrap section sheet" id="activity"><h2><span class="step">STEP 3</span>탐구 활동 — ${esc(u.activity.title)}</h2>
      <div class="activity">
        <div class="box"><h3>절차</h3><ol>${u.activity.steps.map((t) => `<li>${esc(t)}</li>`).join('')}</ol></div>
        <div>
          <div class="box" style="margin-bottom:12px"><h3>준비물</h3><ul>${u.activity.materials.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>
          <div class="box"><h3>변인표</h3><div class="vars">
            <div class="var diff"><b>다르게</b><span>${u.activity.vars.diff.map(esc).join(' / ')}</span></div>
            <div class="var measure"><b>측정</b><span>${u.activity.vars.measure.map(esc).join(' / ')}</span></div>
            <div class="var same"><b>같게</b><span>${u.activity.vars.same.map(esc).join(' / ')}</span></div>
          </div></div>
        </div>
      </div>
    </section>
    <section class="wrap section sheet" id="discuss"><h2><span class="step">STEP 4</span>토론 · 반론</h2><p class="lead">먼저 스스로 답을 말해 본 뒤 힌트를 엽니다. 반론은 "근거가 무엇입니까?", "그 실험만으로 알 수 있습니까?"에서 시작합니다.</p>
      <div class="discuss">${u.discuss.map((d) => `<details><summary>${esc(d.q)}</summary><p>${esc(d.hint)}</p></details>`).join('')}</div>
    </section>
    <section class="wrap section sheet" id="quiz"><h2><span class="step">STEP 5</span>확인 문제</h2><p class="lead">세 문제. 고르면 바로 풀이가 보입니다.${s.quizBest != null ? ` 최고 기록 ${s.quizBest}/3.` : ''}</p>
      <div class="quiz" id="quiz-items">${u.quiz.map((q, qi) => `<div class="q" data-q="${qi}"><p class="stem">${qi + 1}. ${esc(q.q)}</p><div class="choices">${q.c.map((c, ci) => `<button data-c="${ci}"><span class="l">${LETTERS[ci]}</span><span>${esc(c)}</span></button>`).join('')}</div><p class="why" hidden></p></div>`).join('')}</div>
      <p class="score" id="score"></p>
    </section>
    <section class="wrap section" id="report-cta"><a class="report-cta" href="#/u/${u.id}/report"><span class="step">STEP 6</span><b>탐구보고서 쓰기 →</b><span>${levelOf(u).id === 'mid' ? '중등 양식 · 반복 측정·평균·그래프 · A4 2~3장' : '초등 양식 · 공정한 실험을 숫자로 · A4 1장'} · 선생님 첨삭</span></a></section>
    <div class="wrap unit-nav">
      ${prev ? `<a href="#/u/${prev.id}"><b>← 이전 자료</b>${esc(prev.title)}</a>` : '<span></span>'}
      ${next ? `<a class="next" href="#/u/${next.id}"><b>다음 자료 →</b>${esc(next.title)}</a>` : `<a class="next" href="#/"><b>서류철로</b>전체 자료</a>`}
    </div>
    </div>${binderUnitNotesHtml(u)}</div>
  </main>${footer()}</div>`;

  // 탭: 같은 페이지 안의 섹션으로 스크롤
  let active = true;
  const tabs = [...$app.querySelectorAll('.tabs a[data-to]')];
  const links = [...tabs, ...$app.querySelectorAll('.binder-unit-skip')];
  const scrollSection = (event) => {
    event.preventDefault();
    if (!active) return;
    const target = document.getElementById(event.currentTarget.dataset.to);
    target?.scrollIntoView({ behavior: typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    if (event.currentTarget.classList.contains('binder-unit-skip')) target?.focus({ preventScroll: true });
  };
  links.forEach((link) => link.addEventListener('click', scrollSection));
  const io = new IntersectionObserver((entries) => {
    if (!active) return;
    entries.forEach((entry) => { if (entry.isIntersecting) tabs.forEach((link) => link.classList.toggle('on', link.dataset.to === entry.target.id)); });
  }, { rootMargin: '-40% 0px -55% 0px' });
  ['concept', 'video', 'activity', 'discuss', 'quiz'].forEach((id) => io.observe(document.getElementById(id)));
  unitOff = () => { active = false; io.disconnect(); links.forEach((link) => link.removeEventListener('click', scrollSection)); };

  mount3D(u);
  mountQuiz(u);
}

async function mount3D(u) {
  const canvas = document.getElementById('stage');
  const $cap = document.getElementById('caption'), $dots = document.getElementById('dots'), $tr = document.getElementById('transcript');
  const $play = document.getElementById('btnPlay'), $voice = document.getElementById('btnVoice'), $speed = document.getElementById('speed');
  const request = ++sceneRequest, current = () => request === sceneRequest;
  let mod, ownedStage, ownedPlayer;
  try {
    ownedStage = new Stage(canvas); ownedPlayer = new Player(ownedStage); stage = ownedStage; player = ownedPlayer;
    mod = (await import(`./scenes/${u.scene}.js`)).default;
    if (!current()) return;
    const loaded = await ownedPlayer.load(mod);
    if (!current() || loaded === false) return;
  } catch (err) {
    if (!current()) return;
    teardown3D();
    console.error(err); $cap.innerHTML = `<span class="idx">오류</span>3D 장면을 불러오지 못했습니다. (${esc(err.message)})`; return;
  }
  $tr.innerHTML = mod.beats.map((b, i) => `<button data-i="${i}"><span class="n">${i + 1}</span><span>${esc(b.text)}</span></button>`).join('');
  $dots.innerHTML = mod.beats.map(() => '<i></i>').join('');
  const sync = () => {
    if (!current()) return;
    const i = ownedPlayer.index, b = mod.beats[i];
    if (!b) return; // 빠르게 유닛을 넘길 때 앞 유닛의 재생기가 부르는 경우
    $cap.innerHTML = `<span class="idx">장면 ${i + 1}/${mod.beats.length}</span>${esc(b.text)}`;
    $play.textContent = ownedPlayer.playing ? '❚❚ 멈춤' : (ownedPlayer.done ? '↺ 다시' : '▶ 재생');
    [...$dots.children].forEach((d, k) => { d.className = k < i ? 'done' : k === i ? 'cur' : ''; });
    [...$tr.children].forEach((bt, k) => bt.classList.toggle('on', k === i));
    $voice.setAttribute('aria-pressed', String(ownedPlayer.voice));
    if (ownedPlayer.done && !store.unit(u.id).videoDone) { store.patch(u.id, { videoDone: true }); }
  };
  ownedPlayer.onChange = sync; sync();
  $play.onclick = () => { if (current()) ownedPlayer.toggle(); };
  document.getElementById('btnPrev').onclick = () => { if (current()) ownedPlayer.prev(); };
  document.getElementById('btnNext').onclick = () => { if (current()) ownedPlayer.next(); };
  document.getElementById('btnReplay').onclick = () => { if (current()) ownedPlayer.replay(); };
  $voice.onclick = () => { if (current()) ownedPlayer.setVoice(!ownedPlayer.voice); };
  $speed.onchange = () => { if (current()) ownedPlayer.setSpeed(parseFloat($speed.value)); };
  $tr.onclick = (e) => { if (!current()) return; const bt = e.target.closest('button'); if (bt) ownedPlayer.goto(+bt.dataset.i, false); };
  document.addEventListener('keydown', onKey);
  function onKey(e) { if (!current() || e.target.matches('input,select,textarea')) return; if (e.key === ' ') { e.preventDefault(); ownedPlayer.toggle(); } if (e.key === 'ArrowRight') ownedPlayer.next(); if (e.key === 'ArrowLeft') ownedPlayer.prev(); }
  ownedPlayer._offKey = () => document.removeEventListener('keydown', onKey);
}

function mountQuiz(u) {
  const $quiz = document.getElementById('quiz-items'), $score = document.getElementById('score');
  const answered = new Map();
  $quiz.addEventListener('click', (e) => {
    const bt = e.target.closest('button'); if (!bt) return;
    const $q = bt.closest('.q'); const qi = +$q.dataset.q; if (answered.has(qi)) return;
    const q = u.quiz[qi], ci = +bt.dataset.c; answered.set(qi, ci === q.a);
    [...$q.querySelectorAll('button')].forEach((b, k) => { b.disabled = true; if (k === q.a) b.classList.add('correct'); else if (k === ci) b.classList.add('wrong'); });
    const $why = $q.querySelector('.why'); $why.hidden = false; $why.textContent = (ci === q.a ? '정답! ' : `아쉽네요. 정답은 ${LETTERS[q.a]}. `) + q.why;
    if (answered.size === u.quiz.length) {
      const score = [...answered.values()].filter(Boolean).length; const best = Math.max(score, store.unit(u.id).quizBest || 0);
      store.patch(u.id, { quizBest: best, lastScore: score });
      $score.textContent = `${score}/${u.quiz.length} ${score >= 2 ? '— 통과! 다음 단원으로 가도 좋아요.' : '— 개념을 한 번 더 읽고 다시 풀어 보세요.'}`; $score.className = 'score' + (score >= 2 ? ' pass' : '');
    }
  });
}

addEventListener('hashchange', route);
route();
