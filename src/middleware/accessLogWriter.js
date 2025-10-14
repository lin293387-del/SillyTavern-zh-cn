import path from 'node:path';
import fs from 'node:fs';
import { getRealIpFromHeader } from '../express-common.js';
import { color, getConfigValue } from '../util.js';
import { createCache } from '../utils/cacheFactory.js';

const enableAccessLog = getConfigValue('logging.enableAccessLog', true, 'boolean');
const accessLogAugmenters = new Set();
const knownIpRetentionHours = Number(getConfigValue('logging.knownIpRetentionHours', 24, 'number')) || 0;
const knownIpRetentionMs = knownIpRetentionHours > 0 ? knownIpRetentionHours * 60 * 60 * 1000 : 0;
const knownIpCacheLimit = Math.max(0, Number(getConfigValue('logging.knownIpCacheLimit', 5000, 'number')) || 0);

const knownIPs = createCache('access-log:known-ips', {
    ttlMs: knownIpRetentionMs,
    maxEntries: knownIpCacheLimit,
    onEvict: (_value, key, reason) => {
        if (reason === 'manual') {
            return;
        }
        if (enableAccessLog) {
            console.debug(color.cyan(`Access log known IP cache evicted ${key} by ${reason}`));
        }
    },
});

function flushKnownIpEvictions() {
    const stats = knownIPs.consumeEvictionStats();
    if ((stats.ttl > 0 || stats.lru > 0) && enableAccessLog) {
        const ttlLog = stats.ttl > 0 ? `自动移除 ${stats.ttl} 个过期 IP` : '';
        const lruLog = stats.lru > 0 ? `按上限淘汰 ${stats.lru} 个最久未使用 IP` : '';
        const message = [ttlLog, lruLog].filter(Boolean).join('；');
        if (message) {
            console.debug(color.cyan(`Access log known IP cache: ${message}`));
        }
    } else if (stats.lru > 0) {
        console.warn(color.yellow(`Access log IP cache exceeded limit; evicted ${stats.lru} oldest entr${stats.lru === 1 ? 'y' : 'ies'}`));
    }
}

function trackKnownIP(ip, now = Date.now()) {
    knownIPs.set(ip, now);
    flushKnownIpEvictions();
}

function collectAugmentedLogParts(context) {
    const parts = [];
    for (const augmenter of accessLogAugmenters) {
        try {
            const result = augmenter(context);
            if (result === undefined || result === null) {
                continue;
            }
            if (Array.isArray(result)) {
                for (const item of result) {
                    if (item === undefined || item === null) {
                        continue;
                    }
                    parts.push(typeof item === 'object' ? JSON.stringify(item) : String(item));
                }
                continue;
            }
            if (typeof result === 'object') {
                parts.push(JSON.stringify(result));
            } else {
                parts.push(String(result));
            }
        } catch (error) {
            console.warn(color.yellow('Access log augmenter threw an error:'), error);
        }
    }
    return parts;
}

export const getAccessLogPath = () => path.join(globalThis.DATA_ROOT, 'access.log');

export function migrateAccessLog() {
    try {
        if (!fs.existsSync('access.log')) {
            return;
        }
        const logPath = getAccessLogPath();
        if (fs.existsSync(logPath)) {
            return;
        }
        fs.renameSync('access.log', logPath);
        console.log(color.yellow('Migrated access.log to new location:'), logPath);
    } catch (e) {
        console.error('Failed to migrate access log:', e);
        console.info('Please move access.log to the data directory manually.');
    }
}

/**
 * Creates middleware for logging access and new connections
 * @returns {import('express').RequestHandler}
 */
export default function accessLoggerMiddleware() {
    return function (req, res, next) {
        const clientIp = getRealIpFromHeader(req);
        const userAgent = req.headers['user-agent'];

        if (!knownIPs.has(clientIp)) {
            // Log new connection
            trackKnownIP(clientIp);
            const context = { req, res, clientIp, userAgent };
            const augmentParts = collectAugmentedLogParts(context);
            const augmentSuffix = augmentParts.length ? `; ${augmentParts.join('; ')}` : '';

            // Write to access log if enabled
            if (enableAccessLog) {
                console.info(color.yellow(`New connection from ${clientIp}; User Agent: ${userAgent}${augmentSuffix}\n`));
                const logPath = getAccessLogPath();
                const timestamp = new Date().toISOString();
                const log = `${timestamp} ${clientIp} ${userAgent}${augmentParts.length ? ` ${augmentParts.join(' ')}` : ''}\n`;

                fs.appendFile(logPath, log, (err) => {
                    if (err) {
                        console.error('Failed to write access log:', err);
                    }
                });
            }
        } else {
            // refresh timestamp为最新，用于 LRU 排序
            trackKnownIP(clientIp);
        }

        next();
    };
}

/**
 * 注册自定义 access log 字段处理器，返回清理函数。
 * @param {(context: {req: import('express').Request, res: import('express').Response, clientIp: string, userAgent?: string}) => unknown} augmenter
 * @returns {() => void}
 */
export function registerAccessLogAugmenter(augmenter) {
    if (typeof augmenter !== 'function') {
        throw new TypeError('registerAccessLogAugmenter 需要提供函数');
    }
    accessLogAugmenters.add(augmenter);
    return () => {
        accessLogAugmenters.delete(augmenter);
    };
}

/**
 * 返回当前已注册的 access log 扩展处理器数量。
 * @returns {number}
 */
export function getAccessLogAugmenterCount() {
    return accessLogAugmenters.size;
}
