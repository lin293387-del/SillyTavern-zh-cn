import express from 'express';

import { getPipeline } from '../transformers.js';
import { createCache } from '../utils/cacheFactory.js';

const TASK = 'text-classification';

export const router = express.Router();

/**
 * @type {Map<string, object>} Cache for classification results
 */
const classifyCache = createCache('classify:labels', {
    ttlMs: 10 * 60 * 1000,
    maxEntries: 200,
});

router.post('/labels', async (req, res) => {
    try {
        const pipe = await getPipeline(TASK);
        const result = Object.keys(pipe.model.config.label2id);
        return res.json({ labels: result });
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
});

router.post('/', async (req, res) => {
    try {
        const { text } = req.body;

        /**
         * Get classification result for a given text
         * @param {string} text Text to classify
         * @returns {Promise<object>} Classification result
         */
        async function getResult(text) {
            if (classifyCache.has(text)) {
                return classifyCache.get(text);
            } else {
                const pipe = await getPipeline(TASK);
                const result = await pipe(text, { topk: 5 });
                result.sort((a, b) => b.score - a.score);
                classifyCache.set(text, result);
                return result;
            }
        }

        console.debug('Classify input:', text);
        const result = await getResult(text);
        console.debug('Classify output:', result);

        return res.json({ classification: result });
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
});
