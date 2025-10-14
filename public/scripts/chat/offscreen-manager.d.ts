export interface OffscreenEntryMeta {
    mesId?: number;
    detached?: boolean;
    placeholder?: Element | null;
    content?: Element | null;
    cachedHeight?: number;
    virtual?: boolean;
    [key: string]: unknown;
}

export interface OffscreenVisibilityManagerOptions {
    root?: Element | null;
    rootMargin?: string;
    threshold?: number | number[];
    onEnter?: (element: Element, meta: OffscreenEntryMeta, entry?: IntersectionObserverEntry) => void;
    onLeave?: (element: Element, meta: OffscreenEntryMeta, entry?: IntersectionObserverEntry) => void;
    onDisconnect?: (element: Element) => void;
}

export class OffscreenVisibilityManager {
    constructor(options?: OffscreenVisibilityManagerOptions);
    isSupported(): boolean;
    setEnabled(enabled: boolean): void;
    track(element: Element, meta?: OffscreenEntryMeta): void;
    untrack(element: Element): void;
    destroy(): void;
    mergeMeta(element: Element, patch?: Partial<OffscreenEntryMeta>): void;
    getMeta(element: Element): OffscreenEntryMeta | null;
}
