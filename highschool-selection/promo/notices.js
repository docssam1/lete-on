(function () {
  'use strict';
  const feed = globalThis.HIGHSELECT_ACADEMY_NOTICES;
  const programs = globalThis.HIGHSELECT_ACADEMY_ENGAGEMENT.programs;
  const labels = {test:'테스트',seminar:'설명회',admission:'모집'};
  const colors = {SH:'#64d5a2',DP:'#f7d447',WM:'#618df3',ED:'#f39bb9',DG:'#b5a0ee',SM:'#fa9a68'};
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl = value => { try { const url = new URL(value); return url.protocol === 'https:' && ['blog.naver.com','apply.dailystudy.com'].includes(url.hostname) ? url.href : ''; } catch { return ''; } };
  const today = () => new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  const states = new Map();
  const admissions = globalThis.HIGHSELECT_COURSE_ADMISSIONS;
  function mount(id, selectedAcademy = '', selectedCourse = '') {
    const root = document.getElementById(id);
    if (!root) return;
    const state = states.get(id) || {academy:'',branch:'',category:'',course:'',limit:8};
    states.set(id,state);
    const controls = (name, choices, label) => `<div class="news-filter-group" role="group" aria-label="${label}">${choices.map(([value,text]) => `<button type="button" class="news-filter" data-filter="${name}" data-value="${esc(value)}" aria-pressed="false">${esc(text)}</button>`).join('')}</div>`;
    root.innerHTML = `<div class="news-filters">${selectedAcademy ? '' : controls('academy',[['','전체 학원'],...programs.map(p=>[p.code,p.shortName])],'학원 선택')}${controls('branch',[['','대치·분당'],['대치','대치'],['분당','분당']],'지점 선택')}${controls('category',[['','전체 공지'],['test','테스트'],['seminar','설명회'],['admission','모집']],'공지 종류')}</div><label class="news-course-filter" hidden><span>과정 선택</span><select aria-label="공지 과정 선택"></select></label><div class="news-meta"><span class="news-count" role="status" aria-live="polite"></span><span>${esc(feed?.checkedAt || '')} 확인</span></div><div class="news-items"></div><button type="button" class="news-more" hidden>공지 더 보기</button><details class="news-channels"><summary>학원별 공지 원문</summary><div class="news-channel-links"></div></details>`;
    function update() {
      const academy = selectedAcademy || state.academy;
      const program = programs.find(p=>p.code===academy);
      if (!program?.courses.some(c=>c.id===state.course)) state.course='';
      const course = selectedCourse || state.course;
      const filter = root.querySelector('.news-course-filter');
      filter.hidden = !program || Boolean(selectedCourse) || !program.courses.some(c=>admissions?.forCourse(academy,c.id));
      const select = filter.querySelector('select');
      select.innerHTML = '<option value="">전체 과정</option>'+(program?.courses||[]).filter(c=>admissions?.forCourse(academy,c.id)).map(c=>`<option value="${esc(c.id)}">${esc(c.label)}</option>`).join('');
      select.value = state.course;
      const day = today();
      const items = (feed?.items || []).filter(item => safeUrl(item.url) && programs.some(p=>p.code===item.academy) &&
        ['대치','분당'].includes(item.branch) && !(item.academy==='SH' && item.branch!=='대치') &&
        (!item.eventDate || item.eventDate>=day) && (!academy || item.academy===academy) &&
        (!state.branch || item.branch===state.branch) && (!state.category || item.category===state.category) &&
        (!course || admissions?.matchesNotice(academy,course,item)));
      root.querySelectorAll('[data-filter]').forEach(button=>button.setAttribute('aria-pressed',String(state[button.dataset.filter]===button.dataset.value)));
      root.querySelector('.news-count').textContent = `${items.length}개 공지`;
      root.querySelector('.news-items').innerHTML = items.length ? `<ul class="news-list">${items.slice(0,state.limit).map(item=>{
        const program=programs.find(p=>p.code===item.academy);
        return `<li><a class="news-item" href="${esc(safeUrl(item.url))}" target="_blank" rel="noopener noreferrer"><div class="news-identity"><span class="news-academy" style="--news-color:${colors[item.academy]}">${esc(program.shortName)}</span><span>${esc(item.branch)}</span><span class="news-kind">${esc(labels[item.category]||'공지')}</span></div><div class="news-content"><h3>${esc(item.title)}</h3>${item.scheduleText?`<p class="news-schedule">${esc(item.scheduleText)}</p>`:''}<span class="news-date">${item.publishedAt?`게시 ${esc(item.publishedAt)}`:`일정 ${esc(item.eventDate)}`}</span></div><span class="news-open" aria-hidden="true">↗</span><span class="sr-only">새 창에서 원문 보기</span></a></li>`;
      }).join('')}</ul>` : `<p class="news-empty">${course?'이 과정에 연결된 공지가 없습니다. 학원 원문에서 최신 모집을 확인하세요.':'해당 공지가 없습니다. 아래 학원별 원문을 확인해 주세요.'}</p>`;
      root.querySelector('.news-more').hidden = items.length<=state.limit;
      const channels = (feed?.sources||[]).filter(source=>(!academy||source.academy===academy) && (source.branch==='title'||!state.branch||source.branch===state.branch));
      const unique=new Map();
      channels.forEach(source=>{ const url=safeUrl(source.url); if(url)unique.set(source.academy+'|'+source.branch+'|'+url,source); });
      root.querySelector('.news-channel-links').innerHTML = [...unique.values()].map(source=>`<a href="${esc(safeUrl(source.url))}" target="_blank" rel="noopener noreferrer">${esc(programs.find(p=>p.code===source.academy)?.shortName)} ${source.branch==='title'?'대치·분당':esc(source.branch)}${source.url.includes('parent-seminar')?' 설명회':''}${source.status==='delayed'?' · 확인 지연':''}<span aria-hidden="true">↗</span></a>`).join('');
    }
    root.addEventListener('change',event=>{if(event.target.matches('.news-course-filter select')){state.course=event.target.value;state.limit=8;update();}});
    root.addEventListener('click',event=>{
      const button=event.target.closest('[data-filter]');
      if(button && root.contains(button)) {state[button.dataset.filter]=button.dataset.value;state.limit=8;update();}
      else if(event.target.closest('.news-more')) {state.limit+=8;update();}
    });
    update();
  }
  function render() {
    const params=new URLSearchParams(location.hash.slice(1));
    const academy=params.get('academy');
    const course=params.get('course');
    mount('home-notice-board');
    // The router replaces the academy stage, while this notice mount is stable.
    const intro=document.getElementById('academy-notice-board');
    if(intro) intro.replaceWith(intro.cloneNode(false));
    if(programs.some(p=>p.code===academy))mount('academy-notice-board',academy,admissions?.forCourse(academy,course)?course:'');
  }
  render();
  // Remove the old listener before rebuilding the stable home mount on route changes.
  window.addEventListener('hashchange',()=>{
    const home=document.getElementById('home-notice-board');
    if(home)home.replaceWith(home.cloneNode(false));
    render();
  });
})();
