(function () {
  "use strict";
  const auth = window.GFieldHFPortalAuth;
  const portal = window.GFIELD_HF_PORTAL;
  const data = window.GFIELD_HF_VIP_DATA || { items: [] };
  const session = auth.current();
  const sections = portal.vipSections;
  const $ = selector => document.querySelector(selector);
  let active = sections[0].key;

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[char]);
  }
  function publishedItems() {
    return data.items.filter(item => item && ["reviewed", "published"].includes(item.status));
  }
  function safeBody(html) {
    const template = document.createElement("template");
    template.innerHTML = String(html || "");
    template.content.querySelectorAll("script,style,iframe,object,embed,link,meta,form,input,button,textarea").forEach(node => node.remove());
    template.content.querySelectorAll("*").forEach(node => Array.from(node.attributes).forEach(attribute => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim().toLowerCase();
      if (name.startsWith("on") || name === "style" || (["href", "src"].includes(name) && (value.startsWith("javascript:") || value.startsWith("data:text/html")))) node.removeAttribute(attribute.name);
    }));
    return template.innerHTML;
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
    $("#detailBody").innerHTML = `<p class="eyebrow">${esc(sections.find(value => value.key === item.kind)?.label || "VIP")}</p><h1>${esc(item.title)}</h1><div class="meta">${esc(item.date || "")} · ${(item.tags || []).map(tag => `#${esc(tag)}`).join(" ")}</div><p class="summary">${esc(item.summary || "")}</p>${safeBody(item.bodyHtml)}${related.length ? `<section class="related"><h2>함께 볼 콘텐츠</h2>${related.map(card).join("")}</section>` : ""}`;
    $("#detail").hidden = false;
    requestAnimationFrame(() => $("#detail").classList.add("open"));
  }
  function closeDetail() {
    $("#detail").classList.remove("open");
    setTimeout(() => { $("#detail").hidden = true; }, 160);
  }

  if (!session || !auth.canAccess(session, "vip")) {
    $("#blocked").hidden = false;
    return;
  }
  $("#app").hidden = false;
  $("#memberName").textContent = session.name;
  $("#categoryNav").innerHTML = sections.map((section, index) => `<button type="button" data-kind="${esc(section.key)}"><span>0${index + 1}</span><b>${esc(section.label)}</b><small>${esc(section.description)}</small></button>`).join("");
  $("#categoryNav").addEventListener("click", event => { const button = event.target.closest("[data-kind]"); if (button) { active = button.dataset.kind; render(); } });
  $("#contentGrid").addEventListener("click", event => { const button = event.target.closest("[data-id]"); if (button) openDetail(button.dataset.id); });
  $("#detail").addEventListener("click", event => { const close = event.target.closest("[data-close]"); const card = event.target.closest("[data-id]"); if (close) closeDetail(); else if (card) openDetail(card.dataset.id); });
  render();
})();
