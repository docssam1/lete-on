import {taxonomy as txEnergy52} from '../data/units/c22-s52-u04.taxonomy.js';
import {taxonomy as txWeather52} from '../data/units/c22-s52-u03.taxonomy.js';
import {taxonomy as txHeat52} from '../data/units/c22-s52-u02.taxonomy.js';
import {taxonomy as txMixture52} from '../data/units/c22-s52-u01.taxonomy.js';
import {taxonomy as txMid51} from '../data/units/c22-s51-mid.taxonomy.js';
import {taxonomy as txFinal51} from '../data/units/c22-s51-fin.taxonomy.js';
import {taxonomy as txBody51} from '../data/units/c22-s51-u04.taxonomy.js';
import {taxonomy as txSolution51} from '../data/units/c22-s51-u03.taxonomy.js';
import {taxonomy as txLight51} from '../data/units/c22-s51-u02.taxonomy.js';
import {taxonomy as txGeo51} from '../data/units/c22-s51-u01.taxonomy.js';
import {taxonomy as txFinal42} from '../data/units/c22-s42-fin.taxonomy.js';
import {taxonomy as txMid42} from '../data/units/c22-s42-mid.taxonomy.js';
import {taxonomy as txFinal41} from '../data/units/c22-s41-fin.taxonomy.js';
import {taxonomy as txMid41} from '../data/units/c22-s41-mid.taxonomy.js';
import {taxonomy as txClimate} from '../data/units/c22-s42-u04.taxonomy.js';
import {taxonomy as txGas} from '../data/units/c22-s42-u03.taxonomy.js';
import {taxonomy as txEco} from '../data/units/c22-s42-u02.taxonomy.js';
import {taxonomy as txSky} from '../data/units/c22-s42-u01.taxonomy.js';
import {taxonomy as tx41u04} from '../data/units/s41-u04.taxonomy.js';
import {taxonomy as txC22S32U04} from '../data/units/c22-s32-u04.taxonomy.js';
import {taxonomy as txC22S32U03} from '../data/units/c22-s32-u03.taxonomy.js';
import {taxonomy as txC22S32U02} from '../data/units/c22-s32-u02.taxonomy.js';
import {taxonomy as txC22S32U01} from '../data/units/c22-s32-u01.taxonomy.js';
import { taxonomy as tx41u01 } from '../data/units/s41-u01.taxonomy.js';
import { taxonomy as tx41u02 } from '../data/units/s41-u02.taxonomy.js';
import { taxonomy as tx41u03 } from '../data/units/s41-u03.taxonomy.js';
import { taxonomy as tx42u02 } from '../data/units/s42-u02.taxonomy.js';
import { taxonomy as tx42u01 } from '../data/units/s42-u01.taxonomy.js';
import { taxonomy as tx42u03 } from '../data/units/s42-u03.taxonomy.js';
import { taxonomy as tx42u04 } from '../data/units/s42-u04.taxonomy.js';
import { taxonomy as tx42u05 } from '../data/units/s42-u05.taxonomy.js';
import { taxonomy as tx51u01 } from '../data/units/s51-u01.taxonomy.js';
import { taxonomy as tx51u02 } from '../data/units/s51-u02.taxonomy.js';
import { taxonomy as tx51u03 } from '../data/units/s51-u03.taxonomy.js';
import { taxonomy as tx51u04 } from '../data/units/s51-u04.taxonomy.js';
import { taxonomy as tx51u05 } from '../data/units/s51-u05.taxonomy.js';
import { taxonomy as tx52u01 } from '../data/units/s52-u01.taxonomy.js';
import { taxonomy as tx31u01 } from '../data/units/s31-u01.taxonomy.js';
import { taxonomy as tx32u01 } from '../data/units/s32-u01.taxonomy.js';
import { taxonomy as tx31u03 } from '../data/units/s31-u03.taxonomy.js';
import { taxonomy as tx31u04 } from '../data/units/s31-u04.taxonomy.js';
import { taxonomy as tx31u02 } from '../data/units/s31-u02.taxonomy.js';
import { taxonomy as tx32u02 } from '../data/units/s32-u02.taxonomy.js';
import { taxonomy as tx32u03 } from '../data/units/s32-u03.taxonomy.js';
import { taxonomy as tx32u04 } from '../data/units/s32-u04.taxonomy.js';
import { taxonomy as tx32u05 } from '../data/units/s32-u05.taxonomy.js';

