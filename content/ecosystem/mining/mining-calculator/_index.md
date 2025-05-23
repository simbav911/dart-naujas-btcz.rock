---
title: "BitcoinZ Mining Calculator"
description: "Calculate your potential mining profits for BitcoinZ (BTCZ) with our advanced mining calculator"
date: 2025-05-23
draft: false
layout: "mining-single"
---

{{< rawhtml >}}

<div class="mining-calculator-container">
    <h1 class="text-3xl font-bold mb-6">BitcoinZ Mining Profitability Calculator</h1>
    
    <div class="network-stats bg-btcz-gray-800 p-4 rounded-lg mb-6">
        <h2 class="text-xl font-semibold mb-3">Current Network Statistics</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="stat-card p-3 bg-btcz-gray-700 rounded-lg">
                <div class="text-sm text-gray-400">Network Difficulty</div>
                <div id="networkDifficulty" class="text-lg font-bold">Loading...</div>
            </div>
            <div class="stat-card p-3 bg-btcz-gray-700 rounded-lg">
                <div class="text-sm text-gray-400">Network Hashrate</div>
                <div id="networkHashrate" class="text-lg font-bold">Loading...</div>
            </div>
            <div class="stat-card p-3 bg-btcz-gray-700 rounded-lg">
                <div class="text-sm text-gray-400">BTCZ Price (USD)</div>
                <div id="btczPrice" class="text-lg font-bold">Loading...</div>
            </div>
        </div>
    </div>
    <div class="calculator-form bg-btcz-gray-800 p-6 rounded-lg mb-6">
        <h2 class="text-xl font-semibold mb-4">Mining Setup</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="input-group">
                <label for="gpuSelect" class="block mb-2">GPU Model</label>
                <select id="gpuSelect" class="w-full p-2 bg-btcz-gray-700 border border-btcz-gray-600 rounded-lg">
                    <option value="custom">Custom Hashrate</option>
                    <!-- GPU options will be populated by JavaScript -->
                </select>
            </div>
            
            <div class="input-group">
                <label for="gpuCount" class="block mb-2">Number of GPUs</label>
                <input type="number" id="gpuCount" class="w-full p-2 bg-btcz-gray-700 border border-btcz-gray-600 rounded-lg" value="1" min="1">
            </div>
            
            <div class="input-group" id="customHashrateGroup">
                <label for="customHashrate" class="block mb-2">Hashrate (Sol/s)</label>
                <input type="number" id="customHashrate" class="w-full p-2 bg-btcz-gray-700 border border-btcz-gray-600 rounded-lg" value="100">
            </div>
            
            <div class="input-group">
                <label for="powerConsumption" class="block mb-2">Power Consumption (W)</label>
                <input type="number" id="powerConsumption" class="w-full p-2 bg-btcz-gray-700 border border-btcz-gray-600 rounded-lg" value="150">
            </div>
            
            <div class="input-group">
                <label for="powerCost" class="block mb-2">Electricity Cost ($/kWh)</label>
                <input type="number" id="powerCost" class="w-full p-2 bg-btcz-gray-700 border border-btcz-gray-600 rounded-lg" value="0.1" step="0.01">
            </div>
            
            <div class="input-group">
                <label for="poolFee" class="block mb-2">Pool Fee (%)</label>
                <input type="number" id="poolFee" class="w-full p-2 bg-btcz-gray-700 border border-btcz-gray-600 rounded-lg" value="1" min="0" max="100" step="0.1">
            </div>
        </div>
        
        <button id="calculateButton" class="mt-4 px-6 py-2 bg-btcz-gold text-btcz-gray-900 font-bold rounded-lg hover:bg-yellow-500 transition-colors">Calculate Profits</button>
    </div>
    <div class="results bg-btcz-gray-800 p-6 rounded-lg">
        <h2 class="text-xl font-semibold mb-4">Mining Profitability Results</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="result-card p-4 bg-btcz-gray-700 rounded-lg">
                <div class="text-sm text-gray-400">Daily</div>
                <div class="flex justify-between mt-2">
                    <div>
                        <div class="text-sm">BTCZ:</div>
                        <div id="dailyBTCZ" class="text-lg font-bold">0.00</div>
                    </div>
                    <div>
                        <div class="text-sm">USD:</div>
                        <div id="dailyUSD" class="text-lg font-bold">$0.00</div>
                    </div>
                </div>
            </div>
            
            <div class="result-card p-4 bg-btcz-gray-700 rounded-lg">
                <div class="text-sm text-gray-400">Weekly</div>
                <div class="flex justify-between mt-2">
                    <div>
                        <div class="text-sm">BTCZ:</div>
                        <div id="weeklyBTCZ" class="text-lg font-bold">0.00</div>
                    </div>
                    <div>
                        <div class="text-sm">USD:</div>
                        <div id="weeklyUSD" class="text-lg font-bold">$0.00</div>
                    </div>
                </div>
            </div>
            
            <div class="result-card p-4 bg-btcz-gray-700 rounded-lg">
                <div class="text-sm text-gray-400">Monthly</div>
                <div class="flex justify-between mt-2">
                    <div>
                        <div class="text-sm">BTCZ:</div>
                        <div id="monthlyBTCZ" class="text-lg font-bold">0.00</div>
                    </div>
                    <div>
                        <div class="text-sm">USD:</div>
                        <div id="monthlyUSD" class="text-lg font-bold">$0.00</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="profit-breakdown bg-btcz-gray-700 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-3">Profit Breakdown (Daily)</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <div class="flex justify-between py-2 border-b border-btcz-gray-600">
                        <span>Revenue:</span>
                        <span id="dailyRevenue" class="font-semibold">$0.00</span>
                    </div>
                    <div class="flex justify-between py-2 border-b border-btcz-gray-600">
                        <span>Power Cost:</span>
                        <span id="dailyPowerCost" class="font-semibold">$0.00</span>
                    </div>
                    <div class="flex justify-between py-2 border-b border-btcz-gray-600">
                        <span>Pool Fees:</span>
                        <span id="dailyPoolFees" class="font-semibold">$0.00</span>
                    </div>
                    <div class="flex justify-between py-2">
                        <span>Net Profit:</span>
                        <span id="dailyNetProfit" class="font-semibold">$0.00</span>
                    </div>
                </div>
                
                <div id="breakEvenContainer" class="bg-btcz-gray-600 p-4 rounded-lg">
                    <h4 class="font-semibold mb-2">Break-even Analysis</h4>
                    <div id="breakEvenTime" class="mb-1">ROI Period: calculating...</div>
                    <div id="breakEvenPrice" class="mb-1">Break-even BTCZ Price: calculating...</div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="gpu-table mt-8">
        <h2 class="text-xl font-semibold mb-4">GPU Comparison Chart</h2>
        <div class="overflow-x-auto">
            <table class="min-w-full bg-btcz-gray-800 rounded-lg">
                <thead>
                    <tr>
                        <th class="px-4 py-3 text-left">Model</th>
                        <th class="px-4 py-3 text-left">Hashrate (Sol/s)</th>
                        <th class="px-4 py-3 text-left">Power (W)</th>
                        <th class="px-4 py-3 text-left">Price ($)</th>
                        <th class="px-4 py-3 text-left">Revenue 24h</th>
                        <th class="px-4 py-3 text-left">Profit 24h</th>
                    </tr>
                </thead>
                <tbody id="gpuTableBody">
                    <!-- GPU data will be populated by JavaScript -->
                </tbody>
            </table>
        </div>
    </div>
