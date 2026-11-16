/* ============================================================
   Numbers of Magic — 식 안 한국어 설명 번역(2026-11-16)

   생성기가 식(tex)에 한국어 설명을 \text{…}로 넣는다(「52\text{의 약수}」「x=-3\text{일 때}」).
   한국어 학습지는 그대로 두고, 영어·중국어 학습지에서만 engine/tex-tidy.js 의 tidy()가
   그리기 직전에 이 표로 바꾼다. 생성기는 고치지 않는다(한국어 판이 바뀌지 않게).

   - rules: 식 전체에 거는 정규식. 어순이 바뀌는 것(「52의 약수」→「factors of 52」)을 여기서 한다.
            차례대로 걸린다. 바꾼 결과의 \text{…} 안에는 한글이 남지 않아야 한다.
   - text : \text{…} 안 글을 통째로 바꾸는 표(앞뒤 빈칸은 원래대로 둔다).
   표에 없는 글은 한국어 그대로 남는다 — 검사: 영어·중국어로 전 회차를 그려 한글을 센다.
   ============================================================ */
(function () {
  'use strict';
  const HANGUL = /[가-힣]/;

  /* 어순이 바뀌는 것. { re: 정규식(g), en: 바꿀 글, zh: 바꿀 글 } — $1 등으로 잡은 조각을 쓴다.
     en 이나 zh 를 빼면 그 언어에서는 이 규칙을 건너뛴다. */
  const RULES = [
  ];

  /* \text{…} 안 글 → { en, zh }. 열쇠는 앞뒤 빈칸을 뺀 한국어. */
  const TEXT = {
  };

  function swapText(s, lang) {
    return s.replace(/\\text\{([^{}]*)\}/g, (all, inner) => {
      if (!HANGUL.test(inner)) return all;
      const m = inner.match(/^(\s*)([\s\S]*?)(\s*)$/);
      const hit = TEXT[m[2]];
      return hit && hit[lang] != null ? '\\text{' + m[1] + hit[lang] + m[3] + '}' : all;
    });
  }
  function apply(tex, lang) {
    if (lang !== 'en' && lang !== 'zh') return tex;
    let s = String(tex);
    for (const r of RULES) if (r[lang] != null) s = s.replace(r.re, r[lang]);
    return swapText(s, lang);
  }

  const api = { apply, RULES, TEXT };
  if (typeof window !== 'undefined') window.NM_TEX_I18N = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
