import { event_types, safeEmit } from '../events.js';
import { dispatchMessageLifecycle } from './message-lifecycle.js';

export const VIRTUALIZATION_DOM_EVENT_BEFORE_MOUNT = 'st-message-before-mount';
export const VIRTUALIZATION_DOM_EVENT_MOUNT = 'st-message-mounted';
export const VIRTUALIZATION_DOM_EVENT_AFTER_RENDER = 'st-message-rendered';
export const VIRTUALIZATION_DOM_EVENT_UNMOUNT = 'st-message-unmounted';
export const CHAT_RENDER_EVENT_START = 'st-chat-render-start';
export const CHAT_RENDER_EVENT_END = 'st-chat-render-end';

const MESSAGE_LIFECYCLE_EVENT_MAP = {
    [VIRTUALIZATION_DOM_EVENT_BEFORE_MOUNT]: 'beforeMount',
    [VIRTUALIZATION_DOM_EVENT_MOUNT]: 'mount',
    [VIRTUALIZATION_DOM_EVENT_AFTER_RENDER]: 'afterRender',
    [VIRTUALIZATION_DOM_EVENT_UNMOUNT]: 'unmount',
};

const pendingChatRenderIds = new Set();
let pendingChatRenderFrame = null;
let pendingChatRenderReason = 'update';
let pendingChatRenderVirtual = null;

let getMessageById = () => null;
let registerMessageDom = () => {};
let unregisterMessageDom = () => {};
let releaseDynamicStylesFromElement = () => {};
let isVirtualizationEnabled = () => true;

function getDocumentRef() {
    return typeof document !== 'undefined' ? document : null;
}

function resolveMessage(id) {
    try {
        return getMessageById?.(id) ?? null;
    } catch (error) {
        console.warn('resolveMessage 获取消息异常', id, error);
        return null;
    }
}

export function configureChatEvents(options = {}) {
    if (typeof options.getMessageById === 'function') {
        getMessageById = options.getMessageById;
    }
    if (typeof options.registerMessageDom === 'function') {
        registerMessageDom = options.registerMessageDom;
    }
    if (typeof options.unregisterMessageDom === 'function') {
        unregisterMessageDom = options.unregisterMessageDom;
    }
    if (typeof options.releaseDynamicStylesFromElement === 'function') {
        releaseDynamicStylesFromElement = options.releaseDynamicStylesFromElement;
    }
    if (typeof options.isVirtualizationEnabled === 'function') {
        isVirtualizationEnabled = options.isVirtualizationEnabled;
    }
}

function flushPendingChatRender() {
    if (!pendingChatRenderIds.size) {
        pendingChatRenderFrame = null;
        pendingChatRenderReason = 'update';
        pendingChatRenderVirtual = null;
        return;
    }

    const messageIds = [...pendingChatRenderIds];
    pendingChatRenderIds.clear();
    const virtual = typeof pendingChatRenderVirtual === 'boolean'
        ? pendingChatRenderVirtual
        : isVirtualizationEnabled();
    const reason = pendingChatRenderReason;
    pendingChatRenderFrame = null;
    pendingChatRenderReason = 'update';
    pendingChatRenderVirtual = null;

    const detail = {
        messageIds,
        virtual,
        reason,
        messages: messageIds.map((id) => resolveMessage(id)).filter(Boolean),
    };

    emitVirtualizationPhase(CHAT_RENDER_EVENT_START, detail);
    const renderPromise = safeEmit(event_types.CHAT_RENDERED, detail);
    const documentRef = getDocumentRef();
    if (documentRef) {
        documentRef.dispatchEvent(new CustomEvent('st-chat-render', { detail }));
    }
    renderPromise.finally(() => emitVirtualizationPhase(CHAT_RENDER_EVENT_END, detail));
}

