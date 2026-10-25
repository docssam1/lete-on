// 승인된 다섯 교재만 연결한다. 기존 수업·보고서·문제은행 모듈은 그대로 둔다.
import {withPrintedWorkbook} from './revised-learning-book.js?v=20261025';
import {makeWorkbookPaper} from './revised-workbook-paper.js?v=20261025';
export const revisedTextbookUnits = new Set(["c22-s32-u01", "c22-s32-u02", "s41-u01", "c22-s42-u01", "c22-s51-u03"]);
const cache = new Map();
async function data(unit) {
 if (!revisedTextbookUnits.has(unit)) return null;
 if (!cache.has(unit)) cache.set(unit, Promise.all([
  import(`../data/book/${unit}.workbook.js?v=20261025`),
  import(`../data/book/${unit}.workbook-art.js?v=20261025`),
 ]).then(([{workbook}, {art}])=>({workbook,art})));
 return cache.get(unit);
}
export async function revisedTextbook(unit, mod) {
 const d=await data(unit); if(!d)return mod;
 const {chapter}=mod;
 const merged=withPrintedWorkbook({...mod,art:{...mod.art,...d.art},chapter:{...chapter,thinkWorkbook:true,editorial:false}},d.workbook);
 return {...merged,chapter:{...merged.chapter,revisedCurriculumWorkbook:true,workbookRoute:'workbook'}};
}
export async function revisedTextbookPaper(unit) {
 const d=await data(unit);return d?makeWorkbookPaper(d.workbook,d.art):null;
}
