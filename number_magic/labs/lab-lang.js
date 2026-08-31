/* ============================================================
   개념실험실 공용 언어 레이어 — 실험실 6종이 같은 방식으로 3언어를 지원한다.

   언어 출처는 앱·문제은행과 같은 규약: localStorage 'nm_state_v1'의 lang.
   (실험실은 앱과 같은 오리진에서 window.open으로 열리므로 그대로 읽힌다.
    직접 URL로 연 경우엔 값이 없으니 ko.)

   쓰는 법 — 실험실 <head>에서 이 파일을 먼저 로드하고:
     LabLang.fill(STR)      … [data-t="키"] 요소를 STR[키]={ko,en,zh}로 채움(textContent)
     LabLang.fillHtml(STR)  … [data-th="키"] 요소를 innerHTML로 채움(<b> 등 강조 유지)
     LabLang.T(obj)         … {ko,en,zh} 중 현재 언어
     LabLang.speak(SAY)     … .speak 버튼에 읽어주기 연결(SAY={ko,en,zh} 또는 키별 객체)
   문자열을 인라인으로 만드는 곳(숫자를 섞는 캡션 등)은 T({ko:…,en:…,zh:…})를 그대로 쓴다.
   ============================================================ */
(function(){
'use strict';

var LANG='ko';
try{
  var st=JSON.parse(localStorage.getItem('nm_state_v1')||'{}');
  if(st.lang==='en'||st.lang==='zh'||st.lang==='ko')LANG=st.lang;
}catch(e){}
document.documentElement.lang=(LANG==='zh')?'zh-CN':LANG;

function T(o){
  if(o==null)return '';
  if(typeof o==='string')return o;
  return o[LANG]||o.ko||o.en||'';
}

function fillWith(prop,attr,STR,root){
  (root||document).querySelectorAll('['+attr+']').forEach(function(el){
    var k=el.getAttribute(attr);
    if(STR&&STR[k]!=null)el[prop]=T(STR[k]);
  });
}

window.LabLang={
  lang:LANG,
  T:T,
  /* Web Speech 보이스 코드 */
  voice:(LANG==='en')?'en-US':(LANG==='zh')?'zh-CN':'ko-KR',
  fill:function(STR,root){fillWith('textContent','data-t',STR,root);},
  fillHtml:function(STR,root){fillWith('innerHTML','data-th',STR,root);},
  /* 문서 제목 — 실험실 이름 {ko,en,zh} */
  title:function(name){document.title=T(name)+' — Numbers of Magic';},
  /* 읽어주기: .speak[data-say="키"] 버튼에 연결.
     SAY가 {ko,en,zh}면 버튼 하나짜리, {키:{ko,en,zh}}면 키별로 읽는다. */
  speak:function(SAY,root){
    (root||document).querySelectorAll('.speak').forEach(function(b){
      b.onclick=function(){
        if(!window.speechSynthesis)return;
        speechSynthesis.cancel();
        var k=b.getAttribute('data-say');
        var src=(k&&SAY[k]!=null)?SAY[k]:SAY;
        var txt=T(src);
        if(!txt)return;
        var u=new SpeechSynthesisUtterance(txt);
        u.lang=window.LabLang.voice;u.rate=.95;
        speechSynthesis.speak(u);
      };
    });
  }
};
})();
