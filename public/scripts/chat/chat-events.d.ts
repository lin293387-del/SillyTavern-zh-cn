import type { MessageLifecycleDetail } from './message-lifecycle.js';

export interface ChatMessage extends Record<string, unknown> {
    mesId?: number;
    mes?: string;
    name?: string;
    is_user?: boolean;
}

export interface ChatRenderDetail extends Record<string, unknown> {
    messageIds: number[];
    virtual: boolean;
    reason: string;
    messages: ChatMessage[];
}

export interface ChatEventConfig {
    getMessageById?: (id: number) => ChatMessage | null | undefined;
    registerMessageDom?: (mesId: number, element: Element) => void;
    unregisterMessageDom?: (mesId: number, element?: Element | null) => void;
    releaseDynamicStylesFromElement?: (element: Element) => void;
    isVirtualizationEnabled?: () => boolean;
}

export interface MessageEventExtra extends Record<string, unknown> {
    virtual?: boolean;
    broadcast?: boolean;
}

export interface BroadcastOptions {
    reason?: string;
    virtual?: boolean;
}

export type MessageLifecycleDomEvent =
    | typeof VIRTUALIZATION_DOM_EVENT_BEFORE_MOUNT
    | typeof VIRTUALIZATION_DOM_EVENT_MOUNT
    | typeof VIRTUALIZATION_DOM_EVENT_AFTER_RENDER
    | typeof VIRTUALIZATION_DOM_EVENT_UNMOUNT
    | (string & {});

export const VIRTUALIZATION_DOM_EVENT_BEFORE_MOUNT: 'st-message-before-mount';
export const VIRTUALIZATION_DOM_EVENT_MOUNT: 'st-message-mounted';
export const VIRTUALIZATION_DOM_EVENT_AFTER_RENDER: 'st-message-rendered';
export const VIRTUALIZATION_DOM_EVENT_UNMOUNT: 'st-message-unmounted';
export const CHAT_RENDER_EVENT_START: 'st-chat-render-start';
export const CHAT_RENDER_EVENT_END: 'st-chat-render-end';

export function configureChatEvents(options?: ChatEventConfig): void;

export function emitVirtualizationDomEvent(
    eventName: MessageLifecycleDomEvent,
    mesId: number,
    element?: Element | null,
    extra?: MessageEventExtra,
): MessageLifecycleDetail;

export function emitVirtualizationPhase(
    eventName: typeof CHAT_RENDER_EVENT_START | typeof CHAT_RENDER_EVENT_END | (string & {}),
    detail?: ChatRenderDetail | Record<string, unknown>,
): void;

export function broadcastChatRender(messageIds: number[], options?: BroadcastOptions): void;

export function notifyMessageMounted(
    mesId: number,
    element: Element,
    extra?: MessageEventExtra,
): MessageLifecycleDetail;

export function notifyMessageUnmounted(
    mesId: number,
    element?: Element | null,
    extra?: MessageEventExtra,
): MessageLifecycleDetail;

export function handleVirtualMessageMount(index: number | string, element?: Element | null): void;

export function handleVirtualMessageUnmount(index: number | string, element?: Element | null): void;
