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

let isDragging = false;
let dragStartX = 0;
let currentPercentage = 0;
let animationFrameId = null;
const progressContainer = document.querySelector('.progress-container');
const stickFigure = document.querySelector('.stick-figure');
const head = document.getElementById('moving-head');
const progressBar = document.getElementById('age-progress');

const headImages = {
    baby: document.getElementById('head-baby'),
    young: document.getElementById('head-young'),
    current: document.getElementById('head-current'),
    old: document.getElementById('head-old')
};

function updateHeadImage(percentage) {
    requestAnimationFrame(() => {
        const currentAgePercentage = (updateCounter() / 109) * 100;
        
        // Baby image shows at the start with a small fade transition
        const babyOpacity = percentage <= 2 ? 1 : 
                           percentage <= 3 ? 1 - (percentage - 2) : 0;
        
        // Young image shows between baby and current age
        const youngOpacity = percentage <= currentAgePercentage && percentage > 2
            ? Math.max(0, Math.min(1, 
                percentage <= 3 ? (percentage - 2) : // Quick fade in from baby
                Math.min(
                    1, // Full opacity for most of young period
                    // Fade out approaching current age
                    percentage < currentAgePercentage - 10 
                        ? 1 
                        : 1 - ((percentage - (currentAgePercentage - 10)) / 10)
                )
            ))
            : 0;
        
        // Old image fades in gradually
        const oldOpacity = percentage >= 60 
            ? Math.max(0, Math.min(1, (percentage - 60) / 8))
            : 0;
        
        // Current image only shows when not in transition zones
        const currentOpacity = percentage > 3 && percentage < 60 && !youngOpacity && !oldOpacity ? 1 : 0;
        
        // Apply opacity values
        headImages.baby.style.opacity = babyOpacity;
        headImages.young.style.opacity = youngOpacity;
        headImages.current.style.opacity = currentOpacity;
        headImages.old.style.opacity = oldOpacity;
    });
}

function updatePositions(percentage) {
    stickFigure.style.left = `${percentage}%`;
    progressBar.style.width = `${percentage}%`;
    updateHeadImage(percentage);
}

function animateProgressBar() {
    if (isDragging) return;
    
    const targetYears = updateCounter();
    const targetPercentage = (targetYears / 109) * 100;
    currentPercentage = parseFloat(stickFigure.style.left) || 0;
    
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    function animate() {
        if (isDragging) return;
        
        if (Math.abs(targetPercentage - currentPercentage) < 0.01) {
            currentPercentage = targetPercentage;
            updatePositions(currentPercentage);
            return;
        }
        
        currentPercentage += (targetPercentage - currentPercentage) * 0.1;
        updatePositions(currentPercentage);
        animationFrameId = requestAnimationFrame(animate);
    }
    
    animate();
}

function handleDragStart(e) {
    if (e.type === 'mousedown' && e.button !== 0) return;
    e.preventDefault();
    
    isDragging = true;
    const touch = e.type === 'touchstart' ? e.touches[0] : e;
    const containerRect = progressContainer.getBoundingClientRect();
    
    dragStartX = touch.clientX - containerRect.left;
    currentPercentage = parseFloat(stickFigure.style.left) || 0;
    
    // Cancel any ongoing animation
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    // Disable transitions
    stickFigure.style.transition = 'none';
    progressBar.style.transition = 'none';
    
    document.addEventListener('mousemove', handleDrag, { passive: false });
    document.addEventListener('touchmove', handleDrag, { passive: false });
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchend', handleDragEnd);
}

function handleDrag(e) {
    if (!isDragging) return;
    e.preventDefault();
    
    const touch = e.type === 'touchmove' ? e.touches[0] : e;
    const containerRect = progressContainer.getBoundingClientRect();
    const currentX = touch.clientX - containerRect.left;
    
    // Calculate percentage directly from current position
    const newPercentage = Math.max(0, Math.min(100, (currentX / containerRect.width) * 100));
    currentPercentage = newPercentage;
    
    updatePositions(newPercentage);
}

function handleDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    
    // Re-enable transitions
    stickFigure.style.transition = 'left 0.5s ease-out';
    progressBar.style.transition = 'width 0.5s ease-out';
    
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('touchmove', handleDrag);
    document.removeEventListener('mouseup', handleDragEnd);
    document.removeEventListener('touchend', handleDragEnd);
    
    // Animate back to current age
    animateProgressBar();
}

function init() {
    createYearMarkers();
    updateCounter();
    setInterval(updateCounter, 1);
    animateProgressBar();
    setupHeadClick();
    
    // Make both head and stick figure body draggable
    head.addEventListener('mousedown', handleDragStart);
    head.addEventListener('touchstart', handleDragStart, { passive: false });
    stickFigure.addEventListener('mousedown', handleDragStart);
    stickFigure.addEventListener('touchstart', handleDragStart, { passive: false });
}

function setupHeadClick() {
    const head = document.getElementById('moving-head');
    const bubble = document.getElementById('head-bubble');
    let timeoutId;
    let lastQuoteIndex = -1;

    head.addEventListener('click', (e) => {
        // Only show quote if it wasn't a drag
        if (isDragging) return;
        
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
