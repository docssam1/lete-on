(function () {
  'use strict';
  var KEY = 'nm_access_lang';
  var T = {
    ko: {
      title: '수의 마법 · 승인·로그인', lead: '시작하는 방법을 선택해 주세요.',
      gTitle: '보호자 로그인·가입',
      gDesc: '인증된 보호자 이메일로 인증 코드를 받고, 비밀번호를 설정해 가입합니다. 회원 승인 상태는 로그인 후 확인됩니다.',
      gTrial: '이메일 인증 후 30일 동안 체험할 수 있어요. 정식 이용은 학원 승인 후 시작됩니다.',
      gBtn: '보호자 이메일로 로그인·가입',
      rSummary: '마스터 점검 로그인',
      rDesc: '전체 학습 기능을 확인하는 점검용 계정입니다. 학생 관리 권한은 없으며 실제 학생 진도·포인트와 따로 저장됩니다.',
      rUser: '아이디', rCode: '확인 코드', rBtn: '마스터 점검 로그인',
      preview: '가입 전 둘러보기', back: '소개로 돌아가기',
      empty: '아이디와 확인 코드를 입력해 주세요.', busy: '확인 중입니다…', ok: '확인되었습니다. 이동합니다…',
      invalid_credentials: '아이디 또는 확인 코드가 올바르지 않습니다.',
      rate_limited: '시도가 너무 많습니다. 잠시 후 다시 시도해 주세요.',
      network: '네트워크 연결을 확인해 주세요.',
      storage: '이 브라우저에서 저장 공간을 사용할 수 없습니다.',
      unavailable: '지금은 이용할 수 없습니다. 잠시 후 다시 시도해 주세요.'
    },
    en: {
      title: 'Numbers of Magic · Approval & Login', lead: 'Choose how you would like to begin.',
      gTitle: 'Guardian login / sign up',
      gDesc: 'Verify your guardian email with a code, then set a password. Membership approval status is checked after you log in.',
      gTrial: 'Try the program for 30 days after email verification. Full membership starts after academy approval.',
      gBtn: 'Log in / sign up with guardian email',
      rSummary: 'Master review login',
      rDesc: 'A review account for checking all learning features. It has no student management access, and its data is stored separately from real student progress and points.',
      rUser: 'Username', rCode: 'Code', rBtn: 'Master review login',
      preview: 'Look around before signing up', back: 'Back to introduction',
      empty: 'Please enter the username and code.', busy: 'Checking…', ok: 'Verified. Moving on…',
      invalid_credentials: 'The username or code is incorrect.',
      rate_limited: 'Too many attempts. Please try again later.',
      network: 'Please check your network connection.',
      storage: 'Storage is unavailable in this browser.',
      unavailable: 'Unavailable right now. Please try again later.'
    },
    zh: {
      title: '数字魔法 · 审批·登录', lead: '请选择开始方式。',
      gTitle: '监护人登录·注册',
      gDesc: '使用已验证的监护人邮箱获取验证码,然后设置密码完成注册。会员审批状态在登录后确认。',
      gTrial: '邮箱验证后可体验30天，正式会员在学苑审批后开始使用。',
      gBtn: '使用监护人邮箱登录·注册',
      rSummary: '主账号检查登录',
      rDesc: '这是用于查看全部学习功能的检查账号。没有学生管理权限,数据与真实学生的进度和积分分开保存。',
      rUser: '账号', rCode: '验证码', rBtn: '主账号检查登录',
      preview: '注册前先看看', back: '返回介绍',
      empty: '请输入账号和验证码。', busy: '正在确认…', ok: '已确认,正在跳转…',
      invalid_credentials: '账号或验证码不正确。',
      rate_limited: '尝试次数过多,请稍后再试。',
      network: '请检查网络连接。',
      storage: '此浏览器无法使用存储空间。',
      unavailable: '目前无法使用,请稍后再试。'
    }
  };
  var lang = 'ko', busy = false;
  var $ = function (id) { return document.getElementById(id); };
  var form = $('review-form'), user = $('review-user'), code = $('review-code'),
      btn = $('review-submit'), status = $('review-status');

  function ok(l) { return l === 'ko' || l === 'en' || l === 'zh'; }
  function initial() {
    try { var s = localStorage.getItem(KEY); if (ok(s)) return s; } catch (e) {}
    try {
      var st = JSON.parse(localStorage.getItem('nm_state_v1') || 'null');
      if (st && ok(st.lang)) return st.lang;
    } catch (e2) {}
    return 'ko';
  }
  function setStatus(msg, cls) { status.textContent = msg || ''; status.className = 'status' + (cls ? ' ' + cls : ''); }
  function q(base) {
    var url = base + '&lang=' + encodeURIComponent(lang);
    var ws = new URLSearchParams(location.search).get('ws');
    if (ws) url += '&ws=' + encodeURIComponent(ws);
    return url;
  }
  function grant(mode) { sessionStorage.setItem('nm_entry_once_v1', JSON.stringify({mode:mode,at:Date.now()})); }
  $('preview-link').addEventListener('click', function(ev){
    try { grant('preview'); } catch(e) { ev.preventDefault(); setStatus(T[lang].storage,'err'); }
  });
  function apply() {
    var d = T[lang];
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
    document.title = d.title;
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n]'), function (el) {
      if (d[el.getAttribute('data-i18n')] != null) el.textContent = d[el.getAttribute('data-i18n')];
    });
    Array.prototype.forEach.call(document.querySelectorAll('.access-lang'), function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false');
    });
    $('guardian-link').href = q('index.html?enter=1&auth=1');
    $('preview-link').href = q('index.html?enter=1');
    status.textContent = '';
    status.className = 'status';
  }
  function setLang(l) {
    if (!ok(l)) return;
    lang = l;
    try { localStorage.setItem(KEY, l); } catch (e) {}
    apply();
  }
  Array.prototype.forEach.call(document.querySelectorAll('.access-lang'), function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (busy) return;
    var u = user.value.trim(), c = code.value;
    if (!u || !c || new TextEncoder().encode(c).length > 72 || u.length > 64) { setStatus(T[lang].empty, 'err'); return; }
    var api = window.NM_REVIEW_SESSION;
    if (!api || typeof api.login !== 'function') { code.value = ''; setStatus(T[lang].unavailable, 'err'); return; }
    busy = true; btn.disabled = true; setStatus(T[lang].busy);
    var p;
    try { p = Promise.resolve(api.login(u, c)); } catch (e) { p = Promise.reject(e); }
    p.then(function () {
      code.value = '';
      try { grant('review'); } catch(e) { setStatus(T[lang].storage, 'err'); busy=false;btn.disabled=false;return; }
      setStatus(T[lang].ok, 'ok');
      location.assign(q('index.html?enter=1&review=1'));
    }, function (err) {
      code.value = '';
      var k = err && err.code;
      setStatus(T[lang][k] && k !== 'title' ? T[lang][k] : T[lang].unavailable, 'err');
      busy = false; btn.disabled = false;
      code.focus();
    });
  });

  var requested = new URLSearchParams(location.search).get('lang');
  lang = ok(requested) ? requested : initial();
  apply();
})();