// 탐구 지도의 정거장 = Drive `과학 단원평가` 폴더의 단원(data/source-toc.md §1). 중간·기말평가는 제외.
// ready: 5E 화면이 있는 단원. 새 단원을 만들면 v2.js UNITS와 여기 ready 둘 다 등록한다.
export const SEMS = [
  { sem: '3-1', units: ['힘과 우리 생활', '동물의 생활', '식물의 생활'] },
  { sem: '3-2', units: ['재미있는 나의 탐구', '동물의 생활', '지표의 변화', '물질의 상태', '소리의 성질'] },
  { sem: '4-1', units: ['자석의 이용', '물의 상태 변화', '땅의 변화'] },
  { sem: '4-2', units: ['식물의 생활', '물의 상태 변화', '그림자와 거울', '화산과 지진', '물의 여행'] },
  { sem: '5-1', units: ['과학자는 어떻게 탐구할까요', '온도와 열', '태양계와 별', '용해와 용액', '다양한 생물과 우리 생활'] },
  { sem: '5-2', units: ['재미있는 나의 탐구', '생물과 환경', '날씨와 우리 생활', '물체의 운동', '산과 염기'] },
  { sem: '6-1', units: ['과학자처럼 탐구해 볼까요', '지구와 달의 운동', '여러 가지 기체', '식물의 구조와 기능', '빛과 렌즈'] },
  { sem: '6-2', units: ['전기의 이용', '계절의 변화', '연소와 소화', '우리 몸의 구조와 기능', '에너지와 생활'] },
].map((s) => ({ ...s, units: s.units.map((title, i) => ({ id: `s${s.sem.replace('-', '')}-u${String(i + 1).padStart(2, '0')}`, no: i + 1, title })) }));

