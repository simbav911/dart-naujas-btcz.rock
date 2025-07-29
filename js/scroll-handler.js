document.addEventListener('DOMContentLoaded', function() {
    const priceTickers = document.querySelectorAll('.price-ticker-container');
    const SCROLL_THRESHOLD = 377.95; // 10 cm in pixels

    function getResponsiveScale() {
        if (window.innerWidth <= 768) {
            return 'scale(0.7)';
        } else if (window.innerWidth >= 1200) {
            return 'scale(0.9)';
        }
        return 'scale(0.8)';
    }

    function getResponsiveRight() {
        return window.innerWidth <= 768 ? '1cm' : '2cm';
    }

    function updateTickerVisibility() {
        const scrollPosition = window.scrollY;
        const scale = getResponsiveScale();
        const rightPosition = getResponsiveRight();

        priceTickers.forEach(ticker => {
            if (scrollPosition > SCROLL_THRESHOLD) {
                ticker.style.opacity = '0';
                ticker.style.transform = `${scale} translateY(-20px)`;
                ticker.style.pointerEvents = 'none';
                ticker.style.visibility = 'hidden';
            } else {
                ticker.style.opacity = '1';
                ticker.style.transform = `${scale} translateY(0)`;
                ticker.style.pointerEvents = 'auto';
                ticker.style.visibility = 'visible';
            }
            // Always maintain responsive distance from right
            ticker.style.right = rightPosition;
        });
    }

    window.addEventListener('scroll', updateTickerVisibility);
    window.addEventListener('resize', updateTickerVisibility);
    updateTickerVisibility(); // Initial check
});
