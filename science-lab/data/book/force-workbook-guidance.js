// Current workbook teaching guidance only. Keep questions, answer contracts,
// source fields and the complete prior workbook intact.
export const FORCE_GUIDANCE_VERSION='20261105-force-guidance';
const guidance={
 "s31-u01-w002": {
  "misconception": "빈 상자와 찰흙 한 덩어리의 무게가 각각 같은지 확인하고, 넣은 덩어리 수를 비교해요."
 },
 "s31-u01-w003": {
  "misconception": "장치 전체를 가리키는 말과 나무판자가 받침대에 닿는 곳을 가리키는 말을 구별해요."
 },
 "s31-u01-w006": {
  "misconception": "물체를 거는 부분과 손으로 잡는 부분, 0을 맞추는 부분을 구별해요."
 },
 "s31-u01-w007": {
  "explanation": "나머지 네 기록은 비스듬한 판자·경사로·비탈길·완만한 통로의 면을 따라 올라가요. 병따개는 그런 이동 면을 따라 옮기는 사례가 아니라 지레를 이용해 뚜껑을 여는 도구예요. 따라서 병따개 기록을 다른 묶음으로 옮겨요."
 },
 "s31-u01-w010": {
  "explanation": "처음부터 엄마 쪽이 내려간 상태이고, 민지의 위치는 그대로인데 엄마만 더 멀리 옮겼어요. 이때 엄마 쪽이 계속 아래로 기울 것으로 예상하는 넷째 보기를 골라요. 처음의 위치 정보 없이 엄마라는 이름만으로 두 사람의 몸무게를 정하는 문제는 아니에요."
 },
 "s31-u01-w015": {
  "misconception": "비스듬한 면을 따라 오르는 길과 막대를 이용해 들어 올리는 도구의 쓰임을 구별해요."
 },
 "s31-u01-w017": {
  "explanation": "여기서 알아보는 것은 휠체어가 준비된 경사로를 따라 높은 곳으로 오를 때의 도움이에요. 계단을 이용하는 대신 완만한 면을 따라 오르는 셋째 설명을 골라요. 자르기·못 빼기·철사 다루기는 이 이동 상황의 쓰임이 아니에요."
 },
 "s31-u01-w020": {
  "misconception": "같은 상자와 바닥에서 짐의 무게만 바꾸었는지 확인하고, 출발시킬 때 드는 힘을 비교해요.",
  "explanation": "같은 상자와 바닥·방향·출발 방법에서 짐을 넣고 빼 무게를 바꾸는 비교예요. 짐을 더 실으면 출발에 더 큰 힘이 들므로 무게가 달라도 힘이 늘 같다는 첫째 설명이 맞지 않아요. 두 비교에서 같게 둔 조건도 함께 확인해요."
 },
 "s31-u01-w021": {
  "misconception": "개수를 세어 정한 일과 저울로 무게를 재어 정한 일을 구별해요.",
  "explanation": "고기·소포·몸무게·밀가루의 기록은 물체의 무게를 재어 사용해요. 연필 기록은 한 자루씩 센 개수로 값을 정하므로 무게를 읽는 일이 아닌 첫째 보기를 골라요. 무엇을 기준으로 정했는지를 읽는 문제예요."
 },
 "s31-u01-w023": {
  "explanation": "빈 고리일 때 표시 자가0을 가리키도록 맞추는 역할은 영점 조절 나사에 있어요. 따라서 그 나사를 돌리는 셋째 방법을 골라요. 물체를 걸어 값을 맞추거나 표시 자를 직접 누르면 재기 전의 기준을 제대로 확인한 것이 아니에요."
 },
 "s31-u01-w030": {
  "misconception": "어느 한쪽으로 기울어지지 않고 평평한 상태를 나타내는 말을 찾아요."
 },
 "s31-u01-w036": {
  "misconception": "무엇의 무게를 재는지, 그 무게를 알아야 하는 까닭은 무엇인지 사례마다 함께 설명해요."
 },
 "s31-u01-w044": {
  "misconception": "알아보려는 짐의 무게만 바꾸고, 수레와 바닥 등 나머지 조건은 같게 두어요."
 },
 "s31-u01-w055": {
  "misconception": "병뚜껑을 여는 병따개와 물체를 비스듬한 면을 따라 옮기는 빗면의 쓰임을 구별해요."
 },
 "s31-u01-w066": {
  "misconception": "바꾸는 조건, 같게 두는 조건, 비교할 결과를 구별해요."
 },
 "s31-u01-w070": {
  "misconception": "도구마다 어떤 일을 하는 데 쓰는지 살펴요. 무게를 재는 일과 물체를 옮기거나 뚜껑을 여는 일을 구별해요."
 },
 "s31-u01-w073": {
  "misconception": "짐의 무게만 바꾸어 같은 방법으로 비교하고, 두 경우에 드는 힘을 살핀 뒤 설명해요."
 },
 "s31-u01-w075": {
  "misconception": "밀 때와 당길 때 손이 힘을 주는 방향을 구별해 표시하고, 수레가 움직일 방향을 예상해요."
 },
 "s31-u01-w076": {
  "misconception": "두 그림에서 짐의 무게만 다르게 하고, 같게 둘 조건과 비교할 결과가 드러나게 표시해요."
 }
};
export function withForceWorkbookGuidance(workbook){
 if(workbook.unit!=='s31-u01')return workbook;
 return {...workbook,questions:workbook.questions.map(question=>{
  const patch=guidance[question.id];
  if(!patch)return question;
  return {...question,...patch,...(patch.misconception&&typeof question.mis==='string'?{mis:patch.misconception}:{})};
 })};
}

