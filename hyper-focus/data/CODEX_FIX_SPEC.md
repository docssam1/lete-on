# HF Variation Fix 명세 (Claude 검수 결과)

## 완료
- q10_var02: B_intersect_C 8→10 수정 완료 (4+6=10)

---

## Codex 수정 대상 4개

### q13_var01 — cells 불일치
**오류**: choice2의 cells=[십자형]이 targetShapeCells=[역T형]과 rotate만으로 일치 불가인데 isValid=true
**필요한 것**: PNG(q13_var01.png) 보고 실제 정답 조각이 몇 번인지 확인 후 수정
**수정 방향**:
- 옵션A: choice2 cells를 targetShapeCells와 기하학적으로 일치하도록 수정
- 옵션B: isValid 판정 재검토 후 실제 맞는 choice만 true로 수정
- targetShapeCells: [[0,0],[1,0],[2,0],[1,1],[1,2]] (역T형)
- choice2 현재 cells: [[0,1],[1,0],[1,1],[1,2],[2,1]] (십자형) → 불일치

**레포 현재 파일**: cells 필드 자체 없음 (구버전) → 업로드된 최신 구조로 교체 필요

---

### q14_var02 — internalLines가 정사각형을 만들지 않음
**오류**: 3×3에 수직선 2개([x=1],[x=2]) → 1×3 직사각형 3개 생성, 정사각형 아님
**필요한 것**: PNG 보고 실제 도형 구조 확인
**수정 방향**:
- 옵션A: 도형을 다르게 설계 (예: L자형 도형 → 큰 정사각형+작은 정사각형들로 분할 가능)
- 옵션B: 3×3 자체는 이미 정사각형 1개 → internalLines 없이 ea=1 (하지만 너무 trivial)
- 옵션C: 직사각형 도형(예: 1×3)을 3개 1×1 정사각형으로 → ea=3이지만 구조 설명 필요
- core docsamRules: largest_square_first, not_same_size

**레포 현재 파일**: internalLines 없음 (구버전) → 재설계 후 전체 교체

---

### q15_var01 — 조각 수 4개인데 subType=line_partition_six
**오류**: cutLines 2개가 교차해 4조각 생성. subType 이름(six)과 불일치. answerType=shape_multiset(core=drawing_instruction)
**필요한 것**: PNG 보고 실제 몇 조각인지, 어떤 도형인지 확인
**수정 방향**:
- 옵션A: 두 선이 도형 내부에서 서로 교차 + 각각 경계도 지나도록 재설계 → 6조각 가능
  - 한 선이 도형을 3분할, 두 번째 선이 그 중 1~2개를 다시 분할
- 옵션B: baseShape를 U자형(원본 q15)으로 변경하고 cutLines 재설계
- 현재 baseShape=square, cutLines 교차 → 4조각

**레포 현재 파일**: cutLines 없음 (구버전) → 재설계 후 전체 교체

---

### q15_var02 — 동일 오류
**오류**: baseShape=rectangle, cutLines 교차 → 4조각, subType=line_partition_six와 불일치
**수정 방향**: q15_var01과 동일 (rectangle로 6조각이 나오도록 cutLines 재설계)

**레포 현재 파일**: cutLines 없음 (구버전) → 재설계 후 전체 교체

---

## Codex 작업 순서 권장
1. PNG 파일 4개 먼저 열기: q13_var01.png, q14_var02.png, q15_var01.png, q15_var02.png
2. 각 PNG 기반으로 정확한 도형/조각/답 파악
3. JSON 재작성 후 branch: codex/hf-data-replacement에 push

## 참조
- branch: codex/hf-data-replacement
- 파일 경로: hyper-focus/data/variations/
- core 기준: hyper-focus/data/hf_core.json
