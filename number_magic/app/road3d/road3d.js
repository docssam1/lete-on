/* ============================================================
   수의 마법 — 3D 연산 로드맵(길 지도) 머리 그림
   2026-09-26 원장 "로드맵도 이제 이런 느낌으로 수정해야지" — 3D 모드 선택(title3d)의 **마법사의 수학 작업 책상**과
   같은 세계에서, 책상 위에 **길게 펼친 양피지 길 지도(보드게임 판)**를 내려다본다.
     · 과정 C0…C47 = 구불구불한 길 위의 번호 이정표 돌(윗면에 KaTeX 숫자, 바로 선 글자)
     · 등급 구간(수의 나라 … 미적분Ⅰ) = 지도 위 옅은 색 구역 + 구간마다 작은 랜드마크 소품 + 가죽·금박 이름표
     · 지금 여기 = 아이 말(app/char3d, 실패하면 놋쇠 말)   다음 목표 = 빨간 깃발
     · 연산 점검(과정 3개마다) = 길가의 나무 도장(끝냈으면 지도에 빨간 도장 자국)
   글자는 전부 HTML(번역·키보드·스크린리더). 이정표마다 <button>(로빙 tabindex, ←/→ 로 옮겨 다닌다).
   끌기(마우스·손가락 가로) · 가로 휠(shift+휠) · ◀ ▶ 버튼 · 방향키로 길을 따라 움직인다.
   세로 휠·세로 손가락 끌기는 페이지를 스크롤한다(머리 그림이 페이지 스크롤을 가로채지 않게).
   잠금은 없다 — 어떤 과정이든 누를 수 있다(자유 선택 원칙).

   ── 연결 약속 ─────────────────────────────────────────────
   import { mountRoad3D } from './road3d/road3d.js';
   const ctl = await mountRoad3D(container, {
     lang:'ko'|'en'|'zh',
     courses:[{ id:'C0', num:0, title:'번역된 제목', band:'level0', state:'done'|'now'|'goal'|'doing'|'ahead', boss?, tower? }],  // 번호순
     bands:{ level0:{ name:'수의 나라', color:'#6FA85B' }, … },   // 이름은 번역된 문자열, 색은 #hex
     checkups:[{ num:3, from:1, to:3, state:'done'|'due'|'ahead' }],  // 과정 num 뒤에 선다
     current:'C29', goal:'C30'|null, focus:'C29'|null,              // focus = 처음에 비출 과정(없으면 current)
     avatar:{ kind:'boy'|'girl' },
     onCourse:id=>{}, onCheckup:num=>{},
     reducedMotion?:bool
   });
   // ctl === null → WebGL 없음/실패. 2D 목록만 쓰면 된다.
   // ctl.focusCourse(id, instant?)  ctl.dispose()  ctl._debug
   container 는 크기가 정해진 요소(높이 필수). 안에 .r3d 를 채운다.
   ============================================================ */
import { makeKit, fontsReady, THREE } from '../hero3d/kit.js';

const T = {
  here:{ ko:'지금 여기', en:'You are here', zh:'当前位置' },
  goal:{ ko:'다음 목표', en:'Next goal', zh:'下一个目标' },
  course:{ ko:'과정', en:'Course', zh:'课程' },
  check:{ ko:'연산 점검', en:'Check-up', zh:'运算检查' },
  checkShort:{ ko:'점검', en:'Check', zh:'检查' },
  done:{ ko:'정복함', en:'Conquered', zh:'已征服' },
  due:{ ko:'지금 할 차례', en:'Your turn now', zh:'轮到你了' },
  goHere:{ ko:'지금 여기로', en:'Back to me', zh:'回到当前' },
  drag:{ ko:'끌어서 길을 둘러봐요', en:'Drag to explore the road', zh:'拖动来看这条路' },
  prev:{ ko:'앞쪽 과정 보기', en:'Show earlier courses', zh:'看前面的课程' },
  next:{ ko:'뒤쪽 과정 보기', en:'Show later courses', zh:'看后面的课程' },
  map:{ ko:'연산 로드맵 지도 — 이정표를 누르면 아래 목록에서 그 과정을 보여 줘요. 왼쪽·오른쪽 방향키로 옮겨 다녀요.',
        en:'Course road map — pick a milestone to see that course in the list below. Use the left and right arrow keys to move.',
        zh:'运算路线图 — 点路标，下面的列表就会显示那个课程。用左右方向键移动。' },
  again:{ ko:'이어서', en:'continued', zh:'续' },
};
/* 지역 이야기 — 길이 지나는 곳마다 한두 줄(2026-09-26 원장 "스토리가 있어야지").
   마을 세계관(마을세계관-설계.md: 경시의 탑은 "어려운 문제를 좋아하는 아이가 가는 길")과 교육과정 지명·설명
   (data/curriculum.js: 펼침의 숲 "수를 펼쳐 쉽게 만드는 첫 마법", 음수의 동굴 "0을 기준으로 반대 방향에 이름을 붙이는 것",
   근호의 산맥 "제곱근을 다루는 법", 변화의 정상 "로드맵의 마지막 봉우리" …)에서만 가져온 장식 글이다.
   배우는 내용·기간·결과를 새로 약속하지 않는다. */
const STORY = {
  level0:{ ko:'숫자들이 처음 모여 사는 꽃밭이에요. 하나, 둘, 셋 — 세어 보며 수와 친해져요.',
           en:'A flower meadow where numbers first gather. Count one, two, three — and make friends with numbers.',
           zh:'数字们最先聚居的花田。一、二、三，数一数，和数字交朋友。' },
  level1:{ ko:'새싹이 돋는 숲 어귀예요. 수를 펼쳐 쉽게 만드는 첫 마법이 여기서 자라요.',
           en:'The edge of a sprouting wood. The first magic — unfolding numbers to make them easy — grows here.',
           zh:'新芽萌发的林边。把数展开、让它变简单的第一个魔法在这里生长。' },
  level2:{ ko:'개울 위 다리를 건너요. 한 걸음씩 더 멀리 뛰는 법을 익히는 곳이에요.',
           en:'Cross the bridge over the stream — a place to learn to leap a little farther each step.',
           zh:'走过溪上的小桥。在这里一步一步学会跳得更远。' },
  level3:{ ko:'언덕 너머로 작은 성이 보여요. 모은 마법으로 계산을 내 것으로 만드는 곳이에요.',
           en:'A little castle beyond the hills — where the magic you have gathered makes calculation your own.',
           zh:'山丘那边有座小城堡。用收集到的魔法，让计算真正属于自己。' },
  challenge:{ ko:'구름 가까이 솟은 탑이에요. 어려운 문제를 좋아하는 아이가 오르는 길이에요.',
           en:'A tower rising toward the clouds — the path for children who love a hard problem.',
           zh:'高耸入云的塔。这是喜欢难题的孩子攀登的路。' },
  middle1:{ ko:'잔잔한 호수가 물 위와 물 아래를 나눠요. 0을 기준으로 반대 방향에 이름을 붙여요.',
           en:'A still lake divides above and below the water — here, opposite directions from 0 get their names.',
           zh:'平静的湖面分开水上与水下。在这里，以0为基准给相反的方向起名字。' },
  middle2:{ ko:'구름 사이 떠 있는 섬에 식의 탑이 서 있어요. 문자로 된 식을 다루는 법을 익혀요.',
           en:'On an island floating among the clouds stands the Tower of Expressions — learn to handle expressions in letters.',
           zh:'云间浮岛上立着式之塔。在这里学习处理由字母组成的式子。' },
  middle3:{ ko:'눈 덮인 산맥을 넘어가요. 제곱근을 다루는 법과 곱셈공식을 만나요.',
           en:'Over the snowy ridges — meet square roots and the multiplication formulas.',
           zh:'翻过积雪的山脉，遇见平方根和乘法公式。' },
  highmath1:{ ko:'높은 탑의 계단이 이어져요. 다항식을 다루는 손이 한층 더 정교해져요.',
           en:'The tower stairs keep climbing — your hands grow more precise with polynomials.',
           zh:'高塔的台阶一级级向上，处理多项式的手更加精巧。' },
  highmath2:{ ko:'들판에 좌표의 격자가 펼쳐져요. 점과 직선, 원을 식으로 붙잡아요.',
           en:'A grid of coordinates spreads across the fields — catch points, lines and circles in equations.',
           zh:'田野上铺开坐标的网格，用方程抓住点、直线和圆。' },
  algebra:{ ko:'해 질 녘, 기호의 탑에 별이 하나씩 켜져요. 새 기호를 하나씩 만나요.',
           en:'At dusk, stars light up one by one over the Tower of Symbols — meet new symbols one at a time.',
           zh:'黄昏时分，符号之塔上的星星一颗颗亮起。一个一个地认识新符号。' },
  calculus1:{ ko:'별이 가득한 정상의 천문대예요. 길의 마지막 봉우리에서 변화를 바라봐요.',
           en:'An observatory on the starry summit — from the last peak of the road, watch how things change.',
           zh:'繁星满天的山顶天文台。在这条路的最后一座山峰上眺望变化。' },
};
const tr = (v, lang) => v == null ? '' : typeof v === 'string' || typeof v === 'number' ? String(v) : (v[lang] != null ? v[lang] : v.ko != null ? v.ko : '');
const esc = t => String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c]);
const glOK = () => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch(e){ return false; } };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
/* 여러 지오메트리를 하나로(인덱스 없이 이어 붙인다 — position·normal 만) */
function mergeG(list){
  const geos = list.map(g => g.index ? g.toNonIndexed() : g);
  const n = geos.reduce((a, g) => a + g.attributes.position.count, 0);
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3); let o = 0;
  geos.forEach(g => { pos.set(g.attributes.position.array, o * 3); nor.set(g.attributes.normal.array, o * 3); o += g.attributes.position.count; });
  const m = new THREE.BufferGeometry(); m.setAttribute('position', new THREE.BufferAttribute(pos, 3)); m.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  return m;
}

/* ---------- 스타일(한 번만) — 전부 .r3d 아래 ----------
   2026-09-26 v2 "밝은 신비(Luminous Arcana)" — 원장 "글씨나 배너가 90년대 파이널 판타지 rpg 같아".
   가죽·금박·놋쇠·밀랍·끈 꼬리표를 걷고, 서리 유리(vellum) 알약 + 잉크 남색 + 가는 금선 + 현대 명조. */
const CSS = `
.r3d{position:absolute;inset:0;overflow:hidden;background:#eef1f6;font-family:'Pretendard',sans-serif;
  --r3d-ink:#26304a;--r3d-ink2:#56607c;--r3d-gold:#c9a44c;--r3d-serif:'Hahmlet','Gowun Batang','Noto Serif KR',Georgia,serif;
  --r3d-card:rgba(255,255,255,.8);--r3d-line:rgba(201,164,76,.45);
  -webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none;touch-action:pan-y}
.r3d canvas.r3d-gl{position:absolute;inset:0;width:100%;height:100%;display:block;opacity:0;transition:opacity .6s ease}
.r3d canvas.r3d-gl.on{opacity:1}
.r3d.drag,.r3d.drag *{cursor:grabbing!important}
.r3d canvas.r3d-gl.hot{cursor:pointer}
/* 가장자리 옅은 안개 — 아래는 목록 종이로 녹아 들어간다 */
.r3d-vig{position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(180deg,rgba(255,255,255,0) 72%,rgba(247,243,234,.55) 100%),
    radial-gradient(ellipse 95% 90% at 50% 45%,rgba(255,255,255,0) 62%,rgba(238,241,246,.45) 100%)}
.r3d-ui{position:absolute;inset:0;pointer-events:none}
.r3d-ui>*{pointer-events:auto}
.r3d-frost{background:var(--r3d-card);-webkit-backdrop-filter:blur(10px) saturate(1.2);backdrop-filter:blur(10px) saturate(1.2);
  box-shadow:inset 0 0 0 1px var(--r3d-line),0 6px 20px rgba(38,48,74,.12)}

/* 이정표 — 돌 위에 겹친 투명 버튼(돌 자체가 그림이다) */
.r3d-stone{position:absolute;left:0;top:0;border:0;margin:0;padding:0;background:none;border-radius:50%;cursor:pointer;will-change:transform;
  min-width:44px;min-height:44px;color:transparent;font-size:1px;outline:none}
.r3d-stone:focus-visible{box-shadow:0 0 0 3px #fff,0 0 0 6px #26304a}
.r3d-stone.off{opacity:0;pointer-events:none!important}

/* 떠 있는 이름 쪽지(올리기·포커스) */
.r3d-tip{position:absolute;left:0;top:0;pointer-events:none!important;max-width:min(300px,78vw);white-space:normal;word-break:keep-all;
  color:var(--r3d-ink);font-size:13.5px;line-height:1.35;padding:7px 12px;border-radius:12px;
  background:var(--r3d-card);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);
  box-shadow:inset 0 0 0 1px var(--r3d-line),0 6px 18px rgba(38,48,74,.14);opacity:0;transition:opacity .15s}
.r3d-tip.on{opacity:1}
.r3d-tip b{font-family:var(--r3d-serif);font-weight:600;margin-right:6px;font-variant-numeric:tabular-nums}
.r3d-tip small{display:block;color:var(--r3d-ink2);font-size:11.5px;margin-top:1px}

/* 이야기 띠 — 지금 보고 있는 지역의 이름과 한두 줄 이야기(왼쪽 위) */
.r3d-story{position:absolute;left:14px;top:12px;max-width:min(360px,calc(100% - 28px));padding:9px 14px 10px;border-radius:14px;pointer-events:none!important;
  color:var(--r3d-ink);transition:opacity .35s ease,transform .35s ease;word-break:keep-all}
.r3d-story.swap{opacity:0;transform:translateY(-4px)}
.r3d-story small{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;letter-spacing:.08em;color:var(--r3d-ink2);line-height:1.3}
.r3d-story small::before{content:"";flex:none;width:7px;height:7px;border-radius:50%;background:var(--acc,#9cc8ff);box-shadow:0 0 0 3px rgba(255,255,255,.9),0 0 8px var(--acc,#9cc8ff)}
.r3d-story b{display:block;font-family:var(--r3d-serif);font-weight:500;font-size:18px;line-height:1.25;margin-top:3px;letter-spacing:-.005em}
.r3d-story p{margin:3px 0 0;font-size:12.5px;line-height:1.5;color:#3d4763}

/* 구간 이름표 — 지평선 위의 작은 서리 알약 */
.r3d-band{position:absolute;left:0;top:0;pointer-events:none!important;white-space:nowrap;will-change:transform;
  display:flex;align-items:baseline;gap:7px;padding:5px 11px 5px 10px;border-radius:999px;color:var(--r3d-ink)}
.r3d-band::before{content:"";align-self:center;flex:none;width:6px;height:6px;border-radius:50%;background:var(--acc,#c9a44c)}
.r3d-band b{font-family:var(--r3d-serif);font-weight:500;font-size:13.5px;line-height:1.2}
.r3d-band small{font-size:10.5px;color:var(--r3d-ink2);font-variant-numeric:tabular-nums}
.r3d-band small i{font-style:normal}
.r3d-band.off{visibility:hidden}

/* 공통 알약 버튼 */
.r3d-tag{position:absolute;left:0;top:0;border:0;margin:0;font:inherit;color:var(--r3d-ink);cursor:pointer;will-change:transform;
  display:flex;align-items:center;gap:8px;text-align:left;word-break:keep-all;min-height:44px;padding:5px 14px 5px 12px;white-space:nowrap;border-radius:999px;
  background:var(--r3d-card);-webkit-backdrop-filter:blur(10px) saturate(1.2);backdrop-filter:blur(10px) saturate(1.2);
  box-shadow:inset 0 0 0 1px var(--r3d-line),0 6px 18px rgba(38,48,74,.14);transition:box-shadow .15s,translate .15s;outline:none}
.r3d-tag:hover,.r3d-tag:focus-visible{translate:0 -2px;box-shadow:inset 0 0 0 1px var(--r3d-gold),0 0 0 4px rgba(185,167,255,.28),0 10px 22px rgba(38,48,74,.18)}
.r3d-tag:focus-visible{outline:3px solid #26304a;outline-offset:3px}
.r3d-tag b{font-family:var(--r3d-serif);font-weight:500;font-size:14.5px;line-height:1.2}
.r3d-tag small{display:block;font-size:11.5px;color:var(--r3d-ink2);line-height:1.25;margin-top:1px;max-width:220px;overflow:hidden;text-overflow:ellipsis}
.r3d-tag .n{font-family:var(--r3d-serif);font-weight:600;font-variant-numeric:tabular-nums}
.r3d-tag.off{visibility:hidden}
/* 지금 여기 — 진주 알약 + 은은히 도는 무지개 후광 */
.r3d-tag.now{padding:6px 16px 6px 7px;gap:10px;isolation:isolate;
  background:linear-gradient(135deg,#ffffff 0%,#f4efff 35%,#e9fbf6 70%,#fff8e8 100%);
  box-shadow:inset 0 0 0 1px var(--r3d-gold),0 8px 22px rgba(38,48,74,.18)}
.r3d-tag.now::before{content:"";position:absolute;inset:-7px;z-index:-1;border-radius:999px;filter:blur(10px);opacity:.75;
  background:linear-gradient(90deg,#b9a7ff,#8fe3d2,#9cc8ff,#b9a7ff);background-size:300% 100%;animation:r3dHalo 7s linear infinite}
@keyframes r3dHalo{to{background-position:300% 0}}
.r3d-tag.now .seal{flex:none;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;color:#26304a;
  background:radial-gradient(circle at 35% 30%,#ffffff 0%,#efeaff 45%,#d9f5ee 100%);box-shadow:inset 0 0 0 1px rgba(38,48,74,.18)}
.r3d-tag.now b{font-size:15.5px;font-weight:600}
.r3d-tag.now small{color:#3d4763}
.r3d-tag.goal .flag{flex:none;width:14px;height:18px;position:relative}
.r3d-tag.goal .flag::before{content:"";position:absolute;left:1px;top:0;width:1.5px;height:18px;background:#26304a;border-radius:1px}
.r3d-tag.goal .flag::after{content:"";position:absolute;left:2.5px;top:1px;width:11px;height:8px;background:#e0705f;clip-path:polygon(0 0,100% 50%,0 100%)}
/* 점검 */
.r3d-tag.chk{min-height:44px;padding:4px 12px 4px 10px;gap:6px}
.r3d-tag.chk::before{content:"";flex:none;width:8px;height:8px;border-radius:50%;box-shadow:inset 0 0 0 1.5px #56607c}
.r3d-tag.chk.done::before{background:#5fae8e;box-shadow:none}
.r3d-tag.chk.due::before{background:#e0705f;box-shadow:0 0 0 3px rgba(224,112,95,.25)}
.r3d-tag.chk b{font-size:12.5px}
.r3d-tag.chk .n{font-size:12.5px;color:var(--r3d-ink2)}
.r3d-tag.chk.due b{color:#b3442f}

/* 아래 조작 줄 */
.r3d-ctl{position:absolute;left:0;right:0;bottom:10px;display:flex;align-items:center;justify-content:center;gap:12px;pointer-events:none!important}
.r3d-ctl>*{pointer-events:auto}
.r3d-arrow{flex:none;width:46px;height:46px;border-radius:50%;border:0;cursor:pointer;display:grid;place-items:center;color:var(--r3d-ink);padding:0;
  background:var(--r3d-card);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);box-shadow:inset 0 0 0 1px var(--r3d-line),0 6px 16px rgba(38,48,74,.14)}
.r3d-arrow svg{width:19px;height:19px}
.r3d-arrow:hover{box-shadow:inset 0 0 0 1px var(--r3d-gold),0 0 0 4px rgba(156,200,255,.3),0 8px 18px rgba(38,48,74,.16)}
.r3d-arrow:focus-visible{outline:3px solid #26304a;outline-offset:3px}
.r3d-arrow:disabled{opacity:.45;cursor:default}
.r3d-me{position:relative;border:0;cursor:pointer;min-height:44px;padding:5px 18px 6px;color:var(--r3d-ink);font:inherit;text-align:center;border-radius:999px;
  background:var(--r3d-card);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);box-shadow:inset 0 0 0 1px var(--r3d-line),0 6px 16px rgba(38,48,74,.14)}
.r3d-me b{display:flex;align-items:center;justify-content:center;gap:6px;font-family:var(--r3d-serif);font-weight:500;font-size:14.5px;line-height:1.2}
.r3d-me b svg{width:14px;height:14px;flex:none}
.r3d-me small{display:block;font-size:11px;color:var(--r3d-ink2);line-height:1.25}
.r3d-me:hover{box-shadow:inset 0 0 0 1px var(--r3d-gold),0 0 0 4px rgba(185,167,255,.26),0 8px 18px rgba(38,48,74,.16)}
.r3d-me:focus-visible{outline:3px solid #26304a;outline-offset:3px}
.r3d-hint{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.r3d.narrow .r3d-story{left:10px;top:8px;padding:6px 11px 7px;max-width:calc(100% - 20px)}
.r3d.narrow .r3d-story small{display:none}
.r3d.narrow .r3d-story b{font-size:15px;margin-top:0}
.r3d.narrow .r3d-story p{font-size:11.5px;line-height:1.45}
.r3d.narrow .r3d-band{padding:4px 9px 4px 8px}
.r3d.narrow .r3d-band b{font-size:12.5px}
.r3d.narrow .r3d-band small{display:none}
.r3d.narrow .r3d-tag b{font-size:13.5px}
.r3d.narrow .r3d-tag small{max-width:150px}
.r3d.narrow .r3d-tag.now small,.r3d.narrow .r3d-tag.goal small{display:none}
.r3d.narrow .r3d-tag.now{padding:4px 13px 4px 5px}
.r3d.narrow .r3d-tag.now b{font-size:14.5px}
.r3d.narrow .r3d-tag.now .seal{width:27px;height:27px}
.r3d.narrow .r3d-ctl{bottom:8px;gap:10px}
@media (prefers-reduced-motion:reduce){.r3d canvas.r3d-gl,.r3d-tag,.r3d-tip,.r3d-story{transition:none}.r3d-tag.now::before{animation:none}}
@media (forced-colors:active){.r3d-tag,.r3d-me,.r3d-arrow{border:2px solid ButtonText;background:ButtonFace;color:ButtonText}.r3d-tag.now::before{display:none}.r3d-stone:focus{outline:3px solid Highlight}}
`;
function injectCss(){
  if(document.getElementById('road3d-style')) return;
  const s = document.createElement('style'); s.id = 'road3d-style'; s.textContent = CSS; document.head.appendChild(s);
}

