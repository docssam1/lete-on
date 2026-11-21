// 2과정 개념 꾸러미의 카드 장(DESIGN-COURSE2.md 4절) — 되짚기 · 정리 · 예제 따라 풀기.
// 덱(study.js)이 개념 장(native)으로 붙인다: mountPackCard(host, { board: "<권>/<꾸러미 id>/<recall|summary|example>", deckNav, atEnd, onStep, onDone })
// 덱 약속은 판서와 같다 — step(±1)이 true를 돌려주면 장 안에서 넘긴 것, false면 덱이 다음 장으로 간다.
// 꾸러미 자료는 course2-concepts/<권>.js(PACKS). 예제는 창작 문제라 단계 답을 자료 파일에 둔다.
const TAGS = { g1: "20261121g", g2: "20261121h", g3: "20261121i", g4: "20261121e", g5: "20261121e" };
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const norm = (s) => String(s ?? "").replace(/\s+/g, "").replace(/[°도]$/u, "").replace(/,/g, "").toLowerCase();

export async function loadPack(book, id) {
  const mod = await import(`./course2-concepts/${book}.js?v=${TAGS[book] || "20261121e"}`);
  for (const list of Object.values(mod.PACKS || {})) {
    const found = list.find((pack) => pack.id === id);
    if (found) return found;
  }
  return null;
}

const figure = (fig, cls = "") => fig ? `<figure class="pk-fig ${cls}">${typeof fig === "function" ? fig() : fig}</figure>` : "";

function recallMarkup(pack) {
  const r = pack.recall;
  return `<div class="pk pk-recall">
    ${figure(r.figure)}
    <div class="pk-side">
      <p class="pk-kick">되짚기 · 먼저 알아야 할 것</p>
      <p class="pk-text">${r.text}</p>
      <p class="pk-ask">${esc(r.ask)}</p>
      <div class="pk-options" role="group" aria-label="답 고르기">${r.options.map((o, k) => `<button type="button" class="pk-opt" data-k="${k}">${esc(o)}</button>`).join("")}</div>
      <p class="pk-feedback" aria-live="polite" hidden></p>
    </div>
  </div>`;
}

function summaryMarkup(pack) {
  const s = pack.summary;
  return `<div class="pk pk-summary">
    ${figure(s.figure)}
    <div class="pk-side">
      <p class="pk-kick">정리 · ${esc(pack.title)}</p>
      ${s.terms?.length ? `<dl class="pk-terms">${s.terms.map(([t, d]) => `<div><dt>${esc(t)}</dt><dd>${d}</dd></div>`).join("")}</dl>` : ""}
      <ol class="pk-facts">${s.facts.map((f) => `<li>${f}</li>`).join("")}</ol>
      ${pack.pitfall ? `<p class="pk-pitfall"><b>이것만 조심</b>${esc(pack.pitfall)}</p>` : ""}
    </div>
  </div>`;
}

function exampleMarkup(pack) {
  const e = pack.example;
  return `<div class="pk pk-example">
    <div class="pk-problem">
      <p class="pk-kick">예제 따라 풀기</p>
      <p class="pk-prompt">${e.prompt}</p>
      ${figure(e.figure)}
    </div>
    <ol class="pk-steps">${e.steps.map((step, k) => `<li class="pk-step" data-k="${k}" data-no="${k + 1}" hidden>
      <p class="pk-step-ask">${step.ask}</p>
      <div class="pk-step-in"><input type="text" inputmode="${step.text ? "text" : "decimal"}" autocomplete="off" aria-label="${k + 1}단계 답"><span class="pk-unit">${esc(step.unit || "")}</span><button type="button" class="pk-check">확인</button></div>
      <p class="pk-step-msg" aria-live="polite" hidden></p>
    </li>`).join("")}</ol>
  </div>`;
}

