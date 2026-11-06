import{withPlantStructureReadableWorkbook}from'./c22-s61-u03.editorial.js?v=20261106-plant-structure-readable-workbook';
import{withStudentGuideLanguage}from'./student-opening-language.js?v=20261105-student-guide';
import{withGuidanceParticles}from'./term-particle-language.js?v=20261105-guidance-particles';
import {withPlantStructureEditorial} from './c22-s61-u03.editorial.js?v=20261104-plant-structure-book';
// 식물128문항. scripts/gen-science-workbook-c22s61u03.mjs가 생성.
const baseWorkbook = {
 "unit": "c22-s61-u03",
 "title": "식물의 구조와 기능",
 "semester": "6-1",
 "no": 3,
 "theme": "#2456c4",
 "book": "지필드 교과 연결 사고력",
 "richText": true,
 "questions": [
  {
   "id": "c22-s61-u03-w001",
   "no": 1,
   "section": 1,
   "form": "choice",
   "type": "T01",
   "topic": "세포라는 단위",
   "prompt": "양파 표피를 현미경으로 보니 작은 단위가 여러 개 이어져 있었습니다. 생물을 이루는 기본 단위의 이름을 고르세요.",
   "answer": "③ 세포",
   "explanation": "양파 표피를 이루는 작은 기본 단위는 세포예요. 기관인 뿌리·줄기나 도구 이름과 구별해요.",
   "misconception": "세포는 생물을 이루는 기본 단위예요. 구조 이름과 기능 암기를 구별해요.",
   "choices": [
    "꽃",
    "현미경",
    "세포",
    "뿌리",
    "줄기"
   ],
   "key": 2,
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "single-choice",
    "answer": 2
   },
   "criteria": "「세포」을 고른다. 양파 표피를 이루는 작은 기본 단위는 세포예요. 기관인 뿌리·줄기나 도구 이름과 구별해요."
  },
  {
   "id": "c22-s61-u03-w002",
   "no": 2,
   "section": 1,
   "form": "blank",
   "type": "T01",
   "topic": "기본 단위",
   "prompt": "생물을 이루는 기본 단위를 [ ]라고 해요.",
   "answer": "세포",
   "explanation": "한 식물의 기관도 많은 세포로 이루어져 있어요. 눈에 보이는 큰 기관 이름과 기본 단위를 구별해요.",
   "misconception": "세포는 생물을 이루는 기본 단위예요. 구조 이름과 기능 암기를 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "세포"
    ]
   },
   "criteria": "「세포」 또는 명시한 동등 표현. 한 식물의 기관도 많은 세포로 이루어져 있어요. 눈에 보이는 큰 기관 이름과 기본 단위를 구별해요."
  },
  {
   "id": "c22-s61-u03-w003",
   "no": 3,
   "section": 1,
   "form": "short",
   "type": "T02",
   "topic": "관찰 도구",
   "prompt": "양파 표피의 작은 세포를 확대해 관찰할 때 사용하는 도구를 쓰세요.",
   "answer": "현미경",
   "explanation": "맨눈으로 양파의 겉모습을 보는 활동과 세포를 확대해 보는 활동은 달라요. 적절히 준비한 표본을 현미경으로 관찰해요.",
   "misconception": "관찰한 표본·배율·보이는 범위를 밝히고 안 보이는 구조를 그려 넣지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "현미경"
    ]
   },
   "criteria": "「현미경」 또는 명시한 동등 표현. 맨눈으로 양파의 겉모습을 보는 활동과 세포를 확대해 보는 활동은 달라요. 적절히 준비한 표본을 현미경으로 관찰해요."
  },
  {
   "id": "c22-s61-u03-w004",
   "no": 4,
   "section": 1,
   "form": "multi",
   "type": "T02",
   "topic": "실제 관찰 준비",
   "prompt": "식물 세포를 실제로 관찰하는 준비로 알맞은 것을 모두 고르세요.",
   "answer": "②, ⑤",
   "explanation": "표본을 준비하거나 만들어진 표본을 실제로 관찰해야 해요. 화면 사진을 본 것만으로 직접 현미경을 사용했다고 하지 않아요.",
   "misconception": "관찰한 표본·배율·보이는 범위를 밝히고 안 보이는 구조를 그려 넣지 않아요.",
   "choices": [
    "세포 사진만 본 뒤 현미경 관찰 완료라고 적는다.",
    "교사 안내에 따라 낮은 배율에서 먼저 표본을 찾는다.",
    "초점을 맞추려고 렌즈를 표본에 세게 누른다.",
    "안 보인 핵을 교재 그림대로 관찰 칸에 채운다.",
    "교사가 준비한 양파 표피 표본을 현미경에 놓는다."
   ],
   "key": [
    1,
    4
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     1,
     4
    ]
   },
   "criteria": "교사 안내에 따라 낮은 배율에서 먼저 표본을 찾는다. / 교사가 준비한 양파 표피 표본을 현미경에 놓는다.를 모두 고르고 다른 보기를 넣지 않는다."
  },
  {
   "id": "c22-s61-u03-w005",
   "no": 5,
   "section": 1,
   "form": "match",
   "type": "T01",
   "topic": "관찰 구조 이름",
   "prompt": "보기: ㄱ 핵 / ㄴ 세포막 / ㄷ 세포벽. 제시한 이름표의 설명과 연결하세요.",
   "answer": "(1) ㄷ (2) ㄴ (3) ㄱ",
   "explanation": "이 활동에서는 구조의 이름을 구별해요. 자세한 기능을 암기하거나 관찰하지 못한 구조까지 보았다고 하지 않아요.",
   "misconception": "세포는 생물을 이루는 기본 단위예요. 구조 이름과 기능 암기를 구별해요.",
   "parts": [
    "(1) 식물 세포의 바깥쪽에 있는 벽 구조 [ ]",
    "(2) 세포벽 안쪽의 얇은 막 구조 [ ]",
    "(3) 염색한 표본에서 확인해 이름을 붙인 작은 구조 [ ]"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "answerPerPart": true,
   "responseContract": {
    "kind": "ordered-label-parts",
    "answers": [
     "ㄷ",
     "ㄴ",
     "ㄱ"
    ]
   },
   "criteria": "「(1) ㄷ (2) ㄴ (3) ㄱ」 또는 명시한 동등 표현. 이 활동에서는 구조의 이름을 구별해요. 자세한 기능을 암기하거나 관찰하지 못한 구조까지 보았다고 하지 않아요."
  },
  {
   "id": "c22-s61-u03-w006",
   "no": 6,
   "section": 1,
   "form": "written",
   "type": "T02",
   "topic": "안 보이는 구조",
   "prompt": "표본에서 세포벽은 보였지만 핵의 위치는 뚜렷하지 않았습니다. 관찰 그림을 어떻게 남기고 다음에 무엇을 할지 쓰세요.",
   "answer": "보인 세포벽을 그리고 핵은 뚜렷하지 않았다고 적어요. 교사와 조명·초점·표본 상태를 확인하고 다시 관찰해요.",
   "explanation": "관찰한 구조와 교재에서 배운 이름을 구별해야 해요. 핵의 위치를 추측해 실제 관찰처럼 채우지 않아요.",
   "misconception": "관찰한 표본·배율·보이는 범위를 밝히고 안 보이는 구조를 그려 넣지 않아요.",
   "requirements": [
    "보인 구조만 관찰로 표시",
    "핵이 불분명함을 명시",
    "조명·초점·표본 중 구체적인 재확인 방법"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "required": [
     "보인 구조만 관찰로 표시",
     "핵이 불분명함을 명시",
     "조명·초점·표본 중 구체적인 재확인 방법"
    ]
   },
   "lines": 8,
   "criteria": "보인 구조만 관찰로 표시 / 핵이 불분명함을 명시 / 조명·초점·표본 중 구체적인 재확인 방법"
  },
  {
   "id": "c22-s61-u03-w007",
   "no": 7,
   "section": 1,
   "form": "choice",
   "type": "T02",
   "topic": "배율과 찾기",
   "prompt": "낮은 배율에서 세포를 찾은 뒤 더 자세히 보려 합니다. 다음 행동으로 알맞은 것을 고르세요.",
   "answer": "① 보려는 부분을 가운데에 놓고 교사 안내에 따라 배율을 바꾼다.",
   "explanation": "보려는 부분을 먼저 가운데에 놓아야 배율을 높였을 때 다시 찾기 쉬워요. 렌즈·표본이 부딪치지 않도록 교사의 조작 안내를 따라요.",
   "misconception": "관찰한 표본·배율·보이는 범위를 밝히고 안 보이는 구조를 그려 넣지 않아요.",
   "choices": [
    "보려는 부분을 가운데에 놓고 교사 안내에 따라 배율을 바꾼다.",
    "표본이 안 보이면 먼저 가장 높은 배율로 바꾸어 넓은 범위를 찾는다.",
    "초점이 안 맞으면 표본을 렌즈로 세게 누른다.",
    "배율만 높이면 조명과 초점은 보지 않는다.",
    "표본 대신 책의 그림을 현미경 관찰이라고 부른다."
   ],
   "key": 0,
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "single-choice",
    "answer": 0
   },
   "criteria": "「보려는 부분을 가운데에 놓고 교사 안내에 따라 배율을 바꾼다.」을 고른다. 보려는 부분을 먼저 가운데에 놓아야 배율을 높였을 때 다시 찾기 쉬워요. 렌즈·표본이 부딪치지 않도록 교사의 조작 안내를 따라요."
  },
  {
   "id": "c22-s61-u03-w008",
   "no": 8,
   "section": 1,
   "form": "blank",
   "type": "T01",
   "topic": "구조 이름의 구별",
   "prompt": "식물 세포에서 세포벽 안쪽의 얇은 막은 세포[ ]이라고 해요.",
   "answer": "막",
   "explanation": "세포막과 세포벽은 다른 이름이에요. 실제 표본에서는 경계가 모두 뚜렷하게 구별되는 것은 아니에요.",
   "misconception": "세포는 생물을 이루는 기본 단위예요. 구조 이름과 기능 암기를 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "막"
    ]
   },
   "criteria": "「막」 또는 명시한 동등 표현. 세포막과 세포벽은 다른 이름이에요. 실제 표본에서는 경계가 모두 뚜렷하게 구별되는 것은 아니에요."
  },
  {
   "id": "c22-s61-u03-w009",
   "no": 9,
   "section": 1,
   "form": "short",
   "type": "T02",
   "topic": "관찰 기록 고르기",
   "prompt": "기록 가: 교재에서 베낀 그림. 기록 나: 내가 현미경에서 본 모양과 관찰 배율. 직접 관찰의 근거가 담긴 기록의 기호를 쓰세요.",
   "answer": "나",
   "explanation": "나에는 실제로 본 모양과 배율이 있어요. 교재 그림은 비교 자료로 쓸 수 있지만 나의 직접 관찰 결과가 되지는 않아요.",
   "misconception": "관찰한 표본·배율·보이는 범위를 밝히고 안 보이는 구조를 그려 넣지 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "나"
    ]
   },
   "criteria": "「나」 또는 명시한 동등 표현. 나에는 실제로 본 모양과 배율이 있어요. 교재 그림은 비교 자료로 쓸 수 있지만 나의 직접 관찰 결과가 되지는 않아요."
  },
  {
   "id": "c22-s61-u03-w010",
   "no": 10,
   "section": 1,
   "form": "multi",
   "type": "T02",
   "topic": "관찰과 추측",
   "prompt": "직접 관찰한 내용으로 남길 수 있는 것을 모두 고르세요.",
   "answer": "②, ④",
   "explanation": "초점이 맞은 범위에서 보인 모양과 불분명함을 그대로 남겨요. 보지 않은 구조의 색·위치를 추측하지 않아요.",
   "misconception": "관찰한 표본·배율·보이는 범위를 밝히고 안 보이는 구조를 그려 넣지 않아요.",
   "choices": [
    "핵이 안 보여도 그림에서 외운 위치를 관찰로 적는다.",
    "여러 칸 모양의 경계가 이어져 보였다고 적는다.",
    "양파 표피 한 곳을 보고 모든 식물 세포의 모양이 같다고 쓴다.",
    "핵은 뚜렷하게 구별하지 못했다고 적는다.",
    "사진을 확대했으니 직접 현미경을 썼다고 적는다."
   ],
   "key": [
    1,
    3
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     1,
     3
    ]
   },
   "criteria": "여러 칸 모양의 경계가 이어져 보였다고 적는다. / 핵은 뚜렷하게 구별하지 못했다고 적는다.를 모두 고르고 다른 보기를 넣지 않는다."
  },
  {
   "id": "c22-s61-u03-w011",
   "no": 11,
   "section": 1,
   "form": "written",
   "type": "T01",
   "topic": "기관과 세포",
   "prompt": "친구가 “잎 한 장이 세포 하나야”라고 말했습니다. 양파 표피 관찰과 연결해 고쳐 쓰세요.",
   "answer": "잎은 식물의 기관이고 많은 세포로 이루어져 있어요. 양파 표피에서 작은 단위가 여러 개 이어진 것처럼 기관 전체와 세포 하나는 달라요.",
   "explanation": "기관의 크기와 세포라는 기본 단위를 구별하는 설명이 필요해요. 세포 소기관 기능을 더 외우는 과제가 아니에요.",
   "misconception": "세포는 생물을 이루는 기본 단위예요. 구조 이름과 기능 암기를 구별해요.",
   "requirements": [
    "잎은 기관이라고 구별",
    "여러 세포로 이루어짐",
    "관찰한 작은 단위와 전체의 관계"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "required": [
     "잎은 기관이라고 구별",
     "여러 세포로 이루어짐",
     "관찰한 작은 단위와 전체의 관계"
    ]
   },
   "lines": 8,
   "criteria": "잎은 기관이라고 구별 / 여러 세포로 이루어짐 / 관찰한 작은 단위와 전체의 관계"
  },
  {
   "id": "c22-s61-u03-w012",
   "no": 12,
   "section": 1,
   "form": "written",
   "type": "T02",
   "topic": "그림 두 종류",
   "prompt": "세포 모식도는 구조 이름을 뚜렷하게 나누었지만 실제 관찰에서는 일부 경계가 흐렸습니다. 두 그림의 쓰임을 비교하세요.",
   "answer": "모식도는 구조 이름과 관계를 알아보기 쉽게 정리한 자료예요. 관찰 그림은 실제로 보인 범위와 불분명한 부분을 그대로 담아요.",
   "explanation": "깔끔한 설명 그림을 관찰 결과처럼 바꾸면 실제로 무엇을 보았는지 알기 어려워져요.",
   "misconception": "관찰한 표본·배율·보이는 범위를 밝히고 안 보이는 구조를 그려 넣지 않아요.",
   "requirements": [
    "모식도의 설명 목적",
    "실제 관찰 범위 보존",
    "불분명한 부분을 꾸며 채우지 않음"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "required": [
     "모식도의 설명 목적",
     "실제 관찰 범위 보존",
     "불분명한 부분을 꾸며 채우지 않음"
    ]
   },
   "lines": 8,
   "criteria": "모식도의 설명 목적 / 실제 관찰 범위 보존 / 불분명한 부분을 꾸며 채우지 않음"
  },
  {
   "id": "c22-s61-u03-w013",
   "no": 13,
   "section": 1,
   "form": "choice",
   "type": "T01",
   "topic": "모식도와 실제 관찰",
   "prompt": "식물 세포 모식도를 본 뒤 실제 표본을 관찰했습니다. 타당한 해석을 고르세요.",
   "answer": "⑤ 실제 표본에서 보인 구조와 불분명한 부분을 구별한다.",
   "explanation": "모식도는 구조를 이해하기 쉽게 나타낸 자료이고 실제 관찰은 표본에서 보인 범위를 담아요. 경계나 핵이 불분명하다고 구조가 없다고 단정하지 않아요.",
   "misconception": "세포는 생물을 이루는 기본 단위예요. 구조 이름과 기능 암기를 구별해요.",
   "choices": [
    "모식도에 그린 핵의 색과 위치를 실제 표본에서 안 보인 부분에도 똑같이 채운다.",
    "모식도에 칠한 색이 모든 실제 세포의 색과 같다.",
    "핵이 불분명하면 그 세포에는 핵이 없다고 정한다.",
    "세포벽 한 칸이 잎 한 장 전체라고 정한다.",
    "실제 표본에서 보인 구조와 불분명한 부분을 구별한다."
   ],
   "key": 4,
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "single-choice",
    "answer": 4
   },
   "criteria": "「실제 표본에서 보인 구조와 불분명한 부분을 구별한다.」을 고른다. 모식도는 구조를 이해하기 쉽게 나타낸 자료이고 실제 관찰은 표본에서 보인 범위를 담아요. 경계나 핵이 불분명하다고 구조가 없다고 단정하지 않아요."
  },
  {
   "id": "c22-s61-u03-w014",
   "no": 14,
   "section": 1,
   "form": "order",
   "type": "T02",
   "topic": "관찰 순서",
   "prompt": "표본은 교사가 안전하게 준비했습니다. 관찰 흐름을 순서대로 쓰세요.",
   "answer": "ㄴ → ㄷ → ㄱ → ㄹ",
   "explanation": "표본과 낮은 배율을 먼저 확인하고 초점을 맞춰요. 보인 것을 그린 뒤 구조 이름과 대조해요.",
   "misconception": "관찰한 표본·배율·보이는 범위를 밝히고 안 보이는 구조를 그려 넣지 않아요.",
   "given": [
    "ㄱ 보인 모양과 불분명한 부분을 그린다.",
    "ㄴ 표본을 놓고 낮은 배율을 확인한다.",
    "ㄷ 교사 안내로 조명과 초점을 맞춘다.",
    "ㄹ 관찰 그림에 확인한 이름을 붙인다."
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "ordered-label-sequence",
    "sequence": [
     "ㄴ",
     "ㄷ",
     "ㄱ",
     "ㄹ"
    ]
   },
   "criteria": "「ㄴ → ㄷ → ㄱ → ㄹ」 또는 명시한 동등 표현. 표본과 낮은 배율을 먼저 확인하고 초점을 맞춰요. 보인 것을 그린 뒤 구조 이름과 대조해요."
  },
  {
   "id": "c22-s61-u03-w015",
   "no": 15,
   "section": 1,
   "form": "written",
   "type": "T02",
   "topic": "표본 차이",
   "prompt": "같은 양파 표피를 보아도 친구 그림과 내 그림이 달랐습니다. 누가 틀렸다고 바로 정하지 않고 확인할 점을 쓰세요.",
   "answer": "표본의 위치·두께, 배율과 초점·조명을 비교해요. 각각 실제 보인 범위를 확인한 뒤 같은 부분을 다시 관찰해요.",
   "explanation": "관찰 조건과 보인 범위가 다를 수 있으므로 그림의 비슷함만으로 정오를 정하지 않아요.",
   "misconception": "관찰한 표본·배율·보이는 범위를 밝히고 안 보이는 구조를 그려 넣지 않아요.",
   "requirements": [
    "표본 위치/상태 비교",
    "배율·조명·초점 중 조건 비교",
    "같은 부분을 실제로 재관찰"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "required": [
     "표본 위치/상태 비교",
     "배율·조명·초점 중 조건 비교",
     "같은 부분을 실제로 재관찰"
    ]
   },
   "lines": 8,
   "criteria": "표본 위치/상태 비교 / 배율·조명·초점 중 조건 비교 / 같은 부분을 실제로 재관찰"
  },
  {
   "id": "c22-s61-u03-w016",
   "no": 16,
   "section": 1,
   "form": "draw",
   "type": "T02",
   "topic": "내가 본 식물 세포",
   "prompt": "실제로 현미경으로 관찰한 식물 세포를 큰 칸에 그리고 표본 이름·배율·확인한 구조를 표시하세요. 아직 관찰하지 않았다면 교사와 실제 관찰을 먼저 하세요.",
   "answer": "실제로 보인 여러 세포의 모양을 크게 그리고 표본과 배율을 적어요. 확인한 구조에만 이름을 붙이고 불분명한 부분은 그대로 밝혀요.",
   "explanation": "정해진 모범 모양을 베끼는 과제가 아니에요. 실제 관찰이 없으면 관찰 완료로 처리하지 않고 준비된 표본을 실제로 보아요.",
   "misconception": "관찰한 표본·배율·보이는 범위를 밝히고 안 보이는 구조를 그려 넣지 않아요.",
   "requirements": [
    "실제 관찰에 근거한 큰 세포 그림",
    "표본과 배율 표시",
    "확인 구조 이름과 불분명한 부분 구별"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "required": [
     "실제 관찰에 근거한 큰 세포 그림",
     "표본과 배율 표시",
     "확인 구조 이름과 불분명한 부분 구별"
    ]
   },
   "lines": 0,
   "drawing": "large",
   "criteria": "실제 관찰에 근거한 큰 세포 그림 / 표본과 배율 표시 / 확인 구조 이름과 불분명한 부분 구별"
  },
  {
   "id": "c22-s61-u03-w017",
   "no": 17,
   "section": 2,
   "form": "choice",
   "type": "T03",
   "topic": "뿌리의 역할",
   "prompt": "흙에서 자라는 식물의 뿌리가 하는 일로 알맞은 것을 고르세요.",
   "answer": "② 물을 흡수하고 몸을 지지하는 데 도움을 준다.",
   "explanation": "뿌리는 흙 속의 물을 흡수하고 식물 몸을 지지하는 데 도움을 줘요. 꽃가루받이나 빛을 받아 양분을 만드는 역할과 구별해요.",
   "misconception": "뿌리는 물 흡수·몸 지지와 연결돼요. 먹는 부분은 식물마다 달라요.",
   "choices": [
    "줄기 위에서 잎을 직접 펼친다.",
    "물을 흡수하고 몸을 지지하는 데 도움을 준다.",
    "잎에서 만들 양분까지 흙에서 모두 흡수한다.",
    "잎 대신 언제나 모든 양분을 만든다.",
    "모든 식물에서 열매를 만든다."
   ],
   "key": 1,
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "single-choice",
    "answer": 1
   },
   "criteria": "「물을 흡수하고 몸을 지지하는 데 도움을 준다.」을 고른다. 뿌리는 흙 속의 물을 흡수하고 식물 몸을 지지하는 데 도움을 줘요. 꽃가루받이나 빛을 받아 양분을 만드는 역할과 구별해요."
  },
  {
   "id": "c22-s61-u03-w018",
   "no": 18,
   "section": 2,
   "form": "blank",
   "type": "T03",
   "topic": "물의 흡수 기관",
   "prompt": "흙에서 자라는 식물에서 물을 주로 흡수하는 기관은 [ ]예요.",
   "answer": "뿌리",
   "explanation": "흡수한 물은 줄기를 통해 다른 기관으로 이동해요. 뿌리와 줄기의 역할을 바꾸어 쓰지 않아요.",
   "misconception": "뿌리는 물 흡수·몸 지지와 연결돼요. 먹는 부분은 식물마다 달라요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "뿌리"
    ]
   },
   "criteria": "「뿌리」 또는 명시한 동등 표현. 흡수한 물은 줄기를 통해 다른 기관으로 이동해요. 뿌리와 줄기의 역할을 바꾸어 쓰지 않아요."
  },
  {
   "id": "c22-s61-u03-w019",
   "no": 19,
   "section": 2,
   "form": "short",
   "type": "T04",
   "topic": "물 감소 읽기",
   "prompt": "입구를 막아 직접 증발을 줄인 같은 용기에서 같은 시간 비교한 연습표입니다. 물이 더 많이 줄어든 장치의 기호를 쓰세요.",
   "answer": "가",
   "explanation": "가의 감소량은 40−29=11mL, 나는 40−36=4mL예요. 이번 비교 조건에서 물의 감소가 더 큰 쪽은 가예요.",
   "misconception": "뿌리 유무 외의 조건과 용기에서 직접 증발하는 물을 함께 확인해요.",
   "table": {
    "heads": [
     "장치",
     "뿌리",
     "처음 물(mL)",
     "나중 물(mL)"
    ],
    "rows": [
     [
      "가",
      "있음",
      40,
      29
     ],
     [
      "나",
      "제거",
      40,
      36
     ]
    ]
   },
   "model": {
    "kind": "max-water-loss",
    "names": [
     "가",
     "나"
    ],
    "before": [
     40,
     40
    ],
    "after": [
     29,
     36
    ],
    "answer": "가"
   },
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "가"
    ]
   },
   "criteria": "「가」 또는 명시한 동등 표현. 가의 감소량은 40−29=11mL, 나는 40−36=4mL예요. 이번 비교 조건에서 물의 감소가 더 큰 쪽은 가예요.",
   "dataNature": "provided-practice-data-not-student-measurement",
   "figure": "plant-question-data-19"
  },
  {
   "id": "c22-s61-u03-w020",
   "no": 20,
   "section": 2,
   "form": "multi",
   "type": "T04",
   "topic": "맞출 조건",
   "prompt": "뿌리 유무를 달리하여 물의 감소를 비교할 때 같게 맞출 조건을 모두 고르세요.",
   "answer": "①, ③, ⑤",
   "explanation": "뿌리 유무가 바뀐 조건이에요. 용기·물·시간·환경 등 다른 차이가 결과를 설명하지 않도록 맞춰요.",
   "misconception": "뿌리 유무 외의 조건과 용기에서 직접 증발하는 물을 함께 확인해요.",
   "choices": [
    "처음 물의 양과 용기",
    "한쪽만 비교 시간을 두 배로 하기",
    "빛과 온도 등 주변 환경",
    "뿌리가 없는 쪽에만 잎을 더 많이 남기기",
    "비교 시간과 잎의 상태"
   ],
   "key": [
    0,
    2,
    4
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     0,
     2,
     4
    ]
   },
   "criteria": "처음 물의 양과 용기 / 빛과 온도 등 주변 환경 / 비교 시간과 잎의 상태를 모두 고르고 다른 보기를 넣지 않는다."
  },
  {
   "id": "c22-s61-u03-w021",
   "no": 21,
   "section": 2,
   "form": "match",
   "type": "T03",
   "topic": "기관과 물",
   "prompt": "보기: ㄱ 뿌리 / ㄴ 줄기 / ㄷ 잎. 물과 관련된 역할을 연결하세요.",
   "answer": "(1) ㄴ (2) ㄷ (3) ㄱ",
   "explanation": "물은 뿌리에서 흡수되어 줄기를 지나 잎으로 이동하고 잎에서 수증기로 나갈 수 있어요. 역할은 연결되어 있어요.",
   "misconception": "뿌리는 물 흡수·몸 지지와 연결돼요. 먹는 부분은 식물마다 달라요.",
   "parts": [
    "(1) 흡수된 물이 다른 기관으로 가는 통로 [ ]",
    "(2) 물의 일부가 수증기로 나가는 주요 기관 [ ]",
    "(3) 흙 속의 물을 흡수하는 기관 [ ]"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "answerPerPart": true,
   "responseContract": {
    "kind": "ordered-label-parts",
    "answers": [
     "ㄴ",
     "ㄷ",
     "ㄱ"
    ]
   },
   "criteria": "「(1) ㄴ (2) ㄷ (3) ㄱ」 또는 명시한 동등 표현. 물은 뿌리에서 흡수되어 줄기를 지나 잎으로 이동하고 잎에서 수증기로 나갈 수 있어요. 역할은 연결되어 있어요."
  },
  {
   "id": "c22-s61-u03-w022",
   "no": 22,
   "section": 2,
   "form": "written",
   "type": "T04",
   "topic": "용기 입구의 차이",
   "prompt": "뿌리가 있는 장치만 입구를 막고 다른 장치는 열어 두었습니다. 이 비교를 고칠 방법과 까닭을 쓰세요.",
   "answer": "두 장치 입구를 같은 방법으로 막아 직접 증발의 차이를 줄여요. 열린 쪽의 물 감소에는 용기에서 직접 증발한 물도 섞여 뿌리 유무의 영향과 구별하기 어려워요.",
   "explanation": "물 감소가 모두 뿌리 흡수 때문이라고 가정하면 안 돼요. 비교하려는 조건 외의 차이를 줄여요.",
   "misconception": "뿌리 유무 외의 조건과 용기에서 직접 증발하는 물을 함께 확인해요.",
   "requirements": [
    "입구 처리 같게 하기",
    "직접 증발 지적",
    "뿌리 유무 영향과 구별"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "required": [
     "입구 처리 같게 하기",
     "직접 증발 지적",
     "뿌리 유무 영향과 구별"
    ]
   },
   "lines": 8,
   "criteria": "입구 처리 같게 하기 / 직접 증발 지적 / 뿌리 유무 영향과 구별"
  },
  {
   "id": "c22-s61-u03-w023",
   "no": 23,
   "section": 2,
   "form": "choice",
   "type": "T03",
   "topic": "저장하는 부분",
   "prompt": "당근과 감자를 비교한 설명으로 알맞은 것을 고르세요.",
   "answer": "④ 당근은 뿌리, 감자는 줄기에 양분을 저장한 예다.",
   "explanation": "당근의 먹는 부분은 양분을 저장한 뿌리이고 감자는 줄기예요. 땅속에 있다는 사실만으로 모두 뿌리라고 정하지 않아요.",
   "misconception": "뿌리는 물 흡수·몸 지지와 연결돼요. 먹는 부분은 식물마다 달라요.",
   "choices": [
    "감자의 먹는 부분은 열매다.",
    "당근과 감자는 모두 꽃잎이다.",
    "양분 저장은 잎에서만 가능하다.",
    "당근은 뿌리, 감자는 줄기에 양분을 저장한 예다.",
    "당근과 감자는 모두 땅속이므로 먹는 부분도 뿌리다."
   ],
   "key": 3,
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "single-choice",
    "answer": 3
   },
   "criteria": "「당근은 뿌리, 감자는 줄기에 양분을 저장한 예다.」을 고른다. 당근의 먹는 부분은 양분을 저장한 뿌리이고 감자는 줄기예요. 땅속에 있다는 사실만으로 모두 뿌리라고 정하지 않아요."
  },
  {
   "id": "c22-s61-u03-w024",
   "no": 24,
   "section": 2,
   "form": "blank",
   "type": "T03",
   "topic": "땅속이라는 단서",
   "prompt": "땅속에 있다고 해서 모두 뿌리는 아니에요. 감자의 먹는 부분은 [ ]예요.",
   "answer": "줄기",
   "explanation": "감자는 양분을 저장하는 땅속줄기의 예예요. 위치 하나만으로 기관을 정하지 않아요.",
   "misconception": "뿌리는 물 흡수·몸 지지와 연결돼요. 먹는 부분은 식물마다 달라요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "줄기"
    ]
   },
   "criteria": "「줄기」 또는 명시한 동등 표현. 감자는 양분을 저장하는 땅속줄기의 예예요. 위치 하나만으로 기관을 정하지 않아요."
  },
  {
   "id": "c22-s61-u03-w025",
   "no": 25,
   "section": 2,
   "form": "short",
   "type": "T04",
   "topic": "나중 양과 감소량",
   "prompt": "가에는 50mL에서 41mL, 나에는 60mL에서 54mL가 남았습니다. 더 많이 줄어든 쪽의 기호를 쓰세요.",
   "answer": "가",
   "explanation": "가는 9mL, 나는 6mL 줄었어요. 나중 물의 양만 보지 않고 각자의 처음 값에서 나중 값을 빼요. 이 표만으로 공정한 뿌리 실험이라고 확정하지는 않아요.",
   "misconception": "뿌리 유무 외의 조건과 용기에서 직접 증발하는 물을 함께 확인해요.",
   "table": {
    "heads": [
     "장치",
     "처음(mL)",
     "나중(mL)"
    ],
    "rows": [
     [
      "가",
      50,
      41
     ],
     [
      "나",
      60,
      54
     ]
    ]
   },
   "model": {
    "kind": "max-water-loss",
    "names": [
     "가",
     "나"
    ],
    "before": [
     50,
     60
    ],
    "after": [
     41,
     54
    ],
    "answer": "가"
   },
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "가"
    ]
   },
   "criteria": "「가」 또는 명시한 동등 표현. 가는 9mL, 나는 6mL 줄었어요. 나중 물의 양만 보지 않고 각자의 처음 값에서 나중 값을 빼요. 이 표만으로 공정한 뿌리 실험이라고 확정하지는 않아요.",
   "dataNature": "provided-practice-data-not-student-measurement",
   "figure": "plant-question-data-25"
  },
  {
   "id": "c22-s61-u03-w026",
   "no": 26,
   "section": 2,
   "form": "multi",
   "type": "T03",
   "topic": "관찰에서 말할 범위",
   "prompt": "뿌리의 구조·기능에 관해 타당한 설명을 모두 고르세요.",
   "answer": "③, ⑤",
   "explanation": "특정 저장 기관의 예와 뿌리의 일반 역할을 구별해요. 모양 하나나 땅속 위치 하나로 모든 기관을 정하지 않아요.",
   "misconception": "뿌리는 물 흡수·몸 지지와 연결돼요. 먹는 부분은 식물마다 달라요.",
   "choices": [
    "뿌리는 빛이 없어도 모든 양분을 직접 만든다.",
    "모든 뿌리는 당근처럼 굵다.",
    "뿌리는 식물 몸을 지지하는 데 도움을 준다.",
    "땅속에서 발견한 부분은 언제나 뿌리다.",
    "당근의 뿌리는 양분을 저장한 예다."
   ],
   "key": [
    2,
    4
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     2,
     4
    ]
   },
   "criteria": "뿌리는 식물 몸을 지지하는 데 도움을 준다. / 당근의 뿌리는 양분을 저장한 예다.를 모두 고르고 다른 보기를 넣지 않는다."
  },
  {
   "id": "c22-s61-u03-w027",
   "no": 27,
   "section": 2,
   "form": "written",
   "type": "T04",
   "topic": "절단의 영향",
   "prompt": "뿌리를 제거한 식물과 그대로 둔 식물을 비교했습니다. 뿌리 제거 과정에서 생긴 상처도 고려해야 하는 까닭을 쓰세요.",
   "answer": "잘라 낸 쪽에는 뿌리 유무뿐 아니라 상처와 손상 영향이 생길 수 있어요. 같은 준비 방법과 표본 상태를 확인하고 관찰 결과를 이 비교의 범위에서 해석해요.",
   "explanation": "비교 실험이 식물의 모든 기능을 완벽히 분리하는 것은 아니에요. 준비 과정의 한계도 근거에 포함해요.",
   "misconception": "뿌리 유무 외의 조건과 용기에서 직접 증발하는 물을 함께 확인해요.",
   "requirements": [
    "뿌리 유무와 손상 영향 구별",
    "준비 방법/상태 확인",
    "이 조건의 결과로 범위 한정"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "required": [
     "뿌리 유무와 손상 영향 구별",
     "준비 방법/상태 확인",
     "이 조건의 결과로 범위 한정"
    ]
   },
   "lines": 8,
   "criteria": "뿌리 유무와 손상 영향 구별 / 준비 방법/상태 확인 / 이 조건의 결과로 범위 한정"
  },
  {
   "id": "c22-s61-u03-w028",
   "no": 28,
   "section": 2,
   "form": "written",
   "type": "T03",
   "topic": "한 기관의 여러 역할",
   "prompt": "“뿌리는 물만 빨아들이니 식물 몸을 지지하는 것과 관계없다”는 말을 고쳐 쓰세요.",
   "answer": "뿌리는 물을 흡수하고 식물 몸을 지지하는 데도 도움을 줘요. 당근처럼 양분을 저장하는 예도 있어 한 기관에 여러 역할이 있을 수 있어요.",
   "explanation": "한 역할을 배웠다고 다른 타당한 역할을 부정하지 않아요. 특정 저장 예를 모든 뿌리의 굵은 모습으로 넓히지도 않아요.",
   "misconception": "뿌리는 물 흡수·몸 지지와 연결돼요. 먹는 부분은 식물마다 달라요.",
   "requirements": [
    "물 흡수 인정",
    "몸 지지 역할 인정",
    "여러 역할 또는 적절한 저장 예"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "required": [
     "물 흡수 인정",
     "몸 지지 역할 인정",
     "여러 역할 또는 적절한 저장 예"
    ]
   },
   "lines": 8,
   "criteria": "물 흡수 인정 / 몸 지지 역할 인정 / 여러 역할 또는 적절한 저장 예"
  },
  {
   "id": "c22-s61-u03-w029",
   "no": 29,
   "section": 2,
   "form": "choice",
   "type": "T04",
   "topic": "결론의 범위",
   "prompt": "같은 조건의 뿌리 비교에서 뿌리가 있는 쪽의 물 감소가 더 컸습니다. 알맞은 결론을 고르세요.",
   "answer": "② 이번 조건에서 뿌리의 물 흡수 역할을 뒷받침한다.",
   "explanation": "비교한 조건에서 뿌리의 물 흡수 역할을 뒷받침해요. 모든 식물이 모든 때 같은 양을 흡수한다는 뜻은 아니에요.",
   "misconception": "뿌리 유무 외의 조건과 용기에서 직접 증발하는 물을 함께 확인해요.",
   "choices": [
    "뿌리에서 빛으로 양분을 만드는 것을 증명한다.",
    "이번 조건에서 뿌리의 물 흡수 역할을 뒷받침한다.",
    "모든 물 감소는 언제나 뿌리 때문임을 증명한다.",
    "모든 식물이 하루에 같은 양의 물을 흡수한다.",
    "뿌리가 없으면 어떤 조건에서도 물은 줄지 않는다."
   ],
   "key": 1,
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "single-choice",
    "answer": 1
   },
   "criteria": "「이번 조건에서 뿌리의 물 흡수 역할을 뒷받침한다.」을 고른다. 비교한 조건에서 뿌리의 물 흡수 역할을 뒷받침해요. 모든 식물이 모든 때 같은 양을 흡수한다는 뜻은 아니에요."
  },
  {
   "id": "c22-s61-u03-w030",
   "no": 30,
   "section": 2,
   "form": "order",
   "type": "T04",
   "topic": "비교 계획의 순서",
   "prompt": "뿌리 유무 비교의 계획과 관찰 흐름을 순서대로 쓰세요.",
   "answer": "ㄷ → ㄱ → ㄹ → ㄴ",
   "explanation": "먼저 무엇을 비교할지 정한 뒤 다른 조건을 맞춰요. 처음 값을 남기고 같은 시간 뒤의 값을 읽어 차이를 계산해요.",
   "misconception": "뿌리 유무 외의 조건과 용기에서 직접 증발하는 물을 함께 확인해요.",
   "given": [
    "ㄱ 용기·물·잎·환경·입구 처리를 맞춘다.",
    "ㄴ 같은 시간 뒤 물의 양과 차이를 비교한다.",
    "ㄷ 뿌리 유무에 따른 물 감소를 비교하기로 한다.",
    "ㄹ 준비한 장치의 처음 물의 양을 남긴다."
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "ordered-label-sequence",
    "sequence": [
     "ㄷ",
     "ㄱ",
     "ㄹ",
     "ㄴ"
    ]
   },
   "criteria": "「ㄷ → ㄱ → ㄹ → ㄴ」 또는 명시한 동등 표현. 먼저 무엇을 비교할지 정한 뒤 다른 조건을 맞춰요. 처음 값을 남기고 같은 시간 뒤의 값을 읽어 차이를 계산해요."
  },
  {
   "id": "c22-s61-u03-w031",
   "no": 31,
   "section": 2,
   "form": "written",
   "type": "T04",
   "topic": "숫자만 같은 자료",
   "prompt": "두 장치 물의 감소량이 같았습니다. “뿌리는 물을 흡수하지 않는다”라고 결론 낸 설명을 검토하세요.",
   "answer": "이번에는 차이를 확인하지 못했다고 해요. 시간·표본 상태·입구 처리와 읽기 어려움을 확인한 뒤 반복해요. 한 번의 같은 값만으로 뿌리 흡수 기능 전체를 부정하지 않아요.",
   "explanation": "관찰 차이가 없다는 결과와 기능이 없다는 보편적 주장은 달라요. 실제 값을 지우거나 원하는 값으로 바꾸지 않아요.",
   "misconception": "뿌리 유무 외의 조건과 용기에서 직접 증발하는 물을 함께 확인해요.",
   "requirements": [
    "차이 미확인이라고 표현",
    "구체적인 조건/반복 확인",
    "기능 전체 부정 또는 값 조작을 피함"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "required": [
     "차이 미확인이라고 표현",
     "구체적인 조건/반복 확인",
     "기능 전체 부정 또는 값 조작을 피함"
    ]
   },
   "lines": 8,
   "criteria": "차이 미확인이라고 표현 / 구체적인 조건/반복 확인 / 기능 전체 부정 또는 값 조작을 피함"
  },
  {
   "id": "c22-s61-u03-w032",
   "no": 32,
   "section": 2,
   "form": "draw",
   "type": "T04",
   "topic": "뿌리 비교 장치",
   "prompt": "뿌리 유무만 달리한 두 장치의 배치를 그리세요. 처음 물의 높이, 같은 입구 처리, 같은 시간·환경을 표시하고 나중 값은 비워 두세요.",
   "answer": "뿌리 있는 장치/제거 장치에 같은 물·용기·입구 처리와 잎 상태를 표시해요. 처음 눈금과 비교 시간, 빈 나중 값 칸을 둬요.",
   "explanation": "실험 전 계획 그림이에요. 실제 관찰 전의 결과를 그려 넣지 않고 준비/절단은 교사가 맡아요.",
   "misconception": "뿌리 유무 외의 조건과 용기에서 직접 증발하는 물을 함께 확인해요.",
   "requirements": [
    "뿌리 유무 차이",
    "물·용기·입구/잎/환경 중 통제 표시",
    "시간·처음 눈금/빈 결과 자리"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "required": [
     "뿌리 유무 차이",
     "물·용기·입구/잎/환경 중 통제 표시",
     "시간·처음 눈금/빈 결과 자리"
    ]
   },
   "lines": 0,
   "drawing": "large",
   "criteria": "뿌리 유무 차이 / 물·용기·입구/잎/환경 중 통제 표시 / 시간·처음 눈금/빈 결과 자리"
  },
  {
   "id": "c22-s61-u03-w033",
   "no": 33,
   "section": 3,
   "form": "choice",
   "type": "T05",
   "topic": "줄기와 잎",
   "prompt": "줄기가 식물에서 하는 일을 고르세요.",
   "answer": "⑤ 잎 등을 지지하고 물 이동의 통로가 된다.",
   "explanation": "줄기는 잎과 꽃 등을 지지하고 물이 다른 기관으로 이동하는 통로가 돼요. 줄기의 생김새는 식물마다 달라요.",
   "misconception": "줄기의 지지·물 이동·저장 역할을 생김새와 근거로 연결해요.",
   "choices": [
    "모든 식물에서 씨를 직접 만든다.",
    "흙 속의 물을 잎 대신 모두 흡수한다.",
    "언제나 꽃가루를 만든다.",
    "살아 있는 줄기에서는 기체 교환이 전혀 없다.",
    "잎 등을 지지하고 물 이동의 통로가 된다."
   ],
   "key": 4,
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "single-choice",
    "answer": 4
   },
   "criteria": "「잎 등을 지지하고 물 이동의 통로가 된다.」을 고른다. 줄기는 잎과 꽃 등을 지지하고 물이 다른 기관으로 이동하는 통로가 돼요. 줄기의 생김새는 식물마다 달라요."
  },
  {
   "id": "c22-s61-u03-w034",
   "no": 34,
   "section": 3,
   "form": "blank",
   "type": "T06",
   "topic": "기관 사이의 통로",
   "prompt": "뿌리에서 흡수한 물이 잎으로 가는 길에서 [ ]를 지나가요.",
   "answer": "줄기",
   "explanation": "뿌리·줄기·잎이 물의 이동으로 연결돼요. 기관 이름을 따로 외우는 데서 끝내지 않아요.",
   "misconception": "색소가 나타난 위치는 물의 이동 경로를 알아보는 근거예요. 모든 물질의 이동을 증명하지는 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "줄기"
    ]
   },
   "criteria": "「줄기」 또는 명시한 동등 표현. 뿌리·줄기·잎이 물의 이동으로 연결돼요. 기관 이름을 따로 외우는 데서 끝내지 않아요."
  },
  {
   "id": "c22-s61-u03-w035",
   "no": 35,
   "section": 3,
   "form": "short",
   "type": "T06",
   "topic": "붉은색의 근거",
   "prompt": "교사가 준비한 줄기를 붉은 색소 물에 둔 뒤 가로 단면 일부에 붉은 점들이 보였습니다. 이 장면에서 이동을 알아보려는 것은 무엇인가요?",
   "answer": "물",
   "explanation": "색소가 섞인 물의 색을 단서로 줄기에서 물이 지나간 부분을 알아봐요. 모든 양분이나 꽃가루가 같은 길로 이동했다는 증거는 아니에요.",
   "misconception": "색소가 나타난 위치는 물의 이동 경로를 알아보는 근거예요. 모든 물질의 이동을 증명하지는 않아요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "물"
    ]
   },
   "criteria": "「물」 또는 명시한 동등 표현. 색소가 섞인 물의 색을 단서로 줄기에서 물이 지나간 부분을 알아봐요. 모든 양분이나 꽃가루가 같은 길로 이동했다는 증거는 아니에요."
  },
  {
   "id": "c22-s61-u03-w036",
   "no": 36,
   "section": 3,
   "form": "multi",
   "type": "T06",
   "topic": "단면 관찰의 근거",
   "prompt": "색소 물 실험에서 확인할 자료를 모두 고르세요.",
   "answer": "①, ②, ④",
   "explanation": "전후 색과 절단 방향·색 위치를 함께 읽어요. 학생이 칼로 잘라야 하는 과제가 아니며 식물 전체가 같은 색으로 바뀌어야 하는 것도 아니에요.",
   "misconception": "색소가 나타난 위치는 물의 이동 경로를 알아보는 근거예요. 모든 물질의 이동을 증명하지는 않아요.",
   "choices": [
    "색소 물에 둔 시간과 비교 표본",
    "넣기 전 줄기의 색",
    "학생이 직접 칼로 단면을 자르는 속도",
    "교사가 준비한 가로/세로 단면의 색 위치",
    "식물이 예쁜 정도"
   ],
   "key": [
    0,
    1,
    3
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     0,
     1,
     3
    ]
   },
   "criteria": "색소 물에 둔 시간과 비교 표본 / 넣기 전 줄기의 색 / 교사가 준비한 가로/세로 단면의 색 위치를 모두 고르고 다른 보기를 넣지 않는다."
  },
  {
   "id": "c22-s61-u03-w037",
   "no": 37,
   "section": 3,
   "form": "match",
   "type": "T06",
   "topic": "자른 방향과 단서",
   "prompt": "보기: ㄱ 가로 단면 / ㄴ 세로 단면 / ㄷ 절단 전 비교 표본. 연결하세요.",
   "answer": "(1) ㄴ (2) ㄷ (3) ㄱ",
   "explanation": "가로로 자르면 통로 위치가 점처럼, 길게 자르면 길 방향으로 이어진 모습을 볼 수 있어요. 실제 관찰과 비교한 범위에서 설명해요.",
   "misconception": "색소가 나타난 위치는 물의 이동 경로를 알아보는 근거예요. 모든 물질의 이동을 증명하지는 않아요.",
   "parts": [
    "(1) 길게 이어진 색소 물의 자취를 관찰 [ ]",
    "(2) 원래 붉은색이었는지 확인 [ ]",
    "(3) 줄기 둘레 방향의 색 위치를 비교 [ ]"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "answerPerPart": true,
   "responseContract": {
    "kind": "ordered-label-parts",
    "answers": [
     "ㄴ",
     "ㄷ",
     "ㄱ"
    ]
   },
   "criteria": "「(1) ㄴ (2) ㄷ (3) ㄱ」 또는 명시한 동등 표현. 가로로 자르면 통로 위치가 점처럼, 길게 자르면 길 방향으로 이어진 모습을 볼 수 있어요. 실제 관찰과 비교한 범위에서 설명해요."
  },
  {
   "id": "c22-s61-u03-w038",
   "no": 38,
   "section": 3,
   "form": "written",
   "type": "T06",
   "topic": "겉만 묻은 색",
   "prompt": "줄기 겉면에 색소 물을 흘렸습니다. 겉이 붉다는 사실만으로 줄기 안의 물 이동을 말하기 어려운 까닭과 보완 방법을 쓰세요.",
   "answer": "겉에 묻은 색일 수 있어 내부 통로로 이동한 색과 구별하기 어려워요. 교사가 겉을 정리해 준비한 단면과 넣기 전 표본의 색을 비교해요.",
   "explanation": "관찰 위치가 주장을 뒷받침해야 해요. 겉의 착색과 내부의 이동 경로는 같은 근거가 아니에요.",
   "misconception": "색소가 나타난 위치는 물의 이동 경로를 알아보는 근거예요. 모든 물질의 이동을 증명하지는 않아요.",
   "requirements": [
    "겉의 착색 가능성",
    "내부 단면 비교",
    "처리 전 또는 대조 표본 확인"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "required": [
     "겉의 착색 가능성",
     "내부 단면 비교",
     "처리 전 또는 대조 표본 확인"
    ]
   },
   "lines": 8,
   "criteria": "겉의 착색 가능성 / 내부 단면 비교 / 처리 전 또는 대조 표본 확인"
  },
  {
   "id": "c22-s61-u03-w039",
   "no": 39,
   "section": 3,
   "form": "choice",
   "type": "T06",
   "topic": "단면 해석",
   "prompt": "가로 단면에는 붉은 점들이, 세로 단면에는 길게 이어진 붉은 부분이 보였습니다. 이를 연결한 설명을 고르세요.",
   "answer": "① 줄기 안에서 물이 지나가는 부분을 다른 방향으로 본 근거다.",
   "explanation": "서로 다른 방향의 단면에서 같은 물 이동 통로의 위치와 길 방향을 살펴볼 수 있어요. 색이 보인 부분과 잘라 본 방향을 함께 읽어요.",
   "misconception": "색소가 나타난 위치는 물의 이동 경로를 알아보는 근거예요. 모든 물질의 이동을 증명하지는 않아요.",
   "choices": [
    "줄기 안에서 물이 지나가는 부분을 다른 방향으로 본 근거다.",
    "가로와 세로 그림의 자취 모양이 다르므로 서로 다른 물질을 검출한 것이다.",
    "모든 줄기 세포가 언제나 붉다는 증거다.",
    "꽃가루가 뿌리로 이동한 증거다.",
    "줄기 바깥에서만 물이 이동한다는 증거다."
   ],
   "key": 0,
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "single-choice",
    "answer": 0
   },
   "criteria": "「줄기 안에서 물이 지나가는 부분을 다른 방향으로 본 근거다.」을 고른다. 서로 다른 방향의 단면에서 같은 물 이동 통로의 위치와 길 방향을 살펴볼 수 있어요. 색이 보인 부분과 잘라 본 방향을 함께 읽어요."
  },
  {
   "id": "c22-s61-u03-w040",
   "no": 40,
   "section": 3,
   "form": "blank",
   "type": "T05",
   "topic": "지지하는 역할",
   "prompt": "줄기는 잎과 꽃이 펼쳐지도록 식물 몸을 [ ]하는 역할도 해요.",
   "answer": "지지",
   "explanation": "물 이동과 몸 지지는 함께 가능한 줄기의 역할이에요. 한 역할만 한다고 제한하지 않아요.",
   "misconception": "줄기의 지지·물 이동·저장 역할을 생김새와 근거로 연결해요.",
   "accepted": [
    "지탱"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "지지",
     "지탱"
    ]
   },
   "criteria": "「지지」 또는 명시한 동등 표현. 물 이동과 몸 지지는 함께 가능한 줄기의 역할이에요. 한 역할만 한다고 제한하지 않아요."
  },
  {
   "id": "c22-s61-u03-w041",
   "no": 41,
   "section": 3,
   "form": "short",
   "type": "T06",
   "topic": "연습 기록의 읽기",
   "prompt": "같은 색소 물·시간의 연습 관찰표에서 붉은 부분이 확인된 표본의 기호를 쓰세요.",
   "answer": "가",
   "explanation": "가에는 내부 붉은 자취가 관찰되었고 나는 불분명해요. 불분명을 이동이 없었다는 확정으로 바꾸지 않아요.",
   "misconception": "색소가 나타난 위치는 물의 이동 경로를 알아보는 근거예요. 모든 물질의 이동을 증명하지는 않아요.",
   "table": {
    "heads": [
     "표본",
     "교사 준비 단면 관찰"
    ],
    "rows": [
     [
      "가",
      "내부에 붉은 자취가 보임"
     ],
     [
      "나",
      "구별하기 어려움"
     ]
    ]
   },
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "가"
    ]
   },
   "criteria": "「가」 또는 명시한 동등 표현. 가에는 내부 붉은 자취가 관찰되었고 나는 불분명해요. 불분명을 이동이 없었다는 확정으로 바꾸지 않아요.",
   "dataNature": "provided-practice-data-not-student-measurement",
   "figure": "plant-question-data-41"
  },
  {
   "id": "c22-s61-u03-w042",
   "no": 42,
   "section": 3,
   "form": "multi",
   "type": "T05",
   "topic": "줄기의 여러 기능",
   "prompt": "줄기에 대한 타당한 설명을 모두 고르세요.",
   "answer": "①, ④",
   "explanation": "줄기는 지지·물 이동과 연결되고 감자처럼 양분을 저장하는 예도 있어요. 살아 있는 줄기 세포의 호흡을 부정하지 않아요.",
   "misconception": "줄기의 지지·물 이동·저장 역할을 생김새와 근거로 연결해요.",
   "choices": [
    "줄기는 잎 등을 지지하고 물의 이동을 돕는다.",
    "줄기에서 모든 식물의 씨가 만들어진다.",
    "모든 줄기는 굵은 나무줄기다.",
    "감자는 양분을 저장하는 줄기의 예다.",
    "줄기는 살아 있어도 호흡과 전혀 관계없다."
   ],
   "key": [
    0,
    3
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     0,
     3
    ]
   },
   "criteria": "줄기는 잎 등을 지지하고 물의 이동을 돕는다. / 감자는 양분을 저장하는 줄기의 예다.를 모두 고르고 다른 보기를 넣지 않는다."
  },
  {
   "id": "c22-s61-u03-w043",
   "no": 43,
   "section": 3,
   "form": "written",
   "type": "T06",
   "topic": "색소가 없을 때",
   "prompt": "예상과 달리 붉은 자취를 찾지 못했습니다. 결과를 남기고 다시 확인할 점 두 가지를 제안하세요.",
   "answer": "붉은 자취를 확인하지 못했다고 남겨요. 충분한 시간·표본 상태와 관찰할 단면 위치/조명을 교사와 확인해요. 예상 그림으로 결과를 채우지 않아요.",
   "explanation": "색의 검출 실패는 물 이동 전체의 부재를 바로 증명하지 않아요. 실제 보인 상태와 재확인 계획을 구별해요.",
   "misconception": "색소가 나타난 위치는 물의 이동 경로를 알아보는 근거예요. 모든 물질의 이동을 증명하지는 않아요.",
   "requirements": [
    "색 자취 미확인 상태 보존",
    "시간/표본 상태 확인",
    "관찰 위치/조명 확인 또는 값 꾸미기 배제"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "required": [
     "색 자취 미확인 상태 보존",
     "시간/표본 상태 확인",
     "관찰 위치/조명 확인 또는 값 꾸미기 배제"
    ]
   },
   "lines": 8,
   "criteria": "색 자취 미확인 상태 보존 / 시간/표본 상태 확인 / 관찰 위치/조명 확인 또는 값 꾸미기 배제"
  },
  {
   "id": "c22-s61-u03-w044",
   "no": 44,
   "section": 3,
   "form": "written",
   "type": "T05",
   "topic": "지지와 통로 연결",
   "prompt": "잎을 지지하는 줄기의 역할과 물을 이동시키는 역할이 식물에 함께 필요한 까닭을 설명하세요.",
   "answer": "줄기가 잎을 펼쳐 지지하면 잎이 빛을 받을 수 있어요. 뿌리에서 온 물이 줄기를 지나 잎에 가서 잎의 활동에 쓰여요.",
   "explanation": "기관의 역할은 따로 존재하는 목록이 아니라 잎이 빛과 물을 이용하는 과정에서 연결돼요.",
   "misconception": "줄기의 지지·물 이동·저장 역할을 생김새와 근거로 연결해요.",
   "requirements": [
    "잎 지지와 빛 받기",
    "줄기를 통한 물 이동",
    "뿌리/잎과의 관계"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "required": [
     "잎 지지와 빛 받기",
     "줄기를 통한 물 이동",
     "뿌리/잎과의 관계"
    ]
   },
   "lines": 8,
   "criteria": "잎 지지와 빛 받기 / 줄기를 통한 물 이동 / 뿌리/잎과의 관계"
  },
  {
   "id": "c22-s61-u03-w045",
   "no": 45,
   "section": 3,
   "form": "choice",
   "type": "T06",
   "topic": "관찰 뒤의 주장",
   "prompt": "색소 물 실험 뒤 확인한 범위를 넘지 않는 설명을 고르세요.",
   "answer": "③ 이번 조건에서 줄기 내부의 물 이동 자취를 확인했다.",
   "explanation": "이번 장치에서 물이 지나간 자취를 설명할 수 있어요. 식물의 모든 종류·시각·물질에 같은 결론을 적용하지 않아요.",
   "misconception": "색소가 나타난 위치는 물의 이동 경로를 알아보는 근거예요. 모든 물질의 이동을 증명하지는 않아요.",
   "choices": [
    "붉은 부분에서만 살아 있는 세포가 존재한다.",
    "물이 뿌리를 거치지 않고 생겨났음을 증명했다.",
    "이번 조건에서 줄기 내부의 물 이동 자취를 확인했다.",
    "물 이동을 추적한 색이므로 모든 양분의 이동 경로와 방향도 같다고 확인했다.",
    "모든 식물 줄기의 통로 배열이 똑같다."
   ],
   "key": 2,
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "single-choice",
    "answer": 2
   },
   "criteria": "「이번 조건에서 줄기 내부의 물 이동 자취를 확인했다.」을 고른다. 이번 장치에서 물이 지나간 자취를 설명할 수 있어요. 식물의 모든 종류·시각·물질에 같은 결론을 적용하지 않아요."
  },
  {
   "id": "c22-s61-u03-w046",
   "no": 46,
   "section": 3,
   "form": "order",
   "type": "T06",
   "topic": "색소 물 관찰 흐름",
   "prompt": "절단은 교사가 맡습니다. 관찰 흐름을 순서대로 쓰세요.",
   "answer": "ㄱ → ㄹ → ㄴ → ㄷ",
   "explanation": "처리 전 상태를 본 뒤 색소 물에 두고, 교사가 준비한 단면을 관찰해 이전 모습과 비교해요.",
   "misconception": "색소가 나타난 위치는 물의 이동 경로를 알아보는 근거예요. 모든 물질의 이동을 증명하지는 않아요.",
   "given": [
    "ㄱ 넣기 전 줄기와 잎의 상태를 본다.",
    "ㄴ 교사가 준비한 단면에서 색 위치를 관찰한다.",
    "ㄷ 전후 상태와 단면 방향을 연결해 설명한다.",
    "ㄹ 준비된 줄기를 색소 물에 두고 정한 시간 기다린다."
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "ordered-label-sequence",
    "sequence": [
     "ㄱ",
     "ㄹ",
     "ㄴ",
     "ㄷ"
    ]
   },
   "criteria": "「ㄱ → ㄹ → ㄴ → ㄷ」 또는 명시한 동등 표현. 처리 전 상태를 본 뒤 색소 물에 두고, 교사가 준비한 단면을 관찰해 이전 모습과 비교해요."
  },
  {
   "id": "c22-s61-u03-w047",
   "no": 47,
   "section": 3,
   "form": "written",
   "type": "T06",
   "topic": "더 필요한 증거",
   "prompt": "친구가 “붉은 점이 있으니 줄기에서 양분도 물과 같은 방향으로만 간다”고 했습니다. 관찰로 말할 수 있는 것과 없는 것을 나누세요.",
   "answer": "색소 물의 자취로 이번 조건의 물 이동 부분을 알아볼 수 있어요. 이 실험은 양분의 이동 방향을 직접 확인한 것이 아니므로 같은 방향으로만 간다고 정할 수 없어요.",
   "explanation": "관찰 도구가 추적한 대상은 색소 물이에요. 다른 물질의 이동까지 자동으로 증명되지는 않아요.",
   "misconception": "색소가 나타난 위치는 물의 이동 경로를 알아보는 근거예요. 모든 물질의 이동을 증명하지는 않아요.",
   "requirements": [
    "색소 물 이동의 근거 인정",
    "양분 이동을 직접 측정하지 않음",
    "방향을 보편화하지 않음"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "required": [
     "색소 물 이동의 근거 인정",
     "양분 이동을 직접 측정하지 않음",
     "방향을 보편화하지 않음"
    ]
   },
   "lines": 8,
   "criteria": "색소 물 이동의 근거 인정 / 양분 이동을 직접 측정하지 않음 / 방향을 보편화하지 않음"
  },
  {
   "id": "c22-s61-u03-w048",
   "no": 48,
   "section": 3,
   "form": "draw",
   "type": "T06",
   "topic": "관찰 자취를 두 방향으로",
   "prompt": "제공된 연습 관찰: 줄기 가로 단면의 일부에 붉은 점들이 있고 세로 단면에는 길게 이어진 붉은 자취가 있습니다. 두 방향의 단면을 나란히 그리고 물의 이동 근거를 이름표로 설명하세요.",
   "answer": "가로로 자른 면에는 일부 위치의 붉은 점을, 세로로 자른 면에는 길 방향으로 이어진 자취를 그려요. 각각 절단 방향과 색소 물이 지나간 부분이라는 이름표를 붙여요.",
   "explanation": "제공된 연습 관찰을 그림으로 옮기는 과제예요. 내 실제 관찰로 표시하지 않고 모든 단면 전체를 붉게 채우지도 않아요.",
   "misconception": "색소가 나타난 위치는 물의 이동 경로를 알아보는 근거예요. 모든 물질의 이동을 증명하지는 않아요.",
   "requirements": [
    "가로/세로 단면 방향 구별",
    "일부 점과 길게 이어진 자취의 대응",
    "색소 물 이동 이름표와 제공 자료 구분"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "required": [
     "가로/세로 단면 방향 구별",
     "일부 점과 길게 이어진 자취의 대응",
     "색소 물 이동 이름표와 제공 자료 구분"
    ]
   },
   "lines": 0,
   "drawing": "large",
   "criteria": "가로/세로 단면 방향 구별 / 일부 점과 길게 이어진 자취의 대응 / 색소 물 이동 이름표와 제공 자료 구분"
  },
  {
   "id": "c22-s61-u03-w049",
   "no": 49,
   "section": 4,
   "form": "choice",
   "type": "T07",
   "topic": "잎의 구조와 빛",
   "prompt": "넓게 펼쳐진 잎의 생김새와 양분 만들기의 관계를 고르세요.",
   "answer": "④ 빛을 받는 데 도움이 된다.",
   "explanation": "잎이 넓게 펼쳐지면 빛을 받는 데 도움이 돼요. 모든 잎이 같은 모양이거나 잎이 뿌리 대신 흙 속 물을 흡수한다는 뜻은 아니에요.",
   "misconception": "광합성에 필요한 물·이산화 탄소와 빛을 구별하고 양분 생성과 연결해요.",
   "choices": [
    "꽃가루를 만드는 유일한 기관이 된다.",
    "어떤 식물이든 물이 필요 없어진다.",
    "잎 모양이 모두 똑같아진다.",
    "빛을 받는 데 도움이 된다.",
    "흙 속 물을 뿌리 대신 모두 흡수한다."
   ],
   "key": 3,
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "single-choice",
    "answer": 3
   },
   "criteria": "「빛을 받는 데 도움이 된다.」을 고른다. 잎이 넓게 펼쳐지면 빛을 받는 데 도움이 돼요. 모든 잎이 같은 모양이거나 잎이 뿌리 대신 흙 속 물을 흡수한다는 뜻은 아니에요."
  },
  {
   "id": "c22-s61-u03-w050",
   "no": 50,
   "section": 4,
   "form": "blank",
   "type": "T07",
   "topic": "양분 생성의 이름",
   "prompt": "식물이 빛을 이용해 스스로 양분을 만드는 작용을 [ ]이라고 해요.",
   "answer": "광합성",
   "explanation": "물과 이산화 탄소를 이용하고 빛이 필요해요. 토양에서 완성된 양분을 모두 흡수하는 과정이라고 바꾸지 않아요.",
   "misconception": "광합성에 필요한 물·이산화 탄소와 빛을 구별하고 양분 생성과 연결해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "광합성"
    ]
   },
   "criteria": "「광합성」 또는 명시한 동등 표현. 물과 이산화 탄소를 이용하고 빛이 필요해요. 토양에서 완성된 양분을 모두 흡수하는 과정이라고 바꾸지 않아요."
  },
  {
   "id": "c22-s61-u03-w051",
   "no": 51,
   "section": 4,
   "form": "short",
   "type": "T08",
   "topic": "검출 색",
   "prompt": "교사가 처리한 잎에 아이오딘-아이오딘화 칼륨 용액을 떨어뜨렸습니다. 녹말이 검출될 때 나타나는 색을 쓰세요.",
   "answer": "청람색",
   "explanation": "녹말이 있으면 청람색으로 변하는 반응을 이용해요. 잎 자체의 초록색이나 색소 물 실험의 붉은색과 구별해요.",
   "misconception": "처리 전 녹말 상태와 처리 뒤 검출 결과가 있어야 빛의 영향을 해석해요.",
   "accepted": [
    "청남색",
    "푸른 검은색",
    "청흑색"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "청람색",
     "청남색",
     "푸른 검은색",
     "청흑색"
    ]
   },
   "criteria": "「청람색」 또는 명시한 동등 표현. 녹말이 있으면 청람색으로 변하는 반응을 이용해요. 잎 자체의 초록색이나 색소 물 실험의 붉은색과 구별해요."
  },
  {
   "id": "c22-s61-u03-w052",
   "no": 52,
   "section": 4,
   "form": "multi",
   "type": "T07",
   "topic": "필요한 재료와 조건",
   "prompt": "광합성과 관련된 설명으로 알맞은 것을 모두 고르세요.",
   "answer": "②, ③, ⑤",
   "explanation": "물과 이산화 탄소는 양분 생성에 이용되는 재료이고 빛이 필요해요. 산소를 재료로 사용한다거나 흙에서 완성된 양분을 모두 받는다고 하지 않아요.",
   "misconception": "광합성에 필요한 물·이산화 탄소와 빛을 구별하고 양분 생성과 연결해요.",
   "choices": [
    "흙이 모든 양분을 완성해 잎에 준다.",
    "빛이 필요하다.",
    "물이 필요하다.",
    "녹말을 재료로 받아야만 양분을 만든다.",
    "이산화 탄소를 이용한다."
   ],
   "key": [
    1,
    2,
    4
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     1,
     2,
     4
    ]
   },
   "criteria": "빛이 필요하다. / 물이 필요하다. / 이산화 탄소를 이용한다.를 모두 고르고 다른 보기를 넣지 않는다."
  },
  {
   "id": "c22-s61-u03-w053",
   "no": 53,
   "section": 4,
   "form": "match",
   "type": "T08",
   "topic": "검출 실험의 자료",
   "prompt": "보기: ㄱ 처리 전 비교 확인 / ㄴ 빛을 받은 뒤 확인 / ㄷ 빛을 가린 뒤 확인. 설명과 연결하세요.",
   "answer": "(1) ㄴ (2) ㄱ (3) ㄷ",
   "explanation": "처리 전 녹말 상태와 빛을 달리한 뒤의 검출 결과를 구별해 읽어야 해요. 이전부터 있던 녹말의 영향을 확인해요.",
   "misconception": "처리 전 녹말 상태와 처리 뒤 검출 결과가 있어야 빛의 영향을 해석해요.",
   "parts": [
    "(1) 빛을 준 시료의 반응을 확인 [ ]",
    "(2) 시작할 때 녹말이 검출되는지 확인 [ ]",
    "(3) 같은 기간 어둡게 둔 시료의 반응을 확인 [ ]"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "answerPerPart": true,
   "responseContract": {
    "kind": "ordered-label-parts",
    "answers": [
     "ㄴ",
     "ㄱ",
     "ㄷ"
    ]
   },
   "criteria": "「(1) ㄴ (2) ㄱ (3) ㄷ」 또는 명시한 동등 표현. 처리 전 녹말 상태와 빛을 달리한 뒤의 검출 결과를 구별해 읽어야 해요. 이전부터 있던 녹말의 영향을 확인해요."
  },
  {
   "id": "c22-s61-u03-w054",
   "no": 54,
   "section": 4,
   "form": "written",
   "type": "T08",
   "topic": "시작 전 확인",
   "prompt": "잎을 빛과 어둠에서 비교하려 합니다. 처리 전 비교 시료에서 녹말이 검출되지 않았는지 확인하는 까닭을 쓰세요.",
   "answer": "처음부터 녹말이 남아 있으면 나중 반응이 이번 빛 처리로 생긴 것인지 구별하기 어려워요. 시작 전 상태와 처리 뒤 결과를 함께 비교해야 해요.",
   "explanation": "시작 전 확인은 결과 해석의 바탕이에요. 잎을 어둡게 두었다는 절차만으로 녹말이 없었다고 확정하지 않아요.",
   "misconception": "처리 전 녹말 상태와 처리 뒤 검출 결과가 있어야 빛의 영향을 해석해요.",
   "requirements": [
    "이전 녹말의 혼입 가능성",
    "이번 빛 처리 영향과 구별",
    "처리 전/후 검출 자료 비교"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "required": [
     "이전 녹말의 혼입 가능성",
     "이번 빛 처리 영향과 구별",
     "처리 전/후 검출 자료 비교"
    ]
   },
   "lines": 8,
   "criteria": "이전 녹말의 혼입 가능성 / 이번 빛 처리 영향과 구별 / 처리 전/후 검출 자료 비교"
  },
  {
   "id": "c22-s61-u03-w055",
   "no": 55,
   "section": 4,
   "form": "choice",
   "type": "T08",
   "topic": "연습 결과 해석",
   "prompt": "처리 전 비교 시료는 녹말 미검출, 같은 기간 뒤 빛을 준 잎만 청람색이었습니다. 알맞은 해석을 고르세요.",
   "answer": "① 이 조건에서 빛을 받은 잎의 녹말 생성을 뒷받침한다.",
   "explanation": "시작 상태와 처리 뒤 반응이 있어 이번 조건에서 빛을 받은 잎의 녹말 생성과 연결할 수 있어요. 모든 양분이나 모든 기관의 작용을 한 번에 증명한 것은 아니에요.",
   "misconception": "처리 전 녹말 상태와 처리 뒤 검출 결과가 있어야 빛의 영향을 해석해요.",
   "table": {
    "heads": [
     "시료",
     "녹말 검출"
    ],
    "rows": [
     [
      "처리 전 비교",
      "미검출"
     ],
     [
      "빛 처리 뒤",
      "청람색"
     ],
     [
      "어둠 처리 뒤",
      "미검출"
     ]
    ]
   },
   "choices": [
    "이 조건에서 빛을 받은 잎의 녹말 생성을 뒷받침한다.",
    "처리 전 상태가 달랐더라도 뒤에 청람색이 보이면 항상 같은 결론을 낼 수 있다.",
    "어두운 잎에는 어떤 물질도 없음을 증명한다.",
    "빛을 가린 잎은 호흡을 하지 않음을 증명한다.",
    "물과 이산화 탄소는 필요 없다는 증거다."
   ],
   "key": 0,
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "single-choice",
    "answer": 0
   },
   "criteria": "「이 조건에서 빛을 받은 잎의 녹말 생성을 뒷받침한다.」을 고른다. 시작 상태와 처리 뒤 반응이 있어 이번 조건에서 빛을 받은 잎의 녹말 생성과 연결할 수 있어요. 모든 양분이나 모든 기관의 작용을 한 번에 증명한 것은 아니에요.",
   "dataNature": "provided-practice-data-not-student-measurement",
   "figure": "plant-question-data-55"
  },
  {
   "id": "c22-s61-u03-w056",
   "no": 56,
   "section": 4,
   "form": "blank",
   "type": "T07",
   "topic": "공기 중 재료",
   "prompt": "잎이 양분을 만드는 데 이용하는 공기 중 기체는 [ ]예요.",
   "answer": "이산화 탄소",
   "explanation": "이산화 탄소는 광합성에 쓰이는 재료예요. 식물의 호흡과 혼동하여 산소라고 답하지 않아요.",
   "misconception": "광합성에 필요한 물·이산화 탄소와 빛을 구별하고 양분 생성과 연결해요.",
   "accepted": [
    "이산화탄소",
    "CO₂",
    "CO2"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "이산화 탄소",
     "이산화탄소",
     "CO₂",
     "CO2"
    ]
   },
   "criteria": "「이산화 탄소」 또는 명시한 동등 표현. 이산화 탄소는 광합성에 쓰이는 재료예요. 식물의 호흡과 혼동하여 산소라고 답하지 않아요."
  },
  {
   "id": "c22-s61-u03-w057",
   "no": 57,
   "section": 4,
   "form": "short",
   "type": "T08",
   "topic": "변화시킨 조건",
   "prompt": "같은 종류·잎 상태·물·시간에서 한쪽은 빛을 주고 다른 쪽은 가렸습니다. 다르게 한 조건을 쓰세요.",
   "answer": "빛의 유무",
   "explanation": "빛을 받았는지가 달라진 조건이에요. 다른 준비 조건은 같게 맞춰 빛의 영향과 연결해요.",
   "misconception": "처리 전 녹말 상태와 처리 뒤 검출 결과가 있어야 빛의 영향을 해석해요.",
   "accepted": [
    "빛을 받는지",
    "빛",
    "빛 유무",
    "빛을 받는 여부"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "빛의 유무",
     "빛을 받는지",
     "빛",
     "빛 유무",
     "빛을 받는 여부"
    ]
   },
   "criteria": "「빛의 유무」 또는 명시한 동등 표현. 빛을 받았는지가 달라진 조건이에요. 다른 준비 조건은 같게 맞춰 빛의 영향과 연결해요."
  },
  {
   "id": "c22-s61-u03-w058",
   "no": 58,
   "section": 4,
   "form": "multi",
   "type": "T08",
   "topic": "아직 말할 수 없는 것",
   "prompt": "처리 전 녹말 상태를 확인하지 않았고 처리 뒤 실제 반응도 아직 못 봤습니다. 필요한 행동을 모두 고르세요.",
   "answer": "②, ⑤",
   "explanation": "절차나 예상만으로 실제 검출 결과를 채울 수 없어요. 시작 전과 뒤의 관찰 자료를 확보하고 확인 전에는 결론을 보류해요.",
   "misconception": "처리 전 녹말 상태와 처리 뒤 검출 결과가 있어야 빛의 영향을 해석해요.",
   "choices": [
    "두 잎 모두 반응이 없었다고 꾸민다.",
    "처리 뒤 반응을 실제로 확인하고 아직은 결론을 보류한다.",
    "원하는 결론과 다른 반응은 지운다.",
    "빛을 받은 잎은 무조건 청람색이라고 결과 칸에 쓴다.",
    "처리 전 상태를 확인할 비교 시료를 준비한다."
   ],
   "key": [
    1,
    4
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     1,
     4
    ]
   },
   "criteria": "처리 뒤 반응을 실제로 확인하고 아직은 결론을 보류한다. / 처리 전 상태를 확인할 비교 시료를 준비한다.를 모두 고르고 다른 보기를 넣지 않는다."
  },
  {
   "id": "c22-s61-u03-w059",
   "no": 59,
   "section": 4,
   "form": "written",
   "type": "T08",
   "topic": "두 잎 모두 반응",
   "prompt": "빛을 준 잎과 가린 잎이 모두 청람색이었습니다. 이 결과를 보존하며 다시 확인할 점을 쓰세요.",
   "answer": "두 잎 모두 녹말 반응이 있었다고 남겨요. 처리 전 녹말 상태와 빛 차단 여부·시료 표기를 확인해요. 바로 빛과 무관하게 녹말이 만들어졌다고 결론 내리지 않아요.",
   "explanation": "기존 녹말이나 준비 조건의 차이 등 다른 설명을 확인해야 해요. 실제 반응을 모범 결과로 바꾸지 않아요.",
   "misconception": "처리 전 녹말 상태와 처리 뒤 검출 결과가 있어야 빛의 영향을 해석해요.",
   "requirements": [
    "두 반응 그대로 기록",
    "처리 전 상태/차단/시료 확인",
    "빛과 무관하다는 성급한 일반화 배제"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "required": [
     "두 반응 그대로 기록",
     "처리 전 상태/차단/시료 확인",
     "빛과 무관하다는 성급한 일반화 배제"
    ]
   },
   "lines": 8,
   "criteria": "두 반응 그대로 기록 / 처리 전 상태/차단/시료 확인 / 빛과 무관하다는 성급한 일반화 배제"
  },
  {
   "id": "c22-s61-u03-w060",
   "no": 60,
   "section": 4,
   "form": "written",
   "type": "T07",
   "topic": "뿌리와 잎의 분업",
   "prompt": "“뿌리가 흙에서 양분을 모두 가져와 잎은 펼쳐지기만 한다”는 말을 고쳐 쓰세요.",
   "answer": "뿌리는 물 등을 흡수하고 줄기는 물을 이동시켜요. 잎은 물과 이산화 탄소를 이용해 빛을 받아 양분을 만들어요.",
   "explanation": "기관의 물 흡수와 광합성을 구별하면서 연결해야 해요. 흙에서 완성된 양분을 모두 가져온다고 하지 않아요.",
   "misconception": "광합성에 필요한 물·이산화 탄소와 빛을 구별하고 양분 생성과 연결해요.",
   "requirements": [
    "뿌리 물 흡수",
    "줄기와 잎의 물 연결",
    "잎의 빛/재료를 이용한 양분 생성"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "required": [
     "뿌리 물 흡수",
     "줄기와 잎의 물 연결",
     "잎의 빛/재료를 이용한 양분 생성"
    ]
   },
   "lines": 8,
   "criteria": "뿌리 물 흡수 / 줄기와 잎의 물 연결 / 잎의 빛/재료를 이용한 양분 생성"
  },
  {
   "id": "c22-s61-u03-w061",
   "no": 61,
   "section": 4,
   "form": "choice",
   "type": "T08",
   "topic": "실험 조작의 담당",
   "prompt": "잎의 녹말 검출 준비에 약품과 뜨거운 기구가 필요합니다. 수업 운영으로 알맞은 것을 고르세요.",
   "answer": "③ 교사가 안전하게 처리한 시료를 안내에 따라 관찰한다.",
   "explanation": "약품과 가열·뜨거운 시료는 교사가 준비·취급하고 학생은 안내에 따라 관찰해요. 학생에게 직접 알코올 가열을 기본 과제로 요구하지 않아요.",
   "misconception": "처리 전 녹말 상태와 처리 뒤 검출 결과가 있어야 빛의 영향을 해석해요.",
   "choices": [
    "뜨거운 용기를 맨손으로 옮긴다.",
    "도구 이름을 몰라도 먼저 임의로 약품을 섞는다.",
    "교사가 안전하게 처리한 시료를 안내에 따라 관찰한다.",
    "교사의 시범을 보았으므로 약품 취급 안내 없이 같은 과정을 혼자 반복한다.",
    "약품을 맛보아 녹말 유무를 확인한다."
   ],
   "key": 2,
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "single-choice",
    "answer": 2
   },
   "criteria": "「교사가 안전하게 처리한 시료를 안내에 따라 관찰한다.」을 고른다. 약품과 가열·뜨거운 시료는 교사가 준비·취급하고 학생은 안내에 따라 관찰해요. 학생에게 직접 알코올 가열을 기본 과제로 요구하지 않아요."
  },
  {
   "id": "c22-s61-u03-w062",
   "no": 62,
   "section": 4,
   "form": "order",
   "type": "T08",
   "topic": "근거를 읽는 순서",
   "prompt": "교사가 준비한 검출 자료를 해석하는 순서를 쓰세요.",
   "answer": "ㄴ → ㄱ → ㄹ → ㄷ",
   "explanation": "처리 전 상태와 같게 한 조건을 먼저 확인하고 뒤의 실제 검출 결과를 비교하여 결론 범위를 정해요.",
   "misconception": "처리 전 녹말 상태와 처리 뒤 검출 결과가 있어야 빛의 영향을 해석해요.",
   "given": [
    "ㄱ 같게 한 조건과 빛 처리 차이를 확인한다.",
    "ㄴ 처리 전 비교 시료의 녹말 검출 상태를 읽는다.",
    "ㄷ 이번 조건에서 말할 수 있는 결론을 쓴다.",
    "ㄹ 처리 뒤 두 시료의 실제 반응을 비교한다."
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "ordered-label-sequence",
    "sequence": [
     "ㄴ",
     "ㄱ",
     "ㄹ",
     "ㄷ"
    ]
   },
   "criteria": "「ㄴ → ㄱ → ㄹ → ㄷ」 또는 명시한 동등 표현. 처리 전 상태와 같게 한 조건을 먼저 확인하고 뒤의 실제 검출 결과를 비교하여 결론 범위를 정해요."
  },
  {
   "id": "c22-s61-u03-w063",
   "no": 63,
   "section": 4,
   "form": "written",
   "type": "T08",
   "topic": "검출 결과의 한계",
   "prompt": "녹말 검출 반응 하나로 “식물의 모든 양분은 녹말이며 빛이 없으면 식물 안에 양분이 전혀 없다”고 말할 수 없는 까닭을 쓰세요.",
   "answer": "이 반응은 녹말 검출을 알아보는 자료예요. 모든 양분 종류를 조사한 것이 아니고 이전에 저장되거나 다른 기관에서 이동한 양분도 구별해야 해요.",
   "explanation": "검출한 대상과 전체 양분은 다른 범위예요. 한 시료·조건의 반응을 식물 전체로 넓히지 않아요.",
   "misconception": "처리 전 녹말 상태와 처리 뒤 검출 결과가 있어야 빛의 영향을 해석해요.",
   "requirements": [
    "녹말 검출 대상 한정",
    "모든 양분을 조사하지 않음",
    "저장/이동 또는 전체로 일반화하지 않음"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "required": [
     "녹말 검출 대상 한정",
     "모든 양분을 조사하지 않음",
     "저장/이동 또는 전체로 일반화하지 않음"
    ]
   },
   "lines": 8,
   "criteria": "녹말 검출 대상 한정 / 모든 양분을 조사하지 않음 / 저장/이동 또는 전체로 일반화하지 않음"
  },
  {
   "id": "c22-s61-u03-w064",
   "no": 64,
   "section": 4,
   "form": "draw",
   "type": "T08",
   "topic": "빛 비교의 설명 그림",
   "prompt": "빛을 준 시료와 가린 시료의 비교 설명 틀을 그리세요. 처리 전 검출 확인, 같게 한 조건, 처리 뒤 실제 반응을 넣을 빈 칸을 표시하세요.",
   "answer": "처리 전 비교 확인 칸과 빛/어둠 두 시료 칸을 두고 같은 종류·시간·물 상태를 표시해요. 뒤의 반응 칸은 관찰 전 비워 둬요.",
   "explanation": "약품을 다루는 절차 그림이 아니라 비교 근거를 정리하는 틀이에요. 실제 결과를 보고 채워요.",
   "misconception": "처리 전 녹말 상태와 처리 뒤 검출 결과가 있어야 빛의 영향을 해석해요.",
   "requirements": [
    "처리 전 확인 자리",
    "빛 유무/같게 한 조건 구별",
    "처리 뒤 빈 결과 두 칸"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "required": [
     "처리 전 확인 자리",
     "빛 유무/같게 한 조건 구별",
     "처리 뒤 빈 결과 두 칸"
    ]
   },
   "lines": 0,
   "drawing": "large",
   "criteria": "처리 전 확인 자리 / 빛 유무/같게 한 조건 구별 / 처리 뒤 빈 결과 두 칸"
  },
  {
   "id": "c22-s61-u03-w065",
   "no": 65,
   "section": 5,
   "form": "choice",
   "type": "T09",
   "topic": "수증기로 나가는 물",
   "prompt": "식물 안의 물이 주로 잎을 통해 수증기로 나가는 현상을 고르세요.",
   "answer": "④ 증산 작용",
   "explanation": "이 현상은 증산 작용이에요. 물이 얼거나 녹는 상태 변화, 뿌리 흡수와 구별해요.",
   "misconception": "증산은 식물 안의 물이 수증기로 나가는 현상이에요. 기공과 연결해요.",
   "choices": [
    "씨의 발아",
    "물의 응고",
    "양분 저장",
    "증산 작용",
    "꽃가루받이"
   ],
   "key": 3,
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "single-choice",
    "answer": 3
   },
   "criteria": "「증산 작용」을 고른다. 이 현상은 증산 작용이에요. 물이 얼거나 녹는 상태 변화, 뿌리 흡수와 구별해요."
  },
  {
   "id": "c22-s61-u03-w066",
   "no": 66,
   "section": 5,
   "form": "blank",
   "type": "T09",
   "topic": "잎의 작은 구멍",
   "prompt": "잎에서 물이 수증기로 나가는 것과 관련된 작은 구멍을 [ ]이라고 해요.",
   "answer": "기공",
   "explanation": "기공은 증산과 기체 출입에 관련돼요. 이 활동에서 구멍의 자세한 세포 조절 원리를 암기하지 않아요.",
   "misconception": "증산은 식물 안의 물이 수증기로 나가는 현상이에요. 기공과 연결해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "기공"
    ]
   },
   "criteria": "「기공」 또는 명시한 동등 표현. 기공은 증산과 기체 출입에 관련돼요. 이 활동에서 구멍의 자세한 세포 조절 원리를 암기하지 않아요."
  },
  {
   "id": "c22-s61-u03-w067",
   "no": 67,
   "section": 5,
   "form": "short",
   "type": "T10",
   "topic": "같은 시간의 물 감소",
   "prompt": "입구를 막은 같은 장치의 연습표입니다. 물이 더 많이 줄어든 쪽의 기호를 쓰세요.",
   "answer": "나",
   "explanation": "가는 55−52=3mL, 나는 55−34=21mL 줄었어요. 잎 유무 비교의 다른 조건도 확인하고 이번 결과로 설명해요.",
   "misconception": "잎 유무를 비교할 때 봉지 초기 물기·용기 입구·주변 조건을 맞춰요.",
   "table": {
    "heads": [
     "장치",
     "잎",
     "처음(mL)",
     "뒤(mL)"
    ],
    "rows": [
     [
      "가",
      "없음",
      55,
      52
     ],
     [
      "나",
      "있음",
      55,
      34
     ]
    ]
   },
   "model": {
    "kind": "max-water-loss",
    "names": [
     "가",
     "나"
    ],
    "before": [
     55,
     55
    ],
    "after": [
     52,
     34
    ],
    "answer": "나"
   },
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "나"
    ]
   },
   "criteria": "「나」 또는 명시한 동등 표현. 가는 55−52=3mL, 나는 55−34=21mL 줄었어요. 잎 유무 비교의 다른 조건도 확인하고 이번 결과로 설명해요.",
   "dataNature": "provided-practice-data-not-student-measurement",
   "figure": "plant-question-data-67"
  },
  {
   "id": "c22-s61-u03-w068",
   "no": 68,
   "section": 5,
   "form": "multi",
   "type": "T10",
   "topic": "봉지 비교 준비",
   "prompt": "잎 유무가 봉지 속 물방울에 주는 영향을 비교할 때 맞출 조건을 모두 고르세요.",
   "answer": "①, ③, ④",
   "explanation": "처음 봉지 안이 마른지와 입구 밀봉·주변 환경·시간 등을 맞춰야 해요. 물방울이 원래 있거나 한쪽에만 물을 넣으면 근거가 섞여요.",
   "misconception": "잎 유무를 비교할 때 봉지 초기 물기·용기 입구·주변 조건을 맞춰요.",
   "choices": [
    "같은 시간과 주변 환경",
    "한쪽 봉지만 중간에 열기",
    "같은 봉지와 밀봉 방법",
    "두 봉지 안의 처음 물기",
    "잎 없는 쪽에만 물을 미리 넣기"
   ],
   "key": [
    0,
    2,
    3
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     0,
     2,
     3
    ]
   },
   "criteria": "같은 시간과 주변 환경 / 같은 봉지와 밀봉 방법 / 두 봉지 안의 처음 물기를 모두 고르고 다른 보기를 넣지 않는다."
  },
  {
   "id": "c22-s61-u03-w069",
   "no": 69,
   "section": 5,
   "form": "match",
   "type": "T09",
   "topic": "물의 모습",
   "prompt": "보기: ㄱ 수증기로 나감 / ㄴ 물방울로 맺힘 / ㄷ 뿌리로 흡수됨. 연결하세요.",
   "answer": "(1) ㄷ (2) ㄱ (3) ㄴ",
   "explanation": "뿌리 흡수·잎의 증산·봉지 안 응결은 이어지지만 서로 다른 과정이에요. 물방울 자체가 기공에서 액체로 튀어나왔다고 하지 않아요.",
   "misconception": "증산은 식물 안의 물이 수증기로 나가는 현상이에요. 기공과 연결해요.",
   "parts": [
    "(1) 흙 속 물이 식물로 들어옴 [ ]",
    "(2) 잎에서 물이 기체 상태로 나감 [ ]",
    "(3) 봉지 속 수증기가 물방울이 됨 [ ]"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "answerPerPart": true,
   "responseContract": {
    "kind": "ordered-label-parts",
    "answers": [
     "ㄷ",
     "ㄱ",
     "ㄴ"
    ]
   },
   "criteria": "「(1) ㄷ (2) ㄱ (3) ㄴ」 또는 명시한 동등 표현. 뿌리 흡수·잎의 증산·봉지 안 응결은 이어지지만 서로 다른 과정이에요. 물방울 자체가 기공에서 액체로 튀어나왔다고 하지 않아요."
  },
  {
   "id": "c22-s61-u03-w070",
   "no": 70,
   "section": 5,
   "form": "written",
   "type": "T10",
   "topic": "처음부터 젖은 봉지",
   "prompt": "잎 있는 봉지에만 처음부터 물방울이 있었습니다. 나중에 물방울이 더 보였다는 관찰을 해석할 때의 문제와 보완 방법을 쓰세요.",
   "answer": "처음 물기가 나중 관찰에 섞여 잎의 영향만 구별하기 어려워요. 두 봉지를 처음부터 마른 상태로 맞춰 같은 방법으로 다시 비교해요.",
   "explanation": "관찰 전 상태가 같아야 변화의 근거를 읽기 쉬워요. 초기 물기를 없던 것처럼 지우지 않아요.",
   "misconception": "잎 유무를 비교할 때 봉지 초기 물기·용기 입구·주변 조건을 맞춰요.",
   "requirements": [
    "초기 물기라는 교란",
    "잎 영향과 구별 어려움",
    "두 봉지 마른 상태로 재비교"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "required": [
     "초기 물기라는 교란",
     "잎 영향과 구별 어려움",
     "두 봉지 마른 상태로 재비교"
    ]
   },
   "lines": 8,
   "criteria": "초기 물기라는 교란 / 잎 영향과 구별 어려움 / 두 봉지 마른 상태로 재비교"
  },
  {
   "id": "c22-s61-u03-w071",
   "no": 71,
   "section": 5,
   "form": "choice",
   "type": "T09",
   "topic": "물방울의 설명",
   "prompt": "처음 마른 봉지를 잎에 씌운 뒤 안에 물방울이 맺혔습니다. 다른 비교 조건도 맞췄을 때 알맞은 설명을 고르세요.",
   "answer": "⑤ 잎에서 나온 수증기가 봉지 안에서 물방울로 맺혔다.",
   "explanation": "잎에서 나온 수증기가 봉지 안에서 물방울로 맺힌 것으로 해석할 수 있어요. 봉지 비교와 초기 상태를 함께 확인해야 해요.",
   "misconception": "증산은 식물 안의 물이 수증기로 나가는 현상이에요. 기공과 연결해요.",
   "choices": [
    "잎에서 수증기가 나가는 과정 없이 기공에서 큰 액체 물방울이 그대로 분사된 것이다.",
    "봉지가 스스로 물을 새로 만들었다.",
    "꽃가루가 녹아서 물방울이 됐다.",
    "물방울이 맺힌 만큼 뿌리의 물 흡수는 완전히 멈췄다.",
    "잎에서 나온 수증기가 봉지 안에서 물방울로 맺혔다."
   ],
   "key": 4,
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "single-choice",
    "answer": 4
   },
   "criteria": "「잎에서 나온 수증기가 봉지 안에서 물방울로 맺혔다.」을 고른다. 잎에서 나온 수증기가 봉지 안에서 물방울로 맺힌 것으로 해석할 수 있어요. 봉지 비교와 초기 상태를 함께 확인해야 해요."
  },
  {
   "id": "c22-s61-u03-w072",
   "no": 72,
   "section": 5,
   "form": "blank",
   "type": "T09",
   "topic": "증산의 물질 상태",
   "prompt": "증산은 식물 안의 물이 [ ] 상태로 나가는 현상이에요.",
   "answer": "수증기",
   "explanation": "증산으로 나간 수증기가 주변 조건에 따라 물방울로 맺힐 수 있어요. 기체로 나감과 물방울 맺힘을 구별해요.",
   "misconception": "증산은 식물 안의 물이 수증기로 나가는 현상이에요. 기공과 연결해요.",
   "accepted": [
    "기체"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "수증기",
     "기체"
    ]
   },
   "criteria": "「수증기」 또는 명시한 동등 표현. 증산으로 나간 수증기가 주변 조건에 따라 물방울로 맺힐 수 있어요. 기체로 나감과 물방울 맺힘을 구별해요."
  },
  {
   "id": "c22-s61-u03-w073",
   "no": 73,
   "section": 5,
   "form": "short",
   "type": "T10",
   "topic": "감소량에 단위 쓰기",
   "prompt": "처음 48mL였던 물이 42mL가 되었습니다. 감소량을 단위와 함께 쓰세요.",
   "answer": "6mL",
   "explanation": "48−42=6이고 물의 양 단위는 mL예요. 42mL는 남은 양이며 감소량과 달라요.",
   "misconception": "잎 유무를 비교할 때 봉지 초기 물기·용기 입구·주변 조건을 맞춰요.",
   "accepted": [
    "6 mL",
    "6ml",
    "6밀리리터"
   ],
   "model": {
    "kind": "water-loss-quantity",
    "before": 48,
    "after": 42,
    "value": 6,
    "unit": "mL"
   },
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "6mL",
     "6 mL",
     "6ml",
     "6밀리리터"
    ]
   },
   "criteria": "「6mL」 또는 명시한 동등 표현. 48−42=6이고 물의 양 단위는 mL예요. 42mL는 남은 양이며 감소량과 달라요.",
   "dataNature": "provided-practice-data-not-student-measurement"
  },
  {
   "id": "c22-s61-u03-w074",
   "no": 74,
   "section": 5,
   "form": "multi",
   "type": "T10",
   "topic": "관찰과 결론의 경계",
   "prompt": "잎이 있는 장치에서 물이 더 많이 줄었습니다. 타당한 설명을 모두 고르세요.",
   "answer": "①, ③",
   "explanation": "주어진 비교는 잎의 물 배출과 물 이동을 뒷받침해요. 모든 식물/계절의 양이나 직접 증발이 없었다는 주장까지 증명하지 않아요.",
   "misconception": "잎 유무를 비교할 때 봉지 초기 물기·용기 입구·주변 조건을 맞춰요.",
   "choices": [
    "같게 맞춘 조건과 실제 감소량을 함께 말한다.",
    "원하는 결론과 다른 회차는 버린다.",
    "입구를 막은 방법과 물방울 관찰도 함께 확인한다.",
    "물 감소에는 어떤 경우에도 직접 증발이 섞이지 않는다.",
    "모든 식물이 매일 같은 양을 잃는다고 정한다."
   ],
   "key": [
    0,
    2
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     0,
     2
    ]
   },
   "criteria": "같게 맞춘 조건과 실제 감소량을 함께 말한다. / 입구를 막은 방법과 물방울 관찰도 함께 확인한다.를 모두 고르고 다른 보기를 넣지 않는다."
  },
  {
   "id": "c22-s61-u03-w075",
   "no": 75,
   "section": 5,
   "form": "written",
   "type": "T09",
   "topic": "물방울과 수증기",
   "prompt": "“봉지 속 액체 물방울을 보았으니 증산은 액체가 나가는 현상”이라는 말을 고쳐 쓰세요.",
   "answer": "증산은 물이 수증기로 나가는 현상이에요. 나온 수증기가 봉지 안에서 물방울로 맺힌 것을 관찰한 것이므로 두 단계를 구별해요.",
   "explanation": "보인 최종 모습이 중간에 이동한 상태와 항상 같지는 않아요. 증산과 응결을 이어 설명해요.",
   "misconception": "증산은 식물 안의 물이 수증기로 나가는 현상이에요. 기공과 연결해요.",
   "requirements": [
    "증산은 수증기라고 수정",
    "봉지 안 물방울 맺힘 설명",
    "나가는 과정/맺힌 결과 구별"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "required": [
     "증산은 수증기라고 수정",
     "봉지 안 물방울 맺힘 설명",
     "나가는 과정/맺힌 결과 구별"
    ]
   },
   "lines": 8,
   "criteria": "증산은 수증기라고 수정 / 봉지 안 물방울 맺힘 설명 / 나가는 과정/맺힌 결과 구별"
  },
  {
   "id": "c22-s61-u03-w076",
   "no": 76,
   "section": 5,
   "form": "written",
   "type": "T10",
   "topic": "잎을 제거한 장치도 감소",
   "prompt": "잎을 제거한 장치에서도 물이 조금 줄었습니다. “실험 실패니까 0으로 바꾸자”는 제안을 검토하세요.",
   "answer": "실제 감소량을 그대로 남겨요. 남은 기관·절단 상처·입구 처리와 직접 증발 등을 확인하고 잎 유무에 따른 차이를 비교해요.",
   "explanation": "대조 장치의 값이 꼭 0이어야 하는 것은 아니에요. 기대와 다른 값을 바꾸면 자료가 사라져요.",
   "misconception": "잎 유무를 비교할 때 봉지 초기 물기·용기 입구·주변 조건을 맞춰요.",
   "requirements": [
    "실제 값 보존",
    "구체적인 다른 감소 원인 확인",
    "잎 유무의 차이로 해석"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "required": [
     "실제 값 보존",
     "구체적인 다른 감소 원인 확인",
     "잎 유무의 차이로 해석"
    ]
   },
   "lines": 8,
   "criteria": "실제 값 보존 / 구체적인 다른 감소 원인 확인 / 잎 유무의 차이로 해석"
  },
  {
   "id": "c22-s61-u03-w077",
   "no": 77,
   "section": 5,
   "form": "choice",
   "type": "T10",
   "topic": "두 조건을 바꾼 비교",
   "prompt": "잎 있는 장치는 햇빛 아래, 잎 없는 장치는 그늘에 두었습니다. 이 비교의 문제를 고르세요.",
   "answer": "② 잎 유무와 빛 조건이 함께 달라졌다.",
   "explanation": "잎 유무와 빛/주변 환경이 함께 달라져 결과 차이를 어느 조건 때문인지 구별하기 어려워요. 같은 환경에서 비교해야 해요.",
   "misconception": "잎 유무를 비교할 때 봉지 초기 물기·용기 입구·주변 조건을 맞춰요.",
   "choices": [
    "물의 양을 읽을 필요가 없어진다.",
    "잎 유무와 빛 조건이 함께 달라졌다.",
    "잎 유무를 달리하면 비교 실험이 불가능하다.",
    "햇빛 아래에서는 물이 절대로 줄지 않는다.",
    "그늘에서는 모든 식물이 물을 쓰지 않는다."
   ],
   "key": 1,
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "single-choice",
    "answer": 1
   },
   "criteria": "「잎 유무와 빛 조건이 함께 달라졌다.」을 고른다. 잎 유무와 빛/주변 환경이 함께 달라져 결과 차이를 어느 조건 때문인지 구별하기 어려워요. 같은 환경에서 비교해야 해요."
  },
  {
   "id": "c22-s61-u03-w078",
   "no": 78,
   "section": 5,
   "form": "order",
   "type": "T10",
   "topic": "증산 비교의 흐름",
   "prompt": "교사가 준비한 비교 장치의 관찰 순서를 쓰세요.",
   "answer": "ㄹ → ㄱ → ㄷ → ㄴ",
   "explanation": "처음 상태와 통제 조건을 먼저 확인하고 시간을 맞춰 관찰해요. 뒤의 기록에서 물방울과 물 감소를 함께 비교해요.",
   "misconception": "잎 유무를 비교할 때 봉지 초기 물기·용기 입구·주변 조건을 맞춰요.",
   "given": [
    "ㄱ 두 장치를 같은 시간·환경에서 둔다.",
    "ㄴ 잎 유무와 관찰 차이를 연결해 설명한다.",
    "ㄷ 뒤의 물방울/물의 양을 실제로 읽는다.",
    "ㄹ 봉지 초기 물기·물의 양·입구 처리를 확인한다."
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "ordered-label-sequence",
    "sequence": [
     "ㄹ",
     "ㄱ",
     "ㄷ",
     "ㄴ"
    ]
   },
   "criteria": "「ㄹ → ㄱ → ㄷ → ㄴ」 또는 명시한 동등 표현. 처음 상태와 통제 조건을 먼저 확인하고 시간을 맞춰 관찰해요. 뒤의 기록에서 물방울과 물 감소를 함께 비교해요."
  },
  {
   "id": "c22-s61-u03-w079",
   "no": 79,
   "section": 5,
   "form": "written",
   "type": "T13",
   "topic": "뿌리까지 연결",
   "prompt": "잎에서 물이 수증기로 나가는 현상을 뿌리·줄기와 연결해 설명하세요.",
   "answer": "뿌리가 흡수한 물은 줄기를 지나 잎으로 이동해요. 잎에서 물의 일부가 수증기로 나가므로 기관들의 물 이동이 연결돼요.",
   "explanation": "잎에서 물이 사라졌다는 말만 하지 않고 물이 들어온 경로와 나간 경로를 연결해요.",
   "misconception": "물의 흡수·이동·배출과 양분 생성/이동을 기관 사이의 관계로 설명해요.",
   "requirements": [
    "뿌리 흡수",
    "줄기 이동",
    "잎에서 수증기 배출"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "required": [
     "뿌리 흡수",
     "줄기 이동",
     "잎에서 수증기 배출"
    ]
   },
   "lines": 8,
   "criteria": "뿌리 흡수 / 줄기 이동 / 잎에서 수증기 배출"
  },
  {
   "id": "c22-s61-u03-w080",
   "no": 80,
   "section": 5,
   "form": "draw",
   "type": "T10",
   "topic": "공정한 잎 유무 비교",
   "prompt": "잎 있는 장치와 잎 없는 장치의 비교 그림을 그리세요. 마른 봉지·같은 입구 처리·물의 양과 시간을 표시하고 결과 칸을 비워 두세요.",
   "answer": "두 장치에 잎 유무만 달리 표시하고 마른 봉지/같은 용기·초기 물·밀봉·시간을 써요. 나중 물방울/물의 양 기록 자리는 비워 둬요.",
   "explanation": "실제 장치 준비는 교사 안내에 따라 해요. 그려 놓은 물방울이 관찰 결과를 대신하지 않아요.",
   "misconception": "잎 유무를 비교할 때 봉지 초기 물기·용기 입구·주변 조건을 맞춰요.",
   "requirements": [
    "잎 유무 차이",
    "마른 봉지/입구 처리와 초기 조건",
    "시간과 빈 결과 자리"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "required": [
     "잎 유무 차이",
     "마른 봉지/입구 처리와 초기 조건",
     "시간과 빈 결과 자리"
    ]
   },
   "lines": 0,
   "drawing": "large",
   "criteria": "잎 유무 차이 / 마른 봉지/입구 처리와 초기 조건 / 시간과 빈 결과 자리"
  },
  {
   "id": "c22-s61-u03-w081",
   "no": 81,
   "section": 6,
   "form": "choice",
   "type": "T13",
   "topic": "물의 이동 길",
   "prompt": "흙에서 자라는 식물에서 흡수한 물이 잎으로 이동하는 연결을 고르세요.",
   "answer": "④ 뿌리 → 줄기 → 잎",
   "explanation": "흙 속 물을 뿌리가 흡수하고 줄기를 지나 잎으로 보내요. 기관은 물의 이동으로 연결돼요.",
   "misconception": "물의 흡수·이동·배출과 양분 생성/이동을 기관 사이의 관계로 설명해요.",
   "choices": [
    "열매 → 꽃 → 흙",
    "잎 → 흙 → 꽃가루",
    "씨 → 꽃가루 → 잎",
    "뿌리 → 줄기 → 잎",
    "꽃가루 → 꽃잎 → 뿌리"
   ],
   "key": 3,
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "single-choice",
    "answer": 3
   },
   "criteria": "「뿌리 → 줄기 → 잎」을 고른다. 흙 속 물을 뿌리가 흡수하고 줄기를 지나 잎으로 보내요. 기관은 물의 이동으로 연결돼요."
  },
  {
   "id": "c22-s61-u03-w082",
   "no": 82,
   "section": 6,
   "form": "blank",
   "type": "T13",
   "topic": "기관의 관계",
   "prompt": "식물 기관은 각자 하는 일이 있지만 물과 양분의 [ ]으로 서로 연결돼요.",
   "answer": "이동",
   "explanation": "뿌리의 흡수·줄기의 통로·잎의 양분 생성은 독립된 목록이 아니라 식물 몸 안에서 이어져요.",
   "misconception": "물의 흡수·이동·배출과 양분 생성/이동을 기관 사이의 관계로 설명해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "이동"
    ]
   },
   "criteria": "「이동」 또는 명시한 동등 표현. 뿌리의 흡수·줄기의 통로·잎의 양분 생성은 독립된 목록이 아니라 식물 몸 안에서 이어져요."
  },
  {
   "id": "c22-s61-u03-w083",
   "no": 83,
   "section": 6,
   "form": "short",
   "type": "T13",
   "topic": "통로를 묻는 단답",
   "prompt": "뿌리에서 잎으로 가는 물이 지나가는 식물 기관을 쓰세요.",
   "answer": "줄기",
   "explanation": "뿌리에서 들어온 물이 다른 기관으로 가는 통로와 지지 역할을 줄기가 해요. 흡수 기관과 이동 통로를 구별해요.",
   "misconception": "물의 흡수·이동·배출과 양분 생성/이동을 기관 사이의 관계로 설명해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "줄기"
    ]
   },
   "criteria": "「줄기」 또는 명시한 동등 표현. 뿌리에서 들어온 물이 다른 기관으로 가는 통로와 지지 역할을 줄기가 해요. 흡수 기관과 이동 통로를 구별해요."
  },
  {
   "id": "c22-s61-u03-w084",
   "no": 84,
   "section": 6,
   "form": "multi",
   "type": "T13",
   "topic": "함께 일하는 기관",
   "prompt": "기관의 역할을 연결한 설명으로 알맞은 것을 모두 고르세요.",
   "answer": "②, ④, ⑤",
   "explanation": "각 기관의 기능은 물과 양분의 이동을 통해 연결돼요. 저장은 특정 기관에만, 이동은 항상 한 방향으로만 된다고 단정하지 않아요.",
   "misconception": "물의 흡수·이동·배출과 양분 생성/이동을 기관 사이의 관계로 설명해요.",
   "choices": [
    "줄기는 물을 이동시키므로 지지 역할이 없다.",
    "잎에서 만든 양분은 다른 기관의 생장과 저장에 쓰일 수 있다.",
    "모든 양분은 꽃가루에서 만들어진다.",
    "잎의 증산과 뿌리·줄기의 물 이동은 연결돼 있다.",
    "뿌리가 흡수한 물이 줄기를 지나 잎으로 간다."
   ],
   "key": [
    1,
    3,
    4
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     1,
     3,
     4
    ]
   },
   "criteria": "잎에서 만든 양분은 다른 기관의 생장과 저장에 쓰일 수 있다. / 잎의 증산과 뿌리·줄기의 물 이동은 연결돼 있다. / 뿌리가 흡수한 물이 줄기를 지나 잎으로 간다.를 모두 고르고 다른 보기를 넣지 않는다."
  },
  {
   "id": "c22-s61-u03-w085",
   "no": 85,
   "section": 6,
   "form": "match",
   "type": "T13",
   "topic": "근거와 기관",
   "prompt": "보기: ㄱ 뿌리 흡수 / ㄴ 줄기 물 이동 / ㄷ 잎의 녹말 생성. 근거가 직접 관련된 역할과 연결하세요.",
   "answer": "(1) ㄴ (2) ㄷ (3) ㄱ",
   "explanation": "각 실험이 알아보는 역할을 연결하되 하나의 실험으로 모든 기능을 증명했다고 하지 않아요.",
   "misconception": "물의 흡수·이동·배출과 양분 생성/이동을 기관 사이의 관계로 설명해요.",
   "parts": [
    "(1) 색소 물 뒤 단면 내부의 색 자취 [ ]",
    "(2) 시작 상태 확인 뒤 빛 처리 잎의 녹말 검출 [ ]",
    "(3) 같은 조건에서 뿌리 유무에 따른 물 감소 비교 [ ]"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "answerPerPart": true,
   "responseContract": {
    "kind": "ordered-label-parts",
    "answers": [
     "ㄴ",
     "ㄷ",
     "ㄱ"
    ]
   },
   "criteria": "「(1) ㄴ (2) ㄷ (3) ㄱ」 또는 명시한 동등 표현. 각 실험이 알아보는 역할을 연결하되 하나의 실험으로 모든 기능을 증명했다고 하지 않아요."
  },
  {
   "id": "c22-s61-u03-w086",
   "no": 86,
   "section": 6,
   "form": "written",
   "type": "T13",
   "topic": "그림에서 빠진 기관",
   "prompt": "친구가 흙에서 바로 잎으로 가는 화살표만 그렸습니다. 물 이동을 설명하도록 그림을 보완할 방법을 쓰세요.",
   "answer": "흙의 물이 뿌리로 들어오고 줄기를 거쳐 잎에 이르는 경로를 그려요. 각 화살표에 흡수·이동이라는 뜻을 붙여요.",
   "explanation": "화살표가 가리키는 물질과 기관의 순서가 있어야 생김새 그림을 기능 설명으로 바꿀 수 있어요.",
   "misconception": "물의 흡수·이동·배출과 양분 생성/이동을 기관 사이의 관계로 설명해요.",
   "requirements": [
    "뿌리 추가",
    "줄기 거쳐 잎 연결",
    "물과 흡수/이동 이름표"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "required": [
     "뿌리 추가",
     "줄기 거쳐 잎 연결",
     "물과 흡수/이동 이름표"
    ]
   },
   "lines": 8,
   "criteria": "뿌리 추가 / 줄기 거쳐 잎 연결 / 물과 흡수/이동 이름표"
  },
  {
   "id": "c22-s61-u03-w087",
   "no": 87,
   "section": 6,
   "form": "choice",
   "type": "T13",
   "topic": "양분의 사용",
   "prompt": "잎에서 만들어진 양분에 대한 설명을 고르세요.",
   "answer": "② 다른 기관의 생장이나 저장에 쓰일 수 있다.",
   "explanation": "잎에서 만든 양분은 식물의 여러 기관이 자라는 데 쓰이거나 저장될 수 있어요. 잎에만 계속 남는다고 제한하지 않아요.",
   "misconception": "물의 흡수·이동·배출과 양분 생성/이동을 기관 사이의 관계로 설명해요.",
   "choices": [
    "모든 양분이 뿌리에서 완성되어 잎에 온다.",
    "다른 기관의 생장이나 저장에 쓰일 수 있다.",
    "잎에서 만들어졌으므로 뿌리나 줄기에서는 이용하지 못하고 잎에만 남는다.",
    "언제나 꽃가루가 되어 밖으로 나간다.",
    "빛을 받으면 모든 양분이 즉시 사라진다."
   ],
   "key": 1,
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "single-choice",
    "answer": 1
   },
   "criteria": "「다른 기관의 생장이나 저장에 쓰일 수 있다.」을 고른다. 잎에서 만든 양분은 식물의 여러 기관이 자라는 데 쓰이거나 저장될 수 있어요. 잎에만 계속 남는다고 제한하지 않아요."
  },
  {
   "id": "c22-s61-u03-w088",
   "no": 88,
   "section": 6,
   "form": "blank",
   "type": "T13",
   "topic": "구조와 기능",
   "prompt": "기관이 어떻게 생겼는지를 구조, 어떤 일을 하는지를 [ ]이라고 해요.",
   "answer": "기능",
   "explanation": "생김새를 관찰한 다음 그 특징이 어떤 역할과 관련되는지 실험 근거로 연결해요.",
   "misconception": "물의 흡수·이동·배출과 양분 생성/이동을 기관 사이의 관계로 설명해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "기능"
    ]
   },
   "criteria": "「기능」 또는 명시한 동등 표현. 생김새를 관찰한 다음 그 특징이 어떤 역할과 관련되는지 실험 근거로 연결해요."
  },
  {
   "id": "c22-s61-u03-w089",
   "no": 89,
   "section": 6,
   "form": "short",
   "type": "T13",
   "topic": "생김새만으로 모르는 것",
   "prompt": "잎 사진 한 장으로 실제 녹말 생성 여부를 확인하려면 더 필요한 것은 무엇인가요? 보기: 색 이름 / 녹말 검출 자료 / 꽃 개수",
   "answer": "녹말 검출 자료",
   "explanation": "사진은 잎 생김새를 보여 주지만 실제 녹말 검출의 전후 조건과 반응 자료는 없어요. 처리 전 상태와 빛 조건도 함께 확인해요.",
   "misconception": "물의 흡수·이동·배출과 양분 생성/이동을 기관 사이의 관계로 설명해요.",
   "accepted": [
    "녹말 검출 결과",
    "녹말 반응 자료"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "녹말 검출 자료",
     "녹말 검출 결과",
     "녹말 반응 자료"
    ]
   },
   "criteria": "「녹말 검출 자료」 또는 명시한 동등 표현. 사진은 잎 생김새를 보여 주지만 실제 녹말 검출의 전후 조건과 반응 자료는 없어요. 처리 전 상태와 빛 조건도 함께 확인해요."
  },
  {
   "id": "c22-s61-u03-w090",
   "no": 90,
   "section": 6,
   "form": "multi",
   "type": "T13",
   "topic": "증거와 주장 짝",
   "prompt": "근거와 결론의 범위를 바르게 연결한 것을 모두 고르세요.",
   "answer": "②, ④",
   "explanation": "물 이동의 색 자취와 녹말 검출의 반응은 서로 다른 근거예요. 각 근거로 직접 말할 수 있는 범위를 확인해요.",
   "misconception": "물의 흡수·이동·배출과 양분 생성/이동을 기관 사이의 관계로 설명해요.",
   "choices": [
    "줄기 붉은 점 → 모든 양분의 종류가 밝혀졌다.",
    "잎 유무 물 감소 비교 → 이번 조건의 잎과 물 배출 관계를 검토한다.",
    "잎의 넓은 모양 → 오늘 녹말 반응이 반드시 확인됐다.",
    "처리 전/후 녹말 검출과 빛 비교 → 이번 조건의 빛과 녹말 생성 관계를 검토한다.",
    "뿌리 사진 → 오늘 흡수한 물의 양을 정확히 안다."
   ],
   "key": [
    1,
    3
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     1,
     3
    ]
   },
   "criteria": "잎 유무 물 감소 비교 → 이번 조건의 잎과 물 배출 관계를 검토한다. / 처리 전/후 녹말 검출과 빛 비교 → 이번 조건의 빛과 녹말 생성 관계를 검토한다.를 모두 고르고 다른 보기를 넣지 않는다."
  },
  {
   "id": "c22-s61-u03-w091",
   "no": 91,
   "section": 6,
   "form": "written",
   "type": "T13",
   "topic": "같은 식물의 역할 분담",
   "prompt": "한 식물의 뿌리·줄기·잎을 세 개의 서로 관계없는 부품이라고 설명했습니다. 물과 양분을 이용해 고쳐 쓰세요.",
   "answer": "뿌리가 물을 흡수하고 줄기가 잎으로 보내요. 잎에서 만들어진 양분은 여러 기관의 생장과 저장에 쓰이므로 기관은 서로 연결돼요.",
   "explanation": "기관별 역할과 기관 사이 관계를 함께 말해야 해요. 물을 공급받는 잎과 잎에서 만든 양분을 이용하는 다른 기관을 연결해 설명해요.",
   "misconception": "물의 흡수·이동·배출과 양분 생성/이동을 기관 사이의 관계로 설명해요.",
   "requirements": [
    "뿌리에서 잎까지 물 경로",
    "잎의 양분 생성",
    "다른 기관 생장/저장과 연결"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "required": [
     "뿌리에서 잎까지 물 경로",
     "잎의 양분 생성",
     "다른 기관 생장/저장과 연결"
    ]
   },
   "lines": 8,
   "criteria": "뿌리에서 잎까지 물 경로 / 잎의 양분 생성 / 다른 기관 생장/저장과 연결"
  },
  {
   "id": "c22-s61-u03-w092",
   "no": 92,
   "section": 6,
   "form": "written",
   "type": "T13",
   "topic": "양분 길을 물 길로 단정",
   "prompt": "뿌리에서 잎으로 가는 물 화살표를 보고 “양분도 언제나 뿌리에서 잎으로만 간다”는 말을 고쳐 쓰세요.",
   "answer": "이 화살표는 흡수한 물의 이동 경로예요. 잎에서 만든 양분은 다른 기관으로 이동해 쓰이거나 저장될 수 있으므로 물과 양분의 출발·쓰임을 구별해요.",
   "explanation": "하나의 화살표에 서로 다른 물질의 이동을 모두 같은 방향으로 넣지 않아요.",
   "misconception": "물의 흡수·이동·배출과 양분 생성/이동을 기관 사이의 관계로 설명해요.",
   "requirements": [
    "물 화살표의 뜻 한정",
    "잎의 양분 생성",
    "다른 기관 이동/쓰임 구별"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "required": [
     "물 화살표의 뜻 한정",
     "잎의 양분 생성",
     "다른 기관 이동/쓰임 구별"
    ]
   },
   "lines": 8,
   "criteria": "물 화살표의 뜻 한정 / 잎의 양분 생성 / 다른 기관 이동/쓰임 구별"
  },
  {
   "id": "c22-s61-u03-w093",
   "no": 93,
   "section": 6,
   "form": "choice",
   "type": "T13",
   "topic": "두 실험을 연결하기",
   "prompt": "뿌리 유무 비교에서는 뿌리 있는 쪽의 물 감소가 컸고, 색소 물에 둔 줄기 내부에는 붉은 자취가 보였습니다. 두 근거를 연결한 설명을 고르세요.",
   "answer": "③ 뿌리로 들어온 물이 줄기를 따라 이동하는 관계를 뒷받침한다.",
   "explanation": "첫 비교는 뿌리의 흡수 역할을, 단면 관찰은 줄기의 물 이동을 뒷받침해요. 각각의 비교 조건을 확인하며 물의 경로로 이어 설명해요.",
   "misconception": "물의 흡수·이동·배출과 양분 생성/이동을 기관 사이의 관계로 설명해요.",
   "choices": [
    "뿌리 유무 비교로 잎에서 물이 만들어짐을 확인했다.",
    "뿌리의 흡수와 줄기의 이동은 서로 관계가 없다는 증거다.",
    "뿌리로 들어온 물이 줄기를 따라 이동하는 관계를 뒷받침한다.",
    "뿌리가 흡수한 물은 뿌리에만 남고 줄기 안 붉은 물은 잎에서 새로 만들어졌다.",
    "줄기 단면의 붉은색만으로 모든 양분의 종류를 확인했다."
   ],
   "key": 2,
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "single-choice",
    "answer": 2
   },
   "criteria": "「뿌리로 들어온 물이 줄기를 따라 이동하는 관계를 뒷받침한다.」을 고른다. 첫 비교는 뿌리의 흡수 역할을, 단면 관찰은 줄기의 물 이동을 뒷받침해요. 각각의 비교 조건을 확인하며 물의 경로로 이어 설명해요."
  },
  {
   "id": "c22-s61-u03-w094",
   "no": 94,
   "section": 6,
   "form": "order",
   "type": "T13",
   "topic": "물 이동 설명 순서",
   "prompt": "제시한 기관을 이용해 흙 속 물이 잎에 도달하는 설명 순서를 쓰세요.",
   "answer": "ㄴ → ㄷ → ㄱ",
   "explanation": "뿌리에서 흡수한 물이 줄기를 지나 잎으로 가는 과정이에요. 양분 생성의 시작 위치와 혼동하지 않아요.",
   "misconception": "물의 흡수·이동·배출과 양분 생성/이동을 기관 사이의 관계로 설명해요.",
   "given": [
    "ㄱ 물이 잎에 도달한다.",
    "ㄴ 흙 속 물을 뿌리가 흡수한다.",
    "ㄷ 물이 줄기를 따라 이동한다."
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "ordered-label-sequence",
    "sequence": [
     "ㄴ",
     "ㄷ",
     "ㄱ"
    ]
   },
   "criteria": "「ㄴ → ㄷ → ㄱ」 또는 명시한 동등 표현. 뿌리에서 흡수한 물이 줄기를 지나 잎으로 가는 과정이에요. 양분 생성의 시작 위치와 혼동하지 않아요."
  },
  {
   "id": "c22-s61-u03-w095",
   "no": 95,
   "section": 6,
   "form": "written",
   "type": "T13",
   "topic": "생활 속 시든 식물",
   "prompt": "잎이 처진 화분을 보고 “뿌리가 반드시 모두 죽었다”고 말했습니다. 관찰과 추론을 나누고 확인할 점을 제안하세요.",
   "answer": "보인 것은 잎이 처졌다는 모습이에요. 흙의 물 상태·주변 온도와 빛·식물 상태를 더 확인해야 하며 뿌리가 모두 죽었다고 단정할 수 없어요.",
   "explanation": "겉모습 하나로 보이지 않는 기관 상태와 원인을 확정하지 않아요. 식물을 함부로 뽑아 확인하는 것을 기본 행동으로 삼지 않아요.",
   "misconception": "물의 흡수·이동·배출과 양분 생성/이동을 기관 사이의 관계로 설명해요.",
   "requirements": [
    "관찰은 잎 처짐이라고 구별",
    "단일 원인 단정 배제",
    "물/환경/식물 상태의 구체적 확인"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "required": [
     "관찰은 잎 처짐이라고 구별",
     "단일 원인 단정 배제",
     "물/환경/식물 상태의 구체적 확인"
    ]
   },
   "lines": 8,
   "criteria": "관찰은 잎 처짐이라고 구별 / 단일 원인 단정 배제 / 물/환경/식물 상태의 구체적 확인"
  },
  {
   "id": "c22-s61-u03-w096",
   "no": 96,
   "section": 6,
   "form": "draw",
   "type": "T13",
   "topic": "기관 연결 지도",
   "prompt": "뿌리·줄기·잎이 있는 식물을 그리고 물과 양분의 연결을 서로 다른 이름표로 표시하세요. 색만으로 두 물질을 구별하지 마세요.",
   "answer": "물: 뿌리→줄기→잎, 양분: 잎에서 생성되어 다른 기관에 쓰임/저장됨을 이름표와 화살표로 설명해요.",
   "explanation": "예쁜 식물 그림보다 어떤 물질이 어디서 와서 어떻게 쓰이는지 드러나는 것이 중요해요. 모든 이동을 한 방향으로만 그리지 않아요.",
   "misconception": "물의 흡수·이동·배출과 양분 생성/이동을 기관 사이의 관계로 설명해요.",
   "requirements": [
    "세 기관 이름",
    "물 흡수/이동 경로",
    "잎 양분 생성과 다른 기관 쓰임 이름표"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "required": [
     "세 기관 이름",
     "물 흡수/이동 경로",
     "잎 양분 생성과 다른 기관 쓰임 이름표"
    ]
   },
   "lines": 0,
   "drawing": "large",
   "criteria": "세 기관 이름 / 물 흡수/이동 경로 / 잎 양분 생성과 다른 기관 쓰임 이름표"
  },
  {
   "id": "c22-s61-u03-w097",
   "no": 97,
   "section": 7,
   "form": "choice",
   "type": "T11",
   "topic": "꽃가루받이",
   "prompt": "꽃가루받이의 뜻을 바르게 설명한 것을 고르세요.",
   "answer": "① 수술의 꽃가루가 암술머리에 닿는 것",
   "explanation": "수술의 꽃가루가 암술머리에 닿는 현상이에요. 씨가 이동하거나 열매가 열리는 것과 구별해요.",
   "misconception": "꽃가루가 암술머리에 닿는 것과 씨가 퍼지는 것을 구별해요.",
   "choices": [
    "수술의 꽃가루가 암술머리에 닿는 것",
    "씨가 퍼지는 과정까지 모두 꽃가루받이라는 것",
    "뿌리가 물을 흡수하는 것",
    "잎의 물이 수증기로 나가는 것",
    "열매가 양분을 흙에서 흡수하는 것"
   ],
   "key": 0,
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "single-choice",
    "answer": 0
   },
   "criteria": "「수술의 꽃가루가 암술머리에 닿는 것」을 고른다. 수술의 꽃가루가 암술머리에 닿는 현상이에요. 씨가 이동하거나 열매가 열리는 것과 구별해요."
  },
  {
   "id": "c22-s61-u03-w098",
   "no": 98,
   "section": 7,
   "form": "blank",
   "type": "T11",
   "topic": "꽃가루의 출발",
   "prompt": "꽃가루가 만들어지는 꽃의 기관은 [ ]이에요.",
   "answer": "수술",
   "explanation": "수술과 암술의 이름을 구별해요. 꽃가루가 만들어지는 곳과 닿는 곳은 역할이 달라요.",
   "misconception": "꽃가루가 암술머리에 닿는 것과 씨가 퍼지는 것을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "수술"
    ]
   },
   "criteria": "「수술」 또는 명시한 동등 표현. 수술과 암술의 이름을 구별해요. 꽃가루가 만들어지는 곳과 닿는 곳은 역할이 달라요."
  },
  {
   "id": "c22-s61-u03-w099",
   "no": 99,
   "section": 7,
   "form": "short",
   "type": "T11",
   "topic": "도착하는 부분",
   "prompt": "꽃가루받이에서 꽃가루가 닿는 암술의 부분 이름을 쓰세요.",
   "answer": "암술머리",
   "explanation": "꽃가루는 수술에서 만들어져 암술머리에 닿아요. 꽃가루가 닿는 부분을 물은 것이며 나중에 씨가 퍼지는 장소를 묻는 것은 아니에요.",
   "misconception": "꽃가루가 암술머리에 닿는 것과 씨가 퍼지는 것을 구별해요.",
   "accepted": [
    "암술 머리"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "암술머리",
     "암술 머리"
    ]
   },
   "criteria": "「암술머리」 또는 명시한 동등 표현. 꽃가루는 수술에서 만들어져 암술머리에 닿아요. 꽃가루가 닿는 부분을 물은 것이며 나중에 씨가 퍼지는 장소를 묻는 것은 아니에요."
  },
  {
   "id": "c22-s61-u03-w100",
   "no": 100,
   "section": 7,
   "form": "multi",
   "type": "T11",
   "topic": "꽃 구조와 역할",
   "prompt": "꽃의 구조와 역할을 바르게 연결한 것을 모두 고르세요.",
   "answer": "①, ③",
   "explanation": "수술은 꽃가루가 만들어지는 기관이고 암술머리는 꽃가루가 닿는 부분이에요. 잎/뿌리의 역할이나 씨 퍼짐과 섞지 않아요.",
   "misconception": "꽃가루가 암술머리에 닿는 것과 씨가 퍼지는 것을 구별해요.",
   "choices": [
    "수술: 꽃가루가 만들어짐",
    "꽃잎: 흙 속 물을 주로 흡수함",
    "암술머리: 꽃가루가 닿음",
    "뿌리: 꽃가루가 만들어짐",
    "기공: 씨를 보호하는 열매 구조"
   ],
   "key": [
    0,
    2
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     0,
     2
    ]
   },
   "criteria": "수술: 꽃가루가 만들어짐 / 암술머리: 꽃가루가 닿음를 모두 고르고 다른 보기를 넣지 않는다."
  },
  {
   "id": "c22-s61-u03-w101",
   "no": 101,
   "section": 7,
   "form": "match",
   "type": "T11",
   "topic": "꽃가루와 씨 구별",
   "prompt": "보기: ㄱ 꽃가루받이 / ㄴ 씨 퍼짐 / ㄷ 뿌리 흡수. 연결하세요.",
   "answer": "(1) ㄴ (2) ㄱ (3) ㄷ",
   "explanation": "꽃가루 이동과 씨 이동은 다른 대상과 단계예요. 기관 기능을 설명할 때 어떤 것이 이동하는지 밝히세요.",
   "misconception": "꽃가루가 암술머리에 닿는 것과 씨가 퍼지는 것을 구별해요.",
   "parts": [
    "(1) 날개 달린 씨가 떨어져 이동한다. [ ]",
    "(2) 꽃가루가 암술머리에 닿는다. [ ]",
    "(3) 흙의 물이 식물로 들어간다. [ ]"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "answerPerPart": true,
   "responseContract": {
    "kind": "ordered-label-parts",
    "answers": [
     "ㄴ",
     "ㄱ",
     "ㄷ"
    ]
   },
   "criteria": "「(1) ㄴ (2) ㄱ (3) ㄷ」 또는 명시한 동등 표현. 꽃가루 이동과 씨 이동은 다른 대상과 단계예요. 기관 기능을 설명할 때 어떤 것이 이동하는지 밝히세요."
  },
  {
   "id": "c22-s61-u03-w102",
   "no": 102,
   "section": 7,
   "form": "written",
   "type": "T11",
   "topic": "벌이 앉은 사진",
   "prompt": "벌이 꽃에 앉은 사진 한 장을 보고 “이 꽃은 이미 씨를 만들었다”고 말할 수 없는 까닭을 쓰세요.",
   "answer": "사진은 벌이 꽃에 온 모습을 보여 줘요. 꽃가루가 실제 암술머리에 닿았는지와 뒤에 씨가 생겼는지는 다른 단계라 추가 관찰이 필요해요.",
   "explanation": "꽃 방문·꽃가루받이·씨 형성의 근거를 구별해요. 특정 꽃에 앉은 것만으로 모든 뒤 과정을 확정하지 않아요.",
   "misconception": "꽃가루가 암술머리에 닿는 것과 씨가 퍼지는 것을 구별해요.",
   "requirements": [
    "사진의 관찰 범위",
    "꽃가루받이 여부 별도",
    "나중 씨 형성의 추가 관찰"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "required": [
     "사진의 관찰 범위",
     "꽃가루받이 여부 별도",
     "나중 씨 형성의 추가 관찰"
    ]
   },
   "lines": 8,
   "criteria": "사진의 관찰 범위 / 꽃가루받이 여부 별도 / 나중 씨 형성의 추가 관찰"
  },
  {
   "id": "c22-s61-u03-w103",
   "no": 103,
   "section": 7,
   "form": "choice",
   "type": "T12",
   "topic": "열매의 역할",
   "prompt": "씨가 들어 있는 꼬투리를 관찰했습니다. 열매의 역할과 연결한 설명을 고르세요.",
   "answer": "⑤ 안의 씨를 둘러싸 보호한다.",
   "explanation": "꼬투리 같은 열매는 씨를 둘러싸 보호해요. 잎이 빛을 받거나 뿌리가 물을 흡수하는 역할과 구별해요.",
   "misconception": "열매의 보호 역할과 씨의 퍼짐을 실제 특징에 근거해 설명해요.",
   "choices": [
    "흙 속 물을 주로 흡수한다.",
    "꽃가루를 암술머리에 보낸다.",
    "잎에서 수증기가 나가는 구멍이다.",
    "식물의 모든 양분을 빛 없이 만든다.",
    "안의 씨를 둘러싸 보호한다."
   ],
   "key": 4,
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "single-choice",
    "answer": 4
   },
   "criteria": "「안의 씨를 둘러싸 보호한다.」을 고른다. 꼬투리 같은 열매는 씨를 둘러싸 보호해요. 잎이 빛을 받거나 뿌리가 물을 흡수하는 역할과 구별해요."
  },
  {
   "id": "c22-s61-u03-w104",
   "no": 104,
   "section": 7,
   "form": "blank",
   "type": "T12",
   "topic": "보호받는 것",
   "prompt": "씨가 들어 있는 열매는 안의 [ ]를 보호하는 역할을 해요.",
   "answer": "씨",
   "explanation": "열매와 씨는 같은 이름이 아니에요. 열매 안의 씨와 둘러싼 부분을 실제 관찰로 구별해요.",
   "misconception": "열매의 보호 역할과 씨의 퍼짐을 실제 특징에 근거해 설명해요.",
   "accepted": [
    "씨앗"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "씨",
     "씨앗"
    ]
   },
   "criteria": "「씨」 또는 명시한 동등 표현. 열매와 씨는 같은 이름이 아니에요. 열매 안의 씨와 둘러싼 부분을 실제 관찰로 구별해요."
  },
  {
   "id": "c22-s61-u03-w105",
   "no": 105,
   "section": 7,
   "form": "short",
   "type": "T12",
   "topic": "퍼짐의 단서",
   "prompt": "연습 관찰 기록: 가는 갈고리가 있어 털에 붙고, 나는 얇은 날개가 있습니다. 털에 붙어 이동하기 쉬운 쪽의 기호를 쓰세요.",
   "answer": "가",
   "explanation": "갈고리 같은 구조는 털에 붙는 데 도움을 줘요. 모양에서 가능한 이동 방법을 설명하되 이번에 실제 이동을 보았다고 바꾸지 않아요.",
   "misconception": "열매의 보호 역할과 씨의 퍼짐을 실제 특징에 근거해 설명해요.",
   "table": {
    "heads": [
     "기호",
     "관찰 특징"
    ],
    "rows": [
     [
      "가",
      "갈고리처럼 휘어진 부분"
     ],
     [
      "나",
      "얇고 넓은 날개 같은 부분"
     ]
    ]
   },
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "가"
    ]
   },
   "criteria": "「가」 또는 명시한 동등 표현. 갈고리 같은 구조는 털에 붙는 데 도움을 줘요. 모양에서 가능한 이동 방법을 설명하되 이번에 실제 이동을 보았다고 바꾸지 않아요.",
   "dataNature": "provided-practice-data-not-student-measurement",
   "figure": "plant-question-data-105"
  },
  {
   "id": "c22-s61-u03-w106",
   "no": 106,
   "section": 7,
   "form": "multi",
   "type": "T12",
   "topic": "특징으로 설명하기",
   "prompt": "씨나 열매의 퍼짐을 특징과 연결한 설명으로 알맞은 것을 모두 고르세요.",
   "answer": "③, ⑤",
   "explanation": "구조와 가능한 이동 방법을 연결해야 해요. 모든 씨가 같은 모양이나 수단으로 퍼지는 것은 아니에요.",
   "misconception": "열매의 보호 역할과 씨의 퍼짐을 실제 특징에 근거해 설명해요.",
   "choices": [
    "빛을 받은 모든 잎은 곧 씨가 된다.",
    "모든 씨는 반드시 바람으로만 퍼진다.",
    "갈고리 같은 부분은 동물의 털에 붙는 데 도움을 줄 수 있다.",
    "크기가 크면 다른 특징 없이 무조건 가장 멀리 난다.",
    "날개 같은 구조는 바람에 의한 이동에 도움을 줄 수 있다."
   ],
   "key": [
    2,
    4
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     2,
     4
    ]
   },
   "criteria": "갈고리 같은 부분은 동물의 털에 붙는 데 도움을 줄 수 있다. / 날개 같은 구조는 바람에 의한 이동에 도움을 줄 수 있다.를 모두 고르고 다른 보기를 넣지 않는다."
  },
  {
   "id": "c22-s61-u03-w107",
   "no": 107,
   "section": 7,
   "form": "written",
   "type": "T12",
   "topic": "실제 퍼짐과 모형",
   "prompt": "종이 날개 모형을 떨어뜨려 보고 “실제 나무 씨가 오늘 이 거리만큼 이동했다”고 썼습니다. 설명을 고치세요.",
   "answer": "종이 모형에서 날개 모양과 떨어지는 모습을 비교했다고 써요. 실제 씨의 재료·무게·바람과 달라 나무 씨의 실제 이동 거리를 잰 결과로 바꿀 수 없어요.",
   "explanation": "모형은 구조와 가능한 역할을 생각하는 도구예요. 실제 씨의 현장 관찰과 구별해요.",
   "misconception": "열매의 보호 역할과 씨의 퍼짐을 실제 특징에 근거해 설명해요.",
   "requirements": [
    "종이 모형 비교라고 명시",
    "재료/무게/바람 차이",
    "실제 씨 이동 거리 주장 배제"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "required": [
     "종이 모형 비교라고 명시",
     "재료/무게/바람 차이",
     "실제 씨 이동 거리 주장 배제"
    ]
   },
   "lines": 8,
   "criteria": "종이 모형 비교라고 명시 / 재료/무게/바람 차이 / 실제 씨 이동 거리 주장 배제"
  },
  {
   "id": "c22-s61-u03-w108",
   "no": 108,
   "section": 7,
   "form": "written",
   "type": "T11",
   "topic": "식물 이름으로 단정",
   "prompt": "이름에 ‘물’이 들어 있다는 이유만으로 꽃가루받이도 물이 한다고 설명했습니다. 타당한 설명을 위해 필요한 근거를 쓰세요.",
   "answer": "이름 대신 꽃의 구조·실제 꽃가루 이동 관찰이나 그 식물을 확인한 신뢰할 수 있는 자료가 필요해요. 학명이 같은 식물인지도 확인해요.",
   "explanation": "이름·사는 곳만으로 꽃가루 이동 수단을 단정하지 않아요. 비슷한 이름의 다른 종 자료를 같은 식물 근거로 바꾸지 않아요.",
   "misconception": "꽃가루가 암술머리에 닿는 것과 씨가 퍼지는 것을 구별해요.",
   "requirements": [
    "이름만으로 단정 배제",
    "구조/관찰/신뢰 자료 요구",
    "같은 식물인지 확인"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "required": [
     "이름만으로 단정 배제",
     "구조/관찰/신뢰 자료 요구",
     "같은 식물인지 확인"
    ]
   },
   "lines": 8,
   "criteria": "이름만으로 단정 배제 / 구조/관찰/신뢰 자료 요구 / 같은 식물인지 확인"
  },
  {
   "id": "c22-s61-u03-w109",
   "no": 109,
   "section": 7,
   "form": "choice",
   "type": "T12",
   "topic": "단계 구별",
   "prompt": "씨가 든 열매가 열린 뒤 씨가 주변으로 퍼졌습니다. 직접 관찰한 단계에 맞는 제목을 고르세요.",
   "answer": "③ 씨가 주변으로 퍼지는 모습",
   "explanation": "이 장면은 씨의 퍼짐이에요. 꽃가루가 암술머리에 닿는 꽃가루받이와 다른 단계예요.",
   "misconception": "열매의 보호 역할과 씨의 퍼짐을 실제 특징에 근거해 설명해요.",
   "choices": [
    "잎에서 녹말을 검출하는 모습",
    "줄기 단면에서 색소를 관찰하는 모습",
    "씨가 주변으로 퍼지는 모습",
    "꽃가루가 암술머리에 닿는 모습",
    "뿌리가 흙의 물을 흡수하는 모습"
   ],
   "key": 2,
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "single-choice",
    "answer": 2
   },
   "criteria": "「씨가 주변으로 퍼지는 모습」을 고른다. 이 장면은 씨의 퍼짐이에요. 꽃가루가 암술머리에 닿는 꽃가루받이와 다른 단계예요."
  },
  {
   "id": "c22-s61-u03-w110",
   "no": 110,
   "section": 7,
   "form": "order",
   "type": "T11",
   "topic": "관찰 기록의 시간 순서",
   "prompt": "같은 식물의 제시된 시기 기록을 시간 순서대로 쓰세요. 꽃가루받이와 씨 퍼짐을 구별하세요.",
   "answer": "ㄷ → ㄱ → ㄴ",
   "explanation": "제시한 기록은 꽃에서 꽃가루받이가 관찰된 뒤 씨가 든 열매를 확인하고 나중에 씨가 퍼진 순서예요. 사진 한 장에서 모두 본 것은 아니에요.",
   "misconception": "꽃가루가 암술머리에 닿는 것과 씨가 퍼지는 것을 구별해요.",
   "given": [
    "ㄱ 뒤에 씨가 든 열매를 관찰함",
    "ㄴ 열매에서 나온 씨가 퍼지는 것을 관찰함",
    "ㄷ 꽃가루가 암술머리에 닿는 것을 관찰함"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "ordered-label-sequence",
    "sequence": [
     "ㄷ",
     "ㄱ",
     "ㄴ"
    ]
   },
   "criteria": "「ㄷ → ㄱ → ㄴ」 또는 명시한 동등 표현. 제시한 기록은 꽃에서 꽃가루받이가 관찰된 뒤 씨가 든 열매를 확인하고 나중에 씨가 퍼진 순서예요. 사진 한 장에서 모두 본 것은 아니에요."
  },
  {
   "id": "c22-s61-u03-w111",
   "no": 111,
   "section": 7,
   "form": "written",
   "type": "T12",
   "topic": "한 씨에서 모든 씨로",
   "prompt": "날개 있는 씨 하나를 관찰하고 “모든 식물의 씨에는 날개가 있다”고 결론 내렸습니다. 어떻게 보완할까요?",
   "answer": "이 씨에는 날개가 있다고 범위를 한정해요. 다른 씨의 구조도 관찰·비교하여 갈고리·날개 등 서로 다른 특징과 퍼짐 방법을 설명해요.",
   "explanation": "한 관찰 대상의 특징을 전체 식물의 공통 특징으로 만들지 않아요. 여러 자료를 비교해야 해요.",
   "misconception": "열매의 보호 역할과 씨의 퍼짐을 실제 특징에 근거해 설명해요.",
   "requirements": [
    "관찰 대상 한정",
    "다른 씨 구조 비교",
    "특징/퍼짐 방법의 다양성"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "required": [
     "관찰 대상 한정",
     "다른 씨 구조 비교",
     "특징/퍼짐 방법의 다양성"
    ]
   },
   "lines": 8,
   "criteria": "관찰 대상 한정 / 다른 씨 구조 비교 / 특징/퍼짐 방법의 다양성"
  },
  {
   "id": "c22-s61-u03-w112",
   "no": 112,
   "section": 7,
   "form": "draw",
   "type": "T12",
   "topic": "열매와 씨의 구조 그리기",
   "prompt": "실제로 관찰하거나 출처 있는 자료에서 확인한 열매 또는 씨 하나를 그리세요. 구조 이름표를 붙이고 씨 보호나 퍼짐에 도움을 주는 특징을 설명하세요.",
   "answer": "선택한 대상을 크게 그리고 씨를 둘러싼 부분이나 날개/갈고리 등 실제 확인한 구조를 표시해요. 그 특징과 보호 또는 가능한 퍼짐 방법을 연결하고 관찰/조사 출처를 적어요.",
   "explanation": "직접 보지 않은 구조를 꾸며 넣지 않아요. 아직 대상을 고르지 않았다면 실제 관찰이나 자료 확인을 먼저 하고 그림을 이어서 그려요.",
   "misconception": "열매의 보호 역할과 씨의 퍼짐을 실제 특징에 근거해 설명해요.",
   "requirements": [
    "대상과 관찰/조사 출처",
    "확인한 구조의 그림과 이름표",
    "보호/퍼짐 역할을 구조 근거로 설명"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "required": [
     "대상과 관찰/조사 출처",
     "확인한 구조의 그림과 이름표",
     "보호/퍼짐 역할을 구조 근거로 설명"
    ]
   },
   "lines": 0,
   "drawing": "large",
   "criteria": "대상과 관찰/조사 출처 / 확인한 구조의 그림과 이름표 / 보호/퍼짐 역할을 구조 근거로 설명"
  },
  {
   "id": "c22-s61-u03-w113",
   "no": 113,
   "section": 8,
   "form": "choice",
   "type": "T14",
   "topic": "설명 자료의 초점",
   "prompt": "관심 있는 식물의 구조와 기능을 설명하는 자료를 만들려고 합니다. 알맞은 주제를 고르세요.",
   "answer": "① 연잎의 생김새를 관찰하고 빛 받기와 연결해 설명하기",
   "explanation": "어떤 구조가 어떤 역할과 관련되는지 관찰·조사 근거로 설명해야 해요. 사진 수나 예쁜 장식만으로 설명을 대신하지 않아요.",
   "misconception": "관찰·출처가 있는 조사와 설명을 연결하고 실제 자료를 만들어 친구에게 보여 줘요.",
   "choices": [
    "연잎의 생김새를 관찰하고 빛 받기와 연결해 설명하기",
    "식물 사진을 많이 모으고 이름은 모두 지우기",
    "같은 식물을 보지 않고 모든 식물의 특징이 같다고 적기",
    "나의 관찰 대신 친구 작품을 내 것이라고 붙이기",
    "인터넷 제목만 보고 실험을 했다고 쓰기"
   ],
   "key": 0,
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "single-choice",
    "answer": 0
   },
   "criteria": "「연잎의 생김새를 관찰하고 빛 받기와 연결해 설명하기」을 고른다. 어떤 구조가 어떤 역할과 관련되는지 관찰·조사 근거로 설명해야 해요. 사진 수나 예쁜 장식만으로 설명을 대신하지 않아요."
  },
  {
   "id": "c22-s61-u03-w114",
   "no": 114,
   "section": 8,
   "form": "blank",
   "type": "T14",
   "topic": "자료의 바탕",
   "prompt": "직접 관찰이 아니라 책이나 기관 자료에서 알아본 내용에는 [ ]를 밝혀요.",
   "answer": "출처",
   "explanation": "조사 내용의 근거를 다른 사람이 확인할 수 있어야 해요. 실제 관찰과 조사한 내용을 구별해 설명해요.",
   "misconception": "관찰·출처가 있는 조사와 설명을 연결하고 실제 자료를 만들어 친구에게 보여 줘요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "출처"
    ]
   },
   "criteria": "「출처」 또는 명시한 동등 표현. 조사 내용의 근거를 다른 사람이 확인할 수 있어야 해요. 실제 관찰과 조사한 내용을 구별해 설명해요."
  },
  {
   "id": "c22-s61-u03-w115",
   "no": 115,
   "section": 8,
   "form": "short",
   "type": "T14",
   "topic": "주장과 근거 선택",
   "prompt": "설명: “이 식물의 줄기는 잎을 지지한다.” 보기: 꽃의 색 이름 / 줄기와 잎의 연결 관찰 / 다른 식물의 씨 사진. 알맞은 근거를 쓰세요.",
   "answer": "줄기와 잎의 연결 관찰",
   "explanation": "설명하려는 역할과 직접 관련된 구조를 관찰해야 해요. 다른 기관의 색이나 다른 식물 사진만으로 지지 역할을 설명하기 어려워요.",
   "misconception": "관찰·출처가 있는 조사와 설명을 연결하고 실제 자료를 만들어 친구에게 보여 줘요.",
   "accepted": [
    "줄기와 잎의 연결",
    "줄기와 잎 연결 관찰"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "줄기와 잎의 연결 관찰",
     "줄기와 잎의 연결",
     "줄기와 잎 연결 관찰"
    ]
   },
   "criteria": "「줄기와 잎의 연결 관찰」 또는 명시한 동등 표현. 설명하려는 역할과 직접 관련된 구조를 관찰해야 해요. 다른 기관의 색이나 다른 식물 사진만으로 지지 역할을 설명하기 어려워요."
  },
  {
   "id": "c22-s61-u03-w116",
   "no": 116,
   "section": 8,
   "form": "multi",
   "type": "T14",
   "topic": "한 장 자료에 담기",
   "prompt": "식물 특징을 설명하는 한 장 자료에 담을 내용으로 알맞은 것을 모두 고르세요.",
   "answer": "①, ②, ④",
   "explanation": "대상·구조·역할과 관찰/조사 근거가 이어져야 해요. 관찰하지 않은 결과를 채우거나 생김새만 장식하지 않아요.",
   "misconception": "관찰·출처가 있는 조사와 설명을 연결하고 실제 자료를 만들어 친구에게 보여 줘요.",
   "choices": [
    "관찰 그림/사진이나 확인한 자료의 출처",
    "식물 이름과 다룰 구조",
    "직접 보지 않은 결과를 나의 관찰이라고 표시",
    "구조와 기능을 연결한 설명",
    "출처를 지우고 내가 발견했다고 쓰기"
   ],
   "key": [
    0,
    1,
    3
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     0,
     1,
     3
    ]
   },
   "criteria": "관찰 그림/사진이나 확인한 자료의 출처 / 식물 이름과 다룰 구조 / 구조와 기능을 연결한 설명를 모두 고르고 다른 보기를 넣지 않는다."
  },
  {
   "id": "c22-s61-u03-w117",
   "no": 117,
   "section": 8,
   "form": "match",
   "type": "T14",
   "topic": "자료의 성격",
   "prompt": "보기: ㄱ 직접 관찰 / ㄴ 출처 있는 조사 / ㄷ 아직 확인 못 한 예상. 연결하세요.",
   "answer": "(1) ㄴ (2) ㄷ (3) ㄱ",
   "explanation": "관찰·조사·예상을 구별하면 설명의 근거가 무엇인지 드러나요. 예상을 실제 결과로 바꾸지 않아요.",
   "misconception": "관찰·출처가 있는 조사와 설명을 연결하고 실제 자료를 만들어 친구에게 보여 줘요.",
   "parts": [
    "(1) 식물원 안내 본문에서 읽고 출처를 적었다. [ ]",
    "(2) 아직 보지 않았지만 이런 모양일 것 같다고 생각했다. [ ]",
    "(3) 교실 화분을 보고 잎과 줄기 연결을 그렸다. [ ]"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "answerPerPart": true,
   "responseContract": {
    "kind": "ordered-label-parts",
    "answers": [
     "ㄴ",
     "ㄷ",
     "ㄱ"
    ]
   },
   "criteria": "「(1) ㄴ (2) ㄷ (3) ㄱ」 또는 명시한 동등 표현. 관찰·조사·예상을 구별하면 설명의 근거가 무엇인지 드러나요. 예상을 실제 결과로 바꾸지 않아요."
  },
  {
   "id": "c22-s61-u03-w118",
   "no": 118,
   "section": 8,
   "form": "written",
   "type": "T14",
   "topic": "생김새에서 기능으로",
   "prompt": "“잎은 넓다”라는 설명을 구조와 기능이 연결되도록 고치고 어떤 자료로 확인할지 쓰세요.",
   "answer": "관찰한 이 잎은 넓게 펼쳐져 빛을 받는 데 도움이 된다고 설명해요. 실제 잎의 모습과 배운 양분 생성의 관계를 구별해 근거로 들어요.",
   "explanation": "모양 관찰과 기능 해석을 연결하되 이 잎에서 오늘 녹말을 검출했다고 꾸미지 않아요.",
   "misconception": "관찰·출처가 있는 조사와 설명을 연결하고 실제 자료를 만들어 친구에게 보여 줘요.",
   "requirements": [
    "관찰 대상의 넓은 잎",
    "빛 받기와의 기능 연결",
    "실제 관찰/배운 원리와 미수행 실험 구별"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "required": [
     "관찰 대상의 넓은 잎",
     "빛 받기와의 기능 연결",
     "실제 관찰/배운 원리와 미수행 실험 구별"
    ]
   },
   "lines": 8,
   "criteria": "관찰 대상의 넓은 잎 / 빛 받기와의 기능 연결 / 실제 관찰/배운 원리와 미수행 실험 구별"
  },
  {
   "id": "c22-s61-u03-w119",
   "no": 119,
   "section": 8,
   "form": "choice",
   "type": "T14",
   "topic": "실제로 공유한 것",
   "prompt": "설명 자료를 저장했지만 아직 친구에게 보여 주지 않았습니다. 현재 상태를 고르세요.",
   "answer": "④ 제작했으며 공유는 아직 남아 있다.",
   "explanation": "자료를 만든 것과 다른 사람에게 보여 주고 설명한 것은 다른 활동이에요. 교실 안에서 실제로 나누는 시간을 이어서 가져요.",
   "misconception": "관찰·출처가 있는 조사와 설명을 연결하고 실제 자료를 만들어 친구에게 보여 줘요.",
   "choices": [
    "친구 질문을 예상했으므로 질문을 실제로 받았다.",
    "파일 이름만 쓰면 관찰도 끝났다.",
    "자료를 지우면 공유한 것으로 처리된다.",
    "제작했으며 공유는 아직 남아 있다.",
    "저장했으므로 친구 설명도 끝났다."
   ],
   "key": 3,
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "single-choice",
    "answer": 3
   },
   "criteria": "「제작했으며 공유는 아직 남아 있다.」을 고른다. 자료를 만든 것과 다른 사람에게 보여 주고 설명한 것은 다른 활동이에요. 교실 안에서 실제로 나누는 시간을 이어서 가져요."
  },
  {
   "id": "c22-s61-u03-w120",
   "no": 120,
   "section": 8,
   "form": "blank",
   "type": "T14",
   "topic": "구조와 역할 잇기",
   "prompt": "설명 자료에서는 “어떻게 생겼는가”와 “어떤 [ ]을 하는가”를 연결해요.",
   "answer": "역할",
   "explanation": "구조 이름만 나열하지 않고 기능과 근거를 함께 담아요. 예를 들어 관찰한 줄기와 잎의 연결 모습을 제시하며 지지 역할을 설명할 수 있어요.",
   "misconception": "관찰·출처가 있는 조사와 설명을 연결하고 실제 자료를 만들어 친구에게 보여 줘요.",
   "accepted": [
    "일",
    "기능"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "역할",
     "일",
     "기능"
    ]
   },
   "criteria": "「역할」 또는 명시한 동등 표현. 구조 이름만 나열하지 않고 기능과 근거를 함께 담아요. 예를 들어 관찰한 줄기와 잎의 연결 모습을 제시하며 지지 역할을 설명할 수 있어요."
  },
  {
   "id": "c22-s61-u03-w121",
   "no": 121,
   "section": 8,
   "form": "short",
   "type": "T14",
   "topic": "고칠 표현",
   "prompt": "“내가 직접 실험했다”라고 썼지만 실제로는 기관의 설명 자료를 읽었습니다. 활동 이름을 무엇으로 고칠까요?",
   "answer": "자료 조사",
   "explanation": "읽은 자료의 출처를 밝히고 조사라고 써요. 직접 실험 결과와 같은 것으로 표시하지 않아요.",
   "misconception": "관찰·출처가 있는 조사와 설명을 연결하고 실제 자료를 만들어 친구에게 보여 줘요.",
   "accepted": [
    "조사",
    "자료를 조사했다",
    "출처 있는 자료 조사"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "short-text",
    "accepted": [
     "자료 조사",
     "조사",
     "자료를 조사했다",
     "출처 있는 자료 조사"
    ]
   },
   "criteria": "「자료 조사」 또는 명시한 동등 표현. 읽은 자료의 출처를 밝히고 조사라고 써요. 직접 실험 결과와 같은 것으로 표시하지 않아요."
  },
  {
   "id": "c22-s61-u03-w122",
   "no": 122,
   "section": 8,
   "form": "multi",
   "type": "T14",
   "topic": "친구에게 설명하기",
   "prompt": "만든 자료를 친구에게 나눌 때 알맞은 행동을 모두 고르세요.",
   "answer": "①, ④",
   "explanation": "구조와 기능·근거를 설명하고 실제 질문을 바탕으로 보완해요. 공개 인터넷 게시나 긴 보고서를 기본 요구로 만들 필요는 없어요.",
   "misconception": "관찰·출처가 있는 조사와 설명을 연결하고 실제 자료를 만들어 친구에게 보여 줘요.",
   "choices": [
    "실제 질문을 듣고 빠진 근거를 보완한다.",
    "공개 게시를 해야만 공유한 것으로 인정한다.",
    "보여 주지 않고 질문을 받았다고 쓴다.",
    "교실에서 자료를 보여 주며 구조·역할·근거를 설명한다.",
    "헷갈리는 부분은 출처를 지워 숨긴다."
   ],
   "key": [
    0,
    3
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     0,
     3
    ]
   },
   "criteria": "실제 질문을 듣고 빠진 근거를 보완한다. / 교실에서 자료를 보여 주며 구조·역할·근거를 설명한다.를 모두 고르고 다른 보기를 넣지 않는다."
  },
  {
   "id": "c22-s61-u03-w123",
   "no": 123,
   "section": 8,
   "form": "written",
   "type": "T14",
   "topic": "받은 질문으로 고치기",
   "prompt": "친구가 “줄기가 잎을 받친다는 근거가 그림 어디에 있니?”라고 물었습니다. 자료를 어떻게 보완하고 설명할지 쓰세요.",
   "answer": "잎이 줄기와 연결된 부분을 크게 보여 주고 이름표를 붙여요. 관찰한 부분과 지지 기능을 연결한 문장을 덧붙여 다시 설명해요.",
   "explanation": "실제 질문이 지적한 빠진 근거를 보완해야 해요. 그림을 더 화려하게만 꾸미는 것으로 대신하지 않아요.",
   "misconception": "관찰·출처가 있는 조사와 설명을 연결하고 실제 자료를 만들어 친구에게 보여 줘요.",
   "requirements": [
    "연결 부분 확대/표시",
    "관찰과 지지 역할 연결",
    "보완 내용을 실제 다시 설명할 계획/행동"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "required": [
     "연결 부분 확대/표시",
     "관찰과 지지 역할 연결",
     "보완 내용을 실제 다시 설명할 계획/행동"
    ]
   },
   "lines": 8,
   "criteria": "연결 부분 확대/표시 / 관찰과 지지 역할 연결 / 보완 내용을 실제 다시 설명할 계획/행동"
  },
  {
   "id": "c22-s61-u03-w124",
   "no": 124,
   "section": 8,
   "form": "written",
   "type": "T14",
   "topic": "전체 사진과 부분 확대",
   "prompt": "설명 자료에는 식물 전체 사진과 확대 그림이 따로 놓여 있어 친구가 같은 구조인지 헷갈려 합니다. 두 자료와 기능 설명을 어떻게 연결할지 쓰세요.",
   "answer": "전체 사진에서 확대한 위치를 테두리나 이름표로 표시하고 확대 그림과 이어 줘요. 확대된 구조의 이름과 역할을 문장으로 연결하고 관찰/자료 출처를 밝혀요.",
   "explanation": "사진을 크게 놓는 것만으로 구조와 기능의 관계가 드러나지는 않아요. 전체에서 어느 부분을 본 것인지 먼저 읽을 수 있어야 해요.",
   "misconception": "관찰·출처가 있는 조사와 설명을 연결하고 실제 자료를 만들어 친구에게 보여 줘요.",
   "requirements": [
    "전체와 확대한 부분의 위치 연결",
    "구조 이름과 기능 문장 연결",
    "관찰/자료 근거와 출처 표시"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "required": [
     "전체와 확대한 부분의 위치 연결",
     "구조 이름과 기능 문장 연결",
     "관찰/자료 근거와 출처 표시"
    ]
   },
   "lines": 8,
   "criteria": "전체와 확대한 부분의 위치 연결 / 구조 이름과 기능 문장 연결 / 관찰/자료 근거와 출처 표시"
  },
  {
   "id": "c22-s61-u03-w125",
   "no": 125,
   "section": 8,
   "form": "choice",
   "type": "T14",
   "topic": "설명 범위 확인",
   "prompt": "화분 한 개의 잎을 본 자료에 알맞은 문장을 고르세요.",
   "answer": "② 관찰한 이 화분의 잎 특징과 관련된 역할을 설명했다.",
   "explanation": "본 대상과 자료 범위를 밝혀야 해요. 한 화분의 잎을 보고 모든 식물의 구조·환경 반응을 같다고 하지 않아요.",
   "misconception": "관찰·출처가 있는 조사와 설명을 연결하고 실제 자료를 만들어 친구에게 보여 줘요.",
   "choices": [
    "출처를 지워 직접 발견한 사실로 바꾸었다.",
    "관찰한 이 화분의 잎 특징과 관련된 역할을 설명했다.",
    "다른 화분에서 조사한 내용도 내 직접 관찰 결과이다.",
    "사진 한 장으로 모든 기관 기능 실험을 마쳤다.",
    "잎의 색으로 모든 양분의 양을 정확히 계산했다."
   ],
   "key": 1,
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "single-choice",
    "answer": 1
   },
   "criteria": "「관찰한 이 화분의 잎 특징과 관련된 역할을 설명했다.」을 고른다. 본 대상과 자료 범위를 밝혀야 해요. 한 화분의 잎을 보고 모든 식물의 구조·환경 반응을 같다고 하지 않아요."
  },
  {
   "id": "c22-s61-u03-w126",
   "no": 126,
   "section": 8,
   "form": "order",
   "type": "T14",
   "topic": "만들어 나누기",
   "prompt": "식물 설명 자료를 만들고 나누는 흐름을 순서대로 쓰세요.",
   "answer": "ㄱ → ㄷ → ㄴ → ㄹ",
   "explanation": "대상과 질문을 고르고 관찰·조사한 근거를 모은 뒤 자료를 만들어요. 실제로 친구에게 보여 주고 설명을 다듬어요.",
   "misconception": "관찰·출처가 있는 조사와 설명을 연결하고 실제 자료를 만들어 친구에게 보여 줘요.",
   "given": [
    "ㄱ 식물과 설명할 구조/역할을 고른다.",
    "ㄴ 그림·이름표·근거 문장으로 한 장 자료를 만든다.",
    "ㄷ 실제 관찰하거나 출처 있는 자료를 조사한다.",
    "ㄹ 친구에게 보여 주고 설명하며 질문에 답한다."
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "ordered-label-sequence",
    "sequence": [
     "ㄱ",
     "ㄷ",
     "ㄴ",
     "ㄹ"
    ]
   },
   "criteria": "「ㄱ → ㄷ → ㄴ → ㄹ」 또는 명시한 동등 표현. 대상과 질문을 고르고 관찰·조사한 근거를 모은 뒤 자료를 만들어요. 실제로 친구에게 보여 주고 설명을 다듬어요."
  },
  {
   "id": "c22-s61-u03-w127",
   "no": 127,
   "section": 8,
   "form": "written",
   "type": "T14",
   "topic": "완성 자료 점검",
   "prompt": "사진은 크지만 식물 이름·구조 이름·역할·근거가 빠져 있습니다. 설명 자료로 바꿀 세 가지 이상의 보완점을 쓰세요.",
   "answer": "대상 식물과 구조 이름을 쓰고, 구조가 어떤 기능에 관련되는지 문장으로 연결해요. 직접 관찰인지 조사인지 밝히고 자료 출처/관찰 근거를 붙여요.",
   "explanation": "사진의 사실감이나 크기는 설명의 근거를 대신하지 않아요. 친구가 무엇을 보고 어떤 역할을 이해할지 드러나야 해요.",
   "misconception": "관찰·출처가 있는 조사와 설명을 연결하고 실제 자료를 만들어 친구에게 보여 줘요.",
   "requirements": [
    "대상/구조 이름",
    "기능 연결 문장",
    "관찰/조사 근거·출처"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "required": [
     "대상/구조 이름",
     "기능 연결 문장",
     "관찰/조사 근거·출처"
    ]
   },
   "lines": 8,
   "criteria": "대상/구조 이름 / 기능 연결 문장 / 관찰/조사 근거·출처"
  },
  {
   "id": "c22-s61-u03-w128",
   "no": 128,
   "section": 8,
   "form": "draw",
   "type": "T14",
   "topic": "나의 식물 설명 한 장",
   "prompt": "관심 있는 식물 하나의 구조·기능을 설명할 한 장 자료의 배치를 그리세요. 큰 그림, 구조 이름표, 근거 문장과 출처를 넣을 자리를 마련하고 실제 제작·설명을 이어서 하세요.",
   "answer": "제목/식물 이름, 큰 그림과 구조 이름표, 역할을 연결한 근거 문장, 관찰/조사 출처를 놓아요. 배치안만 그린 상태와 완성 자료를 실제 나눈 활동을 구별해요.",
   "explanation": "짧은 한 장 자료로 실제 설명하는 과제예요. 긴 탐구보고서나 공개 인터넷 게시를 기본으로 요구하지 않아요.",
   "misconception": "관찰·출처가 있는 조사와 설명을 연결하고 실제 자료를 만들어 친구에게 보여 줘요.",
   "requirements": [
    "큰 그림/식물·구조 이름",
    "역할과 근거 문장 자리",
    "관찰/출처 표시와 실제 제작/공유 구별"
   ],
   "origin": "independently-authored-current-curriculum",
   "status": "authored-draft",
   "standard": "6과11-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅲ. 식물의 구조와 기능",
    "originalExam": false
   },
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "required": [
     "큰 그림/식물·구조 이름",
     "역할과 근거 문장 자리",
     "관찰/출처 표시와 실제 제작/공유 구별"
    ]
   },
   "lines": 0,
   "drawing": "large",
   "criteria": "큰 그림/식물·구조 이름 / 역할과 근거 문장 자리 / 관찰/출처 표시와 실제 제작/공유 구별"
  }
 ],
 "pages": [
  {
   "section": "시작하기",
   "title": "식물의 구조와 기능",
   "blocks": [
    {
     "type": "diagram",
     "key": "observe",
     "caption": ""
    },
    {
     "type": "text",
     "text": "현미경으로 작은 세포를 보고 식물 기관의 기능을 실제 비교 실험으로 알아봐요. 물과 양분으로 기관의 관계를 설명하고 관심 식물의 특징 자료를 만들어 나누어요."
    },
    {
     "type": "field",
     "title": "내가 알아보고 싶은 식물",
     "hint": "이름·날짜와 관찰하거나 설명하고 싶은 부분을 적어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 세포 관찰 → 기관 기능 비교 → 특징 자료 제작·설명으로 이어져요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "제공된 연습 자료와 실제 학생 관찰은 구별해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "차례와 공부 방법",
   "title": "관찰에서 근거 있는 설명으로",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "차례",
      "연습 문항"
     ],
     "rows": [
      [
       "1. 현미경으로 만나는 세포",
       "1~16번"
      ],
      [
       "2. 뿌리의 구조와 물 흡수",
       "17~32번"
      ],
      [
       "3. 줄기를 따라 움직이는 물",
       "33~48번"
      ],
      [
       "4. 잎이 만드는 양분의 근거",
       "49~64번"
      ],
      [
       "5. 잎과 물의 이동",
       "65~80번"
      ],
      [
       "6. 함께 일하는 식물의 기관",
       "81~96번"
      ],
      [
       "7. 꽃·열매·씨의 역할",
       "97~112번"
      ],
      [
       "8. 식물 특징을 설명하고 나누기",
       "113~128번"
      ]
     ]
    },
    {
     "type": "text",
     "text": "개념과 예제를 읽고 객관식·빈칸·단답·복수 선택·연결·순서·서술·그림의8형식을 연습해요. 실제 활동은 교사의 준비와 안내에 따라 진행해요."
    },
    {
     "type": "field",
     "title": "나의 학습 점검",
     "hint": "새로 알게 된 구조 이름과 더 관찰하고 싶은 것을 짧게 남겨요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "오른쪽에는 핵심·더 알아보기·나의 정리를 함께 두었어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "실제 활동은 각40분4차시 예시예요. 사전 준비/기다림과 별도16문항 확인45분은 추가로 확보해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "현미경으로 만나는 세포",
   "title": "개념과 핵심 낱말",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "뜻과 확인할 점"
     ],
     "rows": [
      [
       "세포",
       "생물을 이루는 기본 단위"
      ],
      [
       "현미경 관찰",
       "표본에서 실제로 보이는 작은 구조를 살펴보는 관찰"
      ],
      [
       "핵·세포막·세포벽",
       "식물 세포에서 배우는 구조 이름"
      ]
     ]
    },
    {
     "type": "diagram",
     "key": "cells",
     "caption": ""
    },
    {
     "type": "text",
     "text": "식물의 몸은 작은 **세포**로 이루어져 있어요. 교사가 준비한 표본을 현미경으로 실제 관찰하고 보이는 모양을 그림으로 남겨요. 핵·세포막·세포벽의 이름은 자료와 대조해요."
    },
    {
     "type": "field",
     "title": "개념을 내 말로",
     "hint": "잎 한 장이 세포 하나라는 말과 실제 표본에서 보인 모양을 연결해 생각해요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "세포는 생물을 이루는 기본 단위예요. 실제 표본에서 확인한 구조만 이름을 붙여요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모식도와 실제 관찰의 모양·색은 다를 수 있어요. 불분명함도 관찰 정보예요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "현미경으로 만나는 세포",
   "title": "함께 풀고 근거를 확인해요",
   "blocks": [
    {
     "type": "example",
     "question": "같은 표본을 본 두 친구의 그림 모양이 달라요. 어떻게 다시 살펴볼까요?",
     "steps": [
      [
       "대상 확인",
       "같은 식물 표본의 어느 부분을 보았는지 비교해요."
      ],
      [
       "관찰 조건 확인",
       "배율·초점·표본 두께와 조명을 살펴요."
      ],
      [
       "다시 관찰",
       "각자 보인 모양과 구별하기 어려운 부분을 남기고 같은 부분을 다시 봐요."
      ]
     ],
     "answer": "그림을 똑같이 고치기보다 대상과 관찰 조건을 맞추고 다시 확인해요."
    },
    {
     "type": "field",
     "title": "관찰과 설명 그림",
     "hint": "실제 표본에서 볼 것과 설명 그림에서 참고할 것을 나누어 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "세포는 생물을 이루는 기본 단위예요. 실제 표본에서 확인한 구조만 이름을 붙여요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모식도와 실제 관찰의 모양·색은 다를 수 있어요. 불분명함도 관찰 정보예요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "현미경으로 만나는 세포 · 1~3",
   "title": "세포라는 단위",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w001",
      "c22-s61-u03-w002",
      "c22-s61-u03-w003"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "세포는 생물을 이루는 기본 단위예요. 실제 표본에서 확인한 구조만 이름을 붙여요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모식도와 실제 관찰의 모양·색은 다를 수 있어요. 불분명함도 관찰 정보예요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "현미경으로 만나는 세포 · 4~5",
   "title": "실제 관찰 준비",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w004",
      "c22-s61-u03-w005"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "세포는 생물을 이루는 기본 단위예요. 실제 표본에서 확인한 구조만 이름을 붙여요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모식도와 실제 관찰의 모양·색은 다를 수 있어요. 불분명함도 관찰 정보예요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "현미경으로 만나는 세포 · 6~8",
   "title": "안 보이는 구조",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w006",
      "c22-s61-u03-w007",
      "c22-s61-u03-w008"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "세포는 생물을 이루는 기본 단위예요. 실제 표본에서 확인한 구조만 이름을 붙여요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모식도와 실제 관찰의 모양·색은 다를 수 있어요. 불분명함도 관찰 정보예요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "현미경으로 만나는 세포 · 9~10",
   "title": "관찰 기록 고르기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w009",
      "c22-s61-u03-w010"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "세포는 생물을 이루는 기본 단위예요. 실제 표본에서 확인한 구조만 이름을 붙여요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모식도와 실제 관찰의 모양·색은 다를 수 있어요. 불분명함도 관찰 정보예요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "현미경으로 만나는 세포 · 11~12",
   "title": "기관과 세포",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w011",
      "c22-s61-u03-w012"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "세포는 생물을 이루는 기본 단위예요. 실제 표본에서 확인한 구조만 이름을 붙여요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모식도와 실제 관찰의 모양·색은 다를 수 있어요. 불분명함도 관찰 정보예요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "현미경으로 만나는 세포 · 13~14",
   "title": "모식도와 실제 관찰",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w013",
      "c22-s61-u03-w014"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "세포는 생물을 이루는 기본 단위예요. 실제 표본에서 확인한 구조만 이름을 붙여요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모식도와 실제 관찰의 모양·색은 다를 수 있어요. 불분명함도 관찰 정보예요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "현미경으로 만나는 세포 · 15",
   "title": "표본 차이",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w015"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "세포는 생물을 이루는 기본 단위예요. 실제 표본에서 확인한 구조만 이름을 붙여요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모식도와 실제 관찰의 모양·색은 다를 수 있어요. 불분명함도 관찰 정보예요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "현미경으로 만나는 세포 · 16",
   "title": "내가 본 식물 세포",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w016"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "세포는 생물을 이루는 기본 단위예요. 실제 표본에서 확인한 구조만 이름을 붙여요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모식도와 실제 관찰의 모양·색은 다를 수 있어요. 불분명함도 관찰 정보예요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "실제 활동 ① · 현미경",
   "title": "내 표본에서 보인 세포를 그려요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "교사 준비 표본을 안정된 현미경에 놓고 낮은 배율부터 실제로 봐요.",
      "표본 이름·배율과 보인 모양을 남기고 핵·세포막·세포벽 이름을 자료와 대조해요.",
      "실제로 구별한 부분만 이름표를 붙이고 흐리거나 안 보인 부분은 그대로 밝혀요."
     ]
    },
    {
     "type": "field",
     "title": "관찰 그림과 이름표",
     "hint": "표본 이름·배율·보인 모양과 구별한 구조를 표시해요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "세포는 생물을 이루는 기본 단위예요. 실제 표본에서 확인한 구조만 이름을 붙여요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "렌즈와 표본이 닿지 않게 교사의 초점·배율 조작 안내를 따라요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-microscope",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "뿌리의 구조와 물 흡수",
   "title": "개념과 핵심 낱말",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "뜻과 확인할 점"
     ],
     "rows": [
      [
       "뿌리",
       "물을 흡수하고 식물 몸을 지지하는 기관"
      ],
      [
       "비교 조건",
       "뿌리 유무 외에 같게 준비할 조건"
      ],
      [
       "저장하는 부분",
       "당근은 뿌리, 감자는 줄기에 양분을 저장한 예"
      ]
     ]
    },
    {
     "type": "diagram",
     "key": "plant",
     "caption": ""
    },
    {
     "type": "text",
     "text": "뿌리의 구조와 **물 흡수·몸 지지**를 연결해요. 물이 줄어든 양을 비교할 때에는 식물의 상태, 처음 물의 양, 용기·입구 처리, 시간과 주변 환경을 함께 확인해요."
    },
    {
     "type": "field",
     "title": "개념을 내 말로",
     "hint": "뿌리 유무 외에 같게 준비할 조건 두 가지와 그 까닭을 써요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "뿌리는 물 흡수와 몸 지지에 도움을 줘요. 비교 실험에서는 뿌리 유무 외의 조건을 맞춰요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "당근은 뿌리, 감자는 줄기에 저장한 예예요. 땅속 위치만으로 기관을 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "뿌리의 구조와 물 흡수",
   "title": "함께 풀고 근거를 확인해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "장치",
      "처음 물",
      "같은 시간 뒤"
     ],
     "rows": [
      [
       "뿌리 남김",
       "40mL",
       "30mL"
      ],
      [
       "뿌리 제거",
       "40mL",
       "37mL"
      ]
     ]
    },
    {
     "type": "example",
     "question": "입구를 같은 방법으로 막은 두 장치의 제공된 연습 기록입니다. 물이 더 많이 줄어든 쪽과 그 근거는?",
     "steps": [
      [
       "변화량 구하기",
       "뿌리 남김은40−30=10mL, 제거는40−37=3mL 줄었어요."
      ],
      [
       "비교하기",
       "남아 있는 양이 아니라 처음과 나중의 차이를 비교해요."
      ],
      [
       "설명 범위",
       "이번 조건에서 뿌리의 물 흡수와 관련지어 설명해요."
      ]
     ],
     "answer": "뿌리를 남긴 쪽이10mL로 더 많이 줄었어요."
    },
    {
     "type": "text",
     "text": "직접 증발과 절단에 따른 손상 같은 영향도 살펴요. 이 표의 수치를 실제로 잰 값이라고 옮기지 않아요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "뿌리는 물 흡수와 몸 지지에 도움을 줘요. 비교 실험에서는 뿌리 유무 외의 조건을 맞춰요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "당근은 뿌리, 감자는 줄기에 저장한 예예요. 땅속 위치만으로 기관을 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "뿌리의 구조와 물 흡수 · 17~19",
   "title": "뿌리의 역할",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w017",
      "c22-s61-u03-w018",
      "c22-s61-u03-w019"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "뿌리는 물 흡수와 몸 지지에 도움을 줘요. 비교 실험에서는 뿌리 유무 외의 조건을 맞춰요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "당근은 뿌리, 감자는 줄기에 저장한 예예요. 땅속 위치만으로 기관을 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "뿌리의 구조와 물 흡수 · 20~21",
   "title": "맞출 조건",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w020",
      "c22-s61-u03-w021"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "뿌리는 물 흡수와 몸 지지에 도움을 줘요. 비교 실험에서는 뿌리 유무 외의 조건을 맞춰요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "당근은 뿌리, 감자는 줄기에 저장한 예예요. 땅속 위치만으로 기관을 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "뿌리의 구조와 물 흡수 · 22~24",
   "title": "용기 입구의 차이",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w022",
      "c22-s61-u03-w023",
      "c22-s61-u03-w024"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "뿌리는 물 흡수와 몸 지지에 도움을 줘요. 비교 실험에서는 뿌리 유무 외의 조건을 맞춰요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "당근은 뿌리, 감자는 줄기에 저장한 예예요. 땅속 위치만으로 기관을 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "뿌리의 구조와 물 흡수 · 25~26",
   "title": "나중 양과 감소량",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w025",
      "c22-s61-u03-w026"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "뿌리는 물 흡수와 몸 지지에 도움을 줘요. 비교 실험에서는 뿌리 유무 외의 조건을 맞춰요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "당근은 뿌리, 감자는 줄기에 저장한 예예요. 땅속 위치만으로 기관을 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "뿌리의 구조와 물 흡수 · 27~28",
   "title": "절단의 영향",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w027",
      "c22-s61-u03-w028"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "뿌리는 물 흡수와 몸 지지에 도움을 줘요. 비교 실험에서는 뿌리 유무 외의 조건을 맞춰요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "당근은 뿌리, 감자는 줄기에 저장한 예예요. 땅속 위치만으로 기관을 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "뿌리의 구조와 물 흡수 · 29~30",
   "title": "결론의 범위",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w029",
      "c22-s61-u03-w030"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "뿌리는 물 흡수와 몸 지지에 도움을 줘요. 비교 실험에서는 뿌리 유무 외의 조건을 맞춰요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "당근은 뿌리, 감자는 줄기에 저장한 예예요. 땅속 위치만으로 기관을 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "뿌리의 구조와 물 흡수 · 31",
   "title": "숫자만 같은 자료",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w031"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "뿌리는 물 흡수와 몸 지지에 도움을 줘요. 비교 실험에서는 뿌리 유무 외의 조건을 맞춰요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "당근은 뿌리, 감자는 줄기에 저장한 예예요. 땅속 위치만으로 기관을 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "뿌리의 구조와 물 흡수 · 32",
   "title": "뿌리 비교 장치",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w032"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "뿌리는 물 흡수와 몸 지지에 도움을 줘요. 비교 실험에서는 뿌리 유무 외의 조건을 맞춰요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "당근은 뿌리, 감자는 줄기에 저장한 예예요. 땅속 위치만으로 기관을 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "실제 활동 ② · 뿌리",
   "title": "물의 흡수를 같은 조건에서 비교해요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "교사가 준비한 뿌리 유무 비교 장치에서 처음 물과 입구 상태를 확인해요.",
      "같은 시간 뒤 물의 양을 읽고 각자의 처음 값에서 나중 값을 빼요.",
      "같은 조건·직접 증발·절단 영향과 실제 관찰 범위를 함께 설명해요."
     ]
    },
    {
     "type": "table",
     "heads": [
      "장치·상태",
      "처음 물/단위",
      "뒤 물/단위",
      "관찰 시간"
     ],
     "rows": [
      [
       "뿌리 남김",
       "",
       "",
       ""
      ],
      [
       "뿌리 제거",
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "우리의 비교 조건과 근거",
     "hint": "실제로 읽은 값과 불분명한 것, 더 확인할 조건을 써요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "뿌리는 물 흡수와 몸 지지에 도움을 줘요. 비교 실험에서는 뿌리 유무 외의 조건을 맞춰요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "당근은 뿌리, 감자는 줄기에 저장한 예예요. 땅속 위치만으로 기관을 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-root",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "줄기를 따라 움직이는 물",
   "title": "개념과 핵심 낱말",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "뜻과 확인할 점"
     ],
     "rows": [
      [
       "줄기",
       "잎 등을 지지하고 물이 이동하는 통로가 되는 기관"
      ],
      [
       "가로 단면",
       "길이에 가로지르는 방향으로 자른 면"
      ],
      [
       "세로 단면",
       "길이를 따라 자른 면"
      ]
     ]
    },
    {
     "type": "diagram",
     "key": "stem",
     "caption": ""
    },
    {
     "type": "text",
     "text": "색소 물에 두었던 줄기의 단면에서 **색이 나타난 위치**를 살펴요. 가로로 자르면 점처럼 보이는 부분이 세로로는 길게 이어진 자취로 보일 수 있어요."
    },
    {
     "type": "field",
     "title": "개념을 내 말로",
     "hint": "가로 단면과 세로 단면을 함께 볼 때 더 잘 설명할 수 있는 것을 써요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "줄기는 잎 등을 지지하고 물이 다른 기관으로 가는 통로가 돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "가로의 점과 세로의 길게 이어진 자취는 자른 방향과 함께 읽어요. 모든 양분의 경로를 검출한 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "줄기를 따라 움직이는 물",
   "title": "함께 풀고 근거를 확인해요",
   "blocks": [
    {
     "type": "example",
     "question": "교사 준비 줄기에서 가로 면에는 붉은 점들, 세로 면에는 길게 이어진 붉은 자취가 보였어요. 무엇을 설명할 수 있나요?",
     "steps": [
      [
       "관찰 구별",
       "가로 면의 위치와 세로 면의 이어짐을 각각 읽어요."
      ],
      [
       "관계 연결",
       "서로 다른 두 방향의 관찰을 물이 지나간 부분과 연결해요."
      ],
      [
       "결론 한정",
       "이 장치로 모든 양분의 이동 경로까지 검출했다고 말하지 않아요."
      ]
     ],
     "answer": "줄기 안의 물 이동을 색 자취와 자른 방향을 근거로 설명해요."
    },
    {
     "type": "field",
     "title": "그림에 꼭 넣을 이름표",
     "hint": "자른 방향·실제로 색이 보인 부분·표본 이름을 왜 표시해야 하는지 써요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "줄기는 잎 등을 지지하고 물이 다른 기관으로 가는 통로가 돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "가로의 점과 세로의 길게 이어진 자취는 자른 방향과 함께 읽어요. 모든 양분의 경로를 검출한 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "줄기를 따라 움직이는 물 · 33~35",
   "title": "줄기와 잎",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w033",
      "c22-s61-u03-w034",
      "c22-s61-u03-w035"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "줄기는 잎 등을 지지하고 물이 다른 기관으로 가는 통로가 돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "가로의 점과 세로의 길게 이어진 자취는 자른 방향과 함께 읽어요. 모든 양분의 경로를 검출한 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "줄기를 따라 움직이는 물 · 36~37",
   "title": "단면 관찰의 근거",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w036",
      "c22-s61-u03-w037"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "줄기는 잎 등을 지지하고 물이 다른 기관으로 가는 통로가 돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "가로의 점과 세로의 길게 이어진 자취는 자른 방향과 함께 읽어요. 모든 양분의 경로를 검출한 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "줄기를 따라 움직이는 물 · 38~40",
   "title": "겉만 묻은 색",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w038",
      "c22-s61-u03-w039",
      "c22-s61-u03-w040"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "줄기는 잎 등을 지지하고 물이 다른 기관으로 가는 통로가 돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "가로의 점과 세로의 길게 이어진 자취는 자른 방향과 함께 읽어요. 모든 양분의 경로를 검출한 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "줄기를 따라 움직이는 물 · 41~42",
   "title": "연습 기록의 읽기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w041",
      "c22-s61-u03-w042"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "줄기는 잎 등을 지지하고 물이 다른 기관으로 가는 통로가 돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "가로의 점과 세로의 길게 이어진 자취는 자른 방향과 함께 읽어요. 모든 양분의 경로를 검출한 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "줄기를 따라 움직이는 물 · 43~44",
   "title": "색소가 없을 때",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w043",
      "c22-s61-u03-w044"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "줄기는 잎 등을 지지하고 물이 다른 기관으로 가는 통로가 돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "가로의 점과 세로의 길게 이어진 자취는 자른 방향과 함께 읽어요. 모든 양분의 경로를 검출한 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "줄기를 따라 움직이는 물 · 45~46",
   "title": "관찰 뒤의 주장",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w045",
      "c22-s61-u03-w046"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "줄기는 잎 등을 지지하고 물이 다른 기관으로 가는 통로가 돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "가로의 점과 세로의 길게 이어진 자취는 자른 방향과 함께 읽어요. 모든 양분의 경로를 검출한 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "줄기를 따라 움직이는 물 · 47",
   "title": "더 필요한 증거",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w047"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "줄기는 잎 등을 지지하고 물이 다른 기관으로 가는 통로가 돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "가로의 점과 세로의 길게 이어진 자취는 자른 방향과 함께 읽어요. 모든 양분의 경로를 검출한 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "줄기를 따라 움직이는 물 · 48",
   "title": "관찰 자취를 두 방향으로",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w048"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "줄기는 잎 등을 지지하고 물이 다른 기관으로 가는 통로가 돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "가로의 점과 세로의 길게 이어진 자취는 자른 방향과 함께 읽어요. 모든 양분의 경로를 검출한 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "실제 활동 ③ · 줄기",
   "title": "색이 보인 위치와 자른 방향",
   "blocks": [
    {
     "type": "list",
     "items": [
      "색소 물에 넣기 전 겉의 색과 처리 시간·표본 이름을 확인해요.",
      "교사가 안전하게 준비한 가로/세로 단면을 실제로 살펴요.",
      "아래에 두 방향을 나누고 실제 보인 색 자취와 이름표를 그려요."
     ]
    },
    {
     "type": "field",
     "title": "두 방향의 단면과 설명",
     "hint": "점처럼 보인 곳과 길게 이어진 곳을 표시해 물 이동의 근거를 설명해요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "줄기는 잎 등을 지지하고 물이 다른 기관으로 가는 통로가 돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "칼로 단면을 자르는 준비는 교사가 맡아요. 안 보인 부분은 예상 색으로 채우지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-stem",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "잎이 만드는 양분의 근거",
   "title": "개념과 핵심 낱말",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "뜻과 확인할 점"
     ],
     "rows": [
      [
       "광합성",
       "식물이 빛을 이용하여 스스로 양분을 만드는 작용"
      ],
      [
       "물·이산화 탄소",
       "잎에서 양분을 만드는 데 이용하는 물질"
      ],
      [
       "녹말 검출",
       "양분 생성의 근거를 확인하는 한 가지 방법"
      ]
     ]
    },
    {
     "type": "diagram",
     "key": "leaf",
     "caption": ""
    },
    {
     "type": "text",
     "text": "잎은 **물과 이산화 탄소**를 이용하여 빛을 받아 양분을 만들어요. 교사가 준비한 시료의 녹말 검출 결과를 읽을 때에는 처리 전 상태와 빛 처리·어둠 처리의 다른 조건을 함께 봐요."
    },
    {
     "type": "field",
     "title": "개념을 내 말로",
     "hint": "빛 처리 뒤 반응만 보지 않고 처리 전 상태도 확인하는 까닭을 써요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "잎은 물·이산화 탄소를 이용해 빛을 받아 양분을 만들어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "녹말 검출은 처리 전 상태·빛 차이·처리 뒤 실제 반응을 함께 봐요. 모든 양분을 녹말 하나로 제한하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "잎이 만드는 양분의 근거",
   "title": "함께 풀고 근거를 확인해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "제공된 연습 시료",
      "녹말 검출 반응"
     ],
     "rows": [
      [
       "처리 전 비교",
       "미검출"
      ],
      [
       "빛을 받은 뒤",
       "청람색"
      ],
      [
       "어둠에 둔 뒤",
       "미검출"
      ]
     ]
    },
    {
     "type": "example",
     "question": "다른 조건을 같게 준비했다면 이 자료에서 뒷받침되는 설명은?",
     "steps": [
      [
       "처음 상태",
       "처리 전 비교 자료에서 녹말이 검출되지 않았어요."
      ],
      [
       "처리 뒤 비교",
       "빛을 받은 뒤에는 청람색 반응이 나타났어요."
      ],
      [
       "근거로 설명",
       "이번 조건에서 빛을 받은 잎의 녹말 생성을 뒷받침해요."
      ]
     ],
     "answer": "처리 전/뒤와 빛/어둠을 함께 비교하여 설명해요."
    },
    {
     "type": "text",
     "text": "어두운 잎에 어떤 물질도 없다는 뜻은 아니에요. 실제 반응이 다르면 그대로 남기고 처음 상태와 처리 조건을 다시 확인해요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "잎은 물·이산화 탄소를 이용해 빛을 받아 양분을 만들어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "녹말 검출은 처리 전 상태·빛 차이·처리 뒤 실제 반응을 함께 봐요. 모든 양분을 녹말 하나로 제한하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "잎이 만드는 양분의 근거 · 49~51",
   "title": "잎의 구조와 빛",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w049",
      "c22-s61-u03-w050",
      "c22-s61-u03-w051"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "잎은 물·이산화 탄소를 이용해 빛을 받아 양분을 만들어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "녹말 검출은 처리 전 상태·빛 차이·처리 뒤 실제 반응을 함께 봐요. 모든 양분을 녹말 하나로 제한하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "잎이 만드는 양분의 근거 · 52~53",
   "title": "필요한 재료와 조건",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w052",
      "c22-s61-u03-w053"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "잎은 물·이산화 탄소를 이용해 빛을 받아 양분을 만들어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "녹말 검출은 처리 전 상태·빛 차이·처리 뒤 실제 반응을 함께 봐요. 모든 양분을 녹말 하나로 제한하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "잎이 만드는 양분의 근거 · 54~55",
   "title": "시작 전 확인",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w054",
      "c22-s61-u03-w055"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "잎은 물·이산화 탄소를 이용해 빛을 받아 양분을 만들어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "녹말 검출은 처리 전 상태·빛 차이·처리 뒤 실제 반응을 함께 봐요. 모든 양분을 녹말 하나로 제한하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "잎이 만드는 양분의 근거 · 56~58",
   "title": "공기 중 재료",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w056",
      "c22-s61-u03-w057",
      "c22-s61-u03-w058"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "잎은 물·이산화 탄소를 이용해 빛을 받아 양분을 만들어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "녹말 검출은 처리 전 상태·빛 차이·처리 뒤 실제 반응을 함께 봐요. 모든 양분을 녹말 하나로 제한하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "잎이 만드는 양분의 근거 · 59~60",
   "title": "두 잎 모두 반응",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w059",
      "c22-s61-u03-w060"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "잎은 물·이산화 탄소를 이용해 빛을 받아 양분을 만들어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "녹말 검출은 처리 전 상태·빛 차이·처리 뒤 실제 반응을 함께 봐요. 모든 양분을 녹말 하나로 제한하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "잎이 만드는 양분의 근거 · 61~62",
   "title": "실험 조작의 담당",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w061",
      "c22-s61-u03-w062"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "잎은 물·이산화 탄소를 이용해 빛을 받아 양분을 만들어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "녹말 검출은 처리 전 상태·빛 차이·처리 뒤 실제 반응을 함께 봐요. 모든 양분을 녹말 하나로 제한하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "잎이 만드는 양분의 근거 · 63",
   "title": "검출 결과의 한계",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w063"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "잎은 물·이산화 탄소를 이용해 빛을 받아 양분을 만들어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "녹말 검출은 처리 전 상태·빛 차이·처리 뒤 실제 반응을 함께 봐요. 모든 양분을 녹말 하나로 제한하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "잎이 만드는 양분의 근거 · 64",
   "title": "빛 비교의 설명 그림",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w064"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "잎은 물·이산화 탄소를 이용해 빛을 받아 양분을 만들어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "녹말 검출은 처리 전 상태·빛 차이·처리 뒤 실제 반응을 함께 봐요. 모든 양분을 녹말 하나로 제한하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "실제 활동 ④ · 잎",
   "title": "처리 전과 빛·어둠의 반응을 봐요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "교사가 준비한 처리 전 비교·빛·어둠 시료의 이름과 다른 비교 조건을 확인해요.",
      "안내에 따라 실제 검출 반응을 보고 청람색/미검출/불분명을 구별해요.",
      "예상과 달라도 관찰을 보존하고 처음 상태·처리 방법을 다시 살펴요."
     ]
    },
    {
     "type": "table",
     "heads": [
      "교사 준비 시료",
      "실제 본 반응·불분명",
      "확인한 조건"
     ],
     "rows": [
      [
       "처리 전 비교",
       "",
       ""
      ],
      [
       "빛 처리 뒤",
       "",
       ""
      ],
      [
       "어둠 처리 뒤",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "이번 결과로 말할 수 있는 것",
     "hint": "시작 상태와 처리 전/뒤 비교를 근거로 설명해요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "잎은 물·이산화 탄소를 이용해 빛을 받아 양분을 만들어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "약품·알코올·가열/뜨거운 시료와 폐기는 교사가 맡아요. 학생은 임의로 섞거나 가열하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-starch",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "잎과 물의 이동",
   "title": "개념과 핵심 낱말",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "뜻과 확인할 점"
     ],
     "rows": [
      [
       "증산",
       "식물 안의 물이 수증기로 나가는 현상"
      ],
      [
       "기공",
       "잎에서 물이 나가는 과정과 관련된 구조"
      ],
      [
       "물방울 맺힘",
       "봉지 안에서 수증기가 식어 액체로 모이는 과정"
      ]
     ]
    },
    {
     "type": "diagram",
     "key": "transpiration",
     "caption": ""
    },
    {
     "type": "text",
     "text": "증산으로 나간 **수증기**와 봉지 안에 맺힌 **물방울**을 구별해요. 잎 유무의 영향을 비교할 때에는 처음부터 두 봉지의 안쪽이 말랐는지 확인해요."
    },
    {
     "type": "field",
     "title": "개념을 내 말로",
     "hint": "증산의 수증기와 봉지 안 물방울의 상태를 구별해 써요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "증산은 식물 안의 물이 수증기로 나가는 현상이며 기공과 관련돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "나간 수증기가 봉지 안에서 물방울로 맺히는 과정과 구별해요. 초기 봉지 물기와 직접 증발도 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "잎과 물의 이동",
   "title": "함께 풀고 근거를 확인해요",
   "blocks": [
    {
     "type": "example",
     "question": "한 봉지 안에는 시작 전부터 물방울이 있었어요. 나중에 더 젖었다는 모습만으로 잎의 영향을 비교해도 될까요?",
     "steps": [
      [
       "처음 조건 읽기",
       "두 봉지의 시작 상태가 달랐어요."
      ],
      [
       "원인 구별",
       "처음 있던 물기와 나중 생긴 물방울을 구별하기 어려워요."
      ],
      [
       "다시 비교",
       "마른 봉지와 같은 물/용기·시간·주변 조건으로 준비해요."
      ]
     ],
     "answer": "처음 상태를 맞춰 다시 비교하고 원래 관찰도 함께 남겨요."
    },
    {
     "type": "field",
     "title": "같게 할 조건과 실제로 볼 것",
     "hint": "잎 유무 외의 조건과 물방울/물의 감소에서 확인할 것을 써요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "증산은 식물 안의 물이 수증기로 나가는 현상이며 기공과 관련돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "나간 수증기가 봉지 안에서 물방울로 맺히는 과정과 구별해요. 초기 봉지 물기와 직접 증발도 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "잎과 물의 이동 · 65~67",
   "title": "수증기로 나가는 물",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w065",
      "c22-s61-u03-w066",
      "c22-s61-u03-w067"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "증산은 식물 안의 물이 수증기로 나가는 현상이며 기공과 관련돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "나간 수증기가 봉지 안에서 물방울로 맺히는 과정과 구별해요. 초기 봉지 물기와 직접 증발도 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "잎과 물의 이동 · 68~69",
   "title": "봉지 비교 준비",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w068",
      "c22-s61-u03-w069"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "증산은 식물 안의 물이 수증기로 나가는 현상이며 기공과 관련돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "나간 수증기가 봉지 안에서 물방울로 맺히는 과정과 구별해요. 초기 봉지 물기와 직접 증발도 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "잎과 물의 이동 · 70~72",
   "title": "처음부터 젖은 봉지",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w070",
      "c22-s61-u03-w071",
      "c22-s61-u03-w072"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "증산은 식물 안의 물이 수증기로 나가는 현상이며 기공과 관련돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "나간 수증기가 봉지 안에서 물방울로 맺히는 과정과 구별해요. 초기 봉지 물기와 직접 증발도 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "잎과 물의 이동 · 73~75",
   "title": "감소량에 단위 쓰기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w073",
      "c22-s61-u03-w074",
      "c22-s61-u03-w075"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "증산은 식물 안의 물이 수증기로 나가는 현상이며 기공과 관련돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "나간 수증기가 봉지 안에서 물방울로 맺히는 과정과 구별해요. 초기 봉지 물기와 직접 증발도 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "잎과 물의 이동 · 76~77",
   "title": "잎을 제거한 장치도 감소",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w076",
      "c22-s61-u03-w077"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "증산은 식물 안의 물이 수증기로 나가는 현상이며 기공과 관련돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "나간 수증기가 봉지 안에서 물방울로 맺히는 과정과 구별해요. 초기 봉지 물기와 직접 증발도 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "잎과 물의 이동 · 78~79",
   "title": "증산 비교의 흐름",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w078",
      "c22-s61-u03-w079"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "증산은 식물 안의 물이 수증기로 나가는 현상이며 기공과 관련돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "나간 수증기가 봉지 안에서 물방울로 맺히는 과정과 구별해요. 초기 봉지 물기와 직접 증발도 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "잎과 물의 이동 · 80",
   "title": "공정한 잎 유무 비교",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w080"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "증산은 식물 안의 물이 수증기로 나가는 현상이며 기공과 관련돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "나간 수증기가 봉지 안에서 물방울로 맺히는 과정과 구별해요. 초기 봉지 물기와 직접 증발도 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "실제 활동 ⑤ · 증산",
   "title": "처음부터 마른 봉지로 비교해요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "두 봉지의 처음 물기와 물의 양·용기·입구·주변 조건을 확인해요.",
      "같은 시간 뒤 실제 물방울과 물의 감소를 살펴 잎 유무를 비교해요.",
      "수증기로 나감과 물방울로 맺힘을 나누어 설명해요."
     ]
    },
    {
     "type": "table",
     "heads": [
      "비교 대상",
      "처음 상태",
      "뒤에 실제 본 것",
      "시각/조건"
     ],
     "rows": [
      [
       "잎 있음",
       "",
       "",
       ""
      ],
      [
       "잎 없음",
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "관찰과 해석",
     "hint": "처음 물기·직접 증발·절단 영향을 함께 살펴 결론을 써요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "증산은 식물 안의 물이 수증기로 나가는 현상이며 기공과 관련돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "나간 수증기가 봉지 안에서 물방울로 맺히는 과정과 구별해요. 초기 봉지 물기와 직접 증발도 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-transpiration",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "함께 일하는 식물의 기관",
   "title": "개념과 핵심 낱말",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "뜻과 확인할 점"
     ],
     "rows": [
      [
       "기관의 관계",
       "각 기관의 기능이 물과 양분의 이동으로 이어지는 관계"
      ],
      [
       "지지와 이동",
       "줄기가 잎 등을 받치고 물을 다른 기관으로 보내는 역할"
      ],
      [
       "양분의 이용",
       "잎에서 만든 양분을 다른 기관도 생장·저장에 이용하는 일"
      ]
     ]
    },
    {
     "type": "diagram",
     "key": "plant",
     "caption": ""
    },
    {
     "type": "text",
     "text": "뿌리에서 흡수한 물은 줄기를 지나 다른 기관으로 이동해요. 잎에서 만든 양분도 식물의 다른 기관에서 이용돼요. 각 기능을 따로 외우는 데서 **서로 이어 설명하기**로 나아가요."
    },
    {
     "type": "field",
     "title": "개념을 내 말로",
     "hint": "뿌리·줄기·잎의 관계를 물과 양분으로 연결해 써요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물의 흡수·이동·배출과 양분 생성/이용을 뿌리·줄기·잎의 관계로 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물의 이동 화살표를 양분의 모든 이동에 같은 방향으로 적용하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "함께 일하는 식물의 기관",
   "title": "함께 풀고 근거를 확인해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "확인한 근거",
      "직접 연결할 역할"
     ],
     "rows": [
      [
       "뿌리 비교 장치의 물 감소",
       "뿌리의 물 흡수"
      ],
      [
       "줄기 단면의 색소 자취",
       "줄기를 통한 물 이동"
      ],
      [
       "처리 전/뒤 잎의 녹말 검출",
       "잎에서 양분 생성"
      ]
     ]
    },
    {
     "type": "example",
     "question": "“물은 위로 움직이므로 모든 양분도 늘 같은 방향으로만 간다”는 설명을 고쳐 보세요.",
     "steps": [
      [
       "물의 근거",
       "뿌리 흡수와 줄기의 물 이동을 확인한 근거를 읽어요."
      ],
      [
       "양분의 관계",
       "잎에서 만들어진 양분은 다른 기관의 생장/저장에도 쓰여요."
      ],
      [
       "표현 고치기",
       "하나의 물 이동 화살표로 모든 양분의 이동을 똑같이 그리지 않아요."
      ]
     ],
     "answer": "각 과정의 근거와 기관 사이의 관계를 구별해 설명해요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물의 흡수·이동·배출과 양분 생성/이용을 뿌리·줄기·잎의 관계로 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물의 이동 화살표를 양분의 모든 이동에 같은 방향으로 적용하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "함께 일하는 식물의 기관 · 81~83",
   "title": "물의 이동 길",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w081",
      "c22-s61-u03-w082",
      "c22-s61-u03-w083"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물의 흡수·이동·배출과 양분 생성/이용을 뿌리·줄기·잎의 관계로 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물의 이동 화살표를 양분의 모든 이동에 같은 방향으로 적용하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "함께 일하는 식물의 기관 · 84~85",
   "title": "함께 일하는 기관",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w084",
      "c22-s61-u03-w085"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물의 흡수·이동·배출과 양분 생성/이용을 뿌리·줄기·잎의 관계로 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물의 이동 화살표를 양분의 모든 이동에 같은 방향으로 적용하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "함께 일하는 식물의 기관 · 86~88",
   "title": "그림에서 빠진 기관",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w086",
      "c22-s61-u03-w087",
      "c22-s61-u03-w088"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물의 흡수·이동·배출과 양분 생성/이용을 뿌리·줄기·잎의 관계로 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물의 이동 화살표를 양분의 모든 이동에 같은 방향으로 적용하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "함께 일하는 식물의 기관 · 89~90",
   "title": "생김새만으로 모르는 것",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w089",
      "c22-s61-u03-w090"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물의 흡수·이동·배출과 양분 생성/이용을 뿌리·줄기·잎의 관계로 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물의 이동 화살표를 양분의 모든 이동에 같은 방향으로 적용하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "함께 일하는 식물의 기관 · 91",
   "title": "같은 식물의 역할 분담",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w091"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물의 흡수·이동·배출과 양분 생성/이용을 뿌리·줄기·잎의 관계로 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물의 이동 화살표를 양분의 모든 이동에 같은 방향으로 적용하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "함께 일하는 식물의 기관 · 92~93",
   "title": "양분 길을 물 길로 단정",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w092",
      "c22-s61-u03-w093"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물의 흡수·이동·배출과 양분 생성/이용을 뿌리·줄기·잎의 관계로 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물의 이동 화살표를 양분의 모든 이동에 같은 방향으로 적용하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "함께 일하는 식물의 기관 · 94~95",
   "title": "물 이동 설명 순서",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w094",
      "c22-s61-u03-w095"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물의 흡수·이동·배출과 양분 생성/이용을 뿌리·줄기·잎의 관계로 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물의 이동 화살표를 양분의 모든 이동에 같은 방향으로 적용하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "함께 일하는 식물의 기관 · 96",
   "title": "기관 연결 지도",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w096"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물의 흡수·이동·배출과 양분 생성/이용을 뿌리·줄기·잎의 관계로 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물의 이동 화살표를 양분의 모든 이동에 같은 방향으로 적용하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "실제 활동 ⑥ · 기관 연결",
   "title": "한 식물 안에서 물과 양분을 연결해요",
   "blocks": [
    {
     "type": "text",
     "text": "실제로 관찰한 식물이나 확인한 자료의 뿌리·줄기·잎을 크게 그려요. 물의 이동과 잎에서 만든 양분을 이용하는 기관의 관계를 서로 다른 이름표로 설명해요."
    },
    {
     "type": "field",
     "title": "우리 식물의 기관 관계",
     "hint": "대상 이름·각 기관 이름·물/양분의 관계와 관찰/자료 근거를 표시해요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물의 흡수·이동·배출과 양분 생성/이용을 뿌리·줄기·잎의 관계로 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물의 이동 화살표를 양분의 모든 이동에 같은 방향으로 적용하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-organs",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "꽃·열매·씨의 역할",
   "title": "개념과 핵심 낱말",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "뜻과 확인할 점"
     ],
     "rows": [
      [
       "꽃가루받이",
       "수술의 꽃가루가 암술머리에 닿는 일"
      ],
      [
       "열매",
       "씨를 보호하는 등 씨와 관련된 역할을 하는 기관"
      ],
      [
       "씨의 퍼짐",
       "열매/씨의 구조와 주변 조건을 함께 살펴볼 과정"
      ]
     ]
    },
    {
     "type": "diagram",
     "key": "flower",
     "caption": ""
    },
    {
     "type": "text",
     "text": "꽃의 구조와 **꽃가루받이**, 열매와 씨의 역할을 단계별로 구별해요. 꽃에 벌이 방문한 사진 한 장으로 씨가 생기고 퍼지는 과정까지 끝났다고 정하지 않아요."
    },
    {
     "type": "field",
     "title": "개념을 내 말로",
     "hint": "벌이 꽃에 온 사진 한 장으로 씨 퍼짐까지 확인할 수 있는지 근거를 써요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수술의 꽃가루가 암술머리에 닿는 꽃가루받이와 씨가 퍼지는 단계를 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "열매/씨의 실제 구조와 가능한 보호/퍼짐 역할을 연결해요. 이름이나 사는 곳만으로 방법을 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "꽃·열매·씨의 역할",
   "title": "함께 풀고 근거를 확인해요",
   "blocks": [
    {
     "type": "example",
     "question": "열매 사진에 갈고리 모양의 구조가 보여요. 이 특징을 설명하는 자료에는 무엇을 더 연결할까요?",
     "steps": [
      [
       "구조 읽기",
       "어느 부분에 어떤 생김새가 있는지 표시해요."
      ],
      [
       "기능 생각하기",
       "다른 대상에 붙어 옮겨질 가능성과 연결해요."
      ],
      [
       "근거 보완",
       "해당 식물의 관찰이나 출처 있는 조사 자료에서 퍼짐 방법을 확인해요."
      ]
     ],
     "answer": "이름이나 사는 곳만으로 단정하지 않고 구조와 확인한 근거로 설명해요."
    },
    {
     "type": "field",
     "title": "같은 단계일까요?",
     "hint": "꽃 방문·꽃가루받이·열매/씨 형성·씨 퍼짐을 구별해 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수술의 꽃가루가 암술머리에 닿는 꽃가루받이와 씨가 퍼지는 단계를 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "열매/씨의 실제 구조와 가능한 보호/퍼짐 역할을 연결해요. 이름이나 사는 곳만으로 방법을 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "꽃·열매·씨의 역할 · 97~99",
   "title": "꽃가루받이",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w097",
      "c22-s61-u03-w098",
      "c22-s61-u03-w099"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수술의 꽃가루가 암술머리에 닿는 꽃가루받이와 씨가 퍼지는 단계를 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "열매/씨의 실제 구조와 가능한 보호/퍼짐 역할을 연결해요. 이름이나 사는 곳만으로 방법을 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "꽃·열매·씨의 역할 · 100~101",
   "title": "꽃 구조와 역할",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w100",
      "c22-s61-u03-w101"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수술의 꽃가루가 암술머리에 닿는 꽃가루받이와 씨가 퍼지는 단계를 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "열매/씨의 실제 구조와 가능한 보호/퍼짐 역할을 연결해요. 이름이나 사는 곳만으로 방법을 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "꽃·열매·씨의 역할 · 102~104",
   "title": "벌이 앉은 사진",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w102",
      "c22-s61-u03-w103",
      "c22-s61-u03-w104"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수술의 꽃가루가 암술머리에 닿는 꽃가루받이와 씨가 퍼지는 단계를 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "열매/씨의 실제 구조와 가능한 보호/퍼짐 역할을 연결해요. 이름이나 사는 곳만으로 방법을 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "꽃·열매·씨의 역할 · 105~106",
   "title": "퍼짐의 단서",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w105",
      "c22-s61-u03-w106"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수술의 꽃가루가 암술머리에 닿는 꽃가루받이와 씨가 퍼지는 단계를 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "열매/씨의 실제 구조와 가능한 보호/퍼짐 역할을 연결해요. 이름이나 사는 곳만으로 방법을 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "꽃·열매·씨의 역할 · 107",
   "title": "실제 퍼짐과 모형",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w107"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수술의 꽃가루가 암술머리에 닿는 꽃가루받이와 씨가 퍼지는 단계를 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "열매/씨의 실제 구조와 가능한 보호/퍼짐 역할을 연결해요. 이름이나 사는 곳만으로 방법을 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "꽃·열매·씨의 역할 · 108~109",
   "title": "식물 이름으로 단정",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w108",
      "c22-s61-u03-w109"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수술의 꽃가루가 암술머리에 닿는 꽃가루받이와 씨가 퍼지는 단계를 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "열매/씨의 실제 구조와 가능한 보호/퍼짐 역할을 연결해요. 이름이나 사는 곳만으로 방법을 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "꽃·열매·씨의 역할 · 110~111",
   "title": "관찰 기록의 시간 순서",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w110",
      "c22-s61-u03-w111"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수술의 꽃가루가 암술머리에 닿는 꽃가루받이와 씨가 퍼지는 단계를 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "열매/씨의 실제 구조와 가능한 보호/퍼짐 역할을 연결해요. 이름이나 사는 곳만으로 방법을 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "꽃·열매·씨의 역할 · 112",
   "title": "열매와 씨의 구조 그리기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w112"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수술의 꽃가루가 암술머리에 닿는 꽃가루받이와 씨가 퍼지는 단계를 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "열매/씨의 실제 구조와 가능한 보호/퍼짐 역할을 연결해요. 이름이나 사는 곳만으로 방법을 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "실제 활동 ⑦ · 특징 조사",
   "title": "관심 식물의 구조와 역할을 찾아요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "관심 식물 한 가지와 설명할 구조 하나를 골라요.",
      "안전한 대상의 실제 구조를 관찰하거나 교사가 고른 출처 있는 자료를 읽어요.",
      "직접 본 정보와 조사한 정보를 구별해 역할과 연결해요."
     ]
    },
    {
     "type": "table",
     "heads": [
      "대상 식물/구조",
      "내가 확인한 내용"
     ],
     "rows": [
      [
       "전체와 부분 이름",
       ""
      ],
      [
       "구조의 생김새",
       ""
      ],
      [
       "관련된 역할과 근거",
       ""
      ],
      [
       "관찰 날짜 또는 자료 출처",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "더 확인할 질문",
     "hint": "관찰이나 조사에서 아직 분명하지 않은 점을 적어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수술의 꽃가루가 암술머리에 닿는 꽃가루받이와 씨가 퍼지는 단계를 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "열매/씨의 실제 구조와 가능한 보호/퍼짐 역할을 연결해요. 이름이나 사는 곳만으로 방법을 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-feature",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "식물 특징을 설명하고 나누기",
   "title": "개념과 핵심 낱말",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "뜻과 확인할 점"
     ],
     "rows": [
      [
       "특징 설명 자료",
       "대상·구조 이름·기능·근거가 이어지는 한 장 자료"
      ],
      [
       "관찰과 조사",
       "직접 본 정보와 출처 있는 자료에서 읽은 정보를 구별하는 일"
      ],
      [
       "설명과 보완",
       "자료를 보여 주고 질문을 들어 더 잘 이해되게 고치는 일"
      ]
     ]
    },
    {
     "type": "diagram",
     "key": "leaf",
     "caption": ""
    },
    {
     "type": "text",
     "text": "관심 식물의 한 구조를 골라 **전체 모습·확대 위치·구조 이름·역할**을 연결해요. 직접 관찰한 정보인지 조사한 정보인지 밝히고, 친구가 근거를 다시 찾을 수 있게 출처를 적어요."
    },
    {
     "type": "field",
     "title": "개념을 내 말로",
     "hint": "내 자료에서 구조·기능·근거를 어떻게 연결할지 써요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "대상 식물·구조 이름·기능·관찰/조사 근거가 이어지는 한 장 자료를 만들고 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "전체 사진에서 확대한 위치를 표시하면 친구가 구조와 기능의 관계를 따라 읽기 쉬워요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "식물 특징을 설명하고 나누기",
   "title": "함께 풀고 근거를 확인해요",
   "blocks": [
    {
     "type": "example",
     "question": "전체 식물 사진과 확대 그림이 따로 떨어져 있어 같은 부분인지 친구가 헷갈려 해요. 어떻게 고칠까요?",
     "steps": [
      [
       "전체와 부분 연결",
       "전체 사진에서 확대한 위치를 표시해요."
      ],
      [
       "이름과 역할 연결",
       "확대 그림에 구조 이름과 기능 문장을 붙여요."
      ],
      [
       "근거 연결",
       "직접 관찰/조사한 내용과 출처를 함께 넣어요."
      ]
     ],
     "answer": "꾸미기보다 구조·기능·근거의 연결을 읽기 쉽게 고쳐요."
    },
    {
     "type": "field",
     "title": "한 장 자료의 중심 문장",
     "hint": "관심 식물·구조·관련된 역할과 근거가 이어지도록 써요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "대상 식물·구조 이름·기능·관찰/조사 근거가 이어지는 한 장 자료를 만들고 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "전체 사진에서 확대한 위치를 표시하면 친구가 구조와 기능의 관계를 따라 읽기 쉬워요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "식물 특징을 설명하고 나누기 · 113~115",
   "title": "설명 자료의 초점",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w113",
      "c22-s61-u03-w114",
      "c22-s61-u03-w115"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "대상 식물·구조 이름·기능·관찰/조사 근거가 이어지는 한 장 자료를 만들고 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "전체 사진에서 확대한 위치를 표시하면 친구가 구조와 기능의 관계를 따라 읽기 쉬워요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "식물 특징을 설명하고 나누기 · 116~117",
   "title": "한 장 자료에 담기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w116",
      "c22-s61-u03-w117"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "대상 식물·구조 이름·기능·관찰/조사 근거가 이어지는 한 장 자료를 만들고 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "전체 사진에서 확대한 위치를 표시하면 친구가 구조와 기능의 관계를 따라 읽기 쉬워요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "식물 특징을 설명하고 나누기 · 118~120",
   "title": "생김새에서 기능으로",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w118",
      "c22-s61-u03-w119",
      "c22-s61-u03-w120"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "대상 식물·구조 이름·기능·관찰/조사 근거가 이어지는 한 장 자료를 만들고 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "전체 사진에서 확대한 위치를 표시하면 친구가 구조와 기능의 관계를 따라 읽기 쉬워요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "식물 특징을 설명하고 나누기 · 121~122",
   "title": "고칠 표현",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w121",
      "c22-s61-u03-w122"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "대상 식물·구조 이름·기능·관찰/조사 근거가 이어지는 한 장 자료를 만들고 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "전체 사진에서 확대한 위치를 표시하면 친구가 구조와 기능의 관계를 따라 읽기 쉬워요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "식물 특징을 설명하고 나누기 · 123",
   "title": "받은 질문으로 고치기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w123"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "대상 식물·구조 이름·기능·관찰/조사 근거가 이어지는 한 장 자료를 만들고 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "전체 사진에서 확대한 위치를 표시하면 친구가 구조와 기능의 관계를 따라 읽기 쉬워요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "식물 특징을 설명하고 나누기 · 124~125",
   "title": "전체 사진과 부분 확대",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w124",
      "c22-s61-u03-w125"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "대상 식물·구조 이름·기능·관찰/조사 근거가 이어지는 한 장 자료를 만들고 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "전체 사진에서 확대한 위치를 표시하면 친구가 구조와 기능의 관계를 따라 읽기 쉬워요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "식물 특징을 설명하고 나누기 · 126~127",
   "title": "만들어 나누기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w126",
      "c22-s61-u03-w127"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "대상 식물·구조 이름·기능·관찰/조사 근거가 이어지는 한 장 자료를 만들고 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "전체 사진에서 확대한 위치를 표시하면 친구가 구조와 기능의 관계를 따라 읽기 쉬워요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "식물 특징을 설명하고 나누기 · 128",
   "title": "나의 식물 설명 한 장",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w128"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "대상 식물·구조 이름·기능·관찰/조사 근거가 이어지는 한 장 자료를 만들고 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "전체 사진에서 확대한 위치를 표시하면 친구가 구조와 기능의 관계를 따라 읽기 쉬워요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "실제 활동 ⑧ · 자료 만들기",
   "title": "구조·기능·근거가 이어지는 한 장",
   "blocks": [
    {
     "type": "list",
     "items": [
      "전체에서 확대 위치를 표시하고 구조 이름표를 넣어요.",
      "어떤 생김새가 어떤 역할과 관련되는지 근거 문장으로 연결해요.",
      "직접 관찰/조사한 정보와 출처를 넣어 한 장 자료를 실제로 만들어요."
     ]
    },
    {
     "type": "field",
     "title": "내 자료의 큰 그림과 배치",
     "hint": "대상·전체/확대 위치·구조 이름·역할·근거·출처의 자리를 정해요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "대상 식물·구조 이름·기능·관찰/조사 근거가 이어지는 한 장 자료를 만들고 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "한 장 안에서 친구가 설명의 근거를 따라 읽을 수 있는지 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-design",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "실제 활동 ⑨ · 설명과 보완",
   "title": "친구의 질문으로 설명을 다듬어요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "자료를 교실에서 실제로 보여 주며 구조·기능·근거를 설명해요.",
      "친구가 어느 부분을 이해했고 무엇을 헷갈렸는지 들어요.",
      "그림 연결이나 빠진 근거 문장을 보완하고 다시 설명해요."
     ]
    },
    {
     "type": "field",
     "title": "보여 준 자료와 설명한 내용",
     "hint": "실제로 한 활동과 아직 남은 활동을 구별해요.",
     "lines": 4,
     "draw": false
    },
    {
     "type": "field",
     "title": "받은 질문과 확인한 근거",
     "hint": "질문을 아직 받지 못했다면 그 상태와 다음 질문을 남겨요.",
     "lines": 5,
     "draw": false
    },
    {
     "type": "field",
     "title": "고친 설명과 다시 보여 주기",
     "hint": "바꾼 부분·그 까닭과 실제로 다시 설명한 내용을 남겨요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "대상 식물·구조 이름·기능·관찰/조사 근거가 이어지는 한 장 자료를 만들고 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "전체 사진에서 확대한 위치를 표시하면 친구가 구조와 기능의 관계를 따라 읽기 쉬워요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-share",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "단원 정리",
   "title": "작은 세포에서 기관의 관계까지",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "설명할 것",
      "내가 읽을 근거"
     ],
     "rows": [
      [
       "세포와 구조 이름",
       "실제 표본·배율·보인 모양"
      ],
      [
       "뿌리/줄기",
       "같은 조건의 물 감소·단면 색 자취"
      ],
      [
       "광합성",
       "처리 전 상태·빛/어둠·실제 검출"
      ],
      [
       "증산",
       "처음 마른 봉지·잎 유무·물방울/감소"
      ],
      [
       "기관의 관계",
       "물의 이동과 양분 생성/이용"
      ],
      [
       "특징 자료",
       "구조·기능·근거·출처·실제 설명"
      ]
     ]
    },
    {
     "type": "field",
     "title": "내 생각이 달라진 근거",
     "hint": "처음 생각과 실제 관찰이나 읽은 자료를 연결하여 써요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 관찰이나 사진으로 모든 기관의 기능을 확인했다고 하지 않아요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "문항 답과 현미경 관찰·기능 실험·자료 제작/설명은 각각 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "단원 수행평가 A · 6과11-01",
   "title": "실제 표본의 세포 관찰",
   "blocks": [
    {
     "type": "text",
     "text": "교사가 준비한 식물 표본을 현미경으로 관찰해요. 실제로 보인 모양을 그리고 구별한 구조에 이름을 붙여요."
    },
    {
     "type": "field",
     "title": "A-1 관찰 그림",
     "hint": "표본 이름·배율·보인 세포 모양·확인한 구조 이름을 표시해요.",
     "lines": 3,
     "draw": true
    },
    {
     "type": "field",
     "title": "A-2 다시 관찰할 점",
     "hint": "불분명한 부분과 다시 확인할 관찰 조건을 짧게 써요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "교사는 실제 현미경 조작과 표본 관찰 과정도 함께 봐요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "이름을 맞힌 것만으로 실제 관찰을 마쳤다고 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "assessment-drawing",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "단원 수행평가 B · 6과11-02",
   "title": "기관 기능 실험의 근거",
   "blocks": [
    {
     "type": "text",
     "text": "수업에서 실제로 한 기관 기능 비교 실험 하나를 골라요. 달리한 조건·같게 한 조건·직접 관찰한 결과로 이번 결론을 설명해요."
    },
    {
     "type": "table",
     "heads": [
      "비교한 장치/조건",
      "직접 본 결과·단위/시각"
     ],
     "rows": [
      [
       "",
       ""
      ],
      [
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "B-1 비교 조건",
     "hint": "무엇을 달리하고 무엇을 같게 했는지 써요.",
     "lines": 5,
     "draw": false
    },
    {
     "type": "field",
     "title": "B-2 근거와 결론",
     "hint": "실제 관찰로 말할 수 있는 것과 더 확인할 것을 나누어 써요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "과학적 결론은 장치·조건·실제 관찰과 맞아야 해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "아직 실험하지 못했다면 수행으로 추정하지 않고 다음에 실제로 이어 가요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "assessment",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "단원 수행평가 C · 6과11-03",
   "title": "한 장 자료를 만들고 설명하기",
   "blocks": [
    {
     "type": "text",
     "text": "관심 식물의 구조·기능을 설명하는 한 장 자료를 실제로 만들고 친구에게 보여 주며 설명해요."
    },
    {
     "type": "table",
     "heads": [
      "검토할 부분",
      "내가 자료에서 보여 줄 근거"
     ],
     "rows": [
      [
       "대상 식물과 구조 이름",
       ""
      ],
      [
       "전체와 확대한 부분의 연결",
       ""
      ],
      [
       "생김새·기능과 관찰/조사 근거",
       ""
      ],
      [
       "출처와 실제 설명",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "C-1 친구의 질문으로 보완",
     "hint": "고친 그림/문장과 그 까닭을 써요.",
     "lines": 5,
     "draw": false
    },
    {
     "type": "field",
     "title": "C-2 다음 설명",
     "hint": "다시 보여 준 내용 또는 이어서 할 일을 구별해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "교사는 자료의 실제 완성과 설명·질문 응답을 함께 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "그림 솜씨보다 구조·기능·근거의 연결을 봐요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "assessment",
   "lead": "",
   "layout": "plant-structure-workbook"
  }
 ],
 "teacherStudentPages": [
  {
   "section": "시작하기",
   "title": "식물의 구조와 기능",
   "blocks": [
    {
     "type": "diagram",
     "key": "observe",
     "caption": ""
    },
    {
     "type": "text",
     "text": "현미경으로 작은 세포를 보고 식물 기관의 기능을 실제 비교 실험으로 알아봐요. 물과 양분으로 기관의 관계를 설명하고 관심 식물의 특징 자료를 만들어 나누어요."
    },
    {
     "type": "field",
     "title": "내가 알아보고 싶은 식물",
     "hint": "이름·날짜와 관찰하거나 설명하고 싶은 부분을 적어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 세포 관찰 → 기관 기능 비교 → 특징 자료 제작·설명으로 이어져요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "제공된 연습 자료와 실제 학생 관찰은 구별해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "차례와 공부 방법",
   "title": "관찰에서 근거 있는 설명으로",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "차례",
      "연습 문항"
     ],
     "rows": [
      [
       "1. 현미경으로 만나는 세포",
       "1~16번"
      ],
      [
       "2. 뿌리의 구조와 물 흡수",
       "17~32번"
      ],
      [
       "3. 줄기를 따라 움직이는 물",
       "33~48번"
      ],
      [
       "4. 잎이 만드는 양분의 근거",
       "49~64번"
      ],
      [
       "5. 잎과 물의 이동",
       "65~80번"
      ],
      [
       "6. 함께 일하는 식물의 기관",
       "81~96번"
      ],
      [
       "7. 꽃·열매·씨의 역할",
       "97~112번"
      ],
      [
       "8. 식물 특징을 설명하고 나누기",
       "113~128번"
      ]
     ]
    },
    {
     "type": "text",
     "text": "개념과 예제를 읽고 객관식·빈칸·단답·복수 선택·연결·순서·서술·그림의8형식을 연습해요. 실제 활동은 교사의 준비와 안내에 따라 진행해요."
    },
    {
     "type": "field",
     "title": "나의 학습 점검",
     "hint": "새로 알게 된 구조 이름과 더 관찰하고 싶은 것을 짧게 남겨요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "오른쪽에는 핵심·더 알아보기·나의 정리를 함께 두었어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "실제 활동은 각40분4차시 예시예요. 사전 준비/기다림과 별도16문항 확인45분은 추가로 확보해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "현미경으로 만나는 세포",
   "title": "개념과 핵심 낱말",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "뜻과 확인할 점"
     ],
     "rows": [
      [
       "세포",
       "생물을 이루는 기본 단위"
      ],
      [
       "현미경 관찰",
       "표본에서 실제로 보이는 작은 구조를 살펴보는 관찰"
      ],
      [
       "핵·세포막·세포벽",
       "식물 세포에서 배우는 구조 이름"
      ]
     ]
    },
    {
     "type": "diagram",
     "key": "cells",
     "caption": ""
    },
    {
     "type": "text",
     "text": "식물의 몸은 작은 **세포**로 이루어져 있어요. 교사가 준비한 표본을 현미경으로 실제 관찰하고 보이는 모양을 그림으로 남겨요. 핵·세포막·세포벽의 이름은 자료와 대조해요."
    },
    {
     "type": "field",
     "title": "개념을 내 말로",
     "hint": "잎 한 장이 세포 하나라는 말과 실제 표본에서 보인 모양을 연결해 생각해요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "세포는 생물을 이루는 기본 단위예요. 실제 표본에서 확인한 구조만 이름을 붙여요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모식도와 실제 관찰의 모양·색은 다를 수 있어요. 불분명함도 관찰 정보예요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "현미경으로 만나는 세포",
   "title": "함께 풀고 근거를 확인해요",
   "blocks": [
    {
     "type": "example",
     "question": "같은 표본을 본 두 친구의 그림 모양이 달라요. 어떻게 다시 살펴볼까요?",
     "steps": [
      [
       "대상 확인",
       "같은 식물 표본의 어느 부분을 보았는지 비교해요."
      ],
      [
       "관찰 조건 확인",
       "배율·초점·표본 두께와 조명을 살펴요."
      ],
      [
       "다시 관찰",
       "각자 보인 모양과 구별하기 어려운 부분을 남기고 같은 부분을 다시 봐요."
      ]
     ],
     "answer": "그림을 똑같이 고치기보다 대상과 관찰 조건을 맞추고 다시 확인해요."
    },
    {
     "type": "field",
     "title": "관찰과 설명 그림",
     "hint": "실제 표본에서 볼 것과 설명 그림에서 참고할 것을 나누어 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "세포는 생물을 이루는 기본 단위예요. 실제 표본에서 확인한 구조만 이름을 붙여요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모식도와 실제 관찰의 모양·색은 다를 수 있어요. 불분명함도 관찰 정보예요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "현미경으로 만나는 세포 · 1~3",
   "title": "세포라는 단위",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w001",
      "c22-s61-u03-w002",
      "c22-s61-u03-w003"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "세포는 생물을 이루는 기본 단위예요. 실제 표본에서 확인한 구조만 이름을 붙여요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모식도와 실제 관찰의 모양·색은 다를 수 있어요. 불분명함도 관찰 정보예요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "현미경으로 만나는 세포 · 4~5",
   "title": "실제 관찰 준비",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w004",
      "c22-s61-u03-w005"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "세포는 생물을 이루는 기본 단위예요. 실제 표본에서 확인한 구조만 이름을 붙여요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모식도와 실제 관찰의 모양·색은 다를 수 있어요. 불분명함도 관찰 정보예요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "현미경으로 만나는 세포 · 6~8",
   "title": "안 보이는 구조",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w006",
      "c22-s61-u03-w007",
      "c22-s61-u03-w008"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "세포는 생물을 이루는 기본 단위예요. 실제 표본에서 확인한 구조만 이름을 붙여요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모식도와 실제 관찰의 모양·색은 다를 수 있어요. 불분명함도 관찰 정보예요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "현미경으로 만나는 세포 · 9~10",
   "title": "관찰 기록 고르기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w009",
      "c22-s61-u03-w010"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "세포는 생물을 이루는 기본 단위예요. 실제 표본에서 확인한 구조만 이름을 붙여요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모식도와 실제 관찰의 모양·색은 다를 수 있어요. 불분명함도 관찰 정보예요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "현미경으로 만나는 세포 · 11~12",
   "title": "기관과 세포",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w011",
      "c22-s61-u03-w012"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "세포는 생물을 이루는 기본 단위예요. 실제 표본에서 확인한 구조만 이름을 붙여요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모식도와 실제 관찰의 모양·색은 다를 수 있어요. 불분명함도 관찰 정보예요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "현미경으로 만나는 세포 · 13~14",
   "title": "모식도와 실제 관찰",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w013",
      "c22-s61-u03-w014"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "세포는 생물을 이루는 기본 단위예요. 실제 표본에서 확인한 구조만 이름을 붙여요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모식도와 실제 관찰의 모양·색은 다를 수 있어요. 불분명함도 관찰 정보예요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "현미경으로 만나는 세포 · 15",
   "title": "표본 차이",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w015"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "세포는 생물을 이루는 기본 단위예요. 실제 표본에서 확인한 구조만 이름을 붙여요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모식도와 실제 관찰의 모양·색은 다를 수 있어요. 불분명함도 관찰 정보예요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "현미경으로 만나는 세포 · 16",
   "title": "내가 본 식물 세포",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w016"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "세포는 생물을 이루는 기본 단위예요. 실제 표본에서 확인한 구조만 이름을 붙여요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모식도와 실제 관찰의 모양·색은 다를 수 있어요. 불분명함도 관찰 정보예요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "실제 활동 ① · 현미경",
   "title": "내 표본에서 보인 세포를 그려요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "교사 준비 표본을 안정된 현미경에 놓고 낮은 배율부터 실제로 봐요.",
      "표본 이름·배율과 보인 모양을 남기고 핵·세포막·세포벽 이름을 자료와 대조해요.",
      "실제로 구별한 부분만 이름표를 붙이고 흐리거나 안 보인 부분은 그대로 밝혀요."
     ]
    },
    {
     "type": "field",
     "title": "관찰 그림과 이름표",
     "hint": "표본 이름·배율·보인 모양과 구별한 구조를 표시해요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "세포는 생물을 이루는 기본 단위예요. 실제 표본에서 확인한 구조만 이름을 붙여요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "렌즈와 표본이 닿지 않게 교사의 초점·배율 조작 안내를 따라요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-microscope",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "뿌리의 구조와 물 흡수",
   "title": "개념과 핵심 낱말",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "뜻과 확인할 점"
     ],
     "rows": [
      [
       "뿌리",
       "물을 흡수하고 식물 몸을 지지하는 기관"
      ],
      [
       "비교 조건",
       "뿌리 유무 외에 같게 준비할 조건"
      ],
      [
       "저장하는 부분",
       "당근은 뿌리, 감자는 줄기에 양분을 저장한 예"
      ]
     ]
    },
    {
     "type": "diagram",
     "key": "plant",
     "caption": ""
    },
    {
     "type": "text",
     "text": "뿌리의 구조와 **물 흡수·몸 지지**를 연결해요. 물이 줄어든 양을 비교할 때에는 식물의 상태, 처음 물의 양, 용기·입구 처리, 시간과 주변 환경을 함께 확인해요."
    },
    {
     "type": "field",
     "title": "개념을 내 말로",
     "hint": "뿌리 유무 외에 같게 준비할 조건 두 가지와 그 까닭을 써요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "뿌리는 물 흡수와 몸 지지에 도움을 줘요. 비교 실험에서는 뿌리 유무 외의 조건을 맞춰요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "당근은 뿌리, 감자는 줄기에 저장한 예예요. 땅속 위치만으로 기관을 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "뿌리의 구조와 물 흡수",
   "title": "함께 풀고 근거를 확인해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "장치",
      "처음 물",
      "같은 시간 뒤"
     ],
     "rows": [
      [
       "뿌리 남김",
       "40mL",
       "30mL"
      ],
      [
       "뿌리 제거",
       "40mL",
       "37mL"
      ]
     ]
    },
    {
     "type": "example",
     "question": "입구를 같은 방법으로 막은 두 장치의 제공된 연습 기록입니다. 물이 더 많이 줄어든 쪽과 그 근거는?",
     "steps": [
      [
       "변화량 구하기",
       "뿌리 남김은40−30=10mL, 제거는40−37=3mL 줄었어요."
      ],
      [
       "비교하기",
       "남아 있는 양이 아니라 처음과 나중의 차이를 비교해요."
      ],
      [
       "설명 범위",
       "이번 조건에서 뿌리의 물 흡수와 관련지어 설명해요."
      ]
     ],
     "answer": "뿌리를 남긴 쪽이10mL로 더 많이 줄었어요."
    },
    {
     "type": "text",
     "text": "직접 증발과 절단에 따른 손상 같은 영향도 살펴요. 이 표의 수치를 실제로 잰 값이라고 옮기지 않아요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "뿌리는 물 흡수와 몸 지지에 도움을 줘요. 비교 실험에서는 뿌리 유무 외의 조건을 맞춰요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "당근은 뿌리, 감자는 줄기에 저장한 예예요. 땅속 위치만으로 기관을 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "뿌리의 구조와 물 흡수 · 17~19",
   "title": "뿌리의 역할",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w017",
      "c22-s61-u03-w018",
      "c22-s61-u03-w019"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "뿌리는 물 흡수와 몸 지지에 도움을 줘요. 비교 실험에서는 뿌리 유무 외의 조건을 맞춰요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "당근은 뿌리, 감자는 줄기에 저장한 예예요. 땅속 위치만으로 기관을 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "뿌리의 구조와 물 흡수 · 20~21",
   "title": "맞출 조건",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w020",
      "c22-s61-u03-w021"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "뿌리는 물 흡수와 몸 지지에 도움을 줘요. 비교 실험에서는 뿌리 유무 외의 조건을 맞춰요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "당근은 뿌리, 감자는 줄기에 저장한 예예요. 땅속 위치만으로 기관을 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "뿌리의 구조와 물 흡수 · 22~24",
   "title": "용기 입구의 차이",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w022",
      "c22-s61-u03-w023",
      "c22-s61-u03-w024"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "뿌리는 물 흡수와 몸 지지에 도움을 줘요. 비교 실험에서는 뿌리 유무 외의 조건을 맞춰요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "당근은 뿌리, 감자는 줄기에 저장한 예예요. 땅속 위치만으로 기관을 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "뿌리의 구조와 물 흡수 · 25~26",
   "title": "나중 양과 감소량",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w025",
      "c22-s61-u03-w026"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "뿌리는 물 흡수와 몸 지지에 도움을 줘요. 비교 실험에서는 뿌리 유무 외의 조건을 맞춰요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "당근은 뿌리, 감자는 줄기에 저장한 예예요. 땅속 위치만으로 기관을 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "뿌리의 구조와 물 흡수 · 27~28",
   "title": "절단의 영향",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w027",
      "c22-s61-u03-w028"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "뿌리는 물 흡수와 몸 지지에 도움을 줘요. 비교 실험에서는 뿌리 유무 외의 조건을 맞춰요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "당근은 뿌리, 감자는 줄기에 저장한 예예요. 땅속 위치만으로 기관을 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "뿌리의 구조와 물 흡수 · 29~30",
   "title": "결론의 범위",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w029",
      "c22-s61-u03-w030"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "뿌리는 물 흡수와 몸 지지에 도움을 줘요. 비교 실험에서는 뿌리 유무 외의 조건을 맞춰요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "당근은 뿌리, 감자는 줄기에 저장한 예예요. 땅속 위치만으로 기관을 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "뿌리의 구조와 물 흡수 · 31",
   "title": "숫자만 같은 자료",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w031"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "뿌리는 물 흡수와 몸 지지에 도움을 줘요. 비교 실험에서는 뿌리 유무 외의 조건을 맞춰요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "당근은 뿌리, 감자는 줄기에 저장한 예예요. 땅속 위치만으로 기관을 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "뿌리의 구조와 물 흡수 · 32",
   "title": "뿌리 비교 장치",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w032"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "뿌리는 물 흡수와 몸 지지에 도움을 줘요. 비교 실험에서는 뿌리 유무 외의 조건을 맞춰요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "당근은 뿌리, 감자는 줄기에 저장한 예예요. 땅속 위치만으로 기관을 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "실제 활동 ② · 뿌리",
   "title": "물의 흡수를 같은 조건에서 비교해요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "교사가 준비한 뿌리 유무 비교 장치에서 처음 물과 입구 상태를 확인해요.",
      "같은 시간 뒤 물의 양을 읽고 각자의 처음 값에서 나중 값을 빼요.",
      "같은 조건·직접 증발·절단 영향과 실제 관찰 범위를 함께 설명해요."
     ]
    },
    {
     "type": "table",
     "heads": [
      "장치·상태",
      "처음 물/단위",
      "뒤 물/단위",
      "관찰 시간"
     ],
     "rows": [
      [
       "뿌리 남김",
       "",
       "",
       ""
      ],
      [
       "뿌리 제거",
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "우리의 비교 조건과 근거",
     "hint": "실제로 읽은 값과 불분명한 것, 더 확인할 조건을 써요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "뿌리는 물 흡수와 몸 지지에 도움을 줘요. 비교 실험에서는 뿌리 유무 외의 조건을 맞춰요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "당근은 뿌리, 감자는 줄기에 저장한 예예요. 땅속 위치만으로 기관을 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-root",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "줄기를 따라 움직이는 물",
   "title": "개념과 핵심 낱말",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "뜻과 확인할 점"
     ],
     "rows": [
      [
       "줄기",
       "잎 등을 지지하고 물이 이동하는 통로가 되는 기관"
      ],
      [
       "가로 단면",
       "길이에 가로지르는 방향으로 자른 면"
      ],
      [
       "세로 단면",
       "길이를 따라 자른 면"
      ]
     ]
    },
    {
     "type": "diagram",
     "key": "stem",
     "caption": ""
    },
    {
     "type": "text",
     "text": "색소 물에 두었던 줄기의 단면에서 **색이 나타난 위치**를 살펴요. 가로로 자르면 점처럼 보이는 부분이 세로로는 길게 이어진 자취로 보일 수 있어요."
    },
    {
     "type": "field",
     "title": "개념을 내 말로",
     "hint": "가로 단면과 세로 단면을 함께 볼 때 더 잘 설명할 수 있는 것을 써요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "줄기는 잎 등을 지지하고 물이 다른 기관으로 가는 통로가 돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "가로의 점과 세로의 길게 이어진 자취는 자른 방향과 함께 읽어요. 모든 양분의 경로를 검출한 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "줄기를 따라 움직이는 물",
   "title": "함께 풀고 근거를 확인해요",
   "blocks": [
    {
     "type": "example",
     "question": "교사 준비 줄기에서 가로 면에는 붉은 점들, 세로 면에는 길게 이어진 붉은 자취가 보였어요. 무엇을 설명할 수 있나요?",
     "steps": [
      [
       "관찰 구별",
       "가로 면의 위치와 세로 면의 이어짐을 각각 읽어요."
      ],
      [
       "관계 연결",
       "서로 다른 두 방향의 관찰을 물이 지나간 부분과 연결해요."
      ],
      [
       "결론 한정",
       "이 장치로 모든 양분의 이동 경로까지 검출했다고 말하지 않아요."
      ]
     ],
     "answer": "줄기 안의 물 이동을 색 자취와 자른 방향을 근거로 설명해요."
    },
    {
     "type": "field",
     "title": "그림에 꼭 넣을 이름표",
     "hint": "자른 방향·실제로 색이 보인 부분·표본 이름을 왜 표시해야 하는지 써요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "줄기는 잎 등을 지지하고 물이 다른 기관으로 가는 통로가 돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "가로의 점과 세로의 길게 이어진 자취는 자른 방향과 함께 읽어요. 모든 양분의 경로를 검출한 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "줄기를 따라 움직이는 물 · 33~35",
   "title": "줄기와 잎",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w033",
      "c22-s61-u03-w034",
      "c22-s61-u03-w035"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "줄기는 잎 등을 지지하고 물이 다른 기관으로 가는 통로가 돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "가로의 점과 세로의 길게 이어진 자취는 자른 방향과 함께 읽어요. 모든 양분의 경로를 검출한 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "줄기를 따라 움직이는 물 · 36~37",
   "title": "단면 관찰의 근거",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w036",
      "c22-s61-u03-w037"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "줄기는 잎 등을 지지하고 물이 다른 기관으로 가는 통로가 돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "가로의 점과 세로의 길게 이어진 자취는 자른 방향과 함께 읽어요. 모든 양분의 경로를 검출한 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "줄기를 따라 움직이는 물 · 38~40",
   "title": "겉만 묻은 색",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w038",
      "c22-s61-u03-w039",
      "c22-s61-u03-w040"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "줄기는 잎 등을 지지하고 물이 다른 기관으로 가는 통로가 돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "가로의 점과 세로의 길게 이어진 자취는 자른 방향과 함께 읽어요. 모든 양분의 경로를 검출한 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "줄기를 따라 움직이는 물 · 41~42",
   "title": "연습 기록의 읽기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w041",
      "c22-s61-u03-w042"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "줄기는 잎 등을 지지하고 물이 다른 기관으로 가는 통로가 돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "가로의 점과 세로의 길게 이어진 자취는 자른 방향과 함께 읽어요. 모든 양분의 경로를 검출한 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "줄기를 따라 움직이는 물 · 43~44",
   "title": "색소가 없을 때",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w043",
      "c22-s61-u03-w044"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "줄기는 잎 등을 지지하고 물이 다른 기관으로 가는 통로가 돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "가로의 점과 세로의 길게 이어진 자취는 자른 방향과 함께 읽어요. 모든 양분의 경로를 검출한 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "줄기를 따라 움직이는 물 · 45~46",
   "title": "관찰 뒤의 주장",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w045",
      "c22-s61-u03-w046"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "줄기는 잎 등을 지지하고 물이 다른 기관으로 가는 통로가 돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "가로의 점과 세로의 길게 이어진 자취는 자른 방향과 함께 읽어요. 모든 양분의 경로를 검출한 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "줄기를 따라 움직이는 물 · 47",
   "title": "더 필요한 증거",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w047"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "줄기는 잎 등을 지지하고 물이 다른 기관으로 가는 통로가 돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "가로의 점과 세로의 길게 이어진 자취는 자른 방향과 함께 읽어요. 모든 양분의 경로를 검출한 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "줄기를 따라 움직이는 물 · 48",
   "title": "관찰 자취를 두 방향으로",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w048"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "줄기는 잎 등을 지지하고 물이 다른 기관으로 가는 통로가 돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "가로의 점과 세로의 길게 이어진 자취는 자른 방향과 함께 읽어요. 모든 양분의 경로를 검출한 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "실제 활동 ③ · 줄기",
   "title": "색이 보인 위치와 자른 방향",
   "blocks": [
    {
     "type": "list",
     "items": [
      "색소 물에 넣기 전 겉의 색과 처리 시간·표본 이름을 확인해요.",
      "교사가 안전하게 준비한 가로/세로 단면을 실제로 살펴요.",
      "아래에 두 방향을 나누고 실제 보인 색 자취와 이름표를 그려요."
     ]
    },
    {
     "type": "field",
     "title": "두 방향의 단면과 설명",
     "hint": "점처럼 보인 곳과 길게 이어진 곳을 표시해 물 이동의 근거를 설명해요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "줄기는 잎 등을 지지하고 물이 다른 기관으로 가는 통로가 돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "칼로 단면을 자르는 준비는 교사가 맡아요. 안 보인 부분은 예상 색으로 채우지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-stem",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "잎이 만드는 양분의 근거",
   "title": "개념과 핵심 낱말",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "뜻과 확인할 점"
     ],
     "rows": [
      [
       "광합성",
       "식물이 빛을 이용하여 스스로 양분을 만드는 작용"
      ],
      [
       "물·이산화 탄소",
       "잎에서 양분을 만드는 데 이용하는 물질"
      ],
      [
       "녹말 검출",
       "양분 생성의 근거를 확인하는 한 가지 방법"
      ]
     ]
    },
    {
     "type": "diagram",
     "key": "leaf",
     "caption": ""
    },
    {
     "type": "text",
     "text": "잎은 **물과 이산화 탄소**를 이용하여 빛을 받아 양분을 만들어요. 교사가 준비한 시료의 녹말 검출 결과를 읽을 때에는 처리 전 상태와 빛 처리·어둠 처리의 다른 조건을 함께 봐요."
    },
    {
     "type": "field",
     "title": "개념을 내 말로",
     "hint": "빛 처리 뒤 반응만 보지 않고 처리 전 상태도 확인하는 까닭을 써요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "잎은 물·이산화 탄소를 이용해 빛을 받아 양분을 만들어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "녹말 검출은 처리 전 상태·빛 차이·처리 뒤 실제 반응을 함께 봐요. 모든 양분을 녹말 하나로 제한하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "잎이 만드는 양분의 근거",
   "title": "함께 풀고 근거를 확인해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "제공된 연습 시료",
      "녹말 검출 반응"
     ],
     "rows": [
      [
       "처리 전 비교",
       "미검출"
      ],
      [
       "빛을 받은 뒤",
       "청람색"
      ],
      [
       "어둠에 둔 뒤",
       "미검출"
      ]
     ]
    },
    {
     "type": "example",
     "question": "다른 조건을 같게 준비했다면 이 자료에서 뒷받침되는 설명은?",
     "steps": [
      [
       "처음 상태",
       "처리 전 비교 자료에서 녹말이 검출되지 않았어요."
      ],
      [
       "처리 뒤 비교",
       "빛을 받은 뒤에는 청람색 반응이 나타났어요."
      ],
      [
       "근거로 설명",
       "이번 조건에서 빛을 받은 잎의 녹말 생성을 뒷받침해요."
      ]
     ],
     "answer": "처리 전/뒤와 빛/어둠을 함께 비교하여 설명해요."
    },
    {
     "type": "text",
     "text": "어두운 잎에 어떤 물질도 없다는 뜻은 아니에요. 실제 반응이 다르면 그대로 남기고 처음 상태와 처리 조건을 다시 확인해요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "잎은 물·이산화 탄소를 이용해 빛을 받아 양분을 만들어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "녹말 검출은 처리 전 상태·빛 차이·처리 뒤 실제 반응을 함께 봐요. 모든 양분을 녹말 하나로 제한하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "잎이 만드는 양분의 근거 · 49~51",
   "title": "잎의 구조와 빛",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w049",
      "c22-s61-u03-w050",
      "c22-s61-u03-w051"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "잎은 물·이산화 탄소를 이용해 빛을 받아 양분을 만들어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "녹말 검출은 처리 전 상태·빛 차이·처리 뒤 실제 반응을 함께 봐요. 모든 양분을 녹말 하나로 제한하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "잎이 만드는 양분의 근거 · 52~53",
   "title": "필요한 재료와 조건",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w052",
      "c22-s61-u03-w053"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "잎은 물·이산화 탄소를 이용해 빛을 받아 양분을 만들어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "녹말 검출은 처리 전 상태·빛 차이·처리 뒤 실제 반응을 함께 봐요. 모든 양분을 녹말 하나로 제한하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "잎이 만드는 양분의 근거 · 54~55",
   "title": "시작 전 확인",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w054",
      "c22-s61-u03-w055"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "잎은 물·이산화 탄소를 이용해 빛을 받아 양분을 만들어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "녹말 검출은 처리 전 상태·빛 차이·처리 뒤 실제 반응을 함께 봐요. 모든 양분을 녹말 하나로 제한하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "잎이 만드는 양분의 근거 · 56~58",
   "title": "공기 중 재료",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w056",
      "c22-s61-u03-w057",
      "c22-s61-u03-w058"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "잎은 물·이산화 탄소를 이용해 빛을 받아 양분을 만들어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "녹말 검출은 처리 전 상태·빛 차이·처리 뒤 실제 반응을 함께 봐요. 모든 양분을 녹말 하나로 제한하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "잎이 만드는 양분의 근거 · 59~60",
   "title": "두 잎 모두 반응",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w059",
      "c22-s61-u03-w060"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "잎은 물·이산화 탄소를 이용해 빛을 받아 양분을 만들어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "녹말 검출은 처리 전 상태·빛 차이·처리 뒤 실제 반응을 함께 봐요. 모든 양분을 녹말 하나로 제한하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "잎이 만드는 양분의 근거 · 61~62",
   "title": "실험 조작의 담당",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w061",
      "c22-s61-u03-w062"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "잎은 물·이산화 탄소를 이용해 빛을 받아 양분을 만들어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "녹말 검출은 처리 전 상태·빛 차이·처리 뒤 실제 반응을 함께 봐요. 모든 양분을 녹말 하나로 제한하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "잎이 만드는 양분의 근거 · 63",
   "title": "검출 결과의 한계",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w063"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "잎은 물·이산화 탄소를 이용해 빛을 받아 양분을 만들어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "녹말 검출은 처리 전 상태·빛 차이·처리 뒤 실제 반응을 함께 봐요. 모든 양분을 녹말 하나로 제한하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "잎이 만드는 양분의 근거 · 64",
   "title": "빛 비교의 설명 그림",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w064"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "잎은 물·이산화 탄소를 이용해 빛을 받아 양분을 만들어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "녹말 검출은 처리 전 상태·빛 차이·처리 뒤 실제 반응을 함께 봐요. 모든 양분을 녹말 하나로 제한하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "실제 활동 ④ · 잎",
   "title": "처리 전과 빛·어둠의 반응을 봐요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "교사가 준비한 처리 전 비교·빛·어둠 시료의 이름과 다른 비교 조건을 확인해요.",
      "안내에 따라 실제 검출 반응을 보고 청람색/미검출/불분명을 구별해요.",
      "예상과 달라도 관찰을 보존하고 처음 상태·처리 방법을 다시 살펴요."
     ]
    },
    {
     "type": "table",
     "heads": [
      "교사 준비 시료",
      "실제 본 반응·불분명",
      "확인한 조건"
     ],
     "rows": [
      [
       "처리 전 비교",
       "",
       ""
      ],
      [
       "빛 처리 뒤",
       "",
       ""
      ],
      [
       "어둠 처리 뒤",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "이번 결과로 말할 수 있는 것",
     "hint": "시작 상태와 처리 전/뒤 비교를 근거로 설명해요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "잎은 물·이산화 탄소를 이용해 빛을 받아 양분을 만들어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "약품·알코올·가열/뜨거운 시료와 폐기는 교사가 맡아요. 학생은 임의로 섞거나 가열하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-starch",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "잎과 물의 이동",
   "title": "개념과 핵심 낱말",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "뜻과 확인할 점"
     ],
     "rows": [
      [
       "증산",
       "식물 안의 물이 수증기로 나가는 현상"
      ],
      [
       "기공",
       "잎에서 물이 나가는 과정과 관련된 구조"
      ],
      [
       "물방울 맺힘",
       "봉지 안에서 수증기가 식어 액체로 모이는 과정"
      ]
     ]
    },
    {
     "type": "diagram",
     "key": "transpiration",
     "caption": ""
    },
    {
     "type": "text",
     "text": "증산으로 나간 **수증기**와 봉지 안에 맺힌 **물방울**을 구별해요. 잎 유무의 영향을 비교할 때에는 처음부터 두 봉지의 안쪽이 말랐는지 확인해요."
    },
    {
     "type": "field",
     "title": "개념을 내 말로",
     "hint": "증산의 수증기와 봉지 안 물방울의 상태를 구별해 써요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "증산은 식물 안의 물이 수증기로 나가는 현상이며 기공과 관련돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "나간 수증기가 봉지 안에서 물방울로 맺히는 과정과 구별해요. 초기 봉지 물기와 직접 증발도 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "잎과 물의 이동",
   "title": "함께 풀고 근거를 확인해요",
   "blocks": [
    {
     "type": "example",
     "question": "한 봉지 안에는 시작 전부터 물방울이 있었어요. 나중에 더 젖었다는 모습만으로 잎의 영향을 비교해도 될까요?",
     "steps": [
      [
       "처음 조건 읽기",
       "두 봉지의 시작 상태가 달랐어요."
      ],
      [
       "원인 구별",
       "처음 있던 물기와 나중 생긴 물방울을 구별하기 어려워요."
      ],
      [
       "다시 비교",
       "마른 봉지와 같은 물/용기·시간·주변 조건으로 준비해요."
      ]
     ],
     "answer": "처음 상태를 맞춰 다시 비교하고 원래 관찰도 함께 남겨요."
    },
    {
     "type": "field",
     "title": "같게 할 조건과 실제로 볼 것",
     "hint": "잎 유무 외의 조건과 물방울/물의 감소에서 확인할 것을 써요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "증산은 식물 안의 물이 수증기로 나가는 현상이며 기공과 관련돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "나간 수증기가 봉지 안에서 물방울로 맺히는 과정과 구별해요. 초기 봉지 물기와 직접 증발도 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "잎과 물의 이동 · 65~67",
   "title": "수증기로 나가는 물",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w065",
      "c22-s61-u03-w066",
      "c22-s61-u03-w067"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "증산은 식물 안의 물이 수증기로 나가는 현상이며 기공과 관련돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "나간 수증기가 봉지 안에서 물방울로 맺히는 과정과 구별해요. 초기 봉지 물기와 직접 증발도 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "잎과 물의 이동 · 68~69",
   "title": "봉지 비교 준비",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w068",
      "c22-s61-u03-w069"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "증산은 식물 안의 물이 수증기로 나가는 현상이며 기공과 관련돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "나간 수증기가 봉지 안에서 물방울로 맺히는 과정과 구별해요. 초기 봉지 물기와 직접 증발도 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "잎과 물의 이동 · 70~72",
   "title": "처음부터 젖은 봉지",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w070",
      "c22-s61-u03-w071",
      "c22-s61-u03-w072"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "증산은 식물 안의 물이 수증기로 나가는 현상이며 기공과 관련돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "나간 수증기가 봉지 안에서 물방울로 맺히는 과정과 구별해요. 초기 봉지 물기와 직접 증발도 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "잎과 물의 이동 · 73~75",
   "title": "감소량에 단위 쓰기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w073",
      "c22-s61-u03-w074",
      "c22-s61-u03-w075"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "증산은 식물 안의 물이 수증기로 나가는 현상이며 기공과 관련돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "나간 수증기가 봉지 안에서 물방울로 맺히는 과정과 구별해요. 초기 봉지 물기와 직접 증발도 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "잎과 물의 이동 · 76~77",
   "title": "잎을 제거한 장치도 감소",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w076",
      "c22-s61-u03-w077"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "증산은 식물 안의 물이 수증기로 나가는 현상이며 기공과 관련돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "나간 수증기가 봉지 안에서 물방울로 맺히는 과정과 구별해요. 초기 봉지 물기와 직접 증발도 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "잎과 물의 이동 · 78~79",
   "title": "증산 비교의 흐름",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w078",
      "c22-s61-u03-w079"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "증산은 식물 안의 물이 수증기로 나가는 현상이며 기공과 관련돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "나간 수증기가 봉지 안에서 물방울로 맺히는 과정과 구별해요. 초기 봉지 물기와 직접 증발도 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "잎과 물의 이동 · 80",
   "title": "공정한 잎 유무 비교",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w080"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "증산은 식물 안의 물이 수증기로 나가는 현상이며 기공과 관련돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "나간 수증기가 봉지 안에서 물방울로 맺히는 과정과 구별해요. 초기 봉지 물기와 직접 증발도 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "실제 활동 ⑤ · 증산",
   "title": "처음부터 마른 봉지로 비교해요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "두 봉지의 처음 물기와 물의 양·용기·입구·주변 조건을 확인해요.",
      "같은 시간 뒤 실제 물방울과 물의 감소를 살펴 잎 유무를 비교해요.",
      "수증기로 나감과 물방울로 맺힘을 나누어 설명해요."
     ]
    },
    {
     "type": "table",
     "heads": [
      "비교 대상",
      "처음 상태",
      "뒤에 실제 본 것",
      "시각/조건"
     ],
     "rows": [
      [
       "잎 있음",
       "",
       "",
       ""
      ],
      [
       "잎 없음",
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "관찰과 해석",
     "hint": "처음 물기·직접 증발·절단 영향을 함께 살펴 결론을 써요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "증산은 식물 안의 물이 수증기로 나가는 현상이며 기공과 관련돼요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "나간 수증기가 봉지 안에서 물방울로 맺히는 과정과 구별해요. 초기 봉지 물기와 직접 증발도 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-transpiration",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "함께 일하는 식물의 기관",
   "title": "개념과 핵심 낱말",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "뜻과 확인할 점"
     ],
     "rows": [
      [
       "기관의 관계",
       "각 기관의 기능이 물과 양분의 이동으로 이어지는 관계"
      ],
      [
       "지지와 이동",
       "줄기가 잎 등을 받치고 물을 다른 기관으로 보내는 역할"
      ],
      [
       "양분의 이용",
       "잎에서 만든 양분을 다른 기관도 생장·저장에 이용하는 일"
      ]
     ]
    },
    {
     "type": "diagram",
     "key": "plant",
     "caption": ""
    },
    {
     "type": "text",
     "text": "뿌리에서 흡수한 물은 줄기를 지나 다른 기관으로 이동해요. 잎에서 만든 양분도 식물의 다른 기관에서 이용돼요. 각 기능을 따로 외우는 데서 **서로 이어 설명하기**로 나아가요."
    },
    {
     "type": "field",
     "title": "개념을 내 말로",
     "hint": "뿌리·줄기·잎의 관계를 물과 양분으로 연결해 써요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물의 흡수·이동·배출과 양분 생성/이용을 뿌리·줄기·잎의 관계로 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물의 이동 화살표를 양분의 모든 이동에 같은 방향으로 적용하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "함께 일하는 식물의 기관",
   "title": "함께 풀고 근거를 확인해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "확인한 근거",
      "직접 연결할 역할"
     ],
     "rows": [
      [
       "뿌리 비교 장치의 물 감소",
       "뿌리의 물 흡수"
      ],
      [
       "줄기 단면의 색소 자취",
       "줄기를 통한 물 이동"
      ],
      [
       "처리 전/뒤 잎의 녹말 검출",
       "잎에서 양분 생성"
      ]
     ]
    },
    {
     "type": "example",
     "question": "“물은 위로 움직이므로 모든 양분도 늘 같은 방향으로만 간다”는 설명을 고쳐 보세요.",
     "steps": [
      [
       "물의 근거",
       "뿌리 흡수와 줄기의 물 이동을 확인한 근거를 읽어요."
      ],
      [
       "양분의 관계",
       "잎에서 만들어진 양분은 다른 기관의 생장/저장에도 쓰여요."
      ],
      [
       "표현 고치기",
       "하나의 물 이동 화살표로 모든 양분의 이동을 똑같이 그리지 않아요."
      ]
     ],
     "answer": "각 과정의 근거와 기관 사이의 관계를 구별해 설명해요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물의 흡수·이동·배출과 양분 생성/이용을 뿌리·줄기·잎의 관계로 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물의 이동 화살표를 양분의 모든 이동에 같은 방향으로 적용하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "함께 일하는 식물의 기관 · 81~83",
   "title": "물의 이동 길",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w081",
      "c22-s61-u03-w082",
      "c22-s61-u03-w083"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물의 흡수·이동·배출과 양분 생성/이용을 뿌리·줄기·잎의 관계로 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물의 이동 화살표를 양분의 모든 이동에 같은 방향으로 적용하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "함께 일하는 식물의 기관 · 84~85",
   "title": "함께 일하는 기관",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w084",
      "c22-s61-u03-w085"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물의 흡수·이동·배출과 양분 생성/이용을 뿌리·줄기·잎의 관계로 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물의 이동 화살표를 양분의 모든 이동에 같은 방향으로 적용하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "함께 일하는 식물의 기관 · 86~88",
   "title": "그림에서 빠진 기관",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w086",
      "c22-s61-u03-w087",
      "c22-s61-u03-w088"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물의 흡수·이동·배출과 양분 생성/이용을 뿌리·줄기·잎의 관계로 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물의 이동 화살표를 양분의 모든 이동에 같은 방향으로 적용하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "함께 일하는 식물의 기관 · 89~90",
   "title": "생김새만으로 모르는 것",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w089",
      "c22-s61-u03-w090"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물의 흡수·이동·배출과 양분 생성/이용을 뿌리·줄기·잎의 관계로 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물의 이동 화살표를 양분의 모든 이동에 같은 방향으로 적용하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "함께 일하는 식물의 기관 · 91",
   "title": "같은 식물의 역할 분담",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w091"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물의 흡수·이동·배출과 양분 생성/이용을 뿌리·줄기·잎의 관계로 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물의 이동 화살표를 양분의 모든 이동에 같은 방향으로 적용하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "함께 일하는 식물의 기관 · 92~93",
   "title": "양분 길을 물 길로 단정",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w092",
      "c22-s61-u03-w093"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물의 흡수·이동·배출과 양분 생성/이용을 뿌리·줄기·잎의 관계로 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물의 이동 화살표를 양분의 모든 이동에 같은 방향으로 적용하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "함께 일하는 식물의 기관 · 94~95",
   "title": "물 이동 설명 순서",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w094",
      "c22-s61-u03-w095"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물의 흡수·이동·배출과 양분 생성/이용을 뿌리·줄기·잎의 관계로 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물의 이동 화살표를 양분의 모든 이동에 같은 방향으로 적용하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "함께 일하는 식물의 기관 · 96",
   "title": "기관 연결 지도",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w096"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물의 흡수·이동·배출과 양분 생성/이용을 뿌리·줄기·잎의 관계로 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물의 이동 화살표를 양분의 모든 이동에 같은 방향으로 적용하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "실제 활동 ⑥ · 기관 연결",
   "title": "한 식물 안에서 물과 양분을 연결해요",
   "blocks": [
    {
     "type": "text",
     "text": "실제로 관찰한 식물이나 확인한 자료의 뿌리·줄기·잎을 크게 그려요. 물의 이동과 잎에서 만든 양분을 이용하는 기관의 관계를 서로 다른 이름표로 설명해요."
    },
    {
     "type": "field",
     "title": "우리 식물의 기관 관계",
     "hint": "대상 이름·각 기관 이름·물/양분의 관계와 관찰/자료 근거를 표시해요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물의 흡수·이동·배출과 양분 생성/이용을 뿌리·줄기·잎의 관계로 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물의 이동 화살표를 양분의 모든 이동에 같은 방향으로 적용하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-organs",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "꽃·열매·씨의 역할",
   "title": "개념과 핵심 낱말",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "뜻과 확인할 점"
     ],
     "rows": [
      [
       "꽃가루받이",
       "수술의 꽃가루가 암술머리에 닿는 일"
      ],
      [
       "열매",
       "씨를 보호하는 등 씨와 관련된 역할을 하는 기관"
      ],
      [
       "씨의 퍼짐",
       "열매/씨의 구조와 주변 조건을 함께 살펴볼 과정"
      ]
     ]
    },
    {
     "type": "diagram",
     "key": "flower",
     "caption": ""
    },
    {
     "type": "text",
     "text": "꽃의 구조와 **꽃가루받이**, 열매와 씨의 역할을 단계별로 구별해요. 꽃에 벌이 방문한 사진 한 장으로 씨가 생기고 퍼지는 과정까지 끝났다고 정하지 않아요."
    },
    {
     "type": "field",
     "title": "개념을 내 말로",
     "hint": "벌이 꽃에 온 사진 한 장으로 씨 퍼짐까지 확인할 수 있는지 근거를 써요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수술의 꽃가루가 암술머리에 닿는 꽃가루받이와 씨가 퍼지는 단계를 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "열매/씨의 실제 구조와 가능한 보호/퍼짐 역할을 연결해요. 이름이나 사는 곳만으로 방법을 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "꽃·열매·씨의 역할",
   "title": "함께 풀고 근거를 확인해요",
   "blocks": [
    {
     "type": "example",
     "question": "열매 사진에 갈고리 모양의 구조가 보여요. 이 특징을 설명하는 자료에는 무엇을 더 연결할까요?",
     "steps": [
      [
       "구조 읽기",
       "어느 부분에 어떤 생김새가 있는지 표시해요."
      ],
      [
       "기능 생각하기",
       "다른 대상에 붙어 옮겨질 가능성과 연결해요."
      ],
      [
       "근거 보완",
       "해당 식물의 관찰이나 출처 있는 조사 자료에서 퍼짐 방법을 확인해요."
      ]
     ],
     "answer": "이름이나 사는 곳만으로 단정하지 않고 구조와 확인한 근거로 설명해요."
    },
    {
     "type": "field",
     "title": "같은 단계일까요?",
     "hint": "꽃 방문·꽃가루받이·열매/씨 형성·씨 퍼짐을 구별해 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수술의 꽃가루가 암술머리에 닿는 꽃가루받이와 씨가 퍼지는 단계를 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "열매/씨의 실제 구조와 가능한 보호/퍼짐 역할을 연결해요. 이름이나 사는 곳만으로 방법을 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "꽃·열매·씨의 역할 · 97~99",
   "title": "꽃가루받이",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w097",
      "c22-s61-u03-w098",
      "c22-s61-u03-w099"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수술의 꽃가루가 암술머리에 닿는 꽃가루받이와 씨가 퍼지는 단계를 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "열매/씨의 실제 구조와 가능한 보호/퍼짐 역할을 연결해요. 이름이나 사는 곳만으로 방법을 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "꽃·열매·씨의 역할 · 100~101",
   "title": "꽃 구조와 역할",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w100",
      "c22-s61-u03-w101"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수술의 꽃가루가 암술머리에 닿는 꽃가루받이와 씨가 퍼지는 단계를 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "열매/씨의 실제 구조와 가능한 보호/퍼짐 역할을 연결해요. 이름이나 사는 곳만으로 방법을 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "꽃·열매·씨의 역할 · 102~104",
   "title": "벌이 앉은 사진",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w102",
      "c22-s61-u03-w103",
      "c22-s61-u03-w104"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수술의 꽃가루가 암술머리에 닿는 꽃가루받이와 씨가 퍼지는 단계를 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "열매/씨의 실제 구조와 가능한 보호/퍼짐 역할을 연결해요. 이름이나 사는 곳만으로 방법을 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "꽃·열매·씨의 역할 · 105~106",
   "title": "퍼짐의 단서",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w105",
      "c22-s61-u03-w106"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수술의 꽃가루가 암술머리에 닿는 꽃가루받이와 씨가 퍼지는 단계를 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "열매/씨의 실제 구조와 가능한 보호/퍼짐 역할을 연결해요. 이름이나 사는 곳만으로 방법을 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "꽃·열매·씨의 역할 · 107",
   "title": "실제 퍼짐과 모형",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w107"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수술의 꽃가루가 암술머리에 닿는 꽃가루받이와 씨가 퍼지는 단계를 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "열매/씨의 실제 구조와 가능한 보호/퍼짐 역할을 연결해요. 이름이나 사는 곳만으로 방법을 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "꽃·열매·씨의 역할 · 108~109",
   "title": "식물 이름으로 단정",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w108",
      "c22-s61-u03-w109"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수술의 꽃가루가 암술머리에 닿는 꽃가루받이와 씨가 퍼지는 단계를 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "열매/씨의 실제 구조와 가능한 보호/퍼짐 역할을 연결해요. 이름이나 사는 곳만으로 방법을 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "꽃·열매·씨의 역할 · 110~111",
   "title": "관찰 기록의 시간 순서",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w110",
      "c22-s61-u03-w111"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수술의 꽃가루가 암술머리에 닿는 꽃가루받이와 씨가 퍼지는 단계를 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "열매/씨의 실제 구조와 가능한 보호/퍼짐 역할을 연결해요. 이름이나 사는 곳만으로 방법을 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "꽃·열매·씨의 역할 · 112",
   "title": "열매와 씨의 구조 그리기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w112"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수술의 꽃가루가 암술머리에 닿는 꽃가루받이와 씨가 퍼지는 단계를 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "열매/씨의 실제 구조와 가능한 보호/퍼짐 역할을 연결해요. 이름이나 사는 곳만으로 방법을 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "실제 활동 ⑦ · 특징 조사",
   "title": "관심 식물의 구조와 역할을 찾아요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "관심 식물 한 가지와 설명할 구조 하나를 골라요.",
      "안전한 대상의 실제 구조를 관찰하거나 교사가 고른 출처 있는 자료를 읽어요.",
      "직접 본 정보와 조사한 정보를 구별해 역할과 연결해요."
     ]
    },
    {
     "type": "table",
     "heads": [
      "대상 식물/구조",
      "내가 확인한 내용"
     ],
     "rows": [
      [
       "전체와 부분 이름",
       ""
      ],
      [
       "구조의 생김새",
       ""
      ],
      [
       "관련된 역할과 근거",
       ""
      ],
      [
       "관찰 날짜 또는 자료 출처",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "더 확인할 질문",
     "hint": "관찰이나 조사에서 아직 분명하지 않은 점을 적어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수술의 꽃가루가 암술머리에 닿는 꽃가루받이와 씨가 퍼지는 단계를 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "열매/씨의 실제 구조와 가능한 보호/퍼짐 역할을 연결해요. 이름이나 사는 곳만으로 방법을 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-feature",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "식물 특징을 설명하고 나누기",
   "title": "개념과 핵심 낱말",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "뜻과 확인할 점"
     ],
     "rows": [
      [
       "특징 설명 자료",
       "대상·구조 이름·기능·근거가 이어지는 한 장 자료"
      ],
      [
       "관찰과 조사",
       "직접 본 정보와 출처 있는 자료에서 읽은 정보를 구별하는 일"
      ],
      [
       "설명과 보완",
       "자료를 보여 주고 질문을 들어 더 잘 이해되게 고치는 일"
      ]
     ]
    },
    {
     "type": "diagram",
     "key": "leaf",
     "caption": ""
    },
    {
     "type": "text",
     "text": "관심 식물의 한 구조를 골라 **전체 모습·확대 위치·구조 이름·역할**을 연결해요. 직접 관찰한 정보인지 조사한 정보인지 밝히고, 친구가 근거를 다시 찾을 수 있게 출처를 적어요."
    },
    {
     "type": "field",
     "title": "개념을 내 말로",
     "hint": "내 자료에서 구조·기능·근거를 어떻게 연결할지 써요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "대상 식물·구조 이름·기능·관찰/조사 근거가 이어지는 한 장 자료를 만들고 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "전체 사진에서 확대한 위치를 표시하면 친구가 구조와 기능의 관계를 따라 읽기 쉬워요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "식물 특징을 설명하고 나누기",
   "title": "함께 풀고 근거를 확인해요",
   "blocks": [
    {
     "type": "example",
     "question": "전체 식물 사진과 확대 그림이 따로 떨어져 있어 같은 부분인지 친구가 헷갈려 해요. 어떻게 고칠까요?",
     "steps": [
      [
       "전체와 부분 연결",
       "전체 사진에서 확대한 위치를 표시해요."
      ],
      [
       "이름과 역할 연결",
       "확대 그림에 구조 이름과 기능 문장을 붙여요."
      ],
      [
       "근거 연결",
       "직접 관찰/조사한 내용과 출처를 함께 넣어요."
      ]
     ],
     "answer": "꾸미기보다 구조·기능·근거의 연결을 읽기 쉽게 고쳐요."
    },
    {
     "type": "field",
     "title": "한 장 자료의 중심 문장",
     "hint": "관심 식물·구조·관련된 역할과 근거가 이어지도록 써요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "대상 식물·구조 이름·기능·관찰/조사 근거가 이어지는 한 장 자료를 만들고 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "전체 사진에서 확대한 위치를 표시하면 친구가 구조와 기능의 관계를 따라 읽기 쉬워요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "식물 특징을 설명하고 나누기 · 113~115",
   "title": "설명 자료의 초점",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w113",
      "c22-s61-u03-w114",
      "c22-s61-u03-w115"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "대상 식물·구조 이름·기능·관찰/조사 근거가 이어지는 한 장 자료를 만들고 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "전체 사진에서 확대한 위치를 표시하면 친구가 구조와 기능의 관계를 따라 읽기 쉬워요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "식물 특징을 설명하고 나누기 · 116~117",
   "title": "한 장 자료에 담기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w116",
      "c22-s61-u03-w117"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "대상 식물·구조 이름·기능·관찰/조사 근거가 이어지는 한 장 자료를 만들고 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "전체 사진에서 확대한 위치를 표시하면 친구가 구조와 기능의 관계를 따라 읽기 쉬워요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "식물 특징을 설명하고 나누기 · 118~120",
   "title": "생김새에서 기능으로",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w118",
      "c22-s61-u03-w119",
      "c22-s61-u03-w120"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "대상 식물·구조 이름·기능·관찰/조사 근거가 이어지는 한 장 자료를 만들고 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "전체 사진에서 확대한 위치를 표시하면 친구가 구조와 기능의 관계를 따라 읽기 쉬워요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "식물 특징을 설명하고 나누기 · 121~122",
   "title": "고칠 표현",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w121",
      "c22-s61-u03-w122"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "대상 식물·구조 이름·기능·관찰/조사 근거가 이어지는 한 장 자료를 만들고 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "전체 사진에서 확대한 위치를 표시하면 친구가 구조와 기능의 관계를 따라 읽기 쉬워요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "식물 특징을 설명하고 나누기 · 123",
   "title": "받은 질문으로 고치기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w123"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "대상 식물·구조 이름·기능·관찰/조사 근거가 이어지는 한 장 자료를 만들고 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "전체 사진에서 확대한 위치를 표시하면 친구가 구조와 기능의 관계를 따라 읽기 쉬워요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "식물 특징을 설명하고 나누기 · 124~125",
   "title": "전체 사진과 부분 확대",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w124",
      "c22-s61-u03-w125"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "대상 식물·구조 이름·기능·관찰/조사 근거가 이어지는 한 장 자료를 만들고 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "전체 사진에서 확대한 위치를 표시하면 친구가 구조와 기능의 관계를 따라 읽기 쉬워요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "식물 특징을 설명하고 나누기 · 126~127",
   "title": "만들어 나누기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w126",
      "c22-s61-u03-w127"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "대상 식물·구조 이름·기능·관찰/조사 근거가 이어지는 한 장 자료를 만들고 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "전체 사진에서 확대한 위치를 표시하면 친구가 구조와 기능의 관계를 따라 읽기 쉬워요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "식물 특징을 설명하고 나누기 · 128",
   "title": "나의 식물 설명 한 장",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u03-w128"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "대상 식물·구조 이름·기능·관찰/조사 근거가 이어지는 한 장 자료를 만들고 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "전체 사진에서 확대한 위치를 표시하면 친구가 구조와 기능의 관계를 따라 읽기 쉬워요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "실제 활동 ⑧ · 자료 만들기",
   "title": "구조·기능·근거가 이어지는 한 장",
   "blocks": [
    {
     "type": "list",
     "items": [
      "전체에서 확대 위치를 표시하고 구조 이름표를 넣어요.",
      "어떤 생김새가 어떤 역할과 관련되는지 근거 문장으로 연결해요.",
      "직접 관찰/조사한 정보와 출처를 넣어 한 장 자료를 실제로 만들어요."
     ]
    },
    {
     "type": "field",
     "title": "내 자료의 큰 그림과 배치",
     "hint": "대상·전체/확대 위치·구조 이름·역할·근거·출처의 자리를 정해요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "대상 식물·구조 이름·기능·관찰/조사 근거가 이어지는 한 장 자료를 만들고 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "한 장 안에서 친구가 설명의 근거를 따라 읽을 수 있는지 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-design",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "실제 활동 ⑨ · 설명과 보완",
   "title": "친구의 질문으로 설명을 다듬어요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "자료를 교실에서 실제로 보여 주며 구조·기능·근거를 설명해요.",
      "친구가 어느 부분을 이해했고 무엇을 헷갈렸는지 들어요.",
      "그림 연결이나 빠진 근거 문장을 보완하고 다시 설명해요."
     ]
    },
    {
     "type": "field",
     "title": "보여 준 자료와 설명한 내용",
     "hint": "실제로 한 활동과 아직 남은 활동을 구별해요.",
     "lines": 4,
     "draw": false
    },
    {
     "type": "field",
     "title": "받은 질문과 확인한 근거",
     "hint": "질문을 아직 받지 못했다면 그 상태와 다음 질문을 남겨요.",
     "lines": 5,
     "draw": false
    },
    {
     "type": "field",
     "title": "고친 설명과 다시 보여 주기",
     "hint": "바꾼 부분·그 까닭과 실제로 다시 설명한 내용을 남겨요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "대상 식물·구조 이름·기능·관찰/조사 근거가 이어지는 한 장 자료를 만들고 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "전체 사진에서 확대한 위치를 표시하면 친구가 구조와 기능의 관계를 따라 읽기 쉬워요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "activity-share",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "단원 정리",
   "title": "작은 세포에서 기관의 관계까지",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "설명할 것",
      "내가 읽을 근거"
     ],
     "rows": [
      [
       "세포와 구조 이름",
       "실제 표본·배율·보인 모양"
      ],
      [
       "뿌리/줄기",
       "같은 조건의 물 감소·단면 색 자취"
      ],
      [
       "광합성",
       "처리 전 상태·빛/어둠·실제 검출"
      ],
      [
       "증산",
       "처음 마른 봉지·잎 유무·물방울/감소"
      ],
      [
       "기관의 관계",
       "물의 이동과 양분 생성/이용"
      ],
      [
       "특징 자료",
       "구조·기능·근거·출처·실제 설명"
      ]
     ]
    },
    {
     "type": "field",
     "title": "내 생각이 달라진 근거",
     "hint": "처음 생각과 실제 관찰이나 읽은 자료를 연결하여 써요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 관찰이나 사진으로 모든 기관의 기능을 확인했다고 하지 않아요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "문항 답과 현미경 관찰·기능 실험·자료 제작/설명은 각각 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "단원 수행평가 A · 6과11-01",
   "title": "실제 표본의 세포 관찰",
   "blocks": [
    {
     "type": "text",
     "text": "교사가 준비한 식물 표본을 현미경으로 관찰해요. 실제로 보인 모양을 그리고 구별한 구조에 이름을 붙여요."
    },
    {
     "type": "field",
     "title": "A-1 관찰 그림",
     "hint": "표본 이름·배율·보인 세포 모양·확인한 구조 이름을 표시해요.",
     "lines": 3,
     "draw": true
    },
    {
     "type": "field",
     "title": "A-2 다시 관찰할 점",
     "hint": "불분명한 부분과 다시 확인할 관찰 조건을 짧게 써요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "교사는 실제 현미경 조작과 표본 관찰 과정도 함께 봐요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "이름을 맞힌 것만으로 실제 관찰을 마쳤다고 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "assessment-drawing",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "단원 수행평가 B · 6과11-02",
   "title": "기관 기능 실험의 근거",
   "blocks": [
    {
     "type": "text",
     "text": "수업에서 실제로 한 기관 기능 비교 실험 하나를 골라요. 달리한 조건·같게 한 조건·직접 관찰한 결과로 이번 결론을 설명해요."
    },
    {
     "type": "table",
     "heads": [
      "비교한 장치/조건",
      "직접 본 결과·단위/시각"
     ],
     "rows": [
      [
       "",
       ""
      ],
      [
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "B-1 비교 조건",
     "hint": "무엇을 달리하고 무엇을 같게 했는지 써요.",
     "lines": 5,
     "draw": false
    },
    {
     "type": "field",
     "title": "B-2 근거와 결론",
     "hint": "실제 관찰로 말할 수 있는 것과 더 확인할 것을 나누어 써요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "과학적 결론은 장치·조건·실제 관찰과 맞아야 해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "아직 실험하지 못했다면 수행으로 추정하지 않고 다음에 실제로 이어 가요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "assessment",
   "lead": "",
   "layout": "plant-structure-workbook"
  },
  {
   "section": "단원 수행평가 C · 6과11-03",
   "title": "한 장 자료를 만들고 설명하기",
   "blocks": [
    {
     "type": "text",
     "text": "관심 식물의 구조·기능을 설명하는 한 장 자료를 실제로 만들고 친구에게 보여 주며 설명해요."
    },
    {
     "type": "table",
     "heads": [
      "검토할 부분",
      "내가 자료에서 보여 줄 근거"
     ],
     "rows": [
      [
       "대상 식물과 구조 이름",
       ""
      ],
      [
       "전체와 확대한 부분의 연결",
       ""
      ],
      [
       "생김새·기능과 관찰/조사 근거",
       ""
      ],
      [
       "출처와 실제 설명",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "C-1 친구의 질문으로 보완",
     "hint": "고친 그림/문장과 그 까닭을 써요.",
     "lines": 5,
     "draw": false
    },
    {
     "type": "field",
     "title": "C-2 다음 설명",
     "hint": "다시 보여 준 내용 또는 이어서 할 일을 구별해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "교사는 자료의 실제 완성과 설명·질문 응답을 함께 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "그림 솜씨보다 구조·기능·근거의 연결을 봐요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ],
   "kind": "assessment",
   "lead": "",
   "layout": "plant-structure-workbook"
  }
 ],
 "teacherPages": [
  {
   "section": "정답·해설 1~3",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w001",
      "c22-s61-u03-w002",
      "c22-s61-u03-w003"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 4~6",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w004",
      "c22-s61-u03-w005",
      "c22-s61-u03-w006"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 7~9",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w007",
      "c22-s61-u03-w008",
      "c22-s61-u03-w009"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 10~12",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w010",
      "c22-s61-u03-w011",
      "c22-s61-u03-w012"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 13~14",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w013",
      "c22-s61-u03-w014"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 15~16",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w015",
      "c22-s61-u03-w016"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 17~19",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w017",
      "c22-s61-u03-w018",
      "c22-s61-u03-w019"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 20~22",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w020",
      "c22-s61-u03-w021",
      "c22-s61-u03-w022"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 23~25",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w023",
      "c22-s61-u03-w024",
      "c22-s61-u03-w025"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 26~28",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w026",
      "c22-s61-u03-w027",
      "c22-s61-u03-w028"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 29~30",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w029",
      "c22-s61-u03-w030"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 31~32",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w031",
      "c22-s61-u03-w032"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 33~35",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w033",
      "c22-s61-u03-w034",
      "c22-s61-u03-w035"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 36~37",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w036",
      "c22-s61-u03-w037"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 38~39",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w038",
      "c22-s61-u03-w039"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 40~42",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w040",
      "c22-s61-u03-w041",
      "c22-s61-u03-w042"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 43~44",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w043",
      "c22-s61-u03-w044"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 45~46",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w045",
      "c22-s61-u03-w046"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 47~48",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w047",
      "c22-s61-u03-w048"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 49~51",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w049",
      "c22-s61-u03-w050",
      "c22-s61-u03-w051"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 52~54",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w052",
      "c22-s61-u03-w053",
      "c22-s61-u03-w054"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 55~57",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w055",
      "c22-s61-u03-w056",
      "c22-s61-u03-w057"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 58~60",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w058",
      "c22-s61-u03-w059",
      "c22-s61-u03-w060"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 61~62",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w061",
      "c22-s61-u03-w062"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 63~65",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w063",
      "c22-s61-u03-w064",
      "c22-s61-u03-w065"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 66~68",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w066",
      "c22-s61-u03-w067",
      "c22-s61-u03-w068"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 69~70",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w069",
      "c22-s61-u03-w070"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 71~73",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w071",
      "c22-s61-u03-w072",
      "c22-s61-u03-w073"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 74~76",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w074",
      "c22-s61-u03-w075",
      "c22-s61-u03-w076"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 77~79",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w077",
      "c22-s61-u03-w078",
      "c22-s61-u03-w079"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 80~82",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w080",
      "c22-s61-u03-w081",
      "c22-s61-u03-w082"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 83~85",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w083",
      "c22-s61-u03-w084",
      "c22-s61-u03-w085"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 86~88",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w086",
      "c22-s61-u03-w087",
      "c22-s61-u03-w088"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 89~90",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w089",
      "c22-s61-u03-w090"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 91~92",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w091",
      "c22-s61-u03-w092"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 93~94",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w093",
      "c22-s61-u03-w094"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 95~97",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w095",
      "c22-s61-u03-w096",
      "c22-s61-u03-w097"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 98~100",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w098",
      "c22-s61-u03-w099",
      "c22-s61-u03-w100"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 101~103",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w101",
      "c22-s61-u03-w102",
      "c22-s61-u03-w103"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 104~106",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w104",
      "c22-s61-u03-w105",
      "c22-s61-u03-w106"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 107~109",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w107",
      "c22-s61-u03-w108",
      "c22-s61-u03-w109"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 110~111",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w110",
      "c22-s61-u03-w111"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 112~113",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w112",
      "c22-s61-u03-w113"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 114~116",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w114",
      "c22-s61-u03-w115",
      "c22-s61-u03-w116"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 117~118",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w117",
      "c22-s61-u03-w118"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 119~121",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w119",
      "c22-s61-u03-w120",
      "c22-s61-u03-w121"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 122~123",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w122",
      "c22-s61-u03-w123"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 124~125",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w124",
      "c22-s61-u03-w125"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 126~127",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w126",
      "c22-s61-u03-w127"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 128~128",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u03-w128"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 뜻의 표현과 타당한 다른 설명은 조건과 근거로 인정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 예시가 유일한 표현이나 실제 수행 완료를 뜻하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "수행평가 지도 · 6과11-01",
   "title": "세포 실제 관찰 확인",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "text",
     "text": "표본 이름·배율·실제 보인 모양과 구별한 구조 이름을 확인한다. 교사는 현미경 조작·실제 관찰 과정도 본다. 흐림/미관찰을 빈 그림이나 예상으로 채우게 하지 않는다."
    },
    {
     "type": "field",
     "title": "교사 관찰과 다음 지도",
     "hint": "학생의 실제 수행 근거와 아직 확인하지 못한 부분을 남겨요.",
     "lines": 10,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "문항 점수와 실제 수행 확인을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "학교 공식 성적을 자동 확정하는 채점표가 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "수행평가 지도 · 6과11-02",
   "title": "기관 기능 실험 확인",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "text",
     "text": "달리한 조건·같게 한 조건·실제 관찰과 결론의 연결을 본다. 뿌리 물 감소의 직접 증발/절단 영향, 줄기 자른 방향, 처리 전 녹말과 빛/어둠, 봉지 처음 물기를 확인한다. 실제 결과가 예상과 다른 답도 근거로 검토한다."
    },
    {
     "type": "field",
     "title": "교사 관찰과 다음 지도",
     "hint": "학생의 실제 수행 근거와 아직 확인하지 못한 부분을 남겨요.",
     "lines": 10,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "문항 점수와 실제 수행 확인을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "학교 공식 성적을 자동 확정하는 채점표가 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "수행평가 지도 · 6과11-03",
   "title": "특징 자료 제작과 설명 확인",
   "kind": "answers",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "text",
     "text": "실제 완성한 자료의 대상·구조 이름·기능·관찰/조사 근거·출처를 본다. 전체와 확대 위치, 실제 설명과 받은 질문/미수신·보완을 확인한다. 입력한 문장만으로 제작/공유 완료를 추정하지 않는다."
    },
    {
     "type": "field",
     "title": "교사 관찰과 다음 지도",
     "hint": "학생의 실제 수행 근거와 아직 확인하지 못한 부분을 남겨요.",
     "lines": 10,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "문항 점수와 실제 수행 확인을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "학교 공식 성적을 자동 확정하는 채점표가 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  }
 ],
 "quickPages": [
  {
   "section": "빠른 정답표",
   "title": "1~28번",
   "kind": "quick",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "diagram",
     "key": "plant-quick-0",
     "caption": ""
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "번호와 응답 형식을 함께 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 인정 기준과 근거는 정답·해설 쪽에서 읽어요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "빠른 정답표",
   "title": "29~56번",
   "kind": "quick",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "diagram",
     "key": "plant-quick-28",
     "caption": ""
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "번호와 응답 형식을 함께 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 인정 기준과 근거는 정답·해설 쪽에서 읽어요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "빠른 정답표",
   "title": "57~84번",
   "kind": "quick",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "diagram",
     "key": "plant-quick-56",
     "caption": ""
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "번호와 응답 형식을 함께 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 인정 기준과 근거는 정답·해설 쪽에서 읽어요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "빠른 정답표",
   "title": "85~112번",
   "kind": "quick",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "diagram",
     "key": "plant-quick-84",
     "caption": ""
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "번호와 응답 형식을 함께 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 인정 기준과 근거는 정답·해설 쪽에서 읽어요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  },
  {
   "section": "빠른 정답표",
   "title": "113~128번",
   "kind": "quick",
   "layout": "plant-structure-workbook",
   "blocks": [
    {
     "type": "diagram",
     "key": "plant-quick-112",
     "caption": ""
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "번호와 응답 형식을 함께 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "서술·그림의 인정 기준과 근거는 정답·해설 쪽에서 읽어요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 확인한 근거와 더 알아볼 질문을 남겨요.",
     "write": 5
    }
   ]
  }
 ],
 "figures": {
  "observe": "<figure class=\"ps-figure ps-photo\"><img src=\"../assets/book/s31-u03-photo-observe.webp\" alt=\"두 잎과 돋보기의 설명 장면\" decoding=\"async\"><figcaption>잎의 겉모습을 살펴보는 도구예요. 세포 관찰에는 현미경과 표본이 필요해요.</figcaption></figure>",
  "plant": "<figure class=\"ps-figure ps-photo\"><img src=\"../assets/book/s31-u04-photo-seedling.webp\" alt=\"화분에서 줄기와 잎이 자란 어린 식물\" decoding=\"async\"><figcaption>뿌리·줄기·잎의 관계를 떠올리는 장면이에요. 흙 아래 뿌리와 물의 이동은 더 관찰해야 해요.</figcaption></figure>",
  "leaf": "<figure class=\"ps-figure ps-photo\"><img src=\"../assets/book/s31-u03-photo-lotus.webp\" alt=\"넓게 펼쳐진 연잎의 설명 장면\" decoding=\"async\"><figcaption>잎의 생김새를 생각해요. 이 장면으로 녹말 검출이나 증산 실험을 했다고 정하지 않아요.</figcaption></figure>",
  "cells": "<figure class=\"ps-figure ps-source\"><img src=\"../assets/bank/c22-s61-u03/s4-q02.webp\" alt=\"작은 경계가 이어진 식물 세포 관찰 자료 그림\" decoding=\"async\"><figcaption>관련 자료의 식물 세포 그림이에요. 실제 표본에서 보인 모습과는 구별해요.</figcaption></figure>",
  "stem": "<figure class=\"ps-figure ps-source\"><img src=\"../assets/bank/c22-s61-u03/s3-q09.webp\" alt=\"백합의 색소 물 장치와 세로 단면 비교 자료\" decoding=\"async\"><figcaption>관련 자료의 장치와 단면이에요. 실제 수업에서 보인 색 위치·시간을 따로 확인해요.</figcaption></figure>",
  "transpiration": "<figure class=\"ps-figure ps-source\"><img src=\"../assets/bank/c22-s61-u03/s4-q16.webp\" alt=\"잎 유무를 달리하고 봉지를 씌운 두 식물 장치\" decoding=\"async\"><figcaption>그림의 잎 유무·입구·봉지를 살펴보고 실제 준비에서는 처음 물기와 같은 조건도 확인해요.</figcaption></figure>",
  "flower": "<figure class=\"ps-figure ps-source\"><img src=\"../assets/bank/c22-s61-u03/s1-q07.webp\" alt=\"사과꽃의 구조와 기호를 나타낸 자료\" decoding=\"async\"><figcaption>꽃 구조를 비교하는 자료예요. 꽃 방문·꽃가루받이·씨 형성을 같은 단계로 보지 않아요.</figcaption></figure>",
  "plant-question-data-19": "<table class=\"ed-table plant-book-table\"><caption>제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요.</caption><thead><tr><th scope=\"col\">장치</th><th scope=\"col\">뿌리</th><th scope=\"col\">처음 물(mL)</th><th scope=\"col\">나중 물(mL)</th></tr></thead><tbody><tr><th scope=\"row\">가</th><td>있음</td><td>40</td><td>29</td></tr><tr><th scope=\"row\">나</th><td>제거</td><td>40</td><td>36</td></tr></tbody></table>",
  "plant-question-data-25": "<table class=\"ed-table plant-book-table\"><caption>제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요.</caption><thead><tr><th scope=\"col\">장치</th><th scope=\"col\">처음(mL)</th><th scope=\"col\">나중(mL)</th></tr></thead><tbody><tr><th scope=\"row\">가</th><td>50</td><td>41</td></tr><tr><th scope=\"row\">나</th><td>60</td><td>54</td></tr></tbody></table>",
  "plant-question-data-41": "<table class=\"ed-table plant-book-table\"><caption>제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요.</caption><thead><tr><th scope=\"col\">표본</th><th scope=\"col\">교사 준비 단면 관찰</th></tr></thead><tbody><tr><th scope=\"row\">가</th><td>내부에 붉은 자취가 보임</td></tr><tr><th scope=\"row\">나</th><td>구별하기 어려움</td></tr></tbody></table>",
  "plant-question-data-55": "<table class=\"ed-table plant-book-table\"><caption>제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요.</caption><thead><tr><th scope=\"col\">시료</th><th scope=\"col\">녹말 검출</th></tr></thead><tbody><tr><th scope=\"row\">처리 전 비교</th><td>미검출</td></tr><tr><th scope=\"row\">빛 처리 뒤</th><td>청람색</td></tr><tr><th scope=\"row\">어둠 처리 뒤</th><td>미검출</td></tr></tbody></table>",
  "plant-question-data-67": "<table class=\"ed-table plant-book-table\"><caption>제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요.</caption><thead><tr><th scope=\"col\">장치</th><th scope=\"col\">잎</th><th scope=\"col\">처음(mL)</th><th scope=\"col\">뒤(mL)</th></tr></thead><tbody><tr><th scope=\"row\">가</th><td>없음</td><td>55</td><td>52</td></tr><tr><th scope=\"row\">나</th><td>있음</td><td>55</td><td>34</td></tr></tbody></table>",
  "plant-question-data-105": "<table class=\"ed-table plant-book-table\"><caption>제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요.</caption><thead><tr><th scope=\"col\">기호</th><th scope=\"col\">관찰 특징</th></tr></thead><tbody><tr><th scope=\"row\">가</th><td>갈고리처럼 휘어진 부분</td></tr><tr><th scope=\"row\">나</th><td>얇고 넓은 날개 같은 부분</td></tr></tbody></table>",
  "plant-quick-0": "<div class=\"ps-quick-grid\"><table class=\"ed-table plant-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">1</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">2</th><td>빈칸</td><td>세포</td></tr><tr><th scope=\"row\">3</th><td>단답</td><td>현미경</td></tr><tr><th scope=\"row\">4</th><td>복수</td><td>②, ⑤</td></tr><tr><th scope=\"row\">5</th><td>연결</td><td>(1) ㄷ (2) ㄴ (3) ㄱ</td></tr><tr><th scope=\"row\">6</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">7</th><td>객관식</td><td>①</td></tr><tr><th scope=\"row\">8</th><td>빈칸</td><td>막</td></tr><tr><th scope=\"row\">9</th><td>단답</td><td>나</td></tr><tr><th scope=\"row\">10</th><td>복수</td><td>②, ④</td></tr><tr><th scope=\"row\">11</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">12</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">13</th><td>객관식</td><td>⑤</td></tr><tr><th scope=\"row\">14</th><td>순서</td><td>ㄴ → ㄷ → ㄱ → ㄹ</td></tr></tbody></table><table class=\"ed-table plant-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">15</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">16</th><td>그림</td><td>교사 확인</td></tr><tr><th scope=\"row\">17</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">18</th><td>빈칸</td><td>뿌리</td></tr><tr><th scope=\"row\">19</th><td>단답</td><td>가</td></tr><tr><th scope=\"row\">20</th><td>복수</td><td>①, ③, ⑤</td></tr><tr><th scope=\"row\">21</th><td>연결</td><td>(1) ㄴ (2) ㄷ (3) ㄱ</td></tr><tr><th scope=\"row\">22</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">23</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">24</th><td>빈칸</td><td>줄기</td></tr><tr><th scope=\"row\">25</th><td>단답</td><td>가</td></tr><tr><th scope=\"row\">26</th><td>복수</td><td>③, ⑤</td></tr><tr><th scope=\"row\">27</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">28</th><td>서술</td><td>교사 확인</td></tr></tbody></table></div>",
  "plant-quick-28": "<div class=\"ps-quick-grid\"><table class=\"ed-table plant-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">29</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">30</th><td>순서</td><td>ㄷ → ㄱ → ㄹ → ㄴ</td></tr><tr><th scope=\"row\">31</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">32</th><td>그림</td><td>교사 확인</td></tr><tr><th scope=\"row\">33</th><td>객관식</td><td>⑤</td></tr><tr><th scope=\"row\">34</th><td>빈칸</td><td>줄기</td></tr><tr><th scope=\"row\">35</th><td>단답</td><td>물</td></tr><tr><th scope=\"row\">36</th><td>복수</td><td>①, ②, ④</td></tr><tr><th scope=\"row\">37</th><td>연결</td><td>(1) ㄴ (2) ㄷ (3) ㄱ</td></tr><tr><th scope=\"row\">38</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">39</th><td>객관식</td><td>①</td></tr><tr><th scope=\"row\">40</th><td>빈칸</td><td>지지</td></tr><tr><th scope=\"row\">41</th><td>단답</td><td>가</td></tr><tr><th scope=\"row\">42</th><td>복수</td><td>①, ④</td></tr></tbody></table><table class=\"ed-table plant-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">43</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">44</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">45</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">46</th><td>순서</td><td>ㄱ → ㄹ → ㄴ → ㄷ</td></tr><tr><th scope=\"row\">47</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">48</th><td>그림</td><td>교사 확인</td></tr><tr><th scope=\"row\">49</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">50</th><td>빈칸</td><td>광합성</td></tr><tr><th scope=\"row\">51</th><td>단답</td><td>청람색</td></tr><tr><th scope=\"row\">52</th><td>복수</td><td>②, ③, ⑤</td></tr><tr><th scope=\"row\">53</th><td>연결</td><td>(1) ㄴ (2) ㄱ (3) ㄷ</td></tr><tr><th scope=\"row\">54</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">55</th><td>객관식</td><td>①</td></tr><tr><th scope=\"row\">56</th><td>빈칸</td><td>이산화 탄소</td></tr></tbody></table></div>",
  "plant-quick-56": "<div class=\"ps-quick-grid\"><table class=\"ed-table plant-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">57</th><td>단답</td><td>빛의 유무</td></tr><tr><th scope=\"row\">58</th><td>복수</td><td>②, ⑤</td></tr><tr><th scope=\"row\">59</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">60</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">61</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">62</th><td>순서</td><td>ㄴ → ㄱ → ㄹ → ㄷ</td></tr><tr><th scope=\"row\">63</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">64</th><td>그림</td><td>교사 확인</td></tr><tr><th scope=\"row\">65</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">66</th><td>빈칸</td><td>기공</td></tr><tr><th scope=\"row\">67</th><td>단답</td><td>나</td></tr><tr><th scope=\"row\">68</th><td>복수</td><td>①, ③, ④</td></tr><tr><th scope=\"row\">69</th><td>연결</td><td>(1) ㄷ (2) ㄱ (3) ㄴ</td></tr><tr><th scope=\"row\">70</th><td>서술</td><td>교사 확인</td></tr></tbody></table><table class=\"ed-table plant-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">71</th><td>객관식</td><td>⑤</td></tr><tr><th scope=\"row\">72</th><td>빈칸</td><td>수증기</td></tr><tr><th scope=\"row\">73</th><td>단답</td><td>6mL</td></tr><tr><th scope=\"row\">74</th><td>복수</td><td>①, ③</td></tr><tr><th scope=\"row\">75</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">76</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">77</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">78</th><td>순서</td><td>ㄹ → ㄱ → ㄷ → ㄴ</td></tr><tr><th scope=\"row\">79</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">80</th><td>그림</td><td>교사 확인</td></tr><tr><th scope=\"row\">81</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">82</th><td>빈칸</td><td>이동</td></tr><tr><th scope=\"row\">83</th><td>단답</td><td>줄기</td></tr><tr><th scope=\"row\">84</th><td>복수</td><td>②, ④, ⑤</td></tr></tbody></table></div>",
  "plant-quick-84": "<div class=\"ps-quick-grid\"><table class=\"ed-table plant-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">85</th><td>연결</td><td>(1) ㄴ (2) ㄷ (3) ㄱ</td></tr><tr><th scope=\"row\">86</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">87</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">88</th><td>빈칸</td><td>기능</td></tr><tr><th scope=\"row\">89</th><td>단답</td><td>녹말 검출 자료</td></tr><tr><th scope=\"row\">90</th><td>복수</td><td>②, ④</td></tr><tr><th scope=\"row\">91</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">92</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">93</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">94</th><td>순서</td><td>ㄴ → ㄷ → ㄱ</td></tr><tr><th scope=\"row\">95</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">96</th><td>그림</td><td>교사 확인</td></tr><tr><th scope=\"row\">97</th><td>객관식</td><td>①</td></tr><tr><th scope=\"row\">98</th><td>빈칸</td><td>수술</td></tr></tbody></table><table class=\"ed-table plant-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">99</th><td>단답</td><td>암술머리</td></tr><tr><th scope=\"row\">100</th><td>복수</td><td>①, ③</td></tr><tr><th scope=\"row\">101</th><td>연결</td><td>(1) ㄴ (2) ㄱ (3) ㄷ</td></tr><tr><th scope=\"row\">102</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">103</th><td>객관식</td><td>⑤</td></tr><tr><th scope=\"row\">104</th><td>빈칸</td><td>씨</td></tr><tr><th scope=\"row\">105</th><td>단답</td><td>가</td></tr><tr><th scope=\"row\">106</th><td>복수</td><td>③, ⑤</td></tr><tr><th scope=\"row\">107</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">108</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">109</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">110</th><td>순서</td><td>ㄷ → ㄱ → ㄴ</td></tr><tr><th scope=\"row\">111</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">112</th><td>그림</td><td>교사 확인</td></tr></tbody></table></div>",
  "plant-quick-112": "<div class=\"ps-quick-grid\"><table class=\"ed-table plant-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">113</th><td>객관식</td><td>①</td></tr><tr><th scope=\"row\">114</th><td>빈칸</td><td>출처</td></tr><tr><th scope=\"row\">115</th><td>단답</td><td>줄기와 잎의 연결 관찰</td></tr><tr><th scope=\"row\">116</th><td>복수</td><td>①, ②, ④</td></tr><tr><th scope=\"row\">117</th><td>연결</td><td>(1) ㄴ (2) ㄷ (3) ㄱ</td></tr><tr><th scope=\"row\">118</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">119</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">120</th><td>빈칸</td><td>역할</td></tr></tbody></table><table class=\"ed-table plant-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">121</th><td>단답</td><td>자료 조사</td></tr><tr><th scope=\"row\">122</th><td>복수</td><td>①, ④</td></tr><tr><th scope=\"row\">123</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">124</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">125</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">126</th><td>순서</td><td>ㄱ → ㄷ → ㄴ → ㄹ</td></tr><tr><th scope=\"row\">127</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">128</th><td>그림</td><td>교사 확인</td></tr></tbody></table></div>"
 },
 "duplexAnswerStartsOnRecto": true,
 "questionSource": "c22-s61-u03.questions.js",
 "visualBindings": [
  {
   "no": 19,
   "figure": "plant-question-data-19",
   "kind": "provided-practice-table",
   "sameModelAsQuestion": true
  },
  {
   "no": 25,
   "figure": "plant-question-data-25",
   "kind": "provided-practice-table",
   "sameModelAsQuestion": true
  },
  {
   "no": 41,
   "figure": "plant-question-data-41",
   "kind": "provided-practice-table",
   "sameModelAsQuestion": true
  },
  {
   "no": 55,
   "figure": "plant-question-data-55",
   "kind": "provided-practice-table",
   "sameModelAsQuestion": true
  },
  {
   "no": 67,
   "figure": "plant-question-data-67",
   "kind": "provided-practice-table",
   "sameModelAsQuestion": true
  },
  {
   "no": 105,
   "figure": "plant-question-data-105",
   "kind": "provided-practice-table",
   "sameModelAsQuestion": true
  }
 ]
};

export const guidanceParticlePriorWorkbook=withPlantStructureEditorial(baseWorkbook);
export const studentGuidePriorWorkbook=withGuidanceParticles(guidanceParticlePriorWorkbook);
export const plantStructureReadablePriorWorkbook=withStudentGuideLanguage(studentGuidePriorWorkbook);
export const workbook=withPlantStructureReadableWorkbook(plantStructureReadablePriorWorkbook);