function scheduleChatRender(reason, virtual) {
    if (reason && reason !== 'update' && pendingChatRenderReason === 'update') {
        pendingChatRenderReason = reason;
    }
    if (typeof virtual === 'boolean') {
        pendingChatRenderVirtual = pendingChatRenderVirtual === null
            ? virtual
            : (pendingChatRenderVirtual && virtual);
    }
    if (pendingChatRenderFrame !== null) {
        return;
    }
    const scheduler = typeof requestAnimationFrame === 'function'
        ? requestAnimationFrame
        : (cb) => setTimeout(cb, 16);
    pendingChatRenderFrame = scheduler(() => {
        flushPendingChatRender();
    });
}

export function emitVirtualizationDomEvent(eventName, mesId, element, extra = {}) {
    const { virtual = true, ...rest } = extra ?? {};
    const baseDetail = {
        message: resolveMessage(mesId),
        ...rest,
    };
    const lifecycleKey = MESSAGE_LIFECYCLE_EVENT_MAP[eventName];

    if (lifecycleKey) {
        const { detail } = dispatchMessageLifecycle(lifecycleKey, {
            mesId,
            element,
            virtual,
            detail: baseDetail,
        });
        return detail;
    }

    const detail = {
        mesId,
        element,
        ...baseDetail,
        virtual,
    };

    const documentRef = getDocumentRef();
    if (documentRef) {
        documentRef.dispatchEvent(new CustomEvent(eventName, { detail }));
    }

    return detail;
}

export function emitVirtualizationPhase(eventName, detail = {}) {
    const documentRef = getDocumentRef();
    if (!documentRef) {
        return;
    }
    documentRef.dispatchEvent(new CustomEvent(eventName, { detail }));
}

export function broadcastChatRender(messageIds, { reason = 'update', virtual = isVirtualizationEnabled() } = {}) {
    if (!Array.isArray(messageIds) || messageIds.length === 0) {
        return;
    }
    const uniqueIds = [...new Set(messageIds)].filter((id) => Number.isInteger(id) && id >= 0);
    if (!uniqueIds.length) {
        return;
    }
    uniqueIds.forEach((id) => pendingChatRenderIds.add(id));
    if (!pendingChatRenderIds.size) {
        return;
    }
    scheduleChatRender(reason, virtual);
}

export function notifyMessageMounted(mesId, element, extra = {}) {
    if (!(element instanceof Element)) {
        return null;
    }

    const { broadcast = true, virtual = true, ...rest } = extra ?? {};
    registerMessageDom(mesId, element);

    const { detail } = dispatchMessageLifecycle('mount', {
        mesId,
        element,
        virtual,
        detail: {
            message: resolveMessage(mesId),
            ...rest,
        },
    });

    if (broadcast) {
        broadcastChatRender([mesId], { reason: detail.reason ?? 'mount', virtual: detail.virtual });
    }

    return detail;
}

export function notifyMessageUnmounted(mesId, element, extra = {}) {
    const { virtual = true, ...rest } = extra ?? {};
    const { detail } = dispatchMessageLifecycle('unmount', {
        mesId,
        element,
        virtual,
        detail: {
            message: resolveMessage(mesId),
            ...rest,
        },
    });

    if (element instanceof Element) {
        releaseDynamicStylesFromElement(element);
    }
    unregisterMessageDom(mesId, element);
    return detail;
}

export function handleVirtualMessageMount(index, element) {
    if (!element || !(element instanceof Element)) {
        return;
    }
    if (!element.classList.contains('mes')) {
        return;
    }

    const mesIdAttr = element.getAttribute('mesid');
    const mesId = Number.isFinite(Number(mesIdAttr)) ? Number(mesIdAttr) : Number(index);
    if (!Number.isInteger(mesId) || mesId < 0) {
        return;
    }

    notifyMessageMounted(mesId, element, { reason: 'virtualization_mount', virtual: true });
}

export function handleVirtualMessageUnmount(index, element) {
    if (!element || !(element instanceof Element)) {
        return;
    }
    if (!element.classList.contains('mes')) {
        return;
    }

    const mesIdAttr = element.getAttribute('mesid');
    const mesId = Number.isFinite(Number(mesIdAttr)) ? Number(mesIdAttr) : Number(index);
    if (!Number.isInteger(mesId) || mesId < 0) {
        return;
    }

    notifyMessageUnmounted(mesId, element, { reason: 'virtualization_unmount', virtual: true });
}
