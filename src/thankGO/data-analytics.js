// Visualize Data from Local Storage (dataBaseYTB)


console.log('sd');
// Fetch data from Chrome Local Storage
chrome.storage.local.get(['dataBaseYTB'], function(result) {
console.log(result);
  if (result.dataBaseYTB) {
    // Use result.dataBaseYTB here
    console.log(result.dataBaseYTB);
    console.log('sd');
    
    visualizeData(result.dataBaseYTB);
  }
});



function visualizeData(data) {
    // Assuming `data` has the following structure:
    // { "2024-11-15": { "Channel A": 30, "Channel B": 45 } }
console.log(data);
    const channels = Object.keys(data["2024-11-15"]);
    const watchTimes = channels.map(channel => data["2024-11-15"][channel]);
	
    // Pie Chart for Content Breakdown
    const ctx1 = document.getElementById('contentBreakdownChart').getContext('2d');
    const contentBreakdownChart = new Chart(ctx1, {
        type: 'pie',
        data: {
            labels: channels,
            datasets: [{
                label: 'Content Breakdown',
                data: watchTimes,
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
    const watchTimeChart = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: channels,
            datasets: [{
                label: 'Watch Time (minutes)',
                data: watchTimes,
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

    // Dynamically Display Data Details
    const detailsContainer = document.getElementById('details');
    detailsContainer.innerHTML = '';
    channels.forEach((channel, index) => {
        const channelInfo = document.createElement('div');
        channelInfo.classList.add('bg-white', 'p-4', 'rounded-lg', 'shadow-md', 'w-48', 'text-center');
        channelInfo.innerHTML = `
            <h3 class="font-semibold text-lg">${channel}</h3>
            <p class="text-sm text-gray-600">Watch Time: ${watchTimes[index]} mins</p>
        `;
        detailsContainer.appendChild(channelInfo);
    });
}