/* ---------- 지도 배치(순수 계산) ---------- */
const SP = 1.55, GAP = 0.95, MAPD = 5.0;
const Z_TOP = -1.95, Z_BOT = 2.35;   /* 카메라가 반드시 담는 길 띠(먼 쪽 랜드마크 발치 ~ 가까운 쪽 돌 가장자리) */
const roadZ = x => 0.95 * Math.sin(x * 0.52 + 0.4) + 0.12 * Math.sin(x * 1.37);
function layoutRoad(courses){
  let x = 0; const pos = [];
  courses.forEach((c, i) => {
    if(i > 0){ x += SP; if(c.band !== courses[i - 1].band) x += GAP; }
    pos.push(x);
  });
  /* 연속 구간(같은 등급이 끊기면 따로) */
  const runs = []; const seen = {};
  courses.forEach((c, i) => {
    const last = runs[runs.length - 1];
    if(last && last.band === c.band){ last.to = i; }
    else { runs.push({ band:c.band, from:i, to:i, again:!!seen[c.band] }); seen[c.band] = true; }
  });
  runs.forEach(r => { r.x0 = pos[r.from] - (r.from === 0 ? SP * 0.9 : (SP + GAP) / 2); r.x1 = pos[r.to] + (r.to === courses.length - 1 ? SP * 0.9 : (SP + GAP) / 2); });
  return { pos, runs, x0:pos[0] - SP * 1.3, x1:pos[pos.length - 1] + SP * 1.3 };
}