// subs = 소단원(교육과정 내용 요소). 소단원 화면 #/<단원>/sub/<E>
const subsOf = (tx) => tx.elements.map((e) => ({ ...e, types: tx.types.filter((t) => t.element === e.id).length }));
// lesson:false = 5단계 화면 준비 전(소단원 유형별 문제만 열림)
export const READY = {
 'c22-s52-u04':{subs:subsOf(txEnergy52),hero:'자원의 한계·재생에너지·집 모형·실천과 소통',labs:[{id:'c22-s52-u04',hero:'실제 자원 조사·모형 제작/측정/수정·생활 실천과 의견 기록',covers:['E1','E2','E3','E4','E5','E6','E7','E8']}]},
 'c22-s52-u03':{subs:subsOf(txWeather52),hero:'기상 요소·응결 비교·기압/해륙풍·생활 · 관련 원문/독립짝'},
 'c22-s52-u02':{subs:subsOf(txHeat52),hero:'온도·열 이동·단열 장치 · 실제 측정/제작·소통',labs:[{id:'c22-s52-u02',hero:'실제 시각/온도·조건·반복·장치 시험과 의견 기록',covers:['E1','E2','E3','E4','E5','E6','E7','E8']}]},
 'c22-s52-u01':{subs:subsOf(txMixture52),hero:'체·층·용해/거름/증발·실제 설계/조사·소통',labs:[{id:'c22-s52-u01',hero:'실제 분리·여러 날짜·조합/제작·의견 기록',covers:['E1','E2','E3','E4','E5','E6','E7']}]},
 'c22-s51-mid':{hero:'지층·화석·빛의 두 단원 실사형 창작 평가',subs:subsOf(txMid51),bankOnly:true},
 'c22-s51-fin':{hero:'네 단원 창작 평가·옛 기말 관련 발췌와 독립짝',subs:subsOf(txFinal51),bankOnly:true},
 'c22-s51-u04':{hero:'뼈·근육 모형·소화·호흡·순환·배설·기관 협력·건강 실천',subs:subsOf(txBody51),labs:[{id:'c22-s51-u04',hero:'실제 모형 제작·몸 변화 관찰·여러 날 실천·실제 의견 기록',covers:['E1','E2','E3','E4','E5','E6','E7']}]},
 'c22-s51-u03':{hero:'용해·같은 전체 질량·용해량·진하기·생활 쓰임',subs:subsOf(txSolution51),labs:[{id:'c22-s51-u03',hero:'실제 비교·생활 조사·자료 제작·전달과 의견 기록',covers:['E1','E2','E3','E4','E5','E6','E7']}]},
 'c22-s51-u02':{hero:'빛의 필요·직진·반사·굴절·거울과 렌즈·탐구 근거',subs:subsOf(txLight51),labs:[{id:'c22-s51-u02',hero:'실제 관찰·쓰임 조사·장치 설계/제작·재시험·의견 기록',covers:['E1','E2','E3','E4','E5','E6']}]},
 'c22-s51-u01':{hero:'지층·암석·화석의 관찰 근거와 모형',subs:subsOf(txGeo51),labs:[{id:'c22-s51-u01',hero:'지층·알갱이·화석 관찰과 모형·추리·실제 의견 기록',covers:['E1','E2','E3','E4','E5','E6']}]},
 'c22-s42-fin':{hero:'밤하늘·생태계·기체·기후의 네 단원 창작 평가',subs:subsOf(txFinal42),bankOnly:true},
 'c22-s42-mid':{hero:'밤하늘·생물과 환경의 두 단원 창작 평가',subs:subsOf(txMid42),bankOnly:true},
 'c22-s41-fin':{hero:'자석·물·땅·다양한 생물의 네 단원 창작 평가',subs:subsOf(txFinal41),bankOnly:true},
 'c22-s41-mid':{hero:'자석·물의 변화 원문과 설계/관찰 보충',subs:subsOf(txMid41),bankOnly:true},
 'c22-s42-u04':{hero:'평년과 사례·생활 영향·해수면 피해 모형·실제 대응과 소통',subs:subsOf(txClimate),labs:[{id:'c22-s42-u04',hero:'근거 토의·실제 피해 모형실험·날짜별 실천과 의견 기록',covers:['E1','E2','E3','E4','E5','E6']}]},
 'c22-s42-u03':{hero:'같은 용기 무게·기체 부피·조사와 실제 공기 장치 제작/시험',subs:subsOf(txGas),labs:[{id:'c22-s42-u03',hero:'실제 비교 실험·기체 조사·설계/제작·재시험과 소통 기록',covers:['E1','E2','E3','E4','E5','E6']}]},
 'c22-s42-u02':{hero:'생태계 조사·먹이그물 제작·보전 토의와 실천',subs:subsOf(txEco),labs:[{id:'c22-s42-u02',hero:'실제 조사·먹이 모형·토의·보전 실천과 소통 기록',covers:['E1','E2','E3','E4','E5','E6','E7']}]},
 'c22-s42-u01':{hero:'달 관찰·태양계 조사·북극성 주변 별자리',subs:subsOf(txSky),labs:[{id:'c22-s42-u01',hero:'여러 날 달 관찰·행성 모형 제작·북쪽 별자리 관찰',covers:['E1','E2','E3','E4','E5','E6','E7']}]},
 's41-u04':{hero:'균류·원생생물·세균과 우리 생활',subs:subsOf(tx41u04),labs:[{id:'s41-u04',hero:'관찰·생활 영향 발표·소개 자료 공유',covers:['E1','E2','E3','E4','E5','E6','E7','E8']}]},
 'c22-s32-u04':{subs:subsOf(txC22S32U04),hero:'감염 과정·예방 수칙·생활 속 실천'},
 'c22-s32-u03':{subs:subsOf(txC22S32U03),hero:'떨림·소리 비교·제작과 소음 줄이기'},
 'c22-s32-u02':{subs:subsOf(txC22S32U02),hero:'지구·해안 관찰과 갯벌 보전'},
 'c22-s32-u01':{subs:subsOf(txC22S32U01),hero:'재료 관찰·분류·설계'} ,
  's32-u05': { subs: subsOf(tx32u05), bankOnly: true },
  's32-u04': { subs: subsOf(tx32u04), bankOnly: true },
  's32-u03': { subs: subsOf(tx32u03), bankOnly: true },
  's32-u02': { subs: subsOf(tx32u02), bankOnly: true },
  's31-u02': { subs: subsOf(tx31u02), hero: '동물 관찰·분류·설계' },
  's31-u03': { subs: subsOf(tx31u03), hero: '내 잎 관찰·분류·설계' },
  's31-u04': { subs: subsOf(tx31u04), hero: '관찰·그림 기록' },
  's32-u01': { subs: subsOf(tx32u01), bankOnly: true },
  's31-u01': { hero: '수평 모형 실험', subs: subsOf(tx31u01) },
  's41-u01': { hero: '자석 관찰·비교·생활 속 장치 설계', subs: subsOf(tx41u01) },
  's41-u02': { hero: '물의 변화 관찰·물을 얻는 장치 만들기', subs: subsOf(tx41u02) },
  's41-u03': { hero: '물길·화산 모형·암석 분류·대처 실천', subs: subsOf(tx41u03),
    labs: [{ id: 's41-u03', hero: '물길·화산 모형·암석·대처 탐구', covers: ['E1', 'E2', 'E3', 'E4', 'E5', 'E6'] }] },
  's41-u03b': { hero: '화산 실험실', subs: subsOf(tx41u03), hidden: true },   // 땅의 변화의 두 번째 5단계 수업(지도에는 정거장 없음)
  's42-u01': { hero: '부레옥잠 연못', subs: subsOf(tx42u01) },
  's42-u02': { hero: '미니 가습기', subs: subsOf(tx42u02) },
  's42-u03': { hero: '그림자 놀이 상자', subs: subsOf(tx42u03) },
  's42-u04': { hero: '지층 모형 지진 실험실', subs: subsOf(tx42u04),
    labs: [{ id: 's42-u04', hero: '지층 모형 지진 실험실', covers: ['E2', 'E3'] }, { id: 's41-u03b', hero: '화산 실험실', covers: ['E1'] }] },
  's42-u05': { hero: '수조 속 작은 지구', subs: subsOf(tx42u05) },
  's51-u01': { hero: '튀는 물방울 실험실', subs: subsOf(tx51u01) },
  's51-u02': { hero: '시온 스티커 실험실', subs: subsOf(tx51u02) },
  's51-u03': { hero: '떠오르는 태양 실험실', subs: subsOf(tx51u03) },
  's51-u04': { hero: '병 속 눈 실험실', subs: subsOf(tx51u04) },
  's51-u05': { hero: '효모빵 반죽 실험실', subs: subsOf(tx51u05) },
  's52-u01': { hero: '비눗방울 실험실', subs: subsOf(tx52u01) },
};

