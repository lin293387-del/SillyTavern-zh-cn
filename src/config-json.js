import fs from 'node:fs';
import path from 'node:path';
import { serverDirectory } from './server-directory.js';

const CONFIG_FILE_NAME = 'config.json';

const DEFAULT_API_TOGGLES = {
    textCompletion: true,
    chatCompletion: true,
    novelAI: true,
    aiHorde: true,
    kobold: true,
};

const DEFAULT_API_LOGGING = false;
const DEFAULT_EXTENSION_TOASTS = true;
const DEFAULT_DEBUG_LOGGING = {
    worldInfo: false,
    events: false,
    metadata: false,
    tokenCache: false,
    presets: false,
    context: false,
    movingUI: false,
    extensions: false,
    window: false,
    renderQueue: false,
    generation: false,
};

let cachedConfig = null;

function normalizeApiToggles(rawToggles = {}) {
    const normalized = { ...DEFAULT_API_TOGGLES };
    for (const [key, value] of Object.entries(rawToggles)) {
        if (Object.prototype.hasOwnProperty.call(DEFAULT_API_TOGGLES, key)) {
            normalized[key] = Boolean(value);
        }
    }
    return normalized;
}

function normalizeOptionalBoolean(value, defaultValue) {
    if (value === undefined || value === null) {
        return defaultValue;
    }

    if (typeof value === 'string') {
        const lower = value.trim().toLowerCase();
        if (lower === 'true') return true;
        if (lower === 'false') return false;
    }

    return Boolean(value);
}

function normalizeDebugLogging(rawLogging = {}) {
    const normalized = { ...DEFAULT_DEBUG_LOGGING };
    if (!rawLogging || typeof rawLogging !== 'object') {
        return normalized;
    }

    for (const [key, value] of Object.entries(rawLogging)) {
        if (Object.prototype.hasOwnProperty.call(normalized, key)) {
            normalized[key] = Boolean(value);
        }
    }

    return normalized;
}

function loadConfigFile() {
    if (cachedConfig) {
        return cachedConfig;
    }

    const configPath = path.join(serverDirectory, CONFIG_FILE_NAME);
    try {
        const content = fs.readFileSync(configPath, 'utf-8');
        const parsed = JSON.parse(content);
        const toastValue = parsed?.extensionToastNotifications ?? parsed?.extension_toast_notifications;
        cachedConfig = {
            apiToggles: normalizeApiToggles(parsed?.apiToggles || parsed?.api_toggles || {}),
            apiToggleLogging: Boolean(parsed?.apiToggleLogging ?? parsed?.api_toggle_logging ?? DEFAULT_API_LOGGING),
            extensionToastNotifications: normalizeOptionalBoolean(toastValue, DEFAULT_EXTENSION_TOASTS),
            debugLogging: normalizeDebugLogging(parsed?.debugLogging || parsed?.debug_logging || {}),
        };
    } catch (error) {
        cachedConfig = {
            apiToggles: { ...DEFAULT_API_TOGGLES },
            apiToggleLogging: DEFAULT_API_LOGGING,
            extensionToastNotifications: DEFAULT_EXTENSION_TOASTS,
            debugLogging: { ...DEFAULT_DEBUG_LOGGING },
        };
    }

    return cachedConfig;
}

export function reloadJsonConfig() {
    cachedConfig = null;
    return loadConfigFile();
}

export function getApiToggle(name) {
    const toggles = loadConfigFile().apiToggles;
    return toggles[name] ?? DEFAULT_API_TOGGLES[name] ?? true;
}

export function getAllApiToggles() {
    return { ...loadConfigFile().apiToggles };
}

export function getApiToggleLogging() {
    return Boolean(loadConfigFile().apiToggleLogging);
}

export function getExtensionToastNotifications() {
    return Boolean(loadConfigFile().extensionToastNotifications);
}

export function getDebugLoggingConfig() {
    return { ...loadConfigFile().debugLogging };
}
