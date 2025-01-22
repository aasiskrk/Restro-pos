const CACHE_NAME = "carousel-cache-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "/images/carousel/carousel-1.jpeg",
        "/images/carousel/carousel-2.jpeg",
        "/images/carousel/carousel-3.jpeg",
        "/images/carousel/carousel-4.jpeg",
        "/images/carousel/carousel-5.jpg",
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("/images/carousel/")) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        // Return cached response if found
        if (response) {
          return response;
        }

        // Clone the request because it can only be used once
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Check if response is valid
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone the response because it can only be used once
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
      })
    );
  }
});
