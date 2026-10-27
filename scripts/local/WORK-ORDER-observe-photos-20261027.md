# 작업 지시서 — 자연관찰 연습 표본 실사 사진 18장 채우기 (2026-10-27)

받는 사람: 원장 맥에서 일하는 GPT(Codex)
보낸 사람: Claude(클라우드 세션 — iNaturalist 검색 API가 막혀 있어 맡긴다. 사진 저장소 S3는 열려 있어 받은 뒤 넣는 일은 Claude가 한다)
원장 지시: 「실사 사진이 없는 곳, 준비 중인 곳이 있어」

## 1. 무엇이 비어 있나

과학 탐구 실험실 자연관찰 연습(`#/observe/<세트>`)에서 표본마다 「실사 사진」 탭이 있다. 아래 18개는 파일이 없어 「이 표본의 실사 사진은 준비 중이에요」가 뜬다.
파일 이름 = `science-lab/assets/observe/<표본 id>-1.jpg`.

| 세트 | 표본 id | 이름(앱 표기) | 찾을 학명·사진 조건 |
|---|---|---|---|
| 물에 사는 식물(중등) | `marsilea` | 네가래 | *Marsilea quadrifolia* — 물 위에 뜬 네 잎 클로버 꼴 잎이 여럿 보이게 |
| 〃 | `ceratophyllum` | 붕어마름 | *Ceratophyllum demersum* — 물속 줄기에 가늘게 갈라진(Y자) 잎이 돌려난 모습 |
| 〃 | `alisma` | 택사(질경이택사) | *Alisma orientale* 또는 *A. plantago-aquatica* — 물가에서 긴 잎자루 끝 달걀꼴 잎, 꽃대 있으면 좋음 |
| 〃 | `typha` | 부들 | *Typha orientalis* 우선(없으면 *T. latifolia*·*T. angustifolia*) — 긴 잎과 갈색 소시지 꼴 이삭 |
| 비슷한 잎 검색표(중등) | `lk-robinia` | 아까시나무형 — 깃꼴겹잎·둥근 작은잎 | *Robinia pseudoacacia* — **잎 한 장(겹잎 전체)**이 잘 보이는 사진(나무 전체 X). 이미 있는 `alt-compound-1.jpg`와 같은 사진이면 안 됨 |
| 〃 | `lk-wisteria` | 등나무형 — 깃꼴겹잎·길고 뾰족한 작은잎 | *Wisteria floribunda* 또는 *W. sinensis* — 겹잎 한 장, 작은잎 끝이 뾰족한 게 보이게 |
| 〃 | `lk-cherry` | 왕벚나무형 — 홑잎·잔 겹톱니·잎끝 쪽이 넓음 | *Prunus × yedoensis* 우선(없으면 *Prunus serrulata*) — 잎 한 장, 톱니가 보이게 |
| 〃 | `lk-zelkova` | 느티나무형 — 홑잎·굵은 톱니·잎밑 쪽이 넓음 | *Zelkova serrata* — 잎 한 장 또는 가지의 잎들, 톱니가 보이게 |
| 숲 바닥(초등) | `woodlouse` | 쥐며느리 | *Porcellio scaber* 우선 — 세트 설명이 「건드려도 몸을 말지 않음」이라 공벌레(*Armadillidium*)는 피한다 |
| 〃 | `millipede` | 노래기 | 노래기류(Diplopoda) — 한국·일본에 흔한 *Oxidus gracilis* 등. 마디마다 다리 2쌍이 보이면 좋음 |
| 〃 | `centipede` | 지네 | 지네류(Chilopoda) — *Scolopendra* 등. 마디마다 다리 1쌍. 손에 든 사진은 피함 |
| 〃 | `worm` | 지렁이 | 지렁이(Lumbricidae 등) — 환대(띠)가 보이면 좋음 |
| 강낭콩 자람(사전 탐구보고서) | `bean-sun` · `bean-shade` · `bean-dry` | 창가 / 그늘 복도 / 물 사흘에 한 번 | 아래 3절 |
| 곰팡이 관찰일기(사전 탐구보고서) | `mold-bread` · `mold-orange` · `mold-rice` | 식빵 털곰팡이 / 귤 푸른곰팡이 / 밥 누룩곰팡이 | 아래 3절 |

