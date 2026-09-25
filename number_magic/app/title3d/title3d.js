/* ============================================================
   수의 마법 — 3D 모드 선택(타이틀) 화면
   2026-09-25 첫판(보라빛 밤의 떠 있는 섬) → 2026-09-26 다시 그림(원장 "저 보라랑 둥둥 어떻게 못하나 / 좀 새롭게").
   지금: 햇살이 드는 **마법사의 수학 작업 책상**을 위에서 내려다본다. 3D 이야기 그림(app/hero3d/kit.js,
   assets/hero3d/*.webp)과 같은 세계 — 진짜 나무 책상 · 종이 · 옻칠 나무 · 놋쇠 · 부드러운 낮빛, 글자는 KaTeX 글꼴.
   모드마다 책상 위 물건이 하나씩 놓여 있고, 아이는 그걸 골라 들어간다.
     continue → 가운데 펼쳐진 오래된 마법책(금빛이 은은히 올라온다, 가끔 한 장이 넘어간다) + 놋쇠 명판 버튼
     diag     → 지도 위의 놋쇠 나침반과 돋보기        game  → 보드게임 상자 + 숫자 주사위(가끔 구른다)·말
     sheet    → 가지런한 학습지 묶음 + 연필(가끔 톡톡) road  → 펼친 길 지도, 번호 이정표가 이어진 길
     story·dex·hist·magazine → 앞줄의 작은 소품(두루마리 · 기호 책 · 월계관 π 금화와 대리석 기둥 · 잡지)
   버튼·로고·인사도 같은 재질로: 모드 = 끈 구멍이 달린 종이 꼬리표, 이어서 모험 = 놋쇠 명판(빨간 밀랍 봉인),
   소품 = 크라프트지 꼬리표, 인사·동전 = 테이프로 붙인 쪽지, 로고 = 가죽 라벨에 금박.
   글자(로고·버튼)는 전부 HTML — 선명하고, 번역되고, 키보드·스크린리더로 쓸 수 있다.
   버튼은 매 프레임 자기 물건 위치로 따라간다(3D → 화면 투영). 버튼에 올리거나 포커스하면
   물건이 살짝 들리고 밑에 금빛이 번진다. 물건을 직접 눌러도(레이캐스트) 같은 선택이 된다.

   ── 통합 인터페이스 ──────────────────────────────────────────
   import { mountTitle3D, DEFAULT_CHOICES } from './title3d/title3d.js';
   const ctl = await mountTitle3D(container, {
     lang:    'ko' | 'en' | 'zh',
     choices: [{ id, icon, label:{ko,en,zh}, sub:{ko,en,zh}?, primary?:bool }, …]
              // 생략하면 DEFAULT_CHOICES. 아는 id: continue diag game sheet road story dex hist magazine
              // (모르는 id 는 작은 나무 표찰로 앞줄에 선다). primary 가 true 인 것이 가운데 책.
              // sub 는 문자열이어도 된다(이어서 모험의 진행 요약처럼 이미 번역된 한 줄).
     onPick:  id => {},                      // 버튼 또는 3D 물건을 눌렀을 때(한 번만 부른다)
     player:  '<div class="nm-party">…'       // renderPartyHtml(...) 결과 HTML, 또는 (px)=>HTML 함수.
                                             // 그 안의 <img>/<svg> 를 캔버스로 찍어 책상 가장자리의 종이 인형(스탠디)으로 세운다.
     character3d: THREE => ({object, update(dt,t), dispose}),  // (선택) 진짜 3D 캐릭터(app/char3d/char3d.js makeCharacter).
                                             // 주면 player 대신 이걸 나무 받침 위에 세운다. 만들다 실패하면 player 로 돌아간다.
     name:    '민준',                         // 인사말·이름표
     coins:   120,                           // 동전 쪽지
     chips:   [{icon:'📅', text:{ko:'5일',en:'Day 5',zh:'第5天'}}, {icon:'🏅', text:'…', gold:true}],
     extraHtml: '',                          // (선택) 인사 아래 덧붙일 HTML(계보 배지 줄 등, 호출자가 이스케이프)
     reducedMotion: bool?                    // (선택) 강제. 생략하면 prefers-reduced-motion
   });
   // ctl === null → WebGL 불가 · 생성 실패. 기존 2D 타이틀을 그대로 쓰면 된다.
   // ctl.setLang('en')  — 로고·버튼·칩 글자를 바꾼다.   ctl.dispose() — 모든 자원·리스너·DOM 해제.
   container 는 크기가 있는 요소(예: position:fixed; inset:0). 안에 .t3d 를 채워 넣는다.
   로고 글꼴은 CSS 변수 --t3d-logo-font 하나로 바꾼다(라이선스 받은 디스플레이 글꼴을 넣을 자리).
   ============================================================ */
import { makeKit, fontsReady, THREE } from '../hero3d/kit.js';

export const DEFAULT_CHOICES = [
  { id:'continue', icon:'▶', primary:true, label:{ ko:'이어서 모험', en:'Continue Adventure', zh:'继续冒险' } },
  { id:'diag',  icon:'🧭', label:{ ko:'진단하기', en:'Level Check', zh:'水平测评' }, sub:{ ko:'어디서 시작할지 찾아요', en:'Find where to start', zh:'找到起点' } },
  { id:'game',  icon:'🎮', label:{ ko:'게임 모드', en:'Game Mode', zh:'游戏模式' }, sub:{ ko:'수를 체험해요', en:'Experience numbers', zh:'体验数字' } },
  { id:'sheet', icon:'📄', label:{ ko:'학습지 모드', en:'Worksheet Mode', zh:'学习单模式' }, sub:{ ko:'종이로 공부해요', en:'Study on paper', zh:'用纸来学习' } },
  { id:'road',  icon:'🛤️', label:{ ko:'연산 로드맵', en:'Course Road', zh:'运算路线图' }, sub:{ ko:'순서대로 공부해요', en:'Study in order', zh:'按顺序学习' } },
  { id:'story', icon:'🗺', label:{ ko:'스토리 모드', en:'Story Mode', zh:'故事模式' } },
  { id:'dex',   icon:'📖', label:{ ko:'기호 도감', en:'Symbol Dex', zh:'符号图鉴' } },
  { id:'hist',  icon:'🏛️', label:{ ko:'수학사 퀴즈', en:'Math History Quiz', zh:'数学史问答' } },
  { id:'magazine', icon:'📰', label:{ ko:'매거진', en:'Magazine', zh:'杂志' } },
];
const MODE_IDS = ['diag', 'game', 'sheet', 'road'];

/* 로고 — 영어 워드마크가 크게, 아이들이 읽는 이름이 그 밑에 작게 */
const LOGO_SUB = { ko:'수의 마법', en:'수의 마법', zh:'数字魔法' };
const HELLO = { ko:'다시 만나서 반가워요!', en:'Welcome back!', zh:'欢迎回来！' };
const PICK_HINT = { ko:'어디로 갈까요?', en:'Where to?', zh:'去哪里？' };

/* 버튼 인장 속 새김 그림(24×24, 선) — 이모지 대신. 모르는 id 는 choice.icon 글자를 그대로 쓴다 */
const GLYPH = {
  continue:'<path d="M9.2 6.6l8.2 5.4-8.2 5.4z" fill="currentColor" stroke="none"/>',
  diag:'<circle cx="12" cy="12" r="8.2"/><path d="M12 5.6l2.3 6.4L12 18.4 9.7 12z" fill="currentColor" stroke-width="1.2"/><circle cx="12" cy="12" r="1" fill="#fff5d8" stroke="none"/>',
  game:'<rect x="4.8" y="4.8" width="14.4" height="14.4" rx="3.2"/><g fill="currentColor" stroke="none"><circle cx="8.6" cy="8.6" r="1.5"/><circle cx="15.4" cy="8.6" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="8.6" cy="15.4" r="1.5"/><circle cx="15.4" cy="15.4" r="1.5"/></g>',
  sheet:'<path d="M6 4.5h8.5l3.5 3.5V14M6 4.5v15h6"/><path d="M8.5 9h5M8.5 12h4"/><path d="M13.6 20.2l.5-2.6 5.3-5.3 2.1 2.1-5.3 5.3z" fill="currentColor" stroke-width="1.1"/>',
  road:'<path d="M5.5 20.5c0-4.6 9.5-3.2 9.5-7.6 0-3.6-6.2-3.2-6.2-6.6" stroke-dasharray="2.4 2.2"/><circle cx="5.5" cy="20" r="1.4" fill="currentColor" stroke="none"/><path d="M15.6 3.2v8M15.6 3.6h4.6l-1.5 2 1.5 2h-4.6"/>',
  story:'<path d="M7 5.5h10.5a1.8 1.8 0 0 1 0 3.6H7"/><path d="M7 5.5a1.8 1.8 0 0 0 0 3.6V18a1.8 1.8 0 0 0 1.8 1.8h9.5"/><path d="M17.5 9.1V18a1.8 1.8 0 0 0 1.8 1.8"/><path d="M10 12.2h4.5M10 15.2h3"/>',
  dex:'<path d="M3.8 6.2c3-1.1 5.8-1 8.2.9 2.4-1.9 5.2-2 8.2-.9v12.3c-3-1.1-5.8-1-8.2.9-2.4-1.9-5.2-2-8.2-.9z"/><path d="M12 7.1v12.3"/><path d="M6.6 10.3h3M8.1 8.8v3M14.4 10.3h3M14.4 13.6h3"/>',
  hist:'<path d="M4.8 7.2h14.4M6 7.2l6-3.4 6 3.4"/><path d="M7.3 9.3v8.2M12 9.3v8.2M16.7 9.3v8.2"/><path d="M4.8 19.6h14.4"/>',
  magazine:'<path d="M5 4.8h10.8v14.4H7.2A2.2 2.2 0 0 1 5 17z"/><path d="M15.8 8.6h3.2v8.6a2 2 0 0 1-2 2"/><path d="M7.8 8h5.2M7.8 11h5.2M7.8 14h3.4"/>',
};
const glyphSvg = id => GLYPH[id] ? `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${GLYPH[id]}</svg>` : null;

const esc = t => String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c]);
const tr = (v, lang) => v == null ? '' : typeof v === 'string' || typeof v === 'number' ? String(v) : (v[lang] != null ? v[lang] : v.ko != null ? v.ko : '');
const glOK = () => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch(e){ return false; } };

/* 종이 섬유 — 작은 SVG 잡음(외부 파일 없이) */
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .35  0 0 0 0 .24  0 0 0 0 .12  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

