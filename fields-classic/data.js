/* =========================================================
 * 지필드 영재교육 · 필즈 더 클래식 대비 과정
 * 공용 데이터 파일 — 관리자 콘솔에서 자동 생성됨
 * 생성: 2026. 8. 4. 오후 7:34:21
 * ========================================================= */
window.GFIELD_FC_DATA = {
  "students": [
    "최연우",
    "김시윤",
    "전현준",
    "노관호",
    "DEMO",
    "남유준",
    "김리하",
    "gfield",
    "김채원",
    "전윤찬"
  ],
  "studentCode": {
    "최연윤": "GF8QSMMW",
    "최연우": "GFFSXPF6",
    "김시윤": "GFHGQCHC",
    "전현준": "GF49Y3Q7",
    "노관호": "GF8XLMHP",
    "DEMO": "GFLHCQA6",
    "김리하": "GF6SAAXH",
    "남유준": "GFBSDB6G",
    "gfield": "GFBF4J7X",
    "김채원": "GFHPEGHY",
    "전윤찬": "GFPNYS6Y"
  },
  "studentType": {
    "최연우": "internal",
    "김시윤": "internal",
    "전현준": "internal",
    "노관호": "online",
    "DEMO": "online",
    "남유준": "internal",
    "김리하": "online",
    "gfield": "internal",
    "김채원": "internal",
    "전윤찬": "internal"
  },
  "attendance": {
    "최연우": [
      "연산연습",
      "개념완성"
    ],
    "김시윤": [
      "개념완성",
      "연산연습"
    ],
    "전현준": [
      "개념완성",
      "연산연습"
    ],
    "노관호": [
      "개념완성",
      "진단모의고사",
      "킬러문항",
      "진단약점클리닉",
      "연산연습",
      "실전모의고사1회",
      "실전모의고사2회",
      "파이널모의고사1회",
      "파이널모의고사2회",
      "파이널모의고사4회"
    ],
    "DEMO": [
      "개념완성",
      "연산연습",
      "진단모의고사",
      "킬러문항",
      "진단약점클리닉",
      "실전모의고사1회"
    ],
    "남유준": [
      "연산연습",
      "개념완성"
    ],
    "김리하": [
      "개념완성",
      "연산연습",
      "킬러문항",
      "진단약점클리닉",
      "진단모의고사"
    ],
    "gfield": [
      "개념완성",
      "연산연습",
      "진단모의고사",
      "진단약점클리닉",
      "실전모의고사1회",
      "킬러문항",
      "실전모의고사2회",
      "실전모의고사3회"
    ],
    "김채원": [
      "개념완성",
      "연산연습"
    ],
    "전윤찬": [
      "개념완성",
      "연산연습"
    ]
  },
  "content": {
    "개념완성": {
      "notice": "",
      "homework": "",
      "textbooks": []
    },
    "진단모의고사": {
      "notice": "",
      "homework": "",
      "textbooks": []
    },
    "킬러문항": {
      "notice": "",
      "homework": "",
      "textbooks": []
    },
    "실전모의고사1회": {
      "notice": "",
      "homework": "",
      "textbooks": []
    },
    "실전모의고사2회": {
      "notice": "",
      "homework": "",
      "textbooks": []
    },
    "실전모의고사3회": {
      "notice": "",
      "homework": "",
      "textbooks": []
    },
    "실전모의고사4회": {
      "notice": "",
      "homework": "",
      "textbooks": []
    },
    "실전모의고사5회": {
      "notice": "",
      "homework": "",
      "textbooks": []
    },
    "실전모의고사6회": {
      "notice": "",
      "homework": "",
      "textbooks": []
    },
    "파이널모의고사1회": {
      "notice": "",
      "homework": "",
      "textbooks": []
    },
    "파이널모의고사2회": {
      "notice": "",
      "homework": "",
      "textbooks": []
    },
    "파이널모의고사3회": {
      "notice": "",
      "homework": "",
      "textbooks": []
    },
    "파이널모의고사4회": {
      "notice": "",
      "homework": "",
      "textbooks": []
    },
    "최종모의고사": {
      "notice": "",
      "homework": "",
      "textbooks": []
    },
    "연산연습": {
      "notice": "",
      "homework": "",
      "textbooks": []
    }
  },
  "archiveFolders": [],
  "archiveAccess": {},
  "books": []
};

