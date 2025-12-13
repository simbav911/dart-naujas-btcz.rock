/**
 * Christmas Snowfall Effect
 * Subtle and elegant snowfall animation for BitcoinZ website
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        snowflakeCount: 35,          // Number of snowflakes (subtle amount)
        mobileSnowflakeCount: 15,    // Reduced for mobile performance
        minDuration: 15,             // Minimum animation duration (seconds)
        maxDuration: 30,             // Maximum animation duration (seconds)
        sizes: ['small', 'medium', 'large'],
        animations: ['', 'drift-left', 'sway']
    };

    // Check for reduced motion preference
    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    // Check if mobile device
    function isMobile() {
        return window.innerWidth <= 768;
    }

    // Generate random number between min and max
    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    // Pick random item from array
    function randomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // Create a single snowflake element
    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';

        // Random size
        const size = randomItem(CONFIG.sizes);
        snowflake.classList.add(size);

        // Random animation variant
        const animation = randomItem(CONFIG.animations);
        if (animation) {
            snowflake.classList.add(animation);
        }

        // Random horizontal position
        snowflake.style.left = random(0, 100) + '%';

        // Random animation duration
        const duration = random(CONFIG.minDuration, CONFIG.maxDuration);
        snowflake.style.animationDuration = duration + 's';

        // Random animation delay (stagger the start)
        const delay = random(0, CONFIG.maxDuration);
        snowflake.style.animationDelay = delay + 's';

        return snowflake;
    }

    // Initialize snowfall
    function initSnowfall() {
        // Don't run if user prefers reduced motion
        if (prefersReducedMotion()) {
            return;
        }

        // Create container
        const container = document.createElement('div');
        container.className = 'snowfall-container';
        container.setAttribute('aria-hidden', 'true');

        // Determine number of snowflakes based on device
        const count = isMobile() ? CONFIG.mobileSnowflakeCount : CONFIG.snowflakeCount;

        // Create snowflakes
        for (let i = 0; i < count; i++) {
            const snowflake = createSnowflake();
            container.appendChild(snowflake);
        }

        // Add to page
        document.body.appendChild(container);
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSnowfall);
    } else {
        initSnowfall();
    }
})();
