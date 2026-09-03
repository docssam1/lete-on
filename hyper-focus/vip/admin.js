(function () {
  "use strict";
  const auth = window.GFieldHFPortalAuth;
  const $ = id => document.getElementById(id);
  let contents = [];
  let relations = [];
  let assets = [];

  function esc(value) { return String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[char]); }
  function splitList(value) { return [...new Set(String(value || "").split(",").map(item => item.normalize("NFKC").trim().toLowerCase()).filter(Boolean))]; }
  function setStatus(message, failed) { $("statusText").textContent = message; $("statusText").style.color = failed ? "#b42318" : ""; }
  async function invoke(body) {
    const client = await auth.client();
    const { data, error } = await client.functions.invoke("admin-vip", { body });
    if (error || data?.error) throw new Error(data?.error || "관리자 콘텐츠 작업을 처리하지 못했습니다.");
    return data || {};
  }
  function relationIds(id) { return relations.filter(row => row.content_id === id).sort((a,b) => a.sort_order-b.sort_order).map(row => row.related_content_id); }
  function assetRows(id) { return assets.filter(row => row.content_id === id); }
  function render() {
    $("contentCount").textContent = String(contents.length);
    $("contentList").innerHTML = contents.length ? contents.map(item => {
      const itemAssets = assetRows(item.id);
      return `<article class="content-card"><header><div><span class="pill ${esc(item.status)}">${esc(item.status)}</span><h3>${esc(item.title)}</h3></div><small>${esc(item.kind)}</small></header><p>${esc(item.summary || "요약 없음")}</p><p class="asset-line">연결 ${relationIds(item.id).length}개 · 비공개 자료 ${itemAssets.length}개</p><button type="button" data-edit="${esc(item.id)}">수정하기</button></article>`;
    }).join("") : '<div class="empty">아직 등록된 VIP 콘텐츠가 없습니다.</div>';
  }
  async function load() {
    const data = await invoke({ action: "list" });
    contents = Array.isArray(data.contents) ? data.contents : [];
    relations = Array.isArray(data.relations) ? data.relations : [];
    assets = Array.isArray(data.assets) ? data.assets : [];
    render();
  }
  function resetForm() {
    $("contentForm").reset();
    $("contentId").readOnly = false;
    $("status").value = "draft";
    setStatus("새 콘텐츠를 초안으로 저장할 수 있습니다.");
  }
  function edit(id) {
    const item = contents.find(row => row.id === id);
    if (!item) return;
    $("contentId").value = item.id; $("contentId").readOnly = true;
    $("kind").value = item.kind; $("title").value = item.title; $("contentDate").value = item.content_date || "";
    $("summary").value = item.summary || ""; $("bodyText").value = item.body_html || ""; $("tags").value = (item.tags || []).join(", ");
    $("relatedIds").value = relationIds(item.id).join(", "); $("status").value = item.status;
    $("assetKind").value = ""; $("assetFile").value = "";
    setStatus("수정할 내용을 확인한 뒤 저장하세요.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function validateFile(kind, file) {
    if (!kind && !file) return;
    if (!kind || !file) throw new Error("첨부 종류와 파일을 함께 선택해 주세요.");
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp", "video/mp4"];
    if (!allowed.includes(file.type)) throw new Error("PDF, JPG, PNG, WEBP, MP4 파일만 올릴 수 있습니다.");
    if (kind === "cover" && !file.type.startsWith("image/")) throw new Error("표지는 이미지 파일만 가능합니다.");
    if (kind === "video" && file.type !== "video/mp4") throw new Error("영상은 MP4만 가능합니다.");
    if (kind === "pdf" && file.type !== "application/pdf") throw new Error("PDF 자료에는 PDF 파일을 선택해 주세요.");
  }
  async function uploadAsset(contentId, assetKind, file) {
    validateFile(assetKind, file);
    if (!file) return;
    const signed = await invoke({ action: "createUpload", contentId, assetKind, mimeType: file.type, byteSize: file.size });
    const client = await auth.client();
    const { error } = await client.storage.from(signed.bucket).uploadToSignedUrl(signed.objectPath, signed.uploadToken, file, { contentType: file.type });
    if (error) throw new Error("비공개 파일 업로드에 실패했습니다.");
    await invoke({ action: "finalizeUpload", contentId, assetKind, mimeType: file.type, byteSize: file.size, uploadId: signed.uploadId, objectPath: signed.objectPath });
  }
  async function save(event) {
    event.preventDefault();
    const saveButton = $("saveBtn");
    const id = $("contentId").value.normalize("NFKC").trim().toLowerCase();
    const assetKind = $("assetKind").value;
    const file = $("assetFile").files[0] || null;
    validateFile(assetKind, file);
    saveButton.disabled = true;
    setStatus("콘텐츠와 연결 자료를 저장하는 중입니다.");
    try {
      await invoke({ action: "saveContent", id, kind: $("kind").value, title: $("title").value, contentDate: $("contentDate").value, summary: $("summary").value, bodyText: $("bodyText").value, tags: splitList($("tags").value), status: $("status").value });
      await invoke({ action: "saveRelations", contentId: id, relatedIds: splitList($("relatedIds").value) });
      await uploadAsset(id, assetKind, file);
      await load();
      edit(id);
      setStatus("저장되었습니다. 학생 공개 상태는 VIP 권한 계정에서만 보입니다.");
    } catch (error) {
      setStatus(`저장 실패: ${error.message}`, true);
    } finally { saveButton.disabled = false; }
  }
  async function init() {
    const session = await auth.ready();
    if (!session || session.role !== "admin") { $("blocked").hidden = false; return; }
    $("app").hidden = false;
    $("contentForm").addEventListener("submit", save);
    $("resetBtn").addEventListener("click", resetForm);
    $("contentList").addEventListener("click", event => { const button = event.target.closest("[data-edit]"); if (button) edit(button.dataset.edit); });
    await load();
  }
  init().catch(error => { console.error("VIP admin initialization failed", error); $("blocked").hidden = false; });
})();