/* ============================================================ */
export async function mountRoad3D(container, opts){
  opts = opts || {};
  const courses = (opts.courses || []).slice();
  if(!container || !courses.length || !glOK()) return null;
  injectCss();
  const lang = opts.lang || 'ko';
  const L = v => tr(v, lang);
  const bands = opts.bands || {};
  const reduce = opts.reducedMotion != null ? !!opts.reducedMotion : !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const idx = {}; courses.forEach((c, i) => { idx[c.id] = i; });
  const curI = idx[opts.current] != null ? idx[opts.current] : 0;
  const goalI = opts.goal != null && idx[opts.goal] != null ? idx[opts.goal] : -1;

  const root = document.createElement('div'); root.className = 'r3d';
  root.setAttribute('role', 'region');
  root.setAttribute('lang', lang === 'zh' ? 'zh-Hans' : lang);
  const canvas = document.createElement('canvas'); canvas.className = 'r3d-gl'; canvas.setAttribute('aria-hidden', 'true');
  const vig = document.createElement('div'); vig.className = 'r3d-vig'; vig.setAttribute('aria-hidden', 'true');
  const ui = document.createElement('div'); ui.className = 'r3d-ui';
  root.append(canvas, vig, ui);
  container.appendChild(root);
  const hintId = 'r3dHint' + Math.random().toString(36).slice(2, 7);
  root.setAttribute('aria-label', L(T.map).split(' — ')[0]);

  const sizeOf = () => [Math.max(240, root.clientWidth || container.clientWidth || 800), Math.max(200, root.clientHeight || container.clientHeight || 400)];
  let [VW, VH] = sizeOf();

  await fontsReady();
  if(!root.isConnected){ root.remove(); return null; }
  let k;
  try { k = makeKit(23, { live:true, canvas, width:VW, height:VH }); }
  catch(e){ root.remove(); return null; }
  const { r, scene, cam } = k;
  const lay = layoutRoad(courses);

  let world;
  try { world = buildWorld(k, courses, bands, lay, opts, curI, goalI); }
  catch(e){ console.error('[road3d]', e); try { r.dispose(); } catch(_){} root.remove(); return null; }
  /* 3D 아이(char3d) — 실패하면 놋쇠 말 그대로 */
  let kid = null;
  try {
    const m = await import('../char3d/char3d.js');
    if(root.isConnected){
      kid = m.makeCharacter(THREE, { kind:(opts.avatar && opts.avatar.kind) === 'girl' ? 'girl' : 'boy', height:1.4, blob:false });
      world.setPawn(kid);
    }
  } catch(e){ console.warn('[road3d] char3d', e); kid = null; }
  if(!root.isConnected){
    try { kid && kid.dispose(); } catch(_){}
    try { r.dispose(); r.forceContextLoss && r.forceContextLoss(); } catch(_){}
    root.remove(); return null;
  }

  /* ---------- HTML 겹 ---------- */
  const hint = document.createElement('p'); hint.className = 'r3d-hint'; hint.id = hintId; hint.textContent = L(T.map);
  root.setAttribute('aria-describedby', hintId);
  const tip = document.createElement('div'); tip.className = 'r3d-tip'; tip.setAttribute('aria-hidden', 'true');
  const bandEls = lay.runs.map(run => {
    const el = document.createElement('div'); el.className = 'r3d-band r3d-frost'; el.setAttribute('aria-hidden', 'true');
    const bd = bands[run.band] || {};
    el.style.setProperty('--acc', bd.color || '#c9a063');
    const a = courses[run.from].num, b = courses[run.to].num;
    /* 돌 하나 = 과정 하나(여러 주), 한 주가 아니다 — 원장 "중학교 1학년이 3번 만에 끝나?"(2026-09-26).
       그래서 이름표에 그 구간의 수업 횟수를 함께 적는다(주기와 무관한 값이라 주 1·2회를 바꿔도 맞다). */
    let nSess = 0; for(let k = run.from; k <= run.to; k++) nSess += courses[k].sessions || 0;
    const sessTxt = nSess ? ' · ' + (lang === 'en' ? nSess + ' lessons' : lang === 'zh' ? nSess + '次课' : '수업 ' + nSess + '회') : '';
    el.innerHTML = `<b>${esc(bd.name || run.band)}</b><small>${esc(L(T.course))} <i>${a === b ? a : a + '–' + b}</i>${esc(sessTxt)}${run.again ? ' · ' + esc(L(T.again)) : ''}</small>`;
    /* 이름표를 누르지는 않지만, 이야기 띠가 이미 같은 이름을 말하고 있으면 숨긴다(두 번 말하지 않게) */
    return el;
  });
  const stoneEls = courses.map((c, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'r3d-stone';
    b.dataset.c = c.id; b.tabIndex = i === curI ? 0 : -1;
    const st = c.state === 'done' ? L(T.done) : c.state === 'now' ? L(T.here) : c.state === 'goal' ? L(T.goal) : '';
    b.setAttribute('aria-label', `${L(T.course)} ${c.num} · ${c.title}${st ? ' · ' + st : ''}`);
    b.textContent = String(c.num);
    return b;
  });
  const nowEl = document.createElement('button'); nowEl.type = 'button'; nowEl.className = 'r3d-tag now';
  const cc = courses[curI];
  nowEl.innerHTML = `<span class="seal" aria-hidden="true">${pinSvg()}</span><span><b>${esc(L(T.here))}</b><small><span class="n">${cc.num}</span> · ${esc(cc.title)}</small></span>`;
  nowEl.setAttribute('aria-label', `${L(T.here)} — ${L(T.course)} ${cc.num} · ${cc.title}`);
  let goalEl = null;
  if(goalI >= 0){
    const gc = courses[goalI];
    goalEl = document.createElement('button'); goalEl.type = 'button'; goalEl.className = 'r3d-tag goal';
    goalEl.innerHTML = `<span class="flag" aria-hidden="true"></span><span><b>${esc(L(T.goal))} <span class="n">${gc.num}</span></b><small>${esc(gc.title)}</small></span>`;
    goalEl.setAttribute('aria-label', `${L(T.goal)} — ${L(T.course)} ${gc.num} · ${gc.title}`);
  }
  const chkEls = world.checks.map(ch => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'r3d-tag chk ' + ch.state;
    b.innerHTML = `<b>${esc(L(T.checkShort))}</b><span class="n">${ch.from}–${ch.to}</span>`;
    b.setAttribute('aria-label', `${L(T.check)} · ${L(T.course)} ${ch.from}~${ch.to}${ch.state === 'done' ? ' · ✓' : ch.state === 'due' ? ' · ' + L(T.due) : ''}`);
    b.tabIndex = -1;
    b.addEventListener('click', () => { if(!swallow()) opts.onCheckup && opts.onCheckup(ch.num); });
    return b;
  });
  const ctl = document.createElement('div'); ctl.className = 'r3d-ctl';
  const arrow = (dir) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'r3d-arrow';
    b.setAttribute('aria-label', L(dir < 0 ? T.prev : T.next));
    b.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${dir < 0 ? 'M14.5 5.5L8 12l6.5 6.5' : 'M9.5 5.5L16 12l-6.5 6.5'}"/></svg>`;
    return b; };
  const prevB = arrow(-1), nextB = arrow(1);
  const meB = document.createElement('button'); meB.type = 'button'; meB.className = 'r3d-me';
  meB.innerHTML = `<b><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-6.5-6.9-6.5-11.5a6.5 6.5 0 0 1 13 0C18.5 14.1 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.2"/></svg>${esc(L(T.goHere))}</b><small>${esc(L(T.drag))}</small>`;
  ctl.append(prevB, meB, nextB);
  /* 이야기 띠 — 카메라가 비추는 지역의 이름 + 한두 줄 이야기(장식 글 — 학습 내용·약속을 지어내지 않는다) */
  const story = document.createElement('div'); story.className = 'r3d-story r3d-frost'; story.setAttribute('aria-live', 'polite');
  let storyRun = -1, storyT = 0;
  function setStory(ri){
    if(ri === storyRun) return; storyRun = ri;
    const run = lay.runs[ri]; if(!run) return;
    const bd = bands[run.band] || {};
    const fill = () => {
      story.style.setProperty('--acc', bd.color || '#9cc8ff');
      const tale = STORY[run.band] ? L(STORY[run.band]) : '';
      story.innerHTML = `${bd.sub ? `<small>${esc(bd.sub)}</small>` : ''}<b>${esc(bd.name || run.band)}</b>${tale ? `<p>${esc(tale)}</p>` : ''}`;
      story.classList.remove('swap'); sizes = null;
    };
    clearTimeout(storyT);
    if(reduce || !story.textContent){ fill(); return; }
    story.classList.add('swap'); storyT = setTimeout(() => { fill(); dirty = true; wake(); }, 220);
  }
  /* 탭 순서: 지금 여기 → 다음 목표 → (이정표 한 자리) → ◀ 📍 ▶ */
  ui.append(hint, story, ...bandEls, ...chkEls, ...stoneEls, tip, nowEl);
  if(goalEl) ui.append(goalEl);
  ui.append(ctl);

  /* ---------- 카메라 ---------- */
  /* v2(밝은 세계): 조금 눕혀서 길 너머 지평선과 하늘이 보이게 — 56° → 50° */
  const PITCH = THREE.MathUtils.degToRad(50);
  const dir = new THREE.Vector3(0, Math.sin(PITCH), Math.cos(PITCH));
  let camD = 10, visW = 10;
  const camT = { x:0, goal:0, vel:0 };
  const tz = 0.25;
  const _v = new THREE.Vector3();
  const proj = (x, y, z) => { _v.set(x, y, z).project(cam); return [(_v.x + 1) / 2 * VW, (1 - _v.y) / 2 * VH, _v.z]; };
  function placeCam(){
    cam.position.set(camT.x, 0, tz).addScaledVector(dir, camD);
    cam.lookAt(camT.x, 0, tz); cam.updateMatrixWorld(true);
    world.follow(camT.x);
  }
  let narrow = false, topPad = 40, botPad = 64;
  function relayout(){
    [VW, VH] = sizeOf();
    r.setSize(VW, VH, false);
    cam.aspect = VW / VH; cam.fov = 34; cam.updateProjectionMatrix();
    narrow = VW < 560;
    root.classList.toggle('narrow', narrow);
    /* 위쪽 3할은 하늘·지평선 자리 — 길(돌·랜드마크 발치)이 그 아래에 들어오게 맞춘다 */
    topPad = Math.round(VH * (narrow ? 0.33 : 0.36)); botPad = narrow ? 58 : 64;
    let lo = 2, hi = 60;
    for(let it = 0; it < 22; it++){
      camD = (lo + hi) / 2; placeCam();
      const top = proj(camT.x, 0, narrow ? -1.85 : Z_TOP)[1], bot = proj(camT.x, 0, narrow ? 2.15 : Z_BOT)[1];
      if(top >= topPad && bot <= VH - botPad) hi = camD; else lo = camD;
    }
    camD = hi;
    /* 넓은 화면에서 너무 멀리 보이지 않게 — 한 화면에 이정표가 12개 넘게 들어오면 당긴다 */
    placeCam();
    const wAt = () => { const a = proj(camT.x - 1, 0, 0)[0], b = proj(camT.x + 1, 0, 0)[0]; return VW / ((b - a) / 2); };
    visW = wAt();
    if(visW > SP * 12){ camD *= SP * 12 / visW; placeCam(); visW = wAt(); }
    /* 지평선 — 화면 위에서 18% 쯤에 땅이 끝나고 하늘이 시작한다 */
    { let a = -14, b = Z_TOP - 0.35; const want = VH * (narrow ? 0.2 : 0.23);
      if(proj(camT.x, 0, b)[1] <= want) a = b;
      else for(let it = 0; it < 26; it++){ const m = (a + b) / 2; if(proj(camT.x, 0, m)[1] < want) a = m; else b = m; }
      world.setHorizon(a, camD, visW); }
    clampCam(true);
    placeCam();
    dirty = true; wake();
  }
  const minX = () => Math.min(lay.pos[0] + visW * 0.32, (lay.x0 + lay.x1) / 2);
  const maxX = () => Math.max(lay.pos[lay.pos.length - 1] - visW * 0.32, (lay.x0 + lay.x1) / 2);
  function clampCam(both){ camT.goal = clamp(camT.goal, minX(), maxX()); if(both) camT.x = clamp(camT.x, minX(), maxX()); }
  function aimAt(i, instant){
    const x = lay.pos[clamp(i, 0, courses.length - 1)];
    camT.goal = x + visW * 0.08; clampCam();
    if(instant || reduce){ camT.x = camT.goal; camT.vel = 0; placeCam(); }
    dirty = true; wake();
  }

  /* ---------- 강조 · 쪽지 ---------- */
  let hot = -1;
  function setHot(i){
    if(hot === i) return;
    hot = i; world.setHot(i);
    if(i >= 0){ const c = courses[i];
      const st = c.state === 'done' ? L(T.done) : c.state === 'now' ? L(T.here) : c.state === 'goal' ? L(T.goal) : c.state === 'doing' ? '…' : '';
      tip.innerHTML = `<b>${c.num}</b>${esc(c.title)}${st && st !== '…' ? `<small>${esc(st)}</small>` : ''}`; }
    tip.classList.toggle('on', i >= 0);
    dirty = true; wake();
  }

  /* ---------- 입력 ---------- */
  let dragS = null, justDragged = 0;
  const swallow = () => performance.now() - justDragged < 350;
  const choose = i => { if(i < 0 || swallow()) return; opts.onCourse && opts.onCourse(courses[i].id); };
  stoneEls.forEach((b, i) => {
    b.addEventListener('click', () => choose(i));
    b.addEventListener('pointerenter', e => { if(e.pointerType !== 'touch') setHot(i); });
    b.addEventListener('pointerleave', () => { if(hot === i && document.activeElement !== b) setHot(-1); });
    b.addEventListener('focus', () => { roving(i); setHot(i); ensureVisible(i); });
    b.addEventListener('blur', () => { if(hot === i) setHot(-1); });
    b.addEventListener('keydown', e => {
      let j = -1;
      if(e.key === 'ArrowRight' || e.key === 'ArrowDown') j = i + 1; else if(e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = i - 1;
      else if(e.key === 'Home') j = 0; else if(e.key === 'End') j = courses.length - 1; else return;
      e.preventDefault(); j = clamp(j, 0, courses.length - 1); stoneEls[j].focus({ preventScroll:true });
    });
  });
  function roving(i){ stoneEls.forEach((b, j) => { b.tabIndex = j === i ? 0 : -1; }); }
  function ensureVisible(i){
    const x = lay.pos[i];
    if(Math.abs(x - camT.goal) > visW * 0.36){ camT.goal = x; clampCam(); dirty = true; wake(); }
  }
  nowEl.addEventListener('click', () => choose(curI));
  if(goalEl) goalEl.addEventListener('click', () => choose(goalI));
  prevB.addEventListener('click', () => { camT.goal -= visW * 0.7; clampCam(); if(reduce) camT.x = camT.goal; dirty = true; wake(); });
  nextB.addEventListener('click', () => { camT.goal += visW * 0.7; clampCam(); if(reduce) camT.x = camT.goal; dirty = true; wake(); });
  meB.addEventListener('click', () => { aimAt(curI); if(kid && kid.wave && !reduce) kid.wave(); });

  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  function hitAt(cx, cy){
    const b = canvas.getBoundingClientRect();
    ndc.set(((cx - b.left) / b.width) * 2 - 1, -((cy - b.top) / b.height) * 2 + 1);
    ray.setFromCamera(ndc, cam);
    const h = ray.intersectObjects(world.hits, false)[0];
    if(!h) return null;
    return h.object.userData;
  }
  const isCtl = t => t && t.closest && t.closest('.r3d-ctl, .r3d-tag');
  const onDown = e => {
    if(e.button != null && e.button !== 0) return;
    if(isCtl(e.target)) return;
    dragS = { id:e.pointerId, x:e.clientX, y:e.clientY, cx:camT.x, moved:false, lastX:e.clientX, lastT:performance.now(), v:0, touch:e.pointerType === 'touch' };
  };
  const onMove = e => {
    if(dragS && e.pointerId === dragS.id){
      const dx = e.clientX - dragS.x, dy = e.clientY - dragS.y;
      if(!dragS.moved){
        if(Math.abs(dx) > 7 && Math.abs(dx) > Math.abs(dy) * 1.1){ dragS.moved = true; root.classList.add('drag'); try { root.setPointerCapture(e.pointerId); } catch(_){} setHot(-1); }
        else if(dragS.touch && Math.abs(dy) > 10){ dragS = null; return; }
      }
      if(dragS.moved){
        const wpp = visW / VW;
        camT.x = camT.goal = clamp(dragS.cx - dx * wpp, minX() - visW * 0.06, maxX() + visW * 0.06);
        const now = performance.now(), dt = Math.max(1, now - dragS.lastT);
        dragS.v = (e.clientX - dragS.lastX) / dt * wpp * -1000; dragS.lastX = e.clientX; dragS.lastT = now;
        placeCam(); dirty = true; wake();
      }
      return;
    }
    if(e.pointerType === 'touch' || e.target !== canvas) return;
    const h = hitAt(e.clientX, e.clientY);
    const i = h && h.courseI != null ? h.courseI : -1;
    canvas.classList.toggle('hot', !!h);
    if(i !== hot && !(i < 0 && stoneEls[hot] === document.activeElement)) setHot(i);
  };
  const onUp = e => {
    if(!dragS || e.pointerId !== dragS.id) return;
    const d = dragS; dragS = null;
    if(d.moved){
      justDragged = performance.now(); root.classList.remove('drag');
      camT.vel = reduce ? 0 : clamp(d.v, -visW * 3, visW * 3);
      if(performance.now() - d.lastT > 90) camT.vel = 0;
      camT.goal = camT.x; clampCam(); dirty = true; wake();
      return;
    }
    if(e.target === canvas){
      const h = hitAt(e.clientX, e.clientY);
      if(h && h.courseI != null) choose(h.courseI);
      else if(h && h.checkNum != null && opts.onCheckup) opts.onCheckup(h.checkNum);
    }
  };
  const onCancel = e => { if(dragS && e.pointerId === dragS.id){ if(dragS.moved){ justDragged = performance.now(); camT.goal = camT.x; clampCam(); } dragS = null; root.classList.remove('drag'); } };
  const onWheel = e => {
    const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0;
    if(!dx) return;   /* 세로 휠은 페이지 스크롤 */
    e.preventDefault();
    const px = e.deltaMode === 1 ? dx * 16 : dx;
    camT.goal += px * visW / VW; clampCam(); if(reduce) camT.x = camT.goal; dirty = true; wake();
  };
  const onLeave = () => { canvas.classList.remove('hot'); if(hot >= 0 && stoneEls[hot] !== document.activeElement) setHot(-1); };
  root.addEventListener('pointerdown', onDown);
  root.addEventListener('pointermove', onMove);
  root.addEventListener('pointerup', onUp);
  root.addEventListener('pointercancel', onCancel);
  root.addEventListener('wheel', onWheel, { passive:false });
  /* Tab 으로 화면 밖 이정표에 포커스가 가면 브라우저가 overflow:hidden 층을 스크롤한다 — 되돌리고 카메라가 따라간다 */
  const onScrollFix = () => { if(root.scrollLeft || root.scrollTop){ root.scrollLeft = 0; root.scrollTop = 0; } if(ui.scrollLeft || ui.scrollTop){ ui.scrollLeft = 0; ui.scrollTop = 0; } };
  root.addEventListener('scroll', onScrollFix, true);
  canvas.addEventListener('pointerleave', onLeave);

  /* ---------- 라벨 자리(카메라가 움직였을 때만) ---------- */
  const rectOf = el => [el.offsetWidth, el.offsetHeight];
  let sizes = null;
  function measure(){
    sizes = { bands:bandEls.map(rectOf), chks:chkEls.map(rectOf), now:rectOf(nowEl), goal:goalEl ? rectOf(goalEl) : null, tip:null, story:rectOf(story) };
  }
  function place(el, x, y, w, h, show){
    const on = show && x + w > -4 && x < VW + 4 && y + h > -4 && y < VH + 4;
    el.classList.toggle('off', !on);
    if(on) el.style.transform = `translate3d(${Math.round(x)}px,${Math.round(y)}px,0)`;
    return on;
  }
  function placeLabels(){
    if(!sizes) measure();
    const ov = (a, b2, pad) => a[0] < b2[0] + b2[2] + pad && b2[0] < a[0] + a[2] + pad && a[1] < b2[1] + b2[3] + pad && b2[1] < a[1] + a[3] + pad;
    const inView = rc => rc[0] >= 4 && rc[1] >= 2 && rc[0] + rc[2] <= VW - 4 && rc[1] + rc[3] <= VH - 4;
    /* 이정표 버튼 — 돌의 화면 지름 */
    const stoneRects = [];
    courses.forEach((c, i) => {
      const p = world.stoneAt(i);
      const [x, y] = proj(p.x, p.y, p.z);
      const [x2] = proj(p.x + world.stoneR(i), p.y, p.z);
      const d = Math.max(44, (x2 - x) * 2);
      const b = stoneEls[i];
      b.style.width = b.style.height = Math.round(d) + 'px';
      if(place(b, x - d / 2, y - d / 2, d, d, true)) stoneRects.push([x - d * 0.42, y - d * 0.36, d * 0.84, d * 0.72, i]);
      if(i === hot){
        const tw = tip.offsetWidth || 160, th = tip.offsetHeight || 34;
        const tx = clamp(x - tw / 2, 6, VW - tw - 6), ty = y + d / 2 + 8 + th > VH - botPad + 6 ? y - d / 2 - th - 10 : y + d / 2 + 8;
        tip.style.transform = `translate3d(${Math.round(tx)}px,${Math.round(ty)}px,0)`;
      }
    });
    /* 피해야 할 자리: 아래 조작 줄 · 아이 몸 · (점검·목표 쪽지는) 이정표 돌 */
    const occ = [];
    /* 이야기 띠 — 카메라 가운데가 속한 지역 */
    { let ri = lay.runs.findIndex(run => camT.x >= run.x0 && camT.x <= run.x1);
      if(ri < 0) ri = camT.x < lay.runs[0].x0 ? 0 : lay.runs.length - 1;
      setStory(ri); if(!sizes) measure();
      if(sizes.story[0]) occ.push([story.offsetLeft - 4, story.offsetTop - 4, sizes.story[0] + 8, sizes.story[1] + 8]); }
    if(prevB.offsetParent){ const x0 = prevB.offsetLeft - 6, x1 = nextB.offsetLeft + nextB.offsetWidth + 6, y0 = ctl.offsetTop + Math.min(prevB.offsetTop, meB.offsetTop) - 4;
      occ.push([x0, y0, x1 - x0, VH - y0]); }
    const pt = world.pawnTop(), pf = world.pawnFoot();
    const [hx, hy] = proj(pt.x, pt.y - 0.1, pt.z), [fx0, fy0] = proj(pf.x, pf.y, pf.z);
    const pw = Math.max(26, (fy0 - hy) * 0.5);
    const pawnRect = [hx - pw / 2, hy, pw, Math.max(10, fy0 - hy)];
    const free = (rc, avoidStones, skipStone) => inView(rc) && !occ.some(o => ov(rc, o, 3)) && !ov(rc, pawnRect, 2)
      && !(avoidStones && stoneRects.some(sr => sr[4] !== skipStone && ov(rc, sr, 1)));
    const put = (el, rc) => { el.classList.remove('off'); el.style.transform = `translate3d(${Math.round(rc[0])}px,${Math.round(rc[1])}px,0)`; occ.push(rc); };
    /* 지금 여기 — 아이 머리 위(화면 밖이면 가장자리에 붙여 방향을 알려 준다) */
    { const [w, h] = sizes.now;
      if(hx < -20 || hx > VW + 20){ let y = clamp(hy - h - 10, 6, VH - botPad - h - 6);
        if(hx < 0 && sizes.story[0] && y < story.offsetTop + sizes.story[1] + 8) y = Math.min(VH - botPad - h - 6, story.offsetTop + sizes.story[1] + 8); put(nowEl, [hx < 0 ? 8 : VW - w - 8, y, w, h]); nowEl.dataset.edge = hx < 0 ? 'l' : 'r'; }
      else {
        delete nowEl.dataset.edge;
        const cands = [[hx - w / 2, hy - h - 12], [hx - w * 0.15, hy - h - 12], [hx - w * 0.85, hy - h - 12], [hx + pw / 2 + 6, hy - 4], [hx - pw / 2 - w - 6, hy - 4]]
          .map(([x, y]) => [clamp(x, 6, VW - w - 6), Math.max(4, y), w, h]);
        const rc = cands.find(c => free(c, true)) || cands.find(c => free(c, false)) || cands[0];
        put(nowEl, rc);
      } }
    /* 다음 목표 — 깃발 곁 */
    if(goalEl){ const [w, h] = sizes.goal; const p = world.flagTop(); const [fx, fy] = proj(p.x, p.y, p.z);
      const gp = world.stoneAt(goalI); const [gx, gy] = proj(gp.x, gp.y, gp.z);
      if(fx < -40 || fx > VW + 40) goalEl.classList.add('off');
      else {
        const cands = [[fx - w * 0.3, fy - h - 4], [fx + 8, fy - 2], [fx - w - 8, fy - 2], [gx - w / 2, gy + 26], [fx - w / 2, fy - h - 30]]
          .map(([x, y]) => [clamp(x, 6, VW - w - 6), Math.max(4, y), w, h]);
        const rc = cands.find(c => free(c, true, goalI)) || cands.find(c => free(c, false));
        if(rc) put(goalEl, rc); else goalEl.classList.add('off');
      } }
    /* 점검 쪽지 — 도장 곁, 돌·다른 쪽지와 안 겹치는 자리가 없으면 숨긴다(도장은 그대로 누를 수 있다) */
    world.checks.forEach((ch, j) => { const [w, h] = sizes.chks[j]; const [sx, sy] = proj(ch.x, 0.2, ch.z);
      const el = chkEls[j];
      if(sx < -w || sx > VW + w){ el.classList.add('off'); return; }
      const cands = [[sx - w / 2, sy + 14], [sx - w / 2, sy - h - 22], [sx + 18, sy - h / 2], [sx - w - 18, sy - h / 2]].map(([x, y]) => [x, y, w, h]);
      const rc = cands.find(c => free(c, true));
      if(rc) put(el, rc); else el.classList.add('off'); });
    /* 구간 이름표 — 지평선 바로 위, 구간 가운데(화면 안의 구간이면 보이는 부분 가운데).
       이야기 띠가 이미 말하고 있는 지역은 건너뛴다(같은 이름을 두 번 적지 않게). */
    let lastR = -1e9;
    lay.runs.forEach((run, j) => {
      const zH = world.horizonZ();
      const [ax] = proj(run.x0, 0, zH), [bx] = proj(run.x1, 0, zH);
      const [w, h] = sizes.bands[j];
      if(run.band === (lay.runs[storyRun] || {}).band){ bandEls[j].classList.add('off'); return; }
      const vis0 = Math.max(ax, 6), vis1 = Math.min(bx, VW - 6);
      const cx = vis1 - vis0 > w ? (vis0 + vis1) / 2 : (ax + bx) / 2;
      const [, y] = proj((run.x0 + run.x1) / 2, 0, zH);
      const ty = Math.max(4, y - h - 10);
      /* 가운데가 막혀 있으면(지금 여기 쪽지 등) 구간 안에서 옆으로 비켜 본다 */
      const xs = [cx - w / 2, vis0, vis1 - w, vis0 + (vis1 - vis0 - w) * 0.25, vis0 + (vis1 - vis0 - w) * 0.75].map(x => clamp(x, ax, Math.max(ax, bx - w)));
      const fit = bx - ax > w * 0.55 ? xs.find(x => x > lastR + 6 && x + w > 0 && x < VW && !occ.some(o => ov([x, ty, w, h], o, 2))) : undefined;
      if(place(bandEls[j], fit == null ? 0 : fit, ty, w, h, fit != null)) lastR = fit + w;
    });
    prevB.disabled = camT.goal <= minX() + 0.01;
    nextB.disabled = camT.goal >= maxX() - 0.01;
  }

  /* ---------- 루프 ---------- */
  let raf = 0, running = !document.hidden, visible = true, disposed = false, dirty = true, shown = false, last = performance.now(), t0 = last, last0 = last;
  function frame(){
    raf = 0; if(disposed) return;
    if(!root.isConnected){ dispose(); return; }
    const now = performance.now(), dt = Math.max(0, Math.min(0.05, (now - last) / 1000)); last = now;
    const t = (now - t0) / 1000;
    const dtr = Math.max(0, Math.min(0.25, (now - last0) / 1000)); last0 = now;   /* 카메라는 실제 시간으로(느린 기기에서도 제때 도착) */
    let moving = false;
    if(!dragS || !dragS.moved){
      if(camT.vel){ camT.goal += camT.vel * dtr; camT.vel *= Math.pow(0.04, dtr); if(Math.abs(camT.vel) < 0.05) camT.vel = 0; clampCam(); moving = true; }
      const dx = camT.goal - camT.x;
      if(Math.abs(dx) > 0.002){ camT.x += reduce ? dx : dx * Math.min(1, dtr * 7); moving = true; placeCam(); }
      else if(camT.x !== camT.goal){ camT.x = camT.goal; placeCam(); }
    }
    const anim = !reduce && world.animate(t, dt);
    if(kid && !reduce) kid.update(dt, t);
    if(moving || dirty || anim || kid){
      placeLabels(); dirty = false;
      r.render(scene, cam);
      if(!shown){ shown = true; canvas.classList.add('on'); }
    }
    if(running && visible && (!reduce || moving || (dragS && dragS.moved))) raf = requestAnimationFrame(frame);
  }
  function wake(){ if(!raf && running && visible && !disposed){ last = last0 = performance.now(); raf = requestAnimationFrame(frame); } }
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => { visible = es.some(x => x.isIntersecting); if(visible) wake(); }) : null;
  if(io) io.observe(root);
  const onVis = () => { running = !document.hidden; if(running) wake(); };
  document.addEventListener('visibilitychange', onVis);
  let rt = 0;
  const onResize = () => { clearTimeout(rt); rt = setTimeout(() => { if(!disposed){ sizes = null; relayout(); } }, 60); };
  const ro = 'ResizeObserver' in window ? new ResizeObserver(onResize) : null;
  if(ro) ro.observe(root); else window.addEventListener('resize', onResize);

  function dispose(){
    if(disposed) return; disposed = true;
    if(raf) cancelAnimationFrame(raf); raf = 0;
    clearTimeout(rt);
    if(io) io.disconnect(); if(ro) ro.disconnect(); else window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVis);
    root.removeEventListener('pointerdown', onDown); root.removeEventListener('pointermove', onMove);
    root.removeEventListener('pointerup', onUp); root.removeEventListener('pointercancel', onCancel);
    root.removeEventListener('wheel', onWheel); root.removeEventListener('scroll', onScrollFix, true); canvas.removeEventListener('pointerleave', onLeave);
    /* char3d 는 지오메트리·재질을 캐릭터끼리 나눠 쓴다 — 먼저 떼어 내 공용 자원을 건드리지 않게 */
    if(kid){ try { kid.dispose(); } catch(e){} if(kid.object && kid.object.parent) kid.object.parent.remove(kid.object); kid = null; }
    const seen = new Set();
    scene.traverse(o => {
      if(o.geometry && !seen.has(o.geometry)){ seen.add(o.geometry); o.geometry.dispose(); }
      const m = o.material; (Array.isArray(m) ? m : m ? [m] : []).forEach(mm => { if(seen.has(mm)) return; seen.add(mm);
        for(const key in mm){ const v = mm[key]; if(v && v.isTexture) v.dispose(); }
        if(mm.uniforms) Object.values(mm.uniforms).forEach(u => { if(u && u.value && u.value.isTexture) u.value.dispose(); });
        mm.dispose(); });
    });
    if(scene.environment) scene.environment.dispose();
    try { r.dispose(); r.forceContextLoss && r.forceContextLoss(); } catch(e){}
    root.remove();
  }

  relayout();
  const fi = opts.focus != null && idx[opts.focus] != null ? idx[opts.focus] : curI;
  aimAt(fi, true);
  wake();
  const api = {
    focusCourse(id, instant){ if(disposed || idx[id] == null) return; aimAt(idx[id], instant); },
    dispose,
    get disposed(){ return disposed; },
    _debug:{ cam, scene, proj:(x, y, z) => proj(x, y, z), world, hitAt, get camX(){ return camT.x; }, get visW(){ return visW; }, get camD(){ return camD; }, renderer:r, redraw:() => { dirty = true; wake(); } },
  };
  root.__r3d = api;   /* 검사 도구가 찾아 쓰는 자리(스크린샷·디버그) */
  return api;
}

