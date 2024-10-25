// Time to keep cancelled trains visible (in milliseconds)
const CANCELLED_TRAIN_VISIBILITY_DURATION = 120000; // 2 minutes
const REFRESH_INTERVAL = 60000; // 1 minute (to refresh train data)
const MAX_DELAY = 15; // Maximum delay in minutes
const MIN_DELAY = -5; // Minimum delay (early departure)

const ANCHOR_DATE = new Date("2024-01-01T00:00:00Z"); // Universal start date

let trainSchedule = {};

// Utility function to get the current time in HH:MM format
function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

// Add minutes to time in HH:MM format
function addMinutesToTime(time, minutesToAdd) {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + minutesToAdd;
    const newHours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
    const newMinutes = (totalMinutes % 60).toString().padStart(2, '0');
    return `${newHours}:${newMinutes}`;
}

// Generate random delay between a given range
function generateRandomDelay() {
    return Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1)) + MIN_DELAY;
}

// Generate platform number between 1 and 10
function generatePlatformNumber() {
    return Math.floor(Math.random() * 10) + 1;
}

// Generate train status (on-time, delayed, or cancelled)
function generateTrainStatus(delay) {
    if (delay > 10) return "cancelled";
    return delay > 0 ? "delayed" : "on-time";
}

// Generate causes of delay
function generateDelayCause() {
    const causes = ["Signal failure", "Track maintenance", "Congestion", "Staff shortage"];
    return causes[Math.floor(Math.random() * causes.length)];
}

// Generate train schedule for each line
function generateTrainSchedule() {
    const lines = ["bakerloo", "central", "circle", "district", "hammersmith", "jubilee", "metropolitan", "northern", "piccadilly", "victoria", "waterloo"];
    const schedule = {};
    const currentDate = new Date();
    const daysSinceAnchor = Math.floor((currentDate - ANCHOR_DATE) / (1000 * 60 * 60 * 24)); // Days since anchor date

    lines.forEach((line, index) => {
        schedule[line] = {
            departures: [],
            arrivals: []
        };

        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
                const formattedHour = hour.toString().padStart(2, '0');
                const formattedMinute = minute.toString().padStart(2, '0');
                const departureTime = `${formattedHour}:${formattedMinute}`;
                const arrivalTime = addMinutesToTime(departureTime, 10); // Travel time of 10 minutes
                const delay = generateRandomDelay();
                const status = generateTrainStatus(delay);

                schedule[line].departures.push({
                    destination: generateRandomDestination(line, daysSinceAnchor),
                    departureTime: addMinutesToTime(departureTime, delay),
                    delay,
                    status,
                    platform: generatePlatformNumber(),
                    cause: status === "delayed" ? generateDelayCause() : null,
                    cancelledTime: status === "cancelled" ? new Date() : null,
                });

                schedule[line].arrivals.push({
                    origin: generateRandomOrigin(line, daysSinceAnchor),
                    arrivalTime: addMinutesToTime(arrivalTime, delay),
                    delay,
                    status,
                    platform: generatePlatformNumber(),
                    cause: status === "delayed" ? generateDelayCause() : null,
                    cancelledTime: status === "cancelled" ? new Date() : null,
                });
            }
        }
    });

    return schedule;
}

// Generate random destinations
function generateRandomDestination(line, dayFactor) {
    const destinations = {
        bakerloo: ["Elephant & Castle", "Paddington", "Oxford Circus", "Wembley Central"],
        central: ["Epping", "White City", "Marble Arch", "Liverpool Street"],
        circle: ["Aldgate", "Monument", "King's Cross", "Edgware Road"],
        district: ["Upminster", "Richmond", "Wimbledon", "Barking"],
        hammersmith: ["Barking", "Hammersmith", "Paddington", "Mile End"],
        jubilee: ["Stanmore", "Westminster", "London Bridge", "Wembley Park"],
        metropolitan: ["Aldgate", "Amersham", "Baker Street", "Uxbridge"],
        northern: ["Morden", "Camden Town", "Kennington", "Tooting Broadway"],
        piccadilly: ["Heathrow", "Cockfosters", "Covent Garden", "Leicester Square"],
        victoria: ["Brixton", "Victoria", "King's Cross", "Stockwell"],
        waterloo: ["Bank", "Waterloo", "Lambeth North"]
    };

    return destinations[line][dayFactor % destinations[line].length];
}

