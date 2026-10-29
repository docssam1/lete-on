/* 같은 탭에서 명시적으로 선택했을 때만 로드맵에 문항 응답을 연결한다. */
(function(global){
'use strict';
const C=global.IdentifyCore;
function prepare(group,answers){return C.score(group,answers)?{version:1,sourceVersion:C.sourceVersion,phase:'complete',group,answers:answers.slice(),index:9}:null;}
function save(group,answers,storage){const state=prepare(group,answers);if(!state)return false;try{storage.setItem('gfield.demo2.personality.v1',JSON.stringify(state));return true;}catch{return false;}}
global.IdentifyRoadmap=Object.freeze({prepare,save});
})(window);
