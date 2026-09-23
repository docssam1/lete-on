// Frame contract: index is zero-based; id identifies the complete problem, not a fold step.
// Battle shares one seed, rotating each queue left by offset; player salts answer order.
// solved.mistakes is an optional nonnegative integer; absent means zero.
export const messages = {
  ko: {
    participants: "참가 인원", playerC: "플레이어 C", playerD: "플레이어 D", settings: "설정", rank: "순위", participant: "참가자", completed: "완료 수", mistakes: "오답 수", unknown: "미확인", pointScore: "{count}점", allFinished: "모든 플레이어가 문제를 완료했어요.", jointWinners: "공동 1위: {players}",
    points: "정확도 점수", solvedCount: "해결 {count} / {total}", pointsTally: "A {a}점 · B {b}점", winner: "{player} 승리!", pointsTie: "무승부!",
    title: "색종이 생각 놀이", language: "언어", exit: "생각 놀이터로 나가기", modes: "놀이 방식", solo: "혼자 풀기", together: "함께 풀기", battle: "한 기기 배틀", level: "유형", level1: "접어 자르기", level2: "접어 구멍 뚫기", count: "문제 수", newRound: "새로 시작", playerA: "플레이어 A", playerB: "플레이어 B", sharedProgress: "함께 해결한 문제", loading: "문제를 준비하고 있어요.", ready: "A 차례부터 시작해요", battleReady: "모두 준비됐나요?", start: "준비, 시작!", turn: "{player} 차례", solved: "{player} 완료", handoff: "{player} 완료 / {next} 차례", continue: "{player} 차례 시작", next: "다음 문제", finish: "마치기", finishing: "결과를 확인하고 있어요.", complete: "모두 해결했어요!", bothDone: "두 플레이어 모두 완료!", tally: "A {a}문제 · B {b}문제", battleStatus: "해결한 문제 수", sharedStatus: "한 문제씩 번갈아 풀기", waiting: "다른 플레이어를 기다리고 있어요.", playAgain: "한 번 더", error: "게임을 불러오지 못했어요", retry: "다시 시작", timeout: "게임의 응답이 없어요. 다시 시작해 주세요.", localOnly: "로컬 웹 주소에서 게임을 열어 주세요.", resetConfirm: "진행 중인 놀이를 끝내고 새로 시작할까요?", frame: "{player}의 색종이 놀이", sharedFrame: "함께 푸는 색종이 놀이", tie: "같은 수의 문제를 해결했어요." },
  en: {
    participants: "Players", playerC: "Player C", playerD: "Player D", settings: "Settings", rank: "Rank", participant: "Player", completed: "Solved", mistakes: "Mistakes", unknown: "Unknown", pointScore: "{count} pts", allFinished: "Every player has completed the round.", jointWinners: "Joint winners: {players}",
    points: "Accuracy points", solvedCount: "Solved {count} / {total}", pointsTally: "A: {a} points · B: {b} points", winner: "{player} wins!", pointsTie: "A tie!",
    title: "Paper Fold", language: "Language", exit: "Exit to the studio", modes: "Play mode", solo: "Solo", together: "Together", battle: "One-device battle", level: "Type", level1: "Fold and cut", level2: "Fold and punch", count: "Problems", newRound: "New round", playerA: "Player A", playerB: "Player B", sharedProgress: "Shared progress", loading: "Getting the problems ready.", ready: "Player A goes first", battleReady: "Is everyone ready?", start: "Ready, start!", turn: "{player}'s turn", solved: "{player} completed", handoff: "{player} completed / {next}'s turn", continue: "Start {player}'s turn", next: "Next problem", finish: "Finish", finishing: "Checking the results.", complete: "All problems solved!", bothDone: "Both players finished!", tally: "A: {a} solved · B: {b} solved", battleStatus: "Problems solved", sharedStatus: "One whole problem per turn", waiting: "Waiting for the other player.", playAgain: "Play again", error: "The game could not load", retry: "Restart", timeout: "The game is not responding. Please restart.", localOnly: "Open the game at a local web address.", resetConfirm: "End this round and start a new one?", frame: "{player}'s Paper Fold game", sharedFrame: "Shared Paper Fold game", tie: "You solved the same number of problems." },
  zh: {
    participants: "参与人数", playerC: "玩家 C", playerD: "玩家 D", settings: "设置", rank: "名次", participant: "玩家", completed: "完成题数", mistakes: "错误次数", unknown: "未知", pointScore: "{count}分", allFinished: "所有玩家都完成了本轮题目。", jointWinners: "并列第一：{players}",
    points: "准确度得分", solvedCount: "完成 {count} / {total}", pointsTally: "A {a}分 · B {b}分", winner: "{player} 获胜！", pointsTie: "平局！",
    title: "彩纸思维游戏", language: "语言", exit: "返回思维乐园", modes: "游戏模式", solo: "单人练习", together: "轮流合作", battle: "同机对战", level: "类型", level1: "折纸剪纸", level2: "折纸打孔", count: "题数", newRound: "重新开始", playerA: "玩家 A", playerB: "玩家 B", sharedProgress: "共同完成", loading: "正在准备题目。", ready: "从玩家 A 开始", battleReady: "所有玩家都准备好了吗？", start: "准备，开始！", turn: "轮到 {player}", solved: "{player} 已完成", handoff: "{player} 已完成 / 轮到 {next}", continue: "开始 {player} 的回合", next: "下一题", finish: "完成", finishing: "正在确认结果。", complete: "全部完成！", bothDone: "两位玩家都完成了！", tally: "A 完成 {a} 题 · B 完成 {b} 题", battleStatus: "已完成题数", sharedStatus: "每人轮流完成一道题", waiting: "等待另一位玩家。", playAgain: "再玩一次", error: "游戏加载失败", retry: "重新开始", timeout: "游戏没有响应，请重新开始。", localOnly: "请通过本地网页地址打开游戏。", resetConfirm: "结束本轮并重新开始吗？", frame: "{player} 的彩纸游戏", sharedFrame: "共同完成的彩纸游戏", tie: "两位完成的题数相同。" },
  ja: {
    participants: "参加人数", playerC: "プレイヤー C", playerD: "プレイヤー D", settings: "設定", rank: "順位", participant: "参加者", completed: "完成数", mistakes: "間違い", unknown: "不明", pointScore: "{count}点", allFinished: "全員が問題を終えました。", jointWinners: "同点1位：{players}",
    points: "正確さの得点", solvedCount: "完成 {count} / {total}", pointsTally: "A {a}点 · B {b}点", winner: "{player} の勝ち！", pointsTie: "引き分け！",
    title: "色紙思考あそび", language: "言語", exit: "思考ひろばへ戻る", modes: "遊び方", solo: "ひとりで", together: "交代で", battle: "1台で対戦", level: "種類", level1: "折って切る", level2: "折って穴あけ", count: "問題数", newRound: "最初から", playerA: "プレイヤー A", playerB: "プレイヤー B", sharedProgress: "ふたりの進み具合", loading: "問題を準備しています。", ready: "A の番から始めよう", battleReady: "みんな準備できた？", start: "準備、スタート！", turn: "{player} の番", solved: "{player} が完成", handoff: "{player} が完成 / 次は {next} の番", continue: "{player} の番を始める", next: "次の問題", finish: "終わる", finishing: "結果を確認しています。", complete: "全部できました！", bothDone: "ふたりとも完成！", tally: "A {a}問 · B {b}問", battleStatus: "解けた問題の数", sharedStatus: "ひとり一問ずつ交代", waiting: "もうひとりを待っています。", playAgain: "もう一度", error: "ゲームを読み込めませんでした", retry: "やり直す", timeout: "ゲームが応答しません。やり直してください。", localOnly: "ローカルのウェブアドレスで開いてください。", resetConfirm: "今のゲームを終了して最初から始めますか？", frame: "{player} の色紙あそび", sharedFrame: "ふたりの色紙あそび", tie: "同じ数の問題を解けました。" }
};

