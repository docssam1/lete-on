#!/usr/bin/env node
/* ============================================================
   개념 애니메이션 검사기 — 개념애니-설계.md §6 · §6-2
   실행: node number_magic/scripts/check-concept-scenes.js [시드수]
        (실패하면 exit 1)

   왜 있나: 85유닛을 눈으로 다 볼 수 없고, 생성기는 매번 다른 수를 낸다.
   "한 번 맞은 것"은 근거가 못 되므로 시드를 여러 개 돌린다(§6 마지막 줄).

   검사 항목 (§6)
   1. 모든 beat의 targetIds가 실재하는 객체를 가리키는가
   2. 장면의 수치가 생성기 반환값과 일치하는가  ← 그림이 문제와 다른 수를 그리면 실패
   3. 계열별 보존식 (묶기: 부분합의 합 = 전체합 / 자리이동: shifted−back=result /
      표기: 두 표기의 값이 같은가)
   4. beat 순서가 fullPlay·stepByStep에서 동일한가
   5. 정답 객체가 답 beat 이전에 드러나지 않는가
   6. 3개 언어 서술 존재 + 언어 혼입 없음
   §6-2 추가
   7. 단일 정답 — 후보를 전부 훑어 정확히 하나인지 센다(설계 의도 금지)
   8. 렌더 — SVG 문자열이 실제로 나오고, 그린 숫자가 생성기 값과 같고,
      좌표가 장면 밖으로 안 나가고, 마지막 beat 상태(=인쇄 한 장)에
      모든 객체가 들어 있는가
   9. G·MAP 계약 — skills/gmap-animated-math-lesson의 validate_scene_manifest.py를
      그대로 태운다(있으면).

   음성 대조(negative control)는 --negative 로 돌린다: 검사기가 실제로
   잡는지 보려고 장면을 일부러 망가뜨린 뒤 각 검사가 실패하는지 확인한다.
   ============================================================ */
'use strict';
const path = require('path');
const fs = require('fs');
const os = require('os');
const { execFileSync } = require('child_process');

const NM = path.join(__dirname, '..');
const ROOT = path.join(NM, '..');

/* ── 브라우저 전용 전역을 흉내 내 실제 엔진을 그대로 싣는다 ── */
global.window = global;
function loadScript(rel){
  const code = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  // eslint-disable-next-line no-new-func
  new Function(code).call(global);
}
loadScript('number_magic/engine/generators.js');
loadScript('number_magic/engine/rng.js');
loadScript('number_magic/engine/threads/ml.js');
loadScript('number_magic/engine/threads/mid2.js');
loadScript('geometry/worksheet/render.js');
loadScript('number_magic/engine/scene-model.js');
loadScript('number_magic/app/concept-anim.js');

const NM_SCENE = global.NM_SCENE, NM_CANIM = global.NM_CANIM;
const NM_GEN = global.NM_GEN, NM_TGEN = global.NM_TGEN, NM_RNG = global.NM_RNG;

/* ── 결과 집계 ─────────────────────────────────────────────── */
let PASS = 0;
const FAILS = [];
function ck(name, cond, detail){
  if (cond) { PASS++; return true; }
  FAILS.push(name + (detail ? ' — ' + detail : ''));
  return false;
}

/* ── 생성기 호출 (app/main.js의 genProblem과 같은 규칙) ────── */
function genProblem(cfg, seed){
  const g = NM_GEN[cfg.generator];
  if (g) return g(Object.assign({ level: 'main' }, cfg.params || {}));
  const tg = NM_TGEN[cfg.generator];
  if (!tg) throw new Error('생성기 없음: ' + cfg.generator);
  return tg(Object.assign({ level: 'main' }, cfg.params || {}), NM_RNG.mulberry32(seed));
}

/* ── 언어 판정 ─────────────────────────────────────────────── */
const HANGUL = /[가-힣]/;
const HANZI  = /[一-鿿]/;
const KANA   = /[぀-ヿ]/;

