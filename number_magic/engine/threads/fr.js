/* ============================================================
   Numbers of Magic — FR 분수 스레드 생성기 (FR1~FR8)
   계약: NM_TGEN[genKey] = (params, rng) => problem
   answer는 항상 정수. Math.random() 사용 금지.
   ============================================================ */
(function(){
'use strict';

const {R, pick, shuffle} = NM_RNG;

/* ── 공용 수학 헬퍼 ── */
function gcd(a, b){ while(b){ var t=b; b=a%b; a=t; } return a; }
function lcm(a, b){ return (a/gcd(a,b))*b; }
function simplify(n, d){ var g=gcd(Math.abs(n), d); return {n: n/g, d: d/g}; }

/* ============================================================
   FR1 — 동분모 진분수 덧셈/뺄셈
   ============================================================ */
NM_TGEN['fr1_properAddSub'] = function(params, rng){
  var op = pick(rng, ['+', '-']);
  var d  = pick(rng, [3,4,5,6,8,9,10,12]);
  var a, b, resultN, tex, promptKo, promptEn, promptZh;

  if(op === '+'){
    a = R(rng, 1, d-2);
    b = R(rng, 1, d-1-a);
    resultN = a + b;
    tex = '\\frac{' + a + '}{' + d + '} + \\frac{' + b + '}{' + d + '} = \\frac{\\square}{' + d + '}';
    promptKo = '같은 분모 분수를 더해요 (분자만 더하면 돼요!)';
    promptEn = 'Add fractions with the same denominator — just add the numerators!';
    promptZh = '同分母分数相加，只加分子就好！';
  } else {
    a = R(rng, 2, d-1);
    b = R(rng, 1, a-1);
    resultN = a - b;
    tex = '\\frac{' + a + '}{' + d + '} - \\frac{' + b + '}{' + d + '} = \\frac{\\square}{' + d + '}';
    promptKo = '분자끼리 빼요! 분모는 그대로';
    promptEn = 'Subtract the numerators — the denominator stays the same!';
    promptZh = '分子相减，分母不变！';
  }

  return {
    prompt: { ko: promptKo, en: promptEn, zh: promptZh },
    tex: tex,
    answer: resultN,
    answerType: 'number',
    widget: 'numpad'
  };
};

/* ============================================================
   FR2 — 가분수 ↔ 대분수 변환
   ============================================================ */
NM_TGEN['fr2_improperMixed'] = function(params, rng){
  var dir   = pick(rng, [0, 1]); // 0=가분수→대분수, 1=대분수→가분수
  var d     = pick(rng, [3,4,5,6,7,8]);
  var whole = R(rng, 1, 4);
  var rem   = R(rng, 1, d-1);
  var impN  = whole * d + rem;

  if(dir === 0){
    // 가분수 → 대분수: 빈칸 = 정수 부분(whole)
    return {
      prompt: {
        ko: impN + '/' + d + ' 를 대분수로 나타내요 (' + impN + '÷' + d + ' 를 계산!)',
        en: 'Convert the improper fraction ' + impN + '/' + d + ' to a mixed number',
        zh: '把假分数 ' + impN + '/' + d + ' 化为带分数'
      },
      tex: '\\frac{' + impN + '}{' + d + '} = \\square\\frac{' + rem + '}{' + d + '}',
      answer: whole,
      answerType: 'steps',
      steps: [
        { tex: impN + ' \\div ' + d + ' = ' + whole + ' \\cdots ' + rem + ' \\quad \\text{(몫=}\\square\\text{)}', blank: whole },
        { tex: whole + '\\frac{' + rem + '}{' + d + '}', blank: whole }
      ],
      widget: 'steps'
    };
  } else {
    // 대분수 → 가분수: 빈칸 = 분자(impN)
    return {
      prompt: {
        ko: whole + ' ' + rem + '/' + d + ' 를 가분수로 나타내요 (정수×분모+분자)',
        en: 'Convert the mixed number ' + whole + ' ' + rem + '/' + d + ' to an improper fraction',
        zh: '把带分数 ' + whole + ' ' + rem + '/' + d + ' 化为假分数'
      },
      tex: whole + '\\frac{' + rem + '}{' + d + '} = \\frac{\\square}{' + d + '}',
      answer: impN,
      answerType: 'steps',
      steps: [
        { tex: whole + ' \\times ' + d + ' + ' + rem + ' = \\square', blank: impN },
        { tex: '\\frac{' + impN + '}{' + d + '}', blank: impN }
      ],
      widget: 'steps'
    };
  }
};

/* ============================================================
   FR3 — 대분수 덧·뺄 (동분모)
   ============================================================ */
NM_TGEN['fr3_mixedAddSub'] = function(params, rng){
  var regroup = params && params.regroup;

  if(!regroup){
    // 올림·내림 없는 덧셈
    var d      = pick(rng, [4,6,8]);
    var a_n    = R(rng, 1, d-2);
    var b_n    = R(rng, 1, d-1-a_n);
    var a_w    = R(rng, 1, 5);
    var b_w    = R(rng, 1, 3);
    var res_n  = a_n + b_n;
    var res_w  = a_w + b_w;

    return {
      prompt: {
        ko: '정수끼리, 분수끼리 따로 더해요!',
        en: 'Add the whole numbers and the fractions separately!',
        zh: '整数和分数分别相加！'
      },
      tex: a_w + '\\frac{' + a_n + '}{' + d + '} + ' + b_w + '\\frac{' + b_n + '}{' + d + '} = \\square\\frac{' + res_n + '}{' + d + '}',
      answer: res_w,
      answerType: 'steps',
      steps: [
        { tex: '\\text{정수: } ' + a_w + ' + ' + b_w + ' = \\square', blank: res_w },
        { tex: '\\text{분자: } ' + a_n + ' + ' + b_n + ' = \\square', blank: res_n }
      ],
      widget: 'steps'
    };
  } else {
    // 분수 부분 내림(받아내림) 있는 뺄셈
    var d   = pick(rng, [4,6]);
    var a_n = R(rng, 1, 3);
    var b_n = R(rng, a_n+1, d-1);   // b_n > a_n → 받아내림 필요
    var a_w = R(rng, 2, 5);
    var b_w = R(rng, 1, a_w-1);
    var fracPart = d + a_n - b_n;   // 1을 빌린 뒤 분자 차
    var wholePart = a_w - 1 - b_w;

    return {
      prompt: {
        ko: '분수 부분이 부족하면 정수에서 1을 빌려요!',
        en: 'When the fraction part is too small, borrow 1 from the whole number!',
        zh: '分数部分不够减时，从整数借1！'
      },
      tex: a_w + '\\frac{' + a_n + '}{' + d + '} - ' + b_w + '\\frac{' + b_n + '}{' + d + '}',
      answer: wholePart,
      answerType: 'steps',
      steps: [
        { tex: '\\text{분수: } \\frac{' + (d+a_n) + '}{' + d + '} - \\frac{' + b_n + '}{' + d + '} = \\frac{\\square}{' + d + '} \\quad(1\\text{을 빌림})', blank: fracPart },
        { tex: '\\text{정수: } ' + (a_w-1) + ' - ' + b_w + ' = \\square', blank: wholePart }
      ],
      widget: 'steps'
    };
  }
};

/* ============================================================
   FR4 — 이분모 덧·뺄 (통분)
   ============================================================ */
NM_TGEN['fr4_unlikeAddSub'] = function(params, rng){
  var mixed = params && params.mixed;
  var op    = pick(rng, ['+', '-']);

  // 분모 두 개 선택 (서로 다르게)
  var dList = [2,3,4,5,6];
  var d1    = pick(rng, dList);
  var d2Choices = dList.filter(function(x){ return x !== d1; });
  var d2    = pick(rng, d2Choices);
  var LCD   = lcm(d1, d2);
  var m1    = LCD / d1;
  var m2    = LCD / d2;

  var a_n, b_n, resN, resD, tex, promptSuffix;

  if(!mixed){
    // 진분수
    a_n = R(rng, 1, d1-1);
    b_n = R(rng, 1, d2-1);
    var conv_a = a_n * m1;
    var conv_b = b_n * m2;

    if(op === '+'){
      resN = conv_a + conv_b;
      resD = LCD;
    } else {
      // 빼기: 더 큰 쪽이 앞에
      if(conv_a < conv_b){
        var tmp = a_n; a_n = b_n; b_n = tmp;
        var tmpD = d1; d1 = d2; d2 = tmpD;
        var tmpM = m1; m1 = m2; m2 = tmpM;
        conv_a = a_n * m1;
        conv_b = b_n * m2;
      }
      resN = conv_a - conv_b;
      resD = LCD;
    }
    var s = simplify(resN, resD);

    return {
      prompt: {
        ko: '분모를 통분해요! 최소공배수(LCM) = ' + LCD,
        en: 'Find a common denominator first! LCM = ' + LCD,
        zh: '先通分！最小公倍数(LCM) = ' + LCD
      },
      tex: '\\frac{' + a_n + '}{' + d1 + '} ' + op + ' \\frac{' + b_n + '}{' + d2 + '}',
      answer: resN,   // 통분 후 분자
      answerType: 'steps',
      steps: [
        { tex: '\\text{최소공배수: } \\square', blank: LCD },
        { tex: '\\frac{' + (a_n*m1) + '}{' + LCD + '} ' + op + ' \\frac{' + (b_n*m2) + '}{' + LCD + '} = \\frac{\\square}{' + LCD + '}', blank: resN }
      ],
      widget: 'steps'
    };
  } else {
    // 대분수
    var a_w = R(rng, 1, 4);
    var b_w = R(rng, 1, 3);
    a_n = R(rng, 1, d1-1);
    b_n = R(rng, 1, d2-1);
    var conv_a = a_n * m1;
    var conv_b = b_n * m2;

    var rw, rn;
    if(op === '+'){
      rw = a_w + b_w;
      rn = conv_a + conv_b;
      if(rn >= LCD){ rw += 1; rn -= LCD; }
    } else {
      if(a_w < b_w || (a_w === b_w && conv_a < conv_b)){
        var tmp = a_w; a_w = b_w; b_w = tmp;
        var tmp2 = a_n; a_n = b_n; b_n = tmp2;
        var tmpD = d1; d1 = d2; d2 = tmpD;
        var tmpM = m1; m1 = m2; m2 = tmpM;
        conv_a = a_n * m1;
        conv_b = b_n * m2;
      }
      rw = a_w - b_w;
      rn = conv_a - conv_b;
      if(rn < 0){ rw -= 1; rn += LCD; }
    }

    return {
      prompt: {
        ko: '대분수 이분모! 분수 부분만 통분해요. LCM = ' + LCD,
        en: 'Mixed number with unlike denominators — convert the fraction parts. LCM = ' + LCD,
        zh: '带分数异分母——只通分分数部分。LCM = ' + LCD
      },
      tex: a_w + '\\frac{' + a_n + '}{' + d1 + '} ' + op + ' ' + b_w + '\\frac{' + b_n + '}{' + d2 + '}',
      answer: rw,
      answerType: 'steps',
      steps: [
        { tex: '\\text{LCM: } \\square', blank: LCD },
        { tex: '\\text{분수: } \\frac{' + conv_a + '}{' + LCD + '} ' + op + ' \\frac{' + conv_b + '}{' + LCD + '} = \\frac{\\square}{' + LCD + '}', blank: Math.abs(conv_a - conv_b) },
        { tex: '\\text{정수: } \\square', blank: rw }
      ],
      widget: 'steps'
    };
  }
};

/* ============================================================
   FR5 — 약분·기약분수
   ============================================================ */
NM_TGEN['fr5_simplify'] = function(params, rng){
  var dOptions = [4,6,8,9,12,15,16,18,20,24];
  var d = pick(rng, dOptions);

  // g: d를 나누는 약수 중 2,3,4 에서 선택
  var gOptions = [2,3,4].filter(function(g){ return d % g === 0 && Math.floor(d/g) >= 2; });
  if(gOptions.length === 0){ gOptions = [2]; }
  var g = pick(rng, gOptions);

  // n은 g의 배수이고 d보다 작아야 함
  var maxK = Math.floor(d/g) - 1;
  if(maxK < 1){ maxK = 1; }
  var k = R(rng, 1, maxK);
  var n = k * g;

  var sn = n / g;
  var sd = d / g;

  return {
    prompt: {
      ko: '분자와 분모를 공약수 ' + g + ' 로 나눠요!',
      en: 'Divide both numerator and denominator by their common factor ' + g,
      zh: '分子和分母同除以公因数 ' + g
    },
    tex: '\\frac{' + n + '}{' + d + '} = \\frac{\\square}{' + sd + '}',
    answer: sn,
    answerType: 'steps',
    steps: [
      { tex: '\\frac{' + n + ' \\div ' + g + '}{' + d + ' \\div ' + g + '} = \\frac{\\square}{' + sd + '}', blank: sn }
    ],
    widget: 'steps'
  };
};

/* ============================================================
   FR6 — 분수 곱셈
   ============================================================ */
NM_TGEN['fr6_frMul'] = function(params, rng){
  var mode = (params && params.mode) || 'pp';

  if(mode === 'pp'){
    // 진분수 × 진분수
    var a_n = R(rng, 1, 5);
    var a_d = R(rng, a_n+1, Math.max(a_n+2, 6));
    var b_n = R(rng, 1, 5);
    var b_d = R(rng, b_n+1, Math.max(b_n+2, 6));
    var pn  = a_n * b_n;
    var pd  = a_d * b_d;
    var s   = simplify(pn, pd);

    return {
      prompt: {
        ko: '분수 곱셈: 분자끼리, 분모끼리 곱해요!',
        en: 'Multiply fractions: numerator × numerator, denominator × denominator!',
        zh: '分数乘法：分子乘分子，分母乘分母！'
      },
      tex: '\\frac{' + a_n + '}{' + a_d + '} \\times \\frac{' + b_n + '}{' + b_d + '} = \\frac{\\square}{' + s.d + '}',
      answer: s.n,
      answerType: 'steps',
      steps: [
        { tex: '\\text{분자: } ' + a_n + ' \\times ' + b_n + ' = \\square', blank: pn },
        { tex: '\\text{분모: } ' + a_d + ' \\times ' + b_d + ' = \\square', blank: pd },
        { tex: '\\frac{' + pn + '}{' + pd + '} = \\frac{\\square}{' + s.d + '} \\quad (\\text{약분})', blank: s.n }
      ],
      widget: 'steps'
    };
  } else if(mode === 'mixed'){
    // 자연수 × 진분수
    var whole = R(rng, 2, 9);
    var b_n   = R(rng, 1, 5);
    var b_d   = R(rng, b_n+1, Math.max(b_n+2, 7));
    var pn    = whole * b_n;
    var pd    = b_d;
    var s     = simplify(pn, pd);

    return {
      prompt: {
        ko: '자연수와 분수의 곱: 자연수를 분자에 곱해요!',
        en: 'Whole number × fraction: multiply the whole number by the numerator!',
        zh: '整数乘分数：整数与分子相乘！'
      },
      tex: whole + ' \\times \\frac{' + b_n + '}{' + b_d + '} = \\frac{\\square}{' + s.d + '}',
      answer: s.n,
      answerType: 'steps',
      steps: [
        { tex: whole + ' \\times ' + b_n + ' = \\square \\quad (\\text{분자끼리})', blank: pn },
        { tex: '\\frac{' + pn + '}{' + pd + '} = \\frac{\\square}{' + s.d + '} \\quad (\\text{약분})', blank: s.n }
      ],
      widget: 'steps'
    };
  } else {
    // three: 세 진분수 곱
    var a_n = R(rng, 1, 3); var a_d = R(rng, a_n+1, 5);
    var b_n = R(rng, 1, 3); var b_d = R(rng, b_n+1, 5);
    var c_n = R(rng, 1, 3); var c_d = R(rng, c_n+1, 5);
    var pn  = a_n * b_n * c_n;
    var pd  = a_d * b_d * c_d;
    var s   = simplify(pn, pd);

    return {
      prompt: {
        ko: '세 분수를 곱해요: 분자 셋, 분모 셋을 각각 곱해요!',
        en: 'Multiply three fractions: multiply all numerators, then all denominators!',
        zh: '三个分数相乘：分子全乘，分母全乘！'
      },
      tex: '\\frac{' + a_n + '}{' + a_d + '} \\times \\frac{' + b_n + '}{' + b_d + '} \\times \\frac{' + c_n + '}{' + c_d + '} = \\frac{\\square}{' + s.d + '}',
      answer: s.n,
      answerType: 'steps',
      steps: [
        { tex: '\\text{분자: } ' + a_n + ' \\times ' + b_n + ' \\times ' + c_n + ' = \\square', blank: pn },
        { tex: '\\text{분모: } ' + a_d + ' \\times ' + b_d + ' \\times ' + c_d + ' = \\square', blank: pd },
        { tex: '\\frac{' + pn + '}{' + pd + '} = \\frac{\\square}{' + s.d + '} \\quad (\\text{약분})', blank: s.n }
      ],
      widget: 'steps'
    };
  }
};

/* ============================================================
   FR7 — 분수 나눗셈
   ============================================================ */
NM_TGEN['fr7_frDiv'] = function(params, rng){
  var a_n = R(rng, 1, 5);
  var a_d = R(rng, a_n+1, Math.max(a_n+2, 7));
  var b_n = R(rng, 1, 5);
  var b_d = R(rng, b_n+1, Math.max(b_n+2, 7));

  // a/a_d ÷ b_n/b_d = a_n/a_d × b_d/b_n
  var pn = a_n * b_d;
  var pd = a_d * b_n;
  var s  = simplify(pn, pd);

  return {
    prompt: {
      ko: '나누기는 역수의 곱셈! ÷를 ×로 바꾸고 역수를 곱해요',
      en: 'Division = multiply by the reciprocal! Flip the second fraction and multiply',
      zh: '除法变乘法！把第二个分数翻转后相乘'
    },
    tex: '\\frac{' + a_n + '}{' + a_d + '} \\div \\frac{' + b_n + '}{' + b_d + '} = \\frac{\\square}{' + s.d + '}',
    answer: s.n,
    answerType: 'steps',
    steps: [
      { tex: '\\frac{' + a_n + '}{' + a_d + '} \\times \\frac{' + b_d + '}{' + b_n + '} \\quad (\\text{역수를 곱해요})', blank: a_n * b_d },
      { tex: '= \\frac{' + pn + '}{' + pd + '} = \\frac{\\square}{' + s.d + '} \\quad (\\text{약분})', blank: s.n }
    ],
    widget: 'steps'
  };
};

/* ============================================================
   FR8 — 분수 ↔ 소수 변환
   ============================================================ */
NM_TGEN['fr8_frDec'] = function(params, rng){
  var commonFractions = [
    {n:1, d:2,  dec:50,  decStr:'0.50'},
    {n:1, d:4,  dec:25,  decStr:'0.25'},
    {n:3, d:4,  dec:75,  decStr:'0.75'},
    {n:1, d:5,  dec:20,  decStr:'0.20'},
    {n:2, d:5,  dec:40,  decStr:'0.40'},
    {n:3, d:5,  dec:60,  decStr:'0.60'},
    {n:4, d:5,  dec:80,  decStr:'0.80'},
    {n:1, d:10, dec:10,  decStr:'0.10'},
    {n:3, d:10, dec:30,  decStr:'0.30'},
    {n:7, d:10, dec:70,  decStr:'0.70'},
    {n:1, d:20, dec:5,   decStr:'0.05'},
    {n:1, d:25, dec:4,   decStr:'0.04'},
    {n:1, d:50, dec:2,   decStr:'0.02'}
  ];

  var fr  = pick(rng, commonFractions);
  var dir = pick(rng, [0, 1]); // 0=분수→소수, 1=소수→분수

  if(dir === 0){
    // 분수 → 소수: answer = dec (이미 정수, ×100 스케일)
    return {
      prompt: {
        ko: '분수를 소수로 나타내요 (' + fr.n + '÷' + fr.d + ' 를 계산). 답은 ×100 한 값 (예: 0.25→25)',
        en: 'Convert to decimal (' + fr.n + '÷' + fr.d + '). Enter the value ×100 (e.g. 0.25→25)',
        zh: '把分数化为小数（' + fr.n + '÷' + fr.d + '）。填入×100后的整数（如0.25→25）'
      },
      tex: '\\frac{' + fr.n + '}{' + fr.d + '} = 0.\\square \\quad (\\times 100 \\text{ 한 값})',
      answer: fr.dec,
      answerType: 'steps',
      steps: [
        { tex: fr.n + ' \\div ' + fr.d + ' = ' + fr.decStr + ' \\quad \\Rightarrow \\times 100 = \\square', blank: fr.dec }
      ],
      widget: 'steps'
    };
  } else {
    // 소수 → 분수: answer = 분자(n)
    return {
      prompt: {
        ko: '소수를 분수로! ' + fr.decStr + ' = ?/' + fr.d,
        en: 'Convert decimal to fraction! ' + fr.decStr + ' = ?/' + fr.d,
        zh: '小数化分数！' + fr.decStr + ' = ?/' + fr.d
      },
      tex: fr.decStr + ' = \\frac{\\square}{' + fr.d + '}',
      answer: fr.n,
      answerType: 'number',
      widget: 'numpad'
    };
  }
};

/* ============================================================
   FR0 — 분수 알기 (부분과 전체) · 개념 도입
   분모 = 전체를 똑같이 나눈 조각 수, 분자 = 부분.
   mode: 'part'(먹은 부분) | 'rest'(남은 부분, steps)
   ============================================================ */
NM_TGEN['fr0_partWhole'] = function(params, rng){
  var lv = params.level || 'main';
  var dMax = lv === 'practice' ? 6 : 10;
  var d = R(rng, lv === 'practice' ? 3 : 4, dMax);
  var n = R(rng, 1, d - 1);
  var FOOD = [
    {ko:'피자', en:'pizza', zh:'比萨'},
    {ko:'초콜릿', en:'chocolate bar', zh:'巧克力'},
    {ko:'수박', en:'watermelon', zh:'西瓜'},
    {ko:'케이크', en:'cake', zh:'蛋糕'}
  ];
  var f = pick(rng, FOOD);
  var mode = pick(rng, ['part','rest']);

  if(mode === 'part'){
    return {
      prompt:{
        ko: f.ko+'를 똑같이 '+d+'조각으로 나눠 '+n+'조각을 먹었어요. 먹은 부분은 전체의 몇 분의 몇? 분자를 써요!',
        en: 'A '+f.en+' is cut into '+d+' equal pieces and you ate '+n+'. What fraction did you eat? Enter the numerator!',
        zh: '把'+f.zh+'平均分成'+d+'块，吃了'+n+'块。吃掉的是全部的几分之几？填分子！'
      },
      tex: '\\text{먹은 부분} = \\dfrac{\\square}{'+d+'}',
      answer: n,
      answerType: 'number',
      widget: 'numpad'
    };
  }

  /* rest: 남은 조각 = d-n */
  var rest = d - n;
  return {
    prompt:{
      ko: f.ko+'를 똑같이 '+d+'조각으로 나눠 '+n+'조각을 먹었어요. 남은 부분은 전체의 몇 분의 몇일까요?',
      en: 'A '+f.en+' is cut into '+d+' equal pieces and '+n+' were eaten. What fraction is left?',
      zh: '把'+f.zh+'平均分成'+d+'块，吃了'+n+'块。剩下的是全部的几分之几？'
    },
    tex: '\\text{남은 부분} = \\dfrac{\\square}{'+d+'}',
    answer: rest,
    answerType: 'steps',
    widget: 'steps',
    steps: [
      { tex: d+' - '+n+' = \\square \\;\\text{(남은 조각)}', blank: rest },
      { tex: '\\text{남은 부분} = \\dfrac{\\square}{'+d+'}', blank: rest }
    ]
  };
};

})();