const PLAYER_IDS = ["A", "B", "C", "D"];
const playerCount = (value) => [2, 3, 4, "2", "3", "4"].includes(value) ? Number(value) : 2;

export function parseOptions(search) {
  const query = new URLSearchParams(search);
  const mode = query.get("mode") === "battle" ? "battle" : "together";
  return { mode, players: mode === "battle" ? playerCount(query.get("players")) : 2, level: query.get("level") === "2" ? 2 : 1, count: query.get("count") === "20" ? 20 : 10, seed: /^[a-zA-Z0-9_-]{1,80}$/.test(query.get("seed") || "") ? query.get("seed") : null };
}

export function frameUrl(base, options, player) {
  const url = new URL("index.html", base);
  const offset = PLAYER_IDS.indexOf(player) * Math.floor(options.count / playerCount(options.players));
  url.search = new URLSearchParams({ level: String(options.level), count: String(options.count), embedded: "1", mode: options.mode, player, seed: options.seed, ...(options.mode === "battle" ? { offset: String(offset) } : {}) }).toString();
  return url.href;
}

export function createSession(mode, total, players = 2) {
  const slot = () => ({ phase: "loading", index: -1, id: null, solved: new Set(), error: "" });
  const ids = PLAYER_IDS.slice(0, mode === "battle" ? playerCount(players) : 2);
  const values = (value) => Object.fromEntries(ids.map((id) => [id, value]));
  return { mode, total, players: ids, started: false, scores: values(0), points: values(0), mistakes: values(0), mistakesKnown: values(true), slots: Object.fromEntries((mode === "battle" ? ids : ["A"]).map((id) => [id, slot()])) };
}

