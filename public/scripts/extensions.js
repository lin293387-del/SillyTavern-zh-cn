import { DOMPurify, Popper } from '../lib.js';

import { eventSource, event_types, saveSettings, saveSettingsDebounced, getRequestHeaders, animation_duration, CLIENT_VERSION } from '../script.js';
import { showLoader } from './loader.js';
import { POPUP_RESULT, POPUP_TYPE, Popup, callGenericPopup } from './popup.js';
import { renderTemplate, renderTemplateAsync } from './templates.js';
import { delay, isSubsetOf, sanitizeSelector, setValueByPath, versionCompare } from './utils.js';
import { getContext } from './st-context.js';
import { isAdmin } from './user.js';
import { addLocaleData, getCurrentLocale, t } from './i18n.js';
import { debounce_timeout } from './constants.js';
import { accountStorage } from './util/AccountStorage.js';

export {
    getContext,
    getApiUrl,
};

/** @type {string[]} */
export let extensionNames = [];

/**
 * Extras API module placeholder. Keep it empty so `modules.includes()` checks fail without errors.
 * @type {string[]}
 */
export const modules = [];

/**
 * Holds the type of each extension.
 * Don't use this directly, use getExtensionType instead!
 * @type {Record<string, string>}
 */
export let extensionTypes = {};

/**
 * A set of active extensions.
 * @type {Set<string>}
 */
const activeExtensions = new Set();

/**
 * Errors that occurred while loading extensions.
 * @type {Set<string>}
 */
const extensionLoadErrors = new Set();

const getApiUrl = () => extension_settings.apiUrl;
const sortManifestsByOrder = (a, b) => parseInt(a.loading_order) - parseInt(b.loading_order) || String(a.display_name).localeCompare(String(b.display_name));
const sortManifestsByName = (a, b) => String(a.display_name).localeCompare(String(b.display_name)) || parseInt(a.loading_order) - parseInt(b.loading_order);

/**
 * Holds manifest data for each extension.
 * @type {Record<string, object>}
 */
let manifests = {};

let requiresReload = false;
let stateChanged = false;
let saveMetadataTimeout = null;

export function isExtensionReloadPending() {
    return requiresReload;
}

export function clearExtensionReloadFlag() {
    requiresReload = false;
}

export function cancelDebouncedMetadataSave() {
    if (saveMetadataTimeout) {
        console.debug('延迟的元数据保存已取消');
        clearTimeout(saveMetadataTimeout);
        saveMetadataTimeout = null;
    }
}

export function saveMetadataDebounced() {
    const context = getContext();
    const groupId = context.groupId;
    const characterId = context.characterId;

    cancelDebouncedMetadataSave();

    saveMetadataTimeout = setTimeout(async () => {
        const newContext = getContext();

        if (groupId !== newContext.groupId) {
            console.warn('会话分组已变化，取消保存元数据');
            return;
        }

        if (characterId !== newContext.characterId) {
            console.warn('角色已变化，取消保存元数据');
            return;
        }

        console.debug('正在保存元数据...');
        await newContext.saveMetadata();
        console.debug('元数据已保存...');
    }, debounce_timeout.relaxed);
}

/**
 * Provides an ability for extensions to render HTML templates synchronously.
 * Templates sanitation and localization is forced.
 * @param {string} extensionName Extension name
 * @param {string} templateId Template ID
 * @param {object} templateData Additional data to pass to the template
 * @returns {string} Rendered HTML
 *
 * @deprecated Use renderExtensionTemplateAsync instead.
 */
export function renderExtensionTemplate(extensionName, templateId, templateData = {}, sanitize = true, localize = true) {
    return renderTemplate(`scripts/extensions/${extensionName}/${templateId}.html`, templateData, sanitize, localize, true);
}

/**
 * Provides an ability for extensions to render HTML templates asynchronously.
 * Templates sanitation and localization is forced.
 * @param {string} extensionName Extension name
 * @param {string} templateId Template ID
 * @param {object} templateData Additional data to pass to the template
 * @returns {Promise<string>} Rendered HTML
 */
export function renderExtensionTemplateAsync(extensionName, templateId, templateData = {}, sanitize = true, localize = true) {
    return renderTemplateAsync(`scripts/extensions/${extensionName}/${templateId}.html`, templateData, sanitize, localize, true);
}

export async function doExtrasFetch(endpoint, args = {}) {
    const finalArgs = args ? { ...args } : {};
    finalArgs.method = finalArgs.method ?? 'GET';
    const headers = { ...(finalArgs.headers ?? {}) };

    if (extension_settings.apiKey && !headers.Authorization) {
        headers.Authorization = `Bearer ${extension_settings.apiKey}`;
    }

    finalArgs.headers = headers;
    return fetch(endpoint, finalArgs);
}

// Disables parallel updates
export class ModuleWorkerWrapper {
    constructor(callback) {
        this.isBusy = false;
        this.callback = callback;
    }

    // Called by the extension
    async update(...args) {
        // Don't touch me I'm busy...
        if (this.isBusy) {
            return;
        }

        // I'm free. Let's update!
        try {
            this.isBusy = true;
            await this.callback(...args);
        }
        finally {
            this.isBusy = false;
        }
    }
}

export const extension_settings = {
    apiUrl: '',
    apiKey: '',
    autoConnect: false,
    notifyUpdates: false,
    disabledExtensions: [],
    expressionOverrides: [],
    memory: {},
    note: {
        default: '',
        chara: [],
        wiAddition: [],
    },
    caption: {
        refine_mode: false,
    },
    expressions: {
        /** @type {number} see `EXPRESSION_API` */
        api: undefined,
        /** @type {string[]} */
        custom: [],
        showDefault: false,
        translate: false,
        /** @type {string} */
        fallback_expression: undefined,
        /** @type {string} */
        llmPrompt: undefined,
        allowMultiple: true,
        rerollIfSame: false,
        promptType: 'raw',
    },
    connectionManager: {
        selectedProfile: '',
        /** @type {import('./extensions/connection-manager/index.js').ConnectionProfile[]} */
        profiles: [],
    },
    dice: {},
    /** @type {import('./char-data.js').RegexScriptData[]} */
    regex: [],
    /** @type {import('./extensions/regex/index.js').RegexPreset[]} */
    regex_presets: [],
    character_allowed_regex: [],
    tts: {},
    sd: {
        prompts: {},
        character_prompts: {},
        character_negative_prompts: {},
    },
    chromadb: {},
    translate: {},
    objective: {},
    quickReply: {},
    randomizer: {
        controls: [],
        fluctuation: 0.1,
        enabled: false,
    },
    speech_recognition: {},
    rvc: {},
    hypebot: {},
    vectors: {},
    variables: {
        global: {},
        scripts: {},
    },
    /**
     * @type {import('./chats.js').FileAttachment[]}
     */
    attachments: [],
    /**
     * @type {Record<string, import('./chats.js').FileAttachment[]>}
     */
    character_attachments: {},
    /**
     * @type {string[]}
     */
    disabled_attachments: [],
    gallery: {
        /** @type {{[characterKey: string]: string}} */
        folders: {},
        /** @type {string} */
        sort: 'dateAsc',
    },
};

function showHideExtensionsMenu() {
    // Get the number of menu items that are not hidden
    const hasMenuItems = $('#extensionsMenu').children().filter((_, child) => $(child).css('display') !== 'none').length > 0;

    // We have menu items, so we can stop checking
    if (hasMenuItems) {
        clearInterval(menuInterval);
    }

    // Show or hide the menu button
    $('#extensionsMenuButton').toggle(hasMenuItems);
}

// Periodically check for new extensions
const menuInterval = setInterval(showHideExtensionsMenu, 1000);

/**
 * Gets the type of an extension based on its external ID.
 * @param {string} externalId External ID of the extension (excluding or including the leading 'third-party/')
 * @returns {string} Type of the extension (global, local, system, or empty string if not found)
 */
function getExtensionType(externalId) {
    const id = Object.keys(extensionTypes).find(id => id === externalId || (id.startsWith('third-party') && id.endsWith(externalId)));
    return id ? extensionTypes[id] : '';
}

/**
 * Discovers extensions from the API.
 * @returns {Promise<{name: string, type: string}[]>}
 */
export async function discoverExtensions() {
    try {
        const response = await fetch('/api/extensions/discover');

        if (response.ok) {
            const extensions = await response.json();
            return extensions;
        }
        else {
            return [];
        }
    }
    catch (err) {
        console.error(err);
        return [];
    }
}

function onDisableExtensionClick() {
    const name = $(this).data('name');
    disableExtension(name, false);
}

function onEnableExtensionClick() {
    const name = $(this).data('name');
    enableExtension(name, false);
}

/**
 * Enables an extension by name.
 * @param {string} name Extension name
 * @param {boolean} [reload=true] If true, reload the page after enabling the extension
 */
export async function enableExtension(name, reload = true) {
    extension_settings.disabledExtensions = extension_settings.disabledExtensions.filter(x => x !== name);
    stateChanged = true;
    await saveSettings();
    if (reload) {
        location.reload();
    } else {
        requiresReload = true;
    }
}

/**
 * Disables an extension by name.
 * @param {string} name Extension name
 * @param {boolean} [reload=true] If true, reload the page after disabling the extension
 */
export async function disableExtension(name, reload = true) {
    extension_settings.disabledExtensions.push(name);
    stateChanged = true;
    await saveSettings();
    if (reload) {
        location.reload();
    } else {
        requiresReload = true;
    }
}

/**
 * Loads manifest.json files for extensions.
 * @param {string[]} names Array of extension names
 * @returns {Promise<Record<string, object>>} Object with extension names as keys and their manifests as values
 */
async function getManifests(names) {
    const obj = {};
    const promises = [];

    for (const name of names) {
        const promise = new Promise((resolve, reject) => {
            fetch(`/scripts/extensions/${name}/manifest.json`).then(async response => {
                if (response.ok) {
                    const json = await response.json();
                    obj[name] = json;
                    resolve();
                } else {
                    reject();
                }
            }).catch(err => {
                reject();
                console.log('无法加载 manifest.json ' + name, err);
            });
        });

        promises.push(promise);
    }

    await Promise.allSettled(promises);
    return obj;
}

/**
 * Tries to activate all available extensions that are not already active.
 * @returns {Promise<void>}
 */
