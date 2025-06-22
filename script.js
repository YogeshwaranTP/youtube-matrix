// Sample Data (You can replace this with actual fetched data)
const data = {
  "2024-11-15": {
    "Peter Santenello": 30,
    "Another Channel": 75,
    "Example Channel": 120
  }
};

const container = document.getElementById('channel-container');

Object.keys(data["2024-11-15"]).forEach(channel => {
  const timeSpent = data["2024-11-15"][channel];
  const totalTime = 300;  // You can adjust this depending on the max time for the circles
  
  // Calculate percentage
  const percentage = (timeSpent / totalTime) * 100;

  // Create circle element
  const circleDiv = document.createElement('div');
  circleDiv.classList.add('circle');

  // Create time spent text
  const timeText = document.createElement('div');
  timeText.classList.add('time-spent');
  timeText.textContent = `${timeSpent} mins`;

  // Create channel name text
  const channelText = document.createElement('div');
  channelText.classList.add('channel-name');
  channelText.textContent = channel;

  // Set conic gradient based on the time spent
  circleDiv.style.background = `conic-gradient(#ff4d00 0%, #ff4d00 ${percentage}%, #333 ${percentage}%)`;

  // Append to the container
  circleDiv.appendChild(timeText);
  circleDiv.appendChild(channelText);
  container.appendChild(circleDiv);
});

