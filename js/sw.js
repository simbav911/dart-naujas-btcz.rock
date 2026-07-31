// BitcoinZ Service Worker
//
// The previous version answered every request cache-first, and "/" was one of
// the cached entries. Once a visitor had the worker installed they kept the
// homepage they first saw, so site updates never reached them - a newsletter
// fix could go live and a returning visitor would still see the old form.
//
// Pages are fetched from the network now, with the cache kept only as an
// offline fallback. Static assets stay fast by being served from the cache and
// refreshed in the background, so they are at most one visit out of date.
const CACHE_NAME = 'btcz-cache-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/main.css',
  '/js/main.js',
  '/js/mining-calculator.js',
  '/js/supply-info.js',
  '/images/logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Individually, so one missing file cannot fail the whole install
        return Promise.allSettled(
          urlsToCache.map(url =>
            cache.add(url).catch(error => {
              console.warn(`Failed to cache ${url}: ${error.message}`);
              return Promise.resolve();
            })
          )
        );
      })
      // Apply the new strategy on the next load rather than a load after that
      .then(() => self.skipWaiting())
  );
});

// Pages: network first. A visitor online always gets the current page; the
// cached copy is only there so the site still opens when they are offline.
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    // Offline and never visited - fall back to the cached homepage
    const home = await caches.match('/');
    if (home) {
      return home;
    }
    throw error;
  }
}

// Assets: serve the cached copy immediately, then refresh it for next time.
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  const network = fetch(request)
    .then(response => {
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
      }
      return response;
    })
    .catch(() => null);

  return cached || network.then(r => r || Promise.reject(new Error('offline')));
}

self.addEventListener('fetch', event => {
  const request = event.request;

  // Only GET is cacheable, and only our own origin. Leaving cross-origin alone
  // matters for the Turnstile challenge, which must never be replayed from a
  // cache, and for the subscribe endpoint below.
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) {
    return;
  }

  // The newsletter endpoint is a live API, never a cached document
  if (new URL(request.url).pathname.startsWith('/api/')) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  event.respondWith(staleWhileRevalidate(request));
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys()
      .then(cacheNames => Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      ))
      // Take over open tabs so the stale strategy stops being used immediately
      .then(() => self.clients.claim())
  );
});
