// 描述聊天渲染阶段的基础配置，便于集中维护优先级与异步标记。

const DEFAULT_STAGE_PROPERTIES = {
    priority: 0,
    async: false,
    emitStatus: true,
};

const BUILTIN_STAGE_CONFIG = {
    'hydrate-large-templates': {
        priority: -20,
    },
    'style-import-anchors': {
        priority: -10,
    },
    'media-post-processing': {
        priority: 10,
        async: true,
    },
    'extensions-after-render': {
        priority: 20,
        async: true,
    },
};

export function getBuiltinStageConfig(name) {
    return BUILTIN_STAGE_CONFIG[name] ?? null;
}

export function normalizeStageOptions(name, options = {}) {
    const base = getBuiltinStageConfig(name) ?? {};
    return {
        name,
        priority: Number.isFinite(options.priority) ? Number(options.priority) : (Number.isFinite(base.priority) ? Number(base.priority) : DEFAULT_STAGE_PROPERTIES.priority),
        async: options.async ?? base.async ?? DEFAULT_STAGE_PROPERTIES.async,
        emitStatus: options.emitStatus ?? base.emitStatus ?? DEFAULT_STAGE_PROPERTIES.emitStatus,
    };
}

export function describeStages(stages = []) {
    return stages.map((stage) => ({
        name: stage.name,
        priority: Number(stage.priority) || 0,
        async: !!stage.async,
    }));
}