/* ── 장면 하나 검사 ────────────────────────────────────────── */
function checkScene(unitId, stage, seed, mutate){
  const cfg = NM_SCENE.configFor(unitId, stage);
  const p = genProblem(cfg, seed);
  const man = NM_SCENE.buildFor(unitId, stage, p, unitId);
  if (mutate) mutate(man, p);
  const tag = unitId + '.s' + stage + '#' + seed;

  const ids = {};
  man.objects.forEach(o => { ids[o.id] = o; });

  /* 1 — targetIds 실재 */
  let dangling = [];
  man.beats.forEach(b => {
    b.targetIds.forEach(t => { if (!ids[t]) dangling.push(b.id + ':' + t); });
    (b.actions || []).forEach(a => (a.targetIds || []).forEach(t => { if (!ids[t]) dangling.push(b.id + ':' + t); }));
  });
  ck(tag + ' targetIds 실재', dangling.length === 0, dangling.join(','));

  /* 2 — 그림의 수치 = 생성기 반환값 */
  const drawn = man.objects.filter(o => o.data && o.data.text !== undefined && o.data.text !== '')
                           .map(o => String(o.data.text));
  if (man.numberScene.archetype === 'group') {
    const shown = man.objects.filter(o => o.type === 'num-chip' && /^num\./.test(o.id)).map(o => o.data.value);
    ck(tag + ' 원본 구조(수 목록)', JSON.stringify(shown) === JSON.stringify(p.nums),
       'drawn=' + shown.join(',') + ' gen=' + p.nums.join(','));
    const totalObj = man.objects.filter(o => o.role === 'answer')[0];
    ck(tag + ' 원본 구조(합)', totalObj && totalObj.data.value === p.sum,
       totalObj && (totalObj.data.value + ' vs ' + p.sum));
    const arcs = man.objects.filter(o => o.type === 'pair-arc');
    ck(tag + ' 호가 실제 짝을 가리킴',
       arcs.every(a => a.data.members[0] + a.data.members[1] === p.target && a.data.value === p.target));
    /* 3 — 보존 */
    ck(tag + ' 보존(부분합 합 = 전체합)',
       arcs.reduce((s, a) => s + a.data.value, 0) === p.sum);
  } else if (man.numberScene.archetype === 'place-shift') {
    const sc = p.scene;
    const rowOf = pre => man.objects.filter(o => o.id.indexOf(pre + '.') === 0)
      .sort((a, b) => a.frame.x - b.frame.x).map(o => o.data.text).join('');
    ck(tag + ' 원본 구조(n)', rowOf('n') === String(sc.n), rowOf('n') + ' vs ' + sc.n);
    ck(tag + ' 원본 구조(×10)', rowOf('sh') === String(sc.shifted), rowOf('sh') + ' vs ' + sc.shifted);
    ck(tag + ' 원본 구조(빼는 수)', rowOf('back') === String(sc.back));
    ck(tag + ' 원본 구조(답)', rowOf('res') === String(sc.result), rowOf('res') + ' vs ' + sc.result);
    ck(tag + ' 원본 구조(답=문항 정답)', sc.result === p.answer);
    /* 3 — 보존 */
    ck(tag + ' 보존(shifted − back = result)', sc.shifted - sc.back === sc.result);
    ck(tag + ' 보존(shifted = n×10)', sc.shifted === sc.n * 10);
    /* 자리 이동량이 정확히 한 칸인가 — 눈대중이 아니라 delta로 확인 */
    const cells = man.objects.filter(o => o.data && o.data.enterFrom);
    const colw = man.objects.filter(o => o.type === 'place-guide')[1].frame.x
               - man.objects.filter(o => o.type === 'place-guide')[0].frame.x;
    ck(tag + ' 이동량 = 정확히 한 칸',
       /* enterFrom.dx = 출발 x − 도착 x. 도착이 한 칸 왼쪽이므로 +COLW여야 한다. */
       cells.length > 0 && cells.every(o => Math.abs(o.data.enterFrom.dx - colw) < 0.05),
       'colw=' + colw);
  } else if (man.numberScene.archetype === 'notation') {
    const sc = p.scene;
    const xs = man.objects.filter(o => o.type === 'letter-chip' && o.id.indexOf('e1') === 0).length;
    ck(tag + ' 원본 구조(펼친 x 개수)', xs === sc.a.e + sc.b.e, xs + ' vs ' + (sc.a.e + sc.b.e));
    /* 그린 숫자 칩을 하나도 빠짐없이 생성기 값과 대조한다. id별로 무엇이
       적혀 있어야 하는지 표로 못박아 두면, 아무 칩이나 한 글자 바뀌어도 잡힌다.
       (음성 대조에서 "그린 수를 바꾼다"가 표기 장면만 못 잡던 구멍을 메운 것) */
    /* 칩에는 절댓값만 적고 부호는 별도 연산자 토큰이다(생성기 monoTex 규약). */
    const abs = v => String(Math.abs(v));
    const want = {
      'm0a.c': abs(sc.a.c), 'm0a.e': String(sc.a.e),
      'm0b.c': abs(sc.b.c), 'm0b.e': String(sc.b.e),
      'e1a.n': abs(sc.a.c), 'e1b.n': abs(sc.b.c),
      'ln.a.c': abs(sc.a.c), 'ln.b.c': abs(sc.b.c), 'ln.r.c': abs(p.answer[0]),
      'll.a.e': String(sc.a.e), 'll.b.e': String(sc.b.e), 'll.r.e': String(p.answer[1]),
      'ans.c': abs(p.answer[0]), 'ans.e': String(p.answer[1])
    };
    /* 부호는 칩 밖에 있으므로 따로 확인한다 — 부호가 빠지면 답이 통째로 달라진다. */
    [['m0a', sc.a.c], ['m0b', sc.b.c], ['e1a', sc.a.c], ['e1b', sc.b.c],
     ['ln.a', sc.a.c], ['ln.b', sc.b.c], ['ln.r', p.answer[0]], ['ans', p.answer[0]]
    ].forEach(([pre, v]) => {
      const hasNeg = !!ids[pre + '.neg'];
      ck(tag + ' 부호 표기(' + pre + ')', hasNeg === (v < 0), 'neg=' + hasNeg + ' value=' + v);
    });
    /* 앞항이 아닌 음수 항에는 괄호가 있어야 한다(생성기 monoTex와 같은 규약). */
    ck(tag + ' 뒤항 음수 괄호', (!!ids['m0b.lp']) === (sc.b.c < 0));
    /* 지수가 0이면 문자가 사라지므로 그 lane은 1을 쓴다(x⁰=1). 나눗셈에서
       m===n일 때 실제로 나오는 정상 경우라, 이 칩도 대조표에 넣는다. */
    if (sc.a.e === 0) want['ll.a.one'] = '1';
    if (sc.b.e === 0) want['ll.b.one'] = '1';
    if (p.answer[1] === 0) want['ll.r.one'] = '1';
    let bad = [];
    Object.keys(want).forEach(id => {
      const o = ids[id];
      if (o && String(o.data.text) !== want[id]) bad.push(id + '="' + o.data.text + '" 기대=' + want[id]);
    });
    ck(tag + ' 원본 구조(모든 숫자 칩)', bad.length === 0, bad.join(' '));
    /* 표에 없는 숫자 칩이 몰래 늘어나는 것도 막는다 */
    const numeric = man.objects.filter(o => /^(coef-chip|exp-chip|sum-chip)$/.test(o.type));
    const unlisted = numeric.filter(o => want[o.id] === undefined).map(o => o.id);
    ck(tag + ' 대조표에 없는 숫자 칩 없음', unlisted.length === 0, unlisted.join(','));
    /* 3 — 보존: 두 표기가 x=2,3,5,7 에서 같은 값 */
    const okVals = [2, 3, 5, 7].every(x => {
      const lhs = (sc.op === 'mul' ? sc.a.c * sc.b.c : sc.a.c / sc.b.c) *
                  Math.pow(x, sc.op === 'mul' ? sc.a.e + sc.b.e : sc.a.e - sc.b.e);
      return Math.abs(lhs - p.answer[0] * Math.pow(x, p.answer[1])) < 1e-6;
    });
    ck(tag + ' 보존(두 표기의 값이 같음)', okVals);
  }

  /* mathChecks 전부 통과 */
  man.mathChecks.forEach(c => ck(tag + ' mathCheck:' + c.id, c.passed === true, c.detail || ''));

  /* 4 — beat 순서 동일 */
  const order = man.beats.map(b => b.id);
  ck(tag + ' beat 순서(fullPlay)', JSON.stringify(man.modes.fullPlay.beatIds) === JSON.stringify(order));
  ck(tag + ' beat 순서(stepByStep)', JSON.stringify(man.modes.stepByStep.beatIds) === JSON.stringify(order));

  /* 5 — 정답이 답 beat 이전에 안 나온다 */
  const answerIds = man.objects.filter(o => o.role === 'answer').map(o => o.id);
  ck(tag + ' 정답 객체 존재', answerIds.length > 0);
  const ai = order.indexOf(man.problem.answerRevealBeatId);
  let early = [];
  man.beats.forEach((b, i) => {
    if (i >= ai) return;
    const t = b.targetIds.concat([].concat.apply([], (b.actions || []).map(a => a.targetIds || [])));
    t.forEach(x => { if (answerIds.indexOf(x) >= 0) early.push(b.id + ':' + x); });
  });
  ck(tag + ' 정답 조기 노출 없음', early.length === 0, early.join(','));
  ck(tag + ' 답 beat phase=answer', man.beats[ai].phase === 'answer');

  /* 6 — 3개 언어 + 언어 혼입 없음 */
  man.beats.forEach(b => {
    const n = b.narrationI18n;
    ck(tag + ' ' + b.id + ' 3개 언어', !!(n && n.ko && n.en && n.zh));
    if (!n) return;
    ck(tag + ' ' + b.id + ' ko에 한글', HANGUL.test(n.ko));
    ck(tag + ' ' + b.id + ' en에 한글/한자 없음', !HANGUL.test(n.en) && !HANZI.test(n.en) && !KANA.test(n.en), n.en);
    ck(tag + ' ' + b.id + ' zh에 한글 없음', !HANGUL.test(n.zh), n.zh);
    ck(tag + ' ' + b.id + ' zh에 한자 있음', HANZI.test(n.zh), n.zh);
  });

  /* 7 — 단일 정답: 후보 전수 열거 결과가 정확히 1 */
  ck(tag + ' 단일 정답(열거)', man.numberScene.solutionSpace.candidates === 1,
     man.numberScene.solutionSpace.description + ' = ' + man.numberScene.solutionSpace.candidates);

  /* 8 — 렌더 */
  const svg = NM_CANIM.renderScene(man);
  ck(tag + ' SVG 생성', /^<svg /.test(svg) && svg.length > 200);
  ck(tag + ' SVG에 NaN/undefined 없음', !/NaN|undefined/.test(svg), (svg.match(/NaN|undefined/) || [''])[0]);
  /* 그린 글자가 생성기 값과 같은가 — SVG 텍스트를 다시 읽어서 대조한다 */
  const svgText = (svg.match(/>([^<>]+)<\/text>/g) || []).map(s => s.replace(/^>|<\/text>$/g, ''));
  drawn.forEach(d => { if (!svgText.includes(d)) FAILS.push(tag + ' SVG에 안 그려진 값: ' + d); });
  PASS++;
  /* 좌표가 장면 안에 */
  const out = man.objects.filter(o => o.frame.x < 0 || o.frame.y < 0 ||
    o.frame.x + o.frame.width > man.scene.width + 0.01 || o.frame.y + o.frame.height > man.scene.height + 0.01);
  ck(tag + ' 좌표가 장면 안', out.length === 0, out.map(o => o.id).join(','));
  /* 마지막 beat 상태 = 인쇄 한 장. 모든 객체가 그때까지 등장해야 한다. */
  const born = {};
  man.beats.forEach((b, i) => {
    b.targetIds.forEach(id => { if (born[id] == null) born[id] = i; });
    (b.actions || []).forEach(a => (a.targetIds || []).forEach(id => { if (born[id] == null) born[id] = i; }));
  });
  const never = man.objects.filter(o => born[o.id] == null).map(o => o.id);
  ck(tag + ' 인쇄 한 장에 모든 객체', never.length === 0, never.join(','));
  ck(tag + ' finalOverview = 전 객체',
     man.modes.finalOverview.visibleObjectIds.length === man.objects.length);
  /* 칠판 규칙 — beat마다 "새로 그려지는 묶음"이 하나(= 한 행/한 호/한 줄)여야 한다.
     새로 등장하는 객체가 여러 행에 걸치면 눈이 갈 곳이 둘이 된다. */
  man.beats.forEach((b, i) => {
    const fresh = man.objects.filter(o => born[o.id] === i);
    const rows = {};
    fresh.forEach(o => { rows[Math.round(o.frame.y / 10)] = 1; });
    const rowCount = Object.keys(rows).length;
    ck(tag + ' ' + b.id + ' 새로 그리는 것이 한 덩이', rowCount <= 2,
       rowCount + '개의 서로 다른 y대');
  });

  return man;
}

