// 기존 ID와 현재 교육과정의 독립 ID를 같은 문항 접미사 계약으로 읽는다. t = 사고력 수업 문항(<단원>.think.js).
export function contentUnitOfItem(id){
 const m=String(id).match(/^((?:c22-)?s\d{2}-(?:u\d{2}[a-z]?|mid|fin))-(?:[abvt]\d+|o\d+-\d+|f\d+-\d+)$/);
 return m?.[1]||null;
}
