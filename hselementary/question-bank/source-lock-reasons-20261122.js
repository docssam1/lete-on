// 2026-11-22 검수 후에도 잠금을 유지하는 유형의 구체적인 사유. curriculum.js와 공개 등록 뒤에서 읽습니다.
// 잠긴 유형에만 적용하며, 공개 여부는 바꾸지 않습니다.
(function(root){'use strict';
const cur=root.HSE_CURRICULUM;if(!cur)return;
const duplicate41='실제 원문 문항이 이미 공개된 다른 유형과 같아 중복 출제하지 않습니다.';
const R={
 '6-1-u4-e1-example-1-1':'원본 스캔에서 둘째 비가 가려져 읽을 수 없어 공개를 보류합니다.',
 '6-2-u4-t2':'같은 생성기의 비례식 유형과 문제가 같아 중복 출제하지 않습니다.',
 '6-2-u4-t3':'같은 생성기의 비례식 유형과 문제가 같아 중복 출제하지 않습니다.',
 '6-2-u4-t6':'같은 생성기의 비례배분 유형과 문제가 같아 중복 출제하지 않습니다.',
 '4-1-u2-t5-9':duplicate41,'4-1-u4-t2-4':duplicate41,'4-1-u4-t3-3':duplicate41,'4-1-u4-t3-9':duplicate41,
 '4-1-u5-t2-2':duplicate41,'4-1-u5-t2-3':duplicate41,'4-1-u5-t2-11':duplicate41,
 '4-1-u2-t6-5':'원본 교재에 해당 예제가 없어 출제하지 않습니다.',
 '4-2-u2-t3-7':'모양이 정해지지 않은 직사각형 안에 선을 긋는 모든 방법의 최댓값을 묻고 있어 답을 하나로 검증할 수 없습니다.'
};
Object.assign(R,root.HSE_LOCK_REASONS_20261122_EXTRA||{});
cur.semesters.forEach(s=>s.units.forEach(u=>u.subunits.forEach(g=>g.types.forEach(t=>{const r=R[t.id];if(r&&t.reviewLocked)t.reviewReason=r;}))));
})(typeof window!=='undefined'?window:globalThis);
