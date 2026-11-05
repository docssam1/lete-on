---
name: web-ui-library-picks
description: 원장이 소개 영상으로 보낸 웹 UI 라이브러리 7개(Anime.js · Motion · Bklit UI · react-three-fiber · liquid-glass-js · shadergradient · liquid-logo)를 지필드 화면에 쓸지 판정한 기록과 쓰는 법. 화면에 움직임·숫자 애니메이션·그래프·3D·유리/그라데이션 효과를 넣자는 말이 나오거나, 새 라이브러리를 들이자는 말이 나올 때 먼저 읽는다.
---

# 웹 UI 라이브러리 7개 — 무엇을 쓰고 무엇을 안 쓰나

원장(2026-11-04)이 영상 두 개를 보냈다.
- 「AI 느낌 나잖아요?」 영상: 보라 그라데이션 · 반짝 이모지 · 똑같은 카드 3개 · 전부 가운데 정렬을 AI 티로 꼽고, 로고·인트로는 Anime.js, 버튼·메뉴는 Motion, 숫자·그래프는 Bklit UI를 권함.
- 「이 4개만 설치하면 됩니다」 영상: react-three-fiber · liquid-glass-js · shadergradient · liquid-logo.

먼저 정할 것: **우리 화면은 React 없는 정적 페이지(바닐라 ES 모듈, GitHub Pages)다.** React 전용 라이브러리는 그대로 못 쓴다. 디자인은 원장 결정·`gfield-textbook-design`(따뜻한 종이 + 깊은 초록)이 먼저이고, `frontend-design`의 「움직임은 한 곳에 한 번」을 따른다.

## 판정표

| 라이브러리 | 하는 일 | 판정 | 이유 · 쓰는 곳 |
|---|---|---|---|
| **Anime.js** 4.5.0 (MIT) | 짜인 순서의 움직임(타임라인·글자 쪼개기·SVG 선 그리기·숫자) | **씀** | 첫 화면 인트로(`home.js`: 로고가 굴러 들어오고 큰 글자 GIFTED MATH BANK가 한 글자씩 올라옴), 스스로 공부 첫 화면(`start.js` → `playIntro`: 「오늘 공부할 내용은?」 글자째 · 교재 목록 하나씩, 단추 누름은 Motion), 스스로 공부 덱 표지 들어오기, 도착 장 메달 체크 그리기·숫자 0부터 올리기·점수 고리 |
| **Motion** 12.43.0 (MIT) | 누른 데 답하는 움직임(스프링·press·hover) | **씀** | 덱 장 넘김(누른 방향에서 들어옴), 단추 누름(쏙 들어갔다 튐) |
| **Bklit UI** | 숫자·차트 컴포넌트(shadcn 꼴) | **못 씀 → 생각만** | React 전용. 같은 생각(숫자가 올라가고 고리가 차오름)을 Anime.js + SVG로 그렸다(`study-motion.js` `ringMarkup`) |
| react-three-fiber | Three.js를 React로 | **안 씀** | React가 없다. 3D는 이미 Three.js를 직접 쓴다(과학 랩·쌓기나무) |
| liquid-glass-js | 유리 굴절 효과 | **안 씀** | 종이·초록 교재 결과 안 맞고 아이 기기에서 무겁다 |
| shadergradient | 움직이는 그라데이션 배경 | **안 씀** | 영상 1이 꼽은 「그라데이션 = AI 티」 그 자체 |
| liquid-logo | 로고가 출렁이는 WebGL 효과 | **안 씀** | 로고 하나 꾸미는 용도, 공부 화면에 쓸 데 없음 |

## 쓰는 법(Anime.js · Motion)

- 라이브러리는 **저장소에 넣어 둔다**(`fields-classic/question-bank/vendor/animejs-4.5.0/anime.esm.min.js`, `vendor/motion-12.43.0/motion.min.js`, 각 LICENSE). CDN에 기대지 않는다 — 학원 망·외부 사이트가 막혀도 돈다. 판은 2주 넘게 지난 정확한 판만.
- 움직임은 한 모듈에 모은다: `study-motion.js` — `playCover` · `playEnd` · `enterSlide` · `bindPress` · `ringMarkup`.
- Motion은 UMD(`<script defer>`, 전역 `Motion`)로 모듈보다 먼저 불러온다. Anime.js는 ESM으로 import.
- **움직임 줄이기 설정**(`prefers-reduced-motion`)이면 움직이지 않고 끝 모습만.
- 저절로 움직이는 것은 **한 장에 한 번**(표지는 처음 한 번만). 나머지는 아이가 누른 데 답하는 움직임만.

## AI 티 지우기(영상 1)

- 보라 그라데이션 주 단추 → 단색 + 아래 그림자(게임 단추처럼).
- 똑같은 카드 다섯 개(표지 공부 순서) → 번호 동그라미를 점선으로 잇는 길(차례가 있는 내용이라 번호는 그대로).
- 반짝 이모지 단추 글은 쓰지 않는다(「🖨 인쇄해서 풀기」 → 「인쇄해서 풀기」).

## 새 라이브러리가 또 오면

1. React·빌드 도구가 필요한지 본다 — 필요하면 그대로는 못 쓴다.
2. 판정표에 한 줄 더하고, 쓰면 vendor에 넣고 이 스킬과 스킬 지도(`docssam1/agent-skill-atlas`)를 고친다.
