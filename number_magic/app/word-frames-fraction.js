/* Numbers of Magic — 분수 문장제 프레임 (app/word-frames-fraction.js)
   exam.js 의 wordifyExtended 가 분수식 "a ○ b = □" 을 서술자(desc)로 풀어
   window.NM_WORD_FRAMES.fraction(desc, ctx) 로 넘긴다. 이 파일은 그 함수 하나다.

   규칙: **문장만 만든다, 답은 엔진이.** 답을 계산하지도, 문장에 적지도 않는다
   (정답지는 exam.js 의 wordAnswerTex 가 rhs 형태와 p.answer 로 따로 찍는다).
   숫자는 desc.aStr·desc.bStr 을 그대로 쓴다 — 통분·약분·순서를 바꾸면 드릴과
   어긋난다. 분수는 평문 '1/3', 대분수는 '4 1/4'(aStr 이 이미 그 꼴이다).
   무작위는 ctx.rng 만 쓴다(인쇄 재현성 — Math.random 금지).

   소재는 **잴 수 있는 것**(m·L·kg)이 기본이다. '조각'은 분모가 같은 덧셈에서만
   쓴다 — 크기가 다른 조각끼리는 더해지지 않아 문장이 거짓말이 된다.
   부분의 부분(분수×분수)은 답이 "전체의 몇 분의 몇"이라 단위를 비운다.
   자연스러운 상황을 못 만들면 null 을 돌려준다(엔진이 다른 드릴로 대체한다). */
