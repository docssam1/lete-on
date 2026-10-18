# 골든벨 원본 받아쓰기 — OCR 1차 + 눈 대조

OCR은 두 가지 중 하나를 쓴다. 결과 형식(`pNN.txt`, `pNN.words.json`)은 같다.
- **Apple Vision(기본)**: 원장 Mac에서 돌린다. 맥에 들어 있는 기능이라 무료이고, 그림이 기기 밖으로 나가지 않는다 → 아래 「Mac에서」.
- Google Vision: 클라우드 세션에서 `GOOGLE_VISION_KEY`로 돌린다 → 아래 「Google」.

## Mac에서 (Apple Vision)
Xcode 명령줄 도구가 있으면 된다(`xcode-select --install`). 한국어 인식은 최신 macOS에서 된다. 지원하지 않으면 스크립트가 처음에 멈추고 이유를 알려 준다.
```bash
mkdir -p ~/gb-ocr && cd ~/lete-on/fields-classic/question-bank/tools   # 저장소 위치에 맞게
python3 golden-bell-book05/clean-teacher-pptx.py ~/Downloads/teacher.pptx ~/gb-ocr/clean.pptx FF0000,235CFD,097D59,FF00FF,00B050   # 7권 색
# clean.pptx를 Keynote나 PowerPoint로 열어 「PDF로 내보내기」 → ~/gb-ocr/clean.pdf
swift golden-bell-ocr/apple-vision-ocr.swift ~/gb-ocr/clean.pdf ~/gb-ocr/ocr          # 쪽 몇 개만: … ~/gb-ocr/ocr 5,12,40
open ~/gb-ocr/ocr/p05-boxes.png                                       # 빨간 상자 = 신뢰도 낮은 낱말
```
- 처음에는 쪽 하나만 돌려 `p05.txt`를 원본과 눈으로 비교한다.
- 그다음 `ocr` 폴더의 `*.txt`와 `*.words.json`만 Drive 작업 폴더에 올린다(작은 글자 파일). 쪽 그림(`pNN.png`)은 올리지 않아도 된다.
  Claude 세션이 그것을 받아 `pptx-text.py`로 차이표를 만든다.
- 지울 색은 권마다 다르다(인수인계 문서의 권별 메모). 6권은 `FF0000,0070C0,0000FF tx2`.

## Google

교사용 PPTX에서 만든 **답 없는 문제지**만 OCR에 보낸다. 원본 그림, OCR 결과, 뽑은 글자는 모두 저장소 밖 작업 폴더에만 둔다.
키는 `GOOGLE_VISION_KEY` 환경 변수에서만 읽는다(클라우드 환경 설정의 Network secrets). 요청 머리글로 보내므로 주소나 로그에 남지 않는다.

```bash
W=<저장소 밖 작업 폴더>
python3 -I ../golden-bell-book05/clean-teacher-pptx.py teacher.pptx "$W/clean.pptx" FF0000,0070C0,0000FF tx2
soffice --headless --convert-to pdf --outdir "$W" "$W/clean.pptx"
python3 -I -c "import fitz,sys; d=fitz.open(sys.argv[1]); [p.get_pixmap(dpi=110).save(f'{sys.argv[2]}/p{i+1:02d}.png') for i,p in enumerate(d)]" "$W/clean.pdf" "$W/pages"
node vision-ocr.mjs "$W/pages" "$W/ocr"                    # 쪽마다 pNN.txt · pNN.words.json · pNN.json (이미 있으면 건너뜀)
python3 -I draw-boxes.py "$W/pages" "$W/ocr"               # pNN-boxes.png: 신뢰도 낮은 낱말은 빨간 상자
python3 -I pptx-text.py "$W/clean.pptx" "$W/pptx" "$W/ocr" # 슬라이드 글자 + diff.md(OCR에만 / PPTX에만)
```

읽는 순서
1. `diff.md`의 「OCR에만」은 수식 대체 그림이나 그림 속 글자다. PPTX 글자로는 안 나오는 부분이라 OCR 값을 쓴다.
2. 「PPTX에만」은 OCR이 놓친 것이다. PPTX 값이 정확하다.
3. `pNN-boxes.png`의 빨간 상자는 눈으로 원본(`teacher.pdf`)과 다시 본다.
4. 그림의 **모양**(칸 수, 위치, 선)은 OCR이 주지 않는다. 지금처럼 교사용 쪽 그림을 보고 데이터로 옮긴다.

수식 대체 그림 속 빨간 답은 답 없는 문제지에도 남는다(6권 7~9쪽). OCR 결과에 답 숫자가 섞일 수 있으니 결과 폴더를 저장소에 넣지 않는다.
