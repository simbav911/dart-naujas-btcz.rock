// Newsletter form configuration.
//
// There is deliberately no API key here. The form posts to a Cloudflare Worker
// (worker/subscribe.js) which holds the Brevo key as a Cloudflare secret, so it
// is never served to visitors. Both values below are public by design.
window.BREVO_CONFIG = {
  // Same origin in production; local Hugo dev talks to the deployed Worker
  endpoint: window.location.hostname === 'localhost'
    ? 'https://getbtcz.com/api/subscribe'
    : '/api/subscribe',
  turnstileSiteKey: '0x4AAAAAAEC25RiLWxCWN-Ht'
};
