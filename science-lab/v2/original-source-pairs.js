// 같은 출처·원세트·원번호에 대응하는 현재 연습을 찾는다.
// 독립 짝이 items 안에 있는 단원도 배열을 복제하거나 학습 문항을 중복 등록하지 않는다.
export function originalSourceTwin(original,{similar=[],items=[]}={}){
 const ref=original?.sourceRef;
 if(ref?.type!=='original')return undefined;
 const number=ref.originalNo??ref.no;
 if(original.sourcePair){
  const link=original.sourcePair;
  return items.find(q=>q.id===link.itemId&&q.sourceRef?.type==='authored-pair'&&q.sourceRef.of?.sourceId===link.sourceId&&q.sourceRef.of.set===ref.set&&q.sourceRef.of.no===number);
 }
 const legacy=similar.find(q=>q.sourceRef?.of?.set===ref.set&&q.sourceRef.of.no===ref.no);
 if(legacy)return legacy;
 return items.filter(q=>q.sourceRef?.type==='authored-pair').find(q=>{
  const of=q.sourceRef?.of;
  return of?.set===ref.set&&of.no===number&&(!of.sourceId||!ref.sourceId||of.sourceId===ref.sourceId);
 });
}
