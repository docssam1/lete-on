const looks=new Set(['a','b','c']);
const buttons=[...document.querySelectorAll('button[data-look]')];
function choose(look){
 if(!looks.has(look))look='a';
 document.body.dataset.look=look;
 for(const button of buttons)button.setAttribute('aria-pressed',String(button.dataset.look===look));
}
choose(new URL(location.href).searchParams.get('look'));
for(const button of buttons)button.addEventListener('click',()=>{choose(button.dataset.look);const url=new URL(location.href);url.searchParams.set('look',button.dataset.look);history.replaceState(null,'',url);});
const print=document.querySelector('#print'),status=document.querySelector('#ready');
const imageReady=im=>im.complete?(im.naturalWidth?Promise.resolve():Promise.reject(Error('image'))):new Promise((resolve,reject)=>{im.addEventListener('load',resolve,{once:true});im.addEventListener('error',reject,{once:true});});
Promise.all([document.fonts.load('400 16px Reading','생물과 환경'),document.fonts.load('700 16px Reading','생물과 환경'),document.fonts.load('700 18px Note','내가 찾은 것'),...[...document.images].map(imageReady)]).then(async()=>{await document.fonts.ready;print.disabled=false;status.textContent='그림과 글꼴이 준비되었어요.';}).catch(()=>{status.textContent='그림이나 글꼴을 불러오지 못했어요. 다시 열어 주세요.';});
print.addEventListener('click',()=>{if(!print.disabled)window.print();});
