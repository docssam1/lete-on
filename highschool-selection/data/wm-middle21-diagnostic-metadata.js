(function (root, factory) {
  "use strict";
  const core = typeof module !== "undefined" && module.exports
    ? require("./question-bank-core.js")
    : root.HIGHSELECT_QUESTION_BANK_CORE;
  const api = factory(core);
  root.HIGHSELECT_WM_MIDDLE21_DIAGNOSTIC_METADATA = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function (core) {
  "use strict";

  if (!core) throw new Error("HIGHSELECT_QUESTION_BANK_CORE is required");

  const MODE = "WM";
  const DIFFICULTY_BANDS = Object.freeze(["lowered", "standard", "raised"]);
  const DIFFICULTY_LABELS = Object.freeze({ lowered: "기본", standard: "심화", raised: "최상" });
  const SECTION_LABELS = Object.freeze({ ALG: "대수", GEO: "기하" });
  const POINT_POLICY = Object.freeze({
    id: core.createNeutralId("policy", MODE, "diagnostic:wm-middle21:equal-weight:v1"),
    version: "1.0.0",
    pointsPerItem: 1,
    totalPoints: 40,
    officialWeight: false,
    note: "문항별 1점의 진단용 동일 배점입니다."
  });

  /* Generated classification rows only. Protected source and response data are excluded. */
  const ROWS = Object.freeze([
    [
        "wm-middle21-basic-entry-r01",
        "WM-M21-R01",
        1,
        "ALG",
        "수와 연산",
        "소인수분해",
        "M1-NUM-PF",
        "소인수분해와 약수 구조",
        "lowered"
    ],
    [
        "wm-middle21-basic-entry-r01",
        "WM-M21-R01",
        2,
        "ALG",
        "수와 연산",
        "소인수분해",
        "M1-NUM-PF",
        "소인수분해와 약수 구조",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r01",
        "WM-M21-R01",
        3,
        "ALG",
        "수와 연산",
        "소인수분해",
        "M1-NUM-PF",
        "소인수분해와 약수 구조",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r01",
        "WM-M21-R01",
        4,
        "ALG",
        "수와 연산",
        "정수와 유리수",
        "M1-NUM-RAT",
        "절댓값·대소관계·혼합계산",
        "lowered"
    ],
    [
        "wm-middle21-basic-entry-r01",
        "WM-M21-R01",
        5,
        "ALG",
        "수와 연산",
        "정수와 유리수",
        "M1-NUM-RAT",
        "절댓값·대소관계·혼합계산",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r01",
        "WM-M21-R01",
        6,
        "ALG",
        "수와 연산",
        "정수와 유리수",
        "M1-NUM-RAT",
        "절댓값·대소관계·혼합계산",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r01",
        "WM-M21-R01",
        7,
        "ALG",
        "수와 연산",
        "정수와 유리수",
        "M1-NUM-RAT",
        "절댓값·대소관계·혼합계산",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r01",
        "WM-M21-R01",
        8,
        "ALG",
        "문자와 식",
        "문자의 사용과 식의 계산",
        "M1-ALG-EXP",
        "식의 값과 일차식의 계산",
        "lowered"
    ],
    [
        "wm-middle21-basic-entry-r01",
        "WM-M21-R01",
        9,
        "ALG",
        "문자와 식",
        "문자의 사용과 식의 계산",
        "M1-ALG-EXP",
        "식의 값과 일차식의 계산",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r01",
        "WM-M21-R01",
        10,
        "ALG",
        "문자와 식",
        "문자의 사용과 식의 계산",
        "M1-ALG-EXP",
        "식의 값과 일차식의 계산",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r01",
        "WM-M21-R01",
        11,
        "ALG",
        "문자와 식",
        "일차방정식",
        "M1-ALG-EQ",
        "일차방정식과 해의 조건",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r01",
        "WM-M21-R01",
        12,
        "ALG",
        "문자와 식",
        "일차방정식",
        "M1-ALG-EQ",
        "일차방정식과 해의 조건",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r01",
        "WM-M21-R01",
        13,
        "ALG",
        "문자와 식",
        "일차방정식",
        "M1-ALG-EQ",
        "일차방정식과 해의 조건",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r01",
        "WM-M21-R01",
        14,
        "ALG",
        "문자와 식",
        "일차방정식",
        "M1-ALG-EQ",
        "일차방정식과 해의 조건",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r01",
        "WM-M21-R01",
        15,
        "ALG",
        "문자와 식",
        "일차방정식의 활용",
        "M1-ALG-EQAPP",
        "거리·비율·수량 관계의 방정식",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r01",
        "WM-M21-R01",
        16,
        "ALG",
        "문자와 식",
        "일차방정식의 활용",
        "M1-ALG-EQAPP",
        "거리·비율·수량 관계의 방정식",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r01",
        "WM-M21-R01",
        17,
        "ALG",
        "문자와 식",
        "일차방정식의 활용",
        "M1-ALG-EQAPP",
        "거리·비율·수량 관계의 방정식",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r01",
        "WM-M21-R01",
        18,
        "ALG",
        "좌표평면과 그래프",
        "좌표와 정비례·반비례",
        "M1-FUN-GRAPH",
        "좌표·그래프·관계식 해석",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r01",
        "WM-M21-R01",
        19,
        "ALG",
        "좌표평면과 그래프",
        "좌표와 정비례·반비례",
        "M1-FUN-GRAPH",
        "좌표·그래프·관계식 해석",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r01",
        "WM-M21-R01",
        20,
        "ALG",
        "좌표평면과 그래프",
        "좌표와 정비례·반비례",
        "M1-FUN-GRAPH",
        "좌표·그래프·관계식 해석",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r01",
        "WM-M21-R01",
        21,
        "GEO",
        "기본 도형",
        "점·선·면과 각",
        "M1-GEO-BASIC",
        "위치 관계와 각의 계산",
        "lowered"
    ],
    [
        "wm-middle21-basic-entry-r01",
        "WM-M21-R01",
        22,
        "GEO",
        "기본 도형",
        "점·선·면과 각",
        "M1-GEO-BASIC",
        "위치 관계와 각의 계산",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r01",
        "WM-M21-R01",
        23,
        "GEO",
        "기본 도형",
        "점·선·면과 각",
        "M1-GEO-BASIC",
        "위치 관계와 각의 계산",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r01",
        "WM-M21-R01",
        24,
        "GEO",
        "기본 도형",
        "점·선·면과 각",
        "M1-GEO-BASIC",
        "위치 관계와 각의 계산",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r01",
        "WM-M21-R01",
        25,
        "GEO",
        "기본 도형",
        "작도와 합동",
        "M1-GEO-CONG",
        "작도 조건과 삼각형의 합동",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r01",
        "WM-M21-R01",
        26,
        "GEO",
        "기본 도형",
        "작도와 합동",
        "M1-GEO-CONG",
        "작도 조건과 삼각형의 합동",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r01",
        "WM-M21-R01",
        27,
        "GEO",
        "평면도형",
        "다각형",
        "M1-GEO-POLY",
        "다각형의 각과 대각선",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r01",
        "WM-M21-R01",
        28,
        "GEO",
        "평면도형",
        "다각형",
        "M1-GEO-POLY",
        "다각형의 각과 대각선",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r01",
        "WM-M21-R01",
        29,
        "GEO",
        "평면도형",
        "다각형",
        "M1-GEO-POLY",
        "다각형의 각과 대각선",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r01",
        "WM-M21-R01",
        30,
        "GEO",
        "평면도형",
        "원과 부채꼴",
        "M1-GEO-CIRCLE",
        "부채꼴의 호·넓이와 복합 도형",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r01",
        "WM-M21-R01",
        31,
        "GEO",
        "평면도형",
        "원과 부채꼴",
        "M1-GEO-CIRCLE",
        "부채꼴의 호·넓이와 복합 도형",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r01",
        "WM-M21-R01",
        32,
        "GEO",
        "평면도형",
        "원과 부채꼴",
        "M1-GEO-CIRCLE",
        "부채꼴의 호·넓이와 복합 도형",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r01",
        "WM-M21-R01",
        33,
        "GEO",
        "입체도형",
        "다면체와 회전체",
        "M1-GEO-SOLID",
        "다면체·회전체의 구성과 단면",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r01",
        "WM-M21-R01",
        34,
        "GEO",
        "입체도형",
        "다면체와 회전체",
        "M1-GEO-SOLID",
        "다면체·회전체의 구성과 단면",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r01",
        "WM-M21-R01",
        35,
        "GEO",
        "입체도형",
        "다면체와 회전체",
        "M1-GEO-SOLID",
        "다면체·회전체의 구성과 단면",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r01",
        "WM-M21-R01",
        36,
        "GEO",
        "입체도형",
        "다면체와 회전체",
        "M1-GEO-SOLID",
        "다면체·회전체의 구성과 단면",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r01",
        "WM-M21-R01",
        37,
        "GEO",
        "입체도형",
        "겉넓이와 부피",
        "M1-GEO-MEASURE",
        "겉넓이·부피와 복합 조건",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r01",
        "WM-M21-R01",
        38,
        "GEO",
        "입체도형",
        "겉넓이와 부피",
        "M1-GEO-MEASURE",
        "겉넓이·부피와 복합 조건",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r01",
        "WM-M21-R01",
        39,
        "GEO",
        "입체도형",
        "겉넓이와 부피",
        "M1-GEO-MEASURE",
        "겉넓이·부피와 복합 조건",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r01",
        "WM-M21-R01",
        40,
        "GEO",
        "입체도형",
        "겉넓이와 부피",
        "M1-GEO-MEASURE",
        "겉넓이·부피와 복합 조건",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r02",
        "WM-M21-R02",
        1,
        "ALG",
        "수와 연산",
        "소인수분해",
        "M1-NUM-PF",
        "소인수분해와 약수 구조",
        "lowered"
    ],
    [
        "wm-middle21-basic-entry-r02",
        "WM-M21-R02",
        2,
        "ALG",
        "수와 연산",
        "소인수분해",
        "M1-NUM-PF",
        "소인수분해와 약수 구조",
        "lowered"
    ],
    [
        "wm-middle21-basic-entry-r02",
        "WM-M21-R02",
        3,
        "ALG",
        "수와 연산",
        "소인수분해",
        "M1-NUM-PF",
        "소인수분해와 약수 구조",
        "lowered"
    ],
    [
        "wm-middle21-basic-entry-r02",
        "WM-M21-R02",
        4,
        "ALG",
        "수와 연산",
        "소인수분해",
        "M1-NUM-PF",
        "소인수분해와 약수 구조",
        "lowered"
    ],
    [
        "wm-middle21-basic-entry-r02",
        "WM-M21-R02",
        5,
        "ALG",
        "수와 연산",
        "소인수분해",
        "M1-NUM-PF",
        "소인수분해와 약수 구조",
        "lowered"
    ],
    [
        "wm-middle21-basic-entry-r02",
        "WM-M21-R02",
        6,
        "ALG",
        "수와 연산",
        "정수와 유리수",
        "M1-NUM-RAT",
        "절댓값·대소관계·혼합계산",
        "lowered"
    ],
    [
        "wm-middle21-basic-entry-r02",
        "WM-M21-R02",
        7,
        "ALG",
        "수와 연산",
        "정수와 유리수",
        "M1-NUM-RAT",
        "절댓값·대소관계·혼합계산",
        "lowered"
    ],
    [
        "wm-middle21-basic-entry-r02",
        "WM-M21-R02",
        8,
        "ALG",
        "수와 연산",
        "정수와 유리수",
        "M1-NUM-RAT",
        "절댓값·대소관계·혼합계산",
        "lowered"
    ],
    [
        "wm-middle21-basic-entry-r02",
        "WM-M21-R02",
        9,
        "ALG",
        "문자와 식",
        "일차방정식의 활용",
        "M1-ALG-EQAPP",
        "거리·비율·수량 관계의 방정식",
        "lowered"
    ],
    [
        "wm-middle21-basic-entry-r02",
        "WM-M21-R02",
        10,
        "ALG",
        "문자와 식",
        "일차방정식의 활용",
        "M1-ALG-EQAPP",
        "거리·비율·수량 관계의 방정식",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r02",
        "WM-M21-R02",
        11,
        "ALG",
        "문자와 식",
        "일차방정식의 활용",
        "M1-ALG-EQAPP",
        "거리·비율·수량 관계의 방정식",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r02",
        "WM-M21-R02",
        12,
        "ALG",
        "문자와 식",
        "일차방정식의 활용",
        "M1-ALG-EQAPP",
        "거리·비율·수량 관계의 방정식",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r02",
        "WM-M21-R02",
        13,
        "ALG",
        "문자와 식",
        "일차방정식의 활용",
        "M1-ALG-EQAPP",
        "거리·비율·수량 관계의 방정식",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r02",
        "WM-M21-R02",
        14,
        "ALG",
        "문자와 식",
        "일차방정식의 활용",
        "M1-ALG-EQAPP",
        "거리·비율·수량 관계의 방정식",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r02",
        "WM-M21-R02",
        15,
        "ALG",
        "문자와 식",
        "일차방정식",
        "M1-ALG-EQ",
        "일차방정식과 해의 조건",
        "lowered"
    ],
    [
        "wm-middle21-basic-entry-r02",
        "WM-M21-R02",
        16,
        "ALG",
        "좌표평면과 그래프",
        "좌표와 정비례·반비례",
        "M1-FUN-GRAPH",
        "좌표·그래프·관계식 해석",
        "lowered"
    ],
    [
        "wm-middle21-basic-entry-r02",
        "WM-M21-R02",
        17,
        "ALG",
        "좌표평면과 그래프",
        "좌표와 정비례·반비례",
        "M1-FUN-GRAPH",
        "좌표·그래프·관계식 해석",
        "lowered"
    ],
    [
        "wm-middle21-basic-entry-r02",
        "WM-M21-R02",
        18,
        "ALG",
        "좌표평면과 그래프",
        "좌표와 정비례·반비례",
        "M1-FUN-GRAPH",
        "좌표·그래프·관계식 해석",
        "lowered"
    ],
    [
        "wm-middle21-basic-entry-r02",
        "WM-M21-R02",
        19,
        "ALG",
        "좌표평면과 그래프",
        "좌표와 정비례·반비례",
        "M1-FUN-GRAPH",
        "좌표·그래프·관계식 해석",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r02",
        "WM-M21-R02",
        20,
        "ALG",
        "좌표평면과 그래프",
        "좌표와 정비례·반비례",
        "M1-FUN-GRAPH",
        "좌표·그래프·관계식 해석",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r02",
        "WM-M21-R02",
        21,
        "GEO",
        "기본 도형",
        "점·선·면과 각",
        "M1-GEO-BASIC",
        "위치 관계와 각의 계산",
        "lowered"
    ],
    [
        "wm-middle21-basic-entry-r02",
        "WM-M21-R02",
        22,
        "GEO",
        "기본 도형",
        "점·선·면과 각",
        "M1-GEO-BASIC",
        "위치 관계와 각의 계산",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r02",
        "WM-M21-R02",
        23,
        "GEO",
        "기본 도형",
        "점·선·면과 각",
        "M1-GEO-BASIC",
        "위치 관계와 각의 계산",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r02",
        "WM-M21-R02",
        24,
        "GEO",
        "기본 도형",
        "점·선·면과 각",
        "M1-GEO-BASIC",
        "위치 관계와 각의 계산",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r02",
        "WM-M21-R02",
        25,
        "GEO",
        "기본 도형",
        "점·선·면과 각",
        "M1-GEO-BASIC",
        "위치 관계와 각의 계산",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r02",
        "WM-M21-R02",
        26,
        "GEO",
        "평면도형",
        "원과 부채꼴",
        "M1-GEO-CIRCLE",
        "부채꼴의 호·넓이와 복합 도형",
        "lowered"
    ],
    [
        "wm-middle21-basic-entry-r02",
        "WM-M21-R02",
        27,
        "GEO",
        "평면도형",
        "원과 부채꼴",
        "M1-GEO-CIRCLE",
        "부채꼴의 호·넓이와 복합 도형",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r02",
        "WM-M21-R02",
        28,
        "GEO",
        "평면도형",
        "원과 부채꼴",
        "M1-GEO-CIRCLE",
        "부채꼴의 호·넓이와 복합 도형",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r02",
        "WM-M21-R02",
        29,
        "GEO",
        "평면도형",
        "원과 부채꼴",
        "M1-GEO-CIRCLE",
        "부채꼴의 호·넓이와 복합 도형",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r02",
        "WM-M21-R02",
        30,
        "GEO",
        "입체도형",
        "겉넓이와 부피",
        "M1-GEO-MEASURE",
        "겉넓이·부피와 복합 조건",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r02",
        "WM-M21-R02",
        31,
        "GEO",
        "평면도형",
        "다각형",
        "M1-GEO-POLY",
        "다각형의 각과 대각선",
        "lowered"
    ],
    [
        "wm-middle21-basic-entry-r02",
        "WM-M21-R02",
        32,
        "GEO",
        "평면도형",
        "다각형",
        "M1-GEO-POLY",
        "다각형의 각과 대각선",
        "lowered"
    ],
    [
        "wm-middle21-basic-entry-r02",
        "WM-M21-R02",
        33,
        "GEO",
        "평면도형",
        "다각형",
        "M1-GEO-POLY",
        "다각형의 각과 대각선",
        "lowered"
    ],
    [
        "wm-middle21-basic-entry-r02",
        "WM-M21-R02",
        34,
        "GEO",
        "평면도형",
        "다각형",
        "M1-GEO-POLY",
        "다각형의 각과 대각선",
        "lowered"
    ],
    [
        "wm-middle21-basic-entry-r02",
        "WM-M21-R02",
        35,
        "GEO",
        "평면도형",
        "다각형",
        "M1-GEO-POLY",
        "다각형의 각과 대각선",
        "lowered"
    ],
    [
        "wm-middle21-basic-entry-r02",
        "WM-M21-R02",
        36,
        "GEO",
        "평면도형",
        "다각형",
        "M1-GEO-POLY",
        "다각형의 각과 대각선",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r02",
        "WM-M21-R02",
        37,
        "GEO",
        "평면도형",
        "다각형",
        "M1-GEO-POLY",
        "다각형의 각과 대각선",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r02",
        "WM-M21-R02",
        38,
        "GEO",
        "입체도형",
        "다면체와 회전체",
        "M1-GEO-SOLID",
        "다면체·회전체의 구성과 단면",
        "lowered"
    ],
    [
        "wm-middle21-basic-entry-r02",
        "WM-M21-R02",
        39,
        "GEO",
        "입체도형",
        "다면체와 회전체",
        "M1-GEO-SOLID",
        "다면체·회전체의 구성과 단면",
        "lowered"
    ],
    [
        "wm-middle21-basic-entry-r02",
        "WM-M21-R02",
        40,
        "GEO",
        "입체도형",
        "다면체와 회전체",
        "M1-GEO-SOLID",
        "다면체·회전체의 구성과 단면",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r03",
        "WM-M21-R03",
        1,
        "ALG",
        "수와 연산",
        "소인수분해",
        "M1-NUM-PF",
        "소인수분해와 약수 구조",
        "lowered"
    ],
    [
        "wm-middle21-basic-entry-r03",
        "WM-M21-R03",
        2,
        "ALG",
        "수와 연산",
        "소인수분해",
        "M1-NUM-PF",
        "소인수분해와 약수 구조",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r03",
        "WM-M21-R03",
        3,
        "ALG",
        "수와 연산",
        "소인수분해",
        "M1-NUM-PF",
        "소인수분해와 약수 구조",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r03",
        "WM-M21-R03",
        4,
        "ALG",
        "수와 연산",
        "소인수분해",
        "M1-NUM-PF",
        "소인수분해와 약수 구조",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r03",
        "WM-M21-R03",
        5,
        "ALG",
        "수와 연산",
        "소인수분해",
        "M1-NUM-PF",
        "소인수분해와 약수 구조",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r03",
        "WM-M21-R03",
        6,
        "ALG",
        "수와 연산",
        "정수와 유리수",
        "M1-NUM-RAT",
        "절댓값·대소관계·혼합계산",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r03",
        "WM-M21-R03",
        7,
        "ALG",
        "수와 연산",
        "정수와 유리수",
        "M1-NUM-RAT",
        "절댓값·대소관계·혼합계산",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r03",
        "WM-M21-R03",
        8,
        "ALG",
        "수와 연산",
        "정수와 유리수",
        "M1-NUM-RAT",
        "절댓값·대소관계·혼합계산",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r03",
        "WM-M21-R03",
        9,
        "ALG",
        "문자와 식",
        "일차방정식의 활용",
        "M1-ALG-EQAPP",
        "거리·비율·수량 관계의 방정식",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r03",
        "WM-M21-R03",
        10,
        "ALG",
        "문자와 식",
        "일차방정식의 활용",
        "M1-ALG-EQAPP",
        "거리·비율·수량 관계의 방정식",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r03",
        "WM-M21-R03",
        11,
        "ALG",
        "문자와 식",
        "일차방정식의 활용",
        "M1-ALG-EQAPP",
        "거리·비율·수량 관계의 방정식",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r03",
        "WM-M21-R03",
        12,
        "ALG",
        "문자와 식",
        "일차방정식의 활용",
        "M1-ALG-EQAPP",
        "거리·비율·수량 관계의 방정식",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r03",
        "WM-M21-R03",
        13,
        "ALG",
        "문자와 식",
        "일차방정식의 활용",
        "M1-ALG-EQAPP",
        "거리·비율·수량 관계의 방정식",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r03",
        "WM-M21-R03",
        14,
        "ALG",
        "문자와 식",
        "일차방정식",
        "M1-ALG-EQ",
        "일차방정식과 해의 조건",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r03",
        "WM-M21-R03",
        15,
        "ALG",
        "문자와 식",
        "일차방정식",
        "M1-ALG-EQ",
        "일차방정식과 해의 조건",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r03",
        "WM-M21-R03",
        16,
        "ALG",
        "좌표평면과 그래프",
        "좌표와 정비례·반비례",
        "M1-FUN-GRAPH",
        "좌표·그래프·관계식 해석",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r03",
        "WM-M21-R03",
        17,
        "ALG",
        "좌표평면과 그래프",
        "좌표와 정비례·반비례",
        "M1-FUN-GRAPH",
        "좌표·그래프·관계식 해석",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r03",
        "WM-M21-R03",
        18,
        "ALG",
        "좌표평면과 그래프",
        "좌표와 정비례·반비례",
        "M1-FUN-GRAPH",
        "좌표·그래프·관계식 해석",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r03",
        "WM-M21-R03",
        19,
        "ALG",
        "좌표평면과 그래프",
        "좌표와 정비례·반비례",
        "M1-FUN-GRAPH",
        "좌표·그래프·관계식 해석",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r03",
        "WM-M21-R03",
        20,
        "ALG",
        "좌표평면과 그래프",
        "좌표와 정비례·반비례",
        "M1-FUN-GRAPH",
        "좌표·그래프·관계식 해석",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r03",
        "WM-M21-R03",
        21,
        "GEO",
        "기본 도형",
        "점·선·면과 각",
        "M1-GEO-BASIC",
        "위치 관계와 각의 계산",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r03",
        "WM-M21-R03",
        22,
        "GEO",
        "기본 도형",
        "점·선·면과 각",
        "M1-GEO-BASIC",
        "위치 관계와 각의 계산",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r03",
        "WM-M21-R03",
        23,
        "GEO",
        "기본 도형",
        "점·선·면과 각",
        "M1-GEO-BASIC",
        "위치 관계와 각의 계산",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r03",
        "WM-M21-R03",
        24,
        "GEO",
        "기본 도형",
        "점·선·면과 각",
        "M1-GEO-BASIC",
        "위치 관계와 각의 계산",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r03",
        "WM-M21-R03",
        25,
        "GEO",
        "평면도형",
        "원과 부채꼴",
        "M1-GEO-CIRCLE",
        "부채꼴의 호·넓이와 복합 도형",
        "lowered"
    ],
    [
        "wm-middle21-basic-entry-r03",
        "WM-M21-R03",
        26,
        "GEO",
        "평면도형",
        "원과 부채꼴",
        "M1-GEO-CIRCLE",
        "부채꼴의 호·넓이와 복합 도형",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r03",
        "WM-M21-R03",
        27,
        "GEO",
        "평면도형",
        "원과 부채꼴",
        "M1-GEO-CIRCLE",
        "부채꼴의 호·넓이와 복합 도형",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r03",
        "WM-M21-R03",
        28,
        "GEO",
        "평면도형",
        "원과 부채꼴",
        "M1-GEO-CIRCLE",
        "부채꼴의 호·넓이와 복합 도형",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r03",
        "WM-M21-R03",
        29,
        "GEO",
        "기본 도형",
        "작도와 합동",
        "M1-GEO-CONG",
        "작도 조건과 삼각형의 합동",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r03",
        "WM-M21-R03",
        30,
        "GEO",
        "입체도형",
        "겉넓이와 부피",
        "M1-GEO-MEASURE",
        "겉넓이·부피와 복합 조건",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r03",
        "WM-M21-R03",
        31,
        "GEO",
        "입체도형",
        "겉넓이와 부피",
        "M1-GEO-MEASURE",
        "겉넓이·부피와 복합 조건",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r03",
        "WM-M21-R03",
        32,
        "GEO",
        "평면도형",
        "다각형",
        "M1-GEO-POLY",
        "다각형의 각과 대각선",
        "lowered"
    ],
    [
        "wm-middle21-basic-entry-r03",
        "WM-M21-R03",
        33,
        "GEO",
        "평면도형",
        "다각형",
        "M1-GEO-POLY",
        "다각형의 각과 대각선",
        "lowered"
    ],
    [
        "wm-middle21-basic-entry-r03",
        "WM-M21-R03",
        34,
        "GEO",
        "평면도형",
        "다각형",
        "M1-GEO-POLY",
        "다각형의 각과 대각선",
        "lowered"
    ],
    [
        "wm-middle21-basic-entry-r03",
        "WM-M21-R03",
        35,
        "GEO",
        "평면도형",
        "다각형",
        "M1-GEO-POLY",
        "다각형의 각과 대각선",
        "lowered"
    ],
    [
        "wm-middle21-basic-entry-r03",
        "WM-M21-R03",
        36,
        "GEO",
        "평면도형",
        "다각형",
        "M1-GEO-POLY",
        "다각형의 각과 대각선",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r03",
        "WM-M21-R03",
        37,
        "GEO",
        "평면도형",
        "다각형",
        "M1-GEO-POLY",
        "다각형의 각과 대각선",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r03",
        "WM-M21-R03",
        38,
        "GEO",
        "평면도형",
        "다각형",
        "M1-GEO-POLY",
        "다각형의 각과 대각선",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r03",
        "WM-M21-R03",
        39,
        "GEO",
        "입체도형",
        "다면체와 회전체",
        "M1-GEO-SOLID",
        "다면체·회전체의 구성과 단면",
        "lowered"
    ],
    [
        "wm-middle21-basic-entry-r03",
        "WM-M21-R03",
        40,
        "GEO",
        "입체도형",
        "다면체와 회전체",
        "M1-GEO-SOLID",
        "다면체·회전체의 구성과 단면",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r04",
        "WM-M21-R04",
        1,
        "ALG",
        "수와 연산",
        "소인수분해",
        "M1-NUM-PF",
        "소인수분해와 약수 구조",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r04",
        "WM-M21-R04",
        2,
        "ALG",
        "수와 연산",
        "소인수분해",
        "M1-NUM-PF",
        "소인수분해와 약수 구조",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r04",
        "WM-M21-R04",
        3,
        "ALG",
        "수와 연산",
        "소인수분해",
        "M1-NUM-PF",
        "소인수분해와 약수 구조",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r04",
        "WM-M21-R04",
        4,
        "ALG",
        "수와 연산",
        "소인수분해",
        "M1-NUM-PF",
        "소인수분해와 약수 구조",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r04",
        "WM-M21-R04",
        5,
        "ALG",
        "수와 연산",
        "소인수분해",
        "M1-NUM-PF",
        "소인수분해와 약수 구조",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r04",
        "WM-M21-R04",
        6,
        "ALG",
        "수와 연산",
        "정수와 유리수",
        "M1-NUM-RAT",
        "절댓값·대소관계·혼합계산",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r04",
        "WM-M21-R04",
        7,
        "ALG",
        "수와 연산",
        "정수와 유리수",
        "M1-NUM-RAT",
        "절댓값·대소관계·혼합계산",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r04",
        "WM-M21-R04",
        8,
        "ALG",
        "수와 연산",
        "정수와 유리수",
        "M1-NUM-RAT",
        "절댓값·대소관계·혼합계산",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r04",
        "WM-M21-R04",
        9,
        "ALG",
        "문자와 식",
        "일차방정식의 활용",
        "M1-ALG-EQAPP",
        "거리·비율·수량 관계의 방정식",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r04",
        "WM-M21-R04",
        10,
        "ALG",
        "문자와 식",
        "일차방정식의 활용",
        "M1-ALG-EQAPP",
        "거리·비율·수량 관계의 방정식",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r04",
        "WM-M21-R04",
        11,
        "ALG",
        "문자와 식",
        "일차방정식의 활용",
        "M1-ALG-EQAPP",
        "거리·비율·수량 관계의 방정식",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r04",
        "WM-M21-R04",
        12,
        "ALG",
        "문자와 식",
        "일차방정식의 활용",
        "M1-ALG-EQAPP",
        "거리·비율·수량 관계의 방정식",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r04",
        "WM-M21-R04",
        13,
        "ALG",
        "문자와 식",
        "일차방정식의 활용",
        "M1-ALG-EQAPP",
        "거리·비율·수량 관계의 방정식",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r04",
        "WM-M21-R04",
        14,
        "ALG",
        "문자와 식",
        "일차방정식",
        "M1-ALG-EQ",
        "일차방정식과 해의 조건",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r04",
        "WM-M21-R04",
        15,
        "ALG",
        "문자와 식",
        "일차방정식",
        "M1-ALG-EQ",
        "일차방정식과 해의 조건",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r04",
        "WM-M21-R04",
        16,
        "ALG",
        "좌표평면과 그래프",
        "좌표와 정비례·반비례",
        "M1-FUN-GRAPH",
        "좌표·그래프·관계식 해석",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r04",
        "WM-M21-R04",
        17,
        "ALG",
        "좌표평면과 그래프",
        "좌표와 정비례·반비례",
        "M1-FUN-GRAPH",
        "좌표·그래프·관계식 해석",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r04",
        "WM-M21-R04",
        18,
        "ALG",
        "좌표평면과 그래프",
        "좌표와 정비례·반비례",
        "M1-FUN-GRAPH",
        "좌표·그래프·관계식 해석",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r04",
        "WM-M21-R04",
        19,
        "ALG",
        "좌표평면과 그래프",
        "좌표와 정비례·반비례",
        "M1-FUN-GRAPH",
        "좌표·그래프·관계식 해석",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r04",
        "WM-M21-R04",
        20,
        "ALG",
        "좌표평면과 그래프",
        "좌표와 정비례·반비례",
        "M1-FUN-GRAPH",
        "좌표·그래프·관계식 해석",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r04",
        "WM-M21-R04",
        21,
        "GEO",
        "기본 도형",
        "점·선·면과 각",
        "M1-GEO-BASIC",
        "위치 관계와 각의 계산",
        "lowered"
    ],
    [
        "wm-middle21-basic-entry-r04",
        "WM-M21-R04",
        22,
        "GEO",
        "기본 도형",
        "점·선·면과 각",
        "M1-GEO-BASIC",
        "위치 관계와 각의 계산",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r04",
        "WM-M21-R04",
        23,
        "GEO",
        "기본 도형",
        "점·선·면과 각",
        "M1-GEO-BASIC",
        "위치 관계와 각의 계산",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r04",
        "WM-M21-R04",
        24,
        "GEO",
        "기본 도형",
        "점·선·면과 각",
        "M1-GEO-BASIC",
        "위치 관계와 각의 계산",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r04",
        "WM-M21-R04",
        25,
        "GEO",
        "기본 도형",
        "점·선·면과 각",
        "M1-GEO-BASIC",
        "위치 관계와 각의 계산",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r04",
        "WM-M21-R04",
        26,
        "GEO",
        "평면도형",
        "원과 부채꼴",
        "M1-GEO-CIRCLE",
        "부채꼴의 호·넓이와 복합 도형",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r04",
        "WM-M21-R04",
        27,
        "GEO",
        "평면도형",
        "원과 부채꼴",
        "M1-GEO-CIRCLE",
        "부채꼴의 호·넓이와 복합 도형",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r04",
        "WM-M21-R04",
        28,
        "GEO",
        "평면도형",
        "원과 부채꼴",
        "M1-GEO-CIRCLE",
        "부채꼴의 호·넓이와 복합 도형",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r04",
        "WM-M21-R04",
        29,
        "GEO",
        "기본 도형",
        "작도와 합동",
        "M1-GEO-CONG",
        "작도 조건과 삼각형의 합동",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r04",
        "WM-M21-R04",
        30,
        "GEO",
        "입체도형",
        "겉넓이와 부피",
        "M1-GEO-MEASURE",
        "겉넓이·부피와 복합 조건",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r04",
        "WM-M21-R04",
        31,
        "GEO",
        "입체도형",
        "겉넓이와 부피",
        "M1-GEO-MEASURE",
        "겉넓이·부피와 복합 조건",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r04",
        "WM-M21-R04",
        32,
        "GEO",
        "평면도형",
        "다각형",
        "M1-GEO-POLY",
        "다각형의 각과 대각선",
        "lowered"
    ],
    [
        "wm-middle21-basic-entry-r04",
        "WM-M21-R04",
        33,
        "GEO",
        "평면도형",
        "다각형",
        "M1-GEO-POLY",
        "다각형의 각과 대각선",
        "lowered"
    ],
    [
        "wm-middle21-basic-entry-r04",
        "WM-M21-R04",
        34,
        "GEO",
        "평면도형",
        "다각형",
        "M1-GEO-POLY",
        "다각형의 각과 대각선",
        "lowered"
    ],
    [
        "wm-middle21-basic-entry-r04",
        "WM-M21-R04",
        35,
        "GEO",
        "평면도형",
        "다각형",
        "M1-GEO-POLY",
        "다각형의 각과 대각선",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r04",
        "WM-M21-R04",
        36,
        "GEO",
        "평면도형",
        "다각형",
        "M1-GEO-POLY",
        "다각형의 각과 대각선",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r04",
        "WM-M21-R04",
        37,
        "GEO",
        "평면도형",
        "다각형",
        "M1-GEO-POLY",
        "다각형의 각과 대각선",
        "raised"
    ],
    [
        "wm-middle21-basic-entry-r04",
        "WM-M21-R04",
        38,
        "GEO",
        "입체도형",
        "다면체와 회전체",
        "M1-GEO-SOLID",
        "다면체·회전체의 구성과 단면",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r04",
        "WM-M21-R04",
        39,
        "GEO",
        "입체도형",
        "다면체와 회전체",
        "M1-GEO-SOLID",
        "다면체·회전체의 구성과 단면",
        "standard"
    ],
    [
        "wm-middle21-basic-entry-r04",
        "WM-M21-R04",
        40,
        "GEO",
        "입체도형",
        "다면체와 회전체",
        "M1-GEO-SOLID",
        "다면체·회전체의 구성과 단면",
        "standard"
    ]
]);

  const FORBIDDEN_DATA_KEYS = Object.freeze([
    "answer", "answers", "answerSpec", "answerKey", "correctAnswer", "solution", "explanation",
    "questionText", "prompt", "bookId", "sourceItemNumber", "sourcePath", "filePath", "pdfUrl",
    "downloadUrl", "storageUrl", "sourcePage", "sourceLocator", "fingerprint", "hash", "url", "uri"
  ]);
  const PRIVATE_LOCATION_PATTERN = /(?:^[A-Za-z]:[\\/]|file:\/\/|\\\\|\\.pdf(?:$|[?#])|\\.hwp(?:$|[?#]))/i;

  function freezeItem(row) {
    const examId = row[0], roundCode = row[1], number = row[2], sectionId = row[3];
    const majorUnit = row[4], minorUnit = row[5], typeId = row[6], detailType = row[7], difficulty = row[8];
    const suffix = String(number).padStart(2, "0");
    const semester = sectionId === "ALG" ? "1학기" : "2학기";
    return Object.freeze({
      id: core.createNeutralId("question", MODE, `diagnostic:${roundCode.toLowerCase()}:item:${suffix}`),
      examId,
      roundCode,
      number,
      points: 1,
      domainId: core.createNeutralId("type", MODE, `diagnostic:domain:${sectionId}`),
      domain: SECTION_LABELS[sectionId],
      gradeBand: "중1",
      semester,
      majorUnit,
      minorUnit,
      gradeSemesterUnit: ["중1", semester, majorUnit, minorUnit].join(" · "),
      detailTypeId: core.createNeutralId("type", MODE, `diagnostic:type:${typeId}`),
      detailType,
      difficulty,
      difficultyLabel: DIFFICULTY_LABELS[difficulty],
      cutlineSectionId: sectionId,
      reviewStatus: "verified",
      classificationStatus: "verified",
      difficultyStatus: "verified",
      classificationEvidence: Object.freeze([
        core.createNeutralId("policy", MODE, `diagnostic:${roundCode.toLowerCase()}:item:${suffix}:curriculum-evidence`),
        core.createNeutralId("policy", MODE, `diagnostic:${roundCode.toLowerCase()}:item:${suffix}:difficulty-evidence`)
      ])
    });
  }

  const allItems = Object.freeze(ROWS.map(freezeItem));
  const rounds = Object.freeze(Object.fromEntries(Array.from({ length: 4 }, function (_, index) {
    const examId = `wm-middle21-basic-entry-r${String(index + 1).padStart(2, "0")}`;
    const items = Object.freeze(allItems.filter(function (item) { return item.examId === examId; }));
    return [examId, Object.freeze({
      id: core.createNeutralId("policy", MODE, `diagnostic:${examId}:metadata:v1`),
      examId,
      roundCode: `WM-M21-R${String(index + 1).padStart(2, "0")}`,
      version: "1.0.0",
      pointPolicy: POINT_POLICY,
      items
    })];
  })));

  function inspectPublicData(value, location, issues) {
    if (typeof value === "string") {
      if (PRIVATE_LOCATION_PATTERN.test(value)) issues.push(`${location}.private_location`);
      return;
    }
    if (!value || typeof value !== "object") return;
    Object.keys(value).forEach(function (key) {
      if (FORBIDDEN_DATA_KEYS.includes(key)) issues.push(`${location}.${key}.forbidden`);
      inspectPublicData(value[key], `${location}.${key}`, issues);
    });
  }

  function validate() {
    const issues = [];
    if (allItems.length !== 160) issues.push("metadata.item_count");
    Object.values(rounds).forEach(function (round) {
      if (round.items.length !== 40) issues.push(`${round.examId}.item_count`);
      const ids = new Set();
      round.items.forEach(function (item, index) {
        const prefix = `${round.examId}.item.${index + 1}`;
        if (item.number !== index + 1) issues.push(`${prefix}.number`);
        if (!core.isNeutralId(item.id, "question", MODE) || ids.has(item.id)) issues.push(`${prefix}.id`);
        ids.add(item.id);
        if (!SECTION_LABELS[item.cutlineSectionId] || item.domain !== SECTION_LABELS[item.cutlineSectionId]) issues.push(`${prefix}.section`);
        if (item.number <= 20 && item.cutlineSectionId !== "ALG") issues.push(`${prefix}.algebra_order`);
        if (item.number > 20 && item.cutlineSectionId !== "GEO") issues.push(`${prefix}.geometry_order`);
        if (!DIFFICULTY_BANDS.includes(item.difficulty)) issues.push(`${prefix}.difficulty`);
        if (item.points !== 1 || item.reviewStatus !== "verified" || item.classificationStatus !== "verified") issues.push(`${prefix}.verification`);
        if (!Array.isArray(item.classificationEvidence) || item.classificationEvidence.length !== 2) issues.push(`${prefix}.evidence`);
      });
    });
    inspectPublicData({ mode: MODE, pointPolicy: POINT_POLICY, rounds }, "metadata", issues);
    return Object.freeze(Array.from(new Set(issues)).sort());
  }

  function reportMetadataFor(examId, number) {
    const round = rounds[examId];
    if (!round) throw new RangeError("exam id is out of range");
    if (!Number.isSafeInteger(number) || number < 1 || number > round.items.length) throw new RangeError("question number is out of range");
    const item = round.items[number - 1];
    return Object.freeze({
      number: item.number,
      points: item.points,
      domain: item.domain,
      gradeBand: item.gradeBand,
      semester: item.semester,
      majorUnit: item.majorUnit,
      minorUnit: item.minorUnit,
      gradeSemesterUnit: item.gradeSemesterUnit,
      detailType: item.detailType,
      difficulty: item.difficulty,
      cutlineSectionId: item.cutlineSectionId,
      reviewStatus: item.reviewStatus,
      classificationStatus: item.classificationStatus,
      classificationEvidence: item.classificationEvidence
    });
  }

  return Object.freeze({
    MODE,
    DIFFICULTY_BANDS,
    DIFFICULTY_LABELS,
    SECTION_LABELS,
    POINT_POLICY,
    FORBIDDEN_DATA_KEYS,
    allItems,
    rounds,
    reportMetadataFor,
    validate
  });
});
