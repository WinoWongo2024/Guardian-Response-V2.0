// Sample Train Data (all trains set to "cancelled")
const trainData = {
    bakerloo: [
        { destination: "Elephant & Castle", departureTime: "14:15", status: "cancelled" },
        { destination: "Harrow & Wealdstone", departureTime: "14:25", status: "cancelled" }
    ],
    central: [
        { destination: "Epping", departureTime: "14:10", status: "cancelled" },
        { destination: "West Ruislip", departureTime: "14:20", status: "cancelled" }
    ],
    circle: [
        { destination: "Hammersmith", departureTime: "14:12", status: "cancelled" },
        { destination: "Edgware Road", departureTime: "14:22", status: "cancelled" }
    ],
    district: [
        { destination: "Upminster", departureTime: "14:08", status: "cancelled" },
        { destination: "Richmond", departureTime: "14:18", status: "cancelled" }
    ],
    hammersmith: [
        { destination: "Barking", departureTime: "14:14", status: "cancelled" },
        { destination: "Hammersmith", departureTime: "14:24", status: "cancelled" }
    ],
    jubilee: [
        { destination: "Stratford", departureTime: "14:13", status: "cancelled" },
        { destination: "Stanmore", departureTime: "14:23", status: "cancelled" }
    ],
    metropolitan: [
        { destination: "Aldgate", departureTime: "14:09", status: "cancelled" },
        { destination: "Amersham", departureTime: "14:19", status: "cancelled" }
    ],
    northern: [
        { destination: "Morden", departureTime: "14:17", status: "cancelled" },
        { destination: "High Barnet", departureTime: "14:27", status: "cancelled" }
    ],
    piccadilly: [
        { destination: "Heathrow Terminal 5", departureTime: "14:11", status: "cancelled" },
        { destination: "Cockfosters", departureTime: "14:21", status: "cancelled" }
    ],
    victoria: [
        { destination: "Brixton", departureTime: "14:16", status: "cancelled" },
        { destination: "Walthamstow Central", departureTime: "14:26", status: "cancelled" }
    ],
    waterloo: [
        { destination: "Bank", departureTime: "14:18", status: "cancelled" },
        { destination: "Waterloo", departureTime: "14:28", status: "cancelled" }
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

            // Add a label if the train is cancelled
            if (train.status === 'cancelled') {
                const statusElement = document.createElement('span');
                statusElement.classList.add('train-status');
                statusElement.textContent = 'Cancelled';
                trainItem.appendChild(statusElement);
            }

            trainItem.appendChild(destinationElement);
            trainItem.appendChild(timeElement);
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