async function activateExtensions() {
    extensionLoadErrors.clear();
    const clientVersion = CLIENT_VERSION.split(':')[1];
    const extensions = Object.entries(manifests).sort((a, b) => sortManifestsByOrder(a[1], b[1]));
    const extensionNames = extensions.map(x => x[0]);
    const promises = [];

    for (let entry of extensions) {
        const name = entry[0];
        const manifest = entry[1];
        const extensionDependencies = manifest.dependencies;
        const minClientVersion = manifest.minimum_client_version;
        const displayName = manifest.display_name || name;

        if (activeExtensions.has(name)) {
            continue;
        }
        // Client version requirement: pass if 'minimum_client_version' is undefined or null.
        let meetsClientMinimumVersion = true;
        if (minClientVersion !== undefined) {
            meetsClientMinimumVersion = versionCompare(clientVersion, minClientVersion);
        }

        // Extension dependencies: pass if 'dependencies' is undefined or not an array; check subset and disabled status if it's an array
        let meetsExtensionDeps = true;
        let missingDependencies = [];
        let disabledDependencies = [];
        if (extensionDependencies !== undefined) {
            if (Array.isArray(extensionDependencies)) {
                // Check if all dependencies exist
                meetsExtensionDeps = isSubsetOf(extensionNames, extensionDependencies);
                missingDependencies = extensionDependencies.filter(dep => !extensionNames.includes(dep));
                // Check for disabled dependencies
                if (meetsExtensionDeps) {
                    disabledDependencies = extensionDependencies.filter(dep => extension_settings.disabledExtensions.includes(dep));
                    if (disabledDependencies.length > 0) {
                        // Fail if any dependencies are disabled
                        meetsExtensionDeps = false;
                    }
                }
            } else {
                console.warn(`扩展 ${name}：manifest.json 的 'dependencies' 字段不是数组。仍允许加载，但无法验证依赖是否存在。`);
            }
        }

        const isDisabled = extension_settings.disabledExtensions.includes(name);

        if (meetsExtensionDeps && meetsClientMinimumVersion && !isDisabled) {
            try {
                console.debug('正在激活扩展', name);
                const promise = addExtensionLocale(name, manifest).finally(() =>
                    Promise.all([addExtensionScript(name, manifest), addExtensionStyle(name, manifest)]),
                );
                await promise
                    .then(() => activeExtensions.add(name))
                    .catch(err => {
                        console.log('无法激活扩展', name, err);
                        extensionLoadErrors.add(t`扩展 "${displayName}" 加载失败：${err}`);
                    });
                promises.push(promise);
            } catch (error) {
                console.error('无法激活扩展', name, error);
            }
        } else if (!meetsExtensionDeps && !isDisabled) {
            if (disabledDependencies.length > 0) {
                console.warn(t`扩展 "${name}" 未加载。所需扩展已存在但被禁用："${disabledDependencies.join(', ')}"。请先启用，再重新加载。`);
                extensionLoadErrors.add(t`扩展 "${displayName}" 未加载。所需扩展已存在但被禁用："${disabledDependencies.join(', ')}"。请先启用，再重新加载。`);
            } else {
                console.warn(t`扩展 "${name}" 未加载。缺少所需扩展："${missingDependencies.join(', ')}"`);
                extensionLoadErrors.add(t`扩展 "${displayName}" 未加载。缺少所需扩展："${missingDependencies.join(', ')}"`);
            }
        } else if (!meetsClientMinimumVersion && !isDisabled) {
            console.warn(t`扩展 "${name}" 未加载。需要 ST 客户端版本 ${minClientVersion}，但当前版本为 ${clientVersion}。`);
            extensionLoadErrors.add(t`扩展 "${displayName}" 未加载。需要 ST 客户端版本 ${minClientVersion}，但当前版本为 ${clientVersion}。`);
        }
    }

    await Promise.allSettled(promises);
    $('#extensions_details').toggleClass('warning', extensionLoadErrors.size > 0);
}

async function addExtensionsButtonAndMenu() {
    const buttonHTML = await renderTemplateAsync('wandButton');
    const extensionsMenuHTML = await renderTemplateAsync('wandMenu');

    $(document.body).append(extensionsMenuHTML);
    $('#leftSendForm').append(buttonHTML);

    const button = $('#extensionsMenuButton');
    const dropdown = $('#extensionsMenu');
    let isDropdownVisible = false;

    let popper = Popper.createPopper(button.get(0), dropdown.get(0), {
        placement: 'top-start',
    });

    $(button).on('click', function () {
        if (isDropdownVisible) {
            dropdown.fadeOut(animation_duration);
            isDropdownVisible = false;
        } else {
            dropdown.fadeIn(animation_duration);
            isDropdownVisible = true;
        }
        popper.update();
    });

    $('html').on('click', function (e) {
        if (!isDropdownVisible) return;
        const clickTarget = $(e.target);
        const noCloseTargets = ['#sd_gen', '#extensionsMenuButton', '#roll_dice'];
        if (!noCloseTargets.some(id => clickTarget.closest(id).length > 0)) {
            dropdown.fadeOut(animation_duration);
            isDropdownVisible = false;
        }
    });
}

function notifyUpdatesInputHandler() {
    extension_settings.notifyUpdates = !!$('#extensions_notify_updates').prop('checked');
    saveSettingsDebounced();

    if (extension_settings.notifyUpdates) {
        checkForExtensionUpdates(true);
    }
}

/**
 * Adds a CSS file for an extension.
 * @param {string} name Extension name
 * @param {object} manifest Extension manifest
 * @returns {Promise<void>} When the CSS is loaded
 */
function addExtensionStyle(name, manifest) {
    if (!manifest.css) {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        const url = `/scripts/extensions/${name}/${manifest.css}`;
        const id = sanitizeSelector(`${name}-css`);

        if ($(`link[id="${id}"]`).length === 0) {
            const link = document.createElement('link');
            link.id = id;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = url;
            link.onload = function () {
                resolve();
            };
            link.onerror = function (e) {
                reject(e);
            };
            document.head.appendChild(link);
        }
    });
}

/**
 * Loads a JS file for an extension.
 * @param {string} name Extension name
 * @param {object} manifest Extension manifest
 * @returns {Promise<void>} When the script is loaded
 */
function addExtensionScript(name, manifest) {
    if (!manifest.js) {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        const url = `/scripts/extensions/${name}/${manifest.js}`;
        const id = sanitizeSelector(`${name}-js`);
        let ready = false;

        if ($(`script[id="${id}"]`).length === 0) {
            const script = document.createElement('script');
            script.id = id;
            script.type = 'module';
            script.src = url;
            script.async = true;
            script.onerror = function (err) {
                reject(err);
            };
            script.onload = function () {
                if (!ready) {
                    ready = true;
                    resolve();
                }
            };
            document.body.appendChild(script);
        }
    });
}

/**
 * Adds a localization data for an extension.
 * @param {string} name Extension name
 * @param {object} manifest Manifest object
 */
function addExtensionLocale(name, manifest) {
    // No i18n data in the manifest
    if (!manifest.i18n || typeof manifest.i18n !== 'object') {
        return Promise.resolve();
    }

    const currentLocale = getCurrentLocale();
    const localeFile = manifest.i18n[currentLocale];

    // Manifest doesn't provide a locale file for the current locale
    if (!localeFile) {
        return Promise.resolve();
    }

    return fetch(`/scripts/extensions/${name}/${localeFile}`)
        .then(async response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (data && typeof data === 'object') {
                addLocaleData(currentLocale, data);
            }
        })
        .catch(err => {
            console.log('无法为扩展 ' + name + ' 加载本地化数据', err);
        });
}

/**
 * Generates HTML string for displaying an extension in the UI.
 *
 * @param {string} name - The name of the extension.
 * @param {object} manifest - The manifest of the extension.
 * @param {boolean} isActive - Whether the extension is active or not.
 * @param {boolean} isDisabled - Whether the extension is disabled or not.
 * @param {boolean} isExternal - Whether the extension is external or not.
 * @param {string} checkboxClass - The class for the checkbox HTML element.
 * @return {string} - The HTML string that represents the extension.
 */
function generateExtensionHtml(name, manifest, isActive, isDisabled, isExternal, checkboxClass) {
    function getExtensionIcon() {
        const type = getExtensionType(name);
        switch (type) {
            case 'global':
                return '<i class="fa-sm fa-fw fa-solid fa-server" data-i18n="[title]ext_type_global" title="This is a global extension, available for all users."></i>';
            case 'local':
                return '<i class="fa-sm fa-fw fa-solid fa-user" data-i18n="[title]ext_type_local" title="This is a local extension, available only for you."></i>';
            case 'system':
                return '<i class="fa-sm fa-fw fa-solid fa-cog" data-i18n="[title]ext_type_system" title="This is a built-in extension. It cannot be deleted and updates with the app."></i>';
            default:
                return '<i class="fa-sm fa-fw fa-solid fa-question" title="Unknown extension type."></i>';
        }
    }

    const isUserAdmin = isAdmin();
    const extensionIcon = getExtensionIcon();
    const displayName = manifest.display_name;
    const displayVersion = manifest.version || '';
    const externalId = name.replace('third-party', '');
    let originHtml = '';
    if (isExternal) {
        originHtml = '<a>';
    }

    let toggleElement = isActive || isDisabled ?
        '<input type="checkbox" title="' + t`点击切换` + `" data-name="${name}" class="${isActive ? 'toggle_disable' : 'toggle_enable'} ${checkboxClass}" ${isActive ? 'checked' : ''}>` :
        `<input type="checkbox" title="Cannot enable extension" data-name="${name}" class="extension_missing ${checkboxClass}" disabled>`;

    let deleteButton = isExternal ? `<button class="btn_delete menu_button" data-name="${externalId}" data-i18n="[title]Delete" title="Delete"><i class="fa-fw fa-solid fa-trash-can"></i></button>` : '';
    let updateButton = isExternal ? `<button class="btn_update menu_button displayNone" data-name="${externalId}" title="Update available"><i class="fa-solid fa-download fa-fw"></i></button>` : '';
    let moveButton = isExternal && isUserAdmin ? `<button class="btn_move menu_button" data-name="${externalId}" data-i18n="[title]Move" title="Move"><i class="fa-solid fa-folder-tree fa-fw"></i></button>` : '';
    let branchButton = isExternal && isUserAdmin ? `<button class="btn_branch menu_button" data-name="${externalId}" data-i18n="[title]Switch branch" title="Switch branch"><i class="fa-solid fa-code-branch fa-fw"></i></button>` : '';

    // if external, wrap the name in a link to the repo

    let extensionHtml = `
        <div class="extension_block" data-name="${externalId}">
            <div class="extension_toggle">
                ${toggleElement}
            </div>
            <div class="extension_icon">
                ${extensionIcon}
            </div>
            <div class="flexGrow extension_text_block">
                ${originHtml}
                <span class="${isActive ? 'extension_enabled' : isDisabled ? 'extension_disabled' : 'extension_missing'}">
                    <span class="extension_name">${DOMPurify.sanitize(displayName)}</span>
                    <span class="extension_version">${DOMPurify.sanitize(displayVersion)}</span>
                </span>
                ${isExternal ? '</a>' : ''}
            </div>

            <div class="extension_actions flex-container alignItemsCenter">
                ${updateButton}
                ${branchButton}
                ${moveButton}
                ${deleteButton}
            </div>
        </div>`;

    return extensionHtml;
}

