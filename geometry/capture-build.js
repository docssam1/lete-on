function canvasToBlob(canvas, type = "image/png", quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("이미지를 만들지 못했습니다."));
    }, type, quality);
  });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export async function captureBuildCanvas(canvas, options = {}) {
  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new TypeError("캡처할 Three.js 캔버스가 필요합니다.");
  }

  const {
    filename = `gfield-build-${new Date().toISOString().slice(0, 10)}.png`,
    shareTitle = "GFIELD Geometry World",
    shareText = "내가 만든 입체 작품",
    preferShare = true
  } = options;

  const blob = await canvasToBlob(canvas);
  const file = new File([blob], filename, { type: blob.type || "image/png" });

  if (
    preferShare &&
    navigator.share &&
    navigator.canShare?.({ files: [file] })
  ) {
    await navigator.share({ title: shareTitle, text: shareText, files: [file] });
    return { method: "share", file };
  }

  downloadBlob(blob, filename);
  return { method: "download", file };
}
