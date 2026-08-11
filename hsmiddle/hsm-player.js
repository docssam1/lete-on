/* 풀이 영상 바로 재생 — 공용 영상 모달 플레이어
   window.HSMIDDLE_PLAYER.open({videoId,start,title,subtitle})
   window.HSMIDDLE_PLAYER.close() */
(function(){
  if(window.HSMIDDLE_PLAYER)return;

  var backEl=null, titleEl=null, subtitleEl=null, videoWrapEl=null, openLinkEl=null;
  var prevOverflow='';

  function injectStyle(){
    if(document.getElementById('hsm-player-style'))return;
    var style=document.createElement('style');
    style.id='hsm-player-style';
    style.textContent=
      '.hsm-player-back{position:fixed;inset:0;z-index:200;background:rgba(10,18,30,.86);'+
      'display:none;align-items:center;justify-content:center;padding:16px}'+
      '.hsm-player-back.hsm-open{display:flex}'+
      '.hsm-player-card{background:#fff;border-radius:14px;width:min(880px,94vw);max-height:92vh;'+
      'overflow:auto;padding:14px;animation:hsm-player-in .18s ease}'+
      '.hsm-player-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin:0 0 10px}'+
      '.hsm-player-title{font:900 16px Pretendard,sans-serif;color:var(--navy,#173a6b)}'+
      '.hsm-player-subtitle{margin-top:3px;font:700 12.5px Pretendard,sans-serif;color:var(--muted,#63768e)}'+
      '.hsm-player-close{flex:0 0 auto;width:32px;height:32px;border-radius:8px;border:1px solid var(--line,#dde5f0);'+
      'background:#fff;color:var(--navy,#173a6b);font:700 14px Pretendard,sans-serif;cursor:pointer}'+
      '.hsm-player-video{position:relative;width:100%;aspect-ratio:16/9;background:#000;border-radius:10px;overflow:hidden}'+
      '.hsm-player-video iframe{position:absolute;inset:0;width:100%;height:100%;border:0;display:block}'+
      '.hsm-player-foot{margin-top:10px;text-align:right}'+
      '.hsm-player-foot a{color:var(--navy,#173a6b);font:800 12.5px Pretendard,sans-serif;text-decoration:none}'+
      '.hsm-player-foot a:hover{text-decoration:underline}'+
      '@keyframes hsm-player-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}'+
      '@media (prefers-reduced-motion: reduce){.hsm-player-card{animation:none}}'+
      '@media print{.hsm-player-back{display:none!important}}';
    document.head.appendChild(style);
  }

  function ensureDom(){
    if(backEl)return;
    injectStyle();
    backEl=document.createElement('div');
    backEl.className='hsm-player-back';
    backEl.innerHTML=
      '<div class="hsm-player-card" role="dialog" aria-modal="true">'+
        '<div class="hsm-player-head">'+
          '<div>'+
            '<div class="hsm-player-title"></div>'+
            '<div class="hsm-player-subtitle"></div>'+
          '</div>'+
          '<button type="button" class="hsm-player-close" aria-label="닫기">✕</button>'+
        '</div>'+
        '<div class="hsm-player-video"></div>'+
        '<div class="hsm-player-foot"><a class="hsm-player-openlink" target="_blank" rel="noopener">유튜브에서 열기</a></div>'+
      '</div>';
    document.body.appendChild(backEl);

    titleEl=backEl.querySelector('.hsm-player-title');
    subtitleEl=backEl.querySelector('.hsm-player-subtitle');
    videoWrapEl=backEl.querySelector('.hsm-player-video');
    openLinkEl=backEl.querySelector('.hsm-player-openlink');

    backEl.addEventListener('click',function(e){
      if(e.target===backEl)close();
    });
    backEl.querySelector('.hsm-player-close').addEventListener('click',close);
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'&&backEl.classList.contains('hsm-open'))close();
    });
  }

  function open(opts){
    opts=opts||{};
    var videoId=opts.videoId;
    if(!videoId)return;
    var start=opts.start||0;
    var title=opts.title||'';
    var subtitle=opts.subtitle||'';

    ensureDom();

    titleEl.textContent=title;
    subtitleEl.textContent=subtitle;
    subtitleEl.style.display=subtitle?'':'none';

    var iframe=document.createElement('iframe');
    iframe.src='https://www.youtube.com/embed/'+videoId+'?start='+start+'&autoplay=1&rel=0&modestbranding=1';
    iframe.setAttribute('allow','autoplay; encrypted-media; picture-in-picture');
    iframe.setAttribute('allowfullscreen','');
    iframe.setAttribute('frameborder','0');
    videoWrapEl.innerHTML='';
    videoWrapEl.appendChild(iframe);

    openLinkEl.href='https://youtu.be/'+videoId+'?t='+start;

    prevOverflow=document.body.style.overflow;
    document.body.style.overflow='hidden';
    backEl.classList.add('hsm-open');
  }

  function close(){
    if(!backEl)return;
    backEl.classList.remove('hsm-open');
    videoWrapEl.innerHTML='';
    document.body.style.overflow=prevOverflow;
  }

  window.HSMIDDLE_PLAYER={open:open,close:close};
})();
