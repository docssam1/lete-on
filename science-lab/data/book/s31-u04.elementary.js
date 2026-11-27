// Elementary directions; keep all earlier presentations and response contracts.
export const LIFE_ELEMENTARY_VERSION='20261108-life-elementary';
const UNIT='s31-u04';
const workbookPatches={
  "11": {
    "previous": "햇빛이 강낭콩의 자람에 미치는 영향을 비교할 때 같게 할 조건은 무엇인가요?",
    "sourceId": "s31-u04-b58",
    "prompt": "햇빛이 강낭콩의 자람에 어떤 영향을 주는지 비교하려고 해요. 실험할 때 같게 해야 할 조건을 고르세요."
  },
  "13": {
    "previous": "관찰 기록의 식물 가에 알맞은 한살이 유형을 고르세요.",
    "sourceId": "s31-u04-b01",
    "prompt": "관찰 기록을 보고, 식물 가의 한살이를 바르게 나타낸 말을 고르세요."
  },
  "14": {
    "previous": "다음 식물 나의 한살이에 대한 판단으로 알맞은 것은 무엇인가요?",
    "sourceId": "s31-u04-b02",
    "prompt": "자료의 식물 나를 알맞게 설명한 것을 고르세요."
  },
  "16": {
    "previous": "한해살이와 여러해살이를 비교하는 기준으로 가장 알맞은 것은 무엇인가요?",
    "sourceId": "s31-u04-b04",
    "prompt": "한해살이 식물과 여러해살이 식물을 나누려면 무엇을 살펴보아야 할까요?"
  },
  "17": {
    "previous": "두 모둠의 강아지가 걷기 시작한 날이 달랐습니다. 알맞은 판단은 무엇인가요?",
    "sourceId": "s31-u04-b13",
    "prompt": "두 모둠의 강아지가 걷기 시작한 날이 달랐어요. 이 자료를 보고 알맞게 설명한 것을 고르세요."
  },
  "19": {
    "previous": "이 기록을 시간에 따라 비교하기 위해 꼭 보완할 내용은 무엇인가요?",
    "sourceId": "s31-u04-b19",
    "prompt": "관찰 기록을 시간의 흐름에 따라 비교하려고 해요. 이 기록에 무엇을 더 적어야 할지 고르세요."
  },
  "20": {
    "previous": "이 자료만으로 할 수 있는 설명은 무엇인가요?",
    "sourceId": "s31-u04-b37",
    "prompt": "이 자료만 보고 알 수 있는 설명을 고르세요."
  },
  "21": {
    "previous": "이 두 곤충의 한살이를 나누는 기준은 무엇인가요?",
    "sourceId": "s31-u04-b41",
    "prompt": "두 곤충의 한살이가 어떻게 다른지 나누려면 무엇을 살펴야 할까요?"
  },
  "23": {
    "previous": "키만 비교하면 잘못 판단할 수 있음을 보여 주는 설명은 무엇인가요?",
    "sourceId": "s31-u04-b52",
    "prompt": "키가 큰 강낭콩이 언제나 더 튼튼하다고 할 수는 없어요. 그 까닭을 설명한 것을 고르세요."
  },
  "24": {
    "previous": "물의 영향을 알아보려는 계획을 공정하게 고친 것은 무엇인가요?",
    "sourceId": "s31-u04-b57",
    "prompt": "물의 영향만 알아볼 수 있게 실험 계획을 고친 것을 고르세요."
  },
  "25": {
    "previous": "같은 날짜에 싹튼 수를 비교하려면 씨앗 수를 어떻게 준비하는 것이 알맞나요?",
    "sourceId": "s31-u04-b60",
    "prompt": "같은 날에 싹튼 씨앗의 수를 비교하려고 해요. 처음에 씨앗의 수를 어떻게 준비해야 할까요?"
  },
  "26": {
    "previous": "식물의 한살이 유형을 비교한 설명으로 알맞은 두 개를 고르세요. (정답 2개)",
    "sourceId": "s31-u04-b07",
    "prompt": "식물의 한살이를 설명한 것 중 알맞은 것을 두 개 고르세요. (정답 2개)"
  },
  "29": {
    "previous": "가와 나에 알맞은 한살이 유형을 순서대로 쓰세요.",
    "sourceId": "s31-u04-b06",
    "prompt": "자료의 식물 가와 나의 한살이를 나타내는 말을 순서대로 쓰세요."
  },
  "31": {
    "previous": "시간에 따른 변화를 비교하려고 관찰할 때마다 달력으로 확인해 적는 것은 무엇인가요?",
    "sourceId": "s31-u04-b23",
    "prompt": "동물이 시간에 따라 어떻게 달라지는지 비교하려고 해요. 관찰할 때마다 달력을 보고 무엇을 적어야 할까요?"
  },
  "33": {
    "previous": "이 강낭콩 싹트기 실험에서 서로 다르게 한 조건의 이름을 쓰세요.",
    "sourceId": "s31-u04-b55",
    "prompt": "이 강낭콩 싹트기 실험에서 서로 다르게 한 것은 무엇인가요? 조건의 이름을 쓰세요."
  },
  "34": {
    "previous": "햇빛의 영향을 알아보는 이 계획에서 다르게 해야 할 조건 한 가지를 쓰세요.",
    "sourceId": "s31-u04-b63",
    "prompt": "이 실험 계획에서 햇빛의 영향을 알아보려고 해요. 서로 다르게 해야 할 조건 한 가지를 쓰세요."
  },
  "40": {
    "previous": "물과 온도를 동시에 다르게 하면 물의 영향만 알기 어려운 까닭을 쓰세요.",
    "sourceId": "s31-u04-b64",
    "prompt": "물과 온도를 동시에 다르게 했어요. 왜 이 실험만으로는 물의 영향을 알기 어려운지 쓰세요."
  },
  "41": {
    "previous": "이 수업용 물 비교 자료에서 말할 수 있는 것은?",
    "sourceId": null,
    "prompt": "수업용으로 만든 물 비교 자료를 보세요. 이 자료에서 알 수 있는 설명을 고르세요."
  },
  "42": {
    "previous": "이 계획의 결과를 물의 영향만으로 설명하기 어려운 까닭은?",
    "sourceId": null,
    "prompt": "이 실험 계획에서 결과가 달라진 까닭을 물 때문이라고만 말하기 어려워요. 그 까닭을 고르세요."
  },
  "43": {
    "previous": "온도 비교 자료를 알맞게 설명한 것은?",
    "sourceId": null,
    "prompt": "온도가 다를 때 씨앗이 싹튼 수를 비교한 자료를 보세요. 자료에 맞는 설명을 고르세요."
  },
  "44": {
    "previous": "햇빛 자료의 나는 줄기가 더 길어요. 타당한 판단은?",
    "sourceId": null,
    "prompt": "햇빛 자료에서 ‘나’의 줄기가 더 길어요. 튼튼하게 자랐는지 알아보려면 어떻게 해야 할까요?"
  },
  "45": {
    "previous": "이 기록을 알맞게 읽은 것은?",
    "sourceId": null,
    "prompt": "관찰 기록의 ‘가’와 ‘나’를 보고 알맞은 설명을 고르세요."
  },
  "46": {
    "previous": "같은 생물의 변화를 비교하려면 관찰한 [ ]와 개체 표시를 함께 남겨요.",
    "sourceId": null,
    "prompt": "같은 생물이 어떻게 달라지는지 비교하려면 관찰한 [ ]와 그 생물을 구별할 표시를 함께 남겨요."
  },
  "50": {
    "previous": "성충이 낳은 알은 같은 성충의 과거가 아니라 [ ] 세대로 이어져요.",
    "sourceId": null,
    "prompt": "성충이 낳은 알은 그 성충의 어린 시절이 아니에요. 그 알에서 [ ] 세대가 자라요."
  },
  "52": {
    "previous": "강낭콩 씨앗을 찬 곳과 따뜻한 곳에 두는 계획에서는 [ ]의 영향을 비교해요.",
    "sourceId": null,
    "prompt": "강낭콩 씨앗을 찬 곳과 따뜻한 곳에 두고 어떻게 다른지 살펴보려 해요. 이 계획에서는 [ ]의 영향을 비교해요."
  },
  "53": {
    "previous": "싹튼 강낭콩의 자람은 줄기 길이뿐 아니라 잎색·줄기 [ ]도 함께 살펴요.",
    "sourceId": null,
    "prompt": "싹튼 강낭콩이 자라는 모습을 볼 때 줄기 길이만 보지 말고 잎 색과 줄기 [ ]도 함께 살펴요."
  },
  "54": {
    "previous": "같은 개체가 여러 해 살아가는 식물은 [ ] 식물이에요.",
    "sourceId": null,
    "prompt": "처음 관찰한 그 식물이 여러 해 동안 살아가면 [ ] 식물이라고 해요."
  },
  "55": {
    "previous": "직접 보지 않은 단계는 참고한 자료의 제목·쪽수 등 [ ]를 밝혀요.",
    "sourceId": null,
    "prompt": "직접 보지 못한 단계를 참고 자료로 알아보았어요. 자료의 제목과 쪽수 등 [ ]를 적어요."
  },
  "57": {
    "previous": "식물의 한살이를 비교하는 타당한 판단을 모두 고르세요.",
    "sourceId": null,
    "prompt": "식물의 한살이를 비교한 설명 중 알맞은 것을 모두 고르세요."
  },
  "58": {
    "previous": "두 곤충의 단계 표에서 말할 수 있는 것을 모두 고르세요.",
    "sourceId": null,
    "prompt": "두 곤충의 한살이 단계 표를 보고 알 수 있는 설명을 모두 고르세요."
  },
  "59": {
    "previous": "식물의 자람을 비교한 자료를 해석하고 실제로 실험할 때 알맞은 것을 모두 고르세요.",
    "sourceId": null,
    "prompt": "식물의 자람을 비교한 자료를 읽었어요. 자료를 설명하거나 직접 실험할 때 알맞은 것을 모두 고르세요."
  },
  "60": {
    "previous": "자료를 믿고 비교할 수 있게 하는 방법을 모두 고르세요.",
    "sourceId": null,
    "prompt": "관찰한 결과를 믿고 비교할 수 있게 기록하려고 해요. 알맞은 방법을 모두 고르세요."
  },
  "61": {
    "previous": "배추흰나비 애벌레를 관찰하는 타당한 방법을 모두 고르세요.",
    "sourceId": null,
    "prompt": "배추흰나비 애벌레를 관찰하는 알맞은 방법을 모두 고르세요."
  },
  "62": {
    "previous": "한살이 소개 자료를 만들고 나눌 때 필요한 것을 모두 고르세요.",
    "sourceId": null,
    "prompt": "한살이를 소개하는 자료를 만들어 친구와 나누려고 해요. 필요한 내용을 모두 고르세요."
  },
  "63": {
    "previous": "이 실험의 결과 차이를 “물 때문에만 달라졌다”고 한 말을 고쳐요. 바르게 비교하려면 어떤 조건을 같게 해야 하는지도 써요.",
    "sourceId": null,
    "prompt": "이 실험에서 결과가 “물 때문에만 달라졌다”고 했어요. 이 말을 바르게 고쳐 쓰고, 물의 영향만 알아보려면 무엇을 같게 해야 할지도 쓰세요."
  },
  "64": {
    "previous": "친구가 나의 빈 기록을0개로 바꾸려 해요. 왜 바꾸면 안 되는지와 다음에 보완할 방법을 설명해요.",
    "sourceId": null,
    "prompt": "관찰 기록에서 ‘나’의 칸이 비어 있어요. 친구가 그 칸에 0개라고 쓰려고 해요. 왜 그렇게 쓰면 안 되는지와 다음에 기록을 보완할 방법을 쓰세요."
  },
  "65": {
    "previous": "기록과 그 성격을 연결해요.",
    "sourceId": null,
    "prompt": "각 기록을 읽고, 관찰한 사실·내 생각·결과를 모르는 날 중 알맞은 것과 연결하세요."
  },
  "66": {
    "previous": "단계와 이 자료의 특징을 연결해요.",
    "sourceId": null,
    "prompt": "배추흰나비의 한살이 단계와 자료에 나온 각 단계의 모습을 연결하세요."
  },
  "67": {
    "previous": "계획과 알아볼 것을 연결해요.",
    "sourceId": null,
    "prompt": "실험 계획과 그 실험에서 알아보려는 것을 연결하세요."
  },
  "68": {
    "previous": "자료와 판단을 연결해요.",
    "sourceId": null,
    "prompt": "각 자료와 그 자료를 보고 알 수 있는 내용을 연결하세요."
  },
  "69": {
    "previous": "내용과 계획에서의 역할을 연결해요.",
    "sourceId": null,
    "prompt": "실험 계획의 내용을 읽고, 다르게 할 조건·같게 할 조건·살펴볼 결과 중 알맞은 것과 연결하세요."
  },
  "70": {
    "previous": "자료와 소개할 때의 구별을 연결해요.",
    "sourceId": null,
    "prompt": "한살이를 소개할 때 내 관찰 기록·참고한 자료·친구의 질문을 구별하려고 해요. 각 자료를 알맞은 보기와 연결하세요."
  },
  "71": {
    "previous": "배추흰나비의 단계를 알부터 시간 순서대로 배열해요.",
    "sourceId": null,
    "prompt": "배추흰나비의 한살이 단계를 알부터 시간 순서대로 쓰세요."
  },
  "72": {
    "previous": "강낭콩 씨앗의 싹트기에 물이 미치는 영향을 알아보는 실험 순서로 배열해요.",
    "sourceId": null,
    "prompt": "강낭콩 씨앗이 싹트는 데 물이 어떤 영향을 주는지 알아보려고 해요. 실험할 순서대로 기호를 쓰세요."
  },
  "73": {
    "previous": "같은 개체의 변화를 관찰하는 절차로 배열해요.",
    "sourceId": null,
    "prompt": "같은 생물이 시간에 따라 변하는 모습을 관찰하려고 해요. 할 일을 순서대로 쓰세요."
  },
  "74": {
    "previous": "한살이 소개 자료를 나누는 절차로 배열해요.",
    "sourceId": null,
    "prompt": "한살이 소개 자료를 친구에게 보여 주고 의견을 나누려고 해요. 할 일을 순서대로 쓰세요."
  },
  "76": {
    "previous": "강낭콩 씨앗의 싹트기에 물이 미치는 영향을 알아볼 두 묶음을 그려요. 묶음마다 씨앗 5개를 준비하고, 다르게 할 물 조건과 같게 할 온도·씨앗의 종류·수를 표시해요. 관찰 방법도 적어요.",
    "sourceId": null,
    "prompt": "강낭콩 씨앗이 싹트는 데 물이 어떤 영향을 주는지 알아볼 두 묶음을 그리세요. 씨앗은 묶음마다 5개씩 준비해요. 물의 조건은 다르게 하고, 온도·씨앗의 종류와 수는 같게 한 모습을 표시하세요. 관찰할 방법도 적으세요."
  },
  "77": {
    "previous": "햇빛 자료의 가·나를 그림으로 비교해요. 줄기 길이·굵기·잎색과 빛 조건을 표시하고 키만으로 튼튼함을 정할 수 없는 근거를 적어요.",
    "sourceId": null,
    "prompt": "햇빛 자료의 가와 나를 그림으로 비교하세요. 줄기의 길이·굵기와 잎 색, 빛을 받는 조건을 표시하세요. 키만 보고 튼튼하게 자랐다고 할 수 없는 까닭도 쓰세요."
  },
  "78": {
    "previous": "같은 식물이 여러 해 사는 경우와 그 식물의 씨앗에서 새 식물이 자라는 경우를 두 그림으로 나타내요. 같은 개체인지 알아볼 표시와 설명을 붙여요.",
    "sourceId": null,
    "prompt": "같은 식물이 이듬해에도 살아 있는 모습과, 그 식물의 씨앗에서 새 식물이 자라는 모습을 각각 그리세요. 어느 것이 처음 관찰한 식물인지 알 수 있게 표시하고 설명하세요."
  },
  "80": {
    "previous": "한살이 소개 자료의 구성을 그려요. 내 관찰 기록과 참고 자료, 한살이 단계와 변화를 넣을 곳을 표시해요. 친구에게 소개할 순서와 물을 질문도 적어요.",
    "sourceId": null,
    "prompt": "한살이를 소개할 자료를 만들려고 해요. 내 관찰 기록과 참고 자료, 한살이 단계와 변화를 어디에 넣을지 그리세요. 친구에게 소개할 순서와 물어볼 질문도 적으세요."
  }
};
const bankPatches={
  "s31-u04-b01": {
    "previous": "관찰 기록의 식물 가에 알맞은 한살이 유형을 고르세요.",
    "previousVersion": 1,
    "prompt": "관찰 기록을 보고, 식물 가의 한살이를 바르게 나타낸 말을 고르세요."
  },
  "s31-u04-b02": {
    "previous": "다음 식물 나의 한살이에 대한 판단으로 알맞은 것은 무엇인가요?",
    "previousVersion": 1,
    "prompt": "자료의 식물 나를 알맞게 설명한 것을 고르세요."
  },
  "s31-u04-b04": {
    "previous": "한해살이와 여러해살이를 비교하는 기준으로 가장 알맞은 것은 무엇인가요?",
    "previousVersion": 1,
    "prompt": "한해살이 식물과 여러해살이 식물을 나누려면 무엇을 살펴보아야 할까요?"
  },
  "s31-u04-b06": {
    "previous": "가와 나에 알맞은 한살이 유형을 순서대로 쓰세요.",
    "previousVersion": 1,
    "prompt": "자료의 식물 가와 나의 한살이를 나타내는 말을 순서대로 쓰세요."
  },
  "s31-u04-b07": {
    "previous": "식물의 한살이 유형을 비교한 설명으로 알맞은 두 개를 고르세요. (정답 2개)",
    "previousVersion": 1,
    "prompt": "식물의 한살이를 설명한 것 중 알맞은 것을 두 개 고르세요. (정답 2개)"
  },
  "s31-u04-b08": {
    "previous": "두 식물의 한살이 유형을 나눌 때, 어떤 관찰 기준을 써야 하는지 설명하세요.",
    "previousVersion": 1,
    "prompt": "두 식물의 한살이를 나누려면 무엇을 관찰해야 할까요? 관찰할 기준을 설명하세요."
  },
  "s31-u04-b10": {
    "previous": "두 동물의 자료에서 대를 잇는 방식이 바르게 연결된 것은 무엇인가요?",
    "previousVersion": 1,
    "prompt": "두 동물이 어떻게 자손을 남기는지 자료에 맞게 연결한 것을 고르세요."
  },
  "s31-u04-b13": {
    "previous": "두 모둠의 강아지가 걷기 시작한 날이 달랐습니다. 알맞은 판단은 무엇인가요?",
    "previousVersion": 1,
    "prompt": "두 모둠의 강아지가 걷기 시작한 날이 달랐어요. 이 자료를 보고 알맞게 설명한 것을 고르세요."
  },
  "s31-u04-b19": {
    "previous": "이 기록을 시간에 따라 비교하기 위해 꼭 보완할 내용은 무엇인가요?",
    "previousVersion": 1,
    "prompt": "관찰 기록을 시간의 흐름에 따라 비교하려고 해요. 이 기록에 무엇을 더 적어야 할지 고르세요."
  },
  "s31-u04-b23": {
    "previous": "시간에 따른 변화를 비교하려고 관찰할 때마다 달력으로 확인해 적는 것은 무엇인가요?",
    "previousVersion": 1,
    "prompt": "동물이 시간에 따라 어떻게 달라지는지 비교하려고 해요. 관찰할 때마다 달력을 보고 무엇을 적어야 할까요?"
  },
  "s31-u04-b37": {
    "previous": "이 자료만으로 할 수 있는 설명은 무엇인가요?",
    "previousVersion": 1,
    "prompt": "이 자료만 보고 알 수 있는 설명을 고르세요."
  },
  "s31-u04-b40": {
    "previous": "배추흰나비 성충이 알을 낳았을 때, 그 알이 성충 자신의 어린 시절로 되돌아간 것인지 설명하세요.",
    "previousVersion": 1,
    "prompt": "성충 배추흰나비가 알을 낳았어요. 이 알이 같은 성충의 어린 시절로 돌아간 것인지 설명하세요."
  },
  "s31-u04-b41": {
    "previous": "이 두 곤충의 한살이를 나누는 기준은 무엇인가요?",
    "previousVersion": 1,
    "prompt": "두 곤충의 한살이가 어떻게 다른지 나누려면 무엇을 살펴야 할까요?"
  },
  "s31-u04-b43": {
    "previous": "잠자리가 번데기 단계를 거치지 않는다는 자료를 읽고 바르게 설명한 것은 무엇인가요?",
    "previousVersion": 1,
    "prompt": "잠자리는 번데기 단계를 거치지 않는다는 자료를 읽었어요. 이 자료에 맞는 설명을 고르세요."
  },
  "s31-u04-b45": {
    "previous": "두 한살이 자료를 비교하는 방법으로 알맞은 것은 무엇인가요?",
    "previousVersion": 1,
    "prompt": "두 곤충의 한살이 자료를 비교하려고 해요. 알맞은 방법을 고르세요."
  },
  "s31-u04-b46": {
    "previous": "자료와 일치하는 설명을 고르세요. (정답 2개)",
    "previousVersion": 1,
    "prompt": "자료에 맞는 설명을 두 개 고르세요. (정답 2개)"
  },
  "s31-u04-b49": {
    "previous": "같은 강낭콩 씨앗으로 얻은 이 모형 기록에서 비교한 조건은 무엇인가요?",
    "previousVersion": 1,
    "prompt": "같은 종류의 강낭콩 씨앗으로 만든 수업용 모형 기록이에요. 서로 다르게 해 비교한 조건은 무엇인가요?"
  },
  "s31-u04-b52": {
    "previous": "키만 비교하면 잘못 판단할 수 있음을 보여 주는 설명은 무엇인가요?",
    "previousVersion": 1,
    "prompt": "키가 큰 강낭콩이 언제나 더 튼튼하다고 할 수는 없어요. 그 까닭을 설명한 것을 고르세요."
  },
  "s31-u04-b53": {
    "previous": "이 관찰 결과를 설명하는 문장으로 알맞은 것은 무엇인가요?",
    "previousVersion": 1,
    "prompt": "관찰한 결과에 맞는 설명을 고르세요."
  },
  "s31-u04-b54": {
    "previous": "강낭콩을 관찰하는 질문과 알맞게 연결한 것을 고르세요. (정답 2개)",
    "previousVersion": 1,
    "prompt": "강낭콩의 싹트기와 자람을 알아보는 방법으로 알맞은 것을 두 개 고르세요. (정답 2개)"
  },
  "s31-u04-b55": {
    "previous": "이 강낭콩 싹트기 실험에서 서로 다르게 한 조건의 이름을 쓰세요.",
    "previousVersion": 1,
    "prompt": "이 강낭콩 싹트기 실험에서 서로 다르게 한 것은 무엇인가요? 조건의 이름을 쓰세요."
  },
  "s31-u04-b56": {
    "previous": "키가 더 큰 나를 더 튼튼하다고 바로 정할 수 없는 까닭을 자료에서 한 가지 쓰세요.",
    "previousVersion": 1,
    "prompt": "키가 더 큰 ‘나’가 더 튼튼하다고 바로 정할 수는 없어요. 그 까닭을 자료에서 한 가지 찾아 쓰세요."
  },
  "s31-u04-b57": {
    "previous": "물의 영향을 알아보려는 계획을 공정하게 고친 것은 무엇인가요?",
    "previousVersion": 1,
    "prompt": "물의 영향만 알아볼 수 있게 실험 계획을 고친 것을 고르세요."
  },
  "s31-u04-b58": {
    "previous": "햇빛이 강낭콩의 자람에 미치는 영향을 비교할 때 같게 할 조건은 무엇인가요?",
    "previousVersion": 1,
    "prompt": "햇빛이 강낭콩의 자람에 어떤 영향을 주는지 비교하려고 해요. 실험할 때 같게 해야 할 조건을 고르세요."
  },
  "s31-u04-b59": {
    "previous": "실험하기 전에 세울 수 있는 검증 가능한 예상은 무엇인가요?",
    "previousVersion": 1,
    "prompt": "실험하기 전에 세울 예상이에요. 실험으로 확인해 볼 수 있는 예상을 고르세요."
  },
  "s31-u04-b60": {
    "previous": "같은 날짜에 싹튼 수를 비교하려면 씨앗 수를 어떻게 준비하는 것이 알맞나요?",
    "previousVersion": 1,
    "prompt": "같은 날에 싹튼 씨앗의 수를 비교하려고 해요. 처음에 씨앗의 수를 어떻게 준비해야 할까요?"
  },
  "s31-u04-b61": {
    "previous": "실험 결과가 처음 예상과 달랐을 때 알맞은 행동은 무엇인가요?",
    "previousVersion": 1,
    "prompt": "실험 결과가 처음 예상과 달랐어요. 이때 어떻게 하면 좋을지 고르세요."
  },
  "s31-u04-b62": {
    "previous": "햇빛의 영향을 공정하게 비교할 계획을 고르세요. (정답 2개)",
    "previousVersion": 1,
    "prompt": "햇빛의 영향만 알아보려 해요. 알맞은 실험 계획을 두 개 고르세요. (정답 2개)"
  },
  "s31-u04-b63": {
    "previous": "햇빛의 영향을 알아보는 이 계획에서 다르게 해야 할 조건 한 가지를 쓰세요.",
    "previousVersion": 1,
    "prompt": "이 실험 계획에서 햇빛의 영향을 알아보려고 해요. 서로 다르게 해야 할 조건 한 가지를 쓰세요."
  },
  "s31-u04-b64": {
    "previous": "물과 온도를 동시에 다르게 하면 물의 영향만 알기 어려운 까닭을 쓰세요.",
    "previousVersion": 1,
    "prompt": "물과 온도를 동시에 다르게 했어요. 왜 이 실험만으로는 물의 영향을 알기 어려운지 쓰세요."
  }
};
const cache=new WeakMap(),clone=value=>JSON.parse(JSON.stringify(value));
export function lifeElementaryCurrentItems(rows,unit=UNIT){
 if(unit!==UNIT||!Array.isArray(rows))return rows;
 let changed=false;
 const next=rows.map(q=>{
  const patch=bankPatches[q.id];
  if(!patch||q.status!=='authored'||q.sourceRef?.type!=='authored-supplement'||(q.contentVersion||1)!==patch.previousVersion||q.prompt!==patch.previous)return q;
  changed=true;if(cache.has(q))return cache.get(q);
  const current={...q,prompt:patch.prompt,contentVersion:LIFE_ELEMENTARY_VERSION,previousVersions:[...(q.previousVersions?clone(q.previousVersions):[]),{...clone(q),version:q.contentVersion||1}]};
  cache.set(q,current);return current;
 });
 return changed?next:rows;
}
export function withLifeElementaryWorkbook(workbook){
 if(workbook?.unit!==UNIT)return workbook;
 let changed=false;
 const questions=workbook.questions.map(q=>{
  const patch=workbookPatches[q.no];
  if(!patch||q.id!==UNIT+'-w'+String(q.no).padStart(3,'0')||(q.sourceId??null)!==patch.sourceId||(q.sourceRef&&!['authored-workbook','authored-supplement'].includes(q.sourceRef.type))||q.contentVersion!=null||q.prompt!==patch.previous)return q;
  changed=true;return {...q,prompt:patch.prompt};
 });
 return changed?{...workbook,questions}:workbook;
}
export function withLifeElementaryClassroom(unit,mod){
 const items=lifeElementaryCurrentItems(mod.classroomItems,unit);
 return items===mod.classroomItems?mod:{...mod,classroomItems:items};
}
