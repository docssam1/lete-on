// 실제 응결 연구 촬영. 원본을 수정하지 않고 직접 재생하며, 저자·CC BY 4.0·원문을 표시한다.
const name='3D-Imaging-of-Water-Drop-Condensation-on-Hydrophobic-and-Hydrophilic-Lubricant-Impregnated-Surfaces-srep23687-s2.ogv';
const base='https://upload.wikimedia.org/wikipedia/commons';
export const condensationVideo={
 kind:'video', title:'작은 물방울이 맺히고 자라는 모습 · 연구 영상',
 src:`${base}/transcoded/9/9f/${name}/${name}.240p.vp9.webm`,
 mp4:`${base}/transcoded/9/9f/${name}/${name}.360p.mpeg4.mov`, full:`${base}/9/9f/${name}`,
 page:`https://commons.wikimedia.org/wiki/File:${name}`,
 license:'https://creativecommons.org/licenses/by/4.0/',
 credit:'Kajiya · Schellenberger · Papadopoulos · Vollmer · Butt (2016) · CC BY 4.0 · 원본 무편집',
 prompt:'작은 물방울이 생기고 커지는 모습을 찾아봐요. 특수 표면을 확대한 연구 촬영으로, 우리 컵 실험과 장치·시간은 달라요.',
 poster:'../assets/photos/s42-u02-condensation.webp'
};
// 사이언스랩 3D 설명 영상(자체 제작, 21초, 한국어 자막) — 장치·과정 모형이라 실제 방울 수·시간과 달라요.
const G='../assets/video/s42-u02-condensation-guide';   // .webm(VP9, 47KB) 먼저, 사파리·아이폰은 .mp4(H.264)
export const guideVideo={kind:'model',tag:'3D 설명 영상',label:'3D 설명 영상 보기',title:'보이지 않는 물의 여행 · 3D 설명 영상',src:`${G}.webm`,mp4:`${G}.mp4`,full:`${G}.mp4`,page:`${G}.mp4`,poster:'../assets/photos/s42-u02-apparatus.webp',credit:'사이언스랩 3D 설명 영상 · 과정 모형 · 실제 방울 수·시간과 달라요'};
export const media={engage:guideVideo,explore:condensationVideo,compareTitle:'물방울을 실제로 확대해서 봐요',compareLabel:'응결 연구 영상 보기',deck:condensationVideo};