/* ---------- 스타일(한 번만 주입) — 전부 .t3d 아래로 한정 ---------- */
const CSS = `
.t3d{position:absolute;inset:0;overflow:hidden;background:#4a2f1b;font-family:var(--font-game,'Fredoka','Jua','Pretendard',sans-serif);
  --t3d-logo-font:"KaTeX_Main",Georgia,"Times New Roman",serif;--t3d-ink:#33230f;--t3d-ink2:#6a5231;
  -webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}
.t3d canvas.t3d-gl{position:absolute;inset:0;width:100%;height:100%;display:block;opacity:0;transition:opacity .6s ease;touch-action:manipulation}
.t3d canvas.t3d-gl.on{opacity:1}
.t3d canvas.t3d-gl.hot{cursor:pointer}
.t3d-vig{position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(120% 90% at 22% 0%,rgba(255,236,196,.20),rgba(255,236,196,0) 48%),radial-gradient(ellipse 85% 80% at 50% 52%,rgba(0,0,0,0) 58%,rgba(30,14,4,.42) 100%)}
.t3d-beam{position:absolute;inset:0;pointer-events:none;mix-blend-mode:screen;opacity:.9;
  background:linear-gradient(118deg,rgba(255,236,196,0) 8%,rgba(255,236,196,.09) 16%,rgba(255,236,196,.03) 26%,rgba(255,236,196,0) 31%,rgba(255,236,196,.06) 36%,rgba(255,236,196,0) 44%)}
.t3d-ui{position:absolute;inset:0;pointer-events:none}

/* 로고 — 가죽 라벨 위 금박 */
.t3d-logo{position:absolute;left:50%;top:14px;transform:translateX(-50%);text-align:center;white-space:nowrap;pointer-events:none}
.t3d-plate{position:relative;display:inline-block;padding:.12em .62em .16em;border-radius:.16em;
  background:${GRAIN},radial-gradient(120% 140% at 30% 10%,#7a2b22 0%,#5a1b16 55%,#3e110e 100%);
  box-shadow:inset 0 0 0 .05em rgba(20,4,2,.55),inset 0 .06em .08em rgba(255,200,170,.18),0 .03em 0 rgba(20,6,2,.6),0 .14em .3em rgba(25,10,2,.45)}
.t3d-plate::before{content:"";position:absolute;inset:.1em;border:1px solid rgba(233,196,106,.75);border-radius:.08em;box-shadow:inset 0 0 0 2px rgba(0,0,0,0),inset 0 0 0 3px rgba(233,196,106,.45);pointer-events:none}
.t3d-word{display:block;font-family:var(--t3d-logo-font);font-size:var(--t3d-logo,52px);line-height:1.08;font-weight:700;letter-spacing:.015em;
  background:linear-gradient(180deg,#fff4c8 0%,#f2cf74 30%,#c08c2e 58%,#f0d182 78%,#b07a24 100%);-webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(0 .03em 0 rgba(30,6,2,.85)) drop-shadow(0 -.01em 0 rgba(255,230,170,.35))}
.t3d-word .sc{font-variant-caps:small-caps;letter-spacing:.03em}
.t3d-word .of{font-style:italic;font-weight:400;font-size:.62em;margin:0 .14em 0 .1em;letter-spacing:0}
.t3d-logo-sub{display:flex;align-items:center;justify-content:center;gap:.5em;margin-top:.1em;font-size:var(--t3d-logosub,14px);letter-spacing:.32em;
  color:#f3dfb0;text-shadow:0 1px 0 rgba(20,4,2,.8)}
.t3d-logo-sub::before,.t3d-logo-sub::after{content:"";width:1.6em;height:1px;background:linear-gradient(90deg,rgba(233,196,106,0),rgba(233,196,106,.9),rgba(233,196,106,0))}
.t3d-logo-sub span{margin-right:-.32em}

/* 인사·칩 — 테이프로 붙인 쪽지 */
.t3d-hud{position:absolute;display:flex;flex-direction:column;align-items:center;gap:6px;pointer-events:auto}
.t3d-note{position:relative;color:var(--t3d-ink);background:${GRAIN},linear-gradient(180deg,#fbf4e2,#efe2c3);border-radius:2px;
  box-shadow:0 1px 0 rgba(90,60,25,.35),0 4px 8px rgba(25,12,3,.32)}
.t3d-note::before{content:"";position:absolute;left:50%;top:-6px;width:34px;height:12px;transform:translateX(-50%) rotate(-3deg);
  background:rgba(236,226,196,.62);box-shadow:0 0 0 1px rgba(255,255,255,.18) inset;border-radius:1px}
.t3d-hello{font-size:15px;padding:6px 14px 6px;white-space:nowrap;transform:rotate(-1deg)}
.t3d-chips{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
.t3d-chip{display:inline-flex;align-items:center;gap:6px;font-size:13.5px;padding:3px 10px 3px 6px;white-space:nowrap}
.t3d-chip:nth-child(2n){transform:rotate(1.4deg)} .t3d-chip:nth-child(2n+1){transform:rotate(-1.2deg)}
.t3d-chip::before{width:20px;height:9px;top:-4px}
.t3d-chip i{font-style:normal;display:inline-grid;place-items:center;width:18px;height:18px;border-radius:50%;font-size:11px;line-height:1}
.t3d-chip i.coin{background:radial-gradient(circle at 35% 30%,#fff1b8,#e0b451 50%,#9c6c1f 100%);box-shadow:inset 0 0 0 1.5px rgba(120,80,20,.6),0 1px 1px rgba(0,0,0,.3)}
.t3d-chip.gold{background:${GRAIN},linear-gradient(180deg,#fbe6a6,#e2bb5c);color:#3a2403}

/* 이름표 */
.t3d-tag{position:absolute;left:0;top:0;transform:translate(-50%,-100%);font-size:12.5px;color:var(--t3d-ink);padding:2px 9px 2px 9px;border-radius:2px;
  background:${GRAIN},#f4e7c8;box-shadow:0 1px 0 rgba(90,60,25,.4),0 3px 6px rgba(25,12,3,.3);white-space:nowrap;will-change:transform}

/* 버튼 — 공통 뼈대(모양은 ::before 가 그린다, 그림자는 filter 로 모양을 따라간다) */
.t3d-btn{position:absolute;left:0;top:0;pointer-events:auto;cursor:pointer;border:0;margin:0;font:inherit;color:var(--t3d-ink);will-change:transform;isolation:isolate;
  display:flex;align-items:center;gap:9px;text-align:left;word-break:keep-all;min-height:44px;min-width:44px;padding:7px 14px 7px 30px;background:none;border-radius:6px;
  filter:drop-shadow(0 1.5px 0 rgba(70,42,14,.55)) drop-shadow(0 5px 7px rgba(28,13,2,.38));transition:filter .15s,translate .15s;outline:none}
.t3d-btn::before{content:"";position:absolute;inset:0;z-index:-1;
  background:${GRAIN},linear-gradient(180deg,#fcf6e6 0%,#f1e4c4 100%);
  clip-path:polygon(16px 0,100% 0,100% 100%,16px 100%,0 calc(100% - 13px),0 13px);transition:background .15s}
/* 끈 구멍(놋쇠 고리) */
.t3d-btn::after{content:"";position:absolute;left:8px;top:50%;width:9px;height:9px;margin-top:-4.5px;border-radius:50%;
  background:radial-gradient(circle,#3a2a18 0 2.2px,#f6d98e 2.6px,#b98a33 4px,#7c5518 4.5px)}
.t3d-btn .t3d-ico{flex:none;width:32px;height:32px;border-radius:50%;display:grid;place-items:center;font-size:16px;line-height:1;color:#4a2f0c;padding:6px;box-sizing:border-box;
  background:radial-gradient(circle at 34% 28%,#fff4cc 0%,#e7c168 38%,#b5842f 78%,#8a5e1c 100%);
  box-shadow:inset 0 0 0 1.5px rgba(95,62,14,.55),inset 0 -2px 3px rgba(80,48,8,.35),inset 0 1px 1px rgba(255,255,255,.6),0 1px 1px rgba(40,20,0,.3)}
.t3d-btn b{display:block;font-weight:400;font-size:17px;line-height:1.15;letter-spacing:.01em}
.t3d-btn small{display:block;font-size:12px;line-height:1.25;color:var(--t3d-ink2);margin-top:2px}
.t3d-btn.on,.t3d-btn:hover{translate:0 -2px;filter:drop-shadow(0 1.5px 0 rgba(70,42,14,.55)) drop-shadow(0 0 7px rgba(255,214,120,.95)) drop-shadow(0 9px 10px rgba(28,13,2,.4))}
.t3d-btn.on::before,.t3d-btn:hover::before{background:${GRAIN},linear-gradient(180deg,#fffbef 0%,#f7ebcd 100%)}
.t3d-btn:focus-visible{outline:3px solid #fff3c4;outline-offset:3px;box-shadow:0 0 0 7px rgba(40,20,4,.55)}
.t3d-btn:active{translate:0 0}

/* 이어서 모험 — 놋쇠 명판 + 빨간 밀랍 봉인 */
.t3d-btn.primary{padding:10px 24px 11px 12px;gap:12px;color:#3a2206;border-radius:9px;
  filter:drop-shadow(0 2px 0 rgba(70,40,6,.7)) drop-shadow(0 8px 12px rgba(28,13,2,.45))}
.t3d-btn.primary::before{clip-path:none;border-radius:9px;
  background:radial-gradient(circle at 9px 9px,#6b4a16 0 1.6px,#f6e2a4 2px,#a8792b 3.6px,transparent 4.2px),radial-gradient(circle at calc(100% - 9px) 9px,#6b4a16 0 1.6px,#f6e2a4 2px,#a8792b 3.6px,transparent 4.2px),
    radial-gradient(circle at 9px calc(100% - 9px),#6b4a16 0 1.6px,#f6e2a4 2px,#a8792b 3.6px,transparent 4.2px),radial-gradient(circle at calc(100% - 9px) calc(100% - 9px),#6b4a16 0 1.6px,#f6e2a4 2px,#a8792b 3.6px,transparent 4.2px),
    linear-gradient(100deg,rgba(255,255,255,0) 30%,rgba(255,250,225,.45) 42%,rgba(255,255,255,0) 54%),
    linear-gradient(180deg,#fbe8ae 0%,#e9c46c 24%,#cf9c42 56%,#e8c572 80%,#b8883a 100%);
  box-shadow:inset 0 1px 0 rgba(255,250,220,.9),inset 0 -2px 0 rgba(110,70,12,.55),inset 0 0 0 1px rgba(120,80,20,.7),inset 0 0 0 5px rgba(255,236,180,.22),inset 0 0 0 6px rgba(120,80,20,.35)}
.t3d-btn.primary::after{display:none}
.t3d-btn.primary .t3d-ico{width:42px;height:42px;padding:9px;color:#ffe9d9;border-radius:48% 52% 50% 50%/52% 47% 53% 48%;
  background:radial-gradient(circle at 36% 30%,#e8645a 0%,#c3332a 45%,#8c1a14 100%);
  box-shadow:inset 0 0 0 3px rgba(120,20,14,.55),inset 0 0 0 5px rgba(240,120,100,.25),inset 0 -3px 4px rgba(60,6,4,.45),0 2px 2px rgba(50,10,4,.4)}
.t3d-btn.primary b{font-size:22px;color:#321c03;text-shadow:0 1px 0 rgba(255,242,200,.75)}
.t3d-btn.primary small{color:#5a3c0e;font-size:12.5px;text-shadow:0 1px 0 rgba(255,242,200,.6)}
.t3d-btn.primary.on,.t3d-btn.primary:hover{filter:drop-shadow(0 2px 0 rgba(70,40,6,.7)) drop-shadow(0 0 12px rgba(255,214,120,.95)) drop-shadow(0 10px 14px rgba(28,13,2,.45))}
.t3d-btn.primary.on::before,.t3d-btn.primary:hover::before{filter:brightness(1.07)}

/* 앞줄 소품 — 크라프트지 꼬리표 */
.t3d-btn.pill{padding:5px 12px 5px 25px;gap:6px;border-radius:5px}
.t3d-btn.pill::before{background:${GRAIN},linear-gradient(180deg,#e2c697 0%,#d2b07a 100%);clip-path:polygon(13px 0,100% 0,100% 100%,13px 100%,0 calc(100% - 11px),0 11px)}
.t3d-btn.pill::after{left:6px;width:8px;height:8px;margin-top:-4px}
.t3d-btn.pill.on::before,.t3d-btn.pill:hover::before{background:${GRAIN},linear-gradient(180deg,#eed6ab 0%,#dfc08c 100%)}
.t3d-btn.pill .t3d-ico{width:26px;height:26px;padding:5px;font-size:14px}
.t3d-btn.pill b{font-size:14px}

.t3d.narrow .t3d-btn{padding:6px 10px 6px 26px;gap:7px}
.t3d.narrow .t3d-btn .t3d-ico{width:28px;height:28px;padding:5px;font-size:14px}
.t3d.narrow .t3d-btn b{font-size:15.5px}
.t3d.narrow .t3d-btn small{font-size:11px}
.t3d.narrow .t3d-btn.primary{padding:9px 18px 10px 10px;gap:10px}
.t3d.narrow .t3d-btn.primary .t3d-ico{width:38px;height:38px;padding:8px}
.t3d.narrow .t3d-btn.primary b{font-size:20px}
.t3d.narrow .t3d-btn.pill{flex-direction:column;gap:2px;padding:7px 4px 6px;text-align:center;justify-content:center}
.t3d.narrow .t3d-btn.pill::before{clip-path:polygon(0 9px,50% 0,100% 9px,100% 100%,0 100%)}
.t3d.narrow .t3d-btn.pill::after{left:50%;top:9px;margin-left:-3.5px;width:7px;height:7px;margin-top:0}
.t3d.narrow .t3d-btn.pill .t3d-ico{width:24px;height:24px;padding:4px;margin-top:6px}
.t3d.narrow .t3d-btn.pill b{font-size:12.5px;line-height:1.15}
.t3d-hint{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.t3d.short .t3d-btn{padding:4px 11px 4px 25px;gap:6px}
.t3d.short .t3d-btn small{display:none}
.t3d.short .t3d-btn .t3d-ico{width:26px;height:26px;padding:5px;font-size:13px}
.t3d.short .t3d-btn b{font-size:14.5px}
.t3d.short .t3d-btn.primary{padding:6px 16px 6px 7px}
.t3d.short .t3d-btn.primary small{display:block;font-size:11px}
.t3d.short .t3d-btn.primary .t3d-ico{width:32px;height:32px;padding:7px}
.t3d.short .t3d-btn.primary b{font-size:18px}
.t3d.short .t3d-hello{font-size:13px;padding:4px 11px}
.t3d.short .t3d-chip{font-size:12px;padding:2px 8px 2px 5px}
@media (prefers-reduced-motion:reduce){.t3d canvas.t3d-gl{transition:none}.t3d-btn{transition:none}}
@media (forced-colors:active){.t3d-btn{border:2px solid ButtonText;background:ButtonFace;color:ButtonText}.t3d-btn::before{display:none}}
.t3d-raster{position:fixed;left:-10000px;top:0;pointer-events:none}
.t3d-raster .nm-human img{width:100%;height:100%;object-fit:contain;display:block}
.t3d-raster .nm-party{position:relative;display:inline-block}
.t3d-raster .nm-party .nm-party-buddy{position:absolute;right:-22%;bottom:0}
`;
function injectCss(){
  const old = document.getElementById('t3d-style');
  if(old && old.dataset.v === 'desk2') return;
  if(old) old.remove();
  const s = document.createElement('style'); s.id = 't3d-style'; s.dataset.v = 'desk2'; s.textContent = CSS; document.head.appendChild(s);
}

/* ---------- 캐릭터 HTML → 캔버스 (img·svg 를 화면에 놓인 그대로 찍는다) ---------- */
async function rasterizeMarkup(markup){
  if(!markup) return null;
  const host = document.createElement('div'); host.className = 't3d-raster'; host.innerHTML = markup;
  document.body.appendChild(host);
  try {
    const imgs = [...host.querySelectorAll('img')];
    await Promise.race([
      Promise.all(imgs.map(im => im.complete ? (im.decode ? im.decode().catch(() => null) : null) : new Promise(res => { im.addEventListener('load', res, { once:true }); im.addEventListener('error', res, { once:true }); }))),
      new Promise(res => setTimeout(res, 4000)),
    ]);
    await new Promise(res => requestAnimationFrame(() => res()));
    const root = host.firstElementChild || host;
    /* 동행 캐릭터가 오른쪽 아래로 삐져나오므로 모든 자식의 상자를 합친다 */
    let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
    const parts = [];
    const vis = el => { for(let e = el; e && e !== host; e = e.parentElement){ const cs = getComputedStyle(e); if(cs.display === 'none' || cs.visibility === 'hidden') return false; } return true; };
    host.querySelectorAll('img, svg').forEach(el => {
      if(el.tagName.toLowerCase() === 'svg' && el.parentElement && el.parentElement.closest('svg')) return;
      if(!vis(el)) return;
      if(el.tagName === 'IMG' && !(el.naturalWidth > 0)) return;
      const b = el.getBoundingClientRect(); if(b.width < 1 || b.height < 1) return;
      parts.push({ el, b });
      minX = Math.min(minX, b.left); minY = Math.min(minY, b.top); maxX = Math.max(maxX, b.right); maxY = Math.max(maxY, b.bottom);
    });
    if(!parts.length) return null;
    const rb = root.getBoundingClientRect();
    minX = Math.min(minX, rb.left); maxY = Math.max(maxY, rb.bottom);
    const pad = 8, S = 2;
    const cw = Math.ceil((maxX - minX + pad * 2) * S), ch = Math.ceil((maxY - minY + pad * 2) * S);
    const c = document.createElement('canvas'); c.width = cw; c.height = ch;
    const g = c.getContext('2d');
    for(const { el, b } of parts){
      const x = (b.left - minX + pad) * S, y = (b.top - minY + pad) * S, w = b.width * S, h = b.height * S;
      if(el.tagName === 'IMG'){
        const cs = getComputedStyle(el);
        let dx = x, dy = y, dw = w, dh = h;
        if(cs.objectFit === 'contain'){
          const ar = el.naturalWidth / el.naturalHeight;
          if(w / h > ar){ dw = h * ar; dx = x + (w - dw) / 2; } else { dh = w / ar; dy = y + (h - dh) / 2; }
          if(cs.objectPosition && /bottom|100%$/.test(cs.objectPosition)) dy = y + h - dh;
        }
        g.save(); if(cs.filter && cs.filter !== 'none') g.filter = cs.filter.replace(/(-?\d*\.?\d+)px/g, (m, n) => (n * S) + 'px');
        try { g.drawImage(el, dx, dy, dw, dh); } catch(e){}
        g.restore();
      } else {
        const clone = el.cloneNode(true);
        clone.setAttribute('width', b.width); clone.setAttribute('height', b.height);
        clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        clone.removeAttribute('style');
        const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(clone));
        await new Promise(res => { const im = new Image(); im.onload = () => { try { g.drawImage(im, x, y, w, h); } catch(e){} res(); }; im.onerror = res; im.src = url; });
      }
    }
    /* 투명 캔버스로 나오면(그림을 하나도 못 찍음) 실패 */
    const d = g.getImageData(0, 0, cw, ch).data; let any = false;
    for(let i = 3; i < d.length; i += 64){ if(d[i] > 10){ any = true; break; } }
    return any ? c : null;
  } catch(e){ return null; }
  finally { host.remove(); }
}

/* 종이 인형(스탠디)처럼 — 그림 둘레에 흰 여백 테두리를 둘러 오려 낸 느낌을 준다 */
function cutoutCanvas(src){
  const R = Math.max(6, Math.round(Math.min(src.width, src.height) * 0.028)), P = R + 4;
  const c = document.createElement('canvas'); c.width = src.width + P * 2; c.height = src.height + P * 2;
  const g = c.getContext('2d');
  const sil = document.createElement('canvas'); sil.width = c.width; sil.height = c.height;
  const sg = sil.getContext('2d');
  for(let a = 0; a < 24; a++){ const an = a / 24 * Math.PI * 2; sg.drawImage(src, P + Math.cos(an) * R, P + Math.sin(an) * R); }
  sg.drawImage(src, P, P);
  sg.globalCompositeOperation = 'source-in'; sg.fillStyle = '#fbf6ea'; sg.fillRect(0, 0, c.width, c.height);
  g.shadowColor = 'rgba(90,60,30,.55)'; g.shadowBlur = 2; g.drawImage(sil, 0, 0); g.shadowColor = 'transparent';
  g.drawImage(src, P, P);
  /* 투명 여백을 잘라 발끝이 받침 가운데에 오게 */
  const d = g.getImageData(0, 0, c.width, c.height).data; let x0 = c.width, y0 = c.height, x1 = 0, y1 = 0;
  for(let y = 0; y < c.height; y += 2) for(let x = 0; x < c.width; x += 2){ if(d[(y * c.width + x) * 4 + 3] > 24){ if(x < x0) x0 = x; if(x > x1) x1 = x; if(y < y0) y0 = y; if(y > y1) y1 = y; } }
  if(x1 <= x0 || y1 <= y0) return c;
  const out = document.createElement('canvas'); out.width = x1 - x0 + 4; out.height = y1 - y0 + 4;
  out.getContext('2d').drawImage(c, x0 - 2, y0 - 2, out.width, out.height, 0, 0, out.width, out.height);
  return out;
}

