// Your YouTube Data API key
const apiKey = 'AIzaSyAU0sit32xHRHI_JzhjdBzrDWD6j1zIobM';

// Listener for when a tab is updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Check if the tab is fully loaded
    if (changeInfo.status === 'complete' && tab.url) {
        // Check if the URL is a YouTube watch page
        if (isYouTubeWatchPage(tab.url)) {
            const videoId = extractVideoId(tab.url);
            if (videoId) {
                // Call the YouTube API to get channel information
                getChannelName(videoId, tabId);
            }
        }
    }
});

// Function to check if the current page is a YouTube watch page
function isYouTubeWatchPage(url) {
    return url.includes('youtube.com/watch');
}

// Function to extract the video ID from the URL
function extractVideoId(url) {
    const urlParams = new URL(url).searchParams;
    return urlParams.get('v'); // Get the video ID from the URL
}

// Function to get the channel name and category from the YouTube API
function getChannelName(videoId, tabId) {
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.items && data.items.length > 0) {
                const channelName = data.items[0].snippet.channelTitle; // Extract channel name
                const categoryId = data.items[0].snippet.categoryId;   // Extract category ID
                console.log(`Channel Name: ${channelName}`); // Log channel name
                 console.log(`Channel category: ${categoryId}`);

                // Retrieve toggle states from local storage
                chrome.storage.sync.get('nuclearModeEnabled', function(data) {
                    const blockToggle = data.nuclearModeEnabled;
                    console.log("blackList MODE:ON");
                    checkblacklist(channelName, tabId); // Check against blacklist
		    
		    
                    if (blockToggle) {
                        console.log("whitelist MODE:ON");
                        
                        
                        checkWhitelistCategory(categoryId).then((isCategoryAllowed) => {
        if (isCategoryAllowed) {
            // If the category is allowed, send 'allowContent'
            chrome.tabs.sendMessage(tabId, { action: 'allowContent' });
        } else {
            // If the category is not allowed, check the channel whitelist synchronously
                                    checkwhitelist(channelName, tabId); // Check against whitelist	
            
        }
    });

                    } else {
                        console.log("blackList MODE:ON");
                        checkBlacklistCategory(categoryId, tabId); // Check category against whitelist
                        checkblacklist(channelName, tabId); // Check against blacklist

                    }
                    
                    
                });
            } else {
                console.log('No data found for this video ID.'); // Handle no data case
            }
        })
        .catch(error => {
            console.error('Error fetching channel name:', error); // Handle error case
        });
}

// Function to check if the channel is in the blacklist
function checkblacklist(channelName, tabId) {
    // Retrieve the blacklist from local storage
    chrome.storage.sync.get({ blacklist: [] }, function(data) {
        const blacklist = data.blacklist;
        console.log(blacklist);

        // Check if the channel is in the blacklist
        if (channelName && blacklist.includes(channelName)) {
            console.log(`Channel "${channelName}" is in the blacklist.`); // Debug: In blacklist
            // Send message to content.js to block the content
            chrome.tabs.sendMessage(tabId, { action: 'blockContent' });
        } else {
            console.log(`Channel "${channelName}" is not in the blacklist.`); // Debug: Not in blacklist
            // Send message to content.js to allow the content
            chrome.tabs.sendMessage(tabId, { action: 'allowContent' });
        }
    });
}

// Function to check if the channel is in the whitelist
function checkwhitelist(channelName, tabId) {
    // Retrieve the whitelist from local storage
    chrome.storage.sync.get({ whitelist: [] }, function(data) {
        const whitelist = data.whitelist;
        console.log(whitelist);

        // Check if the channel is in the whitelist
        if (channelName && whitelist.includes(channelName)) {
            console.log(`Channel "${channelName}" is in the whitelist.`); // Debug: In whitelist
            chrome.tabs.sendMessage(tabId, { action: 'allowContent' });
        } else {
            console.log(`Channel "${channelName}" is not in the whitelist.`); // Debug: Not in whitelist
            chrome.tabs.sendMessage(tabId, { action: 'blockContent' });
        }
    });
}

