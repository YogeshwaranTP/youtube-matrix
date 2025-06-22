// Function to validate the URL format
function isValidURL(givenURL) {
  if (givenURL) {
    if (givenURL.includes(".")) {
      return true;
    }
    return false;
  }
  return false;
}

// Function to format time in hours, minutes, and seconds
function secondsToString(seconds, compressed = false) {
  let hours = parseInt(seconds / 3600);
  seconds = seconds % 3600;
  let minutes = parseInt(seconds / 60);
  seconds = seconds % 60;
  let timeString = "";
  if (hours) {
    timeString += hours + " hrs ";
  }
  if (minutes) {
    timeString += minutes + " min ";
  }
  if (seconds) {
    timeString += seconds + " sec ";
  }
  if (!compressed) {
    return timeString;
  } else {
    if (hours) {
      return `${hours}h`;
    }
    if (minutes) {
      return `${minutes}m`;
    }
    if (seconds) {
      return `${seconds}s`;
    }
  }
}

// Function to get today's date in 'YYYY-MM-DD' format
function getDateString(nDate) {
  let nDateDate = nDate.getDate();
  let nDateMonth = nDate.getMonth() + 1;
  let nDateYear = nDate.getFullYear();
  if (nDateDate < 10) { nDateDate = "0" + nDateDate; }
  if (nDateMonth < 10) { nDateMonth = "0" + nDateMonth; }
  return nDateYear + "-" + nDateMonth + "-" + nDateDate;
}

// Function to extract the channel name from YouTube page
function getYouTubeChannelName() {
  const channelElement = document.querySelector('ytd-channel-name a');
  if (channelElement) {
    return channelElement.textContent.trim();
  }
  return null;
}

// Function to track the time spent on the channel
function updateTime() {
  let url = window.location.href;
  let channelName = getYouTubeChannelName();

  if (isValidURL(url) && channelName) {
    let today = new Date();
    let presentDate = getDateString(today);

    chrome.storage.local.get('dataBaseYTB', function (storedData) {
      let dataBaseYTB = storedData.dataBaseYTB || {};  // Default to an empty object if no data exists

      // If the present date doesn't exist in the database, create it
      if (!dataBaseYTB[presentDate]) {
        dataBaseYTB[presentDate] = {};
      }

      let timeSoFar = dataBaseYTB[presentDate][channelName] || 0;

      // Increment time and update the stored data
      timeSoFar++;
      dataBaseYTB[presentDate][channelName] = timeSoFar;

      // Save the updated data back to Chrome storage
      chrome.storage.local.set({ 'dataBaseYTB': dataBaseYTB }, function () {
        console.log(`Set time for channel "${channelName}" at ${dataBaseYTB[presentDate][channelName]} seconds`);
        console.log(`Time for ${channelName}: ${secondsToString(timeSoFar, true)}`);
      });
    });
  } else {
    console.log("Invalid URL or Channel Name not found.");
  }
}

// Function to handle play/pause state
function handlePlayPause() {
  const videoElement = document.querySelector('video');

  if (videoElement) {
    videoElement.onplay = () => {
      // Start the timer when the video plays
      if (!intervalID) {
        intervalID = setInterval(updateTime, 1000);
      }
    };

    videoElement.onpause = () => {
      // Stop the timer when the video is paused
      if (intervalID) {
        clearInterval(intervalID);
        intervalID = null;
      }
    };
  }
}

// Initialize the timer and play/pause handling
let intervalID = null;
handlePlayPause();

// Run the update function every second for active video
setInterval(() => {
  const videoElement = document.querySelector('video');
  if (videoElement && !videoElement.paused) {
    updateTime();
  }
}, 1000);

