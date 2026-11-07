import{currentBankWorkbook}from'./current-bank-workbook.js?v=20261108-electricity-pair-language';
import{workbook as currentWorkbook}from'../data/book/c22-s62-u04.workbook.js?v=20261107-career-readable-workbook';
import{careerReadableCurrentItems}from'../data/book/c22-s62-u04.editorial.js?v=20261107-career-readable-workbook';
import{guidanceParticleCurrentItems}from'../data/book/term-particle-language.js?v=20261105-guidance-particles';
import{careerReadablePriorWorkbook as workbook}from'../data/book/c22-s62-u04.workbook.js?v=20261107-career-readable-workbook';
import{items}from'../data/units/c22-s62-u04.js';
import{careerCurrentItems}from'./career-question-language.js?v=20261107-career-readable-workbook';
import{makeWorkbookPaper}from'./revised-workbook-paper.js?v=20261108-learning-note-roles';
const current=new Map(guidanceParticleCurrentItems(careerCurrentItems(items),'c22-s62-u04').map(q=>[q.bookQuestionId,q]));
export const careerBankBook={...workbook,title:'과학과 나의 진로',questions:workbook.questions.map(q=>({...q,sourceItemId:current.get(q.id).id,sourceBookQuestionId:q.id,sourceBookNo:q.no,answerContract:current.get(q.id).answerContract})),pages:workbook.pages.filter(p=>p.kind==='practice'),teacherStudentPages:workbook.teacherStudentPages.filter(p=>p.kind==='practice')};
// 위 BankBook은 기존 원고 대조용으로 보존한다. 실제 인쇄는 현재 교재를 쓴다.
export const currentCareerBankBook=currentBankWorkbook(careerBankBook,currentWorkbook,careerReadableCurrentItems(Array.from(current.values()),'c22-s62-u04'));
const paper=makeWorkbookPaper(currentCareerBankBook,{}, {route:'print',toolLabel:'128문항집 고르기',modes:[['student','학생 문제지'],['teacher','교사 해설'],['answers','정답·해설만'],['quick','빠른 정답표']]});
export const bankPaper=paper.workbookPaper;export const wireBankPaper=paper.wireWorkbookPaper;
