// ── 카카오톡 인앱 브라우저 → 외부 브라우저 전환 ─────────────────────────
// Kakao Developers 문서 기준: 카카오톡 인앱 브라우저 UA에는 KAKAOTALK가 포함된다.
// Android에서는 Chrome/기본 브라우저 intent를 자동 시도하고, iOS에서는 플랫폼 제한상
// Safari 강제 실행이 불가능하므로 즉시 안내 오버레이를 제공한다.
(function enableKakaoExternalBrowser(){
  var ua = navigator.userAgent || '';
  if (!/KAKAOTALK/i.test(ua)) return;

  var isAndroid = /Android/i.test(ua);
  var isIOS = /iPhone|iPad|iPod/i.test(ua);
  var target = new URL(window.location.href);

  // 외부 브라우저로 넘긴 URL이 다시 카카오 WebView fallback으로 돌아왔을 때 무한 반복 방지
  if (target.searchParams.get('_external_browser') === '1') {
    ready(showGuide);
    return;
  }
  target.searchParams.set('_external_browser', '1');

  function ready(fn){
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, {once:true});
    else fn();
  }

  function androidIntent(packageName){
    var scheme = target.protocol.replace(':','') || 'https';
    var path = target.host + target.pathname + target.search;
    return 'intent://' + path + '#Intent;scheme=' + scheme +
      (packageName ? ';package=' + packageName : '') +
      ';action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE' +
      ';S.browser_fallback_url=' + encodeURIComponent(target.href) + ';end';
  }

  function openChrome(){
    window.location.href = androidIntent('com.android.chrome');
  }

  function openDefaultBrowser(){
    window.location.href = androidIntent('');
  }

  function copyLink(button){
    var text = target.href.replace(/([?&])_external_browser=1(&|$)/, function(_, lead, tail){
      return tail ? lead : '';
    }).replace(/[?&]$/, '');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function(){
        var old = button.textContent;
        button.textContent = '링크 복사됨 ✓';
        setTimeout(function(){ button.textContent = old; }, 1300);
      }).catch(function(){});
    }
  }

  function showGuide(){
    if (document.getElementById('kakao-external-guide')) return;

    var wrap = document.createElement('div');
    wrap.id = 'kakao-external-guide';
    wrap.setAttribute('role','dialog');
    wrap.setAttribute('aria-modal','true');
    wrap.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:rgba(20,24,20,.62);display:flex;align-items:center;justify-content:center;padding:22px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans KR",sans-serif;';

    var card = document.createElement('div');
    card.style.cssText = 'width:min(100%,420px);background:#fff;border-radius:22px;padding:24px 20px 20px;box-shadow:0 18px 60px rgba(0,0,0,.28);text-align:center;color:#243126;';

    var icon = document.createElement('div');
    icon.textContent = '🌐';
    icon.style.cssText = 'font-size:42px;margin-bottom:9px;';

    var title = document.createElement('div');
    title.textContent = '외부 브라우저로 열어주세요';
    title.style.cssText = 'font-size:21px;font-weight:900;letter-spacing:-.4px;margin-bottom:9px;';

    var desc = document.createElement('div');
    desc.style.cssText = 'font-size:14px;line-height:1.65;color:#617064;margin-bottom:16px;';
    desc.innerHTML = isAndroid
      ? '카카오톡 안에서는 일부 기능이 제한될 수 있어요.<br><b>Chrome 또는 기본 브라우저</b>에서 열어주세요.'
      : 'iPhone에서는 웹페이지가 Safari를 강제로 실행할 수 없어요.<br>카카오톡의 <b>⋯ 메뉴 → 다른 브라우저로 열기</b>를 선택해 주세요.';

    card.appendChild(icon);
    card.appendChild(title);
    card.appendChild(desc);

    if (isAndroid) {
      var chrome = document.createElement('button');
      chrome.type = 'button';
      chrome.textContent = 'Chrome으로 열기';
      chrome.style.cssText = 'width:100%;border:0;border-radius:13px;padding:14px 16px;background:#3e7a4e;color:white;font-size:16px;font-weight:800;margin-bottom:9px;';
      chrome.onclick = openChrome;
      card.appendChild(chrome);

      var basic = document.createElement('button');
      basic.type = 'button';
      basic.textContent = '기본 브라우저로 열기';
      basic.style.cssText = 'width:100%;border:1px solid #d9dfd8;border-radius:13px;padding:13px 16px;background:#fff;color:#314034;font-size:15px;font-weight:750;margin-bottom:9px;';
      basic.onclick = openDefaultBrowser;
      card.appendChild(basic);
    } else if (isIOS) {
      var iosTip = document.createElement('div');
      iosTip.innerHTML = '<b>1.</b> 화면 오른쪽 아래/위의 <b>⋯</b> 누르기<br><b>2.</b> <b>Safari에서 열기</b> 또는 <b>다른 브라우저로 열기</b> 선택';
      iosTip.style.cssText = 'text-align:left;background:#f5f8f4;border-radius:13px;padding:13px 15px;font-size:14px;line-height:1.75;margin-bottom:10px;';
      card.appendChild(iosTip);
    }

    var copy = document.createElement('button');
    copy.type = 'button';
    copy.textContent = '링크 복사하기';
    copy.style.cssText = 'width:100%;border:0;background:transparent;padding:10px;color:#6a776c;font-size:13px;text-decoration:underline;';
    copy.onclick = function(){ copyLink(copy); };
    card.appendChild(copy);

    wrap.appendChild(card);
    document.body.appendChild(wrap);
  }

  if (isAndroid) {
    // Android 카카오 WebView에서 외부 Chrome 실행을 먼저 시도한다.
    setTimeout(openChrome, 120);
    // WebView/보안 설정으로 intent가 막히면 즉시 수동 버튼을 보여준다.
    setTimeout(function(){ ready(showGuide); }, 1200);
  } else {
    // iOS Safari는 웹에서 강제 실행할 수 없으므로 바로 안내한다.
    ready(showGuide);
  }
})();

