// 학습용 서술형: 쓰기 → 기기 안에서 판정(v2/judge.js + data/units/<u>.judge.js) → 풀이. 저장·전송하지 않는다.
// 아이에게 "예시 답과 비슷한가요?"를 맡기지 않는다(원장 2026-09-30). 규칙으로 가릴 수 없는 답·종이 답은 선생님 확인.
import { judgeText } from './judge.js';
const TABLES = new Map();
const tableFor = (id) => { const u = String(id).split('-').slice(0, 2).join('-'); if (!TABLES.has(u)) TABLES.set(u, import(`../data/units/${u}.judge.js`).then((m) => m.judge).catch(() => null)); return TABLES.get(u); };
const esc = (s) => String(s ?? '').replace(/[&<>\"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c]));
let serial = 0;

export const WRITING_GUIDES = {
  explain: { label: '까닭 설명', steps: ['내가 내린 결론을 써요.', '관찰한 모습이나 주어진 자료를 근거로 들어요.', '과학 원리로 근거와 결론을 이어요.'], check: '과학 낱말만 쓰지 않고, 왜 그런지 설명했나요?' },
  ideas: { label: '여러 생각', steps: ['문제의 조건에 맞는 생각을 모아요.', '뜻이 같은 생각은 하나로 묶어요.', '다른 종류의 생각도 찾고, 가능한 까닭을 써요.'], check: '말만 바꾼 반복인가요, 정말 다른 생각인가요?' },
  design: { label: '방법 설계', steps: ['해결하려는 문제를 분명히 써요.', '도움이 되는 과학 원리를 골라요.', '그 원리를 어떻게 쓸지, 어떻게 확인할지 써요.'], check: '문제와 원리, 사용 방법이 서로 이어지나요?' },
};

const guideHtml = (key) => {
  const g = WRITING_GUIDES[key];
  return `<ol>${g.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol><p>${esc(g.check)}</p>`;
};

export function writtenPracticeHtml() {
  const id = `write-${++serial}`;
  return `<section class="written-practice" aria-label="서술형 연습">
    <p class="written-note">쓰고 확인을 누르면 바로 알려 줘요 · 서버로 보내지 않아요</p>
    <div class="written-tabs" role="tablist" aria-label="답안 살펴보기">
      ${[['answer', '내 답'], ['solution', '풀이'], ['criteria', '채점 기준']].map(([key, label], i) => `<button type="button" role="tab" id="${id}-${key}-tab" aria-controls="${id}-${key}" aria-selected="${i === 0}" tabindex="${i === 0 ? '0' : '-1'}" data-writing-tab="${key}">${label}</button>`).join('')}
    </div>
    <div role="tabpanel" id="${id}-answer" aria-labelledby="${id}-answer-tab" data-writing-panel="answer">
      <details class="writing-help"><summary>어떻게 쓰면 좋을까요?</summary>
        <p>문제가 묻는 것에 맞는 도움말을 골라요.</p>
        <div class="writing-guides" role="group" aria-label="답 쓰기 도움말">
          ${Object.entries(WRITING_GUIDES).map(([key, g]) => `<button type="button" data-writing-guide="${key}" aria-pressed="${key === 'explain'}">${g.label}</button>`).join('')}
        </div><div class="writing-guide-content">${guideHtml('explain')}</div>
      </details>
      <label class="writing-label" for="${id}-text">내 생각을 써요</label>
      <textarea id="${id}-text" class="writing-answer" aria-describedby="${id}-privacy" placeholder="문제가 묻는 것에 맞게 내 생각을 써 보세요."></textarea>
      <label class="writing-paper"><input type="checkbox" data-writing-paper> 종이에 답을 썼어요</label>
      <p class="written-note" id="${id}-privacy">답은 이 화면에서만 유지돼요. 화면을 나가면 사라져요. 서버에 저장하거나 전송하지 않아요.</p>
      <button type="button" class="btn" data-writing-compare>확인하기</button>
      <p class="writing-judge" role="status" aria-live="polite" hidden></p>
    </div>
    <div role="tabpanel" id="${id}-solution" aria-labelledby="${id}-solution-tab" data-writing-panel="solution" tabindex="0" hidden></div>
    <div role="tabpanel" id="${id}-criteria" aria-labelledby="${id}-criteria-tab" data-writing-panel="criteria" tabindex="0" hidden></div>
    <p class="writing-status" role="status" aria-live="polite"></p>
  </section>`;
}

export function wireWrittenPractice(card, item) {
  const root = card.querySelector('.written-practice');
  if (!root) return;
  const input = root.querySelector('.writing-answer');
  const paper = root.querySelector('[data-writing-paper]');
  const status = root.querySelector('.writing-status');
  const tabs = [...root.querySelectorAll('[data-writing-tab]')];
  const panels = [...root.querySelectorAll('[data-writing-panel]')];
  const ac = item.answerContract, rb = ac.rubric;
  let built = false, tries = 0, last = null, key = null, opened = false;
  const $j = root.querySelector('.writing-judge');
  tableFor(item.id).then((t) => { key = t?.[item.id] || null; });
  const answerCopy = () => input.value.trim() ? esc(input.value.trim()) : '종이에 쓴 내 답과 나란히 비교해요.';
  const copyHtml = () => `<h4>내가 쓴 답</h4><blockquote class="writing-copy">${answerCopy()}</blockquote>`;
  function buildReview() {
    if (built) return;
    root.querySelector('[data-writing-panel="solution"]').innerHTML = `${copyHtml()}<h4>예시 답</h4><p class="writing-sample">${esc(ac.sample)}</p><p class="written-note">표현이 달라도 과학적으로 같은 뜻이면 괜찮아요.</p><h4>풀이</h4><p>${esc(item.explanation)}</p>`;
    const need = key?.need || [], met = new Set(last?.met || []);
    root.querySelector('[data-writing-panel="criteria"]').innerHTML = `${copyHtml()}${need.length ? `<p>내 답에서 찾은 생각이에요.</p><ul class="writing-criteria">${need.map((n) => `<li class="${met.has(n.t) ? 'met' : ''}"><span aria-hidden="true">${met.has(n.t) ? '✓' : '○'}</span> ${esc(n.t)}${met.has(n.t) ? '' : ' <em>(아직)</em>'}</li>`).join('')}</ul>` : `<ul class="writing-criteria">${rb.required.map((r) => `<li>${esc(r)}</li>`).join('')}</ul><p class="written-note">이 문항은 선생님이 확인해요.</p>`}<p class="written-note">문항 기준: ${esc(rb.pass)}</p>${rb.bonus ? `<p class="written-note">더 생각해 보기: ${esc(rb.bonus)}</p>` : ''}<button type="button" class="btn" data-writing-revise>내 답 고쳐 쓰기</button>`;
    root.querySelector('[data-writing-revise]').addEventListener('click', () => { select('answer'); input.focus(); });
    built = true;
  }
  function select(key) {
    if (key !== 'answer' && !input.value.trim() && !paper.checked) {
      status.textContent = '먼저 내 생각을 써 보세요. 종이에 썼다면 “종이에 답을 썼어요”에 표시해요.';
      return false;
    }
    // 풀이·기준은 확인한 뒤에 — 첫 번째 확인에서 빠진 생각이 있으면 먼저 한 번 더 고쳐 쓰게 한다
    if (key !== 'answer' && !opened) { status.textContent = '먼저 확인하기를 눌러 보세요.'; return false; }
    if (key !== 'answer') buildReview();
    for (const tab of tabs) { const on = tab.dataset.writingTab === key; tab.setAttribute('aria-selected', String(on)); tab.tabIndex = on ? 0 : -1; }
    for (const panel of panels) panel.hidden = panel.dataset.writingPanel !== key;
    status.textContent = '';
    return true;
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => { if (!select(tab.dataset.writingTab)) input.focus(); });
    tab.addEventListener('keydown', (e) => {
      const j = e.key === 'ArrowRight' ? (i + 1) % tabs.length : e.key === 'ArrowLeft' ? (i + tabs.length - 1) % tabs.length : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : -1;
      if (j < 0) return;
      e.preventDefault();
      // 수동 활성화 탭: 방향키로 이동한 뒤 Enter/Space로 연다.
      tabs.forEach((t, k) => { t.tabIndex = k === j ? 0 : -1; });
      tabs[j].focus();
    });
  });
  const say = (cls, html) => { $j.hidden = false; $j.className = `writing-judge ${cls}`; $j.innerHTML = html; };
  root.querySelector('[data-writing-compare]').addEventListener('click', async () => {
    const text = input.value.trim();
    if (!text && paper.checked) { opened = true; say('review', '<b>종이 답은 선생님이 확인해요.</b> 풀이를 읽어 보세요.'); if (select('solution')) tabs[1].focus(); return; }
    if (!text) { status.textContent = '먼저 내 생각을 써 보세요.'; input.focus(); return; }
    await tableFor(item.id); tries++;
    last = judgeText(text, key, { tries }); built = false;
    const r = last;
    if (r.st === 'ok') { opened = true; say('ok', '<b>✓ 맞았어요!</b> 풀이도 읽어 보세요.'); if (select('solution')) tabs[1].focus(); return; }
    if (r.st === 'review') { opened = true; say('review', r.why === 'unsure' ? `<b>선생님이 한 번 더 볼게요.</b> 풀이를 읽고 ‘${esc(r.missing[0]?.t || '')}’이(가) 내 답에 있는지 확인해 보세요.` : '<b>잘 썼어요!</b> 이 답은 선생님이 확인할게요. 풀이도 읽어 보세요.'); if (select('solution')) tabs[1].focus(); return; }
    const hint = r.st === 'wrong' ? `<b>혹시 이렇게 생각했나요?</b> ${esc(r.wrong?.say || '')}` : `<b>${r.st === 'part' ? '좋아요, 조금만 더!' : '다시 써 볼까요?'}</b> ${esc(r.missing[0]?.ask || '문제가 묻는 것을 다시 읽어 봐요.')}`;
    if (tries < 2) { say(r.st, hint); input.focus(); return; }
    opened = true; say(r.st, `${hint} 풀이를 읽고 빠진 생각을 확인해 보세요.`); if (select('solution')) tabs[1].focus();
  });
  root.querySelectorAll('[data-writing-guide]').forEach((b) => b.addEventListener('click', () => {
    root.querySelectorAll('[data-writing-guide]').forEach((g) => g.setAttribute('aria-pressed', String(g === b)));
    root.querySelector('.writing-guide-content').innerHTML = guideHtml(b.dataset.writingGuide);
  }));
  const invalidate = () => {
    if (built) {
      built = false;
      panels.filter((p) => p.dataset.writingPanel !== 'answer').forEach((p) => { p.innerHTML = ''; });
      status.textContent = '답을 바꿨어요. 다시 확인하기를 눌러 보세요.';
    }
  };
  input.addEventListener('input', invalidate);
  paper.addEventListener('change', invalidate);
}
