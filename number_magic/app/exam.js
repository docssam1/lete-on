/* ============================================================
   Numbers of Magic — 시험(Exam) & 인쇄 학습지 모듈
   CURRICULUM_DESIGN.md §6 구현.
   의존: engine/rng.js (NM_RNG), data/threads.js (NM_THREADS),
         engine/generators.js or thread generators (NM_TGEN)
   ============================================================ */
(function(){
'use strict';

/* ── 인쇄 CSS 주입 (1회) ─────────────────────────────── */
(function injectPrintCSS(){
  if(document.getElementById('nm-print-style')) return;
  const s = document.createElement('style');
  s.id = 'nm-print-style';
  s.textContent = `
.nm-print-wm { display: none; }
@media print {
  body > *:not(.nm-print-sheet) { display: none !important; }
  .nm-print-sheet { display: block !important; font-family: sans-serif; }
  /* 이름 워터마크 — fixed는 인쇄에서 페이지마다 반복된다. 문제를 가리지 않게
     아주 옅게(6%), 흑백 프린터에서도 회색 띠가 아닌 큰 글자로 남는다. */
  .nm-print-wm { display: block !important; position: fixed; top: 46%; left: 0; right: 0;
    text-align: center; transform: rotate(-27deg); font-size: 46px; font-weight: 900;
    color: #1A2233; opacity: .06; letter-spacing: .12em; pointer-events: none; z-index: 0;
    white-space: nowrap; }
}
/* ── 조판 규칙(레이아웃·타이포)만 화면에서도 켠다(2026-09-05, 인쇄 미리보기
   편집기 openPrintEditor) — renderRoundPages 등이 만드는 같은 HTML을 그대로
   화면에 얹어 보여주기 위해서다. 위 블록의 두 규칙(전체 숨기고 .nm-print-sheet만
   보이기·워터마크 fixed 오버레이)은 실제 인쇄에만 필요해 print 전용으로 남겨
   뒀다 — 이 아래는 전부 특정 클래스(.nm-print-*, .nm-w2-*, .nm-cv-*, .nm-ak-*,
   .nm-cp-*, .nm-b10*, .nm-nl*, .nm-bond*, .nm-pp-*)에만 걸리는 순수 조판
   규칙이라, 그 클래스를 달지 않는 일반 화면 UI에는 영향이 없다(전수 grep
   확인, styles.css·main.js 어디도 이 접두어를 쓰지 않는다). */
@media print, screen {
  .nm-print-plan { width: 100%; border-collapse: collapse; font-size: 0.95em; }
  .nm-print-plan th, .nm-print-plan td { border: 1px solid #999; padding: 7px 9px; text-align: left; vertical-align: top; }
  .nm-print-plan th { background: #f0f0f0; font-size: 0.85em; }
  .nm-print-plan .nm-pp-cal { white-space: nowrap; font-weight: 700; }
  .nm-print-plan .nm-pp-magic { font-weight: 700; }
  .nm-pp-note { margin-top: 12px; font-size: 0.85em; color: #555; }
  .nm-print-answer-key { page-break-before: always; }
  .nm-print-header { border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 16px; }
  .nm-print-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  /* 짧은 연산만 있는 학습지는 4열로 촘촘하게(예전 그리드 학습지 밀도). 50문항을
     2열로 뽑으면 장수가 두 배가 된다 — fillPrintGrid가 내용을 보고 붙인다. */
  .nm-print-grid.nm-print-grid-dense { grid-template-columns: repeat(4, 1fr); }
  .nm-print-item { border: 1px solid #ccc; border-radius: 4px; padding: 10px; min-height: 48px; }
  .nm-print-item .nm-q-num { font-weight: bold; font-size: 0.8em; color: #555; }
  .nm-print-item .nm-q-tex { font-size: 1.1em; margin-top: 4px; }
  .nm-print-blank { display: inline-block; min-width: 40px; border-bottom: 2px solid #000; }
  /* 세로셈(예: 34+12=□) 인쇄 박스 — "그리드 학습지" 인쇄가 이 서식을 만들면서도
     CSS가 아예 없어(2026-08-28 발견) 실제로는 안 꾸며진 채 인쇄되고 있었다.
     renderPrint에 통합하며 함께 채움. */
  .nm-print-item-vp { text-align: center; }
  .nm-print-item-vp .nm-q-num { display: block; }
  .nm-print-vp { display: inline-flex; flex-direction: column; min-width: 2.6em; margin: 6px auto 0;
    font-family: "SFMono-Regular", Consolas, monospace; font-size: 1.15em; }
  .nm-print-vp-top { text-align: right; padding: 0 2px 2px; }
  .nm-print-vp-mid { display: flex; justify-content: space-between; gap: 6px; padding: 0 2px 2px; }
  .nm-print-vp-line { border-top: 1.5px solid #000; margin: 0 0 4px; }
  .nm-print-vp-bot { min-height: 1.3em; text-align: right; padding: 0 2px; }
  /* 문장제 — 본문·물음·보기.
     본문을 .nm-q-tex로 찍으면 안 된다. 저학년 학습지(nm-print-age-young)에서
     .nm-q-tex가 1.9em이라 문장 두 줄이 한 페이지를 잡아먹는다(수식 한 줄을
     전제로 잡힌 크기다). 문장은 읽는 글이므로 따로 크기를 준다. */
  .nm-print-word { font-size: 1.02em; line-height: 1.6; margin-top: 4px; word-break: keep-all; }
  .nm-print-wordask { font-size: 0.95em; line-height: 1.55; margin-top: 6px; font-weight: 700;
    word-break: keep-all; }
  /* 보기 — 번호를 붙여 한 줄씩. 답이 보기 번호라 번호가 곧 답이다. */
  .nm-print-choices { margin: 5px 0 0; padding: 0; list-style: none;
    font-size: 0.95em; line-height: 1.5; }
  .nm-print-choices li { margin: 2px 0 0; padding-left: 1.5em; text-indent: -1.5em;
    word-break: keep-all; }
  .nm-print-word-blank { margin-top: 6px; font-size: 0.85em; }
  /* 식 틀 — 문장제인데 답이 '식'인 유형(WP4)이 채워 넣을 자리다. 답 줄("답: ___")을
     대신하므로 둘이 같이 나오지 않는다. 기호뿐이라 언어를 타지 않고, 손으로 크게 쓰는
     자리라 본문보다 키우고 자간을 넓힌다. */
  .nm-print-word-eq { margin-top: 8px; font-size: 1.5em; font-weight: 700; letter-spacing: .22em;
    font-family: "SFMono-Regular", Consolas, monospace; }
  /* 문장제 칸은 장을 넘기지 않는다 — A4로 재 보니 24문항짜리에서 문제 칸이 종이 경계를
     걸치고 **이야기만 남고 물음·보기·답 줄이 다음 장으로 넘어가는** 것이 실제로 나왔다
     (1280·430 화면에서는 보이지 않는다. 종이에만 있는 결함이다). 이야기와 답할 자리가
     갈라지면 그 문항은 못 푼다.
     2026-08-30에는 식 틀이 있는 칸(WP4)에만 걸었다 — 문장제 전체에 걸면 WP1·WP3 학습지의
     쪽 나눔이 바뀌기 때문이었다. 원장 승인을 받아 2026-08-31에 문장제 칸 전체로 넓혔다.
     ⚠️ 범위는 .nm-print-item-word (= p.word가 있는 칸)뿐이다. word를 내는 생성기는
     engine/threads/wp.js 하나뿐이라 다른 480여 레벨의 인쇄물에는 닿지 않는다 —
     넓히기 전에 한국어 전 레벨 렌더 글자를 md5로 대조해 확인했다. */
  .nm-print-item-word,
  .nm-print-item-eq { break-inside: avoid; page-break-inside: avoid; }
  .nm-print-age-young .nm-print-word-eq { font-size: 1.75em; }
  .nm-print-age-young .nm-print-word { font-size: 1.15em; line-height: 1.7; }
  .nm-print-age-young .nm-print-wordask { font-size: 1.08em; }
  .nm-print-age-young .nm-print-choices { font-size: 1.05em; }

  /* ── 언어별 줄바꿈 ────────────────────────────────────────
     위의 word-break:keep-all은 한국어 규칙이다 — 어절 한가운데서 끊지 말라는 뜻.
     이 값을 그대로 세 언어에 쓰면 안 된다:
       · 중국어는 글자 사이에 빈칸이 없어서, keep-all이면 문장 전체가 끊을 데 없는
         한 덩어리가 되어 칸을 그냥 넘어간다(줄바꿈 자체가 금지된다).
       · 영어는 빈칸에서는 끊기지만 긴 낱말(multiplication 등)이 좁은 칸에 걸리면
         그대로 삐져나온다.
     한국어 규칙은 기본값 그대로 두고(lang 속성이 없거나 ko면 예전 인쇄물과 같다),
     영어·중국어만 여기서 덮어쓴다. lang은 renderPrint가 시트에 박는다. */
  .nm-print-sheet[lang="zh"] .nm-print-word,
  .nm-print-sheet[lang="zh"] .nm-print-wordask,
  .nm-print-sheet[lang="zh"] .nm-print-choices li,
  .nm-print-sheet[lang="zh"] .nm-print-ask,
  .nm-print-sheet[lang="zh"] .nm-cv-title { word-break: normal; line-break: strict; overflow-wrap: anywhere; }
  .nm-print-sheet[lang="en"] .nm-print-word,
  .nm-print-sheet[lang="en"] .nm-print-wordask,
  .nm-print-sheet[lang="en"] .nm-print-choices li,
  .nm-print-sheet[lang="en"] .nm-print-ask,
  .nm-print-sheet[lang="en"] .nm-cv-title { word-break: normal; overflow-wrap: break-word; }
  /* 저학년 조판은 한국어 글자 너비에 맞춰 잡은 크기다(nm-print-age-young).
     같은 문장을 영어로 쓰면 글자 수가 눈에 띄게 늘고(빈칸까지 는다), 중국어는
     글자 수는 줄지만 한 글자가 더 넓다 — 둘 다 저학년 칸에서 줄이 하나씩 더
     생긴다. 문장 계열만 살짝 낮춰 칸 안에 앉힌다(수식 크기는 건드리지 않는다). */
  .nm-print-sheet[lang="en"].nm-print-age-young .nm-print-word,
  .nm-print-sheet[lang="zh"].nm-print-age-young .nm-print-word { font-size: 1.06em; line-height: 1.6; }
  .nm-print-sheet[lang="en"].nm-print-age-young .nm-print-wordask,
  .nm-print-sheet[lang="zh"].nm-print-age-young .nm-print-wordask { font-size: 1em; }
  .nm-print-sheet[lang="en"].nm-print-age-young .nm-print-choices,
  .nm-print-sheet[lang="zh"].nm-print-age-young .nm-print-choices { font-size: .98em; }
  /* 단계 풀이 줄 — 화면이 단계마다 묻는 유형은 인쇄도 단계를 묻는다(printSteps) */
  .nm-print-steps { margin-top: 6px; border-top: 1px dashed #bbb; padding-top: 5px; }
  .nm-print-step { font-size: .92em; margin: 3px 0; }

  /* 질문 줄 — tex만으로 물음이 성립하지 않는 유형에만 붙는다(printAskText) */
  .nm-print-ask { font-size: 0.8em; line-height: 1.5; color: #222; margin: 2px 0 4px;
    word-break: keep-all; }

  /* 십진블록 — 백판·십막대·낱개. 개수가 많아 줄바꿈되게 둔다(흑백, 선만). */
  .nm-print-item-vis { text-align: center; }
  .nm-print-item-vis .nm-q-num { display: block; }
  .nm-b10 { display: flex; flex-wrap: wrap; align-items: center; justify-content: center;
    gap: 4px 7px; margin-top: 6px; }
  .nm-b10-group { display: inline-flex; flex-wrap: wrap; align-items: flex-end; gap: 4mm; max-width: 60mm; }
  .nm-b10-den { display: inline-flex; align-items: flex-end; }
  /* 한 칸(작은 정육면체) 크기를 --u로 두고 나머지는 전부 여기서 파생시킨다 —
     백판=10u×10u, 십막대=u×10u, 낱개=u×u. 비례를 지켜야 "십막대 열 개가 백판"이
     그림으로 읽힌다. 저학년은 아래에서 --u를 키운다. */
  .nm-b10 { --u: 1.5mm; --g: 1.1mm; }
  .nm-b10-h { gap: calc(var(--u) * 1.1); }
  .nm-b10-t { gap: var(--g); }
  /* 낱개는 5개씩 끊어 줄바꿈 — 한 줄로 아홉 개를 늘어놓으면 세기 어렵다 */
  .nm-b10-o { flex-wrap: wrap; gap: var(--g); width: calc(var(--u) * 5 + var(--g) * 4); }
  .nm-b10-flat { width: calc(var(--u) * 10); height: calc(var(--u) * 10); }
  .nm-b10-rod  { width: var(--u); height: calc(var(--u) * 10); }
  .nm-b10-one  { width: var(--u); height: var(--u); }
  .nm-b10 svg rect, .nm-b10 svg path { fill: none; stroke: #000; stroke-width: .9;
    vector-effect: non-scaling-stroke; }
  .nm-b10-op { font-size: 1.3em; font-weight: 700; align-self: center; padding: 0 2px; }
  .nm-b10-blank { display: inline-block; width: 16mm; height: 8mm; border: 1px dashed #000; align-self: center; }

  /* 수직선 점프 */
  .nm-nl { width: 62mm; height: auto; margin: 6px auto 0; display: block; }
  .nm-nl line, .nm-nl path { fill: none; stroke: #000; stroke-width: 1.4; }
  .nm-nl .nm-nl-hop { stroke-dasharray: 3 2; }
  .nm-nl .nm-nl-blank { fill: none; stroke: #000; stroke-width: 1.4; stroke-dasharray: 4 3; }
  .nm-nl text { font-family: sans-serif; font-size: 15px; font-weight: 700; fill: #000; }
  .nm-nl .nm-nl-step { font-size: 13px; }

  /* 수 묶음(모으기·가르기) — 등식 대신 그림이 문제다. 빈 동그라미가 답 자리. */
  .nm-print-item-bond { text-align: center; }
  .nm-print-item-bond .nm-q-num { display: block; }
  .nm-bond { width: 34mm; height: auto; margin: 4px auto 0; }
  .nm-bond circle, .nm-bond line { fill: none; stroke: #000; stroke-width: 1.6; }
  .nm-bond .nm-bond-blank { stroke-dasharray: 4 3; }
  .nm-bond text { font-family: sans-serif; font-weight: 700; font-size: 20px; fill: #000; }

  /* NL(수의 나라, 유아) 그림 — 위 nlVisualHtml() 참조. 흑백 프린터 전제, 선/글자만. */
  .nm-nl-scene { display: flex; flex-wrap: wrap; gap: 2px; justify-content: center; font-size: 1.3em; margin-top: 4px; }
  .nm-nl-seqstrip { display: flex; gap: 4px; justify-content: center; margin-top: 6px; }
  .nm-nl-seqbox { display: inline-flex; align-items: center; justify-content: center; min-width: 18px; height: 18px;
    border: 1px solid #000; border-radius: 3px; font-size: .85em; }
  .nm-nl-seqbox-blank { background: repeating-linear-gradient(45deg, #fff, #fff 3px, #eee 3px, #eee 6px); }
  .nm-nl-dots { width: 100%; max-width: 32mm; margin: 6px auto 0; display: block; }
  .nm-nl-dots circle, .nm-nl-dots text { fill: #000; }
  .nm-nl-pyramid { display: flex; flex-direction: column; align-items: center; gap: 3px; margin-top: 6px; }
  .nm-nl-pyr-row { display: flex; gap: 4px; }
  .nm-nl-pyr-cell { display: inline-flex; align-items: center; justify-content: center; min-width: 18px; height: 18px;
    border: 1px solid #000; border-radius: 50%; font-size: .8em; }
  .nm-nl-pyr-blank { background: #eee; }
  .nm-nl-strip { display: flex; gap: 3px; justify-content: center; flex-wrap: wrap; margin-top: 6px; }
  .nm-nl-box { display: inline-flex; align-items: center; justify-content: center; min-width: 16px; height: 16px;
    border: 1px solid #000; font-size: .75em; }
  .nm-nl-stairs { display: flex; flex-direction: column-reverse; align-items: flex-start; gap: 2px; margin: 6px auto 0; width: max-content; }
  .nm-nl-stair { border: 1px solid #000; padding: 1px 6px; font-size: .75em; }
  .nm-nl-stair-mark { margin-left: 6px; }
  .nm-nl-scale { display: flex; gap: 10px; justify-content: center; margin-top: 6px; }
  .nm-nl-pan { border: 1px solid #000; border-radius: 4px; padding: 3px 6px; text-align: center; min-width: 36px; }
  .nm-nl-pan-items { font-size: 1em; letter-spacing: 1px; }
  .nm-nl-pan-idx { font-size: .7em; color: #555; border-top: 1px dashed #999; margin-top: 2px; }
  .nm-nl-machine { font-size: .85em; text-align: center; margin-top: 6px; }
  .nm-nl-cross { display: grid; grid-template-columns: repeat(3, 20px); grid-template-rows: repeat(3, 20px);
    justify-content: center; margin: 6px auto 0; font-size: .8em; text-align: center; }
  .nm-nl-cross-top { grid-column: 2; grid-row: 1; }
  .nm-nl-cross-mid { grid-column: 1 / 4; grid-row: 2; display: flex; justify-content: space-between; }
  .nm-nl-cross-bot { grid-column: 2; grid-row: 3; }
  .nm-nl-tally { width: 100%; max-width: 24mm; margin: 6px auto 0; display: block; }
  .nm-nl-tally line { stroke: #000; stroke-width: 1.4; }
  .nm-nl-legend { font-size: .7em; text-align: center; margin-top: 3px; color: #555; }

  /* ── 연령별 조판 ──────────────────────────────────────────
     6세와 중학생에게 같은 크기로 뽑아 주지 않는다(2026-08-28 원장 지시).
     저학년일수록 글자를 키우고 열을 줄여 한 문제에 주는 자리를 넓힌다 —
     그래서 한 장에 담기는 문항 수도 자연히 줄어든다. */
  .nm-print-age-young .nm-print-grid.nm-print-grid-dense { grid-template-columns: repeat(3, 1fr); gap: 14px; }
  .nm-print-age-young .nm-print-item { min-height: 22mm; padding: 12px 10px; }
  .nm-print-age-young .nm-print-item .nm-q-num { font-size: 1em; }
  .nm-print-age-young .nm-print-item .nm-q-tex { font-size: 1.9em; }
  .nm-print-age-young .nm-print-vp { font-size: 1.8em; }
  .nm-print-age-young .nm-bond { width: 40mm; }
  .nm-print-age-young .nm-b10 { --u: 1.9mm; --g: 1.3mm; }
  .nm-print-age-young .nm-nl { width: 70mm; }
  .nm-print-age-young .nm-print-answer-key .nm-ak-item,
  .nm-print-age-young .nm-print-answer-key .nm-ak-guide-item { font-size: 1em; }

  .nm-print-age-mid .nm-print-item { min-height: 17mm; }
  .nm-print-age-mid .nm-print-item .nm-q-tex { font-size: 1.4em; }
  .nm-print-age-mid .nm-print-vp { font-size: 1.4em; }

  /* ── 로드맵 세션 학습지 — 20문항/페이지(문장제만이면 10문항) 고정 그리드
     (원장 지시 2026-09-04 "한 페이지에 20문제씩 정리, 잘 배치되도록"). 위 연령별
     확대 규칙이 .nm-print-item에 그대로 걸리면(특히 young=22mm 최소높이·1.9em
     글자) 20칸이 한 장을 넘친다 — 그래서 이 그리드 안에서는 나이와 무관하게
     크기를 고정한다. 선택자를 3단으로 올려(.nm-print-age-* .nm-print-grid-NN
     .nm-print-item) 위 2단 규칙(.nm-print-age-* .nm-print-item)보다 우선하게
     한다. */
  .nm-print-grid.nm-print-grid-20 { grid-template-columns: repeat(4, 1fr); gap: 6px; }
  .nm-print-grid.nm-print-grid-20 .nm-print-item { padding: 6px 7px; min-height: 30px; }
  .nm-print-grid-20 .nm-print-item .nm-q-num { font-size: 0.72em; }
  .nm-print-grid-20 .nm-print-item .nm-q-tex { font-size: 1em; margin-top: 2px; }
  .nm-print-grid-20 .nm-print-vp { font-size: 0.95em; }
  /* 섞기 모드(roadWordType='mix')의 문장제·식 틀 칸은 좁은 1/4칸에 안 들어가므로
     두 칸을 쓴다 — 그만큼 그 줄의 실제 칸 수는 줄고 자연히 다음 줄로 밀린다
     (높이는 grid가 auto-flow로 알아서 늘린다, JS는 20칸을 그대로 하나의
     그리드에 다 붓기만 한다). */
  .nm-print-grid-20 .nm-print-item-word,
  .nm-print-grid-20 .nm-print-item-eq { grid-column: span 2; }
  .nm-print-age-young .nm-print-grid-20 .nm-print-item,
  .nm-print-age-mid   .nm-print-grid-20 .nm-print-item { padding: 6px 7px; min-height: 30px; }
  .nm-print-age-young .nm-print-grid-20 .nm-print-item .nm-q-tex,
  .nm-print-age-mid   .nm-print-grid-20 .nm-print-item .nm-q-tex { font-size: 1em; }
  .nm-print-age-young .nm-print-grid-20 .nm-print-vp,
  .nm-print-age-mid   .nm-print-grid-20 .nm-print-vp { font-size: 0.95em; }
  .nm-print-age-young .nm-print-grid-20.nm-print-grid { grid-template-columns: repeat(4, 1fr); }
  /* 문장제만(roadWordType='all') — 본문이 길어 한 칸을 넓게 준다, 2열×5행 */
  .nm-print-grid.nm-print-grid-10 { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .nm-print-grid.nm-print-grid-10 .nm-print-item { padding: 9px 10px; min-height: 40px; }
  .nm-print-age-young .nm-print-grid-10 .nm-print-item,
  .nm-print-age-mid   .nm-print-grid-10 .nm-print-item { padding: 9px 10px; min-height: 40px; }
  /* 드릴별 학습지 코드 나열 — 헤더·정답지 양쪽에(?ws= 도우미가 이해하는 형식 그대로) */
  .nm-print-mix-note { font-size: 0.72em; color: #555; margin-top: 6px; font-family: monospace;
    word-break: break-all; }

  .nm-print-answer-key .nm-ak-grid { display: grid; grid-template-columns: repeat(5,1fr); gap: 6px; }
  .nm-print-answer-key .nm-ak-item,
  .nm-print-answer-key .nm-ak-guide-item { font-size: 0.9em; }
  .nm-print-qr-wrap { margin-left: auto; display: flex; flex-direction: column; align-items: center; gap: 2px; }
  .nm-print-qr-code { font-family: monospace; font-size: 10px; }
  .nm-print-qr-wrap svg { width: 21mm; height: 21mm; shape-rendering: crispEdges; }
  .nm-print-qr-cap { font-size: 8px; color: #333; max-width: 26mm; text-align: center; line-height: 1.15; }
  .nm-print-concept-page { page-break-after: always; break-after: page; }
  .nm-cp-body { margin-top: 6px; }
  .nm-cp-block { margin-bottom: 16px; }
  .nm-cp-badge { display: inline-block; font-size: 11px; background: #eee; border-radius: 10px; padding: 2px 10px; margin-bottom: 4px; }
  .nm-cp-title { margin: 0 0 6px; font-size: 16px; }
  .nm-cp-sentence { margin: 0; font-size: 13px; line-height: 1.6; }
  .nm-cp-stage { margin-bottom: 10px; }
  .nm-cp-stage-h { font-weight: bold; font-size: 13px; margin-bottom: 2px; }
  .nm-cp-stage-d { font-size: 12.5px; line-height: 1.6; }
  .nm-cp-mathsteps { margin: 6px 0; font-size: 13px; }
  .nm-cp-mathsteps > div { margin: 2px 0; }
  .nm-cp-arrow { color: #888; }
  .nm-cp-rule { background: #f4f4f4; border-radius: 6px; padding: 8px 10px; font-size: 12px; margin-top: 6px; }
  .nm-cp-rule p { margin: 4px 0 0; }

  /* 표지 — 지오메트리 랩 학습지의 A4 표지(브랜드/제목/구분선/캐릭터/이름칸/코드)와
     같은 짜임이지만, 톤은 Numbers of Magic(종이+잉크+골드)로. 2026-08-28. */
  .nm-print-cover { --cv-accent:#C9A063; position:relative; display:flex; flex-direction:column;
    min-height:255mm; padding:16mm 14mm; box-sizing:border-box; background:#FBFAF7;
    break-after:page; page-break-after:always; }
  .nm-print-cover::after { content:""; position:absolute; inset:7mm; border:1px solid #E4E2DC; pointer-events:none; }
  .nm-cv-brand { position:relative; display:flex; align-items:baseline; justify-content:space-between;
    padding:0 2mm 5mm; border-bottom:2px solid #0E2C57; }
  .nm-cv-brand span { font-size:12px; font-weight:900; letter-spacing:2px; color:var(--cv-accent); }
  .nm-cv-brand strong { font-size:12px; font-weight:800; letter-spacing:1.6px; color:#0E2C57; }
  .nm-cv-brand strong i { font-style:normal; color:var(--cv-accent); }
  .nm-cv-copy { position:relative; margin:auto 0 0; text-align:center; }
  .nm-cv-kicker { margin:0 0 6mm; font-size:12px; font-weight:900; letter-spacing:3px; color:var(--cv-accent); }
  .nm-cv-title { margin:0; font-size:32px; line-height:1.35; font-weight:900; color:#0E2C57; word-break:keep-all; }
  .nm-cv-rule { width:26mm; height:3px; margin:9mm auto; background:var(--cv-accent); }
  .nm-cv-sub { margin:0; font-size:13px; line-height:1.9; color:#5c6a72; }
  /* 캐릭터 대신 넘버스매직의 상표 모티프(1·2·4·8·16, about.html 히어로 성좌와 같은 수열)로
     장식 — 지오메트리처럼 별도 캐릭터 스프라이트 자산이 없어도 브랜드가 드러난다. */
  .nm-cv-marks { position:relative; display:flex; justify-content:center; gap:8mm; margin:8mm auto auto; }
  .nm-cv-marks span { display:flex; align-items:center; justify-content:center; width:14mm; height:14mm;
    border-radius:50%; background:#0E2C57; color:#F5D98B; border:1.2px solid var(--cv-accent);
    font-family:monospace; font-weight:700; font-size:12px;
    -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  .nm-cv-meta { position:relative; display:grid; grid-template-columns:1fr 1fr 1fr; gap:6mm;
    margin:0 6mm; padding:7mm 4mm; border-top:1px solid #c9c6be; border-bottom:1px solid #c9c6be; }
  .nm-cv-meta > div { display:grid; grid-template-columns:auto 1fr; align-items:end; gap:3mm; }
  .nm-cv-meta span { font-size:11px; font-weight:800; color:#4a5468; white-space:nowrap; }
  .nm-cv-meta i { font-style:normal; height:8mm; border-bottom:1px solid #1A2233; display:block; }
  .nm-cv-meta b { font-style:normal; font-size:13px; font-weight:800; color:var(--cv-accent); justify-self:start; }
  .nm-cv-footer { position:relative; display:flex; justify-content:space-between; margin-top:8mm;
    padding:0 2mm; font-size:10px; font-weight:800; letter-spacing:1px; color:#0E2C57; }
  .nm-cv-footer b { color:var(--cv-accent); }
  .nm-cv-code { position:relative; margin:3mm 2mm 0; font-family:monospace; font-size:9px; color:#93a0a8; }

  /* ── 학습지 v2 · 유형별 회차 (학습지-v2-설계.md §2, 2026-09-04) ───────
     A4 고정 높이 페이지(flex column). 머리띠·개념·예시·지시문은 flex:0 0 auto로
     제 높이만 쓰고, 문항 그리드가 flex:1로 남는 높이를 전부 채운다 —
     grid-auto-rows:1fr라 문항 수가 적어도 줄 간격이 균등하게 늘어나고,
     문항 수가 표(§2-5)대로여도 페이지 밖으로 넘치지 않는다(칸이 줄어들 뿐). */
  .nm-w2-page { display:flex; flex-direction:column; height:277mm; box-sizing:border-box;
    page-break-before:always; break-before:page; overflow:hidden; }
  .nm-w2-head { --w2-accent:#0E2C57; flex:0 0 auto; border-bottom:1px solid #1A2233;
    padding-bottom:5px; margin-bottom:7px; }
  .nm-w2-head-top { display:flex; gap:16px; font-size:9px; color:#555; margin-bottom:4px; }
  .nm-w2-head-row { display:flex; align-items:center; gap:8px; }
  .nm-w2-head-brand { font-size:10px; font-weight:800; letter-spacing:1px; color:#333;
    border:1px solid #ccc; border-radius:3px; padding:3px 7px; white-space:nowrap; }
  .nm-w2-head-mid { flex:1; min-width:0; background:var(--w2-accent); color:#fff; border-radius:4px;
    padding:5px 10px; display:flex; align-items:baseline; gap:8px; overflow:hidden;
    -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  .nm-w2-head-mid b { font-size:13px; white-space:nowrap; }
  .nm-w2-head-mid span { font-size:10px; opacity:.85; }
  .nm-w2-head-code { font-size:10px; font-family:monospace; color:#555; white-space:nowrap; }

  .nm-w2-instr { flex:0 0 auto; font-weight:700; font-size:12px; margin-bottom:6px; }

  .nm-w2-grid { flex:1; display:grid; gap:3px 16px; grid-auto-rows:1fr; align-content:stretch;
    min-height:0; }
  .nm-w2-item.nm-print-item { border:0; background:none; padding:2px 4px; min-height:0;
    border-radius:0; display:flex; flex-direction:column; justify-content:center; overflow:hidden; }
  .nm-w2-item .nm-w2-num { font-size:10px; color:#666; font-weight:700; margin-right:4px; }
  /* 도전 알약(§2-6 items 6) — 회차 전체에서 램프(__ramp)가 시작되는 첫 문항
     번호 옆에만 한 번 붙는다(classifyRoundLayout/renderRoundPages의
     rampTagged 플래그). */
  .nm-w2-ramp-pill { display:inline-block; font-size:7.5px; font-weight:800; color:#fff;
    background:#c0392b; border-radius:7px; padding:1px 5px; margin-right:4px; vertical-align:middle;
    -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  .nm-w2-item .nm-w2-tex { font-size:15px; }
  .nm-w2-grid-medium .nm-w2-item .nm-w2-tex { font-size:16px; }
  .nm-w2-grid-long .nm-w2-item .nm-w2-tex { font-size:13.5px; }
  .nm-w2-grid-vertical .nm-print-vp { font-size:14px; margin:0 auto; }
  .nm-w2-item-vis.nm-print-item { align-items:center; text-align:center; }
  .nm-w2-item-word.nm-print-item { align-items:flex-start; }
  .nm-w2-abox { display:inline-block; width:14mm; height:8mm; border:1px solid #000;
    margin-left:8px; vertical-align:middle; }
  .nm-w2-page .nm-print-ask { margin:1px 0 3px; }
  .nm-w2-page .nm-print-steps { margin-top:3px; }
  .nm-w2-foot { flex:0 0 auto; margin-top:4px; font-size:8px; color:#999; font-family:monospace;
    text-align:right; }

  .nm-ak-section { margin-bottom:14px; }
  .nm-ak-subhead { margin:0 0 6px; font-size:13px; border-bottom:1px solid #ccc; padding-bottom:3px; }
  .nm-ak-subcode { font-family:monospace; font-size:10px; color:#777; margin-left:8px; font-weight:400; }
}
@media screen {
  .nm-print-sheet { display: none; }
}
/* ── 개념 패널·★예시(빨강) — 인쇄와 화면(온라인 회차 탭)이 같은 마크업을
   공유한다(학습지-v2-설계.md §3 "탭마다 개념 패널 + ★예시"). 미디어 쿼리로
   가두지 않고 항상 켜 둔다. */
.nm-w2-concept { background:#F5F3EE; border:1px solid #ece7da; border-radius:8px;
  padding:8px 12px; margin-bottom:8px; max-height:70mm; overflow:hidden; }
.nm-w2-concept-badge { display:inline-block; font-size:11px; background:#fff; border:1px solid #e2ddcf;
  border-radius:8px; padding:1px 9px; margin-bottom:4px; font-weight:700; color:#6b6250; }
.nm-w2-concept-sentence { margin:0 0 4px; font-size:12.5px; line-height:1.6; color:#2a2a2a; }
.nm-w2-concept-stage { margin:0 0 3px; font-size:11.5px; line-height:1.5; color:#3a3a3a; }
.nm-w2-concept-rule { margin:0; font-size:12px; line-height:1.55; color:#2a2a2a; }
.nm-w2-concept-ramp { margin:4px 0 0; font-size:12px; font-weight:800; color:#b8321f; }
.nm-w2-example { border:1.4px dashed #c33; border-radius:8px; padding:7px 12px; margin-bottom:8px; }
.nm-w2-ex-badge { display:inline-block; font-size:10.5px; color:#c33; font-weight:800; margin-bottom:4px; }
.nm-w2-ex-steps { display:flex; flex-wrap:wrap; align-items:center; gap:5px; color:#c33; font-size:14px; }
.nm-w2-ex-arrow { color:#c33; }
.nm-w2-ex-line { display:flex; align-items:center; gap:8px; font-size:14px; flex-wrap:wrap; }
.nm-w2-ex-ans, .nm-w2-ex-ans-tex { color:#c33; font-weight:700; }
.nm-w2-ex-note { color:#c33; font-size:11.5px; margin-top:3px; }
.nm-w2-ex-vp { display:inline-flex; flex-direction:column; font-family:monospace; font-size:14px; color:#000; }
.nm-w2-ex-vp-line { border-top:1.5px solid #000; margin:2px 0; }
.nm-w2-ex-vp-ans { text-align:right; color:#c33; font-weight:700; }
/* 따라 풀기(§4 guided items) — 예시 바로 다음, 문항 (1) 앞. 과정은 검정,
   \square는 채우지 않고 그대로 둬(빈칸 글리프) 학생이 직접 쓴다. */
.nm-w2-guide { border:1px solid #d8d3c5; border-radius:8px; padding:7px 12px; margin-bottom:8px; background:#fff; }
.nm-w2-guide-title { font-weight:700; font-size:12px; margin-bottom:5px; }
.nm-w2-guide-item { padding:4px 0; border-top:1px dashed #e3ded0; }
.nm-w2-guide-item:first-of-type { border-top:0; padding-top:0; }
.nm-w2-guide-q { display:flex; align-items:baseline; gap:8px; font-size:13px; }
.nm-w2-guide-label { font-weight:800; color:#555; flex:0 0 auto; }
.nm-w2-guide-chain { display:flex; flex-wrap:wrap; align-items:center; gap:6px; font-size:12.5px;
  color:#000; margin-top:3px; padding-left:18px; }
.nm-w2-guide-arrow { color:#000; }
.nm-w2-guide-blank { font-weight:700; }
/* 온라인 세션 탭(runSessionTabs) — 기존 화면 클래스(.nm-ws-*, .nm-grid-*)를
   대부분 재사용하고, 세션 전용 몇 개만 여기서 보탠다. */
.nm-grid-meta-row { display:flex; align-items:center; gap:10px; margin:2px 0 10px; }
.nm-grid-attempt { font-size:12px; font-weight:800; color:#5a5a5a; }
.nm-grid-best { font-size:12px; font-weight:800; color:#1a7f4b; }
.nm-grid-lownote { font-size:12.5px; color:#b5462f; font-weight:700; margin-top:4px; }
`;
  document.head.appendChild(s);
})();

/* ── 내부 헬퍼 ─────────────────────────────── */
const $ = (sel, ctx) => (ctx || document).querySelector(sel);
const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

/* KaTeX 미로딩(CDN 지연·차단) 시 폴백 — LaTeX 명령어를 사람이 읽는 기호로 치환한다.
   engine/threads/*.js 전수 스캔(2026-08-25)으로 뽑은 실사용 명령어 전부 포함.
   치환표에 없는 명령어가 새로 생기면 마지막 줄에서 백슬래시만 벗겨진 채 이름이
   그대로 남는다(예: "\\foo" → "foo") — 여전히 읽을 수는 있고, 옛 동작과 같다. */
function texToPlain(tex){
  let s = String(tex==null?'':tex);
  /* 학습지 v2 예시(w2ExampleHtml)가 붙이는 \displaystyle·\color{#d33}{…} —
     KaTeX 미로딩 폴백에서도 안쪽 값만 남기고 명령은 지운다(2026-09-04). */
  s = s.replace(/\\displaystyle\s*/g, '');
  s = s.replace(/\\color\{[^{}]*\}\{([^{}]*)\}/g, '$1');
  /* 행렬(\begin{pmatrix}...\end{pmatrix}, MD30) — 다른 치환보다 먼저 처리해야
     내부의 \square 등이 아래 규칙들로 이어서 정상 변환된다(행 구분자 "&"를
     공백으로, 줄바꿈 "\\\\"를 " / "로 바꿔 괄호 안에 담는다). 2026-08-25
     고등 W11·W12 신규 유형 추가 시 원장 지시로 KaTeX를 로컬 탑재하며 함께 등록. */
  s = s.replace(/\\begin\{pmatrix\}([\s\S]*?)\\end\{pmatrix\}/g, (_, inner) => {
    const rows = inner.split('\\\\').map(r => r.trim().split('&').map(c => c.trim()).join(' '));
    return '(' + rows.join(' / ') + ')';
  });
  /* 구간별 함수(\begin{cases}...\end{cases}, MD59) — 행마다 "값 (조건)"으로
     풀어 세미콜론으로 잇는다. 2026-08-27 심화 유형 2차 신규(MD59). */
  s = s.replace(/\\begin\{cases\}([\s\S]*?)\\end\{cases\}/g, (_, inner) => {
    const rows = inner.split('\\\\').map(r => r.trim().split('&').map(c => c.trim()).join(' ')).filter(Boolean);
    return '{' + rows.join('; ') + '}';
  });
  s = s.replace(/\\square/g,'□');
  /* \sqrt{}·\overline{}는 자기 괄호를 갖는 "안쪽" 명령이라, 바깥의 \dfrac{}{}·
     \frac{}{}보다 먼저 벗겨내야 한다 — 안 그러면 \dfrac{\square\pm\sqrt{\square}}{r}
     처럼 분자 안에 \sqrt{}가 중첩된 경우 [^{}]*가 그 내부 중괄호에 걸려 바깥
     \dfrac 자체가 매치되지 않고 "dfrac"이라는 글자만 그대로 남는다(근의 공식
     (p±√q)/r 표기에서 실제로 걸렸던 잔여물 — 2026-08-25 고등 W11 검증 중 발견). */
  s = s.replace(/\\sqrt\{([^{}]*)\}/g,'√$1');
  s = s.replace(/\\overline\{([^{}]*)\}/g,'$1');
  s = s.replace(/\\dfrac\{([^{}]*)\}\{([^{}]*)\}/g,'$1/$2');
  s = s.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g,'$1/$2');
  s = s.replace(/\\text\{([^{}]*)\}/g,'$1');
  s = s.replace(/\\times/g,'×');
  s = s.replace(/\\div/g,'÷');
  /* \cdots는 \cdot로 시작하는 문자열이라, \cdot을 먼저 치환하면 "\cdot"
     부분만 먼저 먹혀 뒤에 "s"만 남고("×s") \cdots 규칙이 다시는 못
     매치되는 순서 버그였다(2026-08-27, 전 스레드 잔여물 스캔 중 발견 —
     실사용 중인 "…" 표기가 실제로 깨져 있었다). \cdots를 먼저 처리. */
  s = s.replace(/\\cdots/g,'⋯');
  s = s.replace(/\\cdot/g,'×');
  s = s.replace(/\\bigcirc/g,'○');
  s = s.replace(/\\dots/g,'…');
  s = s.replace(/\\Rightarrow/g,'⇒');
  s = s.replace(/\\rightarrow/g,'→');
  s = s.replace(/\\therefore/g,'∴');
  s = s.replace(/\\gcd/g,'gcd');
  /* 부등호·±·항등·그리스문자(2026-08-25, 고등 W11 판별식·근의공식·근과계수·
     이차부등식 신규) — \pm는 근의 공식 (p±√q)/r 표기의 핵심이라 KaTeX
     렌더와 이 인쇄 폴백 양쪽에서 반드시 살아 있어야 한다. */
  s = s.replace(/\\pm/g,'±');
  s = s.replace(/\\mp/g,'∓');
  s = s.replace(/\\le/g,'≤');
  s = s.replace(/\\ge/g,'≥');
  s = s.replace(/\\ne/g,'≠');
  s = s.replace(/\\equiv/g,'≡');
  s = s.replace(/\\alpha/g,'α');
  s = s.replace(/\\beta/g,'β');
  /* 고등 W13·W14(대수·미적분Ⅰ, 2026-08-25) 신규 명령 — \sum·\int는 실제
     기호로, \lim·\log·\sin·\cos·\tan은 그대로 읽는 이름이라 단어로,
     \to는 "다가간다"는 뜻의 화살표로 바꾼다. 순서는 서로 겹치는 부분
     문자열이 없어 무관하다(예: "\to"는 "\tan" 안의 부분열이 아니다). */
  s = s.replace(/\\sum/g,'Σ');
  s = s.replace(/\\int/g,'∫');
  s = s.replace(/\\lim/g,'lim');
  s = s.replace(/\\log/g,'log');
  s = s.replace(/\\sin/g,'sin');
  s = s.replace(/\\cos/g,'cos');
  s = s.replace(/\\tan/g,'tan');
  s = s.replace(/\\to/g,'→');
  /* 고등 심화 2차(2026-08-27, MD54·MD57) 신규 — \pi는 원주율 기호로. */
  s = s.replace(/\\pi/g,'π');
  /* 전 스레드 잔여물 스캔(2026-08-27, 심화 유형 2차 검증 중 발견) —
     \circ(각도 기호, mid6.js MD39 삼각비부터 이미 쓰였고 mid8.js
     MD55·MD56에서 대폭 늘어남)와 \max·\min(mid.js 최대·최소 유닛,
     이 파일과 무관하게 이미 있었음)이 치환표에 없어 "^circ"·"max"
     처럼 백슬래시만 벗겨진 잔여물로 남아 있었다 — 전체 스레드 스캔으로
     찾아 함께 등록. */
  s = s.replace(/\\circ/g,'°');
  s = s.replace(/\\max/g,'max');
  s = s.replace(/\\min/g,'min');
  s = s.replace(/\\qquad/g,'    ');
  s = s.replace(/\\quad/g,'  ');
  s = s.replace(/\\[;,!]/g,' ');
  s = s.replace(/[{}]/g,'');
  s = s.replace(/\\/g,'');
  return s;
}

function renderKaTeX(tex, el){
  if(window.katex){
    try{ katex.render(tex, el, {throwOnError:false}); return; }catch(_){}
  }
  el.textContent = texToPlain(tex);
}

function esc(str){ return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

/* 다칸 답(배열) 표기: [3,5] → "3, 5". 단일 답은 그대로.
   answerShape가 있으면(분수 정답) 이 대신 ansTex()의 \dfrac 수식을 쓴다 — fmtAns는
   answerShape 없는 배열(다칸 답 일반형)에만 쓴다. */
function fmtAns(a){ return Array.isArray(a) ? a.join(', ') : a; }
/* answerShape 정답을 KaTeX tex로: 'fraction'→[n,d]='\dfrac{n}{d}', 'mixed'→[w,n,d]='w\dfrac{n}{d}'.
   answerShape 없으면 null(호출부가 fmtAns로 폴백). */
function ansTex(p){
  if(!p||!p.answerShape||!Array.isArray(p.answer))return null;
  if(p.answerShape==='fraction'){
    const [n,d]=p.answer;
    return `\\dfrac{${n}}{${d}}`;
  }
  if(p.answerShape==='mixed'){
    const [w,n,d]=p.answer;
    return `${w}\\dfrac{${n}}{${d}}`;
  }
  /* 분모의 유리화(MD18) — 답은 [근호 안 수, 분모]다. 예전엔 'fraction'으로 표시돼
     있어 정답지가 `71/71`로 찍혔다(실제 답은 √71/71). 71/71은 1로 읽히니
     교사가 채점할 수 없는 정답지였다. 2026-08-29. */
  if(p.answerShape==='radicalFraction'){
    const [rad,d]=p.answer;
    return `\\dfrac{\\sqrt{${rad}}}{${d}}`;
  }
  /* 계수√근호(MD39 등) — 답은 [계수, 근호 안 수]. "3, 3"보다 3√3이 읽기 쉽다. */
  if(p.answerShape==='coeffRadical'){
    const [c,rad]=p.answer;
    return `${c === 1 ? '' : c}\\sqrt{${rad}}`;
  }
  /* 계수√근호/분모(MD39 fracRoot) — [계수, 근호 안 수, 분모] */
  if(p.answerShape==='coeffRadicalFraction'){
    const [c,rad,d]=p.answer;
    return `\\dfrac{${c === 1 ? '' : c}\\sqrt{${rad}}}{${d}}`;
  }
  return null;
}
/* 정답 셀 HTML — answerShape면 KaTeX용 <span data-tex>, 아니면 기존 텍스트.
   호출부는 innerHTML을 채운 뒤 반드시 '.nm-ans-tex'에 renderKaTeX을 돌려야 한다
   (기존 '.nm-vp-tex' 루프와 같은 패턴 — 아래 각 render()에 추가돼 있음). */
function ansHtml(p){
  const tex=ansTex(p);
  if(tex)return `<span class="nm-ans-tex" data-tex="${esc(tex)}"></span>`;
  return esc(String(fmtAns(p.answer)));
}
/* 다칸 답 채점: raw는 콤마로 구분한 사용자 입력 문자열("3, 5" 등), answer는 problem.answer.
   answer가 배열이 아니면 기존 parseFloat 비교와 동일. */
function matchesAnswer(raw, answer){
  if(Array.isArray(answer)){
    const parts=String(raw==null?'':raw).split(',').map(s=>parseFloat(s.trim()));
    return parts.length===answer.length && parts.every((v,i)=>v===answer[i]);
  }
  return parseFloat(raw)===answer;
}

/* 온라인 문제 셀(그리드 학습지 채점 화면) — runGridExam(단일 유형)과
   runSessionTabs(세션 유형별 탭, 학습지-v2-설계.md §3)가 함께 쓴다. graded·
   userAnswers를 인자로 받아 채점 상태를 표시하므로 두 호출부가 각자의
   상태(탭마다 따로)를 그대로 넘기면 된다 — 채점 로직을 두 번 베끼지 않는다. */
function gridCellHtml(p, i, mode, graded, userAnswers){
  // mode: 'online' | 'blank' | 'answer'
  const v = p.word ? null : parseVert(p.tex);
  const num = circled(i+1);
  let inner;
  let wide = false;
  if(p.word){
    wide = true;
    let ansRow;
    if(mode==='online'){
      ansRow = Array.isArray(p.answer)
        ? `<input class="nm-vp-inp nm-vp-inp-sm" type="text" inputmode="decimal" data-idx="${i}" autocomplete="off" placeholder="예: 3, 5">`
        : `<input class="nm-vp-inp nm-vp-inp-sm" type="number" inputmode="numeric" data-idx="${i}" autocomplete="off" placeholder="답">`;
    } else if(mode==='answer'){
      ansRow = `<span class="nm-vp-ans-val">${ansHtml(p)}</span>`;
    } else {
      ansRow = `<span class="nm-vp-blank">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>`;
    }
    const wc = pickChoices(p), wAsk = pickL(p.wordAsk);
    inner = `<div class="nm-vp-wordwrap">
  <div class="nm-vp-word">${esc(pickL(p.word))}</div>
  ${wAsk ? `<div class="nm-vp-wordask">${esc(wAsk)}</div>` : ''}
  ${p.wordEqn ? `<div class="nm-vp-word-eq">${esc(pickL(p.wordEqn))}</div>` : ''}
  ${wc ? `<ol class="nm-vp-choices">${wc.map(c => `<li>${esc(c)}</li>`).join('')}</ol>` : ''}
  <div class="nm-vp-word-ans">${ansRow}</div>
</div>`;
  } else if(v){
    let ansRow;
    if(mode==='online'){
      ansRow = `<input class="nm-vp-inp" type="number" inputmode="numeric" data-idx="${i}" autocomplete="off">`;
    } else if(mode==='answer'){
      ansRow = `<span class="nm-vp-ans-val">${ansHtml(p)}</span>`;
    } else {
      ansRow = `<span class="nm-vp-blank">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>`;
    }
    inner = `<div class="nm-vp">
  <div class="nm-vp-row nm-vp-top">${esc(v.a)}</div>
  <div class="nm-vp-row nm-vp-mid"><span class="nm-vp-op">${esc(v.op)}</span><span class="nm-vp-b">${esc(v.b)}</span></div>
  <div class="nm-vp-line"></div>
  <div class="nm-vp-row nm-vp-bot">${ansRow}</div>
</div>`;
  } else {
    /* 세로셈 불가 → 인라인 KaTeX */
    let ansRow;
    const isMulti=Array.isArray(p.answer);
    if(mode==='online'){
      ansRow = isMulti
        ? `<input class="nm-vp-inp nm-vp-inp-sm" type="text" inputmode="decimal" data-idx="${i}" autocomplete="off" placeholder="예: 3, 5">`
        : `<input class="nm-vp-inp nm-vp-inp-sm" type="number" inputmode="numeric" data-idx="${i}" autocomplete="off" placeholder="?">`;
    } else if(mode==='answer'){
      ansRow = `<span class="nm-vp-ans-val">${ansHtml(p)}</span>`;
    } else {
      ansRow = '';
    }
    inner = `<div class="nm-vp-inline">
  <div class="nm-vp-tex" data-tex="${esc(p.tex||'')}"></div>
  ${ansRow}
</div>`;
  }
  const stateClass = graded && mode==='online'
    ? (matchesAnswer(userAnswers[i],p.answer) ? ' nm-ws-ok' : (userAnswers[i]!=='' ? ' nm-ws-err' : ''))
    : '';
  return `<div class="nm-ws-cell${wide?' nm-ws-wide':''}${stateClass}" data-ci="${i}">
  <span class="nm-ws-cnum">${num}</span>
  ${inner}
</div>`;
}

/* ── 온라인 "문제 단계" — 세션의 드릴을 유형별 탭으로 (학습지-v2-설계.md §3) ──
   탭마다 개념 패널 + ★예시(빨강, w2ConceptPanelHtml/w2ExampleHtml을 화면에도
   그대로 재사용) + 문항 N개 + 채점. 문제 셀·채점 로직은 gridCellHtml/
   matchesAnswer를 그대로 쓴다(두 번째 사본을 만들지 않는다). 최상위 함수로
   두는 이유: 이 화면을 여는 NM_EXAM.renderExamSetup(showRoadPick 안의
   doSolveOnline)과, 예전 그리드 학습지를 굴리는 window.examScreen이 서로
   다른 클로저라 컨테이너를 인자로 받아야 둘 다에서 부를 수 있다.
   items: [{thread,level,wordType?,seed}]. meta:{title, count, onBack}. */
function runSessionTabs(container, items, meta){
  const perType = meta.count || 20;
  function sessionsOf(thread){ return window.NM_STATS ? NM_STATS.sessionsOf(thread) : []; }
  /* 회차 카운터는 §3 "🔁 새 문제로 다시 (n회째)"의 n — 탭을 처음 열 때는
     그동안 채점해 온 세션 수+1에서 시작하고(NM_STATS.sessionsOf), 이번에
     앉은 자리에서 "새 문제로 다시"를 누를 때마다 1씩 올라간다(채점 여부와
     무관하게 항상 보이는 버튼이라, 채점 전에 여러 번 눌러도 자연히 는다). */
  function buildTab(it){
    const cfg = { thread: it.thread, level: it.level, count: perType, seed: it.seed, wordType: it.wordType };
    const numericSeed = NM_RNG.hashSeed(cfg.seed);
    const problems = buildProblems(cfg.thread, cfg.level, cfg.count, numericSeed);
    applyWordProblems(problems, cfg.wordType, numericSeed);
    return {
      cfg, problems, userAnswers: new Array(cfg.count).fill(''), graded: false, gradeScore: 0,
      attemptNo: sessionsOf(cfg.thread).length + 1
    };
  }
  const tabs = items.map(buildTab);
  let activeTab = 0;

  function bestRateFor(thread){
    const list = sessionsOf(thread);
    return list.length ? Math.max.apply(null, list.map(s => s.rate)) : null;
  }

  function render(){
    const t = tabs[activeTab];
    const mode = 'online';
    const attemptNo = t.attemptNo;
    const best = bestRateFor(t.cfg.thread);
    const scoreHtml = t.graded
      ? `<div class="nm-grid-score ${t.gradeScore/t.cfg.count>=0.8?'nm-grid-pass':'nm-grid-fail'}">${t.gradeScore}/${t.cfg.count} (${Math.round(t.gradeScore/t.cfg.count*100)}%)</div>`
      : '';
    const lowNote = (t.graded && t.gradeScore/t.cfg.count < 0.6)
      ? `<div class="nm-grid-lownote">${esc(lk('한 번 더 연습해 볼까요?','Try one more round.','再练一次吧。'))}</div>`
      : '';
    const bestHtml = best!=null
      ? `<span class="nm-grid-best">${esc(lk('최고','Best','最高'))} ${Math.round(best*100)}%</span>` : '';
    const round0Code = NM_EXAM.worksheetCode({thread:t.cfg.thread, level:t.cfg.level, count:t.cfg.count, seed:t.cfg.seed});
    const conceptHtml = w2ConceptPanelHtml(t.cfg.thread, t.cfg.level);
    const exampleHtml = w2ExampleHtml(t.cfg.thread, t.cfg.level, round0Code);
    /* 따라 풀기(§4/§build 7) — 인쇄와 같은 마크업을 화면에도 그대로(읽기 전용,
       탭을 오갈 때마다 같은 시드로 다시 만들므로 매번 같은 3문제). */
    const guidedHtml = w2GuidedHtml(t.cfg.thread, t.cfg.level, round0Code).html;

    container.innerHTML = `
<div class="nm-ws-wrap nm-ws-session">
  <div class="nm-ws-hd">
    <div class="nm-ws-hd-left"><span class="nm-grid-badge">${esc(meta.title||'')}</span></div>
  </div>
  <div class="nm-ws-tabs nm-ws-session-tabs">
    ${tabs.map((x,idx) => `<button class="nm-ws-tab${idx===activeTab?' active':''}" data-tabidx="${idx}">
      ${x.graded && x.gradeScore/x.cfg.count>=0.8 ? '✅ ' : ''}${esc(pickL(((window.NM_THREADS||{})[x.cfg.thread]||{}).name) || x.cfg.thread)}
    </button>`).join('')}
  </div>
  <div class="nm-grid-meta-row">
    <span class="nm-grid-attempt">${esc(lk(`${attemptNo}회째`,`Attempt ${attemptNo}`,`第${attemptNo}次`))}</span>
    ${bestHtml}
  </div>
  ${conceptHtml}
  ${exampleHtml}
  ${guidedHtml}
  <div class="nm-ws-grid">
    ${t.problems.map((p,i)=>gridCellHtml(p,i,mode,t.graded,t.userAnswers)).join('')}
  </div>
  <div class="nm-ws-foot">
    ${scoreHtml}${lowNote}
    <button id="nm-ws-grade" class="nm-ex-btn-primary">${esc(lk('채점하기 ✓','Grade ✓','批改 ✓'))}</button>
    <button id="nm-ws-reroll" class="nm-ex-btn-secondary">🔁 ${esc(lk(`새 문제로 다시 (${attemptNo}회째)`,`New problems (attempt ${attemptNo})`,`换新题(第${attemptNo}次)`))}</button>
    <button id="nm-ws-back" class="nm-ex-btn-ghost">← ${esc(lk('세션 목록으로','Back to sessions','返回课节列表'))}</button>
  </div>
</div>`;

    container.querySelectorAll('.nm-vp-tex, .nm-w2-tex, .nm-cp-tex, .nm-ans-tex').forEach(el =>
      renderKaTeX(el.dataset.tex||'', el));

    const inps = [...container.querySelectorAll('.nm-vp-inp')];
    inps.forEach(inp => {
      const idx = parseInt(inp.dataset.idx);
      if(t.userAnswers[idx]!=='') inp.value = t.userAnswers[idx];
      inp.addEventListener('input', () => { t.userAnswers[idx]=inp.value; });
      inp.addEventListener('keydown', e => {
        if(e.key==='Enter'){ const nx = inps[inps.indexOf(inp)+1]; if(nx) nx.focus(); }
      });
    });

    container.querySelectorAll('[data-tabidx]').forEach(btn => {
      btn.addEventListener('click', () => { activeTab = parseInt(btn.dataset.tabidx,10); render(); });
    });
    container.querySelector('#nm-ws-grade').addEventListener('click', () => {
      t.graded = true; t.gradeScore = 0;
      t.problems.forEach((p,i) => { if(matchesAnswer(t.userAnswers[i],p.answer)) t.gradeScore++; });
      if(window.NM_STATS) NM_STATS.record(t.cfg.thread, t.cfg.level, t.gradeScore, t.cfg.count, null);
      render();
    });
    container.querySelector('#nm-ws-reroll').addEventListener('click', () => {
      const ns = NM_RNG.newCode();
      const numericSeed = NM_RNG.hashSeed(ns);
      t.cfg = Object.assign({}, t.cfg, { seed: ns });
      t.problems = buildProblems(t.cfg.thread, t.cfg.level, t.cfg.count, numericSeed);
      applyWordProblems(t.problems, t.cfg.wordType, numericSeed);
      t.userAnswers = new Array(t.cfg.count).fill('');
      t.graded = false; t.gradeScore = 0;
      t.attemptNo++;
      render();
    });
    container.querySelector('#nm-ws-back').addEventListener('click', () => {
      if(meta.onBack) meta.onBack();
    });
  }
  render();
}

/* ── 학습지 ID QR + 개념 연동 (2026-08-25) ──────────────────
   QR에 담는 URL은 불변 규약: https://docssam1.github.io/lete-on/number_magic/?ws=<학습지ID>
   학습지 ID(=worksheetCode에서 '#'을 뗀 값)는 스레드·레벨·문항수·시드를 그대로 담고 있어서
   나중에 문항을 재생성할 수 있다(과정-로드맵.md §11) — 채점 회수는 Phase 2. */
const WS_BASE_URL = 'https://docssam1.github.io/lete-on/number_magic/?ws=';
function wsUrlFromCode(code){ return WS_BASE_URL + String(code||'').replace(/^#/,''); }

/* QR을 <img>/canvas가 아니라 인라인 SVG(경로 하나)로 그린다 — 인쇄 시 canvas는
   프린트 다이얼로그가 뜨는 타이밍에 따라 비어 있는 채로 인쇄될 위험이 있어 제외
   (작업 지시 §2 "canvas면 인쇄 누락 위험"). SVG는 일반 DOM이라 항상 같이 인쇄된다. */
function qrSvg(text){
  if(!window.qrcode) return ''; // vendor/qrcode.js 미로딩 — 캡션·코드 텍스트만으로 폴백
  let q;
  try{
    q = window.qrcode(0, 'M'); // typeNumber 0=자동, 오류정정 M(15%) — 학습지 인쇄 잉크 번짐 대비
    q.addData(text);
    q.make();
  }catch(e){ return ''; }
  const n = q.getModuleCount();
  const quiet = 4; // 모듈 단위 여백(표준 권장치) — 폰 카메라 인식률 확보
  const size = n + quiet*2;
  let d = '';
  for(let r=0;r<n;r++){
    for(let c=0;c<n;c++){
      if(q.isDark(r,c)) d += `M${c+quiet} ${r+quiet}h1v1h-1z`;
    }
  }
  return `<svg viewBox="0 0 ${size} ${size}" class="nm-qr-svg" role="img" aria-label="QR code">`
       + `<rect width="${size}" height="${size}" fill="#fff"/><path d="${d}" fill="#000"/></svg>`;
}

/* 이 유형에 열어 볼 개념 설명이 실제로 있는가 — 없는 유형이 424레벨 중 115개고
   하필 초등 전 범위다(NS·AD·SB·ML·DV·FR·DC·MX). 그런데 인쇄물은 늘 "QR을 찍으면
   개념 설명이 열려요"라고 적어 놓아서, 초등 학습지의 QR은 "준비되지 않았어요"만
   있는 빈 화면으로 이어졌다(2026-08-28 발견). 캡션을 사실에 맞춘다. */
function hasConceptFor(thread, level){
  const info = resolveConceptUnit(thread, level);
  if(!info) return false;
  return !!((info.unit && info.unit.discover) || info.thread.concept);
}

/* 헤더에 들어가는 코드+QR+캡션 블록(문제지·정답지 공용 스타일과 별개로 우측 정렬).
   hasConcept를 넘기지 않으면 개념이 있다고 보지 않고 중립 문구를 쓴다. */
function qrHeaderBlockHtml(code, hasConcept){
  /* 개념이 실제로 있을 때만 "개념 설명이 열려요"라고 적는다 — 없는 유형에서
     그렇게 적어 놓아 QR이 빈 화면으로 이어졌던 결함(위 hasConceptFor 주석).
     세 언어 모두 이 구분을 지킨다. */
  const cap = hasConcept
    ? lk('QR을 찍으면 개념 설명이 열려요',
         'Scan the QR to open the lesson notes',
         '扫描二维码，打开概念讲解')
    : lk('QR을 찍으면 이 학습지를 다시 만들 수 있어요',
         'Scan the QR to make this worksheet again',
         '扫描二维码，可以重新生成这张练习卷');
  return `<div class="nm-print-qr-wrap">
    <span class="nm-print-qr-code">${esc(code)}</span>
    ${qrSvg(wsUrlFromCode(code))}
    <span class="nm-print-qr-cap">${cap}</span>
  </div>`;
}

/* 스레드+레벨 → 관련 유닛 해석. threads.js의 단일 unit 필드로는 표현이 안 되는
   레벨별 유닛(ML12·ML16·ML17처럼 같은 제너레이터를 여러 유닛이 나눠 쓰는 경우)만
   여기서 오버라이드한다 — main.js의 학습지 도우미 화면(?ws=)도 이 함수를 그대로 쓴다. */
const UNIT_LEVEL_OVERRIDE = {
  ML12:{1:'C-02',2:'C-04',3:'C-34'},
  ML16:{1:'C-16',2:'C-28'},
  ML17:{1:'C-17',2:'C-29'},
};
function resolveConceptUnit(threadId, level){
  const th = (window.NM_THREADS||{})[threadId];
  if(!th) return null;
  const ov = UNIT_LEVEL_OVERRIDE[threadId];
  const uid = (ov && ov[level]) || th.unit || null;
  const u = uid ? (window.NM_UNITS||{})[uid] : null;
  return { threadId, thread:th, unitId:uid, unit:(u && u.discover) ? u : null };
}

/* ── 다국어 ────────────────────────────────────────────────
   2026-08-30까지 이 모듈은 한국어 한 벌만 냈다 — 이름/날짜/점수 라벨, "정답지 /
   Answer Key", QR 캡션, 표지 문구가 전부 하드코딩 한국어였고 문항도 prompt.ko만
   읽었다. 문항이 맨 수식뿐일 때는 그게 거의 드러나지 않았지만, 앱에 언어 토글이
   있고 486레벨의 prompt가 이미 세 벌인 데다 WP 문장제는 통째로 '문장'이다.
   중국어를 골라 둔 사람이 인쇄하면 한국어가 나오는 것은 빠진 기능이 아니라
   틀린 동작이라, 이제 세 언어를 모두 낸다.

   언어를 새로 정하지 않고 앱이 이미 쓰는 값을 그대로 탄다 — main.js의 S.lang이다.
   다만 S를 직접 읽을 수는 없다: main.js는 파일 전체가 IIFE(`(()=>{ … })()`)라
   S가 그 안에 갇혀 있어 다른 스크립트에서 보이지 않는다(확인함 — 브라우저에서
   typeof S가 'undefined'다). 그래서 S가 실려 나가는 곳, 즉 main.js가 save()로
   쓰는 저장 키를 읽는다. cycleLang()이 S.lang을 바꾸고 곧바로 save()한 다음
   render()하므로(셋 다 main.js), 이 값은 언제나 화면에 보이는 그 언어다.

   exam.js는 drill.html에서도 로드되는데 그쪽엔 main.js가 아예 없어 앱 상태도 없다.
   그래서 두 단으로 떨어진다:
     ① nm_state_v1의 lang — 앱이 저장해 둔 언어(메인 앱·인쇄 검사기)
     ② 문서의 lang 속성  — 앱 상태가 없는 페이지(drill.html은 <html lang="ko">)
   둘 다 없으면 한국어. */
const NM_LANG_KEY = 'nm_state_v1';
function normLang(l){ const v = String(l || '').slice(0, 2); return (v === 'en' || v === 'zh') ? v : 'ko'; }
/* 저장본 문자열이 그대로면 다시 파싱하지 않는다 — 한 장 찍는 동안 수백 번 불린다.
   (S에는 진도까지 들어 있어 매번 JSON.parse하면 인쇄 한 번에 그 비용을 다 문다.) */
let _langMemo = { raw: null, val: null };
function examLang(){
  try{
    const raw = localStorage.getItem(NM_LANG_KEY);
    if(raw){
      if(raw !== _langMemo.raw){
        const st = JSON.parse(raw);
        _langMemo = { raw, val: (st && st.lang) ? normLang(st.lang) : null };
      }
      if(_langMemo.val) return _langMemo.val;
    }
  }catch(e){}
  try{
    const d = document.documentElement.getAttribute('lang');
    if(d) return normLang(d);
  }catch(e){}
  return 'ko';
}
/* main.js의 lk(ko,en,zh)와 같은 꼴 — 그쪽 관례를 그대로 쓴다(새 관례를 만들지 않음). */
function lk(ko, en, zh){ const l = examLang(); return l === 'en' ? en : l === 'zh' ? zh : ko; }

/* 학생 이름(프로필) — 인쇄 워터마크용. 앱 상태가 없는 페이지(drill.html)에서도
   같은 저장본을 읽으므로 로그인해 쓰던 브라우저면 이름이 나온다. 없으면 빈 문자열. */
function printStudentName(){
  if(typeof window.NM_PRINT_NAME==='string') return window.NM_PRINT_NAME.trim(); // ws.html(링크 학습지)이 URL의 이름을 넘긴다
  try{
    const st=JSON.parse(localStorage.getItem(NM_LANG_KEY)||'null');
    return (st&&typeof st.name==='string')?st.name.trim():'';
  }catch(e){return '';}
}
/* 워터마크 블록 — position:fixed라 인쇄 시 모든 페이지에 반복된다.
   이름이 없으면 앱 이름만으로도 찍는다(학습지 출처 표시). */
function printWatermarkHtml(){
  const nm=printStudentName();
  const text=nm?nm+' · Numbers of Magic':'Numbers of Magic';
  return `<div class="nm-print-wm" aria-hidden="true">${esc(text)}</div>`;
}
/* main.js의 L(obj)와 같은 꼴 — {ko,en,zh} 필드에서 한 벌 고르기. 옛 pickKo를 대신한다.
   문자열이 그대로 오는 경우(호출부가 실어 보낸 topicName 등 한국어 전용 값)도 받는다. */
function pickL(field){
  if(!field) return '';
  if(typeof field === 'string') return field;
  const l = examLang();
  return field[l] || field.ko || field.en || '';
}
/* 보기(선택지) 한 벌 고르기 — WP 스레드는 {ko:[],en:[],zh:[]}로 주고, 옛 형태(배열)도
   그대로 받는다. 비었으면 null(호출부가 "보기 없음"으로 다룬다). */
function pickChoices(p){
  const c = p && p.choices;
  if(!c) return null;
  const arr = Array.isArray(c) ? c : (c[examLang()] || c.ko || c.en);
  return (Array.isArray(arr) && arr.length) ? arr : null;
}

/* 개념 페이지의 계단식 수식(mathSteps) — cellHtml과 같은 data-tex 패턴, 호출부가
   렌더 후 '.nm-cp-tex'에 renderKaTeX을 돌려야 한다. */
function mathStepsHtmlPrint(steps){
  if(!steps || !steps.length) return '';
  /* 항목은 문자열(언어 중립) 또는 {ko,en,zh} — main.js mathStepsExpr와 같은 계약 */
  return `<div class="nm-cp-mathsteps">` + steps.map((step,i) => {
    const tex = typeof step === 'string' ? step : pickL(step);
    return (i ? '<div class="nm-cp-arrow">↓</div>' : '') + `<div class="nm-cp-tex" data-tex="${esc(tex)}"></div>`;
  }).join('') + `</div>`;
}

/* 유형 하나(스레드+레벨)의 개념 블록 — 관련 유닛이 있으면 그 유닛의 마법 노트(제목·앞
   1~2단계·규칙)를, 없으면 threads.js의 concept 필드를, 그것도 없으면 이름만. */
function conceptBlockHtml(threadId, level){
  const info = resolveConceptUnit(threadId, level);
  if(!info) return '';
  const nm = pickL(info.thread.name) || threadId;
  if(info.unit){
    const u = info.unit, d = u.discover;
    const title = pickL(u.title) || nm;
    const stages = (d.stages||[]).slice(0,2); // 학습지 한 장 분량으로 축약 — 도입부면 충분
    const stagesHtml = stages.map(s => `<div class="nm-cp-stage">`
        + (s.head ? `<div class="nm-cp-stage-h">${esc(pickL(s.head))}</div>` : '')
        + (s.desc ? `<div class="nm-cp-stage-d">${pickL(s.desc)}</div>` : '') // desc는 <b> 등 자체 저작 HTML 포함(main.js stepDiscover와 동일하게 그대로 삽입)
        + mathStepsHtmlPrint(s.mathSteps)
        + `</div>`).join('');
    const ruleHtml = d.rule ? `<div class="nm-cp-rule"><b>${esc(lk('마법의 규칙','The Magic Rule','魔法规则'))}</b><p>${esc(pickL(d.rule))}</p></div>` : '';
    return `<div class="nm-cp-block">
      <div class="nm-cp-badge">📓 ${esc(nm)}</div>
      <h3 class="nm-cp-title">${esc(title)}</h3>
      ${stagesHtml}${ruleHtml}
    </div>`;
  }
  if(info.thread.concept){
    return `<div class="nm-cp-block">
      <h3 class="nm-cp-title">${esc(nm)}</h3>
      <p class="nm-cp-sentence">${esc(pickL(info.thread.concept))}</p>
    </div>`;
  }
  /* 개념 내용이 아예 없으면 빈 블록을 만들지 않는다 — 예전엔 유형 이름만 적힌
     장이 통째로 인쇄됐다(개념 없는 유형이 115레벨이라 종이 낭비가 컸다).
     블록이 하나도 없으면 conceptPageHtml이 개념 장 자체를 만들지 않는다. */
  return '';
}

/* items: [{thread,level}, ...] — 현재는 학습지 한 장이 스레드 하나뿐이라 늘 1개짜리
   배열이지만, 나중에 혼합 학습지가 생겨도 이 함수는 그대로 여러 유형을 순서대로
   이어붙인다(작업 지시 §5-4, "넘치면 자연 페이지 나눔" — 높이를 고정하지 않는다). */
function conceptPageHtml(items, code){
  const blocks = items.map(it => conceptBlockHtml(it.thread, it.level)).join('');
  if(!blocks) return '';
  return `<div class="nm-print-concept-page">
  <div class="nm-print-header">
    <h2 style="margin:0">Numbers of Magic — ${esc(lk('개념 노트','Lesson Notes','概念笔记'))}</h2>
    <div style="display:flex;gap:24px;margin-top:8px;font-size:0.9em;align-items:flex-start">
      <span>${esc(lk('이름','Name','姓名'))}: <span style="display:inline-block;width:120px;border-bottom:1px solid #000">&nbsp;</span></span>
      ${qrHeaderBlockHtml(code, true)}
    </div>
  </div>
  <div class="nm-cp-body">${blocks}</div>
</div>`;
}

/* "개념 패널 넣기" 토글은 v2.1(원장 "개념이 있어야 한다고 했잖아")부터 폐지 —
   개념 패널은 이제 회차 첫 장에 항상 필수(토글 UI 없음, renderRoundPages가
   무조건 렌더). getConceptPageOn은 옛 편지함 비-혼합 인쇄 경로(현재 실제
   호출부가 전부 opts.mixed를 넘겨 도달하지 않는 죽은 가지, renderPrintMulti의
   conceptPageHtml 분기)만 아직 참조해 남겨 둔다 — 기본값 켬이라 동작은
   그대로다. */
const CONCEPT_TOGGLE_KEY = 'nm_ws_concept_page';
function getConceptPageOn(){ try{ const v = localStorage.getItem(CONCEPT_TOGGLE_KEY); return v===null ? true : v==='1'; }catch(e){ return true; } }

/* ── 표지(Cover) ─────────────────────────────────────────────
   지오메트리 랩 학습지(geometry/worksheet)의 A4 표지와 같은 역할.
   학습지 v2(§2-1, 2026-09-04 원장 지시 "종이가 빈다")부터 기본값을 다시
   끔으로 되돌린다 — 회차 첫 장 자체가 이제 머리띠+개념+예시로 이미 꽉 차
   있어 별도 표지가 없어도 허전하지 않다. 켜면 기존 표지 그대로 나간다. */
const COVER_TOGGLE_KEY = 'nm_ws_cover';
function getCoverOn(){ try{ const v = localStorage.getItem(COVER_TOGGLE_KEY); return v===null ? false : v==='1'; }catch(e){ return false; } }
function setCoverOn(v){ try{ localStorage.setItem(COVER_TOGGLE_KEY, v?'1':'0'); }catch(e){} }
function coverToggleRowHtml(){
  return `<label class="nm-ex-concept-toggle">
    <input type="checkbox" id="nm-ex-cover-chk" ${getCoverOn()?'checked':''}>
    <span>📘 ${lk('표지 넣기','Add cover','加封面')}</span>
  </label>`;
}
function bindCoverToggle(container){
  const chk = container.querySelector('#nm-ex-cover-chk');
  if(chk) chk.addEventListener('change', () => setCoverOn(chk.checked));
}

/* 스레드ID 접두어 → 갈래 아이콘·이름·색(drill.html의 TOPICS 색과 맞춤).
   drill.html은 cfg.topicIcon/topicColor/topicLabel/topicSection을 직접 실어
   보내므로 이건 그게 없는 호출(메인 앱 학년별 학습지 화면, 편지함 등)만을
   위한 안전망 — 표지가 색 없이 밋밋하게 나가지 않도록. */
const THREAD_PREFIX_THEME = {
  AD:{icon:'＋',label:{ko:'덧셈',en:'Addition',zh:'加法'},color:'#3b82f6'},
  SB:{icon:'－',label:{ko:'뺄셈',en:'Subtraction',zh:'减法'},color:'#ef4444'},
  ML:{icon:'×',label:{ko:'곱셈',en:'Multiplication',zh:'乘法'},color:'#10b981'},
  DV:{icon:'÷',label:{ko:'나눗셈',en:'Division',zh:'除法'},color:'#f59e0b'},
  NS:{icon:'🧠',label:{ko:'수 감각',en:'Number Sense',zh:'数感'},color:'#8b5cf6'},
  FR:{icon:'🧠',label:{ko:'분수',en:'Fractions',zh:'分数'},color:'#8b5cf6'},
  DC:{icon:'🧠',label:{ko:'소수',en:'Decimals',zh:'小数'},color:'#8b5cf6'},
  MX:{icon:'🧠',label:{ko:'혼합',en:'Mixed Operations',zh:'混合运算'},color:'#8b5cf6'},
  CH:{icon:'🏔️',label:{ko:'경시의 탑',en:'Challenge Tower',zh:'竞赛之塔'},color:'#C9A063'},
  NL:{icon:'🌱',label:{ko:'수의 나라',en:'Number Land',zh:'数字王国'},color:'#2E9E6B'}
};
/* "○○ 학습지" 한 줄 — 언어마다 낱말 순서가 다르고, 중국어는 사이를 띄우지 않는다
   (wp.js가 본문과 물음을 붙여 쓰는 것과 같은 표기 원칙). */
function worksheetTitle(name){
  const l = examLang();
  if(l === 'en') return `${name} Worksheet`;
  if(l === 'zh') return `${name}练习卷`;
  return `${name} 학습지`;
}

function coverTheme(cfg){
  const prefix = String((cfg||{}).thread||'').replace(/[0-9].*$/,'');
  const fb = THREAD_PREFIX_THEME[prefix] || {icon:'✨',label:'Numbers of Magic',color:'#0E2C57'};
  return {
    icon:  (cfg&&cfg.topicIcon)  || fb.icon,
    /* topicLabel은 drill.html이 실어 보내는 한국어 문자열일 수 있다 — pickL이 둘 다 받는다 */
    label: pickL((cfg&&cfg.topicLabel) || fb.label),
    color: (cfg&&cfg.topicColor) || fb.color
  };
}
function coverLevelBadge(items){
  if(items.length !== 1) return lk('혼합','Mixed','混合');
  const it = items[0];
  const th = (window.NM_THREADS||{})[it.thread] || {};
  const lv = (th.levels||[]).find(l => l.id === it.level);
  return (lv && lv.label) ? (pickL(lv.label) || ('Lv.' + (it.level||1))) : ('Lv.' + (it.level||1));
}
/* items: [{thread,level,topicName?,topicIcon?,topicColor?,topicLabel?}], code: 표지 하단 코드,
   totalCount: 표지 발치에 적을 실제 문항 수(합계). */
function coverPageHtml(items, code, totalCount){
  const theme = coverTheme(items[0]);
  const names = items.map(it => pickL(it.topicName) ||
    pickL(((window.NM_THREADS||{})[it.thread]||{}).name) || it.thread);
  const more = names.length - 2;
  const title = names.length <= 2 ? names.join(' · ')
    : names.slice(0,2).join(' · ') + lk(` 외 ${more}가지`, ` and ${more} more`, ` 等${more}种`);
  return `<div class="nm-print-cover" style="--cv-accent:${esc(theme.color)}">
  <div class="nm-cv-brand"><span>GFIELD</span><strong>NUMBERS <i>of</i> MAGIC</strong></div>
  <div class="nm-cv-copy">
    <p class="nm-cv-kicker">${esc(theme.icon)} ${esc(worksheetTitle(theme.label))}</p>
    <h1 class="nm-cv-title">${esc(title)}</h1>
    <div class="nm-cv-rule"></div>
    <p class="nm-cv-sub">${lk('한 장씩 풀고 날짜를 적어 두면<br>어떤 유형이 아직 어려운지 한눈에 보여요.',
      'Do one page at a time and write the date.<br>You will see at a glance which type is still hard.',
      '一次做一页，把日期写上。<br>哪种题型还不熟练，一看就知道。')}</p>
  </div>
  <div class="nm-cv-marks" aria-hidden="true">${[1,2,4,8,16].map(n=>`<span>${n}</span>`).join('')}</div>
  <div class="nm-cv-meta">
    <div><span>${esc(lk('이름','Name','姓名'))}</span><i></i></div>
    <div><span>${esc(lk('시작한 날','Started','开始日期'))}</span><i></i></div>
    <div><span>${esc(lk('레벨','Level','级别'))}</span><b>${esc(coverLevelBadge(items))}</b></div>
  </div>
  <div class="nm-cv-footer"><span>DOCSSAM'S MATH LAB</span><b>${totalCount||''} QUESTIONS</b></div>
  <div class="nm-cv-code">${esc(code||'')}</div>
</div>`;
}

/* 학습지 머리글의 이름·날짜·점수 칸. 세 곳(단일 인쇄·혼합 인쇄·혼합 표지 다음
   첫 장)이 같은 마크업을 손으로 세 번 적고 있어서, 언어를 넣으며 하나로 묶었다.
   count가 없으면 점수 칸을 뺀다(혼합 학습지의 봉투 머리글이 그렇다). */
function printMetaFieldsHtml(count){
  const line = (label, w) => `<span>${esc(label)}: `
    + `<span style="display:inline-block;width:${w}px;border-bottom:1px solid #000">&nbsp;</span></span>`;
  return line(lk('이름','Name','姓名'), 120)
    + '\n    ' + line(lk('날짜','Date','日期'), 100)
    + (count == null ? '' : '\n    ' + `<span>${esc(lk('점수','Score','得分'))}: `
        + `<span style="display:inline-block;width:60px;border-bottom:1px solid #000">&nbsp;</span> / ${count}</span>`);
}
/* 정답지 제목 — 한국어는 예전 그대로 "정답지 / Answer Key"를 지킨다(인쇄물이 바뀌지
   않아야 한다). 영어는 겹말이 되므로 한 번만, 중국어는 그 나라 말로 적는다. */
function answerKeyTitle(){ return lk('정답지 / Answer Key', 'Answer Key', '答案'); }

/* 원형 번호 ①②③... */
function circled(n){
  if(n>=1&&n<=20) return String.fromCharCode(0x245F+n);
  if(n>=21&&n<=35) return String.fromCharCode(0x3250+n-20);
  return '('+n+')';
}

/* 인쇄용 문제·정답 그리드를 채운다 — renderPrint·renderPrintMulti·(예전엔 따로
   있던) 그리드 학습지 인쇄가 전부 이거 하나만 쓴다(2026-08-28 통합). 세로셈
   가능("34+12=□" 형태, parseVert)이면 세로 알고리즘 박스로, 문장제는 문장+빈칸,
   그 외엔 인라인 수식. 번호는 circled() 원문자로 통일.

   통합 전 두 경로의 실제 차이(재검증으로 확인, 2026-08-28):
   그리드 학습지는 세로셈을 그렸고 그 CSS는 styles.css에 있었다 — "CSS가 없었다"는
   기록은 틀렸다. drill.html이 styles.css를 안 읽어서 거기서만 안 꾸며졌던 것이다.
   진짜 차이는 renderPrint가 세로셈을 아예 몰랐다는 것(늘 인라인 수식)과 열 수(2 vs 4).
   통합 후에는 styles.css의 그 한 벌이 오히려 이름만 겹친 채 살아남아 메인 앱에서
   세로셈을 늘려 놓았으므로 제거했다(styles.css 인쇄 절 주석 참조). */
/* 모으기·가르기(수 묶음, number bond)를 쓰는 스레드.
   NS2=가르기·모으기, NS3=보수 5·10 — 둘 다 교과서가 "전체 하나 · 부분 둘" 그림으로
   가르치는 개념이다. 생성기는 화면용으로 widget:'cubes'를 주지만 인쇄는 tex만 써
   왔고, 그 tex는 `2 + □ = 4` 같은 등식이라 인쇄물이 그냥 한 자리 덧셈뺄셈과
   구별이 안 됐다(2026-08-28 원장 지적). 인쇄에서는 등식 대신 묶음 그림을 그린다.
   ※ cubes.moveTo로 판별하면 안 된다 — 덧셈·뺄셈 생성기도 그 필드를 쓴다. */
const BOND_THREADS = { NS2:1, NS3:1 };

/* 연령대 — 같은 학습지를 6세와 중학생에게 같은 크기로 뽑아 주면 안 된다는
   원장 지시(2026-08-28). 학년 정보가 있으면 그걸 쓰고(메인 앱 학년별 경로),
   없으면(문제은행 등) 수식 길이와 다루는 수의 크기로 추정한다.
   young=초1~2 · mid=초3~4 · senior=초5 이상. 글자 크기와 열 수가 달라진다. */
function printAgeBand(config, problems){
  const g = config && config.grade;
  if(g){
    if(/^[12]/.test(g)) return 'young';
    if(/^[34]/.test(g)) return 'mid';
    return 'senior';
  }
  let longest = 0, maxNum = 0;
  (problems||[]).forEach(p => {
    if(p.word){ longest = Infinity; return; }
    const t = String(p.tex||'');
    longest = Math.max(longest, t.length);
    (t.match(/\d+/g)||[]).forEach(d => { maxNum = Math.max(maxNum, +d); });
  });
  if(longest <= 26 && maxNum <= 20)   return 'young';
  if(longest <= 40 && maxNum <= 1000) return 'mid';
  return 'senior';
}

/* ── 십진블록(base10) · 수직선 점프(numline) 인쇄 도형 ─────────────
   레벨 이름이 "십진블록 읽기"·"십진블록 더하기"·"수직선 점프"인데 인쇄물엔
   `600 + 50 + 3 = □`, `61 + 9 = □` 같은 등식만 찍혀 그림이 통째로 빠져
   있었다(2026-08-28). AD3L4는 특히 AD3L2(그냥 두 자리+한 자리)와 인쇄물이
   구별되지 않았다. 생성기가 이미 base10·numline 페이로드를 주므로 그걸 그린다.
   흑백 프린터를 전제로 색 없이 선만 쓴다. */

/* 백판(10×10) · 십막대(1×10) · 낱개(1×1) — 격자선은 path 하나로 모아 그린다. */
function b10FlatSvg(){
  let d = '';
  for(let i=1;i<=9;i++) d += `M${i} 0V10M0 ${i}H10`;
  return `<svg class="nm-b10-flat" viewBox="0 0 10 10"><rect x="0" y="0" width="10" height="10"/><path d="${d}"/></svg>`;
}
function b10RodSvg(){
  let d = '';
  for(let i=1;i<=9;i++) d += `M0 ${i}H1`;
  return `<svg class="nm-b10-rod" viewBox="0 0 1 10"><rect x="0" y="0" width="1" height="10"/><path d="${d}"/></svg>`;
}
function b10OneSvg(){
  return `<svg class="nm-b10-one" viewBox="0 0 1 1"><rect x="0" y="0" width="1" height="1"/></svg>`;
}
/* 자리별로 묶어 낸다 — 백판 덩어리 · 십막대 덩어리 · 낱개 덩어리.
   묶지 않고 죽 늘어놓으면 십막대가 서로 붙어 백판처럼 보여 개수를 셀 수 없다
   (첫 시안에서 실제로 그랬다). 낱개는 5개씩 줄바꿈해 세기 쉽게 둔다. */
function b10GroupHtml(h, tens, ones){
  const den = (cls, n, svg) => {
    if(!n) return '';
    let s = '';
    for(let i=0;i<n;i++) s += svg();
    return `<span class="nm-b10-den ${cls}">${s}</span>`;
  };
  return `<span class="nm-b10-group">`
    + den('nm-b10-h', h||0, b10FlatSvg)
    + den('nm-b10-t', tens||0, b10RodSvg)
    + den('nm-b10-o', ones||0, b10OneSvg)
    + `</span>`;
}
function base10Html(b){
  if(!b) return '';
  if(b.mode === 'add'){
    return `<div class="nm-b10">${b10GroupHtml(b.a.h, b.a.tens, b.a.ones)}`
      + `<span class="nm-b10-op">+</span>${b10GroupHtml(b.b.h, b.b.tens, b.b.ones)}`
      + `<span class="nm-b10-op">=</span><span class="nm-b10-blank"></span></div>`;
  }
  return `<div class="nm-b10">${b10GroupHtml(b.h, b.tens, b.ones)}`
    + `<span class="nm-b10-op">=</span><span class="nm-b10-blank"></span></div>`;
}

/* 수직선 점프 — 마디에 눈금·수를 찍고 마디 사이를 호(arc)로 잇는다.
   빈 마디는 네모로 비워 두고, 첫 호 위에 +step을 적어 규칙을 보인다. */
function numlineSvg(nl){
  if(!nl || !Array.isArray(nl.seq) || nl.seq.length < 2) return '';
  const n = nl.seq.length;
  const L = 14, R = 246, Y = 62;
  const x = i => L + (R - L) * i / (n - 1);
  let s = `<line x1="${L-10}" y1="${Y}" x2="${R+10}" y2="${Y}"/>`;
  for(let i=0;i<n;i++){
    const xi = x(i);
    s += `<line x1="${xi}" y1="${Y-5}" x2="${xi}" y2="${Y+5}"/>`;
    if(i === nl.blank){
      s += `<rect class="nm-nl-blank" x="${xi-13}" y="${Y+10}" width="26" height="20"/>`;
    } else {
      s += `<text x="${xi}" y="${Y+22}" text-anchor="middle">${esc(String(nl.seq[i]))}</text>`;
    }
    if(i < n-1){
      const xm = (xi + x(i+1)) / 2;
      s += `<path class="nm-nl-hop" d="M${xi} ${Y-7} Q ${xm} ${Y-34} ${x(i+1)} ${Y-7}"/>`;
      if(i === 0){
        s += `<text class="nm-nl-step" x="${xm}" y="${Y-28}" text-anchor="middle">+${esc(String(nl.step))}</text>`;
      }
    }
  }
  return `<svg class="nm-nl" viewBox="0 0 260 96" role="img" aria-label="${esc(lk('수직선 점프','Number line jumps','数轴跳跃'))}">${s}</svg>`;
}

/* 전체(whole)와 아는 부분(known)으로 수 묶음 그림. 빈 동그라미가 답 자리. */
function bondSvg(whole, known){
  const t = (x, y, v) => `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central">${esc(String(v))}</text>`;
  return `<svg class="nm-bond" viewBox="0 0 160 112" role="img" aria-label="${esc(lk('수 가르기','Number bond (split)','数的分解'))} ${esc(String(whole))}">
  <circle cx="80" cy="24" r="21"/>${t(80,24,whole)}
  <line x1="66" y1="40" x2="48" y2="66"/><line x1="94" y1="40" x2="112" y2="66"/>
  <circle cx="34" cy="88" r="21"/>${t(34,88,known)}
  <circle cx="126" cy="88" r="21" class="nm-bond-blank"/>
</svg>`;
}

/* ── NL(유아 5~7세) 인쇄 시각화 (2026-08-29) ──────────────────
   engine/threads/nl.js의 16개 생성기는 다른 158개 스레드와 달리 tex를 전혀 주지
   않는다 — 화면은 widget이 그리고(town-game 실습 화면), 문제 자체는 prompt 문장
   + items/seq/rows/cells 같은 원본 데이터로만 존재한다. 그대로 두면 인쇄 카드가
   비어 나간다("화면은 위젯···" 절과 같은 부류의 결함, 여기선 위젯이 아예 하나도
   없다는 점만 다르다). prompt 문장에 답에 필요한 숫자가 이미 다 있는 것(예: 모으기
   "4개와 2개를 모으면?", 수 기계 "3을 넣어요! 규칙은 +2")은 아래 printAskText
   폴백만으로 충분해 손대지 않는다 — 그림이 실제로 있어야 풀리는 것만 그린다.
   전부 생성기가 이미 돌려주는 필드만 읽는다(nl.js는 건드리지 않았다). widget
   이름은 nl.js만 쓰므로(grep 확인됨) 다른 158개 스레드엔 영향 없다. */
const ANIMAL_GLYPH = {
  'animal:turtle':'🐢', 'animal:squirrel':'🐿️', 'animal:rabbit':'🐰',
  'animal:bear':'🐻', 'animal:fox':'🦊', 'animal:deer':'🦌', 'animal:duck':'🦆'
};
function nlGlyph(tok){ return ANIMAL_GLYPH[tok] || tok || '●'; }

/* 모으기(join) — bondSvg와 짝. bondSvg는 "전체가 이미 보임" 모양(위 원=값,
   아래 오른쪽=빈칸)이라 가르기(split)에만 맞는다. 모으기는 반대로 아래 두 원이
   보이고 위 원(전체)이 빈칸이라 별도 모양이 필요하다. */
function bondSvgTop(a, b){
  const t = (x, y, v) => `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central">${esc(String(v))}</text>`;
  return `<svg class="nm-bond" viewBox="0 0 160 112" role="img" aria-label="${esc(lk('수 모으기','Number bond (join)','数的合成'))}">
  <circle cx="80" cy="24" r="21" class="nm-bond-blank"/>
  <line x1="66" y1="40" x2="48" y2="66"/><line x1="94" y1="40" x2="112" y2="66"/>
  <circle cx="34" cy="88" r="21"/>${t(34,88,a)}
  <circle cx="126" cy="88" r="21"/>${t(126,88,b)}
</svg>`;
}
/* 섞인 장면(세기·분류) — items는 {e,t} 또는 {e,type} 어느 쪽이든 .e만 읽는다. */
function nlSceneHtml(items){
  if(!Array.isArray(items) || !items.length) return '';
  const chips = items.map(it => `<span class="nm-nl-chip">${esc(nlGlyph(it.e))}</span>`).join('');
  return `<div class="nm-nl-scene">${chips}</div>`;
}
function nlSeqStripHtml(seq, blank){
  if(!Array.isArray(seq)) return '';
  const cells = seq.map((v,i) => i===blank
    ? `<span class="nm-nl-seqbox nm-nl-seqbox-blank"></span>`
    : `<span class="nm-nl-seqbox">${esc(String(v))}</span>`).join('');
  return `<div class="nm-nl-seqstrip">${cells}</div>`;
}
/* 점 잇기 — nl.js의 좌표는 이미 0~100 뷰박스 기준(오리지널 도형, 라이선스 없음).
   번호를 그대로 찍어 인쇄해도 "점이 모두 몇 개?"(생성기의 실제 답)가 바로 풀린다. */
function nlDotsSvg(pts){
  if(!Array.isArray(pts) || !pts.length) return '';
  const dots = pts.map(([x,y],i) =>
    `<circle cx="${x}" cy="${y}" r="2.6"/><text x="${x}" y="${y-4}" text-anchor="middle" font-size="6">${i+1}</text>`
  ).join('');
  return `<svg class="nm-nl-dots" viewBox="0 0 100 100" role="img" aria-label="${esc(lk('점 잇기','Connect the dots','连点成图'))}">${dots}</svg>`;
}
function nlPyramidHtml(rows){
  if(!Array.isArray(rows)) return '';
  const rowsHtml = rows.map(row => {
    const cells = row.map(v => v===null
      ? `<span class="nm-nl-pyr-cell nm-nl-pyr-blank"></span>`
      : `<span class="nm-nl-pyr-cell">${esc(String(v))}</span>`).join('');
    return `<div class="nm-nl-pyr-row">${cells}</div>`;
  }).join('');
  return `<div class="nm-nl-pyramid">${rowsHtml}</div>`;
}
/* 몇째 찾기(gridPaint 'single'·storyCard 'lineup') — 생성기의 targetIndex가
   0부터 세는 배열 인덱스라(왼쪽에서 몇째든 오른쪽에서 몇째든), 칸 번호도 그대로
   0부터 매겨야 "그 칸 밑에 적힌 번호"가 곧 정답이 된다. */
function nlOrderStripHtml(total){
  if(!total) return '';
  let s = '';
  for(let i=0;i<total;i++) s += `<span class="nm-nl-box">${i}</span>`;
  return `<div class="nm-nl-strip">${s}</div>`;
}
/* 계단(storyCard 'stairs') — 정답 k는 "아래에서부터 센 계단 번호"(1부터)라
   칸 번호도 아래부터 1로 매긴다. mark(0-based)가 있는 칸에 친구 아이콘을 얹는다. */
function nlStairsHtml(total, mark, tok){
  if(!total) return '';
  let s = '';
  for(let i=total-1;i>=0;i--){
    s += `<div class="nm-nl-stair">${i+1}${i===mark ? `<span class="nm-nl-stair-mark">${esc(nlGlyph(tok))}</span>` : ''}</div>`;
  }
  return `<div class="nm-nl-stairs">${s}</div>`;
}
/* 양팔저울 — 정답이 0(왼쪽)/1(오른쪽) 인덱스라 접시 밑에 그 번호를 그대로 적어
   범례 문장 없이도 답 형식이 그림만 보고 분명해지게 한다. */
function nlScaleHtml(left, right, emoji){
  const side = (n, idx) => {
    let g=''; for(let i=0;i<n;i++) g += esc(nlGlyph(emoji));
    return `<div class="nm-nl-pan"><div class="nm-nl-pan-items">${g}</div><div class="nm-nl-pan-idx">${idx}</div></div>`;
  };
  return `<div class="nm-nl-scale">${side(left,0)}${side(right,1)}</div>`;
}
function nlMachineHtml(examples, target){
  if(!Array.isArray(examples)) return '';
  const parts = examples.map(ex => `${ex[0]} → ${ex[1]}`);
  parts.push(`${target} → ?`);
  return `<div class="nm-nl-machine">${esc(parts.join('    '))}</div>`;
}
function nlCrossHtml(cells){
  const c = k => (cells[k]===null || cells[k]===undefined) ? '' : esc(String(cells[k]));
  return `<div class="nm-nl-cross">
    <div class="nm-nl-cross-top">${c('top')}</div>
    <div class="nm-nl-cross-mid"><span>${c('left')}</span><span>${c('right')}</span></div>
    <div class="nm-nl-cross-bot">${c('bottom')}</div>
  </div>`;
}
/* 탤리(산가지) 읽기 — 5개씩 4작대기+대각선 하나로 묶어 그린다(전통 tally 표기). */
function nlTallySvg(n){
  const groups = []; let rem = Math.max(0, n|0);
  while(rem > 0){ const g = Math.min(5, rem); groups.push(g); rem -= g; }
  let x = 2, s = '';
  groups.forEach(g => {
    const strokes = Math.min(g, 4);
    for(let i=0;i<strokes;i++){ s += `<line x1="${x}" y1="2" x2="${x}" y2="16"/>`; x += 4; }
    if(g===5){ s += `<line x1="${x-16}" y1="16" x2="${x-2}" y2="2"/>`; }
    x += 5;
  });
  if(!groups.length) x = 6;
  return `<svg class="nm-nl-tally" viewBox="0 0 ${x+2} 18" role="img" aria-label="${esc(lk('탤리','Tally marks','正字计数'))} ${esc(String(n))}">${s}</svg>`;
}

/* widget별 분기 — nl.js가 실제로 채우는 필드만 읽는다(값 검산·형 확인 없이
   생성기 계약을 그대로 신뢰). 값이 없으면 빈 문자열을 돌려 폴백(ask 텍스트만)한다. */
function nlVisualHtml(p){
  const w = p.widget;
  if(w==='numberBond'){
    if(p.dir==='join' && typeof p.a==='number' && typeof p.b==='number') return bondSvgTop(p.a, p.b);
    if(typeof p.whole==='number' && typeof p.a==='number') return bondSvg(p.whole, p.a);
    return '';
  }
  if(w==='tapCount' && Array.isArray(p.items)) return nlSceneHtml(p.items);
  if(w==='seqFill' && Array.isArray(p.seq)) return nlSeqStripHtml(p.seq, p.blank);
  if(w==='dotToDot' && Array.isArray(p.pts)) return nlDotsSvg(p.pts);
  if(w==='pyramid' && Array.isArray(p.rows)) return nlPyramidHtml(p.rows);
  if(w==='gridPaint' && p.gridMode==='single') return nlOrderStripHtml(p.total);
  if(w==='storyCard' && p.layout==='row' && p.interaction==='tap') return nlOrderStripHtml(p.total);
  if(w==='storyCard' && p.layout==='stairs') return nlStairsHtml(p.total, p.mark, p.emoji);
  if(w==='balanceScale') return nlScaleHtml(p.left, p.right, p.emoji);
  if(w==='numberMachine' && p.mmode==='guess') return nlMachineHtml(p.examples, p.target);
  if(w==='crossSum' && p.cells) return nlCrossHtml(p.cells);
  if(w==='sortBasket' && Array.isArray(p.items)){
    let html = nlSceneHtml(p.items);
    /* 비교(compare) 모드는 정답이 0/1 인덱스라 어느 바구니가 0인지 범례가 필요 —
       count 모드는 askKo가 이미 "무엇을 세라"고 말해 주므로 범례 없이도 충분. */
    if(html && p.askMode==='compare' && p.basketA && p.basketB){
      html += `<div class="nm-nl-legend">${esc(nlGlyph(p.basketA.emoji))}=0 · ${esc(nlGlyph(p.basketB.emoji))}=1</div>`;
    }
    return html;
  }
  if(w==='tallyBuild' && p.interaction==='read' && typeof p.target==='number') return nlTallySvg(p.target);
  return '';
}

/* 인쇄는 tex만 쓰고 prompt는 버린다 — 대부분은 `3 + 1 = □`처럼 tex만으로 문항이
   성립하니 그게 맞다(프롬프트를 다 실으면 "3 더하기 1은 얼마일까요?"가 문항마다
   붙어 지저분해진다). 그런데 질문이 프롬프트에만 있는 유형이 있다:
     DV6 배수판별법  tex="21□"        — 몇의 배수인지가 프롬프트에만 있어 풀 수 없음
     EL3 크기 비교   tex="13-3 ○ 9+11" — ○에 부등호를 넣으란 건지 값을 쓰란 건지 불명
   판별: 빈칸 기호(□·○)가 있는데 관계식 기호가 하나도 없으면 그것만으로는 물음이
   성립하지 않는다. 이때만 프롬프트를 질문 줄로 싣는다. 분수 계산식처럼 빈칸이 없는
   것은 제외된다 — 그쪽 프롬프트는 통분 방법·LCM을 알려 주는 힌트라 실으면 답이 샌다. */
/* 맨 식(관계식도 빈칸도 없는 식)인데 단계 풀이를 갖는 문항 — 인쇄에서 단계를 실어야 한다.
   예: FR4L1 `2/3 + 4/5`는 정답이 "통분한 뒤의 분자"(22)뿐이라, 인쇄물엔 분모가
   어디에도 없어 학생이 22/15를 쓸 수가 없었다. 더 나쁜 것은 FR3L2·FR4L2로,
   정답키가 마지막 단계인 "정수 부분"만이라 `2 1/6 - 1 2/6`의 정답지가 0이었다
   (실제 답은 5/6). 화면은 단계마다 물어보니 성립하는데 인쇄가 그 구조를 버린 탓이다.
   그래서 인쇄도 화면과 같이 단계를 묻는다 — 정답지는 단계별 답을 순서대로 싣는다. */
/* ⚠️ 문장제(p.word)는 여기서 늘 null이 돌아간다 — 아래 fillPrintGrid의 word 분기가
   본문·물음·보기·식 틀을 통째로 그리므로 레이아웃 주인이 하나여야 하기 때문이다.
   그래서 **문장제가 steps에 식을 실으면 인쇄물에서 조용히 사라진다.** 문장제의 식은
   반드시 `p.wordEqn`으로 넘길 것(WP4가 그렇게 한다). */
function printSteps(p){
  const tex = String(p.tex||'');
  if(/\\square|\\bigcirc/.test(tex)) return null;
  if(/=|\\equiv|\\Rightarrow/.test(tex)) return null;
  const st = Array.isArray(p.steps) ? p.steps.filter(s => s && s.tex) : [];
  return st.length ? st : null;
}

function printAskText(p){
  /* 문장제(p.word)는 아래 word 분기가 본문·물음·보기를 통째로 그린다. 여기서
     prompt를 또 실으면 같은 문장이 카드에 두 번 찍힌다 — WP 스레드를 붙이며
     실제로 그렇게 나왔다(2026-08-29). */
  if(p.word) return '';
  const tex = String(p.tex||'');
  /* tex가 아예 없는 유형 — nl.js(수의 나라, 유아) 16개 생성기가 이 경우다. 다른
     158개 스레드는 전부 tex를 주므로(가장 짧아도 "3+2=□") 이 분기를 타지 않는다.
     문항 전체가 prompt 문장에만 있으므로 그걸 그대로 질문 줄로 싣는다. */
  if(!tex) return pickL(p.prompt);
  if(!/\\square|\\bigcirc/.test(tex)) return '';
  if(/=|\\equiv|\\Rightarrow|<|>|\\ge|\\le/.test(tex)) return '';
  return pickL(p.prompt);
}

/* 보기(선택지) — 문장제만 쓴다. 답이 보기 번호이므로 번호가 인쇄물에 있어야
   학생이 답을 쓸 수 있다(답 환원 원칙: 답은 정수 또는 보기 번호). */
function wordChoices(p){
  const choices = pickChoices(p);
  if(!choices) return null;
  const ul = document.createElement('ul');
  ul.className = 'nm-print-choices';
  choices.forEach((c, i) => {
    const li = document.createElement('li');
    li.textContent = `${i+1}) ${c}`;
    ul.appendChild(li);
  });
  return ul;
}

function fillPrintGrid(problems, problemGrid, answerGrid, opts){
  opts = opts || {};
  /* numStart — 여러 페이지에 걸쳐 이어 붙일 때(로드맵 세션 20문항/페이지) 번호가
     페이지마다 1로 리셋되면 안 된다. 기본 0(기존 호출부는 그대로 1부터). */
  const numStart = opts.numStart || 0;
  /* 열 수는 내용이 정한다. 통합 전에는 그리드 학습지가 4열, 드릴 인쇄가 2열로 서로
     달랐는데, 한쪽으로 고정하면 어느 한쪽이 반드시 망가진다 — 2열로 고정하면 50문항
     연산지가 두 배로 두꺼워지고, 4열로 고정하면 고등 긴 수식이 칸을 넘친다.
     그래서 문장제가 하나라도 있거나 수식이 길면 2열, 짧은 연산뿐이면 4열로 간다.
     로드맵 세션 인쇄(nm-print-grid-20/-10)는 열 수를 스스로 고정하므로 이 자동
     판정을 건너뛴다(skipGridClass). */
  if(!opts.skipGridClass){
    const longest = problems.reduce((m, p) =>
      /* 십진블록·수직선·NL 그림(prompt-only, 늘 tex 없음)은 넓어서 좁은 칸에 못
         들어간다 — 문장제와 같이 취급 */
      Math.max(m, (p.word || p.base10 || p.numline || !p.tex) ? Infinity : String(p.tex||'').length), 0);
    problemGrid.classList.add('nm-print-grid');
    problemGrid.classList.toggle('nm-print-grid-dense', longest <= 26);
  } else {
    problemGrid.classList.add('nm-print-grid');
  }

  const bond = !!opts.bond;

  problems.forEach((p, i) => {
    /* 수 묶음: 전체는 cubes.moveTo, 빈칸은 정답, 아는 부분은 그 나머지.
       opts.bond는 단일 스레드 호출(renderPrint 등)이 쓰는 호출 단위 플래그이고,
       p.__bond는 여러 스레드가 한 페이지에 섞이는 혼합 인쇄(renderMixedSheet)가
       문제 하나하나에 미리 표시해 둔 값이다 — 스레드별로 다를 수 있어 콜 단위
       플래그 하나로는 표현이 안 된다. */
    const bw = (bond || p.__bond) && p.cubes && typeof p.cubes.moveTo === 'number'
      && typeof p.answer === 'number' ? p.cubes.moveTo : null;
    /* nl.js(수의 나라)는 tex를 아예 안 주므로 tex가 없을 때만 계산한다 — 다른
       158개 스레드는 항상 tex가 있어 이 분기를 타지 않는다(위 nlVisualHtml 설명 참조). */
    const nlHtml = (bw === null && !p.tex) ? nlVisualHtml(p) : '';
    const v = (p.word || bw !== null || nlHtml) ? null : parseVert(p.tex);
    const card = document.createElement('div');
    card.className = 'nm-print-item'
      + (v ? ' nm-print-item-vp' : '')
      + (bw !== null ? ' nm-print-item-bond' : '')
      /* 문장제 칸 — 장 경계에서 갈라지지 않게 한다(위 CSS). `word`를 내는 생성기는
         문장제(wp.js)뿐이라 이 표시는 다른 스레드에 붙지 않는다. */
      + (p.word ? ' nm-print-item-word' : '')
      + ((p.base10 || p.numline || nlHtml) ? ' nm-print-item-vis' : '');
    const numEl = document.createElement('span');
    numEl.className = 'nm-q-num';
    numEl.textContent = circled(numStart+i+1);
    card.appendChild(numEl);

    const ask = printAskText(p);
    if(ask){
      const askEl = document.createElement('div');
      askEl.className = 'nm-print-ask';
      askEl.textContent = ask;
      card.appendChild(askEl);
    }

    if(bw !== null){
      const holder = document.createElement('div');
      holder.innerHTML = bondSvg(bw, bw - p.answer);
      card.appendChild(holder.firstChild);
    } else if(p.base10 || p.numline){
      const holder = document.createElement('div');
      holder.innerHTML = p.base10 ? base10Html(p.base10) : numlineSvg(p.numline);
      if(holder.firstChild) card.appendChild(holder.firstChild);
      else { const t = document.createElement('div'); t.className='nm-q-tex';
             renderKaTeX(p.tex||'', t); card.appendChild(t); }
    } else if(nlHtml){
      const holder = document.createElement('div');
      holder.innerHTML = nlHtml;
      while(holder.firstChild) card.appendChild(holder.firstChild);
    } else if(p.word){
      const texEl = document.createElement('div');
      texEl.className = 'nm-print-word';
      texEl.textContent = pickL(p.word);
      card.appendChild(texEl);
      /* 물음이 본문과 따로 있는 문장제(WP 스레드) — 본문만 찍으면 무엇을 묻는지
         알 수 없다. 인쇄물만 보고 풀 수 있어야 한다는 원칙 그대로. */
      if(p.wordAsk){
        const askEl = document.createElement('div');
        askEl.className = 'nm-print-wordask';
        askEl.textContent = pickL(p.wordAsk);
        card.appendChild(askEl);
      }
      const ch = wordChoices(p);
      if(ch) card.appendChild(ch);
      /* 답이 '식'인 문장제(WP4)는 답 줄 대신 식 틀을 그린다 — 학생이 채우는 자리가
         곧 식이라, 그 아래 "답: ____"을 또 그리면 어디에 쓰라는 건지 흐려진다.
         식은 기호뿐이라 세 언어가 같다(pickL이 문자열도 그대로 돌려준다). */
      if(p.wordEqn){
        card.classList.add('nm-print-item-eq');   /* 장 경계에서 갈라지지 않게(위 CSS) */
        const eq = document.createElement('div');
        eq.className = 'nm-print-word-eq';
        eq.textContent = pickL(p.wordEqn);
        card.appendChild(eq);
      } else {
        const blank = document.createElement('div');
        blank.className = 'nm-print-word-blank';
        blank.textContent = lk('답', 'Answer', '答') + ': __________';
        card.appendChild(blank);
      }
    } else if(v){
      const vp = document.createElement('div');
      vp.className = 'nm-print-vp';
      vp.innerHTML = `<div class="nm-print-vp-top">${esc(v.a)}</div>
<div class="nm-print-vp-mid"><span class="nm-print-vp-op">${esc(v.op)}</span><span>${esc(v.b)}</span></div>
<div class="nm-print-vp-line"></div>
<div class="nm-print-vp-bot">&nbsp;</div>`;
      card.appendChild(vp);
    } else {
      const texEl = document.createElement('div');
      texEl.className = 'nm-q-tex';
      renderKaTeX(p.tex || '', texEl);
      card.appendChild(texEl);
    }

    /* 단계 풀이를 묻는 문항은 단계 줄을 함께 인쇄한다(위 printSteps 설명 참조) */
    const steps = printSteps(p);
    if(steps){
      const box = document.createElement('div');
      box.className = 'nm-print-steps';
      steps.forEach(s => {
        const row = document.createElement('div');
        row.className = 'nm-print-step';
        renderKaTeX(s.tex || '', row);
        box.appendChild(row);
      });
      card.appendChild(box);
    }
    problemGrid.appendChild(card);

    const ak = document.createElement('div');
    ak.className = 'nm-ak-item';
    ak.appendChild(document.createTextNode(`${circled(numStart+i+1)} `));
    if(steps){
      /* 단계별 답을 순서대로 — 인쇄물이 단계를 묻고 있으므로 정답지도 그래야 한다 */
      ak.appendChild(document.createTextNode(steps.map(s => fmtAns(s.blank)).join(' , ')));
    } else {
      const akTex = ansTex(p);
      if(akTex){
        const akSpan = document.createElement('span');
        renderKaTeX(akTex, akSpan);
        ak.appendChild(akSpan);
      } else {
        /* 보기형 문장제는 번호만 찍으면 채점하는 사람이 그 번호가 무엇인지 모른다 */
        const note = pickL(p.answerNote);
        ak.appendChild(document.createTextNode(
          String(fmtAns(p.answer)) + (note ? ` (${note})` : '')));
      }
    }
    answerGrid.appendChild(ak);
  });
}

/* 세로셈 파싱: "a OP b = \square" 형태 */
function parseVert(tex){
  const m = (tex||'').match(/^([\d.]+)\s*([+\-×÷]|\\times|\\div)\s*([\d.]+)\s*=\s*\\square\s*$/);
  if(!m) return null;
  const opMap={'\\times':'×','\\div':'÷','-':'−'};
  return {a:m[1], op:opMap[m[2]]||m[2], b:m[3]};
}

/* ── 문장제(Word Problem) 변환 ─────────────────────────
   단순 사칙 "a OP b = □" 문제를 교과서식 문장제로 감싼다.
   시드 rng로 이름·소재를 뽑아 인쇄 재현성 유지. */
/* 이름·사물은 언어마다 그 언어에서 자연스러운 것을 따로 쓴다 —
   engine/threads/wp.js NAMES/OBJECTS와 같은 관례(이름 짝도 그대로). */
const WP_NAMES=[
  {ko:'민수',en:'Emma',pr:'She',zh:'小明'},{ko:'지우',en:'Liam',pr:'He',zh:'小红'},
  {ko:'서연',en:'Olivia',pr:'She',zh:'小刚'},{ko:'하준',en:'Noah',pr:'He',zh:'小美'},
  {ko:'다은',en:'Mia',pr:'She',zh:'小强'},{ko:'시우',en:'Lucas',pr:'He',zh:'小丽'},
  {ko:'유나',en:'Ava',pr:'She',zh:'小龙'},{ko:'도윤',en:'Ethan',pr:'He',zh:'小雨'},
  {ko:'예준',en:'Sophie',pr:'She',zh:'小云'},{ko:'소율',en:'Ben',pr:'He',zh:'小杰'}];
/* ko=[명사,수량사] · en=[단수,복수] · zh=[명사,양사] */
const WP_ITEMS=[
  {ko:['사과','개'],en:['apple','apples'],zh:['苹果','个']},
  {ko:['구슬','개'],en:['marble','marbles'],zh:['珠子','颗']},
  {ko:['색종이','장'],en:['sheet of colored paper','sheets of colored paper'],zh:['彩纸','张']},
  {ko:['스티커','장'],en:['sticker','stickers'],zh:['贴纸','张']},
  {ko:['사탕','개'],en:['candy','candies'],zh:['糖果','颗']},
  {ko:['동화책','권'],en:['storybook','storybooks'],zh:['故事书','本']},
  {ko:['연필','자루'],en:['pencil','pencils'],zh:['铅笔','支']},
  {ko:['쿠키','개'],en:['cookie','cookies'],zh:['饼干','块']},
  {ko:['캐릭터 카드','장'],en:['character card','character cards'],zh:['角色卡片','张']},
  {ko:['블록','개'],en:['block','blocks'],zh:['积木','块']}];
/* n개의 사물 — 단복수 일치 */
function enCount(n,pair){ return n+' '+(n===1?pair[0]:pair[1]); }
function kJosa(word, withBatchim, without){
  const code = word.charCodeAt(word.length-1);
  if(code<0xAC00||code>0xD7A3) return word+without;
  return ((code-0xAC00)%28>0) ? word+withBatchim : word+without;
}
function wordifyProblem(p, rng){
  const v = parseVert(p.tex||'');
  if(!v) return null;
  if(v.a.indexOf('.')>=0 || v.b.indexOf('.')>=0) return null; /* 소수는 숫자식 유지 */
  const a=+v.a, b=+v.b;
  if(!isFinite(a)||!isFinite(b)||a>100000||b>100000) return null;
  const who = WP_NAMES[(rng()*WP_NAMES.length)|0];
  const pick = WP_ITEMS[(rng()*WP_ITEMS.length)|0];
  const item=pick.ko[0], unit=pick.ko[1];
  const enPair=pick.en, enMany=pick.en[1], zhN=pick.zh[0], zhU=pick.zh[1];
  const nameJ = kJosa(who.ko,'이는','는');
  const itemJ = kJosa(item,'을','를');
  const bUnitJ = b+kJosa(unit,'을','를');
  /* 세 언어를 한 번에 만든다 — 이름·사물은 같은 index라 언어를 바꿔도 같은 상황. */
  switch(v.op){
    case '+':
      return {
        ko:`${nameJ} ${itemJ} ${a}${unit} 가지고 있어요. ${bUnitJ} 더 받으면 모두 몇 ${unit}일까요?`,
        en:`${who.en} has ${enCount(a,enPair)}. ${who.pr} gets ${b} more. How many ${enMany} are there in all?`,
        zh:`${who.zh}有${a}${zhU}${zhN}。再得到${b}${zhU}，一共有多少${zhU}？`};
    case '−': case '-':
      if(a<b) return null;
      return {
        ko:`${nameJ} ${itemJ} ${a}${unit} 가지고 있었는데 ${bUnitJ} 친구에게 주었어요. 남은 ${kJosa(item,'은','는')} 몇 ${unit}일까요?`,
        en:`${who.en} had ${enCount(a,enPair)} and gave ${b} to a friend. How many ${enMany} are left?`,
        zh:`${who.zh}原来有${a}${zhU}${zhN}，送给朋友${b}${zhU}。还剩多少${zhU}？`};
    case '×':
      return {
        ko:`${item} 한 묶음에 ${a}${unit}씩 들어 있어요. ${b}묶음에는 ${kJosa(item,'이','가')} 모두 몇 ${unit} 있을까요?`,
        en:`Each pack holds ${enCount(a,enPair)}. How many ${enMany} are in ${b} ${b===1?'pack':'packs'}?`,
        zh:`每包有${a}${zhU}${zhN}。${b}包一共有多少${zhU}？`};
    case '÷':
      if(b===0 || b===1 || a%b!==0) return null; /* 나머지 있거나 ÷1이면 문장제 제외(상황이 안 만들어짐) */
      return {
        ko:`${nameJ} ${itemJ} ${a}${unit} 가지고 있어요. ${b}명이 똑같이 나누어 가지면 한 명이 몇 ${unit}씩 가질까요?`,
        en:`${who.en} has ${enCount(a,enPair)}. If ${b} children share them equally, how many does each child get?`,
        zh:`${who.zh}有${a}${zhU}${zhN}。${b}个小朋友平分，每人分到多少${zhU}？`};
  }
  return null;
}
/* wordType: 'none' | 'mix'(약 1/3) | 'all' */
function applyWordProblems(problems, wordType, numericSeed){
  if(!wordType || wordType==='none') return problems;
  const rng = NM_RNG.mulberry32(((numericSeed>>>0) ^ 0x5f3759df)>>>0);
  problems.forEach((p,i)=>{
    if(wordType==='mix' && i%3!==1) return;
    const w = wordifyProblem(p, rng);
    /* wordifyProblem이 ko·en·zh 세 벌을 함께 만든다(2026-09-01 한영 확장) —
       pickL이 화면 언어에 맞는 벌을 고른다. WP 스레드는 원래부터 3언어. */
    if(w) p.word = w;
  });
  return problems;
}

/* ═══════════════════════════════════════════════════════════════
   ── 학습지 v2 · 유형별 회차 ──  (2026-09-04, 원장 지시)
   학습지-v2-설계.md §2 구현. 세션(과정 N · S k)의 드릴 하나 = 회차 하나.
   [첫 장] 머리띠 | 개념 패널 | ★예시(빨강, 과정) | ■ 지시문 | 문항 (1)~
   [둘째 장~] 머리띠 | 문항 이어서(연속 번호)
   박스 없음, A4 고정 높이 페이지(flex column) + grid-auto-rows:1fr로
   문항이 적어도 줄 간격이 균등하게 늘어난다 — 페이지 넘침이 나지 않는다.
   ═══════════════════════════════════════════════════════════════ */

/* 회차 안 문항 전체를 보고 레이아웃을 한 번만 정한다(문항마다 바뀌지 않음).
   §2-5 표 그대로: 세로셈→4×5(가로) · 짧은식→2×10(세로, column-major) ·
   중간식→2×8(세로) · 긴식→1×8 · 문장제→1×6 · 그림형→2×4(가로).
   flow:'col'은 CSS grid-auto-flow:column으로 열 우선 번호(1~10 왼쪽·11~20
   오른쪽)를 만든다 — DOM 순서를 바꿀 필요가 없다(브라우저가 배치한다). */
/* tex의 "눈에 보이는" 길이 — LaTeX 명령을 실제로 찍히는 기호로 바꿔서 잰다.
   \frac{a}{b}처럼 명령 자체는 4글자가 아니라 "a/b" 3글자로 읽힌다. 이걸
   문자 그대로(raw tex.length)로 재면 분수·거듭제곱 문항이 실제보다 훨씬
   길어 보여 다 "긴 식"으로 밀려나 버린다(2026-09-04 재작업 지시). */
function texVisibleLength(tex){
  let s = String(tex||'');
  for(let i=0;i<3;i++){
    s = s.replace(/\\d?frac\{([^{}]*)\}\{([^{}]*)\}/g, '$1/$2');
  }
  s = s.replace(/\\sqrt\{([^{}]*)\}/g, '√$1');
  s = s.replace(/\\times|\\div|\\cdot|\\pm/g, '×');
  s = s.replace(/\\square/g, '□');
  s = s.replace(/\\left|\\right/g, '');
  s = s.replace(/\\[,;]/g, '');
  s = s.replace(/\\text\{([^{}]*)\}/g, '$1');
  s = s.replace(/[{}]/g, '');
  return s.length;
}

/* 수식 안 한글은 KaTeX 수식 모드에서 낱글자로 흩어져 사이 공백이 사라진다
   ("105에서 십의 자리"가 "105에서십의자리"로 붙어 버림, 2026-09-04 발견).
   이미 \text{}로 감싼 부분은 건드리지 않고, 감싸지 않은 한글 덩어리(중간
   공백 포함)만 \text{}로 새로 감싼다. */
function wrapHangul(tex){
  const t = String(tex||'');
  return t.replace(/\\text\{[^}]*\}|([가-힣][가-힣\s]*[가-힣]|[가-힣])/g,
    (m, g) => g ? '\\text{' + g + '}' : m);
}

/* 분수·근호·거듭제곱은 인라인이면 콩알만 해진다 — KaTeX \displaystyle로
   키운다(2026-09-04 재작업 지시). 한글 보정도 여기서 항상 같이 한다(호출부
   전부—문항 tex·단계·예시—가 이 함수 하나만 거치면 되게). */
function texDisplay(tex){
  const t = wrapHangul(tex);
  return /\\frac|\\sqrt|\^|_/.test(t) ? '\\displaystyle ' + t : t;
}

function classifyRoundLayout(problems, threadId){
  if(!problems || !problems.length) return {type:'short', cols:2, rows:10, perPage:20, flow:'col'};
  const nonWord = problems.filter(p => !p.word);
  if(!nonWord.length) return {type:'word', cols:1, rows:6, perPage:6, flow:'row'};
  const withTex = nonWord.filter(p => p.tex);
  if(nonWord.length === problems.length && !withTex.length){
    return {type:'visual', cols:2, rows:4, perPage:8, flow:'row'};
  }
  /* 세로셈 판정은 회차 전체를 보고 "한 번만" — 칸마다 다시 parseVert를 걸면
     우연히 둘 다 양수인 문항(예: MD4가 부호 없는 5×2를 낼 때)만 세로 박스로
     튀어 다른 칸과 형식이 갈린다(2026-09-04 버그). 조건: 전부 세로셈
     가능 + 피연산자에 음수가 하나도 없음(부호/혼합/검산 계열 스레드는
     음수·괄호가 그림 자체라 세로 박스가 안 맞는다) + 스레드가
     MD/CH/EL/MX(부호·경시·검산·혼합)로 시작하지 않음. */
  const hasNegativeOperand = p => /-\s*[\d(]/.test(String(p.tex||''));
  const excludedPrefix = /^(MD|CH|EL|MX)/.test(threadId||'');
  if(withTex.length && !excludedPrefix
     && withTex.every(p => parseVert(p.tex) && !hasNegativeOperand(p))){
    return {type:'vertical', cols:4, rows:5, perPage:20, flow:'row'};
  }
  if(nonWord.length < problems.length){
    /* 섞인 경우(문장제 일부 + 숫자식 일부, wordType='mix') — 문장제가 있으면
       칸을 넓게 줘야 하므로 "긴 식"과 같은 1열로 간다. */
    return {type:'long', cols:1, rows:8, perPage:8, flow:'row'};
  }
  /* §2-5 판정은 "보이는" 길이로만 한다 — steps 단계 수로 강제로 "긴 식"으로
     미는 규칙은 폐기(2026-09-04, MD4·MD21·FR1이 전부 잘못 판정되던 원인). */
  let maxLen = 0;
  withTex.forEach(p => { maxLen = Math.max(maxLen, texVisibleLength(p.tex)); });
  if(maxLen <= 16) return {type:'short', cols:2, rows:10, perPage:20, flow:'col'};
  if(maxLen <= 44) return {type:'medium', cols:2, rows:8, perPage:16, flow:'col'};
  return {type:'long', cols:1, rows:8, perPage:8, flow:'row'};
}

/* 난이도 정렬 §2-6: 피연산자 자릿수 합 → |answer| → tex 길이. 문장제·그림형은
   원래 순서 그대로(정렬하지 않는다). */
function sortRoundProblems(problems, type){
  if(type === 'word' || type === 'visual') return problems;
  function score(p){
    const nums = String(p.tex||'').match(/\d+(\.\d+)?/g) || [];
    const digitSum = nums.reduce((s,n) => s + n.replace('.','').length, 0);
    const absAns = Array.isArray(p.answer)
      ? p.answer.reduce((s,v) => s + Math.abs(+v||0), 0)
      : Math.abs(+p.answer || 0);
    return [digitSum, absAns, String(p.tex||'').length];
  }
  /* 램프 문항(__ramp)은 뒤에 모아 둔다 — 쉬운→어려운 정렬은 그룹 안에서만 */
  return problems
    .map((p,i) => ({p, i, r: p.__ramp ? 1 : 0, s: score(p)}))
    .sort((a,b) => a.r-b.r || a.s[0]-b.s[0] || a.s[1]-b.s[1] || a.s[2]-b.s[2] || a.i-b.i)
    .map(x => x.p);
}

/* 문항 한 칸 — 박스 없음. 기존 렌더러(bondSvg·base10Html·numlineSvg·
   nlVisualHtml·wordChoices·printAskText·printSteps)를 그대로 재사용한다.
   check-print.js가 찾는 클래스(.nm-print-item·.nm-print-ask·.nm-print-steps·
   .nm-bond·.nm-b10·.nm-nl·.nm-print-word-blank·.nm-print-word-eq·.nm-print-vp)를
   그대로 달아 두고, 박스 자체는 CSS에서 `.nm-w2-item.nm-print-item`으로
   덮어써 없앤다(선택자 검사기를 새로 손대지 않기 위함). */
function w2CellHtml(p, num, threadId, isVerticalRound, isFirstRamp){
  let cls = 'nm-w2-item nm-print-item';
  let inner;
  const ask = printAskText(p);
  const askHtml = ask ? `<div class="nm-print-ask">${esc(ask)}</div>` : '';
  if(p.__bond && p.cubes && typeof p.cubes.moveTo === 'number' && typeof p.answer === 'number'){
    cls += ' nm-w2-item-vis';
    inner = bondSvg(p.cubes.moveTo, p.cubes.moveTo - p.answer);
  } else if(p.base10 || p.numline){
    cls += ' nm-w2-item-vis';
    inner = p.base10 ? base10Html(p.base10) : numlineSvg(p.numline);
  } else if(!p.tex && !p.word){
    cls += ' nm-w2-item-vis';
    inner = nlVisualHtml(p) || '';
  } else if(p.word){
    cls += ' nm-w2-item-word';
    const wc = wordChoices(p);
    inner = `<div class="nm-print-word">${esc(pickL(p.word))}</div>`
      + (p.wordAsk ? `<div class="nm-print-wordask">${esc(pickL(p.wordAsk))}</div>` : '')
      + (wc ? wc.outerHTML : '')
      + (p.wordEqn
          ? `<div class="nm-print-word-eq">${esc(pickL(p.wordEqn))}</div>`
          : `<div class="nm-print-word-blank">${esc(lk('답','Answer','答'))}: __________</div>`);
  } else {
    /* 세로셈 마크업은 회차 전체가 vertical로 판정됐을 때만 — 칸마다
       parseVert를 다시 걸면 우연히 부호 없는 문항 하나만 다른 칸과 형식이
       갈린다(2026-09-04 버그, classifyRoundLayout 주석 참조). 그 외
       레이아웃에서는 tex를 있는 그대로 인라인으로 찍는다. */
    const v = isVerticalRound ? parseVert(p.tex) : null;
    if(v){
      cls += ' nm-w2-item-vp';
      inner = `<div class="nm-print-vp">
  <div class="nm-print-vp-top">${esc(v.a)}</div>
  <div class="nm-print-vp-mid"><span class="nm-print-vp-op">${esc(v.op)}</span><span>${esc(v.b)}</span></div>
  <div class="nm-print-vp-line"></div>
  <div class="nm-print-vp-bot">&nbsp;</div>
</div>`;
    } else {
      const raw = String(p.tex||'');
      /* 끝이 "= \square"면 \square만 지우고 "=" 뒤 여백으로 둔다. \square가
         식 안(계수 빈칸·분자 빈칸)에 있으면 그게 곧 채울 자리라 그대로 둔다
         (2026-09-04 재작업 지시 §2). */
      const texStr = raw.replace(/=\s*\\square\s*$/,'=');
      /* 답 쓰는 작은 네모 칸은 NL(수의 나라, 유아) 스레드에만 — 나이 추정
         (printAgeBand)으로 켜면 MD 같은 중고등 스레드도 숫자가 작다는 이유로
         "young"으로 잘못 판정돼 박스가 붙는다(2026-09-04 버그, MD4/C30). */
      const abox = /^NL/i.test(threadId||'') ? '<span class="nm-w2-abox"></span>' : '';
      inner = `<span class="nm-w2-tex" data-tex="${esc(texDisplay(texStr))}"></span>${abox}`;
    }
  }
  const steps = printSteps(p);
  const stepsHtml = steps
    ? `<div class="nm-print-steps">${steps.map(s =>
        `<div class="nm-print-step"><span class="nm-w2-tex" data-tex="${esc(texDisplay(s.tex||''))}"></span></div>`).join('')}</div>`
    : '';
  const rampPill = isFirstRamp ? `<span class="nm-w2-ramp-pill">${esc(lk('도전','Challenge','挑战'))}</span>` : '';
  /* data-slot — buildProblems가 매긴 원래(정렬 전) 자리(§overrides). 실제 인쇄에는
     아무 영향 없는 순수 데이터 속성이고, 인쇄 미리보기 편집기가 이 칸을 다시
     지정할 때만 읽는다. */
  const slotAttr = (p.__slot != null) ? ` data-slot="${esc(String(p.__slot))}"` : '';
  return `<div class="${cls}"${slotAttr}><span class="nm-w2-num">(${num})</span>${rampPill}${askHtml}${inner}${stepsHtml}</div>`;
}

/* 정답지 항목 — 문항 번호와 같은 "(n)" 표기(§6 "정답지 번호가 문항 번호와 일치"). */
function w2AnswerKeyItemsHtml(problems){
  return problems.map((p,i) => {
    const steps = printSteps(p);
    if(steps){
      return `<div class="nm-ak-item">(${i+1}) ${esc(steps.map(s => fmtAns(s.blank)).join(' , '))}</div>`;
    }
    const akTex = ansTex(p);
    if(akTex){
      return `<div class="nm-ak-item">(${i+1}) <span class="nm-w2-tex" data-tex="${esc(akTex)}"></span></div>`;
    }
    const note = pickL(p.answerNote);
    return `<div class="nm-ak-item">(${i+1}) ${esc(String(fmtAns(p.answer)) + (note ? ` (${note})` : ''))}</div>`;
  }).join('');
}

/* 개념 패널의 단계 요약 줄용 — desc는 자체 저작 HTML(<b> 등)을 담고 있어서
   (conceptBlockHtml과 같은 데이터), 한 줄 요약에는 태그를 벗겨 순수 텍스트로
   합친다. 90자 넘으면 잘라 "…"만 붙인다(§2-3 "~90자로 줄여"). */
function stripConceptTags(s){ return String(s||'').replace(/<[^>]+>/g,''); }
function truncateConceptLine(s, max){
  const t = String(s||'').trim();
  return t.length > max ? t.slice(0, max - 1).trimEnd() + '…' : t;
}
const CONCEPT_STAGE_MARKS = ['①','②'];
/* 개념 패널(§2-3, v2.1 세분화) — 첫 장 필수(토글 없음). concept 문장 다음에
   관련 유닛이 있으면 그 discover.stages 앞 1~2단계를 한 줄씩(제목+본문 요약,
   90자 트림, ①②) 얹고, 그 다음 "마법의 규칙" 한 줄, 마지막에 램프 안내.
   stages 전체를 붓지 않는다(conceptBlockHtml처럼 단 단위 노트로 되돌아가지
   않기 위함) — 옛 conceptBlockHtml의 "앞 1~2단계만" 추출을 그대로 따르되
   한 단계 = 한 줄로 더 압축한다. */
function w2ConceptPanelHtml(threadId, level, extra){
  extra = extra || {};
  const info = resolveConceptUnit(threadId, level);
  if(!info) return '';
  const nm = pickL(info.thread.name) || threadId;
  const sentence = info.thread.concept ? pickL(info.thread.concept) : '';
  const stages = (info.unit && info.unit.discover && Array.isArray(info.unit.discover.stages))
    ? info.unit.discover.stages.slice(0, 2) : [];
  const stageLines = stages.map((s, i) => {
    const headRaw = pickL(s.head) || '';
    /* head가 수식(백슬래시 포함, 예: M-21 나눗셈 조립제법)이면 main.js
       stepDiscover와 같은 규칙으로 KaTeX로 — 그냥 esc()하면 "\div"가 날것
       그대로 찍힌다(2026-09-05 발견, C36 개념 패널). */
    const headHtml = !headRaw ? ''
      : /\\/.test(headRaw) ? `<span class="nm-w2-tex" data-tex="${esc(texDisplay(headRaw))}"></span>`
      : `<b>${esc(headRaw)}</b>`;
    const descTrunc = truncateConceptLine(stripConceptTags(pickL(s.desc) || ''), 90);
    if(!headRaw && !descTrunc) return '';
    return `<p class="nm-w2-concept-stage">${esc(CONCEPT_STAGE_MARKS[i])} ${headHtml}${headRaw && descTrunc ? ' — ' : ''}${esc(descTrunc)}</p>`;
  }).join('');
  const rule = (info.unit && info.unit.discover && info.unit.discover.rule)
    ? pickL(info.unit.discover.rule) : '';
  if(!sentence && !stageLines && !rule) return '';
  return `<div class="nm-w2-concept">
  <div class="nm-w2-concept-badge">${esc(lk('개념','Concept','概念'))} · ${esc(nm)}</div>
  ${sentence ? `<p class="nm-w2-concept-sentence">${esc(sentence)}</p>` : ''}
  ${stageLines}
  ${rule ? `<p class="nm-w2-concept-rule"><b>${esc(lk('마법의 규칙','The Magic Rule','魔法规则'))}:</b> ${esc(rule)}</p>` : ''}
  ${extra.rampN ? `<p class="nm-w2-concept-ramp">${esc(lk(`뒤 ${extra.rampN}문항은 한 단계 어려운 문제예요 — 예시처럼 풀어 보세요.`,`The last ${extra.rampN} are one step harder — solve them like the example.`,`最后${extra.rampN}题难度高一级——照例题的方法做。`))}</p>` : ''}
</div>`;
}

/* 문항 tex의 \square를 답으로 채워 넣어 "완성된 식"을 만든다 — 채운 자리만
   \color{#d33}{…}로 빨갛게 감싼다(2026-09-04 재작업 지시 §3).
     · \square가 없으면 " = 색값"을 그대로 덧붙인다(예: 세로셈 아닌 맨 답 문항).
     · 배열 답이고 \square 개수가 답 개수와 같으면(계수 빈칸 등) 순서대로 대입.
     · 단일 답이고 \square가 하나면 그 자리에 대입.
     · 그 외(개수가 안 맞는 예외)엔 마지막 \square만 채우고 나머지는 그대로 둔다
       — 깨진 표시보다는 절반만 맞는 표시가 낫다. */
function texSubstituteAnswer(tex, answer){
  /* 반환값은 아직 "tex 문자열"이다 — HTML 이스케이프는 호출부가 data-tex
     속성에 넣을 때 한 번만 한다(여기서 하면 이중 이스케이프가 된다). */
  const raw = String(tex||'');
  const squareCount = (raw.match(/\\square/g) || []).length;
  if(!squareCount) return raw + ' = \\color{#d33}{' + String(fmtAns(answer)) + '}';
  if(Array.isArray(answer) && answer.length === squareCount){
    let i = 0;
    return raw.replace(/\\square/g, () => '\\color{#d33}{' + String(answer[i++]) + '}');
  }
  if(!Array.isArray(answer) && squareCount === 1){
    return raw.replace(/\\square/g, '\\color{#d33}{' + String(answer) + '}');
  }
  let seen = 0;
  return raw.replace(/\\square/g, () =>
    (++seen === squareCount) ? ('\\color{#d33}{' + String(fmtAns(answer)) + '}') : '\\square');
}

/* "+ \color{#d33}{-11}" 같은 이중 부호 정리 — 대입한 값이 음수면 앞의 +/-를
   뒤집어 "− \color{#d33}{11}"로 만든다(2026-09-04, C36 "+ −63" 버그).
   \color{}{} 안쪽 값만 보고 부호를 판정하므로 다른 곳의 +/-는 안 건드린다. */
function fixNegSigns(tex){
  let s = String(tex||'');
  s = s.replace(/\+\s*\\color\{#d33\}\{(-\d+(?:\.\d+)?)\}/g,
    (_, n) => '-\\color{#d33}{' + n.slice(1) + '}');
  s = s.replace(/-\s*\\color\{#d33\}\{(-\d+(?:\.\d+)?)\}/g,
    (_, n) => '+\\color{#d33}{' + n.slice(1) + '}');
  return s;
}

/* ★예시 문항(§2-4) — 시드 고정(hashSeed('ex'+code))으로 생성기를 한 번 돌려
   검은 식 + 빨간 풀이를 보여준다. 우선순위: ①모으기·가르기(BOND_THREADS)는
   격자 칸과 같은 그림 ②steps 있으면 "완성된 식"(전체 대입, 빨강) 아래에
   단계별 대입을 이어서 ③세로셈이면 세로 배치+빨간 답 ④그 외엔 "완성된 식"
   한 줄 — steps가 없을 때만 개념 문장 중 숫자가 든 첫 문장을 덧붙인다. */
function w2ExampleHtml(threadId, level, code){
  const rng = NM_RNG.mulberry32(NM_RNG.hashSeed('ex' + code));
  const p = generateProblem(threadId, level, rng);
  /* steps(드릴 위젯용) 또는 solution(예시 전용 풀이 — 중·고등 생성기가 2026-09-04부터 제공,
     위젯·인쇄 채점에는 쓰이지 않는다) 둘 중 있는 것을 풀이 줄로 쓴다. */
  const stepSrc = (Array.isArray(p.steps) && p.steps.length) ? p.steps : (Array.isArray(p.solution) ? p.solution : null);
  const hasSteps = !!(stepSrc && stepSrc.length);
  let bodyHtml;
  /* 그림 문항(모으기·가르기 등 BOND_THREADS)은 격자 칸과 같은 그림으로 보여준다 —
     여기서 parseVert로 먼저 걸러지면 격자와 다른(세로셈) 모양이 나가 버린다. */
  if(BOND_THREADS[threadId] && p.cubes && typeof p.cubes.moveTo === 'number' && typeof p.answer === 'number'){
    bodyHtml = bondSvg(p.cubes.moveTo, p.cubes.moveTo - p.answer)
      + `<div class="nm-w2-ex-ans">= ${esc(String(p.answer))}</div>`;
  } else if(hasSteps){
    const completedTex = fixNegSigns(texSubstituteAnswer(p.tex, p.answer));
    const completedHtml = `<div class="nm-w2-ex-line"><span class="nm-w2-tex" data-tex="${esc(texDisplay(completedTex))}"></span></div>`;
    const stepParts = stepSrc.map(s => {
      /* blank가 없는 줄은 그대로(변형만 보여주는 줄), 배열 blank는 \square 개수만큼 차례로 채운다 */
      const t = ('blank' in s) ? fixNegSigns(texSubstituteAnswer(String(s.tex||''), s.blank)) : String(s.tex||'');
      return `<span class="nm-w2-tex" data-tex="${esc(texDisplay(t))}"></span>`;
    });
    bodyHtml = completedHtml
      + `<div class="nm-w2-ex-steps">${stepParts.join('<span class="nm-w2-ex-arrow">→</span>')}</div>`;
  } else {
    const v = !p.word && parseVert(p.tex);
    if(v){
      bodyHtml = `<div class="nm-w2-ex-vp">
  <div>${esc(v.a)}</div>
  <div><span>${esc(v.op)}</span><span>${esc(v.b)}</span></div>
  <div class="nm-w2-ex-vp-line"></div>
  <div class="nm-w2-ex-vp-ans">${esc(String(fmtAns(p.answer)))}</div>
</div>`;
    } else {
      const completedTex = fixNegSigns(texSubstituteAnswer(p.tex, p.answer));
      bodyHtml = `<div class="nm-w2-ex-line"><span class="nm-w2-tex" data-tex="${esc(texDisplay(completedTex))}"></span></div>`;
    }
    /* steps가 없을 때만 — concept "예)" 문장은 이미 있는 단계별 대입을
       대신할 필요가 없으니 그때만 덧붙인다(2026-09-04 재작업 지시). */
    const th = (window.NM_THREADS||{})[threadId] || {};
    const sentence = th.concept ? pickL(th.concept) : '';
    const digitSentence = sentence.split(/(?:[.!?](?=\s|$))|\n/).map(s=>s.trim()).find(s => /\d/.test(s));
    if(digitSentence) bodyHtml += `<div class="nm-w2-ex-note">${esc(digitSentence)}</div>`;
  }
  return `<div class="nm-w2-example">
  <span class="nm-w2-ex-badge">${esc(lk('예시','Example','示例'))}</span>
  ${bodyHtml}
</div>`;
}

/* 따라 풀기(§4 guided items, v2.1) — ★예시 바로 다음, 문항 (1) 앞. 회차의
   N문항과 무관한 3문제를 시드 고정(hashSeed('guide'+code+i), 문항마다 새
   rng — 회차 rng는 안 건드린다)으로 만든다. 과정(steps/solution)이 있으면
   \square를 채우지 않고 그대로 남겨(검정) "빈칸 글리프"로 두고, 없으면
   식만 "= ____"로 보여준다. 정답은 과정 없이 최종 답만 정답지 맨 앞에
   (가)(나)(다)로 싣는다(w2GuidedAnswerKeyHtml). */
const GUIDE_LABELS = { ko:['가','나','다'], en:['a','b','c'], zh:['甲','乙','丙'] };
function guideLabels(){ return GUIDE_LABELS[examLang()] || GUIDE_LABELS.ko; }
function w2GuidedHtml(threadId, level, code, guideSeedOverride){
  const labs = guideLabels();
  const problems = [];
  const seedBase = guideSeedOverride || ('guide' + code);
  const itemsHtml = [0, 1, 2].map(i => {
    const rng = NM_RNG.mulberry32(NM_RNG.hashSeed(seedBase + i));
    const p = generateProblem(threadId, level, rng);
    problems.push(p);
    const stepSrc = (Array.isArray(p.steps) && p.steps.length) ? p.steps : (Array.isArray(p.solution) ? p.solution : null);
    const raw = String(p.tex || '');
    const qTex = raw.replace(/=\s*\\square\s*$/, '=');
    const qHtml = `<span class="nm-w2-tex" data-tex="${esc(texDisplay(qTex))}"></span>`;
    const chainHtml = (stepSrc && stepSrc.length)
      ? stepSrc.map(s => `<span class="nm-w2-tex" data-tex="${esc(texDisplay(String(s.tex || '')))}"></span>`)
          .join('<span class="nm-w2-guide-arrow">→</span>')
      : `<span class="nm-w2-guide-blank">= ____</span>`;
    return `<div class="nm-w2-guide-item">
  <div class="nm-w2-guide-q"><span class="nm-w2-guide-label">(${esc(labs[i])})</span>${qHtml}</div>
  <div class="nm-w2-guide-chain">${chainHtml}</div>
</div>`;
  }).join('');
  return {
    html: `<div class="nm-w2-guide">
  <div class="nm-w2-guide-title">■ ${esc(lk('따라 풀어 보세요.','Try it the same way.','照着做一做。'))}</div>
  ${itemsHtml}
</div>`,
    problems
  };
}
/* 따라 풀기 정답지 항목 — 과정 없이 최종 답만, (가)(나)(다) 라벨(w2AnswerKeyItemsHtml의
   숫자 (n) 대신). 문항 번호((1)…)보다 먼저 나온다(§4 "add them to the answer key"). */
function w2GuidedAnswerKeyHtml(problems){
  if(!problems || !problems.length) return '';
  const labs = guideLabels();
  /* 클래스는 일부러 .nm-ak-item이 아니라 .nm-ak-guide-item — scripts/check-print.js가
     `.nm-ak-item` 개수를 문항 수(COUNT)와 정확히 맞춰 비교한다(회귀 검사). 따라풀기
     3개는 회차 N문항과 별개(§4)라 그 카운트에 안 들어가야 같은 검사가 계속 통과한다.
     스타일은 아래 CSS에서 .nm-ak-item과 동일하게 맞춘다. */
  return problems.map((p, i) => {
    const akTex = ansTex(p);
    if(akTex){
      return `<div class="nm-ak-guide-item">(${esc(labs[i])}) <span class="nm-w2-tex" data-tex="${esc(akTex)}"></span></div>`;
    }
    const note = pickL(p.answerNote);
    return `<div class="nm-ak-guide-item">(${esc(labs[i])}) ${esc(String(fmtAns(p.answer)) + (note ? ` (${note})` : ''))}</div>`;
  }).join('');
}

/* 머리띠(§2-2) — 좌:학원명 · 중:색띠(유형 이름+부제) · 우:코드+페이지 번호.
   맨 위 작은 줄에 이름/날짜/점수. */
function w2HeadHtml(item, code, pageLabel, count){
  const th = (window.NM_THREADS||{})[item.thread] || {};
  const thName = pickL(item.topicName) || pickL(th.name) || item.thread;
  let brand = 'GFIELD';
  try{ brand = localStorage.getItem('nm_brand_name') || 'GFIELD'; }catch(e){}
  const theme = coverTheme(item);
  return `<div class="nm-w2-head" style="--w2-accent:${esc(theme.color)}">
  <div class="nm-w2-head-top">${printMetaFieldsHtml(count)}</div>
  <div class="nm-w2-head-row">
    <span class="nm-w2-head-brand">${esc(brand)}</span>
    <span class="nm-w2-head-mid"><b>${esc(theme.icon)} ${esc(thName)}</b>${item.subLabel ? `<span>${esc(item.subLabel)}</span>` : ''}</span>
    <span class="nm-w2-head-code">${esc(code)} · ${esc(pageLabel)}</span>
  </div>
</div>`;
}

/* 회차 한 벌(§2-1) — item:{thread,level,wordType?,seed,topicName?}, opts:{count,conceptOn}.
   반환: {html(페이지들 이어붙인 문자열), problems(정렬된 순서, 정답지가 이 순서를
   그대로 쓴다), code, thName}. */
function renderRoundPages(item, opts){
  opts = opts || {};
  const count = opts.count || 20;
  const numericSeed = NM_RNG.hashSeed(item.seed);
  let problems = buildProblems(item.thread, item.level, count, numericSeed, item.overrides);
  applyWordProblems(problems, item.wordType, numericSeed);
  if(BOND_THREADS[item.thread]) problems.forEach(p => { p.__bond = true; });
  /* baseCode(문항 덮어쓰기 반영 전)는 ★예시·따라풀기(기본 시드)의 씨앗으로만 쓴다 —
     한 문항을 편집기에서 바꿔도 code가 바뀌어 예시·따라풀기까지 같이 바뀌면
     "그 문항만 바뀐다"는 편집기의 전제가 깨진다(2026-09-05). 실제 회차 코드
     (헤더·정답지·?ws= 되돌리기용)는 overrides/guideSeed까지 실은 code다. */
  const baseCode = NM_EXAM.worksheetCode({thread:item.thread, level:item.level, count, seed:item.seed});
  const code = NM_EXAM.worksheetCode({thread:item.thread, level:item.level, count, seed:item.seed,
    overrides:item.overrides, guideSeed:item.guideSeed});
  const layout = classifyRoundLayout(problems, item.thread);
  problems = sortRoundProblems(problems, layout.type);

  /* 첫 장 축소 용량(v2.1 §build 5) — 첫 장은 이제 개념·예시·따라풀기까지
     지고 있어 전체 perPage를 다 못 받는다. "행"을 절반(올림)으로 줄인
     만큼만 받는다 — 열 수는 그대로라 판정별 예시(세로셈 4×5→4×3(12),
     짧은식 2×10→2×5(10), 중간식 2×8→2×4(8), 긴식 1×8→1×4(4),
     문장제 1×6→1×3(3), 그림형 2×4→2×2(4))가 전부 이 식으로 나온다.
     둘째 장부터는 layout.perPage 그대로(원래 용량). */
  const firstRows = Math.max(1, Math.ceil(layout.rows / 2));
  const firstCap = firstRows * layout.cols;
  const pages = [];
  if(problems.length){
    pages.push(problems.slice(0, firstCap));
    for(let i = firstCap; i < problems.length; i += layout.perPage) pages.push(problems.slice(i, i + layout.perPage));
  } else {
    pages.push([]);
  }
  const totalPages = pages.length;

  function gridStyleFor(rowsCount){
    return layout.flow === 'col'
      ? `grid-template-columns:repeat(${layout.cols},1fr);grid-template-rows:repeat(${rowsCount},1fr);grid-auto-flow:column;`
      : `grid-template-columns:repeat(${layout.cols},1fr);`;
  }

  /* 램프가 있으면 예시는 한 단계 위 레벨로 — 개념 문장이 설명하는 기술(받아내림 등)을
     예시가 실제로 보여 주도록. */
  const rampN = problems.filter(p => p.__ramp).length;
  const exLevel = rampN ? (rampLevelFor(item.thread, item.level) || item.level) : item.level;
  /* 개념·예시·따라풀기는 첫 장 필수(토글 없음, v2.1 build 1). */
  const conceptHtml = w2ConceptPanelHtml(item.thread, item.level, {rampN});
  const exampleHtml = w2ExampleHtml(item.thread, exLevel, baseCode);
  const guided = w2GuidedHtml(item.thread, item.level, baseCode, item.guideSeed);

  let num = 1;
  let rampTagged = false; // 도전 알약은 회차 전체에서 첫 램프 문항 하나에만(§build 6)
  const html = pages.map((pageItems, pi) => {
    const first = pi === 0;
    const rowsCount = first ? firstRows : layout.rows;
    const instrHtml = first
      ? `<div class="nm-w2-instr">■ ${esc(layout.type === 'word'
          ? lk('다음 물음에 답하시오.','Answer each question.','请回答下列各题。')
          : lk('계산을 하시오.','Solve each problem.','请计算下列各题。'))}</div>`
      : '';
    const cellsHtml = pageItems.map(p => {
      const isFirstRamp = !!p.__ramp && !rampTagged;
      if(isFirstRamp) rampTagged = true;
      const h = w2CellHtml(p, num, item.thread, layout.type === 'vertical', isFirstRamp); num++; return h;
    }).join('');
    return `<div class="nm-w2-page">
  ${w2HeadHtml(item, code, `${pi+1}/${totalPages}`, count)}
  ${first ? conceptHtml : ''}${first ? exampleHtml : ''}${first ? guided.html : ''}${instrHtml}
  <div class="nm-w2-grid nm-w2-grid-${layout.type}" style="${gridStyleFor(rowsCount)}">${cellsHtml}</div>
  <div class="nm-w2-foot">${esc(code)}</div>
</div>`;
  }).join('');

  const thName = pickL(item.topicName) || pickL(((window.NM_THREADS||{})[item.thread]||{}).name) || item.thread;
  return { html, problems, code, thName, guidedProblems: guided.problems };
}

/* ── 로드맵 세션 학습지: 20문항/페이지 혼합 인쇄 (원장 지시 2026-09-04) ──
   세션의 드릴(예: n:6/n:4)을 한 장짜리 학습지로 합친다. 각 드릴의 문항 수는
   원래 n(가중치)에 비례해 목표 총량(roadCountMode: 10/20/40)에 맞춰 다시
   나눈다 — "최대잉여법"(largest remainder method): 몫만큼 먼저 배정하고
   남는 문항을 나머지가 큰 순서로 하나씩 더 준다. 그러면 합이 정확히
   total이 되면서도 원래 가중치 비율에 가장 가깝다. */

/* weights: 드릴별 가중치(보통 세션의 n) 배열. total: 목표 총 문항 수.
   반환: weights와 같은 길이의 정수 배열(합계 = min(total, ...) 참조).
   - total >= weights.length: 모든 드릴이 최소 1문항은 받는다(원장 지시
     "every drill gets ≥ 1"). 최대잉여법으로 남는 만큼 배분.
   - total < weights.length(드릴이 목표 총량보다 많은 극단): 앞에서부터
     1문항씩만 준다 — 지어낼 수 없는 경우라 있는 그대로 자른다. */
function proportionalSplit(weights, total){
  const n = weights.length;
  if(n === 0) return [];
  total = Math.max(0, Math.round(total));
  if(total <= n){
    return weights.map((_, i) => i < total ? 1 : 0);
  }
  const sumW = weights.reduce((a, b) => a + (b > 0 ? b : 0), 0) || n;
  const raw = weights.map(w => total * ((w > 0 ? w : 1) / sumW));
  const base = raw.map(r => Math.floor(r));
  let assigned = base.reduce((a, b) => a + b, 0);
  let remainder = total - assigned;
  if(remainder > 0){
    const order = raw.map((r, i) => ({ i, frac: r - Math.floor(r) }))
      .sort((a, b) => b.frac - a.frac || a.i - b.i);
    for(let k = 0; k < remainder; k++) base[order[k % n].i]++;
  }
  /* 최소 1문항 보장 — 가중치가 아주 작은 드릴은 최대잉여법으로도 0을 받을 수
     있다. 가장 많이 받은 드릴에서 1씩 옮겨 채운다(합계는 그대로 total). */
  for(let i = 0; i < n; i++){
    if(base[i] > 0) continue;
    let maxIdx = 0;
    for(let k = 1; k < n; k++) if(base[k] > base[maxIdx]) maxIdx = k;
    if(base[maxIdx] > 1){ base[maxIdx]--; base[i] = 1; }
    else base[i] = 1; /* 더 옮길 여유가 없으면(모두 1) 그대로 둔다 — total을 넘겨도
                          drills.length가 total을 넘는 극단 케이스뿐이라 위 total<=n
                          분기가 이미 처리한다. */
  }
  return base;
}

/* 세션(또는 편지함 봉투)의 드릴 목록을 목표 총 문항 수로 나눠 문제를 만든다.
   items: [{thread, level, wordType?, seed, n?|count?|weight?}] — 순서 그대로
   유지(드릴A 문항이 먼저, 그다음 드릴B …). 반환 built[i] = {item, count, problems, code}
   와 이어붙인 flat(전체 문제 배열, 드릴 순서·문항 순서 그대로). */
function buildMixedProblemSet(items, total){
  const weights = items.map(it => {
    const w = (it.n != null) ? it.n : (it.count != null) ? it.count : (it.weight != null) ? it.weight : 1;
    return (typeof w === 'number' && w > 0) ? w : 1;
  });
  const counts = proportionalSplit(weights, total);
  const built = items.map((it, idx) => {
    const count = counts[idx];
    if(count <= 0) return { item: it, count: 0, problems: [], code: null };
    const numericSeed = NM_RNG.hashSeed(it.seed);
    const problems = buildProblems(it.thread, it.level, count, numericSeed);
    applyWordProblems(problems, it.wordType, numericSeed);
    if(BOND_THREADS[it.thread]) problems.forEach(p => { p.__bond = true; });
    const code = NM_EXAM.worksheetCode({ thread: it.thread, level: it.level, count, seed: it.seed });
    return { item: it, count, problems, code };
  });
  const flat = [];
  built.forEach(b => flat.push.apply(flat, b.problems));
  return { built, flat };
}

/* 페이지당 문항 수 — 문장제만(roadWordType==='all')은 칸이 넓어야 하므로 10
   (2열×5행), 그 외(연산만·섞기)는 20(4열×5행). 섞기 모드의 문장제 문항은
   grid-column:span 2로 두 칸을 쓴다(CSS, .nm-print-grid-20 .nm-print-item-word). */
function pageCapacityFor(items){
  const allWords = !!(items && items.length) && items.every(it => it.wordType === 'all');
  return allWords ? 10 : 20;
}

/* 혼합 학습지(로드맵 세션 · 편지함 봉투 동일 경로) 렌더러 — 학습지 v2.
   items: [{thread,level,wordType?,seed,topicName?}, ...] 드릴 목록, 순서 그대로
   드릴별 회차를 이어 붙인다(§2 "세션 인쇄 = 드릴 순서대로 회차를 이어 붙인 것").
   opts.mixed: 유형당 문항 수(10/20/40 — 이제 세션 총량이 아니라 드릴 하나하나의
   문항 수다, §2-1). 예전의 최대잉여법 비례 배분(proportionalSplit/
   buildMixedProblemSet)은 이 경로에서 더는 쓰지 않는다 — 함수 자체는 다른
   호출부(있다면)를 위해 그대로 둔다. */
function renderMixedSheet(items, envelopeCode, opts){
  const perTypeCount = opts.mixed || 20;

  const rounds = items.map(it => renderRoundPages(it, { count: perTypeCount }));
  const allProblems = [];
  rounds.forEach(r => allProblems.push.apply(allProblems, r.problems));

  const sheet = document.createElement('div');
  sheet.className = 'nm-print-sheet nm-print-age-' + printAgeBand(items[0], allProblems);
  sheet.setAttribute('aria-hidden', 'true');
  sheet.setAttribute('lang', examLang());

  const coverHtml = getCoverOn() ? coverPageHtml(items, envelopeCode, allProblems.length) : '';
  /* 드릴별 학습지 코드 — ?ws= 도우미가 그대로 이해하는 형식 그대로 나열한다. */
  const codesLine = rounds.map(r => r.code).join(', ');
  const roundsHtml = rounds.map(r => r.html).join('');

  const akSections = rounds.map(r => `
<div class="nm-ak-section">
  <h4 class="nm-ak-subhead">${esc(r.thName)} <span class="nm-ak-subcode">${esc(r.code)}</span></h4>
  <div class="nm-ak-grid">${w2GuidedAnswerKeyHtml(r.guidedProblems)}${w2AnswerKeyItemsHtml(r.problems)}</div>
</div>`).join('');

  sheet.innerHTML = `
${printWatermarkHtml()}
${coverHtml}
${roundsHtml}
<div class="nm-print-answer-key">
  <h3 style="margin:0 0 8px 0">${esc(answerKeyTitle())} — <span style="font-family:monospace;font-size:0.85em">${esc(envelopeCode || '')}</span></h3>
  <div class="nm-print-mix-note">${esc(codesLine)}</div>
  ${akSections}
</div>`;

  document.body.appendChild(sheet);
  sheet.querySelectorAll('.nm-w2-tex, .nm-cp-tex').forEach(el => renderKaTeX(el.dataset.tex || '', el));

  if(!window.NM_NO_AUTOPRINT) setTimeout(() => { window.print(); }, 350);
}

/* 스레드 레벨 params 가져오기 */
function getLevelParams(threadId, lv){
  const th = (window.NM_THREADS || {})[threadId];
  if(!th) return {};
  const lvObj = (th.levels || []).find(l => l.id === lv);
  return lvObj ? lvObj.params : {};
}

/* 생성기 호출: NM_TGEN[genKey](params, rng) → problem */
function generateProblem(threadId, lv, rng){
  const th = (window.NM_THREADS || {})[threadId];
  if(!th){ return {tex:`[${threadId} ?]`, answer:0, prompt:{ko:'',en:'',zh:''}}; }
  const genKey = th.gen;
  const params = getLevelParams(threadId, lv);
  const gen = (window.NM_TGEN || {})[genKey];
  if(gen){ return gen(params, rng); }
  const a = Math.floor(rng()*90)+10, b = Math.floor(rng()*9)+1;
  return { tex:`${a} + ${b} = \\square`, answer:a+b, prompt:{ko:`${a}+${b}=?`,en:`${a}+${b}=?`,zh:`${a}+${b}=?`} };
}

/* 문제 배열 생성 (시드 재현 가능) */
/* ── 회차 안 난이도 램프(2026-09-05, 원장 "개념은 받아내림인데 연습문제엔 하나도 없다") ──
   스레드의 다음 레벨이 '같은 연산의 한 단계 위'(params 키가 같고 mode/level 키가
   없음 — SB4 borrow:false→true, AD5 carries:1→2, ML8 easy:true→false)이면 회차의
   뒤 30%를 그 레벨에서 뽑는다. 다음 레벨이 다른 연산(MD4 mul2→div2)이면 안 한다.
   8문항 미만(드릴 미니세트·편지함 4문항)은 램프 없음. 같은 rng 흐름에서 이어 뽑으므로
   코드(시드)만으로 인쇄물·정답지·?ws= 도우미가 같은 문항을 다시 만든다. */
function rampLevelFor(threadId, lv){
  const th = window.NM_THREADS && NM_THREADS[threadId];
  if(!th || !Array.isArray(th.levels)) return null;
  const base = th.levels.find(l => l.id === lv), next = th.levels.find(l => l.id === lv + 1);
  if(!base || !next) return null;
  const bk = Object.keys(base.params || {}).sort(), nk = Object.keys(next.params || {}).sort();
  if(!bk.length || bk.join() !== nk.join()) return null;
  if(bk.some(k => k === 'mode' || k === 'level' || k === 'digits')) return null;
  return next.id;
}
function rampCount(threadId, lv, count){
  return (count >= 8 && rampLevelFor(threadId, lv)) ? Math.round(count * 0.3) : 0;
}
/* overrides(§인쇄 미리보기 편집기, 2026-09-05) — {slotIndex: seedString}. slotIndex는
   이 함수가 만드는 순서 그대로(정렬 전, 0-base) — renderRoundPages가 나중에
   sortRoundProblems로 순서를 바꾸므로, 화면에 보이는 위치와 다를 수 있다. 그래서
   각 문항에 원래 자리를 __slot으로 남겨 둔다(정렬을 거쳐도 값은 그대로 딸려간다) —
   편집기가 렌더된 칸의 data-slot을 읽어 그 자리를 다시 지정할 수 있게. 덮어쓴
   문항은 그 자리가 원래 base였는지 ramp(램프 30%)였는지 그대로 유지한다(레벨이
   갑자기 바뀌어 보이지 않도록). */
function buildProblems(threadId, lv, count, seed, overrides){
  const rng = NM_RNG.mulberry32(seed);
  const problems = [];
  const nRamp = rampCount(threadId, lv, count);
  const rampLv = nRamp ? rampLevelFor(threadId, lv) : null;
  for(let i=0;i<count;i++){
    const useRamp = nRamp && i >= count - nRamp;
    const p = generateProblem(threadId, useRamp ? rampLv : lv, rng);
    if(useRamp) p.__ramp = true;
    p.__slot = i;
    problems.push(p);
  }
  if(overrides){
    Object.keys(overrides).forEach(key => {
      const idx = parseInt(key, 10);
      const seedStr = overrides[key];
      if(!(idx >= 0 && idx < problems.length) || !seedStr) return;
      const wasRamp = !!problems[idx].__ramp;
      const orng = NM_RNG.mulberry32(NM_RNG.hashSeed(String(seedStr) + '#' + idx));
      const np = generateProblem(threadId, wasRamp ? rampLv : lv, orng);
      if(wasRamp) np.__ramp = true;
      np.__slot = idx;
      problems[idx] = np;
    });
  }
  return problems;
}

/* 학습지 코드 → 설정 파싱. 기본형 뒤에 `~` 구간이 붙을 수 있다(인쇄 미리보기
   편집기, 2026-09-05) — `~3.k9f2`(슬롯 3번 문항을 시드 k9f2로 다시 만듦),
   `~g.zz12`(따라 풀기 3문항을 시드 zz12로 다시 만듦). 순서·개수 상관없음. */
function parseWorksheetCode(code){
  const parts = String(code||'').split('~');
  const m = parts[0].match(/^#?([A-Z0-9]+)-L(\d+)x(\d+)-([a-z0-9]+)$/i);
  if(!m) return null;
  const result = { thread:m[1], level:parseInt(m[2]), count:parseInt(m[3]), seed:m[4] };
  const overrides = {};
  let guideSeed = null;
  for(let i=1;i<parts.length;i++){
    const seg = parts[i];
    const gm = seg.match(/^g\.([a-z0-9]+)$/i);
    if(gm){ guideSeed = gm[1]; continue; }
    const om = seg.match(/^(\d+)\.([a-z0-9]+)$/i);
    if(om) overrides[parseInt(om[1],10)] = om[2];
  }
  if(Object.keys(overrides).length) result.overrides = overrides;
  if(guideSeed) result.guideSeed = guideSeed;
  return result;
}

/* ────────────────────────────────────────────────────────
   공개 API
   ──────────────────────────────────────────────────────── */
const NM_EXAM = {

  /* LaTeX→평문 치환(KaTeX 미로딩 폴백). drill.html 등 다른 스코프도 이걸 재사용한다. */
  texToPlain,
  /* answerShape 정답 → \dfrac tex(테스트/검증용 노출). */
  ansTex,

  /* 학습지 코드 생성 */
  worksheetCode(config){
    const { thread, level, count, seed, overrides, guideSeed } = config;
    let code = `#${thread}-L${level}x${count}-${seed}`;
    if(overrides){
      Object.keys(overrides).map(k => parseInt(k,10)).filter(k => Number.isInteger(k) && overrides[k])
        .sort((a,b) => a-b)
        .forEach(k => { code += `~${k}.${overrides[k]}`; });
    }
    if(guideSeed) code += `~g.${guideSeed}`;
    return code;
  },

  /* 학습지 코드 → 설정 파싱 (main.js의 ?ws= 도우미 화면이 사용). 실패 시 null. */
  parseWorksheetCode,

  /* 학습지 ID(코드) → 개념 화면 QR URL. main.js도 같은 규약을 써야 하면 이걸 재사용할 것. */
  worksheetUrl: wsUrlFromCode,

  /* QR 인라인 SVG 문자열(모듈 격자 그대로, 폰트/이미지 의존 없음). */
  qrSvg,

  /* 스레드+레벨 → 관련 유닛 해석({threadId, thread, unitId, unit}) — 학습지 도우미
     화면(main.js)과 인쇄 개념 페이지가 같은 매핑을 쓴다. */
  resolveConceptUnit,

  /* 문제 배열 생성(시드 재현 가능) — 이미 내부에 있던 함수를 노출만 한다.
     drill.html의 서랍장 미리보기가 재사용(2026-08-28, 리디자인). 생성 로직은 그대로. */
  buildProblems,

  /* 문장제 변환 노출 — drill.html 미리보기가 유형(숫자/문장제) 선택을 그대로 비추는 데 쓴다. */
  applyWordProblems,

  /* 최대잉여법 비례 배분 — 검증 하네스 노출용(로드맵 세션 20문항/페이지, 2026-09-04).
     순수 함수라 브라우저 없이도 Node에서 그대로 돌릴 수 있다. */
  proportionalSplit,

  /* items(드릴 목록, 가중치=n|count|weight)를 목표 총 문항 수로 나눠 문제를 만든다 —
     renderMixedSheet가 쓰는 그 로직 그대로. 검증 하네스가 실제 화면을 열지 않고도
     세션당 20문항 분배·결정성(같은 시드→같은 결과)을 확인하는 데 쓴다. */
  buildMixedProblemSet,

  /* ── 1. 시험 설정 화면 ── */
  renderExamSetup(container, onStart, opts){
    opts = opts || {};
    /* 2026-07-13: 디딤돌 연산 실제 목차(사용자 캡처, ebook.didimdol.co.kr) 기준 교과 순서 +
       docssam만의 2단 구성 — 각 학기는 두 층으로 이뤄진다:
       ① 교과 핵심: 실제 디딤돌 책의 학습 진행 순서 그대로 (학년 배치·순서 검증됨)
       ② ✨연산 마법(magic:true): 그 학기 내용과 맞물리는 "계산이 빨라지는 전략" 스킬 —
          보수·두배수·짝묶기·더 빼고 돌려받기·식의 변형·몇십곱·19단/99단/기준곱·가우스 합·
          제곱수·배수판별 등 수의 마법 고유 스레드를 학년 난이도에 맞춰 배치.
          단순 반복 드릴이 아니라 "원리로 빨라지는" 경험이 이 앱의 정체성. */
    const GRADES = {
      '1A':{label:'1학년 1학기',emoji:'🌱',subs:[
        {label:'모으기 · 가르기',thread:'NS2',level:2,desc:'9까지',
          concept:'두 수를 모으거나, 하나의 수를 둘로 가를 수 있어요.\n예) 3과 4를 모으면 7 / 7을 가르면 3과 4'},
        {label:'합이 9까지인 덧셈',thread:'AD1',level:1,desc:'한 자리 덧셈',
          concept:'두 수를 더해요(+). 합이 9를 넘지 않아요.\n예) 3 + 2 = 5'},
        {label:'한 자리 수의 뺄셈',thread:'SB1',level:1,desc:'9까지',
          concept:'큰 수에서 작은 수를 빼요(−).\n예) 7 − 3 = 4'},
        {label:'10 가르기 · 모으기',thread:'NS3',level:2,desc:'보수 10',
          concept:'더하면 10이 되는 두 수를 찾아요.\n예) 3 + □ = 10  →  □ = 7'},
        {label:'보수 5 마법',thread:'NS3',level:1,desc:'더해서 5',magic:true,
          concept:'더해서 5가 되는 짝(1·4, 2·3)을 외워두면\n손가락을 안 세도 셈이 빨라져요!'},
        {label:'두 배 수 마법',thread:'NS5',level:1,desc:'1~10 두 배',magic:true,
          concept:'1+1=2, 2+2=4, 3+3=6 … 두 배 수는 눈 감고도!\n4+5는 "4+4보다 1 큰 수"로 바로 나와요.'},
      ]},
      '1B':{label:'1학년 2학기',emoji:'🌿',subs:[
        {label:'세 수의 덧셈',thread:'AD2',level:2,desc:'10 만들어 더하기',
          concept:'세 수를 더할 때 합이 10이 되는 두 수를 먼저 찾아 묶어요.\n예) 3 + 7 + 5 = 10 + 5 = 15'},
        {label:'받아올림 있는 덧셈',thread:'AD2',level:1,desc:'몇+몇',
          concept:'한 자리 수끼리 더해서 10이 넘으면 받아올림해요.\n예) 8 + 5 = 13'},
        {label:'두 자리 + 한 자리',thread:'AD3',level:1,desc:'올림 없음',
          concept:'두 자리 수에 한 자리 수를 더해요. 일의 자리 합이 9 이하예요.\n예) 32 + 5 = 37'},
        {label:'두 자리 − 한 자리',thread:'SB3',level:1,desc:'내림 없음',
          concept:'두 자리 수에서 한 자리 수를 빼요. 일의 자리가 충분해요.\n예) 47 − 3 = 44'},
        {label:'몇십 덧뺄 마법',thread:'AD4',level:1,desc:'10·20·30…',magic:true,
          concept:'몇십끼리는 십 묶음으로 세면 한 번에!\n예) 20+30 → 2묶음+3묶음 = 5묶음 = 50'},
        {label:'몇십−몇 마법',thread:'SB2',level:1,desc:'30−7 같은 꼴',magic:true,
          concept:'몇십에서 한 자리를 뺄 때는 10에서 먼저 빼요.\n예) 30−7 → 10−7=3 → 20+3=23'},
      ]},
      '2A':{label:'2학년 1학기',emoji:'🌷',subs:[
        {label:'(두)+(한) 받아올림',thread:'AD3',level:2,desc:'몇십몇+몇',
          concept:'일의 자리 합이 10 이상이면 십의 자리로 올려요.\n예) 37 + 5 = 42  (7+5=12, 1 올림)'},
        {label:'(두)+(두) 올림 1회',thread:'AD5',level:1,desc:'몇십몇+몇십몇',
          concept:'두 자리 수끼리 더해요. 일의 자리에서 한 번 받아올림해요.\n예) 24 + 38 = 62'},
        {label:'(두)+(두) 올림 자유',thread:'AD5',level:2,desc:'올림 1~2회',
          concept:'받아올림이 한 번 또는 두 번 있을 수 있어요.\n예) 78 + 65 = 143'},
        {label:'(두)−(한) 받아내림',thread:'SB3',level:2,desc:'몇십몇−몇',
          concept:'일의 자리가 모자라면 십의 자리에서 10을 빌려요.\n예) 43 − 7 = 36'},
        {label:'(두)−(두) 받아내림',thread:'SB4',level:2,desc:'몇십몇−몇십몇',
          concept:'두 자리 수끼리 빼요. 받아내림에 주의해요.\n예) 73 − 48 = 25'},
        {label:'더 빼고 돌려받기',thread:'SB5',level:1,desc:'−9는 −10+1',magic:true,
          concept:'7, 8, 9를 뺄 때는 10을 빼고 돌려받아요!\n예) 45−9 = 45−10+1 = 36\n받아내림 없이도 답이 나오는 마법!'},
        {label:'100−수 마법',thread:'SB2',level:2,desc:'100에서 빼기',magic:true,
          concept:'100에서 뺄 때는 몇십을 먼저, 몇을 나중에.\n예) 100−36 → 100−30=70 → 70−6=64'},
      ]},
      '2B':{label:'2학년 2학기',emoji:'🌻',subs:[
        {label:'2 · 5단 곱셈구구',thread:'ML2',level:4,desc:'2단, 5단',
          concept:'같은 수를 여러 번 더하는 것이 곱셈이에요.\n2단: 2×1=2, 2×2=4 …\n5단은 끝자리가 항상 0 또는 5!'},
        {label:'3 · 6단 곱셈구구',thread:'ML2',level:5,desc:'3단, 6단',
          concept:'3단: 3×1=3, 3×2=6, 3×3=9 …\n6단은 3단의 두 배예요: 6×n = 3×n×2'},
        {label:'4 · 8단 곱셈구구',thread:'ML3',level:4,desc:'4단, 8단',
          concept:'4단: 4×1=4, 4×2=8 …\n8단은 4단의 두 배예요: 8×n = 4×n×2'},
        {label:'7 · 9단 곱셈구구',thread:'ML3',level:5,desc:'7단, 9단',
          concept:'9단 팁: 십의 자리는 1씩 늘고, 일의 자리는 1씩 줄어요.\n예) 9×1=09, 9×2=18, 9×3=27 …'},
        {label:'곱셈구구 종합',thread:'ML4',level:1,desc:'2~9단 혼합',
          concept:'2단부터 9단까지 모두 섞어서 연습해요.\n팁: a×b = b×a (순서를 바꿔도 같아요!)'},
        {label:'배와 반 마법',thread:'ML1',level:1,desc:'×2 감각',magic:true,
          concept:'두 배에 익숙해지면 구구단이 반으로 줄어요!\n4단 = 2단의 두 배, 8단 = 4단의 두 배, 6단 = 3단의 두 배'},
        {label:'거꾸로 구구단',thread:'ML4',level:2,desc:'□×n = 답',magic:true,
          concept:'곱셈식의 빈칸을 구구단으로 거꾸로 찾아요.\n예) 3×□=18 → 3단에서 18 찾기 → □=6\n3학년 나눗셈을 미리 준비하는 마법!'},
      ]},
      '3A':{label:'3학년 1학기',emoji:'🌼',subs:[
        {label:'세 자리 덧셈',thread:'AD6',level:2,desc:'3자리+3자리',
          concept:'일→십→백 자리 순서로 더해요. 받아올림이 연속될 수 있어요.\n예) 357 + 486 = 843'},
        {label:'세 자리 뺄셈',thread:'SB6',level:1,desc:'3자리−3자리',
          concept:'일→십→백 자리 순서로 빼요. 모자라면 윗 자리에서 빌려요.\n예) 623 − 358 = 265'},
        {label:'나눗셈의 기초',thread:'DV2',level:1,desc:'구구단 안에서',
          concept:'같은 수씩 나누는 것이 나눗셈이에요.\n예) 12 ÷ 4 = 3  →  4씩 3묶음\n곱셈의 반대로 생각해요: 4 × □ = 12'},
        {label:'(두)×(한)',thread:'ML6',level:2,desc:'두 자리 곱셈',
          concept:'두 자리 수 × 한 자리 수. 자리를 나눠 곱한 뒤 더해요.\n예) 23 × 4 = (20×4) + (3×4) = 80 + 12 = 92'},
        {label:'짝 묶기 마법',thread:'AD8',level:1,desc:'합10 짝 먼저',magic:true,
          concept:'여러 수를 더할 땐 합이 10이 되는 짝부터!\n예) 3+7+5+5 = (3+7)+(5+5) = 10+10 = 20'},
        {label:'식 변형 마법',thread:'SB7',level:1,desc:'끼리끼리 묶기',magic:true,
          concept:'순서를 바꿔 계산하기 쉬운 짝을 만들어요.\n예) 23+15+7+5 = (23+7)+(15+5) = 30+20 = 50'},
      ]},
      '3B':{label:'3학년 2학기',emoji:'🍀',subs:[
        {label:'(세)×(한)',thread:'ML7',level:2,desc:'세 자리 곱셈',
          concept:'세 자리 수 × 한 자리 수를 세로셈으로 계산해요.\n예) 234 × 3 = 702'},
        {label:'(두)×(두)',thread:'ML8',level:1,desc:'두 자리×두 자리',
          concept:'두 자리 수끼리 곱해요. 분배법칙으로 나눠 계산해요.\n예) 23 × 14 = (23×10) + (23×4) = 230 + 92 = 322'},
        {label:'나머지 있는 나눗셈',thread:'DV3',level:1,desc:'두 자리÷한 자리',
          concept:'나눠도 남는 수가 나머지예요. 나머지 < 나누는 수!\n예) 17 ÷ 5 = 3 … 2  (5×3=15, 17−15=2)'},
        {label:'(세)÷(한) 나머지없음',thread:'DV4',level:1,desc:'몫이 딱 떨어짐',
          concept:'세 자리 수를 한 자리 수로 나눠요. 몫이 딱 떨어져요.\n예) 132 ÷ 4 = 33'},
        {label:'(세)÷(한) 나머지있음',thread:'DV4',level:2,desc:'나머지 있음',
          concept:'나눠도 남는 수(나머지)가 생겨요.\n예) 137 ÷ 4 = 34 … 1  (확인: 4×34+1=137)'},
        {label:'몇십 곱 마법',thread:'ML5',level:2,desc:'20×30 한 번에',magic:true,
          concept:'몇십×몇십은 앞자리끼리 곱하고 0을 붙여요.\n예) 20×30 → 2×3=6 → 600\n큰 곱셈의 어림값도 이걸로 빨라져요!'},
        {label:'크게 빼고 돌려받기',thread:'SB5',level:2,desc:'−98은 −100+2',magic:true,
          concept:'끝이 7·8·9인 수를 뺄 때는 몇십·몇백으로 올려 빼고 돌려받아요.\n예) 234−98 = 234−100+2 = 136'},
      ]},
      '4A':{label:'4학년 1학기',emoji:'🌺',subs:[
        {label:'(세)×(두)',thread:'ML9',level:1,desc:'세 자리×두 자리',
          concept:'세 자리 수와 두 자리 수의 곱셈이에요.\n예) 234 × 56 = 13104'},
        {label:'(두)÷(두)',thread:'DV5',level:1,desc:'두 자리로 나누기',
          concept:'두 자리 수로 나누는 나눗셈이에요. 몫을 어림해서 찾아요.\n예) 78 ÷ 13 = 6'},
        {label:'(세)÷(두)',thread:'DV5',level:2,desc:'세 자리÷두 자리',
          concept:'세 자리 수를 두 자리 수로 나눠요.\n예) 456 ÷ 12 = 38'},
        {label:'19단 마법',thread:'ML10',level:1,desc:'11~19단 암산',magic:true,
          concept:'교차 계산법으로 19단도 암산!\n예) 13×12 = (13+2)×10 + 3×2 = 150+6 = 156'},
        {label:'큰 수 ×2 · ÷2',thread:'ML1',level:3,desc:'네 자리 감각',magic:true,
          concept:'교과서 "큰 수" 단원과 짝꿍!\n큰 수도 두 배·반으로 다루면 수 감각이 자라요.\n예) 2400의 반 = 1200 / 3200의 두 배 = 6400'},
      ]},
      '4B':{label:'4학년 2학기',emoji:'🍁',subs:[
        {label:'가분수 ↔ 대분수',thread:'FR2',level:1,desc:'서로 바꾸기',
          concept:'가분수는 나눗셈으로 대분수로!\n예) 7/3 = 2와1/3 (7÷3 = 2 … 1)'},
        {label:'동분모 분수 덧·뺄',thread:'FR1',level:1,desc:'진분수',
          concept:'분모가 같으면 분자끼리만 더하거나 빼요. 분모는 그대로!\n예) 3/7 + 2/7 = 5/7'},
        {label:'대분수의 덧셈',thread:'FR3',level:1,desc:'동분모, 올림 없음',
          concept:'정수끼리, 분수끼리 따로 더해요!\n예) 1과2/6 + 2와3/6 = 3과5/6'},
        {label:'대분수의 뺄셈',thread:'FR3',level:2,desc:'동분모, 받아내림',
          concept:'분수 부분이 부족하면 정수에서 1을 빌려요!\n예) 3과1/4 − 1과3/4 = 1과2/4'},
        {label:'소수 덧·뺄',thread:'DC1',level:1,desc:'소수 한 자리',
          concept:'소수점 아래 한 자리 수의 덧뺄셈.\n소수점끼리 자리를 맞춰 계산해요.\n예) 2.5 + 1.3 = 3.8'},
        {label:'99단 마법',thread:'ML10',level:2,desc:'99×n = 100n−n',magic:true,
          concept:'99를 곱할 땐 100을 곱하고 한 번 빼요.\n예) 99×23 = 2300−23 = 2277'},
        {label:'여러 수 한 번에',thread:'AD8',level:3,desc:'두 자리 섞인 덧셈',magic:true,
          concept:'수가 많아도 짝을 찾으면 무섭지 않아요!\n예) 14+6+8+2+5 = 20+10+5 = 35'},
      ]},
      '5A':{label:'5학년 1학기',emoji:'⭐',subs:[
        {label:'사칙 혼합계산',thread:'MX1',level:1,desc:'괄호 없음',
          concept:'괄호가 없으면 곱셈·나눗셈을 먼저 계산해요.\n예) 3 + 2 × 5 = 3 + 10 = 13'},
        {label:'괄호 혼합계산',thread:'MX1',level:2,desc:'소괄호',
          concept:'괄호 안을 가장 먼저 계산해요.\n예) (3+2) × 5 = 5 × 5 = 25'},
        {label:'최대공약수',thread:'DV7',level:2,desc:'GCD',
          concept:'두 수의 공통 약수 중 가장 큰 수예요.\n예) 12와 18의 최대공약수 = 6'},
        {label:'최소공배수',thread:'DV7',level:3,desc:'LCM',
          concept:'두 수의 공통 배수 중 가장 작은 수예요.\n예) 4와 6의 최소공배수 = 12'},
        {label:'약분',thread:'FR5',level:1,desc:'기약분수',
          concept:'분자와 분모를 공약수로 나눠 더 간단한 분수로 만들어요.\n예) 6/8 = 3/4 (2로 약분)'},
        {label:'이분모 분수 덧·뺄',thread:'FR4',level:1,desc:'통분',
          concept:'분모가 다르면 통분(공통분모 만들기)을 먼저 해요.\n예) 1/2 + 1/3 = 3/6 + 2/6 = 5/6'},
        {label:'배수 판별 마법',thread:'DV6',level:2,desc:'3·6·9 배수 찾기',magic:true,
          concept:'자릿수의 합이 3의 배수면 그 수도 3의 배수!\n예) 234 → 2+3+4=9 → 3의 배수\n약분할 공약수가 눈에 보이는 마법이에요.'},
        {label:'가우스의 합 마법',thread:'MX2',level:1,desc:'1~n 한 번에',magic:true,
          concept:'1부터 n까지의 합 = n×(n+1)÷2\n예) 1+2+…+10 = 10×11÷2 = 55\n수학자 가우스가 초등학생 때 쓴 방법!'},
      ]},
      '5B':{label:'5학년 2학기',emoji:'🌙',subs:[
        {label:'분수와 자연수의 곱셈',thread:'FR6',level:2,desc:'대분수 포함',
          concept:'자연수를 분자에 곱해요.\n예) 3 × 2/5 = 6/5 = 1과1/5'},
        {label:'진분수의 곱셈',thread:'FR6',level:1,desc:'진분수×진분수',
          concept:'분자끼리, 분모끼리 곱해요!\n예) 2/3 × 3/4 = 6/12 = 1/2'},
        {label:'분수와 소수',thread:'FR8',level:1,desc:'서로 변환',
          concept:'분수를 소수로, 소수를 분수로 바꿔요.\n예) 1/4 = 0.25'},
        {label:'소수의 곱셈',thread:'DC2',level:1,desc:'자연수·소수',
          concept:'정수처럼 곱한 뒤 소수점을 옮겨요.\n예) 0.3 × 0.2 = 0.06'},
        {label:'세 분수 곱 마법',thread:'FR6',level:3,desc:'약분 먼저!',magic:true,
          concept:'곱하기 전에 약분부터 하면 계산이 훨씬 작아져요.\n분자 셋·분모 셋을 한꺼번에 곱해요!'},
        {label:'25×4 기준곱 마법',thread:'ML10',level:3,desc:'25×4=100 활용',magic:true,
          concept:'25×4=100, 125×8=1000을 알면 큰 곱셈이 순식간에!\n예) 25×16 = 25×4×4 = 100×4 = 400'},
      ]},
      '6A':{label:'6학년 1학기',emoji:'🏆',subs:[
        {label:'분수·자연수 곱나눗셈',thread:'FR6',level:2,desc:'분수의 나눗셈 준비',
          concept:'분수와 자연수를 곱하는 연습으로 나눗셈의 기초를 다져요.\n예) 4/5 × 3 = 12/5 = 2와2/5'},
        {label:'소수 나눗셈',thread:'DC3',level:1,desc:'소수÷자연수',
          concept:'소수를 10배 해서 정수로 계산한 뒤 다시 나눠요.\n예) 3.6 ÷ 4 = 0.9'},
        {label:'비와 비율',thread:'MX3',level:1,desc:'백분율',
          concept:'비율에 100을 곱하면 백분율(%)이에요.\n예) 3/4 = 0.75 = 75%'},
        {label:'제곱수 마법',thread:'ML11',level:1,desc:'11²~20² 암기',magic:true,
          concept:'11²=121, 12²=144 … 20²=400\n제곱수를 외워두면 중학교 제곱근이 쉬워져요!'},
        {label:'홀짝 수열의 합',thread:'MX2',level:2,desc:'홀수 합 = n²',magic:true,
          concept:'1+3+5+…+(2n−1) = n² (홀수 n개의 합)\n2+4+6+…+2n = n×(n+1)\n규칙을 알면 더하지 않고도 답이 보여요!'},
      ]},
      '6B':{label:'6학년 2학기',emoji:'🎓',subs:[
        {label:'분수의 나눗셈',thread:'FR7',level:1,desc:'분수÷분수',
          concept:'나누기는 역수의 곱셈! ÷를 ×로 바꾸고 뒤 분수를 뒤집어 곱해요.\n예) 1/2 ÷ 1/4 = 1/2 × 4/1 = 2'},
        {label:'소수의 나눗셈',thread:'DC3',level:1,desc:'나누어떨어짐',
          concept:'소수 나눗셈 총정리.\n예) 4.8 ÷ 6 = 0.8'},
        {label:'비와 비율 종합',thread:'MX3',level:2,desc:'할·푼·리',
          concept:'우리나라식 소수 비율 표현이에요.\n예) 0.354 → 3할 5푼 4리'},
        {label:'혼합계산 끝판왕',thread:'MX1',level:3,desc:'중괄호까지',magic:true,
          concept:'소괄호→중괄호→곱나눗셈→덧뺄셈 순서로!\n예) {(3+5)×4−2} = {32−2} = 30\n초등 연산 6년의 총결산이에요.'},
        {label:'분수·소수 총정리',thread:'MX5',level:1,desc:'졸업 기념 마법',magic:true,
          concept:'분수와 소수를 자유자재로 넘나들며 총정리해요.\n약분·통분·변환까지 한 판에!'},
      ]},
      /* 2026-07-13: 예비 중등은 사용자 지시로 "중1 교육과정 순서"를 따른다:
         ① 소인수분해(자연수의 성질) → ② 정수와 유리수 → ③ 문자와 식·방정식 → ④ 정비례와 반비례.
         참고: 디딤돌 Pre중등 책(Drive OCR 확인)은 비례→방정식→정수 순이지만, 중1 진도 순서로 재배열함.
         ①은 기존 생성기(DV8/DV7/ML11)가 있어 바로 풀 수 있고, ②~④는 표 완성·등식의 성질형
         문제라 대응 생성기가 없어 comingSoon(개념 카드만) — 억지 매핑 대신 준비중으로 명시. */
      'PRE':{label:'예비 중등',emoji:'🚀',subs:[
        {label:'소수(素數) 판별',thread:'DV8',level:1,desc:'소수 찾기',
          concept:'약수가 1과 자기 자신뿐인 수가 소수예요.\n예) 2, 3, 5, 7, 11, 13 …\n주의: 1은 소수가 아니에요!\n중1 첫 단원 "소인수분해"의 출발점.'},
        {label:'소인수분해',thread:'DV8',level:2,desc:'소수의 곱으로',
          concept:'수를 소수의 곱으로 나타내요.\n예) 12 = 2 × 2 × 3 = 2² × 3\n작은 소수(2, 3, 5…)부터 차례로 나눠 봐요.'},
        {label:'거듭제곱',thread:'ML11',level:3,desc:'2ⁿ·3ⁿ·5ⁿ',
          concept:'같은 수를 여러 번 곱하면 거듭제곱!\n예) 2×2×2 = 2³ = 8\n소인수분해 결과를 지수로 표현할 때 꼭 필요해요.'},
        {label:'최대공약수·최소공배수',thread:'DV7',level:2,desc:'소인수분해로',
          concept:'중1에서는 소인수분해를 이용해 최대공약수를 구해요.\n예) 12=2²×3, 18=2×3² → 공통 소인수 2×3 = 6'},
        {label:'약수의 개수',thread:'DV8',level:3,desc:'(지수+1) 곱',
          concept:'소인수분해하면 약수의 개수를 세지 않고도 알 수 있어요!\n예) 12 = 2²×3 → (2+1)×(1+1) = 6개'},
        {label:'정수와 유리수',desc:'음수·수직선',comingSoon:true,
          concept:'0보다 작은 수(음수)를 포함한 정수·유리수를 수직선 위에서 비교해요.\n절댓값: 수직선에서 0으로부터 떨어진 거리.\n예) -3의 절댓값은 3'},
        {label:'덧셈·뺄셈 방정식',desc:'등식의 성질',comingSoon:true,
          concept:'모르는 수 x가 있는 등식을 방정식이라 해요.\n등식의 양쪽에 같은 수를 더하거나 빼도 등식은 그대로 성립해요.\n예) x − 9 = 12 → 양쪽에 9를 더하면 x = 21'},
        {label:'곱셈·나눗셈 방정식',desc:'등식의 성질',comingSoon:true,
          concept:'등식의 양쪽에 같은 수를 곱하거나(0이 아닌 수로) 나누어도 등식은 그대로 성립해요.\n예) x ÷ 5 = 20 → 양쪽에 5를 곱하면 x = 100'},
        {label:'혼합 방정식',desc:'×,+,− / ÷,+,−',comingSoon:true,
          concept:'x×(수)나 x÷(수)를 한 덩어리로 먼저 구한 다음 x를 구해요.\n예) x×4+5=17 → x×4=12 → x=3'},
        {label:'정비례와 반비례',desc:'대응 관계 표',comingSoon:true,
          concept:'두 수 x, y가 있을 때\n· 정비례: x가 2배, 3배… 되면 y도 2배, 3배… 돼요. (y = 정해진 수 × x)\n· 반비례: x가 2배, 3배… 되면 y는 반으로, 1/3로… 줄어요. (x × y = 정해진 수)\n예) 세발자전거 수와 전체 바퀴 수 → 정비례 / 넓이가 일정한 직사각형의 가로·세로 → 반비례'},
        {label:'제곱근 마법',thread:'MX4',level:1,desc:'√121~√400',magic:true,
          concept:'제곱해서 그 수가 되는 수를 찾아요.\n예) √144 = 12 (12×12=144)\n중3 내용을 살짝 맛보는 보너스 마법!'},
      ]},
    };
    const GRADE_ORDER = ['1A','1B','2A','2B','3A','3B','4A','4B','5A','5B','6A','6B','PRE'];
    const threads = window.NM_THREADS || {};
    const COUNT_OPTS = [10, 20, 30, 50];

    function showSectionPick(){
      container.innerHTML = `
<div class="nm-ex-sec-wrap">
  <h2 class="nm-ex-sec-title">📝 ${esc(lk('학습지 / Exam','Worksheet / Exam','学习单 / Exam'))}</h2>
  <p class="nm-ex-sec-sub">${esc(lk('어떤 방식으로 공부할까요?','How would you like to study?','想用哪种方式学习？'))}</p>
  <div class="nm-ex-sec-row">
    <button class="nm-ex-sec-card" data-sec="grade">
      <div class="nm-ex-sec-emo">📚</div>
      <div class="nm-ex-sec-name">${esc(lk('교과 연산 연습','Curriculum Practice','教材运算练习'))}</div>
      <div class="nm-ex-sec-desc">${esc(lk('1A ~ 6B 학기별 주제 선택','Pick a topic from grades 1A–6B','按1A~6B学期选择主题'))}</div>
    </button>
    <button class="nm-ex-sec-card" data-sec="magic">
      <div class="nm-ex-sec-emo">✨</div>
      <div class="nm-ex-sec-name">${esc(lk('수의 마법 탐험','Number Magic Explorer','数字魔法探险'))}</div>
      <div class="nm-ex-sec-desc">${esc(lk('스레드 직접 선택','Pick a skill thread directly','直接选择技能线'))}</div>
    </button>
    <button class="nm-ex-sec-card" data-sec="road">
      <div class="nm-ex-sec-emo">🛤️</div>
      <div class="nm-ex-sec-name">${esc(lk('연산 로드맵','Course Road','运算路线图'))}</div>
      <div class="nm-ex-sec-desc">${esc(lk('과정 순서 그대로 뽑기','Print along the course path','按课程路线打印'))}</div>
    </button>
  </div>
</div>`;
      container.querySelector('[data-sec="grade"]').addEventListener('click', showGradePick);
      container.querySelector('[data-sec="magic"]').addEventListener('click', showMagicForm);
      container.querySelector('[data-sec="road"]').addEventListener('click', showRoadPick);
    }

    /* ── 연산 로드맵(과정 1~N) 피커 ──────────────────────────────
       data/courses.js의 NM_COURSES(과정 → 세션 → 드릴/마법)를 티어별로
       펼쳐 보여주고, 세션 하나를 그대로 학습지로 인쇄한다(NM_EXAM.renderPrintMulti
       재사용 — 편지함 봉투 인쇄와 같은 경로). opts.currentCourse/opts.tiers는
       main.js screenExam()이 넘겨준다(없어도 동작: 폴백 라벨·자동오픈 없음). */
    function showRoadPick(){
      const NM_COURSES = window.NM_COURSES || {};
      const list = Object.keys(NM_COURSES)
        .map(key => ({ key, c: NM_COURSES[key] }))
        .sort((a,b) => (a.c.order||0) - (b.c.order||0));

      let openCourse = (opts.currentCourse && NM_COURSES[opts.currentCourse]) ? opts.currentCourse : null;
      let scrolledOnce = false;
      /* 인쇄 옵션 — 교과/마법 흐름과 같은 4종(문항수·문장제 유형·개념·표지).
         countMode = 세션 전체를 한 장에 담을 목표 문항 수(2026-09-04 원장 지시
         "한 페이지에 20문제씩" — 드릴마다 따로 세지 않고 세션 전체 총량이다).
         10|20|40만 허용(40=20문항짜리 두 장) — renderPrintMulti의 opts.mixed로 그대로
         넘어간다. */
      let roadWordType = 'none';     // 'none'|'mix'|'all'
      let roadCountMode = 20;        // 10|20|40
      /* 주기(주 1회/주 2회) — 연산 로드맵 화면과 같은 S.roadCadence를 공유
         (opts.cadence로 받고, 바꾸면 opts.onCadence로 저장을 부탁한다). */
      let roadCadence = (opts.cadence==='w2') ? 'w2' : 'w1';

      /* ── 개인별 주차 라벨 ─────────────────────────────────
         "현재 과정의 첫 세션 = 이번 주"를 닻으로, 이후 세션에 달력 주차를
         붙인다. 주 1회면 세션마다 1주(9월 1주차, 9월 2주차…), 주 2회면
         두 세션이 한 주(9월 1-1주차, 9월 1-2주차…). 몇째 주는 그 주
         월요일이 그 달에서 몇 번째 7일 구간에 있는지로 센다. */
      function mondayOfThisWeek(){
        const d=new Date(); d.setHours(0,0,0,0);
        const day=(d.getDay()+6)%7; // 월=0
        d.setDate(d.getDate()-day);
        return d;
      }
      const EN_MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      function calLabelFor(offset){ // offset = 현재 위치부터 몇 번째 세션인가(0-base)
        const perWeek = roadCadence==='w2' ? 2 : 1;
        const weekOff = Math.floor(offset/perWeek);
        const kth = (offset%perWeek)+1;
        const mon = mondayOfThisWeek();
        mon.setDate(mon.getDate()+weekOff*7);
        const m = mon.getMonth()+1;
        const nth = Math.floor((mon.getDate()-1)/7)+1;
        if(perWeek===1) return lk(`${m}월 ${nth}주차`, `${EN_MON[m-1]} W${nth}`, `${m}月第${nth}周`);
        return lk(`${m}월 ${nth}-${kth}주차`, `${EN_MON[m-1]} W${nth}-${kth}`, `${m}月第${nth}周·第${kth}次`);
      }
      /* 과정키 → 그 과정 첫 세션의 전역 offset (현재 과정 첫 세션=0).
         현재 과정 이전은 지난 과정이라 라벨을 붙이지 않는다(null). */
      function courseStartOffset(courseKey){
        let acc=0, curSeen=false;
        for(const x of list){
          if(x.key===opts.currentCourse) curSeen=true;
          if(x.key===courseKey) return curSeen ? acc : null;
          if(curSeen) acc += (x.c.sessions||[]).length;
        }
        return null;
      }

      /* ── 개인 로드맵 한 장 인쇄 — 다음 12세션을 주차·과정·구성으로 표에 ──
         roadmap demo(진단 리포트)의 "○○○ 학생의 현재 로드맵" 표와 같은 정신:
         추천 계획일 뿐 순서는 자유(잠금 없음)라는 문구를 함께 찍는다. */
      function printPersonalPlan(){
        const rows=[];
        let started=false;
        outer:
        for(const x of list){
          if(x.key===opts.currentCourse) started=true;
          if(!started) continue;
          const sess=x.c.sessions||[];
          for(let i=0;i<sess.length;i++){
            const off=rows.length;
            const s=sess[i];
            const items=s.test?(s.pool||[]):(s.drills||[]);
            rows.push({
              cal:calLabelFor(off),
              course:`${x.c.order}. ${pickL(x.c.title)||x.key}`,
              sess:s.test?lk('과정 시험','Course Test','课程测验'):`${lk('세션','Session','课节')} ${i+1}`,
              magic:(!s.test&&s.magic&&s.magic.length)?s.magic.map(magicLabel).join(' · '):'',
              drills:items.map(d=>`${threadLabel(d.t)}×${d.n}`).join(' · ')
            });
            if(rows.length>=12) break outer;
          }
        }
        if(!rows.length) return;
        const old=document.querySelector('.nm-print-sheet');
        if(old) old.remove();
        const sheet=document.createElement('div');
        sheet.className='nm-print-sheet';
        sheet.setAttribute('aria-hidden','true');
        sheet.setAttribute('lang',examLang());
        const nm=printStudentName();
        const cadTxt=roadCadence==='w2'?lk('주 2회','Twice a week','每周2次'):lk('주 1회','Once a week','每周1次');
        const today=new Date();
        sheet.innerHTML=`
${printWatermarkHtml()}
<div class="nm-print-header">
  <h2 style="margin:0">Numbers of Magic — 🗓 ${esc(nm?nm+lk('의 로드맵',"'s Roadmap",'的路线图'):lk('개인 로드맵','My Roadmap','个人路线图'))}</h2>
  <div style="margin-top:6px;font-size:0.9em">${esc(lk('기준','Pace','频率'))}: ${esc(cadTxt)} · ${today.getFullYear()}.${today.getMonth()+1}.${today.getDate()}</div>
</div>
<table class="nm-print-plan">
  <thead><tr>
    <th>${esc(lk('주차','Week','周次'))}</th><th>${esc(lk('과정','Course','课程'))}</th>
    <th>${esc(lk('세션','Session','课节'))}</th><th>${esc(lk('구성','Contents','内容'))}</th>
  </tr></thead>
  <tbody>
    ${rows.map(r=>`<tr>
      <td class="nm-pp-cal">${esc(r.cal)}</td>
      <td>${esc(r.course)}</td>
      <td>${esc(r.sess)}</td>
      <td>${r.magic?`<span class="nm-pp-magic">✨ ${esc(r.magic)}</span><br>`:''}${esc(r.drills)}</td>
    </tr>`).join('')}
  </tbody>
</table>
<p class="nm-pp-note">${esc(lk('이 표는 추천 계획이에요. 순서는 언제든 자유롭게 바꿔도 좋아요.','This is a suggested plan — feel free to change the order any time.','这是推荐计划，顺序可以随时自由调整。'))}</p>`;
        document.body.appendChild(sheet);
        if(!window.NM_NO_AUTOPRINT) setTimeout(()=>{window.print();},250);
      }

      function tierInfo(tierKey){
        const found = (opts.tiers || []).find(x => x.key === tierKey);
        if(found) return found;
        return { key: tierKey, name: { ko: tierKey, en: tierKey, zh: tierKey }, band: { ko:'', en:'', zh:'' } };
      }
      /* 마법 슬롯 id는 유닛(N-06 등)이거나, 유닛이 아니라 스레드 자체가 마법인
         경우(ML10 등)가 있다(courses.js 주석 참조) — 둘 다 받는다. */
      function magicLabel(id){
        const u = (window.NM_UNITS || {})[id];
        if(u && u.title) return pickL(u.title) || id;
        const th = (window.NM_THREADS || {})[id];
        return th ? (pickL(th.name) || id) : id;
      }
      function threadLabel(t){
        const th = (window.NM_THREADS || {})[t];
        return th ? (pickL(th.name) || t) : t;
      }

      function sessionChipsHtml(s){
        const items = s.test ? (s.pool||[]) : (s.drills||[]);
        return items.map(d => `<span class="nm-ex-road-chip">${esc(threadLabel(d.t))} × ${d.n}</span>`).join('');
      }

      /* 인쇄 회수 — S.roadPrints(main.js가 opts.roadPrints로 그대로 넘긴 참조 객체)에
         courseKey+'-'+sessionIdx 키로 누적된다. opts.onPrinted(key)가 그 저장을
         맡는다(main.js screenExam()의 onCadence와 같은 콜백 패턴). */
      function printKey(courseKey, i){ return courseKey + '-' + i; }
      function printCountFor(courseKey, i){
        return (opts.roadPrints && opts.roadPrints[printKey(courseKey, i)]) || 0;
      }

      function sessionRowHtml(s, i, courseKey){
        const isMagic = !s.test && s.magic && s.magic.length;
        const startOff = courseStartOffset(courseKey);
        const calHtml = (startOff===null) ? ''
          : `<span class="nm-ex-road-cal">🗓 ${esc(calLabelFor(startOff+i))}</span>`;
        const nameHtml = (s.test
          ? `${esc(lk('세션','Session','课节'))} ${i+1} · ${esc(lk('과정 시험','Course Test','课程测验'))}`
          : `${esc(lk('세션','Session','课节'))} ${i+1}`) + calHtml;
        const magicHtml = isMagic
          ? `<span class="nm-ex-road-magic">✨ ${s.magic.map(magicLabel).map(esc).join(' · ')}</span>` : '';
        const printed = printCountFor(courseKey, i);
        /* 첫 인쇄 전에는 "🎲 새 문제로 한 장 더" 버튼을 보여줄 이유가 없다(같은
           일을 하는 버튼이 둘이 되므로) — 인쇄한 적이 있을 때만 나타난다. */
        const reprintHtml = printed > 0 ? `<div class="nm-ex-road-printed">
            <span class="nm-ex-road-printed-count">🖨 ${esc(lk(`인쇄 ${printed}장`,`Printed ${printed}`,`已打印${printed}张`))}</span>
            <button class="nm-ex-road-reprint-btn" data-course="${esc(courseKey)}" data-session="${i}">
              🎲 ${esc(lk('새 문제로 한 장 더','One more (new problems)','再来一张(新题)'))}
            </button>
          </div>` : '';
        return `<div class="nm-ex-road-session">
          <div class="nm-ex-road-session-head">
            <span class="nm-ex-road-session-name">${nameHtml}</span>
          </div>
          ${magicHtml}
          <div class="nm-ex-road-chips">${sessionChipsHtml(s)}</div>
          <div class="nm-ex-road-btn-row">
            <button class="nm-ex-road-print-btn" data-course="${esc(courseKey)}" data-session="${i}">
              🖨 ${esc(lk('학습지','Worksheet','学习单'))}
            </button>
            <button class="nm-ex-road-online-btn" data-course="${esc(courseKey)}" data-session="${i}">
              💻 ${esc(lk('화면으로 풀기','Solve on screen','在线做题'))}
            </button>
          </div>
          ${reprintHtml}
        </div>`;
      }

      function courseRowHtml(x){
        const c = x.c;
        const isOpen = openCourse === x.key;
        const isCurrent = opts.currentCourse === x.key;
        const soon = !!c.comingSoon;
        const sessCount = (c.sessions||[]).length;
        return `<div class="nm-ex-road-course${isOpen?' open':''}${soon?' soon':''}" data-course-wrap="${esc(x.key)}">
          <button class="nm-ex-road-course-row" data-course-toggle="${esc(x.key)}" ${soon?'disabled':''}>
            <span class="nm-ex-road-course-num">${c.order}</span>
            <span class="nm-ex-road-course-body">
              <b>${esc(pickL(c.title))}${c.boss?' 👑':''}</b>
              <span class="nm-ex-road-course-meta">${sessCount} ${esc(lk('세션','sessions','节'))}</span>
            </span>
            ${isCurrent ? `<span class="nm-ex-road-here">📍 ${esc(lk('지금 여기','You are here','当前位置'))}</span>` : ''}
            ${soon ? `<span class="nm-ex-road-soon">🚧 ${esc(lk('준비 중','Coming soon','准备中'))}</span>` : ''}
            ${soon ? '' : `<span class="nm-ex-road-caret">${isOpen?'▲':'▼'}</span>`}
          </button>
          ${(isOpen && !soon) ? `<div class="nm-ex-road-sessions">
            ${(c.sessions||[]).map((s,i) => sessionRowHtml(s,i,x.key)).join('')}
          </div>` : ''}
        </div>`;
      }

      function render(){
        let prevTier = null;
        const seenTier = {};
        let body = '';
        list.forEach(x => {
          if(x.c.tier !== prevTier){
            const info = tierInfo(x.c.tier);
            /* 대수·미적분Ⅰ처럼 과정 번호가 순서상 흩어져 같은 티어가 두 번
               서는 경우(story-mode 로드맵의 "이어서"와 같은 자리, main.js
               nm-cr-station 참조) — 두 번째부터는 밴드(학년대) 설명을 생략하고
               "이어서"만 붙인다. 티어를 합치지 않는 이유: 과정 번호 순서를
               흐트러뜨리면 안 되기 때문(연속 구간으로만 끊는다). */
            const again = !!seenTier[x.c.tier];
            seenTier[x.c.tier] = true;
            body += `<div class="nm-ex-road-tier">
              <div class="nm-ex-road-tier-head">
                <span class="nm-ex-road-tier-name">${esc(pickL(info.name))}${again ? ` <em class="nm-ex-road-tier-again">${esc(lk('이어서','continued','续'))}</em>` : ''}</span>
                ${(!again && pickL(info.band)) ? `<span class="nm-ex-road-tier-band">${esc(pickL(info.band))}</span>` : ''}
              </div>
              <div class="nm-ex-road-course-list">`;
            prevTier = x.c.tier;
          }
          body += courseRowHtml(x);
          const isLastOfTier = (list.indexOf(x) === list.length-1) || list[list.indexOf(x)+1].c.tier !== x.c.tier;
          if(isLastOfTier) body += `</div></div>`;
        });

        container.innerHTML = `
<div class="nm-ex-form-wrap nm-ex-road-wrap">
  <div class="nm-ex-form-head">
    <button class="nm-ex-back-btn" id="nm-ex-back-road">← ${esc(lk('뒤로','Back','返回'))}</button>
    <span class="nm-ex-form-title">🛤️ ${esc(lk('연산 로드맵','Course Road','运算路线图'))}</span>
  </div>
  <div class="nm-ex-road-opts">
    ${(opts.currentCourse && NM_COURSES[opts.currentCourse] && (NM_COURSES[opts.currentCourse].sessions||[]).length) ? `
    <div class="nm-ex-road-opt-row nm-ex-road-thisweek-row">
      <button class="nm-ex-road-thisweek-btn" id="nm-road-thisweek">🖨️ ${esc(lk('이번 주 학습지 한 장 더','One more sheet for this week','再打印一张本周学习单'))}</button>
    </div>` : ''}
    <div class="nm-ex-road-opt-row">
      <span class="nm-ex-road-opt-label">${esc(lk('유형','Style','题型'))}</span>
      <div class="nm-ex-road-seg" id="nm-road-word">
        <button data-w="none" class="${roadWordType==='none'?'sel':''}">${esc(lk('숫자 연산','Numbers','数字运算'))}</button>
        <button data-w="mix" class="${roadWordType==='mix'?'sel':''}">${esc(lk('문장제 섞기','Mix word','混合应用题'))}</button>
        <button data-w="all" class="${roadWordType==='all'?'sel':''}">${esc(lk('문장제만','All word','全部应用题'))}</button>
      </div>
    </div>
    <div class="nm-ex-road-opt-row">
      <span class="nm-ex-road-opt-label">${esc(lk('문항 수','Count','题量'))}</span>
      <div class="nm-ex-road-seg" id="nm-road-count">
        <button data-c="10" class="${roadCountMode===10?'sel':''}">${esc(lk('유형당 10문항','10 per type','每类10题'))}</button>
        <button data-c="20" class="${roadCountMode===20?'sel':''}">${esc(lk('유형당 20문항(기본)','20 per type (default)','每类20题(默认)'))}</button>
        <button data-c="40" class="${roadCountMode===40?'sel':''}">${esc(lk('유형당 40문항','40 per type','每类40题'))}</button>
      </div>
    </div>
    <div class="nm-ex-road-opt-row">
      <span class="nm-ex-road-opt-label">${esc(lk('주기','Pace','频率'))}</span>
      <div class="nm-ex-road-seg" id="nm-road-cad">
        <button data-cad="w1" class="${roadCadence==='w1'?'sel':''}">${esc(lk('주 1회','1×/week','每周1次'))}</button>
        <button data-cad="w2" class="${roadCadence==='w2'?'sel':''}">${esc(lk('주 2회','2×/week','每周2次'))}</button>
      </div>
      <button class="nm-ex-road-plan-btn" id="nm-road-plan">🗓 ${esc(lk('개인 로드맵 인쇄','Print my roadmap','打印个人路线图'))}</button>
    </div>
    <div class="nm-ex-road-opt-row">
      ${coverToggleRowHtml()}
    </div>
  </div>
  <div class="nm-ex-form-body nm-ex-road-body">
    ${body || `<p class="nm-ex-label">${esc(lk('로드맵 데이터를 불러오지 못했어요.','Course data failed to load.','课程数据加载失败。'))}</p>`}
  </div>
</div>`;

        container.querySelector('#nm-ex-back-road').addEventListener('click', showSectionPick);

        container.querySelectorAll('[data-course-toggle]').forEach(btn => {
          btn.addEventListener('click', () => {
            const k = btn.dataset.courseToggle;
            openCourse = (openCourse === k) ? null : k;
            render();
          });
        });

        bindCoverToggle(container);
        /* 옵션 클릭 재렌더 — 스크롤 위치 보존(펼쳐 둔 과정이 도로 위로 튀지 않게) */
        function rerenderKeepScroll(){
          const sc = container.closest('.nm-step-body') || container;
          const top = sc.scrollTop;
          render();
          sc.scrollTop = top;
        }
        container.querySelectorAll('#nm-road-word button').forEach(b => {
          b.addEventListener('click', () => { roadWordType = b.dataset.w; rerenderKeepScroll(); });
        });
        container.querySelectorAll('#nm-road-count button').forEach(b => {
          b.addEventListener('click', () => {
            roadCountMode = parseInt(b.dataset.c,10) || 20;
            rerenderKeepScroll();
          });
        });
        container.querySelectorAll('#nm-road-cad button').forEach(b => {
          b.addEventListener('click', () => {
            roadCadence = b.dataset.cad;
            if(opts.onCadence) opts.onCadence(roadCadence);
            rerenderKeepScroll();
          });
        });
        const planBtn = container.querySelector('#nm-road-plan');
        if(planBtn) planBtn.addEventListener('click', printPersonalPlan);

        /* 세션 하나를 20(또는 10/40)문항 한 장 학습지로 인쇄한다 — 드릴별 가중치(n)에
           비례해 나눈다(buildMixedProblemSet, renderPrintMulti의 opts.mixed 경로).
           매번 새 시드라 "🖨 학습지"·"🎲 새 문제로 한 장 더" 둘 다 이 함수 하나로
           충분하다(2026-09-04 원장 지시 "웹페이지 들어가면 추가로 계속 인쇄"). */
        function doPrintSession(courseKey, sessionIdx){
          const course = NM_COURSES[courseKey];
          const session = course && course.sessions && course.sessions[sessionIdx];
          if(!session) return;
          const raw = session.test ? (session.pool||[]) : (session.drills||[]);
          const items = raw.map(d => ({
            thread: d.t, level: d.lv, n: d.n,
            wordType: roadWordType,
            seed: NM_RNG.newCode(),
          }));
          if(!items.length) return;
          const off = courseStartOffset(courseKey);
          const cal = (off===null) ? '' : calLabelFor(off+sessionIdx)+' · ';
          /* "발송 말고 고를 때는 제너레이터로"(2026-09-05) — 여기서는 더 이상
             바로 인쇄하지 않는다. 편집기를 열고, 실제 인쇄 횟수 갱신은 편집기의
             🖨 인쇄 버튼을 눌렀을 때(opts.onPrint)만 센다. */
          NM_EXAM.openPrintEditor(items, `${cal}${courseKey}-S${sessionIdx+1}`, {
            mixed: roadCountMode, courseKey,
            onPrint: () => { if(opts.onPrinted) opts.onPrinted(printKey(courseKey, sessionIdx)); rerenderKeepScroll(); },
          });
        }

        container.querySelectorAll('.nm-ex-road-print-btn, .nm-ex-road-reprint-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            doPrintSession(btn.dataset.course, parseInt(btn.dataset.session, 10));
          });
        });

        /* 화면으로 풀기(학습지-v2-설계.md §3) — 세션의 드릴을 유형별 탭으로 열고,
           탭마다 채점 뒤에도 "새 문제로 다시"가 항상 보인다. 뒤로 가면 이 화면
           (세션 목록)으로 돌아온다. */
        function doSolveOnline(courseKey, sessionIdx){
          const course = NM_COURSES[courseKey];
          const session = course && course.sessions && course.sessions[sessionIdx];
          if(!session) return;
          const raw = session.test ? (session.pool||[]) : (session.drills||[]);
          const items = raw.map(d => ({
            thread: d.t, level: d.lv,
            wordType: roadWordType,
            seed: NM_RNG.newCode(),
          }));
          if(!items.length) return;
          runSessionTabs(container, items, {
            title: `${courseKey} · S${sessionIdx+1}`,
            count: roadCountMode,
            onBack: () => { render(); }
          });
        }
        container.querySelectorAll('.nm-ex-road-online-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            doSolveOnline(btn.dataset.course, parseInt(btn.dataset.session, 10));
          });
        });

        const thisWeekBtn = container.querySelector('#nm-road-thisweek');
        if(thisWeekBtn) thisWeekBtn.addEventListener('click', () => {
          if(!opts.currentCourse) return;
          doPrintSession(opts.currentCourse, 0);
        });

        if(!scrolledOnce && opts.currentCourse){
          scrolledOnce = true;
          const cur = container.querySelector(`[data-course-wrap="${opts.currentCourse}"]`);
          if(cur && cur.scrollIntoView) cur.scrollIntoView({ block: 'center' });
        }
      }
      render();
    }

    /* ── 과정(영역)별 코스 구성: GRADES에서 스레드 접두사로 묶어 파생 ── */
    const COURSE_DEFS = [
      {key:'AD', emoji:'➕', label:'덧셈',        desc:'한 자리부터 네 자리까지'},
      {key:'SB', emoji:'➖', label:'뺄셈',        desc:'받아내림·빼기 전략'},
      {key:'ML', emoji:'✖️', label:'곱셈',        desc:'구구단부터 거듭제곱까지'},
      {key:'DV', emoji:'➗', label:'나눗셈',      desc:'나머지·약수·소인수분해'},
      {key:'FR', emoji:'🍕', label:'분수',        desc:'동분모부터 곱나눗셈까지'},
      {key:'DC', emoji:'🔢', label:'소수',        desc:'덧뺄셈·곱나눗셈'},
      {key:'NS', emoji:'🎲', label:'수 감각',     desc:'모으기·가르기·보수'},
      {key:'MX', emoji:'🧩', label:'혼합·중등 준비', desc:'혼합계산·제곱근·비율'},
    ];
    function buildCourse(prefix){
      const items = [], seen = {};
      GRADE_ORDER.forEach(gk => {
        GRADES[gk].subs.forEach(s => {
          if(!s.thread || !s.thread.startsWith(prefix)) return;
          const id = s.thread + '-L' + s.level;
          if(seen[id]) return;
          seen[id] = true;
          items.push(Object.assign({}, s, {grade:gk}));
        });
      });
      return items;
    }

    let pickMode = 'grade'; // 'grade' | 'course'

    function showGradePick(){
      const isGrade = pickMode==='grade';
      container.innerHTML = `
<div class="nm-ex-form-wrap">
  <div class="nm-ex-form-head">
    <button class="nm-ex-back-btn" id="nm-ex-back-grade">← 뒤로</button>
    <span class="nm-ex-form-title">교과 연산 연습</span>
    <div class="nm-ws-tabs nm-ex-mode-tabs">
      <button class="nm-ws-tab${isGrade?' active':''}" data-mode="grade">학년·학기별</button>
      <button class="nm-ws-tab${!isGrade?' active':''}" data-mode="course">과정별</button>
    </div>
  </div>
  <div class="nm-ex-form-body">
    ${isGrade ? `
    <div class="nm-ex-grade-grid">
      ${GRADE_ORDER.map(g => `
      <button class="nm-ex-grade-btn${g==='PRE'?' nm-ex-grade-pre':''}" data-grade="${g}">
        <span class="nm-ex-grade-key">${GRADES[g].emoji} ${g==='PRE'?'Pre':g}</span>
        <span class="nm-ex-grade-sub">${GRADES[g].label}</span>
      </button>`).join('')}
    </div>` : `
    <div class="nm-ex-grade-grid nm-ex-course-grid">
      ${COURSE_DEFS.map(c => `
      <button class="nm-ex-grade-btn" data-course="${c.key}">
        <span class="nm-ex-grade-key">${c.emoji} ${c.label}</span>
        <span class="nm-ex-grade-sub">${c.desc}</span>
      </button>`).join('')}
    </div>`}
  </div>
</div>`;
      container.querySelector('#nm-ex-back-grade').addEventListener('click', showSectionPick);
      container.querySelectorAll('.nm-ex-mode-tabs .nm-ws-tab').forEach(btn => {
        btn.addEventListener('click', () => { pickMode = btn.dataset.mode; showGradePick(); });
      });
      container.querySelectorAll('[data-grade]').forEach(btn => {
        btn.addEventListener('click', () => {
          const g = GRADES[btn.dataset.grade];
          showTopics({
            title: `${g.emoji} ${btn.dataset.grade==='PRE'?'':btn.dataset.grade+' — '}${g.label}`,
            subs: g.subs,
            gradeKey: btn.dataset.grade,   /* 인쇄 조판을 연령에 맞추려고 넘긴다 */
          });
        });
      });
      container.querySelectorAll('[data-course]').forEach(btn => {
        btn.addEventListener('click', () => {
          const c = COURSE_DEFS.find(x => x.key===btn.dataset.course);
          showTopics({
            title: `${c.emoji} ${c.label} 과정`,
            subs: buildCourse(c.key),
            showGrade: true,
          });
        });
      });
    }

    /* ── 주제 선택 화면 (학년별·과정별 공용) ──
       문항 수 + 유형(숫자/문장제) + 하단 실시간 미리보기 */
    const WORD_OPTS = [
      {key:'none', label:'숫자 연산'},
      {key:'mix',  label:'문장제 섞기'},
      {key:'all',  label:'문장제만'},
    ];
    function showTopics(opts){
      const subs = opts.subs;
      let selIdx = 0;
      let chosenCount = 20;
      let wordType = 'none';
      let previewSeed = NM_RNG.newCode();

      function makeConfig(){
        const sub = subs[selIdx];
        return {
          thread:   sub.thread,
          level:    sub.level,
          count:    chosenCount,
          timer:    0,
          seed:     NM_RNG.newCode(),
          layout:   'grid',
          label:    sub.label,
          concept:  sub.concept || '',
          wordType: wordType,
          /* 과정별 목록은 항목마다 grade를 갖고, 학년별 목록은 화면 전체가 한 학년이다 */
          grade:    sub.grade || opts.gradeKey || null,
        };
      }

      function previewCells(){
        const sub = subs[selIdx];
        const nSeed = NM_RNG.hashSeed(previewSeed);
        const probs = buildProblems(sub.thread, sub.level, 4, nSeed);
        applyWordProblems(probs, wordType, nSeed);
        return probs.map((p,i) => {
          let inner;
          if(p.word){
            const pvAsk = pickL(p.wordAsk);
            inner = `<div class="nm-vp-word nm-vp-word-sm">${esc(pickL(p.word))}${pvAsk ? ' ' + esc(pvAsk) : ''}</div>`;
          } else {
            const v = parseVert(p.tex);
            inner = v
              ? `<div class="nm-vp nm-vp-sm">
                   <div class="nm-vp-row nm-vp-top">${esc(v.a)}</div>
                   <div class="nm-vp-row nm-vp-mid"><span class="nm-vp-op">${esc(v.op)}</span><span class="nm-vp-b">${esc(v.b)}</span></div>
                   <div class="nm-vp-line"></div>
                   <div class="nm-vp-row nm-vp-bot">&nbsp;</div>
                 </div>`
              : `<div class="nm-vp-tex" data-tex="${esc(p.tex||'')}"></div>`;
          }
          return `<div class="nm-ws-cell nm-ws-cell-sm${p.word?' nm-ws-wide':''}">
            <span class="nm-ws-cnum">${circled(i+1)}</span>${inner}
          </div>`;
        }).join('');
      }

      function render(){
        const sub = subs[selIdx];
        const isComingSoon = !!sub.comingSoon;
        const bodyHtml = isComingSoon ? `
    <div class="nm-ex-comingsoon">
      <div class="nm-ex-comingsoon-badge">🚧 문제 생성기 준비 중</div>
      <p class="nm-ex-comingsoon-desc">실제 교재 목차를 확인해 주제명은 정확하지만,
        이 단원은 아직 문제를 자동으로 만드는 생성기가 없어서 온라인/인쇄 문제를 낼 수 없어요.
        아래는 이 단원에서 배우는 내용이에요.</p>
      <div class="nm-grid-concept-body nm-ex-comingsoon-concept">${esc(sub.concept||'').replace(/\n/g,'<br>')}</div>
    </div>` : `
    <p class="nm-ex-label" style="margin-top:18px">문항 수</p>
    <div class="nm-ex-count-btns">
      ${COUNT_OPTS.map(n => `<button class="nm-ex-cnt-btn${n===chosenCount?' sel':''}" data-n="${n}">${n}문항</button>`).join('')}
    </div>
    <p class="nm-ex-label" style="margin-top:18px">문제 유형</p>
    <div class="nm-ex-count-btns">
      ${WORD_OPTS.map(w => `<button class="nm-ex-cnt-btn${w.key===wordType?' sel':''}" data-w="${w.key}">${w.label}</button>`).join('')}
    </div>
    ${coverToggleRowHtml()}
    <div class="nm-ex-actions" style="margin-top:10px">
      <button id="nm-ex-grid-start" class="nm-ex-btn-primary">▶ 온라인으로 풀기</button>
      <button id="nm-ex-print-start" class="nm-ex-btn-secondary">🖨️ 인쇄하여 풀기</button>
    </div>
    <div class="nm-ex-preview">
      <div class="nm-ex-preview-hd">
        <span class="nm-ex-label" style="margin:0">👀 미리보기</span>
        <button id="nm-ex-preview-dice" class="nm-ex-btn-ghost">🎲 다른 문제</button>
      </div>
      <div class="nm-ws-grid nm-ws-grid-preview">${previewCells()}</div>
    </div>`;

        container.innerHTML = `
<div class="nm-ex-form-wrap">
  <div class="nm-ex-form-head">
    <button class="nm-ex-back-btn" id="nm-ex-back-topics">← 뒤로</button>
    <span class="nm-ex-form-title">${opts.title}</span>
  </div>
  <div class="nm-ex-form-body">
    <p class="nm-ex-label">주제 선택</p>
    <div class="nm-ex-grade-topics">
      ${(() => {
        const chip = (s,i) => `
      <button class="nm-ex-topic-chip${i===selIdx?' nm-ex-topic-sel':''}${s.comingSoon?' nm-ex-topic-soon':''}${s.magic?' nm-ex-topic-magic':''}" data-idx="${i}">
        ${opts.showGrade && s.grade ? `<span class="nm-ex-tchip-grade">${s.grade==='PRE'?'Pre':s.grade}</span>` : ''}
        <span class="nm-ex-tchip-name">${s.magic?'✨ ':''}${esc(s.label)}</span>
        <span class="nm-ex-tchip-desc">${s.comingSoon?'🚧 준비중':esc(s.desc)}</span>
      </button>`;
        const core  = subs.map((s,i)=>({s,i})).filter(x=>!x.s.magic);
        const magic = subs.map((s,i)=>({s,i})).filter(x=>x.s.magic);
        return core.map(x=>chip(x.s,x.i)).join('')
          + (magic.length ? `<div class="nm-ex-topics-label">✨ 연산 마법 — 계산이 빨라지는 전략</div>`
              + magic.map(x=>chip(x.s,x.i)).join('') : '');
      })()}
    </div>
    ${bodyHtml}
  </div>
</div>`;

        container.querySelectorAll('.nm-vp-tex').forEach(el => renderKaTeX(el.dataset.tex||'', el));

        container.querySelector('#nm-ex-back-topics').addEventListener('click', showGradePick);

        container.querySelectorAll('.nm-ex-topic-chip').forEach(chip => {
          chip.addEventListener('click', () => { selIdx = parseInt(chip.dataset.idx); render(); });
        });

        if(isComingSoon) return;

        container.querySelectorAll('[data-n]').forEach(btn => {
          btn.addEventListener('click', () => { chosenCount = parseInt(btn.dataset.n); render(); });
        });
        container.querySelectorAll('[data-w]').forEach(btn => {
          btn.addEventListener('click', () => { wordType = btn.dataset.w; render(); });
        });
        container.querySelector('#nm-ex-preview-dice').addEventListener('click', () => {
          previewSeed = NM_RNG.newCode(); render();
        });
        bindCoverToggle(container);

        container.querySelector('#nm-ex-grid-start').addEventListener('click', () => {
          onStart && onStart(makeConfig());
        });
        container.querySelector('#nm-ex-print-start').addEventListener('click', () => {
          const cfg = makeConfig();
          NM_EXAM.openPrintEditor([{ thread: cfg.thread, level: cfg.level, wordType: cfg.wordType,
            seed: cfg.seed, topicName: cfg.topicName, grade: cfg.grade }], cfg.label, { count: cfg.count });
        });
      }
      render();
    }

    function showMagicForm(){
      const threadKeys = Object.keys(threads);
      let currentSeed = NM_RNG.newCode();

      function refreshLevels(){
        const t = threads[threadSel.value] || {};
        levelSel.innerHTML = (t.levels || [{id:1,label:{ko:'기본'}}]).map(l =>
          `<option value="${l.id}">${l.id} — ${esc((l.label||{}).ko||'')}</option>`
        ).join('');
        refreshCode();
      }
      function refreshCode(){
        codePreview.textContent = NM_EXAM.worksheetCode({
          thread: threadSel.value,
          level:  parseInt(levelSel.value)||1,
          count:  parseInt(container.querySelector('#nm-ex-count').value)||20,
          seed:   currentSeed,
        });
      }
      function getConfig(){
        return {
          thread: threadSel.value,
          level:  parseInt(levelSel.value)||1,
          count:  parseInt(container.querySelector('#nm-ex-count').value)||20,
          timer:  0,
          seed:   currentSeed,
          layout: 'grid',
          label:  threadSel.value,
        };
      }

      container.innerHTML = `
<div class="nm-ex-form-wrap">
  <div class="nm-ex-form-head">
    <button class="nm-ex-back-btn" id="nm-ex-back-magic">← 뒤로</button>
    <span class="nm-ex-form-title">✨ 수의 마법 탐험</span>
  </div>
  <div class="nm-ex-form-body">
    <div class="nm-ex-form-row">
      <label class="nm-ex-label">스레드</label>
      <select class="nm-ex-select" id="nm-ex-thread">
        ${threadKeys.map(k=>`<option value="${k}">${k} — ${esc((threads[k].name||{}).ko||k)}</option>`).join('')}
      </select>
    </div>
    <div class="nm-ex-form-row">
      <label class="nm-ex-label">레벨</label>
      <select class="nm-ex-select" id="nm-ex-level"></select>
    </div>
    <div class="nm-ex-form-row">
      <label class="nm-ex-label">문항 수</label>
      <select class="nm-ex-select" id="nm-ex-count">
        ${[10,15,20,25,30,40,50].map(n=>`<option value="${n}"${n===20?' selected':''}>${n}</option>`).join('')}
      </select>
    </div>
    <div class="nm-ex-code-row">
      코드: <code id="nm-ex-code-preview"></code>
      <button id="nm-ex-new-seed" class="nm-ex-btn-ghost">🎲 새 코드</button>
    </div>
    ${coverToggleRowHtml()}
    <div class="nm-ex-actions">
      <button id="nm-ex-start" class="nm-ex-btn-primary">▶ 학습지 시작</button>
      <button id="nm-ex-print" class="nm-ex-btn-secondary">🖨️ 인쇄</button>
    </div>
  </div>
</div>`;

      const threadSel   = container.querySelector('#nm-ex-thread');
      const levelSel    = container.querySelector('#nm-ex-level');
      const codePreview = container.querySelector('#nm-ex-code-preview');

      container.querySelector('#nm-ex-back-magic').addEventListener('click', showSectionPick);
      threadSel.addEventListener('change', refreshLevels);
      levelSel.addEventListener('change', refreshCode);
      container.querySelector('#nm-ex-count').addEventListener('change', refreshCode);
      container.querySelector('#nm-ex-new-seed').addEventListener('click', () => {
        currentSeed = NM_RNG.newCode(); refreshCode();
      });
      bindCoverToggle(container);
      container.querySelector('#nm-ex-start').addEventListener('click', () => {
        onStart && onStart(getConfig());
      });
      container.querySelector('#nm-ex-print').addEventListener('click', () => {
        const cfg = getConfig();
        NM_EXAM.openPrintEditor([{ thread: cfg.thread, level: cfg.level, seed: cfg.seed }],
          cfg.label, { count: cfg.count });
      });

      refreshLevels();
    }

    showSectionPick();
  },

  /* ── 2. 시험 실행 (순차) ── */
  runExam(config, container, onDone){
    const { thread, level, count, timer, seed, wordType, overrides } = config;
    const numericSeed = NM_RNG.hashSeed(seed);
    const problems = buildProblems(thread, level, count, numericSeed, overrides);
    /* 문장제 유형 — 인쇄(renderPrint)만 적용되고 화면 풀이는 빠져 있던 것을 통일
       (2026-08-31, 문제은행에서 문장제 선택 지원). 렌더는 아래 p.word 분기가 이미 처리. */
    applyWordProblems(problems, wordType, numericSeed);
    const answers  = new Array(count).fill(null);
    let current    = 0;
    let startTime  = Date.now();
    let timerInterval = null;
    let timeLeft   = timer > 0 ? timer : Infinity;

    function render(){
      const p = problems[current];
      const pct = Math.round(((current)/count)*100);
      /* 답이 여러 칸인 유형(분수 [분자,분모], 단항식 [계수,지수] 등)은 "8, 9"처럼
         쉼표로 받는다 — 그런데 입력칸이 type=number라 쉼표를 아예 칠 수가 없어서
         화면으로는 영원히 못 맞히는 상태였다(2026-08-28 발견, 99개 레벨).
         인쇄용 그리드 학습지는 이미 이렇게 처리하고 있어 같은 방식을 맞춘다. */
      const isMulti = Array.isArray(p.answer);
      /* type=number를 쓰지 않는 이유: 소수점을 찍는 순간 "3."이 잘못된 수라
         브라우저가 값을 통째로 비워 버려 숫자패드의 소수점 키가 동작하지 않는다.
         text + inputmode=decimal이면 모바일 숫자 자판은 그대로 뜨고 값도 남는다.
         비교는 어차피 parseFloat/matchesAnswer가 한다. */
      container.innerHTML = `
<div class="nm-exam-run">
  <div class="nm-exam-header">
    <div class="nm-exam-progress">
      <div class="nm-progress-bar" style="width:${pct}%"></div>
    </div>
    <div class="nm-exam-info">
      <span class="nm-q-counter">${current+1} / ${count}</span>
      ${timer>0?`<span class="nm-timer" id="nm-ex-timer-disp">⏱ ${fmtTime(timeLeft)}</span>`:''}
    </div>
  </div>
  <div class="nm-exam-question">
    ${p.word ? `<div class="nm-ex-word">${esc(pickL(p.word))}</div>
    ${pickL(p.wordAsk) ? `<div class="nm-ex-wordask">${esc(pickL(p.wordAsk))}</div>` : ''}
    ${p.wordEqn ? `<div class="nm-ex-word-eq">${esc(pickL(p.wordEqn))}</div>` : ''}
    ${pickChoices(p)
      ? `<ol class="nm-ex-choices">${pickChoices(p).map(c => `<li>${esc(c)}</li>`).join('')}</ol>` : ''}`
    : `<div class="nm-q-tex" id="nm-ex-qtex"></div>
    ${pickL(p.prompt) ? `<p class="nm-q-hint">${esc(pickL(p.prompt))}</p>` : ''}`}
  </div>
  <div class="nm-exam-input">
    <input id="nm-ex-ans" type="text" inputmode="decimal"
           placeholder="${isMulti ? lk('예: 3, 5','e.g. 3, 5','例：3, 5')
              : (pickChoices(p) ? lk('보기 번호','Choice number','选项序号') : lk('답 / Answer','Answer','答案'))}" autocomplete="off">
    <button id="nm-ex-submit" class="nm-btn nm-btn-primary">${lk('확인 ✓','OK ✓','确定 ✓')}</button>
  </div>
  <div class="nm-exam-nav">
    <button id="nm-ex-prev" class="nm-btn nm-btn-small" ${current===0?'disabled':''}>${lk('← 이전','← Back','← 上一题')}</button>
    <button id="nm-ex-skip" class="nm-btn nm-btn-small">${lk('건너뛰기 →','Skip →','跳过 →')}</button>
  </div>
</div>`;

      /* 문장제는 tex가 없다 — 위에서 문장을 직접 그렸으므로 수식 칸도 없다 */
      if(!p.word) renderKaTeX((p.tex||''), $('#nm-ex-qtex', container));

      const input = $('#nm-ex-ans', container);
      if(answers[current] !== null){ input.value = answers[current]; }
      input.focus();

      $('#nm-ex-submit', container).addEventListener('click', submitAnswer);
      input.addEventListener('keydown', e => { if(e.key==='Enter') submitAnswer(); });
      $('#nm-ex-prev',   container).addEventListener('click', () => { current--; render(); });
      $('#nm-ex-skip',   container).addEventListener('click', () => { current++; if(current>=count) finish(); else render(); });
    }

    function submitAnswer(){
      const raw = $('#nm-ex-ans', container).value;
      if(Array.isArray(problems[current].answer)){
        /* 여러 칸 답은 문자열 그대로 둔다 — matchesAnswer가 쉼표로 갈라 비교한다.
           parseInt를 태우면 "8, 9"가 8이 되어 항상 오답이 된다. */
        if(String(raw).trim() !== '') answers[current] = raw;
      } else {
        /* parseFloat — 소수 답(DC4·DC5·FR12: 6.8, 136.65 …)이 parseInt에서
           6으로 잘려 늘 오답이 됐다. matchesAnswer도 parseFloat를 쓴다. */
        const v = parseFloat(raw);
        if(!isNaN(v)){ answers[current] = v; }
      }
      current++;
      if(current >= count){ finish(); }
      else { render(); }
    }

    function finish(){
      clearInterval(timerInterval);
      const elapsed = Math.round((Date.now()-startTime)/1000);
      let score = 0;
      problems.forEach((p,i)=>{ if(matchesAnswer(answers[i],p.answer)) score++; });
      onDone && onDone({ score, total:count, time:elapsed, problems, answers, seed, thread, level });
    }

    function fmtTime(s){
      if(!isFinite(s)) return '';
      const m=Math.floor(s/60), sec=s%60;
      return `${m}:${String(sec).padStart(2,'0')}`;
    }

    if(timer > 0){
      timerInterval = setInterval(()=>{
        timeLeft--;
        const el = document.getElementById('nm-ex-timer-disp');
        if(el) el.textContent = `⏱ ${fmtTime(timeLeft)}`;
        if(timeLeft <= 0){ clearInterval(timerInterval); finish(); }
      }, 1000);
    }

    render();
  },

  /* ── 3. 결과 화면 ── */
  renderResult(result, container, onReplay){
    const { score, total, time, problems, answers, seed, thread, level } = result;
    const pct = Math.round(score/total*100);
    const passed = pct >= 80;
    const m = Math.floor(time/60), sec = time%60;

    const wrongs = problems.map((p,i)=>({p,i,myAns:answers[i]}))
                           .filter(x=>!matchesAnswer(x.myAns,x.p.answer));

    container.innerHTML = `
<div class="nm-exam-result">
  <div class="nm-result-score ${passed?'nm-pass':'nm-fail'}">
    <div class="nm-score-num">${score} / ${total}</div>
    <div class="nm-score-pct">${pct}%</div>
    <div class="nm-score-label">${passed?'✅ 통과! Pass!':'❌ 재시험 Retry'}</div>
    <div class="nm-score-time">⏱ ${m}:${String(sec).padStart(2,'0')}</div>
  </div>
  ${wrongs.length===0 ? '<p class="nm-result-perfect">🎉 전부 맞혔어요! Perfect score!</p>' : `
  <div class="nm-result-wrongs">
    <h3>오답 목록 / Wrong Answers</h3>
    <table class="nm-result-table">
      <thead><tr><th>#</th><th>문제</th><th>내 답</th><th>정답</th></tr></thead>
      <tbody>
        ${wrongs.map(w=>`<tr>
          <td>${w.i+1}</td>
          <td class="nm-rtex" data-tex="${esc(w.p.tex||'')}"></td>
          <td class="nm-wrong-ans">${w.myAns??'—'}</td>
          <td class="nm-correct-ans">${ansHtml(w.p)}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`}
  <div class="nm-result-actions">
    <button id="nm-res-retry-wrong" class="nm-btn nm-btn-primary" ${wrongs.length===0?'disabled':''}>
      📖 오답만 다시
    </button>
    <button id="nm-res-new" class="nm-btn nm-btn-secondary">🎲 새 시험</button>
    <button id="nm-res-print" class="nm-btn nm-btn-secondary">🖨️ 학습지 인쇄</button>
  </div>
  <div class="nm-result-code">학습지 코드: <code>${NM_EXAM.worksheetCode({thread,level,count:total,seed})}</code></div>
</div>`;

    $$('.nm-rtex', container).forEach(el => {
      renderKaTeX(el.dataset.tex || '', el);
    });
    $$('.nm-ans-tex', container).forEach(el => {
      renderKaTeX(el.dataset.tex || '', el);
    });

    $('#nm-res-new', container).addEventListener('click', () => {
      onReplay && onReplay({mode:'new', thread, level, count:total});
    });

    $('#nm-res-print', container).addEventListener('click', () => {
      // 결과 화면의 🖨도 바로 인쇄하지 않고 편집기를 거친다(원장 지시 2026-09-05: 고를 때는 제너레이터로).
      NM_EXAM.openPrintEditor([{ thread, level, seed }], `${thread}-L${level}`, { count: total });
    });

    $('#nm-res-retry-wrong', container).addEventListener('click', () => {
      if(wrongs.length===0) return;
      onReplay && onReplay({mode:'wrongs', wrongs, thread, level});
    });
  },

  /* ── 4. 인쇄 학습지 ── */
  /* 학습지 v2 — 단일 유형(교과/마법 흐름)도 회차 렌더러 하나로 나간다(§5
     "renderPrint는 같은 회차 렌더러를 쓰되 옵션이 바뀌지 않는다"). */
  renderPrint(config){
    const { thread, level, count, seed, wordType } = config;
    const item = { thread, level, wordType, seed, topicName: config.topicName, grade: config.grade };
    const round = renderRoundPages(item, { count });

    const old = document.querySelector('.nm-print-sheet');
    if(old) old.remove();

    const sheet = document.createElement('div');
    sheet.className = 'nm-print-sheet nm-print-age-' + printAgeBand(config, round.problems);
    sheet.setAttribute('aria-hidden', 'true');
    /* 줄바꿈 규칙이 언어마다 다르다(인쇄 CSS의 [lang=] 절 참조) — 시트에 박아 둔다 */
    sheet.setAttribute('lang', examLang());

    const coverHtml = getCoverOn() ? coverPageHtml([config], round.code, count) : '';

    sheet.innerHTML = `
${printWatermarkHtml()}
${coverHtml}
${round.html}
<div class="nm-print-answer-key">
  <h3 style="margin:0 0 8px 0">${esc(answerKeyTitle())} — <span style="font-family:monospace;font-size:0.85em">${esc(round.code)}</span></h3>
  <div class="nm-ak-grid">${w2GuidedAnswerKeyHtml(round.guidedProblems)}${w2AnswerKeyItemsHtml(round.problems)}</div>
</div>`;

    document.body.appendChild(sheet);

    sheet.querySelectorAll('.nm-w2-tex, .nm-cp-tex').forEach(el => renderKaTeX(el.dataset.tex||'', el));

    if(!window.NM_NO_AUTOPRINT) setTimeout(() => { window.print(); }, 350);
  },

  /* ── 4b. 혼합 학습지 인쇄(편지함 봉투용) ──────────────────────
     items: [{thread,level,count,seed,label?}] — 한 봉투에 담긴 여러 드릴을
     한 번의 인쇄로 이어붙인다(과정-로드맵.md §12 "혼합 학습지"). 문항 생성·
     정답 렌더링은 renderPrint의 단일 항목 로직을 그대로 재사용하고, 항목별로
     자기 학습지 코드(#THREAD-Lx-COUNTxSEED)를 그대로 갖는다 — 기존 ?ws=
     도우미 화면이 그 코드를 이미 그대로 이해하므로 새 규약이 필요 없다.
     envelopeCode는 표지에만 쓰는 표시용 라벨(예: W2026-W35-C4).

     opts.mixed(양수) — 로드맵 세션 인쇄(2026-09-04 원장 지시 "한 페이지에 20문제씩")가
     쓰는 새 경로. 드릴별 문항 수(count)를 그대로 쓰지 않고 items의 가중치(n·count·
     weight 중 있는 값)에 비례해 목표 총량(10/20/40)으로 다시 나눈 뒤, 한 세션을
     페이지당 20문항(문장제만이면 10문항) 그리드 한 장으로 합쳐 찍는다 — 예전처럼
     드릴마다 새 페이지가 시작되지 않는다. 편지함 봉투 인쇄도 같은 함수를 타므로
     opts.mixed를 넘기면 그대로 이 경로를 쓴다(넘기지 않으면 아래의 예전 방식 그대로). */
  renderPrintMulti(items, envelopeCode, opts){
    if(!items || !items.length) return;
    const old = document.querySelector('.nm-print-sheet');
    if(old) old.remove();

    if(opts && opts.mixed){
      renderMixedSheet(items, envelopeCode, opts);
      return;
    }

    const built = items.map(cfg => {
      const numericSeed = NM_RNG.hashSeed(cfg.seed);
      const problems = buildProblems(cfg.thread, cfg.level, cfg.count, numericSeed);
      applyWordProblems(problems, cfg.wordType, numericSeed);
      const code = NM_EXAM.worksheetCode(cfg);
      const th = (window.NM_THREADS || {})[cfg.thread] || {};
      return { cfg, problems, code, thName: pickL(cfg.topicName) || pickL(th.name) || cfg.thread };
    });

    const sheet = document.createElement('div');
    sheet.className = 'nm-print-sheet nm-print-age-'
      + printAgeBand(items[0], built[0] && built[0].problems);
    sheet.setAttribute('aria-hidden', 'true');
    sheet.setAttribute('lang', examLang());

    const coverHtml = getCoverOn() ? coverPageHtml(items, envelopeCode,
      items.reduce((sum,it) => sum + (it.count||0), 0)) : '';
    const conceptHtml = getConceptPageOn()
      ? conceptPageHtml(items.map(it => ({thread:it.thread, level:it.level})), envelopeCode)
      : '';

    const sectionsHtml = built.map((b,i) => `
<div class="nm-print-header"${i>0 ? ' style="page-break-before:always"' : ''}>
  <h2 style="margin:0">Numbers of Magic — ${esc(worksheetTitle(b.thName))}</h2>
  <div style="display:flex;gap:24px;margin-top:8px;font-size:0.9em">
    ${printMetaFieldsHtml(b.cfg.count)}
    ${qrHeaderBlockHtml(b.code, hasConceptFor(b.cfg.thread, b.cfg.level))}
  </div>
</div>
<div class="nm-print-grid" id="nm-print-problems-${i}"></div>`).join('');

    const answerSectionsHtml = built.map((b,i) => `
<div class="nm-print-answer-key">
  <h3 style="margin:0 0 8px 0">${esc(answerKeyTitle())} — ${esc(b.thName)} <span style="font-family:monospace;font-size:0.85em">${esc(b.code)}</span></h3>
  <div class="nm-ak-grid" id="nm-print-answers-${i}"></div>
</div>`).join('');

    sheet.innerHTML = `
${printWatermarkHtml()}
${coverHtml}
${conceptHtml}
<div class="nm-print-header">
  <h2 style="margin:0">Numbers of Magic — 📬 ${esc(envelopeCode||'')}</h2>
  <div style="display:flex;gap:24px;margin-top:8px;font-size:0.9em">
    ${printMetaFieldsHtml(null)}
  </div>
</div>
${sectionsHtml}
${answerSectionsHtml}`;

    document.body.appendChild(sheet);
    sheet.querySelectorAll('.nm-cp-tex').forEach(el => renderKaTeX(el.dataset.tex||'', el));

    built.forEach((b,i) => {
      const problemGrid = sheet.querySelector(`#nm-print-problems-${i}`);
      const answerGrid  = sheet.querySelector(`#nm-print-answers-${i}`);
      fillPrintGrid(b.problems, problemGrid, answerGrid, { bond: !!BOND_THREADS[b.cfg.thread] });
    });

    if(!window.NM_NO_AUTOPRINT) setTimeout(() => { window.print(); }, 350);
  },

  /* ── 5. 인쇄 미리보기 편집기 ──────────────────────────────────
     "발송 말고 고를 때는 제너레이터로 바뀌도록"(원장 지시 2026-09-05) — 학습지의
     모든 인쇄 진입점은 이제 여기를 거친다. 실제 window.print()는 이 화면의
     🖨 인쇄 버튼(아래 #nm-pe-print)에서만 일어난다. 문항은 이미 있는 생성기
     (buildProblems)가 그대로 만들고, 이 화면은 그 결과를 보여주며 슬롯 하나(🔄)·
     회차 하나(🎲/유형 바꾸기)·전체(🎲 전체 새 문제)를 다시 만들 수 있게 한다.
     items: [{thread, level, wordType?, seed, topicName?, overrides?, guideSeed?}, ...]
     label: 표지·머리띠에 쓰이는 라벨(예: "AD5-S1", "9월 2주차 · C4-S1").
     opts: {mixed?:10|20|40(유형당 문항 수) · count?:같은 뜻(단일 유형 흐름) ·
            courseKey?:그룹 드롭다운 ①에 쓸 과정 키 · onPrint?:🖨 인쇄를 실제로
            눌렀을 때 호출(인쇄 횟수 갱신 등, 인자 없음)}. */
  openPrintEditor(items, label, opts){
    opts = opts || {};
    const old = document.getElementById('nm-pe-overlay');
    if(old) old.remove();
    if(!items || !items.length) return;

    let rounds = items.map(it => ({
      thread: it.thread, level: it.level, wordType: it.wordType || 'none',
      seed: it.seed || NM_RNG.newCode(),
      topicName: it.topicName, grade: it.grade,
      overrides: Object.assign({}, it.overrides || {}),
      guideSeed: it.guideSeed || null,
    }));

    /* 편집기 툴바는 유형당 문항 수를 10/20/40 세 개로만 제공한다(§build 3). 그 밖의
       값(예: 교과 흐름의 15/25/30/50)이 넘어오면 가장 가까운 값으로 맞춘다 —
       조용히 20으로 되돌리면 사용자가 고른 값과 너무 멀어질 수 있다. */
    const rawCount = ([10,20,40].indexOf(opts.mixed) >= 0) ? opts.mixed
      : (typeof opts.count === 'number') ? opts.count : 20;
    let perTypeCount = [10,20,40].reduce((best, n) =>
      Math.abs(n - rawCount) < Math.abs(best - rawCount) ? n : best, 20);
    let coverOn = getCoverOn();

    /* 그룹 드롭다운(①이 과정의 유형 ②복습 — 이전 과정 유형 ③전체) — courses.js·
       threads.js를 전역에서 직접 읽는다(showRoadPick 클로저 밖에서도 호출될 수
       있으므로 opts.courseKey 문자열만 받는다). */
    function threadName(t){ return pickL(((window.NM_THREADS||{})[t]||{}).name) || t; }
    function levelLabelOf(t, lv){
      const th = (window.NM_THREADS||{})[t] || {};
      const l = (th.levels||[]).find(x => x.id === lv);
      return (l && l.label) ? (pickL(l.label) || ('Lv.'+lv)) : ('Lv.'+lv);
    }
    function defaultLevelOf(t){
      const th = (window.NM_THREADS||{})[t] || {};
      return (th.levels && th.levels[0]) ? th.levels[0].id : 1;
    }
    function courseDrillList(courseKey){
      const c = (window.NM_COURSES||{})[courseKey]; if(!c) return [];
      const seen = {}, out = [];
      (c.sessions||[]).forEach(s => {
        (s.test ? (s.pool||[]) : (s.drills||[])).forEach(d => {
          const key = d.t+'-L'+d.lv;
          if(seen[key]) return; seen[key] = true;
          out.push({t:d.t, lv:d.lv});
        });
      });
      return out;
    }
    function reviewDrillList(courseKey){
      const COURSES = window.NM_COURSES || {};
      const cur = COURSES[courseKey]; if(!cur) return [];
      const seen = {}, out = [];
      Object.keys(COURSES).forEach(k => {
        const c = COURSES[k];
        if(!c || (c.order||0) >= (cur.order||0)) return;
        (c.sessions||[]).forEach(s => {
          (s.test ? (s.pool||[]) : (s.drills||[])).forEach(d => {
            const key = d.t+'-L'+d.lv;
            if(seen[key]) return; seen[key] = true;
            out.push({t:d.t, lv:d.lv});
          });
        });
      });
      return out;
    }
    const PE_GROUPS = [
      {prefixes:['NS','AD'], label:{ko:'수와 덧셈',en:'Number & Addition',zh:'数与加法'}},
      {prefixes:['SB'],      label:{ko:'뺄셈',en:'Subtraction',zh:'减法'}},
      {prefixes:['ML'],      label:{ko:'곱셈',en:'Multiplication',zh:'乘法'}},
      {prefixes:['DV'],      label:{ko:'나눗셈',en:'Division',zh:'除法'}},
      {prefixes:['FR'],      label:{ko:'분수',en:'Fractions',zh:'分数'}},
      {prefixes:['DC'],      label:{ko:'소수',en:'Decimals',zh:'小数'}},
      {prefixes:['MX','EL'], label:{ko:'혼합·응용',en:'Mixed & Applied',zh:'混合与应用'}},
      {prefixes:['CH'],      label:{ko:'경시',en:'Challenge',zh:'竞赛'}},
      {prefixes:['MD'],      label:{ko:'중·고등',en:'Middle & High',zh:'初高中'}},
      {prefixes:['NL'],      label:{ko:'수의 나라',en:'Number Land',zh:'数字王国'}},
      {prefixes:['WP'],      label:{ko:'문장제',en:'Word Problems',zh:'应用题'}},
    ];
    function allThreadsGrouped(){
      const TH = window.NM_THREADS || {};
      const groups = PE_GROUPS.map(g => ({label:g.label, items:[]}));
      const other = [];
      Object.keys(TH).forEach(t => {
        const prefix = t.replace(/[0-9].*$/, '');
        const gi = PE_GROUPS.findIndex(g => g.prefixes.indexOf(prefix) >= 0);
        const entry = {t, lv: defaultLevelOf(t)};
        if(gi >= 0) groups[gi].items.push(entry); else other.push(entry);
      });
      if(other.length) groups.push({label:{ko:'기타',en:'Other',zh:'其他'}, items:other});
      return groups.filter(g => g.items.length);
    }

    const overlay = document.createElement('div');
    overlay.className = 'nm-pe-overlay';
    overlay.id = 'nm-pe-overlay';
    document.body.appendChild(overlay);

    let pickTarget = null; // number(round idx) | 'add' | null

    function closePicker(){
      pickTarget = null;
      const bd = overlay.querySelector('.nm-pe-pick-backdrop');
      if(bd) bd.remove();
    }
    function openPicker(anchorBtn, target){
      closePicker();
      pickTarget = target;
      const courseItems = opts.courseKey ? courseDrillList(opts.courseKey) : [];
      const reviewItems = opts.courseKey ? reviewDrillList(opts.courseKey) : [];
      const groups = allThreadsGrouped();
      const rowBtn = (t, lv) => `<button class="nm-pe-pick-item" data-t="${esc(t)}" data-lv="${lv}">
        <b>${esc(t)}</b><span>${esc(threadName(t))} · ${esc(levelLabelOf(t,lv))}</span></button>`;
      let html = '';
      if(courseItems.length) html += `<div class="nm-pe-pick-sec"><div class="nm-pe-pick-sec-h">① ${esc(lk('이 과정의 유형','This course','本课程'))}</div>${courseItems.map(d=>rowBtn(d.t,d.lv)).join('')}</div>`;
      if(reviewItems.length) html += `<div class="nm-pe-pick-sec"><div class="nm-pe-pick-sec-h">② ${esc(lk('복습 — 이전 과정 유형','Review — earlier courses','复习——之前课程'))}</div>${reviewItems.map(d=>rowBtn(d.t,d.lv)).join('')}</div>`;
      html += `<div class="nm-pe-pick-sec"><div class="nm-pe-pick-sec-h">③ ${esc(lk('전체','All types','全部'))}</div>`
        + (groups.length ? groups.map(g => `<div class="nm-pe-pick-group-h">${esc(pickL(g.label))}</div>${g.items.map(d=>rowBtn(d.t,d.lv)).join('')}`).join('')
          : `<div class="nm-pe-pick-empty">${esc(lk('유형 데이터를 불러오지 못했어요.','No thread data.','没有可用的类型数据。'))}</div>`)
        + `</div>`;
      const backdrop = document.createElement('div');
      backdrop.className = 'nm-pe-pick-backdrop';
      const panel = document.createElement('div');
      panel.className = 'nm-pe-pick-panel';
      panel.innerHTML = html;
      backdrop.appendChild(panel);
      overlay.appendChild(backdrop);
      const r = anchorBtn.getBoundingClientRect();
      const vw = window.innerWidth, vh = window.innerHeight;
      panel.style.top = (r.bottom + 4) + 'px';
      panel.style.left = r.left + 'px';
      /* 화면 밖으로 나가면 안쪽으로 당긴다(패널 크기는 삽입 후에만 잴 수 있다) */
      requestAnimationFrame(() => {
        const pr = panel.getBoundingClientRect();
        if(pr.right > vw - 8) panel.style.left = Math.max(8, vw - pr.width - 8) + 'px';
        if(pr.bottom > vh - 8) panel.style.top = Math.max(8, r.top - pr.height - 4) + 'px';
      });
      backdrop.addEventListener('click', (e) => { if(e.target === backdrop) closePicker(); });
      panel.querySelectorAll('.nm-pe-pick-item').forEach(btn => {
        btn.addEventListener('click', () => {
          const t = btn.dataset.t, lv = parseInt(btn.dataset.lv, 10) || 1;
          const tgt = pickTarget;
          closePicker();
          if(tgt === 'add'){
            rounds.push({ thread:t, level:lv, wordType:'none', seed:NM_RNG.newCode(),
              overrides:{}, guideSeed:null });
            renderAll();
          } else if(typeof tgt === 'number'){
            rounds[tgt] = Object.assign({}, rounds[tgt], { thread:t, level:lv,
              seed:NM_RNG.newCode(), overrides:{}, guideSeed:null });
            mountRound(tgt);
            updateCodeLine();
            applyScale();
          }
        });
      });
    }

    function compositeCode(){
      return rounds.map(r => r.__code || '').filter(Boolean).join(' + ');
    }
    function updateCodeLine(){
      const el = overlay.querySelector('#nm-pe-code-text');
      if(el) el.textContent = compositeCode();
    }

    function attachCellSwap(roundEl, idx){
      roundEl.querySelectorAll('.nm-w2-item[data-slot]').forEach(cell => {
        cell.style.position = 'relative';
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'nm-pe-cell-swap';
        btn.title = lk('새 문제','New problem','换一题');
        btn.textContent = '🔄';
        btn.addEventListener('click', (e) => {
          e.preventDefault(); e.stopPropagation();
          const slot = cell.getAttribute('data-slot');
          rounds[idx].overrides[slot] = NM_RNG.newCode();
          mountRound(idx);
          updateCodeLine();
          applyScale();
        });
        cell.appendChild(btn);
      });
    }
    function attachGuideReroll(roundEl, idx){
      const title = roundEl.querySelector('.nm-w2-guide-title');
      if(!title) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'nm-pe-guide-reroll';
      btn.textContent = '🔄 ' + lk('따라 풀기 새로','New guide set','换一组示范题');
      btn.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        rounds[idx].guideSeed = NM_RNG.newCode();
        mountRound(idx);
        updateCodeLine();
        applyScale();
      });
      title.appendChild(btn);
    }

    function roundHeadHtml(idx){
      const r = rounds[idx];
      const th = (window.NM_THREADS||{})[r.thread] || {};
      const levels = th.levels || [{id:r.level}];
      return `<div class="nm-pe-round-head">
        <span class="nm-pe-round-name">${esc(threadName(r.thread))} · ${esc(levelLabelOf(r.thread, r.level))}</span>
        <div class="nm-pe-round-actions">
          <select class="nm-pe-lvl-sel" data-lvl-sel="${idx}">
            ${levels.map(l => `<option value="${l.id}"${l.id===r.level?' selected':''}>${esc(pickL(l.label)||('Lv.'+l.id))}</option>`).join('')}
          </select>
          <button class="nm-pe-mini-btn" data-type-btn="${idx}">${esc(lk('유형 바꾸기 ▾','Change type ▾','换类型 ▾'))}</button>
          <button class="nm-pe-mini-btn" data-reroll-btn="${idx}">🎲 ${esc(lk('이 유형 새 문제','New problems','换一批题'))}</button>
          <button class="nm-pe-remove-btn" data-remove-btn="${idx}" ${rounds.length<=1?'disabled':''} title="${esc(lk('이 유형 지우기','Remove','删除'))}">×</button>
        </div>
      </div>`;
    }

    function mountRound(idx){
      const roundEl = overlay.querySelector(`.nm-pe-round[data-round="${idx}"]`);
      if(!roundEl) return;
      const r = rounds[idx];
      const built = renderRoundPages(r, { count: perTypeCount });
      r.__code = built.code;
      roundEl.setAttribute('data-code', built.code);
      roundEl.innerHTML = roundHeadHtml(idx) + built.html;
      roundEl.querySelectorAll('.nm-w2-tex, .nm-cp-tex').forEach(el => renderKaTeX(el.dataset.tex||'', el));
      attachCellSwap(roundEl, idx);
      attachGuideReroll(roundEl, idx);
      bindRoundHeadControls(idx);
    }

    function bindRoundHeadControls(idx){
      const roundEl = overlay.querySelector(`.nm-pe-round[data-round="${idx}"]`);
      if(!roundEl) return;
      const lvlSel = roundEl.querySelector(`[data-lvl-sel="${idx}"]`);
      if(lvlSel) lvlSel.addEventListener('change', () => {
        rounds[idx].level = parseInt(lvlSel.value, 10) || rounds[idx].level;
        rounds[idx].overrides = {}; rounds[idx].guideSeed = null;
        mountRound(idx); updateCodeLine(); applyScale();
      });
      const typeBtn = roundEl.querySelector(`[data-type-btn="${idx}"]`);
      if(typeBtn) typeBtn.addEventListener('click', () => openPicker(typeBtn, idx));
      const rerollBtn = roundEl.querySelector(`[data-reroll-btn="${idx}"]`);
      if(rerollBtn) rerollBtn.addEventListener('click', () => {
        rounds[idx].seed = NM_RNG.newCode();
        rounds[idx].overrides = {}; rounds[idx].guideSeed = null;
        mountRound(idx); updateCodeLine(); applyScale();
      });
      const removeBtn = roundEl.querySelector(`[data-remove-btn="${idx}"]`);
      if(removeBtn) removeBtn.addEventListener('click', () => {
        if(rounds.length <= 1) return;
        rounds.splice(idx, 1);
        renderAll();
      });
    }

    function applyScale(){
      const outer = overlay.querySelector('.nm-pe-scale-outer');
      const wrap = overlay.querySelector('.nm-pe-scale-wrap');
      const sheet = overlay.querySelector('.nm-pe-sheet');
      if(!outer || !wrap || !sheet) return;
      const availW = outer.clientWidth - 16;
      const sheetW = sheet.offsetWidth || 1;
      let scale = Math.min(1, availW / sheetW);
      if(scale < 0.28) scale = 0.28;
      wrap.style.transform = `scale(${scale})`;
      wrap.style.height = (sheet.offsetHeight * scale) + 'px';
    }

    function toolbarHtml(){
      return `<div class="nm-pe-toolbar">
        <div class="nm-pe-toolbar-row">
          <span class="nm-pe-title">🖨 ${esc(lk('학습지 미리보기','Worksheet preview','学习单预览'))} — ${esc(label||'')}</span>
          <button class="nm-pe-close" id="nm-pe-close">${esc(lk('닫기 ✕','Close ✕','关闭 ✕'))}</button>
        </div>
        <div class="nm-pe-toolbar-row">
          <span class="nm-pe-opt-label">${esc(lk('문항 수','Count','题量'))}</span>
          <div class="nm-pe-seg" id="nm-pe-count-seg">
            ${[10,20,40].map(n => `<button data-n="${n}" class="${perTypeCount===n?'sel':''}">${n}</button>`).join('')}
          </div>
          <label class="nm-ex-concept-toggle" style="margin-left:4px">
            <input type="checkbox" id="nm-pe-cover-chk" ${coverOn?'checked':''}>
            <span>📘 ${esc(lk('표지','Cover','封面'))}</span>
          </label>
          <button class="nm-pe-btn nm-pe-btn-ghost" id="nm-pe-reroll-all">🎲 ${esc(lk('전체 새 문제','New problems (all)','全部换题'))}</button>
          <button class="nm-pe-btn nm-pe-btn-primary" id="nm-pe-print" style="margin-left:auto">🖨 ${esc(lk('인쇄','Print','打印'))}</button>
        </div>
        <div class="nm-pe-code-row">
          <span>${esc(lk('코드','Code','代码'))}:</span>
          <code id="nm-pe-code-text"></code>
          <button class="nm-pe-copy-btn" id="nm-pe-copy">${esc(lk('복사','Copy','复制'))}</button>
        </div>
      </div>`;
    }

    function renderAll(){
      closePicker();
      overlay.innerHTML = toolbarHtml() + `
        <div class="nm-pe-body">
          <div class="nm-pe-scale-outer">
            <div class="nm-pe-scale-wrap">
              <div class="nm-pe-sheet" id="nm-pe-sheet">
                ${rounds.map((r, i) => `<div class="nm-pe-round" data-round="${i}"></div>`).join('')}
                <div class="nm-pe-add-row"><button class="nm-pe-add-btn" id="nm-pe-add">+ ${esc(lk('유형 추가','Add type','添加类型'))}</button></div>
              </div>
            </div>
          </div>
        </div>`;

      overlay.querySelector('#nm-pe-close').addEventListener('click', () => overlay.remove());
      overlay.querySelectorAll('#nm-pe-count-seg button').forEach(b => {
        b.addEventListener('click', () => {
          perTypeCount = parseInt(b.dataset.n, 10) || 20;
          renderAll();
        });
      });
      const coverChk = overlay.querySelector('#nm-pe-cover-chk');
      if(coverChk) coverChk.addEventListener('change', () => {
        coverOn = coverChk.checked; setCoverOn(coverOn);
      });
      overlay.querySelector('#nm-pe-reroll-all').addEventListener('click', () => {
        rounds.forEach(r => { r.seed = NM_RNG.newCode(); r.overrides = {}; r.guideSeed = null; });
        rounds.forEach((_, i) => mountRound(i));
        updateCodeLine();
        applyScale();
      });
      overlay.querySelector('#nm-pe-add').addEventListener('click', (e) => openPicker(e.currentTarget, 'add'));
      overlay.querySelector('#nm-pe-copy').addEventListener('click', () => {
        const text = compositeCode();
        try{ navigator.clipboard && navigator.clipboard.writeText(text); }catch(err){}
      });
      overlay.querySelector('#nm-pe-print').addEventListener('click', () => {
        NM_EXAM.renderPrintMulti(rounds, label, { mixed: perTypeCount });
        if(typeof opts.onPrint === 'function') opts.onPrint();
      });

      rounds.forEach((_, i) => mountRound(i));
      updateCodeLine();
      applyScale();
    }

    renderAll();
    window.addEventListener('resize', applyScale);
    /* overlay가 사라지면 리사이즈 리스너도 정리한다 — 안 그러면 편집기를 여러 번
       열었다 닫을 때마다 죽은 리스너가 쌓인다. */
    const mo = new MutationObserver(() => {
      if(!document.body.contains(overlay)){
        window.removeEventListener('resize', applyScale);
        mo.disconnect();
      }
    });
    mo.observe(document.body, { childList: true });
  },

}; // end NM_EXAM

