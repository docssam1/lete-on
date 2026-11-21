import {wireWorkbookPrint} from './workbook-print-ready.js?v=20261108-bank-print-ready';
// Reuse the workbook's font/image checks and cleanup; bank pages keep their existing controls.
export function wireBankPrint(root,{buttonSelector,statusSelector='[data-print-status]',handwriting=false,serif=false,prepare,readyText='그림과 글꼴이 준비되었습니다.'}={}){
 const fonts=['400 12px "Pretendard Variable"','700 12px "Pretendard Variable"'];
 if(handwriting)fonts.push('700 18px Gaegu');
 if(serif)fonts.push('400 12px "Noto Serif KR"','700 12px "Noto Serif KR"');
 return wireWorkbookPrint(root,{buttonSelector,statusSelector,fonts,prepare,readyText,errorText:'그림 또는 글꼴·지면을 불러오지 못했어요. 다시 열어 주세요.',scroll:false});
}
