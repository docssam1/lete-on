import test from 'node:test';
import assert from 'node:assert/strict';
import {selectKnowledge, answerFromSources} from '../supabase/roadmap-counsel/search.mjs';
const note = (id,title,body,extra={}) => ({id,title,body,status:'approved',stage:'all',...extra});
// Short independent fixtures exercise routing, not a second provider catalogue.
const notes = [
 note('providers','KMO 대비는 어디에서 하나요?', 'KMO 대비는 지역과 현재 진도를 살펴봐요. 온라인 후보는 프라이빗노트·위너스KMO입니다. 대치 대면 후보는 픽스·CMS 경시관(EMS 과정)·아카로드·올림피아드입니다.'),
 note('mk','부산 MK아카데미는 어느 지점이 있고 KMO 수업은 어떻게 확인하나요?', '안내 확인일은 공고와 비교해 주세요.\n\n부산 센텀은 KMO 기하 입문을 안내합니다.\n\n부산 사직은 KMO 입문·1.5·2차를 안내합니다.\n\n창원 중동·반송은 PRE KMO에서 중등 심화와 경시 기초를 연결합니다.\n\n대구 수성은 PRE KMO1 대수를 안내합니다.'),
 note('cms','EMS는 어느 학원 과정이고 CMS 경시관은 어느 지역에 있나요?', 'EMS는 CMS 경시관의 경시입문 과정입니다.\n\n공식 지점 안내에는 대치·목동·평촌 경시관이 표시돼 있습니다.'),
 note('stages','경시 준비는 어느 단계에서 시작하고 얼마나 공부하나요?', '기초: 중등 과정 정리와 경시 기초 지식.\n입문: 기하·정수 기초와 경시적 접근.\n기본: 영역별 기본서, 문제 해결 전략, KMO 1차 준비.\n심화: 영역별 심화와 1차 고배점 문제.\n2차 대비: 서술·증명과 영재학교·과학고 심화 문제.'),
 note('math','경시 정수론 합동식', '나머지와 합동식의 뜻을 설명해 보세요.'),
 note('paper','KMO 경시 기출 문제', 'KMO 기출 문항과 출제 문항을 확인해요.')
];
function consult(context, rows=notes) {
 const selected=selectKnowledge(rows,context);
 return {...answerFromSources(selected,context),ids:selected.map(row=>row.id)};
}
test('region field routes 부산, 창원 and 대구 to their approved local course paragraphs',()=>{
 for(const [region,wanted,unwanted] of [['부산','부산 센텀','창원 중동'],['창원','창원 중동·반송','부산 센텀'],['대구','대구 수성','부산 사직']]) {
  const result=consult({question:'KMO 수업은 어디에서 하나요?',region});
  assert.equal(result.ids[0],'mk'); assert.match(result.summary,new RegExp(wanted));
  assert.ok(!result.summary.includes(unwanted)); assert.doesNotMatch(result.summary,/대치|프라이빗노트/u);
 }
});
test('question region overrides the region field; older clients may put region in progress',()=>{
 assert.match(consult({question:'창원에서 KMO 어디 다닐까요?',region:'부산'}).summary,/창원 중동/u);
 assert.match(consult({question:'KMO 학원 추천',progress:'대구 거주, 경시 처음'}).summary,/대구 수성/u);
});
test('online request overrides local preference; negative online request remains in person',()=>{
 const online=consult({question:'KMO 온라인 수업 어디?',region:'부산',progress:'중등 완료, 경시 처음'});
 assert.equal(online.ids[0],'providers'); assert.match(online.summary,/프라이빗노트·위너스KMO/u);
 assert.doesNotMatch(online.summary,/부산|대치|센텀/u);
 assert.equal(consult({question:'온라인 말고 KMO 학원 어디?',region:'부산'}).ids[0],'mk');
});
test('CMS and EMS route to one academy note and an actually documented branch',()=>{
 for(const question of ['EMS 수업 어디에서 하나요?','CMS 경시관은요?','KMO 학원 추천']) {
  const result=consult({question,region:'목동'});
  assert.equal(result.ids[0],'cms'); assert.match(result.summary,/목동.*CMS 경시관/u); assert.match(result.summary,/경시입문/u);
 }
});
test('unsupported region never invents a local MK or CMS branch',()=>{
 for(const question of ['KMO 학원 어디?','MK 학원 어디?','EMS 수업은요?']) {
  assert.match(consult({question,region:'제주'}).summary,/승인 자료가 아직 충분하지/u);
 }
});
test('beginners, unfinished concepts and first-round graduates get different checks, not admission guarantees',()=>{
 const base={question:'KMO 학원 어디?',region:'부산'};
 assert.match(consult({...base,progress:'중등 과정 미완, 기초가 약함'}).explanation,/기초: 중등 과정 정리/u);
 assert.match(consult({...base,progress:'중등 완료, 경시 처음'}).explanation,/입문: 기하·정수/u);
 assert.match(consult({...base,progress:'경시 입문 완료, 1차 준비'}).explanation,/기본: 영역별 기본서/u);
 assert.match(consult({...base,progress:'KMO 1차 동상, 2차 대비'}).explanation,/2차 대비: 서술·증명/u);
 assert.doesNotMatch(consult({...base,progress:'KMO 1차 불합격'}).explanation,/2차 대비: 서술/u);
});
test('missing region asks for region, and missing progress asks for textbook and independent range',()=>{
 const result=consult({question:'KMO 대비는 어디에서 하나요?'});
 assert.match(result.summary,/지역/u); assert.match(result.explanation,/현재 교재·단원.*혼자/u);
});
test('candidates, archived courses and the wrong school stage cannot supply recommendations',()=>{
 const hidden=notes.map(row=>row.id==='mk'?{...row,status:'candidate'}:row);
 const result=consult({question:'KMO 학원 어디?',region:'부산'},hidden);
 assert.ok(!result.ids.includes('mk')); assert.doesNotMatch(result.summary,/센텀|사직/u);
 const changed=notes.map(row=>row.id==='mk'?{...row,body:'부산의 현재 과정은 입반 상담으로 확인합니다.'}:row);
 assert.doesNotMatch(consult({question:'KMO 학원 어디?',region:'부산'},changed).summary,/센텀|사직/u);
 const noBranch=notes.map(row=>row.id==='cms'?{...row,body:'EMS 과정은 지점에 확인해 주세요.'}:row);
 assert.doesNotMatch(consult({question:'EMS 수업은요?',region:'목동'},noBranch).summary,/목동에서는/u);
});
test('a local academy route does not replace concept or exam-paper questions',()=>{
 assert.equal(consult({question:'경시 정수론 합동식',region:'부산'}).ids[0],'math');
 assert.equal(consult({question:'KMO 기출 문제 어디?',region:'부산'}).ids[0],'paper');
});
