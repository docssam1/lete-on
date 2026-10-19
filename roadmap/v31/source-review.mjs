import {esc} from './intake.mjs';

const freeze=value=>{
 if(value&&typeof value==='object')for(const child of Object.values(value))freeze(child);
 return value&&typeof value==='object'?Object.freeze(value):value;
};

// Source review only. These records do not supply personal-plan operations or dates.
export const SOURCE_REVIEW=freeze({
 reviewedOn:'2026-10-18',
 cohort:{
  id:'fields-s1-2026-y7',
  title:'2026 유7 S1반 운영 로드맵 (26년 6월)',
  institution:'필즈더클래식',year:2026,targetClass:'유7 S1반',
  copyId:'ad78e5d7-image.png',
  sha256:'69f7dff5a83506ea01d1c96ba9428a01c195a063f23915ca2c510e8d026230a4',
  sourceStatus:'user_provided',calendarMapping:'not_transcribed',personalPlanImport:false,
  separateFrom:{title:'필즈 S2 · 2025 S1반 자료',rowIds:['S2:t0:r6','S2:t0:r7','S2:t0:r8']},
  note:'2026 유7 S1반 원사진을 별도 반·연도 자료로 확인했습니다. 기존 2025 S1반에서 이어진 S2 참고와 구분해 보관하며, 이 사진의 월별 계획은 아직 연결하지 않았어요.'
 },
 pending:[
  {
   id:'soma-sat2-four-weeks',title:'토2시 · 권당 4주의 대상',status:'pending',
   sourceTitle:'2026 소마 토2시 로드맵',copyId:'40b6d6b0-image.jpg',
   sha256:'a8346f9b9ba73239ff831b6e35aff4a33c4bc4e3a4e082c7fd145eaa739396c0',
   sourceText:'소마셈 권당 4주 진행',
   rowIds:['S2:t0:r16','S2:t0:r17'],blockIds:['S2:t0:r16:c3','S2:t0:r17:c1'],
   referenceRelation:'attribution_conflict',
   note:'사진에는 소마셈 권당 4주, 기존 원표에는 디딤돌 기본 권당 4주가 적혀 있어 어느 교재에 해당하는지 확인 중입니다. 기존 원문과 기간은 그대로 두었습니다.'
  },
  {
   id:'soma-age6-shape-a-start',title:'소마도형 A · 시작월',status:'pending',
   sourceTitle:'2026 소마 6세 로드맵',copyId:'7d91198f-image.png',
   sha256:'f58497efbf41ae7247a047c75b6e34c587e48eb8ad879198e6a1897ad3612ff4',
   sourceText:'7세 2월 : 소마도형 A단계 시작',
   rowIds:['S2:t0:r11','S2:t0:r15','S2:t0:r17'],blockIds:[],
   referenceRelation:'different_cohort_comparison_only',
   note:'사진의 표 경계와 전달사항을 대조하고 있어 시작월을 확정하지 않았습니다. 관련 소마 원표 행은 다른 반 자료이며, 이 사진의 도형 구간과 직접 연결된 기존 블록은 없습니다.'
  },
  {
   id:'three-percent-course1-kind',title:'3% 1과정 · 과정 구분',status:'pending',
   sourceTitle:'필즈 Class S / GFIELD Class 비교표 · 연도 미표기',copyId:'5c668340-image.png',
   sha256:'f3614b945f574c9f6e9337740375492cdb2805738210c5a7312d658369f7a33e',
   sourceText:'3% 1과정 / 3% 1과정 + P 중급 완료',
   rowIds:['S2:t0:r5','S2:t0:r7','S2:t0:r25'],blockIds:['S2:t0:r5:c8','S2:t0:r7:c8','S2:t0:r7:c10','S2:t0:r25:c4'],
   referenceRelation:'classification_unconfirmed',
   note:'과정의 정체와 개별 권 구성을 확인 중입니다. 교재나 행사로 확정하지 않고 원문 표기를 유지합니다.'
  }
 ]
});

export function sourceReviewMarkup(){
 const {cohort,pending}=SOURCE_REVIEW;
 return `<details class="source-review-info" data-source-review><summary>원자료별 확인 상태</summary><section data-source-cohort="${esc(cohort.id)}"><p><strong>${esc(cohort.title)}</strong> · 별도 반·연도 자료</p><p>${esc(cohort.note)}</p><details><summary>기존 원표와 구분</summary><p>${esc(cohort.separateFrom.title)} · ${cohort.separateFrom.rowIds.map(esc).join(', ')}</p></details></section><ul>${pending.map(item=>`<li data-source-review-id="${esc(item.id)}" data-source-status="pending" data-source-row-ids="${esc(item.rowIds.join(' '))}" data-source-block-ids="${esc(item.blockIds.join(' '))}"><p><strong>${esc(item.title)}</strong> · <span>출처 대기</span></p><p>${esc(item.note)}</p><details><summary>원자료 확인 위치</summary><p>${esc(item.sourceTitle)}</p><p>사진 원문: ${esc(item.sourceText)}</p><p>${item.referenceRelation==='different_cohort_comparison_only'?'다른 반의 비교용 행':'관련 원표 행'}: ${item.rowIds.map(esc).join(', ')}</p><p>관련 블록: ${item.blockIds.length?item.blockIds.map(esc).join(', '):'직접 대응 없음'}</p></details></li>`).join('')}</ul></details>`;
}

export function sourcePendingMarkup(blockId){
 const items=SOURCE_REVIEW.pending.filter(item=>item.blockIds.includes(blockId));
 return items.length?`<small data-source-status="pending">출처 대기 · ${items.map(item=>esc(item.title)).join(' / ')}</small>`:'';
}
