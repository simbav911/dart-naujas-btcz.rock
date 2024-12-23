async function updatePriceData() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/bitcoinz?tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false');
        const data = await response.json();
        
        if (data.market_data) {
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
    } catch (error) {
        console.error('Error fetching price data:', error);
    }
}

function updateChangeElement(elementId, changeValue) {
    const element = document.getElementById(elementId);
    if (element && changeValue !== undefined) {
        const isPositive = changeValue >= 0;
        element.textContent = `${isPositive ? '+' : ''}${changeValue.toFixed(2)}%`;
        element.className = `ml-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`;
    }
}

// Update price every 60 seconds
updatePriceData();
setInterval(updatePriceData, 60000);
