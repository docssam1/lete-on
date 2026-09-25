// 학습용 서술형: 쓰기 → 풀이 비교 → 기준별 자기 점검. 자동 채점/저장/전송하지 않는다.
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
    <p class="written-note">학습 연습 · 자동 채점 아님</p>
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
      <button type="button" class="btn" data-writing-compare>내 답과 비교하기</button>
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
  let built = false;
  const answerCopy = () => input.value.trim() ? esc(input.value.trim()) : '종이에 쓴 내 답과 나란히 비교해요.';
  const copyHtml = () => `<h4>내가 쓴 답</h4><blockquote class="writing-copy">${answerCopy()}</blockquote>`;
  function buildReview() {
    if (built) return;
    root.querySelector('[data-writing-panel="solution"]').innerHTML = `${copyHtml()}<h4>예시 답</h4><p class="writing-sample">${esc(ac.sample)}</p><p class="written-note">표현이 달라도 과학적으로 같은 뜻이면 괜찮아요.</p><h4>풀이</h4><p>${esc(item.explanation)}</p>`;
    root.querySelector('[data-writing-panel="criteria"]').innerHTML = `${copyHtml()}<p>내 답에서 찾은 생각에 표시해요. 체크 수는 점수가 아니에요.</p><ul class="writing-criteria">${rb.required.map((r) => `<li><label><input type="checkbox" data-writing-criterion> <span>${esc(r)}</span></label></li>`).join('')}</ul><p class="written-note">문항 기준: ${esc(rb.pass)}</p>${rb.bonus ? `<p class="written-note">더 생각해 보기: ${esc(rb.bonus)} (자동 가산 없음)</p>` : ''}<p class="writing-check-count" aria-live="polite">${rb.required.length}가지 생각을 하나씩 확인해요.</p><button type="button" class="btn" data-writing-revise>내 답 고쳐 쓰기</button>`;
    root.querySelectorAll('[data-writing-criterion]').forEach((c) => c.addEventListener('change', () => {
      const n = root.querySelectorAll('[data-writing-criterion]:checked').length;
      root.querySelector('.writing-check-count').textContent = `${rb.required.length}가지 중 ${n}가지를 스스로 확인했어요. ${n === rb.required.length ? '선생님과도 답을 살펴보세요.' : '빠진 생각이 있으면 답을 고쳐 보세요.'}`;
    }));
    root.querySelector('[data-writing-revise]').addEventListener('click', () => { select('answer'); input.focus(); });
    built = true;
  }
  function select(key) {
    if (key !== 'answer' && !input.value.trim() && !paper.checked) {
      status.textContent = '먼저 내 생각을 써 보세요. 종이에 썼다면 “종이에 답을 썼어요”에 표시해요.';
      return false;
    }
    if (key !== 'answer') buildReview();
    for (const tab of tabs) { const on = tab.dataset.writingTab === key; tab.setAttribute('aria-selected', String(on)); tab.tabIndex = on ? 0 : -1; }
    for (const panel of panels) panel.hidden = panel.dataset.writingPanel !== key;
    status.textContent = key === 'answer' ? '' : '스스로 비교하는 연습이에요. 정답 판정이나 오개념 진단에 기록되지 않아요.';
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
  root.querySelector('[data-writing-compare]').addEventListener('click', () => { if (select('solution')) tabs[1].focus(); else input.focus(); });
  root.querySelectorAll('[data-writing-guide]').forEach((b) => b.addEventListener('click', () => {
    root.querySelectorAll('[data-writing-guide]').forEach((g) => g.setAttribute('aria-pressed', String(g === b)));
    root.querySelector('.writing-guide-content').innerHTML = guideHtml(b.dataset.writingGuide);
  }));
  const invalidate = () => {
    if (built) {
      built = false;
      panels.filter((p) => p.dataset.writingPanel !== 'answer').forEach((p) => { p.innerHTML = ''; });
      status.textContent = '답을 바꿨어요. 풀이와 채점 기준을 다시 비교해 보세요.';
    }
  };
  input.addEventListener('input', invalidate);
  paper.addEventListener('change', invalidate);
}
