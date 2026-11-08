/* A dated textbook endpoint is the last consecutive page or chapter the learner can solve independently. */
(function (g) {
  'use strict';
  const stateByHost = new WeakMap();
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c =>
    ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
  const isDay = value => typeof value === 'string' && /^\d{4}-\d\d-\d\d$/.test(value);
  const dateValue = day => Date.parse(day + 'T00:00:00Z');
  const dateText = day => isDay(day) ? day.slice(0,4) + '.' + day.slice(5,7) + '.' + day.slice(8) : '';
  const shortDate = day => isDay(day) ? Number(day.slice(5,7)) + '/' + Number(day.slice(8)) : '';
  const axisLabel = unit => unit === 'chapter' ? '단원' : '쪽';
  const round = value => Number(value.toFixed(1)).toLocaleString('ko-KR', {maximumFractionDigits:1});
  const distance = (n, unit) => Math.abs(n) < 0.1 && n !== 0 ? '0.1' + axisLabel(unit) + ' 미만' : round(Math.abs(n)) + axisLabel(unit);

  function endpoint(value, unit, book) {
    if (!Number.isFinite(value)) return '확인 전';
    if (value === 0) return '시작 전';
    if (unit === 'chapter' && Number.isInteger(value) && book.chapters?.[value-1]) {
      return value + '단원 · ' + book.chapters[value-1];
    }
    return round(value) + axisLabel(unit);
  }

  function direction(pace, unit) {
    const trend = pace.direction, previous = pace.previous?.gap, latest = pace.latest?.gap;
    if (!Number.isFinite(previous) || !Number.isFinite(latest) || trend === 'unknown') return '';
    const change = distance(latest-previous, unit);
    if (trend === 'steady') return latest === 0 ? '두 기록 모두 목표에 맞았어요.' : '두 기록 사이에 목표와의 차이가 유지됐어요.';
    if (previous < 0 && latest >= 0) return latest > 0 ? '목표를 따라잡고 앞서기 시작했어요.' : '목표 진도를 따라잡았어요.';
    if (previous >= 0 && latest < 0) return '최근 기록에서 목표보다 늦어지기 시작했어요.';
    if (latest < 0 && trend === 'gaining') return '따라잡고 있어요. 지난 기록보다 ' + change + ' 가까워졌어요.';
    if (latest < 0 && trend === 'losing') return '더 늦어지고 있어요. 지난 기록보다 ' + change + ' 더 벌어졌어요.';
    if (latest === 0) return '최근 기록에서 목표와 같은 위치예요.';
    return trend === 'gaining' ? '앞선 폭이 ' + change + ' 늘었어요.' : '앞선 폭이 ' + change + ' 줄었어요.';
  }

  function forecast(pace) {
    const estimate = pace.forecast || {};
    switch (estimate.status) {
      case 'catch': return '현재 속도라면 ' + dateText(estimate.date) + ' 무렵에 이 교재의 목표 진도를 따라잡아요.';
      case 'after-goal': return estimate.finishDate
        ? '현재 속도라면 목표 종료일 뒤인 ' + dateText(estimate.finishDate) + ' 무렵에 이 교재의 목표 범위까지 풀 수 있어요.'
        : '현재 속도에서는 목표 기간 안에 따라잡기 어려워요.';
      case 'no-gain': return '최근 속도에서는 따라잡는 날짜를 예상하기 어려워요.';
      case 'check-again': return '최근 예상과 오늘 위치를 비교할 수 있도록 혼자 풀 수 있는 범위를 다시 기록해 주세요.';
      case 'need-records': return '다른 날짜에 한 번 더 기록하면 격차의 변화와 예상 시점을 확인할 수 있어요.';
      case 'not-started': return pace.goal ? '목표 시작일은 ' + dateText(pace.goal.startDate) + '이에요.' : '';
      case 'no-record': return '혼자 풀 수 있는 범위를 기록하면 목표와 비교할 수 있어요.';
      case 'no-goal': return '이 교재의 목표 기간과 범위를 정하면 앞선 분량과 남은 분량이 보여요.';
      default: return '';
    }
  }

  function student(route) {
    const visual = g.PlannerStudentVisual;
    if (!visual) return '';
    const stage = visual.stage(route) ?? 2;
    return ['boy','girl'].includes(route.gender) ? visual.figure(stage,route.gender) : visual.pair(stage);
  }

  function graph(model, route) {
    const {pace, unit, day} = model;
    const observed = pace.points || [], goal = pace.goal;
    const milestones = goal?.milestones || [];
    const steps = goal && day > goal.endDate ? [...milestones, {date:day, position:goal.endPosition}] : milestones;
    if (!steps.length && !observed.length) return '';
    const dates = [...observed.map(p => p.date), ...steps.map(p => p.date), day].filter(isDay).sort();
    const first = dateValue(dates[0]), last = dateValue(dates.at(-1)), duration = last-first;
    const ceiling = Math.max(1, ...observed.map(p => p.position), ...steps.map(p => p.position));
    const x = date => duration ? 3 + 94*(dateValue(date)-first)/duration : 50;
    const y = position => 80 - 55*position/ceiling;
    const path = points => points.map((p,i) => (i ? 'L' : 'M') + x(p.date).toFixed(3) + ',' + y(p.position).toFixed(3)).join(' ');
    const position = p => 'style="left:' + x(p.date) + '%;top:' + y(p.position) + '%"';
    const actual = pace.latest;
    let projection = null;
    const estimate = pace.forecast;
    if (estimate?.status === 'catch' && actual && isDay(estimate.date) && estimate.date <= dates.at(-1) && Number.isFinite(pace.actualRate)) {
      const days = (dateValue(estimate.date)-dateValue(actual.date))/86400000;
      if (days > 0) projection = {date:estimate.date, position:Math.min(goal.endPosition, actual.position + days*pace.actualRate)};
    }
    return '<figure class="bp-chart" aria-label="날짜에 따른 교재 진도"><figcaption><span class="bp-key bp-key-actual">혼자 풀 수 있는 범위</span>' +
      (steps.length ? '<span class="bp-key bp-key-goal">목표 진도</span>' : '') +
      (projection ? '<span class="bp-key bp-key-estimate">현재 속도 예상</span>' : '') +
      '</figcaption><div class="bp-graph" aria-hidden="true"><div class="bp-drawing">' +
      [ceiling,0].map(n=>'<span class="bp-guide" style="top:' + y(n) + '%"><span>' + round(n) + axisLabel(unit) + '</span></span>').join('') +
      '<svg viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">' +
      (steps.length ? '<path class="bp-goal-line" d="' + path(steps) + '"/>' : '') +
      (observed.length>1 ? '<path class="bp-actual-line" d="' + path(observed) + '"/>' : '') +
      (projection ? '<path class="bp-estimate-line" d="' + path([actual,projection]) + '"/>' : '') + '</svg>' +
      (goal && Number.isFinite(pace.currentTarget) ? '<i class="bp-target" '+position({date:day,position:pace.currentTarget})+'></i>' : '') +
      observed.map(p => '<i class="bp-point" data-bp-date="'+esc(p.date)+'" data-bp-position="'+p.position+'" '+position(p)+'></i>').join('') +
      (actual ? '<span class="bp-actor" data-bp-date="'+esc(actual.date)+'" '+position(actual)+'>'+student(route)+'</span>' : '') +
      (projection ? '<i class="bp-estimate" '+position(projection)+'></i>' : '') +
      '</div><div class="bp-dates"><span>'+shortDate(dates[0])+'</span>' +
      (duration ? '<span>'+shortDate(dates.at(-1))+'</span>' : '') + '</div></div></figure>';
  }

  function numberField(name, value, unit, book) {
    const max = unit === 'chapter' && book.chapters?.length ? book.chapters.length : 99999;
    if (unit === 'chapter' && book.chapters?.length) {
      const placeholder = Number.isInteger(value) ? '' : '<option value="" disabled selected>단원 선택</option>';
      return '<select name="'+name+'" required>' + placeholder + ['시작 전',...book.chapters].map((label,i)=>
        '<option value="'+i+'"'+(i===value?' selected':'')+'>'+esc(i ? i+'단원 · '+label : label)+'</option>').join('') + '</select>';
    }
    return '<input name="'+name+'" type="number" inputmode="numeric" min="0" max="'+max+'" step="1" required value="'+esc(Number.isInteger(value)?value:'')+'">';
  }

  function axisSelect(unit, lock) {
    if (lock) return '<input type="hidden" name="unit" value="'+unit+'">';
    return '<label>기록 단위<select name="unit"><option value="page"'+(unit==='page'?' selected':'')+'>쪽수</option>' +
      '<option value="chapter"'+(unit==='chapter'?' selected':'')+'>단원</option></select></label>';
  }

  function dayField(name, value, max) {
    return '<input type="date" name="'+name+'" value="'+esc(value)+'"'+(max?' max="'+esc(max)+'"':'')+' required>';
  }

  function goalForm(model, draft) {
    const suggested = model.book.suggested || {};
    const base = model.goal || suggested;
    const data = {...base,...draft};
    const unit = data.unit || model.unit;
    const sameUnit = base.unit === unit;
    return '<details class="bp-fold" data-bp-detail="goal"><summary>'+ (model.goal ? '목표 기간·범위 조정' : '목표 기간·범위 설정') + '</summary>' +
      '<form data-bp-form="goal"><p>시작일과 종료일에 각각 어디까지 풀 수 있어야 하는지 정해 주세요. 시작 전이라면 0을 입력해요.</p>' +
      axisSelect(unit,false) + '<div class="bp-grid"><label>목표 시작일' + dayField('startDate',data.startDate || model.day) + '</label>' +
      '<label>목표 종료일' + dayField('endDate',data.endDate || '')+'</label>' +
      '<label>시작 범위 ('+axisLabel(unit)+')'+numberField('startPosition', draft && 'startPosition' in draft ? draft.startPosition : (sameUnit ? base.startPosition : null),unit,model.book)+'</label>' +
      '<label>종료 범위 ('+axisLabel(unit)+')'+numberField('endPosition', draft && 'endPosition' in draft ? draft.endPosition : (sameUnit ? base.endPosition : null),unit,model.book)+'</label></div>' +
      '<button type="submit">목표 저장</button></form></details>';
  }

  function observationForm(model, draft) {
    const {book,goal}=model, unit = draft?.unit || model.unit;
    const when = draft?.date || model.day;
    const saved = (model.observations || []).find(p=>p.date===when);
    const value = draft && 'position' in draft ? draft.position : (unit===model.unit ? saved?.position : null);
    return '<details class="bp-fold" data-bp-detail="observe"'+(!model.pace.latest?' open':'')+'><summary>혼자 풀 수 있는 범위 기록</summary>' +
      '<form data-bp-form="observe"><p>이 교재에서 앞부분부터 건너뛴 범위 없이 혼자 풀 수 있는 마지막 '+axisLabel(unit)+'을 기록해요.</p>' +
      (unit === 'chapter' && !model.pace.latest && book.undatedPosition ? '<p>체크리스트에 '+esc(endpoint(book.undatedPosition,unit,book))+'까지 표시돼 있어요. 확인한 날짜와 범위를 입력해 주세요.</p>' : '') +
      axisSelect(unit,!!goal) + '<div class="bp-grid"><label>확인한 날짜' + dayField('date',when,model.day) + '</label>' +
      '<label>혼자 풀 수 있는 마지막 '+axisLabel(unit)+numberField('position',value,unit,book)+'</label></div>'+
      '<button type="submit">범위 저장</button></form></details>';
  }
  function history(model) {
    const {book,pace,observations,unit} = model;
    if (!pace.points.length) return '';
    const manual = new Set((observations || []).filter(p=>p.manual).map(p=>p.date));
    const rows = [...pace.points].reverse().map(p => '<tr><th scope="row">'+dateText(p.date)+'</th><td>' +
      esc(endpoint(p.position,unit,book))+'<small>' + (manual.has(p.date)?'직접 기록':'체크리스트')+'</small></td><td>' +
      esc(Number.isFinite(p.target) ? endpoint(p.target,unit,book) : '—') + '</td><td>' +
      (manual.has(p.date)?'<button type="button" data-bp-remove="'+esc(p.date)+'" aria-label="'+dateText(p.date)+' 직접 기록 삭제">삭제</button>':'—')+'</td></tr>').join('');
    return '<details class="bp-fold" data-bp-detail="history" data-bp-history><summary>날짜별 교재 기록 보기</summary>' +
      '<table><thead><tr><th scope="col">확인 날짜</th><th scope="col">혼자 풀이</th><th scope="col">당일 목표</th><th scope="col">관리</th></tr></thead><tbody>' + rows + '</tbody></table></details>';
  }

  function markup(model, route = {}, drafts = {}) {
    const {books,book,pace,unit}=model;
    if (!book || !pace) return '<section class="bp-card"><p>현재 사용하는 교재를 로드맵에 등록하면 교재별 진도를 기록할 수 있어요.</p></section>';
    const gap = pace.currentGap;
    let gapText = '';
    if (Number.isFinite(gap)) {
      gapText = Math.abs(gap)<1e-8 ? '오늘 목표와 같은 범위예요.' :
        '오늘 목표보다 ' + distance(gap,unit) + (gap>0?' 앞서 있어요.':' 늦어요.');
      if (Number.isFinite(pace.gapDays) && Math.abs(pace.gapDays)>=1) gapText += ' (약 '+Math.round(Math.abs(pace.gapDays))+'일 차이)';
    }
    const change = direction(pace,unit), estimate = forecast(pace);
    const dated = pace.latest && pace.latest.date !== model.day;
    const source = model.goalSource === 'roadmap'
      ? (book.calendarSource === 'monthly' ? '월별 로드맵에서 추정한 목표 기간' : '로드맵에서 가져온 목표')
      : '설정한 목표';
    return '<section class="bp-card" aria-label="교재 독립풀이 진도"><label class="bp-book">비교할 교재<select data-bp-book>' +
      (books||[]).map(b=>'<option value="'+esc(b.id)+'"'+(b.id===book.id?' selected':'')+'>'+esc(b.title)+'</option>').join('') +
      '</select></label>' + (book.edition ? '<small class="bp-edition">'+esc(book.edition)+'</small>' : '') +
      (gapText?'<p class="bp-gap" data-bp-gap>'+ (dated?'<small>'+dateText(pace.latest.date)+'에 확인한 범위 기준</small>':'') +esc(gapText)+'</p>':'') +
      (change?'<p class="bp-direction" data-bp-direction>'+esc(change)+'</p>':'') +
      '<dl class="bp-readings"><div><dt>오늘 목표 범위</dt><dd>'+esc(endpoint(pace.currentTarget,unit,book))+'</dd></div><div><dt>혼자 풀 수 있는 범위</dt><dd>' +
      esc(endpoint(pace.latest?.position,unit,book))+'</dd>'+(pace.latest?'<small>'+dateText(pace.latest.date)+' 확인</small>':'')+'</div></dl>' +
      graph(model,route) +
      (estimate?'<p class="bp-forecast" data-bp-forecast>'+esc(estimate)+'</p>':'') +
      (pace.actualRate!=null && pace.previous ? '<p class="bp-meta">'+shortDate(pace.previous.date)+' ~ '+shortDate(pace.latest.date)+' · 확인한 속도 주당 '+
        round(pace.actualRate*7)+axisLabel(unit)+(pace.targetRate!=null?' · 같은 기간 목표 주당 '+round(pace.targetRate*7)+axisLabel(unit):'')+'</p>':'') +
      (model.goal ? '<p class="bp-meta">'+source+' · '+dateText(model.goal.startDate)+' ~ '+dateText(model.goal.endDate)+' · '+
        esc(endpoint(model.goal.startPosition,unit,book))+' → '+esc(endpoint(model.goal.endPosition,unit,book))+
        ' · 날짜 사이의 목표는 구간별로 고르게 나눠 계산해요.</p>':'') +
      observationForm(model,drafts.observe) + goalForm(model,drafts.goal) + history(model) +
      '<p role="status" class="bp-status">'+esc(model.message || '')+'</p></section>';
  }

  function readForm(form) {
    const result = Object.fromEntries(new FormData(form));
    for (const key of ['position','startPosition','endPosition']) {
      if (key in result) result[key] = result[key] === '' ? null : Number(result[key]);
    }
    return result;
  }

  function emit(host,name,payload) {
    host.dispatchEvent(new CustomEvent(name,{bubbles:true,detail:payload}));
  }

  function bind(host, state) {
    host.addEventListener('input', event => {
      const form = event.target.closest('form[data-bp-form]');
      if (form) {
        state.drafts[form.dataset.bpForm] = readForm(form);
        if (form.dataset.bpForm === 'goal') {
          form.elements.endDate.setCustomValidity('');
          form.elements.endPosition.setCustomValidity('');
        }
      }
      if (event.target.setCustomValidity) event.target.setCustomValidity('');
    });
    host.addEventListener('change', event => {
      if (event.target.matches('[data-bp-book]')) {
        emit(host,'planner-book-select',{bookId:event.target.value});
        return;
      }
      const form = event.target.closest('form[data-bp-form]');
      if (!form) return;
      const name = form.dataset.bpForm;
      const draft = readForm(form);
      if (event.target.name==='unit') {
        for (const key of ['position','startPosition','endPosition']) {
          if (key in draft) draft[key] = null;
        }
      } else if (name==='observe' && event.target.name==='date') {
        draft.position = draft.unit===state.model.unit ?
          state.model.observations?.find(p=>p.date===draft.date)?.position ?? null : null;
      } else {
        state.drafts[name] = draft;
        return;
      }
      state.drafts[name] = draft;
      render(host,state.model,state.route);
    });
    host.addEventListener('submit', event => {
      const form=event.target.closest('form[data-bp-form]');
      if (!form || !state.model.book) return;
      event.preventDefault();
      const kind=form.dataset.bpForm, data=readForm(form);
      if (kind==='goal') {
        form.elements.endDate.setCustomValidity(data.endDate<=data.startDate?'종료일을 시작일 다음 날짜로 선택해 주세요.':'');
        const valid = Number.isFinite(data.startPosition) && Number.isFinite(data.endPosition) && data.endPosition>data.startPosition;
        form.elements.endPosition.setCustomValidity(valid?'':'종료 범위는 시작 범위보다 뒤에 있어야 해요.');
      }
      if (!form.reportValidity()) return;
      state.drafts[kind]=data;
      state.pending[kind]=data;
      emit(host,kind==='goal'?'planner-book-goal':'planner-book-observe',{bookId:state.model.book.id,...data});
    });
    host.addEventListener('click',event => {
      const button = event.target.closest('[data-bp-remove]');
      if (button) emit(host,'planner-book-remove',{bookId:state.model.book.id,unit:state.model.unit,date:button.dataset.bpRemove});
    });
  }

  function render(host, model, route = {}) {
    if (!host || !model) return;
    let state = stateByHost.get(host);
    if (!state) {
      state={drafts:{},pending:{}};
      stateByHost.set(host,state);
      bind(host,state);
    }
    const sameBook = !!model.book && state.model?.book?.id === model.book.id;
    const focused = host.contains(host.ownerDocument.activeElement) ? host.ownerDocument.activeElement : null;
    const pane = focused?.closest('[data-bp-detail]')?.dataset.bpDetail;
    const opens = new Map(Array.from(host.querySelectorAll('[data-bp-detail]'), d => [d.dataset.bpDetail,d.open]));
    if (!sameBook) { state.drafts={}; state.pending={}; }
    for (const [kind,pending] of Object.entries(state.pending)) {
      const saved = kind==='goal' ? model.goal : (model.observations || []).find(p=>p.manual && p.date===pending.date);
      if (saved && Object.entries(pending).every(([k,v]) => (k==='unit'?saved.unit ?? model.unit:saved[k])===v)) {
        if (state.drafts[kind]===pending) delete state.drafts[kind];
        delete state.pending[kind];
      }
    }
    state.model=model; state.route=route;
    const next = markup(model, route, state.drafts);
    if (next===state.markup && host.querySelector('.bp-card')) return;
    const actor = host.querySelector('.bp-actor');
    const oldPos = actor && {left:actor.style.left,top:actor.style.top};
    const lastUnit = state.unit;
    state.unit = model.unit; state.markup=next;
    host.innerHTML=next;
    const nextActor=host.querySelector('.bp-actor');
    if (sameBook && oldPos && nextActor && lastUnit===model.unit && !g.matchMedia?.('(prefers-reduced-motion: reduce)').matches &&
      (oldPos.left!==nextActor.style.left || oldPos.top!==nextActor.style.top)) {
      nextActor.animate?.([oldPos,{left:nextActor.style.left,top:nextActor.style.top}],{duration:350,easing:'ease-out'});
    }
    if (sameBook) for (const detail of host.querySelectorAll('[data-bp-detail]')) {
      if (opens.has(detail.dataset.bpDetail)) detail.open=opens.get(detail.dataset.bpDetail);
    }
    let restoreFocus;
    if (focused?.hasAttribute('data-bp-book')) restoreFocus=host.querySelector('[data-bp-book]');
    else if (sameBook && pane) {
      const detail=host.querySelector('[data-bp-detail="'+pane+'"]');
      restoreFocus = focused?.name ? detail?.querySelector('[name="'+focused.name+'"]') :
        focused?.matches('[type=submit]') ? detail?.querySelector('[type=submit]') : detail?.querySelector('summary');
    }
    restoreFocus?.focus({preventScroll:true});
  }

  g.PlannerBookPaceView=Object.freeze({render,markup});
})(typeof window === 'object' ? window : globalThis);