/* ── G·MAP 계약 검사기(파이썬)를 그대로 태운다 ─────────────── */
function runGmapValidator(manifests){
  const script = path.join(ROOT, 'skills/gmap-animated-math-lesson/scripts/validate_scene_manifest.py');
  if (!fs.existsSync(script)) { console.log('  (G·MAP validator 없음 — 건너뜀)'); return; }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'nmscene-'));
  let ok = 0;
  manifests.forEach((m, i) => {
    const f = path.join(dir, 'lesson' + i + '.scene.json');
    fs.writeFileSync(f, JSON.stringify(m, null, 1));
    try { execFileSync('python3', [script, f], { stdio: 'pipe' }); ok++; PASS++; }
    catch (e) { FAILS.push('gmap validator ' + m.lessonId + ': ' + String(e.stderr || e).trim()); }
  });
  console.log('  G·MAP validator: ' + ok + '/' + manifests.length + ' 통과');
}

/* ── 음성 대조 — 일부러 망가뜨리고 검사기가 잡는지 본다 ────── */
const MUTATIONS = [
  ['그린 수를 바꾼다(원본 구조)', man => {
    const o = man.objects.filter(x => x.data && x.data.text && /^[0-9]+$/.test(x.data.text))[0];
    o.data.text = String(Number(o.data.text) + 1); if (o.data.value != null) o.data.value += 1;
  }],
  ['보존식을 깬다', man => {
    man.mathChecks[0].passed = false;
    const a = man.objects.filter(x => x.type === 'pair-arc')[0];
    if (a) a.data.value += 1;
  }],
  ['정답을 답 beat 이전에 노출', man => {
    const aid = man.objects.filter(o => o.role === 'answer')[0].id;
    man.beats[0].targetIds = man.beats[0].targetIds.concat([aid]);
  }],
  ['beat 순서를 어긋나게', man => { man.modes.stepByStep.beatIds = man.modes.stepByStep.beatIds.slice().reverse(); }],
  ['없는 targetId를 가리킴', man => { man.beats[1].targetIds = man.beats[1].targetIds.concat(['nope.1']); }],
  ['zh 서술에 한글 혼입', man => { man.beats[0].narrationI18n.zh = '이건 한국어입니다'; }],
  ['en 서술에 한자 혼입', man => { man.beats[0].narrationI18n.en = 'mix 한자 数字'; }],
  ['3개 언어 중 하나를 지움', man => { delete man.beats[0].narrationI18n.zh; }],
  ['단일 정답을 깬다(후보 2개)', man => { man.numberScene.solutionSpace.candidates = 2; }],
  ['좌표를 장면 밖으로', man => { man.objects[0].frame.x = -50; }],
  ['등장하지 않는 객체를 남긴다(인쇄 한 장 결손)', man => {
    const id = man.objects[man.objects.length - 1].id;
    man.beats.forEach(b => {
      b.targetIds = b.targetIds.filter(t => t !== id);
      (b.actions || []).forEach(a => { a.targetIds = (a.targetIds || []).filter(t => t !== id); });
    });
  }],
  ['한 beat가 여러 행을 동시에 그림(시선 분산)', man => {
    man.beats[1].targetIds = man.objects.map(o => o.id);
  }],
  ['SVG에 NaN을 넣는다', man => { man.objects[0].frame.x = NaN; }]
];

