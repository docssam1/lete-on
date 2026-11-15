import{photoFigureHtml}from'../../v2/photo-figure.js?v=20261115-biology-comparison-photos';
export const BATTERY_POLARITY_CARD_VERSION='20261115-battery-polarity-card';
const priorPrompt='같은 극끼리 이은 두 전지 카드에서 고칠 곳을 그림에 표시하세요. 실제로 연결하지 말고, 전지를 분리하고 확인할 순서도 쓰세요.';
export const batteryPolarityCard=Object.freeze({
 figure:'assets/book/c22-s62-u03-battery-polarity-card.svg',
 figureNote:'전지 가는 왼쪽 +극·오른쪽 −극, 전지 나는 왼쪽 −극·오른쪽 +극입니다. 가의 오른쪽 −극과 나의 왼쪽 −극 사이에 연결선이 있습니다. 실제 연결이 아닌 그림 카드입니다.',
 photoLabels:['극의 위치와 연결선을 살펴보아요.'],photoCredit:'지필드 · 학습용 전지 카드',
 prompt:'다음 전지 카드에서 고칠 곳을 찾아, 직렬연결이 되도록 고친 모습을 그리세요. 실제로 연결하지 말고, 전지를 분리하고 확인할 순서도 쓰세요.'
});
export const batteryPolarityCardEntries=Object.freeze({
 'c22-s62-u03-b048':{unit:'c22-s62-u03',version:'20261106-electricity-readable-workbook',currentVersion:BATTERY_POLARITY_CARD_VERSION,prompt:priorPrompt,fields:batteryPolarityCard}
});
export function withBatteryPolarityCardArt(art){
 if(!art||Object.hasOwn(art,'electricityBatteryPolarityCard'))return art;
 return{...art,electricityBatteryPolarityCard:photoFigureHtml(batteryPolarityCard)};
}
export function withBatteryPolarityCardWorkbook(workbook){
 if(workbook?.unit!=='c22-s62-u03'||!Array.isArray(workbook.questions))return workbook;
 let changed=false;const questions=workbook.questions.map(q=>{
  if(q.id!=='c22-s62-u03-w048'||q.no!==48||q.form!=='draw'||q.origin!=='independently-authored-current-curriculum'||q.sourceRef?.type!=='authored'||!['authored','authored-draft'].includes(q.status)||q.prompt!==priorPrompt||q.figure||q.given||q.givens||q.table||q.contentVersion)return q;
  changed=true;return{...q,prompt:batteryPolarityCard.prompt,figure:'electricityBatteryPolarityCard'};
 });
 return changed?{...workbook,questions,figures:withBatteryPolarityCardArt(workbook.figures)}:workbook;
}
