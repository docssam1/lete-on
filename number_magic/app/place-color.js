/* ============================================================
   Numbers of Magic — 자릿값 색 힌트 (2026-09-16)

   원장 지시: "이 책의 팁 하나 더. 어린 아이들은 자릿수의 개념이 없어서 몇 문제는
   같은 색으로 힌트를 주는 거야. 십의 자리끼리는 같은 색을 한다든지. 계산해야 할
   것이 강조가 되도록. 그래서 학습지도 이런 스킬이 들어가야 돼."

   ── 무엇을 하는가 ──
   식의 숫자를 **자리마다 다른 색**으로 칠한다. 일의 자리는 일의 자리끼리,
   십의 자리는 십의 자리끼리 같은 색이다. 그래서 `36 + 27`에서 6과 7이 같은 색,
   3과 2가 같은 색으로 보인다 — 무엇과 무엇을 더해야 하는지가 글로 설명하기 전에
   눈으로 먼저 온다.

   ── 왜 tex 문자열을 고치는가 ──
   앱과 학습지가 같은 것을 써야 해서다. 둘 다 결국 KaTeX에 tex 한 줄을 넘긴다
   (앱 labExprHtml · 학습지 w2CellHtml의 data-tex). 색을 CSS로 넣으려면 렌더된
   DOM을 뒤져야 하는데 그건 두 곳에서 각각 달라진다. `\color{#hex}{6}`은 두 경로
   모두에서 그냥 동작하고, KaTeX가 없을 때의 폴백(exam.js texToPlain)도 이미
   \color를 벗겨 내므로 글자가 깨지지 않는다.

   ── 아무 식에나 칠하지 않는다 ──
   자릿값이 성립하는 식에만 칠한다(eligible 참고):
     · 정수 사칙연산만 — 분수·소수·제곱근·괄호식은 자리 개념이 흐려진다
     · 두 자리 이상인 수가 적어도 하나 있어야 한다 — 한 자리끼리면 보여 줄 자리가 없다
     · 자리 수가 4를 넘으면 칠하지 않는다 — 색이 다섯 개가 되면 힌트가 아니라 소음이다

   ── 색 고르기 ──
   흑백 인쇄를 염두에 두고 **명도까지 다르게** 골랐다(일=가장 진함 → 천=가장 옅음).
   색이 회색으로 바뀌어도 자리마다 회색 값이 달라 구분이 남는다.
   ============================================================ */
(function(){
'use strict';

/* 자리별 색 — index 0 = 일의 자리, 1 = 십, 2 = 백, 3 = 천 */
var COLORS = ['#C62828', '#1565C0', '#2E7D32', '#6A1B9A'];
var NAMES = [
  {ko:'일의 자리', en:'ones',      zh:'个位'},
  {ko:'십의 자리', en:'tens',      zh:'十位'},
  {ko:'백의 자리', en:'hundreds',  zh:'百位'},
  {ko:'천의 자리', en:'thousands', zh:'千位'}
];

var MAX_PLACES = 4;

/* 정수 사칙연산 식인가 — 여기 없는 것이 하나라도 있으면 칠하지 않는다.
   \square(빈칸)·\times·\div·\cdot 와 숫자·+·-·=·괄호·공백만 허용한다. */
function eligible(tex){
  if(!tex) return false;
  var t = String(tex);
  /* 허용 명령만 남기고 지운 뒤, 남은 글자가 숫자·연산·공백뿐인지 본다 */
  var stripped = t.replace(/\\square/g, '')
                  .replace(/\\times|\\div|\\cdot/g, '')
                  .replace(/[0-9+\-=()\s]/g, '');
  if(stripped !== '') return false;              // \frac·\sqrt·한글·^·_ 등이 남으면 탈락
  var nums = t.match(/\d+/g);
  if(!nums || !nums.length) return false;
  var maxLen = 0;
  for(var i=0;i<nums.length;i++){
    if(nums[i].length > maxLen) maxLen = nums[i].length;
  }
  if(maxLen < 2) return false;                   // 한 자리끼리면 보여 줄 자리가 없다
  if(maxLen > MAX_PLACES) return false;          // 색이 다섯 개면 소음이다
  return true;
}

/* 식의 모든 수에 자리 색을 입힌다. eligible이 아니면 원본 그대로 돌려준다
   (부르는 쪽이 매번 검사하지 않아도 안전하도록). */
function tint(tex){
  if(!eligible(tex)) return tex;
  return String(tex).replace(/\d+/g, function(num){
    var out = '';
    for(var i=0;i<num.length;i++){
      /* 오른쪽에서 몇 번째인가 = 자리 */
      var place = num.length - 1 - i;
      var col = COLORS[Math.min(place, COLORS.length-1)];
      out += '\\color{' + col + '}{' + num.charAt(i) + '}';
    }
    return out;
  });
}

/* 식에 실제로 쓰인 자리 수 — 범례를 그 식에 맞게만 그리려고 */
function placesUsed(tex){
  var nums = String(tex||'').match(/\d+/g) || [];
  var max = 0;
  for(var i=0;i<nums.length;i++) if(nums[i].length>max) max=nums[i].length;
  return Math.min(max, MAX_PLACES);
}

/* 범례 — 색이 무엇을 뜻하는지 한 줄. places = 보여 줄 자리 수(기본 2). */
function legendHtml(lang, places){
  var l = lang || 'ko';
  var n = Math.max(2, Math.min(places || 2, MAX_PLACES));
  var chips = '';
  /* 큰 자리부터 왼쪽에 — 수를 읽는 차례와 같게 */
  for(var p=n-1;p>=0;p--){
    var nm = NAMES[p][l] || NAMES[p].ko;
    chips += '<span class="nm-pv-chip"><i style="background:'+COLORS[p]+'"></i>'+nm+'</span>';
  }
  var lead = l==='en' ? 'Same place, same color'
           : l==='zh' ? '同一个数位用同一种颜色'
           : '같은 자리는 같은 색이에요';
  return '<div class="nm-pv-legend"><b>'+lead+'</b>'+chips+'</div>';
}

/* 세로셈처럼 tex가 아니라 낱낱의 숫자 문자열을 그리는 자리용 —
   한 수를 자리별 <span>으로 쪼개 돌려준다(HTML). */
function spanDigits(numStr){
  var s = String(numStr==null?'':numStr);
  var out = '';
  var digits = s.replace(/[^\d]/g, '');
  var seen = 0;
  for(var i=0;i<s.length;i++){
    var ch = s.charAt(i);
    if(ch>='0' && ch<='9'){
      var place = digits.length - 1 - seen; seen++;
      var col = COLORS[Math.min(place, COLORS.length-1)];
      out += '<span style="color:'+col+'">'+ch+'</span>';
    } else {
      out += ch.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }
  }
  return out;
}

/* 몇 번째 문제에 힌트를 줄 것인가 — 전부 칠하면 색이 배경이 되어 힌트가 아니게 된다.
   every(기본 3)마다 하나, 즉 세 문제에 한 번. index는 0부터. */
function hintAt(index, every){
  var e = every || 3;
  return (index % e) === 0;
}

window.NM_PLACE_COLOR = {
  COLORS: COLORS,
  NAMES: NAMES,
  MAX_PLACES: MAX_PLACES,
  eligible: eligible,
  tint: tint,
  placesUsed: placesUsed,
  legendHtml: legendHtml,
  spanDigits: spanDigits,
  hintAt: hintAt
};

if(typeof module!=='undefined' && module.exports) module.exports = window.NM_PLACE_COLOR;
})();
