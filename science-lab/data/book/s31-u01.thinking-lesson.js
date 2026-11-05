// 교과 연결 사고력 수업 원고. 실제 활동 기록과 보고서는 기존 교재에 보존한다.
export const chapter = {
 "forceThinking": true,
 "slideCues": {
 "cover": "물체를 밀고 당길 때의 변화와 무게를 비교하는 방법을 알아보아요.",
 "phenomenon": "겉모습이 같은 두 물체의 무게를 어떻게 비교할지 생각해 보아요.",
 "scene": "받침점과 수평대의 모습을 살펴보고, 물체를 놓은 위치를 찾아보아요.",
 "goal": "밀고 당길 때의 변화, 무게 비교, 저울, 생활 도구의 쓰임을 차례로 살펴보아요.",
 "design": "무게를 비교할 때와 수평이 되는 위치를 찾을 때 각각 어떤 조건을 같게 할지 생각해요.",
 "lab": "같은 거리에서 예상하고 관찰한 뒤 기록해요. 그다음 한쪽 위치만 바꾸어 비교해요.",
 "results": "표에서 두 물체를 놓은 거리와 어느 쪽이 내려갔는지 함께 살펴보아요.",
 "conclusion": "관찰하기 전에 고른 예상을 떠올리고, 비교 결과로 생각을 설명해 보아요.",
 "recall": "두 물체의 무게를 설명하려면 수평대의 어떤 조건을 확인해야 할까요?",
 "push": "두 수레 자료에서 같게 한 조건과 달리한 조건을 찾아보아요.",
 "scale": "저울을 바르게 사용했는지 살피고 표시된 값과 단위를 함께 읽어요.",
 "tools": "같은 물체를 같은 높이로 옮길 때 도구의 쓰임과 드는 힘을 비교해 보아요.",
 "apply": "두 주장 중 하나를 골라, 자료에서 찾은 근거로 설명을 고쳐 보아요.",
 "end": "밀기와 당기기, 수평대와 저울, 지레와 빗면에서 알게 된 점을 정리해 보아요."
},
 "forceInteraction": {
  "predict": {
   "q": "겉모습이 같은 두 물체를 받침점에서 같은 거리에 놓으면 반드시 수평이 될까요?",
   "options": [
    "겉모습이 같으니 반드시 수평이 된다",
    "무게가 다를 수 있어 직접 비교해야 한다",
    "관찰 전에는 아직 모르겠다"
   ],
   "answer": 1,
   "result": "겉모습만으로 무게를 정하지 않아요. 빈 수평대를 맞추고 같은 거리에서 비교해요."
  }
 },
 "title": "힘과 우리 생활",
 "startDescriptions": [
  "현상과 예상에서 수평 모형 비교로 이어져요.",
  "관찰 자료로 설명하고 저울·생활 도구에 적용해요.",
  "기록 양식 작성 없이 근거를 비교하고 토의해요."
 ],
 "fieldworkReadSay": "자료에서 조건과 결과를 살펴 생각해요.",
 "fieldworkSay": "관찰 전 예상부터 고르고 비교해요."
};
export const plan = {
 "minutes": 80,
 "note": "현상·예상·수평 모형·자료 해석·생활 적용의 수업 예시. 실제 수행 기록은 선택 교재로 이어 간다.",
 "phases": [
  {
   "id": "open",
   "name": "현상·예상",
   "min": 10,
   "aim": "겉모습만으로 무게를 정할 수 있는지 예상한다."
  },
  {
   "id": "design",
   "name": "비교 조건",
   "min": 10,
   "aim": "같은 거리의 무게 비교와 수평 찾기를 구별한다."
  },
  {
   "id": "lab",
   "name": "모형 실험",
   "min": 20,
   "aim": "예상 뒤 관찰하고 조건을 바꾸어 비교한다."
  },
  {
   "id": "result",
   "name": "자료 해석",
   "min": 15,
   "aim": "관찰 결과와 예상을 근거로 설명한다."
  },
  {
   "id": "concept",
   "name": "개념 연결",
   "min": 10,
   "aim": "밀기·당기기·저울·도구를 연결한다."
  },
  {
   "id": "extend",
   "name": "새 상황 적용",
   "min": 10,
   "aim": "거리 조건과 반례로 주장을 고친다."
  },
  {
   "id": "check",
   "name": "확인",
   "min": 5,
   "aim": "자료와 개념을 연결한 문제를 확인한다."
  }
 ],
 "say": {
  "lab": "관찰 전에는 예상을 고르고 결과를 감춥니다. 같은 거리와 다른 거리의 결과를 구별합니다."
 }
};
// 같은 정답 계약을 유지하고 보기·근거 설명을 보완한 수업 확인 문항.
export const checks = [
 {
  "id": "s31-u01-v004",
  "status": "authored",
  "sourceRef": {
   "type": "similar",
   "of": {
    "set": 1,
    "no": 4
   }
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 1,
   "unit": "u01",
   "area": "운동과 에너지",
   "element": "E2",
   "type": "T04",
   "format": "단답형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "바퀴와 크기가 같은 수레를 같은 바닥에서 천천히 끌어 출발시키려 해요. (가)에는 빈 바구니만, (나)에는 그 바구니와 모래주머니를 실었어요. 드는 힘을 바르게 비교한 기호를 쓰세요.",
  "givens": {
   "보기": [
    "ㄱ. (가)가 더 크다.",
    "ㄴ. 두 힘이 같다.",
    "ㄷ. (나)가 더 크다."
   ]
  },
  "choices": null,
  "visualModel": null,
  "variantRules": null,
  "responseContract": "short-text",
  "answerContract": {
   "type": "short-text",
   "answer": "ㄷ",
   "accepted": [
    "ㄷ",
    "(나)가 더 크다",
    "(나)가 더 커요",
    "(가) < (나)"
   ]
  },
  "explanation": "수레의 바퀴·크기와 바닥, 천천히 출발시키는 방법을 맞추고 실은 짐만 비교해요. 나는 같은 바구니에 모래주머니까지 더 실었으므로 더 무거워요. 이 조건에서 출발에 더 큰 힘이 들 것으로 보는 설명은 ㄷ이에요.",
  "evidence": {
   "checkedBy": "문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ]
  }
 },
 {
  "id": "s31-u01-v010",
  "status": "authored",
  "sourceRef": {
   "type": "similar",
   "of": {
    "set": 1,
    "no": 10
   }
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 1,
   "unit": "u01",
   "area": "운동과 에너지",
   "element": "E3",
   "type": "T08",
   "format": "단답형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "빈 나무판자의 수평을 먼저 맞춘 뒤, 받침점 양쪽 같은 거리에 풀과 가위를 올렸어요. 양쪽의 높이가 같게 멈췄다면 어떤 결론이 맞을까요? 기호를 쓰세요.",
  "givens": {
   "보기": [
    "ㄱ. 풀이 더 무겁다.",
    "ㄴ. 두 물체의 무게가 같다.",
    "ㄷ. 가위가 더 무겁다."
   ]
  },
  "choices": null,
  "visualModel": null,
  "variantRules": null,
  "responseContract": "short-text",
  "answerContract": {
   "type": "short-text",
   "answer": "ㄴ",
   "accepted": [
    "ㄴ",
    "풀과 가위의 무게가 같다",
    "풀과 가위의 무게가 같다."
   ]
  },
  "explanation": "빈 판자의 수평을 맞추고 받침점 양쪽 같은 거리에 풀과 가위를 올렸어요. 이 조건에서 양쪽 높이가 같게 멈췄으므로 두 물체의 무게가 같다는 ㄴ이에요. 처음부터 위치가 다른 수평 결과와 구별해 읽어요.",
  "evidence": {
   "checkedBy": "문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ]
  }
 },
 {
  "id": "s31-u01-v013",
  "status": "authored",
  "sourceRef": {
   "type": "similar",
   "of": {
    "set": 1,
    "no": 13
   }
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 1,
   "unit": "u01",
   "area": "운동과 에너지",
   "element": "E4",
   "type": "T09",
   "format": "선택형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "전자저울로 잰 무게 기록에 붙일 수 있는 단위를 두 가지 고르세요.",
  "givens": null,
  "choices": [
   "cm",
   "kg",
   "L",
   "g",
   "km"
  ],
  "visualModel": null,
  "variantRules": null,
  "responseContract": "multi-choice",
  "answerContract": {
   "type": "multi-choice",
   "answers": [
    1,
    3
   ]
  },
  "explanation": "이 단원에서 무게를 나타내는 단위는 kg과 g이므로 두 가지를 함께 골라요. cm·km는 길이, L는 부피를 나타내요. 숫자가 있더라도 다른 종류의 단위를 무게 기록에 붙이지 않아요.",
  "evidence": {
   "checkedBy": "문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ]
  }
 },
 {
  "id": "s31-u01-v001",
  "status": "authored",
  "sourceRef": {
   "type": "similar",
   "of": {
    "set": 1,
    "no": 1
   }
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 1,
   "unit": "u01",
   "area": "운동과 에너지",
   "element": "E1",
   "type": "T01",
   "format": "선택형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "멈춰 있던 공이 손으로 밀자 굴러갔어요. 찰흙도 손으로 누르자 납작해졌어요. 두 관찰에서 물체의 움직임이나 모양을 바꾼 것은 무엇인가요?",
  "givens": null,
  "choices": [
   "물체의 원래 모양",
   "물체의 원래 무게",
   "손을 대기 전의 상태",
   "손을 뗀 뒤의 위치",
   "손으로 준 힘"
  ],
  "visualModel": null,
  "variantRules": null,
  "responseContract": "single-choice",
  "answerContract": {
   "type": "single-choice",
   "answer": 4,
   "accepted": [
    4
   ]
  },
  "explanation": "공은 손으로 민 뒤 굴러가기 시작했고 찰흙은 손으로 누른 뒤 납작해졌어요. 두 상황 모두 손으로 힘을 준 작용과 변화가 연결돼요. 따라서 손으로 준 힘을 골라요. 원래의 모양·무게나 힘을 주기 전 상태가 변화의 원인이라는 기록은 없어요.",
  "evidence": {
   "checkedBy": "문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ]
  }
 },
 {
  "id": "s31-u01-v007",
  "status": "authored",
  "sourceRef": {
   "type": "similar",
   "of": {
    "set": 1,
    "no": 7
   }
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 1,
   "unit": "u01",
   "area": "운동과 에너지",
   "element": "E3",
   "type": "T06",
   "format": "선택형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "수평이던 나무판자 오른쪽 3번에 블록을 올렸어요. 같은 블록으로 수평을 회복한 실험 기록을 고르세요. 빈 나무판자는 수평이며, 받침점 양쪽 눈금 간격은 같아요.",
  "givens": null,
  "choices": [
   "왼쪽 1번에 올림",
   "왼쪽 2번에 올림",
   "왼쪽 3번에 올림",
   "왼쪽 4번에 올림",
   "왼쪽 5번에 올림"
  ],
  "visualModel": null,
  "variantRules": null,
  "responseContract": "single-choice",
  "answerContract": {
   "type": "single-choice",
   "answer": 2,
   "accepted": [
    2
   ]
  },
  "explanation": "빈 판자가 수평이고 양쪽 눈금 간격도 같아요. 오른쪽3번에 놓은 것과 같은 블록으로 비교하므로 왼쪽도3번으로 거리를 맞춘 기록을 골라요. 다른 번호는 같은 무게라도 놓은 거리까지 달라지는 조건이에요.",
  "evidence": {
   "checkedBy": "문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ]
  }
 },
 {
  "id": "s31-u01-v009",
  "status": "authored",
  "sourceRef": {
   "type": "similar",
   "of": {
    "set": 1,
    "no": 9
   }
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 1,
   "unit": "u01",
   "area": "운동과 에너지",
   "element": "E3",
   "type": "T07",
   "format": "서술형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "형과 동생이 시소의 받침점에서 같은 거리에 앉았더니 형 쪽이 내려갔어요. 다음 번에 수평을 잡기 위해 앉는 위치를 어떻게 바꾸면 좋을까요?",
  "givens": null,
  "choices": null,
  "visualModel": null,
  "variantRules": null,
  "responseContract": "written-explanation",
  "answerContract": {
   "type": "written-explanation",
   "sample": "형이 받침점에 더 가까이 앉거나 동생이 받침점에서 더 멀리 앉아요.",
   "rubric": {
    "required": [
     "형이 가까이 또는 동생이 멀리 앉는다"
    ],
    "pass": "채점 기준을 모두 담으면 정답"
   }
  },
  "explanation": "처음에는 두 사람이 같은 거리에 앉았는데 형 쪽이 내려갔으므로 형이 더 무겁다는 근거가 있어요. 형을 더 가까이 또는 동생을 더 멀리 옮기는 방법을 설명해요. 어느 한 번의 이동만으로 꼭 수평이 된다고 정하지 않고 실제 높이를 살피며 위치를 조절해요.",
  "evidence": {
   "checkedBy": "문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ]
  }
 },
 {
  "id": "s31-u01-v011",
  "status": "authored",
  "sourceRef": {
   "type": "similar",
   "of": {
    "set": 1,
    "no": 11
   }
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 1,
   "unit": "u01",
   "area": "운동과 에너지",
   "element": "E4",
   "type": "T09",
   "format": "선택형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "과일 가게에서 사과 한 봉지의 무게를 정확하게 재려고 해요. 이때 쓰는 도구로 알맞은 것을 고르세요.",
  "givens": null,
  "choices": [
   "저울",
   "줄자",
   "온도계",
   "돋보기",
   "눈금실린더"
  ],
  "visualModel": null,
  "variantRules": null,
  "responseContract": "single-choice",
  "answerContract": {
   "type": "single-choice",
   "answer": 0,
   "accepted": [
    0
   ]
  },
  "explanation": "알고 싶은 양은 사과 봉지의 무게이므로 저울을 골라요. 줄자는 길이, 온도계는 온도를 읽는 도구이며 돋보기는 모습을 확대해요. 목표가 무게인지 다른 양인지 먼저 정하고 알맞은 도구를 연결해요.",
  "evidence": {
   "checkedBy": "문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ]
  }
 },
 {
  "id": "s31-u01-v015",
  "status": "authored",
  "sourceRef": {
   "type": "similar",
   "of": {
    "set": 1,
    "no": 15
   }
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 1,
   "unit": "u01",
   "area": "운동과 에너지",
   "element": "E4",
   "type": "T10",
   "format": "단답형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "세 친구가 용수철저울을 사용한 기록이에요. 다시 측정해야 하는 친구의 이름을 쓰세요.",
  "givens": {
   "관찰 기록": [
    "민호: 빈 고리일 때 0인지 확인하고 물체를 걸었다.",
    "서연: 표시 자가 아직 흔들릴 때 바로 눈금을 적었다.",
    "지우: 표시 자가 멈춘 뒤 눈높이를 맞춰 읽었다."
   ]
  },
  "choices": null,
  "visualModel": null,
  "variantRules": null,
  "responseContract": "short-text",
  "answerContract": {
   "type": "short-text",
   "answer": "서연",
   "accepted": [
    "서연"
   ]
  },
  "explanation": "서연은 표시 자가 아직 흔들리는데 눈금을 적었으므로 다시 측정해야 해요. 민호는 빈 고리의0을 확인했고 지우는 멈춘 뒤 눈높이를 맞춘 기록이에요. 표시 자가 안정된 뒤 값을 읽는 조건을 근거로 서연을 골라요.",
  "evidence": {
   "checkedBy": "문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ]
  }
 },
 {
  "id": "s31-u01-v017",
  "status": "authored",
  "sourceRef": {
   "type": "similar",
   "of": {
    "set": 1,
    "no": 17
   }
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 1,
   "unit": "u01",
   "area": "운동과 에너지",
   "element": "E5",
   "type": "T12",
   "format": "단답형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "같은 물통을 들어 올리는 두 실험의 관찰 기록이에요. 용수철이 더 조금 늘어난 기록의 기호를 쓰세요.",
  "givens": {
   "보기": [
    "ㄱ. 물통을 직접 들 때: 손에 더 큰 힘이 들고 용수철이 많이 늘어났다.",
    "ㄴ. 지레로 들 때: 손에 더 작은 힘이 들고 용수철이 조금 늘어났다."
   ]
  },
  "choices": null,
  "visualModel": null,
  "variantRules": null,
  "responseContract": "short-text",
  "answerContract": {
   "type": "short-text",
   "answer": "ㄴ",
   "accepted": [
    "ㄴ"
   ]
  },
  "explanation": "직접 들 때의 ㄱ은 용수철이 많이 늘어났고, 지레로 들 때의 ㄴ은 조금 늘어났다고 제시했어요. 묻는 것은 더 조금 늘어난 기록의 기호이므로 ㄴ이에요. 자료에 있는 관찰을 읽는 것이며 이 문항만으로 실제 늘어난 길이까지 계산하지 않아요.",
  "evidence": {
   "checkedBy": "문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ]
  }
 },
 {
  "id": "s31-u01-v018",
  "status": "authored",
  "sourceRef": {
   "type": "similar",
   "of": {
    "set": 1,
    "no": 18
   }
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 1,
   "unit": "u01",
   "area": "운동과 에너지",
   "element": "E5",
   "type": "T13",
   "format": "단답형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "무거운 짐을 실은 수레를 계단 대신 비스듬하게 놓인 판자를 따라 밀어 올렸어요. 이처럼 비스듬하게 기울어진 면을 이용해 물체를 움직일 수 있게 만든 도구를 무엇이라고 하는지 쓰세요.",
  "givens": null,
  "choices": null,
  "visualModel": null,
  "variantRules": null,
  "responseContract": "short-text",
  "answerContract": {
   "type": "short-text",
   "answer": "빗면",
   "accepted": [
    "빗면",
    "빗 면"
   ]
  },
  "explanation": "계단을 쓰는 대신 비스듬히 놓인 판자 면을 따라 수레를 올리는 상황이므로 도구 이름은 빗면이에요. 비스듬한 이동 면과 막대로 힘을 돕는 지레를 구별해요. 힘이 얼마나 달라지는지는 같은 물체·높이 등 비교 조건과 실제 관찰로 확인해요.",
  "evidence": {
   "checkedBy": "문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ]
  }
 },
 {
  "id": "s31-u01-v020",
  "status": "authored",
  "sourceRef": {
   "type": "similar",
   "of": {
    "set": 1,
    "no": 20
   }
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 1,
   "unit": "u01",
   "area": "운동과 에너지",
   "element": "E5",
   "type": "T12",
   "format": "선택형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "같은 조건의 병뚜껑을 손으로 열 때보다 병따개로 열 때 힘이 덜 들었어요. 이 관찰과 맞지 않는 설명은 무엇인가요?",
  "givens": null,
  "choices": [
   "병따개는 지레를 이용한 도구이다.",
   "도구를 쓰니 손에 드는 힘이 줄었다.",
   "도구를 쓰니 더 큰 힘이 필요했다.",
   "작은 힘으로 뚜껑을 열 수 있었다.",
   "손으로만 열 때 더 큰 힘이 들었다."
  ],
  "visualModel": null,
  "variantRules": null,
  "responseContract": "single-choice",
  "answerContract": {
   "type": "single-choice",
   "answer": 2,
   "accepted": [
    2
   ]
  },
  "explanation": "제시한 관찰에서는 같은 조건의 병뚜껑을 열 때 병따개를 쓰니 손에 드는 힘이 덜 들었어요. 따라서 더 큰 힘이 필요했다는 셋째 설명이 관찰과 맞지 않아요. 이 관찰의 힘 차이를 읽으며 도구가 무게를 재었다는 뜻으로 바꾸지 않아요.",
  "evidence": {
   "checkedBy": "문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ]
  }
 }
];
