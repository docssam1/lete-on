/* ============================================================
   Numbers of Magic — 언어사고력 · 이해편 지면 v2 (유아·초1~2 주간 학습지)  2026-10-01

   원장(2026-10-01): "실제 언어사고력 이해편은 이런 구성이 아닌데" → Drive 의 『이해편A 上·下』와 강좌 소개 PT 를 직접 보고 다시 짰다.
   (v1 은 소개 PT 의 여섯 단계 제목만 보고 한 단계에 활동 둘을 놓았다 — 실제 책은 그렇지 않았다.)

   실제 이해편의 구조(확인한 것)
   ------------------------------------------------------------
   · 책 한 권 = 여섯 단계(Polya) × 단계마다 **주제 6~10개**, 주제마다 한두 쪽. A 上 = Ⅰ(10주제)·Ⅱ(6)·Ⅲ(10), A 下 = Ⅳ(7)·Ⅴ(10)·Ⅵ(7) = **50주제**.
   · 한 주제 쪽 = **짧은 문제 하나** + 그 문제를 **사다리처럼 쪼갠 물음 대여섯 개**(처음 ~는 몇 개? → 더 ~는 몇 개? → 그림으로 나타내기 →
     그림에서 센 수 → 구하려는 것은 무엇? ( ㉠, ㉡ ) → 알아보기 위하여 ㉠과 ㉡을 ( 더해야, 빼야 ) 합니다). 한 번에 한 걸음씩 묻는다.
   · Ⅰ단계(읽기) 쪽은 "♣ 다음을 생각하며 글을 읽어 보세요!" 상자(생각 길잡이 물음 둘)가 붙는다.
   · 주제 안의 (1)(2)(3)은 같은 사다리를 **상황 유형만 바꿔** 되풀이한 것(덧셈 상황 → 뺄셈 상황 → 곱셈 상황).

   자료 취급(문장제-설계.md §0): **방법·구조만 쓴다.** 책의 지문·그림·문항은 옮기지 않았다. 상황은 engine/threads/wp.js 의 생성기가 매번 새로
   만든 것이고, 생각 길잡이 물음·안내문은 모두 새로 쓴 문장이다. 3개 언어는 번역이 아니라 따로 쓴 문장이다.

   한 쪽 = 이야기 상자 + 물음 사다리. 한 주간 학습지에 한 쪽씩 들어가 **50주제가 회차 순서대로 돈다**(유아는 곱셈 주제를 건너뛴다).
   한 바퀴를 돌면 숫자가 큰 수(레벨 B)로 한 칸 올라간다. 웹(앱)은 같은 단계를 WP1~10 의 고르기·조작으로 한다(engine/threads/wp.js).
   ============================================================ */
