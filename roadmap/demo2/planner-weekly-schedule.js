// Project dated study weeks from the child's materials at the start of this program.
(function (global) {
  'use strict';
  const axes = {curriculum: ['school', '교과'], arithmetic: ['calc', '연산'], thinking: ['thinking', '사고력']};
  const weeksPerMonth = 365.2425 / 12 / 7;
  const text = value => typeof value === 'string' ? value.trim().slice(0, 130) : '';
  function material(value) {
    const label = text(value);
    return /미선택|미확인|확인\s*(전|필요|대기)|시작\s*전|시작하지|경험\s*없|아직\s*없|진행하지|잘\s*모르|^(?:없음|없어요|이후 (?:단계|과정)|[—–-]+)$/.test(label) ? '' : label;
  }
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function lanes(standard, selectedCore, workspace) {
    const sources = standard?.lanes || [];
    const selected = selectedCore?.lanes || workspace?.independentLanes || [];
    const school = workspace?.rows?.flatMap(row => {
      if (row.timing === 'done') return [];
      const segment = workspace.m.segments.find(s => s.gain > 0 &&
        global.PlannerTransition.schoolNumber(global.PlannerProgression.stage(s.course, 'school')) === row.id);
      if (!segment) return [];
      const end = segment.scenarioEnd - workspace.m.now;
      return [{title: row.school, start: end - segment.duration, end}];
    });
    return Object.values(axes).map(([id]) => {
      const base = sources.find(lane => lane.id === id);
      const chosen = selected.find(lane => lane.id === id);
      if (id === 'school' && workspace && !selectedCore && school?.length) return {...base, id, blocks: school};
      return chosen || base || {id, current: '', blocks: []};
    });
  }

  function cleanTrack(track) {
    const blocks = [];
    for (const item of Array.isArray(track?.blocks) ? track.blocks.slice(0, 64) : []) {
      if (item?.completed || !Number.isFinite(item?.start) || !Number.isFinite(item.end)) continue;
      const title = material(item.title);
      const start = Math.max(0, item.start), end = Math.min(240, item.end);
      if (!title || end <= start) continue;
      const block = {title, start, end};
      if (Number.isFinite(item.studyDays) && item.studyDays > 0 && item.studyDays <= 999) block.studyDays = item.studyDays;
      blocks.push(block);
    }
    const current = ['none', 'unknown', 'pending'].includes(track?.status) ? '' : material(track?.current);
    const result = {current, blocks: blocks.sort((a,b) => a.start - b.start || a.end - b.end)};
    if (typeof track?.intakeKey === 'string' && track.intakeKey.length <= 1000) result.intakeKey = track.intakeKey;
    if (/^\d{4}-\d{2}-\d{2}$/.test(track?.changedOn) && Number.isSafeInteger(track.completedBefore) && track.completedBefore >= 0) {
      result.changedOn = track.changedOn;
      result.completedBefore = track.completedBefore;
    }
    return result;
  }

  function intakeKey(ctx, id) {
    if (!ctx?.answers) return '';
    const intake = global.PlannerIntake, a = intake.effective(ctx.answers);
    const status = {school:'schoolStatus',calc:'calcStatus',thinking:'thinkingStatus'}[id];
    const progress = intake.progressValue(a,status);
    return JSON.stringify([intake.progressCourse(a,status),a[status] || '',!!ctx.fields?.pendingStatus?.[status],
      progress && !progress.estimated ? [progress.unit,progress.done,progress.total] : null]);
  }

  function snapshot(rows, context) {
    return {version: 1, tracks: Object.fromEntries(Object.entries(axes).map(([key,[id]]) => {
      const track = Array.isArray(rows) && rows.find(l => l?.id === id);
      const clean = cleanTrack(track);
      const signature = intakeKey(context,id);
      if (signature) clean.intakeKey = signature;
      return [key,clean];
    }))};
  }

  function restore(value) {
    const tracks = value?.version === 1 ? value.tracks : null;
    return {version: 1, tracks: Object.fromEntries(Object.keys(axes).map(key => [key, cleanTrack(tracks?.[key])]))};
  }

  // Weekly reviews count the preceding week. Previously recorded sessions and
  // a late entry for the week before changing books cannot advance the new book.
  function beforeChange(program, key, day) {
    const prior = program.prior;
    const archived = prior?.dueDate <= day ? prior.completedTotals[key] : 0;
    return program.history.reduce((n,r) => n + (r.dueDate <= day ? r.completed[key] : 0),archived);
  }

  function reconcile(raw, saved, current, day = global.PlannerWeeklyModel.today()) {
    const program = global.PlannerWeeklyModel.restore(raw), previous = restore(saved), fresh = restore(current);
    if (!program) return fresh;
    for (const key of Object.keys(axes)) {
      const old = previous.tracks[key], next = fresh.tracks[key];
      const first = row => row.blocks.find(b => b.start === 0)?.title || row.current;
      // Pre-feature snapshots lack intake signatures; compare the actual material
      // that opened each lane without interpreting old estimates as completion.
      const changed = old.intakeKey && next.intakeKey ? old.intakeKey !== next.intakeKey : first(old) !== first(next);
      if (changed) {
        previous.tracks[key] = {...next,changedOn:day,completedBefore:beforeChange(program,key,day)};
      } else {
        if (next.intakeKey) old.intakeKey = next.intakeKey;
        if (old.changedOn) old.completedBefore = Math.max(old.completedBefore,beforeChange(program,key,old.changedOn));
      }
    }
    return previous;
  }

  function currentBacklog(track,key,state,fallback) {
    if (!track.changedOn) return fallback;
    let backlog = state.prior?.dueDate > track.changedOn ? state.prior.backlog[key] : 0;
    for (const record of state.history) if (record.dueDate > track.changedOn)
      backlog = Math.max(0, Math.max(backlog,record.targets[key]) - record.completed[key]);
    return backlog;
  }

  // Elementary arithmetic has dated daily portions. Other course lengths are
  // estimates based on the original weekly target, fixed when the program begins.
  function portions(track, initialTarget) {
    const result = [];
    let previousEnd = 0, cursor = 0;
    const append = (title, count, gap = false) => {
      const end = cursor + Math.max(1, Math.round(count));
      result.push({title, start: cursor, end, gap});
      cursor = end;
    };
    for (const block of track.blocks) {
      const start = Math.max(block.start, previousEnd);
      if (block.end <= start) continue;
      if (start - previousEnd > .01) {
        if (!initialTarget) break;
        append('배운 범위 유지·복습', (start - previousEnd) * weeksPerMonth * initialTarget, true);
      }
      const size = block.studyDays || (block.end - start) * weeksPerMonth * initialTarget;
      if (!size) break;
      append(block.title, size);
      previousEnd = block.end;
    }
    return result;
  }

  function workItems(portions, track, cursor, count) {
    const end = cursor + count;
    const items = portions.flatMap(p => {
      const sessions = Math.min(end, p.end) - Math.max(cursor, p.start);
      return sessions > 0 ? [{title: p.title, sessions}] : [];
    });
    const unknown = count - items.reduce((sum, item) => sum + item.sessions, 0);
    if (unknown > 0) {
      const current = track.blocks[0]?.title || track.current;
      const title = !portions.length && current ? current : '공부할 범위 확인';
      items.push({title, sessions: unknown});
    }
    return items;
  }

  function model(raw, savedCourses, day) {
    const weekly = global.PlannerWeeklyModel;
    const state = weekly.restore(raw), view = weekly.view(state, day);
    if (!view) return null;
    const courses = restore(savedCourses).tracks, totals = weekly.totals(state);
    const baseTargets = weekly.baseTargets(state);
    const weeks = Array.from({length: 4}, (_, i) => ({
      start: weekly.addDays(view.liveWeekStart, i * 7),
      end: weekly.addDays(view.liveWeekStart, i * 7 + 6), tracks: {}
    }));
    const transitions = {};
    for (const key of Object.keys(axes)) {
      const track = courses[key], pace = view.targets[key], available = portions(track, baseTargets[key]);
      const completed = Math.max(0,totals[key] - (track.completedBefore || 0));
      const backlog = currentBacklog(track,key,state,view.backlog[key]);
      const next = available.find(p => !p.gap && p.start > completed);
      if (pace && next) {
        const weeksUntil = Math.floor((next.start - completed) / pace);
        transitions[key] = {title: next.title, weekStart: weekly.addDays(view.liveWeekStart, weeksUntil * 7)};
      }
      weeks.forEach((week, index) => {
        const offset = index * pace;
        const carry = Math.min(pace, Math.max(backlog - offset, 0));
        week.tracks[key] = {pace, carry, items: workItems(available, track, completed + offset, pace)};
      });
    }
    return {phase: view.phase, weeks, transitions};
  }

  function range(week) {
    const sameYear = week.start.slice(0, 4) === week.end.slice(0, 4);
    return week.start + ' ~ ' + (sameYear ? week.end.slice(5) : week.end);
  }

  function weekGrid(week) {
    return '<dl class="weekly-schedule-tracks">' + Object.entries(axes).map(([key,[,label]]) => {
      const {pace, carry, items} = week.tracks[key];
      const body = pace ? items.map(item => '<span>' + esc(item.title) + ' · ' + item.sessions + '회</span>').join('') : '<span>이번 주 쉬기</span>';
      const note = carry ? '<small>이 중 ' + carry + '회는 지난 분량부터</small>' : '';
      return '<div data-weekly-track="' + key + '"><dt>' + label + '</dt><dd>' + body + note + '</dd></div>';
    }).join('') + '</dl>';
  }

  function render(program, courses, display, day) {
    const m = model(program, courses, day);
    if (!m) return '';
    const first = m.weeks[0], table = display === 'table';
    const heading = table ? '앞으로 4주 학습 일정' : (m.phase === 'scheduled' ? '첫 주 학습 일정' : '이번 주 학습 일정');
    const weeks = table ? m.weeks : [first];
    const estimates = Object.entries(m.transitions).map(([key,next]) => '<li><b>' + axes[key][1] + '</b> ' +
      esc(next.title) + ' · ' + esc(next.weekStart) + ' 주 예상</li>').join('');
    const details = table && estimates ? '<details><summary>다음 교재·과정으로 넘어갈 예상 주</summary><ul>' + estimates +
      '</ul><p>연산 교재에 하루 분량이 있으면 그 분량을 1회로 셉니다. 다른 과정은 해당 영역에서 처음 정한 주당 학습 횟수와 교재별 예정 기간으로 환산했습니다. 다음 과정에 들어가기 전에는 남은 단원과 풀이를 확인해 주세요.</p></details>' : '';
    return '<section class="weekly-personal-schedule" data-weekly-schedule="' + (table ? 'table' : 'map') + '"><h3>' + heading + '</h3><p>현재 설정한 교재와 기록한 학습 횟수로 이어갑니다. 교재나 진도를 바꾼 영역은 새 범위에서 시작합니다. 이번 주 목표를 계속 실천할 때의 예상 일정입니다. 아래 월별 로드맵은 처음 설계한 과정의 참고 일정입니다.</p>' +
      (m.phase === 'due' ? '<p class="weekly-schedule-pending">지난주 점검을 저장하면 이번 주 분량이 갱신됩니다.</p>' : '') +
      weeks.map(week => '<div class="weekly-schedule-week"><h4>' + range(week) + '</h4>' + weekGrid(week) + '</div>').join('') +
      details + '</section>';
  }
  global.PlannerWeeklySchedule = Object.freeze({lanes, snapshot, restore, reconcile, model, render});
})(typeof window === 'undefined' ? globalThis : window);
