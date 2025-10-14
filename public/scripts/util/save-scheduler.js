const schedulerRegistry = new Map();
const schedulerMetadata = new Map();

export function defineSaveScheduler(id, config = {}) {
    if (!id) {
        throw new TypeError('defineSaveScheduler 需要有效的标识');
    }
    schedulerMetadata.set(id, { id, ...config });
}

export function createSaveScheduler(id, factory) {
    if (!id || typeof factory !== 'function') {
        throw new TypeError('createSaveScheduler 需要标识与工厂函数');
    }
    if (!schedulerRegistry.has(id)) {
        schedulerRegistry.set(id, factory());
    }
    return schedulerRegistry.get(id);
}

export function getSaveScheduler(id) {
    return schedulerRegistry.get(id) ?? null;
}

export function getSaveSchedulerMetadata(id) {
    return schedulerMetadata.get(id) ?? null;
}

export function listSaveSchedulers() {
    return Array.from(schedulerMetadata.values());
}
