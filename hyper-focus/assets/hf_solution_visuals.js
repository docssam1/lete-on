(()=>{
  const Q01_SOLUTION_IMAGES={
    'sim-card-1-0':'./assets/svg/variations/q01_var01_solution.svg',
    'sim-card-1-1':'./assets/svg/variations/q01_var02_solution.svg'
  };
  let sorting=false;

  function ensureStyle(){
    if(document.getElementById('hf-solution-visual-style'))return;
    const style=document.createElement('style');
    style.id='hf-solution-visual-style';
    style.textContent=`
      .sim-solution-visual{margin:12px 0 10px;border:1px solid #e5dfd4;border-radius:12px;overflow:hidden;background:#fbfaf7}
      .sim-solution-visual img{display:block;width:100%;height:auto}
      .sim-solution-caption{padding:8px 10px;font-size:.78rem;font-weight:800;color:#5b4428;background:#f5eee2;text-align:center}
    `;
    document.head.appendChild(style);
  }

  function attachQ01Solutions(root=document){
    ensureStyle();
    Object.entries(Q01_SOLUTION_IMAGES).forEach(([cardId,src])=>{
      const card=root.getElementById?root.getElementById(cardId):document.getElementById(cardId);
      if(!card)return;
      const answerBox=card.querySelector('.sim-answer-box');
      if(!answerBox||answerBox.querySelector('.sim-solution-visual'))return;
      const wrap=document.createElement('div');
      wrap.className='sim-solution-visual';
      const img=document.createElement('img');
      img.src=src;
      img.alt='위에서 본 평면 모양에 각 자리의 쌓기나무 수를 적은 답안';
      const caption=document.createElement('div');
      caption.className='sim-solution-caption';
      caption.textContent='위에서 본 모양의 각 칸에 쌓인 수를 적어 확인합니다.';
      wrap.append(img,caption);
      const story=answerBox.querySelector('.sim-answer-story');
      answerBox.insertBefore(wrap,story||answerBox.firstChild);
    });
  }

  function cardOrder(card){
    const match=card.id.match(/^sim-card-(\d+)-(\d+)$/);
    return match?[Number(match[1]),Number(match[2])]:[Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER];
  }

  function sortSimilarCards(){
    const container=document.getElementById('similar-list');
    if(!container||sorting)return;
    const cards=Array.from(container.children).filter(el=>el.classList&&el.classList.contains('sim-card'));
    if(cards.length<2)return;
    const sorted=[...cards].sort((a,b)=>{
      const ak=cardOrder(a),bk=cardOrder(b);
      return ak[0]-bk[0]||ak[1]-bk[1];
    });
    if(cards.every((card,index)=>card===sorted[index]))return;
    sorting=true;
    sorted.forEach(card=>container.appendChild(card));
    sorting=false;
  }

  function refresh(){
    if(sorting)return;
    sortSimilarCards();
    attachQ01Solutions();
  }

  function start(){
    refresh();
    const target=document.getElementById('similar-list')||document.body;
    const observer=new MutationObserver(refresh);
    observer.observe(target,{childList:true,subtree:true});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
