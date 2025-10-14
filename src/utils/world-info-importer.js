import path from 'node:path';

const DEFAULT_DEPTH = 4;
const DEFAULT_WEIGHT = 100;

const extension_prompt_roles = {
    SYSTEM: 0,
    USER: 1,
    ASSISTANT: 2,
};

const world_info_logic = {
    AND_ANY: 0,
    AND_ALL: 1,
    NOT_ANY: 2,
    NOT_ALL: 3,
};

const world_info_position = {
    before: 0,
    after: 1,
    atDepth: 2,
};

const newWorldInfoEntryTemplate = {
    key: [],
    keysecondary: [],
    comment: '',
    content: '',
    constant: false,
    vectorized: false,
    selective: true,
    selectiveLogic: world_info_logic.AND_ANY,
    addMemo: false,
    order: 100,
    position: 0,
    disable: false,
    ignoreBudget: false,
    excludeRecursion: false,
    preventRecursion: false,
    matchPersonaDescription: false,
    matchCharacterDescription: false,
    matchCharacterPersonality: false,
    matchCharacterDepthPrompt: false,
    matchScenario: false,
    matchCreatorNotes: false,
    delayUntilRecursion: false,
    probability: 100,
    useProbability: true,
    depth: DEFAULT_DEPTH,
    group: '',
    groupOverride: false,
    groupWeight: DEFAULT_WEIGHT,
    scanDepth: null,
    caseSensitive: null,
    matchWholeWords: null,
    useGroupScoring: null,
    automationId: '',
    role: extension_prompt_roles.SYSTEM,
    sticky: null,
    cooldown: null,
    delay: null,
    triggers: [],
};

function structuredCloneTemplate() {
    return structuredClone ? structuredClone(newWorldInfoEntryTemplate) : JSON.parse(JSON.stringify(newWorldInfoEntryTemplate));
}

function convertNovelLorebook(inputObj) {
    const outputObj = { entries: {} };

    if (!Array.isArray(inputObj?.entries)) {
        throw new Error('Novel lorebook format missing entries');
    }

    inputObj.entries.forEach((entry, index) => {
        const template = structuredCloneTemplate();
        const displayName = entry.displayName;
        const addMemo = typeof displayName === 'string' && displayName.trim() !== '';

        outputObj.entries[index] = {
            ...template,
            uid: index,
            key: entry.keys ?? [],
            keysecondary: [],
            comment: displayName || '',
            content: entry.text ?? '',
            selective: false,
            order: entry.contextConfig?.budgetPriority ?? 0,
            disable: entry.enabled === false,
            addMemo,
        };
    });

    return outputObj;
}

function convertAgnaiMemoryBook(inputObj) {
    const outputObj = { entries: {} };

    if (!Array.isArray(inputObj?.entries)) {
        throw new Error('Agnai memory format missing entries');
    }

    inputObj.entries.forEach((entry, index) => {
        const template = structuredCloneTemplate();
        outputObj.entries[index] = {
            ...template,
            uid: index,
            key: entry.keywords ?? [],
            keysecondary: [],
            comment: entry.name ?? '',
            content: entry.entry ?? '',
            selective: false,
            order: Number(entry.weight ?? 0),
            disable: entry.enabled === false,
            addMemo: Boolean(entry.name),
        };
    });

    return outputObj;
}

function convertRisuLorebook(inputObj) {
    const data = Array.isArray(inputObj?.data) ? inputObj.data : [];
    const outputObj = { entries: {} };

    data.forEach((entry, index) => {
        const template = structuredCloneTemplate();
        outputObj.entries[index] = {
            ...template,
            uid: index,
            key: typeof entry.key === 'string' ? entry.key.split(',').map((x) => x.trim()).filter(Boolean) : [],
            keysecondary: typeof entry.secondkey === 'string' ? entry.secondkey.split(',').map((x) => x.trim()).filter(Boolean) : [],
            comment: entry.comment ?? '',
            content: entry.content ?? '',
            constant: Boolean(entry.alwaysActive),
            selective: Boolean(entry.selective),
            order: Number(entry.insertorder ?? 0),
            position: world_info_position.before,
            disable: false,
            addMemo: true,
            probability: Number(entry.activationPercent ?? 100),
            useProbability: entry.activationPercent !== undefined ? Boolean(entry.activationPercent) : true,
        };
    });

    return outputObj;
}

