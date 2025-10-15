const VARIABLE_SCOPE = Object.freeze({
    MESSAGE: 'message',
    CHAT: 'chat',
    GLOBAL: 'global',
    CHARACTER: 'character',
    SCRIPT: 'script',
});

const VARIABLE_EVENTS = Object.freeze({
    UPDATE: 'set',
    DELETE: 'delete',
    BATCH: 'batch',
});

const MUTATION_REMOVE = Symbol('variableService.remove');
const MUTATION_SKIP = Symbol('variableService.skip');

const PRIMITIVE_TYPES = new Set(['string', 'number', 'boolean']);

const DEFAULT_MONITORING_OPTIONS = Object.freeze({
    enabled: false,
    logIntervalMs: 15000,
    topEventTypes: 5,
});

function normalizeMonitoringOptions(input) {
    const normalized = { ...DEFAULT_MONITORING_OPTIONS };
    if (!input || typeof input !== 'object') {
        return normalized;
    }

    if (Object.prototype.hasOwnProperty.call(input, 'enabled')) {
        normalized.enabled = Boolean(input.enabled);
    }

    if (Object.prototype.hasOwnProperty.call(input, 'logIntervalMs')) {
        const interval = Number(input.logIntervalMs);
        if (!Number.isNaN(interval) && interval >= 1000) {
            normalized.logIntervalMs = interval;
        }
    }

    if (Object.prototype.hasOwnProperty.call(input, 'topEventTypes')) {
        const topCount = Math.max(1, Number(input.topEventTypes) || DEFAULT_MONITORING_OPTIONS.topEventTypes);
        normalized.topEventTypes = topCount;
    }

    return normalized;
}

/**
 * @param {any} value
 * @returns {boolean}
 */
function isPlainObject(value) {
    if (value === null || typeof value !== 'object') {
        return false;
    }
    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
}

/**
 * @param {any} value
 * @returns {any}
 */
function cloneValue(value) {
    if (value === undefined) {
        return undefined;
    }

    if (value === null || PRIMITIVE_TYPES.has(typeof value)) {
        return value;
    }

    if (typeof structuredClone === 'function') {
        try {
            return structuredClone(value);
        } catch (_) {
            // ignore fallback
        }
    }

    if (Array.isArray(value)) {
        return value.map((item) => cloneValue(item));
    }

    if (isPlainObject(value)) {
        return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, cloneValue(val)]));
    }

    if (value instanceof Date) {
        return new Date(value.getTime());
    }

    if (value instanceof Map) {
        return new Map(value);
    }

    if (value instanceof Set) {
        return new Set(value);
    }

    try {
        return JSON.parse(JSON.stringify(value));
    } catch (error) {
        const message = `变量值无法克隆：${error?.message ?? error}`;
        console.warn('[VariableService] ' + message, value);
        globalThis?.toastr?.warning?.(message, '变量序列化失败');
        throw new Error(message);
    }
}

/**
 * @param {any} value
 * @returns {any}
 */
function normalizeValue(value) {
    if (value === undefined) {
        return null;
    }

    if (value === null || PRIMITIVE_TYPES.has(typeof value)) {
        return value;
    }

    if (value instanceof Date) {
        return value.toISOString();
    }

    if (value instanceof Map || value instanceof Set) {
        return normalizeValue(Array.from(value));
    }

    if (typeof value === 'function' || typeof value === 'symbol' || typeof value === 'bigint') {
        const message = `变量值类型不受支持: ${String(value)}`;
        console.warn('[VariableService] ' + message, value);
        globalThis?.toastr?.warning?.(message, '变量序列化失败');
        throw new Error('变量值必须是可序列化的数据类型');
    }

    return cloneValue(value);
}

/**
 * @param {any} a
 * @param {any} b
 * @returns {boolean}
 */
function isEqual(a, b) {
    if (a === b) {
        return true;
    }

    if (typeof a !== typeof b) {
        return false;
    }

    if (a === null || b === null) {
        return a === b;
    }

    if (PRIMITIVE_TYPES.has(typeof a)) {
        return a === b;
    }

    try {
        return JSON.stringify(a) === JSON.stringify(b);
    } catch (_) {
        return false;
    }
}

/**
 * @param {Record<string, any>} target
 * @param {Record<string, any>} source
 * @returns {Record<string, any>}
 */
function deepMerge(target, source) {
    const result = cloneValue(target ?? {});
    for (const [key, value] of Object.entries(source ?? {})) {
        if (isPlainObject(value) && isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], value);
            continue;
        }

        if (Array.isArray(value)) {
            result[key] = value.map((item) => cloneValue(item));
            continue;
        }

        result[key] = cloneValue(value);
    }
    return result;
}

