import { revisedTextbookUnits } from './revised-textbook.js?v=20261105-workbook-answer-language&unitImports=20261116-lazy-unit-imports&railNotes=20261116-upper-notes';
import { SEMS_2022, bankFor2022, assessmentsFor2022 } from './curriculum-2022.js?v=20261104-career-class';
import { groupLabel } from './source-presentation.js';

const roman = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ'];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function catalogNavigation(current) {
  return `<nav class="bank-catalog-nav" aria-label="문제은행 차례">${[
    ['2022', '#/bank', '2022 개정 차례'], ['legacy', '#/bank/legacy', '기존 자료 차례'],
  ].map(([key, href, label]) => `<a class="btn${current === key ? ' primary' : ''}" href="${href}"${current === key ? ' aria-current="page"' : ''}>${label}</a>`).join('')}</nav>`;
}

// Keep source provenance and availability visible, using words students can read.
function originalSummary(resource) {
  const previousCurriculum = resource.mixedSourceAssessment || /옛/.test(resource.label || '');
  const label = previousCurriculum
    ? (resource.sourceExcerptOnly ? '이전 교육과정에서 고른 원문 문제' : '이전 교육과정 원문 문제')
    : (resource.sourceExcerptOnly ? '관련 원문 문제' : '원문 문제');
  return `${label} ${resource.n}개`;
}
function sourceAvailability(resource, assessment = false) {
  if (!resource.sourceScopeNote) return '';
  if (resource.sourceScopeNote.includes('준비 중')) return assessment ? '현재 평가 범위의 원문 전체 준비 중' : '현재 단원의 원문 전체 준비 중';
  if (resource.sourceScopeNote.includes('확인은 별도')) return '현재 교육과정 원문 전체는 아직 확인하지 않았어요';
  return resource.sourceScopeNote;
}
function resourceSummary(resource, assessment = false) {
  if (resource.sourcePending) return `연습 문제 ${resource.supplement}개 · 원문 문제 준비 중`;
  if (assessment && resource.authored && !resource.mixedSourceAssessment) {
    return `연습 문제 ${resource.authored}개${resource.originalPending ? ' · 원문 문제 준비 중' : ''}`;
  }
  const parts = [originalSummary(resource)];
  if (resource.pairsInPractice) parts.push(`연습 문제 ${resource.supplement}개`);
  else {
    parts.push(`비슷한 문제 ${resource.n}개`);
    const practice = resource.mixedSourceAssessment ? resource.authored : resource.supplement;
    if (practice) parts.push(`연습 문제 ${practice}개`);
  }
  const availability = sourceAvailability(resource, assessment);
  if (availability) parts.push(availability);
  else if (resource.mixedSourceAssessment && resource.originalPending) parts.push('현재 평가 범위의 원문 전체 준비 중');
  if (resource.reviewOnly) parts.push(`선생님과 확인할 원문 문제 ${resource.reviewOnly}개`);
  return parts.join(' · ');
}
const studentGroupLabel = (resource, number) => groupLabel(resource, number)
  .replace(/창작 ([AB])형(\d+)/g, '연습 $1형 · $2문항')
  .replace(/옛 기말(\d+) · 발췌(\d+)/g, '이전 기말 $1 · 관련 문제 $2개');
const assessmentTitle = title => title.replace(' · 창작', ' · 연습 문제');
const assessmentScope = scope => scope.replace('창작:', '연습 문제:').replace('옛 원문:', '이전 교육과정 원문:').replace('관련 발췌', '관련 문제');

