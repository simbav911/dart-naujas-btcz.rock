// GPU data from the provided list
const gpuData = {
    // RTX 5000 Series (2025)
    "GeForce RTX 5090": { hashrate: 280.00, power: 250, price: 1999.99 },
    "GeForce RTX 5080": { hashrate: 240.00, power: 220, price: 1199.99 },
    "GeForce RTX 5070 Ti": { hashrate: 210.00, power: 190, price: 899.99 },
    "GeForce RTX 5070": { hashrate: 180.00, power: 170, price: 699.99 },
    "GeForce RTX 5060 Ti": { hashrate: 150.00, power: 140, price: 499.99 },
    "GeForce RTX 5060": { hashrate: 120.00, power: 120, price: 349.99 },
    
    // RTX 4000 Series (Updated prices 2025)
    "GeForce RTX 4090": { hashrate: 180.00, power: 260, price: 1299.99 },
    "GeForce RTX 4080 Super": { hashrate: 185.00, power: 240, price: 899.99 },
    "GeForce RTX 4080": { hashrate: 188.00, power: 240, price: 799.99 },
    "GeForce RTX 4070 Ti Super": { hashrate: 140.00, power: 200, price: 749.99 },
    "GeForce RTX 4070 Ti": { hashrate: 135.00, power: 160, price: 649.99 },
    "GeForce RTX 4070 Super": { hashrate: 133.00, power: 180, price: 599.99 },
    "GeForce RTX 4070": { hashrate: 105.00, power: 130, price: 499.99 },
    "GeForce RTX 4060 Ti": { hashrate: 90.00, power: 130, price: 349.99 },
    "GeForce RTX 4060": { hashrate: 70.00, power: 110, price: 279.99 },
    
    // AMD 7000 Series (Updated prices 2025)
    "Radeon RX 7900 XTX": { hashrate: 155.00, power: 230, price: 799.99 },
    "Radeon RX 7900 XT": { hashrate: 140.00, power: 210, price: 699.99 },
    "Radeon RX 7800 XT": { hashrate: 120.00, power: 180, price: 499.99 },
    "Radeon RX 7700 XT": { hashrate: 100.00, power: 150, price: 399.99 },
    "Radeon RX 7600": { hashrate: 70.00, power: 120, price: 249.99 },
    
    // Older models (discounted prices)
    "Radeon RX 6950 XT": { hashrate: 90.00, power: 160, price: 399.99 },
    "Radeon RX 6800 XT": { hashrate: 93.00, power: 160, price: 349.99 },
    "Radeon RX 6800": { hashrate: 93.00, power: 160, price: 299.99 },
    "Radeon RX 6700 XT": { hashrate: 57.00, power: 120, price: 249.99 },
    "Radeon RX 6600 XT": { hashrate: 40.00, power: 70, price: 199.99 },
    "Radeon RX 6600": { hashrate: 38.00, power: 70, price: 179.99 },
    "GeForce RTX 3070 Ti": { hashrate: 110.00, power: 180, price: 329.99 },
    "GeForce RTX 3070": { hashrate: 100.00, power: 180, price: 299.99 },
    "GeForce GTX 1660 Ti": { hashrate: 39.00, power: 90, price: 179.99 }
};

// Network data and calculation variables
let networkData = {
    difficulty: 721.80,
    networkHashrate: 33654.00,
    btczPriceUSD: 0.00004045,
    btczPrice24hChange: 3.07
};

// DOM elements
const elements = {};

// Initialize the calculator
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit to ensure DOM is fully loaded
    setTimeout(() => {
        initializeMiningCalculator();
    }, 300);
});