/**
 * @param {any} container
 * @returns {boolean}
 */
function isEmptyObject(container) {
    if (!container || typeof container !== 'object') {
        return true;
    }
    return Object.keys(container).length === 0;
}

/**
 * @param {any} previous
 * @param {any} next
 * @returns {null|{kind: 'object', changed: Record<string, any>, removed: string[]} | {kind: 'value', value: any} | {kind: 'delete'}}
 */
function computeDiff(previous, next) {
    if (next === undefined) {
        return { kind: 'delete' };
    }

    const prevIsObject = isPlainObject(previous);
    const nextIsObject = isPlainObject(next);

    if (prevIsObject || nextIsObject) {
        const prevObject = prevIsObject ? previous : {};
        const nextObject = nextIsObject ? next : {};
        const changed = {};
        const removed = [];

        for (const [key, value] of Object.entries(nextObject)) {
            if (!isEqual(prevObject[key], value)) {
                changed[key] = cloneValue(value);
            }
        }

        if (prevIsObject) {
            for (const key of Object.keys(prevObject)) {
                if (!(key in nextObject)) {
                    removed.push(key);
                }
            }
        }

        if (!Object.keys(changed).length && !removed.length) {
            return null;
        }

        return { kind: 'object', changed, removed };
    }

    if (isEqual(previous, next)) {
        return null;
    }

    return { kind: 'value', value: cloneValue(next) };
}

/**
 * @param {{kind: 'object', changed: Record<string, any>, removed: string[]}|{kind: 'value', value: any}|{kind: 'delete'}|null} diff
 * @param {any} previous
 * @returns {Array<{type: 'set'|'delete', path: string[], value?: any, previous?: any}>}
 */
function buildFragmentsFromDiff(diff, previous) {
    if (!diff) {
        return [];
    }

    if (diff.kind === 'object') {
        const fragments = [];
        for (const [key, value] of Object.entries(diff.changed)) {
            fragments.push({
                type: VARIABLE_EVENTS.UPDATE,
                path: [key],
                value: cloneValue(value),
                previous: previous && previous[key] !== undefined ? cloneValue(previous[key]) : undefined,
            });
        }
        for (const key of diff.removed) {
            fragments.push({
                type: VARIABLE_EVENTS.DELETE,
                path: [key],
                previous: previous && previous[key] !== undefined ? cloneValue(previous[key]) : undefined,
            });
        }
        return fragments;
    }

    if (diff.kind === 'value') {
        return [{
            type: VARIABLE_EVENTS.UPDATE,
            path: [],
            value: cloneValue(diff.value),
            previous: previous === undefined ? undefined : cloneValue(previous),
        }];
    }

    if (diff.kind === 'delete') {
        return [{
            type: VARIABLE_EVENTS.DELETE,
            path: [],
            previous: previous === undefined ? undefined : cloneValue(previous),
        }];
    }

    return [];
}

/**
 * @param {Record<string, any>} previousInput
 * @param {Record<string, any>} nextInput
 * @returns {{changed: Record<string, any>, removed: string[]}}
 */
function diffPlainRecord(previousInput, nextInput) {
    const previous = isPlainObject(previousInput) ? previousInput : {};
    const next = isPlainObject(nextInput) ? nextInput : {};

    const changed = {};
    const removed = [];

    for (const [key, value] of Object.entries(next)) {
        if (!isEqual(previous[key], value)) {
            changed[key] = cloneValue(value);
        }
    }

    for (const key of Object.keys(previous)) {
        if (!(key in next)) {
            removed.push(key);
        }
    }

    return { changed, removed };
}

/**
 * @param {VariableSnapshot|null} previous
 * @param {VariableSnapshot} next
 * @returns {{global: {changed: Record<string, any>, removed: string[]}, chat: {changed: Record<string, any>, removed: string[]}, message: {changed: Record<string, {changed: Record<string, any>, removed: string[]}>, removed: string[]}}}
 */
