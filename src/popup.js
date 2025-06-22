document.getElementById('openPage').addEventListener('click', function() {
    chrome.tabs.create({ url: chrome.runtime.getURL('settings.html') });
});