export function messagePlayer(event, origin, frames) {
  if (origin === "null" || event.origin !== origin || !event.data || typeof event.data !== "object" || Array.isArray(event.data)) return null;
  return Object.keys(frames).find((key) => frames[key].contentWindow && frames[key].contentWindow === event.source) || null;
}

export function receive(session, player, data) {
  const slot = session.slots[player];
  if (!slot || !data || typeof data !== "object" || slot.phase === "error" || slot.phase === "complete") return false;
  if (data.type === "paper-fold:error" && typeof data.message === "string") {
    slot.phase = "error";
    slot.error = data.message.slice(0, 300);
    return true;
  }
  if (data.total !== session.total) return false;
  if (data.type === "paper-fold:complete") {
    if (slot.solved.size !== session.total || !["solved", "advancing"].includes(slot.phase)) return false;
    slot.phase = "complete";
    return true;
  }
  if (!Number.isInteger(data.index) || data.index < 0 || data.index >= session.total || typeof data.id !== "string" || !data.id || data.id.length > 200) return false;
  if (data.type === "paper-fold:ready") {
    const canAdvance = slot.phase === "advancing" || (session.mode === "battle" && slot.phase === "solved");
    const expected = slot.phase === "loading" ? 0 : canAdvance ? slot.index + 1 : -1;
    if (data.index !== expected || slot.solved.has(data.id)) return false;
    slot.index = data.index;
    slot.id = data.id;
    slot.phase = session.started ? "playing" : "ready";
    return true;
  }
  if (data.type === "paper-fold:solved") {
    if (!session.started || slot.phase !== "playing" || data.index !== slot.index || data.id !== slot.id || slot.solved.has(data.id)) return false;
    const mistakes = Object.hasOwn(data, "mistakes") ? data.mistakes : 0;
    if (!Number.isInteger(mistakes) || mistakes < 0) return false;
    const owner = session.mode === "together" ? (slot.index % 2 ? "B" : "A") : player;
    slot.solved.add(data.id);
    session.scores[owner] += 1;
    session.mistakes[owner] += mistakes;
    if (!Object.hasOwn(data, "mistakes")) session.mistakesKnown[owner] = false;
    if (session.mode === "battle") session.points[player] += Math.max(1, 3 - Math.min(mistakes, 2));
    slot.phase = "solved";
    return true;
  }
  return false;
}

