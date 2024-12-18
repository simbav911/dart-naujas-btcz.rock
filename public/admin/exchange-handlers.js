// Exchange-specific functions
function addTradingPair() {
    const tradingPairsList = document.getElementById('trading-pairs-list');
    const pairDiv = document.createElement('div');
    pairDiv.className = 'flex items-center space-x-2';
    pairDiv.innerHTML = `
        <input type="text" placeholder="BTCZ/BTC" class="trading-pair flex-grow rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500">
        <button type="button" class="remove-item px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">
            Remove
        </button>
    `;
    tradingPairsList.appendChild(pairDiv);

    pairDiv.querySelector('.remove-item').addEventListener('click', () => {
        pairDiv.remove();
    });
}

function addExchangeFeature() {
    const featuresList = document.getElementById('exchange-features-list');
    const featureDiv = document.createElement('div');
    featureDiv.className = 'flex items-center space-x-2';
    featureDiv.innerHTML = `
        <input type="text" placeholder="Enter feature" class="exchange-feature flex-grow rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500">
        <button type="button" class="remove-item px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">
            Remove
        </button>
    `;
    featuresList.appendChild(featureDiv);

    featureDiv.querySelector('.remove-item').addEventListener('click', () => {
        featureDiv.remove();
    });
}

function initExchangeHandlers() {
    const addTradingPairBtn = document.getElementById('add-trading-pair');
    const addFeatureBtn = document.getElementById('add-exchange-feature');

    if (addTradingPairBtn) {
        addTradingPairBtn.addEventListener('click', addTradingPair);
    }
    if (addFeatureBtn) {
        addFeatureBtn.addEventListener('click', addExchangeFeature);
    }
}

function getExchangeData() {
    const data = {
        title: document.getElementById('title').value,
        description: document.getElementById('exchange-description').value,
        website: document.getElementById('exchange-website').value,
        kyc_required: document.getElementById('exchange-kyc').value,
        trading_pairs: [],
        features: []
    };

    // Gather trading pairs
    document.querySelectorAll('.trading-pair').forEach(input => {
        if (input.value.trim()) {
            data.trading_pairs.push(input.value.trim());
        }
    });

    // Gather features
    document.querySelectorAll('.exchange-feature').forEach(input => {
        if (input.value.trim()) {
            data.features.push(input.value.trim());
        }
    });

    return data;
}