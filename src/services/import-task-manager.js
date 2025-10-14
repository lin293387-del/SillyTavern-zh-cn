import { randomUUID } from 'node:crypto';

export const ImportTaskStatus = {
    PENDING: 'pending',
    RUNNING: 'running',
    COMPLETED: 'completed',
    FAILED: 'failed',
};

const tasks = new Map();

export function createImportTask({ type, originalName }) {
    const id = randomUUID();
    const now = Date.now();
    const task = {
        id,
        type,
        status: ImportTaskStatus.PENDING,
        createdAt: now,
        updatedAt: now,
        originalName,
    };
    tasks.set(id, task);
    return task;
}

export function getImportTask(taskId) {
    return tasks.get(taskId) || null;
}

export function updateImportTask(taskId, patch = {}) {
    const task = tasks.get(taskId);
    if (!task) {
        return null;
    }
    Object.assign(task, patch, { updatedAt: Date.now() });
    return task;
}

export function completeImportTask(taskId, result) {
    return updateImportTask(taskId, {
        status: ImportTaskStatus.COMPLETED,
        result,
        completedAt: Date.now(),
    });
}

export function failImportTask(taskId, error) {
    return updateImportTask(taskId, {
        status: ImportTaskStatus.FAILED,
        error: serializeError(error),
        completedAt: Date.now(),
    });
}

export function removeImportTask(taskId) {
    tasks.delete(taskId);
}

function serializeError(error) {
    if (!error) return null;
    if (typeof error === 'string') {
        return { message: error };
    }
    return {
        name: error.name || 'Error',
        message: error.message || String(error),
        stack: error.stack,
    };
}
