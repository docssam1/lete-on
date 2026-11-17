/* ============================================================
   Numbers of Magic — 시작점 상담 화면 (app/consult.js, 2026-11-17)
   판단은 app/consult-rules.js 가 한다. 이 파일은 묻고 보여 주기만 한다.
   보호자의 답은 이 탭 안에서만 쓰고 아무 데도 보내지 않는다(결과 복사도 보호자가 직접 누를 때만).
   ============================================================ */
(function(){
'use strict';
const R = window.NM_CONSULT_RULES, D = window.NM_CONSULT_LADDER;
const KAKAO = 'https://open.kakao.com/me/gfield';
const LANG_KEY = 'nm_landing_lang';
const $app = document.getElementById('app');

let lang = pickLang();
let state = R.newState();
let screen = 'intro';
const history = [];   // 이전 화면으로: [{screen, state}]

function pickLang(){
  const ok = v => v === 'ko' || v === 'en' || v === 'zh';
  try { const s = localStorage.getItem(LANG_KEY); if(ok(s)) return s; } catch(e){}
  try { const st = JSON.parse(localStorage.getItem('nm_state_v1') || 'null'); if(st && ok(st.lang)) return st.lang; } catch(e){}
  const n = (navigator.language || 'ko').slice(0, 2);
  return ok(n) ? n : 'ko';
}
const t = (ko, en, zh) => lang === 'en' ? en : lang === 'zh' ? zh : ko;
const L = v => v && typeof v === 'object' ? (v[lang] || v.ko || '') : String(v == null ? '' : v);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
function tex(s){
  try { return window.katex ? katex.renderToString(s, { throwOnError: false }) : esc(s); } catch(e){ return esc(s); }
}
const clone = o => JSON.parse(JSON.stringify(o));
function go(next, mutate){
  history.push({ screen, state: clone(state) });
  if(mutate) mutate();
  screen = next;
  render(true);
}
function back(){
  const h = history.pop();
  if(!h) return;
  screen = h.screen; state = h.state;
  render(true);
}
function toast(msg){
  const el = document.getElementById('toast');
  el.textContent = msg; el.classList.add('show');
  clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('show'), 2200);
}

/* ---------- 말 ---------- */
const AGE_LABEL = {
  k5: ['5세', 'Age 5', '5岁'], k6: ['6세', 'Age 6', '6岁'], k7: ['7세', 'Age 7', '7岁'],
  g1: ['초1', 'Grade 1', '小学一年级'], g2: ['초2', 'Grade 2', '小学二年级'], g3: ['초3', 'Grade 3', '小学三年级'],
  g4: ['초4', 'Grade 4', '小学四年级'], g5: ['초5', 'Grade 5', '小学五年级'], g6: ['초6', 'Grade 6', '小学六年级'],
  m: ['중학생 이상', 'Middle school or older', '初中及以上']
};
const BOOKS = [
  ['miracle', '기적의 계산법', 'Miracle Calculation (기적의 계산법)', '奇迹计算法（기적의 계산법）'],
  ['soma', '소마셈', 'Soma-sem (소마셈)', '소마셈'],
  ['kumon', '구몬수학', 'Kumon Math', '公文数学'],
  ['wolli', '원리셈', 'Wolli-sem (원리셈)', '원리셈'],
  ['dunoro', '두뇌로', 'Dunoro (두뇌로)', '두뇌로'],
  ['other', '그 밖의 연산 교재', 'Another arithmetic book', '其他计算教材'],
  ['none', '연산 교재는 안 해요', 'No arithmetic book', '没有用计算教材']
];
const PROGRESS = [['start', '막 시작했어요', 'Just started', '刚开始'], ['middle', '중간쯤이에요', 'About halfway', '学到一半'], ['end', '거의 끝나 가요', 'Nearly finished', '快学完了']];
const SKILL_OPTS = [['good', '잘해요', 'Confident', '熟练'], ['shaky', '헷갈려요', 'Mixed up', '容易错'], ['notyet', '아직 안 배웠어요', 'Not learned yet', '还没学'], ['unsure', '잘 모르겠어요', 'Not sure', '不确定']];
const PROBE_OPTS = [['right', '바로 맞혔어요', 'Right away', '马上答对'], ['slow', '맞혔는데 오래 걸렸어요', 'Right, but slowly', '答对但很慢'], ['wrong', '틀렸어요', 'Got it wrong', '答错了'], ['skip', '지금은 못 해 봐요', 'Can\'t try now', '现在没法试']];
const FINGER_OPTS = [['often', '자주 그래요', 'Often', '经常'], ['sometimes', '가끔 그래요', 'Sometimes', '偶尔'], ['no', '거의 안 그래요', 'Rarely', '几乎不会']];
const tr3 = a => t(a[0], a[1], a[2]);
const ageLabel = k => k ? tr3(AGE_LABEL[k]) : '';
const bookLabel = k => { const b = BOOKS.find(x => x[0] === k); return b ? t(b[1], b[2], b[3]) : ''; };
function skillTitle(k){ return L(k.name) + (k.level ? ' · ' + L(k.level) : ''); }
function courseTitle(key){
  const c = key && D.courses[key];
  return c ? t('과정 ', 'Course ', '课程') + c.n + ' · ' + L(c.title) : '';
}
function stepTopic(st){
  if(lang === 'ko') return (L(st.label).split('—')[1] || '').trim();
  const names = []; st.skills.forEach(k => { const n = L(k.name); if(!names.includes(n)) names.push(n); });
  return names.slice(0, 3).join(' · ');
}
function volumeTitle(st){
  return st.book === 'pre-2023' ? t('예비초등 ' + st.volume + '권', 'Pre-school vol. ' + st.volume, '学前第' + st.volume + '册')
    : t('초등 ' + st.volume + '권', 'Elementary vol. ' + st.volume, '小学第' + st.volume + '册');
}

/* ---------- 화면 ---------- */
function progressBar(){
  const p = state.profile, n = state.asked.length;
  const pct = screen === 'intro' ? 0 : screen === 'result' ? 100 : Math.min(92, 12 + (p.age ? 10 : 0) + (p.book ? 10 : 0) + n * 14 + state.probeAsked.length * 4);
  return '<div class="progress" aria-hidden="true"><i style="width:' + pct + '%"></i></div>';
}
function navBar(nextLabel, nextEnabled){
  return '<div class="bar">' + (history.length ? '<button class="btn text" data-act="back">← ' + t('이전', 'Back', '上一步') + '</button>' : '<span></span>') +
    (nextLabel ? '<button class="btn primary" data-act="next"' + (nextEnabled ? '' : ' disabled') + '>' + nextLabel + '</button>' : '') + '</div>';
}
function chips(list, current, act){
  return '<div class="chips">' + list.map(x => '<button class="chip" data-act="' + act + '" data-v="' + x[0] + '" aria-pressed="' + (current === x[0]) + '">' + esc(tr3(x.slice(1))) + '</button>').join('') + '</div>';
}

function viewIntro(){
  return '<p class="kicker">' + t('시작점 상담', 'Starting-point check', '起点咨询') + '</p>' +
    '<h1>' + t('우리 아이, 어디서 시작하면 좋을까요?', 'Where should my child start?', '孩子从哪里开始学比较好？') + '</h1>' +
    '<p class="lead">' + t('문제를 풀지 않아요. 지금 하는 연산 교재와 할 줄 아는 계산을 아는 만큼 답해 주시면, 수의 마법의 시작 과정을 알려 드려요. 3분쯤 걸려요.',
      'No test. Tell us which arithmetic book your child is on and which calculations they can do, and we\'ll suggest the Numbers of Magic course to start with. About 3 minutes.',
      '不用做题。告诉我们孩子正在用的计算教材和会做的计算，我们就推荐数的魔法从哪个课程开始。大约3分钟。') + '</p>' +
    '<p class="note">' + t('답은 이 화면에서만 쓰고 저장하거나 보내지 않아요.', 'Your answers stay on this page. Nothing is saved or sent.', '您的回答只在本页面使用，不会保存或发送。') + '</p>' +
    '<div class="bar"><span></span><button class="btn primary" data-act="begin">' + t('상담 시작하기', 'Start', '开始') + '</button></div>';
}
function viewAge(){
  const p = state.profile;
  return '<div class="card"><h2>' + t('아이는 몇 살(몇 학년)인가요?', 'How old is your child (or which grade)?', '孩子几岁（几年级）？') + '</h2>' +
    '<p class="group-t">' + t('유치', 'Pre-school', '幼儿') + '</p>' + chips(['k5', 'k6', 'k7'].map(k => [k].concat(AGE_LABEL[k])), p.age, 'age') +
    '<p class="group-t">' + t('초등', 'Elementary', '小学') + '</p>' + chips(['g1', 'g2', 'g3', 'g4', 'g5', 'g6'].map(k => [k].concat(AGE_LABEL[k])), p.age, 'age') +
    '<p class="group-t">' + t('그 위', 'Older', '更大') + '</p>' + chips([['m'].concat(AGE_LABEL.m)], p.age, 'age') + navBar() + '</div>';
}
function viewBook(){
  return '<div class="card"><h2>' + t('지금 하는 연산 교재가 있나요?', 'Is your child using an arithmetic workbook now?', '孩子现在在用计算教材吗？') + '</h2>' +
    '<p class="lead">' + t('기적의 계산법이면 권별 주제로 바로 맞춰 볼게요. 다른 교재면 나이에 맞춰 할 줄 아는 계산을 여쭤볼게요.',
      'For Miracle Calculation we match by volume. For other books we ask about calculations by age.',
      '如果是奇迹计算法，我们按册对照；其他教材则按年龄询问会做的计算。') + '</p>' +
    chips(BOOKS.map(b => [b[0], b[1], b[2], b[3]]), state.profile.book, 'book') + navBar() + '</div>';
}
function viewVolume(){
  const vols = D.ladder;
  const group = (book, title) => '<p class="group-t">' + title + '</p><div class="vols">' +
    vols.filter(s => s.book === book).map(s => '<button class="vol" data-act="volume" data-ed="' + (book === 'pre-2023' ? 'pre' : 'elem') + '" data-v="' + s.volume + '"><b>' + esc(volumeTitle(s)) + '</b><span>' + esc(stepTopic(s)) + '</span></button>').join('') + '</div>';
  return '<div class="card"><h2>' + t('지금 몇 권을 하고 있나요?', 'Which volume is your child on now?', '现在在学第几册？') + '</h2>' +
    group('elem-2021', t('초등 (2021판)', 'Elementary (2021 edition)', '小学（2021版）')) +
    group('pre-2023', t('예비초등 (2023판)', 'Pre-school (2023 edition)', '学前（2023版）')) +
    '<p class="note">' + t('다른 판(구판)이면 주제가 가장 비슷한 권을 골라 주세요.', 'If you have another edition, pick the volume with the closest topic.', '如果是其他版本，请选主题最接近的一册。') + '</p>' + navBar() + '</div>';
}
function viewProgress(){
  return '<div class="card"><h2>' + t('그 권은 어디쯤 하고 있나요?', 'How far into that volume?', '这一册学到哪里了？') + '</h2>' +
    chips(PROGRESS, state.profile.progress, 'progress') + navBar() + '</div>';
}
let draft = {};
function viewSkills(q){
  const st = D.ladder[q.step];
  const ks = st.skills.filter(k => !state.answers[k.ref] || draft[k.ref] !== undefined);
  const why = q.why === 'up' ? t('잘하신다니 한 단계 위도 여쭤볼게요', 'Doing well — let\'s check one step up', '掌握得不错，再看看上一级')
    : q.why === 'down' ? t('기초를 한 단계 아래에서 확인할게요', 'Let\'s check the basics one step down', '再往下确认一下基础')
    : t('지금 단계의 계산이에요', 'Calculations at the current stage', '当前阶段的计算');
  const rows = ks.map(k => '<div class="skill" data-ref="' + esc(k.ref) + '"><div class="skill-h"><span class="skill-n">' + esc(L(k.name)) + '</span>' +
    (k.level ? '<span class="skill-l">' + esc(L(k.level)) + '</span>' : '') + '</div>' +
    (k.example ? '<div class="ex">' + t('예', 'e.g.', '例') + ' <span class="k">' + tex(k.example.q) + '</span></div>' : '') +
    '<div class="opts" role="group" aria-label="' + esc(L(k.name)) + '">' + SKILL_OPTS.map(o => '<button class="opt" data-act="skill" data-ref="' + esc(k.ref) + '" data-v="' + o[0] + '" aria-pressed="' + (draft[k.ref] === o[0]) + '">' + esc(tr3(o.slice(1))) + '</button>').join('') + '</div></div>').join('');
  const done = ks.every(k => draft[k.ref]);
  return '<div class="card"><span class="why">' + why + '</span><h2>' + t('이 계산은 어떤가요?', 'How does your child do with these?', '这些计算做得怎么样？') + '</h2>' +
    '<p class="note">' + t('아이가 혼자 해낼 수 있는지로 골라 주세요. 모르면 「잘 모르겠어요」를 누르세요 — 문제를 하나 내 보도록 도와 드려요.',
      'Answer by whether your child can do it alone. If you\'re not sure, choose "Not sure" — we\'ll help you try one problem.',
      '按孩子能否独立完成来选。不确定就选「不确定」——我们会帮您出一道题试试。') + '</p>' + rows +
    navBar(t('다음', 'Next', '下一步'), done) + '</div>';
}
let shown = false;
function viewProbe(q){
  const k = D.ladder[q.step].skills.find(x => x.ref === q.ref);
  return '<div class="card"><span class="why">' + t('정보가 조금 더 필요해요', 'A little more information, please', '还需要一点信息') + '</span>' +
    '<h2>' + t('아이에게 이 문제를 말로 내 보세요', 'Ask your child this problem out loud', '请口头给孩子出这道题') + '</h2>' +
    '<p class="note">' + esc(skillTitle(k)) + '</p>' +
    '<div class="probe-q">' + tex(k.example.q) + '</div>' +
    '<button class="reveal" data-act="reveal" aria-expanded="' + shown + '">' + (shown ? t('답 숨기기', 'Hide answer', '隐藏答案') : t('답 보기', 'Show answer', '查看答案')) + '</button>' +
    '<div class="probe-a">' + (shown ? tex(k.example.a) : '') + '</div>' +
    chips(PROBE_OPTS, state.probes[k.ref], 'probe') + navBar() + '</div>';
}
function viewFingers(){
  return '<div class="card"><span class="why">' + t('마지막 질문이에요', 'Last question', '最后一个问题') + '</span><h2>' +
    t('계산할 때 손가락으로 세거나 오래 걸리나요?', 'Does your child count on fingers or take a long time?', '计算时会掰手指数或花很长时间吗？') + '</h2>' +
    chips(FINGER_OPTS, state.fingers, 'fingers') + navBar() + '</div>';
}
function itemList(items, cls, label){
  if(!items.length) return '';
  return '<li style="display:block"><p class="sec-t" style="margin:6px 0 2px">' + label + '</p><ul class="list">' + items.map(k => '<li><span class="tag ' + cls + '">' + esc(courseShort(k.course)) + '</span><span>' + esc(skillTitle(k)) + '</span></li>').join('') + '</ul></li>';
}
function courseShort(key){ const c = key && D.courses[key]; return c ? t('과정 ', 'C', '课程') + c.n : '—'; }
function reasonText(r){
  const rs = r.reason || {};
  if(rs.kind === 'shaky') return t('헷갈린다고 하신 「' + skillTitle(rs.skill) + '」부터 다져요. 이 계산이 처음 나오는 과정이에요.',
    'We start by firming up "' + skillTitle(rs.skill) + '" — the course where it first appears.',
    '从您说容易错的「' + skillTitle(rs.skill) + '」开始巩固，这是它第一次出现的课程。');
  if(rs.kind === 'new') return t('말씀하신 계산은 잘하고 있어요. 아직 안 배운 「' + skillTitle(rs.skill) + '」를 처음 배우는 과정이에요.',
    'What your child knows is solid. This is the course where "' + skillTitle(rs.skill) + '" is first taught.',
    '已学的计算都很熟练。这是第一次学习「' + skillTitle(rs.skill) + '」的课程。');
  if(rs.kind === 'next') return t('말씀하신 계산은 모두 잘해서, ' + courseTitle(rs.course) + ' 다음 과정으로 잡았어요.',
    'Everything you mentioned is solid, so we start right after ' + courseTitle(rs.course) + '.',
    '您提到的计算都很熟练，所以从' + courseTitle(rs.course) + '的下一个课程开始。');
  return t('아직 확인이 안 된 계산이 많아 지금 단계의 첫 과정으로 잡았어요. 문제로 확인하면 더 정확해요.',
    'Many answers were "not sure", so this is the first course of the current stage. A short test will be more accurate.',
    '不确定的较多，所以先定为当前阶段的第一个课程。做题确认会更准确。');
}
function paceText(r){
  if(r.pace === 'slow') return t('계산이 아직 느린 편이에요. 과정을 공부하면서 연산 게임으로 하루 5분씩 속도를 다지면 좋아요.',
    'Calculation is still slow. Alongside the course, five minutes a day of arithmetic games will build speed.',
    '计算还偏慢。学课程的同时，每天玩5分钟计算游戏来提高速度。');
  if(r.pace === 'some') return t('가끔 손가락을 쓰는 정도면 괜찮아요. 연산 게임으로 조금씩 다져 주세요.',
    'Using fingers now and then is fine. Arithmetic games will help bit by bit.',
    '偶尔掰手指没关系，用计算游戏慢慢巩固就好。');
  return '';
}
function summaryText(r){
  const p = state.profile, lines = [];
  lines.push(t('[수의 마법 시작점 상담]', '[Numbers of Magic · starting-point check]', '[数的魔法 · 起点咨询]'));
  lines.push(t('나이', 'Age', '年龄') + ': ' + ageLabel(p.age) + (p.book ? ' · ' + t('교재', 'Book', '教材') + ': ' + bookLabel(p.book) : '') +
    (p.book === 'miracle' && p.volume ? ' ' + volumeTitle({ book: p.edition === 'pre' ? 'pre-2023' : 'elem-2021', volume: p.volume }) + (p.progress ? ' (' + tr3(PROGRESS.find(x => x[0] === p.progress).slice(1)) + ')' : '') : ''));
  if(r.middle){ lines.push(t('중학생 이상 — 연산 진단 평가로 확인 예정', 'Middle school or older — to be checked with the diagnostic test', '初中及以上——将用计算诊断测评确认')); return lines.join('\n'); }
  if(r.start) lines.push(t('추천 시작', 'Suggested start', '推荐开始') + ': ' + courseTitle(r.start));
  const add = (label, arr) => { if(arr.length) lines.push(label + ': ' + arr.map(skillTitle).join(', ')); };
  add(t('잘해요', 'Confident', '熟练'), r.good);
  add(t('헷갈려요', 'Mixed up', '容易错'), r.shaky);
  add(t('아직 안 배웠어요', 'Not learned yet', '还没学'), r.notyet);
  add(t('빈틈', 'Gaps', '漏洞'), r.gaps);
  add(t('확인 필요', 'To check', '待确认'), r.unknown);
  if(state.fingers) lines.push(t('손가락·속도', 'Fingers/speed', '手指·速度') + ': ' + tr3(FINGER_OPTS.find(x => x[0] === state.fingers).slice(1)));
  return lines.join('\n');
}
function viewResult(){
  const r = R.result(state);
  if(r.middle){
    return '<div class="start"><p class="kicker">' + t('상담 결과', 'Result', '咨询结果') + '</p><h2>' + t('문제로 확인하는 게 정확해요', 'A short test works best', '做题确认最准确') + '</h2>' +
      '<p>' + t('중학생 이상은 배운 범위가 아이마다 달라서 말로만 정하기 어려워요. 연산 진단 평가로 문제를 풀어 보면 시작 과정을 알려 드려요.',
        'From middle school, what children have covered varies too much to judge from answers alone. The diagnostic test will place your child.',
        '初中以上每个孩子学过的范围差别很大，只凭回答难以判断。做一次计算诊断测评就能给出起始课程。') + '</p></div>' +
      actions(r) + navBar();
  }
  const pace = paceText(r);
  return '<div class="start"><p class="kicker">' + t('추천 시작 과정', 'Suggested starting course', '推荐起始课程') + '</p><h2>' + esc(courseTitle(r.start) || t('더 확인이 필요해요', 'Needs a closer look', '需要进一步确认')) + '</h2>' +
    '<p>' + esc(reasonText(r)) + '</p>' + (pace ? '<p>' + esc(pace) + '</p>' : '') + '</div>' +
    '<div class="card"><ul class="list">' +
      itemList(r.shaky, 't-shaky', t('먼저 다질 것', 'Firm up first', '先巩固')) +
      itemList(r.notyet, 't-new', t('이제 배울 것', 'Next to learn', '接下来要学')) +
      itemList(r.gaps, 't-gap', t('빈틈 — 앞 과정에서 짧게 다시 봐요', 'Gaps — a quick review from an earlier course', '漏洞——在前面课程中快速复习')) +
      itemList(r.unknown, 't-unknown', t('확인이 더 필요한 것', 'Still to check', '还需确认')) +
      itemList(r.good, 't-good', t('잘하는 것', 'Already confident', '已经熟练')) +
    '</ul></div>' + actions(r) + navBar();
}
function actions(r){
  return '<div class="card"><p class="sec-t">' + t('다음에 할 일', 'What next', '下一步') + '</p>' +
    (r.needCheck || r.middle ? '<p class="note" style="margin:0 0 10px">' + t('「잘 모르겠어요」로 남은 계산이 있어요. 문제로 확인하면 시작 과정이 더 정확해져요.', 'Some answers are still "not sure". A short test will make the start more accurate.', '还有「不确定」的计算。做题确认会让起始课程更准确。') + '</p>' : '') +
    '<div class="actions">' +
    '<a class="btn gold" href="index.html?enter=1">' + t('무료 체험 시작하기', 'Start the free trial', '开始免费体验') + '</a>' +
    '<a class="btn ' + (r.needCheck || r.middle ? 'primary' : 'ghost') + '" href="level-test.html">' + t('문제로 정확히 확인하기 (연산 진단 평가)', 'Check with problems (diagnostic test)', '用题目准确确认（计算诊断测评）') + '</a>' +
    '<button class="btn ghost" data-act="kakao">' + t('결과 복사하고 원장님께 상담하기', 'Copy the result and talk to us', '复制结果并咨询') + '</button>' +
    '<button class="btn text" data-act="restart">' + t('처음부터 다시', 'Start over', '重新开始') + '</button>' +
    '</div></div>';
}

/* 지금 어떤 화면인가 — 상담 단계는 규칙이 정한다 */
let current = null;
function render(scrollTop){
  if(screen === 'flow'){ current = R.next(state); }
  let html = '';
  if(screen === 'intro') html = viewIntro();
  else if(screen === 'result') html = viewResult();
  else {
    const q = current;
    if(q.type === 'age') html = viewAge();
    else if(q.type === 'book') html = viewBook();
    else if(q.type === 'volume') html = viewVolume();
    else if(q.type === 'progress') html = viewProgress();
    else if(q.type === 'skills') html = viewSkills(q);
    else if(q.type === 'probe') html = viewProbe(q);
    else if(q.type === 'fingers') html = viewFingers();
    else { screen = 'result'; html = viewResult(); }
  }
  $app.innerHTML = progressBar() + html;
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
  document.title = t('시작점 상담', 'Starting-point check', '起点咨询') + ' · Numbers of Magic';
  document.querySelectorAll('.langbtn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  if(scrollTop) window.scrollTo(0, 0);
}

document.addEventListener('click', e => {
  const lb = e.target.closest('.langbtn');
  if(lb){ lang = lb.dataset.lang; try { localStorage.setItem(LANG_KEY, lang); } catch(err){} render(false); return; }
  const b = e.target.closest('[data-act]');
  if(!b || b.disabled) return;
  const act = b.dataset.act, v = b.dataset.v, p = state.profile;
  if(act === 'begin') go('flow');
  else if(act === 'back') { draft = {}; shown = false; back(); }
  else if(act === 'age') go('flow', () => { p.age = v; if(v === 'm'){ p.book = null; } });
  else if(act === 'book') go('flow', () => { p.book = v; if(v !== 'miracle'){ p.volume = null; p.edition = null; p.progress = null; } });
  else if(act === 'volume') go('flow', () => { p.edition = b.dataset.ed; p.volume = +v; });
  else if(act === 'progress') go('flow', () => { p.progress = v; });
  else if(act === 'skill'){
    draft[b.dataset.ref] = v;
    const row = b.closest('.skill');
    row.querySelectorAll('.opt').forEach(o => o.setAttribute('aria-pressed', String(o === b)));
    const card = b.closest('.card'), refs = [...card.querySelectorAll('.skill')].map(s => s.dataset.ref);
    card.querySelector('[data-act="next"]').disabled = !refs.every(r => draft[r]);
  }
  else if(act === 'next' && current && current.type === 'skills'){
    const step = current.step, map = draft; draft = {};
    go('flow', () => R.answerSkills(state, step, map));
  }
  else if(act === 'reveal'){ shown = !shown; render(false); }
  else if(act === 'probe'){ const ref = current.ref; shown = false; go('flow', () => R.answerProbe(state, ref, v)); }
  else if(act === 'fingers') go('flow', () => { state.fingers = v; });
  else if(act === 'kakao'){
    const text = summaryText(R.result(state));
    const open = () => { window.open(KAKAO, '_blank', 'noopener'); };
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(() => { toast(t('결과를 복사했어요. 상담 창에 붙여 넣어 주세요.', 'Copied. Paste it into the chat.', '已复制，请粘贴到咨询窗口。')); open(); },
        () => { toast(t('복사하지 못했어요. 결과를 직접 적어 주세요.', 'Could not copy. Please type the result.', '无法复制，请手动输入结果。')); open(); });
    } else { toast(t('복사하지 못했어요. 결과를 직접 적어 주세요.', 'Could not copy. Please type the result.', '无法复制，请手动输入结果。')); open(); }
  }
  else if(act === 'restart'){ history.length = 0; draft = {}; shown = false; state = R.newState(); screen = 'intro'; render(true); }
});
render(false);
window.NM_CONSULT_UI = { get state(){ return state; }, get current(){ return current; }, summaryText: () => summaryText(R.result(state)) };
})();
