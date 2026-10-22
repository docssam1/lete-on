/* Numbers of Magic — admin frontend (native JS, no build).
   All credential checks happen on the server. This file never stores or logs the approval code.
   All server/user strings are inserted via textContent only. */
(function () {
  'use strict';

  var ENDPOINT = 'https://fgahqumaldheqettmvqg.supabase.co/functions/v1/nm-membership';
  /* Public anon key: copy the same public value used in app/main.js (allowed read). It can also be
     provided before this script runs via window.NM_PUBLIC_ANON_KEY. Empty => config error shown. */
  var ANON_KEY = (typeof window.NM_PUBLIC_ANON_KEY === 'string' && window.NM_PUBLIC_ANON_KEY) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnYWhxdW1hbGRoZXFldHRtdnFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NjAzNDcsImV4cCI6MjA5NzIzNjM0N30.iUXLFteDc_xIp_Xj506BKTxnZRYMObmTYQ2Dgh9RAqs';
  var TOKEN_KEY = 'nm_admin_session_v1';
  var SPEEDS = [0.7, 0.85, 1, 1.25, 1.5];
  var PLAN_LABEL = { six_month: '6개월', annual: '1년' };
  var STATUS_LABEL = { active: '이용 중', paid: '이용 중', trial: '체험 중', expired: '만료', revoked: '해지', none: '미승인' };

  var state = { token: null, members: [], unlinked: [], query: '', pendingGrant: null, pendingLink: null, pendingRevoke: null };
  var uid = 0;

  function $(id) { return document.getElementById(id); }
  function el(tag, props, kids) {
    var n = document.createElement(tag);
    if (props) Object.keys(props).forEach(function (k) {
      if (k === 'text') n.textContent = props[k];
      else if (k === 'class') n.className = props[k];
      else if (k === 'on') Object.keys(props.on).forEach(function (ev) { n.addEventListener(ev, props.on[ev]); });
      else n.setAttribute(k, props[k]);
    });
    (kids || []).forEach(function (c) { if (c) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }
  function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); }
  function say(node, text, kind) { node.textContent = text || ''; node.className = 'status' + (kind ? ' ' + kind : ''); }
  function day(v) { var d=new Date(v);return typeof v==='string'&&Number.isFinite(+d)?new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(d):'-'; }
  function deadline(v) { var d=new Date(v);return typeof v==='string'&&Number.isFinite(+d)?new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',month:'long',day:'numeric',hour:'2-digit',minute:'2-digit'}).format(d)+' (KST)':'-'; }
  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function str(v) { return typeof v === 'string' ? v : ''; }
  function safeUrl(u) { try { var x = new URL(u); return (x.protocol === 'https:' || x.protocol === 'http:') ? x.href : null; } catch (e) { return null; } }

  /* ---------- session (token only, sessionStorage only) ---------- */
  function saveToken(tok, exp) { try { sessionStorage.setItem(TOKEN_KEY, JSON.stringify({ t: tok, e: exp || null })); } catch (e) {} }
  function loadToken() {
    try {
      var o = JSON.parse(sessionStorage.getItem(TOKEN_KEY) || 'null');
      if (o && typeof o.t === 'string' && o.t) return o;
    } catch (e) {}
    return null;
  }
  function dropToken() { try { sessionStorage.removeItem(TOKEN_KEY); } catch (e) {} state.token = null; }

  /* ---------- API ---------- */
  function api(action, payload) {
    var body = Object.assign({ action: action }, payload || {});
    if (!ANON_KEY) return Promise.resolve({ ok: false, status: 0, data: null, config: true });
    return fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: ANON_KEY },
      body: JSON.stringify(body)
    }).then(function (res) {
      return res.text().then(function (t) {
        var data = null;
        try { data = t ? JSON.parse(t) : null; } catch (e) { data = null; }
        return { ok: res.ok, status: res.status, data: data };
      });
    }, function () { return { ok: false, status: 0, data: null, network: true }; });
  }
  function authed(action, payload) {
    var p = Object.assign({ adminToken: state.token }, payload || {});
    return api(action, p).then(function (r) {
      if (r.status === 401 && state.token) { logoutLocal('로그인이 만료되었습니다. 다시 로그인하세요.'); }
      return r;
    });
  }
  function errText(r, fallback) {
    if (r.config) return '관리자 설정이 완료되지 않았습니다.';
    if (r.network) return '네트워크에 연결할 수 없습니다. 잠시 후 다시 시도하세요.';
    if (r.status === 401) return '인증에 실패했습니다.';
    if (r.status === 403) return '권한이 없습니다.';
    if (r.status === 409) return '이미 연결된 정보와 충돌합니다. 이메일과 학생을 확인하세요.';
    if (r.status === 429) return '요청이 많습니다. 잠시 후 다시 시도하세요.';
    return fallback || '요청을 처리하지 못했습니다.';
  }

  /* ---------- views ---------- */
  function showLogin() { $('admin-view').hidden = true; $('login-view').hidden = false; }
  function showAdmin() { $('login-view').hidden = true; $('admin-view').hidden = false; }
  function logoutLocal(msg) {
    var tok = state.token;
    dropToken();
    state.members = []; state.unlinked = [];
    clear($('members')); clear($('unlinked-list')); clear($('summary'));
    $('login-code').value = ''; $('login-username').value = '';
    hideGrant(); hideLink(); closeRevoke();
    showLogin();
    say($('login-status'), msg || '', msg ? 'err' : '');
    return tok;
  }
  function doLogout() {
    var tok = logoutLocal('로그아웃되었습니다.');
    $('login-status').className = 'status ok';
    if (tok) api('admin_logout', { adminToken: tok }).catch(function () {});
  }

  /* ---------- login ---------- */
  $('login-form').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var u = $('login-username').value.trim(), c = $('login-code').value;
    var st = $('login-status'), btn = $('login-submit');
    if (!u || !c) { say(st, '아이디와 승인번호를 입력하세요.', 'err'); return; }
    btn.disabled = true; say(st, '확인 중입니다…');
    api('admin_login', { username: u, code: c }).then(function (r) {
      $('login-code').value = '';
      btn.disabled = false;
      var d = r.data;
      if (r.ok && d && typeof d.token === 'string' && d.token) {
        state.token = d.token; saveToken(d.token, d.expiresAt);
        $('login-username').value = '';
        say(st, '');
        showAdmin(); loadList('');
      } else {
        say(st, r.status === 401 || r.status === 403 ? '아이디 또는 승인번호가 올바르지 않습니다.' : errText(r, '로그인하지 못했습니다.'), 'err');
      }
    });
  });
  $('logout-btn').addEventListener('click', doLogout);
  $('logout-btn-top').addEventListener('click', doLogout);

  /* ---------- list / search / summary ---------- */
  function loadList(query) {
    state.query = query || '';
    say($('list-status'), '불러오는 중입니다…');
    var p = state.query ? { query: state.query } : {};
    return authed('admin_list', p).then(function (r) {
      if (!state.token) return;
      var d = r.data;
      if (!r.ok || !d || !Array.isArray(d.members)) { say($('list-status'), errText(r, '목록을 불러오지 못했습니다.'), 'err'); return; }
      state.members = d.members;
      state.unlinked = Array.isArray(d.unlinkedProfiles) ? d.unlinkedProfiles : [];
      renderSummary(); renderMembers(); renderUnlinked();
      say($('list-status'), state.members.length ? '' : (state.query ? '일치하는 회원이 없습니다. 위의 이용 승인에서 새로 등록할 수 있습니다.' : '등록된 회원이 없습니다.'));
    });
  }
  $('search-form').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var q = $('search-email').value.trim();
    if (q && !isEmail(q)) { say($('list-status'), '이메일 형식을 확인하세요.', 'err'); return; }
    if (q) $('grant-email').value = q;
    loadList(q);
  });
  $('search-reset').addEventListener('click', function () { $('search-email').value = ''; loadList(''); });

  function statusKey(m) { return STATUS_LABEL[m.status] ? m.status : 'none'; }
  function renderSummary() {
    var s = $('summary'); clear(s);
    var total = state.members.length, use = 0, trial = 0, off = 0;
    state.members.forEach(function (m) { if (m.canUse) use++; else off++; if (m.status === 'trial') trial++; });
    [['전체 회원', total], ['이용 가능', use], ['체험 중', trial], ['이용 불가', off], ['연결 안 된 기록', state.unlinked.length]].forEach(function (x) {
      s.appendChild(el('div', null, [el('dt', { text: x[0] }), el('dd', { text: String(x[1]) })]));
    });
  }

  /* ---------- members ---------- */
  function renderMembers() {
    var box = $('members'); clear(box);
    state.members.forEach(function (m) { box.appendChild(memberCard(m)); });
  }
  function memberCard(m) {
    var k = statusKey(m);
    var badge = el('span', { class: 'badge ' + (m.canUse ? (k === 'trial' ? 'trial' : 'on') : 'off'), text: STATUS_LABEL[k] + (m.canUse ? ' · 이용 가능' : ' · 이용 불가') });
    var card = el('article', { class: 'member' }, [
      el('div', { class: 'member-head' }, [el('strong', { text: str(m.email) || '(이메일 없음)' }), badge])
    ]);
    var meta = el('div', { class: 'meta' }, [
      el('span', { text: '승인 기간: ' + (PLAN_LABEL[m.plan] || '없음') }),
      el('span', { text: '시작 ' + day(m.startsAt) + ' ~ 종료 ' + day(m.endsAt) }),
      el('span', { text: '체험: ' + day(m.trialStartedAt) + ' ~ ' + day(m.trialEndsAt) }),
      m.phoneMasked ? el('span', { text: '연락처: ' + m.phoneMasked }) : null
    ]);
    var acts = el('div', { class: 'member-actions' }, [
      el('button', { class: 'btn secondary', type: 'button', text: '승인·연장', on: { click: function () {
        $('grant-email').value = str(m.email); $('grant-email').scrollIntoView({ block: 'center' }); $('grant-email').focus();
      } } }),
      el('button', { class: 'btn danger', type: 'button', text: '이용 해지', on: { click: function () { openRevoke(m); } } })
    ]);
    var body = el('div', { class: 'member-body' }, [meta, acts]);
    var profiles = Array.isArray(m.profiles) ? m.profiles : [];
    if (!profiles.length) body.appendChild(el('p', { class: 'muted', text: '연결된 학생이 없습니다.' }));
    profiles.forEach(function (p) { body.appendChild(studentBlock(m, p)); });
    card.appendChild(body);
    return card;
  }

  /* ---------- grant ---------- */
  function hideGrant() { state.pendingGrant = null; $('grant-confirm').hidden = true; }
  $('grant-form').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var email = $('grant-email').value.trim();
    var sel = document.querySelector('input[name="grant-plan"]:checked');
    var plan = sel ? sel.value : '';
    if (!isEmail(email)) { say($('global-status'), '승인할 이메일을 올바르게 입력하세요.', 'err'); return; }
    if (!PLAN_LABEL[plan]) { say($('global-status'), '승인 기간을 선택하세요.', 'err'); return; }
    var known = state.members.filter(function (m) { return str(m.email).toLowerCase() === email.toLowerCase(); })[0];
    var names = known && Array.isArray(known.profiles) ? known.profiles.map(function (p) { return p.name; }).filter(Boolean) : [];
    state.pendingGrant = { email: email, plan: plan };
    $('grant-confirm-text').textContent = '이메일 ' + email + (names.length ? ' · 학생 ' + names.join(', ') : ' · 연결된 학생 없음') +
      ' 에 ' + PLAN_LABEL[plan] + ' 이용을 승인합니다. 자동 결제는 없습니다.';
    $('grant-confirm').hidden = false; $('grant-do').disabled = false; $('grant-do').focus();
  });
  $('grant-cancel').addEventListener('click', hideGrant);
  $('grant-do').addEventListener('click', function () {
    var g = state.pendingGrant; if (!g) return;
    var btn = $('grant-do'); btn.disabled = true;
    say($('global-status'), '승인하는 중입니다…');
    authed('admin_grant', { email: g.email, plan: g.plan }).then(function (r) {
      if (!state.token) return;
      if (r.ok && r.data && r.data.member) {
        say($('global-status'), g.email + ' · ' + PLAN_LABEL[g.plan] + ' 이용이 승인되었습니다.', 'ok');
        hideGrant(); loadList(state.query);
      } else { btn.disabled = false; say($('global-status'), errText(r, '승인하지 못했습니다.'), 'err'); }
    });
  });

  /* ---------- revoke ---------- */
  function openRevoke(m) {
    state.pendingRevoke = m;
    $('revoke-text').textContent = str(m.email) + ' 의 이용 승인을 해지합니다. 학생 기록은 삭제되지 않고 보존됩니다.';
    $('revoke-dialog').hidden = false; $('revoke-do').disabled = false; $('revoke-cancel').focus();
  }
  function closeRevoke() { state.pendingRevoke = null; $('revoke-dialog').hidden = true; }
  $('revoke-cancel').addEventListener('click', closeRevoke);
  $('revoke-dialog').addEventListener('keydown', function (e) { if (e.key === 'Escape') closeRevoke(); });
  $('revoke-do').addEventListener('click', function () {
    var m = state.pendingRevoke; if (!m) return;
    $('revoke-do').disabled = true;
    authed('admin_revoke', { userId: m.userId }).then(function (r) {
      if (!state.token) return;
      closeRevoke();
      if (r.ok && r.data && r.data.ok === true) { say($('global-status'), '이용 승인이 해지되었습니다. 기록은 보존됩니다.', 'ok'); loadList(state.query); }
      else say($('global-status'), errText(r, '해지하지 못했습니다.'), 'err');
    });
  });

  /* ---------- link unlinked profiles ---------- */
  function hideLink() { state.pendingLink = null; $('link-confirm').hidden = true; }
  function renderUnlinked() {
    var sel = $('link-profile'), ul = $('unlinked-list'); clear(sel); clear(ul);
    sel.appendChild(el('option', { value: '', text: state.unlinked.length ? '학생을 선택하세요' : '연결할 학생이 없습니다' }));
    state.unlinked.forEach(function (p) {
      var n = str(p && p.name); if (!n) return;
      sel.appendChild(el('option', { value: n, text: n }));
      ul.appendChild(el('li', { text: n }));
    });
  }
  $('link-form').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var name = $('link-profile').value, email = $('link-email').value.trim();
    if (!name) { say($('link-status'), '연결할 학생을 선택하세요.', 'err'); return; }
    if (!isEmail(email)) { say($('link-status'), '확인된 이메일을 올바르게 입력하세요.', 'err'); return; }
    say($('link-status'), '');
    state.pendingLink = { name: name, email: email };
    $('link-confirm-text').textContent = '학생 ' + name + ' 을(를) 이메일 ' + email + ' 에 연결합니다. 이메일 한 개에는 학생 한 명만 연결할 수 있으며, 기존 기록은 지워지지 않습니다.';
    $('link-confirm').hidden = false; $('link-do').disabled = false; $('link-do').focus();
  });
  $('link-cancel').addEventListener('click', hideLink);
  $('link-do').addEventListener('click', function () {
    var l = state.pendingLink; if (!l) return;
    $('link-do').disabled = true;
    authed('admin_link', { email: l.email, profileName: l.name }).then(function (r) {
      if (!state.token) return;
      if (r.ok && r.data && r.data.ok === true) {
        say($('link-status'), l.name + ' 학생이 연결되었습니다.', 'ok'); hideLink(); $('link-email').value = ''; loadList(state.query);
      } else { $('link-do').disabled = false; say($('link-status'), errText(r, '연결하지 못했습니다.'), 'err'); }
    });
  });

  /* ---------- learning settings ---------- */
  function courseKeys() {
    var c = window.NM_COURSES || {};
    return Object.keys(c).filter(function (k) { return /^C\d+$/.test(k) && +k.slice(1) <= 73; })
      .sort(function (a, b) { return +a.slice(1) - +b.slice(1); });
  }
  function courseOf(key) { return (window.NM_COURSES || {})[key] || null; }
  function courseName(key) {
    var c = courseOf(key), n = c && (c.name || c.title || c.label);
    if (n && typeof n === 'object') n = n.ko || n.en;
    return key + (typeof n === 'string' && n ? ' · ' + n : '');
  }
  function sessionCount(key) { var c = courseOf(key); return c && Array.isArray(c.sessions) ? c.sessions.length : 0; }
  function academicYear(d) { return d.getMonth() + 1 >= 3 ? d.getFullYear() : d.getFullYear() - 1; }
  function gradeOptions() {
    var o = [['', '학년 모름'], ['-2', '5세'], ['-1', '6세'], ['0', '7세']], i;
    for (i = 1; i <= 6; i++) o.push([String(i), '초' + i]);
    for (i = 1; i <= 3; i++) o.push([String(6 + i), '중' + i]);
    for (i = 1; i <= 3; i++) o.push([String(9 + i), '고' + i]);
    return o;
  }
  function gradeFromEntry(entry) {
    if (typeof entry !== 'number') return '';
    var g = academicYear(new Date()) - entry + 1;
    return g >= -2 && g <= 12 ? String(g) : '';
  }
  function entryFromGrade(g) { return g === '' ? null : academicYear(new Date()) - (parseInt(g, 10) - 1); }
  function nearest(list, v, dflt) { return list.indexOf(v) >= 0 ? v : dflt; }
  function mkSelect(id, label, opts, val) {
    var s = el('select', { id: id });
    opts.forEach(function (o) { var op = el('option', { value: o[0], text: o[1] }); if (String(o[0]) === String(val)) op.selected = true; s.appendChild(op); });
    return { wrap: el('div', { class: 'field' }, [el('label', { for: id, text: label }), s]), input: s };
  }

  function studentBlock(m, p) {
    var n = ++uid, pid = 'st' + n;
    var st = (p && p.settings && typeof p.settings === 'object') ? p.settings : {};
    var keys = courseKeys();
    var courseKey = keys.indexOf(st.courseKey) >= 0 ? st.courseKey : (keys[0] || '');
    var block = el('section', { class: 'student', 'aria-label': str(p.name) + ' 학습 설정' });
    block.appendChild(el('h4', { text: str(p.name) || '(이름 없음)' }));
    block.appendChild(el('p', { class: 'muted', text: '문자 수신: ' + (p.phoneMasked || '번호 없음') + ' · 동의 ' + (p.hasConsent ? '있음' : '없음') }));
    var summary = el('p', { class: 'learn-summary' });
    block.appendChild(summary);

    var course = mkSelect(pid + '-course', '시작 과정', keys.map(function (k) { return [k, courseName(k)]; }), courseKey);
    var session = el('select', { id: pid + '-session' });
    var sessionWrap = el('div', { class: 'field' }, [el('label', { for: pid + '-session', text: '시작 회차' }), session]);
    var speed = mkSelect(pid + '-speed', '속도 배수', SPEEDS.map(function (v) { return [v, v + '배']; }), nearest(SPEEDS, st.speed, 1));
    var amount = mkSelect(pid + '-amount', '학습량 배수', SPEEDS.map(function (v) { return [v, v + '배']; }), nearest(SPEEDS, st.amount, 1));
    var cadence = mkSelect(pid + '-cadence', '주당 횟수', [['w1', '주 1회'], ['w2', '주 2회']], st.cadence === 'w2' ? 'w2' : 'w1');
    var grade = mkSelect(pid + '-grade', '현재 학년', gradeOptions(), gradeFromEntry(st.entryYear));
    var date = el('input', { id: pid + '-date', type: 'date', value: str(st.startDate).slice(0, 10) });
    var dateWrap = el('div', { class: 'field' }, [el('label', { for: pid + '-date', text: '시작일' }), date]);

    function fillSessions(selected) {
      clear(session);
      var cnt = sessionCount(course.input.value) || 1;
      for (var i = 1; i <= cnt; i++) {
        var op = el('option', { value: String(i), text: i + '회차' }); if (i === selected) op.selected = true; session.appendChild(op);
      }
    }
    fillSessions(Math.min(Math.max(parseInt(st.sessionIndex, 10) || 1, 1), sessionCount(courseKey) || 1));

    var grid = el('div', { class: 'learn-grid' }, [course.wrap, sessionWrap, speed.wrap, amount.wrap, cadence.wrap, grade.wrap, dateWrap]);
    block.appendChild(grid);

    var road = el('div', { class: 'roadmap', 'aria-label': '월별 학습 로드맵' });
    var advice = el('div', { class: 'advice', hidden: '' });
    var saveStatus = el('p', { class: 'status', role: 'status', 'aria-live': 'polite' });
    var current = function () {
      return {
        courseKey: course.input.value,
        sessionIndex: parseInt(session.value, 10) || 1,
        speed: parseFloat(speed.input.value),
        amount: parseFloat(amount.input.value),
        cadence: cadence.input.value,
        entryYear: entryFromGrade(grade.input.value),
        startDate: date.value
      };
    };
    var refresh = function () {
      var s = current();
      summary.textContent = '시작: ' + courseName(s.courseKey) + ' ' + s.sessionIndex + '회차 · 속도 ' + s.speed + '배 · 학습량 ' + s.amount + '배 · 주 ' + (s.cadence === 'w2' ? 2 : 1) + '회';
      renderRoadmap(road, advice, s);
    };
    course.input.addEventListener('change', function () { fillSessions(1); refresh(); });
    [session, speed.input, amount.input, cadence.input, grade.input].forEach(function (x) { x.addEventListener('change', refresh); });
    date.addEventListener('input', refresh); date.addEventListener('change', refresh);

    var saveBtn = el('button', { class: 'btn teal', type: 'button', text: '학습 설정 저장' });
    saveBtn.addEventListener('click', function () {
      var s = current();
      if (!s.courseKey || !/^\d{4}-\d{2}-\d{2}$/.test(s.startDate)) { say(saveStatus, '시작 과정과 시작일을 확인하세요.', 'err'); return; }
      if (s.sessionIndex < 1 || s.sessionIndex > sessionCount(s.courseKey)) { say(saveStatus, '시작 회차를 확인하세요.', 'err'); return; }
      saveBtn.disabled = true; say(saveStatus, '저장하는 중입니다…');
      authed('admin_set_learning', Object.assign({ profileName: p.name }, s)).then(function (r) {
        saveBtn.disabled = false;
        if (!state.token) return;
        if (r.ok && r.data && r.data.settings) { p.settings = r.data.settings; say(saveStatus, '저장되었습니다. 완료한 학습 기록은 그대로 유지됩니다.', 'ok'); }
        else say(saveStatus, errText(r, '저장하지 못했습니다.'), 'err');
      });
    });
    block.appendChild(el('div', { class: 'member-actions' }, [saveBtn]));
    block.appendChild(saveStatus);
    block.appendChild(road);
    block.appendChild(advice);
    block.appendChild(smsBlock(p));
    refresh();
    return block;
  }

  function renderRoadmap(box, adviceBox, s) {
    clear(box); clear(adviceBox); adviceBox.hidden = true;
    var plan = window.NM_LEARNING_PLAN, res = null, rec = null, now = new Date();
    try { if (plan && typeof plan.project === 'function') res = plan.project(window.NM_COURSES, s, { months: 12, lang: 'ko', now: now }); } catch (e) { res = null; }
    try { if (plan && typeof plan.recommend === 'function') rec = plan.recommend(window.NM_COURSES, s, { now: now }); } catch (e) { rec = null; }
    if (!res || !Array.isArray(res.rows)) { box.appendChild(el('p', { class: 'muted', text: '월별 로드맵을 아직 계산할 수 없습니다.' })); }
    else {
      var head = el('tr', null, ['월', '학년', '과정', '회차'].map(function (h) { return el('th', { scope: 'col', text: h }); }));
      var body = el('tbody');
      res.rows.forEach(function (r) {
        body.appendChild(el('tr', null, [
          el('td', { text: str(r.month) }), el('td', { text: str(r.schoolLabel) || '-' }),
          el('td', { text: (Array.isArray(r.courseLabels) && r.courseLabels.length ? r.courseLabels : (r.courseKeys || [])).join(', ') }),
          el('td', { text: (r.sessionLabels || []).join(', ') })
        ]));
      });
      box.appendChild(el('table', null, [el('caption', { class: 'muted', text: '앞으로 12개월 학습 계획 (참고용)' }), el('thead', null, [head]), body]));
    }
    if (rec && (rec.title || rec.advice)) {
      adviceBox.hidden = false;
      if (rec.title) adviceBox.appendChild(el('strong', { text: str(rec.title) }));
      if (rec.advice) adviceBox.appendChild(el('p', { text: str(rec.advice) }));
      if (rec.reference) adviceBox.appendChild(el('p', { class: 'muted', text: str(rec.reference) }));
      (Array.isArray(rec.sources) ? rec.sources : []).forEach(function (src) {
        var href = safeUrl(src && src.url); if (!href) return;
        adviceBox.appendChild(el('p', null, [el('a', { href: href, target: '_blank', rel: 'noopener noreferrer', text: str(src.label) || '출처' })]));
      });
    }
  }

  /* ---------- SMS: preview, then explicit send ---------- */
  function smsBlock(p) {
    var id = 'sms' + (++uid);
    var kSel = mkSelect(id + '-k', '학습지 선택', [['1', '이번 주 1회차'], ['2', '이번 주 2회차']], '1');
    var btn = el('button', { class: 'btn primary', type: 'button', text: '학습지 문자 전송' });
    var status = el('p', { class: 'status', role: 'status', 'aria-live': 'polite' });
    var box = el('div', { class: 'sms-box', hidden: '' });
    var wrap = el('div', { class: 'sms' }, [el('div', { class: 'row' }, [kSel.wrap, btn]), status, box]);
    var busy = false;

    btn.addEventListener('click', function () {
      if (busy) return; busy = true; btn.disabled = true;
      clear(box); box.hidden = true; say(status, '미리보기를 만드는 중입니다. 아직 문자는 전송되지 않았습니다.');
      authed('admin_preview_worksheet', { profileName: p.name, k: parseInt(kSel.input.value, 10) === 2 ? 2 : 1 }).then(function (r) {
        busy = false; btn.disabled = false;
        var d = r.data;
        if (!state.token) return;
        if (!(r.ok && d && typeof d.previewId === 'string' && typeof d.message === 'string')) { say(status, errText(r, '미리보기를 만들지 못했습니다.'), 'err'); return; }
        say(status, '아래 내용을 확인하세요. 전송 버튼을 누르기 전에는 문자가 발송되지 않습니다.');
        showPreview(d);
      });
    });

    function showPreview(d) {
      clear(box); box.hidden = false;
      var type = d.messageType === 'LMS' || d.messageType === 'lms' ? 'LMS(장문)' : (d.messageType === 'SMS' || d.messageType === 'sms' ? 'SMS(단문)' : '문자');
      box.appendChild(el('p', { text: '받는 번호: ' + (str(d.phoneMasked) || '확인 필요') + ' · 종류: ' + type + ' · 전송 미리보기 만료: ' + deadline(d.expiresAt) }));
      box.appendChild(el('div', { class: 'sms-msg', text: d.message }));
      var href = safeUrl(d.link);
      box.appendChild(el('p', null, ['링크: ', href ? el('a', { href: href, target: '_blank', rel: 'noopener noreferrer', text: href }) : el('span', { text: '확인 필요' })]));
      var send = el('button', { class: 'btn primary', type: 'button', text: '이 내용으로 전송' });
      var res = el('p', { class: 'status', role: 'status', 'aria-live': 'polite' });
      var sending = false, done = false;
      send.addEventListener('click', function () {
        if (sending || done) return; sending = true; send.disabled = true; btn.disabled = true;
        say(res, '전송 요청 중입니다…');
        authed('admin_send_worksheet', { previewId: d.previewId }).then(function (r) {
          sending = false;
          if (!state.token) return;
          var x = r.data, ph = x && x.phoneMasked ? ' (' + str(x.phoneMasked) + ')' : '';
          if (r.ok && x && x.status === 'sent' && x.ok === true) { done = true; say(res, '전송 완료' + ph, 'ok'); }
          else if (r.ok && x && x.status === 'queued') { done = true; say(res, '전송 접수됨 — 대기열에 등록되었으며 아직 발송 완료가 아닙니다' + ph, 'ok'); }
          else if (r.ok && x && x.status === 'failed') { say(res, '전송에 실패했습니다. 자동으로 다시 보내지 않습니다. 새 미리보기를 직접 만들어 주세요.', 'err'); }
          else { say(res, '전송 결과를 확인할 수 없습니다. 중복 발송을 막기 위해 자동으로 다시 보내지 않습니다. 새 미리보기를 직접 만들어 주세요.', 'err'); }
          btn.disabled = false;
          send.disabled = true; /* never re-enabled: a new preview is required */
        });
      });
      box.appendChild(send); box.appendChild(res);
    }
    return wrap;
  }

  /* ---------- init ---------- */
  function init() {
    var o = loadToken();
    if (o) { state.token = o.t; showAdmin(); loadList(''); }
    else showLogin();
  }
  init();
})();