export function mountPackCard(host, { board = "", onStep = () => {}, onDone = () => {}, atEnd = false } = {}) {
  const [book, id, card] = String(board).split("/");
  let pack = null, gone = false, shown = 0, done = false;
  host.innerHTML = '<p class="sd-wait">준비하고 있어요…</p>';
  const ready = loadPack(book, id).then((found) => {
    if (gone) return;
    pack = found;
    if (!pack || !pack[card]) { host.innerHTML = '<p class="sd-wait">내용을 찾지 못했어요.</p>'; return; }
    host.innerHTML = card === "recall" ? recallMarkup(pack) : card === "summary" ? summaryMarkup(pack) : exampleMarkup(pack);
    if (card === "recall") bindRecall();
    if (card === "example") { bindExample(); showUpTo(atEnd ? pack.example.steps.length : 1); }
    onStep();
  }).catch(() => { if (!gone) host.innerHTML = '<p class="sd-wait">불러오지 못했어요. 새로고침해 주세요.</p>'; });

  function bindRecall() {
    const r = pack.recall;
    const feedback = host.querySelector(".pk-feedback");
    host.querySelectorAll(".pk-opt").forEach((button) => button.addEventListener("click", () => {
      const right = Number(button.dataset.k) === r.answer;
      host.querySelectorAll(".pk-opt").forEach((b) => b.classList.toggle("is-right", Number(b.dataset.k) === r.answer && right));
      button.classList.toggle("is-wrong", !right);
      feedback.hidden = false;
      feedback.className = `pk-feedback ${right ? "is-right" : "is-wrong"}`;
      feedback.innerHTML = right ? `맞아요! ${r.why}` : `다시 생각해 봐요. ${r.hint || r.why}`;
      if (right && !done) { done = true; onDone(); }
      onStep();
    }));
  }
  function reveal() {   // 되짚기 답을 보여 준다(덱 「다음」을 눌렀는데 아직 안 골랐을 때)
    const r = pack.recall;
    host.querySelectorAll(".pk-opt").forEach((b) => b.classList.toggle("is-right", Number(b.dataset.k) === r.answer));
    const feedback = host.querySelector(".pk-feedback");
    feedback.hidden = false; feedback.className = "pk-feedback is-right";
    feedback.innerHTML = `답은 「${esc(r.options[r.answer])}」예요. ${r.why}`;
    done = true;
  }

  const stepEls = () => [...host.querySelectorAll(".pk-step")];
  function showUpTo(n) {
    shown = Math.max(1, Math.min(n, pack.example.steps.length));
    stepEls().forEach((li, k) => {
      li.hidden = k >= shown;
      if ((k < shown - 1 || (atEnd && k < shown)) && !li.classList.contains("is-done")) finishStep(li, k, false);
    });
    stepEls()[shown - 1]?.querySelector("input:not([disabled])")?.focus({ preventScroll: true });
  }
  function finishStep(li, k, right) {
    const step = pack.example.steps[k];
    const input = li.querySelector("input");
    if (!right) input.value = step.answer;
    input.disabled = true;
    li.querySelector(".pk-check").hidden = true;
    li.classList.add("is-done");
    const msg = li.querySelector(".pk-step-msg");
    msg.hidden = false; msg.className = "pk-step-msg is-right";
    msg.innerHTML = `${right ? "맞아요! " : ""}<b>까닭</b> ${step.why}`;
  }
  function bindExample() {
    stepEls().forEach((li, k) => {
      const check = () => {
        const step = pack.example.steps[k];
        const input = li.querySelector("input");
        const ok = [step.answer, ...(step.accept || [])].some((a) => norm(a) === norm(input.value));
        if (ok) {
          finishStep(li, k, true);
          if (k + 1 < pack.example.steps.length) { if (shown <= k + 1) showUpTo(k + 2); }
          else if (!done) { done = true; onDone(); }
        } else {
          const msg = li.querySelector(".pk-step-msg");
          msg.hidden = false; msg.className = "pk-step-msg is-wrong";
          msg.innerHTML = input.value.trim() ? `다시 해 봐요. ${step.hint || step.why}` : "답을 써 보고 「확인」을 눌러요.";
        }
        onStep();
      };
      li.querySelector(".pk-check").addEventListener("click", check);
      li.querySelector("input").addEventListener("keydown", (event) => { if (event.key === "Enter") { event.preventDefault(); check(); } });
    });
  }

  return {
    ready,
    step(dir) {
      if (!pack) return false;
      if (card === "recall") { if (dir > 0 && !done) { reveal(); onStep(); return true; } return false; }
      if (card !== "example") return false;
      const steps = pack.example.steps.length;
      if (dir > 0) {
        const li = stepEls()[shown - 1];
        if (li && !li.classList.contains("is-done")) { finishStep(li, shown - 1, false); onStep(); return true; }
        if (shown < steps) { showUpTo(shown + 1); onStep(); return true; }
        return false;
      }
      if (shown > 1) { stepEls()[shown - 1].hidden = true; shown -= 1; onStep(); return true; }
      return false;
    },
    hasNext() {
      if (!pack) return false;
      if (card === "recall") return !done;
      if (card !== "example") return false;
      const li = stepEls()[shown - 1];
      return shown < pack.example.steps.length || Boolean(li && !li.classList.contains("is-done"));
    },
    hasPrev: () => card === "example" && shown > 1,
    dispose() { gone = true; }
  };
}
