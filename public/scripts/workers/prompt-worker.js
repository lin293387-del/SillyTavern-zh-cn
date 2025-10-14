/**
 * Prompt Worker：用于在后台线程拼装最终的请求提示，减少主线程的字符串操作压力。
 */

await import('./worker-globals.js');
const { createWorkerHost } = await import('./worker-host.js');

createWorkerHost(async (payload) => {
    if (!payload || payload.mode !== 'prompt') {
        return { prompt: payload?.prompt ?? '' };
    }

    const api = payload.api;
    const messages = Array.isArray(payload.messages) ? payload.messages : [];
    const systemPrompt = payload.systemPrompt || '';
    const prefill = payload.prefill || '';

    if (api === 'openai') {
        const result = [];
        if (systemPrompt) {
            result.push({ role: 'system', content: systemPrompt });
        }

        for (const message of messages) {
            result.push({
                role: message.role || 'system',
                content: message.content ?? '',
            });
        }

        if (prefill) {
            result.push({ role: 'assistant', content: prefill });
        }

        return { prompt: result };
    }

    const segments = [];
    if (systemPrompt) {
        segments.push(systemPrompt);
    }

    for (const message of messages) {
        const prefix = message.name ? `${message.name}: ` : '';
        segments.push(`${prefix}${message.content ?? ''}`);
    }

    let promptText = segments.join('\n');
    if (prefill) {
        promptText += `\n${prefill}`;
    }

    return { prompt: promptText };
});
