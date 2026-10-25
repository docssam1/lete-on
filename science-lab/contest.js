// 대회 폴더 — #/contest/<대회>. 첫 화면에서 대회를 누르면 맨 앞 장(대회 안내 카드)에서 이리로 온다.
// 한 폴더 = 이 대회가 무엇인지 · 대회 날 하는 일 · 심사에서 보는 것 · 여기서 연습하는 법 · 자주 나온 과제 · 나가기 전에 · 근거 자료 + 이 대회로 연습할 곳(연습 세트·실험).
// 내용은 data/contests.js(근거와 「확인 못 함」까지 그 파일에 적는다).
import { CONTESTS, ORDERED, contestsOf, levelOf, domainOf } from './data/curriculum.js';
import { CONTEST_GUIDE } from './data/contests.js';
import { OBSERVE_SETS } from './data/observe-sets.js';
import { mountPark } from './park.js';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function renderContest($app, { topbar, footer }, id) {
  const C = CONTESTS.find((c) => c.id === id) || CONTESTS.find((c) => c.id === 'nature'), G = CONTEST_GUIDE[C.id];
  const units = ORDERED.filter((u) => contestsOf(u).includes(C)), sets = C.id === 'nature' ? OBSERVE_SETS : [];
  const pct = G.judge.rows.every((r) => /%$/.test(r[1]));
  let n = 0; const sheet = (title, body, cls = '') => `<section class="ct-sheet ${cls}"><h2><span>${String(++n).padStart(2, '0')}</span>${esc(title)}</h2>${body}</section>`;
  const dl = (rows, cls = '') => `<dl class="ct-dl ${cls}">${rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>`;
  const unitLi = (u) => `<li><a href="#/u/${u.id}"><span class="lv">${esc(levelOf(u).title)}</span><b>${esc(u.title)}</b><small>${esc(domainOf(u).title)} · ${esc(u.activity.title)}</small></a><a class="rp" href="#/u/${u.id}/report?ct=${C.id}">보고서 →</a></li>`;
  const setLi = (x) => `<li><a href="#/observe/${x.id}"><span class="lv">${x.level === 'mid' ? '중등' : '초등'}</span><b>${esc(x.title)}</b><small>표본 ${x.mod.SPECIMENS.length}종 · ${esc(x.steps.slice(0, 3).join(' → '))} …</small></a></li>`;
  $app.innerHTML = `${topbar('#/')}
  <main class="opened contest-page ct-${C.id}" style="--ct:${G.color}">
    <div class="wrap unit-head folder-label ct-head"><span class="label-tab">${G.icon} CONTEST FOLDER</span>
      <nav class="ct-folders" aria-label="대회 폴더">${CONTESTS.map((c) => `<a href="#/contest/${c.id}" class="${c.id}" aria-current="${c.id === C.id}">${CONTEST_GUIDE[c.id].icon} ${esc(c.title)}</a>`).join('')}</nav>
      <h1>${esc(C.title)}</h1>
      <p class="ct-sub">${esc(C.sub)}</p>
      <p class="sub">${esc(G.lead)}</p>
      <div class="ct-jump">${sets.length ? `<a href="#/observe/${sets[0].id}">${G.icon} 연습 세트 ${sets.length}개 바로 가기</a>` : ''}${units.length ? `<a href="#/contest/${C.id}" data-scroll="ct-practice">이 대회로 연습할 실험 ${units.length}개</a>` : ''}</div>
    </div>
    ${C.id === 'nature' ? '<section class="wrap ct-park" aria-label="자연관찰 공원 지도"></section>' : ''}
    <div class="wrap ct-grid" id="ct-guide">
      <div class="ct-main">
        ${sheet('이 대회는', `${dl(G.names, 'names')}${dl(G.facts)}`)}
        ${sheet('대회 날 하는 일', `<ol class="ct-steps">${G.day.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>`)}
        ${sheet('심사에서 보는 것', `${pct ? `<div class="ct-bar">${G.judge.rows.map(([k, v]) => `<span style="flex:${parseFloat(v)}"><b>${esc(v)}</b>${esc(k)}</span>`).join('')}</div>` : ''}
          <table class="ct-table"><thead><tr><th>영역</th>${G.judge.rows.some((r) => r[1]) ? '<th>비중</th>' : ''}<th>보는 것</th></tr></thead><tbody>${G.judge.rows.map(([k, v, w]) => `<tr><th>${esc(k)}</th>${G.judge.rows.some((r) => r[1]) ? `<td class="num">${esc(v)}</td>` : ''}<td>${esc(w)}</td></tr>`).join('')}</tbody></table>
          <p class="ct-src">기준: ${esc(G.judge.src)}</p>${G.judge.note ? `<p class="ct-note">${esc(G.judge.note)}</p>` : ''}`)}
        ${sheet('그래서 여기서는 이렇게 연습해요', `<ul class="ct-train">${G.train.map(([k, v]) => `<li><b>${esc(k)}</b><span>${esc(v)}</span></li>`).join('')}</ul>`, 'train')}
        ${G.tasks ? sheet('자주 나온 과제', `<p class="ct-p">${esc(G.tasks.lead)}</p><ul class="ct-list">${G.tasks.rows.map(([t, set]) => `<li>${esc(t)}${set ? ` <a class="ct-go" href="#/observe/${set}">연습 세트 →</a>` : ''}</li>`).join('')}</ul>`) : ''}
        ${sheet('나가기 전에', `<ul class="ct-list warn">${G.cautions.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`)}
        ${sheet('근거 자료', `<ul class="ct-list src">${G.src.map((t) => `<li>${esc(t)}</li>`).join('')}</ul><p class="ct-note">요강은 해마다, 시·도마다 바뀌어요. 이 안내는 연습을 위한 정리이고, 대회에 나갈 때는 그해 요강이 기준이에요.</p>`)}
      </div>
      <aside class="ct-side" id="ct-practice" aria-label="이 대회로 연습할 곳">
        ${sets.length ? `<div class="ct-box"><h3>${G.icon} 자연관찰 연습 <small>대회 과제 꼴 그대로 · 3D 표본과 실사 사진</small></h3><ol class="ct-links">${sets.map(setLi).join('')}</ol></div>` : ''}
        <div class="ct-box"><h3>🧪 이 대회로 연습할 실험 <small>「보고서 →」는 ${esc(C.title)} 양식으로 열려요(처음 쓸 때)</small></h3><ol class="ct-links">${units.map(unitLi).join('')}</ol></div>
      </aside>
    </div>
  </main>${footer()}`;
  // 자연관찰 폴더는 공원 지도부터(원장 2026-10-25)
  // 같은 쪽 안에서 내려가기(해시 라우터라 #아이디 링크를 쓰지 않는다)
  $app.querySelectorAll('[data-scroll]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); document.getElementById(a.dataset.scroll)?.scrollIntoView({ behavior: 'smooth' }); }));
  const park = C.id === 'nature' ? mountPark($app.querySelector('.ct-park')) : null;
  return { destroy() { park?.destroy(); } };
}
