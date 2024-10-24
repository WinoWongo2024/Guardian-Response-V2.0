// Real-time clock
function updateClock() {
    const clock = document.getElementById('bbc-clock');
    const now = new Date();
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    clock.innerHTML = `${hours}:${minutes}`;
}
setInterval(updateClock, 1000);

// Menu toggle for mobile
document.getElementById('menu-toggle').addEventListener('click', function() {
    const nav = document.querySelector('.nav-links');
    nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
});
