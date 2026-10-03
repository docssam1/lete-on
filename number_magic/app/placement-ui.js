/* Fixed 20-question diagnosis. Teaching widgets deliberately are not used here:
 * they may display counts, give feedback, or only submit a correct completion. */
(function () {
  'use strict';
  const VERSION = 'mixed-20-v1';
  const escape = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const tr = (lang, ko, en, zh) => lang === 'en' ? en : lang === 'zh' ? zh : ko;
  function label(value, lang) {
    if (value && typeof value === 'object') return label(value[lang] || value.ko || value.en || '', lang);
    return String(value == null ? '' : value);
  }
  function initial() {
    return { version: VERSION, phase: 'setup', selection: { route: 'book', age: '', grade: '', series: '', step: '', progress: '', baselineId: '', goal: 'curriculum', goalTarget: '', cadence: 'w2' },
      seed: Date.now().toString(36), plan: null, index: 0, responses: [], result: null };
  }
  function parseNumber(raw) {
    const s = String(raw).trim().replace(/[−﹣－]/g, '-').replace(/[０-９]/g, c => String(c.charCodeAt(0) - 0xff10)).replace(/．/g, '.');
    if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(s)) return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }
  function readValues(raw) {
    const values = raw.map(parseNumber);
    return values.some(x => x === null) ? null : values.length === 1 ? values[0] : values;
  }
  function art(symbol) {
    if(typeof symbol==='string'&&symbol.startsWith('animal:')&&window.NM_ANIMALS&&window.NM_ANIMALS.kinds.includes(symbol.slice(7))){
      return '<span class="pd-art" aria-hidden="true">'+window.NM_ANIMALS.svg(symbol.slice(7))+'</span>';
    }
    return escape(symbol);
  }
  function render(ctx) {
    const { root, state: d, lang } = ctx;
    const paths = window.NM_PLACEMENT_PATHS;
    if (paths) Object.assign(d.selection, paths.normalize(d.selection));
    const t = (ko, en, zh) => tr(lang, ko, en, zh);
    const l = value => label(value, lang);
    const $ = selector => root.querySelector(selector);
    const all = selector => Array.from(root.querySelectorAll(selector));
    const redraw = () => { ctx.save(); render(ctx); };
    const summarize = () => {
      const result = window.NM_PLACEMENT_PLAN.summarize(d.plan, d.responses);
      if (paths) result.pathRecommendation = paths.recommend(d.plan, result, d.selection);
      return result;
    };
    const option = (value, text, selected) => `<option value="${escape(value)}"${value === selected ? ' selected' : ''}>${escape(text)}</option>`;
    const shell = (title, body, phase) => {
      const viewKey = phase === 'question' ? `${phase}:${d.index}` : phase;
      const previousView = $('.nm-placement');
      const changedView = !previousView || previousView.dataset.pdView !== viewKey;
      root.innerHTML = `<div class="nm-unit-bar"><button class="nm-back" id="pdBack">${t('돌아가기','Back','返回')}</button><div class="nm-unit-title">${escape(title)}</div></div>
        <main data-pd-view="${viewKey}" class="nm-placement ${d.selection.age && /^pre/.test(d.selection.age) ? 'nm-placement-young' : ''}">
        <nav class="pd-flow" aria-label="${t('진단 순서','Assessment steps','测评步骤')}"><span${phase === 'setup' ? ' aria-current="step"' : ''}>01 ${t('기준 고르기','Starting point','选择起点')}</span><span${phase === 'question' ? ' aria-current="step"' : ''}>02 ${t('20문항 확인','20 questions','20道题')}</span><span${phase === 'result' ? ' aria-current="step"' : ''}>03 ${t('학습 제안','Learning suggestion','学习建议')}</span></nav>${body}</main>`;
      $('#pdBack').onclick = ctx.close;
      if (ctx.renderMath) ctx.renderMath(root);
      // Each new question/result starts at its prompt, not at the previous answer.
      // Keep the position when only a setup selection redraws the same view.
      if (changedView) root.scrollTop = 0;
    };
    const stageLabel = stage => `${stage.kind === 'foundation' ? t('유아 기초','Early foundations','幼儿基础') : t('과정','Course','课程') + ' ' + stage.course.slice(1)} · ${l(stage.label)}`;
    function setup() {
      const s = d.selection, books = window.NM_PLACEMENT_BOOKS, core = window.NM_PLACEMENT_PLAN;
      if (!core || !books || !paths) { shell(t('진단 자료 확인','Assessment data','测评资料'), `<p role="alert">${t('진단 자료를 불러오지 못했습니다. 새로고침 후 다시 시작해 주세요.','Assessment data could not be loaded. Reload to try again.','未能加载测评资料，请刷新后重试。')}</p>`, 'setup'); return; }
      let stages;
      try { stages = core.stages(); } catch (_) { shell(t('진단 자료 확인','Assessment data','测评资料'), `<p role="alert">${t('과정 자료가 아직 준비되지 않았습니다.','Course data is not ready.','课程资料尚未准备好。')}</p>`, 'setup'); return; }
      const steps = s.series ? books.getSteps(s.series) : [];
      const resolved = s.series && s.step && s.progress ? books.resolve(s.series, s.step, s.progress) : null;
      const mapped = s.route === 'book' && resolved && !resolved.needsTopicConfirmation && stages.some(x => x.id === resolved.baselineId);
      const baselineId = mapped ? resolved.baselineId : s.baselineId;
      const baseline = stages.find(x => x.id === baselineId);
      const ages = [['','선택하지 않음','Not selected','暂不选'],['pre4','4세','Age 4','4岁'],['pre5','5세','Age 5','5岁'],['pre6','6세','Age 6','6岁'],['pre7','7세','Age 7','7岁'],['school','초등 이상','School age','小学及以上']];
      const grades = [['','학년 선택','Select grade','选择年级'],['pre','유아','Preschool','幼儿'],...Array.from({length:6},(_,i)=>['e'+(i+1),'초'+(i+1),'Grade '+(i+1),'小学'+(i+1)+'年级']),...Array.from({length:3},(_,i)=>['m'+(i+1),'중'+(i+1),'Grade '+(i+7),'初中'+(i+1)+'年级']),['high','고등','High school','高中']];
      shell(t('지금 배운 곳에서 시작해요','Start from what you have learned','从已学内容开始'), `<header class="pd-header"><p class="pd-kicker">NUMBERS OF MAGIC · ${t('학습 시작점 찾기','Find your starting point','找到学习起点')}</p><h1>${t('지금 배운 곳을<br>함께 확인해요.','Let’s check<br>what you have learned.','一起看看<br>已经学了什么。')}</h1><p>${t('나이만으로 난도를 정하지 않습니다. 실제로 배운 내용에서 20문항을 구성합니다.','Age alone does not set difficulty. The 20 questions are based on what you have learned.','不只按年龄定难度，依据实际已学内容安排20道题。')}</p></header>
        <section class="pd-goal-selection" aria-labelledby="pdGoalHeading"><h2 id="pdGoalHeading">${t('어떤 학습을 준비하나요?','What are you preparing for?','准备哪种学习？')}</h2><label>${t('학습 목표','Learning goal','学习目标')}<select id="pdGoal">${paths.goals.map(x=>option(x.id,l(x.label),s.goal)).join('')}</select></label>
        ${s.goal==='competition'?`<label>${t('목표 진도','Progress goal','目标进度')}<select id="pdGoalTarget">${option('',t('아직 정하지 않았어요','Not decided yet','尚未确定'),s.goalTarget)}${paths.targets.map(x=>option(x.id,l(x.label),s.goalTarget)).join('')}</select></label><p class="pd-note">${t('목표별 정확한 도달 시점은 자료 대조가 필요합니다. 이번 진단으로 입학 준비도를 판정하지 않습니다.','Exact target timing needs source verification. This check does not assess admission readiness.','准确的目标达成时间需要资料核对。本测评不判断入学准备度。')}</p>`:''}
        <label class="pd-cadence">${t('학습 횟수','Study frequency','学习次数')}<select id="pdCadence">${[['w2','주 2회','Twice a week','每周两次'],['w1','주 1회','Once a week','每周一次']].map(x=>option(x[0],t(x[1],x[2],x[3]),s.cadence)).join('')}</select></label><p class="pd-note">${t('목표에 따라 학습 방향을 안내합니다. 진단 문항·채점 기준은 동일합니다.','The goal guides study planning, not the diagnostic questions or scoring.','目标影响学习建议，不改变测评题目或评分标准。')}</p></section>
        <div class="pd-context"><label>${t('연령 · 참고 정보','Age · context only','年龄 · 参考信息')}<select id="pdAge">${ages.map(x=>option(x[0],t(x[1],x[2],x[3]),s.age)).join('')}</select></label></div>
        <div class="pd-routes" role="group" aria-label="${t('기준 선택 방법','How to choose a starting point','起点选择方式')}">${[['book','교재 진도','Book progress','教材进度'],['school','교과 진도','School topics','学校课程进度'],['topic','배운 내용','Learned skills','已学内容']].map(x=>`<button type="button" data-route="${x[0]}" aria-pressed="${s.route===x[0]}">${t(x[1],x[2],x[3])}</button>`).join('')}</div>
        <section class="pd-selection" aria-label="${t('실제 학습 진도','Actual learning progress','实际学习进度')}">
        ${s.route === 'book' ? `<div class="pd-fields"><label>${t('공부한 교재','Studied book series','学过的教材')}<select id="pdSeries">${option('',t('교재 선택','Select series','选择教材'),s.series)}${books.series.map(x=>option(x.id,l(x.label),s.series)).join('')}</select></label><label>${t('권 · 단계 · 단원','Volume, stage or unit','册、阶段或单元')}<select id="pdStep"${s.series ? '' : ' disabled'}>${option('',t('실제로 공부한 범위 선택','Select studied range','选择实际学过的范围'),s.step)}${steps.map(x=>option(x.id,l(x.label),s.step)).join('')}</select></label><label>${t('진행 정도','Progress','学习进度')}<select id="pdProgress">${option('',t('진행 정도 선택','Select progress','选择进度'),s.progress)}${[['start','막 시작','Just started','刚开始'],['middle','진행 중','In progress','学习中'],['complete','해당 범위 완료','Range completed','已学完该范围']].map(x=>option(x[0],t(x[1],x[2],x[3]),s.progress)).join('')}</select></label></div><p class="pd-note">${mapped ? t('공식 단원 범위를 바탕으로 기준 후보를 연결했습니다. 이수가 실력 확인을 대신하지는 않습니다.','The official unit scope gives a starting-point candidate, not proof of mastery.','依据官方单元范围给出起点候选，不代表已经掌握。') : t('교재의 판본·권별 범위가 다릅니다. 아래에서 실제로 배운 내용을 확인해 주세요.','Editions and volumes differ. Confirm the actual learned topic below.','版本和各册范围不同，请在下方确认实际已学内容。')}</p>` : ''}
        ${s.route === 'school' ? `<label>${t('현재 학년','Current school grade','目前年级')}<select id="pdGrade">${grades.map(x=>option(x[0],t(x[1],x[2],x[3]),s.grade)).join('')}</select></label><p class="pd-note">${t('같은 학년이라도 진도가 다릅니다. 현재 학교에서 배우는 연산 단원을 아래에서 골라 주세요. 학년 자체로 시험을 배정하지 않습니다.','Within a grade, progress differs. Choose the arithmetic topic you are learning, rather than placing by grade alone.','同年级学习进度也不同。请选择目前学习的运算内容，不仅按年级分配试题。')}</p>` : ''}
        <label class="pd-topic">${mapped ? t('연결된 우리 기준 · 필요하면 수정','Suggested starting point · you can change it','建议起点 · 可以修改') : t('실제로 배운 내용 · 현재 단원','Learned topic · current unit','实际已学内容 · 当前单元')}<select id="pdBaseline">${option('',t('확인할 내용을 선택해 주세요','Choose a topic to check','请选择要确认的内容'),baselineId)}<optgroup label="${t('유아 · 수 감각','Preschool · number sense','幼儿 · 数感')}">${stages.filter(x=>x.kind==='foundation').map(x=>option(x.id,stageLabel(x),baselineId)).join('')}</optgroup><optgroup label="${t('교과 연산 · 기존 과정','Arithmetic · existing courses','运算 · 现有课程')}">${stages.filter(x=>x.kind!=='foundation').map(x=>option(x.id,stageLabel(x),baselineId)).join('')}</optgroup></select></label>
        </section>
        <section class="pd-blueprint"><h2>${t('한 번에 20문항','20 questions in one check','一次20道题')}</h2><div class="pd-bands"><div><b>6</b><span>${t('이전 진도','Earlier learning','此前进度')} · 30%</span></div><div><b>10</b><span>${t('현재 진도','Current learning','当前进度')} · 50%</span></div><div><b>4</b><span>${t('다음 진도','Next learning','后续进度')} · 20%</span></div></div><p id="pdBaselinePreview">${baseline ? escape(stageLabel(baseline)) : t('선택한 진도를 중심으로 구성합니다.','Built around the selected topic.','围绕所选进度安排。')}</p><p class="pd-note">${t('맞고 틀려도 문항 구성은 바뀌지 않습니다. 처음 기초와 마지막 과정에서는 없는 이전·다음 범위를 만들지 않고 경계를 표시합니다.','The plan stays fixed, regardless of answers. At the first and last stages, unavailable ranges are explicitly identified.','无论答对答错，题目配置保持不变。首尾阶段会明确标注不存在的前后范围。')}</p></section>
        <p class="pd-note">${t('유아는 보호자가 지시문을 읽어 줄 수 있습니다. 답이나 세는 방법은 알려주지 마세요.','An adult may read the prompt for a young child, without helping choose or count the answer.','成人可以为幼儿读题，但不要提示答案或计数方法。')}</p><p id="pdSetupError" class="pd-error" role="alert"></p><button class="pd-primary" id="pdStart"${baseline ? '' : ' disabled'}>${t('20문항 시작','Start 20 questions','开始20道题')}</button>`, 'setup');
      $('#pdAge').onchange = e => { s.age=e.target.value; redraw(); };
      $('#pdGoal').onchange = e => { s.goal=e.target.value;s.goalTarget='';redraw(); };
      if ($('#pdGoalTarget')) $('#pdGoalTarget').onchange = e => { s.goalTarget=e.target.value;ctx.save(); };
      $('#pdCadence').onchange = e => { s.cadence=e.target.value;ctx.save(); };
      if(baseline&&baseline.kind==='course'){
        $('#pdBaselinePreview').textContent=stageLabel(baseline)+' · '+t('과정 안의 여러 연산 주제를 함께 확인','Checks several arithmetic topics in this course','同时确认该课程中的多项运算内容');
      }
      if(baseline&&baseline.id===stages[0].id){
        $('#pdBaselinePreview').textContent+=' · '+t('이전 6문항: 같은 기초의 더 작은 수','Earlier six: smaller quantities in the same foundation','此前6题：同一基础中的更小数量');
      }else if(baseline&&baseline.id===stages[stages.length-1].id){
        $('#pdBaselinePreview').textContent+=' · '+t('다음 4문항: 다음 범위가 없어 같은 과정 추가 확인','Next four: no later range, extra checks in the same course','后续4题：无后续范围，同一课程补充确认');
      }
      all('[data-route]').forEach(el => el.onclick=()=>{s.route=el.dataset.route; s.baselineId=''; redraw();});
      if ($('#pdSeries')) $('#pdSeries').onchange=e=>{s.series=e.target.value;s.step='';s.progress='';s.baselineId='';redraw();};
      if ($('#pdStep')) $('#pdStep').onchange=e=>{s.step=e.target.value;s.baselineId='';redraw();};
      if ($('#pdProgress')) $('#pdProgress').onchange=e=>{s.progress=e.target.value;redraw();};
      if ($('#pdGrade')) $('#pdGrade').onchange=e=>{s.grade=e.target.value;ctx.save();};
      $('#pdBaseline').onchange=e=>{
        // Explicitly selecting a different topic overrides a book candidate.
        s.baselineId=e.target.value;
        if(mapped && s.baselineId!==resolved.baselineId) s.route='topic';
        redraw();
      };
      $('#pdStart').onclick=()=>{
        if(!baseline)return;
        $('#pdStart').disabled=true;
        try {
          d.plan=core.build(baseline.id,d.seed);d.selection.baselineId=baseline.id;d.index=0;d.responses=[];d.phase='question';d.questionStartedAt=Date.now();redraw();
        } catch (_) { $('#pdSetupError').textContent=t('이 범위의 진단을 안전하게 구성하지 못했습니다. 다른 기준을 선택해 주세요.','This range could not be safely prepared. Choose another starting point.','无法安全生成该范围的测评，请选择其他起点。');$('#pdStart').disabled=false; }
      };
    }
    const tokens = (n,symbol='●') => `<div class="pd-objects" aria-label="${escape(t('수량 그림','Quantity picture','数量图'))}">${Array.from({length:n},()=>`<span class="pd-object${symbol==='●'?' pd-orb':''}" aria-hidden="true">${symbol==='●'?'':art(symbol)}</span>`).join('')}</div>`;
    function question() {
      const item = d.plan && d.plan.items[d.index];
      if(!item){d.phase='result';d.result=summarize();ctx.onResult(d.result,d);redraw();return;}
      if(!d.questionStartedAt)d.questionStartedAt=Date.now();
      const data=item.renderData, mode=item.responseMode;
      let scene='', numeric=false, pending=null, selected=new Set(), made=0;
      if(mode==='count-tap')scene=`<p class="pd-interact-note">${t('같은 그림을 모두 눌러요.','Tap every matching object.','点选所有相同的物体。')} <span class="pd-target" aria-hidden="true">${art(data.targetSymbol)}</span></p><div class="pd-count-board">${data.items.map((x,i)=>`<button type="button" class="pd-tap" data-tap="${i}" aria-label="${t('그림','Object','物体')} ${i+1}" aria-pressed="false"><span aria-hidden="true">${art(x.symbol)}</span></button>`).join('')}</div>`;
      else if(mode==='make')scene=`<div class="pd-number-target">${data.target}</div><div class="pd-made" id="pdMade">${tokens(0,data.symbol)}</div><div class="pd-make-controls"><button type="button" id="pdRemove" aria-label="${t('하나 빼기','Remove one','减去一个')}">−</button><span>${art(data.symbol)}</span><button type="button" id="pdAdd" aria-label="${t('하나 더하기','Add one','增加一个')}">+</button></div>`;
      else if(mode==='match-number')scene=`<div class="pd-number-target">${data.target}</div><div class="pd-choices">${data.dots.map((n,i)=>`<button type="button" data-choice="${i}" aria-pressed="false" aria-label="${t('그림 선택지','Picture choice','图形选项')} ${i+1}">${tokens(n)}</button>`).join('')}</div>`;
      else if(mode==='compare')scene=`<div class="pd-choices pd-compare">${[data.left,data.right].map((n,i)=>`<button type="button" data-choice="${i+1}" aria-pressed="false" aria-label="${i===0?t('왼쪽','Left','左边'):t('오른쪽','Right','右边')}">${tokens(n,data.symbol)}</button>`).join('')}</div>`;
      else if(mode==='sequence'){numeric=true;scene=`<div class="pd-sequence">${data.seq.map((n,i)=>`<span${i===data.blank?' class="pd-blank"':''}>${i===data.blank?'?':n}</span>`).join('')}</div>`;}
      else if(mode==='split'){numeric=true;scene=`<div class="pd-bond"><div class="pd-whole"><b>${data.whole}</b>${tokens(data.whole,data.symbol)}</div><div class="pd-parts"><div><b>${data.known}</b>${tokens(data.known,data.symbol)}</div><div class="pd-unknown">?</div></div></div>`;}
      else if(mode==='join'){numeric=true;scene=`<div class="pd-join">${tokens(data.left,data.symbol)}<span>+</span>${tokens(data.right,data.symbol)}<span>=</span><span class="pd-blank">?</span></div>`;}
      else if(mode==='ten-bond'){numeric=true;scene=`<div class="pd-tenframe" aria-label="${t('10칸 그림','Ten-frame','十格图')}">${Array.from({length:10},(_,i)=>`<span>${i<data.filled?'<i class="pd-orb"></i>':''}</span>`).join('')}</div>`;}
      else if(mode==='number'){numeric=true;scene=`<div class="pd-formula" data-tex="${escape(data.tex)}"></div>${data.steps&&data.steps.length?`<div class="pd-formula-steps">${data.steps.map(x=>`<div data-tex="${escape(x.tex)}"></div>`).join('')}</div>`:''}`;}
      else {shell(t('진단 자료 확인','Assessment data','测评资料'),`<p role="alert">${t('이 문항의 표현을 지원하지 않습니다. 기준 선택부터 다시 시작해 주세요.','This question display is unsupported. Restart from the starting point.','不支持此题显示，请重新选择起点。')}</p><button class="pd-primary" id="pdRestart">${t('기준 다시 선택','Choose starting point','重新选择起点')}</button>`,'question');$('#pdRestart').onclick=()=>{d.phase='setup';redraw();};return;}
      const answerCount=mode==='number'?data.answerCount||1:1;
      shell(t('학습 시작점 확인','Starting-point check','确认学习起点'), `<header class="pd-question-top"><p>${t('문항','Question','题目')} <b>${d.index+1}</b> / 20</p><progress value="${d.index}" max="20" aria-label="${t('완료 문항','Completed questions','已完成题数')}"></progress></header><section class="pd-question"><h1 id="pdPrompt">${escape(l(item.prompt))}</h1><div class="pd-scene">${scene}</div>${numeric?`<div class="pd-answer-fields">${Array.from({length:answerCount},(_,i)=>`<label>${answerCount>1?t('답','Answer','答案')+' '+(i+1):t('답','Answer','答案')}<input class="pd-answer" type="text" inputmode="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-describedby="pdPrompt" aria-label="${t('답','Answer','答案')} ${i+1}"></label>`).join('')}</div><div class="pd-keypad" aria-label="${t('숫자 입력','Number input','数字输入')}">${['1','2','3','4','5','6','7','8','9','−','0','.','⌫'].map(key=>`<button type="button" data-key="${escape(key)}" aria-label="${key==='⌫'?t('한 글자 지우기','Delete one character','删除一个字符'):key==='−'?t('부호 바꾸기','Change sign','改变正负号'):escape(key)}">${key}</button>`).join('')}</div>`:''}<p id="pdInputError" class="pd-error" role="alert"></p><div class="pd-question-actions"><button type="button" class="pd-secondary" id="pdSkip">${t('아직 모르겠어요','Not sure yet','还不会')}</button><button type="button" class="pd-primary" id="pdSubmit">${t('답 제출','Submit answer','提交答案')}</button></div></section>`, 'question');
      let focused=$('.pd-answer');
      // The on-screen number pad is the mobile keyboard; hardware typing still works.
      all('.pd-answer').forEach(input=>{input.setAttribute('inputmode','none');input.onfocus=()=>{focused=input;};input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();$('#pdSubmit').click();}};});
      all('[data-key]').forEach(button=>button.onclick=()=>{
        if(!focused)return;
        const key=button.dataset.key;
        if(key==='⌫')focused.value=focused.value.slice(0,-1);
        else if(key==='−')focused.value=focused.value.startsWith('-')?focused.value.slice(1):'-'+focused.value;
        else focused.value+=key;
        focused.focus();
      });
      all('[data-tap]').forEach(button=>button.onclick=()=>{const i=Number(button.dataset.tap);if(selected.has(i))selected.delete(i);else selected.add(i);button.setAttribute('aria-pressed',String(selected.has(i)));});
      all('[data-choice]').forEach(button=>button.onclick=()=>{pending=Number(button.dataset.choice);all('[data-choice]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));});
      if(mode==='make'){
        const update=()=>{$('#pdMade').innerHTML=tokens(made,data.symbol);};
        $('#pdAdd').onclick=()=>{made=Math.min(Math.max(data.max+3,10),made+1);update();};
        $('#pdRemove').onclick=()=>{made=Math.max(0,made-1);update();};
      }
      let submitted=false;
      const submit=skipped=>{
        if(submitted || Date.now()-(d.lastSubmittedAt||0)<400 || d.responses.some(r=>r.id===item.id))return;
        let value=null,validationFlags;
        if(!skipped){
          if(numeric){value=readValues(all('.pd-answer').map(x=>x.value));if(value===null){$('#pdInputError').textContent=t('각 답칸에 숫자를 입력해 주세요. 음수와 소수도 입력할 수 있습니다.','Enter a number in each answer field. Negative numbers and decimals are supported.','请在各答案框输入数字，可以输入负数和小数。');return;}}
          else if(mode==='count-tap'){value=selected.size;validationFlags={validTargets:data.items.every((x,i)=>selected.has(i)===x.target)};}
          else if(mode==='make')value=made;
          else {value=pending;if(value===null){$('#pdInputError').textContent=t('그림을 하나 고르거나 ‘아직 모르겠어요’를 눌러 주세요.','Choose a picture or select “Not sure yet”.','请选择一个图形，或点“还不会”。');return;}}
        }
        submitted=true;$('#pdSubmit').disabled=true;$('#pdSkip').disabled=true;
        d.lastSubmittedAt=Date.now();
        d.responses.push({id:item.id,value,validationFlags,skipped,sec:Math.max(0,(Date.now()-d.questionStartedAt)/1000)});
        d.index++;d.questionStartedAt=Date.now();
        if(d.index===d.plan.items.length){d.phase='result';d.result=summarize();ctx.onResult(d.result,d);}
        redraw();
      };
      $('#pdSubmit').onclick=()=>submit(false);$('#pdSkip').onclick=()=>submit(true);
      // A second tap may target the new button after the synchronous redraw.
      // Briefly keep both buttons inactive across that transition as well.
      const remaining=400-(Date.now()-(d.lastSubmittedAt||0));
      if(remaining>0){
        const submitButton=$('#pdSubmit'),skipButton=$('#pdSkip');
        submitButton.disabled=true;skipButton.disabled=true;
        setTimeout(()=>{if(submitButton.isConnected){submitButton.disabled=false;skipButton.disabled=false;}},remaining+5);
      }
    }
    function result() {
      if (!paths) { shell(t('학습 경로 확인','Study pathway','学习路径'),`<p role="alert">${t('학습 경로 자료를 불러오지 못했습니다. 새로고침해 주세요.','Study pathway data could not be loaded. Please reload.','未能加载学习路径资料，请刷新。')}</p>`, 'result');return; }
      const result=d.result, path=paths.recommend(d.plan,result,d.selection), rec=path.main, course=(window.NM_COURSES||{})[rec.course];
      result.pathRecommendation=path;
      const courseTitle=rec.course==='C0'&&rec.label?l(rec.label):course?l(course.title):rec.course;
      const bandNames={previous:t('이전 진도','Earlier learning','此前进度'),current:t('현재 진도','Current learning','当前进度'),next:t('다음 진도','Next learning','后续进度')};
      const domains=Object.values(result.domains);
      shell(t('학습 제안','Learning suggestion','学习建议'),`<header class="pd-header"><p class="pd-kicker">${t('20문항으로 확인한 시작점','A starting point from 20 questions','依据20题建议的起点')}</p><h1>${t('이곳부터 함께<br>연습해 보세요.','Start practicing<br>from here.','从这里开始<br>一起练习吧。')}</h1><div class="pd-recommended"><span>${t('과정','Course','课程')} ${escape(rec.course.slice(1))} · ${t('회차','Session','课次')} ${rec.session}</span><h2>${escape(courseTitle)}</h2></div><p>${t('선택한 진도 주변의 표본을 확인한 연습 제안입니다. 전체 과정을 익혔다는 판정이나 입학시험 합격 판정이 아닙니다.','This is a practice suggestion based on a sample around your selected topic, not proof of whole-course mastery or admission readiness.','这是依据所选进度附近题目提出的练习建议，不代表掌握全部课程或通过入学测试。')}</p></header><div class="pd-score"><b>${result.correct}</b> / 20 <span>${t('맞힘','correct','答对')}</span></div><div class="pd-bands">${Object.keys(bandNames).map(b=>`<div><b>${result.bands[b].correct} / ${result.bands[b].asked}</b><span>${bandNames[b]}</span><small>${t('모름','Skipped','不会')} ${result.bands[b].skipped}</small></div>`).join('')}</div><section class="pd-skill-results"><h2>${t('내용별 확인','Topic details','各项内容')}</h2>${domains.map(x=>`<div><span>${escape(l(x.label))}</span><b>${x.correct} / ${x.asked}</b><small>${t('모름','Skipped','不会')} ${x.skipped}</small></div>`).join('')}</section><p class="pd-note">${t('오답과 모름은 구분해 기록했습니다. 시간은 참고 기록만 하며, 임의의 초 기준으로 실력을 낮추지 않습니다. 원하는 과정은 언제든 직접 고를 수 있습니다.','Wrong answers and skipped questions are recorded separately. Time is recorded only as context, without an arbitrary speed penalty. Any course remains freely selectable.','错答与不会分别记录，时间仅作参考，不按任意秒数降低能力判断。仍可自由选择课程。')}</p><div class="pd-result-actions"><button class="pd-primary" id="pdRoad">${t('로드맵에서 이 과정 보기','See this course on the roadmap','在路线图查看此课程')}</button><button class="pd-secondary" id="pdPick">${t('다른 과정 직접 고르기','Choose another course','自选其他课程')}</button><button class="pd-text-button" id="pdAgain">${t('기준을 바꿔 다시 확인','Check a different starting point','换起点重新确认')}</button></div>`, 'result');
      $('.pd-kicker').textContent=t('진단을 바탕으로 짠 학습 제안','A study plan based on this check','依据本次测评的学习建议');
      $('.pd-header h1').innerHTML=t('본진도와 보강을<br>함께 연결해요.','Connect your main study<br>with focused practice.','连接主要进度<br>与补充练习。');
      $('.pd-recommended>span').textContent=t('선택한 본진도 · 과정','Selected main study · Course','选择的主要进度 · 课程')+' '+rec.course.slice(1)+' · '+t('회차','Session','课次')+' '+rec.session;
      const guidance=document.createElement('section');guidance.className='pd-goal-plan';
      const supportLabel=row=>l(((window.NM_THREADS||{})[row.t]||{}).name||row.label);
      guidance.innerHTML=`<h2>${escape(l(path.goal.label))}</h2>${path.target?`<p class="pd-target-label">${escape(l(path.target.label))} · ${t('목표 대응 확인 필요','Target mapping needs verification','目标对应需要确认')}</p>`:''}<p>${escape(l(path.goal.direction))}</p><p class="pd-note">${escape(l(path.goal.focus))}</p>
        <h3>${t('본진도 전에 보강·재확인','Practice or recheck before the main topic','主要内容前的补充练习与再确认')}</h3>
        ${path.support.length?`<ul class="pd-support-list">${path.support.map((row,i)=>`<li><div><strong>${escape(supportLabel(row))}</strong><span>${row.kind==='practice'?t('보강 후보','Practice candidate','补充练习候选'):t('재확인 후보','Recheck candidate','再确认候选')} · ${t('오답','Wrong','错答')} ${row.wrong} · ${t('모름','Skipped','不会')} ${row.skipped}</span><small>${t('활동 위치 · 과정','Practice location · Course','练习位置 · 课程')} ${row.course.slice(1)} · ${t('회차','Session','课次')} ${row.session}</small></div><button type="button" class="pd-support-link" data-support="${i}" aria-label="${escape(supportLabel(row)+' · '+t('로드맵에서 보기','View on roadmap','在路线图查看'))}">${t('위치 보기','View location','查看位置')}</button></li>`).join('')}</ul>`:`<p>${t('이전·현재 표본에서 별도 보강 근거가 나오지 않았습니다. 전체 숙달을 뜻하지는 않습니다.','No separate practice need was found in the earlier/current sample; this does not certify full mastery.','此前与当前的样本未发现单独补充练习依据，但不代表完全掌握。')}</p>`}
        ${path.assessment.answered===0?`<p class="pd-note">${t('아직 직접 푼 답이 없어 수준을 확정할 수 없습니다. 함께 다시 확인해 주세요.','No answers were attempted, so level cannot be established. Recheck together.','尚未尝试作答，不能确定水平，请一起重新确认。')}</p>`:''}
        <h3>${t('다음에 살펴볼 주제','Next topic to explore','接下来了解的内容')}</h3><p>${path.next?escape(l(path.next.label)):t('마지막 과정입니다. 필요한 주제를 복습합니다.','This is the final course. Review the topics you need.','这是最后的课程，可复习需要的内容。')}</p><p class="pd-note">${t('다음 주제는 미리보기입니다. 다음 4문항만으로 진도를 올리거나 과정을 완료하지 않습니다.','The next topic is a preview. Four next-stage items do not advance or complete a course.','后续内容仅为预览，不凭4道后续题升级或完成课程。')}</p>
        <h3>${t('학습 계획','Study plan','学习计划')}</h3><p>${path.config.cadence==='w1'?t('주 1회','Once a week','每周一次'):t('주 2회','Twice a week','每周两次')} · ${escape(l(path.schedule.reason))}</p>
        ${path.schedule.targetMapping==='pending'?`<p class="pd-note">${t('목표별 정확한 도달 시점은 확인 필요입니다. 이번 연산 진단만으로 사고력·언어사고력이나 입학 준비도를 판단하지 않습니다.','Exact target timing still needs verification. This arithmetic check does not assess reasoning, language reasoning, or admission readiness.','准确的目标达成时间仍需确认。本运算测评不判断思维、语言思维或入学准备度。')}</p>`:''}
        <p class="pd-note">${t('목표별 학습 방향 제안입니다. 학습지 편성이나 기존 진도를 자동으로 바꾸지 않습니다.','These are goal-specific study suggestions, not automatic changes to worksheets or existing progress.','这是按目标提出的学习方向建议，不会自动改变练习纸编排或现有进度。')}</p>`;
      $('.pd-score').before(guidance);
      all('[data-support]').forEach(button=>button.onclick=()=>ctx.seeCourse(path.support[Number(button.dataset.support)].course));
      if(rec.course==='C0'){
        $('.pd-recommended>span').textContent=t('유아 기초 · 선택한 본진도','Early foundations · selected main topic','幼儿基础 · 选择的主要内容');
        const detail=document.createElement('p');detail.className='pd-note';
        detail.textContent=t('유아 회차 번호는 능력 순서가 아닙니다. 아래 활동은 보강할 위치이며, 뒤 회차로 진도를 올린다는 뜻이 아닙니다.','Preschool session numbers are not an ability ladder. These are practice locations, not advancement to later sessions.','幼儿课次编号不代表能力顺序。以下只是补充练习位置，不代表升级到后续课次。');
        $('.pd-recommended').appendChild(detail);
        if(rec.practiceSessions&&rec.practiceSessions.length){
          const practice=document.createElement('div');practice.className='pd-practice';
          practice.textContent=rec.practiceSessions.map(x=>`${t('활동 위치','Practice location','练习位置')}: C0 · ${t('회차','session','课次')} ${x.session} · ${l((window.NM_THREADS[x.t]||{}).name||x.t)}`).join(' / ');
          $('.pd-recommended').appendChild(practice);
        }
      }
      if(d.plan.boundaries&&(d.plan.boundaries.previous||d.plan.boundaries.next)){
        const boundary=document.createElement('p');boundary.className='pd-note';
        boundary.textContent=d.plan.boundaries.previous?t('첫 기초의 이전 6문항은 같은 기초에서 더 작은 수를 확인했습니다.','At the first foundation, the six earlier items used smaller quantities within the same skill.','起点阶段的6道此前题目在同一基础中使用更小数量。'):t('마지막 과정에는 다음 범위가 없어 다음 4문항은 같은 과정 추가 확인입니다.','There is no later range after the final course; the four next items are extra checks in the same course.','最后课程没有后续范围，4道后续题为同一课程的补充确认。');
        $('.pd-score').before(boundary);
      }
      $('#pdRoad').textContent=t('로드맵에서 본진도 보기','See main study on the roadmap','在路线图查看主要进度');
      $('#pdRoad').onclick=()=>ctx.seeCourse(rec.course);$('#pdPick').onclick=ctx.pick;$('#pdAgain').onclick=()=>{const config=paths.normalize(d.selection),fresh=initial();Object.assign(fresh.selection,config);Object.assign(d,fresh);redraw();};
    }
    if(d.phase==='setup')setup();else if(d.phase==='question')question();else if(d.phase==='result'&&d.result)result();else {Object.assign(d,initial());setup();}
  }
  window.NM_PLACEMENT_UI = { version: VERSION, initial, render, parseNumber, readValues };
})();
