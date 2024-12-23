// Cache management
const CACHE_KEY = 'btcz_price_data';
const CACHE_DURATION = 60000; // 1 minute in milliseconds

function getStoredData() {
    try {
        const stored = localStorage.getItem(CACHE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error('Error reading from localStorage:', error);
    }
    return null;
}

function storeData(data) {
    try {
        const cacheData = {
            data: data,
            timestamp: Date.now()
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
        console.error('Error writing to localStorage:', error);
    }
}

async function updatePriceData(forceUpdate = false) {
    // Check cache first
    const cached = getStoredData();
    const now = Date.now();

    // Use cache if available and not expired, unless force update is requested
    if (!forceUpdate && cached && (now - cached.timestamp) < CACHE_DURATION) {
        updateUI(cached.data);
        return;
    }

    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/bitcoinz?tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false');
        const data = await response.json();
        
        if (data.market_data) {
            storeData(data);
            updateUI(data);
        }
    } catch (error) {
        console.error('Error fetching price data:', error);
        // If fetch fails, try to use cached data even if expired
        if (cached) {
            updateUI(cached.data);
        }
    }
}

function updateUI(data) {
    if (!data?.market_data) return;

    const price = data.market_data.current_price.usd;
    const change24h = data.market_data.price_change_percentage_24h;
    const change7d = data.market_data.price_change_percentage_7d;
    const change30d = data.market_data.price_change_percentage_30d;

    // Update desktop price
    const desktopPrice = document.getElementById('btcz-price');
    if (desktopPrice) {
        desktopPrice.textContent = `$${price.toFixed(8)}`;
    }

    // Update mobile price
    const mobilePrice = document.getElementById('btcz-price-mobile');
    if (mobilePrice) {
        mobilePrice.textContent = `$${price.toFixed(8)}`;
    }
    
    // Update desktop percentage changes
    updateChangeElement('change-24h', change24h);
    updateChangeElement('change-7d', change7d);
    updateChangeElement('change-30d', change30d);

    // Update mobile percentage changes
    updateChangeElement('btcz-change-mobile-24h', change24h);
    updateChangeElement('btcz-change-mobile-7d', change7d);
    updateChangeElement('btcz-change-mobile-30d', change30d);
}

function updateChangeElement(elementId, changeValue) {
    const element = document.getElementById(elementId);
    if (element && changeValue !== undefined) {
        const isPositive = changeValue >= 0;
        element.textContent = `${isPositive ? '+' : ''}${changeValue.toFixed(2)}%`;
        element.className = `ml-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`;
    }
}

// On page load, try to show cached data immediately
const cached = getStoredData();
if (cached) {
    updateUI(cached.data);
}

// Then fetch fresh data
updatePriceData(true);

// Update price every minute
setInterval(() => updatePriceData(false), 60000);
