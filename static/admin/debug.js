// Debug logging for Decap CMS authentication
console.log('Debug mode enabled for Decap CMS');

// Debug logging for Decap CMS OAuth flow
console.log('Debug script loaded');

window.addEventListener('load', function() {
    console.log('Window loaded');
    console.log('Window location:', window.location.href);
    console.log('OAuth state:', new URLSearchParams(window.location.hash).get('state'));
    console.log('OAuth token:', new URLSearchParams(window.location.hash).get('access_token'));
    
    // Log CMS initialization
    if (window.CMS) {
        console.log('CMS object found');
        
        // Log authentication status changes
        window.CMS.registerEventListener({
            name: 'auth',
            handler: function(event) {
                console.log('Auth event:', event);
            },
        });
        
        // Log error events
        window.CMS.registerEventListener({
            name: 'error',
            handler: function(error) {
                console.error('CMS Error:', error);
            },
        });
        
        // Watch for CMS events
        window.CMS.registerEventListener({
            name: 'preSave',
            handler: () => console.log('Pre-save event triggered'),
        });
        window.CMS.registerEventListener({
            name: 'postSave',
            handler: () => console.log('Post-save event triggered'),
        });
    } else {
        console.error('CMS object not found');
    }
    
    // Log current location and GitHub OAuth details
    console.log('Current location:', window.location.href);
    console.log('Hostname:', window.location.hostname);
    console.log('Pathname:', window.location.pathname);
});

// Monitor CMS initialization
window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded');
});

// Error tracking
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Global error:', {
        message: msg,
        url: url,
        line: lineNo,
        column: columnNo,
        error: error
    });
    return false;
};

// Network request monitoring
const originalFetch = window.fetch;
window.fetch = function(...args) {
    console.log('Fetch request:', args[0]);
    return originalFetch.apply(this, args)
        .then(response => {
            console.log('Fetch response:', response.status, response.url);
            return response;
        })
        .catch(error => {
            console.error('Fetch error:', error);
            throw error;
        });
};
