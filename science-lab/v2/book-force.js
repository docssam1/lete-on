// 힘 단원의 실제 수행 기록과 수평 모형을 함께 안내하는 교재.
import { findLifeItem, lifeQuestion } from './book-life.js';
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export function renderForceChapter(ch, art, pool, { teacher = false, live = false } = {}) {
  const pages = [], p = (s) => `<p>${esc(s)}</p>`;
  const answer = (text, lines = 3) => teacher ? `<div class="bk-ans">${esc(text)}</div>` : `<div class="bk-lines">${'<i></i>'.repeat(lines)}</div>`;
  const field = (label, text, lines = 3) => `<h3>${esc(label)}</h3>${answer(text, lines)}`;
  const table = (heads, rows) => `<table class="bk-tbl"><thead><tr>${heads.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const open = () => live ? '<div class="bk-web"><button type="button" class="bk-pop-btn" data-pop="lab">수평 모형 실험 열기</button></div>' : '';
  const page = (title, body) => { const n = pages.length + 1; pages.push(`<section class="bk-page ${n % 2 ? 'odd' : 'even'}"><div class="bk-life-watermark" aria-hidden="true">GFIELD · 지필드</div><div class="bk-band"><span class="bk-band-no">01</span><span class="bk-band-t">힘과 우리 생활</span><span class="bk-band-u">${teacher ? '교사용 · 예시와 지도' : '학생용 · 실제 관찰과 기록'}</span></div><div class="bk-grid"><div class="bk-main"><h2>${esc(title)}</h2>${body}</div></div><footer class="bk-foot"><span class="bk-pn">${n}</span><span>${esc(ch.book)} · 3-1</span>${teacher ? '<em>교사용</em>' : ''}</footer></section>`); };
  page(ch.title, `<div class="bk-life-diagram">${art.opener}</div>${ch.intro.map(p).join('')}<h3>미리 생각하기</h3>${ch.think.map((x) => p(x.q) + answer(x.a, 3)).join('')}${p(ch.goal)}<p class="bk-life-reminder">수평 모형의 관찰과 실제로 힘을 느끼고 저울을 쓰는 활동을 나누어 기록해요.</p>`);
  for (const a of ch.activities) {
    page(`${a.title} · 계획과 실행`, p(a.question) + field('먼저 예상하고 까닭 쓰기', '비교할 조건과 예상되는 결과를 연결한다. 예상이 실제 결과와 달라도 바로잡아 쓰게 하지 않는다.', 2)
      + `<h3>계획 예시 · 내 활동에 맞게 정해요</h3>${table(['비교할 내용', '계획 예시'], [['다르게 할 것', a.change], ['같게 할 것', a.same], ['관찰·측정 방법', a.measure]])}`
      + `<h3>준비물</h3>${p(a.materials)}<ol class="bk-life-steps">${a.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>`
      + (a.key === 'balance' ? p('화면의 수평 모형은 관찰 전에 잠금 받침으로 지지해요. 예상을 고른 뒤 관찰하고 모형 결과라고 표시해요. 실제 수평대에서도 직접 비교해요.') + open() : ''));
    page(`${a.title} · 실제 기록과 결론`, table(['활동 날짜', '물체·실험 장소'], [['', '']]) + field('내가 실제로 정한 조건·방법', '예시와 다르게 정한 조건도 적는다. 학생이 실제로 한 방법과 관찰을 확인한다.', 2)
      + table(a.recordHeads, Array.from({ length: 4 }, () => a.recordHeads.map(() => '')))
      + (teacher ? `<div class="bk-ans">${esc(a.teacher)}</div>` : '') + p(a.reflection)
      + field('기록을 근거로 알게 된 점', '자신이 실제로 관찰한 사실을 근거로 설명한다. 모형 결과를 실제 측정값으로 옮기지 않는다.', 3)
      + field('처음 예상과 비교·다시 살펴볼 점', '예상과 다른 결과도 보존하고 조건과 사용 방법을 살펴 다음 관찰을 정한다.', 2));
  }
  for (let i = 0; i < ch.concepts.length; i += 2) page(`개념을 기록과 연결하기 ${i / 2 + 1}`, ch.concepts.slice(i, i + 2).map(([t, text]) => `<h3>${esc(t)}</h3>${p(text)}${field('내 활동에서 찾은 근거', '학생의 실제 기록에서 날짜·물체·관찰한 사실이나 측정값을 가리키며 설명하게 한다.', 4)}`).join(''));
  page('생활 속 지레·빗면 조사 자료', field('조사한 도구 이름·사용하는 곳', '실제로 본 도구나 확인한 자료를 적는다.', 3) + field('어떤 일을 도와주나요?', '그 도구의 사용 방법과 도움을 연결한다. 모든 지레가 항상 힘을 줄인다고 일반화하지 않는다.', 4) + field('글·그림으로 설명할 내용', '직접 관찰한 내용과 자료에서 확인한 내용을 구별한다.', 4) + field('확인한 자료·출처', '자료 제목·쪽수 또는 사이트·확인한 날짜를 적는다.', 3));
  page('조사한 자료를 나누고 고치기', p('교재나 직접 만든 자료를 보여 주며 발표해요. 실제로 공유한 뒤 기록해요.') + field('공유한 날짜·대상·방법', '실제로 발표하거나 보여 준 뒤 적는다. 파일 내려받기는 공유 완료 증거가 아니다.', 3) + field('내가 설명한 내용과 근거', '자기 관찰이나 조사 자료를 가리키며 도구의 도움을 설명한다.', 4) + field('들은 질문', '들은 질문을 그대로 적고 아직 모르는 점을 구분한다.', 3) + field('질문을 듣고 고치거나 더 알아볼 점', '친구의 질문과 근거를 연결해 자료를 보완한다.', 3));
  page('믿을 수 있는 비교를 설계하기', p(ch.creative.q) + answer(ch.creative.a, 5) + p(ch.gifted.q) + answer(ch.gifted.a, 5) + `<h3>실제 활동의 주의점</h3><ul>${ch.caution.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>`);
  page('힘과 우리 생활 탐구보고서', table(['이름', '날짜'], [['', '']]) + ['알아볼 문제·실제로 한 활동', '바꾼 조건·같게 한 조건', '실제 관찰과 저울 측정값·단위', '관찰을 근거로 쓴 결론·예상과 비교', '도구 조사 출처·실제 공유와 들은 질문'].map((t) => field(t, '학생의 실제 기록을 근거로 확인한다. 모형 값과 실제 측정값을 구분한다.', 3)).join(''));
  page('형성평가 · 개념 점검', '<p>자료 문제의 정답과 실제 활동의 완료는 구별해요.</p><ol class="bk-items">' + ch.formative.items.map((k, i) => lifeQuestion(findLifeItem(pool, k), i + 1, teacher)).join('') + '</ol>' + p(ch.formative.standards.join(' / ')));
  for (let i = 0; i < ch.check.length; i += 3) page(`교과 확인 문제 ${Math.floor(i / 3) + 1}`, '<p>검수한 원문과 각각 짝지어 직접 만든 확인 문제예요.</p><ol class="bk-items">' + ch.check.slice(i, i + 3).map((k, j) => lifeQuestion(findLifeItem(pool, k), i + j + 1, teacher)).join('') + '</ol>');
  return `<div data-unit="${ch.unit}" class="bk bk-force bk-life ${teacher ? 'bk-t' : ''} ${live ? 'live' : ''}" style="--bk-theme:${ch.theme}">${pages.join('')}</div>`;
}
