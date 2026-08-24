# TASK: 로드맵 L3/L4 복구 + 그래프 버그 수정

## 배경
- `roadmap/demo/index.html`: 7/13 커밋(a0e7006)이 L3/L4 이전 버전으로 덮어써서 L3/L4 레벨이 사라짐
- `roadmap/index.html`: L3/L4 학생 진단 시 upperId 맵에 L3/L4가 없어 `LEVELS[undefined].shift` TypeError → 그래프·코멘트 전체 미출력

## 실행 방법
레포 루트에서 아래 Python 스크립트를 그대로 실행한 뒤 커밋·푸시하세요.

```bash
python3 apply_l34_fix.py && git add roadmap/ && git commit -m "fix: L3/L4 복구(demo) + upperId 맵 L3/L4 누락 수정(roadmap 그래프/코멘트 미출력 버그)" && git push
```

## apply_l34_fix.py (아래 내용으로 파일 생성 후 실행)

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# ============ PART 1: roadmap/index.html — upperId 버그 수정 (4곳) ============
p = 'roadmap/index.html'
c = open(p, encoding='utf-8').read()
fixes = [
  ("const upperId = {L2:'L1', L1:'L0', L0:'L0'}[bestId];",
   "const upperId = {L4:'L3', L3:'L2', L2:'L1', L1:'L0', L0:'L0'}[bestId] || 'L1';"),
  ("const lvIdx = {L0:0, L1:1, L2:2}[upperId];",
   "const lvIdx = {L0:0, L1:1, L2:2, L3:3, L4:4}[upperId];"),
  ("const lvFullName = {L0:'선행이 빠른 프리미어 합격생', L1:'표준 프리미어 합격생', L2:'챌린지 선발 후 합격생'};",
   "const lvFullName = {L0:'선행이 빠른 프리미어 합격생', L1:'표준 프리미어 합격생', L2:'챌린지 선발 후 합격생', L3:'필즈 주2회 E2 수준', L4:'안정적 상위권 · 소마 A반'};"),
  ("const upper={L2:'L1', L1:'L0', L0:'L0'}[best.id]||'L1';",
   "const upper={L4:'L3', L3:'L2', L2:'L1', L1:'L0', L0:'L0'}[best.id]||'L1';"),
]
for old, new in fixes:
    if old in c: c = c.replace(old, new, 1); print(f"[roadmap] OK: {old[:40]}...")
    elif new in c: print(f"[roadmap] SKIP(이미 적용): {new[:40]}...")
    else: print(f"[roadmap] !! NOT FOUND: {old[:40]}...")
open(p, 'w', encoding='utf-8').write(c)

# ============ PART 2: roadmap/demo/index.html — L3/L4 복구 ============
p = 'roadmap/demo/index.html'
c = open(p, encoding='utf-8').read()

