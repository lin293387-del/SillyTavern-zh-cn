import express from 'express';

import { createImportTask, getImportTask } from '../services/import-task-manager.js';

export const router = express.Router();

const SUPPORTED_TYPES = new Set(['character', 'chat', 'preset', 'formatting', 'theme']);

router.post('/parse', async (request, response) => {
    const { type, ...rest } = request.body || {};

    if (!type) {
        return response.status(400).json({ error: 'Missing type parameter' });
    }

    if (!SUPPORTED_TYPES.has(type)) {
        return response.status(400).json({ error: `Unsupported import type: ${type}` });
    }

    if (!request.file) {
        return response.status(400).json({ error: 'Missing file upload' });
    }

    const queue = request.app.get('queues:import');
    if (!queue) {
        return response.status(503).json({ error: 'Import queue unavailable' });
    }

    const task = createImportTask({ type, originalName: request.file.originalname });

    queue.enqueue({
        taskId: task.id,
        type,
        filePath: request.file.path,
        originalName: request.file.originalname,
        userDirectories: request.user?.directories,
        options: rest,
    });

    return response.status(202).json({ taskId: task.id, status: task.status });
});

router.get('/tasks/:taskId', (request, response) => {
    const task = getImportTask(request.params.taskId);
    if (!task) {
        return response.status(404).json({ error: 'Task not found' });
    }
    return response.json(task);
});
