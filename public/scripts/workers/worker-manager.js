/**
 * Worker 管理器：负责统一调度耗时任务、维护 Worker 生命周期，并在错误时回退至安全实现。
 * 默认开启 Worker 优化；后续可通过“worker优化”开关关闭。
 */

import {
    WorkerMessageType,
    WorkerTaskState,
    WorkerFallbackStrategy,
    getWorkerTaskConfig,
    sanitizeWorkerPayload,
    extendWorkerTaskConfig,
} from './worker-protocol.js';

const WORKER_BASE_PATH = '/scripts/workers/';
const MAX_RETRY = 1;

/**
 * 生成任务唯一标识。
 * @returns {string}
 */
function createTaskId() {
    return `worker-task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
const shownNotices = new Set();

const SUPPRESSED_NOTICE_TYPES = new Set(['tokenizer-count']);

function shouldSuppressNotices(type) {
    return SUPPRESSED_NOTICE_TYPES.has(type);
}

const WORKER_TASK_EVENT = 'st-worker-task';

function emitWorkerLifecycleEvent(eventName, detail = {}) {
    document.dispatchEvent(new CustomEvent(eventName, { detail }));
    return detail;
}

function emitWorkerTaskLifecycle(phase, detail = {}) {
    return emitWorkerLifecycleEvent(WORKER_TASK_EVENT, { phase, ...detail });
}

function serializeWorkerError(error) {
    if (!error) {
        return null;
    }
    if (error instanceof Error) {
        return {
            name: error.name,
            message: error.message,
            stack: error.stack,
        };
    }
    if (typeof error === 'object') {
        return {
            ...error,
            message: error?.message ?? String(error),
        };
    }
    return { message: String(error) };
}

function showYellowNotice(key, message, { suppress = false } = {}) {
    if (shownNotices.has(key)) {
        return;
    }
    shownNotices.add(key);

    const finalMessage = `${message} 如持续出现，请关闭“worker优化”开关。`;

    if (suppress) {
        console.warn('[Worker 提醒]', finalMessage);
        return;
    }

    if (typeof toastr?.warning === 'function') {
        toastr.warning(finalMessage, 'Worker 提醒');
    } else {
        console.warn('[Worker 提醒]', finalMessage);
    }
}

function showRedAlert(key, message, { suppress = false } = {}) {
    if (suppress) {
        console.error('[Worker 警告]', message);
        return;
    }
    if (shownNotices.has(key)) {
        return;
    }
    shownNotices.add(key);

    const finalMessage = `${message} 如持续出现，请关闭“worker优化”开关。`;

    if (typeof toastr?.error === 'function') {
        toastr.error(finalMessage, 'Worker 警告');
    } else {
        console.error('[Worker 警告]', finalMessage);
    }
}

function releaseTaskContext(context) {
    if (!context) {
        return;
    }
    context.originalPayload = undefined;
    context.onProgress = undefined;
}
class WorkerManager {
    constructor() {
        this.enabled = true;
        this.workers = new Map();
        this.pendingTasks = new Map();
    }

    /**
     * 设置 Worker 优化开关。
     * @param {boolean} enabled
     */
    setEnabled(enabled) {
        this.enabled = Boolean(enabled);
        emitWorkerLifecycleEvent('st-worker-enabled-changed', { enabled: this.enabled });
    }

    /**
     * 返回当前 Worker 优化开关状态。
     * @returns {boolean}
     */
    isEnabled() {
        return !!this.enabled;
    }

    /**
     * 注册或替换指定任务的回退逻辑，供第三方扩展调用。
     * @param {string} type
     * @param {Function} fallback
     */
    registerFallback(type, fallback) {
        extendWorkerTaskConfig(type, { fallback });
        emitWorkerLifecycleEvent('st-worker-fallback-registered', { type });
    }

    extendTaskConfig(type, overrides = {}) {
        const sanitizedOverrides = { ...overrides };
        const updated = extendWorkerTaskConfig(type, sanitizedOverrides);
        emitWorkerLifecycleEvent('st-worker-config-updated', { type, overrides: sanitizedOverrides });
        return updated;
    }

    /**
     * 判断浏览器是否支持 Worker。
     */
    isSupported() {
        if (typeof Worker === 'undefined') {
            showYellowNotice('worker-unsupported', '当前环境不支持 Web Worker，已自动回退至主线程执行');
            return false;
        }
        return true;
    }

    /**
     * 获取或创建指定类型的 Worker。
     * @param {string} type
     * @param {string} script
     */
    ensureWorker(type, script) {
        const existing = this.workers.get(type);
        if (existing?.worker) {
            return existing.worker;
        }

        const scriptPath = script.startsWith('/') ? script : `${WORKER_BASE_PATH}${script}`;
        let worker;

        try {
            worker = new Worker(scriptPath, { type: 'module' });
        } catch (error) {
            console.warn(`[Worker] 使用模块模式创建失败，尝试经典模式：${scriptPath}`, error);
            worker = new Worker(scriptPath);
        }

        const context = {
            worker,
            restarts: 0,
        };

        worker.onmessage = (event) => this.handleWorkerMessage(type, event);
        worker.onerror = (event) => {
            console.error(`[Worker] ${type} 运行出错`, event);
            const relatedTasks = Array.from(this.pendingTasks.values()).filter(task => task.type === type);
            if (relatedTasks.length === 0) {
                this.handleWorkerFailure(type, null, new Error(event.message || '未知 Worker 错误'));
                return;
            }
            for (const task of relatedTasks) {
                this.handleWorkerFailure(type, task.id, new Error(event.message || '未知 Worker 错误'), task);
            }
        };

        this.workers.set(type, context);
        return worker;
    }
    handleWorkerMessage(type, event) {
        const message = event.data || {};
        const { type: messageType, taskId, payload, error } = message;

        if (!taskId) {
            if (messageType === WorkerMessageType.READY) {
                console.debug(`[Worker] ${type} 已就绪`);
            }
            return;
        }

        const taskContext = this.pendingTasks.get(taskId);
        if (!taskContext) {
            console.warn(`[Worker] 未找到任务上下文：${taskId}`);
            return;
        }

        switch (messageType) {
            case WorkerMessageType.TASK_PROGRESS: {
                if (typeof taskContext.onProgress === 'function') {
                    taskContext.onProgress(payload);
                }
                break;
            }
            case WorkerMessageType.TASK_RESULT: {
                this.pendingTasks.delete(taskId);
                taskContext.state = WorkerTaskState.COMPLETED;
                releaseTaskContext(taskContext);
                taskContext.resolve(payload);
                break;
            }
            case WorkerMessageType.TASK_ERROR: {
                const err = error instanceof Error ? error : new Error(error?.message || 'Worker 返回错误');
                this.handleWorkerFailure(type, taskId, err, taskContext);
                break;
            }
            default:
                console.warn(`[Worker] 未处理的消息类型：${messageType}`);
        }
    }

    handleWorkerFailure(type, taskId, error, taskContext) {
        const context = taskContext || (taskId ? this.pendingTasks.get(taskId) : null);
        if (context) {
            this.pendingTasks.delete(context.id);
            context.state = WorkerTaskState.FAILED;
        }

        emitWorkerTaskLifecycle('error', {
            type,
            taskId: context?.id ?? taskId ?? null,
            error: serializeWorkerError(error),
            fallbackStrategy: context?.fallbackStrategy ?? null,
        });

        const suppressNotice = shouldSuppressNotices(type);

        if (!context) {
            showRedAlert(`worker-unhandled-${type}`, 'Worker 遇到未捕获错误，请关闭“worker优化”开关并刷新页面。', { suppress: suppressNotice });
            return;
        }

        if (context.fallbackStrategy === WorkerFallbackStrategy.ABORT) {
            showRedAlert(`worker-abort-${type}`, 'Worker 报错，任务已终止。', { suppress: suppressNotice });
            releaseTaskContext(context);
            context.reject?.(error || new Error('Worker 中止'));
            return;
        }

        if (context.fallbackStrategy === WorkerFallbackStrategy.RETRY && (context.attempts ?? 0) < MAX_RETRY) {
            const config = getWorkerTaskConfig(type);
            const script = config?.script || '';
            context.attempts = (context.attempts ?? 0) + 1;
            const suppressRetryNotice = shouldSuppressNotices(type);
            showYellowNotice(`worker-retry-${type}`, 'Worker 出现异常，正在尝试重新初始化。', { suppress: suppressRetryNotice });
            this.restartWorker(type, script);
            const retryPayload = context.originalPayload;
            releaseTaskContext(context);
            this.dispatchTask(type, retryPayload, {
                fallbackStrategy: WorkerFallbackStrategy.IMMEDIATE,
                onProgress: context.onProgress,
            }).then(context.resolve).catch(context.reject);
            return;
        }

        const message = `Worker 任务失败：${type}，将启动回退处理。`;
        showYellowNotice(`worker-fallback-${type}`, message, { suppress: suppressNotice });

        this.executeFallback(type, context, error);
    }

    async executeFallback(type, context, error) {
        const fallbackKey = context?.fallbackKey || `worker-fallback-${type}`;
        const config = getWorkerTaskConfig(type);
        const fallback = config?.fallback;

        const suppressNotice = shouldSuppressNotices(type);

        emitWorkerTaskLifecycle('fallback', {
            type,
            taskId: context?.id ?? null,
            error: serializeWorkerError(error),
        });

        if (typeof fallback !== 'function') {
            console.error(`[Worker] ${type} 未提供回退函数`);
            showRedAlert(`${fallbackKey}-missing`, 'Worker 回退失败，任务已终止。', { suppress: suppressNotice });
            emitWorkerTaskLifecycle('fallback-error', {
                type,
                taskId: context?.id ?? null,
                error: serializeWorkerError(error || new Error('Worker 回退失败')),
            });
            releaseTaskContext(context);
            context?.reject?.(error || new Error('Worker 回退失败'));
            return;
        }

        try {
            context?.state && (context.state = WorkerTaskState.FALLBACK);
            const result = await fallback(context?.originalPayload, error);
            emitWorkerTaskLifecycle('fallback-complete', {
                type,
                taskId: context?.id ?? null,
            });
            releaseTaskContext(context);
            context?.resolve?.(result);
        } catch (fallbackError) {
            console.error(`[Worker] ${type} 回退逻辑执行失败`, fallbackError);
            showRedAlert(`${fallbackKey}-failed`, 'Worker 与回退均失败，任务已终止。', { suppress: suppressNotice });
            emitWorkerTaskLifecycle('fallback-error', {
                type,
                taskId: context?.id ?? null,
                error: serializeWorkerError(fallbackError),
            });
            releaseTaskContext(context);
            context?.reject?.(fallbackError);
        }
    }
    restartWorker(type, script) {
        const entry = this.workers.get(type);
        if (entry?.worker) {
            try {
                entry.worker.terminate();
            } catch (terminateError) {
                console.warn(`[Worker] 终止 ${type} 失败`, terminateError);
            }
        }

        const restarts = (entry?.restarts ?? 0) + 1;
        this.workers.delete(type);
        const worker = this.ensureWorker(type, script);
        this.workers.set(type, { worker, restarts });
        return worker;
    }

    /**
     * 派发任务到 Worker。
     * @param {string} type 任务类型。
     * @param {object} payload 任务入参。
     * @param {{ fallbackStrategy?: string, onProgress?: Function, signal?: AbortSignal }} options
     * @returns {Promise<any>}
     */
    dispatchTask(type, payload, options = {}) {
        const config = getWorkerTaskConfig(type);
        if (!config) {
            showYellowNotice(`worker-missing-${type}`, `未注册 Worker 任务：${type}，已使用原逻辑执行。`);
            return Promise.resolve(undefined);
        }

        if (typeof config.fallback !== 'function') {
            showRedAlert(`worker-missing-fallback-${type}`, 'Worker 配置缺少回退逻辑，任务已终止。');
            return Promise.reject(new Error(`Worker 任务 ${type} 缺少回退函数`));
        }

        const sanitizedPayload = sanitizeWorkerPayload(payload);
        const fallbackStrategy = options.fallbackStrategy || WorkerFallbackStrategy.IMMEDIATE;
        const lifecycleBase = {
            type,
            payload: sanitizedPayload,
            fallbackStrategy,
            usingWorker: this.enabled && this.isSupported(),
            hasProgressHandler: typeof options.onProgress === 'function',
            hasAbortSignal: options.signal instanceof AbortSignal,
        };

        if (!this.enabled || !this.isSupported()) {
            emitWorkerTaskLifecycle('start', { ...lifecycleBase, taskId: null });
            return Promise.resolve()
                .then(() => config.fallback(payload))
                .then((result) => {
                    emitWorkerTaskLifecycle('complete', {
                        ...lifecycleBase,
                        taskId: null,
                        result: sanitizeWorkerPayload(result),
                        viaFallback: true,
                    });
                    return result;
                })
                .catch((error) => {
                    emitWorkerTaskLifecycle('error', {
                        ...lifecycleBase,
                        taskId: null,
                        error: serializeWorkerError(error),
                        viaFallback: true,
                    });
                    throw error;
                });
        }

        const script = config.script || '';
        const worker = this.ensureWorker(type, script);
        const taskId = createTaskId();

        emitWorkerTaskLifecycle('start', { ...lifecycleBase, taskId });

        return new Promise((resolve, reject) => {
            const resolveWithLifecycle = (value) => {
                releaseTaskContext(taskContext);
                emitWorkerTaskLifecycle('complete', {
                    ...lifecycleBase,
                    taskId,
                    result: sanitizeWorkerPayload(value),
                    viaFallback: false,
                });
                resolve(value);
            };

            const rejectWithLifecycle = (err) => {
                releaseTaskContext(taskContext);
                emitWorkerTaskLifecycle('error', {
                    ...lifecycleBase,
                    taskId,
                    error: serializeWorkerError(err),
                });
                reject(err);
            };

            const taskContext = {
                id: taskId,
                type,
                state: WorkerTaskState.RUNNING,
                attempts: 0,
                fallbackStrategy,
                resolve: resolveWithLifecycle,
                reject: rejectWithLifecycle,
                onProgress: options.onProgress,
                originalPayload: payload,
                fallbackKey: `worker-fallback-${type}`,
            };

            this.pendingTasks.set(taskId, taskContext);

            const message = {
                type: WorkerMessageType.TASK_START,
                taskId,
                payload: sanitizedPayload,
            };

            try {
                worker.postMessage(message);
            } catch (error) {
                console.error(`[Worker] 向 ${type} 派发任务失败`, error);
                this.pendingTasks.delete(taskId);
                this.handleWorkerFailure(type, taskId, error, taskContext);
                return;
            }

            if (options.signal instanceof AbortSignal) {
                options.signal.addEventListener('abort', () => {
                    if (!this.pendingTasks.has(taskId)) {
                        return;
                    }
                    this.pendingTasks.delete(taskId);
                    showYellowNotice(`worker-abort-${taskId}`, '任务已取消，将回退至主线程。');
                    this.executeFallback(type, taskContext, new DOMException('任务已取消', 'AbortError'));
                }, { once: true });
            }
        })
            .catch((error) => {
                if (fallbackStrategy === WorkerFallbackStrategy.RETRY) {
                    const entry = this.workers.get(type);
                    const restarts = entry?.restarts ?? 0;
                    if (restarts < MAX_RETRY) {
                        this.restartWorker(type, script);
                        return this.dispatchTask(type, payload, {
                            ...options,
                            fallbackStrategy: WorkerFallbackStrategy.IMMEDIATE,
                        });
                    }
                }
                throw error;
            });
    }
}

export const workerManager = new WorkerManager();

if (typeof window !== 'undefined') {
    window.workerManager = workerManager;
    window.registerWorkerFallback = (type, fallback) => workerManager.registerFallback(type, fallback);
    window.extendWorkerTaskConfig = (type, overrides) => workerManager.extendTaskConfig(type, overrides);
}