// Function to initialize the mining calculator
function initializeMiningCalculator() {
    console.log('Attempting to initialize mining calculator...');
    
    // Cache DOM elements
    cacheElements();
    
    // Check if we're on the mining calculator page by looking for key elements
    // Use multiple potential selectors for more robust detection
    const calculatorSelectors = [
        '#gpuSetupContainer', 
        '#networkDifficulty',
        '.mining-calculator-container',
        '.calculator-form',
        '#calculateButton'
    ];
    
    const isCalculatorPage = calculatorSelectors.some(selector => 
        document.querySelector(selector) !== null
    );
    
    // Only proceed with initialization if we're on the calculator page
    if (isCalculatorPage) {
        console.log('Mining calculator page detected, initializing calculator');
        
        // Ensure all necessary elements are cached
        if (Object.keys(elements).length === 0) {
            console.log('Re-caching elements...');
            cacheElements();
        }
        
        // Fetch network data
        fetchNetworkData();
        
        // Add event listeners
        addEventListeners();
        
        // Populate GPU comparison table
        populateGPUTable();
        
        // Trigger initial calculation
        setTimeout(() => {
            calculateProfits();
        }, 1000);
        
        // Set up auto-refresh
        setInterval(fetchNetworkData, 300000); // Refresh every 5 minutes
    } else {
        console.log('Not on mining calculator page, skipping initialization');
        
        // If we're not on the calculator page but the URL contains mining-calculator,
        // it's possible the elements haven't loaded yet, so retry after a delay
        if (window.location.href.includes('mining-calculator')) {
            console.log('URL suggests mining calculator page, will retry initialization in 1 second');
            setTimeout(initializeMiningCalculator, 1000);
        }
    }
}

// Cache DOM elements for better performance
function cacheElements() {
    try {
        // List of element IDs to cache
        const elementIds = [
            // Main calculator elements
            'gpuSetupContainer', 'addGpuButton', 'powerCost', 'poolFee', 'calculateButton',
            // Network stats elements
            'networkDifficulty', 'networkHashrate', 'btczPrice',
            // Results elements
            'dailyBTCZ', 'dailyUSD', 'weeklyBTCZ', 'weeklyUSD', 'monthlyBTCZ', 'monthlyUSD',
            // Profit breakdown elements
            'dailyRevenue', 'dailyPowerCost', 'dailyPoolFees', 'dailyNetProfit',
            // Break-even elements
            'breakEvenTime', 'breakEvenPrice',
            // GPU table
            'gpuTableBody'
        ];
        
        // Cache each element, tracking how many were found
        let foundCount = 0;
        elementIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                elements[id] = element;
                foundCount++;
            }
        });
        
        console.log(`Successfully cached ${foundCount}/${elementIds.length} DOM elements`);
        
        // If we found at least some elements but not all, that's probably okay
        // We may be on a page that only has some of the calculator functionality
        if (foundCount > 0 && foundCount < elementIds.length / 2) {
            console.warn('Some mining calculator elements were not found, but will continue with partial functionality');
        }
        
        return foundCount > 0; // Return true if we found at least one element
    } catch (error) {
        console.error('Error caching DOM elements:', error);
        return false;
    }
}

// Populate GPU select dropdown for a specific select element
function populateGPUSelect(selectElement) {
    Object.keys(gpuData).forEach(gpu => {
        const option = document.createElement('option');
        option.value = gpu;
        option.textContent = `${gpu} (${gpuData[gpu].hashrate} Sol/s)`;
        selectElement.appendChild(option);
    });
}

// Fetch network data from API
async function fetchNetworkData() {
    try {
        // Try the direct API endpoint first
        let response;
        try {
            response = await fetch('https://explorer.getbtcz.com/api/mining/info', {
                mode: 'cors',
                headers: {
                    'Accept': 'application/json'
                }
            });
        } catch (corsError) {
            console.warn('Direct API call failed, trying fallback:', corsError);
            // Use hardcoded fallback values
            throw new Error('API call failed, using fallback values');
        }
        
        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        networkData = {
            difficulty: data.difficulty || 721.80,
            networkHashrate: data.networkHashrate || 33654.00,
            btczPriceUSD: data.btczPriceUSD || 0.00004045,
            btczPrice24hChange: data.btczPrice24hChange || 3.07
        };
        
        // Update UI with network data
        updateNetworkDataUI();
        
        // Calculate with new data
        calculateProfits();
        
        // Update GPU table with new price data
        updateGPUTable();
    } catch (error) {
        console.error('Error fetching network data:', error);
        // Use fallback values if API fails
        networkData = {
            difficulty: 721.80,
            networkHashrate: 33654.00,
            btczPriceUSD: 0.00004045,
            btczPrice24hChange: 3.07
        };
        
        // Update UI with fallback data
        updateNetworkDataUI();
        
        // Calculate with fallback data
        calculateProfits();
        
        // Update GPU table with fallback data
        updateGPUTable();
    }
}