/* ── 실행 ──────────────────────────────────────────────────── */
const negative = process.argv.indexOf('--negative') >= 0;
const SEEDS = Number(process.argv.filter(a => /^\d+$/.test(a))[0] || 60);
const TARGETS = [];
Object.keys(NM_SCENE.MAP).forEach(uid => NM_SCENE.configsFor(uid).forEach(c => TARGETS.push([uid, c.stage])));

if (!negative) {
  console.log('개념 애니메이션 검사 — ' + TARGETS.length + '개 장면 × ' + SEEDS + '시드');
  const sample = [];
  TARGETS.forEach(([uid, stage]) => {
    const before = FAILS.length;
    for (let s = 1; s <= SEEDS; s++) {
      const man = checkScene(uid, stage, s * 7919);
      if (s <= 2) sample.push(man);
    }
    console.log('  ' + uid + ' stage' + stage + ' : ' + (FAILS.length === before ? 'OK' : (FAILS.length - before) + '건 실패'));
  });
  runGmapValidator(sample);
  console.log('\n통과 ' + PASS + ' · 실패 ' + FAILS.length);
  if (FAILS.length) { FAILS.slice(0, 40).forEach(f => console.log('  ✗ ' + f)); process.exit(1); }
  console.log('전부 통과.');
} else {
  console.log('음성 대조 — 일부러 망가뜨리고 검사기가 잡는지 본다\n');
  let caught = 0;
  MUTATIONS.forEach(([name, fn]) => {
    let any = 0;
    TARGETS.forEach(([uid, stage]) => {
      const before = FAILS.length;
      try { checkScene(uid, stage, 12345, fn); } catch (e) { FAILS.push('throw: ' + e.message); }
      if (FAILS.length > before) any++;
      FAILS.length = before;   /* 다음 변이를 위해 비운다 */
    });
    const ok = any > 0;
    if (ok) caught++;
    console.log((ok ? '  ✓ 잡음   ' : '  ✗ 못 잡음 ') + name + '  (' + any + '/' + TARGETS.length + ' 장면에서 실패)');
  });
  console.log('\n' + caught + '/' + MUTATIONS.length + ' 변이를 잡았다.');
  if (caught !== MUTATIONS.length) process.exit(1);
}
