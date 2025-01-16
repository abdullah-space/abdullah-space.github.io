const CACHE_NAME = "abdullah-pwa-cache-v2"; // Incremented version
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/Abdullah-web.png",
  "/Abdullah.jpg",
  "/userMA.png",
  "/coder.webp",
  "/My_resume.pdf",
  "/project_ss/attendance.png",
  "/project_ss/chess.png",
  "/project_ss/discord.png",
  "/project_ss/snapcook.png",
  "/project_ss/unknown.jpeg"
];

// Install Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // Activate the new service worker immediately
});

// Fetch Event with Cache Update
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch the latest version and update the cache
        fetch(event.request).then((response) => {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
          });
        });
        return cachedResponse; // Return the cached response
      }
      // Fetch from the network if not in cache
      return fetch(event.request).then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});

// Activate Service Worker and Clean Old Caches
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
  self.clients.claim(); // Take control of all clients immediately
});
