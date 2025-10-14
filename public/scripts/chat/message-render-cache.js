/**
 * 聊天消息渲染缓存。
 *
 * 设计目标：
 * 1. 以 WeakMap 绑定消息对象避免手动回收。
 * 2. 支持同时记录已完成的渲染结果与进行中的 Promise，避免重复调度。
 * 3. 在后续步骤中由 Worker 计算 Markdown → HTML，再由主线程完成净化后写入缓存。
 */

const renderCache = new WeakMap();

/**
 * 获取消息的渲染缓存。
 * @param {object} message
 * @returns {{ key: string, html: string | null, pending: Promise<string> | null, error: Error | null } | null}
 */
export function getMessageRenderCache(message) {
    if (!message || typeof message !== 'object') {
        return null;
    }
    const entry = renderCache.get(message);
    return entry ?? null;
}

/**
 * 设置消息的渲染缓存。
 * @param {object} message
 * @param {{ key: string, html: string | null, pending: Promise<string> | null, error: Error | null }} entry
 */
export function setMessageRenderCache(message, entry) {
    if (!message || typeof message !== 'object') {
        return;
    }
    if (!entry) {
        renderCache.delete(message);
        return;
    }
    const normalized = {
        key: entry.key ?? '',
        html: typeof entry.html === 'string' ? entry.html : null,
        pending: entry.pending instanceof Promise ? entry.pending : null,
        error: entry.error instanceof Error ? entry.error : null,
    };
    renderCache.set(message, normalized);
}

/**
 * 清除消息缓存。
 * @param {object} message
 */
export function clearMessageRenderCache(message) {
    if (!message || typeof message !== 'object') {
        return;
    }
    renderCache.delete(message);
}

/**
 * 根据 source + 选项生成缓存 key。
 * 后续可替换为更稳定的哈希实现。
 * @param {string} source
 * @param {Record<string, any>} options
 * @returns {string}
 */
export function buildRenderCacheKey(source, options = {}) {
    const base = typeof source === 'string' ? source : '';
    let optionsKey = '';
    try {
        optionsKey = JSON.stringify(options);
    } catch {
        optionsKey = '';
    }
    return `${base.length}:${base}:${optionsKey}`;
}

/**
 * 为消息写入进行中的 Promise，并返回同一个 Promise。
 * @param {object} message
 * @param {string} key
 * @param {() => Promise<string>} factory
 * @returns {Promise<string>}
 */
export function ensurePendingRender(message, key, factory) {
    if (!message || typeof factory !== 'function') {
        return Promise.resolve('');
    }

    const current = getMessageRenderCache(message);
    if (current?.key === key) {
        if (typeof current.html === 'string') {
            return Promise.resolve(current.html);
        }
        if (current.pending) {
            return current.pending;
        }
    }

    const pending = Promise.resolve().then(factory).then((html) => {
        setMessageRenderCache(message, {
            key,
            html,
            pending: null,
            error: null,
        });
        return html;
    }).catch((error) => {
        setMessageRenderCache(message, {
            key,
            html: null,
            pending: null,
            error: error instanceof Error ? error : new Error(String(error)),
        });
        throw error;
    });

    setMessageRenderCache(message, {
        key,
        html: null,
        pending,
        error: null,
    });

    return pending;
}

/**
 * 判断缓存是否与给定 key 匹配且已完成。
 * @param {object} message
 * @param {string} key
 * @returns {boolean}
 */
export function isRenderCacheReady(message, key) {
    const entry = getMessageRenderCache(message);
    return Boolean(entry && entry.key === key && typeof entry.html === 'string');
}

/**
 * 读取缓存的 HTML。
 * @param {object} message
 * @param {string} key
 * @returns {string | null}
 */
export function getCachedHtml(message, key) {
    const entry = getMessageRenderCache(message);
    if (!entry || entry.key !== key) {
        return null;
    }
    return typeof entry.html === 'string' ? entry.html : null;
}

