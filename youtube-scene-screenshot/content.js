let lastImageData = null;

function getFrameData(video) {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function hasSceneChanged(current, previous, threshold = 0.15) {
  if (!current || !previous) return false;

  let diff = 0;
  for (let i = 0; i < current.data.length; i += 4) {
    const rDiff = Math.abs(current.data[i] - previous.data[i]);
    const gDiff = Math.abs(current.data[i + 1] - previous.data[i + 1]);
    const bDiff = Math.abs(current.data[i + 2] - previous.data[i + 2]);
    if (rDiff + gDiff + bDiff > 50) {
      diff++;
    }
  }

  const totalPixels = current.data.length / 4;
  return diff / totalPixels > threshold;
}

function captureIfSlideChanged() {
  const video = document.querySelector("video");
  if (!video || video.paused) return;

  const currentImageData = getFrameData(video);

  if (hasSceneChanged(currentImageData, lastImageData)) {
    chrome.runtime.sendMessage({ action: "capture" });
  }

  lastImageData = currentImageData;
}

setInterval(() => {
  chrome.storage.local.get(["enabled"], (result) => {
    if (result.enabled) {
      captureIfSlideChanged();
    }
  });
}, 1000);
