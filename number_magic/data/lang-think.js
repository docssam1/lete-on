/* ============================================================
   Numbers of Magic — 언어사고력 지면 (유아·초1~2 주간 학습지)  2026-09-30

   원장: "수학 이야기 밀고 우리 언어사고력 넣자. A-1부터 6까지. 유아는 처음에는 없다가
          유아 연산 중반 정도부터."

   무엇인가
   ------------------------------------------------------------
   지필드 「유·초등 저학년을 위한 언어사고력 프로그램」 표현편 EA-1~6 의 **틀**을 따른다.
     EA-1 관찰 · EA-2 공통점과 차이점 · EA-3 변화의 규칙(분류·규칙) · EA-4 예측 ·
     EA-5 언어의 규칙①(낱말 관계·끝말잇기) · EA-6 언어의 규칙②(흉내말·문장 만들기)
   회차마다 한 주제, 주제마다 활동 둘(그림으로 하는 것 하나 + 말·글로 하는 것 하나).

   자료 취급(문장제-설계.md §0 과 같다): **방법·구조만 쓴다.** 교재의 그림·지문·문항은 하나도
   옮기지 않는다 — 그림은 전부 여기서 그린 원본 도형이고, 낱말·문장은 생성기가 매번 새로 만든다.
   3개 언어는 번역이 아니라 언어마다 따로 쓴다(끝말잇기는 한국어 끝말, 영어는 끝 글자, 중국어는 接龙).

   쓰는 곳: app/exam.js renderMixedSheet — 나이대(readingAgeBand)가 young 인 주간 학습지에서
   수학 이야기 지면 자리에 들어간다. 유아(과정 0)는 회차 10부터(그 전엔 읽을거리 없음).
   ============================================================ */
