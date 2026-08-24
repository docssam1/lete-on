"use strict";
/* ---------- Start ---------- */
window.addEventListener("resize",()=>{if($("#extremaPanel").classList.contains("active"))drawExtremaGraph();if($("#integralPanel").classList.contains("active")&&!$("#integrationResult").classList.contains("hidden"))drawIntegralGraph()});
analyzeExtrema();renderIntegralEditor();
if(INITIAL_PANEL==="testPanel")openPanel("testPanel");else if(INITIAL_PANEL==="integralPanel")openPanel("integralPanel");else if(INITIAL_PANEL==="conditionPanel")openPanel("conditionPanel");