/**
 * Gets extension data and generates the corresponding HTML for displaying the extension.
 *
 * @param {Array} extension - An array where the first element is the extension name and the second element is the extension manifest.
 * @return {object} - An object with 'isExternal' indicating whether the extension is external, and 'extensionHtml' for the extension's HTML string.
 */
function getExtensionData(extension) {
    const name = extension[0];
    const manifest = extension[1];
    const isActive = activeExtensions.has(name);
    const isDisabled = extension_settings.disabledExtensions.includes(name);
    const isExternal = name.startsWith('third-party');

    const checkboxClass = isDisabled ? 'checkbox_disabled' : '';

    const extensionHtml = generateExtensionHtml(name, manifest, isActive, isDisabled, isExternal, checkboxClass);

    return { isExternal, extensionHtml };
}


/**
 * Generates HTML for the extension load errors.
 * @returns {string} HTML string containing the errors that occurred while loading extensions.
 */
function getExtensionLoadErrorsHtml() {
    if (extensionLoadErrors.size === 0) {
        return '';
    }

    const container = document.createElement('div');
    container.classList.add('info-block', 'error');

    for (const error of extensionLoadErrors) {
        const errorElement = document.createElement('div');
        errorElement.textContent = error;
        container.appendChild(errorElement);
    }

    return container.outerHTML;
}

export function getExtensionLoadErrors() {
    return Array.from(extensionLoadErrors);
}

export function getInstalledExtensionsSnapshot(options = {}) {
    const { includeManifest = false } = options;
    const snapshot = [];
    const cloneManifest = (manifest) => {
        if (!includeManifest) {
            return undefined;
        }
        if (typeof structuredClone === 'function') {
            try {
                return structuredClone(manifest);
            } catch (error) {
                console.warn('structuredClone 失败，回退到 JSON 克隆 manifest', error);
            }
        }
        try {
            return JSON.parse(JSON.stringify(manifest));
        } catch {
            return null;
        }
    };

    for (const [id, manifest] of Object.entries(manifests)) {
        const isExternal = id.startsWith('third-party');
        const externalId = isExternal ? id.replace(/^third-party\/?/, '') : id;
        const type = getExtensionType(id);
        const displayName = manifest?.display_name ?? manifest?.name ?? externalId ?? id;
        const version = manifest?.version ?? null;
        const author = manifest?.author ?? null;
        const description = manifest?.description ?? '';
        const autoUpdate = Boolean(manifest?.auto_update);
        const requires = Array.isArray(manifest?.requires) ? [...manifest.requires] : [];
        const repository = manifest?.repository ?? manifest?.remote ?? manifest?.repo ?? null;
        const homepage = manifest?.homepage ?? manifest?.homepage_url ?? manifest?.homepageURL ?? null;

        snapshot.push({
            id,
            externalId,
            type,
            isExternal,
            isActive: activeExtensions.has(id),
            isDisabled: extension_settings.disabledExtensions.includes(id),
            displayName,
            version,
            author,
            description,
            autoUpdate,
            requires,
            repository,
            homepage,
            manifest: cloneManifest(manifest),
        });
    }

    return snapshot;
}

/**
 * Generates the HTML strings for all extensions and displays them in a popup.
 */
async function showExtensionsDetails() {
    const abortController = new AbortController();
    let popupPromise;
    try {
        // If we are updating an extension, the "old" popup is still active. We should close that.
        let initialScrollTop = 0;
        const oldPopup = Popup.util.popups.find(popup => popup.content.querySelector('.extensions_info'));
        if (oldPopup) {
            initialScrollTop = oldPopup.content.scrollTop;
            await oldPopup.completeCancelled();
        }
        const htmlErrors = getExtensionLoadErrorsHtml();
        const htmlDefault = $('<div class="marginBot10"><h3 class="textAlignCenter">' + t`内置扩展：` + '</h3></div>');
        const htmlExternal = $('<div class="marginBot10"><h3 class="textAlignCenter">' + t`用户扩展：` + '</h3></div>');
        const htmlLoading = $(`<div class="flex-container alignItemsCenter justifyCenter marginTop10 marginBot5">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <span>` + t`正在加载第三方扩展，请稍候...` + `</span>
        </div>`);

        htmlExternal.append(htmlLoading);

        const sortOrderKey = 'extensions_sortByName';
        const sortByName = accountStorage.getItem(sortOrderKey) === 'true';
        const sortFn = sortByName ? sortManifestsByName : sortManifestsByOrder;
        const extensions = Object.entries(manifests).sort((a, b) => sortFn(a[1], b[1])).map(getExtensionData);

        extensions.forEach(value => {
            const { isExternal, extensionHtml } = value;
            const container = isExternal ? htmlExternal : htmlDefault;
            container.append(extensionHtml);
        });

        const html = $('<div></div>')
            .addClass('extensions_info')
            .append(htmlErrors)
            .append(htmlDefault)
            .append(htmlExternal);

        html.on('click', '.extension_block .toggle_disable', onDisableExtensionClick);
        html.on('click', '.extension_block .toggle_enable', onEnableExtensionClick);
        html.on('click', '.extension_block .btn_update', onUpdateClick);
        html.on('click', '.extension_block .btn_delete', onDeleteClick);
        html.on('click', '.extension_block .btn_move', onMoveClick);
        html.on('click', '.extension_block .btn_branch', onBranchClick);

        {
            const updateAction = async (force) => {
                requiresReload = true;
                await autoUpdateExtensions(force);
                await popup.complete(POPUP_RESULT.AFFIRMATIVE);
            };

            const toolbar = document.createElement('div');
            toolbar.classList.add('extensions_toolbar');

            const updateAllButton = document.createElement('button');
            updateAllButton.classList.add('menu_button', 'menu_button_icon');
            updateAllButton.textContent = t`全部更新`;
            updateAllButton.addEventListener('click', () => updateAction(true));

            const updateEnabledOnlyButton = document.createElement('button');
            updateEnabledOnlyButton.classList.add('menu_button', 'menu_button_icon');
            updateEnabledOnlyButton.textContent = t`启用更新（弃用）`;
            updateEnabledOnlyButton.addEventListener('click', () => updateAction(false));

            const flexExpander = document.createElement('div');
            flexExpander.classList.add('expander');

            const sortOrderButton = document.createElement('button');
            sortOrderButton.classList.add('menu_button', 'menu_button_icon');
            sortOrderButton.textContent = sortByName ? t`已按名称排序` : t`已按加载顺序排序`;
            sortOrderButton.addEventListener('click', async () => {
                abortController.abort();
                accountStorage.setItem(sortOrderKey, sortByName ? 'false' : 'true');
                await showExtensionsDetails();
            });

            toolbar.append(updateAllButton, updateEnabledOnlyButton, flexExpander, sortOrderButton);
            html.prepend(toolbar);
        }

        let waitingForSave = false;

        const popup = new Popup(html, POPUP_TYPE.TEXT, '', {
            okButton: t`关闭`,
            wide: true,
            large: true,
            customButtons: [],
            allowVerticalScrolling: true,
            onClosing: async () => {
                if (waitingForSave) {
                    return false;
                }
                if (stateChanged) {
                    waitingForSave = true;
                    const toast = toastr.info(t`页面即将刷新...`, t`扩展状态已变更`);
                    await saveSettings();
                    toastr.clear(toast);
                    waitingForSave = false;
                    requiresReload = true;
                }
                return true;
            },
        });
        popupPromise = popup.show();
        popup.content.scrollTop = initialScrollTop;
        checkForUpdatesManual(sortFn, abortController.signal).finally(() => htmlLoading.remove());
    } catch (error) {
        toastr.error(t`加载扩展时出错。详细信息请查看浏览器控制台。`);
        console.error(error);
    }
    if (popupPromise) {
        await popupPromise;
        abortController.abort();
    }
    if (requiresReload) {
        showLoader();
        location.reload();
    }
}

/**
 * Handles the click event for the update button of an extension.
 * This function makes a POST request to '/api/extensions/update' with the extension's name.
 * If the extension is already up to date, it displays a success message.
 * If the extension is not up to date, it updates the extension and displays a success message with the new commit hash.
 */
async function onUpdateClick() {
    const isCurrentUserAdmin = isAdmin();
    const extensionName = $(this).data('name');
    const isGlobal = getExtensionType(extensionName) === 'global';
    if (isGlobal && !isCurrentUserAdmin) {
        toastr.error(t`你没有权限更新全局扩展。`);
        return;
    }

    const icon = $(this).find('i');
    icon.addClass('fa-spin');
    await updateExtension(extensionName, false);
    // updateExtension eats the error, but we can at least stop the spinner
    icon.removeClass('fa-spin');
}

/**
 * Updates a third-party extension via the API.
 * @param {string} extensionName Extension folder name
 * @param {boolean} quiet If true, don't show a success message
 * @param {number?} timeout Timeout in milliseconds to wait for the update to complete. If null, no timeout is set.
 */