/* ============================================================ */
export async function mountTitle3D(container, opts){
  opts = opts || {};
  if(!container || !glOK()) return null;
  injectCss();
  let lang = opts.lang || 'ko';
  const choices = (opts.choices && opts.choices.length ? opts.choices : DEFAULT_CHOICES).map(c => Object.assign({}, c));
  if(!choices.some(c => c.primary)){ const c0 = choices.find(c => c.id === 'continue') || choices[0]; c0.primary = true; }
  const reduce = opts.reducedMotion != null ? !!opts.reducedMotion : !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  const root = document.createElement('div'); root.className = 't3d';
  const canvas = document.createElement('canvas'); canvas.className = 't3d-gl';
  canvas.setAttribute('aria-hidden', 'true');
  const vig = document.createElement('div'); vig.className = 't3d-vig'; vig.setAttribute('aria-hidden', 'true');
  const ui = document.createElement('div'); ui.className = 't3d-ui';
  const beam = document.createElement('div'); beam.className = 't3d-beam'; beam.setAttribute('aria-hidden', 'true');
  root.append(canvas, beam, vig, ui);
  container.appendChild(root);

  const sizeOf = () => [Math.max(240, root.clientWidth || container.clientWidth || 800), Math.max(320, root.clientHeight || container.clientHeight || 600)];
  let [VW, VH] = sizeOf();

  await fontsReady();
  const playerSpec = await preparePlayer(opts);
  if(!root.isConnected){ disposePlayerSpec(playerSpec); return null; }

  let k;
  try { k = makeKit(11, { live:true, canvas, width:VW, height:VH }); }
  catch(e){ disposePlayerSpec(playerSpec); root.remove(); return null; }
  const { r, scene, cam } = k;
  let built;
  try { built = buildWorld(k, choices, playerSpec); }
  catch(e){ console.error('[title3d]', e); disposePlayerSpec(playerSpec); try { r.dispose(); } catch(_){} root.remove(); return null; }
  const { objs, player, animate, applyLayout } = built;
  const playerHtml = playerSpec && playerSpec.kind === 'html' ? playerSpec.html : null;

  /* ---------- HTML 겹 ---------- */
  const logo = document.createElement('div'); logo.className = 't3d-logo';
  const hud = document.createElement('div'); hud.className = 't3d-hud';
  const tag = document.createElement('div'); tag.className = 't3d-tag';
  const hint = document.createElement('h2'); hint.className = 't3d-hint';
  ui.append(hint, logo, hud);
  if(opts.name) ui.append(tag);
  let playerEl = null;
  if(playerHtml){ playerEl = document.createElement('div'); playerEl.className = 't3d-player-html'; playerEl.setAttribute('aria-hidden', 'true');
    playerEl.style.cssText = 'position:absolute;left:0;top:0;pointer-events:none;will-change:transform'; playerEl.innerHTML = playerHtml; ui.prepend(playerEl); }
  const btns = {};
  choices.forEach(c => {
    const b = document.createElement('button'); b.type = 'button';
    b.className = 't3d-btn' + (c.primary ? ' primary' : MODE_IDS.includes(c.id) ? ' mode' : ' pill');
    b.dataset.id = c.id;
    b.addEventListener('pointerenter', () => setHot(c.id, 'btn'));
    b.addEventListener('pointerleave', () => { if(hot === c.id && hotSrc === 'btn') setHot(null); });
    b.addEventListener('focus', () => setHot(c.id, 'focus'));
    b.addEventListener('blur', () => { if(hot === c.id && hotSrc === 'focus') setHot(null); });
    b.addEventListener('click', () => pick(c.id));
    btns[c.id] = b;
  });
  /* 탭 순서 = 중요도(이어서 → 모드 4 → 소품) */
  const order = [...choices].sort((a, b) => rank(a) - rank(b));
  function rank(c){ return c.primary ? 0 : MODE_IDS.includes(c.id) ? 1 + MODE_IDS.indexOf(c.id) : 10; }
  order.forEach(c => ui.appendChild(btns[c.id]));

  function fillText(){
    logo.innerHTML = `<div class="t3d-plate"><div class="t3d-word" lang="en"><span class="sc">Numbers</span><span class="of">of</span><span class="sc">Magic</span></div>`
      + `<div class="t3d-logo-sub"><span>${esc(LOGO_SUB[lang] || LOGO_SUB.ko)}</span></div></div>`;
    const chips = [];
    if(opts.coins != null) chips.push(`<span class="t3d-note t3d-chip"><i class="coin" aria-hidden="true"></i>${esc(opts.coins)}</span>`);
    (opts.chips || []).forEach(ch => { if(!ch) return; const o = typeof ch === 'string' ? { text:ch } : ch;
      chips.push(`<span class="t3d-note t3d-chip${o.gold ? ' gold' : ''}">${o.icon ? `<i aria-hidden="true">${esc(o.icon)}</i>` : ''}${esc(tr(o.text, lang))}</span>`); });
    hud.innerHTML = `<div class="t3d-note t3d-hello">${opts.name ? esc(opts.name) + ' — ' : ''}${esc(HELLO[lang] || HELLO.ko)}</div>`
      + (chips.length ? `<div class="t3d-chips">${chips.join('')}</div>` : '') + (opts.extraHtml || '');
    tag.textContent = opts.name || '';
    hint.textContent = PICK_HINT[lang] || PICK_HINT.ko;
    choices.forEach(c => {
      const b = btns[c.id], lab = tr(c.label, lang), sub = tr(c.sub, lang);
      const gl = glyphSvg(c.primary ? 'continue' : c.id);
      b.innerHTML = `<span class="t3d-ico" aria-hidden="true">${gl || esc(c.icon || '•')}</span><span class="t3d-txt"><b>${esc(lab)}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</span>`;
      b.setAttribute('aria-label', sub ? `${lab} — ${sub}` : lab);
    });
    root.setAttribute('lang', lang === 'zh' ? 'zh-Hans' : lang);
  }

  /* ---------- 강조(hover/focus/3D hover) ---------- */
  let hot = null, hotSrc = null;
  function setHot(id, src){
    hot = id; hotSrc = id ? src : null;
    Object.keys(btns).forEach(k2 => btns[k2].classList.toggle('on', k2 === id));
    canvas.classList.toggle('hot', !!id && src === 'gl');
    Object.values(objs).forEach(o => { o.hotT = o.id === id ? 1 : 0; });
    wake();
  }
  let picked = false;
  function pick(id){
    if(picked || disposed) return; picked = true;
    try { opts.onPick && opts.onPick(id); } finally { setTimeout(() => { picked = false; }, 400); }
  }

  /* ---------- 레이캐스트 ---------- */
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  const hitList = Object.values(objs).map(o => o.hit);
  function hitAt(ev){
    const b = canvas.getBoundingClientRect();
    ndc.set(((ev.clientX - b.left) / b.width) * 2 - 1, -((ev.clientY - b.top) / b.height) * 2 + 1);
    ray.setFromCamera(ndc, cam);
    const h = ray.intersectObjects(hitList, false)[0];
    return h ? h.object.userData.choiceId : null;
  }
  const onMove = ev => { if(ev.pointerType === 'touch') return; const id = hitAt(ev); if(id !== (hotSrc === 'gl' ? hot : null) && (hotSrc !== 'btn' && hotSrc !== 'focus' || id)) setHot(id, 'gl'); };
  const onLeave = () => { if(hotSrc === 'gl') setHot(null); };
  const onClick = ev => { const id = hitAt(ev); if(id) pick(id); };
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerleave', onLeave);
  canvas.addEventListener('click', onClick);

  /* ---------- 구도(가로/세로) ---------- */
  let layout = null, narrow = false;
  const sizes = {};
  function measure(){
    Object.keys(btns).forEach(id => { const b = btns[id]; sizes[id] = [b.offsetWidth, b.offsetHeight]; });
    sizes._hud = [hud.offsetWidth, hud.offsetHeight];
    sizes._logo = [logo.offsetWidth, logo.offsetHeight];
  }
  function relayout(){
    [VW, VH] = sizeOf();
    r.setSize(VW, VH, false);
    cam.aspect = VW / VH;
    const portrait = VW / VH < 0.9;
    const short = !portrait && VH < 560;
    narrow = VW < 560 || portrait;
    root.classList.toggle('narrow', narrow);
    root.classList.toggle('short', short);
    root.style.setProperty('--t3d-logo', (narrow ? Math.min(40, VW * 0.098) : short ? Math.max(26, VH * 0.07) : Math.min(54, Math.max(38, VH * 0.062))) + 'px');
    root.style.setProperty('--t3d-logosub', (narrow ? 12 : short ? 11 : 14) + 'px');
    /* 버튼 폭 한도 — 세로: 모드 2칸, 소품 4칸 */
    choices.forEach(c => {
      const b = btns[c.id];
      if(portrait){
        b.style.maxWidth = c.primary ? (VW - 40) + 'px' : MODE_IDS.includes(c.id) ? Math.floor((VW - 36) / 2) + 'px' : Math.floor((VW - 28) / 4 - 4) + 'px';
        b.style.width = !c.primary && !MODE_IDS.includes(c.id) ? Math.floor((VW - 28) / 4 - 4) + 'px' : '';
      } else { b.style.maxWidth = c.primary ? '380px' : '260px'; b.style.width = ''; }
    });
    layout = portrait ? 'portrait' : short ? 'wide' : 'landscape';
    applyLayout(layout);
    /* HUD 자리: 가로 = 오른쪽 위 구석, 세로 = 로고 아래 가운데 */
    if(portrait){ hud.style.left = '50%'; hud.style.right = ''; hud.style.transform = 'translateX(-50%)'; }
    else { hud.style.left = ''; hud.style.right = short ? '12px' : '22px'; hud.style.transform = ''; hud.style.top = short ? '10px' : '22px'; }
    logo.style.top = (portrait ? 12 : short ? 8 : 16) + 'px';
    /* 로고가 폭을 넘으면 글자를 줄인다(가로는 오른쪽 인사 쪽지와도 안 겹치게) */
    const lk = logo.querySelector('.t3d-plate');
    if(lk){
      const cur = parseFloat(getComputedStyle(root).getPropertyValue('--t3d-logo')) || 46;
      let room = VW - 28;
      if(!portrait){ const hw = hud.offsetWidth || 0; room = Math.min(room, (VW / 2 - hw - (short ? 12 : 22) - 14) * 2); }
      const lw = lk.offsetWidth;
      if(lw > room && room > 60) root.style.setProperty('--t3d-logo', Math.max(18, Math.floor(cur * room / lw)) + 'px');
    }
    measure();
    if(portrait) hud.style.top = (logo.offsetTop + sizes._logo[1] + 10) + 'px';
    fitCamera();
    wake(true);
  }

  /* 모든 물건 상자 + 버튼 상자가 화면 안(로고·인사 아래)에 들어오도록 거리와 시점을 맞춘다 */
  const _v = new THREE.Vector3();
  const proj = p => { _v.copy(p).project(cam); return [(_v.x + 1) / 2 * VW, (1 - _v.y) / 2 * VH]; };
  function fitCamera(){
    const L = built.layouts[layout];
    const pitch = THREE.MathUtils.degToRad(L.pitch), fov = L.fov;
    cam.fov = fov; cam.updateProjectionMatrix();
    const dir = new THREE.Vector3(0, Math.sin(pitch), Math.cos(pitch));
    const T = new THREE.Vector3(...L.target);
    let d = L.dist;
    const topPad = layout === 'portrait' ? (hud.offsetTop + sizes._hud[1] + 8) : (logo.offsetTop + sizes._logo[1] + 8);
    const side = 12, bot = 12;
    const availW = VW - side * 2, availH = VH - topPad - bot;
    const pts = [];
    Object.values(objs).forEach(o => { o.box.forEach(p => pts.push(p)); });
    if(player) player.box.forEach(p => pts.push(p));
    for(let it = 0; it < 16; it++){
      cam.position.copy(T).addScaledVector(dir, d); cam.lookAt(T); cam.updateMatrixWorld(true);
      let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      const add = (x, y) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); };
      pts.forEach(p => { const [x, y] = proj(p); add(x, y); });
      if(player){ const [x, y] = proj(player.topAt(cam, 0.45)); add(x, y); }
      Object.values(objs).forEach(o => {
        const s = sizes[o.id]; if(!s) return;
        const [ax, ay] = proj(o.anchorW);
        const [lx, ly] = labelPos(o, ax, ay, s);
        add(lx, ly); add(lx + s[0], ly + s[1]);
      });
      const s = Math.max((x1 - x0) / availW, (y1 - y0) / availH);
      d *= 1 + (s - 1) * 0.85;
      const wpp = 2 * d * Math.tan(THREE.MathUtils.degToRad(fov / 2)) / VH;
      const cx = (x0 + x1) / 2 - (side + availW / 2), cy = (y0 + y1) / 2 - (topPad + availH / 2);
      const right = new THREE.Vector3(1, 0, 0), up = new THREE.Vector3(0, 1, 0).applyQuaternion(cam.quaternion);
      T.addScaledVector(right, cx * wpp * 0.9).addScaledVector(up, -cy * wpp * 0.9);
    }
    cam.position.copy(T).addScaledVector(dir, d); cam.lookAt(T); cam.updateMatrixWorld(true);
    built.onFit(cam, T);
  }
  /* 버튼의 왼쪽 위 좌표 — 물건 앞 가장자리 밑(below), 또는 물건 위 가운데(center) */
  function labelPos(o, ax, ay, s){
    if(o.place === 'center' || o.place === 'top') return [ax - s[0] / 2, ay - s[1] / 2];
    if(o.place === 'left') return [ax - s[0] - 4, ay - s[1] / 2];
    if(o.place === 'right') return [ax + 4, ay - s[1] / 2];
    return [ax - s[0] / 2, ay + 4];
  }

  /* ---------- 버튼 위치(매 프레임) + 겹침 풀기 ---------- */
  function placeLabels(){
    const rects = [];
    Object.values(objs).forEach(o => {
      const s = sizes[o.id]; if(!s) return;
      const [ax, ay] = proj(o.anchorW);
      let [x, y] = labelPos(o, ax, ay, s);
      rects.push({ o, x, y, w:s[0], h:s[1] });
    });
    /* 겹치면 아래 것을 내린다 — 물건 발밑에 붙는 구도라 거의 안 겹치지만 좁은 폭·긴 번역에 대비 */
    rects.sort((a, b) => a.y - b.y);
    for(let pass = 0; pass < 6; pass++){
      for(let i = 0; i < rects.length; i++) for(let j = i + 1; j < rects.length; j++){
        const a = rects[i], b = rects[j];
        if(a.x < b.x + b.w + 4 && b.x < a.x + a.w + 4 && a.y < b.y + b.h + 4 && b.y < a.y + a.h + 4){
          /* 같은 줄이면 옆으로 벌리고, 아니면 아래 것을 내린다 */
          if(Math.abs(a.y - b.y) < Math.min(a.h, b.h) * 0.5){
            const L0 = a.x < b.x ? a : b, R0 = L0 === a ? b : a, ov = L0.x + L0.w + 6 - R0.x;
            if(ov > 0){ L0.x -= ov / 2; R0.x += ov / 2; }
          } else { const ov = a.y + a.h + 4 - b.y; if(ov > 0) b.y += ov; }
        }
      }
    }
    rects.forEach(R => {
      R.x = Math.max(6, Math.min(VW - R.w - 6, R.x)); R.y = Math.max(6, Math.min(VH - R.h - 6, R.y));
      const b = btns[R.o.id];
      b.style.transform = `translate3d(${Math.round(R.x)}px,${Math.round(R.y)}px,0)`;
    });
    if(player) player.topAt(cam, 0.08);
    if(playerEl && player){ const [fx, fy] = proj(player.footW), [hx, hy] = proj(player.tagW);
      const hpx = Math.max(40, fy - hy), s0 = playerEl.firstElementChild ? playerEl.firstElementChild.offsetHeight || 220 : 220;
      playerEl.style.transform = `translate3d(${Math.round(fx)}px,${Math.round(fy)}px,0) translate(-50%,-100%) scale(${(hpx * 0.9 / s0).toFixed(3)})`;
      playerEl.style.transformOrigin = '50% 100%'; }
    if(opts.name && player){
      const [tx, ty] = proj(player.tagW);
      tag.style.transform = `translate3d(${Math.round(tx)}px,${Math.round(ty)}px,0) translate(-50%,-100%)`;
      /* 이름표가 버튼·로고에 가리면 숨긴다(인사말에 이름이 이미 있다) */
      const tw = tag.offsetWidth || 60, th = tag.offsetHeight || 22, x0 = tx - tw / 2, y0 = ty - th;
      const lr = [logo.offsetLeft - sizes._logo[0] / 2, logo.offsetTop, sizes._logo[0], sizes._logo[1]];
      const hidden = y0 < 4 || rects.some(R => x0 < R.x + R.w && R.x < x0 + tw && y0 < R.y + R.h && R.y < y0 + th)
        || (x0 < lr[0] + lr[2] && lr[0] < x0 + tw && y0 < lr[1] + lr[3] && lr[1] < y0 + th);
      tag.style.visibility = hidden ? 'hidden' : '';
    }
  }

  /* ---------- 루프 ---------- */
  let raf = 0, running = !document.hidden, visible = true, disposed = false, t0 = performance.now(), last = t0, shown = false, settle = 0;
  function frame(now){
    raf = 0; if(disposed) return;
    if(!root.isConnected){ dispose(); return; }
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const t = reduce ? 0 : (now - t0) / 1000;
    const moving = animate(t, dt, reduce);
    placeLabels();
    r.render(scene, cam);
    if(!shown){ shown = true; canvas.classList.add('on'); }
    if(moving) settle = now;
    if(running && visible && (!reduce || now - settle < 700)) raf = requestAnimationFrame(frame);
  }
  function wake(){ if(!raf && running && visible && !disposed){ last = performance.now(); settle = last; raf = requestAnimationFrame(frame); } }
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => { visible = es.some(x => x.isIntersecting); if(visible) wake(); }) : null;
  if(io) io.observe(root);
  const onVis = () => { running = !document.hidden; if(running) wake(); };
  document.addEventListener('visibilitychange', onVis);
  let rt = 0;
  const onResize = () => { clearTimeout(rt); rt = setTimeout(() => { if(!disposed) relayout(); }, 60); };
  const ro = 'ResizeObserver' in window ? new ResizeObserver(onResize) : null;
  if(ro) ro.observe(root); else window.addEventListener('resize', onResize);

  function dispose(){
    if(disposed) return; disposed = true;
    if(raf) cancelAnimationFrame(raf); raf = 0;
    clearTimeout(rt);
    if(io) io.disconnect(); if(ro) ro.disconnect(); else window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVis);
    canvas.removeEventListener('pointermove', onMove); canvas.removeEventListener('pointerleave', onLeave); canvas.removeEventListener('click', onClick);
    disposePlayerSpec(playerSpec);
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

  fillText();
  relayout();
  wake();
  return {
    setLang(l){ if(disposed) return; lang = l || 'ko'; fillText(); relayout(); },
    dispose,
    /* 검사용 */
    _debug:{ objs, cam, proj:p => proj(p), btns, hitAt:(x, y) => hitAt({ clientX:x, clientY:y }), get layout(){ return layout; } },
  };
}

