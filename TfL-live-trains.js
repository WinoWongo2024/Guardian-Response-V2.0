// Time to keep cancelled trains visible (in milliseconds)
const CANCELLED_TRAIN_VISIBILITY_DURATION = 120000; // 2 minutes
const REFRESH_INTERVAL = 60000; // 1 minute (to refresh train data)

// A global anchor date that all users will reference for consistency
const ANCHOR_DATE = new Date("2024-01-01T00:00:00Z"); // A fixed universal start date

// Global state for the train schedule
let trainSchedule = {};

// Utility function to get the current time in HH:MM format
function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Function to calculate the time difference in minutes between two times in HH:MM format
function timeDifferenceInMinutes(time1, time2) {
    const [hours1, minutes1] = time1.split(':').map(Number);
    const [hours2, minutes2] = time2.split(':').map(Number);
    return (hours1 * 60 + minutes1) - (hours2 * 60 + minutes2);
}

// Function to add a duration to a time in HH:MM format
function addMinutesToTime(time, minutesToAdd) {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + minutesToAdd;
    const newHours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
    const newMinutes = (totalMinutes % 60).toString().padStart(2, '0');
    return `${newHours}:${newMinutes}`;
}

// Function to generate a deterministic train schedule based on the current time relative to ANCHOR_DATE
function generateTrainSchedule() {
    const lines = ["bakerloo", "central", "circle", "district", "hammersmith", "jubilee", "metropolitan", "northern", "piccadilly", "victoria", "waterloo"];
    const schedule = {};
    const currentDate = new Date();

    // Calculate the number of days since ANCHOR_DATE for deterministic consistency
    const daysSinceAnchor = Math.floor((currentDate - ANCHOR_DATE) / (1000 * 60 * 60 * 24)); // Total days since anchor

    lines.forEach((line, index) => {
        schedule[line] = {
            departures: [],
            arrivals: []
        };
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 15) { // Trains depart every 15 minutes
                const formattedHour = hour.toString().padStart(2, '0');
                const formattedMinute = minute.toString().padStart(2, '0');

                // Generate a consistent random factor based on the current day, hour, minute, and line index
                const randomFactor = (daysSinceAnchor + hour + minute + index) % 100;
                const isCancelled = randomFactor > 85; // 15% chance of cancellation

                const departureTime = `${formattedHour}:${formattedMinute}`;
                const arrivalTime = addMinutesToTime(departureTime, 10); // Assume the travel time is 10 minutes for arrivals

                // Add to departures and arrivals
                schedule[line].departures.push({
                    destination: generateRandomDestination(line, daysSinceAnchor),
                    departureTime: departureTime,
                    status: isCancelled ? "cancelled" : "on-time",
                    stops: generateRandomStops(line),
                    cancelledTime: null, // Track when a train is cancelled
                });

                schedule[line].arrivals.push({
                    origin: generateRandomOrigin(line, daysSinceAnchor), // Add random origins for arrivals
                    arrivalTime: arrivalTime,
                    status: isCancelled ? "cancelled" : "on-time",
                    stops: generateRandomStops(line),
                    cancelledTime: null, // Track when a train is cancelled
                });
            }
        }
    });

    return schedule;
}

// Generate random destinations based on the day to ensure consistency across users
function generateRandomDestination(line, dayFactor) {
    const destinations = {
        bakerloo: ["Elephant & Castle", "Harrow & Wealdstone", "Queen's Park", "Paddington", "Oxford Circus", "Wembley Central"],
        central: ["Epping", "West Ruislip", "White City", "Marble Arch", "Liverpool Street", "Bethnal Green"],
        circle: ["Hammersmith", "Edgware Road", "Aldgate", "King's Cross", "Monument", "Notting Hill Gate"],
        district: ["Upminster", "Richmond", "Wimbledon", "Ealing Broadway", "Tower Hill", "Barking"],
        hammersmith: ["Barking", "Hammersmith", "Whitechapel", "Mile End", "Paddington", "Royal Oak"],
        jubilee: ["Stratford", "Stanmore", "London Bridge", "Westminster", "Wembley Park", "Bermondsey"],
        metropolitan: ["Aldgate", "Amersham", "Chorleywood", "Rickmansworth", "Baker Street", "Uxbridge"],
        northern: ["Morden", "High Barnet", "Camden Town", "Kennington", "Tooting Broadway", "East Finchley"],
        piccadilly: ["Heathrow Terminal 5", "Cockfosters", "Hammersmith", "Covent Garden", "South Kensington", "Leicester Square"],
        victoria: ["Brixton", "Walthamstow Central", "Victoria", "Oxford Circus", "King's Cross", "Stockwell"],
        waterloo: ["Bank", "Waterloo", "Lambeth North"]
    };

    return destinations[line][dayFactor % destinations[line].length];
}

// Generate random origins based on the day to ensure consistency across users (for arrivals)
function generateRandomOrigin(line, dayFactor) {
    const origins = {
        bakerloo: ["Queen's Park", "Elephant & Castle", "Paddington", "Oxford Circus"],
        central: ["Bethnal Green", "Liverpool Street", "Marble Arch", "Epping"],
        circle: ["Notting Hill Gate", "Hammersmith", "Monument", "King's Cross"],
        district: ["Richmond", "Tower Hill", "Barking", "Ealing Broadway"],
        hammersmith: ["Whitechapel", "Mile End", "Paddington", "Royal Oak"],
        jubilee: ["Wembley Park", "Stanmore", "London Bridge", "Westminster"],
        metropolitan: ["Amersham", "Rickmansworth", "Uxbridge", "Baker Street"],
        northern: ["High Barnet", "Camden Town", "Kennington", "Tooting Broadway"],
        piccadilly: ["Heathrow Terminal 5", "Cockfosters", "Covent Garden", "Leicester Square"],
        victoria: ["Brixton", "Oxford Circus", "Green Park", "King's Cross"],
        waterloo: ["Bank", "Waterloo", "Lambeth North"]
    };

    return origins[line][dayFactor % origins[line].length];
}

