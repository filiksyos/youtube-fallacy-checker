// background.js - Service worker for YouTube Fallacy Checker

async function handleToggleSidebar(tabId) {
  console.log('[Fallacy Checker] Toggling sidebar for tab:', tabId);
  try {
    await chrome.tabs.sendMessage(tabId, { action: "toggleSidebar" });
    console.log('[Fallacy Checker] Message sent successfully');
  } catch (error) {
    console.log('[Fallacy Checker] Error sending message:', error);
  }
}

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url?.includes("youtube.com")) {
    await handleToggleSidebar(tab.id);
  } else {
    console.log('[Fallacy Checker] Extension clicked on non-YouTube page:', tab.url);
  }
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command === "toggle-sidebar") {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.url?.includes("youtube.com")) {
      await handleToggleSidebar(tab.id);
    }
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[Fallacy Checker] Received message:', message);
  return true;
});