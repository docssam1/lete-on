/* Read-only reference details omitted from planner-levels.js.
 * Derived from SchoolRoadmap.levelRows for L0~L13; no source file is changed.
 * start/end retain the source month coordinate, inclusive at both ends.
 * school2: explicit curriculum depth; comp2: parallel contest preparation.
 * schoolGaps identify which source school2 blocks occupy a curriculum gap;
 * a gap is never inferred to mean generic review.
 * This is the 2026-10-19 level-table policy, not a new recommendation.
 * planner.js contains a later C middle-school policy (concept + RPM); callers
 * must not silently substitute the older A-grade depth route as that policy.
 * No per-learner choices, semester assignments, or duration overrides are added.
 */
(function(global){
'use strict';
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
global.PLANNER_STANDARD_DETAILS=freeze({
  "L0": {
    "schemaVersion": 1,
    "school2": [
      {
        "id": "L0-school2-01",
        "title": "2학년 최상위 수학",
        "sourceText": "2학년 최상위 수학",
        "start": 23,
        "end": 26,
        "stage": null
      },
      {
        "id": "L0-school2-02",
        "title": "3학년 최상위 수학",
        "sourceText": "3학년 최상위 수학",
        "start": 27,
        "end": 30,
        "stage": null
      },
      {
        "id": "L0-school2-03",
        "title": "최상위 수학 꾸준히",
        "sourceText": "최상위 수학 꾸준히",
        "start": 31,
        "end": 42,
        "stage": null
      },
      {
        "id": "L0-school2-04",
        "title": "중1-1 중등 심화(A급)",
        "sourceText": "중1-1 중등 심화(A급)",
        "start": 43,
        "end": 46,
        "stage": "중1-1"
      },
      {
        "id": "L0-school2-05",
        "title": "중1-2 중등 심화(A급)",
        "sourceText": "중1-2 중등 심화(A급)",
        "start": 47,
        "end": 50,
        "stage": "중1-2"
      },
      {
        "id": "L0-school2-06",
        "title": "중2-1 중등 심화(A급)",
        "sourceText": "중2-1 중등 심화(A급)",
        "start": 51,
        "end": 54,
        "stage": "중2-1"
      },
      {
        "id": "L0-school2-07",
        "title": "중2-2 중등 심화(A급)",
        "sourceText": "중2-2 중등 심화(A급)",
        "start": 55,
        "end": 58,
        "stage": "중2-2"
      },
      {
        "id": "L0-school2-08",
        "title": "중3-1 중등 심화(A급)",
        "sourceText": "중3-1 중등 심화(A급)",
        "start": 59,
        "end": 62,
        "stage": "중3-1"
      },
      {
        "id": "L0-school2-09",
        "title": "중3-2 중등 심화(A급)",
        "sourceText": "중3-2 중등 심화(A급)",
        "start": 63,
        "end": 66,
        "stage": "중3-2"
      },
      {
        "id": "L0-school2-10",
        "title": "중등 대수 심화",
        "sourceText": "중등 대수 심화",
        "start": 67,
        "end": 70,
        "stage": null
      },
      {
        "id": "L0-school2-11",
        "title": "중등 기하 심화",
        "sourceText": "중등 기하 심화",
        "start": 71,
        "end": 74,
        "stage": null
      }
    ],
    "comp2": [
      {
        "id": "L0-comp2-01",
        "title": "성대경시 대비",
        "sourceText": "성대경시 대비",
        "start": 36,
        "end": 37,
        "stage": null
      },
      {
        "id": "L0-comp2-02",
        "title": "성대경시 대비",
        "sourceText": "성대경시 대비",
        "start": 42,
        "end": 43,
        "stage": null
      },
      {
        "id": "L0-comp2-03",
        "title": "왕수학 올림피아드 3 + 대비 문항",
        "sourceText": "왕수학 올림피아드 3<br>+ 대비 문항",
        "start": 48,
        "end": 50,
        "stage": null
      }
    ],
    "schoolGaps": [],
    "elementaryMode": {
      "id": "parallel",
      "depthScope": "source-blocks-only",
      "sourceLines": [
        374,
        392
      ]
    },
    "middleMode": {
      "id": "parallel",
      "schoolMonths": 4,
      "depthMonths": 4,
      "depthBook": "A급",
      "sourceLines": [
        309,
        312,
        358,
        359,
        385,
        391
      ]
    },
    "source": {
      "referenceOnly": true,
      "file": "school-roadmap.js",
      "sourceDefinition": "SchoolRoadmap.levelRows(0)",
      "endInclusive": true,
      "coordinate": "5세 1월 = 0; 원자료 월 좌표",
      "sha256": "035c0d83cf97163040c7aad306e6a704bb1c0437b3bcbbc06352b203cf583b98",
      "dependency": "demo-content.js",
      "dependencySha256": "eb5394213984bfce80b41e2de8135837a94c2e21ef4f61d0737400b83f067712"
    }
  },
  "L1": {
    "schemaVersion": 1,
    "school2": [
      {
        "id": "L1-school2-01",
        "title": "2학년 최상위 수학",
        "sourceText": "2학년 최상위 수학",
        "start": 26,
        "end": 29,
        "stage": null
      },
      {
        "id": "L1-school2-02",
        "title": "3학년 최상위 수학",
        "sourceText": "3학년 최상위 수학",
        "start": 30,
        "end": 33,
        "stage": null
      },
      {
        "id": "L1-school2-03",
        "title": "최상위 수학 꾸준히",
        "sourceText": "최상위 수학 꾸준히",
        "start": 34,
        "end": 45,
        "stage": null
      },
      {
        "id": "L1-school2-04",
        "title": "중1-1 중등 심화(A급)",
        "sourceText": "중1-1 중등 심화(A급)",
        "start": 46,
        "end": 49,
        "stage": "중1-1"
      },
      {
        "id": "L1-school2-05",
        "title": "중1-2 중등 심화(A급)",
        "sourceText": "중1-2 중등 심화(A급)",
        "start": 50,
        "end": 53,
        "stage": "중1-2"
      },
      {
        "id": "L1-school2-06",
        "title": "중2-1 중등 심화(A급)",
        "sourceText": "중2-1 중등 심화(A급)",
        "start": 54,
        "end": 57,
        "stage": "중2-1"
      },
      {
        "id": "L1-school2-07",
        "title": "중2-2 중등 심화(A급)",
        "sourceText": "중2-2 중등 심화(A급)",
        "start": 58,
        "end": 61,
        "stage": "중2-2"
      },
      {
        "id": "L1-school2-08",
        "title": "중3-1 중등 심화(A급)",
        "sourceText": "중3-1 중등 심화(A급)",
        "start": 62,
        "end": 65,
        "stage": "중3-1"
      },
      {
        "id": "L1-school2-09",
        "title": "중3-2 중등 심화(A급)",
        "sourceText": "중3-2 중등 심화(A급)",
        "start": 66,
        "end": 69,
        "stage": "중3-2"
      },
      {
        "id": "L1-school2-10",
        "title": "중등 대수 심화",
        "sourceText": "중등 대수 심화",
        "start": 70,
        "end": 73,
        "stage": null
      },
      {
        "id": "L1-school2-11",
        "title": "중등 기하 심화",
        "sourceText": "중등 기하 심화",
        "start": 74,
        "end": 77,
        "stage": null
      }
    ],
    "comp2": [
      {
        "id": "L1-comp2-01",
        "title": "성대경시 대비",
        "sourceText": "성대경시 대비",
        "start": 36,
        "end": 37,
        "stage": null
      },
      {
        "id": "L1-comp2-02",
        "title": "성대경시 대비",
        "sourceText": "성대경시 대비",
        "start": 42,
        "end": 43,
        "stage": null
      },
      {
        "id": "L1-comp2-03",
        "title": "왕수학 올림피아드 3 + 대비 문항",
        "sourceText": "왕수학 올림피아드 3<br>+ 대비 문항",
        "start": 48,
        "end": 50,
        "stage": null
      }
    ],
    "schoolGaps": [],
    "elementaryMode": {
      "id": "parallel",
      "depthScope": "source-blocks-only",
      "sourceLines": [
        374,
        392
      ]
    },
    "middleMode": {
      "id": "parallel",
      "schoolMonths": 4,
      "depthMonths": 4,
      "depthBook": "A급",
      "sourceLines": [
        309,
        312,
        358,
        359,
        385,
        391
      ]
    },
    "source": {
      "referenceOnly": true,
      "file": "school-roadmap.js",
      "sourceDefinition": "SchoolRoadmap.levelRows(3)",
      "endInclusive": true,
      "coordinate": "5세 1월 = 0; 원자료 월 좌표",
      "sha256": "035c0d83cf97163040c7aad306e6a704bb1c0437b3bcbbc06352b203cf583b98",
      "dependency": "demo-content.js",
      "dependencySha256": "eb5394213984bfce80b41e2de8135837a94c2e21ef4f61d0737400b83f067712"
    }
  },
  "L2": {
    "schemaVersion": 1,
    "school2": [
      {
        "id": "L2-school2-01",
        "title": "2학년 최상위 수학",
        "sourceText": "2학년 최상위 수학",
        "start": 29,
        "end": 32,
        "stage": null
      },
      {
        "id": "L2-school2-02",
        "title": "3학년 최상위 수학",
        "sourceText": "3학년 최상위 수학",
        "start": 33,
        "end": 36,
        "stage": null
      },
      {
        "id": "L2-school2-03",
        "title": "최상위 수학 꾸준히",
        "sourceText": "최상위 수학 꾸준히",
        "start": 37,
        "end": 48,
        "stage": null
      },
      {
        "id": "L2-school2-04",
        "title": "중1-1 중등 심화(A급)",
        "sourceText": "중1-1 중등 심화(A급)",
        "start": 49,
        "end": 52,
        "stage": "중1-1"
      },
      {
        "id": "L2-school2-05",
        "title": "중1-2 중등 심화(A급)",
        "sourceText": "중1-2 중등 심화(A급)",
        "start": 53,
        "end": 56,
        "stage": "중1-2"
      },
      {
        "id": "L2-school2-06",
        "title": "중2-1 중등 심화(A급)",
        "sourceText": "중2-1 중등 심화(A급)",
        "start": 57,
        "end": 60,
        "stage": "중2-1"
      },
      {
        "id": "L2-school2-07",
        "title": "중2-2 중등 심화(A급)",
        "sourceText": "중2-2 중등 심화(A급)",
        "start": 61,
        "end": 64,
        "stage": "중2-2"
      },
      {
        "id": "L2-school2-08",
        "title": "중3-1 중등 심화(A급)",
        "sourceText": "중3-1 중등 심화(A급)",
        "start": 65,
        "end": 68,
        "stage": "중3-1"
      },
      {
        "id": "L2-school2-09",
        "title": "중3-2 중등 심화(A급)",
        "sourceText": "중3-2 중등 심화(A급)",
        "start": 69,
        "end": 72,
        "stage": "중3-2"
      },
      {
        "id": "L2-school2-10",
        "title": "중등 대수 심화",
        "sourceText": "중등 대수 심화",
        "start": 73,
        "end": 76,
        "stage": null
      },
      {
        "id": "L2-school2-11",
        "title": "중등 기하 심화",
        "sourceText": "중등 기하 심화",
        "start": 77,
        "end": 80,
        "stage": null
      }
    ],
    "comp2": [
      {
        "id": "L2-comp2-01",
        "title": "성대경시 대비",
        "sourceText": "성대경시 대비",
        "start": 36,
        "end": 37,
        "stage": null
      },
      {
        "id": "L2-comp2-02",
        "title": "성대경시 대비",
        "sourceText": "성대경시 대비",
        "start": 42,
        "end": 43,
        "stage": null
      },
      {
        "id": "L2-comp2-03",
        "title": "왕수학 올림피아드 3 + 대비 문항",
        "sourceText": "왕수학 올림피아드 3<br>+ 대비 문항",
        "start": 48,
        "end": 50,
        "stage": null
      }
    ],
    "schoolGaps": [],
    "elementaryMode": {
      "id": "parallel",
      "depthScope": "source-blocks-only",
      "sourceLines": [
        374,
        392
      ]
    },
    "middleMode": {
      "id": "parallel",
      "schoolMonths": 4,
      "depthMonths": 4,
      "depthBook": "A급",
      "sourceLines": [
        309,
        312,
        358,
        359,
        385,
        391
      ]
    },
    "source": {
      "referenceOnly": true,
      "file": "school-roadmap.js",
      "sourceDefinition": "SchoolRoadmap.levelRows(6)",
      "endInclusive": true,
      "coordinate": "5세 1월 = 0; 원자료 월 좌표",
      "sha256": "035c0d83cf97163040c7aad306e6a704bb1c0437b3bcbbc06352b203cf583b98",
      "dependency": "demo-content.js",
      "dependencySha256": "eb5394213984bfce80b41e2de8135837a94c2e21ef4f61d0737400b83f067712"
    }
  },
  "L3": {
    "schemaVersion": 1,
    "school2": [
      {
        "id": "L3-school2-01",
        "title": "2학년 최상위 수학",
        "sourceText": "2학년 최상위 수학",
        "start": 32,
        "end": 35,
        "stage": null
      },
      {
        "id": "L3-school2-02",
        "title": "3학년 최상위 수학",
        "sourceText": "3학년 최상위 수학",
        "start": 36,
        "end": 39,
        "stage": null
      },
      {
        "id": "L3-school2-03",
        "title": "최상위 수학 꾸준히",
        "sourceText": "최상위 수학 꾸준히",
        "start": 40,
        "end": 51,
        "stage": null
      },
      {
        "id": "L3-school2-04",
        "title": "중1-1 중등 심화(A급)",
        "sourceText": "중1-1 중등 심화(A급)",
        "start": 52,
        "end": 55,
        "stage": "중1-1"
      },
      {
        "id": "L3-school2-05",
        "title": "중1-2 중등 심화(A급)",
        "sourceText": "중1-2 중등 심화(A급)",
        "start": 56,
        "end": 59,
        "stage": "중1-2"
      },
      {
        "id": "L3-school2-06",
        "title": "중2-1 중등 심화(A급)",
        "sourceText": "중2-1 중등 심화(A급)",
        "start": 60,
        "end": 63,
        "stage": "중2-1"
      },
      {
        "id": "L3-school2-07",
        "title": "중2-2 중등 심화(A급)",
        "sourceText": "중2-2 중등 심화(A급)",
        "start": 64,
        "end": 67,
        "stage": "중2-2"
      },
      {
        "id": "L3-school2-08",
        "title": "중3-1 중등 심화(A급)",
        "sourceText": "중3-1 중등 심화(A급)",
        "start": 68,
        "end": 71,
        "stage": "중3-1"
      },
      {
        "id": "L3-school2-09",
        "title": "중3-2 중등 심화(A급)",
        "sourceText": "중3-2 중등 심화(A급)",
        "start": 72,
        "end": 75,
        "stage": "중3-2"
      },
      {
        "id": "L3-school2-10",
        "title": "중등 대수 심화",
        "sourceText": "중등 대수 심화",
        "start": 76,
        "end": 79,
        "stage": null
      },
      {
        "id": "L3-school2-11",
        "title": "중등 기하 심화",
        "sourceText": "중등 기하 심화",
        "start": 80,
        "end": 83,
        "stage": null
      }
    ],
    "comp2": [
      {
        "id": "L3-comp2-01",
        "title": "성대경시 대비",
        "sourceText": "성대경시 대비",
        "start": 39,
        "end": 40,
        "stage": null
      },
      {
        "id": "L3-comp2-02",
        "title": "성대경시 대비",
        "sourceText": "성대경시 대비",
        "start": 45,
        "end": 46,
        "stage": null
      },
      {
        "id": "L3-comp2-03",
        "title": "왕수학 올림피아드 3 + 대비 문항",
        "sourceText": "왕수학 올림피아드 3<br>+ 대비 문항",
        "start": 51,
        "end": 53,
        "stage": null
      }
    ],
    "schoolGaps": [],
    "elementaryMode": {
      "id": "parallel",
      "depthScope": "source-blocks-only",
      "sourceLines": [
        374,
        392
      ]
    },
    "middleMode": {
      "id": "parallel",
      "schoolMonths": 4,
      "depthMonths": 4,
      "depthBook": "A급",
      "sourceLines": [
        309,
        312,
        358,
        359,
        385,
        391
      ]
    },
    "source": {
      "referenceOnly": true,
      "file": "school-roadmap.js",
      "sourceDefinition": "SchoolRoadmap.levelRows(9)",
      "endInclusive": true,
      "coordinate": "5세 1월 = 0; 원자료 월 좌표",
      "sha256": "035c0d83cf97163040c7aad306e6a704bb1c0437b3bcbbc06352b203cf583b98",
      "dependency": "demo-content.js",
      "dependencySha256": "eb5394213984bfce80b41e2de8135837a94c2e21ef4f61d0737400b83f067712"
    }
  },
  "L4": {
    "schemaVersion": 1,
    "school2": [
      {
        "id": "L4-school2-01",
        "title": "2학년 최상위 수학",
        "sourceText": "2학년 최상위 수학",
        "start": 35,
        "end": 38,
        "stage": null
      },
      {
        "id": "L4-school2-02",
        "title": "3학년 최상위 수학",
        "sourceText": "3학년 최상위 수학",
        "start": 39,
        "end": 42,
        "stage": null
      },
      {
        "id": "L4-school2-03",
        "title": "최상위 수학 꾸준히",
        "sourceText": "최상위 수학 꾸준히",
        "start": 43,
        "end": 54,
        "stage": null
      },
      {
        "id": "L4-school2-04",
        "title": "중1-1 중등 심화(A급)",
        "sourceText": "중1-1 중등 심화(A급)",
        "start": 55,
        "end": 58,
        "stage": "중1-1"
      },
      {
        "id": "L4-school2-05",
        "title": "중1-2 중등 심화(A급)",
        "sourceText": "중1-2 중등 심화(A급)",
        "start": 59,
        "end": 62,
        "stage": "중1-2"
      },
      {
        "id": "L4-school2-06",
        "title": "중2-1 중등 심화(A급)",
        "sourceText": "중2-1 중등 심화(A급)",
        "start": 63,
        "end": 66,
        "stage": "중2-1"
      },
      {
        "id": "L4-school2-07",
        "title": "중2-2 중등 심화(A급)",
        "sourceText": "중2-2 중등 심화(A급)",
        "start": 67,
        "end": 70,
        "stage": "중2-2"
      },
      {
        "id": "L4-school2-08",
        "title": "중3-1 중등 심화(A급)",
        "sourceText": "중3-1 중등 심화(A급)",
        "start": 71,
        "end": 74,
        "stage": "중3-1"
      },
      {
        "id": "L4-school2-09",
        "title": "중3-2 중등 심화(A급)",
        "sourceText": "중3-2 중등 심화(A급)",
        "start": 75,
        "end": 78,
        "stage": "중3-2"
      },
      {
        "id": "L4-school2-10",
        "title": "중등 대수 심화",
        "sourceText": "중등 대수 심화",
        "start": 79,
        "end": 82,
        "stage": null
      },
      {
        "id": "L4-school2-11",
        "title": "중등 기하 심화",
        "sourceText": "중등 기하 심화",
        "start": 83,
        "end": 86,
        "stage": null
      }
    ],
    "comp2": [
      {
        "id": "L4-comp2-01",
        "title": "성대경시 대비",
        "sourceText": "성대경시 대비",
        "start": 42,
        "end": 43,
        "stage": null
      },
      {
        "id": "L4-comp2-02",
        "title": "성대경시 대비",
        "sourceText": "성대경시 대비",
        "start": 48,
        "end": 49,
        "stage": null
      },
      {
        "id": "L4-comp2-03",
        "title": "왕수학 올림피아드 3 + 대비 문항",
        "sourceText": "왕수학 올림피아드 3<br>+ 대비 문항",
        "start": 54,
        "end": 56,
        "stage": null
      }
    ],
    "schoolGaps": [],
    "elementaryMode": {
      "id": "parallel",
      "depthScope": "source-blocks-only",
      "sourceLines": [
        374,
        392
      ]
    },
    "middleMode": {
      "id": "parallel",
      "schoolMonths": 4,
      "depthMonths": 4,
      "depthBook": "A급",
      "sourceLines": [
        309,
        312,
        358,
        359,
        385,
        391
      ]
    },
    "source": {
      "referenceOnly": true,
      "file": "school-roadmap.js",
      "sourceDefinition": "SchoolRoadmap.levelRows(12)",
      "endInclusive": true,
      "coordinate": "5세 1월 = 0; 원자료 월 좌표",
      "sha256": "035c0d83cf97163040c7aad306e6a704bb1c0437b3bcbbc06352b203cf583b98",
      "dependency": "demo-content.js",
      "dependencySha256": "eb5394213984bfce80b41e2de8135837a94c2e21ef4f61d0737400b83f067712"
    }
  },
  "L5": {
    "schemaVersion": 1,
    "school2": [
      {
        "id": "L5-school2-01",
        "title": "2학년 최상위 수학",
        "sourceText": "2학년 최상위 수학",
        "start": 38,
        "end": 41,
        "stage": null
      },
      {
        "id": "L5-school2-02",
        "title": "3학년 최상위 수학",
        "sourceText": "3학년 최상위 수학",
        "start": 42,
        "end": 45,
        "stage": null
      },
      {
        "id": "L5-school2-03",
        "title": "최상위 수학 꾸준히",
        "sourceText": "최상위 수학 꾸준히",
        "start": 46,
        "end": 57,
        "stage": null
      },
      {
        "id": "L5-school2-04",
        "title": "중1-1 중등 심화(A급)",
        "sourceText": "중1-1 중등 심화(A급)",
        "start": 58,
        "end": 61,
        "stage": "중1-1"
      },
      {
        "id": "L5-school2-05",
        "title": "중1-2 중등 심화(A급)",
        "sourceText": "중1-2 중등 심화(A급)",
        "start": 62,
        "end": 65,
        "stage": "중1-2"
      },
      {
        "id": "L5-school2-06",
        "title": "중2-1 중등 심화(A급)",
        "sourceText": "중2-1 중등 심화(A급)",
        "start": 66,
        "end": 69,
        "stage": "중2-1"
      },
      {
        "id": "L5-school2-07",
        "title": "중2-2 중등 심화(A급)",
        "sourceText": "중2-2 중등 심화(A급)",
        "start": 70,
        "end": 73,
        "stage": "중2-2"
      },
      {
        "id": "L5-school2-08",
        "title": "중3-1 중등 심화(A급)",
        "sourceText": "중3-1 중등 심화(A급)",
        "start": 74,
        "end": 77,
        "stage": "중3-1"
      },
      {
        "id": "L5-school2-09",
        "title": "중3-2 중등 심화(A급)",
        "sourceText": "중3-2 중등 심화(A급)",
        "start": 78,
        "end": 81,
        "stage": "중3-2"
      },
      {
        "id": "L5-school2-10",
        "title": "중등 대수 심화",
        "sourceText": "중등 대수 심화",
        "start": 82,
        "end": 85,
        "stage": null
      },
      {
        "id": "L5-school2-11",
        "title": "중등 기하 심화",
        "sourceText": "중등 기하 심화",
        "start": 86,
        "end": 89,
        "stage": null
      }
    ],
    "comp2": [
      {
        "id": "L5-comp2-01",
        "title": "성대경시 대비",
        "sourceText": "성대경시 대비",
        "start": 45,
        "end": 46,
        "stage": null
      },
      {
        "id": "L5-comp2-02",
        "title": "성대경시 대비",
        "sourceText": "성대경시 대비",
        "start": 51,
        "end": 52,
        "stage": null
      },
      {
        "id": "L5-comp2-03",
        "title": "왕수학 올림피아드 3 + 대비 문항",
        "sourceText": "왕수학 올림피아드 3<br>+ 대비 문항",
        "start": 57,
        "end": 59,
        "stage": null
      }
    ],
    "schoolGaps": [],
    "elementaryMode": {
      "id": "parallel",
      "depthScope": "source-blocks-only",
      "sourceLines": [
        374,
        392
      ]
    },
    "middleMode": {
      "id": "parallel",
      "schoolMonths": 4,
      "depthMonths": 4,
      "depthBook": "A급",
      "sourceLines": [
        309,
        312,
        358,
        359,
        385,
        391
      ]
    },
    "source": {
      "referenceOnly": true,
      "file": "school-roadmap.js",
      "sourceDefinition": "SchoolRoadmap.levelRows(15)",
      "endInclusive": true,
      "coordinate": "5세 1월 = 0; 원자료 월 좌표",
      "sha256": "035c0d83cf97163040c7aad306e6a704bb1c0437b3bcbbc06352b203cf583b98",
      "dependency": "demo-content.js",
      "dependencySha256": "eb5394213984bfce80b41e2de8135837a94c2e21ef4f61d0737400b83f067712"
    }
  },
  "L6": {
    "schemaVersion": 1,
    "school2": [
      {
        "id": "L6-school2-01",
        "title": "2학년 최상위 수학",
        "sourceText": "2학년 최상위 수학",
        "start": 41,
        "end": 44,
        "stage": null
      },
      {
        "id": "L6-school2-02",
        "title": "3학년 최상위 수학",
        "sourceText": "3학년 최상위 수학",
        "start": 45,
        "end": 48,
        "stage": null
      },
      {
        "id": "L6-school2-03",
        "title": "최상위 수학 꾸준히",
        "sourceText": "최상위 수학 꾸준히",
        "start": 49,
        "end": 60,
        "stage": null
      },
      {
        "id": "L6-school2-04",
        "title": "중1-1 중등 심화(A급)",
        "sourceText": "중1-1 중등 심화(A급)",
        "start": 61,
        "end": 64,
        "stage": "중1-1"
      },
      {
        "id": "L6-school2-05",
        "title": "중1-2 중등 심화(A급)",
        "sourceText": "중1-2 중등 심화(A급)",
        "start": 65,
        "end": 68,
        "stage": "중1-2"
      },
      {
        "id": "L6-school2-06",
        "title": "중2-1 중등 심화(A급)",
        "sourceText": "중2-1 중등 심화(A급)",
        "start": 69,
        "end": 72,
        "stage": "중2-1"
      },
      {
        "id": "L6-school2-07",
        "title": "중2-2 중등 심화(A급)",
        "sourceText": "중2-2 중등 심화(A급)",
        "start": 73,
        "end": 76,
        "stage": "중2-2"
      },
      {
        "id": "L6-school2-08",
        "title": "중3-1 중등 심화(A급)",
        "sourceText": "중3-1 중등 심화(A급)",
        "start": 77,
        "end": 80,
        "stage": "중3-1"
      },
      {
        "id": "L6-school2-09",
        "title": "중3-2 중등 심화(A급)",
        "sourceText": "중3-2 중등 심화(A급)",
        "start": 81,
        "end": 84,
        "stage": "중3-2"
      },
      {
        "id": "L6-school2-10",
        "title": "중등 대수 심화",
        "sourceText": "중등 대수 심화",
        "start": 85,
        "end": 88,
        "stage": null
      },
      {
        "id": "L6-school2-11",
        "title": "중등 기하 심화",
        "sourceText": "중등 기하 심화",
        "start": 89,
        "end": 92,
        "stage": null
      }
    ],
    "comp2": [
      {
        "id": "L6-comp2-01",
        "title": "성대경시 대비",
        "sourceText": "성대경시 대비",
        "start": 48,
        "end": 49,
        "stage": null
      },
      {
        "id": "L6-comp2-02",
        "title": "성대경시 대비",
        "sourceText": "성대경시 대비",
        "start": 54,
        "end": 55,
        "stage": null
      },
      {
        "id": "L6-comp2-03",
        "title": "왕수학 올림피아드 3 + 대비 문항",
        "sourceText": "왕수학 올림피아드 3<br>+ 대비 문항",
        "start": 60,
        "end": 62,
        "stage": null
      }
    ],
    "schoolGaps": [],
    "elementaryMode": {
      "id": "parallel",
      "depthScope": "source-blocks-only",
      "sourceLines": [
        374,
        392
      ]
    },
    "middleMode": {
      "id": "parallel",
      "schoolMonths": 4,
      "depthMonths": 4,
      "depthBook": "A급",
      "sourceLines": [
        309,
        312,
        358,
        359,
        385,
        391
      ]
    },
    "source": {
      "referenceOnly": true,
      "file": "school-roadmap.js",
      "sourceDefinition": "SchoolRoadmap.levelRows(18)",
      "endInclusive": true,
      "coordinate": "5세 1월 = 0; 원자료 월 좌표",
      "sha256": "035c0d83cf97163040c7aad306e6a704bb1c0437b3bcbbc06352b203cf583b98",
      "dependency": "demo-content.js",
      "dependencySha256": "eb5394213984bfce80b41e2de8135837a94c2e21ef4f61d0737400b83f067712"
    }
  },
  "L7": {
    "schemaVersion": 1,
    "school2": [
      {
        "id": "L7-school2-01",
        "title": "2학년 최상위 수학",
        "sourceText": "2학년 최상위 수학",
        "start": 44,
        "end": 47,
        "stage": null
      },
      {
        "id": "L7-school2-02",
        "title": "3학년 최상위 수학",
        "sourceText": "3학년 최상위 수학",
        "start": 48,
        "end": 51,
        "stage": null
      },
      {
        "id": "L7-school2-03",
        "title": "최상위 수학 꾸준히",
        "sourceText": "최상위 수학 꾸준히",
        "start": 52,
        "end": 63,
        "stage": null
      },
      {
        "id": "L7-school2-04",
        "title": "중1-1 중등 심화(A급)",
        "sourceText": "중1-1 중등 심화(A급)",
        "start": 64,
        "end": 67,
        "stage": "중1-1"
      },
      {
        "id": "L7-school2-05",
        "title": "중1-2 중등 심화(A급)",
        "sourceText": "중1-2 중등 심화(A급)",
        "start": 68,
        "end": 71,
        "stage": "중1-2"
      },
      {
        "id": "L7-school2-06",
        "title": "중2-1 중등 심화(A급)",
        "sourceText": "중2-1 중등 심화(A급)",
        "start": 72,
        "end": 75,
        "stage": "중2-1"
      },
      {
        "id": "L7-school2-07",
        "title": "중2-2 중등 심화(A급)",
        "sourceText": "중2-2 중등 심화(A급)",
        "start": 76,
        "end": 79,
        "stage": "중2-2"
      },
      {
        "id": "L7-school2-08",
        "title": "중3-1 중등 심화(A급)",
        "sourceText": "중3-1 중등 심화(A급)",
        "start": 80,
        "end": 83,
        "stage": "중3-1"
      },
      {
        "id": "L7-school2-09",
        "title": "중3-2 중등 심화(A급)",
        "sourceText": "중3-2 중등 심화(A급)",
        "start": 84,
        "end": 87,
        "stage": "중3-2"
      },
      {
        "id": "L7-school2-10",
        "title": "중등 대수 심화",
        "sourceText": "중등 대수 심화",
        "start": 88,
        "end": 91,
        "stage": null
      },
      {
        "id": "L7-school2-11",
        "title": "중등 기하 심화",
        "sourceText": "중등 기하 심화",
        "start": 92,
        "end": 95,
        "stage": null
      }
    ],
    "comp2": [
      {
        "id": "L7-comp2-01",
        "title": "성대경시 대비",
        "sourceText": "성대경시 대비",
        "start": 51,
        "end": 52,
        "stage": null
      },
      {
        "id": "L7-comp2-02",
        "title": "성대경시 대비",
        "sourceText": "성대경시 대비",
        "start": 57,
        "end": 58,
        "stage": null
      },
      {
        "id": "L7-comp2-03",
        "title": "왕수학 올림피아드 3 + 대비 문항",
        "sourceText": "왕수학 올림피아드 3<br>+ 대비 문항",
        "start": 63,
        "end": 65,
        "stage": null
      }
    ],
    "schoolGaps": [],
    "elementaryMode": {
      "id": "parallel",
      "depthScope": "source-blocks-only",
      "sourceLines": [
        374,
        392
      ]
    },
    "middleMode": {
      "id": "parallel",
      "schoolMonths": 4,
      "depthMonths": 4,
      "depthBook": "A급",
      "sourceLines": [
        309,
        312,
        358,
        359,
        385,
        391
      ]
    },
    "source": {
      "referenceOnly": true,
      "file": "school-roadmap.js",
      "sourceDefinition": "SchoolRoadmap.levelRows(21)",
      "endInclusive": true,
      "coordinate": "5세 1월 = 0; 원자료 월 좌표",
      "sha256": "035c0d83cf97163040c7aad306e6a704bb1c0437b3bcbbc06352b203cf583b98",
      "dependency": "demo-content.js",
      "dependencySha256": "eb5394213984bfce80b41e2de8135837a94c2e21ef4f61d0737400b83f067712"
    }
  },
  "L8": {
    "schemaVersion": 1,
    "school2": [
      {
        "id": "L8-school2-01",
        "title": "2학년 최상위 수학",
        "sourceText": "2학년 최상위 수학",
        "start": 47,
        "end": 50,
        "stage": null
      },
      {
        "id": "L8-school2-02",
        "title": "3학년 최상위 수학",
        "sourceText": "3학년 최상위 수학",
        "start": 51,
        "end": 54,
        "stage": null
      },
      {
        "id": "L8-school2-03",
        "title": "최상위 수학 꾸준히",
        "sourceText": "최상위 수학 꾸준히",
        "start": 55,
        "end": 66,
        "stage": null
      },
      {
        "id": "L8-school2-04",
        "title": "중1-1 중등 심화(A급)",
        "sourceText": "중1-1 중등 심화(A급)",
        "start": 67,
        "end": 70,
        "stage": "중1-1"
      },
      {
        "id": "L8-school2-05",
        "title": "중1-2 중등 심화(A급)",
        "sourceText": "중1-2 중등 심화(A급)",
        "start": 71,
        "end": 74,
        "stage": "중1-2"
      },
      {
        "id": "L8-school2-06",
        "title": "중2-1 중등 심화(A급)",
        "sourceText": "중2-1 중등 심화(A급)",
        "start": 75,
        "end": 78,
        "stage": "중2-1"
      },
      {
        "id": "L8-school2-07",
        "title": "중2-2 중등 심화(A급)",
        "sourceText": "중2-2 중등 심화(A급)",
        "start": 79,
        "end": 82,
        "stage": "중2-2"
      },
      {
        "id": "L8-school2-08",
        "title": "중3-1 중등 심화(A급)",
        "sourceText": "중3-1 중등 심화(A급)",
        "start": 83,
        "end": 86,
        "stage": "중3-1"
      },
      {
        "id": "L8-school2-09",
        "title": "중3-2 중등 심화(A급)",
        "sourceText": "중3-2 중등 심화(A급)",
        "start": 87,
        "end": 90,
        "stage": "중3-2"
      },
      {
        "id": "L8-school2-10",
        "title": "중등 대수 심화",
        "sourceText": "중등 대수 심화",
        "start": 91,
        "end": 94,
        "stage": null
      },
      {
        "id": "L8-school2-11",
        "title": "중등 기하 심화",
        "sourceText": "중등 기하 심화",
        "start": 95,
        "end": 98,
        "stage": null
      }
    ],
    "comp2": [
      {
        "id": "L8-comp2-01",
        "title": "성대경시 대비",
        "sourceText": "성대경시 대비",
        "start": 54,
        "end": 55,
        "stage": null
      },
      {
        "id": "L8-comp2-02",
        "title": "성대경시 대비",
        "sourceText": "성대경시 대비",
        "start": 60,
        "end": 61,
        "stage": null
      },
      {
        "id": "L8-comp2-03",
        "title": "왕수학 올림피아드 3 + 대비 문항",
        "sourceText": "왕수학 올림피아드 3<br>+ 대비 문항",
        "start": 66,
        "end": 68,
        "stage": null
      }
    ],
    "schoolGaps": [],
    "elementaryMode": {
      "id": "parallel",
      "depthScope": "source-blocks-only",
      "sourceLines": [
        374,
        392
      ]
    },
    "middleMode": {
      "id": "parallel",
      "schoolMonths": 4,
      "depthMonths": 4,
      "depthBook": "A급",
      "sourceLines": [
        309,
        312,
        358,
        359,
        385,
        391
      ]
    },
    "source": {
      "referenceOnly": true,
      "file": "school-roadmap.js",
      "sourceDefinition": "SchoolRoadmap.levelRows(24)",
      "endInclusive": true,
      "coordinate": "5세 1월 = 0; 원자료 월 좌표",
      "sha256": "035c0d83cf97163040c7aad306e6a704bb1c0437b3bcbbc06352b203cf583b98",
      "dependency": "demo-content.js",
      "dependencySha256": "eb5394213984bfce80b41e2de8135837a94c2e21ef4f61d0737400b83f067712"
    }
  },
  "L9": {
    "schemaVersion": 1,
    "school2": [
      {
        "id": "L9-school2-01",
        "title": "2학년 최상위 수학",
        "sourceText": "2학년 최상위 수학",
        "start": 50,
        "end": 53,
        "stage": null
      },
      {
        "id": "L9-school2-02",
        "title": "3학년 최상위 수학",
        "sourceText": "3학년 최상위 수학",
        "start": 54,
        "end": 57,
        "stage": null
      },
      {
        "id": "L9-school2-03",
        "title": "최상위 수학 꾸준히",
        "sourceText": "최상위 수학 꾸준히",
        "start": 58,
        "end": 69,
        "stage": null
      },
      {
        "id": "L9-school2-04",
        "title": "중1-1 중등 심화(A급)",
        "sourceText": "중1-1 중등 심화(A급)",
        "start": 70,
        "end": 73,
        "stage": "중1-1"
      },
      {
        "id": "L9-school2-05",
        "title": "중1-2 중등 심화(A급)",
        "sourceText": "중1-2 중등 심화(A급)",
        "start": 74,
        "end": 77,
        "stage": "중1-2"
      },
      {
        "id": "L9-school2-06",
        "title": "중2-1 중등 심화(A급)",
        "sourceText": "중2-1 중등 심화(A급)",
        "start": 78,
        "end": 81,
        "stage": "중2-1"
      },
      {
        "id": "L9-school2-07",
        "title": "중2-2 중등 심화(A급)",
        "sourceText": "중2-2 중등 심화(A급)",
        "start": 82,
        "end": 85,
        "stage": "중2-2"
      },
      {
        "id": "L9-school2-08",
        "title": "중3-1 중등 심화(A급)",
        "sourceText": "중3-1 중등 심화(A급)",
        "start": 86,
        "end": 89,
        "stage": "중3-1"
      },
      {
        "id": "L9-school2-09",
        "title": "중3-2 중등 심화(A급)",
        "sourceText": "중3-2 중등 심화(A급)",
        "start": 90,
        "end": 93,
        "stage": "중3-2"
      },
      {
        "id": "L9-school2-10",
        "title": "중등 대수 심화",
        "sourceText": "중등 대수 심화",
        "start": 94,
        "end": 97,
        "stage": null
      },
      {
        "id": "L9-school2-11",
        "title": "중등 기하 심화",
        "sourceText": "중등 기하 심화",
        "start": 98,
        "end": 101,
        "stage": null
      }
    ],
    "comp2": [
      {
        "id": "L9-comp2-01",
        "title": "성대경시 대비",
        "sourceText": "성대경시 대비",
        "start": 57,
        "end": 58,
        "stage": null
      },
      {
        "id": "L9-comp2-02",
        "title": "성대경시 대비",
        "sourceText": "성대경시 대비",
        "start": 63,
        "end": 64,
        "stage": null
      },
      {
        "id": "L9-comp2-03",
        "title": "왕수학 올림피아드 3 + 대비 문항",
        "sourceText": "왕수학 올림피아드 3<br>+ 대비 문항",
        "start": 69,
        "end": 71,
        "stage": null
      }
    ],
    "schoolGaps": [],
    "elementaryMode": {
      "id": "parallel",
      "depthScope": "source-blocks-only",
      "sourceLines": [
        374,
        392
      ]
    },
    "middleMode": {
      "id": "parallel",
      "schoolMonths": 4,
      "depthMonths": 4,
      "depthBook": "A급",
      "sourceLines": [
        309,
        312,
        358,
        359,
        385,
        391
      ]
    },
    "source": {
      "referenceOnly": true,
      "file": "school-roadmap.js",
      "sourceDefinition": "SchoolRoadmap.levelRows(27)",
      "endInclusive": true,
      "coordinate": "5세 1월 = 0; 원자료 월 좌표",
      "sha256": "035c0d83cf97163040c7aad306e6a704bb1c0437b3bcbbc06352b203cf583b98",
      "dependency": "demo-content.js",
      "dependencySha256": "eb5394213984bfce80b41e2de8135837a94c2e21ef4f61d0737400b83f067712"
    }
  },
  "L10": {
    "schemaVersion": 1,
    "school2": [
      {
        "id": "L10-school2-01",
        "title": "1-1 심화 (최상위 수학)",
        "sourceText": "1-1 심화<br><small>(최상위 수학)</small>",
        "start": 28,
        "end": 29,
        "stage": "1-1"
      },
      {
        "id": "L10-school2-02",
        "title": "1-2 심화 (최상위 수학)",
        "sourceText": "1-2 심화<br><small>(최상위 수학)</small>",
        "start": 33,
        "end": 34,
        "stage": "1-2"
      },
      {
        "id": "L10-school2-03",
        "title": "2-1 심화 (최상위 수학)",
        "sourceText": "2-1 심화<br><small>(최상위 수학)</small>",
        "start": 38,
        "end": 39,
        "stage": "2-1"
      },
      {
        "id": "L10-school2-04",
        "title": "2-2 심화 (최상위 수학)",
        "sourceText": "2-2 심화<br><small>(최상위 수학)</small>",
        "start": 43,
        "end": 44,
        "stage": "2-2"
      },
      {
        "id": "L10-school2-05",
        "title": "3-1 심화 (최상위 수학)",
        "sourceText": "3-1 심화<br><small>(최상위 수학)</small>",
        "start": 48,
        "end": 49,
        "stage": "3-1"
      },
      {
        "id": "L10-school2-06",
        "title": "3-2 심화 (최상위 수학)",
        "sourceText": "3-2 심화<br><small>(최상위 수학)</small>",
        "start": 53,
        "end": 54,
        "stage": "3-2"
      },
      {
        "id": "L10-school2-07",
        "title": "4-1 심화 (최상위 수학)",
        "sourceText": "4-1 심화<br><small>(최상위 수학)</small>",
        "start": 58,
        "end": 59,
        "stage": "4-1"
      },
      {
        "id": "L10-school2-08",
        "title": "4-2 심화 (최상위 수학)",
        "sourceText": "4-2 심화<br><small>(최상위 수학)</small>",
        "start": 63,
        "end": 64,
        "stage": "4-2"
      },
      {
        "id": "L10-school2-09",
        "title": "5-1 심화 (최상위 수학)",
        "sourceText": "5-1 심화<br><small>(최상위 수학)</small>",
        "start": 68,
        "end": 69,
        "stage": "5-1"
      },
      {
        "id": "L10-school2-10",
        "title": "5-2 심화 (최상위 수학)",
        "sourceText": "5-2 심화<br><small>(최상위 수학)</small>",
        "start": 73,
        "end": 74,
        "stage": "5-2"
      },
      {
        "id": "L10-school2-11",
        "title": "6-1 심화 (최상위 수학)",
        "sourceText": "6-1 심화<br><small>(최상위 수학)</small>",
        "start": 78,
        "end": 79,
        "stage": "6-1"
      },
      {
        "id": "L10-school2-12",
        "title": "6-2 심화 (최상위 수학)",
        "sourceText": "6-2 심화<br><small>(최상위 수학)</small>",
        "start": 83,
        "end": 84,
        "stage": "6-2"
      },
      {
        "id": "L10-school2-13",
        "title": "중1-1 중등 심화(A급)",
        "sourceText": "중1-1 중등 심화(A급)",
        "start": 85,
        "end": 88,
        "stage": "중1-1"
      },
      {
        "id": "L10-school2-14",
        "title": "중1-2 중등 심화(A급)",
        "sourceText": "중1-2 중등 심화(A급)",
        "start": 89,
        "end": 92,
        "stage": "중1-2"
      },
      {
        "id": "L10-school2-15",
        "title": "중2-1 중등 심화(A급)",
        "sourceText": "중2-1 중등 심화(A급)",
        "start": 93,
        "end": 96,
        "stage": "중2-1"
      },
      {
        "id": "L10-school2-16",
        "title": "중2-2 중등 심화(A급)",
        "sourceText": "중2-2 중등 심화(A급)",
        "start": 97,
        "end": 100,
        "stage": "중2-2"
      },
      {
        "id": "L10-school2-17",
        "title": "중3-1 중등 심화(A급)",
        "sourceText": "중3-1 중등 심화(A급)",
        "start": 101,
        "end": 104,
        "stage": "중3-1"
      },
      {
        "id": "L10-school2-18",
        "title": "중3-2 중등 심화(A급)",
        "sourceText": "중3-2 중등 심화(A급)",
        "start": 105,
        "end": 108,
        "stage": "중3-2"
      }
    ],
    "comp2": [
      {
        "id": "L10-comp2-01",
        "title": "성대경시 대비",
        "sourceText": "성대경시 대비",
        "start": 67,
        "end": 69,
        "stage": null
      },
      {
        "id": "L10-comp2-02",
        "title": "성대경시 대비",
        "sourceText": "성대경시 대비",
        "start": 77,
        "end": 79,
        "stage": null
      },
      {
        "id": "L10-comp2-03",
        "title": "왕수학 올림피아드 3 + 대비 문항",
        "sourceText": "왕수학 올림피아드 3<br>+ 대비 문항",
        "start": 87,
        "end": 91,
        "stage": null
      }
    ],
    "schoolGaps": [
      {
        "id": "L10-school-gap-03",
        "fromStage": "1-1",
        "toStage": "1-2",
        "start": 28,
        "end": 29,
        "depthIds": [
          "L10-school2-01"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L10-school-gap-04",
        "fromStage": "1-2",
        "toStage": "2-1",
        "start": 33,
        "end": 34,
        "depthIds": [
          "L10-school2-02"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L10-school-gap-05",
        "fromStage": "2-1",
        "toStage": "2-2",
        "start": 38,
        "end": 39,
        "depthIds": [
          "L10-school2-03"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L10-school-gap-06",
        "fromStage": "2-2",
        "toStage": "3-1",
        "start": 43,
        "end": 44,
        "depthIds": [
          "L10-school2-04"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L10-school-gap-07",
        "fromStage": "3-1",
        "toStage": "3-2",
        "start": 48,
        "end": 49,
        "depthIds": [
          "L10-school2-05"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L10-school-gap-08",
        "fromStage": "3-2",
        "toStage": "4-1",
        "start": 53,
        "end": 54,
        "depthIds": [
          "L10-school2-06"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L10-school-gap-09",
        "fromStage": "4-1",
        "toStage": "4-2",
        "start": 58,
        "end": 59,
        "depthIds": [
          "L10-school2-07"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L10-school-gap-10",
        "fromStage": "4-2",
        "toStage": "5-1",
        "start": 63,
        "end": 64,
        "depthIds": [
          "L10-school2-08"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L10-school-gap-11",
        "fromStage": "5-1",
        "toStage": "5-2",
        "start": 68,
        "end": 69,
        "depthIds": [
          "L10-school2-09"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L10-school-gap-12",
        "fromStage": "5-2",
        "toStage": "6-1",
        "start": 73,
        "end": 74,
        "depthIds": [
          "L10-school2-10"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L10-school-gap-13",
        "fromStage": "6-1",
        "toStage": "6-2",
        "start": 78,
        "end": 79,
        "depthIds": [
          "L10-school2-11"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L10-school-gap-14",
        "fromStage": "6-2",
        "toStage": "중1-1",
        "start": 83,
        "end": 84,
        "depthIds": [
          "L10-school2-12"
        ],
        "coveredByDepth": true
      }
    ],
    "elementaryMode": {
      "id": "application-then-depth",
      "applicationMonths": 3,
      "depthMonths": 2,
      "cycleMonths": 5,
      "depthScope": "same-semester",
      "sourceLines": [
        333,
        355
      ]
    },
    "middleMode": {
      "id": "parallel",
      "schoolMonths": 4,
      "depthMonths": 4,
      "depthBook": "A급",
      "sourceLines": [
        309,
        312,
        358,
        359,
        385,
        391
      ]
    },
    "source": {
      "referenceOnly": true,
      "file": "school-roadmap.js",
      "sourceDefinition": "SchoolRoadmap.levelRows(30)",
      "endInclusive": true,
      "coordinate": "5세 1월 = 0; 원자료 월 좌표",
      "sha256": "035c0d83cf97163040c7aad306e6a704bb1c0437b3bcbbc06352b203cf583b98",
      "dependency": "demo-content.js",
      "dependencySha256": "eb5394213984bfce80b41e2de8135837a94c2e21ef4f61d0737400b83f067712"
    }
  },
  "L11": {
    "schemaVersion": 1,
    "school2": [
      {
        "id": "L11-school2-01",
        "title": "1-1 심화 (최상위 수학)",
        "sourceText": "1-1 심화<br><small>(최상위 수학)</small>",
        "start": 33,
        "end": 34,
        "stage": "1-1"
      },
      {
        "id": "L11-school2-02",
        "title": "1-2 심화 (최상위 수학)",
        "sourceText": "1-2 심화<br><small>(최상위 수학)</small>",
        "start": 38,
        "end": 39,
        "stage": "1-2"
      },
      {
        "id": "L11-school2-03",
        "title": "2-1 심화 (최상위 수학)",
        "sourceText": "2-1 심화<br><small>(최상위 수학)</small>",
        "start": 43,
        "end": 44,
        "stage": "2-1"
      },
      {
        "id": "L11-school2-04",
        "title": "2-2 심화 (최상위 수학)",
        "sourceText": "2-2 심화<br><small>(최상위 수학)</small>",
        "start": 48,
        "end": 49,
        "stage": "2-2"
      },
      {
        "id": "L11-school2-05",
        "title": "3-1 심화 (최상위 수학)",
        "sourceText": "3-1 심화<br><small>(최상위 수학)</small>",
        "start": 53,
        "end": 54,
        "stage": "3-1"
      },
      {
        "id": "L11-school2-06",
        "title": "3-2 심화 (최상위 수학)",
        "sourceText": "3-2 심화<br><small>(최상위 수학)</small>",
        "start": 58,
        "end": 59,
        "stage": "3-2"
      },
      {
        "id": "L11-school2-07",
        "title": "4-1 심화 (최상위 수학)",
        "sourceText": "4-1 심화<br><small>(최상위 수학)</small>",
        "start": 63,
        "end": 64,
        "stage": "4-1"
      },
      {
        "id": "L11-school2-08",
        "title": "4-2 심화 (최상위 수학)",
        "sourceText": "4-2 심화<br><small>(최상위 수학)</small>",
        "start": 68,
        "end": 69,
        "stage": "4-2"
      },
      {
        "id": "L11-school2-09",
        "title": "5-1 심화 (최상위 수학)",
        "sourceText": "5-1 심화<br><small>(최상위 수학)</small>",
        "start": 73,
        "end": 74,
        "stage": "5-1"
      },
      {
        "id": "L11-school2-10",
        "title": "5-2 심화 (최상위 수학)",
        "sourceText": "5-2 심화<br><small>(최상위 수학)</small>",
        "start": 78,
        "end": 79,
        "stage": "5-2"
      },
      {
        "id": "L11-school2-11",
        "title": "6-1 심화 (최상위 수학)",
        "sourceText": "6-1 심화<br><small>(최상위 수학)</small>",
        "start": 83,
        "end": 84,
        "stage": "6-1"
      },
      {
        "id": "L11-school2-12",
        "title": "6-2 심화 (최상위 수학)",
        "sourceText": "6-2 심화<br><small>(최상위 수학)</small>",
        "start": 88,
        "end": 89,
        "stage": "6-2"
      },
      {
        "id": "L11-school2-13",
        "title": "중1-1 중등 심화(A급)",
        "sourceText": "중1-1 중등 심화(A급)",
        "start": 90,
        "end": 93,
        "stage": "중1-1"
      },
      {
        "id": "L11-school2-14",
        "title": "중1-2 중등 심화(A급)",
        "sourceText": "중1-2 중등 심화(A급)",
        "start": 94,
        "end": 97,
        "stage": "중1-2"
      },
      {
        "id": "L11-school2-15",
        "title": "중2-1 중등 심화(A급)",
        "sourceText": "중2-1 중등 심화(A급)",
        "start": 98,
        "end": 101,
        "stage": "중2-1"
      },
      {
        "id": "L11-school2-16",
        "title": "중2-2 중등 심화(A급)",
        "sourceText": "중2-2 중등 심화(A급)",
        "start": 102,
        "end": 105,
        "stage": "중2-2"
      },
      {
        "id": "L11-school2-17",
        "title": "중3-1 중등 심화(A급)",
        "sourceText": "중3-1 중등 심화(A급)",
        "start": 106,
        "end": 109,
        "stage": "중3-1"
      },
      {
        "id": "L11-school2-18",
        "title": "중3-2 중등 심화(A급)",
        "sourceText": "중3-2 중등 심화(A급)",
        "start": 110,
        "end": 113,
        "stage": "중3-2"
      }
    ],
    "comp2": [
      {
        "id": "L11-comp2-01",
        "title": "성대경시 대비",
        "sourceText": "성대경시 대비",
        "start": 72,
        "end": 74,
        "stage": null
      },
      {
        "id": "L11-comp2-02",
        "title": "성대경시 대비",
        "sourceText": "성대경시 대비",
        "start": 82,
        "end": 84,
        "stage": null
      },
      {
        "id": "L11-comp2-03",
        "title": "왕수학 올림피아드 3 + 대비 문항",
        "sourceText": "왕수학 올림피아드 3<br>+ 대비 문항",
        "start": 92,
        "end": 96,
        "stage": null
      }
    ],
    "schoolGaps": [
      {
        "id": "L11-school-gap-03",
        "fromStage": "1-1",
        "toStage": "1-2",
        "start": 33,
        "end": 34,
        "depthIds": [
          "L11-school2-01"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L11-school-gap-04",
        "fromStage": "1-2",
        "toStage": "2-1",
        "start": 38,
        "end": 39,
        "depthIds": [
          "L11-school2-02"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L11-school-gap-05",
        "fromStage": "2-1",
        "toStage": "2-2",
        "start": 43,
        "end": 44,
        "depthIds": [
          "L11-school2-03"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L11-school-gap-06",
        "fromStage": "2-2",
        "toStage": "3-1",
        "start": 48,
        "end": 49,
        "depthIds": [
          "L11-school2-04"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L11-school-gap-07",
        "fromStage": "3-1",
        "toStage": "3-2",
        "start": 53,
        "end": 54,
        "depthIds": [
          "L11-school2-05"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L11-school-gap-08",
        "fromStage": "3-2",
        "toStage": "4-1",
        "start": 58,
        "end": 59,
        "depthIds": [
          "L11-school2-06"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L11-school-gap-09",
        "fromStage": "4-1",
        "toStage": "4-2",
        "start": 63,
        "end": 64,
        "depthIds": [
          "L11-school2-07"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L11-school-gap-10",
        "fromStage": "4-2",
        "toStage": "5-1",
        "start": 68,
        "end": 69,
        "depthIds": [
          "L11-school2-08"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L11-school-gap-11",
        "fromStage": "5-1",
        "toStage": "5-2",
        "start": 73,
        "end": 74,
        "depthIds": [
          "L11-school2-09"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L11-school-gap-12",
        "fromStage": "5-2",
        "toStage": "6-1",
        "start": 78,
        "end": 79,
        "depthIds": [
          "L11-school2-10"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L11-school-gap-13",
        "fromStage": "6-1",
        "toStage": "6-2",
        "start": 83,
        "end": 84,
        "depthIds": [
          "L11-school2-11"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L11-school-gap-14",
        "fromStage": "6-2",
        "toStage": "중1-1",
        "start": 88,
        "end": 89,
        "depthIds": [
          "L11-school2-12"
        ],
        "coveredByDepth": true
      }
    ],
    "elementaryMode": {
      "id": "application-then-depth",
      "applicationMonths": 3,
      "depthMonths": 2,
      "cycleMonths": 5,
      "depthScope": "same-semester",
      "sourceLines": [
        333,
        355
      ]
    },
    "middleMode": {
      "id": "parallel",
      "schoolMonths": 4,
      "depthMonths": 4,
      "depthBook": "A급",
      "sourceLines": [
        309,
        312,
        358,
        359,
        385,
        391
      ]
    },
    "source": {
      "referenceOnly": true,
      "file": "school-roadmap.js",
      "sourceDefinition": "SchoolRoadmap.levelRows(33)",
      "endInclusive": true,
      "coordinate": "5세 1월 = 0; 원자료 월 좌표",
      "sha256": "035c0d83cf97163040c7aad306e6a704bb1c0437b3bcbbc06352b203cf583b98",
      "dependency": "demo-content.js",
      "dependencySha256": "eb5394213984bfce80b41e2de8135837a94c2e21ef4f61d0737400b83f067712"
    }
  },
  "L12": {
    "schemaVersion": 1,
    "school2": [
      {
        "id": "L12-school2-01",
        "title": "1-1 심화 (최상위 수학)",
        "sourceText": "1-1 심화<br><small>(최상위 수학)</small>",
        "start": 38,
        "end": 39,
        "stage": "1-1"
      },
      {
        "id": "L12-school2-02",
        "title": "1-2 심화 (최상위 수학)",
        "sourceText": "1-2 심화<br><small>(최상위 수학)</small>",
        "start": 43,
        "end": 44,
        "stage": "1-2"
      },
      {
        "id": "L12-school2-03",
        "title": "2-1 심화 (최상위 수학)",
        "sourceText": "2-1 심화<br><small>(최상위 수학)</small>",
        "start": 48,
        "end": 49,
        "stage": "2-1"
      },
      {
        "id": "L12-school2-04",
        "title": "2-2 심화 (최상위 수학)",
        "sourceText": "2-2 심화<br><small>(최상위 수학)</small>",
        "start": 53,
        "end": 54,
        "stage": "2-2"
      },
      {
        "id": "L12-school2-05",
        "title": "3-1 심화 (최상위 수학)",
        "sourceText": "3-1 심화<br><small>(최상위 수학)</small>",
        "start": 58,
        "end": 59,
        "stage": "3-1"
      },
      {
        "id": "L12-school2-06",
        "title": "3-2 심화 (최상위 수학)",
        "sourceText": "3-2 심화<br><small>(최상위 수학)</small>",
        "start": 63,
        "end": 64,
        "stage": "3-2"
      },
      {
        "id": "L12-school2-07",
        "title": "4-1 심화 (최상위 수학)",
        "sourceText": "4-1 심화<br><small>(최상위 수학)</small>",
        "start": 68,
        "end": 69,
        "stage": "4-1"
      },
      {
        "id": "L12-school2-08",
        "title": "4-2 심화 (최상위 수학)",
        "sourceText": "4-2 심화<br><small>(최상위 수학)</small>",
        "start": 73,
        "end": 74,
        "stage": "4-2"
      },
      {
        "id": "L12-school2-09",
        "title": "5-1 심화 (최상위 수학)",
        "sourceText": "5-1 심화<br><small>(최상위 수학)</small>",
        "start": 78,
        "end": 79,
        "stage": "5-1"
      },
      {
        "id": "L12-school2-10",
        "title": "5-2 심화 (최상위 수학)",
        "sourceText": "5-2 심화<br><small>(최상위 수학)</small>",
        "start": 83,
        "end": 84,
        "stage": "5-2"
      },
      {
        "id": "L12-school2-11",
        "title": "6-1 심화 (최상위 수학)",
        "sourceText": "6-1 심화<br><small>(최상위 수학)</small>",
        "start": 88,
        "end": 89,
        "stage": "6-1"
      },
      {
        "id": "L12-school2-12",
        "title": "6-2 심화 (최상위 수학)",
        "sourceText": "6-2 심화<br><small>(최상위 수학)</small>",
        "start": 93,
        "end": 94,
        "stage": "6-2"
      },
      {
        "id": "L12-school2-13",
        "title": "중1-1 중등 심화(A급)",
        "sourceText": "중1-1 중등 심화(A급)",
        "start": 95,
        "end": 98,
        "stage": "중1-1"
      },
      {
        "id": "L12-school2-14",
        "title": "중1-2 중등 심화(A급)",
        "sourceText": "중1-2 중등 심화(A급)",
        "start": 99,
        "end": 102,
        "stage": "중1-2"
      },
      {
        "id": "L12-school2-15",
        "title": "중2-1 중등 심화(A급)",
        "sourceText": "중2-1 중등 심화(A급)",
        "start": 103,
        "end": 106,
        "stage": "중2-1"
      },
      {
        "id": "L12-school2-16",
        "title": "중2-2 중등 심화(A급)",
        "sourceText": "중2-2 중등 심화(A급)",
        "start": 107,
        "end": 110,
        "stage": "중2-2"
      },
      {
        "id": "L12-school2-17",
        "title": "중3-1 중등 심화(A급)",
        "sourceText": "중3-1 중등 심화(A급)",
        "start": 111,
        "end": 114,
        "stage": "중3-1"
      },
      {
        "id": "L12-school2-18",
        "title": "중3-2 중등 심화(A급)",
        "sourceText": "중3-2 중등 심화(A급)",
        "start": 115,
        "end": 118,
        "stage": "중3-2"
      }
    ],
    "comp2": [
      {
        "id": "L12-comp2-01",
        "title": "성대경시 대비",
        "sourceText": "성대경시 대비",
        "start": 75,
        "end": 77,
        "stage": null
      },
      {
        "id": "L12-comp2-02",
        "title": "성대경시 대비",
        "sourceText": "성대경시 대비",
        "start": 85,
        "end": 87,
        "stage": null
      },
      {
        "id": "L12-comp2-03",
        "title": "왕수학 올림피아드 3 + 대비 문항",
        "sourceText": "왕수학 올림피아드 3<br>+ 대비 문항",
        "start": 95,
        "end": 99,
        "stage": null
      }
    ],
    "schoolGaps": [
      {
        "id": "L12-school-gap-03",
        "fromStage": "1-1",
        "toStage": "1-2",
        "start": 38,
        "end": 39,
        "depthIds": [
          "L12-school2-01"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L12-school-gap-04",
        "fromStage": "1-2",
        "toStage": "2-1",
        "start": 43,
        "end": 44,
        "depthIds": [
          "L12-school2-02"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L12-school-gap-05",
        "fromStage": "2-1",
        "toStage": "2-2",
        "start": 48,
        "end": 49,
        "depthIds": [
          "L12-school2-03"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L12-school-gap-06",
        "fromStage": "2-2",
        "toStage": "3-1",
        "start": 53,
        "end": 54,
        "depthIds": [
          "L12-school2-04"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L12-school-gap-07",
        "fromStage": "3-1",
        "toStage": "3-2",
        "start": 58,
        "end": 59,
        "depthIds": [
          "L12-school2-05"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L12-school-gap-08",
        "fromStage": "3-2",
        "toStage": "4-1",
        "start": 63,
        "end": 64,
        "depthIds": [
          "L12-school2-06"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L12-school-gap-09",
        "fromStage": "4-1",
        "toStage": "4-2",
        "start": 68,
        "end": 69,
        "depthIds": [
          "L12-school2-07"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L12-school-gap-10",
        "fromStage": "4-2",
        "toStage": "5-1",
        "start": 73,
        "end": 74,
        "depthIds": [
          "L12-school2-08"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L12-school-gap-11",
        "fromStage": "5-1",
        "toStage": "5-2",
        "start": 78,
        "end": 79,
        "depthIds": [
          "L12-school2-09"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L12-school-gap-12",
        "fromStage": "5-2",
        "toStage": "6-1",
        "start": 83,
        "end": 84,
        "depthIds": [
          "L12-school2-10"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L12-school-gap-13",
        "fromStage": "6-1",
        "toStage": "6-2",
        "start": 88,
        "end": 89,
        "depthIds": [
          "L12-school2-11"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L12-school-gap-14",
        "fromStage": "6-2",
        "toStage": "중1-1",
        "start": 93,
        "end": 94,
        "depthIds": [
          "L12-school2-12"
        ],
        "coveredByDepth": true
      }
    ],
    "elementaryMode": {
      "id": "application-then-depth",
      "applicationMonths": 3,
      "depthMonths": 2,
      "cycleMonths": 5,
      "depthScope": "same-semester",
      "sourceLines": [
        333,
        355
      ]
    },
    "middleMode": {
      "id": "parallel",
      "schoolMonths": 4,
      "depthMonths": 4,
      "depthBook": "A급",
      "sourceLines": [
        309,
        312,
        358,
        359,
        385,
        391
      ]
    },
    "source": {
      "referenceOnly": true,
      "file": "school-roadmap.js",
      "sourceDefinition": "SchoolRoadmap.levelRows(35)",
      "endInclusive": true,
      "coordinate": "5세 1월 = 0; 원자료 월 좌표",
      "sha256": "035c0d83cf97163040c7aad306e6a704bb1c0437b3bcbbc06352b203cf583b98",
      "dependency": "demo-content.js",
      "dependencySha256": "eb5394213984bfce80b41e2de8135837a94c2e21ef4f61d0737400b83f067712"
    }
  },
  "L13": {
    "schemaVersion": 1,
    "school2": [
      {
        "id": "L13-school2-01",
        "title": "1-1 심화 (최상위 수학)",
        "sourceText": "1-1 심화<br><small>(최상위 수학)</small>",
        "start": 48,
        "end": 49,
        "stage": "1-1"
      },
      {
        "id": "L13-school2-02",
        "title": "1-2 심화 (최상위 수학)",
        "sourceText": "1-2 심화<br><small>(최상위 수학)</small>",
        "start": 53,
        "end": 54,
        "stage": "1-2"
      },
      {
        "id": "L13-school2-03",
        "title": "2-1 심화 (최상위 수학)",
        "sourceText": "2-1 심화<br><small>(최상위 수학)</small>",
        "start": 58,
        "end": 59,
        "stage": "2-1"
      },
      {
        "id": "L13-school2-04",
        "title": "2-2 심화 (최상위 수학)",
        "sourceText": "2-2 심화<br><small>(최상위 수학)</small>",
        "start": 63,
        "end": 64,
        "stage": "2-2"
      },
      {
        "id": "L13-school2-05",
        "title": "3-1 심화 (최상위 수학)",
        "sourceText": "3-1 심화<br><small>(최상위 수학)</small>",
        "start": 68,
        "end": 69,
        "stage": "3-1"
      },
      {
        "id": "L13-school2-06",
        "title": "3-2 심화 (최상위 수학)",
        "sourceText": "3-2 심화<br><small>(최상위 수학)</small>",
        "start": 73,
        "end": 74,
        "stage": "3-2"
      },
      {
        "id": "L13-school2-07",
        "title": "4-1 심화 (최상위 수학)",
        "sourceText": "4-1 심화<br><small>(최상위 수학)</small>",
        "start": 78,
        "end": 79,
        "stage": "4-1"
      },
      {
        "id": "L13-school2-08",
        "title": "4-2 심화 (최상위 수학)",
        "sourceText": "4-2 심화<br><small>(최상위 수학)</small>",
        "start": 83,
        "end": 84,
        "stage": "4-2"
      },
      {
        "id": "L13-school2-09",
        "title": "5-1 심화 (최상위 수학)",
        "sourceText": "5-1 심화<br><small>(최상위 수학)</small>",
        "start": 88,
        "end": 89,
        "stage": "5-1"
      },
      {
        "id": "L13-school2-10",
        "title": "5-2 심화 (최상위 수학)",
        "sourceText": "5-2 심화<br><small>(최상위 수학)</small>",
        "start": 93,
        "end": 94,
        "stage": "5-2"
      },
      {
        "id": "L13-school2-11",
        "title": "6-1 심화 (최상위 수학)",
        "sourceText": "6-1 심화<br><small>(최상위 수학)</small>",
        "start": 98,
        "end": 99,
        "stage": "6-1"
      },
      {
        "id": "L13-school2-12",
        "title": "6-2 심화 (최상위 수학)",
        "sourceText": "6-2 심화<br><small>(최상위 수학)</small>",
        "start": 103,
        "end": 104,
        "stage": "6-2"
      },
      {
        "id": "L13-school2-13",
        "title": "중1-1 중등 심화(A급)",
        "sourceText": "중1-1 중등 심화(A급)",
        "start": 105,
        "end": 108,
        "stage": "중1-1"
      },
      {
        "id": "L13-school2-14",
        "title": "중1-2 중등 심화(A급)",
        "sourceText": "중1-2 중등 심화(A급)",
        "start": 109,
        "end": 112,
        "stage": "중1-2"
      },
      {
        "id": "L13-school2-15",
        "title": "중2-1 중등 심화(A급)",
        "sourceText": "중2-1 중등 심화(A급)",
        "start": 113,
        "end": 116,
        "stage": "중2-1"
      },
      {
        "id": "L13-school2-16",
        "title": "중2-2 중등 심화(A급)",
        "sourceText": "중2-2 중등 심화(A급)",
        "start": 117,
        "end": 120,
        "stage": "중2-2"
      },
      {
        "id": "L13-school2-17",
        "title": "중3-1 중등 심화(A급)",
        "sourceText": "중3-1 중등 심화(A급)",
        "start": 121,
        "end": 124,
        "stage": "중3-1"
      },
      {
        "id": "L13-school2-18",
        "title": "중3-2 중등 심화(A급)",
        "sourceText": "중3-2 중등 심화(A급)",
        "start": 125,
        "end": 128,
        "stage": "중3-2"
      }
    ],
    "comp2": [
      {
        "id": "L13-comp2-01",
        "title": "성대경시 대비",
        "sourceText": "성대경시 대비",
        "start": 80,
        "end": 82,
        "stage": null
      },
      {
        "id": "L13-comp2-02",
        "title": "성대경시 대비",
        "sourceText": "성대경시 대비",
        "start": 90,
        "end": 92,
        "stage": null
      },
      {
        "id": "L13-comp2-03",
        "title": "왕수학 올림피아드 3 + 대비 문항",
        "sourceText": "왕수학 올림피아드 3<br>+ 대비 문항",
        "start": 100,
        "end": 104,
        "stage": null
      }
    ],
    "schoolGaps": [
      {
        "id": "L13-school-gap-03",
        "fromStage": "1-1",
        "toStage": "1-2",
        "start": 48,
        "end": 49,
        "depthIds": [
          "L13-school2-01"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L13-school-gap-04",
        "fromStage": "1-2",
        "toStage": "2-1",
        "start": 53,
        "end": 54,
        "depthIds": [
          "L13-school2-02"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L13-school-gap-05",
        "fromStage": "2-1",
        "toStage": "2-2",
        "start": 58,
        "end": 59,
        "depthIds": [
          "L13-school2-03"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L13-school-gap-06",
        "fromStage": "2-2",
        "toStage": "3-1",
        "start": 63,
        "end": 64,
        "depthIds": [
          "L13-school2-04"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L13-school-gap-07",
        "fromStage": "3-1",
        "toStage": "3-2",
        "start": 68,
        "end": 69,
        "depthIds": [
          "L13-school2-05"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L13-school-gap-08",
        "fromStage": "3-2",
        "toStage": "4-1",
        "start": 73,
        "end": 74,
        "depthIds": [
          "L13-school2-06"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L13-school-gap-09",
        "fromStage": "4-1",
        "toStage": "4-2",
        "start": 78,
        "end": 79,
        "depthIds": [
          "L13-school2-07"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L13-school-gap-10",
        "fromStage": "4-2",
        "toStage": "5-1",
        "start": 83,
        "end": 84,
        "depthIds": [
          "L13-school2-08"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L13-school-gap-11",
        "fromStage": "5-1",
        "toStage": "5-2",
        "start": 88,
        "end": 89,
        "depthIds": [
          "L13-school2-09"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L13-school-gap-12",
        "fromStage": "5-2",
        "toStage": "6-1",
        "start": 93,
        "end": 94,
        "depthIds": [
          "L13-school2-10"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L13-school-gap-13",
        "fromStage": "6-1",
        "toStage": "6-2",
        "start": 98,
        "end": 99,
        "depthIds": [
          "L13-school2-11"
        ],
        "coveredByDepth": true
      },
      {
        "id": "L13-school-gap-14",
        "fromStage": "6-2",
        "toStage": "중1-1",
        "start": 103,
        "end": 104,
        "depthIds": [
          "L13-school2-12"
        ],
        "coveredByDepth": true
      }
    ],
    "elementaryMode": {
      "id": "application-then-depth",
      "applicationMonths": 3,
      "depthMonths": 2,
      "cycleMonths": 5,
      "depthScope": "same-semester",
      "sourceLines": [
        333,
        355
      ]
    },
    "middleMode": {
      "id": "parallel",
      "schoolMonths": 4,
      "depthMonths": 4,
      "depthBook": "A급",
      "sourceLines": [
        309,
        312,
        358,
        359,
        385,
        391
      ]
    },
    "source": {
      "referenceOnly": true,
      "file": "school-roadmap.js",
      "sourceDefinition": "SchoolRoadmap.levelRows(38)",
      "endInclusive": true,
      "coordinate": "5세 1월 = 0; 원자료 월 좌표",
      "sha256": "035c0d83cf97163040c7aad306e6a704bb1c0437b3bcbbc06352b203cf583b98",
      "dependency": "demo-content.js",
      "dependencySha256": "eb5394213984bfce80b41e2de8135837a94c2e21ef4f61d0737400b83f067712"
    }
  }
});
})(window);
