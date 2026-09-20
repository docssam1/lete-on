/* ============================================================
   Numbers of Magic — 수식 표기 다듬기 (2026-09-20)

   생성기 191개가 각자 문자열을 이어 붙여 식을 만든다. 계수가 1이나 0일 때
   `1x` · `+ 0x^2` · `2^{x + 0}` 이 그대로 남고, 풀이 단계에서는 음수를 그대로
   이어 붙여 `(x--59)` · `-3887 - -3888` 같은 이중부호가 나온다. 학습지에 실제로
   그렇게 인쇄되고 있었다(중·고 24개 유형 · 풀이 단계 20개 생성기).

   생성기 25곳을 따로 고치는 대신 **그리기 직전 한 곳에서** 다듬는다 —
   인쇄(exam.js texDisplay·폴백)와 화면(main.js math·widgets.js) 모두 이 함수를 거친다.
   검사기 scripts/check-tex-hygiene.js 가 다듬은 뒤의 식을 본다.

   ⚠️ 변수( x·y )가 없는 식은 건드리지 않는다 — 자릿값 분해 `100 + 30 + 0`,
   배수 판정 `(1+5)-(1+0)` 처럼 0을 일부러 보여 주는 단원이 있다.
   ⚠️ \text{…} 안(한국어 설명)과 _{…}(진법 밑첨자)은 검사·치환 모두에서 제외한다.
   ============================================================ */
(function () {
  'use strict';

  /* \text{…} 를 잠시 자리표로 빼 두고 식만 다듬는다 */
  function protect(tex, store) {
    return String(tex).replace(/\\text\{[^}]*\}/g, m => {
      store.push(m);
      return '\u0000' + (store.length - 1) + '\u0000';
    });
  }
  function restore(tex, store) {
    return tex.replace(/\u0000(\d+)\u0000/g, (m, i) => store[+i]);
  }

  function tidy(tex) {
    if (tex == null) return tex;
    let s = String(tex);
    if (!s) return s;
    const store = [];
    s = protect(s, store);

    /* 이중부호는 변수 유무와 상관없이 틀린 표기다 — `a - -b` → `a + b`, `a + -b` → `a - b` */
    /* 원래 띄어쓰기를 따라간다 — `x--59` 는 `x+59`, `-3887 - -3888` 은 `-3887 + 3888` */
    s = s.replace(/(\s*)-\s*-\s*(?=[\d.\\])/g, (m, sp) => sp ? sp + '+ ' : '+');
    s = s.replace(/(\s*)\+\s*-\s*(?=[\d.\\])/g, (m, sp) => sp ? sp + '- ' : '-');
    /* 괄호 바로 뒤의 이중부호: `(x--59)` 처럼 여는 괄호 다음에 온 것도 같은 규칙 */
    s = s.replace(/\(\s*\+\s*/g, '(');

    /* 변수 글자 — x·y 뿐 아니라 치환에 쓰는 t 도 본다(`t^2 + 0t - 64`).
       \text{…} 는 protect 가 빼 두었으므로 한국어 설명 안 글자에는 걸리지 않는다. */
    if (/[xyt]/.test(s)) {
      /* 계수 1 — `1x`, `- 1x^2`, `(1x` … 숫자의 일부(`21x`)는 건드리지 않는다 */
      s = s.replace(/(^|[\s({+\-=,])1(?=[xyt])/g, '$1');
      /* 계수 0인 항은 통째로 없앤다 — `+ 0x^2`, `- 0t` */
      s = s.replace(/\s*[+\-]\s*0[xyt](\^\{?-?\d+\}?)?/g, '');
      /* 상수항 0 — 식 끝이나 괄호·구분자 앞에서만(`x^2 - 8x + 0`, `2^{x + 0}`).
         `\\;` `\\,` `\\Rightarrow` 처럼 뒤에 오는 명령어도 끝으로 친다. */
      s = s.replace(/\s*[+\-]\s*0(?=\s*(?:[)}\]]|$|\\[;,]|\\cdots|\\Rightarrow|=|\\le|\\ge|<|>))/g, '');
      /* 맨 앞에 남은 `+ ` (앞 항이 지워졌을 때) */
      s = s.replace(/^\s*\+\s*/, '');
      s = s.replace(/([({])\s*\+\s*/g, '$1');
    }
    /* 공백 정리 — 치환으로 생긴 두 칸 이상 */
    s = s.replace(/ {2,}/g, ' ').trim();
    return restore(s, store);
  }

  const api = { tidy };
  if (typeof window !== 'undefined') window.NM_TEX = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
