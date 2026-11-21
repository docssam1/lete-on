import {learningBookName,teacherProblemPages} from './revised-learning-book.js?v=20261108-learning-note-roles';
import {wireWorkbookPrint} from './workbook-print-ready.js?v=20261106-readable-type';
// 「교과 연결 사고력」 단원의 편집 교재(문제집형 A4) — #/<단원>/workbook/student|teacher|answers|quick
// 데이터: data/book/<단원>.workbook.js(scripts/gen-science-workbook-<단원>.mjs) + 수업 교재 그림(data/book/<단원>.book.js art).
// 학생용에는 정답·해설이 없다. 교사용은 문항 바로 아래 정답 + 뒤쪽 정답·해설, 빠른 정답표는 따로.
import { renderEditorialChapter } from './revised-book-editorial.js?v=20261108-opening-warmup-label';
const MODES = [['student', '학생용 교재'], ['teacher', '교사용 교재'], ['answers', '정답·해설'], ['quick', '빠른 정답표']];

export function makeWorkbookPaper(wb, bookArt = {}, {route = 'workbook', modes = MODES, toolLabel = '교재 고르기'} = {}) {
  const art = { ...bookArt, ...wb.figures };
  const base = { thinkWorkbook:true, editorial: true, verticalFlow: true, inlineAnswers: true, richText: !!wb.richText, book: learningBookName(wb.unit,wb.book), unit: wb.unit, no: wb.no, title: wb.title, semester: wb.semester, theme: wb.theme, questions: wb.questions };
  const workbookPaper = ({ mode = 'student' } = {}) => {
    if (!MODES.some(([k]) => k === mode)) mode = 'student';
    const ch = { ...base, pages: mode === 'answers' ? wb.teacherPages : mode === 'quick' ? wb.quickPages : mode === 'teacher' ? teacherProblemPages(wb.pages,wb.teacherStudentPages,wb.unit) : wb.pages, teacherPages: mode === 'teacher' ? wb.teacherPages : [] };
    return `<div class="think-workbook-print revised-workbook-print" data-workbook-mode="${mode}" data-paper-unit="${wb.unit}"><nav class="think-workbook-tools no-print" aria-label="${toolLabel}"><a class="btn" href="#/${wb.unit}/start">처음으로</a>${modes.map(([k, t]) => `<a class="btn${k === mode ? ' on' : ''}" href="#/${wb.unit}/${route}/${k}"${k === mode ? ' aria-current="page"' : ''}>${t}</a>`).join('')}<button type="button" class="btn primary" data-workbook-print disabled>A4 인쇄</button><p role="status" data-workbook-status>그림과 글꼴을 준비하고 있어요.</p></nav>${renderEditorialChapter(ch, art, { teacher: mode !== 'student' })}</div>`;
  };
  const wireWorkbookPaper = wireWorkbookPrint;
  return { workbookPaper, wireWorkbookPaper };
}
