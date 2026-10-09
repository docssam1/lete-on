import { bubbleReading } from '../reading/s52-u01.reading.js';
export const lesson = {
  "unitId": "s52-u01",
  "grade": 5,
  "title": "재미있는 나의 탐구",
  "hero": "비눗방울 실험실",
  "engage": {
    "say": [{ "mood": "thinking", "text": "비눗방울은 왜 금방 터질까요? 오래 가게 할 수는 없을까요?" }],
    "scene": "bubble-wand",
    "question": "같은 비눗물에 아무것도 넣지 않거나, 설탕이나 글리세린을 넣어 같은 크기의 방울을 불면 어느 방울이 가장 오래 갈까요?",
    "predictions": [
      { "id": "0", "text": "글리세린을 넣은 비눗물의 방울" },
      { "id": "1", "text": "그냥 비눗물의 방울" },
      { "id": "2", "text": "세 방울 모두 똑같이 간다" }
    ],
    "answer": "0",
    "wrongNote": "넣은 것에 따라 방울이 터지기까지 걸린 시간을 비교하며, 막 속의 물에 무슨 일이 일어나는지 다시 생각해요."
  },
  "explore": {
    "say": [{ "mood": "talk", "text": "비눗물의 양과 고리, 부는 세기는 그대로, 넣는 것만 바꿔요." }],
    "modes": ["lab", "scene", "home"],
    "lab": {
      "kind": "bubble",
      "goal": "넣을 것 고르기 → 불기 세 번(회차마다 터지기까지 시간) → 평균 내어 표에 적기 순으로 세 가지 비눗물을 모두 해 보세요.",
      "columns": ["넣은 것", "1·2·3회", "평균"]
    },
    "home": {
      "title": "나만의 비눗방울 탐구",
      "minutes": 30,
      "guardian": true,
      "materials": [
        { "name": "주방 세제 또는 물비누", "qty": "조금", "have": "home" },
        { "name": "종이컵", "qty": "3개", "have": "home" },
        { "name": "설탕", "qty": "1숟가락", "have": "home" },
        { "name": "빨대 또는 철사 고리", "qty": "1개", "have": "home" },
        { "name": "초시계(휴대 전화)", "qty": "1개", "have": "home" }
      ],
      "steps": [
        "궁금한 점 하나를 「~에 따라 ~이 달라질까?」 꼴의 탐구 문제로 바꾸고, 다르게 할 조건 하나와 같게 할 조건을 적어요.",
        "조건마다 세 번씩 방울을 불어 터지기까지 시간을 재고, 평균을 막대그래프로 그려 가족 앞에서 발표해요."
      ],
      "safety": ["비눗물이 눈에 들어가지 않게 해요. 빨대로 비눗물을 빨아들이지 않아요. 바닥이 미끄러우니 닦아요."],
      "kitUrl": "https://lete-on.gfieldacademy.net/science-lab/v2/#/s52-u01/kit",
      "qr": null
    }
  },
  "explain": {
    "say": [{ "mood": "talk", "text": "막 속의 물이 증발하면 비눗방울이 터져요." }],
    "analogy": "비눗방울 막은 비누 분자 두 겹 사이에 물을 끼운 아주 얇은 샌드위치예요. 속의 물이 말라 샌드위치가 얇아지면 찢어지지요. 글리세린은 물을 꼭 붙잡아 마르는 것을 늦추는 보습제 같아요.",
    "principle": "탐구는 궁금한 점을 실험으로 확인할 수 있는 탐구 문제로 바꾸는 데서 시작해요. 한 가지 조건만 바꾸고 여러 번 재어 평균을 내고, 표·그래프로 정리해 결론을 발표해요. 비눗방울은 막 속의 물이 증발해 얇아지면 터지고, 글리세린·설탕은 증발을 늦춰요.",
    "cards": ["s52-u01-b01", "s52-u01-b02", "s52-u01-b03", "s52-u01-b04"],
    "table": "s52-u01-b05",
    "miniTest": ["s52-u01-b06"]
  },
  "elaborate": {
    "say": [{ "mood": "thinking", "text": "비눗방울은 왜 늘 둥글까요?" }],
    "items": ["s52-u01-b07", "s52-u01-b08", "s52-u01-b09"],
    "reading": {
      "magazine": bubbleReading,
      "title": "비눗방울은 왜 늘 둥글까?",
      "text": "네모난 고리로 불어도 비눗방울은 둥글어요. 세 개가 붙으면 늘 120°로 만나요. 비눗방울 하나에 숨은 규칙을 찾아봐요."
    },
    "report": true
  },
  "evaluate": {
    "say": [{ "mood": "praise", "text": "나만의 탐구 문제를 세우고 결과를 발표할 수 있나요?" }],
    "items": ["s52-u01-b10", "s52-u01-b11", "s52-u01-b12"],
    "pass": 2
  },
  "report": {
    "title": "비눗방울 탐구보고서",
    "sections": [
      { "key": "problem", "label": "① 탐구 문제", "hint": "비눗물에 넣는 것에 따라 비눗방울이 터지기까지 시간이 달라질까?" },
      { "key": "hypothesis", "label": "② 가설", "hint": "무엇을 넣으면 방울이 가장 오래 갈까요?" },
      { "key": "vars", "label": "③ 비교 조건", "hint": "넣는 것만 바꾸고, 비눗물의 양·고리·부는 세기는 같게 한다." },
      { "key": "result", "label": "④ 결과", "hint": "세 번 잰 시간과 평균을 표와 막대그래프로 써요." },
      { "key": "conclusion", "label": "⑤ 결론", "hint": "넣은 것과 방울이 간 시간의 관계를 써요." },
      { "key": "more", "label": "⑥ 더 알고 싶은 점", "hint": "" }
    ],
    "checks": ["한 조건만 바꾸었나요?", "세 번 재어 평균을 냈나요?", "결과를 그대로 썼나요?", "비눗방울이 터지는 까닭(증발)을 설명했나요?"]
  }
};
lesson.explore.lab.rowText = r => `${r.add} · ${r.result}`;
lesson.explain.fromData = rows => rows.length ? `네 기록: ${rows.map(lesson.explore.lab.rowText).join(" / ")}. 넣은 것에 따라 방울이 간 시간이 어떻게 달랐나요?` : "";