// Update network data UI
function updateNetworkDataUI() {
    // Add null checks for each element
    if (elements.networkDifficulty) {
        elements.networkDifficulty.textContent = networkData.difficulty.toFixed(2);
    }
    
    if (elements.networkHashrate) {
        elements.networkHashrate.textContent = `${networkData.networkHashrate.toFixed(2)} Sol/s`;
    }
    
    if (elements.btczPrice) {
        elements.btczPrice.textContent = `$${networkData.btczPriceUSD.toFixed(8)} (${networkData.btczPrice24hChange > 0 ? '+' : ''}${networkData.btczPrice24hChange.toFixed(2)}%)`;
    }
}

// Add event listeners
function addEventListeners() {
    // Add null check before adding event listener
    if (elements.calculateButton) {
        elements.calculateButton.addEventListener('click', calculateProfits);
    }
    
    // Make sure the Add GPU button works correctly
    if (elements.addGpuButton) {
        elements.addGpuButton.addEventListener('click', addGpuSetup);
    } else {
        console.error('Add GPU button not found');
    }
    
    // Add event listener for the first GPU setup
    const firstGpuSetup = document.querySelector('.gpu-setup');
    if (firstGpuSetup) {
        setupGpuEventListeners(firstGpuSetup);
        
        // Populate the first GPU select
        const firstGpuSelect = firstGpuSetup.querySelector('.gpu-select');
        if (firstGpuSelect) {
            populateGPUSelect(firstGpuSelect);
        }
    }
}

// Add a new GPU setup
function addGpuSetup() {
    const gpuSetups = document.querySelectorAll('.gpu-setup');
    const newIndex = gpuSetups.length;
    
    // Create new GPU setup
    const newGpuSetup = document.createElement('div');
    newGpuSetup.className = 'gpu-setup mb-4 p-4 bg-btcz-gray-700 rounded-lg';
    
    // Generate HTML for the new GPU setup
    newGpuSetup.innerHTML = `
        <div class="flex justify-between items-center mb-3">
            <h3 class="text-lg font-semibold">GPU Setup ${newIndex + 1}</h3>
            <button type="button" class="remove-gpu-btn px-2 py-1 bg-red-600 text-white rounded">Remove</button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="input-group">
                <label for="gpuSelect-${newIndex}" class="block mb-2">GPU Model</label>
                <select id="gpuSelect-${newIndex}" class="gpu-select w-full p-2 bg-btcz-gray-800 border border-btcz-gray-600 rounded-lg">
                    <option value="custom">Custom Hashrate</option>
                    <!-- GPU options will be populated by JavaScript -->
                </select>
            </div>
            
            <div class="input-group">
                <label for="gpuCount-${newIndex}" class="block mb-2">Number of GPUs</label>
                <input type="number" id="gpuCount-${newIndex}" class="gpu-count w-full p-2 bg-btcz-gray-800 border border-btcz-gray-600 rounded-lg" value="1" min="1">
            </div>
            
            <div class="input-group custom-hashrate-group">
                <label for="customHashrate-${newIndex}" class="block mb-2">Hashrate (Sol/s)</label>
                <input type="number" id="customHashrate-${newIndex}" class="custom-hashrate w-full p-2 bg-btcz-gray-800 border border-btcz-gray-600 rounded-lg" value="100">
            </div>
            
            <div class="input-group">
                <label for="powerConsumption-${newIndex}" class="block mb-2">Power Consumption (W)</label>
                <input type="number" id="powerConsumption-${newIndex}" class="power-consumption w-full p-2 bg-btcz-gray-800 border border-btcz-gray-600 rounded-lg" value="150">
            </div>
        </div>
    `;
    
    // Add the new GPU setup to the container
    elements.gpuSetupContainer.appendChild(newGpuSetup);
    
    // Populate the GPU select dropdown
    const gpuSelect = newGpuSetup.querySelector('.gpu-select');
    populateGPUSelect(gpuSelect);
    
    // Add event listeners to the new GPU setup
    setupGpuEventListeners(newGpuSetup);
    
    // Add event listener to the remove button
    const removeButton = newGpuSetup.querySelector('.remove-gpu-btn');
    removeButton.addEventListener('click', () => {
        elements.gpuSetupContainer.removeChild(newGpuSetup);
        calculateProfits();
    });
    
    // Show the remove button for the first GPU setup if there are now multiple setups
    if (gpuSetups.length === 1) {
        const firstRemoveButton = gpuSetups[0].querySelector('.remove-gpu-btn');
        if (firstRemoveButton) {
            firstRemoveButton.classList.remove('hidden');
        }
    }
    
    // Recalculate profits
    calculateProfits();
}

