/* 실사 PNG 목록 — 토큰 → 파일. 비어 있으면 전부 직접 그린 SVG. 파일을 assets/images/real/ 에 넣고 한 줄 추가.
   토큰은 object-art.js 의 이모지 키('🍎')·'animal:rabbit'·'num:7' 그대로. 예: '🍎':'apple.png'
   2026-10-05 — GPT 1차분 23종(512×512 RGBA). 최종 작화 검수 전(README-제작현황). 나머지 15종은 미제작이라 SVG 그대로. */
window.NM_REAL_ART = {
  '🍎':'apple.png', '🐤':'chick.png', '⭐':'star.png', '🎈':'balloon.png', '🐟':'fish.png', '🦋':'butterfly.png',
  '🌼':'flower.png', '🍓':'strawberry.png', '🍪':'cookie.png', '🪙':'coin.png', '⚫':'stone-black.png',
  '🍌':'banana.png', '⚽':'soccer-ball.png', '🏀':'basketball.png', '🍬':'candy.png', '🐞':'ladybug.png',
  'animal:rabbit':'rabbit.png', 'animal:turtle':'turtle.png', 'animal:bear':'bear.png', 'animal:fox':'fox.png',
  'animal:raccoon':'raccoon.png', 'animal:squirrel':'squirrel.png', 'animal:sheep':'sheep.png',
  /* 2026-10-07 — 실사-2차 19종(g1 유아 위젯 소품 토큰). 주사위 die-1~6 은 옆면 눈까지 보여 보류했다가 10-09 수정본으로 적용(아래).
     배(pear)는 지시서의 '연한 황갈색 배'가 아니라 노란 서양배 모양 — 세기 그림으로는 써도 되어 적용, 서양배 그대로 유지(2026-10-08 결정). */
  'bead-red':'bead-red.png', 'bead-blue':'bead-blue.png', 'bead-green':'bead-green.png', 'bead-yellow':'bead-yellow.png',
  'coin-star':'coin-star.png', 'coin-moon':'coin-moon.png', 'frog':'frog.png',
  'g:box':'box-closed.png', 'g:boxopen':'box-open.png', 'g:weight':'weight.png', 'g:traincar':'toy-traincar.png',
  'rugby-ball':'rugby-ball.png', 'baseball':'baseball.png', 'grapes':'grapes.png', 'watermelon':'watermelon.png',
  'melon':'melon.png', 'pear':'pear.png', 'kite':'kite.png', 'rain':'rain.png', 'weather-rain':'rain.png',
  /* 2026-10-08 — 실사-2차 3회분 19종(기관차·소품 12·손 6). 과녁(dart-target)은 진짜 다트판(20칸)이라 3겹 과녁과 달라 보류.
     양팔저울·과녁 본체는 기울기·띠 반지름으로 채점하는 그림이라 SVG 그대로 — g:scale·g:target 은 머리 아이콘만 덮는다. */
  'g:train':'toy-train.png', 'podium':'podium.png', 'ticket-booth':'ticket-booth.png', 'blackboard':'blackboard.png',
  'ticket':'ticket.png', 'desk':'desk.png', 'plate':'plate.png', 'cake':'cake.png', 'candle':'candle.png',
  'padlock':'padlock.png', 'gem':'gem.png', 'g:card':'number-card.png', 'g:scale':'balance-scale.png',
  'hand-0':'hand-0.png', 'hand-1':'hand-1.png', 'hand-2':'hand-2.png', 'hand-3':'hand-3.png', 'hand-4':'hand-4.png', 'hand-5':'hand-5.png',
  /* 2026-10-09 — 수정본: 주사위는 위에서 본 한 면(눈 1~6), 과녁은 3겹. die0(굴리기 전)은 SVG 그대로.
     g:target 은 과녁 문항 머리 아이콘만 — 과녁 본체(G.dartSvg)는 띠 반지름으로 점수를 매겨 SVG 그대로. */
  'die1':'die-1.png', 'die2':'die-2.png', 'die3':'die-3.png', 'die4':'die-4.png', 'die5':'die-5.png', 'die6':'die-6.png',
  'g:target':'dart-target.png'
};
