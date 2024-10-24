// Generate a full day of train departures from 00:00 to 23:59
function generateTrainSchedule() {
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
                    stops: generateRandomStops(line)
                });
            }
        }
    });

    return schedule;
}

// Generate random destinations for demonstration purposes
function generateRandomDestination(line) {
    const destinations = {
        bakerloo: ["Elephant & Castle", "Harrow & Wealdstone"],
        central: ["Epping", "West Ruislip"],
        circle: ["Hammersmith", "Edgware Road"],
        district: ["Upminster", "Richmond"],
        hammersmith: ["Barking", "Hammersmith"],
        jubilee: ["Stratford", "Stanmore"],
        metropolitan: ["Aldgate", "Amersham"],
        northern: ["Morden", "High Barnet"],
        piccadilly: ["Heathrow Terminal 5", "Cockfosters"],
        victoria: ["Brixton", "Walthamstow Central"],
        waterloo: ["Bank", "Waterloo"]
    };
    return destinations[line][Math.floor(Math.random() * destinations[line].length)];
}

// Generate random stops for each line
function generateRandomStops(line) {
    const stops = {
        bakerloo: ["Paddington", "Oxford Circus", "Piccadilly Circus"],
        central: ["Notting Hill Gate", "Liverpool Street", "Stratford"],
        circle: ["Baker Street", "King's Cross", "Liverpool Street"],
        district: ["Earl's Court", "Hammersmith", "Richmond"],
        hammersmith: ["Paddington", "West Ham", "Barking"],
        jubilee: ["Waterloo", "London Bridge", "Canary Wharf"],
        metropolitan: ["King's Cross", "Moorgate", "Harrow-on-the-Hill"],
        northern: ["Camden Town", "Kennington", "Clapham Common"],
        piccadilly: ["King's Cross", "Heathrow", "Knightsbridge"],
        victoria: ["Victoria", "Oxford Circus", "Stockwell"],
        waterloo: ["Lambeth North", "Waterloo", "Bank"]
    };
    return stops[line].join(", ");
}

// Get the current time and display upcoming trains within the next 30 minutes
function updateTrainDepartures(schedule) {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    
    for (const line in schedule) {
        const trainList = document.querySelector(`.train-list[data-line="${line}"]`);
        trainList.innerHTML = ''; // Clear the list

        const departures = schedule[line].filter(train => {
            const [trainHour, trainMinutes] = train.departureTime.split(':').map(Number);
            const trainTimeInMinutes = trainHour * 60 + trainMinutes;
            const currentTimeInMinutes = currentHour * 60 + currentMinutes;
            return trainTimeInMinutes >= currentTimeInMinutes && trainTimeInMinutes <= currentTimeInMinutes + 30; // Show trains within 30 minutes
        });

        departures.forEach(train => {
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

// Initialize the schedule and update train departures every minute
function startLiveUpdates() {
    const schedule = generateTrainSchedule(); // Generate the full day's schedule
    updateTrainDepartures(schedule); // Display the initial trains
    setInterval(() => updateTrainDepartures(schedule), 60000); // Update every minute
}

// Start live updates when the page loads
document.addEventListener('DOMContentLoaded', startLiveUpdates);
