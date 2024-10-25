// Real-time Stock Price Simulation
const stocks = {
    AAPL: { price: 149.41, change: 0, percent: -0.47 },
    TFL: { price: 72.88, change: 0, percent: -0.16 },
    LAS: { price: 90, change: 0, percent: 0 },
    LFB: { price: 120, change: 0, percent: 0 },
    MET: { price: 200, change: 0, percent: 0 },
};

// Initialize Charts and Update Functions
let charts = {};

function initializeCharts() {
    for (const symbol in stocks) {
        const sparklineCtx = document.getElementById(`sparkline-${symbol}`).getContext("2d");

        // Create sparkline for each stock
        charts[symbol] = new Chart(sparklineCtx, {
            type: "line",
            data: {
                labels: Array.from({ length: 12 }, (_, i) => i + 1),
                datasets: [{
                    label: "Price",
                    data: Array.from({ length: 12 }, () => stocks[symbol].price + (Math.random() - 0.5) * 2),
                    fill: false,
                    borderColor: "#3498db",
                    tension: 0.1,
                    borderWidth: 1,
                    pointRadius: 1,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { display: false },
                    y: { display: false },
                },
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false },
                },
            },
        });
    }
}

// Function to update stock prices
function updatePrices() {
    for (const symbol in stocks) {
        const stock = stocks[symbol];
        const change = (Math.random() - 0.5) * 2; // Random change between -1 and 1
        stock.price += change;
        stock.percent = ((change / stock.price) * 100).toFixed(2);

        // Update the DOM elements for price and percent change
        document.querySelector(`#ticker-${symbol} .price`).textContent = stock.price.toFixed(2);
        document.querySelector(`#ticker-${symbol} .percent`).textContent = `${stock.percent}%`;

        // Update stock card
        document.querySelector(`#card-${symbol} .price`).textContent = stock.price.toFixed(2);
        document.querySelector(`#card-${symbol} .change`).textContent = `${stock.percent}%`;

        // Update the sparkline chart data
        const chart = charts[symbol];
        chart.data.datasets[0].data.push(stock.price);
        if (chart.data.datasets[0].data.length > 12) {
            chart.data.datasets[0].data.shift(); // Keep only the last 12 data points
        }
        chart.update();
    }
}

// Function to show or hide more details and handle chart update
function showDetails(symbol) {
    const details = document.getElementById(`details-${symbol}`);
    details.style.display = details.style.display === "none" || details.style.display === "" ? "block" : "none";

    if (details.style.display === "block") {
        // Update the detailed chart with more data
        const chartCtx = document.getElementById(`chart-${symbol}`).getContext("2d");
        const detailedChart = new Chart(chartCtx, {
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
                    borderWidth: 2,
                }],
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: { display: true, text: "Days" },
                    },
                    y: {
                        title: { display: true, text: "Price" },
                    },
                },
                plugins: {
                    legend: { display: false },
                    tooltip: { mode: "index", intersect: false },
                },
            },
        });
    }
}

// Initialize charts on page load
document.addEventListener("DOMContentLoaded", () => {
    initializeCharts();
    setInterval(updatePrices, 5000); // Update prices every 5 seconds
});
