// 검수한 사진 분류·환경·설계 수업 원고. 원래 실제 관찰 기록은 보존한다.
export const chapter = {
 "animalThinking": true,
 "animalInteraction": {
  "predict": {
   "q": "같은 네 동물을 ‘날개가 있는가?’와 ‘몸이 깃털로 덮였는가?’로 나누면 모둠이 같을까요?",
   "options": [
    "동물이 같으니 모둠도 언제나 같다",
    "기준이 달라지면 모둠도 달라질 수 있다",
    "사진을 더 살핀 뒤 판단하겠다"
   ],
   "answer": 1,
   "result": "같은 동물도 무엇을 기준으로 보는지에 따라 모둠이 달라질 수 있어요. 두 기준의 근거를 비교해요."
  }
 },
 "labRecordTitle": "내 사진 분류 비교",
 "slideCues": {
  "cover": "네 동물의 사진에서 생김새를 살피고 기준을 바꾸어 비교해 봐요.",
  "photos": "날개와 몸을 덮은 것을 비교해요. 안 보이는 부분은 없다고 단정하지 않아요.",
  "design": "동물과 자료는 그대로 두고 날개와 깃털의 두 기준을 비교해요.",
  "habitat": "동물마다 환경과 몸의 부분, 생활 자료를 연결해 설명해요.",
  "design-function": "동물의 어느 특징이 물건의 어떤 기능을 도울지 생각해요.",
  "share": "친구에게 특징과 기능을 설명하고 질문을 들어 설계를 다듬어 봐요.",
  "predict": "날개와 깃털의 두 기준에서 모둠이 같을지 먼저 예상해요.",
  "lab": "네 동물을 먼저 나누고 설명 자료와 비교해요. 날개와 깃털의 두 기준을 모두 살펴요.",
  "results": "기준이 바뀌어 모둠이 달라진 동물을 찾고 생김새 근거를 설명해요.",
  "conclusion": "처음 예상과 두 기준의 비교 결과를 연결해 설명해요.",
  "end": "분류 기준과 근거, 동물의 생활과 설계의 기능을 연결했는지 살펴보아요."
 },
 "title": "같은 동물, 다른 기준으로 비교해요",
 "startDescriptions": [
  "사진에서 먼저 분류하고 설명 자료와 비교해요.",
  "기준을 바꾸고 모둠이 달라진 근거를 설명해요.",
  "환경·특징·제품 기능을 연결해 설계를 토의해요."
 ],
 "check": [
  "1-1",
  "1-5",
  "1-10",
  "1-11",
  "1-12",
  "1-13",
  "1-19",
  "1-20"
 ],
 "webBookDescription": "사진과 자료·문제를 웹에서 읽고 분류의 근거를 설명해요."
};
export const plan = {
 "minutes": 80,
 "note": "사진 관찰·두 기준 비교·환경 자료·설계 토의의 수업 예시. 실제 수행 기록은 선택 교재로 이어진다.",
 "phases": [
  {
   "id": "open",
   "name": "현상·예상",
   "min": 10,
   "aim": "같은 동물과 다른 기준의 관계를 예상한다."
  },
  {
   "id": "observe",
   "name": "사진 분류 비교",
   "min": 20,
   "aim": "먼저 판단하고 설명 자료와 비교한다."
  },
  {
   "id": "result",
   "name": "결과 설명",
   "min": 10,
   "aim": "바뀐 모둠과 생김새 근거를 연결한다."
  },
  {
   "id": "concept",
   "name": "분류 기준",
   "min": 10,
   "aim": "관찰 가능한 기준과 자료 부족을 구별한다."
  },
  {
   "id": "research",
   "name": "환경과 생활",
   "min": 10,
   "aim": "동물별 자료로 환경·몸·생활을 연결한다."
  },
  {
   "id": "extend",
   "name": "설계·소통",
   "min": 15,
   "aim": "특징·기능·확인 방법을 말과 그림으로 제안한다."
  },
  {
   "id": "check",
   "name": "확인",
   "min": 5,
   "aim": "자료와 근거로 확인 문제를 푼다."
  }
 ],
 "say": {
  "lab": "분류를 먼저 정한 뒤 설명 자료를 엽니다. 더 확인이 필요하다는 판단을 오답으로 처리하지 않습니다."
 }
};
export const checks = [
 {
  "id": "s31-u02-v003",
  "status": "authored",
  "sourceRef": {
   "type": "similar",
   "of": {
    "set": 1,
    "no": 3
   }
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 1,
   "unit": "u02",
   "area": "생명",
   "element": "E1",
   "type": "T02",
   "format": "선택형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "성충 개미·나비·잠자리 관찰 카드에 모두 표시할 수 있는 특징은 무엇입니까?",
  "givens": {
   "지문": "성충 개미 카드 / 성충 나비 카드 / 성충 잠자리 카드\n세 동물의 몸 생김새에서 공통된 특징을 찾는다."
  },
  "choices": [
   "몸이 머리·가슴·배로 나뉜다.",
   "모두 꽃에서 꿀을 빨아 먹는다.",
   "모두 몸이 깃털로 덮여 있다.",
   "모두 다리 없이 기어다닌다.",
   "모두 땅속 굴에서만 생활한다."
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
  "explanation": "성충 개미·나비·잠자리의 몸을 비교하면 머리·가슴·배가 구분돼요. 깃털·먹이·다리 없는 움직임은 세 동물의 공통점이 아니에요. 성충의 모습을 어린 시기까지 같다고 넓히지 않아요.",
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
  "id": "s31-u02-v004",
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
   "unit": "u02",
   "area": "생명",
   "element": "E1",
   "type": "T03",
   "format": "선택형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "서로 다른 모둠이 같은 동물 사진을 분류하려고 합니다. 판단이 달라지기 쉬운 기준은 무엇입니까?",
  "givens": null,
  "choices": [
   "머리에 더듬이가 보이는가?",
   "몸에 다리 세 쌍이 보이는가?",
   "생김새가 귀엽다고 느끼는가?",
   "몸에 지느러미가 보이는가?",
   "몸이 깃털로 덮여 있는가?"
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
  "explanation": "귀엽다는 느낌은 같은 사진을 보아도 사람마다 달라질 수 있어요. 더듬이·다리·지느러미·깃털처럼 자료에서 확인할 몸의 부분을 묻는 기준과 구별해요.",
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
  "id": "s31-u02-v009",
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
   "unit": "u02",
   "area": "생명",
   "element": "E3",
   "type": "T08",
   "format": "서술형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "붕어 안내판에 물속 생활을 돕는 몸의 부분과 그 쓰임을 한 가지 적으시오.",
  "givens": null,
  "choices": null,
  "visualModel": null,
  "variantRules": null,
  "responseContract": "written-explanation",
  "answerContract": {
   "type": "written-explanation",
   "sample": "지느러미를 움직여 물속을 헤엄친다.",
   "rubric": {
    "required": [
     "붕어의 몸 부분과 물속 생활에 도움이 되는 쓰임 한 가지"
    ],
    "pass": "채점 기준을 모두 담으면 정답"
   }
  },
  "explanation": "몸의 부분과 물속 생활에서 하는 일을 한 가지 연결해요. 지느러미→헤엄 또는 아가미→물속 호흡처럼 타당한 설명이면 돼요. 예시의 낱말과 똑같이 쓰거나 두 특징을 모두 쓸 필요는 없어요.",
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
  "id": "s31-u02-v001",
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
   "unit": "u02",
   "area": "생명",
   "element": "E1",
   "type": "T01",
   "format": "선택형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "관찰 카드의 동물을 기록장에 적으려 합니다. 알맞은 이름을 고르시오.",
  "givens": {
   "지문": "관찰 카드: 머리에 더듬이 한 쌍, 다리 세 쌍이 보였다. 몸은 머리·가슴·배로 나뉘었다. 줄지어 이동하는 모습을 보았다."
  },
  "choices": [
   "참새",
   "개미",
   "달팽이",
   "고양이",
   "금붕어"
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
  "explanation": "더듬이 한 쌍·다리 세 쌍·머리/가슴/배라는 관찰을 함께 읽어요. 보기 중 이 특징들을 갖춘 것은 개미예요. 줄지어 움직였다는 한 행동만으로 이름을 정하지 않아요.",
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
  "id": "s31-u02-v005",
  "status": "authored",
  "sourceRef": {
   "type": "similar",
   "of": {
    "set": 1,
    "no": 5
   }
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 1,
   "unit": "u02",
   "area": "생명",
   "element": "E1",
   "type": "T04",
   "format": "선택형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "분류 상자의 이름표가 떨어졌습니다. 붙일 기준을 고르시오.",
  "givens": {
   "지문": "해당함 상자: 개미·달팽이·나비\n해당하지 않음 상자: 고양이·붕어·참새"
  },
  "choices": [
   "모두 알을 낳는가?",
   "몸에 다리가 있는가?",
   "몸에 날개가 있는가?",
   "더듬이가 있는가?",
   "몸이 깃털로 덮였는가?"
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
  "explanation": "개미·달팽이·나비는 더듬이가 있고 다른 상자의 세 동물은 없어요. 달팽이는 다리가 없고 개미는 날개가 없는 일개미도 있으므로 다리·날개 기준으로 이 두 상자를 설명할 수는 없어요.",
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
  "id": "s31-u02-v010",
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
   "unit": "u02",
   "area": "생명",
   "element": "E3",
   "type": "T08",
   "format": "선택형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "헤엄치는 데 지느러미를 쓰는 동물 카드만 남기려고 합니다. 남길 카드는 무엇입니까?",
  "givens": {
   "보기": [
    "㉠ 붕어",
    "㉡ 게",
    "㉢ 메기",
    "㉣ 다슬기"
   ]
  },
  "choices": [
   "㉠, ㉡",
   "㉠, ㉢",
   "㉡, ㉢",
   "㉡, ㉣",
   "㉢, ㉣"
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
  "explanation": "붕어㉠와 메기㉢는 지느러미로 헤엄치는 예예요. 게의 다리나 다슬기의 배발을 지느러미로 부르지 않아요. 물에 산다는 공통점과 움직일 때 쓰는 부분을 따로 살펴요.",
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
  "id": "s31-u02-v011",
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
   "unit": "u02",
   "area": "생명",
   "element": "E3",
   "type": "T07",
   "format": "선택형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "강·호수 전시실로 보낼 카드 / 바다 전시실로 보낼 카드를 바르게 나눈 것을 고르시오.",
  "givens": {
   "보기": [
    "㉠ 메기",
    "㉡ 오징어",
    "㉢ 수달",
    "㉣ 가오리"
   ],
   "전시 카드의 생활 예": "메기·수달: 강이나 호수 주변의 생활을 소개함. 오징어·가오리: 바다의 생활을 소개함. 같은 이름의 모든 종류가 한 환경에서만 산다는 뜻은 아님."
  },
  "choices": [
   "㉠, ㉡ / ㉢, ㉣",
   "㉠, ㉢ / ㉡, ㉣",
   "㉠, ㉣ / ㉡, ㉢",
   "㉡, ㉢ / ㉠, ㉣",
   "㉢, ㉣ / ㉠, ㉡"
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
  "explanation": "이 전시 카드에서는 메기㉠·수달㉢의 강/호수 생활과 오징어㉡·가오리㉣의 바다 생활을 비교해요. 카드의 생활 예를 나누는 것이며 같은 이름으로 부르는 모든 동물이 한 환경에서만 산다는 뜻은 아니에요.",
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
  "id": "s31-u02-v012",
  "status": "authored",
  "sourceRef": {
   "type": "similar",
   "of": {
    "set": 1,
    "no": 12
   }
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 1,
   "unit": "u02",
   "area": "생명",
   "element": "E4",
   "type": "T09",
   "format": "선택형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "성충 잠자리 관찰표에 잘못 적은 내용 하나를 찾아 고르시오.",
  "givens": {
   "지문": "날개·다리·몸을 관찰하여 다음과 같이 기록했다."
  },
  "choices": [
   "머리에 커다란 눈이 있었다.",
   "날개가 두 쌍 있었다.",
   "다리가 세 쌍 있었다.",
   "몸이 깃털로 덮여 있었다.",
   "몸은 머리·가슴·배로 나뉘었다."
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
  "explanation": "성충 잠자리는 두 쌍의 날개와 세 쌍의 다리가 있지만 깃털로 덮여 있지는 않아요. 날개가 있다는 공통점만으로 새의 깃털 특징까지 옮겨 쓰면 안 돼요.",
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
  "id": "s31-u02-v013",
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
   "unit": "u02",
   "area": "생명",
   "element": "E4",
   "type": "T09",
   "format": "서술형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "성충 나비와 성충 잠자리 카드에 함께 붙일 특징을 서로 다르게 두 가지 적으시오.",
  "givens": null,
  "choices": null,
  "visualModel": null,
  "variantRules": null,
  "responseContract": "written-explanation",
  "answerContract": {
   "type": "written-explanation",
   "sample": "날개가 두 쌍 있다. 다리가 세 쌍 있다.",
   "rubric": {
    "required": [
     "나비와 잠자리의 서로 다른 공통 특징 두 가지"
    ],
    "pass": "채점 기준을 모두 담으면 정답"
   }
  },
  "explanation": "성충 나비와 잠자리에게 모두 있는 서로 다른 특징 두 가지를 써요. 날개 두 쌍·다리 세 쌍·더듬이 한 쌍 등의 타당한 공통점을 골라요. 날개 네 개와 날개 두 쌍은 같은 특징이어서 둘로 세지 않아요.",
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
  "id": "s31-u02-v019",
  "status": "authored",
  "sourceRef": {
   "type": "similar",
   "of": {
    "set": 1,
    "no": 19
   }
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 1,
   "unit": "u02",
   "area": "생명",
   "element": "E6",
   "type": "T12",
   "format": "선택형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "물속 바위에 붙는 새 도구를 설계하려고 합니다. 목표와 가장 관련 있는 홍합의 특징을 고르시오.",
  "givens": {
   "지문": "설계 목표: 물속에서도 바위에서 쉽게 떨어지지 않게 붙인다."
  },
  "choices": [
   "날카로운 발톱으로 먹이를 잡는다.",
   "말랑한 발굽으로 바위에서 버틴다.",
   "세찬 파도에도 바위에 붙어 있다.",
   "피부의 비늘 사이로 물이 흐른다.",
   "곡선 모양 몸으로 빨리 헤엄친다."
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
  "explanation": "설계 목표는 물속 바위에서 쉽게 떨어지지 않게 붙이는 것이에요. 홍합이 바위에 붙어 있는 특징을 참고해요. 움켜잡기·미끄럼 줄이기·헤엄치기는 이 목표와 다른 쓰임이며 실제 제품 성능은 따로 확인해야 해요.",
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
  "id": "s31-u02-v020",
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
   "unit": "u02",
   "area": "생명",
   "element": "E6",
   "type": "T12",
   "format": "선택형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "오리 발가락 사이의 막을 본떠 물을 잘 헤치게 하려 합니다. 가장 알맞은 물건을 고르시오.",
  "givens": null,
  "choices": [
   "물갈퀴",
   "흡착판",
   "집게 차",
   "고속열차",
   "등산화 밑창"
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
  "explanation": "오리 발가락 사이 넓은 막에서 물을 미는 면의 힌트를 얻으므로 수영용 물갈퀴가 가장 가까워요. 벽에 붙기·흙 파기·물건 움켜잡기와 기능을 구별하며 닮은 모양만으로 성능을 확정하지 않아요.",
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
 "kind": "animal-compare",
 "rowsKey": "animalCompareRows",
 "goal": "사진을 먼저 분류한 뒤 설명 자료와 비교하고, 기준을 바꾸어 결과의 차이를 설명해요.",
 "columns": [
  "기준",
  "자료 보기 전 내 분류",
  "자료로 확인한 분류"
 ]
};
