// Student marking sheet. The planner owns account storage, graph refresh and calendar updates.
(function (g) {
  'use strict';

  const views = new WeakMap();
  const indexes = new WeakMap();
  const labels = {m: '중', h: '상', x: '최상'};
  const marks = ['O', 'X'];
  const legacy = {assisted: '도움받음', pending: '판정 대기', unlearned: '미학습'};
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => (
    {'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]
  ));
  const dateFormat = new Intl.DateTimeFormat('ko-KR', {year:'numeric', month:'long', day:'numeric', weekday:'short', timeZone:'UTC'});
  const dateLabel = day => dateFormat.format(new Date(day + 'T00:00:00Z'));
  const option = (value, label, selected) => `<option value="${escape(value)}"${value === selected ? ' selected' : ''}>${escape(label)}</option>`;
  const setLabel = set => set === 's' ? '지필드 추가 연습' : labels[set] + ' 세트';
  const paperName = (unit, set) => `초${unit.semester} · ${unit.number}단원 ${unit.title} · ${setLabel(set)}`;

  function index(catalog) {
    if (indexes.has(catalog)) return indexes.get(catalog);
    const units = new Map(), items = new Map(), semesters = new Set();
    for (const unit of catalog.units) {
      units.set(unit.id, unit);
      semesters.add(unit.semester);
      for (const [set, questions] of Object.entries(unit.sets)) {
        for (const question of questions) {
          const id = g.PlannerOxModel.itemId(unit, set, question.number);
          items.set(id, {id, unit, set, number:question.number, type:unit.types[question.typeId]});
        }
      }
      for (const exercise of unit.supplements || []) {
        const number = Number(exercise.typeId.slice(1));
        const id = g.PlannerOxModel.itemId(unit, 's', number);
        items.set(id, {id, unit, set:'s', number, type:unit.types[exercise.typeId], exercise});
      }
    }
    const result = {units, items, semesters:[...semesters]};
    indexes.set(catalog, result);
    return result;
  }

  function resume(view) {
    let lastDay = '', lastItem;
    for (const [id, entry] of Object.entries(view.model.marks)) {
      if (!entry.mark || entry.phase !== 'initial' || entry.date < lastDay || !view.index.items.has(id)) continue;
      lastDay = entry.date;
      lastItem = view.index.items.get(id);
    }
    const preferred = String(view.props.semester || '').replace(/^초\s*/, '');
    const unit = lastItem?.unit || view.index.units.get(view.props.unitId) ||
      view.props.catalog.units.find(item => item.semester === preferred) || view.props.catalog.units[0];
    view.unit = unit;
    view.set = lastItem?.set || 'm';
  }

  function paperLink(unit, set) {
    if (!labels[set] || !g.PlannerOxPaper?.open) return '';
    return `<button type="button" class="ox-paper" data-ox-paper="${escape(unit.id)}" data-ox-set="${set}"
      aria-label="${escape(paperName(unit,set))} 문제지 열기">내 문제지 열기</button>`;
  }

  function controls(view, item, record, kind) {
    const pending = view.pending.get(item.id);
    const value = pending || record?.mark;
    return `<span class="ox-pair" role="group" aria-label="${item.number}번 ${kind === 'recheck' ? '재점검' : '첫 평가'}">${marks.map(mark => {
      const detail = mark === 'O' ? '혼자 맞혔어요' : '다시 연습해요';
      return `<button type="button" data-ox-item="${escape(item.id)}" data-ox-mark="${mark}" data-ox-kind="${kind}"
        aria-label="${escape(paperName(item.unit, item.set))} ${item.number}번 ${mark} ${detail}"
        aria-pressed="${value === mark}"${pending ? ' aria-disabled="true"' : ''}>${mark}</button>`;
    }).join('')}</span>`;
  }

  function sheet(view) {
    const {unit, set} = view;
    const questions = unit.sets[set];
    const status = view.model.marks;
    const items = questions.map(q => view.index.items.get(g.PlannerOxModel.itemId(unit, set, q.number)));
    const completed = items.filter(item => status[item.id]?.mark);
    const reserved = new Map(view.model.tasks.filter(t => t.itemId).map(t => [t.itemId, t]));
    const semesterSelect = view.index.semesters.map(s => option(s, s.replace('-', '학년 ') + '학기', unit.semester)).join('');
    const unitSelect = view.props.catalog.units.filter(u => u.semester === unit.semester)
      .map(u => option(u.id, u.number + '단원 ' + u.title, unit.id)).join('');
    const hasReserved = items.some(item=>reserved.has(item.id));
    const setSelect = Object.keys(unit.sets).map(s => option(s, labels[s] + ' 세트', set)).join('');
    return `<div class="ox-selectors">
      <label>학기<select data-ox-filter="semester">${semesterSelect}</select></label>
      <label class="ox-unit">단원<select data-ox-filter="unit">${unitSelect}</select></label>
      <label>난이도<select data-ox-filter="set">${setSelect}</select></label>
      </div>
      <div class="ox-sheet-heading"><h4>${escape(paperName(unit,set))}</h4>${paperLink(unit,set)}</div>
      <p class="ox-guide">푼 문제의 번호를 찾아 눌러요. 혼자 맞혔으면 <b>O</b>, 틀리거나 도움받았으면 <b>X</b>예요.</p>
      ${hasReserved ? '<p class="ox-guide">재점검할 문제는 <button class="ox-see" type="button" data-ox-show-queue>보완 일정</button>에서 기록해요. 이 화면에서 먼저 풀고 표시하면 다른 재점검 문항을 찾아요.</p>' : ''}
      <div class="ox-count"><strong>${completed.length} / ${items.length}문항 기록</strong><span>O ${completed.filter(i=>status[i.id].mark === 'O').length}개 · X ${completed.filter(i=>status[i.id].mark === 'X').length}개</span></div>
      <ol class="ox-sheet" aria-label="문항별 O·X 기록">${items.map(item => {
        const rec = status[item.id];
        const task = reserved.get(item.id);
        const note = task ? '재점검 예정' : rec?.phase === 'recheck' ? '재점검 기록' : legacy[rec?.outcome];
        return `<li data-ox-number="${item.number}"><div><strong>${item.number}번</strong>${note ? `<small>${note}</small>` : ''}</div>
          ${controls(view,item,rec,rec?.phase === 'recheck' ? 'recheck' : 'initial')}</li>`;
      }).join('')}</ol>`;
  }

  function sourceText(view, ids) {
    const sets = new Map();
    for (const id of ids) {
      const item = view.index.items.get(id);
      if (!item) continue;
      if (!sets.has(item.set)) sets.set(item.set, []);
      sets.get(item.set).push(item.number);
    }
    return [...sets].map(([set, numbers]) => `${setLabel(set)} ${numbers.join('·')}번`).join(', ');
  }

  function exerciseBody(item) {
    if (!item.exercise) return '';
    return `<div class="ox-exercise" data-ox-exercise="${escape(item.id)}"><p>${escape(item.exercise.prompt)}</p>
      <details><summary>풀이 확인</summary><p>${escape(item.exercise.check)}</p></details></div>`;
  }

  function taskRow(view, task) {
    const unit = view.index.units.get(task.unitId);
    if (!unit) return '';
    const source = sourceText(view, task.sourceIds);
    const item = view.index.items.get(task.itemId);
    const future = task.due > view.props.day;
    const status = future ? '예정' : task.due === view.props.day ? '오늘' : '지난 일정';
    return `<li class="ox-task" data-ox-due="${escape(task.due)}" data-ox-status="${escape(task.status)}">
      <div class="ox-due"><time datetime="${escape(task.due)}">${escape(dateLabel(task.due))}</time> <span>${status}</span></div>
      <div class="ox-task-body"><div><strong>${escape(task.typeTitle)}</strong>
      <p>초${escape(unit.semester)} · ${unit.number}단원 ${escape(unit.title)}</p>
      <p>보완할 문제 · ${escape(source)}</p>
      ${item ? `<p class="ox-target"><b>새 문제</b> ${setLabel(item.set)} ${item.number}번 ${paperLink(unit,item.set)}</p>${exerciseBody(item)}` :
        `<p class="ox-no-item">이 유형의 더 연결할 새 문항이 없어요. 표시된 문제를 다시 연습하고 선생님과 다음 문제를 정해요.</p>${paperLink(unit,task.sourceSet)}`}</div>
      ${item && !future ? controls(view,item,null,'recheck') : ''}</div></li>`;
  }

  function history(view) {
    const rows = Object.entries(view.model.marks).filter(([,entry]) => entry.phase === 'recheck' && entry.mark)
      .sort(([,a],[,b]) => b.date.localeCompare(a.date));
    if (!rows.length) return '';
    return `<details class="ox-history"${view.historyOpen ? ' open' : ''}><summary>재점검 기록 · ${rows.length}문항</summary>
      <ul>${rows.slice(0,view.historyLimit).map(([id,entry]) => {
        const item = view.index.items.get(id);
        if (!item) return '';
        return `<li><div><strong>${escape(paperName(item.unit,item.set))} ${item.number}번</strong>
          <small>${escape(dateLabel(entry.date))} · ${escape(item.type)}</small>${exerciseBody(item)}</div>${controls(view,item,entry,'recheck')}</li>`;
      }).join('')}</ul>${rows.length > view.historyLimit ? '<button type="button" class="ox-more" data-ox-more="history">지난 기록 더 보기</button>' : ''}</details>`;
  }

  function queue(view) {
    const {tasks} = view.model;
    return `<section class="ox-queue" data-ox-queue tabindex="-1" aria-label="유형별 보완 일정">
      <h4>유형별 보완 일정</h4>
      ${tasks.length ? `<ul class="ox-queue-list">${tasks.slice(0,view.limit).map(task=>taskRow(view,task)).join('')}</ul>
      ${tasks.length > view.limit ? '<button type="button" class="ox-more" data-ox-more="tasks">다음 일정 더 보기</button>' : ''}` :
      '<p class="ox-guide">현재 보완할 유형이 없어요. X로 기록하면 같은 유형의 새 문제를 일주일 뒤에 풀 수 있어요.</p>'}
      ${history(view)}</section>`;
  }

  function notice(view, text) {
    const message = view.host.querySelector('.ox-message');
    if (message) message.textContent = text;
  }

  function draw(view) {
    const body = view.host.querySelector('[data-ox-body]');
    if (!body) return;
    const ownedFocus = view.host.contains(document.activeElement) ? document.activeElement : null;
    const focusKey = ownedFocus?.dataset;
    view.historyOpen = view.host.querySelector('.ox-history')?.open ?? view.historyOpen;
    const scheduled = view.model.tasks.length;
    body.innerHTML = `<div class="ox-heading"><h3>초등 교과 단원평가</h3>
      ${view.props.onGraph ? '<button type="button" data-ox-graph class="ox-link">누적 그래프 보기</button>' : ''}</div>
      <div class="ox-switch" role="group" aria-label="단원평가 화면">
      <button type="button" data-ox-tab="sheet" aria-pressed="${view.tab === 'sheet'}">문항 O·X</button>
      <button type="button" data-ox-tab="queue" aria-pressed="${view.tab === 'queue'}">보완 일정${scheduled ? ' ('+scheduled+')' : ''}</button></div>
      ${view.tab === 'sheet' ? sheet(view) : queue(view)}`;
    if (!focusKey) return;
    let next;
    if (focusKey.oxItem) {
      next = [...view.host.querySelectorAll('[data-ox-item]')].find(el => el.dataset.oxItem === focusKey.oxItem && el.dataset.oxMark === focusKey.oxMark && !el.disabled);
      if (!next && view.tab === 'queue') next = view.host.querySelector('[data-ox-queue]');
    } else if (focusKey.oxFilter || focusKey.oxTab) {
      next = view.host.querySelector(focusKey.oxFilter ? `[data-ox-filter="${focusKey.oxFilter}"]` : `[data-ox-tab="${focusKey.oxTab}"]`);
    }
    next?.focus({preventScroll:true});
  }

  function update(view, attempts) {
    view.props.attempts = attempts;
    view.model = g.PlannerOxModel.state(view.props.catalog, attempts, view.props.day);
  }

  function markItem(view, button) {
    const {oxItem:id, oxMark:mark, oxKind:kind} = button.dataset;
    if (!marks.includes(mark) || view.pending.has(id)) return;
    const item = view.index.items.get(id);
    const previous = view.model.marks[id]?.mark || null;
    if (!item || previous === mark) return;
    const common = {kind,unitId:item.unit.id,date:view.props.day};
    const change = kind === 'recheck' ? {...common,itemId:id,mark,expected:previous} :
      {...common,set:item.set,marks:{[item.number]:mark},expected:{[item.number]:previous}};
    view.pending.set(id, mark);
    for (const el of button.parentElement.querySelectorAll('button')) {
      el.setAttribute('aria-disabled', 'true');
      el.setAttribute('aria-pressed', String(el.dataset.oxMark === mark));
    }
    notice(view, item.number + '번 저장 중…');
    const save = async () => {
      try {
        const attempts = await view.props.commit(change);
        update(view, attempts);
        notice(view, item.number + '번 ' + mark + '를 기록했어요.');
      } catch (error) {
        notice(view, error?.message || '기록을 저장하지 못했어요. 다시 눌러 주세요.');
      } finally {
        view.pending.delete(id);
        draw(view);
      }
    };
    view.saves = view.saves.then(save);
  }

  function openQueue(host) {
    const view = views.get(host);
    if (!view) return false;
    view.tab = 'queue';
    draw(view);
    host.querySelector('[data-ox-queue]')?.focus();
    return true;
  }

  function bind(view) {
    const {host} = view;
    host.addEventListener('change', event => {
      const {oxFilter} = event.target.dataset;
      if (!oxFilter) return;
      const value = event.target.value;
      if (oxFilter === 'semester') view.unit = view.props.catalog.units.find(u => u.semester === value);
      if (oxFilter === 'unit') view.unit = view.index.units.get(value);
      if (oxFilter === 'set') view.set = value;
      notice(view, '');
      draw(view);
    });
    host.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button || !host.contains(button) || button.disabled) return;
      const data = button.dataset;
      if (data.oxTab) {
        view.tab = data.oxTab;
        draw(view);
      } else if ('oxShowQueue' in data) {
        openQueue(host);
      } else if (data.oxItem) {
        markItem(view, button);
      } else if (data.oxPaper) {
        const unit = view.index.units.get(data.oxPaper);
        Promise.resolve(g.PlannerOxPaper.open(unit,data.oxSet)).then(message => {
          if (typeof message === 'string') notice(view, message);
        }).catch(error => notice(view, error?.message || '문제지를 열 수 없어요. 파일을 다시 선택해 주세요.'));
      } else if ('oxGraph' in data) {
        view.props.onGraph();
      } else if (data.oxMore) {
        if (data.oxMore === 'history') view.historyLimit += 25;
        else view.limit += 25;
        draw(view);
      }
    });
  }

  function render(host, props) {
    if (!host || !props?.catalog?.units?.length) return;
    let view = views.get(host);
    if (!host.querySelector('.ox-card')) {
      host.innerHTML = '<section class="ox-card" aria-label="초등 교과 단원평가"><div data-ox-body></div><p class="ox-message" role="status"></p></section>';
    }
    if (!view) {
      view = {host, tab:'sheet', pending:new Map(), saves:Promise.resolve(), limit:12, historyLimit:12};
      views.set(host, view);
      bind(view);
    }
    view.props = {...props};
    view.index = index(props.catalog);
    update(view, props.attempts || []);
    if (!view.unit || !view.index.units.has(view.unit.id)) resume(view);
    draw(view);
  }

  g.PlannerOxView = Object.freeze({render, openQueue});
})(window);
