const birthDate = new Date('1993-05-05T00:00:00');
const headQuotes = [
    "I can't believe I ate the whole thing",
    "I'll try spinning that's a good trick",
    "Bazinga!",
    "I am using tilt controls!",
    "Let's go bowling!",
    "I'm still alive eyyyya",
    "My power level is beyond your comprehension",
    "Unlock the achievements at my link site",
    "Why would you click me?"
];

function createYearMarkers() {
    const yearMarkersContainer = document.getElementById('year-markers');
    const totalYears = 109;
    const interval = 10;

    for (let year = 0; year <= totalYears; year += interval) {
        const marker = document.createElement('div');
        marker.className = 'year-marker';
        marker.textContent = year;
        marker.style.left = `${(year / totalYears) * 100}%`;
        yearMarkersContainer.appendChild(marker);
    }
}

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

    return years;
}

function animateProgressBar() {
    const progressBar = document.getElementById('age-progress');
    const stickFigure = document.querySelector('.stick-figure');
    const targetYears = updateCounter();
    const targetPercentage = (targetYears / 109) * 100;
    let currentPercentage = 0;
    
    function easeOutCubic(x) {
        return 1 - Math.pow(1 - x, 3);
    }
    
    function animate() {
        if (currentPercentage < targetPercentage) {
            currentPercentage += (targetPercentage - currentPercentage) * 0.015;
            
            if (Math.abs(targetPercentage - currentPercentage) < 0.01) {
                currentPercentage = targetPercentage;
            }
            
            const easedPercentage = easeOutCubic(currentPercentage / targetPercentage) * targetPercentage;
            progressBar.style.width = `${easedPercentage}%`;
            stickFigure.style.left = `${easedPercentage}%`;
            
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

function init() {
    createYearMarkers();
    updateCounter();
    setInterval(updateCounter, 1);
    animateProgressBar();
    setupHeadClick();
}

function setupHeadClick() {
    const head = document.getElementById('moving-head');
    const bubble = document.getElementById('head-bubble');
    let timeoutId;
    let lastQuoteIndex = -1;

    head.addEventListener('click', () => {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * headQuotes.length);
        } while (randomIndex === lastQuoteIndex && headQuotes.length > 1);
        
        lastQuoteIndex = randomIndex;
        bubble.textContent = headQuotes[randomIndex];
        bubble.classList.add('visible');

        if (timeoutId) clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            bubble.classList.remove('visible');
        }, 3000);
    });
}

window.addEventListener('load', init);
