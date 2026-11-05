export const inquiry={
 "unit": "c22-s62-u01",
 "title": "계절의 변화 관찰·실험 기록(선택)",
 "theme": "#2f6b4a",
 "activities": [
  {
   "id": "deviceplan",
   "title": "측정기에서 기준이 될 곳을 정해요",
   "phase": "device",
   "standard": "6과13-01",
   "question": "측정기에서 기준이 될 곳을 정해요",
   "intro": "관찰하거나 실험한 내용을 자세히 남기고 싶을 때 선택하여 써요.",
   "steps": [
    "받침판·끝이 둥근 곧은 막대·실·각도기·자를 준비해요.",
    "받침이 수평인지, 막대가 받침과 직각인지 확인할 방법을 정해요.",
    "막대 끝·그림자 끝·실·수평 기준과 읽을 각을 설계 그림에 표시해요."
   ],
   "fields": [
    {
     "key": "date",
     "label": "활동한 날",
     "type": "date",
     "required": true
    },
    {
     "key": "method",
     "label": "어떤 방법으로 알아보았나요?",
     "required": true,
     "options": [
      "직접 측정함",
      "직접 모형실험함",
      "계산 자료를 살펴봄",
      "교사 시범이나 자료를 살펴봄",
      "앞으로 해 볼 계획"
     ]
    },
    {
     "key": "conditions",
     "label": "관찰·실험 조건",
     "required": true
    },
    {
     "key": "content",
     "label": "관찰하거나 알아본 내용",
     "required": true
    },
    {
     "key": "explanation",
     "label": "자료와 연결한 설명",
     "required": true
    },
    {
     "key": "next",
     "label": "더 알아볼 점",
     "required": false
    }
   ],
   "draw": true
  },
  {
   "id": "devicebuild",
   "title": "수직 막대를 고정하고 실을 연결해요",
   "phase": "device",
   "standard": "6과13-01",
   "question": "수직 막대를 고정하고 실을 연결해요",
   "intro": "관찰하거나 실험한 내용을 자세히 남기고 싶을 때 선택하여 써요.",
   "steps": [
    "막대를 안정된 받침에 수직으로 고정해요. 막대와 실이 얼굴에 닿지 않도록 다루어요.",
    "그림자 끝을 표시하고 막대 끝과 실로 팽팽하게 이어요.",
    "각도기의 중심과 0° 기준을 수평에 맞추어요. 태양을 맨눈이나 렌즈로 직접 보지 않아요."
   ],
   "fields": [
    {
     "key": "date",
     "label": "활동한 날",
     "type": "date",
     "required": true
    },
    {
     "key": "method",
     "label": "어떤 방법으로 알아보았나요?",
     "required": true,
     "options": [
      "직접 측정함",
      "직접 모형실험함",
      "계산 자료를 살펴봄",
      "교사 시범이나 자료를 살펴봄",
      "앞으로 해 볼 계획"
     ]
    },
    {
     "key": "conditions",
     "label": "관찰·실험 조건",
     "required": true
    },
    {
     "key": "content",
     "label": "관찰하거나 알아본 내용",
     "required": true
    },
    {
     "key": "explanation",
     "label": "자료와 연결한 설명",
     "required": true
    },
    {
     "key": "next",
     "label": "더 알아볼 점",
     "required": false
    }
   ],
   "draw": true
  },
  {
   "id": "readangle",
   "title": "같은 순간의 각을 두 번 읽어요",
   "phase": "device",
   "standard": "6과13-01",
   "question": "같은 순간의 각을 두 번 읽어요",
   "intro": "관찰하거나 실험한 내용을 자세히 남기고 싶을 때 선택하여 써요.",
   "steps": [
    "수평 기준과 실 사이 각을 읽고 단위 °를 적어요.",
    "짝과 같은 순간의 각을 각각 읽어 비교해요.",
    "차이가 있으면 받침·막대·실·눈금 방향을 살펴 고친 뒤 다시 읽어요."
   ],
   "fields": [
    {
     "key": "date",
     "label": "활동한 날",
     "type": "date",
     "required": true
    },
    {
     "key": "method",
     "label": "어떤 방법으로 알아보았나요?",
     "required": true,
     "options": [
      "직접 측정함",
      "직접 모형실험함",
      "계산 자료를 살펴봄",
      "교사 시범이나 자료를 살펴봄",
      "앞으로 해 볼 계획"
     ]
    },
    {
     "key": "conditions",
     "label": "관찰·실험 조건",
     "required": true
    },
    {
     "key": "content",
     "label": "관찰하거나 알아본 내용",
     "required": true
    },
    {
     "key": "explanation",
     "label": "자료와 연결한 설명",
     "required": true
    },
    {
     "key": "next",
     "label": "더 알아볼 점",
     "required": false
    }
   ],
   "draw": true
  },
  {
   "id": "measureplan",
   "title": "하루 동안 관찰할 시각을 정해요",
   "phase": "day",
   "standard": "6과13-01",
   "question": "하루 동안 관찰할 시각을 정해요",
   "intro": "관찰하거나 실험한 내용을 자세히 남기고 싶을 때 선택하여 써요.",
   "steps": [
    "같은 막대와 장소에서 오전·남중 무렵·오후를 포함한 여러 시각을 정해요.",
    "고도(°)·그림자 길이(cm)·기온(℃)을 함께 적을 표를 준비해요.",
    "기온계는 바닥이나 벽에 닿지 않는 통풍되는 그늘에 두어요. 같은 위치와 높이를 유지해요."
   ],
   "fields": [
    {
     "key": "date",
     "label": "활동한 날",
     "type": "date",
     "required": true
    },
    {
     "key": "method",
     "label": "어떤 방법으로 알아보았나요?",
     "required": true,
     "options": [
      "직접 측정함",
      "직접 모형실험함",
      "계산 자료를 살펴봄",
      "교사 시범이나 자료를 살펴봄",
      "앞으로 해 볼 계획"
     ]
    },
    {
     "key": "conditions",
     "label": "관찰·실험 조건",
     "required": true
    },
    {
     "key": "content",
     "label": "관찰하거나 알아본 내용",
     "required": true
    },
    {
     "key": "explanation",
     "label": "자료와 연결한 설명",
     "required": true
    },
    {
     "key": "next",
     "label": "더 알아볼 점",
     "required": false
    }
   ],
   "draw": true
  },
  {
   "id": "measureday",
   "title": "여러 시각의 고도·그림자·기온을 측정해요",
   "phase": "day",
   "standard": "6과13-01",
   "question": "여러 시각의 고도·그림자·기온을 측정해요",
   "intro": "관찰하거나 실험한 내용을 자세히 남기고 싶을 때 선택하여 써요.",
   "steps": [
    "교사와 안전한 관찰 장소를 정하고 날짜·시각·날씨를 적어요. 도로·옥상 가장자리에서는 측정하지 않아요.",
    "같은 순간의 태양 고도와 그림자 길이를 읽고, 기온계의 표시가 안정된 뒤 기온을 적어요.",
    "정한 시각에 관찰을 이어 가요. 구름 등으로 그림자가 뚜렷하지 않으면 그 상태를 표시하고 실제로 읽은 값만 적어요."
   ],
   "fields": [
    {
     "key": "date",
     "label": "활동한 날",
     "type": "date",
     "required": true
    },
    {
     "key": "method",
     "label": "어떤 방법으로 알아보았나요?",
     "required": true,
     "options": [
      "직접 측정함",
      "직접 모형실험함",
      "계산 자료를 살펴봄",
      "교사 시범이나 자료를 살펴봄",
      "앞으로 해 볼 계획"
     ]
    },
    {
     "key": "conditions",
     "label": "관찰·실험 조건",
     "required": true
    },
    {
     "key": "content",
     "label": "관찰하거나 알아본 내용",
     "required": true
    },
    {
     "key": "explanation",
     "label": "자료와 연결한 설명",
     "required": true
    },
    {
     "key": "next",
     "label": "더 알아볼 점",
     "required": false
    }
   ],
   "draw": true
  },
  {
   "id": "graphs",
   "title": "같은 시각을 맞추어 세 그래프를 그려요",
   "phase": "graphs",
   "standard": "6과13-01",
   "question": "같은 시각을 맞추어 세 그래프를 그려요",
   "intro": "관찰하거나 실험한 내용을 자세히 남기고 싶을 때 선택하여 써요.",
   "steps": [
    "가로축에는 같은 하루의 측정 시각을 놓아요.",
    "고도·그림자 길이·기온은 각각 세로축 이름과 단위, 눈금을 정해 나타내요.",
    "관찰하지 못한 시각에는 점을 만들어 넣지 않아요. 세 그래프에서 같은 시각의 값을 나란히 비교해요."
   ],
   "fields": [
    {
     "key": "date",
     "label": "활동한 날",
     "type": "date",
     "required": true
    },
    {
     "key": "method",
     "label": "어떤 방법으로 알아보았나요?",
     "required": true,
     "options": [
      "직접 측정함",
      "직접 모형실험함",
      "계산 자료를 살펴봄",
      "교사 시범이나 자료를 살펴봄",
      "앞으로 해 볼 계획"
     ]
    },
    {
     "key": "conditions",
     "label": "관찰·실험 조건",
     "required": true
    },
    {
     "key": "content",
     "label": "관찰하거나 알아본 내용",
     "required": true
    },
    {
     "key": "explanation",
     "label": "자료와 연결한 설명",
     "required": true
    },
    {
     "key": "next",
     "label": "더 알아볼 점",
     "required": false
    }
   ],
   "draw": true
  },
  {
   "id": "lightsetup",
   "title": "빛을 비교할 장치를 준비해요",
   "phase": "energy",
   "standard": "6과13-03",
   "question": "빛을 비교할 장치를 준비해요",
   "intro": "관찰하거나 실험한 내용을 자세히 남기고 싶을 때 선택하여 써요.",
   "steps": [
    "열이 적게 나는 광원을 고정하고 같은 모눈종이를 준비해요.",
    "광원의 밝기와 광원에서 종이 중심까지의 거리를 같게 해요.",
    "종이를 기울이는 조건만 바꾸어 빛이 비추는 넓이를 비교할 준비를 해요. 광원을 눈에 비추거나 가열에 쓰지 않아요."
   ],
   "fields": [
    {
     "key": "date",
     "label": "활동한 날",
     "type": "date",
     "required": true
    },
    {
     "key": "method",
     "label": "어떤 방법으로 알아보았나요?",
     "required": true,
     "options": [
      "직접 측정함",
      "직접 모형실험함",
      "계산 자료를 살펴봄",
      "교사 시범이나 자료를 살펴봄",
      "앞으로 해 볼 계획"
     ]
    },
    {
     "key": "conditions",
     "label": "관찰·실험 조건",
     "required": true
    },
    {
     "key": "content",
     "label": "관찰하거나 알아본 내용",
     "required": true
    },
    {
     "key": "explanation",
     "label": "자료와 연결한 설명",
     "required": true
    },
    {
     "key": "next",
     "label": "더 알아볼 점",
     "required": false
    }
   ],
   "draw": true
  },
  {
   "id": "lightcompare",
   "title": "수직으로 비출 때와 비스듬히 비출 때를 비교해요",
   "phase": "energy",
   "standard": "6과13-03",
   "question": "수직으로 비출 때와 비스듬히 비출 때를 비교해요",
   "intro": "관찰하거나 실험한 내용을 자세히 남기고 싶을 때 선택하여 써요.",
   "steps": [
    "같은 빛을 종이에 수직으로 비추고 빛 자국의 경계를 표시해요.",
    "종이 중심까지 거리를 유지하면서 기울기를 바꾸어 경계와 칸 수를 비교해요.",
    "같은 양의 빛이 넓게 퍼질 때 같은 크기 한 칸이 받는 양을 설명해요. 이 관찰은 기온을 직접 측정한 결과와는 달라요."
   ],
   "fields": [
    {
     "key": "date",
     "label": "활동한 날",
     "type": "date",
     "required": true
    },
    {
     "key": "method",
     "label": "어떤 방법으로 알아보았나요?",
     "required": true,
     "options": [
      "직접 측정함",
      "직접 모형실험함",
      "계산 자료를 살펴봄",
      "교사 시범이나 자료를 살펴봄",
      "앞으로 해 볼 계획"
     ]
    },
    {
     "key": "conditions",
     "label": "관찰·실험 조건",
     "required": true
    },
    {
     "key": "content",
     "label": "관찰하거나 알아본 내용",
     "required": true
    },
    {
     "key": "explanation",
     "label": "자료와 연결한 설명",
     "required": true
    },
    {
     "key": "next",
     "label": "더 알아볼 점",
     "required": false
    }
   ],
   "draw": true
  },
  {
   "id": "sourcevisit",
   "title": "계산 자료의 장소와 날짜를 확인해요",
   "phase": "dates",
   "standard": "6과13-02",
   "question": "계산 자료의 장소와 날짜를 확인해요",
   "intro": "관찰하거나 실험한 내용을 자세히 남기고 싶을 때 선택하여 써요.",
   "steps": [
    "아래 날짜별 자료를 열어 위도·경도·날짜·한국 시각이 같은지 확인해요.",
    "일출·일몰·남중 시각과 남중 무렵 고도를 찾아요.",
    "접속하기 어렵다면 다음 화면의 출처가 있는 사전 자료로 비교해요. 어느 자료를 썼는지 적어요."
   ],
   "fields": [
    {
     "key": "date",
     "label": "활동한 날",
     "type": "date",
     "required": true
    },
    {
     "key": "method",
     "label": "어떤 방법으로 알아보았나요?",
     "required": true,
     "options": [
      "직접 측정함",
      "직접 모형실험함",
      "계산 자료를 살펴봄",
      "교사 시범이나 자료를 살펴봄",
      "앞으로 해 볼 계획"
     ]
    },
    {
     "key": "conditions",
     "label": "관찰·실험 조건",
     "required": true
    },
    {
     "key": "content",
     "label": "관찰하거나 알아본 내용",
     "required": true
    },
    {
     "key": "explanation",
     "label": "자료와 연결한 설명",
     "required": true
    },
    {
     "key": "next",
     "label": "더 알아볼 점",
     "required": false
    }
   ],
   "draw": true
  },
  {
   "id": "daylength",
   "title": "일출에서 일몰까지의 시간을 구해요",
   "phase": "relations",
   "standard": "6과13-02",
   "question": "일출에서 일몰까지의 시간을 구해요",
   "intro": "관찰하거나 실험한 내용을 자세히 남기고 싶을 때 선택하여 써요.",
   "steps": [
    "같은 날짜의 표시된 일몰 시각에서 일출 시각을 빼요.",
    "시간과 분을 나누어 계산한 뒤 낮의 길이를 시간·분으로 나타내요.",
    "사이트가 따로 표시한 낮의 길이와 1분 차이가 있으면 두 값을 구별하여 적어요. 원래 값을 임의로 고치지 않아요."
   ],
   "fields": [
    {
     "key": "date",
     "label": "활동한 날",
     "type": "date",
     "required": true
    },
    {
     "key": "method",
     "label": "어떤 방법으로 알아보았나요?",
     "required": true,
     "options": [
      "직접 측정함",
      "직접 모형실험함",
      "계산 자료를 살펴봄",
      "교사 시범이나 자료를 살펴봄",
      "앞으로 해 볼 계획"
     ]
    },
    {
     "key": "conditions",
     "label": "관찰·실험 조건",
     "required": true
    },
    {
     "key": "content",
     "label": "관찰하거나 알아본 내용",
     "required": true
    },
    {
     "key": "explanation",
     "label": "자료와 연결한 설명",
     "required": true
    },
    {
     "key": "next",
     "label": "더 알아볼 점",
     "required": false
    }
   ],
   "draw": true
  },
  {
   "id": "seasongraph",
   "title": "같은 장소의 두 날짜를 근거로 설명해요",
   "phase": "relations",
   "standard": "6과13-02",
   "question": "같은 장소의 두 날짜를 근거로 설명해요",
   "intro": "관찰하거나 실험한 내용을 자세히 남기고 싶을 때 선택하여 써요.",
   "steps": [
    "날짜를 가로축으로 두고 남중 무렵 고도와 낮의 길이를 각각 나타내요.",
    "여름과 겨울 두 날짜의 고도와 낮의 길이를 함께 비교해요.",
    "두 날짜와 두 양의 값을 넣어 관계를 설명해요. 이 자료만으로 그날의 기온까지 같다고 정하지 않아요."
   ],
   "fields": [
    {
     "key": "date",
     "label": "활동한 날",
     "type": "date",
     "required": true
    },
    {
     "key": "method",
     "label": "어떤 방법으로 알아보았나요?",
     "required": true,
     "options": [
      "직접 측정함",
      "직접 모형실험함",
      "계산 자료를 살펴봄",
      "교사 시범이나 자료를 살펴봄",
      "앞으로 해 볼 계획"
     ]
    },
    {
     "key": "conditions",
     "label": "관찰·실험 조건",
     "required": true
    },
    {
     "key": "content",
     "label": "관찰하거나 알아본 내용",
     "required": true
    },
    {
     "key": "explanation",
     "label": "자료와 연결한 설명",
     "required": true
    },
    {
     "key": "next",
     "label": "더 알아볼 점",
     "required": false
    }
   ],
   "draw": true
  },
  {
   "id": "axisprepare",
   "title": "지구의와 고정 광원으로 비교할 준비를 해요",
   "phase": "axis",
   "standard": "6과13-03",
   "question": "지구의와 고정 광원으로 비교할 준비를 해요",
   "intro": "관찰하거나 실험한 내용을 자세히 남기고 싶을 때 선택하여 써요.",
   "steps": [
    "고정 광원을 태양으로 정하고 같은 거리에 네 공전 위치를 표시해요.",
    "지구의에서 우리나라 한 지점을 표시하고 자전축이 계속 향할 공간의 한 방향을 정해요.",
    "공전 궤도면에 수직인 축과 기울어진 축을 비교해요. 광원·거리·같은 지역·각을 읽는 방법은 유지해요."
   ],
   "fields": [
    {
     "key": "date",
     "label": "활동한 날",
     "type": "date",
     "required": true
    },
    {
     "key": "method",
     "label": "어떤 방법으로 알아보았나요?",
     "required": true,
     "options": [
      "직접 측정함",
      "직접 모형실험함",
      "계산 자료를 살펴봄",
      "교사 시범이나 자료를 살펴봄",
      "앞으로 해 볼 계획"
     ]
    },
    {
     "key": "conditions",
     "label": "관찰·실험 조건",
     "required": true
    },
    {
     "key": "content",
     "label": "관찰하거나 알아본 내용",
     "required": true
    },
    {
     "key": "explanation",
     "label": "자료와 연결한 설명",
     "required": true
    },
    {
     "key": "next",
     "label": "더 알아볼 점",
     "required": false
    }
   ],
   "draw": true
  },
  {
   "id": "vertical",
   "title": "자전축이 기울어지지 않았다면 어떨까요?",
   "phase": "model",
   "standard": "6과13-03",
   "question": "자전축이 기울어지지 않았다면 어떨까요?",
   "intro": "관찰하거나 실험한 내용을 자세히 남기고 싶을 때 선택하여 써요.",
   "steps": [
    "축을 모형의 공전 궤도면에 수직으로 놓아요.",
    "지구의를 같은 거리의 네 위치로 옮겨요.",
    "위치마다 같은 우리나라 표시를 자전시켜 남중을 맞춘 뒤 고도를 비교해요."
   ],
   "fields": [
    {
     "key": "date",
     "label": "활동한 날",
     "type": "date",
     "required": true
    },
    {
     "key": "method",
     "label": "어떤 방법으로 알아보았나요?",
     "required": true,
     "options": [
      "직접 측정함",
      "직접 모형실험함",
      "계산 자료를 살펴봄",
      "교사 시범이나 자료를 살펴봄",
      "앞으로 해 볼 계획"
     ]
    },
    {
     "key": "conditions",
     "label": "관찰·실험 조건",
     "required": true
    },
    {
     "key": "content",
     "label": "관찰하거나 알아본 내용",
     "required": true
    },
    {
     "key": "explanation",
     "label": "자료와 연결한 설명",
     "required": true
    },
    {
     "key": "next",
     "label": "더 알아볼 점",
     "required": false
    }
   ],
   "draw": true
  },
  {
   "id": "tilted",
   "title": "자전축이 기울어진 채 공전하도록 해요",
   "phase": "model",
   "standard": "6과13-03",
   "question": "자전축이 기울어진 채 공전하도록 해요",
   "intro": "관찰하거나 실험한 내용을 자세히 남기고 싶을 때 선택하여 써요.",
   "steps": [
    "자전축을 기울이고 공간에서 가리키는 방향을 유지해요.",
    "앞과 같은 네 위치·거리·지역에서 남중 고도를 비교해요.",
    "위치를 옮길 때 축을 매번 광원 쪽으로 돌리지 않아요. 같은 지역이 빛을 받는 각도에 어떤 차이가 있는지 살펴요."
   ],
   "fields": [
    {
     "key": "date",
     "label": "활동한 날",
     "type": "date",
     "required": true
    },
    {
     "key": "method",
     "label": "어떤 방법으로 알아보았나요?",
     "required": true,
     "options": [
      "직접 측정함",
      "직접 모형실험함",
      "계산 자료를 살펴봄",
      "교사 시범이나 자료를 살펴봄",
      "앞으로 해 볼 계획"
     ]
    },
    {
     "key": "conditions",
     "label": "관찰·실험 조건",
     "required": true
    },
    {
     "key": "content",
     "label": "관찰하거나 알아본 내용",
     "required": true
    },
    {
     "key": "explanation",
     "label": "자료와 연결한 설명",
     "required": true
    },
    {
     "key": "next",
     "label": "더 알아볼 점",
     "required": false
    }
   ],
   "draw": true
  },
  {
   "id": "axisnoon",
   "title": "축 방향 유지와 남중 맞추기를 구별해요",
   "phase": "model",
   "standard": "6과13-03",
   "question": "축 방향 유지와 남중 맞추기를 구별해요",
   "intro": "관찰하거나 실험한 내용을 자세히 남기고 싶을 때 선택하여 써요.",
   "steps": [
    "공전 위치를 옮긴 뒤 자전축이 정해 둔 방향을 가리키는지 먼저 확인해요.",
    "축 방향은 그대로 두고 지구의만 자전시켜 우리나라 표시의 남중을 맞추어요.",
    "자전축이 수직인 모형과 기울어진 모형의 고도 경향을 비교해요. 실제 장치에서 읽은 오차도 함께 살펴요."
   ],
   "fields": [
    {
     "key": "date",
     "label": "활동한 날",
     "type": "date",
     "required": true
    },
    {
     "key": "method",
     "label": "어떤 방법으로 알아보았나요?",
     "required": true,
     "options": [
      "직접 측정함",
      "직접 모형실험함",
      "계산 자료를 살펴봄",
      "교사 시범이나 자료를 살펴봄",
      "앞으로 해 볼 계획"
     ]
    },
    {
     "key": "conditions",
     "label": "관찰·실험 조건",
     "required": true
    },
    {
     "key": "content",
     "label": "관찰하거나 알아본 내용",
     "required": true
    },
    {
     "key": "explanation",
     "label": "자료와 연결한 설명",
     "required": true
    },
    {
     "key": "next",
     "label": "더 알아볼 점",
     "required": false
    }
   ],
   "draw": true
  },
  {
   "id": "make",
   "title": "여름과 겨울을 설명하는 자료를 만들어요",
   "phase": "explain",
   "standard": "6과13-03",
   "question": "여름과 겨울을 설명하는 자료를 만들어요",
   "intro": "관찰하거나 실험한 내용을 자세히 남기고 싶을 때 선택하여 써요.",
   "steps": [
    "같은 장소의 여름과 겨울 남중 태양·같은 막대의 그림자를 나란히 그려요.",
    "두 날짜의 고도와 낮의 길이를 자료에서 찾아 넣어요.",
    "자전축·공전·빛을 받는 각도와 시간·받는 에너지의 관계를 그림과 문장으로 연결해요."
   ],
   "fields": [
    {
     "key": "date",
     "label": "활동한 날",
     "type": "date",
     "required": true
    },
    {
     "key": "method",
     "label": "어떤 방법으로 알아보았나요?",
     "required": true,
     "options": [
      "직접 측정함",
      "직접 모형실험함",
      "계산 자료를 살펴봄",
      "교사 시범이나 자료를 살펴봄",
      "앞으로 해 볼 계획"
     ]
    },
    {
     "key": "conditions",
     "label": "관찰·실험 조건",
     "required": true
    },
    {
     "key": "content",
     "label": "관찰하거나 알아본 내용",
     "required": true
    },
    {
     "key": "explanation",
     "label": "자료와 연결한 설명",
     "required": true
    },
    {
     "key": "next",
     "label": "더 알아볼 점",
     "required": false
    }
   ],
   "draw": true
  },
  {
   "id": "explain",
   "title": "친구에게 계절이 바뀌는 까닭을 설명해요",
   "phase": "explain",
   "standard": "6과13-03",
   "question": "친구에게 계절이 바뀌는 까닭을 설명해요",
   "intro": "관찰하거나 실험한 내용을 자세히 남기고 싶을 때 선택하여 써요.",
   "steps": [
    "그림과 두 날짜의 자료를 짚으며 설명해요.",
    "친구가 어떤 값을 근거로 관계를 설명했는지 들어요.",
    "그림자 길이와 기온, 하루의 변화와 계절의 차이가 섞인 부분이 있는지 질문해요."
   ],
   "fields": [
    {
     "key": "date",
     "label": "활동한 날",
     "type": "date",
     "required": true
    },
    {
     "key": "method",
     "label": "어떤 방법으로 알아보았나요?",
     "required": true,
     "options": [
      "직접 측정함",
      "직접 모형실험함",
      "계산 자료를 살펴봄",
      "교사 시범이나 자료를 살펴봄",
      "앞으로 해 볼 계획"
     ]
    },
    {
     "key": "conditions",
     "label": "관찰·실험 조건",
     "required": true
    },
    {
     "key": "content",
     "label": "관찰하거나 알아본 내용",
     "required": true
    },
    {
     "key": "explanation",
     "label": "자료와 연결한 설명",
     "required": true
    },
    {
     "key": "next",
     "label": "더 알아볼 점",
     "required": false
    }
   ],
   "draw": true
  },
  {
   "id": "revise",
   "title": "질문에 답하도록 자료를 보충해요",
   "phase": "explain",
   "standard": "6과13-03",
   "question": "질문에 답하도록 자료를 보충해요",
   "intro": "관찰하거나 실험한 내용을 자세히 남기고 싶을 때 선택하여 써요.",
   "steps": [
    "친구의 질문을 보고 그림의 기준과 이름표가 충분한지 확인해요.",
    "축이 향하는 방향·같은 지역의 남중·낮의 길이 중 빠진 설명을 보태요.",
    "처음과 달라진 부분을 짚으며 다시 설명해요."
   ],
   "fields": [
    {
     "key": "date",
     "label": "활동한 날",
     "type": "date",
     "required": true
    },
    {
     "key": "method",
     "label": "어떤 방법으로 알아보았나요?",
     "required": true,
     "options": [
      "직접 측정함",
      "직접 모형실험함",
      "계산 자료를 살펴봄",
      "교사 시범이나 자료를 살펴봄",
      "앞으로 해 볼 계획"
     ]
    },
    {
     "key": "conditions",
     "label": "관찰·실험 조건",
     "required": true
    },
    {
     "key": "content",
     "label": "관찰하거나 알아본 내용",
     "required": true
    },
    {
     "key": "explanation",
     "label": "자료와 연결한 설명",
     "required": true
    },
    {
     "key": "next",
     "label": "더 알아볼 점",
     "required": false
    }
   ],
   "draw": true
  }
 ]
};