## 2. 규칙 — 1차 13장과 똑같이 (`science-lab/assets/observe/SOURCES.md` · `provenance.json`을 먼저 읽는다)

- **사진 자체의 라이선스가 CC0**인 것만. iNaturalist는 관찰이 아니라 **사진의 `license_code=cc0`**를 확인한다(관찰 라이선스와 다를 수 있다). Wikimedia Commons는 파일 페이지의 라이선스가 CC0 또는 퍼블릭 도메인인 것만 — Commons 바닥글의 「데이터 CC0」를 사진 라이선스로 쓰지 않는다.
- iNaturalist는 `quality_grade=research`, 동정이 표의 학명과 맞고, **사진에 그 특징이 실제로 보이는지 눈으로 확인**.
- 사람 얼굴·손이 크게 나온 사진, 워터마크·글자가 있는 사진은 쓰지 않는다. **생성(AI) 이미지는 쓰지 않는다.**
- 가로형 JPEG, 긴 변 1600 px 이하, 300,000 bytes 이하. 편집은 자르기·크기 줄이기·압축만.
- 기록: `provenance.json`에 1차와 같은 칸(observation·taxon·observed_on·author·photo{id,license_code,url,attribution}·uri·quality_grade·retrieved·file·name·visible_features·크기·bytes·sha256·reviewed·original_url·download_url)을 표본 id 키로 더하고, `SOURCES.md` 표에 줄을 더한다. `visible_features`는 「사진에서 보이는 것 / 이 사진으로 확인 못 하는 것」을 1차처럼 정직하게.
- 못 찾은 것은 비워 두고 보고에 이유를 적는다(지어 넣지 않는다).

## 3. 사전 탐구보고서 두 세트(강낭콩 · 곰팡이)

이 둘은 **조건을 바꾼 실험**이라 아무 사진이나 그 조건의 사진이 될 수 없다(그늘에서 키운 콩인지, 물을 사흘에 한 번 준 콩인지 사진만으로 알 수 없다).
- 강낭콩: CC0 **강낭콩(*Phaseolus vulgaris*) 새싹·떡잎이 보이는 사진 1장**만 찾아 `bean-sun-1.jpg`에 둔다. `visible_features`에 「창가·물 조건으로 키운 사진은 아니에요 — 강낭콩 새싹 생김새 참고용」이라고 쓴다. `bean-shade`·`bean-dry`는 비워 둔다.
- 곰팡이: CC0로 **식빵 털곰팡이(*Rhizopus*)**, **귤 푸른곰팡이(*Penicillium*)**, **밥(쌀) 누룩곰팡이(*Aspergillus*)** 사진이 있으면 각각. 음식 위에 핀 실제 사진이어야 한다. 없으면 비운다.
- 보고에 「이 실험 사진은 원장님 반에서 직접 키워 찍으면 가장 좋다」고 남긴다(그때는 원장 직접 촬영으로 기록).

## 4. 전달

맥의 원래 작업 폴더는 건드리지 않는다. `lete-on-photos` 폴더에서:
1. 사진·`provenance.json`·`SOURCES.md` 변경만 담은 커밋을 **`inbox/observe-photos`** 브랜치로 올린다(main·작업 브랜치에 바로 올리지 않는다).
2. 원장에게 보고:
```
observe-photos 완료 — 채운 것 N/18
- 못 찾은 것: (표본 id — 이유)
- 확인이 애매한 것: (표본 id — 무엇이 애매한지)
```
Claude가 받아 앱 화면에서 사진이 뜨는지, 예시 보고서·따라 하기와 어긋나지 않는지 확인한 뒤 넣는다.
