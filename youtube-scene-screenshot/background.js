chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ enabled: false });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "capture") {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, function (screenshotUrl) {
      const now = new Date();
      const timestamp = now.toISOString().replace(/[:.]/g, "-");
      const filename = `screenshot-${timestamp}.png`;

      chrome.downloads.download({
        url: screenshotUrl,
        filename: filename,
        saveAs: false
      });
    });
  }
});
