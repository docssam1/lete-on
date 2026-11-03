(function (root) {
  "use strict";
  // GFIELD-authored parallel practice form. No official AMC item is reproduced.
  const items = [
    { id:"amc10-m01", standard:"대수", focus:"일차식과 비율", prompt:"두 수의 합은 34이고 큰 수는 작은 수의 3배보다 2만큼 작습니다. 큰 수는 얼마인가요?", choices:[24,25,26,27,28], answer:1, solution:"작은 수를 x라 하면 큰 수는 3x−2입니다. x+(3x−2)=34이므로 x=9, 큰 수는 3·9−2=25입니다." },
    { id:"amc10-m02", standard:"대수", focus:"연립 조건 모델링", prompt:"성인 입장권은 12달러, 학생 입장권은 7달러입니다. 18장을 팔아 161달러를 받았습니다. 성인권은 몇 장 팔았나요?", choices:[5,6,7,8,9], answer:2, solution:"성인권을 a장이라 하면 12a+7(18−a)=161입니다. 5a=35이므로 a=7입니다." },
    { id:"amc10-m03", standard:"대수", focus:"대칭식", prompt:"a+b=11, ab=24일 때 (a−2)(b−2)는 얼마인가요?", choices:[2,4,6,8,10], answer:2, solution:"(a−2)(b−2)=ab−2(a+b)+4=24−22+4=6입니다." },
    { id:"amc10-m04", standard:"대수", focus:"수열의 규칙", prompt:"수열 4, 9, 14, 19, …에서 100은 몇 번째 항인가요?", choices:[18,19,20,21,22], answer:2, solution:"n번째 항은 4+5(n−1)입니다. 4+5(n−1)=100에서 n=20입니다." },
    { id:"amc10-m05", standard:"대수", focus:"정수 계수 방정식", prompt:"정수 x가 (x−3)(x+2)=0을 만족합니다. 가능한 x의 합은 얼마인가요?", choices:[-2,0,1,3,5], answer:2, solution:"곱이 0이므로 x=3 또는 x=−2입니다. 합은 1입니다." },
    { id:"amc10-m06", standard:"정수론", focus:"나머지 조건", prompt:"양의 정수 n은 4로 나누면 1이 남고 7로 나누면 4가 남습니다. 가장 작은 n은 얼마인가요?", choices:[17,21,25,29,33], answer:2, solution:"4로 나누어 1이 남는 수는 1, 5, 9, 13, 17, 21, 25, …입니다. 이 중 7로 나누어 4가 남는 가장 작은 수는 25입니다." },
    { id:"amc10-m07", standard:"정수론", focus:"소인수 지수와 약수", prompt:"360의 양의 약수 중 홀수인 것은 몇 개인가요?", choices:[4,6,8,10,12], answer:1, solution:"360=2³·3²·5입니다. 홀수 약수에는 2가 들어가지 않으므로 3의 지수 0~2와 5의 지수 0~1을 고릅니다. 3·2=6개입니다." },
    { id:"amc10-m08", standard:"정수론", focus:"배수와 포함·배제", prompt:"1부터 200까지의 정수 중 6 또는 8의 배수는 몇 개인가요?", choices:[48,50,52,54,56], answer:1, solution:"6의 배수는 33개, 8의 배수는 25개입니다. 공배수인 24의 배수 8개를 한 번 빼면 33+25−8=50개입니다." },
    { id:"amc10-m09", standard:"정수론", focus:"거듭제곱의 일의 자리", prompt:"3²⁰²⁵의 일의 자리 숫자는 무엇인가요?", choices:[1,3,7,9,5], answer:1, solution:"3의 거듭제곱의 일의 자리는 3, 9, 7, 1의 주기로 반복됩니다. 2025를 4로 나눈 나머지는 1이므로 일의 자리는 3입니다." },
    { id:"amc10-m10", standard:"정수론", focus:"최대공약수", prompt:"두 양의 정수의 최대공약수는 6, 최소공배수는 180입니다. 한 수가 30일 때 다른 수는 얼마인가요?", choices:[24,30,36,42,48], answer:2, solution:"두 수의 곱은 최대공약수와 최소공배수의 곱입니다. 다른 수를 x라 하면 30x=6·180이므로 x=36입니다." },
    { id:"amc10-m11", standard:"기하", focus:"삼각형의 각", prompt:"삼각형의 세 각의 크기가 x, 2x, 3x입니다. 가장 큰 각은 몇 도인가요?", choices:[60,75,90,105,120], answer:2, solution:"x+2x+3x=180°이므로 x=30°입니다. 가장 큰 각은 3x=90°입니다." },
    { id:"amc10-m12", standard:"기하", focus:"넓이 비", prompt:"밑변이 같은 두 삼각형의 높이가 4와 7입니다. 작은 삼각형의 넓이가 18이면 큰 삼각형의 넓이는 얼마인가요?", choices:[24,28,30,31.5,36], answer:3, solution:"밑변이 같으면 넓이는 높이에 비례합니다. 큰 넓이는 18·7/4=31.5입니다." },
    { id:"amc10-m13", standard:"기하", focus:"직사각형과 피타고라스", prompt:"직사각형의 변 길이가 9와 12입니다. 대각선 길이는 얼마인가요?", choices:[13,14,15,16,17], answer:2, solution:"대각선은 직각삼각형의 빗변입니다. √(9²+12²)=√225=15입니다." },
    { id:"amc10-m14", standard:"기하", focus:"원과 둘레", prompt:"반지름이 5인 원의 둘레는 얼마인가요?", choices:["5π","8π","10π","20π","25π"], answer:2, solution:"원의 둘레는 2πr입니다. r=5이므로 10π입니다." },
    { id:"amc10-m15", standard:"기하", focus:"입체도형 부피", prompt:"밑면이 4×6 직사각형이고 높이가 5인 직육면체의 부피는 얼마인가요?", choices:[60,90,100,120,150], answer:3, solution:"부피는 밑면 넓이×높이입니다. 4·6·5=120입니다." },
    { id:"amc10-m16", standard:"경우의 수", focus:"곱의 법칙", prompt:"서로 다른 셔츠 4벌과 바지 3벌 중 하나씩 골라 입는 방법은 몇 가지인가요?", choices:[7,10,12,14,16], answer:2, solution:"셔츠 선택 4가지마다 바지 3가지를 고를 수 있어 4·3=12가지입니다." },
    { id:"amc10-m17", standard:"경우의 수", focus:"자리 숫자 배열", prompt:"숫자 1, 2, 3, 4를 한 번씩 사용해 만들 수 있는 네 자리 짝수는 몇 개인가요?", choices:[6,8,10,12,16], answer:3, solution:"끝자리는 2 또는 4로 2가지입니다. 나머지 세 숫자는 3!=6가지로 배열하므로 12개입니다." },
    { id:"amc10-m18", standard:"경우의 수", focus:"여사건 세기", prompt:"서로 다른 책 4권을 한 줄로 놓을 때 A와 B가 서로 붙어 있는 배열은 몇 가지인가요?", choices:[8,10,12,16,24], answer:2, solution:"A와 B를 한 묶음으로 보면 세 대상을 배열하는 3!가지이고, 묶음 안 순서는 2가지입니다. 3!·2=12가지입니다." },
    { id:"amc10-m19", standard:"경우의 수", focus:"격자 경로", prompt:"오른쪽 3번, 위쪽 2번 움직이는 최단 경로는 모두 몇 가지인가요?", choices:[5,8,10,12,15], answer:2, solution:"전체 5번 움직임 중 위쪽 2번이 들어갈 위치를 고릅니다. 5C2=10가지입니다." },
    { id:"amc10-m20", standard:"경우의 수", focus:"조건부 자리 배열", prompt:"숫자 0, 1, 2, 3으로 서로 다른 세 숫자를 사용해 만들 수 있는 세 자리 수는 몇 개인가요?", choices:[12,14,16,18,20], answer:3, solution:"백의 자리는 0이 아닌 3가지입니다. 십의 자리는 남은 3가지, 일의 자리는 2가지이므로 3·3·2=18개입니다." },
    { id:"amc10-m21", standard:"확률", focus:"여사건", prompt:"공정한 주사위를 한 번 던질 때 4보다 큰 수가 나올 확률은 얼마인가요?", choices:["1/6","1/3","1/2","2/3","5/6"], answer:1, solution:"가능한 눈은 1부터 6까지이고 4보다 큰 눈은 5와 6, 두 개입니다. 확률은 2/6=1/3입니다." },
    { id:"amc10-m22", standard:"확률", focus:"비복원 추출", prompt:"주머니에 빨간 구슬 3개와 파란 구슬 2개가 있습니다. 두 개를 차례로 꺼내 모두 빨간색일 확률은 얼마인가요?", choices:["1/10","1/5","3/10","2/5","1/2"], answer:2, solution:"첫 구슬이 빨강일 확률은 3/5이고, 그 뒤 빨강은 2/4입니다. 곱하면 6/20=3/10입니다." },
    { id:"amc10-m23", standard:"확률", focus:"합이 특정 값인 경우", prompt:"공정한 주사위 두 개를 던집니다. 눈의 합이 7일 확률은 얼마인가요?", choices:["1/12","1/9","1/6","1/4","1/3"], answer:2, solution:"전체 결과는 36가지이고 합이 7인 결과는 (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) 여섯 가지입니다. 확률은 6/36=1/6입니다." },
    { id:"amc10-m24", standard:"확률", focus:"정수에서 균등 선택", prompt:"1부터 10까지의 정수 중 하나를 균등하게 고릅니다. 3의 배수일 확률은 얼마인가요?", choices:["1/5","3/10","2/5","1/2","3/5"], answer:1, solution:"3의 배수는 3, 6, 9로 세 개입니다. 가능한 수 열 개 중 세 개이므로 3/10입니다." },
    { id:"amc10-m25", standard:"확률", focus:"독립 시행", prompt:"공정한 동전을 두 번 던질 때 앞면이 정확히 한 번 나올 확률은 얼마인가요?", choices:["1/4","1/3","1/2","2/3","3/4"], answer:2, solution:"가능한 결과는 HH, HT, TH, TT 네 가지입니다. 정확히 한 번 앞면인 HT와 TH 두 가지이므로 확률은 2/4=1/2입니다." }
  ];
  const standards = Object.freeze(["대수", "정수론", "기하", "경우의 수", "확률"]);
  const gradeValue = Number(new URLSearchParams(typeof window !== "undefined" ? window.location.search : "").get("grade"));
  const grade = Number.isInteger(gradeValue) && gradeValue >= 7 && gradeValue <= 10 ? gradeValue : 7;
  root.GFIELDAMC10Mock = Object.freeze({ id:"gfield-amc10-concept-mock-v1", formVersion:"2026-11-04-v1", grade, title:"지필드 AMC 10 범위 모의고사 · 1회", durationMinutes:75, standards,
    nextStudyHref:`./amc10-practice.html?grade=${grade}`, nextStudyLabel:"지필드 AMC 10 개념 연습으로 이어가기 →",
    items:Object.freeze(items.map(item => Object.freeze(item))) });
})(typeof window === "undefined" ? globalThis : window);