export async function updateExtension(extensionName, quietOrOptions = false, timeout = null) {
    let quiet = false;
    let notify = true;
    let refreshDetails = true;
    let timeoutMs = timeout;

    if (typeof quietOrOptions === 'object' && quietOrOptions !== null) {
        quiet = Boolean(quietOrOptions.quiet);
        notify = quietOrOptions.notify !== false;
        refreshDetails = quietOrOptions.refreshDetails !== false;
        timeoutMs = quietOrOptions.timeout ?? timeoutMs;
    } else {
        quiet = Boolean(quietOrOptions);
        notify = !quiet;
    }

    try {
        const signal = timeoutMs ? AbortSignal.timeout(timeoutMs) : undefined;
        const response = await fetch('/api/extensions/update', {
            method: 'POST',
            signal: signal,
            headers: getRequestHeaders(),
            body: JSON.stringify({
                extensionName,
                global: getExtensionType(extensionName) === 'global',
            }),
        });

        if (!response.ok) {
            const text = await response.text();
            const rawMessage = text || response.statusText || '';
            const displayMessage = rawMessage === 'Internal Server Error. Check the server logs for more details'
                ? t`内部服务器错误。请查看服务器日志了解详情`
                : rawMessage || t`扩展更新失败`;
            if (notify) {
                toastr.error(displayMessage, t`扩展更新失败`, { timeOut: 5000, escapeHtml: false });
            }
            console.error('扩展更新失败', response.status, response.statusText, text);
            return { ok: false, status: response.status, message: rawMessage };
        }

        const data = await response.json();

        if (!quiet && refreshDetails) {
            void showExtensionsDetails();
        }

        if (data.isUpToDate) {
            if (!quiet && notify) {
                toastr.success('扩展已是最新版本');
            }
        } else if (!quiet && notify) {
            toastr.success(t`扩展 ${extensionName} 已更新至 ${data.shortCommitHash}`, t`刷新页面以应用更新`);
        }
        return { ok: true, data };
    } catch (error) {
        console.error('扩展更新出错：', error);
        if (notify) {
            const rawMessage = error?.message || '';
            const displayMessage = rawMessage === 'Internal Server Error. Check the server logs for more details'
                ? t`内部服务器错误。请查看服务器日志了解详情`
                : rawMessage || t`扩展更新失败`;
            toastr.error(displayMessage, t`扩展更新失败`, { timeOut: 5000, escapeHtml: false });
        }
        return { ok: false, error };
    }
}

/**
 * Handles the click event for the delete button of an extension.
 * This function makes a POST request to '/api/extensions/delete' with the extension's name.
 * If the extension is deleted, it displays a success message.
 * Creates a popup for the user to confirm before delete.
 */
async function onDeleteClick() {
    const extensionName = $(this).data('name');
    const isCurrentUserAdmin = isAdmin();
    const isGlobal = getExtensionType(extensionName) === 'global';
    if (isGlobal && !isCurrentUserAdmin) {
        toastr.error(t`你没有权限删除全局扩展。`);
        return;
    }

    // use callPopup to create a popup for the user to confirm before delete
    const confirmation = await callGenericPopup(t`确定要删除 ${extensionName} 吗？`, POPUP_TYPE.CONFIRM, '', {});
    if (confirmation === POPUP_RESULT.AFFIRMATIVE) {
        await deleteExtension(extensionName);
    }
}

async function onBranchClick() {
    const extensionName = $(this).data('name');
    const isCurrentUserAdmin = isAdmin();
    const isGlobal = getExtensionType(extensionName) === 'global';
    if (isGlobal && !isCurrentUserAdmin) {
        toastr.error(t`你没有权限切换分支。`);
        return;
    }

    let newBranch = '';

    const branches = await getExtensionBranches(extensionName, isGlobal);
    const selectElement = document.createElement('select');
    selectElement.classList.add('text_pole', 'wide100p');
    selectElement.addEventListener('change', function () {
        newBranch = this.value;
    });
    for (const branch of branches) {
        const option = document.createElement('option');
        option.value = branch.name;
        option.textContent = `${branch.name} (${branch.commit}) [${branch.label}]`;
        option.selected = branch.current;
        selectElement.appendChild(option);
    }

    const popup = new Popup(selectElement, POPUP_TYPE.CONFIRM, '', {
        okButton: t`切换`,
        cancelButton: t`取消`,
    });
    const popupResult = await popup.show();

    if (!popupResult || !newBranch) {
        return;
    }

    await switchExtensionBranch(extensionName, isGlobal, newBranch);
}

async function onMoveClick() {
    const extensionName = $(this).data('name');
    const isCurrentUserAdmin = isAdmin();
    const isGlobal = getExtensionType(extensionName) === 'global';
    if (isGlobal && !isCurrentUserAdmin) {
        toastr.error(t`你没有权限移动扩展。`);
        return;
    }

    const source = getExtensionType(extensionName);
    const destination = source === 'global' ? 'local' : 'global';

    const confirmationHeader = t`移动扩展`;
    const confirmationText = source == 'global'
        ? t`确定要将 ${extensionName} 移到你的本地扩展吗？这会让它仅对你可用。`
        : t`确定要将 ${extensionName} 移到全局扩展吗？这会让它对所有用户可用。`;

    const confirmation = await Popup.show.confirm(confirmationHeader, confirmationText);

    if (!confirmation) {
        return;
    }

    $(this).find('i').addClass('fa-spin');
    await moveExtension(extensionName, source, destination);
}

/**
 * Moves an extension via the API.
 * @param {string} extensionName Extension name
 * @param {string} source Source type
 * @param {string} destination Destination type
 * @returns {Promise<void>}
 */
export async function moveExtension(extensionName, source, destination, options = {}) {
    const { notify = true, refreshDetails = true } = options;
    try {
        const result = await fetch('/api/extensions/move', {
            method: 'POST',
            headers: getRequestHeaders(),
            body: JSON.stringify({
                extensionName,
                source,
                destination,
            }),
        });

        if (!result.ok) {
            const text = await result.text();
            if (notify) {
                toastr.error(text || result.statusText, t`扩展移动失败`, { timeOut: 5000 });
            }
            console.error('扩展移动失败', result.status, result.statusText, text);
            return { ok: false, status: result.status, message: text || result.statusText };
        }

        if (notify) {
            toastr.success(t`扩展 ${extensionName} 已移动。`);
        }
        await loadExtensionSettings({}, false, false);
        if (refreshDetails) {
            void showExtensionsDetails();
        }
        return { ok: true };
    } catch (error) {
        console.error('错误：', error);
        if (notify) {
            toastr.error(error?.message || t`扩展移动失败`);
        }
        return { ok: false, error };
    }
}

/**
 * Deletes an extension via the API.
 * @param {string} extensionName Extension name to delete
 */
export async function deleteExtension(extensionName, options = {}) {
    const { notify = true, reload = true } = options;
    try {
        const response = await fetch('/api/extensions/delete', {
            method: 'POST',
            headers: getRequestHeaders(),
            body: JSON.stringify({
                extensionName,
                global: getExtensionType(extensionName) === 'global',
            }),
        });
        if (!response.ok) {
            const text = await response.text();
            if (notify) {
                toastr.error(text || response.statusText, t`扩展删除失败`);
            }
            console.error('扩展删除失败', response.status, response.statusText, text);
            return { ok: false, status: response.status, message: text || response.statusText };
        }
    } catch (error) {
        console.error('错误：', error);
        if (notify) {
            toastr.error(error?.message || t`扩展删除失败`);
        }
        return { ok: false, error };
    }

    if (notify) {
        toastr.success(t`扩展 ${extensionName} 已删除`);
    }
    if (reload) {
        delay(1000).then(() => location.reload());
    }
    return { ok: true };
}

/**
 * Fetches the version details of a specific extension.
 *
 * @param {string} extensionName - The name of the extension.
 * @param {AbortSignal} [abortSignal] - The signal to abort the operation.
 * @return {Promise<object>} - An object containing the extension's version details.
 * This object includes the currentBranchName, currentCommitHash, isUpToDate, and remoteUrl.
 * @throws {error} - If there is an error during the fetch operation, it logs the error to the console.
 */