// 문제은행 = 단원평가 원문(<단원>.source.js) + 유사문항. sets = 세트 번호, n = 원문 수.
// 5단계 수업이 없는 단원도 여기에 있으면 지도에서 열린다(READY에 bankOnly:true로 함께 등록).
export const BANK = {
 'c22-s52-u04':{sets:[1,2,3],n:11,supplement:112,bookAvailable:true,lesson:true,labLabel:'자원 조사·집 모형·실천과 소통 기록',reviewOnly:1,sourceExcerptOnly:true,originalPending:true,label:'옛6-2 에너지 관련 발췌',sourceScopeNote:'현행 전체 원문 준비 중',groups:{1:'원세트1 · 관련4',2:'원세트2 · 관련2',3:'원세트3 · 관련5'},paperLabel:'전체134문항집',paperAvailable:true},
 'c22-s52-u03':{sets:[1,2,3,4],n:57,supplement:112,bookAvailable:true,lesson:true,labLabel:'날씨 관측·모형 실험·소통 기록',reviewOnly:6,sourceExcerptOnly:true,originalPending:true,label:'옛날씨 관련 발췌',sourceScopeNote:'현행 전체 원문 준비 중',groups:{1:'원세트1 · 관련13',2:'원세트2 · 관련12',3:'원세트3 · 관련16',4:'원세트4 · 관련16'},paperLabel:'전체226문항집',paperAvailable:true},
 'c22-s52-u02':{sets:[1,2,3,4],n:75,supplement:104,bookAvailable:true,lesson:true,labLabel:'열 탐구·단열 장치·소통 기록',reviewOnly:4,label:'옛단원 연계 평가',paperLabel:'전체254문항집'},
 'c22-s52-u01':{sets:[],n:0,supplement:96,sourcePending:true,bookAvailable:true,lesson:true,labLabel:'혼합물 탐구·조사·소통 기록',label:'독립 창작 학습 · 원문 준비 중',paperLabel:'창작96문항 교재'},
 'c22-s51-mid':{sets:[1,2],n:0,authored:72,originalPending:true,assessment51Print:true,label:'중간평가 · 창작',assessment:true,formLabel:'평가 유형',groups:{1:'A형',2:'B형'},courseLabel:'초등 과학 5학년 1학기',scope:['지층과 화석','빛의 성질'],scopeNote:'1~2단원 학습용 구성 · 학교별 공식 범위와 별개',paperLabel:'전체72문항집',reviewUnits:{E1:'c22-s51-u01',E2:'c22-s51-u02'}},
 'c22-s51-fin':{sets:[1,2,3,4,5,6],n:42,authored:96,mixedSourceAssessment:true,sourceExcerptOnly:true,reviewOnly:7,originalPending:true,assessment51Print:true,label:'기말평가',assessment:true,formLabel:'평가 자료',groups:{1:'옛 기말1 · 발췌10',2:'옛 기말2 · 발췌13',3:'옛 기말3 · 발췌13',4:'옛 기말4 · 발췌6',5:'창작 A형48',6:'창작 B형48'},courseLabel:'초등 과학 5학년 1학기',scope:['지층과 화석','빛의 성질','용해와 용액','우리 몸의 구조와 기능'],scopeNote:'창작은1~4단원 · 옛 원문은 용해와 용액 관련 발췌 · 현행 전체 원문 준비 중',paperLabel:'전체180문항집',reviewUnits:{E1:'c22-s51-u01',E2:'c22-s51-u02',E3:'c22-s51-u03',E4:'c22-s51-u04'}},
 'c22-s51-u04':{sets:[1,2,3,4],n:58,supplement:96,lesson:true,bookAvailable:true,labLabel:'내 몸 탐구·실천 기록',reviewOnly:6,label:'옛6-2 관련 발췌',sourceExcerptOnly:true,sourceScopeNote:'현행 전체 원문 준비 중',paperLabel:'전체212문항집',groups:{1:'옛6-2 세트1 · 발췌13',2:'옛6-2 세트2 · 발췌12',3:'옛6-2 세트3 · 발췌17',4:'옛6-2 세트4 · 발췌16'}},
 'c22-s42-u04':{sets:[1,2,3,4],n:6,supplement:108,lesson:true,labLabel:'내 기후변화 탐구 기록',label:'옛 에너지/날씨 대응 관련 발췌',sourceExcerptOnly:true,sourceScopeNote:'현행 전체 원문 준비 중',groups:{1:'에너지 원세트1 · 발췌2',2:'에너지 원세트2 · 발췌1',3:'에너지 원세트3 · 발췌2',4:'날씨 원세트2 · 발췌1'},paperLabel:'전체120문항집'},
 'c22-s42-u03':{sets:[1,2,3,4],n:75,supplement:96,lesson:true,labLabel:'내 기체 탐구 기록',label:'옛6-1 여러 가지 기체 원문',groups:{1:'원문 세트1 ·10문항',2:'원문 세트2 ·20문항',3:'원문 세트3 ·20문항',4:'원문 세트4 ·25문항'},reviewOnly:3,paperLabel:'전체246문항집'},
 'c22-s42-u02':{sets:[1,2,3,4],n:70,supplement:80,lesson:true,labLabel:'내 생태계 탐구 기록',label:'옛5-2 생물과 환경 원문',groups:{1:'원문 세트1 ·15문항',2:'원문 세트2 ·15문항',3:'원문 세트3 ·20문항',4:'원문 세트4 ·20문항'},reviewOnly:2,paperLabel:'전체220문항집'},
 'c22-s42-u01':{sets:[1,2,3,4,5,6,7,8],n:95,supplement:80,lesson:true,labLabel:'내 밤하늘 탐구 기록',label:'밤하늘 연계 원문',groups:{1:'태양계 원문1 ·10문항',2:'태양계 원문2 ·20문항',3:'태양계 원문3 ·20문항',4:'태양계 원문4 ·25문항',5:'달 관찰 발췌1 ·3문항',6:'달 관찰 발췌2 ·5문항',7:'달 관찰 발췌3 ·5문항',8:'달 관찰 발췌4 ·7문항'},reviewOnly:5,paperLabel:'전체270문항집'},
 's41-u04':{sets:[1,2,3,4],n:75,supplement:64,lesson:true,labLabel:'내 생물 탐구 기록',label:'옛5-1 원문',groups:{1:'세트1 ·10문항',2:'세트2 ·20문항',3:'세트3 ·20문항',4:'세트4 ·25문항'},reviewOnly:7,paperLabel:'전체214문항집'},
  's41-u01': { sets:[1,2,3,4], n:80, supplement:90, lesson:true, labLabel:'내 자석 탐구 기록' },
 'c22-s32-mid':{sets:[1,2],n:0,authored:60,label:'중간평가 · 창작',assessment:true,formLabel:'평가 유형',groups:{1:'A형',2:'B형'},courseLabel:'초등 과학 3학년 2학기',scope:['물체와 물질','지구와 바다'],scopeNote:'1~2단원 학습용 구성 · 학교별 공식 시험 범위와 별개',reviewUnits:{E1:'c22-s32-u01',E2:'c22-s32-u02'}},
 'c22-s32-fin':{sets:[1,2],n:0,authored:60,label:'기말평가 · 창작',assessment:true,formLabel:'평가 유형',groups:{1:'A형',2:'B형'},courseLabel:'초등 과학 3학년 2학기',scope:['물체와 물질','지구와 바다','소리의 성질','감염병과 건강한 생활'],scopeNote:'1~4단원 학습용 구성 · 학교별 공식 시험 범위와 별개',reviewUnits:{E1:'c22-s32-u01',E2:'c22-s32-u02',E3:'c22-s32-u03',E4:'c22-s32-u04'}},
 'c22-s32-u04':{sets:[],n:0,supplement:80,sourcePending:true,lesson:true,label:'창작 학습',labLabel:'내 건강 생활 탐구 기록'},
 'c22-s32-u03':{sets:[1,2,3,4],n:70,supplement:64,lesson:true,labLabel:'내 소리 탐구 기록',label:'소리의 성질 원문',reusedSourceUnit:'s32-u05'},
 'c22-s32-u02':{sets:[],n:0,supplement:80,sourcePending:true,lesson:true,label:'창작 학습',labLabel:'내 지구·바다 탐구 기록'},
 'c22-s32-u01':{sets:[1,2,3,4],n:70,supplement:64,lesson:true,label:'상태 관찰 원문',labLabel:'내 관찰·분류·설계 기록',reusedSourceUnit:'s32-u04'},
  's31-fin': { sets: [1, 2], n: 0, authored: 60, label: '기말평가 · 창작', assessment: true, formLabel: '평가 유형', groups: { 1: 'A형', 2: 'B형' }, reviewUnits: { E1: 's31-u01', E2: 's31-u02', E3: 's31-u03', E4: 's31-u04' } },
  's31-u04': { sets: [1, 2, 3, 4], n: 41, supplement: 64, lesson: true, label: '교재 문항', groups: { 1: '동물의 자람과 관찰', 2: '곤충의 한살이', 3: '식물의 자람 조건', 4: '식물 실험·자료 해석' } },
  's41-u02': { sets:[1,2,3,4], n:80, supplement:78, lesson:true, labLabel:'내 물 탐구 기록' },
  's41-u03': { sets:[1,2,3,4], n:80, supplement:82, lesson:true, labLabel:'내 땅의 변화 탐구 기록' },
  's51-u01': { sets: [1], n: 15 },
  's42-u05': { sets: [1,  2,  3], n: 45 },
  's42-u04': { sets: [1,  2,  3,  4], n: 70 },
  's42-u03': { sets: [1,  2,  3,  4], n: 70 },
  'c22-s51-u01':{sets:[],n:0,supplement:96,sourcePending:true,label:'창작 학습',lesson:true,labLabel:'내 지층·화석 탐구 기록',paperLabel:'전체96문항집'},
  'c22-s51-u03':{sets:[1,2,3,4],n:75,supplement:96,lesson:true,reviewOnly:10,label:'옛5-1 연계 원문',sourceScopeNote:'현행 판본 전체 원문 확인은 별도',paperLabel:'전체246문항집'},
  'c22-s51-u02':{sets:[1,2,3,4,5,6,7,8],n:40,supplement:80,lesson:true,labLabel:'내 빛 탐구 기록',sourceExcerptOnly:true,sourceScopeNote:'현행 전체 원문 준비 중',label:'옛단원 연계 발췌',paperLabel:'전체160문항집',groups:{1:'옛6-1 빛·렌즈 1 발췌',2:'옛6-1 빛·렌즈 2 발췌',3:'옛6-1 빛·렌즈 3 발췌',4:'옛6-1 빛·렌즈 4 발췌',5:'옛4-2 그림자·거울 1 발췌',6:'옛4-2 그림자·거울 2 발췌',7:'옛4-2 그림자·거울 3 발췌',8:'옛4-2 그림자·거울 4 발췌'}},
  'c22-s42-fin':{sets:[1,2],n:0,authored:104,originalPending:true,label:'기말평가 · 창작',assessment:true,formLabel:'평가 유형',groups:{1:'A형',2:'B형'},courseLabel:'초등 과학 4학년 2학기',scope:['밤하늘 관찰','생물과 환경','여러 가지 기체','기후변화와 우리 생활'],scopeNote:'1~4단원 학습용 구성·학교별 공식 범위와 별개',paperLabel:'전체104문항집',reviewUnits:{E1:'c22-s42-u01',E2:'c22-s42-u02',E3:'c22-s42-u03',E4:'c22-s42-u04'}},
  'c22-s42-mid':{sets:[1,2],n:0,authored:72,originalPending:true,label:'중간평가 · 창작',assessment:true,formLabel:'평가 유형',groups:{1:'A형',2:'B형'},courseLabel:'초등 과학 4학년 2학기',scope:['밤하늘 관찰','생물과 환경'],scopeNote:'1~2단원 학습용 구성·학교별 공식 범위와 별개',paperLabel:'전체72문항집',reviewUnits:{E1:'c22-s42-u01',E2:'c22-s42-u02'}},
  'c22-s41-fin':{sets:[1,2],n:0,authored:104,originalPending:true,label:'기말평가 · 창작',assessment:true,formLabel:'평가 유형',groups:{1:'A형',2:'B형'},courseLabel:'초등 과학 4학년 1학기',scope:['자석의 이용','물의 상태 변화','땅의 변화','다양한 생물과 우리 생활'],scopeNote:'1~4단원 학습용 구성·학교별 공식 범위와 별개',paperLabel:'전체104문항집',reviewUnits:{E1:'s41-u01',E2:'s41-u02',E3:'s41-u03',E4:'s41-u04'}},
  'c22-s41-mid': {sets:[1,2],n:50,supplement:24,label:'중간평가',assessment:true,reviewOnly:1,paperLabel:'전체124문항집',reviewUnits:{E1:'s41-u01',E2:'s41-u02'}},
  's41-mid': {sets:[1,2],n:50},
  's32-fin': { sets: [1,  2], n: 40 },
  's32-mid': { sets: [1,  2], n: 40 },
  's32-u05': { sets: [1,  2,  3,  4], n: 70 },
  's32-u04': { sets: [1,  2,  3,  4], n: 70 },
  's31-mid': { sets: [1, 2], n: 50, label: '중간평가', assessment: true, reviewUnits: { E1: 's31-u01', E2: 's31-u02' } },
  's32-u03': { sets: [1,  2,  3,  4], n: 70 },
  's32-u02': { sets: [1,  2,  3,  4], n: 70 },
  's31-u02': { sets: [1, 2, 3, 4], n: 80, lesson: true, labLabel: '동물 관찰·분류·설계' },
  's31-u03': { sets: [1, 2, 3, 4], n: 80, lesson: true, labLabel: '내 잎 관찰·분류·설계' },
  's32-u01': { sets: [1], n: 15 },
  's31-u01': { sets: [1, 2, 3, 4], n: 80, lesson: true, labLabel: '수평 모형 실험' },
  's42-u02': { sets: [1, 2, 3, 4], n: 70 },
};

// 실험 교재(data/book/<id>.book.js)가 있는 수업 — 지도의 시트에서 첫 화면(#/<id>/start)으로 들어간다.
export const BOOK_UNITS = new Set(['c22-s52-u04','c22-s52-u03','c22-s52-u02', 'c22-s52-u01', 'c22-s51-u04', 'c22-s51-u03', 'c22-s51-u02', 'c22-s51-u01', 'c22-s42-u04', 'c22-s42-u03', 'c22-s42-u02', 'c22-s42-u01', 's41-u04', 'c22-s32-u04', 'c22-s32-u03', 'c22-s32-u02', 'c22-s32-u01', 's31-u03', 's31-u02', 's31-u01', 's31-u04', 's41-u01', 's41-u02', 's41-u03', 's41-u03b', 's42-u01', 's42-u02', 's42-u03', 's42-u04', 's42-u05', 's51-u01', 's51-u02', 's51-u03', 's51-u04', 's51-u05', 's52-u01']);