</div>

    color: white;
    text-decoration: none;
    border-radius: 5px;
    transition: background 0.3s;
}

.nav-button:hover {
    background: #0056b3;
    text-decoration: none;
}

.mining-calculator {
    max-width: 800px;
    margin: 2rem auto;
    padding: 2rem;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.calculator-section {
    margin-bottom: 2rem;
}

.input-group {
    margin-bottom: 1.5rem;
}

.input-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
}

.form-control {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
}

.results {
    margin-top: 2rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
}

.result-item {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid #eee;
}

.result-item:last-child {
    border-bottom: none;
}

.network-info {
    margin-top: 2rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
}

.info-item {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
}
</style>

<script>
// GPU data from the provided list
const gpuData = {
    "GeForce RTX 4080": { hashrate: 188.00, power: 240, price: 1498.07 },
    "GeForce RTX 4070 Ti": { hashrate: 135.00, power: 160, price: 909.03 },
    "GeForce RTX 4080 Super": { hashrate: 185.00, power: 240, price: 1099.99 },
    "GeForce RTX 4070": { hashrate: 105.00, power: 130, price: 589.99 },
    "GeForce RTX 4070 Super": { hashrate: 133.00, power: 180, price: 847.13 },
    "GeForce RTX 4090": { hashrate: 180.00, power: 260, price: 2153.94 },
    "GeForce RTX 4070 Ti Super": { hashrate: 140.00, power: 200, price: 1701.19 },
    "GeForce RTX 4060 Ti": { hashrate: 90.00, power: 130, price: 599.99 },
    "Radeon RX 7900 XTX": { hashrate: 155.00, power: 230, price: 1152.89 },
    "GeForce RTX 4060": { hashrate: 70.00, power: 110, price: 351.99 },
    "Radeon RX 6600 XT": { hashrate: 40.00, power: 70, price: 439.99 },
    "Radeon RX 6600": { hashrate: 38.00, power: 70, price: 269.99 },
    "GeForce RTX 3070 Ti": { hashrate: 110.00, power: 180, price: 871.20 },
    "Radeon RX 6800 XT": { hashrate: 93.00, power: 160, price: 639.99 },
    "Radeon RX 6800": { hashrate: 93.00, power: 160, price: 834.37 },
    "Radeon RX 6950 XT": { hashrate: 90.00, power: 160, price: 999.99 },
    "GeForce RTX 3070 LHR": { hashrate: 100.00, power: 180, price: 500.00 },
    "GeForce RTX 3070": { hashrate: 100.00, power: 180, price: 500.00 },
    "GeForce GTX 1660 Ti": { hashrate: 39.00, power: 90, price: 435.00 },
    "Radeon RX 6700 XT": { hashrate: 57.00, power: 120, price: 943.93 }
};

