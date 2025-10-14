import { TtlLruCache } from '../cache/TtlLruCache.js';

const cacheRegistry = new Map();

function toMilliseconds(options) {
    if (!options) {
        return 0;
    }

    const candidates = [
        options.ttlMs,
        options.ttl,
        options.ttlMilliseconds,
        options.ttlSeconds != null ? Number(options.ttlSeconds) * 1000 : null,
        options.ttlMinutes != null ? Number(options.ttlMinutes) * 60 * 1000 : null,
        options.ttlHours != null ? Number(options.ttlHours) * 60 * 60 * 1000 : null,
    ].filter(value => value != null && !Number.isNaN(Number(value)));

    if (!candidates.length) {
        return 0;
    }

    return Math.max(0, Number(candidates[0]));
}

function resolveName(name) {
    if (typeof name === 'string' && name.trim()) {
        return name.trim();
    }
    if (typeof name === 'symbol') {
        return name;
    }
    throw new TypeError('createCache 需要提供非空字符串或 Symbol 作为缓存名称');
}

function instrumentCache(cache, registryEntry) {
    if (cache.__cacheFactoryInstrumented) {
        return cache;
    }

    const stats = registryEntry.stats;

    const originalGet = cache.get.bind(cache);
    cache.get = (key) => {
        const value = originalGet(key);
        if (value === undefined) {
            stats.misses += 1;
        } else {
            stats.hits += 1;
        }
        return value;
    };

    const originalHas = cache.has?.bind(cache);
    if (typeof originalHas === 'function') {
        cache.has = (key) => {
            const result = originalHas(key);
            if (result) {
                stats.hits += 1;
            } else {
                stats.misses += 1;
            }
            return result;
        };
    }

    const originalConsumeEvictions = cache.consumeEvictionStats?.bind(cache);
    if (typeof originalConsumeEvictions === 'function') {
        cache.consumeEvictionStats = () => {
            const evictions = originalConsumeEvictions();
            stats.evictions.ttl += evictions.ttl ?? 0;
            stats.evictions.lru += evictions.lru ?? 0;
            stats.evictions.manual += evictions.manual ?? 0;
            return evictions;
        };
    }

    cache.__cacheFactoryInstrumented = true;
    return cache;
}

/**
 * 创建一个具备 TTL/LRU 能力的缓存实例，并在内部注册以便监控。
 * @param {string|symbol} name 缓存名称
 * @param {{
 *   ttl?: number,
 *   ttlMs?: number,
 *   ttlSeconds?: number,
 *   ttlMinutes?: number,
 *   ttlHours?: number,
 *   maxEntries?: number,
 *   onEvict?: (value: any, key: string, reason: 'ttl'|'lru'|'manual') => void,
 *   trackMetrics?: boolean
 * }} [options]
 * @returns {TtlLruCache}
 */
export function createCache(name, options = {}) {
    const cacheName = resolveName(name);
    const ttlMs = toMilliseconds(options);
    const maxEntries = options.maxEntries != null ? Number(options.maxEntries) : 0;
    const onEvict = typeof options.onEvict === 'function' ? options.onEvict : null;

    const cache = new TtlLruCache({ ttlMs, maxEntries, onEvict });
    const registryEntry = {
        name: cacheName,
        cache,
        options: { ttlMs, maxEntries, onEvict },
        stats: {
            hits: 0,
            misses: 0,
            evictions: { ttl: 0, lru: 0, manual: 0 },
        },
    };

    if (options.trackMetrics ?? true) {
        instrumentCache(cache, registryEntry);
    }

    cacheRegistry.set(cacheName, registryEntry);
    return cache;
}

/**
 * 获取当前注册的缓存概览，用于监控与调试。
 * @returns {Array<{name: string|symbol, cache: TtlLruCache, stats: object, options: object}>}
 */
export function listRegisteredCaches() {
    return Array.from(cacheRegistry.values());
}

/**
 * 重置指定缓存的统计信息。
 * @param {string|symbol} name
 */
export function resetCacheStats(name) {
    const key = resolveName(name);
    const entry = cacheRegistry.get(key);
    if (!entry) {
        return;
    }
    entry.stats.hits = 0;
    entry.stats.misses = 0;
    entry.stats.evictions.ttl = 0;
    entry.stats.evictions.lru = 0;
    entry.stats.evictions.manual = 0;
}
