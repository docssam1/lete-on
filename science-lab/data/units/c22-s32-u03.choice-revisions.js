// 복수로 타당했던 보기를 바로잡는다. 문항 ID·정답 계약·옛 보기는 보존한다.
export const SOUND_CHOICE_REVISIONS={
 'c22-s32-u03-b25':[
  '자의 재료와 책상 밖으로 나온 길이를 모두 같게 한다.',
  '듣는 자리와 책상 밖으로 나온 길이를 모두 같게 한다.',
  '비교 뒤 관찰한 높낮이와 예상했던 높낮이를 같게 한다.',
  '자의 재료·고정 방법과 튕기는 정도를 같게 한다.',
  '책상 밖의 길이와 고정해 놓은 책상을 모두 같게 한다.',
 ],
 'c22-s32-u03-b41':[
  '실의 길이와 실을 잡는 여부를 모두 같게 한다.',
  '목소리 크기를 달리하고 두 사람의 거리만 같게 한다.',
  '실을 잡는 조건과 놓는 조건이 뒤섞이게 시험한다.',
  '같은 전화기·목소리·듣는 위치를 유지한다.',
  '전화기는 바꾸고 실을 잡는 여부는 같게 한다.',
 ],
};
export function withSoundChoiceRevisions(items){return items.map(it=>{
 const choices=SOUND_CHOICE_REVISIONS[it.id];if(!choices)return it;
 return{...it,choices:[...choices],contentVersion:2,previousVersions:[{version:1,choices:[...it.choices]}]};
});}
