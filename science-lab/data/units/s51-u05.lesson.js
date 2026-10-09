import { moldReading } from '../reading/s51-u05.reading.js';
export const lesson = {
  "unitId": "s51-u05",
  "grade": 5,
  "title": "다양한 생물과 우리 생활",
  "hero": "효모빵 반죽 실험실",
  "engage": {
    "say": [{ "mood": "thinking", "text": "빵은 왜 폭신폭신할까요? 반죽 속에 누가 살고 있을까요?" }],
    "scene": "bread-dough",
    "question": "같은 재료에 찬물·따뜻한 물(40 ℃)·뜨거운 물(70 ℃)을 넣은 반죽을 따뜻한 곳에 40분 두면 어느 반죽이 가장 많이 부풀까요?",
    "predictions": [
      { "id": "0", "text": "따뜻한 물로 만든 반죽" },
      { "id": "1", "text": "뜨거운 물로 만든 반죽" },
      { "id": "2", "text": "세 반죽 모두 똑같이 부푼다" }
    ],
    "answer": "0",
    "wrongNote": "물의 온도에 따라 반죽이 부푼 부피를 비교하며, 반죽을 부풀리는 것이 무엇인지 다시 생각해요."
  },
  "explore": {
    "say": [{ "mood": "talk", "text": "밀가루·설탕·효모는 그대로, 물의 온도만 바꿔요." }],
    "modes": ["lab", "scene", "home"],
    "lab": {
      "kind": "bread",
      "goal": "물의 온도 고르기 → 발효시키기(40분) → 부피 읽기 → 표에 적기 순으로 세 가지 물을 모두 해 보세요.",
      "columns": ["반죽에 넣은 물", "40분 뒤 부피", "반죽 모습"]
    },
    "home": {
      "title": "풍선 효모 발효 병",
      "minutes": 20,
      "guardian": true,
      "materials": [
        { "name": "작은 페트병", "qty": "2개", "have": "home" },
        { "name": "드라이 이스트", "qty": "1작은술씩", "have": "home" },
        { "name": "설탕", "qty": "1숟가락씩", "have": "home" },
        { "name": "풍선", "qty": "2개", "have": "home" }
      ],
      "steps": [
        "두 병에 설탕과 이스트를 같게 넣고, 한 병에는 찬물, 다른 병에는 미지근한 물(손을 넣어 따뜻한 정도)을 같은 양만큼 부어요.",
        "병 입구에 풍선을 씌우고 30분 뒤 두 풍선의 크기를 비교한 뒤, 풍선을 부풀린 기체가 어디서 왔는지 설명해요."
      ],
      "safety": ["뜨거운 물은 쓰지 않아요. 물은 보호자와 함께 준비해요."],
      "kitUrl": "https://lete-on.gfieldacademy.net/science-lab/v2/#/s51-u05/kit",
      "qr": null
    }
  },
  "explain": {
    "say": [{ "mood": "talk", "text": "효모는 따뜻할 때 기체를 많이 만들어요." }],
    "analogy": "효모는 반죽 속에 사는 아주 작은 요리사예요. 설탕을 먹고 숨을 쉬듯 이산화탄소를 내뿜으면, 쫀득한 반죽이 풍선처럼 그 기체를 가둬 부풀어요. 요리사도 너무 추우면 느려지고, 너무 뜨거우면 쓰러지지요.",
    "principle": "곰팡이·버섯·효모는 균사나 포자로 번식하고 스스로 양분을 만들지 못하는 균류예요. 효모는 따뜻할 때 설탕을 먹고 이산화탄소를 내놓아 빵을 부풀려요. 세균과 원생생물처럼 작은 생물은 우리 생활에 이롭기도, 해롭기도 해요.",
    "cards": ["s51-u05-b01", "s51-u05-b02", "s51-u05-b03", "s51-u05-b04"],
    "table": "s51-u05-b05",
    "miniTest": ["s51-u05-b06"]
  },
  "elaborate": {
    "say": [{ "mood": "thinking", "text": "곰팡이로 병을 고칠 수 있을까요?" }],
    "items": ["s51-u05-b07", "s51-u05-b08", "s51-u05-b09"],
    "reading": {
      "magazine": moldReading,
      "title": "곰팡이가 찾아 준 약, 페니실린",
      "text": "실험 접시에 핀 푸른곰팡이 둘레에만 세균이 자라지 않았어요. 그 우연한 발견이 수많은 생명을 구한 약이 되었어요."
    },
    "report": true
  },
  "evaluate": {
    "say": [{ "mood": "praise", "text": "효모와 곰팡이, 세균이 하는 일을 설명할 수 있나요?" }],
    "items": ["s51-u05-b10", "s51-u05-b11", "s51-u05-b12"],
    "pass": 2
  },
  "report": {
    "title": "부푸는 효모빵 탐구보고서",
    "sections": [
      { "key": "problem", "label": "① 탐구 문제", "hint": "반죽에 넣는 물의 온도에 따라 반죽이 부푸는 정도가 달라질까?" },
      { "key": "hypothesis", "label": "② 가설", "hint": "따뜻한 물로 반죽하면 반죽은 어떻게 될까요?" },
      { "key": "vars", "label": "③ 비교 조건", "hint": "물의 온도만 바꾸고, 밀가루·설탕·효모·물의 양과 두는 시간은 같게 한다." },
      { "key": "result", "label": "④ 결과", "hint": "물마다 40분 뒤 반죽의 부피를 써요." },
      { "key": "conclusion", "label": "⑤ 결론", "hint": "효모가 활발한 온도와 반죽이 부푸는 까닭을 써요." },
      { "key": "more", "label": "⑥ 더 알고 싶은 점", "hint": "" }
    ],
    "checks": ["한 조건만 바꾸었나요?", "결과를 표에 남겼나요?", "관찰 사실과 생각을 나누었나요?", "반죽을 부풀린 것이 효모가 만든 기체라는 것을 설명했나요?"]
  }
};
lesson.explore.lab.rowText = r => `${r.water} · ${r.result}`;
lesson.explain.fromData = rows => rows.length ? `네 기록: ${rows.map(lesson.explore.lab.rowText).join(" / ")}. 물의 온도에 따라 반죽이 부푼 정도가 어떻게 달랐나요?` : "";
