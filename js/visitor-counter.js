// Function to get visitor counts from localStorage or set default
function getStoredCount(key, defaultValue = 0) {
    const stored = localStorage.getItem(key);
    return stored ? parseInt(stored) : defaultValue;
}

// Function to store count in localStorage
function storeCount(key, value) {
    localStorage.setItem(key, value.toString());
}

// Function to format numbers
function formatNumber(num) {
    return new Intl.NumberFormat().format(num);
}

// Function to get today's date in YYYY-MM-DD format
function getTodayKey() {
    return new Date().toISOString().slice(0, 10);
}

// Function to get current week number
function getCurrentWeekKey() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const week = Math.floor((now - start) / (7 * 24 * 60 * 60 * 1000));
    return `${now.getFullYear()}-W${week}`;
}

// Function to get current month in YYYY-MM format
function getCurrentMonthKey() {
    return new Date().toISOString().slice(0, 7);
}

// Function to update visitor count display
function updateDisplay(elementId, count) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = formatNumber(count);
    }
}

// Function to increment counter
async function incrementCounter(counterKey) {
    try {
        const response = await fetch(`https://api.countapi.xyz/hit/btcz.rocks/${counterKey}`);
        const data = await response.json();
        return data.value;
    } catch (error) {
        console.error('Error incrementing counter:', error);
        // Fallback to local storage if API fails
        const currentCount = getStoredCount(counterKey) + 1;
        storeCount(counterKey, currentCount);
        return currentCount;
    }
}

// Initialize all counters
async function initializeCounters() {
    const todayKey = getTodayKey();
    const weekKey = getCurrentWeekKey();
    const monthKey = getCurrentMonthKey();

    // Check if already visited today
    const visitedToday = localStorage.getItem('lastVisit') === todayKey;
    if (!visitedToday) {
        // Update visit timestamp
        localStorage.setItem('lastVisit', todayKey);

        // Increment counters
        const todayCount = await incrementCounter(`today-${todayKey}`);
        const weekCount = await incrementCounter(`week-${weekKey}`);
        const monthCount = await incrementCounter(`month-${monthKey}`);

        // Update displays
        updateDisplay('today-visitors', todayCount);
        updateDisplay('week-visitors', weekCount);
        updateDisplay('month-visitors', monthCount);
    } else {
        // Just display current counts without incrementing
        const todayCount = await fetch(`https://api.countapi.xyz/get/btcz.rocks/today-${todayKey}`)
            .then(res => res.json())
            .then(data => data.value)
            .catch(() => getStoredCount(`today-${todayKey}`));

        const weekCount = await fetch(`https://api.countapi.xyz/get/btcz.rocks/week-${weekKey}`)
            .then(res => res.json())
            .then(data => data.value)
            .catch(() => getStoredCount(`week-${weekKey}`));

        const monthCount = await fetch(`https://api.countapi.xyz/get/btcz.rocks/month-${monthKey}`)
            .then(res => res.json())
            .then(data => data.value)
            .catch(() => getStoredCount(`month-${monthKey}`));

        updateDisplay('today-visitors', todayCount);
        updateDisplay('week-visitors', weekCount);
        updateDisplay('month-visitors', monthCount);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeCounters);
