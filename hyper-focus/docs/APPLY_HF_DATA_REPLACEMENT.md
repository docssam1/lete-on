# HF Data Replacement v1

## 목적
기존 `hyper-focus/data/hf_data.json`의 오염된 임시 데이터를 v3.1 검수 완료 데이터로 교체합니다.

## 교체 대상
- `hyper-focus/data/hf_data.json`
- `hyper-focus/data/hf_core.json`
- `hyper-focus/data/problem_map.json`

## 반드시 확인된 항목
- 7번: cube_net_matching / dice 아님
- 8번: dice_roll
- 53번: TYPE-10 balance_unit_count
- 총 54문제 verified true
- 기존 오염 데이터: 1번 answer 6, 5번 점 잇기 등 제거 대상

## 적용 순서
1. 기존 `hyper-focus/data/hf_data.json` 백업
2. 이 패키지의 `hyper-focus` 폴더를 repo root에 덮어쓰기
3. 앱에서 기존 hf_data.json import 경로가 유지되는지 확인
4. 필요하면 신규 hf_core.json 기반으로 엔진을 전환
