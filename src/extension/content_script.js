import { initializeSidebar } from './extension.jsx';

let sidebarRoot = null;
let fallacyMonitor = null;

const toggleSidebar = async () => {
  if (sidebarRoot) {
    console.log('[Fallacy Checker] Closing sidebar...');
    if (fallacyMonitor) {
      fallacyMonitor.stop();
      fallacyMonitor = null;
    }
    sidebarRoot.remove();
    sidebarRoot = null;
    return;
  }

  console.log('[Fallacy Checker] Opening sidebar...');
  sidebarRoot = document.createElement('div');
  sidebarRoot.id = 'fallacy-sidebar-root';
  document.body.appendChild(sidebarRoot);
  
  initializeSidebar(() => {
    if (fallacyMonitor) {
      fallacyMonitor.stop();
      fallacyMonitor = null;
    }
    sidebarRoot.remove();
    sidebarRoot = null;
  });
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[Fallacy Checker] Content script received:', request);
  
  if (request.action === "toggleSidebar") {
    toggleSidebar();
  }
});

// Listen for keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.altKey && e.key.toLowerCase() === 'f') {
    toggleSidebar();
  }
});

// Inject extension button into YouTube player
const injectPlayerButton = () => {
  const rightControls = document.querySelector('.ytp-right-controls');
  if (!rightControls || document.getElementById('fallacy-checker-button')) return;

  const button = document.createElement('button');
  button.id = 'fallacy-checker-button';
  button.className = 'ytp-button';
  button.setAttribute('aria-label', 'Check for Fallacies');
  button.setAttribute('title', 'Check for Fallacies');
  button.style.cssText = `
    background: transparent;
    border: none;
    cursor: pointer;
    width: 48px;
    height: 100%;
  `;

  button.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; transform: translateY(-12px);">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" stroke-width="2" stroke-linejoin="round"/>
        <path d="M2 17L12 22L22 17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M2 12L12 17L22 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  `;

  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSidebar();
  });

  const firstChild = rightControls.firstChild;
  if (firstChild) {
    rightControls.insertBefore(button, firstChild);
  } else {
    rightControls.appendChild(button);
  }
};

const observePlayer = () => {
  const observer = new MutationObserver(() => {
    if (!document.getElementById('fallacy-checker-button')) {
      injectPlayerButton();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  injectPlayerButton();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', observePlayer);
} else {
  observePlayer();
}