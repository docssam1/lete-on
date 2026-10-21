(function () {
  'use strict';
  var KEY = 'nm_access_lang';
  var T = {
  "ko": {
    "title": "수의 마법 · Numbers of Magic",
    "lead": "이메일 또는 아이디로 로그인해 주세요.",
    "loginTitle": "반가워요!",
    "user": "이메일 또는 아이디",
    "password": "비밀번호",
    "login": "로그인",
    "signup": "처음이거나 비밀번호를 잊었어요",
    "preview": "가입 전에 체험하기",
    "back": "소개로 돌아가기",
    "empty": "이메일 또는 아이디와 비밀번호를 입력해 주세요.",
    "busy": "로그인하고 있어요…",
    "ok": "확인되었습니다. 이동합니다…",
    "invalid_credentials": "이메일·아이디 또는 비밀번호가 맞지 않습니다.",
    "invalid_email": "이메일 주소를 확인해 주세요.",
    "rate_limited": "시도가 너무 많습니다. 잠시 후 다시 시도해 주세요.",
    "network": "네트워크 연결을 확인해 주세요.",
    "storage": "이 브라우저에서 저장 공간을 사용할 수 없습니다.",
    "unavailable": "지금은 이용할 수 없습니다. 잠시 후 다시 시도해 주세요.",
    "eyebrow": "하루 10분, 숫자와 친해지는 시간",
    "heroLine": "생각을 펼치면,",
    "heroTitle": "수의 마법",
    "heroDescription": "보고, 만지고, 스스로 발견하는 연산.\n숫자 친구들과 나만의 배움을 시작해요.",
    "browse": "둘러보기",
    "story": "수의 마법 이야기 읽기",
    "bookTitle": "수의 마법",
    "coverCaption": "생각이 자라는 나만의 모험",
    "invitation": "책을 펼치면, 배움이 시작돼요.",
    "footer": "작은 발견이 쌓여, 단단한 수학으로.",
    "pageTitle": "오늘은 어떤 발견을\n만나게 될까요?",
    "pageIntro": "숫자 친구들이 기다리고 있어요.\n우리, 다음 이야기를 함께 펼쳐요.",
    "loginKicker": "나의 배움 이어가기",
    "trialQuestion": "먼저 경험해 보고 싶다면",
    "openLabel": "책 펼치기",
    "closeLabel": "책 닫기"
  },
  "en": {
    "title": "Numbers of Magic · GFIELD",
    "lead": "Log in with your email or username.",
    "loginTitle": "Welcome back!",
    "user": "Email or username",
    "password": "Password",
    "login": "Log in",
    "signup": "First visit or forgot your password?",
    "preview": "Try before signing up",
    "back": "Back to introduction",
    "empty": "Enter your email or username and password.",
    "busy": "Signing in…",
    "ok": "Verified. Moving on…",
    "invalid_credentials": "The email, username or password is incorrect.",
    "invalid_email": "Enter a valid email address.",
    "rate_limited": "Too many attempts. Please try again later.",
    "network": "Please check your network connection.",
    "storage": "Storage is unavailable in this browser.",
    "unavailable": "Unavailable right now. Please try again later.",
    "eyebrow": "Ten minutes a day. A world of numbers.",
    "heroLine": "Open your mind.",
    "heroTitle": "Find the magic.",
    "heroDescription": "See, touch and discover how numbers work.\nYour own learning adventure starts here.",
    "browse": "Explore",
    "story": "Read our story",
    "bookTitle": "Numbers\nof Magic",
    "coverCaption": "An adventure for curious minds",
    "invitation": "Open the book. Let the learning begin.",
    "footer": "Small discoveries. Lasting understanding.",
    "pageTitle": "What will you\ndiscover today?",
    "pageIntro": "Your number friends are waiting.\nLet’s open the next chapter together.",
    "loginKicker": "YOUR NEXT CHAPTER",
    "trialQuestion": "Curious to try it first?",
    "openLabel": "Open the book",
    "closeLabel": "Close the book"
  },
  "zh": {
    "title": "数字魔法 · GFIELD",
    "lead": "请使用邮箱或账号登录。",
    "loginTitle": "欢迎回来！",
    "user": "邮箱或账号",
    "password": "密码",
    "login": "登录",
    "signup": "首次使用或忘记密码？",
    "preview": "注册前先体验",
    "back": "返回介绍",
    "empty": "请输入邮箱或账号及密码。",
    "busy": "正在登录…",
    "ok": "已确认，正在跳转…",
    "invalid_credentials": "邮箱、账号或密码不正确。",
    "invalid_email": "请输入有效的邮箱地址。",
    "rate_limited": "尝试次数过多，请稍后再试。",
    "network": "请检查网络连接。",
    "storage": "此浏览器无法使用存储空间。",
    "unavailable": "目前无法使用，请稍后再试。",
    "eyebrow": "每天10分钟，和数字成为朋友",
    "heroLine": "展开思考，",
    "heroTitle": "发现数字魔法",
    "heroDescription": "看一看、动动手，自己发现运算的奥秘。\n和数字朋友一起，开启自己的学习旅程。",
    "browse": "探索看看",
    "story": "阅读数字魔法的故事",
    "bookTitle": "数字魔法",
    "coverCaption": "让思考成长的专属冒险",
    "invitation": "翻开书，学习就开始了。",
    "footer": "积累小小发现，打好数学基础。",
    "pageTitle": "今天会遇见\n什么新发现？",
    "pageIntro": "数字朋友们正在等你。\n一起翻开下一页故事吧。",
    "loginKicker": "继续我的学习",
    "trialQuestion": "想先体验一下？",
    "openLabel": "翻开书本",
    "closeLabel": "合上书本"
  }
};
  var lang = 'ko', busy = false;
  var $ = function(id) { return document.getElementById(id); };
  var form=$('login-form'), user=$('login-user'), code=$('login-password'),
      btn=$('login-submit'), status=$('login-status'), authReady=null;
  var book=$('login-book'), close=$('close-book'), opener=null;
  function openBook(ev) {
    if (book.open) return;
    opener=ev.currentTarget;
    book.classList.remove('is-open');
    book.showModal(); book.scrollTop=0;
    requestAnimationFrame(function(){requestAnimationFrame(function(){if(book.open)book.classList.add('is-open');});});
  }
  function closeBook() {
    if (busy) return;
    book.classList.remove('is-open'); book.close();
    code.value=''; setStatus('');
    if (opener) opener.focus();
  }
  ['open-book','open-login','cover-open'].forEach(function(id){$(id).addEventListener('click',openBook);});
  close.addEventListener('click',closeBook);
  book.addEventListener('cancel',function(ev){ev.preventDefault();closeBook();});
  book.addEventListener('click',function(ev){if(ev.target===book)closeBook();});
  book.addEventListener('keydown',function(ev){
    if(ev.key!=='Tab')return;
    var controls=Array.prototype.filter.call(book.querySelectorAll('button,input,a[href]'),function(el){return !el.disabled&&el.getClientRects().length;});
    if(!controls.length){ev.preventDefault();return;}
    var first=controls[0],last=controls[controls.length-1],active=document.activeElement;
    if(ev.shiftKey&&active===first){ev.preventDefault();last.focus();}
    else if(!ev.shiftKey&&active===last){ev.preventDefault();first.focus();}
  });
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
    $('cover-open').setAttribute('aria-label',d.openLabel);
    close.setAttribute('aria-label',d.closeLabel);
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
    busy=true; btn.disabled=true; user.disabled=true; code.disabled=true; close.disabled=true;
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
      busy=false; btn.disabled=false; user.disabled=false; code.disabled=false; close.disabled=false;
      $('guardian-link').removeAttribute('aria-disabled'); code.focus();
    }
  });
  $('guardian-link').addEventListener('click',function(ev){if(busy)ev.preventDefault();});
  $('preview-link').addEventListener('click',function(ev){if(busy)ev.preventDefault();});
  var requested=new URLSearchParams(location.search).get('lang');
  lang=ok(requested)?requested:initial();
  apply();
})();
