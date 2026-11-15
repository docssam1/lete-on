/* Personal route and item-level study marks. Persistence belongs to the planner. */
(function (g) {
  'use strict';

  const mounted = new WeakSet();
  const checkLabels = { studied: '공부했어요', solo: '혼자 풀 수 있어요' };
  const tracks = { curriculum: '교과', arithmetic: '연산', thinking: '사고력' };
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]
  ));
  const dateFormatter = new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric', timeZone: 'UTC' });

  function dateLabel(day, offset = 0) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return '';
    const date = new Date(day + 'T00:00:00Z');
    if (isNaN(date.valueOf())) return '';
    date.setUTCDate(date.getUTCDate() + offset);
    return dateFormatter.format(date);
  }

  function weekLabel(start) {
    return dateLabel(start) ? dateLabel(start) + ' ~ ' + dateLabel(start, 6) : '';
  }

  function student(route, percent) {
    const visual = g.PlannerStudentVisual;
    if (!visual) return '';
    const stage = visual.stage(route) ?? 2;
    const figure = route.gender === 'boy' || route.gender === 'girl' ? visual.figure(stage, route.gender) : visual.pair(stage);
    return `<span class="uc-stride" aria-hidden="true"><span class="uc-stride-run"><span class="uc-student" data-uc-percent="${percent}" style="left:${percent}%">${figure}</span></span></span>`;
  }

  function routeMap(route = {}, rows, weekStart) {
    const stages = Array.isArray(route.stages) ? route.stages : [];
    const current = stages.find(stage => stage.current);
    const solo = rows.filter(row => row.solo).length;
    const percent = rows.length ? Math.round(solo / rows.length * 100) : 0;
    return `<section data-uc-week="${escape(weekStart)}" class="uc-route" aria-label="우리 아이의 전체 경로"><div class="uc-heading"><h2>우리 아이의 전체 경로</h2>
        <small>${route.goalTitle ? escape(route.goalTitle) + ' · ' : ''}수학 교과 경로</small></div>
      <div class="uc-route-caption">${route.currentLabel ? `<span>${escape(route.currentLabel)}</span>` : ''}
        ${route.nextCourse ? `<span>다음 과정 <strong>${escape(route.nextCourse)}</strong></span>` : ''}</div>
      ${stages.length ? `<ol class="uc-road" aria-label="학습 단계">${stages.map(stage => `<li data-stage-id="${escape(stage.id)}"${stage === current ? ' aria-current="step"' : ''}>
        ${stage === current ? student(route, percent) : ''}<span class="uc-node" aria-hidden="true"></span>
        <span class="uc-stop-name">${stage === current ? '<b>현재 위치</b>' : ''}${escape(stage.title)}</span></li>`).join('')}</ol>` : ''}
      ${rows.length ? `<p class="uc-progress">이번 주 혼자 풀 수 있는 항목 <strong>${solo} / ${rows.length}</strong>${current ? '<span>체크할 때마다 현재 단계 안에서 캐릭터가 움직여요.</span>' : ''}</p>` : ''}</section>`;
  }

  function questionLink(value) {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && /(^|\.)ebsi\.co\.kr$/.test(url.hostname) ? url.href : '';
    } catch { return ''; }
  }

  function checkbox(row, key, disabled) {
    return `<label class="uc-check"><input type="checkbox" data-uc-field="${key}" data-uc-id="${escape(row.id)}" aria-label="${escape(row.title + ' ' + (row.unitLabel || '') + ' · ' + checkLabels[key])}"${row[key] ? ' checked' : ''}${disabled ? ' disabled' : ''}><span>${checkLabels[key]}</span></label>`;
  }

  function taskRow(row, disabled) {
    const detail = row.detail && row.detail !== row.unitLabel ? row.detail : '';
    const unit = detail.includes(row.unitLabel) ? '' : row.unitLabel;
    const when = row.kind === 'mock' && g.PlannerMockSchedule ? g.PlannerMockSchedule.approxDate(row.date) : dateLabel(row.date);
    const meta = [row.kind === 'book' ? tracks[row.track] : '', unit, when].filter(Boolean);
    const url = row.kind === 'mock' ? questionLink(row.url) : '';
    return `<li class="uc-task" data-uc-kind="${row.kind === 'mock' ? 'mock' : 'book'}" data-uc-row="${escape(row.id)}">
      <div class="uc-task-copy">${meta.length ? `<small>${escape(meta.join(' · '))}</small>` : ''}<strong>${escape(row.title)}</strong>
        ${detail ? `<p>${escape(detail)}</p>` : ''}${url ? `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">기출 원문 열기<span class="uc-aria"> (새 창)</span></a>` : ''}</div>
      <div class="uc-marks">${checkbox(row, 'studied', disabled)}${checkbox(row, 'solo', disabled)}</div></li>`;
  }

  function group(title, rows, key, disabled) {
    if (!rows.length) return '';
    const initialCount = 4;
    const others = rows.slice(initialCount);
    return `<section class="uc-group" aria-label="${title}"><h4>${title} <small>${rows.length}개</small></h4>
      <ul class="uc-tasks">${rows.slice(0,initialCount).map(row => taskRow(row, disabled)).join('')}</ul>
      ${others.length ? `<details class="uc-more" data-uc-details="${key}"><summary>나머지 ${others.length}개 보기</summary>
        <ul class="uc-tasks">${others.map(row => taskRow(row, disabled)).join('')}</ul></details>` : ''}</section>`;
  }

  function manualForm(books, disabled) {
    if (!books?.length || disabled) return '';
    const range = books[0].range || '';
    return `<form class="uc-range-form" data-uc-manual><strong>내 교재 범위 지정</strong><div class="uc-range-fields">
      <label>교재<select name="bookId" required>${books.map(book => `<option value="${escape(book.id)}" data-uc-saved="${escape(book.range)}">${escape(book.title)}</option>`).join('')}</select></label>
      <label>이번 주 단원·쪽수<input name="range" type="text"${range ? '' : ' required'} maxlength="120" value="${escape(range)}" placeholder="예) 소인수분해 12~17쪽"></label>
      <button type="submit">범위 저장</button></div><small class="uc-range-help"${range ? '' : ' hidden'}>범위를 비우고 저장하면 자동 추천으로 돌아갑니다.</small></form>`;
  }

  function practiceTask(item) {
    const url = item.kind === 'mock' ? questionLink(item.url) : '';
    return `<li><strong>${escape(item.title)}</strong>${item.detail ? `<span>${escape(item.detail)}</span>` : ''}
      ${url ? `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">재점검 기출 원문 열기<span class="uc-aria"> (새 창)</span></a>` : ''}</li>`;
  }

  function reviews(groups, nextWeekStart) {
    return `<section class="uc-review" aria-label="다음 주 보완 일정"><div class="uc-heading"><h3>다음 주 보완 일정</h3><small>${escape(weekLabel(nextWeekStart))}</small></div>
      ${groups.length ? `<ul>${groups.map(entry => `<li><strong>${escape(entry.unitLabel || entry.items[0]?.unitLabel || entry.items[0]?.title)}</strong>
        ${entry.practice?.length ? `<ul class="uc-practice">${entry.practice.map(practiceTask).join('')}</ul>` :
          `<span>${escape(entry.items.map(item => [item.title, item.detail].filter(Boolean).join(' · ')).join(' / '))}</span>`}</li>`).join('')}</ul>` : '<p>공부한 항목에서 ‘혼자 풀 수 있어요’가 비어 있으면 다음 주에 다시 풀도록 여기에 담겨요.</p>'}</section>`;
  }

  function checklist(model) {
    const rows = model.rows || [];
    const isReview = row => row.review || row.reviewOf?.length;
    const reviewRows = rows.filter(row => isReview(row) && !row.counselId);
    const otherRows = rows.filter(row => !isReview(row) && !row.counselId);
    const upcoming = model.counselUpcoming || [];
    const notices = (model.notices || []).filter(Boolean);
    return `<section class="uc-week" aria-label="이번 주 체크리스트"><div class="uc-heading"><h3>이번 주 체크리스트</h3><small>${escape(weekLabel(model.weekStart))}</small></div>
      ${group('상담에서 정한 공부',rows.filter(row=>row.counselId),'counsel',model.readOnly)}${group('다시 풀 단원',reviewRows,'review',model.readOnly)}${group('교재 범위',otherRows.filter(row => row.kind === 'book'),'book',model.readOnly)}${group('기출 문항',otherRows.filter(row => row.kind === 'mock'),'mock',model.readOnly)}
      ${!rows.length && !notices.length ? '<p class="uc-note">학습 시작일과 사용 중인 교재를 확인하면 이번 주 공부할 범위를 정할 수 있어요.</p>' : ''}
      ${notices.length ? `<ul class="uc-notices">${notices.map(note => `<li>${escape(note)}</li>`).join('')}</ul>` : ''}
      ${manualForm(model.manualBooks,model.readOnly)}</section>${reviews(model.nextReview || [], model.nextWeekStart)}
      ${upcoming.length ? '<section class="uc-review"><h3>예정된 상담 학습</h3><ul>'+upcoming.map(task=>'<li><strong>'+escape(task.date+' · '+task.title)+'</strong><span>'+escape(task.detail)+'</span></li>').join('')+'</ul></section>' : ''}`;
  }

  function markup(model) {
    return `<div class="unit-checklist">${routeMap(model.route,model.rows || [],model.weekStart)}
      <div data-weekly-trend></div><div data-uc-work>${checklist(model)}</div></div>`;
  }

  function emit(host, name, detail) {
    host.dispatchEvent(new CustomEvent(name, { detail, bubbles: true }));
  }

  function showRange(form, value) {
    const input = form.elements.range;
    const saved = form.elements.bookId.selectedOptions[0]?.dataset.ucSaved || '';
    input.value = value ?? saved;
    input.required = !saved;
    input.setCustomValidity('');
    form.querySelector('.uc-range-help').hidden = !saved;
  }

  function bind(host) {
    host.addEventListener('change', event => {
      if (event.target.matches('select[name=bookId]') && event.target.form?.hasAttribute('data-uc-manual')) {
        showRange(event.target.form);
        return;
      }
      const input = event.target.closest('input[data-uc-field]');
      if (input && !input.disabled) emit(host, 'planner-unit-change', { id: input.dataset.ucId, field: input.dataset.ucField, value: input.checked });
    });
    host.addEventListener('submit', event => {
      const form = event.target.closest('form[data-uc-manual]');
      if (!form) return;
      event.preventDefault();
      const field = form.elements.range;
      const range = field.value.trim();
      field.setCustomValidity(range || !field.required ? '' : '공부할 단원이나 쪽수를 적어 주세요.');
      if (form.reportValidity()) emit(host, 'planner-unit-range', { bookId: form.elements.bookId.value, range });
    });
    host.addEventListener('input', event => {
      if (event.target.matches('.uc-range-form input')) event.target.setCustomValidity('');
    });
    mounted.add(host);
  }

  function moveWithinStage(previous, area, weekStart) {
    if (!previous || !weekStart || previous.week !== weekStart || g.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const current = area.querySelector('.uc-road [aria-current=step]');
    const marker = current?.querySelector('.uc-student');
    if (!marker || current.dataset.stageId !== previous.stage || marker.dataset.ucPercent === previous.percent) return;
    marker.animate?.([{left: previous.percent + '%'}, {left: marker.dataset.ucPercent + '%'}], {duration: 350, easing: 'ease-out'});
  }

  function render(host, model) {
    if (!host || !model) return;
    const active = host.ownerDocument.activeElement;
    const focusedCheck = host.contains(active) && active.dataset.ucField ? { id: active.dataset.ucId, field: active.dataset.ucField } : null;
    const open = new Set(Array.from(host.querySelectorAll('details[data-uc-details][open]'), node => node.dataset.ucDetails));
    const area = host.querySelector(':scope > [data-uc-area]') || host.appendChild(host.ownerDocument.createElement('div'));
    area.dataset.ucArea = '';
    const oldWeek = area.querySelector('.uc-route')?.dataset.ucWeek;
    const oldForm = area.querySelector('[data-uc-manual]');
    const draft = oldForm && oldWeek === model.weekStart ? {
      bookId: oldForm.elements.bookId.value,
      value: oldForm.elements.range.value,
      wasSaved: oldForm.elements.bookId.selectedOptions[0]?.dataset.ucSaved || '',
      focus: oldForm.contains(active) ? active.name || 'submit' : null,
      cursor: oldForm.elements.range.selectionStart
    } : null;
    const oldStage = area.querySelector('.uc-road [aria-current=step]');
    const oldMarker = oldStage?.querySelector('.uc-student');
    const previous = oldMarker && { stage: oldStage.dataset.stageId, percent: oldMarker.dataset.ucPercent, week: area.querySelector('.uc-route').dataset.ucWeek };
    const routeSection = area.querySelector('.uc-route');
    if (routeSection) {
      routeSection.outerHTML = routeMap(model.route,model.rows || [],model.weekStart);
      area.querySelector('[data-uc-work]').innerHTML = checklist(model);
    } else {
      area.innerHTML = markup(model);
    }
    moveWithinStage(previous, area, model.weekStart);
    const form = area.querySelector('[data-uc-manual]');
    if (draft && form && Array.from(form.elements.bookId.options).some(option => option.value === draft.bookId)) {
      form.elements.bookId.value = draft.bookId;
      // Keep a student's typing across background refreshes; accept an updated
      // saved range when the field had not been edited in this tab.
      showRange(form, draft.wasSaved === draft.value ? undefined : draft.value);
      if (draft.focus) {
        const field = draft.focus === 'submit' ? form.querySelector('[type=submit]') : form.elements[draft.focus];
        field?.focus({preventScroll:true});
        if (draft.focus === 'range' && draft.cursor !== null) field.setSelectionRange(draft.cursor,draft.cursor);
      }
    }
    for (const node of area.querySelectorAll('details[data-uc-details]')) node.open = open.has(node.dataset.ucDetails);
    if (focusedCheck) {
      const next = Array.from(area.querySelectorAll('[data-uc-field]')).find(input => input.dataset.ucId === focusedCheck.id && input.dataset.ucField === focusedCheck.field);
      if (next) next.focus({preventScroll: true});
    }
    const status = host.querySelector(':scope > [data-uc-status]') || host.appendChild(host.ownerDocument.createElement('p'));
    status.className = 'uc-status';
    status.dataset.ucStatus = '';
    status.setAttribute('role','status');
    const message = model.message || '';
    if (status.textContent !== message) status.textContent = message;
    if (!mounted.has(host)) bind(host);
  }

  g.PlannerUnitChecklistView = Object.freeze({render, markup, checklist});
})(typeof window === 'object' ? window : globalThis);
