// 「교과 연결 사고력」 단원의 편집 교재(문제집형 A4) — #/<단원>/workbook/student|teacher|answers|quick
// 데이터: data/book/<단원>.workbook.js(scripts/gen-science-workbook-<단원>.mjs) + 수업 교재 그림(data/book/<단원>.book.js art).
// 학생용에는 정답·해설이 없다. 교사용은 문항 바로 아래 정답 + 뒤쪽 정답·해설, 빠른 정답표는 따로.
import { renderEditorialChapter } from './book-editorial.js';
const MODES = [['student', '학생용 교재'], ['teacher', '교사용 교재'], ['answers', '정답·해설'], ['quick', '빠른 정답표']];

export function makeWorkbookPaper(wb, bookArt = {}) {
  const art = { ...bookArt, ...wb.figures };
  const base = { editorial: true, verticalFlow: true, inlineAnswers: true, unit: wb.unit, no: wb.no, title: wb.title, semester: wb.semester, theme: wb.theme, questions: wb.questions };
  const workbookPaper = ({ mode = 'student' } = {}) => {
    if (!MODES.some(([k]) => k === mode)) mode = 'student';
    const ch = { ...base, pages: mode === 'answers' ? wb.teacherPages : mode === 'quick' ? wb.quickPages : wb.pages, teacherPages: mode === 'teacher' ? wb.teacherPages : [] };
    return `<div class="think-workbook-print" data-workbook-mode="${mode}"><nav class="think-workbook-tools no-print" aria-label="교재 고르기"><a class="btn" href="#/${wb.unit}/start">처음으로</a>${MODES.map(([k, t]) => `<a class="btn${k === mode ? ' on' : ''}" href="#/${wb.unit}/workbook/${k}"${k === mode ? ' aria-current="page"' : ''}>${t}</a>`).join('')}<button type="button" class="btn primary" data-workbook-print disabled>A4 인쇄</button><p role="status" data-workbook-status>그림과 글꼴을 준비하고 있어요.</p></nav>${renderEditorialChapter(ch, art, { teacher: mode !== 'student' })}</div>`;
  };
  const wireWorkbookPaper = (root) => {
    let active = true;
    const button = root.querySelector('[data-workbook-print]'), status = root.querySelector('[data-workbook-status]');
    const ready = (im) => (im.complete ? (im.naturalWidth ? Promise.resolve() : Promise.reject(Error('image'))) : new Promise((a, b) => { im.addEventListener('load', a, { once: true }); im.addEventListener('error', b, { once: true }); }));
    Promise.all([document.fonts.load('700 18px Gaegu'), document.fonts.ready, ...[...root.querySelectorAll('img')].map(ready)])
      .then(() => { if (active && root.isConnected) { button.disabled = false; status.textContent = '그림과 글꼴이 준비되었어요.'; } })
      .catch(() => { if (active && root.isConnected) status.textContent = '그림을 불러오지 못했어요. 다시 열어 주세요.'; });
    const print = () => { if (!button.disabled) window.print(); };
    button.addEventListener('click', print);
    scrollTo(0, 0);
    return () => { active = false; button.removeEventListener('click', print); };
  };
  return { workbookPaper, wireWorkbookPaper };
}
