// Base URL for your GitHub-hosted JSON files
const baseUrl = 'https://winowongo2024.github.io/Guardian-Response-V2.0/data/';

// Function to fetch JSON data for a specific train line
async function fetchTrainData(line) {
    const response = await fetch(`${baseUrl}${line}.json`);
    const data = await response.json();
    return data;
}

// Function to get the current time from the internet (fallback to local time if API fails)
async function getCurrentTime() {
    try {
        const response = await fetch('https://worldtimeapi.org/api/ip');
        const data = await response.json();
        return new Date(data.datetime); // Fetches time from the internet
    } catch (error) {
        console.error('Error fetching internet time, using local time instead', error);
        return new Date(); // Fall back to local time if the API request fails
    }
}

// Helper function to check if the time is at least 10 minutes ahead of the current time
function isAtLeast10MinutesAhead(trainTime, currentTime) {
    const timeDifference = (trainTime - currentTime) / (1000 * 60); // Convert difference to minutes
    return timeDifference >= 10; // Check if the time is at least 10 minutes ahead
}

// Function to parse train times from strings (e.g., "05:00") and return a Date object for today
function parseTrainTime(timeString, currentDate) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), hours, minutes);
}

// Function to randomly assign a status and potentially adjust time
function randomizeStatus(train) {
    const statuses = ["On Time", "Delayed", "Early"];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    // Randomly adjust the time if the train is Delayed or Early
    if (randomStatus === "Delayed") {
        const delayMinutes = Math.floor(Math.random() * 5) + 1; // Delay by 1 to 5 minutes
        const [hours, minutes] = train.time.split(':').map(Number);
        const delayedTime = new Date();
        delayedTime.setHours(hours, minutes + delayMinutes);
        train.adjusted_time = delayedTime.toTimeString().slice(0, 5); // Format as "HH:MM"
    } else if (randomStatus === "Early") {
        const earlyMinutes = Math.floor(Math.random() * 5) + 1; // Early by 1 to 5 minutes
        const [hours, minutes] = train.time.split(':').map(Number);
        const earlyTime = new Date();
        earlyTime.setHours(hours, minutes - earlyMinutes);
        train.adjusted_time = earlyTime.toTimeString().slice(0, 5); // Format as "HH:MM"
    }

    train.status = randomStatus;
}

// Function to filter and render train times
function renderTrainTimes(container, trains, currentTime) {
    const upcomingTrains = trains.filter(train => {
        // Randomize the status and possibly adjust the time
        randomizeStatus(train);

        const trainTime = train.adjusted_time ? parseTrainTime(train.adjusted_time, currentTime) : parseTrainTime(train.time, currentTime);
        return isAtLeast10MinutesAhead(trainTime, currentTime);
    });

    if (upcomingTrains.length === 0) {
        container.innerHTML = '<p>There are no scheduled trains</p>';
    } else {
        container.innerHTML = upcomingTrains.map(train => {
            const displayTime = train.adjusted_time || train.time;
            return `<p>${train.station} - ${displayTime} (${train.status})</p>`;
        }).join('');
    }
}

// Populate departures and arrivals dynamically based on fetched data and current time
async function populateTrains() {
    const currentTime = await getCurrentTime(); // Fetch the current internet time
    const lines = ['bakerloo']; // Add more lines as needed, or loop through them dynamically
    
    for (const line of lines) {
        const trainData = await fetchTrainData(line);
        
        // Assuming it's Monday to Friday for now (you can add logic for other days if needed)
        const departures = trainData.Bakerloo.MondayToFriday.departures;
        const arrivals = trainData.Bakerloo.MondayToFriday.arrivals;
        
        // Get the containers for departures and arrivals
        const departureContainer = document.querySelector(`.departure-list[data-line="${line}"]`);
        const arrivalContainer = document.querySelector(`.arrival-list[data-line="${line}"]`);
        
        // Render departures and arrivals, showing "There are no scheduled trains" if empty or not 10 mins ahead
        renderTrainTimes(departureContainer, departures, currentTime);
        renderTrainTimes(arrivalContainer, arrivals, currentTime);
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
