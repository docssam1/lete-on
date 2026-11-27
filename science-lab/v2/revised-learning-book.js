// v2의 현행 교재 정체성과 웹/인쇄 지면을 연결한다. 문항·수업·저장 답안은 바꾸지 않는다.
const CURRENT_UNITS=new Set(["c22-s62-u01", "c22-s62-u02", "c22-s62-u03", "c22-s62-u04", "c22-s32-u01", "c22-s32-u02", "s41-u01", "c22-s42-u01", "c22-s51-u03", "s31-u01", "s31-u02", "s31-u03", "s31-u04", "c22-s42-u02", "c22-s32-u03", "c22-s32-u04", "c22-s42-u04", "s41-u02", "s41-u03", "s41-u04", "c22-s42-u03", "c22-s51-u01", "c22-s51-u02", "c22-s51-u04", "c22-s52-u01", "c22-s52-u02", "c22-s52-u03", "c22-s52-u04", "c22-s61-u01", "c22-s61-u02", "c22-s61-u03", "c22-s61-u04"]);
export const THINKING_BOOK='지필드 교과 연결 사고력';
export const isCurrentLearningUnit=id=>CURRENT_UNITS.has(id);
export const learningBookName=(id,previous)=>isCurrentLearningUnit(id)?THINKING_BOOK:previous||'지필드 실험 과학';
export function teacherProblemPages(pages,prepared,unit){
 const selected=prepared||pages;
 if(!isCurrentLearningUnit(unit)||!selected?.length||selected.length%2===0)return selected;
 return [...selected,{kind:'duplex-blank',layout:selected[0]?.layout}];
}
export function withLearningIdentity(mod,id){
 if(!mod?.chapter?.thinkWorkbook||!isCurrentLearningUnit(id))return mod;
 const ch=mod.chapter;
 return {...mod,chapter:{...ch,book:THINKING_BOOK,...(ch.editorial?{teacherStudentPages:teacherProblemPages(ch.pages,ch.teacherStudentPages,id)}:{})}};
}
export function withPrintedWorkbook(mod,wb){
 const ch=mod?.chapter;
 if(!ch?.thinkWorkbook||ch.editorial||!wb?.pages||!wb?.questions||wb.unit!==ch.unit)return mod;
 return {...mod,workbook:wb,quickPages:wb.quickPages,art:{...mod.art,...wb.figures},chapter:{...ch,book:learningBookName(ch.unit,ch.book),title:wb.title||ch.title,semester:wb.semester||ch.semester||ch.vol,theme:wb.theme||ch.theme,editorial:true,verticalFlow:true,inlineAnswers:true,richText:!!wb.richText,pages:wb.pages,teacherStudentPages:teacherProblemPages(wb.pages,wb.teacherStudentPages,ch.unit),teacherPages:wb.teacherPages,questions:wb.questions,webBookDescription:'웹과 인쇄에서 같은 개념·활동·문항을 읽어요.'}};
}

export const learningRailTitle=(ch,previous,index,pageKind='')=>ch.thinkWorkbook&&isCurrentLearningUnit(ch.unit)&&!['answers','quick'].includes(pageKind)?['핵심 정리','더 알아보기','내가 정리할 것'][index]||previous:previous;

// 글꼴의 역할은 칸의 위치가 아니라 실제 제목으로 정한다. 교사 메모는 학생 메모와 구별한다.
export function learningNoteRole(ch,title){
 if(!ch?.thinkWorkbook||!isCurrentLearningUnit(ch.unit))return '';
 const roles={'핵심 정리':'summary','더 알아보기':'extension','내가 정리할 것':'personal','지도 메모':'teacher'};
 return Object.hasOwn(roles,title)?roles[title]:'other';
}
