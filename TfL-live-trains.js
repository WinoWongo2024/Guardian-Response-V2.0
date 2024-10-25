// Search functionality
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

// Toggle detail container on clicking a departure or arrival
document.querySelectorAll(".departure-list, .arrival-list").forEach(element => {
    element.addEventListener("click", function() {
        const detailContainer = document.getElementById("detail-container");
        detailContainer.style.display = "block";
        
        // Sample data for demonstration purposes
        document.querySelector(".service-status").textContent = "On Time";
        document.querySelector(".platform-info").textContent = "Platform 3";
        document.querySelector(".stops").textContent = "Stops at: Paddington, Oxford Circus, Bank";
    });
});

// Close detail container on outside click
document.addEventListener("click", function(event) {
    const detailContainer = document.getElementById("detail-container");
    if (!detailContainer.contains(event.target) && !event.target.classList.contains("departure-list") && !event.target.classList.contains("arrival-list")) {
        detailContainer.style.display = "none";
    }
});
