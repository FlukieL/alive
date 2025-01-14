const birthDate = new Date('1993-05-05T00:00:00');

function createYearMarkers() {
    const yearMarkersContainer = document.getElementById('year-markers');
    const totalYears = 109;
    const interval = 10; // Show every 10 years

    for (let year = 0; year <= totalYears; year += interval) {
        const marker = document.createElement('div');
        marker.className = 'year-marker';
        marker.textContent = year;
        marker.style.left = `${(year / totalYears) * 100}%`;
        yearMarkersContainer.appendChild(marker);
    }
}

// Call this function when the page loads
createYearMarkers();

function updateCounter() {
    const now = new Date();
    const diff = now - birthDate;

    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44)) % 12;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24)) % 30;
    const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const seconds = Math.floor(diff / 1000) % 60;
    const milliseconds = diff % 1000;

    document.getElementById('years').textContent = years;
    document.getElementById('months').textContent = months;
    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
    document.getElementById('milliseconds').textContent = milliseconds;

    // Update progress bar and stick figure
    const progressBar = document.getElementById('age-progress');
    const stickFigure = document.querySelector('.stick-figure');
    const progressPercentage = (years / 109) * 100;
    
    progressBar.style.width = `${progressPercentage}%`;
    stickFigure.style.left = `${progressPercentage}%`;
}

setInterval(updateCounter, 1);
