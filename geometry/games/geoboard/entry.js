const params=new URLSearchParams(location.search);
const language=(()=>{try{return localStorage.getItem("gfield-language")||"ko";}catch{return"ko";}})();
const ui=({ko:["점판을 준비하고 있어요.","점판을 불러오지 못했어요.","다시 불러오기"],en:["Preparing the geoboard.","The geoboard could not load.","Try loading again"],zh:["正在准备钉板。","钉板加载失败。","重新加载"],ja:["ジオボードを準備しています。","ジオボードを読み込めませんでした。","読み込み直す"]})[language]||["점판을 준비하고 있어요.","점판을 불러오지 못했어요.","다시 불러오기"];
if(params.get("activity")==="one-stroke"){
  document.querySelector(".yard-shell").hidden=true;
  document.querySelector(".yard-shell").style.display="none";
  document.body.classList.add("one-stroke-active");
  const root=document.createElement("main");root.id="oneStroke";document.body.append(root);
  root.className="os-fatal";root.textContent=ui[0];
  try{
    await new Promise((resolve,reject)=>{const css=document.createElement("link");css.rel="stylesheet";css.href=new URL("./one-stroke/styles.css?v=euler-1",import.meta.url);css.onload=resolve;css.onerror=reject;document.head.append(css);});
    const {mount}=await import("./one-stroke/app.js?v=euler-1");await mount(root);
  }catch{
    root.className="os-fatal";root.textContent=ui[1]+" ";const button=document.createElement("button");button.textContent=ui[2];button.onclick=()=>location.reload();root.append(button);
  }
}else{
  const link=document.createElement("a");link.href="?activity=one-stroke";link.className="level-button";
  link.style.cssText="display:flex;align-items:center;justify-content:center;min-height:44px;margin-top:12px;text-decoration:none";
  link.textContent=({ko:"한붓그리기",en:"One-Stroke Drawing",zh:"一笔画",ja:"一筆書き"})[language]||"한붓그리기";
  document.querySelector("#levelList").after(link);
  const shell=document.querySelector(".yard-shell");shell.inert=true;shell.setAttribute("aria-busy","true");
  try{
    await import("./app.js?v=geoboard-10");shell.dataset.activityReady="true";
  }catch{
    shell.textContent=ui[1]+" ";const button=document.createElement("button");button.textContent=ui[2];button.onclick=()=>location.reload();shell.append(button);
  }finally{shell.inert=false;shell.removeAttribute("aria-busy");}
}
