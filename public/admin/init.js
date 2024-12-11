// Initialize CMS
(function() {
  // Check if CMS is loaded
  var initCMS = function() {
    if (window.CMS) {
      window.CMS.init();
      console.log('CMS initialized');
    } else {
      console.log('Waiting for CMS to load...');
      setTimeout(initCMS, 100); // Try again in 100ms
    }
  };

  // Start initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCMS);
  } else {
    initCMS();
  }
})();
