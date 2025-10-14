import { event_types, safeEmit } from '../events.js';

const MESSAGE_LIFECYCLE_CONFIG = {
    beforeMount: {
        domEvent: 'st-message-before-mount',
        broadcast: false,
    },
    mount: {
        domEvent: 'st-message-mounted',
        emitterEvents: [event_types.MESSAGE_MOUNTED, event_types.MESSAGE_UPDATED],
        broadcast: true,
    },
    afterRender: {
        domEvent: 'st-message-rendered',
        broadcast: false,
    },
    unmount: {
        domEvent: 'st-message-unmounted',
        emitterEvents: [event_types.MESSAGE_UNMOUNTED],
        broadcast: false,
    },
};

export function getMessageLifecycleConfig(eventKey) {
    return MESSAGE_LIFECYCLE_CONFIG[eventKey] ?? null;
}

export function dispatchMessageLifecycle(eventKey, options = {}) {
    const config = getMessageLifecycleConfig(eventKey);
    const {
        mesId,
        element,
        detail = {},
        virtual = true,
        documentRef = typeof document !== 'undefined' ? document : null,
    } = options;

    const lifecycleDetail = {
        mesId,
        element,
        virtual,
        ...detail,
    };

    if (config?.domEvent && documentRef) {
        documentRef.dispatchEvent(new CustomEvent(config.domEvent, { detail: lifecycleDetail }));
    }

    if (config?.emitterEvents?.length) {
        config.emitterEvents.forEach((eventName) => {
            safeEmit(eventName, mesId, { ...lifecycleDetail });
        });
    }

    return {
        detail: lifecycleDetail,
        shouldBroadcast: !!config?.broadcast,
    };
}
