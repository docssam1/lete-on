// Reviewed wording for the current authored Earth-and-sea questions. Grading and source rows remain intact.
export const EARTH_SEA_ELEMENTARY_VERSION='20261108-earth-sea-elementary';
const UNIT='c22-s32-u02';
const workbookPatches={
  "8": {
    "previous": "가 지역 사진과 나 지구 전체 자료를 읽은 설명으로 알맞은 것은 무엇인가요?",
    "prompt": "가에는 한 지역의 사진, 나에는 지구 전체의 자료가 있어요. 두 자료를 바르게 설명한 것을 고르세요."
  },
  "11": {
    "previous": "바닷물과 육지의 물을 비교한 일반적인 설명은 무엇인가요?",
    "prompt": "바닷물과 육지의 물은 보통 어떤 점이 다를까요? 알맞은 설명을 고르세요."
  },
  "12": {
    "previous": "가상 관찰 표에서 직접 읽을 수 있는 내용은 무엇인가요?",
    "prompt": "연습용 관찰 표를 읽고 알 수 있는 내용을 고르세요."
  },
  "13": {
    "previous": "물 색깔만 보고 바닷물인지 확정하기 어려운 까닭은 무엇인가요?",
    "prompt": "물의 색깔만 보고 바닷물인지 알기 어려운 까닭을 고르세요."
  },
  "15": {
    "previous": "두 물의 남는 물질을 비교할 때 다르게 정할 것은 무엇인가요?",
    "prompt": "두 종류의 물을 가열해 남는 물질을 비교하려고 해요. 무엇을 다르게 해야 할까요?"
  },
  "28": {
    "previous": "제공한 기록으로 뒷받침되는 설명 두 가지를 고르세요. (정답 2개)",
    "prompt": "기록을 읽고 알 수 있는 설명 두 가지를 고르세요. (정답 2개)"
  },
  "31": {
    "previous": "바닷물을 가열하여 물이 줄어들 때 남는 흰 물질은 바닷물에 무엇이 녹아 있었기 때문인가요?",
    "prompt": "바닷물을 가열했더니 물이 줄어들고 흰 물질이 남았어요. 바닷물에 무엇이 녹아 있었을까요?"
  },
  "35": {
    "previous": "구름이 많은 지구 사진 한 장만으로 육지와 바다의 넓이를 확정하기 어려운 까닭과 더 확인할 방법을 설명해 보세요.",
    "prompt": "구름이 많은 지구 사진 한 장만 보고 육지와 바다의 넓이를 알아내기 어려운 까닭을 쓰세요. 더 알아볼 방법도 설명해 보세요."
  },
  "36": {
    "previous": "바닷물을 가열해 흰 물질을 보았어요. 이 결과를 모든 육지의 물에는 아무 물질도 없다는 주장과 구별해 설명해 보세요.",
    "prompt": "바닷물을 가열했더니 흰 물질이 남았어요. 이 결과만 보고 ‘모든 육지의 물에는 녹아 있는 물질이 없다’고 말할 수 있을까요? 까닭을 설명해 보세요."
  },
  "38": {
    "previous": "가와 나 사진 카드가 보여 주는 바닷가의 차이를 보이는 특징으로 비교해 보세요.",
    "prompt": "가와 나 사진 카드에서 바닷가의 모습이 어떻게 다른지 설명하세요. 사진에서 보이는 특징을 써 보세요."
  },
  "39": {
    "previous": "같은 바닷가에서 물이 들어와 높아지고 갯벌이 점점 잠기는 모습을 보았어요. 어떤 변화인지 근거와 함께 설명해 보세요.",
    "prompt": "같은 바닷가로 물이 들어와 물 높이가 높아지고 갯벌이 점점 잠겼어요. 어떤 변화인가요? 그렇게 생각한 까닭도 설명해 보세요."
  },
  "40": {
    "previous": "게와 조개, 먹이를 찾는 물새의 기록을 근거로 갯벌을 보전해야 할 까닭을 설명해 보세요.",
    "prompt": "기록에는 갯벌에 게와 조개가 살고 물새가 먹이를 찾는다고 쓰여 있어요. 이 내용을 넣어 갯벌을 지켜야 하는 까닭을 설명해 보세요."
  },
  "41": {
    "previous": "갯벌에서 물새가 먹이를 찾는 자료가 있어요. 이 자료로 설명할 수 있는 가치는?",
    "prompt": "갯벌에서 물새가 먹이를 찾고 있어요. 갯벌이 주는 도움으로 알맞은 것을 고르세요."
  },
  "43": {
    "previous": "같은 해안의 오전 자료에서 물 높이가 낮아졌어요. 알맞은 설명은?",
    "prompt": "같은 바닷가의 오전 기록에서 물 높이가 낮아졌어요. 알맞은 설명을 고르세요."
  },
  "45": {
    "previous": "우리 동네 사진에는 땅이 넓게 나와요. 지구 전체 넓이를 알려면?",
    "prompt": "우리 동네 사진에는 땅이 넓게 나와요. 지구 전체의 육지와 바다 넓이를 비교하려면 어떻게 해야 할까요?"
  },
  "46": {
    "previous": "같은 양의 두 물을 말렸더니 한 접시에서 눈에 띄는 물질이 거의 없었어요. 알맞은 설명은?",
    "prompt": "같은 양의 두 물을 말렸더니 한 접시에는 눈에 보이는 물질이 거의 없었어요. 알맞은 설명을 고르세요."
  },
  "53": {
    "previous": "9시에서 11시로 물이 높아지는 변화는 [ ](밀물/썰물)이에요. 12시 물 높이가 얼마인지는 [ ](높음/알 수 없음)으로 답해요.",
    "prompt": "9시에서 11시로 가며 물 높이가 높아졌어요. 이 변화는 [ ](밀물/썰물)이에요. 12시 물 높이에 대한 답은 [ ](높음/알 수 없음) 중에서 골라요."
  },
  "57": {
    "previous": "두 물의 종류에 따른 차이를 비교하려고 해요. 다른 조건을 맞춘 비교안을 모두 고르세요.",
    "prompt": "두 종류의 물을 가열해 남는 물질을 비교하려고 해요. 물의 종류 말고 다른 조건이 같은 계획을 모두 고르세요."
  },
  "58": {
    "previous": "같은 해안에서 같은 기준으로 남긴 연습 기록이에요. 이 기록으로 알 수 있는 설명을 모두 고르세요.",
    "prompt": "같은 바닷가에서 물 높이를 같은 기준으로 비교한 연습 기록이에요. 기록을 읽고 알 수 있는 설명을 모두 고르세요."
  },
  "59": {
    "previous": "갯벌의 가치와 행동을 알맞게 연결한 것을 모두 골라요.",
    "prompt": "갯벌이 도움을 주는 점과 갯벌을 지키는 행동을 알맞게 연결한 것을 모두 고르세요."
  },
  "61": {
    "previous": "바다 위에는 대기가 없다는 말이 맞는지 쓰고 짧게 고쳐 쓰세요.",
    "prompt": "‘바다 위에는 대기가 없다’는 말이 맞을까요? 맞는지 쓰고, 바른 설명으로 고쳐 쓰세요."
  },
  "62": {
    "previous": "바닷물 10 mL와 수돗물 40 mL를 비교하려 해요. 먼저 맞출 조건 한 가지를 쓰세요.",
    "prompt": "바닷물 10 mL와 수돗물 40 mL를 가열해 남는 물질을 비교하려고 해요. 먼저 같게 맞출 조건 한 가지를 쓰세요."
  },
  "63": {
    "previous": "같은 해안의 물 높이가 낮음 → 중간 → 높음으로 변했어요. 어떤 변화인지 쓰세요.",
    "prompt": "같은 바닷가의 물 높이가 낮음 → 중간 → 높음으로 변했어요. 이 변화의 이름을 쓰세요."
  },
  "64": {
    "previous": "갯벌에서 게와 조개가 살고 물새가 먹이를 찾는다는 자료로 알 수 있는 가치 한 가지를 쓰세요.",
    "prompt": "자료에는 갯벌에서 게와 조개가 살고 물새가 먹이를 찾는다고 쓰여 있어요. 갯벌이 주는 도움 한 가지를 쓰세요."
  },
  "68": {
    "previous": "조건을 역할에 맞게 연결해요.",
    "prompt": "두 종류의 물을 비교하는 실험이에요. 관찰할 결과, 바꿀 조건, 같게 할 조건을 찾아 연결하세요."
  },
  "70": {
    "previous": "가치와 연결되는 행동을 골라요.",
    "prompt": "갯벌이 도움을 주는 점과 갯벌을 지키는 행동을 연결하세요."
  },
  "71": {
    "previous": "교사와 두 물을 비교할 순서로 배열해요.",
    "prompt": "선생님과 두 종류의 물을 비교하는 실험이에요. 실험 순서대로 기호를 쓰세요."
  },
  "72": {
    "previous": "같은 해안의 자료를 읽을 순서로 배열해요.",
    "prompt": "같은 바닷가의 자료를 살펴보려고 해요. 할 일을 순서대로 기호로 쓰세요."
  },
  "73": {
    "previous": "근거 있는 갯벌 보전 글을 만들 순서로 배열해요.",
    "prompt": "알아본 내용을 넣어 갯벌을 지키자는 글을 쓰려고 해요. 할 일을 순서대로 기호로 쓰세요."
  },
  "74": {
    "previous": "양이 달랐던 비교 계획을 고칠 순서로 배열해요.",
    "prompt": "두 물의 양이 달랐던 실험 계획을 고치려고 해요. 할 일을 순서대로 기호로 쓰세요."
  },
  "76": {
    "previous": "같은 양의 바닷물과 수돗물을 비교할 준비를 그려요. 바꿀 것 한 가지·같게 둘 것 두 가지를 이름표로 표시해요.",
    "prompt": "같은 양의 바닷물과 수돗물을 비교할 준비를 그리세요. 다르게 할 것 한 가지와 같게 할 것 두 가지를 이름표로 표시하세요."
  },
  "79": {
    "previous": "게·조개·물새가 이용하는 갯벌을 지키는 안내 그림을 만들어요. 가치 한 가지와 실천 행동 두 가지를 말풍선이나 이름표로 넣어요.",
    "prompt": "게·조개·물새가 이용하는 갯벌을 지키자는 안내 그림을 만드세요. 갯벌이 도움을 주는 점 한 가지와 지키기 위해 할 일 두 가지를 말풍선이나 이름표로 넣으세요."
  },
  "80": {
    "previous": "‘내 동네에 땅이 많으니 지구도 육지가 더 넓다’는 주장을 고칠 두 자료를 그림이나 표로 나타내요. 각 자료의 범위를 적어요.",
    "prompt": "친구가 ‘우리 동네에 땅이 많으니 지구 전체도 육지가 더 넓다’고 말했어요. 이 말을 고치는 데 필요한 자료 두 가지를 그림이나 표로 나타내세요. 각 자료가 우리 동네만 보여 주는지, 지구 전체를 보여 주는지도 적으세요."
  }
};
const bankPatches={
  "c22-s32-u02-b18": {
    "previous": "가 지역 사진과 나 지구 전체 자료를 읽은 설명으로 알맞은 것은 무엇인가요?",
    "previousVersion": 1,
    "prompt": "가에는 한 지역의 사진, 나에는 지구 전체의 자료가 있어요. 두 자료를 바르게 설명한 것을 고르세요."
  },
  "c22-s32-u02-b25": {
    "previous": "바닷물과 육지의 물을 비교한 일반적인 설명은 무엇인가요?",
    "previousVersion": "20261105-earth-sea-learner-reasoning",
    "prompt": "바닷물과 육지의 물은 보통 어떤 점이 다를까요? 알맞은 설명을 고르세요."
  },
  "c22-s32-u02-b26": {
    "previous": "가상 관찰 표에서 직접 읽을 수 있는 내용은 무엇인가요?",
    "previousVersion": "20261105-material-earth-student-language",
    "prompt": "연습용 관찰 표를 읽고 알 수 있는 내용을 고르세요."
  },
  "c22-s32-u02-b27": {
    "previous": "물 색깔만 보고 바닷물인지 확정하기 어려운 까닭은 무엇인가요?",
    "previousVersion": 1,
    "prompt": "물의 색깔만 보고 바닷물인지 알기 어려운 까닭을 고르세요."
  },
  "c22-s32-u02-b33": {
    "previous": "두 물의 남는 물질을 비교할 때 다르게 정할 것은 무엇인가요?",
    "previousVersion": 1,
    "prompt": "두 종류의 물을 가열해 남는 물질을 비교하려고 해요. 무엇을 다르게 해야 할까요?"
  },
  "c22-s32-u02-b70": {
    "previous": "제공한 기록으로 뒷받침되는 설명 두 가지를 고르세요. (정답 2개)",
    "previousVersion": 1,
    "prompt": "기록을 읽고 알 수 있는 설명 두 가지를 고르세요. (정답 2개)"
  },
  "c22-s32-u02-b31": {
    "previous": "바닷물을 가열하여 물이 줄어들 때 남는 흰 물질은 바닷물에 무엇이 녹아 있었기 때문인가요?",
    "previousVersion": 1,
    "prompt": "바닷물을 가열했더니 물이 줄어들고 흰 물질이 남았어요. 바닷물에 무엇이 녹아 있었을까요?"
  },
  "c22-s32-u02-b24": {
    "previous": "구름이 많은 지구 사진 한 장만으로 육지와 바다의 넓이를 확정하기 어려운 까닭과 더 확인할 방법을 설명해 보세요.",
    "previousVersion": 1,
    "prompt": "구름이 많은 지구 사진 한 장만 보고 육지와 바다의 넓이를 알아내기 어려운 까닭을 쓰세요. 더 알아볼 방법도 설명해 보세요."
  },
  "c22-s32-u02-b32": {
    "previous": "바닷물을 가열해 흰 물질을 보았어요. 이 결과를 모든 육지의 물에는 아무 물질도 없다는 주장과 구별해 설명해 보세요.",
    "previousVersion": 1,
    "prompt": "바닷물을 가열했더니 흰 물질이 남았어요. 이 결과만 보고 ‘모든 육지의 물에는 녹아 있는 물질이 없다’고 말할 수 있을까요? 까닭을 설명해 보세요."
  },
  "c22-s32-u02-b48": {
    "previous": "가와 나 사진 카드가 보여 주는 바닷가의 차이를 보이는 특징으로 비교해 보세요.",
    "previousVersion": 1,
    "prompt": "가와 나 사진 카드에서 바닷가의 모습이 어떻게 다른지 설명하세요. 사진에서 보이는 특징을 써 보세요."
  },
  "c22-s32-u02-b56": {
    "previous": "같은 바닷가에서 물이 들어와 높아지고 갯벌이 점점 잠기는 모습을 보았어요. 어떤 변화인지 근거와 함께 설명해 보세요.",
    "previousVersion": 1,
    "prompt": "같은 바닷가로 물이 들어와 물 높이가 높아지고 갯벌이 점점 잠겼어요. 어떤 변화인가요? 그렇게 생각한 까닭도 설명해 보세요."
  },
  "c22-s32-u02-b72": {
    "previous": "게와 조개, 먹이를 찾는 물새의 기록을 근거로 갯벌을 보전해야 할 까닭을 설명해 보세요.",
    "previousVersion": 1,
    "prompt": "기록에는 갯벌에 게와 조개가 살고 물새가 먹이를 찾는다고 쓰여 있어요. 이 내용을 넣어 갯벌을 지켜야 하는 까닭을 설명해 보세요."
  },
  "c22-s32-u02-b65": {
    "previous": "제공한 조사 자료에서 찾을 수 있는 갯벌의 가치는 무엇인가요?",
    "previousVersion": 1,
    "prompt": "조사 자료를 읽고 갯벌이 주는 도움으로 알맞은 것을 고르세요."
  },
  "c22-s32-u02-b73": {
    "previous": "갯벌 보전 홍보문에서 근거와 행동을 연결한 것은 무엇인가요?",
    "previousVersion": 1,
    "prompt": "갯벌을 지켜야 하는 까닭과 지키기 위한 행동을 알맞게 연결한 글을 고르세요."
  },
  "c22-s32-u02-b80": {
    "previous": "친구들에게 갯벌 보전을 권하는 짧은 글을 쓰세요. 조사한 가치 한 가지와 그 가치에 맞는 행동을 연결해 보세요.",
    "previousVersion": 1,
    "prompt": "친구에게 갯벌을 지키자고 알리는 짧은 글을 쓰세요. 조사해서 알게 된 갯벌의 도움 한 가지와 그 도움을 지키기 위해 할 일을 함께 설명하세요."
  }
};
export const EARTH_SEA_ELEMENTARY_BANK_IDS=Object.freeze(Object.keys(bankPatches));
const clone=value=>JSON.parse(JSON.stringify(value));
const cache=new WeakMap();