/* ---------- 캐릭터 준비 — 여기 한 곳만 바꾸면 된다 ----------
   opts.character3d(THREE) → {object, update(dt,t), dispose} 가 있으면 진짜 3D 캐릭터.
   없거나 실패하면 opts.player HTML 을 캔버스로 찍어 종이 인형(스탠디)으로. 그것도 안 되면 HTML 을 그대로 띄운다. */
async function preparePlayer(opts){
  if(typeof opts.character3d === 'function'){
    try {
      const c = await opts.character3d(THREE);
      if(c && c.object && c.object.isObject3D) return { kind:'3d', c };
    } catch(e){ console.warn('[title3d] character3d', e); }
  }
  try {
    const mk = typeof opts.player === 'function' ? opts.player(220) : opts.player;
    if(!mk) return null;
    const cv = await rasterizeMarkup(mk);
    if(cv) return { kind:'card', canvas:cutoutCanvas(cv) };
    /* 캔버스로 못 찍으면(외부 그림 등) 빈 받침만 세우고 HTML 그대로 받침 위에 띄운다 */
    return { kind:'html', html:mk };
  } catch(e){ return null; }
}
function disposePlayerSpec(spec){
  if(spec && spec.kind === '3d' && spec.c && typeof spec.c.dispose === 'function' && !spec.disposed){ spec.disposed = true; try { spec.c.dispose(); } catch(e){} }
}

/* ============================================================
   3D 세계 — 마법사의 수학 작업 책상
   ============================================================ */
