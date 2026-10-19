# 연산 로드맵 그림 지도 — 2026-10-17

## 범위

- 기존 `길 로드맵`의 과정 목록과 조건부 3D 길은 유지하고, 같은 화면에 `그림 지도` 보기 전환을 추가했다.
- 그림의 다섯 지점은 `data/stages.js`의 실제 10단계를 묶어 보여 준다. 선택한 단계에서 기존 과정 목록의 해당 과정으로 이동한다.
- 그림 지도 표식은 실제 학습 기록과 시작점 추천을 분리한다. 실제 학습 위치는 최근 학습한 유닛의 과정에서, 시작점 표식은 진단 추천 또는 사용자가 직접 고른 과정에서 계산한다. 학습 기록이 없으면 실제 학습 위치를 표시하지 않는다.
- 실제 학습 위치는 청록색 실선, 선택·진단 시작점은 금색 점선과 이름표로 구별한다. 아래 범례와 접근성 이름에도 뜻을 적어 색만으로 구별하지 않아도 된다.
- 이미지에는 텍스트가 없다. 단계명·과정 범위·현재 상태·이동은 한·영·중 HTML 버튼과 단계 설명 카드로 표시한다. 모바일 지도는 가로 스크롤하며 단계 설명은 아래에서 읽는다.

## 이미지 자산

- 파일: `assets/growth-map-20261017.webp` (1672×941, WebP 252 KiB). 새 그림이며 첨부 참고 이미지나 외부 교재 사진을 저장소에 복사하지 않았다.
- 생성 방식: Codex 내장 `image_gen`, 새 이미지 생성 모드. 투명 배경을 사용하지 않았다. 생성 PNG를 화질 84의 WebP로 인코딩했다.
- 최종 생성 프롬프트:

> Create one ORIGINAL finished background illustration for an interactive Korean children's mathematics learning roadmap, landscape panoramic 16:9 composition. The artwork is a polished storybook diorama seen from an elevated three-quarter view: an archipelago of five distinct floating garden islands above soft clouds, linked by one continuous gently winding violet footpath that begins at the LOWER LEFT and ends at the UPPER RIGHT. The visual landmarks progress from (1) simple counting pebbles, colored blocks and a tiny garden, (2) wooden arithmetic tools and geometric shapes, (3) a graceful tower of mathematical discovery and a bridge, (4) a more mature academy of abstract shapes, (5) a calm summit observatory with a flowing curve motif. Keep a broad uncluttered landing terrace on or near each island where application code can overlay an HTML label/button; preserve clear contrast and don't fill those landing areas with small props. Palette: warm paper white and soft cream, deep navy architectural accents, muted gold details, sage greenery; luminous lavender path as the main accent. Tasteful soft 3D illustration, handcrafted miniature materials, gentle morning light, inviting but restrained. Follow the mood of a premium educational map, without copying any provided screenshot, character, layout, or identifiable design. Crucial: NO text, letters, numbers, equations, glyphs, signs, labels, user interface, logos, watermarks, humans, children, faces, or readable book pages. Artwork only. Make the winding route and destinations immediately legible at thumbnail size. Edge-to-edge scene, suitable as a WebP asset beneath accessible live HTML controls.

## 로컬 검증

- `scripts/check-visual-map.js`: 1280×900 / 390×844, 한국어·영어·중국어, 이미지 디코딩, 5개 지점, 실제 학습·시작점 표식 구분, 10단계의 지역 선택, 과정 49 이동, 기존 길 왕복, Enter 조작, 44px 이상 터치 영역, 문서 가로 넘침 없음. 통과.
- `scripts/check-stages.js`: 10단계·74과정·558회차 정합성 통과.
- WebGL2가 실제로 켜진 Chromium에서 그림 지도 → 길 로드맵 전환 뒤 기존 3D 길이 마운트되고 페이지 오류가 없음을 확인했다(임시 검수 스크립트 `/tmp/check-visual-map-webgl.js`).
- `node --check app/main.js`, `git diff --check`: 통과.
- 기존 `scripts/check-pace-compare.js`는 이 변경 전부터 `C2` 제목을 `받아올림`으로 기대하지만 현재 `data/courses.js`의 `C2` 제목은 `받아내림과 1학년 마무리`라 1개 항목이 실패한다. 변경 파일 밖의 기준표/마일스톤 대응은 별도 교육과정 검수로 다뤄야 한다. 이 검사에서 다른 15항목(브라우저 한·영·중 포함)은 통과했다.

## 배포 상태

첫 그림 지도는 브랜치 `codex/visual-growth-map-20261017`에서 PR [#350](https://github.com/docssam1/lete-on/pull/350)으로 `main`의 `904c68fc80df6e5e0239866daa6ec71d9b9c638a`에 병합됐다. GitHub Pages [실행 39022445229](https://github.com/docssam1/lete-on/actions/runs/39022445229)이 성공했고 공개 사이트에서 그림 표시·5개 지점·길 전환·페이지 오류 0건을 확인했다.

## 표지판 아래 길잡이 캐릭터 후속

- 다섯 표지판마다 기존 승인 캐릭터 PNG(누미·포코·모모·루트·무한)를 아래에 배치했다. 새 이미지를 생성하거나 외부 교재 자료를 추가하지 않았다.
- 표지판 또는 캐릭터를 누르면 선택한 범위에 맞는 한·영·중 설명 말풍선과 기존 `NM_STAGES` 단계 카드가 나온다. 캐릭터 설명은 실제 과정 범위 C0~10 / C11~25 / C26~28 / C29~37 / C38~73에서 배우는 개념만 짧게 소개한다. 단계 카드에서 기존 과정 길로 이동하는 동작은 유지한다.
- 설명은 화면의 텍스트이며 기기 음성 자동 재생은 없다. 캐릭터 그림의 대체 텍스트는 비우고 버튼 이름과 화면 읽기 알림에 설명을 연결했다. 다섯 캐릭터 모두 44px 이상 터치 영역 안에 있고 모바일 지도 그림 밖으로 나가지 않도록 했다.
- 후속 브랜치 `codex/visual-map-guides-20261017`에서 `scripts/check-visual-map.js`의 1280px/390px·한/영/중·캐릭터 이미지·설명·키보드·범위·가로 넘침 검사를 통과했다. 이 절은 후속 기능의 로컬 검증 기록이며 원격 반영·공개 배포는 별도로 확인한다.
- 2026-10-19 후속 점검: 학습 기록이 없을 때는 시작점만 표시하고, 실제 학습 과정과 다른 추천 시작 과정은 별도 표식·단계 배지로 보여 주도록 검사했다.
