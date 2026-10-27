# 작업 지시서 — 자연관찰대회 공원 지도를 FLUX.2 Klein으로 실사풍 만들기 (2026-10-26)

받는 사람: 원장 맥에서 일하는 GPT(Codex)
보낸 사람: Claude(클라우드 세션 — GPU·맥에 손이 닿지 않아 맡긴다)
원장 지시: 「FLUX.2 Klein 으로 진행해」 · 「FLUX.2 Klein 이거 있어 로컬에」

## 0. 2차 — 다시 돌리기 (2026-10-27) ← 지금 할 일

**1차 후보(wide-1~6 · tall-1~8)는 이제 쓸 수 없다. 공원 배치가 바뀌었다.** 원장 지시(10-27):
「너무 오밀조밀 모여 있는 것 같아」 → 공원 자리를 1.5배로 벌렸고(물건 크기는 그대로, 숲·풀·꽃·파라솔은 늘림),
「가로 모달로 하면 되지」 → **폰도 가로 그림을 쓴다. 세로 그림(tall)은 더 만들지 않는다.**
1차 추천이던 wide-5는 옛 배치라 지도에서 내렸다.

할 일은 하나 — 최신을 받아 다시 돌린다.
```
cd ~/Developer/GFIELD/lete-on-photos
bash scripts/local/park-flux.command                 # 처음 줄에서 최신 렌더를 받는다(브랜치 claude/jolly-allen-w57yqh)
```
- 스크립트가 렌더가 바뀐 것을 알아보고 **옛 wide 후보를 지우고 새로 만든다**(전에는 파일이 있으면 건너뛰었다). 기본이 가로(wide)만이다.
- 1차 때 쓴 로컬 저장본(4B Q4)을 그대로 쓴다: `PARK_FLUX_MODEL_PATH=<저장본 폴더> bash scripts/local/park-flux.command --quantize 0`
  — 스크립트가 이제 `--model <폴더> --base-model flux2-klein-4b` 꼴로 넘긴다(1차 때 확인해 준 꼴).
- 1차에서 잘 된 프롬프트 보강(파라솔·수초 보존)은 그대로 써도 된다. 쓰면 보고에 적는다. 후보는 `--n 6`까지.
- 새로 생긴 것: 그림 위 사람들(두 아이·독쌤·탐험가 등)은 **앱이 따로 올린다 — 그림에 사람이 생기면 탈락**(전과 같음).
- 올린 뒤 원장에게: 「park-flux 2차 완료 — 1차 추천: wide-N」 형식(6절)으로.

## 1. 무엇을 하나

과학 탐구 실험실 `#/contest/nature` 맨 위의 공원 지도 그림 두 장을 **같은 배치 그대로** 실사풍으로 다시 그린다.

- 지금 그림: `science-lab/assets/park/park-wide.webp`(2560×1440 — PC, 그리고 폰의 「가로로 크게」). 세로 `park-tall.webp`는 2차부터 안 쓴다
  — Blender 렌더(`science-lab/tools/blender/park-map.py`). **해변 공원**: 남·동쪽은 해변 산책로·백사장(파라솔·안전요원 망루)·바다, 북·서쪽은 차도와 가로수. 공원 안은 연못(수초 8종), 정자, 개울과 다리, 길, 광장의 흰 천막 둘, 꽃밭, 키 큰 풀밭, 서쪽 바위 언덕, 동쪽 갈대 습지와 데크, 남쪽 입구 문, 북쪽 숲, 둘레 생울타리. 그림 끝까지 땅·바다가 차 있다(원장 「지도가 끊기는 거 이상해」로 바꿈).
- 그림 위에 지점 표 6개와 3D 캐릭터 두 명이 **그림 위 % 좌표**로 올라간다(`science-lab/data/park-map.js`). 그래서 **사물의 자리·윤곽이 바뀌면 안 된다.** 이 작업의 핵심 조건이다.

## 2. 도구는 이미 있다 — 이것을 돌린다

```
cd ~/Developer/GFIELD/lete-on-photos        # 없으면 아래 「처음 한 번」
bash scripts/local/park-flux.command
```

처음 한 번(원래 작업 폴더 `lete-on`은 건드리지 않는 별도 폴더):
```
cd ~/Developer/GFIELD/lete-on
git fetch origin claude/jolly-allen-w57yqh
git worktree add ../lete-on-photos FETCH_HEAD
```

`park-flux.command` → `scripts/park-flux.py`가 하는 일:
1. uv·mflux(0.23 이상) 설치 확인
2. `mflux-generate-flux2-edit --model flux2-klein-4b --quantize 4 --image-paths <지금 그림>`으로 화면마다 후보 3장(4단계, 시드 고정)
3. 생성 크기 1792×1008 / 1008×1792 → 2560 크기로 늘린다. 배치는 편집 모드가 지킨다 — 그래서 4절 1번(자리) 검사가 중요하다
4. `park-flux/고르기.html`(원래 렌더와 후보 나란히) + GitHub 브랜치 `inbox/park-flux`로 후보만 올림(작업 폴더·현재 브랜치·main 그대로)

