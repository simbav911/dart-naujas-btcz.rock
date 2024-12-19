// Check if we're running locally
const isLocalhost = window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1';

const environmentNotice = document.getElementById('environment-notice');
if (!isLocalhost) {
    environmentNotice.textContent = 'Admin panel is only available on localhost';
    document.body.innerHTML = '<div class="container mx-auto px-4 py-8"><h1 class="text-3xl font-bold text-red-600">Access Denied</h1><p>This admin panel is only accessible when running locally.</p></div>';
} else {
    environmentNotice.textContent = 'Running in local development mode';
    
    // Import and initialize the app
    import('./components/app.js')
        .catch(error => {
            console.error('Error loading admin panel:', error);
            document.body.innerHTML = `<div class="container mx-auto px-4 py-8">
                <h1 class="text-3xl font-bold text-red-600">Error</h1>
                <p>Failed to load admin panel: ${error.message}</p>
            </div>`;
        });
}