/* 교재 PDF 직접 다운로드: Windows 인쇄창을 사용하지 않는다. */
(function setupDirectPdfDownload(){
  const STYLE_ID = "gfield-pdf-download-style";
  const OVERLAY_ID = "gfield-pdf-download-overlay";
  const JSPDF_URL = "https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js";

  function installStyle(){
    if(document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #${OVERLAY_ID}{position:fixed;inset:0;z-index:2147483647;display:none;align-items:center;justify-content:center;padding:24px;background:rgba(8,18,31,.76);backdrop-filter:blur(9px);-webkit-backdrop-filter:blur(9px)}
      #${OVERLAY_ID}.show{display:flex}
      #${OVERLAY_ID} .pdf-card{width:min(370px,92vw);padding:30px 24px 26px;border:1px solid rgba(214,170,40,.58);border-radius:20px;background:linear-gradient(180deg,#fff,#f4f7fa);box-shadow:0 28px 80px rgba(0,0,0,.34);text-align:center;color:#14283e;font-family:'Noto Sans KR',sans-serif}
      #${OVERLAY_ID} .pdf-spinner{width:56px;height:56px;margin:0 auto 17px;border:5px solid #e3e9ef;border-top-color:#d6aa28;border-right-color:#8f6400;border-radius:50%;animation:gfieldPdfSpin .82s linear infinite}
      #${OVERLAY_ID} .pdf-sparkles{height:20px;margin-bottom:5px;color:#b17b00;font-size:18px;letter-spacing:8px;animation:gfieldPdfSparkle 1.05s ease-in-out infinite}
      #${OVERLAY_ID} .pdf-title{font-size:20px;font-weight:900;letter-spacing:-.03em}
      #${OVERLAY_ID} .pdf-desc{margin-top:9px;color:#627187;font-size:13px;font-weight:700;line-height:1.65}
      #${OVERLAY_ID} .pdf-progress{margin-top:15px;color:#8f6400;font-size:12px;font-weight:900}
      @keyframes gfieldPdfSpin{to{transform:rotate(360deg)}}
      @keyframes gfieldPdfSparkle{0%,100%{opacity:.4;transform:scale(.94)}50%{opacity:1;transform:scale(1.08)}}
      @media print{#${OVERLAY_ID}{display:none!important}}
    `;
    document.head.appendChild(style);
  }

  function getOverlay(){
    let overlay = document.getElementById(OVERLAY_ID);
    if(overlay) return overlay;
    overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    overlay.setAttribute("role", "status");
    overlay.setAttribute("aria-live", "polite");
    overlay.innerHTML = `
      <div class="pdf-card">
        <div class="pdf-sparkles">✦ ✧ ✦</div>
        <div class="pdf-spinner" aria-hidden="true"></div>
        <div class="pdf-title">PDF를 제작하고 있습니다</div>
        <div class="pdf-desc">교재를 PDF 파일로 변환하고 있습니다.<br>완료되면 자동으로 다운로드됩니다.</div>
        <div class="pdf-progress" id="gfieldPdfProgress">준비 중...</div>
      </div>`;
    document.body.appendChild(overlay);
    return overlay;
  }

  function loadScript(src){
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if(existing){
        if(window.jspdf?.jsPDF){ resolve(); return; }
        existing.addEventListener("load", resolve, {once:true});
        existing.addEventListener("error", reject, {once:true});
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.addEventListener("load", resolve, {once:true});
      script.addEventListener("error", () => reject(new Error("PDF 제작 도구를 불러오지 못했습니다.")), {once:true});
      document.head.appendChild(script);
    });
  }

  function waitForImage(image){
    if(image.complete && image.naturalWidth > 0) return Promise.resolve(image);
    return new Promise((resolve, reject) => {
      image.addEventListener("load", () => resolve(image), {once:true});
      image.addEventListener("error", () => reject(new Error("교재 페이지를 불러오지 못했습니다.")), {once:true});
    });
  }

  function safeFileName(value){
    return String(value || "교재")
      .replace(/[\\/:*?"<>|]/g, "_")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 80) || "교재";
  }

  function renderPageCanvas(image, studentName){
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth || 1075;
    canvas.height = image.naturalHeight || 1521;
    const ctx = canvas.getContext("2d", {alpha:false});
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    const label = `${studentName || "학생"} 학생 · GFIELD`;
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(-34 * Math.PI / 180);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `900 ${Math.max(42, Math.round(canvas.width * 0.055))}px "Noto Sans KR", sans-serif`;
    ctx.fillStyle = "rgba(22,34,51,.14)";
    const gap = canvas.height * 0.24;
    ctx.fillText(label, 0, -gap);
    ctx.fillText(label, 0, 0);
    ctx.fillText(label, 0, gap);
    ctx.restore();
    return canvas;
  }

  async function downloadPdf(button){
    const overlay = getOverlay();
    const progress = overlay.querySelector("#gfieldPdfProgress");
    const images = Array.from(document.querySelectorAll("#viewer .book-page-img"));
    if(!images.length){
      alert("저장할 교재 페이지가 없습니다.");
      return;
    }

    const previousText = button.textContent;
    button.disabled = true;
    button.textContent = "PDF 제작 중...";
    overlay.classList.add("show");

    try{
      progress.textContent = "PDF 제작 도구를 준비하고 있습니다.";
      await loadScript(JSPDF_URL);
      if(!window.jspdf?.jsPDF) throw new Error("PDF 제작 도구를 실행할 수 없습니다.");

      progress.textContent = `0 / ${images.length}쪽 불러오는 중`;
      await Promise.all(images.map(waitForImage));

      const {jsPDF} = window.jspdf;
      const pdf = new jsPDF({orientation:"portrait", unit:"mm", format:"a4", compress:true});
      const studentName = document.getElementById("hName")?.textContent?.trim() || "학생";
      const bookTitle = document.getElementById("vTitle")?.textContent?.trim() || "필즈 더 클래식 교재";

      for(let index = 0; index < images.length; index += 1){
        progress.textContent = `${index + 1} / ${images.length}쪽 PDF 제작 중`;
        const canvas = renderPageCanvas(images[index], studentName);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
        if(index > 0) pdf.addPage("a4", "portrait");
        pdf.addImage(dataUrl, "JPEG", 0, 0, 210, 297, `page-${index + 1}`, "FAST");
        canvas.width = 1;
        canvas.height = 1;
        await new Promise(resolve => setTimeout(resolve, 0));
      }

      progress.textContent = "PDF 다운로드를 시작합니다.";
      const fileName = safeFileName(`${studentName}_${bookTitle}`) + ".pdf";
      pdf.save(fileName);
      progress.textContent = "다운로드가 완료되었습니다.";
      await new Promise(resolve => setTimeout(resolve, 700));
    }catch(error){
      alert(error?.message || "PDF 제작 중 오류가 발생했습니다.");
    }finally{
      overlay.classList.remove("show");
      button.disabled = false;
      button.textContent = previousText;
    }
  }

  function patchButton(){
    installStyle();
    const button = document.getElementById("vPrintBtn");
    if(!button || button.dataset.directPdfReady === "1") return;
    button.dataset.directPdfReady = "1";
    button.textContent = "⬇ PDF로 저장하기";
    button.title = "교재 PDF 파일을 바로 다운로드합니다";
    button.removeAttribute("onclick");
    button.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      downloadPdf(button);
    }, true);
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", patchButton, {once:true});
  }else{
    patchButton();
  }
  window.addEventListener("load", patchButton, {once:true});
})();