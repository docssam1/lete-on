/* ============================================================
   Numbers of Magic — 언어사고력 · 이해편 지면 (유아·초1~2 주간 학습지)  2026-09-30

   원장: "수학 이야기 밀고 우리 언어사고력 넣자. A-1부터 6까지. 유아는 처음에는 없다가
          유아 연산 중반 정도부터." → "아니, 이해편을 하려고."

   무엇인가
   ------------------------------------------------------------
   지필드 「유·초등 저학년을 위한 언어사고력 프로그램」 **이해편 A** 여섯 권의 틀(Polya 네 단계를
   여섯으로 편 것, 문장제-설계.md §2)을 따른다. 회차마다 한 단계, 단계마다 활동 셋.
     A-1 어떻게 문제를 풀어야 할까 (중요한 숫자·주어진 것과 구하는 것·끊어 읽기)
     A-2 문제의 상황을 우뇌로 그려라 (○로 그리기·수직선·그림에서 답 세기)
     A-3 상황에 적절한 연산을 찾아라 (더할까 뺄까·같은 상황 찾기·신호어)
     A-4 식으로 나타내어라 (식 완성·식을 말로·단위 붙여 답 쓰기)
     A-5 돌다리도 두들겨 보고 건너라 (바르게 푼 것·어림·답이 뜻하는 것)
     A-6 문제를 만들어라 (식을 말로·같은 식의 새 문제 — 무엇으로? 어떤 이야기? 고르기)

   상황 하나 → 여섯 단계 전부 파생(문장제-설계.md §1). 상황은 engine/threads/wp.js 의
   makeSituation(window.NM_WP)이 만든다 — 문장제 회차(WP1·3·4·5)와 같은 원천이라 아이가 문제 회차에서
   본 것과 같은 말투·같은 이름·같은 사물로 이어진다.

   자료 취급(문장제-설계.md §0 그대로): **방법·구조만 쓴다.** 교재의 지문·그림·문항은 옮기지 않는다 —
   상황은 매번 새로 만들어지고, 3개 언어는 번역이 아니라 언어마다 따로 쓴 문장이다.

   앱(웹) 쪽 짝: 고르기·조작으로 같은 단계를 한다 — WP1(이해)·WP2(그림, wpScene 위젯)·WP3(연산)·WP4(식)·WP5(점검)·
   WP6(문제 만들기, 이야기 고르기). engine/threads/wp.js.

   쓰는 곳: app/exam.js renderMixedSheet — 나이대(readingAgeBand)가 young 인 주간 학습지에서 수학 이야기
   자리에. 유아(과정 0)는 회차 10부터(그 전엔 읽을거리 없음)이고 더하기·빼기 상황만, 초1~2는 곱셈(배수)까지.
   ============================================================ */