function pinSvg(){
  return '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 2.8a6.2 6.2 0 0 0-6.2 6.2c0 4.6 6.2 12.2 6.2 12.2s6.2-7.6 6.2-12.2A6.2 6.2 0 0 0 12 2.8z" fill="#fff0e0" stroke="#7c1a12" stroke-width="1.2"/><circle cx="12" cy="9" r="2.4" fill="#b8302a"/></svg>';
}

/* ============================================================
   3D 세계 — v2 "밝은 신비"(2026-09-26 원장 "숲이라든지 하늘도 있고 좀 밝아야 할 것 같아 길을 가더라도" · "스토리가 있어야지")
   어두운 책상 위 양피지를 걷어 내고, 같은 굽이 길이 **하늘 아래 열린 세상**을 지나간다.
   구간(등급)마다 땅·하늘·지평선이 바뀐다 — 꽃밭(수의 나라) → 새싹 숲 → 개울 → 언덕과 성 → 탑이 선 산 →
   호수 → 구름 위 섬 → 눈 덮인 산맥 → 탑의 계단 → 좌표 들판 → 노을의 기호 탑 → 별빛 정상의 천문대.
   길·돌·도장·깃발·아이는 그대로(원장 "굴곡이나 디자인은 잘했어").
   ============================================================ */