export function earthSeaElementaryCurrentItems(rows,unit){
 if(unit!==UNIT||!Array.isArray(rows))return rows;
 let changed=false;
 const next=rows.map(q=>{
  const patch=bankPatches[q.id];
  if(!patch||q.status!=='authored'||!['authored-supplement','authored-lesson'].includes(q.sourceRef?.type)||(q.contentVersion||1)!==patch.previousVersion||q.prompt!==patch.previous)return q;
  changed=true;
  if(cache.has(q))return cache.get(q);
  const current={...q,prompt:patch.prompt,contentVersion:EARTH_SEA_ELEMENTARY_VERSION,previousVersions:[...(q.previousVersions?clone(q.previousVersions):[]),{...clone(q),version:q.contentVersion||1}]};
  cache.set(q,current);return current;
 });
 return changed?next:rows;
}

export function withEarthSeaElementaryWorkbook(workbook){
 if(workbook.unit!==UNIT)return workbook;
 let changed=false;
 const questions=workbook.questions.map(q=>{
  const patch=workbookPatches[q.no];
  if(!patch||q.prompt!==patch.previous)return q;
  changed=true;return {...q,prompt:patch.prompt};
 });
 return changed?{...workbook,questions}:workbook;
}

export function withEarthSeaElementaryClassroom(unit,mod){
 const items=earthSeaElementaryCurrentItems(mod.classroomItems,unit);
 return items===mod.classroomItems?mod:{...mod,classroomItems:items};
}