window.NM_EXAM = NM_EXAM;

/* ── 전역 진입 함수 (main.js에서 호출) ── */
window.examScreen = function(container, opts){
  if(!container){ container = document.getElementById('nm-main') || document.body; }
  container.innerHTML = '';

  function showSetup(){
    container.innerHTML = '';
    NM_EXAM.renderExamSetup(container, cfg => showExam(cfg), opts);
  }

  /* ── 그리드 학습지 (11math 스타일) ── */
  function runGridExam(cfg){
    const { thread, level, count, seed, label, concept, wordType, grade } = cfg;
    const numericSeed = NM_RNG.hashSeed(seed);
    const problems = buildProblems(thread, level, count, numericSeed);
    applyWordProblems(problems, wordType, numericSeed);
    const code = NM_EXAM.worksheetCode(cfg);
    const userAnswers = new Array(count).fill('');
    let activeTab = 'problems'; // 'problems' | 'answers'
    let graded = false;
    let gradeScore = 0;

    function render(){
      const mode = activeTab==='answers' ? 'answer' : 'online';
      const conceptHtml = (concept && activeTab==='problems')
        ? `<details class="nm-grid-concept">
             <summary class="nm-grid-concept-sum">📖 개념 보기</summary>
             <div class="nm-grid-concept-body">${esc(concept).replace(/\n/g,'<br>')}</div>
           </details>`
        : '';
      const scoreHtml = graded && activeTab==='problems'
        ? `<div class="nm-grid-score ${gradeScore/count>=0.8?'nm-grid-pass':'nm-grid-fail'}">${gradeScore}/${count} (${Math.round(gradeScore/count*100)}%)</div>`
        : '';

      container.innerHTML = `
<div class="nm-ws-wrap">
  <div class="nm-ws-hd">
    <div class="nm-ws-hd-left">
      <span class="nm-grid-badge">${esc(label||thread)}</span>
      <span class="nm-grid-code">${esc(code)}</span>
    </div>
    <div class="nm-ws-tabs">
      <button class="nm-ws-tab${activeTab==='problems'?' active':''}" data-tab="problems">문제지</button>
      <button class="nm-ws-tab${activeTab==='answers'?' active':''}" data-tab="answers">정답지</button>
    </div>
  </div>
  ${conceptHtml}
  <div class="nm-ws-grid">
    ${problems.map((p,i)=>gridCellHtml(p,i,mode,graded,userAnswers)).join('')}
  </div>
  <div class="nm-ws-foot">
    ${scoreHtml}
    ${activeTab==='problems'&&!graded ? '<button id="nm-ws-grade" class="nm-ex-btn-primary">채점하기 ✓</button>' : ''}
    ${activeTab==='problems'&&graded ? '<button id="nm-ws-again" class="nm-ex-btn-primary">계속 연습 🔄</button>' : ''}
    <button id="nm-ws-print" class="nm-ex-btn-secondary">🖨️ 출력하기</button>
    <button id="nm-ws-new" class="nm-ex-btn-secondary">다른 문제지</button>
    <button id="nm-ws-back" class="nm-ex-btn-ghost">← 주제 바꾸기</button>
  </div>
</div>`;

      /* KaTeX 인라인 렌더 */
      container.querySelectorAll('.nm-vp-tex').forEach(el => renderKaTeX(el.dataset.tex||'', el));
      container.querySelectorAll('.nm-ans-tex').forEach(el => renderKaTeX(el.dataset.tex||'', el));

      /* 입력값 복원 + Enter 이동 */
      const inps = [...container.querySelectorAll('.nm-vp-inp')];
      inps.forEach((inp,idx_) => {
        const idx = parseInt(inp.dataset.idx);
        if(userAnswers[idx]!=='') inp.value = userAnswers[idx];
        inp.addEventListener('input', ()=>{ userAnswers[idx]=inp.value; });
        inp.addEventListener('keydown', e=>{
          if(e.key==='Enter'){ const nx=inps[inps.indexOf(inp)+1]; if(nx) nx.focus(); }
        });
      });

      /* 탭 전환 */
      container.querySelectorAll('.nm-ws-tab').forEach(btn=>{
        btn.addEventListener('click', ()=>{
          activeTab = btn.dataset.tab;
          render();
        });
      });

      /* 채점 */
      const gradeBtn = container.querySelector('#nm-ws-grade');
      if(gradeBtn) gradeBtn.addEventListener('click', ()=>{
        graded = true; gradeScore = 0;
        problems.forEach((p,i)=>{ if(matchesAnswer(userAnswers[i],p.answer)) gradeScore++; });
        /* 유형별 정답률 추적(과정-로드맵.md §2-4) — 이 스레드+레벨을 한 세트
           풀고 채점한 "세션 1회"로 기록한다. NM_STATS 미로딩 시(스크립트
           누락 등) 조용히 건너뛴다 — 채점 자체는 그 어떤 경우에도 막지 않음. */
        if(window.NM_STATS) NM_STATS.record(thread, level, gradeScore, count, cfg.boost ? {boost:true} : null);
        render();
      });

      /* 계속 연습 */
      const againBtn = container.querySelector('#nm-ws-again');
      if(againBtn) againBtn.addEventListener('click', ()=>runGridExam({...cfg, seed:NM_RNG.newCode()}));

      /* 출력 */
      container.querySelector('#nm-ws-print').addEventListener('click', ()=>printWorksheet());

      /* 다른 문제지 */
      container.querySelector('#nm-ws-new').addEventListener('click', ()=>runGridExam({...cfg, seed:NM_RNG.newCode()}));

      /* 주제 바꾸기 */
      container.querySelector('#nm-ws-back').addEventListener('click', showSetup);
    }

    /* 예전엔 여기서 표지·개념 페이지·문제 그리드를 통째로 다시 만들었다
       (NM_EXAM.renderPrint와 거의 같은 일을 따로). 두 번째 사본이라 표지가
       빠져 있었고, 세로셈 서식용 CSS도 이쪽에만 없어 실제 인쇄물이 안 꾸며진
       채 나가고 있었다(2026-08-28, 표지 작업 중 발견). renderPrint 쪽을
       세로셈까지 지원하도록 올리고(fillPrintGrid) 이 함수는 그걸 그대로
       호출하도록 합쳤다 — 표지·개념 페이지·QR 전부 자동으로 따라온다. */
    function printWorksheet(){
      // 온라인 문제지의 인쇄도 편집기를 거친다 — 같은 시드로 열리므로 화면과 같은 문항에서 시작.
      NM_EXAM.openPrintEditor([{ thread, level, seed, wordType, topicName: label, grade }],
        label || `${thread}-L${level}`, { count });
    }

    render();
  }

  function showExam(cfg){
    container.innerHTML = '';
    if(cfg.layout === 'grid'){ runGridExam(cfg); }
    else { NM_EXAM.runExam(cfg, container, result => showResult(result)); }
  }

  function showResult(result){
    container.innerHTML = '';
    NM_EXAM.renderResult(result, container, opts => {
      if(opts.mode === 'new'){
        const newSeed = NM_RNG.newCode();
        showExam({...opts, seed:newSeed});
      } else if(opts.mode === 'wrongs'){
        const wrongProblems = opts.wrongs.map(w => w.p);
        const cfg2 = {
          thread: opts.thread, level: opts.level,
          count: wrongProblems.length, timer:0, seed: NM_RNG.newCode()
        };
        runWrongsExam(wrongProblems, cfg2, container);
      }
    });
  }

  function runWrongsExam(wrongProblems, cfg, cnt){
    cnt.innerHTML = '';
    const answers = new Array(wrongProblems.length).fill(null);
    let current = 0;

    function render(){
      const p = wrongProblems[current];
      cnt.innerHTML = `
<div class="nm-exam-run">
  <h3>오답 재시험 (${current+1}/${wrongProblems.length})</h3>
  <div class="nm-q-tex" id="nm-ex-qtex2"></div>
  <input id="nm-ex-ans2" type="number" placeholder="답" style="font-size:1.4em;width:120px;text-align:center;padding:8px">
  <button id="nm-ex-sub2" class="nm-btn nm-btn-primary" style="margin-left:8px">확인</button>
</div>`;
      renderKaTeX(p.tex||'', document.getElementById('nm-ex-qtex2'));
      const inp = document.getElementById('nm-ex-ans2');
      if(answers[current]!==null) inp.value = answers[current];
      inp.focus();
      document.getElementById('nm-ex-sub2').addEventListener('click', () => {
        const v = parseInt(inp.value);
        if(!isNaN(v)) answers[current] = v;
        current++;
        if(current >= wrongProblems.length){
          const score = wrongProblems.filter((p,i)=>matchesAnswer(answers[i],p.answer)).length;
          cnt.innerHTML = `<div class="nm-exam-result">
            <div class="nm-result-score">오답 재시험: ${score}/${wrongProblems.length} 맞혔어요!</div>
            <button id="nm-ex-back" class="nm-btn nm-btn-primary">메뉴로 돌아가기</button>
          </div>`;
          document.getElementById('nm-ex-back').addEventListener('click', showSetup);
        } else { render(); }
      });
      inp.addEventListener('keydown', e => { if(e.key==='Enter') document.getElementById('nm-ex-sub2').click(); });
    }
    render();
  }

  showSetup();
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_EXAM;
})();
