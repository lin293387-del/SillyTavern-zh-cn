const STATIC_CACHE = 'st-static-v2';
const ICON_CACHE = 'st-icon-v1';
const IMAGE_RUNTIME_CACHE = 'st-image-runtime-v1';
const CACHE_WHITELIST = new Set([STATIC_CACHE, ICON_CACHE, IMAGE_RUNTIME_CACHE]);

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

const PRECACHE_ICON_URLS = [
    '/img/01ai.svg',
    '/img/ai21.svg',
    '/img/aimlapi.svg',
    '/img/aphrodite.svg',
    '/img/azure_openai.svg',
    '/img/blockentropy.svg',
    '/img/claude.svg',
    '/img/cohere.svg',
    '/img/cometapi.svg',
    '/img/custom.svg',
    '/img/deepseek.svg',
    '/img/down_arrow.svg',
    '/img/dreamgen.svg',
    '/img/electronhub.svg',
    '/img/featherless.svg',
    '/img/fireworks.svg',
    '/img/generic.svg',
    '/img/groq.svg',
    '/img/huggingface.svg',
    '/img/infermaticai.svg',
    '/img/kobold.svg',
    '/img/koboldcpp.svg',
    '/img/koboldhorde.svg',
    '/img/llamacpp.svg',
    '/img/makersuite.svg',
    '/img/mancer.svg',
    '/img/manual.svg',
    '/img/mistralai.svg',
    '/img/moonshot.svg',
    '/img/nanogpt.svg',
    '/img/No-Image-Placeholder.svg',
    '/img/novel.svg',
    '/img/ollama.svg',
    '/img/openai.svg',
    '/img/openrouter.svg',
    '/img/palm.svg',
    '/img/perplexity.svg',
    '/img/pollinations.svg',
    '/img/scale.svg',
    '/img/step-into.svg',
    '/img/step-out.svg',
    '/img/step-over.svg',
    '/img/step-resume.svg',
    '/img/tabby.svg',
    '/img/textgenerationwebui.svg',
    '/img/times_circle.svg',
    '/img/togetherai.svg',
    '/img/vertexai.svg',
    '/img/vllm.svg',
    '/img/xai.svg',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => cache.addAll([...PRECACHE_URLS, ...PRECACHE_ICON_URLS]))
            .then(() => self.skipWaiting()),
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => !CACHE_WHITELIST.has(key))
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

    if (isSvgIconRequest(event.request, requestURL)) {
        event.respondWith(cacheFirst(event.request, ICON_CACHE));
        return;
    }

    if (shouldRuntimeCacheImage(event.request, requestURL)) {
        event.respondWith(staleWhileRevalidate(event.request, IMAGE_RUNTIME_CACHE));
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => cachedResponse ?? fetch(event.request)),
    );
});

/**
 * @param {Request} request
 * @param {URL} url
 * @returns {boolean}
 */
function isSvgIconRequest(request, url) {
    if (request.destination && request.destination !== 'image') {
        return false;
    }
    return url.pathname.startsWith('/img/') && url.pathname.endsWith('.svg');
}

/**
 * @param {Request} request
 * @param {URL} url
 * @returns {boolean}
 */
function shouldRuntimeCacheImage(request, url) {
    if (request.destination && request.destination !== 'image') {
        return false;
    }
    if (!url.pathname.startsWith('/img/')) {
        return false;
    }
    return !url.pathname.endsWith('.svg');
}

/**
 * @param {Request} request
 * @param {string} cacheName
 * @returns {Promise<Response>}
 */
async function cacheFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    try {
        const networkResponse = await fetch(request);
        if (networkResponse && networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        return new Response('', { status: 504, statusText: 'Gateway Timeout' });
    }
}

/**
 * @param {Request} request
 * @param {string} cacheName
 * @returns {Promise<Response>}
 */
async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    const fetchPromise = fetch(request)
        .then((networkResponse) => {
            if (networkResponse && networkResponse.ok) {
                cache.put(request, networkResponse.clone());
            }
            return networkResponse;
        })
        .catch(() => null);

    if (cachedResponse) {
        fetchPromise.catch(() => null);
        return cachedResponse;
    }

    const networkResponse = await fetchPromise;
    if (networkResponse) {
        return networkResponse;
    }

    return new Response('', { status: 504, statusText: 'Gateway Timeout' });
}
