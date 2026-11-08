// 발문만 풀어 쓰고 응답 계약·보기·수치·자료·정답은 유지한다.
export const ELEMENTARY_PROMPT_VERSION='20261108-elementary-question-prompts';
export const ELEMENTARY_PROMPT_EDITS={
 'c22-s62-u03':{
  78:{previous:'“클립이 적게 붙으니 피복을 전부 벗기자”는 제안을 검토하세요.',prompt:'“클립이 적게 붙으니 전선을 감싼 부분을 모두 벗기자”는 말이 맞을까요? 까닭을 설명하고, 선생님과 먼저 확인할 다른 조건도 쓰세요.',version:'20261106-electricity-readable-workbook'},
  109:{previous:'“한 번 불이 켜졌으니 부품 규격은 확인하지 않아도 된다”는 말을 검토하세요.',prompt:'“한 번 불이 켜졌으니 부품의 규격은 확인하지 않아도 돼”라는 말이 맞을까요? 까닭과 안전하게 쓰기 전에 확인할 것을 쓰세요.',version:'20261106-electricity-readable-workbook'},
  119:{previous:'실천 과정 “구체적 계획→실제 행동→기간 뒤 검토”로 배열하세요.',prompt:'먼저 실천할 계획을 세우고, 실제로 실천한 뒤, 정한 기간이 지나면 결과를 돌아보려고 해요. 다음 활동을 순서대로 쓰세요.',version:'20261106-electricity-readable-workbook'},
  126:{previous:'“효율이 좋은 조명으로 바꿨으니 빈 교실에서도 계속 켜 두어도 된다”는 의견을 검토하세요.',prompt:'“같은 밝기에서 전기를 적게 쓰는 조명은 빈 교실에서도 계속 켜 두어도 돼”라는 말이 맞을까요? 까닭을 설명하고, 필요한 밝기를 유지하면서 전기를 아낄 방법을 쓰세요.',version:'20261104-electricity-book'},
 },
 'c22-s62-u02':{
  45:{previous:'불꽃의 색이 서로 다르므로 한쪽은 연소가 아니라는 주장을 검토하세요.',prompt:'두 불꽃의 색이 다르다는 까닭만으로 한쪽은 연소가 아니라고 말해도 될까요? 까닭과 함께 설명하세요.',version:'20261106-combustion-readable-workbook'},
  58:{previous:'연소 조건을 검토하는 올바른 질문을 고르세요. (정답 3개)',prompt:'불이 타는 데 필요한 조건을 알아보려고 해요. 알아볼 내용에 알맞은 질문 세 가지를 고르세요.',version:'20261106-combustion-readable-workbook'},
  88:{previous:'모든 물질에서 같은 생성물이 나온다는 결론을 검토하는 순서를 쓰세요.',prompt:'“어떤 물질이 타도 같은 물질이 생긴다”는 말이 맞는지 알아보려고 해요. 다음 활동을 순서대로 쓰세요.',version:'20261106-combustion-readable-workbook'},
  126:{previous:'친구가 “차량 수만 줄면 언제나 이산화 탄소도 같은 비율로 줄어”라고 말했어요. 여러 사람이 함께 이동하는 방법을 검토할 때 어떤 조건과 양을 비교해야 하는지 설명하세요.',prompt:'친구가 “차량 수가 줄면 이산화 탄소도 언제나 같은 비율로 줄어”라고 말했어요. 여러 사람이 함께 이동할 때 이 말이 맞는지 알아보려면 무엇을 비교해야 할까요? 비교할 조건과 양을 설명하세요.',version:'20261104-combustion-book'},
 },
 'c22-s62-u01':{
  62:{previous:'여름에는 해가 일찍 뜨므로 일몰은 확인하지 않아도 낮의 길이를 알 수 있다는 말을 검토하세요.',prompt:'“여름에는 해가 일찍 뜨니까 해가 지는 시각을 몰라도 낮의 길이를 알 수 있어”라는 말이 맞을까요? 까닭과 함께 설명하세요.',version:'20261104-season-book'},
  78:{previous:'봄과 가을의 고도가 비슷하니 두 계절의 실제 평균 기온도 같다는 설명을 검토하세요.',prompt:'“봄과 가을에 태양 고도가 비슷하면 실제 평균 기온도 같아”라는 말이 맞을까요? 까닭을 설명하고, 더 확인할 자료도 쓰세요.',version:'20261106-season-readable-workbook'},
  104:{previous:'축과 공전에서 계절 변화까지 인과에 맞게 이으세요.',prompt:'지구의 자전축이 기울어진 채로 공전하면 왜 계절이 달라질까요? 원인과 결과가 이어지도록 연결하세요.',version:'20261106-season-readable-workbook'},
 },
};
export const ELEMENTARY_PROMPT_UNITS=Object.keys(ELEMENTARY_PROMPT_EDITS);
const patches=unit=>Object.hasOwn(ELEMENTARY_PROMPT_EDITS,unit)?ELEMENTARY_PROMPT_EDITS[unit]:null;
const id=(unit,kind,no)=>`${unit}-${kind}${String(no).padStart(3,'0')}`;
export function withElementaryQuestionPrompts(workbook){
 const edits=patches(workbook.unit);if(!edits)return workbook;
 let changed=false;
 const questions=workbook.questions.map(q=>{
  const edit=Object.hasOwn(edits,q.no)&&edits[q.no];
  if(!edit||q.id!==id(workbook.unit,'w',q.no)||q.status!=='authored'||q.contentVersion!==undefined||q.sourceRef?.type!=='authored'||q.sourceRef.originalExam!==false||q.prompt!==edit.previous)return q;
  changed=true;return {...q,prompt:edit.prompt};
 });
 return changed?{...workbook,questions}:workbook;
}
const cache=new WeakMap();
export function elementaryPromptCurrentItems(rows,unit){
 const edits=patches(unit);if(!edits||!Array.isArray(rows))return rows;
 let changed=false;
 const items=rows.map(q=>{
  const no=Object.keys(edits).find(no=>q.id===id(unit,'b',no)&&q.bookQuestionId===id(unit,'w',no));
  const edit=no&&edits[no];
  if(!edit||q.status!=='authored'||q.sourceRef?.type!=='authored-supplement'||q.sourceRef.originalExam!==false||q.prompt!==edit.previous||(q.contentVersion||1)!==edit.version)return q;
  changed=true;if(cache.has(q))return cache.get(q);
  const current={...q,prompt:edit.prompt,contentVersion:ELEMENTARY_PROMPT_VERSION,previousVersions:[...(q.previousVersions?structuredClone(q.previousVersions):[]),{...structuredClone(q),version:q.contentVersion||1}]};
  // 보기와 채점은 같으므로 현재 적용 중인 오개념표도 같은 내용으로 이어 쓴다.
  if(q.diagnosticOverride?.version===(q.contentVersion||1))current.diagnosticOverride={...q.diagnosticOverride,version:ELEMENTARY_PROMPT_VERSION};
  cache.set(q,current);return current;
 });
 return changed?items:rows;
}
export function withElementaryPromptClassroom(unit,mod){
 const items=elementaryPromptCurrentItems(mod?.classroomItems,unit);
 return items===mod?.classroomItems?mod:{...mod,classroomItems:items};
}