/* 지역 색 — 전부 밝은 고명도. top/hor = 하늘 위·지평선, g1/g2 = 땅 두 톤, stars = 별(0~1) */
const BIOME = {
  level0:   { top:'#8fc8f2', hor:'#fbf6e8', g1:'#a9d78b', g2:'#c7e79f', stars:0 },
  level1:   { top:'#89c3f0', hor:'#f4f7ea', g1:'#8fca78', g2:'#b0da8e', stars:0 },
  level2:   { top:'#86c1ee', hor:'#eef6f1', g1:'#94cb85', g2:'#b6dd9c', stars:0 },
  level3:   { top:'#93c4ec', hor:'#faf2dd', g1:'#b3d68b', g2:'#d2e3a2', stars:0 },
  challenge:{ top:'#a3bfee', hor:'#f4eef7', g1:'#b4cfa2', g2:'#cddbbd', stars:0 },
  middle1:  { top:'#94c7e8', hor:'#eaf6f4', g1:'#9fd1ab', g2:'#c0e5c6', stars:0 },
  middle2:  { top:'#adc2f1', hor:'#f6f1fb', g1:'#b9dab9', g2:'#d6ead0', stars:0 },
  middle3:  { top:'#b2c0ee', hor:'#f4eff4', g1:'#c0d4bf', g2:'#dde6da', stars:0.05 },
  highmath1:{ top:'#bab7ee', hor:'#fbefe8', g1:'#c6d8b2', g2:'#dfe8cb', stars:0.12 },
  highmath2:{ top:'#c0b5ec', hor:'#fdeae2', g1:'#cfdab5', g2:'#e6e8cd', stars:0.2 },
  algebra:  { top:'#b1a4e6', hor:'#fbe5df', g1:'#c7d7bd', g2:'#e1e7d3', stars:0.55 },
  calculus1:{ top:'#a298de', hor:'#f5e0e8', g1:'#cdd3e6', g2:'#e6e4f2', stars:0.85 },
};
const BIO_DEF = BIOME.level0;
const IRI = [new THREE.Color('#b9a7ff'), new THREE.Color('#8fe3d2'), new THREE.Color('#9cc8ff')];
function buildWorld(k, courses, bands, lay, opts, curI, goalI){
  const { scene, rnd, canvasTex, rbox, woodMat, metal, lacquer, mathText, r } = k;
  const TAU = Math.PI * 2;
  const col = key => (bands[key] && bands[key].color) || '#8a6a40';
  const C = c => new THREE.Color(c);
  r.toneMappingExposure = 0.92;
  r.localClippingEnabled = true;

  /* ---- 지역 색을 x 로 부드럽게 섞기(구간 가운데끼리 보간) ---- */
  const mids = lay.runs.map(run => ({ x:(run.x0 + run.x1) / 2, b:BIOME[run.band] || BIO_DEF }));
  const sstep = t => t * t * (3 - 2 * t);
  const bioAt = x => {
    if(x <= mids[0].x) return { a:mids[0].b, b:mids[0].b, t:0 };
    for(let i = 0; i < mids.length - 1; i++){
      if(x <= mids[i + 1].x){ const t = (x - mids[i].x) / Math.max(1e-6, mids[i + 1].x - mids[i].x);
        /* 구간 경계 근처에서만 섞는다 — 구간 안쪽은 제 색 그대로 */
        return { a:mids[i].b, b:mids[i + 1].b, t:sstep(clamp((t - 0.3) / 0.4, 0, 1)) }; }
    }
    const l = mids[mids.length - 1].b; return { a:l, b:l, t:0 };
  };
  const _ca = new THREE.Color(), _cb = new THREE.Color();
  const mixCol = (x, key, out) => { const m = bioAt(x); _ca.set(m.a[key]); _cb.set(m.b[key]); return (out || new THREE.Color()).copy(_ca).lerp(_cb, m.t); };
  const mixNum = (x, key) => { const m = bioAt(x); return m.a[key] + (m.b[key] - m.a[key]) * m.t; };
  const css = c => `rgb(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)})`;
  /* 텍스처에 칠하는 색은 sRGB 그대로(THREE.Color 는 선형이라 getStyle 로 되돌린다) */
  const cssOf = (x, key) => mixCol(x, key).getStyle();

  /* ---- 하늘 — 화면을 채우는 배경. 카메라 x 의 0.6배로 흘러 먼 느낌이 난다 ---- */
  const PAR = 0.6;
  const SK0 = lay.x0 * PAR - 14, SK1 = lay.x1 * PAR + 14, SKW = SK1 - SK0;
  const SKY_H = 0.3;   /* 텍스처 위쪽 30% 가 하늘, 그 아래는 지평선 색(땅에 가려진다) */
  const skyTex = canvasTex(4096, 512, (g, w, h) => {
    const worldX = u => (SK0 + u * SKW) / PAR;
    const SL = 8;
    for(let px = 0; px < w; px += SL){
      const x = worldX((px + SL / 2) / w);
      const gr = g.createLinearGradient(0, 0, 0, h * SKY_H);
      gr.addColorStop(0, cssOf(x, 'top')); gr.addColorStop(1, cssOf(x, 'hor'));
      g.fillStyle = gr; g.fillRect(px, 0, SL + 1, h * SKY_H);
      g.fillStyle = cssOf(x, 'hor'); g.fillRect(px, h * SKY_H - 1, SL + 1, h);
    }
    /* 해 — 아침(출발) 쪽에 부드러운 빛, 노을 쪽에 복숭아빛 */
    const glow = (u, v, rad, rgb, a) => { const gg = g.createRadialGradient(u * w, v * h, 0, u * w, v * h, rad);
      gg.addColorStop(0, `rgba(${rgb},${a})`); gg.addColorStop(1, `rgba(${rgb},0)`); g.fillStyle = gg; g.fillRect(u * w - rad, v * h - rad, rad * 2, rad * 2); };
    const uOf = x => (x * PAR - SK0) / SKW;
    glow(uOf(lay.x0 + 2), 0.06, 220, '255,250,225', 0.95);
    const late = lay.runs.find(run => run.band === 'algebra' || run.band === 'highmath2');
    if(late) glow(uOf((late.x0 + late.x1) / 2), SKY_H * 0.95, 380, '255,196,170', 0.55);
    /* 별 — 늦은 지역일수록 */
    for(let i = 0; i < 1400; i++){
      const u = rnd(), v = rnd() * SKY_H * 0.8, st = mixNum(worldX(u), 'stars');
      if(st <= 0.02 || rnd() > st) continue;
      const big = rnd() < 0.08, rr = big ? 1.6 : 0.6 + rnd() * 0.7;
      g.fillStyle = `rgba(255,255,255,${0.55 + rnd() * 0.45})`; g.beginPath(); g.arc(u * w, v * h, rr, 0, TAU); g.fill();
      if(big){ g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 0.8; g.beginPath(); g.moveTo(u * w - 5, v * h); g.lineTo(u * w + 5, v * h); g.moveTo(u * w, v * h - 5); g.lineTo(u * w, v * h + 5); g.stroke(); }
    }
    /* 구름 — 부드러운 흰 덩어리(별이 많은 곳은 옅게) */
    for(let i = 0; i < 70; i++){
      const u = rnd(), st = mixNum(worldX(u), 'stars');
      const cx = u * w, cy = h * SKY_H * (0.25 + rnd() * 0.6), s = 14 + rnd() * 26, a = (0.75 - st * 0.5);
      for(let q = 0; q < 6; q++){ const ox = (q - 2.5) * s * 0.7 + (rnd() - 0.5) * s * 0.4, oy = -Math.sin(q / 5 * Math.PI) * s * 0.45 + (rnd() - 0.5) * s * 0.15, rr = s * (0.55 + rnd() * 0.45);
        const gg = g.createRadialGradient(cx + ox, cy + oy, 0, cx + ox, cy + oy, rr);
        gg.addColorStop(0, `rgba(255,255,255,${a})`); gg.addColorStop(0.6, `rgba(255,255,255,${a * 0.55})`); gg.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = gg; g.fillRect(cx + ox - rr, cy + oy - rr, rr * 2, rr * 2); }
    }
  });
  skyTex.anisotropy = 1;
  scene.background = skyTex;
  scene.fog = new THREE.Fog('#f2f4ee', 12, 30);

  /* 빛 — 높은 낮빛 + 차가운 하늘빛, 그림자는 옅게 */
  {
    const envScene = new THREE.Scene();
    const sky = new THREE.Mesh(new THREE.SphereGeometry(50, 24, 12), new THREE.MeshBasicMaterial({ side:THREE.BackSide, vertexColors:true }));
    const cs = [], pa = sky.geometry.attributes.position, c = new THREE.Color();
    for(let i = 0; i < pa.count; i++){ const y = pa.getY(i) / 50; c.set(y > 0 ? '#cfe3f6' : '#a9c08a').lerp(new THREE.Color('#fff6e4'), 1 - Math.abs(y)); cs.push(c.r, c.g, c.b); }
    sky.geometry.setAttribute('color', new THREE.Float32BufferAttribute(cs, 3));
    envScene.add(sky);
    const pm = new THREE.PMREMGenerator(r);
    scene.environment = pm.fromScene(envScene, 0.03).texture;
    scene.environmentIntensity = 0.4;
    pm.dispose(); sky.geometry.dispose(); sky.material.dispose();
  }
  scene.add(new THREE.HemisphereLight('#fffdf6', '#b9cda2', 0.8));
  const sun = new THREE.DirectionalLight('#fff2dc', 1.9);
  sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left:-9, right:9, top:6, bottom:-6, near:1, far:30 });
  sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.025; sun.shadow.radius = 5;
  if('intensity' in sun.shadow) sun.shadow.intensity = 0.62;
  scene.add(sun, sun.target);
  const fill = new THREE.DirectionalLight('#dbe7ff', 0.55); scene.add(fill, fill.target);
  let skyRep = 0.2;
  const follow = x => {
    sun.position.set(x - 5, 11, 6); sun.target.position.set(x, 0, 0); sun.target.updateMatrixWorld();
    fill.position.set(x + 8, 6, 8); fill.target.position.set(x, 0, 0); fill.target.updateMatrixWorld();
    skyTex.repeat.x = skyRep;
    skyTex.offset.x = clamp((x * PAR - SK0) / SKW - skyRep / 2, 0, 1 - skyRep);
    mixCol(x, 'hor', scene.fog.color).lerp(_cb.set('#ffffff'), 0.15);
    if(mist) mist.material.color.copy(scene.fog.color);
  };

  const cast = o => { o.traverse(m => { if(m.isMesh && !m.userData.noShadow){ m.castShadow = true; m.receiveShadow = true; } }); return o; };
  const flat = (mesh, y) => { mesh.rotation.x = -Math.PI / 2; mesh.position.y = y; return mesh; };
  const glowTex = canvasTex(128, 128, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.3, 'rgba(255,255,255,.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  const shadowTex = canvasTex(128, 128, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); gr.addColorStop(0, 'rgba(38,52,40,.42)'); gr.addColorStop(0.55, 'rgba(38,52,40,.16)'); gr.addColorStop(1, 'rgba(38,52,40,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  const blobGeo = new THREE.PlaneGeometry(1, 1);
  const blob = (x, z, sx, sz, op) => { const m = new THREE.Mesh(blobGeo, new THREE.MeshBasicMaterial({ map:shadowTex, transparent:true, opacity:op == null ? 0.8 : op, depthWrite:false }));
    flat(m, 0.03); m.scale.set(sx, sz, 1); m.position.x = x; m.position.z = z; m.renderOrder = 1; scene.add(m); return m; };

  /* ---- 땅: 가까운 띠(길이 그려진 칠한 땅) + 먼 들(정점 색) — 지평선에서 잘라 하늘이 보이게 ---- */
  const ZN = 5.2, ZM = -2.7, ZF = -16;          /* 가까운 끝 · 칠한 띠의 먼 끝 · 먼 들의 끝 */
  const horizon = new THREE.Plane(new THREE.Vector3(0, 0, 1), 14);   /* z ≥ -14 만 그린다 — setHorizon 이 옮긴다 */
  const GX0 = lay.x0 - 14, GX1 = lay.x1 + 14;
  const PPU = 88, SEGW = 8, MD = ZN - ZM;
  const roadPts = []; for(let x = lay.pos[0]; x <= lay.pos[lay.pos.length - 1] + 0.001; x += 0.08) roadPts.push([x, roadZ(x)]);
  const xNow = lay.pos[curI];
  const offRoad = (x, z, pad) => Math.abs(z - roadZ(clamp(x, lay.pos[0], lay.pos[lay.pos.length - 1]))) > pad;
  const checks = [];
  (opts.checkups || []).forEach(ch => {
    const i = courses.findIndex(c => c.num === ch.num);
    if(i < 0) return;
    const xa = lay.pos[i], xb = i + 1 < lay.pos.length ? lay.pos[i + 1] : xa + SP;
    const x = (xa + xb) / 2, zr = roadZ(x);
    const z = zr + (zr > 0 ? -0.78 : 0.78);
    checks.push({ num:ch.num, from:ch.from, to:ch.to, state:ch.state, x, z });
  });
  const runOf = key => lay.runs.find(run => run.band === key);
  /* 개울(계산의 도약) — 구간 가운데 두 돌 사이를 가로지른다 */
  let river = null;
  { const run = runOf('level2');
    if(run){ const m = Math.floor((run.from + run.to) / 2), n = Math.min(run.to, m + 1);
      const xr = n > m ? (lay.pos[m] + lay.pos[n]) / 2 : lay.pos[m] + SP / 2;
      river = { x:xr, at:z => xr + 0.28 * Math.sin(z * 1.25 + 0.6), w:0.62 }; } }
  /* 호수(중학교 1학년) — 길 먼 쪽 */
  let lake = null;
  { const run = runOf('middle1');
    if(run){ let bx = (run.x0 + run.x1) / 2, best = -1e9;
      for(let x = run.x0 + 0.4; x <= run.x1 - 0.4; x += 0.1){ const sc = roadZ(x); if(sc > best){ best = sc; bx = x; } }
      lake = { x:bx + 0.35, z:Math.min(roadZ(bx) - 1.05, -1.2), rx:Math.min(1.25, (run.x1 - run.x0) * 0.33), rz:0.42 }; } }
  const grid = runOf('highmath2');
  const paint = (g, x0) => {
    const w = SEGW * PPU, h = MD * PPU;
    g.setTransform(1, 0, 0, 1, 0, 0);
    /* 바탕 — 지역 색을 x 로 섞어 세로띠로 */
    for(let px = 0; px < w; px += 4){ const x = x0 + px / PPU;
      const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, cssOf(x, 'g1')); gr.addColorStop(0.5, cssOf(x, 'g2')); gr.addColorStop(1, cssOf(x, 'g1'));
      g.fillStyle = gr; g.fillRect(px, 0, 5, h); }
    g.setTransform(PPU, 0, 0, PPU, -x0 * PPU, -ZM * PPU);   /* 이제부터 월드 단위(x, z) */
    /* 부드러운 명암 얼룩 */
    for(let i = 0; i < 90; i++){ const x = x0 - 1 + rnd() * (SEGW + 2), z = ZM + rnd() * MD, rr = 0.35 + rnd() * 0.9;
      const gg = g.createRadialGradient(x, z, 0, x, z, rr); const lite = rnd() < 0.5;
      gg.addColorStop(0, lite ? 'rgba(255,255,235,.16)' : 'rgba(60,110,60,.09)'); gg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gg; g.fillRect(x - rr, z - rr, rr * 2, rr * 2); }
    /* 풀결 */
    for(let i = 0; i < 2600; i++){ const x = x0 - 0.2 + rnd() * (SEGW + 0.4), z = ZM + rnd() * MD;
      g.strokeStyle = rnd() < 0.5 ? `rgba(70,120,60,${0.08 + rnd() * 0.12})` : `rgba(255,255,230,${0.1 + rnd() * 0.14})`; g.lineWidth = 0.012;
      g.beginPath(); g.moveTo(x, z); g.lineTo(x + (rnd() - 0.5) * 0.03, z - 0.04 - rnd() * 0.05); g.stroke(); }
    /* 꽃점(수의 나라·새싹) */
    for(let i = 0; i < 700; i++){ const x = x0 - 0.2 + rnd() * (SEGW + 0.4), z = ZM + rnd() * MD;
      const m = bioAt(x); const fl = (m.t < 0.5 ? m.a : m.b) === BIOME.level0 ? 1 : (m.t < 0.5 ? m.a : m.b) === BIOME.level1 ? 0.45 : (m.t < 0.5 ? m.a : m.b) === BIOME.level3 ? 0.2 : 0;
      if(rnd() > fl || !offRoad(x, z, 0.32)) continue;
      g.fillStyle = ['#ffffff', '#ffd1e0', '#fff0a8', '#e3d4ff', '#ffc9a8'][Math.floor(rnd() * 5)]; g.beginPath(); g.arc(x, z, 0.022 + rnd() * 0.02, 0, TAU); g.fill(); }
    /* 좌표 들판(공통수학2) — 옅은 격자와 두 축 */
    if(grid && grid.x1 > x0 - 1 && grid.x0 < x0 + SEGW + 1){
      g.save(); g.beginPath(); g.rect(grid.x0 + 0.2, ZM, grid.x1 - grid.x0 - 0.4, MD); g.clip();
      g.strokeStyle = 'rgba(38,48,74,.12)'; g.lineWidth = 0.012;
      for(let x = Math.ceil(grid.x0 * 2) / 2; x <= grid.x1; x += 0.5){ g.beginPath(); g.moveTo(x, ZM); g.lineTo(x, ZN); g.stroke(); }
      for(let z = Math.ceil(ZM * 2) / 2; z <= ZN; z += 0.5){ g.beginPath(); g.moveTo(grid.x0, z); g.lineTo(grid.x1, z); g.stroke(); }
      g.strokeStyle = 'rgba(38,48,74,.28)'; g.lineWidth = 0.022; const ax = Math.round((grid.x0 + grid.x1)); const axx = ax / 2;
      g.beginPath(); g.moveTo(axx, ZM); g.lineTo(axx, ZN); g.moveTo(grid.x0, 1.8); g.lineTo(grid.x1, 1.8); g.stroke();
      g.restore(); }
    /* 개울 */
    if(river && river.x > x0 - 2 && river.x < x0 + SEGW + 2){
      const edge = (side, wd) => { g.beginPath(); for(let z = ZM - 0.1; z <= ZN + 0.1; z += 0.1){ const x = river.at(z) + side * wd / 2; z === ZM - 0.1 ? g.moveTo(x, z) : g.lineTo(x, z); } };
      const band = (wd, fillC) => { g.beginPath(); for(let z = ZM - 0.1; z <= ZN + 0.1; z += 0.1) g.lineTo(river.at(z) - wd / 2, z); for(let z = ZN + 0.1; z >= ZM - 0.1; z -= 0.1) g.lineTo(river.at(z) + wd / 2, z); g.closePath(); g.fillStyle = fillC; g.fill(); };
      band(river.w + 0.14, 'rgba(220,210,170,.9)'); band(river.w, '#9fd3ea'); band(river.w * 0.55, '#b9e2f2');
      g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = 0.014;
      for(let i = 0; i < 26; i++){ const z = ZM + rnd() * MD, x = river.at(z) + (rnd() - 0.5) * river.w * 0.6; g.beginPath(); g.moveTo(x - 0.06, z); g.quadraticCurveTo(x, z - 0.025, x + 0.06, z); g.stroke(); }
      edge(0, 0);
    }
    /* 호수 */
    if(lake && lake.x > x0 - 3 && lake.x < x0 + SEGW + 3){
      g.fillStyle = 'rgba(220,210,170,.9)'; g.beginPath(); g.ellipse(lake.x, lake.z, lake.rx + 0.08, lake.rz + 0.07, 0, 0, TAU); g.fill();
      const lg = g.createRadialGradient(lake.x - lake.rx * 0.3, lake.z - 0.1, 0.05, lake.x, lake.z, lake.rx);
      lg.addColorStop(0, '#d6f1f7'); lg.addColorStop(1, '#8cc9e2'); g.fillStyle = lg; g.beginPath(); g.ellipse(lake.x, lake.z, lake.rx, lake.rz, 0, 0, TAU); g.fill();
      g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 0.014; g.beginPath(); g.ellipse(lake.x, lake.z, lake.rx * 0.7, lake.rz * 0.6, 0, 0.2, 1.6); g.stroke();
    }
    /* 길 */
    const path = (from, to) => { g.beginPath(); let st = false; roadPts.forEach(([x, z]) => { if(x < from - 0.05 || x > to + 0.05) return; st ? g.lineTo(x, z) : g.moveTo(x, z); st = true; }); };
    g.lineCap = 'round'; g.lineJoin = 'round';
    path(-1e9, 1e9); g.strokeStyle = 'rgba(150,130,90,.35)'; g.lineWidth = 0.56; g.stroke();
    path(-1e9, 1e9); g.strokeStyle = '#efe2c2'; g.lineWidth = 0.44; g.stroke();
    /* 지나온 길 — 따뜻한 금빛 */
    path(-1e9, xNow); g.strokeStyle = 'rgba(244,206,120,.95)'; g.lineWidth = 0.34; g.stroke();
    path(-1e9, 1e9); g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 0.035; g.setLineDash([0.13, 0.12]); g.stroke(); g.setLineDash([]);
    /* 연산 점검 — 끝냈으면 도장 자국, 할 차례면 점선 동그라미 */
    checks.forEach(ch => {
      if(ch.x < x0 - 1 || ch.x > x0 + SEGW + 1) return;
      const cx = ch.x + 0.34, cz = ch.z - 0.02;
      if(ch.state === 'done'){
        g.save(); g.translate(cx, cz); g.rotate(-0.25);
        g.strokeStyle = 'rgba(196,72,58,.7)'; g.lineWidth = 0.03; g.beginPath(); g.arc(0, 0, 0.2, 0, TAU); g.stroke();
        g.lineWidth = 0.012; g.beginPath(); g.arc(0, 0, 0.16, 0, TAU); g.stroke();
        g.lineWidth = 0.045; g.beginPath(); g.moveTo(-0.09, 0.0); g.lineTo(-0.02, 0.07); g.lineTo(0.1, -0.07); g.stroke();
        g.restore();
      } else {
        g.strokeStyle = ch.state === 'due' ? 'rgba(196,72,58,.6)' : 'rgba(60,80,60,.3)'; g.lineWidth = 0.02; g.setLineDash([0.05, 0.04]);
        g.beginPath(); g.arc(cx, cz, 0.2, 0, TAU); g.stroke(); g.setLineDash([]);
      }
    });
  };
  const clipM = m => { m.clippingPlanes = [horizon]; return m; };
  for(let x0 = GX0; x0 < GX1 - 0.001; x0 += SEGW){
    const tex = canvasTex(SEGW * PPU, Math.round(MD * PPU), g => paint(g, x0));
    tex.anisotropy = 4;
    const m = clipM(new THREE.MeshStandardMaterial({ map:tex, roughness:0.95 }));
    const mesh = flat(new THREE.Mesh(new THREE.PlaneGeometry(SEGW, MD), m), 0);
    mesh.position.set(x0 + SEGW / 2, 0, (ZM + ZN) / 2); mesh.receiveShadow = true; scene.add(mesh);
  }
  /* 먼 들 — 정점 색만(가볍게). 칠한 띠와 같은 색 함수 */
  {
    const nx = Math.ceil((GX1 - GX0) / 0.5), nz = 12;
    const fg = new THREE.PlaneGeometry(GX1 - GX0, ZM - ZF + 0.02, nx, nz); fg.rotateX(-Math.PI / 2);
    fg.translate((GX0 + GX1) / 2, 0, (ZM + ZF) / 2 - 0.01);
    const p = fg.attributes.position, cs = [], c = new THREE.Color();
    for(let i = 0; i < p.count; i++){ const x = p.getX(i), z = p.getZ(i);
      mixCol(x, 'g1', c).lerp(mixCol(x, 'g2', _ca), 0.5 + 0.35 * Math.sin(x * 0.9 + z * 1.7)); cs.push(c.r, c.g, c.b); }
    fg.setAttribute('color', new THREE.Float32BufferAttribute(cs, 3));
    const far = new THREE.Mesh(fg, clipM(new THREE.MeshStandardMaterial({ vertexColors:true, roughness:1 })));
    far.receiveShadow = true; scene.add(far);
  }
  /* 지평선 안개 — 땅이 끝나는 곧은 선을 부드럽게 */
  const mistTex = canvasTex(8, 128, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.55, 'rgba(255,255,255,.55)'); gr.addColorStop(1, 'rgba(255,255,255,1)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  const mist = new THREE.Mesh(new THREE.PlaneGeometry(GX1 - GX0, 1.1), new THREE.MeshBasicMaterial({ map:mistTex, transparent:true, depthWrite:false, fog:false, color:'#f4f4ee' }));
  mist.position.set((GX0 + GX1) / 2, 0.42, -14); mist.renderOrder = 2; scene.add(mist);

  /* ---- 이정표 돌 ---- */
  const hits = [];
  const stoneGeo = new THREE.CylinderGeometry(0.4, 0.46, 0.17, 36);
  const bigGeo = new THREE.CylinderGeometry(0.5, 0.57, 0.2, 40);
  const stoneTex = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#b9ad98'; g.fillRect(0, 0, w, h);
    for(let i = 0; i < 2500; i++){ const v = rnd(); g.fillStyle = v < 0.5 ? `rgba(60,50,40,${rnd() * 0.18})` : `rgba(255,250,235,${rnd() * 0.16})`; g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 3, 1 + rnd() * 3); } });
  const stoneMat = new THREE.MeshStandardMaterial({ map:stoneTex, roughness:0.82 });
  const stoneMatDone = new THREE.MeshStandardMaterial({ map:stoneTex, color:'#f7cf6e', roughness:0.5, metalness:0.25 });
  const goldM = metal('#e2b457', 0.28), brass = metal('#c9a050', 0.32);
  const ringGeo = new THREE.TorusGeometry(0.405, 0.035, 10, 40), bigRingGeo = new THREE.TorusGeometry(0.505, 0.042, 10, 44);
  const faceGeo = new THREE.CircleGeometry(0.34, 36), bigFaceGeo = new THREE.CircleGeometry(0.43, 40);
  const lacq = {}; const lq = c => lacq[c] || (lacq[c] = lacquer(c));
  const stones = [];
  courses.forEach((c, i) => {
    const x = lay.pos[i], z = roadZ(x);
    const big = c.state === 'now' || c.boss;
    const g = new THREE.Group(); g.position.set(x, 0.02, z);
    const body = new THREE.Mesh(big ? bigGeo : stoneGeo, c.state === 'done' ? stoneMatDone : stoneMat);
    const hh = big ? 0.2 : 0.17;
    body.position.y = hh / 2; g.add(body);
    body.userData = { courseI:i };
    hits.push(body);
    const ringColor = c.state === 'done' || c.state === 'now' ? null : c.state === 'goal' ? '#c3362c' : col(c.band);
    const ring = new THREE.Mesh(big ? bigRingGeo : ringGeo, ringColor ? lq(ringColor) : goldM);
    ring.rotation.x = Math.PI / 2; ring.position.y = hh - 0.005; g.add(ring);
    const faceT = canvasTex(192, 192, (gg, w, h) => {
      const done = c.state === 'done', ahead = c.state === 'ahead';
      const rg = gg.createRadialGradient(w * 0.42, h * 0.36, 4, w / 2, h / 2, w * 0.56);
      rg.addColorStop(0, done ? '#fff6da' : '#fbf5e4'); rg.addColorStop(1, done ? '#ecd49a' : ahead ? '#e2d6bb' : '#eadcb8');
      gg.fillStyle = rg; gg.fillRect(0, 0, w, h);
      for(let q = 0; q < 500; q++){ gg.fillStyle = `rgba(120,90,50,${rnd() * 0.06})`; gg.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 2, 1 + rnd() * 4); }
      gg.strokeStyle = done ? 'rgba(150,110,30,.6)' : 'rgba(90,65,35,.35)'; gg.lineWidth = 4; gg.beginPath(); gg.arc(w / 2, h / 2, w * 0.44, 0, TAU); gg.stroke();
      gg.textBaseline = 'middle';
      gg.fillStyle = done ? '#6a4a0e' : c.state === 'goal' ? '#7a1e16' : ahead ? '#5d4c36' : '#2c1d10';
      const s = String(c.num); mathText(gg, s, w / 2, h / 2 + 6, s.length > 1 ? 92 : 108, { align:'center' });
      if(done){ gg.strokeStyle = '#b8862e'; gg.lineWidth = 7; gg.lineCap = 'round'; gg.beginPath(); gg.moveTo(w * 0.36, h * 0.83); gg.lineTo(w * 0.46, h * 0.9); gg.lineTo(w * 0.64, h * 0.76); gg.stroke(); }
    });
    faceT.anisotropy = 4;
    const face = flat(new THREE.Mesh(big ? bigFaceGeo : faceGeo, new THREE.MeshStandardMaterial({ map:faceT, roughness:0.75 })), hh + 0.002);
    face.receiveShadow = true; g.add(face);
    /* 정복한 과정 — 작은 금 별 핀 */
    if(c.state === 'done'){
      const star = new THREE.Shape(); for(let q = 0; q < 10; q++){ const a = Math.PI / 2 + q * Math.PI / 5, rr = q % 2 ? 0.06 : 0.15; const px = Math.cos(a) * rr, py = Math.sin(a) * rr; q ? star.lineTo(px, py) : star.moveTo(px, py); }
      const sm = new THREE.Mesh(new THREE.ExtrudeGeometry(star, { depth:0.04, bevelEnabled:false }), lq('#c3362c'));
      sm.rotation.x = -Math.PI / 2; sm.position.set(0.34, hh + 0.012, 0.26); g.add(sm);
    }
    if(c.boss){ /* 마무리 관문 — 작은 금관 */
      const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.1, 16, 1, true), goldM); crown.position.set(0, hh + 0.12, -0.52); g.add(crown);
      for(let q = 0; q < 5; q++){ const a = q / 5 * TAU; const sp = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.08, 6), goldM); sp.position.set(Math.cos(a) * 0.13, hh + 0.2, -0.52 + Math.sin(a) * 0.13); g.add(sp); }
    }
    cast(g); face.castShadow = false;
    scene.add(g);
    stones.push({ g, hh, r:big ? 0.52 : 0.42, lift:0, x, z });
  });

  /* 지금 여기 빛 */
  const nowS = stones[curI];
  /* 지금 여기 — 라벤더→민트→하늘로 천천히 도는 무지개 후광(밝은 땅 위라 더하기 섞기 대신 보통 섞기) */
  const nowGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map:glowTex, color:'#b9a7ff', transparent:true, opacity:0.6, depthWrite:false }));
  nowGlow.scale.set(1.9, 1.9, 1); nowGlow.position.set(nowS.x, 0.12, nowS.z); nowGlow.renderOrder = 3; scene.add(nowGlow);

  /* ---- 아이 말: 놋쇠 말(char3d 가 오면 바꾼다) ---- */
  const pawnSpot = { x:nowS.x - 0.38, z:nowS.z - 0.6 };
  const pawnGrp = new THREE.Group(); pawnGrp.position.set(pawnSpot.x, 0.02, pawnSpot.z); scene.add(pawnGrp);
  const tokenGeo = new THREE.LatheGeometry([[0, 0], [0.2, 0], [0.2, 0.05], [0.1, 0.13], [0.085, 0.36], [0.14, 0.43], [0.1, 0.5], [0, 0.56]].map(([x, y]) => new THREE.Vector2(x, y)), 24);
  const token = new THREE.Mesh(tokenGeo, goldM); const head = new THREE.Mesh(new THREE.SphereGeometry(0.13, 20, 14), goldM); head.position.y = 0.64;
  const brassPawn = new THREE.Group(); brassPawn.add(token, head); cast(brassPawn); pawnGrp.add(brassPawn);
  const pawnShadow = blob(pawnSpot.x, pawnSpot.z, 0.9, 0.55, 0.7);
  let pawnH = 0.8, kidObj = null;
  const setPawn = c => {
    if(!c || !c.object) return;
    pawnGrp.remove(brassPawn);
    kidObj = c.object; kidObj.rotation.y = 0.2; cast(kidObj); pawnGrp.add(kidObj); pawnH = 1.47;
    /* 작은 나무 받침 */
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.33, 0.07, 28), woodMat('#9a6a3c', [80, 45, 20])); base.position.y = 0.035; cast(base); pawnGrp.add(base);
    kidObj.position.y = 0.07;
  };

  /* ---- 다음 목표 깃발 ---- */
  let flag = null, flagTopP = null;
  if(goalI >= 0){
    const gs = stones[goalI];
    const fx = gs.x + 0.12, fz = gs.z - 0.55;
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.034, 1.05, 10), brass); pole.position.set(fx, 0.54, fz); cast(pole); scene.add(pole);
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 10), goldM); knob.position.set(fx, 1.08, fz); scene.add(knob);
    const fg = new THREE.PlaneGeometry(0.56, 0.34, 10, 1); fg.translate(0.28, 0, 0);
    const flagT = canvasTex(256, 160, (gg, w, h) => { gg.fillStyle = '#c3362c'; gg.fillRect(0, 0, w, h);
      for(let q = 0; q < 600; q++){ gg.fillStyle = `rgba(0,0,0,${rnd() * 0.08})`; gg.fillRect(rnd() * w, rnd() * h, 1, 2 + rnd() * 4); }
      gg.fillStyle = '#f7da86'; gg.textBaseline = 'middle'; mathText(gg, String(courses[goalI].num), w / 2, h / 2 + 6, 104, { align:'center' }); });
    flag = new THREE.Mesh(fg, new THREE.MeshStandardMaterial({ map:flagT, roughness:0.7, side:THREE.DoubleSide }));
    flag.position.set(fx + 0.03, 0.87, fz); flag.castShadow = true; scene.add(flag);
    blob(fx, fz, 0.35, 0.25, 0.6);
    flagTopP = new THREE.Vector3(fx, 1.2, fz);
    flag.userData.x0 = Float32Array.from({ length:fg.attributes.position.count }, (_, i) => fg.attributes.position.getX(i));
  }

  /* ---- 연산 점검 도장 ---- */
  const stampHandle = woodMat('#8a5a30', [70, 38, 16]);
  checks.forEach(ch => {
    const g = new THREE.Group(); g.position.set(ch.x, 0.02, ch.z);
    const standing = ch.state !== 'done';
    const base = new THREE.Mesh(rbox(0.3, 0.1, 0.3, 0.04), lq(ch.state === 'ahead' ? '#8e6b5a' : '#a3291f'));
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.16, 14), stampHandle); neck.position.y = 0.18;
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), stampHandle); knob.position.y = 0.3;
    const ringB = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 8, 20), brass); ringB.rotation.x = Math.PI / 2; ringB.position.y = 0.11;
    const st = new THREE.Group(); st.add(base, neck, knob, ringB);
    if(!standing){ st.rotation.z = Math.PI / 2; st.position.set(-0.1, 0.1, 0); }
    g.add(st); cast(g);
    [base, neck, knob].forEach(m => { m.userData = { checkNum:ch.num }; hits.push(m); });
    scene.add(g);
    if(ch.state === 'due'){ const gl = new THREE.Sprite(new THREE.SpriteMaterial({ map:glowTex, color:'#ff9a6a', transparent:true, opacity:0.45, depthWrite:false, blending:THREE.AdditiveBlending }));
      gl.scale.set(1, 1, 1); gl.position.set(ch.x, 0.15, ch.z); scene.add(gl); ch.glow = gl; }
  });

  /* ---- 구간 랜드마크 ---- */
  const L = makeLandmarks(k, { cast, lq, goldM, brass, glowTex });
  const marks = [];
  lay.runs.forEach((run, ri) => {
    if(run.again) return;
    const fn = L[run.band] || L._tree;
    /* 구간 안에서 길이 가까이(아래쪽) 도는 자리의 먼 쪽(위쪽)에 세운다 — 앞의 돌을 가리지 않게 */
    let bx = (run.x0 + run.x1) / 2, best = -1e9;
    for(let x = run.x0 + 0.5; x <= run.x1 - 0.5; x += 0.1){ const sc = roadZ(x) - Math.abs(x - (run.x0 + run.x1) / 2) * 0.15; if(sc > best){ best = sc; bx = x; } }
    let bz = Math.max(Math.min(roadZ(bx) - 1.25, -1.35), -1.95);
    if(run.band === 'level2' && river){ bz = -1.75; bx = river.at(bz); }
    if(run.band === 'middle1' && lake){ bx = lake.x - lake.rx - 0.15; bz = Math.max(-1.95, lake.z - 0.1); }
    const o = fn(courses[run.from].band, col(run.band));
    o.position.set(bx, 0.02, bz);
    scene.add(o); marks.push([bx, bz]);
    blob(bx, bz + 0.05, 1.3, 0.8, 0.45);
  });

  /* ---- 나무·꽃·덤불 — 지역마다 다르게, 길·돌·도장·랜드마크·물을 피해서 ---- */
  const roundG = mergeG([new THREE.IcosahedronGeometry(0.3, 1).scale(1, 0.95, 1).translate(0, 0.62, 0), new THREE.IcosahedronGeometry(0.22, 1).translate(0.14, 0.78, 0.05), new THREE.IcosahedronGeometry(0.2, 1).translate(-0.13, 0.74, -0.04)]);
  const pineG = mergeG([new THREE.ConeGeometry(0.3, 0.5, 8).translate(0, 0.5, 0), new THREE.ConeGeometry(0.23, 0.42, 8).translate(0, 0.75, 0), new THREE.ConeGeometry(0.15, 0.34, 8).translate(0, 0.98, 0)]);
  const slimG = new THREE.ConeGeometry(0.13, 0.95, 10).translate(0, 0.62, 0);
  const trunkG = new THREE.CylinderGeometry(0.035, 0.05, 0.4, 6).translate(0, 0.2, 0);
  const bushG = new THREE.IcosahedronGeometry(0.16, 1).scale(1.3, 0.75, 1.1).translate(0, 0.09, 0);
  const rockG = new THREE.DodecahedronGeometry(0.13, 0).scale(1.2, 0.7, 1).translate(0, 0.05, 0);
  const flowerG = new THREE.IcosahedronGeometry(0.035, 0).translate(0, 0.07, 0);
  const crystalG = new THREE.OctahedronGeometry(0.09, 0).scale(1, 2, 1).translate(0, 0.17, 0);
  const leafM = new THREE.MeshStandardMaterial({ color:'#ffffff', roughness:0.85, flatShading:true });
  const barkM = new THREE.MeshStandardMaterial({ color:'#9b7552', roughness:0.9 });
  const rockM = new THREE.MeshStandardMaterial({ color:'#cfc9c0', roughness:0.9, flatShading:true });
  const flowerM = new THREE.MeshStandardMaterial({ color:'#ffffff', roughness:0.6, emissive:'#ffffff', emissiveIntensity:0.12 });
  const crystalM = new THREE.MeshPhysicalMaterial({ color:'#efeaff', roughness:0.12, metalness:0.05, iridescence:1, iridescenceIOR:1.35, emissive:'#b9a7ff', emissiveIntensity:0.45, clearcoat:1 });
  const P = { round:[], pine:[], slim:[], trunk:[], bush:[], rock:[], flower:[], crystal:[] };
  const RECIPE = {
    level0:   { far:[['round', 0.25]], near:[['flower', 3.2], ['bush', 0.25]] },
    level1:   { far:[['round', 1.2]], near:[['bush', 0.5], ['flower', 0.9]] },
    level2:   { far:[['round', 0.8], ['pine', 0.3]], near:[['bush', 0.5], ['rock', 0.3]] },
    level3:   { far:[['round', 0.45]], near:[['bush', 0.55], ['rock', 0.3], ['flower', 0.5]] },
    challenge:{ far:[['pine', 0.9]], near:[['rock', 0.6], ['bush', 0.25]] },
    middle1:  { far:[['pine', 0.55], ['round', 0.4]], near:[['bush', 0.4], ['rock', 0.3]] },
    middle2:  { far:[['round', 0.4]], near:[['bush', 0.45], ['flower', 0.6]] },
    middle3:  { far:[['pine', 1.0]], near:[['rock', 0.7]] },
    highmath1:{ far:[['slim', 0.8]], near:[['bush', 0.45]] },
    highmath2:{ far:[['slim', 0.5]], near:[['bush', 0.3]] },
    algebra:  { far:[['slim', 0.5]], near:[['crystal', 0.8], ['bush', 0.2]] },
    calculus1:{ far:[['slim', 0.35]], near:[['crystal', 1.1]] },
  };
  const clear = (x, z, pad) => offRoad(x, z, 0.72 + pad)
    && !courses.some((c, i) => (lay.pos[i] - x) ** 2 + (roadZ(lay.pos[i]) - z) ** 2 < (0.75 + pad) ** 2)
    && !checks.some(ch => (ch.x - x) ** 2 + (ch.z - z) ** 2 < (0.55 + pad) ** 2)
    && !marks.some(([mx, mz]) => (mx - x) ** 2 + (mz - z) ** 2 < (0.85 + pad) ** 2)
    && !(river && Math.abs(x - river.at(z)) < river.w / 2 + 0.12 + pad)
    && !(lake && ((x - lake.x) / (lake.rx + 0.2)) ** 2 + ((z - lake.z) / (lake.rz + 0.2)) ** 2 < 1)
    && !(Math.abs(x - lay.pos[curI] + 0.38) < 0.55 && Math.abs(z - roadZ(lay.pos[curI]) + 0.6) < 0.55);
  lay.runs.forEach(run => {
    const rc = RECIPE[run.band] || RECIPE.level0, w = run.x1 - run.x0;
    [['far', -2.45, -0.4], ['near', 0.4, 3.4]].forEach(([side, za, zb]) => (rc[side] || []).forEach(([kind, dens]) => {
      const n = Math.round(w * dens * (side === 'far' ? 1.1 : 1.4));
      for(let i = 0; i < n; i++){
        const x = run.x0 + 0.1 + rnd() * (w - 0.2), rz = roadZ(x);
        const z = side === 'far' ? Math.max(za, rz - 0.8 - rnd() * 1.7) : Math.min(zb, rz + 0.8 + rnd() * 2.2);
        if(!clear(x, z, kind === 'flower' ? -0.1 : 0.02)) continue;
        const s = kind === 'flower' ? 0.8 + rnd() * 0.6 : 0.75 + rnd() * 0.45;
        P[kind].push([x, z, s, rnd(), run.band]);
        if(kind === 'round' || kind === 'slim') P.trunk.push([x, z, s, 0, run.band]);
        if(kind === 'flower'){ for(let q = 0; q < 3; q++) P.flower.push([x + (rnd() - 0.5) * 0.18, z + (rnd() - 0.5) * 0.14, s * (0.7 + rnd() * 0.5), rnd(), run.band]); }
      }
    }));
  });
  const LEAF = { round:['#77b862', '#8cc56d', '#69a95a', '#9ccf78'], pine:['#4f8f5c', '#5c9c66', '#467f55'], slim:['#6a9f74', '#7fb087', '#5d8f6a'],
    bush:['#86c06a', '#9ccb7a', '#79b366'], rock:['#d8d2c8', '#cbc6d2', '#e2dccf'], flower:['#ffffff', '#ffc1d4', '#fff0a0', '#dccdff', '#ffc6a2'],
    crystal:['#efeaff', '#e2fbf4', '#e6f0ff'] };
  const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _s = new THREE.Vector3(), _p = new THREE.Vector3(), _c = new THREE.Color();
  const inst = (geo, mat, list, colors, noShadow) => {
    if(!list.length) return null;
    const im = new THREE.InstancedMesh(geo, mat, list.length);
    list.forEach(([x, z, s, rr, band], i) => {
      _e.set(0, rr * TAU, 0); _q.setFromEuler(_e); _s.set(s, s * (geo === slimG ? 0.9 + rr * 0.4 : 1), s); _p.set(x, 0.02, z);
      _m4.compose(_p, _q, _s); im.setMatrixAt(i, _m4);
      if(colors){ _c.set(colors[Math.floor(rr * colors.length) % colors.length]);
        /* 늦은 지역의 나무는 저녁빛으로 살짝 */
        if(band === 'algebra' || band === 'calculus1') _c.lerp(C('#b9a7d8'), 0.25);
        else if(band === 'middle3') _c.lerp(C('#dfe8f0'), 0.25);
        im.setColorAt(i, _c); }
    });
    im.castShadow = !noShadow; im.receiveShadow = true; scene.add(im); return im;
  };
  inst(roundG, leafM, P.round, LEAF.round); inst(pineG, leafM.clone(), P.pine, LEAF.pine); inst(slimG, leafM.clone(), P.slim, LEAF.slim);
  inst(trunkG, barkM, P.trunk, null); inst(bushG, leafM.clone(), P.bush, LEAF.bush); inst(rockG, rockM, P.rock, LEAF.rock);
  inst(flowerG, flowerM, P.flower, LEAF.flower, true); inst(crystalG, crystalM, P.crystal, LEAF.crystal);

  /* 개울 위 나무 다리(길이 건너는 자리) */
  if(river){
    let zc = roadZ(river.x); for(let it = 0; it < 4; it++) zc = roadZ(river.at(zc));
    const xc = river.at(zc), ang = Math.atan2(roadZ(xc + 0.05) - roadZ(xc - 0.05), 0.1);
    const bg = new THREE.Group(); bg.position.set(xc, 0.02, zc); bg.rotation.y = -ang;
    const plank = woodMat('#d7b489', [150, 110, 70]);
    for(let q = -4; q <= 4; q++){ const pl = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.04, 0.52), plank); pl.position.set(q * 0.11, 0.05 + Math.cos(q / 4 * 1.2) * 0.04, 0); pl.rotation.y = (rnd() - 0.5) * 0.06; bg.add(pl); }
    [-0.28, 0.28].forEach(sz => { const rail = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.035, 0.035), plank); rail.position.set(0, 0.24, sz); bg.add(rail);
      [-0.45, 0, 0.45].forEach(px => { const post = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.22, 6), plank); post.position.set(px, 0.14, sz); bg.add(post); }); });
    cast(bg); scene.add(bg);
  }

  /* ---- 지평선 — 언덕·숲·산·구름 섬·탑 그림자. 땅이 끝나는 자리(setHorizon)를 따라 앞뒤로 옮긴다 ---- */
  const hzn = new THREE.Group(); scene.add(hzn);
  const floaters = [];
  {
    const moundG = new THREE.SphereGeometry(1, 24, 12, 0, TAU, 0, Math.PI / 2);
    const coneG = new THREE.ConeGeometry(1, 1, 7);
    const hTrees = [], hPines = [];
    lay.runs.forEach(run => {
      const key = run.band, bi = BIOME[key] || BIO_DEF, w = run.x1 - run.x0;
      const mc = C(bi.g1).lerp(C(bi.top), 0.18);
      const mm = new THREE.MeshStandardMaterial({ color:mc, roughness:1 });
      const n = Math.max(2, Math.round(w / 1.5));
      const hilly = key === 'level3' ? 0.55 : key === 'challenge' || key === 'middle3' ? 0.4 : 0.32;
      for(let i = 0; i < n; i++){
        const x = run.x0 + (i + 0.5) / n * w + (rnd() - 0.5) * 0.6;
        const m = new THREE.Mesh(moundG, mm); m.scale.set(1.0 + rnd() * 0.9, hilly * (0.6 + rnd() * 0.6), 0.9); m.position.set(x, -0.02, 0.2 + rnd() * 0.5); hzn.add(m);
        if(/^(level1|level2|middle1)$/.test(key)) for(let q = 0; q < 4; q++) hTrees.push([x + (rnd() - 0.5) * 1.4, 0.35 + rnd() * 0.4, 0.55 + rnd() * 0.4, key]);
        if(/^(challenge|middle3)$/.test(key)) for(let q = 0; q < 3; q++) hPines.push([x + (rnd() - 0.5) * 1.4, 0.3 + rnd() * 0.3, 0.6 + rnd() * 0.3, key]);
      }
      /* 산 — 탑이 선 산(경시의 탑) · 눈 덮인 산맥(중3) */
      if(key === 'challenge' || key === 'middle3'){
        const rock = new THREE.MeshStandardMaterial({ color:C('#bcc4dc').lerp(C(bi.top), 0.2), roughness:0.95, flatShading:true });
        const snow = new THREE.MeshStandardMaterial({ color:'#ffffff', roughness:0.8, flatShading:true });
        const np = key === 'middle3' ? Math.max(3, Math.round(w / 1.3)) : 2;
        for(let i = 0; i < np; i++){
          const x = run.x0 + (i + 0.5) / np * w + (rnd() - 0.5) * 0.5, hh = (key === 'middle3' ? 0.85 : 1.1) + rnd() * 0.45, rr = 0.7 + rnd() * 0.4;
          const pk = new THREE.Mesh(coneG, rock); pk.scale.set(rr, hh, rr * 0.8); pk.position.set(x, hh / 2 - 0.05, -0.2 - rnd() * 0.3); pk.rotation.y = rnd() * TAU; hzn.add(pk);
          const cap = new THREE.Mesh(coneG, snow); cap.scale.set(rr * 0.36, hh * 0.34, rr * 0.3); cap.position.set(x, hh - 0.05 - hh * 0.17 + 0.005, pk.position.z); cap.rotation.y = pk.rotation.y; hzn.add(cap);
        }
      }
      /* 구름 위 섬(중2) — 천천히 오르내린다 */
      if(key === 'middle2'){
        const rockM2 = new THREE.MeshStandardMaterial({ color:'#d9d2e6', roughness:0.9, flatShading:true });
        const grassM = new THREE.MeshStandardMaterial({ color:'#b5dca8', roughness:0.9 });
        const cloudM = new THREE.MeshStandardMaterial({ color:'#ffffff', roughness:1, emissive:'#ffffff', emissiveIntensity:0.25 });
        const ni = Math.max(2, Math.round(w / 2.2));
        for(let i = 0; i < ni; i++){
          const isl = new THREE.Group(), s = 0.55 + rnd() * 0.35;
          const base = new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.7, 7), rockM2); base.rotation.x = Math.PI; base.position.y = -0.35; isl.add(base);
          const top = new THREE.Mesh(new THREE.CylinderGeometry(0.57, 0.55, 0.08, 14), grassM); isl.add(top);
          if(i % 2 === 0){ const tw = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.55, 10), new THREE.MeshStandardMaterial({ color:'#fbf6ec', roughness:0.8 })); tw.position.y = 0.3; isl.add(tw);
            const rf = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.22, 10), new THREE.MeshStandardMaterial({ color:col(key), roughness:0.6 })); rf.position.y = 0.68; isl.add(rf); }
          else { const tr2 = new THREE.Mesh(roundG, new THREE.MeshStandardMaterial({ color:'#8cc56d', roughness:0.85, flatShading:true })); tr2.scale.setScalar(0.6); isl.add(tr2); }
          for(let q = 0; q < 4; q++){ const cl = new THREE.Mesh(new THREE.IcosahedronGeometry(0.16 + rnd() * 0.1, 1), cloudM); cl.position.set((q - 1.5) * 0.28, -0.12 - rnd() * 0.08, 0.25 + rnd() * 0.1); isl.add(cl); }
          const y0 = 0.8 + rnd() * 0.3;
          isl.scale.setScalar(s); isl.position.set(run.x0 + (i + 0.5) / ni * w, y0, 0.1 + rnd() * 0.4); hzn.add(isl);
          floaters.push({ o:isl, y0, ph:rnd() * TAU });
        }
      }
      /* 먼 탑 그림자(고등 구간) · 천문대(미적분) */
      if(/^(highmath1|algebra)$/.test(key)){
        const tm = new THREE.MeshStandardMaterial({ color:C('#f3eef8').lerp(C(bi.top), 0.15), roughness:0.8 });
        const nt = key === 'algebra' ? 2 : 1;
        for(let i = 0; i < nt; i++){ const x = run.x0 + (i + 0.6) / (nt + 0.2) * w;
          const t1 = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 1.5, 12), tm); t1.position.set(x, 0.72, 0.35); hzn.add(t1);
          const t2 = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.45, 12), new THREE.MeshStandardMaterial({ color:C(col(key)).lerp(C('#ffffff'), 0.35), roughness:0.6 })); t2.position.set(x, 1.68, 0.35); hzn.add(t2);
          if(key === 'algebra'){ const orb = new THREE.Sprite(new THREE.SpriteMaterial({ map:glowTex, color:'#e4dcff', transparent:true, opacity:0.9, depthWrite:false, fog:false }));
            orb.scale.set(0.7, 0.7, 1); orb.position.set(x, 2.02, 0.35); hzn.add(orb); floaters.push({ o:orb, glow:true, ph:rnd() * TAU }); } }
      }
      if(key === 'calculus1'){
        const x = (run.x0 + run.x1) / 2 + w * 0.2;
        const hill = new THREE.Mesh(moundG, new THREE.MeshStandardMaterial({ color:C(bi.g1).lerp(C(bi.top), 0.3), roughness:1 })); hill.scale.set(1.6, 0.9, 1); hill.position.set(x, -0.02, 0.2); hzn.add(hill);
        const wall = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.35, 16), new THREE.MeshStandardMaterial({ color:'#f7f3fb', roughness:0.8 })); wall.position.set(x, 1.02, 0.25); hzn.add(wall);
        const dome = new THREE.Mesh(new THREE.SphereGeometry(0.3, 18, 10, 0, TAU, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color:'#dfe3f2', roughness:0.35, metalness:0.3 })); dome.position.set(x, 1.2, 0.25); hzn.add(dome);
        const scope = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.42, 10), new THREE.MeshStandardMaterial({ color:'#6a74a8', roughness:0.4, metalness:0.5 })); scope.position.set(x + 0.12, 1.42, 0.3); scope.rotation.z = -0.8; hzn.add(scope);
      }
    });
    const tm = new THREE.MeshStandardMaterial({ color:'#ffffff', roughness:0.9, flatShading:true });
    [[hTrees, roundG, ['#79b060', '#8dbd6e', '#6fa75d']], [hPines, pineG, ['#5b9467', '#6aa274']]].forEach(([list, geo, cs]) => {
      if(!list.length) return;
      const im = new THREE.InstancedMesh(geo, tm, list.length);
      list.forEach(([x, y, zz, key], i) => { const s = 0.7 + rnd() * 0.4; _p.set(x, y - 0.25, zz); _s.set(s, s, s); _q.identity(); _m4.compose(_p, _q, _s); im.setMatrixAt(i, _m4);
        _c.set(cs[i % cs.length]).lerp(C((BIOME[key] || BIO_DEF).top), 0.12); im.setColorAt(i, _c); });
      hzn.add(im);
    });
  }

  /* ---- 별가루 — 길 위에 떠다니는 은은한 빛(라벤더·민트·하늘) ---- */
  const dust = [];
  {
    const cols = ['#b9a7ff', '#8fe3d2', '#9cc8ff'];
    cols.forEach((cc, ci) => {
      const n = Math.round((lay.x1 - lay.x0) * 1.3), pos = new Float32Array(n * 3), base = [];
      for(let i = 0; i < n; i++){ const x = lay.x0 + rnd() * (lay.x1 - lay.x0), z = roadZ(x) + (rnd() - 0.5) * 2.6, y = 0.25 + rnd() * 1.1;
        pos.set([x, y, z], i * 3); base.push([x, y, z, rnd() * TAU]); }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const pts = new THREE.Points(g, new THREE.PointsMaterial({ map:glowTex, color:cc, size:0.13, sizeAttenuation:true, transparent:true, opacity:0.85, depthWrite:false }));
      pts.renderOrder = 4; scene.add(pts); dust.push({ pts, base, ph:ci * 2.1 });
    });
  }

  /* ---- 애니메이션 ---- */
  let hot = -1;
  const setHot = i => { hot = i; };
  function animate(t, dt){
    stones.forEach((s, i) => { const want = i === hot ? 0.08 : 0; if(Math.abs(s.lift - want) > 0.001){ s.lift += (want - s.lift) * Math.min(1, dt * 12); s.g.position.y = 0.02 + s.lift; } });
    nowGlow.material.opacity = 0.5 + Math.sin(t * 2.2) * 0.12;
    const sc = 1.9 + Math.sin(t * 2.2) * 0.12; nowGlow.scale.set(sc, sc, 1);
    { const u = (t * 0.08) % 1, i3 = Math.floor(u * 3), f = sstep(u * 3 - i3); nowGlow.material.color.copy(IRI[i3]).lerp(IRI[(i3 + 1) % 3], f); }
    floaters.forEach(f => { if(f.glow) f.o.material.opacity = 0.7 + Math.sin(t * 1.7 + f.ph) * 0.2; else f.o.position.y = f.y0 + Math.sin(t * 0.7 + f.ph) * 0.06; });
    dust.forEach(d => { const a = d.pts.geometry.attributes.position;
      d.base.forEach(([x, y, z, ph], i) => a.setXYZ(i, x + Math.sin(t * 0.3 + ph) * 0.08, y + Math.sin(t * 0.5 + ph * 1.7) * 0.12, z));
      a.needsUpdate = true; d.pts.material.opacity = 0.62 + Math.sin(t * 0.9 + d.ph) * 0.25; });
    if(flag){ const fp = flag.geometry.attributes.position, x0 = flag.userData.x0; for(let i = 0; i < fp.count; i++){ const x = x0[i]; fp.setZ(i, Math.sin(x * 9 - t * 4) * 0.045 * x / 0.56); } fp.needsUpdate = true; }
    checks.forEach(ch => { if(ch.glow) ch.glow.material.opacity = 0.3 + Math.sin(t * 2.6 + ch.num) * 0.15; });
    if(!kidObj) brassPawn.position.y = Math.abs(Math.sin(t * 1.6)) * 0.03;
    return true;
  }
  follow(0);
  /* 지평선 자리 — relayout 이 화면 비율에 맞춰 정한다. 먼 땅은 여기서 잘리고 그 너머가 하늘이다 */
  let zHor = -6;
  const setHorizon = (zf, camD, visW) => {
    zHor = zf; horizon.constant = -zf;
    mist.position.z = zf + 0.03;
    hzn.position.z = zf; hzn.scale.setScalar(clamp(camD / 12, 0.62, 1.15));
    scene.fog.near = camD * 1.35; scene.fog.far = camD * 3.6;
    skyRep = clamp(visW / SKW, 0.02, 1);
  };

  return {
    hits, checks, follow, animate, setHot, setPawn, setHorizon, horizonZ:() => zHor,
    stoneAt:i => { const s = stones[i]; return new THREE.Vector3(s.x, s.g.position.y + s.hh, s.z); },
    stoneR:i => stones[i].r,
    pawnTop:() => new THREE.Vector3(pawnSpot.x, pawnH + 0.15, pawnSpot.z),
    pawnFoot:() => new THREE.Vector3(pawnSpot.x, 0.05, pawnSpot.z),
    flagTop:() => flagTopP,
    pos:lay.pos,
  };
}

