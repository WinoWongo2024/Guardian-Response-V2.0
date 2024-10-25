// Sample data for departures and arrivals for each line
const departuresData = {
    bakerloo: ["Oxford Circus 16:41", "Oxford Circus 17:07", "Paddington 17:15", "Waterloo 17:25", "Charing Cross 17:35", "Regent's Park 17:45"],
    central: ["Marble Arch 16:58", "Marble Arch 17:00", "Bond Street 17:10", "Liverpool Street 17:20", "Stratford 17:30", "Leyton 17:40"],
    circle: ["King's Cross 16:41", "King's Cross 16:59", "Moorgate 17:05", "Tower Hill 17:15", "Monument 17:25", "Farringdon 17:35"],
    district: ["Westminster 17:02", "Victoria 17:10", "South Kensington 17:18", "Earls Court 17:25", "Wimbledon 17:35", "Richmond 17:45"],
    hammersmith: ["Hammersmith 16:45", "Paddington 17:00", "Baker Street 17:15", "King's Cross 17:30", "Liverpool Street 17:45"],
    jubilee: ["Bond Street 16:50", "Green Park 17:05", "Waterloo 17:20", "London Bridge 17:35", "North Greenwich 17:50"],
    metropolitan: ["Aldgate 16:40", "Liverpool Street 16:55", "King's Cross 17:10", "Baker Street 17:25", "Wembley Park 17:40"],
    northern: ["Euston 16:45", "Camden Town 17:00", "Charing Cross 17:15", "Waterloo 17:30", "Bank 17:45"],
    piccadilly: ["Leicester Square 16:48", "Covent Garden 17:00", "Russell Square 17:12", "King's Cross 17:25", "Heathrow T5 17:50"],
    victoria: ["Victoria 16:55", "Green Park 17:05", "Oxford Circus 17:15", "Euston 17:25", "Walthamstow 17:40"],
    waterloo: ["Waterloo 16:45", "Bank 17:00", "Oxford Circus 17:15", "Piccadilly Circus 17:30", "London Bridge 17:45"]
};

const arrivalsData = {
    bakerloo: ["Oxford Circus 16:43", "Oxford Circus 16:51", "Paddington 16:55", "Waterloo 17:03", "Charing Cross 17:13", "Regent's Park 17:23"],
    central: ["Marble Arch 16:41", "Marble Arch 17:08", "Bond Street 17:15", "Liverpool Street 17:25", "Stratford 17:35", "Leyton 17:45"],
    circle: ["King's Cross 16:40", "King's Cross 16:51", "Moorgate 17:00", "Tower Hill 17:10", "Monument 17:20", "Farringdon 17:30"],
    district: ["Westminster 17:05", "Victoria 17:12", "South Kensington 17:20", "Earls Court 17:30", "Wimbledon 17:40", "Richmond 17:50"],
    hammersmith: ["Hammersmith 16:50", "Paddington 17:05", "Baker Street 17:20", "King's Cross 17:35", "Liverpool Street 17:50"],
    jubilee: ["Bond Street 16:55", "Green Park 17:10", "Waterloo 17:25", "London Bridge 17:40", "North Greenwich 17:55"],
    metropolitan: ["Aldgate 16:45", "Liverpool Street 17:00", "King's Cross 17:15", "Baker Street 17:30", "Wembley Park 17:45"],
    northern: ["Euston 16:50", "Camden Town 17:05", "Charing Cross 17:20", "Waterloo 17:35", "Bank 17:50"],
    piccadilly: ["Leicester Square 16:53", "Covent Garden 17:05", "Russell Square 17:17", "King's Cross 17:30", "Heathrow T5 17:55"],
    victoria: ["Victoria 17:00", "Green Park 17:10", "Oxford Circus 17:20", "Euston 17:30", "Walthamstow 17:45"],
    waterloo: ["Waterloo 16:50", "Bank 17:05", "Oxford Circus 17:20", "Piccadilly Circus 17:35", "London Bridge 17:50"]
};

// Function to populate departures and arrivals
function populateTrains() {
    document.querySelectorAll('.departure-list').forEach(departure => {
        const line = departure.getAttribute('data-line');
        if (departuresData[line]) {
            departure.innerHTML = departuresData[line].map(time => `<p>${time}</p>`).join('');
        }
    });

    document.querySelectorAll('.arrival-list').forEach(arrival => {
        const line = arrival.getAttribute('data-line');
        if (arrivalsData[line]) {
            arrival.innerHTML = arrivalsData[line].map(time => `<p>${time}</p>`).join('');
        }
    });
}

// Show detailed information when clicking on a train service
document.querySelectorAll(".departure-list, .arrival-list").forEach(element => {
    element.addEventListener("click", function() {
        const detailContainer = document.getElementById("detail-container");
        detailContainer.style.display = "block";
        
        // Dummy detailed info (you can replace with real data)
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