// ── 보캡 테스트 단어 데이터 ─────────────────────────────────────────────
// 새로운 날 추가하는 법: 사진을 Claude에게 올리면 이 배열 맨 앞에
// { id, date, label, words } 한 덩어리를 추가한다. id는 'd' + YYYYMMDD.
// def는 교재 문구를 그대로 베끼지 않고 같은 뜻의 쉬운 영어로 다시 쓴 것.
// ko는 인정할 답 여러 개(음성 인식이 어느 하나라도 포함하면 정답).
window.VOCAB_DAYS = [
  {
    id: 'd20260816',
    date: '2026-08-16',
    label: 'Week 1 · Unit 1 · Reading 1',
    words: [
      { en: 'have something in common', pos: 'idm',
        kw: ['share', 'same', 'common'], kwNeed: 1,
        def: 'to share the same interest or feature with someone',
        ko: ['공통점이 있다', '공통점'], koShow: '공통점이 있다',
        enAlt: ['in common', 'something in common'] },
      { en: 'left-handed', pos: 'adj',
        kw: ['left', 'hand'], kwNeed: 2,
        def: 'doing things mainly with the left hand',
        ko: ['왼손잡이'], koShow: '왼손잡이의',
        enAlt: ['left handed'] },
      { en: 'right-handed', pos: 'adj',
        kw: ['right', 'hand'], kwNeed: 2,
        def: 'doing things mainly with the right hand',
        ko: ['오른손잡이'], koShow: '오른손잡이의',
        enAlt: ['right handed'] },
      { en: 'population', pos: 'n',
        kw: ['people', 'number', 'live', 'many', 'place', 'area'], kwNeed: 2,
        def: 'how many people live in a certain place',
        ko: ['인구'], koShow: '인구' },
      { en: 'message', pos: 'n',
        kw: ['information', 'send', 'sent', 'words', 'someone', 'note'], kwNeed: 2,
        def: 'words or information you send to another person',
        ko: ['메시지', '메세지', '전갈', '전하는 말'], koShow: '메시지' },
      { en: 'intelligent', pos: 'adj',
        kw: ['smart', 'clever', 'learn', 'understand'], kwNeed: 1,
        def: 'smart, and able to learn and understand things well',
        ko: ['지능 높은', '지능이 높은', '지능이 높다', '똑똑한', '똑똑하다', '영리한', '영리하다'],
        koShow: '지능 높은, 똑똑한' },
      { en: 'quality', pos: 'n',
        kw: ['good', 'excellent', 'standard', 'level'], kwNeed: 1,
        def: 'how good or excellent something is',
        ko: ['퀄리티', '품질', '질 '], koShow: '퀄리티 (높은 품질)' },
      { en: 'punctual', pos: 'adj',
        kw: ['on time', 'never late', 'not late', 'always time'], kwNeed: 1,
        def: 'always on time, and never late',
        ko: ['시간을 지키는', '시간을 잘 지키는', '시간을 지키다', '시간 엄수'],
        koShow: '시간을 지키는' },
      { en: 'logic', pos: 'n',
        kw: ['thinking', 'reason', 'reasonable', 'clear'], kwNeed: 1,
        def: 'clear and reasonable thinking',
        ko: ['논리'], koShow: '논리' },
      { en: 'in order', pos: 'phr',
        kw: ['sequence', 'arranged', 'arrange', 'correct order', 'neat'], kwNeed: 1,
        def: 'arranged one after another in the right way',
        ko: ['순서대로', '정돈된', '차례대로'], koShow: '순서대로',
        enAlt: [] },
      { en: 'recognize', pos: 'v',
        kw: ['know', 'remember', 'seen before', 'saw before', 'saw it before'], kwNeed: 1,
        def: 'to know who or what something is, because you saw it before',
        ko: ['알아보다', '알아본다', '인식하다', '알아차리다'], koShow: '알아보다, 인식하다' },
      { en: 'movement', pos: 'n',
        kw: ['moving', 'move', 'position', 'location', 'changing'], kwNeed: 1,
        def: 'the act of moving or changing position',
        ko: ['움직임'], koShow: '움직임' },
      { en: 'accountant', pos: 'n',
        kw: ['money', 'financial', 'records', 'accounts'], kwNeed: 1,
        def: 'a person whose job is taking care of money records',
        ko: ['회계사'], koShow: '회계사' },
      { en: 'exception', pos: 'n',
        kw: ['rule', 'not follow', 'different', 'follow the rule'], kwNeed: 1,
        def: 'something that does not follow the usual rule',
        ko: ['예외'], koShow: '예외' },
      { en: 'practical', pos: 'adj',
        kw: ['useful', 'real', 'effective', 'helpful'], kwNeed: 1,
        def: 'useful and helpful in real life',
        ko: ['실용적인', '유용한', '실용적이다', '실용적'], koShow: '실용적인, 유용한' },
      { en: 'overwhelming', pos: 'adj',
        kw: ['intense', 'difficult', 'too much', 'strong'], kwNeed: 1,
        def: 'very intense or hard to handle',
        ko: ['압도적인', '압도하는', '벅찬'], koShow: '압도적인' },
      { en: 'outdated', pos: 'adj',
        kw: ['old', 'not useful', 'not fashionable', 'old fashioned'], kwNeed: 1,
        def: 'too old to be useful or fashionable anymore',
        ko: ['구식인', '유행에 뒤떨어진', '구식이다'], koShow: '구식인 (유행에 뒤떨어진)' },
      { en: 'literature', pos: 'n',
        kw: ['written', 'books', 'stories', 'poems', 'plays'], kwNeed: 1,
        def: 'important or beautiful written works, like stories and poems',
        ko: ['문학'], koShow: '문학' },
      { en: 'career', pos: 'n',
        kw: ['job', 'work', 'years', 'profession'], kwNeed: 1,
        def: 'the kind of job a person does for many years',
        ko: ['직업', '진로', '경력'], koShow: '직업, 진로' },
      { en: 'lexicographer', pos: 'n',
        kw: ['dictionary', 'dictionaries', 'words', 'writes'], kwNeed: 1,
        def: 'a person whose job is writing or editing dictionaries',
        ko: ['사전을 만드는 사람', '사전 편찬자'], koShow: '사전을 쓰거나 편집하는 사람',
        enAlt: [] },
      { en: 'blockbuster', pos: 'n',
        kw: ['movie', 'book', 'huge', 'popular', 'success'], kwNeed: 1,
        def: 'a movie or book that becomes a huge popular success',
        ko: ['흥행작', '대박작'], koShow: '흥행작' },
      { en: 'intricately', pos: 'adv',
        kw: ['complex', 'detailed', 'many parts', 'complicated'], kwNeed: 1,
        def: 'made of many small parts put together in a complex way',
        ko: ['정교하게', '복잡하게'], koShow: '정교하게' },
      { en: 'decade', pos: 'n',
        kw: ['ten years', 'time period', 'years'], kwNeed: 1,
        def: 'a period of time that lasts exactly ten years',
        ko: ['10년'], koShow: '10년' },
      { en: 'stimulating', pos: 'adj',
        kw: ['exciting', 'new ideas', 'mind', 'interesting'], kwNeed: 1,
        def: 'exciting, because it makes your mind think of new ideas',
        ko: ['자극적인', '흥미를 돋우는'], koShow: '자극적인' },
      { en: 'epic', pos: 'adj',
        kw: ['grand', 'large', 'impressive', 'heroic'], kwNeed: 1,
        def: 'grand, large, and impressive, like a long heroic adventure',
        ko: ['서사적인', '장대한'], koShow: '서사적인 (장대한 규모)' },
      { en: 'sequence', pos: 'n',
        kw: ['order', 'follow', 'one after another'], kwNeed: 1,
        def: 'the exact order in which things follow one after another',
        ko: ['순서'], koShow: '순서' },
      { en: 'literary', pos: 'adj',
        kw: ['books', 'writers', 'literature', 'writing'], kwNeed: 1,
        def: 'connected to books, writers, or the study of literature',
        ko: ['문학의', '문학적인'], koShow: '문학의 (문학적인)' },
      { en: 'stack', pos: 'n',
        kw: ['pile', 'on top', 'neat'], kwNeed: 1,
        def: 'a neat pile of things sitting on top of each other',
        ko: ['더미', '쌓아 놓은 것'], koShow: '더미' },
      { en: 'contract', pos: 'n',
        kw: ['agreement', 'written', 'law', 'promise'], kwNeed: 1,
        def: 'a formal written agreement that people are legally bound to follow',
        ko: ['계약서', '계약'], koShow: '계약서' },
      { en: 'correspondence', pos: 'n',
        kw: ['letters', 'emails', 'write to each other'], kwNeed: 1,
        def: 'the letters or emails that people write to one another',
        ko: ['편지', '서신', '이메일'], koShow: '편지, 서신 (이메일)' },
    ],
  },
];
