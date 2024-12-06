console.log('Debug script loaded');

// Function to check CMS loading status
function checkCMSStatus() {
    console.log('Checking CMS status...');
    console.log('window.CMS:', window.CMS);
    console.log('window.StaticCMS:', window.StaticCMS);
    console.log('window.DecapCMS:', window.DecapCMS);
}

// Add global error handler
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

// Check status after window loads
window.addEventListener('load', function() {
    console.log('Window loaded');
    checkCMSStatus();
    
    // Try to initialize CMS
    setTimeout(function() {
        console.log('Attempting CMS initialization...');
        try {
            if (window.StaticCMS) {
                console.log('Found StaticCMS, initializing...');
                window.StaticCMS.init();
            } else if (window.CMS) {
                console.log('Found CMS, initializing...');
                window.CMS.init();
            } else if (window.DecapCMS) {
                console.log('Found DecapCMS, initializing...');
                window.DecapCMS.init();
            } else {
                console.error('No CMS object found');
            }
        } catch (error) {
            console.error('Failed to initialize CMS:', error);
        }
    }, 1000);
});
