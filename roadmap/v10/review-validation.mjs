import {validateState as validateBase} from './engine.mjs';
import {validateRelations} from './paths-v10.mjs';
import {HELP_OPTIONS,DEPTH_OPTIONS} from './advisor.mjs';
export function validateReviewState(s){
 const result=validateBase(s),errors=[...result.errors];if(!result.valid)return result;
 for(const c of s.courses){for(const k of ['sourceCurriculum','isbn'])if(c[k]!==undefined&&typeof c[k]!=='string')errors.push(`${k}은 문자열로 기록해 주세요.`);}
 const obs=s.wizard?.courseObservations;
 if(obs!==undefined){
  if(!obs||typeof obs!=='object'||Array.isArray(obs))errors.push('과정별 관찰 형식을 확인해 주세요.');
  else for(const [cid,o] of Object.entries(obs)){
   if(!s.courses.some(c=>c.id===cid)||!o||typeof o!=='object'||Array.isArray(o)){errors.push('관찰을 실제 과정에 연결해 주세요.');continue;}
   if(!HELP_OPTIONS.some(([v])=>v===o.help)||!['unknown','manageable','high','varies'].includes(o.burden)||!['unknown','example','needs_help','answer_only'].includes(o.explanation))errors.push('관찰 선택값을 확인해 주세요.');
   if(o.depth!==undefined&&!DEPTH_OPTIONS.includes(o.depth))errors.push('학습 깊이를 확인해 주세요.');
   for(const k of ['weeklyMinutes','adultMinutes'])if(o[k]!==null&&(!Number.isFinite(o[k])||o[k]<0||o[k]>10080))errors.push('관찰한 주당 시간을 확인해 주세요.');
   if(!o.scope||['volume','unit','range'].some(k=>typeof o.scope[k]!=='string')||typeof o.example!=='string')errors.push('관찰 범위와 설명을 확인해 주세요.');
  }
 }
 errors.push(...validateRelations(s));return {valid:errors.length===0,errors};
}
