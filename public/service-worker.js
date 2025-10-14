const STATIC_CACHE = 'st-static-v1';

const PRECACHE_URLS = [
    '/style.css',
    '/css/st-tailwind.css',
    '/css/rm-groups.css',
    '/css/group-avatars.css',
    '/css/toggle-dependent.css',
    '/css/world-info.css',
    '/css/extensions-panel.css',
    '/css/select2-overrides.css',
    '/css/mobile-styles.css',
    '/css/user.css',
    '/css/fontawesome.min.css',
    '/css/solid.min.css',
    '/css/brands.min.css',
    '/webfonts/fa-solid-900.woff2',
    '/webfonts/fa-brands-400.woff2',
    '/webfonts/NotoSans/NotoSans-Black.woff2',
    '/webfonts/NotoSans/NotoSans-BlackItalic.woff2',
    '/webfonts/NotoSans/NotoSans-Bold.woff2',
    '/webfonts/NotoSans/NotoSans-BoldItalic.woff2',
    '/webfonts/NotoSans/NotoSans-ExtraBold.woff2',
    '/webfonts/NotoSans/NotoSans-ExtraBoldItalic.woff2',
    '/webfonts/NotoSans/NotoSans-ExtraLight.woff2',
    '/webfonts/NotoSans/NotoSans-ExtraLightItalic.woff2',
    '/webfonts/NotoSans/NotoSans-Italic.woff2',
    '/webfonts/NotoSans/NotoSans-Light.woff2',
    '/webfonts/NotoSans/NotoSans-LightItalic.woff2',
    '/webfonts/NotoSans/NotoSans-Medium.woff2',
    '/webfonts/NotoSans/NotoSans-MediumItalic.woff2',
    '/webfonts/NotoSans/NotoSans-Regular.woff2',
    '/webfonts/NotoSans/NotoSans-SemiBold.woff2',
    '/webfonts/NotoSans/NotoSans-SemiBoldItalic.woff2',
    '/webfonts/NotoSans/NotoSans-Thin.woff2',
    '/webfonts/NotoSans/NotoSans-ThinItalic.woff2',
    '/webfonts/NotoSansMono/noto-sans-mono-v30-100.woff2',
    '/webfonts/NotoSansMono/noto-sans-mono-v30-200.woff2',
    '/webfonts/NotoSansMono/noto-sans-mono-v30-300.woff2',
    '/webfonts/NotoSansMono/noto-sans-mono-v30-500.woff2',
    '/webfonts/NotoSansMono/noto-sans-mono-v30-600.woff2',
    '/webfonts/NotoSansMono/noto-sans-mono-v30-700.woff2',
    '/webfonts/NotoSansMono/noto-sans-mono-v30-800.woff2',
    '/webfonts/NotoSansMono/noto-sans-mono-v30-900.woff2',
    '/webfonts/NotoSansMono/noto-sans-mono-v30-regular.woff2',
    '/img/apple-icon-57x57.png',
    '/img/apple-icon-72x72.png',
    '/img/apple-icon-114x114.png',
    '/img/apple-icon-144x144.png',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => cache.addAll(PRECACHE_URLS))
            .then(() => self.skipWaiting()),
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => key !== STATIC_CACHE)
                    .map((key) => caches.delete(key)),
            ),
        ).then(() => self.clients.claim()),
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') {
        return;
    }

    const requestURL = new URL(event.request.url);

    if (requestURL.origin !== self.location.origin) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request).then((networkResponse) => {
                return networkResponse;
            });
        }),
    );
});