export async function getExtensionVersion(extensionName, abortSignal) {
    try {
        const response = await fetch('/api/extensions/version', {
            method: 'POST',
            headers: getRequestHeaders(),
            body: JSON.stringify({
                extensionName,
                global: getExtensionType(extensionName) === 'global',
            }),
            signal: abortSignal,
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('错误：', error);
    }
}

/**
 * Gets the list of branches for a specific extension.
 * @param {string} extensionName The name of the extension
 * @param {boolean} isGlobal Whether the extension is global or not
 * @returns {Promise<ExtensionBranch[]>} List of branches for the extension
 * @typedef {object} ExtensionBranch
 * @property {string} name The name of the branch
 * @property {string} commit The commit hash of the branch
 * @property {boolean} current Whether this branch is the current one
 * @property {string} label The commit label of the branch
 */
export async function getExtensionBranches(extensionName, isGlobal, options = {}) {
    const { notify = true } = options;
    try {
        const response = await fetch('/api/extensions/branches', {
            method: 'POST',
            headers: getRequestHeaders(),
            body: JSON.stringify({
                extensionName,
                global: isGlobal,
            }),
        });

        if (!response.ok) {
            const text = await response.text();
            if (notify) {
                toastr.error(text || response.statusText, t`获取扩展分支失败`);
            }
            console.error('获取扩展分支失败', response.status, response.statusText, text);
            return [];
        }

        return await response.json();
    } catch (error) {
        console.error('错误：', error);
        if (notify) {
            toastr.error(error?.message || t`获取扩展分支失败`);
        }
        return [];
    }
}

/**
 * Switches the branch of an extension.
 * @param {string} extensionName The name of the extension
 * @param {boolean} isGlobal If the extension is global
 * @param {string} branch Branch name to switch to
 * @returns {Promise<void>}
 */
export async function switchExtensionBranch(extensionName, isGlobal, branch, options = {}) {
    const { notify = true, refreshDetails = true } = options;
    try {
        const response = await fetch('/api/extensions/switch', {
            method: 'POST',
            headers: getRequestHeaders(),
            body: JSON.stringify({
                extensionName,
                branch,
                global: isGlobal,
            }),
        });

        if (!response.ok) {
            const text = await response.text();
            if (notify) {
                toastr.error(text || response.statusText, t`切换扩展分支失败`);
            }
            console.error('切换扩展分支失败', response.status, response.statusText, text);
            return { ok: false, status: response.status, message: text || response.statusText };
        }

        if (notify) {
            toastr.success(t`扩展 ${extensionName} 已切换到 ${branch}`);
        }
        await loadExtensionSettings({}, false, false);
        if (refreshDetails) {
            void showExtensionsDetails();
        }
        return { ok: true };
    } catch (error) {
        console.error('错误：', error);
        if (notify) {
            toastr.error(error?.message || t`切换扩展分支失败`);
        }
        return { ok: false, error };
    }
}

/**
 * Installs a third-party extension via the API.
 * @param {string} url Extension repository URL
 * @param {boolean} global Is the extension global?
 * @returns {Promise<void>}
 */
export async function installExtension(url, global, branch = '', options = {}) {
    console.debug('开始安装扩展', url);

    const { notify = true } = options;

    if (notify) {
        toastr.info(t`请稍候...`, t`正在安装扩展`);
    }

    const request = await fetch('/api/extensions/install', {
        method: 'POST',
        headers: getRequestHeaders(),
        body: JSON.stringify({
            url,
            global,
            branch,
        }),
    });

    if (!request.ok) {
        const text = await request.text();
        if (notify) {
            toastr.warning(text || request.statusText, t`扩展安装失败`, { timeOut: 5000 });
        }
        console.error('扩展安装失败', request.status, request.statusText, text);
        return { ok: false, status: request.status, message: text || request.statusText };
    }

    const response = await request.json();
    if (notify) {
        toastr.success(t`扩展 '${response.display_name}'（作者：${response.author}，版本 ${response.version}）安装成功！`, t`扩展安装成功`);
    }
    console.debug(`扩展 "${response.display_name}" 已成功安装在 ${response.extensionPath}`);
    await loadExtensionSettings({}, false, false);
    await eventSource.emit(event_types.EXTENSION_SETTINGS_LOADED, response);
    return { ok: true, data: response };
}

/**
 * Loads extension settings from the app settings.
 * @param {object} settings App Settings
 * @param {boolean} versionChanged Is this a version change?
 * @param {boolean} enableAutoUpdate Enable auto-update
 */
export async function loadExtensionSettings(settings, versionChanged, enableAutoUpdate) {
    if (settings.extension_settings) {
        Object.assign(extension_settings, settings.extension_settings);
    }

    $('#extensions_notify_updates').prop('checked', extension_settings.notifyUpdates);

    // Activate offline extensions
    await eventSource.emit(event_types.EXTENSIONS_FIRST_LOAD);
    const extensions = await discoverExtensions();
    extensionNames = extensions.map(x => x.name);
    extensionTypes = Object.fromEntries(extensions.map(x => [x.name, x.type]));
    manifests = await getManifests(extensionNames);

    if (versionChanged && enableAutoUpdate) {
        await autoUpdateExtensions(false);
    }

    await activateExtensions();
}

export function doDailyExtensionUpdatesCheck() {
    setTimeout(() => {
        if (extension_settings.notifyUpdates) {
            checkForExtensionUpdates(false);
        }
    }, 1);
}

const concurrencyLimit = 5;
let activeRequestsCount = 0;
const versionCheckQueue = [];

function enqueueVersionCheck(fn) {
    return new Promise((resolve, reject) => {
        versionCheckQueue.push(() => fn().then(resolve).catch(reject));
        processVersionCheckQueue();
    });
}

function processVersionCheckQueue() {
    if (activeRequestsCount >= concurrencyLimit || versionCheckQueue.length === 0) {
        return;
    }
    activeRequestsCount++;
    const fn = versionCheckQueue.shift();
    fn().finally(() => {
        activeRequestsCount--;
        processVersionCheckQueue();
    });
}

/**
 * Performs a manual check for updates on all 3rd-party extensions.
 * @param {function} sortFn Sort function
 * @param {AbortSignal} abortSignal Signal to abort the operation
 * @returns {Promise<any[]>}
 */
async function checkForUpdatesManual(sortFn, abortSignal) {
    const promises = [];
    for (const id of Object.keys(manifests).filter(x => x.startsWith('third-party')).sort((a, b) => sortFn(manifests[a], manifests[b]))) {
        const externalId = id.replace('third-party', '');
        const promise = enqueueVersionCheck(async () => {
            try {
                const data = await getExtensionVersion(externalId, abortSignal);
                const extensionBlock = document.querySelector(`.extension_block[data-name="${externalId}"]`);
                if (extensionBlock && data) {
                    if (data.isUpToDate === false) {
                        const buttonElement = extensionBlock.querySelector('.btn_update');
                        if (buttonElement) {
                            buttonElement.classList.remove('displayNone');
                        }
                        const nameElement = extensionBlock.querySelector('.extension_name');
                        if (nameElement) {
                            nameElement.classList.add('update_available');
                        }
                    }
                    let branch = data.currentBranchName;
                    let commitHash = data.currentCommitHash;
                    let origin = data.remoteUrl;

                    const originLink = extensionBlock.querySelector('a');
                    if (originLink) {
                        try {
                            const url = new URL(origin);
                            if (!['https:', 'http:'].includes(url.protocol)) {
                                throw new Error('Invalid protocol');
                            }
                            originLink.href = url.href;
                            originLink.target = '_blank';
                            originLink.rel = 'noopener noreferrer';
                        } catch (error) {
                            console.log('设置源链接时出错', originLink, error);
                        }
                    }

                    const versionElement = extensionBlock.querySelector('.extension_version');
                    if (versionElement) {
                        versionElement.textContent += ` (${branch}-${commitHash.substring(0, 7)})`;
                    }
                }
            } catch (error) {
                console.error('检查扩展更新时出错', error);
            }
        });
        promises.push(promise);
    }
    return Promise.allSettled(promises);
}

/**
 * Checks if there are updates available for enabled 3rd-party extensions.
 * @param {boolean} force Skip nag check
 * @returns {Promise<any>}
 */
export async function checkForExtensionUpdates(force, options = {}) {
    const { notify = true } = options;
    if (!force) {
        const STORAGE_NAG_KEY = 'extension_update_nag';
        const currentDate = new Date().toDateString();

        // Don't nag more than once a day
        if (accountStorage.getItem(STORAGE_NAG_KEY) === currentDate) {
            return { ok: true, updates: [] };
        }

        accountStorage.setItem(STORAGE_NAG_KEY, currentDate);
    }

    const isCurrentUserAdmin = isAdmin();
    const updatesAvailable = [];
    const promises = [];

    for (const [id, manifest] of Object.entries(manifests)) {
        const isDisabled = extension_settings.disabledExtensions.includes(id);
        if (isDisabled) {
            console.debug(`跳过扩展: ${manifest.display_name} (${id}) 因为是非管理员用户`);
            continue;
        }
        const isGlobal = getExtensionType(id) === 'global';
        if (isGlobal && !isCurrentUserAdmin) {
            console.debug(`跳过全局扩展: ${manifest.display_name} (${id}) 因为是非管理员用户`);
            continue;
        }

        if (manifest.auto_update && id.startsWith('third-party')) {
            const promise = enqueueVersionCheck(async () => {
                try {
                    const data = await getExtensionVersion(id.replace('third-party', ''));
                    if (!data.isUpToDate) {
                        updatesAvailable.push(manifest.display_name);
                    }
                } catch (error) {
                    console.error('检查扩展更新时出错', error);
                }
            });
            promises.push(promise);
        }
    }

    await Promise.allSettled(promises);

    if (updatesAvailable.length > 0 && notify) {
        toastr.info(`${updatesAvailable.map(x => `• ${x}`).join('\n')}`, t`扩展更新可用`);
    }
    return { ok: true, updates: updatesAvailable };
}

/**
 * Updates all enabled 3rd-party extensions that have auto-update enabled.
 * @param {boolean} forceAll Include disabled and not auto-updating
 * @returns {Promise<void>}
 */
export async function autoUpdateExtensions(forceAll, options = {}) {
    const { notify = true } = options;
    if (!Object.values(manifests).some(x => x.auto_update)) {
        return { ok: true, skipped: true };
    }

    const banner = notify ? toastr.info(t`自动更新扩展，这可能需要几分钟。`, t`请等待...`, { timeOut: 10000, extendedTimeOut: 10000 }) : null;
    const isCurrentUserAdmin = isAdmin();
    const promises = [];
    const autoUpdateTimeout = 60 * 1000;
    for (const [id, manifest] of Object.entries(manifests)) {
        const isDisabled = extension_settings.disabledExtensions.includes(id);
        if (!forceAll && isDisabled) {
            console.debug(`跳过扩展：${manifest.display_name}（${id}），因为是非管理员用户`);
            continue;
        }
        const isGlobal = getExtensionType(id) === 'global';
        if (isGlobal && !isCurrentUserAdmin) {
            console.debug(`跳过全局扩展: ${manifest.display_name} (${id}) 因为是非管理员用户`);
            continue;
        }
        if ((forceAll || manifest.auto_update) && id.startsWith('third-party')) {
            console.debug(`自动更新的第三方扩展：${manifest.display_name}（${id}）`);
            promises.push(updateExtension(id.replace('third-party', ''), { quiet: true, notify, timeout: autoUpdateTimeout, refreshDetails: false }));
        }
    }
    await Promise.allSettled(promises);
    if (banner) {
        toastr.clear(banner);
    }
    return { ok: true };
}

/**
 * Runs the generate interceptors for all extensions.
 * @param {any[]} chat Chat array
 * @param {number} contextSize Context size
 * @param {string} type Generation type
 * @returns {Promise<boolean>} True if generation should be aborted
 */
export async function runGenerationInterceptors(chat, contextSize, type) {
    let aborted = false;
    let exitImmediately = false;

    const abort = (/** @type {boolean} */ immediately) => {
        aborted = true;
        exitImmediately = immediately;
    };

    for (const manifest of Object.values(manifests).filter(x => x.generate_interceptor).sort((a, b) => sortManifestsByOrder(a, b))) {
        const interceptorKey = manifest.generate_interceptor;
        if (typeof globalThis[interceptorKey] === 'function') {
            try {
                await globalThis[interceptorKey](chat, contextSize, abort, type);
            } catch (e) {
                console.error(`运行拦截器失败，针对 ${manifest.display_name}`, e);
            }
        }

        if (exitImmediately) {
            break;
        }
    }

    return aborted;
}

/**
 * Writes a field to the character's data extensions object.
 * @param {number|string} characterId Index in the character array
 * @param {string} key Field name
 * @param {any} value Field value
 * @returns {Promise<void>} When the field is written
 */
export async function writeExtensionField(characterId, key, value) {
    const context = getContext();
    const character = context.characters[characterId];
    if (!character) {
        console.warn('未找到角色', characterId);
        return;
    }
    const path = `data.extensions.${key}`;
    setValueByPath(character, path, value);

    // Process JSON data
    if (character.json_data) {
        const jsonData = JSON.parse(character.json_data);
        setValueByPath(jsonData, path, value);
        character.json_data = JSON.stringify(jsonData);

        // Make sure the data doesn't get lost when saving the current character
        if (Number(characterId) === Number(context.characterId)) {
            $('#character_json_data').val(character.json_data);
        }
    }

    // Save data to the server
    const saveDataRequest = {
        avatar: character.avatar,
        data: {
            extensions: {
                [key]: value,
            },
        },
    };
    const mergeResponse = await fetch('/api/characters/merge-attributes', {
        method: 'POST',
        headers: getRequestHeaders(),
        body: JSON.stringify(saveDataRequest),
    });

    if (!mergeResponse.ok) {
        console.error('保存扩展字段失败', mergeResponse.statusText);
    }
}

/**
 * Prompts the user to enter the Git URL of the extension to import.
 * After obtaining the Git URL, makes a POST request to '/api/extensions/install' to import the extension.
 * If the extension is imported successfully, a success message is displayed.
 * If the extension import fails, an error message is displayed and the error is logged to the console.
 * After successfully importing the extension, the extension settings are reloaded and a 'EXTENSION_SETTINGS_LOADED' event is emitted.
 * @param {string} [suggestUrl] Suggested URL to install
 * @returns {Promise<void>}
 */
export async function openThirdPartyExtensionMenu(suggestUrl = '') {
    const isCurrentUserAdmin = isAdmin();
    const html = await renderTemplateAsync('installExtension', { isCurrentUserAdmin });
    const okButton = isCurrentUserAdmin ? t`为当前用户安装` : t`安装`;

    let global = false;
    const installForAllButton = {
        text: t`为所有用户安装（常用）`,
        appendAtEnd: false,
        action: async () => {
            global = true;
            await popup.complete(POPUP_RESULT.AFFIRMATIVE);
        },
    };
    /** @type {import('./popup.js').CustomPopupInput} */
    const branchNameInput = {
        id: 'extension_branch_name',
        label: t`为安装的扩展加一个标签（可选）`,
        type: 'text',
        tooltip: 'e.g. main, dev, v1.0.0',
    };

    const customButtons = isCurrentUserAdmin ? [installForAllButton] : [];
    const customInputs = [branchNameInput];
    const popup = new Popup(html, POPUP_TYPE.INPUT, suggestUrl ?? '', { okButton, customButtons, customInputs });
    const input = await popup.show();

    if (!input) {
        console.debug('扩展安装已取消');
        return;
    }

    const url = String(input).trim();
    const branchName = String(popup.inputResults.get('extension_branch_name') ?? '').trim();
    await installExtension(url, global, branchName);
}

export async function initExtensions() {
    await addExtensionsButtonAndMenu();
    $('#extensionsMenuButton').css('display', 'flex');

    $('#extensions_details').on('click', showExtensionsDetails);
    $('#extensions_notify_updates').on('input', notifyUpdatesInputHandler);

    /**
     * Handles the click event for the third-party extension import button.
     *
     * @listens #third_party_extension_button#click - The click event of the '#third_party_extension_button' element.
     */
    $('#third_party_extension_button').on('click', () => openThirdPartyExtensionMenu());

    ensureExtensionDebugPanelInitialized();
}

const EXTENSION_DEBUG_MAX_ITEMS = 120;
const EXTENSION_DEBUG_IMPORT_ENDPOINT = '/api/import/tasks/';
const EXTENSION_DEBUG_CONSOLE_LABELS = ['[SillyTavern.extensions]', '[SillyTavernLegacy]'];

/** @type {Intl.DateTimeFormat|undefined} */
let extensionDebugTimeFormatter;

const extensionDebugState = {
    initialized: false,
    enabled: false,
    floating: false,
    paused: false,
    autoScroll: true,
    activeTab: 'events',
    sequence: 0,
    consoleHooked: false,
    consoleOriginals: {},
    eventListeners: new Map(),
    domListeners: [],
    variableUnsubscribe: null,
    overlay: null,
    anchor: null,
    entries: {
        events: [],
        variables: [],
        logs: [],
    },
    pending: {
        events: [],
        variables: [],
        logs: [],
    },
    importTasks: new Map(),
    pendingImportUpdates: new Set(),
    elements: {
        panel: null,
        lists: {},
        importTableBody: null,
        counter: null,
        pauseState: null,
    },
};

function ensureExtensionDebugPanelInitialized() {
    if (extensionDebugState.initialized) {
        return;
    }

    const $panel = $('#extension_debug_panel');
    if ($panel.length === 0) {
        return;
    }

    extensionDebugState.initialized = true;
    extensionDebugState.elements.panel = $panel;
    extensionDebugState.elements.lists = {
        events: $('#extension_debug_events'),
        variables: $('#extension_debug_variables'),
        logs: $('#extension_debug_logs'),
    };

    const panelElement = $panel.get(0);
    if (!extensionDebugState.anchor && panelElement?.parentNode) {
        const anchor = document.createComment('extension-debug-anchor');
        panelElement.parentNode.insertBefore(anchor, panelElement);
        extensionDebugState.anchor = anchor;
    }

    extensionDebugState.elements.importTableBody = $('#extension_debug_imports');
    extensionDebugState.elements.counter = $('#extension_debug_counter');
    extensionDebugState.elements.pauseState = $('#extension_debug_pause_state');
    extensionDebugState.overlay = document.getElementById('extension_debug_overlay');

    if (!extensionDebugState.overlay) {
        const overlay = document.createElement('div');
        overlay.id = 'extension_debug_overlay';
        overlay.className = 'extension-debug-overlay';
        overlay.addEventListener('click', () => setDebugFloating(false));
        document.body.appendChild(overlay);
        extensionDebugState.overlay = overlay;
    }

    const $pauseToggle = $('#extension_debug_pause');
    const $autoScrollToggle = $('#extension_debug_autoscroll');

    extensionDebugState.paused = Boolean($pauseToggle.prop('checked'));
    extensionDebugState.autoScroll = Boolean($autoScrollToggle.prop('checked'));

    $pauseToggle.on('input', (event) => {
        setDebugPaused(Boolean(event.target.checked));
    });

    $autoScrollToggle.on('input', (event) => {
        extensionDebugState.autoScroll = Boolean(event.target.checked);
    });

    $('#extension_debug_clear').on('click', clearDebugData);
    $('#extension_debug_import_refresh').on('click', refreshImportStatuses);
    bindDebugIcon($('#extension_debug_popout'), () => setDebugFloating(true));
    bindDebugIcon($('#extension_debug_popout_close'), () => setDebugFloating(false));

    $panel.find('.extension-debug-tab').on('click', function () {
        const tab = String($(this).data('tab') ?? '');
        setDebugActiveTab(tab);
    });

    ['events', 'variables', 'logs'].forEach((category) => ensureDebugListPlaceholder(category));

    setDebugActiveTab(extensionDebugState.activeTab);
    updateDebugSummary();
}

function resolveDebugDomTarget(eventName) {
    if (eventName === 'virtualization-toggle') {
        return window;
    }
    return document;
}

function bindDebugIcon($element, callback) {
    if (!$element?.length) {
        return;
    }

    const activate = () => {
        if (!extensionDebugState.enabled) {
            return;
        }
        callback();
    };

    $element.on('click', (event) => {
        event.preventDefault();
        activate();
    });

    $element.on('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            activate();
        }
    });
}

