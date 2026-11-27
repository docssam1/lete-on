// Current student presentation; retain the raw bank and every saved version.
export const LIGHT_LANGUAGE_VERSION='20261105-light-student-language';
const clone=value=>JSON.parse(JSON.stringify(value));
const topics={
 10:'어둠상자에서 물체 보기',14:'직진을 비교할 때의 조건',26:'반사와 굴절 구별하기',34:'거울 장치의 쓰임새',36:'돋보기의 쓰임새 조사하기',39:'장치 설계와 시험',40:'장치에 쓸 재료 고르기',42:'조명만 바꾸어 비교하기',44:'눈의 위치를 같게 하여 다시 비교하기',48:'빛의 경로 고치기',49:'달이 보이는 까닭',50:'관찰 결과로 알 수 있는 것',51:'확대경의 쓰임새 조사하기',52:'친구의 질문에 맞게 설명 고치기',55:'굴절과 물체 보기',58:'빛의 직진',64:'막대의 실제 모양과 보이는 모습',66:'굴절 관찰하기',73:'교재 자료와 내 실험 결과',76:'친구에게 장치 설명하기',
};
const prompts={
 4:'거울로 뒤쪽 카드를 보았습니다. 친구가 같은 방법으로 볼 수 있도록 무엇을 더 기록해야 할까요?',
 12:'구멍을 뚫은 판 세 개를 세우고 그 너머에 LED 전등을 놓았습니다. 불빛을 보려면 어떻게 놓아야 할까요?',
 14:'구멍 세 개를 한 줄로 맞추었을 때 불빛이 보였습니다. 가운데 판만 옮겨 비교하려고 합니다. 움직이지 않아야 할 것 한 가지를 쓰세요.',
 25:'빈 그릇 바닥의 동전이 그릇 가장자리에 가려 보이지 않도록 눈의 위치를 정했습니다. 물을 넣었을 때 동전이 보이는지 비교하려면 어떻게 해야 하나요?',
 41:'다음은 같은 상자에서 조명을 끄고 켜며 물체를 관찰한 결과의 예입니다. 조명을 끈 경우와 켠 경우의 결과를 각각 쓰세요.',
 44:'동전이 보이는지 비교하다가 눈의 위치도 바뀌었다는 것을 알았습니다. 이 사실을 기록하고 다시 비교할 방법을 쓰세요.',
 48:'친구가 책을 볼 때의 빛의 경로를 ‘전등 → 눈 → 책’으로 그렸습니다. 바르게 고치고 그 까닭을 쓰세요.',
 49:'친구가 “밤에 달이 밝게 보이니 달은 스스로 빛을 내는 물체야.”라고 말했습니다. 달이 보이는 까닭을 들어 친구에게 설명하세요.',
 54:'빛이 같은 물질 안에서 곧게 나아가는 성질은 ㉠[ ]이고, 거울에 닿아 되돌아 나오는 성질은 ㉡[ ]이다.',
 55:'빛이 공기에서 물로 비스듬히 들어갈 때 진행 방향이 달라지는 현상은 ㉠[ ]이다. 물체를 볼 때 그 물체에서 온 빛이 마지막으로 들어가는 곳은 ㉡[ ]이다.',
 60:'종이에 쓰인 글씨를 눈으로 볼 때 빛의 경로를 배열하세요.',
 69:'작은 글자를 자세히 볼 때 쓰는 도구 한 가지를 고르고, 어떤 도움을 주는지 쓰세요.',
 75:'거울이나 렌즈를 이용하여 생활의 불편을 줄일 장치를 생각해 보세요. 무엇을 하기 위한 장치인지, 어떻게 쓰는지, 잘 작동하는지 확인할 방법을 쓰세요.',
 79:'동전이 보이는지 확인하면서 눈의 위치도 옮기고 물도 넣었습니다. 물을 넣기 전과 후만 비교할 수 있도록 방법을 고쳐 쓰세요.',
};
const words=[
 ['세 구멍과 눈을 한 직선 위에 놓는다.','LED와 세 구멍, 눈을 한 직선 위에 놓는다.'],
 ['세 구멍과 눈을 한 직선에 둔다.','LED와 세 구멍, 눈을 한 직선 위에 놓는다.'],
 ['빛은 물질 경계에서도 언제나 꺾이지 않는다.','빛은 공기에서 물로 비스듬히 들어가도 방향이 바뀌지 않는다.'],
 ['밝기만 비교한 공정한 실험이다.','조명만 바꾸어 비교한 실험이다.'],
 ['두 조건이 달라 빛 유무만의 영향으로 단정하기 어렵다.','조명과 눈의 위치가 함께 달라져 조명의 영향만 알기는 어렵다.'],
 ['실제 형태와 경계의 빛 경로를 나누어 살핀다.','막대의 실제 모양과 물과 공기 사이에서 빛이 나아가는 경로를 구별해 살핀다.'],
 ['연습 자료 · 실측 기록 아님','관찰 결과의 예'],
];
function language(value){
 if(typeof value==='string')return words.reduce((text,[old,next])=>text.replaceAll(old,next),value);
 if(Array.isArray(value))return value.map(language);
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,v])=>[key,language(v)]));
 return value;
}
function presentation(q,no,book){
 const next={...q,...(prompts[no]?{prompt:prompts[no]}:{})};
 if(topics[no]){if(book)next.topic=topics[no];else next.taxonomy={...q.taxonomy,topic:topics[no]};}
 for(const key of book?['choices','given']:['choices','givens'])if(Object.hasOwn(q,key))next[key]=language(q[key]);
 return JSON.stringify(next)===JSON.stringify(q)?q:next;
}
export function lightCurrentItems(rows){return rows.map(q=>{
 const no=q.workbookRef?.no;
 if(!/^c22-s51-u02-b\d+$/.test(q.id||'')||q.status!=='authored'||q.sourceRef?.type!=='authored-supplement'||q.workbookRef?.id!==`light-book-${String(no).padStart(2,'0')}`||q.contentVersion===LIGHT_LANGUAGE_VERSION||q.previousVersions?.some(p=>p.version===LIGHT_LANGUAGE_VERSION))return q;
 const next=presentation(q,no,false);if(next===q)return q;
 return{...next,contentVersion:LIGHT_LANGUAGE_VERSION,previousVersions:[...(q.previousVersions?clone(q.previousVersions):[]),{...clone(q),version:q.contentVersion||1}]};
});}
const prose=[
 ['상자 안 LED 켜짐/꺼짐','상자 안 LED를 켜거나 끄기'],
 ['눈·상자·물체·관찰 구멍 위치','눈·상자·물체·관찰 구멍의 위치'],
 ['교사 준비 상자에 공이나 카드를 놓고 처음 위치를 고정해요.','교사가 준비한 상자에 공이나 카드를 놓고 움직이지 않게 해요.'],
 ['내부를 비추는 약한 LED만 끄고 켜며 보임을 비교해요.','상자 안의 약한 LED만 끄고 켜며 물체가 보이는지 비교해요.'],
 ['상자 틈의 주변 빛도 확인해 잘 안 보임과 빛이 전혀 없음을 구별해요.','상자 틈으로 다른 빛이 들어오는지 확인해요. 물체가 잘 보이지 않는 경우와 빛이 전혀 없는 경우를 구별해요.'],
 ['같은 공기 속 곧은 경로로 통과할 수 있어요.','빛이 공기 중에서 곧게 나아가 구멍을 차례로 통과해요.'],
 ['그 길을 판이 가리면 저절로 굽어 가지 않아요.','판이 빛이 나아가는 길을 막으면 빛이 구멍을 찾아 돌아가지는 않아요.'],
 ['교사가 준비한 약한 LED·세 구멍 판·목표 종이를 고정해요.','교사가 준비한 약한 LED, 구멍을 뚫은 판 세 개, 흰 종이를 움직이지 않게 놓아요.'],
 ['교사가 준비한 약한 LED 슬릿 광원·종이·안전 평면거울을 고정해요.','좁은 틈으로 약한 LED 빛이 나오는 장치와 흰 종이, 안전한 평면거울을 교사와 함께 놓고 고정해요.'],
 ['광원·종이는 고정하고 거울 방향 한 곳만 바꾸어 빛이 닿는 곳을 비교해요.','광원과 종이는 그대로 두고 거울의 방향만 바꾸어 빛이 닿는 곳을 비교해요.'],
 ['교사 준비 약한 LED 슬릿 광원·종이','좁은 틈으로 약한 LED 빛이 나오는 장치와 흰 종이'],
 ['렌즈를 넣기 전 종이 위 빛 경로','렌즈를 놓기 전 종이 위에 나타나는 빛의 경로'],
 ['작은 씨앗·글자의 특징 관찰','작은 씨앗이나 글자를 자세히 보기'],
 ['보이지 않는 방향의 카드 관찰','가려진 쪽의 카드를 보기'],
 ['장치가 안 보이면 여러 곳을 한꺼번에 고칠까요?','장치로 카드가 보이지 않으면 여러 곳을 한꺼번에 고칠까요?'],
 ['다른 조건은 고정하고 거울 방향 한 곳을 바꾸어요.','다른 조건은 같게 하고 거울의 방향만 바꾸어요.'],
 ['같은 카드·눈 위치에서 다시 보이는지 확인해요.','카드와 눈을 같은 위치에 두고 다시 보이는지 확인해요.'],
 ['수정 계획과 실제 재시험의 결과를 구별해요.','고칠 계획과 실제로 다시 시험해 본 결과를 구별해요.'],
 ['목적에 맞춘 장치와 재시험','목적에 맞게 만든 장치를 다시 시험하기'],
];
function lessonLanguage(value){
 if(typeof value==='string')return prose.reduce((text,[old,next])=>text.replaceAll(old,next),value);
 if(Array.isArray(value))return value.map(lessonLanguage);
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,v])=>[key,lessonLanguage(v)]));
 return value;
}
export function withLightStudentLanguage(workbook){
 if(workbook.unit!=='c22-s51-u02'||workbook.questions.length!==80||workbook.pages.length!==58)throw Error('빛 학생 원고 편집 대상이 다릅니다.');
 const pages=rows=>rows?.map(p=>({...p,blocks:lessonLanguage(p.blocks)}));
 return{...workbook,questions:workbook.questions.map(q=>presentation(q,q.no,true)),pages:pages(workbook.pages),teacherStudentPages:pages(workbook.teacherStudentPages)};
}
