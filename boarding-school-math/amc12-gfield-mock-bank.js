(function (root) {
  "use strict";

  // Original GFIELD-authored AMC 12-scope diagnostic. It is not an official contest form.
  const items = [
    { id: "amc12-gfield-m01", standard: "대수", focus: "근과 대칭식", prompt: "x² − 5x + 1 = 0의 한 근을 x라 할 때, x⁴ + 1/x⁴의 값은 얼마인가요?", choices: ["527", "521", "625", "523", "529"], answer: 0, solution: "방정식을 x로 나누면 x + 1/x = 5입니다. 양변을 제곱해 x² + 1/x² = 23을 얻고, 다시 제곱하면 x⁴ + 1/x⁴ = 23² − 2 = 527입니다." },
    { id: "amc12-gfield-m02", standard: "함수·삼각함수", focus: "이차함수의 최솟값", prompt: "실수 x에 대하여 x² − 4x + 8의 최솟값은 얼마인가요?", choices: ["2", "3", "4", "5", "8"], answer: 2, solution: "식을 (x − 2)² + 4로 완전제곱하면 됩니다. 제곱의 최솟값은 0이므로 최솟값은 4입니다." },
    { id: "amc12-gfield-m03", standard: "정수론", focus: "최대공약수와 최소공배수", prompt: "양의 정수 n이 gcd(n, 84)=12, lcm(n, 84)=420을 만족합니다. n은 얼마인가요?", choices: ["48", "54", "60", "66", "72"], answer: 2, solution: "두 양의 정수의 곱은 최대공약수와 최소공배수의 곱입니다. 84n=12×420이므로 n=60입니다. 실제로 gcd(60,84)=12, lcm(60,84)=420입니다." },
    { id: "amc12-gfield-m04", standard: "기하", focus: "원과 현", prompt: "반지름이 10인 원에서 중심으로부터 6만큼 떨어진 현의 길이는 얼마인가요?", choices: ["12", "14", "16", "18", "20"], answer: 2, solution: "중심에서 현에 내린 수선은 현을 이등분합니다. 반쪽 길이를 a라 하면 a² + 6² = 10²이므로 a=8입니다. 현의 길이는 2a=16입니다." },
    { id: "amc12-gfield-m05", standard: "경우의 수", focus: "순열과 짝수", prompt: "숫자 1, 2, 3, 4, 5를 한 번씩 사용해 다섯 자리 수를 만들 때 짝수는 몇 개 만들 수 있나요?", choices: ["24", "36", "48", "60", "72"], answer: 2, solution: "짝수가 되려면 끝자리가 2 또는 4여야 하므로 끝자리 선택은 2가지입니다. 나머지 네 자리는 4!가지로 배열합니다. 모두 2×4!=48개입니다." },
    { id: "amc12-gfield-m06", standard: "대수", focus: "유리식과 정의역", prompt: "x=5일 때 (x²−16)/(x−4) + (x²−9)/(x−3)의 값은 얼마인가요?", choices: ["12", "13", "14", "15", "17"], answer: 4, solution: "x²−16=(x−4)(x+4)이므로 첫째 항은 x+4=9입니다. 둘째 항은 x+3=8입니다. x=5는 두 원래 분모를 0으로 만들지 않으므로 합은 17입니다." },
    { id: "amc12-gfield-m07", standard: "함수·삼각함수", focus: "지수 방정식", prompt: "4^(x+1)=8^(x−1)을 만족하는 실수 x는 얼마인가요?", choices: ["1", "2", "3", "4", "5"], answer: 4, solution: "밑을 2로 통일하면 2^(2x+2)=2^(3x−3)입니다. 지수가 같으므로 2x+2=3x−3, 따라서 x=5입니다." },
    { id: "amc12-gfield-m08", standard: "정수론", focus: "합동식", prompt: "n을 5로 나누면 나머지가 2이고 7로 나누면 나머지가 4입니다. 이 조건을 만족하는 가장 작은 양의 정수 n은 얼마인가요?", choices: ["12", "22", "27", "32", "37"], answer: 3, solution: "5로 나누어 나머지가 2인 수는 2, 7, 12, 17, 22, 27, 32, …입니다. 이 중 7로 나누어 나머지가 4인 가장 작은 수는 32입니다." },
    { id: "amc12-gfield-m09", standard: "기하", focus: "정육각형의 넓이", prompt: "한 변의 길이가 4인 정육각형의 넓이는 얼마인가요?", choices: ["12√3", "16√3", "20√3", "24√3", "32√3"], answer: 3, solution: "정육각형은 한 변이 4인 정삼각형 6개로 나눌 수 있습니다. 정삼각형 하나의 넓이는 (√3/4)×4²=4√3이므로 전체 넓이는 24√3입니다." },
    { id: "amc12-gfield-m10", standard: "경우의 수", focus: "자리수와 나머지 조건", prompt: "숫자 0, 1, 2, 3, 4, 5, 6 중 서로 다른 네 숫자로 만들 수 있는 5의 배수인 네 자리 수는 몇 개인가요?", choices: ["180", "200", "210", "220", "240"], answer: 3, solution: "끝자리가 0이면 첫 자리는 1–6 중 6가지, 가운데 두 자리는 남은 5개 중 순서 있게 5×4가지이므로 120개입니다. 끝자리가 5이면 첫 자리는 1,2,3,4,6 중 5가지이고 가운데는 5×4가지이므로 100개입니다. 합은 220개입니다." },
    { id: "amc12-gfield-m11", standard: "대수", focus: "근과 계수", prompt: "이차방정식 x²−7x+10=0의 두 근을 r, s라 할 때 r²+s²은 얼마인가요?", choices: ["19", "21", "25", "29", "39"], answer: 3, solution: "근과 계수의 관계에서 r+s=7, rs=10입니다. 따라서 r²+s²=(r+s)²−2rs=49−20=29입니다." },
    { id: "amc12-gfield-m12", standard: "함수·삼각함수", focus: "삼각함수 대칭식", prompt: "0<θ<π/2이고 sin θ+cos θ=√(3/2)일 때, sin³θ+cos³θ는 얼마인가요?", choices: ["3√6/16", "√6/2", "3√6/8", "5√6/8", "√6"], answer: 2, solution: "s=sin θ, c=cos θ라 두면 s²+c²=1입니다. (s+c)²=3/2이므로 sc=1/4입니다. 따라서 s³+c³=(s+c)³−3sc(s+c)=(3/2−3/4)√(3/2)=3√6/8입니다." },
    { id: "amc12-gfield-m13", standard: "정수론", focus: "약수의 조건 세기", prompt: "2⁴·3³·5²의 양의 약수 중 10의 배수인 것은 몇 개인가요?", choices: ["20", "24", "28", "32", "36"], answer: 3, solution: "10의 배수이려면 약수에 2와 5가 각각 적어도 한 번 있어야 합니다. 2의 지수는 1–4에서 4가지, 3의 지수는 0–3에서 4가지, 5의 지수는 1–2에서 2가지입니다. 4×4×2=32개입니다." },
    { id: "amc12-gfield-m14", standard: "기하", focus: "헤론 공식과 외접원", prompt: "변의 길이가 13, 14, 15인 삼각형의 외접원 반지름은 얼마인가요?", choices: ["65/8", "65/7", "13/2", "17/2", "15/2"], answer: 0, solution: "반둘레는 21이고 헤론 공식으로 넓이는 √(21×8×7×6)=84입니다. 외접원 반지름 R=abc/(4K)이므로 R=(13×14×15)/(4×84)=65/8입니다." },
    { id: "amc12-gfield-m15", standard: "경우의 수", focus: "비복원 추출과 홀짝", prompt: "1부터 10까지의 정수 중 서로 다른 두 수를 균등하게 고릅니다. 두 수의 합이 홀수일 확률은 얼마인가요?", choices: ["1/2", "5/9", "4/9", "2/5", "5/11"], answer: 1, solution: "합이 홀수이려면 홀수 하나와 짝수 하나를 골라야 합니다. 홀수 5개와 짝수 5개에서 하나씩 고르는 경우는 25가지이고, 전체 쌍은 10C2=45가지입니다. 확률은 25/45=5/9입니다." },
    { id: "amc12-gfield-m16", standard: "대수", focus: "대칭식과 점화 관계", prompt: "x²−3x+1=0의 한 근을 x라 할 때, x⁵+1/x⁵는 얼마인가요?", choices: ["117", "119", "121", "123", "125"], answer: 3, solution: "방정식을 x로 나누면 x+1/x=3입니다. Tₙ=xⁿ+1/xⁿ라 두면 T₀=2, T₁=3이고 Tₙ=3Tₙ₋₁−Tₙ₋₂입니다. 따라서 T₂=7, T₃=18, T₄=47, T₅=123입니다." },
    { id: "amc12-gfield-m17", standard: "함수·삼각함수", focus: "다항식 보간", prompt: "차수가 2 이하인 다항식 P가 P(0)=1, P(1)=2, P(2)=5를 만족합니다. P(5)는 얼마인가요?", choices: ["21", "24", "25", "26", "29"], answer: 3, solution: "세 조건을 만족하는 차수 2 이하 다항식은 유일합니다. P(x)=ax²+bx+c라 두면 c=1, a+b=1, 4a+2b=4에서 a=1, b=0입니다. 따라서 P(x)=x²+1이고 P(5)=26입니다." },
    { id: "amc12-gfield-m18", standard: "정수론", focus: "팩토리얼의 소인수 지수", prompt: "100!을 십진법으로 썼을 때 끝에 연속으로 붙는 0의 개수는 얼마인가요?", choices: ["20", "22", "24", "25", "30"], answer: 2, solution: "끝자리 0의 수는 100!에 들어 있는 소인수 5의 지수입니다. 5의 배수에서 20개, 25의 배수에서 추가 4개를 얻고 125의 배수는 없으므로 24개입니다." },
    { id: "amc12-gfield-m19", standard: "기하", focus: "정사각형과 외접원", prompt: "한 변의 길이가 8인 정사각형의 네 꼭짓점을 모두 지나는 원의 넓이는 얼마인가요?", choices: ["16π", "24π", "32π", "48π", "64π"], answer: 2, solution: "정사각형의 대각선은 원의 지름입니다. 대각선 길이는 8√2이므로 반지름은 4√2입니다. 원의 넓이는 π(4√2)²=32π입니다." },
    { id: "amc12-gfield-m20", standard: "경우의 수", focus: "포함·배제와 배수", prompt: "1부터 1000까지의 정수 중 6 또는 10의 배수이면서 15의 배수는 아닌 수는 몇 개인가요?", choices: ["166", "180", "200", "233", "267"], answer: 2, solution: "6의 배수는 166개, 10의 배수는 100개, 두 조건의 공배수인 30의 배수는 33개입니다. 6 또는 10의 배수는 166+100−33=233개입니다. 이 가운데 15의 배수인 수는 정확히 30의 배수 33개이므로 233−33=200개입니다." },
    { id: "amc12-gfield-m21", standard: "대수", focus: "치환과 실근 개수", prompt: "실수 x가 x²+1/x²=3을 만족합니다. 가능한 x의 개수는 몇 개인가요?", choices: ["0", "2", "4", "6", "8"], answer: 2, solution: "x≠0이고 양변에 x²을 곱하면 x⁴−3x²+1=0입니다. y=x²로 두면 y²−3y+1=0의 두 근은 모두 양수입니다. 각 y에 대해 x=±√y가 가능하므로 실근은 모두 4개입니다." },
    { id: "amc12-gfield-m22", standard: "함수·삼각함수", focus: "삼각방정식과 해의 합", prompt: "0≤x<2π에서 sin 2x=cos x를 만족하는 모든 x의 합은 얼마인가요?", choices: ["2π", "5π/2", "3π", "7π/2", "4π"], answer: 2, solution: "sin 2x=2sin x cos x이므로 cos x(2sin x−1)=0입니다. 범위 안의 해는 π/2, 3π/2, π/6, 5π/6입니다. 합은 3π입니다." },
    { id: "amc12-gfield-m23", standard: "정수론", focus: "거듭제곱 주기와 나머지", prompt: "7²⁰²⁵을 1000으로 나눈 나머지는 얼마인가요?", choices: ["207", "407", "607", "807", "907"], answer: 3, solution: "계산하면 7⁵=16807이므로 7⁵≡807 (mod 1000)입니다. 또 7²⁰≡1 (mod 1000)입니다. 2025=20×101+5이므로 7²⁰²⁵≡(7²⁰)¹⁰¹×7⁵≡807 (mod 1000)입니다." },
    { id: "amc12-gfield-m24", standard: "기하", focus: "두 원의 공통현", prompt: "반지름이 13과 15인 두 원의 중심 사이 거리는 14입니다. 두 원의 공통현 길이는 얼마인가요?", choices: ["18", "20", "24", "26", "28"], answer: 2, solution: "두 중심을 잇는 선은 공통현을 수직이등분합니다. 반지름 13인 원의 중심에서 현까지의 거리를 d라 하면 d=(13²+14²−15²)/(2×14)=5입니다. 현의 반쪽 길이는 √(13²−5²)=12이므로 전체 길이는 24입니다." },
    { id: "amc12-gfield-m25", standard: "경우의 수", focus: "원에 내접한 삼각형과 호", prompt: "정12각형의 꼭짓점 중 3개를 균등하게 골라 삼각형을 만듭니다. 예각삼각형일 확률은 얼마인가요?", choices: ["1/6", "2/11", "1/5", "3/11", "1/3"], answer: 1, solution: "전체 삼각형은 C(12,3)=220개입니다. 둔각 또는 직각삼각형에는 꼭짓점 사이의 호 중 적어도 6칸인 호가 하나 있습니다. 그 호의 시작 꼭짓점은 12가지이고, 호 길이가 6, 7, 8, 9, 10칸일 때 세 번째 꼭짓점은 각각 5, 4, 3, 2, 1가지라 비예각삼각형은 12(5+4+3+2+1)=180개입니다. 예각삼각형은 40개이므로 확률은 40/220=2/11입니다." }
  ];
  const standards = Object.freeze(["대수", "함수·삼각함수", "정수론", "기하", "경우의 수"]);
  const requestedGrade = Number(new URLSearchParams(typeof window !== "undefined" ? window.location.search : "").get("grade"));
  const grade = Number.isInteger(requestedGrade) && requestedGrade >= 7 && requestedGrade <= 12 ? requestedGrade : 10;
  const attemptParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const nextStudyParams = new URLSearchParams({ grade: String(grade) });
  ["domains", "sourceYear", "sourceForm", "sourceQuestions", "sourceConcepts"].forEach(function (key) {
    const value = attemptParams.get(key);
    if (value) nextStudyParams.set(key, value);
  });
  root.GFIELDAMC12Mock = Object.freeze({
    id: "gfield-amc12-concept-mock-v1", formVersion: "2026-11-04-v2", grade: grade,
    title: "지필드 AMC 12 범위 개념 모의고사 · 1회", durationMinutes: 75,
    standards: standards, nextStudyHref: `./amc12-practice.html?${nextStudyParams.toString()}`,
    nextStudyLabel: "지필드 AMC 12 개념 연습으로 이어가기 →",
    items: Object.freeze(items.map(function (item) { return Object.freeze(item); }))
  });
})(typeof window === "undefined" ? globalThis : window);
