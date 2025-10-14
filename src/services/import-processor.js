import fs from 'node:fs';

import { completeImportTask, failImportTask, ImportTaskStatus, updateImportTask } from './import-task-manager.js';
import { parseCharacterBuffer } from '../utils/character-importer.js';
import { parseChatBuffer } from '../utils/chat-importer.js';
import { parsePresetBuffer } from '../utils/preset-importer.js';
import { parseThemeBuffer } from '../utils/theme-importer.js';

export function registerImportProcessors(queue) {
    if (!queue) {
        throw new Error('Cannot register import processors without queue');
    }

    queue.setProcessor(async (task) => {
        const { taskId, type, filePath, originalName, userDirectories, options = {} } = task;
        if (!taskId) {
            console.error('[import:parse] Task missing taskId');
            return;
        }
        updateImportTask(taskId, { status: ImportTaskStatus.RUNNING });

        try {
            let result;
            const buffer = await fs.promises.readFile(filePath);
            switch (type) {
                case 'character': {
                    result = await parseCharacterBuffer(buffer, originalName, userDirectories, options);
                    break;
                }
                case 'chat': {
                    result = parseChatBuffer(buffer, originalName, options);
                    break;
                }
                case 'preset':
                case 'formatting': {
                    result = parsePresetBuffer(buffer, originalName, options);
                    break;
                }
                case 'theme': {
                    result = parseThemeBuffer(buffer, originalName);
                    break;
                }
                default:
                    throw new Error(`Unsupported import type: ${type}`);
            }

            completeImportTask(taskId, result);
        } catch (error) {
            console.error('[import:parse] Task failed:', error);
            failImportTask(taskId, error);
        } finally {
            if (filePath) {
                fs.promises.unlink(filePath).catch(() => {});
            }
        }
    });
}
