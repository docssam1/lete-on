/* Numbers of Magic — 평균·비율 문장제 프레임 (app/word-frames-ratio.js)
   exam.js의 wordifyExtended가 평균식(desc.kind==='avg')과 비율식(desc.kind==='pct')을
   서술자(desc)로 풀어 window.NM_WORD_FRAMES.average(desc,ctx) /
   window.NM_WORD_FRAMES.percent(desc,ctx)로 넘긴다. 이 파일은 그 두 함수다.

   규칙(단 하나): **문장만 만든다. 답은 엔진이 계산한다.**
   여기서는 절대 평균·비율을 계산하거나 답을 문장에 적지 않는다 — desc에 이미 들어있는
   숫자(nums/avg/part/base/pct)를 그대로 문장에 끼워 넣을 뿐이다. 무작위는 ctx.rng만
   쓴다(인쇄 재현성 — Math.random 금지). 이름은 항상 ctx.pickUnused로 뽑아 회차 안에서
   겹치지 않게 한다. */
(function(){
'use strict';

window.NM_WORD_FRAMES = window.NM_WORD_FRAMES || {};

/* ── 공용 헬퍼 ──────────────────────────────────────────────── */

/* 한글 목록 — 값마다 단위를 붙여 쉼표로 나열한다("19점, 9점, 14점").
   Korean textbook 관례상 마지막 값에만 단위를 붙이지 않고 전부 붙인다. */
function koJoinNums(vals, unitKo){
  return vals.map(function(v){ return v + unitKo; }).join(', ');
}
/* 영어 목록 — 옥스퍼드 콤마로 나열, 단위는 끝에 한 번만("19, 9, and 14 points"). */
function enJoinNums(vals){
  if(vals.length === 1) return vals[0];
  if(vals.length === 2) return vals[0] + ' and ' + vals[1];
  return vals.slice(0, -1).join(', ') + ', and ' + vals[vals.length - 1];
}
/* 중국어 목록 — 돈절(、)로 나열, 단위는 값마다("19分、9分、14分"). 중국어는 단·복수
   구별이 없어 나머지 헬퍼들과 달리 개수(1개/여러개)에 따라 문장을 바꿀 필요가 없다. */
function zhJoinNums(vals, unitZh){
  return vals.map(function(v){ return v + unitZh; }).join('、');
}

/* ══════════════════════════════════════════════════════════════
   평균 — average(desc, ctx)
   desc: { kind:'avg', nums:[...], k, blankIndex, avg }
   blankIndex === -1  → nums 전부가 주어지고 평균을 구한다.
   blankIndex >= 0    → avg가 주어지고, nums 중 하나(항상 나머지를 다 알고 남는 한 개,
                         곧 "마지막 것")를 구한다. \square는 절대 문장에 찍지 않는다.
   ══════════════════════════════════════════════════════════════ */

/* 소재 8종 — 초등 고학년이 실생활에서 만나는 것들. 5개는 "한 사람이 여러 번"(trial:true),
   3개는 "여러 사람을 각각 잰다"(trial:false, 학급 단위)로 나눠 자연스러운 상황을 만든다.
   전부 8개(≥6)라 ctx.used.items로 뽑아도 셋을 오염시키지 않는다(회차 안에서 소재가
   겹치지 않게). */
var AVG_MATS = [
  { id:'score',    trial:true,  unit:{ko:'점', en:'points',   zh:'分'} },
  { id:'jump',     trial:true,  unit:{ko:'번', en:'jumps',    zh:'次'} },
  { id:'pages',    trial:true,  unit:{ko:'쪽', en:'pages',    zh:'页'} },
  { id:'stickers', trial:true,  unit:{ko:'장', en:'stickers', zh:'张'} },
  { id:'time',     trial:true,  unit:{ko:'분', en:'minutes',  zh:'分钟'} },
  { id:'height',   trial:false, min:110, unit:{ko:'cm', en:'cm',       zh:'厘米'} },
  { id:'weight',   trial:false, min:20,  unit:{ko:'kg', en:'kg',       zh:'千克'} },
  { id:'distance', trial:false, min:40,  unit:{ko:'m',  en:'m',        zh:'米'} }
];
/* min — 그 소재가 말이 되는 최소 크기(2026-09-08, 렌더 확인 중 발견). EL4 가 내는 수는
   1~30 이라 "키가 각각 6cm, 1cm, 2cm" 같은 문장이 나왔다. 문항의 가장 작은 수가 min 에
   못 미치면 그 소재를 후보에서 뺀다. min 이 없는 소재(점수·횟수·쪽수·장수·분)는 크기와
   무관하므로 늘 남아, 후보가 비는 일은 없다. */
function matsFor(nums){
  var lo = Infinity;
  for(var i=0;i<nums.length;i++){ var v = +nums[i]; if(isFinite(v)) lo = Math.min(lo, v); }
  var pool = AVG_MATS.filter(function(m){ return !m.min || lo >= m.min; });
  return pool.length ? pool : AVG_MATS.filter(function(m){ return !m.min; });
}

/* blankIndex>=0일 때 "알고 있는 값이 1개뿐"(k=2)이면 "처음 3번은 각각 ~"류의 복수
   서술이 어색해진다("처음 1번은 각각 19점" 같은 것). 개수(kk)에 따라 서술을 바꿔
   주는 조각들 — 한글 조사는 전부 고정 어휘(다음 절 참고)라 kJosa 없이 직접 쓴다. */
function koCountWord(kk){ return kk === 1 ? '' : ('처음 ' + kk + '번의 '); }
function koEach(kk){ return kk === 1 ? '' : '각각 '; }
function koFirstGroup(kk){ return kk === 1 ? '첫 번째 학생의' : ('처음 ' + kk + '명의'); }
/* singularVerb/pluralVerb는 과거형 하나만 받는다("was"/"were", "took"/"took",
   "ran"/"ran") — 예전엔 plural 문자열에 동사를 미리 넣어 불러서 "were were"·
   "was was"처럼 동사가 겹치는 버그가 있었다(2026-09-08 검증 중 발견·수정). */
function enFirst(kk, singularNoun, pluralNoun, singularVerb, pluralVerb){
  return kk === 1 ? ('The first ' + singularNoun + ' ' + singularVerb)
                   : ('The first ' + kk + ' ' + pluralNoun + ' ' + pluralVerb);
}
/* 중국어는 단·복수 활용이 없어 다른 언어만큼 위험하지 않지만, "前1次…分别是"
   (하나뿐인데 "각각")는 그래도 어색하다 — kk===1이면 "前"+숫자 대신 "第一"를,
   "分别是" 대신 "是"를 쓴다. counterNoun은 "次"·"天"·"名学生"처럼 세는 말. */
function zhLead(kk, counterNoun){ return kk === 1 ? '第一' + counterNoun : ('前' + kk + counterNoun); }
function zhBe(kk){ return kk === 1 ? '是' : '分别是'; }

/* ── 직접형(blankIndex===-1) — nums 전부의 평균을 구한다 ─────────── */
function avgDirect(mat, who, nameJ, k, nums, qi, ctx){
  var u = mat.unit;
  var koList = koJoinNums(nums, u.ko);
  var enList = enJoinNums(nums);
  var zhList = zhJoinNums(nums, u.zh);
  var prLow = who.pr.toLowerCase();

  switch(mat.id){
    case 'score': {
      var qKo = qi === 0 ? '평균 점수는 몇 ' + u.ko + '일까요?'
                          : '받은 점수의 평균은 몇 ' + u.ko + '일까요?';
      var qEn = qi === 0 ? 'What was the average score, in ' + u.en + '?'
                          : 'What is the average of these scores, in ' + u.en + '?';
      var qZh = qi === 0 ? '平均分数是多少' + u.zh + '？'
                          : '这些分数的平均数是多少' + u.zh + '？';
      return {
        ko: nameJ + ' 수학 시험을 ' + k + '번 봤어요. 점수가 각각 ' + koList + '이었어요. ' + qKo,
        en: who.en + ' took ' + k + ' math tests. ' + who.en + "'s scores were " + enList + ' ' + u.en + '. ' + qEn,
        zh: who.zh + '参加了' + k + '次数学考试，分数分别是' + zhList + '。' + qZh
      };
    }
    case 'jump': {
      var qKo2 = qi === 0 ? '평균 횟수는 몇 ' + u.ko + '일까요?'
                           : '줄넘기 횟수의 평균은 몇 ' + u.ko + '일까요?';
      var qEn2 = qi === 0 ? 'What was the average number of jumps?'
                           : 'What is the average of these jump counts?';
      var qZh2 = qi === 0 ? '平均跳绳次数是多少次？'
                           : '这些次数的平均数是多少次？';
      return {
        ko: nameJ + ' 줄넘기를 ' + k + '번 했어요. 매번 넘은 횟수가 각각 ' + koList + '이었어요. ' + qKo2,
        en: who.en + ' jumped rope ' + k + ' times. ' + who.pr + ' jumped ' + enList + ' ' + u.en + ' each round. ' + qEn2,
        zh: who.zh + '跳了' + k + '次绳，每次跳的次数分别是' + zhList + '。' + qZh2
      };
    }
    case 'pages': {
      var qKo3 = qi === 0 ? '하루 평균 몇 ' + u.ko + '을 읽었을까요?'
                           : '읽은 쪽수의 평균은 몇 ' + u.ko + '일까요?';
      var qEn3 = qi === 0 ? 'On average, how many ' + u.en + ' did ' + prLow + ' read per day?'
                           : 'What is the average number of ' + u.en + ' read per day?';
      var qZh3 = qi === 0 ? '平均每天读多少' + u.zh + '？'
                           : '每天读的页数平均是多少' + u.zh + '？';
      return {
        ko: nameJ + ' ' + k + '일 동안 매일 책을 읽었어요. 하루에 읽은 쪽수가 각각 ' + koList + '이었어요. ' + qKo3,
        en: who.en + ' read a book every day for ' + k + ' days. ' + who.pr + ' read ' + enList + ' ' + u.en + ' each day. ' + qEn3,
        zh: who.zh + '连续' + k + '天每天都读书，每天读的页数分别是' + zhList + '。' + qZh3
      };
    }
    case 'stickers': {
      var qKo4 = qi === 0 ? '하루 평균 몇 ' + u.ko + '을 모았을까요?'
                           : '모은 붙임딱지 수의 평균은 몇 ' + u.ko + '일까요?';
      var qEn4 = qi === 0 ? 'On average, how many ' + u.en + ' did ' + prLow + ' collect per day?'
                           : 'What is the average number of ' + u.en + ' collected per day?';
      var qZh4 = qi === 0 ? '平均每天收集多少' + u.zh + '？'
                           : '每天收集的张数平均是多少' + u.zh + '？';
      return {
        ko: nameJ + ' ' + k + '일 동안 붙임딱지를 모았어요. 하루에 모은 붙임딱지 수가 각각 ' + koList + '이었어요. ' + qKo4,
        en: who.en + ' collected stickers for ' + k + ' days. ' + who.pr + ' collected ' + enList + ' ' + u.en + ' each day. ' + qEn4,
        zh: who.zh + '连续' + k + '天收集贴纸，每天收集的张数分别是' + zhList + '。' + qZh4
      };
    }
    case 'time': {
      var qKo5 = qi === 0 ? '평균 몇 ' + u.ko + '이 걸렸을까요?'
                           : '걸린 시간의 평균은 몇 ' + u.ko + '일까요?';
      var qEn5 = qi === 0 ? 'On average, how many ' + u.en + ' did it take?'
                           : 'What is the average time it took, in ' + u.en + '?';
      var qZh5 = qi === 0 ? '平均用了多少' + u.zh + '？'
                           : '用的时间平均是多少' + u.zh + '？';
      return {
        ko: nameJ + ' 달리기를 ' + k + '번 했어요. 걸린 시간이 각각 ' + koList + '이었어요. ' + qKo5,
        en: who.en + ' went running ' + k + ' times. It took ' + enList + ' ' + u.en + ' each time. ' + qEn5,
        zh: who.zh + '跑步' + k + '次，每次用的时间分别是' + zhList + '。' + qZh5
      };
    }
    case 'height': {
      var qKo6 = qi === 0 ? '학생들의 평균 키는 몇 ' + u.ko + '일까요?'
                           : '키의 평균은 몇 ' + u.ko + '일까요?';
      var qEn6 = qi === 0 ? "What was the students' average height, in " + u.en + '?'
                           : 'What is the average of these heights, in ' + u.en + '?';
      var qZh6 = qi === 0 ? '学生们的平均身高是多少' + u.zh + '？'
                           : '这些身高的平均数是多少' + u.zh + '？';
      return {
        ko: who.ko + '네 반 학생 ' + k + '명의 키를 쟀어요. 키가 각각 ' + koList + '이었어요. ' + qKo6,
        en: who.en + "'s class measured the height of " + k + ' students. Their heights were ' + enList + ' ' + u.en + '. ' + qEn6,
        zh: who.zh + '班上测量了' + k + '名学生的身高，身高分别是' + zhList + '。' + qZh6
      };
    }
    case 'weight': {
      var qKo7 = qi === 0 ? '학생들의 평균 몸무게는 몇 ' + u.ko + '일까요?'
                           : '몸무게의 평균은 몇 ' + u.ko + '일까요?';
      var qEn7 = qi === 0 ? "What was the students' average weight, in " + u.en + '?'
                           : 'What is the average of these weights, in ' + u.en + '?';
      var qZh7 = qi === 0 ? '学生们的平均体重是多少' + u.zh + '？'
                           : '这些体重的平均数是多少' + u.zh + '？';
      return {
        ko: who.ko + '네 반 학생 ' + k + '명의 몸무게를 쟀어요. 몸무게가 각각 ' + koList + '이었어요. ' + qKo7,
        en: who.en + "'s class measured the weight of " + k + ' students. Their weights were ' + enList + ' ' + u.en + '. ' + qEn7,
        zh: who.zh + '班上测量了' + k + '名学生的体重，体重分别是' + zhList + '。' + qZh7
      };
    }
    case 'distance': {
      var qKo8 = qi === 0 ? '학생들이 달린 평균 거리는 몇 ' + u.ko + '일까요?'
                           : '달린 거리의 평균은 몇 ' + u.ko + '일까요?';
      var qEn8 = qi === 0 ? 'What was the average distance the students ran, in ' + u.en + '?'
                           : 'What is the average of these distances, in ' + u.en + '?';
      var qZh8 = qi === 0 ? '学生们跑的平均距离是多少' + u.zh + '？'
                           : '这些距离的平均数是多少' + u.zh + '？';
      return {
        ko: who.ko + '네 반 학생 ' + k + '명이 달리기 대회에서 달린 거리를 재었어요. 거리가 각각 ' + koList + '이었어요. ' + qKo8,
        en: who.en + "'s class measured how far " + k + ' students ran in a race. The distances were ' + enList + ' ' + u.en + '. ' + qEn8,
        zh: who.zh + '班上测量了' + k + '名学生在跑步比赛中跑的距离，距离分别是' + zhList + '。' + qZh8
      };
    }
    default: return null;
  }
}

/* ── 빠진 수형(blankIndex>=0) — nums 중 하나가 빈칸, avg는 주어짐.
   빠진 값은 항상 "마지막 것"으로 서술한다(계약서 지시). kk = 알고 있는 값 개수. ─── */
function avgMissing(mat, who, nameJ, k, known, avg, qi, ctx){
  var u = mat.unit;
  var kk = known.length;
  var koList = koJoinNums(known, u.ko);
  var enList = enJoinNums(known);
  var zhList = zhJoinNums(known, u.zh);

  switch(mat.id){
    case 'score': {
      var qKo = qi === 0 ? '마지막 시험 점수는 몇 ' + u.ko + '이었을까요?'
                          : '마지막으로 본 시험 점수는 몇 ' + u.ko + '이었을까요?';
      var qEn = qi === 0 ? 'What was the score on the last test?'
                          : 'How many ' + u.en + ' was the last test score?';
      return {
        ko: nameJ + ' 수학 시험을 ' + k + '번 봤어요. ' + (kk === 1 ? '첫 번째 ' + '점수는 ' : koCountWord(kk) + '점수는 ' + koEach(kk)) + koList + '이었어요. ' + k + '번의 평균 점수는 ' + avg + u.ko + '이었어요. ' + qKo,
        en: who.en + ' took ' + k + ' math tests. ' + enFirst(kk, 'score', 'scores', 'was', 'were') + ' ' + enList + ' ' + u.en + ', and the average of all ' + k + ' scores was ' + avg + ' ' + u.en + '. ' + qEn,
        zh: who.zh + '参加了' + k + '次数学考试。' + zhLead(kk, '次') + '的分数' + zhBe(kk) + zhList + '，' + k + '次的平均分是' + avg + u.zh + '。最后一次考试的分数是多少' + u.zh + '？'
      };
    }
    case 'jump': {
      var qKo2 = qi === 0 ? '마지막 회차에 넘은 횟수는 몇 ' + u.ko + '이었을까요?'
                           : '마지막으로 넘은 횟수는 몇 ' + u.ko + '이었을까요?';
      var qEn2 = qi === 0 ? 'How many jumps were there in the last round?'
                           : 'What was the jump count on the last round?';
      return {
        ko: nameJ + ' 줄넘기를 ' + k + '번 했어요. ' + (kk === 1 ? '첫 번째 횟수는 ' : koCountWord(kk) + '넘은 횟수는 ' + koEach(kk)) + koList + '이었어요. ' + k + '번의 평균 횟수는 ' + avg + u.ko + '이었어요. ' + qKo2,
        en: who.en + ' jumped rope ' + k + ' times. ' + enFirst(kk, 'round', 'rounds', 'was', 'were') + ' ' + enList + ' ' + u.en + ', and the average over all ' + k + ' rounds was ' + avg + ' ' + u.en + '. ' + qEn2,
        zh: who.zh + '跳了' + k + '次绳。' + zhLead(kk, '次') + '跳的次数' + zhBe(kk) + zhList + '，' + k + '次的平均次数是' + avg + u.zh + '。最后一次跳了多少' + u.zh + '？'
      };
    }
    case 'pages': {
      var qKo3 = qi === 0 ? '마지막 날 읽은 쪽수는 몇 ' + u.ko + '이었을까요?'
                           : '마지막 날에는 몇 ' + u.ko + '을 읽었을까요?';
      var qEn3 = qi === 0 ? 'How many ' + u.en + ' did ' + who.pr.toLowerCase() + ' read on the last day?'
                           : 'What was the last day' + "'" + 's page count?';
      return {
        ko: nameJ + ' ' + k + '일 동안 매일 책을 읽었어요. ' + (kk === 1 ? '첫째 날 읽은 쪽수는 ' : '처음 ' + kk + '일 동안 읽은 쪽수는 ' + koEach(kk)) + koList + '이었어요. ' + k + '일 동안의 평균은 ' + avg + u.ko + '이었어요. ' + qKo3,
        en: who.en + ' read a book every day for ' + k + ' days. ' + enFirst(kk, 'day', 'days', 'was', 'were') + ' ' + enList + ' ' + u.en + ', and the average over the ' + k + ' days was ' + avg + ' ' + u.en + '. ' + qEn3,
        zh: who.zh + '连续' + k + '天每天读书。' + zhLead(kk, '天') + '读的页数' + zhBe(kk) + zhList + '，' + k + '天的平均页数是' + avg + u.zh + '。最后一天读了多少' + u.zh + '？'
      };
    }
    case 'stickers': {
      var qKo4 = qi === 0 ? '마지막 날 모은 붙임딱지 수는 몇 ' + u.ko + '이었을까요?'
                           : '마지막 날에는 몇 ' + u.ko + '을 모았을까요?';
      var qEn4 = qi === 0 ? 'How many ' + u.en + ' did ' + who.pr.toLowerCase() + ' collect on the last day?'
                           : 'What was the last day' + "'" + 's sticker count?';
      return {
        ko: nameJ + ' ' + k + '일 동안 붙임딱지를 모았어요. ' + (kk === 1 ? '첫째 날 모은 개수는 ' : '처음 ' + kk + '일 동안 모은 붙임딱지 수는 ' + koEach(kk)) + koList + '이었어요. ' + k + '일 동안의 평균은 ' + avg + u.ko + '이었어요. ' + qKo4,
        en: who.en + ' collected stickers for ' + k + ' days. ' + enFirst(kk, 'day', 'days', 'was', 'were') + ' ' + enList + ' ' + u.en + ', and the average over the ' + k + ' days was ' + avg + ' ' + u.en + '. ' + qEn4,
        zh: who.zh + '连续' + k + '天收集贴纸。' + zhLead(kk, '天') + '收集的张数' + zhBe(kk) + zhList + '，' + k + '天的平均张数是' + avg + u.zh + '。最后一天收集了多少' + u.zh + '？'
      };
    }
    case 'time': {
      var qKo5 = qi === 0 ? '마지막으로 달렸을 때 걸린 시간은 몇 ' + u.ko + '이었을까요?'
                           : '마지막 기록은 몇 ' + u.ko + '이었을까요?';
      var qEn5 = qi === 0 ? 'How many ' + u.en + ' did the last run take?'
                           : 'What was the time for the last run, in ' + u.en + '?';
      return {
        ko: nameJ + ' 달리기를 ' + k + '번 했어요. ' + (kk === 1 ? '처음 걸린 시간은 ' : koCountWord(kk) + '걸린 시간은 ' + koEach(kk)) + koList + '이었어요. ' + k + '번의 평균 시간은 ' + avg + u.ko + '이었어요. ' + qKo5,
        en: who.en + ' went running ' + k + ' times. ' + enFirst(kk, 'run', 'runs', 'took', 'took') + ' ' + enList + ' ' + u.en + ', and the average over all ' + k + ' runs was ' + avg + ' ' + u.en + '. ' + qEn5,
        zh: who.zh + '跑步' + k + '次。' + zhLead(kk, '次') + '用的时间' + zhBe(kk) + zhList + '，' + k + '次的平均时间是' + avg + u.zh + '。最后一次跑步用了多少' + u.zh + '？'
      };
    }
    case 'height': {
      var qKo6 = qi === 0 ? '마지막 학생의 키는 몇 ' + u.ko + '이었을까요?'
                           : '마지막으로 잰 학생의 키는 몇 ' + u.ko + '이었을까요?';
      var qEn6 = qi === 0 ? 'How many ' + u.en + ' tall was the last student?'
                           : "What was the last student's height, in " + u.en + '?';
      return {
        ko: who.ko + '네 반 학생 ' + k + '명의 키를 쟀어요. ' + koFirstGroup(kk) + ' 키는 ' + koEach(kk) + koList + '이었어요. ' + k + '명의 평균 키는 ' + avg + u.ko + '이었어요. ' + qKo6,
        en: who.en + "'s class measured the height of " + k + ' students. ' + enFirst(kk, 'student', 'students', 'was', 'were') + ' ' + enList + ' ' + u.en + ', and the average height of all ' + k + ' students was ' + avg + ' ' + u.en + '. ' + qEn6,
        zh: who.zh + '班上测量了' + k + '名学生的身高。' + zhLead(kk, '名学生') + '的身高' + zhBe(kk) + zhList + '，' + k + '名学生的平均身高是' + avg + u.zh + '。最后一名学生的身高是多少' + u.zh + '？'
      };
    }
    case 'weight': {
      var qKo7 = qi === 0 ? '마지막 학생의 몸무게는 몇 ' + u.ko + '이었을까요?'
                           : '마지막으로 잰 학생의 몸무게는 몇 ' + u.ko + '이었을까요?';
      var qEn7 = qi === 0 ? 'How many ' + u.en + ' did the last student weigh?'
                           : "What was the last student's weight, in " + u.en + '?';
      return {
        ko: who.ko + '네 반 학생 ' + k + '명의 몸무게를 쟀어요. ' + koFirstGroup(kk) + ' 몸무게는 ' + koEach(kk) + koList + '이었어요. ' + k + '명의 평균 몸무게는 ' + avg + u.ko + '이었어요. ' + qKo7,
        en: who.en + "'s class measured the weight of " + k + ' students. ' + enFirst(kk, 'student', 'students', 'was', 'were') + ' ' + enList + ' ' + u.en + ', and the average weight of all ' + k + ' students was ' + avg + ' ' + u.en + '. ' + qEn7,
        zh: who.zh + '班上测量了' + k + '名学生的体重。' + zhLead(kk, '名学生') + '的体重' + zhBe(kk) + zhList + '，' + k + '名学生的平均体重是' + avg + u.zh + '。最后一名学生的体重是多少' + u.zh + '？'
      };
    }
    case 'distance': {
      var qKo8 = qi === 0 ? '마지막 학생이 달린 거리는 몇 ' + u.ko + '이었을까요?'
                           : '마지막으로 달린 거리는 몇 ' + u.ko + '이었을까요?';
      var qEn8 = qi === 0 ? 'How many ' + u.en + ' did the last student run?'
                           : "What was the last student's distance, in " + u.en + '?';
      return {
        ko: who.ko + '네 반 학생 ' + k + '명이 달리기 대회에서 달린 거리를 재었어요. ' + koFirstGroup(kk) + ' 달린 거리는 ' + koEach(kk) + koList + '이었어요. ' + k + '명의 평균 거리는 ' + avg + u.ko + '이었어요. ' + qKo8,
        en: who.en + "'s class measured how far " + k + ' students ran in a race. ' + enFirst(kk, 'student', 'students', 'ran', 'ran') + ' ' + enList + ' ' + u.en + ', and the average distance of all ' + k + ' students was ' + avg + ' ' + u.en + '. ' + qEn8,
        zh: who.zh + '班上测量了' + k + '名学生在跑步比赛中跑的距离。' + zhLead(kk, '名学生') + '跑的距离' + zhBe(kk) + zhList + '，' + k + '名学生的平均距离是' + avg + u.zh + '。最后一名学生跑了多少' + u.zh + '？'
      };
    }
    default: return null;
  }
}

window.NM_WORD_FRAMES.average = function(desc, ctx){
  try {
    if(!desc || desc.kind !== 'avg' || !ctx) return null;
    var k = desc.k, nums = desc.nums || [];
    if(!(k >= 2 && k <= 8) || nums.length !== k) return null;

    var mat = ctx.pickUnused(matsFor(nums), ctx.rng, ctx.used.items);
    var who = ctx.pickUnused(ctx.names, ctx.rng, ctx.used.names);
    var nameJ = ctx.kJosa(who.ko, '이는', '는');
    var qi = (ctx.rng() * 2) | 0;
    var w;

    if(desc.blankIndex < 0){
      w = avgDirect(mat, who, nameJ, k, nums, qi, ctx);
    } else {
      if(desc.avg == null) return null;
      var known = [];
      for(var i = 0; i < nums.length; i++){ if(i !== desc.blankIndex) known.push(nums[i]); }
      if(known.length !== k - 1) return null;
      w = avgMissing(mat, who, nameJ, k, known, desc.avg, qi, ctx);
    }
    if(!w || !w.ko || !w.en || !w.zh) return null;
    return { ko:w.ko, en:w.en, zh:w.zh, unit:mat.unit };
  } catch(e){ return null; }
};

/* ══════════════════════════════════════════════════════════════
   비율 — percent(desc, ctx)
   desc: { kind:'pct', mode:'part'|'base', part, base, pct }
   mode 'part': 기준량(base)이 주어지고 비교하는 양(part)을 구한다.
   mode 'base': 비교하는 양(part)이 주어지고 기준량(base)을 구한다.
   ══════════════════════════════════════════════════════════════ */

/* 소재 8종 — "전체 중 몇 %"가 자연스러운 셀 수 있는 것들. 회비만 돈이라 단위가
   "원"이고 "몇 원"이 아니라 "얼마"로 묻는다(isMoney). 8개(≥6)라 ctx.used.items 사용. */
var PCT_MATS = [
  { ko:'학생',   koWhole:'전체 학생 수',       unitKo:'명', enSing:'student',     enPlur:'students',     zhNoun:'学生',   zhMeasure:'名' },
  { ko:'책',     koWhole:'전체 책 수',         unitKo:'권', enSing:'book',        enPlur:'books',        zhNoun:'书',     zhMeasure:'本' },
  { ko:'문제',   koWhole:'전체 시험 문제 수',  unitKo:'개', enSing:'problem',     enPlur:'problems',     zhNoun:'题',     zhMeasure:'道' },
  { ko:'구슬',   koWhole:'상자에 담긴 구슬 수', unitKo:'개', enSing:'marble',      enPlur:'marbles',      zhNoun:'珠子',   zhMeasure:'颗' },
  { ko:'좌석',   koWhole:'전체 좌석 수',       unitKo:'석', enSing:'seat',        enPlur:'seats',        zhNoun:'座位',   zhMeasure:'个' },
  { ko:'회비',   koWhole:'모은 회비',          unitKo:'원', enSing:'won',         enPlur:'won',          zhNoun:'',       zhMeasure:'', isMoney:true },
  { ko:'참가자', koWhole:'전체 참가자 수',     unitKo:'명', enSing:'participant', enPlur:'participants', zhNoun:'参加者', zhMeasure:'名' },
  { ko:'사탕',   koWhole:'봉지에 담긴 사탕 수', unitKo:'개', enSing:'candy',       enPlur:'candies',      zhNoun:'糖果',   zhMeasure:'颗' }
];

function pctZhCount(n, mat){ return mat.isMoney ? (n + '元') : (n + mat.zhMeasure + mat.zhNoun); }
function pctQKo(mat){ return mat.isMoney ? '얼마일까요' : ('몇 ' + mat.unitKo + '일까요'); }
function pctQZh(mat){ return mat.isMoney ? '多少钱' : ('多少' + mat.zhMeasure + mat.zhNoun); }
function pctEnUnitWord(mat){ return mat.isMoney ? 'won' : mat.enPlur; }

window.NM_WORD_FRAMES.percent = function(desc, ctx){
  try {
    if(!desc || desc.kind !== 'pct' || !ctx) return null;
    var pct = +desc.pct;
    if(!(pct > 0)) return null;
    /* pct>100 && mode==='part'이면 "부분"이 "전체"보다 커지는 셈이라 학생 수·책
       권수 같은 셀 수 있는 소재에는 말이 안 된다("전체 학생 470명 중 120%는
       몇 명일까요?" 같은 문장은 만들 수 없다) — null을 돌려 다른 드릴로 넘긴다. */
    if(desc.mode === 'part' && pct > 100) return null;

    var mat = ctx.pickUnused(PCT_MATS, ctx.rng, ctx.used.items);
    var qi = (ctx.rng() * 2) | 0;
    var whole = ctx.kJosa(mat.koWhole, '이', '가');
    var wholeTop = ctx.kJosa(mat.koWhole, '은', '는');
    var enSp = [mat.enSing, mat.enPlur];
    var enUnitWord = pctEnUnitWord(mat);
    var w;

    if(desc.mode === 'part'){
      var base = desc.base;
      if(base == null) return null;
      var baseCop = ctx.kJosa(String(base) + mat.unitKo, '이에요', '예요');
      var qKo = pctQKo(mat);
      if(qi === 0){
        w = {
          ko: whole + ' ' + baseCop + '. 그중 ' + pct + '%는 ' + qKo + '?',
          en: 'There are ' + ctx.enCount(+base, enSp) + ' in total. What is ' + pct + '% of that, in ' + enUnitWord + '?',
          zh: '一共有' + pctZhCount(base, mat) + '。其中的' + pct + '%是' + pctQZh(mat) + '？'
        };
      } else {
        var baseSubj = ctx.kJosa(String(base) + mat.unitKo, '이', '가');
        w = {
          ko: mat.ko + ' ' + baseSubj + ' 있어요. 이 중 ' + pct + '%는 ' + qKo + '?',
          en: 'Out of ' + ctx.enCount(+base, enSp) + ', what is ' + pct + '%, in ' + enUnitWord + '?',
          zh: pctZhCount(base, mat) + '中，' + pct + '%是' + pctQZh(mat) + '？'
        };
      }
    } else if(desc.mode === 'base'){
      var part = desc.part;
      if(part == null) return null;
      var qKo2 = pctQKo(mat);
      if(qi === 0){
        var partSubj = ctx.kJosa(String(part) + mat.unitKo, '이', '가');
        w = {
          ko: partSubj + ' ' + mat.koWhole + '의 ' + pct + '%예요. ' + wholeTop + ' ' + qKo2 + '?',
          en: ctx.enCount(+part, enSp) + ' ' + (mat.isMoney ? 'is' : 'are') + ' ' + pct + '% of the total. What is the total, in ' + enUnitWord + '?',
          zh: pctZhCount(part, mat) + '是总数的' + pct + '%。总共有' + pctQZh(mat) + '？'
        };
      } else {
        var partIf = ctx.kJosa(String(part) + mat.unitKo, '이라면', '라면');
        w = {
          ko: mat.koWhole + '의 ' + pct + '%가 ' + partIf + ', ' + wholeTop + ' ' + qKo2 + '?',
          en: 'If ' + pct + '% of the total is ' + ctx.enCount(+part, enSp) + ', what is the total, in ' + enUnitWord + '?',
          zh: '总数的' + pct + '%是' + pctZhCount(part, mat) + '。总共有' + pctQZh(mat) + '？'
        };
      }
    } else {
      return null;
    }

    if(!w || !w.ko || !w.en || !w.zh) return null;
    return { ko:w.ko, en:w.en, zh:w.zh, unit:{ko:mat.unitKo, en:mat.enPlur, zh: mat.isMoney ? '元' : mat.zhMeasure} };
  } catch(e){ return null; }
};

})();