// Network data and calculation variables
let networkData = {
    difficulty: 0,
    networkHashrate: 0,
    btczPriceUSD: 0,
    btczPrice24hChange: 0
};

// DOM elements
const elements = {};

// Initialize the calculator
document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    cacheElements();
    
    // Populate GPU select dropdown
    populateGPUSelect();
    
    // Fetch network data
    fetchNetworkData();
    
    // Add event listeners
    addEventListeners();
    
    // Populate GPU comparison table
    populateGPUTable();
    
    // Set up auto-refresh
    setInterval(fetchNetworkData, 300000); // Refresh every 5 minutes
});

// Cache DOM elements for better performance
function cacheElements() {
    elements.gpuSelect = document.getElementById('gpuSelect');
    elements.gpuCount = document.getElementById('gpuCount');
    elements.customHashrate = document.getElementById('customHashrate');
    elements.customHashrateGroup = document.getElementById('customHashrateGroup');
    elements.powerConsumption = document.getElementById('powerConsumption');
    elements.powerCost = document.getElementById('powerCost');
    elements.poolFee = document.getElementById('poolFee');
    elements.calculateButton = document.getElementById('calculateButton');
    
    // Network stats elements
    elements.networkDifficulty = document.getElementById('networkDifficulty');
    elements.networkHashrate = document.getElementById('networkHashrate');
    elements.btczPrice = document.getElementById('btczPrice');
    
    // Results elements
    elements.dailyBTCZ = document.getElementById('dailyBTCZ');
    elements.dailyUSD = document.getElementById('dailyUSD');
    elements.weeklyBTCZ = document.getElementById('weeklyBTCZ');
    elements.weeklyUSD = document.getElementById('weeklyUSD');
    elements.monthlyBTCZ = document.getElementById('monthlyBTCZ');
    elements.monthlyUSD = document.getElementById('monthlyUSD');
    
    // Profit breakdown elements
    elements.dailyRevenue = document.getElementById('dailyRevenue');
    elements.dailyPowerCost = document.getElementById('dailyPowerCost');
    elements.dailyPoolFees = document.getElementById('dailyPoolFees');
    elements.dailyNetProfit = document.getElementById('dailyNetProfit');
    
    // Break-even elements
    elements.breakEvenTime = document.getElementById('breakEvenTime');
    elements.breakEvenPrice = document.getElementById('breakEvenPrice');
    
    // GPU table
    elements.gpuTableBody = document.getElementById('gpuTableBody');
}

