# 작화 기록 — 2026-10-02

내장 이미지 생성 도구 사용. API/CLI나 유료 외부 음성으로 전환하지 않았습니다. 최종 파일은 저장소에 복사했고 원본은 E:에 보존했습니다. 수식·정답·기호는 이미지 모델이 아닌 코드로 조판합니다.

## 안내 누미

- 저장: `assets/images/characters/numi.png` (512×512, 투명 PNG).
- 기존 누미 0의 몸체와 모자 참고. 기존 자산 교체 지시 범위입니다.
- 최종 프롬프트: "Identity-preserve. Preserve the official orange plump zero body, visible center hole, eyes, cheeks, little arms and feet. Use the second reference only for a purple wizard hat with a gold star. One full-body Num i / Numi zero, calm teaching smile, one arm inviting. Polished soft jelly/clay storybook character, readable at 40 px, 6% safe padding. Genuine transparent background. No text, no additional elements, no cast shadow."
- 원본: `E:/Codex/generated_images/01a0c4fc-013d-7dd1-99bc-8dea18dee7f0/exec-84d61970-63d4-41dd-a622-dbaee0ed98b6.png`.
- 나머지 11개 역사 인물 PNG는 이번에 일괄 교체하지 않았습니다.

## 9 = 10 − 1 손

- 저장: `assets/images/concepts/hands-nine.png`, `assets/images/story/N-07.svg`.
- 최종 프롬프트: "Scientific-educational. One pair of front-facing palms, two human toy hands in warm peach jelly/clay material, matching the Numi reference. Left hand: all five fingers open, including thumb. Right hand: pinky folded, thumb/index/middle/ring open, exactly four open fingers. Exactly nine open fingers total. Both hands complete, no cropping, no numerals, no props or shadows. Transparent landscape background."
- 육안 확인: 열린 손가락 5+4=9. SVG에 수식은 따로 조판하고 PNG를 내장하여 인쇄에서도 빠지지 않게 합니다.
- 원본: `E:/Codex/generated_images/01a0c4fc-013d-7dd1-99bc-8dea18dee7f0/exec-620e476e-a76c-43e8-b57d-0bda8bec078e.png`.

## 열 칸 타일

- 저장: `assets/images/concepts/counting-tile.png` (256×256), `data/story-comics-src/N-07.js`.
- 최종 프롬프트: "Stylized-concept. One reusable navy blue rounded square counting tile, almost straight-on front view, subtle top/bevel. Numi reference for polished jelly/clay style only. Soft studio highlights. One tile, transparent padding, no text/numerals/face/clusters/ground/shadow/glow. Code will repeat it exactly eight or ten times."
- 원본: `E:/Codex/generated_images/01a0c4fc-013d-7dd1-99bc-8dea18dee7f0/exec-16cb7d58-4804-4937-b37f-7f95b8c1399f.png`.
- 타일 수는 코드로 고정합니다. 네 컷의 채운 칸 수 8·8·9·7과 빈 칸 수 2·2·1·3을 검사합니다.
- N-10 막대그래프 위 막대 안내 인물도 누미 PNG로 교체했습니다. 그림 파일 내부에 내장해 외부 이미지 로딩에 의존하지 않습니다.

## 남은 범위

나머지 오래된 그림은 후속 교체 대상입니다. 장식 그림을 수량 그림으로 대체하지 않고, 별도 검수 후 연결합니다. 기호 39종은 작화 지시서까지 작성한 상태이며 실제 PNG 제작 완료가 아닙니다.

## 산가지

- 저장: `assets/images/concepts/counting-rod.png`, `data/story-comics-src/M-01.js`.
- 최종 프롬프트: "Scientific-educational. ONE traditional upright red counting rod, deep vermilion polished jelly/clay material, subtle bevels and studio highlights matching Numi style. Straight slim rod height six times width. Full object, no markings/numerals/hand/face/extra rods/shadow/glow/base. Genuine transparent portrait background."
- 원본: `E:/Codex/generated_images/01a0c4fc-013d-7dd1-99bc-8dea18dee7f0/exec-d8787447-ba9f-432b-bd06-c9577a908603.png`.
- 코드가 양수 세 개·음수 두 개를 반복 배치합니다. 음수는 SVG의 색 필터로 검게 표시하며 부호 숫자도 함께 표기합니다. 원본 PNG는 수정하지 않습니다.
