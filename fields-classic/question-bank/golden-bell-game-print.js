import { HANDS_ON_ACTIVITIES, unitForLesson } from "./golden-bell-hands-on-models.js?v=20260925a";
import { gameLinkURL, issueGameLinks } from "./golden-bell-game-link.js?v=20261003e";

const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export function printGameActivities(bookId, lessonId) {
  return unitForLesson(bookId, lessonId)?.activities || [];
}

export function printGameExpiry(second) {
  const parts = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23"
  }).formatToParts(new Date(second * 1000));
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return { date: `${values.year}-${values.month}-${values.day}`, time: `${values.hour}:${values.minute}` };
}

export async function preparePrintGameLinks(book, lessons, getSession) {
  const ids = [...new Set(lessons.flatMap((lesson) => printGameActivities(book.id, lesson.id)))];
  if (!ids.length) return new Map();
  const { links } = await issueGameLinks(ids, await getSession());
  if (!Array.isArray(links) || links.length !== ids.length) throw new Error("game_links_incomplete");
  const result = new Map();
  for (const link of links) {
    if (!ids.includes(link.activityId) || result.has(link.activityId) || link.bookId !== book.id
      || link.lessonId !== HANDS_ON_ACTIVITIES[link.activityId]?.lesson || typeof link.token !== "string"
      || !/^fcg1\.[a-z-]+\.\d+\.[A-Za-z0-9_-]{43}$/u.test(link.token)
      || link.token.split(".")[1] !== link.activityId
      || Date.parse(link.expiresAt) !== Number(link.token.split(".")[2]) * 1000) throw new Error("game_links_invalid");
    result.set(link.activityId, gameLinkURL(link.token));
  }
  return result;
}

export function attachPrintGameLinks(root, links) {
  if (!links.size) return;
  if (typeof globalThis.qrcode !== "function") throw new Error("qr_encoder_unavailable");
  const codes = new Map();
  for (const [id, url] of links) {
    const code = globalThis.qrcode(0, "M");
    code.addData(url, "Byte");
    code.make();
    codes.set(id, code.createSvgTag({ cellSize: 2, margin: 8, scalable: true }));
  }
  for (const page of root.children) {
    if (!/^(original|story)(-|$)/u.test(page.dataset.printPart || "")) continue;
    // Put the QR after practice, not alongside a large concept/storyboard.
    if (page.dataset.printPart.startsWith("original") && [...root.children].some((other) =>
      other.dataset.printBook === page.dataset.printBook && other.dataset.printLesson === page.dataset.printLesson
      && other.dataset.printPart?.startsWith("story-"))) continue;
    const ids = printGameActivities(page.dataset.printBook, page.dataset.printLesson);
    if (!ids.length) continue;
    const footer = page.querySelector(":scope > .gold-print-footer");
    if (!footer) throw new Error("game_footer_missing");
    const meta = document.createElement("div");
    meta.className = "gold-print-footer-meta";
    meta.append(...footer.childNodes);
    const games = document.createElement("div");
    games.className = "gold-print-games";
    const expiry = printGameExpiry(Math.min(...ids.map((id) => Number(new URL(links.get(id)).hash.slice(1).split(".")[2]))));
    games.innerHTML = `<strong>게임으로 연습하기<small>${expiry.date}<br>${expiry.time}까지 (한국 시간)</small></strong><div class="gold-print-game-links">${ids.map((id) => {
      if (!links.has(id)) throw new Error("game_link_missing");
      return `<a class="gold-print-game-qr" data-print-game="${id}" href="${esc(links.get(id))}"><span class="gold-print-qr-image">${codes.get(id)}</span><span>${esc(HANDS_ON_ACTIVITIES[id].title)}</span></a>`;
    }).join("")}</div>`;
    footer.classList.add("has-game-qr");
    footer.append(games, meta);
  }
}
