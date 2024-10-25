// Base URL for your GitHub-hosted JSON files
const baseUrl = 'https://winowongo2024.github.io/Guardian-Response-V2.0/data/';

// Function to fetch JSON data for a specific train line
async function fetchTrainData(line) {
    try {
        const response = await fetch(`${baseUrl}${line}.json`);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${line} data. Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching train data for ${line}:`, error);
        return null;
    }
}

// Function to get the current time from the internet (fallback to local time if API fails)
async function getCurrentTime() {
    try {
        const response = await fetch('https://worldtimeapi.org/api/ip');
        if (!response.ok) {
            throw new Error(`Error fetching time: ${response.statusText}`);
        }
        const data = await response.json();
        return new Date(data.datetime); // Fetches time from the internet
    } catch (error) {
        console.error('Error fetching internet time, using local time instead:', error.message);
        return new Date(); // Fall back to local time if the API request fails
    }
}

// Function to check if the train time is within a window (e.g., within the next 60 minutes)
function isWithinTimeWindow(trainTime, currentTime, windowInMinutes = 60) {
    const timeDifference = (trainTime - currentTime) / (1000 * 60); // Convert difference to minutes
    return timeDifference >= 0 && timeDifference <= windowInMinutes; // Show trains within the next 'windowInMinutes'
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
    if (!Array.isArray(trains)) {
        console.error('Train data is not an array:', trains);
        container.innerHTML = '<p>Error loading train data</p>';
        return;
    }

    // Adjust the time window to display trains within the next 60 minutes
    const upcomingTrains = trains.filter(train => {
        // Use the existing or adjusted time
        const trainTime = train.adjusted_time ? parseTrainTime(train.adjusted_time, currentTime) : parseTrainTime(train.time, currentTime);
        return isWithinTimeWindow(trainTime, currentTime, 60); // Show trains within the next 60 minutes
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

// Function to set up audio and force it to play every minute
function playAudioEveryMinute() {
    const audio = new Audio('/TTS/This_is_a_Bakerloo_Line_train_starting_here_at_El.mp3');
    
    // Play audio immediately
    audio.play();

    // Play audio every minute (60,000 milliseconds)
    setInterval(() => {
        audio.play();
    }, 60000);
}

// Populate departures and arrivals dynamically based on fetched data and current time
async function populateTrains() {
    const currentTime = await getCurrentTime(); // Fetch the current internet time
    const lines = ['bakerloo']; // Assuming only Bakerloo for now, add more lines as needed

    for (const line of lines) {
        try {
            const trainData = await fetchTrainData(line);
            const savedTrainData = localStorage.getItem(`trainData_${line}`);

            let departures;
            if (savedTrainData) {
                // If data is stored in localStorage, use it
                departures = JSON.parse(savedTrainData);
            } else {
                // Randomize the data and save it to localStorage
                departures = trainData?.Bakerloo?.MondayToFriday?.departures;
                departures.forEach(train => randomizeStatus(train));

                // Store the data in localStorage
                localStorage.setItem(`trainData_${line}`, JSON.stringify(departures));
            }

            if (!departures) {
                console.error('No departures found for Bakerloo line.');
                continue;
            }

            const departureContainer = document.querySelector(`.departure-list[data-line="${line}"]`);
            renderTrainTimes(departureContainer, departures, currentTime);

        } catch (error) {
            console.error('Error populating train data:', error);
        }
    }
}

// Reset train data in localStorage and reload the page
document.getElementById("resetData").addEventListener("click", function () {
    localStorage.clear(); // Clears the stored train data
    location.reload(); // Reloads the page to re-randomize the data
});

// Call the populate function on page load
window.onload = function () {
    populateTrains();
    playAudioEveryMinute(); // Start the audio playback every minute
};
