# 실사 그림 놓는 자리

`data/real-art.js` 의 `NM_REAL_ART` 표에 **파일명이 적힌 것만** 화면·인쇄에서 실사 PNG 로 쓰이고,
표에 없거나 파일이 없으면 직접 그린 SVG(`app/object-art.js`·`app/animal-art.js`)가 그대로 나온다.
그래서 GPT 가 그림을 한 장씩 올릴 때마다 표에 한 줄씩만 추가하면 된다(전부 모일 때까지 기다릴 필요 없음).

규격과 목록은 저장소 루트 `number_magic/실사-그림-작화지시서.md`.

## 현황 (2026-10-05)
1차 23종 적용 — 세는 물건 16종 전부 + 동물 `rabbit·turtle·bear·fox·raccoon·squirrel` + `sheep`.
미제작 15종(deer·wolf·duck·tiger·pebble-1~3·pouch·pouch-stones·fence·cloud-1·2·sun·moon·meadow)은 SVG 그대로.
GPT 쪽 최종 작화 검수 전 상태 — 사진 표현·동물 옆모습·가장자리 후광은 눈으로 확인 필요.
