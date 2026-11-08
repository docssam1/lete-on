/* Signed session counts from saved weekly reviews. Missing weeks break the line. */
(function (g) {
  'use strict';
  const tracks = {book:'교재 진도', assessment:'단원평가 누적 결과', all: '전체 학습 횟수', curriculum: '교과', arithmetic: '연산', thinking: '사고력', units: '단원 보완'};
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => (
    {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char]
  ));
  const renderedContent = new WeakMap();
  const recorded = point => point?.status === 'recorded' && Number.isFinite(point.gap);
  const signed = count => count === 0 ? '0' : (count > 0 ? '+' : '−') + Math.abs(count);

  function gapLabel(value) {
    if (value === 0) return '계획과 같아요';
    return Math.abs(value) + (value > 0 ? '회 앞서 있어요' : '회 남았어요');
  }

  function shiftText(latest, previous) {
    if (!recorded(previous) || !recorded(latest)) return '';
    const delta = latest.gap - previous.gap;
    if (!delta) return '이전 점검과 같은 위치예요.';
    if (previous.gap < 0 && delta > 0) {
      if (latest.gap === 0) return '밀렸던 ' + Math.abs(previous.gap) + '회를 모두 따라잡았어요.';
      if (latest.gap < 0) return '밀렸던 ' + Math.abs(previous.gap) + '회 중 ' + delta + '회를 따라잡았어요.';
      return '밀렸던 ' + Math.abs(previous.gap) + '회를 모두 채우고 계획을 앞섰어요.';
    }
    return '이전 점검보다 ' + Math.abs(delta) + (delta > 0 ? '회 올라갔어요.' : '회 내려갔어요.');
  }

  function weekStatus(point) {
    return point.status === 'ongoing' ? '진행 중' : '미기록';
  }

  function weekTable(points, open, units) {
    const rows = points.map(point => {
      const week = Number(point.weekNumber);
      const label = escape(point.start?.slice(5).replace('-', '.'));
      const actual = recorded(point) ? point.completed + (units ? '개' : '회') : weekStatus(point);
      const gap = recorded(point) ? (units ? Math.abs(point.gap) + '개' : signed(point.gap) + '회') : '—';
      const target = Number.isFinite(point.target) ? point.target + '회' : '—';
      return '<tr data-wt-week="' + week + '" data-wt-status="' + escape(point.status) + '"><th scope="row">' +
        week + '주 <small>' + label + '</small></th>' + (units ? '' : '<td>' + target + '</td>') +
        '<td>' + actual + '</td><td>' + gap + '</td></tr>';
    }).join('');
    const title = units ? '주차별 단원 기록' : '주차별 횟수';
    const headers = units ? ['혼자 푼 항목이 있는 단원', '남은 보완'] : ['목표', '실제', '누적 차이'];
    return '<details class="wt-data"' + (open ? ' open' : '') + '><summary data-wt-focus="table">' + title + ' 보기</summary>' +
      '<table aria-label="' + title + '"><thead><tr><th scope="col">주차·시작일</th>' +
      headers.map(text => '<th scope="col">' + text + '</th>').join('') + '</tr></thead><tbody>' +
      rows + '</tbody></table></details>';
  }

  function character(route) {
    const visual = g.PlannerStudentVisual;
    if (!visual) return '';
    const stage = visual.stage(route) ?? 2;
    return ['boy', 'girl'].includes(route.gender) ? visual.figure(stage, route.gender) : visual.pair(stage);
  }

  function chartY(gap, scale, units) {
    return units ? 28 - 58 * gap / scale : 57 - 29 * gap / scale;
  }

  function chart(points, latest, route, units, sample = false) {
    const observed = points.filter(recorded);
    const max = Math.max(units ? 3 : 1, ...observed.map(point => Math.abs(point.gap)));
    const magnitude = 10 ** Math.floor(Math.log10(max));
    const scale = [1, 2, 3, 5, 10].find(step => step * magnitude >= max) * magnitude;
    const x = index => points.length > 1 ? 6 + 88 * index / (points.length - 1) : 50;
    const y = gap => chartY(gap, scale, units);
    const segmentPaths = [];
    const markers = [];
    const dates = [];
    let segment = [];
    function endSegment() {
      if (segment.length > 1) segmentPaths.push('<path' + (sample ? '' : ' data-wt-segment') + ' d="M' + segment.join(' L') + '"/>');
      segment = [];
    }
    points.forEach((point, index) => {
      const week = Number(point.weekNumber);
      const left = x(index);
      const hideNarrow = points.length > 5 && week !== latest?.weekNumber && index !== 0 && index !== points.length - 1 &&
        (index % 2 !== 0 || (index === points.length - 2 && points.length % 2 === 0));
      dates.push('<span class="' + (hideNarrow ? 'wt-sparse' : '') + '" style="left:' + left + '%">' + week + '주</span>');
      if (!recorded(point)) {
        endSegment();
        return;
      }
      const top = y(point.gap);
      segment.push(left.toFixed(3) + ',' + top.toFixed(3));
      const position = ' style="left:' + left + '%;top:' + top + '%"';
      const attrs = sample ? '' : ' data-wt-week="' + week + '" data-wt-gap="' + point.gap + '"';
      markers.push('<span class="wt-marker"' + attrs + position + '></span>');
      if (week === latest?.weekNumber) {
        markers.push('<span class="wt-character"' + attrs + position + '>' + character(route) + '</span>');
      }
    });
    endSegment();
    const ticks = units ? [0, -scale] : [scale, 0, -scale];
    const levels = ticks.map(gap => {
      const note = units ? (gap === 0 ? '보완 완료' : Math.abs(gap) + '개 남음') : (gap === 0 ? '계획선' : signed(gap) + '회');
      return '<div class="wt-level' + (gap === 0 ? ' wt-baseline' : '') + '" style="top:' + y(gap) + '%"><span>' + note + '</span></div>';
    }).join('');
    return '<div class="wt-chart" aria-hidden="true"><div class="wt-plot" data-wt-scale="' + scale + '">' + levels +
      '<svg viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">' + segmentPaths.join('') +
      '</svg>' + markers.join('') + '</div><div class="wt-dates">' + dates.join('') + '</div></div>';
  }

  function example(units, route, open) {
    const gaps = units ? [0, -2, 0] : [1, -2, -1, 0];
    const points = gaps.map((gap, index) => ({weekNumber: index + 1, status: 'recorded', gap}));
    const exampleText = units ? '처음엔 보완할 단원이 없었어요. 2주차에 두 단원이 남았고, 3주차에 두 단원을 모두 혼자 풀었어요.' :
      '매주 5회가 목표인 예에서 실제로 6회, 2회, 6회, 6회 공부했어요. 1회 앞섰다가 2회 밀렸고, 4주차에 계획을 따라잡았어요.';
    return '<details class="wt-example"' + (open ? ' open' : '') + '><summary data-wt-focus="example">그래프 예시 보기</summary>' +
      '<p class="wt-method"><strong>예시</strong> · ' + exampleText + '</p>' + chart(points, points.at(-1), route, units, true) + '</details>';
  }

  function markup(model, route = {}, open = false, exampleOpen = false) {
    const points = model.points || [];
    const latest = model.latest;
    const hasProgram = model.hasProgram !== false && model.phase !== 'unconfigured';
    const hasRecord = recorded(latest);
    const track = Object.hasOwn(tracks, model.track) ? model.track : 'all';
    const units = track === 'units';
    const options = Object.entries(tracks)
      .filter(([value]) => hasProgram || value === 'all' || value === 'units' || value === 'book' || value === 'assessment')
      .map(([value, name]) => '<option value="' + value + '"' + (value === track ? ' selected' : '') + '>' + name + '</option>').join('');
    const showChart = points.some(recorded);
    const select = '<label class="wt-filter">그래프 선택 <select data-wt-filter data-wt-focus="filter">' + options + '</select></label>';
    if (track === 'assessment') return '<section class="wt-card" data-wt-track="assessment" aria-label="단원평가 누적 결과"><div class="wt-head"><h3>단원평가 누적 결과</h3>' +
      select + '</div><div data-assessment-host></div></section>';
    if (track === 'book') return '<section class="wt-card" data-wt-track="book" aria-label="교재 진도"><div class="wt-head"><h3>목표와 혼자 푼 교재 진도</h3>' +
      select + '</div><div data-book-pace-host></div></section>';
    const latestLabel = hasRecord && (units ? '보완할 단원 ' + Math.abs(latest.gap) + '개' : gapLabel(latest.gap));
    const title = units ? '단원 보완 흐름' : '계획 대비 학습 흐름';
    const detail = hasRecord ? '<p class="wt-result"><small>최근 ' + (units ? '기록' : '점검') + ' · ' + Number(latest.weekNumber) +
      '주차</small><strong>' + latestLabel + '</strong></p>' : '';
    let note = '';
    if (units) {
      if (!hasRecord) note = '이번 주 체크리스트에서 공부한 항목을 표시하면 보완할 단원 수가 보여요.';
      if (hasRecord && recorded(model.previous)) {
        const delta = latest.gap - model.previous.gap;
        note = delta ? '지난 기록보다 보완할 단원이 ' + Math.abs(delta) + (delta > 0 ? '개 줄었어요.' : '개 늘었어요.') : '지난 기록과 보완할 단원 수가 같아요.';
      }
    } else {
      if (hasRecord) note = shiftText(latest, model.previous);
      if (!hasRecord && model.phase === 'unconfigured') note = '학습 시작일과 주간 목표를 정하면 점검할 수 있어요.';
      if (!hasRecord && model.phase === 'scheduled') note = '학습을 시작하고 첫 주 점검을 저장하면 그래프가 시작돼요.';
      if (!hasRecord && (model.phase === 'active' || model.phase === 'due')) note = '첫 주간 점검을 저장하면 아이의 위치가 그래프에 표시돼요.';
    }
    if (hasRecord && !showChart) note = '표시된 기간에는 저장한 기록이 없어요.';
    const button = units ? '' : '<button type="button" class="wt-open" data-wt-focus="open" data-weekly-open>' +
      (hasProgram ? '주간 점검 열기' : '시작일·목표 정하기') + '</button>';
    const method = units ? '공부했지만 혼자 풀기 어려운 단원이 남으면 점이 내려가고, 보완을 마치면 위로 올라와요.' :
      '주간 점검에 저장한 실제 학습 횟수에서 그 주 목표를 빼고 누적해요. 미기록 주는 계산에서 제외해요.';
    return '<section class="wt-card" data-wt-track="' + track + '" aria-label="' + title + '"><div class="wt-head"><h3>' + title + '</h3>' + select +
      '</div>' + detail + (note ? '<p class="wt-note">' + note + '</p>' : '') +
      (showChart ? chart(points, latest, route, units) : '') +
      (points.length && (hasProgram || units) ? '<p class="wt-method">' + method + '</p>' : '') +
      (model.archived && !units ? '<p class="wt-method">오래된 기록은 목표 횟수를 확인할 수 있는 주부터 누적했어요.</p>' : '') +
      (points.filter(recorded).length < 2 ? example(units, route, exampleOpen) : '') +
      (points.length ? weekTable(points, open, units) : '') + button + '</section>';
  }

  function moveStudent(host, before) {
    if (!before || g.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const card = host.querySelector('.wt-card');
    const current = card?.querySelector('.wt-character[data-wt-week]');
    if (!current || card.dataset.wtTrack !== before.track) return;
    const nextWeek = Number(current.dataset.wtWeek), nextGap = Number(current.dataset.wtGap);
    if (nextWeek < before.week || nextWeek > before.week + 1 || (nextWeek === before.week && nextGap === before.gap)) return;
    const start = card.querySelector('.wt-marker[data-wt-week="' + before.week + '"]');
    if (!start) return;
    const scale = Number(current.closest('.wt-plot').dataset.wtScale);
    const oldY = chartY(before.gap, scale, before.track === 'units');
    current.animate?.([
      {left: start.style.left, top: Math.max(14, Math.min(92, oldY)) + '%'},
      {left: current.style.left, top: current.style.top}
    ], {duration: 420, easing: 'ease-out'});
  }

  function render(host, model, route = {}) {
    if (!host || !model) return;
    // A weekly save refreshes both planner panels more than once. Keep the
    // existing graph and its in-flight character movement on identical updates.
    const next = markup(model, route);
    const previous = renderedContent.get(host);
    if (previous === next && host.querySelector('.wt-card')) return;
    const active = host.ownerDocument.activeElement;
    const focus = host.contains(active) ? active?.dataset.wtFocus : null;
    const open = Boolean(host.querySelector('.wt-data')?.open);
    const exampleOpen = Boolean(host.querySelector('.wt-example')?.open);
    const marker = host.querySelector('.wt-character[data-wt-week]');
    const before = marker && {track: marker.closest('.wt-card').dataset.wtTrack,
      week: Number(marker.dataset.wtWeek), gap: Number(marker.dataset.wtGap)};
    host.innerHTML = next;
    const details = host.querySelector('.wt-data');
    const sample = host.querySelector('.wt-example');
    if (details) details.open = open;
    if (sample) sample.open = exampleOpen;
    renderedContent.set(host, next);
    moveStudent(host, before);
    if (focus) host.querySelector('[data-wt-focus="' + focus + '"]')?.focus({preventScroll: true});
    if (previous !== undefined) return;
    host.addEventListener('change', event => {
      if (!event.target.matches('[data-wt-filter]') || !Object.hasOwn(tracks, event.target.value)) return;
      host.dispatchEvent(new CustomEvent('planner-trend-track', {bubbles: true, detail: {track: event.target.value}}));
    });
  }

  g.PlannerWeeklyTrendView = Object.freeze({render, markup});
})(typeof window === 'object' ? window : globalThis);
