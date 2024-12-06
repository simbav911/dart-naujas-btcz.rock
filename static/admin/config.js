// Wait for CMS to be available
window.addEventListener('load', function() {
  // Log initialization
  console.log('Initializing CMS...');

  // Handle errors
  window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Error:', {
      message: msg,
      url: url,
      line: lineNo,
      column: columnNo,
      error: error
    });
  };

  // Handle authentication callback
  if (window.location.hash && window.location.hash.includes('access_token=')) {
    const token = window.location.hash.match(/access_token=([^&]*)/)[1];
    window.localStorage.setItem('netlify-cms-user', JSON.stringify({
      token: token,
      provider: 'github'
    }));
  }
});
