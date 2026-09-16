# 게임 UI 부품 세트 작화 지시서 (디자인 패스 2)

> 수신: 아트 담당(GPT·Gemini 이미지 생성) · 발신: Numbers of Magic 제작팀 · 2026-09-16
> 산출물: **투명 PNG 11장**, 아래 파일명 그대로. 설치 위치 `number_magic/assets/ui/`.
> 목적: 배경(마을 지도·학습 무대)은 이미 그림인데 그 위의 **숫자 타일·판·버튼·리본·게이지가
> 평면 CSS**라 게임 화면처럼 안 보인다. 이 부품들을 그림으로 바꿔 "UI까지 그림"으로 만든다.
> 앱 쪽 CSS 훅은 **이미 들어가 있다** — 파일을 이 이름으로 넣기만 하면 화면에 바로 적용되고,
> 파일이 없으면 CSS가 그린 3D 모양(디자인 패스 2 기본형)으로 자동 폴백된다.

---

## 0. 무엇을 따라 하고, 무엇을 따라 하면 안 되는가

원장이 보여 준 참고 화면(저울 위에 색깔 숫자 큐브가 올라가는 팀 대결 게임)에서 가져올 것은
**"UI 부품 하나하나가 손으로 그린 물건"이라는 점**입니다:
- 숫자가 평면 사각형이 아니라 **부피 있는 큐브**
- 팀 이름이 글자만이 아니라 **리본 현수막** 위에
- 숫자들이 놓이는 곳이 흰 카드가 아니라 **나무·돌로 짠 쟁반(트레이)**
- 남은 시간이 숫자만이 아니라 **채워지는 게이지**

**따라 하면 안 되는 것 — 그 화면의 수채화·잉크 선 화풍.** 우리 세계는 이미 정해져 있습니다:
마을 지도(`assets/map.jpg`)·학습 무대(`assets/stages/*.jpg`)의 **그림책 삽화(soft painterly, 따뜻한
오후 빛)** + 캐릭터 21종의 **3D 젤리 광택**. 부품은 이 두 가지가 합쳐진 느낌 — "그림책 속 장난감
블록"이어야 하고, 참고 화면처럼 거친 붓 자국·검은 잉크 윤곽선이 있으면 기존 캐릭터와 한 화면에서
따로 놉니다.

## 1. 반드시 먼저 볼 것 (참고 이미지로 첨부)
- 화풍 기준: https://raw.githubusercontent.com/docssam1/lete-on/main/number_magic/assets/map.jpg
- 질감 기준(광택): `assets/characters/numi-0.png` `num-5.png` — 통통한 3D 젤리, 부드러운 하이라이트
- 부품이 올라갈 바닥: `assets/stages/stage-numberland.jpg` (아래 60%의 밝은 크림색 위에 놓인다)

## 2. 부품 11장