// Set up event listeners for a GPU setup
function setupGpuEventListeners(gpuSetup) {
    const gpuSelect = gpuSetup.querySelector('.gpu-select');
    const customHashrateGroup = gpuSetup.querySelector('.custom-hashrate-group');
    const customHashrate = gpuSetup.querySelector('.custom-hashrate');
    const powerConsumption = gpuSetup.querySelector('.power-consumption');
    
    // Event listener for GPU select change
    gpuSelect.addEventListener('change', () => {
        const selectedGPU = gpuSelect.value;
        
        if (selectedGPU === 'custom') {
            // Show custom hashrate input
            customHashrateGroup.style.display = 'block';
        } else {
            // Hide custom hashrate input and set values based on selected GPU
            customHashrateGroup.style.display = 'none';
            
            // Set power consumption based on selected GPU
            powerConsumption.value = gpuData[selectedGPU].power;
        }
        
        // Recalculate profits
        calculateProfits();
    });
    
    // Event listeners for input changes
    customHashrate.addEventListener('change', calculateProfits);
    powerConsumption.addEventListener('change', calculateProfits);
    gpuSetup.querySelector('.gpu-count').addEventListener('change', calculateProfits);
}

// Function to calculate profits with default values (fallback when elements are missing)
function calculateWithDefaultValues(powerCost, poolFeePercent) {
    console.log('Using default values for mining calculator');
    
    // Default values for calculation
    const defaultHashrate = 100; // Sol/s
    const defaultPowerConsumption = 150; // Watts
    
    // Calculate daily power cost in USD
    const dailyPowerCostUSD = (defaultPowerConsumption * 24 * powerCost) / 1000;
    
    // Calculate daily BTCZ mined
    const blocksPerDay = 24 * 60 * 60 / 150;
    const blockReward = 12500;
    const dailyBTCZ = (defaultHashrate / networkData.networkHashrate) * blocksPerDay * blockReward;
    
    // Calculate weekly and monthly BTCZ
    const weeklyBTCZ = dailyBTCZ * 7;
    const monthlyBTCZ = dailyBTCZ * 30;
    
    // Calculate revenue
    const dailyRevenueUSD = dailyBTCZ * networkData.btczPriceUSD;
    const weeklyUSD = weeklyBTCZ * networkData.btczPriceUSD;
    const monthlyUSD = monthlyBTCZ * networkData.btczPriceUSD;
    
    // Calculate pool fees
    const dailyPoolFeesUSD = dailyRevenueUSD * (poolFeePercent / 100);
    
    // Calculate net profit
    const dailyNetProfitUSD = dailyRevenueUSD - dailyPowerCostUSD - dailyPoolFeesUSD;
    
    // Update UI with calculated values
    updateResultsUI(
        dailyBTCZ, dailyRevenueUSD, dailyPowerCostUSD, dailyPoolFeesUSD, dailyNetProfitUSD,
        weeklyBTCZ, weeklyUSD, monthlyBTCZ, monthlyUSD
    );
    
    // Calculate break-even time (ROI)
    // We're using a default investment of $500 for this calculation
    calculateBreakEven(500, dailyNetProfitUSD);
}

