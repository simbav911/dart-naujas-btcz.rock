// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/js/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}


// Animation Control
document.addEventListener('DOMContentLoaded', () => {
    const ANIMATION_COOLDOWN = 4 * 60 * 1000; // 4 minutes
    const lastAnimationTime = localStorage.getItem('lastLogoAnimation');
    const currentTime = Date.now();

    // Function to add sparkle element
    function addSparkle() {
        const logoContainer = document.querySelector('.logo-container');
        if (logoContainer && !logoContainer.querySelector('.sparkle')) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            logoContainer.appendChild(sparkle);
        }
    }

    // Function to start animation
    function startAnimation() {
        addSparkle();
        
        // Add animation classes to both containers
        document.querySelector('.animated-logo').classList.add('animate-logo');
        document.querySelector('.logo-container').classList.add('animate-logo');
        
        localStorage.setItem('lastLogoAnimation', currentTime.toString());
        
        // Remove animations after completion
        setTimeout(() => {
            const sparkle = document.querySelector('.sparkle');
            if (sparkle) {
                sparkle.remove();
            }
            document.querySelector('.animated-logo').classList.remove('animate-logo');
            document.querySelector('.logo-container').classList.remove('animate-logo');
        }, 2000);
    }

    // Check if we should animate
    if (!lastAnimationTime || (currentTime - parseInt(lastAnimationTime)) >= ANIMATION_COOLDOWN) {
        // Slight delay to ensure DOM is ready
        setTimeout(startAnimation, 100);
    }
});
