const DEFAULT_ROOT_MARGIN = '96px 0px';
const DEFAULT_THRESHOLD = 0;

/**
 * 管理聊天消息等节点的可见性，统一处理 IntersectionObserver 的启用/停用。
 */
export class OffscreenVisibilityManager {
    /**
     * @param {object} options
     * @param {Element|null} [options.root=null]
     * @param {string} [options.rootMargin=DEFAULT_ROOT_MARGIN]
     * @param {number|number[]} [options.threshold=DEFAULT_THRESHOLD]
     * @param {(element: Element, meta: OffscreenEntryMeta) => void} [options.onEnter]
     * @param {(element: Element, meta: OffscreenEntryMeta) => void} [options.onLeave]
     * @param {(element: Element) => void} [options.onDisconnect]
     */
    constructor(options = {}) {
        const {
            root = null,
            rootMargin = DEFAULT_ROOT_MARGIN,
            threshold = DEFAULT_THRESHOLD,
            onEnter = null,
            onLeave = null,
            onDisconnect = null,
        } = options;

        this._root = root || null;
        this._rootMargin = rootMargin;
        this._threshold = threshold;
        this._onEnter = typeof onEnter === 'function' ? onEnter : null;
        this._onLeave = typeof onLeave === 'function' ? onLeave : null;
        this._onDisconnect = typeof onDisconnect === 'function' ? onDisconnect : null;

        /** @type {IntersectionObserver|null} */
        this._observer = null;
        /** @type {WeakMap<Element, OffscreenEntryMeta>} */
        this._metaMap = new WeakMap();
        /** @type {Set<Element>} */
        this._tracked = new Set();
        this._enabled = false;
        this._supportsIntersectionObserver = typeof globalThis.IntersectionObserver === 'function';
    }

    /**
     * 判断当前环境是否支持 IntersectionObserver。
     * @returns {boolean}
     */
    isSupported() {
        return this._supportsIntersectionObserver;
    }

    /**
     * 启用或停用观察器。
     * @param {boolean} enabled
     */
    setEnabled(enabled) {
        const next = Boolean(enabled && this.isSupported());
        if (this._enabled === next) {
            return;
        }
        this._enabled = next;

        if (this._enabled) {
            this._ensureObserver();
            this._tracked.forEach((element) => {
                try {
                    this._observer?.observe(element);
                } catch (error) {
                    console.warn('[OffscreenVisibilityManager] observe 失败', error);
                }
            });
        } else {
            this._observer?.disconnect();
        }
    }

    /**
     * 注册需要观测的节点。
     * @param {Element} element
     * @param {OffscreenEntryMeta} [meta]
     */
    track(element, meta = {}) {
        if (!(element instanceof Element)) {
            return;
        }
        this._tracked.add(element);
        this._metaMap.set(element, { ...meta });
        if (!this._enabled) {
            return;
        }
        this._ensureObserver();
        try {
            this._observer?.observe(element);
        } catch (error) {
            console.warn('[OffscreenVisibilityManager] 无法观察节点', error);
        }
    }

    /**
     * 取消对节点的观测。
     * @param {Element} element
     */
    untrack(element) {
        if (!(element instanceof Element)) {
            return;
        }
        this._tracked.delete(element);
        this._metaMap.delete(element);
        if (!this._observer) {
            return;
        }
        try {
            this._observer.unobserve(element);
        } catch (error) {
            console.warn('[OffscreenVisibilityManager] 无法取消观察', error);
        }
        if (typeof this._onDisconnect === 'function') {
            try {
                this._onDisconnect(element);
            } catch (error) {
                console.warn('[OffscreenVisibilityManager] onDisconnect 回调异常', error);
            }
        }
    }

    /**
     * 释放资源。
     */
    destroy() {
        this._observer?.disconnect();
        this._observer = null;
        this._tracked.clear();
        this._metaMap = new WeakMap();
    }

    /**
     * 更新节点的附加元数据。
     * @param {Element} element
     * @param {Partial<OffscreenEntryMeta>} patch
     */
    mergeMeta(element, patch = {}) {
        if (!(element instanceof Element)) {
            return;
        }
        const prev = this._metaMap.get(element) ?? {};
        this._metaMap.set(element, Object.assign({}, prev, patch));
    }

    /**
     * 读取节点的元数据。
     * @param {Element} element
     * @returns {OffscreenEntryMeta|null}
     */
    getMeta(element) {
        if (!(element instanceof Element)) {
            return null;
        }
        return this._metaMap.get(element) ?? null;
    }

    _ensureObserver() {
        if (this._observer || !this.isSupported()) {
            return;
        }
        this._observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const element = entry.target;
                const meta = this._metaMap.get(element) ?? {};
                if (entry.isIntersecting) {
                    if (typeof this._onEnter === 'function') {
                        try {
                            this._onEnter(element, meta, entry);
                        } catch (error) {
                            console.warn('[OffscreenVisibilityManager] onEnter 回调异常', error);
                        }
                    }
                } else if (typeof this._onLeave === 'function') {
                    try {
                        this._onLeave(element, meta, entry);
                    } catch (error) {
                        console.warn('[OffscreenVisibilityManager] onLeave 回调异常', error);
                    }
                }
            });
        }, {
            root: this._root,
            rootMargin: this._rootMargin,
            threshold: this._threshold,
        });
    }
}

/**
 * @typedef {object} OffscreenEntryMeta
 * @property {number} [mesId]
 * @property {boolean} [detached]
 * @property {Element|null} [placeholder]
 * @property {Element|null} [content]
 * @property {number} [cachedHeight]
 * @property {boolean} [virtual]
 */
