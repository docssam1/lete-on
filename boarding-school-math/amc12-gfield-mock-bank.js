(function (root) {
  "use strict";

  // Original GFIELD-authored AMC 12-scope diagnostic. It is not an official contest form.
  const items = [
    { id: "amc12-gfield-m01", standard: "대수", focus: "근과 대칭식", prompt: "x² − 5x + 1 = 0의 한 근을 x라 할 때, x⁴ + 1/x⁴의 값은 얼마인가요?", choices: ["527", "521", "625", "523", "529"], answer: 0, solution: "방정식을 x로 나누면 x + 1/x = 5입니다. 양변을 제곱해 x² + 1/x² = 23을 얻고, 다시 제곱하면 x⁴ + 1/x⁴ = 23² − 2 = 527입니다." },
    { id: "amc12-gfield-m02", standard: "함수·삼각함수", focus: "이차함수의 최솟값", prompt: "실수 x에 대하여 x² − 4x + 8의 최솟값은 얼마인가요?", choices: ["2", "3", "4", "5", "8"], answer: 2, solution: "식을 (x − 2)² + 4로 완전제곱하면 됩니다. 제곱의 최솟값은 0이므로 최솟값은 4입니다." },
    { id: "amc12-gfield-m03", standard: "정수론", focus: "최대공약수와 약수", prompt: "20보다 큰 양의 정수 n이 gcd(n, 84) = 12를 만족합니다. 가능한 가장 작은 n은 얼마인가요?", choices: ["12", "18", "24", "36", "48"], answer: 2, solution: "12의 배수 후보 중 20보다 큰 가장 작은 수는 24입니다. gcd(24,84)=12이므로 답은 24입니다." },
    { id: "amc12-gfield-m04", standard: "기하", focus: "원과 현", prompt: "반지름이 10인 원에서 중심으로부터 6만큼 떨어진 현의 길이는 얼마인가요?", choices: ["12", "14", "16", "18", "20"], answer: 2, solution: "중심에서 현에 내린 수선은 현을 이등분합니다. 반쪽 길이를 a라 하면 a² + 6² = 10²이므로 a=8입니다. 현의 길이는 2a=16입니다." },
    { id: "amc12-gfield-m05", standard: "경우의 수", focus: "순열과 짝수", prompt: "숫자 1, 2, 3, 4, 5를 한 번씩 사용해 다섯 자리 수를 만들 때 짝수는 몇 개 만들 수 있나요?", choices: ["24", "36", "48", "60", "72"], answer: 2, solution: "짝수가 되려면 끝자리가 2 또는 4여야 하므로 끝자리 선택은 2가지입니다. 나머지 네 자리는 4!가지로 배열합니다. 모두 2×4!=48개입니다." },
    { id: "amc12-gfield-m06", standard: "대수", focus: "유리식과 정의역", prompt: "x=5일 때 (x²−16)/(x−4) + (x²−9)/(x−3)의 값은 얼마인가요?", choices: ["12", "13", "14", "15", "17"], answer: 4, solution: "x²−16=(x−4)(x+4)이므로 첫째 항은 x+4=9입니다. 둘째 항은 x+3=8입니다. x=5는 두 원래 분모를 0으로 만들지 않으므로 합은 17입니다." },
    { id: "amc12-gfield-m07", standard: "함수·삼각함수", focus: "지수 방정식", prompt: "4^(x+1)=8^(x−1)을 만족하는 실수 x는 얼마인가요?", choices: ["1", "2", "3", "4", "5"], answer: 4, solution: "밑을 2로 통일하면 2^(2x+2)=2^(3x−3)입니다. 지수가 같으므로 2x+2=3x−3, 따라서 x=5입니다." },
    { id: "amc12-gfield-m08", standard: "정수론", focus: "합동식", prompt: "n을 5로 나누면 나머지가 2이고 7로 나누면 나머지가 4입니다. 이 조건을 만족하는 가장 작은 양의 정수 n은 얼마인가요?", choices: ["12", "22", "27", "32", "37"], answer: 3, solution: "5로 나누어 나머지가 2인 수는 2, 7, 12, 17, 22, 27, 32, …입니다. 이 중 7로 나누어 나머지가 4인 가장 작은 수는 32입니다." },
    { id: "amc12-gfield-m09", standard: "기하", focus: "삼각형 넓이", prompt: "밑변의 길이가 12이고 넓이가 42인 삼각형의 높이는 얼마인가요?", choices: ["5", "6", "7", "8", "9"], answer: 2, solution: "삼각형의 넓이는 밑변×높이÷2입니다. 42=12h÷2=6h이므로 높이 h는 7입니다." },
    { id: "amc12-gfield-m10", standard: "경우의 수", focus: "조합", prompt: "서로 다른 책 7권 중에서 3권을 고르는 방법은 몇 가지인가요?", choices: ["21", "28", "35", "42", "49"], answer: 2, solution: "순서는 중요하지 않으므로 조합을 씁니다. 7C3=7×6×5÷(3×2×1)=35가지입니다." },
    { id: "amc12-gfield-m11", standard: "대수", focus: "근과 계수", prompt: "이차방정식 x²−7x+10=0의 두 근을 r, s라 할 때 r²+s²은 얼마인가요?", choices: ["19", "21", "25", "29", "39"], answer: 3, solution: "근과 계수의 관계에서 r+s=7, rs=10입니다. 따라서 r²+s²=(r+s)²−2rs=49−20=29입니다." },
    { id: "amc12-gfield-m12", standard: "함수·삼각함수", focus: "삼각함수 항등식", prompt: "sin θ=3/5이고 θ가 제1사분면에 있을 때 cos θ는 얼마인가요?", choices: ["1/5", "2/5", "3/5", "4/5", "5/4"], answer: 3, solution: "sin²θ+cos²θ=1이므로 cos²θ=1−9/25=16/25입니다. θ가 제1사분면이므로 cos θ는 양수이고 4/5입니다." },
    { id: "amc12-gfield-m13", standard: "정수론", focus: "소인수분해와 약수의 수", prompt: "360의 양의 약수는 모두 몇 개인가요?", choices: ["18", "20", "24", "30", "36"], answer: 2, solution: "360=2³×3²×5입니다. 약수의 수는 (3+1)(2+1)(1+1)=24개입니다." },
    { id: "amc12-gfield-m14", standard: "기하", focus: "좌표기하의 거리", prompt: "좌표평면에서 점 (−2, 3)과 (4, −5) 사이의 거리는 얼마인가요?", choices: ["8", "9", "10", "12", "14"], answer: 2, solution: "가로 차는 6, 세로 차는 8입니다. 거리 공식으로 √(6²+8²)=√100=10입니다." },
    { id: "amc12-gfield-m15", standard: "경우의 수", focus: "여사건", prompt: "공정한 동전을 네 번 던집니다. 적어도 한 번 앞면이 나올 확률은 얼마인가요?", choices: ["1/16", "7/8", "15/16", "3/4", "5/8"], answer: 2, solution: "앞면이 한 번도 나오지 않을 확률은 네 번 모두 뒷면일 때인 1/16입니다. 여사건을 이용하면 적어도 한 번 앞면일 확률은 1−1/16=15/16입니다." },
    { id: "amc12-gfield-m16", standard: "대수", focus: "다항식의 나머지", prompt: "P(x)=x³+2x²−5x+7을 x−2로 나눈 나머지는 얼마인가요?", choices: ["9", "11", "13", "15", "17"], answer: 2, solution: "나머지 정리에 따라 나머지는 P(2)입니다. P(2)=8+8−10+7=13입니다." },
    { id: "amc12-gfield-m17", standard: "함수·삼각함수", focus: "수열의 일반항", prompt: "등차수열의 첫째 항이 4이고 공차가 3일 때, 열째 항은 얼마인가요?", choices: ["28", "30", "31", "34", "37"], answer: 2, solution: "등차수열의 n번째 항은 a₁+(n−1)d입니다. a₁₀=4+9×3=31입니다." },
    { id: "amc12-gfield-m18", standard: "정수론", focus: "팩토리얼의 끝자리 0", prompt: "50!을 십진법으로 썼을 때 끝에 연속으로 붙는 0의 개수는 얼마인가요?", choices: ["10", "11", "12", "13", "14"], answer: 2, solution: "끝자리 0 하나마다 소인수 5 하나가 필요합니다. 50!에는 5의 배수 10개가 있고, 25와 50은 각각 소인수 5를 하나씩 더 보태므로 모두 12개입니다." },
    { id: "amc12-gfield-m19", standard: "기하", focus: "닮음과 넓이비", prompt: "두 닮은 삼각형의 대응하는 변의 길이의 비가 2:5입니다. 작은 삼각형의 넓이가 12라면 큰 삼각형의 넓이는 얼마인가요?", choices: ["30", "60", "75", "120", "150"], answer: 2, solution: "닮은 도형의 넓이비는 대응하는 변의 비의 제곱입니다. 작은 삼각형과 큰 삼각형의 넓이비는 4:25이므로 큰 넓이는 12×25/4=75입니다." },
    { id: "amc12-gfield-m20", standard: "경우의 수", focus: "포함·배제", prompt: "1부터 100까지의 정수 중 2 또는 5의 배수는 몇 개인가요?", choices: ["55", "60", "65", "70", "75"], answer: 1, solution: "2의 배수는 50개, 5의 배수는 20개입니다. 두 번 센 10의 배수 10개를 빼면 50+20−10=60개입니다." },
    { id: "amc12-gfield-m21", standard: "대수", focus: "절댓값 방정식", prompt: "|2x−3|=7을 만족하는 실수 x의 두 값을 더하면 얼마인가요?", choices: ["0", "2", "3", "4", "6"], answer: 2, solution: "2x−3=7이면 x=5이고, 2x−3=−7이면 x=−2입니다. 두 해의 합은 3입니다." },
    { id: "amc12-gfield-m22", standard: "함수·삼각함수", focus: "로그의 정의", prompt: "log₂(x−1)=3을 만족하는 x는 얼마인가요?", choices: ["7", "8", "9", "10", "11"], answer: 2, solution: "로그의 정의에서 x−1=2³=8입니다. 따라서 x=9이며 정의역 x>1도 만족합니다." },
    { id: "amc12-gfield-m23", standard: "정수론", focus: "나머지의 거듭제곱", prompt: "3¹⁰⁰을 7로 나눈 나머지는 얼마인가요?", choices: ["1", "2", "3", "4", "5"], answer: 3, solution: "3의 거듭제곱을 7로 나눈 나머지는 3, 2, 6, 4, 5, 1의 순서로 6번마다 반복됩니다. 100=6×16+4이므로 네 번째 나머지인 4입니다." },
    { id: "amc12-gfield-m24", standard: "기하", focus: "원주각", prompt: "한 원에서 같은 호를 보는 중심각의 크기가 100°입니다. 그 호를 보는 원주각의 크기는 얼마인가요?", choices: ["25°", "40°", "50°", "80°", "100°"], answer: 2, solution: "같은 호에 대한 원주각은 중심각의 절반입니다. 따라서 100°÷2=50°입니다." },
    { id: "amc12-gfield-m25", standard: "경우의 수", focus: "격자 경로", prompt: "격자에서 오른쪽으로 4번, 위쪽으로 2번만 움직여 시작점에서 도착점까지 가는 최단 경로는 몇 가지인가요?", choices: ["10", "12", "15", "20", "30"], answer: 2, solution: "총 6번 움직임 중 위쪽으로 갈 2자리를 고르면 됩니다. 6C2=15가지입니다." }
  ];
  const standards = Object.freeze(["대수", "함수·삼각함수", "정수론", "기하", "경우의 수"]);
  const requestedGrade = Number(new URLSearchParams(typeof window !== "undefined" ? window.location.search : "").get("grade"));
  const grade = Number.isInteger(requestedGrade) && requestedGrade >= 7 && requestedGrade <= 12 ? requestedGrade : 10;
  root.GFIELDAMC12Mock = Object.freeze({
    id: "gfield-amc12-concept-mock-v1", formVersion: "2026-11-04-v1", grade: grade,
    title: "지필드 AMC 12 범위 개념 모의고사 · 1회", durationMinutes: 75,
    standards: standards, nextStudyHref: `./amc12-practice.html?grade=${grade}`,
    nextStudyLabel: "지필드 AMC 12 개념 연습으로 이어가기 →",
    items: Object.freeze(items.map(function (item) { return Object.freeze(item); }))
  });
})(typeof window === "undefined" ? globalThis : window);
