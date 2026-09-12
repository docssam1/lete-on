(function(root){
  'use strict';
  const ROUND_CONTENT=Object.freeze({
    '1':Object.freeze({
      corrections:Object.freeze([
        '11번: 정답은 5가지입니다. 영상의 ‘6가지’ 표기는 오류입니다.',
        '15번: 가장 큰 수의 합은 53, 가장 작은 수의 합은 39입니다. 따라서 차는 53-39=14입니다.'
      ])
    }),
    '2':Object.freeze({
      title:'챌린지 대비 모의고사 2회',
      url:'https://youtu.be/_QHKH2ctLWE'
    })
  });
  const access=root.HFChallengeAccess;
  const round=document.getElementById('round');
  const requested=new URLSearchParams(root.location.search).get('round');
  if([...round.options].some(option=>option.value===requested))round.value=requested;
  const panel=document.getElementById('mockVideoPanel');
  const videoHeader=document.getElementById('mockVideoHeader');
  const frameShell=document.getElementById('mockVideoFrameShell');
  const frame=document.getElementById('mockVideoFrame');
  const title=document.getElementById('mockVideoTitle');
  const link=document.getElementById('mockVideoLink');
  const watermark=document.getElementById('mockVideoWatermark');
  const corrections=document.getElementById('mockVideoCorrections');
  const correctionList=document.getElementById('mockVideoCorrectionList');

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

  function paintCorrections(content){
    correctionList.replaceChildren();
    const notes=content.corrections||[];
    corrections.hidden=!notes.length;
    notes.forEach(note=>{
      const item=document.createElement('li');
      item.textContent=note;
      correctionList.appendChild(item);
    });
  }

  function sync(){
    const content=ROUND_CONTENT[round.value];
    const allowed=Boolean(content&&access.allow(`challenge-mock-${round.value}`));
    const hasVideo=Boolean(allowed&&content.url);
    panel.hidden=!allowed;
    videoHeader.hidden=!hasVideo;
    frameShell.hidden=!hasVideo;
    link.hidden=!hasVideo;
    document.body.classList.toggle('has-mock-video',allowed);
    if(!allowed){
      frame.removeAttribute('src');
      link.removeAttribute('href');
      watermark.replaceChildren();
      corrections.hidden=true;
      correctionList.replaceChildren();
      return;
    }
    if(hasVideo){
      const source=youtubeEmbed(content.url);
      title.textContent=content.title;
      frame.title=`${content.title} 학습 영상`;
      link.href=content.url;
      if(frame.src!==source)frame.src=source;
      paintWatermark();
    }else{
      frame.removeAttribute('src');
      link.removeAttribute('href');
      watermark.replaceChildren();
    }
    paintCorrections(content);
  }

  round.addEventListener('change',sync);
  root.addEventListener('hfchallengeaccesschange',sync);
  sync();
})(window);