// Current observation evidence; prior questions and original banks are preserved above.
export const FORCE_OBSERVATION_VERSION='20261105-force-life-learner-reasoning';
const forceObservationPatch={
  "prompt": "두 수평잡기 기록을 보고 알 수 있는 것을 두 가지 고르세요.",
  "given": [
    "설명용 수평잡기 기록이에요. 빈 판자는 수평이고 양쪽 눈금 간격은 같아요. 같은 블록을 왼쪽에는 두 개, 오른쪽에는 한 개 놓았어요.",
    "㉠ 받침점에서 양쪽 모두 3번에 놓음: 왼쪽이 내려감.",
    "㉡ 왼쪽 1번·오른쪽 2번으로 옮김: 수평이 됨."
  ],
  "choices": [
    "같은 거리에 놓았을 때 블록 두 개 쪽이 더 무거워요.",
    "수평이 되었으니 두 쪽의 무게가 같아졌어요.",
    "무게가 달라도 놓는 위치를 바꾸어 수평을 잡을 수 있어요.",
    "위치를 옮기면 블록 한 개의 무게도 바뀌어요.",
    "두 기록은 블록을 놓은 위치가 같아요."
  ],
  "explanation": "㉠은 받침점에서 같은 거리에 놓았는데 왼쪽이 내려갔으므로 블록 두 개 쪽이 더 무거워요. ㉡은 블록의 개수는 그대로 두고 위치를 바꾸었더니 수평이 되었어요. 따라서 첫째와 셋째 보기를 골라요.",
  "misconception": "두 기록에서 달라진 것은 블록의 무게가 아니라 놓인 위치예요.",
  "criteria": "같은 거리의 무게 비교와 위치를 바꾼 수평잡기를 구별한 첫째·셋째 보기를 모두 고른 경우 인정해요."
};
export function withForceObservationData(workbook){
 if(workbook.unit!=='s31-u01')return workbook;
 const question=workbook.questions.find(q=>q.id==='s31-u01-w026');
 if(!question||question.form!=='multi'||JSON.stringify(question.key)!=='[0,2]')throw Error('Unexpected force observation question');
 return{...workbook,questions:workbook.questions.map(q=>q.id===question.id?{...q,...forceObservationPatch}:q)};
}
