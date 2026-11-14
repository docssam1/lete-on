export const ECOLOGY_SOUND_BANK_VERSION='20261105-ecology-sound-bank';
const revisions={
 'c22-s42-u02':{id:'c22-s42-u02-b10',prompt:'버섯과 바위를 각각 분류하고, 왜 둘을 다르게 분류했는지 설명하세요.',explanation:'스스로 장소를 옮기지 않는다는 이유만으로 버섯과 바위를 같은 비생물 요소로 분류하지 않습니다.'},
 'c22-s32-u03':{id:'c22-s32-u03-t01',prompt:'내 목에 손을 살짝 대고 작은 목소리로 말할 때 느끼는 움직임은 ( ① )이에요.',explanation:'내 목에 손을 살짝 대고 작게 말하며 떨림을 살펴요. 친구의 목을 누르거나 아픈 느낌을 참고 계속하지 않아요.'},
};
const clone=x=>JSON.parse(JSON.stringify(x));
// Reuse the reviewed classroom context without changing its scoring contract.
export function ecologySoundCurrentItems(rows,unit){
 const patch=revisions[unit];if(!patch)return rows;
 return rows.map(q=>{
  if(q.id!==patch.id||q.status!=='authored'||q.sourceRef?.type==='similar'||q.contentVersion===ECOLOGY_SOUND_BANK_VERSION||q.previousVersions?.some(p=>p.version===ECOLOGY_SOUND_BANK_VERSION))return q;
  return{...q,prompt:patch.prompt,explanation:patch.explanation,contentVersion:ECOLOGY_SOUND_BANK_VERSION,previousVersions:[...(q.previousVersions?clone(q.previousVersions):[]),{version:q.contentVersion||1,...clone(q)}]};
 });
}