| # | 파일명 | 크기 | 무엇 | 앱에서 쓰는 곳 |
|---|---|---|---|---|
| 1 | `cube-blue.png` | 256×256 | 숫자 큐브 — **기본**(남색 계열 #16417C 톤) | 매직 랩 숫자 타일 기본 |
| 2 | `cube-gold.png` | 256×256 | 숫자 큐브 — **고른 것**(금색 #C9A063 톤, 살짝 더 밝게) | 타일 선택 상태 |
| 3 | `cube-green.png` | 256×256 | 숫자 큐브 — **맞춘 것**(초록 #2E9E6B 톤) | 짝 맞춘 타일 |
| 4 | `cube-red.png` | 256×256 | 숫자 큐브 — **경고/음수**(붉은 #D9534F 톤) | 음수·오답 강조(예비) |
| 5 | `tray.png` | 768×384 | **쟁반(트레이)** — 나무 테두리 + 안쪽은 밝은 양피지/천 | 마법판(문제식·숫자판 받침), 아레나 식 표시 |
| 6 | `ribbon.png` | 768×224 | **리본 현수막** — 양끝이 제비꼬리로 갈라진 가로 리본, 가운데 비움 | 라운드·제목·도장 이름 |
| 7 | `btn-primary.png` | 384×128 | **큰 버튼** — 두툼한 3D, 남색, 위쪽 광택, 아래 3~4px 어두운 밑면 | 주 버튼(확인·다음) |
| 8 | `btn-ghost.png` | 384×128 | **보조 버튼** — 크림색, 남색 얇은 테두리 | 보조 버튼 |
| 9 | `gauge-frame.png` | 768×96 | **게이지 틀** — 둥근 알약 모양, 안쪽 비어 있음(어두운 홈) | 남은 시간·진행도 |
| 10 | `gauge-fill.png` | 768×96 | **게이지 채움** — 틀 안쪽에 딱 맞는 초록 젤리 막대(왼쪽 끝 둥글게) | 위 틀 안에서 폭이 줄어든다 |
| 11 | `seal.png` | 512×512 | **도장(메달)** — 금색 원형 메달 + 리본 고리, 가운데 비움 | 유닛 완료 화면(지금은 🏅 이모지) |

### 큐브 4장 공통
- **정면을 보는 큐브를 살짝 위에서**(윗면이 얇게 보이는 정도, 약 15°). 참고 화면처럼 뒤로 많이 눕히지
  말 것 — 앱이 그 위에 **숫자 글자를 얹으므로** 정면이 넓고 평평해야 한다.
- 정면은 **한 가지 색의 매끈한 면**, 글자·무늬·점·홈 **금지**. 윗면은 밝게, 오른쪽 옆면은 어둡게.
- 젤리 광택: 윗면 가장자리에 부드러운 하이라이트 한 줄. 캐릭터와 같은 재질.
- 바닥 그림자 금지(앱이 그림자를 CSS로 준다). 네 장은 **색만 다르고 모양·크기·각도 완전히 같게**.

### 쟁반·버튼·게이지 — 9분할(9-slice)로 늘려 씁니다
앱은 이 그림을 **가로세로로 잡아늘려** 여러 크기에 씁니다. 그래서:
- **네 모서리 각 64px 안에만** 장식(못·나무결 끝·모서리 쇠장식)을 두고, **변의 가운데와 안쪽은
  균일한 질감**(늘려도 티 안 나게). 가운데에 큰 무늬·글자·그림 금지.
- 테두리 두께는 모서리 64px 기준으로 **바깥 24px** 정도(그 안쪽은 내용 영역).
- 게이지: 틀과 채움은 **같은 좌표계** — 겹쳐 놓으면 채움이 틀의 홈에 정확히 들어가야 한다.
  채움은 왼쪽 끝만 둥글고 오른쪽은 직각(앱이 오른쪽을 잘라 폭을 줄인다).

### 리본·도장
- 리본: 가운데 넓은 면은 **평평하고 단색**(글자가 3개 언어로 얹힌다). 양끝 제비꼬리는 살짝 뒤로 접힘.
  색은 두 가지 버전이 있으면 좋지만 1장이면 **남색(#16417C) 바탕 + 금색 가장자리**.
- 도장: 금색 메달 + 위 리본 고리. 가운데는 **비워** 둔다(앱이 별·숫자·이름을 얹는다).

## 3. 규격 (어기면 못 씁니다)

| 항목 | 규격 |
|---|---|
| 형식 | PNG, **투명 배경(알파)**. 표 크기 그대로(2배 해상도로 주면 제작팀이 줄임) |
| 여백 | 그림이 캔버스 가장자리에 **꽉 차게**(큐브·도장은 4% 여백만). 9분할 부품은 여백 0 |
| **글자 금지** | 어떤 글자·숫자·기호도 넣지 마세요. 전부 앱이 얹습니다 |
| 그림자 금지 | 바닥 그림자·외곽 글로우 금지(앱이 상황별로 준다) |
| 화풍 | §0 — 그림책 삽화 + 젤리 광택. 수채화 번짐·잉크 윤곽선·픽셀아트·사실적 3D 렌더 금지 |
| 색 | 큐브 4색은 위 HEX 톤. 나머지는 마을 지도 팔레트(따뜻한 나무·크림·남색·금) |
| 세트감 | 11장을 한 화면에 나란히 놓았을 때 **같은 손으로 그린 한 세트**로 보여야 한다 |

## 4. 복사해서 붙이는 프롬프트

공통 꼬리말 — 모든 프롬프트 끝에 붙입니다(참고 이미지 `map.jpg` + `numi-0.png` 첨부 필수):
```
Same world as the attached town map and character: storybook illustration, soft painterly shading,
warm afternoon light, with a gentle 3D jelly-like glossy highlight like the attached character.
A single game UI object, front view, centered, filling the frame. Transparent background PNG.
No text, no numbers, no letters, no symbols, no drop shadow on the ground, no glow, no border,
no watercolor bleeding, no black ink outlines, no pixel art, no photorealism.
```

| 파일 | 프롬프트 본문 |
|---|---|
| `cube-blue.png` | `A single toy block cube seen from the front, tilted only slightly so the top face shows as a thin band (about 15 degrees). Deep navy blue (#16417C) smooth front face with nothing on it, lighter top face, darker right side. Soft glossy highlight along the top edge. 256x256.` |
| `cube-gold.png` | (위와 같고) `... Warm gold (#C9A063) front face, slightly brighter than the others ...` |
| `cube-green.png` | (위와 같고) `... Fresh green (#2E9E6B) front face ...` |
| `cube-red.png` | (위와 같고) `... Soft red (#D9534F) front face ...` |
| `tray.png` | `A rectangular wooden tray panel, 2:1 landscape. Rounded warm wooden frame about 24px thick with small brass corner caps in each corner; inside is a flat, even, bright parchment/cloth surface with no pattern. The middle of each edge and the whole inside must be uniform so the image can be stretched. 768x384.` |
| `ribbon.png` | `A horizontal banner ribbon, 768x224. Deep navy (#16417C) cloth with a thin gold trim, wide flat center panel with nothing on it, both ends cut into swallow tails and folded slightly back. Gentle fabric shading.` |
| `btn-primary.png` | `A chunky rounded game button, 3:1 landscape, 384x128. Deep navy (#16417C) top with a soft glossy highlight on the upper half and a darker 4px base edge at the bottom giving it thickness. Plain surface, nothing on it. Corners rounded ~28px.` |
| `btn-ghost.png` | `Same shape as the previous button but cream (#FBFAF7) surface with a thin navy (#16417C) outline and a light lower edge. Plain surface.` |
| `gauge-frame.png` | `A pill-shaped progress gauge frame, 768x96. Warm wooden/brass rounded frame with a hollow dark inner groove running the full length. The inside is empty. Uniform along the length so it can be stretched.` |
| `gauge-fill.png` | `A glossy green (#2E9E6B) jelly bar that fits exactly inside the groove of the previous gauge frame, same 768x96 canvas and same position: rounded on the left end, square-cut on the right end, soft highlight on top. Only the bar, no frame.` |
| `seal.png` | `A round gold medal with a short ribbon loop at the top, 512x512. Embossed rim with a plain smooth center disc (nothing engraved), warm gold with soft painterly shading and a small glossy highlight.` |

## 5. 받아서 검수할 것 (제작팀)
- [ ] 투명 배경인가(흰 배경이 깔려 오면 반려)
- [ ] 글자·숫자·그림자·글로우 없음
- [ ] 큐브 4장을 겹쳐 봤을 때 윤곽이 같은 자리(색만 다른가)
- [ ] 쟁반·버튼·게이지: 가운데를 잡아늘려도 무늬가 깨지지 않는가(모서리 64px에만 장식)
- [ ] 게이지 채움을 틀 위에 겹치면 홈에 딱 맞는가
- [ ] 11장을 `stage-numberland.jpg` 위에 나란히 놓고 봤을 때 같은 세트·같은 세계로 보이는가
- 통과하면 `number_magic/assets/ui/`에 넣는다. **코드 수정 없음** — CSS가 파일이 있으면 그림, 없으면
  CSS 3D 폴백을 쓰도록 이미 되어 있다(`app/styles.css` "디자인 패스 2" 절).
- ⚠️ 앱은 **`cube-blue.png` 하나가 있는지만 보고** 그림 모드를 켠다(index.html 감지 스크립트). 그래서
  큐브 3장·`tray.png`·`btn-primary.png`·`btn-ghost.png`·`seal.png`·`ribbon.png`는 **반드시 한꺼번에**
  넣을 것 — 일부만 있으면 없는 부품 자리가 빈 틀로 보인다. `cube-red.png`·`gauge-*.png`는 예비
  (게이지는 아직 막대 요소가 없어 다음 패스에서 코드와 함께 붙인다).

## 6. 납품
Google Drive `NumbersOfMagic-캐릭터작화` 폴더 https://drive.google.com/drive/folders/1cttW6KT6l0DJvV1UJRUoy89k2arm-x5F
에 파일명 그대로. 제작팀이 `assets/ui/`로 설치한다.
