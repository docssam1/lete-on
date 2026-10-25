// 손글씨 판서 대본들이 함께 쓰는 도구. 권별 대본 파일(concept-boards-bNN.js)과 concept-boards.js가 여기서 가져온다
// (concept-boards.js를 서로 가져오면 순환 import에서 상수가 아직 없는 때가 생긴다).

// 숫자 뒤 조사: 우리말로 읽은 마지막 소리에 받침이 있으면 앞 것, 없으면 뒤 것. ㄹ 받침(1·7·8)은 「로」.
// jo(5, "을") → "5를", jo(9, "이에요") → "9예요", jo(10, "과") → "10과"
const BATCHIM = { 0: "ㅇ", 1: "ㄹ", 2: "", 3: "ㅁ", 4: "", 5: "", 6: "ㄱ", 7: "ㄹ", 8: "ㄹ", 9: "" };
const PAIRS = { "이": ["이", "가"], "가": ["이", "가"], "을": ["을", "를"], "를": ["을", "를"], "은": ["은", "는"], "는": ["은", "는"], "과": ["과", "와"], "와": ["과", "와"], "이에요": ["이에요", "예요"], "예요": ["이에요", "예요"], "으로": ["으로", "로"], "로": ["으로", "로"], "이라": ["이라", "라"], "라": ["이라", "라"], "이고": ["이고", "이고"], "이니까": ["이니까", "이니까"], "도": ["도", "도"] };
export function jo(value, particle) {
  const t = String(value), last = t.match(/(\d+)\s*$/);
  let fin;
  if (last) { const n = Number(last[1]); fin = n % 10 ? BATCHIM[n % 10] : n % 100 ? "ㅂ" : n % 1000 ? "ㄱ" : "ㄴ"; }   // 십·백·천
  else { const c = t.charCodeAt(t.length - 1); fin = c >= 0xAC00 && c <= 0xD7A3 ? ((c - 0xAC00) % 28 ? "x" : "") : ""; }
  const [withB, without] = PAIRS[particle];
  if (withB === "으로") return t + (fin && fin !== "ㄹ" ? "으로" : "로");
  return t + (fin ? withB : without);
}
