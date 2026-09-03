(function () {
  "use strict";
  const auth = window.GFieldHFPortalAuth;
  const portal = window.GFIELD_HF_PORTAL;
  const data = window.GFIELD_HF_VIP_DATA || { items: [] };
  const sections = portal.vipSections;
  const $ = selector => document.querySelector(selector);
  let session = null;
  let contentItems = Array.isArray(data.items) ? data.items.slice() : [];
  let active = sections[0].key;

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[char]);
  }
  function publishedItems() {
    return contentItems.filter(item => item && item.status === "published");
  }

  async function loadRemoteContent() {
    if (!auth.isSupabaseEnabled()) return;
    const client = await auth.client();
    const [contentResult, relationResult, assetResult] = await Promise.all([
      client.from("hf_vip_contents")
        .select("id,kind,title,summary,content_date,tags,body_html,status,published_at")
        .order("content_date", { ascending: false, nullsFirst: false }),
      client.from("hf_vip_relations").select("content_id,related_content_id,sort_order").order("sort_order", { ascending: true }),
      client.from("hf_vip_assets").select("id,content_id,asset_kind,page_no,mime_type,created_at").order("created_at", { ascending: true })
    ]);
    if (contentResult.error || relationResult.error || assetResult.error) throw contentResult.error || relationResult.error || assetResult.error;
    const relatedByContent = new Map();
    (relationResult.data || []).forEach(row => {
      if (!relatedByContent.has(row.content_id)) relatedByContent.set(row.content_id, []);
      relatedByContent.get(row.content_id).push(row.related_content_id);
    });
    const assetsByContent = new Map();
    (assetResult.data || []).forEach(row => {
      if (!assetsByContent.has(row.content_id)) assetsByContent.set(row.content_id, []);
      assetsByContent.get(row.content_id).push(row);
    });
    const rows = contentResult.data || [];
    contentItems = (rows || []).map(row => ({
      id: row.id,
      kind: row.kind,
      title: row.title,
      summary: row.summary,
      date: row.content_date || String(row.published_at || "").slice(0, 10),
      tags: row.tags || [],
      bodyHtml: row.body_html,
      status: row.status,
      relatedIds: relatedByContent.get(row.id) || [],
      assets: assetsByContent.get(row.id) || []
    }));
  }
  function safeBody(html) {
    return String(html || "").split(/\n{2,}/).map(paragraph => `<p>${esc(paragraph).replace(/\n/g, "<br>")}</p>`).join("");
  }
  function relatedFor(item) {
    const explicit = new Set(Array.isArray(item.relatedIds) ? item.relatedIds : []);
    const tags = new Set(Array.isArray(item.tags) ? item.tags : []);
    return publishedItems().filter(candidate => candidate.id !== item.id && (
      explicit.has(candidate.id) || (candidate.tags || []).some(tag => tags.has(tag))
    )).slice(0, 4);
  }
  function card(item) {
    const section = sections.find(value => value.key === item.kind);
    return `<button class="content-card" type="button" data-id="${esc(item.id)}">
      <span class="cover"><small>${esc(section?.label || item.kind)}</small><b>${esc(item.title)}</b></span>
      <em>${esc(item.date || "")}</em><h3>${esc(item.title)}</h3><p>${esc(item.summary || "")}</p>
      <i>${(item.tags || []).slice(0, 3).map(tag => `#${esc(tag)}`).join(" ")}</i>
    </button>`;
  }
  function assetLabel(asset) {
    if (asset.asset_kind === "cover") return "표지 이미지 열기";
    if (asset.asset_kind === "video") return "설명회 영상 열기";
    if (asset.asset_kind === "pdf") return "PDF 자료 열기";
    if (asset.asset_kind === "page") return `${asset.page_no || ""}쪽 이미지 열기`;
    return "첨부 자료 열기";
  }
  function assetButtons(item) {
    const assets = Array.isArray(item.assets) ? item.assets : [];
    if (!assets.length) return "";
    return `<section class="assets"><h2>전용 자료</h2><div>${assets.map(asset => `<button type="button" data-asset-id="${esc(asset.id)}">${esc(assetLabel(asset))}</button>`).join("")}</div><p>자료 주소는 권한 확인 뒤 잠시 동안만 열립니다.</p></section>`;
  }
  function render() {
    const section = sections.find(item => item.key === active) || sections[0];
    const items = publishedItems().filter(item => item.kind === section.key);
    $("#sectionTitle").textContent = section.label;
    $("#sectionDescription").textContent = section.description;
    $("#sectionStats").innerHTML = `<div><dt>CONTENTS</dt><dd>${items.length}</dd></div><div><dt>UPDATED</dt><dd>${items[0]?.date || "준비 중"}</dd></div>`;
    $("#contentGrid").innerHTML = items.length ? items.map(card).join("") : `<div class="empty"><b>${esc(section.label)}</b><p>검수 완료된 콘텐츠가 등록되면 이곳에 표시됩니다.</p></div>`;
    document.querySelectorAll("[data-kind]").forEach(button => button.classList.toggle("active", button.dataset.kind === active));
  }
  function openDetail(id) {
    const item = publishedItems().find(value => String(value.id) === String(id));
    if (!item) return;
    const related = relatedFor(item);
    $("#detailBody").innerHTML = `<p class="eyebrow">${esc(sections.find(value => value.key === item.kind)?.label || "VIP")}</p><h1>${esc(item.title)}</h1><div class="meta">${esc(item.date || "")} · ${(item.tags || []).map(tag => `#${esc(tag)}`).join(" ")}</div><p class="summary">${esc(item.summary || "")}</p>${safeBody(item.bodyHtml)}${assetButtons(item)}${related.length ? `<section class="related"><h2>함께 볼 콘텐츠</h2>${related.map(card).join("")}</section>` : ""}`;
    $("#detail").hidden = false;
    requestAnimationFrame(() => $("#detail").classList.add("open"));
  }
  function closeDetail() {
    $("#detail").classList.remove("open");
    setTimeout(() => { $("#detail").hidden = true; }, 160);
  }
  async function openAsset(assetId, button) {
    const pendingWindow = window.open("about:blank", "_blank", "noopener");
    if (button) { button.disabled = true; button.textContent = "권한 확인 중…"; }
    try {
      const url = await window.GFieldHFSupabase.signedAssetUrl("vip", assetId);
      if (pendingWindow) pendingWindow.location.replace(url);
      else window.location.href = url;
    } catch (error) {
      if (pendingWindow) pendingWindow.close();
      alert("자료를 열지 못했습니다. 권한과 로그인 상태를 확인해 주세요.");
    } finally {
      if (button) { button.disabled = false; button.textContent = "자료 다시 열기"; }
    }
  }

  async function init() {
    session = await auth.ready();
    if (!session || !auth.canAccess(session, "vip")) {
      $("#blocked").hidden = false;
      return;
    }
    await loadRemoteContent();
    $("#app").hidden = false;
    $("#memberName").textContent = session.name;
    $("#categoryNav").innerHTML = sections.map((section, index) => `<button type="button" data-kind="${esc(section.key)}"><span>0${index + 1}</span><b>${esc(section.label)}</b><small>${esc(section.description)}</small></button>`).join("");
    $("#categoryNav").addEventListener("click", event => { const button = event.target.closest("[data-kind]"); if (button) { active = button.dataset.kind; render(); } });
    $("#contentGrid").addEventListener("click", event => { const button = event.target.closest("[data-id]"); if (button) openDetail(button.dataset.id); });
    $("#detail").addEventListener("click", event => { const close = event.target.closest("[data-close]"); const asset = event.target.closest("[data-asset-id]"); const card = event.target.closest("[data-id]"); if (close) closeDetail(); else if (asset) openAsset(asset.dataset.assetId, asset); else if (card) openDetail(card.dataset.id); });
    render();
  }

  init().catch(error => {
    console.error("VIP Lounge initialization failed", error);
    $("#blocked").hidden = false;
  });
})();
