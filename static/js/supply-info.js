// Cache management for supply data
const SUPPLY_CACHE_KEY = 'btcz_supply_data_v2'; // Updated cache key to force refresh
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
    // Only force update when explicitly requested
    // This allows proper caching for 3 minutes
    
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
            // Verify the data is in the correct format (15B and 21B)
            if (data.totalSupply > 100000000000) {
                console.warn('API returned old format with too many zeros, adjusting...');
                data.totalSupply = data.totalSupply / 10;
                data.maxSupply = data.maxSupply / 10;
            }
            
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
        // Get the exact values from the API response
        const currentSupply = data.totalSupply || 0;
        const maxSupply = data.maxSupply || 21000000000;
        
        console.log('Raw API values:', { currentSupply, maxSupply });
        
        // Use the exact values from the API without any modification
        // The API now returns the correct values: 15037550000 and 21000000000
        
        // Format with commas for readability
        const formattedCurrentSupply = currentSupply.toLocaleString('en-US');
        const formattedMaxSupply = maxSupply.toLocaleString('en-US');
        
        console.log('Display values:', { formattedCurrentSupply, formattedMaxSupply });

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
    
    // Then fetch fresh data if cache is expired or not available
    await updateSupplyData(false);
    
    // Update supply data every 3 minutes
    // Use false for forceUpdate to respect the cache duration
    setInterval(() => updateSupplyData(false), SUPPLY_CACHE_DURATION);
});
