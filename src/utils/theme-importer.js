import path from 'node:path';

export function parseThemeBuffer(buffer, originalName = '') {
    const content = buffer.toString('utf8');
    const data = JSON.parse(content);

    if (typeof data !== 'object' || data === null) {
        throw new Error('Theme file does not contain a valid JSON object');
    }

    const baseName = path.basename(originalName || 'theme.json', path.extname(originalName || 'theme.json')) || 'Theme';
    const themeName = typeof data.name === 'string' && data.name.trim() ? data.name.trim() : baseName;
    data.name = themeName;

    return {
        format: 'json',
        metadata: {
            originalName,
        },
        theme: data,
    };
}
