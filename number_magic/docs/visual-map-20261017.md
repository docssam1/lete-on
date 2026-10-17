# 연산 로드맵 그림 지도 — 2026-10-17

## 범위

- 기존 `길 로드맵`의 과정 목록과 조건부 3D 길은 유지하고, 같은 화면에 `그림 지도` 보기 전환을 추가했다.
- 그림의 다섯 지점은 `data/stages.js`의 실제 10단계를 묶어 보여 준다. 선택한 단계에서 기존 과정 목록의 해당 과정으로 이동한다.
- 현재 위치는 `currentCourseKey()`로만 판단한다. 교재 과정 번호, 학습 완료 추정, 과목 확장, 나이별 도달 시기는 그림 지도에 넣지 않았다.
- 이미지에는 텍스트가 없다. 단계명·과정 범위·현재 상태·이동은 한·영·중 HTML 버튼과 단계 설명 카드로 표시한다. 모바일 지도는 가로 스크롤하며 단계 설명은 아래에서 읽는다.

## 이미지 자산

- 파일: `assets/growth-map-20261017.webp` (1672×941, WebP 252 KiB). 새 그림이며 첨부 참고 이미지나 외부 교재 사진을 저장소에 복사하지 않았다.
- 생성 방식: Codex 내장 `image_gen`, 새 이미지 생성 모드. 투명 배경을 사용하지 않았다. 생성 PNG를 화질 84의 WebP로 인코딩했다.
- 최종 생성 프롬프트:

> Create one ORIGINAL finished background illustration for an interactive Korean children's mathematics learning roadmap, landscape panoramic 16:9 composition. The artwork is a polished storybook diorama seen from an elevated three-quarter view: an archipelago of five distinct floating garden islands above soft clouds, linked by one continuous gently winding violet footpath that begins at the LOWER LEFT and ends at the UPPER RIGHT. The visual landmarks progress from (1) simple counting pebbles, colored blocks and a tiny garden, (2) wooden arithmetic tools and geometric shapes, (3) a graceful tower of mathematical discovery and a bridge, (4) a more mature academy of abstract shapes, (5) a calm summit observatory with a flowing curve motif. Keep a broad uncluttered landing terrace on or near each island where application code can overlay an HTML label/button; preserve clear contrast and don't fill those landing areas with small props. Palette: warm paper white and soft cream, deep navy architectural accents, muted gold details, sage greenery; luminous lavender path as the main accent. Tasteful soft 3D illustration, handcrafted miniature materials, gentle morning light, inviting but restrained. Follow the mood of a premium educational map, without copying any provided screenshot, character, layout, or identifiable design. Crucial: NO text, letters, numbers, equations, glyphs, signs, labels, user interface, logos, watermarks, humans, children, faces, or readable book pages. Artwork only. Make the winding route and destinations immediately legible at thumbnail size. Edge-to-edge scene, suitable as a WebP asset beneath accessible live HTML controls.

## 로컬 검증

- `scripts/check-visual-map.js`: 1280×900 / 390×844, 한국어·영어·중국어, 이미지 디코딩, 5개 지점, 현재 위치, 10단계의 지역 선택, 과정 49 이동, 기존 길 왕복, Enter 조작, 44px 이상 터치 영역, 문서 가로 넘침 없음. 통과.
- `scripts/check-stages.js`: 10단계·74과정·557회차 정합성 통과.
- WebGL2가 실제로 켜진 Chromium에서 그림 지도 → 길 로드맵 전환 뒤 기존 3D 길이 마운트되고 페이지 오류가 없음을 확인했다(임시 검수 스크립트 `/tmp/check-visual-map-webgl.js`).
- `node --check app/main.js`, `git diff --check`: 통과.
- 기존 `scripts/check-pace-compare.js`는 이 변경 전부터 `C2` 제목을 `받아올림`으로 기대하지만 현재 `data/courses.js`의 `C2` 제목은 `받아내림과 1학년 마무리`라 1개 항목이 실패한다. 변경 파일 밖의 기준표/마일스톤 대응은 별도 교육과정 검수로 다뤄야 한다. 이 검사에서 다른 15항목(브라우저 한·영·중 포함)은 통과했다.

## 배포 상태

브랜치 `codex/visual-growth-map-20261017`, 기준 `origin/main` `cebc4729b4ed4a8e410b3412bc22f97ee8d42360`. 문서 작성 시점에는 로컬 구현·검증 상태이며 PR, 원격 반영, 배포 상태는 이후 기록으로 구분한다.
