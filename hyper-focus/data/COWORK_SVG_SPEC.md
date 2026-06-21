# Cowork 지시서 — HF 유사문항 SVG 생성

## 작업 경로 (로컬)
```
C:\Users\USER\OneDrive\Documents\GFIELD 총괄 관제센터\lete-on\hyper-focus
```

## 읽어야 할 파일
```
data/hf_core.json              ← subType, renderStrategy, typeId 기준
data/variations/q##_var##.json ← 108개, machineReadable 구조 데이터
```

## 출력 위치
```
assets/similar/q##_var##.svg
```
예: `assets/similar/q01_var01.svg`

---

## 우선순위별 작업 대상

### 1순위 — TYPE-01 쌓기나무 (q01~q05, q09)
데이터가 heightMap으로 명확함. 먼저 처리.

**q01 stacking_front_back_count**
```json
"heightMap": { "rows": [{"y":0,"heights":[1,2]}, ...] }
"countingModel": { "frontVisibleBlockCount": N, "rearOnlyHiddenBlockCount": N }
```
SVG 규칙:
- 위에서 본 격자를 등축 투영(isometric)으로 그림
- 각 칸에 heightMap 숫자 표시
- 앞에서 본 모양 + 뒤에서 본 모양 별도 표시

**q02 stacking_fill_cube**
```json
"container": {"width":N,"depth":N,"height":N}
"heightMap": { "rows": [...] }
"countingModel": {"filledCount":N,"missingCount":N}
```
SVG 규칙:
- 상자 윤곽선 (3D 박스)
- 현재 쌓인 블록 표시
- 빈 칸은 점선

**q03 stacking_checker_color**
```json
"heightMap": { "rows": [...] }
"derivedCounts": {"blackCount":N,"whiteCount":N,"askedColor":"black"}
```
SVG 규칙:
- 흑백 교대 블록 (체스판 패턴)
- askedColor에 해당하는 색 강조

**q04 stacking_hole_removed**
```json
"container": {"width":N,"height":N,"depth":N,"totalCells":N}
"layerCountModel": {"layers":[...],"removedBlockCount":N}
"countingModel": {"remainingBlockCount":N}
```
SVG 규칙:
- 전체 큐브 + 구멍 위치 표시 (붉은 점선 기둥)

**q05 stacking_hidden_count**
```json
"countingModel": {"totalBlockCount":N,"visibleBlockCount":N,"hiddenBlockCount":N}
```
SVG 규칙:
- 앞에서 본 모양 + 숨은 블록 점선 표시

**q09 stacking_three_views_minimum**
```json
"views": {"topView":{"occupiedCells":[...]}, "frontView":{"columnHeights":[...]}, "rightView":{"columnHeights":[...]}}
"finalBlockStructure": {"minimumHeightMap":{"rows":[...]}, "totalBlockCount":N}
```
SVG 규칙:
- 위/앞/오른쪽 3면도 각각 그리기
- 각 칸에 최소 높이 숫자 표시

---

### 2순위 — TYPE-05 수/규칙 계열 (좌표 있는 것)

**q16 count_squares_grid**
```json
"gridRows":N, "gridCols":N
```
SVG: N×N 격자 그리기

**q20 segment_sum_lengths**
```json
"numbers":[N,N,N,N], "constructionMode":"end_to_end_only"
```
SVG: 선분들을 수직선 위에 표시

**q27 honeycomb_operation**
```json
"centerValue":N, "neighborValues":[N,N,N]
```
SVG: 벌집 6각형 + 중심/이웃 숫자

**q30 target_score_cases**
```json
"targetScore":N, "choices":[N,N,N,N]
```
SVG: 과녁 동심원 + 점수 영역

**q32 mirror_digital_number**
```json
"displayNumber":NNN
```
SVG: 7세그먼트 디지털 숫자 + 거울선

**q51 clock_bell_count**
```json
"startHour":N, "endHour":N
```
SVG: 시계 + 구간 표시

---

### 3순위 — TYPE-02 전개도/접기/주사위 (q06~q12)
좌표 복잡. 검수 재검수 대기 파일 포함. Codex fix 완료 후 처리.

**q08 dice_roll** (검수 통과)
```json
"startState": {"knownFaces":{"front":N,"top":N,"right":N}}
"path": {"moves":["right","right","down"]}
```
SVG: 주사위 전개도 + 이동 화살표 + 경로

**q11 paper_fold_top_numbers** (검수 통과)
```json
"grid": {"rows":4,"cols":4,"values":[[...]]}
"foldSequence": ["left","up"]
"cutPattern": "top_right_quarter"
```
SVG: 4×4 숫자 격자 + 접기 화살표 + 잘린 위치 표시

**q12 paper_hole_fold** (검수 통과)
```json
"foldSequence": ["vertical_half","horizontal_half"]
"punchPoints": [{"x":0.75,"y":0.75}]
```
SVG: 종이 접기 단계 + 구멍 위치

---

### 4순위 — TYPE-09 최단경로 (q45)
```json
"gridSize": "4x4"
```
SVG: 격자 + 화살표 경로

---

## SVG 공통 규칙

### 크기
- viewBox: `0 0 400 400` 기본
- 문제 유형에 따라 `0 0 600 300` (가로형) 또는 `0 0 300 600` (세로형) 조정

### 색상 팔레트
```
배경: #ffffff
격자선: #cccccc
블록 면(앞): #4a9eff
블록 면(위): #7bbfff
블록 면(옆): #2d7fdd
숨은 블록: #cccccc (점선)
구멍/제거: #ff6b6b (점선)
강조(정답): #ffd700
텍스트: #1a1a2e
```

### 폰트
- 숫자: font-size="14" font-family="Arial, sans-serif"
- 레이블: font-size="12"

### 파일명 규칙
```
assets/similar/q01_var01.svg
assets/similar/q01_var02.svg
...
assets/similar/q54_var02.svg
```

---

## 작업 순서
1. `data/hf_core.json` 읽어 typeId 목록 확인
2. 1순위(TYPE-01) 6개 파일(q01~q05, q09) × 2 = 12개 SVG 생성
3. 각 SVG를 `assets/similar/` 에 저장
4. 2순위 진행

## 주의
- fix 대상(q13_var01, q14_var02, q15_var01/02)은 CODEX_FIX_SPEC.md 수정 완료 후 처리
- 재검수 대기(q06, q07, q17~q19)는 별도 지시 후 처리
- SVG는 독립 파일로 저장 (HTML 인라인 아님)
- 한 파일 생성 후 바로 저장, 실패 시 다음 파일 계속 진행
