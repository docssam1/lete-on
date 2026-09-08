/* ============================================================
   실험실 목록과 유닛 연결 (data/labs.js, 2026-09-06 분리)
   전에는 app/main.js 안에만 있었는데, main.js 는 파일 전체가 IIFE 라 다른 페이지에서
   보이지 않는다. 학습지(app/exam.js)가 실험실 QR 을 찍어야 하고 그 학습지는 main.js 를
   싣지 않는 ws.html·drill.html 에서도 그려지므로, 데이터만 여기로 꺼냈다.
   main.js 는 이 파일을 읽고, 없으면 빈 목록으로 떨어진다.
   ============================================================ */
window.NM_LABS = {
  list: [
    {file:'labs/rainbow-sum.html', icon:'🌈',
     name:{ko:'무지개 덧셈법',en:'The Rainbow Sum',zh:'彩虹加法法'},
     desc:{ko:'1부터 100까지 더하기를 무지개처럼 짝지어 순식간에 끝내 봐요.',
           en:'Pair the numbers like a rainbow and finish 1+2+…+100 in seconds.',
           zh:'像彩虹一样把数配成对，几秒钟算完1加到100。'}},
    {file:'labs/square-friends.html', icon:'🟦',
     name:{ko:'사각수 친구들',en:'Square Number Friends',zh:'平方数朋友'},
     desc:{ko:'홀수를 ㄱ자로 한 겹씩 두르면 정사각형이 자라는 걸 직접 만들어 봐요.',
           en:'Wrap odd numbers in L-shapes and watch a square grow, one layer at a time.',
           zh:'把奇数一层层围成直角，亲手看正方形长大。'}},
    {file:'labs/secret-1001.html', icon:'🔢',
     name:{ko:'1001의 비밀',en:'The Secret of 1001',zh:'1001的秘密'},
     desc:{ko:'세 자리 수를 두 번 이어 쓰면 왜 7·11·13으로 나누어떨어지는지 확인해요.',
           en:'Write a 3-digit number twice and see why 7, 11 and 13 always divide it.',
           zh:'把三位数连写两遍，看看为什么7、11、13都能整除它。'}},
    {file:'labs/number-line-hole.html', icon:'🕳️',
     name:{ko:'수직선의 구멍',en:'The Hole in the Number Line',zh:'数轴上的缺口'},
     desc:{ko:'분수를 아무리 촘촘히 찍어도 남는 자리를 10배씩 확대해 찾아봐요.',
           en:'Zoom in 10× at a time to find the spot no fraction ever lands on.',
           zh:'每次放大10倍，找出分数永远填不满的那个位置。'}},
    {file:'labs/root-hunter.html', icon:'🌰',
     name:{ko:'루트 사냥꾼',en:'Root Hunter',zh:'根号猎人'},
     desc:{ko:'√7은 몇일까? 넓이 슬라이더와 양쪽 조이기로 제곱근을 직접 사냥해요.',
           en:'How big is √7? Hunt it down with an area slider and a squeeze from both sides.',
           zh:'√7是多少？用面积滑块和两边夹逼，亲手抓住平方根。'}},
    {file:'labs/why-calculus.html', icon:'🍎',
     name:{ko:'미적분은 왜 태어났나',en:'Why Calculus Was Born',zh:'微积分为何诞生'},
     desc:{ko:'변하는 것을 계산하려고 400년 전에 미적분이 생긴 이야기와 오늘의 쓰임을 봐요.',
           en:'Why calculus appeared 400 years ago to measure change — and where it lives today.',
           zh:'为了计算变化，400年前诞生了微积分——看看它的来历和今天的用处。'}}
  ],
  /* 개념 노트 ↔ 실험실 연결. 여기 등록된 유닛은 개념 노트 하단과 학습지 수학사 지면에서 열린다. */
  byUnit: {
    'A-28':'labs/rainbow-sum.html',                                  /* 가우스 덧셈 1 */
    'C-05':['labs/rainbow-sum.html','labs/square-friends.html'],     /* 가우스 덧셈 마법(훅이 홀수의 합) */
    'C-01':'labs/square-friends.html',                               /* 거듭제곱 마법 */
    'H-04':'labs/secret-1001.html',                                  /* 1001 자릿수 이동법칙 */
    'M-15':['labs/root-hunter.html','labs/number-line-hole.html'],   /* 제곱근의 값 */
    'M-16':'labs/number-line-hole.html',                             /* 근호의 정리 */
    'M-43':'labs/why-calculus.html',                                 /* 극한 */
    'M-44':'labs/why-calculus.html',                                 /* 미분계수 */
    'M-45':'labs/why-calculus.html',                                 /* 접선 */
    'M-46':'labs/why-calculus.html'                                  /* 적분 */
  }
};