export function startSession(session) {
  if (session.started || !Object.values(session.slots).every((slot) => slot.phase === "ready")) return false;
  session.started = true;
  Object.values(session.slots).forEach((slot) => { slot.phase = "playing"; });
  return true;
}

export function advanceSession(session, player) {
  const slot = session.slots[player];
  if (!slot || slot.phase !== "solved") return false;
  slot.phase = "advancing";
  return true;
}

export const isComplete = (session) => Object.values(session.slots).every((slot) => slot.phase === "complete");

export function battleOutcome(session) {
  if (session.mode !== "battle" || !isComplete(session)) return null;
  const best = Math.max(...Object.values(session.points));
  const leaders = session.players.filter((player) => session.points[player] === best);
  return leaders.length === 1 ? leaders[0] : "tie";
}

export function sessionResults(session) {
  return session.players.map((player) => ({ player, points: session.points[player], solved: session.scores[player], mistakes: session.mistakesKnown[player] ? session.mistakes[player] : null, rank: 1 + session.players.filter((other) => session.points[other] > session.points[player]).length })).sort((a, b) => session.mode === "battle" ? b.points - a.points : 0);
}

function mount() {
  const $ = (selector) => document.querySelector(selector);
  let options = parseOptions(location.search);
  let lang = "ko";
  try { lang = localStorage.getItem("gfield-language") || "ko"; } catch { /* Storage may be disabled. */ }
  if (!Object.hasOwn(messages, lang)) lang = "ko";
  const t = (key, values = {}) => (messages[lang][key] || key).replace(/\{(\w+)\}/g, (_, name) => values[name] ?? "");
  const frames = {};
  const panels = {};
  const timers = {};
  let session;
  let finishShown = false;
  let setupOpen = false;
  const randomSeed = () => Array.from(crypto.getRandomValues(new Uint32Array(2)), (value) => value.toString(36)).join("-");
  const playerName = (player) => t(`player${player}`);
  const currentPlayer = (slot, key) => session.mode === "battle" ? key : slot.index % 2 === 1 ? "B" : "A";
  const allReady = () => Object.values(session.slots).every((slot) => slot.phase === "ready");

  function clearTimer(key) { clearTimeout(timers[key]); delete timers[key]; }
  function armTimer(key) {
    clearTimer(key);
    timers[key] = setTimeout(() => {
      if (["loading", "advancing"].includes(session.slots[key].phase)) {
        receive(session, key, { type: "paper-fold:error", message: t("timeout") });
        render();
      }
    }, 20000);
  }
  function updateLinks() {
    const query = new URLSearchParams({ level: String(options.level), count: String(options.count) });
    $("#soloLink").href = `./index.html?${query}`;
    for (const mode of ["together", "battle"]) {
      const link = $(`#${mode}Link`);
      link.href = `./play.html?mode=${mode}&${query}${mode === "battle" ? `&players=${options.players}` : ""}`;
      if (options.mode === mode) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    }
  }
  function translate() {
    document.documentElement.lang = lang;
    document.title = `GFIELD | ${t("title")} | ${t(options.mode)}`;
    document.querySelectorAll("[data-text]").forEach((node) => { node.textContent = t(node.dataset.text); });
    $("#languageSelect").value = lang;
    $("#exitLink").title = t("exit");
    $("#exitLink").setAttribute("aria-label", t("exit"));
    $("#modeNav").setAttribute("aria-label", t("modes"));
    updateLinks();
  }
  function focusFrame(key) {
    const frame = frames[key];
    if (!frame || session.slots[key].phase !== "playing") return;
    frame.focus({ preventScroll: true });
    try {
      const control = frame.contentDocument?.querySelector("#paper [tabindex='0'], #interaction button:not(:disabled), #hintButton");
      control?.focus({ preventScroll: true });
    } catch { /* The message gate still rejects foreign frame navigation. */ }
  }
  function advance(key) {
    if (!advanceSession(session, key)) return;
    armTimer(key);
    render();
    frames[key].contentWindow.postMessage({ type: "paper-fold:next" }, location.origin);
  }
  function start() {
    if (!startSession(session)) return;
    render();
    window.scrollTo({ top: 0, behavior: "instant" });
    focusFrame("A");
  }
  function setOverlay(panel, heading, detail, buttonText, action, disabled = false) {
    panel.overlay.hidden = false;
    panel.heading.textContent = heading;
    panel.detail.textContent = detail;
    panel.detail.hidden = !detail;
    panel.button.textContent = buttonText;
    panel.button.hidden = !buttonText;
    panel.button.disabled = disabled;
    panel.button.onclick = action;
  }
  function render() {
    $("#sessionTitle").textContent = t(options.mode);
    $(".pf-tallies").dataset.mode = options.mode;
    for (const player of session.players) {
      $(`#score${player}`).textContent = options.mode === "battle" ? t("solvedCount", { count: session.scores[player], total: session.total }) : session.scores[player];
      $(`#points${player}`).textContent = session.points[player];
      $(`#points${player}`).parentElement.hidden = options.mode !== "battle";
    }
    $("#sharedProgressLabel").hidden = options.mode !== "together";
    $("#sharedProgress").max = options.count;
    $("#sharedProgress").value = session.scores.A + session.scores.B;
    $("#sharedCount").textContent = `${session.scores.A + session.scores.B} / ${options.count}`;
    const done = isComplete(session);
    const compact = session.started && options.mode === "battle";
    document.body.dataset.mode = options.mode;
    document.body.dataset.stage = done ? "result" : session.started ? "playing" : "setup";
    $("#setupArea").hidden = (compact || done) && !setupOpen;
    $(".pf-language").hidden = compact && !setupOpen;
    $("#setupToggle").hidden = !session.started;
    $("#setupToggle").setAttribute("aria-expanded", String(setupOpen));
    $("#headerNewRound").hidden = !session.started;
    $("#gameFrames").hidden = done;
    $("#sessionStatus").textContent = done ? t("complete") : t(options.mode === "together" ? "sharedStatus" : "points");
    $("#finishBanner").hidden = !done;
    if (done) {
      const outcome = battleOutcome(session);
      $("#finishTitle").textContent = outcome ? t(outcome === "tie" ? "pointsTie" : "winner", { player: playerName(outcome) }) : t("complete");
      const results = sessionResults(session);
      $("#finishText").textContent = outcome === "tie" ? t("jointWinners", { players: results.filter((row) => row.rank === 1).map((row) => playerName(row.player)).join(" · ") }) : outcome ? t("allFinished") : t("tally", { a: session.scores.A, b: session.scores.B });
      renderResults(results);
      if (!finishShown) { finishShown = true; $("#finishBanner").focus(); window.scrollTo({ top: 0, behavior: "instant" }); }
    }
    for (const [key, slot] of Object.entries(session.slots)) {
      const panel = panels[key];
      const player = currentPlayer(slot, key);
      const next = player === "A" ? "B" : "A";
      const finalProblem = slot.index === session.total - 1;
      panel.root.dataset.player = player;
      panel.title.textContent = session.mode === "together" ? t("turn", { player }) : playerName(player);
      panel.count.textContent = `${slot.solved.size} / ${session.total}`;
      panel.points.hidden = session.mode !== "battle";
      panel.points.textContent = t("pointScore", { count: session.points[key] });
      panel.progress.value = slot.solved.size;
      panel.progress.setAttribute("aria-label", `${playerName(player)}: ${slot.solved.size} / ${session.total}`);
      panel.frame.title = session.mode === "together" ? t("sharedFrame") : t("frame", { player });
      const interactive = slot.phase === "playing" || (session.mode === "battle" && slot.phase === "solved");
      panel.frame.inert = !interactive;
      panel.frame.tabIndex = interactive ? 0 : -1;
      panel.frame.hidden = slot.phase === "complete";
      panel.overlay.hidden = true;
      delete panel.overlay.dataset.state;
      panel.action.hidden = true;
      panel.status.textContent = t("turn", { player });
      if (["loading", "ready"].includes(slot.phase)) {
        const ready = allReady();
        setOverlay(panel, t(ready ? (session.mode === "together" ? "ready" : "battleReady") : "loading"), "", ready ? t("start") : "", start);
        panel.status.textContent = t("loading");
      } else if (slot.phase === "solved") {
        panel.status.textContent = t("solved", { player });
        if (session.mode === "together") {
          setOverlay(panel, t(finalProblem ? "complete" : "handoff", { player, next }), `${slot.solved.size} / ${session.total}`, t(finalProblem ? "finish" : "continue", { player: next }), () => advance(key));
        } else {
          panel.action.hidden = false;
          panel.action.textContent = t(finalProblem ? "finish" : "next");
          panel.action.onclick = () => advance(key);
        }
      } else if (slot.phase === "advancing") {
        panel.status.textContent = t(finalProblem ? "finishing" : "loading");
        if (session.mode === "together") setOverlay(panel, panel.status.textContent, "", "", null);
      } else if (slot.phase === "complete") {
        panel.status.textContent = t(done ? "complete" : "waiting");
        if (!done && session.mode === "battle") {
          panel.overlay.dataset.state = "waiting";
          setOverlay(panel, t("waiting"), t("pointScore", { count: session.points[key] }), "", null);
        }
      } else if (slot.phase === "error") {
        setOverlay(panel, t("error"), slot.error, t("retry"), () => reset(false));
        panel.status.textContent = t("error");
      }
    }
  }
  function renderResults(results) {
    const table = document.createElement("table");
    table.className = "pf-results-table";
    const columns = options.mode === "battle" ? ["rank", "participant", "points", "completed", "mistakes"] : ["participant", "completed", "mistakes"];
    const head = table.createTHead().insertRow();
    columns.forEach((key) => { const cell = document.createElement("th"); cell.scope = "col"; cell.textContent = t(key); head.append(cell); });
    const body = table.createTBody();
    results.forEach((result) => {
      const row = body.insertRow();
      row.dataset.player = result.player;
      if (options.mode === "battle") row.dataset.rank = result.rank;
      const values = { rank: result.rank, participant: playerName(result.player), points: result.points, completed: result.solved, mistakes: result.mistakes === null ? t("unknown") : result.mistakes };
      columns.forEach((key) => {
        const cell = document.createElement(key === "participant" ? "th" : "td");
        if (key === "participant") cell.scope = "row";
        cell.textContent = values[key];
        row.append(cell);
      });
    });
    $("#resultRows").replaceChildren(table);
  }
  function makeTallies() {
    $("#playerTallies").replaceChildren();
    $("#playerTallies").dataset.players = session.players.length;
    session.players.forEach((player) => {
      const tally = document.createElement("div");
      tally.className = "pf-tally";
      tally.dataset.player = player;
      tally.innerHTML = `<span class="pf-player-label" data-text="player${player}"></span><strong class="pf-solved-count" id="score${player}">0</strong><div class="pf-points" hidden><span data-text="points"></span><strong id="points${player}">0</strong></div>`;
      $("#playerTallies").append(tally);
    });
  }
  function makePanel(key) {
    const root = document.createElement("section");
    root.className = "pf-game";
    const avatar = session.mode === "together" ? '<img src="../../world-map/assets/foldy-character.webp" alt="" width="90" height="100">' : "";
    root.innerHTML = `<header class="pf-game-header"><h2></h2><div class="pf-player-stats"><span class="pf-frame-points"></span><strong></strong></div><progress max="${options.count}" value="0"></progress></header><div class="pf-frame-area"><iframe sandbox="allow-scripts allow-same-origin" referrerpolicy="same-origin"></iframe><div class="pf-overlay">${avatar}<h3></h3><p></p><button class="pf-primary" type="button"></button></div></div><footer class="pf-game-actions"><p role="status" aria-live="polite"></p><button class="pf-primary" type="button" hidden></button></footer>`;
    const panel = { root, title: root.querySelector("h2"), count: root.querySelector("header strong"), points: root.querySelector(".pf-frame-points"), progress: root.querySelector("progress"), frame: root.querySelector("iframe"), overlay: root.querySelector(".pf-overlay"), heading: root.querySelector("h3"), detail: root.querySelector(".pf-overlay p"), button: root.querySelector(".pf-overlay button"), status: root.querySelector("footer p"), action: root.querySelector("footer button") };
    panels[key] = panel;
    frames[key] = panel.frame;
    panel.frame.inert = true;
    panel.frame.tabIndex = -1;
    $("#gameFrames").append(root);
    if (location.origin !== "null") {
      panel.frame.src = frameUrl(location.href, options, key);
      armTimer(key);
    } else receive(session, key, { type: "paper-fold:error", message: t("localOnly") });
  }
  function reset(ask = true, keepSeed = false) {
    if (ask && session?.started && !isComplete(session) && !confirm(t("resetConfirm"))) return false;
    for (const key of Object.keys(frames)) { clearTimer(key); delete frames[key]; delete panels[key]; }
    $("#gameFrames").replaceChildren();
    options.level = Number($("#levelSelect").value);
    options.count = Number($("#countSelect").value);
    options.players = options.mode === "battle" ? playerCount($("#playersSelect").value) : 2;
    if (!keepSeed || !options.seed) options.seed = randomSeed();
    session = createSession(options.mode, options.count, options.players);
    finishShown = false;
    setupOpen = false;
    const url = new URL(location.href);
    url.search = new URLSearchParams({ mode: options.mode, players: String(options.players), level: String(options.level), count: String(options.count), seed: options.seed });
    history.replaceState(null, "", url);
    $("#gameFrames").dataset.mode = options.mode;
    $("#gameFrames").dataset.players = options.players;
    makeTallies();
    $("#playersLabel").hidden = options.mode !== "battle";
    translate();
    Object.keys(session.slots).forEach(makePanel);
    render();
    return true;
  }
  window.addEventListener("message", (event) => {
    const key = messagePlayer(event, location.origin, frames);
    if (!key || !receive(session, key, event.data)) return;
    clearTimer(key);
    const activeFrame = document.activeElement === frames[key];
    const activePanel = panels[key].root.contains(document.activeElement);
    render();
    const slot = session.slots[key];
    if (slot.phase === "solved" && activeFrame) (options.mode === "together" ? panels[key].button : panels[key].action).focus({ preventScroll: true });
    if (slot.phase === "playing" && activePanel) focusFrame(key);
  });
  $("#settingsForm").addEventListener("submit", (event) => { event.preventDefault(); reset(); });
  $("#playAgain").addEventListener("click", () => reset(false));
  $("#headerNewRound").addEventListener("click", () => reset());
  $("#setupToggle").addEventListener("click", () => { setupOpen = !setupOpen; render(); });
  $("#languageSelect").addEventListener("change", (event) => {
    const nextLang = event.target.value;
    if (session.started && !isComplete(session) && !confirm(t("resetConfirm"))) { event.target.value = lang; return; }
    lang = nextLang;
    try { localStorage.setItem("gfield-language", lang); } catch { /* Keep the host usable without persistence. */ }
    reset(false, true);
  });
  $("#modeNav").addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (link && session.started && !isComplete(session) && !confirm(t("resetConfirm"))) event.preventDefault();
  });
  $("#levelSelect").value = options.level;
  $("#countSelect").value = options.count;
  $("#playersSelect").value = options.players;
  reset(false, true);
}

if (typeof document !== "undefined") mount();
