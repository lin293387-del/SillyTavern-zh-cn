export interface MessageRenderCacheEntry {
    key: string;
    html: string | null;
    pending: Promise<string> | null;
    error: Error | null;
}

export function getMessageRenderCache(message: object): MessageRenderCacheEntry | null;

export function setMessageRenderCache(message: object, entry: MessageRenderCacheEntry | null | undefined): void;

export function clearMessageRenderCache(message: object): void;

export function buildRenderCacheKey(source: string, options?: Record<string, unknown>): string;

export function ensurePendingRender(
    message: object,
    key: string,
    factory: () => Promise<string>,
): Promise<string>;

export function isRenderCacheReady(message: object, key: string): boolean;

export function getCachedHtml(message: object, key: string): string | null;