R = [
# 1. CSS 변수
("--l0:#f2e8ff; --l1:#e7f2ff; --l2:#edf7e9;",
 "--l0:#f2e8ff; --l1:#e7f2ff; --l2:#edf7e9; --l3:#fef9e7; --l4:#fce8e8;"),
# 2. 레벨 배경
(".l0{background:var(--l0)}.l1{background:var(--l1)}.l2{background:var(--l2)}",
 ".l0{background:var(--l0)}.l1{background:var(--l1)}.l2{background:var(--l2)}.l3{background:var(--l3)}.l4{background:var(--l4)}"),
# 3. student-point 색
(".student-point.l2::after{background:#059669}",
 ".student-point.l2::after{background:#059669}.student-point.l3::after{background:#d97706}.student-point.l4::after{background:#be123c}"),
# 4. 레벨카드 5열
("grid-template-columns:repeat(3,minmax(0,1fr))",
 "grid-template-columns:repeat(5,minmax(0,1fr))"),
# 5. LEVELS 배열
("  {id:'L2',cls:'l2',summary:'챌린지 합격 후<br>P2·S2 선발 진도',shift:7}\n];",
 "  {id:'L2',cls:'l2',summary:'챌린지 합격 후<br>P2·S2 선발 진도',shift:7},\n  {id:'L3',cls:'l3',summary:'소마 안정 학습<br>황소 상위권 목표',shift:12},\n  {id:'L4',cls:'l4',summary:'황소 심화 목표<br>기초 탄탄히',shift:17}\n];"),
# 6. lvColors
("const lvColors={L0:'#1d4ed8',L1:'#7c3aed',L2:'#059669'};",
 "const lvColors={L0:'#1d4ed8',L1:'#7c3aed',L2:'#059669',L3:'#d97706',L4:'#be123c'};"),
# 7. 표준선 forEach
("  ['L0','L1','L2'].forEach((id,k)=>{",
 "  ['L0','L1','L2','L3','L4'].forEach((id,k)=>{"),
# 8. lvLabel
("    const lvLabel={L0:'선행이 빠른 프리미어 합격생',L1:'표준 프리미어 합격생',L2:'챌린지 선발 후 합격생'};",
 "    const lvLabel={L0:'선행이 빠른 프리미어 합격생',L1:'표준 프리미어 합격생',L2:'챌린지 선발 후 합격생',L3:'소마 안정 / 황소 상위권 목표',L4:'황소 심화 목표 / 기초 탄탄'};"),
# 9. upperId (폴백 포함)
("    const upperId = {L2:'L1', L1:'L0', L0:'L0'}[bestId];",
 "    const upperId = {L4:'L3', L3:'L2', L2:'L1', L1:'L0', L0:'L0'}[bestId] || 'L1';"),
# 10. lvIdx
("    const lvIdx = {L0:0, L1:1, L2:2}[upperId];",
 "    const lvIdx = {L0:0, L1:1, L2:2, L3:3, L4:4}[upperId];"),
# 11. lvFullName
("    const lvFullName = {L0:'선행이 빠른 프리미어 합격생', L1:'표준 프리미어 합격생', L2:'챌린지 선발 후 합격생'};",
 "    const lvFullName = {L0:'선행이 빠른 프리미어 합격생', L1:'표준 프리미어 합격생', L2:'챌린지 선발 후 합격생', L3:'소마 안정 / 황소 상위권 목표', L4:'황소 심화 목표 / 기초 탄탄'};"),
# 12. levelFriendly
("  L2:'챌린지 선발 후 P2·S2 목표 / 타 지역 P1 목표 학생 기준입니다.'\n}[id]||'';",
 "  L2:'챌린지 선발 후 P2·S2 목표 / 타 지역 P1 목표 학생 기준입니다.',\n  L3:'소마 안정 학습 기준, 황소 상위권을 바라보는 학생 기준입니다.',\n  L4:'황소 심화반 목표 / 기초부터 탄탄히 쌓아가는 학생 기준입니다.'\n}[id]||'';"),
# 13. needRedesign
("  best.needRedesign = l2 && Math.abs(l2.avg)>=6 && best.id==='L2';",
 "  const l3=boxes.find(b=>b.id==='L3');\n  const l4=boxes.find(b=>b.id==='L4');\n  best.needRedesign = (l2 && Math.abs(l2.avg)>=6 && best.id==='L2') ||\n                      (l3 && Math.abs(l3.avg)>=6 && best.id==='L3') ||\n                      (l4 && Math.abs(l4.avg)>=6 && best.id==='L4');"),
# 14. detail-note
("L0·L1·L2는 지필드의 서로 다른 표준 기준입니다.",
 "L0·L1·L2·L3·L4는 지필드의 서로 다른 표준 기준입니다."),
# 15. 버전 주석
("TOP SECRET 로드맵 v28 — 단일 테이블 통합 (L0/L1/L2 + 현재)",
 "TOP SECRET 로드맵 v29 — L0/L1/L2/L3/L4 + 현재"),
# 16. fillComment upper
("  const upper={L2:'L1', L1:'L0', L0:'L0'}[best.id]||'L1';",
 "  const upper={L4:'L3', L3:'L2', L2:'L1', L1:'L0', L0:'L0'}[best.id]||'L1';"),
]
for old, new in R:
    if old in c: c = c.replace(old, new, 1); print(f"[demo] OK: {old[:36]}...")
    elif new in c: print(f"[demo] SKIP(이미 적용): {new[:36]}...")
    else: print(f"[demo] !! NOT FOUND: {old[:36]}...")

