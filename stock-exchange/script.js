// Stock data with initial values
const stocks = {
    AAPL: { price: 150, change: 0, percent: 0 },
    TFL: { price: 75, change: 0, percent: 0 },
    LAS: { price: 90, change: 0, percent: 0 },
    LFB: { price: 120, change: 0, percent: 0 },
    MET: { price: 200, change: 0, percent: 0 },
};

// Function to update prices every 5 seconds
setInterval(updatePrices, 5000);

function updatePrices() {
    for (const symbol in stocks) {
        const stock = stocks[symbol];
        const change = (Math.random() - 0.5) * 2; // Random change between -1 and 1
        stock.price += change;
        stock.percent = ((change / stock.price) * 100).toFixed(2);

        // Update the DOM elements for price and percent change
        document.querySelector(`#ticker-${symbol} .price`).textContent = stock.price.toFixed(2);
        document.querySelector(`#ticker-${symbol} .percent`).textContent = `${stock.percent}%`;

        const priceElement = document.querySelector(`#ticker-${symbol}`);
        priceElement.classList.remove("up", "down");
        if (change > 0) {
            priceElement.classList.add("up");
        } else if (change < 0) {
            priceElement.classList.add("down");
        }

        // Update stock card data
        document.querySelector(`#card-${symbol} .price`).textContent = stock.price.toFixed(2);
        document.querySelector(`#card-${symbol} .change`).textContent = `${stock.percent}%`;
    }
}

// Display current local time and update every second
setInterval(() => {
    document.getElementById("local-time").textContent = new Date().toLocaleTimeString();
}, 1000);

// Function to show or hide more details
function showDetails(symbol) {
    const details = document.getElementById(`details-${symbol}`);
    details.style.display = details.style.display === "none" || details.style.display === "" ? "block" : "none";

    // Generate random details data for demo purposes
    if (details.style.display === "block") {
        const stock = stocks[symbol];
        document.querySelector(`#details-${symbol} .open`).textContent = (stock.price * (1 - Math.random() * 0.1)).toFixed(2);
        document.querySelector(`#details-${symbol} .high`).textContent = (stock.price * (1 + Math.random() * 0.1)).toFixed(2);
        document.querySelector(`#details-${symbol} .low`).textContent = (stock.price * (1 - Math.random() * 0.1)).toFixed(2);
        document.querySelector(`#details-${symbol} .close`).textContent = stock.price.toFixed(2);
        document.querySelector(`#details-${symbol} .volume`).textContent = Math.floor(Math.random() * 1000000).toLocaleString();
    }
}

// Initialize sparklines and charts (placeholder for demonstration)
document.addEventListener("DOMContentLoaded", () => {
    for (const symbol in stocks) {
        const sparklineCtx = document.getElementById(`sparkline-${symbol}`).getContext("2d");
        new Chart(sparklineCtx, {
            type: "line",
            data: {
                labels: Array.from({ length: 12 }, (_, i) => i + 1),
                datasets: [{
                    label: "Price",
                    data: Array.from({ length: 12 }, () => stocks[symbol].price + (Math.random() - 0.5) * 2),
                    fill: false,
                    borderColor: "#3498db",
                    tension: 0.1,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { display: false },
                    y: { display: false }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });

        const chartCtx = document.getElementById(`chart-${symbol}`).getContext("2d");
        new Chart(chartCtx, {
            type: "line",
            data: {
                labels: Array.from({ length: 30 }, (_, i) => i + 1),
                datasets: [{
                    label: "Price History",
                    data: Array.from({ length: 30 }, () => stocks[symbol].price + (Math.random() - 0.5) * 5),
                    fill: true,
                    borderColor: "#2c3e50",
                    backgroundColor: "rgba(52, 152, 219, 0.2)",
                    tension: 0.3,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: { display: true, text: "Days" }
                    },
                    y: {
                        title: { display: true, text: "Price" }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: { mode: "index", intersect: false }
                }
            }
        });
    }
});
