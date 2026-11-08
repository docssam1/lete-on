(function (g) {
  'use strict';

  const labels = { curriculum: '교과', arithmetic: '연산', thinking: '사고력' };
  const model = g.PlannerWeeklyModel;
  const tracks = model.TRACKS;
  const mounted = new WeakMap();
  const formatDate = new Intl.DateTimeFormat('ko-KR', {
    month: 'long', day: 'numeric', weekday: 'short', timeZone: 'UTC'
  });
  const escape = value => String(value ?? '').replace(/[&<>"']/g, ch => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
  ));
  const dayLabel = day => formatDate.format(new Date(day + 'T00:00:00Z'));
  const mapTracks = fn => Object.fromEntries(tracks.map(key => [key, fn(key)]));
  const slots = count => count + '회';

  function sessionInput(name, label, value, max, caption) {
    return `<label class="wk-field"><span>${caption || escape(label)}</span>
      <span class="wk-input-unit"><input name="${name}" type="number" inputmode="numeric" required
        min="0" max="${max}" step="1" value="${escape(value)}" aria-label="${escape(label)}"><span aria-hidden="true">회</span></span></label>`;
  }

  function setupForm({ defaults = {}, materials = {} }, day, state) {
    const targets = state ? state.initialTargets : defaults;
    return `<form class="wk-form" data-wk-form="start">
      <p>첫 공부 날짜와 일주일에 공부할 횟수를 정하세요. 시작 7일 뒤부터 같은 요일에 점검합니다.</p>
      <label class="wk-field wk-date"><span>학습 시작일</span><input type="date" name="startDate" required
        min="2000-01-01" max="2199-12-31" value="${escape(state?.startDate || day)}"></label>
      <p class="wk-date-hint wk-note">첫 점검일 · ${dayLabel(model.addDays(state?.startDate || day, 7))}</p>
      <fieldset><legend>영역별 주간 목표</legend>
        <div class="wk-grid">${tracks.map(key => `<div>
          ${sessionInput('target-' + key, labels[key] + ' 주간 목표', targets[key], model.MAX_TARGET, labels[key])}
          ${materials[key] ? `<small>${escape(materials[key])}</small>` : ''}</div>`).join('')}</div></fieldset>
      <p class="wk-note">쉬는 영역은 0회를 입력하세요. 한 번 공부할 때의 분량은 아이가 사용 중인 교재를 기준으로 잡으면 됩니다.</p>
      <div class="wk-actions"><button class="wk-primary" type="submit">${state ? '시작일·목표 저장' : '주간 점검 시작'}</button>
        ${state ? '<button class="wk-secondary" type="button" data-wk-action="cancel">취소</button>' : ''}</div>
    </form>`;
  }

  function activePlan(info, materials = {}) {
    return `<div class="wk-plan">
      <h3>${info.phase === 'scheduled' ? '첫 주 계획' : '이번 주 계획'} <small>${dayLabel(info.weekStart)} ~ ${dayLabel(info.weekEnd)}</small></h3>
      <div class="wk-grid">${tracks.map(key => {
        const count = info.targets[key], carry = info.carry[key], later = info.backlog[key] - carry;
        return `<div class="wk-tile"><span>${labels[key]}</span><strong>${count ? slots(count) : '쉬는 주'}</strong>
          ${carry ? `<small>남은 공부 ${slots(carry)} 먼저 · 새 공부 ${slots(count - carry)}</small>` : ''}
          ${later > 0 ? `<small>이후에 이어갈 분량 ${slots(later)}</small>` : ''}
          ${materials[key] ? `<small>${escape(materials[key])}</small>` : ''}</div>`;
      }).join('')}</div></div>`;
  }

  function reviewForm(info) {
    const skipped = info.skippedWeeks ? `<p class="wk-note">그전에 점검하지 않은 ${info.skippedWeeks}주는 미기록으로 남습니다.</p>` : '';
    return `<form class="wk-form" data-wk-form="review" data-due="${escape(info.dueDate)}">
      <h3>${dayLabel(info.weekStart)} ~ ${dayLabel(info.weekEnd)} 학습 점검</h3>
      <p>실제로 공부한 횟수를 적고, ${dayLabel(info.liveWeekStart)}부터 실천할 목표를 정하세요.</p>${skipped}
      <div class="wk-review-rows">${tracks.map(key => {
        const count = info.targets[key];
        return `<div class="wk-review-row"><div><strong>${labels[key]}</strong><small>목표 ${slots(count)}</small></div>
          ${sessionInput('done-' + key, labels[key] + ' 실제 공부 횟수', count > 0 ? '' : 0, model.MAX_COMPLETED, '실제 공부')}
          ${sessionInput('next-' + key, labels[key] + ' 다음 주 목표', count, model.MAX_TARGET, '다음 목표')}</div>`;
      }).join('')}</div>
      <p class="wk-note">못 한 영역은 실제 공부에 0을 입력하세요. 다음 목표를 줄이면 남은 공부부터 그 횟수 안에서 이어갑니다.</p>
      <button class="wk-secondary" type="button" data-wk-action="suggest">실제 횟수에 맞춰 목표 줄이기</button>
      <div class="wk-preview" aria-live="polite" aria-atomic="true"></div>
      <div class="wk-actions"><button type="submit" class="wk-primary">점검 저장하고 속도 적용</button></div></form>`;
  }

  function historyList(state) {
    if (!state.history.length) return '';
    return `<details class="wk-history"><summary>최근 점검 ${state.history.length}건</summary>
      <ol>${state.history.slice().reverse().map(row => `<li><strong>${escape(row.dueDate)} 점검</strong>${row.recordedOn !== row.dueDate ? ` <small>${escape(row.recordedOn)}에 기록</small>` : ''}
        <ul>${tracks.map(key => `<li>${labels[key]} · 실제 ${slots(row.completed[key])} / 목표 ${slots(row.targets[key])} · 다음 목표 ${slots(row.nextTargets[key])}</li>`).join('')}</ul>
      </li>`).join('')}</ol></details>`;
  }

  function build(ctx, info, day) {
    const state = ctx.state;
    const due = info?.phase === 'due';
    const summary = !info ? '학습 시작일 설정' : due ? dayLabel(info.dueDate) + ' 점검할 차례' : dayLabel(info.dueDate) + ' 점검 예정';
    const actions = state && !ctx.editing ? `<div class="wk-tools">
        ${ctx.onCalendar ? '<button type="button" class="wk-secondary" data-wk-action="calendar">캘린더에 주간 알림 추가</button>' : ''}
        ${!state.history.length && !state.prior ? '<button type="button" class="wk-edit" data-wk-action="edit">시작일·목표 수정</button>' : ''}</div>
      ${ctx.onCalendar ? '<p class="wk-note">받은 일정 파일을 캘린더 앱에 추가하고 알림을 허용하세요. 매주 점검일 저녁 7시(한국 시간)에 알려줍니다. 시작일을 바꾸면 일정을 다시 추가하세요. 알림 변경·삭제는 캘린더에서 할 수 있어요.</p>' : ''}` : '';
    const body = !state || ctx.editing ? setupForm(ctx, day, state) : (due ? reviewForm(info) : activePlan(info, ctx.materials));
    return `<details class="wk-panel"><summary class="wk-summary">
      <span class="wk-title">주간 학습 점검</span><span class="wk-summary-date">${summary}</span>
      <span class="wk-chevron" aria-hidden="true">⌄</span></summary>
      <div class="wk-body">${body}${actions}${state && !ctx.editing ? historyList(state) : ''}
      <p class="wk-status" role="status" aria-live="polite"></p></div></details>`;
  }

  function readCounts(form, prefix) {
    return mapTracks(key => form.elements.namedItem(prefix + '-' + key).valueAsNumber);
  }

  function reviewInput(form) {
    return { dueDate: form.dataset.due, completed: readCounts(form, 'done'), nextTargets: readCounts(form, 'next') };
  }

  function refreshPreview(host) {
    const ctx = mounted.get(host), form = host.querySelector('[data-wk-form="review"]');
    if (!form) return;
    const preview = form.querySelector('.wk-preview');
    if (Array.from(form.querySelectorAll('input')).some(input => !input.validity.valid)) {
      preview.textContent = '';
      return;
    }
    const day = model.today();
    const updated = model.review(ctx.state, reviewInput(form), day);
    const info = model.view(updated, day);
    if (!info || info.phase !== 'active') { preview.textContent = ''; return; }
    preview.innerHTML = `<strong>적용할 주간 계획 · ${dayLabel(info.weekStart)} ~ ${dayLabel(info.weekEnd)}</strong>
      <ul>${tracks.map(key => {
        const carry = info.carry[key], total = info.targets[key], later = info.backlog[key] - carry;
        const part = carry ? `남은 공부 ${slots(carry)} 먼저 · 새 공부 ${slots(total - carry)}` : total ? '새 공부 ' + slots(total) : '쉬는 주';
        return `<li>${labels[key]} · ${part}${later > 0 ? ' · 이후에 ' + slots(later) + ' 이어가기' : ''}</li>`;
      }).join('')}</ul>`;
  }

  function message(host, text) {
    const status = host.querySelector('.wk-status');
    if (status) status.textContent = text;
  }

  function draw(host, force = false) {
    const ctx = mounted.get(host), day = model.today();
    const info = ctx.state ? model.view(ctx.state, day) : null;
    const phase = info?.phase || 'setup';
    const previousPhase = host.dataset.weeklyPhase;
    const changedPhase = previousPhase !== phase || host.dataset.weeklyDue !== (info?.dueDate || '');
    const newlyDue = changedPhase && phase === 'due';
    if (newlyDue) ctx.editing = false;
    const signature = JSON.stringify([ctx.state, ctx.editing, info?.dueDate, phase,
      ctx.state ? null : ctx.defaults, info?.phase === 'due' ? null : ctx.materials]);
    if (!force && signature === ctx.signature) return;
    const prior = host.querySelector('.wk-panel');
    const open = prior?.open || newlyDue;
    host.dataset.weeklyPhase = phase;
    host.dataset.weeklyDue = info?.dueDate || '';
    host.innerHTML = build(ctx, info, day);
    host.querySelector('.wk-panel').open = Boolean(open);
    ctx.signature = signature;
    if (changedPhase) ctx.onPhaseChange?.(info);
  }

  async function handleSubmit(event, host) {
    const form = event.target.closest('form[data-wk-form]');
    if (!form) return;
    event.preventDefault();
    const ctx = mounted.get(host), day = model.today();
    if (ctx.saving) return;
    const initial = form.dataset.wkForm === 'start';
    let updated;
    if (initial) {
      updated = model.start(form.elements.namedItem('startDate').value, readCounts(form, 'target'));
      if (!updated) { message(host, '학습 시작일과 영역별 목표 횟수를 확인해 주세요.'); return; }
    } else {
      const current = model.view(ctx.state, day);
      if (current?.phase !== 'due' || current.dueDate !== form.dataset.due) {
        draw(host, true);
        message(host, '점검 주간이 바뀌었어요. 표시된 날짜를 확인해 주세요.');
        return;
      }
      updated = model.review(ctx.state, reviewInput(form), day);
      if (!updated || updated.history.at(-1)?.dueDate !== form.dataset.due) {
        message(host, '각 영역에 실제 공부 횟수와 다음 주 목표를 입력해 주세요.'); return;
      }
    }
    const submit = form.querySelector('[type="submit"]');
    ctx.saving = true;
    submit.disabled = true;
    form.setAttribute('aria-busy', 'true');
    try {
      await ctx.onChange(updated);
      ctx.editing = false;
      ctx.state = updated;
      draw(host);
      const panel = host.querySelector('.wk-panel');
      panel.open = true;
      panel.querySelector('.wk-summary').focus();
      message(host, initial ? '학습 시작일과 첫 주 목표를 저장했어요.' : '점검을 저장했어요. 조절한 속도가 이번 주 계획에 반영됐어요.');
    } catch (error) {
      host.querySelector('.wk-panel').open = true;
      message(host, error?.message || '점검을 저장하지 못했어요. 현재 계획을 확인하고 다시 시도해 주세요.');
    } finally {
      ctx.saving = false;
      submit.disabled = false;
      form.removeAttribute('aria-busy');
    }
  }

  function handleAction(event, host) {
    const button = event.target.closest('[data-wk-action]');
    if (!button) return;
    const ctx = mounted.get(host);
    if (button.dataset.wkAction === 'suggest') {
      const form = button.form;
      for (const key of tracks) {
        if (!form.elements.namedItem('done-' + key).reportValidity()) return;
      }
      const info = model.view(ctx.state);
      if (info?.phase !== 'due' || form.dataset.due !== info.dueDate) {
        draw(host, true);
        message(host, '점검 주간이 바뀌었어요. 표시된 날짜를 확인해 주세요.');
        return;
      }
      const next = model.suggest(info.targets, readCounts(form, 'done'));
      if (!next) return;
      for (const key of tracks) form.elements.namedItem('next-' + key).value = next[key];
      refreshPreview(host);
      message(host, '목표를 채우지 못한 영역은 실제 횟수로 줄였어요. 공부를 한 번도 못 한 영역은 주 1회부터 다시 시작하고, 한 주 쉬려면 0회로 바꾸세요.');
      return;
    }
    if (button.dataset.wkAction === 'calendar') {
      const day = model.today(), info = model.view(ctx.state, day);
      const upcoming = Date.parse(info.dueDate + 'T19:00:00+09:00') > Date.now();
      const date = upcoming ? info.dueDate : info.nextDueDate;
      try {
        ctx.onCalendar?.(date);
        message(host, dayLabel(date) + '부터 반복되는 일정 파일을 캘린더 앱에서 열어 추가하세요.');
      } catch {
        message(host, '일정 파일을 받지 못했어요. 다시 시도해 주세요.');
      }
      return;
    }
    ctx.editing = button.dataset.wkAction === 'edit';
    draw(host, true);
    (host.querySelector('input[name="startDate"]') || host.querySelector('.wk-summary')).focus();
  }

  let clock, clockHost;
  function refreshOnDayChange() {
    if (!clockHost) return;
    if (clockHost.isConnected) { draw(clockHost); g.PlannerUnitPlanner?.refresh(); }
    g.clearTimeout(clock);
    const midnight = Date.parse(model.today() + 'T00:00:00+09:00') + 86400000;
    clock = g.setTimeout(refreshOnDayChange, Math.max(1000, midnight - Date.now() + 200));
  }

  function render(host, options) {
    if (!host) return;
    if (!mounted.has(host)) {
      mounted.set(host, { editing: false });
      host.addEventListener('input', event => {
        const field = event.target;
        if (field.name === 'startDate') {
          const hint = field.form.querySelector('.wk-date-hint');
          hint.textContent = field.validity.valid ? '첫 점검일 · ' + dayLabel(model.addDays(field.value, 7)) : '';
        } else refreshPreview(host);
      });
      host.addEventListener('click', event => handleAction(event, host));
      host.addEventListener('submit', event => handleSubmit(event, host));
      if (!clockHost) {
        g.addEventListener('focus', refreshOnDayChange);
        document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshOnDayChange(); });
      }
    }
    const ctx = mounted.get(host), state = model.restore(options.state);
    if (ctx.state?.startDate !== state?.startDate || state?.history.length) ctx.editing = false;
    Object.assign(ctx, options, { state });
    draw(host);
    if (clockHost !== host) { clockHost = host; refreshOnDayChange(); }
  }

  function open(host) {
    const panel = host?.querySelector('.wk-panel');
    if (!panel) return;
    panel.open = true;
    panel.querySelector('.wk-summary').focus();
  }
  g.PlannerWeeklyView = Object.freeze({ render, open });
})(window);
