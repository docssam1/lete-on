// 첫 화면(home.html): 카드 세 장의 주소에 학생 이름(?student=)을 이어 붙인다.
const student = new URLSearchParams(location.search).get("student");
if (student) {
  document.querySelectorAll("a[data-link]").forEach((a) => {
    const url = new URL(a.getAttribute("href"), location.href);
    url.searchParams.set("student", student);
    a.href = `./${url.pathname.split("/").pop()}${url.search}${url.hash}`;
  });
}
