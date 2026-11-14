import {checkSeasonResponse} from './season-response.mjs';

// 원문도 이미 쓰는 닫힌 응답 판정기를 공유한다. 문항·답안·기록은 바꾸지 않는다.
export function checkSourceResponse(q,value){
 const responseContract=q?.responseContract;
 if(!responseContract)throw Error('원문 응답 계약이 없습니다.');
 return checkSeasonResponse({responseContract},value);
}
