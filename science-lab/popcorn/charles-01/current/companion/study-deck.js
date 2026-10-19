import {READINGS, VIDEO_CARDS} from './reading-content.js?v=20261015-modern-video-1';
import {mountInlineVideo} from './inline-video.js?v=20261015-video-recovery-1';

// These are the three existing opening stories, with their original copy.
const STORIES = [
  {id:'invitation',title:'종이 악어의 입이 움직인다고?',image:'cover-kit-branded.svg',alt:'실제 종이 자석 악어와 두 먹이 손잡이',chapter:'랩코니의 초대',text:'랩코니가 실험대에 종이 악어를 올려놓았어요. 옆에는 물고기와 당근이 놓여 있어요. 이 작은 악어에는 어떤 비밀이 숨어 있을까요?',lines:[['labconi-charles.png','랩코니','오늘은 이 악어와 함께 보이지 않는 힘을 찾아볼 거야.'],['starry.png','스타리','가까이에서 본 모습도, 멀리에서 본 모습도 놓치지 말자!'],['butterbee.png','버터비','물고기와 당근 준비 완료! 자석부터 만나러 가 볼까?']]},
  {id:'bookshelf',title:'자석이 들려주는 작은 이야기',image:'force-bar.png',alt:'원본 막대자석과 철 클립 관찰 사진',chapter:'스타리의 이야기 책장',text:'숟가락 모양의 옛 나침반, 방향을 찾는 바늘, 찰칵 닫히는 필통. 자석은 오래전부터 우리 곁에 있었어요. 스타리가 자석의 이야기와 두 시연 영상을 꺼내 놓았어요.',lines:[['starry.png','스타리','한국어로 읽고, English로도 만나 봐. 궁금한 이야기를 펼쳐도 좋아!']]},
  {id:'ready',title:'우리의 자석 악어 대작전!',image:'assembly-06.png',alt:'실제 악어의 위턱과 아래턱에 자석을 붙이는 사진',chapter:'버터비의 준비 시간',text:'이제 사진과 이야기를 따라 자석을 살펴보고, 봉투 속 준비물을 펼쳐서 나만의 악어를 만들어요. 직접 본 모습은 내 기록으로 남겨요.',lines:[['butterbee.png','버터비','실물로 할 때는 어른과 준비물을 확인하자. 가위는 조심조심!'],['labconi-charles.png','랩코니','자석은 입·코·귀에 넣지 않아. 떨어지거나 느슨한 자석은 어른에게 알려 줘.']],goals:['자석의 극을 찾을 수 있다.','자석 사이에 작용하는 힘의 종류를 설명할 수 있다.','자석 악어가 입을 다물고 먹이를 먹는 이유를 설명할 수 있다.']}
];
const ITEMS = [
  ...VIDEO_CARDS.map(value => ({kind:'video',value})),
  {kind:'story',value:STORIES[0]},
  {kind:'story',value:STORIES[1]},
  ...READINGS.map(value => ({kind:'reading',value})),
  {kind:'story',value:STORIES[2]}
];
const mounted = new WeakMap();
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const asset = name => new URL('../assets/' + name, import.meta.url).href;
const clamp = (value, min, max) => Math.max(min, Math.min(max, Number(value) || 0));