// Populate GPU select dropdown
function populateGPUSelect() {
    Object.keys(gpuData).forEach(gpu => {
        const option = document.createElement('option');
        option.value = gpu;
        option.textContent = `${gpu} (${gpuData[gpu].hashrate} Sol/s)`;
        elements.gpuSelect.appendChild(option);
    });
}

// Fetch network data from API
async function fetchNetworkData() {
    try {
        const response = await fetch('https://explorer.getbtcz.com/api/mining/info');
        const data = await response.json();
        
        networkData = {
            difficulty: data.difficulty,
            networkHashrate: data.networkHashrate,
            btczPriceUSD: data.btczPriceUSD,
            btczPrice24hChange: data.btczPrice24hChange
        };
        
        // Update UI with network data
        updateNetworkDataUI();
        
        // Calculate with new data
        calculateProfits();
        
        // Update GPU table with new price data
        updateGPUTable();
    } catch (error) {
        console.error('Error fetching network data:', error);
        elements.networkDifficulty.textContent = 'Error loading data';
        elements.networkHashrate.textContent = 'Error loading data';
        elements.btczPrice.textContent = 'Error loading data';
    }
}

// Update network data UI
function updateNetworkDataUI() {
    elements.networkDifficulty.textContent = networkData.difficulty.toFixed(2);
    elements.networkHashrate.textContent = `${networkData.networkHashrate.toFixed(2)} Sol/s`;
    elements.btczPrice.textContent = `$${networkData.btczPriceUSD.toFixed(8)} (${networkData.btczPrice24hChange > 0 ? '+' : ''}${networkData.btczPrice24hChange.toFixed(2)}%)`;
}

// Add event listeners
function addEventListeners() {
    elements.calculateButton.addEventListener('click', calculateProfits);
    
    elements.gpuSelect.addEventListener('change', () => {
        const selectedGPU = elements.gpuSelect.value;
        
        if (selectedGPU === 'custom') {
            elements.customHashrateGroup.style.display = 'block';
            elements.powerConsumption.value = 150;
        } else {
            elements.customHashrateGroup.style.display = 'none';
            elements.customHashrate.value = gpuData[selectedGPU].hashrate;
            elements.powerConsumption.value = gpuData[selectedGPU].power;
        }
    });
    
    // Trigger change event to set initial state
    elements.gpuSelect.dispatchEvent(new Event('change'));
}