// New function to check if the category is in the whitelist
// Provided category map (ID -> Name mapping)
const categoryMap = {
    "1": "Film & Animation",
    "2": "Autos & Vehicles",
    "10": "Music",
    "15": "Pets & Animals",
    "17": "Sports",
    "18": "Short Movies",
    "19": "Travel & Events",
    "20": "Gaming",
    "21": "Videoblogging",
    "22": "People & Blogs",
    "23": "Comedy",
    "24": "Entertainment",
    "25": "News & Politics",
    "26": "Howto & Style",
    "27": "Education",
    "28": "Science & Technology",
    "29": "Nonprofits & Activism",
    "30": "Movies",
    "31": "Anime/Animation",
    "32": "Action/Adventure",
    "33": "Classics",
    "34": "Comedy",
    "35": "Documentary",
    "36": "Drama",
    "37": "Family",
    "38": "Foreign",
    "39": "Horror",
    "40": "Sci-Fi/Fantasy",
    "41": "Thriller",
    "42": "Shorts",
    "43": "Shows",
    "44": "Trailers",
    // Add any other categories as needed...
};

// Function to check if the category is in the whitelist
function checkWhitelistCategory(categoryId) {
    return new Promise((resolve) => {
        // Retrieve the category whitelist from chrome.storage
        chrome.storage.sync.get({ categories: [] }, function (data) {
            const categories = data.categories || []; // Default to empty array if not set
            console.log('Category Whitelist:', categories);

            // Get the category name from the categoryMap using the categoryId
            const categoryName = categoryMap[categoryId];

            if (!categoryName) {
                console.log(`Category ID "${categoryId}" does not have a corresponding name in the dictionary.`);
                resolve(false); // Category does not exist, block content
                return;
            }

            console.log(`Category Name: ${categoryName}`); // Debug: Category name

            // Check if the category name is in the whitelist
            if (categories.includes(categoryName)) {
                console.log(`Category "${categoryName}" is in the whitelist.`); // Debug: In whitelist
                resolve(true); // Category is allowed
            } else {
                console.log(`Category "${categoryName}" is not in the whitelist.`); // Debug: Not in whitelist
                resolve(false); // Category is blocked
            }
        });
    });
}
function checkBlacklistCategory(categoryId, tabId) {
    // Retrieve the category whitelist from chrome.storage
    chrome.storage.sync.get({ categories1: [] }, function(data) {
        const categories = data.categories1 || []; // Default to empty array if not set
        console.log('Category Blacklist:', categories);

        // Get the category name from the categoryMap using the categoryId
        const categoryName = categoryMap[categoryId];

        if (!categoryName) {
            console.log(`Category ID "${categoryId}" does not have a corresponding name in the dictionary.`);
            chrome.tabs.sendMessage(tabId, { action: 'allowContent' });
            return;
        }

        console.log(`Category Name: ${categoryName}`); // Debug: Category name

        // Check if the category name is in the whitelist
        if (categories.includes(categoryName)) {
            console.log(`Category "${categoryName}" is in the blacklist.`); // Debug: In whitelist
            chrome.tabs.sendMessage(tabId, { action: 'blockContent' });
        } else {
            console.log(`Category "${categoryName}" is not in the blacklist.`); // Debug: Not in whitelist
            chrome.tabs.sendMessage(tabId, { action: 'allowContent' });
        }
    });
}


chrome.action.onClicked.addListener(function() {
    chrome.tabs.create({ url: chrome.runtime.getURL('settings.html') });
});



// Function to check window focus
let focusCheckInterval;

function checkFocus() {
  chrome.windows.getCurrent({ populate: true }, function (window) {
    const isFocused = window.focused;

    // Send message to content script based on focus
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTabId = tabs[0]?.id;

      if (activeTabId) {
        if (isFocused) {
          chrome.tabs.sendMessage(activeTabId, { action: 'startTimer' });
        } else {
          chrome.tabs.sendMessage(activeTabId, { action: 'stopTimer' });
        }
      }
    });
  });
}

// Run the focus check every 500ms
focusCheckInterval = setInterval(checkFocus, 500);

// Clear interval when the extension is disabled or closed
chrome.runtime.onSuspend.addListener(function () {
  clearInterval(focusCheckInterval);
});


