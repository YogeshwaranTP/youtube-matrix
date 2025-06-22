const video = document.querySelector('video');
let startTime = null;
const todayDate = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD' format

// Get the stored time for today or initialize it
chrome.storage.local.get([`watchedTime_${todayDate}`, 'startTime'], (result) => {
    let totalTimeWatchedToday = result[`watchedTime_${todayDate}`] || 0;
    if (result.startTime) {
        startTime = result.startTime;
    }

    function startTimer() {
        if (!startTime) {
            startTime = Date.now();
            chrome.storage.local.set({ startTime }); // Persist start time in chrome storage
            console.log('Video started playing at:', new Date(startTime).toLocaleTimeString());
        }
    }

    function stopTimer() {
        if (startTime) {
            totalTimeWatchedToday += Date.now() - startTime;
            startTime = null;
            chrome.storage.local.remove('startTime'); // Clear stored start time
            chrome.storage.local.set({ [`watchedTime_${todayDate}`]: totalTimeWatchedToday }); // Update the total time in chrome storage
            console.log('Video stopped. Time watched this session:', totalTimeWatchedToday / 1000, 'seconds');
            console.log('Total time watched today:', totalTimeWatchedToday / 1000, 'seconds');
        }
    }

    video.addEventListener('play', startTimer);
    video.addEventListener('pause', stopTimer);
    video.addEventListener('ended', stopTimer);

    function logWatchedTime() {
        console.log('Total time spent watching videos today:', totalTimeWatchedToday / 1000, 'seconds');
    }

    // Log the watched time periodically
    setInterval(logWatchedTime, 10000); // Every 10 seconds

    window.addEventListener('beforeunload', () => {
        stopTimer(); // Ensure time is logged when the page is unloaded
    });
});