// Calculate mining profits
function calculateProfits() {
    // Get input values
    const selectedGPU = elements.gpuSelect.value;
    const gpuCount = parseInt(elements.gpuCount.value) || 1;
    const powerCost = parseFloat(elements.powerCost.value) || 0.1;
    const poolFeePercent = parseFloat(elements.poolFee.value) || 1;
    
    // Get hashrate and power consumption
    let hashrate, powerConsumption;
    
    if (selectedGPU === 'custom') {
        hashrate = parseFloat(elements.customHashrate.value) || 100;
        powerConsumption = parseFloat(elements.powerConsumption.value) || 150;
    } else {
        hashrate = gpuData[selectedGPU].hashrate;
        powerConsumption = gpuData[selectedGPU].power;
    }
    
    // Calculate total hashrate and power consumption
    const totalHashrate = hashrate * gpuCount;
    const totalPowerConsumption = powerConsumption * gpuCount;
    
    // Calculate daily power cost in USD
    const dailyPowerCostUSD = (totalPowerConsumption * 24 * powerCost) / 1000;
    
    // Calculate daily BTCZ mined
    // Formula: (yourHashrate / networkHashrate) * blocksPerDay * blockReward
    const blocksPerDay = 24 * 60 * 60 / 150; // Assuming 150 seconds block time
    const blockReward = 12500; // Current block reward
    const dailyBTCZ = (totalHashrate / networkData.networkHashrate) * blocksPerDay * blockReward;
    
    // Calculate revenue
    const dailyRevenueUSD = dailyBTCZ * networkData.btczPriceUSD;
    
    // Calculate pool fees
    const dailyPoolFeesUSD = dailyRevenueUSD * (poolFeePercent / 100);
    
    // Calculate net profit
    const dailyNetProfitUSD = dailyRevenueUSD - dailyPowerCostUSD - dailyPoolFeesUSD;
    
    // Calculate weekly and monthly values
    const weeklyBTCZ = dailyBTCZ * 7;
    const weeklyUSD = dailyNetProfitUSD * 7;
    const monthlyBTCZ = dailyBTCZ * 30;
    const monthlyUSD = dailyNetProfitUSD * 30;
    
    // Update results UI
    updateResultsUI(dailyBTCZ, dailyRevenueUSD, dailyPowerCostUSD, dailyPoolFeesUSD, dailyNetProfitUSD, 
                   weeklyBTCZ, weeklyUSD, monthlyBTCZ, monthlyUSD);
    
    // Calculate break-even if GPU is selected
    if (selectedGPU !== 'custom') {
        calculateBreakEven(gpuData[selectedGPU].price * gpuCount, dailyNetProfitUSD);
    } else {
        elements.breakEvenTime.textContent = 'ROI Period: N/A (custom hashrate)';
        elements.breakEvenPrice.textContent = 'Break-even BTCZ Price: N/A';
    }
}

// Update results UI
function updateResultsUI(dailyBTCZ, dailyRevenueUSD, dailyPowerCostUSD, dailyPoolFeesUSD, dailyNetProfitUSD, 
                        weeklyBTCZ, weeklyUSD, monthlyBTCZ, monthlyUSD) {
    // Update BTCZ and USD values
    elements.dailyBTCZ.textContent = dailyBTCZ.toFixed(2);
    elements.dailyUSD.textContent = `$${dailyNetProfitUSD.toFixed(2)}`;
    elements.weeklyBTCZ.textContent = weeklyBTCZ.toFixed(2);
    elements.weeklyUSD.textContent = `$${weeklyUSD.toFixed(2)}`;
    elements.monthlyBTCZ.textContent = monthlyBTCZ.toFixed(2);
    elements.monthlyUSD.textContent = `$${monthlyUSD.toFixed(2)}`;
    
    // Update profit breakdown
    elements.dailyRevenue.textContent = `$${dailyRevenueUSD.toFixed(2)}`;
    elements.dailyPowerCost.textContent = `$${dailyPowerCostUSD.toFixed(2)}`;
    elements.dailyPoolFees.textContent = `$${dailyPoolFeesUSD.toFixed(2)}`;
    elements.dailyNetProfit.textContent = `$${dailyNetProfitUSD.toFixed(2)}`;
    
    // Add color coding for profit/loss
    if (dailyNetProfitUSD > 0) {
        elements.dailyNetProfit.classList.add('text-green-500');
        elements.dailyNetProfit.classList.remove('text-red-500');
    } else {
        elements.dailyNetProfit.classList.add('text-red-500');
        elements.dailyNetProfit.classList.remove('text-green-500');
    }
}

// Calculate break-even time and price
function calculateBreakEven(investment, dailyProfit) {
    if (dailyProfit <= 0) {
        elements.breakEvenTime.textContent = 'ROI Period: Never (not profitable)';
        
        // Calculate break-even price
        const selectedGPU = elements.gpuSelect.value;
        const gpuCount = parseInt(elements.gpuCount.value) || 1;
        const powerCost = parseFloat(elements.powerCost.value) || 0.1;
        const poolFeePercent = parseFloat(elements.poolFee.value) || 1;
        
        const hashrate = gpuData[selectedGPU].hashrate;
        const powerConsumption = gpuData[selectedGPU].power;
        
        const totalHashrate = hashrate * gpuCount;
        const totalPowerConsumption = powerConsumption * gpuCount;
        
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
</script>

{{< /rawhtml >}}
