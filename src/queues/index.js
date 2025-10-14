import { registerQueueMetric } from '../metrics/index.js';

/**
 * 简单的内存任务队列，后续可替换为 bullmq 等持久化实现。
 * @param {string} name 队列名称
 * @param {{ processor?: (task: any) => Promise<void> }} [options]
 */
export function createTaskQueue(name, options = {}) {
    const queue = [];
    let processor = typeof options.processor === 'function' ? options.processor : null;
    let processing = false;
    let activeJobs = 0;
    let drainedAt = 0;

    const unregisterMetrics = registerQueueMetric(name, () => ({
        size: queue.length,
        pending: queue.length + activeJobs,
        info: { activeJobs, drainedAt },
    }));

    async function drainQueue() {
        if (processing || !processor) {
            return;
        }
        processing = true;
        try {
            while (queue.length && processor) {
                const task = queue.shift();
                activeJobs += 1;
                try {
                    await processor(task);
                } catch (error) {
                    console.error(`Task queue "${name}" handler failed:`, error);
                } finally {
                    activeJobs -= 1;
                }
            }
        } finally {
            processing = false;
            drainedAt = Date.now();
        }
    }

    return {
        enqueue(task) {
            queue.push(task);
            void drainQueue();
        },
        setProcessor(fn) {
            processor = typeof fn === 'function' ? fn : null;
            void drainQueue();
        },
        get size() {
            return queue.length;
        },
        get active() {
            return activeJobs;
        },
        clear() {
            queue.length = 0;
        },
        async flush() {
            await drainQueue();
        },
        close() {
            queue.length = 0;
            processor = null;
            unregisterMetrics();
        },
    };
}
