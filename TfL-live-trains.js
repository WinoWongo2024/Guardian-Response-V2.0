// Base URL for your GitHub-hosted JSON files
const baseUrl = 'https://winowongo2024.github.io/Guardian-Response-V2.0/data/';

// Function to fetch JSON data for a specific train line
async function fetchTrainData(line) {
    const response = await fetch(`${baseUrl}${line}.json`);
    const data = await response.json();
    return data;
}

// Populate departures and arrivals dynamically based on fetched data
async function populateTrains() {
    const lines = ['bakerloo', 'central', 'circle', 'district', 'hammer+city', 'jubilee', 'metropolitan', 'northern', 'piccadilly', 'victoria', 'waterloo+city'];
    
    // Loop through each line and fetch the corresponding JSON data
    for (const line of lines) {
        const trainData = await fetchTrainData(line);
        
        // Populate departures
        document.querySelector(`.departure-list[data-line="${line}"]`).innerHTML = trainData.departures.map(time => `<p>${time}</p>`).join('');
        
        // Populate arrivals
        document.querySelector(`.arrival-list[data-line="${line}"]`).innerHTML = trainData.arrivals.map(time => `<p>${time}</p>`).join('');
    }
}

// Show detailed information when clicking on a train service
document.querySelectorAll(".departure-list, .arrival-list").forEach(element => {
    element.addEventListener("click", function() {
        const detailContainer = document.getElementById("detail-container");
        detailContainer.style.display = "block";
        
        // Dummy detailed info (replace with real data if available)
        document.querySelector(".service-status").textContent = "On Time";
        document.querySelector(".platform-info").textContent = "Platform 3";
        document.querySelector(".stops").textContent = "Stops at: Paddington, Oxford Circus, Bank, King's Cross";
    });
});

// Hide the detail container when clicking outside
document.addEventListener("click", function(event) {
    const detailContainer = document.getElementById("detail-container");
    if (!detailContainer.contains(event.target) && !event.target.classList.contains("departure-list") && !event.target.classList.contains("arrival-list")) {
        detailContainer.style.display = "none";
    }
});

// Search functionality for stations
document.getElementById("search-btn").addEventListener("click", function() {
    const searchTerm = document.getElementById("station-search").value.toLowerCase();
    const lines = document.querySelectorAll(".line-section");

    lines.forEach(line => {
        const lineName = line.querySelector("h2").innerText.toLowerCase();
        if (lineName.includes(searchTerm)) {
            line.style.display = "block";
        } else {
            line.style.display = "none";
        }
    });
});

// Call the populate function on page load
window.onload = populateTrains;
