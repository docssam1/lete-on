import {assessmentStudentExam} from './assessment-shared-template.js?v=20261116-shared-exam-template';
import {assessmentStudentPages} from './assessment-print-layout.js?v=20261116-assessment-language';
import { sourceTableHtml, groupLabel, assessmentTitle } from './source-presentation.js?v=20261116-assessment-language';
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const circ = ['①','②','③','④','⑤'];

function givensHtml(givens) {
  return Object.entries(givens || {}).map(([label,value]) => {
    const table = sourceTableHtml(value?.caption === '가상 관찰 자료' ? {...value, caption:'자료'} : value);
    if (table) return `<div class="ap-given">${table}</div>`;
    return `<div class="ap-given"><b>${esc(label)}</b>${Array.isArray(value) ? `<ul>${value.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>` : `<p>${esc(value)}</p>`}</div>`;
  }).join('');
}

function answerText(q) {
  const ac = q.answerContract;
  if (ac.type === 'single-choice') return `${circ[ac.answer]} ${q.choices[ac.answer]}`;
  if (ac.type === 'multi-choice') return ac.answers.map((n) => `${circ[n]} ${q.choices[n]}`).join(' / ');
  return ac.sample || ac.answer;
}

export function assessmentPaperHtml({unit, bank, list, form, teacher = false, cols='1', pageNo=true}) {
  const name = groupLabel(bank, form);
  const title = assessmentTitle(bank?.label || '기말평가');
  const course = bank?.courseLabel || '초등 과학 3학년 1학기';
  const scope = bank?.scope || ['힘과 우리 생활','동물의 생활','식물의 생활','생물의 한살이'];
  if(!teacher&&list.length)return assessmentStudentExam({unit,items:list,course,title,scope,form,cols,pageNo});
  const heading=`<header class="ap-heading"><p>GFIELD · ${esc(course)}</p><h1>${esc(title)} ${esc(name)}</h1><p>${teacher ? '교사용 · 정답과 해설' : '이름 ____________________ · 반 ______ · 날짜 ______________'}</p></header>`,intro=`<div class="ap-intro"><p>범위: ${scope.map(esc).join(' · ')}</p><p>${list.length}문항 · 문제를 읽고 답하세요. 두 개 이상 고르는 문제는 안내된 개수만큼 고르세요.</p>${teacher ? `<p>지필드에서 직접 작성한 학습용 평가입니다.${bank?.scopeNote ? ' '+esc(bank.scopeNote)+'.' : ''} 서술형은 다른 타당한 설명도 확인하며 공식 배점표로 사용하지 않아요.</p>` : ''}</div>`;
  const card=(q)=>`<article class="ap-question" data-paper-item="${esc(q.id)}"><p class="ap-prompt"><b>${esc(name)} ${String(q.sourceRef.no).padStart(2,'0')}.</b> ${esc(q.prompt)}</p>${givensHtml(q.givens)}${q.choices ? `<ol class="ap-choices">${q.choices.map((s,i) => `<li><span>${circ[i]}</span>${esc(s)}</li>`).join('')}</ol>` : ''}${teacher ? `<div class="ap-key"><p><b>정답${q.answerContract.sample ? ' 예시' : ''}</b> ${esc(answerText(q))}</p><p>${esc(q.explanation)}</p>${q.answerContract.rubric ? `<p><b>확인 기준</b> ${q.answerContract.rubric.required.map(esc).join(' / ')}</p>` : ''}</div>` : q.answerContract.type === 'short-text' ? '<div class="ap-short">답: ________________________________________</div>' : q.answerContract.type === 'written-explanation' ? `<div class="ap-writing">${'<i></i>'.repeat(5)}</div>` : ''}</article>`;
  return `<header class="top no-print"><div class="wrap"><a class="back" href="#/${unit}/exam/${form}">‹ 평가로</a><h1>${esc(title)} ${esc(name)} ${teacher ? '교사 해설' : '문제지'}</h1><button type="button" class="btn" onclick="print()">인쇄</button></div></header>
  <main class="assessment-paper ${teacher ? 'ap-teacher' : ''} ap-form-${form}"><div class="ap-watermark" aria-hidden="true">GFIELD · 지필드</div>
  ${teacher||!list.length?heading+intro:''}
  ${teacher?list.map(card).join(''):assessmentStudentPages(list,card,heading+intro,{form:name})}
  </main>`;
}
