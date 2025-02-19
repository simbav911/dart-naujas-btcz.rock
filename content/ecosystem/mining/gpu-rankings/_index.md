---
title: "BitcoinZ GPU Mining Rankings"
description: "Comprehensive comparison of GPU mining performance for BitcoinZ (BTCZ)"
date: 2024-02-19
draft: false
---

<div class="gpu-rankings">
    <div class="controls">
        <input type="text" id="searchGPU" class="form-control" placeholder="Search GPU...">
        <select id="sortBy" class="form-control">
            <option value="hashrate">Sort by Hashrate</option>
            <option value="profit">Sort by Daily Profit</option>
            <option value="efficiency">Sort by Efficiency (H/W)</option>
            <option value="price">Sort by Price</option>
        </select>
    </div>

    <div class="power-settings">
        <label for="powerCost">Power Cost ($/kWh):</label>
        <input type="number" id="powerCost" value="0.10" step="0.01" class="form-control">
    </div>

    <table id="gpuTable" class="gpu-table">
        <thead>
            <tr>
                <th>Model</th>
                <th>Release Date</th>
                <th>Hashrate (h/s)</th>
                <th>Power (W)</th>
                <th>Efficiency (H/W)</th>
                <th>Price ($)</th>
                <th>Revenue 24h ($)</th>
                <th>Power Cost 24h ($)</th>
                <th>Profit 24h ($)</th>
            </tr>
        </thead>
        <tbody>
            <!-- Will be populated by JavaScript -->
        </tbody>
    </table>
</div>

<style>
.gpu-rankings {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 1rem;
}

.controls {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
}

.controls > * {
    flex: 1;
}

.power-settings {
    margin-bottom: 1rem;
}

.gpu-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
    background: white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.gpu-table th,
.gpu-table td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #eee;
}

.gpu-table th {
    background: #f8f9fa;
    font-weight: 600;
    cursor: pointer;
}

.gpu-table tr:hover {
    background: #f8f9fa;
}

.form-control {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
}

.positive {
    color: #28a745;
}

.negative {
    color: #dc3545;
}
</style>

<script>
const gpuData = [
    {
        model: "GeForce RTX 4070 Ti",
        releaseDate: "Jan 2023",
        hashrate: 135.00,
        power: 160,
        price: 879.99
    },
    {
        model: "GeForce RTX 4070",
        releaseDate: "Apr 2023",
        hashrate: 105.00,
        power: 130,
        price: 549.99
    },
    {
        model: "GeForce RTX 4080",
        releaseDate: "Nov 2022",
        hashrate: 188.00,
        power: 240,
        price: 1498.07
    },
    {
        model: "GeForce RTX 4080 Super",
        releaseDate: "Jan 2024",
        hashrate: 185.00,
        power: 240,
        price: 1099.99
    },
    {
        model: "GeForce RTX 4070 Super",
        releaseDate: "Jan 2024",
        hashrate: 133.00,
        power: 180,
        price: 609.99
    },
    {
        model: "GeForce RTX 4060 Ti",
        releaseDate: "May 2023",
        hashrate: 90.00,
        power: 130,
        price: 404.99
    },
    {
        model: "Radeon RX 6600 XT",
        releaseDate: "Aug 2021",
        hashrate: 40.00,
        power: 70,
        price: 439.99
    },
    {
        model: "GeForce RTX 4060",
        releaseDate: "Jun 2023",
        hashrate: 70.00,
        power: 110,
        price: 299.99
    },
    // Add all other GPUs here...
];

let btczPrice = 0;
let networkHashrate = 0;

async function fetchBTCZPrice() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoinz&vs_currencies=usd');
        const data = await response.json();
        btczPrice = data.bitcoinz.usd;
        updateTable();
    } catch (error) {
        console.error('Error fetching BTCZ price:', error);
    }
}

async function fetchNetworkStats() {
    try {
        const response = await fetch('https://data.miningpoolstats.stream/data/bitcoinz.js?t=' + Date.now());
        const data = await response.json();
        networkHashrate = data.hashrate;
        updateTable();
    } catch (error) {
        console.error('Error fetching network stats:', error);
    }
}

function calculateProfits(gpu, powerCost) {
    const dailyBTCZ = (gpu.hashrate / networkHashrate) * 7200 * 24;
    const revenue = dailyBTCZ * btczPrice;
    const powerCostDay = (gpu.power * 24 * powerCost) / 1000;
    const profit = revenue - powerCostDay;
    
    return {
        revenue: revenue,
        powerCost: powerCostDay,
        profit: profit,
        efficiency: gpu.hashrate / gpu.power
    };
}

function updateTable() {
    const tbody = document.querySelector('#gpuTable tbody');
    const powerCost = parseFloat(document.getElementById('powerCost').value);
    const searchTerm = document.getElementById('searchGPU').value.toLowerCase();
    const sortBy = document.getElementById('sortBy').value;
    
    // Sort and filter data
    let filteredData = gpuData
        .filter(gpu => gpu.model.toLowerCase().includes(searchTerm))
        .map(gpu => {
            const calculations = calculateProfits(gpu, powerCost);
            return { ...gpu, ...calculations };
        });
    
    // Sort data
    filteredData.sort((a, b) => {
        switch(sortBy) {
            case 'hashrate': return b.hashrate - a.hashrate;
            case 'profit': return b.profit - a.profit;
            case 'efficiency': return b.efficiency - a.efficiency;
            case 'price': return a.price - b.price;
            default: return b.hashrate - a.hashrate;
        }
    });
    
    // Clear table
    tbody.innerHTML = '';
    
    // Populate table
    filteredData.forEach(gpu => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${gpu.model}</td>
            <td>${gpu.releaseDate}</td>
            <td>${gpu.hashrate.toFixed(2)}</td>
            <td>${gpu.power}</td>
            <td>${(gpu.efficiency).toFixed(2)}</td>
            <td>$${gpu.price.toFixed(2)}</td>
            <td>$${gpu.revenue.toFixed(2)}</td>
            <td>$${gpu.powerCost.toFixed(2)}</td>
            <td class="${gpu.profit >= 0 ? 'positive' : 'negative'}">$${gpu.profit.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchBTCZPrice();
    fetchNetworkStats();
    
    // Add event listeners
    document.getElementById('searchGPU').addEventListener('input', updateTable);
    document.getElementById('sortBy').addEventListener('change', updateTable);
    document.getElementById('powerCost').addEventListener('input', updateTable);
    
    // Update data every 5 minutes
    setInterval(() => {
        fetchBTCZPrice();
        fetchNetworkStats();
    }, 300000);
});
</script>