function diffSnapshot(previous, next) {
    const result = {
        global: diffPlainRecord(previous?.global ?? {}, next.global ?? {}),
        chat: diffPlainRecord(previous?.chat ?? {}, next.chat ?? {}),
        message: {
            changed: {},
            removed: [],
        },
        character: diffPlainRecord(previous?.character ?? {}, next.character ?? {}),
        script: {
            changed: {},
            removed: [],
        },
    };

    const prevMessage = previous?.message ?? {};
    const nextMessage = next.message ?? {};

    for (const [messageId, nextSwipes] of Object.entries(nextMessage)) {
        const swipeDiff = diffPlainRecord(prevMessage[messageId] ?? {}, nextSwipes ?? {});
        if (Object.keys(swipeDiff.changed).length || swipeDiff.removed.length) {
            result.message.changed[messageId] = swipeDiff;
        }
    }

    for (const key of Object.keys(prevMessage)) {
        if (!(key in nextMessage)) {
            result.message.removed.push(key);
        }
    }

    const prevScripts = previous?.script ?? {};
    const nextScripts = next.script ?? {};

    for (const [scriptId, scriptStore] of Object.entries(nextScripts)) {
        const scriptDiff = diffPlainRecord(prevScripts[scriptId] ?? {}, scriptStore ?? {});
        if (Object.keys(scriptDiff.changed).length || scriptDiff.removed.length) {
            result.script.changed[scriptId] = scriptDiff;
        }
    }

    for (const key of Object.keys(prevScripts)) {
        if (!(key in nextScripts)) {
            result.script.removed.push(key);
        }
    }

    return result;
}

/**
 * @typedef {('message'|'chat'|'global'|'character'|'script')} VariableScope
 */

/**
 * @typedef {Object} VariableIdentifier
 * @property {VariableScope} scope
 * @property {string} key
 * @property {number} [messageId]
 * @property {number} [swipeId]
 */

/**
 * @typedef {Object} VariableEvent
 * @property {'set'|'delete'|'batch'} type
 * @property {VariableScope} scope
 * @property {string} key
 * @property {any} value
 * @property {any} previous
 * @property {number} [messageId]
 * @property {number} [swipeId]
 * @property {string} [characterId]
 * @property {string} [scriptId]
 * @property {boolean} [persisted]
 * @property {VariableEvent[]} [events]
 */

/**
 * @callback VariableSubscriber
 * @param {VariableEvent} event
 * @returns {void|Promise<void>}
 */

/**
 * @callback VariableTransaction
 * @param {VariableAccessor} helpers
 * @returns {void|Promise<void>}
 */

/**
 * @typedef {Object} VariableAccessor
 * @property {(key: string, value: any, options?: VariableWriteOptions) => void} set
 * @property {(key: string, options?: VariableReadOptions) => any} get
 * @property {(key: string, options?: VariableWriteOptions) => void} remove
 */

/**
 * @typedef {Object} VariableWriteOptions
 * @property {boolean} [merge]
 * @property {number} [messageId]
 * @property {number} [swipeId]
 * @property {string|number} [scriptId]
 * @property {string|number} [characterId]
 */

/**
 * @typedef {Object} VariableReadOptions
 * @property {number} [messageId]
 * @property {number} [swipeId]
 * @property {boolean} [clone]
 */

/**
 * @typedef {Object} VariableTransactionOptions
 * @property {number} [messageId]
 * @property {number} [swipeId]
 * @property {boolean} [abortOnError]
 */

/**
 * @typedef {Object} VariableSnapshot
 * @property {Record<string, any>} global
 * @property {Record<string, any>} chat
 * @property {Record<number, Record<number, Record<string, any>>>} message
 * @property {Record<string, any>} [character]
 * @property {Record<string, Record<string, any>>} [script]
 */

/**
 * @typedef {Object} VariableService
 * @property {(subscriber: VariableSubscriber) => () => void} subscribe
 * @property {(scope: VariableScope, key: string, options?: VariableReadOptions) => any} get
 * @property {(scope: VariableScope, key: string, value: any, options?: VariableWriteOptions) => any} set
 * @property {(scope: VariableScope, key: string, options?: VariableWriteOptions) => boolean} remove
 * @property {(scope: VariableScope, callback: VariableTransaction, options?: VariableTransactionOptions) => Promise<void>} transaction
 * @property {() => VariableSnapshot} snapshot
 */

/**
 * @typedef {Object} VariableServiceConfig
 * @property {() => any[]} getChat
 * @property {() => any} getChatMetadata
 * @property {() => any} getExtensionSettings
 * @property {() => void} markChatDirty
 * @property {() => void} persistChatMetadata
 * @property {() => void} persistGlobalVariables
 * @property {(options?: Record<string, any>) => { store: Record<string, any>, characterId?: string }} [getCharacterStore]
 * @property {(context?: { characterId?: string }) => void} [persistCharacterVariables]
 * @property {(options: Record<string, any>) => { store: Record<string, any>, scriptId: string }} [getScriptStore]
 * @property {(context: { scriptId: string }) => void} [persistScriptVariables]
 * @property {() => Record<string, Record<string, any>>} [listScriptStores]
 * @property {() => Partial<{ enabled: boolean, logIntervalMs: number, topEventTypes: number }>} [getVariableMonitoringConfig]
 */