export function mountStudy(host, {onChange = () => {}} = {}) {
  if (mounted.has(host)) return mounted.get(host);
  let itemIndex = 0, pageIndex = 0, locale = 'ko', active = false, destroyed = false;
  let pages = [], atoms = [], anchor = null, inline = null, paginationFrame = 0;
  let shell, flow, aside, body, heading, title, languages, photo;
  let previousSize = '', pendingLastPage = false;
  const drafts = new Map(), videoPositions = new Map();
  const current = () => ITEMS[itemIndex];
  const role = () => window.__POPCORN_LAB__?.getState().role || 'self';
  const draftKey = () => role() + ':' + current().value.id + ':' + locale;
  const text = () => current().kind === 'story' ? current().value : current().value[locale];
  const getState = () => ({
    itemIndex, pageIndex, pageCount: Math.max(1, pages.length), itemCount: ITEMS.length,
    itemId: current().value.id, kind: current().kind, locale, active,
    title: text().title, anchor: anchor ? {...anchor} : null,
    video: inline?.getState() || null
  });
  const notify = () => { if (!destroyed) onChange(getState()); };
  function stopVideo() {
    if (!inline) return;
    const videoState = inline.getState();
    videoPositions.set(videoState.videoId, videoState);
    inline.destroy(); inline = null;
  }
  function buildAtoms() {
    const item = current(), value = item.value, copy = text(), result = [];
    const counts = new Map();
    const add = (type, content, extra = {}) => {
      const count = counts.get(type) || 0; counts.set(type,count + 1);
      result.push({id:value.id + ':' + type + ':' + count, type, text:content ?? '', offset:0, ...extra});
    };
    photo = {image:value.image,alt:item.kind === 'story' ? value.alt : copy.caption,caption:item.kind === 'story' ? '팝콘실험실 샤를 1호 · 실제 키트 사진' : copy.caption};
    if (item.kind === 'story') {
      add('text', value.text);
      value.lines.forEach(([image,name,line]) => add('dialogue',line,{image,name}));
      if (value.goals) {
        add('question','이번 주, 우리가 찾아낼 세 가지');
        value.goals.forEach((goal, i) => add('goal',goal,{number:i + 1}));
      }
    } else {
      add('deck',copy.deck);
      copy.paragraphs.forEach(paragraph => add('text',paragraph));
      add('label',locale === 'ko' ? '작은 낱말 노트' : 'A tiny word notebook');
      copy.words.forEach(([term,definition]) => add('word',definition,{term}));
      add('question',copy.question);
      add('response','',{question:copy.question});
      add('label',locale === 'ko' ? '읽기의 근거' : 'Sources for this story');
      value.sources.forEach(source => add('source',source.title,{source}));
    }
    return result;
  }
  function atomNode(atom) {
    const node = document.createElement(atom.type === 'photo' ? 'figure' : atom.type === 'text' || atom.type === 'deck' || atom.type === 'question' || atom.type === 'label' || atom.type === 'word' || atom.type === 'source' ? 'p' : 'div');
    node.dataset.studyAtom = atom.id;
    node.dataset.studyOffset = String(atom.offset || 0);
    if (atom.type === 'photo') {
      node.className = 'study-photo';
      node.innerHTML = `<img src="${asset(atom.image)}" alt="${esc(atom.alt)}"><figcaption>${esc(atom.caption)}</figcaption>`;
    } else if (atom.type === 'dialogue') {
      node.className = 'study-dialogue';
      node.innerHTML = `<img src="${asset(atom.image)}" alt="${esc(atom.name)}"><div><strong>${esc(atom.name)}</strong><p>${esc(atom.text)}</p></div>`;
    } else if (atom.type === 'word') {
      node.className = 'study-word';
      node.innerHTML = `<b>${esc(atom.term)}</b>${esc(atom.text)}`;
    } else if (atom.type === 'goal') {
      node.className = 'study-goal';
      node.innerHTML = `<span>${atom.number}.</span><p>${esc(atom.text)}</p>`;
    } else if (atom.type === 'response') {
      node.className = 'study-response';
      const label = document.createElement('label');
      label.textContent = locale === 'ko' ? '내 생각' : 'My idea';
      const input = document.createElement('textarea');
      input.id = 'study-response'; input.maxLength = 600;
      input.setAttribute('aria-label', atom.question);
      input.placeholder = locale === 'ko' ? '내 생각을 적어 보세요.' : 'Write your idea.';
      input.value = drafts.get(draftKey()) || '';
      label.append(input); node.append(label);
    } else if (atom.type === 'source') {
      node.className = 'study-source';
      const source = atom.source;
      node.innerHTML = `<b>${esc(source.publisher)}</b> · ${source.url ? `<a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(atom.text)}</a>` : esc(atom.text)}<br>${locale === 'ko' ? '확인' : 'Accessed'} ${esc(source.accessed)}`;
    } else {
      node.className = atom.type === 'question' ? 'study-question' : atom.type === 'label' ? 'study-source study-label' : 'study-text' + (atom.type === 'deck' ? ' study-deckline' : '');
      node.textContent = atom.text;
    }
    return node;
  }
  function rememberAnchor() {
    const first = pages[pageIndex]?.[0];
    anchor = first ? {id:first.id, offset:first.offset || 0} : null;
  }
  function displayPage({updateAnchor = true} = {}) {
    if (!flow || current().kind === 'video') return;
    pageIndex = clamp(pageIndex, 0, Math.max(0, pages.length - 1));
    const page = document.createElement('div'); page.className = 'study-page';
    (pages[pageIndex] || []).forEach(atom => page.append(atomNode(atom)));
    flow.replaceChildren(page);
    if (updateAnchor) rememberAnchor();
    shell.dataset.pageIndex = String(pageIndex);
    shell.dataset.pageCount = String(pages.length);
    notify();
  }
  // Split an oversized text atom without changing or dropping source characters.
  // Prefer complete sentences, then word boundaries if the screen is very short.
  function pieces(atom, measure, available) {
    if (!atom.text || ['photo','response','source'].includes(atom.type)) return [atom];
    let segments;
    if (typeof Intl.Segmenter === 'function') segments = Array.from(new Intl.Segmenter(locale, {granularity:'sentence'}).segment(atom.text), part => part.segment);
    else segments = atom.text.match(/[^.!?。！？]+[.!?。！？]*\s*|[.!?。！？]+\s*/gu) || [atom.text];
    const fits = content => { measure.replaceChildren(atomNode({...atom,text:content})); return measure.getBoundingClientRect().height <= available + .5; };
    const output = []; let pending = '', offset = atom.offset || 0;
    const commit = content => { output.push({...atom,text:content,offset}); offset += content.length; };
    for (const sentence of segments) {
      if (fits(pending + sentence)) { pending += sentence; continue; }
      if (pending) { commit(pending); pending = ''; }
      if (fits(sentence)) { pending = sentence; continue; }
      const words = sentence.match(/\S+\s*|\s+/gu) || [sentence];
      for (const word of words) {
        if (fits(pending + word)) { pending += word; continue; }
        if (pending) { commit(pending); pending = ''; }
        if (fits(word)) { pending = word; continue; }
        // A single unbroken word can be taller than the viewport at extreme zoom.
        for (const character of Array.from(word)) {
          if (pending && !fits(pending + character)) { commit(pending); pending = ''; }
          pending += character;
        }
      }
    }
    if (pending) commit(pending);
    return output.length ? output : [atom];
  }
  function paginate() {
    paginationFrame = 0;
    if (!active || destroyed || current().kind === 'video' || !flow) return;
    const available = flow.clientHeight;
    if (available < 48 || flow.clientWidth < 100) return;
    const currentAnchor = anchor ? {...anchor} : null;
    const oldPage = pageIndex, measure = document.createElement('div');
    measure.className = 'study-measure'; measure.setAttribute('aria-hidden','true'); measure.inert = true;
    flow.append(measure);
    const hasAside = matchMedia('(min-width:680px)').matches;
    body.classList.toggle('has-aside', hasAside);
    aside.hidden = !hasAside;
    shell.style.setProperty('--study-photo-height', Math.max(65, Math.min(190, available * .48)) + 'px');
    const source = hasAside ? atoms : [{id:current().value.id + ':photo',type:'photo',text:'',offset:0,...photo},...atoms];
    const result = []; let group = [];
    const fits = list => {
      measure.replaceChildren(...list.map(atomNode));
      return measure.getBoundingClientRect().height <= available + .5;
    };
    const commit = () => { if (group.length) result.push(group); group = []; };
    for (const atom of source) {
      if (fits([...group,atom])) { group.push(atom); continue; }
      commit();
      if (fits([atom])) { group.push(atom); continue; }
      for (const fragment of pieces(atom, measure, available)) {
        if (!fits([...group,fragment])) commit();
        group.push(fragment);
      }
    }
    commit(); measure.remove(); pages = result.length ? result : [[]];
    if (pendingLastPage) { pageIndex = pages.length - 1; pendingLastPage = false; }
    else if (currentAnchor) {
      const found = pages.findIndex(page => page.some(atom => atom.id === currentAnchor.id && (atom.offset || 0) <= currentAnchor.offset && (atom.offset || 0) + Math.max(1, atom.text.length) > currentAnchor.offset));
      pageIndex = found >= 0 ? found : clamp(oldPage,0,pages.length - 1);
    } else pageIndex = clamp(oldPage,0,pages.length - 1);
    shell.dataset.fit = pages.every(page => fitsInPage(page, available)) ? 'true' : 'false';
    displayPage();
  }
  function fitsInPage(page, available) {
    const probe = document.createElement('div'); probe.className = 'study-measure'; probe.setAttribute('aria-hidden','true'); probe.inert = true;
    probe.replaceChildren(...page.map(atomNode)); flow.append(probe);
    const fits = probe.getBoundingClientRect().height <= available + .5; probe.remove(); return fits;
  }
  function schedulePagination() {
    if (!active || destroyed || current().kind === 'video') return;
    cancelAnimationFrame(paginationFrame); paginationFrame = requestAnimationFrame(paginate);
  }
  function headingText() {
    const item = current(), value = item.value;
    title.textContent = text().title;
    shell.lang = item.kind === 'story' ? 'ko' : locale;
    shell.querySelector('.study-eyebrow').textContent = item.kind === 'story' ? value.chapter : item.kind === 'reading' ? value.topic[locale] : value.publisher;
    languages.hidden = item.kind === 'story';
    languages.setAttribute('aria-label',locale === 'ko' ? '읽기 언어' : 'Reading language');
    languages.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.studyLocale === locale)));
  }
  function render() {
    stopVideo(); cancelAnimationFrame(paginationFrame); paginationFrame = 0;
    pages = []; atoms = []; previousSize = '';
    const item = current();
    host.innerHTML = `<section class="study-deck${item.kind === 'video' ? ' is-video' : ''}" data-study-item="${esc(item.value.id)}"><header class="study-heading"><p class="study-eyebrow"></p><h1 id="intro-title" tabindex="-1"></h1><div class="study-languages" role="group"><button type="button" data-study-locale="ko">한국어</button><button type="button" data-study-locale="en">English</button></div></header><div class="study-body"></div></section>`;
    shell = host.querySelector('.study-deck'); heading = shell.querySelector('.study-heading');
    title = shell.querySelector('#intro-title'); languages = shell.querySelector('.study-languages'); body = shell.querySelector('.study-body');
    flow = aside = null; headingText();
    if (item.kind === 'video') {
      // The original demonstrations are spoken in Korean; language changes copy only.
      languages.hidden = true;
      const videoHost = document.createElement('div'); videoHost.className = 'study-video-host'; body.append(videoHost);
      const saved = videoPositions.get(item.value.videoId);
      inline = mountInlineVideo(videoHost,item.value,{locale,startTime:saved?.currentTime || 0,muted:saved?.muted ?? true,active,onState:notify});
      pageIndex = 0; pages = [[]]; anchor = null; pendingLastPage = false; notify();
    } else {
      atoms = buildAtoms();
      aside = document.createElement('figure'); aside.className = 'study-aside';
      aside.innerHTML = `<img src="${asset(photo.image)}" alt="${esc(photo.alt)}"><figcaption>${esc(photo.caption)}</figcaption>`;
      const hasAside = matchMedia('(min-width:680px)').matches;
      body.classList.toggle('has-aside',hasAside); aside.hidden = !hasAside;
      flow = document.createElement('div'); flow.className = 'study-flow';
      body.append(aside,flow);
      // A visible first frame also works before the first measured pagination.
      const first = document.createElement('div'); first.className = 'study-page'; flow.append(first);
      schedulePagination();
    }
    observer.disconnect(); observer.observe(host); observer.observe(body);
  }
  const observer = new ResizeObserver(() => {
    if (!shell || destroyed) return;
    const size = Math.round(host.clientWidth) + ':' + Math.round(host.clientHeight) + ':' + Math.round(body.clientHeight);
    if (size !== previousSize) { previousSize = size; schedulePagination(); }
  });
  const localeClick = event => { const button = event.target.closest('[data-study-locale]'); if (button && host.contains(button)) setLocale(button.dataset.studyLocale); };
  const input = event => { if (event.target.id === 'study-response') drafts.set(draftKey(), event.target.value); };
  host.addEventListener('click',localeClick); host.addEventListener('input',input);
  const fontsChanged = () => schedulePagination();
  document.fonts?.addEventListener?.('loadingdone',fontsChanged);
  document.fonts?.ready.then(() => { if (!destroyed) schedulePagination(); });
  function setLocale(value) {
    const next = value === 'en' ? 'en' : 'ko'; if (next === locale) return;
    locale = next;
    if (current().kind === 'video') { headingText(); languages.hidden = true; inline?.setLocale(locale); notify(); }
    else if (current().kind === 'reading') { if (anchor) anchor = {...anchor,offset:0}; render(); }
    else notify();
  }
  const api = {
    enter({reset = false} = {}) {
      active = true;
      if (reset) { itemIndex = 0; pageIndex = 0; anchor = null; pendingLastPage = false; }
      if (!shell || reset) render(); else { inline?.setActive(true); schedulePagination(); notify(); }
    },
    setActive(value) {
      const nextActive = Boolean(value);
      if (active === nextActive) return;
      active = nextActive; inline?.setActive(active);
      if (active) { if (!shell) render(); else schedulePagination(); }
      else { cancelAnimationFrame(paginationFrame); paginationFrame = 0; }
    },
    next() {
      if (!active) return false;
      if (current().kind !== 'video' && paginationFrame) { cancelAnimationFrame(paginationFrame); paginate(); }
      if (pageIndex < pages.length - 1) { pageIndex++; displayPage(); return true; }
      if (itemIndex >= ITEMS.length - 1) return false;
      itemIndex++; pageIndex = 0; anchor = null; pendingLastPage = false; render(); return true;
    },
    previous() {
      if (!active) return false;
      if (pageIndex > 0) { pageIndex--; displayPage(); return true; }
      if (itemIndex <= 0) return false;
      itemIndex--; pageIndex = 0; anchor = null; pendingLastPage = true; render(); return true;
    },
    getState,
    restore(snapshot = {}) {
      itemIndex = clamp(snapshot.itemIndex,0,ITEMS.length - 1);
      pageIndex = Math.max(0,Number(snapshot.pageIndex) || 0);
      locale = snapshot.locale === 'en' ? 'en' : 'ko';
      anchor = snapshot.anchor ? {...snapshot.anchor} : null;
      pendingLastPage = false;
      if (snapshot.video?.videoId) videoPositions.set(snapshot.video.videoId,{...snapshot.video});
      render();
    },
    setLocale,
    getPlayer: () => inline?.getPlayer() || null,
    destroy() {
      if (destroyed) return;
      destroyed = true; active = false; stopVideo(); observer.disconnect();
      cancelAnimationFrame(paginationFrame);
      host.removeEventListener('click',localeClick); host.removeEventListener('input',input);
      document.fonts?.removeEventListener?.('loadingdone',fontsChanged);
      mounted.delete(host);
    }
  };
  mounted.set(host,api); return api;
}
