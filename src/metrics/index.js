import express from 'express';
import { listRegisteredCaches } from '../utils/cacheFactory.js';

const queueProviders = new Map();

function normalizeName(name) {
    if (typeof name === 'string') {
        return name;
    }
    if (typeof name === 'symbol') {
        return name.toString();
    }
    return String(name);
}

function sanitizeLabelValue(value) {
    return String(value).replace(/"/g, '\\"');
}

function sanitizeMetricName(name) {
    return String(name).replace(/[^a-zA-Z0-9_]/g, '_');
}

/**
 * 注册一个队列指标采集器。
 * @param {string|symbol} name
 * @param {() => { size?: number, pending?: number, info?: any }} collector
 * @returns {() => void}
 */
export function registerQueueMetric(name, collector) {
    if (typeof collector !== 'function') {
        throw new TypeError('registerQueueMetric 需要提供函数作为采集器');
    }
    const key = normalizeName(name);
    queueProviders.set(key, collector);
    return () => queueProviders.delete(key);
}

export function listQueueMetrics() {
    return Array.from(queueProviders.keys());
}

export function collectMetrics() {
    const caches = listRegisteredCaches().map((entry) => {
        const { name, cache, stats, options } = entry;
        const hitCount = stats.hits ?? 0;
        const missCount = stats.misses ?? 0;
        const total = hitCount + missCount;
        const hitRate = total > 0 ? hitCount / total : 0;
        return {
            name: normalizeName(name),
            size: cache.size,
            ttlMs: options.ttlMs,
            maxEntries: options.maxEntries,
            hits: hitCount,
            misses: missCount,
            hitRate,
            evictions: {
                ttl: stats.evictions.ttl,
                lru: stats.evictions.lru,
                manual: stats.evictions.manual,
            },
        };
    });

    const queues = [];
    for (const [name, collector] of queueProviders.entries()) {
        try {
            const snapshot = collector() ?? {};
            queues.push({
                name,
                size: Number(snapshot.size ?? snapshot.length ?? 0),
                pending: Number(snapshot.pending ?? snapshot.backlog ?? 0),
                info: snapshot.info ?? null,
            });
        } catch (error) {
            queues.push({
                name,
                error: error?.message ?? String(error),
                size: 0,
                pending: 0,
                info: null,
            });
        }
    }

    return {
        timestamp: new Date().toISOString(),
        caches,
        queues,
    };
}

function formatPrometheus(metrics) {
    const lines = [];
    lines.push('# HELP sillytavern_cache_size 当前缓存条目数量');
    lines.push('# TYPE sillytavern_cache_size gauge');
    for (const cache of metrics.caches) {
        const label = `name="${sanitizeLabelValue(cache.name)}"`;
        lines.push(`sillytavern_cache_size{${label}} ${cache.size}`);
        lines.push(`sillytavern_cache_max_entries{${label}} ${cache.maxEntries ?? 0}`);
        lines.push(`sillytavern_cache_ttl_ms{${label}} ${cache.ttlMs ?? 0}`);
        lines.push(`sillytavern_cache_hits_total{${label}} ${cache.hits}`);
        lines.push(`sillytavern_cache_misses_total{${label}} ${cache.misses}`);
        lines.push(`sillytavern_cache_evictions_total{${label},reason="ttl"} ${cache.evictions.ttl}`);
        lines.push(`sillytavern_cache_evictions_total{${label},reason="lru"} ${cache.evictions.lru}`);
        lines.push(`sillytavern_cache_evictions_total{${label},reason="manual"} ${cache.evictions.manual}`);
    }

    lines.push('# HELP sillytavern_queue_size 队列当前积压任务数');
    lines.push('# TYPE sillytavern_queue_size gauge');
    for (const queue of metrics.queues) {
        const label = `name="${sanitizeLabelValue(queue.name)}"`;
        lines.push(`sillytavern_queue_size{${label}} ${queue.size}`);
        lines.push(`sillytavern_queue_pending{${label}} ${queue.pending}`);
        if (queue.error) {
            lines.push(`# Warning: queue ${sanitizeMetricName(queue.name)} error ${queue.error}`);
        }
    }

    return `${lines.join('\n')}\n`;
}

export const metricsRouter = express.Router();

function sendMetrics(req, res) {
    const metrics = collectMetrics();
    const wantPromText = req.query.format === 'prom' || req.accepts(['text/plain', 'application/json']) === 'text/plain';
    if (wantPromText) {
        res.type('text/plain').send(formatPrometheus(metrics));
        return;
    }
    res.json(metrics);
}

metricsRouter.get('/json', sendMetrics);
metricsRouter.get('/prometheus', (req, res) => {
    res.type('text/plain').send(formatPrometheus(collectMetrics()));
});
metricsRouter.get('/', sendMetrics);
