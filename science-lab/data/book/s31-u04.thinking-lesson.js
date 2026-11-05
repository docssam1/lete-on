// 조건과 가상 자료를 비교하는 수업. 실제 관찰 기록은 원래 교재에 보존한다.
export const chapter = {
 "lifeThinking": true,
 "lifeInteraction": {
  "predict": {
   "q": "물을 준 씨앗은 따뜻한 곳, 물을 주지 않은 씨앗은 차가운 곳에 두었어요. 결과 차이를 물 때문이라고만 설명할 수 있을까요?",
   "options": [
    "물 때문에만 달라졌다고 설명할 수 있다",
    "물과 온도가 함께 달라 물의 영향만 구별하기 어렵다",
    "어떤 조건이 달랐는지 더 확인하겠다"
   ],
   "answer": 1,
   "result": "물의 영향만 비교하려면 온도를 같게 하고 물 조건 하나만 다르게 해야 해요."
  }
 },
 "labRecordTitle": "내 조건과 가상 자료 비교",
 "slideCues": {
  "cover": "한 장면과 여러 날 관찰을 구별하고, 조건 비교 자료로 설명해 봐요.",
  "phenomenon": "수업용 가상 자료예요. 가와 나에서 물과 온도가 어떻게 다른지 함께 찾아요.",
  "design": "물의 영향만 보려면 온도를 같게 해요. 온도의 영향만 보려면 물 조건을 같게 해요.",
  "lab": "싹트기와 자람의 조건을 골라 계획을 바꾸어 보아요. 실제 생물의 관찰 결과를 만든 것은 아니에요.",
  "observations": "세어 확인한 영 개와 확인하지 못한 미관찰은 다른 뜻이에요.",
  "animal-stages": "사진에서 보이는 단계와 촬영 날짜나 같은 개체인지의 확인은 구별해요.",
  "insects": "번데기를 거치는지로 두 곤충의 한살이를 비교해요.",
  "plant-cycle": "새 씨앗은 다음 개체로 이어져요. 같은 자리에 났다고 같은 개체는 아니에요.",
  "growth-light": "줄기 길이만 보지 말고 잎의 색과 줄기의 굵기도 함께 비교해요.",
  "care-design": "어느 단계의 동물을 돌볼지 정하고 먹이와 통풍, 두는 장소의 까닭을 설명해요.",
  "share": "내가 직접 본 기록과 참고 자료를 구별해 소개하고 실제로 들은 질문을 나누어요.",
  "results": "알아볼 조건과 같게 둔 조건을 먼저 확인하고, 결과로 설명할 수 있는 범위를 찾아요.",
  "conclusion": "물과 온도가 함께 달라졌다면 어느 조건의 영향인지 구별하기 어려워요. 처음 예상과 비교해요.",
  "end": "가상 자료에서 조건과 근거를 설명했나요? 실제 생물의 관찰과 돌봄은 여러 날 따로 이어 가요."
 },
 "title": "조건과 자료로 설명하는 생물의 한살이",
 "startDescriptions": [
  "조건을 먼저 판단하고 가상 자료와 비교해요.",
  "동물·식물의 단계와 다음 세대를 근거로 설명해요.",
  "내 관찰과 참고 자료를 구별해 소개·질문을 나누어요."
 ],
 "check": [
  "1-1",
  "1-7",
  "2-1",
  "2-3",
  "2-17",
  "3-3",
  "3-2",
  "3-6"
 ],
 "webBookDescription": "한살이 자료·문제를 읽고 실험 조건과 가상 자료를 비교해요."
};
export const plan = {
 "minutes": 80,
 "note": "가상 자료의 조건 비교와 한살이 소개 수업 예시. 실제 관찰·돌봄·실험은 여러 날 이어 가며 선택 기록에서 보존한다.",
 "phases": [
  {
   "id": "open",
   "name": "현상·예상",
   "min": 10,
   "aim": "결과 차이와 원인 설명을 구별한다."
  },
  {
   "id": "observe",
   "name": "조건과 자료 비교",
   "min": 20,
   "aim": "알아볼 조건 하나와 같게 할 조건을 연결한다."
  },
  {
   "id": "result",
   "name": "근거로 설명",
   "min": 10,
   "aim": "계획과 결과 자료의 해석 범위를 설명한다."
  },
  {
   "id": "concept",
   "name": "한살이와 관찰",
   "min": 20,
   "aim": "관찰/미관찰·단계·다음 세대·여러 자람 지표를 비교한다."
  },
  {
   "id": "extend",
   "name": "돌봄·소개·질문",
   "min": 15,
   "aim": "기록과 참고 자료를 나누어 소개하고 질문을 듣는다."
  },
  {
   "id": "check",
   "name": "확인",
   "min": 5,
   "aim": "자료 문제 이해와 실제 수행을 구별한다."
  }
 ],
 "say": {
  "lab": "한 번의 클릭으로 생물의 한살이가 끝난 것이 아닙니다. 수업용 가상 자료와 실제 관찰 기록을 구별합니다."
 }
};
export const checks = [
 {
  "id": "s31-u04-v012",
  "status": "authored",
  "sourceRef": {
   "type": "similar",
   "of": {
    "set": 2,
    "no": 4
   }
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 1,
   "unit": "u04",
   "area": "생명",
   "element": "E2",
   "type": "T04",
   "format": "선택형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "애벌레였을 때와 비교하여 성충이 된 배추흰나비에서 새로 뚜렷하게 관찰할 수 있는 모습은 무엇인가요?",
  "givens": null,
  "choices": [
   "배춧잎 위를 기어 다니며 잎을 갉아 먹는다.",
   "번데기 속에서 배춧잎을 계속 갉아 먹는다.",
   "알 속에서 날개를 펴고 꽃 사이를 날아다닌다.",
   "먹이를 먹으며 애벌레의 허물을 계속 벗는다.",
   "날개를 펼치고 꽃 사이를 날아다닌다."
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
  "explanation": "성충은 두 쌍의 날개를 펴서 날 수 있고, 긴 대롱 모양의 입으로 꽃의 꿀을 먹어요.",
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
  "id": "s31-u04-v035",
  "status": "authored",
  "sourceRef": {
   "type": "similar",
   "of": {
    "set": 4,
    "no": 2
   }
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 1,
   "unit": "u04",
   "area": "생명",
   "element": "E3",
   "type": "T06",
   "format": "서술형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "씨앗에서 싹이 잘 튼 접시의 기호를 쓰고, 다른 접시와 비교하여 싹트는 데 필요한 조건 두 가지를 쓰세요.",
  "givens": {
   "표(모형 값)": {
    "머리": [
     "접시",
     "솜의 상태",
     "두는 곳",
     "싹이 튼 씨앗 수"
    ],
    "행": [
     [
      "㉠",
      "마른 솜",
      "실내",
      "0개"
     ],
     [
      "㉡",
      "물에 적신 솜",
      "차가운 냉장고",
      "0개"
     ],
     [
      "㉢",
      "물에 적신 솜",
      "실내",
      "8개"
     ]
    ]
   },
   "같게 한 조건": "같은 종류와 상태의 씨앗을 접시마다 10개씩 두고 같은 기간 관찰했다."
  },
  "choices": null,
  "visualModel": null,
  "variantRules": null,
  "responseContract": "written-explanation",
  "answerContract": {
   "type": "written-explanation",
   "sample": "㉢, 알맞은 물과 온도가 필요하다.",
   "rubric": {
    "required": [
     "싹이 잘 튼 접시 ㉢을 고름",
     "싹트는 데 필요한 물과 알맞은 온도 두 조건을 설명함"
    ],
    "pass": "채점 기준을 모두 담으면 정답"
   }
  },
  "explanation": "물과 온도가 알맞은 ㉢에서 잘 싹텄어요. 물이 없거나 온도가 너무 낮으면 잘 싹트지 않아요. 실제 측정 수가 아닌 모형 값이에요.",
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
  "id": "s31-u04-b07",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement"
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 1,
   "unit": "u04",
   "area": "생명",
   "element": "E4",
   "type": "T08",
   "format": "선택형",
   "concept": "식물의 한살이와 관찰 자료",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "식물의 한살이 유형을 비교한 설명으로 알맞은 두 개를 고르세요. (정답 2개)",
  "givens": null,
  "choices": [
   "여러해살이 식물은 겨울에도 모든 잎이 꼭 남아 있다.",
   "한해살이 식물은 한 해 안에 한살이를 마친다.",
   "한해살이가 남긴 씨앗에서 난 새 식물은 같은 개체이다.",
   "줄기가 연한 풀은 모두 한해살이로 분류한다.",
   "여러해살이는 같은 개체가 여러 해 살아갈 수 있다."
  ],
  "responseContract": "multi-choice",
  "answerContract": {
   "type": "multi-choice",
   "answers": [
    1,
    4
   ]
  },
  "explanation": "한해살이는 한 해 안에 한살이를 마치고, 여러해살이는 같은 개체가 여러 해 살아가요. 같은 자리의 새 싹이 모두 같은 개체인 것은 아니에요.",
  "evidence": {
   "checkedBy": "문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ],
   "note": "교육부 4과04-03 범위. 비상교육 공개 식물의 한살이 요점 PDF 8쪽의 개념만 참고하고 문장·그림·문항은 옮기지 않음."
  }
 },
 {
  "id": "s31-u04-v001",
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
   "unit": "u04",
   "area": "생명",
   "element": "E1",
   "type": "T01",
   "format": "선택형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "같은 개의 자라는 모습을 기록한 카드입니다. 기록을 시간 순서대로 정리한 것은 무엇인가요?",
  "givens": {
   "기록": [
    "가: 눈을 감고 어미의 젖을 먹었다.",
    "나: 몸이 커지고 마당을 달리며 먹이를 먹었다.",
    "다: 눈을 뜨고 다리에 힘이 생겨 걷기 시작했다."
   ]
  },
  "choices": [
   "가 → 나 → 다",
   "나 → 가 → 다",
   "가 → 다 → 나",
   "나 → 다 → 가",
   "다 → 가 → 나"
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
  "explanation": "눈을 뜨지 못하고 젖을 먹던 강아지는 자라면서 눈을 뜨고 걷거나 뛰며 먹이를 찾아 먹어요.",
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
  "id": "s31-u04-v007",
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
   "unit": "u04",
   "area": "생명",
   "element": "E1",
   "type": "T02",
   "format": "선택형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "학급에서 한 학기 동안 직접 관찰할 동물을 정하려고 합니다. 고르기 전에 확인할 내용으로 알맞은 것은 무엇인가요?",
  "givens": null,
  "choices": [
   "관찰이 끝난 동물을 어디에 팔지 알아본다.",
   "돌볼 방법과 관찰할 수 있는 기간을 먼저 살핀다.",
   "가장 몸집이 큰 동물부터 관찰 대상으로 고른다.",
   "먹이를 주지 않아도 되는 동물인지 먼저 살핀다.",
   "교실이 좁더라도 한살이가 가장 긴 동물을 고른다."
  ],
  "visualModel": null,
  "variantRules": null,
  "responseContract": "single-choice",
  "answerContract": {
   "type": "single-choice",
   "answer": 1,
   "accepted": [
    1
   ]
  },
  "explanation": "먹이·기르는 장소와 방법·한살이 기간을 살펴야 관찰할 동물을 돌보며 계획을 세울 수 있어요.",
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
  "id": "s31-u04-v009",
  "status": "authored",
  "sourceRef": {
   "type": "similar",
   "of": {
    "set": 2,
    "no": 1
   }
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 1,
   "unit": "u04",
   "area": "생명",
   "element": "E2",
   "type": "T03",
   "format": "선택형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "배추흰나비 애벌레가 움직이지 않자 친구들이 다음 행동을 제안했습니다. 고쳐야 할 행동을 고르세요.",
  "givens": null,
  "choices": [
   "허물벗기를 방해하지 않도록 조용히 지켜본다.",
   "먹이의 상태와 사육 상자의 환경을 확인한다.",
   "몸의 변화를 날짜와 함께 일지에 남긴다.",
   "상자를 흔들어서 애벌레가 움직이게 만든다.",
   "애벌레를 손으로 누르지 않고 멀리서 살핀다."
  ],
  "visualModel": null,
  "variantRules": null,
  "responseContract": "single-choice",
  "answerContract": {
   "type": "single-choice",
   "answer": 3,
   "accepted": [
    3
   ]
  },
  "explanation": "허물을 벗거나 번데기가 될 준비를 할 때에는 먹이를 먹지 않고 움직임이 줄 수 있어요. 흔들거나 허물을 억지로 벗기지 않고 조용히 관찰해요.",
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
  "id": "s31-u04-v011",
  "status": "authored",
  "sourceRef": {
   "type": "similar",
   "of": {
    "set": 2,
    "no": 3
   }
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 1,
   "unit": "u04",
   "area": "생명",
   "element": "E2",
   "type": "T04",
   "format": "선택형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "모두 같은 배추흰나비를 관찰한 카드입니다. 번데기에 해당하는 카드를 고르세요.",
  "givens": null,
  "choices": [
   "잎의 표면에 붙어 있고 아직 애벌레가 나오지 않았다.",
   "배춧잎을 갉아 먹으며 잎 위를 기어 다녔다.",
   "한곳에 붙어 먹지 않았고 뒤에 나비가 나왔다.",
   "허물을 벗은 뒤 몸이 커지고 다시 잎을 먹었다.",
   "날개를 편 뒤 꽃 사이를 날아다니기 시작했다."
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
  "explanation": "번데기는 먹이를 먹거나 먹이를 찾아 돌아다니지 않으며 그 안에서 성충으로 변해요. 완전히 움직일 수 없다는 뜻은 아니에요.",
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
  "id": "s31-u04-v025",
  "status": "authored",
  "sourceRef": {
   "type": "similar",
   "of": {
    "set": 2,
    "no": 17
   }
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 1,
   "unit": "u04",
   "area": "생명",
   "element": "E2",
   "type": "T05",
   "format": "서술형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "‘알→애벌레→번데기→성충’과 ‘알→애벌레→성충’을 두 무리로 나누었습니다. 나누는 기준을 설명하세요.",
  "givens": null,
  "choices": null,
  "visualModel": null,
  "variantRules": null,
  "responseContract": "written-explanation",
  "answerContract": {
   "type": "written-explanation",
   "sample": "번데기 단계를 거치는지로 나눈다.",
   "rubric": {
    "required": [
     "번데기 단계를 거치는지의 차이를 설명함"
    ],
    "pass": "채점 기준을 모두 담으면 정답"
   }
  },
  "explanation": "두 한살이 과정은 번데기 단계가 있는지 없는지가 달라요.",
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
  "id": "s31-u04-v030",
  "status": "authored",
  "sourceRef": {
   "type": "similar",
   "of": {
    "set": 3,
    "no": 3
   }
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 1,
   "unit": "u04",
   "area": "생명",
   "element": "E3",
   "type": "T06",
   "format": "선택형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "같은 크기의 강낭콩에 주는 물만 다르게 했습니다. 기록을 바르게 해석한 것을 고르세요.",
  "givens": {
   "관찰": [
    "㉠ 알맞게 물을 줌: 잎과 줄기가 싱싱함",
    "㉡ 물을 주지 않음: 잎과 줄기가 축 처짐",
    "그 밖의 조건은 같게 함"
   ]
  },
  "choices": [
   "물을 주지 않아야 강낭콩이 더 싱싱하게 자란다.",
   "강낭콩이 싱싱하게 자라는 데 물이 필요하다.",
   "물은 강낭콩이 자라는 데 아무런 영향을 주지 않는다.",
   "물을 준 강낭콩이 시들고 안 준 강낭콩이 싱싱하다.",
   "물만 주면 햇빛을 비교하는 실험까지 끝난 것이다."
  ],
  "visualModel": null,
  "variantRules": null,
  "responseContract": "single-choice",
  "answerContract": {
   "type": "single-choice",
   "answer": 1,
   "accepted": [
    1
   ]
  },
  "explanation": "다른 조건을 같게 하고 물만 다르게 주었을 때 나타난 차이는 물의 영향을 알아보는 근거가 돼요.",
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
  "id": "s31-u04-v029",
  "status": "authored",
  "sourceRef": {
   "type": "similar",
   "of": {
    "set": 3,
    "no": 2
   }
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 1,
   "unit": "u04",
   "area": "생명",
   "element": "E3",
   "type": "T07",
   "format": "선택형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "물이 자람에 미치는 영향만 알아보려 합니다. 현재 계획에서 바르게 고친 것은 무엇인가요?",
  "givens": {
   "현재 계획": "같은 크기의 강낭콩 두 포기를 같은 화분에 각각 심었다. 하나는 햇빛이 드는 곳, 하나는 그늘에 두고 물의 양도 다르게 하려 한다."
  },
  "choices": [
   "햇빛이 다른 곳에 둔 채 두 화분에 같은 양의 물을 준다.",
   "화분 크기를 다르게 하고 주는 물의 양도 다르게 한다.",
   "두 식물의 종류를 바꾸고 물을 주는 양도 다르게 한다.",
   "두 화분은 같은 곳에 두고 물을 주는 양만 다르게 한다.",
   "물을 준 화분은 밝은 곳에, 안 준 화분은 어두운 곳에 둔다."
  ],
  "visualModel": null,
  "variantRules": null,
  "responseContract": "single-choice",
  "answerContract": {
   "type": "single-choice",
   "answer": 3,
   "accepted": [
    3
   ]
  },
  "explanation": "물의 영향을 알아보려면 주는 물만 다르게 하고 햇빛과 식물·화분 등의 조건은 같게 해요.",
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
  "id": "s31-u04-v033",
  "status": "authored",
  "sourceRef": {
   "type": "similar",
   "of": {
    "set": 3,
    "no": 6
   }
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 1,
   "unit": "u04",
   "area": "생명",
   "element": "E4",
   "type": "T08",
   "format": "선택형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "강낭콩을 씨앗부터 관찰한 결과에 맞는 설명 두 개를 고르세요. (정답 2개)",
  "givens": {
   "관찰 순서": "강낭콩 씨앗 → 싹 → 잎과 줄기 → 꽃 → 꼬투리 속의 새 강낭콩 씨앗"
  },
  "choices": [
   "마지막 씨앗은 한살이가 이어지는 것과 관계없다.",
   "새 씨앗에서 다음 강낭콩이 자라 대를 이을 수 있다.",
   "꽃과 열매를 만드는 순서는 모든 생물에게 똑같다.",
   "새 씨앗은 처음 심은 강낭콩 씨앗과 생김새가 비슷하다.",
   "같은 종류의 강낭콩을 키워도 다음에는 다른 식물이 된다."
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
  "explanation": "처음 씨앗에서 자란 강낭콩이 새 씨앗을 만들고, 그 씨앗에서 다음 강낭콩이 자라며 대를 이어 가요.",
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
export const lab = {
 "kind": "life-compare",
 "rowsKey": "lifeCompareRows",
 "goal": "싹트기와 자람의 네 조건을 골라 계획·가상 자료를 비교하고 판단 근거를 설명해요.",
 "columns": [
  "알아볼 조건",
  "계획과 내 판단",
  "자료와 판단 근거"
 ]
};
