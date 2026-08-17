(()=>{
  const SOLUTION_IMAGES={
    'sim-card-1-0':{src:'./assets/svg/variations/q01_var01_solution.svg?v=20260818b',caption:'위에서 본 모양의 각 칸에 쌓인 수를 적어 확인합니다.'},
    'sim-card-1-1':{src:'./assets/svg/variations/q01_var02_solution.svg?v=20260818b',caption:'위에서 본 모양의 각 칸에 쌓인 수를 적어 확인합니다.'},
    'sim-card-2-0':{src:'./assets/svg/variations/q02_var01_solution.svg?v=20260818a',caption:'위에서 본 3×3 칸에 현재 쌓인 수를 적어 먼저 현재 개수를 셉니다.'},
    'sim-card-2-1':{src:'./assets/svg/variations/q02_var02_solution.svg?v=20260818a',caption:'위에서 본 3×3 칸에 현재 쌓인 수를 적어 먼저 현재 개수를 셉니다.'}
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

  function attachSolutions(root=document){
    ensureStyle();
    Object.entries(SOLUTION_IMAGES).forEach(([cardId,info])=>{
      const card=root.getElementById?root.getElementById(cardId):document.getElementById(cardId);
      if(!card)return;
      const answerBox=card.querySelector('.sim-answer-box');
      if(!answerBox)return;
      const old=answerBox.querySelector('.sim-solution-visual');
      if(old&&old.dataset.solutionSrc===info.src)return;
      if(old)old.remove();
      const wrap=document.createElement('div');
      wrap.className='sim-solution-visual';
      wrap.dataset.solutionSrc=info.src;
      const img=document.createElement('img');
      img.src=info.src;
      img.alt='위에서 본 평면 모양에 각 자리의 쌓기나무 수를 적은 답안';
      const caption=document.createElement('div');
      caption.className='sim-solution-caption';
      caption.textContent=info.caption;
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
    attachSolutions();
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
