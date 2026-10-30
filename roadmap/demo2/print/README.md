# Typst 인쇄 제작

초5 예시의 화면·보고서·Typst PDF는 `PlannerStudyPlanView.reportModel()`을 함께 사용합니다. 교재나 기간을 별도로 다시 입력하지 않습니다. 브라우저의 기존 인쇄는 그대로이며, 기본 초5 예시의 보고서 미리보기에서만 **완성 PDF 받기**를 제공합니다. 특강 시점·겨울 계획·과학 수업 형태가 달라지면 이 다운로드를 숨겨 다른 계획의 PDF를 받지 않도록 합니다.

## 재생성

프로젝트 루트에서:

```sh
python3 -m pip install --target tmp/pdfs/tooling -r roadmap/demo2/print/requirements.txt
python3 roadmap/demo2/print/build-pdf.py
```

Node.js가 PATH에 없다면 `NODE=/절대경로/node`를 지정합니다.

- 완성본: `output/pdf/grade5-complete-roadmap.pdf`
- 배포용 기본 예시: `roadmap/demo2/print/grade5-complete-roadmap.pdf` (검수 후 명시적으로 복사)
- 중간 자료: `tmp/pdfs/grade5/` (인쇄 모델 JSON·앱의 SVG 그래프)
- 폰트: 프로젝트의 Pretendard·나눔손글씨 원본을 사용하고 PDF에 포함
- 외부 API·학생 저장 데이터·클라우드 전송 없음

`--state 선택.json`으로 초5 예시의 세 선택을 재현할 수 있습니다. `version:1`, `id:"grade5-application-middle"`, `winter:"calculation"|"review"`, `academy:"summer"|"afterFinish"`, `scienceMode:"academy"|"home"`입니다. 다른 학생이나 일반 로드맵용 템플릿으로 자동 적용되지는 않습니다.

## 검수

```sh
node --test roadmap/demo2/print/export-grade5.test.mjs roadmap/demo2/planner-report-flow.test.mjs
pdftoppm -scale-to 1600 -png output/pdf/grade5-complete-roadmap.pdf tmp/pdfs/page
```

서로 다른 8가지 선택의 원본·인쇄 모델 일치, 45개월 표의 범위·병합 칸, 사고력 6개월 종료를 검사합니다. PDF를 다시 만든 후 글꼴 경고, 책·날짜·공부 방법의 누락, 페이지 끝 잘림, 반복 머리글을 확인하고 배포용 파일을 교체합니다. `report.typ`의 섹션 제목은 PDF 책갈피가 됩니다.