function attachDebugListeners() {
    if (extensionDebugState.eventListeners.size > 0 || extensionDebugState.domListeners.length > 0 || extensionDebugState.variableUnsubscribe) {
        return;
    }

    const extensionNamespace = globalThis.SillyTavern?.extensions;
    const eventHandlers = new Map();

    for (const eventName of Object.values(event_types)) {
        if (eventHandlers.has(eventName)) {
            continue;
        }
        const handler = (...args) => {
            if (!extensionDebugState.enabled) {
                return;
            }
            recordEventEntry(eventName, args);
            if (eventName === event_types.IMPORT_TASK_SUBMITTED || eventName === event_types.IMPORT_TASK_PROGRESS || eventName === event_types.IMPORT_TASK_COMPLETED || eventName === event_types.IMPORT_TASK_FAILED) {
                handleImportEvent(eventName, args);
            }
        };
        eventSource.on(eventName, handler);
        eventHandlers.set(eventName, handler);
    }
    extensionDebugState.eventListeners = eventHandlers;

    const domListeners = [];
    const domEvents = extensionNamespace?.events?.domEvents ?? {};
    Object.values(domEvents).forEach((eventName) => {
        const target = resolveDebugDomTarget(eventName);
        const handler = (event) => {
            if (!extensionDebugState.enabled) {
                return;
            }
            recordEventEntry(eventName, [event?.detail ?? null]);
        };
        target.addEventListener(eventName, handler);
        domListeners.push({ target, eventName, handler });
    });
    extensionDebugState.domListeners = domListeners;

    try {
        const unsubscribe = extensionNamespace?.variables?.subscribe?.((event) => {
            if (!extensionDebugState.enabled) {
                return;
            }
            recordVariableEntry(event);
        });
        if (typeof unsubscribe === 'function') {
            extensionDebugState.variableUnsubscribe = unsubscribe;
        }
    } catch (error) {
        console.error('[扩展调试] 订阅变量事件失败', error);
    }
}

function detachDebugListeners() {
    if (extensionDebugState.eventListeners.size > 0) {
        for (const [eventName, handler] of extensionDebugState.eventListeners.entries()) {
            eventSource.removeListener(eventName, handler);
        }
        extensionDebugState.eventListeners.clear();
    }

    if (extensionDebugState.domListeners.length > 0) {
        for (const { target, eventName, handler } of extensionDebugState.domListeners) {
            target.removeEventListener(eventName, handler);
        }
        extensionDebugState.domListeners = [];
    }

    if (typeof extensionDebugState.variableUnsubscribe === 'function') {
        try {
            extensionDebugState.variableUnsubscribe();
        } catch (error) {
            console.warn('[扩展调试] 取消订阅变量事件失败', error);
        }
        extensionDebugState.variableUnsubscribe = null;
    }
}