(function(){
'use strict';

const C = { ink:'#1A2233', red:'#D9534F', gold:'#C9A063', blue:'#16417C', sky:'#7ea4d6', green:'#2E9E6B',
  leaf:'#7cb56b', yellow:'#F5D98B', orange:'#E8913A', purple:'#8B6BC7', brown:'#8a6d46', pink:'#e89ab0',
  grey:'#b0b7c3', white:'#ffffff', paper:'#fdf6e3', water:'#5b8dd9' };
const S = 'stroke="' + C.ink + '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"';
const g = inner => inner;

/* ── 그림 40개 — 전부 원본 도형(viewBox 0 0 64 64) ──
   tags 는 활동이 쓰는 성질. 이름은 3개 언어(그림 아래 이름표·문장에 쓴다). */
const ICONS = {
  apple:   { n:{ko:'사과',en:'apple',zh:'苹果'}, t:['food','fruit','round','red'],
    s:`<circle cx="32" cy="36" r="20" fill="${C.red}" ${S}/><path d="M32 16 q2 -8 8 -9" fill="none" ${S}/><path d="M32 17 q-9 -6 -12 2 q9 4 12 -2z" fill="${C.leaf}" ${S}/>` },
  banana:  { n:{ko:'바나나',en:'banana',zh:'香蕉'}, t:['food','fruit','yellow','long'],
    s:`<path d="M12 22 q10 32 40 26 q4 -2 0 -4 q-24 2 -34 -24 q-4 -2 -6 2z" fill="${C.yellow}" ${S}/>` },
  carrot:  { n:{ko:'당근',en:'carrot',zh:'胡萝卜'}, t:['food','vegetable','orange','long','plant'],
    s:`<path d="M20 26 l24 24 l-6 6 l-24 -24z" fill="${C.orange}" ${S}/><path d="M14 20 l6 6 l6 -6 M14 20 l8 -2 M14 20 l2 8" fill="none" stroke="${C.green}" stroke-width="3" stroke-linecap="round"/>` },
  orange:  { n:{ko:'귤',en:'orange',zh:'橘子'}, t:['food','fruit','round','orange'],
    s:`<circle cx="32" cy="35" r="19" fill="${C.orange}" ${S}/><ellipse cx="32" cy="15" rx="5" ry="3" fill="${C.leaf}" ${S}/>` },
  bread:   { n:{ko:'빵',en:'bread',zh:'面包'}, t:['food','brown'],
    s:`<path d="M12 40 v-10 q0 -12 20 -12 q20 0 20 12 v10z" fill="${C.gold}" ${S}/><rect x="12" y="40" width="40" height="8" fill="${C.brown}" ${S}/>` },
  milk:    { n:{ko:'우유',en:'milk',zh:'牛奶'}, t:['food','drink','white'],
    s:`<path d="M22 22 h20 v30 h-20z" fill="${C.white}" ${S}/><path d="M22 22 l4 -10 h12 l4 10z" fill="${C.sky}" ${S}/>` },
  flower:  { n:{ko:'꽃',en:'flower',zh:'花'}, t:['plant','pink','grow'],
    s:`<path d="M32 30 v24" stroke="${C.green}" stroke-width="3"/><g fill="${C.pink}" ${S}><circle cx="32" cy="14" r="7"/><circle cx="20" cy="22" r="7"/><circle cx="44" cy="22" r="7"/><circle cx="23" cy="36" r="7"/><circle cx="41" cy="36" r="7"/></g><circle cx="32" cy="27" r="7" fill="${C.yellow}" ${S}/>` },
  tree:    { n:{ko:'나무',en:'tree',zh:'树'}, t:['plant','green','tall','grow'],
    s:`<rect x="28" y="40" width="8" height="16" fill="${C.brown}" ${S}/><circle cx="32" cy="26" r="17" fill="${C.leaf}" ${S}/>` },
  sun:     { n:{ko:'해',en:'sun',zh:'太阳'}, t:['sky','round','yellow','hot','day'],
    s:`<g stroke="${C.orange}" stroke-width="3" stroke-linecap="round"><path d="M32 6 v8 M32 50 v8 M6 32 h8 M50 32 h8 M13 13 l6 6 M45 45 l6 6 M51 13 l-6 6 M19 45 l-6 6"/></g><circle cx="32" cy="32" r="12" fill="${C.yellow}" ${S}/>` },
  moon:    { n:{ko:'달',en:'moon',zh:'月亮'}, t:['sky','yellow','night'],
    s:`<path d="M40 10 a22 22 0 1 0 0 44 a17 17 0 1 1 0 -44z" fill="${C.yellow}" ${S}/>` },
  cloud:   { n:{ko:'구름',en:'cloud',zh:'云'}, t:['sky','white','weather'],
    s:`<path d="M18 44 h30 a9 9 0 0 0 0 -18 a12 12 0 0 0 -23 -3 a9 9 0 0 0 -7 21z" fill="${C.white}" ${S}/>` },
  star:    { n:{ko:'별',en:'star',zh:'星星'}, t:['sky','yellow','night','shine'],
    s:`<path d="M32 8 l7 16 l17 2 l-13 11 l4 17 l-15 -9 l-15 9 l4 -17 l-13 -11 l17 -2z" fill="${C.yellow}" ${S}/>` },
  rain:    { n:{ko:'비',en:'rain',zh:'雨'}, t:['sky','weather','water'],
    s:`<path d="M18 30 h30 a8 8 0 0 0 0 -16 a11 11 0 0 0 -21 -2 a8 8 0 0 0 -9 18z" fill="${C.grey}" ${S}/><g stroke="${C.water}" stroke-width="3" stroke-linecap="round"><path d="M22 38 l-3 8 M32 38 l-3 8 M42 38 l-3 8 M27 48 l-3 8 M37 48 l-3 8"/></g>` },
  umbrella:{ n:{ko:'우산',en:'umbrella',zh:'雨伞'}, t:['tool','rain','red','use'],
    s:`<path d="M8 32 a24 24 0 0 1 48 0z" fill="${C.red}" ${S}/><path d="M32 32 v20 a5 5 0 0 1 -10 0" fill="none" ${S}/>` },
  house:   { n:{ko:'집',en:'house',zh:'房子'}, t:['building','live'],
    s:`<path d="M10 30 l22 -20 l22 20z" fill="${C.red}" ${S}/><rect x="16" y="30" width="32" height="24" fill="${C.paper}" ${S}/><rect x="28" y="40" width="8" height="14" fill="${C.brown}" ${S}/>` },
  car:     { n:{ko:'자동차',en:'car',zh:'汽车'}, t:['vehicle','wheel','ride','red','fast'],
    s:`<path d="M8 40 v-8 h10 l8 -10 h18 l8 10 h4 v8z" fill="${C.red}" ${S}/><circle cx="20" cy="42" r="6" fill="${C.ink}"/><circle cx="46" cy="42" r="6" fill="${C.ink}"/>` },
  bus:     { n:{ko:'버스',en:'bus',zh:'公共汽车'}, t:['vehicle','wheel','ride','yellow','big'],
    s:`<rect x="8" y="16" width="48" height="30" rx="4" fill="${C.yellow}" ${S}/><rect x="14" y="22" width="10" height="9" fill="${C.sky}" ${S}/><rect x="28" y="22" width="10" height="9" fill="${C.sky}" ${S}/><rect x="42" y="22" width="8" height="9" fill="${C.sky}" ${S}/><circle cx="20" cy="48" r="5" fill="${C.ink}"/><circle cx="44" cy="48" r="5" fill="${C.ink}"/>` },
  boat:    { n:{ko:'배',en:'boat',zh:'船'}, t:['vehicle','ride','water','float'],
    s:`<path d="M8 40 h48 l-8 12 h-32z" fill="${C.brown}" ${S}/><path d="M32 12 v28 M32 14 l18 18 h-18z" fill="${C.white}" ${S}/>` },
  train:   { n:{ko:'기차',en:'train',zh:'火车'}, t:['vehicle','wheel','ride','long','sound'],
    s:`<rect x="6" y="24" width="26" height="22" rx="3" fill="${C.blue}" ${S}/><rect x="34" y="30" width="24" height="16" rx="3" fill="${C.red}" ${S}/><rect x="10" y="28" width="8" height="8" fill="${C.sky}" ${S}/><circle cx="14" cy="50" r="4" fill="${C.ink}"/><circle cx="26" cy="50" r="4" fill="${C.ink}"/><circle cx="40" cy="50" r="4" fill="${C.ink}"/><circle cx="52" cy="50" r="4" fill="${C.ink}"/><rect x="22" y="14" width="6" height="10" fill="${C.ink}"/>` },
  bicycle: { n:{ko:'자전거',en:'bicycle',zh:'自行车'}, t:['vehicle','wheel','ride'],
    s:`<circle cx="16" cy="44" r="11" fill="none" ${S}/><circle cx="48" cy="44" r="11" fill="none" ${S}/><path d="M16 44 l12 -18 h14 l6 18 M28 26 l6 18 h-18 M26 20 h8" fill="none" ${S}/>` },
  ball:    { n:{ko:'공',en:'ball',zh:'球'}, t:['toy','round','play'],
    s:`<circle cx="32" cy="32" r="20" fill="${C.white}" ${S}/><path d="M18 18 q14 14 0 28 M46 18 q-14 14 0 28" fill="none" ${S}/>` },
  kite:    { n:{ko:'연',en:'kite',zh:'风筝'}, t:['toy','sky','fly','play'],
    s:`<path d="M32 6 l16 18 l-16 24 l-16 -24z" fill="${C.purple}" ${S}/><path d="M32 48 q-6 6 0 12 q6 -6 0 -12" fill="none" ${S}/>` },
  book:    { n:{ko:'책',en:'book',zh:'书'}, t:['school','read','use'],
    s:`<path d="M12 14 h18 v38 h-18z" fill="${C.white}" ${S}/><path d="M34 14 h18 v38 h-18z" fill="${C.white}" ${S}/><path d="M30 14 q2 4 4 0" ${S}/><path d="M16 22 h10 M16 28 h10 M38 22 h10 M38 28 h10" stroke="${C.grey}" stroke-width="2"/>` },
  pencil:  { n:{ko:'연필',en:'pencil',zh:'铅笔'}, t:['school','tool','long','write','use'],
    s:`<path d="M14 44 l28 -28 l6 6 l-28 28 h-6z" fill="${C.yellow}" ${S}/><path d="M14 44 v6 h6z" fill="${C.ink}"/>` },
  scissors:{ n:{ko:'가위',en:'scissors',zh:'剪刀'}, t:['tool','cut','use'],
    s:`<circle cx="20" cy="46" r="7" fill="none" ${S}/><circle cx="38" cy="46" r="7" fill="none" ${S}/><path d="M24 40 l20 -28 M34 40 l-20 -28" ${S}/>` },
  cup:     { n:{ko:'컵',en:'cup',zh:'杯子'}, t:['kitchen','drink','use'],
    s:`<path d="M18 16 h24 l-3 36 h-18z" fill="${C.sky}" ${S}/><path d="M42 22 h6 a6 6 0 0 1 0 12 h-8" fill="none" ${S}/>` },
  spoon:   { n:{ko:'숟가락',en:'spoon',zh:'勺子'}, t:['kitchen','eat','use','long'],
    s:`<ellipse cx="22" cy="20" rx="10" ry="12" fill="${C.grey}" ${S}/><path d="M28 28 l18 24 l-4 4 l-18 -24z" fill="${C.grey}" ${S}/>` },
  hat:     { n:{ko:'모자',en:'hat',zh:'帽子'}, t:['clothes','wear'],
    s:`<path d="M8 44 h48" ${S}/><path d="M18 44 v-16 a14 14 0 0 1 28 0 v16z" fill="${C.blue}" ${S}/>` },
  shoe:    { n:{ko:'신발',en:'shoe',zh:'鞋'}, t:['clothes','wear'],
    s:`<path d="M10 44 q0 -14 14 -14 l6 -6 l14 10 q10 2 10 10z" fill="${C.purple}" ${S}/><path d="M10 44 h44 v6 h-44z" fill="${C.ink}"/>` },
  fish:    { n:{ko:'물고기',en:'fish',zh:'鱼'}, t:['animal','water','swim'],
    s:`<path d="M10 32 q14 -18 34 0 q-20 18 -34 0z" fill="${C.sky}" ${S}/><path d="M44 32 l12 -10 v20z" fill="${C.sky}" ${S}/><circle cx="20" cy="30" r="2" fill="${C.ink}"/>` },
  bird:    { n:{ko:'새',en:'bird',zh:'鸟'}, t:['animal','fly','sky','wings','sound'],
    s:`<ellipse cx="34" cy="36" rx="16" ry="11" fill="${C.sky}" ${S}/><circle cx="18" cy="28" r="8" fill="${C.sky}" ${S}/><path d="M10 28 l-6 2 l6 2z" fill="${C.orange}" ${S}/><path d="M30 30 q10 -12 20 -2" fill="none" ${S}/><circle cx="16" cy="26" r="1.6" fill="${C.ink}"/>` },
  butterfly:{ n:{ko:'나비',en:'butterfly',zh:'蝴蝶'}, t:['animal','fly','wings','insect','flower'],
    s:`<path d="M32 30 q-4 -20 -20 -16 q-4 12 12 20 q-16 4 -10 16 q12 4 18 -14z" fill="${C.purple}" ${S}/><path d="M32 30 q4 -20 20 -16 q4 12 -12 20 q16 4 10 16 q-12 4 -18 -14z" fill="${C.purple}" ${S}/><rect x="30" y="18" width="4" height="26" rx="2" fill="${C.ink}"/>` },
  cat:     { n:{ko:'고양이',en:'cat',zh:'猫'}, t:['animal','pet','fourlegs','sound'],
    s:`<circle cx="32" cy="34" r="16" fill="${C.gold}" ${S}/><path d="M18 26 l0 -12 l10 6z M46 26 l0 -12 l-10 6z" fill="${C.gold}" ${S}/><circle cx="26" cy="32" r="2" fill="${C.ink}"/><circle cx="38" cy="32" r="2" fill="${C.ink}"/><path d="M32 37 l-3 3 h6z" fill="${C.pink}"/><path d="M12 36 h10 M42 36 h10" ${S}/>` },
  dog:     { n:{ko:'개',en:'dog',zh:'狗'}, t:['animal','pet','fourlegs','sound'],
    s:`<circle cx="32" cy="34" r="15" fill="${C.brown}" ${S}/><ellipse cx="16" cy="30" rx="6" ry="12" fill="${C.brown}" ${S}/><ellipse cx="48" cy="30" rx="6" ry="12" fill="${C.brown}" ${S}/><circle cx="26" cy="32" r="2" fill="${C.ink}"/><circle cx="38" cy="32" r="2" fill="${C.ink}"/><ellipse cx="32" cy="40" rx="4" ry="3" fill="${C.ink}"/>` },
  chick:   { n:{ko:'병아리',en:'chick',zh:'小鸡'}, t:['animal','yellow','bird','sound'],
    s:`<circle cx="32" cy="38" r="15" fill="${C.yellow}" ${S}/><circle cx="32" cy="20" r="10" fill="${C.yellow}" ${S}/><path d="M40 20 l6 2 l-6 2z" fill="${C.orange}" ${S}/><circle cx="35" cy="18" r="1.6" fill="${C.ink}"/><path d="M26 53 v6 M38 53 v6" stroke="${C.orange}" stroke-width="3"/>` },
  egg:     { n:{ko:'알',en:'egg',zh:'蛋'}, t:['food','white','round'],
    s:`<path d="M32 8 q18 0 18 26 q0 20 -18 20 q-18 0 -18 -20 q0 -26 18 -26z" fill="${C.paper}" ${S}/>` },
  seed:    { n:{ko:'씨앗',en:'seed',zh:'种子'}, t:['plant','brown','grow'],
    s:`<path d="M10 44 h44 v8 h-44z" fill="${C.brown}" ${S}/><ellipse cx="32" cy="36" rx="7" ry="5" fill="${C.gold}" ${S}/>` },
  sprout:  { n:{ko:'새싹',en:'sprout',zh:'嫩芽'}, t:['plant','green','grow'],
    s:`<path d="M10 48 h44 v8 h-44z" fill="${C.brown}" ${S}/><path d="M32 48 v-16" stroke="${C.green}" stroke-width="3"/><path d="M32 34 q-14 -4 -12 -14 q12 0 12 14z M32 34 q14 -4 12 -14 q-12 0 -12 14z" fill="${C.leaf}" ${S}/>` },
  rainbow: { n:{ko:'무지개',en:'rainbow',zh:'彩虹'}, t:['sky','weather','color'],
    s:`<path d="M8 50 a24 24 0 0 1 48 0" fill="none" stroke="${C.red}" stroke-width="5"/><path d="M14 50 a18 18 0 0 1 36 0" fill="none" stroke="${C.yellow}" stroke-width="5"/><path d="M20 50 a12 12 0 0 1 24 0" fill="none" stroke="${C.green}" stroke-width="5"/><path d="M26 50 a6 6 0 0 1 12 0" fill="none" stroke="${C.water}" stroke-width="5"/>` },
  bell:    { n:{ko:'종',en:'bell',zh:'铃'}, t:['tool','sound','use'],
    s:`<path d="M14 44 q4 -4 4 -14 a14 14 0 0 1 28 0 q0 10 4 14z" fill="${C.gold}" ${S}/><circle cx="32" cy="50" r="4" fill="${C.ink}"/>` },
  drum:    { n:{ko:'북',en:'drum',zh:'鼓'}, t:['toy','sound','round','play'],
    s:`<rect x="12" y="24" width="40" height="24" fill="${C.red}" ${S}/><ellipse cx="32" cy="24" rx="20" ry="6" fill="${C.paper}" ${S}/><path d="M18 14 l10 10 M46 14 l-10 10" ${S}/>` }
};
const KEYS = Object.keys(ICONS);
function iconSvg(key, opts){
  const ic = ICONS[key]; if(!ic) return '';
  opts = opts || {};
  const tr = opts.flip ? ' transform="translate(64 0) scale(-1 1)"' : '';
  return '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true"><g' + tr + '>' + ic.s + '</g></svg>';
}
function esc(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
const L = (o, lang) => (o && (o[lang] || o.ko)) || '';

/* ── 성질(tag) → 문장·묶음 이름 ── */
const TRAIT = {
  food:   {ko:'먹을 수 있어요',        en:'You can eat it.',              zh:'可以吃。'},
  fly:    {ko:'하늘을 날 수 있어요',    en:'It can fly.',                  zh:'会飞。'},
  wheel:  {ko:'바퀴가 있어요',          en:'It has wheels.',               zh:'有轮子。'},
  ride:   {ko:'사람이 탈 수 있어요',    en:'People can ride it.',          zh:'人可以坐上去。'},
  round:  {ko:'동그란 모양이에요',      en:'It is round.',                 zh:'是圆的。'},
  animal: {ko:'살아 있는 동물이에요',   en:'It is a living animal.',       zh:'是活的动物。'},
  plant:  {ko:'땅에서 자라요',          en:'It grows in the ground.',      zh:'从土里长出来。'},
  sky:    {ko:'하늘에서 볼 수 있어요',  en:'You can see it in the sky.',   zh:'在天上能看到。'},
  water:  {ko:'물에서 볼 수 있어요',    en:'You can find it in water.',    zh:'在水里能看到。'},
  wear:   {ko:'몸에 입거나 신어요',     en:'You wear it.',                 zh:'可以穿戴。'},
  sound:  {ko:'소리가 나요',            en:'It makes a sound.',            zh:'会发出声音。'},
  night:  {ko:'밤에 볼 수 있어요',      en:'You see it at night.',         zh:'晚上能看到。'},
  fourlegs:{ko:'다리가 네 개예요',      en:'It has four legs.',            zh:'有四条腿。'},
  wings:  {ko:'날개가 있어요',          en:'It has wings.',                zh:'有翅膀。'},
  swim:   {ko:'헤엄을 쳐요',            en:'It can swim.',                 zh:'会游泳。'},
  pet:    {ko:'집에서 기를 수 있어요',  en:'It can live with us at home.', zh:'可以在家里养。'},
  use:    {ko:'무언가를 할 때 쓰는 물건이에요', en:'It is a thing we use.', zh:'是用来做事的东西。'}
};
const GROUP = {
  food:    {ko:'먹는 것',        en:'things to eat',    zh:'能吃的'},
  vehicle: {ko:'타는 것',        en:'things to ride',   zh:'能坐的'},
  animal:  {ko:'동물',           en:'animals',          zh:'动物'},
  plant:   {ko:'식물',           en:'plants',           zh:'植物'},
  sky:     {ko:'하늘에 있는 것', en:'things in the sky',zh:'天上的'},
  round:   {ko:'둥근 것',        en:'round things',     zh:'圆的'},
  clothes: {ko:'입는 것',        en:'things to wear',   zh:'穿戴的'},
  school:  {ko:'공부할 때 쓰는 것', en:'school things', zh:'学习用品'},
  kitchen: {ko:'부엌에서 쓰는 것', en:'kitchen things', zh:'厨房用品'},
  toy:     {ko:'가지고 노는 것', en:'toys',             zh:'玩具'},
  tool:    {ko:'쓰는 물건',      en:'tools',            zh:'工具'},
  long:    {ko:'길쭉한 것',      en:'long things',      zh:'长长的'},
  yellow:  {ko:'노란 것',        en:'yellow things',    zh:'黄色的'},
  red:     {ko:'빨간 것',        en:'red things',       zh:'红色的'}
};
const GROUP_KEYS = Object.keys(GROUP);
const FALSE_TRAITS = ['fly','wheel','food','water','wear','swim','fourlegs','sky','plant'];

/* ── 낱말 자료(언어마다 따로) ── */
const OPP = {
  ko:[['크다','작다'],['길다','짧다'],['높다','낮다'],['많다','적다'],['무겁다','가볍다'],['빠르다','느리다'],['뜨겁다','차갑다'],['낮','밤'],['위','아래'],['앞','뒤']],
  en:[['big','small'],['long','short'],['high','low'],['many','few'],['heavy','light'],['fast','slow'],['hot','cold'],['day','night'],['up','down'],['front','back']],
  zh:[['大','小'],['长','短'],['高','低'],['多','少'],['重','轻'],['快','慢'],['热','冷'],['白天','黑夜'],['上','下'],['前','后']]
};
/* 끝말잇기(ko 끝 글자 · en 끝 글자 · zh 接龙) — 세 낱말이 이어지는 사슬 */
const CHAIN = {
  ko:[['사과','과자','자두'],['우유','유리','리본'],['기차','차표','표범'],['나비','비누','누나'],['바다','다리','리본'],['오리','리본','본보기'],['모자','자두','두부'],['구두','두부','부채']],
  en:[['apple','egg','goat'],['cat','tiger','rabbit'],['dog','goat','tree'],['sun','nose','egg'],['book','kite','elephant'],['bus','star','rain'],['hat','tree','eel'],['moon','net','top']],
  zh:[['天空','空气','气球'],['大海','海水','水果'],['太阳','阳光','光明'],['火车','车站','站立'],['白天','天空','空气'],['花园','园地','地球'],['小鸟','鸟蛋','蛋糕'],['月亮','亮光','光头']]
};
const CHAIN_WRONG = { ko:['모자','나무','책상','바다','연필','우산'], en:['milk','sun','ship','flower','cup','hat'], zh:['苹果','雨伞','汽车','铅笔','帽子','花'] };
const SOUND = [
  { icon:'train', w:{ko:'칙칙폭폭',   en:'choo-choo',       zh:'呜呜'} },
  { icon:'dog',   w:{ko:'멍멍',       en:'woof-woof',       zh:'汪汪'} },
  { icon:'cat',   w:{ko:'야옹',       en:'meow',            zh:'喵喵'} },
  { icon:'bird',  w:{ko:'짹짹',       en:'tweet-tweet',     zh:'叽叽'} },
  { icon:'star',  w:{ko:'반짝반짝',   en:'twinkle-twinkle', zh:'一闪一闪'} },
  { icon:'rain',  w:{ko:'주룩주룩',   en:'pitter-patter',   zh:'哗啦哗啦'} },
  { icon:'bell',  w:{ko:'딸랑딸랑',   en:'ding-dong',       zh:'叮当'} },
  { icon:'drum',  w:{ko:'둥둥',       en:'boom-boom',       zh:'咚咚'} },
  { icon:'chick', w:{ko:'삐악삐악',   en:'peep-peep',       zh:'啾啾'} }
];
/* 문장 카드 — [주어, 목적어/장소, 서술어] 를 그 언어의 자연스러운 순서로 */
const SENT = [
  { icons:['dog','bread'],   ko:['강아지가','빵을','먹어요'],   en:['The dog','eats','the bread'],       zh:['小狗','吃','面包'] },
  { icons:['cat','fish'],    ko:['고양이가','물고기를','먹어요'], en:['The cat','eats','a fish'],        zh:['小猫','吃','鱼'] },
  { icons:['bird','sky'],    ko:['새가','하늘을','날아요'],     en:['The bird','flies','in the sky'],    zh:['小鸟','在天上','飞'] },
  { icons:['fish','water'],  ko:['물고기가','물에서','헤엄쳐요'], en:['The fish','swims','in the water'], zh:['鱼','在水里','游'] },
  { icons:['chick','egg'],   ko:['병아리가','알에서','나와요'],  en:['The chick','comes out','of the egg'], zh:['小鸡','从蛋里','出来'] },
  { icons:['butterfly','flower'], ko:['나비가','꽃에','앉아요'], en:['The butterfly','sits','on the flower'], zh:['蝴蝶','停在','花上'] }
];
/* 예측 — 이어지는 그림 셋(마지막이 답) + 엉뚱한 보기 */
const SEQ = [
  { steps:['seed','sprout','flower'], wrong:['fish','car'], why:{ko:'씨앗은 싹이 나고 꽃이 피어요.', en:'A seed sprouts, then a flower blooms.', zh:'种子发芽，然后开花。'} },
  { steps:['cloud','rain','rainbow'], wrong:['cup','hat'],  why:{ko:'비가 그치면 무지개가 떠요.',     en:'After the rain comes a rainbow.',      zh:'雨停了，彩虹出来了。'} },
  { steps:['egg','chick','bird'],     wrong:['apple','boat'], why:{ko:'알에서 병아리가 나오고 자라서 새가 돼요.', en:'A chick hatches from an egg and grows into a bird.', zh:'蛋里孵出小鸡，长大变成鸟。'} },
  { steps:['sun','cloud','rain'],     wrong:['ball','shoe'], why:{ko:'구름이 몰려오면 비가 와요.',     en:'Clouds gather, then it rains.',        zh:'云聚起来，就下雨了。'} }
];
/* 규칙(패턴) — 도형 반복 규칙 */
const SHAPES = [
  { k:'circle',   s:`<circle cx="32" cy="32" r="20" fill="${C.red}" ${S}/>` },
  { k:'square',   s:`<rect x="12" y="12" width="40" height="40" rx="4" fill="${C.blue}" ${S}/>` },
  { k:'triangle', s:`<path d="M32 10 l24 42 h-48z" fill="${C.yellow}" ${S}/>` },
  { k:'star',     s:ICONS.star.s },
  { k:'heart',    s:`<path d="M32 54 l-20 -20 a11 11 0 0 1 20 -14 a11 11 0 0 1 20 14z" fill="${C.pink}" ${S}/>` }
];
const PATTERNS = [[0,1,0,1,0,1],[0,0,1,0,0,1],[0,1,2,0,1,2],[0,1,1,0,1,1]];

/* ── 세 언어 문구 ── */
const T = {
  band:   {ko:'언어사고력', en:'Language & Thinking', zh:'语言思考力'},
  answer: {ko:'정답', en:'Answers', zh:'答案'},
  talk:   {ko:'말해 보세요', en:'Say it out loud', zh:'说一说'},
  draw:   {ko:'그려 보세요', en:'Draw it', zh:'画一画'},
  themes: [
    { no:'EA-1', title:{ko:'관찰',           en:'Looking closely',            zh:'观察'},
      lede:{ko:'자세히 보면 다른 점이 보여요.', en:'Look closely and the differences show.', zh:'仔细看，就能发现不同。'} },
    { no:'EA-2', title:{ko:'공통점과 차이점', en:'Same and different',         zh:'相同点和不同点'},
      lede:{ko:'닮은 점을 찾으면 왜 닮았는지도 말할 수 있어요.', en:'Find what is alike, then say why.', zh:'找到相似的地方，再说说为什么。'} },
    { no:'EA-3', title:{ko:'변화의 규칙',     en:'Rules and patterns',         zh:'变化的规律'},
      lede:{ko:'끼리끼리 모으고, 되풀이되는 규칙을 찾아요.', en:'Sort things into groups and find the repeating rule.', zh:'把同类放在一起，找出重复的规律。'} },
    { no:'EA-4', title:{ko:'예측하기',        en:'What comes next',            zh:'预测'},
      lede:{ko:'지금까지를 보고 다음을 짐작해요.', en:'Look at what happened and guess what comes next.', zh:'看看前面，猜猜后面。'} },
    { no:'EA-5', title:{ko:'언어의 규칙 ①',   en:'Word rules ①',               zh:'语言的规律①'},
      lede:{ko:'낱말과 낱말 사이에도 규칙이 있어요.', en:'Words follow rules too.', zh:'词和词之间也有规律。'} },
    { no:'EA-6', title:{ko:'언어의 규칙 ②',   en:'Word rules ②',               zh:'语言的规律②'},
      lede:{ko:'소리를 흉내 내고, 낱말을 이어 문장을 만들어요.', en:'Copy sounds and put words in order to make a sentence.', zh:'模仿声音，把词连成句子。'} }
  ]
};

/* ── 도우미 ── */
function rngOf(seed){
  const R = window.NM_RNG;
  return R ? R.mulberry32(R.hashSeed('lt' + seed)) : (() => { let x = 1234567; return () => { x = (x * 48271) % 2147483647; return x / 2147483647; }; })();
}
const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];
function shuffle(rng, arr){ const a = arr.slice(); for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function withTag(tag){ return KEYS.filter(k => ICONS[k].t.indexOf(tag) >= 0); }
function sample(rng, arr, n){ return shuffle(rng, arr).slice(0, n); }
const cell = (key, label, extra) => `<figure class="nm-lt-cell${extra ? ' ' + extra : ''}">${iconSvg(key)}${label ? `<figcaption>${esc(label)}</figcaption>` : ''}</figure>`;
const nameOf = (key, lang) => L(ICONS[key].n, lang);
const circled = i => ['①','②','③','④','⑤','⑥','⑦','⑧'][i] || String(i + 1);
const box = (title, body, cls) => `<section class="nm-lt-act${cls ? ' ' + cls : ''}"><h3>${title}</h3>${body}</section>`;

/* ── 주제별 활동 ── 각 함수는 {acts:[html,html], answers:[문자열…]} 를 돌려준다 */
function ea1(rng, lang){
  /* ① 다른 곳 찾기 — 같은 그림 여덟 칸, 오른쪽은 세 칸이 다르다(그림이 바뀌거나 뒤집힘) */
  const base = sample(rng, KEYS, 8);
  const changed = sample(rng, [0,1,2,3,4,5,6,7], 3).sort((a, b) => a - b);
  const right = base.map((k, i) => {
    if(changed.indexOf(i) < 0) return { k, flip:false };
    if(rng() < 0.4) return { k, flip:true };
    return { k: pick(rng, KEYS.filter(x => base.indexOf(x) < 0)), flip:false };
  });
  const grid = cells => `<div class="nm-lt-grid8">${cells.join('')}</div>`;
  const a1 = box(L({ko:'두 그림에서 다른 곳 세 군데를 찾아 ○ 하세요.', en:'Find three places where the two pictures differ and circle them.', zh:'找出两幅图里三个不一样的地方，圈出来。'}, lang),
    `<div class="nm-lt-pair">${grid(base.map(k => `<div class="nm-lt-cell">${iconSvg(k)}</div>`))}<div class="nm-lt-vs">✦</div>${grid(right.map(r => `<div class="nm-lt-cell">${iconSvg(r.k, {flip:r.flip})}</div>`))}</div>`);
  /* ② 특징 ○× — 그림 하나, 문장 넷(참 둘·거짓 둘) */
  const key = pick(rng, KEYS.filter(k => ICONS[k].t.filter(t => TRAIT[t]).length >= 2));
  const trueT = sample(rng, ICONS[key].t.filter(t => TRAIT[t]), 2);
  const falseT = sample(rng, FALSE_TRAITS.filter(t => ICONS[key].t.indexOf(t) < 0), 2);
  const rows = shuffle(rng, trueT.map(t => ({ t, ok:true })).concat(falseT.map(t => ({ t, ok:false }))));
  const a2 = box(L({ko:'맞으면 ○, 틀리면 ×를 쓰세요.', en:'Write ○ if it is true and × if it is false.', zh:'对的画○，错的画×。'}, lang),
    `<div class="nm-lt-side">${cell(key, nameOf(key, lang))}<ol class="nm-lt-ox">${rows.map(r => `<li><span>${esc(L(TRAIT[r.t], lang))}</span><i></i></li>`).join('')}</ol></div>`);
  return { acts:[a1, a2], answers:[
    L({ko:'다른 곳', en:'Different', zh:'不同处'}, lang) + ' ' + changed.map(i => circled(i)).join(' '),
    rows.map((r, i) => circled(i) + (r.ok ? '○' : '×')).join(' ')] };
}
function ea2(rng, lang){
  /* ① 닮은 것끼리 — 셋 중 둘은 같은 묶음 */
  const tag = pick(rng, GROUP_KEYS.filter(t => withTag(t).length >= 3));
  const two = sample(rng, withTag(tag), 2);
  const other = pick(rng, KEYS.filter(k => ICONS[k].t.indexOf(tag) < 0));
  const trio = shuffle(rng, two.concat([other]));
  const a1 = box(L({ko:'셋 중에서 서로 닮은 둘을 찾아 ○ 하고, 왜 닮았는지 말해 보세요.', en:'Circle the two that are alike and say why.', zh:'三个里面圈出相似的两个，说说为什么。'}, lang),
    `<div class="nm-lt-row3">${trio.map(k => cell(k, nameOf(k, lang))).join('')}</div>`);
  /* ② 같은 점·다른 점 — 둘 */
  const tag2 = pick(rng, GROUP_KEYS.filter(t => t !== tag && withTag(t).length >= 2));
  const pair = sample(rng, withTag(tag2), 2);
  const a2 = box(L({ko:'둘의 같은 점 하나, 다른 점 하나를 말해 보세요.', en:'Say one thing that is the same and one thing that is different.', zh:'说一个相同点，再说一个不同点。'}, lang),
    `<div class="nm-lt-row2">${pair.map(k => cell(k, nameOf(k, lang))).join('')}</div><div class="nm-lt-hint"><b>${esc(L({ko:'같은 점', en:'Same', zh:'相同'}, lang))}</b><i></i><b>${esc(L({ko:'다른 점', en:'Different', zh:'不同'}, lang))}</b><i></i></div>`, 'nm-lt-talk');
  return { acts:[a1, a2], answers:[
    two.map(k => nameOf(k, lang)).join(' · ') + ' — ' + L(GROUP[tag], lang),
    L({ko:'같은 점 예', en:'e.g. same', zh:'相同点例如'}, lang) + ': ' + L(GROUP[tag2], lang)] };
}
function ea3(rng, lang){
  /* ① 분류하기 — 여섯을 두 바구니로 */
  const pairs = [['food','vehicle'],['animal','plant'],['sky','food'],['school','animal'],['food','toy'],['animal','vehicle'],['plant','vehicle'],['sky','animal']];
  const [ta, tb] = pick(rng, pairs.filter(([x, y]) => withTag(x).filter(k => ICONS[k].t.indexOf(y) < 0).length >= 3 && withTag(y).filter(k => ICONS[k].t.indexOf(x) < 0).length >= 3));
  const A = sample(rng, withTag(ta).filter(k => ICONS[k].t.indexOf(tb) < 0), 3), B = sample(rng, withTag(tb).filter(k => ICONS[k].t.indexOf(ta) < 0), 3);
  const six = shuffle(rng, A.concat(B));
  const a1 = box(L({ko:'끼리끼리 나누어 바구니와 선으로 이어 보세요.', en:'Sort them into the two baskets with lines.', zh:'把它们分成两组，用线连到篮子里。'}, lang),
    `<div class="nm-lt-row6">${six.map((k, i) => cell(k, circled(i))).join('')}</div><div class="nm-lt-baskets"><div class="nm-lt-basket">${esc(L(GROUP[ta], lang))}</div><div class="nm-lt-basket">${esc(L(GROUP[tb], lang))}</div></div>`);
  /* ② 규칙 찾기 — 도형 여섯, 다음 것을 셋 중에서 */
  const pat = pick(rng, PATTERNS), used = sample(rng, SHAPES, 3);
  const seq = pat.map(i => used[i]);
  const nextShape = used[pat[6 % pat.length]];   // 여섯 개 뒤에 올 것 = 규칙의 다음 자리
  const opts = shuffle(rng, used.slice());
  const shapeSvg = s => `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${s.s}</svg>`;
  const a2 = box(L({ko:'규칙을 찾아 다음에 올 모양을 고르세요.', en:'Find the rule and choose the shape that comes next.', zh:'找出规律，选出下一个图形。'}, lang),
    `<div class="nm-lt-seq">${seq.map(s => `<div class="nm-lt-cell">${shapeSvg(s)}</div>`).join('')}<div class="nm-lt-cell nm-lt-q">?</div></div><div class="nm-lt-opts">${opts.map((s, i) => `<div class="nm-lt-cell">${shapeSvg(s)}<figcaption>${circled(i)}</figcaption></div>`).join('')}</div>`);
  return { acts:[a1, a2], answers:[
    L(GROUP[ta], lang) + ' ' + six.map((k, i) => A.indexOf(k) >= 0 ? circled(i) : '').filter(Boolean).join('') + ' · ' + L(GROUP[tb], lang) + ' ' + six.map((k, i) => B.indexOf(k) >= 0 ? circled(i) : '').filter(Boolean).join(''),
    circled(opts.indexOf(nextShape))] };
}
function ea4(rng, lang){
  /* ① 다음엔? — 이어지는 그림 */
  const sq = pick(rng, SEQ);
  const opts = shuffle(rng, [sq.steps[2]].concat(sq.wrong));
  const a1 = box(L({ko:'다음에는 어떤 일이 일어날까요? 알맞은 그림을 고르세요.', en:'What happens next? Choose the right picture.', zh:'接下来会发生什么？选出合适的图。'}, lang),
    `<div class="nm-lt-seq">${sq.steps.slice(0, 2).map(k => `<div class="nm-lt-cell">${iconSvg(k)}</div><div class="nm-lt-arrow">→</div>`).join('')}<div class="nm-lt-cell nm-lt-q">?</div></div><div class="nm-lt-opts">${opts.map((k, i) => cell(k, circled(i))).join('')}</div>`);
  /* ② 나는 누구일까요 — 성질 셋 */
  const key = pick(rng, KEYS.filter(k => ICONS[k].t.filter(t => TRAIT[t]).length >= 2));
  const clues = sample(rng, ICONS[key].t.filter(t => TRAIT[t]), 2);
  const wrongs = sample(rng, KEYS.filter(k => k !== key && !clues.every(t => ICONS[k].t.indexOf(t) >= 0)), 2);
  const opts2 = shuffle(rng, [key].concat(wrongs));
  const a2 = box(L({ko:'나는 누구일까요? 힌트를 읽고 고르세요.', en:'Who am I? Read the clues and choose.', zh:'我是谁？读一读提示，选一选。'}, lang),
    `<ul class="nm-lt-clues">${clues.map(t => `<li>${esc(L(TRAIT[t], lang))}</li>`).join('')}</ul><div class="nm-lt-opts">${opts2.map((k, i) => cell(k, circled(i))).join('')}</div>`);
  return { acts:[a1, a2], answers:[circled(opts.indexOf(sq.steps[2])) + ' — ' + L(sq.why, lang), circled(opts2.indexOf(key)) + ' ' + nameOf(key, lang)] };
}
function ea5(rng, lang){
  /* ① 낱말 관계 — 반대말 짝 맞추기 */
  const bank = OPP[lang] || OPP.ko;
  const [p1, p2] = sample(rng, bank, 2);
  const wrongs = sample(rng, bank.filter(p => p !== p1 && p !== p2).map(p => p[1]), 2);
  const opts = shuffle(rng, [p2[1]].concat(wrongs));
  const a1 = box(L({ko:'앞의 짝을 보고, 빈칸에 올 낱말을 고르세요.', en:'Look at the first pair, then choose the word for the blank.', zh:'看前面的一对，选出空格里的词。'}, lang),
    `<div class="nm-lt-analogy"><b>${esc(p1[0])}</b> : <b>${esc(p1[1])}</b><span>=</span><b>${esc(p2[0])}</b> : <i>?</i></div><div class="nm-lt-words">${opts.map((w, i) => `<span>${circled(i)} ${esc(w)}</span>`).join('')}</div>`);
  /* ② 끝말잇기 기차 */
  const chain = pick(rng, CHAIN[lang] || CHAIN.ko);
  const blank = 1 + Math.floor(rng() * 2);   // 두 번째 또는 세 번째 칸
  const wrong2 = sample(rng, CHAIN_WRONG[lang] || CHAIN_WRONG.ko, 2);
  const opts2 = shuffle(rng, [chain[blank]].concat(wrong2));
  const rule = L({ko:'앞 낱말의 끝 글자로 시작하는 낱말을 이어요.', en:'The next word starts with the last letter of the word before.', zh:'下一个词用前一个词的最后一个字开头。'}, lang);
  const a2 = box(L({ko:'끝말잇기 기차 — 빈칸에 들어갈 낱말을 고르세요.', en:'Word train — choose the word for the empty car.', zh:'词语接龙火车——选出空车厢里的词。'}, lang),
    `<div class="nm-lt-train">${chain.map((w, i) => `<div class="nm-lt-car${i === blank ? ' nm-lt-q' : ''}">${i === blank ? '?' : esc(w)}</div>`).join('<div class="nm-lt-link"></div>')}</div><div class="nm-lt-words">${opts2.map((w, i) => `<span>${circled(i)} ${esc(w)}</span>`).join('')}</div><p class="nm-lt-note">${esc(rule)}</p>`);
  return { acts:[a1, a2], answers:[circled(opts.indexOf(p2[1])) + ' ' + p2[1], circled(opts2.indexOf(chain[blank])) + ' ' + chain[blank]] };
}
function ea6(rng, lang){
  /* ① 흉내 내는 말 */
  const three = sample(rng, SOUND, 3);
  const target = pick(rng, three);
  const opts = shuffle(rng, three.map(s => L(s.w, lang)));
  const a1 = box(L({ko:'그림에 어울리는 흉내 내는 말을 고르고, 소리 내어 읽어 보세요.', en:'Choose the sound word that matches the picture and say it out loud.', zh:'选出和图相配的拟声词，大声读出来。'}, lang),
    `<div class="nm-lt-side">${cell(target.icon, nameOf(target.icon, lang))}<div class="nm-lt-words nm-lt-big">${opts.map((w, i) => `<span>${circled(i)} ${esc(w)}</span>`).join('')}</div></div>`);
  /* ② 문장 만들기 — 카드 셋에 순서 번호 */
  const sent = pick(rng, SENT);
  const cards = sent[lang] || sent.ko;
  const order = shuffle(rng, [0,1,2]);   // 보이는 순서 → 원래 자리
  const a2 = box(L({ko:'낱말 카드를 바른 순서로 번호를 쓰고, 문장을 읽어 보세요.', en:'Number the cards in the right order, then read the sentence.', zh:'给词卡按正确顺序标上号，再读一读句子。'}, lang),
    `<div class="nm-lt-row2 nm-lt-mini">${sent.icons.map(k => ICONS[k] ? `<div class="nm-lt-cell">${iconSvg(k)}</div>` : '').join('')}</div><div class="nm-lt-cards">${order.map(i => `<div class="nm-lt-card"><i></i><span>${esc(cards[i])}</span></div>`).join('')}</div>`);
  return { acts:[a1, a2], answers:[circled(opts.indexOf(L(target.w, lang))) + ' ' + L(target.w, lang), order.map(i => i + 1).join(' → ') + ' — ' + cards.join(' ')] };
}
const BUILDERS = [ea1, ea2, ea3, ea4, ea5, ea6];

/* ── 셋째 활동: 말해 보세요 — 열린 물음(교재의 각 차시가 끝에 두는 열린 과제 자리). 부모가 아이 말을 적어 준다. */
const TALK = [
  [ {ko:'우리 집에서 동그란 것을 세 가지 찾아 말해 보세요.', en:'Find three round things at home and name them.', zh:'在家里找三样圆的东西，说出来。'},
    {ko:'눈을 감고 지금 들리는 소리를 세 가지 말해 보세요.', en:'Close your eyes and name three sounds you hear.', zh:'闭上眼睛，说出你听到的三种声音。'},
    {ko:'오늘 입은 옷을 자세히 보고 색과 무늬를 말해 보세요.', en:'Look at your clothes and describe the colors and patterns.', zh:'看看今天穿的衣服，说说颜色和花纹。'} ],
  [ {ko:'나와 엄마(아빠)의 같은 점 하나, 다른 점 하나를 말해 보세요.', en:'Say one way you and a parent are alike, and one way you differ.', zh:'说一个你和爸爸（妈妈）相同的地方，一个不同的地方。'},
    {ko:'사과와 귤은 무엇이 같고 무엇이 다를까요?', en:'How are an apple and an orange alike, and how are they different?', zh:'苹果和橘子哪里一样，哪里不一样？'},
    {ko:'낮과 밤은 무엇이 다를까요? 세 가지 말해 보세요.', en:'How are day and night different? Say three things.', zh:'白天和黑夜有什么不同？说三个。'} ],
  [ {ko:'우리 주변에서 조금씩 커지는 것을 찾아 말해 보세요.', en:'Find things around you that slowly grow bigger.', zh:'找找周围慢慢变大的东西，说一说。'},
    {ko:'집에 있는 물건을 "먹는 것"과 "먹지 않는 것"으로 나누어 보세요.', en:'Sort things at home into "things to eat" and "things not to eat".', zh:'把家里的东西分成"能吃的"和"不能吃的"。'},
    {ko:'낮 → 밤 → 낮처럼 되풀이되는 것을 하나 더 찾아보세요.', en:'Day, night, day… find one more thing that repeats like that.', zh:'白天→黑夜→白天……再找一个这样重复的事情。'} ],
  [ {ko:'비가 오면 어떤 일이 일어날까요? 세 가지 짐작해 보세요.', en:'What happens when it rains? Guess three things.', zh:'下雨了会发生什么？猜三件事。'},
    {ko:'씨앗을 심고 물을 주면 어떻게 될까요?', en:'What happens if you plant a seed and water it?', zh:'种下种子浇上水，会怎么样？'},
    {ko:'내일 아침에 제일 먼저 무엇을 할 것 같아요?', en:'What do you think you will do first tomorrow morning?', zh:'你觉得明天早上你会先做什么？'} ],
  [ {ko:'"가"로 시작하는 낱말을 다섯 개 말해 보세요.', en:'Say five words that start with the letter B.', zh:'说五个以"大"字开头的词。'},
    {ko:'"크다"의 반대말은? "빠르다"의 반대말은?', en:'What is the opposite of "big"? Of "fast"?', zh:'"大"的反义词是什么？"快"呢？'},
    {ko:'끝말잇기를 다섯 개 이어 보세요. 사과 → 과자 → …', en:'Make a word train of five: the next word starts with the last letter. cat → tiger → …', zh:'接龙五个词：天空→空气→……'} ],
  [ {ko:'오늘 들은 소리를 흉내 내어 보세요. 무슨 소리였나요?', en:'Copy a sound you heard today. What made it?', zh:'模仿今天听到的一种声音。是什么发出的？'},
    {ko:'"토끼가 당근을 먹어요"처럼 세 낱말로 문장을 하나 만들어 보세요.', en:'Make a three-word sentence like "Rabbits eat carrots."', zh:'像"兔子吃胡萝卜"一样，用三个词说一句话。'},
    {ko:'가족에게 오늘 있었던 일을 한 문장으로 말해 보세요.', en:'Tell your family one thing that happened today, in one sentence.', zh:'用一句话告诉家人今天发生的一件事。'} ]
];

/* ── 지면 하나 ── idx: 회차(0부터, 주제 = idx mod 6) · seed: 봉투 코드 · lang: ko|en|zh · courseTitle: 머리띠 오른쪽 */
function pageHtml(idx, seed, lang, courseTitle, code){
  lang = (lang === 'en' || lang === 'zh') ? lang : 'ko';
  const ti = ((idx % 6) + 6) % 6, theme = T.themes[ti];
  const rng = rngOf(seed + ':' + ti);
  const r = BUILDERS[ti](rng, lang);
  const talk = pick(rng, TALK[ti]);
  const a3 = `<section class="nm-lt-act nm-lt-talk"><h3><span class="nm-lt-tag">${esc(L(T.talk, lang))}</span>${esc(L(talk, lang))}</h3><div class="nm-lt-lines"><i></i><i></i></div><p class="nm-lt-note">${esc(L({ko:'아이가 말한 것을 어른이 적어 주세요.', en:'A grown-up writes down what the child says.', zh:'请大人把孩子说的话写下来。'}, lang))}</p></section>`;
  return `<div class="nm-w2-page nm-lt-page">
  <div class="nm-mzs-band"><b>${esc(L(T.band, lang))}</b><span>${esc(courseTitle || 'Numbers of Magic')}</span></div>
  <div class="nm-mzs-dash"></div>
  <div class="nm-lt-head"><span class="nm-lt-no">${esc(theme.no)}</span><h2>${esc(L(theme.title, lang))}</h2></div>
  <p class="nm-lt-lede">${esc(L(theme.lede, lang))}</p>
  ${r.acts[0]}
  ${r.acts[1]}
  ${a3}
  <p class="nm-lt-answers"><b>${esc(L(T.answer, lang))}</b> ${r.answers.map((a, i) => `${i + 1}) ${esc(a)}`).join('  ·  ')}</p>
  <div class="nm-w2-foot"><span class="nm-w2-foot-code">${esc(code || '')}</span></div>
</div>`;
}

window.NM_LANG_THINK = { pageHtml, themes:T.themes, ICONS, iconSvg, BUILDERS, rngOf };
})();
