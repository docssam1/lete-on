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
    return { version: VERSION, phase: 'setup', selection: { route: 'age', age: '', grade: '', semester: '1', series: '', step: '', progress: '', baselineId: '', goal: 'curriculum', goalTarget: '', cadence: 'w2' },
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
    const redraw = () => {
      const active = d.phase==='setup' && document.activeElement && document.activeElement.id;
      const open = all('details').map(x=>x.open);
      ctx.save(); render(ctx);
      all('details').forEach((x,i)=>{x.open=!!open[i];});
      if(active){const el=$('#'+active);if(el&&!el.disabled)el.focus({preventScroll:true});}
    };
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
        <main data-pd-view="${viewKey}" class="nm-placement ${d.selection.age && Number(String(d.selection.age).replace(/^pre/,'')) < 8 ? 'nm-placement-young' : ''}">
        <nav class="pd-flow" aria-label="${t('진단 순서','Assessment steps','测评步骤')}"><span${phase === 'setup' ? ' aria-current="step"' : ''}>01 ${t('기준 고르기','Starting point','选择起点')}</span><span${phase === 'question' ? ' aria-current="step"' : ''}>02 ${t('20문항 확인','20 questions','20道题')}</span><span${phase === 'result' ? ' aria-current="step"' : ''}>03 ${t('학습 제안','Learning suggestion','学习建议')}</span></nav>${body}</main>`;
      $('#pdBack').onclick = ctx.close;
      if (ctx.renderMath) ctx.renderMath(root);
      // Each new question/result starts at its prompt, not at the previous answer.
      // Keep the position when only a setup selection redraws the same view.
      if (changedView) root.scrollTop = 0;
    };
    const stageLabel = stage => `${stage.kind === 'foundation' ? t('유아 기초','Early foundations','幼儿基础') : t('과정','Course','课程') + ' ' + stage.course.slice(1)} · ${l(stage.label)}`;
    function setup() {
      const s=d.selection, core=window.NM_PLACEMENT_PLAN;
      if(!core||!paths){shell(t('진단 자료 확인','Assessment data','测评资料'),'<p role="alert">'+t('진단 자료를 불러오지 못했습니다. 새로고침해 주세요.','Assessment data could not be loaded. Please reload.','未能加载测评资料，请刷新。')+'</p>','setup');return;}
      let stages;
      try{stages=core.stages();}catch(_){shell(t('진단 자료 확인','Assessment data','测评资料'),'<p role="alert">'+t('과정 자료가 아직 준비되지 않았습니다.','Course data is not ready.','课程资料尚未准备好。')+'</p>','setup');return;}
      // Migrate setup only: never rebuild an in-progress fixed plan.
      if(!['unlearned','school','age'].includes(s.route))s.route='age';
      if(s.age==='school')s.age='';
      if(/^pre/.test(s.age))s.age=s.age.slice(3);
      const candidate=paths.startingPoint(s);
      const baseline=stages.find(x=>x.id===(candidate?(s.baselineId||candidate):''));
      const ages=[['',t('현재 나이 선택','Select current age','选择目前年龄')],...Array.from({length:16},(_,i)=>[String(i+4),t((i+4)+'세','Age '+(i+4),(i+4)+'岁')])];
      const grades=[['',t('학년 선택','Select grade','选择年级')],...Array.from({length:6},(_,i)=>['e'+(i+1),t('초'+(i+1),'Grade '+(i+1),'小学'+(i+1)+'年级')]),...Array.from({length:3},(_,i)=>['m'+(i+1),t('중'+(i+1),'Grade '+(i+7),'初中'+(i+1)+'年级')]),...Array.from({length:3},(_,i)=>['h'+(i+1),t('고'+(i+1),'High school '+(i+1),'高中'+(i+1)+'年级')])];
      const routes=[['unlearned',t('아직 배우지 않았어요','Not studied yet','还没学过')],['school',t('현행 진도로 진단','Current school level','按当前学校进度')],['age',t('나이에 맞게 진단','Age-based starting point','按年龄选择起点')]];
      const options=(rows,selected)=>rows.map(x=>option(x[0],x[1],selected)).join('');
      const goalFields='<label>'+t('학습 목표','Learning goal','学习目标')+'<select id="pdGoal">'+paths.goals.map(x=>option(x.id,l(x.label),s.goal)).join('')+'</select></label>'+
        (s.goal==='competition'?'<label>'+t('목표 진도','Progress goal','目标进度')+'<select id="pdGoalTarget">'+option('',t('아직 정하지 않았어요','Not decided yet','尚未确定'),s.goalTarget)+paths.targets.map(x=>option(x.id,l(x.label),s.goalTarget)).join('')+'</select></label><p class="pd-note">'+t('목표 대응은 자료 대조가 필요합니다. 이번 연산 진단은 입학 준비도 판정이 아닙니다.','Target mapping needs verification. This arithmetic check does not assess admission readiness.','目标对应需要资料核对。本运算测评不判断入学准备度。')+'</p>':'')+
        '<label class="pd-cadence">'+t('희망 학습 횟수 · 기존 계획은 유지','Preferred frequency · current plan stays unchanged','希望的次数 · 现有计划不变')+'<select id="pdCadence">'+options([['w2',t('주 2회','Twice a week','每周两次')],['w1',t('주 1회','Once a week','每周一次')]],s.cadence)+'</select></label>';
      const paperQuery=baseline?new URLSearchParams({b:baseline.id,l:lang,seed:d.seed,goal:s.goal,target:s.goalTarget||'',cadence:s.cadence}).toString():'';
      shell(t('학습 시작점 찾기','Find your starting point','找到学习起点'),
        '<header class="pd-header"><p class="pd-kicker">NUMBERS OF MAGIC</p><h1>'+t('우리 아이의 시작점을<br>가볍게 확인해요.','Find a starting point<br>for your child.','轻松找到<br>孩子的学习起点。')+'</h1><p>'+t('아직 배우지 않았어도 괜찮아요. 나이 또는 현행 진도로 시작하고, 필요하면 더 쉬운 기초로 바꿀 수 있어요.','It is fine not to have studied yet. Begin by age or school level; earlier foundations always remain available.','还没学过也没关系。按年龄或学校进度开始，也可改选更早的基础。')+'</p></header>'+
        '<div class="pd-context"><label>'+t('먼저, 현재 나이를 알려 주세요','First, choose your current age','先选择目前年龄')+'<select id="pdAge">'+options(ages,s.age)+'</select></label></div>'+
        '<div class="pd-routes" role="group" aria-label="'+t('진단 시작 방법','How to begin','测评开始方式')+'">'+routes.map(x=>'<button type="button" data-route="'+x[0]+'"'+(s.age?'':' disabled')+' aria-pressed="'+(s.route===x[0])+'">'+x[1]+'</button>').join('')+'</div>'+
        '<section class="pd-selection"'+(s.age?'':' hidden')+'>'+
        (s.route==='school'?'<label>'+t('현재 학년','Current school grade','目前年级')+'<select id="pdGrade">'+options(grades,s.grade)+'</select></label><label>'+t('현재 학기 · 참고 기록','Current semester · context','当前学期 · 参考')+'<select id="pdSemester">'+options([['1',t('1학기','Semester 1','第一学期')],['2',t('2학기','Semester 2','第二学期')]],s.semester||'1')+'</select></label><p class="pd-note">'+t('학년 진입 과정에서 시작하는 연산 표본입니다. 학기별 전체 교과 이수 판정은 아닙니다.','An arithmetic sample from the grade-entry course, not certification of a whole semester.','从年级起点课程抽样，不代表完成整个学期。')+'</p>':'')+
        (baseline?'<p class="pd-starting-point"><b>'+escape(stageLabel(baseline))+'</b></p><p class="pd-note">'+(s.route==='unlearned'?t('배운 적이 없다면 나이에 관계없이 수 세기부터 확인합니다.','If not studied yet, start with counting at any age.','还没学过时，不论年龄先确认数数。'):t('출발 후보이지 나이의 표준이나 실력 판정은 아닙니다. 재학 단계와 다르면 출발점을 바꿔 주세요.','A starting candidate, not an age standard or ability judgment. Change it if your school stage differs.','只是起点候选，不是年龄标准或能力判断。与在读阶段不符时可更改。'))+'</p>':'')+
        '<details class="pd-optional"><summary>'+t('출발점 바꾸기 · 더 쉬운 기초도 선택 가능','Change starting point · earlier foundations available','更改起点 · 可选更早的基础')+'</summary><label class="pd-topic">'+t('확인할 출발점','Starting point to check','要确认的起点')+'<select id="pdBaseline"'+(candidate?'':' disabled')+'>'+option('',t('출발점 선택','Select starting point','选择起点'),baseline&&baseline.id)+
        '<optgroup label="'+t('유아 · 수 감각','Early foundations','幼儿 · 数感')+'">'+stages.filter(x=>x.kind==='foundation').map(x=>option(x.id,stageLabel(x),baseline&&baseline.id)).join('')+'</optgroup><optgroup label="'+t('기존 교과 연산 과정','Existing arithmetic courses','现有运算课程')+'">'+stages.filter(x=>x.kind!=='foundation').map(x=>option(x.id,stageLabel(x),baseline&&baseline.id)).join('')+'</optgroup></select></label></details></section>'+
        '<details class="pd-optional"'+(s.age?'':' hidden')+'><summary>'+t('학습 목표 · 횟수 (선택)','Goal · frequency (optional)','目标 · 次数（可选）')+'</summary><section class="pd-goal-selection">'+goalFields+'<p class="pd-note">'+t('목표는 방향만 안내합니다. 문항·채점은 동일하며 현재 속도·분량·횟수를 자동 변경하지 않습니다.','Goals guide direction only. Questions and scoring stay the same; current workload is not changed automatically.','目标只指导方向，不改变题目、评分或当前学习量。')+'</p></section></details>'+
        '<section class="pd-blueprint"><h2>'+t('한 번에 20문항','20 questions in one check','一次20道题')+'</h2><div class="pd-bands">'+[['6','30%',t('이전 진도','Earlier learning','此前进度')],['10','50%',t('현재 진도','Current learning','当前进度')],['4','20%',t('다음 진도','Next learning','后续进度')]].map(x=>'<div><b>'+x[0]+'</b><span>'+x[2]+' · '+x[1]+'</span></div>').join('')+'</div><p id="pdBaselinePreview">'+
        (baseline?escape(stageLabel(baseline)):t('현재 나이와 진단 방법을 고르면 출발점이 나옵니다.','Choose age and route to see a starting point.','选择年龄与方式后显示起点。'))+'</p><p class="pd-note">'+t('맞고 틀려도 문항은 바뀌지 않습니다. 첫 기초의 이전 6문항은 같은 기초의 작은 수로, 마지막 과정의 다음 4문항은 같은 과정 추가 확인으로 표시합니다.','The plan stays fixed. At the first foundation, earlier items use smaller quantities; at the final course, next items are additional checks in that course.','题目配置保持不变。最初基础的此前题使用更小数量，最后课程的后续题为同课程补充确认。')+'</p></section>'+
        '<p class="pd-note">'+t('유아는 보호자가 지시문을 읽어 줄 수 있습니다. 답이나 세는 방법은 알려주지 마세요.','An adult may read the prompt for a young child, without helping choose or count the answer.','成人可以为幼儿读题，但不要提示答案或计数方法。')+'</p><p id="pdSetupError" class="pd-error" role="alert"></p><button class="pd-primary" id="pdStart"'+(baseline?'':' disabled')+'>'+t('20문항 시작','Start 20 questions','开始20道题')+'</button>'+
        (baseline?'<a class="pd-secondary pd-paper" id="pdPaper" href="placement-sheet.html?'+escape(paperQuery)+'" target="_blank" rel="noopener">'+t('종이로 인쇄 · O/X 채점','Print on paper · mark O/X','打印 · 对错评分')+'</a><p class="pd-note">'+t('인쇄본에는 보호자·선생님용 정답 쪽이 포함됩니다. 아이에게는 시험 쪽만 주세요.','The printout includes an adult answer page. Give the child only the test pages.','打印件包含家长·教师答案页，请只给孩子试题页。')+'</p>':''),'setup');
      // Keep the primary action beside the chosen starting point, before optional
      // planning details and the longer explanation of the fixed blueprint.
      $('.pd-selection').after($('#pdSetupError'));$('#pdSetupError').after($('#pdStart'));
      if(baseline)$('#pdStart').after($('#pdPaper'));
      $('#pdAge').onchange=e=>{s.age=e.target.value;s.baselineId='';redraw();};
      all('[data-route]').forEach(el=>el.onclick=()=>{s.route=el.dataset.route;s.baselineId='';redraw();});
      if(s.route==='school'){
        $('#pdGrade').onchange=e=>{s.grade=e.target.value;s.baselineId='';redraw();};
        $('#pdSemester').onchange=e=>{s.semester=e.target.value;ctx.save();};
      }
      $('#pdGoal').onchange=e=>{s.goal=e.target.value;s.goalTarget='';redraw();};
      if(s.goal==='competition')$('#pdGoalTarget').onchange=e=>{s.goalTarget=e.target.value;redraw();};
      $('#pdCadence').onchange=e=>{s.cadence=e.target.value;redraw();};
      $('#pdBaseline').onchange=e=>{s.baselineId=e.target.value;redraw();};
      $('#pdStart').onclick=()=>{
        if(!baseline)return;
        $('#pdStart').disabled=true;
        try{d.plan=core.build(baseline.id,d.seed);s.baselineId=baseline.id;d.index=0;d.responses=[];d.phase='question';d.questionStartedAt=Date.now();redraw();}
        catch(_){$('#pdSetupError').textContent=t('이 범위를 안전하게 구성하지 못했습니다. 출발점을 바꿔 주세요.','This range could not be safely prepared. Choose another starting point.','无法安全生成此范围，请更改起点。');$('#pdStart').disabled=false;}
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
      if(window.NM_STUDY_ROUTE){
        const planner=document.createElement('div');guidance.appendChild(planner);
        window.NM_STUDY_ROUTE.mount(planner,{lang,course:rec.course,session:rec.session,cadence:ctx.currentCadence||path.config.cadence});
      }
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
