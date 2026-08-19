// ── 카카오톡 인앱 브라우저 → 외부 브라우저 전환 ─────────────────────────
(function enableKakaoExternalBrowser(){
  var ua=navigator.userAgent||'';
  if(!/KAKAOTALK/i.test(ua)) return;
  var isAndroid=/Android/i.test(ua), isIOS=/iPhone|iPad|iPod/i.test(ua);
  var target=new URL(window.location.href);
  if(target.searchParams.get('_external_browser')==='1'){ ready(showGuide); return; }
  target.searchParams.set('_external_browser','1');
  function ready(fn){ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn,{once:true}); else fn(); }
  function androidIntent(pkg){
    var scheme=target.protocol.replace(':','')||'https';
    var path=target.host+target.pathname+target.search;
    return 'intent://'+path+'#Intent;scheme='+scheme+(pkg?';package='+pkg:'')+';action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;S.browser_fallback_url='+encodeURIComponent(target.href)+';end';
  }
  function openChrome(){ window.location.href=androidIntent('com.android.chrome'); }
  function openDefault(){ window.location.href=androidIntent(''); }
  function showGuide(){
    if(document.getElementById('kakao-external-guide')) return;
    var wrap=document.createElement('div'); wrap.id='kakao-external-guide'; wrap.setAttribute('role','dialog'); wrap.setAttribute('aria-modal','true');
    wrap.style.cssText='position:fixed;inset:0;z-index:2147483647;background:rgba(20,24,20,.62);display:flex;align-items:center;justify-content:center;padding:22px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans KR",sans-serif;';
    var card=document.createElement('div'); card.style.cssText='width:min(100%,420px);background:#fff;border-radius:22px;padding:24px 20px 20px;box-shadow:0 18px 60px rgba(0,0,0,.28);text-align:center;color:#243126;';
    card.innerHTML='<div style="font-size:42px;margin-bottom:9px">🌐</div><div style="font-size:21px;font-weight:900;margin-bottom:9px">외부 브라우저로 열어주세요</div><div style="font-size:14px;line-height:1.65;color:#617064;margin-bottom:16px">'+(isAndroid?'카카오톡 안에서는 일부 기능이 제한될 수 있어요.<br><b>Chrome 또는 기본 브라우저</b>에서 열어주세요.':'iPhone에서는 웹페이지가 Safari를 강제로 실행할 수 없어요.<br>카카오톡의 <b>⋯ 메뉴 → 다른 브라우저로 열기</b>를 선택해 주세요.')+'</div>';
    if(isAndroid){
      var c=document.createElement('button'); c.textContent='Chrome으로 열기'; c.style.cssText='width:100%;border:0;border-radius:13px;padding:14px;background:#3e7a4e;color:#fff;font-size:16px;font-weight:800;margin-bottom:9px'; c.onclick=openChrome; card.appendChild(c);
      var d=document.createElement('button'); d.textContent='기본 브라우저로 열기'; d.style.cssText='width:100%;border:1px solid #d9dfd8;border-radius:13px;padding:13px;background:#fff;color:#314034;font-size:15px;font-weight:750'; d.onclick=openDefault; card.appendChild(d);
    }else if(isIOS){
      var tip=document.createElement('div'); tip.innerHTML='<b>1.</b> 화면 오른쪽 아래/위의 <b>⋯</b> 누르기<br><b>2.</b> <b>Safari에서 열기</b> 또는 <b>다른 브라우저로 열기</b> 선택'; tip.style.cssText='text-align:left;background:#f5f8f4;border-radius:13px;padding:13px 15px;font-size:14px;line-height:1.75'; card.appendChild(tip);
    }
    wrap.appendChild(card); document.body.appendChild(wrap);
  }
  if(isAndroid){ setTimeout(openChrome,120); setTimeout(function(){ready(showGuide);},1200); } else ready(showGuide);
})();

