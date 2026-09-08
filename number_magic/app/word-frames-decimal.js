/* ── 소수 문장제 프레임 (2026-09-08) ─────────────────────────────
   exam.js의 wordifyExtended가 소수 식(desc.kind==='dec')을 넘기면 여기서
   문장(ko/en/zh) + 단위만 만든다. 답은 절대 계산·언급하지 않는다 —
   문장만 만든다, 답은 엔진이 계산한다(wordAnswerTex가 rhs 형태로 채점용
   표기를 만듦). 숫자(desc.a/desc.b)도 절대 바꾸지 않고 그대로 쓴다.

   소수는 반드시 "잴 수 있는 양"(길이·거리·들이·무게)에만 붙인다 —
   "사과 0.3개"처럼 셀 수 있는 사물에는 절대 붙이지 않는다. 그래서 사물
   목록은 WP_ITEMS(사과·구슬 등, 정수 문장제용)와 별개로 이 파일 안에
   길이·거리·들이·무게 재료 표를 따로 둔다. */
(function(){
  'use strict';

  window.NM_WORD_FRAMES = window.NM_WORD_FRAMES || {};

  /* 재료 표 — 전부 단위가 있는(잴 수 있는) 양만. kind로 자연스러운
     동사(마시다/사용하다/걷다)를 고른다. pack은 "묶음" 표현(×÷ 문항)에 쓴다. */
  var TABLE = [
    {ko:'리본', en:'ribbon', zh:'丝带', kind:'length',
      unit:{ko:'m', en:'m', zh:'米'}, pack:{ko:'도막', en:'piece', zh:'段'}},
    {ko:'끈', en:'string', zh:'绳子', kind:'length',
      unit:{ko:'m', en:'m', zh:'米'}, pack:{ko:'도막', en:'piece', zh:'段'}},
    {ko:'산책길', en:'trail', zh:'小路', kind:'distance',
      unit:{ko:'km', en:'km', zh:'公里'}, pack:{ko:'구간', en:'segment', zh:'段'}},
    {ko:'물', en:'water', zh:'水', kind:'liquid',
      unit:{ko:'L', en:'L', zh:'升'}, pack:{ko:'병', en:'bottle', zh:'瓶'}},
    {ko:'우유', en:'milk', zh:'牛奶', kind:'liquid',
      unit:{ko:'L', en:'L', zh:'升'}, pack:{ko:'팩', en:'carton', zh:'盒'}},
    {ko:'주스', en:'juice', zh:'果汁', kind:'liquid',
      unit:{ko:'L', en:'L', zh:'升'}, pack:{ko:'병', en:'bottle', zh:'瓶'}},
    {ko:'밀가루', en:'flour', zh:'面粉', kind:'weight',
      unit:{ko:'kg', en:'kg', zh:'千克'}, pack:{ko:'봉지', en:'bag', zh:'袋'}},
    {ko:'감자', en:'potato', zh:'土豆', kind:'weight',
      unit:{ko:'kg', en:'kg', zh:'千克'}, pack:{ko:'봉지', en:'bag', zh:'袋'}},
    {ko:'설탕', en:'sugar', zh:'糖', kind:'weight',
      unit:{ko:'kg', en:'kg', zh:'千克'}, pack:{ko:'봉지', en:'bag', zh:'袋'}}
  ];

  /* kind별 동사 — +·−·×(반복) 문항에 쓴다. koAdn=과거 관형형("마신 물은"),
     koPastQ=과거 의문형("마셨을까요", 물음표는 호출부에서 붙인다). */
  var KIND = {
    length:  {verb:{koPast:'사용했어요', koPastQ:'사용했을까요', koAdn:'사용한',
                     enPast:'used', enBase:'use', zhPast:'用了'}},
    weight:  {verb:{koPast:'사용했어요', koPastQ:'사용했을까요', koAdn:'사용한',
                     enPast:'used', enBase:'use', zhPast:'用了'}},
    liquid:  {verb:{koPast:'마셨어요', koPastQ:'마셨을까요', koAdn:'마신',
                     enPast:'drank', enBase:'drink', zhPast:'喝了'}},
    distance:{verb:{koPast:'걸었어요', koPastQ:'걸었을까요', koAdn:'걸은',
                     enPast:'walked', enBase:'walk', zhPast:'走了'}}
  };

  /* 숫자+단위 표기 — ko·en은 "0.9 L"처럼 띄어 쓰고, zh는 "0.9升"처럼 붙인다. */
  function NU(n, u){ return n + ' ' + u; }

  /* 단위 기호는 한글이 아니라서 kJosa(한글 배치임 검사)가 못 잡는다.
     실제 발음 기준: m·km·L → "미터/킬로미터/리터"(받침 없음 → 를/가/는),
     kg → "킬로그램"(받침 ㅁ 있음 → 을/이/은). */
  function uJosa(unitKo, withBatchim, without){
    return unitKo === 'kg' ? withBatchim : without;
  }

  function pickItem(ctx){
    return ctx.pickUnused(TABLE, ctx.rng, ctx.used.items);
  }
  function pickName(ctx){
    return ctx.pickUnused(ctx.names, ctx.rng, ctx.used.names);
  }

  /* ── + : 두 양 합치기 / 어제·오늘 ─────────────────────────── */
  function caseAdd(desc, ctx){
    var item = pickItem(ctx);
    var kind = KIND[item.kind], unit = item.unit;
    var who = pickName(ctx);
    var nameJ = ctx.kJosa(who.ko, '이는', '는');
    var variant = (ctx.rng() * 2) | 0;

    if(variant === 0){
      var who2 = pickName(ctx);
      var name2J = ctx.kJosa(who2.ko, '이는', '는');
      return {
        ko: nameJ + ' ' + ctx.kJosa(item.ko, '을', '를') + ' ' + NU(desc.a, unit.ko) + ', ' +
            name2J + ' ' + NU(desc.b, unit.ko) + ' ' + kind.verb.koPast + '. 두 사람이 ' +
            kind.verb.koAdn + ' ' + ctx.kJosa(item.ko, '은', '는') + ' 모두 몇 ' + unit.ko + '일까요?',
        en: who.en + ' ' + kind.verb.enPast + ' ' + desc.a + ' ' + unit.en + ' of ' + item.en +
            ' and ' + who2.en + ' ' + kind.verb.enPast + ' ' + desc.b + ' ' + unit.en +
            '. How many ' + unit.en + ' of ' + item.en + ' did they ' + kind.verb.enBase + ' in all?',
        zh: who.zh + kind.verb.zhPast + desc.a + unit.zh + item.zh + '，' + who2.zh + kind.verb.zhPast +
            desc.b + unit.zh + '。两人一共' + kind.verb.zhPast + '多少' + unit.zh + item.zh + '？',
        unit: unit
      };
    }
    return {
      ko: nameJ + ' ' + ctx.kJosa(item.ko, '을', '를') + ' 어제 ' + NU(desc.a, unit.ko) + ', 오늘 ' +
          NU(desc.b, unit.ko) + ' ' + kind.verb.koPast + '. 이틀 동안 모두 몇 ' + unit.ko + ' ' +
          kind.verb.koPastQ + '?',
      en: who.en + ' ' + kind.verb.enPast + ' ' + desc.a + ' ' + unit.en + ' of ' + item.en +
          ' yesterday and ' + desc.b + ' ' + unit.en + ' today. How many ' + unit.en + ' did ' +
          who.pr.toLowerCase() + ' ' + kind.verb.enBase + ' in the two days?',
      zh: who.zh + '昨天' + kind.verb.zhPast + desc.a + unit.zh + item.zh + '，今天又' + kind.verb.zhPast +
          desc.b + unit.zh + '。两天一共' + kind.verb.zhPast + '多少' + unit.zh + '？',
      unit: unit
    };
  }

  /* ── − : 남은 양 / 두 사람 비교(a ≥ b 보장) ───────────────── */
  function caseSub(desc, ctx){
    var item = pickItem(ctx);
    var kind = KIND[item.kind], unit = item.unit;
    var who = pickName(ctx);
    var nameJ = ctx.kJosa(who.ko, '이는', '는');
    var variant = (ctx.rng() * 2) | 0;

    if(variant === 0 && item.kind === 'distance'){
      /* 길은 "가지고 있다"가 안 된다(렌더 확인, 2026-09-08) — 길이가 얼마인 길을 얼마 걸었나로. */
      return {
        ko: item.ko + ' 한 바퀴는 ' + NU(desc.a, unit.ko) + '예요. ' + nameJ + ' 그중 ' + NU(desc.b, unit.ko) +
            uJosa(unit.ko, '을', '를') + ' ' + kind.verb.koPast + '. 남은 길은 몇 ' + unit.ko + '일까요?',
        en: 'The ' + item.en + ' is ' + desc.a + ' ' + unit.en + ' long. ' + who.en + ' ' + kind.verb.enPast +
            ' ' + desc.b + ' ' + unit.en + ' of it. How many ' + unit.en + ' are left?',
        zh: item.zh + '全长' + desc.a + unit.zh + '，' + who.zh + kind.verb.zhPast + desc.b + unit.zh +
            '。还剩多少' + unit.zh + '？',
        unit: unit
      };
    }
    if(variant === 0){
      return {
        ko: nameJ + ' ' + ctx.kJosa(item.ko, '을', '를') + ' ' + NU(desc.a, unit.ko) +
            ' 가지고 있었는데 그중 ' + NU(desc.b, unit.ko) + uJosa(unit.ko, '을', '를') + ' ' +
            kind.verb.koPast + '. 남은 ' + ctx.kJosa(item.ko, '은', '는') + ' 몇 ' + unit.ko + '일까요?',
        en: who.en + ' had ' + desc.a + ' ' + unit.en + ' of ' + item.en + '. ' + who.pr + ' ' +
            kind.verb.enPast + ' ' + desc.b + ' ' + unit.en + ' of it. How many ' + unit.en + ' are left?',
        zh: who.zh + '原来有' + desc.a + unit.zh + item.zh + '，' + kind.verb.zhPast + desc.b + unit.zh +
            '。还剩多少' + unit.zh + '？',
        unit: unit
      };
    }
    var who2 = pickName(ctx);
    var name2J = ctx.kJosa(who2.ko, '이는', '는');
    return {
      ko: nameJ + ' ' + ctx.kJosa(item.ko, '을', '를') + ' ' + NU(desc.a, unit.ko) + ', ' +
          name2J + ' ' + NU(desc.b, unit.ko) + ' ' + kind.verb.koPast + '. ' +
          ctx.kJosa(who.ko, '이가', '가') + ' 몇 ' + unit.ko + ' 더 많이 ' + kind.verb.koPastQ + '?',
      en: who.en + ' ' + kind.verb.enPast + ' ' + desc.a + ' ' + unit.en + ' of ' + item.en +
          ' and ' + who2.en + ' ' + kind.verb.enPast + ' ' + desc.b + ' ' + unit.en +
          '. How many more ' + unit.en + ' did ' + who.en + ' ' + kind.verb.enBase + '?',
      zh: who.zh + kind.verb.zhPast + desc.a + unit.zh + item.zh + '，' + who2.zh + kind.verb.zhPast +
          desc.b + unit.zh + '。' + who.zh + '比' + who2.zh + '多' + kind.verb.zhPast + '多少' + unit.zh + '？',
      unit: unit
    };
  }

  /* ── × (정수×소수 또는 소수×정수) : 봉지/병 묶음 또는 반복 횟수 ──── */
  function caseMulInt(desc, ctx){
    var item = pickItem(ctx);
    var unit = item.unit, pack = item.pack;
    var intStr, decStr;
    if(desc.aIsInt){ intStr = desc.a; decStr = desc.b; }
    else { intStr = desc.b; decStr = desc.a; }
    var intNum = +intStr;
    var variant = (ctx.rng() * 2) | 0;

    if(variant === 0){
      return {
        ko: item.ko + ' ' + NU(decStr, unit.ko) + '짜리 ' + pack.ko + ' ' + intNum +
            '개는 모두 몇 ' + unit.ko + '일까요?',
        en: 'Each ' + pack.en + ' holds ' + decStr + ' ' + unit.en + ' of ' + item.en +
            '. How many ' + unit.en + ' are in ' + intNum + ' ' +
            (intNum === 1 ? pack.en : pack.en + 's') + '?',
        zh: '每' + pack.zh + '装' + decStr + unit.zh + item.zh + '，' + intNum + pack.zh +
            '一共有多少' + unit.zh + '？',
        unit: unit
      };
    }
    var kind = KIND[item.kind];
    var who = pickName(ctx);
    var nameJ = ctx.kJosa(who.ko, '이는', '는');
    return {
      ko: nameJ + ' ' + ctx.kJosa(item.ko, '을', '를') + ' 한 번에 ' + NU(decStr, unit.ko) +
          '씩 ' + intNum + '번 ' + kind.verb.koPast + '. 모두 몇 ' + unit.ko + ' ' +
          kind.verb.koPastQ + '?',
      en: who.en + ' ' + kind.verb.enPast + ' ' + decStr + ' ' + unit.en + ' of ' + item.en +
          ' each time, ' + intNum + ' times in all. How many ' + unit.en + ' did ' +
          who.pr.toLowerCase() + ' ' + kind.verb.enBase + ' in total?',
      zh: who.zh + '每次' + kind.verb.zhPast + decStr + unit.zh + item.zh + '，一共' +
          kind.verb.zhPast + intNum + '次。一共' + kind.verb.zhPast + '多少' + unit.zh + '？',
      unit: unit
    };
  }

  /* ── × (소수×소수) : 넓이(가로×세로) 또는 배 ─────────────────── */
  function caseMulDec(desc, ctx){
    var variant = (ctx.rng() * 2) | 0;
    if(variant === 0){
      return {
        ko: '가로가 ' + desc.a + ' m, 세로가 ' + desc.b + ' m인 화단이 있어요. 이 화단의 넓이는 몇 m²일까요?',
        en: 'A flower bed is ' + desc.a + ' m wide and ' + desc.b + ' m long. What is the area of the flower bed in m²?',
        zh: '一个花坛长' + desc.a + '米，宽' + desc.b + '米。这个花坛的面积是多少平方米？',
        unit: {ko:'m²', en:'m²', zh:'平方米'}
      };
    }
    var item = pickItem(ctx);
    var unit = item.unit;
    var who = pickName(ctx);
    var nameJ = ctx.kJosa(who.ko, '이는', '는');
    return {
      ko: nameJ + ' ' + ctx.kJosa(item.ko, '을', '를') + ' ' + NU(desc.a, unit.ko) +
          ' 가지고 있어요. 그 양의 ' + desc.b + '배는 몇 ' + unit.ko + '일까요?',
      en: who.en + ' has ' + desc.a + ' ' + unit.en + ' of ' + item.en + '. What is ' + desc.b +
          ' times that amount, in ' + unit.en + '?',
      zh: who.zh + '有' + desc.a + unit.zh + item.zh + '。这个量的' + desc.b + '倍是多少' + unit.zh + '？',
      unit: unit
    };
  }

  /* ── ÷ (소수÷정수) : 사람 수로 등분 ──────────────────────────── */
  function caseDivInt(desc, ctx){
    var item = pickItem(ctx);
    var unit = item.unit, pack = item.pack, b = desc.b;
    var variant = (ctx.rng() * 2) | 0;

    if(variant === 0){
      return {
        ko: item.ko + ' ' + NU(desc.a, unit.ko) + uJosa(unit.ko, '을', '를') + ' ' + b +
            '명이 똑같이 나누면 한 사람은 몇 ' + unit.ko + '일까요?',
        en: b + ' people share ' + desc.a + ' ' + unit.en + ' of ' + item.en +
            ' equally. How many ' + unit.en + ' does each person get?',
        zh: desc.a + unit.zh + item.zh + '由' + b + '人平分。每人分到多少' + unit.zh + '？',
        unit: unit
      };
    }
    if(item.kind === 'distance'){
      /* 길은 그릇에 "담지" 않는다(렌더 확인, 2026-09-08) — 같은 길이의 구간으로 나눈다. */
      return {
        ko: item.ko + ' ' + NU(desc.a, unit.ko) + uJosa(unit.ko, '을', '를') + ' 길이가 같은 구간 ' + b +
            '개로 나누었어요. 구간 하나는 몇 ' + unit.ko + '일까요?',
        en: 'A ' + item.en + ' ' + desc.a + ' ' + unit.en + ' long is divided into ' + b +
            ' equal segments. How many ' + unit.en + ' is each segment?',
        zh: desc.a + unit.zh + '的' + item.zh + '平均分成' + b + '段。每段长多少' + unit.zh + '？',
        unit: unit
      };
    }
    return {
      ko: item.ko + ' ' + NU(desc.a, unit.ko) + uJosa(unit.ko, '이', '가') + ' 있어요. 이것을 ' +
          pack.ko + ' ' + b + '개에 똑같이 나누어 담으면 ' + pack.ko + ' 하나에는 몇 ' +
          unit.ko + '씩 담기게 될까요?',
      en: 'There are ' + desc.a + ' ' + unit.en + ' of ' + item.en + '. If it is divided equally into ' +
          b + ' ' + pack.en + 's, how many ' + unit.en + ' go into each ' + pack.en + '?',
      zh: '有' + desc.a + unit.zh + item.zh + '。平均分成' + b + pack.zh + '，每' + pack.zh +
          '装多少' + unit.zh + '？',
      unit: unit
    };
  }

  /* ── ÷ (소수÷소수) : 포함제(몇 병/봉지) 또는 몇 배 ───────────── */
  function caseDivDec(desc, ctx){
    var item = pickItem(ctx);
    var unit = item.unit, pack = item.pack;
    var variant = (ctx.rng() * 2) | 0;

    if(variant === 0){
      return {
        ko: item.ko + ' ' + NU(desc.a, unit.ko) + uJosa(unit.ko, '이', '가') + ' 있어요. ' +
            pack.ko + ' 하나에 ' + NU(desc.b, unit.ko) + '씩이라면 모두 몇 ' +
            ctx.kJosa(pack.ko, '이', '가') + ' 될까요?',
        en: item.en.charAt(0).toUpperCase() + item.en.slice(1) + ': ' + desc.a + ' ' + unit.en +
            ' in total. How many ' + pack.en + 's of ' + desc.b + ' ' + unit.en + ' does that make?',
        zh: item.zh + '一共' + desc.a + unit.zh + '。每' + pack.zh + desc.b + unit.zh +
            '，可以分成多少' + pack.zh + '？',
        unit: pack
      };
    }
    return {
      ko: item.ko + ' ' + NU(desc.a, unit.ko) + uJosa(unit.ko, '은', '는') + ' ' +
          NU(desc.b, unit.ko) + '의 몇 배일까요?',
      en: desc.a + ' ' + unit.en + ' of ' + item.en + ' is how many times ' + desc.b + ' ' + unit.en + '?',
      zh: desc.a + unit.zh + item.zh + '是' + desc.b + unit.zh + '的多少倍？',
      unit: {ko:'배', en:'times', zh:'倍'}
    };
  }

  window.NM_WORD_FRAMES.decimal = function(desc, ctx){
    try {
      if(!desc || desc.kind !== 'dec' || !ctx) return null;
      var w = null;
      switch(desc.op){
        case '+': w = caseAdd(desc, ctx); break;
        case '−': case '-': w = caseSub(desc, ctx); break;
        case '×':
          w = (desc.aIsInt || desc.bIsInt) ? caseMulInt(desc, ctx) : caseMulDec(desc, ctx);
          break;
        case '÷':
          w = desc.bIsInt ? caseDivInt(desc, ctx) : caseDivDec(desc, ctx);
          break;
        default: return null;
      }
      if(!w || !w.ko || !w.en || !w.zh || !w.unit) return null;
      return { ko:w.ko, en:w.en, zh:w.zh, unit:w.unit };
    } catch(e){ return null; }
  };
})();
