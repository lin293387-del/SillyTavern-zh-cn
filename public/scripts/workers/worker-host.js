/**
 * Worker 端的通用宿主：负责监听主线程派发的任务、执行具体 handler，并反馈进度 / 结果。
 */

import { WorkerMessageType } from './worker-protocol.js';

function serializeError(error) {
    if (!error) {
        return { message: '未知错误' };
    }

    if (typeof error === 'string') {
        return { message: error };
    }

    return {
        message: error.message || '未知错误',
        stack: error.stack,
        name: error.name,
    };
}

export function createWorkerHost(executeTask) {
    if (typeof self === 'undefined') {
        throw new Error('createWorkerHost 只能在 Worker 环境中调用');
    }

    if (typeof executeTask !== 'function') {
        throw new Error('Worker 任务处理器必须是函数');
    }

    const progress = (taskId, data) => {
        if (!taskId) {
            return;
        }
        self.postMessage({
            type: WorkerMessageType.TASK_PROGRESS,
            taskId,
            payload: data,
        });
    };

    self.postMessage({ type: WorkerMessageType.READY });

    self.onmessage = async (event) => {
        const message = event.data || {};
        if (message.type !== WorkerMessageType.TASK_START) {
            return;
        }

        const { taskId, payload } = message;

        try {
            const result = await executeTask(payload, {
                progress: (data) => progress(taskId, data),
            });

            self.postMessage({
                type: WorkerMessageType.TASK_RESULT,
                taskId,
                payload: result,
            });
        } catch (error) {
            self.postMessage({
                type: WorkerMessageType.TASK_ERROR,
                taskId,
                error: serializeError(error),
            });
        }
    };
}
