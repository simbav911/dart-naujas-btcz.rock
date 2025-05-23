// Cache management for supply data
const SUPPLY_CACHE_KEY = 'btcz_supply_data';
const SUPPLY_CACHE_DURATION = 180000; // 3 minutes in milliseconds as requested

function getStoredSupplyData() {
    try {
        const stored = localStorage.getItem(SUPPLY_CACHE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && parsed.data) {
                return parsed;
            }
        }
    } catch (error) {
        console.error('Error reading supply data from localStorage:', error);
    }
    return null;
}

function storeSupplyData(data) {
    try {
        const cacheData = {
            data: data,
            timestamp: Date.now()
        };
        localStorage.setItem(SUPPLY_CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
        console.error('Error writing supply data to localStorage:', error);
    }
}

async function updateSupplyData(forceUpdate = false) {
    // Check cache first
    const cached = getStoredSupplyData();
    const now = Date.now();

    // Use cache if available and not expired, unless force update is requested
    if (!forceUpdate && cached && (now - cached.timestamp) < SUPPLY_CACHE_DURATION) {
        updateSupplyUI(cached.data);
        return;
    }

    try {
        // For debugging, log that we're fetching data
        console.log('Fetching supply data from API...');
        
        const response = await fetch('https://explorer.getbtcz.com/api/cmc/supply');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Log the raw API response for debugging
        console.log('API Response:', data);
        
        if (data) {
            storeSupplyData(data);
            updateSupplyUI(data);
        } else {
            throw new Error('Invalid data format received from supply API');
        }
    } catch (error) {
        console.error('Error fetching supply data:', error);
        // If fetch fails, try to use cached data even if expired
        if (cached && cached.data) {
            console.log('Using cached supply data due to fetch error');
            updateSupplyUI(cached.data);
        }
    }
}

function updateSupplyUI(data) {
    if (!data) {
        console.error('Invalid data format in updateSupplyUI');
        return;
    }

    try {
        // Get the actual values from the API response
        const currentSupply = data.totalSupply || 0;
        const maxSupply = data.maxSupply || 21000000000;
        
        console.log('Raw API values:', { currentSupply, maxSupply });
        
        // Convert to full numbers
        // Multiply current supply by 1000 to get the actual value based on our testing
        const actualCurrentSupply = Math.round(currentSupply * 1000);
        const actualMaxSupply = maxSupply;
        
        console.log('Actual values:', { actualCurrentSupply, actualMaxSupply });
        
        // Format the full numbers with commas for better readability
        const formattedCurrentSupply = actualCurrentSupply.toLocaleString();
        const formattedMaxSupply = actualMaxSupply.toLocaleString();

        // Update desktop supply info
        const desktopCurrentSupply = document.getElementById('btcz-current-supply');
        if (desktopCurrentSupply) {
            desktopCurrentSupply.textContent = formattedCurrentSupply;
        }

        const desktopMaxSupply = document.getElementById('btcz-max-supply');
        if (desktopMaxSupply) {
            desktopMaxSupply.textContent = formattedMaxSupply;
        }

        // Update mobile supply info
        const mobileCurrentSupply = document.getElementById('btcz-current-supply-mobile');
        if (mobileCurrentSupply) {
            mobileCurrentSupply.textContent = formattedCurrentSupply;
        }

        const mobileMaxSupply = document.getElementById('btcz-max-supply-mobile');
        if (mobileMaxSupply) {
            mobileMaxSupply.textContent = formattedMaxSupply;
        }
    } catch (error) {
        console.error('Error updating supply UI:', error);
    }
}

// Initialize supply data updates
document.addEventListener('DOMContentLoaded', async () => {
    // Try to show cached data immediately
    const cached = getStoredSupplyData();
    if (cached && cached.data) {
        updateSupplyUI(cached.data);
    }
    
    // Then fetch fresh data
    await updateSupplyData(true);
    
    // Update supply data every 3 minutes
    setInterval(() => updateSupplyData(false), SUPPLY_CACHE_DURATION);
});