// Calculate mining profits
function calculateProfits() {
    try {
        console.log('Calculating mining profits...');
        
        // Get global input values with safe defaults
        const powerCost = elements.powerCost ? parseFloat(elements.powerCost.value) || 0.1 : 0.1;
        const poolFeePercent = elements.poolFee ? parseFloat(elements.poolFee.value) || 1 : 1;
        
        // Get all GPU setups
        const gpuSetups = document.querySelectorAll('.gpu-setup');
        
        // If no GPU setups are found, try to use default values
        if (!gpuSetups || gpuSetups.length === 0) {
            console.warn('No GPU setups found, using default values for calculation');
            // Use a predefined default setup for calculations
            calculateWithDefaultValues(powerCost, poolFeePercent);
            return;
        }
        
        // Initialize totals
        let totalHashrate = 0;
        let totalPowerConsumption = 0;
        let totalInvestment = 0;
        
        // Calculate totals from all GPU setups
        gpuSetups.forEach(setup => {
            try {
                const gpuSelect = setup.querySelector('.gpu-select');
                if (!gpuSelect) {
                    console.warn('GPU select not found in setup, skipping');
                    return;
                }
                
                const gpuCountElement = setup.querySelector('.gpu-count');
                const gpuCount = gpuCountElement ? (parseInt(gpuCountElement.value) || 1) : 1;
                const selectedGPU = gpuSelect.value;
                
                let setupHashrate, setupPowerConsumption, setupInvestment;
                
                if (selectedGPU === 'custom') {
                    const customHashrateElement = setup.querySelector('.custom-hashrate');
                    const powerConsumptionElement = setup.querySelector('.power-consumption');
                    
                    setupHashrate = customHashrateElement ? (parseFloat(customHashrateElement.value) || 100) : 100;
                    setupPowerConsumption = powerConsumptionElement ? (parseFloat(powerConsumptionElement.value) || 150) : 150;
                    setupInvestment = 0; // No investment calculation for custom setup
                } else if (gpuData[selectedGPU]) {
                    setupHashrate = gpuData[selectedGPU].hashrate;
                    setupPowerConsumption = gpuData[selectedGPU].power;
                    setupInvestment = gpuData[selectedGPU].price;
                } else {
                    // Fallback to default values if GPU data is missing
                    console.warn(`GPU data not found for ${selectedGPU}, using defaults`);
                    setupHashrate = 100;
                    setupPowerConsumption = 150;
                    setupInvestment = 500;
                }
                
                // Add to totals
                totalHashrate += setupHashrate * gpuCount;
                totalPowerConsumption += setupPowerConsumption * gpuCount;
                totalInvestment += setupInvestment * gpuCount;
            } catch (setupError) {
                console.error('Error processing GPU setup:', setupError);
                // Continue with other setups
            }
        });
        
        // If we ended up with no hashrate (due to errors), use default values
        if (totalHashrate <= 0) {
            console.warn('No valid hashrate calculated, using default values');
            calculateWithDefaultValues(powerCost, poolFeePercent);
            return;
        }
        
        // Calculate daily power cost in USD
        const dailyPowerCostUSD = (totalPowerConsumption * 24 * powerCost) / 1000;
        
        // Calculate daily BTCZ mined
        const blocksPerDay = 24 * 60 * 60 / 150;
        const blockReward = 12500;
        const dailyBTCZ = (totalHashrate / networkData.networkHashrate) * blocksPerDay * blockReward;
        
        // Calculate weekly and monthly BTCZ
        const weeklyBTCZ = dailyBTCZ * 7;
        const monthlyBTCZ = dailyBTCZ * 30;
        
        // Calculate revenue
        const dailyRevenueUSD = dailyBTCZ * networkData.btczPriceUSD;
        const weeklyUSD = weeklyBTCZ * networkData.btczPriceUSD;
        const monthlyUSD = monthlyBTCZ * networkData.btczPriceUSD;
        
        // Calculate pool fees
        const dailyPoolFeesUSD = dailyRevenueUSD * (poolFeePercent / 100);
        
        // Calculate net profit
        const dailyNetProfitUSD = dailyRevenueUSD - dailyPowerCostUSD - dailyPoolFeesUSD;
        
        // Update UI with calculated values
        updateResultsUI(
            dailyBTCZ, dailyRevenueUSD, dailyPowerCostUSD, dailyPoolFeesUSD, dailyNetProfitUSD,
            weeklyBTCZ, weeklyUSD, monthlyBTCZ, monthlyUSD
        );
        
        // Calculate break-even time (ROI)
        calculateBreakEven(totalInvestment, dailyNetProfitUSD);
    } catch (error) {
        console.error('Error calculating mining profits:', error);
        // Use default values as fallback
        const powerCost = elements.powerCost ? parseFloat(elements.powerCost.value) || 0.1 : 0.1;
        const poolFeePercent = elements.poolFee ? parseFloat(elements.poolFee.value) || 1 : 1;
        calculateWithDefaultValues(powerCost, poolFeePercent);
    }
}