// Generate random origins
function generateRandomOrigin(line, dayFactor) {
    const origins = {
        bakerloo: ["Paddington", "Oxford Circus", "Elephant & Castle"],
        central: ["Liverpool Street", "Marble Arch", "Epping"],
        circle: ["Monument", "King's Cross", "Aldgate"],
        district: ["Barking", "Wimbledon", "Richmond"],
        hammersmith: ["Hammersmith", "Paddington", "Barking"],
        jubilee: ["London Bridge", "Westminster", "Stanmore"],
        metropolitan: ["Amersham", "Baker Street", "Aldgate"],
        northern: ["Kennington", "Camden Town", "Morden"],
        piccadilly: ["Covent Garden", "Leicester Square", "Heathrow"],
        victoria: ["Victoria", "Brixton", "King's Cross"],
        waterloo: ["Waterloo", "Bank", "Lambeth North"]
    };

    return origins[line][dayFactor % origins[line].length];
}

// Function to handle train selection (display details)
function handleTrainClick(train) {
    const detailContainer = document.querySelector('.detail-container');
    detailContainer.innerHTML = ''; // Clear previous details

    const detailView = document.createElement('div');
    detailView.classList.add('detail-view');

    const serviceStatus = document.createElement('div');
    serviceStatus.classList.add('service-status');
    if (train.status === "delayed") {
        serviceStatus.textContent = `This service is delayed by ${train.delay} minutes. Reason: ${train.cause}`;
    } else if (train.status === "cancelled") {
        serviceStatus.textContent = `This service is cancelled.`;
    } else {
        serviceStatus.textContent = `This service is on time.`;
    }

    const platformInfo = document.createElement('div');
    platformInfo.textContent = `Platform: ${train.platform}`;

    detailView.appendChild(serviceStatus);
    detailView.appendChild(platformInfo);
    detailContainer.appendChild(detailView);
}

// Update train departures and arrivals
function updateTrainDeparturesAndArrivals(schedule) {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinutes;

    for (const line in schedule) {
        const departureList = document.querySelector(`.departure-list[data-line="${line}"]`);
        const arrivalList = document.querySelector(`.arrival-list[data-line="${line}"]`);
        departureList.innerHTML = '';
        arrivalList.innerHTML = '';

        // Render next 2 departures
        const upcomingDepartures = schedule[line].departures.filter(train => {
            const [trainHour, trainMinutes] = train.departureTime.split(':').map(Number);
            const trainTimeInMinutes = trainHour * 60 + trainMinutes;
            return trainTimeInMinutes >= currentTimeInMinutes;
        }).slice(0, 2);

        upcomingDepartures.forEach(train => {
            const trainItem = document.createElement('div');
            trainItem.classList.add('train-item');
            trainItem.classList.add(train.status); // Add class based on status

            const destinationElement = document.createElement('span');
            destinationElement.classList.add('train-destination');
            destinationElement.textContent = train.destination;

            const timeElement = document.createElement('span');
            timeElement.classList.add('train-time');
            timeElement.textContent = `${train.departureTime} (${addMinutesToTime(train.departureTime, -train.delay)})`;

            trainItem.appendChild(destinationElement);
            trainItem.appendChild(timeElement);
            departureList.appendChild(trainItem);

            trainItem.addEventListener('click', () => handleTrainClick(train));
        });

        // Render next 2 arrivals
        const upcomingArrivals = schedule[line].arrivals.filter(train => {
            const [trainHour, trainMinutes] = train.arrivalTime.split(':').map(Number);
            const trainTimeInMinutes = trainHour * 60 + trainMinutes;
            return trainTimeInMinutes >= currentTimeInMinutes;
        }).slice(0, 2);

        upcomingArrivals.forEach(train => {
            const trainItem = document.createElement('div');
            trainItem.classList.add('train-item');
            trainItem.classList.add(train.status); // Add class based on status

            const originElement = document.createElement('span');
            originElement.classList.add('train-origin');
            originElement.textContent = train.origin;

            const timeElement = document.createElement('span');
            timeElement.classList.add('train-time');
            timeElement.textContent = `${train.arrivalTime} (${addMinutesToTime(train.arrivalTime, -train.delay)})`;

            trainItem.appendChild(originElement);
            trainItem.appendChild(timeElement);
            arrivalList.appendChild(trainItem);

            trainItem.addEventListener('click', () => handleTrainClick(train));
        });
    }
}

// Update the clock
function updateClock() {
    const clockElement = document.getElementById('digital-clock');
    clockElement.textContent = getCurrentTime(); // Update every second
}

// Start live updates
function startLiveUpdates() {
    trainSchedule = generateTrainSchedule();
    updateTrainDeparturesAndArrivals(trainSchedule);
    setInterval(() => updateTrainDeparturesAndArrivals(trainSchedule), REFRESH_INTERVAL);
    setInterval(updateClock, 1000); // Update clock every second
}

// Start live updates on page load
document.addEventListener('DOMContentLoaded', startLiveUpdates);
