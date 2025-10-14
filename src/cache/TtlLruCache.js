/**
 * 通用的 TTL + LRU 缓存实现，针对需要长期驻留在内存中的 Map 进行了包装。
 * 设计目标：
 *  - 兼容常见的 `Map` 接口（get/set/has/delete/clear/size/entries 等）。
 *  - 支持按 TTL 自动过期以及按访问时间执行 LRU 淘汰。
 *  - 提供逐出回调，在释放资源（例如 tokenizer.free()）时可复用。
 *  - 暴露 `prune()` 主动触发清理，以及 `consumeEvictionStats()` 获取淘汰统计。
 *
 * 注意：`ttlMs` 与 `maxEntries` 为 0 时视为禁用对应策略。
 */
export class TtlLruCache {
    /**
     * @param {{ttlMs?: number, maxEntries?: number, onEvict?: (value: any, key: string, reason: 'ttl'|'lru'|'manual') => void}} [options]
     */
    constructor(options = {}) {
        const { ttlMs = 0, maxEntries = 0, onEvict = null } = options;
        this.ttlMs = Math.max(0, Number(ttlMs) || 0);
        this.maxEntries = Math.max(0, Number(maxEntries) || 0);
        this.onEvict = typeof onEvict === 'function' ? onEvict : null;
        /** @type {Map<string, any>} */
        this.store = new Map();
        /** @type {Map<string, { lastUsed: number }>} */
        this.meta = new Map();
        this.evictionStats = { ttl: 0, lru: 0, manual: 0 };
    }

    /**
     * 获取元素。
     * @param {string} key
     * @returns {any}
     */
    get(key) {
        const entry = this.store.get(key);
        if (entry === undefined) {
            return undefined;
        }
        const now = Date.now();
        if (this.#isExpired(key, now)) {
            this.#evict(key, entry, 'ttl');
            return undefined;
        }
        this.#touch(key, now);
        return entry;
    }

    /**
     * 写入元素。
     * @param {string} key
     * @param {any} value
     * @returns {this}
     */
    set(key, value) {
        const now = Date.now();
        this.store.set(key, value);
        this.meta.set(key, { lastUsed: now });
        this.prune(now);
        return this;
    }

    /**
     * 判断是否存在。
     * @param {string} key
     * @returns {boolean}
     */
    has(key) {
        const now = Date.now();
        if (!this.store.has(key)) {
            return false;
        }
        if (this.#isExpired(key, now)) {
            const value = this.store.get(key);
            this.#evict(key, value, 'ttl');
            return false;
        }
        this.#touch(key, now);
        return true;
    }

    /**
     * 删除元素。
     * @param {string} key
     * @returns {boolean}
     */
    delete(key) {
        if (!this.store.has(key)) {
            return false;
        }
        const value = this.store.get(key);
        this.#evict(key, value, 'manual');
        return true;
    }

    /**
     * 清空缓存。
     */
    clear() {
        for (const [key, value] of this.store.entries()) {
            this.#evict(key, value, 'manual');
        }
        this.store.clear();
        this.meta.clear();
    }

    /**
     * 返回当前缓存大小。
     * @returns {number}
     */
    get size() {
        return this.store.size;
    }

    /**
     * 主动修剪缓存。
     * @param {number} [now]
     */
    prune(now = Date.now()) {
        if (!this.store.size) {
            return;
        }

        if (this.ttlMs > 0) {
            for (const [key, metadata] of this.meta.entries()) {
                if (now - metadata.lastUsed > this.ttlMs) {
                    const value = this.store.get(key);
                    this.#evict(key, value, 'ttl');
                }
            }
        }

        if (this.maxEntries > 0 && this.store.size > this.maxEntries) {
            const overflow = this.store.size - this.maxEntries;
            if (overflow > 0) {
                const ordered = [...this.meta.entries()].sort((a, b) => a[1].lastUsed - b[1].lastUsed);
                for (let i = 0; i < overflow && i < ordered.length; i++) {
                    const key = ordered[i][0];
                    const value = this.store.get(key);
                    this.#evict(key, value, 'lru');
                }
            }
        }
    }

    /**
     * 获取并重置淘汰统计。
     * @returns {{ttl: number, lru: number, manual: number}}
     */
    consumeEvictionStats() {
        const stats = { ...this.evictionStats };
        this.evictionStats.ttl = 0;
        this.evictionStats.lru = 0;
        this.evictionStats.manual = 0;
        return stats;
    }

    /**
     * 生成条目迭代器。
     */
    *entries() {
        this.prune();
        yield* this.store.entries();
    }

    /**
     * 生成键迭代器。
     */
    *keys() {
        this.prune();
        yield* this.store.keys();
    }

    /**
     * 生成值迭代器。
     */
    *values() {
        this.prune();
        yield* this.store.values();
    }

    [Symbol.iterator]() {
        return this.entries();
    }

    /**
     * 更新时间戳。
     * @param {string} key
     * @param {number} now
     */
    #touch(key, now) {
        const meta = this.meta.get(key);
        if (meta) {
            meta.lastUsed = now;
        } else {
            this.meta.set(key, { lastUsed: now });
        }
    }

    /**
     * 判断是否过期。
     * @param {string} key
     * @param {number} now
     * @returns {boolean}
     */
    #isExpired(key, now) {
        if (this.ttlMs <= 0) {
            return false;
        }
        const meta = this.meta.get(key);
        if (!meta) {
            return false;
        }
        return now - meta.lastUsed > this.ttlMs;
    }

    /**
     * 淘汰元素。
     * @param {string} key
     * @param {any} value
     * @param {'ttl'|'lru'|'manual'} reason
     */
    #evict(key, value, reason) {
        this.store.delete(key);
        this.meta.delete(key);
        if (this.onEvict) {
            try {
                this.onEvict(value, key, reason);
            } catch (error) {
                console.error('Cache eviction callback failed:', error);
            }
        }
        if (reason in this.evictionStats) {
            this.evictionStats[reason] += 1;
        }
    }
}

/**
 * 工具方法，便于快速创建缓存实例。
 * @param {Parameters<typeof TtlLruCache>[0]} options
 * @returns {TtlLruCache}
 */
export function createTtlLruCache(options = {}) {
    return new TtlLruCache(options);
}
