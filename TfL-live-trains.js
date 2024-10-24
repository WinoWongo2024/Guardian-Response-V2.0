// Sample Train Data (with scrolling stops)
const trainData = {
    bakerloo: [
        { destination: "Elephant & Castle", departureTime: "14:15", status: "cancelled", stops: "Baker Street, Oxford Circus, Piccadilly Circus, Charing Cross" },
        { destination: "Harrow & Wealdstone", departureTime: "14:25", status: "cancelled", stops: "Paddington, Marylebone, Kilburn Park, Queen's Park" }
    ],
    central: [
        { destination: "Epping", departureTime: "14:10", status: "cancelled", stops: "Liverpool Street, Stratford, Leytonstone" },
        { destination: "West Ruislip", departureTime: "14:20", status: "cancelled", stops: "Notting Hill Gate, Shepherd's Bush, Ealing Broadway" }
    ],
    circle: [
        { destination: "Hammersmith", departureTime: "14:12", status: "cancelled", stops: "Baker Street, King's Cross, Farringdon, Liverpool Street" },
        { destination: "Edgware Road", departureTime: "14:22", status: "cancelled", stops: "South Kensington, Gloucester Road, Paddington" }
    ],
    district: [
        { destination: "Upminster", departureTime: "14:08", status: "cancelled", stops: "Whitechapel, East Ham, Barking" },
        { destination: "Richmond", departureTime: "14:18", status: "cancelled", stops: "Earl's Court, Hammersmith, Gunnersbury" }
    ],
    hammersmith: [
        { destination: "Barking", departureTime: "14:14", status: "cancelled", stops: "Liverpool Street, Mile End, West Ham" },
        { destination: "Hammersmith", departureTime: "14:24", status: "cancelled", stops: "Paddington, Royal Oak, Latimer Road" }
    ],
    jubilee: [
        { destination: "Stratford", departureTime: "14:13", status: "cancelled", stops: "London Bridge, Canary Wharf, North Greenwich" },
        { destination: "Stanmore", departureTime: "14:23", status: "cancelled", stops: "Baker Street, Finchley Road, Wembley Park" }
    ],
    metropolitan: [
        { destination: "Aldgate", departureTime: "14:09", status: "cancelled", stops: "Baker Street, King's Cross, Moorgate" },
        { destination: "Amersham", departureTime: "14:19", status: "cancelled", stops: "Chorleywood, Rickmansworth, Moor Park" }
    ],
    northern: [
        { destination: "Morden", departureTime: "14:17", status: "cancelled", stops: "Waterloo, Kennington, Clapham Common" },
        { destination: "High Barnet", departureTime: "14:27", status: "cancelled", stops: "Camden Town, Archway, East Finchley" }
    ],
    piccadilly: [
        { destination: "Heathrow Terminal 5", departureTime: "14:11", status: "cancelled", stops: "Hammersmith, Acton Town, Hounslow" },
        { destination: "Cockfosters", departureTime: "14:21", status: "cancelled", stops: "Knightsbridge, King's Cross, Finsbury Park" }
    ],
    victoria: [
        { destination: "Brixton", departureTime: "14:16", status: "cancelled", stops: "Oxford Circus, Victoria, Stockwell" },
        { destination: "Walthamstow Central", departureTime: "14:26", status: "cancelled", stops: "Green Park, King's Cross, Finsbury Park" }
    ],
    waterloo: [
        { destination: "Bank", departureTime: "14:18", status: "cancelled", stops: "Waterloo, Lambeth North" },
        { destination: "Waterloo", departureTime: "14:28", status: "cancelled", stops: "Bank, Lambeth North" }
    ]
};

// Function to dynamically update train departures
function updateTrainDepartures() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    // Iterate through each line and update departures
    for (const line in trainData) {
        const trainList = document.querySelector(`.train-list[data-line="${line}"]`);
        trainList.innerHTML = ''; // Clear existing list

        // Get the train departures for the line
        const departures = trainData[line];

        departures.forEach(train => {
            // Split the departure time into hours and minutes
            const [trainHour, trainMinutes] = train.departureTime.split(':').map(Number);

            // Check if the train has expired (departure time has passed)
            if (trainHour < currentHour || (trainHour === currentHour && trainMinutes < currentMinutes)) {
                // Skip expired trains
                return;
            }

            // Create a new list item for the train
            const trainItem = document.createElement('div');
            trainItem.classList.add('train-item');
            trainItem.classList.add(train.status); // Add status class ("cancelled")

            const destinationElement = document.createElement('span');
            destinationElement.classList.add('train-destination');
            destinationElement.textContent = train.destination;

            const timeElement = document.createElement('span');
            timeElement.classList.add('train-time');
            timeElement.textContent = train.departureTime;

            // Create scrolling stops
            const stopsElement = document.createElement('div');
            stopsElement.classList.add('train-stops');
            const stopsText = document.createElement('span');
            stopsText.textContent = `Stops: ${train.stops}`;
            stopsElement.appendChild(stopsText);

            // Add a label if the train is cancelled
            if (train.status === 'cancelled') {
                const statusElement = document.createElement('span');
                statusElement.classList.add('train-status');
                statusElement.textContent = 'Cancelled';
                trainItem.appendChild(statusElement);
            }

            trainItem.appendChild(destinationElement);
            trainItem.appendChild(timeElement);
            trainItem.appendChild(stopsElement); // Add scrolling stops
            trainList.appendChild(trainItem);
        });
    }
}

// Function to refresh the train data every minute
function startLiveUpdates() {
    updateTrainDepartures();
    setInterval(updateTrainDepartures, 60000); // Update every minute
}

// Start live updates when the page loads
document.addEventListener('DOMContentLoaded', startLiveUpdates);
