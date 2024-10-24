// Time to keep cancelled trains visible (in milliseconds)
const CANCELLED_TRAIN_VISIBILITY_DURATION = 120000; // 2 minutes

// Generate or retrieve a train schedule from localStorage
function generateTrainSchedule() {
    const storedSchedule = localStorage.getItem('trainSchedule');
    
    // If schedule exists in localStorage, parse and return it
    if (storedSchedule) {
        return JSON.parse(storedSchedule);
    }
    
    const lines = ["bakerloo", "central", "circle", "district", "hammersmith", "jubilee", "metropolitan", "northern", "piccadilly", "victoria", "waterloo"];
    const schedule = {};

    lines.forEach(line => {
        schedule[line] = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 15) { // Trains depart every 15 minutes
                const formattedHour = hour.toString().padStart(2, '0');
                const formattedMinute = minute.toString().padStart(2, '0');
                schedule[line].push({
                    destination: generateRandomDestination(line),
                    departureTime: `${formattedHour}:${formattedMinute}`,
                    status: Math.random() > 0.85 ? "cancelled" : "on-time", // Randomly cancel some trains
                    stops: generateRandomStops(line),
                    cancelledTime: null // Track when a train is cancelled
                });
            }
        }
    });

    // Store the generated schedule in localStorage
    localStorage.setItem('trainSchedule', JSON.stringify(schedule));

    return schedule;
}

// Generate random destinations for demonstration purposes with more destinations
function generateRandomDestination(line) {
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
    return destinations[line][Math.floor(Math.random() * destinations[line].length)];
}

// Generate random stops for each line with more stops
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
    return stops[line].join(", ");
}

// Update the train departures every minute
function updateTrainDepartures(schedule) {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinutes;
    
    for (const line in schedule) {
        const trainList = document.querySelector(`.train-list[data-line="${line}"]`);
        trainList.innerHTML = ''; // Clear the list

        schedule[line].forEach(train => {
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

            // Create the train item
            const trainItem = document.createElement('div');
            trainItem.classList.add('train-item');
            trainItem.classList.add(train.status); // Add on-time or cancelled class

            const destinationElement = document.createElement('span');
            destinationElement.classList.add('train-destination');
            destinationElement.textContent = train.destination;

            const timeElement = document.createElement('span');
            timeElement.classList.add('train-time');
            timeElement.textContent = train.departureTime;

            const stopsElement = document.createElement('div');
            stopsElement.classList.add('train-stops');
            const stopsText = document.createElement('span');
            stopsText.textContent = `Stops: ${train.stops}`;
            stopsElement.appendChild(stopsText);

            // Show cancellation status
            if (train.status === "cancelled") {
                const statusElement = document.createElement('span');
                statusElement.classList.add('train-status');
                statusElement.textContent = 'Cancelled';
                trainItem.appendChild(statusElement);
            }

            trainItem.appendChild(destinationElement);
            trainItem.appendChild(timeElement);
            trainItem.appendChild(stopsElement);
            trainList.appendChild(trainItem);
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

// Initialize the schedule and update train departures every minute
function startLiveUpdates() {
    let schedule = generateTrainSchedule(); // Retrieve or generate the full day's schedule
    updateTrainDepartures(schedule); // Display the initial trains
    setInterval(() => updateTrainDepartures(schedule), 60000); // Update every minute
    setInterval(updateClock, 1000); // Update the clock every second
}

// Start live updates when the page loads
document.addEventListener('DOMContentLoaded', startLiveUpdates);