# 17. 테이블 L3/L4 rows (L2 마지막 spacer 뒤, </tbody> 앞)
L34_ROWS = '<tr class="spacer"><td colspan="29"></td></tr>\n<tr><td rowspan="5" class="level l3">L3<span class="level-desc">소마 안정 학습<br>황소 상위권 목표</span></td><td class="category">교과 응용 /<br>교과 심화<br>연산병행</td><td class="empty"></td><td class="empty"></td><td class="empty"></td><td class="empty"></td><td class="empty"></td><td class="empty"></td><td class="empty"></td><td class="empty"></td><td colspan="4" class="cell grade-root">수학 문장 이해</td><td colspan="5" class="cell grade-root">지문 이해 ·<br>조건 이해하기</td><td colspan="2" class="cell grade-12">1-1 디딤돌<br><span class="sub">기본+응용</span></td><td colspan="2" class="cell grade-12">1-2 디딤돌<br><span class="sub">기본+응용</span></td><td colspan="2" class="cell grade-21">2-1 디딤돌<br><span class="sub">기본+응용</span></td><td colspan="2" class="cell grade-21">2-2 디딤돌<br><span class="sub">기본+응용</span></td><td colspan="2" class="cell grade-31">3-1 디딤돌<br><span class="sub">기본+응용</span></td></tr>\n<tr><td class="category">사고력 1</td><td class="empty"></td><td class="empty"></td><td class="empty"></td><td class="empty"></td><td class="empty"></td><td class="empty"></td><td class="empty"></td><td class="empty"></td><td colspan="4" class="cell kinder">킨더팩토</td><td colspan="5" class="cell kids">키즈팩토<br><span class="sub">원리·탐구·미션</span></td><td colspan="5" class="cell elem">초등팩토 1<br><span class="sub">PRE 1031 기본</span></td><td colspan="5" class="cell fields">필즈 베이직<br><span class="sub">PRE 1031 심화</span></td></tr>\n<tr><td class="category">사고력 2<br><span class="sub">필즈·프리미어 대비</span></td><td colspan="22" class="empty"></td><td colspan="5" class="cell prep">필즈 STEP 1<br><span class="sub">개념 8주</span></td></tr>\n<tr><td class="category">추천 가정학습</td><td colspan="22" class="empty"></td><td colspan="5" class="cell home">문해길 1<br><span class="sub">심화</span></td></tr>\n<tr><td class="category">연산과정</td><td colspan="8" class="empty"></td><td colspan="12" class="cell calc">소마셈 K<br><span class="sub">수 감각·기초 연산</span></td><td colspan="4" class="cell calc">기적의 계산법 2권</td><td colspan="3" class="cell calc">기적의 계산법 3권</td></tr>\n<tr class="spacer"><td colspan="29"></td></tr>\n<tr><td rowspan="5" class="level l4">L4<span class="level-desc">황소 심화 목표<br>기초 탄탄히</span></td><td class="category">교과 응용 /<br>교과 심화<br>연산병행</td><td colspan="13" class="empty"></td><td colspan="4" class="cell grade-root">수학 문장 이해</td><td colspan="5" class="cell grade-root">지문 이해 ·<br>조건 이해하기</td><td colspan="2" class="cell grade-12">1-1 디딤돌<br><span class="sub">기본+응용</span></td><td colspan="2" class="cell grade-12">1-2 디딤돌<br><span class="sub">기본+응용</span></td><td colspan="1" class="cell grade-21">2-1</td></tr>\n<tr><td class="category">사고력 1</td><td colspan="12" class="empty"></td><td colspan="5" class="cell kinder">킨더팩토</td><td colspan="5" class="cell kids">키즈팩토<br><span class="sub">원리·탐구·미션</span></td><td colspan="5" class="cell elem">초등팩토 1<br><span class="sub">PRE 1031 기본</span></td></tr>\n<tr><td class="category">사고력 2<br><span class="sub">필즈·프리미어 대비</span></td><td colspan="27" class="empty"></td></tr>\n<tr><td class="category">추천 가정학습</td><td colspan="27" class="empty"></td></tr>\n<tr><td class="category">연산과정</td><td colspan="12" class="empty"></td><td colspan="12" class="cell calc">소마셈 K<br><span class="sub">수 감각·기초 연산</span></td><td colspan="3" class="cell calc">기적의 계산법 2권</td></tr>'

if 'class="level l3"' in c:
    print("[demo] SKIP: L3/L4 테이블 rows 이미 존재")
else:
    target = '<tr class="spacer"><td colspan="29"></td></tr></tbody>'
    if target in c:
        c = c.replace(target, L34_ROWS + '\n</tbody>', 1)
        print("[demo] OK: L3/L4 테이블 rows 삽입")
    else:
        print("[demo] !! NOT FOUND: tbody 끝 spacer — 수동 확인 필요")

open(p, 'w', encoding='utf-8').write(c)
print("\n=== 완료. 위 로그에 '!! NOT FOUND'가 없어야 정상 ===")
```

## 검증
푸시 후 https://lete-on.gfieldacademy.net/roadmap/demo/ 에서:
1. 표에 L3(노랑)·L4(분홍) 레벨 표시 확인
2. L4 수준으로 진단(예: 7세, 킨더팩토 진행 중, 교과 안 함) → 그래프·독쌤 말풍선 정상 출력 확인
3. https://lete-on.gfieldacademy.net/roadmap/ 도 동일 진단 → 그래프·코멘트 출력 확인