// Update results UI
function updateResultsUI(dailyBTCZ, dailyRevenueUSD, dailyPowerCostUSD, dailyPoolFeesUSD, dailyNetProfitUSD, 
                        weeklyBTCZ, weeklyUSD, monthlyBTCZ, monthlyUSD) {
    // Update BTCZ and USD values
    elements.dailyBTCZ.textContent = dailyBTCZ.toFixed(2);
    elements.weeklyBTCZ.textContent = weeklyBTCZ.toFixed(2);
    elements.monthlyBTCZ.textContent = monthlyBTCZ.toFixed(2);
    
    // Update USD values with color coding
    updateProfitElement(elements.dailyUSD, dailyNetProfitUSD.toFixed(2));
    updateProfitElement(elements.weeklyUSD, (dailyNetProfitUSD * 7).toFixed(2));
    updateProfitElement(elements.monthlyUSD, (dailyNetProfitUSD * 30).toFixed(2));
    
    // Update profit breakdown
    elements.dailyRevenue.textContent = `$${dailyRevenueUSD.toFixed(2)}`;
    elements.dailyPowerCost.textContent = `$${dailyPowerCostUSD.toFixed(2)}`;
    elements.dailyPoolFees.textContent = `$${dailyPoolFeesUSD.toFixed(2)}`;
    
    // Update net profit with color coding
    updateProfitElement(elements.dailyNetProfit, dailyNetProfitUSD.toFixed(2));
}

// Update profit element with color coding
function updateProfitElement(element, value) {
    element.textContent = `$${value}`;
    
    // Add color coding based on profit/loss
    if (parseFloat(value) > 0) {
        element.style.backgroundColor = '#48bb78'; // Green for profit
    } else {
        element.style.backgroundColor = '#e53e3e'; // Red for loss
    }
}

// Calculate break-even time and price
function calculateBreakEven(investment, dailyProfit) {
    if (dailyProfit <= 0) {
        elements.breakEvenTime.textContent = 'ROI Period: Never (not profitable)';
        
        // Calculate break-even price
        const powerCost = parseFloat(elements.powerCost.value) || 0.1;
        const poolFeePercent = parseFloat(elements.poolFee.value) || 1;
        
        // Get all GPU setups
        const gpuSetups = document.querySelectorAll('.gpu-setup');
        
        // Initialize totals
        let totalHashrate = 0;
        let totalPowerConsumption = 0;
        
        // Calculate totals from all GPU setups
        gpuSetups.forEach(setup => {
            const gpuSelect = setup.querySelector('.gpu-select');
            const gpuCount = parseInt(setup.querySelector('.gpu-count').value) || 1;
            const selectedGPU = gpuSelect.value;
            
            let setupHashrate, setupPowerConsumption;
            
            if (selectedGPU === 'custom') {
                setupHashrate = parseFloat(setup.querySelector('.custom-hashrate').value) || 100;
                setupPowerConsumption = parseFloat(setup.querySelector('.power-consumption').value) || 150;
            } else {
                setupHashrate = gpuData[selectedGPU].hashrate;
                setupPowerConsumption = gpuData[selectedGPU].power;
            }
            
            // Add to totals
            totalHashrate += setupHashrate * gpuCount;
            totalPowerConsumption += setupPowerConsumption * gpuCount;
        });
        
        const dailyPowerCostUSD = (totalPowerConsumption * 24 * powerCost) / 1000;
        
        const blocksPerDay = 24 * 60 * 60 / 150;
        const blockReward = 12500;
        const dailyBTCZ = (totalHashrate / networkData.networkHashrate) * blocksPerDay * blockReward;
        
        // Calculate minimum price needed to break even on electricity
        const breakEvenPrice = dailyPowerCostUSD / (dailyBTCZ * (1 - poolFeePercent / 100));
        
        elements.breakEvenPrice.textContent = `Break-even BTCZ Price: $${breakEvenPrice.toFixed(8)}`;
    } else {
        const daysToBreakEven = investment / dailyProfit;
        const yearsToBreakEven = daysToBreakEven / 365;
        
        if (yearsToBreakEven < 1) {
            elements.breakEvenTime.textContent = `ROI Period: ${Math.ceil(daysToBreakEven)} days`;
        } else {
            elements.breakEvenTime.textContent = `ROI Period: ${yearsToBreakEven.toFixed(1)} years`;
        }
        
        elements.breakEvenPrice.textContent = `Break-even BTCZ Price: $${networkData.btczPriceUSD.toFixed(8)}`;
    }
}

