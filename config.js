/* =========================================================
 * GFIELD-ON 통합 설정 (통합관리 admin이 자동 생성)
 * 구조 + 콘텐츠 + 해시된 회원 권한을 한 파일로.
 * 각 인덱스는 이 파일 하나만 읽어서 렌더 (서버 호출 0 · CDN 즉시).
 *
 * access = { "<SHA-256(salt+승인번호)>": ["권한열쇠", ...] }
 *   → 승인번호 원문/이름은 여기 없음(원장 레지스트리에만). 안전.
 * 생성: (초기 시드)
 * ========================================================= */
window.GFIELD_CONFIG = {
  "meta": {
    "updatedAt": "2026-08-16",
    "salt": "gfield-on-2026-v1"
  },
  "brands": [
    {
      "key": "soma",
      "name": "소마",
      "icon": "🟦",
      "badge": "SOMA",
      "desc": "소마 레벨테스트·선발 대비",
      "courses": [
        {
          "key": "basic",
          "name": "소마 대비",
          "desc": "소마 기본 레벨테스트 대비",
          "lock": "soon",
          "programs": []
        },
        {
          "key": "premier",
          "name": "소마 프리미어 대비",
          "desc": "프리미어 선발 정밀 대비",
          "lock": "closed",
          "programs": [
            { "key": "hyperfocus", "name": "하이퍼포커스 진단", "type": "진단", "desc": "현재 레벨 L0~L4 정밀 진단 · 난이도별 유사문제 2문항 포함", "lock": "open", "url": "/hyper-focus/" },
            { "key": "hyperfocus-extra", "name": "하이퍼포커스 추가 문제", "type": "유료 문제", "desc": "선택 난이도에서 유형당 3번째 이후 문제 생성", "lock": "closed", "url": "/hyper-focus/mock/" },
            { "key": "mock", "name": "온라인 모의고사", "type": "모의고사+강의", "desc": "회차별 실전 + 해설 강의", "lock": "closed", "count": 8, "url": "" }
          ]
        }
      ]
    },
    {
      "key": "fields",
      "name": "필즈 더 클래식",
      "icon": "🟨",
      "badge": "FIELDS THE CLASSIC",
      "desc": "필즈 더 클래식 레테 올인원",
      "single": true,
      "programs": [
        { "key": "concept", "name": "개념 완성", "type": "개념+강의", "desc": "핵심 개념 커리큘럼(Vol.1~4)", "lock": "open", "url": "/fields-classic/program/" },
        { "key": "killer", "name": "킬러문항", "type": "강의", "desc": "최상위 킬러 유형 공략", "lock": "closed", "url": "" },
        { "key": "final", "name": "파이널 모의고사 6회", "type": "모의고사+강의", "desc": "실전 파이널 6세트", "lock": "closed", "url": "" },
        { "key": "diag", "name": "온라인 진단", "type": "진단", "desc": "현재 수준 정밀 진단", "lock": "closed", "url": "/fields-classic/mock/" },
        { "key": "archive", "name": "자료실", "type": "자료", "desc": "전용 자료·인쇄 출력", "lock": "closed", "url": "" }
      ]
    },
    {
      "key": "hwangso",
      "name": "생각하는 황소",
      "icon": "🟩",
      "badge": "HWANGSO",
      "desc": "생각하는 황소 입학시험 대비",
      "courses": [
        { "key": "elem", "name": "초등 대비", "desc": "황소 초등 교재 유형별 유사문제", "lock": "open", "programs": [
          { "key": "elementary-bank", "name": "초등 유사문제 문제은행", "type": "문제은행", "desc": "4·5·6학년 학기·단원·레벨별 맞춤 문제", "lock": "open", "url": "/hselementary/question-bank/" }
        ] },
        { "key": "mid", "name": "중등 대비", "desc": "황소 중등 입학시험 대비", "lock": "soon", "programs": [] }
      ]
    }
  ],
  "access": {}
};
