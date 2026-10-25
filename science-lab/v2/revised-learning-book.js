// v2의 현행 교재 정체성과 웹/인쇄 지면을 연결한다. 문항·수업·저장 답안은 바꾸지 않는다.
const CURRENT_UNITS=new Set(["c22-s32-u01", "c22-s32-u02", "s41-u01", "c22-s42-u01", "c22-s51-u03"]);
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

export const learningRailTitle=(ch,previous,index)=>ch.thinkWorkbook&&isCurrentLearningUnit(ch.unit)?['핵심 정리','더 알아보기','내가 정리할 것'][index]||previous:previous;
