document.addEventListener('DOMContentLoaded', function() {
    const currentDomain = window.location.hostname;
    const allowedDomains = ['btcz.rocks', 'getbtcz.com'];
    
    if (allowedDomains.includes(currentDomain)) {
        // Update canonical URL
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.href = `https://${currentDomain}${window.location.pathname}`;
        
        // Update any absolute URLs in the page
        document.querySelectorAll('a[href^="https://btcz.rocks"], a[href^="https://getbtcz.com"]').forEach(link => {
            const url = new URL(link.href);
            url.hostname = currentDomain;
            link.href = url.toString();
        });
    }
});
