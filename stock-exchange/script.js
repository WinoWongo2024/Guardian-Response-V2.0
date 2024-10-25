// Real-time Stock Price Simulation
const stocks = {
    AAPL: { price: 149.41, change: 0, percent: -0.47 },
    TFL: { price: 72.88, change: 0, percent: -0.16 },
    LAS: { price: 90, change: 0, percent: 0 },
    LFB: { price: 120, change: 0, percent: 0 },
    MET: { price: 200, change: 0, percent: 0 },
};

// Object to store chart instances
let charts = {};

// Initialize Charts and Update Functions
function initializeCharts() {
    for (const symbol in stocks) {
        const sparklineCtx = document.getElementById(`sparkline-${symbol}`).getContext("2d");

        // Create sparkline for each stock
        charts[symbol] = new Chart(sparklineCtx, {
            type: "line",
            data: {
                labels: Array.from({ length: 12 }, (_, i) => i + 1), // Sample x-axis labels
                datasets: [{
                    label: "Price",
                    data: Array.from({ length: 12 }, () => stocks[symbol].price + (Math.random() - 0.5) * 2), // Random data
                    fill: false,
                    borderColor: "#3498db",
                    tension: 0.1,
                    borderWidth: 1,
                    pointRadius: 1
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
    }
}

// Update stock prices every 5 seconds
function updatePrices() {
    for (const symbol in stocks) {
        const stock = stocks[symbol];
        const change = (Math.random() - 0.5) * 2; // Random change between -1 and 1
        stock.price += change;
        stock.percent = ((change / stock.price) * 100).toFixed(2);

        // Update the DOM elements for price and percent change
        document.querySelector(`#ticker-${symbol} .price`).textContent = stock.price.toFixed(2);
        document.querySelector(`#ticker-${symbol} .percent`).textContent = `${stock.percent}%`;

        // Update stock card data
        document.querySelector(`#card-${symbol} .price`).textContent = stock.price.toFixed(2);
        document.querySelector(`#card-${symbol} .change`).textContent = `${stock.percent}%`;

        // Update the sparkline chart data
        const chart = charts[symbol];
        chart.data.datasets[0].data.push(stock.price); // Add the new price
        if (chart.data.datasets[0].data.length > 12) {
            chart.data.datasets[0].data.shift(); // Keep only the last 12 data points
        }
        chart.update();
    }
}

// Toggle More Details and render a detailed chart when expanded
function showDetails(symbol) {
    const details = document.getElementById(`details-${symbol}`);
    
    if (details.style.display === "block") {
        details.style.display = "none"; // Collapse
    } else {
        details.style.display = "block"; // Expand

        // Check if the detailed chart already exists, if not, create it
        if (!details.dataset.chartInitialized) {
            const chartCtx = document.getElementById(`chart-${symbol}`).getContext("2d");
            new Chart(chartCtx, {
                type: "line",
                data: {
                    labels: Array.from({ length: 30 }, (_, i) => i + 1), // Days of the month
                    datasets: [{
                        label: "Price History",
                        data: Array.from({ length: 30 }, () => stocks[symbol].price + (Math.random() - 0.5) * 5), // Random data
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
                        x: { title: { display: true, text: "Days" } },
                        y: { title: { display: true, text: "Price" } }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: { mode: "index", intersect: false }
                    }
                }
            });

            // Mark as initialized to avoid re-creating the chart
            details.dataset.chartInitialized = "true";
        }
    }
}

// Initialize charts and set price updates
document.addEventListener("DOMContentLoaded", () => {
    initializeCharts();
    setInterval(updatePrices, 5000); // Update prices every 5 seconds
});