// ── 보캡 테스트 단어 데이터 ─────────────────────────────────────────────
// def는 교재 문구를 그대로 베끼지 않고 같은 뜻의 쉬운 영어로 다시 쓴 것.
window.VOCAB_DAYS = [
  {
    id:'d20260816', date:'2026-08-16', label:'Week 1 · Unit 1 · Reading 1',
    words:[
      {en:'have something in common',pos:'idm',kw:['share','same','common'],kwNeed:1,def:'to share the same interest or feature with someone',ko:['공통점이 있다','공통점'],koShow:'공통점이 있다',enAlt:['in common','something in common']},
      {en:'left-handed',pos:'adj',kw:['left','hand'],kwNeed:2,def:'doing things mainly with the left hand',ko:['왼손잡이'],koShow:'왼손잡이의',enAlt:['left handed']},
      {en:'right-handed',pos:'adj',kw:['right','hand'],kwNeed:2,def:'doing things mainly with the right hand',ko:['오른손잡이'],koShow:'오른손잡이의',enAlt:['right handed']},
      {en:'population',pos:'n',kw:['people','number','live','many','place','area'],kwNeed:2,def:'how many people live in a certain place',ko:['인구'],koShow:'인구'},
      {en:'message',pos:'n',kw:['information','send','sent','words','someone','note'],kwNeed:2,def:'words or information you send to another person',ko:['메시지','메세지','전갈','전하는 말'],koShow:'메시지'},
      {en:'intelligent',pos:'adj',kw:['smart','clever','learn','understand'],kwNeed:1,def:'smart and able to learn and understand things well',ko:['지능 높은','지능이 높은','똑똑한','영리한'],koShow:'지능 높은, 똑똑한'},
      {en:'quality',pos:'n',kw:['good','excellent','standard','level'],kwNeed:1,def:'how good or excellent something is',ko:['퀄리티','품질','질'],koShow:'퀄리티 (높은 품질)'},
      {en:'punctual',pos:'adj',kw:['on time','never late','not late'],kwNeed:1,def:'always on time and never late',ko:['시간을 지키는','시간을 잘 지키는','시간 엄수'],koShow:'시간을 지키는'},
      {en:'logic',pos:'n',kw:['thinking','reason','reasonable','clear'],kwNeed:1,def:'clear and reasonable thinking',ko:['논리'],koShow:'논리'},
      {en:'in order',pos:'phr',kw:['sequence','arranged','correct order','neat'],kwNeed:1,def:'arranged one after another in the right way',ko:['순서대로','정돈된','차례대로'],koShow:'순서대로'},
      {en:'recognize',pos:'v',kw:['know','remember','seen before'],kwNeed:1,def:'to know who or what something is because you saw it before',ko:['알아보다','인식하다','알아차리다'],koShow:'알아보다, 인식하다'},
      {en:'movement',pos:'n',kw:['moving','move','position','changing'],kwNeed:1,def:'the act of moving or changing position',ko:['움직임'],koShow:'움직임'},
      {en:'accountant',pos:'n',kw:['money','financial','records','accounts'],kwNeed:1,def:'a person whose job is taking care of money records',ko:['회계사'],koShow:'회계사'},
      {en:'exception',pos:'n',kw:['rule','not follow','different'],kwNeed:1,def:'something that does not follow the usual rule',ko:['예외'],koShow:'예외'},
      {en:'practical',pos:'adj',kw:['useful','real','effective','helpful'],kwNeed:1,def:'useful and helpful in real life',ko:['실용적인','유용한','실용적'],koShow:'실용적인, 유용한'},
      {en:'overwhelming',pos:'adj',kw:['intense','difficult','too much','strong'],kwNeed:1,def:'very intense or hard to handle',ko:['압도적인','압도하는','벅찬'],koShow:'압도적인'},
      {en:'outdated',pos:'adj',kw:['old','not useful','not fashionable'],kwNeed:1,def:'too old to be useful or fashionable anymore',ko:['구식인','유행에 뒤떨어진'],koShow:'구식인 (유행에 뒤떨어진)'},
      {en:'literature',pos:'n',kw:['written','books','stories','poems','plays'],kwNeed:1,def:'important or beautiful written works like stories and poems',ko:['문학'],koShow:'문학'},
      {en:'career',pos:'n',kw:['job','work','years','profession'],kwNeed:1,def:'the kind of job a person does for many years',ko:['직업','진로','경력'],koShow:'직업, 진로'},
      {en:'lexicographer',pos:'n',kw:['dictionary','dictionaries','words','writes'],kwNeed:1,def:'a person whose job is writing or editing dictionaries',ko:['사전을 만드는 사람','사전 편찬자'],koShow:'사전을 쓰거나 편집하는 사람'},
      {en:'blockbuster',pos:'n',kw:['movie','book','huge','popular','success'],kwNeed:1,def:'a movie or book that becomes a huge popular success',ko:['흥행작','대박작'],koShow:'흥행작'},
      {en:'intricately',pos:'adv',kw:['complex','detailed','many parts','complicated'],kwNeed:1,def:'in a complex way with many small details',ko:['정교하게','복잡하게'],koShow:'정교하게'},
      {en:'decade',pos:'n',kw:['ten years','years','period'],kwNeed:1,def:'a period of exactly ten years',ko:['10년'],koShow:'10년'},
      {en:'stimulating',pos:'adj',kw:['exciting','new ideas','mind','interesting'],kwNeed:1,def:'exciting because it makes your mind think of new ideas',ko:['자극적인','흥미를 돋우는'],koShow:'자극적인'},
      {en:'epic',pos:'adj',kw:['grand','large','impressive','heroic'],kwNeed:1,def:'grand and impressive like a long heroic adventure',ko:['서사적인','장대한'],koShow:'서사적인 (장대한 규모)'},
      {en:'sequence',pos:'n',kw:['order','follow','one after another'],kwNeed:1,def:'the order in which things follow one another',ko:['순서'],koShow:'순서'},
      {en:'literary',pos:'adj',kw:['books','writers','literature','writing'],kwNeed:1,def:'connected to books writers or literature',ko:['문학의','문학적인'],koShow:'문학의 (문학적인)'},
      {en:'stack',pos:'n',kw:['pile','on top','neat'],kwNeed:1,def:'a neat pile of things on top of each other',ko:['더미','쌓아 놓은 것'],koShow:'더미'},
      {en:'contract',pos:'n',kw:['agreement','written','law','promise'],kwNeed:1,def:'a formal written agreement people must follow',ko:['계약서','계약'],koShow:'계약서'},
      {en:'correspondence',pos:'n',kw:['letters','emails','write'],kwNeed:1,def:'letters or emails that people write to one another',ko:['편지','서신','이메일'],koShow:'편지, 서신 (이메일)'}
    ]
  },
  {
    id:'d20260819_2', date:'2026-08-19', label:'2번 · Unit 1',
    words:[
      {en:'abandon',pos:'v',kw:['leave','behind','completely'],kwNeed:1,def:'to leave a person or thing and not come back',ko:['버리다','떠나다','내버리다'],koShow:'버리다, 떠나다'},
      {en:'pity',pos:'n',kw:['sad','feeling','suffering','sorry'],kwNeed:1,def:'a sad feeling because someone is suffering',ko:['불쌍히 여김','연민','동정'],koShow:'불쌍히 여김, 연민'},
      {en:'tend',pos:'v',kw:['care','look after','take care'],kwNeed:1,def:'to take care of someone or something',ko:['돌보다','보살피다'],koShow:'돌보다, 보살피다'},
      {en:'otherwise',pos:'adv',kw:['if not','different','or else'],kwNeed:1,def:'if the situation is different from what was said',ko:['그렇지 않으면','달리','그 외에는'],koShow:'그렇지 않으면, 달리'},
      {en:'murmur',pos:'v',kw:['speak','quiet','soft','voice'],kwNeed:2,def:'to speak in a very quiet voice',ko:['중얼거리다','속삭이다'],koShow:'중얼거리다, 속삭이다'},
      {en:'bustle',pos:'n',kw:['busy','noisy','activity','movement'],kwNeed:2,def:'busy movement and noisy activity',ko:['부산함','북적거림','활기'],koShow:'부산함, 북적거림'},
      {en:'secondhand',pos:'adj',kw:['used','owned','before','someone else'],kwNeed:1,def:'already owned or used by another person',ko:['중고의','남이 쓰던','간접적인'],koShow:'중고의, 남이 쓰던'},
      {en:'anxiously',pos:'adv',kw:['worried','nervous','uneasy'],kwNeed:1,def:'in a nervous or worried way',ko:['걱정스럽게','초조하게','불안하게'],koShow:'걱정스럽게, 초조하게'},
      {en:'sigh',pos:'v',kw:['breath','deep','long','feeling'],kwNeed:1,def:'to breathe out slowly and deeply because of a feeling',ko:['한숨 쉬다','한숨을 내쉬다'],koShow:'한숨 쉬다'},
      {en:'niche',pos:'n',kw:['small','hollow','space','wall'],kwNeed:2,def:'a small hollow or space in a wall',ko:['벽감','벽의 오목한 공간','틈새'],koShow:'벽감, 벽의 오목한 공간'},
      {en:'babble',pos:'n',kw:['unclear','talk','sounds','hard to understand'],kwNeed:1,def:'unclear or meaningless talk or sounds',ko:['알아듣기 힘든 말','재잘거림','옹알이'],koShow:'알아듣기 힘든 말, 재잘거림'},
      {en:'thicket',pos:'n',kw:['bushes','trees','thick','plants'],kwNeed:2,def:'a thick area of bushes and small trees',ko:['덤불','수풀','잡목 숲'],koShow:'덤불, 수풀'},
      {en:'faintly',pos:'adv',kw:['weak','soft','unclear','slightly'],kwNeed:1,def:'in a weak soft or unclear way',ko:['희미하게','약하게'],koShow:'희미하게, 약하게'},
      {en:'inspect',pos:'v',kw:['look','carefully','examine','check'],kwNeed:1,def:'to examine something very carefully',ko:['자세히 살펴보다','검사하다','점검하다'],koShow:'자세히 살펴보다, 검사하다'},
      {en:'rummage',pos:'v',kw:['search','moving','things','look for'],kwNeed:1,def:'to search for something by moving things around',ko:['뒤지다','샅샅이 찾다','뒤져 찾다'],koShow:'뒤지다, 샅샅이 찾다'},
      {en:'eavesdrop',pos:'v',kw:['listen','secretly','conversation','people'],kwNeed:2,def:'to secretly listen to other people talking',ko:['엿듣다','도청하다'],koShow:'엿듣다'},
      {en:'admiringly',pos:'adv',kw:['respect','approval','admire','praise'],kwNeed:1,def:'in a way that shows respect or approval',ko:['감탄하며','존경스럽게','감탄하여'],koShow:'감탄하며, 존경스럽게'},
      {en:'liverwurst',pos:'n',kw:['sausage','liver','meat','soft'],kwNeed:2,def:'a soft sausage made mainly from liver',ko:['간으로 만든 소시지','리버부어스트'],koShow:'간으로 만든 소시지, 리버부어스트'},
      {en:'sympathetically',pos:'adv',kw:['kind','caring','understanding','problem'],kwNeed:1,def:'in a kind and caring way toward someone’s problem',ko:['동정하며','이해심 있게','공감하며'],koShow:'동정하며, 이해심 있게'},
      {en:'furiously',pos:'adv',kw:['angry','fast','fierce','intense'],kwNeed:1,def:'in a very angry or extremely fast way',ko:['몹시 화나서','맹렬하게','격렬하게'],koShow:'몹시 화나서, 맹렬하게'},
      {en:'forlorn',pos:'adj',kw:['sad','lonely','left alone','abandoned'],kwNeed:2,def:'very sad and lonely because you have been left alone',ko:['외롭고 쓸쓸한','버림받아 슬픈','쓸쓸한'],koShow:'외롭고 쓸쓸한, 버림받아 슬픈'},
      {en:'frantic',pos:'adj',kw:['fear','anxiety','hurry','wild'],kwNeed:1,def:'very worried frightened or hurried',ko:['몹시 불안한','다급한','정신없이 서두르는'],koShow:'몹시 불안한, 다급한'},
      {en:'acquaintance',pos:'n',kw:['person','know','not well','someone'],kwNeed:2,def:'someone you know but not very well',ko:['아는 사람','지인','면식'],koShow:'아는 사람, 지인'},
      {en:'venture',pos:'v',kw:['bravely','dangerous','go','risk'],kwNeed:1,def:'to bravely go somewhere that may be dangerous',ko:['위험을 무릅쓰고 가다','감히 시도하다','모험하다'],koShow:'위험을 무릅쓰고 가다, 감히 시도하다'},
      {en:'gasp',pos:'v',kw:['breath','surprise','shock','suddenly'],kwNeed:1,def:'to suddenly take a quick breath because of surprise or shock',ko:['헉 하고 숨을 들이쉬다','숨을 헐떡이다','숨이 막히다'],koShow:'헉 하고 숨을 들이쉬다, 숨을 헐떡이다'}
    ]
  }
];
