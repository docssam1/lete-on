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

/* 교재 PDF 저장 UX 보강: 이미지 준비 완료 후 인쇄 대화상자를 연다. */
(function setupPdfSaveExperience(){
  const STYLE_ID = "gfield-pdf-save-style";
  const OVERLAY_ID = "gfield-pdf-save-overlay";

  function installStyle(){
    if(document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #${OVERLAY_ID}{position:fixed;inset:0;z-index:2147483647;display:none;align-items:center;justify-content:center;padding:24px;background:rgba(8,18,31,.72);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
      #${OVERLAY_ID}.show{display:flex}
      #${OVERLAY_ID} .pdf-save-card{width:min(360px,92vw);padding:30px 24px 26px;border:1px solid rgba(214,170,40,.55);border-radius:20px;background:linear-gradient(180deg,#fff,#f4f7fa);box-shadow:0 28px 80px rgba(0,0,0,.32);text-align:center;color:#14283e;font-family:'Noto Sans KR',sans-serif}
      #${OVERLAY_ID} .pdf-save-spinner{width:54px;height:54px;margin:0 auto 18px;border:5px solid #e3e9ef;border-top-color:#d6aa28;border-right-color:#8f6400;border-radius:50%;animation:gfieldPdfSpin .85s linear infinite}
      #${OVERLAY_ID} .pdf-save-sparkles{height:18px;margin-bottom:5px;color:#b17b00;font-size:17px;letter-spacing:8px;animation:gfieldPdfSparkle 1.1s ease-in-out infinite}
      #${OVERLAY_ID} .pdf-save-title{font-size:20px;font-weight:900;letter-spacing:-.03em}
      #${OVERLAY_ID} .pdf-save-desc{margin-top:9px;color:#627187;font-size:13px;font-weight:700;line-height:1.65}
      #${OVERLAY_ID} .pdf-save-progress{margin-top:15px;color:#8f6400;font-size:12px;font-weight:900}
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
      <div class="pdf-save-card">
        <div class="pdf-save-sparkles">✦ ✧ ✦</div>
        <div class="pdf-save-spinner" aria-hidden="true"></div>
        <div class="pdf-save-title">PDF를 제작하고 있습니다</div>
        <div class="pdf-save-desc">교재 페이지를 선명하게 준비하고 있습니다.<br>잠시만 기다려 주세요.</div>
        <div class="pdf-save-progress" id="gfieldPdfSaveProgress">페이지 확인 중...</div>
      </div>`;
    document.body.appendChild(overlay);
    return overlay;
  }

  function waitForImage(image){
    if(image.complete && image.naturalWidth > 0) return Promise.resolve();
    return new Promise((resolve, reject) => {
      image.addEventListener("load", resolve, {once:true});
      image.addEventListener("error", () => reject(new Error("교재 페이지를 불러오지 못했습니다.")), {once:true});
    });
  }

  async function prepareAndPrint(button){
    const overlay = getOverlay();
    const progress = overlay.querySelector("#gfieldPdfSaveProgress");
    const images = Array.from(document.querySelectorAll("#viewer .book-page-img"));
    if(!images.length){
      alert("저장할 교재 페이지가 없습니다.");
      return;
    }

    const previousText = button.textContent;
    button.disabled = true;
    button.textContent = "준비 중...";
    overlay.classList.add("show");

    try{
      let completed = images.filter(img => img.complete && img.naturalWidth > 0).length;
      progress.textContent = `${completed} / ${images.length}쪽 준비 중`;
      await Promise.all(images.map(img => waitForImage(img).then(() => {
        completed += 1;
        progress.textContent = `${Math.min(completed, images.length)} / ${images.length}쪽 준비 중`;
      })));
      progress.textContent = "PDF 저장 화면을 열고 있습니다...";
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      overlay.classList.remove("show");
      window.print();
    }catch(error){
      overlay.classList.remove("show");
      alert(error.message || "PDF 준비 중 오류가 발생했습니다.");
    }finally{
      button.disabled = false;
      button.textContent = previousText;
    }
  }

  function patchButton(){
    installStyle();
    const button = document.getElementById("vPrintBtn");
    if(!button || button.dataset.pdfSaveReady === "1") return;
    button.dataset.pdfSaveReady = "1";
    button.textContent = "⬇ PDF로 저장하기";
    button.title = "교재를 PDF 파일로 저장합니다";
    button.removeAttribute("onclick");
    button.addEventListener("click", event => {
      event.preventDefault();
      prepareAndPrint(button);
    });
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", patchButton, {once:true});
  }else{
    patchButton();
  }
  window.addEventListener("load", patchButton, {once:true});
})();
