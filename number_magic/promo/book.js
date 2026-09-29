(function(){
  'use strict';
  var app=document.querySelector('.magic-book-app');
  var coverScene=document.querySelector('[data-scene="cover"]');
  var readerScene=document.querySelector('[data-scene="reader"]');
  var openBookButton=document.getElementById('openBook');
  var bookNext=document.getElementById('bookNext');
  var pageTurn=document.querySelector('.page-turn');
  var locationTitle=document.getElementById('locationTitle');
  var video=document.getElementById('introVideo');
  var videoHeading=document.getElementById('videoHeading');
  var cinemaControls=document.getElementById('cinemaControls');
  var journeyEnter=document.getElementById('journeyEnter');
  var journeySound=document.getElementById('journeySound');
  var cinemaPlay=document.getElementById('cinemaPlay');
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
  var reduceMotion=window.matchMedia('(prefers-reduced-motion:reduce)');
  var sheetIndex=0;
  var currentView='cover';
  var filmMode='journey';
  var lastIntroView='menu';
  var opening=false;
  var turning=false;
  var historyDepth=0;
  var views={
    cover:{title:'표지'},
    menu:{title:'차례',heading:'#menu-title',panel:'menu'},
    video:{title:'소개 영상',heading:'#video-title',panel:'menu'},
    story1:{title:'수의 마법 이야기 · 1',heading:'#story1-title'},
    story2:{title:'수의 마법 이야기 · 2',heading:'#story2-title'},
    story3:{title:'수의 마법 이야기 · 3',heading:'#story3-title'},
    labs:{title:'수학 실험실',heading:'#labs-title'},
    worksheet:{title:'실제 학습지',heading:'#worksheet-title'},
    roadmap:{title:'전체 로드맵',heading:'#roadmap-title'}
  };
  var pageOrder=['menu','story1','story2','story3','labs','worksheet','roadmap'];
  var journey={
    src:'../assets/promo/video/showreel-15s-vertical.mp4',
    poster:'../assets/promo/video/poster-15s-vertical.jpg'
  };
  var cuts={
    full:{src:'../assets/promo/video/showreel-full.mp4',poster:'../assets/promo/video/poster-full.jpg',title:'2분 10초'},
    short:{src:'../assets/promo/video/showreel-60s.mp4',poster:'../assets/promo/video/poster-60s.jpg',title:'1분'}
  };
  var activeCut='full';

  function panelFor(view){return views[view]&&(views[view].panel||view)}
  function sceneState(isCover){
    coverScene.classList.toggle('is-active',isCover);
    coverScene.setAttribute('aria-hidden',String(!isCover));
    readerScene.classList.toggle('is-active',!isCover);
    readerScene.setAttribute('aria-hidden',String(isCover));
    if('inert' in coverScene)coverScene.inert=!isCover;
    if('inert' in readerScene)readerScene.inert=isCover;
  }
  function updatePanels(view){
    var activePanel=panelFor(view);
    document.querySelectorAll('[data-panel]').forEach(function(panel){
      var on=panel.getAttribute('data-panel')===activePanel;
      panel.classList.toggle('is-active',on);
      panel.setAttribute('aria-hidden',String(!on));
      if(on&&activePanel==='menu')panel.setAttribute('aria-labelledby',view==='video'?'video-title':'menu-title');
      if('inert' in panel)panel.inert=!on;
    });
  }
  function routePage(view){return view==='video'?'menu':view}
  function nextView(view){var index=pageOrder.indexOf(routePage(view));return index>=0&&index<pageOrder.length-1?pageOrder[index+1]:''}
  function previousView(view){var index=pageOrder.indexOf(routePage(view));return index>0?pageOrder[index-1]:'cover'}
  function updateEdgeNavigation(){
    var next=nextView(currentView);
    bookNext.hidden=!next;
    bookNext.disabled=turning;
    if(next)bookNext.setAttribute('aria-label','다음 페이지: '+views[next].title);
  }
  function cleanSnapshot(panel){
    var clone=panel.cloneNode(true);clone.classList.add('is-active');clone.removeAttribute('aria-hidden');
    clone.querySelectorAll('[id]').forEach(function(node){node.removeAttribute('id')});
    clone.querySelectorAll('video').forEach(function(node){var img=document.createElement('img');img.src=node.getAttribute('poster')||journey.poster;img.alt='';img.style.cssText='width:100%;height:100%;object-fit:contain;background:#020507';node.replaceWith(img)});
    clone.querySelectorAll('iframe').forEach(function(node){var box=document.createElement('div');box.className='lab-snapshot';box.textContent='수학 실험실';node.replaceWith(box)});
    clone.querySelectorAll('button,a,input').forEach(function(node){node.setAttribute('tabindex','-1')});return clone;
  }
  function animatePageTurn(fromView,toView,onMiddle,onDone){
    if(reduceMotion.matches){onMiddle();onDone();return}
    var fromPanel=document.querySelector('[data-panel="'+panelFor(fromView)+'"]');
    var toPanel=document.querySelector('[data-panel="'+panelFor(toView)+'"]');
    if(!fromPanel||!toPanel||fromPanel===toPanel){onMiddle();onDone();return}
    turning=true;bookPaper.classList.add('is-turning');updateEdgeNavigation();
    pageTurn.innerHTML='<div class="turning-leaf is-forward"><div class="leaf-face leaf-face-front"><div class="leaf-snapshot"></div></div><div class="leaf-face leaf-face-back"><div class="leaf-snapshot"></div></div></div>';
    pageTurn.querySelector('.leaf-face-front .leaf-snapshot').appendChild(cleanSnapshot(fromPanel));
    pageTurn.querySelector('.leaf-face-back .leaf-snapshot').appendChild(cleanSnapshot(toPanel));
    pageTurn.classList.add('is-ready');
    window.setTimeout(onMiddle,430);
    window.setTimeout(function(){pageTurn.classList.remove('is-ready');pageTurn.innerHTML='';bookPaper.classList.remove('is-turning');turning=false;updateEdgeNavigation();onDone()},940);
  }
  function viewFromHash(){var value=location.hash.replace(/^#/,'');return views[value]?value:'cover'}
  function setView(view,opts){
    opts=opts||{};if(!views[view])view='cover';var previous=currentView;var previousPanel=panelFor(previous);var nextPanel=panelFor(view);
    var shouldTurn=previous!=='cover'&&view!=='cover'&&previous!==view&&previousPanel!==nextPanel&&opts.turn!==false;
    currentView=view;app.setAttribute('data-view',view);sceneState(view==='cover');
    if(view!=='cover')locationTitle.textContent=views[view].title;
    if(view!=='menu'&&view!=='video')pauseVideo();
    if(view==='worksheet')renderSheets();if(view==='roadmap')renderRoadmap();
    var reveal=function(){if(view!=='cover')updatePanels(view)};
    var focus=function(){if(opts.focus!==false){var target=view==='cover'?openBookButton:document.querySelector(views[view].heading||'');if(target)target.focus({preventScroll:true})}};
    if(shouldTurn)animatePageTurn(previous,view,reveal,focus);else{reveal();focus()}
    if(opts.history!==false){
      var hash=view==='cover'?'#cover':'#'+view;
      if(opts.history==='replace')history.replaceState({nmBook:true,view:view,depth:historyDepth},'',hash);
      else if(location.hash!==hash){historyDepth+=1;history.pushState({nmBook:true,view:view,depth:historyDepth},'',hash)}
    }
    updateEdgeNavigation();
  }
  function formatTime(seconds){if(!isFinite(seconds))return'0:00';var m=Math.floor(seconds/60),s=Math.floor(seconds%60);return m+':'+String(s).padStart(2,'0')}
  function syncMuteUI(){
    cinema.classList.toggle('is-muted',video.muted);journeySound.classList.toggle('is-muted',video.muted);
    journeySound.setAttribute('aria-label',video.muted?'배경음 켜기':'배경음 끄기');
    document.getElementById('muteToggle').setAttribute('aria-label',video.muted?'소리 켜기':'음소거');
  }
  function setSource(src,poster){video.poster=poster;if(video.getAttribute('src')!==src){video.src=src;video.load()}}
  function tryPlay(){var promise=video.play();if(promise&&promise.catch)promise.catch(function(){cinemaPlay.hidden=false})}
  function showJourney(autoplay,restart){
    filmMode='journey';lastIntroView='menu';cinema.classList.add('is-journey');cinema.classList.remove('is-showreel');
    videoHeading.hidden=true;cinemaControls.hidden=true;journeyEnter.hidden=false;journeySound.hidden=false;videoFinish.hidden=true;cinemaPlay.hidden=false;
    video.loop=true;video.volume=.72;video.setAttribute('aria-label','수의 마법 15초 미리보기 영상');setSource(journey.src,journey.poster);syncMuteUI();
    if(restart){try{video.currentTime=0}catch(error){}}
    if(autoplay&&!reduceMotion.matches)tryPlay();
  }
  function prepareShowreel(){
    filmMode='showreel';lastIntroView='video';cinema.classList.remove('is-journey');cinema.classList.add('is-showreel');
    videoHeading.hidden=false;cinemaControls.hidden=false;journeyEnter.hidden=true;journeySound.hidden=true;videoFinish.hidden=true;cinemaPlay.hidden=false;video.loop=false;video.volume=1;
  }
  function loadCut(key,autoplay){
    if(!cuts[key])return;activeCut=key;var cut=cuts[key];prepareShowreel();
    document.querySelectorAll('[data-cut]').forEach(function(button){var selected=button.getAttribute('data-cut')===key;button.classList.toggle('is-selected',selected);button.setAttribute('aria-pressed',String(selected))});
    cinema.classList.remove('is-playing');progress.value=0;timeLabel.textContent='0:00';video.setAttribute('aria-label',cut.title+' 수의 마법 소개 영상');setSource(cut.src,cut.poster);syncMuteUI();
    if(autoplay)tryPlay();
  }
  function enterShowreel(autoplay){loadCut(activeCut,autoplay);setView('video',{turn:false,focus:false});window.setTimeout(function(){document.getElementById('video-title').focus({preventScroll:true})},reduceMotion.matches?0:220)}
  function playVideo(){videoFinish.hidden=true;tryPlay()}
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
  function shortLearn(stage){var text=stage.learn&&stage.learn.ko||'';return text.length>72?text.slice(0,72)+'…':text}
  function renderRoadmap(){
    var root=document.getElementById('roadmapRows');if(root.dataset.ready==='1')return;var stages=window.NM_STAGES||[],specs=window.NM_COURSE_SPEC||[];
    root.innerHTML=stages.map(function(stage,index){var course=stage.courses.from===stage.courses.to?String(stage.courses.from):stage.courses.from+'–'+stage.courses.to;return '<article class="roadmap-stage-card" data-stage="'+stage.key+'"><i style="--stage-color:'+stage.accent+'">'+(index+1)+'</i><b>'+stage.name.ko+'</b><em>과정 '+course+' · '+stageWeeks(stage)+'</em><p>'+stage.band.ko+' · '+shortLearn(stage)+'</p></article>'}).join('');
    var courseRoot=document.getElementById('courseRows'),lastStage='';
    courseRoot.innerHTML=specs.map(function(spec){var stage=window.NM_STAGE_OF_COURSE?window.NM_STAGE_OF_COURSE(spec.id):null,group='';if(stage&&stage.key!==lastStage){lastStage=stage.key;group='<div class="course-group">'+stage.name.ko+' · '+stage.band.ko+'</div>'}var sessions=spec.minSessions?spec.minSessions+'회':'편성';return group+'<article class="course-row"><strong>'+String(spec.id).padStart(2,'0')+'</strong><b>'+spec.title.ko+'</b><span>'+sessions+'</span></article>'}).join('');
    root.dataset.ready='1';
  }
  function openMagicBook(){
    if(opening)return;opening=true;coverScene.classList.add('is-opening');openBookButton.classList.add('is-opening');showJourney(!reduceMotion.matches,true);
    window.setTimeout(function(){setView('menu');coverScene.classList.remove('is-opening');openBookButton.classList.remove('is-opening');opening=false},reduceMotion.matches?0:540);
  }
  function nextBookPage(){if(turning)return;var next=nextView(currentView);if(next)setView(next)}
  function previousBookPage(){
    if(turning)return;
    if(historyDepth>0){if(currentView==='video')showJourney(true,false);history.back();return}
    if(currentView==='menu'){setView('cover',{history:'replace'});return}
    if(currentView==='video'){showJourney(true,false);setView('menu',{turn:false,history:'replace'});return}
    var previous=previousView(currentView);if(previous==='menu')showJourney(true,false);setView(previous,{history:'replace'});
  }

  openBookButton.addEventListener('click',openMagicBook);
  document.getElementById('bookHome').addEventListener('click',function(){pauseVideo();setView('cover')});
  document.getElementById('bookBack').addEventListener('click',previousBookPage);
  bookNext.addEventListener('click',nextBookPage);
  document.querySelectorAll('[data-route]').forEach(function(control){control.addEventListener('click',function(){var view=control.getAttribute('data-route');if(view==='video')enterShowreel(true);else setView(view)})});
  document.querySelectorAll('[data-cut]').forEach(function(button){button.addEventListener('click',function(){loadCut(button.getAttribute('data-cut'),true)})});
  document.querySelectorAll('[data-lab]').forEach(function(button){button.addEventListener('click',function(){
    var key=button.getAttribute('data-lab'),frame=document.getElementById('labFrame'),sources={calculus:{src:'../labs/why-calculus.html',title:'미적분은 왜 태어났나 체험 실험실'},secret1001:{src:'../labs/secret-1001.html',title:'1001의 비밀 체험 실험실'}};
    document.querySelectorAll('[data-lab]').forEach(function(choice){var selected=choice===button;choice.classList.toggle('is-selected',selected);choice.setAttribute('aria-selected',String(selected))});
    frame.title=sources[key].title;if(frame.getAttribute('src')!==sources[key].src){document.getElementById('labLoading').hidden=false;frame.src=sources[key].src}
  })});
  document.getElementById('labFrame').addEventListener('load',function(){document.getElementById('labLoading').hidden=true});
  cinemaPlay.addEventListener('click',toggleVideo);document.getElementById('playToggle').addEventListener('click',toggleVideo);video.addEventListener('click',toggleVideo);
  video.addEventListener('play',function(){
    cinema.classList.add('is-playing');cinemaPlay.setAttribute('aria-label','영상 일시정지');var toggle=document.getElementById('playToggle');toggle.setAttribute('aria-label','일시정지');
    if(filmMode==='showreel'){cinemaPlay.hidden=true;if(document.activeElement===cinemaPlay)toggle.focus({preventScroll:true})}else cinemaPlay.hidden=false;
  });
  video.addEventListener('pause',function(){cinema.classList.remove('is-playing');if(!video.ended)cinemaPlay.hidden=false;cinemaPlay.setAttribute('aria-label','영상 재생');document.getElementById('playToggle').setAttribute('aria-label','재생')});
  video.addEventListener('timeupdate',function(){var ratio=video.duration?video.currentTime/video.duration:0;progress.value=Math.round(ratio*1000);timeLabel.textContent=formatTime(video.currentTime)});
  video.addEventListener('ended',function(){if(filmMode!=='showreel')return;cinema.classList.remove('is-playing');videoFinish.hidden=false;var next=videoFinish.querySelector('button');if(next)next.focus({preventScroll:true})});
  video.addEventListener('contextmenu',function(event){event.preventDefault()});progress.addEventListener('input',function(){if(video.duration)video.currentTime=(Number(progress.value)/1000)*video.duration});
  journeySound.addEventListener('click',function(){video.muted=!video.muted;syncMuteUI();if(video.paused)tryPlay()});
  document.getElementById('muteToggle').addEventListener('click',function(){video.muted=!video.muted;syncMuteUI()});
  sheetPrev.addEventListener('click',function(){turnSheets(-1)});sheetNext.addEventListener('click',function(){turnSheets(1)});if(mobileMedia.addEventListener)mobileMedia.addEventListener('change',renderSheets);
  window.addEventListener('popstate',function(event){var view=viewFromHash();historyDepth=event.state&&event.state.nmBook?Number(event.state.depth)||0:0;if(view==='menu')showJourney(false,false);if(view==='video')loadCut(activeCut,false);setView(view,{history:false})});
  window.addEventListener('keydown',function(event){
    if(event.key==='Escape'&&currentView!=='cover'){event.preventDefault();previousBookPage();return}
    if(currentView==='worksheet'&&event.key==='ArrowRight'){turnSheets(1);return}
    if(currentView==='worksheet'&&event.key==='ArrowLeft'){turnSheets(-1);return}
    if(event.key==='PageDown'&&document.activeElement.tagName!=='INPUT'){event.preventDefault();nextBookPage()}
    if(event.key==='PageUp'&&document.activeElement.tagName!=='INPUT'){event.preventDefault();previousBookPage()}
  });

  var initialView=viewFromHash();
  history.replaceState({nmBook:true,view:initialView,depth:0},'',initialView==='cover'?'#cover':'#'+initialView);
  if(initialView==='video')loadCut('full',false);else showJourney(false,false);
  renderRoadmap();setView(initialView,{history:false,focus:false});
})();
