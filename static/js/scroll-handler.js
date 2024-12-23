document.addEventListener('DOMContentLoaded', function() {
    const priceTickers = document.querySelectorAll('.price-ticker-container');
    const SCROLL_THRESHOLD = 377.95; // 10 cm in pixels
    
    function updateTickerVisibility() {
        const scrollPosition = window.scrollY;
        
        priceTickers.forEach(ticker => {
            if (scrollPosition > SCROLL_THRESHOLD) {
                ticker.style.opacity = '0';
                ticker.style.transform = 'translateY(-20px)';
                ticker.style.pointerEvents = 'none';
                ticker.style.visibility = 'hidden';
            } else {
                ticker.style.opacity = '1';
                ticker.style.transform = 'translateY(0)';
                ticker.style.pointerEvents = 'auto';
                ticker.style.visibility = 'visible';
            }
        });
    }

    window.addEventListener('scroll', updateTickerVisibility);
    updateTickerVisibility(); // Initial check
});
