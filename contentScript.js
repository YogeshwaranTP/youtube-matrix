// Listener for messages from background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'blockContent') {
        // Logic to block content, e.g., redirecting to a blank page
window.location.href = chrome.runtime.getURL('blocked.html');

    } else if (message.action === 'allowContent') {
        // Logic to allow content, you can do nothing or perform some action
        console.log('This channel is allowed.');
    }
});
	
	
