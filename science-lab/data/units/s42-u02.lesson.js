import { humidifierReading } from '../reading/s42-u02.reading.js';
export const lesson = {
  "unitId": "s42-u02",
  "grade": 4,
  "title": "물의 상태 변화",
  "hero": "미니 가습기",
  "engage": {
    "say": [
      {
        "mood": "thinking",
        "text": "차가운 컵의 물은 어디서 왔을까요?"
      }
    ],
    "scene": "mini-humidifier",
    "question": "판을 더 차갑게 하면 물방울은 어떻게 될까요?",
    "predictions": [
      {
        "id": "0",
        "text": "더 뚜렷하게 맺힌다"
      },
      {
        "id": "1",
        "text": "두 판이 꼭 같아진다"
      },
      {
        "id": "2",
        "text": "물방울이 사라진다"
      }
    ],
    "answer": "0",
    "wrongNote": "실험 결과와 비교하며 가설을 다시 생각해요."
  },
  "explore": {
    "say": [
      {
        "mood": "talk",
        "text": "판의 차가운 정도만 바꿔 봐요."
      }
    ],
    "modes": [
      "lab",
      "scene",
      "home"
    ],
    "lab": {
      "kind": "humidifier",
      "goal": "물의 온도와 판의 차가움을 고르고 실험 시작 → 관찰 → 표에 적기 순으로 해 보세요.",
      "columns": [
        "물",
        "판",
        "물방울 관찰"
      ]
    },
    "home": {
      "title": "차가운 컵에 맺힌 물방울",
      "minutes": 10,
      "guardian": false,
      "materials": [
        {
          "name": "같은 크기 투명 컵",
          "qty": "2개",
          "have": "home"
        },
        {
          "name": "물",
          "qty": "같은 양",
          "have": "home"
        },
        {
          "name": "얼음",
          "qty": "몇 조각",
          "have": "home"
        },
        {
          "name": "마른 천",
          "qty": "1장",
          "have": "home"
        }
      ],
      "steps": [
        "집에서는 같은 컵에 같은 양의 물을 담고 한 컵에만 얼음을 넣어요. 컵 바깥을 닦고 5~10분 뒤 물방울을 비교해요.",
        "물방울이 나타난 쪽을 적고, 닦은 뒤 다시 생기는지도 확인해요."
      ],
      "safety": [
        "가열하지 않아요. 컵을 받침 위에 놓고 물을 쏟으면 바로 닦아요."
      ],
      "kitUrl": "https://lete-on.gfieldacademy.net/science-lab/v2/#/s42-u02/kit",
      "qr": null
    }
  },
  "explain": {
    "say": [
      {
        "mood": "talk",
        "text": "기화와 응결은 방향이 반대예요."
      }
    ],
    "analogy": "물은 모습을 바꾸며 공기와 컵 사이를 여행해요.",
    "principle": "기화는 액체에서 기체로, 응결은 기체에서 액체로 변하는 거예요.",
    "cards": [
      "s42-u02-b01",
      "s42-u02-b02",
      "s42-u02-b03",
      "s42-u02-b04"
    ],
    "table": "s42-u02-b05",
    "miniTest": [
      "s42-u02-b06"
    ]
  },
  "elaborate": {
    "say": [
      {
        "mood": "thinking",
        "text": "우리 주변에서 물의 여행을 찾아요."
      }
    ],
    "items": [
      "s42-u02-b07",
      "s42-u02-b08",
      "s42-u02-b09"
    ],
    "reading": {
      "magazine": humidifierReading,
      "title": "차가운 컵은 어디서 물을 얻을까?",
      "text": "컵에 구멍이 없어도, 바깥에 물방울이 맺혀요."
    },
    "report": true
  },
  "evaluate": {
    "say": [
      {
        "mood": "praise",
        "text": "김과 수증기를 구별할 수 있나요?"
      }
    ],
    "items": [
      "s42-u02-b10",
      "s42-u02-b11",
      "s42-u02-b12"
    ],
    "pass": 2
  },
  "report": {
    "title": "미니 가습기 탐구보고서",
    "sections": [
      {
        "key": "problem",
        "label": "① 탐구 문제",
        "hint": "물이 수증기로 변하고 다시 물방울이 되는 과정을 관찰하고, 판을 식힌 정도만 바꾸어 응결을 비교해 보자."
      },
      {
        "key": "hypothesis",
        "label": "② 가설",
        "hint": "같은 온도·양의 물을 쓰고 판의 차가운 정도만 바꾸면, 물방울 맺히는 모습은 어떻게 달라질까요?"
      },
      {
        "key": "vars",
        "label": "③ 비교 조건",
        "hint": "물의 양, 물의 온도, 판의 크기와 높이, 공기 조건, 관찰 시간을 같게 한다."
      },
      {
        "key": "result",
        "label": "④ 결과",
        "hint": "모형과 실제 기록을 나누어요."
      },
      {
        "key": "conclusion",
        "label": "⑤ 결론",
        "hint": "차가운 판에 물방울이 맺힌 까닭을 수증기와 이어 설명해요."
      },
      {
        "key": "more",
        "label": "⑥ 더 알고 싶은 점",
        "hint": ""
      }
    ],
    "checks": [
      "한 조건만 바꾸었나요?",
      "결과를 표에 남겼나요?",
      "관찰 사실과 생각을 나누었나요?",
      "수증기와 김을 구별했나요?"
    ]
  }
};
lesson.explore.lab.rowText = r => `${r.water} · 판 ${r.surface} · ${r.result}`;
lesson.explain.fromData = rows => rows.length ? `네 기록: ${rows.map(lesson.explore.lab.rowText).join(" / ")}. 모형과 실제 관찰을 구별해요.` : "";