function buildWorld(k, choices, playerSpec){
  const { scene, rnd, canvasTex, rbox, woodMat, metal, glass, lacquer, faceTex, mathText, MAIN, MATH, r } = k;
  const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const TAU = Math.PI * 2;
  scene.background = new THREE.Color('#3a2414');
  k.env({ wall:'#8b6a4c', intensity:0.85 });
  r.toneMappingExposure = 1.02;

  /* ---- 빛: 왼쪽 뒤 창에서 드는 낮빛(그림자) + 따뜻한 방 반구광 + 책 위의 금빛 ---- */
  scene.add(new THREE.HemisphereLight('#fff4e2', '#5a3a22', 0.62));
  const sun = new THREE.DirectionalLight('#fff0d8', 2.7);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.025; sun.shadow.radius = 4;
  scene.add(sun, sun.target);
  const fill = new THREE.DirectionalLight('#dfe8ff', 0.38); fill.position.set(9, 6, 8); scene.add(fill);
  const bookLight = new THREE.PointLight('#ffc670', 2.2, 6, 1.6); scene.add(bookLight);

  /* ---- 공용 그림 도구 ---- */
  const glowTex = canvasTex(128, 128, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.3, 'rgba(255,255,255,.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  const glowSprite = (color, size, opacity) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map:glowTex, color, transparent:true, opacity:opacity == null ? 1 : opacity, depthWrite:false, blending:THREE.AdditiveBlending })); s.scale.set(size, size, 1); return s; };
  const shadowTex = canvasTex(128, 128, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); gr.addColorStop(0, 'rgba(30,14,4,.5)'); gr.addColorStop(0.55, 'rgba(30,14,4,.22)'); gr.addColorStop(1, 'rgba(30,14,4,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  const blob = (sx, sz, op) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(sx, sz), new THREE.MeshBasicMaterial({ map:shadowTex, transparent:true, opacity:op == null ? 1 : op, depthWrite:false })); m.rotation.x = -Math.PI / 2; m.position.y = 0.004; m.renderOrder = 1; return m; };
  const cast = o => { o.traverse(m => { if(m.isMesh && !m.userData.noShadow){ m.castShadow = true; m.receiveShadow = true; } }); return o; };
  const flat = (mesh, y) => { mesh.rotation.x = -Math.PI / 2; mesh.position.y = y; return mesh; };
  /* 종이 결 */
  const paperBase = (g, w, h, base, fib) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    for(let i = 0; i < (fib || 5000); i++){ g.fillStyle = `rgba(${120 + rnd() * 60},${95 + rnd() * 50},${60 + rnd() * 30},${rnd() * 0.06})`; g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 2.5, 1 + rnd() * 6); }
  };
  const agedEdge = (g, w, h, a) => { const gr = g.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.72); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, `rgba(120,78,30,${a == null ? 0.3 : a})`); g.fillStyle = gr; g.fillRect(0, 0, w, h); };
  /* 가죽(책 표지) — 결 + 금박 테두리 */
  const leatherTex = (base, w, h, o) => canvasTex(w, h, (g) => {
    o = o || {};
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    for(let i = 0; i < 16000; i++){ const v = rnd(); g.fillStyle = v < 0.5 ? `rgba(0,0,0,${rnd() * 0.12})` : `rgba(255,220,190,${rnd() * 0.05})`; g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 2, 1 + rnd() * 2); }
    const gr = g.createRadialGradient(w * 0.4, h * 0.35, 10, w / 2, h / 2, Math.max(w, h) * 0.7); gr.addColorStop(0, 'rgba(255,220,180,.10)'); gr.addColorStop(1, 'rgba(0,0,0,.35)'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    const gold = g.createLinearGradient(0, 0, w, h); gold.addColorStop(0, '#f6dc8c'); gold.addColorStop(0.5, '#c8963c'); gold.addColorStop(1, '#f0d07c');
    g.strokeStyle = gold; const m = o.inset || w * 0.06;
    g.lineWidth = w * 0.012; g.strokeRect(m, m, w - m * 2, h - m * 2);
    g.lineWidth = w * 0.005; g.strokeRect(m * 1.5, m * 1.5, w - m * 3, h - m * 3);
    if(o.draw) o.draw(g, w, h, gold);
  });

  /* ---- 책상: 넓은 판자 + 나뭇결 ---- */
  const deskTex = canvasTex(1024, 1024, (g, w, h) => {
    const planks = 4, ph = h / planks;
    for(let p = 0; p < planks; p++){
      const tone = [[108, 66, 36], [98, 59, 31], [113, 70, 39], [102, 62, 33]][p];
      g.fillStyle = `rgb(${tone[0]},${tone[1]},${tone[2]})`; g.fillRect(0, p * ph, w, ph);
      for(let i = 0; i < 120; i++){
        const y = p * ph + rnd() * ph;
        g.strokeStyle = `rgba(${55 + rnd() * 30},${30 + rnd() * 18},${12 + rnd() * 10},${0.1 + rnd() * 0.28})`;
        g.lineWidth = 0.6 + rnd() * 2.6; g.beginPath(); g.moveTo(0, y);
        for(let x = 0; x <= w; x += 32) g.lineTo(x, y + Math.sin(x / (120 + p * 20) + i) * 4 + Math.sin(x / 33 + i * 3) * 1.4);
        g.stroke();
      }
      /* 옹이 하나 */
      if(p % 2 === 0){ const kx = rnd() * w, ky = p * ph + ph * (0.3 + rnd() * 0.4);
        for(let j = 0; j < 7; j++){ g.strokeStyle = `rgba(60,32,14,${0.25 - j * 0.03})`; g.lineWidth = 2; g.beginPath(); g.ellipse(kx, ky, 8 + j * 9, 4 + j * 3.5, 0, 0, TAU); g.stroke(); } }
      g.fillStyle = 'rgba(40,20,8,.75)'; g.fillRect(0, p * ph, w, 3);
      g.fillStyle = 'rgba(255,220,180,.10)'; g.fillRect(0, p * ph + 3, w, 2);
    }
  }, [5, 4]);
  const desk = flat(new THREE.Mesh(new THREE.PlaneGeometry(80, 64), new THREE.MeshStandardMaterial({ map:deskTex, roughness:0.5, metalness:0 })), 0);
  desk.receiveShadow = true; scene.add(desk);

  /* 가운데 가죽 책상 매트(초록 가죽 + 금박 테) — 책을 받쳐 중심을 잡는다 */
  const matTex = leatherTex('#2f4b3b', 1024, 720, { inset:34 });
  const deskMat = new THREE.Mesh(rbox(1, 0.03, 1, 0.02), new THREE.MeshStandardMaterial({ color:'#26392d', roughness:0.7 }));
  deskMat.receiveShadow = true; scene.add(deskMat);
  const deskMatTop = flat(new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshStandardMaterial({ map:matTex, roughness:0.62 })), 0.0305);
  deskMatTop.receiveShadow = true; scene.add(deskMatTop);

  const brass = metal('#c9a050', 0.32);
  const darkBrass = metal('#8a6a30', 0.45);
  const gold = metal('#e2b457', 0.25);

  /* 반짝이 가루(점 한 벌) — 햇살 속 먼지 · 책에서 오르는 금가루 */
  const points = (n, colors, speed, sizeK) => {
    const pos = new Float32Array(n * 3), ph = new Float32Array(n), col = new Float32Array(n * 3);
    for(let i = 0; i < n; i++){ pos.set([rnd() - 0.5, rnd(), rnd() - 0.5], i * 3); ph[i] = rnd() * 100; const c = colors[i % colors.length]; col.set([c.r, c.g, c.b], i * 3); }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('ph', new THREE.BufferAttribute(ph, 1)); geo.setAttribute('col', new THREE.BufferAttribute(col, 3));
    const mat = new THREE.ShaderMaterial({ transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,
      uniforms:{ t:{ value:0 }, box:{ value:new THREE.Vector3(1, 1, 1) }, ctr:{ value:new THREE.Vector3() }, px:{ value:300 }, sp:{ value:speed }, sk:{ value:sizeK }, sh:{ value:new THREE.Vector2(0, 0) } },
      vertexShader:`attribute float ph; attribute vec3 col; uniform float t; uniform vec3 box; uniform vec3 ctr; uniform float px; uniform float sp; uniform float sk; uniform vec2 sh; varying vec3 vC; varying float vA;
        void main(){ vec3 p = position; float y = fract(p.y + t * sp * (.6 + fract(ph) * .8));
          vec3 w = ctr + vec3(p.x * box.x + sin(t * .31 + ph) * .35 + sh.x * y * box.y, y * box.y, p.z * box.z + cos(t * .27 + ph) * .35 + sh.y * y * box.y);
          vA = sin(y * 3.14159) * (.55 + .45 * sin(t * 1.9 + ph * 7.)); vC = col; vec4 mv = modelViewMatrix * vec4(w, 1.);
          gl_PointSize = px * sk * (.6 + fract(ph * 3.7) * .8) / -mv.z; gl_Position = projectionMatrix * mv; }`,
      fragmentShader:'varying vec3 vC; varying float vA; void main(){ float d = length(gl_PointCoord - .5); float a = smoothstep(.5, 0., d); a *= a; gl_FragColor = vec4(vC * a * vA, a * vA); }' });
    const pts = new THREE.Points(geo, mat); pts.frustumCulled = false; pts.renderOrder = 5; scene.add(pts);
    return mat;
  };

  /* ============ 물건들 ============ */
  const makers = {};

  /* 이어서 모험 — 펼쳐진 오래된 마법책 */
  makers.continue = () => {
    const g = new THREE.Group(); const anim = [];
    const PW = 2.12, PD = 2.86, N = 28;
    const top = u => 0.2 + 0.085 * Math.sin(Math.min(1, u * 1.9) * Math.PI / 2) - 0.022 * u;  /* 제본 쪽이 낮고 가운데가 부푼 책장 */
    /* 표지(가죽) */
    const coverMat = new THREE.MeshStandardMaterial({ color:'#6b2a1f', roughness:0.6 });
    [-1, 1].forEach(sx => { const c = new THREE.Mesh(rbox(PW + 0.16, 0.05, PD + 0.2, 0.05), [coverMat, coverMat]); c.position.set(sx * (PW + 0.16) / 2, 0, 0); g.add(c); });
    const spine = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, PD + 0.2, 16, 1, false, Math.PI / 2, Math.PI), new THREE.MeshStandardMaterial({ color:'#5a2019', roughness:0.6 }));
    spine.rotation.x = Math.PI / 2; spine.position.y = 0.05; g.add(spine);
    /* 책장 뭉치(옆면에 층층이 종이 결) */
    const edgeTex = canvasTex(64, 256, (gg, w, h) => { gg.fillStyle = '#efe3c4'; gg.fillRect(0, 0, w, h); for(let y = 0; y < h; y += 3){ gg.fillStyle = `rgba(150,115,70,${0.08 + rnd() * 0.18})`; gg.fillRect(0, y, w, 1); } });
    const edgeMat = new THREE.MeshStandardMaterial({ map:edgeTex, roughness:0.9 });
    [-1, 1].forEach(sx => {
      const sh = new THREE.Shape(); sh.moveTo(0, 0.05); sh.lineTo(sx * PW, 0.05);
      for(let i = N; i >= 0; i--){ const u = i / N; sh.lineTo(sx * u * PW, top(u)); }
      sh.closePath();
      const geo = new THREE.ExtrudeGeometry(sh, { depth:PD, bevelEnabled:false, curveSegments:4 }); geo.translate(0, 0, -PD / 2);
      g.add(new THREE.Mesh(geo, edgeMat));
    });
    /* 책장 그림 — 먹(어두운 잉크) + 금빛 잉크(빛난다). 같은 그림을 두 번 그려 금빛만 따로 빛나게 */
    const pageArt = (side, glow) => canvasTex(768, 1036, (gg, w, h) => {
      if(glow){ gg.fillStyle = '#000'; gg.fillRect(0, 0, w, h); }
      else { paperBase(gg, w, h, '#f3e8cc', 5000); agedEdge(gg, w, h, 0.28);
        /* 제본 쪽 그늘 */
        const gx = side > 0 ? 0 : w, gr = gg.createLinearGradient(gx, 0, gx + side * w * 0.16, 0); gr.addColorStop(0, 'rgba(90,60,25,.35)'); gr.addColorStop(1, 'rgba(90,60,25,0)'); gg.fillStyle = gr; gg.fillRect(0, 0, w, h); }
      const ink = glow ? 'rgba(0,0,0,0)' : '#2c1d10', gold2 = glow ? '#ffcf6a' : '#b8862e';
      gg.lineCap = 'round'; gg.lineJoin = 'round'; gg.textBaseline = 'middle';
      if(side < 0){
        /* 왼쪽: 원 안의 별(오각별) + π 와 수식 */
        const cx = w * 0.52, cy = h * 0.4, R = w * 0.3;
        gg.strokeStyle = gold2; gg.lineWidth = 7; gg.beginPath(); gg.arc(cx, cy, R, 0, TAU); gg.stroke();
        gg.lineWidth = 5; gg.beginPath(); for(let i = 0; i <= 5; i++){ const a = -Math.PI / 2 + i * 4 * Math.PI / 5; const x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R; i ? gg.lineTo(x, y) : gg.moveTo(x, y); } gg.stroke();
        gg.lineWidth = 2.5; gg.beginPath(); gg.arc(cx, cy, R * 1.12, 0, TAU); gg.stroke();
        for(let i = 0; i < 12; i++){ const a = i / 12 * TAU; gg.beginPath(); gg.moveTo(cx + Math.cos(a) * R * 1.12, cy + Math.sin(a) * R * 1.12); gg.lineTo(cx + Math.cos(a) * R * 1.2, cy + Math.sin(a) * R * 1.2); gg.stroke(); }
        gg.fillStyle = gold2; mathText(gg, 'π', cx, cy + 4, 92, { align:'center' });
        gg.fillStyle = ink; mathText(gg, '1 + 2 = 3', w * 0.5, h * 0.77, 72, { align:'center' });
        mathText(gg, '3 × 4 = 12', w * 0.5, h * 0.89, 64, { align:'center' });
      } else {
        /* 오른쪽: 피보나치 사각형 + 금빛 나선 */
        const u = 40, ox = w * 0.16, oy = h * 0.1;
        const sq = [[0, 5, 8, 8], [8, 5, 5, 5], [11, 10, 2, 2], [11, 12, 1, 1], [12, 12, 1, 1], [8, 10, 3, 3]];
        /* 13×8 판에 1·1·2·3·5·8 사각형 */
        const boxes = [[0, 0, 8, 8, '8'], [8, 0, 5, 5, '5'], [10, 5, 3, 3, '3'], [8, 6, 2, 2, '2'], [8, 5, 1, 1, '1'], [9, 5, 1, 1, '1']];
        void sq;
        gg.strokeStyle = glow ? 'rgba(0,0,0,0)' : 'rgba(44,29,16,.9)'; gg.lineWidth = 5;
        boxes.forEach(([x, y, bw, bh, n]) => { gg.strokeRect(ox + x * u, oy + y * u * 1.0, bw * u, bh * u); if(!glow && bw > 1){ gg.fillStyle = ink; mathText(gg, n, ox + (x + bw / 2) * u, oy + (y + bh / 2) * u, Math.min(64, bw * u * 0.45), { align:'center' }); } });
        gg.strokeStyle = gold2; gg.lineWidth = 6; gg.beginPath();
        const arcs = [[8, 8, 8, Math.PI, Math.PI * 1.5], [8, 5, 5, Math.PI * 1.5, TAU], [10, 5, 3, 0, Math.PI * 0.5], [10, 6, 2, Math.PI * 0.5, Math.PI]];
        arcs.forEach(([x, y, rr, a0, a1]) => gg.arc(ox + x * u, oy + y * u, rr * u, a0, a1)); gg.stroke();
        gg.fillStyle = ink; mathText(gg, '1, 1, 2, 3, 5, 8', w * 0.52, h * 0.55, 62, { align:'center' });
        gg.fillStyle = gold2; mathText(gg, '∞', w * 0.5, h * 0.68, 110, { align:'center' });
        gg.fillStyle = ink; mathText(gg, 'a + b = b + a', w * 0.52, h * 0.88, 64, { align:'center' });
      }
    });
    const pageGeo = (sx) => {
      const pos = [], uv = [], idx = [];
      for(let i = 0; i <= N; i++){ const u = i / N; const x = sx * u * PW;
        for(let j = 0; j <= 1; j++){ pos.push(x, top(u) + 0.002, -PD / 2 + j * PD); uv.push(sx > 0 ? u : 1 - u, 1 - j); } }
      for(let i = 0; i < N; i++){ const a = i * 2, b = a + 1, c = a + 2, d = a + 3;
        if(sx > 0) idx.push(a, b, c, c, b, d); else idx.push(a, c, b, b, c, d); }
      const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geo.setIndex(idx); geo.computeVertexNormals();
      return geo;
    };
    const texL = pageArt(-1), texR = pageArt(1), gloL = pageArt(-1, true), gloR = pageArt(1, true);
    const pageMat = (map, em) => new THREE.MeshStandardMaterial({ map, emissive:'#ffffff', emissiveMap:em, emissiveIntensity:0.9, roughness:0.88 });
    const matL = pageMat(texL, gloL), matR = pageMat(texR, gloR);
    g.add(new THREE.Mesh(pageGeo(-1), matL), new THREE.Mesh(pageGeo(1), matR));
    /* 넘어가는 한 장 — 앞면 = 오른쪽 그림, 뒷면 = 왼쪽 그림(거울). 다 넘어가면 숨긴다 → 밑의 그림과 같아 이음매가 없다 */
    const tp = new THREE.BufferGeometry();
    const tpos = new Float32Array((N + 1) * 2 * 3), tuv = [], tidx = [];
    for(let i = 0; i <= N; i++){ for(let j = 0; j <= 1; j++) tuv.push(i / N, 1 - j); }
    for(let i = 0; i < N; i++){ const a = i * 2; tidx.push(a, a + 1, a + 2, a + 2, a + 1, a + 3); }
    tp.setAttribute('position', new THREE.BufferAttribute(tpos, 3)); tp.setAttribute('uv', new THREE.Float32BufferAttribute(tuv, 2)); tp.setIndex(tidx);
    const backL = texL.clone(); backL.needsUpdate = true; backL.repeat.set(-1, 1); backL.offset.set(1, 0);
    const backLg = gloL.clone(); backLg.needsUpdate = true; backLg.repeat.set(-1, 1); backLg.offset.set(1, 0);
    const tFront = new THREE.Mesh(tp, pageMat(texR, gloR)); tFront.material.side = THREE.FrontSide;
    const tBack = new THREE.Mesh(tp, pageMat(backL, backLg)); tBack.material.side = THREE.BackSide;
    tFront.visible = tBack.visible = false; tFront.userData.noShadow = true; tBack.userData.noShadow = true;
    g.add(tFront, tBack);
    const turnAt = th => {
      const bend = 0.95 * Math.sin(th);
      let x = 0, y = top(0) + 0.006; const ds = PW / N;
      for(let i = 0; i <= N; i++){
        const u = i / N;
        for(let j = 0; j <= 1; j++){ const q = (i * 2 + j) * 3; tpos[q] = x; tpos[q + 1] = y; tpos[q + 2] = -PD / 2 + j * PD; }
        /* 제본 쪽은 θ 로 서고, 끝으로 갈수록 늦게 따라온다(종이가 휜다). 누운 자리에서는 책장 곡선을 따른다 */
        const a = th - bend * u;
        const flatA = Math.atan2(top(Math.min(1, u + 1 / N)) - top(u), ds);
        const aa = a + flatA * (1 - 2 * th / Math.PI);
        x += Math.cos(aa) * ds; y += Math.sin(aa) * ds;
      }
      tp.attributes.position.needsUpdate = true; tp.computeVertexNormals(); tp.computeBoundingSphere();
    };
    turnAt(0);
    const PERIOD = 9, DUR = 2.1, START = 4.5;
    anim.push(t => {
      const p = ((t - START) % PERIOD + PERIOD) % PERIOD;
      if(t > START && p < DUR){ const e = p / DUR, s = e < 0.5 ? 2 * e * e : 1 - Math.pow(-2 * e + 2, 2) / 2;
        turnAt(Math.PI * s); tFront.visible = tBack.visible = true; }
      else if(tFront.visible){ tFront.visible = tBack.visible = false; }
    });
    /* 빨간 책갈피 끈 — 제본에서 나와 앞으로 늘어진다 */
    const rib = new THREE.Mesh(new THREE.PlaneGeometry(0.09, 1.0, 1, 16), new THREE.MeshStandardMaterial({ color:'#a3221c', roughness:0.55, side:THREE.DoubleSide }));
    { const p = rib.geometry.attributes.position, z0 = 0.35, z1 = PD / 2 + 0.55;
      for(let i = 0; i < p.count; i++){ const f = 0.5 - p.getY(i), z = z0 + f * (z1 - z0), x = p.getX(i) + 0.06 + f * 0.12;
        const over = z - PD / 2, y = over < 0 ? top(0.03) + 0.008 : Math.max(0.006, top(0.03) + 0.008 - over * 1.8 + over * over * 1.2 * (over < 0.12 ? 1 : 0));
        p.setXYZ(i, x, y, z); } rib.geometry.computeVertexNormals(); }
    g.add(rib);
    /* 금빛 — 책장 위로 은은한 빛 + 오르는 금가루 */
    const gl = glowSprite('#ffc95e', 4.2, 0.14); gl.position.set(0, 0.7, 0); g.add(gl);
    anim.push(t => { gl.material.opacity = 0.12 + Math.sin(t * 1.2) * 0.035; });
    cast(g); rib.castShadow = false;
    return { g, anim, h:0.5, w:PW * 2 + 0.34, d:PD + 0.25, anchor:V3(0, 0.3, 0.5), anchorBelow:V3(0, 0.05, PD / 2 + 0.2), place:'below', glowAt:V3(0, 0.9, 0) };
  };

  /* 진단하기 — 지도 위의 놋쇠 나침반 + 돋보기 */
  makers.diag = () => {
    const g = new THREE.Group(); const anim = [];
    const mapT = canvasTex(1024, 780, (gg, w, h) => {
      paperBase(gg, w, h, '#ecdcb6', 6000); agedEdge(gg, w, h, 0.4);
      gg.strokeStyle = 'rgba(110,80,40,.18)'; gg.lineWidth = 2;
      for(let x = 0; x < w; x += 86){ gg.beginPath(); gg.moveTo(x, 0); gg.lineTo(x, h); gg.stroke(); }
      for(let y = 0; y < h; y += 86){ gg.beginPath(); gg.moveTo(0, y); gg.lineTo(w, y); gg.stroke(); }
      /* 등고선 섬 두 개 */
      [[w * 0.3, h * 0.35, 190, 120], [w * 0.74, h * 0.66, 170, 110]].forEach(([cx, cy, rx, ry], k2) => {
        for(let j = 0; j < 5; j++){ gg.strokeStyle = `rgba(${k2 ? '70,120,90' : '120,90,50'},${0.55 - j * 0.07})`; gg.lineWidth = 3; gg.beginPath();
          for(let a = 0; a <= 64; a++){ const an = a / 64 * TAU, wob = 1 + Math.sin(an * 3 + j + k2) * 0.08 + Math.sin(an * 5 + k2 * 2) * 0.05; const f = 1 - j * 0.17;
            const x = cx + Math.cos(an) * rx * f * wob, y = cy + Math.sin(an) * ry * f * wob; a ? gg.lineTo(x, y) : gg.moveTo(x, y); }
          gg.closePath(); gg.stroke(); } });
      /* 점선 길 + ✕ */
      gg.strokeStyle = '#8a3b1c'; gg.lineWidth = 6; gg.setLineDash([16, 13]); gg.beginPath(); gg.moveTo(w * 0.12, h * 0.82); gg.bezierCurveTo(w * 0.35, h * 0.62, w * 0.45, h * 0.9, w * 0.62, h * 0.55); gg.bezierCurveTo(w * 0.7, h * 0.4, w * 0.82, h * 0.35, w * 0.88, h * 0.22); gg.stroke(); gg.setLineDash([]);
      gg.strokeStyle = '#b3261a'; gg.lineWidth = 10; gg.beginPath(); gg.moveTo(w * 0.86, h * 0.17); gg.lineTo(w * 0.91, h * 0.27); gg.moveTo(w * 0.91, h * 0.17); gg.lineTo(w * 0.86, h * 0.27); gg.stroke();
      /* 모서리 나침반 장미 */
      const cx = w * 0.12, cy = h * 0.18; gg.fillStyle = 'rgba(80,55,25,.6)'; gg.beginPath();
      for(let i = 0; i < 8; i++){ const a = i / 8 * TAU - Math.PI / 2, rr = i % 2 ? 16 : 58; const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr; i ? gg.lineTo(x, y) : gg.moveTo(x, y); } gg.closePath(); gg.fill();
      gg.fillStyle = '#5a3a16'; gg.textAlign = 'center'; gg.font = `700 34px ${MAIN}`; gg.fillText('N', cx, cy - 78);
    });
    const map = new THREE.Mesh(new THREE.PlaneGeometry(2.55, 1.94, 30, 20), new THREE.MeshStandardMaterial({ map:mapT, roughness:0.92 }));
    { const p = map.geometry.attributes.position; for(let i = 0; i < p.count; i++) p.setZ(i, (Math.sin(p.getX(i) * 2.1) * 0.012 + Math.cos(p.getY(i) * 2.7) * 0.01) + 0.018 + Math.pow(Math.abs(p.getX(i)) / 1.27, 6) * 0.05); map.geometry.computeVertexNormals(); }
    flat(map, 0); map.rotation.z = 0.06; g.add(map);
    /* 놋쇠 나침반 */
    const cmp = new THREE.Group(); cmp.position.set(-0.35, 0.03, 0.05);
    const faceT = canvasTex(512, 512, (gg, w, h) => { const cx = w / 2, cy = h / 2;
      const gr = gg.createRadialGradient(cx, cy, 10, cx, cy, w / 2); gr.addColorStop(0, '#fbf3de'); gr.addColorStop(1, '#e4d09c'); gg.fillStyle = gr; gg.fillRect(0, 0, w, h);
      gg.strokeStyle = '#6a4a1e'; gg.lineWidth = 6; gg.beginPath(); gg.arc(cx, cy, w * 0.45, 0, TAU); gg.stroke();
      for(let i = 0; i < 48; i++){ const a = i / 48 * TAU, r1 = w * 0.45, r2 = r1 - (i % 4 ? 12 : 28); gg.lineWidth = i % 4 ? 2 : 4; gg.beginPath(); gg.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); gg.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2); gg.stroke(); }
      gg.fillStyle = 'rgba(122,90,42,.28)'; gg.beginPath(); for(let i = 0; i < 16; i++){ const a = i / 16 * TAU - Math.PI / 2, rr = i % 2 ? w * 0.07 : (i % 4 ? w * 0.18 : w * 0.3); const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr; i ? gg.lineTo(x, y) : gg.moveTo(x, y); } gg.fill();
      gg.fillStyle = '#4a2f10'; gg.textAlign = 'center'; gg.textBaseline = 'middle'; gg.font = `700 60px ${MAIN}`;
      [['N', 0, -1], ['E', 1, 0], ['S', 0, 1], ['W', -1, 0]].forEach(([s, x, y]) => gg.fillText(s, cx + x * w * 0.33, cy + y * w * 0.33)); });
    const R = 0.52;
    const caseM = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.06, R + 0.08, 0.16, 48), brass); caseM.position.y = 0.08; cmp.add(caseM);
    const face = flat(new THREE.Mesh(new THREE.CircleGeometry(R, 48), new THREE.MeshStandardMaterial({ map:faceT, roughness:0.5 })), 0.163); cmp.add(face);
    const bezel = new THREE.Mesh(new THREE.TorusGeometry(R + 0.03, 0.045, 12, 48), gold); bezel.rotation.x = Math.PI / 2; bezel.position.y = 0.175; cmp.add(bezel);
    const lensC = flat(new THREE.Mesh(new THREE.CircleGeometry(R, 40), new THREE.MeshPhysicalMaterial({ color:'#ffffff', roughness:0.05, transparent:true, opacity:0.1, clearcoat:1 })), 0.2); lensC.userData.noShadow = true; cmp.add(lensC);
    const ringTop = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.03, 10, 24), brass); ringTop.position.set(0, 0.1, -(R + 0.14)); cmp.add(ringTop);
    const needle = new THREE.Group(); needle.position.y = 0.172;
    const nG = (col, dir) => { const sh = new THREE.Shape(); sh.moveTo(-0.055, 0); sh.lineTo(0, dir * 0.42); sh.lineTo(0.055, 0); sh.closePath();
      const m = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth:0.012, bevelEnabled:false }), new THREE.MeshStandardMaterial({ color:col, roughness:0.4, metalness:0.3 })); m.rotation.x = -Math.PI / 2; return m; };
    needle.add(nG('#c42c26', 1), nG('#f1ece2', -1));
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.03, 12), gold); pin.position.y = 0.01; needle.add(pin);
    cmp.add(needle); g.add(cmp);
    anim.push(t => { needle.rotation.y = Math.sin(t * 0.7) * 0.35 + Math.sin(t * 2.1) * 0.06; });
    needle.rotation.y = 0.18;
    /* 돋보기 — 놋쇠 테 + 유리 + 나무 손잡이 */
    const mg = new THREE.Group(); mg.position.set(0.62, 0.05, 0.28); mg.rotation.y = -0.7;
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.04, 12, 40), brass); rim.rotation.x = Math.PI / 2; rim.position.y = 0.05; mg.add(rim);
    const lens = flat(new THREE.Mesh(new THREE.CircleGeometry(0.31, 36), new THREE.MeshPhysicalMaterial({ color:'#eef6ff', roughness:0.03, transparent:true, opacity:0.16, clearcoat:1 })), 0.05); lens.userData.noShadow = true; mg.add(lens);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.16, 12), brass); neck.rotation.z = Math.PI / 2; neck.position.set(0.42, 0.05, 0); mg.add(neck);
    const handle = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.42, 6, 14), woodMat('#5a321a', [30, 14, 6])); handle.rotation.z = Math.PI / 2; handle.position.set(0.76, 0.05, 0); mg.add(handle);
    g.add(mg);
    cast(g); map.castShadow = false;
    return { g, anim, h:0.35, w:2.6, d:2.0, anchor:V3(0, 0, 1.0) };
  };

  /* 게임 모드 — 보드게임 상자(판이 인쇄된 뚜껑) + 숫자 주사위 + 나무 말 */
  makers.game = () => {
    const g = new THREE.Group(); const anim = [];
    const S = 2.3, H = 0.26;
    const boardT = canvasTex(1024, 1024, (gg, w, h) => {
      gg.fillStyle = '#f4ead2'; gg.fillRect(0, 0, w, h);
      const cols = ['#d94b3d', '#f0b43c', '#3f8f5a', '#3c6fc4'];
      const n = 7, cell = w / n;
      let k2 = 0;
      const cells = [];
      for(let i = 0; i < n; i++) cells.push([i, 0]);
      for(let i = 1; i < n; i++) cells.push([n - 1, i]);
      for(let i = n - 2; i >= 0; i--) cells.push([i, n - 1]);
      for(let i = n - 2; i >= 1; i--) cells.push([0, i]);
      cells.forEach(([cx, cy]) => {
        gg.fillStyle = cols[k2 % 4]; gg.fillRect(cx * cell + 6, cy * cell + 6, cell - 12, cell - 12);
        gg.fillStyle = 'rgba(255,255,255,.92)'; gg.beginPath(); gg.arc(cx * cell + cell / 2, cy * cell + cell / 2, cell * 0.3, 0, TAU); gg.fill();
        gg.fillStyle = '#2b2118'; gg.textBaseline = 'middle'; mathText(gg, String(k2 + 1), cx * cell + cell / 2, cy * cell + cell / 2 + 2, cell * 0.34, { align:'center' });
        k2++; });
      /* 가운데 — 네 연산 기호 */
      const c0 = w / 2; gg.fillStyle = '#1f3a5c'; gg.beginPath(); gg.arc(c0, c0, w * 0.27, 0, TAU); gg.fill();
      gg.strokeStyle = '#f0c95e'; gg.lineWidth = 8; gg.beginPath(); gg.arc(c0, c0, w * 0.25, 0, TAU); gg.stroke();
      [['+', -1, -1, '#f59a8c'], ['−', 1, -1, '#f5d58c'], ['×', -1, 1, '#9fd6ae'], ['÷', 1, 1, '#9ec0f0']].forEach(([s, sx, sy, col]) => {
        gg.fillStyle = col; mathText(gg, s, c0 + sx * w * 0.1, c0 + sy * w * 0.1 + 6, w * 0.13, { align:'center' }); });
    });
    const sideT = canvasTex(512, 64, (gg, w, h) => { gg.fillStyle = '#1f3a5c'; gg.fillRect(0, 0, w, h); gg.fillStyle = '#f0c95e'; gg.fillRect(0, h * 0.42, w, h * 0.16); });
    const sideMat = new THREE.MeshStandardMaterial({ map:sideT, roughness:0.55 });
    const box = new THREE.Mesh(rbox(S, H, S, 0.04), sideMat); g.add(box);
    const lidTop = flat(new THREE.Mesh(new THREE.PlaneGeometry(S - 0.06, S - 0.06), new THREE.MeshPhysicalMaterial({ map:boardT, roughness:0.4, clearcoat:0.5, clearcoatRoughness:0.3 })), H + 0.002); g.add(lidTop);
    /* 주사위 두 개 — 면마다 숫자 */
    const dice = [];
    [[['1', '2', '3', '4', '5', '6'], '#fbf7ee', '#c3362c', V3(-0.42, 0, 0.35), 0.4], [['7', '8', '9', '0', '+', '='], '#fbf7ee', '#1f5aa8', V3(0.34, 0, 0.12), 0.36]].forEach(([faces, bg, fg, p, s], i) => {
      const mats = faces.map(n => new THREE.MeshPhysicalMaterial({ map:faceTex(n, { bg, color:fg, size:300 }), roughness:0.3, clearcoat:0.7, clearcoatRoughness:0.2 }));
      const geo = new THREE.BoxGeometry(s, s, s, 6, 6, 6);
      { const pp = geo.attributes.position, v = new THREE.Vector3(), inr = new THREE.Vector3(), hh = s / 2, rr = s * 0.12;
        for(let j = 0; j < pp.count; j++){ v.fromBufferAttribute(pp, j);
          inr.set(Math.max(-hh + rr, Math.min(hh - rr, v.x)), Math.max(-hh + rr, Math.min(hh - rr, v.y)), Math.max(-hh + rr, Math.min(hh - rr, v.z)));
          v.sub(inr); if(v.lengthSq() > 1e-9) v.setLength(rr); v.add(inr); pp.setXYZ(j, v.x, v.y, v.z); }
        geo.computeVertexNormals(); }
      const c = new THREE.Mesh(geo, mats); const base = p.clone(); base.y = H + s / 2;
      c.position.copy(base); c.rotation.y = i ? 0.5 : -0.3; g.add(c);
      dice.push({ c, base, s, q0:c.quaternion.clone(), phase:i * 3.1 });
    });
    const _q = new THREE.Quaternion(), _ax = new THREE.Vector3();
    dice.forEach((D, i) => {
      let rolling = -1, from = new THREE.Quaternion(), axis = new THREE.Vector3(1, 0, 0), dir = 1, px0 = 0, pz0 = 0;
      anim.push(t => {
        const PER = 7, DUR = 0.9, st = 2.2 + D.phase;
        const p = ((t - st) % PER + PER) % PER, cyc = Math.floor((t - st) / PER);
        if(t > st && p < DUR){
          if(rolling !== cyc){ rolling = cyc; from.copy(D.c.quaternion); const alongX = (cyc + i) % 2 === 0; axis.set(alongX ? 0 : 1, 0, alongX ? 1 : 0); dir = (Math.floor(cyc / 2) % 2 ? 1 : -1); px0 = D.c.position.x; pz0 = D.c.position.z; }
          const e = 1 - Math.pow(1 - p / DUR, 3);
          _q.setFromAxisAngle(_ax.copy(axis), -dir * Math.PI * e); D.c.quaternion.copy(_q).multiply(from);
          const hop = Math.sin(Math.min(1, p / DUR) * Math.PI) * 0.35;
          const mv = D.s * 1.2 * e * dir;
          D.c.position.set(px0 + (axis.z ? mv : 0), D.base.y + hop, pz0 + (axis.x ? -mv : 0));
        } else if(rolling >= 0 && p >= DUR && p < DUR + 0.1){
          _q.setFromAxisAngle(_ax.copy(axis), -dir * Math.PI); D.c.quaternion.copy(_q).multiply(from); D.c.position.y = D.base.y;
        }
      });
    });
    /* 나무 말(볼링핀 모양) 세 개 */
    const pawnGeo = new THREE.LatheGeometry([[0, 0], [0.13, 0], [0.13, 0.03], [0.07, 0.08], [0.05, 0.22], [0.09, 0.28], [0.085, 0.36], [0.04, 0.41], [0, 0.42]].map(([x, y]) => new THREE.Vector2(x, y)), 20);
    [['#d94b3d', -0.78, -0.72], ['#3f8f5a', -0.52, -0.84], ['#f0b43c', 0.8, 0.8]].forEach(([col, x, z]) => {
      const pw = new THREE.Mesh(pawnGeo, lacquer(col)); pw.position.set(x, H, z); g.add(pw); });
    cast(g); lidTop.castShadow = false;
    return { g, anim, h:0.7, w:S, d:S, anchor:V3(0, 0, S / 2 + 0.05) };
  };

  /* 학습지 모드 — 가지런한 학습지 묶음 + 연필(가끔 톡톡) */
  makers.sheet = () => {
    const g = new THREE.Group(); const anim = [];
    const SW = 1.62, SD = 2.22;
    const sheetT = (lines, answers) => canvasTex(740, 1014, (gg, w, h) => {
      paperBase(gg, w, h, '#fbf7ec', 2500);
      gg.fillStyle = '#2f5d8a'; gg.fillRect(0, 0, w, 74);
      gg.fillStyle = '#f5d98a'; gg.textBaseline = 'middle'; mathText(gg, '★', 38, 40, 40, { align:'center' });
      gg.fillStyle = 'rgba(255,255,255,.85)'; gg.fillRect(w - 250, 26, 210, 4); gg.fillRect(80, 26, 120, 4);
      gg.strokeStyle = 'rgba(60,90,150,.28)'; gg.lineWidth = 2;
      lines.forEach((l, i) => {
        const y = 150 + i * 138;
        gg.beginPath(); gg.moveTo(40, y + 50); gg.lineTo(w - 40, y + 50); gg.stroke();
        gg.fillStyle = 'rgba(47,93,138,.75)'; mathText(gg, `${i + 1}.`, 44, y, 34, { align:'left', weight:400 });
        gg.fillStyle = '#2a2016'; mathText(gg, l, 110, y, 50, { align:'left' });
        if(answers && answers[i] != null){
          const aw = mathText(gg, l, 0, 0, 50, { draw:false });
          gg.fillStyle = '#3a4fb0'; mathText(gg, answers[i], 128 + aw, y + 2, 50, { align:'left', weight:400 });
          gg.strokeStyle = 'rgba(200,40,34,.85)'; gg.lineWidth = 5; gg.beginPath(); gg.arc(w - 70, y, 26, 0, TAU); gg.stroke(); gg.strokeStyle = 'rgba(60,90,150,.28)'; gg.lineWidth = 2;
        }
      });
    });
    const sheetGeo = new THREE.PlaneGeometry(SW, SD);
    const edgeMat = new THREE.MeshStandardMaterial({ color:'#f3ecdc', roughness:0.9 });
    /* 밑장들(두께가 보이게 얇은 판 몇 장, 조금씩 어긋나게) */
    [[0.05, -0.06, 0.1], [-0.04, 0.03, -0.05], [0.02, 0.0, 0.03]].forEach(([x, z, rot], i) => {
      const pl = new THREE.Mesh(rbox(SW, 0.018, SD, 0.01), edgeMat); pl.position.set(x, i * 0.02, z); pl.rotation.y = rot; g.add(pl); });
    const under = flat(new THREE.Mesh(sheetGeo, new THREE.MeshStandardMaterial({ map:sheetT(['7 + 8 =', '15 − 9 =', '4 × 6 =', '36 ÷ 6 =', '9 + 7 =', '8 × 3 =']), roughness:0.9 })), 0.041);
    under.position.x = -0.04; under.position.z = 0.03; under.rotation.z = 0.05; g.add(under);
    const topSheet = flat(new THREE.Mesh(sheetGeo, new THREE.MeshStandardMaterial({ map:sheetT(['3 + 4 =', '12 − 5 =', '6 × 3 =', '20 ÷ 4 =', '8 + 6 =', '7 × 7 ='], ['7', '7', '18', '5']), roughness:0.9 })), 0.062);
    topSheet.position.set(0.02, 0.062, 0.0); topSheet.rotation.z = -0.03; g.add(topSheet);
    const clip = new THREE.Mesh(rbox(0.38, 0.03, 0.12, 0.02), metal('#b9bcc2', 0.3)); clip.position.set(-0.3, 0.06, -SD / 2 + 0.02); clip.rotation.y = -0.03; g.add(clip);
    /* 연필 — 육각 노란 몸통 · 놋쇠 쇠붙이 · 분홍 지우개 · 깎은 나무 끝 */
    const pencil = new THREE.Group();
    const L = 1.9, rr = 0.065;
    const body = new THREE.Mesh(new THREE.CylinderGeometry(rr, rr, L, 6), new THREE.MeshPhysicalMaterial({ color:'#f2b632', roughness:0.35, clearcoat:0.6 })); body.rotation.z = Math.PI / 2; pencil.add(body);
    const fer = new THREE.Mesh(new THREE.CylinderGeometry(rr * 1.04, rr * 1.04, 0.14, 16), metal('#c8a24e', 0.3)); fer.rotation.z = Math.PI / 2; fer.position.x = -L / 2 - 0.07; pencil.add(fer);
    const eraser = new THREE.Mesh(new THREE.CylinderGeometry(rr * 0.98, rr * 0.98, 0.14, 16), new THREE.MeshStandardMaterial({ color:'#e88a9a', roughness:0.8 })); eraser.rotation.z = Math.PI / 2; eraser.position.x = -L / 2 - 0.21; pencil.add(eraser);
    const cone = new THREE.Mesh(new THREE.ConeGeometry(rr, 0.26, 6), new THREE.MeshStandardMaterial({ color:'#e7c79a', roughness:0.8 })); cone.rotation.z = -Math.PI / 2; cone.position.x = L / 2 + 0.13; pencil.add(cone);
    const lead = new THREE.Mesh(new THREE.ConeGeometry(rr * 0.32, 0.08, 8), new THREE.MeshStandardMaterial({ color:'#2a2a2e', roughness:0.5 })); lead.rotation.z = -Math.PI / 2; lead.position.x = L / 2 + 0.23; pencil.add(lead);
    /* 지우개 끝을 축으로 — 끝이 들렸다 톡톡 */
    const pivot = new THREE.Group(); pivot.position.set(-0.78, 0.13, 0.62); pivot.rotation.y = 0.62; g.add(pivot);
    pencil.position.x = L / 2 + 0.28; pivot.add(pencil);
    anim.push(t => {
      const PER = 5.5, p = ((t - 1.3) % PER + PER) % PER;
      let lift = 0;
      if(t > 1.3 && p < 1.1){ const k4 = p / 1.1; lift = Math.max(0, Math.sin(k4 * Math.PI * 2)) * 0.09 * (1 - k4 * 0.3); }
      pivot.rotation.z = lift;
    });
    cast(g); topSheet.castShadow = false; under.castShadow = false;
    return { g, anim, h:0.3, w:2.3, d:2.35, anchor:V3(0, 0, 1.2) };
  };

  /* 연산 로드맵 — 펼친 길 지도(오른쪽 끝은 아직 말려 있다) + 번호 이정표 */
  makers.road = () => {
    const g = new THREE.Group(); const anim = [];
    const MW = 2.75, MD = 1.55;
    const P = [[0.08, 0.72], [0.22, 0.34], [0.4, 0.62], [0.55, 0.28], [0.72, 0.6], [0.88, 0.3]];
    const roadT = canvasTex(1400, 790, (gg, w, h) => {
      paperBase(gg, w, h, '#eadbb4', 7000); agedEdge(gg, w, h, 0.35);
      /* 산·숲 도장 */
      for(let i = 0; i < 16; i++){ const x = rnd() * w, y = rnd() * h, s = 18 + rnd() * 16; gg.fillStyle = `rgba(70,120,80,${0.3 + rnd() * 0.25})`; gg.beginPath(); gg.moveTo(x, y - s); gg.lineTo(x + s * 0.8, y + s * 0.6); gg.lineTo(x - s * 0.8, y + s * 0.6); gg.closePath(); gg.fill(); }
      /* 길 */
      const pts = P.map(([u, v]) => [u * w, v * h]);
      const path = () => { gg.beginPath(); gg.moveTo(pts[0][0], pts[0][1]); for(let i = 1; i < pts.length; i++){ const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; gg.bezierCurveTo(x0 + (x1 - x0) * 0.5, y0, x0 + (x1 - x0) * 0.5, y1, x1, y1); } };
      gg.lineCap = 'round'; gg.lineJoin = 'round';
      path(); gg.strokeStyle = 'rgba(110,72,34,.9)'; gg.lineWidth = 46; gg.stroke();
      path(); gg.strokeStyle = '#d9b77c'; gg.lineWidth = 34; gg.stroke();
      path(); gg.strokeStyle = 'rgba(255,248,225,.9)'; gg.lineWidth = 4; gg.setLineDash([18, 16]); gg.stroke(); gg.setLineDash([]);
      /* 이정표 원(3D 말뚝이 없는 자리만 숫자) */
      const col = ['#d94b3d', '#f0b43c', '#3f8f5a', '#3c6fc4', '#8a4fb8', '#d9713d'];
      pts.forEach(([x, y], i) => { gg.fillStyle = '#fbf6e8'; gg.beginPath(); gg.arc(x, y, 44, 0, TAU); gg.fill(); gg.lineWidth = 8; gg.strokeStyle = col[i]; gg.stroke();
        gg.fillStyle = '#2b2118'; gg.textBaseline = 'middle'; mathText(gg, String(i + 1), x, y + 3, 50, { align:'center' }); });
    });
    const map = new THREE.Mesh(new THREE.PlaneGeometry(MW, MD, 30, 12), new THREE.MeshStandardMaterial({ map:roadT, roughness:0.92, side:THREE.DoubleSide }));
    { const p = map.geometry.attributes.position; for(let i = 0; i < p.count; i++){ const x = p.getX(i); p.setZ(i, 0.018 + Math.sin(p.getY(i) * 3) * 0.008 + Math.pow(Math.max(0, x / (MW / 2)), 8) * 0.12); } map.geometry.computeVertexNormals(); }
    flat(map, 0); map.position.x = -0.12; g.add(map);
    /* 말린 끝 */
    const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, MD, 28, 1, true), new THREE.MeshStandardMaterial({ map:canvasTex(256, 64, (gg, w, h) => { paperBase(gg, w, h, '#e2cf9f', 800); for(let y = 0; y < h; y += 6){ gg.fillStyle = 'rgba(120,85,40,.12)'; gg.fillRect(0, y, w, 2); } }), roughness:0.9, side:THREE.DoubleSide }));
    roll.rotation.x = Math.PI / 2; roll.position.set(MW / 2 - 0.1, 0.14, 0); g.add(roll);
    const rollCap = new THREE.Mesh(new THREE.RingGeometry(0.03, 0.13, 28), new THREE.MeshStandardMaterial({ color:'#d6c08c', roughness:0.9, side:THREE.DoubleSide }));
    rollCap.position.set(MW / 2 - 0.1, 0.14, MD / 2 + 0.001); g.add(rollCap);
    /* 이정표 말뚝(1·3·5 자리에 나무 핀) + 끝 깃발 */
    const toW = ([u, v]) => V3(-0.12 - MW / 2 + u * MW, 0, -MD / 2 + v * MD);
    const pinCols = ['#d94b3d', '#3f8f5a', '#8a4fb8'];
    [0, 2, 4].forEach((pi2, i) => {
      const p = toW(P[pi2]);
      const peg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.28, 10), woodMat('#caa06a', [110, 70, 30])); peg.position.set(p.x + 0.16, 0.16, p.z - 0.1); g.add(peg);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 12), lacquer(pinCols[i])); head.position.set(p.x + 0.16, 0.32, p.z - 0.1); g.add(head);
    });
    const endP = toW(P[5]);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.75, 8), brass); pole.position.set(endP.x + 0.02, 0.4, endP.z - 0.18); g.add(pole);
    const fg = new THREE.PlaneGeometry(0.42, 0.26, 8, 1); fg.translate(0.21, 0, 0);
    const flagT = canvasTex(256, 160, (gg, w, h) => { gg.fillStyle = '#c3362c'; gg.fillRect(0, 0, w, h); gg.fillStyle = '#f7da86'; gg.textBaseline = 'middle'; mathText(gg, '★', w / 2, h / 2 + 4, 110, { align:'center' }); });
    const flag = new THREE.Mesh(fg, new THREE.MeshStandardMaterial({ map:flagT, roughness:0.7, side:THREE.DoubleSide })); flag.position.set(endP.x + 0.035, 0.64, endP.z - 0.18); g.add(flag);
    const fp = fg.attributes.position, fx0 = Float32Array.from({ length:fp.count }, (_, i) => fp.getX(i));
    anim.push(t => { for(let i = 0; i < fp.count; i++){ const x = fx0[i]; fp.setZ(i, Math.sin(x * 10 - t * 4) * 0.035 * x / 0.42); } fp.needsUpdate = true; });
    /* 길 위를 가는 놋쇠 말 */
    const tokenGeo = new THREE.LatheGeometry([[0, 0], [0.1, 0], [0.1, 0.03], [0.05, 0.07], [0.045, 0.16], [0.07, 0.2], [0, 0.24]].map(([x, y]) => new THREE.Vector2(x, y)), 18);
    const token = new THREE.Mesh(tokenGeo, gold); g.add(token);
    const curve = new THREE.CatmullRomCurve3(P.map(p => toW(p)), false, 'centripetal');
    const place = u => { const p = curve.getPointAt(u); token.position.set(p.x, 0.03, p.z); };
    place(0.18);
    anim.push(t => { const u = 0.02 + ((t * 0.035) % 1) * 0.96; place(u); token.position.y = 0.03 + Math.abs(Math.sin(t * 5)) * 0.03; });
    cast(g); map.castShadow = false;
    return { g, anim, h:0.8, w:MW + 0.2, d:MD + 0.1, anchor:V3(0, 0, MD / 2 + 0.08) };
  };

  /* 스토리 모드 — 반쯤 펼친 두루마리 */
  makers.story = () => {
    const g = new THREE.Group(); const anim = [];
    const SW = 1.25, SD = 0.82;
    const t2 = canvasTex(620, 400, (gg, w, h) => { paperBase(gg, w, h, '#ecd9ae', 3000); agedEdge(gg, w, h, 0.4);
      gg.fillStyle = 'rgba(70,120,80,.55)'; [[120, 250, 60], [190, 270, 44], [470, 150, 50]].forEach(([x, y, s]) => { gg.beginPath(); gg.moveTo(x, y - s); gg.lineTo(x + s, y + s * 0.5); gg.lineTo(x - s, y + s * 0.5); gg.closePath(); gg.fill(); });
      /* 성 */
      gg.fillStyle = 'rgba(110,70,40,.7)'; gg.fillRect(420, 250, 90, 70); [420, 450, 480].forEach(x => gg.fillRect(x, 236, 20, 16)); gg.fillStyle = '#ecd9ae'; gg.fillRect(455, 285, 20, 35);
      gg.strokeStyle = '#8a3b1c'; gg.lineWidth = 5; gg.setLineDash([12, 10]); gg.beginPath(); gg.moveTo(60, 340); gg.bezierCurveTo(200, 180, 300, 360, 440, 300); gg.stroke(); gg.setLineDash([]);
      gg.strokeStyle = '#b3261a'; gg.lineWidth = 7; gg.beginPath(); gg.moveTo(535, 70); gg.lineTo(565, 100); gg.moveTo(565, 70); gg.lineTo(535, 100); gg.stroke(); });
    const sheet = flat(new THREE.Mesh(new THREE.PlaneGeometry(SW, SD, 20, 4), new THREE.MeshStandardMaterial({ map:t2, roughness:0.9, side:THREE.DoubleSide })), 0.02);
    { const p = sheet.geometry.attributes.position; for(let i = 0; i < p.count; i++){ const x = p.getX(i); p.setZ(i, Math.pow(Math.abs(x) / (SW / 2), 4) * 0.08); } sheet.geometry.computeVertexNormals(); }
    g.add(sheet);
    const rodMat = woodMat('#5a321a', [30, 14, 6]);
    [-1, 1].forEach(sx => {
      const rl = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, SD + 0.02, 20), new THREE.MeshStandardMaterial({ color:'#e2cc9c', roughness:0.85 })); rl.rotation.x = Math.PI / 2; rl.position.set(sx * (SW / 2 + 0.04), 0.11, 0); g.add(rl);
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, SD + 0.36, 10), rodMat); rod.rotation.x = Math.PI / 2; rod.position.set(sx * (SW / 2 + 0.04), 0.11, 0); g.add(rod);
      [-1, 1].forEach(sz => { const kn = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 10), gold); kn.position.set(sx * (SW / 2 + 0.04), 0.11, sz * (SD / 2 + 0.2)); g.add(kn); });
    });
    const ribbon = new THREE.Mesh(new THREE.TorusGeometry(0.105, 0.022, 8, 24), new THREE.MeshStandardMaterial({ color:'#a3221c', roughness:0.5 })); ribbon.rotation.y = Math.PI / 2; ribbon.position.set(SW / 2 + 0.04, 0.11, 0.12); g.add(ribbon);
    g.rotation.y = 0.08;
    cast(g); sheet.castShadow = false;
    return { g, anim, h:0.25, w:SW + 0.35, d:SD + 0.5, anchor:V3(0, 0, (SD + 0.5) / 2) };
  };

  /* 기호 도감 — 가죽 표지에 금박 기호가 박힌 두꺼운 책 */
  makers.dex = () => {
    const g = new THREE.Group(); const anim = [];
    const BW = 1.05, BD = 1.38, BH = 0.26;
    const cov = leatherTex('#1f3b5c', 512, 672, { inset:22, draw:(gg, w, h, goldG) => {
      gg.fillStyle = goldG; const syms = ['+', '−', '×', '÷', '=', 'π'];
      syms.forEach((s, i) => { const cx = w * (i % 2 ? 0.68 : 0.32), cy = h * (0.25 + Math.floor(i / 2) * 0.25); gg.textBaseline = 'middle'; mathText(gg, s, cx, cy + 6, 118, { align:'center' }); });
    } });
    const pages = new THREE.Mesh(rbox(BW - 0.06, BH - 0.06, BD - 0.08, 0.02), new THREE.MeshStandardMaterial({ map:canvasTex(64, 256, (gg, w, h) => { gg.fillStyle = '#efe3c4'; gg.fillRect(0, 0, w, h); for(let y = 0; y < h; y += 3){ gg.fillStyle = `rgba(150,115,70,${0.1 + rnd() * 0.15})`; gg.fillRect(0, y, w, 1); } }), roughness:0.9 }));
    pages.position.set(0.02, 0.03, 0); g.add(pages);
    const coverSide = new THREE.MeshStandardMaterial({ color:'#1a3150', roughness:0.6 });
    const bot = new THREE.Mesh(rbox(BW, 0.035, BD, 0.03), coverSide); g.add(bot);
    const topC = new THREE.Mesh(rbox(BW, 0.035, BD, 0.03), coverSide); topC.position.y = BH - 0.035; g.add(topC);
    const face = flat(new THREE.Mesh(new THREE.PlaneGeometry(BW - 0.02, BD - 0.02), new THREE.MeshStandardMaterial({ map:cov, roughness:0.55, metalness:0.05 })), BH + 0.001); g.add(face);
    const spine = new THREE.Mesh(new THREE.CylinderGeometry(BH / 2, BH / 2, BD, 16, 1, false, Math.PI, Math.PI), coverSide); spine.rotation.x = Math.PI / 2; spine.position.set(-BW / 2, BH / 2, 0); g.add(spine);
    /* 금빛 책갈피 끈 */
    const rib = flat(new THREE.Mesh(new THREE.PlaneGeometry(0.06, 0.3), new THREE.MeshStandardMaterial({ color:'#d6a640', roughness:0.4, metalness:0.4, side:THREE.DoubleSide })), 0.02); rib.position.set(0.25, 0.02, BD / 2 + 0.12); g.add(rib);
    g.rotation.y = -0.1;
    cast(g); face.castShadow = false;
    return { g, anim, h:BH + 0.02, w:BW + 0.15, d:BD + 0.2, anchor:V3(0, 0, BD / 2 + 0.1) };
  };

  /* 수학사 퀴즈 — 월계관 π 금화 + 작은 대리석 기둥 조각 */
  makers.hist = () => {
    const g = new THREE.Group(); const anim = [];
    const coinT = canvasTex(512, 512, (gg, w, h) => {
      const cx = w / 2, cy = h / 2;
      const gr = gg.createRadialGradient(cx * 0.8, cy * 0.7, 20, cx, cy, w / 2); gr.addColorStop(0, '#fff0b8'); gr.addColorStop(0.55, '#e0b34f'); gr.addColorStop(1, '#a8781f'); gg.fillStyle = gr; gg.fillRect(0, 0, w, h);
      gg.strokeStyle = 'rgba(110,70,10,.6)'; gg.lineWidth = 10; gg.beginPath(); gg.arc(cx, cy, w * 0.44, 0, TAU); gg.stroke();
      /* 월계 잎 */
      for(let s = -1; s <= 1; s += 2) for(let i = 0; i < 9; i++){ const a = Math.PI / 2 + s * (0.35 + i * 0.25); const x = cx + Math.cos(a) * w * 0.34, y = cy + Math.sin(a) * w * 0.34;
        gg.save(); gg.translate(x, y); gg.rotate(a + s * 0.9); gg.fillStyle = 'rgba(120,80,15,.55)'; gg.beginPath(); gg.ellipse(0, 0, 22, 9, 0, 0, TAU); gg.fill(); gg.fillStyle = 'rgba(255,240,190,.4)'; gg.beginPath(); gg.ellipse(-2, -3, 16, 4, 0, 0, TAU); gg.fill(); gg.restore(); }
      gg.textBaseline = 'middle'; gg.fillStyle = 'rgba(255,245,210,.6)'; mathText(gg, 'π', cx - 3, cy + 1, 230, { align:'center' });
      gg.fillStyle = 'rgba(110,70,10,.85)'; mathText(gg, 'π', cx, cy + 6, 230, { align:'center' });
    });
    const coinSide = metal('#c99a3e', 0.35);
    const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.07, 48), [coinSide, new THREE.MeshStandardMaterial({ map:coinT, metalness:0.75, roughness:0.32 }), coinSide]);
    coin.position.set(0.12, 0.085, 0.08); coin.rotation.y = 0.4; g.add(coin);
    const coin2 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.05, 40), [coinSide, new THREE.MeshStandardMaterial({ map:coinT, metalness:0.75, roughness:0.35 }), coinSide]);
    coin2.position.set(0.32, 0.025, 0.38); coin2.rotation.set(0, -0.3, 0); g.add(coin2);
    const coin3 = coin2.clone(); coin3.position.set(-0.05, 0.025, -0.1); g.add(coin3);
    /* 대리석 판 — 옛 숫자(로마 숫자)를 새긴 조각 */
    const tabT = canvasTex(512, 380, (gg, w, h) => { gg.fillStyle = '#ece6dc'; gg.fillRect(0, 0, w, h);
      for(let i = 0; i < 10; i++){ gg.strokeStyle = `rgba(150,140,130,${0.12 + rnd() * 0.2})`; gg.lineWidth = 1 + rnd() * 1.6; gg.beginPath(); let x = 0, y = rnd() * h; gg.moveTo(x, y); while(x < w){ x += 20 + rnd() * 30; y += (rnd() - 0.5) * 30; gg.lineTo(x, y); } gg.stroke(); }
      gg.textBaseline = 'middle'; gg.textAlign = 'center';
      [['I  II  III', 0.3], ['IV  V  X', 0.62]].forEach(([s2, fy]) => { gg.font = `700 86px ${MAIN}`; gg.fillStyle = 'rgba(255,255,255,.8)'; gg.fillText(s2, w / 2 + 2, h * fy + 3); gg.fillStyle = 'rgba(95,82,70,.85)'; gg.fillText(s2, w / 2, h * fy); });
      gg.strokeStyle = 'rgba(95,82,70,.5)'; gg.lineWidth = 4; gg.strokeRect(18, 18, w - 36, h - 36); });
    const slab = new THREE.Group(); slab.position.set(-0.3, 0, -0.3); slab.rotation.y = 0.25;
    const slabB = new THREE.Mesh(rbox(0.92, 0.11, 0.68, 0.03), new THREE.MeshStandardMaterial({ color:'#e2dbd0', roughness:0.35 })); slab.add(slabB);
    const slabT = flat(new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.66), new THREE.MeshStandardMaterial({ map:tabT, roughness:0.3 })), 0.112); slab.add(slabT);
    g.add(slab);
    coin.position.set(0.25, 0.085, 0.22); coin2.position.set(-0.28, 0.13, 0.2); coin2.rotation.set(0.12, -0.3, 0.1); coin3.position.set(0.5, 0.025, -0.25);
    cast(g);
    return { g, anim, h:0.2, w:1.4, d:1.2, anchor:V3(0, 0, 0.62) };
  };

  /* 매거진 — 부채꼴로 겹친 잡지 두 권 */
  makers.magazine = () => {
    const g = new THREE.Group(); const anim = [];
    const MW = 0.92, MD = 1.22;
    const cov = (bg, band, n, nCol) => canvasTex(460, 610, (gg, w, h) => {
      gg.fillStyle = bg; gg.fillRect(0, 0, w, h);
      gg.fillStyle = band; gg.fillRect(0, 0, w, 92);
      gg.fillStyle = 'rgba(255,255,255,.9)'; gg.fillRect(30, 30, 200, 14); gg.fillRect(30, 54, 120, 10);
      gg.fillStyle = '#fff'; gg.beginPath(); gg.arc(w - 58, 46, 30, 0, TAU); gg.fill(); gg.fillStyle = band; gg.textBaseline = 'middle'; mathText(gg, '7', w - 58, 49, 38, { align:'center' });
      gg.fillStyle = 'rgba(255,255,255,.35)'; gg.beginPath(); gg.arc(w * 0.55, h * 0.52, w * 0.34, 0, TAU); gg.fill();
      gg.fillStyle = nCol; mathText(gg, n, w * 0.55, h * 0.53, 250, { align:'center' });
      gg.fillStyle = 'rgba(30,20,10,.55)'; [0, 1, 2].forEach(i => gg.fillRect(30, h - 110 + i * 26, i === 2 ? 150 : 260, 12));
    });
    const glossy = map => new THREE.MeshPhysicalMaterial({ map, roughness:0.28, clearcoat:0.8, clearcoatRoughness:0.2 });
    const edge = new THREE.MeshStandardMaterial({ color:'#f2eee4', roughness:0.8 });
    const mk = (map, x, z, rot, y) => { const m = new THREE.Group();
      const b = new THREE.Mesh(rbox(MW, 0.03, MD, 0.01), edge); m.add(b);
      const f = flat(new THREE.Mesh(new THREE.PlaneGeometry(MW - 0.01, MD - 0.01), glossy(map)), 0.031); m.add(f);
      m.position.set(x, y, z); m.rotation.y = rot; g.add(m); return m; };
    mk(cov('#2f7fb8', '#1c4f7a', '∞', '#fff4c8'), -0.12, -0.06, 0.22, 0);
    mk(cov('#f2c14e', '#c3362c', '7', '#3a2210'), 0.1, 0.06, -0.12, 0.032);
    cast(g);
    return { g, anim, h:0.1, w:1.2, d:1.45, anchor:V3(0, 0, 0.72) };
  };

  /* 모르는 id — 작은 나무 표찰 */
  const generic = () => {
    const g = new THREE.Group();
    const wood = woodMat('#a3703e', [80, 45, 20]);
    const b = new THREE.Mesh(rbox(0.9, 0.12, 0.55, 0.05), wood); g.add(b);
    cast(g);
    return { g, anim:[], h:0.15, w:0.9, d:0.55, anchor:V3(0, 0, 0.3) };
  };

  /* ---- 만들고 등록 ---- */
  const objs = {};
  const allAnim = [];
  choices.forEach(c => {
    const kind = c.primary ? 'continue' : c.id;
    const o = (makers[kind] || generic)();
    const holder = new THREE.Group(); holder.add(o.g); scene.add(holder);
    const hit = new THREE.Mesh(new THREE.BoxGeometry(o.w, Math.max(0.3, o.h), o.d), new THREE.MeshBasicMaterial({ visible:false }));
    hit.position.y = Math.max(0.3, o.h) / 2; hit.userData.choiceId = c.id; holder.add(hit);
    /* 강조: 밑에 번지는 금빛 + 살짝 들림 */
    const hl = new THREE.Mesh(new THREE.PlaneGeometry(o.w * 1.55, o.d * 1.55), new THREE.MeshBasicMaterial({ map:glowTex, color:'#ffcc6a', transparent:true, opacity:0, depthWrite:false, blending:THREE.AdditiveBlending }));
    hl.rotation.x = -Math.PI / 2; hl.position.y = 0.006; hl.renderOrder = 2; holder.add(hl);
    const sh = blob(o.w * 1.3, o.d * 1.3, 0.55); holder.add(sh);
    o.anim.forEach(f => allAnim.push(f));
    objs[c.id] = { id:c.id, primary:!!c.primary, kind, holder, inner:o.g, hit, hl, sh, def:o, hotT:0, hotV:0, anchorW:new THREE.Vector3(), box:[], place:o.place || 'below' };
  });

  /* ---- 캐릭터 — 책상 가장자리의 나무 받침 위(종이 인형 또는 3D 캐릭터) ---- */
  const player = makePlayer(playerSpec);
  function makePlayer(spec){
    if(!spec) return null;
    const pg = new THREE.Group();
    const H = 2.5;
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.47, 0.12, 40), woodMat('#9a6a3e', [70, 40, 18]));
    base.position.y = 0.06; pg.add(base);
    const inlay = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.016, 8, 48), brass); inlay.rotation.x = Math.PI / 2; inlay.position.y = 0.12; pg.add(inlay);
    let update = null, sp = null;
    if(spec.kind === '3d'){
      const holder = new THREE.Group();
      const o = spec.c.object; holder.add(o);
      const bb = new THREE.Box3().setFromObject(o); const h0 = Math.max(0.01, bb.max.y - bb.min.y);
      const s = H / h0; holder.scale.setScalar(s); holder.position.y = 0.12 - bb.min.y * s; holder.rotation.y = 0.35;
      pg.add(holder);
      update = (t, dt) => { try { spec.c.update && spec.c.update(dt, t); } catch(e){} };
    } else if(spec.kind === 'card'){
      const tex = new THREE.CanvasTexture(spec.canvas); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
      const ar = spec.canvas.width / spec.canvas.height;
      sp = new THREE.Sprite(new THREE.SpriteMaterial({ map:tex, transparent:true, alphaTest:0.02 }));
      sp.center.set(0.5, 0.0); sp.scale.set(H * ar, H, 1); sp.position.set(0, 0.12, 0.16); pg.add(sp);
    }
    cast(pg);
    const shB = blob(1.5, 1.1, 0.7); pg.add(shB);
    scene.add(pg);
    /* 머리 위 점 — 종이 인형(화면을 보는 판)은 카메라 위쪽으로, 3D 캐릭터는 세상 위쪽으로 잰다 */
    const P = { g:pg, sp, H, s:1, billboard:spec.kind !== '3d', tagW:new THREE.Vector3(), footW:new THREE.Vector3(), box:[], update };
    const _up = new THREE.Vector3();
    P.topAt = (cam, pad) => {
      if(P.billboard) _up.set(0, 1, 0).applyQuaternion(cam.quaternion); else _up.set(0, 1, 0);
      return P.tagW.copy(P.footW).addScaledVector(_up, (P.H + (pad || 0)) * P.s);
    };
    return P;
  }

  /* ---- 곁들이 소품(누를 수 없음) — 옻칠 산가지 · 숫자 나무 블록 · 잉크병과 깃펜 · 찻잔 ---- */
  const decor = {};
  {
    /* 산가지 세 개 */
    const rods = new THREE.Group();
    const rodGeo = new THREE.CapsuleGeometry(0.045, 1.5, 6, 16);
    [['#b8322a', 0, 0, 0.1], ['#1f4f7a', 0.05, 0.14, -0.05], ['#e0b040', -0.04, 0.27, 0.16]].forEach(([c, x, z, ry]) => {
      const m = new THREE.Mesh(rodGeo, lacquer(c)); m.rotation.z = Math.PI / 2; const w0 = new THREE.Group(); w0.add(m); w0.position.set(x, 0.045, z); w0.rotation.y = ry; rods.add(w0); });
    decor.rods = rods;
    /* 숫자 블록 */
    const tiles = new THREE.Group();
    [['1', 0, 0, 0.2], ['2', 0.5, 0.12, -0.15], ['3', 0.2, 0.55, 0.35]].forEach(([n, x, z, ry]) => {
      const t = k.tile(n, x, z, { w:0.42, d:0.42, h:0.3, rot:ry, wood:'#d9b27c', grain:true, bg:'#e6c793', color:'#3a2412', size:220 }); tiles.add(t); });
    decor.tiles = tiles;
    /* 잉크병 + 깃펜 */
    const ink = new THREE.Group();
    const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.24, 20), glass('#3c4a8a')); bottle.position.y = 0.12; ink.add(bottle);
    const inkIn = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.16, 20), new THREE.MeshStandardMaterial({ color:'#141a3a', roughness:0.2 })); inkIn.position.y = 0.08; ink.add(inkIn);
    const neckB = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.07, 16), darkBrass); neckB.position.y = 0.27; ink.add(neckB);
    const quill = new THREE.Group();
    const vane = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 8), new THREE.MeshStandardMaterial({ color:'#f5efe2', roughness:0.75, side:THREE.DoubleSide }));
    vane.scale.set(0.09, 0.6, 0.01); vane.position.y = 0.35; quill.add(vane);
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.012, 1.0, 6), new THREE.MeshStandardMaterial({ color:'#e8dcc2' })); shaft.position.y = 0.2; quill.add(shaft);
    quill.position.set(0.02, 0.22, 0); quill.rotation.set(0.25, 0, -0.5); ink.add(quill);
    decor.ink = ink;
    /* 찻잔 */
    const cup = new THREE.Group();
    const porcelain = new THREE.MeshPhysicalMaterial({ color:'#f7f3ea', roughness:0.25, clearcoat:0.6 });
    const saucer = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.3, 0.05, 36), porcelain); saucer.position.y = 0.025; cup.add(saucer);
    const cupB = new THREE.Mesh(new THREE.LatheGeometry([[0, 0.05], [0.14, 0.05], [0.22, 0.12], [0.27, 0.3], [0.26, 0.31], [0.21, 0.13], [0, 0.11]].map(([x, y]) => new THREE.Vector2(x, y)), 32), porcelain); cup.add(cupB);
    const tea = flat(new THREE.Mesh(new THREE.CircleGeometry(0.235, 28), new THREE.MeshStandardMaterial({ color:'#8a4a1a', roughness:0.15 })), 0.26); cup.add(tea);
    const handleC = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.022, 8, 16, Math.PI * 1.3), porcelain); handleC.position.set(0.28, 0.2, 0); handleC.rotation.z = -Math.PI * 0.65; cup.add(handleC);
    const rimG = new THREE.Mesh(new THREE.TorusGeometry(0.265, 0.008, 6, 36), gold); rimG.rotation.x = Math.PI / 2; rimG.position.y = 0.305; cup.add(rimG);
    decor.cup = cup;
    Object.values(decor).forEach(d => { cast(d); scene.add(d); });
  }

  /* 햇살 속 먼지 · 책에서 오르는 금가루 */
  const dust = points(80, [new THREE.Color('#fff6e2'), new THREE.Color('#ffe9c0')], 0.012, 0.055);
  const sparks = points(46, [new THREE.Color('#ffd98a'), new THREE.Color('#ffefc2'), new THREE.Color('#ffc160')], 0.05, 0.05);

  /* ============ 구도 ============
     landscape: 책이 가운데, 모드 넷이 네 귀퉁이, 소품 넷이 앞줄.
     wide(낮은 가로): 모드 넷이 책 양옆 한 줄, 소품이 앞줄.
     portrait : 위에서 아래로 — 책(+캐릭터) / 모드 2칸 × 2줄 / 소품 4칸. 더 내려다봐서 깊이(z)가 화면 세로가 된다.
     pos: [x, z, 크기, 돌림(도)] */
  const layouts = {
    landscape:{ pitch:54, fov:30, dist:24, target:[0, 0, 0.6],
      pos:{ continue:[0, -0.5, 1, 0], diag:[-6.1, -2.3, 1, 4], game:[6.1, -2.3, 1, -6], sheet:[-6.0, 2.35, 1, -5], road:[6.0, 2.4, 1, 3],
        story:[-3.45, 3.55, 1, 4], dex:[-1.15, 3.7, 1, -4], hist:[1.15, 3.7, 1, 0], magazine:[3.45, 3.55, 1, 5] },
      player:[-3.45, -0.7, 1], mat:[0, -0.5, 6.3, 4.6],
      decor:{ rods:[-2.6, -3.7, 1, -8], tiles:[2.9, -3.8, 1, 10], cup:[-8.3, -4.5, 1, 0] },
      dust:[-4.5, -1.5, 5, 3.5, 4], sun:[-9, 13, -7] },
    wide:{ pitch:58, fov:28, dist:28, target:[0, 0, 0.6],
      pos:{ continue:[0, -0.6, 1, 0], diag:[-9.4, -0.7, 0.95, 4], sheet:[-5.6, -0.3, 0.95, -4], road:[5.7, -0.3, 0.95, 3], game:[9.4, -0.7, 0.95, -5],
        story:[-4.4, 3.2, 0.9, 4], dex:[-1.5, 3.3, 0.9, -4], hist:[1.5, 3.3, 0.9, 0], magazine:[4.4, 3.2, 0.9, 5] },
      player:[-3.25, -1.2, 0.8], mat:[0, -0.6, 6.2, 4.4],
      decor:{ rods:[-7.8, 3.3, 1, -8], tiles:[7.6, 3.2, 1, 10], ink:[-12.2, 1.6, 1, 0], cup:[12.2, 1.6, 1, 0] },
      dust:[-5, -1.2, 6, 3, 3], sun:[-9, 13, -7] },
    portrait:{ pitch:64, fov:36, dist:26, target:[0, 0, 0.8],
      pos:{ continue:[0.75, -6.2, 0.8, 0], diag:[-1.7, -1.5, 0.8, 4], game:[1.75, -1.5, 0.8, -6], sheet:[-1.7, 2.6, 0.78, -4], road:[1.75, 2.6, 0.72, 3],
        story:[-2.45, 6.4, 0.62, 4], dex:[-0.82, 6.5, 0.62, -4], hist:[0.82, 6.5, 0.62, 0], magazine:[2.45, 6.4, 0.62, 5] },
      player:[-2.3, -5.6, 0.92], mat:[0.75, -6.2, 4.3, 3.3],
      decor:{ rods:[3.1, -3.9, 0.8, 70], cup:[-3.5, -3.3, 0.7, 0] },
      dust:[-1.5, -5, 3, 5, 5], sun:[-7, 14, -9] },
  };
  let extra = 0;
  function applyLayout(name){
    const L = layouts[name];
    extra = 0;
    deskMat.position.set(L.mat[0], 0, L.mat[1]); deskMat.scale.set(L.mat[2], 1, L.mat[3]);
    deskMatTop.position.set(L.mat[0], 0.0305, L.mat[1]); deskMatTop.scale.set(L.mat[2] - 0.04, L.mat[3] - 0.04, 1);
    Object.values(objs).forEach(o => {
      const key = o.primary ? 'continue' : o.id;
      let p = L.pos[key];
      if(!p){ const n = extra++; p = name === 'portrait' ? [-2.4 + (n % 4) * 1.6, 8.3 + Math.floor(n / 4) * 1.6, 0.6, 0] : [-5.4 + n * 2.2, 5.6, 0.85, 0]; }
      o.holder.position.set(p[0], 0, p[1]); o.holder.scale.setScalar(p[2]); o.holder.rotation.y = THREE.MathUtils.degToRad(p[3] || 0);
      o.baseScale = p[2];
      o.holder.updateMatrixWorld(true);
      o.place = (L.place && L.place[key]) || o.def.place || 'below';
      const anc = o.place === 'below' && o.def.anchorBelow ? o.def.anchorBelow : o.def.anchor;
      /* 앵커는 돌림을 무시하고 앞 가장자리 가운데에 — 버튼이 물건 바로 밑에 반듯이 온다 */
      o.anchorW.copy(anc).multiplyScalar(p[2]).add(o.holder.position);
      const hw = o.def.w / 2 * p[2], hh = o.def.h * p[2], hd = o.def.d / 2 * p[2], c = o.holder.position;
      o.box = [V3(c.x - hw, 0, c.z + hd), V3(c.x + hw, 0, c.z + hd), V3(c.x - hw, hh, c.z - hd), V3(c.x + hw, hh, c.z - hd), V3(c.x - hw, hh, c.z + hd), V3(c.x + hw, hh, c.z + hd)];
    });
    if(player){
      const [px, pz, s] = L.player;
      player.g.position.set(px, 0, pz); player.g.scale.setScalar(s); player.s = s;
      player.footW.set(px, 0.12 * s, pz + (player.billboard ? 0.16 * s : 0));
      player.box = [V3(px - 0.55 * s, 0, pz + 0.5 * s), V3(px + 0.55 * s, 0, pz + 0.5 * s), V3(px - 0.55 * s, 0, pz - 0.5 * s)];
    }
    Object.keys(decor).forEach(key => { const d = decor[key], q = L.decor[key];
      if(!q){ d.visible = false; return; } d.visible = true; d.position.set(q[0], 0, q[1]); d.scale.setScalar(q[2]); d.rotation.y = THREE.MathUtils.degToRad(q[3] || 0); });
    /* 책 위의 금빛 조명 */
    const cObj = Object.values(objs).find(o => o.primary);
    if(cObj){ bookLight.position.copy(cObj.holder.position).add(V3(0, 1.6 * cObj.baseScale, 0.4 * cObj.baseScale));
      sparks.uniforms.box.value.set(3.6 * cObj.baseScale, 2.2 * cObj.baseScale, 2.2 * cObj.baseScale); sparks.uniforms.ctr.value.set(cObj.holder.position.x, 0.25, cObj.holder.position.z); }
    /* 해 — 그림자 상자를 모든 물건에 맞춘다 */
    let R = 4; Object.values(objs).forEach(o => { R = Math.max(R, Math.hypot(o.holder.position.x, o.holder.position.z - L.target[2]) + Math.max(o.def.w, o.def.d) * o.baseScale); });
    sun.position.set(L.sun[0], L.sun[1], L.sun[2] + L.target[2]); sun.target.position.set(0, 0, L.target[2]);
    Object.assign(sun.shadow.camera, { left:-R, right:R, top:R, bottom:-R, near:1, far:50 }); sun.shadow.camera.updateProjectionMatrix();
    const [dx, dz, bx, by, bz] = L.dust;
    dust.uniforms.ctr.value.set(dx, 0.3, dz); dust.uniforms.box.value.set(bx, by, bz); dust.uniforms.sh.value.set(-0.25, -0.2);
  }
  function onFit(){ /* 카메라가 정해진 뒤에 할 일 — 지금은 없음 */ }

  /* ---- 움직임 ---- */
  const lerp = (a, b, f) => a + (b - a) * f;
  function animate(t, dt, reduce){
    let moving = false;
    if(!reduce){ allAnim.forEach(f => f(t, dt)); dust.uniforms.t.value = t; sparks.uniforms.t.value = t; }
    const px = k.r.domElement.height * 0.9;
    dust.uniforms.px.value = px; sparks.uniforms.px.value = px;
    if(player && player.update && !reduce) player.update(t, dt);
    Object.values(objs).forEach(o => {
      const f = reduce ? 1 : Math.min(1, dt * 9);
      const nv = lerp(o.hotV, o.hotT, f);
      if(Math.abs(nv - o.hotV) > 1e-4) moving = true;
      o.hotV = nv;
      o.inner.position.y = o.hotV * 0.14;
      o.inner.scale.setScalar(1 + o.hotV * 0.04);
      const pulse = o.primary ? (reduce ? 0.35 : 0.3 + Math.sin(t * 1.6) * 0.1) : 0;
      o.hl.material.opacity = Math.max(pulse, o.hotV * 0.85);
      o.sh.material.opacity = 0.55 - o.hotV * 0.2;
    });
    return moving;
  }

  return { objs, player, animate, applyLayout, layouts, onFit };
}