/* ---------- 구간 랜드마크(작은 탁상 소품) — 등급 키마다 하나 ---------- */
function makeLandmarks(k, h){
  const { rbox, woodMat, metal, lacquer, faceTex, canvasTex, mathText, rnd } = k;
  const { cast, lq, goldM, brass } = h;
  const TAU = Math.PI * 2;
  const G = () => new THREE.Group();
  const M = {};
  /* 나무(원뿔 두 겹) */
  M._tree = (_, __, s) => { s = s || 0.8; const g = G();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.05 * s, 0.07 * s, 0.35 * s, 8), woodMat('#7a4a26', [60, 30, 12])); trunk.position.y = 0.17 * s; g.add(trunk);
    const leaf = lq('#6aa85a');
    [[0.38, 0.55, 0.48], [0.3, 0.45, 0.75]].forEach(([rr, hh, y]) => { const c = new THREE.Mesh(new THREE.ConeGeometry(rr * s, hh * s, 10), leaf); c.position.y = y * s; g.add(c); });
    return cast(g); };
  /* 수의 나라 — 숫자 나무 블록 쌓기 */
  M.level0 = () => { const g = G();
    const side = woodMat('#e3c48e', [150, 105, 55]);
    [['1', -0.28, 0, 0.1], ['2', 0.24, 0.05, -0.15], ['3', -0.02, 0.3, 0.2]].forEach(([n, x, y, rot], i) => {
      const b = new THREE.Mesh(rbox(0.42, 0.36, 0.42, 0.05), side); b.position.set(x, y, i === 2 ? -0.02 : 0); b.rotation.y = rot; g.add(b);
      const top = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.36), new THREE.MeshStandardMaterial({ map:faceTex(n, { bg:'#f5e6c4', color:['#c3362c', '#2f6fb0', '#3f8f5a'][i], grain:true }), roughness:0.6 }));
      top.rotation.x = -Math.PI / 2; top.position.set(x, y + 0.362, i === 2 ? -0.02 : 0); top.rotation.z = rot; g.add(top); });
    return cast(g); };
  /* 계산의 새싹 — 화분의 새싹 */
  M.level1 = (_, c) => { const g = G();
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.19, 0.32, 20), lq('#b8643a')); pot.position.y = 0.16; g.add(pot);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.035, 8, 22), lq('#a25530')); rim.rotation.x = Math.PI / 2; rim.position.y = 0.32; g.add(rim);
    const soil = new THREE.Mesh(new THREE.CircleGeometry(0.24, 20), new THREE.MeshStandardMaterial({ color:'#4a3020', roughness:1 })); soil.rotation.x = -Math.PI / 2; soil.position.y = 0.3; g.add(soil);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.4, 8), lq('#5f9a45')); stem.position.y = 0.5; g.add(stem);
    const leafG = new THREE.SphereGeometry(0.16, 16, 10); leafG.scale(1, 0.25, 0.55);
    [-1, 1].forEach(sx => { const l = new THREE.Mesh(leafG, lq('#6fa85b')); l.position.set(sx * 0.14, 0.7, 0); l.rotation.z = sx * 0.5; g.add(l); });
    return cast(g); };
  /* 계산의 도약 — 개울 위 나무 아치 다리 */
  M.level2 = (_, c) => { const g = G();
    const water = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 1.2), new THREE.MeshStandardMaterial({ color:'#6f9fc0', roughness:0.25, metalness:0.1, transparent:true, opacity:0.85 })); water.rotation.x = -Math.PI / 2; water.position.y = 0.012; g.add(water);
    const arc = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.05, 8, 24, Math.PI), woodMat('#9a6a3c', [80, 45, 20])); g.add(arc);
    const arc2 = arc.clone(); arc.position.z = -0.14; arc2.position.z = 0.14; g.add(arc2);
    for(let q = 1; q < 10; q++){ const a = q / 10 * Math.PI; const pl = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.03, 0.36), woodMat('#b8864e', [100, 60, 25])); pl.position.set(Math.cos(a) * 0.5, Math.sin(a) * 0.5 + 0.03, 0); pl.rotation.z = a - Math.PI / 2; g.add(pl); }
    g.rotation.y = 0.1;
    return cast(g); };
  /* 계산의 정복 — 작은 성 */
  M.level3 = (_, c) => { const g = G();
    const stone = new THREE.MeshStandardMaterial({ map:canvasTex(128, 128, (gg, w, hh) => { gg.fillStyle = '#cfc2a6'; gg.fillRect(0, 0, w, hh); gg.strokeStyle = 'rgba(90,70,45,.45)'; gg.lineWidth = 2;
      for(let y = 0; y < hh; y += 16){ gg.beginPath(); gg.moveTo(0, y); gg.lineTo(w, y); gg.stroke(); for(let x = (y / 16) % 2 ? 0 : 16; x < w; x += 32){ gg.beginPath(); gg.moveTo(x, y); gg.lineTo(x, y + 16); gg.stroke(); } } }), roughness:0.85 });
    const wall = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.4, 0.28), stone); wall.position.y = 0.2; g.add(wall);
    for(let q = 0; q < 5; q++){ const m = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.28), stone); m.position.set(-0.36 + q * 0.18, 0.44, 0); g.add(m); }
    const roof = lq(c || '#0E2C57');
    [-0.5, 0.5].forEach(x => { const t = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.7, 16), stone); t.position.set(x, 0.35, 0); g.add(t);
      const r2 = new THREE.Mesh(new THREE.ConeGeometry(0.21, 0.32, 16), roof); r2.position.set(x, 0.86, 0); g.add(r2); });
    const door = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.22), new THREE.MeshStandardMaterial({ color:'#4a2c14', roughness:0.8 })); door.position.set(0, 0.11, 0.141); g.add(door);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 6), brass); pole.position.set(0.5, 1.15, 0); g.add(pole);
    const pen = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.1), new THREE.MeshStandardMaterial({ color:'#c3362c', side:THREE.DoubleSide })); pen.position.set(0.59, 1.24, 0); g.add(pen);
    return cast(g); };
  /* 경시의 탑 — 높은 탑 + 금별 */
  M.challenge = (_, c) => { const g = G();
    const body = lq('#e6dcc8'), trim = lq(c || '#3d1a5c');
    [[0.3, 0.34, 0.5, 0.25], [0.24, 0.28, 0.45, 0.72], [0.18, 0.22, 0.4, 1.14]].forEach(([a, b, hh, y]) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(a, b, hh, 18), body); m.position.y = y; g.add(m);
      const band = new THREE.Mesh(new THREE.TorusGeometry(b - 0.01, 0.025, 6, 22), trim); band.rotation.x = Math.PI / 2; band.position.y = y + hh / 2; g.add(band); });
    const roof = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.45, 18), trim); roof.position.y = 1.56; g.add(roof);
    const star = new THREE.Shape(); for(let q = 0; q < 10; q++){ const a = Math.PI / 2 + q * Math.PI / 5, rr = q % 2 ? 0.045 : 0.1; const px = Math.cos(a) * rr, py = Math.sin(a) * rr; q ? star.lineTo(px, py) : star.moveTo(px, py); }
    const sm = new THREE.Mesh(new THREE.ExtrudeGeometry(star, { depth:0.025, bevelEnabled:false }), goldM); sm.position.set(0, 1.86, 0); g.add(sm);
    return cast(g); };
  /* 중학교 — v2 에서 책상 소품(교과서 더미)을 세상의 장소로 바꿨다 */
  /* 중1 · 음수의 동굴 — 호숫가 바위 언덕과 동굴 입구 */
  M.middle1 = () => { const g = G();
    const rockM = new THREE.MeshStandardMaterial({ color:'#cfc8d6', roughness:0.95, flatShading:true });
    const hill = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55, 1), rockM); hill.scale.set(1.2, 0.8, 0.9); hill.position.y = 0.2; g.add(hill);
    const cave = new THREE.Mesh(new THREE.CircleGeometry(0.2, 18, 0, Math.PI), new THREE.MeshStandardMaterial({ color:'#3a3f5c', roughness:1 })); cave.position.set(0.05, 0.04, 0.47); cave.rotation.y = 0.05; g.add(cave);
    const moss = new THREE.Mesh(new THREE.IcosahedronGeometry(0.3, 1), new THREE.MeshStandardMaterial({ color:'#9fd0a0', roughness:0.9, flatShading:true })); moss.scale.set(1.3, 0.35, 1); moss.position.set(-0.1, 0.62, -0.05); g.add(moss);
    return cast(g); };
  /* 중2 · 식의 탑 — 쌓아 올린 돌 블록 탑 */
  M.middle2 = (_, c) => { const g = G();
    const wall = new THREE.MeshStandardMaterial({ color:'#f6f1e8', roughness:0.85 });
    [[0.62, 0.34, 0.17], [0.48, 0.34, 0.51], [0.36, 0.34, 0.85]].forEach(([wd, hh, y], i) => { const b = new THREE.Mesh(rbox(wd, hh, wd, 0.04), wall); b.position.y = y - hh / 2; b.rotation.y = i * 0.35; g.add(b); });
    const roof = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.36, 4), lq(c || '#4f6f9c')); roof.position.y = 1.2; roof.rotation.y = Math.PI / 4 + 0.7; g.add(roof);
    const win = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.14), new THREE.MeshStandardMaterial({ color:'#ffe7a8', emissive:'#ffd27a', emissiveIntensity:0.7 })); win.position.set(0, 0.6, 0.245); g.add(win);
    return cast(g); };
  /* 중3 · 근호의 산맥 — 눈 모자를 쓴 바위 봉우리와 작은 깃발 */
  M.middle3 = (_, c) => { const g = G();
    const rock = new THREE.MeshStandardMaterial({ color:'#c7cbdc', roughness:0.95, flatShading:true });
    [[0, 0.55, 0.95], [0.38, 0.38, 0.6], [-0.36, 0.34, 0.55]].forEach(([x, rr, hh]) => { const p = new THREE.Mesh(new THREE.ConeGeometry(rr, hh, 6), rock); p.position.set(x, hh / 2, x ? 0.1 : 0); g.add(p);
      const s = new THREE.Mesh(new THREE.ConeGeometry(rr * 0.4, hh * 0.36, 6), new THREE.MeshStandardMaterial({ color:'#ffffff', roughness:0.7, flatShading:true })); s.position.set(x, hh - hh * 0.18 + 0.004, x ? 0.1 : 0); g.add(s); });
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 6), brass); pole.position.set(0, 1.08, 0); g.add(pole);
    const pen = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.1), new THREE.MeshStandardMaterial({ color:c || '#e0705f', side:THREE.DoubleSide })); pen.position.set(0.09, 1.18, 0); g.add(pen);
    return cast(g); };
  /* 공통수학1 · 다항식의 탑 — 계단 띠가 감긴 흰 탑 */
  M.highmath1 = (_, c) => { const g = G();
    const wall = new THREE.MeshStandardMaterial({ color:'#fbf8f2', roughness:0.8 });
    const t = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.28, 1.25, 18), wall); t.position.y = 0.62; g.add(t);
    for(let q = 0; q < 4; q++){ const ring = new THREE.Mesh(new THREE.TorusGeometry(0.25 - q * 0.015, 0.02, 6, 24), lq('#d8c8a0')); ring.rotation.x = Math.PI / 2 + 0.18; ring.rotation.y = q * 0.9; ring.position.y = 0.2 + q * 0.28; g.add(ring); }
    const roof = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.42, 18), lq(c || '#7d5bb5')); roof.position.y = 1.46; g.add(roof);
    return cast(g); };
  /* 대수 · 기호의 탑 — 꼭대기에 은은한 빛 구슬 */
  M.algebra = (_, c) => { const g = G();
    const wall = new THREE.MeshStandardMaterial({ color:'#f4f0fa', roughness:0.75 });
    const t = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.26, 1.15, 16), wall); t.position.y = 0.57; g.add(t);
    const deck = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.2, 0.08, 16), lq(c || '#7d5bb5')); deck.position.y = 1.18; g.add(deck);
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.15, 24, 16), new THREE.MeshPhysicalMaterial({ color:'#f3efff', roughness:0.1, iridescence:1, iridescenceIOR:1.4, emissive:'#b9a7ff', emissiveIntensity:0.6, clearcoat:1 }));
    orb.position.y = 1.38; orb.userData.noShadow = true; g.add(orb);
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map:h.glowTex, color:'#d9ccff', transparent:true, opacity:0.8, depthWrite:false })); halo.scale.set(0.8, 0.8, 1); halo.position.y = 1.38; g.add(halo);
    return cast(g); };
  /* 공통수학 — 놋쇠 컴퍼스 + 각도기 */
  const compass = withPro => () => { const g = G();
    const legG = new THREE.CylinderGeometry(0.018, 0.012, 0.9, 8);
    [-1, 1].forEach(s => { const l = new THREE.Mesh(legG, brass); l.position.set(s * 0.17, 0.42, 0); l.rotation.z = s * 0.4; g.add(l); });
    const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.05, 16), goldM); hinge.rotation.x = Math.PI / 2; hinge.position.y = 0.84; g.add(hinge);
    const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.12, 10), woodMat('#6a3a1e', [50, 25, 10])); knob.position.y = 0.94; g.add(knob);
    if(withPro){ const pro = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.015, 32, 1, false, 0, Math.PI), new THREE.MeshPhysicalMaterial({ color:'#f6edd6', roughness:0.2, transmission:0.5, transparent:true, opacity:0.75 }));
      pro.position.set(0.1, 0.01, 0.42); pro.rotation.y = Math.PI / 2; g.add(pro); }
    return cast(g); };
  M.highmath2 = compass(true);
  /* 미적분 — 모래시계(극한·변화) */
  M.calculus1 = () => { const g = G();
    const wood = woodMat('#7a4a26', [60, 30, 12]);
    [0.04, 0.86].forEach(y => { const d = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.07, 24), wood); d.position.y = y; g.add(d); });
    for(let q = 0; q < 3; q++){ const a = q / 3 * TAU; const p = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8), wood); p.position.set(Math.cos(a) * 0.24, 0.45, Math.sin(a) * 0.24); g.add(p); }
    const prof = [[0.02, 0.08], [0.18, 0.1], [0.2, 0.22], [0.05, 0.43], [0.2, 0.66], [0.18, 0.79], [0.02, 0.82]].map(([x, y]) => new THREE.Vector2(x, y));
    const glassM = new THREE.MeshPhysicalMaterial({ color:'#ffffff', roughness:0.05, transmission:0.85, thickness:0.1, transparent:true, opacity:0.45 });
    const gl = new THREE.Mesh(new THREE.LatheGeometry(prof, 24), glassM); gl.userData.noShadow = true; g.add(gl);
    const sand = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.14, 18), new THREE.MeshStandardMaterial({ color:'#e2b457', roughness:0.9 })); sand.position.y = 0.16; g.add(sand);
    return cast(g); };
  return M;
}
