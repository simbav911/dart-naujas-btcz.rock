// Debug logging for Decap CMS authentication
console.log('Debug mode enabled for Decap CMS');

window.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Monitor hash changes for OAuth callback
    window.addEventListener('hashchange', function() {
        console.log('Hash changed:', window.location.hash);
        if (window.location.hash && window.location.hash.includes('token=')) {
            console.log('OAuth callback detected');
        }
    });

    // Log CMS initialization
    if (window.CMS) {
        console.log('CMS object found');
        
        // Log authentication status changes
        window.CMS.registerEventListener({
            name: 'auth',
            handler: function(event) {
                console.log('Auth event:', event);
                // Log full authentication details
                if (event.token) {
                    console.log('Authentication successful');
                }
            },
        });
        
        // Enhanced error logging
        window.CMS.registerEventListener({
            name: 'error',
            handler: function(error) {
                console.error('CMS Error:', {
                    message: error.message,
                    stack: error.stack,
                    details: error
                });
            },
        });

        // Log initialization details
        console.log('CMS Configuration:', {
            backend: window.CMS.getConfig().backend,
            site_domain: window.location.hostname,
            current_url: window.location.href,
            pathname: window.location.pathname
        });
    } else {
        console.error('CMS object not found - check script loading');
    }
});
