(function (root) {
  "use strict";

  const session = root.HIGHSELECT_AUTH.requireSession("./login.html");
  if (!session) return;
  const api = String(root.HIGHSELECT_RUNTIME.apiBase || "").replace(/\/$/, "");
  const statusBox = document.getElementById("print-status");
  const sheets = document.getElementById("exam-sheets");
  const printButton = document.getElementById("print-exam");
  const academyNames = { SH: "황소", DP: "돌파", WM: "원수학", ED: "이든", DG: "깊은생각", SM: "생수" };
  const semesterNames = { "M1-1": "중1-1", "M1-2": "중1-2", "M2-1": "중2-1", "M2-2": "중2-2", "M3-1": "중3-1", "M3-2": "중3-2", CM1: "공통수학1", CM2: "공통수학2" };

  function fail(message) { throw new Error(message); }
  function setStatus(message, state) { statusBox.textContent = message; statusBox.dataset.state = state || ""; }
  function examTitle(packet) {
    const course = packet.generationMode === "learning" ? "학습용" : (academyNames[packet.academyId] || packet.academyId);
    return `${course} · ${semesterNames[packet.semesterId] || packet.semesterId}`;
  }
  function validateAssetUrl(value) {
    const url = new URL(String(value || ""), location.href);
    if (!/^https?:$/.test(url.protocol)) fail("문항 이미지 주소가 올바르지 않습니다.");
    const hosts = Array.isArray(root.HIGHSELECT_RUNTIME.assetHosts) ? root.HIGHSELECT_RUNTIME.assetHosts : [];
    if (hosts.length && !hosts.includes(url.hostname)) fail("허용되지 않은 문항 이미지 주소입니다.");
    return url.href;
  }
  function validatePacket(packet) {
    if (!packet || packet.assetPolicy !== "signed-item-images" || !Array.isArray(packet.items)) fail("검수된 시험지 구성을 불러오지 못했습니다.");
    const layout = packet.layout || {};
    if (layout.paperSize !== "A4" || ![1, 2].includes(Number(layout.columns))) fail("A4 시험지 배치를 확인해 주세요.");
    const itemsPerPage = Number(layout.itemsPerPage);
    if (!Number.isSafeInteger(itemsPerPage) || itemsPerPage < 1 || itemsPerPage > 6) fail("한 쪽 문항 수를 확인해 주세요.");
    if (packet.questionCount !== packet.items.length || packet.pageCount !== Math.ceil(packet.items.length / itemsPerPage)) fail("시험지 문항 수가 맞지 않습니다.");
    const items = packet.items.map(function (item, index) {
      if (!item || item.number !== index + 1 || !["image/png", "image/jpeg", "image/webp"].includes(item.mimeType)) fail("문항 순서 또는 이미지 형식이 올바르지 않습니다.");
      const score = Number(item.score);
      if (!Number.isFinite(score) || score <= 0) fail("문항 배점을 확인해 주세요.");
      return Object.freeze({ number: item.number, score, inputType: String(item.inputType || ""), mimeType: item.mimeType, url: validateAssetUrl(item.url) });
    });
    return Object.freeze({ packet, layout: Object.freeze({ paperSize: "A4", columns: Number(layout.columns), itemsPerPage, fontScale: Number(layout.fontScale) || 1 }), items: Object.freeze(items) });
  }
  function element(name, className, text) {
    const node = document.createElement(name);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }
  function questionCell(item) {
    const article = element("article", "exam-question");
    article.dataset.questionNumber = String(item.number);
    const head = element("div", "exam-question__head");
    head.append(element("span", "", String(item.number)), element("span", "exam-question__score", `${item.score}점`));
    const body = element("div", "exam-question__body");
    const image = element("img", "exam-question__image");
    image.src = item.url;
    image.alt = `${item.number}번 문제`;
    image.loading = "eager";
    image.decoding = "sync";
    image.referrerPolicy = "no-referrer";
    image.draggable = false;
    body.appendChild(image);
    const answer = element("div", "exam-question__answer", "답");
    answer.appendChild(element("span"));
    article.append(head, body, answer);
    return { article, image };
  }
  function render(model) {
    const pageCount = Math.ceil(model.items.length / model.layout.itemsPerPage);
    const images = [];
    sheets.replaceChildren();
    for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
      const pageItems = model.items.slice(pageIndex * model.layout.itemsPerPage, (pageIndex + 1) * model.layout.itemsPerPage);
      const page = element("section", "exam-sheet");
      page.dataset.pageNumber = String(pageIndex + 1);
      const header = element("header", "exam-sheet__header");
      const heading = element("div");
      heading.append(element("h1", "", examTitle(model.packet)), element("p", "", `${model.items.length}문항 · A4 ${model.layout.columns}단`));
      const student = element("div", "exam-sheet__student");
      student.append(element("span", "", "이름"), element("span", "", "날짜"));
      header.append(heading, student);
      const grid = element("div", "exam-sheet__grid");
      const rows = Math.ceil(model.layout.itemsPerPage / model.layout.columns);
      grid.style.setProperty("--exam-columns", String(model.layout.columns));
      grid.style.setProperty("--exam-rows", String(rows));
      grid.style.setProperty("--exam-font-scale", String(Math.min(1.4, Math.max(.8, model.layout.fontScale))));
      pageItems.forEach(function (item) {
        const cell = questionCell(item);
        images.push(cell.image);
        grid.appendChild(cell.article);
      });
      const footer = element("footer", "exam-sheet__footer");
      footer.append(element("b", "", "G·FIELD"), element("span", "", `${pageIndex + 1} / ${pageCount}`));
      page.append(header, grid, footer);
      sheets.appendChild(page);
    }
    return images;
  }
  function waitForImages(images) {
    return Promise.all(images.map(function (image) {
      if (image.complete && image.naturalWidth > 0) return Promise.resolve();
      return new Promise(function (resolve, reject) {
        image.addEventListener("load", resolve, { once: true });
        image.addEventListener("error", function () { reject(new Error(`${image.alt} 이미지를 불러오지 못했습니다.`)); }, { once: true });
      });
    }));
  }
  async function request(path) {
    const response = await fetch(`${api}${path}`, { credentials: "include" });
    const body = await response.json().catch(function () { return {}; });
    if (!response.ok) fail(body.message || `시험지를 불러오지 못했습니다. (${response.status})`);
    return body;
  }
  async function start() {
    if (!api) fail("나만의 문제은행 운영 서버 연결이 필요합니다.");
    const examId = new URLSearchParams(location.search).get("examId");
    if (!examId) fail("열 시험지를 선택해 주세요.");
    const model = validatePacket(await request(`/user-exam-library/exams/${encodeURIComponent(examId)}/print-manifest`));
    const images = render(model);
    await waitForImages(images);
    printButton.disabled = false;
    document.body.dataset.printReady = "true";
    document.title = `${examTitle(model.packet)} 시험지`;
    setStatus(`${model.items.length}문항을 확인했습니다. 인쇄하거나 PDF로 저장할 수 있습니다.`, "ready");
  }

  printButton.addEventListener("click", function () {
    if (document.body.dataset.printReady === "true") root.print();
  });
  start().catch(function (error) {
    sheets.replaceChildren();
    printButton.disabled = true;
    setStatus(error.message, "locked");
  });
})(typeof window !== "undefined" ? window : globalThis);