function hookExtensionConsole() {
    if (extensionDebugState.consoleHooked) {
        return;
    }

    const targetMethods = ['log', 'info', 'warn', 'error'];
    extensionDebugState.consoleOriginals = {};

    for (const method of targetMethods) {
        const original = console[method];
        if (typeof original !== 'function') {
            continue;
        }
        const boundOriginal = original.bind(console);
        extensionDebugState.consoleOriginals[method] = boundOriginal;
        console[method] = (...args) => {
            try {
                if (shouldCaptureConsoleEntry(args)) {
                    recordConsoleEntry(method, args);
                }
            } catch (error) {
                boundOriginal('[扩展调试] 捕获控制台日志失败', error);
            }
            return boundOriginal(...args);
        };
    }

    extensionDebugState.consoleHooked = true;
}

function unhookExtensionConsole() {
    if (!extensionDebugState.consoleHooked) {
        return;
    }

    for (const [method, original] of Object.entries(extensionDebugState.consoleOriginals)) {
        if (typeof original === 'function') {
            console[method] = original;
        }
    }

    extensionDebugState.consoleOriginals = {};
    extensionDebugState.consoleHooked = false;
}

function recordEventEntry(eventName, args) {
    if (!extensionDebugState.enabled) {
        return;
    }
    const subtitle = `${t`参数`}: ${args?.length ?? 0}`;
    const payload = formatPayloadList(args);
    const entry = createDebugEntry('evt', eventName, subtitle, payload);
    pushDebugEntry('events', entry);
}

function recordVariableEntry(event) {
    if (!event || !extensionDebugState.enabled) {
        return;
    }
    const subtitleParts = [];
    if (event.scope) {
        subtitleParts.push(`${event.scope}.${event.key ?? ''}`);
    } else if (event.key) {
        subtitleParts.push(event.key);
    }
    if (event.type) {
        subtitleParts.push(event.type);
    }
    if (Number.isFinite(event.messageId)) {
        subtitleParts.push(`msg#${event.messageId}`);
    }
    if (Number.isFinite(event.swipeId)) {
        subtitleParts.push(`swipe#${event.swipeId}`);
    }
    const payload = safeStringify({
        value: event.value,
        previous: event.previous,
        persisted: event.persisted,
    });
    const entry = createDebugEntry('var', t`变量`, subtitleParts.join(' • '), payload, event.timestamp ?? Date.now());
    pushDebugEntry('variables', entry);
}

function handleImportEvent(eventName, args) {
    if (!extensionDebugState.enabled) {
        return;
    }
    const detail = extractImportDetail(args);
    if (!detail) {
        return;
    }

    const status = deriveImportStatus(eventName, detail.status);
    const taskPayload = {
        ...detail,
        status,
        lastEvent: eventName,
        updatedAt: Date.now(),
    };

    updateImportTaskFromPayload(taskPayload);

    if (extensionDebugState.paused) {
        extensionDebugState.pendingImportUpdates.add(taskPayload.taskId ?? taskPayload.id);
    } else if (extensionDebugState.activeTab === 'imports') {
        renderImportTable(true);
    }
}

function shouldCaptureConsoleEntry(args) {
    if (!args || args.length === 0) {
        return false;
    }
    return args.some((arg) => {
        if (typeof arg !== 'string') {
            return false;
        }
        return EXTENSION_DEBUG_CONSOLE_LABELS.some((label) => arg.includes(label));
    });
}

function recordConsoleEntry(level, args) {
    if (!extensionDebugState.enabled) {
        return;
    }
    const legacyProperty = extractLegacyProperty(args);
    const subtitle = legacyProperty || formatConsoleSubtitle(args);
    const payload = formatPayloadList(args);
    const entry = createDebugEntry('log', legacyProperty ? 'SillyTavernLegacy' : `console.${level}`, subtitle, payload);
    pushDebugEntry('logs', entry);
}

function formatConsoleSubtitle(args) {
    if (!args || args.length === 0) {
        return '';
    }
    const firstString = args.find((arg) => typeof arg === 'string');
    return firstString ?? '';
}

function extractLegacyProperty(args) {
    if (!args) {
        return '';
    }
    for (const arg of args) {
        if (typeof arg !== 'string') {
            continue;
        }
        const match = arg.match(/\[SillyTavernLegacy\]\s+([A-Za-z0-9_.-]+)/);
        if (match && match[1]) {
            return match[1];
        }
    }
    return '';
}

function setDebugFloating(enabled) {
    if (!extensionDebugState.initialized) {
        return;
    }

    const $panel = extensionDebugState.elements.panel;
    if (!$panel?.length) {
        return;
    }
    const panelElement = $panel.get(0);
    const anchor = extensionDebugState.anchor;

    if (!enabled || !extensionDebugState.enabled) {
        extensionDebugState.floating = false;
        $panel.removeClass('floating');
        if (anchor?.parentNode && panelElement && panelElement.parentNode !== anchor.parentNode) {
            anchor.parentNode.insertBefore(panelElement, anchor.nextSibling);
        }
        extensionDebugState.overlay?.classList.remove('visible');
        return;
    }

    extensionDebugState.floating = true;
    if (panelElement && panelElement.parentNode !== document.body) {
        document.body.appendChild(panelElement);
    }
    $panel.addClass('floating');
    extensionDebugState.overlay?.classList.add('visible');
}

function ensureDebugListPlaceholder(category) {
    const $list = extensionDebugState.elements?.lists?.[category];
    if (!$list?.length) {
        return;
    }

    const hasEntries = $list.children('.extension-debug-item').length > 0;
    if (hasEntries) {
        $list.children('.extension-debug-placeholder').remove();
        return;
    }

    if ($list.children('.extension-debug-placeholder').length > 0) {
        return;
    }

    let message;
    switch (category) {
        case 'variables':
            message = t`暂无变量更新`;
            break;
        case 'logs':
            message = t`暂无扩展日志`;
            break;
        case 'events':
        default:
            message = t`暂无事件`;
            break;
    }

    const $placeholder = $('<div>').addClass('extension-debug-empty extension-debug-placeholder').text(message);
    $list.append($placeholder);
}

function extractImportDetail(args) {
    if (!args || args.length === 0) {
        return null;
    }
    const primary = args[0];
    if (primary && typeof primary === 'object') {
        if (primary.detail && typeof primary.detail === 'object') {
            return primary.detail;
        }
        return primary;
    }
    return null;
}

function deriveImportStatus(eventName, fallback) {
    switch (eventName) {
        case event_types.IMPORT_TASK_SUBMITTED:
            return 'pending';
        case event_types.IMPORT_TASK_PROGRESS:
            return 'running';
        case event_types.IMPORT_TASK_COMPLETED:
            return 'completed';
        case event_types.IMPORT_TASK_FAILED:
            return 'failed';
        default:
            return fallback ?? 'running';
    }
}

function updateImportTaskFromPayload(payload = {}) {
    if (!extensionDebugState.enabled) {
        return null;
    }
    const taskId = payload.taskId ?? payload.id;
    if (!taskId) {
        return null;
    }

    const current = extensionDebugState.importTasks.get(taskId) ?? {
        id: taskId,
        createdAt: payload.createdAt ?? Date.now(),
    };

    current.status = payload.status ?? current.status ?? 'pending';
    current.type = payload.type ?? current.type ?? '—';
    current.updatedAt = payload.updatedAt ?? Date.now();
    if (payload.progress !== undefined) {
        current.progress = payload.progress;
    }
    if (payload.result !== undefined) {
        current.result = payload.result;
    }
    if (payload.error !== undefined) {
        current.error = payload.error;
    }
    if (payload.lastEvent) {
        current.lastEvent = payload.lastEvent;
    }

    extensionDebugState.importTasks.set(taskId, current);
    return current;
}

function createDebugEntry(prefix, title, subtitle, payload, timestamp = Date.now()) {
    extensionDebugState.sequence += 1;
    return {
        id: `${prefix}-${extensionDebugState.sequence}`,
        time: timestamp,
        title,
        subtitle,
        payload,
    };
}

function pushDebugEntry(category, entry) {
    if (!extensionDebugState.enabled) {
        return;
    }
    if (!extensionDebugState.entries[category]) {
        return;
    }

    if (extensionDebugState.paused) {
        const queue = extensionDebugState.pending[category] ?? [];
        queue.push(entry);
        if (queue.length > EXTENSION_DEBUG_MAX_ITEMS) {
            queue.shift();
        }
        extensionDebugState.pending[category] = queue;
        updateDebugSummary();
        return;
    }

    const store = extensionDebugState.entries[category];
    store.push(entry);
    if (store.length > EXTENSION_DEBUG_MAX_ITEMS) {
        const overflow = store.length - EXTENSION_DEBUG_MAX_ITEMS;
        store.splice(0, overflow);
        const $list = extensionDebugState.elements.lists[category];
        if ($list?.length) {
            $list.children().slice(0, overflow).remove();
        }
    }

    renderDebugEntry(category, entry);
    updateDebugSummary();
}

function renderDebugEntry(category, entry) {
    if (!extensionDebugState.enabled) {
        return;
    }
    const $list = extensionDebugState.elements.lists[category];
    if (!$list?.length) {
        return;
    }

    $list.children('.extension-debug-placeholder').remove();

    const $item = $('<div>').addClass('extension-debug-item').attr('data-entry-id', entry.id);
    const $meta = $('<div>').addClass('extension-debug-item__meta');
    $meta.append($('<span>').text(entry.title));
    $meta.append($('<time>').attr('datetime', new Date(entry.time).toISOString()).text(formatTime(entry.time)));
    if (entry.subtitle) {
        $meta.append($('<span>').text(entry.subtitle));
    }
    $item.append($meta);

    const payloadText = entry.payload && entry.payload.length > 0 ? entry.payload : t`（空）`;
    const $payload = $('<pre>').addClass('extension-debug-item__payload').text(payloadText);
    $item.append($payload);

    $list.append($item);

    if (extensionDebugState.autoScroll && extensionDebugState.activeTab === category) {
        scrollListToBottom($list);
    }
}

