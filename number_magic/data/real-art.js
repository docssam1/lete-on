/* 실사 PNG 목록 — 토큰 → 파일. 비어 있으면 전부 직접 그린 SVG. 파일을 assets/images/real/ 에 넣고 한 줄 추가.
   토큰은 object-art.js 의 이모지 키('🍎')·'animal:rabbit'·'num:7' 그대로. 예: '🍎':'apple.png'
   2026-10-05 — GPT 1차분 23종(512×512 RGBA). 최종 작화 검수 전(README-제작현황). 나머지 15종은 미제작이라 SVG 그대로. */
window.NM_REAL_ART = {
  '🍎':'apple.png', '🐤':'chick.png', '⭐':'star.png', '🎈':'balloon.png', '🐟':'fish.png', '🦋':'butterfly.png',
  '🌼':'flower.png', '🍓':'strawberry.png', '🍪':'cookie.png', '🪙':'coin.png', '⚫':'stone-black.png',
  '🍌':'banana.png', '⚽':'soccer-ball.png', '🏀':'basketball.png', '🍬':'candy.png', '🐞':'ladybug.png',
  'animal:rabbit':'rabbit.png', 'animal:turtle':'turtle.png', 'animal:bear':'bear.png', 'animal:fox':'fox.png',
  'animal:raccoon':'raccoon.png', 'animal:squirrel':'squirrel.png', 'animal:sheep':'sheep.png'
};
