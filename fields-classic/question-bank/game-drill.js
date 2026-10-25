// 연습 공방을 학생 차시 덱(study.html)에 띄운다 — 그림이 문제은행 화면의 styles.css를 써서, 덱 글꼴·배색과 섞이지 않게 창(iframe) 안에서 돈다.
// 창이 보내는 말(fc-drill say)은 독쌤 말풍선으로, 「끝」(done)은 덱의 다음 장 넘김으로 이어 준다.
export function mountDrill(host, { say = () => {}, onDone = () => {}, lesson } = {}) {
  const book = new URLSearchParams(location.search).get("book") || "";
  const frame = document.createElement("iframe");
  frame.className = "drill-frame";
  frame.title = "연습 공방";
  const test = new URLSearchParams(location.search).get("test") === "1" ? "&test=1" : "";
  frame.src = `./drill.html?v=20261027a&book=${encodeURIComponent(book)}&lesson=${encodeURIComponent(lesson?.id || "")}${test}`;
  host.replaceChildren(frame);
  const listen = (event) => {
    if (event.origin !== location.origin || event.source !== frame.contentWindow || event.data?.type !== "fc-drill") return;
    if (event.data.event === "say") say(event.data.text, event.data.mood);
    if (event.data.event === "done") onDone();
  };
  window.addEventListener("message", listen);
  return { dispose() { window.removeEventListener("message", listen); host.replaceChildren(); } };
}
