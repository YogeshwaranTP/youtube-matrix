// Fetch the data from Chrome storage
chrome.storage.local.get("dataBaseYTB", function(result) {
    const data = result.dataBaseYTB || {};
    console.log("Fetched data from Chrome storage:", data);

    // If data exists, display the analytics
    if (Object.keys(data).length > 0) {
        visualizeData(data);
    } else {
        console.error("No data found.");
    }
});

// Function to visualize the data using Chart.js
function visualizeData(data) {
    try {
        // Prepare data for line chart (total time per day)
        const dates = Object.keys(data);
        const totalTimeData = dates.map(date => {
            return data[date].reduce((total, channelData) => {
                return total + Object.values(channelData)[0]; // Sum the time spent
            }, 0);
        });

        // Prepare data for bar chart (time spent per channel per day)
        const channelsPerDayData = dates.map(date => {
            const channels = data[date].map(channelData => {
                const channelName = Object.keys(channelData)[0];
                const timeSpent = Object.values(channelData)[0];
                return { label: channelName, value: timeSpent };
            });
            return channels;
        });

        console.log('Total Time Per Day:', totalTimeData);
        console.log('Time Per Channel Per Day:', channelsPerDayData);

        // Line chart for total time spent per day
        const ctxLine = document.getElementById('lineChart').getContext('2d');
        new Chart(ctxLine, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Total Time Spent (seconds)',
                    data: totalTimeData,
                    borderColor: 'rgb(75, 192, 192)',
                    fill: false,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: { display: true, text: 'Date' }
                    },
                    y: {
                        title: { display: true, text: 'Time (Seconds)' },
                        beginAtZero: true
                    }
                }
            }
        });

        // Bar chart for time spent per channel on a specific day (display the first day as example)
        const firstDayChannels = channelsPerDayData[0];
        const labels = firstDayChannels.map(channel => channel.label);
        const timeSpent = firstDayChannels.map(channel => channel.value);

        const ctxBar = document.getElementById('barChart').getContext('2d');
        new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Time Spent per Channel',
                    data: timeSpent,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgb(75, 192, 192)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: { display: true, text: 'Channel' }
                    },
                    y: {
                        title: { display: true, text: 'Time (Seconds)' },
                        beginAtZero: true
                    }
                }
            }
        });

    } catch (error) {
        console.error("Error visualizing data:", error.message, error.stack);
    }
}

