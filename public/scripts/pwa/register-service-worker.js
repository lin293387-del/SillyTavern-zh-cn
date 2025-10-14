export function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
        return;
    }

    const register = () => {
        navigator.serviceWorker.register('/service-worker.js').catch((error) => {
            console.error('[SillyTavern] Service worker registration failed:', error);
        });
    };

    if (document.readyState === 'complete') {
        register();
    } else {
        window.addEventListener('load', register, { once: true });
    }
}
