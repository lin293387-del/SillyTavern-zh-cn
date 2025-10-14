import path from 'node:path';

function isInstructData(data) {
    const props = ['name', 'input_sequence', 'output_sequence'];
    return data && props.every((prop) => Object.prototype.hasOwnProperty.call(data, prop));
}

function isContextData(data) {
    const props = ['name', 'story_string'];
    return data && props.every((prop) => Object.prototype.hasOwnProperty.call(data, prop));
}

function isSystemPromptData(data) {
    const props = ['name', 'content'];
    return data && props.every((prop) => Object.prototype.hasOwnProperty.call(data, prop));
}

function isTextCompletionData(data) {
    const props = ['temp', 'top_k', 'top_p', 'rep_pen'];
    return data && props.every((prop) => Object.prototype.hasOwnProperty.call(data, prop));
}

function isReasoningData(data) {
    const props = ['name', 'prefix', 'suffix', 'separator'];
    return data && props.every((prop) => Object.prototype.hasOwnProperty.call(data, prop));
}

const MASTER_SECTION_DEFINITIONS = {
    instruct: { name: 'Instruct Template', isValid: isInstructData },
    context: { name: 'Context Template', isValid: isContextData },
    sysprompt: { name: 'System Prompt', isValid: isSystemPromptData },
    preset: { name: 'Text Completion Preset', isValid: isTextCompletionData },
    reasoning: { name: 'Reasoning Formatting', isValid: isReasoningData },
};

export function parsePresetBuffer(buffer, originalName = '', options = {}) {
    const content = buffer.toString('utf8');
    const data = JSON.parse(content);
    const baseName = path.basename(originalName || 'preset.json', path.extname(originalName || 'preset.json'));

    // Legacy / single object detection
    if (isInstructData(data)) {
        return buildSinglePresetResult('instruct', data.name ?? baseName, data, { detected: 'instruct' });
    }
    if (isContextData(data)) {
        return buildSinglePresetResult('context', data.name ?? baseName, data, { detected: 'context' });
    }
    if (isSystemPromptData(data)) {
        return buildSinglePresetResult('sysprompt', data.name ?? baseName, data, { detected: 'systemPrompt' });
    }
    if (isTextCompletionData(data)) {
        return buildSinglePresetResult('preset', data.name ?? baseName, data, { detected: 'textCompletion' });
    }
    if (isReasoningData(data)) {
        return buildSinglePresetResult('reasoning', data.name ?? baseName, data, { detected: 'reasoning' });
    }

    // Master import detection
    const sections = Object.entries(MASTER_SECTION_DEFINITIONS)
        .filter(([key, section]) => section.isValid(data[key]))
        .map(([key, section]) => ({ key, name: section.name, data: data[key] }));

    if (sections.length > 0) {
        return {
            format: 'json',
            metadata: {
                originalName,
                detected: 'master',
                sections: sections.map((section) => ({ key: section.key, name: section.name, presetName: section.data?.name ?? '' })),
            },
            data,
        };
    }

    return buildSinglePresetResult('unknown', baseName, data, { detected: 'unknown' });
}

function buildSinglePresetResult(kind, name, data, metadata = {}) {
    return {
        format: 'json',
        metadata: {
            originalName: metadata.originalName,
            detected: metadata.detected ?? kind,
        },
        preset: data,
        name,
        kind,
    };
}