function clearDebugData() {
    Object.keys(extensionDebugState.entries).forEach((category) => {
        extensionDebugState.entries[category] = [];
        extensionDebugState.pending[category] = [];
        const $list = extensionDebugState.elements.lists[category];
        $list?.empty();
        ensureDebugListPlaceholder(category);
    });

    extensionDebugState.importTasks.clear();
    extensionDebugState.pendingImportUpdates.clear();
    extensionDebugState.elements.importTableBody?.empty();
    updateDebugSummary();
}

function setExtensionDebugPanelEnabled(enabled) {
    registerDebugPanelApi();
    ensureExtensionDebugPanelInitialized();

    const $panel = extensionDebugState.elements.panel;
    if (!$panel?.length) {
        return;
    }

    if (enabled) {
        if (extensionDebugState.enabled) {
            return;
        }
        extensionDebugState.enabled = true;
        $panel.removeClass('extension-debug-hidden');
        setDebugFloating(false);
        attachDebugListeners();
        hookExtensionConsole();
        setDebugActiveTab(extensionDebugState.activeTab);
        renderImportTable(true);
        updateDebugSummary();
    } else {
        if (!extensionDebugState.enabled) {
            $panel.addClass('extension-debug-hidden');
            return;
        }
        extensionDebugState.enabled = false;
        setDebugFloating(false);
        detachDebugListeners();
        unhookExtensionConsole();
        clearDebugData();
        $panel.addClass('extension-debug-hidden');
        updateDebugSummary();
    }
}

async function refreshImportStatuses() {
    if (!extensionDebugState.enabled) {
        return;
    }
    if (extensionDebugState.importTasks.size === 0) {
        toastr.info(t`暂无被跟踪的导入任务`, t`扩展调试面板`);
        return;
    }

    const lookups = [];
    for (const taskId of extensionDebugState.importTasks.keys()) {
        lookups.push(fetch(`${EXTENSION_DEBUG_IMPORT_ENDPOINT}${encodeURIComponent(taskId)}`)
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error(await response.text() || response.statusText);
                }
                return response.json();
            })
            .then((payload) => {
                updateImportTaskFromPayload(payload);
            }));
    }

    const results = await Promise.allSettled(lookups);
    const hasFailure = results.some((result) => result.status === 'rejected');
    if (hasFailure) {
        toastr.warning(t`部分导入任务刷新失败`, t`扩展调试面板`);
    }

    if (extensionDebugState.paused) {
        extensionDebugState.pendingImportUpdates = new Set(extensionDebugState.importTasks.keys());
    } else {
        renderImportTable(true);
    }
}

function renderImportTable(force = false) {
    if (!extensionDebugState.enabled) {
        return;
    }
    const $tbody = extensionDebugState.elements.importTableBody;
    if (!$tbody?.length) {
        return;
    }

    if (extensionDebugState.paused && !force) {
        updateDebugSummary();
        return;
    }

    const tasks = Array.from(extensionDebugState.importTasks.values())
        .sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));

    $tbody.empty();

    if (tasks.length === 0) {
        const $row = $('<tr>');
        $row.append($('<td>', { colspan: 4 }).addClass('extension-debug-empty').text(t`暂无任务`));
        $tbody.append($row);
        updateDebugSummary();
        return;
    }

    for (const task of tasks) {
        const $row = $('<tr>');
        $row.append($('<td>').text(task.id));
        $row.append($('<td>').text(task.type ?? '—'));

        const statusLabel = formatImportStatus(task.status);
        const $statusCell = $('<td>');
        if (statusLabel) {
            const $badge = $('<span>').addClass('extension-debug-status-badge').addClass(`status-${task.status ?? 'pending'}`).text(statusLabel);
            if (Number.isFinite(task.progress)) {
                const percentage = Math.round(task.progress * 100);
                $badge.append($('<span>').text(`${percentage}%`));
            }
            $statusCell.append($badge);
        } else {
            $statusCell.text(task.status ?? '—');
        }
        if (task.error) {
            const errorMessage = typeof task.error === 'string' ? task.error : (task.error?.message ?? JSON.stringify(task.error));
            $statusCell.append($('<div>').addClass('extension-debug-error-text').text(errorMessage));
        }
        $row.append($statusCell);

        const $timeCell = $('<td>');
        if (task.updatedAt) {
            $timeCell.append(
                $('<time>')
                    .attr('datetime', new Date(task.updatedAt).toISOString())
                    .text(formatTime(task.updatedAt)),
            );
        } else {
            $timeCell.text('—');
        }
        $row.append($timeCell);
        $tbody.append($row);
    }

    updateDebugSummary();
}

function setDebugPaused(paused) {
    extensionDebugState.paused = Boolean(paused);
    if (!extensionDebugState.paused) {
        flushPendingEntries();
    }
    updateDebugSummary();
}

function flushPendingEntries() {
    Object.keys(extensionDebugState.pending).forEach((category) => {
        const pending = extensionDebugState.pending[category];
        if (!pending || pending.length === 0) {
            return;
        }
        extensionDebugState.pending[category] = [];
        for (const entry of pending) {
            pushDebugEntry(category, entry);
        }
    });
    if (extensionDebugState.pendingImportUpdates.size > 0) {
        extensionDebugState.pendingImportUpdates.clear();
        renderImportTable(true);
    }
}

function setDebugActiveTab(tab) {
    const available = ['events', 'variables', 'imports', 'logs'];
    const normalized = available.includes(tab) ? tab : 'events';
    extensionDebugState.activeTab = normalized;

    if (!extensionDebugState.enabled) {
        return;
    }

    const $panel = extensionDebugState.elements.panel;
    if ($panel?.length) {
        $panel.find('.extension-debug-tab').each((_, button) => {
            const $button = $(button);
            $button.toggleClass('active', String($button.data('tab')) === normalized);
        });
        $panel.find('.extension-debug-pane').each((_, pane) => {
            const $pane = $(pane);
            $pane.toggleClass('active', String($pane.data('pane')) === normalized);
        });
    }

    if (!extensionDebugState.paused) {
        if (normalized === 'imports') {
            renderImportTable(true);
        } else {
            const $list = extensionDebugState.elements.lists[normalized];
            if ($list?.length) {
                scrollListToBottom($list);
            }
        }
    }

    updateDebugSummary();
}

function updateDebugSummary() {
    const $counter = extensionDebugState.elements.counter;
    if ($counter?.length) {
        if (!extensionDebugState.enabled) {
            $counter.text('0');
        } else {
            let visible = 0;
            if (extensionDebugState.activeTab === 'imports') {
                visible = extensionDebugState.importTasks.size;
                if (extensionDebugState.paused) {
                    visible += extensionDebugState.pendingImportUpdates.size;
                }
            } else {
                visible = extensionDebugState.entries[extensionDebugState.activeTab]?.length ?? 0;
                if (extensionDebugState.paused) {
                    visible += extensionDebugState.pending[extensionDebugState.activeTab]?.length ?? 0;
                }
            }
            $counter.text(String(visible));
        }
    }

    const $pauseState = extensionDebugState.elements.pauseState;
    if ($pauseState?.length) {
        const isPaused = extensionDebugState.enabled && extensionDebugState.paused;
        const pausedText = isPaused ? t`是` : t`否`;
        $pauseState.attr('data-state', isPaused ? 'on' : 'off').text(pausedText);
    }
}

function scrollListToBottom($list) {
    if (!$list?.length) {
        return;
    }
    const element = $list.get(0);
    if (!element) {
        return;
    }
    element.scrollTop = element.scrollHeight;
}

function formatPayloadList(args) {
    if (!args || args.length === 0) {
        return t`（无内容）`;
    }
    if (args.length === 1) {
        return truncatePayload(safeStringify(args[0]));
    }
    return args.map((value, index) => `[${index}] ${truncatePayload(safeStringify(value))}`).join('\n');
}

function safeStringify(value) {
    if (value === null || value === undefined) {
        return String(value);
    }
    if (typeof value === 'string') {
        return value;
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
        return JSON.stringify(value);
    }
    if (value instanceof Error) {
        return `${value.name}: ${value.message}`;
    }
    if (value instanceof Event) {
        return `[Event ${value.type}]`;
    }
    try {
        return JSON.stringify(value, getCircularReplacer(), 2);
    } catch {
        try {
            return String(value);
        } catch {
            return '[Unserializable]';
        }
    }
}

function truncatePayload(text) {
    const limit = 1000;
    if (typeof text !== 'string') {
        return text;
    }
    if (text.length <= limit) {
        return text;
    }
    return `${text.slice(0, limit)}… (+${text.length - limit} ${t`字符`})`;
}

function getCircularReplacer() {
    const seen = new WeakSet();
    return (_key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return '[Circular]';
            }
            seen.add(value);
        }
        return value;
    };
}

function formatTime(timestamp) {
    if (!timestamp) {
        return '—';
    }
    try {
        if (!extensionDebugTimeFormatter) {
            extensionDebugTimeFormatter = new Intl.DateTimeFormat(getCurrentLocale(), {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            });
        }
        return extensionDebugTimeFormatter.format(new Date(timestamp));
    } catch {
        return new Date(timestamp).toLocaleTimeString();
    }
}

function formatImportStatus(status) {
    switch (status) {
        case 'pending':
            return t`排队中`;
        case 'running':
            return t`执行中`;
        case 'completed':
            return t`已完成`;
        case 'failed':
            return t`已失败`;
        default:
            return status ?? '—';
    }
}

function registerDebugPanelApi() {
    const root = globalThis.SillyTavern ?? (globalThis.SillyTavern = {});
    const extensionNamespace = root.extensions ?? (root.extensions = {});
    extensionNamespace.debugPanel = Object.freeze({
        enable: () => setExtensionDebugPanelEnabled(true),
        disable: () => setExtensionDebugPanelEnabled(false),
        setEnabled: (value) => setExtensionDebugPanelEnabled(Boolean(value)),
        isEnabled: () => extensionDebugState.enabled,
        toggleFloating: (value) => {
            const target = typeof value === 'boolean' ? value : !extensionDebugState.floating;
            setDebugFloating(target);
        },
    });
}

registerDebugPanelApi();
