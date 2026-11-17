(function (root) {
  "use strict";
  // GFIELD-authored AMC 10-scope practice form. It is not an official contest form or a calibrated score scale.
  const items = [
    { id:"amc10-m01", standard:"대수", focus:"관계식 세우기", prompt:"두 수의 합은 34이고 큰 수는 작은 수의 3배보다 2만큼 작습니다. 큰 수는 얼마인가요?", choices:[24,25,26,27,28], answer:1, solution:"작은 수를 x라 하면 큰 수는 3x−2입니다. x+(3x−2)=34이므로 x=9, 큰 수는 3·9−2=25입니다." },
    { id:"amc10-m02", standard:"기하", focus:"밑변과 높이의 넓이 비", prompt:"밑변이 같은 두 삼각형의 높이가 4와 7입니다. 작은 삼각형의 넓이가 18이면 큰 삼각형의 넓이는 얼마인가요?", choices:[24,28,30,31.5,36], answer:3, solution:"밑변이 같으면 삼각형의 넓이는 높이에 비례합니다. 큰 넓이는 18×7/4=31.5입니다." },
    { id:"amc10-m03", standard:"기하", focus:"삼각형 부등식과 정수 경우 나누기", prompt:"양의 정수 변을 가진 이등변삼각형의 가장 긴 변의 길이가 20입니다. 넓이가 0보다 큰 삼각형은 모두 몇 개인가요?", choices:[20,28,29,30,39], answer:2, solution:"삼각형의 성립 조건과 이등변 조건으로 나눕니다. 두 긴 변이 모두 20인 경우 세 번째 변은 1부터 20까지라 20개입니다. 20이 유일한 가장 긴 변이면 같은 두 변의 길이 s는 11부터 19까지여야 하므로 9개입니다. 합은 29개입니다." },
    { id:"amc10-m04", standard:"경우의 수", focus:"끝자리 조건과 순열", prompt:"숫자 1, 2, 3, 4, 5를 중복 없이 사용해 네 자리 짝수를 만들려고 합니다. 만들 수 있는 수는 몇 개인가요?", choices:[36,40,48,54,60], answer:2, solution:"끝자리는 2 또는 4로 2가지입니다. 앞의 세 자리는 남은 네 숫자 중 세 개를 순서 있게 고르므로 4×3×2가지입니다. 모두 2×4×3×2=48개입니다." },
    { id:"amc10-m05", standard:"확률", focus:"두 주사위의 합", prompt:"공정한 주사위 두 개를 던집니다. 눈의 합이 9일 확률은 얼마인가요?", choices:["1/12","1/9","1/8","1/6","1/4"], answer:1, solution:"가능한 순서쌍은 36가지입니다. 합이 9인 경우는 (3,6),(4,5),(5,4),(6,3)의 4가지이므로 확률은 4/36=1/9입니다." },
    { id:"amc10-m06", standard:"대수", focus:"백분율 혼합 모델", prompt:"12리터의 음료는 농축액이 25%입니다. 농축액만 더해 농축액 비율을 40%로 만들려면 농축액을 몇 리터 더 넣어야 하나요?", choices:[1,2,3,4,6], answer:2, solution:"처음 농축액은 12×0.25=3리터입니다. x리터를 더하면 (3+x)/(12+x)=0.4입니다. 3+x=4.8+0.4x이므로 x=3입니다." },
    { id:"amc10-m07", standard:"기하", focus:"직각삼각형의 높이", prompt:"직각삼각형에서 빗변에 내린 높이가 빗변을 길이 4와 9인 두 부분으로 나눕니다. 높이의 길이는 얼마인가요?", choices:[4,5,6,7,8], answer:2, solution:"빗변에 내린 높이의 제곱은 빗변의 두 부분 길이의 곱입니다. h²=4×9=36이므로 h=6입니다." },
    { id:"amc10-m08", standard:"정수론", focus:"동시 나머지 조건", prompt:"양의 정수 n을 3으로 나누면 나머지가 1, 5로 나누면 2, 7로 나누면 3입니다. 가장 작은 n은 얼마인가요?", choices:[37,47,52,57,67], answer:2, solution:"5로 나누어 2가 남는 수 가운데 7로 나누어 3이 남는 수를 찾으면 17, 52, …입니다. 17은 3으로 나누어 2가 남고, 52는 1이 남으므로 가장 작은 n은 52입니다." },
    { id:"amc10-m09", standard:"경우의 수", focus:"0을 포함한 네 자리 짝수", prompt:"숫자 0, 1, 2, 3, 4, 5 중 서로 다른 네 숫자로 만들 수 있는 네 자리 짝수는 몇 개인가요?", choices:[120,144,156,168,180], answer:2, solution:"끝자리가 0이면 첫 자리는 1–5 중 5가지, 가운데 두 자리는 4×3가지라 60개입니다. 끝자리가 2 또는 4이면 첫 자리는 0이 아닌 4가지, 가운데 두 자리는 4×3가지라 각각 48개입니다. 합은 60+48+48=156개입니다." },
    { id:"amc10-m10", standard:"확률", focus:"비복원 추출과 조합", prompt:"빨간 구슬 4개와 파란 구슬 3개 중 3개를 한꺼번에 고릅니다. 빨간 구슬이 정확히 2개일 확률은 얼마인가요?", choices:["1/3","2/5","18/35","3/5","2/3"], answer:2, solution:"유리한 선택은 빨간 구슬 4개 중 2개와 파란 구슬 3개 중 1개를 고르는 경우로 C(4,2)C(3,1)=18가지입니다. 전체는 C(7,3)=35가지이므로 확률은 18/35입니다." },
    { id:"amc10-m11", standard:"대수", focus:"대칭식 정리", prompt:"a+b=11, ab=24일 때 (a−2)(b−2)는 얼마인가요?", choices:[2,4,6,8,10], answer:2, solution:"(a−2)(b−2)=ab−2(a+b)+4입니다. 주어진 값을 대입하면 24−22+4=6입니다." },
    { id:"amc10-m12", standard:"기하", focus:"원의 현과 수직이등분", prompt:"반지름이 13인 원에서 중심과 현 사이의 거리가 5입니다. 현의 길이는 얼마인가요?", choices:[20,22,24,26,28], answer:2, solution:"중심에서 현에 내린 수선은 현을 이등분합니다. 반쪽 길이를 x라 하면 x²+5²=13²이므로 x=12입니다. 현의 길이는 24입니다." },
    { id:"amc10-m13", standard:"정수론", focus:"소인수 지수와 약수", prompt:"2⁵×3⁴의 양의 약수 중 24의 배수인 것은 몇 개인가요?", choices:[8,10,12,14,16], answer:2, solution:"24=2³×3입니다. 약수에서 2의 지수는 3, 4, 5의 세 가지이고 3의 지수는 1부터 4까지 네 가지입니다. 모두 3×4=12개입니다." },
    { id:"amc10-m14", standard:"경우의 수", focus:"격자 경로와 피하기", prompt:"격자에서 오른쪽 5번, 위쪽 3번 움직여 (5,3)에 갑니다. (2,1)을 지나지 않는 최단 경로는 몇 개인가요?", choices:[20,24,26,28,30], answer:2, solution:"전체 경로는 C(8,3)=56개입니다. (2,1)을 지나는 경로는 시작점에서 그 점까지 C(3,1)=3가지, 그 점에서 끝까지 C(5,2)=10가지라 30개입니다. 따라서 피하는 경로는 56−30=26개입니다." },
    { id:"amc10-m15", standard:"확률", focus:"홀수·짝수 경우 세기", prompt:"1부터 8까지의 정수 중 서로 다른 두 수를 균등하게 고릅니다. 두 수의 합이 홀수일 확률은 얼마인가요?", choices:["1/2","4/7","5/9","3/5","2/3"], answer:1, solution:"합이 홀수이려면 홀수 하나와 짝수 하나를 골라야 합니다. 4×4=16가지이고, 전체 쌍은 C(8,2)=28가지입니다. 확률은 16/28=4/7입니다." },
    { id:"amc10-m16", standard:"대수", focus:"역수의 거듭제곱", prompt:"x+1/x=3일 때 x⁴+1/x⁴의 값은 얼마인가요?", choices:[43,45,47,49,51], answer:2, solution:"먼저 제곱하면 x²+1/x²=3²−2=7입니다. 다시 제곱해 x⁴+1/x⁴=7²−2=47입니다." },
    { id:"amc10-m17", standard:"기하", focus:"헤론 공식", prompt:"세 변의 길이가 13, 14, 15인 삼각형의 넓이는 얼마인가요?", choices:[72,78,84,90,96], answer:2, solution:"반둘레는 21입니다. 헤론 공식으로 넓이는 √(21×8×7×6)=√7056=84입니다." },
    { id:"amc10-m18", standard:"정수론", focus:"거듭제곱과 중국인의 나머지", prompt:"3¹⁰⁰을 77로 나눈 나머지는 얼마인가요?", choices:[53,59,63,67,73], answer:3, solution:"법 7에서 3⁶≡1이므로 3¹⁰⁰≡3⁴≡4입니다. 법 11에서 3⁵≡1이므로 3¹⁰⁰≡1입니다. 77보다 작은 수 중 7로 나누어 4, 11로 나누어 1인 수는 67입니다." },
    { id:"amc10-m19", standard:"경우의 수", focus:"원형 배열과 이웃 조건", prompt:"서로 다른 6명이 원탁에 앉습니다. A와 B가 서로 이웃하지 않도록 앉는 방법은 몇 가지인가요? 회전해서 같아지는 배열은 같은 것으로 봅니다.", choices:[48,60,72,84,96], answer:2, solution:"원탁 전체 배열은 (6−1)!=120가지입니다. A와 B를 한 묶음으로 보면 원탁의 다섯 대상 배열은 4!가지이고, 묶음 안 순서는 2가지라 이웃하는 배열은 48가지입니다. 따라서 이웃하지 않는 배열은 120−48=72가지입니다." },
    { id:"amc10-m20", standard:"확률", focus:"조합으로 정확히 두 개 세기", prompt:"빨간 구슬 4개와 파란 구슬 5개 중 3개를 한꺼번에 고릅니다. 빨간 구슬이 정확히 2개일 확률은 얼마인가요?", choices:["1/3","5/14","3/7","2/5","1/2"], answer:1, solution:"유리한 선택은 C(4,2)C(5,1)=30가지입니다. 전체 선택은 C(9,3)=84가지이므로 확률은 30/84=5/14입니다." },
    { id:"amc10-m21", standard:"대수", focus:"치환과 실근 개수", prompt:"실수 x가 x²+1/x²=3을 만족합니다. 가능한 x의 개수는 몇 개인가요?", choices:[0,2,4,6,8], answer:2, solution:"x≠0이고, 양변에 x²을 곱하면 x⁴−3x²+1=0입니다. y=x²로 두면 y²−3y+1=0은 서로 다른 양의 근 두 개를 갖습니다. 각 y마다 x=±√y가 가능하므로 실근은 4개입니다." },
    { id:"amc10-m22", standard:"기하", focus:"둘레·대각선과 넓이", prompt:"직사각형의 둘레는 34이고 대각선 길이는 13입니다. 넓이는 얼마인가요?", choices:[48,54,60,64,66], answer:2, solution:"변을 a,b라 하면 a+b=17, a²+b²=169입니다. (a+b)²=a²+b²+2ab이므로 289=169+2ab, 따라서 넓이 ab=60입니다." },
    { id:"amc10-m23", standard:"정수론", focus:"제곱의 나머지와 주기", prompt:"1부터 100까지의 정수 n 중 n²−1이 24의 배수인 n은 몇 개인가요?", choices:[31,32,33,34,35], answer:2, solution:"n²−1이 8의 배수이려면 n은 홀수여야 합니다. 홀수의 제곱은 법 8에서 1입니다. 또 n²−1이 3의 배수이려면 n은 3의 배수가 아니어야 합니다. 1부터 100까지 홀수는 50개이고, 그중 홀수인 3의 배수는 17개이므로 50−17=33개입니다." },
    { id:"amc10-m24", standard:"경우의 수", focus:"서로 이웃하지 않는 선택", prompt:"일렬로 놓인 12개의 좌석 중 서로 이웃하지 않게 5자리를 고르는 방법은 몇 가지인가요?", choices:[42,48,56,60,66], answer:2, solution:"선택한 자리 번호를 a₁<…<a₅라 하고 bᵢ=aᵢ−(i−1)로 바꾸면 1부터 8까지에서 서로 다른 5개를 고르는 것과 같습니다. 따라서 C(8,5)=56가지입니다." },
    { id:"amc10-m25", standard:"확률", focus:"포함·배제와 여사건", prompt:"1부터 1000까지의 정수 중 하나를 균등하게 고릅니다. 2, 3, 5 중 어느 것으로도 나누어지지 않을 확률은 얼마인가요?", choices:["33/125","133/500","27/100","7/25","3/10"], answer:1, solution:"2, 3, 5의 배수 개수를 포함·배제로 셉니다. 나누어지는 수는 500+333+200−166−100−66+33=734개입니다. 나머지는 266개이므로 확률은 266/1000=133/500입니다." }
  ];
  const standards = Object.freeze(["대수", "정수론", "기하", "경우의 수", "확률"]);
  const gradeValue = Number(new URLSearchParams(typeof window !== "undefined" ? window.location.search : "").get("grade"));
  const grade = Number.isInteger(gradeValue) && gradeValue >= 7 && gradeValue <= 10 ? gradeValue : 7;
  const attemptParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const nextStudyParams = new URLSearchParams({ grade: String(grade) });
  ["domains", "sourceYear", "sourceForm", "sourceQuestions", "sourceConcepts"].forEach(function (key) {
    const value = attemptParams.get(key);
    if (value) nextStudyParams.set(key, value);
  });
  root.GFIELDAMC10Mock = Object.freeze({ id:"gfield-amc10-concept-mock-v1", formVersion:"2026-11-04-v4", grade, title:"지필드 AMC 10 범위 모의고사 · 1회", durationMinutes:75, standards,
    nextStudyHref:`./amc10-practice.html?${nextStudyParams.toString()}`, nextStudyLabel:"지필드 AMC 10 개념 연습으로 이어가기 →",
    items:Object.freeze(items.map(item => Object.freeze(item))) });
})(typeof window === "undefined" ? globalThis : window);
