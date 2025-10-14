/**
 * Worker 协议定义
 *
 * 目标：为耗时任务（词元计数、宏替换、提示拼装、ZIP 解析等）提供统一的任务注册、消息协议与回退约束。
 * 说明：当前文件聚焦于消息结构与生命周期枚举，具体的 Worker 调度逻辑在后续步骤中实现。
 */

/**
 * Worker 与主线程之间的消息类型。
 * - INIT：主线程初始化 Worker。
 * - READY：Worker 完成初始化，待命接收任务。
 * - TASK_START：主线程派发任务。
 * - TASK_PROGRESS：Worker 上报进度（可选）。
 * - TASK_RESULT：任务成功完成。
 * - TASK_ERROR：任务失败，触发回退。
 * - SHUTDOWN：主线程要求 Worker 释放资源。
 */
export const WorkerMessageType = Object.freeze({
    INIT: 'init',
    READY: 'ready',
    TASK_START: 'task-start',
    TASK_PROGRESS: 'task-progress',
    TASK_RESULT: 'task-result',
    TASK_ERROR: 'task-error',
    SHUTDOWN: 'shutdown',
});

/**
 * 任务生命周期状态。
 * - IDLE：任务尚未派发。
 * - RUNNING：已派发且执行中。
 * - COMPLETED：Worker 已返回成功结果。
 * - FAILED：Worker 抛出异常或返回错误，将触发回退。
 * - FALLBACK：已切换至同步/旧逻辑执行。
 */
export const WorkerTaskState = Object.freeze({
    IDLE: 'idle',
    RUNNING: 'running',
    COMPLETED: 'completed',
    FAILED: 'failed',
    FALLBACK: 'fallback',
});

/**
 * 任务失败时的回退策略设定。
 * - IMMEDIATE：直接落回主线程同步实现。
 * - RETRY：刷新 Worker 并重试一次；若再次失败再切回同步。
 * - ABORT：终止任务，提醒用户关闭“worker优化”。适用于潜在数据破坏风险。
 */
export const WorkerFallbackStrategy = Object.freeze({
    IMMEDIATE: 'immediate',
    RETRY: 'retry',
    ABORT: 'abort',
});

/**
 * 任务元数据结构：
 * {
 *   id: string;              // 任务唯一标识
 *   type: string;            // 业务类型（tokenizer、prompt、macro、zip 等）
 *   payload: object;         // 派发给 Worker 的纯数据入参
 *   fallbackStrategy: WorkerFallbackStrategy;
 *   timestamp: number;       // 创建时间戳
 * }
 */

/**
 * Worker 注册表：记录每个任务类型对应的 Worker 脚本路径与回退处理。
 * 格式：
 * {
 *   tokenizer: {
 *     script: 'workers/tokenizer-worker.js',
 *     fallback: (payload) => Promise.resolve('legacy result'),
 *   },
 *   ...
 * }
 */
export const workerTaskRegistry = new Map();

/**
 * 注册 Worker 任务处理器。
 * @param {string} type 任务类型。
 * @param {{ script: string, fallback: Function }} options Worker 配置。
 */
export function registerWorkerTask(type, { script, fallback }) {
    if (!type || typeof type !== 'string') {
        throw new Error('Worker 任务类型必须为非空字符串');
    }

    if (workerTaskRegistry.has(type)) {
        console.warn(`[Worker] 任务类型 "${type}" 已注册，将覆盖旧配置`);
    }

    workerTaskRegistry.set(type, {
        script,
        fallback,
    });
}

/**
 * 获取指定类型的 Worker 配置。
 * @param {string} type 任务类型。
 * @returns {{ script: string, fallback: Function } | undefined}
 */
export function getWorkerTaskConfig(type) {
    return workerTaskRegistry.get(type);
}

/**
 * 覆写或扩展指定任务的配置。
 * @param {string} type
 * @param {{ script?: string, fallback?: Function }} overrides
 * @returns {{ script: string, fallback: Function }}
 */
export function extendWorkerTaskConfig(type, overrides = {}) {
    if (!type || typeof type !== 'string') {
        throw new Error('extendWorkerTaskConfig 需要有效的任务类型');
    }
    const current = workerTaskRegistry.get(type);
    if (!current) {
        throw new Error(`未找到 Worker 任务配置：${type}`);
    }
    const next = {
        ...current,
        ...overrides,
    };
    workerTaskRegistry.set(type, next);
    return next;
}

/**
 * 从 Worker 消息中提取安全 payload。
 * 仅保留 JSON 可序列化数据，防止 Worker 误传函数或循环引用。
 */
export function sanitizeWorkerPayload(payload) {
    if (!payload || typeof payload !== 'object') {
        return payload;
    }

    try {
        return JSON.parse(JSON.stringify(payload));
    } catch (error) {
        console.warn('[Worker] payload 无法序列化，返回空对象', error);
        return {};
    }
}
