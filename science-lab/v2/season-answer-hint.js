// 입력 형식만 안내한다. 문항의 정답이나 인정 답을 읽지 않는다.
export function seasonAnswerHint(ac){
 const c=ac?.seasonContract;
 if(c?.kind!=='ordered-term-parts'||c.parts.length<2)return '';
 const format=c.parts.map((_,i)=>`(${i+1}) 답`).join(' / ');
 return `${format}처럼 번호와 답을 써요.${c.parts.some(p=>p.unitRequired)?' 수치에는 단위도 함께 써요.':''}`;
}
