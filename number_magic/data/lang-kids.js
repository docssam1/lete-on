/* ============================================================
   Numbers of Magic — 언어사고력 유아편 (5세 중반 ~ 7세, 한글을 읽을 수 있는 아이)  2026-10-01
   독셈 주간 학습지에 끼우는 이해편(lang-think.js)과는 **별도 프로그램**이다.
   철학은 이해편과 같다: 읽기 → 그리기 → 연산 고르기 → 식 → 점검 → 만들기, 한 쪽에 한 걸음씩.
   바뀐 것: 글은 두세 문장, 수는 작게, 쓰기보다 ○·잇기·색칠, 큰 그림과 길잡이 캐릭터(누미).
   단계(연산 능력): K1 5세 중반(수 5 이하·합병/첨가) · K2 6세(10 이하·구잔/구차 추가) · K3 7세(20 이하·묶음/□ 추가)
   ============================================================ */
(function(){
'use strict';
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const R = () => window.NM_RNG;
const rngOf = seed => R().mulberry32(R().hashSeed('lk' + seed));
const pick = (r, a) => a[Math.floor(r() * a.length)];
const int = (r, lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
const shuffle = (r, a) => { a = a.slice(); for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const bat = w => { const c = String(w).charCodeAt(String(w).length - 1); return c >= 0xAC00 && c <= 0xD7A3 && (c - 0xAC00) % 28 > 0; };
const eun = w => w + (bat(w) ? '은' : '는'), eul = w => w + (bat(w) ? '을' : '를'), iga = w => w + (bat(w) ? '이' : '가');

const LEVELS = {
  K1: { label:'5세 중반', max:5,  kinds:['합병','첨가'] },
  K2: { label:'6세',      max:10, kinds:['합병','첨가','구잔','구차'] },
  K3: { label:'7세',      max:20, kinds:['합병','첨가','구잔','구차','묶음'] }
};
/* 물건 — 색 + 모양으로 그린다(그림 파일 없이도 인쇄된다) */
const THINGS = [
  { n:'사과', u:'개', col:'#e5483f', sh:'circle' }, { n:'공', u:'개', col:'#3b7dd8', sh:'circle' }, { n:'별', u:'개', col:'#f2b632', sh:'star' },
  { n:'꽃', u:'송이', col:'#e66fa3', sh:'flower' }, { n:'블록', u:'개', col:'#2fa36b', sh:'square' }, { n:'풍선', u:'개', col:'#8a5fd0', sh:'circle' }
];
const NAMES = ['하준', '서연', '도윤', '지우', '민서', '예린'];
const SHAPE = {
  circle: c => `<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="${c}"/></svg>`,
  square: c => `<svg viewBox="0 0 20 20"><rect x="2" y="2" width="16" height="16" rx="3" fill="${c}"/></svg>`,
  star: c => `<svg viewBox="0 0 20 20"><path d="M10 1.5l2.5 5.6 6 .6-4.5 4 1.4 6L10 14.6 4.6 17.7l1.4-6-4.5-4 6-.6z" fill="${c}"/></svg>`,
  flower: c => `<svg viewBox="0 0 20 20"><g fill="${c}"><circle cx="10" cy="4.5" r="3.6"/><circle cx="15.5" cy="10" r="3.6"/><circle cx="10" cy="15.5" r="3.6"/><circle cx="4.5" cy="10" r="3.6"/></g><circle cx="10" cy="10" r="2.6" fill="#f2b632"/></svg>`
};
const icons = (t, n, cls) => `<span class="lk-ico${cls ? ' ' + cls : ''}">${Array.from({ length: n }, () => `<i>${SHAPE[t.sh](t.col)}</i>`).join('')}</span>`;
const slots = (n) => `<span class="lk-ico lk-slots">${Array.from({ length: n }, () => '<i class="lk-slot"></i>').join('')}</span>`;
const writeBox = (n) => `<span class="lk-wbox">${n == null ? '' : n}</span>`;

function situation(r, lv){
  const L = LEVELS[lv], kind = pick(r, L.kinds), t = pick(r, THINGS), [A, B] = shuffle(r, NAMES);
  let n1, n2, res, op;
  if(kind === '합병' || kind === '첨가'){ n1 = int(r, 1, L.max - 1); n2 = int(r, 1, L.max - n1); res = n1 + n2; op = '+'; }
  else if(kind === '구잔'){ n1 = int(r, 2, L.max); n2 = int(r, 1, n1 - 1); res = n1 - n2; op = '−'; }
  else if(kind === '구차'){ n1 = int(r, 2, L.max); n2 = int(r, 1, n1 - 1); res = n1 - n2; op = '−'; }
  else { n1 = int(r, 2, 4); n2 = int(r, 2, Math.max(2, Math.floor(L.max / n1))); res = n1 * n2; op = '×'; }
  return { kind, t, A, B, n1, n2, res, op };
}
function storyOf(s){
  const { t, A, B, n1, n2 } = s, u = t.u;
  return {
    합병: [`${eun(A)} ${eul(t.n)} ${n1}${u} 가졌어요.`, `${eun(B)} ${n2}${u} 가졌어요.`, `모두 몇 ${u}일까요?`],
    첨가: [`${eun(A)} ${eul(t.n)} ${n1}${u} 가졌어요.`, `${n2}${u}를 더 받았어요.`, `모두 몇 ${u}일까요?`],
    구잔: [`${eun(A)} ${eul(t.n)} ${n1}${u} 가졌어요.`, `${n2}${u}를 친구에게 주었어요.`, `몇 ${u} 남았을까요?`],
    구차: [`${eun(A)} ${eul(t.n)} ${n1}${u} 가졌어요.`, `${eun(B)} ${n2}${u} 가졌어요.`, `${iga(A)} 몇 ${u} 더 많을까요?`],
    묶음: [`상자 하나에 ${eul(t.n)} ${n1}${u}씩 담았어요.`, `상자가 ${n2}개 있어요.`, `${t.n}${bat(t.n) ? '은' : '는'} 모두 몇 ${u}일까요?`]
  }[s.kind];
}
const OPNAME = { '+':'더하기', '−':'빼기', '×':'곱하기' };

/* 쪽 하나 = 길잡이 말풍선 + 이야기 + 물음 3~4개 */
const STEPS = ['', '읽어요', '그려요', '고르세요', '식으로 써요', '확인해요', '만들어요'];
const BUILD = {
  /* 1단계 — 읽기: 낱말·수 찾기 */
  read(s, r){
    const t = s.t, words = [t.n, s.A, String(s.n1), String(s.n2)];
    return { title:'이야기를 읽어요', guide:'소리 내어 천천히 읽어 봐요!', story:true, qs:[
      { q:`이야기에 나오는 ${t.n}${bat(t.n) ? '을' : '를'} 찾아 ○ 해요.`, x:`<div class="lk-find">${storyOf(s).map(x => `<p>${esc(x)}</p>`).join('')}</div>`, a:'' },
      { q:'이야기에 나오는 수를 모두 써요.', x:`<div class="lk-row">${writeBox()}${writeBox()}</div>`, a:`${s.n1}, ${s.n2}` },
      { q:`${eun(s.A)} ${t.n}${bat(t.n) ? '을' : '를'} 몇 ${t.u} 가졌나요?`, x:`<div class="lk-row">${writeBox()}<em>${t.u}</em></div>`, a:`${s.n1}${t.u}` }
    ] };
  },
  /* 2단계 — 그리기: 첫 수는 그려 주고 둘째 수를 아이가 칠한다 */
  draw(s, r){
    const t = s.t;
    if(s.kind === '구잔') return { title:'그림으로 나타내요', guide:'먹은 것은 ✕ 해요!', story:true, qs:[
      { q:`${t.n}${bat(t.n) ? '이' : '가'} 몇 ${t.u} 있었나요? 세어 봐요.`, x:`<div class="lk-row">${icons(t, s.n1)}${writeBox()}</div>`, a:String(s.n1) },
      { q:`준 ${t.n}${bat(t.n) ? '을' : '를'} ✕ 해요. (${s.n2}${t.u})`, x:`<div class="lk-row">${icons(t, s.n1)}</div>`, a:`✕ ${s.n2}${t.u}` },
      { q:`남은 ${t.n}${bat(t.n) ? '은' : '는'} 몇 ${t.u}인가요?`, x:`<div class="lk-row">${writeBox()}<em>${t.u}</em></div>`, a:`${s.res}${t.u}` }
    ] };
    return { title:'그림으로 나타내요', guide:'모자란 칸에 색칠해요!', story:true, qs:[
      { q:`${eun(s.A)} ${t.n}${bat(t.n) ? '을' : '를'} ${s.n1}${t.u}. 그림을 보고 세어 봐요.`, x:`<div class="lk-row">${icons(t, s.n1)}${writeBox()}</div>`, a:String(s.n1) },
      { q:`${s.kind === '첨가' ? '더 받은' : '친구의'} ${s.n2}${t.u}만큼 ○ 안에 색칠해요.`, x:`<div class="lk-row">${slots(s.n2)}</div>`, a:`${s.n2}칸` },
      { q:`모두 몇 ${t.u}인가요?`, x:`<div class="lk-row">${writeBox()}<em>${t.u}</em></div>`, a:`${s.res}${t.u}` }
    ] };
  },
  /* 3단계 — 연산 고르기 */
  op(s, r){
    const t = s.t, want = s.op, opts = ['+', '−'].concat(s.kind === '묶음' ? ['×'] : []);
    return { title:'어떻게 계산할까요?', guide:'구하려는 것이 무엇인지 먼저 찾아요!', story:true, qs:[
      { q:'구하려는 것에 ○ 해요.', x:`<div class="lk-pick"><span><i></i>${s.kind === '구잔' ? '남은 수' : s.kind === '구차' ? '더 많은 수' : s.kind === '묶음' ? '전부의 수' : '모두의 수'}</span><span><i></i>처음의 수</span></div>`, a:s.kind === '구잔' ? '남은 수' : s.kind === '구차' ? '더 많은 수' : s.kind === '묶음' ? '전부의 수' : '모두의 수' },
      { q:`${s.n1}과 ${s.n2}${bat(s.n2) ? '을' : '를'} 어떻게 계산할까요? ○ 해요.`, x:`<div class="lk-ops">${opts.map(o => `<span class="lk-opbtn"><b>${o === '−' ? '－' : o === '+' ? '＋' : '×'}</b>${OPNAME[o]}</span>`).join('')}</div>`, a:OPNAME[want] }
    ] };
  },
  /* 4단계 — 식 (7세부터 쓰기) */
  eq(s, r){
    const t = s.t;
    return { title:'식으로 써요', guide:'그림을 식으로 바꿔 봐요!', story:true, qs:[
      { q:'□ 안에 알맞은 수를 써요.', x:`<div class="lk-eq">${writeBox(s.n1)}<b>${s.op === '−' ? '－' : s.op === '+' ? '＋' : '×'}</b>${writeBox(s.n2)}<b>＝</b>${writeBox()}</div>`, a:String(s.res) },
      { q:'답을 써요.', x:`<div class="lk-row">${writeBox()}<em>${t.u}</em></div>`, a:`${s.res}${t.u}` }
    ] };
  }
};
const SEQ = ['read', 'draw', 'op', 'eq'];

function pageHtml(lv, idx, seed, courseTitle, code){
  lv = LEVELS[lv] ? lv : 'K1';
  if(!window.NM_RNG) return '';
  const i0 = Math.max(0, Math.floor(Number(idx) || 0)), key = SEQ[i0 % SEQ.length];
  const r = rngOf(seed + ':' + lv + ':' + i0);
  const kinds = LEVELS[lv].kinds; let s = situation(r, lv);
  if(key === 'draw' && s.kind === '묶음') s = situation(rngOf(seed + 'd' + i0), 'K2');
  if(key === 'eq' && lv === 'K1') s = situation(r, 'K1');
  const p = BUILD[key](s, r), step = SEQ.indexOf(key) + 1;
  return `<div class="nm-w2-page lk-page">
  <div class="lk-top"><b>언어사고력 · 유아</b><span>${esc(LEVELS[lv].label)} · ${esc(courseTitle || 'Numbers of Magic')}</span></div>
  <div class="lk-head"><span class="lk-no">${step}</span><h2>${esc(p.title)}</h2></div>
  <div class="lk-guide"><img src="assets/characters/numi-0.png" alt=""><p>${esc(p.guide)}</p></div>
  <div class="lk-story">${storyOf(s).map(x => `<p>${esc(x)}</p>`).join('')}</div>
  <ol class="lk-ladder">${p.qs.map((it, k) => `<li><span class="lk-qn">${k + 1}</span><div><p class="lk-q">${esc(it.q)}</p>${it.x}</div></li>`).join('')}</ol>
  <p class="lk-ans"><b>정답</b> ${p.qs.map((it, k) => `${k + 1}) ${esc(it.a)}`).join(' · ')}</p>
  <div class="nm-w2-foot"><span class="nm-w2-foot-code">${esc(code || '')}</span></div>
</div>`;
}
const CSS = `
.lk-page{display:flex;flex-direction:column;gap:5mm;font-family:'Pretendard','Noto Sans KR',sans-serif;color:#2b2a33}
.lk-top{display:flex;justify-content:space-between;align-items:center;padding:3mm 5mm;border-radius:6mm;background:#ffd86b;font-size:13px;font-weight:800}
.lk-top span{font-weight:700;font-size:11.5px}
.lk-head{display:flex;align-items:center;gap:4mm}
.lk-no{width:14mm;height:14mm;border-radius:50%;background:#ff8a5c;color:#fff;font-size:26px;font-weight:900;display:flex;align-items:center;justify-content:center}
.lk-head h2{margin:0;font-size:30px;font-weight:900}
.lk-guide{display:flex;align-items:center;gap:4mm}
.lk-guide img{width:26mm;height:26mm;object-fit:contain}
.lk-guide p{margin:0;padding:4mm 6mm;border-radius:8mm;background:#eaf6ff;border:2px solid #9fd0f5;font-size:19px;font-weight:800;position:relative}
.lk-story{padding:5mm 7mm;border-radius:7mm;background:#fff8e6;border:2.5px dashed #f0b44c}
.lk-story p{margin:0 0 1.5mm;font-size:23px;line-height:1.75;font-weight:700}
.lk-ladder{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:6mm}
.lk-ladder li{display:grid;grid-template-columns:11mm 1fr;gap:3mm}
.lk-qn{width:10mm;height:10mm;border-radius:50%;background:#6bc7a1;color:#fff;font-weight:900;font-size:19px;display:flex;align-items:center;justify-content:center}
.lk-q{margin:0 0 2.5mm;font-size:20px;font-weight:800;line-height:1.5}
.lk-row,.lk-eq{display:flex;align-items:center;gap:4mm;flex-wrap:wrap}
.lk-row em{font-style:normal;font-size:20px;font-weight:800}
.lk-ico{display:inline-flex;gap:1.5mm;flex-wrap:wrap}
.lk-ico i{display:block;width:11mm;height:11mm}.lk-ico svg{width:100%;height:100%}
.lk-slot{border:2.5px dashed #b0a79a;border-radius:50%}
.lk-cross i{position:relative}.lk-cross i:nth-child(n){}
.lk-wbox{display:inline-flex;align-items:center;justify-content:center;min-width:17mm;height:15mm;border:3px solid #2b2a33;border-radius:4mm;background:#fff;font-size:26px;font-weight:900}
.lk-eq b{font-size:30px}
.lk-pick{display:flex;gap:8mm;font-size:21px;font-weight:800}.lk-pick span{display:flex;align-items:center;gap:2.5mm}.lk-pick i{width:8mm;height:8mm;border:3px solid #2b2a33;border-radius:50%}
.lk-ops{display:flex;gap:6mm}.lk-opbtn{display:flex;flex-direction:column;align-items:center;gap:1mm;padding:3mm 7mm;border:3px solid #2b2a33;border-radius:6mm;font-size:17px;font-weight:800;background:#fff}.lk-opbtn b{font-size:34px}
.lk-find p{margin:0 0 1mm;font-size:21px;font-weight:700}
.lk-ans{margin:auto 0 0;font-size:10px;color:#8a8794}.lk-ans b{color:#ff8a5c}
`;
window.NM_LANG_KIDS = { pageHtml, levels: LEVELS, css: CSS, rngOf };
})();
