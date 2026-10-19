import { SEMS_2022, bankFor2022, assessmentsFor2022 } from './curriculum-2022.js';
import { groupLabel } from './source-presentation.js';

const roman = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ'];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function catalogNavigation(current) {
  return `<nav class="bank-catalog-nav" aria-label="문제은행 차례">${[
    ['2022', '#/bank', '2022 개정 차례'], ['legacy', '#/bank/legacy', '기존 자료 차례'],
  ].map(([key, href, label]) => `<a class="btn${current === key ? ' primary' : ''}" href="${href}"${current === key ? ' aria-current="page"' : ''}>${label}</a>`).join('')}</nav>`;
}

export function curriculumBankHtml(bank) {
  const resources = SEMS_2022.flatMap((s) => s.units).map((u) => bankFor2022(u.position, bank)).filter(Boolean);
  const withOriginals = resources.filter((b) => b.n > 0), authoredOnly = resources.filter((b) => b.sourcePending);
  const originals = resources.reduce((n, b) => n + b.n, 0);
  const excerptTitles = SEMS_2022.flatMap(s => s.units).filter(u => bankFor2022(u.position, bank)?.sourceExcerptOnly).map(u => u.title);
  return `<main class="wrap bank bank-2022">
    ${catalogNavigation('2022')}
    <p class="step-label">초등 과학 3~6학년 · 2022 개정</p><h2>32단원 문제은행</h2>
    <p class="lead">8개 학기의 단원 순서예요. 현재 ${withOriginals.length}개 단원의 원문 ${originals}문항과 짝 유사문항을 풀 수 있어요.${authoredOnly.length ? ` 별도로 ${authoredOnly.length}개 단원의 창작 학습 ${authoredOnly.reduce((n,b)=>n+b.supplement,0)}문항을 제공해요. 이 단원의 원문은 준비 중이에요.` : ''}${excerptTitles.length?` ${esc(excerptTitles.join('·'))} 단원은 옛단원 연계 발췌를 제공하며 현행 전체 원문은 준비 중이에요.`:''} 나머지 단원은 차례로 준비하고 있어요.</p>
    ${SEMS_2022.map((s) => `<section class="bank-sem"><h3>${s.sem.replace('-', '학년 ')}학기</h3><ol class="bank-units">${s.units.map((u) => {
      const b = bankFor2022(u.position, bank);
      return `<li class="${b ? 'open' : 'wait'}" data-curriculum-unit="${u.key}"><span class="bn">${roman[u.no - 1]}</span><span class="bt">${esc(u.title)}</span>${b
        ? `<span class="bc">${b.sourcePending ? `창작 ${b.supplement} · 원문 준비 중` : `${b.sourceExcerptOnly?'연계발췌 ':''}원문 ${b.n} · 짝 ${b.n}${b.supplement ? ` · 보충 ${b.supplement}` : ''}${b.sourceScopeNote?` · ${esc(b.sourceScopeNote)}`:''}${b.reviewOnly?` · 원문${b.reviewOnly}개 자동 채점 보류`: ''}` }</span><span class="bs">${b.sets.map((n) => `<a href="#/${b.contentId}/exam/${n}">${esc(groupLabel(b, n))}</a>`).join('')}<a href="#/${b.contentId}/sub/E1">소단원</a>${!b.lesson&&(b.bookAvailable||b.paperAvailable)?`<a href="#/${b.contentId}/start">${b.bookAvailable?'교재·문제은행':'문제은행'}</a><a href="#/${b.contentId}/print/student">${esc(b.paperLabel)}</a>`:''}${b.lesson ? `${b.bookPending ? '' : `<a href="#/${b.contentId}/start">수업·교재</a>`}<a href="#/${b.contentId}/1">5단계 탐구</a><a href="#/${b.contentId}/2/lab">${esc(b.labLabel || '관찰·그림 기록')}</a>` : ''}</span>`
        : '<span class="bc">준비 중</span>'}</li>`;
    }).join('')}</ol>${semesterAssessmentHtml(s.sem, bank)}</section>`).join('')}
  </main>`;
}

function semesterAssessmentHtml(semester, bank) {
  const assessments = assessmentsFor2022(semester, bank);
  if (!assessments.length) return '<p class="bank-assessment-pending">중간·기말평가 준비 중</p>';
  return `<div class="bank-assessments"><h4>학기 평가</h4><ul class="bank-units">${assessments.map((a) => `<li class="exam" data-assessment="${esc(a.contentId)}"><span class="bt">${esc(a.title)}</span><span class="bc">${a.mixedSourceAssessment ? `연계발췌 원문 ${a.n} · 짝 ${a.n} · 창작 ${a.authored} · 원문${a.reviewOnly}개 자동 채점 보류 · 현행 전체 원문 준비 중` : a.authored ? `창작 ${a.authored}문항${a.originalPending?' · 원문 준비 중':''}` : `원문 ${a.n} · 짝 ${a.n}${a.supplement?` · 보충 ${a.supplement}`:''}${a.reviewOnly?` · 원문${a.reviewOnly}개 자동 채점 보류`:''}`}</span><p class="bank-assessment-scope">범위: ${esc(a.scope)}</p><span class="bs">${a.sets.map((n) => `<a href="#/${a.contentId}/exam/${n}">${esc(groupLabel(a, n))}</a>`).join('')}<a href="#/${a.contentId}/exam/1/teacher">교사 정답표</a>${a.paperLabel?`<a href="#/${a.contentId}/print/student">${esc(a.paperLabel)}</a><a href="#/${a.contentId}/sub/E1">${a.authored?'단원별 문항':'보충·소단원'}</a>`:''}</span></li>`).join('')}</ul>${assessments.some((a) => a.contentId.endsWith('-fin')) ? '' : '<p class="bank-assessment-pending">기말평가 준비 중</p>'}</div>`;
}
