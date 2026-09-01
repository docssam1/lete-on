/* ============================================================
   Numbers of Magic — 개념 애니메이션 장면 모델 (NM_SCENE)
   설계: number_magic/개념애니-설계.md §3(동작 계열) · §4(데이터 계약) ·
        §6(검사기) · §6-1(렌더러 재사용) · §6-2(완료 기준)

   이 파일은 **좌표를 계산하는 곳**이고 SVG는 한 글자도 만들지 않는다.
   (SVG 문자열은 app/concept-anim.js가 GW_RENDER의 fmt/polygon/wrapSvg로 만든다.)

   원칙 — 왜 이렇게 나눴나
   1. 장면은 생성기 반환값에서 나온다. 유닛 파일의 산문(mathSteps)에서
      숫자를 베껴 오지 않는다. mathSteps는 그대로 남고 이 장면이 옆에 붙는다.
   2. tex 문자열을 파싱하지 않는다(§4-1). NM_TGEN 생성기는 의미 필드를
      안 내보내므로 생성기 쪽에 scene:{}를 덧붙여 이미 계산해 둔 지역변수를
      내보내게 했다 — ml_x9(threads/ml.js) · md11_monoMulDiv(threads/mid2.js).
   3. 좌표는 전부 글꼴 메트릭 상수 하나(ADV)와 칸 크기에서 계산한다.
      눈대중으로 찍은 좌표는 없다.
   4. 칠판 수업이 원형이다(gmap 스킬의 뿌리 = english-math-whiteboard-lesson).
      완성된 그림에 색을 입히는 게 아니라 **빈 칠판에 하나씩 그려 나간다**.
      그래서 beat마다 "새로 그려지는 것"이 정확히 하나이고, 앞의 것은 지워지지
      않고 쌓인다 — 마지막 한 장이 그대로 설명이 되어야 A4로 나갈 수 있다.

   반환 형식은 G·MAP scene manifest(skills/gmap-animated-math-lesson/
   references/scene-contract.md)를 그대로 따른다. 그래서 그 스킬의
   validate_scene_manifest.py가 이 장면을 그대로 검사한다.
   ============================================================ */
