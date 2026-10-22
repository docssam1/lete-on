---
name: docssam-talking-guide
description: 지필드 사이언스랩(교과 프로그램 v2)의 「독쌤 말풍선」 — 음성으로 말하며 입·몸이 움직이고, 평소엔 전신, 「접기」를 누르거나 내용을 가리면 동그란 얼굴만 남는 안내 캐릭터. 이 캐릭터를 고치거나, 다른 화면·프로그램에 같은 방식의 말하는 캐릭터를 만들 때 먼저 읽는다.
---

# 독쌤 말풍선 — 말하고 움직이는 안내 캐릭터

기준 코드는 `science-lab/v2/docssam.js`(동작)와 `science-lab/v2/guide.css`(모양·움직임)다. 문서와 코드가 다르면 **코드가 맞다**. 예를 들어 `docssam.js` 머리 주석에는 「음성이 없으면 자막만」이라고 적혀 있지만, 코드는 기기 음성(Web Speech ko-KR)으로 읽는다.

## 1. 쓰는 곳 / 안 쓰는 곳
- 쓰는 곳: 스스로 공부하기(`v2/deck.js` self), 학생용 교재, 읽을거리.
- 안 쓰는 곳: 가르치기·교사용 화면. 이 화면에 들어갈 때는 `dropGuide()`로 치운다.
- 한 번에 하나만 뜬다(`live`).
- 다른 프로그램(예: 팝콘 실험실의 랩코니)에 같은 방식을 쓸 때는 **코드를 복사해서 따로 둔다.** 팝콘은 다른 프로그램이라 섞지 않는다.

## 2. 그림 — 새로 그리지 않고 겹쳐 바꿔 끼운다
- 전신 5장(`science-lab/assets/`):
  - `docssam-A1-mouth-closed.webp` 기본
  - `B1-surprised` 놀람
  - `B2-thinking` 생각
  - `B3-praise` 칭찬
  - `B4-encourage` 격려
- 5장을 모두 겹쳐 두고 **한 장만 보인다**(`.dsg-b.on`). 미리 `decode()`해 두어 바꿔 끼울 때 깜빡이지 않게 한다.
- 입·눈 겹그림 4장: `face-A2-mouth-half` · `A3-mouth-open` · `A4-mouth-o` · `A5-eyes-closed`.
  - **A1 위에만** 얹는다.
  - 자리는 `.dsg-face { left:31.25%; top:13.021%; width:33.203%; aspect-ratio:227/213 }`이다. 전신 그림 비율에 맞춘 값이라 그림을 바꾸면 다시 잰다.
- 상황 → 그림(`MOODS`): listen·explain = A1, think = B2, surprise = B1, praise = B3, encourage = B4.

## 3. 말하기 — 입은 「실제 소리가 나는 동안에만」
- `api.say(줄id | {text}, { mood })`
  - 말풍선에 글을 띄우고 음성을 재생한다. 끝나면 `true`, 다른 말에 끊기면 `false`를 돌려준다.
- 음성을 고르는 순서:
  1. 독쌤 복제 음성(OmniVoice, `v2/clone-voice.js` → `science-lab/audio/docssam/`)
  2. 없으면 기기 음성(Web Speech ko-KR, 0.95배속)
  3. 그것도 안 되면 소리 없이 읽을 시간만큼 기다린다(최대 6초)
  - 구글 음성은 비용 때문에 꺼 두었다(`USE_GOOGLE = false`, 원장 2026-10-01).
- **입 맞추기**
  - 오디오 `playing` ~ `pause`/`waiting`/`ended` 사이에만 움직인다(`startFlap`/`stopFlap`).
  - 재생 위치에서 지금 글자를 고르고, 그 글자의 모음(`mouthFor`)으로 입 모양을 정한다.
    - ㅏ·ㅑ·ㅓ·ㅕ·ㅘ·ㅝ → 크게 벌림(`open`)
    - ㅗ·ㅛ·ㅜ·ㅠ → 오(`o`)
    - 나머지 → 반(`half`)
  - 1초에 12번 바꾸고, 세 번에 한 번은 다문다. 정밀한 음소 립싱크는 아니다.
- 기기 음성으로 읽을 때와 소리가 없을 때는 입이 움직이지 않는다. 소리 없이 입만 움직이면 거짓말이 되기 때문이다.
- 소리 나는 영상이 재생 중이면 말하지 않는다(`loudVideo()`). 영상이 시작되면(`science:media-focus` 이벤트) 말을 멈춘다.
- 대사: `science-lab/data/voice/deck-common.voice.json` + `<단원>.voice.json`(`loadVoice(u)`).