(function(){
'use strict';

function esc(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
const L = (o, lang) => (o && (o[lang] != null ? o[lang] : o.ko)) || '';
const circled = i => ['①','②','③','④','⑤','⑥'][i] || String(i + 1);
function rngOf(seed){ const R = window.NM_RNG; return R.mulberry32(R.hashSeed('lt' + seed)); }
const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];
function shuffle(rng, arr){ const a = arr.slice(); for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const box = (title, body, cls) => `<section class="nm-lt-act${cls ? ' ' + cls : ''}"><h3>${title}</h3>${body}</section>`;
const blank = (w) => `<i class="nm-lt-blank" style="width:${w || 14}mm"></i>`;
/* 한국어 조사(검수 2026-09-30) — "도윤은(는)"·"하준의"·"3을(를)"이 그대로 찍혔다. 이름은 받침이 있으면 '이'를 끼운다(하준이는·하준이의),
   수는 마지막 숫자를 읽었을 때의 받침으로 정한다(영·일·삼·육·칠·팔 = 받침 있음, 이·사·오·구 = 없음). */
const bat = w => { const c = String(w).charCodeAt(String(w).length - 1); return c >= 0xAC00 && c <= 0xD7A3 && (c - 0xAC00) % 28 > 0; };
const neun = w => w + (bat(w) ? '이는' : '는');
const nui = w => w + (bat(w) ? '이의' : '의');
const numBat = n => '013678'.indexOf(String(n).slice(-1)) >= 0;
const numJ = (n, a, b) => n + (numBat(n) ? a : b);

const T = {
  band:   {ko:'언어사고력 · 이해편', en:'Language & Thinking · Understanding', zh:'语言思考力 · 理解篇'},
  answer: {ko:'정답', en:'Answers', zh:'答案'},
  story:  {ko:'문제', en:'Problem', zh:'题目'},
  stages: [
    { no:'A-1', title:{ko:'어떻게 문제를 풀어야 할까?', en:'How do we solve a problem?', zh:'怎样解题？'},
      lede:{ko:'문제를 읽고, 무엇을 알려 주고 무엇을 묻는지 찾아요.', en:'Read the problem and find what it tells you and what it asks.', zh:'读题，找出已知的和要求的。'} },
    { no:'A-2', title:{ko:'문제의 상황을 그림으로 그려라', en:'Draw the situation', zh:'把题目的情景画出来'},
      lede:{ko:'글을 ○와 수직선으로 바꾸면 계산이 보여요.', en:'Turn the words into circles and a number line, and the math shows.', zh:'把文字变成○和数轴，算式就看出来了。'} },
    { no:'A-3', title:{ko:'알맞은 계산을 찾아라', en:'Find the right operation', zh:'找出合适的运算'},
      lede:{ko:'더할까, 뺄까? 이유를 말할 수 있어야 해요.', en:'Add or subtract? You should be able to say why.', zh:'是加还是减？要能说出理由。'} },
    { no:'A-4', title:{ko:'식으로 나타내어라', en:'Write it as a number sentence', zh:'用算式表示'},
      lede:{ko:'이야기를 식으로 바꾸고, 식을 말로 다시 읽어요.', en:'Turn the story into a number sentence, then read it back in words.', zh:'把故事写成算式，再用话读出来。'} },
    { no:'A-5', title:{ko:'돌다리도 두들겨 보고 건너라', en:'Check before you cross', zh:'过桥前先敲一敲'},
      lede:{ko:'답을 쓰기 전에 계산과 뜻을 다시 살펴요.', en:'Before writing the answer, check the arithmetic and the meaning.', zh:'写答案前，再检查一遍计算和意思。'} },
    { no:'A-6', title:{ko:'문제를 만들어라', en:'Make your own problem', zh:'自己编一道题'},
      lede:{ko:'식을 보고 이야기를 만들 수 있으면 정말 아는 거예요.', en:'If you can make a story from a number sentence, you really understand it.', zh:'能看着算式编故事，才是真的懂了。'} }
  ],
  ops: { '+':{ko:'더하기',en:'addition',zh:'加法'}, '−':{ko:'빼기',en:'subtraction',zh:'减法'}, '×':{ko:'곱하기',en:'multiplication',zh:'乘法'} },
  opVerb: { '+':{ko:'더합니다',en:'add',zh:'加'}, '−':{ko:'뺍니다',en:'subtract',zh:'减'}, '×':{ko:'곱합니다',en:'multiply',zh:'乘'} },
  opNoun: { '+':{ko:'합',en:'sum',zh:'和'}, '−':{ko:'차',en:'difference',zh:'差'}, '×':{ko:'곱',en:'product',zh:'积'} },
  /* 의미 유형이 묻는 것 — 구하는 것 보기·답의 뜻 보기에 쓴다 */
  ask: {
    합병:{ko:'두 사람이 가진 것을 모두 합한 수', en:'the total both people have', zh:'两个人一共有的数量'},
    첨가:{ko:'더 받고 난 뒤의 수', en:'the number after getting more', zh:'又得到之后的数量'},
    구잔:{ko:'쓰고(먹고, 주고) 남은 수', en:'the number left over', zh:'剩下的数量'},
    구차:{ko:'누가 몇 개 더 많은지', en:'how many more one has than the other', zh:'谁比谁多几个'},
    배수:{ko:'묶음을 다 합한 수', en:'the total in all the groups', zh:'所有组加起来的数量'}
  },
  signal: {
    합병:{ko:'모두', en:'altogether', zh:'一共'}, 첨가:{ko:'더', en:'more', zh:'又'},
    구잔:{ko:'남은', en:'left', zh:'剩'}, 구차:{ko:'더 많', en:'more than', zh:'多'}, 배수:{ko:'씩', en:'each', zh:'每'}
  }
};

/* ── 상황 하나 ── 유아(infant)는 더하기·빼기만 */
function situation(rng, infant){
  const kinds = infant ? ['합병','첨가','구잔','구차'] : ['합병','첨가','구잔','구차','배수'];
  const kind = pick(rng, kinds);
  const s = window.NM_WP.makeSituation(rng, { range:'A', kind, numeric:'decimal' });
  s.infant = !!infant;
  return s;
}
const WP = () => window.NM_WP;
function qty(s, n, lang){ return lang === 'ko' ? WP().koQ(s.o, n) : lang === 'zh' ? WP().zhQ(s.o, n) : WP().enQ(s.o, n); }
function unitTxt(s, lang){ return lang === 'ko' ? s.o.ko.u : lang === 'zh' ? s.o.zh.u : ''; }
function nameOf(s, who, lang){ return who === 'A' ? L(s.A, lang) : L(s.B, lang); }
function storyHtml(s, lang){
  const sents = s.story[lang].sents.slice(), q = s.story[lang].q;
  const sep = lang === 'zh' ? '' : ' ';
  return `<div class="nm-lt-story"><b>${esc(L(T.story, lang))}</b><p>${esc(sents.join(sep) + sep + q)}</p></div>`;
}
/* 세 부분으로 끊어 읽기 — 문장 사이에 / */
const res = s => WP().resultOf(s);
/* 구하는 것·답의 뜻 보기 셋 — 정답 + 두 사람 각각의 수(또는 처음 수·줄어든 수) */
function eqHtml(s, withResult){
  return `<div class="nm-lt-eq"><b>${s.n1}</b><i class="nm-lt-op">○</i><i class="nm-lt-num"></i><span>=</span><i class="nm-lt-num"></i></div>`;
}
/* ○ 그림 — 의미 유형별 */
function circlesHtml(s, lang){
  const dots = n => `<span class="nm-lt-dots">${'○'.repeat(n)}</span>`;
  const label = (t) => `<small>${esc(t)}</small>`;
  /* 원장(2026-09-30): "기본 바탕 그림은 그려 주라는 얘기야" — 아이가 그리는 게 아니라, 다 그려진 그림에 색칠·표시한다.
     합병·첨가: 두 상자 다 ○로 채워 두고 둘째 상자를 색칠 · 구잔: ×로 지우기 · 구차: 짝짓기 · 배수: 묶음 전부 채워 두고 세기 */
  if(s.kind === '합병' || s.kind === '첨가'){
    const l1 = s.kind === '합병' ? {ko:`${nui(L(s.A,'ko'))} ${s.o.ko.n} ${s.n1}${s.o.ko.u}`, en:`${L(s.A,'en')}'s ${s.n1} ${s.o.en.n}`, zh:`${L(s.A,'zh')}的${s.n1}${s.o.zh.u}${s.o.zh.n}`} : {ko:`처음 ${s.o.ko.n} ${s.n1}${s.o.ko.u}`, en:`${s.n1} ${s.o.en.n} at first`, zh:`一开始的${s.n1}${s.o.zh.u}${s.o.zh.n}`};
    const l2 = s.kind === '합병' ? {ko:`${nui(L(s.B,'ko'))} ${s.o.ko.n} ${s.n2}${s.o.ko.u} — 색칠하세요`, en:`${L(s.B,'en')}'s ${s.n2} ${s.o.en.n} — color them in`, zh:`${L(s.B,'zh')}的${s.n2}${s.o.zh.u}${s.o.zh.n}——涂上颜色`} : {ko:`더 받은 ${s.o.ko.n} ${s.n2}${s.o.ko.u} — 색칠하세요`, en:`${s.n2} ${s.o.en.n} added — color them in`, zh:`又得到的${s.n2}${s.o.zh.u}${s.o.zh.n}——涂上颜色`};
    return `<div class="nm-lt-two"><div>${dots(s.n1)}${label(L(l1, lang))}</div><div>${dots(s.n2)}${label(L(l2, lang))}</div></div>`;
  }
  if(s.kind === '구잔'){
    return `<div class="nm-lt-one">${dots(s.n1)}${label(L({ko:`처음 ${s.o.ko.n} ${s.n1}${s.o.ko.u} — 없어진 만큼 ×로 지우세요`, en:`${s.n1} ${s.o.en.n} at first — cross out the ones taken away`, zh:`一开始${s.n1}${s.o.zh.u}${s.o.zh.n}——把减少的用×划掉`}, lang))}</div>`;
  }
  if(s.kind === '구차'){
    return `<div class="nm-lt-rows"><div><small>${esc(nameOf(s,'A',lang))}</small>${dots(s.n1)}</div><div><small>${esc(nameOf(s,'B',lang))}</small>${dots(s.n2)}</div><small>${esc(L({ko:'위아래로 하나씩 짝을 지으세요. 짝이 없는 ○는 몇 개?', en:'Pair them up top to bottom. How many circles have no partner?', zh:'上下一一配对。没有配对的○有几个？'}, lang))}</small></div>`;
  }
  /* 배수 — n2 묶음에 n1씩 전부 그려 둔다. 아이는 묶음마다 ○를 세고 묶음 수를 센다 */
  const groups = []; for(let i = 0; i < s.n2; i++) groups.push(`<div class="nm-lt-group">${dots(s.n1)}</div>`);
  return `<div class="nm-lt-groups">${groups.join('')}</div><small>${esc(L({ko:`한 ${s.g ? s.g.ko.n : '묶음'}에 ${s.n1}${s.o.ko.u}씩 ${s.n2}${s.g ? s.g.ko.u : '묶음'} — ${s.g ? s.g.ko.n : '묶음'}마다 ○에 번호를 써 보세요`, en:`${s.n1} in each ${s.g ? s.g.en.one : 'group'}, ${s.n2} ${s.g ? s.g.en.many : 'groups'} — number the circles in each one`, zh:`每${s.g ? s.g.zh.u : '组'}${s.n1}${s.o.zh.u}，共${s.n2}${s.g ? s.g.zh.u : '组'}——给每${s.g ? s.g.zh.u : '组'}的○编上号`}, lang))}</small>`;
}
/* 수직선 0~25 — 첫 화살표는 그려 두고 둘째는 아이가 */
function numlineHtml(s, lang){
  const max = 25, W = 300, x = n => 10 + n * (W - 20) / max;
  let g = `<line x1="${x(0)}" y1="30" x2="${x(max)}" y2="30" stroke="#20343b" stroke-width="1.5"/>`;
  for(let n = 0; n <= max; n++) g += `<line x1="${x(n)}" y1="${n % 5 ? 27 : 24}" x2="${x(n)}" y2="${n % 5 ? 33 : 36}" stroke="#20343b" stroke-width="1"/>` + (n % 5 === 0 ? `<text x="${x(n)}" y="46" font-size="8" text-anchor="middle" fill="#20343b">${n}</text>` : '');
  const start = s.op === '−' ? s.n1 : 0, end = s.op === '−' ? s.n1 : s.n1;
  if(start !== end) g += `<path d="M ${x(start)} 22 Q ${x((start + end) / 2)} 4 ${x(end)} 22" fill="none" stroke="#D9534F" stroke-width="2"/>`;   /* 빼기는 n1에 점만 — 시작=끝인 호는 가시처럼 찍혔다 */
  if(s.op !== '−') g += `<circle cx="${x(0)}" cy="30" r="2.5" fill="#D9534F"/>`;
  g += `<circle cx="${x(s.n1)}" cy="30" r="2.5" fill="#D9534F"/>`;
  const hint = s.op === '−'
    ? {ko:`${s.n1}에서 왼쪽으로 ${s.n2}칸 뛰어가 보세요. 도착한 수는?`, en:`From ${s.n1}, jump ${s.n2} to the left. Where do you land?`, zh:`从${s.n1}向左跳${s.n2}格，落在哪个数？`}
    : {ko:`${s.n1}에서 오른쪽으로 ${s.n2}칸 더 뛰어가 보세요. 도착한 수는?`, en:`From ${s.n1}, jump ${s.n2} more to the right. Where do you land?`, zh:`从${s.n1}再向右跳${s.n2}格，落在哪个数？`};
  return `<svg class="nm-lt-numline" viewBox="0 0 ${W} 50" xmlns="http://www.w3.org/2000/svg">${g}</svg><small>${esc(L(hint, lang))}</small>`;
}
/* 식을 말로 — 세 가지 말 중 빈칸 */
function eqWordsHtml(s, lang){
  const n1 = s.n1, n2 = s.n2, r = res(s);
  const rows = lang === 'ko'
    ? [`${n1}에 ${numJ(n2,'을','를')} ${blank(16)} (${L(T.opVerb[s.op],'ko')})`, s.op === '×' ? `${n1}씩 ${blank(10)}묶음입니다.` : `${n1}보다 ${n2} ${blank(12)} (${s.op === '+' ? '큽니다' : '작습니다'})`, `${numJ(n1,'과','와')} ${n2}의 ${blank(10)}은(는) ${r}입니다.`]
    : lang === 'en'
    ? [`${blank(16)} ${n2} ${s.op === '+' ? 'to' : s.op === '−' ? 'from' : 'by'} ${n1}. (${L(T.opVerb[s.op],'en')})`, s.op === '×' ? `${n2} groups of ${blank(10)}.` : `${n2} ${s.op === '+' ? 'more' : 'less'} than ${n1} is ${blank(10)}.`, `The ${blank(16)} of ${n1} and ${n2} is ${r}. (${L(T.opNoun[s.op],'en')})`]
    : [`${n1}${blank(10)}${n2}（${L(T.opVerb[s.op],'zh')}）`, s.op === '×' ? `${n1}个一组，共${blank(10)}组` : `比${n1}${s.op === '+' ? '多' : '少'}${n2}的数是${blank(10)}`, `${n1}和${n2}的${blank(10)}是${r}（${L(T.opNoun[s.op],'zh')}）`];
  return `<ul class="nm-lt-say">${rows.map(r => `<li>${r}</li>`).join('')}</ul>`;
}

/* ── 단계별 활동 둘 ── 원장(2026-09-30): "학습지는 쓰기. 단 유아이니 크게. 좀 나눠서 중요한 것만."
   한 장 = 상황 하나 + 그 단계의 핵심 활동 둘. 고르기 대신 **쓰기**(큰 빈칸·큰 상자). 고르기는 앱(WP 회차)이 한다.
   각 함수: {acts:[html×2], answers:[string×2]} */
const ansBox = (lang, unit, w) => `<div class="nm-lt-ans"><span>${esc(L({ko:'답', en:'Answer', zh:'答'}, lang))}</span><i class="nm-lt-abox" style="width:${w || 26}mm"></i><em>${esc(unit || '')}</em></div>`;
function a1(rng, s, lang){
  const givenRows = s.kind === '배수'
    ? [ [{ko:`한 ${s.g ? s.g.ko.n : '묶음'}에`, en:`In each ${s.g ? s.g.en.one : 'group'}`, zh:`每${s.g ? s.g.zh.u : '组'}`}, unitTxt(s, lang)], [{ko:s.g ? s.g.ko.n + (bat(s.g.ko.n) ? '은' : '는') : '묶음은', en:s.g ? s.g.en.many.replace(/^./, c => c.toUpperCase()) : 'Groups', zh:s.g ? s.g.zh.n + '数' : '组数'}, L({ko:s.g ? s.g.ko.u : '묶음', en:'', zh:s.g ? s.g.zh.u : '组'}, lang)] ]
    : (s.kind === '합병' || s.kind === '구차')
    ? [ [{ko:`${nui(L(s.A,'ko'))} ${s.o.ko.n}`, en:`${L(s.A,'en')}'s ${s.o.en.n}`, zh:`${L(s.A,'zh')}的${s.o.zh.n}`}, unitTxt(s, lang)], [{ko:`${nui(L(s.B,'ko'))} ${s.o.ko.n}`, en:`${L(s.B,'en')}'s ${s.o.en.n}`, zh:`${L(s.B,'zh')}的${s.o.zh.n}`}, unitTxt(s, lang)] ]
    : [ [{ko:`처음 ${s.o.ko.n}`, en:`${s.o.en.n} at first`, zh:`一开始的${s.o.zh.n}`}, unitTxt(s, lang)], [s.kind === '첨가' ? {ko:`더 받은 ${s.o.ko.n}`, en:`${s.o.en.n} added`, zh:`又得到的${s.o.zh.n}`} : {ko:`없어진 ${s.o.ko.n}`, en:`${s.o.en.n} taken away`, zh:`减少的${s.o.zh.n}`}, unitTxt(s, lang)] ];
  const act1 = box(L({ko:'문제를 소리 내어 읽고, 중요한 숫자에 ○ 하세요. 그 수를 아래에 쓰세요.', en:'Read the problem out loud and circle the important numbers. Write them below.', zh:'大声读题，圈出重要的数字，再写在下面。'}, lang),
    storyHtml(s, lang) + `<div class="nm-lt-given">${givenRows.map(([lab, u]) => `<div><b>${esc(L(lab, lang))}</b><i class="nm-lt-abox"></i><em>${esc(u)}</em></div>`).join('')}</div>`);
  const act2 = box(L({ko:'이 문제가 구하는 것은 무엇인가요? 써 보세요.', en:'What does the problem ask you to find? Write it.', zh:'这道题要求什么？写一写。'}, lang),
    `<div class="nm-lt-lines nm-lt-big"><i></i></div><p class="nm-lt-note">${esc(L({ko:'힌트: 물음표가 있는 문장을 다시 읽어요.', en:'Hint: read the sentence with the question mark again.', zh:'提示：再读一遍带问号的句子。'}, lang))}</p>`);
  return { acts:[act1, act2], answers:[`${s.n1}, ${s.n2}`, L(T.ask[s.kind], lang)] };
}
function a2(rng, s, lang){
  const r = res(s);
  const t1 = s.kind === '구차' ? {ko:'문제를 읽고, ○를 위아래로 짝지어 보세요.', en:'Read the problem and pair the circles top to bottom.', zh:'读题，把○上下配对。'}
    : s.kind === '구잔' ? {ko:'문제를 읽고, 없어진 만큼 ○를 ×로 지우세요.', en:'Read the problem and cross out the circles taken away.', zh:'读题，把减少的○用×划掉。'}
    : s.op === '×' ? {ko:'문제를 읽고, 그림에서 묶음을 세어 보세요.', en:'Read the problem and count the groups in the picture.', zh:'读题，在图里数一数有几组。'}
    : {ko:'문제를 읽고, 둘째 상자의 ○를 색칠하세요.', en:'Read the problem and color the circles in the second box.', zh:'读题，把第二个框里的○涂上颜色。'};
  const act1 = box(L(t1, lang), storyHtml(s, lang) + circlesHtml(s, lang));
  const act2 = s.op === '×'
    ? box(L({ko:'그림에서 세어 보고 답을 쓰세요.', en:'Count in your picture and write the answer.', zh:'在图里数一数，写出答案。'}, lang), ansBox(lang, unitTxt(s, lang)))
    : box(L({ko:'수직선에서 뛰어가 보고, 도착한 수를 쓰세요.', en:'Jump along the number line and write where you land.', zh:'在数轴上跳一跳，写出落到的数。'}, lang), numlineHtml(s, lang) + ansBox(lang, unitTxt(s, lang)));
  return { acts:[act1, act2], answers:[L({ko:'색칠·표시 활동', en:'coloring / marking', zh:'涂色·做记号'}, lang), String(r)] };
}
function a3(rng, s, lang){
  const act1 = box(L({ko:'이 문제는 어떤 계산을 해야 할까요? ○ 안에 +, −, × 중 알맞은 기호를 크게 쓰세요.', en:'Which operation does this problem need? Write +, − or × in the circle.', zh:'这道题要用哪种运算？在○里写上 +、− 或 ×。'}, lang),
    storyHtml(s, lang) + `<div class="nm-lt-opbig"><i></i><span>${esc(L({ko:'왜 그렇게 생각했나요? 말해 보세요.', en:'Why do you think so? Say it out loud.', zh:'为什么这样想？说一说。'}, lang))}</span></div>`);
  const sig = T.signal[s.kind];
  const act2 = box(L({ko:'문제에서 계산을 알려 주는 낱말을 찾아 쓰세요.', en:'Find the word in the problem that tells you the operation, and write it.', zh:'在题里找出提示运算的词，写下来。'}, lang),
    `<div class="nm-lt-lines nm-lt-big"><i></i></div><p class="nm-lt-note">${esc(L({ko:'"모두"·"남은"·"더 많"·"씩" 같은 말이 힌트예요. 그런데 "더"만 보고 정하면 틀릴 수 있어요 — 이야기를 끝까지 읽어요.', en:'Words like "altogether", "left", "more than" and "each" are hints. But do not decide from "more" alone — read to the end.', zh:'"一共""剩下""多""每"这样的词是提示。但不能只看到"多"就决定——要把故事读完。'}, lang))}</p>`);
  return { acts:[act1, act2], answers:[s.op + ' ' + L(T.ops[s.op], lang), L(sig, lang)] };
}
function a4(rng, s, lang){
  const r = res(s);
  const act1 = box(L({ko:'○에는 계산 기호를, □에는 수를 써서 식을 완성하세요.', en:'Write the sign in the circle and the numbers in the boxes to finish the number sentence.', zh:'在○里写运算符号，在□里写数，完成算式。'}, lang), storyHtml(s, lang) + eqHtml(s));
  const act2 = box(L({ko:'단위를 붙여 답을 쓰세요.', en:'Write the answer with its unit.', zh:'带上单位写出答案。'}, lang), ansBox(lang, unitTxt(s, lang) || (lang === 'en' ? s.o.en.n : '')));
  return { acts:[act1, act2], answers:[`${s.n1} ${s.op} ${s.n2} = ${r}`, lang === 'en' ? `${r} ${s.o.en.n}` : `${r}${unitTxt(s, lang)}`] };
}
function a5(rng, s, lang){
  const r = res(s);
  const wrongOp = s.op === '+' ? '−' : '+';
  const calc = (a, o, b) => o === '+' ? a + b : o === '−' ? a - b : a * b;
  const useCalcErr = rng() < 0.5;
  const wrong = useCalcErr ? `${s.n1} ${s.op} ${s.n2} = ${r + (rng() < 0.5 ? 1 : -1)}` : (s.op === '×' ? `${s.n1} + ${s.n2} = ${s.n1 + s.n2}` : `${s.n1} ${wrongOp} ${s.n2} = ${calc(s.n1, wrongOp, s.n2)}`);
  const act1 = box(L({ko:'친구가 이렇게 풀었어요. 틀린 곳을 찾아 바르게 고쳐 쓰세요.', en:'A friend solved it like this. Find the mistake and write it correctly.', zh:'一个朋友是这样做的。找出错误，改正后重新写。'}, lang),
    storyHtml(s, lang) + `<div class="nm-lt-check"><div class="nm-lt-wrong">${esc(wrong)}</div><span>→</span><i class="nm-lt-abox" style="width:56mm"></i></div>`);
  const act2 = box(L({ko:`답 ${numJ(r,'은','는')} 무엇의 수인가요? 써 보세요.`, en:`What does the answer ${r} stand for? Write it.`, zh:`答案${r}表示的是什么？写一写。`}, lang), `<div class="nm-lt-lines nm-lt-big"><i></i></div>`);
  return { acts:[act1, act2], answers:[`${s.n1} ${s.op} ${s.n2} = ${r} (${useCalcErr ? L({ko:'계산이 틀림', en:'wrong arithmetic', zh:'计算错'}, lang) : L({ko:'기호가 틀림', en:'wrong sign', zh:'符号错'}, lang)})`, L(T.ask[s.kind], lang)] };
}
/* A-6 둘째 활동 — 원장(2026-09-30): "문제 만들기는 영어처럼 고르기 하자. '무엇으로 만들래?' 이렇게."
   쓰기(빈칸 채우기) 대신 두 번 고른다. ① 무엇으로 만들래? — 사물 셋 중 하나에 ○(아무거나 좋다)
   ② 어떤 이야기가 이 식에 맞을까? — 이야기 셋 중 하나에 ○(하나만 맞다: 나머지 둘은 계산이 다른 유형).
   사물 셋은 단위가 같은 것끼리 묶어 고른다(사과·귤·인형 = 개/个, 색종이·스티커·카드 = 장/张) — 그래야
   이야기의 "3개" "4장"이 어느 사물을 골라도 맞는다. 원래 사물이 든 묶음은 피한다(새 문제여야 하니까). */
function pickObjects(rng, s){
  const groups = {};
  WP().OBJECTS.forEach(o => { if(o.kinds.indexOf(s.kind) < 0) return; const k = o.ko.u + '/' + o.zh.u; (groups[k] = groups[k] || []).push(o); });
  let cands = Object.values(groups).filter(g => g.length >= 3 && g.every(o => o.id !== s.o.id));
  if(!cands.length) cands = Object.values(groups).filter(g => g.length >= 3);
  if(!cands.length) cands = [WP().OBJECTS.filter(o => o.kinds.indexOf(s.kind) >= 0)];
  return shuffle(rng, pick(rng, cands)).slice(0, 3);
}
const eul = w => { const c = w.charCodeAt(w.length - 1); return (c >= 0xAC00 && c <= 0xD7A3 && (c - 0xAC00) % 28 > 0) ? '을' : '를'; };
function storyOptions(rng, s, lang, objs){
  const n1 = s.n1, n2 = s.n2, u = objs[0].ko.u, zu = objs[0].zh.u, A = L(s.A, lang), B = L(s.B, lang);
  const ob = `<i class="nm-lt-blank nm-lt-oblank"></i>`;
  const tmpl = {
    합병:{ko:`${neun(A)} ${ob}을(를) ${n1}${u}, ${neun(B)} ${n2}${u} 가지고 있어요. 모두 몇 ${u}일까요?`, en:`${A} has ${n1} ${ob} and ${B} has ${n2}. How many altogether?`, zh:`${A}有${n1}${zu}${ob}，${B}有${n2}${zu}。一共有几${zu}？`},
    첨가:{ko:`${neun(A)} ${ob}을(를) ${n1}${u} 가지고 있었어요. ${n2}${u}${eul(u)} 더 받았어요. 모두 몇 ${u}일까요?`, en:`${A} had ${n1} ${ob}. Then ${A} got ${n2} more. How many now?`, zh:`${A}有${n1}${zu}${ob}，又得到了${n2}${zu}。现在有几${zu}？`},
    구잔:{ko:`${neun(A)} ${ob}을(를) ${n1}${u} 가지고 있었어요. 그중 ${n2}${u}${eul(u)} 주었어요. 남은 것은 몇 ${u}일까요?`, en:`${A} had ${n1} ${ob}. ${A} gave ${n2} away. How many are left?`, zh:`${A}有${n1}${zu}${ob}，送掉了${n2}${zu}。还剩几${zu}？`},
    구차:{ko:`${neun(A)} ${ob}을(를) ${n1}${u}, ${neun(B)} ${n2}${u} 가지고 있어요. 누가 몇 ${u} 더 많을까요?`, en:`${A} has ${n1} ${ob} and ${B} has ${n2}. Who has more, and how many more?`, zh:`${A}有${n1}${zu}${ob}，${B}有${n2}${zu}。谁多，多几${zu}？`},
    배수:{ko:`${ob}이(가) 한 상자에 ${n1}${u}씩 ${n2}상자 있어요. 모두 몇 ${u}일까요?`, en:`There are ${n1} ${ob} in each box, and ${n2} boxes. How many altogether?`, zh:`每盒有${n1}${zu}${ob}，有${n2}盒。一共有几${zu}？`}
  };
  const opOf = { 합병:'+', 첨가:'+', 구잔:'−', 구차:'−', 배수:'×' };
  /* 오답 둘은 계산 기호가 다른 유형에서 — 구잔·구차는 둘 다 빼기라 서로 오답이 될 수 없다 */
  const others = Object.keys(tmpl).filter(k => opOf[k] !== s.op && (!s.infant || k !== '배수'));
  const kinds = shuffle(rng, [s.kind].concat(shuffle(rng, others).slice(0, 2)));
  return { items: kinds.map(k => L(tmpl[k], lang)), correct: kinds.indexOf(s.kind) };
}
function a6(rng, s, lang){
  const r = res(s);
  const act1 = box(L({ko:'식을 말로 나타내세요. 빈칸을 채워요.', en:'Say the number sentence in words. Fill in the blanks.', zh:'用话说出这个算式，填空。'}, lang), `<div class="nm-lt-eqbig">${s.n1} ${s.op} ${s.n2} = ${r}</div>` + eqWordsHtml(s, lang));
  const objs = pickObjects(rng, s);
  const so = storyOptions(rng, s, lang, objs);
  const objName = o => lang === 'en' ? o.en.n : L(o, lang).n;
  const act2 = box(L({ko:`${s.n1} ${s.op} ${s.n2} 식으로 새 문제를 만들어요.`, en:`Make a new problem for ${s.n1} ${s.op} ${s.n2}.`, zh:`用 ${s.n1} ${s.op} ${s.n2} 编一道新题。`}, lang),
    `<p class="nm-lt-q1">${esc(L({ko:'① 무엇으로 만들래? 하나 골라 ○ 하세요.', en:'① What will you make it with? Circle one.', zh:'① 用什么来编？选一个画○。'}, lang))}</p>
    <div class="nm-lt-cards">${objs.map(o => `<div class="nm-lt-card"><i></i>${esc(objName(o))}</div>`).join('')}</div>
    <p class="nm-lt-q1">${esc(L({ko:`② 어떤 이야기가 ${s.n1} ${s.op} ${s.n2} 에 맞을까요? 하나 골라 ○ 하세요.`, en:`② Which story fits ${s.n1} ${s.op} ${s.n2}? Circle one.`, zh:`② 哪个故事和 ${s.n1} ${s.op} ${s.n2} 相符？选一个画○。`}, lang))}</p>
    <ul class="nm-lt-choice nm-lt-stories">${so.items.map((t, i) => `<li><i>${circled(i)}</i><span>${t}</span></li>`).join('')}</ul>
    <p class="nm-lt-note">${esc(L({ko:'고른 것을 빈칸에 넣어 문제를 소리 내어 읽어 보세요.', en:'Put the thing you chose in the blank and read your problem out loud.', zh:'把选好的东西放进空格，大声读出你的题。'}, lang))}</p>`);
  return { acts:[act1, act2], answers:[L(T.opVerb[s.op], lang) + ' · ' + L(T.opNoun[s.op], lang), L({ko:'①은 아무거나 좋아요, ②는 ', en:'① any is fine, ② is ', zh:'①选哪个都可以，②是'}, lang) + circled(so.correct)] };
}
const STAGES = [a1, a2, a3, a4, a5, a6];

/* ── 지면 하나 ── idx: 회차(0부터, 단계 = idx mod 6) · seed: 봉투 코드 · lang · courseTitle · code · infant: 과정 0 */
function pageHtml(idx, seed, lang, courseTitle, code, infant){
  lang = (lang === 'en' || lang === 'zh') ? lang : 'ko';
  if(!window.NM_WP) return '';
  const si = ((idx % 6) + 6) % 6, stage = T.stages[si];
  const rng = rngOf(seed + ':' + si);
  const s = situation(rng, !!infant);
  const r = STAGES[si](rng, s, lang);
  return `<div class="nm-w2-page nm-lt-page${infant ? ' nm-lt-infant' : ''}">
  <div class="nm-mzs-band"><b>${esc(L(T.band, lang))}</b><span>${esc(courseTitle || 'Numbers of Magic')}</span></div>
  <div class="nm-mzs-dash"></div>
  <div class="nm-lt-head"><span class="nm-lt-no">${esc(stage.no)}</span><h2>${esc(L(stage.title, lang))}</h2></div>
  <p class="nm-lt-lede">${esc(L(stage.lede, lang))}</p>
  ${r.acts[0]}
  ${r.acts[1]}
  <p class="nm-lt-answers"><b>${esc(L(T.answer, lang))}</b> ${r.answers.map((a, i) => `${i + 1}) ${esc(a)}`).join('  ·  ')}</p>
  <div class="nm-w2-foot"><span class="nm-w2-foot-code">${esc(code || '')}</span></div>
</div>`;
}

window.NM_LANG_THINK = { pageHtml, stages:T.stages, rngOf };
})();