(function (global) {
'use strict';

/* ── 글꼴 메트릭 ──────────────────────────────────────────────
   SVG 문자열 빌더라 DOM 측정이 없다(GW_RENDER와 같은 이유 — 인쇄에 그대로
   실리고 Node에서 검사도 되어야 한다). 숫자·기호는 등폭 글꼴로 그리고
   advance를 상수로 둔다. 아래 모든 좌표는 이 상수들의 산술 결과다. */
const FS   = 26;      /* 칩 글자 크기(px) */
const ADV  = 0.62;    /* 등폭 글꼴 advance / em — 좌표의 유일한 글꼴 상수 */
const PADX = 9;       /* 칩 좌우 여백 */
const PADY = 7;       /* 칩 상하 여백 */
const GAP  = 8;       /* 칩 사이 간격 */
const ROWH = 62;      /* 행 간격 */
const PAD  = 20;      /* 장면 바깥 여백 */

function chW(text){ return String(text).length * ADV * FS; }
function chipW(text){ return chW(text) + PADX * 2; }
const CHIPH = FS + PADY * 2;
function round2(n){ return Math.round(n * 100) / 100; }

/* ── 보드 — 객체를 쌓고 마지막에 원점을 0,0으로 옮긴다 ────────
   G·MAP 검사기가 frame 원점이 장면 밖이면 실패시키므로, 다 그린 뒤
   최소 좌표만큼 평행이동한다. 개별 객체 좌표를 미리 양수로 맞추려고
   눈대중 오프셋을 넣지 않기 위한 장치다. */
function Board(){ this.objects = []; this.beats = []; }
Board.prototype.add = function (o) { this.objects.push(o); return o; };
Board.prototype.beat = function (b) { this.beats.push(b); return b; };
Board.prototype.finish = function () {
  const os = this.objects;
  const minX = Math.min.apply(null, os.map(o => o.frame.x));
  const minY = Math.min.apply(null, os.map(o => o.frame.y));
  const maxX = Math.max.apply(null, os.map(o => o.frame.x + o.frame.width));
  const maxY = Math.max.apply(null, os.map(o => o.frame.y + o.frame.height));
  os.forEach(o => { o.frame.x = round2(o.frame.x - minX + PAD); o.frame.y = round2(o.frame.y - minY + PAD); });
  return { width: round2(maxX - minX + PAD * 2), height: round2(maxY - minY + PAD * 2) };
};

/* ── 한 줄 배치 — 토큰 목록 → 누적 x ─────────────────────────
   토큰 하나가 칩 하나다. 폭은 글자 수 × advance라서, 어떤 수가 나오든
   같은 규칙으로 자리가 정해진다(생성기가 매번 다른 수를 낸다). */
function layoutRow(tokens, x0, y){
  let x = x0;
  return tokens.map(tk => {
    const w = tk.width != null ? tk.width : chipW(tk.text);
    const o = {
      id: tk.id, type: tk.type || 'token',
      frame: { x: round2(x), y: round2(y), width: round2(w), height: CHIPH },
      data: Object.assign({ text: String(tk.text) }, tk.data || {})
    };
    if (tk.role) o.role = tk.role;
    x += w + (tk.gap != null ? tk.gap : GAP);
    return o;
  });
}
function centerX(o){ return o.frame.x + o.frame.width / 2; }

/* ── i18n 서술 ────────────────────────────────────────────── */
function nar(ko, en, zh){ return { ko: ko, en: en, zh: zh }; }

/* 한국어 조사 — 수 뒤의 와/과·를/을은 **읽는 소리**로 정해진다.
   51은 "오십일"이라 받침이 있어 51'과', 49는 "사십구"라 49'를'.
   숫자만 보고 '와/를'로 고정하면 "51와 49를"처럼 틀린 말이 나온다
   (실제로 그렇게 나가고 있었다 — 2026-08-31).
   마지막 자리로 판정한다: 1 일·3 삼·6 육·7 칠·8 팔은 받침 있음,
   2 이·4 사·5 오·9 구는 없음. 0으로 끝나면 십(ㅂ)·백(ㄱ)은 받침이 있고
   천·만 단위는 그 앞자리가 살아 있으면 십/백으로 읽히므로 같은 규칙을 탄다.
   앱의 hasBatchim(wp.js)·kJosa(exam.js)와 같은 목적이지만, 저쪽은 낱말용이라
   수의 '읽는 소리'를 못 본다. */
function numBatchim(n){
  const v = Math.abs(Math.round(Number(n)));
  if(!isFinite(v)) return false;
  const last = v % 10;
  if(last !== 0) return [1, 3, 6, 7, 8].indexOf(last) >= 0;
  /* 0으로 끝남 — 1000·10000처럼 천/만으로 끝나면 받침 없음(천), 있음(만).
     그 외(10~90, 100~900 등)는 십·백으로 끝나 받침이 있다. */
  if(v === 0) return true;                 /* 영 */
  if(v % 10000 === 0) return true;         /* 만 */
  if(v % 1000 === 0) return false;         /* 천 */
  return true;                             /* 십 · 백 */
}
function josaWa(n){ return numBatchim(n) ? '과' : '와'; }
function josaEul(n){ return numBatchim(n) ? '을' : '를'; }

/* ============================================================
   계열 1 — 묶기 (group)
   무엇이 움직이나: nums[] 중 합이 target인 짝이 묶여 부분합으로 접힌다.
   모델: 1차원 트랙(수 칩) + 그룹 경계(짝의 두 칩을 잇는 호).
   호의 높이는 span 폭 순위에서 계산한다 — 짝이 서로 엇갈려도(0-3,1-2)
   호가 겹치지 않게 하려고 넣은 규칙이지 눈대중 값이 아니다.
   ============================================================ */

/* 짝 나누기를 전부 세어 본다(§6-2 단일 정답 — 설계 의도가 아니라 열거로 증명).
   반환: 서로 다른 "값 짝 묶음" 목록. 같은 묶음을 만드는 index 조합은 하나로 센다. */
function enumerateGroupings(items, target){
  const found = {};
  (function walk(rest, acc){
    if (!rest.length) {
      const sig = acc.map(p => p.slice().sort((a, b) => a - b).join('+')).sort().join(' | ');
      found[sig] = acc.map(p => p.slice());
      return;
    }
    const a = rest[0];
    for (let i = 1; i < rest.length; i++) {
      if (items[a] + items[rest[i]] !== target) continue;
      const next = rest.filter((_, k) => k !== 0 && k !== i);
      walk(next, acc.concat([[items[a], items[rest[i]]]]));
    }
  })(items.map((_, i) => i), []);
  return Object.keys(found).map(k => found[k]);
}
/* 그림에 쓸 index 짝 — 위 열거가 유일함을 확인한 뒤에만 쓴다. */
function matchIndices(items, target){
  const used = [], pairs = [];
  for (let i = 0; i < items.length; i++) {
    if (used[i]) continue;
    for (let j = i + 1; j < items.length; j++) {
      if (used[j] || items[i] + items[j] !== target) continue;
      used[i] = used[j] = true; pairs.push([i, j]); break;
    }
  }
  return pairs;
}

const ARC_RISE = 30;   /* 첫 호가 칩 위로 뜨는 높이 */
/* span이 큰 호일수록 한 단씩 더 위로. 단 간격은 호 위에 붙는 "100" 딱지 높이
   (렌더러가 FS×0.84로 그린다)보다 커야 한다 — 짝이 서로 엇갈리면(15…85 바깥,
   38…62 안쪽) 두 딱지가 같은 x 부근에 오는데, 22로 뒀더니 실제로 겹쳤다. */
const ARC_STEP = Math.round(FS * 0.84) + 12;

function buildGroup(src, meta){
  const items = src.items, target = src.target, total = src.total;
  const groupings = enumerateGroupings(items, target);
  const pairs = matchIndices(items, target);
  const b = new Board();

  /* 행0 — 문제식 */
  const toks = [];
  items.forEach((n, i) => {
    if (i) toks.push({ id: 'op.' + i, type: 'op', text: '+' });
    toks.push({ id: 'num.' + i, type: 'num-chip', text: n, data: { value: n } });
  });
  const row0 = layoutRow(toks, 0, 0);
  row0.forEach(o => b.add(o));
  const byId = {}; row0.forEach(o => { byId[o.id] = o; });

  /* 호 — 짝의 두 칩 중심에서 계산. span이 넓은 짝이 위로 간다. */
  const ranked = pairs.map((p, gi) => {
    const a = byId['num.' + p[0]], c = byId['num.' + p[1]];
    return { gi: gi, p: p, span: Math.abs(centerX(c) - centerX(a)), a: a, c: c };
  }).sort((u, v) => v.span - u.span);
  const arcIds = [];
  ranked.forEach((r, rank) => {
    const rise = ARC_RISE + rank * ARC_STEP;
    const x1 = Math.min(centerX(r.a), centerX(r.c)), x2 = Math.max(centerX(r.a), centerX(r.c));
    const id = 'arc.' + r.gi;
    arcIds[r.gi] = id;
    b.add({
      id: id, type: 'pair-arc',
      frame: { x: round2(x1), y: round2(-rise), width: round2(x2 - x1), height: round2(rise) },
      data: { fromId: 'num.' + r.p[0], toId: 'num.' + r.p[1], label: String(target),
              value: target, members: [items[r.p[0]], items[r.p[1]]], colorIndex: r.gi }
    });
  });

  /* 행1 — 짝끼리 묶어 다시 쓴 식 */
  const t1 = [{ id: 'eq.1', type: 'op', text: '=' }];
  pairs.forEach((p, gi) => {
    if (gi) t1.push({ id: 'r1.plus.' + gi, type: 'op', text: '+' });
    t1.push({ id: 'r1.open.' + gi, type: 'op', text: '(', gap: 2 });
    t1.push({ id: 'r1.a.' + gi, type: 'num-chip', text: items[p[0]], data: { value: items[p[0]], colorIndex: gi }, gap: 4 });
    t1.push({ id: 'r1.op.' + gi, type: 'op', text: '+', gap: 4 });
    t1.push({ id: 'r1.b.' + gi, type: 'num-chip', text: items[p[1]], data: { value: items[p[1]], colorIndex: gi }, gap: 2 });
    t1.push({ id: 'r1.close.' + gi, type: 'op', text: ')' });
  });
  const row1 = layoutRow(t1, 0, ROWH); row1.forEach(o => b.add(o));

  /* 행2 — 접힌 부분합 */
  const t2 = [{ id: 'eq.2', type: 'op', text: '=' }];
  pairs.forEach((p, gi) => {
    if (gi) t2.push({ id: 'r2.plus.' + gi, type: 'op', text: '+' });
    t2.push({ id: 'partial.' + gi, type: 'sum-chip', text: target, data: { value: target, colorIndex: gi } });
  });
  const row2 = layoutRow(t2, 0, ROWH * 2); row2.forEach(o => b.add(o));

  /* 행3 — 답 */
  const row3 = layoutRow([
    { id: 'eq.3', type: 'op', text: '=' },
    { id: 'total', type: 'answer', text: total, role: 'answer', data: { value: total } }
  ], 0, ROWH * 3);
  row3.forEach(o => b.add(o));

  /* beats — 칠판처럼 하나씩 그려 나간다 */
  const ids0 = row0.map(o => o.id);
  b.beat({ id: 'b1', phase: 'problem', durationMs: 1200, targetIds: ids0,
    actions: [{ type: 'draw', targetIds: ids0 }],
    narration: nar(items.join(' + ') + ' — 이 수들을 더해요.',
                   items.join(' + ') + " — let's add these.",
                   items.join(' + ') + ' —— 我们来加这些数。') });
  pairs.forEach((p, gi) => {
    const a = items[p[0]], c = items[p[1]];
    b.beat({ id: 'b2.' + gi, phase: 'explore', durationMs: 1400, targetIds: [arcIds[gi]],
      actions: [{ type: 'draw', targetIds: [arcIds[gi]] }],
      narration: nar(a + josaWa(a) + ' ' + c + josaEul(c) + ' 이으면 ' + target + '. 짝이에요.',
                     a + ' and ' + c + ' join to make ' + target + ' — a pair.',
                     a + '和' + c + '连起来是' + target + '，是一对。') });
  });
  b.beat({ id: 'b3', phase: 'solve', durationMs: 1400, targetIds: row1.map(o => o.id),
    actions: [{ type: 'draw', targetIds: row1.map(o => o.id) }],
    narration: nar('짝끼리 묶어서 다시 써요.', 'Rewrite it with the pairs grouped.', '把配对圈在一起重新写。') });
  b.beat({ id: 'b4', phase: 'solve', durationMs: 1400, targetIds: row2.map(o => o.id),
    actions: [{ type: 'transform', targetIds: row2.map(o => o.id) }],
    narration: nar('묶은 짝이 각각 ' + target + '으로 접혀요.',
                   'Each grouped pair folds into ' + target + '.',
                   '每一对都折成' + target + '。') });
  b.beat({ id: 'b5', phase: 'answer', durationMs: 1600, targetIds: row3.map(o => o.id),
    actions: [{ type: 'reveal-answer', targetIds: ['total'] }, { type: 'draw', targetIds: row3.map(o => o.id) }],
    narration: nar('그래서 ' + pairs.map(() => target).join(' + ') + ' = ' + total + '이에요.',
                   'So ' + pairs.map(() => target).join(' + ') + ' = ' + total + '.',
                   '所以 ' + pairs.map(() => target).join(' + ') + ' = ' + total + '。') });

  const paired = {};
  pairs.forEach(p => { paired[p[0]] = 1; paired[p[1]] = 1; });
  const leftover = items.filter((_, i) => !paired[i]).reduce((s, n) => s + n, 0);

  const scene = b.finish();
  return finishManifest(b, scene, 'group', meta, {
    answerRevealBeatId: 'b5',
    checks: [
      { id: 'conservation-group', label: '부분합의 합 + 남은 수 = 전체합',
        passed: pairs.length * target + leftover === total },
      { id: 'pairs-hit-target', label: '각 짝의 합 = target',
        passed: pairs.every(p => items[p[0]] + items[p[1]] === target) },
      { id: 'unique-grouping', label: '짝 나누기가 유일(열거)', passed: groupings.length === 1,
        detail: groupings.length + ' grouping(s)' }
    ],
    solutionSpace: { candidates: groupings.length, description: '합이 target인 짝으로 전부 나누는 방법의 수' }
  });
}

/* ============================================================
   계열 5 — 자리 이동 (place-shift)
   무엇이 움직이나: ×10으로 자릿수가 통째로 한 칸 왼쪽으로 옮겨가고,
   그만큼 보정(원래 수 한 번 빼기)이 붙는다.
   모델: 자릿값 칸(column). 칸 폭은 숫자 한 글자 칩 폭이고, 칸 index로
   x가 정해진다 — "한 칸 왼쪽"이 곧 이동량 delta = COLW.
   ============================================================ */
function buildPlaceShift(src, meta){
  const n = src.n, shifted = src.shifted, back = src.back, result = src.result;
  const factor = src.factor, shiftPlaces = src.shiftPlaces == null ? 1 : src.shiftPlaces;
  const dn = String(n).split(''), ds = String(shifted).split(''), dr = String(result).split('');
  const cols = Math.max(ds.length, dr.length);
  const COLW = chipW('0');
  const b = new Board();
  const colX = i => i * COLW;
  /* 오른쪽 정렬 — 자릿값이 맞아야 그림이 설명이 된다 */
  const place = (digits, rowY, idPrefix, type) => digits.map((d, i) => b.add({
    id: idPrefix + '.' + i, type: type || 'place-cell',
    frame: { x: round2(colX(cols - digits.length + i)), y: round2(rowY), width: round2(COLW), height: CHIPH },
    data: { text: d, value: Number(d), col: cols - digits.length + i }
  }));

  /* 자릿값 안내선 — 문제와 함께 처음부터 있는 격자(칠판의 세로 줄) */
  const guides = [];
  for (let i = 0; i <= cols; i++) guides.push(b.add({
    id: 'guide.' + i, type: 'place-guide',
    frame: { x: round2(colX(i)), y: 0, width: 0, height: round2(ROWH * 3 + CHIPH) },
    data: { col: i } }));

  const cap = layoutRow([{ id: 'cap', type: 'label', text: n + ' × ' + factor }], 0, -ROWH);
  cap.forEach(o => b.add(o));

  const r1 = place(dn, 0, 'n');
  const tag1 = layoutRow([{ id: 'tag.x10', type: 'label', text: '×10' }], colX(cols) + GAP, ROWH);
  tag1.forEach(o => b.add(o));
  const r2 = place(ds, ROWH, 'sh');
  const minus = layoutRow([{ id: 'minus', type: 'op', text: '−' }], colX(0) - chipW('−') - GAP, ROWH * 2);
  minus.forEach(o => b.add(o));
  const r3 = place(dn, ROWH * 2, 'back');
  b.add({ id: 'rule', type: 'rule-line',
    frame: { x: round2(colX(0) - chipW('−') - GAP), y: round2(ROWH * 3 - 12),
             width: round2(colX(cols) + chipW('−') + GAP), height: 0 }, data: {} });
  const r4 = place(dr, ROWH * 3, 'res', 'answer');
  r4.forEach(o => { o.role = 'answer'; });
  /* 이동 화살표 — 출발 칸 → 도착 칸. delta가 곧 COLW × shiftPlaces */
  const arrows = dn.map((d, i) => {
    const from = r1[i], to = r2[i];
    return b.add({ id: 'shift.' + i, type: 'shift-arrow',
      frame: { x: round2(Math.min(from.frame.x, to.frame.x)), y: round2(from.frame.y + CHIPH),
               width: round2(Math.abs(to.frame.x - from.frame.x) + COLW), height: round2(ROWH - CHIPH) },
      data: { fromId: from.id, toId: to.id, dx: round2(to.frame.x - from.frame.x) } });
  });
  r2[r2.length - 1].data.isNewZero = true;
  /* 등장 방향 — 옮겨온 자릿수는 "출발 칸에서 도착 칸으로" 들어온다.
     delta는 두 frame의 차이라서 렌더러가 좌표를 다시 짐작할 필요가 없다. */
  r1.forEach((from, i) => {
    const to = r2[i];
    to.data.enterFrom = { dx: round2(from.frame.x - to.frame.x), dy: round2(from.frame.y - to.frame.y) };
  });

  const b1ids = ['cap'].concat(guides.map(o => o.id), r1.map(o => o.id));
  b.beat({ id: 'b1', phase: 'problem', durationMs: 1200, targetIds: b1ids,
    actions: [{ type: 'draw', targetIds: b1ids }],
    narration: nar(n + ' × ' + factor + josaEul(factor) + ' 자릿값 칸에 놓아요.',
                   'Put ' + n + ' × ' + factor + ' into place-value columns.',
                   '把 ' + n + ' × ' + factor + ' 放进数位格。') });
  const b2ids = r2.map(o => o.id).concat(arrows.map(o => o.id), ['tag.x10']);
  b.beat({ id: 'b2', phase: 'explore', durationMs: 1600, targetIds: b2ids,
    actions: [{ type: 'move', targetIds: r2.map(o => o.id) },
              { type: 'draw', targetIds: arrows.map(o => o.id).concat(['tag.x10']) }],
    narration: nar('×10 — 숫자가 통째로 한 칸 왼쪽으로 가고 일의 자리에 0이 들어와요. ' + shifted + '.',
                   '×10 — every digit slides one column left and a 0 fills the ones place. ' + shifted + '.',
                   '×10 —— 每个数字整体左移一格，个位补0。' + shifted + '。') });
  const b3ids = r3.map(o => o.id).concat(['minus', 'rule']);
  b.beat({ id: 'b3', phase: 'solve', durationMs: 1600, targetIds: b3ids,
    actions: [{ type: 'draw', targetIds: b3ids }],
    narration: nar(factor + '묶음은 10묶음보다 1묶음 적어요. 그래서 ' + n + josaEul(n) + ' 한 번 빼요.',
                   factor + ' groups is one group short of ten groups — so subtract ' + n + ' once.',
                   factor + '组比10组少1组，所以减去' + n + '一次。') });
  b.beat({ id: 'b4', phase: 'answer', durationMs: 1600, targetIds: r4.map(o => o.id),
    actions: [{ type: 'reveal-answer', targetIds: r4.map(o => o.id) }],
    narration: nar('빼고 나면 ' + shifted + ' − ' + back + ' = ' + result + '. 이게 답이에요.',
                   'After the subtraction, ' + shifted + ' − ' + back + ' = ' + result + '. That is the answer.',
                   '减完之后 ' + shifted + ' − ' + back + ' = ' + result + '。这就是答案。') });

  const scene = b.finish();
  return finishManifest(b, scene, 'place-shift', meta, {
    answerRevealBeatId: 'b4',
    checks: [
      { id: 'shift-is-times-ten', label: 'shifted = n × 10^shiftPlaces', passed: shifted === n * Math.pow(10, shiftPlaces) },
      { id: 'compensate-back', label: 'shifted − back = result', passed: shifted - back === result },
      { id: 'result-is-answer', label: 'result = n × factor', passed: result === n * factor },
      { id: 'digits-drawn-match', label: '그린 자릿수 = 실제 수',
        passed: r1.map(o => o.data.text).join('') === String(n)
             && r2.map(o => o.data.text).join('') === String(shifted)
             && r3.map(o => o.data.text).join('') === String(back)
             && r4.map(o => o.data.text).join('') === String(result) }
    ],
    solutionSpace: { candidates: countPlaceShiftSolutions(shifted, back),
                     description: 'shifted − back = r 을 만족하는 r (0..shifted 전수)' }
  });
}
function countPlaceShiftSolutions(shifted, back){
  let c = 0;
  for (let r = 0; r <= shifted; r++) if (shifted - back === r) c++;
  return c;
}

/* ============================================================
   계열 8 — 표기 바꾸기 (notation)  §13 기호 도감
   무엇이 움직이나: 같은 값의 두 표기(묶은 표기 ↔ 펼친 표기)를 나란히 두고
   "숫자는 숫자끼리, 문자는 문자끼리"가 어디에 대응하는지 보인다.
   모델: 네 개의 lane(묶은 식 / 펼친 식 / 숫자 lane / 문자 lane)을 같은 x
   원점에 세로로 정렬한다. x는 전부 칩 폭 누적에서 나온다.
   ============================================================ */
/* 표기 규약은 생성기(threads/mid2.js monoTex)의 것을 그대로 따른다 —
   같은 유닛에서 문항과 그림의 표기가 다르면 그것부터가 오류다.
   · 계수의 절댓값이 1이고 문자가 있으면 1을 쓰지 않는다 (−1x가 아니라 −x)
   · 음수 계수가 앞항이 아니면 괄호를 씌운다 (… × (−1))
   부호는 칩 밖의 연산자 토큰으로 두어, 칩에는 늘 절댓값만 적힌다. */
function signChips(prefix, v, type, paren, lane){
  const out = [];
  if (paren && v < 0) out.push({ id: prefix + '.lp', type: 'op', text: '(', gap: 2 });
  if (v < 0) out.push({ id: prefix + '.neg', type: 'op', text: '−', gap: 2 });
  out.push({ id: prefix + '.c', type: type, text: String(Math.abs(v)),
             data: { value: Math.abs(v), signed: v, lane: lane || 'number' }, gap: paren && v < 0 ? 2 : GAP });
  if (paren && v < 0) out.push({ id: prefix + '.rp', type: 'op', text: ')' });
  return out;
}
function monoTokens(prefix, c, e, paren){
  const out = [];
  const wrap = paren && c < 0;
  const absC = Math.abs(c);
  if (wrap) out.push({ id: prefix + '.lp', type: 'op', text: '(', gap: 2 });
  if (c < 0) out.push({ id: prefix + '.neg', type: 'op', text: '−', gap: 2 });
  if (e === 0 || absC !== 1) {
    out.push({ id: prefix + '.c', type: 'coef-chip', text: String(absC),
               data: { value: absC, signed: c, lane: 'number' }, gap: e > 0 ? 1 : (wrap ? 2 : GAP) });
  }
  if (e > 0) {
    out.push({ id: prefix + '.x', type: 'letter-chip', text: 'x', width: chW('x') + 8,
               data: { lane: 'letter' }, gap: 0 });
    if (e !== 1) out.push({ id: prefix + '.e', type: 'exp-chip', text: String(e),
      width: chW(String(e)) * 0.72 + 6, data: { exponent: true, value: e, lane: 'letter' },
      gap: wrap ? 2 : GAP });
  }
  if (wrap) out.push({ id: prefix + '.rp', type: 'op', text: ')' });
  return out;
}
function expandTokens(prefix, c, e, paren){
  const out = [];
  const wrap = paren && c < 0;
  if (wrap) out.push({ id: prefix + '.lp', type: 'op', text: '(', gap: 2 });
  if (c < 0) out.push({ id: prefix + '.neg', type: 'op', text: '−', gap: 2 });
  out.push({ id: prefix + '.n', type: 'coef-chip', text: String(Math.abs(c)),
             data: { value: Math.abs(c), signed: c, lane: 'number' } });
  for (let i = 0; i < e; i++) {
    out.push({ id: prefix + '.dot' + i, type: 'op', text: '·', gap: 4 });
    out.push({ id: prefix + '.x' + i, type: 'letter-chip', text: 'x', width: chW('x') + 8,
               data: { lane: 'letter' }, gap: 4 });
  }
  if (wrap) out.push({ id: prefix + '.rp', type: 'op', text: ')' });
  return out;
}
/* 문자 lane 한 항 — 계수 없이 x^e 만. e가 0이면 문자가 사라지므로 1로 쓴다. */
function letterOnly(prefix, e){
  return e > 0 ? monoTokens(prefix, 1, e, false)
               : [{ id: prefix + '.one', type: 'coef-chip', text: '1', data: { value: 1, lane: 'letter' } }];
}

function buildNotation(src, meta){
  const op = src.op;                                   /* 'mul' | 'div' */
  const A = src.a, B = src.b, coeff = src.coeff, exp = src.exp;
  const opTex = op === 'mul' ? '×' : '÷';
  const b = new Board();

  /* 행0 — 묶은 표기(문제). 뒤항이 음수면 괄호(생성기 monoTex와 같은 규약) */
  const t0 = monoTokens('m0a', A.c, A.e, false)
    .concat([{ id: 'm0.op', type: 'op', text: opTex }], monoTokens('m0b', B.c, B.e, true));
  const row0 = layoutRow(t0, 0, 0); row0.forEach(o => b.add(o));

  /* 행1 — 펼친 표기 */
  const t1 = expandTokens('e1a', A.c, A.e, false)
    .concat([{ id: 'e1.op', type: 'op', text: opTex }], expandTokens('e1b', B.c, B.e, true));
  const row1 = layoutRow(t1, 0, ROWH); row1.forEach(o => b.add(o));

  /* 행2 — 숫자 lane */
  const numRes = op === 'mul' ? A.c * B.c : A.c / B.c;
  const t2 = [
    /* lane 표시는 색 점이다 — 그림 안에는 글자를 넣지 않는다(3개 언어 공용,
       기존 story 삽화 규칙과 같다). "숫자끼리/문자끼리"는 서술이 말한다. */
    { id: 'ln.tag', type: 'lane-dot', text: '', width: CHIPH * 0.5, data: { lane: 'number' } }
  ].concat(signChips('ln.a', A.c, 'coef-chip', false),
           [{ id: 'ln.op', type: 'op', text: opTex }],
           signChips('ln.b', B.c, 'coef-chip', true),
           [{ id: 'ln.eq', type: 'op', text: '=' }],
           signChips('ln.r', numRes, 'sum-chip', false));
  const row2 = layoutRow(t2, 0, ROWH * 2); row2.forEach(o => b.add(o));

  /* 행3 — 문자 lane */
  const t3 = [{ id: 'll.tag', type: 'lane-dot', text: '', width: CHIPH * 0.5, data: { lane: 'letter' } }]
    .concat(letterOnly('ll.a', A.e), [{ id: 'll.op', type: 'op', text: opTex }],
            letterOnly('ll.b', B.e), [{ id: 'll.eq', type: 'op', text: '=' }],
            letterOnly('ll.r', exp));
  const row3 = layoutRow(t3, 0, ROWH * 3); row3.forEach(o => b.add(o));

  /* 행4 — 답(묶은 표기로 되돌아온다) */
  const t4 = [{ id: 'ans.eq', type: 'op', text: '=' }].concat(
    monoTokens('ans', coeff, exp, false).map(tk => Object.assign({}, tk, { role: 'answer' })));
  const row4 = layoutRow(t4, 0, ROWH * 4); row4.forEach(o => b.add(o));
  const answerIds = row4.filter(o => o.role === 'answer').map(o => o.id);

  const expLaw = op === 'mul' ? (A.e + ' + ' + B.e + ' = ' + exp) : (A.e + ' − ' + B.e + ' = ' + exp);
  b.beat({ id: 'b1', phase: 'problem', durationMs: 1200, targetIds: row0.map(o => o.id),
    actions: [{ type: 'draw', targetIds: row0.map(o => o.id) }],
    narration: nar('묶어 쓴 표기예요. 이대로는 무엇끼리 계산하는지 안 보여요.',
                   'This is the compact notation — it hides what combines with what.',
                   '这是简写形式，看不出谁和谁计算。') });
  b.beat({ id: 'b2', phase: 'explore', durationMs: 1600, targetIds: row1.map(o => o.id),
    actions: [{ type: 'draw', targetIds: row1.map(o => o.id) }],
    narration: nar('같은 값을 펼쳐 써요. 숫자와 문자가 따로 보여요.',
                   'Write the same value expanded — now numbers and letters are separate.',
                   '把同一个值展开写，数字和字母就分开了。') });
  b.beat({ id: 'b3', phase: 'solve', durationMs: 1600, targetIds: row2.map(o => o.id),
    actions: [{ type: 'draw', targetIds: row2.map(o => o.id) }],
    narration: nar('숫자는 숫자끼리: ' + A.c + ' ' + opTex + ' ' + B.c + ' = ' + numRes + '.',
                   'Numbers with numbers: ' + A.c + ' ' + opTex + ' ' + B.c + ' = ' + numRes + '.',
                   '数字归数字：' + A.c + ' ' + opTex + ' ' + B.c + ' = ' + numRes + '。') });
  b.beat({ id: 'b4', phase: 'solve', durationMs: 1600, targetIds: row3.map(o => o.id),
    actions: [{ type: 'count', targetIds: row3.map(o => o.id) }],
    narration: nar('문자는 문자끼리: x를 세면 ' + expLaw + '.',
                   "Letters with letters: count the x's — " + expLaw + '.',
                   '字母归字母：数一数x —— ' + expLaw + '。') });
  b.beat({ id: 'b5', phase: 'answer', durationMs: 1600, targetIds: row4.map(o => o.id),
    actions: [{ type: 'reveal-answer', targetIds: answerIds }, { type: 'draw', targetIds: row4.map(o => o.id) }],
    narration: nar('다시 묶어 쓰면 답이에요.', 'Fold it back into compact notation — that is the answer.', '再写回简写形式就是答案。') });

  const scene = b.finish();
  return finishManifest(b, scene, 'notation', meta, {
    answerRevealBeatId: 'b5',
    checks: [
      { id: 'coeff-lane', label: '계수 lane 결과 = coeff', passed: numRes === coeff },
      { id: 'exp-lane', label: '지수 lane 결과 = exp', passed: (op === 'mul' ? A.e + B.e : A.e - B.e) === exp },
      { id: 'expanded-count', label: '펼친 x 개수 = 두 지수의 합',
        passed: row1.filter(o => o.type === 'letter-chip').length === A.e + B.e }
    ],
    solutionSpace: { candidates: countNotationSolutions(A, B, op),
                     description: 'coeff·x^exp 가 펼친 식과 x=2,3,5,7,11 에서 모두 같아지는 (coeff, exp)' }
  });
}
/* 단일 정답 열거 — 설계 의도가 아니라 후보를 전부 훑어서 센다. */
function countNotationSolutions(A, B, op){
  const xs = [2, 3, 5, 7, 11];
  const tc = op === 'mul' ? A.c * B.c : A.c / B.c;
  const te = op === 'mul' ? A.e + B.e : A.e - B.e;
  const truth = xs.map(x => tc * Math.pow(x, te));
  let c = 0;
  for (let coeff = -200; coeff <= 200; coeff++) {
    if (coeff === 0) continue;
    for (let e = 0; e <= 20; e++) {
      let ok = true;
      for (let i = 0; i < xs.length; i++) {
        if (Math.abs(coeff * Math.pow(xs[i], e) - truth[i]) > 1e-6) { ok = false; break; }
      }
      if (ok) c++;
    }
  }
  return c;
}

/* ── manifest 마감 ─────────────────────────────────────────── */
function finishManifest(b, scene, archetype, meta, extra){
  const beatIds = b.beats.map(x => x.id);
  return {
    schemaVersion: 1,
    lessonId: meta.lessonId,
    title: meta.title,
    language: 'ko',
    audience: meta.audience || 'elementary',
    rights: { publication: 'public', assetRights: 'original', containsThirdPartyAssets: false },
    problem: {
      prompt: meta.prompt || '',
      responseType: 'concept-demo',
      verifiedAnswer: String(meta.verifiedAnswer),
      answerRevealBeatId: extra.answerRevealBeatId
    },
    scene: { width: scene.width, height: scene.height, archetype: archetype },
    objects: b.objects,
    beats: b.beats.map(x => Object.assign({}, x, { narration: x.narration.ko, narrationI18n: x.narration })),
    modes: {
      fullPlay: { beatIds: beatIds },
      stepByStep: { beatIds: beatIds },
      finalOverview: { visibleObjectIds: b.objects.map(o => o.id) }
    },
    mathChecks: extra.checks.map(c => Object.assign({ passed: false }, c)),
    numberScene: { archetype: archetype, generator: meta.generator, source: meta.source,
                   solutionSpace: extra.solutionSpace },
    review: { status: 'locked', lockReason: '2단계 프로토타입 — 원장 확인 전' }
  };
}

/* ============================================================
   생성기 → 계열 매핑 (§4 "10줄 안팎의 선언적 매핑")
   유닛당 하는 일은 이 표 한 줄이다. 장면을 새로 디자인하지 않는다.
   stage = 이 장면이 붙을 discover 단계 index(0-based).
   ============================================================ */
const MAP = {
  'A-05': [{ stage: 1, generator: 'comp100', params: { level: 'main' }, archetype: 'group',
             from: p => ({ items: p.nums, target: p.target, total: p.sum }),
             answer: p => p.sum,
             title: { ko: '짝을 찾아 묶기', en: 'Group the pairs', zh: '找出配对圈起来' } }],
  'C-06': [{ stage: 1, generator: 'ml_x9', params: { level: 'main' }, archetype: 'place-shift',
             from: p => p.scene, answer: p => p.answer,
             title: { ko: '×10 하고 한 번 빼기', en: '×10, then subtract once', zh: '×10再减一次' } }],
  'M-11': [{ stage: 0, generator: 'md11_monoMulDiv', params: { mode: 'mul' }, archetype: 'notation',
             from: p => p.scene, answer: p => p.answer.join(' · '),
             title: { ko: '두 표기를 나란히 (곱셈)', en: 'Two notations side by side (×)', zh: '两种表示并排（乘法）' } },
            { stage: 1, generator: 'md11_monoMulDiv', params: { mode: 'div' }, archetype: 'notation',
             from: p => p.scene, answer: p => p.answer.join(' · '),
             title: { ko: '두 표기를 나란히 (나눗셈)', en: 'Two notations side by side (÷)', zh: '两种表示并排（除法）' } }]
};

const BUILDERS = { group: buildGroup, 'place-shift': buildPlaceShift, notation: buildNotation };

/* 유닛 하나의 한 stage에 대한 장면을 만든다. problem은 이미 뽑아 둔
   생성기 반환값이다 — 장면은 그 값에서만 나온다(산문에서 베끼지 않는다). */
function buildFor(unitId, stageIndex, problem, unitTitle){
  const cfg = (MAP[unitId] || []).filter(c => c.stage === stageIndex)[0];
  if (!cfg) return null;
  const src = cfg.from(problem);
  if (!src) throw new Error(unitId + ' stage ' + stageIndex + ': 생성기가 scene 필드를 내보내지 않았다 ' +
    '(tex 파싱 금지 — 생성기에 scene:{}를 추가할 것)');
  const build = BUILDERS[cfg.archetype];
  if (!build) throw new Error('미구현 계열: ' + cfg.archetype);
  return build(src, {
    lessonId: unitId + '.s' + stageIndex,
    title: unitTitle || unitId,
    generator: cfg.generator,
    prompt: (problem.prompt && (problem.prompt.ko || problem.prompt)) || '',
    verifiedAnswer: cfg.answer(problem),
    source: src,
    audience: unitId.charAt(0) === 'M' ? 'middle' : 'elementary'
  });
}

function configsFor(unitId){ return (MAP[unitId] || []).slice(); }
function configFor(unitId, stageIndex){ return (MAP[unitId] || []).filter(c => c.stage === stageIndex)[0] || null; }

const API = {
  MAP: MAP, BUILDERS: BUILDERS, buildFor: buildFor, configsFor: configsFor, configFor: configFor,
  enumerateGroupings: enumerateGroupings,
  metrics: { FS: FS, ADV: ADV, PADX: PADX, PADY: PADY, GAP: GAP, ROWH: ROWH, PAD: PAD, CHIPH: CHIPH },
  ARCHETYPES: ['group', 'transfer', 'split', 'compensate', 'place-shift', 'partial-product', 'pair-sum', 'notation']
};
global.NM_SCENE = API;
if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
