// Debug logging for Decap CMS authentication
console.log('Debug mode enabled for Decap CMS');

window.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    console.log('Current URL:', window.location.href);
    console.log('Hostname:', window.location.hostname);
    console.log('Pathname:', window.location.pathname);
    
    // Monitor hash changes for OAuth callback
    window.addEventListener('hashchange', function() {
        console.log('Hash changed:', window.location.hash);
    });

    // Wait for CMS to be available
    const waitForCMS = setInterval(function() {
        if (window.CMS) {
            clearInterval(waitForCMS);
            console.log('CMS object found');
            
            // Register event listeners
            window.CMS.registerEventListener({
                name: 'auth',
                handler: function(event) {
                    console.log('Auth event:', {
                        type: event.type,
                        error: event.error,
                    });
                }
            });

            window.CMS.registerEventListener({
                name: 'error',
                handler: function(error) {
                    console.error('CMS Error:', {
                        message: error.message,
                        details: error
                    });
                }
            });

            // Log initialization
            window.CMS.registerEventListener({
                name: 'init',
                handler: function() {
                    console.log('CMS Initialized');
                }
            });
        }
    }, 100);
});

// Handle authentication errors
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
