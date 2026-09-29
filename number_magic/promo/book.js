(function(){
  'use strict';
  var app=document.querySelector('.magic-book-app');
  var coverScene=document.querySelector('[data-scene="cover"]');
  var readerScene=document.querySelector('[data-scene="reader"]');
  var locationTitle=document.getElementById('locationTitle');
  var video=document.getElementById('introVideo');
  var bookPaper=document.querySelector('.book-paper');
  var cinema=document.getElementById('cinema');
  var videoFinish=document.getElementById('videoFinish');
  var progress=document.getElementById('videoProgress');
  var timeLabel=document.getElementById('videoTime');
  var sheetA=document.getElementById('sheetA');
  var sheetB=document.getElementById('sheetB');
  var sheetSpread=document.getElementById('sheetSpread');
  var sheetCounter=document.getElementById('sheetCounter');
  var sheetPrev=document.getElementById('sheetPrev');
  var sheetNext=document.getElementById('sheetNext');
  var mobileMedia=window.matchMedia('(max-width:700px)');
  var sheetIndex=0;
  var currentView='cover';
  var views={
    cover:{title:'표지'},menu:{title:'차례',heading:'#menu-title'},video:{title:'소개 영상',heading:'#video-title'},
    worksheet:{title:'실제 학습지',heading:'#worksheet-title'},roadmap:{title:'전체 로드맵',heading:'#roadmap-title'}
  };
  var cuts={
    full:{src:'../assets/promo/video/showreel-full.mp4',poster:'../assets/promo/video/poster-full.jpg',title:'2분 10초'},
    short:{src:'../assets/promo/video/showreel-60s.mp4',poster:'../assets/promo/video/poster-60s.jpg',title:'1분'}
  };
  var activeCut='full';

  function sceneState(isCover){
    coverScene.classList.toggle('is-active',isCover);
    coverScene.setAttribute('aria-hidden',String(!isCover));
    readerScene.classList.toggle('is-active',!isCover);
    readerScene.setAttribute('aria-hidden',String(isCover));
    if('inert' in coverScene) coverScene.inert=!isCover;
    if('inert' in readerScene) readerScene.inert=isCover;
  }
  function updatePanels(view){
    document.querySelectorAll('[data-panel]').forEach(function(panel){
      var on=panel.getAttribute('data-panel')===view;
      panel.classList.toggle('is-active',on);
      panel.setAttribute('aria-hidden',String(!on));
      if('inert' in panel) panel.inert=!on;
    });
  }
  function viewFromHash(){var value=location.hash.replace(/^#/,'');return views[value]?value:'cover'}
  function setView(view,opts){
    opts=opts||{};if(!views[view])view='cover';var previous=currentView;currentView=view;app.setAttribute('data-view',view);sceneState(view==='cover');
    if(view!=='cover'){updatePanels(view);locationTitle.textContent=views[view].title}
    if(previous!=='cover'&&view!=='cover'&&previous!==view){bookPaper.classList.remove('is-turning');void bookPaper.offsetWidth;bookPaper.classList.add('is-turning');window.setTimeout(function(){bookPaper.classList.remove('is-turning')},620)}
    if(view!=='video')pauseVideo();if(view==='worksheet')renderSheets();if(view==='roadmap')renderRoadmap();
    if(opts.history!==false){var hash=view==='cover'?'#cover':'#'+view;if(location.hash!==hash)history.pushState({view:view},'',hash)}
    if(opts.focus!==false)window.setTimeout(function(){var target=view==='cover'?document.getElementById('openBook'):document.querySelector(views[view].heading||'');if(target)target.focus({preventScroll:true})},view==='cover'?80:370);
  }
  function formatTime(seconds){if(!isFinite(seconds))return'0:00';var m=Math.floor(seconds/60),s=Math.floor(seconds%60);return m+':'+String(s).padStart(2,'0')}
  function loadCut(key,autoplay){
    if(!cuts[key])return;activeCut=key;var cut=cuts[key];
    document.querySelectorAll('[data-cut]').forEach(function(button){var selected=button.getAttribute('data-cut')===key;button.classList.toggle('is-selected',selected);button.setAttribute('aria-pressed',String(selected))});
    document.getElementById('videoDurationTitle').textContent=cut.title;videoFinish.hidden=true;document.getElementById('cinemaPlay').hidden=false;cinema.classList.remove('is-playing');progress.value=0;timeLabel.textContent='0:00';video.poster=cut.poster;video.src=cut.src;video.load();
    if(autoplay){var promise=video.play();if(promise&&promise.catch)promise.catch(function(){})}
  }
  function playVideo(){if(!video.src)loadCut(activeCut,false);videoFinish.hidden=true;var promise=video.play();if(promise&&promise.catch)promise.catch(function(){})}
  function pauseVideo(){if(video&&!video.paused)video.pause()}
  function toggleVideo(){if(video.paused)playVideo();else pauseVideo()}
  function renderSheets(){
    var step=mobileMedia.matches?1:2,maxIndex=6-step;sheetIndex=Math.max(0,Math.min(sheetIndex,maxIndex));
    sheetA.src='../assets/promo/sample/page-'+(sheetIndex+1)+'.webp';sheetA.alt='수의 마법 실제 학습지 '+(sheetIndex+1)+'쪽';
    var second=Math.min(sheetIndex+2,6);sheetB.src='../assets/promo/sample/page-'+second+'.webp';sheetB.alt='수의 마법 실제 학습지 '+second+'쪽';
    sheetCounter.textContent=mobileMedia.matches?(sheetIndex+1)+' / 6':(sheetIndex+1)+'–'+second+' / 6';sheetPrev.disabled=sheetIndex===0;sheetNext.disabled=sheetIndex>=maxIndex;
  }
  function turnSheets(direction){var step=mobileMedia.matches?1:2,next=sheetIndex+(direction*step);if(next<0||next>6-step)return;sheetSpread.classList.add('is-turning');window.setTimeout(function(){sheetIndex=next;renderSheets();sheetSpread.classList.remove('is-turning')},180)}
  function stageWeeks(stage){var meta=stage.meta&&stage.meta.ko||'',match=meta.match(/주 2회 기준\s*([0-9]+)주/);return match?match[1]+'주':'—'}
  function renderRoadmap(){
    var root=document.getElementById('roadmapRows');if(root.dataset.ready==='1')return;var stages=window.NM_STAGES||[];
    root.innerHTML=stages.map(function(stage,index){var course=stage.courses.from===stage.courses.to?String(stage.courses.from):stage.courses.from+'–'+stage.courses.to;return '<div class="roadmap-row" role="row" data-stage="'+stage.key+'"><span class="roadmap-stage" role="cell"><i style="--stage-color:'+stage.accent+'">'+(index+1)+'</i>'+stage.name.ko+'</span><span class="roadmap-band" role="cell">'+stage.band.ko+'</span><span class="roadmap-course" role="cell">'+course+'</span><span class="roadmap-weeks" role="cell">'+stageWeeks(stage)+'</span></div>'}).join('');root.dataset.ready='1';
  }

  document.getElementById('openBook').addEventListener('click',function(){setView('menu')});
  document.getElementById('bookHome').addEventListener('click',function(){setView('cover')});
  document.getElementById('bookBack').addEventListener('click',function(){setView(currentView==='menu'?'cover':'menu')});
  document.querySelectorAll('[data-route]').forEach(function(control){control.addEventListener('click',function(){var view=control.getAttribute('data-route');setView(view);if(view==='video')loadCut(activeCut,true)})});
  document.querySelectorAll('[data-cut]').forEach(function(button){button.addEventListener('click',function(){loadCut(button.getAttribute('data-cut'),true)})});
  document.getElementById('cinemaPlay').addEventListener('click',toggleVideo);document.getElementById('playToggle').addEventListener('click',toggleVideo);video.addEventListener('click',toggleVideo);
  video.addEventListener('play',function(){cinema.classList.add('is-playing');document.getElementById('cinemaPlay').hidden=true;var toggle=document.getElementById('playToggle');toggle.setAttribute('aria-label','일시정지');if(document.activeElement===document.getElementById('cinemaPlay'))toggle.focus({preventScroll:true})});
  video.addEventListener('pause',function(){cinema.classList.remove('is-playing');if(!video.ended)document.getElementById('cinemaPlay').hidden=false;document.getElementById('playToggle').setAttribute('aria-label','재생')});
  video.addEventListener('timeupdate',function(){var ratio=video.duration?video.currentTime/video.duration:0;progress.value=Math.round(ratio*1000);timeLabel.textContent=formatTime(video.currentTime)});
  video.addEventListener('ended',function(){cinema.classList.remove('is-playing');videoFinish.hidden=false;var next=videoFinish.querySelector('button');if(next)next.focus({preventScroll:true})});
  video.addEventListener('contextmenu',function(event){event.preventDefault()});progress.addEventListener('input',function(){if(video.duration)video.currentTime=(Number(progress.value)/1000)*video.duration});
  document.getElementById('muteToggle').addEventListener('click',function(){video.muted=!video.muted;cinema.classList.toggle('is-muted',video.muted);this.setAttribute('aria-label',video.muted?'소리 켜기':'음소거')});
  sheetPrev.addEventListener('click',function(){turnSheets(-1)});sheetNext.addEventListener('click',function(){turnSheets(1)});if(mobileMedia.addEventListener)mobileMedia.addEventListener('change',renderSheets);
  window.addEventListener('popstate',function(){setView(viewFromHash(),{history:false})});
  window.addEventListener('keydown',function(event){if(event.key==='Escape'&&currentView!=='cover'){event.preventDefault();setView(currentView==='menu'?'cover':'menu')}if(currentView==='worksheet'&&event.key==='ArrowRight')turnSheets(1);if(currentView==='worksheet'&&event.key==='ArrowLeft')turnSheets(-1)});
  loadCut('full',false);renderRoadmap();setView(viewFromHash(),{history:false,focus:false});
})();
