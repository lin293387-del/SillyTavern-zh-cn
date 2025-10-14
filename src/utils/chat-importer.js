import path from 'node:path';

import { importOobaChat, importCAIChat, importKoboldLiteChat, importAgnaiChat, importRisuChat, flattenChubChat } from '../endpoints/chats.js';

export const SUPPORTED_CHAT_FORMATS = ['json', 'jsonl'];

export function detectChatFormat(originalName, content) {
    const ext = path.extname(originalName || '').toLowerCase();
    if (ext === '.jsonl') return 'jsonl';
    if (ext === '.json') return 'json';
    if (typeof content === 'string' && content.trim().startsWith('{')) {
        return 'json';
    }
    return 'unknown';
}

export function parseChatBuffer(buffer, originalName, { userName = 'User', characterName = 'Character' } = {}) {
    const content = buffer.toString('utf8');
    const format = detectChatFormat(originalName, content);
    const metadata = { fileType: format, originalName };

    if (format === 'jsonl') {
        const lines = content.split('\n').filter(line => line.trim() !== '');
        const header = tryParse(lines[0]);
        if (!(header?.user_name || header?.name)) {
            throw new Error('JSONL chat format is invalid');
        }
        const flattened = flattenChubChat(userName, characterName, lines);
        return { format, metadata, messages: flattened.split('\n').map(line => tryParse(line)).filter(Boolean) };
    }

    if (format === 'json') {
        const jsonData = JSON.parse(content);
        if (jsonData.savedsettings !== undefined) {
            const chat = importKoboldLiteChat(userName, characterName, jsonData);
            return wrapChatResult(chat, metadata);
        }
        if (jsonData.histories !== undefined) {
            const chat = importCAIChat(userName, characterName, jsonData);
            return wrapChatResult(chat, metadata);
        }
        if (Array.isArray(jsonData.data_visible)) {
            const chat = importOobaChat(userName, characterName, jsonData);
            return wrapChatResult(chat, metadata);
        }
        if (Array.isArray(jsonData.messages)) {
            const chat = importAgnaiChat(userName, characterName, jsonData);
            return wrapChatResult(chat, metadata);
        }
        if (jsonData.type === 'risuChat') {
            const chat = importRisuChat(userName, characterName, jsonData);
            return wrapChatResult(chat, metadata);
        }
        throw new Error('Unsupported JSON chat format');
    }

    throw new Error(`Unsupported chat format: ${format}`);
}

function wrapChatResult(chat, metadata) {
    if (Array.isArray(chat)) {
        return { format: metadata.fileType, metadata, messages: chat.flatMap((item) => (typeof item === 'string' ? tryParse(item) : item)).filter(Boolean) };
    }
    if (typeof chat === 'string') {
        const lines = chat.split('\n').filter(Boolean).map(line => tryParse(line)).filter(Boolean);
        return { format: metadata.fileType, metadata, messages: lines };
    }
    throw new Error('Parsed chat data is invalid');
}

function tryParse(text) {
    try {
        return JSON.parse(text);
    } catch (_) {
        return null;
    }
}
