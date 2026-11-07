/* Keep a single check-in form while the surrounding planner replaces its panels. */
(function (g) {
  'use strict';
  const model = g.PlannerWeeklyModel;
  const schedule = g.PlannerWeeklySchedule;
  const storage = g.PlannerStorage;
  const key = 'gfield.demo2.weekly-study.v1';
  const host = document.createElement('section');
  host.id = 'plannerWeeklyCheck';
  let storedText, program, courses, calendarId, intake, calcDays;

  function read() {
    storedText = storage.getLatestItem(key);
    let saved = null;
    try { saved = JSON.parse(storedText); } catch {}
    program = model.restore(saved?.program);
    courses = program ? schedule.restore(saved.courses) : null;
    calendarId = /^[0-9a-f-]{36}$/i.test(saved?.calendarId || '') ? saved.calendarId : null;
  }

  function shortcut(label) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.weeklyOpen = '';
    button.className = 'wk-secondary';
    button.textContent = label;
    return button;
  }

  function drawSchedules() {
    if (!host.isConnected) return;
    const info = model.view(program);
    const due = info?.phase === 'due';
    const map = document.getElementById('workspace-panel-map');
    const table = document.getElementById('workspace-panel-table');
    const peek = document.getElementById('flowMapPeek');
    for (const container of [map, table, peek]) container?.querySelector('[data-weekly-extra]')?.remove();
    for (const [panel, view] of [[map, 'map'], [table, 'table']]) {
      if (!panel || (!program && view === 'map')) continue;
      const section = document.createElement('div');
      section.dataset.weeklyExtra = '';
      section.innerHTML = program ? schedule.render(program, courses, view) : '';
      if (view === 'table') section.prepend(shortcut(due ? '이번 주 학습 점검하기' : program ? '주간 학습 점검 열기' : '학습 시작일·주간 목표 정하기'));
      if (view === 'map') host.after(section);
      else panel.prepend(section);
    }
    if (due && peek) {
      const notice = shortcut('이번 주 교과·연산·사고력 점검하기');
      notice.dataset.weeklyExtra = '';
      peek.append(notice);
    }
  }

  function render() {
    const source = courses || intake;
    const week = program ? schedule.model(program, courses)?.weeks[0] : null;
    const materials = {}, defaults = {};
    for (const track of model.TRACKS) {
      const row = source.tracks[track];
      materials[track] = row.blocks.find(block => block.start <= 0 && block.end > 0)?.title || row.current || '';
      if (week) materials[track] = week.tracks[track].items.map(item => item.title).join(' · ');
      const hasCourse = row.blocks.some(block => block.start <= 0 && block.end > 0);
      if (!hasCourse) defaults[track] = 0;
      else if (track === 'arithmetic') defaults[track] = calcDays;
      else defaults[track] = g.PlannerTransition.classBaseline(materials[track])?.sessions || 1;
    }
    const expected = storedText;
    g.PlannerWeeklyView.render(host, {
      state: program, materials, defaults,
      onChange: next => save(next, expected),
      onCalendar: date => g.PlannerWeeklyCalendar.download(date, calendarId),
      onPhaseChange: drawSchedules
    });
    drawSchedules();
  }

  async function save(next, expected) {
    const persist = () => {
      if (storage.getLatestItem(key) !== expected) {
        read(); render();
        throw Error('다른 화면에서 점검 내용을 저장했어요. 최신 계획을 확인해 주세요.');
      }
      const first = !program;
      const snapshot = first ? intake : courses;
      const id = calendarId || g.crypto.randomUUID();
      const text = JSON.stringify({version: 1, program: next, courses: snapshot, calendarId: id});
      storage.setItem(key, text);
      storedText = text;
      program = next;
      courses = snapshot;
      calendarId = id;
      render();
    };
    if (g.navigator.locks) await g.navigator.locks.request('gfield.weekly-study.' + g.RoadmapMember.user_id, persist);
    else persist();
  }

  function mount(lanes, days) {
    const map = document.getElementById('workspace-panel-map');
    if (!map) return;
    read();
    intake = schedule.snapshot(lanes);
    calcDays = days;
    map.prepend(host);
    render();
  }

  function open() {
    if (!host.isConnected) return;
    g.PlannerWeeklyView.open(host);
    host.scrollIntoView({block: 'start'});
  }

  g.PlannerWeeklyPlanner = Object.freeze({mount, open});
})(window);
