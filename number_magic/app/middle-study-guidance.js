/* Optional middle-school guidance; the host owns navigation and persistence. */
(function(root){
  'use strict';
  let sequence=0;
  const escape=value=>String(value==null?'':value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function model(options){
    const opts=options||{},grade=Number(opts.grade),phase=opts.phase;
    if(![1,2,3].includes(grade)||!['mid','end'].includes(phase))return null;
    const lang=['en','zh'].includes(opts.lang)?opts.lang:'ko';
    const t=(ko,en,zh)=>lang==='en'?en:lang==='zh'?zh:ko;
    const examples={
      1:t('문자식과 방정식에서 배운 계산을 다음 연산 과정과 연결해 봐요.','Connect calculations with expressions and equations to the next arithmetic course.','把代数式和方程中的计算与下一阶段运算连接起来。'),
      2:t('식의 변형과 연립방정식에서 배운 계산을 고등 연산과 연결해 봐요.','Connect calculations with algebraic transformations and simultaneous equations to high-school arithmetic.','把式的变形、联立方程中的计算与高中运算连接起来。'),
      3:t('인수분해에서 이어지는 세제곱의 합·차를 살펴봐요.','Explore sums and differences of cubes as a continuation of factoring.','在因式分解之后，了解立方和与立方差。')
    };
    return {grade,phase,lang,
      label:t('중'+grade+' 연산 · '+(phase==='mid'?'중간 안내':'완료 안내'),'Grade '+(grade+6)+' arithmetic · '+(phase==='mid'?'mid-course guide':'completion guide'),'初'+grade+'运算 · '+(phase==='mid'?'中途提示':'完成提示')),
      title:t('심화 학습도 살펴볼까요?','Would you like to explore deeper study?','要了解进阶学习吗？'),
      core:t('기본 약 2.5개월','Core: about 2.5 months','基础约2.5个月'),
      total:t('심화 선택 시 총 약 4개월','If you choose deeper study: about 4 months total','选择进阶时合计约4个月'),
      extra:t('기본 학습에 약 1.5개월을 더하는 계획이에요.','This plan adds about 1.5 months to core study.','在基础学习上增加约1.5个月。'),
      noChoice:t('지금 선택하지 않아도 기본 학습을 계속할 수 있어요. 기본 과정을 마치면 다음 연산 과정을 안내해요.','You can continue core study without choosing now. After the core course, the next arithmetic course remains available.','现在不选择也能继续基础学习。基础课程完成后，仍可进入下一运算课程。'),
      view:t('심화 내용 보기','View deeper study','查看进阶内容'),
      continue:t(phase==='mid'?'기본 학습 계속':'다음 연산 과정 보기',phase==='mid'?'Continue core study':'View next arithmetic course',phase==='mid'?'继续基础学习':'查看下一运算课程'),
      details:t('연결되는 심화 내용','Connected topics to explore','衔接的进阶内容'),
      example:examples[grade],
      unchanged:t('내용을 살펴보거나 관심을 표시해도 학습 계획과 진도는 바뀌지 않아요.','Viewing topics or expressing interest does not change your study plan or progress.','查看内容或表示兴趣不会更改学习计划或进度。'),
      interested:t('관심 항목으로 표시했어요. 심화 학습 신청이나 계획 변경은 하지 않았어요.','Marked as interested. You have not enrolled in deeper study or changed your plan.','已标记为感兴趣，尚未报名进阶学习或更改计划。'),
      continued:t('기존 연산 학습을 이어가요.','Continue the existing arithmetic plan.','继续现有的运算学习计划。'),
      apply:t(opts.selected?'선택한 심화 계획 보기':'심화 포함 계획 설정',opts.selected?'View selected deeper-study plan':'Set up a plan with deeper study',opts.selected?'查看已选进阶计划':'设置含进阶的计划'),
      selected:t('선택 심화 12묶음이 기본 과정 뒤에 배정돼 있어요.','Twelve optional deeper-study bundles follow the core course.','基础课程后已安排12组可选进阶学习。')
    };
  }
  function mount(host,options){
    if(!host||typeof host.querySelector!=='function')throw new TypeError('guidance_host_required');
    const opts=options||{},data=model(opts);
    if(!data){host.innerHTML='';return null;}
    const id='nmMiddleGuidance'+(++sequence);
    let choice=['interested','continue'].includes(opts.choice)?opts.choice:null;
    host.innerHTML='<section class="nm-card nm-middle-study-guidance" aria-labelledby="'+id+'Title">'+
      '<p class="nm-card-h">'+escape(data.label)+'</p><h3 id="'+id+'Title">'+escape(data.title)+'</h3>'+
      '<p><strong>'+escape(data.core)+'</strong><br><strong>'+escape(data.total)+'</strong><br>'+escape(data.extra)+'</p>'+
      '<p>'+escape(data.noChoice)+'</p><div style="display:flex;flex-wrap:wrap;gap:10px">'+
      '<button type="button" class="nm-btn ghost" data-guidance="interested" aria-expanded="false" aria-controls="'+id+'Details">'+escape(data.view)+'</button>'+
      '<button type="button" class="nm-btn" data-guidance="continue">'+escape(data.continue)+'</button></div>'+
      '<details id="'+id+'Details"><summary>'+escape(data.details)+'</summary><p>'+escape(data.example)+'</p><p>'+escape(data.unchanged)+'</p>'+
      (typeof opts.onApply==='function'?'<button type="button" class="nm-btn full" data-guidance="apply">'+escape(data.apply)+'</button>':'')+'</details>'+
      '<p role="status" aria-live="polite" data-guidance="status"></p></section>';
    const details=host.querySelector('details'),interest=host.querySelector('[data-guidance=interested]'),status=host.querySelector('[data-guidance=status]');
    function announce(){status.textContent=opts.selected?data.selected:choice==='interested'?data.interested:choice==='continue'?data.continued:'';}
    function select(value){choice=value;announce();if(typeof opts.onChoice==='function')opts.onChoice(value);}
    details.ontoggle=()=>interest.setAttribute('aria-expanded',String(details.open));
    interest.onclick=()=>{details.open=true;interest.setAttribute('aria-expanded','true');select('interested');};
    host.querySelector('[data-guidance=continue]').onclick=()=>{select('continue');if(typeof opts.onContinue==='function')opts.onContinue();};
    const apply=host.querySelector('[data-guidance=apply]');if(apply)apply.onclick=()=>opts.onApply();
    details.open=choice==='interested';interest.setAttribute('aria-expanded',String(details.open));
    announce();
    return {getChoice:()=>choice};
  }
  const api={model,mount};root.NM_MIDDLE_STUDY_GUIDANCE=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
