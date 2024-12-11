document.addEventListener('DOMContentLoaded', function() {
    const priceTicker = document.querySelector('.price-ticker-container');
    
    function updateTickerVisibility() {
        const scrollPosition = window.scrollY;
        const heroHeight = window.innerHeight; // Assuming hero section is full viewport height
        
        if (scrollPosition > heroHeight * 0.15) { // Start hiding at 15% of hero height
            priceTicker.style.opacity = '0';
            priceTicker.style.pointerEvents = 'none';
        } else {
            priceTicker.style.opacity = '1';
            priceTicker.style.pointerEvents = 'auto';
        }
    }

    window.addEventListener('scroll', updateTickerVisibility);
    updateTickerVisibility(); // Initial check
});
