/* 학원별 원본 과정. L번호의 별칭이 아니며 코호트·이정표·기간을 구분한다. */
(function(global){
'use strict';
const data={
 "version": 2,
 "premierCurrent": {
  "effectiveCohort": "2026년 현재 7세부터",
  "updatedOn": "2026-10-29",
  "basis": "원장님 개편 안내 · 기존 2026-10-19 설명회 메모와 대조",
  "stages": [
   {"id":"beginner","label":"초급","books":6,"months":null},
   {"id":"intermediate","label":"중급","books":8,"months":null},
   {"id":"advanced","label":"고급","books":10,"algebraBooks":5,"geometryBooks":5,"months":5,"durationStatus":"estimated_user_plan","graduateAfter":true}
  ],
  "durationNote": "고급은 대수 5권·기하 5권 병행으로 약 5개월 이수 후 졸업하는 설계 기준입니다. 공식 공통 기간이 아닌 원장님 예상 운영 기준이며, 반별 일정은 대조합니다."
 },
 "source": "roadmap/v31/data/source-monthly.json · S2 · original rendered source tables",
 "monthBasis": "5세 1월 = 0; source S2 column 0 = 7세 3월 = 26",
 "courses": [
  {
   "id": "premier",
   "label": "프리미어1",
   "cohort": "P1 표준 이정표",
   "main": {
    "title": "교과 이정표",
    "blocks": [
     {
      "label": "6학년 완료 권장",
      "note": "",
      "start": 47,
      "end": 48,
      "kind": "event",
      "sourceRow": "S2:t0:r10"
     },
     {
      "label": "초2 4월경 중등 시작",
      "note": "집에서 응용 교재 · 졸업 초3 4~5월 예정",
      "start": 51,
      "end": 52,
      "kind": "event",
      "sourceRow": "S2:t0:r10"
     }
    ]
   },
   "parallel": [
    {
     "title": "수학경시",
     "blocks": [
      {
       "label": "경시",
       "note": "",
       "start": 32,
       "end": 33,
       "kind": "event",
       "sourceRow": "S2:t0:r9"
      },
      {
       "label": "경시",
       "note": "",
       "start": 38,
       "end": 39,
       "kind": "event",
       "sourceRow": "S2:t0:r9"
      },
      {
       "label": "경시",
       "note": "",
       "start": 44,
       "end": 45,
       "kind": "event",
       "sourceRow": "S2:t0:r9"
      },
      {
       "label": "경시",
       "note": "",
       "start": 50,
       "end": 51,
       "kind": "event",
       "sourceRow": "S2:t0:r9"
      },
      {
       "label": "경시",
       "note": "",
       "start": 56,
       "end": 57,
       "kind": "event",
       "sourceRow": "S2:t0:r9"
      }
     ]
    }
   ],
   "notes": [
    "초1 12월까지 초등 6학년 과정 완료를 권장하고, 초2 4월경 중등을 시작하는 참고 로드맵입니다.",
    "학원 반 이름만으로 사고력·교과·연산의 현재 이수를 대신 판단하지 않습니다."
   ]
  },
  {
   "id": "fields",
   "label": "필즈 S",
   "cohort": "Class S 선발 후 과정",
   "paceNote": "초반에는 한 권을 약 2개월에 걸쳐 공부하고, 이후에는 진도가 빨라집니다.",
   "main": {
    "title": "학원 과정",
    "blocks": [
     {
      "label": "1과정",
      "note": "",
      "start": 26,
      "end": 37,
      "kind": "period",
      "sourceRow": "S2:t0:r4"
     },
     {
      "label": "2과정",
      "note": "",
      "start": 37,
      "end": 52,
      "kind": "period",
      "sourceRow": "S2:t0:r4"
     },
     {
      "label": "3과정 대수",
      "note": "",
      "start": 52,
      "end": 59,
      "kind": "period",
      "sourceRow": "S2:t0:r4"
     }
    ]
   },
   "parallel": [
    {
     "title": "사고력 병행",
     "blocks": [
      {
       "label": "필즈 입문",
       "note": "",
       "start": 26,
       "end": 30,
       "kind": "period",
       "sourceRow": "S2:t0:r5"
      },
      {
       "label": "필즈 실력 또는 최상위 사고력 1A/1B",
       "note": "",
       "start": 30,
       "end": 35,
       "kind": "period",
       "sourceRow": "S2:t0:r5"
      },
      {
       "label": "필즈 초급 하",
       "note": "특강 포함",
       "start": 35,
       "end": 37,
       "kind": "period",
       "sourceRow": "S2:t0:r5"
      },
      {
       "label": "성대경시 대비",
       "note": "",
       "start": 37,
       "end": 39,
       "kind": "period",
       "sourceRow": "S2:t0:r5"
      },
      {
       "label": "필즈 초급 상",
       "note": "",
       "start": 39,
       "end": 42,
       "kind": "period",
       "sourceRow": "S2:t0:r5"
      },
      {
       "label": "필즈 중급 하",
       "note": "특강 포함 · 성대경시 대비",
       "start": 42,
       "end": 45,
       "kind": "period",
       "sourceRow": "S2:t0:r5"
      },
      {
       "label": "필즈 중급 상",
       "note": "",
       "start": 45,
       "end": 48,
       "kind": "period",
       "sourceRow": "S2:t0:r5"
      },
      {
       "label": "3%1과정",
       "note": "특강 포함",
       "start": 48,
       "end": 50,
       "kind": "period",
       "sourceRow": "S2:t0:r5"
      },
      {
       "label": "2과정",
       "note": "",
       "start": 50,
       "end": 52,
       "kind": "period",
       "sourceRow": "S2:t0:r5"
      },
      {
       "label": "3과정 기하",
       "note": "",
       "start": 52,
       "end": 59,
       "kind": "period",
       "sourceRow": "S2:t0:r5"
      }
     ]
    }
   ],
   "notes": [
    "1과정 → 2과정 → 3과정 대수로 이어집니다. 사고력 교재는 별도 진도로 병행합니다."
   ]
  },
  {
   "id": "fields-e1",
   "label": "필즈 E1",
   "cohort": "7세 E1반 참고 과정",
   "previewTrack": "사고력 병행 교재",
   "paceNote": "입문 상·중·하 3권은 6개월, 실력 하·중·상 3권은 7개월에 걸쳐 공부합니다. 초2에는 중급·대수·경시를 1~2개월 구간으로 이어갑니다.",
   "source": {
    "file": "2026_7세_E1반_사용자첨부.png",
    "caseId": "fields-e1-2026",
    "title": "2026 7세 E1반 운영 로드맵",
    "copyId": "2026_7세_E1반_사용자첨부.png",
    "sha256": "fc546cbcb3a1dfd1c1261e8d4e65687bdd1e281c7424ef63ade3816080a5484d",
    "status": "user_provided_case",
    "verifiedOn": "2026-10-28"
   },
   "main": {
    "title": "학원 본 과정",
    "blocks": [
     {
      "label": "더클래식 1과정",
      "note": "",
      "start": 24,
      "end": 42,
      "kind": "period",
      "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 더클래식1행"
     },
     {
      "label": "더클래식 2과정",
      "note": "",
      "start": 42,
      "end": 59,
      "kind": "period",
      "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 더클래식1행"
     },
     {
      "label": "더클래식 3과정 기하",
      "note": "",
      "start": 59,
      "end": 69,
      "kind": "period",
      "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 더클래식1행"
     },
     {
      "label": "더클래식 4과정 기하",
      "note": "",
      "start": 69,
      "end": 81,
      "kind": "period",
      "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 더클래식1행"
     }
    ]
   },
   "parallel": [
    {
     "title": "사고력 병행 교재",
     "blocks": [
      {
       "label": "필즈 입문 (상·중·하)",
       "note": "",
       "start": 24,
       "end": 30,
       "kind": "period",
       "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 더클래식2행"
      },
      {
       "label": "필즈 실력 (하·중·상)",
       "note": "",
       "start": 30,
       "end": 37,
       "kind": "period",
       "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 더클래식2행"
      },
      {
       "label": "경시",
       "note": "",
       "start": 37,
       "end": 39,
       "kind": "period",
       "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 더클래식2행"
      },
      {
       "label": "필즈 초급 (하)",
       "note": "",
       "start": 39,
       "end": 43,
       "kind": "period",
       "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 더클래식2행"
      },
      {
       "label": "경시",
       "note": "",
       "start": 43,
       "end": 45,
       "kind": "period",
       "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 더클래식2행"
      },
      {
       "label": "필즈 초급 (상)",
       "note": "",
       "start": 45,
       "end": 48,
       "kind": "period",
       "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 더클래식2행"
      },
      {
       "label": "필즈 중급 (하)",
       "note": "",
       "start": 48,
       "end": 49,
       "kind": "period",
       "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 더클래식2행"
      },
      {
       "label": "경시",
       "note": "",
       "start": 49,
       "end": 51,
       "kind": "period",
       "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 더클래식2행"
      },
      {
       "label": "필즈 중급 (하)",
       "note": "",
       "start": 51,
       "end": 53,
       "kind": "period",
       "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 더클래식2행"
      },
      {
       "label": "5 대수",
       "note": "",
       "start": 53,
       "end": 55,
       "kind": "period",
       "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 더클래식2행"
      },
      {
       "label": "경시",
       "note": "",
       "start": 55,
       "end": 57,
       "kind": "period",
       "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 더클래식2행"
      },
      {
       "label": "6 대수",
       "note": "",
       "start": 57,
       "end": 59,
       "kind": "period",
       "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 더클래식2행"
      },
      {
       "label": "더클래식 2과정",
       "note": "",
       "start": 59,
       "end": 60,
       "kind": "period",
       "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 더클래식2행"
      },
      {
       "label": "더클래식 3과정 대수",
       "note": "",
       "start": 60,
       "end": 72,
       "kind": "period",
       "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 더클래식2행"
      },
      {
       "label": "더클래식 4과정 대수",
       "note": "",
       "start": 72,
       "end": 81,
       "kind": "period",
       "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 더클래식2행"
      }
     ]
    },
    {
     "title": "방학특강",
     "blocks": [
      {
       "label": "평면도형 전략",
       "note": "",
       "start": 43,
       "end": 44,
       "kind": "period",
       "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 방학특강행"
      },
      {
       "label": "평면기하의 활용",
       "note": "",
       "start": 48,
       "end": 49,
       "kind": "period",
       "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 방학특강행"
      },
      {
       "label": "3% 1과정",
       "note": "",
       "start": 55,
       "end": 56,
       "kind": "period",
       "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 방학특강행"
      },
      {
       "label": "3% 심화",
       "note": "",
       "start": 60,
       "end": 61,
       "kind": "period",
       "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 방학특강행"
      }
     ]
    },
    {
     "title": "연산",
     "blocks": [
      {
       "label": "더클셈 2권",
       "note": "",
       "start": 24,
       "end": 26,
       "kind": "period",
       "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 연산행"
      },
      {
       "label": "더클셈 3권",
       "note": "",
       "start": 26,
       "end": 28,
       "kind": "period",
       "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 연산행"
      },
      {
       "label": "더클셈 4권",
       "note": "",
       "start": 28,
       "end": 30,
       "kind": "period",
       "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 연산행"
      },
      {
       "label": "더클셈 5권",
       "note": "",
       "start": 30,
       "end": 32,
       "kind": "period",
       "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 연산행"
      },
      {
       "label": "더클셈 6권",
       "note": "",
       "start": 32,
       "end": 34,
       "kind": "period",
       "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 연산행"
      },
      {
       "label": "더클셈 7권",
       "note": "",
       "start": 34,
       "end": 36,
       "kind": "period",
       "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 연산행"
      },
      {
       "label": "더클셈 8권",
       "note": "",
       "start": 36,
       "end": 39,
       "kind": "period",
       "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 연산행"
      },
      {
       "label": "기적의 계산법 응용UP 7권",
       "note": "",
       "start": 39,
       "end": 41,
       "kind": "period",
       "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 연산행"
      },
      {
       "label": "기적의 계산법 응용UP 8권",
       "note": "",
       "start": 41,
       "end": 44,
       "kind": "period",
       "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 연산행"
      },
      {
       "label": "더클셈 9권",
       "note": "",
       "start": 44,
       "end": 47,
       "kind": "period",
       "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 연산행"
      },
      {
       "label": "더클셈 10권",
       "note": "",
       "start": 47,
       "end": 50,
       "kind": "period",
       "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 연산행"
      },
      {
       "label": "더클셈 11권",
       "note": "",
       "start": 50,
       "end": 53,
       "kind": "period",
       "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 연산행"
      },
      {
       "label": "더클셈 12권",
       "note": "",
       "start": 53,
       "end": 56,
       "kind": "period",
       "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 연산행"
      },
      {
       "label": "기적의 중학도형 1권",
       "note": "",
       "start": 56,
       "end": 59,
       "kind": "period",
       "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 연산행"
      },
      {
       "label": "기적의 중학연산 1AB",
       "note": "",
       "start": 59,
       "end": 63,
       "kind": "period",
       "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 연산행"
      },
      {
       "label": "기적의 중학도형 2권",
       "note": "",
       "start": 63,
       "end": 67,
       "kind": "period",
       "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 연산행"
      },
      {
       "label": "기적의 중학연산 2AB",
       "note": "",
       "start": 67,
       "end": 71,
       "kind": "period",
       "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 연산행"
      },
      {
       "label": "기적의 중학도형 3권",
       "note": "",
       "start": 71,
       "end": 75,
       "kind": "period",
       "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 연산행"
      },
      {
       "label": "기적의 중학연산 3AB",
       "note": "",
       "start": 75,
       "end": 81,
       "kind": "period",
       "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 연산행"
      }
     ]
    },
    {
     "title": "수업 횟수·시간",
     "blocks": [
      {
       "label": "주 2회 · 회당 2시간",
       "note": "",
       "start": 24,
       "end": 42,
       "kind": "period",
       "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 시간행"
      },
      {
       "label": "주 2회 · 회당 3시간",
       "note": "",
       "start": 42,
       "end": 81,
       "kind": "period",
       "sourceRow": "E1:2026 7세 E1반 운영 로드맵 · 시간행"
      }
     ]
    }
   ],
   "notes": [
    "필즈 수업은 사고력 과정이며, 교과는 별도로 병행합니다.",
    "교재·경시·대수의 실제 구간에 따라 속도가 바뀝니다. 초반의 권당 2개월을 전 과정에 똑같이 적용하지 않습니다.",
    "수업은 주 2회·회당 2시간으로 시작하며, 초1 7월부터 주 2회·회당 3시간으로 늘어납니다.",
    "연산은 E1반 운영표의 참고 일정입니다. 우리 아이의 연산은 선택한 진도와 별도 계획으로 이어갑니다.",
    "E1 참고 과정과 S반 선발 후 과정은 각각 구분해서 살펴봅니다."
   ]
  },
  {
   "id": "soma",
   "label": "소마 A",
   "cohort": "토2시 A반 참고 과정",
   "previewTrack": "6세 시작 참고 과정",
   "mainPreviewLabel": "소마 A반 과정",
   "parallelPreviewLabel": "6세 시작 예시",
   "paceNote": "RAY B → Premier 라이즈 → Premier 초급으로 이어집니다. 현재 7세부터 초급 6권 → 중급 8권 → 고급 10권 구성입니다. 고급은 약 5개월 병행 후 졸업하는 설계 기준이며, 교과·연산·도형도 함께 살펴봅니다.",
   "source": {
    "file": "40b6d6b0-image.jpg",
    "caseId": "soma-sat2-2026",
    "title": "2026 소마 토2시 로드맵",
    "copyId": "40b6d6b0-image.jpg",
    "sha256": "a8346f9b9ba73239ff831b6e35aff4a33c4bc4e3a4e082c7fd145eaa739396c0",
    "status": "user_provided_case",
    "verifiedOn": "2026-10-28"
   },
   "main": {
    "title": "사고력 과정",
    "blocks": [
     {
      "label": "Premier 라이즈",
      "note": "6세 10월에는 라이즈를 공부하고 있습니다.",
      "start": 21,
      "end": 34,
      "kind": "period",
      "sourceRow": "SOMA-T2:2026 소마 토2시 로드맵 · 사고력 교재행"
     },
     {
      "label": "Premier 초급",
      "note": "7세 11월 시작 · 개편 초급 6권 · 초1 7월을 초급 완료로 보지는 않습니다.",
      "start": 34,
      "end": 43,
      "kind": "period",
      "sourceRow": "SOMA-T2:2026 소마 토2시 로드맵 · 사고력 교재행"
     }
    ]
   },
   "parallel": [
    {
     "title": "6세 시작 참고 과정",
     "note": "별도 반의 6세 시작 예시입니다. 소마 A반 과정과 나란히 살펴보세요.",
     "source": {
      "file": "7d91198f-image.png",
      "caseId": "soma-age6-2026",
      "title": "2026 소마 6세 로드맵",
      "copyId": "7d91198f-image.png",
      "sha256": "f58497efbf41ae7247a047c75b6e34c587e48eb8ad879198e6a1897ad3612ff4",
      "status": "user_provided_case",
      "verifiedOn": "2026-10-28"
     },
     "blocks": [
      {
       "label": "RAY B단계",
       "note": "6세 4~8월",
       "start": 15,
       "end": 20,
       "kind": "period",
       "sourceRow": "SOMA-AGE6:2026 소마 6세 로드맵 · 사고력 진도행"
      },
      {
       "label": "Premier 라이즈 1~8",
       "note": "6세 9월~7세 10월",
       "start": 20,
       "end": 34,
       "kind": "period",
       "sourceRow": "SOMA-AGE6:2026 소마 6세 로드맵 · 사고력 진도행"
      },
      {
       "label": "Premier 초급",
       "note": "7세 11월부터 개편 초급 6권을 시작합니다.",
       "shortLabel": "초급",
       "start": 34,
       "end": 36,
       "kind": "period",
       "sourceRow": "SOMA-AGE6:2026 소마 6세 로드맵 · 사고력 진도행"
      }
     ]
    },
    {
     "title": "교과",
     "blocks": [
      {
       "label": "초등 팩토 LV.1 기본+응용 (A·B·C)",
       "note": "6세 10월에는 초등 팩토를 공부하고 있습니다.",
       "start": 21,
       "end": 29,
       "kind": "period",
       "sourceRow": "SOMA-T2:2026 소마 토2시 로드맵 · 사고력 부교재행"
      },
      {
       "label": "디딤돌 기본 2-1",
       "note": "교과 부교재 시작",
       "start": 29,
       "end": 32,
       "kind": "period",
       "sourceRow": "SOMA-T2:2026 소마 토2시 로드맵 · 사고력 부교재행"
      },
      {
       "label": "디딤돌 기본 2-2",
       "note": "",
       "start": 32,
       "end": 35,
       "kind": "period",
       "sourceRow": "SOMA-T2:2026 소마 토2시 로드맵 · 사고력 부교재행"
      },
      {
       "label": "디딤돌 기본 3-1",
       "note": "",
       "start": 35,
       "end": 38,
       "kind": "period",
       "sourceRow": "SOMA-T2:2026 소마 토2시 로드맵 · 사고력 부교재행"
      },
      {
       "label": "디딤돌 기본 3-2",
       "note": "",
       "start": 38,
       "end": 41,
       "kind": "period",
       "sourceRow": "SOMA-T2:2026 소마 토2시 로드맵 · 사고력 부교재행"
      },
      {
       "label": "디딤돌 기본 4-1",
       "note": "초1 6~7월에 공부하는 과정",
       "start": 41,
       "end": 43,
       "kind": "period",
       "sourceRow": "SOMA-T2:2026 소마 토2시 로드맵 · 사고력 부교재행"
      }
     ]
    },
    {
     "title": "연산",
     "blocks": [
      {
       "label": "소마셈 A4",
       "note": "",
       "start": 21,
       "end": 22,
       "kind": "period",
       "sourceRow": "SOMA-T2:2026 소마 토2시 로드맵 · 연산행"
      },
      {
       "label": "소마셈 A5~A8",
       "note": "두 자리±한 자리 · 빈칸이 있는 두 자리±",
       "start": 22,
       "end": 26,
       "kind": "period",
       "sourceRow": "SOMA-T2:2026 소마 토2시 로드맵 · 연산행"
      },
      {
       "label": "소마셈 B1~B4",
       "note": "두·세 자리 수의 덧뺄셈",
       "start": 26,
       "end": 30,
       "kind": "period",
       "sourceRow": "SOMA-T2:2026 소마 토2시 로드맵 · 연산행"
      },
      {
       "label": "소마셈 B5~B8",
       "note": "곱셈·나눗셈",
       "start": 30,
       "end": 34,
       "kind": "period",
       "sourceRow": "SOMA-T2:2026 소마 토2시 로드맵 · 연산행"
      },
      {
       "label": "소마연산 3학년",
       "note": "교재명이며 아이의 학교 학년과 구분합니다.",
       "start": 34,
       "end": 39,
       "kind": "period",
       "sourceRow": "SOMA-T2:2026 소마 토2시 로드맵 · 연산행"
      },
      {
       "label": "소마연산 4학년",
       "note": "초1 4~7월에 공부하는 교재",
       "start": 39,
       "end": 43,
       "kind": "period",
       "sourceRow": "SOMA-T2:2026 소마 토2시 로드맵 · 연산행"
      }
     ]
    },
    {
     "title": "도형",
     "blocks": [
      {
       "label": "소마도형 A단계",
       "note": "6세 12월 시작",
       "start": 23,
       "end": 28,
       "kind": "period",
       "sourceRow": "SOMA-T2:2026 소마 토2시 로드맵 · 도형행"
      },
      {
       "label": "소마도형 B단계",
       "note": "",
       "start": 34,
       "end": 39,
       "kind": "period",
       "sourceRow": "SOMA-T2:2026 소마 토2시 로드맵 · 도형행"
      }
     ]
    },
    {
     "title": "시작 이정표",
     "blocks": [
      {
       "label": "2-1 시작",
       "note": "",
       "start": 29,
       "end": 30,
       "kind": "event",
       "sourceRow": "S2:t0:r16"
      },
      {
       "label": "초급 시작",
       "note": "",
       "start": 34,
       "end": 35,
       "kind": "event",
       "sourceRow": "S2:t0:r15"
      }
     ]
    }
   ],
   "notes": [
    "A반 운영표는 6세 10월에 라이즈를 공부하고, 7세 11월부터 초급으로 이어집니다.",
    "6세 시작 예시는 별도 반의 RAY B → 라이즈 → 초급 일정입니다. Premier는 교재 과정 이름입니다.",
    "7세 6월부터 디딤돌 기본 2-1을 병행하고, 7세 11월부터 Premier 초급을 시작합니다.",
    "소마셈은 권당 4주로 진행합니다. 교과·연산·도형은 각각의 진도로 함께 공부합니다.",
    "초1 7월을 초급 완료로 보지는 않습니다. 반별 일정은 구분해서 참고해 주세요."
   ],
   "archive": {
    "label": "소마 A1 · 이전 코호트",
    "cohort": "2026년 초2 코호트",
    "main": {
     "title": "학원 과정",
     "blocks": [
      {
       "label": "C단계",
       "note": "",
       "start": 36,
       "end": 37,
       "kind": "period",
       "sourceRow": "S2:t0:r18"
      },
      {
       "label": "초급 1~8권",
       "note": "초1 2월~초2 4월",
       "start": 37,
       "end": 52,
       "kind": "period",
       "sourceRow": "S2:t0:r18"
      },
      {
       "label": "중급",
       "note": "초2 5월~초3 6월",
       "start": 52,
       "end": 60,
       "kind": "period",
       "sourceRow": "S2:t0:r18"
      }
     ]
    },
    "parallel": [
     {
      "title": "교과",
      "blocks": [
       {
        "label": "3-1",
        "note": "",
        "start": 41,
        "end": 44,
        "kind": "period",
        "sourceRow": "S2:t0:r19"
       },
       {
        "label": "3-2",
        "note": "",
        "start": 44,
        "end": 48,
        "kind": "period",
        "sourceRow": "S2:t0:r19"
       },
       {
        "label": "4-1",
        "note": "",
        "start": 49,
        "end": 52,
        "kind": "period",
        "sourceRow": "S2:t0:r19"
       },
       {
        "label": "4-2",
        "note": "",
        "start": 53,
        "end": 56,
        "kind": "period",
        "sourceRow": "S2:t0:r19"
       },
       {
        "label": "5-1",
        "note": "",
        "start": 57,
        "end": 60,
        "kind": "period",
        "sourceRow": "S2:t0:r19"
       }
      ]
     },
     {
      "title": "연산",
      "blocks": [
       {
        "label": "세±세 곱셈구구",
        "note": "",
        "start": 36,
        "end": 38,
        "kind": "period",
        "sourceRow": "S2:t0:r20"
       },
       {
        "label": "두×한·세×한 구구단 나눗셈",
        "note": "",
        "start": 38,
        "end": 41,
        "kind": "period",
        "sourceRow": "S2:t0:r20"
       },
       {
        "label": "두×두·두÷한 분수",
        "note": "",
        "start": 41,
        "end": 44,
        "kind": "period",
        "sourceRow": "S2:t0:r20"
       },
       {
        "label": "소마연산 4학년",
        "note": "",
        "start": 44,
        "end": 51,
        "kind": "period",
        "sourceRow": "S2:t0:r20"
       },
       {
        "label": "소마연산 5학년",
        "note": "",
        "start": 51,
        "end": 58,
        "kind": "period",
        "sourceRow": "S2:t0:r20"
       },
       {
        "label": "6학년",
        "note": "",
        "start": 58,
        "end": 60,
        "kind": "period",
        "sourceRow": "S2:t0:r20"
       }
      ]
     },
     {
      "title": "수학경시",
      "blocks": [
       {
        "label": "경시 특강",
        "note": "",
        "start": 38,
        "end": 40,
        "kind": "period",
        "sourceRow": "S2:t0:r21"
       },
       {
        "label": "경시 특강",
        "note": "",
        "start": 44,
        "end": 46,
        "kind": "period",
        "sourceRow": "S2:t0:r21"
       },
       {
        "label": "경시 특강",
        "note": "",
        "start": 49,
        "end": 51,
        "kind": "period",
        "sourceRow": "S2:t0:r21"
       },
       {
        "label": "경시 특강",
        "note": "",
        "start": 57,
        "end": 59,
        "kind": "period",
        "sourceRow": "S2:t0:r21"
       }
      ]
     }
    ]
   }
  }
 ]
};
function freeze(v){if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
global.PLANNER_ACADEMY_ROADMAPS=freeze(data);
})(window);