## 4. 움직임 — CSS transform만
- `guide.css`에 있다.
  - 가만히: 살짝 흔들림
  - 말할 때: 끄덕이며 기울기(`talking`)
  - 칭찬: 깡충(`hop`) → 격려 미소
  - 격려: 끄덕(`nod`)
  - 놀람: 움찔(`shake`) → 격려
  - 생각: 기울기(`lean`)
- 말하지 않을 때 A1이면 가끔 눈을 깜빡인다(A5).
- `prefers-reduced-motion`이면 움직이지 않고 표정만 바뀐다.

## 5. 전신 ↔ 얼굴만 (「접기」)
- **평소**: 화면 아래 구석에 전신 + 말풍선을 둔다. 버튼은 🔊 음성(켜기/끄기, 말하는 중이면 멈춤), ↺ 다시 듣기, ⏸ 넘김 멈춤(`canPause`일 때만), **접기**다.
- **「접기」를 누르면** `.dsg.folded`가 된다.
  - 말풍선을 숨기고, 64px 동그란 틀(`overflow:hidden`) 안에 **같은 전신 그림을 크게 옮겨 얼굴 부분만** 보이게 한다(`.dsg-pose { left:-43px; top:-8px; width:150px; height:225px }`).
  - 얼굴 그림을 따로 두지 않는다.
- 접은 상태는 기기에 기억된다(`localStorage` `sciLab.guideFolded`). **얼굴을 누르면** 다시 펼쳐진다.
- **스스로 접힘**
  - 왼쪽·오른쪽 구석 중 내용(`rectsOf()`가 모은 글·단추·표·그림)을 덜 가리는 쪽에 앉는다.
  - 어느 쪽이든 4% 넘게 가리면 스스로 접는다(`data-fold="auto"`).
  - 접혀 있는 동안 새 말이 오면 빨간 점(`unread`)을 띄운다.
- **휴대폰(760px 이하)**: 아래쪽 얇은 띠(`.dsg.compact`)에 48px 작은 얼굴과 1~2줄 글을 둔다. 내용이 띠 밑에 숨지 않게 `body`에 `--dsg-pad` 여백을 준다.
- **자리 고정**: `api.place(el)`로 특정 칸(예: 교재 오른쪽 실험 화면 아래)에 띠로 넣는다.

## 6. 다른 화면에 붙이기
```js
import { mountGuide, loadVoice, rectsOf, dropGuide } from './docssam.js';
const V = await loadVoice(unitId);
const g = mountGuide(V, { avoid: () => rectsOf(document.querySelector('main')), canPause: true });
await g.say('line-id', { mood: 'praise' });   // talk · praise · encourage · surprise · think
g.mood('think'); g.status('실험실 안내 문장'); g.reset();   // 새 화면으로 넘어갈 때
```
- 검사·자동 검수용으로 `window.__docssam`이 지금 표정·입·말하는 중·접힘·자리·기록(log)을 돌려준다. 화면에는 영향이 없다.

## 7. 확인할 것 (끝나기 전에)
- 음성 파일이 있는 줄: 재생 중에만 입이 움직이고, 일시 정지·끝·오류에서 바로 멈추는지(`__docssam.log`).
- 음성 파일이 없는 줄: 입이 움직이지 않는지, 기기 음성이나 기다림으로 넘어가는지.
- PC 1280px: 내용을 가리지 않는 구석에 앉는지, 가리면 스스로 접히는지, 접기·펼치기·새로고침 뒤 기억되는지.
- 폰 390px: 아래 띠로 나오는지, 내용이 띠 밑에 숨지 않는지.
- 움직임 줄이기 설정: 움직이지 않고 표정만 바뀌는지.
- 가르치기·교사용 화면에는 뜨지 않는지.

## 8. 하지 말 것
- 입 모양을 위해 얼굴을 새로 그리거나 전신 그림을 다시 만들지 않는다. 승인된 그림 9장만 쓴다.
- 소리 없이 입을 움직이거나, 음성이 없는데 있다고 표시하지 않는다.
- 독쌤 음성을 이 세션(클라우드)에서 새로 합성하지 않는다. 음성은 원장 PC에서 `science-lab/audio/docssam/README.md` 절차로 한꺼번에 만든다(원장 2026-10-03 결정).
