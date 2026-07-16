import { COPY_BUILD_LEVELS, getCopyBuildLevel } from "./copy-build-levels.js";
import { captureBuildCanvas } from "./capture-build.js";

const params = new URLSearchParams(window.location.search);
const requestedLevel = Math.min(5, Math.max(1, Number(params.get("level")) || 1));
const level = getCopyBuildLevel(requestedLevel);

const levelOptions = document.querySelector("#levelOptions");
const levelDialog = document.querySelector("#levelDialog");
const modeTitle = document.querySelector("#modeTitle");
const instruction = document.querySelector("#instruction");
const targetView = document.querySelector(".target-view");
const buildView = document.querySelector(".build-view");
const checkButton = document.querySelector("#checkAnswer");
const nextButton = document.querySelector("#nextStep");
const captureButton = document.querySelector("#captureBuild");
const toast = document.querySelector("#toast");

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function levelDescription(item) {
  switch (item.level) {
    case 1:
      return "원목 정육면체로 기초 모양을 따라 쌓아요.";
    case 2:
      return "원목 정육면체로 3×3×3 범위까지 쌓아요.";
    case 3:
      return "컬러 3×3×3과 원목 4×4×4 문제를 풀어요.";
    case 4:
      return "직육면체의 위치와 방향을 똑같이 맞춰요.";
    case 5:
      return "정육면체와 직육면체로 여러 모양을 만들고 촬영해요.";
    default:
      return "";
  }
}

function enhanceLevelPicker() {
  if (!levelOptions) return;

  const render = () => {
    levelOptions.replaceChildren();

    COPY_BUILD_LEVELS.forEach((item) => {
      const link = document.createElement("a");
      link.className = "copy-level-card";
      link.href = `?level=${item.level}`;
      link.dataset.level = String(item.level);
      if (item.level === requestedLevel) link.classList.add("active");

      const number = document.createElement("strong");
      number.textContent = `LEVEL ${item.level}`;

      const title = document.createElement("b");
      title.textContent = item.title;

      const description = document.createElement("small");
      description.textContent = levelDescription(item);

      link.append(number, title, description);
      levelOptions.appendChild(link);
    });
  };

  const observer = new MutationObserver(() => {
    if (!levelOptions.querySelector(".copy-level-card")) render();
  });
  observer.observe(levelOptions, { childList: true });
  queueMicrotask(render);
}

function applyCreativeMode() {
  document.body.dataset.copyBuildLevel = String(level.level);

  if (level.mode !== "creative") return;

  modeTitle && (modeTitle.textContent = "여러 가지 모양 만들기");
  instruction && (instruction.textContent = "블록을 자유롭게 배치하고, 원하는 각도에서 작품을 사진으로 남겨 보세요.");
  targetView?.setAttribute("hidden", "");
  buildView?.classList.add("creative-view");
  checkButton?.setAttribute("hidden", "");
  nextButton?.setAttribute("hidden", "");
  captureButton?.removeAttribute("hidden");
}

async function captureCurrentBuild() {
  const canvas = document.querySelector("#buildCanvas canvas");
  if (!(canvas instanceof HTMLCanvasElement)) {
    showToast("작품 화면을 아직 준비하고 있어요.");
    return;
  }

  captureButton.disabled = true;
  try {
    await captureBuildCanvas(canvas, {
      filename: `gfield-my-build-${Date.now()}.png`,
      shareText: "GFIELD Geometry World에서 만든 입체 작품"
    });
    showToast("작품 사진을 만들었어요!");
  } catch (error) {
    if (error?.name !== "AbortError") {
      console.error(error);
      showToast("사진을 만들지 못했어요. 다시 시도해 주세요.");
    }
  } finally {
    captureButton.disabled = false;
  }
}

enhanceLevelPicker();
applyCreativeMode();
captureButton?.addEventListener("click", captureCurrentBuild);