/**
 * @param {VariableServiceConfig} config
 * @returns {VariableService}
 */
function createVariableService(config) {
    if (!config) {
        throw new Error('缺少变量服务配置');
    }

    const subscribers = new Set();
    const pendingEvents = new Map();
    let flushScheduled = false;
    let lastSnapshot = null;

    // 变量监控状态，用于在 toggle 打开时输出订阅数与事件吞吐量。
    const monitoringState = {
        activeSubscribers: 0,
        totalEvents: 0,
        totalSinceFlush: 0,
        typeCounts: new Map(),
    };
    let monitoringTimer = null;

    const getMonitoringOptions = () => normalizeMonitoringOptions(
        typeof config.getVariableMonitoringConfig === 'function'
            ? config.getVariableMonitoringConfig()
            : undefined,
    );

    const cancelMonitoringTimer = () => {
        if (monitoringTimer) {
            clearTimeout(monitoringTimer);
            monitoringTimer = null;
        }
    };

    const scheduleMonitoringFlush = () => {
        const options = getMonitoringOptions();
        if (!options.enabled) {
            cancelMonitoringTimer();
            monitoringState.typeCounts.clear();
            monitoringState.totalSinceFlush = 0;
            return;
        }
        if (monitoringTimer) {
            return;
        }
        monitoringTimer = setTimeout(() => {
            monitoringTimer = null;
            flushMonitoring();
        }, options.logIntervalMs);
    };

    const flushMonitoring = () => {
        const options = getMonitoringOptions();
        if (!options.enabled) {
            cancelMonitoringTimer();
            monitoringState.typeCounts.clear();
            monitoringState.totalSinceFlush = 0;
            return;
        }

        const topEvents = Array.from(monitoringState.typeCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, Math.max(1, options.topEventTypes))
            .map(([type, count]) => ({ type, count }));

        console.info('[VariableService][monitor]', {
            activeSubscribers: monitoringState.activeSubscribers,
            pendingEvents: pendingEvents.size,
            totalEvents: monitoringState.totalEvents,
            eventsSinceLast: monitoringState.totalSinceFlush,
            topEvents,
        });
        monitoringState.totalSinceFlush = 0;
        monitoringState.typeCounts.clear();
        scheduleMonitoringFlush();
    };

    const recordMonitoringEvent = (eventType) => {
        const options = getMonitoringOptions();
        if (!options.enabled) {
            return;
        }
        monitoringState.totalEvents += 1;
        monitoringState.totalSinceFlush += 1;
        monitoringState.typeCounts.set(
            eventType,
            (monitoringState.typeCounts.get(eventType) || 0) + 1,
        );
        scheduleMonitoringFlush();
    };

    const scheduleTask = (() => {
        if (typeof queueMicrotask === 'function') {
            return (cb) => queueMicrotask(cb);
        }
        if (typeof Promise === 'function') {
            const resolved = Promise.resolve();
            return (cb) => resolved.then(cb);
        }
        return (cb) => setTimeout(cb, 0);
    })();

    const requestFlush = () => {
        if (flushScheduled) {
            return;
        }
        flushScheduled = true;
        scheduleTask(() => {
            flushScheduled = false;
            if (!pendingEvents.size) {
                return;
            }
            const events = Array.from(pendingEvents.values());
            pendingEvents.clear();
            for (const event of events) {
                dispatchEvent(event);
            }
            if (pendingEvents.size) {
                requestFlush();
            }
        });
    };

    const resolveScriptId = (options = {}) => {
        if (!options) {
            return undefined;
        }
        const raw = options.scriptId ?? options.script_id;
        if (raw === undefined || raw === null) {
            return undefined;
        }
        return String(raw);
    };

    const ensureCharacterStore = (options = {}) => {
        if (typeof config.getCharacterStore !== 'function') {
            throw new Error('当前环境不支持角色变量操作');
        }
        const resolved = config.getCharacterStore(options);
        if (!resolved || typeof resolved !== 'object') {
            throw new Error('无法访问角色变量存储');
        }
        if (!resolved.store || typeof resolved.store !== 'object') {
            throw new Error('角色变量存储不是有效的对象');
        }
        return resolved;
    };

    const ensureScriptStore = (options = {}) => {
        if (typeof config.getScriptStore !== 'function') {
            throw new Error('当前环境不支持脚本变量操作');
        }
        const resolved = config.getScriptStore(options);
        if (!resolved || typeof resolved !== 'object' || !resolved.store || typeof resolved.store !== 'object') {
            throw new Error('无法访问脚本变量存储');
        }
        if (!resolved.scriptId) {
            throw new Error('脚本变量操作缺少 scriptId');
        }
        return resolved;
    };

    const buildEventIdentity = (event) => {
        const messageId = event.messageId ?? '';
        const swipeId = event.swipeId ?? '';
        const characterId = event.characterId ?? '';
        const scriptId = event.scriptId ?? '';
        return `${event.scope}:${characterId}:${scriptId}:${messageId}:${swipeId}:${event.key}`;
    };

    const getInternal = (scope, key, options = {}) => {
        let store;
        if (scope === VARIABLE_SCOPE.MESSAGE) {
            store = ensureMessageStore(options).store;
        } else if (scope === VARIABLE_SCOPE.CHAT) {
            store = ensureChatStore();
        } else if (scope === VARIABLE_SCOPE.GLOBAL) {
            store = ensureGlobalStore();
        } else if (scope === VARIABLE_SCOPE.CHARACTER) {
            store = ensureCharacterStore(options).store;
        } else if (scope === VARIABLE_SCOPE.SCRIPT) {
            store = ensureScriptStore(options).store;
        } else {
            throw new Error(`未知的变量作用域：${scope}`);
        }

        const value = store[key];
        if (options.clone === false) {
            return value;
        }
        return value === undefined ? undefined : cloneValue(value);
    };

    const enqueueEvent = (event) => {
        if (!event) {
            return;
        }

        const identity = buildEventIdentity(event);
        const existing = pendingEvents.get(identity);

        if (existing) {
            if (existing.previous === undefined && event.previous !== undefined) {
                existing.previous = cloneValue(event.previous);
            }
            if (event.type === VARIABLE_EVENTS.DELETE) {
                existing.type = VARIABLE_EVENTS.DELETE;
                existing.value = undefined;
            } else {
                existing.type = VARIABLE_EVENTS.UPDATE;
                existing.value = event.value === undefined ? undefined : cloneValue(event.value);
            }
            existing.persisted = existing.persisted && Boolean(event.persisted);
        } else {
            pendingEvents.set(identity, {
                ...event,
                previous: event.previous === undefined ? undefined : cloneValue(event.previous),
                value: event.value === undefined ? undefined : cloneValue(event.value),
            });
        }

        requestFlush();
    };

    const ensureChatStore = () => {
        const metadata = config.getChatMetadata();
        if (!metadata || typeof metadata !== 'object') {
            throw new Error('无法访问聊天元数据');
        }
        if (!metadata.variables || typeof metadata.variables !== 'object') {
            metadata.variables = {};
        }
        return metadata.variables;
    };

    const ensureGlobalStore = () => {
        const settings = config.getExtensionSettings();
        if (!settings || typeof settings !== 'object') {
            throw new Error('无法访问扩展设置');
        }
        if (!settings.variables || typeof settings.variables !== 'object') {
            settings.variables = { global: {} };
        }
        if (!settings.variables.global || typeof settings.variables.global !== 'object') {
            settings.variables.global = {};
        }
        return settings.variables.global;
    };

    const ensureMessageStore = (options = {}) => {
        const chat = config.getChat();
        if (!Array.isArray(chat) || chat.length === 0) {
            throw new Error('当前会话中没有可用消息');
        }

        const rawMessageId = options.messageId ?? options.message_id;
        let messageId;
        if (typeof rawMessageId === 'string') {
            if (rawMessageId === 'latest' || rawMessageId === 'last') {
                messageId = chat.length - 1;
            } else if (/^-?\d+$/.test(rawMessageId)) {
                messageId = Number(rawMessageId);
            } else {
                throw new Error(`无法解析的消息索引：${rawMessageId}`);
            }
        } else if (Number.isInteger(rawMessageId)) {
            messageId = Number(rawMessageId);
        } else if (rawMessageId === undefined || rawMessageId === null) {
            messageId = chat.length - 1;
        } else {
            throw new Error(`无法解析的消息索引：${String(rawMessageId)}`);
        }

        if (messageId < 0) {
            messageId = chat.length + messageId;
        }
        if (messageId < 0 || messageId >= chat.length) {
            throw new Error(`无效的消息索引：${messageId}`);
        }

        const message = chat[messageId];
        const swipeCount = Array.isArray(message?.swipes) ? message.swipes.length : 0;
        const rawSwipeId = options.swipeId ?? options.swipe_id;
        let swipeId = Number.isInteger(rawSwipeId) ? Number(rawSwipeId) : (message?.swipe_id ?? 0);
        if (swipeId < 0 && swipeCount > 0) {
            swipeId = swipeCount + swipeId;
        }
        if (swipeId < 0) {
            swipeId = 0;
        }

        if (!message.variables || typeof message.variables !== 'object') {
            Object.defineProperty(message, 'variables', {
                value: {},
                writable: true,
                configurable: true,
                enumerable: true,
            });
        }

        if (!message.variables[swipeId] || typeof message.variables[swipeId] !== 'object') {
            message.variables[swipeId] = {};
        }

        return {
            message,
            messageId,
            swipeId,
            store: message.variables[swipeId],
        };
    };

    const applyPersistence = (scope, context = {}) => {
        try {
            switch (scope) {
                case VARIABLE_SCOPE.MESSAGE:
                    config.markChatDirty();
                    break;
                case VARIABLE_SCOPE.CHAT:
                    config.persistChatMetadata();
                    break;
                case VARIABLE_SCOPE.GLOBAL:
                    config.persistGlobalVariables();
                    break;
                case VARIABLE_SCOPE.CHARACTER:
                    if (typeof config.persistCharacterVariables === 'function') {
                        config.persistCharacterVariables({ characterId: context.characterId });
                    }
                    break;
                case VARIABLE_SCOPE.SCRIPT:
                    if (typeof config.persistScriptVariables === 'function') {
                        config.persistScriptVariables({ scriptId: context.scriptId });
                    }
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error('[VariableService] 持久化失败', error);
        }
    };

    const finalizeEvent = (event) => {
        if (!event) {
            return event;
        }

        if (event.type === VARIABLE_EVENTS.BATCH && Array.isArray(event.events)) {
            const fragments = [];
            event.events = event.events
                .map((child) => finalizeEvent(child))
                .filter(Boolean);
            for (const child of event.events) {
                if (Array.isArray(child?.fragments) && child.fragments.length) {
                    fragments.push(
                        ...child.fragments.map((fragment) => ({
                            ...fragment,
                            scope: child.scope,
                            key: child.key,
                        })),
                    );
                }
            }
            event.delta = null;
            event.fragments = fragments;
            return event;
        }

        if (!Object.prototype.hasOwnProperty.call(event, 'delta') || !Object.prototype.hasOwnProperty.call(event, 'fragments')) {
            let delta = null;
            if (event.type === VARIABLE_EVENTS.UPDATE) {
                delta = computeDiff(event.previous, event.value);
            } else if (event.type === VARIABLE_EVENTS.DELETE) {
                delta = { kind: 'delete' };
            }

            event.delta = delta;
            event.fragments = buildFragmentsFromDiff(delta, event.previous).map((fragment) => ({
                ...fragment,
                scope: event.scope,
                key: event.key,
            }));
        }

        return event;
    };

    const dispatchEvent = (rawEvent) => {
        const event = finalizeEvent(rawEvent);
        if (!event) {
            return;
        }

        Object.defineProperty(event, 'timestamp', {
            value: Date.now(),
            enumerable: true,
        });

        recordMonitoringEvent(event.type);

        for (const subscriber of subscribers) {
            try {
                const result = subscriber(event);
                if (result && typeof result.then === 'function') {
                    result.catch((error) => console.error('[VariableService] 订阅回调异常', error));
                }
            } catch (error) {
                console.error('[VariableService] 订阅回调异常', error);
            }
        }
    };

    const buildEvent = (type, scope, key, previous, value, context = {}) => {
        return {
            type,
            scope,
            key,
            previous: previous === undefined ? undefined : cloneValue(previous),
            value: value === undefined ? undefined : cloneValue(value),
            messageId: context.messageId,
            swipeId: context.swipeId,
            characterId: context.characterId,
            scriptId: context.scriptId,
            persisted: true,
        };
    };

    const setInternal = (scope, key, value, options = {}, suppressNotify = false) => {
        const normalized = normalizeValue(value);
        let targetStore;
        let context = {};

        if (scope === VARIABLE_SCOPE.MESSAGE) {
            const resolved = ensureMessageStore(options);
            targetStore = resolved.store;
            context = { messageId: resolved.messageId, swipeId: resolved.swipeId };
        } else if (scope === VARIABLE_SCOPE.CHAT) {
            targetStore = ensureChatStore();
        } else if (scope === VARIABLE_SCOPE.GLOBAL) {
            targetStore = ensureGlobalStore();
        } else if (scope === VARIABLE_SCOPE.CHARACTER) {
            const resolved = ensureCharacterStore(options);
            targetStore = resolved.store;
            context = { characterId: resolved.characterId };
        } else if (scope === VARIABLE_SCOPE.SCRIPT) {
            const resolved = ensureScriptStore(options);
            targetStore = resolved.store;
            context = { scriptId: resolved.scriptId };
        } else {
            throw new Error(`未知的变量作用域：${scope}`);
        }

        const previous = targetStore[key];
        let nextValue = normalized;

        if (options.merge && isPlainObject(normalized) && isPlainObject(previous)) {
            nextValue = deepMerge(previous, normalized);
        }

        if (isEqual(previous, nextValue)) {
            return previous;
        }

        targetStore[key] = cloneValue(nextValue);
        applyPersistence(scope, context);

        if (!suppressNotify) {
            enqueueEvent(buildEvent(VARIABLE_EVENTS.UPDATE, scope, key, previous, nextValue, context));
        }

        return nextValue;
    };

    const removeInternal = (scope, key, options = {}, suppressNotify = false) => {
        let targetStore;
        let context = {};
        let cleanupFn = () => {};

        if (scope === VARIABLE_SCOPE.MESSAGE) {
            const resolved = ensureMessageStore(options);
            targetStore = resolved.store;
            context = { messageId: resolved.messageId, swipeId: resolved.swipeId };
            cleanupFn = () => {
                if (isEmptyObject(targetStore)) {
                    delete resolved.message.variables[resolved.swipeId];
                    if (isEmptyObject(resolved.message.variables)) {
                        delete resolved.message.variables;
                    }
                }
            };
        } else if (scope === VARIABLE_SCOPE.CHAT) {
            targetStore = ensureChatStore();
            cleanupFn = () => {
                if (isEmptyObject(targetStore)) {
                    const metadata = config.getChatMetadata();
                    delete metadata.variables;
                }
            };
        } else if (scope === VARIABLE_SCOPE.GLOBAL) {
            targetStore = ensureGlobalStore();
        } else if (scope === VARIABLE_SCOPE.CHARACTER) {
            const resolved = ensureCharacterStore(options);
            targetStore = resolved.store;
            context = { characterId: resolved.characterId };
        } else if (scope === VARIABLE_SCOPE.SCRIPT) {
            const resolved = ensureScriptStore(options);
            targetStore = resolved.store;
            context = { scriptId: resolved.scriptId };
        } else {
            throw new Error(`未知的变量作用域：${scope}`);
        }

        if (!(key in targetStore)) {
            return false;
        }

        const previous = targetStore[key];
        delete targetStore[key];
        cleanupFn();
        applyPersistence(scope, context);

        if (!suppressNotify) {
            enqueueEvent(buildEvent(VARIABLE_EVENTS.DELETE, scope, key, previous, undefined, context));
        }

        return true;
    };

    const mutateInternal = (scope, key, mutator, options = {}) => {
        if (typeof mutator !== 'function') {
            throw new Error('变量变换回调必须是函数');
        }

        const previous = getInternal(scope, key, { ...options, clone: true });
        const draft = previous === undefined ? undefined : cloneValue(previous);
        const context = { exists: previous !== undefined };

        let result;
        try {
            result = mutator(draft, context);
        } catch (error) {
            console.error('[VariableService] mutate 回调执行失败', error);
            throw error;
        }

        if (result === MUTATION_SKIP) {
            return previous;
        }

        if (result === MUTATION_REMOVE) {
            removeInternal(scope, key, options, false);
            return undefined;
        }

        const nextValue = result === undefined ? draft : result;
        if (nextValue === undefined) {
            removeInternal(scope, key, options, false);
            return undefined;
        }

        return setInternal(scope, key, nextValue, options, false);
    };

    const api = {
        subscribe: (subscriber) => {
            if (typeof subscriber !== 'function') {
                throw new Error('订阅回调必须是函数');
            }
            subscribers.add(subscriber);
            monitoringState.activeSubscribers = subscribers.size;
            scheduleMonitoringFlush();
            return () => {
                subscribers.delete(subscriber);
                monitoringState.activeSubscribers = subscribers.size;
                scheduleMonitoringFlush();
            };
        },
        get: (scope, key, options = {}) => getInternal(scope, key, options),
        set: (scope, key, value, options = {}) => setInternal(scope, key, value, options, false),
        remove: (scope, key, options = {}) => removeInternal(scope, key, options, false),
        mutate: (scope, key, mutator, options = {}) => mutateInternal(scope, key, mutator, options),
        transaction: async (scope, callback, options = {}) => {
            if (typeof callback !== 'function') {
                throw new Error('事务回调必须是函数');
            }

            const operations = [];
            const helpers = {
                set: (key, value, override = {}) => {
                    operations.push({ type: 'set', key, value, options: { ...options, ...override } });
                },
                get: (key, override = {}) => api.get(scope, key, { ...options, ...override }),
                remove: (key, override = {}) => {
                    operations.push({ type: 'delete', key, options: { ...options, ...override } });
                },
            };

            try {
                await callback(helpers);
            } catch (error) {
                if (options.abortOnError !== false) {
                    throw error;
                }
                console.error('[VariableService] 事务执行失败', error);
                return;
            }

            if (!operations.length) {
                return;
            }

            const batchEvents = [];

            for (const operation of operations) {
                if (operation.type === 'set') {
                    const previous = api.get(scope, operation.key, { ...operation.options, clone: true });
                    const nextValue = setInternal(scope, operation.key, operation.value, operation.options, true);
                    if (!isEqual(previous, nextValue)) {
                        batchEvents.push(buildEvent(VARIABLE_EVENTS.UPDATE, scope, operation.key, previous, nextValue, operation.options));
                    }
                } else if (operation.type === 'delete') {
                    const previous = api.get(scope, operation.key, { ...operation.options, clone: true });
                    const removed = removeInternal(scope, operation.key, operation.options, true);
                    if (removed) {
                        batchEvents.push(buildEvent(VARIABLE_EVENTS.DELETE, scope, operation.key, previous, undefined, operation.options));
                    }
                }
            }

            if (batchEvents.length) {
                const batchEvent = {
                    type: VARIABLE_EVENTS.BATCH,
                    scope,
                    key: '*',
                    value: batchEvents.map((event) => cloneValue(event.value)),
                    previous: null,
                    messageId: options.messageId,
                    swipeId: options.swipeId,
                    persisted: true,
                    events: batchEvents,
                };
                dispatchEvent(batchEvent);
            }
        },
        snapshot: (options = {}) => {
            const chatStore = ensureChatStore();
            const globalStore = ensureGlobalStore();
            const chat = config.getChat();
            const messageSnapshot = {};

            chat.forEach((message, messageId) => {
                if (!message?.variables) {
                    return;
                }
                const entries = Object.entries(message.variables).filter(([, store]) => store && typeof store === 'object');
                if (!entries.length) {
                    return;
                }
                messageSnapshot[messageId] = entries.reduce((acc, [swipeId, store]) => {
                    acc[Number(swipeId)] = cloneValue(store);
                    return acc;
                }, {});
            });

            let characterSnapshot;
            if (typeof config.getCharacterStore === 'function') {
                try {
                    const resolved = config.getCharacterStore({});
                    if (resolved?.store && typeof resolved.store === 'object') {
                        characterSnapshot = cloneValue(resolved.store);
                    }
                } catch (_) {
                    // ignore character snapshot errors
                }
            }

            let scriptSnapshot = {};
            if (typeof config.listScriptStores === 'function') {
                try {
                    const scriptStores = config.listScriptStores() ?? {};
                    if (scriptStores && typeof scriptStores === 'object') {
                        scriptSnapshot = Object.entries(scriptStores).reduce((acc, [scriptId, store]) => {
                            if (store && typeof store === 'object') {
                                acc[scriptId] = cloneValue(store);
                            }
                            return acc;
                        }, {});
                    }
                } catch (_) {
                    scriptSnapshot = {};
                }
            }

            const snapshot = {
                global: cloneValue(globalStore),
                chat: cloneValue(chatStore),
                message: messageSnapshot,
                character: characterSnapshot ?? undefined,
                script: scriptSnapshot,
            };

            const track = options.track !== false;

            if (options.incremental && lastSnapshot) {
                const diff = diffSnapshot(lastSnapshot, snapshot);
                if (track) {
                    lastSnapshot = cloneValue(snapshot);
                }
                return diff;
            }

            if (track) {
                lastSnapshot = cloneValue(snapshot);
            }

            return snapshot;
        },
        refreshMonitoringConfig: () => {
            const options = getMonitoringOptions();
            if (options.enabled) {
                scheduleMonitoringFlush();
            } else {
                cancelMonitoringTimer();
                monitoringState.typeCounts.clear();
                monitoringState.totalSinceFlush = 0;
            }
        },
        getMonitoringSnapshot: () => ({
            activeSubscribers: monitoringState.activeSubscribers,
            pendingEvents: pendingEvents.size,
            totalEvents: monitoringState.totalEvents,
            eventsSinceLast: monitoringState.totalSinceFlush,
            topEvents: Array.from(monitoringState.typeCounts.entries())
                .sort((a, b) => b[1] - a[1])
                .map(([type, count]) => ({ type, count })),
            timerArmed: Boolean(monitoringTimer),
            options: getMonitoringOptions(),
        }),
    };

    return Object.freeze(api);
}

export { VARIABLE_SCOPE, VARIABLE_EVENTS, MUTATION_REMOVE, MUTATION_SKIP, createVariableService };
