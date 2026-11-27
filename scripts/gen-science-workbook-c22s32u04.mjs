// 현재 검수 원고의 문항·쪽·이전 원고를 보존해 교재 진입 파일을 만든다.
// 비교: node scripts/gen-science-workbook-c22s32u04.mjs --check
// 후보: node scripts/gen-science-workbook-c22s32u04.mjs --output <새 파일>
import {generateReviewedWorkbook} from './gen-science-workbook-lib.mjs';
await generateReviewedWorkbook({unit:'c22-s32-u04',sourceUrl:new URL('../science-lab/data/book/c22-s32-u04.workbook-source.js',import.meta.url),gen:'gen-science-workbook-c22s32u04.mjs'});
