(function () {
  'use strict';
  var KEY = 'nm_access_lang';
  var T = {
  "ko": {
    "title": "수의 마법 · 승인·로그인",
    "lead": "이메일 또는 아이디로 로그인해 주세요.",
    "loginTitle": "로그인",
    "user": "이메일 또는 아이디",
    "password": "비밀번호",
    "login": "로그인",
    "signup": "처음이거나 비밀번호를 잊었어요",
    "preview": "가입 전 둘러보기",
    "back": "소개로 돌아가기",
    "empty": "이메일 또는 아이디와 비밀번호를 입력해 주세요.",
    "busy": "로그인하고 있어요…",
    "ok": "확인되었습니다. 이동합니다…",
    "invalid_credentials": "이메일·아이디 또는 비밀번호가 맞지 않습니다.",
    "invalid_email": "이메일 주소를 확인해 주세요.",
    "rate_limited": "시도가 너무 많습니다. 잠시 후 다시 시도해 주세요.",
    "network": "네트워크 연결을 확인해 주세요.",
    "storage": "이 브라우저에서 저장 공간을 사용할 수 없습니다.",
    "unavailable": "지금은 이용할 수 없습니다. 잠시 후 다시 시도해 주세요."
  },
  "en": {
    "title": "Numbers of Magic · Approval & Login",
    "lead": "Log in with your email or username.",
    "loginTitle": "Login",
    "user": "Email or username",
    "password": "Password",
    "login": "Log in",
    "signup": "First visit or forgot your password?",
    "preview": "Look around before signing up",
    "back": "Back to introduction",
    "empty": "Enter your email or username and password.",
    "busy": "Signing in…",
    "ok": "Verified. Moving on…",
    "invalid_credentials": "The email, username or password is incorrect.",
    "invalid_email": "Enter a valid email address.",
    "rate_limited": "Too many attempts. Please try again later.",
    "network": "Please check your network connection.",
    "storage": "Storage is unavailable in this browser.",
    "unavailable": "Unavailable right now. Please try again later."
  },
  "zh": {
    "title": "数字魔法 · 审批·登录",
    "lead": "请使用邮箱或账号登录。",
    "loginTitle": "登录",
    "user": "邮箱或账号",
    "password": "密码",
    "login": "登录",
    "signup": "首次使用或忘记密码？",
    "preview": "注册前先看看",
    "back": "返回介绍",
    "empty": "请输入邮箱或账号及密码。",
    "busy": "正在登录…",
    "ok": "已确认，正在跳转…",
    "invalid_credentials": "邮箱、账号或密码不正确。",
    "invalid_email": "请输入有效的邮箱地址。",
    "rate_limited": "尝试次数过多，请稍后再试。",
    "network": "请检查网络连接。",
    "storage": "此浏览器无法使用存储空间。",
    "unavailable": "目前无法使用，请稍后再试。"
  }
};
  var lang = 'ko', busy = false;
  var $ = function(id) { return document.getElementById(id); };
  var form=$('login-form'), user=$('login-user'), code=$('login-password'),
      btn=$('login-submit'), status=$('login-status'), authReady=null;
  var SB_URL="https://fgahqumaldheqettmvqg.supabase.co", SB_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnYWhxdW1hbGRoZXFldHRtdnFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NjAzNDcsImV4cCI6MjA5NzIzNjM0N30.iUXLFteDc_xIp_Xj506BKTxnZRYMObmTYQ2Dgh9RAqs";
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
  function grant(mode, userId) { sessionStorage.setItem('nm_entry_once_v1', JSON.stringify({mode:mode,at:Date.now(),userId:userId||null})); }
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


  form.addEventListener('submit', async function(ev) {
    ev.preventDefault();
    if (busy) return;
    var identity=user.value.trim(), password=code.value;
    if (!identity || !password) { setStatus(T[lang].empty,'err'); return; }
    // Route credentials by identifier only. Permissions still come from the validating server.
    var guardian=identity.indexOf('@')!==-1;
    if (!guardian && (identity.length>64 || new TextEncoder().encode(password).length>72)) {
      code.value=''; setStatus(T[lang].invalid_credentials,'err'); return;
    }
    busy=true; btn.disabled=true; user.disabled=true; code.disabled=true;
    $('guardian-link').setAttribute('aria-disabled','true');
    setStatus(T[lang].busy);
    try {
      if (guardian) {
        var auth=window.NM_PROFILE_AUTH;
        if (!auth) throw {code:'unavailable'};
        if (!authReady) {
          auth.configure({url:SB_URL,anonKey:SB_KEY,freshEntry:true});
          authReady=auth.ready();
        }
        await authReady;
        var signed=await auth.signInWithPassword(identity,password);
        grant('guardian',signed.user.id);
      } else {
        if (!window.NM_REVIEW_SESSION) throw {code:'unavailable'};
        await NM_REVIEW_SESSION.login(identity,password);
        grant('review');
      }
      code.value=''; setStatus(T[lang].ok,'ok');
      location.assign(q(guardian?'index.html?enter=1':'index.html?enter=1&review=1'));
    } catch(e) {
      code.value='';
      var key=e&&e.code;
      if (e&&e.status===429) key='rate_limited';
      else if (e&&[400,401,403].indexOf(e.status)!==-1&&key!=='invalid_email') key='invalid_credentials';
      setStatus(T[lang][key]||T[lang].unavailable,'err');
      busy=false; btn.disabled=false; user.disabled=false; code.disabled=false;
      $('guardian-link').removeAttribute('aria-disabled'); code.focus();
    }
  });
  $('guardian-link').addEventListener('click',function(ev){if(busy)ev.preventDefault();});
  $('preview-link').addEventListener('click',function(ev){if(busy)ev.preventDefault();});
  var requested=new URLSearchParams(location.search).get('lang');
  lang=ok(requested)?requested:initial();
  apply();
})();
