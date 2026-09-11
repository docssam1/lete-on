(function(root){
  'use strict';
  const VIDEOS=Object.freeze({
    '1':Object.freeze({title:'소마 챌린지 대비 개념 1',url:'https://youtu.be/7KvLEzuKfhk'}),
    '2':Object.freeze({title:'챌린지 대비 개념 2회',url:'https://youtu.be/E8I6OpqlBJs'})
  });
  const access=root.HFChallengeAccess;
  const round=document.getElementById('round');
  const requested=new URLSearchParams(root.location.search).get('round');
  if([...round.options].some(option=>option.value===requested))round.value=requested;
  const panel=document.getElementById('conceptVideoPanel');
  const frame=document.getElementById('conceptVideoFrame');
  const title=document.getElementById('conceptVideoTitle');
  const link=document.getElementById('conceptVideoLink');
  const watermark=document.getElementById('conceptVideoWatermark');

  function youtubeEmbed(value){
    try{
      const url=new URL(value),id=url.hostname==='youtu.be'?url.pathname.slice(1):url.searchParams.get('v')||'';
      return /^[A-Za-z0-9_-]{11}$/.test(id)?`https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`:'';
    }catch(_){return '';}
  }

  function paintWatermark(){
    const identity=access.approvedStudentName()||'교사용 미리보기';
    watermark.replaceChildren();
    for(let index=0;index<3;index+=1){
      const mark=document.createElement('span');
      mark.textContent=`${identity} 학생 · GFIELD`;
      watermark.appendChild(mark);
    }
  }

  function sync(){
    const video=VIDEOS[round.value];
    const allowed=Boolean(video&&access.allow(`challenge-concept-${round.value}`));
    panel.hidden=!allowed;
    link.hidden=!allowed;
    document.body.classList.toggle('has-concept-video',allowed);
    if(!allowed){frame.removeAttribute('src');return;}
    const source=youtubeEmbed(video.url);
    title.textContent=video.title;
    frame.title=`${video.title} 학습 영상`;
    link.href=video.url;
    if(frame.src!==source)frame.src=source;
    paintWatermark();
  }

  round.addEventListener('change',sync);
  root.addEventListener('hfchallengeaccesschange',sync);
  sync();
})(window);
