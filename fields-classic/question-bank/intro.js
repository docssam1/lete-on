const params = new URLSearchParams(location.search);
const student = params.get("student") || params.get("name") || "";

document.querySelectorAll("[data-preserve-student]").forEach((link) => {
  if (!student) return;
  const url = new URL(link.getAttribute("href"), location.href);
  url.searchParams.set("student", student);
  link.href = url.href;
});
