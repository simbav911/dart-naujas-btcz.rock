// Wait for CMS to be available
window.addEventListener('load', function() {
  // Log initialization
  console.log('Initializing CMS...');

  // Configure error handling
  window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('CMS Error:', {
      message: msg,
      url: url,
      line: lineNo,
      column: columnNo,
      error: error
    });
    return false;
  };

  // Handle authentication state
  const handleAuth = () => {
    const hash = window.location.hash;
    const params = new URLSearchParams(window.location.search);
    
    // Check for authentication errors
    if (params.has('error')) {
      console.error('Authentication error:', params.get('error'));
      return;
    }

    // Handle access token in hash
    if (hash && hash.includes('access_token=')) {
      const token = hash.match(/access_token=([^&]*)/)[1];
      if (token) {
        window.localStorage.setItem('netlify-cms-user', JSON.stringify({
          token: token,
          provider: 'github'
        }));
        
        // Clean up the URL
        const cleanUrl = window.location.href.split('#')[0];
        window.history.replaceState(null, '', cleanUrl);
      }
    }
  };

  // Initialize authentication handling
  handleAuth();

  // Add event listener for CMS events
  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'netlify-cms-error') {
      console.error('CMS Event Error:', e.data);
    }
  });
});