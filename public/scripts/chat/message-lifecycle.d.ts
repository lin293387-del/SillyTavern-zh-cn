export type MessageLifecycleEventKey = 'beforeMount' | 'mount' | 'afterRender' | 'unmount' | (string & {});

export interface MessageLifecycleConfig {
    domEvent?: string;
    emitterEvents?: string[];
    broadcast?: boolean;
}

export interface MessageLifecycleDetail extends Record<string, unknown> {
    mesId?: number;
    element?: Element | null;
    virtual: boolean;
}

export interface MessageLifecycleDispatchOptions {
    mesId?: number;
    element?: Element | null;
    detail?: Record<string, unknown>;
    virtual?: boolean;
    documentRef?: Document | null;
}

export function getMessageLifecycleConfig(eventKey: MessageLifecycleEventKey): MessageLifecycleConfig | null;

export function dispatchMessageLifecycle(
    eventKey: MessageLifecycleEventKey,
    options?: MessageLifecycleDispatchOptions,
): {
    detail: MessageLifecycleDetail;
    shouldBroadcast: boolean;
};
