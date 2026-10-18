# 골든벨 원본 받아쓰기 — Google Vision OCR 1차 + 눈 대조

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