## 3. 원장 맥에 이미 있는 FLUX.2 Klein을 쓴다

원장이 로컬에 FLUX.2 Klein(Q4)이 있다고 했다. 어디에 어떤 형식으로 있는지 먼저 찾는다.

```
ls ~/.cache/huggingface/hub | grep -i klein
find ~ -maxdepth 7 -iname "*klein*" 2>/dev/null | head -20
```

- **허깅페이스 캐시 `models--black-forest-labs--FLUX.2-klein-4B`가 있으면**: 그대로 돌리면 된다(mflux가 캐시를 다시 쓴다).
- **mflux로 저장한 폴더(`mflux-save` 결과, 4비트)가 있으면**: `PARK_FLUX_MODEL_PATH=<폴더> bash scripts/local/park-flux.command --quantize 0`
- **GGUF(Q4) 파일만 있으면**(Draw Things·ComfyUI용): mflux는 GGUF를 못 읽는다. 둘 중 하나를 고른다.
  - (가) 그냥 돌려서 mflux용 4B를 한 번 받는다(약 15 GB, 디스크 여유 확인).
  - (나) 그 앱(ComfyUI 등)에서 같은 일을 한다: **이미지 편집(참조 그림) 모드**, 아래 프롬프트, 4단계, 생성 1792×1008 / 1008×1792. 결과 PNG를 `park-flux/wide-1.raw.png`처럼 두고, `scripts/park-flux.py`의 `finish()`와 같은 처리(2560으로 늘려 webp)를 한 뒤 `--no-push` 없이 올린다. 이때 쓴 앱·모델 파일 이름을 아래 보고에 적는다.
- **9B 모델은 쓰지 않는다** — FLUX.2 [klein] 9B는 비상업 라이선스다. 4B만(Apache 2.0). 찾은 파일이 9B뿐이면 쓰지 말고 (가)로 간다.

프롬프트(스크립트 `PROMPT`와 같다 — 바꾸면 보고에 적는다):
> Turn this 3D render into a photorealistic tilt-shift aerial photograph of a miniature park diorama on a thick soil base. Keep exactly the same layout, outlines, shapes and positions of everything … No people, no text, no labels.

## 4. 고르는 기준(후보를 보고 1차로 골라 보고에 적는다)

1. **자리**: 연못·정자·다리·천막·꽃밭·바위 언덕·습지·입구 문·해안선·길이 렌더와 같은 자리에 있다. 고르기.html에서 렌더와 번갈아 본다. 사물이 눈에 띄게 옮겨졌으면 탈락.
2. **사람·차·글자 없음**: 사람·차·동물 캐릭터·글자·로고가 생기면 탈락(두 아이는 앱이 따로 올린다. 실제 아이 사진처럼 보이는 것도 절대 안 됨).
3. **실사감**: 나무가 진짜 나무처럼, 물이 맑고 비침, 잔디 결. 플라스틱·장난감 느낌이 덜한 것.
4. **수초가 살아 있다**: 연못의 수련·개구리밥·부레옥잠·부들이 뭉개지지 않았다(관찰 세트와 이어지는 자리).
5. 넓은 화면과 폰 화면이 같은 공원으로 보인다(색·계절이 크게 다르지 않다).

다 마음에 안 들면 시드만 바꿔 다시: `--n 6`(후보 6장) 또는 `scripts/park-flux.py`의 시드식. 프롬프트를 고쳤으면 보고에 적는다.

## 5. 하지 말 것

- `science-lab/assets/park/*.webp`·`data/park-map.js`를 직접 바꾸거나 main에 올리지 않는다 — 후보는 `inbox/park-flux`로만. 넣는 일은 Claude가 한다(지점 좌표 확인을 같이 해야 해서).
- 원래 작업 폴더 `~/Developer/GFIELD/lete-on`에서 add·reset·clean·pull을 통째로 하지 않는다. `lete-on-photos`에서만 일한다.
- 9B 모델, 유료 API, 다른 이미지 서비스에 그림을 올리지 않는다.
- 모델 파일 경로(맥 사용자 폴더 이름이 들어 있다)는 보고에만 쓰고 저장소 파일에는 남기지 않는다.

## 6. 끝나면 보고(원장에게 이 형식으로)

```
park-flux 완료
- 모델: (허깅페이스 캐시 4B / mflux 저장본 / 새로 받음 / 다른 앱: 이름) · 4비트
- 걸린 시간: 장당 약 __초
- 올린 곳: inbox/park-flux (파일 __개)
- 1차 추천: wide-__ · tall-__  (이유 한 줄)
- 탈락 이유: (예: wide-2 정자가 오른쪽으로 옮겨짐)
- 바꾼 것: (프롬프트·시드·크기를 바꿨으면)
```

원장은 Claude에게 「지도 올렸어」라고 전한다. Claude가 `inbox/park-flux`에서 받아 지점 표가 그림 속 사물에 맞는지 브라우저로 확인한 뒤 지도에 넣는다.
