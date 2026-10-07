import { LAB_BATTLE_ROUNDS, battleTargetText, battleRowText, matchesBattleTarget, battleVerdict } from './lab-battle-model.js';
const esc = value => String(value ?? '').replace(/[&<>\"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function mountLabBattle(host, unit, mountLab) {
  const rounds = LAB_BATTLE_ROUNDS[unit];
  if (!rounds) return;
  host.classList.add('gfield-ui'); host.dataset.unit = unit;
  let round = 0, generation = 0, predictions, records, submitted, actual, revealed, handles = [];
  const $ = selector => host.querySelector(selector), $$ = selector => [...host.querySelectorAll(selector)];
  const current = () => rounds[round % rounds.length];
  const ready = () => submitted.every(Boolean);
  const selectedRow = i => { const pick = $(`[data-lb-pick="${i}"]`); return pick.value === '' ? null : pick._rows?.[Number(pick.value)]; };
  const update = () => {
    [0, 1].forEach(i => {
      const status = $(`[data-lb-status="${i}"]`);
      $(`[data-lb-submit="${i}"]`).disabled = submitted[i] || !matchesBattleTarget(unit, selectedRow(i), current().targets[i]);
      status.textContent = submitted[i] ? '기록 확정 · 함께 정답을 확인해요.' : predictions[i] === null ? '먼저 예상 하나를 골라 확정해 주세요.' : !predictions.every(value => value !== null) ? '예상 확정 · 다른 팀을 기다려 주세요.' : '과제 조건으로 실험하고 표에 적어 주세요.';
      $(`[data-lb-actual="${i}"]`).hidden = !revealed;
      $$(`[data-lb-mark^="${i}:"]`).forEach(button => button.setAttribute('aria-pressed', String(actual[i] === button.dataset.lbMark.split(':')[1])));
    });
    $('[data-lb-check]').hidden = !ready() || revealed;
    $('[data-lb-next]').hidden = !revealed;
    const result = $('[data-lb-result]');
    if (revealed) {
      const verdict = battleVerdict(unit, current(), records, predictions);
      result.textContent = verdict ? `가상 모형의 기록으로 확인 · ${[0, 1].map(i => `${i + 1}팀 ${verdict.ok[i] ? '○' : '×'} · ${current().choices[verdict.answers[i]]}`).join(' / ')}. 실제 관찰 결과는 선생님이 따로 확인해 주세요.` : '비교할 기록을 다시 확인해 주세요.';
    } else result.textContent = ready() ? '두 팀의 기록이 모였어요. 정답 확인을 눌러 보세요.' : '두 팀이 예상을 확정하면 실험실이 열려요. 기록을 모두 모은 뒤 함께 확인해요.';
  };
  const mount = () => {
    const token = generation;
    [0, 1].forEach(i => {
      const el = $(`[data-team="${i + 1}"]`);
      el.textContent = '실험실을 준비하고 있어요…';
      Promise.resolve(mountLab(el, { rows: [], personal: false, lowPower: true, fixedSource: unit === 's41-u03', onRecord: list => {
        if (token !== generation || !host.isConnected || submitted[i]) return;
        const pick = $(`[data-lb-pick="${i}"]`), rows = list.map(row => ({ ...row }));
        pick._rows = rows;
        pick.innerHTML = '<option value="">비교할 기록을 고르세요</option>' + rows.map((row, j) => `<option value="${j}" ${matchesBattleTarget(unit, row, current().targets[i]) ? '' : 'disabled'}>${esc(battleRowText(unit, row))}</option>`).join('');
        const latest = rows.findLastIndex(row => matchesBattleTarget(unit, row, current().targets[i]));
        pick.value = latest >= 0 ? String(latest) : '';
        update();
      } })).then(handle => {
        if (token !== generation || !host.isConnected) handle?.dispose?.();
        else handles[i] = handle;
      }).catch(() => { if (token === generation && host.isConnected) el.textContent = '실험실을 열지 못했어요. 배틀 모드를 껐다가 다시 켜 주세요.'; });
    });
  };
  const startRound = () => {
    host.classList.remove('lb-running'); generation++; handles.forEach(handle => handle?.dispose?.()); handles = [];
    predictions = [null, null]; records = [null, null]; submitted = [false, false]; actual = [null, null]; revealed = false;
    const config = current();
    host.innerHTML = `<div class="mb-head"><div><span class="mb-eyebrow">2팀 탐구 대결</span><h3>${esc(config.title)}</h3><p>① 두 팀 예상 확정 → ② 실험과 기록 → ③ 함께 정답 확인</p></div><strong>${round % rounds.length + 1} / ${rounds.length} 대결</strong></div>
      <p class="lb-question">${esc(config.question)}</p>
      ${unit === 's51-u01' ? '<p class="lb-note">튄 방울 수는 지도자료 측정값을 바탕으로 한 모형이에요. 두 팀 모두 세 번 재어 평균으로 비교해요.</p>' : unit === 's42-u05' ? '<p class="lb-note">몇 시간 걸리는 변화를 몇 초로 줄인 모형이에요. 수조와 바닷물의 양은 두 팀 모두 같아요.</p>' : unit === 's42-u04' ? '<p class="lb-note">지층 모형의 변화 단계를 비교하는 가상 실험이에요. 우드락의 수와 크기는 두 팀 모두 같아요.</p>' : unit === 's42-u03' ? '<p class="lb-note">그림자 길이는 빛이 곧게 나아간다는 원리로 계산한 모형 값이에요. 손전등과 스크린은 두 팀 모두 같은 자리예요.</p>' : unit === 's42-u02' ? '<p class="lb-note">같은 시간 동안 관찰하는 예시 모형이에요. 실제 물방울 수·습도 측정값과는 달라요.</p>' : unit === 's41-u03' ? '<p class="lb-note">컵은 두 팀 모두 같은 기본 위치에 놓여요. 과제에서 정한 경사와 물의 양을 골라 주세요.</p>' : unit === 's41-u03b' ? '<p class="lb-note">백반은 암석이 아닌 모형 재료예요. 화면 속 가열은 가상 실험이며 실제 가열은 선생님만 해요.</p>' : ''}
      <div class="mb-standings"><p class="mb-result" data-lb-result role="status"></p><button type="button" class="btn primary" data-lb-check hidden>정답 확인</button><button type="button" class="btn mb-next" data-lb-next hidden>새 대결</button></div>
      <div class="mb-teams">${[0, 1].map(i => `<section class="mb-team"><header><b>${i + 1}팀</b><span>과제: ${esc(battleTargetText(unit, config.targets[i]))}</span></header>
        <div class="lb-predict"><label>우리 팀 예상<select data-lb-predict="${i}" aria-label="${i + 1}팀 예상"><option value="">예상을 골라 주세요</option>${config.choices.map((text, j) => `<option value="${j}">${esc(text)}</option>`).join('')}</select></label><button type="button" class="btn primary" data-lb-lock="${i}" disabled>예상 확정</button></div>
        <div class="dk-3d lb-lab" data-mount="lab" data-team="${i + 1}"><p class="lb-wait">두 팀이 예상을 확정하면 실험실이 열려요.</p></div>
        <div class="mb-control"><label>비교할 기록<select data-lb-pick="${i}" aria-label="${i + 1}팀 기록"><option value="">과제 조건으로 표에 적어 주세요</option></select></label><button type="button" class="btn primary" data-lb-submit="${i}" disabled>기록 확정</button></div><p class="mb-status" data-lb-status="${i}" role="status"></p>
        <div class="mb-actual" data-lb-actual="${i}" hidden><span>실제 관찰 확인</span><button type="button" data-lb-mark="${i}:O" aria-label="${i + 1}팀 실제 결과 동그라미">○</button><button type="button" data-lb-mark="${i}:X" aria-label="${i + 1}팀 실제 결과 엑스">×</button></div></section>`).join('')}</div>`;
    $$('[data-lb-predict]').forEach(select => select.addEventListener('change', () => { $(`[data-lb-lock="${select.dataset.lbPredict}"]`).disabled = select.value === ''; }));
    $$('[data-lb-lock]').forEach(button => button.addEventListener('click', () => {
      const i = Number(button.dataset.lbLock), select = $(`[data-lb-predict="${i}"]`);
      if (predictions[i] !== null || select.value === '') return;
      predictions[i] = Number(select.value); select.disabled = true; button.disabled = true; button.textContent = '예상 확정됨';
      if (predictions.every(value => value !== null)) { host.classList.add('lb-running'); mount(); }
      update();
    }));
    $$('[data-lb-pick]').forEach(select => select.addEventListener('change', update));
    $$('[data-lb-submit]').forEach(button => button.addEventListener('click', () => {
      const i = Number(button.dataset.lbSubmit), row = selectedRow(i);
      if (submitted[i] || !matchesBattleTarget(unit, row, current().targets[i])) return;
      records[i] = { ...row }; submitted[i] = true; $(`[data-lb-pick="${i}"]`).disabled = true; update();
      if (ready()) { host.scrollTop = 0; $('[data-lb-check]').focus({ preventScroll: true }); }
    }));
    $('[data-lb-check]').addEventListener('click', () => { if (ready()) { revealed = true; update(); } });
    $$('[data-lb-mark]').forEach(button => button.addEventListener('click', () => { if (revealed) { const [i, mark] = button.dataset.lbMark.split(':'); actual[Number(i)] = mark; update(); } }));
    $('[data-lb-next]').addEventListener('click', () => { round++; startRound(); host.scrollTop = 0; $('[data-lb-predict="0"]').focus({ preventScroll: true }); });
    update();
  };
  startRound();
}
