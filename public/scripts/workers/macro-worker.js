await import('./worker-globals.js');
const { createWorkerHost } = await import('./worker-host.js');

function replaceAll(content, replacements) {
    let result = String(content ?? '');
    for (const item of replacements) {
        if (!item || typeof item.pattern !== 'string') {
            continue;
        }

        const flags = typeof item.flags === 'string' ? item.flags : 'g';
        const value = item.value ?? '';

        let regex;
        try {
            regex = new RegExp(item.pattern, flags);
        } catch (error) {
            console.warn('[Worker][macro] 无法构建正则表达式', item.pattern, error);
            continue;
        }

        result = result.replace(regex, value);
    }
    return result;
}

createWorkerHost(async (payload) => {
    if (!payload || !Array.isArray(payload.replacements)) {
        return { content: String(payload?.content ?? '') };
    }

    const content = replaceAll(payload.content, payload.replacements);
    return { content };
});