// Populate GPU comparison table
function populateGPUTable() {
    elements.gpuTableBody.innerHTML = '';
    
    Object.keys(gpuData).forEach(gpu => {
        const row = document.createElement('tr');
        row.className = 'border-t border-btcz-gray-700';
        
        // Calculate daily revenue and profit
        const hashrate = gpuData[gpu].hashrate;
        const power = gpuData[gpu].power;
        const price = gpuData[gpu].price;
        
        row.innerHTML = `
            <td class="px-4 py-3">${gpu}</td>
            <td class="px-4 py-3">${hashrate.toFixed(2)}</td>
            <td class="px-4 py-3">${power}</td>
            <td class="px-4 py-3">$${price.toFixed(2)}</td>
            <td class="px-4 py-3" id="revenue-${gpu.replace(/\s+/g, '-')}">-</td>
            <td class="px-4 py-3" id="profit-${gpu.replace(/\s+/g, '-')}">-</td>
        `;
        
        elements.gpuTableBody.appendChild(row);
    });
}

// Update GPU table with current network data
function updateGPUTable() {
    const powerCost = parseFloat(elements.powerCost.value) || 0.1;
    const poolFeePercent = parseFloat(elements.poolFee.value) || 1;
    
    Object.keys(gpuData).forEach(gpu => {
        const hashrate = gpuData[gpu].hashrate;
        const power = gpuData[gpu].power;
        
        // Calculate daily power cost in USD
        const dailyPowerCostUSD = (power * 24 * powerCost) / 1000;
        
        // Calculate daily BTCZ mined
        const blocksPerDay = 24 * 60 * 60 / 150;
        const blockReward = 12500;
        const dailyBTCZ = (hashrate / networkData.networkHashrate) * blocksPerDay * blockReward;
        
        // Calculate revenue
        const dailyRevenueUSD = dailyBTCZ * networkData.btczPriceUSD;
        
        // Calculate pool fees
        const dailyPoolFeesUSD = dailyRevenueUSD * (poolFeePercent / 100);
        
        // Calculate net profit
        const dailyNetProfitUSD = dailyRevenueUSD - dailyPowerCostUSD - dailyPoolFeesUSD;
        
        // Update table cells
        const revenueCell = document.getElementById(`revenue-${gpu.replace(/\s+/g, '-')}`);
        const profitCell = document.getElementById(`profit-${gpu.replace(/\s+/g, '-')}`);
        
        if (revenueCell && profitCell) {
            revenueCell.textContent = `$${dailyRevenueUSD.toFixed(2)}`;
            profitCell.textContent = `$${dailyNetProfitUSD.toFixed(2)}`;
            
            // Add color coding
            if (dailyNetProfitUSD > 0) {
                profitCell.className = 'px-4 py-3 text-green-500';
            } else {
                profitCell.className = 'px-4 py-3 text-red-500';
            }
        }
    });
}
