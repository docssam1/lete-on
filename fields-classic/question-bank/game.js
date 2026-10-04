import { resolveGameLink } from "./golden-bell-game-link.js?v=20261003e";

const content = document.getElementById("gameContent");
const status = document.getElementById("gameStatus");
const message = document.getElementById("gameMessage");
const retry = document.getElementById("gameRetry");
let generation = 0;

async function openGame() {
  const request = ++generation;
  const token = location.hash.slice(1);
  content.hidden = true;
  content.replaceChildren();
  status.hidden = false;
  retry.hidden = true;
  document.getElementById("gameTitle").textContent = "게임으로 연습하기";
  if (!/^fcg1\.[a-z-]+\.\d+\.[A-Za-z0-9_-]{43}$/u.test(token)) {
    message.textContent = "학습지의 게임 QR을 다시 스캔해 주세요.";
    return;
  }
  message.textContent = "게임을 불러오고 있습니다.";
  try {
    const grant = await resolveGameLink(token);
    if (request !== generation) return;
    if (grant.activityId !== token.split(".")[1]) throw new Error("game_scope_invalid");
    const { HANDS_ON_ACTIVITIES, unitForLesson } = await import("./golden-bell-hands-on-models.js?v=20260925a");
    if (request !== generation) return;
    const activity = Object.hasOwn(HANDS_ON_ACTIVITIES, grant.activityId) ? HANDS_ON_ACTIVITIES[grant.activityId] : null;
    if (!activity || activity.lesson !== grant.lessonId || !unitForLesson(grant.bookId, grant.lessonId)?.activities.includes(grant.activityId)) throw new Error("game_scope_invalid");
    const { mountSingleHandsOn } = await import("./golden-bell-hands-on.js?v=20261004b");
    if (request !== generation) return;
    mountSingleHandsOn(content, grant.activityId);
    document.getElementById("gameTitle").textContent = activity.title;
    status.hidden = true;
    content.hidden = false;
  } catch (error) {
    if (request !== generation) return;
    const denied = /invalid|expired|scope|revoked/u.test(error.message);
    message.textContent = denied ? "사용할 수 없는 게임 링크입니다. 선생님에게 새 학습지를 요청해 주세요." : "게임을 불러오지 못했습니다. 다시 불러오세요.";
    retry.hidden = denied;
  }
}

retry.addEventListener("click", openGame);
window.addEventListener("hashchange", openGame);
openGame();
