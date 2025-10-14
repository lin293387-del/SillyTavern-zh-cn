const MAX_TOTAL_QUEUE_LENGTH = 150;
const IDLE_FALLBACK_BUDGET = 12; // ms when requestIdleCallback is unavailable

const QUEUE_DEFINITIONS = {
    pipeline: {
        name: 'pipeline',
        priority: 3,
        maxPerBatch: Infinity,
        frameBudget: 12,
        metricTag: 'pipeline',
        dropPolicy: 'none',
    },
    media: {
        name: 'media',
        priority: 2,
        maxPerBatch: 4,
        frameBudget: 8,
        metricTag: 'media',
        dropPolicy: 'defer',
    },
    extension: {
        name: 'extension',
        priority: 1,
        maxPerBatch: 2,
        frameBudget: 6,
        metricTag: 'extension',
        dropPolicy: 'drop-oldest',
    },
};

const FALLBACK_QUEUE = 'pipeline';
const PRIORITIZED_QUEUE_NAMES = Object.values(QUEUE_DEFINITIONS)
    .sort((a, b) => b.priority - a.priority)
    .map((definition) => definition.name);

const queueState = new Map(
    PRIORITIZED_QUEUE_NAMES.map((name) => [name, {
        items: [],
        metrics: {
            processed: 0,
            dropped: 0,
            peakLength: 0,
        },
    }]),
);

const renderTaskObservers = new Set();
const globalMetrics = {
    peakTotalLength: 0,
    totalProcessed: 0,
    totalDropped: 0,
    overflowCount: 0,
    batches: 0,
    totalDuration: 0,
    lastBatchDuration: 0,
};

let schedulerHandle = null;
let usingIdleCallback = false;

function getNow() {
    return typeof performance !== 'undefined' && typeof performance.now === 'function'
        ? performance.now()
        : Date.now();
}

function getQueueConfig(name = FALLBACK_QUEUE) {
    const normalized = typeof name === 'string' ? name : FALLBACK_QUEUE;
    return QUEUE_DEFINITIONS[normalized] || QUEUE_DEFINITIONS[FALLBACK_QUEUE];
}

function getQueueState(name = FALLBACK_QUEUE) {
    const config = getQueueConfig(name);
    return queueState.get(config.name);
}

function getTotalQueueLength() {
    let total = 0;
    queueState.forEach((state) => {
        total += state.items.length;
    });
    return total;
}

function buildQueueSnapshot() {
    const snapshot = {};
    queueState.forEach((state, name) => {
        snapshot[name] = {
            length: state.items.length,
            processed: state.metrics.processed,
            dropped: state.metrics.dropped,
            peakLength: state.metrics.peakLength,
        };
    });
    return snapshot;
}

function buildMetricsSnapshot(reason, extra = {}) {
    const totalQueueLength = getTotalQueueLength();
    const snapshot = {
        reason,
        timestamp: Date.now(),
        totalQueueLength,
        queueLength: totalQueueLength,
        peakTotalLength: globalMetrics.peakTotalLength,
        totalProcessed: globalMetrics.totalProcessed,
        totalDropped: globalMetrics.totalDropped,
        overflowCount: globalMetrics.overflowCount,
        batches: globalMetrics.batches,
        totalDuration: globalMetrics.totalDuration,
        lastBatchDuration: globalMetrics.lastBatchDuration,
        queues: buildQueueSnapshot(),
        ...extra,
    };
    return snapshot;
}

function publishRenderTaskMetrics(reason, extra = {}) {
    const snapshot = buildMetricsSnapshot(reason, extra);
    renderTaskObservers.forEach((listener) => {
        try {
            listener(snapshot);
        } catch (observerError) {
            console.error('渲染任务观察者回调执行失败', observerError);
        }
    });

    if (reason === 'batch-complete' || reason === 'overflow') {
        const average = globalMetrics.batches
            ? globalMetrics.totalDuration / globalMetrics.batches
            : 0;
        console.info('[renderQueue]', `长度=${snapshot.totalQueueLength}`, `均值=${average.toFixed(2)}ms`, snapshot);
    }
}

function dropLowPriorityTasks() {
    let total = getTotalQueueLength();
    if (total <= MAX_TOTAL_QUEUE_LENGTH) {
        return;
    }

    for (let i = PRIORITIZED_QUEUE_NAMES.length - 1; i >= 0 && total > MAX_TOTAL_QUEUE_LENGTH; i -= 1) {
        const queueName = PRIORITIZED_QUEUE_NAMES[i];
        const config = getQueueConfig(queueName);
        if (config.dropPolicy !== 'drop-oldest') {
            continue;
        }
        const state = getQueueState(queueName);
        let droppedCount = 0;
        while (state.items.length && total > MAX_TOTAL_QUEUE_LENGTH) {
            const dropIndex = state.items.findIndex((entry) => entry?.allowDrop !== false);
            if (dropIndex === -1) {
                break;
            }
            const [dropped] = state.items.splice(dropIndex, 1);
            state.metrics.dropped += 1;
            globalMetrics.totalDropped += 1;
            droppedCount += 1;
            if (typeof dropped?.onDrop === 'function') {
                try {
                    dropped.onDrop();
                } catch (error) {
                    console.error('渲染任务丢弃回调执行失败', error);
                }
            }
            total -= 1;
        }
        if (droppedCount > 0) {
            console.warn(`[renderQueue] 由于积压，从 ${queueName} 队列丢弃了 ${droppedCount} 个任务`);
        }
    }

    if (total > MAX_TOTAL_QUEUE_LENGTH) {
        globalMetrics.overflowCount += 1;
        publishRenderTaskMetrics('overflow', { totalQueueLength: total });
    }
}

