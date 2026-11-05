// 외부 글꼴 대신 교재에 실린 본문·손글씨 글꼴과 모든 그림을 기다린다.
const FONTS=['400 12px Pretendard','700 12px Pretendard','700 18px Gaegu'];
const READING_FONTS=['400 12px "Pretendard Variable"','700 12px "Pretendard Variable"','700 18px Gaegu'];
export function wireWorkbookPrint(root){
 const button=root.querySelector('[data-workbook-print]'),status=root.querySelector('[data-workbook-status]');
 let active=true;const pending=new Set();button.disabled=true;
 const clear=()=>{for(const remove of pending)remove();pending.clear();};
 const imageReady=im=>{
  if(im.complete)return im.naturalWidth?Promise.resolve():Promise.reject(Error('image'));
  return new Promise((resolve,reject)=>{
   const remove=()=>{im.removeEventListener('load',loaded);im.removeEventListener('error',failed);pending.delete(remove);};
   const loaded=()=>{remove();im.naturalWidth?resolve():reject(Error('image'));},failed=()=>{remove();reject(Error('image'));};
   pending.add(remove);im.addEventListener('load',loaded,{once:true});im.addEventListener('error',failed,{once:true});
  });
 };
 const unit=root.querySelector('[data-paper-unit]')?.dataset?.paperUnit||root.dataset?.paperUnit;
 const revised=root.classList?.contains('revised-workbook-print')||root.querySelector('.revised-workbook-print')?.classList?.contains('revised-workbook-print');
 const requiredFonts=revised?READING_FONTS:['c22-s32-u04','c22-s42-u04','s41-u02','s41-u03','s41-u04','c22-s42-u03','c22-s51-u01','c22-s51-u02','c22-s51-u04','c22-s52-u01','c22-s52-u02','c22-s52-u03','c22-s52-u04','c22-s61-u01','c22-s61-u02','c22-s61-u03','c22-s61-u04'].includes(unit)?[...FONTS,'400 12px "Noto Serif KR"','700 12px "Noto Serif KR"']:FONTS;
 const fontReady=async()=>{
  const loaded=await Promise.all(requiredFonts.map(font=>document.fonts.load(font,'과학 학습 0123456789')));
  if(loaded.some(faces=>!faces.length))throw Error('font');
  await document.fonts.ready;
 };
 Promise.all([fontReady(),...[...root.querySelectorAll('img')].map(imageReady)])
  .then(()=>{clear();if(active&&root.isConnected){button.disabled=false;status.textContent='그림과 글꼴이 준비되었어요.';}})
  .catch(()=>{clear();if(active&&root.isConnected)status.textContent='그림 또는 글꼴을 불러오지 못했어요. 교재를 다시 열어 주세요.';});
 const print=()=>{if(active&&root.isConnected&&!button.disabled)window.print();};
 button.addEventListener('click',print);scrollTo(0,0);
 return()=>{active=false;clear();button.disabled=true;button.removeEventListener('click',print);};
}
