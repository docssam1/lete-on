/* Adult evidence controls attached to the existing plan, not a second roadmap. */
(function(){
  'use strict';
  function mount(host,form,options){
    const R=window.NM_STUDY_RECORDS;if(!R||!R.isBound())return null;
    const o=options||{},t=(ko,en,zh)=>o.lang==='en'?en:o.lang==='zh'?zh:ko;
    const list=window.NM_STUDY_PROJECTION.courses(),esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const saved=R.snapshot().studyGoal;
    if(saved){form.elements.startCourse.value=saved.startCourse;form.elements.startSession.value=saved.startSession;form.elements.targetCourse.value=saved.targetCourse;if(saved.targetDate>R.day(Date.now()))form.elements.targetDate.value=saved.targetDate;}
    const anchor=saved||{startCourse:form.elements.startCourse.value,startSession:+form.elements.startSession.value};
    const next=R.nextPosition(R.snapshot(),anchor.startCourse,anchor.startSession);
    if(next.verified&&!next.complete){form.elements.startCourse.value=next.course;form.elements.startSession.value=next.session;}
    form.elements.startSession.max=list.find(c=>c.id===form.elements.startCourse.value).sessions;
    const section=document.createElement('section');section.className='pd-evidence';
    section.innerHTML='<h3>'+t('기록에서 이어지는 나의 계획','A plan connected to study records','连接学习记录的计划')+'</h3><div class="pd-evidence-summary" aria-live="polite"></div>'+
      '<details class="pd-session-confirm"><summary>'+t('종이·전체 회차 학습 완료 기록','Record a whole-session completion','记录完整课次学习')+'</summary><p class="pd-note">'+t('온라인 채점은 자동 기록됩니다. 아래는 개념·교과·창의·문장제 등 편성 전체를 공부한 뒤 보호자가 확인하는 기록입니다. 출력만 했거나 드릴만 끝냈다면 체크하지 않습니다. 시간은 온라인을 포함한 이 회차의 실제 총 시간입니다.','Online grades are recorded automatically. Confirm here only after studying the whole planned session, including its concept, curriculum, creative and word-problem work. Printing or finishing drills alone does not qualify. Enter actual total minutes, including online work.','在线批改自动记录。此处由家长确认已学习完整编排，包括概念、课内、创意及应用题。仅打印或完成计算练习不算。时间填写含在线学习的实际总分钟数。')+'</p><form class="pd-session-form"><div class="pd-projection-fields">'+
      '<label>'+t('완료한 과정','Completed course','完成的课程')+'<select name="course">'+list.map(c=>'<option value="'+c.id+'">'+esc(c.id+' · '+(typeof c.title==='object'?(c.title[o.lang]||c.title.ko):c.title))+'</option>').join('')+'</select></label>'+
      '<label>'+t('회차','Session','课次')+'<input name="session" type="number" min="1" step="1" required></label>'+
      '<label>'+t('실제 공부한 날짜 · 최근 28일','Actual study date · last 28 days','实际学习日期 · 最近28天')+'<input name="day" type="date" max="'+R.day(Date.now())+'" value="'+R.day(Date.now())+'" required></label>'+
      '<label>'+t('이 회차 총 학습시간(분)','Total minutes for this session','本课次总学习分钟数')+'<input name="minutes" type="number" min="5" max="120" step="1" required></label>'+
      '<label>'+t('회차 전체 첫 풀이 문항 · 온라인 포함(선택)','Whole-session first attempt · include online (optional)','整课次首次作答总题数 · 含在线（可选）')+'<input name="total" type="number" min="1" max="1000" step="1"></label>'+
      '<label>'+t('그중 정답(선택)','Correct (optional)','其中答对（可选）')+'<input name="correct" type="number" min="0" max="1000" step="1"></label></div>'+
      '<label class="pd-reviewed"><input name="whole" type="checkbox" required>'+t('출력 여부가 아니라, 이 회차의 전체 학습 완료를 확인했습니다.','I confirmed the whole session was studied, not merely printed.','确认已完整学习此课次，而非仅打印。')+'</label><button type="submit" class="pd-primary">'+t('완료 기록 저장','Save completion','保存完成记录')+'</button><p class="pd-record-message" role="status"></p></form></details>'+
      '<button type="button" class="pd-save-goal">'+t('지금 목표 저장','Save this goal','保存当前目标')+'</button><p class="pd-goal-message" role="status"></p>';
    host.querySelector('.pd-route-planner > .pd-note').after(section);
    // Keep forms siblings: nesting a completion form inside a planning form loses submits.
    const completion=section.querySelector('.pd-session-form'),summary=section.querySelector('.pd-evidence-summary');
    completion.elements.course.value=form.elements.startCourse.value;completion.elements.session.value=form.elements.startSession.value;
    function maxSession(){completion.elements.session.max=list.find(c=>c.id===completion.elements.course.value).sessions;}
    completion.elements.course.onchange=()=>{completion.elements.session.value=1;maxSession();};maxSession();
    const reasons={
      'observe-days':t('14일 이상 관찰 중','Observing at least 14 days','至少观察14天'),
      'observe-visits':t('서로 다른 4일의 전체 학습 기록 필요','Whole-session records on 4 different days needed','需要4天的完整学习记录'),
      'no-new-session':t('새로 완료한 회차 확인 필요','A newly completed session is needed','需确认新完成的课次'),
      stale:t('최근 학습 기록을 더 모읍니다','Collect recent study records','继续收集近期学习记录'),
      'quality-missing':t('4일·40문항 이상의 첫 풀이 채점 확인 필요','First-attempt grading on 4 days / 40 problems needed','需4天、40题以上的首次批改记录'),
      incomplete:t('미완료 채점이 있어 실제 학습 상태를 더 살펴봅니다','Incomplete graded work needs further observation','有未完成的批改练习，需继续观察'),
      'recent-low':t('최근 낮은 성적이 이어져 먼저 보강합니다','Recent low results need support first','近期连续低分，先补充练习'),
      conflict:t('전체 회차와 온라인 채점의 포함 범위 확인 필요','Check the scope of whole-session versus online grading','需确认整课次与在线批改的覆盖范围'),
      'log-version':t('이 기록 형식은 새 버전에서 확인해 주세요','Review this record format in its supported version','请在支持的版本检查此记录格式'),
      accuracy:t('정확도를 먼저 안정시킵니다','Stabilize accuracy first','先稳定准确率'),
      recurring:t('반복해서 어려운 유형을 먼저 보강합니다','Support repeatedly difficult skills first','先补充反复困难的题型'),
      decline:t('최근 정확도 하락을 더 관찰합니다','Observe the recent accuracy decline','继续观察近期准确率下降'),
      'time-range':t('하루 학습시간 범위를 확인합니다','Review daily study time','检查每日学习时间')};
    let current;
    let planningAnchor={course:anchor.startCourse,session:anchor.startSession};
    function refresh(){
      const position=R.nextPosition(R.snapshot(),planningAnchor.course,planningAnchor.session);
      if(position.verified&&!position.complete){form.elements.startCourse.value=position.course;form.elements.startSession.value=position.session;}
      form.elements.startSession.max=list.find(c=>c.id===form.elements.startCourse.value).sessions;
      current=R.summarize(R.snapshot(),{course:form.elements.startCourse.value,session:+form.elements.startSession.value});
      const p=current.projection;
      for(const name of ['observedWeeks','observedVisits','completedSessions','observedMinutes']){form.elements[name].value=p?p[name]:'';form.elements[name].readOnly=true;}
      if(current.averageMinutes&&current.averageMinutes<=120)form.elements.minutes.value=Math.max(5,current.averageMinutes);
      if(p){form.elements.frequency.value=Math.floor(current.visits*7/current.spanDays*100)/100;form.elements.frequency.step='.01';}
      else form.elements.frequency.value='';
      form.elements.frequency.readOnly=true;
      form.elements.reviewed.disabled=current.status!=='eligible-to-compare';if(form.elements.reviewed.disabled)form.elements.reviewed.checked=false;
      const rate=current.rate===null?t('정확도 미확인','Accuracy not yet known','准确率未确认'):t('첫 풀이 정답률 ','First-attempt accuracy ','首次正确率 ')+Math.round(current.rate*100)+'%';
      summary.innerHTML='<p class="pd-evidence-lead">'+(current.status==='eligible-to-compare'?t('관찰 기록이 모였습니다. 목표와 비교하되, 지금 분량은 그대로입니다.','Observation records are ready to compare. Current workload stays unchanged.','观察记录已齐备，可以比较目标。目前学习量不变。'):t('지금은 유지·관찰합니다. 기록이 모여도 자동으로 늘리지 않습니다.','Maintain and observe. Even with enough records, increases are never automatic.','目前保持并观察，记录充足后也不自动增量。'))+'</p><p>'+esc(current.windowStart+' ~ '+current.windowEnd)+' · '+t('현재 출발 과정과 같은 단계만','Same stage as the planning start only','仅计划起点所在阶段')+'</p><p>'+t('전체 학습 '+current.visits+'일 · 새 회차 '+current.completedSessions+'개 · 재학습 '+current.reviewSessions+'개','Whole study: '+current.visits+' days · '+current.completedSessions+' new sessions · '+current.reviewSessions+' reviews','完整学习'+current.visits+'天 · 新课次'+current.completedSessions+' · 复习'+current.reviewSessions)+'</p><p>'+esc(rate)+' · '+t('온라인 첫 채점 '+current.attempts+'세트','Online first grades: '+current.attempts+' sets','在线首次批改'+current.attempts+'组')+'</p>'+
        (current.reasons.length?'<ul>'+[...new Set(current.reasons.map(k=>reasons[k]))].map(s=>'<li>'+esc(s)+'</li>').join('')+'</ul>':'<p>'+t('기록상 증가 비교를 열 수 있습니다. 충분한 숙달을 보장하는 판정은 아닙니다. 먼저 유지한 뒤 2주 이상에 걸친 +5분 또는 주 +1회만 비교합니다.','Records allow an increase comparison, not a mastery verdict. Keep the current plan first, then compare only +5 minutes or one extra visit over at least two weeks.','记录允许比较增量，不代表掌握判定。先保持，再用至少两周比较增加5分钟或每周一次。')+'</p>')+
        '<p class="pd-note">'+(p?t('유지 경로는 실제 주 평균 '+form.elements.frequency.value+'일을 사용합니다. 설정된 주당 횟수와 다를 수 있으며 주 단위 평균입니다.','The unchanged path uses '+form.elements.frequency.value+' observed study days/week, a weekly average that may differ from configured frequency.','保持路线使用实际每周平均'+form.elements.frequency.value+'天，可能不同于设置的次数。')+' ':'')+t('옛 기록의 시간·소유자는 추정하지 않습니다. 종이 총 시간에 온라인 시간을 더하지 않습니다. 목표 날짜가 급해도 이 관문은 유지합니다.','Missing legacy times or owners are not inferred. Online time is not added to paper-session total time. A tight deadline never bypasses these gates.','不推测旧记录的时间或所有者。在线时间不叠加到完整课次总时间，紧迫目标也不绕过观察要求。')+'</p>';
      return current;
    }
    completion.onsubmit=e=>{e.preventDefault();if(!completion.reportValidity())return;
      const f=completion.elements,message=completion.querySelector('.pd-record-message');
      try{const total=f.total.value===''?null:+f.total.value,correct=f.correct.value===''?null:+f.correct.value;
        R.confirmSession({course:f.course.value,session:+f.session.value,day:f.day.value,minutes:+f.minutes.value,total,correct,whole:f.whole.checked});
        f.whole.checked=false;message.textContent=t('전체 학습 완료를 기록했습니다. 같은 회차를 다시 하면 새 진도가 아닌 재학습입니다.','Completion recorded. Repeating this session counts as review, not new progress.','已记录完整学习。重复同课次记为复习，不计新进度。');
        refresh();form.dispatchEvent(new Event('input',{bubbles:true}));
      }catch(error){message.textContent=error.message==='save'?t('기기에 저장하지 못했습니다. 저장 공간을 확인한 뒤 다시 시도해 주세요.','Could not save on this device. Check storage and retry.','未能保存到此设备，请检查存储后重试。'):error.message==='duplicate-session-day'?t('이 날짜의 같은 회차는 이미 기록되어 있습니다.','This session is already recorded for this date.','此日期的同一课次已记录。'):t('날짜·회차·시간·채점 수를 확인해 주세요. 채점 수는 두 칸을 함께 입력하거나 둘 다 비워 두세요.','Check the date, session, time and score. Fill both score fields or leave both blank.','请检查日期、课次、时间和题数。批改两栏需同时填写或都留空。');}
    };
    section.querySelector('.pd-save-goal').onclick=()=>{const message=section.querySelector('.pd-goal-message');try{R.saveGoal({startCourse:form.elements.startCourse.value,startSession:+form.elements.startSession.value,targetCourse:form.elements.targetCourse.value,targetDate:form.elements.targetDate.value});message.textContent=t('목표만 저장했습니다. 학습량·횟수·속도는 바뀌지 않습니다.','Goal saved. Workload, frequency and pace are unchanged.','仅保存目标，学习量、次数与速度均不变。');}catch(e){message.textContent=t('출발·목표 과정과 미래 날짜를 확인해 주세요.','Check the courses and future target date.','请检查起点、目标课程及未来日期。');}};
    form.addEventListener('change',e=>{if(['startCourse','startSession'].includes(e.target.name)){planningAnchor={course:form.elements.startCourse.value,session:+form.elements.startSession.value};refresh();}});
    form.elements.rampWeeks.min='2';
    refresh();return {refresh,get current(){return current;}};
  }
  window.NM_STUDY_RECORD_PANEL={mount};
})();
