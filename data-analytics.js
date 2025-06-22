let currentDate = new Date(); // Initialize current date

// Update the date displayed on the page
function updateDateDisplay() {
    const dateString = currentDate.toISOString().split('T')[0]; // Format as "YYYY-MM-DD"
    document.getElementById('currentDate').textContent = dateString;
    fetchDataForDate(dateString);
}

// Navigate to the previous day
document.getElementById('prevDate').addEventListener('click', function() {
    currentDate.setDate(currentDate.getDate() - 1); // Subtract one day
    updateDateDisplay();
});

// Navigate to the next day
document.getElementById('nextDate').addEventListener('click', function() {
    currentDate.setDate(currentDate.getDate() + 1); // Add one day
    updateDateDisplay();
});

// Fetch data from Chrome Local Storage
function fetchDataForDate(dateKey) {
    console.log('Fetching Data for Date: ' + dateKey);

    chrome.storage.local.get(['dataBaseYTB'], function(result) {
        if (result.dataBaseYTB) {
            // If data exists in local storage, use it
            console.log(result.dataBaseYTB);
            console.log(dateKey)
            visualizeData(result.dataBaseYTB, dateKey); // Pass dateKey to visualizeData
        }
        else{
        	console.log(false);
        }
    });
}

console.log(chrome);

function visualizeData(data,dateKey) {
    console.log('Visualizing Data: ', data);

    // Assuming data is structured like this: { "2024-11-15": { "Channel A": 30, "Channel B": 45 } }

    const channels = Object.keys(data[dateKey]);
    const watchTimesInSeconds = channels.map(channel => data[dateKey][channel]);
    const watchTimesInMinutes = watchTimesInSeconds.map(time => time / 60); // Convert seconds to minutes

    // Total Time Calculation (in seconds, converted to hours, minutes, and seconds)
    const totalWatchTimeInSeconds = watchTimesInSeconds.reduce((acc, time) => acc + time, 0);
    const hours = Math.floor(totalWatchTimeInSeconds / 3600);
    const minutes = Math.floor((totalWatchTimeInSeconds % 3600) / 60);
    const seconds = totalWatchTimeInSeconds % 60;
    const totalTimeFormatted = `${hours} hrs ${minutes} mins ${seconds} secs`;

    // Display Total Time on Page
    const totalTimeElement = document.getElementById('totalTime');
    totalTimeElement.innerHTML = `<h2 class="text-xl font-semibold text-center">Total Time Watched: ${totalTimeFormatted}</h2>`;

    // Helper function to destroy an existing chart before creating a new one
    function destroyChart(chart) {
        if (chart && chart.destroy) {
            chart.destroy();
        }
    }

    // Pie Chart for Content Breakdown
    const ctx1 = document.getElementById('contentBreakdownChart').getContext('2d');
    if (window.contentBreakdownChart) destroyChart(window.contentBreakdownChart);  // Destroy previous chart if it exists
    window.contentBreakdownChart = new Chart(ctx1, {
        type: 'pie',
        data: {
            labels: channels,
            datasets: [{
                label: 'Content Breakdown',
                data: watchTimesInMinutes, // Use minutes
                backgroundColor: ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff'],
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
            },
        }
    });

    // Bar Chart for Watch Time
    const ctx2 = document.getElementById('watchTimeChart').getContext('2d');
    if (window.watchTimeChart) destroyChart(window.watchTimeChart);  // Destroy previous chart if it exists
    window.watchTimeChart = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: channels,
            datasets: [{
                label: 'Watch Time (minutes)',
                data: watchTimesInMinutes, // Use minutes
                backgroundColor: '#ff9f00',
                borderColor: '#ff9f00',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Line Graph for Watch Time Trends (per Channel)
    const ctx3 = document.getElementById('lineGraph').getContext('2d');
    if (window.lineGraph) destroyChart(window.lineGraph);  // Destroy previous chart if it exists
    window.lineGraph = new Chart(ctx3, {
        type: 'line',
        data: {
            labels: channels,
            datasets: [{
                label: 'Watch Time Trend',
                data: watchTimesInMinutes, // Use minutes
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: '#ff9f00',
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Time Graph (Total Time) - Just display the total time for the day
    const ctx4 = document.getElementById('totalTimeGraph').getContext('2d');
    if (window.totalTimeGraph) destroyChart(window.totalTimeGraph);  // Destroy previous chart if it exists
    window.totalTimeGraph = new Chart(ctx4, {
        type: 'doughnut',
        data: {
            labels: ['Total Time'],
            datasets: [{
                label: 'Total Watch Time',
                data: [totalWatchTimeInSeconds], // Total seconds for visualization
                backgroundColor: ['#ffadad'],
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
            },
        }
    });

    // Dynamically Display Data Details
    const detailsContainer = document.getElementById('details');
    detailsContainer.innerHTML = '';  // Clear previous content
    channels.forEach((channel, index) => {
        const channelInfo = document.createElement('div');
        channelInfo.classList.add('bg-white', 'p-4', 'rounded-lg', 'shadow-md', 'w-48', 'text-center');
        channelInfo.innerHTML = `
            <h3 class="font-semibold text-lg">${channel}</h3>
            <p class="text-sm text-gray-600">Watch Time: ${watchTimesInMinutes[index]} mins</p>
        `;
        detailsContainer.appendChild(channelInfo);
    });
}


updateDateDisplay();