function ensureScheduler() {
    if (schedulerHandle !== null) {
        return;
    }

    const runner = (deadline) => {
        schedulerHandle = null;
        usingIdleCallback = typeof deadline?.timeRemaining === 'function';
        runQueues(deadline);
        if (getTotalQueueLength() > 0) {
            ensureScheduler();
        }
    };

    if (typeof requestIdleCallback === 'function') {
        schedulerHandle = requestIdleCallback(runner, { timeout: IDLE_FALLBACK_BUDGET });
    } else {
        schedulerHandle = requestAnimationFrame(() => runner());
    }
}

function executeTaskEntry(entry) {
    if (!entry) {
        return;
    }
    try {
        entry.fn?.();
    } catch (error) {
        console.error('延迟渲染任务执行失败', error);
    }
}

function processQueue(queueName, deadline) {
    const config = getQueueConfig(queueName);
    const state = getQueueState(queueName);
    if (!state || !state.items.length) {
        return 0;
    }

    const start = getNow();
    const frameBudget = config.frameBudget ?? Infinity;
    const maxPerBatch = config.maxPerBatch ?? Infinity;
    let processed = 0;

    while (state.items.length && processed < maxPerBatch) {
        if (usingIdleCallback && deadline && typeof deadline.timeRemaining === 'function') {
            if (deadline.timeRemaining() <= 3 && processed > 0) {
                break;
            }
        } else if (!usingIdleCallback && frameBudget !== Infinity) {
            if ((getNow() - start) >= frameBudget && processed > 0) {
                break;
            }
        }

        const entry = state.items.shift();
        executeTaskEntry(entry);
        processed += 1;
        state.metrics.processed += 1;
    }

    if (state.items.length > state.metrics.peakLength) {
        state.metrics.peakLength = state.items.length;
    }

    return processed;
}

function runQueues(deadline) {
    const batchStart = getNow();
    let processedTotal = 0;

    for (const queueName of PRIORITIZED_QUEUE_NAMES) {
        processedTotal += processQueue(queueName, deadline);
    }

    const batchDuration = Math.max(0, getNow() - batchStart);
    if (processedTotal > 0) {
        const totalLength = getTotalQueueLength();
        if (totalLength > globalMetrics.peakTotalLength) {
            globalMetrics.peakTotalLength = totalLength;
        }
        globalMetrics.totalProcessed += processedTotal;
        globalMetrics.batches += 1;
        globalMetrics.totalDuration += batchDuration;
        globalMetrics.lastBatchDuration = batchDuration;
        publishRenderTaskMetrics('batch-complete', { processed: processedTotal, duration: batchDuration });
    }
}

function normalizeScheduleOptions(policyOrOptions) {
    if (!policyOrOptions) {
        return { queue: FALLBACK_QUEUE };
    }

    if (typeof policyOrOptions === 'string') {
        return { queue: policyOrOptions };
    }

    if (typeof policyOrOptions === 'object') {
        return {
            queue: policyOrOptions.queue ?? policyOrOptions.policy ?? FALLBACK_QUEUE,
            allowDrop: policyOrOptions.allowDrop,
            label: policyOrOptions.label,
            onDrop: policyOrOptions.onDrop,
        };
    }

    return { queue: FALLBACK_QUEUE };
}

export function scheduleRenderTask(task, policyOrOptions) {
    if (typeof task !== 'function') {
        return;
    }

    const options = normalizeScheduleOptions(policyOrOptions);
    const config = getQueueConfig(options.queue);
    const state = getQueueState(config.name);

    const entry = {
        fn: task,
        allowDrop: options.allowDrop ?? config.dropPolicy === 'drop-oldest',
        onDrop: typeof options.onDrop === 'function' ? options.onDrop : null,
        label: options.label ?? config.metricTag,
    };

    state.items.push(entry);
    if (state.items.length > state.metrics.peakLength) {
        state.metrics.peakLength = state.items.length;
    }

    const totalLength = getTotalQueueLength();
    if (totalLength > globalMetrics.peakTotalLength) {
        globalMetrics.peakTotalLength = totalLength;
    }

    dropLowPriorityTasks();
    ensureScheduler();
}

export function flushRenderTasks(targetQueues) {
    const queueNames = Array.isArray(targetQueues) && targetQueues.length
        ? targetQueues
        : PRIORITIZED_QUEUE_NAMES;

    queueNames.forEach((queueName) => {
        const state = getQueueState(queueName);
        if (!state) {
            return;
        }
        while (state.items.length) {
            const entry = state.items.shift();
            executeTaskEntry(entry);
            state.metrics.processed += 1;
            globalMetrics.totalProcessed += 1;
        }
    });

    schedulerHandle = null;
    publishRenderTaskMetrics('manual-flush', { viaFlush: true });
}

export function getRenderTaskSnapshot() {
    return buildMetricsSnapshot('snapshot');
}

export function subscribeRenderTaskObserver(listener) {
    if (typeof listener === 'function') {
        renderTaskObservers.add(listener);
    }
}

export function unsubscribeRenderTaskObserver(listener) {
    renderTaskObservers.delete(listener);
}

export function exposeRenderTaskDebug(target = globalThis) {
    if (!target) {
        return;
    }

    const debugNamespace = target.__renderTaskDebug__ ?? {};
    debugNamespace.snapshot = () => getRenderTaskSnapshot();
    debugNamespace.subscribe = (listener) => subscribeRenderTaskObserver(listener);
    debugNamespace.unsubscribe = (listener) => unsubscribeRenderTaskObserver(listener);
    target.__renderTaskDebug__ = debugNamespace;
}