(function(){
'use strict';

function esc(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
const L = (o, lang) => (o && (o[lang] != null ? o[lang] : o.ko)) || '';
const circled = i => ['①','②','③','④','⑤','⑥','⑦','⑧','⑨','⑩'][i] || String(i + 1);
function rngOf(seed){ const R = window.NM_RNG; return R.mulberry32(R.hashSeed('lt2' + seed)); }
const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];
function shuffle(rng, arr){ const a = arr.slice(); for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const WP = () => window.NM_WP;
const G = (name, params, rng) => (window.NM_TGEN && window.NM_TGEN[name]) ? window.NM_TGEN[name](params, rng) : null;

/* ── 한국어 조사 ── */
const bat = w => { const t = String(w), c = t.charCodeAt(t.length - 1); return c >= 0xAC00 && c <= 0xD7A3 && (c - 0xAC00) % 28 > 0; };
const eun = w => w + (bat(w) ? '은' : '는');
const iga = w => w + (bat(w) ? '이' : '가');
const eul = w => w + (bat(w) ? '을' : '를');
const neun = w => w + (bat(w) ? '이는' : '는');      /* 사람 이름 */
const nui = w => w + (bat(w) ? '이의' : '의');
const numBat = n => '013678'.indexOf(String(n).slice(-1)) >= 0;
const numJ = (n, a, b) => n + (numBat(n) ? a : b);   /* 수 뒤 조사: 3을 · 2를 */

const box = (w, h) => `<i class="nm-lt-abox" style="width:${w || 22}mm${h ? ';height:' + h + 'mm' : ''}"></i>`;
const dots = (n, ch, cls) => `<span class="nm-lt-dots${cls ? ' ' + cls : ''}">${(ch || '○').repeat(n)}</span>`;
const SYM = { '+':'＋', '−':'－', '×':'×' };

/* ── 상황 하나 ── 허용 유형(kinds) 안에서 고른다. 유아는 더하기·빼기 유형만. */
function situation(rng, infant, round, kinds){
  let ks = (kinds && kinds.length) ? kinds : ['합병','첨가','구잔','구차','배수'];
  if(infant) ks = ks.filter(k => k !== '배수');
  const kind = pick(rng, ks.length ? ks : ['합병','첨가']);
  const range = (!infant && round >= 1) ? 'B' : 'A';
  const s = WP().makeSituation(rng, { range, kind, numeric:'decimal' });
  s.range = range;
  return s;
}

/* ── 문맥 — 한 상황에서 모든 물음이 쓰는 낱말·수를 한 번에 정한다 ── */
function makeCtx(s, lang, rng){
  const o = s.o, A = L(s.A, lang), B = L(s.B, lang);
  const on = lang === 'en' ? o.en.n : L(o, lang).n;
  const u = lang === 'ko' ? o.ko.u : lang === 'zh' ? o.zh.u : '';
  const away = o.away || 'give';
  const V = { eat: { ko:'먹은', en:'ate', zh:'吃掉的' }, use: { ko:'쓴', en:'used', zh:'用掉的' }, give: { ko:'준', en:'gave away', zh:'送掉的' } }[away];
  const g = s.g ? { ko: s.g.ko.n, ku: s.g.ko.u, en1: s.g.en.one, enN: s.g.en.many, zh: s.g.zh.n, zu: s.g.zh.u } : null;
  const c = { s, lang, rng, o, A, B, on, u, V, g, n1: s.n1, n2: s.n2, kind: s.kind, op: s.op, r: WP().resultOf(s) };
  c.t = (ko, en, zh) => lang === 'en' ? en : lang === 'zh' ? zh : ko;
  const k = s.kind;
  /* 두 수가 무엇을 뜻하는지 이름표 */
  c.l1 = k === '합병' || k === '구차' ? { ko:`${nui(L(s.A,'ko'))} ${o.ko.n}`, en:`${L(s.A,'en')}'s ${o.en.n}`, zh:`${L(s.A,'zh')}的${o.zh.n}` }
       : k === '배수' ? { ko:`한 ${s.g.ko.n}에 든 ${o.ko.n}`, en:`${o.en.n} in each ${s.g.en.one}`, zh:`每${s.g.zh.u}的${o.zh.n}` }
       : { ko:`처음에 있던 ${o.ko.n}`, en:`${o.en.n} at first`, zh:`原来的${o.zh.n}` };
  c.l2 = k === '합병' || k === '구차' ? { ko:`${nui(L(s.B,'ko'))} ${o.ko.n}`, en:`${L(s.B,'en')}'s ${o.en.n}`, zh:`${L(s.B,'zh')}的${o.zh.n}` }
       : k === '배수' ? { ko:`${s.g.ko.n}의 수`, en:`number of ${s.g.en.many}`, zh:`${s.g.zh.n}数` }
       : k === '첨가' ? { ko:`더 받은 ${o.ko.n}`, en:`${o.en.n} added`, zh:`又得到的${o.zh.n}` }
       : { ko:`${V.ko} ${o.ko.n}`, en:`the ${o.en.n} ${L(s.A,'en')} ${V.en}`, zh:`${V.zh}${o.zh.n}` };
  c.tgt = { 합병:{ ko:'두 사람이 가진 것을 모두 합한 수', en:'the total both people have', zh:'两个人一共有的数量' },
            첨가:{ ko:'더 받은 뒤의 수', en:'the number after getting more', zh:'又得到之后的数量' },
            구잔:{ ko:'쓰고(먹고, 주고) 남은 수', en:'the number left over', zh:'剩下的数量' },
            구차:{ ko:'누가 몇 개 더 많은지', en:'how many more one has than the other', zh:'谁比谁多几个' },
            배수:{ ko:'묶음을 다 합한 수', en:'the total in all the groups', zh:'所有组加起来的数量' } }[k];
  c.opw = { '+':{ ko:'더해야', en:'add', zh:'相加' }, '−':{ ko:'빼야', en:'subtract', zh:'相减' }, '×':{ ko:'곱해야', en:'multiply', zh:'相乘' } };
  c.opsym = { '+':{ ko:'더하기', en:'addition', zh:'加法' }, '−':{ ko:'빼기', en:'subtraction', zh:'减法' }, '×':{ ko:'곱하기', en:'multiplication', zh:'乘法' } };
  return c;
}
const lg = (c, o) => L(o, c.lang);
const unitAns = c => c.lang === 'ko' ? c.o.ko.u : c.lang === 'zh' ? c.o.zh.u : '';
const ansInline = (c, w) => `<span class="nm-lt-inl">${box(w || 20)} <em>${esc(unitAns(c))}</em></span>`;
const choiceInline = (opts, c) => `<span class="nm-lt-chs">( ${opts.map(x => esc(x)).join(' , ')} )</span>`;
const story = (c) => { const st = c.s.story[c.lang], sep = c.lang === 'zh' ? '' : ' '; return st.sents.join(sep) + sep + st.q; };
const storyBox = (c, text) => `<div class="nm-lt-story"><b>${esc(c.t('문제', 'Problem', '题目'))}</b><p>${esc(text != null ? text : story(c))}</p></div>`;
const think = (c, a, b) => `<div class="nm-lt-think"><b>♣ ${esc(c.t('다음을 생각하며 읽어 보세요!', 'Think as you read!', '边想边读吧！'))}</b><ul><li>${esc(a)}</li>${b ? `<li>${esc(b)}</li>` : ''}</ul></div>`;
const OP_ORDER = ['+', '−', '×'];
const opChoices = (c, withMul) => (withMul ? OP_ORDER : ['+', '−']).map(o => lg(c, c.opw[o]));

/* ============================================================
   물음 원자 — 사다리의 한 칸. 모두 (c) → { q: 물음 문장, x: 쓰는 자리(선택), a: 정답 글 }
   ============================================================ */
const ATOM = {};

/* 처음(둘째) ~은 몇 개입니까? */
ATOM.giv1 = c => ({ q: c.t(`${eun(lg(c, c.l1))} 몇 ${c.o.ko.u}입니까?`, `How many are there? (${lg(c, c.l1)})`, `${lg(c, c.l1)}有几${c.o.zh.u}？`), x: ansInline(c), a: c.n1 + unitAns(c) });
ATOM.giv2 = c => ({ q: c.t(`${eun(lg(c, c.l2))} 몇 ${c.o.ko.u}입니까?`, `How many are there? (${lg(c, c.l2)})`, `${lg(c, c.l2)}有几${c.o.zh.u}？`), x: ansInline(c), a: c.n2 + unitAns(c) });

/* 그림으로 나타내기 — 첫 수만 그려 주고 나머지는 아이가 그린다(합병·첨가 △ / 구잔 ×지우기 / 구차 짝짓기 / 배수 묶음) */
ATOM.draw = c => {
  const k = c.kind, n1 = c.n1, n2 = c.n2;
  if(k === '합병' || k === '첨가') return {
    q: c.t(`${lg(c, c.l1)} 수를 ○로 나타냈습니다. ${lg(c, c.l2)} 수를 △로 나타내시오.`, `The ${lg(c, c.l1)} are shown with ○. Show the ${lg(c, c.l2)} with △.`, `${lg(c, c.l1)}用○表示了。请用△表示${lg(c, c.l2)}。`),
    x: `<div class="nm-lt-pic"><div class="nm-lt-pr">${dots(n1)}<small>${esc(lg(c, c.l1))}</small></div><div class="nm-lt-pr nm-lt-drawme"><small>${esc(lg(c, c.l2))}</small></div></div>`, a: c.t('△ ' + n2 + '개', n2 + ' triangles', n2 + '个△') };
  if(k === '구잔') return {
    q: c.t(`${lg(c, c.l1)} 수를 ○로 나타냈습니다. ${lg(c, c.l2)} 수만큼 ×로 지우시오.`, `The ${lg(c, c.l1)} are shown with ○. Cross out as many as ${lg(c, c.l2)}.`, `${lg(c, c.l1)}用○表示了。把${lg(c, c.l2)}用×划掉。`),
    x: `<div class="nm-lt-pic"><div class="nm-lt-pr">${dots(n1)}</div></div>`, a: c.t('× ' + n2 + '개', n2 + ' crossed out', '划掉' + n2 + '个') };
  if(k === '구차') return {
    q: c.t(`${lg(c, c.l1)}${bat(lg(c, c.l1)) ? '과' : '와'} ${eul(lg(c, c.l2))} ○로 나타냈습니다. 하나씩 짝지어 보시오.`, `Both are shown with ○. Pair them up one by one.`, `两者都用○表示了。一个一个地配对。`),
    x: `<div class="nm-lt-pic"><div class="nm-lt-pr"><small>${esc(L(c.s.A, c.lang))}</small>${dots(n1)}</div><div class="nm-lt-pr"><small>${esc(L(c.s.B, c.lang))}</small>${dots(n2)}</div></div>`, a: c.t('짝이 없는 ○ ' + (n1 - n2) + '개', (n1 - n2) + ' circles without a partner', (n1 - n2) + '个没有配对') };
  const grp = []; for(let i = 0; i < n2; i++) grp.push(`<span class="nm-lt-group">${i === 0 ? dots(n1) : ''}</span>`);
  return { q: c.t(`한 ${c.g.ko}에 든 ${eul(c.on)} ○로 나타냈습니다. 나머지 ${c.g.ko}에도 같은 수만큼 ○를 그리시오.`, `One ${c.g.en1} is drawn with ○. Draw the same number of ○ in the other ${c.g.enN}.`, `一${c.g.zu}的${c.on}用○表示了。在其他${c.g.zh}里也画上同样多的○。`),
           x: `<div class="nm-lt-pic"><div class="nm-lt-pr">${grp.join('')}</div></div>`, a: c.t(n1 + '개씩 ' + n2 + c.g.ku, n1 + ' in each of ' + n2, '每' + c.g.zu + n1 + '个，共' + n2 + c.g.zu) };
};
/* 그림에서 센 수 */
ATOM.count = c => {
  const k = c.kind;
  const q = k === '합병' || k === '첨가' ? c.t('그림에서 ○와 △는 모두 몇 개입니까?', 'How many ○ and △ are there in all?', '图中○和△一共有几个？')
    : k === '구잔' ? c.t('지우고 남은 ○는 몇 개입니까?', 'How many ○ are left after crossing out?', '划掉之后还剩几个○？')
    : k === '구차' ? c.t('짝이 없는 ○는 몇 개입니까?', 'How many ○ have no partner?', '没有配对的○有几个？')
    : c.t('그린 ○는 모두 몇 개입니까?', 'How many ○ are there in all?', '一共有几个○？');
  return { q, x: `<span class="nm-lt-inl">${box(20)} ${c.t('개', '', '个')}</span>`, a: String(c.r) };
};
/* 구하려는 것은 무엇입니까? ( ㉠, ㉡ ) */
ATOM.target = c => {
  const right = lg(c, c.tgt);
  const wrong = c.t(`${lg(c, c.l1)}의 수`, `the number of ${lg(c, c.l1)}`, `${lg(c, c.l1)}的数量`);
  const opts = shuffle(c.rng, [right, wrong]);
  return { q: c.t('구하려는 것은 무엇입니까?', 'What does the problem ask for?', '题目要求的是什么？'), x: `<div class="nm-lt-pick">${opts.map((t, i) => `<span><i></i>${esc(t)}</span>`).join('')}</div>`, a: right };
};
/* ~을 알아보기 위하여 ㉠과 ㉡을 ( 더해야, 빼야 ) 합니다. */
ATOM.opch = (c, withMul) => {
  const chs = opChoices(c, withMul !== false && (c.kind === '배수' || withMul === true));
  const t = lg(c, c.tgt);
  return { q: c.t(`${eul(t)} 알아보기 위하여 ${numJ(c.n1, '과', '와')} ${c.n2}${c.n2 % 10 === 2 || c.n2 % 10 === 4 || c.n2 % 10 === 5 || c.n2 % 10 === 9 ? '를' : '을'} ( ${chs.join(', ')} ) 합니다.`,
    `To find ${t}, you should ( ${chs.join(', ')} ) ${c.n1} and ${c.n2}.`, `要求${t}，应该把${c.n1}和${c.n2}（${chs.join('，')}）。`),
    x: `<div class="nm-lt-opl"><b>${c.n1}</b><i class="nm-lt-opc"></i><b>${c.n2}</b></div>`, a: lg(c, c.opw[c.op]) };
};
/* 수직선 — 화살표가 무엇을 나타내는지 */
ATOM.numline = c => {
  const k = c.kind, n1 = c.n1, n2 = c.n2, W = 300, mx = 25, x = n => 10 + n * (W - 20) / mx;
  const up = c.op === '+';
  let g = `<line x1="${x(0)}" y1="30" x2="${x(mx)}" y2="30" stroke="#20343b" stroke-width="1.5"/>`;
  for(let n = 0; n <= mx; n++) g += `<line x1="${x(n)}" y1="${n % 5 ? 27 : 24}" x2="${x(n)}" y2="${n % 5 ? 33 : 36}" stroke="#20343b" stroke-width="1"/>` + (n % 5 === 0 ? `<text x="${x(n)}" y="46" font-size="8" text-anchor="middle" fill="#20343b">${n}</text>` : '');
  const a1 = (from, to, col) => `<path d="M ${x(from)} 22 Q ${x((from + to) / 2)} 2 ${x(to)} 22" fill="none" stroke="${col}" stroke-width="2"/>`;
  const small = Math.min(n1, 25), r = c.r;
  if(up && n1 + n2 <= mx) g += a1(0, n1, '#D9534F') + a1(n1, n1 + n2, '#3b7dd8');
  else if(!up && n1 <= mx) g += a1(0, n1, '#D9534F');
  const svg = `<svg class="nm-lt-numline" viewBox="0 0 ${W} 50" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
  if(up && n1 + n2 <= mx) return { q: c.t(`수직선에서 0부터 ${n1}칸 간 빨간 화살표와, 거기서 ${n2}칸 더 간 파란 화살표가 무엇을 나타내는지 쓰세요.`, `On the number line, what do the red arrow (0 to ${n1}) and the blue arrow (${n2} more) show?`, `数轴上，红色箭头（从0走${n1}格）和蓝色箭头（再走${n2}格）分别表示什么？`), x: svg + `<div class="nm-lt-lines"><i></i></div>`, a: c.t(`빨강 = ${lg(c, c.l1)}, 파랑 = ${lg(c, c.l2)}`, `red = ${lg(c, c.l1)}, blue = ${lg(c, c.l2)}`, `红 = ${lg(c, c.l1)}，蓝 = ${lg(c, c.l2)}`) };
  return { q: c.t(`수직선에 ${n1}까지 빨간 화살표가 그려져 있습니다. ${up ? n2 + '칸 더 오른쪽으로' : n2 + '칸 왼쪽으로'} 뛰어 보시오. 도착한 수는?`, `A red arrow reaches ${n1}. Jump ${n2} ${up ? 'more to the right' : 'to the left'}. Where do you land?`, `红色箭头走到${n1}。再${up ? '向右' : '向左'}跳${n2}格，落在哪个数？`), x: svg + `<span class="nm-lt-inl">${box(20)}</span>`, a: String(c.r) };
};
/* 알맞은 그림 고르기 — 수의 변화 */
ATOM.picPick = c => {
  const grow = c.op === '+', n1 = Math.min(c.n1, 8), n2 = Math.min(c.n2, 5);
  const pics = {
    add: `${dots(n1)}<b>→</b>${dots(n1 + n2)}`, sub: `${dots(n1 + n2)}<b>→</b>${dots(n1)}`, same: `${dots(n1)}<b>→</b>${dots(n1)}`
  };
  const want = grow ? 'add' : 'sub';
  const order = shuffle(c.rng, ['add', 'sub', 'same']);
  return { q: c.t('수의 변화를 알맞게 나타낸 그림은 어느 것입니까?', 'Which picture shows how the number changes?', '哪幅图正确表示了数量的变化？'),
    x: `<div class="nm-lt-pics3">${order.map((k, i) => `<span><b>${circled(i)}</b>${pics[k]}</span>`).join('')}</div>`, a: circled(order.indexOf(want)) };
};
/* 많아졌는지 적어졌는지 */
ATOM.change = c => {
  const grow = c.op === '+' || c.kind === '배수';
  const o1 = c.t('많아졌습니다', 'it got more', '变多了'), o2 = c.t('적어졌습니다', 'it got less', '变少了');
  return { q: c.t(`${c.on}의 수가 어떻게 달라졌는지 알맞은 것에 ○표 하시오.`, `How did the number of ${c.on} change? Circle the right one.`, `${c.on}的数量发生了什么变化？把对的画上○。`),
    x: `<div class="nm-lt-pick"><span><i></i>${esc(o1)}</span><span><i></i>${esc(o2)}</span></div>`, a: grow ? o1 : o2 };
};
/* 장면 그리기 */
ATOM.scene = c => ({ q: c.t('문제의 장면을 간단한 그림으로 그려 보시오.', 'Draw the scene of the problem as a simple picture.', '把题目里的情景画成简单的图。'), x: `<div class="nm-lt-drawbox"></div>`, a: c.t('(자유 그림)', '(free drawing)', '（自由作画）') });
/* 밑줄 — 낱말 / 주어진 것·구하는 것 */
ATOM.underWords = c => ({ q: c.t('각 문장에서 중요한 낱말을 찾아 밑줄을 그으시오.', 'Underline the important words in each sentence.', '在每个句子里找出重要的词，画上横线。'), a: c.t(`${c.on}, 수`, `${c.on}, numbers`, `${c.on}、数`) });
ATOM.underGivenAsk = c => ({ q: c.t('주어진 것에는 파란색 밑줄을, 구하고자 하는 것에는 빨간색 밑줄을 그어 보시오.', 'Underline what is given in blue and what is asked in red.', '已知的用蓝色画线，要求的用红色画线。'), a: c.t('파랑 = 주어진 수, 빨강 = 물음', 'blue = given numbers, red = the question', '蓝 = 已知的数，红 = 问题') });
/* 낱말 쓰기 */
ATOM.fillWords = c => ({ q: c.t(`□ 안에 알맞은 낱말을 쓰시오. 이 문제에 나오는 물건은 ${box(18)} 입니다. 이야기 속 사람은 ${box(18)} 입니다.`, `Fill in the boxes. The thing in this problem is ${box(18)}. The person is ${box(18)}.`, `在□里填上合适的词。这道题里的东西是${box(18)}。故事里的人是${box(18)}。`), a: `${c.on}, ${c.A}` });
/* 낱말과 수 잇기 */
ATOM.matchNums = c => {
  const right = shuffle(c.rng, [c.n1, c.n2]);
  return { q: c.t('문제에 알맞은 내용을 찾아 선으로 연결하시오.', 'Draw lines to connect the matching parts.', '找出合适的内容，用线连起来。'),
    x: `<div class="nm-lt-match"><div><span>${esc(lg(c, c.l1))}</span><span>${esc(lg(c, c.l2))}</span></div><div>${right.map(n => `<span>${n}${esc(unitAns(c))}</span>`).join('')}</div></div>`, a: `${lg(c, c.l1)} = ${c.n1}, ${lg(c, c.l2)} = ${c.n2}` };
};
/* 숫자에 ○ / 수가 뜻하는 것 */
ATOM.circleNums = c => ({ q: c.t('문제에서 수를 나타내는 말에 ○ 하시오.', 'Circle the numbers in the problem.', '在题目里把表示数的词画上○。'), a: `${c.n1}, ${c.n2}` });
ATOM.numMeaning = (c, i) => {
  const mine = i === 1 ? c.l1 : c.l2, other = i === 1 ? c.l2 : c.l1, n = i === 1 ? c.n1 : c.n2;
  const opts = shuffle(c.rng, [lg(c, mine), lg(c, other)]);
  return { q: c.t(`${n}${eun('') ? '' : ''}이(가) 나타내는 것은 무엇입니까?`.replace(`${n}이(가)`, numJ(n, '이', '가')), `What does ${n} stand for?`, `${n}表示什么？`),
    x: `<div class="nm-lt-pick">${opts.map(t => `<span><i></i>${esc(t)}</span>`).join('')}</div>`, a: lg(c, mine) };
};
ATOM.writeNums = c => ({ q: c.t('문제에 나온 수를 모두 쓰시오.', 'Write all the numbers in the problem.', '把题目里的数都写出来。'), x: `<span class="nm-lt-inl">${box(16)} ${box(16)}</span>`, a: `${c.n1}, ${c.n2}` });
/* 일의 순서 */
ATOM.order3 = c => {
  const lines = {
    첨가: [c.t(`${neun(c.A)} ${eul(c.on)} ${c.n1}${c.u} 가지고 있었습니다.`, `${c.A} had ${c.n1} ${c.on}.`, `${c.A}有${c.n1}${c.u}${c.on}。`), c.t(`${neun(c.A)} ${eul(c.n2 + c.u)} 더 받았습니다.`, `${c.A} got ${c.n2} more.`, `${c.A}又得到了${c.n2}${c.u}。`), c.t(`${neun(c.A)} ${c.on}${bat(c.on) ? '을' : '를'} 모두 세어 보았습니다.`, `${c.A} counted them all.`, `${c.A}把${c.on}全部数了一遍。`)],
    구잔: [c.t(`${neun(c.A)} ${eul(c.on)} ${c.n1}${c.u} 가지고 있었습니다.`, `${c.A} had ${c.n1} ${c.on}.`, `${c.A}有${c.n1}${c.u}${c.on}。`), c.t(`그중 ${eul(c.n2 + c.u)} ${c.V.ko === '준' ? '주었' : c.V.ko === '쓴' ? '썼' : '먹었'}습니다.`, `${c.A} ${c.V.en} ${c.n2} of them.`, `其中${c.V.zh}了${c.n2}${c.u}。`), c.t(`남은 ${eul(c.on)} 세어 보았습니다.`, `${c.A} counted what was left.`, `${c.A}数了数剩下的${c.on}。`)]
  };
  const L3 = lines[c.op === '+' ? '첨가' : '구잔'];
  const ord = shuffle(c.rng, [0, 1, 2]);
  return { q: c.t('글을 읽고, 일이 일어난 차례대로 ( ) 안에 번호를 쓰시오.', 'Put the events in the order they happened. Write the numbers in ( ).', '按事情发生的先后顺序，在（ ）里写上序号。'),
    x: `<ul class="nm-lt-ord">${ord.map(i => `<li>${esc(L3[i])} <span class="nm-lt-par">( )</span></li>`).join('')}</ul>`, a: ord.map((i, j) => `${circled(j)}=${i + 1}`).join(' ') };
};
ATOM.firstLast = c => ({ q: c.t('가장 먼저 한 일과 가장 나중에 한 일을 쓰시오.', 'Write what happened first and what happened last.', '写出最先做的事和最后做的事。'), x: `<div class="nm-lt-lines"><i></i><i></i></div>`, a: c.t('먼저: 처음 수를 알려 줌 · 나중: 세어 봄', 'first: the start is told · last: counting', '先：说出原来的数 · 后：数一数') });
/* 누가·무엇을 */
ATOM.whoWhat = c => ({ q: c.t(`누가 ${eul(c.on)} 가지고 있었습니까? 무엇이 문제에 나왔습니까?`, `Who had the ${c.on}? What things are in the problem?`, `谁有${c.on}？题目里有什么东西？`), x: `<span class="nm-lt-inl">${box(18)} ${box(18)}</span>`, a: `${c.A}, ${c.on}` });
/* 글의 흐름 — ○× */
ATOM.tf3 = c => {
  const f = c.op === '+' ? 1 : -1;
  const sts = [
    { t: c.t(`${neun(c.A)} ${eul(c.on)} ${c.n1}${c.u} 가지고 있었습니다.`, `${c.A} had ${c.n1} ${c.on}.`, `${c.A}有${c.n1}${c.u}${c.on}。`), ok: c.kind !== '합병' && c.kind !== '구차' && c.kind !== '배수' },
    { t: c.t(`${eul(c.on)} ${c.n2}${c.u} ${c.op === '+' ? '더 받았습니다' : c.V.ko === '준' ? '주었습니다' : c.V.ko === '쓴' ? '썼습니다' : '먹었습니다'}.`, c.op === '+' ? `${c.n2} ${c.on} were added.` : `${c.n2} ${c.on} were ${c.V.en === 'gave away' ? 'given away' : c.V.en}.`, c.op === '+' ? `又得到了${c.n2}${c.u}${c.on}。` : `${c.V.zh}了${c.n2}${c.u}${c.on}。`), ok: c.kind === '첨가' || c.kind === '구잔' }
  ];
  const wrongN = c.n2 + (c.n2 > 3 ? -1 : 2);
  const items = [
    { t: c.t(`이야기에는 ${c.on}이(가) 나옵니다.`.replace('이(가)', bat(c.on) ? '이' : '가'), `The story is about ${c.on}.`, `故事讲的是${c.on}。`), ok: true },
    { t: c.t(`이야기에 나오는 수는 ${c.n1}과(와) ${wrongN}입니다.`.replace('과(와)', numBat(c.n1) ? '과' : '와'), `The numbers in the story are ${c.n1} and ${wrongN}.`, `故事里的数是${c.n1}和${wrongN}。`), ok: false },
    { t: c.t(`이야기에는 사람이 나옵니다.`, `A person is in the story.`, `故事里有人。`), ok: true }
  ];
  const sh = shuffle(c.rng, items);
  return { q: c.t('글의 내용과 맞으면 ○표, 맞지 않으면 ×표 하시오.', 'Write ○ if it matches the story and × if it does not.', '与故事内容相符画○，不符画×。'), x: `<ul class="nm-lt-ord">${sh.map(it => `<li>${esc(it.t)} <span class="nm-lt-par">( )</span></li>`).join('')}</ul>`, a: sh.map((it, i) => `${circled(i)}${it.ok ? '○' : '×'}`).join(' ') };
};
/* 어울리지 않는 문장 */
ATOM.unrelated = c => {
  const noise = pick(c.rng, [
    { ko: v => `우리 학교 교실은 ${v}층에 있습니다.`, en: v => `Our classroom is on floor ${v}.`, zh: v => `我们的教室在${v}楼。`, v: R2(c.rng, 2, 4) },
    { ko: v => `${v}번 버스를 타고 학교에 갑니다.`, en: v => `I take bus number ${v} to school.`, zh: v => `我坐${v}路车上学。`, v: R2(c.rng, 3, 9) }]);
  const own = [c.t(`${neun(c.A)} ${eul(c.on)} ${c.n1}${c.u} 가지고 있습니다.`, `${c.A} has ${c.n1} ${c.on}.`, `${c.A}有${c.n1}${c.u}${c.on}。`), c.t(`${c.n2}${c.u}${c.op === '+' ? '이 더 생겼습니다.' : '이 줄었습니다.'}`.replace(/(.)이 /, ' '), `The number changes by ${c.n2}.`, `数量变化了${c.n2}${c.u}。`), c.t(`${eul(c.on)} 모두 세어 봅니다.`, `${c.A} counts them all.`, `把${c.on}都数一数。`)];
  const all = own.concat([c.t(noise.ko(noise.v), noise.en(noise.v), noise.zh(noise.v))]);
  const ord = shuffle(c.rng, [0, 1, 2, 3]);
  return { q: c.t('글의 내용과 어울리지 않는 문장을 찾아 번호를 쓰시오.', 'Find the sentence that does not belong and write its number.', '找出和内容不相符的句子，写出序号。'), x: `<ul class="nm-lt-ord">${ord.map((i, j) => `<li><b>${circled(j)}</b> ${esc(all[i])}</li>`).join('')}</ul><span class="nm-lt-inl">${box(14)}</span>`, a: circled(ord.indexOf(3)) };
};
function R2(rng, lo, hi){ return lo + Math.floor(rng() * (hi - lo + 1)); }
/* 소리 내어 읽기 + ／ 표 */
ATOM.readAloud = c => ({ q: c.t('문제를 소리 내어 읽어 보시오. 읽었으면 ○ 하시오.', 'Read the problem out loud. Circle ○ when you have read it.', '大声读题。读完画上○。'), x: `<span class="nm-lt-inl"><i class="nm-lt-circ"></i></span>`, a: c.t('(소리 내어 읽기)', '(read aloud)', '（大声读）') });
ATOM.slash = c => {
  const st = c.s.story[c.lang], parts = st.sents.concat([st.q]);
  const sep = c.lang === 'zh' ? '' : ' ';
  const txt = parts.map(p => `<span>${esc(p)}</span>`).join(`<i class="nm-lt-slash"></i>`);
  return { q: c.t('문제를 알맞은 곳에서 끊어 ／ 표를 하고, 천천히 소리 내어 읽어 보시오.', 'Mark ／ at the right places, then read slowly out loud.', '在合适的地方画上 ／ 断开，再慢慢大声读。'), x: `<p class="nm-lt-sl">${txt}</p><p class="nm-lt-note">${esc(c.t('／에서는 조금 더 쉬고, 쉬는 동안 머릿속으로 장면을 그려요.', 'Pause longer at ／ and picture the scene while you pause.', '在 ／ 处多停一会儿，停的时候在脑子里想象情景。'))}</p>`, a: c.t('(문장 끝마다 ／)', '(／ after each sentence)', '（每句末画 ／）') };
};
/* ㉮㉯ 비교 */
ATOM.pair = c => {
  const k1 = c.op === '+' ? '첨가' : '구잔';
  const a = c.t(`㉮ ${neun(c.A)} ${eul(c.on)} ${c.n1}${c.u} 가지고 있었는데 ${eul(c.n2 + c.u)} 더 받았습니다. 모두 몇 ${c.o.ko.u}입니까?`, `㉮ ${c.A} had ${c.n1} ${c.on} and got ${c.n2} more. How many now?`, `㉮ ${c.A}有${c.n1}${c.u}${c.on}，又得到了${c.n2}${c.u}。现在有几${c.u}？`);
  const b = c.t(`㉯ ${neun(c.A)} ${eul(c.on)} ${c.n1}${c.u} 가지고 있었는데 ${eul(c.n2 + c.u)} 주었습니다. 몇 ${c.o.ko.u} 남았습니까?`, `㉯ ${c.A} had ${c.n1} ${c.on} and gave away ${c.n2}. How many are left?`, `㉯ ${c.A}有${c.n1}${c.u}${c.on}，送掉了${c.n2}${c.u}。还剩几${c.u}？`);
  return { q: c.t('㉮와 ㉯에서 서로 다른 점을 찾아 밑줄을 그으시오. 그러면 수는 어떻게 달라집니까?', 'Underline what is different between ㉮ and ㉯. How does the number change in each?', '找出㉮和㉯不同的地方，画上横线。数量各发生了什么变化？'), x: `<div class="nm-lt-pairbox"><p>${esc(a)}</p><p>${esc(b)}</p></div><div class="nm-lt-pick"><span><i></i>㉮ ${esc(c.t('많아집니다', 'more', '变多'))}</span><span><i></i>㉮ ${esc(c.t('적어집니다', 'less', '变少'))}</span><span><i></i>㉯ ${esc(c.t('많아집니다', 'more', '变多'))}</span><span><i></i>㉯ ${esc(c.t('적어집니다', 'less', '变少'))}</span></div>`, a: c.t('㉮ 많아집니다 · ㉯ 적어집니다', '㉮ more · ㉯ less', '㉮ 变多 · ㉯ 变少') };
};
/* 주어진 것으로 문장 채우기 */
ATOM.fillGiven = c => {
  const parts = c.kind === '배수' ? [c.t(`한 ${c.g.ko}에 ${c.on}이(가) ${box(12)}${c.u}씩 있습니다.`.replace('이(가)', bat(c.on) ? '이' : '가'), `Each ${c.g.en1} has ${box(12)} ${c.on}.`, `每${c.g.zu}有${box(12)}${c.u}${c.on}。`), c.t(`${c.g.ko}은(는) 모두 ${box(12)}${c.g.ku}입니다.`.replace('은(는)', bat(c.g.ko) ? '은' : '는'), `There are ${box(12)} ${c.g.enN}.`, `一共有${box(12)}${c.g.zu}。`)]
    : [c.t(`${eun(lg(c, c.l1))} ${box(12)}${c.u}입니다.`, `${lg(c, c.l1)}: ${box(12)}.`, `${lg(c, c.l1)}是${box(12)}${c.u}。`), c.t(`${eun(lg(c, c.l2))} ${box(12)}${c.u}입니다.`, `${lg(c, c.l2)}: ${box(12)}.`, `${lg(c, c.l2)}是${box(12)}${c.u}。`)];
  return { q: c.t('문제에 맞게 □ 안에 알맞은 수를 쓰시오.', 'Fill in the numbers that match the problem.', '按题目内容，在□里填上合适的数。'), x: `<ul class="nm-lt-fillul">${parts.map(p => `<li>${p}</li>`).join('')}</ul>`, a: `${c.n1}, ${c.n2}` };
};
/* 내용 요약 */
ATOM.summary = c => {
  const words = shuffle(c.rng, [c.on, c.A, String(c.n1), String(c.n2)]);
  return { q: c.t('글을 읽고, □ 안에 알맞은 낱말을 넣어 내용을 간추려 보시오.', 'Read the problem and fill the boxes to sum it up.', '读题，在□里填上合适的词，概括内容。'),
    x: `<div class="nm-lt-wordbank">${words.map(w => `<span>${esc(w)}</span>`).join('')}</div><p class="nm-lt-fill">${c.t(`${box(14)}은(는) ${box(14)}을(를) ${box(12)}${c.u} 가지고 있고, ${box(12)}${c.u}가 달라졌습니다.`, `${box(14)} had ${box(14)}: ${box(12)}, and ${box(12)} changed.`, `${box(14)}有${box(14)}：${box(12)}，变化了${box(12)}。`)}</p>`, a: `${c.A}, ${c.on}, ${c.n1}, ${c.n2}` };
};
/* 식 쓰기 / 식 틀 */
ATOM.eqWrite = (c, label) => ({ q: label || c.t('식으로 나타내면', 'Write it as a number sentence', '用算式表示'), x: `<div class="nm-lt-eqw"><span>${box(60, 11)}</span></div>`, a: `${c.n1} ${c.op} ${c.n2} = ${c.r}` });
ATOM.answerWrite = c => ({ q: c.t('답을 쓰시오.', 'Write the answer.', '写出答案。'), x: `<span class="nm-lt-inl">${box(24)} <em>${esc(unitAns(c))}</em></span>`, a: c.r + unitAns(c) });
ATOM.result = c => ({ q: c.kind === '구차' ? c.t(`${eun(lg(c, c.tgt))} 몇 ${c.o.ko.u}입니까?`.replace(/^(.*)은 몇/, '$1은 몇'), 'How many more?', '多几个？') : c.t(`${eul(lg(c, c.tgt))} 구하여 쓰시오.`, `Find ${lg(c, c.tgt)} and write it.`, `求出${lg(c, c.tgt)}并写出来。`), x: ansInline(c), a: c.r + unitAns(c) });

/* ── 모르는 수가 있는 상황(WP7 의 변화량 유형) — 미지수 그림·수직선·□식 주제가 쓴다 ── */
function unknownCtx(c){
  for(let i = 0; i < 80; i++){
    const p = G('wp7_unknown', { range: c.s.range }, c.rng);
    if(p && p.wp.pos === 'change' && (p.wp.kind === '첨가' || p.wp.kind === '구잔')) return { p, kind: p.wp.kind, n1: p.wp.n1, n2: p.wp.n2, r: p.wp.result, up: p.wp.kind === '첨가' };
  }
  return null;
}
const pw = (p, lang) => (p.word && (p.word[lang] || p.word.ko)) || '';
const pa = (p, lang) => (p.wordAsk && (p.wordAsk[lang] || p.wordAsk.ko)) || '';
function ustoryText(u, c){ return pw(u.p, c.lang) + (c.lang === 'zh' ? '' : ' ') + (u.p.prompt ? '' : ''); }

ATOM.uKnown1 = (c, u) => ({ q: c.t('처음에 있던 수는 얼마입니까?', 'How many were there at first?', '原来有几个？'), x: `<span class="nm-lt-inl">${box(18)}</span>`, a: String(u.n1) });
ATOM.uKnown2 = (c, u) => ({ q: u.up ? c.t('더 받은 뒤의 수(모두)는 얼마입니까?', 'How many are there after getting more?', '得到之后一共有几个？') : c.t('남은 수는 얼마입니까?', 'How many are left?', '还剩几个？'), x: `<span class="nm-lt-inl">${box(18)}</span>`, a: String(u.r) });
ATOM.uDraw = (c, u) => ({ q: u.up ? c.t(`처음 수를 ○로 나타냈습니다. 모두 ${u.r}개가 되도록 ♡를 그려 넣으시오.`, `The first number is shown with ○. Draw ♡ until there are ${u.r} in all.`, `原来的数用○表示了。画上♡，使一共有${u.r}个。`) : c.t(`처음 수를 ○로 나타냈습니다. ${u.r}개가 남도록 ×로 지우시오.`, `The first number is shown with ○. Cross out until ${u.r} are left.`, `原来的数用○表示了。划掉一些，使剩下${u.r}个。`), x: `<div class="nm-lt-pic"><div class="nm-lt-pr">${dots(u.n1)}</div>${u.up ? '<div class="nm-lt-pr nm-lt-drawme"></div>' : ''}</div>`, a: u.up ? c.t(`♡ ${u.n2}개`, `${u.n2} hearts`, `${u.n2}个♡`) : c.t(`× ${u.n2}개`, `${u.n2} crossed`, `划掉${u.n2}个`) });
ATOM.uCount = (c, u) => ({ q: u.up ? c.t('그려 넣은 ♡는 몇 개입니까?', 'How many ♡ did you draw?', '你画了几个♡？') : c.t('지운 ○는 몇 개입니까?', 'How many ○ did you cross out?', '你划掉了几个○？'), x: `<span class="nm-lt-inl">${box(18)}</span>`, a: String(u.n2) });
ATOM.uTarget = (c, u) => { const right = u.up ? c.t('더 받은 수', 'the number that was added', '又得到的数量') : c.t('준(쓴, 먹은) 수', 'the number taken away', '减少的数量'), wrong = c.t('처음에 있던 수', 'the number at first', '原来的数量'); const o = shuffle(c.rng, [right, wrong]); return { q: c.t('구하려는 것은 무엇입니까?', 'What does the problem ask for?', '题目要求的是什么？'), x: `<div class="nm-lt-pick">${o.map(t => `<span><i></i>${esc(t)}</span>`).join('')}</div>`, a: right }; };
ATOM.uAnswer = (c, u) => ({ q: c.t('답을 쓰시오.', 'Write the answer.', '写出答案。'), x: `<span class="nm-lt-inl">${box(20)}</span>`, a: String(u.n2) });
ATOM.uOp = (c, u) => ({ q: c.t(`처음 수 ${u.n1}에서 □를 ( 더해야, 빼야 ) 합니다.`, `From the first number ${u.n1}, you ( add, subtract ) □.`, `从原来的${u.n1}，要（加上，减去）□。`), x: `<div class="nm-lt-opl"><b>${u.n1}</b><i class="nm-lt-opc"></i><b>□</b></div>`, a: u.up ? c.t('더해야', 'add', '加上') : c.t('빼야', 'subtract', '减去') });
ATOM.uEq = (c, u) => ({ q: c.t('□를 사용한 식으로 나타내면', 'Write it with a □', '用□列出算式'), x: `<div class="nm-lt-eqw"><span>${box(60, 11)}</span></div>`, a: `${u.n1} ${u.up ? '+' : '−'} □ = ${u.r}` });
ATOM.uNumline = (c, u) => {
  const W = 300, mx = 25, x = n => 10 + n * (W - 20) / mx;
  let g = `<line x1="${x(0)}" y1="30" x2="${x(mx)}" y2="30" stroke="#20343b" stroke-width="1.5"/>`;
  for(let n = 0; n <= mx; n++) g += `<line x1="${x(n)}" y1="${n % 5 ? 27 : 24}" x2="${x(n)}" y2="${n % 5 ? 33 : 36}" stroke="#20343b" stroke-width="1"/>` + (n % 5 === 0 ? `<text x="${x(n)}" y="46" font-size="8" text-anchor="middle" fill="#20343b">${n}</text>` : '');
  if(u.n1 <= mx) g += `<path d="M ${x(0)} 22 Q ${x(u.n1 / 2)} 2 ${x(u.n1)} 22" fill="none" stroke="#D9534F" stroke-width="2"/>`;
  return { q: u.up ? c.t(`처음 수를 수직선에 나타냈습니다. ${u.r}에 닿으려면 ${u.n1}에서 어느 쪽으로 몇 칸 뛰어가야 합니까?`, `The first number is on the number line. To reach ${u.r}, which way and how many steps from ${u.n1}?`, `原来的数画在了数轴上。要到${u.r}，从${u.n1}往哪边走几格？`) : c.t(`처음 수를 수직선에 나타냈습니다. ${u.r}이(가) 남으려면 ${u.n1}에서 어느 쪽으로 몇 칸 뛰어가야 합니까?`.replace('이(가)', numBat(u.r) ? '이' : '가'), `The first number is on the number line. To be left with ${u.r}, which way and how many steps from ${u.n1}?`, `原来的数画在了数轴上。要剩下${u.r}，从${u.n1}往哪边走几格？`),
    x: `<svg class="nm-lt-numline" viewBox="0 0 ${W} 50" xmlns="http://www.w3.org/2000/svg">${g}</svg><span class="nm-lt-inl">${c.t('방향', 'direction', '方向')} ${choiceInline([c.t('오른쪽', 'right', '右'), c.t('왼쪽', 'left', '左')], c)} · ${box(14)} ${c.t('칸', 'steps', '格')}</span>`, a: `${u.up ? c.t('오른쪽', 'right', '右') : c.t('왼쪽', 'left', '左')} ${u.n2}${c.t('칸', ' steps', '格')}` };
};

/* ── 세 수 / 같은 상황 / 말→식 / 군더더기 / 곱셈식 ── */
const FRUITS = [ { ko:'사과', en:'apples', zh:'苹果', ku:'개', zu:'个' }, { ko:'귤', en:'tangerines', zh:'橘子', ku:'개', zu:'个' }, { ko:'배', en:'pears', zh:'梨', ku:'개', zu:'个' }, { ko:'복숭아', en:'peaches', zh:'桃子', ku:'개', zu:'个' } ];
function threeCtx(c){
  const f = shuffle(c.rng, FRUITS).slice(0, 3), hi = c.s.range === 'B' ? 30 : 9;
  const v = [R2(c.rng, 2, hi), R2(c.rng, 2, hi), R2(c.rng, 2, hi)];
  return { f, v, sum: v[0] + v[1] + v[2] };
}
function threeStory(c, t){
  const nm = i => c.t(t.f[i].ko, t.f[i].en, t.f[i].zh);
  return c.t(`바구니에 ${t.f[0].ko}가 ${t.v[0]}개, ${t.f[1].ko}이(가) ${t.v[1]}개, ${t.f[2].ko}이(가) ${t.v[2]}개 있습니다. 과일은 모두 몇 개입니까?`.replace(`${t.f[0].ko}가`, iga(t.f[0].ko)).replace(`${t.f[1].ko}이(가)`, iga(t.f[1].ko)).replace(`${t.f[2].ko}이(가)`, iga(t.f[2].ko)),
    `A basket has ${t.v[0]} ${t.f[0].en}, ${t.v[1]} ${t.f[1].en} and ${t.v[2]} ${t.f[2].en}. How many fruits are there in all?`,
    `篮子里有${t.v[0]}个${t.f[0].zh}、${t.v[1]}个${t.f[1].zh}、${t.v[2]}个${t.f[2].zh}。水果一共有几个？`);
}
const miniStory = (rng, infant, range, kinds) => { const s = WP().makeSituation(rng, { range, kind: pick(rng, kinds), numeric:'decimal' }); s.range = range; return s; };
const KIND_OP = { 합병:'+', 첨가:'+', 구잔:'−', 구차:'−', 배수:'×' };
const compactOf = (s, lang) => (s.compact && (s.compact[lang] || s.compact.ko)) || '';
function phraseList(c){
  const a = c.n1 + 3, b = Math.min(c.n2, a - 1) || 2;
  const T = [
    { op:'+', ko:`${a} 더하기 ${b}`, en:`${a} plus ${b}`, zh:`${a}加${b}` },
    { op:'+', ko:`${a}${numBat(a) ? '과' : '와'} ${b}의 합`, en:`the sum of ${a} and ${b}`, zh:`${a}和${b}的和` },
    { op:'+', ko:`${a}보다 ${b} 큰 수`, en:`${b} more than ${a}`, zh:`比${a}大${b}的数` },
    { op:'−', ko:`${a} 빼기 ${b}`, en:`${a} minus ${b}`, zh:`${a}减${b}` },
    { op:'−', ko:`${a}${numBat(a) ? '과' : '와'} ${b}의 차`, en:`the difference of ${a} and ${b}`, zh:`${a}和${b}的差` },
    { op:'−', ko:`${a}보다 ${b} 작은 수`, en:`${b} less than ${a}`, zh:`比${a}小${b}的数` }
  ];
  return { a, b, items: shuffle(c.rng, T).slice(0, 4) };
}

/* ── 세 수 · 같은 상황 · 말→식 · 군더더기 정보 · 곱셈 · 점검 · 확장 · 만들기 ── */
ATOM.threeList = (c, t) => ({ q: c.t('문제에 나오는 과일은 무엇입니까? 쓰시오.', 'Which fruits are in the problem? Write them.', '题目里有哪些水果？写出来。'), x: `<span class="nm-lt-inl">${box(16)} ${box(16)} ${box(16)}</span>`, a: t.f.map(f => c.t(f.ko, f.en, f.zh)).join(', ') });
ATOM.threeDraw = (c, t) => ({ q: c.t(`첫째 과일의 수를 ○로 나타냈습니다. 나머지 과일의 수를 △, □로 나타내시오.`, `The first fruit is shown with ○. Show the others with △ and □.`, `第一种水果用○表示了。其余的用△和□表示。`), x: `<div class="nm-lt-pic"><div class="nm-lt-pr">${dots(t.v[0])}<small>${esc(c.t(t.f[0].ko, t.f[0].en, t.f[0].zh))}</small></div><div class="nm-lt-pr nm-lt-drawme"><small>${esc(c.t(t.f[1].ko, t.f[1].en, t.f[1].zh))}</small></div><div class="nm-lt-pr nm-lt-drawme"><small>${esc(c.t(t.f[2].ko, t.f[2].en, t.f[2].zh))}</small></div></div>`, a: `${t.v[1]} △, ${t.v[2]} □` });
ATOM.threeTarget = (c, t) => { const right = c.t('과일 전체의 수', 'the total number of fruits', '水果的总数'), wrong = c.t('첫째 과일의 수', 'the number of the first fruit', '第一种水果的数量'); const o = shuffle(c.rng, [right, wrong]); return { q: c.t('구하려는 것은 무엇입니까?', 'What does the problem ask for?', '题目要求的是什么？'), x: `<div class="nm-lt-pick">${o.map(x => `<span><i></i>${esc(x)}</span>`).join('')}</div>`, a: right }; };
ATOM.threeOp = (c, t) => ({ q: c.t(`과일이 모두 몇 개인지 알아보기 위하여 ${t.v[0]}, ${t.v[1]}, ${numJ(t.v[2], '을', '를')} 모두 ( 더해야, 빼야 ) 합니다.`, `To find how many fruits there are, you ( add, subtract ) ${t.v[0]}, ${t.v[1]} and ${t.v[2]}.`, `要求水果一共有几个，要把${t.v[0]}、${t.v[1]}、${t.v[2]}都（相加，相减）。`), x: `<div class="nm-lt-opl"><b>${t.v[0]}</b><i class="nm-lt-opc"></i><b>${t.v[1]}</b><i class="nm-lt-opc"></i><b>${t.v[2]}</b></div>`, a: c.t('더해야', 'add', '相加') });
ATOM.threeAns = (c, t) => ({ q: c.t('과일은 모두 몇 개입니까?', 'How many fruits are there in all?', '水果一共有几个？'), x: ansInline(c), a: String(t.sum) });
/* 같은 상황 찾기 — 네 문제 가운데 주어진 연산으로 푸는 것에 ○ */
ATOM.sameSituation = (c, target) => {
  const range = c.s.range, plusK = ['합병', '첨가'], minusK = ['구잔', '구차'];
  const yes = target === '+' ? plusK : minusK, no = target === '+' ? minusK : plusK;
  const mk = ks => miniStory(c.rng, false, range, ks);
  const items = shuffle(c.rng, [{ s: mk(yes), ok: true }, { s: mk(yes), ok: true }, { s: mk(no), ok: false }, { s: mk(no), ok: false }]);
  const opn = lg(c, c.opsym[target]);
  return { q: c.t(`답을 구하려면 ${opn}을(를) 해야 하는 문제에 ○표 하시오.`.replace('을(를)', bat(opn) ? '을' : '를'), `Circle the problems that need ${opn} to solve.`, `把需要用${opn}来解的题画上○。`),
    x: `<ul class="nm-lt-ord nm-lt-mini">${items.map((it, i) => `<li><b>${circled(i)}</b> ${esc(compactOf(it.s, c.lang))} <span class="nm-lt-par">( )</span></li>`).join('')}</ul>`, a: items.map((it, i) => `${circled(i)}${it.ok ? '○' : '×'}`).join(' ') };
};
ATOM.wordsToExpr = c => {
  const pl = phraseList(c);
  const ref = c.t('늘어나는 말(더하기, 합, ~보다 크다, 더 받았다)은 ＋ 로, 줄어드는 말(빼기, 차, ~보다 작다, 주었다)은 － 로 나타내요.', 'Words for getting more (plus, sum, more than, got more) mean ＋. Words for getting less (minus, difference, less than, gave away) mean －.', '变多的词（加、和、比……大、又得到）用＋表示；变少的词（减、差、比……小、送掉）用－表示。');
  return { q: c.t('말을 식으로 나타내시오.', 'Write each phrase as a number sentence.', '把话写成算式。'), x: `<p class="nm-lt-note">${esc(ref)}</p><ul class="nm-lt-ord">${pl.items.map((it, i) => `<li><b>${circled(i)}</b> ${esc(L(it, c.lang))} <span class="nm-lt-inl">${box(34, 9)}</span></li>`).join('')}</ul>`, a: pl.items.map((it, i) => `${circled(i)} ${pl.a} ${it.op} ${pl.b} = ${it.op === '+' ? pl.a + pl.b : pl.a - pl.b}`).join(' · ') };
};
ATOM.noiseUnderline = (c, n) => ({ q: c.t('문제를 푸는 데 필요한 수에는 파란색 밑줄을, 필요 없는 수에는 ×표를 하시오.', 'Underline the numbers you need in blue and cross out the one you do not need.', '需要的数用蓝色画线，用不到的数画×。'), a: c.t(`필요 없는 수: ${n.v}`, `not needed: ${n.v}`, `用不到的数：${n.v}`) });
ATOM.mulFill = c => ({ q: c.t('□ 안에 알맞은 수를 쓰시오.', 'Fill in the numbers.', '在□里填上合适的数。'), x: `<p class="nm-lt-fill">${c.t(`${c.on}이(가) ${box(12)}${c.u}씩 ${box(12)}${c.g.ku} 있습니다.`.replace('이(가)', bat(c.on) ? '이' : '가'), `There are ${box(12)} ${c.on} in each of ${box(12)} ${c.g.enN}.`, `有${box(12)}${c.g.zu}，每${c.g.zu}${box(12)}${c.u}${c.on}。`)}</p>`, a: c.t(`${c.n1}${c.u}씩 ${c.n2}${c.g.ku}`, `${c.n1} in each of ${c.n2}`, `${c.n2}${c.g.zu}，每${c.g.zu}${c.n1}`) });
ATOM.mini4 = (c, withMul) => {
  const ks = withMul ? ['합병', '첨가', '구잔', '구차', '배수'] : ['합병', '첨가', '구잔', '구차'];
  const order = shuffle(c.rng, ks).slice(0, 4);
  const items = order.map(k => miniStory(c.rng, false, c.s.range, [k]));
  const opLine = withMul ? c.t('덧셈( ) 뺄셈( ) 곱셈( )', 'add( ) subtract( ) multiply( )', '加法( ) 减法( ) 乘法( )') : c.t('덧셈( ) 뺄셈( )', 'add( ) subtract( )', '加法( ) 减法( )');
  return { q: c.t('문제를 해결하기 위해서 어떤 계산을 해야 하는지 ○표 하시오.', 'Circle the calculation each problem needs.', '为了解决问题，应该做哪种计算？画上○。'), x: `<ul class="nm-lt-ord nm-lt-mini">${items.map((it, i) => `<li><b>${circled(i)}</b> ${esc(compactOf(it, c.lang))}<div class="nm-lt-opline">${opLine}</div></li>`).join('')}</ul>`, a: items.map((it, i) => `${circled(i)} ${lg(c, c.opsym[KIND_OP[it.kind]])}`).join(' · ') };
};
ATOM.solve2 = c => {
  const items = [0, 1].map(i => miniStory(c.rng, false, c.s.range, i ? ['구잔', '구차'] : ['합병', '첨가']));
  const lines = items.map((it, i) => `<li><b>${circled(i)}</b> ${esc(compactOf(it, c.lang))}<div class="nm-lt-solve"><span>${esc(c.t('식', 'Equation', '算式'))} ${box(36, 9)}</span><span>${esc(c.t('답', 'Answer', '答'))} ${box(18, 9)}</span></div></li>`).join('');
  return { q: c.t('문제에 맞는 식을 세우고 해결해 보시오.', 'Write a number sentence for each problem and solve it.', '列出合适的算式并解答。'), x: `<ul class="nm-lt-ord nm-lt-mini">${lines}</ul>`, a: items.map((it, i) => `${circled(i)} ${it.n1} ${KIND_OP[it.kind]} ${it.n2} = ${WP().resultOf(it)}`).join(' · ') };
};
ATOM.interpret = c => {
  const opts = shuffle(c.rng, [c.t(`${lg(c, c.l1)}의 수`, `the number of ${lg(c, c.l1)}`, `${lg(c, c.l1)}的数量`), c.t(`${lg(c, c.l2)}의 수`, `the number of ${lg(c, c.l2)}`, `${lg(c, c.l2)}的数量`), lg(c, c.tgt)]);
  return { q: c.t(`계산한 답은 ${c.r}입니다. 이 답이 나타내는 것은 무엇입니까?`, `The answer is ${c.r}. What does this answer stand for?`, `算出的答案是${c.r}。这个答案表示什么？`), x: `<div class="nm-lt-pick">${opts.map(x => `<span><i></i>${esc(x)}</span>`).join('')}</div>`, a: lg(c, c.tgt) };
};
ATOM.wrongSol = c => {
  const bad = c.op === '+' ? '−' : '+', val = bad === '+' ? c.n1 + c.n2 : Math.abs(c.n1 - c.n2);
  return { q: c.t('친구가 이렇게 풀었습니다. 잘못된 곳은 어디입니까? ○표 하시오.', 'A friend solved it like this. Where is the mistake? Circle it.', '朋友是这样解的。错在哪里？画上○。'), x: `<div class="nm-lt-wrong">${c.n1} ${bad} ${c.n2} = ${val}</div><div class="nm-lt-pick"><span><i></i>${esc(c.t('계산 기호', 'the sign', '运算符号'))}</span><span><i></i>${esc(c.t('계산 결과', 'the result', '计算结果'))}</span></div>`, a: c.t('계산 기호', 'the sign', '运算符号') };
};
ATOM.rewriteRight = c => ({ q: c.t('바르게 고쳐 쓰시오.', 'Write it correctly.', '改正后重新写。'), x: `<div class="nm-lt-eqw"><span>${box(60, 11)}</span></div>`, a: `${c.n1} ${c.op} ${c.n2} = ${c.r}` });
ATOM.calcShown = c => { const off = c.r + (c.r > 3 ? -1 : 2); return { q: c.t('친구의 계산입니다. 거꾸로 계산해서 맞는지 확인하시오.', 'A friend\'s calculation. Check it by working backwards.', '朋友的计算。倒着算一算，检查对不对。'), x: `<div class="nm-lt-wrong">${c.n1} ${c.op} ${c.n2} = ${off}</div><div class="nm-lt-eqw"><span>${box(50, 10)}</span></div>`, a: c.op === '+' ? `${off} − ${c.n2} = ${off - c.n2} ≠ ${c.n1}` : c.op === '−' ? `${off} + ${c.n2} = ${off + c.n2} ≠ ${c.n1}` : `${off} ÷ ${c.n2} ≠ ${c.n1}` }; };
ATOM.ansBigSmall = c => { const up = c.op === '+' || c.op === '×'; return { q: c.t(`답은 ${lg(c, c.l1)}보다 ( 커야, 작아야 ) 합니다. ○표 하시오.`, `The answer should be ( bigger, smaller ) than ${lg(c, c.l1)}. Circle one.`, `答案应该比${lg(c, c.l1)}（大，小）。画上○。`), x: `<div class="nm-lt-pick"><span><i></i>${esc(c.t('커야', 'bigger', '大'))}</span><span><i></i>${esc(c.t('작아야', 'smaller', '小'))}</span></div>`, a: up ? c.t('커야', 'bigger', '大') : c.t('작아야', 'smaller', '小') }; };
ATOM.unitWrite = c => ({ q: c.t('답에 알맞은 단위를 붙여 쓰시오.', 'Write the answer with its unit.', '答案要带上合适的单位。'), x: ansInline(c), a: c.r + unitAns(c) });
ATOM.method = (c, kind) => kind === 'draw' ? Object.assign(ATOM.draw(c), { q: c.t('방법 1 — 그림으로 해결합니다.', 'Method 1 — solve with a picture.', '方法一 — 用图来解。') }) : kind === 'line' ? Object.assign(ATOM.numline(c), { q: c.t('방법 2 — 수직선으로 해결합니다. 도착한 수는?', 'Method 2 — solve with a number line. Where do you land?', '方法二 — 用数轴来解。落在哪个数？') }) : Object.assign(ATOM.eqWrite(c), { q: c.t('방법 3 — 식으로 해결합니다.', 'Method 3 — solve with a number sentence.', '方法三 — 用算式来解。') });
ATOM.sameAns = c => ({ q: c.t('세 방법의 답이 같습니까? ○ 또는 ×를 쓰시오.', 'Do all three methods give the same answer? Write ○ or ×.', '三种方法的答案相同吗？写○或×。'), x: `<span class="nm-lt-inl">( )</span>`, a: '○' });
ATOM.extendNew = c => { const n2b = c.n2 + 2; const rr = c.op === '+' ? c.n1 + n2b : c.op === '−' ? c.n1 - n2b : c.n1 * n2b; return { q: c.t(`${lg(c, c.l2)}의 수를 ${c.n2}에서 ${n2b}(으)로 바꾸면 식은 어떻게 됩니까?`.replace('(으)로', numBat(n2b) ? '으로' : '로'), `If the number of ${lg(c, c.l2)} changes from ${c.n2} to ${n2b}, what is the new number sentence?`, `如果${lg(c, c.l2)}的数量从${c.n2}变成${n2b}，新的算式是什么？`), x: `<div class="nm-lt-eqw"><span>${box(60, 11)}</span></div>`, a: `${c.n1} ${c.op} ${n2b} = ${rr}`, ok: (c.op !== '−' || c.n1 > n2b) }; };
ATOM.extendAns = c => ({ q: c.t('바꾼 문제의 답을 쓰시오.', 'Write the answer to the changed problem.', '写出改变后的题的答案。'), x: ansInline(c), a: (() => { const n2b = c.n2 + 2; return String(c.op === '+' ? c.n1 + n2b : c.op === '−' ? c.n1 - n2b : c.n1 * n2b); })() });
ATOM.eqWords = c => {
  const n1 = c.n1, n2 = c.n2, r = c.r, lang = c.lang;
  const rows = lang === 'ko'
    ? [`${n1}에 ${numJ(n2, '을', '를')} ${box(14)} ${r}${numBat(r) ? '이' : '가'} 됩니다. ( ${c.op === '+' ? '더하면, 빼면' : c.op === '−' ? '빼면, 더하면' : '곱하면, 더하면'} )`, c.op === '×' ? `${n1}씩 ${box(10)}묶음입니다.` : `${n1}보다 ${n2} ${box(12)} (${c.op === '+' ? '큽니다' : '작습니다'})`, `${numJ(n1, '과', '와')} ${n2}의 ${box(12)}의 값은 ${r}입니다.`]
    : lang === 'en'
    ? [`If you ${box(16)} ${n2} ${c.op === '+' ? 'to' : c.op === '−' ? 'from' : 'by'} ${n1}, you get ${r}. ( ${c.op === '+' ? 'add, subtract' : c.op === '−' ? 'subtract, add' : 'multiply, add'} )`, c.op === '×' ? `${n2} groups of ${box(10)}.` : `${n2} ${c.op === '+' ? 'more' : 'less'} than ${n1} is ${box(10)}.`, `The ${box(16)} of ${n1} and ${n2} is ${r}.`]
    : [`${n1}${box(10)}${n2}等于${r}。（${c.op === '+' ? '加，减' : c.op === '−' ? '减，加' : '乘，加'}）`, c.op === '×' ? `${n1}个一组，共${box(10)}组` : `比${n1}${c.op === '+' ? '多' : '少'}${n2}的数是${box(10)}`, `${n1}和${n2}的${box(10)}是${r}`];
  return { q: c.t(`${n1} ${c.op} ${n2} = ${r}  식을 말로 나타내시오. 빈칸을 채워요.`, `${n1} ${c.op} ${n2} = ${r}  Say the number sentence in words. Fill in the blanks.`, `${n1} ${c.op} ${n2} = ${r}  把算式用话说出来，填空。`), x: `<ul class="nm-lt-fillul">${rows.map(x => `<li>${x}</li>`).join('')}</ul>`, a: `${lg(c, c.opsym[c.op])} · ${c.op === '+' ? c.t('큽니다', 'more', '多') : c.t('작습니다', 'less', '少')} · ${c.op === '+' ? c.t('합', 'sum', '和') : c.op === '−' ? c.t('차', 'difference', '差') : c.t('곱', 'product', '积')}` };
};
/* 문제 만들기 — 사물 고르기 + 이야기 고르기 */
function pickObjects(c){
  const groups = {};
  WP().OBJECTS.forEach(o => { const k = o.ko.u + '/' + o.zh.u; (groups[k] = groups[k] || []).push(o); });
  let cands = Object.values(groups).filter(g => g.length >= 3 && g.every(o => o.id !== c.o.id));
  if(!cands.length) cands = Object.values(groups).filter(g => g.length >= 3);
  return shuffle(c.rng, pick(c.rng, cands)).slice(0, 3);
}
function storyChoices(c, objs, target){
  const n1 = c.n1, n2 = c.n2, lang = c.lang, A = L(c.s.A, lang), B = L(c.s.B, lang);
  const u = objs[0].ko.u, zu = objs[0].zh.u, ob = `<i class="nm-lt-blank nm-lt-oblank"></i>`;
  const g = c.g;
  const T = {
    합병: { ko: `${neun(A)} ${ob}을(를) ${n1}${u}, ${neun(B)} ${n2}${u} 가지고 있어요. 모두 몇 ${u}일까요?`, en: `${A} has ${n1} ${ob} and ${B} has ${n2}. How many altogether?`, zh: `${A}有${n1}${zu}${ob}，${B}有${n2}${zu}。一共有几${zu}？` },
    첨가: { ko: `${neun(A)} ${ob}을(를) ${n1}${u} 가지고 있었어요. ${eul(n2 + u)} 더 받았어요. 모두 몇 ${u}일까요?`, en: `${A} had ${n1} ${ob}. ${A} got ${n2} more. How many now?`, zh: `${A}有${n1}${zu}${ob}，又得到了${n2}${zu}。现在有几${zu}？` },
    구잔: { ko: `${neun(A)} ${ob}을(를) ${n1}${u} 가지고 있었어요. 그중 ${eul(n2 + u)} 주었어요. 남은 것은 몇 ${u}일까요?`, en: `${A} had ${n1} ${ob}. ${A} gave ${n2} away. How many are left?`, zh: `${A}有${n1}${zu}${ob}，送掉了${n2}${zu}。还剩几${zu}？` },
    구차: { ko: `${neun(A)} ${ob}을(를) ${n1}${u}, ${neun(B)} ${n2}${u} 가지고 있어요. 누가 몇 ${u} 더 많을까요?`, en: `${A} has ${n1} ${ob} and ${B} has ${n2}. Who has more, and how many more?`, zh: `${A}有${n1}${zu}${ob}，${B}有${n2}${zu}。谁多，多几${zu}？` },
    배수: { ko: `${ob}이(가) 한 상자에 ${n1}${u}씩 ${n2}상자 있어요. 모두 몇 ${u}일까요?`, en: `There are ${n1} ${ob} in each box, and ${n2} boxes. How many altogether?`, zh: `每盒有${n1}${zu}${ob}，有${n2}盒。一共有几${zu}？` }
  };
  const others = Object.keys(T).filter(k => KIND_OP[k] !== KIND_OP[target] && (k !== '배수' || !c.s.infant));
  const kinds = shuffle(c.rng, [target].concat(shuffle(c.rng, others).slice(0, 2)));
  return { items: kinds.map(k => T[k][lang]), correct: kinds.indexOf(target) };
}
ATOM.makeThing = (c, objs) => ({ q: c.t('① 무엇으로 만들래? 하나 골라 ○ 하시오.', '① What will you make it with? Circle one.', '① 用什么来编？选一个画○。'), x: `<div class="nm-lt-cards">${objs.map(o => `<div class="nm-lt-card"><i></i>${esc(c.lang === 'en' ? o.en.n : L(o, c.lang).n)}</div>`).join('')}</div>`, a: c.t('아무거나', 'any', '都可以') });
ATOM.makeStory = (c, sc) => ({ q: c.t(`② 어떤 이야기가 ${c.n1} ${c.op} ${c.n2} 에 맞습니까? 하나 골라 ○ 하시오.`, `② Which story fits ${c.n1} ${c.op} ${c.n2}? Circle one.`, `② 哪个故事和 ${c.n1} ${c.op} ${c.n2} 相符？选一个画○。`), x: `<ul class="nm-lt-choice nm-lt-stories">${sc.items.map((t, i) => `<li><i>${circled(i)}</i><span>${t}</span></li>`).join('')}</ul>`, a: circled(sc.correct) });
ATOM.makeRead = c => ({ q: c.t('고른 것을 빈칸에 넣어 문제를 소리 내어 읽고, 답을 구해 보시오.', 'Put your choice in the blank, read the problem out loud and solve it.', '把选好的东西放进空格，大声读题并解答。'), x: ansInline(c), a: String(c.r) });

/* ── 손질 — 위 원자 중 조사·범위를 바로잡은 것 ── */
ATOM.numMeaning = (c, i) => {
  const mine = i === 1 ? c.l1 : c.l2, other = i === 1 ? c.l2 : c.l1, n = i === 1 ? c.n1 : c.n2;
  const opts = shuffle(c.rng, [lg(c, mine), lg(c, other)]);
  return { q: c.t(`${numJ(n, '이', '가')} 나타내는 것은 무엇입니까?`, `What does ${n} stand for?`, `${n}表示什么？`),
    x: `<div class="nm-lt-pick">${opts.map(t => `<span><i></i>${esc(t)}</span>`).join('')}</div>`, a: lg(c, mine) };
};
ATOM.opch = (c, withMul) => {
  const chs = opChoices(c, withMul === true || (withMul !== false && c.kind === '배수'));
  const t = lg(c, c.tgt);
  return { q: c.t(`${eul(t)} 알아보기 위하여 ${numJ(c.n1, '과', '와')} ${numJ(c.n2, '을', '를')} ( ${chs.join(', ')} ) 합니다.`,
    `To find ${t}, you should ( ${chs.join(', ')} ) ${c.n1} and ${c.n2}.`, `要求${t}，应该把${c.n1}和${c.n2}（${chs.join('，')}）。`),
    x: `<div class="nm-lt-opl"><b>${c.n1}</b><i class="nm-lt-opc"></i><b>${c.n2}</b></div>`, a: lg(c, c.opw[c.op]) };
};
ATOM.result = c => ({ q: c.kind === '구차' ? c.t('몇 개 더 많습니까?', 'How many more?', '多几个？') : c.t(`${eul(lg(c, c.tgt))} 구하여 쓰시오.`, `Find ${lg(c, c.tgt)} and write it.`, `求出${lg(c, c.tgt)}并写出来。`), x: ansInline(c), a: c.r + unitAns(c) });
/* 바꾼 수 — 빼기에서 음수가 되지 않게 */
const n2b = c => (c.op === '−' && c.n1 <= c.n2 + 2) ? Math.max(1, c.n2 - 1) : c.n2 + 2;
const rOf = (c, m) => c.op === '+' ? c.n1 + m : c.op === '−' ? c.n1 - m : c.n1 * m;
ATOM.extendNew = c => { const m = n2b(c); return { q: c.t(`${lg(c, c.l2)}의 수를 ${c.n2}에서 ${m}${m === 1 || numBat(m) ? '으로' : '로'} 바꾸면 식은 어떻게 됩니까?`.replace(/(\d+)(으로|로) 바꾸면/, (x, d) => `${numJ(d, '으로', '로')} 바꾸면`), `If the number of ${lg(c, c.l2)} changes from ${c.n2} to ${m}, what is the new number sentence?`, `如果${lg(c, c.l2)}的数量从${c.n2}变成${m}，新的算式是什么？`), x: `<div class="nm-lt-eqw"><span>${box(60, 11)}</span></div>`, a: `${c.n1} ${c.op} ${m} = ${rOf(c, m)}` }; };
ATOM.extendAns = c => ({ q: c.t('바꾼 문제의 답을 쓰시오.', 'Write the answer to the changed problem.', '写出改变后的题的答案。'), x: ansInline(c), a: String(rOf(c, n2b(c))) });
ATOM.showEq = (c, eq) => ({ q: c.t(`다음 식에 맞는 문제를 만들어 봅시다.  ${eq}`, `Let us make a problem that fits this number sentence.  ${eq}`, `我们来编一道和这个算式相符的题。  ${eq}`), a: '' });
ATOM.ownStory = (c, eq) => ({ q: c.t('이야기를 직접 지어서 써 보시오.', 'Write your own story.', '自己编一个故事写下来。'), x: `<div class="nm-lt-lines"><i></i><i></i></div>`, a: c.t('(자유 작성)', '(free writing)', '（自由写作）') });
ATOM.infoMissing = (c, p) => ({ q: c.t('이 문제를 풀려면 무엇을 더 알아야 합니까?', 'What else do you need to know to solve this?', '要解这道题，还需要知道什么？'), x: `<div class="nm-lt-lines"><i></i></div>`, a: p.wp.needed || '' });

/* ============================================================
   주제 50개 — 실제 이해편 A 의 차례와 같은 순서. build(c) → { story, qs[], think[] }
   story 가 null 이면 이야기 상자를 두지 않는다(물음 안에 문제가 들어 있는 주제).
   ============================================================ */
const T3 = (ko, en, zh) => ({ ko, en, zh });
const KS = { all:['합병','첨가','구잔','구차'], ps:['첨가','구잔'], plus:['합병','첨가'], minus:['구잔','구차'], mul:['배수'] };
const seq = (...fs) => c => fs.map(f => f(c));
const A_ = n => c => ATOM[n](c);
function uBuild(list, c){
  const u = unknownCtx(c);
  if(!u) return null;
  const sep = c.lang === 'zh' ? '' : ' ';
  return { story: pw(u.p, c.lang) + sep + pa(u.p, c.lang), qs: list.map(n => ATOM[n](c, u)) };
}
const TOPICS = [];
function def(step, no, title, kinds, build, opt){ TOPICS.push(Object.assign({ step, no, title, kinds, build }, opt || {})); }

/* Ⅰ 어떻게 문제를 풀어야 할까? */
def(1, 1, T3('중요한 낱말에 밑줄 긋기', 'Underline the Important Words', '给重要的词画线'), KS.all,
  c => ({ story: story(c), qs: seq(A_('underWords'), A_('fillWords'), A_('matchNums'))(c),
    think: [c.t('이야기에 나오는 물건은 무엇인가요?', 'What things are in the story?', '故事里有什么东西？'), c.t('이야기에 나오는 사람은 누구인가요?', 'Who is in the story?', '故事里有谁？')] }));
def(1, 2, T3('중요한 숫자 찾기', 'Find the Important Numbers', '找出重要的数'), KS.all,
  c => ({ story: story(c), qs: [ATOM.circleNums(c), ATOM.numMeaning(c, 1), ATOM.numMeaning(c, 2), ATOM.writeNums(c)],
    think: [c.t('수가 모두 몇 개 나오나요?', 'How many numbers are there?', '一共出现了几个数？'), c.t('각각의 수는 무엇을 나타내나요?', 'What does each number stand for?', '每个数表示什么？')] }));
def(1, 3, T3('일의 순서 알아보기', 'Put the Events in Order', '弄清事情的先后顺序'), KS.ps,
  c => ({ story: null, qs: seq(A_('order3'), A_('firstLast'))(c),
    think: [c.t('가장 먼저 일어난 일은 무엇인가요?', 'What happened first?', '最先发生了什么？'), c.t('가장 나중에 한 일은 무엇인가요?', 'What happened last?', '最后做了什么？')] }));
def(1, 4, T3('글의 내용 파악하기', 'Understand the Passage', '弄懂文章内容'), KS.all,
  c => ({ story: story(c), qs: seq(A_('whoWhat'), A_('giv1'), A_('giv2'))(c),
    think: [c.t('누가 무엇을 가지고 있나요?', 'Who has what?', '谁有什么？'), c.t('수는 각각 얼마인가요?', 'How many are there of each?', '各是多少？')] }));
def(1, 5, T3('글의 흐름 알아보기', 'Follow the Flow of the Text', '弄清文章的脉络'), KS.ps,
  c => ({ story: story(c), qs: seq(A_('tf3'), A_('unrelated'))(c),
    think: [c.t('글의 내용과 맞는 말은 무엇인가요?', 'Which statements match the story?', '哪些话和故事相符？'), c.t('글과 어울리지 않는 문장이 있나요?', 'Is there a sentence that does not belong?', '有没有和故事不相关的句子？')] }));
def(1, 6, T3('생각하며 읽기', 'Read and Picture It', '边想边读'), KS.all,
  c => ({ story: story(c), qs: seq(A_('readAloud'), A_('slash'), A_('scene'))(c),
    think: [c.t('쉬면서 어떤 장면이 떠오르나요?', 'What scene do you see while you pause?', '停下来的时候你想到了什么情景？'), c.t('이야기 속 수는 많아졌나요, 적어졌나요?', 'Is the number getting more or less?', '故事里的数是变多还是变少？')] }));
def(1, 7, T3('상황 알아보기', 'Understand the Situation', '弄清情景'), KS.ps,
  c => ({ story: story(c), qs: seq(A_('change'), A_('scene'), A_('giv1'), A_('giv2'))(c),
    think: [c.t('처음과 나중이 어떻게 달라졌나요?', 'How is it different at the end?', '前后有什么不同？'), c.t('왜 달라졌나요?', 'Why did it change?', '为什么会变？')] }));
def(1, 8, T3('주어진 것과 구하는 것', 'What Is Given, What Is Asked', '已知的和要求的'), KS.all,
  c => ({ story: story(c), qs: seq(A_('fillGiven'), A_('underGivenAsk'), A_('target'))(c),
    think: [c.t('문제에서 알려 준 것은 무엇인가요?', 'What does the problem tell you?', '题目告诉了我们什么？'), c.t('문제에서 알고 싶은 것은 무엇인가요?', 'What does the problem want to know?', '题目想知道什么？')] }));
def(1, 9, T3('도움이 되는 내용 찾기', 'Find What Helps', '找出有帮助的内容'), KS.ps,
  c => ({ story: null, qs: seq(A_('pair'))(c),
    think: [c.t('㉮와 ㉯는 어디가 다른가요?', 'What is different between ㉮ and ㉯?', '㉮和㉯有什么不同？'), c.t('다른 말 때문에 수는 어떻게 달라지나요?', 'How does the number change because of it?', '因为不同的词，数量怎么变？')] }));
def(1, 10, T3('내용 요약하기', 'Sum Up the Problem', '概括内容'), KS.all,
  c => ({ story: story(c), qs: seq(A_('summary'), A_('giv1'), A_('giv2'))(c),
    think: [c.t('가장 중요한 낱말 네 개를 골라 보세요.', 'Pick the four most important words.', '选出最重要的四个词。'), c.t('줄여 쓴 글을 소리 내어 읽어 보세요.', 'Read your short version out loud.', '大声读一读你概括的话。')] }));

/* Ⅱ 문제의 상황을 우뇌로 그려라 */
def(2, 1, T3('장면 찾기', 'Find the Scene', '找出情景'), KS.ps,
  c => ({ story: story(c), qs: seq(A_('giv1'), A_('giv2'), A_('picPick'), A_('result'))(c) }));
def(2, 2, T3('덧셈 상황 그림으로 나타내기', 'Draw an Adding Situation', '把加的情景画出来'), KS.plus,
  c => ({ story: story(c), qs: seq(A_('giv1'), A_('giv2'), A_('draw'), A_('count'), A_('answerWrite'))(c) }));
def(2, 3, T3('뺄셈 상황 그림으로 나타내기', 'Draw a Subtracting Situation', '把减的情景画出来'), KS.minus,
  c => ({ story: story(c), qs: seq(A_('giv1'), A_('giv2'), A_('draw'), A_('count'), A_('answerWrite'))(c) }));
def(2, 4, T3('모르는 수가 있는 상황 그리기', 'Draw When a Number Is Unknown', '画出有未知数的情景'), KS.ps,
  c => uBuild(['uKnown1', 'uKnown2', 'uDraw', 'uCount', 'uTarget', 'uAnswer'], c));
def(2, 5, T3('수직선으로 나타내기', 'Show It on a Number Line', '用数轴表示'), KS.ps,
  c => ({ story: story(c), qs: seq(A_('giv1'), A_('giv2'), A_('numline'), A_('result'))(c) }));
def(2, 6, T3('모르는 수를 수직선으로 나타내기', 'Number Line with an Unknown', '用数轴表示未知数'), KS.ps,
  c => uBuild(['uKnown1', 'uKnown2', 'uNumline', 'uAnswer'], c));

/* Ⅲ 상황에 적절한 연산 */
def(3, 1, T3('그림으로 연산 찾기 (1)', 'Pick the Operation from a Picture (1)', '看图找运算 (1)'), KS.plus,
  c => ({ story: story(c), qs: seq(A_('giv1'), A_('giv2'), A_('draw'), A_('count'), A_('target'), A_('opch'))(c) }));
def(3, 2, T3('그림으로 연산 찾기 (2)', 'Pick the Operation from a Picture (2)', '看图找运算 (2)'), KS.minus,
  c => ({ story: story(c), qs: seq(A_('giv1'), A_('giv2'), A_('draw'), A_('count'), A_('target'), A_('opch'))(c) }));
def(3, 3, T3('그림으로 연산 찾기 (3)', 'Pick the Operation from a Picture (3)', '看图找运算 (3)'), KS.mul,
  c => ({ story: story(c), qs: seq(A_('giv1'), A_('giv2'), A_('draw'), A_('count'), A_('target'), c => ATOM.opch(c, true))(c) }), { noInfant: true });
def(3, 4, T3('주어진 것·구하는 것으로 연산 찾기 (1)', 'Pick the Operation from the Givens (1)', '用已知和所求找运算 (1)'), KS.plus,
  c => ({ story: story(c), qs: seq(A_('giv1'), A_('giv2'), A_('target'), A_('opch'), A_('result'))(c) }));
def(3, 5, T3('주어진 것·구하는 것으로 연산 찾기 (2)', 'Pick the Operation from the Givens (2)', '用已知和所求找运算 (2)'), KS.minus,
  c => ({ story: story(c), qs: seq(A_('giv1'), A_('giv2'), A_('target'), A_('opch'), A_('result'))(c) }));
def(3, 6, T3('주어진 것·구하는 것으로 연산 찾기 (3)', 'Pick the Operation from the Givens (3)', '用已知和所求找运算 (3)'), KS.mul,
  c => ({ story: story(c), qs: seq(A_('giv1'), A_('giv2'), A_('target'), c => ATOM.opch(c, true), A_('result'))(c) }), { noInfant: true });
def(3, 7, T3('같은 상황 찾기 (1)', 'Find the Same Situation (1)', '找相同的情景 (1)'), KS.plus,
  c => ({ story: null, qs: [ATOM.sameSituation(c, '+')] }));
def(3, 8, T3('같은 상황 찾기 (2)', 'Find the Same Situation (2)', '找相同的情景 (2)'), KS.minus,
  c => ({ story: null, qs: [ATOM.sameSituation(c, '−')] }));
def(3, 9, T3('세 수의 계산', 'Calculating with Three Numbers', '三个数的计算'), KS.plus,
  c => { const t = threeCtx(c); return { story: threeStory(c, t), qs: [ATOM.threeList(c, t), ATOM.threeDraw(c, t), ATOM.threeTarget(c, t), ATOM.threeOp(c, t), ATOM.threeAns(c, t)] }; });
def(3, 10, T3('모르는 수가 있는 문제의 연산', 'Operation with an Unknown Number', '有未知数的题的运算'), KS.ps,
  c => uBuild(['uKnown1', 'uKnown2', 'uTarget', 'uOp', 'uAnswer'], c));

/* Ⅳ 식으로 나타내어라 */
def(4, 1, T3('그림을 식으로 나타내기', 'From Picture to Number Sentence', '把图变成算式'), KS.all,
  c => ({ story: story(c), qs: seq(A_('giv1'), A_('giv2'), A_('draw'), A_('opch'), A_('eqWrite'))(c) }));
def(4, 2, T3('수직선을 식으로 나타내기', 'From Number Line to Number Sentence', '把数轴变成算式'), KS.ps,
  c => ({ story: story(c), qs: seq(A_('giv1'), A_('giv2'), A_('numline'), A_('opch'), A_('eqWrite'))(c) }));
def(4, 3, T3('말을 식으로 나타내기', 'From Words to Number Sentence', '把话变成算式'), KS.plus,
  c => ({ story: null, qs: [ATOM.wordsToExpr(c)] }));
def(4, 4, T3('필요한 정보를 찾아 식으로 나타내기', 'Pick the Needed Information', '找出需要的信息列算式'), KS.all,
  c => {
    const nv = R2(c.rng, 2, 9) + (c.n1 === 2 || c.n2 === 2 ? 3 : 0), bad = c.t(`${neun(c.A)} 오늘 ${nv}시에 일어났습니다.`, `${c.A} got up at ${nv} o'clock today.`, `${c.A}今天${nv}点起床。`);
    const st = c.s.story[c.lang], sep = c.lang === 'zh' ? '' : ' ', ss = st.sents.slice();
    ss.splice(1, 0, bad);
    return { story: ss.join(sep) + sep + st.q, qs: [ATOM.noiseUnderline(c, { v: nv }), ATOM.eqWrite(c), ATOM.answerWrite(c)] };
  });
def(4, 5, T3('모르는 수를 그림으로 식 세우기', 'Unknown Number: Picture to Sentence', '用图列未知数的算式'), KS.ps,
  c => uBuild(['uKnown1', 'uKnown2', 'uDraw', 'uCount', 'uOp', 'uEq'], c));
def(4, 6, T3('모르는 수를 수직선으로 식 세우기', 'Unknown Number: Line to Sentence', '用数轴列未知数的算式'), KS.ps,
  c => uBuild(['uKnown1', 'uKnown2', 'uNumline', 'uOp', 'uEq'], c));
def(4, 7, T3('곱셈식으로 나타내기', 'Write a Multiplication Sentence', '用乘法算式表示'), KS.mul,
  c => ({ story: story(c), qs: seq(A_('giv1'), A_('giv2'), A_('draw'), A_('mulFill'), A_('eqWrite'))(c) }), { noInfant: true });

/* Ⅴ 돌다리도 두들겨 보고 건너라 */
def(5, 1, T3('문제에 맞는 식 찾기', 'Find the Right Number Sentence', '找出和题目相符的算式'), KS.all,
  c => ({ story: null, qs: [ATOM.mini4(c, !c.s.infant)] }));
def(5, 2, T3('문제 해결 과정 따라가기', 'Follow the Steps of Solving', '跟着解题过程走'), KS.all,
  c => ({ story: story(c), qs: seq(A_('giv1'), A_('giv2'), A_('target'), A_('eqWrite'), A_('answerWrite'))(c) }));
def(5, 3, T3('식을 세워 해결하기', 'Write a Sentence and Solve', '列算式解答'), KS.all,
  c => ({ story: null, qs: [ATOM.solve2(c)] }));
def(5, 4, T3('결과 해석하기', 'Interpret the Result', '解释结果'), KS.all,
  c => ({ story: story(c), qs: seq(A_('interpret'), A_('unitWrite'))(c) }));
def(5, 5, T3('풀이 방법 점검하기', 'Check the Way of Solving', '检查解题方法'), KS.all,
  c => ({ story: story(c), qs: seq(A_('wrongSol'), A_('rewriteRight'))(c) }));
def(5, 6, T3('계산 점검하기', 'Check the Calculation', '检查计算'), KS.ps,
  c => ({ story: story(c), qs: seq(A_('calcShown'), A_('answerWrite'))(c) }));
def(5, 7, T3('답 점검하기', 'Check the Answer', '检查答案'), KS.all,
  c => ({ story: story(c), qs: seq(A_('ansBigSmall'), A_('unitWrite'), A_('answerWrite'))(c) }));
def(5, 8, T3('여러 가지 방법으로 풀기', 'Solve in Different Ways', '用不同的方法解'), KS.ps,
  c => ({ story: story(c), qs: [ATOM.method(c, 'draw'), ATOM.method(c, 'line'), ATOM.method(c, 'eq'), ATOM.sameAns(c)] }));
def(5, 9, T3('문제 확장하기', 'Stretch the Problem', '拓展题目'), KS.all,
  c => ({ story: story(c), qs: seq(A_('eqWrite'), A_('answerWrite'), A_('extendNew'), A_('extendAns'))(c) }));
def(5, 10, T3('문제 수정하기', 'Fix the Problem', '修改题目'), KS.all,
  c => {
    let p = null; for(let i = 0; i < 60; i++){ const q = G('wp9_info', { range: c.s.range }, c.rng); if(q && q.wp.mode === 'info-missing'){ p = q; break; } }
    if(!p) return { story: story(c), qs: seq(A_('eqWrite'), A_('answerWrite'))(c) };
    const sep = c.lang === 'zh' ? '' : ' ';
    return { story: pw(p, c.lang) + sep + pa(p, c.lang).replace(/알맞은 번호를 쓰세요\.?|Write the number\.?|请写出序号。?/, '').trim(), qs: [ATOM.infoMissing(c, p), { q: c.t('모자란 정보를 넣어 문제를 다시 써 보시오.', 'Add the missing information and rewrite the problem.', '补上缺少的信息，把题重新写一遍。'), x: `<div class="nm-lt-lines"><i></i><i></i></div>`, a: c.t('(자유 작성)', '(free writing)', '（自由写作）') }] };
  });

/* Ⅵ 문제를 직접 만들어라 */
const mkLadder = (kind, withEq) => c => {
  const eq = `${c.n1} ${c.op} ${c.n2} = ${c.r}`, objs = pickObjects(c), sc = storyChoices(c, objs, kind);
  return { story: null, qs: [ATOM.showEq(c, eq), ATOM.makeThing(c, objs), ATOM.makeStory(c, sc), ATOM.makeRead(c)] };
};
def(6, 1, T3('식을 말로 나타내기', 'Say the Sentence in Words', '把算式用话说出来'), KS.all,
  c => {
    const rng2 = rngOf(String(c.s.n1) + c.s.kind + 'eq2' + c.s.n2), c2 = makeCtx(situation(rng2, c.s.infant, c.s.range === 'B' ? 1 : 0, c.s.kind === '합병' || c.s.kind === '첨가' ? KS.minus : KS.plus), c.lang, rng2);
    return { story: null, qs: [ATOM.eqWords(c), ATOM.eqWords(c2)] };
  });
def(6, 2, T3('합병 문제 만들기', 'Make a Putting-Together Problem', '编合并的题'), ['합병'], mkLadder('합병'));
def(6, 3, T3('첨가 문제 만들기', 'Make a Getting-More Problem', '编又得到的题'), ['첨가'], mkLadder('첨가'));
def(6, 4, T3('구잔 문제 만들기', 'Make a Taking-Away Problem', '编剩下多少的题'), ['구잔'], mkLadder('구잔'));
def(6, 5, T3('구차 문제 만들기', 'Make a Comparing Problem', '编比较多少的题'), ['구차'], mkLadder('구차'));
def(6, 6, T3('곱셈 문제 만들기', 'Make a Multiplication Problem', '编乘法的题'), ['배수'], mkLadder('배수'), { noInfant: true });
def(6, 7, T3('□가 있는 식으로 문제 만들기', 'Make a Problem from a Sentence with □', '用带□的算式编题'), KS.ps,
  c => {
    const u = unknownCtx(c);
    if(!u) return mkLadder('첨가')(c);
    const eq = `${u.n1} ${u.up ? '+' : '−'} □ = ${u.r}`;
    return { story: null, qs: [ATOM.showEq(c, eq), ATOM.makeThing(c, pickObjects(c)), ATOM.ownStory(c, eq), ATOM.uAnswer(c, u)] };
  });

const STEPS = [
  null,
  { no:'Ⅰ', title: T3('어떻게 문제를 풀어야 할까?', 'How Should We Solve the Problem?', '应该怎样解题？') },
  { no:'Ⅱ', title: T3('문제의 상황을 우뇌로 그려라', 'Draw the Situation in Your Mind', '把题目的情景在脑中画出来') },
  { no:'Ⅲ', title: T3('상황에 적절한 연산', 'The Right Operation', '适合情景的运算') },
  { no:'Ⅳ', title: T3('식으로 나타내어라', 'Write It as a Number Sentence', '用算式表示出来') },
  { no:'Ⅴ', title: T3('돌다리도 두들겨 보고 건너라', 'Look Before You Leap', '检查再检查') },
  { no:'Ⅵ', title: T3('문제를 직접 만들어라', 'Make Your Own Problem', '自己编题') }
];
const BAND = T3('언어사고력 · 이해편', 'Language Thinking · Understanding', '语言思维 · 理解篇');
const ANSWER = T3('정답', 'Answers', '答案');

/* ── 지면 하나 ── idx: 회차(0부터) · seed: 봉투 코드 · lang · courseTitle · code · infant: 과정 0 */
function topicsFor(infant){ return TOPICS.filter(t => !(infant && t.noInfant)); }
function pageHtml(idx, seed, lang, courseTitle, code, infant){
  lang = (lang === 'en' || lang === 'zh') ? lang : 'ko';
  if(!window.NM_WP) return '';
  const list = topicsFor(!!infant), n = list.length;
  const i0 = Math.max(0, Math.floor(Number(idx) || 0));
  const round = Math.floor(i0 / n), topic = list[i0 % n];
  let page = null;
  for(let attempt = 0; attempt < 6 && !page; attempt++){
    const rng = rngOf(seed + ':' + topic.step + '-' + topic.no + ':' + attempt);
    const s = situation(rng, !!infant, round, topic.kinds);
    s.infant = !!infant;
    const c = makeCtx(s, lang, rng);
    try { page = topic.build(c); } catch(e){ page = null; }
    if(page) page.c = c;
  }
  if(!page) return '';
  const st = STEPS[topic.step], c = page.c;
  const qs = page.qs.filter(Boolean);
  return `<div class="nm-w2-page nm-lt-page${infant ? ' nm-lt-infant' : ''}">
  <div class="nm-mzs-band"><b>${esc(L(BAND, lang))}</b><span>${esc(courseTitle || 'Numbers of Magic')}</span></div>
  <div class="nm-mzs-dash"></div>
  <div class="nm-lt-head"><span class="nm-lt-no">${esc(st.no)}-${topic.no}</span><h2>${esc(L(topic.title, lang))}</h2><small>${esc(L(st.title, lang))}</small></div>
  ${page.story ? storyBox(c, page.story) : ''}
  ${page.think ? think(c, page.think[0], page.think[1]) : ''}
  <ol class="nm-lt-ladder${qs.length <= 2 ? ' nm-lt-few' : ''}">${qs.map((it, k) => `<li class="nm-lt-qi"><span class="nm-lt-qn">${circled(k)}</span><div><p class="nm-lt-qt">${it.q}</p>${it.x || ''}</div></li>`).join('')}</ol>
  <p class="nm-lt-answers"><b>${esc(L(ANSWER, lang))}</b> ${qs.map((it, k) => `${circled(k)} ${esc(String(it.a == null ? '' : it.a).replace(/<[^>]+>/g, ''))}`).join('  ·  ')}</p>
  <div class="nm-w2-foot"><span class="nm-w2-foot-code">${esc(code || '')}</span></div>
</div>`;
}

window.NM_LANG_THINK = { pageHtml, stages: STEPS.slice(1), topics: TOPICS, rngOf };
})();