(function(){
'use strict';

/* 단위 — koObj 는 뒤에 붙는 을/를(m=미터·L=리터 → 를, kg=킬로그램 → 을). */
var U_M  = {ko:'m',  koObj:'를', enLong:'meters',    zh:'米'};
var U_L  = {ko:'L',  koObj:'를', enLong:'liters',    zh:'升'};
var U_KG = {ko:'kg', koObj:'을', enLong:'kilograms', zh:'千克'};

/* 동사 — ko=[과거종결, 연결(-고), 관형(과거), 현재종결] · en=[과거, 원형, 3인칭] · zh=[과거, 원형] */
var V_USE   = {ko:['썼어요','쓰고','쓴','써요'],           en:['used','use','uses'],     zh:['用了','用']};
var V_DRINK = {ko:['마셨어요','마시고','마신','마셔요'],   en:['drank','drink','drinks'],zh:['喝了','喝']};
var V_EAT   = {ko:['먹었어요','먹고','먹은','먹어요'],     en:['ate','eat','eats'],      zh:['吃了','吃']};

/* kind: len(길이)·liq(부피)·wt(무게) — 곱셈·나눗셈의 그릇말이 여기서 갈린다. */
var MATS = [
  {ko:'리본',   en:'ribbon', zh:'丝带', u:U_M,  kind:'len', v:V_USE},
  {ko:'끈',     en:'string', zh:'绳子', u:U_M,  kind:'len', v:V_USE},
  {ko:'주스',   en:'juice',  zh:'果汁', u:U_L,  kind:'liq', v:V_DRINK},
  {ko:'우유',   en:'milk',   zh:'牛奶', u:U_L,  kind:'liq', v:V_DRINK},
  {ko:'물',     en:'water',  zh:'水',   u:U_L,  kind:'liq', v:V_DRINK},
  {ko:'밀가루', en:'flour',  zh:'面粉', u:U_KG, kind:'wt',  v:V_USE},
  {ko:'쌀',     en:'rice',   zh:'大米', u:U_KG, kind:'wt',  v:V_USE},
  {ko:'사과',   en:'apples', zh:'苹果', u:U_KG, kind:'wt',  v:V_EAT}
];
/* 담는 그릇 — ×(무엇에 나누어 담았나) / ÷(무엇에 나누어 담을까).
   len 은 그릇이 아니라 '도막'이라 프레임을 따로 쓴다. */
var CX = { liq:{ko:'병',   en:['bottle','bottles'], zh:'瓶'},
           wt: {ko:'봉지', en:['bag','bags'],       zh:'袋'} };
var CD = { liq:{ko:'컵',   en:['cup','cups'],       zh:'杯'},
           wt: {ko:'봉지', en:['bag','bags'],       zh:'袋'} };

/* 아래 둘은 항목이 2개뿐이라 ctx.used.items(8개 표 기준 index 집합)로 뽑지 않는다 —
   같은 집합에 index 를 섞으면 소재 표 쪽 중복 방지가 망가진다. rng 로만 고른다. */
var ROUND = [
  {ko:'피자',   koWhole:'한 판', koPiece:'조각', en:'pizza', enSlice:'slices',
   zhWhole:'一张比萨', zhThis:'这张比萨', zhPiece:'块'},
  {ko:'케이크', koWhole:'한 개', koPiece:'조각', en:'cake',  enSlice:'pieces',
   zhWhole:'一个蛋糕', zhThis:'这个蛋糕', zhPiece:'块'}
];
var FIELDS = [
  {ko:'밭',   en:'field',      zh:'田地', pKo:'감자', pEn:'potatoes', pZh:'土豆'},
  {ko:'화단', en:'flower bed', zh:'花坛', pKo:'꽃',   pEn:'flowers',  pZh:'花'}
];

function isProper(f){ return f.w === 0 && f.d > 1 && f.n < f.d; }

window.NM_WORD_FRAMES = window.NM_WORD_FRAMES || {};
window.NM_WORD_FRAMES.fraction = function(desc, ctx){
  if(!desc || desc.kind !== 'frac' || !ctx) return null;
  var rng = ctx.rng, used = ctx.used || {}, kJosa = ctx.kJosa, enCount = ctx.enCount;
  var pick = ctx.pickUnused;
  if(desc.aIsInt && desc.bIsInt) return null;   /* 정수끼리는 정수 문장제(parseVert)의 몫 */

  var A = desc.aStr, B = desc.bStr;
  var M  = pick(MATS, rng, used.items);
  var U  = M.u, uk = U.ko, uz = U.zh, uL = U.enLong;
  var mat = M.ko, matJ = kJosa(mat,'을','를'), matTop = kJosa(mat,'은','는'),
      matSub = kJosa(mat,'이','가');
  var me = M.en, mz = M.zh, V = M.v;

  var who  = pick(ctx.names, rng, used.names);
  var nameJ = kJosa(who.ko,'이는','는'), nameSub = kJosa(who.ko,'이가','가');
  var pr = who.pr, prLow = who.pr.toLowerCase();
  var who2 = null, name2J = '';
  function second(){
    if(!who2){ who2 = pick(ctx.names, rng, used.names); name2J = kJosa(who2.ko,'이는','는'); }
    return who2;
  }
  var UNIT = {ko:uk, en:uk, zh:uz};
  var NOUNIT = {ko:'', en:'', zh:''};
  function out(ko,en,zh,unit){ return {ko:ko, en:en, zh:zh, unit:unit||UNIT}; }

  /* ── 덧셈 ───────────────────────────────────────────── */
  if(desc.op === '+'){
    /* 조각(피자·케이크)은 분모가 같은 진분수끼리일 때만 — 다른 크기의 조각은 더해지지 않는다. */
    var canSlice = desc.sameDen && isProper(desc.a) && isProper(desc.b);
    var f = (rng() * (canSlice ? 3 : 2)) | 0;
    if(canSlice && f === 2){
      var R = ROUND[(rng()*ROUND.length)|0], d = desc.a.d;
      second();
      return out(
        R.ko + ' ' + kJosa(R.koWhole,'을','를') + ' 똑같이 ' + d + R.koPiece + '으로 나누었어요. ' +
          nameJ + ' 그중 ' + A + '만큼 먹고, ' + name2J + ' ' + B + '만큼 먹었어요. ' +
          '두 사람이 먹은 ' + kJosa(R.ko,'은','는') + ' ' + R.koWhole + '의 얼마일까요?',
        'A ' + R.en + ' is cut into ' + d + ' equal ' + R.enSlice + '. ' +
          who.en + ' eats ' + A + ' of it and ' + who2.en + ' eats ' + B + '. ' +
          'How much of the whole ' + R.en + ' do they eat together?',
        R.zhWhole + '平均分成' + d + R.zhPiece + '。' + who.zh + '吃了其中的' + A + '，' +
          who2.zh + '吃了' + B + '。两人一共吃了' + R.zhThis + '的几分之几？',
        NOUNIT);
    }
    if(f === 1){
      second();
      return out(
        nameJ + ' ' + matJ + ' ' + A + ' ' + uk + ', ' + name2J + ' ' + B + ' ' + uk +
          ' 가지고 있어요. 두 사람이 가진 ' + matTop + ' 모두 몇 ' + uk + '일까요?',
        who.en + ' has ' + A + ' ' + uk + ' of ' + me + ' and ' + who2.en + ' has ' + B + ' ' + uk +
          '. How many ' + uL + ' of ' + me + ' do they have together?',
        who.zh + '有' + A + uz + mz + '，' + who2.zh + '有' + B + uz + '。两人一共有多少' + uz + '？');
    }
    return out(
      nameJ + ' ' + matJ + ' 오전에 ' + A + ' ' + uk + ' ' + V.ko[1] + ', 오후에 ' + B + ' ' + uk +
        ' 더 ' + V.ko[0] + '. ' + nameSub + ' ' + V.ko[2] + ' ' + matTop + ' 모두 몇 ' + uk + '일까요?',
      who.en + ' ' + V.en[0] + ' ' + A + ' ' + uk + ' of ' + me + ' in the morning and ' + B + ' ' + uk +
        ' more in the afternoon. How many ' + uL + ' of ' + me + ' did ' + prLow + ' ' + V.en[1] + ' in all?',
      who.zh + '上午' + V.zh[0] + A + uz + mz + '，下午又' + V.zh[0] + B + uz + '。' +
        who.zh + '一共' + V.zh[0] + '多少' + uz + '？');
  }

  /* ── 뺄셈 (a ≥ b 는 엔진이 보장) ───────────────────── */
  if(desc.op === '−' || desc.op === '-'){
    var g = (rng()*3)|0;
    if(g === 1){
      second();
      return out(
        nameJ + ' ' + matJ + ' ' + A + ' ' + uk + ', ' + name2J + ' ' + B + ' ' + uk +
          ' 가지고 있어요. ' + nameSub + ' 몇 ' + uk + ' 더 많을까요?',
        who.en + ' has ' + A + ' ' + uk + ' of ' + me + ' and ' + who2.en + ' has ' + B + ' ' + uk +
          '. How many ' + uL + ' more does ' + who.en + ' have?',
        who.zh + '有' + A + uz + mz + '，' + who2.zh + '有' + B + uz + '。' +
          who.zh + '比' + who2.zh + '多多少' + uz + '？');
    }
    if(g === 2){
      return out(
        nameJ + ' ' + matJ + ' ' + A + ' ' + uk + ' 가지고 있었어요. 그중 ' + B + ' ' + uk + U.koObj +
          ' 친구에게 주었어요. ' + kJosa(who.ko,'이에게','에게') + ' 남은 ' + matTop + ' 몇 ' + uk + '일까요?',
        who.en + ' had ' + A + ' ' + uk + ' of ' + me + ' and gave ' + B + ' ' + uk +
          ' to a friend. How many ' + uL + ' of ' + me + ' does ' + who.en + ' have left?',
        who.zh + '原来有' + A + uz + mz + '，送给朋友' + B + uz + '。' + who.zh + '还剩多少' + uz + '？');
    }
    return out(
      matSub + ' ' + A + ' ' + uk + ' 있었어요. ' + nameJ + ' 그중 ' + B + ' ' + uk + U.koObj + ' ' +
        V.ko[0] + '. 남은 ' + matTop + ' 몇 ' + uk + '일까요?',
      'There is ' + A + ' ' + uk + ' of ' + me + '. ' + who.en + ' ' + V.en[0] + ' ' + B + ' ' + uk +
        ' of it. How many ' + uL + ' of ' + me + ' are left?',
      '有' + A + uz + mz + '。' + who.zh + V.zh[0] + B + uz + '。还剩多少' + uz + '？');
  }

  /* ── 곱셈 ───────────────────────────────────────────── */
  if(desc.op === '×'){
    if(desc.aIsInt || desc.bIsInt){
      /* 정수 × 분수 — 정수는 개수, 분수는 하나에 담긴 양. */
      var iw  = desc.aIsInt ? desc.a.w : desc.b.w;
      var N   = String(iw);
      var F   = desc.aIsInt ? B : A;
      if(iw < 1) return null;                       /* 0묶음은 상황이 안 만들어진다 */
      var h = (rng()*2)|0;
      if(h === 1){
        return out(
          nameJ + ' 하루에 ' + matJ + ' ' + F + ' ' + uk + '씩 ' + V.ko[3] + '. ' + N + '일 동안 ' +
            V.ko[2] + ' ' + matTop + ' 모두 몇 ' + uk + '일까요?',
          who.en + ' ' + V.en[2] + ' ' + F + ' ' + uk + ' of ' + me + ' each day. How many ' + uL +
            ' of ' + me + ' does ' + prLow + ' ' + V.en[1] + ' in ' + enCount(iw, ['day','days']) + '?',
          who.zh + '每天' + V.zh[1] + F + uz + mz + '。' + N + '天一共' + V.zh[0] + '多少' + uz + '？');
      }
      if(M.kind === 'len'){
        return out(
          nameJ + ' ' + matJ + ' ' + F + ' ' + uk + '씩 ' + N + '도막 잘랐어요. 자른 ' + matTop +
            ' 모두 몇 ' + uk + '일까요?',
          who.en + ' cuts ' + enCount(iw, ['piece','pieces']) + ' of ' + me + ', ' + (iw > 1 ? 'each ' : '') +
            F + ' ' + uk + ' long. How many ' + uL + ' of ' + me + ' is that in all?',
          who.zh + '把' + mz + '剪成' + N + '段，每段' + F + uz + '。剪下的' + mz + '一共有多少' + uz + '？');
      }
      var cx = CX[M.kind];
      return out(
        matJ + ' 한 ' + cx.ko + '에 ' + F + ' ' + uk + '씩 담았어요. ' + N + cx.ko + '에 담은 ' +
          matTop + ' 모두 몇 ' + uk + '일까요?',
        'Each ' + cx.en[0] + ' holds ' + F + ' ' + uk + ' of ' + me + '. How many ' + uL + ' of ' + me +
          ' are in ' + enCount(iw, cx.en) + '?',
        '每' + cx.zh + '装' + F + uz + mz + '。' + N + cx.zh + '一共装多少' + uz + '？');
    }
    if(isProper(desc.a) && isProper(desc.b)){
      /* 부분의 부분 — 답이 "전체의 몇 분의 몇"이라 단위를 비운다. */
      var FD = FIELDS[(rng()*FIELDS.length)|0];
      var plantJ = kJosa(FD.pKo,'을','를');   /* 감자를 · 꽃을 */
      if(((rng()*2)|0) === 1){
        return out(
          FD.ko + ' 전체의 ' + A + '에 ' + plantJ + ' 심었어요. ' + nameJ + ' ' + plantJ +
            ' 심은 곳의 ' + B + '에 거름을 주었어요. 거름을 준 곳은 ' + FD.ko + ' 전체의 얼마일까요?',
          FD.pEn.charAt(0).toUpperCase() + FD.pEn.slice(1) + ' are planted on ' + A + ' of a ' + FD.en +
            '. ' + who.en + ' spreads compost on ' + B + ' of the part with ' + FD.pEn +
            '. What part of the whole ' + FD.en + ' gets compost?',
          '整块' + FD.zh + '的' + A + '种了' + FD.pZh + '。' + who.zh + '给种' + FD.pZh + '部分的' + B +
            '施了肥。施肥的地方是整块' + FD.zh + '的几分之几？',
          NOUNIT);
      }
      return out(
        nameJ + ' ' + FD.ko + ' 전체의 ' + A + '에 ' + plantJ + ' 심었어요. 그리고 ' + plantJ +
          ' 심은 곳의 ' + B + '에 물을 주었어요. 물을 준 곳은 ' + FD.ko + ' 전체의 얼마일까요?',
        who.en + ' plants ' + FD.pEn + ' on ' + A + ' of a ' + FD.en + '. ' + pr + ' waters ' + B +
          ' of the part with ' + FD.pEn + '. What part of the whole ' + FD.en + ' is watered?',
        who.zh + '在整块' + FD.zh + '的' + A + '上种了' + FD.pZh + '，又给种' + FD.pZh + '部分的' + B +
          '浇了水。浇水的地方是整块' + FD.zh + '的几分之几？',
        NOUNIT);
    }
    /* 대분수·가분수끼리 — '전체의 얼마'로는 말이 안 되니 시간당 양으로 푼다. */
    return out(
      nameJ + ' 한 시간에 ' + matJ + ' ' + A + ' ' + uk + '씩 ' + V.ko[3] + '. ' + B + '시간 동안 ' +
        V.ko[2] + ' ' + matTop + ' 모두 몇 ' + uk + '일까요?',
      who.en + ' ' + V.en[2] + ' ' + A + ' ' + uk + ' of ' + me + ' in one hour. How many ' + uL +
        ' of ' + me + ' does ' + prLow + ' ' + V.en[1] + ' in ' + B + ' hours?',
      who.zh + '每小时' + V.zh[1] + A + uz + mz + '。' + B + '小时一共' + V.zh[0] + '多少' + uz + '？');
  }

  /* ── 나눗셈 ─────────────────────────────────────────── */
  if(desc.op === '÷'){
    var bVal = desc.b.w + (desc.b.d ? desc.b.n / desc.b.d : 0);
    if(!bVal) return null;
    var TIMES = {ko:'배', en:'times', zh:'倍'};
    function byTimes(){
      second();
      return out(
        nameJ + ' ' + matJ + ' ' + A + ' ' + uk + ', ' + name2J + ' ' + B + ' ' + uk +
          ' 가지고 있어요. ' + nameSub + ' 가진 ' + matTop + ' ' + kJosa(who2.ko,'이가','가') + ' 가진 것의 몇 배일까요?',
        who.en + ' has ' + A + ' ' + uk + ' of ' + me + ' and ' + who2.en + ' has ' + B + ' ' + uk +
          '. ' + who.en + "'s amount is how many times as much as " + who2.en + "'s?",
        who.zh + '有' + A + uz + mz + '，' + who2.zh + '有' + B + uz + '。' + who.zh + '的量是' +
          who2.zh + '的多少倍？',
        TIMES);
    }
    if(desc.bIsInt){
      /* 분수 ÷ 정수 — 똑같이 나누어 갖기. 1명·0명은 상황이 안 되니 제외. */
      if(desc.b.w < 2) return null;
      if(((rng()*2)|0) === 1) return byTimes();
      return out(
        mat + ' ' + A + ' ' + uk + U.koObj + ' ' + B + '명이 똑같이 나누어 가져요. 한 명이 갖는 ' + matTop +
          ' 몇 ' + uk + '일까요?',
        A + ' ' + uk + ' of ' + me + ' is shared equally among ' + enCount(desc.b.w, ['child','children']) +
          '. How many ' + uL + ' does each child get?',
        '把' + A + uz + mz + '平均分给' + B + '个人。每人分到多少' + uz + '？');
    }
    /* 몫이 1보다 작으면(1/6 ÷ 1/2) "몇 봉지"·"몇 도막"의 답이 1/3봉지·1/2도막이 돼 상황이
       어색하다 — 그때는 '몇 배' 틀만 쓴다(2026-09-08, 렌더 확인 중 발견). */
    var aVal = desc.a.w + (desc.a.d ? desc.a.n / desc.a.d : 0);
    if(aVal < bVal) return byTimes();
    if(((rng()*2)|0) === 1) return byTimes();
    if(M.kind === 'len'){
      return out(
        matJ + ' ' + A + ' ' + uk + ' 준비했어요. 한 도막이 ' + B + ' ' + uk +
          '가 되도록 자르면 몇 도막이 될까요?',
        'There is ' + A + ' ' + uk + ' of ' + me + '. If each piece is ' + B + ' ' + uk +
          ' long, how many pieces will there be?',
        '有' + A + uz + mz + '。每段剪' + B + uz + '，可以剪成多少段？',
        {ko:'도막', en:'pieces', zh:'段'});
    }
    var cd = CD[M.kind];
    return out(
      matJ + ' ' + A + ' ' + uk + ' 준비했어요. 한 ' + cd.ko + '에 ' + B + ' ' + uk + '씩 담으면 몇 ' +
        kJosa(cd.ko,'이','가') + ' 될까요?',
      'There is ' + A + ' ' + uk + ' of ' + me + '. If each ' + cd.en[0] + ' holds ' + B + ' ' + uk +
        ', how many ' + cd.en[1] + ' will there be?',
      '有' + A + uz + mz + '。每' + cd.zh + '装' + B + uz + '，可以装多少' + cd.zh + '？',
      {ko:cd.ko, en:cd.en[1], zh:cd.zh});
  }

  return null;
};
})();
