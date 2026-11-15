# 돌파 중2-2 편입 대비 최종(마무리)

돌파 편입 과정에 최종회를 추가하여 1·2·3·4·최종, 총 5회를 제공한다.
공통수학1 기본반과 별도 과정이며, 중1-1~중2-1 일차함수까지의
주관식 30문항·150분 연습 판본이다. 현재 공식 시험과 동일한 시험이라는
뜻은 아니다.

학생용 시험지 16쪽, 정답·해설 15쪽, 학습 분석지 4쪽이다. 독립 풀이와
교육과정 검수, 학생 도형 13개·해설 보조도형 3개 및 PDF 전 35쪽의 실제
렌더 검수를 거쳤다. Apple Vision으로 본문 번호 1~30을 대조했다.
실제 인쇄와 학생 풀이시간·난도 측정은 별도다.

기존 두 보호 페이지 함수와 비공개 Storage를 재사용한다. 기존 31회,
로그인·학생별 배정·이전 결과·관리자 참조를 유지하고 새 최종회 메타데이터만
추가한다. 최종 배포의 두 reader는 읽기 전용이며, 임시 업로드 기능이나
검수용 승인번호·세션 토큰을 포함하지 않는다. 원본 PDF, 문항·답안 바이트,
페이지 이미지와 배포용 비공개 매핑은 공개 Git에 넣지 않는다.

O/X 자기 확인만 사용하며 숫자 답안 입력이나 합격 판정을 추가하지 않는다.
390px 모바일의 페이지·문서 이동, 저장·새로고침·재입장, 권한 차단과 실제
제공 이미지의 체크섬을 공개 전후에 확인한다.

완성본과 비공개 검수 근거는 기존 [Drive 보관 폴더](https://drive.google.com/drive/folders/1w1BnbpGkJ2S2UBq0Ifnk3_61jonecjJy)에 보관한다.

로컬 회귀 검사:

```sh
node --test highschool-selection/tests/promo-course-navigation.test.cjs highschool-selection/tests/launch-exams-core.test.mjs highschool-selection/tests/private-storage-assets.test.mjs
node --test highschool-selection/tests/self-check-comments.test.cjs highschool-selection/tests/exam-security.test.cjs highschool-selection/tests/report-security.test.cjs highschool-selection/tests/report-blank-contract.test.cjs highschool-selection/tests/report-learning-plan.test.cjs
```