export function curriculumBankHtml(bank) {
  const resources = SEMS_2022.flatMap((s) => s.units).map((u) => bankFor2022(u.position, bank)).filter(Boolean);
  const withOriginals = resources.filter((b) => b.n > 0), authoredOnly = resources.filter((b) => b.sourcePending);
  const originals = resources.reduce((n, b) => n + b.n, 0);
  const previousSources = resources.some(b => b.sourceExcerptOnly || /옛/.test(b.label || ''));
  return `<main class="wrap bank bank-2022">
    ${catalogNavigation('2022')}
    <p class="step-label">초등 과학 3~6학년 · 2022 개정</p><h2>32단원 문제은행</h2>
    <p class="lead">2022 개정 교육과정의 8개 학기, 32개 단원 차례예요. 단원을 골라 수업과 교재를 열어 보세요.</p>
    <p class="bank-assessment-scope">현재 ${withOriginals.length}개 단원의 원문 문제 ${originals}개와 비슷한 문제가 있어요.${authoredOnly.length ? ` 원문 준비 중인 ${authoredOnly.length}개 단원에는 연습 문제 ${authoredOnly.reduce((n,b)=>n+b.supplement,0)}개가 있어요.` : ''}${resources.length<SEMS_2022.reduce((n,s)=>n+s.units.length,0)?' 나머지 단원은 차례로 준비하고 있어요.':''}</p>
    ${previousSources ? '<p class="bank-assessment-scope">이전 교육과정의 관련 문제도 함께 있어요. 각 단원의 자료 안내에서 구별해요. 원문은 원래 자료에 실린 문제를 말해요.</p>' : ''}
    ${SEMS_2022.map((s) => `<section class="bank-sem"><h3>${s.sem.replace('-', '학년 ')}학기</h3><ol class="bank-units">${s.units.map((u) => {
      const b = bankFor2022(u.position, bank);
      const currentClassroom = b && revisedTextbookUnits.has(b.contentId) && b.lesson !== false && !b.bankOnly;
      return `<li class="${b ? 'open' : 'wait'}" data-curriculum-unit="${u.key}"><span class="bn">${roman[u.no - 1]}</span><span class="bt">${esc(u.title)}</span>${b
        ? `<span class="bc">${esc(resourceSummary(b))}</span><span class="bs">${b.sets.map((n) => `<a href="#/${b.contentId}/exam/${n}">${esc(studentGroupLabel(b, n))}</a>`).join('')}<a href="#/${b.contentId}/sub/E1">소단원</a>${!b.lesson&&!currentClassroom&&(b.bookAvailable||b.paperAvailable)?`<a href="#/${b.contentId}/start">${b.bookAvailable?'교재·문제은행':'문제은행'}</a><a href="#/${b.contentId}/print/student">${esc(b.paperLabel)}</a>`:''}${currentClassroom ? `<a href="#/${b.contentId}/start">수업·교재</a><a href="#/${b.contentId}/lab-class/self/1">사고력 수업</a>` : b.lesson && !b.bankOnly ? `${b.bookPending ? '' : `<a href="#/${b.contentId}/start">수업·교재</a>`}<a href="#/${b.contentId}/1">5단계 탐구</a><a href="#/${b.contentId}/2/lab">${esc(b.labLabel || '관찰·그림 기록')}</a>` : ''}</span>`
        : '<span class="bc">준비 중</span>'}</li>`;
    }).join('')}</ol>${semesterAssessmentHtml(s.sem, bank)}</section>`).join('')}
  </main>`;
}

function semesterAssessmentHtml(semester, bank) {
  const assessments = assessmentsFor2022(semester, bank);
  if (!assessments.length) return '<p class="bank-assessment-pending">중간·기말평가 준비 중</p>';
  return `<div class="bank-assessments"><h4>학기 평가</h4><ul class="bank-units">${assessments.map((a) => `<li class="exam" data-assessment="${esc(a.contentId)}"><span class="bt">${esc(assessmentTitle(a.title))}</span><span class="bc">${esc(resourceSummary(a, true))}</span><p class="bank-assessment-scope">범위: ${esc(assessmentScope(a.scope))}</p><span class="bs">${a.sets.map((n) => `<a href="#/${a.contentId}/exam/${n}">${esc(studentGroupLabel(a, n))}</a>`).join('')}<a href="#/${a.contentId}/exam/1/teacher">교사 정답표</a>${a.paperLabel?`<a href="#/${a.contentId}/print/student">${esc(a.paperLabel)}</a><a href="#/${a.contentId}/sub/E1">${a.authored?'단원별 문제':'소단원 문제'}</a>`:''}</span></li>`).join('')}</ul>${assessments.some((a) => a.contentId.endsWith('-fin')) ? '' : '<p class="bank-assessment-pending">기말평가 준비 중</p>'}</div>`;
}