function normalizeEntries(jsonData) {
    if (!jsonData || typeof jsonData !== 'object') {
        throw new Error('World info data must be an object');
    }

    if (jsonData.entries && typeof jsonData.entries === 'object' && !Array.isArray(jsonData.entries)) {
        return jsonData;
    }

    if (Array.isArray(jsonData.entries)) {
        const normalized = { entries: {} };
        jsonData.entries.forEach((entry, index) => {
            normalized.entries[index] = { ...structuredCloneTemplate(), ...entry, uid: entry?.uid ?? index };
        });
        return normalized;
    }

    if (Array.isArray(jsonData)) {
        const normalized = { entries: {} };
        jsonData.forEach((entry, index) => {
            normalized.entries[index] = { ...structuredCloneTemplate(), ...entry, uid: entry?.uid ?? index };
        });
        return normalized;
    }

    throw new Error('World info file does not contain recognizable entries');
}

function convertWorldInfo(jsonData) {
    if (!jsonData || typeof jsonData !== 'object') {
        throw new Error('World info file must contain JSON object');
    }

    if (jsonData.lorebookVersion !== undefined) {
        return convertNovelLorebook(jsonData);
    }

    if (jsonData.kind === 'memory') {
        return convertAgnaiMemoryBook(jsonData);
    }

    if (jsonData.type === 'risu') {
        return convertRisuLorebook(jsonData);
    }

    return normalizeEntries(jsonData);
}

function extractDataFromPng(buffer, identifier = 'chara') {
    const data = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);

    if (!data || data.length < 8 || data[0] !== 0x89 || data[1] !== 0x50 || data[2] !== 0x4E || data[3] !== 0x47 || data[4] !== 0x0D || data[5] !== 0x0A || data[6] !== 0x1A || data[7] !== 0x0A) {
        return null;
    }

    const uint8 = new Uint8Array(4);
    const uint32 = new Uint32Array(uint8.buffer);

    let idx = 8;
    while (idx < data.length) {
        uint8[3] = data[idx++];
        uint8[2] = data[idx++];
        uint8[1] = data[idx++];
        uint8[0] = data[idx++];

        const length = uint32[0] + 4;
        const chunk = new Uint8Array(length);
        chunk[0] = data[idx++];
        chunk[1] = data[idx++];
        chunk[2] = data[idx++];
        chunk[3] = data[idx++];

        const name = String.fromCharCode(chunk[0], chunk[1], chunk[2], chunk[3]);

        for (let i = 4; i < length; i++) {
            chunk[i] = data[idx++];
        }

        // Skip CRC
        idx += 4;

        if (name === 'tEXt') {
            const text = new TextDecoder().decode(chunk.subarray(4));
            const parts = text.split('\0');
            if (parts[0] === identifier) {
                return parts[1];
            }
        }

        if (name === 'IEND') {
            break;
        }
    }

    return null;
}

export function parseWorldInfoBuffer(buffer, originalName) {
    const ext = path.extname(originalName || '').toLowerCase();
    let jsonString;

    if (ext === '.png') {
        jsonString = extractDataFromPng(buffer, 'naidata');
        if (!jsonString) {
            throw new Error('Embedded world info not found in PNG');
        }
    } else {
        jsonString = buffer.toString('utf8');
    }

    let jsonData;
    try {
        jsonData = JSON.parse(jsonString);
    } catch (error) {
        throw new Error('World info file is not valid JSON');
    }

    return convertWorldInfo(jsonData);
}
