import{guidanceParticleCurrentItems}from'../data/book/term-particle-language.js?v=20261105-guidance-particles';
import{careerReadablePriorWorkbook as workbook}from'../data/book/c22-s62-u04.workbook.js?v=20261107-career-readable-workbook';
import{items}from'../data/units/c22-s62-u04.js';
import{careerCurrentItems}from'./career-question-language.js?v=20261107-career-readable-workbook';
import{makeWorkbookPaper}from'./revised-workbook-paper.js?v=20261104-earth-motion-book';
const current=new Map(guidanceParticleCurrentItems(careerCurrentItems(items),'c22-s62-u04').map(q=>[q.bookQuestionId,q]));
export const careerBankBook={...workbook,title:'과학과 나의 진로',questions:workbook.questions.map(q=>({...q,sourceItemId:current.get(q.id).id,sourceBookQuestionId:q.id,sourceBookNo:q.no,answerContract:current.get(q.id).answerContract})),pages:workbook.pages.filter(p=>p.kind==='practice'),teacherStudentPages:workbook.teacherStudentPages.filter(p=>p.kind==='practice')};
const paper=makeWorkbookPaper(careerBankBook,{}, {route:'print',toolLabel:'128문항집 고르기',modes:[['student','학생 문제지'],['teacher','교사 해설'],['answers','정답·해설만'],['quick','빠른 정답표']]});
export const bankPaper=paper.workbookPaper;export const wireBankPaper=paper.wireWorkbookPaper;
