// Grab elements from DOM
const trackerCheckbox = document.getElementById('enable-tracker');
const channelInput = document.getElementById('channel-input');
const addChannelBtn = document.getElementById('add-channel-btn');
const channelList = document.getElementById('channel-list');

// Tracker state
let isTrackingEnabled = false;
let channels = [];

// Toggle tracker state
trackerCheckbox.addEventListener('change', function() {
    isTrackingEnabled = trackerCheckbox.checked;
    alert(isTrackingEnabled ? 'Tracker Enabled' : 'Tracker Disabled');
});

// Add channel to the whitelist
function addChannel() {
    const channelName = channelInput.value.trim();
    if (channelName && !channels.includes(channelName)) {
        channels.push(channelName);
        displayChannels();
        channelInput.value = ''; // Clear input field
    }
}

// Remove channel from the whitelist
function removeChannel(channelName) {
    channels = channels.filter(ch => ch !== channelName);
    displayChannels();
}

// Display whitelisted channels
function displayChannels() {
    channelList.innerHTML = ''; // Clear the list
    channels.forEach(channel => {
        const li = document.createElement('li');
        li.className = 'channel-item';
        li.innerHTML = `
            ${channel}
            <button class="remove-button" onclick="removeChannel('${channel}')">Remove</button>
        `;
        channelList.appendChild(li);
    });
}

