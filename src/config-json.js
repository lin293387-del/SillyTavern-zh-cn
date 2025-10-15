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

const DEFAULT_VARIABLE_MONITORING = {
    enabled: false,
    logIntervalMs: 15000,
    topEventTypes: 5,
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

function normalizeVariableMonitoring(rawConfig = {}) {
    const normalized = { ...DEFAULT_VARIABLE_MONITORING };
    if (!rawConfig || typeof rawConfig !== 'object') {
        return normalized;
    }

    if (Object.prototype.hasOwnProperty.call(rawConfig, 'enabled')) {
        normalized.enabled = Boolean(rawConfig.enabled);
    }

    if (Object.prototype.hasOwnProperty.call(rawConfig, 'logIntervalMs')) {
        const interval = Number(rawConfig.logIntervalMs);
        if (!Number.isNaN(interval) && interval >= 1000) {
            normalized.logIntervalMs = interval;
        }
    }

    if (Object.prototype.hasOwnProperty.call(rawConfig, 'topEventTypes')) {
        const topCount = Math.max(1, Number(rawConfig.topEventTypes) || DEFAULT_VARIABLE_MONITORING.topEventTypes);
        normalized.topEventTypes = topCount;
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
            variableMonitoring: normalizeVariableMonitoring(parsed?.variableMonitoring || parsed?.variable_monitoring || {}),
        };
    } catch (error) {
        cachedConfig = {
            apiToggles: { ...DEFAULT_API_TOGGLES },
            apiToggleLogging: DEFAULT_API_LOGGING,
            extensionToastNotifications: DEFAULT_EXTENSION_TOASTS,
            debugLogging: { ...DEFAULT_DEBUG_LOGGING },
            variableMonitoring: { ...DEFAULT_VARIABLE_MONITORING },
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

export function getVariableMonitoringConfig() {
    return { ...loadConfigFile().variableMonitoring };
}
