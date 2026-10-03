// 교사용 고리 자석 대결. 두 실험은 한 경기의 서로 다른 팀 기록으로만 사용한다.
export const MAGNET_ROUNDS = [
  { title: '높고 낮은 탑', targets: [3, 0] },
  { title: '가운데 높이 찾기', targets: [1, 2] },
  { title: '역할 바꿔 쌓기', targets: [0, 3] },
];

export function judgeMagnetRow(row, target) {
  if (!row || !Number.isFinite(Number(row.floating)) || !Number.isFinite(Number(row.height))) return null;
  return { ok: Number(row.floating) === target, floating: Number(row.floating), height: Number(row.height), shape: String(row.shape || '') };
}

export function mountMagnetBattle(host, mountLab) {
  let round = 0, records = [null, null], submitted = [false, false], actual = [null, null];
  host.innerHTML = `<div class="mb-head"><div><span class="mb-eyebrow">2팀 자석 대결</span><h3 data-mb-title></h3><p>두 팀이 각자 제시된 층 수를 만들고 <b>표에 적기</b>를 누르세요. 기록을 고른 뒤 확정하면 함께 비교해요.</p></div><strong data-mb-round></strong></div>
    <div class="mb-standings"><div class="mb-result" data-mb-result role="status">두 팀의 기록을 기다리고 있어요.</div><button type="button" class="btn mb-next" data-mb-next hidden>새 대결</button></div>
    <div class="mb-teams">${[0, 1].map(i => `<section class="mb-team" data-mb-team="${i}"><header><b>${i + 1}팀</b><span data-mb-target="${i}"></span></header><div class="dk-3d" data-mount="lab" data-team="${i + 1}"></div><div class="mb-control"><label>비교할 기록 <select data-mb-pick="${i}" aria-label="${i + 1}팀 기록 선택"><option value="">먼저 표에 적어 주세요</option></select></label><button type="button" class="btn primary" data-mb-submit="${i}" disabled>기록 확정</button></div><p class="mb-status" data-mb-status="${i}" role="status">실험하고 표에 적어 주세요.</p><div class="mb-actual" data-mb-actual="${i}" hidden><span>실제 교구에서 확인</span><button type="button" data-mb-mark="${i}:O" aria-label="${i + 1}팀 실제 결과 동그라미">○</button><button type="button" data-mb-mark="${i}:X" aria-label="${i + 1}팀 실제 결과 엑스">×</button></div></section>`).join('')}</div>`;
  const $ = q => host.querySelector(q), $$ = q => [...host.querySelectorAll(q)];
  const current = () => MAGNET_ROUNDS[round % MAGNET_ROUNDS.length];
  const update = () => {
    const cfg = current();
    $('[data-mb-title]').textContent = cfg.title;
    $('[data-mb-round]').textContent = `${round % MAGNET_ROUNDS.length + 1} / ${MAGNET_ROUNDS.length} 대결`;
    [0, 1].forEach(i => {
      $(`[data-mb-target="${i}"]`).textContent = `목표: 떠 있는 층 ${cfg.targets[i]}곳`;
      const status = $(`[data-mb-status="${i}"]`), btn = $(`[data-mb-submit="${i}"]`), mark = $(`[data-mb-actual="${i}"]`);
      btn.disabled = submitted[i] || !$(`[data-mb-pick="${i}"]`).value;
      status.textContent = submitted[i] ? '기록 확정 · 두 팀이 마치면 함께 공개해요.' : '실험하고 표에 적어 주세요.';
      mark.hidden = !(submitted[0] && submitted[1]);
      $$(`[data-mb-mark^="${i}:"]`).forEach(b => b.setAttribute('aria-pressed', String(actual[i] === b.dataset.mbMark.split(':')[1])));
    });
    const result = $('[data-mb-result]'), next = $('[data-mb-next]');
    if (submitted[0] && submitted[1]) {
      const judged = records.map((r, i) => judgeMagnetRow(r, cfg.targets[i]));
      const heightOrder = judged[0].height === judged[1].height ? '두 탑의 높이가 같아요.' : `${judged[0].height > judged[1].height ? '1팀' : '2팀'} 탑이 더 높아요.`;
      result.textContent = `가상 실험 판정 · 1팀 ${judged[0].ok ? '○' : '×'} (${judged[0].floating}곳, ${judged[0].height}칸) · 2팀 ${judged[1].ok ? '○' : '×'} (${judged[1].floating}곳, ${judged[1].height}칸). ${heightOrder} 실제 교구의 결과는 선생님이 ○/×로 확인해 주세요.`;
      next.hidden = false;
    } else { result.textContent = '두 팀의 기록을 기다리고 있어요.'; next.hidden = true; }
  };
  const mount = () => [0, 1].forEach(i => {
    const mountedRound = round;
    const el = $(`[data-team="${i + 1}"]`), rows = [];
    mountLab(el, { rows, personal: false, lowPower: true, onRecord: list => {
      if (round !== mountedRound || submitted[i] || !host.isConnected) return;
      const select = $(`[data-mb-pick="${i}"]`), previous = select.value;
      select.innerHTML = '<option value="">기록을 골라 주세요</option>' + list.map((r, j) => `<option value="${j}">${j + 1}번 · ${String(r.shape).replace(/[&<>\"]/g, '')} · ${Number(r.floating)}곳 · ${Number(r.height)}칸</option>`).join('');
      select.value = previous || String(list.length - 1);
      select._rows = list;
      update();
    } });
  });
  $$('[data-mb-pick]').forEach(select => select.addEventListener('change', update));
  $$('[data-mb-submit]').forEach(btn => btn.addEventListener('click', () => {
    const i = Number(btn.dataset.mbSubmit), select = $(`[data-mb-pick="${i}"]`), row = select._rows?.[Number(select.value)];
    if (!row || submitted[i]) return;
    records[i] = { ...row }; submitted[i] = true; select.disabled = true; update();
    if (submitted.every(Boolean)) host.scrollTop = 0;
  }));
  $$('[data-mb-mark]').forEach(btn => btn.addEventListener('click', () => {
    if (!submitted.every(Boolean)) return;
    const [i, mark] = btn.dataset.mbMark.split(':'); actual[Number(i)] = mark; update();
  }));
  $('[data-mb-next]').addEventListener('click', () => {
    round++; records = [null, null]; submitted = [false, false]; actual = [null, null];
    [0, 1].forEach(i => { const pick = $(`[data-mb-pick="${i}"]`); pick.disabled = false; pick._rows = []; pick.innerHTML = '<option value="">먼저 표에 적어 주세요</option>'; const old = $(`[data-team="${i + 1}"]`); old.replaceWith(old.cloneNode(false)); });
    mount(); update(); host.scrollTop = 0;
  });
  mount(); update();
}
