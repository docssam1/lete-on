(function (root, factory) {
  "use strict";
  const api = factory();
  root.HIGHSELECT_PRINT_EXAM_RENDERER = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const STYLE_ID = "highselect-print-exam-style";
  const PRINT_CSS = [
    "@page { size: A4 portrait; margin: 0; }",
    ".print-exam { margin: 0; padding: 0; background: #fff; }",
    ".print-exam__page { width: 210mm; height: 297mm; margin: 0 auto; break-after: page; page-break-after: always; overflow: hidden; background: #fff; }",
    ".print-exam__page:last-child { break-after: auto; page-break-after: auto; }",
    ".print-exam__page-image { display: block; width: 210mm; height: 297mm; object-fit: contain; background: #fff; }",
    "@media print {",
    "  html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; }",
    "  body * { visibility: hidden !important; }",
    "  .print-exam-host, .print-exam-host * { visibility: visible !important; }",
    "  .print-exam-host { display: block !important; position: absolute !important; inset: 0 auto auto 0 !important; width: 210mm !important; margin: 0 !important; padding: 0 !important; }",
    "  .print-exam, .print-exam__page, .print-exam__page-image { print-color-adjust: exact; -webkit-print-color-adjust: exact; }",
    "}"
  ].join("\n");

  function requireVerified(packet) {
    if (!packet || packet.verified !== true || packet.rasterPolicy !== "signed-page-images") {
      throw new Error("A verified signed raster print packet is required");
    }
    if (!Array.isArray(packet.pages) || packet.pages.length === 0) throw new Error("Print packet pages are required");
  }

  function createPrintDocumentModel(packet) {
    requireVerified(packet);
    return Object.freeze({
      examId: packet.examId,
      printPlanId: packet.printPlanId,
      pageSize: packet.pageSize,
      pages: Object.freeze(packet.pages.map(function (page, index) {
        if (!page || page.number !== index + 1 || !/^https:\/\//.test(page.url) || !/^image\//.test(page.mimeType)) {
          throw new Error("Invalid verified print page");
        }
        return Object.freeze({
          number: page.number,
          imageUrl: page.url,
          mimeType: page.mimeType,
          assetVariant: page.assetVariant
        });
      }))
    });
  }

  function installPrintStyles(documentRef) {
    if (!documentRef || !documentRef.head || !documentRef.createElement) throw new TypeError("A document is required");
    if (documentRef.getElementById(STYLE_ID)) return;
    const style = documentRef.createElement("style");
    style.id = STYLE_ID;
    style.textContent = PRINT_CSS;
    documentRef.head.appendChild(style);
  }

  function mountPrintExam(container, packet) {
    if (!container || !container.ownerDocument) throw new TypeError("A print container is required");
    const model = createPrintDocumentModel(packet);
    const documentRef = container.ownerDocument;
    installPrintStyles(documentRef);
    const article = documentRef.createElement("article");
    article.className = "print-exam";
    article.setAttribute("aria-label", "인쇄용 시험지");
    model.pages.forEach(function (page) {
      const section = documentRef.createElement("section");
      section.className = "print-exam__page";
      section.dataset.pageNumber = String(page.number);
      section.dataset.assetVariant = page.assetVariant;
      const image = documentRef.createElement("img");
      image.className = "print-exam__page-image";
      image.src = page.imageUrl;
      image.alt = `시험지 ${page.number}쪽`;
      image.decoding = "sync";
      image.loading = "eager";
      image.referrerPolicy = "no-referrer";
      image.draggable = false;
      section.appendChild(image);
      article.appendChild(section);
    });
    container.classList.add("print-exam-host");
    container.replaceChildren(article);
    return article;
  }

  return Object.freeze({
    STYLE_ID,
    PRINT_CSS,
    createPrintDocumentModel,
    installPrintStyles,
    mountPrintExam
  });
});
