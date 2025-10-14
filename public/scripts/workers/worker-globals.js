/**
 * Worker 全局补丁。
 * 在 Worker 环境中为常见浏览器别名提供兜底，避免依赖初始化时访问 window 报错。
 */

const scope = typeof globalThis !== 'undefined' ? globalThis : self;

if (typeof scope.window === 'undefined') {
    scope.window = scope;
}

if (typeof scope.self === 'undefined') {
    scope.self = scope;
}

if (typeof scope.global === 'undefined') {
    scope.global = scope;
}

export {};
