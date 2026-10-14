const labels={in_progress:'진행 중',reported_done:'완료',reviewed_done:'범위 확인 완료',not_started:'미시작'};
export function completionText(c,{completed='완료'}={}){
 if(c.completion==='reported_done')return completed;
 if(c.completion==='unknown')return c.completionInput==='reported'?'진행 상태 모름':c.completionInput==='unentered'?'진행 상태 미입력':'진행 상태 미확인';
 return labels[c.completion]||'진행 상태 확인 필요';
}
export function completionChoice(c){return c.completion==='unknown'&&c.completionInput!=='reported'?'':c.completion||'';}