// Generate random stops based on the line
function generateRandomStops(line) {
    const stops = {
        bakerloo: ["Paddington", "Oxford Circus", "Piccadilly Circus", "Waterloo", "Lambeth North", "Elephant & Castle"],
        central: ["Notting Hill Gate", "Marble Arch", "Oxford Circus", "Liverpool Street", "Stratford", "Leyton"],
        circle: ["Baker Street", "King's Cross", "Farringdon", "Moorgate", "Liverpool Street", "Tower Hill"],
        district: ["Earl's Court", "West Kensington", "Hammersmith", "Richmond", "Turnham Green", "Acton Town"],
        hammersmith: ["Paddington", "West Ham", "Whitechapel", "Barking", "Mile End", "Latimer Road"],
        jubilee: ["Waterloo", "London Bridge", "Canary Wharf", "North Greenwich", "Stratford", "Wembley Park"],
        metropolitan: ["King's Cross", "Moorgate", "Harrow-on-the-Hill", "Chorleywood", "Rickmansworth", "Amersham"],
        northern: ["Camden Town", "Kennington", "Clapham Common", "Highgate", "East Finchley", "Tooting Broadway"],
        piccadilly: ["Knightsbridge", "King's Cross", "Covent Garden", "Leicester Square", "South Kensington", "Heathrow Terminal 5"],
        victoria: ["Victoria", "Oxford Circus", "Green Park", "Stockwell", "Vauxhall", "Brixton"],
        waterloo: ["Bank", "Lambeth North", "Waterloo"]
    };
    return stops[line];
}

// Update the train departures and arrivals every minute
function updateTrainDeparturesAndArrivals(schedule) {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinutes;

    for (const line in schedule) {
        const departureList = document.querySelector(`.departure-list[data-line="${line}"]`);
        const arrivalList = document.querySelector(`.arrival-list[data-line="${line}"]`);
        departureList.innerHTML = ''; // Clear the departure list
        arrivalList.innerHTML = '';   // Clear the arrival list

        // Render Departures
        schedule[line].departures.forEach(train => {
            const [trainHour, trainMinutes] = train.departureTime.split(':').map(Number);
            const trainTimeInMinutes = trainHour * 60 + trainMinutes;

            // If the train has already departed or its cancelled visibility period has expired, skip it
            if (trainTimeInMinutes < currentTimeInMinutes && (!train.cancelledTime || now - train.cancelledTime > CANCELLED_TRAIN_VISIBILITY_DURATION)) {
                return;
            }

            // If the train is marked as cancelled, track the time it was cancelled
            if (train.status === "cancelled" && !train.cancelledTime) {
                train.cancelledTime = now;
            }

            // Create the departure item
            const trainItem = document.createElement('div');
            trainItem.classList.add('train-item');
            trainItem.classList.add(train.status); // Add on-time or cancelled class

            const destinationElement = document.createElement('span');
            destinationElement.classList.add('train-destination');
            destinationElement.textContent = train.destination;

            const timeElement = document.createElement('span');
            timeElement.classList.add('train-time');
            timeElement.textContent = train.departureTime;

            trainItem.appendChild(destinationElement);
            trainItem.appendChild(timeElement);
            departureList.appendChild(trainItem);
        });

        // Render Arrivals
        schedule[line].arrivals.forEach(train => {
            const [trainHour, trainMinutes] = train.arrivalTime.split(':').map(Number);
            const trainTimeInMinutes = trainHour * 60 + trainMinutes;

            // If the train has already arrived or its cancelled visibility period has expired, skip it
            if (trainTimeInMinutes < currentTimeInMinutes && (!train.cancelledTime || now - train.cancelledTime > CANCELLED_TRAIN_VISIBILITY_DURATION)) {
                return;
            }

            // If the train is marked as cancelled, track the time it was cancelled
            if (train.status === "cancelled" && !train.cancelledTime) {
                train.cancelledTime = now;
            }

            // Create the arrival item
            const trainItem = document.createElement('div');
            trainItem.classList.add('train-item');
            trainItem.classList.add(train.status); // Add on-time or cancelled class

            const originElement = document.createElement('span');
            originElement.classList.add('train-origin');
            originElement.textContent = train.origin;

            const timeElement = document.createElement('span');
            timeElement.classList.add('train-time');
            timeElement.textContent = train.arrivalTime;

            trainItem.appendChild(originElement);
            trainItem.appendChild(timeElement);
            arrivalList.appendChild(trainItem);
        });
    }
}

// Function to update the digital clock
function updateClock() {
    const clockElement = document.getElementById('digital-clock');
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
}

// Initialize the schedule and update train departures and arrivals every minute
function startLiveUpdates() {
    trainSchedule = generateTrainSchedule(); // Generate schedule based on current time and days since ANCHOR_DATE
    updateTrainDeparturesAndArrivals(trainSchedule); // Display the initial trains
    setInterval(() => updateTrainDeparturesAndArrivals(trainSchedule), REFRESH_INTERVAL); // Update every minute
    setInterval(updateClock, 1000); // Update the clock every second
}

// Start live updates when the page loads
document.addEventListener('DOMContentLoaded', startLiveUpdates);
