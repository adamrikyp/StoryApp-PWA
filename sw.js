import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';
import { CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Precache aset bawaan (akan diganti dengan Workbox InjectManifest)
precacheAndRoute(self.__WB_MANIFEST);

// Caching untuk API cerita
registerRoute(
  ({ url }) => url.origin === 'https://story-api.dicoding.dev',
  new StaleWhileRevalidate({
    cacheName: 'story-api-cache',
  })
);

// Caching untuk gambar
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
      }),
    ],
  })
);