import {
    showdown,
    moment,
    DOMPurify,
    hljs,
    Handlebars,
    SVGInject,
    Popper,
    initLibraryShims,
    default as libs,
} from './lib.js';

import { workerManager } from './scripts/workers/worker-manager.js';
import { registerWorkerTask, WorkerFallbackStrategy } from './scripts/workers/worker-protocol.js';

import { humanizedDateTime, favsToHotswap, getMessageTimeStamp, dragElement, isMobile, initRossMods } from './scripts/RossAscends-mods.js';
import { userStatsHandler, statMesProcess, initStats } from './scripts/stats.js';
import {
    generateKoboldWithStreaming,
    kai_settings,
    loadKoboldSettings,
    getKoboldGenerationData,
    kai_flags,
    koboldai_settings,
    koboldai_setting_names,
    initKoboldSettings,
} from './scripts/kai-settings.js';

import {
    textgenerationwebui_settings as textgen_settings,
    loadTextGenSettings,
    generateTextGenWithStreaming,
    getTextGenGenerationData,
    textgen_types,
    parseTextgenLogprobs,
    parseTabbyLogprobs,
    initTextGenSettings,
} from './scripts/textgen-settings.js';
import { delegateLeftNav, createPanelSaveScheduler } from './scripts/util/panel-delegation.js';
import { defineSaveScheduler, createSaveScheduler } from './scripts/util/save-scheduler.js';

import {
    world_info,
    getWorldInfoPrompt,
    getWorldInfoSettings,
    setWorldInfoSettings,
    world_names,
    importEmbeddedWorldInfo,
    checkEmbeddedWorld,
    setWorldInfoButtonClass,
    importWorldInfo,
    wi_anchor_position,
    world_info_include_names,
    initWorldInfo,
    loadWorldInfo,
    saveWorldInfo,
    deleteWorldInfo,
    createNewWorldInfo,
    createWorldInfoEntry,
    duplicateWorldInfoEntry,
    deleteWorldInfoEntry,
    moveWorldInfoEntry,
    setWIOriginalDataValue,
    deleteWIOriginalDataValue,
    worldInfoCache,
    reloadEditor,
    openWorldInfoEditor,
    renameWorldInfo,
    refreshWorldInfoEditor,
    getWorldEntry,
    updateWorldInfoList,
} from './scripts/world-info.js';

import {
    groups,
    selected_group,
    saveGroupChat,
    getGroups,
    generateGroupWrapper,
    is_group_generating,
    resetSelectedGroup,
    select_group_chats,
    regenerateGroup,
    group_generation_id,
    getGroupChat,
    renameGroupMember,
    createNewGroupChat,
    getGroupAvatar,
    editGroup,
    deleteGroupChat,
    renameGroupChat,
    importGroupChat,
    getGroupBlock,
    getGroupCharacterCards,
    getGroupDepthPrompts,
} from './scripts/group-chats.js';

import {
    collapseNewlines,
    loadPowerUserSettings,
    playMessageSound,
    fixMarkdown,
    power_user,
    persona_description_positions,
    loadMovingUIState,
    getCustomStoppingStrings,
    MAX_CONTEXT_DEFAULT,
    MAX_RESPONSE_DEFAULT,
    renderStoryString,
    sortEntitiesList,
    registerDebugFunction,
    flushEphemeralStoppingStrings,
    resetMovableStyles,
    forceCharacterEditorTokenize,
    applyPowerUserSettings,
    generatedTextFiltered,
    applyStylePins,
    hydrateSmartThemeDefaults,
} from './scripts/power-user.js';
import { buildMessageRenderingData } from './scripts/chat/chat-renderer.js';
import { applyMessageDomMapping, applyMessageStateClasses } from './scripts/chat/message-dom-map.js';
import { normalizeStageOptions, describeStages } from './scripts/chat/render-pipeline-config.js';
import {
    buildRenderCacheKey,
    clearMessageRenderCache,
    getCachedHtml,
    isRenderCacheReady,
    setMessageRenderCache,
} from './scripts/chat/message-render-cache.js';
import {
    CHAT_RENDER_EVENT_END,
    CHAT_RENDER_EVENT_START,
    VIRTUALIZATION_DOM_EVENT_AFTER_RENDER,
    VIRTUALIZATION_DOM_EVENT_BEFORE_MOUNT,
    VIRTUALIZATION_DOM_EVENT_MOUNT,
    VIRTUALIZATION_DOM_EVENT_UNMOUNT,
    broadcastChatRender,
    configureChatEvents,
    emitVirtualizationDomEvent,
    handleVirtualMessageMount,
    handleVirtualMessageUnmount,
    notifyMessageMounted,
    notifyMessageUnmounted,
} from './scripts/chat/chat-events.js';
import {
    exposeRenderTaskDebug,
    flushRenderTasks,
    scheduleRenderTask,
} from './scripts/chat/render-task-queue.js';
export { flushRenderTasks };

import {
    setOpenAIMessageExamples,
    setOpenAIMessages,
    setupChatCompletionPromptManager,
    prepareOpenAIMessages,
    sendOpenAIRequest,
    loadOpenAISettings,
    oai_settings,
    openai_messages_count,
    chat_completion_sources,
    getChatCompletionModel,
    proxies,
    loadProxyPresets,
    selected_proxy,
    initOpenAI,
} from './scripts/openai.js';

import {
    generateNovelWithStreaming,
    getNovelGenerationData,
    getKayraMaxContextTokens,
    loadNovelSettings,
    nai_settings,
    adjustNovelInstructionPrompt,
    parseNovelAILogprobs,
    novelai_settings,
    novelai_setting_names,
    initNovelAISettings,
} from './scripts/nai-settings.js';

import {
    initBookmarks,
    showBookmarksButtons,
    updateBookmarkDisplay,
} from './scripts/bookmarks.js';

import {
    horde_settings,
    loadHordeSettings,
    generateHorde,
    getStatusHorde,
    getHordeModels,
    adjustHordeGenerationParams,
    isHordeGenerationNotAllowed,
    MIN_LENGTH,
    initHorde,
} from './scripts/horde.js';

import {
    cancelDebounce,
    debounce,
    delay,
    trimToEndSentence,
    countOccurrences,
    isOdd,
    sortMoments,
    timestampToMoment,
    download,
    isDataURL,
    getCharaFilename,
    PAGINATION_TEMPLATE,
    waitUntilCondition,
    escapeRegex,
    resetScrollHeight,
    onlyUnique,
    getBase64Async,
    humanFileSize,
    Stopwatch,
    isValidUrl,
    ensureImageFormatSupported,
    flashHighlight,
    toggleDrawer,
    isElementInViewport,
    copyText,
    escapeHtml,
    saveBase64AsFile,
    uuidv4,
    equalsIgnoreCaseAndAccents,
    getSanitizedFilename,
    localizePagination,
    renderPaginationDropdown,
    paginationDropdownChangeHandler,
    throttle,
    navigation_option,
} from './scripts/utils.js';
import { debounce_timeout, GENERATION_TYPE_TRIGGERS, IGNORE_SYMBOL, inject_ids } from './scripts/constants.js';
import { VARIABLE_SCOPE, VARIABLE_EVENTS, MUTATION_REMOVE, MUTATION_SKIP, createVariableService } from './scripts/variable-service.js';

import {
    cancelDebouncedMetadataSave,
    doDailyExtensionUpdatesCheck,
    extension_settings,
    initExtensions,
    loadExtensionSettings,
    runGenerationInterceptors,
    saveMetadataDebounced,
    enableExtension,
    disableExtension,
    installExtension,
    deleteExtension,
    getInstalledExtensionsSnapshot,
    getExtensionLoadErrors,
    discoverExtensions,
    moveExtension,
    switchExtensionBranch,
    updateExtension,
    autoUpdateExtensions,
    checkForExtensionUpdates,
    getExtensionBranches,
    getExtensionVersion,
    isExtensionReloadPending,
    clearExtensionReloadFlag,
} from './scripts/extensions.js';
import { COMMENT_NAME_DEFAULT, CONNECT_API_MAP, executeSlashCommandsOnChatInput, initDefaultSlashCommands, isExecutingCommandsFromChatInput, pauseScriptExecution, stopScriptExecution, UNIQUE_APIS } from './scripts/slash-commands.js';
import {
    tag_map,
    tags,
    filterByTagState,
    isBogusFolder,
    isBogusFolderOpen,
    chooseBogusFolder,
    getTagBlock,
    loadTagsSettings,
    printTagFilters,
    getTagKeyForEntity,
    printTagList,
    createTagMapFromList,
    renameTagKey,
    importTags,
    tag_filter_type,
    compareTagsForSort,
    initTags,
    applyTagsOnCharacterSelect,
    applyTagsOnGroupSelect,
    tag_import_setting,
    applyCharacterTagsToMessageDivs,
} from './scripts/tags.js';
import { initSecrets, readSecretState } from './scripts/secrets.js';
import { markdownExclusionExt } from './scripts/showdown-exclusion.js';
import { markdownUnderscoreExt } from './scripts/showdown-underscore.js';
import { NOTE_MODULE_NAME, initAuthorsNote, metadata_keys, setFloatingPrompt, shouldWIAddPrompt } from './scripts/authors-note.js';
import { registerPromptManagerMigration } from './scripts/PromptManager.js';
import { getRegexedString, regex_placement } from './scripts/extensions/regex/engine.js';
import { initLogprobs, saveLogprobsForActiveMessage } from './scripts/logprobs.js';
import { FILTER_STATES, FILTER_TYPES, FilterHelper, isFilterState } from './scripts/filters.js';
import { getCfgPrompt, getGuidanceScale, initCfg } from './scripts/cfg-scale.js';
import {
    force_output_sequence,
    formatInstructModeChat,
    formatInstructModePrompt,
    formatInstructModeExamples,
    formatInstructModeStoryString,
    getInstructStoppingSequences,
} from './scripts/instruct-mode.js';
import { initLocales, t } from './scripts/i18n.js';
import { getFriendlyTokenizerName, getTokenCount, getTokenCountAsync, initTokenizers, saveTokenCache } from './scripts/tokenizers.js';
import {
    user_avatar,
    getUserAvatars,
    getUserAvatar,
    setUserAvatar,
    initPersonas,
    setPersonaDescription,
    initUserAvatar,
    updatePersonaConnectionsAvatarList,
    isPersonaPanelOpen,
} from './scripts/personas.js';
import { getBackgrounds, initBackgrounds, loadBackgroundSettings, background_settings } from './scripts/backgrounds.js';
import { hideLoader, showLoader } from './scripts/loader.js';
import { BulkEditOverlay } from './scripts/BulkEditOverlay.js';
import { initTextGenModels } from './scripts/textgen-models.js';
import { appendFileContent, hasPendingFileAttachment, populateFileAttachment, decodeStyleTags, encodeStyleTags, isExternalMediaAllowed, preserveNeutralChat, restoreNeutralChat, formatCreatorNotes, initChatUtilities, addDOMPurifyHooks } from './scripts/chats.js';
import { getPresetManager, initPresetManager } from './scripts/preset-manager.js';
import { MacrosParser, evaluateMacros, evaluateMacrosAsync, getLastMessageId, initMacros } from './scripts/macros.js';
import { currentUser, setUserControls } from './scripts/user.js';
import { POPUP_RESULT, POPUP_TYPE, Popup, callGenericPopup, fixToastrForDialogs } from './scripts/popup.js';
import { renderTemplate, renderTemplateAsync, clearTemplateCache, hasTemplateCached } from './scripts/templates.js';
import { initScrapers } from './scripts/scrapers.js';
import { initCustomSelectedSamplers, validateDisabledSamplers } from './scripts/samplerSelect.js';
import { DragAndDropHandler } from './scripts/dragdrop.js';
import { INTERACTABLE_CONTROL_CLASS, initKeyboard } from './scripts/keyboard.js';
import { initDynamicStyles } from './scripts/dynamic-styles.js';
import { initInputMarkdown } from './scripts/input-md-formatting.js';
import { AbortReason } from './scripts/util/AbortReason.js';
import { OffscreenVisibilityManager } from './scripts/chat/offscreen-manager.js';
import VirtualList from './scripts/util/VirtualList.js';
import { initSystemPrompts } from './scripts/sysprompt.js';
import { registerExtensionSlashCommands as initExtensionSlashCommands } from './scripts/extensions-slashcommands.js';
import { ToolManager } from './scripts/tool-calling.js';
import { addShowdownPatch } from './scripts/util/showdown-patch.js';
import { applyBrowserFixes } from './scripts/browser-fixes.js';
import { initServerHistory } from './scripts/server-history.js';
import { initSettingsSearch } from './scripts/setting-search.js';
import { initBulkEdit } from './scripts/bulk-edit.js';
import { getContext } from './scripts/st-context.js';
import { extractReasoningFromData, initReasoning, parseReasoningInSwipes, PromptReasoning, ReasoningHandler, removeReasoningFromString, updateReasoningUI } from './scripts/reasoning.js';
import { accountStorage } from './scripts/util/AccountStorage.js';
import { initWelcomeScreen, openPermanentAssistantChat, openPermanentAssistantCard, getPermanentAssistantAvatar } from './scripts/welcome-screen.js';
import { initDataMaid } from './scripts/data-maid.js';
import { clearItemizedPrompts, deleteItemizedPrompts, findItemizedPromptSet, initItemizedPrompts, itemizedParams, itemizedPrompts, loadItemizedPrompts, promptItemize, replaceItemizedPromptText, saveItemizedPrompts } from './scripts/itemized-prompts.js';
import { getSystemMessageByType, initSystemMessages, SAFETY_CHAT, sendSystemMessage, system_message_types, system_messages } from './scripts/system-messages.js';
import { event_types, eventSource, safeEmit } from './scripts/events.js';
import { initAccessibility } from './scripts/a11y.js';
import { registerServiceWorker } from './scripts/pwa/register-service-worker.js';

// API OBJECT FOR EXTERNAL WIRING
const sillyTavernRoot = globalThis.SillyTavern ?? {};
sillyTavernRoot.libs = libs;
sillyTavernRoot.getContext = getContext;
globalThis.SillyTavern = sillyTavernRoot;

export {
    user_avatar,
    setUserAvatar,
    getUserAvatars,
    getUserAvatar,
    nai_settings,
    isOdd,
    countOccurrences,
    renderTemplate,
    promptItemize,
    itemizedPrompts,
    saveItemizedPrompts,
    loadItemizedPrompts,
    itemizedParams,
    clearItemizedPrompts,
    replaceItemizedPromptText,
    deleteItemizedPrompts,
    findItemizedPromptSet,
    koboldai_settings,
    koboldai_setting_names,
    novelai_settings,
    novelai_setting_names,
    UNIQUE_APIS,
    CONNECT_API_MAP,
    system_messages,
    system_message_types,
    sendSystemMessage,
    getSystemMessageByType,
    event_types,
    eventSource,
    addManagedEventListener,
    scheduleLowPriorityTask,
};

/**
 * @typedef {Object} ManagedEventListenerOptions
 * @property {boolean} [capture]
 * @property {boolean} [once]
 * @property {boolean|'auto'} [passive]
 * @property {AbortSignal} [signal]
 * @property {number|boolean} [throttle]
 * @property {{ leading?: boolean, trailing?: boolean }} [throttleOptions]
 * @property {number|boolean} [debounce]
 * @property {'animation'|'raf'|'idle'|'microtask'|'sync'} [defer]
 * @property {'user-blocking'|'user-visible'|'background'} [priority]
 * @property {boolean} [optimized]
 * @property {(event: Event) => boolean} [predicate]
 * @property {(event: Event) => boolean} [filter]
 * @property {boolean} [passiveFallback]
 * @property {Record<string, any>} [dom]
 * @property {number|boolean} [throttleMs]
 * @property {number|boolean} [debounceMs]
 * @property {'animation'|'raf'|'idle'|'microtask'|'sync'} [frame]
 * @property {'user-blocking'|'user-visible'|'background'} [schedulerPriority]
 */

/**
 * @typedef {Object} ManagedEventRuntimeOptions
 * @property {number|null} throttle
 * @property {{ leading?: boolean, trailing?: boolean }|undefined} throttleOptions
 * @property {number|null} debounce
 * @property {'animation'|'raf'|'idle'|'microtask'|'sync'|undefined} defer
 * @property {'user-blocking'|'user-visible'|'background'|undefined} priority
 * @property {(event: Event) => boolean|undefined} predicate
 * @property {boolean} passiveFallback
 * @property {boolean} optimized
 */

const DEFAULT_PASSIVE_EVENT_TYPES = new Set([
    'wheel',
    'mousewheel',
    'touchstart',
    'touchmove',
    'touchend',
    'touchcancel',
    'pointerdown',
    'pointermove',
    'pointerup',
    'pointercancel',
    'scroll',
]);

const MANAGED_EVENT_BEHAVIORS = new Map([
    ['scroll', { throttle: 32, defer: 'animation' }],
    ['wheel', { throttle: 24, defer: 'animation' }],
    ['touchmove', { throttle: 24, defer: 'animation' }],
    ['pointermove', { throttle: 24, defer: 'animation' }],
    ['mousemove', { throttle: 24, defer: 'animation' }],
]);

const queueAsyncTask = typeof queueMicrotask === 'function'
    ? queueMicrotask
    : (callback) => Promise.resolve().then(callback).catch((error) => setTimeout(() => { throw error; }, 0));

function isAbortSignalValue(value) {
    return typeof AbortSignal !== 'undefined' && value instanceof AbortSignal;
}

/**
 * @param {string} eventType
 * @param {ManagedEventListenerOptions|boolean|undefined|null} options
 * @returns {{ domOptions: AddEventListenerOptions|boolean|undefined, managed: ManagedEventListenerOptions }}
 */
function resolveManagedEventOptions(eventType, options) {
    const shouldBePassive = DEFAULT_PASSIVE_EVENT_TYPES.has(eventType);
    const managed = {
        optimized: true,
        throttle: undefined,
        throttleOptions: undefined,
        debounce: undefined,
        defer: undefined,
        priority: undefined,
        predicate: undefined,
        passiveFallback: true,
    };

    if (options === undefined || options === null) {
        return {
            domOptions: shouldBePassive ? { passive: true } : undefined,
            managed,
        };
    }

    if (typeof options === 'boolean') {
        const domOptions = shouldBePassive ? { capture: options, passive: true } : options;
        return { domOptions, managed };
    }

    if (typeof options === 'object') {
        const domOptions = options.dom && typeof options.dom === 'object' && options.dom !== null
            ? { ...options.dom }
            : {};

        if (options.optimized === false) {
            managed.optimized = false;
        }
        if (options.passiveFallback === false) {
            managed.passiveFallback = false;
        }
        if (typeof options.predicate === 'function') {
            managed.predicate = options.predicate;
        }
        if (typeof options.filter === 'function') {
            const existingPredicate = managed.predicate;
            managed.predicate = existingPredicate
                ? (event) => {
                    try {
                        return existingPredicate(event) && options.filter(event);
                    } catch (error) {
                        console.error('事件过滤器执行失败', error);
                        return false;
                    }
                }
                : options.filter;
        }

        if (typeof options.throttleOptions === 'object' && options.throttleOptions !== null) {
            managed.throttleOptions = options.throttleOptions;
        }

        managed.throttle = options.throttle ?? options.throttleMs;
        managed.debounce = options.debounce ?? options.debounceMs;
        managed.defer = options.defer ?? options.frame;
        managed.priority = options.priority ?? options.schedulerPriority;

        if (Object.prototype.hasOwnProperty.call(options, 'capture')) {
            domOptions.capture = Boolean(options.capture);
        } else if (domOptions.capture !== undefined) {
            domOptions.capture = Boolean(domOptions.capture);
        }

        if (Object.prototype.hasOwnProperty.call(options, 'once')) {
            domOptions.once = Boolean(options.once);
        } else if (domOptions.once !== undefined) {
            domOptions.once = Boolean(domOptions.once);
        }

        if (Object.prototype.hasOwnProperty.call(options, 'signal')) {
            domOptions.signal = isAbortSignalValue(options.signal) ? options.signal : undefined;
        } else if (domOptions.signal !== undefined && !isAbortSignalValue(domOptions.signal)) {
            delete domOptions.signal;
        }

        let passiveValue;
        if (Object.prototype.hasOwnProperty.call(options, 'passive')) {
            passiveValue = options.passive;
        } else if (domOptions.passive !== undefined) {
            passiveValue = domOptions.passive;
        } else if (options.passiveMode === 'force') {
            passiveValue = true;
        }

        if (passiveValue === 'auto') {
            passiveValue = shouldBePassive;
        }
        if (passiveValue !== undefined) {
            domOptions.passive = passiveValue;
        } else if (shouldBePassive) {
            domOptions.passive = true;
        }

        for (const key of Object.keys(domOptions)) {
            if (domOptions[key] === undefined) {
                delete domOptions[key];
            }
        }

        const normalizedDom = Object.keys(domOptions).length
            ? domOptions
            : (shouldBePassive ? { passive: true } : undefined);

        return { domOptions: normalizedDom, managed };
    }

    return { domOptions: options, managed };
}

/**
 * @param {number|boolean|undefined} value
 * @param {number|undefined} fallback
 * @returns {number|null}
 */
function normalizeNumericOption(value, fallback) {
    if (value === undefined) {
        return typeof fallback === 'number' && Number.isFinite(fallback) && fallback > 0 ? fallback : null;
    }
    if (value === false || value === null) {
        return null;
    }
    if (value === true) {
        return typeof fallback === 'number' && fallback > 0 ? fallback : null;
    }
    const numeric = Number(value);
    if (Number.isFinite(numeric) && numeric > 0) {
        return numeric;
    }
    return typeof fallback === 'number' && fallback > 0 ? fallback : null;
}

/**
 * @param {string} eventType
 * @param {ManagedEventListenerOptions} managed
 * @returns {ManagedEventRuntimeOptions}
 */
function computeManagedRuntimeOptions(eventType, managed) {
    const defaults = managed.optimized !== false
        ? (MANAGED_EVENT_BEHAVIORS.get(eventType) ?? {})
        : {};

    const runtime = {
        optimized: managed.optimized !== false,
        throttle: normalizeNumericOption(managed.throttle, defaults.throttle),
        throttleOptions: managed.throttleOptions ?? defaults.throttleOptions,
        debounce: normalizeNumericOption(managed.debounce, defaults.debounce),
        defer: managed.defer ?? defaults.defer,
        priority: managed.priority ?? defaults.priority,
        predicate: managed.predicate ?? defaults.predicate,
        passiveFallback: managed.passiveFallback !== undefined
            ? managed.passiveFallback
            : (defaults.passiveFallback ?? true),
    };

    if (runtime.debounce) {
        runtime.throttle = null;
    }

    return runtime;
}

/**
 * @param {AddEventListenerOptions|boolean|undefined} domOptions
 * @param {string} eventType
 * @returns {boolean}
 */
function isPassiveEventOption(domOptions, eventType) {
    if (domOptions === undefined || domOptions === null) {
        return DEFAULT_PASSIVE_EVENT_TYPES.has(eventType);
    }
    if (typeof domOptions === 'boolean') {
        return DEFAULT_PASSIVE_EVENT_TYPES.has(eventType);
    }
    if (typeof domOptions === 'object') {
        if (Object.prototype.hasOwnProperty.call(domOptions, 'passive')) {
            return Boolean(domOptions.passive);
        }
        return DEFAULT_PASSIVE_EVENT_TYPES.has(eventType);
    }
    return DEFAULT_PASSIVE_EVENT_TYPES.has(eventType);
}

/**
 * @param {string} eventType
 * @param {(event: Event) => any} listener
 * @param {ManagedEventRuntimeOptions} runtime
 * @returns {{ handler: (event: Event) => void, cleanup: () => void }}
 */
function createManagedListenerWrapper(eventType, listener, runtime) {
    let wrapped = listener;
    const cleanupTasks = [];

    if (typeof runtime.predicate === 'function') {
        const predicate = runtime.predicate;
        const previous = wrapped;
        wrapped = function (event) {
            let allow = false;
            try {
                allow = predicate.call(this, event);
            } catch (error) {
                console.error('事件过滤器执行失败', eventType, error);
                return;
            }
            if (!allow) {
                return;
            }
            return previous.call(this, event);
        };
    }

    if (runtime.debounce && runtime.debounce > 0) {
        const previous = wrapped;
        const debounced = debounce(function (event) {
            return previous.call(this, event);
        }, runtime.debounce);
        wrapped = function (event) {
            return debounced.call(this, event);
        };
        cleanupTasks.push(() => {
            cancelDebounce(debounced);
        });
    } else if (runtime.throttle && runtime.throttle > 0) {
        const previous = wrapped;
        const throttled = throttle(function (event) {
            return previous.call(this, event);
        }, runtime.throttle, runtime.throttleOptions);
        wrapped = function (event) {
            return throttled.call(this, event);
        };
        cleanupTasks.push(() => {
            if (typeof throttled.cancel === 'function') {
                throttled.cancel();
            }
        });
    }

    if (runtime.defer === 'animation' || runtime.defer === 'raf') {
        const previous = wrapped;
        wrapped = function (event) {
            const context = this;
            if (typeof requestAnimationFrame === 'function') {
                requestAnimationFrame(() => previous.call(context, event));
            } else {
                previous.call(context, event);
            }
        };
    } else if (runtime.defer === 'idle') {
        const previous = wrapped;
        wrapped = function (event) {
            scheduleLowPriorityTask(() => previous.call(this, event), { priority: runtime.priority ?? 'background' });
        };
    } else if (runtime.defer === 'microtask') {
        const previous = wrapped;
        wrapped = function (event) {
            Promise.resolve().then(() => previous.call(this, event));
        };
    }

    return {
        handler: wrapped,
        cleanup: () => {
            for (const task of cleanupTasks) {
                try {
                    task?.();
                } catch (error) {
                    console.warn('事件监听清理失败', error);
                }
            }
        },
    };
}

/**
 * @param {ManagedEventListenerOptions|boolean|undefined|null} options
 * @param {ManagedEventRuntimeOptions} runtime
 * @returns {ManagedEventListenerOptions}
 */
function normalizeFallbackOptions(options, runtime) {
    if (typeof options === 'object' && options !== null) {
        return { ...options, passive: false, passiveFallback: false };
    }
    const normalized = { passive: false, passiveFallback: false };
    if (typeof options === 'boolean') {
        normalized.capture = options;
    }
    if (runtime.optimized === false) {
        normalized.optimized = false;
    }
    return normalized;
}

function internalAttach(target, eventType, listener, options, skipPassiveFallback, reattach, bindingRef) {
    const { domOptions, managed } = resolveManagedEventOptions(eventType, options);
    const runtime = computeManagedRuntimeOptions(eventType, managed);
    const { handler: wrappedListener, cleanup } = createManagedListenerWrapper(eventType, listener, runtime);

    const usePassiveGuard = runtime.passiveFallback && !skipPassiveFallback && isPassiveEventOption(domOptions, eventType);
    let disposed = false;
    let fallbackScheduled = false;

    const eventHandler = usePassiveGuard
        ? function (event) {
            let prevented = false;
            const originalPrevent = event.preventDefault;
            event.preventDefault = function (...args) {
                prevented = true;
                return originalPrevent.apply(this, args);
            };
            try {
                wrappedListener.call(this, event);
            } finally {
                event.preventDefault = originalPrevent;
                if (prevented && event.cancelable && !fallbackScheduled) {
                    fallbackScheduled = true;
                    queueAsyncTask(() => {
                        if (bindingRef.disposed) {
                            return;
                        }
                        const nextOptions = normalizeFallbackOptions(options, runtime);
                        reattach(nextOptions, true);
                    });
                }
            }
        }
        : wrappedListener;

    if (typeof domOptions === 'object' && domOptions?.signal && !isAbortSignalValue(domOptions.signal)) {
        delete domOptions.signal;
    }

    if (typeof domOptions === 'object' && domOptions?.signal && domOptions.signal.aborted) {
        cleanup();
        return { dispose: () => {} };
    }

    try {
        target.addEventListener(eventType, eventHandler, domOptions);
    } catch (error) {
        console.error('addManagedEventListener 注册失败', eventType, error);
        cleanup();
        return { dispose: () => {} };
    }

    if (typeof domOptions === 'object' && domOptions?.signal) {
        const abortHandler = () => dispose();
        domOptions.signal.addEventListener('abort', abortHandler, { once: true });
    }

    const dispose = () => {
        if (disposed) {
            return;
        }
        disposed = true;
        try {
            target.removeEventListener(eventType, eventHandler, domOptions);
        } catch (error) {
            console.warn('addManagedEventListener 移除失败', eventType, error);
        }
        cleanup();
    };

    return { dispose };
}

function addManagedEventListener(target, eventType, listener, options) {
    if (!target || typeof target.addEventListener !== 'function') {
        return () => {};
    }

    const bindingRef = {
        dispose: () => {},
        disposed: true,
    };

    const attach = (nextOptions, skipPassiveFallback = false) => {
        bindingRef.dispose();
        const binding = internalAttach(target, eventType, listener, nextOptions, skipPassiveFallback, attach, bindingRef);
        bindingRef.disposed = false;
        bindingRef.dispose = () => {
            if (bindingRef.disposed) {
                return;
            }
            bindingRef.disposed = true;
            binding.dispose();
        };
    };

    attach(options);

    return () => bindingRef.dispose();
}

function scheduleLowPriorityTask(callback, { priority = 'background', delay = 0 } = {}) {
    if (typeof scheduler !== 'undefined' && typeof scheduler?.postTask === 'function') {
        scheduler.postTask(() => {
            try {
                callback();
            } catch (error) {
                console.error('低优先级任务执行失败', error);
            }
        }, { priority, delay }).catch((error) => {
            console.error('低优先级任务调度失败', error);
        });
        return;
    }

    if (typeof requestIdleCallback === 'function') {
        requestIdleCallback(() => {
            try {
                callback();
            } catch (error) {
                console.error('requestIdleCallback 任务执行失败', error);
            }
        }, { timeout: typeof delay === 'number' ? delay : undefined });
        return;
    }

    setTimeout(() => {
        try {
            callback();
        } catch (error) {
            console.error('setTimeout 低优先级任务执行失败', error);
        }
    }, Math.max(0, delay));
}

/**
 * Wait for page to load before continuing the app initialization.
 */
await new Promise((resolve) => {
    if (document.readyState === 'complete') {
        resolve();
    } else {
        window.addEventListener('load', resolve, { once: true });
    }
});

registerServiceWorker();

// Configure toast library:
toastr.options = {
    positionClass: 'toast-top-center',
    closeButton: false,
    progressBar: false,
    showDuration: 250,
    hideDuration: 250,
    timeOut: 4000,
    extendedTimeOut: 10000,
    showEasing: 'linear',
    hideEasing: 'linear',
    showMethod: 'fadeIn',
    hideMethod: 'fadeOut',
    escapeHtml: true,
    onHidden: function () {
        // If we have any dialog still open, the last "hidden" toastr will remove the toastr-container. We need to keep it alive inside the dialog though
        // so the toasts still show up inside there.
        fixToastrForDialogs();
    },
    onShown: function () {
        // Set tooltip to the notification message
        $(this).attr('title', t`轻触关闭`);
    },
};

const PROMPT_WORKER_TASK = 'prompt-assemble';

registerWorkerTask(PROMPT_WORKER_TASK, {
    script: 'prompt-worker.js',
    fallback: promptWorkerFallback,
});

export const characterGroupOverlay = new BulkEditOverlay();

// Markdown converter
export let mesForShowdownParse; //intended to be used as a context to compare showdown strings against
/** @type {import('showdown').Converter} */
export let converter;

// array for prompt token calculations

export const systemUserName = 'SillyTavern System';
export const neutralCharacterName = 'Assistant';
let default_user_name = 'User';
export let name1 = default_user_name;
export let name2 = systemUserName;
export let chat = [];
let chatSaveTimeout;
let importFlashTimeout;
export let isChatSaving = false;
let chat_create_date = '';
let firstRun = false;
let settingsReady = false;
let currentVersion = '0.0.0';
export let displayVersion = 'SillyTavern';

let generation_started = new Date();
/** @type {import('./scripts/char-data.js').v1CharData[]} */
export let characters = [];
/**
 * Stringified index of a currently chosen entity in the characters array.
 * @type {string|undefined} Yes, we hate it as much as you do.
 */
export let this_chid;
let saveCharactersPage = 0;
export const default_avatar = 'img/ai4.png';
export const system_avatar = 'img/five.png';
export const comment_avatar = 'img/quill.png';
export const default_user_avatar = 'img/user-default.png';
export let CLIENT_VERSION = 'SillyTavern:UNKNOWN:Cohee#1207'; // For Horde header
let optionsPopper = Popper.createPopper(document.getElementById('options_button'), document.getElementById('options'), {
    placement: 'top-start',
});
let exportPopper = Popper.createPopper(document.getElementById('export_button'), document.getElementById('export_format_popup'), {
    placement: 'left',
});
let isExportPopupOpen = false;

const chatInputSubmitHandlers = new Map();
const chatInputDraftHandlers = new Map();
let chatInputHandlerSeq = 0;
let chatInputDomTarget = null;

function getChatTextareaElement() {
    return /** @type {HTMLTextAreaElement|null} */ (document.getElementById('send_textarea'));
}

function getChatSendButtonElement() {
    return /** @type {HTMLButtonElement|null} */ (document.getElementById('send_but'));
}

function chatInputDomListener() {
    emitDraftChanged('dom');
}

function ensureChatInputDomListeners() {
    const textarea = getChatTextareaElement();
    if (!textarea) {
        return null;
    }

    if (chatInputDomTarget === textarea) {
        return textarea;
    }

    if (chatInputDomTarget) {
        chatInputDomTarget.removeEventListener('input', chatInputDomListener);
        chatInputDomTarget.removeEventListener('change', chatInputDomListener);
    }

    textarea.addEventListener('input', chatInputDomListener);
    textarea.addEventListener('change', chatInputDomListener);
    chatInputDomTarget = textarea;
    return textarea;
}

function emitDraftChanged(source, draftOverride) {
    const textarea = ensureChatInputDomListeners() ?? getChatTextareaElement();
    const draft = draftOverride !== undefined ? draftOverride : (textarea ? textarea.value ?? '' : '');
    const payload = { draft, source, textarea };

    for (const handler of chatInputDraftHandlers.values()) {
        try {
            handler(payload);
        } catch (error) {
            console.error('[SillyTavern.extensions] chat.input.onDraftChange 处理器执行失败', error);
        }
    }

    if (eventSource?.emit) {
        eventSource.emit(event_types.DRAFT_CHANGED, payload).catch((error) => {
            console.error('[SillyTavern.extensions] 无法派发 DRAFT_CHANGED', error);
        });
    }
}

function emitDraftSubmitted({ text, generateType, source, textarea }) {
    if (!eventSource?.emit) {
        return;
    }
    const payload = {
        text,
        generateType,
        source,
        textarea: textarea ?? getChatTextareaElement(),
    };
    eventSource.emit(event_types.DRAFT_SUBMITTED, payload).catch((error) => {
        console.error('[SillyTavern.extensions] 无法派发 DRAFT_SUBMITTED', error);
    });
}

function emitDraftReset({ source, textarea }) {
    if (!eventSource?.emit) {
        return;
    }
    const payload = {
        source,
        textarea: textarea ?? getChatTextareaElement(),
    };
    eventSource.emit(event_types.DRAFT_RESET, payload).catch((error) => {
        console.error('[SillyTavern.extensions] 无法派发 DRAFT_RESET', error);
    });
}

async function runChatInputSubmitPipeline({ text, generateType, source, textarea }) {
    ensureChatInputDomListeners();
    let draft = typeof text === 'string' ? text : (textarea ? textarea.value ?? '' : '');
    let type = generateType;

    for (const handler of chatInputSubmitHandlers.values()) {
        try {
            const outcome = await handler({
                text: draft,
                generateType: type,
                source,
                textarea: textarea ?? getChatTextareaElement(),
            });

            if (outcome === false) {
                return { canceled: true };
            }

            if (outcome && typeof outcome === 'object') {
                if (typeof outcome.text === 'string') {
                    draft = outcome.text;
                }
                if (outcome.generateType !== undefined) {
                    type = outcome.generateType;
                }
            }
        } catch (error) {
            console.error('[SillyTavern.extensions] chat.input.onSubmit 处理器执行失败', error);
        }
    }

    emitDraftSubmitted({
        text: draft,
        generateType: type,
        source,
        textarea: textarea ?? getChatTextareaElement(),
    });

    return { canceled: false, text: draft, generateType: type };
}

function createChatInputApi() {
    const getDraft = () => {
        const textarea = ensureChatInputDomListeners() ?? getChatTextareaElement();
        if (textarea) {
            return textarea.value ?? '';
        }
        const fallback = document.getElementById('send_textarea');
        return fallback && 'value' in fallback ? fallback.value : '';
    };

    const setDraft = (value, { append = false, caret = 'end', silent = false } = {}) => {
        const textarea = ensureChatInputDomListeners() ?? getChatTextareaElement();
        if (!textarea) {
            throw new Error('[SillyTavern.extensions] chat.input.setDraft: 未找到聊天输入框');
        }

        const incoming = value == null ? '' : String(value);
        const currentValue = textarea.value ?? '';
        const previousSelectionStart = textarea.selectionStart ?? currentValue.length;
        const previousSelectionEnd = textarea.selectionEnd ?? currentValue.length;
        const nextValue = append ? currentValue + incoming : incoming;

        textarea.value = nextValue;

        if (!silent) {
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            emitDraftChanged('api', nextValue);
        }

        let targetStart = nextValue.length;
        let targetEnd = nextValue.length;
        if (caret === 'start') {
            targetStart = 0;
            targetEnd = 0;
        } else if (caret === 'preserve') {
            targetStart = Math.min(previousSelectionStart, nextValue.length);
            targetEnd = Math.min(previousSelectionEnd, nextValue.length);
        } else if (typeof caret === 'number' && Number.isFinite(caret)) {
            const normalized = Math.max(0, Math.min(nextValue.length, Math.trunc(caret)));
            targetStart = normalized;
            targetEnd = normalized;
        }

        try {
            textarea.setSelectionRange(targetStart, targetEnd);
        } catch {
            // ignore selection errors
        }

        return nextValue;
    };

    const clearDraft = ({ focus = true, silent = false } = {}) => {
        const textarea = ensureChatInputDomListeners() ?? getChatTextareaElement();
        if (!textarea) {
            return false;
        }

        const hadValue = Boolean(textarea.value);
        textarea.value = '';

        if (!silent) {
            emitDraftReset({ source: 'api', textarea });
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            emitDraftChanged('api', '');
        }

        if (focus) {
            try {
                textarea.focus();
            } catch {
                // ignore
            }
        }

        return hadValue || !silent;
    };

    const focusInput = ({ selectAll = false, preventScroll = false } = {}) => {
        const textarea = ensureChatInputDomListeners() ?? getChatTextareaElement();
        if (!textarea) {
            return false;
        }

        try {
            textarea.focus({ preventScroll });
            if (selectAll) {
                textarea.select();
            }
            return true;
        } catch {
            return false;
        }
    };

    const registerDraftChange = (handler, { emitImmediately = false } = {}) => {
        if (typeof handler !== 'function') {
            throw new TypeError('[SillyTavern.extensions] chat.input.onDraftChange 需要提供函数');
        }
        const token = `draft-${++chatInputHandlerSeq}`;
        chatInputDraftHandlers.set(token, handler);
        ensureChatInputDomListeners();

        if (emitImmediately) {
            try {
                handler({
                    draft: getDraft(),
                    source: 'immediate',
                    textarea: getChatTextareaElement(),
                });
            } catch (error) {
                console.error('[SillyTavern.extensions] chat.input.onDraftChange immediate 回调失败', error);
            }
        }

        return Object.freeze({
            dispose() {
                return chatInputDraftHandlers.delete(token);
            },
        });
    };

    const registerSubmit = (handler) => {
        if (typeof handler !== 'function') {
            throw new TypeError('[SillyTavern.extensions] chat.input.onSubmit 需要提供函数');
        }
        const token = `submit-${++chatInputHandlerSeq}`;
        chatInputSubmitHandlers.set(token, handler);
        return Object.freeze({
            dispose() {
                return chatInputSubmitHandlers.delete(token);
            },
        });
    };

    const submit = async (options = {}) => {
        const textarea = ensureChatInputDomListeners() ?? getChatTextareaElement();
        if (!textarea) {
            throw new Error('[SillyTavern.extensions] chat.input.submit: 未找到聊天输入框');
        }

        let draftOverride;
        if (options.text !== undefined) {
            draftOverride = String(options.text ?? '');
            setDraft(draftOverride, {
                append: Boolean(options.append),
                caret: options.caret,
                silent: Boolean(options.silent),
            });
        }

        const result = await handleChatInputSubmission({
            source: typeof options.source === 'string' ? options.source : 'extension',
            draftOverride,
            generateTypeOverride: options.generateType,
        });

        if (options.focus ?? true) {
            focusInput({ preventScroll: Boolean(options.preventScroll), selectAll: Boolean(options.selectAll) });
        }

        return result;
    };

    const sendDraft = (options = {}) => submit({
        generateType: options.generateType,
        source: typeof options.source === 'string' ? options.source : 'extension',
        focus: options.focus,
        preventScroll: options.preventScroll,
        selectAll: options.selectAll,
    });

    return Object.freeze({
        getTextarea: () => ensureChatInputDomListeners() ?? getChatTextareaElement(),
        getSendButton: () => getChatSendButtonElement(),
        getDraft,
        setDraft,
        clearDraft,
        focus: focusInput,
        onDraftChange: registerDraftChange,
        onSubmit: registerSubmit,
        submit,
        sendDraft,
    });
}

/** @type {Map<string, { cancel: () => void }>} */
const panelTaskRegistry = new Map();

/**
 * Schedule a panel/UI refresh task, cancelling any previous pending task with the same key.
 * @param {string} key
 * @param {() => (void|Promise<void>)} task
 * @param {{ priority?: 'idle'|'animation'|'high'|'immediate', timeout?: number }} [options]
 */
function schedulePanelTask(key, task, { priority = 'idle', timeout = 500 } = {}) {
    cancelPanelTask(key);

    const runner = async () => {
        panelTaskRegistry.delete(key);
        try {
            await task();
        } catch (error) {
            console.error('面板任务执行失败', key, error);
        }
    };

    switch (priority) {
        case 'immediate': {
            runner();
            break;
        }
        case 'animation': {
            const handle = requestAnimationFrame(() => runner());
            panelTaskRegistry.set(key, { cancel: () => cancelAnimationFrame(handle) });
            break;
        }
        case 'high': {
            const handle = setTimeout(() => runner(), 0);
            panelTaskRegistry.set(key, { cancel: () => clearTimeout(handle) });
            break;
        }
        case 'idle':
        default: {
            if (typeof requestIdleCallback === 'function' && typeof cancelIdleCallback === 'function') {
                const handle = requestIdleCallback(() => runner(), { timeout });
                panelTaskRegistry.set(key, { cancel: () => cancelIdleCallback(handle) });
            } else {
                const handle = setTimeout(() => runner(), 16);
                panelTaskRegistry.set(key, { cancel: () => clearTimeout(handle) });
            }
            break;
        }
    }
}

/**
 * Cancel a scheduled panel task by key.
 * @param {string} key
 */
function cancelPanelTask(key) {
    const entry = panelTaskRegistry.get(key);
    if (entry?.cancel) {
        try {
            entry.cancel();
        } catch (error) {
            console.error('取消面板任务失败', key, error);
        }
    }
    panelTaskRegistry.delete(key);
}

// Saved here for performance reasons
const createMessageElement = (() => {
    const templateWrapper = document.getElementById('message_template');
    if (templateWrapper) {
        const template = document.createElement('template');
        template.innerHTML = templateWrapper.innerHTML.trim();
        return () => /** @type {HTMLElement} */ (template.content.firstElementChild.cloneNode(true));
    }
    console.warn('未找到 message_template，已回退为占位元素');
    return () => {
        const fallback = document.createElement('div');
        fallback.classList.add('mes');
        return fallback;
    };
})();
const chatElement = $('#chat');

const CHAT_OFFSCREEN_PLACEHOLDER_CLASS = 'st-chat-offscreen-placeholder';
const CHAT_OFFSCREEN_CONTENT_HIDDEN_CLASS = 'st-chat-offscreen-hidden';
const CHAT_OFFSCREEN_DATA_FLAG = 'data-offscreen-bound';

/** @type {OffscreenVisibilityManager|null} */
let chatOffscreenManager = null;
let chatOffscreenEnabled = false;
const chatOffscreenPlaceholderMap = new WeakMap();
const chatOffscreenPlaceholderSet = new Set();

const MANAGED_LAZY_ATTR = 'data-managed-lazy-image';
const MANAGED_LAZY_STATE_ATTR = 'data-lazy-state';
const MANAGED_LAZY_STATE_PENDING = 'pending';
const MANAGED_LAZY_STATE_LOADING = 'loading';
const MANAGED_LAZY_STATE_LOADED = 'loaded';

/** @type {WeakMap<HTMLImageElement, ManagedLazyImageMeta>} */
const chatLazyImageRegistry = new WeakMap();
/** @type {IntersectionObserver|null|undefined} */
let chatLazyImageObserver;

function shouldUseChatOffscreen() {
    if (!chatElement.length) {
        return false;
    }
    if (isVirtualizationEnabled()) {
        return false;
    }
    const settingEnabled = power_user?.offscreen_optimization !== false;
    return settingEnabled && (typeof IntersectionObserver === 'function');
}

function ensureChatOffscreenManager() {
    if (chatOffscreenManager) {
        return chatOffscreenManager;
    }
    if (!chatElement.length || typeof IntersectionObserver !== 'function') {
        return null;
    }
    chatOffscreenManager = new OffscreenVisibilityManager({
        root: chatElement[0],
        rootMargin: '128px 0px',
        threshold: 0,
        onLeave: handleChatOffscreenLeave,
        onEnter: handleChatOffscreenEnter,
        onDisconnect: cleanupChatOffscreenEntry,
    });
    return chatOffscreenManager;
}

/**
 * @returns {IntersectionObserver|null}
 */
function ensureChatLazyImageObserver() {
    if (typeof chatLazyImageObserver !== 'undefined') {
        return chatLazyImageObserver;
    }
    if (typeof IntersectionObserver !== 'function') {
        chatLazyImageObserver = null;
        return chatLazyImageObserver;
    }
    const observerRoot = chatElement?.[0] instanceof Element ? chatElement[0] : null;
    chatLazyImageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }
            if (entry.target instanceof HTMLImageElement) {
                revealManagedLazyImage(entry.target);
            }
        });
    }, {
        root: observerRoot,
        rootMargin: '256px 0px',
        threshold: 0.01,
    });
    return chatLazyImageObserver;
}

/**
 * @param {Element} element
 * @param {IntersectionObserver|null} observer
 * @returns {boolean}
 */
function isElementVisibleInObserverRoot(element, observer) {
    if (!(element instanceof Element)) {
        return false;
    }
    if (!observer) {
        return true;
    }
    const rect = element.getBoundingClientRect();
    if (!rect || (rect.width === 0 && rect.height === 0)) {
        return false;
    }
    if (observer.root instanceof Element) {
        const rootRect = observer.root.getBoundingClientRect();
        return rect.bottom >= rootRect.top && rect.top <= rootRect.bottom + 256;
    }
    const viewportHeight = globalThis.innerHeight || 0;
    return rect.bottom >= 0 && rect.top <= viewportHeight + 256;
}

/**
 * @param {HTMLImageElement} img
 * @param {string} src
 * @param {ManagedLazyImageOptions} [options]
 */
function registerChatLazyImage(img, src, options = {}) {
    if (!(img instanceof HTMLImageElement)) {
        return;
    }
    if (typeof src !== 'string' || src.length === 0) {
        return;
    }
    const normalizedSrc = src;
    const previousMeta = chatLazyImageRegistry.get(img) ?? null;
    const nextOptions = {
        allowSuspend: options.allowSuspend !== false,
        releaseOnSuspend: options.releaseOnSuspend === true,
        releaseOnCleanup: options.releaseOnCleanup === true,
        retryOnError: options.retryOnError !== false,
    };

    if (previousMeta && previousMeta.src === normalizedSrc) {
        previousMeta.options = nextOptions;
        if (previousMeta.loaded || previousMeta.loading) {
            return;
        }
        previousMeta.loading = false;
        previousMeta.loaded = false;
        previousMeta.failed = false;
    } else {
        if (previousMeta && typeof chatLazyImageObserver !== 'undefined' && chatLazyImageObserver) {
            chatLazyImageObserver.unobserve(img);
        }
        chatLazyImageRegistry.set(img, {
            src: normalizedSrc,
            loading: false,
            loaded: false,
            failed: false,
            options: nextOptions,
        });
    }

    img.setAttribute(MANAGED_LAZY_ATTR, '1');
    img.setAttribute(MANAGED_LAZY_STATE_ATTR, MANAGED_LAZY_STATE_PENDING);
    if (img.src) {
        img.removeAttribute('src');
    }

    const observer = ensureChatLazyImageObserver();
    if (!observer) {
        const meta = chatLazyImageRegistry.get(img);
        if (meta) {
            startLazyImageLoad(img, meta);
        }
        return;
    }

    observer.observe(img);
    const meta = chatLazyImageRegistry.get(img);
    if (meta && isElementVisibleInObserverRoot(img, observer)) {
        startLazyImageLoad(img, meta);
    }
}

/**
 * @param {HTMLImageElement} img
 * @returns {ManagedLazyImageMeta|null}
 */
function getManagedLazyImageMeta(img) {
    if (!(img instanceof HTMLImageElement)) {
        return null;
    }
    return chatLazyImageRegistry.get(img) ?? null;
}

/**
 * @param {HTMLImageElement} img
 * @param {ManagedLazyImageMeta} meta
 */
function startLazyImageLoad(img, meta) {
    if (!meta || meta.loading || meta.loaded) {
        return;
    }
    if (meta.failed && !meta.options.retryOnError) {
        return;
    }
    meta.loading = true;
    img.setAttribute(MANAGED_LAZY_STATE_ATTR, MANAGED_LAZY_STATE_LOADING);
    img.src = meta.src;
}

/**
 * @param {HTMLImageElement} img
 */
function revealManagedLazyImage(img) {
    const meta = getManagedLazyImageMeta(img);
    if (!meta) {
        return;
    }
    startLazyImageLoad(img, meta);
}

/**
 * @param {HTMLImageElement} img
 */
function suspendManagedLazyImage(img) {
    const meta = getManagedLazyImageMeta(img);
    if (!meta || !meta.options.allowSuspend || !meta.loaded) {
        return;
    }
    meta.loaded = false;
    meta.loading = false;
    img.setAttribute(MANAGED_LAZY_STATE_ATTR, MANAGED_LAZY_STATE_PENDING);
    if (meta.options.releaseOnSuspend && img.src && img.src.startsWith('blob:')) {
        try {
            URL.revokeObjectURL(img.src);
        } catch (error) {
            console.warn('释放对象 URL 失败', error);
        }
    }
    img.removeAttribute('src');
    const observer = ensureChatLazyImageObserver();
    observer?.observe(img);
}

/**
 * @param {HTMLImageElement} img
 */
function resumeManagedLazyImage(img) {
    const meta = getManagedLazyImageMeta(img);
    if (!meta || meta.loading || meta.loaded) {
        return;
    }
    const observer = ensureChatLazyImageObserver();
    if (!observer) {
        startLazyImageLoad(img, meta);
        return;
    }
    observer.observe(img);
    if (isElementVisibleInObserverRoot(img, observer)) {
        startLazyImageLoad(img, meta);
    }
}

/**
 * @param {HTMLImageElement} node
 * @returns {string}
 */
function resolveAvatarSource(node) {
    if (!(node instanceof HTMLImageElement)) {
        return '';
    }
    let src = node.getAttribute('data-avatar-src') || node.getAttribute('data-original-src') || node.getAttribute('src') || '';
    if (typeof src === 'string' && src.trim().length) {
        return src;
    }
    const messageRoot = node.closest('.mes');
    if (messageRoot instanceof HTMLElement) {
        const forceAvatar = messageRoot.getAttribute('force_avatar');
        if (forceAvatar && forceAvatar.trim().length) {
            return forceAvatar;
        }
        if (messageRoot.getAttribute('is_user') === 'true') {
            if (typeof user_avatar === 'string' && user_avatar.length) {
                return getThumbnailUrl('persona', user_avatar);
            }
            return default_user_avatar;
        }
        if (messageRoot.getAttribute('is_system') === 'true') {
            if (typeof system_avatar === 'string' && system_avatar.length) {
                return system_avatar;
            }
            return default_avatar;
        }
    }
    return default_avatar;
}

/**
 * @param {Element} root
 * @param {{ release?: boolean }} [options]
 */
function cleanupManagedLazyImages(root, { release = false } = {}) {
    if (!(root instanceof Element)) {
        return;
    }
    const nodes = root instanceof HTMLImageElement
        ? [root]
        : Array.from(root.querySelectorAll(`[${MANAGED_LAZY_ATTR}=\"1\"]`));
    nodes.forEach((node) => {
        if (!(node instanceof HTMLImageElement)) {
            return;
        }
        if (typeof chatLazyImageObserver !== 'undefined' && chatLazyImageObserver) {
            chatLazyImageObserver.unobserve(node);
        }
        const meta = chatLazyImageRegistry.get(node);
        if (meta && (release || meta.options.releaseOnCleanup) && node.src && node.src.startsWith('blob:')) {
            try {
                URL.revokeObjectURL(node.src);
            } catch (error) {
                console.warn('释放对象 URL 失败', error);
            }
        }
        chatLazyImageRegistry.delete(node);
        node.removeAttribute(MANAGED_LAZY_ATTR);
        node.removeAttribute(MANAGED_LAZY_STATE_ATTR);
        node.removeAttribute('data-managed-src');
    });
}

function refreshManagedChatAvatars() {
    forEachMountedMessage((_, element) => {
        if (!(element instanceof Element)) {
            return;
        }
        const avatar = element.querySelector('.avatar img');
        if (!(avatar instanceof HTMLImageElement)) {
            return;
        }
        const desiredSrc = resolveAvatarSource(avatar);
        if (!desiredSrc) {
            return;
        }
        avatar.setAttribute('data-avatar-src', desiredSrc);
        const meta = getManagedLazyImageMeta(avatar);
        if (meta) {
            if (meta.src !== desiredSrc) {
                meta.src = desiredSrc;
                meta.failed = false;
                meta.loaded = false;
                meta.loading = false;
                avatar.removeAttribute('src');
                startLazyImageLoad(avatar, meta);
            } else if (!avatar.getAttribute('src')) {
                startLazyImageLoad(avatar, meta);
            }
            return;
        }
        registerChatLazyImage(avatar, desiredSrc, {
            allowSuspend: false,
            releaseOnSuspend: false,
            releaseOnCleanup: false,
            retryOnError: true,
        });
    });
}

/**
 * @typedef {object} ManagedLazyImageOptions
 * @property {boolean} [allowSuspend]
 * @property {boolean} [releaseOnSuspend]
 * @property {boolean} [releaseOnCleanup]
 * @property {boolean} [retryOnError]
 */

/**
 * @typedef {object} ManagedLazyImageMeta
 * @property {string} src
 * @property {boolean} loading
 * @property {boolean} loaded
 * @property {boolean} failed
 * @property {ManagedLazyImageOptions} options
 */

/**
 * @param {Element} placeholder
 * @param {OffscreenEntryMeta} meta
 */
function handleChatOffscreenLeave(placeholder, meta = {}) {
    if (!chatOffscreenEnabled || !(placeholder instanceof Element)) {
        return;
    }
    const { content, virtual } = meta;
    if (!(content instanceof Element) || virtual) {
        return;
    }
    if (meta.detached) {
        return;
    }
    if (!placeholder.isConnected || !content.isConnected) {
        return;
    }
    const height = Math.max(1, Math.round(content.offsetHeight || content.getBoundingClientRect().height || meta.cachedHeight || 0));
    if (!height || !Number.isFinite(height)) {
        return;
    }
    content.querySelectorAll(`[${MANAGED_LAZY_ATTR}=\"1\"]`).forEach((node) => {
        if (node instanceof HTMLImageElement) {
            suspendManagedLazyImage(node);
        }
    });
    placeholder.style.height = `${height}px`;
    placeholder.classList.add(CHAT_OFFSCREEN_PLACEHOLDER_CLASS, 'active');
    content.style.display = 'none';
    content.classList.add(CHAT_OFFSCREEN_CONTENT_HIDDEN_CLASS);
    content.setAttribute('aria-hidden', 'true');
    chatOffscreenManager?.mergeMeta(placeholder, {
        detached: true,
        cachedHeight: height,
    });
}

/**
 * @param {Element} placeholder
 * @param {OffscreenEntryMeta} meta
 */
function handleChatOffscreenEnter(placeholder, meta = {}) {
    if (!(placeholder instanceof Element)) {
        return;
    }
    const { content } = meta;
    if (!(content instanceof Element)) {
        return;
    }

    if (meta.detached) {
        const parent = placeholder.parentNode;
        if (parent && content.parentNode !== parent) {
            parent.insertBefore(content, placeholder);
        }
        content.style.display = '';
        content.classList.remove(CHAT_OFFSCREEN_CONTENT_HIDDEN_CLASS);
        content.removeAttribute('aria-hidden');
        placeholder.classList.remove('active');
        placeholder.style.height = '0px';
        chatOffscreenManager?.mergeMeta(placeholder, { detached: false });
    }
    content.querySelectorAll(`[${MANAGED_LAZY_ATTR}=\"1\"]`).forEach((node) => {
        if (node instanceof HTMLImageElement) {
            resumeManagedLazyImage(node);
        }
    });
}

/**
 * @param {Element} placeholder
 */
function cleanupChatOffscreenEntry(placeholder) {
    if (!(placeholder instanceof Element)) {
        return;
    }
    const meta = chatOffscreenManager?.getMeta?.(placeholder);
    if (meta?.content instanceof Element) {
        cleanupManagedLazyImages(meta.content, { release: true });
    }
    placeholder.classList.remove('active');
    placeholder.style.height = '';
}

/**
 * @param {Element} element
 * @param {number} mesId
 * @param {{virtual?: boolean}} [options]
 */
function bindChatOffscreenForMessage(element, mesId, options = {}) {
    if (!(element instanceof Element)) {
        return;
    }
    const { virtual = false } = options ?? {};
    if (virtual || !shouldUseChatOffscreen()) {
        return;
    }
    const manager = ensureChatOffscreenManager();
    if (!manager) {
        return;
    }

    let placeholder = chatOffscreenPlaceholderMap.get(element);
    if (!placeholder || !placeholder.isConnected) {
        placeholder = document.createElement('div');
        placeholder.classList.add(CHAT_OFFSCREEN_PLACEHOLDER_CLASS);
        placeholder.dataset.mesid = Number.isInteger(mesId) ? String(mesId) : '';
        placeholder.style.height = '0px';
        if (element.parentNode) {
            element.parentNode.insertBefore(placeholder, element.nextSibling);
        }
        chatOffscreenPlaceholderMap.set(element, placeholder);
        chatOffscreenPlaceholderSet.add(placeholder);
    } else if (element.parentNode && placeholder.parentNode !== element.parentNode) {
        element.parentNode.insertBefore(placeholder, element.nextSibling);
    }

    element.setAttribute(CHAT_OFFSCREEN_DATA_FLAG, '1');
    manager.mergeMeta(placeholder, {
        content: element,
        placeholder,
        mesId,
        virtual: false,
        detached: false,
    });
    manager.track(placeholder, {
        content: element,
        placeholder,
        mesId,
        virtual: false,
        detached: false,
    });
}

/**
 * @param {Element} element
 */
function unbindChatOffscreenForMessage(element) {
    if (!(element instanceof Element)) {
        return;
    }
    const placeholder = chatOffscreenPlaceholderMap.get(element);
    if (!placeholder) {
        return;
    }
    chatOffscreenPlaceholderMap.delete(element);
    const manager = chatOffscreenManager;
    if (manager) {
        const meta = manager.getMeta(placeholder);
        if (meta?.content instanceof Element) {
            meta.content.style.display = '';
            meta.content.classList.remove(CHAT_OFFSCREEN_CONTENT_HIDDEN_CLASS);
            meta.content.removeAttribute('aria-hidden');
        }
        manager.untrack(placeholder);
    }
    chatOffscreenPlaceholderSet.delete(placeholder);
    cleanupManagedLazyImages(element, { release: true });
    if (placeholder.isConnected) {
        placeholder.remove();
    }
    element.classList.remove(CHAT_OFFSCREEN_CONTENT_HIDDEN_CLASS);
    element.style.display = '';
    element.removeAttribute('aria-hidden');
    element.removeAttribute(CHAT_OFFSCREEN_DATA_FLAG);
}

function disableChatOffscreen() {
    const manager = chatOffscreenManager;
    if (manager) {
        chatOffscreenPlaceholderSet.forEach((placeholder) => {
            const meta = manager.getMeta(placeholder);
            if (meta?.content instanceof Element) {
                meta.content.style.display = '';
                meta.content.classList.remove(CHAT_OFFSCREEN_CONTENT_HIDDEN_CLASS);
                meta.content.removeAttribute('aria-hidden');
                meta.content.removeAttribute(CHAT_OFFSCREEN_DATA_FLAG);
                meta.content.querySelectorAll(`[${MANAGED_LAZY_ATTR}=\"1\"]`).forEach((node) => {
                    if (node instanceof HTMLImageElement) {
                        resumeManagedLazyImage(node);
                    }
                });
                cleanupManagedLazyImages(meta.content);
                chatOffscreenPlaceholderMap.delete(meta.content);
            }
            manager.untrack(placeholder);
            if (placeholder.isConnected) {
                placeholder.remove();
            }
        });
    }
    chatOffscreenPlaceholderSet.clear();
    chatOffscreenEnabled = false;
}

function refreshChatOffscreenState({ rebind = false } = {}) {
    const manager = ensureChatOffscreenManager();
    const shouldEnable = shouldUseChatOffscreen();
    if (!shouldEnable || !manager?.isSupported()) {
        if (chatOffscreenEnabled) {
            disableChatOffscreen();
            manager?.setEnabled(false);
        }
        chatOffscreenEnabled = false;
        return;
    }

    chatOffscreenEnabled = true;
    manager.setEnabled(true);

    Array.from(chatOffscreenPlaceholderSet).forEach((placeholder) => {
        if (placeholder instanceof Element && !placeholder.isConnected) {
            const meta = manager.getMeta(placeholder);
            if (meta?.content instanceof Element) {
                chatOffscreenPlaceholderMap.delete(meta.content);
            }
            manager.untrack(placeholder);
            chatOffscreenPlaceholderSet.delete(placeholder);
        }
    });

    if (rebind || chatOffscreenPlaceholderSet.size === 0) {
        forEachMountedMessage((mesId, element) => {
            bindChatOffscreenForMessage(element, mesId, { virtual: false });
        });
    }
}

document.addEventListener(VIRTUALIZATION_DOM_EVENT_MOUNT, (event) => {
    const detail = event?.detail ?? {};
    const element = detail.element;
    const mesId = detail.mesId;
    const virtual = detail.virtual === true;
    if (!(element instanceof Element)) {
        return;
    }
    if (!chatOffscreenEnabled) {
        refreshChatOffscreenState();
    }
    bindChatOffscreenForMessage(element, mesId, { virtual });
});

document.addEventListener(VIRTUALIZATION_DOM_EVENT_UNMOUNT, (event) => {
    const element = event?.detail?.element;
    if (!(element instanceof Element)) {
        return;
    }
    unbindChatOffscreenForMessage(element);
});

eventSource.on(event_types.MORE_MESSAGES_LOADED, () => {
    if (!chatOffscreenEnabled) {
        return;
    }
    refreshChatOffscreenState();
});

eventSource.on(event_types.SETTINGS_LOADED_AFTER, () => {
    refreshChatOffscreenState({ rebind: true });
});

eventSource.on(event_types.SETTINGS_UPDATED, () => {
    if (!chatOffscreenEnabled) {
        return;
    }
    refreshChatOffscreenState();
});
eventSource.on(event_types.USER_AVATAR_UPDATED, () => {
    refreshManagedChatAvatars();
});
const chatRenderingEnv = {
    getChat: () => chat,
    getMessageIndex: (mes, currentChat) => {
        if (Array.isArray(currentChat)) {
            return currentChat.indexOf(mes);
        }
        return -1;
    },
    getCharacters: () => characters,
    getCurrentCharacterId: () => this_chid,
    getUserAvatar: () => user_avatar,
    getSystemAvatar: () => system_avatar,
    getDefaultAvatar: () => default_avatar,
    getThumbnailUrl: (type, file) => getThumbnailUrl(type, file),
    timestampToMoment,
    messageFormatting,
    formatGenerationTimer,
};

const CHAT_MIN_WINDOW = 2;
const CHAT_OVERSCAN = 10;
let chatVirtualList = null;
let chatRenderStart = 0;
const pendingVirtualMeasurements = new Map();
const pendingVirtualMutations = new Set();
let pendingVirtualListFrame = null;
let pendingVirtualMutationScheduled = false;
let pendingFinalizeFrame = null;
let pendingFinalizeScroll = false;

function flushVirtualListMeasurements() {
    if (!pendingVirtualMeasurements.size) {
        return;
    }
    if (!chatVirtualList) {
        pendingVirtualMeasurements.clear();
        return;
    }
    const entries = Array.from(pendingVirtualMeasurements.entries());
    pendingVirtualMeasurements.clear();
    entries.forEach(([id, payload]) => {
        const elementRef = payload.element ?? getMessageDom(id);
        if (!(elementRef instanceof Element)) {
            return;
        }
        try {
            chatVirtualList.scheduleMeasurement(id, elementRef);
        } catch (error) {
            console.warn('VirtualList scheduleMeasurement 执行失败', error);
        }
    });
}

function flushVirtualListMutations() {
    if (!pendingVirtualMutations.size) {
        return;
    }
    if (!chatVirtualList) {
        pendingVirtualMutations.clear();
        return;
    }
    const targets = Array.from(pendingVirtualMutations);
    pendingVirtualMutations.clear();
    targets.forEach((id) => {
        try {
            chatVirtualList.notifyItemMutated(id);
        } catch (error) {
            console.warn('VirtualList notifyItemMutated 执行失败', error);
        }
    });
}

function scheduleVirtualListMutationsFlush() {
    if (!pendingVirtualMutations.size) {
        return;
    }
    if (pendingVirtualMutationScheduled) {
        return;
    }
    pendingVirtualMutationScheduled = true;
    scheduleRenderTask(() => {
        pendingVirtualMutationScheduled = false;
        flushVirtualListMutations();
    }, 'pipeline');
}

function scheduleVirtualListFlush() {
    if (!pendingVirtualMeasurements.size && !pendingVirtualMutations.size) {
        return;
    }
    if (pendingVirtualListFrame !== null) {
        return;
    }
    const scheduler = typeof requestAnimationFrame === 'function'
        ? requestAnimationFrame
        : (cb) => setTimeout(cb, 16);
    pendingVirtualListFrame = scheduler(() => {
        pendingVirtualListFrame = null;
        flushVirtualListMeasurements();
        scheduleVirtualListMutationsFlush();
    });
}

function queueVirtualListUpdate(mesId, element = null, options = {}) {
    if (!chatVirtualList || !Number.isInteger(mesId) || mesId < 0) {
        return;
    }

    if (options.measure) {
        const record = pendingVirtualMeasurements.get(mesId) ?? { element: null };
        if (element instanceof Element) {
            record.element = element;
        }
        pendingVirtualMeasurements.set(mesId, record);
    } else if (element instanceof Element && pendingVirtualMeasurements.has(mesId)) {
        pendingVirtualMeasurements.get(mesId).element = element;
    }

    if (options.mutate) {
        pendingVirtualMutations.add(mesId);
    }

    scheduleVirtualListFlush();
}

/** @type {Map<number, Element>} */
const messageDomRegistry = new Map();

function sanitizeRegistryEntry(mesId) {
    const element = messageDomRegistry.get(mesId);
    if (element && !element.isConnected) {
        messageDomRegistry.delete(mesId);
        return null;
    }
    return element ?? null;
}

export function registerMessageDom(mesId, element) {
    if (!Number.isInteger(mesId) || mesId < 0 || !(element instanceof Element)) {
        return;
    }
    messageDomRegistry.set(mesId, element);
}

export function unregisterMessageDom(mesId, element) {
    if (!Number.isInteger(mesId) || mesId < 0) {
        return;
    }
    const existing = messageDomRegistry.get(mesId);
    if (!existing) {
        return;
    }
    if (!element || element === existing) {
        messageDomRegistry.delete(mesId);
    }
}

export function reassignMessageDomId(oldId, newId, element) {
    if (oldId === newId) {
        return;
    }
    unregisterMessageDom(oldId, element);
    registerMessageDom(newId, element ?? getMessageDom(newId));
}

export function rebuildMessageDomRegistry() {
    messageDomRegistry.clear();
    document.querySelectorAll('#chat .mes').forEach((element) => {
        const mesId = Number(element.getAttribute('mesid'));
        if (Number.isInteger(mesId) && mesId >= 0) {
            registerMessageDom(mesId, element);
        }
    });
}

if (typeof window !== 'undefined') {
    window.registerMessageDom = registerMessageDom;
    window.unregisterMessageDom = unregisterMessageDom;
    window.reassignMessageDomId = reassignMessageDomId;
    window.rebuildMessageDomRegistry = rebuildMessageDomRegistry;
}

export function getMessageDom(mesId) {
    const fromRegistry = sanitizeRegistryEntry(mesId);
    if (fromRegistry) {
        return fromRegistry;
    }
    const selector = `#chat .mes[mesid="${mesId}"]`;
    const queried = document.querySelector(selector);
    if (queried instanceof Element) {
        registerMessageDom(mesId, queried);
        return queried;
    }
    return null;
}

function forEachMountedMessage(callback) {
    if (typeof callback !== 'function') {
        return;
    }
    for (const [mesId, element] of Array.from(messageDomRegistry.entries())) {
        if (!element || !element.isConnected) {
            messageDomRegistry.delete(mesId);
            continue;
        }
        callback(mesId, element);
    }
}

function getMountedMessageIds() {
    forEachMountedMessage(() => {});
    return Array.from(messageDomRegistry.keys()).sort((a, b) => a - b);
}

function isVirtualizationEnabled() {
    const settings = globalThis?.power_user;
    if (settings && typeof settings === 'object' && 'enable_virtualization' in settings) {
        return settings.enable_virtualization !== false;
    }
    return true;
}

function destroyChatVirtualList() {
    if (chatVirtualList) {
        chatVirtualList.destroy();
        chatVirtualList = null;
    }
    messageDomRegistry.clear();
}

configureChatEvents({
    getMessageById: (id) => chat[id],
    registerMessageDom,
    unregisterMessageDom,
    releaseDynamicStylesFromElement,
    isVirtualizationEnabled,
});

function initChatVirtualList() {
    if (!isVirtualizationEnabled()) {
        destroyChatVirtualList();
        chatElement.find('#show_more_messages').remove();
        return;
    }

    if (chatVirtualList || !chatElement.length) {
        return;
    }
    chatVirtualList = new VirtualList({
        container: chatElement[0],
        getItemCount: () => chat.length,
        renderItem: chatRenderItem,
        getItemKey: (index) => String(index),
        estimatedItemHeight: 140,
        overscan: CHAT_OVERSCAN,
        useSpacers: false,
        onMount: handleVirtualMessageMount,
        onUnmount: handleVirtualMessageUnmount,
    });
}

function getChatWindowLimit() {
    const raw = Number(power_user.chat_truncation);
    if (!Number.isFinite(raw) || raw <= 0) {
        return chat.length;
    }
    return Math.max(CHAT_MIN_WINDOW, Math.round(raw));
}

function chatRenderItem(index) {
    const existing = getMessageDom(index);
    if (existing) {
        return existing;
    }
    const message = chat[index];
    if (!message) {
        return null;
    }
    return addOneMessage(message, { forceId: index, scroll: false, showSwipes: false, renderOnly: true }) ?? null;
}

function updateShowMoreButton() {
    const existing = chatElement.find('#show_more_messages');
    if (!isVirtualizationEnabled()) {
        const limit = getChatWindowLimit();
        if (chat.length > limit) {
            if (!existing.length) {
                chatElement.prepend('<div id="show_more_messages">展示更多消息</div>');
            }
        } else {
            existing.remove();
        }
        return;
    }

    if (!chatVirtualList) {
        existing.remove();
        return;
    }
    if (chatRenderStart > 0) {
        let button = existing;
        if (!button.length) {
            button = $('<div id="show_more_messages">展示更多消息</div>');
        }
        const container = chatElement[0];
        if (!container) {
            return;
        }
        let topSpacer = chatVirtualList.topSpacer;
        if (!topSpacer || topSpacer.parentNode !== container) {
            if (typeof chatVirtualList.ensureSpacers === 'function') {
                chatVirtualList.ensureSpacers();
                topSpacer = chatVirtualList.topSpacer;
            }
        }
        const anchor = topSpacer?.parentNode === container ? topSpacer : container.firstChild;
        const buttonNode = button[0];
        if (!buttonNode) {
            return;
        }
        if (buttonNode.parentNode !== container) {
            container.insertBefore(buttonNode, anchor ?? null);
        } else if (anchor && buttonNode.nextSibling !== anchor) {
            container.insertBefore(buttonNode, anchor);
        }
    } else {
        existing.remove();
    }
}

function syncChatVirtualWindow() {
    if (!isVirtualizationEnabled()) {
        destroyChatVirtualList();
        return;
    }
    if (!chatVirtualList) {
        return;
    }
    chatVirtualList.setDataLength(chat.length);
    const limit = getChatWindowLimit();
    if (limit >= chat.length) {
        chatRenderStart = 0;
    } else {
        chatRenderStart = Math.max(0, Math.min(chatRenderStart, chat.length - limit));
    }
    updateShowMoreButton();
    chatVirtualList.setWindow(chatRenderStart, chat.length);
}

function updateChatWindowAfterAppend(type, insertAfter, insertBefore, forceId) {
    if (!isVirtualizationEnabled() || !chatVirtualList || type === 'swipe') {
        return;
    }
    chatVirtualList.setDataLength(chat.length);
    const limit = getChatWindowLimit();
    if (limit >= chat.length) {
        chatRenderStart = 0;
    } else if (insertAfter !== null || insertBefore !== null) {
        const anchor = typeof forceId === 'number' ? forceId : chat.length - 1;
        const candidate = Math.max(0, anchor - limit + 1);
        chatRenderStart = Math.max(0, Math.min(chatRenderStart, candidate));
    } else {
        chatRenderStart = Math.max(0, chat.length - limit);
    }
    updateShowMoreButton();
    chatVirtualList.setWindow(chatRenderStart, chat.length);
}

function finalizeChatRender({ shouldScroll = true } = {}) {
    pendingFinalizeScroll = pendingFinalizeScroll || shouldScroll;
    if (pendingFinalizeFrame !== null) {
        return;
    }

    const scheduler = typeof requestAnimationFrame === 'function'
        ? requestAnimationFrame
        : (cb) => setTimeout(cb, 16);

    pendingFinalizeFrame = scheduler(() => {
        pendingFinalizeFrame = null;
        const messages = chatElement.find('.mes');
        messages.removeClass('last_mes');
        messages.last().addClass('last_mes');
        hideSwipeButtons();
        showSwipeButtons();
        applyStylePins();
        if (pendingFinalizeScroll) {
            scrollChatToBottom();
        }
        pendingFinalizeScroll = false;
    });
}

addManagedEventListener(window, 'virtualization-toggle', (event) => {
    const enabled = event?.detail?.enabled ?? isVirtualizationEnabled();
    flushRenderTasks();
    const tasks = [];

    if (enabled) {
        initChatVirtualList();
        initRightPanelVirtualList();
        initLeftPanelVirtualization();
    } else {
        destroyChatVirtualList();
        chatElement.find('#show_more_messages').remove();
        destroyRightPanelVirtualList();
        destroyLeftPanelVirtualization();
    }

    tasks.push(Promise.resolve(printMessages()).catch(console.error));
    tasks.push(Promise.resolve(printCharacters(true)).catch(console.error));

    Promise.allSettled(tasks).finally(() => {
        refreshChatOffscreenState({ rebind: true });
        refreshLeftPanelVirtualization();
        document.dispatchEvent(new CustomEvent('virtualization-toggle-complete', { detail: { enabled } }));
    });
});

initChatVirtualList();
refreshChatOffscreenState({ rebind: true });

const RIGHT_PANEL_CONTAINER_SELECTOR = '#rm_print_characters_block';
const RIGHT_PANEL_META_BACK_KEY = 'meta:back';
const RIGHT_PANEL_META_EMPTY_KEY = 'meta:empty';
const RIGHT_PANEL_META_HIDDEN_KEY = 'meta:hidden';
const RIGHT_PANEL_CHARACTER_PREFIX = 'character:';
const RIGHT_PANEL_GROUP_PREFIX = 'group:';
const RIGHT_PANEL_TAG_PREFIX = 'tag:';
const RIGHT_PANEL_VIRTUALIZE_THRESHOLD = 30;

/** @type {VirtualList|null} */
let rightPanelVirtualList = null;
/** @type {RightPanelVirtualItem[]} */
let rightPanelVirtualEntities = [];
const rightPanelDomRegistry = new Map();
const rightPanelIndexByKey = new Map();
const rightPanelCharacterIndexById = new Map();
const rightPanelGroupIndexById = new Map();
/** @type {Map<string, Set<(element: HTMLElement|null) => void>>} */
const rightPanelMountWaiters = new Map();
let rightPanelLastRenderWasVirtualized = false;

/**
 * @typedef {object} RightPanelVirtualItem
 * @property {'character'|'group'|'tag'|'back'|'empty'|'hidden'} type
 * @property {string} key
 * @property {number|string|undefined} [id]
 * @property {Entity} [entity]
 * @property {() => HTMLElement|null} render
 */

function getRightPanelContainerElement() {
    return /** @type {HTMLElement|null} */ (document.querySelector(RIGHT_PANEL_CONTAINER_SELECTOR));
}

function getRightPanelOverscan() {
    if (document.body.classList.contains('charListGrid')) {
        return 8;
    }
    return 5;
}

function getRightPanelEstimatedHeight() {
    if (document.body.classList.contains('charListGrid')) {
        return 180;
    }
    if (document.body.classList.contains('big-avatars')) {
        return 150;
    }
    return 120;
}

function registerRightPanelDom(key, element) {
    if (!key || !element) {
        return;
    }
    rightPanelDomRegistry.set(key, element);
    const waiters = rightPanelMountWaiters.get(key);
    if (waiters && waiters.size) {
        for (const resolve of Array.from(waiters)) {
            try {
                resolve(element);
            } catch (error) {
                console.error('rightPanelMount waiter failed', error);
            }
        }
        rightPanelMountWaiters.delete(key);
    }
}

function unregisterRightPanelDom(key, element) {
    if (!key) {
        return;
    }
    const current = rightPanelDomRegistry.get(key);
    if (element && current && current !== element) {
        return;
    }
    rightPanelDomRegistry.delete(key);
}

function rightPanelRenderItem(index) {
    const descriptor = rightPanelVirtualEntities[index];
    if (!descriptor) {
        return null;
    }
    try {
        return descriptor.render?.() ?? null;
    } catch (error) {
        console.error('渲染右侧面板虚拟项失败', descriptor, error);
        return null;
    }
}

function handleRightPanelItemMount(index, element) {
    const descriptor = rightPanelVirtualEntities[index];
    if (!descriptor || !element) {
        return;
    }
    registerRightPanelDom(descriptor.key, element);
    if (descriptor.type === 'character' && $('#rm_print_characters_block').hasClass('bulk_select')) {
        ensureBulkCheckboxForElement(element);
    }
}

function handleRightPanelItemUnmount(index, element) {
    const descriptor = rightPanelVirtualEntities[index];
    if (!descriptor) {
        return;
    }
    unregisterRightPanelDom(descriptor.key, element);
}

function initRightPanelVirtualList() {
    if (!isVirtualizationEnabled()) {
        destroyRightPanelVirtualList();
        return;
    }
    if (rightPanelVirtualList) {
        return;
    }
    const container = getRightPanelContainerElement();
    if (!container) {
        return;
    }
    rightPanelVirtualList = new VirtualList({
        container,
        getItemCount: () => rightPanelVirtualEntities.length,
        renderItem: rightPanelRenderItem,
        getItemKey: (index) => rightPanelVirtualEntities[index]?.key ?? String(index),
        estimatedItemHeight: getRightPanelEstimatedHeight(),
        overscan: getRightPanelOverscan(),
        useSpacers: true,
        onMount: handleRightPanelItemMount,
        onUnmount: handleRightPanelItemUnmount,
    });
    rightPanelVirtualList.bindScrollElement(container);
    rightPanelVirtualList.attachScrollHandler();
}

function destroyRightPanelVirtualList() {
    if (rightPanelVirtualList) {
        rightPanelVirtualList.destroy();
        rightPanelVirtualList = null;
    }
    rightPanelVirtualEntities = [];
    rightPanelDomRegistry.clear();
    rightPanelIndexByKey.clear();
    rightPanelCharacterIndexById.clear();
    rightPanelGroupIndexById.clear();
    rightPanelMountWaiters.clear();
    rightPanelLastRenderWasVirtualized = false;
}

function setRightPanelVirtualItems(items, { restoreScrollTop } = {}) {
    rightPanelVirtualEntities = items;
    rightPanelIndexByKey.clear();
    rightPanelCharacterIndexById.clear();
    rightPanelGroupIndexById.clear();
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        rightPanelIndexByKey.set(item.key, i);
        if (item.type === 'character' && item.id !== undefined) {
            rightPanelCharacterIndexById.set(String(item.id), i);
        }
        if (item.type === 'group' && item.id !== undefined) {
            rightPanelGroupIndexById.set(String(item.id), i);
        }
    }
    if (rightPanelVirtualList) {
        rightPanelVirtualList.setDataLength(items.length);
        rightPanelVirtualList.refresh();
    }
    const container = getRightPanelContainerElement();
    if (container && typeof restoreScrollTop === 'number') {
        container.scrollTop = restoreScrollTop;
    }
}

function ensureBulkCheckboxForElement(element) {
    if (!(element instanceof HTMLElement)) {
        return;
    }
    if (!element.classList.contains('character_select')) {
        return;
    }
    if (element.querySelector('.bulk_select_checkbox')) {
        return;
    }
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'bulk_select_checkbox';
    checkbox.addEventListener('click', (event) => {
        event.stopImmediatePropagation();
    });
    element.prepend(checkbox);
}

async function ensureRightPanelEntityVisibleByKey(key, { align = 'nearest', timeout = 500 } = {}) {
    if (!key) {
        return null;
    }
    const existing = rightPanelDomRegistry.get(key);
    if (existing?.isConnected) {
        return existing;
    }
    const index = rightPanelIndexByKey.get(key);
    if (index === undefined) {
        return null;
    }
    initRightPanelVirtualList();
    const container = getRightPanelContainerElement();
    if (!container) {
        return null;
    }
    if (rightPanelVirtualList) {
        const mode = align === 'center' || align === 'end' ? align : 'start';
        rightPanelVirtualList.scrollToIndex(index, mode);
    }
    return await new Promise((resolve) => {
        const waiters = rightPanelMountWaiters.get(key) ?? new Set();
        waiters.add(resolve);
        rightPanelMountWaiters.set(key, waiters);
        setTimeout(() => {
            if (waiters.delete(resolve) && waiters.size === 0) {
                rightPanelMountWaiters.delete(key);
            }
            resolve(rightPanelDomRegistry.get(key) ?? null);
        }, timeout);
    });
}

export async function ensureCharacterCardVisible(characterIndex, { align = 'nearest', timeout = 500 } = {}) {
    const key = RIGHT_PANEL_CHARACTER_PREFIX + String(characterIndex);
    const element = await ensureRightPanelEntityVisibleByKey(key, { align, timeout });
    if (!element) {
        return document.getElementById(`CharID${characterIndex}`);
    }
    return element;
}

export function getCharacterCardDom(characterIndex) {
    const key = RIGHT_PANEL_CHARACTER_PREFIX + String(characterIndex);
    const element = rightPanelDomRegistry.get(key);
    if (element?.isConnected) {
        return element;
    }
    return document.getElementById(`CharID${characterIndex}`);
}

export function hasCharacterCardInVirtualList(characterIndex) {
    return rightPanelCharacterIndexById.has(String(characterIndex));
}

export async function ensureGroupCardVisible(groupId, { align = 'nearest', timeout = 500 } = {}) {
    const key = RIGHT_PANEL_GROUP_PREFIX + String(groupId);
    const element = await ensureRightPanelEntityVisibleByKey(key, { align, timeout });
    if (element) {
        return element;
    }
    const escapedGrid = (typeof CSS !== 'undefined' && typeof CSS.escape === 'function')
        ? CSS.escape(String(groupId))
        : String(groupId).replace(/"/g, '\\"');
    return document.querySelector(`#rm_print_characters_block [grid="${escapedGrid}"]`);
}

export function getGroupCardDom(groupId) {
    const key = RIGHT_PANEL_GROUP_PREFIX + String(groupId);
    const element = rightPanelDomRegistry.get(key);
    if (element?.isConnected) {
        return element;
    }
    const escapedGrid = (typeof CSS !== 'undefined' && typeof CSS.escape === 'function')
        ? CSS.escape(String(groupId))
        : String(groupId).replace(/"/g, '\\"');
    return document.querySelector(`#rm_print_characters_block [grid="${escapedGrid}"]`);
}

export function hasGroupCardInVirtualList(groupId) {
    return rightPanelGroupIndexById.has(String(groupId));
}

const LEFT_PANEL_CONTAINER_SELECTORS = ['#ai_response_configuration', '#AdvancedFormatting'];
const LEFT_PANEL_CACHE_ATTRIBUTE = 'data-left-panel-virtual-cache';
const LEFT_PANEL_WRAPPER_ATTRIBUTE = 'data-left-panel-wrapper';
const LEFT_PANEL_KEY_ATTRIBUTE = 'data-left-panel-key';
const LEFT_PANEL_VIRTUALIZED_ATTRIBUTE = 'data-left-panel-virtualized';
const LEFT_PANEL_VIRTUALIZE_THRESHOLD = 6;
const LEFT_PANEL_DEFAULT_OVERSCAN = 4;
const leftPanelVirtualizers = new Map();
let leftPanelKeyCounter = 0;
let leftPanelRefreshScheduled = false;
let leftPanelTokenRefreshScheduled = false;

function scheduleLeftPanelTokenRefresh() {
    if (leftPanelTokenRefreshScheduled) {
        return;
    }
    leftPanelTokenRefreshScheduled = true;
    const scheduler = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : (cb) => setTimeout(cb, 16);
    scheduler(() => {
        leftPanelTokenRefreshScheduled = false;
        try {
            if (typeof forceCharacterEditorTokenize === 'function') {
                forceCharacterEditorTokenize();
            }
        } catch (error) {
            console.debug('左侧面板词符计数刷新失败', error);
        }
    });
}

function getLeftPanelScrollable(container) {
    return container?.closest('.scrollableInner') ?? null;
}

function ensureLeftPanelCache(container) {
    const scrollable = getLeftPanelScrollable(container);
    if (!scrollable) {
        return null;
    }
    let cache = scrollable.querySelector(`[${LEFT_PANEL_CACHE_ATTRIBUTE}=\"true\"]`);
    if (!(cache instanceof HTMLElement)) {
        cache = document.createElement('div');
        cache.style.display = 'none';
        cache.style.width = '100%';
        cache.setAttribute(LEFT_PANEL_CACHE_ATTRIBUTE, 'true');
        scrollable.insertBefore(cache, container);
    }
    return cache;
}

function createLeftPanelWrapper(key) {
    const wrapper = document.createElement('div');
    wrapper.className = 'left-panel-virtual-wrapper';
    wrapper.setAttribute(LEFT_PANEL_WRAPPER_ATTRIBUTE, key);
    wrapper.style.width = '100%';
    wrapper.style.position = 'relative';
    return wrapper;
}

function createLeftPanelDescriptor(element) {
    if (!(element instanceof HTMLElement)) {
        return null;
    }
    const existingKey = element.getAttribute(LEFT_PANEL_KEY_ATTRIBUTE);
    const key = existingKey || (element.id ? `id:${element.id}` : `auto:${++leftPanelKeyCounter}`);
    if (!existingKey) {
        element.setAttribute(LEFT_PANEL_KEY_ATTRIBUTE, key);
    }
    const wrapper = createLeftPanelWrapper(key);
    return { key, element, wrapper };
}

function mountLeftPanelItem(descriptor) {
    if (!descriptor?.element || !descriptor.wrapper) {
        return null;
    }
    const { element, wrapper, key } = descriptor;
    if (element.parentNode !== wrapper) {
        wrapper.appendChild(element);
    }
    element.style.removeProperty('display');
    element.removeAttribute('aria-hidden');
    element.setAttribute(LEFT_PANEL_VIRTUALIZED_ATTRIBUTE, 'mounted');
    wrapper.dataset.leftPanelItem = key;
    element.dispatchEvent(new CustomEvent('left-panel-virtualized-mount', { bubbles: false, detail: { key } }));
    if (typeof window.$ === 'function') {
        window.$(element).triggerHandler('leftPanelVirtualMount');
    }
    scheduleLeftPanelTokenRefresh();
    return wrapper;
}

function unmountLeftPanelItem(descriptor, cache) {
    if (!descriptor?.element || !(cache instanceof HTMLElement)) {
        return;
    }
    const { element, key } = descriptor;
    cache.appendChild(element);
    element.style.display = 'none';
    element.setAttribute('aria-hidden', 'true');
    element.setAttribute(LEFT_PANEL_VIRTUALIZED_ATTRIBUTE, 'parked');
    element.dispatchEvent(new CustomEvent('left-panel-virtualized-unmount', { bubbles: false, detail: { key } }));
    if (typeof window.$ === 'function') {
        window.$(element).triggerHandler('leftPanelVirtualUnmount');
    }
}

function estimateLeftPanelHeight(descriptors) {
    let sampleCount = 0;
    let totalHeight = 0;
    for (const descriptor of descriptors) {
        if (descriptor?.element instanceof HTMLElement) {
            const rect = descriptor.element.getBoundingClientRect();
            if (rect.height > 0) {
                totalHeight += rect.height;
                sampleCount++;
            }
        }
        if (sampleCount >= 4) {
            break;
        }
    }
    if (sampleCount === 0) {
        return 320;
    }
    const average = totalHeight / sampleCount;
    return Math.min(Math.max(Math.round(average) || 320, 220), 520);
}

function ensureLeftPanelVirtualizer(container) {
    if (!(container instanceof HTMLElement)) {
        return;
    }
    if (!isVirtualizationEnabled()) {
        return;
    }
    if (leftPanelVirtualizers.has(container)) {
        const record = leftPanelVirtualizers.get(container);
        record?.virtualList?.setDataLength(record.descriptors.length);
        record?.virtualList?.refresh();
        return;
    }
    if (container.getAttribute('data-left-panel-virtualization') === 'disabled') {
        return;
    }

    try {
        const initialChildren = Array.from(container.children).filter(
            (child) => child instanceof HTMLElement && child.getAttribute('data-virtual-spacer') !== 'top' && child.getAttribute('data-virtual-spacer') !== 'bottom',
        );

        if (initialChildren.length < LEFT_PANEL_VIRTUALIZE_THRESHOLD) {
            return;
        }

        const cache = ensureLeftPanelCache(container);
        if (!cache) {
            return;
        }

        const descriptors = [];
        for (const child of initialChildren) {
            const descriptor = createLeftPanelDescriptor(child);
            if (!descriptor) {
                continue;
            }
            descriptors.push(descriptor);
            cache.appendChild(child);
            child.style.display = 'none';
            child.setAttribute('aria-hidden', 'true');
            child.setAttribute(LEFT_PANEL_VIRTUALIZED_ATTRIBUTE, 'parked');
        }

        const estimatedHeight = estimateLeftPanelHeight(descriptors);
        const virtualList = new VirtualList({
            container,
            getItemCount: () => descriptors.length,
            renderItem: (index) => mountLeftPanelItem(descriptors[index]),
            getItemKey: (index) => descriptors[index]?.key ?? String(index),
            estimatedItemHeight: estimatedHeight,
            overscan: LEFT_PANEL_DEFAULT_OVERSCAN,
            useSpacers: true,
            onUnmount: (index) => {
                const descriptor = descriptors[index];
                if (!descriptor) {
                    return;
                }
                unmountLeftPanelItem(descriptor, cache);
            },
        });

        const scrollable = getLeftPanelScrollable(container);
        if (scrollable) {
            virtualList.bindScrollElement(scrollable);
        }
        virtualList.attachScrollHandler();

        const record = {
            container,
            cache,
            descriptors,
            virtualList,
            scrollable,
        };

        leftPanelVirtualizers.set(container, record);
        container.setAttribute('data-left-panel-virtualization', 'enabled');
        queueLeftPanelRefresh();
    } catch (error) {
        console.error('左侧面板虚拟化初始化失败', error);
        destroyLeftPanelVirtualization();
        container.setAttribute('data-left-panel-virtualization', 'disabled');
    }
}

function initLeftPanelVirtualization() {
    if (!isVirtualizationEnabled()) {
        destroyLeftPanelVirtualization();
        return;
    }
    for (const selector of LEFT_PANEL_CONTAINER_SELECTORS) {
        const container = document.querySelector(selector);
        if (!container) {
            continue;
        }
        ensureLeftPanelVirtualizer(container);
    }
}

function destroyLeftPanelVirtualization({ restore = true } = {}) {
    for (const [container, record] of Array.from(leftPanelVirtualizers.entries())) {
        if (!record) {
            leftPanelVirtualizers.delete(container);
            continue;
        }
        for (const descriptor of record.descriptors) {
            unmountLeftPanelItem(descriptor, record.cache);
        }
        record.virtualList?.destroy();

        if (restore) {
        for (const descriptor of record.descriptors) {
            if (!descriptor?.element) {
                continue;
            }
            descriptor.element.style.removeProperty('display');
            descriptor.element.removeAttribute('aria-hidden');
            descriptor.element.setAttribute(LEFT_PANEL_VIRTUALIZED_ATTRIBUTE, 'restored');
            container.appendChild(descriptor.element);
        }
        scheduleLeftPanelTokenRefresh();
    }

    if (record.cache?.getAttribute(LEFT_PANEL_CACHE_ATTRIBUTE) === 'true' && !record.cache.childElementCount) {
        record.cache.remove();
    }

        leftPanelVirtualizers.delete(container);
        container.setAttribute('data-left-panel-virtualization', 'idle');
    }
}

function queueLeftPanelRefresh() {
    if (leftPanelRefreshScheduled) {
        return;
    }
    leftPanelRefreshScheduled = true;
    requestAnimationFrame(() => {
        leftPanelRefreshScheduled = false;
        for (const record of leftPanelVirtualizers.values()) {
            record?.virtualList?.setDataLength(record.descriptors.length);
            record?.virtualList?.refresh();
        }
    });
}

function refreshLeftPanelVirtualization() {
    queueLeftPanelRefresh();
}

let leftPanelSyncBound = false;
function bindLeftPanelVirtualizationWatchers() {
    if (leftPanelSyncBound) {
        return;
    }
    leftPanelSyncBound = true;
    addManagedEventListener(window, 'resize', throttle(() => queueLeftPanelRefresh(), 150));
    const drawer = document.getElementById('left-nav-panel');
    if (drawer) {
        drawer.addEventListener('transitionend', (event) => {
            if (event.propertyName === 'transform' || event.propertyName === 'width') {
                queueLeftPanelRefresh();
            }
        });
    }
}

let dialogueResolve = null;
let dialogueCloseStop = false;
export let chat_metadata = {};
/** @type {StreamingProcessor} */
export let streamingProcessor = null;
export let lastChatLoadFresh = false;
let crop_data = undefined;
let is_delete_mode = false;
let fav_ch_checked = false;
let scrollLock = false;
export let abortStatusCheck = new AbortController();
export let charDragDropHandler = null;

/** @type {debounce_timeout} The debounce timeout used for chat/settings save. debounce_timeout.long: 1.000 ms */
export const DEFAULT_SAVE_EDIT_TIMEOUT = debounce_timeout.relaxed;
/** @type {debounce_timeout} The debounce timeout used for printing. debounce_timeout.quick: 100 ms */
export const DEFAULT_PRINT_TIMEOUT = debounce_timeout.quick;

export const saveSettingsDebounced = debounce((loopCounter = 0) => saveSettings(loopCounter), DEFAULT_SAVE_EDIT_TIMEOUT);
defineSaveScheduler('global-settings', {
    panelId: 'global-settings',
    triggers: ['global-settings'],
    strategy: 'raf',
});
const queueGlobalSettingsSave = createSaveScheduler('global-settings', () => createPanelSaveScheduler(() => saveSettingsDebounced()));
export const saveCharacterDebounced = debounce(() => $('#create_button').trigger('click'), DEFAULT_SAVE_EDIT_TIMEOUT);

const ensureActiveCharacterVariables = () => {
    if (this_chid === undefined || !characters[this_chid]) {
        throw new Error('当前没有选中的角色，无法访问角色变量');
    }

    const character = characters[this_chid];
    if (!character.data || typeof character.data !== 'object') {
        character.data = character.data ?? {};
    }
    if (!character.data.extensions || typeof character.data.extensions !== 'object') {
        character.data.extensions = {};
    }
    if (!character.data.extensions.variables || typeof character.data.extensions.variables !== 'object') {
        character.data.extensions.variables = {};
    }

    return {
        characterId: character.avatar ?? String(this_chid),
        store: character.data.extensions.variables,
    };
};

const ensureScriptVariablesContext = (options = {}) => {
    const rawScriptId = options?.scriptId ?? options?.script_id;
    if (rawScriptId === undefined || rawScriptId === null) {
        throw new Error('脚本变量操作需要提供 script_id');
    }
    const scriptId = String(rawScriptId);

    if (!extension_settings.variables || typeof extension_settings.variables !== 'object') {
        extension_settings.variables = { global: {}, scripts: {} };
    } else if (!extension_settings.variables.global || typeof extension_settings.variables.global !== 'object') {
        extension_settings.variables.global = {};
    }

    if (!extension_settings.variables.scripts || typeof extension_settings.variables.scripts !== 'object') {
        extension_settings.variables.scripts = {};
    }

    if (!extension_settings.variables.scripts[scriptId] || typeof extension_settings.variables.scripts[scriptId] !== 'object') {
        extension_settings.variables.scripts[scriptId] = {};
    }

    return {
        scriptId,
        store: extension_settings.variables.scripts[scriptId],
    };
};

const listScriptVariableStores = () => {
    const scripts = extension_settings.variables?.scripts;
    if (!scripts || typeof scripts !== 'object') {
        return {};
    }
    return scripts;
};

export const variableService = createVariableService({
    getChat: () => chat,
    getChatMetadata: () => chat_metadata,
    getExtensionSettings: () => extension_settings,
    markChatDirty: () => {
        chat_metadata['tainted'] = true;
        saveChatDebounced();
    },
    persistChatMetadata: () => saveMetadataDebounced(),
    persistGlobalVariables: () => saveSettingsDebounced(),
    getCharacterStore: () => ensureActiveCharacterVariables(),
    persistCharacterVariables: () => saveCharacterDebounced(),
    getScriptStore: (options = {}) => ensureScriptVariablesContext(options),
    persistScriptVariables: () => saveSettingsDebounced(),
    listScriptStores: () => listScriptVariableStores(),
    getVariableMonitoringConfig: () => variableMonitoringConfig,
});

sillyTavernRoot.variableService = variableService;

export function getVariableMonitoringConfig() {
    return { ...variableMonitoringConfig };
}

export function applyVariableMonitoringConfig(config = {}) {
    variableMonitoringConfig = normalizeVariableMonitoringConfig(config);
    if (typeof variableService?.refreshMonitoringConfig === 'function') {
        variableService.refreshMonitoringConfig();
    }
}

const SHOWDOWN_CACHE_LIMIT = 50;
const SHOWDOWN_CACHE_THRESHOLD = 2048;
let showdownHtmlCache = new Map();

const RENDER_SPLIT_THRESHOLD = 12000;
const BODY_POINTER_THROTTLE_MS = 40;
const dynamicStyleRegistry = new Map();
const DYNAMIC_STYLE_ANCHOR_SELECTOR = 'meta[data-st-dynamic-style-anchor="true"]';
const EXTERNAL_STYLE_ANCHOR_SELECTOR = 'meta[data-st-external-style-anchor="true"]';
let dynamicStyleAnchor = null;
let externalStyleAnchor = null;
const LARGE_TEMPLATE_THRESHOLD = 50000;
const LARGE_TEMPLATE_MAX_RETRIES = 3;
const LARGE_TEMPLATE_RETRY_DELAY_MS = 48;
const LARGE_TEMPLATE_CACHE_LIMIT_BYTES = 5 * 1024 * 1024;
const largeTemplateCache = new Map();
let largeTemplateCacheSizeBytes = 0;

export const EXTERNAL_IMPORT_DEFAULT_PRIORITY = 10;
const externalImportQueue = new Map();
const externalImportRegistry = new Set();
let externalImportScheduled = false;

const renderPipelineStages = [];

const SUPPORTS_PRELOAD = (() => {
    try {
        if (typeof document === 'undefined') {
            return false;
        }
        const testLink = document.createElement('link');
        return !!testLink.relList && typeof testLink.relList.supports === 'function'
            && testLink.relList.supports('preload');
    } catch {
        return false;
    }
})();

function ensureDynamicStyleAnchor() {
    if (typeof document === 'undefined' || !document.head) {
        return null;
    }
    if (dynamicStyleAnchor?.isConnected) {
        return dynamicStyleAnchor;
    }
    dynamicStyleAnchor = document.head.querySelector(DYNAMIC_STYLE_ANCHOR_SELECTOR) ?? null;
    if (!dynamicStyleAnchor) {
        dynamicStyleAnchor = document.createElement('meta');
        dynamicStyleAnchor.setAttribute('data-st-dynamic-style-anchor', 'true');
        dynamicStyleAnchor.setAttribute('name', 'st-dynamic-style-anchor');
        dynamicStyleAnchor.setAttribute('content', '');
        document.head.appendChild(dynamicStyleAnchor);
    }
    return dynamicStyleAnchor;
}

function ensureExternalStyleAnchor() {
    if (typeof document === 'undefined' || !document.head) {
        return null;
    }
    if (externalStyleAnchor?.isConnected) {
        return externalStyleAnchor;
    }
    externalStyleAnchor = document.head.querySelector(EXTERNAL_STYLE_ANCHOR_SELECTOR) ?? null;
    if (!externalStyleAnchor) {
        externalStyleAnchor = document.createElement('meta');
        externalStyleAnchor.setAttribute('data-st-external-style-anchor', 'true');
        externalStyleAnchor.setAttribute('name', 'st-external-style-anchor');
        externalStyleAnchor.setAttribute('content', '');
        document.head.appendChild(externalStyleAnchor);
    }
    return externalStyleAnchor;
}

function insertBeforeAnchor(node, anchor) {
    if (!node) {
        return;
    }
    const targetAnchor = anchor?.isConnected ? anchor : null;
    if (targetAnchor && targetAnchor.parentNode) {
        targetAnchor.parentNode.insertBefore(node, targetAnchor);
        return;
    }
    if (typeof document !== 'undefined' && document.head) {
        document.head.appendChild(node);
    }
}


if (typeof window !== 'undefined') {
    window.__largeTemplateDebug__ = window.__largeTemplateDebug__ || {};
    window.__largeTemplateDebug__.cacheSize = () => largeTemplateCache.size;
    window.__largeTemplateDebug__.totalBytes = () => largeTemplateCacheSizeBytes;
    window.__largeTemplateDebug__.limitBytes = () => LARGE_TEMPLATE_CACHE_LIMIT_BYTES;
    exposeRenderTaskDebug(window);

    window.__variableDebug__ = window.__variableDebug__ || {};
    Object.assign(window.__variableDebug__, {
        snapshot: () => variableService.snapshot(),
        subscribe: (handler) => variableService.subscribe(handler),
        scopes: VARIABLE_SCOPE,
        signals: VARIABLE_EVENTS,
        mutations: {
            skip: MUTATION_SKIP,
            remove: MUTATION_REMOVE,
        },
        get: (scope, key, options = {}) => variableService.get(scope, key, options),
        set: (scope, key, value, options = {}) => variableService.set(scope, key, value, options),
        mutate: (scope, key, mutator, options = {}) => variableService.mutate(scope, key, mutator, options),
        remove: (scope, key, options = {}) => variableService.remove(scope, key, options),
        monitoring: () => variableService.getMonitoringSnapshot(),
        refreshMonitoringConfig: () => variableService.refreshMonitoringConfig(),
    });
}

function cloneVariablesStore(value) {
    if (value === null || value === undefined) {
        return {};
    }
    if (typeof structuredClone === 'function') {
        try {
            return structuredClone(value);
        } catch (_) {
            // fallback
        }
    }
    try {
        return JSON.parse(JSON.stringify(value));
    } catch (_) {
        return {};
    }
}

function resolveScriptIdentifier(option = {}) {
    const raw = option?.scriptId ?? option?.script_id;
    if (raw === undefined || raw === null) {
        return undefined;
    }
    return String(raw);
}

function normalizeMessageReference(option = {}) {
    if (!Array.isArray(chat) || chat.length === 0) {
        throw new Error('当前会话中没有可用消息');
    }

    const rawMessage = option?.messageId ?? option?.message_id;
    let messageId;
    if (typeof rawMessage === 'string') {
        if (rawMessage === 'latest' || rawMessage === 'last') {
            messageId = chat.length - 1;
        } else if (/^-?\d+$/.test(rawMessage)) {
            messageId = Number(rawMessage);
        } else {
            throw new Error(`无法解析的消息索引：${rawMessage}`);
        }
    } else if (Number.isInteger(rawMessage)) {
        messageId = Number(rawMessage);
    } else if (rawMessage === undefined || rawMessage === null) {
        messageId = chat.length - 1;
    } else {
        throw new Error(`无法解析的消息索引：${String(rawMessage)}`);
    }

    if (messageId < 0) {
        messageId = chat.length + messageId;
    }
    if (messageId < 0 || messageId >= chat.length) {
        throw new Error(`无效的消息索引：${messageId}`);
    }

    const message = chat[messageId];
    const swipeCount = Array.isArray(message?.swipes) ? message.swipes.length : 0;
    const rawSwipe = option?.swipeId ?? option?.swipe_id;
    let swipeId;
    if (typeof rawSwipe === 'string' && /^-?\d+$/.test(rawSwipe)) {
        swipeId = Number(rawSwipe);
    } else if (Number.isInteger(rawSwipe)) {
        swipeId = Number(rawSwipe);
    } else if (rawSwipe === undefined || rawSwipe === null) {
        swipeId = message?.swipe_id ?? 0;
    } else {
        throw new Error(`无法解析的消息滑页索引：${String(rawSwipe)}`);
    }

    if (swipeId < 0 && swipeCount > 0) {
        swipeId = swipeCount + swipeId;
    }
    if (swipeId < 0) {
        swipeId = 0;
    }

    return { messageId, swipeId };
}

function normalizeVariableScopeOption(option = {}) {
    const rawType = option?.type ?? VARIABLE_SCOPE.CHAT;
    const typeKey = typeof rawType === 'string' ? rawType.toLowerCase() : rawType;
    let scope;

    switch (typeKey) {
        case VARIABLE_SCOPE.MESSAGE:
        case 'message':
            scope = VARIABLE_SCOPE.MESSAGE;
            break;
        case VARIABLE_SCOPE.GLOBAL:
        case 'global':
            scope = VARIABLE_SCOPE.GLOBAL;
            break;
        case VARIABLE_SCOPE.CHARACTER:
        case 'character':
            scope = VARIABLE_SCOPE.CHARACTER;
            break;
        case VARIABLE_SCOPE.SCRIPT:
        case 'script':
            scope = VARIABLE_SCOPE.SCRIPT;
            break;
        case VARIABLE_SCOPE.CHAT:
        case 'chat':
            scope = VARIABLE_SCOPE.CHAT;
            break;
        default:
            throw new Error(`不支持的变量作用域：${String(typeKey)}`);
    }

    const normalizedOptions = {};
    if (scope === VARIABLE_SCOPE.MESSAGE) {
        const { messageId, swipeId } = normalizeMessageReference(option);
        normalizedOptions.messageId = messageId;
        normalizedOptions.swipeId = swipeId;
    } else if (scope === VARIABLE_SCOPE.SCRIPT) {
        const scriptId = resolveScriptIdentifier(option);
        if (!scriptId) {
            throw new Error('脚本变量操作需要提供 script_id');
        }
        normalizedOptions.scriptId = scriptId;
    } else if (scope === VARIABLE_SCOPE.CHARACTER) {
        const characterId = option?.characterId ?? option?.character_id;
        if (characterId !== undefined && characterId !== null) {
            normalizedOptions.characterId = String(characterId);
        }
    }

    return { scope, options: normalizedOptions };
}

function getSnapshotStoreForScope(scope, options = {}) {
    const snapshot = variableService.snapshot({ track: false });
    switch (scope) {
        case VARIABLE_SCOPE.MESSAGE: {
            const messageKey = options.messageId;
            const swipeKey = options.swipeId;
            const messageEntry = snapshot.message?.[messageKey] ?? snapshot.message?.[String(messageKey)] ?? {};
            const swipeEntry = messageEntry?.[swipeKey] ?? messageEntry?.[String(swipeKey)] ?? {};
            return cloneVariablesStore(swipeEntry);
        }
        case VARIABLE_SCOPE.GLOBAL:
            return cloneVariablesStore(snapshot.global ?? {});
        case VARIABLE_SCOPE.CHAT:
            return cloneVariablesStore(snapshot.chat ?? {});
        case VARIABLE_SCOPE.CHARACTER:
            return cloneVariablesStore(snapshot.character ?? {});
        case VARIABLE_SCOPE.SCRIPT: {
            if (!options.scriptId) {
                return {};
            }
            const scriptEntry = snapshot.script?.[options.scriptId] ?? {};
            return cloneVariablesStore(scriptEntry);
        }
        default:
            return {};
    }
}

async function replaceVariablesInternal(scope, values, options) {
    const payload = values && typeof values === 'object' ? values : {};
    const existing = getSnapshotStoreForScope(scope, options);
    const existingKeys = Object.keys(existing);

    await variableService.transaction(scope, ({ set, remove }) => {
        for (const key of existingKeys) {
            if (!(key in payload)) {
                remove(key);
            }
        }

        for (const [key, value] of Object.entries(payload)) {
            set(key, value);
        }
    }, options);
}

function isNumericKey(segment) {
    return typeof segment === 'string' && /^-?\d+$/.test(segment);
}

function deleteByPath(target, path) {
    if (!target || typeof target !== 'object') {
        return false;
    }
    if (typeof path !== 'string' || !path.trim()) {
        return false;
    }

    const segments = path.split('.').map((segment) => segment.trim()).filter(Boolean);
    if (!segments.length) {
        return false;
    }

    let current = target;
    for (let index = 0; index < segments.length - 1; index++) {
        const segment = segments[index];
        const key = isNumericKey(segment) ? Number(segment) : segment;
        if (current === null || typeof current !== 'object' || !(key in current)) {
            return false;
        }
        current = current[key];
    }

    const lastSegment = segments[segments.length - 1];
    const lastKey = isNumericKey(lastSegment) ? Number(lastSegment) : lastSegment;

    if (Array.isArray(current) && typeof lastKey === 'number') {
        if (lastKey >= 0 && lastKey < current.length) {
            current.splice(lastKey, 1);
            return true;
        }
        return false;
    }

    if (current && typeof current === 'object' && Object.prototype.hasOwnProperty.call(current, lastKey)) {
        delete current[lastKey];
        return true;
    }

    return false;
}

export function registerDynamicStyle(hash, cssText) {
    if (!hash || !cssText || typeof document === 'undefined') {
        return;
    }

    let entry = dynamicStyleRegistry.get(hash);
    if (!entry) {
        const styleElement = document.createElement('style');
        styleElement.dataset.chatStyleRef = hash;
        styleElement.textContent = cssText;
        insertBeforeAnchor(styleElement, ensureDynamicStyleAnchor());
        entry = { count: 0, element: styleElement };
        dynamicStyleRegistry.set(hash, entry);
    }

    entry.count++;
}

export function releaseDynamicStyle(hash) {
    if (!hash) {
        return;
    }

    const entry = dynamicStyleRegistry.get(hash);
    if (!entry) {
        return;
    }

    entry.count = Math.max(0, entry.count - 1);
    if (entry.count === 0) {
        entry.element?.remove();
        dynamicStyleRegistry.delete(hash);
    }
}

export function releaseDynamicStylesFromElement(rootElement) {
    if (!(rootElement instanceof Element)) {
        return;
    }

    const anchors = rootElement.querySelectorAll('.mes_style_anchor[data-style-ref]');
    anchors.forEach((anchor) => {
        const hash = anchor.getAttribute('data-style-ref');
        if (hash) {
            releaseDynamicStyle(hash);
        }
    });

    releaseLargeTemplatesFromElement(rootElement);
}

function runRenderPipelineStages(context) {
    const stageNames = renderPipelineStages.map(stage => stage.name);
    const stageMetadata = describeStages(renderPipelineStages);
    const detail = {
        ...context,
        stages: stageNames,
        stageMetadata,
    };

    if (typeof document !== 'undefined') {
        document.dispatchEvent(new CustomEvent('chat-render-stage', { detail: { ...detail, status: 'start' } }));
    }

    const asyncTasks = [];

    for (const stage of renderPipelineStages) {
        try {
            const result = stage.handler(detail);
            if (result && typeof result.then === 'function') {
                asyncTasks.push(result.catch((error) => {
                    console.error(`Render pipeline stage "${stage.name}" failed`, error);
                }));
            }
        } catch (error) {
            console.error(`Render pipeline stage "${stage.name}" failed`, error);
        }
    }

    const finalize = () => {
        if (typeof document !== 'undefined') {
            document.dispatchEvent(new CustomEvent('chat-render-stage', { detail: { ...detail, status: 'done' } }));
        }
    };

    if (!asyncTasks.length) {
        finalize();
        return Promise.resolve();
    }

    return Promise.allSettled(asyncTasks).finally(finalize);
}

export const renderPipeline = {
    registerStage(name, handler, options = {}) {
        if (!name || typeof handler !== 'function') {
            throw new TypeError('renderPipeline.registerStage 需要提供名称和处理函数');
        }

        const normalized = normalizeStageOptions(name, options);
        const stageEntry = {
            name: normalized.name,
            handler,
            priority: Number.isFinite(normalized.priority) ? Number(normalized.priority) : 0,
            async: !!normalized.async,
            emitStatus: normalized.emitStatus !== false,
        };

        const existingIndex = renderPipelineStages.findIndex(stage => stage.name === name);
        if (existingIndex !== -1) {
            renderPipelineStages.splice(existingIndex, 1);
        }

        renderPipelineStages.push(stageEntry);
        renderPipelineStages.sort((a, b) => {
            if (a.priority === b.priority) {
                return a.name.localeCompare(b.name);
            }
            return a.priority - b.priority;
        });

        return () => renderPipeline.unregisterStage(name);
    },
    unregisterStage(name) {
        const index = renderPipelineStages.findIndex(stage => stage.name === name);
        if (index !== -1) {
            renderPipelineStages.splice(index, 1);
        }
    },
    listStages() {
        return describeStages(renderPipelineStages);
    },
};

function hashString(value) {
    let hash = 2166136261;
    for (let i = 0; i < value.length; i++) {
        hash ^= value.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16);
}

function getTimestamp() {
    return (typeof performance !== 'undefined' && typeof performance.now === 'function')
        ? performance.now()
        : Date.now();
}

function estimateStringSize(value) {
    if (!value || typeof value !== 'string') {
        return 0;
    }
    return value.length * 2;
}

function enforceLargeTemplateCacheLimit() {
    if (largeTemplateCacheSizeBytes <= LARGE_TEMPLATE_CACHE_LIMIT_BYTES) {
        return;
    }

    const candidates = [];
    largeTemplateCache.forEach((entry, key) => {
        if (entry && entry.count === 0) {
            const released = entry.lastReleasedAt ?? entry.lastAccessed ?? 0;
            candidates.push({ key, entry, released });
        }
    });

    if (!candidates.length) {
        return;
    }

    candidates.sort((a, b) => (a.released ?? 0) - (b.released ?? 0));

    for (const candidate of candidates) {
        if (largeTemplateCacheSizeBytes <= LARGE_TEMPLATE_CACHE_LIMIT_BYTES) {
            break;
        }
        const { key, entry } = candidate;
        if (!entry || entry.count > 0 || !largeTemplateCache.has(key)) {
            continue;
        }
        largeTemplateCache.delete(key);
        const size = entry.sizeBytes ?? estimateStringSize(entry.html);
        largeTemplateCacheSizeBytes = Math.max(0, largeTemplateCacheSizeBytes - size);
    }
}

function registerLargeTemplate(key, html) {
    let entry = largeTemplateCache.get(key);
    if (!entry) {
        const sizeBytes = estimateStringSize(html);
        entry = {
            html,
            count: 0,
            sizeBytes,
            lastAccessed: getTimestamp(),
            lastReleasedAt: null,
        };
        largeTemplateCache.set(key, entry);
        largeTemplateCacheSizeBytes += sizeBytes;
    } else {
        const newSize = estimateStringSize(html);
        const prevSize = entry.sizeBytes ?? estimateStringSize(entry.html);
        if (newSize !== prevSize) {
            largeTemplateCacheSizeBytes += newSize - prevSize;
            entry.sizeBytes = newSize;
        }
        entry.html = html;
        entry.lastAccessed = getTimestamp();
        entry.lastReleasedAt = null;
    }
    entry.count++;
    entry.lastAccessed = getTimestamp();
    entry.lastReleasedAt = null;
    enforceLargeTemplateCacheLimit();
}

function retainLargeTemplatePlaceholder(html) {
    if (!html || html.length < LARGE_TEMPLATE_THRESHOLD) {
        return html;
    }
    const key = hashString(html);
    registerLargeTemplate(key, html);
    return `<div class="large_template_placeholder" data-template-key="${key}"><div class="large_template_loading">内容加载中…</div></div>`;
}

function releaseLargeTemplate(key) {
    const entry = largeTemplateCache.get(key);
    if (!entry) {
        return;
    }
    entry.count = Math.max(0, entry.count - 1);
    if (entry.count === 0) {
        entry.lastReleasedAt = getTimestamp();
        enforceLargeTemplateCacheLimit();
    }
}

function releaseLargeTemplatesFromElement(rootElement) {
    if (!(rootElement instanceof Element)) {
        return;
    }
    const placeholders = rootElement.querySelectorAll('.large_template_placeholder[data-template-key]');
    placeholders.forEach((placeholder) => {
        const key = placeholder.getAttribute('data-template-key');
        if (key) {
            releaseLargeTemplate(key);
        }
    });
}

function hydrateLargeTemplateElement(element, attempt = 0) {
    if (!(element instanceof Element)) {
        return;
    }

    const key = element.getAttribute('data-template-key');
    if (!key || element.getAttribute('data-hydrated') === 'true') {
        return;
    }

    const cacheEntry = largeTemplateCache.get(key);
    if (!cacheEntry || typeof cacheEntry.html !== 'string' || cacheEntry.html.length === 0) {
        if (attempt < LARGE_TEMPLATE_MAX_RETRIES) {
            element.setAttribute('data-hydrated', `retry-${attempt + 1}`);
            console.warn('大型模板缓存缺失，准备重试', { key, attempt: attempt + 1 });
            setTimeout(() => {
                scheduleRenderTask(() => hydrateLargeTemplateElement(element, attempt + 1), 'media');
            }, LARGE_TEMPLATE_RETRY_DELAY_MS * (attempt + 1));
            return;
        }

        element.innerHTML = '<div class="large_template_error">内容加载失败，请刷新</div>';
        element.setAttribute('data-hydrated', 'error');
        releaseLargeTemplate(key);
        console.warn('大型模板复原失败，已降级为占位提示', { key, attempts: attempt + 1 });
        return;
    }

    cacheEntry.lastAccessed = getTimestamp();

    try {
        element.innerHTML = cacheEntry.html;
        element.setAttribute('data-hydrated', 'true');
    } catch (error) {
        console.error('大型模板渲染失败', error);

        if (attempt < LARGE_TEMPLATE_MAX_RETRIES) {
            element.setAttribute('data-hydrated', `retry-${attempt + 1}`);
            setTimeout(() => {
                scheduleRenderTask(() => hydrateLargeTemplateElement(element, attempt + 1), 'media');
            }, LARGE_TEMPLATE_RETRY_DELAY_MS * (attempt + 1));
            return;
        }

        element.innerHTML = '<div class="large_template_error">内容加载失败，请刷新</div>';
        element.setAttribute('data-hydrated', 'error');
        releaseLargeTemplate(key);
    }
}

function hydrateLargeTemplates(messageElement) {
    const placeholders = messageElement.find('.large_template_placeholder[data-template-key]');
    if (!placeholders.length) {
        return;
    }
    placeholders.each((_, element) => {
        hydrateLargeTemplateElement(element);
    });
}

const PRELOAD_PROMOTION_TIMEOUT_MS = 4000;

function resolveExternalResourceHint(url) {
    const normalized = (url || '').split('?')[0].toLowerCase();
    if (normalized.endsWith('.woff2')) {
        return { rel: 'preload', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous', applyStylesheet: false };
    }
    if (normalized.endsWith('.woff')) {
        return { rel: 'preload', as: 'font', type: 'font/woff', crossOrigin: 'anonymous', applyStylesheet: false };
    }
    if (normalized.endsWith('.ttf')) {
        return { rel: 'preload', as: 'font', type: 'font/ttf', crossOrigin: 'anonymous', applyStylesheet: false };
    }
    if (normalized.endsWith('.otf')) {
        return { rel: 'preload', as: 'font', type: 'font/otf', crossOrigin: 'anonymous', applyStylesheet: false };
    }
    if (normalized.endsWith('.css')) {
        return { rel: 'preload', as: 'style', applyStylesheet: true };
    }
    return { rel: 'preload', as: 'style', applyStylesheet: true };
}

function promotePreloadedStylesheet(link) {
    if (!link || link.rel === 'stylesheet') {
        return;
    }
    link.rel = 'stylesheet';
    link.removeAttribute('as');
    link.removeAttribute('onload');
}

function scheduleStylesheetPromotion(link, delay = PRELOAD_PROMOTION_TIMEOUT_MS) {
    if (!link) {
        return;
    }
    setTimeout(() => {
        if (link.rel === 'preload') {
            promotePreloadedStylesheet(link);
        }
    }, delay);
}

function queueExternalImports(urls, priority = EXTERNAL_IMPORT_DEFAULT_PRIORITY) {
    let added = false;
    const normalizedPriority = Number.isFinite(Number(priority))
        ? Number(priority)
        : EXTERNAL_IMPORT_DEFAULT_PRIORITY;
    const now = typeof performance !== 'undefined' && typeof performance.now === 'function'
        ? performance.now()
        : Date.now();

    for (const url of urls) {
        const normalized = typeof url === 'string' ? url.trim() : '';
        if (!normalized || !/^https?:/i.test(normalized)) {
            continue;
        }
        if (externalImportRegistry.has(normalized)) {
            continue;
        }

        const existing = externalImportQueue.get(normalized);
        if (existing) {
            if (normalizedPriority < existing.priority) {
                existing.priority = normalizedPriority;
                existing.addedAt = now;
                added = true;
            }
            continue;
        }

        externalImportQueue.set(normalized, { priority: normalizedPriority, addedAt: now });
        added = true;
    }

    if (added && !externalImportScheduled) {
        externalImportScheduled = true;
        scheduleRenderTask(flushExternalImports, 'pipeline');
    }
}

function flushExternalImports() {
    externalImportScheduled = false;
    if (!externalImportQueue.size) {
        return;
    }

    const entries = Array.from(externalImportQueue.entries())
        .map(([url, meta]) => ({
            url,
            priority: meta.priority,
            addedAt: meta.addedAt,
        }))
        .sort((a, b) => {
            if (a.priority === b.priority) {
                return (a.addedAt ?? 0) - (b.addedAt ?? 0);
            }
            return a.priority - b.priority;
        });

    const anchor = ensureExternalStyleAnchor();
    entries.forEach(({ url }) => {
        if (externalImportRegistry.has(url)) {
            externalImportQueue.delete(url);
            return;
        }

        externalImportRegistry.add(url);
        const link = document.createElement('link');
        const hint = resolveExternalResourceHint(url);
        const shouldPreload = SUPPORTS_PRELOAD && hint.rel === 'preload';

        link.href = url;
        link.dataset.extStyleImport = hashString(url);
        link.referrerPolicy = 'no-referrer';
        if (hint.type) {
            link.type = hint.type;
        }
        if (hint.crossOrigin) {
            link.crossOrigin = hint.crossOrigin;
        }

        if (hint.applyStylesheet && !shouldPreload) {
            link.rel = 'stylesheet';
        } else {
            link.rel = hint.rel;
            if (hint.as) {
                link.as = hint.as;
            }
        }

        if (hint.applyStylesheet && shouldPreload) {
            link.onload = () => promotePreloadedStylesheet(link);
            link.onerror = () => promotePreloadedStylesheet(link);
            scheduleStylesheetPromotion(link);
        }

        insertBeforeAnchor(link, anchor);
    });

    externalImportQueue.clear();
}

function processStyleImportAnchors(messageElement) {
    const anchors = messageElement.find('.style_import_anchor[data-style-imports]');
    if (!anchors.length) {
        return;
    }

    anchors.each((_, element) => {
        const encoded = element.getAttribute('data-style-imports');
        if (!encoded) {
            return;
        }
        try {
            const decoded = decodeURIComponent(encoded);
            const urls = decoded.split(',').map(item => item.trim()).filter(Boolean);
            const priorityAttr = Number(element.getAttribute('data-style-priority'));
            const priority = Number.isFinite(priorityAttr) ? priorityAttr : EXTERNAL_IMPORT_DEFAULT_PRIORITY;
            queueExternalImports(urls, priority);
        } catch (error) {
            console.warn('样式导入解析失败', error);
        }
        element.remove();
    });
}

function queuePostHydrationTasks(messageElement, context = {}) {
    if (!messageElement || typeof scheduleRenderTask !== 'function') {
        return;
    }

    const detail = { ...context };
    const elementNode = typeof messageElement?.get === 'function'
        ? messageElement.get(0)
        : (messageElement instanceof Element ? messageElement : null);
    const stageNames = renderPipelineStages.map(stage => stage.name);
    const stageMetadata = describeStages(renderPipelineStages);
    const pipelineDetail = {
        ...detail,
        phase: detail.phase ?? 'after-hydration',
        messageElement,
        element: elementNode,
        stages: stageNames,
        stageMetadata,
    };

    if (typeof document !== 'undefined') {
        document.dispatchEvent(new CustomEvent('chat-render-stage', { detail: { ...pipelineDetail, status: 'queued' } }));
    }

    scheduleRenderTask(() => {
        if (!pipelineDetail.skipHydration) {
            hydrateLargeTemplates(messageElement);
            processStyleImportAnchors(messageElement);
        }
        runRenderPipelineStages(pipelineDetail).catch((error) => {
            console.error('Render pipeline 执行失败', error);
        });
    }, 'pipeline');
}

/**
 * Prints the character list in a debounced fashion without blocking, with a delay of 100 milliseconds.
 * Use this function instead of a direct `printCharacters()` whenever the reprinting of the character list is not the primary focus.
 *
 * The printing will also always reprint all filter options of the global list, to keep them up to date.
 */
export const printCharactersDebounced = debounce(() => { printCharacters(false); }, DEFAULT_PRINT_TIMEOUT);

/**
 * @enum {number} Extension prompt types
 */
export const extension_prompt_types = {
    NONE: -1,
    IN_PROMPT: 0,
    IN_CHAT: 1,
    BEFORE_PROMPT: 2,
};

/**
 * @enum {number} Extension prompt roles
 */
export const extension_prompt_roles = {
    SYSTEM: 0,
    USER: 1,
    ASSISTANT: 2,
};

export const MAX_INJECTION_DEPTH = 10000;

async function getClientVersion() {
    try {
        const response = await fetch('/version');
        const data = await response.json();
        CLIENT_VERSION = data.agent;
        displayVersion = `SillyTavern ${data.pkgVersion}`;
        currentVersion = data.pkgVersion;

        if (data.gitRevision && data.gitBranch) {
            displayVersion += ` '${data.gitBranch}' (${data.gitRevision})`;
        }

        $('#version_display').text(displayVersion);
        $('#version_display_welcome').text(displayVersion);
    } catch (err) {
        console.error('获取客户端版本失败', err);
    }
}

export function reloadMarkdownProcessor() {
    converter = new showdown.Converter({
        emoji: true,
        literalMidWordUnderscores: true,
        parseImgDimensions: true,
        tables: true,
        underline: true,
        simpleLineBreaks: true,
        strikethrough: true,
        disableForced4SpacesIndentedSublists: true,
        extensions: [markdownUnderscoreExt()],
    });

    // Inject the dinkus extension after creating the converter
    // Maybe move this into power_user init?
    converter.addExtension(markdownExclusionExt(), 'exclusion');

    showdownHtmlCache.clear();

    return converter;
}

export function getCurrentChatId() {
    if (selected_group) {
        return groups.find(x => x.id == selected_group)?.chat_id;
    }
    else if (this_chid !== undefined) {
        return characters[this_chid]?.chat;
    }
}

export const talkativeness_default = 0.5;
export const depth_prompt_depth_default = 4;
export const depth_prompt_role_default = 'system';
const per_page_default = 50;

var is_advanced_char_open = false;

/**
 * The type of the right menu
 * @typedef {'characters' | 'character_edit' | 'create' | 'group_edit' | 'group_create' | '' } MenuType
 */

/**
 * The type of the right menu that is currently open
 * @type {MenuType}
 */
export let menu_type = '';

export let selected_button = ''; //which button pressed

//create pole save
export let create_save = {
    name: '',
    description: '',
    creator_notes: '',
    post_history_instructions: '',
    character_version: '',
    system_prompt: '',
    tags: '',
    creator: '',
    personality: '',
    first_message: '',
    /** @type {FileList|null} */
    avatar: null,
    scenario: '',
    mes_example: '',
    world: '',
    talkativeness: talkativeness_default,
    alternate_greetings: [],
    depth_prompt_prompt: '',
    depth_prompt_depth: depth_prompt_depth_default,
    depth_prompt_role: depth_prompt_role_default,
    extensions: {},
    extra_books: [],
};

//animation right menu
export const ANIMATION_DURATION_DEFAULT = 125;
export let animation_duration = ANIMATION_DURATION_DEFAULT;
export let animation_easing = 'ease-in-out';
let popup_type = '';
let chat_file_for_del = '';
export let online_status = 'no_connection';

export let is_send_press = false; //Send generation

let this_del_mes = -1;

//message editing
var this_edit_mes_chname = '';
var this_edit_mes_id;

//settings
export let settings;
export let amount_gen = 80; //default max length of AI generated responses
export let max_context = 2048;

var swipes = true;
export let extension_prompts = {};

export let main_api;// = "kobold";
/** @type {AbortController} */
let abortController;

//css
var css_send_form_display = $('<div id=send_form></div>').css('display');

var kobold_horde_model = '';

export let token;

const originalFetch = window.fetch.bind(window);
let csrfTokenPromise;

export let backendApiToggles = {
    textCompletion: true,
    chatCompletion: true,
    novelAI: true,
    aiHorde: true,
    kobold: true,
};
export let backendApiLoggingEnabled = false;
export let extensionToastNotificationsEnabled = true;

export const DEFAULT_DEBUG_LOGGING_FLAGS = Object.freeze({
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
});

export let debugLoggingFlags = { ...DEFAULT_DEBUG_LOGGING_FLAGS };

// 变量监控配置：通过 config.json => variableMonitoring 控制，默认关闭避免额外开销。
export const DEFAULT_VARIABLE_MONITORING_CONFIG = Object.freeze({
    enabled: false,
    logIntervalMs: 15000,
    topEventTypes: 5,
});

let variableMonitoringConfig = { ...DEFAULT_VARIABLE_MONITORING_CONFIG };

function normalizeVariableMonitoringConfig(config = {}) {
    const normalized = { ...DEFAULT_VARIABLE_MONITORING_CONFIG };
    if (!config || typeof config !== 'object') {
        return normalized;
    }
    if (Object.prototype.hasOwnProperty.call(config, 'enabled')) {
        normalized.enabled = Boolean(config.enabled);
    }
    if (Object.prototype.hasOwnProperty.call(config, 'logIntervalMs')) {
        const interval = Number(config.logIntervalMs);
        if (!Number.isNaN(interval) && interval >= 1000) {
            normalized.logIntervalMs = interval;
        }
    }
    if (Object.prototype.hasOwnProperty.call(config, 'topEventTypes')) {
        const topCount = Math.max(1, Number(config.topEventTypes) || DEFAULT_VARIABLE_MONITORING_CONFIG.topEventTypes);
        normalized.topEventTypes = topCount;
    }
    return normalized;
}

function normalizeDebugLogging(flags = {}) {
    const normalized = { ...DEFAULT_DEBUG_LOGGING_FLAGS };
    if (!flags || typeof flags !== 'object') {
        return normalized;
    }
    for (const [key, value] of Object.entries(flags)) {
        if (Object.prototype.hasOwnProperty.call(normalized, key)) {
            normalized[key] = Boolean(value);
        }
    }
    return normalized;
}

export function applyDebugLoggingFlags(flags = {}) {
    debugLoggingFlags = normalizeDebugLogging(flags);
    globalThis.__ST_DEBUG_FLAGS__ = { ...debugLoggingFlags };
}

export function shouldLogDebug(key) {
    if (!key) {
        return false;
    }
    return !!debugLoggingFlags[key];
}

export function getDebugLoggingFlags() {
    return { ...debugLoggingFlags };
}

if (!globalThis.__ST_DEBUG_FLAGS__) {
    globalThis.__ST_DEBUG_FLAGS__ = { ...debugLoggingFlags };
} else {
    applyDebugLoggingFlags(globalThis.__ST_DEBUG_FLAGS__);
}

function cloneRequest(request, overrides = {}) {
    const headers = overrides.headers ? new Headers(overrides.headers) : new Headers(request.headers ?? {});

    const init = {
        method: overrides.method ?? request.method,
        headers,
        mode: overrides.mode ?? request.mode,
        credentials: overrides.credentials ?? request.credentials,
        cache: overrides.cache ?? request.cache,
        redirect: overrides.redirect ?? request.redirect,
        referrer: overrides.referrer ?? request.referrer,
        referrerPolicy: overrides.referrerPolicy ?? request.referrerPolicy,
        integrity: overrides.integrity ?? request.integrity,
        keepalive: overrides.keepalive ?? request.keepalive,
        signal: overrides.signal ?? request.signal,
    };

    if (overrides.priority !== undefined) {
        init.priority = overrides.priority;
    } else if ('priority' in request) {
        init.priority = request.priority;
    }

    if (overrides.duplex !== undefined) {
        init.duplex = overrides.duplex;
    } else if ('duplex' in request) {
        init.duplex = request.duplex;
    }

    return new Request(request, init);
}

function shouldSuppressConsoleMessage(method, args) {
    if (!args || !args.length) {
        return false;
    }
    const [first] = args;
    const flags = debugLoggingFlags;
    if (!flags) {
        return false;
    }

    if (method === 'table' && !flags.worldInfo) {
        return true;
    }

    if (typeof first === 'string') {
        if (!flags.events && first.startsWith('Event emitted')) {
            if (typeof localStorage !== 'undefined' && localStorage.getItem('eventTracing') === 'true') {
                return false;
            }
            return true;
        }

        if (!flags.metadata && (first.startsWith('Debounced metadata save') || first.startsWith('Saving metadata') || first.startsWith('Saved metadata'))) {
            return true;
        }

        if (!flags.tokenCache && first.toLowerCase().includes('token cache')) {
            return true;
        }

        if (!flags.presets && first.startsWith('Registering preset manager')) {
            return true;
        }

        if (!flags.context) {
            if (first.startsWith('Setting context_')
                || first.startsWith('Character context menu')
                || first.startsWith('value?')
                || first.startsWith('hiding settings?')
                || first.startsWith('setFloatingPrompt')
                || first.startsWith('saw no avatars')
                || first.startsWith('returning full samplers array')) {
                return true;
            }
        }

        if (!flags.movingUI && (first.includes('movingUI state') || first.startsWith('aborting MUI reset'))) {
            return true;
        }

        if (!flags.extensions) {
            if (first.startsWith('Activating extension')
                || first.startsWith('[Prompt Template]')
                || first.startsWith('[QR2]')
                || first.startsWith('Summary has no content')) {
                return true;
            }
        }

        if (!flags.renderQueue && first.startsWith('[renderQueue]')) {
            return true;
        }

        if (!flags.generation) {
            if (first.startsWith('Generate entered')
                || first.startsWith('Skipping extension interceptors')
                || first.startsWith('Core/all messages')
                || first.includes('setFloatingPrompt')
                || first.startsWith('skipWIAN')
                || first.startsWith('calling runGenerate')
                || first.startsWith('generating prompt')
                || first.includes('setPromptString')
                || first.startsWith('User Agent')
                || first.startsWith('Loading locale data')
                || first.startsWith('Preset samplers order')
                || first.startsWith('poweruser.chat_display')
                || first.startsWith('applying bubblechat')) {
                return true;
            }
        }

        if (!flags.window && (first.startsWith('Window resize') || first.startsWith('Zoom:'))) {
            return true;
        }

        if (!flags.worldInfo) {
            if (first.startsWith('[WI')
                || /^WI entry/i.test(first)
                || first.startsWith('Triggered WI ')
                || first.startsWith('Quick selection of world')
                || first.startsWith('Opening lorebook')
                || first.startsWith('[WI Move]')
                || first.startsWith('Could not find element for uid')) {
                return true;
            }
        }
    }

    return false;
}

function patchConsoleMethod(method) {
    const original = console[method]?.bind(console);
    if (!original || console[method]?.__stPatched) {
        return;
    }

    const patched = (...args) => {
        if (shouldSuppressConsoleMessage(method, args)) {
            return;
        }
        original(...args);
    };

    patched.__stPatched = true;
    console[method] = patched;
}

patchConsoleMethod('debug');
patchConsoleMethod('log');
patchConsoleMethod('info');
patchConsoleMethod('table');

const API_TOGGLE_LABELS = {
    textCompletion: () => t`文本补全`,
    chatCompletion: () => t`聊天补全`,
    novelAI: () => 'NovelAI',
    aiHorde: () => 'AI Horde',
    kobold: () => 'Kobold',
};

const API_TOGGLE_PATH_PREFIXES = [
    { key: 'textCompletion', prefix: '/api/backends/text-completions' },
    { key: 'chatCompletion', prefix: '/api/backends/chat-completions' },
    { key: 'novelAI', prefix: '/api/novelai' },
    { key: 'aiHorde', prefix: '/api/horde' },
    { key: 'kobold', prefix: '/api/backends/kobold' },
];

function resolveApiToggleKeyByPath(pathname) {
    if (!pathname) return null;
    for (const mapping of API_TOGGLE_PATH_PREFIXES) {
        if (pathname.startsWith(mapping.prefix)) {
            return mapping.key;
        }
    }
    return null;
}

function notifyApiDisabled(key) {
    const labelFactory = API_TOGGLE_LABELS[key];
    const label = typeof labelFactory === 'function' ? labelFactory() : (labelFactory || key);
    const message = `${label}${t`已在服务器端禁用`}`;
    if (backendApiLoggingEnabled) {
        console.warn(`[API toggle] ${message}`);
    }
}

export function getBackendApiLabel(key) {
    const labelFactory = API_TOGGLE_LABELS[key];
    return typeof labelFactory === 'function' ? labelFactory() : (labelFactory || key);
}

export function isBackendApiEnabled(key) {
    return backendApiToggles[key] ?? true;
}

export function getBackendApiStatus() {
    return {
        toggles: { ...backendApiToggles },
        loggingEnabled: backendApiLoggingEnabled,
        extensionToastsEnabled: extensionToastNotificationsEnabled,
        debugLogging: { ...debugLoggingFlags },
        variableMonitoring: getVariableMonitoringConfig(),
    };
}

function normalizeBackendApiToggles(toggles = {}) {
    const normalized = { ...backendApiToggles };
    for (const [key, value] of Object.entries(toggles)) {
        if (Object.prototype.hasOwnProperty.call(normalized, key)) {
            normalized[key] = Boolean(value);
        }
    }
    return normalized;
}

async function loadBackendApiToggles() {
    try {
        const response = await originalFetch('/api/meta/api-toggles', { cache: 'no-store' });
        if (response.status === 404) {
            console.info('[API toggle] 服务器未暴露开关元数据，使用默认值。');
            backendApiToggles = { ...backendApiToggles };
            backendApiLoggingEnabled = false;
            return;
        }
        if (!response.ok) {
            throw new Error(`Failed to load API toggles: ${response.status}`);
        }
        const data = await response.json();
        backendApiToggles = normalizeBackendApiToggles(data?.toggles);
        backendApiLoggingEnabled = Boolean(data?.loggingEnabled);
        extensionToastNotificationsEnabled = data?.extensionToastsEnabled !== false;
        applyDebugLoggingFlags(data?.debugLogging ?? DEFAULT_DEBUG_LOGGING_FLAGS);
        applyVariableMonitoringConfig(data?.variableMonitoring ?? DEFAULT_VARIABLE_MONITORING_CONFIG);
        eventSource.emit(event_types.BACKEND_API_STATUS_CHANGED, {
            toggles: { ...backendApiToggles },
            loggingEnabled: backendApiLoggingEnabled,
            extensionToastsEnabled: extensionToastNotificationsEnabled,
            debugLogging: { ...debugLoggingFlags },
            variableMonitoring: getVariableMonitoringConfig(),
            source: 'remote',
        }).catch(console.error);
    } catch (error) {
        console.warn('[API toggle] 无法获取后台开关配置，使用默认值。', error);
        backendApiToggles = { ...backendApiToggles };
        backendApiLoggingEnabled = false;
        extensionToastNotificationsEnabled = true;
        applyDebugLoggingFlags(DEFAULT_DEBUG_LOGGING_FLAGS);
        applyVariableMonitoringConfig(DEFAULT_VARIABLE_MONITORING_CONFIG);
        eventSource.emit(event_types.BACKEND_API_STATUS_CHANGED, {
            toggles: { ...backendApiToggles },
            loggingEnabled: backendApiLoggingEnabled,
            extensionToastsEnabled: extensionToastNotificationsEnabled,
            debugLogging: { ...debugLoggingFlags },
            variableMonitoring: getVariableMonitoringConfig(),
            source: 'fallback',
            error: error?.message ?? String(error),
        }).catch(console.error);
    }
}

export async function ensureCsrfToken() {
    if (typeof token === 'string' && token) {
        return token;
    }

    if (!csrfTokenPromise) {
        csrfTokenPromise = originalFetch('/csrf-token', { credentials: 'same-origin' })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch CSRF token: ${response.status}`);
                }

                const data = await response.json();
                token = data?.token ?? token;
                return token;
            })
            .catch((error) => {
                console.error('获取 CSRF 令牌失败', error);
                csrfTokenPromise = undefined;
                throw error;
            });
    }

    return csrfTokenPromise;
}

export async function refreshBackendApiStatus() {
    await loadBackendApiToggles();
    return getBackendApiStatus();
}

export function setBackendApiToggle(key, enabled, options = {}) {
    if (!Object.prototype.hasOwnProperty.call(backendApiToggles, key)) {
        console.warn(`[API toggle] 未知的开关 ${key}`);
        return false;
    }
    const normalized = Boolean(enabled);
    if (backendApiToggles[key] === normalized) {
        return true;
    }
    backendApiToggles = {
        ...backendApiToggles,
        [key]: normalized,
    };
    const payload = {
        toggles: { ...backendApiToggles },
        loggingEnabled: backendApiLoggingEnabled,
        extensionToastsEnabled: extensionToastNotificationsEnabled,
        source: options.source ?? 'manual',
        key,
        enabled: normalized,
    };
    safeEmit(event_types.BACKEND_API_STATUS_CHANGED, payload);
    return true;
}

export function setBackendApiLogging(enabled, options = {}) {
    const normalized = Boolean(enabled);
    if (backendApiLoggingEnabled === normalized) {
        return backendApiLoggingEnabled;
    }
    backendApiLoggingEnabled = normalized;
    const payload = {
        toggles: { ...backendApiToggles },
        loggingEnabled: backendApiLoggingEnabled,
        extensionToastsEnabled: extensionToastNotificationsEnabled,
        source: options.source ?? 'manual',
    };
    safeEmit(event_types.BACKEND_API_STATUS_CHANGED, payload);
    return backendApiLoggingEnabled;
}

export function listBackendApis() {
    return Object.keys(backendApiToggles).map((key) => ({
        key,
        label: getBackendApiLabel(key),
        enabled: Boolean(backendApiToggles[key]),
    }));
}

window.fetch = async function patchedFetch(input, init) {
    const baseRequest = input instanceof Request ? input : new Request(input, init);
    const mergedInit = input instanceof Request && init ? { ...init } : undefined;
    let request = input instanceof Request && mergedInit
        ? cloneRequest(baseRequest, mergedInit)
        : (input instanceof Request ? baseRequest.clone() : baseRequest);

    const method = request.method?.toUpperCase?.() ?? 'GET';
    const requiresCsrf = method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS';
    let requestOrigin;
    let pathname = '';

    try {
        const requestUrl = new URL(request.url, window.location.href);
        requestOrigin = requestUrl.origin;
        pathname = requestUrl.pathname;
    } catch {
        requestOrigin = window.location.origin;
    }

    if (requestOrigin === window.location.origin) {
        const toggleKey = resolveApiToggleKeyByPath(pathname);
        if (toggleKey && !isBackendApiEnabled(toggleKey)) {
            notifyApiDisabled(toggleKey);
            const body = JSON.stringify({
                error: 'api_disabled',
                api: toggleKey,
                message: 'Backend API disabled by server configuration.',
            });
            return new Response(body, {
                status: 403,
                statusText: 'API Disabled',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
    }

    if (requiresCsrf && requestOrigin === window.location.origin) {
        try {
            await ensureCsrfToken();
        } catch (error) {
            console.error('请求无法确认 CSRF 令牌', request.url, error);
            // Continue without token; server will handle and log as needed.
        }

        const headers = new Headers(request.headers);
        if (!headers.has('X-CSRF-Token') && token) {
            headers.set('X-CSRF-Token', token);
        }

        request = cloneRequest(request, { headers });
    }

    return originalFetch(request);
};

if (window.jQuery?.ajaxSend) {
    jQuery(document).ajaxSend((_event, jqXHR, settings) => {
        const method = (settings?.type || settings?.method || 'GET').toUpperCase();
        let requestOrigin = window.location.origin;

        try {
            requestOrigin = new URL(settings?.url ?? '', window.location.href).origin;
        } catch {
            requestOrigin = window.location.origin;
        }

        const requiresCsrf = method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS';

        if (requiresCsrf && requestOrigin === window.location.origin) {
            if (!token) {
                // Fire and forget – firstLoadInit should already prime the token.
                void ensureCsrfToken().catch((error) => {
                    console.error('jQuery 请求无法确认 CSRF 令牌', settings?.url, error);
                });
            }

            if (token) {
                jqXHR.setRequestHeader('X-CSRF-Token', token);
            }
        }
    });
}


/** The tag of the active character. (NOT the id) */
export let active_character = '';
/** The tag of the active group. (Coincidentally also the id) */
export let active_group = '';

export const entitiesFilter = new FilterHelper(printCharactersDebounced);

export function getRequestHeaders({ omitContentType = false } = {}) {
    const headers = {
        'Content-Type': 'application/json',
        'X-CSRF-Token': token,
    };

    if (omitContentType) {
        delete headers['Content-Type'];
    }

    return headers;
}

export function getSlideToggleOptions() {
    return {
        miliseconds: animation_duration * 1.5,
        transitionFunction: animation_duration > 0 ? 'ease-in-out' : 'step-start',
    };
}

$.ajaxPrefilter((options, originalOptions, xhr) => {
    xhr.setRequestHeader('X-CSRF-Token', token);
});

/**
 * Pings the STserver to check if it is reachable.
 * @returns {Promise<boolean>} True if the server is reachable, false otherwise.
 */
export async function pingServer() {
    try {
        const result = await fetch('api/ping', {
            method: 'POST',
            headers: getRequestHeaders(),
        });

        if (!result.ok) {
            return false;
        }

        return true;
    } catch (error) {
        console.error('服务器连通性检测失败', error);
        return false;
    }
}

//MARK: firstLoadInit
async function firstLoadInit() {
    try {
        const tokenResponse = await fetch('/csrf-token');
        const tokenData = await tokenResponse.json();
        token = tokenData.token;
    } catch {
        toastr.error(t`无法获取 CSRF 令牌，请刷新页面。`, t`错误`, { timeOut: 0, extendedTimeOut: 0, preventDuplicates: true });
        throw new Error('初始化失败');
    }

    showLoader();
    registerPromptManagerMigration();
    initStandaloneMode();
    initLibraryShims();
    addShowdownPatch(showdown);
    addDOMPurifyHooks();
    reloadMarkdownProcessor();
    await loadBackendApiToggles();
    applyBrowserFixes();
    await getClientVersion();
    await initSecrets();
    await readSecretState();
    await initLocales();
    initChatUtilities();
    initDefaultSlashCommands();
    initTextGenModels();
    initOpenAI();
    initTextGenSettings();
    initKoboldSettings();
    initNovelAISettings();
    initSystemPrompts();
    initExtensions();
    initExtensionSlashCommands();
    ToolManager.initToolSlashCommands();
    await initPresetManager();
    await initSystemMessages();
    await getSettings();
    initKeyboard();
    initDynamicStyles();
    initTags();
    initBookmarks();
    initMacros();

    await Promise.all([
        getUserAvatars(true, user_avatar),
        getCharacters(),
        getBackgrounds(),
        initTokenizers(),
        initPersonas(),
        initScrapers(),
    ]);

    initBackgrounds();
    initAuthorsNote();
    initWorldInfo();
    initHorde();
    initRossMods();
    initCfg();
    initLogprobs();
    initInputMarkdown();
    initServerHistory();
    initSettingsSearch();
    initBulkEdit();
    initReasoning();
    initWelcomeScreen();
    initCustomSelectedSamplers();
    initDataMaid();
    initItemizedPrompts();
    initAccessibility();
    addDebugFunctions();

    bindLeftPanelVirtualizationWatchers();
    initLeftPanelVirtualization();

    await hideLoader();
    await fixViewport();
    await eventSource.emit(event_types.APP_READY);

    Promise.resolve().then(() => {
        initStats();
        doDailyExtensionUpdatesCheck();
    });
}

async function fixViewport() {
    document.body.style.position = 'absolute';
    await delay(1);
    document.body.style.position = '';
}

function initStandaloneMode() {
    const isPwaMode = window.matchMedia('(display-mode: standalone)').matches;
    if (isPwaMode) {
        $('body').addClass('PWA');
    }
}

function cancelStatusCheck(reason = 'Manually cancelled status check') {
    abortStatusCheck?.abort(new AbortReason(reason));
    abortStatusCheck = new AbortController();
    setOnlineStatus('no_connection');
}

export function displayOnlineStatus() {
    if (online_status == 'no_connection') {
        $('.online_status_indicator').removeClass('success');
        $('.online_status_text').text($('#API-status-top').attr('no_connection_text'));
    } else {
        $('.online_status_indicator').addClass('success');
        $('.online_status_text').text(online_status);
    }
}

/**
 * Sets the duration of JS animations.
 * @param {number} ms Duration in milliseconds. Resets to default if null.
 */
export function setAnimationDuration(ms = null) {
    animation_duration = ms ?? ANIMATION_DURATION_DEFAULT;
    // Set CSS variable to document
    document.documentElement.style.setProperty('--animation-duration', `${animation_duration}ms`);
}

/**
 * Sets the currently active character
 * @param {object|number|string} [entityOrKey] - An entity with id property (character, group, tag), or directly an id or tag key. If not provided, the active character is reset to `null`.
 */
export function setActiveCharacter(entityOrKey) {
    active_character = entityOrKey ? getTagKeyForEntity(entityOrKey) : null;
    if (active_character) active_group = null;
}

/**
 * Sets the currently active group.
 * @param {object|number|string} [entityOrKey] - An entity with id property (character, group, tag), or directly an id or tag key. If not provided, the active group is reset to `null`.
 */
export function setActiveGroup(entityOrKey) {
    active_group = entityOrKey ? getTagKeyForEntity(entityOrKey) : null;
    if (active_group) active_character = null;
}

export function startStatusLoading() {
    $('.api_loading').show();
    $('.api_button').addClass('disabled');
}

export function stopStatusLoading() {
    $('.api_loading').hide();
    $('.api_button').removeClass('disabled');
}

export function resultCheckStatus() {
    displayOnlineStatus();
    stopStatusLoading();
}

/**
 * Switches the currently selected character to the one with the given ID. (character index, not the character key!)
 *
 * If the character ID doesn't exist, if the chat is being saved, or if a group is being generated, this function does nothing.
 * If the character is different from the currently selected one, it will clear the chat and reset any selected character or group.
 * @param {number} id The ID of the character to switch to.
 * @param {object} [options] Options for the switch.
 * @param {boolean} [options.switchMenu=true] Whether to switch the right menu to the character edit menu if the character is already selected.
 * @returns {Promise<void>} A promise that resolves when the character is switched.
 */
export async function selectCharacterById(id, { switchMenu = true } = {}) {
    if (characters[id] === undefined) {
        return;
    }

    if (isChatSaving) {
        toastr.info(t`请先等待聊天保存完毕再切换角色。`, t`聊天仍在保存中…`);
        return;
    }

    if (selected_group && is_group_generating) {
        return;
    }

    if (selected_group || String(this_chid) !== String(id)) {
        //if clicked on a different character from what was currently selected
        if (!is_send_press) {
            await clearChat();
            cancelTtsPlay();
            resetSelectedGroup();
            this_edit_mes_id = undefined;
            selected_button = 'character_edit';
            setCharacterId(id);
            chat.length = 0;
            chat_metadata = {};
            await getChat();
        }
    } else {
        //if clicked on character that was already selected
        switchMenu && (selected_button = 'character_edit');
        await unshallowCharacter(this_chid);
        select_selected_character(this_chid, { switchMenu });
    }
}

function getBackBlock() {
    const template = $('#bogus_folder_back_template .bogus_folder_select').clone();
    return template;
}

async function getEmptyBlock() {
    const icons = ['fa-dragon', 'fa-otter', 'fa-kiwi-bird', 'fa-crow', 'fa-frog'];
    const texts = [t`此处有龙`, t`水獭：空空如也`, t`奇异鸟冲呀`, t`咚咚鼓点`, t`呱呱作响`];
    const roll = new Date().getMinutes() % icons.length;
    const params = {
        text: texts[roll],
        icon: icons[roll],
    };
    const emptyBlock = await renderTemplateAsync('emptyBlock', params);
    return $(emptyBlock);
}

/**
 * @param {number} hidden Number of hidden characters
 */
async function getHiddenBlock(hidden) {
    const params = {
        text: (hidden > 1 ? t`隐藏了 ${hidden} 个角色。` : t`隐藏了 ${hidden} 个角色。`),
    };
    const hiddenBlock = await renderTemplateAsync('hiddenBlock', params);
    return $(hiddenBlock);
}

function getCharacterBlock(item, id) {
    let this_avatar = default_avatar;
    if (item.avatar != 'none') {
        this_avatar = getThumbnailUrl('avatar', item.avatar);
    }
    // Populate the template
    const template = $('#character_template .character_select').clone();
    template.attr({ 'data-chid': id, 'id': `CharID${id}` });
    template.find('img').attr('src', this_avatar).attr('alt', item.name);
    template.find('.avatar').attr('title', `[Character] ${item.name}\nFile: ${item.avatar}`);
    template.find('.ch_name').text(item.name).attr('title', `[Character] ${item.name}`);
    if (power_user.show_card_avatar_urls) {
        template.find('.ch_avatar_url').text(item.avatar);
    }
    template.find('.ch_fav_icon').css('display', 'none');
    template.toggleClass('is_fav', item.fav || item.fav == 'true');
    template.find('.ch_fav').val(item.fav);

    const isAssistant = item.avatar === getPermanentAssistantAvatar();
    if (!isAssistant) {
        template.find('.ch_assistant').remove();
    }

    const description = item.data?.creator_notes || '';
    if (description) {
        template.find('.ch_description').text(description);
    }
    else {
        template.find('.ch_description').hide();
    }

    const auxFieldName = power_user.aux_field || 'character_version';
    const auxFieldValue = (item.data && item.data[auxFieldName]) || '';
    if (auxFieldValue) {
        template.find('.character_version').text(auxFieldValue);
    }
    else {
        template.find('.character_version').hide();
    }

    // Display inline tags
    const tagsElement = template.find('.tags');
    printTagList(tagsElement, { forEntityOrKey: id, tagOptions: { isCharacterList: true } });

    // Add to the list
    return template;
}

function updateCharacterCardDescription(chid, notes) {
    const card = $(`#CharID${chid}`);
    if (!card.length) {
        return;
    }

    const descriptionElement = card.find('.ch_description');
    if (!descriptionElement.length) {
        return;
    }

    if (descriptionElement.data('emptyText') === undefined) {
        descriptionElement.data('emptyText', descriptionElement.text());
    }

    const trimmed = String(notes ?? '').trim();
    if (trimmed) {
        descriptionElement.text(trimmed).show();
    } else {
        const emptyText = descriptionElement.data('emptyText') ?? '';
        descriptionElement.text(emptyText);
        descriptionElement.hide();
    }
}

/**
 * Prints the global character list, optionally doing a full refresh of the list
 * Use this function whenever the reprinting of the character list is the primary focus, otherwise using `printCharactersDebounced` is preferred for a cleaner, non-blocking experience.
 *
 * The printing will also always reprint all filter options of the global list, to keep them up to date.
 *
 * @param {boolean} fullRefresh - If true, the list is fully refreshed and the navigation is being reset
 */
export async function printCharacters(fullRefresh = false) {
    const storageKey = 'Characters_PerPage';
    const listId = '#rm_print_characters_block';

    let currentScrollTop = $(listId).scrollTop();

    if (fullRefresh) {
        saveCharactersPage = 0;
        currentScrollTop = 0;
        await delay(1);
    }

    // Before printing the personas, we check if we should enable/disable search sorting
    verifyCharactersSearchSortRule();

    // We are actually always reprinting filters, as it "doesn't hurt", and this way they are always up to date
    printTagFilters(tag_filter_type.character);
    printTagFilters(tag_filter_type.group_member);

    // We are also always reprinting the lists on character/group edit window, as these ones doesn't get updated otherwise
    applyTagsOnCharacterSelect();
    applyTagsOnGroupSelect();

    const entities = getEntitiesList({ doFilter: true });

    const pageSize = Number(accountStorage.getItem(storageKey)) || per_page_default;
    const sizeChangerOptions = [10, 25, 50, 100, 250, 500, 1000];
    $('#rm_print_characters_pagination').pagination({
        dataSource: entities,
        pageSize,
        pageRange: 1,
        pageNumber: saveCharactersPage || 1,
        position: 'top',
        showPageNumbers: false,
        showSizeChanger: true,
        prevText: '<',
        nextText: '>',
        formatNavigator: PAGINATION_TEMPLATE,
        formatSizeChanger: renderPaginationDropdown(pageSize, sizeChangerOptions),
        showNavigator: true,
        callback: async function (/** @type {Entity[]} */ data) {
            const $list = $(listId);
            const restoreScrollTop = fullRefresh ? 0 : currentScrollTop;
            const isBulkSelectActive = $list.hasClass('bulk_select');
            const shouldVirtualize = isVirtualizationEnabled()
                && data.length >= RIGHT_PANEL_VIRTUALIZE_THRESHOLD
                && !isBulkSelectActive;

            const renderLegacyList = async () => {
                if (rightPanelVirtualList) {
                    destroyRightPanelVirtualList();
                }
                $list.empty();
                if (power_user.bogus_folders && isBogusFolderOpen()) {
                    $list.append(getBackBlock());
                }
                if (!data.length) {
                    const emptyBlock = await getEmptyBlock();
                    $list.append(emptyBlock);
                }
                let displayCount = 0;
                for (const entity of data) {
                    switch (entity.type) {
                        case 'character':
                            $list.append(getCharacterBlock(entity.item, entity.id));
                            displayCount++;
                            break;
                        case 'group':
                            $list.append(getGroupBlock(entity.item));
                            displayCount++;
                            break;
                        case 'tag':
                            $list.append(getTagBlock(entity.item, entity.entities, entity.hidden, entity.isUseless));
                            break;
                    }
                }

                const hidden = (characters.length + groups.length) - displayCount;
                if (hidden > 0 && entitiesFilter.hasAnyFilter()) {
                    const hiddenBlock = await getHiddenBlock(hidden);
                    $list.append(hiddenBlock);
                }
                $list.scrollTop(restoreScrollTop);
                rightPanelLastRenderWasVirtualized = false;
                localizePagination($('#rm_print_characters_pagination'));
                eventSource.emit(event_types.CHARACTER_PAGE_LOADED);
            };

            if (!shouldVirtualize) {
                await renderLegacyList();
                return;
            }

            if (!rightPanelVirtualList) {
                $list.empty();
            }
            initRightPanelVirtualList();
            if (!rightPanelVirtualList) {
                await renderLegacyList();
                return;
            }

            const virtualItems = [];

            if (power_user.bogus_folders && isBogusFolderOpen()) {
                const backTemplate = getBackBlock();
                if (backTemplate?.length) {
                    const node = backTemplate[0];
                    virtualItems.push({
                        type: 'back',
                        key: RIGHT_PANEL_META_BACK_KEY,
                        render: () => node.cloneNode(true),
                    });
                }
            }

            if (!data.length) {
                const emptyBlock = await getEmptyBlock();
                if (emptyBlock?.length) {
                    const node = emptyBlock[0];
                    virtualItems.push({
                        type: 'empty',
                        key: RIGHT_PANEL_META_EMPTY_KEY,
                        render: () => node.cloneNode(true),
                    });
                }
            }

            let displayCount = 0;
            for (const entity of data) {
                switch (entity.type) {
                    case 'character':
                        virtualItems.push({
                            type: 'character',
                            key: RIGHT_PANEL_CHARACTER_PREFIX + String(entity.id),
                            id: entity.id,
                            entity,
                            render: () => {
                                const block = getCharacterBlock(entity.item, entity.id);
                                if (!block) {
                                    return null;
                                }
                                return block instanceof jQuery ? block.get(0) : block;
                            },
                        });
                        displayCount++;
                        break;
                    case 'group':
                        virtualItems.push({
                            type: 'group',
                            key: RIGHT_PANEL_GROUP_PREFIX + String(entity.id),
                            id: entity.id,
                            entity,
                            render: () => {
                                const block = getGroupBlock(entity.item);
                                if (!block) {
                                    return null;
                                }
                                return block instanceof jQuery ? block.get(0) : block;
                            },
                        });
                        displayCount++;
                        break;
                    case 'tag':
                        virtualItems.push({
                            type: 'tag',
                            key: RIGHT_PANEL_TAG_PREFIX + String(entity.id),
                            id: entity.id,
                            entity,
                            render: () => {
                                const block = getTagBlock(entity.item, entity.entities, entity.hidden, entity.isUseless);
                                if (!block) {
                                    return null;
                                }
                                return block instanceof jQuery ? block.get(0) : block;
                            },
                        });
                        break;
                }
            }

            const hidden = (characters.length + groups.length) - displayCount;
            if (hidden > 0 && entitiesFilter.hasAnyFilter()) {
                const hiddenBlock = await getHiddenBlock(hidden);
                if (hiddenBlock?.length) {
                    const node = hiddenBlock[0];
                    virtualItems.push({
                        type: 'hidden',
                        key: RIGHT_PANEL_META_HIDDEN_KEY,
                        render: () => node.cloneNode(true),
                    });
                }
            }

            setRightPanelVirtualItems(virtualItems, { restoreScrollTop });
            rightPanelLastRenderWasVirtualized = true;
            localizePagination($('#rm_print_characters_pagination'));
            eventSource.emit(event_types.CHARACTER_PAGE_LOADED);
        },
        afterSizeSelectorChange: function (e, size) {
            accountStorage.setItem(storageKey, e.target.value);
            paginationDropdownChangeHandler(e, size);
        },
        afterPaging: function (e) {
            saveCharactersPage = e;
        },
        afterRender: function () {
            if (!rightPanelLastRenderWasVirtualized) {
                $(listId).scrollTop(currentScrollTop);
            }
        },
    });

    favsToHotswap();
    updatePersonaConnectionsAvatarList();
}

/** Checks the state of the current search, and adds/removes the search sorting option accordingly */
function verifyCharactersSearchSortRule() {
    const searchTerm = entitiesFilter.getFilterData(FILTER_TYPES.SEARCH);
    const searchOption = $('#character_sort_order option[data-field="search"]');
    const selector = $('#character_sort_order');
    const isHidden = searchOption.attr('hidden') !== undefined;

    // If we have a search term, we are displaying the sorting option for it
    if (searchTerm && isHidden) {
        searchOption.removeAttr('hidden');
        searchOption.prop('selected', true);
        flashHighlight(selector);
    }
    // If search got cleared, we make sure to hide the option and go back to the one before
    if (!searchTerm && !isHidden) {
        searchOption.attr('hidden', '');
        $(`#character_sort_order option[data-order="${power_user.sort_order}"][data-field="${power_user.sort_field}"]`).prop('selected', true);
    }
}

/** @typedef {object} Character - A character */
/** @typedef {object} Group - A group */

/**
 * @typedef {object} Entity - Object representing a display entity
 * @property {Character|Group|import('./scripts/tags.js').Tag|*} item - The item
 * @property {string|number} id - The id
 * @property {'character'|'group'|'tag'} type - The type of this entity (character, group, tag)
 * @property {Entity[]?} [entities=null] - An optional list of entities relevant for this item
 * @property {number?} [hidden=null] - An optional number representing how many hidden entities this entity contains
 * @property {boolean?} [isUseless=null] - Specifies if the entity is useless (not relevant, but should still be displayed for consistency) and should be displayed greyed out
 */

/**
 * Converts the given character to its entity representation
 *
 * @param {Character} character - The character
 * @param {string|number} id - The id of this character
 * @returns {Entity} The entity for this character
 */
export function characterToEntity(character, id) {
    return { item: character, id, type: 'character' };
}

/**
 * Converts the given group to its entity representation
 *
 * @param {Group} group - The group
 * @returns {Entity} The entity for this group
 */
export function groupToEntity(group) {
    return { item: group, id: group.id, type: 'group' };
}

/**
 * Converts the given tag to its entity representation
 *
 * @param {import('./scripts/tags.js').Tag} tag - The tag
 * @returns {Entity} The entity for this tag
 */
export function tagToEntity(tag) {
    return { item: structuredClone(tag), id: tag.id, type: 'tag', entities: [] };
}

/**
 * Builds the full list of all entities available
 *
 * They will be correctly marked and filtered.
 *
 * @param {object} param0 - Optional parameters
 * @param {boolean} [param0.doFilter] - Whether this entity list should already be filtered based on the global filters
 * @param {boolean} [param0.doSort] - Whether the entity list should be sorted when returned
 * @returns {Entity[]} All entities
 */
export function getEntitiesList({ doFilter = false, doSort = true } = {}) {
    let entities = [
        ...characters.map((item, index) => characterToEntity(item, index)),
        ...groups.map(item => groupToEntity(item)),
        ...(power_user.bogus_folders ? tags.filter(isBogusFolder).sort(compareTagsForSort).map(item => tagToEntity(item)) : []),
    ];

    // We need to do multiple filter runs in a specific order, otherwise different settings might override each other
    // and screw up tags and search filter, sub lists or similar.
    // The specific filters are written inside the "filterByTagState" method and its different parameters.
    // Generally what we do is the following:
    //   1. First swipe over the list to remove the most obvious things
    //   2. Build sub entity lists for all folders, filtering them similarly to the second swipe
    //   3. We do the last run, where global filters are applied, and the search filters last

    // First run filters, that will hide what should never be displayed
    if (doFilter) {
        entities = filterByTagState(entities);
    }

    // Run over all entities between first and second filter to save some states
    for (const entity of entities) {
        // For folders, we remember the sub entities so they can be displayed later, even if they might be filtered
        // Those sub entities should be filtered and have the search filters applied too
        if (entity.type === 'tag') {
            let subEntities = filterByTagState(entities, { subForEntity: entity, filterHidden: false });
            const subCount = subEntities.length;
            subEntities = filterByTagState(entities, { subForEntity: entity });
            if (doFilter) {
                // sub entities filter "hacked" because folder filter should not be applied there, so even in "only folders" mode characters show up
                subEntities = entitiesFilter.applyFilters(subEntities, { clearScoreCache: false, tempOverrides: { [FILTER_TYPES.FOLDER]: FILTER_STATES.UNDEFINED }, clearFuzzySearchCaches: false });
            }
            if (doSort) {
                sortEntitiesList(subEntities, false);
            }
            entity.entities = subEntities;
            entity.hidden = subCount - subEntities.length;
        }
    }

    // Second run filters, hiding whatever should be filtered later
    if (doFilter) {
        const beforeFinalEntities = filterByTagState(entities, { globalDisplayFilters: true });
        entities = entitiesFilter.applyFilters(beforeFinalEntities, { clearFuzzySearchCaches: false });

        // Magic for folder filter. If that one is enabled, and no folders are display anymore, we remove that filter to actually show the characters.
        if (isFilterState(entitiesFilter.getFilterData(FILTER_TYPES.FOLDER), FILTER_STATES.SELECTED) && entities.filter(x => x.type == 'tag').length == 0) {
            entities = entitiesFilter.applyFilters(beforeFinalEntities, { tempOverrides: { [FILTER_TYPES.FOLDER]: FILTER_STATES.UNDEFINED }, clearFuzzySearchCaches: false });
        }
    }

    // Final step, updating some properties after the last filter run
    const nonTagEntitiesCount = entities.filter(entity => entity.type !== 'tag').length;
    for (const entity of entities) {
        if (entity.type === 'tag') {
            if (entity.entities?.length == nonTagEntitiesCount) entity.isUseless = true;
        }
    }

    // Sort before returning if requested
    if (doSort) {
        sortEntitiesList(entities, false);
    }
    entitiesFilter.clearFuzzySearchCaches();
    return entities;
}

export async function getOneCharacter(avatarUrl) {
    const response = await fetch('/api/characters/get', {
        method: 'POST',
        headers: getRequestHeaders(),
        body: JSON.stringify({
            avatar_url: avatarUrl,
        }),
    });

    if (response.ok) {
        const getData = await response.json();
        getData['name'] = DOMPurify.sanitize(getData['name']);
        getData['chat'] = String(getData['chat']);

        const indexOf = characters.findIndex(x => x.avatar === avatarUrl);

        if (indexOf !== -1) {
            characters[indexOf] = getData;
        } else {
            toastr.error(t`列表中找不到角色 ${avatarUrl}`, t`错误`, { timeOut: 5000, preventDuplicates: true });
        }
    }
}

function getCharacterSource(chId = this_chid) {
    const character = characters[chId];

    if (!character) {
        return '';
    }

    const chubId = characters[chId]?.data?.extensions?.chub?.full_path;

    if (chubId) {
        return `https://chub.ai/characters/${chubId}`;
    }

    const pygmalionId = characters[chId]?.data?.extensions?.pygmalion_id;

    if (pygmalionId) {
        return `https://pygmalion.chat/${pygmalionId}`;
    }

    const githubRepo = characters[chId]?.data?.extensions?.github_repo;

    if (githubRepo) {
        return `https://github.com/${githubRepo}`;
    }

    const sourceUrl = characters[chId]?.data?.extensions?.source_url;

    if (sourceUrl) {
        return sourceUrl;
    }

    const risuId = characters[chId]?.data?.extensions?.risuai?.source;

    if (Array.isArray(risuId) && risuId.length && typeof risuId[0] === 'string' && risuId[0].startsWith('risurealm:')) {
        const realmId = risuId[0].split(':')[1];
        return `https://realm.risuai.net/character/${realmId}`;
    }

    const perchanceSlug = characters[chId]?.data?.extensions?.perchance_data?.slug;

    if (perchanceSlug) {
        return `https://perchance.org/ai-character-chat?data=${perchanceSlug}`;
    }

    return '';
}

export async function getCharacters() {
    const response = await fetch('/api/characters/all', {
        method: 'POST',
        headers: getRequestHeaders(),
        body: JSON.stringify({}),
    });
    if (response.ok) {
        const previousAvatar = this_chid !== undefined ? characters[this_chid]?.avatar : null;
        characters.splice(0, characters.length);
        const getData = await response.json();
        for (let i = 0; i < getData.length; i++) {
            characters[i] = getData[i];
            characters[i]['name'] = DOMPurify.sanitize(characters[i]['name']);

            // For dropped-in cards
            if (!characters[i]['chat']) {
                characters[i]['chat'] = `${characters[i]['name']} - ${humanizedDateTime()}`;
            }

            characters[i]['chat'] = String(characters[i]['chat']);
        }

        if (previousAvatar) {
            const newCharacterId = characters.findIndex(x => x.avatar === previousAvatar);
            if (newCharacterId >= 0) {
                setCharacterId(newCharacterId);
                await selectCharacterById(newCharacterId, { switchMenu: false });
            } else {
                await Popup.show.text(t`错误：当前角色已不可用。`, t`页面将刷新以防止数据丢失，点击“确定”继续。`);
                return location.reload();
            }
        }

        await getGroups();
        await printCharacters(true);
    } else {
        console.error('拉取角色列表失败:', response.statusText);
        const errorData = await response.json();
        if (errorData?.overflow) {
            await Popup.show.text(t`角色数据长度已达到上限`, t`请在 config.yaml 中将 “performance.lazyLoadCharacters” 设置为 “true”，然后重启服务器。`);
        }
    }
}

async function delChat(chatfile) {
    const response = await fetch('/api/chats/delete', {
        method: 'POST',
        headers: getRequestHeaders(),
        body: JSON.stringify({
            chatfile: chatfile,
            avatar_url: characters[this_chid].avatar,
        }),
    });
    if (response.ok === true) {
        // choose another chat if current was deleted
        const name = chatfile.replace('.jsonl', '');
        if (name === characters[this_chid].chat) {
            chat_metadata = {};
            await replaceCurrentChat();
        }
        await eventSource.emit(event_types.CHAT_DELETED, name);
    }
}

/**
 * Deletes a character chat by its name.
 * @param {string} characterId Character ID to delete chat for
 * @param {string} fileName Name of the chat file to delete (without .jsonl extension)
 * @returns {Promise<void>} A promise that resolves when the chat is deleted.
 */
export async function deleteCharacterChatByName(characterId, fileName) {
    // Make sure all the data is loaded.
    await unshallowCharacter(characterId);

    /** @type {import('./scripts/char-data.js').v1CharData} */
    const character = characters[characterId];
    if (!character) {
        console.warn(`Character with ID ${characterId} not found.`);
        return;
    }

    const response = await fetch('/api/chats/delete', {
        method: 'POST',
        headers: getRequestHeaders(),
        body: JSON.stringify({
            chatfile: `${fileName}.jsonl`,
            avatar_url: character.avatar,
        }),
    });

    if (!response.ok) {
        console.error('删除角色聊天记录失败。');
        return;
    }

    if (fileName === character.chat) {
        const chatsResponse = await fetch('/api/characters/chats', {
            method: 'POST',
            headers: getRequestHeaders(),
            body: JSON.stringify({ avatar_url: character.avatar }),
        });
        const chats = Object.values(await chatsResponse.json());
        chats.sort((a, b) => sortMoments(timestampToMoment(a.last_mes), timestampToMoment(b.last_mes)));
        const newChatName = chats.length && typeof chats[0] === 'object' ? chats[0].file_name.replace('.jsonl', '') : `${character.name} - ${humanizedDateTime()}`;
        await updateRemoteChatName(characterId, newChatName);
    }

    await eventSource.emit(event_types.CHAT_DELETED, fileName);
}

export async function replaceCurrentChat() {
    await clearChat();
    chat.length = 0;

    const chatsResponse = await fetch('/api/characters/chats', {
        method: 'POST',
        headers: getRequestHeaders(),
        body: JSON.stringify({ avatar_url: characters[this_chid].avatar }),
    });

    if (chatsResponse.ok) {
        const chats = Object.values(await chatsResponse.json());
        chats.sort((a, b) => sortMoments(timestampToMoment(a.last_mes), timestampToMoment(b.last_mes)));

        // pick existing chat
        if (chats.length && typeof chats[0] === 'object') {
            characters[this_chid].chat = chats[0].file_name.replace('.jsonl', '');
            $('#selected_chat_pole').val(characters[this_chid].chat);
            saveCharacterDebounced();
            await getChat();
        }

        // start new chat
        else {
            characters[this_chid].chat = `${name2} - ${humanizedDateTime()}`;
            $('#selected_chat_pole').val(characters[this_chid].chat);
            saveCharacterDebounced();
            await getChat();
        }
    }
}

export async function showMoreMessages(messagesToLoad = null) {
    if (!isVirtualizationEnabled()) {
        let firstDisplayedMesId = Number(chatElement.children('.mes').first().attr('mesid'));
        let count = messagesToLoad || power_user.chat_truncation || Number.MAX_SAFE_INTEGER;

        if (Number.isNaN(firstDisplayedMesId)) {
            firstDisplayedMesId = getLastMessageId() + 1;
        }

        const prevHeight = chatElement.prop('scrollHeight');
        const isButtonInView = isElementInViewport($('#show_more_messages')[0]);

        while (firstDisplayedMesId > 0 && count > 0) {
            const newMessageId = firstDisplayedMesId - 1;
            addOneMessage(chat[newMessageId], { insertBefore: firstDisplayedMesId >= chat.length ? null : firstDisplayedMesId, scroll: false, forceId: newMessageId, showSwipes: false });
            count--;
            firstDisplayedMesId--;
        }

        if (firstDisplayedMesId === 0) {
            $('#show_more_messages').remove();
        }

        if (isButtonInView) {
            const newHeight = chatElement.prop('scrollHeight');
            chatElement.scrollTop(newHeight - prevHeight);
        }

        finalizeChatRender({ shouldScroll: false });
        await eventSource.emit(event_types.MORE_MESSAGES_LOADED);
        return;
    }

    initChatVirtualList();
    const button = chatElement.find('#show_more_messages');
    const prevHeight = chatElement[0].scrollHeight;
    const wasInView = button.length ? isElementInViewport(button[0]) : false;
    const countSetting = messagesToLoad || power_user.chat_truncation || Number.MAX_SAFE_INTEGER;
    chatRenderStart = Math.max(0, chatRenderStart - countSetting);
    syncChatVirtualWindow();

    if (wasInView) {
        const newHeight = chatElement[0].scrollHeight;
        const delta = newHeight - prevHeight;
        chatElement.scrollTop(chatElement.scrollTop() + delta);
    }

    finalizeChatRender({ shouldScroll: false });
    await eventSource.emit(event_types.MORE_MESSAGES_LOADED);
}

export async function printMessages() {
    if (!isVirtualizationEnabled()) {
        destroyChatVirtualList();
        chatRenderStart = 0;
        const limit = getChatWindowLimit();
        let startIndex = 0;
        let count = limit;

        chatElement.children().remove();

        if (chat.length > count) {
            startIndex = chat.length - count;
            chatElement.append('<div id="show_more_messages">展示更多消息</div>');
        }

        const fragment = document.createDocumentFragment();
        const mountedMessages = [];

        for (let i = startIndex; i < chat.length; i++) {
            const item = chat[i];
            const domNode = addOneMessage(item, { scroll: false, forceId: i, showSwipes: false, renderOnly: true });
            if (domNode instanceof Element) {
                fragment.appendChild(domNode);
                mountedMessages.push({ id: i, node: domNode, message: item });
            }
        }

        chatElement.append(fragment);

        mountedMessages.forEach(({ id, node }) => {
            registerMessageDom(id, node);
            applyCharacterTagsToMessageDivs({ mesIds: id });
            const detail = notifyMessageMounted(id, node, { reason: 'append', virtual: false });
            emitVirtualizationDomEvent(
                VIRTUALIZATION_DOM_EVENT_AFTER_RENDER,
                id,
                node,
                {
                    ...detail,
                    reason: 'append',
                    virtual: false,
                    renderOnly: false,
                },
            );
        });

        finalizeChatRender();
        return;
    }

    initChatVirtualList();
    const limit = getChatWindowLimit();
    chatRenderStart = limit >= chat.length ? 0 : Math.max(0, chat.length - limit);

    const precomputeEnd = Math.min(chat.length, chatRenderStart + limit + CHAT_OVERSCAN);

    syncChatVirtualWindow();

    const images = Array.from(chatElement.find('.mes img'));
    if (images.length) {
        await new Promise((resolve) => {
            let loaded = 0;
            const check = () => {
                loaded++;
                if (loaded >= images.length) {
                    resolve();
                }
            };
            images.forEach((img) => {
                if (img.complete) {
                    check();
                } else {
                    img.addEventListener('load', check, { once: true });
                    img.addEventListener('error', check, { once: true });
                }
            });
        });
    }

    finalizeChatRender();
}

/**
 * Cancels the debounced chat save if it is currently pending.
 */
export function cancelDebouncedChatSave() {
    if (chatSaveTimeout) {
        console.debug('已取消延迟保存聊天');
        clearTimeout(chatSaveTimeout);
        chatSaveTimeout = null;
    }
}

export async function clearChat() {
    cancelDebouncedChatSave();
    cancelDebouncedMetadataSave();
    closeMessageEditor();
    extension_prompts = {};
    if (is_delete_mode) {
        $('#dialogue_del_mes_cancel').trigger('click');
    }
    releaseDynamicStylesFromElement(chatElement.get(0));
    $('#chat').children().remove();
    messageDomRegistry.clear();
    if ($('.zoomed_avatar[forChar]').length) {
        console.debug('检测到需移除的放大头像');
        $('.zoomed_avatar[forChar]').remove();
    } else {
        console.debug('未找到放大头像，无需处理');
    }

    chatRenderStart = 0;
    if (chatVirtualList) {
        chatVirtualList.setDataLength(0);
        chatVirtualList.setWindow(0, 0);
    }
    updateShowMoreButton();

    await saveItemizedPrompts(getCurrentChatId());
    itemizedPrompts.length = 0;
}

export async function deleteLastMessage() {
    if (!chat.length) {
        return;
    }
    const removedId = chat.length - 1;
    chat.length = chat.length - 1;
    let removedElement = $('#chat').children('.mes').last();
    if (!removedElement.length) {
        const fallback = getMessageDom(removedId);
        if (fallback) {
            removedElement = $(fallback);
        }
    }
    if (removedElement.length) {
        unregisterMessageDom(removedId, removedElement.get(0));
        releaseDynamicStylesFromElement(removedElement.get(0));
        removedElement.remove();
    }
    if (chatVirtualList) {
        chatVirtualList.setDataLength(chat.length);
        syncChatVirtualWindow();
    }
    await eventSource.emit(event_types.MESSAGE_DELETED, chat.length);
}

function cloneChatMessages(messages) {
    if (!Array.isArray(messages)) {
        return [];
    }

    if (typeof structuredClone === 'function') {
        try {
            return structuredClone(messages);
        } catch (error) {
            console.warn('structuredClone 克隆聊天消息失败', error);
        }
    }

    try {
        return JSON.parse(JSON.stringify(messages));
    } catch (error) {
        console.warn('JSON 克隆聊天消息失败', error);
        return messages.map(message => ({ ...message }));
    }
}

function snapshotChatState() {
    return {
        chat: cloneChatMessages(chat),
        metadata: { ...chat_metadata },
        createDate: chat_create_date,
        extensionPrompts: { ...extension_prompts },
        itemizedPrompts: Array.isArray(itemizedPrompts) ? [...itemizedPrompts] : [],
    };
}

async function restoreChatState(state) {
    chat.splice(0, chat.length, ...cloneChatMessages(state.chat));
    chat_metadata = { ...state.metadata };
    chat_create_date = state.createDate;
    extension_prompts = { ...state.extensionPrompts };
    itemizedPrompts.splice(0, itemizedPrompts.length, ...state.itemizedPrompts);

    await printMessages();
    hideSwipeButtons();
    showSwipeButtons();

    if (chatVirtualList) {
        chatVirtualList.setDataLength(chat.length);
        syncChatVirtualWindow();
    }
}

export async function reloadCurrentChat() {
    preserveNeutralChat();
    const previousState = snapshotChatState();
    const hadPreviousMessages = previousState.chat.length > 0;
    let loadError = null;

    try {
        await clearChat();
        chat.length = 0;
        lastChatLoadFresh = false;

        if (selected_group) {
            await getGroupChat(selected_group, true);
        }
        else if (this_chid !== undefined) {
            await getChat();
        }
        else {
            resetChatState();
            restoreNeutralChat();
            await getCharacters();
            await printMessages();
            await eventSource.emit(event_types.CHAT_CHANGED, getCurrentChatId());
        }
    } catch (error) {
        console.error('聊天刷新失败', error);
        loadError = error;
    }

    if (loadError || (hadPreviousMessages && lastChatLoadFresh)) {
        console.warn('聊天刷新为空或失败，正在恢复上一次的聊天状态', loadError);
        await restoreChatState(previousState);
        lastChatLoadFresh = false;
        toastr.warning(t`聊天记录未能成功刷新，已恢复为刷新前的内容。请检查聊天文件或稍后重试。`);
        return;
    }

    hideSwipeButtons();
    showSwipeButtons();
}

async function handleChatInputSubmission({ source = 'ui', draftOverride, generateTypeOverride } = {}) {
    if (is_send_press) {
        return { canceled: true, reason: 'busy' };
    }
    if (isExecutingCommandsFromChatInput) {
        return { canceled: true, reason: 'command_execution' };
    }
    if (this_edit_mes_id) {
        return { canceled: true, reason: 'editing' };
    }

    const textarea = ensureChatInputDomListeners() ?? getChatTextareaElement();
    let draft = draftOverride;
    if (draft === undefined) {
        draft = textarea ? textarea.value ?? '' : String($('#send_textarea').val() ?? '');
    }
    if (draft == null) {
        draft = '';
    }
    if (typeof draft !== 'string') {
        draft = String(draft);
    }

    let generateType = generateTypeOverride;
    const hasOverrideGenerateType = generateTypeOverride !== undefined;

    if (generateType === undefined) {
        if (power_user.continue_on_send &&
            !hasPendingFileAttachment() &&
            !draft &&
            !selected_group &&
            chat.length &&
            !chat[chat.length - 1]['is_user'] &&
            !chat[chat.length - 1]['is_system']
        ) {
            generateType = 'continue';
        }
    }

    const pipeline = await runChatInputSubmitPipeline({
        text: draft,
        generateType,
        source,
        textarea,
    });

    if (pipeline.canceled) {
        return { canceled: true, reason: 'cancelled_by_handler' };
    }

    const pipelineOverrideGenerateType = pipeline.generateType !== undefined;
    if (pipeline.text !== undefined) {
        draft = typeof pipeline.text === 'string' ? pipeline.text : String(pipeline.text ?? '');
    }
    if (pipelineOverrideGenerateType) {
        generateType = pipeline.generateType;
    }

    if (!pipelineOverrideGenerateType && !hasOverrideGenerateType && generateType === 'continue' && draft) {
        generateType = undefined;
    }

    if (textarea) {
        if (textarea.value !== draft) {
            const selectionPosition = draft.length;
            textarea.value = draft;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            try {
                textarea.setSelectionRange(selectionPosition, selectionPosition);
            } catch {
                // ignore selection errors in unsupported browsers
            }
        }
    } else {
        $('#send_textarea').val(draft).trigger('input');
    }

    if (!pipelineOverrideGenerateType && !hasOverrideGenerateType && generateType === undefined) {
        if (power_user.continue_on_send &&
            !hasPendingFileAttachment() &&
            !draft &&
            !selected_group &&
            chat.length &&
            !chat[chat.length - 1]['is_user'] &&
            !chat[chat.length - 1]['is_system']
        ) {
            generateType = 'continue';
        }
    }

    if (draft && !selected_group && this_chid === undefined && name2 !== neutralCharacterName) {
        await newAssistantChat({ temporary: false });
    }

    const result = await Generate(generateType);
    return { canceled: false, generateType, result };
}

/**
 * Send the message currently typed into the chat box.
 */
export async function sendTextareaMessage(options) {
    let submitOptions = options;
    if (submitOptions && typeof submitOptions === 'object' && !Array.isArray(submitOptions)) {
        const isEventLike = 'preventDefault' in submitOptions && 'target' in submitOptions &&
            !('text' in submitOptions) && !('source' in submitOptions) && !('generateType' in submitOptions);
        if (isEventLike) {
            submitOptions.preventDefault?.();
            submitOptions = undefined;
        }
    } else {
        submitOptions = undefined;
    }

    const normalized = submitOptions && typeof submitOptions === 'object'
        ? submitOptions
        : undefined;

    const draftOverride = normalized && typeof normalized.text === 'string' ? normalized.text : undefined;
    const generateTypeOverride = normalized ? normalized.generateType : undefined;
    const source = normalized && typeof normalized.source === 'string' ? normalized.source : 'ui';

    return handleChatInputSubmission({
        source,
        draftOverride,
        generateTypeOverride,
    });
}

function convertMarkdownWithCache(markdownSource) {
    if (!markdownSource) {
        return '';
    }

    if (markdownSource.length < SHOWDOWN_CACHE_THRESHOLD) {
        return converter.makeHtml(markdownSource);
    }

    const cached = showdownHtmlCache.get(markdownSource);
    if (cached) {
        return cached;
    }

    const rendered = converter.makeHtml(markdownSource);
    showdownHtmlCache.set(markdownSource, rendered);

    if (showdownHtmlCache.size > SHOWDOWN_CACHE_LIMIT) {
        const firstKey = showdownHtmlCache.keys().next();
        if (!firstKey.done) {
            showdownHtmlCache.delete(firstKey.value);
        }
    }

    return rendered;
}


function preprocessMessageForRender({
    mes,
    ch_name,
    isSystem,
    isUser,
    messageId,
    sanitizerOverrides,
    isReasoning,
}) {
    let workText = mes ?? '';
    const chatMessage = chat?.[messageId];

    if (Number(messageId) === 0 && !isSystem && !isUser && !isReasoning) {
        const mesBeforeReplace = workText;
        workText = substituteParams(workText, undefined, ch_name);
        if (chatMessage && chatMessage.mes === mesBeforeReplace && chatMessage.extra?.display_text !== mesBeforeReplace) {
            chatMessage.mes = workText;
        }
    }

    mesForShowdownParse = workText;

    if (ch_name === COMMENT_NAME_DEFAULT && isSystem && !isUser) {
        isSystem = false;
    }

    if (isSystem && ch_name !== systemUserName) {
        isSystem = false;
    }

    const replacedPromptBias = power_user.user_prompt_bias && substituteParams(power_user.user_prompt_bias);
    if (!power_user.show_user_prompt_bias && ch_name && !isUser && !isSystem && replacedPromptBias && workText.startsWith(replacedPromptBias)) {
        workText = workText.slice(replacedPromptBias.length);
    }

    if (!isSystem) {
        const usableMessages = chat.map((x, index) => ({ message: x, index })).filter(x => !x.message.is_system);

        function getRegexPlacement() {
            try {
                if (isReasoning) {
                    return regex_placement.REASONING;
                }
                if (isUser) {
                    return regex_placement.USER_INPUT;
                } else if (chat[messageId]?.extra?.type === 'narrator') {
                    return regex_placement.SLASH_COMMAND;
                } else {
                    return regex_placement.AI_OUTPUT;
                }
            } catch {
                return regex_placement.AI_OUTPUT;
            }
        }

        const regexPlacement = getRegexPlacement();
        const indexOf = usableMessages.findIndex(x => x.index === Number(messageId));
        const depth = messageId >= 0 && indexOf !== -1 ? (usableMessages.length - indexOf - 1) : undefined;

        workText = getRegexedString(workText, regexPlacement, {
            characterOverride: ch_name,
            isMarkdown: true,
            depth,
        });
    }

    if (power_user.auto_fix_generated_markdown) {
        workText = fixMarkdown(workText, true);
    }

    if (!isSystem && power_user.encode_tags) {
        workText = workText.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
    }

    [power_user.reasoning.prefix, power_user.reasoning.suffix].forEach((reasoningString) => {
        if (!reasoningString || !reasoningString.trim().length) {
            return;
        }
        if (workText.includes(reasoningString)) {
            workText = workText.replace(reasoningString, escapeHtml(reasoningString));
        }
    });

    if (!isSystem) {
        if (!power_user.encode_tags) {
            workText = workText.replace(/<([^>]+)>/g, function (_, contents) {
                return '<' + contents.replace(/\"/g, '\ufffe') + '>';
            });
        }

        workText = workText.replace(
            /<style>[\s\S]*?<\/style>|```[\s\S]*?```|~~~[\s\S]*?~~~|``[\s\S]*?``|`[\s\S]*?`|(\".*?\")|(\u201C.*?\u201D)|(\u00AB.*?\u00BB)|(\u300C.*?\u300D)|(\u300E.*?\u300F)|(\uFF02.*?\uFF02)/gim,
            function (match, p1, p2, p3, p4, p5, p6) {
                if (p1) {
                    return `<q>"${p1.slice(1, -1)}"</q>`;
                } else if (p2) {
                    return `<q>“${p2.slice(1, -1)}”</q>`;
                } else if (p3) {
                    return `<q>«${p3.slice(1, -1)}»</q>`;
                } else if (p4) {
                    return `<q>「${p4.slice(1, -1)}」</q>`;
                } else if (p5) {
                    return `<q>『${p5.slice(1, -1)}』</q>`;
                } else if (p6) {
                    return `<q>＂${p6.slice(1, -1)}＂</q>`;
                }
                return match;
            },
        );

        if (!power_user.encode_tags) {
            workText = workText.replace(/\ufffe/g, '"');
        }

        workText = workText.replaceAll('\\begin{align*}', '$$');
        workText = workText.replaceAll('\\end{align*}', '$$');
    }

    const sanitizerConfig = {
        RETURN_DOM: false,
        RETURN_DOM_FRAGMENT: false,
        RETURN_TRUSTED_TYPE: false,
        MESSAGE_SANITIZE: true,
        ADD_TAGS: ['custom-style'],
        ...sanitizerOverrides,
    };

    const cacheOptions = {
        sanitizerOverrides,
        encodeTags: power_user.encode_tags,
        allowName2Display: power_user.allow_name2_display,
        autoFixMarkdown: power_user.auto_fix_generated_markdown,
        isSystem,
        isReasoning,
    };

    return {
        textForMarkdown: workText,
        isSystem,
        chatMessage,
        sanitizerConfig,
        cacheOptions,
    };
}

function finalizeRenderedHtml(html, sanitizerConfig) {
    let result = html ?? '';
    result = encodeStyleTags(result);
    result = DOMPurify.sanitize(result, sanitizerConfig);
    result = decodeStyleTags(result, { prefix: '.mes_text ' });
    return retainLargeTemplatePlaceholder(result);
}

function renderMarkdownSync(source) {
    if (!source) {
        return '';
    }
    let html = convertMarkdownWithCache(source) ?? '';
    html = html
        .replace(/<code(.*)>[\s\S]*?<\/code>/g, (match) => match.replace(/\n/gm, '\u0000'))
        .replace(/\u0000/g, '\n')
        .replace(/<code(.*)>[\s\S]*?<\/code>/g, (match) => match.replace(/&amp;/g, '&'))
        .trim();
    return html;
}

function scheduleMessageRender({
    message,
    cacheKey,
    textForMarkdown,
    sanitizerConfig,
    normalizedSystem,
    ch_name,
    isUser,
}) {
    if (!message || !cacheKey) {
        return '';
    }

    if (isRenderCacheReady(message, cacheKey)) {
        return getCachedHtml(message, cacheKey) ?? '';
    }

    let html = normalizedSystem ? textForMarkdown : renderMarkdownSync(textForMarkdown);

    if (!normalizedSystem && !power_user.allow_name2_display && ch_name && !isUser) {
        html = html.replace(new RegExp(`(^|\n)${escapeRegex(ch_name)}:`, 'g'), '$1');
    }

    const finalized = finalizeRenderedHtml(html, sanitizerConfig);

    setMessageRenderCache(message, {
        key: cacheKey,
        html: finalized,
        pending: null,
        error: null,
    });

    return finalized;
}

export function prepareMessageRender(mes, ch_name, isSystem, isUser, messageId, sanitizerOverrides = {}, isReasoning = false) {
    const {
        textForMarkdown,
        isSystem: normalizedSystem,
        chatMessage,
        sanitizerConfig,
        cacheOptions,
    } = preprocessMessageForRender({
        mes,
        ch_name,
        isSystem,
        isUser,
        messageId,
        sanitizerOverrides,
        isReasoning,
    });

    if (!chatMessage || !textForMarkdown) {
        return '';
    }

    const cacheKey = buildRenderCacheKey(textForMarkdown, cacheOptions);
    if (isRenderCacheReady(chatMessage, cacheKey)) {
        return getCachedHtml(chatMessage, cacheKey) ?? '';
    }

    return scheduleMessageRender({
        message: chatMessage,
        cacheKey,
        textForMarkdown,
        sanitizerConfig,
        normalizedSystem,
        ch_name,
        isUser,
    }) ?? '';
}

/**
 * Formats the message text into an HTML string using Markdown and other formatting.
 * @param {string} mes Message text
 * @param {string} ch_name Character name
 * @param {boolean} isSystem If the message was sent by the system
 * @param {boolean} isUser If the message was sent by the user
 * @param {number} messageId Message index in chat array
 * @param {object} [sanitizerOverrides] DOMPurify sanitizer option overrides
 * @param {boolean} [isReasoning] If the message is reasoning output
 * @returns {string} HTML string
 */
export function messageFormatting(mes, ch_name, isSystem, isUser, messageId, sanitizerOverrides = {}, isReasoning = false) {
    if (!mes) {
        return '';
    }

    const {
        textForMarkdown,
        isSystem: normalizedSystem,
        chatMessage,
        sanitizerConfig,
        cacheOptions,
    } = preprocessMessageForRender({
        mes,
        ch_name,
        isSystem,
        isUser,
        messageId,
        sanitizerOverrides,
        isReasoning,
    });

    const cacheKey = buildRenderCacheKey(textForMarkdown, cacheOptions);
    if (!normalizedSystem && chatMessage) {
        const cached = getCachedHtml(chatMessage, cacheKey);
        if (cached) {
            return cached;
        }
    }

    let html = normalizedSystem ? textForMarkdown : renderMarkdownSync(textForMarkdown);

    if (!power_user.allow_name2_display && ch_name && !isUser && !normalizedSystem) {
        html = html.replace(new RegExp(`(^|\n)${escapeRegex(ch_name)}:`, 'g'), '$1');
    }

    const finalHtml = finalizeRenderedHtml(html, sanitizerConfig);

    if (chatMessage) {
        setMessageRenderCache(chatMessage, {
            key: cacheKey,
            html: finalHtml,
            pending: null,
            error: null,
        });
    }

    return finalHtml;
}

/**
 * Inserts or replaces an SVG icon adjacent to the provided message's timestamp.
 *
 * If the `extra.api` is "openai" and `extra.model` contains the substring "claude",
 * the function fetches the "claude.svg". Otherwise, it fetches the SVG named after
 * the value in `extra.api`.
 *
 * @param {JQuery<HTMLElement>} mes - The message element containing the timestamp where the icon should be inserted or replaced.
 * @param {Object} extra - Contains the API and model details.
 * @param {string} extra.api - The name of the API, used to determine which SVG to fetch.
 * @param {string} extra.model - The model name, used to check for the substring "claude".
 */
function insertSVGIcon(mes, extra) {
    // Determine the SVG filename
    let modelName;

    // Claude on OpenRouter or Anthropic
    if (extra.api === 'openai' && extra.model?.toLowerCase().includes('claude')) {
        modelName = 'claude';
    }
    // OpenAI on OpenRouter
    else if (extra.api === 'openai' && extra.model?.toLowerCase().includes('openai')) {
        modelName = 'openai';
    }
    // OpenRouter website model or other models
    else if (extra.api === 'openai' && (extra.model === null || extra.model?.toLowerCase().includes('/'))) {
        modelName = 'openrouter';
    }
    // Everything else
    else {
        modelName = extra.api;
    }

    const insertOrReplaceSVG = (image, className, targetSelector, insertBefore) => {
        image.onload = async function () {
            let existingSVG = insertBefore ? mes.find(targetSelector).prev(`.${className}`) : mes.find(targetSelector).next(`.${className}`);
            if (existingSVG.length) {
                existingSVG.replaceWith(image);
            } else {
                if (insertBefore) mes.find(targetSelector).before(image);
                else mes.find(targetSelector).after(image);
            }
            await SVGInject(image);
        };
    };

    const createModelImage = (className, targetSelector, insertBefore) => {
        const image = new Image();
        image.classList.add('icon-svg', className);
        image.src = `/img/${modelName}.svg`;
        image.title = `${extra?.api ? extra.api + ' - ' : ''}${extra?.model ?? ''}`;
        insertOrReplaceSVG(image, className, targetSelector, insertBefore);
    };

    createModelImage('timestamp-icon', '.timestamp');
    createModelImage('thinking-icon', '.mes_reasoning_header_title', true);
}


function appendMessageHtml(target, html) {
    if (!(target instanceof Element)) {
        return;
    }
    if (!html) {
        target.textContent = '';
        return;
    }
    if (html.length >= RENDER_SPLIT_THRESHOLD) {
        const template = document.createElement('template');
        template.innerHTML = html;
        target.appendChild(template.content);
    } else {
        target.insertAdjacentHTML('beforeend', html);
    }
}

function getMessageFromTemplate(params) {
    const mes = createMessageElement();
    const mes$ = $(mes);

    const {
        mesId,
        swipeId,
        characterName,
        isUser,
        avatarImg,
        bias,
        isSystem,
        title,
        timerValue,
        timerTitle,
        bookmarkLink,
        forceAvatar,
        timestamp,
        tokenCount,
        extra,
        type,
    } = params;

    const renderingPayload = {
        params: {
            mesId,
            swipeId,
            characterName,
            isUser,
            avatarImg,
            bias,
            isSystem,
            title,
            timerValue,
            timerTitle,
            bookmarkLink,
            forceAvatar,
            timestamp,
            tokenCount,
            extra,
            type,
        },
        timestamp,
        title,
    };

    applyMessageDomMapping(mes, renderingPayload);

    if (bookmarkLink) {
        updateBookmarkDisplay(mes$, bookmarkLink);
    }

    updateReasoningUI(mes);

    if (power_user.timestamp_model_icon && extra?.api) {
        insertSVGIcon(mes$, extra);
    }

    return mes;
}

/**
 * Re-renders a message block with updated content.
 * @param {number} messageId Message ID
 * @param {object} message Message object
 * @param {object} [options={}] Optional arguments
 * @param {boolean} [options.rerenderMessage=true] Whether to re-render the message content (inside <c>.mes_text</c>)
 */
export function updateMessageBlock(messageId, message, { rerenderMessage = true } = {}) {
    const messageElement = $(`#chat [mesid="${messageId}"]`);
    if (rerenderMessage) {
        const text = message?.extra?.display_text ?? message.mes;
        const mesText = messageElement.find('.mes_text');
        const previousHtml = mesText.html();
        const nextHtml = messageFormatting(text, message.name, message.is_system, message.is_user, messageId, {}, false);
        const shouldUpdate = previousHtml !== nextHtml;

        if (shouldUpdate) {
            const mesTextRoot = mesText.get(0);
            releaseDynamicStylesFromElement(mesTextRoot);
            mesText.html(nextHtml);
        }

        enableLazyMediaResources(messageElement);
        queuePostHydrationTasks(messageElement, {
            phase: 'after-update',
            message,
            messageId,
            reason: 'rerender',
            skipHydration: !shouldUpdate,
            diffSkipped: !shouldUpdate,
        });
    }

    updateReasoningUI(messageElement);

    addCopyToCodeBlocks(messageElement);
    appendMediaToMessage(message, messageElement);
}

/**
 * Appends image or file to the message element.
 * @param {object} mes Message object
 * @param {JQuery<HTMLElement>} messageElement Message element
 * @param {boolean} [adjustScroll=true] Whether to adjust the scroll position after appending the media
 */
export function appendMediaToMessage(mes, messageElement, adjustScroll = true) {
    // Add image to message
    if (mes.extra?.image) {
        let container = messageElement.find('.mes_img_container');
        if (!container.length) {
            const template = $('#message_image_template .mes_img_container').first().clone();
            if (template.length) {
                messageElement.find('.mes_block').append(template);
                container = template;
            }
        }
        if (!container.length) {
            messageElement.find('.mes_text').removeClass('displayNone');
            return;
        }
        const chatHeight = $('#chat').prop('scrollHeight');
        const image = container.find('.mes_img');
        const imageNode = image.get(0);
        const text = messageElement.find('.mes_text');
        const isInline = !!mes.extra?.inline_image;
        const imageSrc = typeof mes.extra?.image === 'string' ? mes.extra.image : '';
        const doAdjustScroll = () => {
            if (!adjustScroll) {
                return;
            }
            const scrollPosition = $('#chat').scrollTop();
            const newChatHeight = $('#chat').prop('scrollHeight');
            const diff = newChatHeight - chatHeight;
            $('#chat').scrollTop(scrollPosition + diff);
        };
        image.off('load').on('load', function () {
            if (!(this instanceof HTMLImageElement)) {
                return;
            }
            const meta = getManagedLazyImageMeta(this);
            if (meta) {
                meta.loading = false;
                meta.loaded = true;
                this.setAttribute(MANAGED_LAZY_STATE_ATTR, MANAGED_LAZY_STATE_LOADED);
            }
            this.removeAttribute('alt');
            $(this).removeClass('error');
            doAdjustScroll();
        });
        image.off('error').on('error', function () {
            if (!(this instanceof HTMLImageElement)) {
                return;
            }
            const meta = getManagedLazyImageMeta(this);
            if (meta) {
                meta.loading = false;
                meta.failed = true;
            }
            this.setAttribute('alt', '');
            $(this).addClass('error');
            doAdjustScroll();
        });
        image.attr('title', mes.extra?.title || mes.title || '');
        image.attr('loading', 'lazy');
        image.attr('decoding', 'async');
        if (!image.attr('referrerpolicy')) {
            image.attr('referrerpolicy', 'no-referrer');
        }
        if (imageNode && imageSrc) {
            image.attr('data-managed-src', imageSrc);
            registerChatLazyImage(imageNode, imageSrc, {
                allowSuspend: !isInline,
                releaseOnSuspend: false,
                releaseOnCleanup: imageSrc.startsWith('blob:'),
                retryOnError: true,
            });
        } else if (imageNode) {
            cleanupManagedLazyImages(imageNode, { release: true });
            image.removeAttr('src');
            image.removeAttr('data-managed-src');
        }
        container.addClass('img_extra');
        image.toggleClass('img_inline', isInline);
        text.toggleClass('displayNone', !isInline);

        const imageSwipes = mes.extra.image_swipes;
        if (Array.isArray(imageSwipes) && imageSwipes.length > 0) {
            container.addClass('img_swipes');
            const counter = container.find('.mes_img_swipe_counter');
            const currentImage = imageSwipes.indexOf(mes.extra.image) + 1;
            counter.text(`${currentImage}/${imageSwipes.length}`);

            const swipeLeft = container.find('.mes_img_swipe_left');
            swipeLeft.off('click').on('click', function () {
                eventSource.emit(event_types.IMAGE_SWIPED, { message: mes, element: messageElement, direction: 'left' });
            });

            const swipeRight = container.find('.mes_img_swipe_right');
            swipeRight.off('click').on('click', function () {
                eventSource.emit(event_types.IMAGE_SWIPED, { message: mes, element: messageElement, direction: 'right' });
            });
        } else {
            container.removeClass('img_swipes');
            container.find('.mes_img_swipe_counter').text('1/1');
            container.find('.mes_img_swipe_left').off('click');
            container.find('.mes_img_swipe_right').off('click');
        }
    } else {
        const container = messageElement.find('.mes_img_container');
        if (container.length) {
            cleanupManagedLazyImages(container.get(0), { release: true });
            container.remove();
        }
        const text = messageElement.find('.mes_text');
        text.removeClass('displayNone');
    }

    // Add video to message
    if (mes.extra?.video) {
        const container = $('#message_video_template .mes_video_container').clone();
        messageElement.find('.mes_video_container').remove();
        messageElement.find('.mes_block').append(container);
        const chatHeight = $('#chat').prop('scrollHeight');
        const video = container.find('.mes_video');
        video.attr('preload', 'metadata');
        video.off('loadedmetadata').on('loadedmetadata', function () {
            if (!adjustScroll) {
                return;
            }
            const scrollPosition = $('#chat').scrollTop();
            const newChatHeight = $('#chat').prop('scrollHeight');
            const diff = newChatHeight - chatHeight;
            $('#chat').scrollTop(scrollPosition + diff);
        });

        video.attr('src', mes.extra?.video);
    } else {
        messageElement.find('.mes_video_container').remove();
    }

    // Add file to message
    if (mes.extra?.file) {
        messageElement.find('.mes_file_container').remove();
        const messageId = messageElement.attr('mesid');
        const template = $('#message_file_template .mes_file_container').clone();
        template.find('.mes_file_name').text(mes.extra.file.name);
        template.find('.mes_file_size').text(humanFileSize(mes.extra.file.size));
        template.find('.mes_file_download').attr('mesid', messageId);
        template.find('.mes_file_delete').attr('mesid', messageId);
        messageElement.find('.mes_block').append(template);
    } else {
        messageElement.find('.mes_file_container').remove();
    }
}

/**
 * @deprecated Use appendMediaToMessage instead.
 */
export function appendImageToMessage(mes, messageElement) {
    appendMediaToMessage(mes, messageElement);
}

function enableLazyMediaResources(messageElement) {
    if (!messageElement || typeof messageElement.find !== 'function') {
        return;
    }

    const images = messageElement.find('.mes_text img').get();
    images.forEach((node) => {
        if (node instanceof HTMLImageElement) {
            node.loading = node.loading || 'lazy';
            node.decoding = node.decoding || 'async';
            node.referrerPolicy = node.referrerPolicy || 'no-referrer';
        }
    });

    const avatarImages = messageElement.find('.avatar img').get();
    avatarImages.forEach((node) => {
        if (!(node instanceof HTMLImageElement)) {
            return;
        }
        const originalSrc = resolveAvatarSource(node);
        if (!originalSrc) {
            return;
        }
        node.setAttribute('data-avatar-src', originalSrc);
        node.setAttribute('data-original-src', originalSrc);
        node.loading = node.loading || 'lazy';
        node.decoding = node.decoding || 'async';
        node.referrerPolicy = node.referrerPolicy || 'no-referrer';
        registerChatLazyImage(node, originalSrc, {
            allowSuspend: false,
            releaseOnSuspend: false,
            releaseOnCleanup: false,
            retryOnError: true,
        });
    });

    const frames = messageElement.find('.mes_text iframe').get();
    frames.forEach((node) => {
        if (node instanceof HTMLIFrameElement && !node.loading) {
            node.loading = 'lazy';
        }
    });
}

export function addCopyToCodeBlocks(messageElement) {
    const codeBlocks = $(messageElement).find('pre code');
    for (let i = 0; i < codeBlocks.length; i++) {
        hljs.highlightElement(codeBlocks.get(i));
        const copyButton = document.createElement('i');
        copyButton.classList.add('fa-solid', 'fa-copy', 'code-copy', 'interactable');
        copyButton.title = 'Copy code';
        codeBlocks.get(i).appendChild(copyButton);
        copyButton.addEventListener('click', function (e) {
            e.stopPropagation();
        });
        addManagedEventListener(copyButton, 'pointerup', async function () {
            const text = codeBlocks.get(i).innerText;
            await copyText(text);
            toastr.info(t`已复制！`, '', { timeOut: 2000 });
        });
    }
}


/**
 * Adds a single message to the chat.
 * @param {object} mes Message object
 * @param {object} [options] Options
 * @param {string} [options.type='normal'] Message type
 * @param {number} [options.insertAfter=null] Message ID to insert the new message after
 * @param {boolean} [options.scroll=true] Whether to scroll to the new message
 * @param {number} [options.insertBefore=null] Message ID to insert the new message before
 * @param {number} [options.forceId=null] Force the message ID
 * @param {boolean} [options.showSwipes=true] Whether to show swipe buttons
 * @returns {void}
 */
export function addOneMessage(mes, { type = 'normal', insertAfter = null, scroll = true, insertBefore = null, forceId = null, showSwipes = true, renderOnly = false } = {}) {
    if (renderOnly && type === 'swipe') {
        return null;
    }

    const container = renderOnly ? $('<div></div>') : chatElement;
    if (type === 'swipe' && mes.swipe_id === undefined) {
        mes.swipe_id = 0;
        mes.swipes = [mes.mes];
    }

    const renderingData = buildMessageRenderingData(
        mes,
        { forceId, type },
        chatRenderingEnv,
    );
    const {
        params,
        formattedText: messageText,
        timestamp,
        title,
    } = renderingData;

    emitVirtualizationDomEvent(
        VIRTUALIZATION_DOM_EVENT_BEFORE_MOUNT,
        params.mesId,
        null,
        {
            reason: 'before-mount',
            virtual: isVirtualizationEnabled(),
            renderOnly,
            rawMessage: mes,
            options: { type, insertAfter, insertBefore, forceId, scroll, showSwipes },
        },
    );

    const renderedMessage = getMessageFromTemplate(params);

    if (type !== 'swipe') {
        if (!insertAfter && !insertBefore) {
            container.append(renderedMessage);
        } else if (insertAfter) {
            const target = container.find(`.mes[mesid="${insertAfter}"]`);
            $(renderedMessage).insertAfter(target);
        } else {
            const target = container.find(`.mes[mesid="${insertBefore}"]`);
            $(renderedMessage).insertBefore(target);
        }
    }

    const newMessageId = typeof forceId === 'number' ? forceId : chat.length - 1;
    const newMessage = container.find(`.mes[mesid="${newMessageId}"]`);

    if (newMessage.length) {
        applyMessageDomMapping(newMessage, renderingData);
        applyMessageStateClasses(newMessage, {
            isSmallSystem: mes?.extra?.isSmallSys === true,
            hasToolInvocation: Array.isArray(mes?.extra?.tool_invocations),
        });
    }

    if (!renderOnly && newMessage.length) {
        registerMessageDom(newMessageId, newMessage.get(0));
    }

    const mesIdToFind = type === 'swipe' ? params.mesId - 1 : params.mesId;

    if (params.isUser === false && Array.isArray(itemizedPrompts) && itemizedPrompts.length > 0) {
        const itemizedPrompt = itemizedPrompts.find(x => Number(x.mesId) === Number(mesIdToFind));
        if (itemizedPrompt) {
            newMessage.find('.mes_prompt').show();
        }
    }

    newMessage.find('.avatar img').on('error', function () {
        $(this).hide();
        $(this).parent().html('<div class="missing-avatar fa-solid fa-user-slash"></div>');
    });

    const shouldScrollToEnd = !insertAfter && !insertBefore && scroll;

    const finalizeAfterContent = () => {
        enableLazyMediaResources(newMessage);
        appendMediaToMessage(mes, newMessage);
        queuePostHydrationTasks(newMessage, {
            phase: 'after-mount',
            message: mes,
            messageId: newMessageId,
            reason: type,
        });

        if (type !== 'swipe' && chatVirtualList) {
            const mediaNodes = newMessage.find('img, video').get();
            mediaNodes.forEach((media) => {
                if (!(media instanceof HTMLElement)) return;
                const queueMutate = () => queueVirtualListUpdate(newMessageId, newMessage.get(0), { mutate: true, measure: true });
                media.addEventListener('load', queueMutate, { once: true });
                media.addEventListener('error', queueMutate, { once: true });
            });
            if (!renderOnly) {
                queueVirtualListUpdate(newMessageId, newMessage.get(0), { measure: true });
            }
        }

        addCopyToCodeBlocks(newMessage);

        if (!renderOnly && !params.isUser && newMessageId !== 0 && newMessageId !== chat.length - 1) {
            const swipesNum = chat[newMessageId].swipes?.length;
            const swipeId = chat[newMessageId].swipe_id + 1;
            newMessage.find('.swipes-counter').text(formatSwipeCounter(swipeId, swipesNum));
        }

        if (!renderOnly) {
            if (isVirtualizationEnabled()) {
                initChatVirtualList();
                updateChatWindowAfterAppend(type, insertAfter, insertBefore, forceId);
                finalizeChatRender({ shouldScroll: shouldScrollToEnd });
            } else {
                if (showSwipes) {
                    hideSwipeButtons();
                }
                finalizeChatRender({ shouldScroll: shouldScrollToEnd });
            }
            applyCharacterTagsToMessageDivs({ mesIds: newMessageId });
            const mountedDetail = notifyMessageMounted(newMessageId, newMessage.get(0), { reason: 'append', virtual: false });
            emitVirtualizationDomEvent(
                VIRTUALIZATION_DOM_EVENT_AFTER_RENDER,
                newMessageId,
                newMessage.get(0),
                {
                    ...mountedDetail,
                    reason: 'append',
                    virtual: false,
                    renderOnly: false,
                },
            );
            return;
        }

        const domNode = newMessage.get(0);
        emitVirtualizationDomEvent(
            VIRTUALIZATION_DOM_EVENT_AFTER_RENDER,
            newMessageId,
            domNode,
            {
                reason: 'render-only',
                virtual: true,
                renderOnly: true,
            },
        );
        newMessage.detach();
        return domNode;
    };

    if (type === 'swipe') {
        newMessage.attr('swipeid', params.swipeId);
        const swipeTextRoot = newMessage.find('.mes_text').get(0);
        releaseDynamicStylesFromElement(swipeTextRoot);
        newMessage.find('.mes_text').html(messageText).attr('title', title);
        newMessage.find('.timestamp').text(timestamp).attr('title', `${params.extra.api} - ${params.extra.model}`);
        updateReasoningUI(newMessage);

        if (power_user.timestamp_model_icon && params.extra?.api) {
            insertSVGIcon(newMessage, params.extra);
        }

        if (mes.swipe_id == mes.swipes.length - 1) {
            newMessage.find('.mes_timer').text(params.timerValue).attr('title', params.timerTitle);
            newMessage.find('.tokenCounterDisplay').text(`${params.tokenCount}t`);
        } else {
            newMessage.find('.mes_timer').empty();
            newMessage.find('.tokenCounterDisplay').empty();
        }

        return finalizeAfterContent();
    } else {
        const textRoot = newMessage.find('.mes_text').get(0);
        releaseDynamicStylesFromElement(textRoot);
        appendMessageHtml(textRoot, messageText);

        if (!renderOnly && messageText.length >= RENDER_SPLIT_THRESHOLD) {
            scheduleRenderTask(finalizeAfterContent, 'media');
            return;
        }

        return finalizeAfterContent();
    }
}

/**
 * Returns the URL of the avatar for the given character Id.
 * @param {number|string} characterId Character Id
 * @returns {string} Avatar URL
 */
export function getCharacterAvatar(characterId) {
    const character = characters[characterId];
    const avatarImg = character?.avatar;

    if (!avatarImg || avatarImg === 'none') {
        return default_avatar;
    }

    return formatCharacterAvatar(avatarImg);
}

export function formatCharacterAvatar(characterAvatar) {
    return `characters/${characterAvatar}`;
}

/**
 * Formats the title for the generation timer.
 * @param {Date} gen_started Date when generation was started
 * @param {Date} gen_finished Date when generation was finished
 * @param {number} tokenCount Number of tokens generated (0 if not available)
 * @param {number?} [reasoningDuration=null] Reasoning duration (null if no reasoning was done)
 * @param {number?} [timeToFirstToken=null] Time to first token
 * @returns {Object} Object containing the formatted timer value and title
 * @example
 * const { timerValue, timerTitle } = formatGenerationTimer(gen_started, gen_finished, tokenCount);
 * console.log(timerValue); // 1.2s
 * console.log(timerTitle); // Generation queued: 12:34:56 7 Jan 2021\nReply received: 12:34:57 7 Jan 2021\nTime to generate: 1.2 seconds\nToken rate: 5 t/s
 */
function formatGenerationTimer(gen_started, gen_finished, tokenCount, reasoningDuration = null, timeToFirstToken = null) {
    if (!gen_started || !gen_finished) {
        return {};
    }

    const dateFormat = 'HH:mm:ss D MMM YYYY';
    const start = moment(gen_started);
    const finish = moment(gen_finished);
    const seconds = finish.diff(start, 'seconds', true);
    const timerValue = `${seconds.toFixed(1)}s`;
    const timerTitle = [
        `Generation queued: ${start.format(dateFormat)}`,
        `Reply received: ${finish.format(dateFormat)}`,
        `Time to generate: ${seconds} seconds`,
        timeToFirstToken ? `Time to first token: ${timeToFirstToken / 1000} seconds` : '',
        reasoningDuration > 0 ? `Time to think: ${reasoningDuration / 1000} seconds` : '',
        tokenCount > 0 ? `Token rate: ${Number(tokenCount / seconds).toFixed(3)} t/s` : '',
    ].filter(x => x).join('\n').trim();

    if (isNaN(seconds) || seconds < 0) {
        return { timerValue: '', timerTitle };
    }

    return { timerValue, timerTitle };
}

export function scrollChatToBottom() {
    if (power_user.auto_scroll_chat_to_bottom) {
        let position = chatElement[0].scrollHeight;

        if (power_user.waifuMode) {
            const lastMessage = chatElement.find('.mes').last();
            if (lastMessage.length) {
                const lastMessagePosition = lastMessage.position().top;
                position = chatElement.scrollTop() + lastMessagePosition;
            }
        }

        chatElement.scrollTop(position);
    }
}

/**
 * Substitutes {{macro}} parameters in a string.
 * @param {string} content - The string to substitute parameters in.
 * @param {Record<string,any>} additionalMacro - Additional environment variables for substitution.
 * @param {(x: string) => string} [postProcessFn] - Post-processing function for each substituted macro.
 * @returns {string} The string with substituted parameters.
 */
export function substituteParamsExtended(content, additionalMacro = {}, postProcessFn = (x) => x) {
    return substituteParams(content, undefined, undefined, undefined, undefined, true, additionalMacro, postProcessFn);
}

/**
 * Substitutes {{macro}} parameters in a string.
 * @param {string} content - The string to substitute parameters in.
 * @param {string} [_name1] - The name of the user. Uses global name1 if not provided.
 * @param {string} [_name2] - The name of the character. Uses global name2 if not provided.
 * @param {string} [_original] - The original message for {{original}} substitution.
 * @param {string} [_group] - The group members list for {{group}} substitution.
 * @param {boolean} [_replaceCharacterCard] - Whether to replace character card macros.
 * @param {Record<string,any>} [additionalMacro] - Additional environment variables for substitution.
 * @param {(x: string) => string} [postProcessFn] - Post-processing function for each substituted macro.
 * @returns {string} The string with substituted parameters.
 */
function buildSubstituteEnvironment(_name1, _name2, _original, _group, _replaceCharacterCard = true, additionalMacro = {}) {
    const environment = {};

    if (typeof _original === 'string') {
        let originalSubstituted = false;
        environment.original = () => {
            if (originalSubstituted) {
                return '';
            }

            originalSubstituted = true;
            return _original;
        };
    }

    const getGroupValue = (includeMuted) => {
        if (typeof _group === 'string') {
            return _group;
        }

        if (selected_group) {
            const members = groups.find(x => x.id === selected_group)?.members;
            /** @type {string[]} */
            const disabledMembers = groups.find(x => x.id === selected_group)?.disabled_members ?? [];
            const isMuted = x => includeMuted ? true : !disabledMembers.includes(x);
            const names = Array.isArray(members)
                ? members.filter(isMuted).map(m => characters.find(c => c.avatar === m)?.name).filter(Boolean).join(', ')
                : '';
            return names;
        } else {
            return _name2 ?? name2;
        }
    };

    if (_replaceCharacterCard) {
        const fields = getCharacterCardFields();
        environment.charPrompt = fields.system || '';
        environment.charInstruction = environment.charJailbreak = fields.jailbreak || '';
        environment.description = fields.description || '';
        environment.personality = fields.personality || '';
        environment.scenario = fields.scenario || '';
        environment.persona = fields.persona || '';
        environment.mesExamples = () => {
            const isInstruct = power_user.instruct.enabled && main_api !== 'openai';
            const mesExamplesArray = parseMesExamples(fields.mesExamples, isInstruct);
            if (isInstruct) {
                const instructExamples = formatInstructModeExamples(mesExamplesArray, name1, name2);
                return instructExamples.join('');
            }
            return mesExamplesArray.join('');
        };
        environment.mesExamplesRaw = fields.mesExamples || '';
        environment.charVersion = fields.version || '';
        environment.char_version = fields.version || '';
        environment.charDepthPrompt = fields.charDepthPrompt || '';
        environment.creatorNotes = fields.creatorNotes || '';
    }

    environment.user = _name1 ?? name1;
    environment.char = _name2 ?? name2;
    environment.group = environment.charIfNotGroup = getGroupValue(true);
    environment.groupNotMuted = getGroupValue(false);
    environment.model = getGeneratingModel();

    if (additionalMacro && typeof additionalMacro === 'object') {
        Object.assign(environment, additionalMacro);
    }

    return environment;
}

export function substituteParams(content, _name1, _name2, _original, _group, _replaceCharacterCard = true, additionalMacro = {}, postProcessFn = (x) => x) {
    if (!content) {
        return '';
    }

    const environment = buildSubstituteEnvironment(_name1, _name2, _original, _group, _replaceCharacterCard, additionalMacro);
    return evaluateMacros(content, environment, postProcessFn);
}

export async function substituteParamsAsync(content, _name1, _name2, _original, _group, _replaceCharacterCard = true, additionalMacro = {}, postProcessFn = (x) => x) {
    if (!content) {
        return '';
    }

    const environment = buildSubstituteEnvironment(_name1, _name2, _original, _group, _replaceCharacterCard, additionalMacro);
    return await evaluateMacrosAsync(content, environment, postProcessFn);
}

export function setWorkerOptimizationEnabled(enabled) {
    workerManager.setEnabled(enabled);
}

if (typeof window !== 'undefined') {
    window.setWorkerOptimizationEnabled = setWorkerOptimizationEnabled;
}

const EXT_EVENT_SOURCE_EVENTS = new Set(Object.values(event_types));
const EXT_DOM_EVENT_TARGETS = new Map([
    [VIRTUALIZATION_DOM_EVENT_BEFORE_MOUNT, document],
    [VIRTUALIZATION_DOM_EVENT_MOUNT, document],
    [VIRTUALIZATION_DOM_EVENT_AFTER_RENDER, document],
    [VIRTUALIZATION_DOM_EVENT_UNMOUNT, document],
    [CHAT_RENDER_EVENT_START, document],
    [CHAT_RENDER_EVENT_END, document],
    ['virtualization-toggle', window],
    ['virtualization-toggle-complete', document],
    ['st-worker-enabled-changed', document],
    ['st-worker-task', document],
    ['st-worker-fallback-registered', document],
    ['st-worker-config-updated', document],
    ['st-variables-updated', document],
    ['st-variables-batch-updated', document],
]);
const EXT_EVENT_ALLOWLIST = new Set([...EXT_EVENT_SOURCE_EVENTS, ...EXT_DOM_EVENT_TARGETS.keys()]);
const EXT_EVENT_REGISTRY = new Map();
let EXT_EVENT_TOKEN_SEQ = 0;

function safeCallExtensionHandler(handler, args = []) {
    try {
        const result = handler(...args);
        if (result && typeof result.then === 'function') {
            result.catch((error) => {
                console.error('[SillyTavern.extensions] 事件监听器异步执行失败', error);
            });
        }
    } catch (error) {
        console.error('[SillyTavern.extensions] 事件监听器执行失败', error);
    }
}

function cloneMessageObject(value) {
    if (value === undefined || value === null) {
        return value;
    }
    if (typeof structuredClone === 'function') {
        try {
            return structuredClone(value);
        } catch (error) {
            console.warn('[SillyTavern.extensions] structuredClone 失败，改用 JSON 备选', error);
        }
    }
    try {
        return JSON.parse(JSON.stringify(value));
    } catch {
        return value;
    }
}

/**
 * @typedef {Object} ExtensionEventOptions
 * @property {boolean} [once]
 * @property {boolean} [capture]
 * @property {boolean|'auto'} [passive]
 * @property {boolean} [optimized]
 * @property {number|boolean} [throttle]
 * @property {{ leading?: boolean, trailing?: boolean }} [throttleOptions]
 * @property {number|boolean} [debounce]
 * @property {'animation'|'raf'|'idle'|'microtask'|'sync'} [defer]
 * @property {'user-blocking'|'user-visible'|'background'} [priority]
 * @property {boolean} [passiveFallback]
 */

/**
 * @typedef {{ token: string, dispose: () => boolean }} ExtensionEventToken
 */

/**
 * @typedef {Object} ExtensionEventsAPI
 * @property {(eventName: string, handler: (...args: any[]) => any, options?: ExtensionEventOptions) => ExtensionEventToken} on
 * @property {(token: string) => boolean} off
 * @property {(eventName: string, payload?: any, options?: { allowList?: string[], bubbles?: boolean, cancelable?: boolean }) => boolean | Promise<void>} emit
 * @property {{ [key: string]: string }} types
 * @property {{ [key: string]: string }} domEvents
 */

function createExtensionEventsApi() {
    const releaseToken = (token) => {
        const record = EXT_EVENT_REGISTRY.get(token);
        if (!record) {
            return false;
        }
        EXT_EVENT_REGISTRY.delete(token);
        if (record.kind === 'eventSource') {
            eventSource.removeListener(record.eventName, record.listener);
        } else if (record.kind === 'dom') {
            if (typeof record.dispose === 'function') {
                record.dispose();
            } else if (record.target?.removeEventListener) {
                record.target.removeEventListener(record.eventName, record.listener, record.options);
            }
        }
        return true;
    };

    const on = (eventName, handler, options = {}) => {
        if (!EXT_EVENT_ALLOWLIST.has(eventName)) {
            throw new Error(`[SillyTavern.extensions] 不支持订阅事件：${eventName}`);
        }
        if (typeof handler !== 'function') {
            throw new TypeError('[SillyTavern.extensions] 事件监听器必须是函数');
        }

        const token = `evt-${++EXT_EVENT_TOKEN_SEQ}`;

        if (EXT_EVENT_SOURCE_EVENTS.has(eventName)) {
            const wrapped = async (...args) => {
                safeCallExtensionHandler(handler, args);
                if (options.once) {
                    releaseToken(token);
                }
            };
            eventSource.on(eventName, wrapped);
            EXT_EVENT_REGISTRY.set(token, { kind: 'eventSource', eventName, listener: wrapped });
        } else {
            const target = EXT_DOM_EVENT_TARGETS.get(eventName) || document;
            const managedOptions = {
                capture: Boolean(options.capture),
                passive: options.passive ?? 'auto',
                once: Boolean(options.once),
                optimized: options.optimized !== false,
                throttle: options.throttle ?? options.throttleMs,
                throttleOptions: options.throttleOptions,
                debounce: options.debounce ?? options.debounceMs,
                defer: options.defer ?? options.frame,
                priority: options.priority ?? options.schedulerPriority,
                passiveFallback: options.passiveFallback,
            };
            const wrapped = (event) => {
                safeCallExtensionHandler(handler, [event]);
                if (options.once) {
                    releaseToken(token);
                }
            };
            const dispose = addManagedEventListener(target, eventName, wrapped, managedOptions);
            EXT_EVENT_REGISTRY.set(token, {
                kind: 'dom',
                eventName,
                listener: wrapped,
                target,
                options: managedOptions,
                dispose,
            });
        }

        return {
            token,
            dispose: () => releaseToken(token),
        };
    };

    const off = (token) => releaseToken(token);

    const emit = (eventName, payload, { allowList = [], bubbles = false, cancelable = false } = {}) => {
        if (!EXT_EVENT_ALLOWLIST.has(eventName)) {
            throw new Error(`[SillyTavern.extensions] 不支持派发事件：${eventName}`);
        }
        const guarded = new Set(Array.isArray(allowList) ? allowList : []);
        if (!guarded.has(eventName)) {
            throw new Error('[SillyTavern.extensions] emit 调用需要显式在 allowList 中声明目标事件');
        }

        if (EXT_EVENT_SOURCE_EVENTS.has(eventName)) {
            const args = Array.isArray(payload) ? payload : [payload];
            return eventSource.emit(eventName, ...args);
        }

        const target = EXT_DOM_EVENT_TARGETS.get(eventName) || document;
        const detail = payload === undefined ? {} : payload;
        const dispatched = new CustomEvent(eventName, { detail, bubbles, cancelable });
        return target.dispatchEvent(dispatched);
    };

    return Object.freeze({
        on,
        off,
        emit,
        types: Object.freeze({ ...event_types }),
        domEvents: Object.freeze({
            VIRTUALIZATION_DOM_EVENT_BEFORE_MOUNT,
            VIRTUALIZATION_DOM_EVENT_MOUNT,
            VIRTUALIZATION_DOM_EVENT_AFTER_RENDER,
            VIRTUALIZATION_DOM_EVENT_UNMOUNT,
            CHAT_RENDER_EVENT_START,
            CHAT_RENDER_EVENT_END,
            VIRTUALIZATION_TOGGLE: 'virtualization-toggle',
            VIRTUALIZATION_TOGGLE_COMPLETE: 'virtualization-toggle-complete',
            WORKER_TASK: 'st-worker-task',
        }),
    });
}

const extensionNamespace = sillyTavernRoot.extensions ?? {};
extensionNamespace.events = createExtensionEventsApi();

const PROMPT_MODULE_STAGE = Object.freeze({
    BEFORE_COMBINE: 'beforeCombine',
    AFTER_COMBINE: 'afterCombine',
});

/**
 * @typedef {Object} PromptModuleRecord
 * @property {string} id
 * @property {string} label
 * @property {string} stage
 * @property {number} priority
 * @property {number} seq
 * @property {(context: any) => any|Promise<any>} handler
 * @property {(context: any) => boolean|Promise<boolean>} [validator]
 */

/** @type {Map<string, PromptModuleRecord>} */
const promptModuleRegistry = new Map();
let promptModuleSeq = 0;

function normalizePromptModuleConfig(config = {}) {
    const { id, label, stage, priority, handler, validator } = config;

    if (typeof id !== 'string' || !id.trim()) {
        throw new TypeError('[SillyTavern.extensions] prompts.registerModule 需要非空字符串 id');
    }
    if (typeof handler !== 'function') {
        throw new TypeError('[SillyTavern.extensions] prompts.registerModule 需要 handler 函数');
    }
    const normalizedStage = Object.values(PROMPT_MODULE_STAGE).includes(stage)
        ? stage
        : PROMPT_MODULE_STAGE.BEFORE_COMBINE;
    const normalizedPriority = Number.isFinite(priority) ? Number(priority) : 0;
    const normalizedValidator = typeof validator === 'function' ? validator : null;

    return {
        id: id.trim(),
        label: typeof label === 'string' && label.trim() ? label.trim() : id.trim(),
        stage: normalizedStage,
        priority: normalizedPriority,
        handler,
        validator: normalizedValidator,
    };
}

function registerPromptModule(config = {}) {
    const record = normalizePromptModuleConfig(config);
    if (promptModuleRegistry.has(record.id)) {
        console.warn(`[SillyTavern.extensions] prompts.registerModule: 覆盖已存在的模块 ${record.id}`);
    }
    const stored = {
        ...record,
        seq: ++promptModuleSeq,
    };
    promptModuleRegistry.set(stored.id, stored);
    return Object.freeze({
        id: stored.id,
        dispose: () => unregisterPromptModule(stored.id),
    });
}

function unregisterPromptModule(id) {
    if (typeof id !== 'string' || !promptModuleRegistry.has(id)) {
        return false;
    }
    return promptModuleRegistry.delete(id);
}

function listPromptModules() {
    return Array.from(promptModuleRegistry.values()).map(({ id, label, stage, priority }) => ({
        id,
        label,
        stage,
        priority,
    }));
}

async function runPromptModules(stage, context) {
    const modules = Array.from(promptModuleRegistry.values())
        .filter((module) => module.stage === stage)
        .sort((a, b) => {
            if (a.priority !== b.priority) {
                return b.priority - a.priority;
            }
            return a.seq - b.seq;
        });

    for (const module of modules) {
        try {
            const canRun = module.validator ? await module.validator(context) : true;
            if (!canRun) {
                continue;
            }
        } catch (error) {
            console.warn(`[SillyTavern.extensions] prompts.validator 运行失败: ${module.id}`, error);
            continue;
        }
        try {
            await module.handler(context);
        } catch (error) {
            console.error(`[SillyTavern.extensions] prompts.handler 执行失败: ${module.id}`, error);
        }
    }
}

extensionNamespace.prompts = Object.freeze({
    registerModule: (config) => registerPromptModule(config),
    unregisterModule: (id) => unregisterPromptModule(id),
    list: () => listPromptModules(),
    stages: PROMPT_MODULE_STAGE,
});

extensionNamespace.backend = Object.freeze({
    list: () => listBackendApis(),
    isEnabled: (key) => isBackendApiEnabled(key),
    getLabel: (key) => getBackendApiLabel(key),
    getStatus: () => getBackendApiStatus(),
    refresh: () => refreshBackendApiStatus(),
    setEnabled: (key, enabled, options) => setBackendApiToggle(key, enabled, options),
    getLogging: () => backendApiLoggingEnabled,
    setLogging: (enabled, options) => setBackendApiLogging(enabled, options),
});

extensionNamespace.macros = Object.freeze({
    register: (key, value, description) => {
        MacrosParser.registerMacro(key, value, description);
        return key;
    },
    unregister: (key) => {
        MacrosParser.unregisterMacro(key);
        return true;
    },
    list: () => Array.from(MacrosParser),
    evaluate: (content, env = {}, postProcessFn) => evaluateMacros(content, env, postProcessFn),
    evaluateAsync: (content, env = {}, postProcessFn) => evaluateMacrosAsync(content, env, postProcessFn),
});

extensionNamespace.templates = Object.freeze({
    render: (templateId, data = {}, options = {}) => {
        const { sanitize = true, localize = true, fullPath = false } = options;
        return renderTemplateAsync(templateId, data, sanitize, localize, fullPath);
    },
    renderSync: (templateId, data = {}, options = {}) => {
        const { sanitize = true, localize = true, fullPath = false } = options;
        return renderTemplate(templateId, data, sanitize, localize, fullPath);
    },
    clearCache: (templateId = null, options = {}) => {
        const { fullPath = false } = options;
        return clearTemplateCache(templateId, fullPath);
    },
    hasCache: (templateId, options = {}) => {
        const { fullPath = false } = options;
        return hasTemplateCached(templateId, fullPath);
    },
});

/** 
 * @typedef {Object} ExtensionMessageDetail
 * @property {number} mesId
 * @property {Element|null} element
 * @property {any} [message]
 * @property {boolean} [virtual]
 * @property {string} [reason]
 */

/**
 * @typedef {Object} ExtensionMessagesAPI
 * @property {(handler: (detail: ExtensionMessageDetail) => any, options?: ExtensionEventOptions) => ExtensionEventToken} onMount
 * @property {(handler: (detail: ExtensionMessageDetail) => any, options?: ExtensionEventOptions) => ExtensionEventToken} onUnmount
 * @property {(mesId: number) => Element|null} getElement
 */

function createMessageApi() {
    const wrapDetailHandler = (handler) => (event) => {
        /** @type {ExtensionMessageDetail} */
        const detail = event?.detail ?? {};
        safeCallExtensionHandler(handler, [detail]);
    };

    return Object.freeze(/** @type {ExtensionMessagesAPI} */ ({
        onMount: (handler, options = {}) => extensionNamespace.events.on(VIRTUALIZATION_DOM_EVENT_MOUNT, wrapDetailHandler(handler), options),
        onUnmount: (handler, options = {}) => extensionNamespace.events.on(VIRTUALIZATION_DOM_EVENT_UNMOUNT, wrapDetailHandler(handler), options),
        getElement: (mesId) => getMessageDom(Number(mesId)),
    }));
}

extensionNamespace.messages = createMessageApi();

/**
 * @typedef {Object} ExtensionVirtualizationDetail
 * @property {string} phase
 * @property {boolean} [enabled]
 * @property {number} [mesId]
 * @property {Element|null} [element]
 * @property {boolean} [virtual]
 * @property {string} [reason]
 */

const VIRTUALIZATION_PHASE = Object.freeze({
    BEFORE_MOUNT: VIRTUALIZATION_DOM_EVENT_BEFORE_MOUNT,
    MOUNT: VIRTUALIZATION_DOM_EVENT_MOUNT,
    AFTER_RENDER: VIRTUALIZATION_DOM_EVENT_AFTER_RENDER,
    UNMOUNT: VIRTUALIZATION_DOM_EVENT_UNMOUNT,
    RENDER_START: CHAT_RENDER_EVENT_START,
    RENDER_END: CHAT_RENDER_EVENT_END,
    TOGGLE: 'virtualization-toggle',
    TOGGLE_COMPLETE: 'virtualization-toggle-complete',
});
const VIRTUALIZATION_EVENT_TO_KEY = new Map(
    Object.entries(VIRTUALIZATION_PHASE).map(([key, value]) => [value, key])
);

function resolveVirtualizationEvent(phase) {
    if (typeof phase === 'string' && VIRTUALIZATION_PHASE[phase]) {
        return VIRTUALIZATION_PHASE[phase];
    }
    if (typeof phase === 'string' && VIRTUALIZATION_EVENT_TO_KEY.has(phase)) {
        return phase;
    }
    throw new Error(`[SillyTavern.extensions] 未识别的虚拟化阶段：${phase}`);
}

/**
 * @typedef {Object} ExtensionVirtualizationAPI
 * @property {{ [key: string]: string }} Phase
 * @property {(phase: keyof ExtensionVirtualizationAPI['Phase'] | string, handler: (detail: ExtensionVirtualizationDetail) => any, options?: ExtensionEventOptions) => ExtensionEventToken} onPhase
 */

function createVirtualizationApi() {
    return Object.freeze(/** @type {ExtensionVirtualizationAPI} */ ({
        Phase: VIRTUALIZATION_PHASE,
        onPhase: (phase, handler, options = {}) => {
            const eventName = resolveVirtualizationEvent(phase);
            const phaseKey = VIRTUALIZATION_EVENT_TO_KEY.get(eventName) || phase;
            return extensionNamespace.events.on(eventName, (event) => {
                /** @type {ExtensionVirtualizationDetail} */
                const detail = { ...(event?.detail ?? {}), phase: phaseKey };
                safeCallExtensionHandler(handler, [detail]);
            }, options);
        },
    }));
}

extensionNamespace.virtualization = createVirtualizationApi();

/**
 * @typedef {Object} ExtensionWorkerDetail
 * @property {string} type
 * @property {string} phase
 * @property {string|null} [taskId]
 * @property {any} [payload]
 * @property {boolean} [viaFallback]
 * @property {any} [result]
 * @property {{ name?: string, message?: string, stack?: string }} [error]
 */

/**
 * @typedef {Object} ExtensionWorkerAPI
 * @property {(type: string, payload: any, options?: Parameters<typeof workerManager.dispatchTask>[2]) => Promise<any>} dispatch
 * @property {(handler: (detail: ExtensionWorkerDetail) => any, options?: ExtensionEventOptions) => ExtensionEventToken} onTaskEvent
 * @property {(type: string, fallback: Function) => void} registerFallback
 * @property {(type: string, overrides?: any) => any} extendConfig
 * @property {typeof WorkerFallbackStrategy} FallbackStrategy
 */

function createWorkerApi() {
    const dispatch = (type, payload, options = {}) => {
        if (typeof type !== 'string' || !type.trim()) {
            throw new TypeError('[SillyTavern.extensions] Worker 任务类型必须是非空字符串');
        }
        return workerManager.dispatchTask(type, payload, options);
    };

    const onTaskEvent = (handler, options = {}) => extensionNamespace.events.on('st-worker-task', (event) => {
        /** @type {ExtensionWorkerDetail} */
        const detail = event?.detail ?? {};
        safeCallExtensionHandler(handler, [detail]);
    }, options);

    const registerFallback = (type, fallback) => {
        if (typeof fallback !== 'function') {
            throw new TypeError('[SillyTavern.extensions] Worker 回退函数必须是函数');
        }
        return workerManager.registerFallback(type, fallback);
    };

    const extendConfig = (type, overrides = {}) => workerManager.extendTaskConfig(type, overrides);

    return Object.freeze({
        dispatch,
        onTaskEvent,
        registerFallback,
        extendConfig,
        FallbackStrategy: WorkerFallbackStrategy,
    });
}

extensionNamespace.workers = createWorkerApi();

/**
 * @typedef {Object} ExtensionChatSnapshot
 * @property {number} count
 * @property {{ index: number, message: any }[]} messages
 * @property {{ enabled: boolean, range: { start: number, end: number }, mountedIds: number[] }} virtualization
 */

/**
 * @typedef {Object} ExtensionChatAPI
 * @property {(options?: { includeVirtual?: boolean }) => Promise<ExtensionChatSnapshot>} getSnapshot
 * @property {(mesId: number, updater: (draft: any, context: { index: number, original: any }) => any | Promise<any>, options?: { rerender?: boolean, broadcast?: boolean }) => Promise<any>} mutateMessage
 * @property {(payload: { text: string, bias?: any, insertAt?: number|null, compact?: boolean, name?: string, avatar?: string }) => Promise<any>} sendUserMessage
 * @property {ReturnType<typeof createChatInputApi>} input
 */

function createChatApi() {
    const getSnapshot = async ({ includeVirtual = true } = {}) => {
        const messages = chat.map((message, index) => ({ index, message: cloneMessageObject(message) }));
        const virtualization = {
            enabled: isVirtualizationEnabled(),
            range: chatVirtualList ? { ...chatVirtualList.currentRange } : { start: 0, end: chat.length },
            mountedIds: includeVirtual ? getMountedMessageIds() : [],
        };
        return /** @type {ExtensionChatSnapshot} */ ({
            count: chat.length,
            messages,
            virtualization,
        });
    };

    const mutateMessageAsync = async (mesId, updater, { rerender = true, broadcast = true } = {}) => {
        const index = Number(mesId);
        if (!Number.isInteger(index) || index < 0 || index >= chat.length) {
            throw new RangeError('[SillyTavern.extensions] mutateMessage: 无效的消息索引');
        }
        if (typeof updater !== 'function') {
            throw new TypeError('[SillyTavern.extensions] mutateMessage: updater 必须是函数');
        }
        const original = chat[index];
        const draft = cloneMessageObject(original);
        const maybeResult = await Promise.resolve(updater(draft, { index, original: cloneMessageObject(original) }));
        const next = maybeResult === undefined ? draft : maybeResult;
        if (!next || typeof next !== 'object') {
            throw new TypeError('[SillyTavern.extensions] mutateMessage: updater 必须返回对象');
        }
        chat[index] = next;
        if (rerender) {
            updateMessageBlock(index, next, { rerenderMessage: true });
            if (chatVirtualList) {
                queueVirtualListUpdate(index, getMessageDom(index), { mutate: true, measure: true });
            }
            const element = getMessageDom(index);
            const detail = emitVirtualizationDomEvent(VIRTUALIZATION_DOM_EVENT_AFTER_RENDER, index, element, { reason: 'mutate' });
            eventSource.emit(event_types.MESSAGE_UPDATED, index, detail).catch((error) => {
                console.error('[SillyTavern.extensions] 无法广播 MESSAGE_UPDATED', error);
            });
            if (broadcast) {
                broadcastChatRender([index], { reason: detail.reason ?? 'mutate', virtual: detail.virtual });
            }
        }
        return cloneMessageObject(next);
    };

    const sendUserMessageBridge = async (payload = {}) => {
        const {
            text,
            bias = null,
            insertAt = null,
            compact = false,
            name = name1,
            avatar = user_avatar,
        } = payload ?? {};
        if (typeof text !== 'string' || !text.trim()) {
            throw new TypeError('[SillyTavern.extensions] sendUserMessage: text 必须是非空字符串');
        }
        const message = await sendMessageAsUser(text, bias, insertAt, compact, name, avatar);
        return cloneMessageObject(message);
    };

    return Object.freeze(/** @type {ExtensionChatAPI} */ ({
        getSnapshot,
        mutateMessage: mutateMessageAsync,
        sendUserMessage: sendUserMessageBridge,
        input: createChatInputApi(),
    }));
}

extensionNamespace.chat = createChatApi();

function combineTokens(tokens) {
    const list = (Array.isArray(tokens) ? tokens : [tokens]).filter(Boolean);
    return Object.freeze({
        dispose() {
            for (const token of list) {
                try {
                    if (token && typeof token.dispose === 'function') {
                        token.dispose();
                    } else if (token && typeof token.token === 'string') {
                        extensionNamespace.events.off(token.token);
                    }
                } catch (error) {
                    console.warn('[SillyTavern.extensions] 无法释放事件令牌', error);
                }
            }
            return true;
        },
    });
}

function createWorldInfoApi() {
    const normalizeCharacterIndex = (value) => {
        const index = Number(value);
        if (!Number.isInteger(index) || index < 0 || index >= characters.length) {
            throw new RangeError('[SillyTavern.extensions] worldInfo API 需要有效的角色索引');
        }
        return index;
    };

    const ensureBookName = (value) => {
        if (typeof value !== 'string' || !value.trim()) {
            throw new TypeError('[SillyTavern.extensions] worldInfo 需要非空的 lorebook 名称');
        }
        return value.trim();
    };

    const listBooks = () => {
        if (Array.isArray(world_names) && world_names.length) {
            return [...world_names];
        }
        return Object.keys(world_info ?? {});
    };

    const getBook = (name) => {
        if (!name) {
            throw new TypeError('[SillyTavern.extensions] worldInfo.getBook 需要书名');
        }
        const book = world_info?.[name];
        return book ? cloneMessageObject(book) : null;
    };

    const listEntries = (name, { sort = true } = {}) => {
        const book = world_info?.[name];
        if (!book || !book.entries) {
            return [];
        }
        const source = Array.isArray(book.entries) ? book.entries : Object.values(book.entries);
        const entries = source.map(cloneMessageObject);
        if (sort) {
            entries.sort((a, b) => (b?.insertion_order ?? b?.order ?? 0) - (a?.insertion_order ?? a?.order ?? 0));
        }
        return entries;
    };

    const getSettings = () => cloneMessageObject(getWorldInfoSettings());

    const updateSettings = (settings = {}, dataOverride) => {
        if (!settings || typeof settings !== 'object') {
            throw new TypeError('[SillyTavern.extensions] worldInfo.updateSettings 需要对象参数');
        }
        setWorldInfoSettings(settings, dataOverride ?? world_info);
        return cloneMessageObject(getWorldInfoSettings());
    };

    const loadBookData = async (name, { refresh = false } = {}) => {
        const resolved = ensureBookName(name);
        if (refresh && worldInfoCache.has(resolved)) {
            worldInfoCache.delete(resolved);
        }
        const data = await loadWorldInfo(resolved);
        return data ? structuredClone(data) : null;
    };

    const mutateBook = async (name, mutator, options = {}) => {
        const {
            immediately = true,
            refreshEditor = false,
            navigation = navigation_option.none,
            flash = true,
            refreshList = false,
        } = options;
        const resolved = ensureBookName(name);
        if (typeof mutator !== 'function') {
            throw new TypeError('[SillyTavern.extensions] worldInfo.books.mutate 需要回调函数');
        }
        const data = await loadWorldInfo(resolved);
        if (!data) {
            throw new Error(`[SillyTavern.extensions] 未找到 lorebook ${resolved}`);
        }
        const context = {
            name: resolved,
            data,
            entries: data.entries,
            setOriginal: (uid, key, value) => setWIOriginalDataValue(data, uid, key, value),
            deleteOriginal: (uid) => deleteWIOriginalDataValue(data, uid),
        };
        const result = await mutator(context);
        await saveWorldInfo(resolved, data, immediately);
        if (refreshList) {
            await updateWorldInfoList();
        }
        if (refreshEditor) {
            refreshWorldInfoEditor(navigation, flash);
        }
        return {
            name: resolved,
            book: structuredClone(data),
            result,
        };
    };

    const refresh = async () => {
        await initWorldInfo();
        return listBooks();
    };

    const forceActivate = async (entries) => {
        const payload = Array.isArray(entries) ? entries : [entries];
        try {
            await eventSource.emit(event_types.WORLDINFO_FORCE_ACTIVATE, payload);
        } catch (error) {
            console.error('[SillyTavern.extensions] WORLDINFO_FORCE_ACTIVATE 触发失败', error);
        }
    };

    const onUpdated = (handler, options = {}) => extensionNamespace.events.on(event_types.WORLDINFO_UPDATED, handler, options);
    const onSettingsUpdated = (handler, options = {}) => extensionNamespace.events.on(event_types.WORLDINFO_SETTINGS_UPDATED, handler, options);

    const ensureEmbeddedWorld = (characterId) => {
        try {
            const resolved = normalizeCharacterIndex(characterId);
            return checkEmbeddedWorld(resolved);
        } catch (error) {
            console.error('[SillyTavern.extensions] ensureEmbeddedWorld 失败', error);
            return false;
        }
    };

    const importEmbedded = async (characterId, { skipPrompt = false } = {}) => {
        const resolved = normalizeCharacterIndex(characterId);
        $('#import_character_info').data('chid', resolved);
        await importEmbeddedWorldInfo(Boolean(skipPrompt));
    };

    const books = Object.freeze({
        list: () => listBooks(),
        load: (name, options = {}) => loadBookData(name, options),
        save: async (name, book, { immediately = false, refreshList = false } = {}) => {
            const resolved = ensureBookName(name);
            if (!book || typeof book !== 'object') {
                throw new TypeError('[SillyTavern.extensions] worldInfo.books.save 需要有效的数据对象');
            }
            await saveWorldInfo(resolved, book, immediately);
            if (refreshList) {
                await updateWorldInfoList();
            }
            return structuredClone(book);
        },
        create: async (name, { interactive = false } = {}) => {
            const resolved = ensureBookName(name);
            const created = await createNewWorldInfo(resolved, { interactive });
            if (!created) {
                return null;
            }
            return loadBookData(resolved, { refresh: true });
        },
        delete: async (name) => {
            const resolved = ensureBookName(name);
            return deleteWorldInfo(resolved);
        },
        rename: async (oldName, newName, { overwrite = false } = {}) => {
            const resolvedOld = ensureBookName(oldName);
            const resolvedNew = ensureBookName(newName);
            await renameWorldInfo(resolvedOld, null, { newName: resolvedNew, overwrite, interactive: false });
            return resolvedNew;
        },
        duplicate: async (source, target, { overwrite = false, refreshList = true } = {}) => {
            const resolvedSource = ensureBookName(source);
            const desiredTarget = ensureBookName(target);
            const sanitizedTarget = await getSanitizedFilename(desiredTarget);
            if (!overwrite && world_names.includes(sanitizedTarget)) {
                throw new Error(`[SillyTavern.extensions] lorebook ${sanitizedTarget} 已存在`);
            }
            if (overwrite && world_names.includes(sanitizedTarget)) {
                await deleteWorldInfo(sanitizedTarget);
            }
            const data = await loadWorldInfo(resolvedSource);
            if (!data) {
                throw new Error(`[SillyTavern.extensions] 无法复制 ${resolvedSource}`);
            }
            const clone = structuredClone(data);
            clone.name = sanitizedTarget;
            await saveWorldInfo(sanitizedTarget, clone, true);
            if (refreshList) {
                await updateWorldInfoList();
            }
            return structuredClone(clone);
        },
        mutate: mutateBook,
        openEditor: (name) => openWorldInfoEditor(ensureBookName(name)),
        reloadEditor: (name, { loadIfNotSelected = false } = {}) => reloadEditor(ensureBookName(name), Boolean(loadIfNotSelected)),
        editorState: () => {
            const select = $('#world_editor_select');
            const indexValue = Number(select.val());
            const index = Number.isNaN(indexValue) ? null : indexValue;
            const name = Number.isNaN(indexValue) ? null : world_names[indexValue] ?? null;
            return {
                visible: $('#WorldInfo').is(':visible'),
                index,
                name,
            };
        },
        refreshList: () => updateWorldInfoList(),
    });

    const entries = Object.freeze({
        list: async (bookName, options = {}) => {
            const data = await loadBookData(bookName, options);
            if (!data || !data.entries) {
                return [];
            }
            const values = Array.isArray(data.entries) ? data.entries : Object.values(data.entries);
            return values.map((entry) => structuredClone(entry));
        },
        get: async (bookName, uid, options = {}) => {
            const data = await loadBookData(bookName, options);
            if (!data || !data.entries) {
                return null;
            }
            const key = String(uid);
            const entry = data.entries[key] ?? data.entries[uid];
            return entry ? structuredClone(entry) : null;
        },
        create: async (bookName, payload = {}, options = {}) => {
            const {
                immediately = true,
                refreshEditor = false,
                navigation = navigation_option.previous,
                flash = true,
                updateOriginal = true,
            } = options;
            const { result } = await mutateBook(bookName, ({ data, setOriginal }) => {
                const entry = createWorldInfoEntry(bookName, data);
                if (!entry) {
                    throw new Error(`[SillyTavern.extensions] 无法在 ${bookName} 中创建条目`);
                }
                Object.entries(payload ?? {}).forEach(([key, value]) => {
                    entry[key] = value;
                });
                if (updateOriginal) {
                    Object.entries(entry).forEach(([key, value]) => setOriginal(entry.uid, key, value));
                }
                return structuredClone(entry);
            }, { immediately, refreshEditor, navigation, flash });
            return result;
        },
        update: async (bookName, uid, mutator, options = {}) => {
            const {
                immediately = true,
                refreshEditor = false,
                navigation = navigation_option.none,
                flash = true,
            } = options;
            if (typeof mutator !== 'function') {
                throw new TypeError('[SillyTavern.extensions] worldInfo.entries.update 需要 mutator 函数');
            }
            const { result } = await mutateBook(bookName, ({ data, setOriginal }) => {
                const entry = data.entries?.[uid];
                if (!entry) {
                    throw new Error(`[SillyTavern.extensions] 未找到 UID 为 ${uid} 的条目`);
                }
                const previous = structuredClone(entry);
                const helper = {
                    setOriginal: (key, value) => setOriginal(uid, key, value),
                };
                const mutationResult = mutator(entry, helper);
                return {
                    entry: structuredClone(entry),
                    previous,
                    mutationResult,
                };
            }, { immediately, refreshEditor, navigation, flash });
            return result;
        },
        remove: async (bookName, uid, options = {}) => {
            const {
                immediately = true,
                refreshEditor = true,
                navigation = navigation_option.previous,
                flash = true,
                silent = true,
            } = options;
            const { result } = await mutateBook(bookName, async ({ data, deleteOriginal }) => {
                const success = await deleteWorldInfoEntry(data, uid, { silent });
                if (success) {
                    deleteOriginal(uid);
                }
                return Boolean(success);
            }, { immediately, refreshEditor, navigation, flash });
            return result;
        },
        duplicate: async (bookName, uid, options = {}) => {
            const {
                immediately = true,
                refreshEditor = true,
                navigation = navigation_option.none,
                flash = true,
            } = options;
            const { result } = await mutateBook(bookName, ({ data, setOriginal }) => {
                const newEntry = duplicateWorldInfoEntry(data, uid);
                if (!newEntry) {
                    return null;
                }
                Object.entries(newEntry).forEach(([key, value]) => setOriginal(newEntry.uid, key, value));
                return structuredClone(newEntry);
            }, { immediately, refreshEditor, navigation, flash });
            return result;
        },
        move: (sourceName, targetName, uid, { deleteOriginal = true } = {}) => {
            return moveWorldInfoEntry(ensureBookName(sourceName), ensureBookName(targetName), uid, { deleteOriginal });
        },
        render: async (bookName, uid, options = {}) => {
            let data = options.data;
            let entry = options.entry;
            if (!data) {
                data = await loadWorldInfo(ensureBookName(bookName));
            }
            if (!data) {
                return null;
            }
            if (!entry) {
                entry = data.entries?.[uid];
            }
            if (!entry) {
                return null;
            }
            const block = await getWorldEntry(bookName, data, entry);
            if (!block) {
                return null;
            }
            const element = typeof block.get === 'function' ? block.get(0) : null;
            if (element?.outerHTML) {
                return element.outerHTML;
            }
            if (typeof block.prop === 'function') {
                return block.prop('outerHTML');
            }
            return block.toString?.() ?? null;
        },
    });

    const editorApi = Object.freeze({
        open: (name) => books.openEditor(name),
        reload: (name, options = {}) => books.reloadEditor(name, options),
        state: () => books.editorState(),
        refresh: (navigation = navigation_option.none, flash = true) => refreshWorldInfoEditor(navigation, flash),
    });

    const navigationConst = Object.freeze({ ...navigation_option });
    const anchorConst = Object.freeze({ ...wi_anchor_position });

    return Object.freeze({
        listBooks,
        getBook,
        listEntries,
        getSettings,
        updateSettings,
        refresh,
        forceActivate,
        ensureEmbeddedWorld,
        importEmbeddedWorldInfo: importEmbedded,
        books,
        entries,
        editor: editorApi,
        navigation: navigationConst,
        anchorPosition: anchorConst,
        events: Object.freeze({
            UPDATED: event_types.WORLDINFO_UPDATED,
            SETTINGS_UPDATED: event_types.WORLDINFO_SETTINGS_UPDATED,
            FORCE_ACTIVATE: event_types.WORLDINFO_FORCE_ACTIVATE,
        }),
        onUpdated,
        onSettingsUpdated,
    });
}

extensionNamespace.worldInfo = createWorldInfoApi();

function createExtensionManagerApi() {
    const ensureIdentifier = (value) => {
        if (typeof value !== 'string') {
            throw new TypeError('[SillyTavern.extensions] 扩展名称必须是字符串');
        }
        const trimmed = value.trim();
        if (!trimmed) {
            throw new TypeError('[SillyTavern.extensions] 扩展名称不能为空');
        }
        return trimmed;
    };

    const normalizeBoolean = (value, fallback = false) => (typeof value === 'boolean' ? value : fallback);
    const resolveNotifyPreference = (value) => {
        if (value === undefined || value === null) {
            return extensionToastNotificationsEnabled;
        }
        return Boolean(value);
    };

    const cloneEntry = (entry, includeManifest = false) => {
        if (!entry) {
            return null;
        }
        const cloned = {
            id: entry.id,
            externalId: entry.externalId,
            type: entry.type,
            isExternal: entry.isExternal,
            isActive: entry.isActive,
            isDisabled: entry.isDisabled,
            displayName: entry.displayName,
            version: entry.version,
            author: entry.author,
            description: entry.description,
            autoUpdate: entry.autoUpdate,
            modules: Array.isArray(entry.modules) ? [...entry.modules] : [],
            optionalModules: Array.isArray(entry.optionalModules) ? [...entry.optionalModules] : [],
            requires: Array.isArray(entry.requires) ? [...entry.requires] : [],
            repository: entry.repository,
            homepage: entry.homepage,
        };

        if (includeManifest) {
            if (entry.manifest && typeof structuredClone === 'function') {
                try {
                    cloned.manifest = structuredClone(entry.manifest);
                } catch (error) {
                    console.warn('structuredClone 克隆 manifest 失败，改用 JSON 备选方案', error);
                    cloned.manifest = entry.manifest ? JSON.parse(JSON.stringify(entry.manifest)) : entry.manifest;
                }
            } else if (entry.manifest) {
                cloned.manifest = JSON.parse(JSON.stringify(entry.manifest));
            } else {
                cloned.manifest = entry.manifest;
            }
        }

        return Object.freeze(cloned);
    };

    const snapshot = (options = {}) => {
        const includeManifest = options.includeManifest === true;
        return getInstalledExtensionsSnapshot({ includeManifest }).map((entry) => cloneEntry(entry, includeManifest));
    };

    const findEntryInternal = (identifier, options = {}) => {
        const includeManifest = options.includeManifest === true;
        const entries = getInstalledExtensionsSnapshot({ includeManifest });
        const value = ensureIdentifier(identifier);
        const lower = value.toLowerCase();
        const match = entries.find((entry) => entry.id === value
            || entry.externalId === value
            || entry.displayName === value
            || entry.id.toLowerCase() === lower
            || entry.externalId.toLowerCase() === lower
            || entry.displayName.toLowerCase() === lower);
        if (!match) {
            throw new Error(`[SillyTavern.extensions] 找不到扩展 ${value}`);
        }
        return includeManifest ? cloneEntry(match, true) : cloneEntry(match, false);
    };

    const buildOperationResult = (entry, extra = {}, includeManifest = false) => Object.freeze({
        extension: entry ? cloneEntry(entry, includeManifest) : null,
        reloadRequired: isExtensionReloadPending(),
        ...extra,
    });

    const resolveSourceDestination = (entry, destination) => {
        const allowedTargets = ['global', 'local'];
        if (!allowedTargets.includes(entry.type)) {
            throw new Error(`[SillyTavern.extensions] 扩展 ${entry.displayName} 不支持移动`);
        }
        const target = destination === 'global' ? 'global' : destination === 'local' ? 'local' : null;
        if (!target) {
            throw new Error('[SillyTavern.extensions] destination 只能是 "global" 或 "local"');
        }
        if (target === entry.type) {
            return null;
        }
        return target;
    };

    return Object.freeze({
        listInstalled(options = {}) {
            return snapshot(options);
        },
        snapshot(options = {}) {
            return snapshot(options);
        },
        listDiscovered: async () => {
            const discovered = await discoverExtensions();
            return Array.isArray(discovered) ? discovered.map((item) => ({ ...item })) : [];
        },
        getErrors: () => getExtensionLoadErrors(),
        enable: async (name, options = {}) => {
            const includeManifest = options.includeManifest === true;
            const entry = findEntryInternal(name, { includeManifest });
            const reload = normalizeBoolean(options.reload, false);
            await enableExtension(entry.id, reload);
            const updated = findEntryInternal(entry.id, { includeManifest });
            return buildOperationResult(updated, {}, includeManifest);
        },
        disable: async (name, options = {}) => {
            const includeManifest = options.includeManifest === true;
            const entry = findEntryInternal(name, { includeManifest });
            const reload = normalizeBoolean(options.reload, false);
            await disableExtension(entry.id, reload);
            const updated = findEntryInternal(entry.id, { includeManifest });
            return buildOperationResult(updated, {}, includeManifest);
        },
        install: async ({ url, branch = '', global = false, notify, includeManifest = false } = {}) => {
            const installUrl = ensureIdentifier(url);
            const before = getInstalledExtensionsSnapshot({ includeManifest: true });
            const shouldNotify = resolveNotifyPreference(notify);
            const result = await installExtension(installUrl, Boolean(global), branch, { notify: shouldNotify });
            const after = getInstalledExtensionsSnapshot({ includeManifest: true });

            let installedEntry = null;
            if (result?.ok) {
                installedEntry = after.find((entry) => !before.some((prev) => prev.id === entry.id));
                if (!installedEntry && result.data?.extensionPath) {
                    const normalizedPath = String(result.data.extensionPath).replace(/\\/g, '/');
                    const match = normalizedPath.match(/third-party\/([^/]+)$/);
                    if (match) {
                        const candidateId = `third-party/${match[1]}`;
                        installedEntry = after.find((entry) => entry.id === candidateId || entry.externalId === match[1]);
                    }
                }
            }

            return Object.freeze({
                ok: result?.ok ?? false,
                data: result?.data ?? null,
                extension: installedEntry ? cloneEntry(installedEntry, includeManifest) : null,
                reloadRequired: isExtensionReloadPending(),
            });
        },
        remove: async (name, options = {}) => {
            const includeManifest = options.includeManifest === true;
            const entry = findEntryInternal(name, { includeManifest: true });
            const notify = resolveNotifyPreference(options.notify);
            const reload = normalizeBoolean(options.reload, false);
            const result = await deleteExtension(entry.externalId, { notify, reload });
            return Object.freeze({
                ok: result?.ok ?? false,
                message: result?.message ?? null,
                extension: cloneEntry(entry, includeManifest),
                reloadRequired: isExtensionReloadPending(),
            });
        },
        move: async (name, destination, options = {}) => {
            const includeManifest = options.includeManifest === true;
            const entry = findEntryInternal(name, { includeManifest: true });
            const target = resolveSourceDestination(entry, destination);
            if (!target) {
                return buildOperationResult(entry, { ok: true, changed: false }, includeManifest);
            }
            const notify = resolveNotifyPreference(options.notify);
            const refreshDetails = options.refreshDetails !== false;
            const result = await moveExtension(entry.externalId, entry.type, target, { notify, refreshDetails });
            const updated = findEntryInternal(entry.id, { includeManifest });
            return buildOperationResult(updated, { ok: result?.ok ?? false, message: result?.message ?? null }, includeManifest);
        },
        switchBranch: async (name, branch, options = {}) => {
            const includeManifest = options.includeManifest === true;
            const entry = findEntryInternal(name, { includeManifest: true });
            const branchName = ensureIdentifier(branch);
            const notify = resolveNotifyPreference(options.notify);
            const refreshDetails = options.refreshDetails !== false;
            const result = await switchExtensionBranch(entry.externalId, entry.type === 'global', branchName, { notify, refreshDetails });
            return Object.freeze({
                ok: result?.ok ?? false,
                message: result?.message ?? null,
                reloadRequired: isExtensionReloadPending(),
                extension: findEntryInternal(entry.id, { includeManifest }),
            });
        },
        update: async (name, options = {}) => {
            const includeManifest = options.includeManifest === true;
            const entry = findEntryInternal(name, { includeManifest: true });
            const response = await updateExtension(entry.externalId, {
                quiet: options.quiet === true,
                notify: resolveNotifyPreference(options.notify),
                refreshDetails: options.refreshDetails !== false,
                timeout: options.timeout,
            });
            return Object.freeze({
                ok: response?.ok ?? false,
                data: response?.data ?? null,
                reloadRequired: isExtensionReloadPending(),
                extension: findEntryInternal(entry.id, { includeManifest }),
            });
        },
        updateAll: async (options = {}) => {
            const response = await autoUpdateExtensions(Boolean(options.force), { notify: resolveNotifyPreference(options.notify) });
            return Object.freeze({
                ok: response?.ok ?? false,
                reloadRequired: isExtensionReloadPending(),
            });
        },
        checkUpdates: async (options = {}) => {
            const response = await checkForExtensionUpdates(Boolean(options.force), { notify: resolveNotifyPreference(options.notify) });
            return Object.freeze({
                ok: response?.ok ?? false,
                updates: response?.updates ?? [],
                reloadRequired: isExtensionReloadPending(),
            });
        },
        getBranches: async (name, options = {}) => {
            const entry = findEntryInternal(name, { includeManifest: false });
            return getExtensionBranches(entry.externalId, entry.type === 'global', { notify: resolveNotifyPreference(options.notify) });
        },
        getVersion: async (name, options = {}) => {
            const entry = findEntryInternal(name, { includeManifest: false });
            return getExtensionVersion(entry.externalId, options?.signal);
        },
        refresh: async (options = {}) => {
            const settings = options.settings ?? {};
            const versionChanged = Boolean(options.versionChanged);
            const enableAutoUpdate = Boolean(options.enableAutoUpdate);
            await loadExtensionSettings(settings, versionChanged, enableAutoUpdate);
            return snapshot({ includeManifest: options.includeManifest === true });
        },
        reloadPending: () => isExtensionReloadPending(),
        clearReloadFlag: () => {
            clearExtensionReloadFlag();
        },
    });
}

extensionNamespace.manager = createExtensionManagerApi();

function createCharactersApi() {
    const coerceIndex = (value) => {
        const index = Number(value);
        if (!Number.isInteger(index) || index < 0 || index >= characters.length) {
            throw new RangeError('[SillyTavern.extensions] 无效的角色索引');
        }
        return index;
    };

    const snapshot = () => characters.map((character, index) => ({ index, character: cloneMessageObject(character) }));

    const list = async ({ refresh = false } = {}) => {
        if (refresh) {
            await getCharacters();
        }
        return snapshot();
    };

    const get = (index) => {
        const resolved = coerceIndex(index);
        return cloneMessageObject(characters[resolved]);
    };

    const getActive = () => {
        if (!Number.isInteger(this_chid) || this_chid < 0 || this_chid >= characters.length) {
            return null;
        }
        return { index: this_chid, character: cloneMessageObject(characters[this_chid]) };
    };

    const setActive = async (index, { switchMenu = true } = {}) => {
        const resolved = coerceIndex(index);
        await selectCharacterById(resolved, { switchMenu });
        return get(resolved);
    };

    const runWithCharacter = async (index, fn) => {
        const resolved = coerceIndex(index);
        const previous = Number.isInteger(this_chid) ? this_chid : null;
        if (previous !== null && previous !== resolved) {
            await selectCharacterById(resolved, { switchMenu: false });
        }
        try {
            return await fn(resolved);
        } finally {
            if (previous !== null && previous !== resolved) {
                await selectCharacterById(previous, { switchMenu: false });
            }
        }
    };

    const rename = async (index, newName, options = {}) => {
        if (typeof newName !== 'string' || !newName.trim()) {
            throw new TypeError('[SillyTavern.extensions] 角色新名称必须为非空字符串');
        }
        await runWithCharacter(index, () => renameCharacter(newName, options));
        return get(index);
    };

    const duplicate = async (index) => {
        const resolved = coerceIndex(index);
        await runWithCharacter(resolved, () => duplicateCharacter());
        await getCharacters();
        return snapshot();
    };

    const remove = async (index, options = {}) => {
        const resolved = coerceIndex(index);
        const avatar = characters[resolved]?.avatar;
        if (!avatar) {
            throw new Error('[SillyTavern.extensions] 找不到对应角色的头像键');
        }
        await deleteCharacter(avatar, options);
        await getCharacters();
        return snapshot();
    };

    const refresh = async () => {
        await getCharacters();
        return snapshot();
    };

    const CHARACTER_EVENTS = Object.freeze({
        EDITED: event_types.CHARACTER_EDITED,
        DELETED: event_types.CHARACTER_DELETED,
        DUPLICATED: event_types.CHARACTER_DUPLICATED,
        RENAMED: event_types.CHARACTER_RENAMED,
        PAGE_LOADED: event_types.CHARACTER_PAGE_LOADED,
    });

    const on = (eventName, handler, options = {}) => extensionNamespace.events.on(eventName, handler, options);
    const onAnyChange = (handler, options = {}) => combineTokens(Object.values(CHARACTER_EVENTS).map(eventName => on(eventName, handler, options)));

    return Object.freeze({
        list,
        get,
        getActive,
        setActive,
        rename,
        duplicate,
        remove,
        refresh,
        events: CHARACTER_EVENTS,
        on,
        onAnyChange,
    });
}

extensionNamespace.characters = createCharactersApi();

function createPresetsApi() {
    const ensureManager = (apiId) => {
        const manager = getPresetManager(apiId);
        if (!manager) {
            throw new Error(`[SillyTavern.extensions] 未找到 API ${apiId} 对应的预设管理器`);
        }
        return manager;
    };

    const list = (apiId) => {
        const manager = getPresetManager(apiId);
        return manager ? manager.getAllPresets().slice() : [];
    };

    const getSelected = (apiId) => {
        const manager = getPresetManager(apiId);
        return manager ? manager.getSelectedPresetName() : null;
    };

    const select = (apiId, value) => {
        const manager = ensureManager(apiId);
        manager.selectPreset(value);
        return manager.getSelectedPresetName();
    };

    const getPresetSettingsSnapshot = (apiId, name) => {
        const manager = ensureManager(apiId);
        const targetName = name ?? manager.getSelectedPresetName();
        return cloneMessageObject(manager.getPresetSettings(targetName));
    };

    const save = async (apiId, name, settings, options = {}) => {
        const manager = ensureManager(apiId);
        await manager.savePreset(name, settings, options);
        return getPresetSettingsSnapshot(apiId, name);
    };

    const saveAs = async (apiId) => {
        const manager = ensureManager(apiId);
        await manager.savePresetAs();
        return manager.getSelectedPresetName();
    };

    const rename = async (apiId, newName) => {
        const manager = ensureManager(apiId);
        await manager.renamePreset(newName);
        return manager.getSelectedPresetName();
    };

    const remove = async (apiId, name) => {
        const manager = ensureManager(apiId);
        await manager.deletePreset(name);
        return list(apiId);
    };

    const events = Object.freeze({
        CHANGED: event_types.PRESET_CHANGED,
        DELETED: event_types.PRESET_DELETED,
    });

    const on = (eventName, handler, options = {}) => extensionNamespace.events.on(eventName, handler, options);

    return Object.freeze({
        list,
        getSelected,
        select,
        getSettings: getPresetSettingsSnapshot,
        save,
        saveAs,
        rename,
        remove,
        events,
        on,
    });
}

extensionNamespace.presets = createPresetsApi();

function createUiApi() {
    const resolveElement = (selector) => {
        if (typeof selector === 'string') {
            return document.querySelector(selector);
        }
        return selector instanceof HTMLElement ? selector : null;
    };

    const toggleInlineDrawer = (selector, expand = undefined) => {
        const element = resolveElement(selector);
        if (!element) {
            return false;
        }
        toggleDrawer(element, expand !== undefined ? Boolean(expand) : undefined);
        return true;
    };

    const focusElement = (selector) => {
        const element = resolveElement(selector);
        if (element) {
            element.focus();
            return true;
        }
        return false;
    };

    const scrollIntoView = (selector, { behavior = 'smooth', block = 'center' } = {}) => {
        const element = resolveElement(selector);
        if (element) {
            element.scrollIntoView({ behavior, block });
            return true;
        }
        return false;
    };

    const setClass = (selector, className, value) => {
        const element = resolveElement(selector);
        if (!element) {
            return false;
        }
        element.classList.toggle(className, value);
        return true;
    };

    const showToast = (type, message, title = '', options = {}) => {
        if (typeof toastr?.[type] === 'function') {
            toastr[type](message, title, options);
        }
    };

    return Object.freeze({
        toggleDrawer: toggleInlineDrawer,
        focus: focusElement,
        scrollIntoView,
        setClass,
        bodyClass: (className, value) => document.body.classList.toggle(className, value),
        showToast,
        showLoader,
        hideLoader,
    });
}

extensionNamespace.ui = createUiApi();

function createVariablesApi() {
    const getPowerUser = () => cloneMessageObject(power_user);

    const updatePowerUser = async (updater) => {
        const draft = getPowerUser();
        const result = typeof updater === 'function' ? await Promise.resolve(updater(draft)) : updater;
        const next = result && typeof result === 'object' ? result : draft;
        Object.assign(power_user, next);
        await applyPowerUserSettings();
        saveSettingsDebounced();
        return getPowerUser();
    };

    const getSettingsSnapshot = () => cloneMessageObject(settings ?? {});

    const updateSettings = async (updater) => {
        const draft = getSettingsSnapshot();
        const result = typeof updater === 'function' ? await Promise.resolve(updater(draft)) : updater;
        const next = result && typeof result === 'object' ? result : draft;
        settings = next;
        await saveSettings();
        saveSettingsDebounced();
        await eventSource.emit(event_types.SETTINGS_UPDATED, cloneMessageObject(settings)).catch((error) => {
            console.error('[SillyTavern.extensions] SETTINGS_UPDATED 事件触发失败', error);
        });
        return getSettingsSnapshot();
    };

    const settingsEvents = Object.freeze({
        SETTINGS_UPDATED: event_types.SETTINGS_UPDATED,
    });

    const createScopedApi = (scope) => Object.freeze({
        get: (key, options = {}) => variableService.get(scope, key, options),
        set: (key, value, options = {}) => variableService.set(scope, key, value, options),
        remove: (key, options = {}) => variableService.remove(scope, key, options),
        mutate: (key, mutator, options = {}) => variableService.mutate(scope, key, mutator, options),
        transaction: (callback, options = {}) => variableService.transaction(scope, callback, options),
    });

    const subscribe = (handler) => variableService.subscribe(handler);

    const replaceVariablesApi = async (variables, option = {}) => {
        const { scope, options } = normalizeVariableScopeOption(option);
        await replaceVariablesInternal(scope, variables, options);
    };

    const updateVariablesWithApi = async (updater, option = {}) => {
        if (typeof updater !== 'function') {
            throw new Error('updateVariablesWith 需要传入函数类型的 updater');
        }
        const { scope, options } = normalizeVariableScopeOption(option);
        const currentStore = getSnapshotStoreForScope(scope, options);
        const draft = cloneVariablesStore(currentStore);
        const result = await Promise.resolve(updater(cloneVariablesStore(draft)));
        const nextStore = result && typeof result === 'object' ? result : draft;
        await replaceVariablesInternal(scope, nextStore, options);
        return getSnapshotStoreForScope(scope, options);
    };

    const insertOrAssignVariablesApi = async (values, option = {}) => {
        const { scope, options } = normalizeVariableScopeOption(option);
        const payload = values && typeof values === 'object' ? values : {};
        await variableService.transaction(scope, ({ set }) => {
            for (const [key, value] of Object.entries(payload)) {
                set(key, value);
            }
        }, options);
        return getSnapshotStoreForScope(scope, options);
    };

    const insertVariablesApi = async (values, option = {}) => {
        const { scope, options } = normalizeVariableScopeOption(option);
        const payload = values && typeof values === 'object' ? values : {};
        const existing = getSnapshotStoreForScope(scope, options);
        await variableService.transaction(scope, ({ set }) => {
            for (const [key, value] of Object.entries(payload)) {
                if (!Object.prototype.hasOwnProperty.call(existing, key)) {
                    set(key, value);
                }
            }
        }, options);
        return getSnapshotStoreForScope(scope, options);
    };

    const deleteVariableApi = async (path, option = {}) => {
        const { scope, options } = normalizeVariableScopeOption(option);
        const currentStore = getSnapshotStoreForScope(scope, options);
        const draft = cloneVariablesStore(currentStore);
        const deleteOccurred = deleteByPath(draft, path);
        if (!deleteOccurred) {
            return { variables: currentStore, delete_occurred: false };
        }
        await replaceVariablesInternal(scope, draft, options);
        return {
            variables: getSnapshotStoreForScope(scope, options),
            delete_occurred: true,
        };
    };

    return Object.freeze({
        scopes: VARIABLE_SCOPE,
        signals: VARIABLE_EVENTS,
        mutations: {
            skip: MUTATION_SKIP,
            remove: MUTATION_REMOVE,
        },
        subscribe,
        watch: subscribe,
        get: (scope, key, options = {}) => variableService.get(scope, key, options),
        set: (scope, key, value, options = {}) => variableService.set(scope, key, value, options),
        mutate: (scope, key, mutator, options = {}) => variableService.mutate(scope, key, mutator, options),
        remove: (scope, key, options = {}) => variableService.remove(scope, key, options),
        transaction: (scope, callback, options = {}) => variableService.transaction(scope, callback, options),
        snapshot: (options = {}) => variableService.snapshot(options),
        getMonitoringSnapshot: () => variableService.getMonitoringSnapshot(),
        refreshMonitoringConfig: () => variableService.refreshMonitoringConfig(),
        message: createScopedApi(VARIABLE_SCOPE.MESSAGE),
        chat: createScopedApi(VARIABLE_SCOPE.CHAT),
        global: createScopedApi(VARIABLE_SCOPE.GLOBAL),
        character: createScopedApi(VARIABLE_SCOPE.CHARACTER),
        script: createScopedApi(VARIABLE_SCOPE.SCRIPT),
        replaceVariables: replaceVariablesApi,
        updateVariablesWith: updateVariablesWithApi,
        insertOrAssignVariables: insertOrAssignVariablesApi,
        insertVariables: insertVariablesApi,
        deleteVariable: deleteVariableApi,
        getPowerUser,
        updatePowerUser,
        getSettings: getSettingsSnapshot,
        updateSettings,
        get mainApi() {
            return main_api;
        },
        events: settingsEvents,
        onSettingsUpdated: (handler, options = {}) => extensionNamespace.events.on(event_types.SETTINGS_UPDATED, handler, options),
    });
}

extensionNamespace.variableService = variableService;
extensionNamespace.variables = createVariablesApi();

const VARIABLE_EVENT_BRIDGE = {
    [VARIABLE_EVENTS.UPDATE]: event_types.VARIABLES_UPDATED,
    [VARIABLE_EVENTS.DELETE]: event_types.VARIABLES_UPDATED,
    [VARIABLE_EVENTS.BATCH]: event_types.VARIABLES_BATCH_UPDATED,
};

variableService.subscribe((event) => {
    const eventName = VARIABLE_EVENT_BRIDGE[event.type] ?? event_types.VARIABLES_UPDATED;

    eventSource.emit(eventName, event).catch((error) => {
        console.error('[SillyTavern] 变量事件转发失败 (eventSource)', error);
    });

    try {
        extensionNamespace.events.emit(eventName, event, { allowList: [eventName] });
    } catch (error) {
        console.error('[SillyTavern] 变量事件转发失败 (extensions)', error);
    }

    try {
        const domEventName = event.type === VARIABLE_EVENTS.BATCH ? 'st-variables-batch-updated' : 'st-variables-updated';
        document.dispatchEvent(new CustomEvent(domEventName, { detail: event }));
    } catch (error) {
        console.error('[SillyTavern] 变量事件转发失败 (DOM)', error);
    }
});

const EXTENSION_ERRORS = Object.freeze({
    OK: 'EXT_OK',
    HANDLER_REJECTED: 'EXT_E_HANDLER_REJECTED',
    TIMEOUT: 'EXT_E_TIMEOUT',
    ABORTED: 'EXT_E_ABORTED',
    FORBIDDEN: 'EXT_E_FORBIDDEN',
    BAD_PAYLOAD: 'EXT_E_BAD_PAYLOAD',
    UNSUPPORTED: 'EXT_E_UNSUPPORTED',
    NOT_FOUND: 'EXT_E_NOT_FOUND',
    UNAVAILABLE: 'EXT_E_UNAVAILABLE',
});
extensionNamespace.errors = EXTENSION_ERRORS;

const deprecatedGlobalWarnings = new Set();
function defineDeprecatedGlobalFunction(name, implementation, hint) {
    const wrapper = function (...args) {
        if (!deprecatedGlobalWarnings.has(name)) {
            console.warn(`[SillyTavern] 全局函数 ${name} 已弃用，${hint}`);
            deprecatedGlobalWarnings.add(name);
        }
        return implementation(...args);
    };
    try {
        Object.defineProperty(window, name, { value: wrapper, writable: false, configurable: false });
    } catch (error) {
        window[name] = wrapper;
    }
}

function defineReadonlyGlobal(name, value, { freezeValue = false } = {}) {
    const finalValue = freezeValue && value && typeof value === 'object' ? Object.freeze(value) : value;
    try {
        Object.defineProperty(window, name, { value: finalValue, writable: false, configurable: false });
    } catch (error) {
        window[name] = finalValue;
    }
}

defineDeprecatedGlobalFunction('registerMessageDom', registerMessageDom, '请改用 SillyTavern.extensions.messages.onMount / getElement');
defineDeprecatedGlobalFunction('unregisterMessageDom', unregisterMessageDom, '请改用 SillyTavern.extensions.messages.onUnmount / getElement');
defineDeprecatedGlobalFunction('reassignMessageDomId', reassignMessageDomId, '请改用 SillyTavern.extensions.messages 接口维护 DOM');
defineDeprecatedGlobalFunction('rebuildMessageDomRegistry', rebuildMessageDomRegistry, '请改用 SillyTavern.extensions.messages.getElement 与虚拟化事件');

defineDeprecatedGlobalFunction('registerWorkerFallback', (type, fallback) => workerManager.registerFallback(type, fallback), '请改用 SillyTavern.extensions.workers.registerFallback');
defineDeprecatedGlobalFunction('extendWorkerTaskConfig', (type, overrides) => workerManager.extendTaskConfig(type, overrides), '请改用 SillyTavern.extensions.workers.extendConfig');

defineReadonlyGlobal('workerManager', workerManager);
defineReadonlyGlobal('setWorkerOptimizationEnabled', setWorkerOptimizationEnabled);
defineReadonlyGlobal('__renderTaskDebug__', window.__renderTaskDebug__, { freezeValue: true });
defineReadonlyGlobal('__largeTemplateDebug__', window.__largeTemplateDebug__, { freezeValue: true });

const legacyWarningsShown = new Set();
const LEGACY_HINTS = {
    registerMessageDom: '请改用 SillyTavern.extensions.messages.onMount / getElement。',
    unregisterMessageDom: '请改用 SillyTavern.extensions.messages.onUnmount。',
    reassignMessageDomId: '请改用 SillyTavern.extensions.messages 接口维护消息 DOM。',
    rebuildMessageDomRegistry: '请改用 SillyTavern.extensions.messages.getElement 与虚拟化事件。',
    eventSource: '请改用 SillyTavern.extensions.events。',
    event_types: '请改用 SillyTavern.extensions.events.types。',
    workerManager: '请改用 SillyTavern.extensions.workers。',
    registerWorkerFallback: '请改用 SillyTavern.extensions.workers.registerFallback。',
    extendWorkerTaskConfig: '请改用 SillyTavern.extensions.workers.extendConfig。',
    setWorkerOptimizationEnabled: '请改用 SillyTavern.extensions.variables.updatePowerUser，自行控制 worker 优化。',
};

function emitLegacyWarning(name) {
    if (legacyWarningsShown.has(name)) {
        return;
    }
    legacyWarningsShown.add(name);
    const hint = LEGACY_HINTS[name] ?? '该入口已弃用，请迁移至新 SDK。';
    console.warn(`[SillyTavernLegacy] ${name} 已弃用，${hint}`);
}

const legacyApiEntries = {
    registerMessageDom: (...args) => registerMessageDom(...args),
    unregisterMessageDom: (...args) => unregisterMessageDom(...args),
    reassignMessageDomId: (...args) => reassignMessageDomId(...args),
    rebuildMessageDomRegistry: (...args) => rebuildMessageDomRegistry(...args),
    eventSource: () => eventSource,
    event_types: () => event_types,
    workerManager: () => workerManager,
    registerWorkerFallback: (...args) => workerManager.registerFallback(...args),
    extendWorkerTaskConfig: (...args) => workerManager.extendTaskConfig(...args),
    setWorkerOptimizationEnabled: (enabled) => setWorkerOptimizationEnabled(enabled),
};

const SillyTavernLegacy = new Proxy({ version: '1.0.0' }, {
    get(_target, prop) {
        if (typeof prop !== 'string') {
            return undefined;
        }
        if (!legacyApiEntries[prop]) {
            return undefined;
        }
        emitLegacyWarning(prop);
        const entry = legacyApiEntries[prop];
        return typeof entry === 'function'
            ? entry
            : entry();
    },
});

sillyTavernRoot.legacy = SillyTavernLegacy;
defineReadonlyGlobal('SillyTavernLegacy', SillyTavernLegacy);

sillyTavernRoot.extensions = extensionNamespace;

/**
 * Gets stopping sequences for the prompt.
 * @param {boolean} isImpersonate A request is made to impersonate a user
 * @param {boolean} isContinue A request is made to continue the message
 * @returns {string[]} Array of stopping strings
 */
export function getStoppingStrings(isImpersonate, isContinue) {
    const result = [];

    if (power_user.context.names_as_stop_strings) {
        const charString = `\n${name2}:`;
        const userString = `\n${name1}:`;
        result.push(isImpersonate ? charString : userString);

        result.push(userString);

        if (isContinue && Array.isArray(chat) && chat[chat.length - 1]?.is_user) {
            result.push(charString);
        }

        // Add group members as stopping strings if generating for a specific group member or user. (Allow slash commands to work around name stopping string restrictions)
        if (selected_group && (name2 || isImpersonate)) {
            const group = groups.find(x => x.id === selected_group);

            if (group && Array.isArray(group.members)) {
                const names = group.members
                    .map(x => characters.find(y => y.avatar == x))
                    .filter(x => x && x.name && x.name !== name2)
                    .map(x => `\n${x.name}:`);
                result.push(...names);
            }
        }
    }

    result.push(...getInstructStoppingSequences());
    result.push(...getCustomStoppingStrings());

    if (power_user.single_line) {
        result.unshift('\n');
    }

    return result.filter(x => x).filter(onlyUnique);
}

/**
 * Background generation based on the provided prompt.
 * @typedef {object} GenerateQuietPromptParams
 * @prop {string} [quietPrompt] Instruction prompt for the AI
 * @prop {boolean} [quietToLoud] Whether the message should be sent in a foreground (loud) or background (quiet) mode
 * @prop {boolean} [skipWIAN] Whether to skip addition of World Info and Author's Note into the prompt
 * @prop {string} [quietImage] Image to use for the quiet prompt
 * @prop {string} [quietName] Name to use for the quiet prompt (defaults to "System:")
 * @prop {number} [responseLength] Maximum response length. If unset, the global default value is used.
 * @prop {number} [forceChId] Character ID to use for this generation run. Works in groups only.
 * @prop {object} [jsonSchema] JSON schema to use for the structured generation. Usually requires a special instruction.
 * @prop {boolean} [removeReasoning] Parses and removes the reasoning block according to reasoning format preferences
 * @prop {boolean} [trimToSentence] Whether to trim the response to the last complete sentence
 * @param {GenerateQuietPromptParams} params Parameters for the quiet prompt generation
 * @returns {Promise<string>} Generated text. If using structured output, will contain a serialized JSON object.
 */
export async function generateQuietPrompt({ quietPrompt = '', quietToLoud = false, skipWIAN = false, quietImage = null, quietName = null, responseLength = null, forceChId = null, jsonSchema = null, removeReasoning = true, trimToSentence = false } = {}) {
    if (arguments.length > 0 && typeof arguments[0] !== 'object') {
        console.trace('generateQuietPrompt called with positional arguments. Please use an object instead.');
        [quietPrompt, quietToLoud, skipWIAN, quietImage, quietName, responseLength, forceChId, jsonSchema] = arguments;
    }

    const responseLengthCustomized = typeof responseLength === 'number' && responseLength > 0;
    let eventHook = () => { };
    try {
        /** @type {GenerateOptions} */
        const generateOptions = {
            quiet_prompt: quietPrompt ?? '',
            quietToLoud: quietToLoud ?? false,
            skipWIAN: skipWIAN ?? false,
            force_name2: true,
            quietImage: quietImage ?? null,
            quietName: quietName ?? null,
            force_chid: forceChId ?? null,
            jsonSchema: jsonSchema ?? null,
        };
        if (responseLengthCustomized) {
            TempResponseLength.save(main_api, responseLength);
            eventHook = TempResponseLength.setupEventHook(main_api);
        }
        let result = await Generate('quiet', generateOptions);
        result = trimToSentence ? trimToEndSentence(result) : result;
        result = removeReasoning ? removeReasoningFromString(result) : result;
        return result;
    } finally {
        if (responseLengthCustomized && TempResponseLength.isCustomized()) {
            TempResponseLength.restore(main_api);
            TempResponseLength.removeEventHook(main_api, eventHook);
        }
    }
}

/**
 * Executes slash commands and returns the new text and whether the generation was interrupted.
 * @param {string} message Text to be sent
 * @returns {Promise<boolean>} Whether the message sending was interrupted
 */
export async function processCommands(message) {
    if (!message || !message.trim().startsWith('/')) {
        return false;
    }
    await executeSlashCommandsOnChatInput(message, {
        clearChatInput: true,
    });
    return true;
}

const BIAS_TEMPLATE_CACHE_LIMIT = 64;
const biasTemplateCache = new Map();

function getBiasTemplate(message) {
    if (biasTemplateCache.has(message)) {
        const cached = biasTemplateCache.get(message);
        biasTemplateCache.delete(message);
        biasTemplateCache.set(message, cached);
        return cached;
    }

    const compiled = Handlebars.compile(message);
    biasTemplateCache.set(message, compiled);
    if (biasTemplateCache.size > BIAS_TEMPLATE_CACHE_LIMIT) {
        const oldestKey = biasTemplateCache.keys().next().value;
        biasTemplateCache.delete(oldestKey);
    }
    return compiled;
}

/**
 * Extracts the contents of bias macros from a message.
 * @param {string} message Message text
 * @returns {string} Message bias extracted from the message (or an empty string if not found)
 */
export function extractMessageBias(message) {
    if (!message) {
        return '';
    }

    try {
        const biasMatches = [];
        const template = getBiasTemplate(message);
        template({}, {
            helpers: {
                bias(text) {
                    biasMatches.push(text);
                    return '';
                },
            },
        });

        if (biasMatches && biasMatches.length > 0) {
            return ` ${biasMatches.join(' ')}`;
        }

        return '';
    } catch {
        return '';
    }
}

/**
 * Removes impersonated group member lines from the group member messages.
 * Doesn't do anything if group reply trimming is disabled.
 * @param {string} getMessage Group message
 * @returns Cleaned-up group message
 */
function cleanGroupMessage(getMessage) {
    if (power_user.disable_group_trimming) {
        return getMessage;
    }

    const group = groups.find((x) => x.id == selected_group);

    if (group && Array.isArray(group.members) && group.members) {
        for (let member of group.members) {
            const character = characters.find(x => x.avatar == member);

            if (!character) {
                continue;
            }

            const name = character.name;

            // Skip current speaker.
            if (name === name2) {
                continue;
            }

            const regex = new RegExp(`(^|\n)${escapeRegex(name)}:`);
            const nameMatch = getMessage.match(regex);
            if (nameMatch) {
                getMessage = getMessage.substring(0, nameMatch.index);
            }
        }
    }
    return getMessage;
}

function addPersonaDescriptionExtensionPrompt() {
    const INJECT_TAG = 'PERSONA_DESCRIPTION';
    setExtensionPrompt(INJECT_TAG, '', extension_prompt_types.IN_PROMPT, 0);

    if (!power_user.persona_description || power_user.persona_description_position === persona_description_positions.NONE) {
        return;
    }

    const promptPositions = [persona_description_positions.BOTTOM_AN, persona_description_positions.TOP_AN];

    if (promptPositions.includes(power_user.persona_description_position) && shouldWIAddPrompt) {
        const originalAN = extension_prompts[NOTE_MODULE_NAME].value;
        const ANWithDesc = power_user.persona_description_position === persona_description_positions.TOP_AN
            ? `${power_user.persona_description}\n${originalAN}`
            : `${originalAN}\n${power_user.persona_description}`;

        setExtensionPrompt(NOTE_MODULE_NAME, ANWithDesc, chat_metadata[metadata_keys.position], chat_metadata[metadata_keys.depth], extension_settings.note.allowWIScan, chat_metadata[metadata_keys.role]);
    }

    if (power_user.persona_description_position === persona_description_positions.AT_DEPTH) {
        setExtensionPrompt(INJECT_TAG, power_user.persona_description, extension_prompt_types.IN_CHAT, power_user.persona_description_depth, true, power_user.persona_description_role);
    }
}

/**
 * Returns all extension prompts combined.
 * @returns {Promise<string>} Combined extension prompts
 */
async function getAllExtensionPrompts() {
    const values = [];

    for (const prompt of Object.values(extension_prompts)) {
        const value = prompt?.value?.trim();

        if (!value) {
            continue;
        }

        const hasFilter = typeof prompt.filter === 'function';
        if (hasFilter && !await prompt.filter()) {
            continue;
        }

        values.push(value);
    }

    return substituteParams(values.join('\n'));
}

/**
 * Wrapper to fetch extension prompts by module name
 * @param {string} moduleName Module name
 * @returns {Promise<string>} Extension prompt
 */
export async function getExtensionPromptByName(moduleName) {
    if (!moduleName) {
        return '';
    }

    const prompt = extension_prompts[moduleName];

    if (!prompt) {
        return '';
    }

    const hasFilter = typeof prompt.filter === 'function';

    if (hasFilter && !await prompt.filter()) {
        return '';
    }

    return substituteParams(prompt.value);
}

/**
 * Gets the maximum depth of extension prompts.
 * @returns {number} Maximum depth of extension prompts
 */
export function getExtensionPromptMaxDepth() {
    return MAX_INJECTION_DEPTH;
    /*
    const prompts = Object.values(extension_prompts);
    const maxDepth = Math.max(...prompts.map(x => x.depth ?? 0));
    // Clamp to 1 <= depth <= MAX_INJECTION_DEPTH
    return Math.max(Math.min(maxDepth, MAX_INJECTION_DEPTH), 1);
    */
}

/**
 * Returns the extension prompt for the given position, depth, and role.
 * If multiple prompts are found, they are joined with a separator.
 * @param {number} [position] Position of the prompt
 * @param {number} [depth] Depth of the prompt
 * @param {string} [separator] Separator for joining multiple prompts
 * @param {number} [role] Role of the prompt
 * @param {boolean} [wrap] Wrap start and end with a separator
 * @returns {Promise<string>} Extension prompt
 */
export async function getExtensionPrompt(position = extension_prompt_types.IN_PROMPT, depth = undefined, separator = '\n', role = undefined, wrap = true) {
    const filterByFunction = async (prompt) => {
        const hasFilter = typeof prompt.filter === 'function';
        if (hasFilter && !await prompt.filter()) {
            return false;
        }
        return true;
    };
    const promptPromises = Object.keys(extension_prompts)
        .sort()
        .map((x) => extension_prompts[x])
        .filter(x => x.position == position && x.value)
        .filter(x => depth === undefined || x.depth === undefined || x.depth === depth)
        .filter(x => role === undefined || x.role === undefined || x.role === role)
        .filter(filterByFunction);
    const prompts = await Promise.all(promptPromises);

    let values = prompts.map(x => x.value.trim()).join(separator);
    if (wrap && values.length && !values.startsWith(separator)) {
        values = separator + values;
    }
    if (wrap && values.length && !values.endsWith(separator)) {
        values = values + separator;
    }
    if (values.length) {
        values = substituteParams(values);
    }
    return values;
}

export function baseChatReplace(value, name1, name2) {
    if (value !== undefined && value.length > 0) {
        const _ = undefined;
        value = substituteParams(value, name1, name2, _, _, false);

        if (power_user.collapse_newlines) {
            value = collapseNewlines(value);
        }

        value = value.replace(/\r/g, '');
    }
    return value;
}

/**
 * Returns the character card fields for the current character.
 * @param {object} [options]
 * @param {number} [options.chid] Optional character index
 *
 * @typedef {object} CharacterCardFields
 * @property {string} system System prompt
 * @property {string} mesExamples Message examples
 * @property {string} description Description
 * @property {string} personality Personality
 * @property {string} persona Persona
 * @property {string} scenario Scenario
 * @property {string} jailbreak Jailbreak instructions
 * @property {string} version Character version
 * @property {string} charDepthPrompt Character depth note
 * @property {string} creatorNotes Character creator notes
 * @returns {CharacterCardFields} Character card fields
 */
export function getCharacterCardFields({ chid = null } = {}) {
    const currentChid = chid ?? this_chid;

    const result = {
        system: '',
        mesExamples: '',
        description: '',
        personality: '',
        persona: '',
        scenario: '',
        jailbreak: '',
        version: '',
        charDepthPrompt: '',
        creatorNotes: '',
    };
    result.persona = baseChatReplace(power_user.persona_description?.trim(), name1, name2);

    const character = characters[currentChid];

    if (!character) {
        return result;
    }

    const scenarioText = chat_metadata['scenario'] || character.scenario || '';
    result.description = baseChatReplace(character.description?.trim(), name1, name2);
    result.personality = baseChatReplace(character.personality?.trim(), name1, name2);
    result.scenario = baseChatReplace(scenarioText.trim(), name1, name2);
    result.mesExamples = baseChatReplace(character.mes_example?.trim(), name1, name2);
    result.system = power_user.prefer_character_prompt ? baseChatReplace(character.data?.system_prompt?.trim(), name1, name2) : '';
    result.jailbreak = power_user.prefer_character_jailbreak ? baseChatReplace(character.data?.post_history_instructions?.trim(), name1, name2) : '';
    result.version = character.data?.character_version ?? '';
    result.charDepthPrompt = baseChatReplace(character.data?.extensions?.depth_prompt?.prompt?.trim(), name1, name2);
    result.creatorNotes = baseChatReplace(character.data?.creator_notes?.trim(), name1, name2);

    if (selected_group) {
        const groupCards = getGroupCharacterCards(selected_group, Number(currentChid));

        if (groupCards) {
            result.description = groupCards.description;
            result.personality = groupCards.personality;
            result.scenario = groupCards.scenario;
            result.mesExamples = groupCards.mesExamples;
        }
    }

    return result;
}

/**
 * Parses an examples string.
 * @param {string} examplesStr
 * @returns {string[]} Examples array with block heading
 */
export function parseMesExamples(examplesStr, isInstruct) {
    if (!examplesStr || examplesStr.length === 0 || examplesStr === '<START>') {
        return [];
    }

    if (!examplesStr.startsWith('<START>')) {
        examplesStr = '<START>\n' + examplesStr.trim();
    }

    const exampleSeparator = power_user.context.example_separator ? `${substituteParams(power_user.context.example_separator)}\n` : '';
    const blockHeading = (main_api === 'openai' || isInstruct) ? '<START>\n' : exampleSeparator;
    const splitExamples = examplesStr.split(/<START>/gi).slice(1).map(block => `${blockHeading}${block.trim()}\n`);

    return splitExamples;
}

export function isStreamingEnabled() {
    return (
        (main_api == 'openai' &&
            oai_settings.stream_openai &&
            !(oai_settings.chat_completion_source == chat_completion_sources.OPENAI && ['o1-2024-12-17', 'o1'].includes(oai_settings.openai_model))
        )
        || (main_api == 'kobold' && kai_settings.streaming_kobold && kai_flags.can_use_streaming)
        || (main_api == 'novel' && nai_settings.streaming_novel)
        || (main_api == 'textgenerationwebui' && textgen_settings.streaming));
}

function showStopButton() {
    $('#mes_stop').css({ 'display': 'flex' });
}

function hideStopButton() {
    // prevent NOOP, because hideStopButton() gets called multiple times
    if ($('#mes_stop').css('display') !== 'none') {
        $('#mes_stop').css({ 'display': 'none' });
        eventSource.emit(event_types.GENERATION_ENDED, chat.length);
    }
}

class StreamingProcessor {
    /**
     * Creates a new streaming processor.
     * @param {string} type Generation type
     * @param {boolean} forceName2 If true, force the use of name2
     * @param {Date} timeStarted Date when generation was started
     * @param {string} continueMessage Previous message if the type is 'continue'
     * @param {PromptReasoning} promptReasoning Prompt reasoning instance
     */
    constructor(type, forceName2, timeStarted, continueMessage, promptReasoning) {
        this.result = '';
        this.messageId = -1;
        /** @type {HTMLElement} */
        this.messageDom = null;
        /** @type {HTMLElement} */
        this.messageTextDom = null;
        /** @type {HTMLElement} */
        this.messageTimerDom = null;
        /** @type {HTMLElement} */
        this.messageTokenCounterDom = null;
        /** @type {HTMLTextAreaElement} */
        this.sendTextarea = document.querySelector('#send_textarea');
        this.type = type;
        this.force_name2 = forceName2;
        this.isStopped = false;
        this.isFinished = false;
        this.generator = this.nullStreamingGeneration;
        this.abortController = new AbortController();
        this.firstMessageText = '...';
        this.timeStarted = timeStarted;
        /** @type {number?} */
        this.timeToFirstToken = null;
        this.createdAt = new Date();
        this.continueMessage = type === 'continue' ? continueMessage : '';
        this.swipes = [];
        /** @type {import('./scripts/logprobs.js').TokenLogprobs[]} */
        this.messageLogprobs = [];
        this.toolCalls = [];
        // Initialize reasoning in its own handler
        this.reasoningHandler = new ReasoningHandler(timeStarted);
        /** @type {PromptReasoning} */
        this.promptReasoning = promptReasoning;
        /** @type {string} */
        this.image = '';
    }

    /**
     * Initializes DOM elements for the current message.
     * @param {number} messageId Current message ID
     * @param {boolean?} continueOnReasoning If continuing on reasoning
     */
    async #checkDomElements(messageId, continueOnReasoning = null) {
        if (this.messageDom === null || this.messageTextDom === null) {
            const messageElement = getMessageDom(messageId);
            if (!messageElement && chatVirtualList) {
                chatVirtualList.setWindow(Math.max(0, messageId - CHAT_MIN_WINDOW + 1), messageId + 1);
            }
            this.messageDom = getMessageDom(messageId);
            this.messageTextDom = this.messageDom?.querySelector('.mes_text');
            this.messageTimerDom = this.messageDom?.querySelector('.mes_timer');
            this.messageTokenCounterDom = this.messageDom?.querySelector('.tokenCounterDisplay');
        }
        if (continueOnReasoning) {
            await this.reasoningHandler.process(messageId, false, this.promptReasoning);
        }
        this.reasoningHandler.updateDom(messageId);
    }

    #updateMessageBlockVisibility() {
        if (this.messageDom instanceof HTMLElement && Array.isArray(this.toolCalls) && this.toolCalls.length > 0) {
            const shouldHide = ['', '...'].includes(this.result) && !this.reasoningHandler.reasoning;
            this.messageDom.classList.toggle('displayNone', shouldHide);
        }
    }

    markUIGenStarted() {
        deactivateSendButtons();
    }

    markUIGenStopped() {
        activateSendButtons();
    }

    async onStartStreaming(text) {
        const continueOnReasoning = !!(this.type === 'continue' && this.promptReasoning.prefixReasoning);
        if (continueOnReasoning) {
            this.reasoningHandler.initContinue(this.promptReasoning);
        }

        let messageId = -1;

        if (this.type == 'impersonate') {
            this.sendTextarea.value = '';
            this.sendTextarea.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
            await saveReply({ type: this.type, getMessage: text, fromStreaming: true });
            messageId = chat.length - 1;
            await this.#checkDomElements(messageId, continueOnReasoning);
            this.markUIGenStarted();
        }
        hideSwipeButtons();
        scrollChatToBottom();
        return messageId;
    }

    async onProgressStreaming(messageId, text, isFinal) {
        const isImpersonate = this.type == 'impersonate';
        const isContinue = this.type == 'continue';

        if (!isImpersonate && !isContinue && Array.isArray(this.swipes) && this.swipes.length > 0) {
            for (let i = 0; i < this.swipes.length; i++) {
                this.swipes[i] = cleanUpMessage({
                    getMessage: this.swipes[i],
                    isImpersonate: false,
                    isContinue: false,
                    displayIncompleteSentences: true,
                    stoppingStrings: this.stoppingStrings,
                });
            }
        }

        let processedText = cleanUpMessage({
            getMessage: text,
            isImpersonate: isImpersonate,
            isContinue: isContinue,
            displayIncompleteSentences: !isFinal,
            stoppingStrings: this.stoppingStrings,
        });

        const charsToBalance = ['*', '"', '```', '~~~'];
        for (const char of charsToBalance) {
            if (!isFinal && isOdd(countOccurrences(processedText, char))) {
                const separator = char.length > 1 ? '\n' : '';
                processedText = processedText.trimEnd() + separator + char;
            }
        }

        if (isImpersonate) {
            this.sendTextarea.value = processedText;
            this.sendTextarea.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
            const mesChanged = chat[messageId]['mes'] !== processedText;
            await this.#checkDomElements(messageId);
            this.#updateMessageBlockVisibility();
            const currentTime = new Date();
            chat[messageId]['mes'] = processedText;
            chat[messageId]['gen_started'] = this.timeStarted;
            chat[messageId]['gen_finished'] = currentTime;
            if (!chat[messageId]['extra']) {
                chat[messageId]['extra'] = {};
            }
            chat[messageId]['extra']['time_to_first_token'] = this.timeToFirstToken;

            // Update reasoning
            await this.reasoningHandler.process(messageId, mesChanged, this.promptReasoning);
            processedText = chat[messageId]['mes'];

            // Token count update.
            const tokenCountText = this.reasoningHandler.reasoning + processedText;
            const currentTokenCount = isFinal && power_user.message_token_count_enabled ? await getTokenCountAsync(tokenCountText, 0) : 0;
            if (currentTokenCount) {
                chat[messageId]['extra']['token_count'] = currentTokenCount;
                if (this.messageTokenCounterDom instanceof HTMLElement) {
                    this.messageTokenCounterDom.textContent = `${currentTokenCount}t`;
                }
            }

            if ((this.type == 'swipe' || this.type === 'continue') && Array.isArray(chat[messageId]['swipes'])) {
                chat[messageId]['swipes'][chat[messageId]['swipe_id']] = processedText;
                chat[messageId]['swipe_info'][chat[messageId]['swipe_id']] = {
                    'send_date': chat[messageId]['send_date'],
                    'gen_started': chat[messageId]['gen_started'],
                    'gen_finished': chat[messageId]['gen_finished'],
                    'extra': structuredClone(chat[messageId]['extra']),
                };
            }

            const formattedText = messageFormatting(
                processedText,
                chat[messageId].name,
                chat[messageId].is_system,
                chat[messageId].is_user,
                messageId,
                {},
                false,
            );
            if (this.messageTextDom instanceof HTMLElement) {
                this.messageTextDom.innerHTML = formattedText;
            }

            const timePassed = formatGenerationTimer(this.timeStarted, currentTime, currentTokenCount, this.reasoningHandler.getDuration(), this.timeToFirstToken);
            if (this.messageTimerDom instanceof HTMLElement) {
                this.messageTimerDom.textContent = timePassed.timerValue;
                this.messageTimerDom.title = timePassed.timerTitle;
            }

            this.setFirstSwipe(messageId);
            if (chatVirtualList) {
                const domForVirtual = this.messageDom instanceof Element ? this.messageDom : null;
                queueVirtualListUpdate(messageId, domForVirtual, { mutate: true });
            }
        }

        if (!scrollLock) {
            scrollChatToBottom();
        }
    }

    async onFinishStreaming(messageId, text) {
        this.markUIGenStopped();
        await this.onProgressStreaming(messageId, text, true);
        const finishedElement = getMessageDom(messageId);
        if (finishedElement) {
            addCopyToCodeBlocks($(finishedElement));
        }

        await this.reasoningHandler.finish(messageId);

        if (Array.isArray(this.swipes) && this.swipes.length > 0) {
            const message = chat[messageId];
            const swipeInfoExtra = structuredClone(message.extra ?? {});
            delete swipeInfoExtra.token_count;
            delete swipeInfoExtra.reasoning;
            delete swipeInfoExtra.reasoning_duration;
            const swipeInfo = {
                send_date: message.send_date,
                gen_started: message.gen_started,
                gen_finished: message.gen_finished,
                extra: swipeInfoExtra,
            };
            const swipeInfoArray = Array(this.swipes.length).fill().map(() => structuredClone(swipeInfo));
            parseReasoningInSwipes(this.swipes, swipeInfoArray, message.extra?.reasoning_duration);
            chat[messageId].swipes.push(...this.swipes);
            chat[messageId].swipe_info.push(...swipeInfoArray);
        }

        if (this.image) {
            await processImageAttachment(chat[messageId], { imageUrl: this.image });
            appendMediaToMessage(chat[messageId], $(this.messageDom));
            if (chatVirtualList) {
                const domForVirtual = this.messageDom instanceof Element ? this.messageDom : null;
                queueVirtualListUpdate(messageId, domForVirtual, { measure: true, mutate: true });
            }
        }

        if (this.type !== 'impersonate') {
            await eventSource.emit(event_types.MESSAGE_RECEIVED, this.messageId, this.type);
            await eventSource.emit(event_types.CHARACTER_MESSAGE_RENDERED, this.messageId, this.type);
        } else {
            await eventSource.emit(event_types.IMPERSONATE_READY, text);
        }

        syncMesToSwipe(messageId);
        saveLogprobsForActiveMessage(this.messageLogprobs.filter(Boolean), this.continueMessage);
        await saveChatConditional();
        unblockGeneration();

        const isAborted = this.abortController.signal.aborted;
        if (!isAborted && power_user.auto_swipe && generatedTextFiltered(text)) {
            return swipe_right();
        }

        playMessageSound();

        const finalPayload = {
            type: this.type,
            messageId,
            text,
            streaming: true,
            aborted: isAborted,
            message: cloneMessageObject(chat[messageId]),
            toolCalls: Array.isArray(this.toolCalls) ? this.toolCalls : [],
        };
        await eventSource.emit(event_types.GENERATION_PHASE_AFTER, finalPayload);
    }

    onErrorStreaming() {
        if (!this.abortController.signal.aborted) {
            this.abortController.abort('streaming-error');
        }
        this.isStopped = true;

        this.markUIGenStopped();
        unblockGeneration();

        const noEmitTypes = ['swipe', 'impersonate', 'continue'];
        if (!noEmitTypes.includes(this.type)) {
            eventSource.emit(event_types.MESSAGE_RECEIVED, this.messageId, this.type);
            eventSource.emit(event_types.CHARACTER_MESSAGE_RENDERED, this.messageId, this.type);
        }

        const messageSnapshot = this.messageId >= 0 ? cloneMessageObject(chat[this.messageId]) : null;
        eventSource.emit(event_types.GENERATION_PHASE_AFTER, {
            type: this.type,
            messageId: this.messageId,
            streaming: true,
            aborted: true,
            error: true,
            message: messageSnapshot,
        }).catch(console.error);
    }

    setFirstSwipe(messageId) {
        if (this.type !== 'swipe' && this.type !== 'impersonate') {
            if (Array.isArray(chat[messageId]['swipes']) && chat[messageId]['swipes'].length === 1 && chat[messageId]['swipe_id'] === 0) {
                chat[messageId]['swipes'][0] = chat[messageId]['mes'];
                chat[messageId]['swipe_info'][0] = {
                    'send_date': chat[messageId]['send_date'],
                    'gen_started': chat[messageId]['gen_started'],
                    'gen_finished': chat[messageId]['gen_finished'],
                    'extra': structuredClone(chat[messageId]['extra']),
                };
            }
        }
    }

    onStopStreaming() {
        if (!this.abortController.signal.aborted) {
            this.abortController.abort('streaming-stop');
        }
        this.isFinished = true;
        const messageSnapshot = this.messageId >= 0 ? cloneMessageObject(chat[this.messageId]) : null;
        eventSource.emit(event_types.GENERATION_PHASE_AFTER, {
            type: this.type,
            messageId: this.messageId,
            streaming: true,
            aborted: true,
            manual: true,
            message: messageSnapshot,
        }).catch(console.error);
    }

    /**
     * @returns {Generator<{ text: string, swipes: string[], logprobs: import('./scripts/logprobs.js').TokenLogprobs, toolCalls: any[], state: any }, void, void>}
     */
    *nullStreamingGeneration() {
        throw new Error('未提供流式生成函数');
    }

    async generate() {
        if (this.messageId == -1) {
            this.messageId = await this.onStartStreaming(this.firstMessageText);
            await delay(1); // delay for message to be rendered
            scrollLock = false;
        }

        // Stopping strings are expensive to calculate, especially with macros enabled. To remove stopping strings
        // when streaming, we cache the result of getStoppingStrings instead of calling it once per token.
        const isImpersonate = this.type == 'impersonate';
        const isContinue = this.type == 'continue';
        this.stoppingStrings = getStoppingStrings(isImpersonate, isContinue);

        try {
            const sw = new Stopwatch(1000 / power_user.streaming_fps);
            const timestamps = [];
            for await (const { text, swipes, logprobs, toolCalls, state } of this.generator()) {
                const now = Date.now();
                timestamps.push(now);
                if (!this.timeToFirstToken) {
                    this.timeToFirstToken = now - this.createdAt.getTime();
                }
                if (this.isStopped || this.abortController.signal.aborted) {
                    return this.result;
                }

                this.toolCalls = toolCalls;
                this.result = text;
                this.swipes = Array.from(swipes ?? []);
                if (logprobs) {
                    this.messageLogprobs.push(...(Array.isArray(logprobs) ? logprobs : [logprobs]));
                }
                // Get the updated reasoning string into the handler
                this.reasoningHandler.updateReasoning(this.messageId, state?.reasoning);
                this.image = state?.image ?? '';
                const streamPayload = {
                    messageId: this.messageId,
                    type: this.type,
                    text,
                    aggregate: this.continueMessage + text,
                    result: this.result,
                    toolCalls: Array.isArray(toolCalls) ? toolCalls : [],
                    swipes: Array.isArray(this.swipes) ? Array.from(this.swipes) : [],
                    logprobs: logprobs ?? null,
                    state: state ? cloneMessageObject(state) : null,
                    timeToFirstToken: this.timeToFirstToken,
                };
                await eventSource.emit(event_types.GENERATION_PHASE_STREAM, streamPayload);
                await eventSource.emit(event_types.STREAM_TOKEN_RECEIVED, text);
                await sw.tick(async () => await this.onProgressStreaming(this.messageId, this.continueMessage + text));
            }
            const seconds = (timestamps[timestamps.length - 1] - timestamps[0]) / 1000;
            console.warn(`流式统计：共 ${timestamps.length} 个 Token，用时 ${seconds.toFixed(2)} 秒，速率 ${Number(timestamps.length / seconds).toFixed(2)} TPS`);
        }
        catch (err) {
            // in the case of a self-inflicted abort, we have already cleaned up
            if (!this.isFinished) {
                console.error(err);
                this.onErrorStreaming();
            }
            return this.result;
        }

        this.isFinished = true;
        return this.result;
    }
}

async function createRawPromptAsync(prompt, api, instructOverride, quietToLoud, systemPrompt, prefill) {
    const isInstruct = power_user.instruct.enabled && api !== 'openai' && api !== 'novel' && !instructOverride;

    if (isInstruct) {
        return createRawPrompt(prompt, api, instructOverride, quietToLoud, systemPrompt, prefill);
    }

    const normalized = await normalizePromptForWorker(prompt, api);
    const fallbackInput = normalized.fallbackPrompt;

    const resolvedSystemPrompt = systemPrompt ? await substituteParamsAsync(systemPrompt) : '';
    const resolvedPrefill = await substituteParamsAsync(prefill ?? '');

    const workerPayload = {
        mode: 'prompt',
        api,
        quietToLoud,
        systemPrompt: resolvedSystemPrompt,
        prefill: resolvedPrefill,
        messages: normalized.messages,
        names: {
            user: name1,
            assistant: name2,
        },
    };

    try {
        const response = await workerManager.dispatchTask(PROMPT_WORKER_TASK, workerPayload, {
            fallbackStrategy: WorkerFallbackStrategy.RETRY,
        });

        if (!response || response.prompt === undefined) {
            throw new Error('Prompt worker 返回空结果');
        }

        return response.prompt;
    } catch (error) {
        console.warn('Prompt 组装 Worker 失败，回退至主线程', error);
        if (typeof toastr?.warning === 'function') {
            toastr.warning('提示构建发生异常，已回退至主线程。若问题持续，请关闭“worker优化”开关。', 'Worker 提醒');
        }
        return createRawPrompt(fallbackInput, api, instructOverride, quietToLoud, systemPrompt, prefill);
    }
}

async function normalizePromptForWorker(prompt, api) {
    let messages;
    let fallbackPrompt;

    if (typeof prompt === 'string') {
        const content = api === 'openai' ? prompt.trim() : prompt;
        const role = api === 'openai' ? 'user' : 'system';
        messages = [{ role, name: '', content }];
        fallbackPrompt = prompt;
    } else if (Array.isArray(prompt)) {
        fallbackPrompt = prompt.map(message => ({ ...message }));
        messages = prompt.map(message => ({
            role: message.role || 'system',
            name: message.name ?? '',
            content: message.content ?? '',
        }));
    } else {
        throw new Error('Prompt 输入无效，应为字符串或消息数组');
    }

    const preparedMessages = await Promise.all(messages.map(async (message) => {
        const role = message.role || 'system';
        let resolvedName = '';
        if (role === 'user') resolvedName = message.name || name1;
        if (role === 'assistant') resolvedName = message.name || name2;
        if (role === 'system') resolvedName = message.name || '';

        const resolvedContent = await substituteParamsAsync(message.content ?? '');

        return {
            role,
            name: resolvedName,
            content: resolvedContent,
        };
    }));

    return {
        messages: preparedMessages,
        fallbackPrompt,
    };
}

async function promptWorkerFallback(payload) {
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
            result.push({ role: message.role || 'system', content: message.content ?? '' });
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

    let textPrompt = segments.join('\n');
    if (prefill) {
        textPrompt += `\n${prefill}`;
    }

    return { prompt: textPrompt };
}

/**
 * Constructs a prompt to be used for either Text Completion or Chat Completion. Input is format-agnostic.
 * @param {string | object[]} prompt Input prompt. Can be a string or an array of chat-style messages, i.e. [{role: '', content: ''}, ...]
 * @param {string} api API to use.
 * @param {boolean} instructOverride true to override instruct mode, false to use the default value
 * @param {boolean} quietToLoud true to generate a message in system mode, false to generate a message in character mode
 * @param {string} [systemPrompt] System prompt to use.
 * @param {string} [prefill] Prefill for the prompt.
 * @returns {string | object[]} Prompt ready for use in generation. If using TC, this will be a string. If using CC, this will be an array of chat-style messages.
 */
export function createRawPrompt(prompt, api, instructOverride, quietToLoud, systemPrompt, prefill) {
    const isInstruct = power_user.instruct.enabled && api !== 'openai' && api !== 'novel' && !instructOverride;

    // If the prompt was given as a string, convert to a message-style object assuming user role
    if (typeof prompt === 'string') {
        const message = api === 'openai'
            ? { role: 'user', content: prompt.trim() }
            : { role: 'system', content: prompt };
        prompt = [message];
    } else {  // checks for message-style object
        if (prompt.length === 0 && !systemPrompt) throw Error('No messages provided');
    }

    // Substitute the prefill if provided
    prefill = substituteParams(prefill ?? '');

    // Format each message in the prompt, accounting for the provided roles
    for (const message of prompt) {
        let name = '';
        if (message.role === 'user') name = message.name ?? name1;
        if (message.role === 'assistant') name = message.name ?? name2;
        if (message.role === 'system') name = message.name ?? '';
        const prefix = isInstruct || api === 'openai' ? '' : (name ? `${name}: ` : '');
        message.content = prefix + substituteParams(message.content ?? '');
        if (isInstruct) {  // instruct formatting for text completion
            const isUser = message.role === 'user';
            const isNarrator = message.role === 'system';
            message.content = formatInstructModeChat(name, message.content, isUser, isNarrator, '', name1, name2, false);
        }
    }

    // prepend system prompt, if provided
    if (systemPrompt) {
        systemPrompt = substituteParams(systemPrompt);
        systemPrompt = isInstruct ? (formatInstructModeStoryString(systemPrompt) + '\n') : systemPrompt.trim();
        prompt.unshift({ role: 'system', content: systemPrompt });
    }

    // with Chat Completion, the prefill is an additional assistant message at the end.
    if (api === 'openai' && prefill) {
        prompt.push({ role: 'assistant', content: prefill });
    }

    // if text completion, convert to text prompt by concatenating all message contents and adding the prefill as a promptBias.
    if (api !== 'openai') {
        const joiner = isInstruct ? '' : '\n';
        prompt = prompt.map(message => message.content).join(joiner);
        prompt = api === 'novel' ? adjustNovelInstructionPrompt(prompt) : prompt;
        prompt = prompt + (isInstruct ? formatInstructModePrompt(name2, false, prefill, name1, name2, true, quietToLoud) : `\n${prefill}`);  // add last line
    }

    return prompt;
}

/**
 * Generates a message using the provided prompt.
 * If the prompt is an array of chat-style messages and not using chat completion, it will be converted to a text prompt.
 * @typedef {object} GenerateRawParams
 * @prop {string | object[]} [prompt] Prompt to generate a message from. Can be a string or an array of chat-style messages, i.e. [{role: '', content: ''}, ...]
 * @prop {string} [api] API to use. Main API is used if not specified.
 * @prop {boolean} [instructOverride] true to override instruct mode, false to use the default value
 * @prop {boolean} [quietToLoud] true to generate a message in system mode, false to generate a message in character mode
 * @prop {string} [systemPrompt] System prompt to use.
 * @prop {number} [responseLength] Maximum response length. If unset, the global default value is used.
 * @prop {boolean} [trimNames] Whether to allow trimming "{{user}}:" and "{{char}}:" from the response.
 * @prop {string} [prefill] An optional prefill for the prompt.
 * @prop {object} [jsonSchema] JSON schema to use for the structured generation. Usually requires a special instruction.
 * @param {GenerateRawParams} params Parameters for generating a message
 * @returns {Promise<string>} Generated message
 */
export async function generateRaw({ prompt = '', api = null, instructOverride = false, quietToLoud = false, systemPrompt = '', responseLength = null, trimNames = true, prefill = '', jsonSchema = null } = {}) {
    if (arguments.length > 0 && typeof arguments[0] !== 'object') {
        console.trace('generateRaw called with positional arguments. Please use an object instead.');
        [prompt, api, instructOverride, quietToLoud, systemPrompt, responseLength, trimNames, prefill, jsonSchema] = arguments;
    }

    if (!api) {
        api = main_api;
    }

    const abortController = new AbortController();
    const responseLengthCustomized = typeof responseLength === 'number' && responseLength > 0;
    let eventHook = () => { };

    // construct final prompt。可交给 Worker 异步处理
    prompt = await createRawPromptAsync(prompt, api, instructOverride, quietToLoud, systemPrompt, prefill);

    try {
        if (responseLengthCustomized) {
            TempResponseLength.save(api, responseLength);
        }
        /** @type {object|any[]} */
        let generateData = {};

        switch (api) {
            case 'kobold':
            case 'koboldhorde':
                if (kai_settings.preset_settings === 'gui') {
                    generateData = { prompt: prompt, gui_settings: true, max_length: amount_gen, max_context_length: max_context, api_server: kai_settings.api_server };
                } else {
                    const isHorde = api === 'koboldhorde';
                    const koboldSettings = koboldai_settings[koboldai_setting_names[kai_settings.preset_settings]];
                    generateData = getKoboldGenerationData(prompt.toString(), koboldSettings, amount_gen, max_context, isHorde, 'quiet');
                }
                TempResponseLength.restore(api);
                break;
            case 'novel': {
                const novelSettings = novelai_settings[novelai_setting_names[nai_settings.preset_settings_novel]];
                generateData = getNovelGenerationData(prompt, novelSettings, amount_gen, false, false, null, 'quiet');
                TempResponseLength.restore(api);
                break;
            }
            case 'textgenerationwebui':
                generateData = await getTextGenGenerationData(prompt, amount_gen, false, false, null, 'quiet');
                TempResponseLength.restore(api);
                break;
            case 'openai': {
                generateData = prompt;  // generateData is just the chat message object
                eventHook = TempResponseLength.setupEventHook(api);
            } break;
        }

        let data = {};

        if (api === 'koboldhorde') {
            data = await generateHorde(prompt.toString(), generateData, abortController.signal, false);
        } else if (api === 'openai') {
            data = await sendOpenAIRequest('quiet', generateData, abortController.signal, { jsonSchema });
        } else {
            const generateUrl = getGenerateUrl(api);
            const response = await fetch(generateUrl, {
                method: 'POST',
                headers: getRequestHeaders(),
                cache: 'no-cache',
                body: JSON.stringify(generateData),
                signal: abortController.signal,
            });

            if (!response.ok) {
                throw await response.json();
            }

            data = await response.json();
        }

        // should only happen for text completions
        // other frontend paths do not return data if calling the backend fails,
        // they throw things instead
        if (data.error) {
            throw new Error(data.response);
        }

        if (jsonSchema) {
            return extractJsonFromData(data, { mainApi: api });
        }

        // format result, exclude user prompt bias
        const message = cleanUpMessage({
            getMessage: extractMessageFromData(data),
            isImpersonate: false,
            isContinue: false,
            displayIncompleteSentences: true,
            includeUserPromptBias: false,
            trimNames: trimNames,
            trimWrongNames: trimNames,
        });

        if (!message) {
            throw new Error('未生成任何消息');
        }

        return message;
    } finally {
        if (responseLengthCustomized && TempResponseLength.isCustomized()) {
            TempResponseLength.restore(api);
            TempResponseLength.removeEventHook(api, eventHook);
        }
    }
}

class TempResponseLength {
    static #originalResponseLength = -1;
    static #lastApi = null;

    static isCustomized() {
        return this.#originalResponseLength > -1;
    }

    /**
     * Save the current response length for the specified API.
     * @param {string} api API identifier
     * @param {number} responseLength New response length
     */
    static save(api, responseLength) {
        if (api === 'openai') {
            this.#originalResponseLength = oai_settings.openai_max_tokens;
            oai_settings.openai_max_tokens = responseLength;
        } else {
            this.#originalResponseLength = amount_gen;
            amount_gen = responseLength;
        }

        this.#lastApi = api;
        console.log('[TempResponseLength] 已保存原始回复长度:', TempResponseLength.#originalResponseLength);
    }

    /**
     * Restore the original response length for the specified API.
     * @param {string|null} api API identifier
     * @returns {void}
     */
    static restore(api) {
        if (this.#originalResponseLength === -1) {
            return;
        }
        if (!api && this.#lastApi) {
            api = this.#lastApi;
        }
        if (api === 'openai') {
            oai_settings.openai_max_tokens = this.#originalResponseLength;
        } else {
            amount_gen = this.#originalResponseLength;
        }

        console.log('[TempResponseLength] 已恢复原始回复长度:', this.#originalResponseLength);
        this.#originalResponseLength = -1;
        this.#lastApi = null;
    }

    /**
     * Sets up an event hook to restore the original response length when the event is emitted.
     * @param {string} api API identifier
     * @returns {function(): void} Event hook function
     */
    static setupEventHook(api) {
        const eventHook = () => {
            if (this.isCustomized()) {
                this.restore(api);
            }
        };

        switch (api) {
            case 'openai':
                eventSource.once(event_types.CHAT_COMPLETION_SETTINGS_READY, eventHook);
                break;
            default:
                eventSource.once(event_types.GENERATE_AFTER_DATA, eventHook);
                break;
        }

        return eventHook;
    }

    /**
     * Removes the event hook for the specified API.
     * @param {string} api API identifier
     * @param {function(): void} eventHook Previously set up event hook
     */
    static removeEventHook(api, eventHook) {
        switch (api) {
            case 'openai':
                eventSource.removeListener(event_types.CHAT_COMPLETION_SETTINGS_READY, eventHook);
                break;
            default:
                eventSource.removeListener(event_types.GENERATE_AFTER_DATA, eventHook);
                break;
        }
    }
}

/**
 * Removes last message from the chat DOM.
 * @returns {Promise<void>} Resolves when the message is removed.
 */
function removeLastMessage() {
    return new Promise((resolve) => {
        const lastMes = $('#chat').children('.mes').last();
        if (lastMes.length === 0) {
            return resolve();
        }
        lastMes.hide(animation_duration, function () {
            $(this).remove();
            resolve();
        });
    });
}

/**
 * @typedef {object} JsonSchema
 * @property {string} name Name of the schema.
 * @property {object} value JSON schema value.
 * @property {string} [description] Description of the schema.
 * @property {boolean} [strict] If true, the schema will be used in strict mode, meaning that only the fields defined in the schema will be allowed.
 *
 * @typedef {object} GenerateOptions
 * @property {boolean} [automatic_trigger] If the generation was triggered automatically (e.g. group auto mode).
 * @property {boolean} [force_name2] If a char name should be forced to add to the prompt's last line (Text Completion, non-Instruct only).
 * @property {string} [quiet_prompt] A system instruction to use for the quiet prompt.
 * @property {boolean} [quietToLoud] Whether the system instruction should be sent in background (quiet) or a foreground (loud) mode.
 * @property {boolean} [skipWIAN] Skip adding World Info and Author's Note to the prompt.
 * @property {number} [force_chid] Force character ID to use for the generation. Only works in groups.
 * @property {AbortSignal} [signal] Abort signal to cancel the generation. If not provided, will create a new AbortController.
 * @property {string} [quietImage] Image URL to use for the quiet prompt (defaults to empty string)
 * @property {string} [quietName] Name to use for the quiet prompt (defaults to "System:")
 * @property {number} [depth] Recursion depth for the generation. Used to prevent infinite loops in tool calls.
 * @property {JsonSchema} [jsonSchema] JSON schema to use for the structured generation. Usually requires a special instruction.
 */

/**
 * MARK:Generate()
 * Runs a generation using the current chat context.
 * @param {string} type Generation type
 * @param {GenerateOptions} options Generation options
 * @param {boolean} dryRun Whether to actually generate a message or just assemble the prompt
 * @returns {Promise<any>} Returns a promise that resolves when the text is done generating.
 */
export async function Generate(type, { automatic_trigger, force_name2, quiet_prompt, quietToLoud, skipWIAN, force_chid, signal, quietImage, quietName, jsonSchema = null, depth = 0 } = {}, dryRun = false) {
    console.log('开始进入 Generate 流程');
    setGenerationProgress(0);
    generation_started = new Date();

    // Prevent generation from shallow characters
    await unshallowCharacter(this_chid);

    // Occurs every time, even if the generation is aborted due to slash commands execution
    await eventSource.emit(event_types.GENERATION_STARTED, type, { automatic_trigger, force_name2, quiet_prompt, quietToLoud, skipWIAN, force_chid, signal, quietImage }, dryRun);

    // Don't recreate abort controller if signal is passed
    if (!(abortController && signal)) {
        abortController = new AbortController();
    }

    // OpenAI doesn't need instruct mode. Use OAI main prompt instead.
    const isInstruct = power_user.instruct.enabled && main_api !== 'openai';
    const isImpersonate = type == 'impersonate';

    if (!(dryRun || type == 'regenerate' || type == 'swipe' || type == 'quiet')) {
        const interruptedByCommand = await processCommands(String($('#send_textarea').val()));

        if (interruptedByCommand) {
            //$("#send_textarea").val('')[0].dispatchEvent(new Event('input', { bubbles:true }));
            unblockGeneration(type);
            return Promise.resolve();
        }
    }

    // Occurs only if the generation is not aborted due to slash commands execution
    await eventSource.emit(event_types.GENERATION_AFTER_COMMANDS, type, { automatic_trigger, force_name2, quiet_prompt, quietToLoud, skipWIAN, force_chid, signal, quietImage }, dryRun);

    if (main_api == 'kobold' && kai_settings.streaming_kobold && !kai_flags.can_use_streaming) {
        toastr.error(t`已开启流式输出，但当前使用的 Kobold 版本不支持 Token 流式。`, undefined, { timeOut: 10000, preventDuplicates: true });
        unblockGeneration(type);
        return Promise.resolve();
    }

    if (isHordeGenerationNotAllowed()) {
        unblockGeneration(type);
        return Promise.resolve();
    }

    if (!dryRun) {
        // Ping server to make sure it is still alive
        const pingResult = await pingServer();

        if (!pingResult) {
            unblockGeneration(type);
            toastr.error(t`请确认服务器正在运行且可访问。`, t`无法连接到 ST 服务器`);
            throw new Error('无法连接到服务器');
        }

        // Hide swipes if not in a dry run.
        hideSwipeButtons();
        // If generated any message, set the flag to indicate it can't be recreated again.
        chat_metadata['tainted'] = true;
    }

    if (selected_group && !is_group_generating) {
        if (!dryRun) {
            // Returns the promise that generateGroupWrapper returns; resolves when generation is done
            return generateGroupWrapper(false, type, { quiet_prompt, force_chid, signal: abortController.signal, quietImage });
        }

        const characterIndexMap = new Map(characters.map((char, index) => [char.avatar, index]));
        const group = groups.find((x) => x.id === selected_group);

        const enabledMembers = group.members.reduce((acc, member) => {
            if (!group.disabled_members.includes(member) && !acc.includes(member)) {
                acc.push(member);
            }
            return acc;
        }, []);

        const memberIds = enabledMembers
            .map((member) => characterIndexMap.get(member))
            .filter((index) => index !== undefined && index !== null);

        if (memberIds.length > 0) {
            if (menu_type != 'character_edit') setCharacterId(memberIds[0]);
            setCharacterName('');
        } else {
            console.log('未找到已启用的成员');
            unblockGeneration(type);
            return Promise.resolve();
        }
    }

    //#########QUIET PROMPT STUFF##############
    //this function just gives special care to novel quiet instruction prompts
    if (quiet_prompt) {
        quiet_prompt = substituteParams(quiet_prompt);
        quiet_prompt = main_api == 'novel' && !quietToLoud ? adjustNovelInstructionPrompt(quiet_prompt) : quiet_prompt;
    }

    const hasBackendConnection = online_status !== 'no_connection';

    // We can't do anything because we're not in a chat right now. (Unless it's a dry run, in which case we need to
    // assemble the prompt so we can count its tokens regardless of whether a chat is active.)
    if (!dryRun && !hasBackendConnection) {
        is_send_press = false;
        return Promise.resolve();
    }

    let textareaText;
    if (type !== 'regenerate' && type !== 'swipe' && type !== 'quiet' && !isImpersonate && !dryRun) {
        is_send_press = true;
        textareaText = String($('#send_textarea').val());
        $('#send_textarea').val('')[0].dispatchEvent(new Event('input', { bubbles: true }));
    } else {
        textareaText = '';
        if (chat.length && chat[chat.length - 1]['is_user']) {
            //do nothing? why does this check exist?
        }
        else if (type !== 'quiet' && type !== 'swipe' && !isImpersonate && !dryRun && chat.length) {
            chat.length = chat.length - 1;
            await removeLastMessage();
            await eventSource.emit(event_types.MESSAGE_DELETED, chat.length);
        }
    }

    const isContinue = type == 'continue';

    // Rewrite the generation timer to account for the time passed for all the continuations.
    if (isContinue && chat.length) {
        const prevFinished = chat[chat.length - 1]['gen_finished'];
        const prevStarted = chat[chat.length - 1]['gen_started'];

        if (prevFinished && prevStarted) {
            const timePassed = prevFinished - prevStarted;
            generation_started = new Date(Date.now() - timePassed);
            chat[chat.length - 1]['gen_started'] = generation_started;
        }
    }

    if (!dryRun) {
        deactivateSendButtons();
    }

    let { messageBias, promptBias, isUserPromptBias } = getBiasStrings(textareaText, type);

    //*********************************
    //PRE FORMATING STRING
    //*********************************

    // These generation types should not attach pending files to the chat
    const noAttachTypes = [
        'regenerate',
        'swipe',
        'impersonate',
        'quiet',
        'continue',
    ];
    //for normal messages sent from user..
    if ((textareaText != '' || (hasPendingFileAttachment() && !noAttachTypes.includes(type))) && !automatic_trigger && type !== 'quiet' && !dryRun) {
        // If user message contains no text other than bias - send as a system message
        if (messageBias && !removeMacros(textareaText)) {
            sendSystemMessage(system_message_types.GENERIC, ' ', { bias: messageBias });
        }
        else {
            await sendMessageAsUser(textareaText, messageBias);
        }
    }
    else if (textareaText == '' && !automatic_trigger && !dryRun && type === undefined && main_api == 'openai' && oai_settings.send_if_empty.trim().length > 0) {
        // Use send_if_empty if set and the user message is empty. Only when sending messages normally
        await sendMessageAsUser(oai_settings.send_if_empty.trim(), messageBias);
    }

    let {
        description,
        personality,
        persona,
        scenario,
        mesExamples,
        system,
        jailbreak,
        charDepthPrompt,
        creatorNotes,
    } = getCharacterCardFields();

    if (main_api !== 'openai') {
        if (power_user.sysprompt.enabled) {
            system = power_user.prefer_character_prompt && system
                ? substituteParams(system, name1, name2, (power_user.sysprompt.content ?? ''))
                : baseChatReplace(power_user.sysprompt.content, name1, name2);
            system = isInstruct ? substituteParams(system, name1, name2, power_user.sysprompt.content) : system;
        } else {
            // Nullify if it's not enabled
            system = '';
        }
    }

    // Depth prompt (character-specific A/N)
    removeDepthPrompts();
    const groupDepthPrompts = getGroupDepthPrompts(selected_group, Number(this_chid));

    if (selected_group && Array.isArray(groupDepthPrompts) && groupDepthPrompts.length > 0) {
        groupDepthPrompts.forEach((value, index) => {
            const role = getExtensionPromptRoleByName(value.role);
            setExtensionPrompt(inject_ids.DEPTH_PROMPT_INDEX(index), value.text, extension_prompt_types.IN_CHAT, value.depth, extension_settings.note.allowWIScan, role);
        });
    } else {
        const depthPromptText = charDepthPrompt || '';
        const depthPromptDepth = characters[this_chid]?.data?.extensions?.depth_prompt?.depth ?? depth_prompt_depth_default;
        const depthPromptRole = getExtensionPromptRoleByName(characters[this_chid]?.data?.extensions?.depth_prompt?.role ?? depth_prompt_role_default);
        setExtensionPrompt(inject_ids.DEPTH_PROMPT, depthPromptText, extension_prompt_types.IN_CHAT, depthPromptDepth, extension_settings.note.allowWIScan, depthPromptRole);
    }

    // First message in fresh 1-on-1 chat reacts to user/character settings changes
    if (chat.length) {
        chat[0].mes = substituteParams(chat[0].mes);
    }

    // Collect messages with usable content
    const canUseTools = ToolManager.isToolCallingSupported();
    const canPerformToolCalls = !dryRun && ToolManager.canPerformToolCalls(type) && depth < ToolManager.RECURSE_LIMIT;
    let coreChat = chat.filter(x => !x.is_system || (canUseTools && Array.isArray(x.extra?.tool_invocations)));
    if (type === 'swipe') {
        coreChat.pop();
    }

    coreChat = await Promise.all(coreChat.map(async (chatItem, index) => {
        let message = chatItem.mes;
        let regexType = chatItem.is_user ? regex_placement.USER_INPUT : regex_placement.AI_OUTPUT;
        let options = { isPrompt: true, depth: (coreChat.length - index - (isContinue ? 2 : 1)) };

        let regexedMessage = getRegexedString(message, regexType, options);
        regexedMessage = await appendFileContent(chatItem, regexedMessage);

        if (chatItem?.extra?.append_title && chatItem?.extra?.title) {
            regexedMessage = `${regexedMessage}\n\n${chatItem.extra.title}`;
        }

        return {
            ...chatItem,
            mes: regexedMessage,
            index,
        };
    }));

    const promptReasoning = new PromptReasoning();
    for (let i = coreChat.length - 1; i >= 0; i--) {
        const depth = coreChat.length - i - (isContinue ? 2 : 1);
        const isPrefix = isContinue && i === coreChat.length - 1;
        coreChat[i] = {
            ...coreChat[i],
            mes: promptReasoning.addToMessage(
                coreChat[i].mes,
                getRegexedString(
                    String(coreChat[i].extra?.reasoning ?? ''),
                    regex_placement.REASONING,
                    { isPrompt: true, depth: depth },
                ),
                isPrefix,
                coreChat[i].extra?.reasoning_duration,
            ),
        };
        if (promptReasoning.isLimitReached()) {
            break;
        }
    }

    // Determine token limit
    let this_max_context = getMaxContextSize();

    if (!dryRun) {
        console.debug('正在执行扩展拦截器');
        const aborted = await runGenerationInterceptors(coreChat, this_max_context, type);

        if (aborted) {
            console.debug('扩展拦截器已中止生成流程');
            unblockGeneration(type);
            return Promise.resolve();
        }
    } else {
        console.debug('干运行略过扩展拦截器');
    }

    // Adjust token limit for Horde
    let adjustedParams;
    if (main_api == 'koboldhorde' && (horde_settings.auto_adjust_context_length || horde_settings.auto_adjust_response_length)) {
        try {
            adjustedParams = await adjustHordeGenerationParams(max_context, amount_gen);
        }
        catch {
            unblockGeneration(type);
            return Promise.resolve();
        }
        if (horde_settings.auto_adjust_context_length) {
            this_max_context = (adjustedParams.maxContextLength - adjustedParams.maxLength);
        }
    }

    // Fetches the combined prompt for both negative and positive prompts
    const cfgGuidanceScale = getGuidanceScale();
    const useCfgPrompt = cfgGuidanceScale && cfgGuidanceScale.value !== 1;

    // Adjust max context based on CFG prompt to prevent overfitting
    if (useCfgPrompt) {
        const negativePrompt = getCfgPrompt(cfgGuidanceScale, true, true)?.value || '';
        const positivePrompt = getCfgPrompt(cfgGuidanceScale, false, true)?.value || '';
        if (negativePrompt || positivePrompt) {
            const previousMaxContext = this_max_context;
            const [negativePromptTokenCount, positivePromptTokenCount] = await Promise.all([getTokenCountAsync(negativePrompt), getTokenCountAsync(positivePrompt)]);
            const decrement = Math.max(negativePromptTokenCount, positivePromptTokenCount);
            this_max_context -= decrement;
            console.log(`Max context reduced by ${decrement} tokens of CFG prompt (${previousMaxContext} -> ${this_max_context})`);
        }
    }

    console.log(`Core/all messages: ${coreChat.length}/${chat.length}`);

    if ((promptBias && !isUserPromptBias) || power_user.always_force_name2 || main_api == 'novel') {
        force_name2 = true;
    }

    if (isImpersonate) {
        force_name2 = false;
    }

    let mesExamplesArray = parseMesExamples(mesExamples, isInstruct);

    //////////////////////////////////
    // Extension added strings
    // Set non-WI AN
    setFloatingPrompt();
    // Add persona description to prompt
    addPersonaDescriptionExtensionPrompt();

    // Add WI to prompt (and also inject WI to AN value via hijack)
    // Make quiet prompt available for WIAN
    setExtensionPrompt(inject_ids.QUIET_PROMPT, quiet_prompt || '', extension_prompt_types.IN_PROMPT, 0, true);
    const chatForWI = coreChat.map(x => world_info_include_names ? `${x.name}: ${x.mes}` : x.mes).reverse();
    /** @type {import('./scripts/world-info.js').WIGlobalScanData} */
    const globalScanData = {
        personaDescription: persona,
        characterDescription: description,
        characterPersonality: personality,
        characterDepthPrompt: charDepthPrompt,
        scenario: scenario,
        creatorNotes: creatorNotes,
        trigger: GENERATION_TYPE_TRIGGERS.includes(type) ? type : 'normal',
    };
    const { worldInfoString, worldInfoBefore, worldInfoAfter, worldInfoExamples, worldInfoDepth } = await getWorldInfoPrompt(chatForWI, this_max_context, dryRun, globalScanData);
    setExtensionPrompt(inject_ids.QUIET_PROMPT, '', extension_prompt_types.IN_PROMPT, 0, true);

    // Add message example WI
    for (const example of worldInfoExamples) {
        const exampleMessage = example.content;

        if (exampleMessage.length === 0) {
            continue;
        }

        const formattedExample = baseChatReplace(exampleMessage, name1, name2);
        const cleanedExample = parseMesExamples(formattedExample, isInstruct);

        // Insert depending on before or after position
        if (example.position === wi_anchor_position.before) {
            mesExamplesArray.unshift(...cleanedExample);
        } else {
            mesExamplesArray.push(...cleanedExample);
        }
    }

    // At this point, the raw message examples can be created
    const mesExamplesRawArray = [...mesExamplesArray];

    if (mesExamplesArray && isInstruct) {
        mesExamplesArray = formatInstructModeExamples(mesExamplesArray, name1, name2);
    }

    if (skipWIAN !== true) {
        console.log('skipWIAN 未开启，正在注入 WIAN');
        // Add all depth WI entries to prompt
        flushWIDepthInjections();
        if (Array.isArray(worldInfoDepth)) {
            worldInfoDepth.forEach((e) => {
                const joinedEntries = e.entries.join('\n');
                setExtensionPrompt(inject_ids.CUSTOM_WI_DEPTH_ROLE(e.depth, e.role), joinedEntries, extension_prompt_types.IN_CHAT, e.depth, false, e.role);
            });
        }
    } else {
        console.log('跳过 WIAN 注入');
    }

    // Collect before / after story string injections
    const beforeScenarioAnchor = await getExtensionPrompt(extension_prompt_types.BEFORE_PROMPT);
    const afterScenarioAnchor = await getExtensionPrompt(extension_prompt_types.IN_PROMPT);

    const storyStringParams = {
        description: description,
        personality: personality,
        persona: power_user.persona_description_position == persona_description_positions.IN_PROMPT ? persona : '',
        scenario: scenario,
        system: system,
        char: name2,
        user: name1,
        wiBefore: worldInfoBefore,
        wiAfter: worldInfoAfter,
        loreBefore: worldInfoBefore,
        loreAfter: worldInfoAfter,
        anchorBefore: beforeScenarioAnchor.trim(),
        anchorAfter: afterScenarioAnchor.trim(),
        mesExamples: mesExamplesArray.join(''),
        mesExamplesRaw: mesExamplesRawArray.join(''),
    };

    // Render the story string and combine with injections
    const storyString = renderStoryString(storyStringParams);
    let combinedStoryString = isInstruct ? formatInstructModeStoryString(storyString) : storyString;

    // Inject the story string as in-chat prompt (if needed)
    const applyStoryStringInject = main_api !== 'openai' && power_user.context.story_string_position === extension_prompt_types.IN_CHAT;
    if (applyStoryStringInject) {
        const depth = power_user.context.story_string_depth ?? 1;
        const role = power_user.context.story_string_role ?? extension_prompt_roles.SYSTEM;
        setExtensionPrompt(inject_ids.STORY_STRING, combinedStoryString, extension_prompt_types.IN_CHAT, depth, false, role);
        // Remove to prevent duplication
        combinedStoryString = '';
    } else {
        setExtensionPrompt(inject_ids.STORY_STRING, '', extension_prompt_types.IN_CHAT, 0);
    }

    // Story string rendered, safe to remove
    if (power_user.strip_examples) {
        mesExamplesArray = [];
    }

    // Inject all Depth prompts. Chat Completion does it separately
    let injectedIndices = [];
    if (main_api !== 'openai') {
        injectedIndices = await doChatInject(coreChat, isContinue);
    }

    if (main_api !== 'openai' && power_user.sysprompt.enabled) {
        jailbreak = power_user.prefer_character_jailbreak && jailbreak
            ? substituteParams(jailbreak, name1, name2, (power_user.sysprompt.post_history ?? ''))
            : baseChatReplace(power_user.sysprompt.post_history, name1, name2);

        // Only inject the jb if there is one
        if (jailbreak) {
            // When continuing generation of previous output, last user message precedes the message to continue
            if (isContinue) {
                coreChat.splice(coreChat.length - 1, 0, { mes: jailbreak, is_user: true });
            }
            else {
                // This operation will result in the injectedIndices indexes being off by one
                coreChat.push({ mes: jailbreak, is_user: true });
                // Add +1 to the elements to correct for the new PHI/Jailbreak message.
                injectedIndices.forEach((e, idx) => injectedIndices[idx] = e + 1);
            }
        }
    }

    let chat2 = [];
    let continue_mag = '';
    const userMessageIndices = [];
    const lastUserMessageIndex = coreChat.findLastIndex(x => x.is_user);

    for (let i = coreChat.length - 1, j = 0; i >= 0; i--, j++) {
        if (main_api == 'openai') {
            chat2[i] = coreChat[j].mes;
            if (i === 0 && isContinue) {
                chat2[i] = chat2[i].slice(0, chat2[i].lastIndexOf(coreChat[j].mes) + coreChat[j].mes.length);
                continue_mag = coreChat[j].mes;
            }
            continue;
        }

        chat2[i] = formatMessageHistoryItem(coreChat[j], isInstruct, false);

        if (j === 0 && isInstruct) {
            // Reformat with the first output sequence (if any)
            chat2[i] = formatMessageHistoryItem(coreChat[j], isInstruct, force_output_sequence.FIRST);
        }

        if (lastUserMessageIndex >= 0 && j === lastUserMessageIndex && isInstruct) {
            // Reformat with the last input sequence (if any)
            chat2[i] = formatMessageHistoryItem(coreChat[j], isInstruct, force_output_sequence.LAST);
        }

        // Do not suffix the message for continuation
        if (i === 0 && isContinue) {
            // Pick something that's very unlikely to be in a message
            const FORMAT_TOKEN = '\u0000\ufffc\u0000\ufffd';

            if (isInstruct) {
                const originalMessage = String(coreChat[j].mes ?? '');
                coreChat[j].mes = originalMessage.replaceAll(FORMAT_TOKEN, '') + FORMAT_TOKEN;
                // Reformat with the last output sequence (if any)
                chat2[i] = formatMessageHistoryItem(coreChat[j], isInstruct, force_output_sequence.LAST);
                coreChat[j].mes = originalMessage;
            }

            chat2[i] = chat2[i].includes(FORMAT_TOKEN)
                ? chat2[i].slice(0, chat2[i].lastIndexOf(FORMAT_TOKEN))
                : chat2[i].slice(0, chat2[i].lastIndexOf(coreChat[j].mes) + coreChat[j].mes.length);
            continue_mag = coreChat[j].mes;
        }

        if (coreChat[j].is_user) {
            userMessageIndices.push(i);
        }
    }

    let addUserAlignment = isInstruct && power_user.instruct.user_alignment_message;
    let userAlignmentMessage = '';

    if (addUserAlignment) {
        const alignmentMessage = {
            name: name1,
            mes: substituteParams(power_user.instruct.user_alignment_message),
            is_user: true,
        };
        userAlignmentMessage = formatMessageHistoryItem(alignmentMessage, isInstruct, force_output_sequence.FIRST);
    }

    let oaiMessages = [];
    let oaiMessageExamples = [];

    if (main_api === 'openai') {
        oaiMessages = setOpenAIMessages(coreChat);
        oaiMessageExamples = setOpenAIMessageExamples(mesExamplesArray);
    }

    // hack for regeneration of the first message
    if (chat2.length == 0) {
        chat2.push('');
    }

    let examplesString = '';
    let chatString = addChatsPreamble(addChatsSeparator(''));
    let cyclePrompt = '';

    async function getMessagesTokenCount() {
        const encodeString = [
            combinedStoryString,
            examplesString,
            userAlignmentMessage,
            chatString,
            modifyLastPromptLine(''),
            cyclePrompt,
        ].join('').replace(/\r/gm, '');
        return getTokenCountAsync(encodeString, power_user.token_padding);
    }

    // Force pinned examples into the context
    let pinExmString;
    if (power_user.pin_examples) {
        pinExmString = examplesString = mesExamplesArray.join('');
    }

    // Only add the chat in context if past the greeting message
    if (isContinue && (chat2.length > 1 || main_api === 'openai')) {
        cyclePrompt = chat2.shift();
    }

    // Collect enough messages to fill the context
    let arrMes = new Array(chat2.length);
    let tokenCount = await getMessagesTokenCount();
    let lastAddedIndex = -1;

    // Pre-allocate all injections first.
    // If it doesn't fit - user shot himself in the foot
    for (const index of injectedIndices) {
        const item = chat2[index];

        if (typeof item !== 'string') {
            continue;
        }

        tokenCount += await getTokenCountAsync(item.replace(/\r/gm, ''));
        if (tokenCount < this_max_context) {
            chatString = chatString + item;
            arrMes[index] = item;
            lastAddedIndex = Math.max(lastAddedIndex, index);
        } else {
            break;
        }
    }

    for (let i = 0; i < chat2.length; i++) {
        // not needed for OAI prompting
        if (main_api == 'openai') {
            break;
        }

        // Skip already injected messages
        if (arrMes[i] !== undefined) {
            continue;
        }

        const item = chat2[i];

        if (typeof item !== 'string') {
            continue;
        }

        tokenCount += await getTokenCountAsync(item.replace(/\r/gm, ''));
        if (tokenCount < this_max_context) {
            chatString = chatString + item;
            arrMes[i] = item;
            lastAddedIndex = Math.max(lastAddedIndex, i);
        } else {
            break;
        }
    }

    // Add user alignment message if last message is not a user message
    const stoppedAtUser = userMessageIndices.includes(lastAddedIndex);
    if (addUserAlignment && !stoppedAtUser) {
        tokenCount += await getTokenCountAsync(userAlignmentMessage.replace(/\r/gm, ''));
        chatString = userAlignmentMessage + chatString;
        arrMes.push(userAlignmentMessage);
        injectedIndices.push(arrMes.length - 1);
    }

    // Unsparse the array. Adjust injected indices
    const newArrMes = [];
    const newInjectedIndices = [];
    for (let i = 0; i < arrMes.length; i++) {
        if (arrMes[i] !== undefined) {
            newArrMes.push(arrMes[i]);
            if (injectedIndices.includes(i)) {
                newInjectedIndices.push(newArrMes.length - 1);
            }
        }
    }

    arrMes = newArrMes;
    injectedIndices = newInjectedIndices;

    if (main_api !== 'openai') {
        setInContextMessages(arrMes.length - injectedIndices.length, type);
    }

    // Estimate how many unpinned example messages fit in the context
    tokenCount = await getMessagesTokenCount();
    let count_exm_add = 0;
    if (!power_user.pin_examples) {
        for (let example of mesExamplesArray) {
            tokenCount += await getTokenCountAsync(example.replace(/\r/gm, ''));
            examplesString += example;
            if (tokenCount < this_max_context) {
                count_exm_add++;
            } else {
                break;
            }
        }
    }

    let mesSend = [];
    console.debug('调用 runGenerate 开始生成');

    if (isContinue) {
        // Coping mechanism for OAI spacing
        if (main_api === 'openai' && !cyclePrompt.endsWith(' ')) {
            cyclePrompt += oai_settings.continue_postfix;
            continue_mag += oai_settings.continue_postfix;
        }
    }

    const originalType = type;

    if (!dryRun) {
        is_send_press = true;
    }

    let generatedPromptCache = cyclePrompt || '';
    if (generatedPromptCache.length == 0 || type === 'continue') {
        console.debug('正在生成 Prompt');
        chatString = '';
        arrMes = arrMes.reverse();
        arrMes.forEach(function (item, i, arr) {
            // OAI doesn't need all of this
            if (main_api === 'openai') {
                return;
            }

            // Cohee: This removes a newline from the end of the last message in the context
            // Last prompt line will add a newline if it's not a continuation
            // In instruct mode it only removes it if wrap is enabled and it's not a quiet generation
            if (i === arrMes.length - 1 && type !== 'continue') {
                if (!isInstruct || (power_user.instruct.wrap && type !== 'quiet')) {
                    item = item.replace(/\n?$/, '');
                }
            }

            mesSend[mesSend.length] = { message: item, extensionPrompts: [] };
        });
    }

    let mesExmString = '';

    function setPromptString() {
        if (main_api == 'openai') {
            return;
        }

        console.debug('--设置 Prompt 字符串');
        mesExmString = pinExmString ?? mesExamplesArray.slice(0, count_exm_add).join('');

        if (mesSend.length) {
            mesSend[mesSend.length - 1].message = modifyLastPromptLine(mesSend[mesSend.length - 1].message);
        }
    }

    function modifyLastPromptLine(lastMesString) {
        //#########QUIET PROMPT STUFF PT2##############

        // Add quiet generation prompt at depth 0
        if (quiet_prompt && quiet_prompt.length) {

            // here name1 is forced for all quiet prompts..why?
            const name = name1;
            //checks if we are in instruct, if so, formats the chat as such, otherwise just adds the quiet prompt
            const quietAppend = isInstruct ? formatInstructModeChat(name, quiet_prompt, false, true, '', name1, name2, false) : `\n${quiet_prompt}`;

            //This begins to fix quietPrompts (particularly /sysgen) for instruct
            //previously instruct input sequence was being appended to the last chat message w/o '\n'
            //and no output sequence was added after the input's content.
            //TODO: respect output_sequence vs last_output_sequence settings
            //TODO: decide how to prompt this to clarify who is talking 'Narrator', 'System', etc.
            if (isInstruct) {
                lastMesString += quietAppend; // + power_user.instruct.output_sequence + '\n';
            } else {
                lastMesString += quietAppend;
            }


            // Ross: bailing out early prevents quiet prompts from respecting other instruct prompt toggles
            // for sysgen, SD, and summary this is desireable as it prevents the AI from responding as char..
            // but for idle prompting, we want the flexibility of the other prompt toggles, and to respect them as per settings in the extension
            // need a detection for what the quiet prompt is being asked for...

            // Bail out early?
            if (!isInstruct && !quietToLoud) {
                return lastMesString;
            }
        }


        // Get instruct mode line
        if (isInstruct && !isContinue) {
            const name = (quiet_prompt && !quietToLoud && !isImpersonate) ? (quietName ?? 'System') : (isImpersonate ? name1 : name2);
            const isQuiet = quiet_prompt && type == 'quiet';
            lastMesString += formatInstructModePrompt(name, isImpersonate, promptBias, name1, name2, isQuiet, quietToLoud);
        }

        // Get non-instruct impersonation line
        if (!isInstruct && isImpersonate && !isContinue) {
            const name = name1;
            if (!lastMesString.endsWith('\n')) {
                lastMesString += '\n';
            }
            lastMesString += name + ':';
        }

        // Add character's name
        // Force name append on continue (if not continuing on user message or first message)
        const isContinuingOnFirstMessage = chat.length === 1 && isContinue;
        if (!isInstruct && force_name2 && !isContinuingOnFirstMessage) {
            if (!lastMesString.endsWith('\n')) {
                lastMesString += '\n';
            }
            if (!isContinue || !(chat[chat.length - 1]?.is_user)) {
                lastMesString += `${name2}:`;
            }
        }

        return lastMesString;
    }

    async function checkPromptSize() {
        console.debug('---检查 Prompt 大小');
        setPromptString();
        const jointMessages = mesSend.map((e) => `${e.extensionPrompts.join('')}${e.message}`).join('');
        const prompt = [
            combinedStoryString,
            mesExmString,
            addChatsPreamble(addChatsSeparator(jointMessages)),
            '\n',
            modifyLastPromptLine(''),
            generatedPromptCache,
        ].join('').replace(/\r/gm, '');
        let thisPromptContextSize = await getTokenCountAsync(prompt, power_user.token_padding);

        if (thisPromptContextSize > this_max_context) {        //if the prepared prompt is larger than the max context size...
            if (count_exm_add > 0) {                            // ..and we have example mesages..
                count_exm_add--;                            // remove the example messages...
                await checkPromptSize();                            // and try agin...
            } else if (mesSend.length > 0) {                    // if the chat history is longer than 0
                mesSend.shift();                            // remove the first (oldest) chat entry..
                await checkPromptSize();                            // and check size again..
            } else {
                //end
                console.debug(`---mesSend.length = ${mesSend.length}`);
            }
        }
    }

    if (generatedPromptCache.length > 0 && main_api !== 'openai') {
        console.debug('---生成的 Prompt 缓存长度: ' + generatedPromptCache.length);
        await checkPromptSize();
    } else {
        console.debug('---调用 setPromptString，当前缓存长度为 ' + generatedPromptCache.length);
        setPromptString();
    }

    // For prompt bit itemization
    let mesSendString = '';
    let promptModuleContext = null;

    async function getCombinedPrompt(isNegative) {
        // Only return if the guidance scale doesn't exist or the value is 1
        // Also don't return if constructing the neutral prompt
        if (isNegative && !useCfgPrompt) {
            return;
        }

        // OAI has its own prompt manager. No need to do anything here
        if (main_api === 'openai') {
            return '';
        }

        // Deep clone
        let finalMesSend = structuredClone(mesSend);

        if (useCfgPrompt) {
            const cfgPrompt = getCfgPrompt(cfgGuidanceScale, isNegative);
            if (cfgPrompt.value) {
                if (cfgPrompt.depth === 0) {
                    finalMesSend[finalMesSend.length - 1].message +=
                        /\s/.test(finalMesSend[finalMesSend.length - 1].message.slice(-1))
                            ? cfgPrompt.value
                            : ` ${cfgPrompt.value}`;
                } else {
                    // TODO: Make all extension prompts use an array/splice method
                    const lengthDiff = mesSend.length - cfgPrompt.depth;
                    const cfgDepth = lengthDiff >= 0 ? lengthDiff : 0;
                    const cfgMessage = finalMesSend[cfgDepth];
                    if (cfgMessage) {
                        if (!Array.isArray(finalMesSend[cfgDepth].extensionPrompts)) {
                            finalMesSend[cfgDepth].extensionPrompts = [];
                        }
                        finalMesSend[cfgDepth].extensionPrompts.push(`${cfgPrompt.value}\n`);
                    }
                }
            }
        }

        // Add prompt bias after everything else
        // Always run with continue
        if (!isInstruct && !isImpersonate) {
            if (promptBias.trim().length !== 0) {
                finalMesSend[finalMesSend.length - 1].message +=
                    /\s/.test(finalMesSend[finalMesSend.length - 1].message.slice(-1))
                        ? promptBias.trimStart()
                        : ` ${promptBias.trimStart()}`;
            }
        }

        // Flattens the multiple prompt objects to a string.
        const combine = () => {
            // Right now, everything is suffixed with a newline
            mesSendString = finalMesSend.map((e) => `${e.extensionPrompts.join('')}${e.message}`).join('');

            // add a custom dingus (if defined)
            mesSendString = addChatsSeparator(mesSendString);

            // add chat preamble
            mesSendString = addChatsPreamble(mesSendString);

            let combinedPrompt = [
                combinedStoryString,
                mesExmString,
                mesSendString,
                generatedPromptCache,
            ].join('').replace(/\r/gm, '');

            if (power_user.collapse_newlines) {
                combinedPrompt = collapseNewlines(combinedPrompt);
            }

            return combinedPrompt;
        };

        finalMesSend.forEach((item, i) => {
            item.injected = injectedIndices.includes(finalMesSend.length - i - 1);
        });

        let data = {
            api: main_api,
            combinedPrompt: null,
            description,
            personality,
            persona,
            scenario,
            char: name2,
            user: name1,
            worldInfoBefore,
            worldInfoAfter,
            beforeScenarioAnchor,
            afterScenarioAnchor,
            storyString,
            mesExmString,
            mesSendString,
            finalMesSend,
            generatedPromptCache,
            main: system,
            jailbreak,
            naiPreamble: nai_settings.preamble,
        };
        promptModuleContext = data;

        const beforeContext = {
            stage: PROMPT_MODULE_STAGE.BEFORE_COMBINE,
            type,
            api: main_api,
            dryRun,
            data,
            get extensionPrompts() {
                return extension_prompts;
            },
            set(key, value) {
                data[key] = value;
            },
            merge(payload = {}) {
                if (payload && typeof payload === 'object') {
                    Object.assign(data, payload);
                }
            },
            setCombinedPrompt(value) {
                data.combinedPrompt = value;
            },
            setExtensionPrompt: (...args) => setExtensionPrompt(...args),
            removeExtensionPrompt(key) {
                if (typeof key === 'string' && Object.hasOwn(extension_prompts, key)) {
                    delete extension_prompts[key];
                }
            },
            async getExtensionPrompt(key) {
                return await getExtensionPromptByName(key);
            },
        };

        await runPromptModules(PROMPT_MODULE_STAGE.BEFORE_COMBINE, beforeContext);

        // Before returning the combined prompt, give available context related information to all subscribers.
        await eventSource.emit(event_types.GENERATE_BEFORE_COMBINE_PROMPTS, data);

        // If one or multiple subscribers return a value, forfeit the responsibillity of flattening the context.
        return !data.combinedPrompt ? combine() : data.combinedPrompt;
    }

    let finalPrompt = await getCombinedPrompt(false);
    const promptData = promptModuleContext ?? {};

    const eventData = { prompt: finalPrompt, dryRun: dryRun };
    await eventSource.emit(event_types.GENERATE_AFTER_COMBINE_PROMPTS, eventData);
    const afterContext = {
        stage: PROMPT_MODULE_STAGE.AFTER_COMBINE,
        type,
        api: main_api,
        dryRun,
        data: promptData,
        get prompt() {
            return eventData.prompt;
        },
        setPrompt(value) {
            eventData.prompt = String(value ?? '');
        },
        appendPrompt(value) {
            if (value !== undefined && value !== null) {
                eventData.prompt += String(value);
            }
        },
    };
    await runPromptModules(PROMPT_MODULE_STAGE.AFTER_COMBINE, afterContext);
    finalPrompt = eventData.prompt;

    let maxLength = Number(amount_gen); // how many tokens the AI will be requested to generate
    let thisPromptBits = [];

    let generate_data;
    switch (main_api) {
        case 'koboldhorde':
        case 'kobold':
            if (main_api == 'koboldhorde' && horde_settings.auto_adjust_response_length) {
                maxLength = Math.min(maxLength, adjustedParams.maxLength);
                maxLength = Math.max(maxLength, MIN_LENGTH); // prevent validation errors
            }

            generate_data = {
                prompt: finalPrompt,
                gui_settings: true,
                max_length: maxLength,
                max_context_length: max_context,
                api_server: kai_settings.api_server,
            };

            if (kai_settings.preset_settings != 'gui') {
                const isHorde = main_api == 'koboldhorde';
                const presetSettings = koboldai_settings[koboldai_setting_names[kai_settings.preset_settings]];
                const maxContext = (adjustedParams && horde_settings.auto_adjust_context_length) ? adjustedParams.maxContextLength : max_context;
                generate_data = getKoboldGenerationData(finalPrompt, presetSettings, maxLength, maxContext, isHorde, type);
            }
            break;
        case 'textgenerationwebui': {
            const cfgValues = useCfgPrompt ? { guidanceScale: cfgGuidanceScale, negativePrompt: await getCombinedPrompt(true) } : null;
            generate_data = await getTextGenGenerationData(finalPrompt, maxLength, isImpersonate, isContinue, cfgValues, type);
            break;
        }
        case 'novel': {
            const cfgValues = useCfgPrompt ? { guidanceScale: cfgGuidanceScale } : null;
            const presetSettings = novelai_settings[novelai_setting_names[nai_settings.preset_settings_novel]];
            generate_data = getNovelGenerationData(finalPrompt, presetSettings, maxLength, isImpersonate, isContinue, cfgValues, type);
            break;
        }
        case 'openai': {
            let [prompt, counts] = await prepareOpenAIMessages({
                name2: name2,
                charDescription: description,
                charPersonality: personality,
                scenario: scenario,
                worldInfoBefore: worldInfoBefore,
                worldInfoAfter: worldInfoAfter,
                extensionPrompts: extension_prompts,
                bias: promptBias,
                type: type,
                quietPrompt: quiet_prompt,
                quietImage: quietImage,
                cyclePrompt: cyclePrompt,
                systemPromptOverride: system,
                jailbreakPromptOverride: jailbreak,
                messages: oaiMessages,
                messageExamples: oaiMessageExamples,
            }, dryRun);
            generate_data = { prompt: prompt };

            // TODO: move these side-effects somewhere else, so this switch-case solely sets generate_data
            // counts will return false if the user has not enabled the token breakdown feature
            if (counts) {
                parseTokenCounts(counts, thisPromptBits);
            }

            if (!dryRun) {
                setInContextMessages(openai_messages_count, type);
            }
            break;
        }
    }

    await eventSource.emit(event_types.GENERATE_AFTER_DATA, generate_data);

    const generationPhaseInfo = {
        type,
        api: main_api,
        options: {
            automatic_trigger: Boolean(automatic_trigger),
            force_name2: Boolean(force_name2),
            quiet_prompt: quiet_prompt ?? '',
            quietToLoud: Boolean(quietToLoud),
            skipWIAN: Boolean(skipWIAN),
            force_chid: Number.isFinite(force_chid) ? Number(force_chid) : null,
            quietImage: quietImage ?? null,
            quietName: quietName ?? null,
            jsonSchema: jsonSchema ? cloneMessageObject(jsonSchema) : null,
            depth: depth ?? 0,
        },
        payload: cloneMessageObject(generate_data),
        streaming: Boolean(isStreamingEnabled() && type !== 'quiet'),
        dryRun: Boolean(dryRun),
    };
    await eventSource.emit(event_types.GENERATION_PHASE_BEFORE, generationPhaseInfo);

    if (dryRun) {
        return Promise.resolve();
    }

    /**
     * Saves itemized prompt bits and calls streaming or non-streaming generation API.
     * @returns {Promise<void|*|Awaited<*>|String|{fromStream}|string|undefined|Object>}
     * @throws {Error|object} Error with message text, or Error with response JSON (OAI/Horde), or the actual response JSON (novel|textgenerationwebui|kobold)
     */
    async function finishGenerating() {
        if (power_user.console_log_prompts) {
            console.log(generate_data.prompt);
        }

        console.debug('runGenerate 正在调用 API');

        showStopButton();

        //set array object for prompt token itemization of this message
        let currentArrayEntry = Number(thisPromptBits.length - 1);
        let additionalPromptStuff = {
            ...thisPromptBits[currentArrayEntry],
            rawPrompt: generate_data.prompt || generate_data.input,
            mesId: getNextMessageId(type),
            allAnchors: await getAllExtensionPrompts(),
            chatInjects: injectedIndices?.map(index => arrMes[arrMes.length - index - 1])?.join('') || '',
            summarizeString: (extension_prompts['1_memory']?.value || ''),
            authorsNoteString: (extension_prompts['2_floating_prompt']?.value || ''),
            smartContextString: (extension_prompts['chromadb']?.value || ''),
            chatVectorsString: (extension_prompts['3_vectors']?.value || ''),
            dataBankVectorsString: (extension_prompts['4_vectors_data_bank']?.value || ''),
            worldInfoString: worldInfoString,
            storyString: storyString,
            beforeScenarioAnchor: beforeScenarioAnchor,
            afterScenarioAnchor: afterScenarioAnchor,
            examplesString: examplesString,
            mesSendString: mesSendString,
            generatedPromptCache: generatedPromptCache,
            promptBias: promptBias,
            finalPrompt: finalPrompt,
            charDescription: description,
            charPersonality: personality,
            scenarioText: scenario,
            this_max_context: this_max_context,
            padding: power_user.token_padding,
            main_api: main_api,
            instruction: main_api !== 'openai' && power_user.sysprompt.enabled ? substituteParams(power_user.prefer_character_prompt && system ? system : power_user.sysprompt.content) : '',
            userPersona: (power_user.persona_description_position == persona_description_positions.IN_PROMPT ? (persona || '') : ''),
            tokenizer: getFriendlyTokenizerName(main_api).tokenizerName || '',
            presetName: getPresetManager()?.getSelectedPresetName() || '',
            messagesCount: main_api !== 'openai' ? mesSend.length : oaiMessages.length,
            examplesCount: main_api !== 'openai' ? (pinExmString ? mesExamplesArray.length : count_exm_add) : oaiMessageExamples.length,
        };

        //console.log(additionalPromptStuff);
        const itemizedIndex = itemizedPrompts.findIndex((item) => item.mesId === additionalPromptStuff.mesId);

        if (itemizedIndex !== -1) {
            itemizedPrompts[itemizedIndex] = additionalPromptStuff;
        }
        else {
            itemizedPrompts.push(additionalPromptStuff);
        }

        console.debug(`pushed prompt bits to itemizedPrompts array. Length is now: ${itemizedPrompts.length}`);

        if (isStreamingEnabled() && type !== 'quiet') {
            continue_mag = promptReasoning.removePrefix(continue_mag);
            streamingProcessor = new StreamingProcessor(type, force_name2, generation_started, continue_mag, promptReasoning);
            if (isContinue) {
                // Save reply does add cycle text to the prompt, so it's not needed here
                streamingProcessor.firstMessageText = '';
            }

            streamingProcessor.generator = await sendStreamingRequest(type, generate_data);

            hideSwipeButtons();
            let getMessage = await streamingProcessor.generate();
            let messageChunk = cleanUpMessage({
                getMessage: getMessage,
                isImpersonate: isImpersonate,
                isContinue: isContinue,
                displayIncompleteSentences: false,
            });

            if (isContinue) {
                getMessage = continue_mag + getMessage;
            }

            const isStreamFinished = streamingProcessor && !streamingProcessor.isStopped && streamingProcessor.isFinished;
            const isStreamWithToolCalls = streamingProcessor && Array.isArray(streamingProcessor.toolCalls) && streamingProcessor.toolCalls.length;
            if (canPerformToolCalls && isStreamFinished && isStreamWithToolCalls) {
                const lastMessage = chat[chat.length - 1];
                const hasToolCalls = ToolManager.hasToolCalls(streamingProcessor.toolCalls);
                const shouldDeleteMessage = type !== 'swipe' && ['', '...'].includes(lastMessage?.mes) && !lastMessage?.extra?.reasoning && ['', '...'].includes(streamingProcessor?.result);
                hasToolCalls && shouldDeleteMessage && await deleteLastMessage();
                const invocationResult = await ToolManager.invokeFunctionTools(streamingProcessor.toolCalls);
                const shouldStopGeneration = (!invocationResult.invocations.length && shouldDeleteMessage) || invocationResult.stealthCalls.length;
                if (hasToolCalls) {
                    if (shouldStopGeneration) {
                        if (Array.isArray(invocationResult.errors) && invocationResult.errors.length) {
                            ToolManager.showToolCallError(invocationResult.errors);
                        }
                        unblockGeneration(type);
                        streamingProcessor = null;
                        return;
                    }

                    streamingProcessor = null;
                    depth = depth + 1;
                    await ToolManager.saveFunctionToolInvocations(invocationResult.invocations);
                    return Generate('normal', { automatic_trigger, force_name2, quiet_prompt, quietToLoud, skipWIAN, force_chid, signal, quietImage, quietName, depth }, dryRun);
                }
            }

            if (isStreamFinished) {
                await streamingProcessor.onFinishStreaming(streamingProcessor.messageId, getMessage);
                streamingProcessor = null;
                triggerAutoContinue(messageChunk, isImpersonate);
                return Object.defineProperties(new String(getMessage), {
                    'messageChunk': { value: messageChunk },
                    'fromStream': { value: true },
                });
            }
        } else {
            return await sendGenerationRequest(type, generate_data, { jsonSchema });
        }
    }

    return finishGenerating().then(onSuccess, onError);

    /**
     * Handles the successful response from the generation API.
     * @param data
     * @returns {Promise<String|{fromStream}|*|string|string|void|Awaited<*>|undefined>}
     * @throws {Error} Throws an error if the response data contains an error message
     */
    async function onSuccess(data) {
        if (!data) return;

        if (data?.fromStream) {
            return data;
        }

        let messageChunk = '';

        // if an error was returned in data (textgenwebui), show it and throw it
        if (data.error) {
            unblockGeneration(type);

            if (data?.response) {
                toastr.error(data.response, t`API 错误`, { preventDuplicates: true });
            }
            throw new Error(data?.response);
        }

        if (jsonSchema) {
            unblockGeneration(type);
            return extractJsonFromData(data);
        }

        //const getData = await response.json();
        let getMessage = extractMessageFromData(data);
        let title = extractTitleFromData(data);
        let reasoning = extractReasoningFromData(data);
        let imageUrl = extractImageFromData(data);
        kobold_horde_model = title;

        const swipes = extractMultiSwipes(data, type);

        messageChunk = cleanUpMessage({
            getMessage: getMessage,
            isImpersonate: isImpersonate,
            isContinue: isContinue,
            displayIncompleteSentences: false,
        });


        reasoning = getRegexedString(reasoning, regex_placement.REASONING);

        if (power_user.trim_spaces) {
            reasoning = reasoning.trim();
        }

        if (isContinue) {
            continue_mag = promptReasoning.removePrefix(continue_mag);
            getMessage = continue_mag + getMessage;
        }

        //Formating
        const displayIncomplete = type === 'quiet' && !quietToLoud;
        getMessage = cleanUpMessage({
            getMessage: getMessage,
            isImpersonate: isImpersonate,
            isContinue: isContinue,
            displayIncompleteSentences: displayIncomplete,
        });

        await eventSource.emit(event_types.GENERATION_PHASE_STREAM, {
            type,
            streaming: false,
            text: getMessage,
            chunk: messageChunk,
            data: cloneMessageObject(data),
        });

        if (isImpersonate) {
            $('#send_textarea').val(getMessage)[0].dispatchEvent(new Event('input', { bubbles: true }));
            await eventSource.emit(event_types.IMPERSONATE_READY, getMessage);
        }
        else if (type == 'quiet') {
            unblockGeneration(type);
            await eventSource.emit(event_types.GENERATION_PHASE_AFTER, {
                type,
                streaming: false,
                text: getMessage,
                chunk: messageChunk,
                quiet: true,
                message: null,
                messageId: null,
            });
            return getMessage;
        }
        else {
            // Without streaming we'll be having a full message on continuation. Treat it as a last chunk.
            if (originalType !== 'continue') {
                ({ type, getMessage } = await saveReply({ type, getMessage, title, swipes, reasoning, imageUrl }));
            }
            else {
                ({ type, getMessage } = await saveReply({ type: 'appendFinal', getMessage, title, swipes, reasoning, imageUrl }));
            }

            // This relies on `saveReply` having been called to add the message to the chat, so it must be last.
            parseAndSaveLogprobs(data, continue_mag);
        }

        if (canPerformToolCalls) {
            const hasToolCalls = ToolManager.hasToolCalls(data);
            const shouldDeleteMessage = type !== 'swipe' && ['', '...'].includes(getMessage) && !reasoning;
            hasToolCalls && shouldDeleteMessage && await deleteLastMessage();
            const invocationResult = await ToolManager.invokeFunctionTools(data);
            const shouldStopGeneration = (!invocationResult.invocations.length && shouldDeleteMessage) || invocationResult.stealthCalls.length;
            if (hasToolCalls) {
                if (shouldStopGeneration) {
                    if (Array.isArray(invocationResult.errors) && invocationResult.errors.length) {
                        ToolManager.showToolCallError(invocationResult.errors);
                    }
                    unblockGeneration(type);
                    return;
                }

                depth = depth + 1;
                await ToolManager.saveFunctionToolInvocations(invocationResult.invocations);
                return Generate('normal', { automatic_trigger, force_name2, quiet_prompt, quietToLoud, skipWIAN, force_chid, signal, quietImage, quietName, depth }, dryRun);
            }
        }

        if (type !== 'quiet') {
            playMessageSound();
        }

        const isAborted = abortController && abortController.signal.aborted;
        if (!isAborted && power_user.auto_swipe && generatedTextFiltered(getMessage)) {
            is_send_press = false;
            return swipe_right();
        }

        console.debug('/api/chats/save 由 /Generate 触发');
        await saveChatConditional();
        unblockGeneration(type);
        streamingProcessor = null;

        if (type !== 'quiet') {
            triggerAutoContinue(messageChunk, isImpersonate);
        }

        const finalMessageId = chat.length ? chat.length - 1 : null;
        await eventSource.emit(event_types.GENERATION_PHASE_AFTER, {
            type,
            streaming: false,
            text: getMessage,
            chunk: messageChunk,
            messageId: finalMessageId,
            message: finalMessageId !== null ? cloneMessageObject(chat[finalMessageId]) : null,
        });

        // Don't break the API chain that expects a single string in return
        return Object.defineProperty(new String(getMessage), 'messageChunk', { value: messageChunk });
    }

    /**
     * Exception handler for finishGenerating
     * @param {Error|object} exception Error or response JSON
     * @throws {Error|object} Re-throws the exception
     */
    function onError(exception) {
        // if the response JSON was thrown (novel|textgenerationwebui|kobold), show the error message
        if (typeof exception?.error?.message === 'string') {
            toastr.error(exception.error.message, t`文本生成出错`, { timeOut: 10000, extendedTimeOut: 20000 });
        }

        unblockGeneration(type);
        console.log(exception);
        streamingProcessor = null;
        eventSource.emit(event_types.GENERATION_PHASE_AFTER, {
            type,
            streaming: false,
            error: true,
            messageId: null,
            message: null,
            reason: exception?.error?.message ?? exception?.message ?? String(exception ?? 'Unknown error'),
        }).catch(console.error);
        throw exception;
    }
}
//MARK: Generate() ends

/**
 * Stops the generation and any streaming if it is currently running.
 */
export function stopGeneration() {
    let stopped = false;
    if (streamingProcessor) {
        streamingProcessor.onStopStreaming();
        stopped = true;
    }
    if (abortController) {
        if (!abortController.signal.aborted) {
            abortController.abort('user-stop');
        }
        hideStopButton();
        stopped = true;
    }
    eventSource.emit(event_types.GENERATION_STOPPED);
    return stopped;
}

/**
 * Injects extension prompts into chat messages.
 * @param {object[]} messages Array of chat messages
 * @param {boolean} isContinue Whether the generation is a continuation. If true, the extension prompts of depth 0 are injected at position 1.
 * @returns {Promise<number[]>} Array of indices where the extension prompts were injected
 */
async function doChatInject(messages, isContinue) {
    const injectedIndices = [];
    let totalInsertedMessages = 0;
    messages.reverse();

    const maxDepth = getExtensionPromptMaxDepth();
    for (let i = 0; i <= maxDepth; i++) {
        // Order of priority (most important go lower)
        const roles = [extension_prompt_roles.SYSTEM, extension_prompt_roles.USER, extension_prompt_roles.ASSISTANT];
        const names = {
            [extension_prompt_roles.SYSTEM]: '',
            [extension_prompt_roles.USER]: name1,
            [extension_prompt_roles.ASSISTANT]: name2,
        };
        const roleMessages = [];
        const separator = '\n';
        const wrap = false;

        for (const role of roles) {
            const extensionPrompt = String(await getExtensionPrompt(extension_prompt_types.IN_CHAT, i, separator, role, wrap)).trimStart();
            const isNarrator = role === extension_prompt_roles.SYSTEM;
            const isUser = role === extension_prompt_roles.USER;
            const name = names[role];

            if (extensionPrompt) {
                roleMessages.push({
                    name: name,
                    is_user: isUser,
                    mes: extensionPrompt,
                    extra: {
                        type: isNarrator ? system_message_types.NARRATOR : null,
                    },
                });
            }
        }

        if (roleMessages.length) {
            const depth = isContinue && i === 0 ? 1 : i;
            const injectIdx = Math.min(depth + totalInsertedMessages, messages.length);
            messages.splice(injectIdx, 0, ...roleMessages);
            totalInsertedMessages += roleMessages.length;
            injectedIndices.push(...Array.from({ length: roleMessages.length }, (_, i) => injectIdx + i));
        }
    }

    messages.reverse();
    return injectedIndices;
}

function flushWIDepthInjections() {
    //prevent custom depth WI entries (which have unique random key names) from duplicating
    for (const key of Object.keys(extension_prompts)) {
        if (key.startsWith(inject_ids.CUSTOM_WI_DEPTH)) {
            delete extension_prompts[key];
        }
    }
}

/**
 * Unblocks the UI after a generation is complete.
 * @param {string} [type] Generation type (optional)
 */
function unblockGeneration(type) {
    // Don't unblock if a parallel stream is still running
    if (type === 'quiet' && streamingProcessor && !streamingProcessor.isFinished) {
        return;
    }

    is_send_press = false;
    activateSendButtons();
    showSwipeButtons();
    setGenerationProgress(0);
    flushEphemeralStoppingStrings();
    flushWIDepthInjections();
}

export function getNextMessageId(type) {
    return type == 'swipe' ? chat.length - 1 : chat.length;
}

/**
 * Determines if the message should be auto-continued.
 * @param {string} messageChunk Current message chunk
 * @param {boolean} isImpersonate Is the user impersonation
 * @returns {boolean} Whether the message should be auto-continued
 */
export function shouldAutoContinue(messageChunk, isImpersonate) {
    if (!power_user.auto_continue.enabled) {
        console.debug('用户已关闭自动续写功能');
        return false;
    }

    if (typeof messageChunk !== 'string') {
        console.debug('未触发自动续写：分段内容不是字符串');
        return false;
    }

    if (isImpersonate) {
        console.log('当前暂不支持代入身份的自动续写');
        return false;
    }

    if (is_send_press) {
        console.debug('当前正在发送消息，自动续写已禁用');
        return false;
    }

    if (abortController && abortController.signal.aborted) {
        console.debug('生成已停止，未触发自动续写');
        return false;
    }

    if (power_user.auto_continue.target_length <= 0) {
        console.log('自动续写目标长度为 0，未触发自动续写');
        return false;
    }

    if (main_api === 'openai' && !power_user.auto_continue.allow_chat_completions) {
        console.log('用户已关闭针对 OpenAI 的自动续写');
        return false;
    }

    const textareaText = String($('#send_textarea').val());
    const USABLE_LENGTH = 5;

    if (textareaText.length > 0) {
        console.log('用户输入区非空，未触发自动续写');
        return false;
    }

    if (messageChunk.trim().length > USABLE_LENGTH && chat.length) {
        const lastMessage = chat[chat.length - 1];
        const messageLength = getTokenCount(lastMessage.mes);
        const shouldAutoContinue = messageLength < power_user.auto_continue.target_length;

        if (shouldAutoContinue) {
            console.log(`Triggering auto-continue. Message tokens: ${messageLength}. Target tokens: ${power_user.auto_continue.target_length}. Message chunk: ${messageChunk}`);
            return true;
        } else {
            console.log(`未触发自动续写。当前消息 Token 数：${messageLength}，目标 Token 数：${power_user.auto_continue.target_length}`);
            return false;
        }
    } else {
        console.log('最新生成的片段为空，未触发自动续写');
        return false;
    }
}

/**
 * Triggers auto-continue if the message meets the criteria.
 * @param {string} messageChunk Current message chunk
 * @param {boolean} isImpersonate Is the user impersonation
 */
export function triggerAutoContinue(messageChunk, isImpersonate) {
    if (selected_group) {
        console.debug('群聊模式已禁用自动续写');
        return;
    }

    if (shouldAutoContinue(messageChunk, isImpersonate)) {
        $('#option_continue').trigger('click');
    }
}

export function getBiasStrings(textareaText, type) {
    if (type == 'impersonate' || type == 'continue') {
        return { messageBias: '', promptBias: '', isUserPromptBias: false };
    }

    let promptBias = '';
    let messageBias = extractMessageBias(textareaText);

    // If user input is not provided, retrieve the bias of the most recent relevant message
    if (!textareaText) {
        for (let i = chat.length - 1; i >= 0; i--) {
            const mes = chat[i];
            if (type === 'swipe' && chat.length - 1 === i) {
                continue;
            }
            if (mes && (mes.is_user || mes.is_system || mes.extra?.type === system_message_types.NARRATOR)) {
                if (mes.extra?.bias?.trim()?.length > 0) {
                    promptBias = mes.extra.bias;
                }
                break;
            }
        }
    }

    promptBias = messageBias || promptBias || power_user.user_prompt_bias || '';
    const isUserPromptBias = promptBias === power_user.user_prompt_bias;

    // Substitute params for everything
    messageBias = substituteParams(messageBias);
    promptBias = substituteParams(promptBias);

    return { messageBias, promptBias, isUserPromptBias };
}

/**
 * @param {Object} chatItem Message history item.
 * @param {boolean} isInstruct Whether instruct mode is enabled.
 * @param {boolean|number} forceOutputSequence Whether to force the first/last output sequence for instruct mode.
 */
function formatMessageHistoryItem(chatItem, isInstruct, forceOutputSequence) {
    const isNarratorType = chatItem?.extra?.type === system_message_types.NARRATOR;
    const characterName = chatItem?.name ? chatItem.name : name2;
    const itemName = chatItem.is_user ? chatItem['name'] : characterName;
    const shouldPrependName = !isNarratorType;

    // If this symbol flag is set, completely ignore the message.
    // This can be used to hide messages without affecting the number of messages in the chat.
    if (chatItem.extra?.[IGNORE_SYMBOL]) {
        return '';
    }

    // Don't include a name if it's empty
    let textResult = chatItem?.name && shouldPrependName ? `${itemName}: ${chatItem.mes}\n` : `${chatItem.mes}\n`;

    if (isInstruct) {
        textResult = formatInstructModeChat(itemName, chatItem.mes, chatItem.is_user, isNarratorType, chatItem.force_avatar, name1, name2, forceOutputSequence);
    }

    return textResult;
}

/**
 * Removes all {{macros}} from a string.
 * @param {string} str String to remove macros from.
 * @returns {string} String with macros removed.
 */
export function removeMacros(str) {
    return (str ?? '').replace(/\{\{[\s\S]*?\}\}/gm, '').trim();
}

/**
 * Inserts a user message into the chat history.
 * @param {string} messageText Message text.
 * @param {string} messageBias Message bias.
 * @param {number} [insertAt] Optional index to insert the message at.
 * @param {boolean} [compact] Send as a compact display message.
 * @param {string} [name] Name of the user sending the message. Defaults to name1.
 * @param {string} [avatar] Avatar of the user sending the message. Defaults to user_avatar.
 * @returns {Promise<any>} A promise that resolves to the message when it is inserted.
 */
export async function sendMessageAsUser(messageText, messageBias, insertAt = null, compact = false, name = name1, avatar = user_avatar) {
    messageText = getRegexedString(messageText, regex_placement.USER_INPUT);

    const message = {
        name: name,
        is_user: true,
        is_system: false,
        send_date: getMessageTimeStamp(),
        mes: substituteParams(messageText),
        extra: {
            isSmallSys: compact,
        },
    };

    if (power_user.message_token_count_enabled) {
        message.extra.token_count = await getTokenCountAsync(message.mes, 0);
    }

    // Lock user avatar to a persona.
    if (avatar in power_user.personas) {
        message.force_avatar = getThumbnailUrl('persona', avatar);
    }

    if (messageBias) {
        message.extra.bias = messageBias;
        message.mes = removeMacros(message.mes);
    }

    await populateFileAttachment(message);
    statMesProcess(message, 'user', characters, this_chid, '');

    if (typeof insertAt === 'number' && insertAt >= 0 && insertAt <= chat.length) {
        chat.splice(insertAt, 0, message);
        await saveChatConditional();
        await eventSource.emit(event_types.MESSAGE_SENT, insertAt);
        await reloadCurrentChat();
        await eventSource.emit(event_types.USER_MESSAGE_RENDERED, insertAt);
    } else {
        chat.push(message);
        const chat_id = (chat.length - 1);
        await eventSource.emit(event_types.MESSAGE_SENT, chat_id);

        const formattedText = message?.extra?.display_text ?? message?.mes ?? '';
        const sanitizerOverrides = message?.uses_system_ui ? { MESSAGE_ALLOW_SYSTEM_UI: true } : {};
        const isReasoning = message?.extra?.type === 'reasoning';
        await prepareMessageRender(formattedText, message?.name, message?.is_system, message?.is_user, chat_id, sanitizerOverrides, isReasoning);

        addOneMessage(message);
        await eventSource.emit(event_types.USER_MESSAGE_RENDERED, chat_id);
        await saveChatConditional();
    }

    return message;
}

/**
 * Gets the maximum usable context size for the current API.
 * @param {number|null} overrideResponseLength Optional override for the response length.
 * @returns {number} Maximum usable context size.
 */
export function getMaxContextSize(overrideResponseLength = null) {
    if (typeof overrideResponseLength !== 'number' || overrideResponseLength <= 0 || isNaN(overrideResponseLength)) {
        overrideResponseLength = null;
    }

    let this_max_context = 1487;
    if (main_api == 'kobold' || main_api == 'koboldhorde' || main_api == 'textgenerationwebui') {
        this_max_context = (max_context - (overrideResponseLength || amount_gen));
    }
    if (main_api == 'novel') {
        this_max_context = Number(max_context);
        if (nai_settings.model_novel.includes('clio')) {
            this_max_context = Math.min(max_context, 8192);
        }
        if (nai_settings.model_novel.includes('kayra')) {
            this_max_context = Math.min(max_context, 8192);

            const subscriptionLimit = getKayraMaxContextTokens();
            if (typeof subscriptionLimit === 'number' && this_max_context > subscriptionLimit) {
                this_max_context = subscriptionLimit;
                console.log(`NovelAI subscription limit reached. Max context size is now ${this_max_context}`);
            }
        }
        if (nai_settings.model_novel.includes('erato')) {
            // subscriber limits coming soon
            this_max_context = Math.min(max_context, 8192);

            // Added special tokens and whatnot
            this_max_context -= 10;
        }

        this_max_context = this_max_context - (overrideResponseLength || amount_gen);
    }
    if (main_api == 'openai') {
        this_max_context = oai_settings.openai_max_context - (overrideResponseLength || oai_settings.openai_max_tokens);
    }
    return this_max_context;
}

function parseTokenCounts(counts, thisPromptBits) {
    /**
     * @param {any[]} numbers
     */
    function getSum(...numbers) {
        return numbers.map(x => Number(x)).filter(x => !Number.isNaN(x)).reduce((acc, val) => acc + val, 0);
    }
    const total = getSum(Object.values(counts));

    thisPromptBits.push({
        oaiStartTokens: (counts?.start + counts?.controlPrompts) || 0,
        oaiPromptTokens: getSum(counts?.prompt, counts?.charDescription, counts?.charPersonality, counts?.scenario) || 0,
        oaiBiasTokens: counts?.bias || 0,
        oaiNudgeTokens: counts?.nudge || 0,
        oaiJailbreakTokens: counts?.jailbreak || 0,
        oaiImpersonateTokens: counts?.impersonate || 0,
        oaiExamplesTokens: (counts?.dialogueExamples + counts?.examples) || 0,
        oaiConversationTokens: (counts?.conversation + counts?.chatHistory) || 0,
        oaiNsfwTokens: counts?.nsfw || 0,
        oaiMainTokens: counts?.main || 0,
        oaiTotalTokens: total,
    });
}

function addChatsPreamble(mesSendString) {
    return main_api === 'novel'
        ? substituteParams(nai_settings.preamble) + '\n' + mesSendString
        : mesSendString;
}

function addChatsSeparator(mesSendString) {
    if (power_user.context.chat_start) {
        return substituteParams(power_user.context.chat_start + '\n') + mesSendString;
    }

    else {
        return mesSendString;
    }
}

export async function duplicateCharacter() {
    if (this_chid === undefined || !characters[this_chid]) {
        toastr.warning(t`请先选择要复制的角色！`);
        return '';
    }

    const confirmMessage = $(await renderTemplateAsync('duplicateConfirm'));
    const confirm = await callGenericPopup(confirmMessage, POPUP_TYPE.CONFIRM);

    if (!confirm) {
        console.log('User cancelled duplication');
        return '';
    }

    const body = { avatar_url: characters[this_chid].avatar };
    const response = await fetch('/api/characters/duplicate', {
        method: 'POST',
        headers: getRequestHeaders(),
        body: JSON.stringify(body),
    });
    if (response.ok) {
        toastr.success(t`角色复制完成`);
        const data = await response.json();
        await eventSource.emit(event_types.CHARACTER_DUPLICATED, { oldAvatar: body.avatar_url, newAvatar: data.path });
        await getCharacters();
    }

    return '';
}

function setInContextMessages(msgInContextCount, type) {
    forEachMountedMessage((_, element) => {
        element.classList.remove('lastInContext');
    });

    let effectiveCount = msgInContextCount;
    if (type === 'swipe' || type === 'regenerate' || type === 'continue') {
        effectiveCount++;
    }

    const lastMessageId = Math.max(0, chat.length - effectiveCount);
    const lastMessageElement = getMessageDom(lastMessageId);
    if (lastMessageElement) {
        lastMessageElement.classList.add('lastInContext');
    } else {
        const firstMessageId = getFirstDisplayedMessageId();
        const fallbackElement = getMessageDom(firstMessageId);
        if (fallbackElement) {
            fallbackElement.classList.add('lastInContext');
        }
    }

    chat_metadata['lastInContextMessageId'] = lastMessageId;
}

/**
 * @typedef {object} AdditionalRequestOptions
 * @property {JsonSchema} [jsonSchema]
 */

/**
 * Sends a non-streaming request to the API.
 * @param {string} type Generation type
 * @param {object} data Generation data
 * @param {AdditionalRequestOptions} [options] Additional options for the generation request
 * @returns {Promise<object>} Response data from the API
 * @throws {Error|object}
 */
export async function sendGenerationRequest(type, data, options = {}) {
    if (main_api === 'openai') {
        return await sendOpenAIRequest(type, data.prompt, abortController.signal, options);
    }

    if (main_api === 'koboldhorde') {
        return await generateHorde(data.prompt, data, abortController.signal, true);
    }

    const response = await fetch(getGenerateUrl(main_api), {
        method: 'POST',
        headers: getRequestHeaders(),
        cache: 'no-cache',
        body: JSON.stringify(data),
        signal: abortController.signal,
    });

    if (!response.ok) {
        throw await response.json();
    }

    return await response.json();
}

/**
 * Sends a streaming request to the API.
 * @param {string} type Generation type
 * @param {object} data Generation data
 * @param {AdditionalRequestOptions} [options] Additional options for the generation request
 * @returns {Promise<any>} Streaming generator
 */
export async function sendStreamingRequest(type, data, options = {}) {
    if (streamingProcessor?.abortController?.signal?.aborted) {
        streamingProcessor.abortController = new AbortController();
    }

    if (!abortController || abortController.signal?.aborted) {
        abortController = new AbortController();
    }

    if (abortController.signal.aborted) {
        throw new Error('生成已中止。');
    }

    switch (main_api) {
        case 'openai':
            return await sendOpenAIRequest(type, data.prompt, streamingProcessor.abortController.signal, options);
        case 'textgenerationwebui':
            return await generateTextGenWithStreaming(data, streamingProcessor.abortController.signal);
        case 'novel':
            return await generateNovelWithStreaming(data, streamingProcessor.abortController.signal);
        case 'kobold':
            return await generateKoboldWithStreaming(data, streamingProcessor.abortController.signal);
        default:
            throw new Error('已启用流式输出，但当前 API 不支持流式。');
    }
}

/**
 * Gets the generation endpoint URL for the specified API.
 * @param {string} api API name
 * @returns {string} Generation URL
 * @throws {Error} If the API is unknown
 */
export function getGenerateUrl(api) {
    switch (api) {
        case 'kobold':
            return '/api/backends/kobold/generate';
        case 'koboldhorde':
            return '/api/backends/koboldhorde/generate';
        case 'textgenerationwebui':
            return '/api/backends/text-completions/generate';
        case 'novel':
            return '/api/novelai/generate';
        default:
            throw new Error(`Unknown API: ${api}`);
    }
}

function extractTitleFromData(data) {
    if (main_api == 'koboldhorde') {
        return data.workerName;
    }

    return undefined;
}

/**
 * Extracts the image from the response data.
 * @param {object} data Response data
 * @param {object} [options] Extraction options
 * @param {string} [options.mainApi] Main API to use
 * @param {string} [options.chatCompletionSource] Chat completion source
 * @returns {string} Extracted image
 */
function extractImageFromData(data, { mainApi = null, chatCompletionSource = null } = {}) {
    switch (mainApi ?? main_api) {
        case 'openai': {
            switch (chatCompletionSource ?? oai_settings.chat_completion_source) {
                case chat_completion_sources.VERTEXAI:
                case chat_completion_sources.MAKERSUITE: {
                    const inlineData = data?.responseContent?.parts?.find(x => x.inlineData)?.inlineData;
                    if (inlineData) {
                        return `data:${inlineData.mimeType};base64,${inlineData.data}`;
                    }
                } break;
                case chat_completion_sources.OPENROUTER: {
                    const imageUrl = data?.choices[0]?.message?.images?.find(x => x.type === 'image_url')?.image_url?.url;
                    if (isDataURL(imageUrl)) {
                        return imageUrl;
                    }
                    // TODO: Handle remote URLs
                }
            }
        } break;
    }

    return undefined;
}

/**
 * parseAndSaveLogprobs receives the full data response for a non-streaming
 * generation, parses logprobs for all tokens in the message, and saves them
 * to the currently active message.
 * @param {object} data - response data containing all tokens/logprobs
 * @param {string} continueFrom - for 'continue' generations, the prompt
 *  */
function parseAndSaveLogprobs(data, continueFrom) {
    /** @type {import('./scripts/logprobs.js').TokenLogprobs[] | null} */
    let logprobs = null;

    switch (main_api) {
        case 'novel':
            // parser only handles one token/logprob pair at a time
            logprobs = data.logprobs?.map(parseNovelAILogprobs) || null;
            break;
        case 'openai':
            // OAI and other chat completion APIs must handle this earlier in
            // `sendOpenAIRequest`. `data` for these APIs is just a string with
            // the text of the generated message, logprobs are not included.
            return;
        case 'textgenerationwebui':
            switch (textgen_settings.type) {
                case textgen_types.LLAMACPP: {
                    logprobs = data?.completion_probabilities?.map(x => parseTextgenLogprobs(x.content, [x])) || null;
                } break;
                case textgen_types.KOBOLDCPP:
                case textgen_types.VLLM:
                case textgen_types.INFERMATICAI:
                case textgen_types.APHRODITE:
                case textgen_types.MANCER:
                case textgen_types.TABBY: {
                    logprobs = parseTabbyLogprobs(data) || null;
                } break;
            } break;
        default:
            return;
    }

    saveLogprobsForActiveMessage(logprobs, continueFrom);
}

/**
 * Extracts the message from the response data.
 * @param {object} data Response data
 * @param {string} activeApi If it's set, ignores active API
 * @returns {string} Extracted message
 */
export function extractMessageFromData(data, activeApi = null) {
    function getResult() {
        if (typeof data === 'string') {
            return data;
        }

        switch (activeApi ?? main_api) {
            case 'kobold':
                return data.results[0].text;
            case 'koboldhorde':
                return data.text;
            case 'textgenerationwebui':
                return data.choices?.[0]?.text ?? data.choices?.[0]?.message?.content ?? data.content ?? data.response ?? '';
            case 'novel':
                return data.output;
            case 'openai':
                return data?.content?.find(p => p.type === 'text')?.text ?? data?.choices?.[0]?.message?.content ?? data?.choices?.[0]?.text ?? data?.text ?? data?.message?.content?.[0]?.text ?? data?.message?.tool_plan ?? '';
            default:
                return '';
        }
    }

    const result = getResult();
    return Array.isArray(result) ? result.map(x => x.text).filter(x => x).join('') : result;
}

/**
 * Extracts JSON from the response data.
 * @param {object} data Response data
 * @returns {string} Extracted JSON string from the response data
 */
export function extractJsonFromData(data, { mainApi = null, chatCompletionSource = null } = {}) {
    mainApi = mainApi ?? main_api;
    chatCompletionSource = chatCompletionSource ?? oai_settings.chat_completion_source;

    const tryParse = (/** @type {string} */ value) => {
        try {
            return JSON.parse(value);
        } catch (e) {
            console.debug('Failed to parse content as JSON.', e);
        }
    };

    let result = {};

    switch (mainApi) {
        case 'openai': {
            const text = extractMessageFromData(data, mainApi);
            switch (chatCompletionSource) {
                case chat_completion_sources.CLAUDE:
                    result = data?.content?.find(x => x.type === 'tool_use')?.input;
                    break;
                case chat_completion_sources.PERPLEXITY:
                    result = tryParse(removeReasoningFromString(text));
                    break;
                case chat_completion_sources.VERTEXAI:
                case chat_completion_sources.MAKERSUITE:
                case chat_completion_sources.DEEPSEEK:
                case chat_completion_sources.AI21:
                case chat_completion_sources.GROQ:
                case chat_completion_sources.POLLINATIONS:
                case chat_completion_sources.AIMLAPI:
                case chat_completion_sources.OPENAI:
                case chat_completion_sources.OPENROUTER:
                case chat_completion_sources.MISTRALAI:
                case chat_completion_sources.CUSTOM:
                case chat_completion_sources.COHERE:
                case chat_completion_sources.XAI:
                case chat_completion_sources.ELECTRONHUB:
                case chat_completion_sources.AZURE_OPENAI:
                default:
                    result = tryParse(text);
                    break;
            }
        } break;
    }

    return JSON.stringify(result ?? {});
}

/**
 * Extracts multiswipe swipes from the response data.
 * @param {Object} data Response data
 * @param {string} type Type of generation
 * @returns {string[]} Array of extra swipes
 */
function extractMultiSwipes(data, type) {
    const swipes = [];

    if (!data) {
        return swipes;
    }

    if (type === 'continue' || type === 'impersonate' || type === 'quiet') {
        return swipes;
    }

    if (main_api === 'openai' || (main_api === 'textgenerationwebui' && [textgen_types.MANCER, textgen_types.VLLM, textgen_types.APHRODITE, textgen_types.TABBY, textgen_types.INFERMATICAI].includes(textgen_settings.type))) {
        if (!Array.isArray(data.choices)) {
            return swipes;
        }

        const multiSwipeCount = data.choices.length - 1;

        if (multiSwipeCount <= 0) {
            return swipes;
        }

        for (let i = 1; i < data.choices.length; i++) {
            const text = data?.choices[i]?.message?.content ?? data?.choices[i]?.text ?? '';
            const cleanedText = cleanUpMessage({
                getMessage: text,
                isImpersonate: false,
                isContinue: false,
                displayIncompleteSentences: false,
            });

            swipes.push(cleanedText);
        }
    }

    return swipes;
}

/**
 * Formats a message according to user settings
 * @param {object} [options] - Additional options.
 * @param {string} [options.getMessage] The message to clean up
 * @param {boolean} [options.isImpersonate] Whether this is an impersonated message
 * @param {boolean} [options.isContinue] Whether this is a continued message
 * @param {boolean} [options.displayIncompleteSentences] Whether to keep incomplete sentences at the end.
 * @param {array} [options.stoppingStrings] Array of stopping strings.
 * @param {boolean} [options.includeUserPromptBias] Whether to permit prepending the user prompt bias at the beginning.
 * @param {boolean} [options.trimNames] Whether to allow trimming "{{char}}:" or "{{user}}:" from the beginning.
 * @param {boolean} [options.trimWrongNames] Whether to allow deleting responses prefixed by the incorrect name, depending on isImpersonate
 *
 * @returns {string} The formatted message
 */
export function cleanUpMessage({ getMessage, isImpersonate, isContinue, displayIncompleteSentences = false, stoppingStrings = null, includeUserPromptBias = true, trimNames = true, trimWrongNames = true } = {}) {
    if (arguments.length > 0 && typeof arguments[0] !== 'object') {
        console.trace('cleanUpMessage called with positional arguments. Please use an object instead.');
        [getMessage, isImpersonate, isContinue, displayIncompleteSentences, stoppingStrings, includeUserPromptBias, trimNames, trimWrongNames] = arguments;
    }

    if (!getMessage) {
        return '';
    }

    // Add the prompt bias before anything else
    if (
        includeUserPromptBias &&
        power_user.user_prompt_bias &&
        !isImpersonate &&
        !isContinue &&
        power_user.user_prompt_bias.length !== 0
    ) {
        getMessage = substituteParams(power_user.user_prompt_bias) + getMessage;
    }

    // Allow for caching of stopping strings. getStoppingStrings is an expensive function, especially with macros
    // enabled, so for streaming, we call it once and then pass it into each cleanUpMessage call.
    if (!stoppingStrings) {
        stoppingStrings = getStoppingStrings(isImpersonate, isContinue);
    }

    for (const stoppingString of stoppingStrings) {
        if (stoppingString.length) {
            for (let j = stoppingString.length; j > 0; j--) {
                if (getMessage.slice(-j) === stoppingString.slice(0, j)) {
                    getMessage = getMessage.slice(0, -j);
                    break;
                }
            }
        }
    }

    // Regex uses vars, so add before formatting
    getMessage = getRegexedString(getMessage, isImpersonate ? regex_placement.USER_INPUT : regex_placement.AI_OUTPUT);

    if (power_user.collapse_newlines) {
        getMessage = collapseNewlines(getMessage);
    }

    // trailing invisible whitespace before every newlines, on a multiline string
    // "trailing whitespace on newlines       \nevery line of the string    \n?sample text" ->
    // "trailing whitespace on newlines\nevery line of the string\nsample text"
    getMessage = getMessage.replace(/[^\S\r\n]+$/gm, '');

    if (trimWrongNames) {
        // If this is an impersonation, delete the entire response if it starts with "{{char}}:"
        // If this isn't an impersonation, delete the entire response if it starts with "{{user}}:"
        // Also delete any trailing text that starts with the wrong name.
        // This only occurs if the corresponding "power_user.allow_nameX_display" is false.

        let wrongName = isImpersonate
            ? (!power_user.allow_name2_display ? name2 : '')  // char
            : (!power_user.allow_name1_display ? name1 : '');  // user

        if (wrongName) {
            // If the message starts with the wrong name, delete the entire response
            let startIndex = getMessage.indexOf(`${wrongName}:`);
            if (startIndex === 0) {
                getMessage = '';
                console.debug(`Message started with the wrong name: "${wrongName}" - response was deleted.`);
            }

            // If there is trailing text starting with the wrong name, trim it off.
            startIndex = getMessage.indexOf(`\n${wrongName}:`);
            if (startIndex >= 0) {
                getMessage = getMessage.substring(0, startIndex);
            }
        }
    }

    if (getMessage.indexOf('<|endoftext|>') != -1) {
        getMessage = getMessage.substring(0, getMessage.indexOf('<|endoftext|>'));
    }
    const isInstruct = power_user.instruct.enabled && main_api !== 'openai';
    const isNotEmpty = (str) => str && str.trim() !== '';
    if (isInstruct && power_user.instruct.stop_sequence) {
        if (getMessage.indexOf(power_user.instruct.stop_sequence) != -1) {
            getMessage = getMessage.substring(0, getMessage.indexOf(power_user.instruct.stop_sequence));
        }
    }
    // Hana: Only use the first sequence (should be <|model|>)
    // of the prompt before <|user|> (as KoboldAI Lite does it).
    if (isInstruct && isNotEmpty(power_user.instruct.input_sequence)) {
        if (getMessage.indexOf(power_user.instruct.input_sequence) != -1) {
            getMessage = getMessage.substring(0, getMessage.indexOf(power_user.instruct.input_sequence));
        }
    }

    // Remove instruct sequences leaking to the output
    if (isInstruct && power_user.instruct.sequences_as_stop_strings) {
        const sequences = [
            { value: power_user.instruct.input_sequence, apply: isImpersonate && isNotEmpty(power_user.instruct.input_sequence) },
            { value: power_user.instruct.output_sequence, apply: !isImpersonate && isNotEmpty(power_user.instruct.output_sequence) },
            { value: power_user.instruct.last_output_sequence, apply: !isImpersonate && isNotEmpty(power_user.instruct.last_output_sequence) },
        ];
        for (const seq of sequences.filter(s => s.apply)) {
            seq.value.split('\n').filter(line => line.trim() !== '').forEach(line => { getMessage = getMessage.replaceAll(line, ''); });
        }
    }

    // clean-up group message from excessive generations
    if (selected_group) {
        getMessage = cleanGroupMessage(getMessage);
    }

    if (!power_user.allow_name2_display) {
        const name2Escaped = escapeRegex(name2);
        getMessage = getMessage.replace(new RegExp(`(^|\n)${name2Escaped}:\\s*`, 'g'), '$1');
    }

    if (isImpersonate) {
        getMessage = getMessage.trim();
    }

    if (power_user.auto_fix_generated_markdown) {
        getMessage = fixMarkdown(getMessage, false);
    }

    if (trimNames) {
        // If this is an impersonation, trim "{{user}}:" from the beginning
        // If this isn't an impersonation, trim "{{char}}:" from the beginning.
        // Only applied when the corresponding "power_user.allow_nameX_display" is false.
        const nameToTrim2 = isImpersonate
            ? (!power_user.allow_name1_display ? name1 : '')  // user
            : (!power_user.allow_name2_display ? name2 : '');  // char

        if (nameToTrim2 && getMessage.startsWith(nameToTrim2 + ':')) {
            getMessage = getMessage.replace(nameToTrim2 + ':', '');
            getMessage = getMessage.trimStart();
        }
    }

    if (isImpersonate) {
        getMessage = getMessage.trim();
    }

    if (!displayIncompleteSentences && power_user.trim_sentences) {
        getMessage = trimToEndSentence(getMessage);
    }

    if (power_user.trim_spaces && !PromptReasoning.getLatestPrefix()) {
        getMessage = getMessage.trim();
    }

    return getMessage;
}

/**
 * Adds an image to the message.
 * @param {object} message Message object
 * @param {object} sources Image sources
 * @param {string} [sources.imageUrl] Image URL
 *
 * @returns {Promise<void>}
 */
async function processImageAttachment(message, { imageUrl }) {
    if (!imageUrl) {
        return;
    }

    let url = imageUrl;
    if (isDataURL(url)) {
        const fileName = `inline_image_${Date.now().toString()}`;
        const [mime, base64] = /^data:(.*?);base64,(.*)$/.exec(imageUrl).slice(1);
        url = await saveBase64AsFile(base64, message.name, fileName, mime.split('/')[1]);
    }
    saveImageToMessage({ image: url, inline: true }, message);
}

/**
 * Saves a resulting message to the chat.
 * @param {SaveReplyParams} params
 * @returns {Promise<SaveReplyResult>} Promise when the message is saved
 *
 * @typedef {object} SaveReplyParams
 * @property {string} type Type of generation
 * @property {string} getMessage Generated message
 * @property {boolean} [fromStreaming] If the message is from streaming
 * @property {string} [title] Message tooltip
 * @property {string[]} [swipes] Extra swipes
 * @property {string} [reasoning] Message reasoning
 * @property {string} [imageUrl] Link to an image
 *
 * @typedef {object} SaveReplyResult
 * @property {string} type Type of generation
 * @property {string} getMessage Generated message
 */
export async function saveReply({ type, getMessage, fromStreaming = false, title = '', swipes = [], reasoning = '', imageUrl = '' }) {
    // Backward compatibility
    if (arguments.length > 1 && typeof arguments[0] !== 'object') {
        console.trace('saveReply called with positional arguments. Please use an object instead.');
        [type, getMessage, fromStreaming, title, swipes, reasoning, imageUrl] = arguments;
    }

    if (type != 'append' && type != 'continue' && type != 'appendFinal' && chat.length && (chat[chat.length - 1]['swipe_id'] === undefined ||
        chat[chat.length - 1]['is_user'])) {
        type = 'normal';
    }

    if (chat.length && (!chat[chat.length - 1]['extra'] || typeof chat[chat.length - 1]['extra'] !== 'object')) {
        chat[chat.length - 1]['extra'] = {};
    }

    // Coerce null/undefined to empty string
    if (chat.length && !chat[chat.length - 1]['extra']['reasoning']) {
        chat[chat.length - 1]['extra']['reasoning'] = '';
    }

    if (!reasoning) {
        reasoning = '';
    }

    let oldMessage = '';
    const generationFinished = new Date();
    if (type === 'swipe') {
        oldMessage = chat[chat.length - 1]['mes'];
        chat[chat.length - 1]['swipes'].length++;
        if (chat[chat.length - 1]['swipe_id'] === chat[chat.length - 1]['swipes'].length - 1) {
            chat[chat.length - 1]['title'] = title;
            chat[chat.length - 1]['mes'] = getMessage;
            chat[chat.length - 1]['gen_started'] = generation_started;
            chat[chat.length - 1]['gen_finished'] = generationFinished;
            chat[chat.length - 1]['send_date'] = getMessageTimeStamp();
            chat[chat.length - 1]['extra']['api'] = getGeneratingApi();
            chat[chat.length - 1]['extra']['model'] = getGeneratingModel();
            chat[chat.length - 1]['extra']['reasoning'] = reasoning;
            chat[chat.length - 1]['extra']['reasoning_duration'] = null;
            await processImageAttachment(chat[chat.length - 1], { imageUrl });
            if (power_user.message_token_count_enabled) {
                const tokenCountText = (reasoning || '') + chat[chat.length - 1]['mes'];
                chat[chat.length - 1]['extra']['token_count'] = await getTokenCountAsync(tokenCountText, 0);
            }
            const chat_id = (chat.length - 1);
            await eventSource.emit(event_types.MESSAGE_RECEIVED, chat_id, type);
            addOneMessage(chat[chat_id], { type: 'swipe' });
            await eventSource.emit(event_types.CHARACTER_MESSAGE_RENDERED, chat_id, type);
        } else {
            chat[chat.length - 1]['mes'] = getMessage;
        }
    } else if (type === 'append' || type === 'continue') {
        console.debug('Trying to append.');
        oldMessage = chat[chat.length - 1]['mes'];
        chat[chat.length - 1]['title'] = title;
        chat[chat.length - 1]['mes'] += getMessage;
        chat[chat.length - 1]['gen_started'] = generation_started;
        chat[chat.length - 1]['gen_finished'] = generationFinished;
        chat[chat.length - 1]['send_date'] = getMessageTimeStamp();
        chat[chat.length - 1]['extra']['api'] = getGeneratingApi();
        chat[chat.length - 1]['extra']['model'] = getGeneratingModel();
        chat[chat.length - 1]['extra']['reasoning'] = reasoning;
        chat[chat.length - 1]['extra']['reasoning_duration'] = null;
        await processImageAttachment(chat[chat.length - 1], { imageUrl });
        if (power_user.message_token_count_enabled) {
            const tokenCountText = (reasoning || '') + chat[chat.length - 1]['mes'];
            chat[chat.length - 1]['extra']['token_count'] = await getTokenCountAsync(tokenCountText, 0);
        }
        const chat_id = (chat.length - 1);
        await eventSource.emit(event_types.MESSAGE_RECEIVED, chat_id, type);
        addOneMessage(chat[chat_id], { type: 'swipe' });
        await eventSource.emit(event_types.CHARACTER_MESSAGE_RENDERED, chat_id, type);
    } else if (type === 'appendFinal') {
        oldMessage = chat[chat.length - 1]['mes'];
        console.debug('Trying to appendFinal.');
        chat[chat.length - 1]['title'] = title;
        chat[chat.length - 1]['mes'] = getMessage;
        chat[chat.length - 1]['gen_started'] = generation_started;
        chat[chat.length - 1]['gen_finished'] = generationFinished;
        chat[chat.length - 1]['send_date'] = getMessageTimeStamp();
        chat[chat.length - 1]['extra']['api'] = getGeneratingApi();
        chat[chat.length - 1]['extra']['model'] = getGeneratingModel();
        chat[chat.length - 1]['extra']['reasoning'] += reasoning;
        await processImageAttachment(chat[chat.length - 1], { imageUrl });
        // We don't know if the reasoning duration extended, so we don't update it here on purpose.
        if (power_user.message_token_count_enabled) {
            const tokenCountText = (reasoning || '') + chat[chat.length - 1]['mes'];
            chat[chat.length - 1]['extra']['token_count'] = await getTokenCountAsync(tokenCountText, 0);
        }
        const chat_id = (chat.length - 1);
        await eventSource.emit(event_types.MESSAGE_RECEIVED, chat_id, type);
        addOneMessage(chat[chat_id], { type: 'swipe' });
        await eventSource.emit(event_types.CHARACTER_MESSAGE_RENDERED, chat_id, type);

    } else {
        console.debug('entering chat update routine for non-swipe post');
        chat[chat.length] = {};
        chat[chat.length - 1]['extra'] = {};
        chat[chat.length - 1]['name'] = name2;
        chat[chat.length - 1]['is_user'] = false;
        chat[chat.length - 1]['send_date'] = getMessageTimeStamp();
        chat[chat.length - 1]['extra']['api'] = getGeneratingApi();
        chat[chat.length - 1]['extra']['model'] = getGeneratingModel();
        chat[chat.length - 1]['extra']['reasoning'] = reasoning;
        chat[chat.length - 1]['extra']['reasoning_duration'] = null;
        if (power_user.trim_spaces) {
            getMessage = getMessage.trim();
        }
        chat[chat.length - 1]['mes'] = getMessage;
        chat[chat.length - 1]['title'] = title;
        chat[chat.length - 1]['gen_started'] = generation_started;
        chat[chat.length - 1]['gen_finished'] = generationFinished;

        if (power_user.message_token_count_enabled) {
            const tokenCountText = (reasoning || '') + chat[chat.length - 1]['mes'];
            chat[chat.length - 1]['extra']['token_count'] = await getTokenCountAsync(tokenCountText, 0);
        }

        if (selected_group) {
            console.debug('entering chat update for groups');
            let avatarImg = 'img/ai4.png';
            if (characters[this_chid].avatar != 'none') {
                avatarImg = getThumbnailUrl('avatar', characters[this_chid].avatar);
            }
            chat[chat.length - 1]['force_avatar'] = avatarImg;
            chat[chat.length - 1]['original_avatar'] = characters[this_chid].avatar;
            chat[chat.length - 1]['extra']['gen_id'] = group_generation_id;
        }

        await processImageAttachment(chat[chat.length - 1], { imageUrl });
        const chat_id = (chat.length - 1);

        !fromStreaming && await eventSource.emit(event_types.MESSAGE_RECEIVED, chat_id, type);
        addOneMessage(chat[chat_id]);
        !fromStreaming && await eventSource.emit(event_types.CHARACTER_MESSAGE_RENDERED, chat_id, type);
    }

    const item = chat[chat.length - 1];
    if (item['swipe_info'] === undefined) {
        item['swipe_info'] = [];
    }
    if (item['swipe_id'] !== undefined) {
        const swipeId = item['swipe_id'];
        item['swipes'][swipeId] = item['mes'];
        item['swipe_info'][swipeId] = {
            send_date: item['send_date'],
            gen_started: item['gen_started'],
            gen_finished: item['gen_finished'],
            extra: structuredClone(item['extra']),
        };
    } else {
        item['swipe_id'] = 0;
        item['swipes'] = [];
        item['swipes'][0] = chat[chat.length - 1]['mes'];
        item['swipe_info'][0] = {
            send_date: chat[chat.length - 1]['send_date'],
            gen_started: chat[chat.length - 1]['gen_started'],
            gen_finished: chat[chat.length - 1]['gen_finished'],
            extra: structuredClone(chat[chat.length - 1]['extra']),
        };
    }

    if (Array.isArray(swipes) && swipes.length > 0) {
        const swipeInfoExtra = structuredClone(item.extra ?? {});
        delete swipeInfoExtra.token_count;
        delete swipeInfoExtra.reasoning;
        delete swipeInfoExtra.reasoning_duration;
        const swipeInfo = {
            send_date: item.send_date,
            gen_started: item.gen_started,
            gen_finished: item.gen_finished,
            extra: swipeInfoExtra,
        };
        const swipeInfoArray = Array(swipes.length).fill().map(() => structuredClone(swipeInfo));
        parseReasoningInSwipes(swipes, swipeInfoArray, item.extra?.reasoning_duration);
        item.swipes.push(...swipes);
        item.swipe_info.push(...swipeInfoArray);
    }

    statMesProcess(chat[chat.length - 1], type, characters, this_chid, oldMessage);
    return { type, getMessage };
}

/**
 * Syncs the current message and all its data into the swipe data at the given message ID (or the last message if no ID is given).
 *
 * If the swipe data is invalid in some way, this function will exit out without doing anything.
 * @param {number?} [messageId=null] - The ID of the message to sync with the swipe data. If no ID is given, the last message is used.
 * @returns {boolean} Whether the message was successfully synced
 */
export function syncMesToSwipe(messageId = null) {
    if (!chat.length) {
        return false;
    }

    const targetMessageId = messageId ?? chat.length - 1;
    if (targetMessageId >= chat.length || targetMessageId < 0) {
        console.warn(`[syncMesToSwipe] Invalid message ID: ${messageId}`);
        return false;
    }

    const targetMessage = chat[targetMessageId];
    if (!targetMessage) {
        return false;
    }

    // No swipe data there yet, exit out
    if (typeof targetMessage.swipe_id !== 'number') {
        return false;
    }
    // If swipes structure is invalid, exit out (for now?)
    if (!Array.isArray(targetMessage.swipe_info) || !Array.isArray(targetMessage.swipes)) {
        return false;
    }
    // If the swipe is not present yet, exit out (will likely be copied later)
    if (!targetMessage.swipes[targetMessage.swipe_id] || !targetMessage.swipe_info[targetMessage.swipe_id]) {
        return false;
    }

    const targetSwipeInfo = targetMessage.swipe_info[targetMessage.swipe_id];
    if (typeof targetSwipeInfo !== 'object') {
        return false;
    }

    targetMessage.swipes[targetMessage.swipe_id] = targetMessage.mes;

    targetSwipeInfo.send_date = targetMessage.send_date;
    targetSwipeInfo.gen_started = targetMessage.gen_started;
    targetSwipeInfo.gen_finished = targetMessage.gen_finished;
    targetSwipeInfo.extra = structuredClone(targetMessage.extra);

    return true;
}

/**
 * Syncs swipe data back to the message data at the given message ID (or the last message if no ID is given).
 * If the swipe ID is not provided, the current swipe ID in the message object is used.
 *
 * If the swipe data is invalid in some way, this function will exit out without doing anything.
 * @param {number?} [messageId=null] - The ID of the message to sync with the swipe data. If no ID is given, the last message is used.
 * @param {number?} [swipeId=null] - The ID of the swipe to sync. If no ID is given, the current swipe ID in the message object is used.
 * @returns {boolean} Whether the swipe data was successfully synced to the message
 */
export function syncSwipeToMes(messageId = null, swipeId = null) {
    if (!chat.length) {
        return false;
    }

    const targetMessageId = messageId ?? chat.length - 1;
    if (targetMessageId >= chat.length || targetMessageId < 0) {
        console.warn(`[syncSwipeToMes] Invalid message ID: ${messageId}`);
        return false;
    }

    const targetMessage = chat[targetMessageId];
    if (!targetMessage) {
        return false;
    }

    if (swipeId !== null) {
        if (isNaN(swipeId) || swipeId < 0) {
            console.warn(`[syncSwipeToMes] Invalid swipe ID: ${swipeId}`);
            return false;
        }
        targetMessage.swipe_id = swipeId;
    }

    // No swipe data there yet, exit out
    if (typeof targetMessage.swipe_id !== 'number') {
        return false;
    }
    // If swipes structure is invalid, exit out
    if (!Array.isArray(targetMessage.swipe_info) || !Array.isArray(targetMessage.swipes)) {
        return false;
    }

    const targetSwipeId = targetMessage.swipe_id;
    if (!targetMessage.swipes[targetSwipeId] || !targetMessage.swipe_info[targetSwipeId]) {
        console.warn(`[syncSwipeToMes] Invalid swipe ID: ${targetSwipeId}`);
        return false;
    }

    const targetSwipeInfo = targetMessage.swipe_info[targetSwipeId];
    if (typeof targetSwipeInfo !== 'object') {
        return false;
    }

    targetMessage.mes = targetMessage.swipes[targetSwipeId];
    targetMessage.send_date = targetSwipeInfo.send_date;
    targetMessage.gen_started = targetSwipeInfo.gen_started;
    targetMessage.gen_finished = targetSwipeInfo.gen_finished;
    targetMessage.extra = structuredClone(targetSwipeInfo.extra);

    return true;
}

/**
 * Saves the image to the message object.
 * @param {ParsedImage} img Image object
 * @param {object} mes Chat message object
 * @typedef {{ image?: string, title?: string, inline?: boolean }} ParsedImage
 */
function saveImageToMessage(img, mes) {
    if (mes && img.image) {
        if (!mes.extra || typeof mes.extra !== 'object') {
            mes.extra = {};
        }
        mes.extra.image = img.image;
        mes.extra.title = img.title;
        mes.extra.inline_image = img.inline;
    }
}

export function getGeneratingApi() {
    switch (main_api) {
        case 'openai':
            return oai_settings.chat_completion_source || 'openai';
        case 'textgenerationwebui':
            return textgen_settings.type === textgen_types.OOBA ? 'textgenerationwebui' : textgen_settings.type;
        default:
            return main_api;
    }
}

function getGeneratingModel(mes) {
    let model = '';
    switch (main_api) {
        case 'kobold':
            model = online_status;
            break;
        case 'novel':
            model = nai_settings.model_novel;
            break;
        case 'openai':
            model = getChatCompletionModel();
            break;
        case 'textgenerationwebui':
            model = online_status;
            break;
        case 'koboldhorde':
            model = kobold_horde_model;
            break;
    }
    return model;
}

/**
 * A function mainly used to switch 'generating' state - setting it to false and activating the buttons again
 */
export function activateSendButtons() {
    is_send_press = false;
    hideStopButton();
    delete document.body.dataset.generating;
}

/**
 * A function mainly used to switch 'generating' state - setting it to true and deactivating the buttons
 */
export function deactivateSendButtons() {
    showStopButton();
    document.body.dataset.generating = 'true';
}

export function resetChatState() {
    // replaces deleted charcter name with system user since it will be displayed next.
    name2 = (this_chid === undefined && neutralCharacterName) ? neutralCharacterName : systemUserName;
    //unsets expected chid before reloading (related to getCharacters/printCharacters from using old arrays)
    setCharacterId(undefined);
    // sets up system user to tell user about having deleted a character
    chat.splice(0, chat.length, ...SAFETY_CHAT);
    // resets chat metadata
    chat_metadata = {};
    // resets the characters array, forcing getcharacters to reset
    characters.length = 0;
}

/**
 *
 * @param {'characters' | 'character_edit' | 'create' | 'group_edit' | 'group_create'} value
 */
export function setMenuType(value) {
    menu_type = value;
    // Allow custom CSS to see which menu type is active
    document.getElementById('right-nav-panel').dataset.menuType = menu_type;
}

export function setExternalAbortController(controller) {
    abortController = controller;
}

/**
 * Sets a character array index.
 * @param {number|string|undefined} value
 */
export function setCharacterId(value) {
    switch (typeof value) {
        case 'bigint':
        case 'number':
            this_chid = String(value);
            break;
        case 'string':
            this_chid = !isNaN(parseInt(value)) ? value : undefined;
            break;
        case 'object':
            this_chid = characters.indexOf(value) !== -1 ? String(characters.indexOf(value)) : undefined;
            break;
        case 'undefined':
            this_chid = undefined;
            break;
        default:
            console.error('Invalid character ID type:', value);
            break;
    }
}

export function setCharacterName(value) {
    name2 = value;
}

/**
 * Sets the API connection status of the application
 * @param {string|'no_connection'} value Connection status value
 */
export function setOnlineStatus(value) {
    const previousStatus = online_status;
    online_status = value;
    displayOnlineStatus();
    if (previousStatus !== online_status) {
        eventSource.emitAndWait(event_types.ONLINE_STATUS_CHANGED, online_status);
    }
}

export function setEditedMessageId(value) {
    this_edit_mes_id = value;
}

export function setSendButtonState(value) {
    is_send_press = value;
}

/**
 * Renames the currently selected character, updating relevant references and optionally renaming past chats.
 *
 * If no name is provided, a popup prompts for a new name. If the new name matches the current name,
 * the renaming process is aborted. The function sends a request to the server to rename the character
 * and handles updates to other related fields such as tags, lore, and author notes.
 *
 * If the renaming is successful, the character list is reloaded and the renamed character is selected.
 * Optionally, past chats can be renamed to reflect the new character name.
 *
 * @param {string?} [name=null] - The new name for the character. If not provided, a popup will prompt for it.
 * @param {object} [options] - Additional options.
 * @param {boolean} [options.silent=false] - If true, suppresses popups and warnings.
 * @param {boolean?} [options.renameChats=null] - If true, renames past chats to reflect the new character name.
 * @returns {Promise<boolean>} - Returns true if the character was successfully renamed, false otherwise.
 */

export async function renameCharacter(name = null, { silent = false, renameChats = null } = {}) {
    if (!name && silent) {
        toastr.warning(t`未提供角色名称。`, t`重命名角色`);
        return false;
    }
    if (this_chid === undefined) {
        toastr.warning(t`未选择角色。`, t`重命名角色`);
        return false;
    }

    const oldAvatar = characters[this_chid].avatar;
    const newValue = name || await callGenericPopup('<h3>' + t`新名称：` + '</h3>', POPUP_TYPE.INPUT, characters[this_chid].name);

    if (!newValue) {
        toastr.warning(t`未提供角色名称。`, t`重命名角色`);
        return false;
    }
    if (newValue === characters[this_chid].name) {
        toastr.info(t`输入的角色名称未发生变化。`, t`重命名角色`);
        return false;
    }

    const body = JSON.stringify({ avatar_url: oldAvatar, new_name: newValue });
    const response = await fetch('/api/characters/rename', {
        method: 'POST',
        headers: getRequestHeaders(),
        body,
    });

    try {
        if (response.ok) {
            const data = await response.json();
            const newAvatar = data.avatar;

            const oldName = getCharaFilename(null, { manualAvatarKey: oldAvatar });
            const newName = getCharaFilename(null, { manualAvatarKey: newAvatar });

            let settingsDirty = false;

            // Replace other auxillery fields where was referenced by avatar key
            // Tag List
            renameTagKey(oldAvatar, newAvatar);

            // Addtional lore books
            const charLore = world_info.charLore?.find(x => x.name == oldName);
            if (charLore) {
                charLore.name = newName;
                settingsDirty = true;
            }

            // Char-bound Author's Notes
            const charNote = extension_settings.note.chara?.find(x => x.name == oldName);
            if (charNote) {
                charNote.name = newName;
                settingsDirty = true;
            }

            // Update active character, if the current one was the currently active one
            if (active_character === oldAvatar) {
                active_character = newAvatar;
                settingsDirty = true;
            }

            if (settingsDirty) {
                queueGlobalSettingsSave();
            }

            await eventSource.emit(event_types.CHARACTER_RENAMED, oldAvatar, newAvatar);

            // Unload current character
            setCharacterId(undefined);
            // Reload characters list
            await getCharacters();

            // Find newly renamed character
            const newChId = characters.findIndex(c => c.avatar == data.avatar);

            if (newChId !== -1) {
                // Select the character after the renaming
                await selectCharacterById(newChId);

                // Async delay to update UI
                await delay(1);

                if (this_chid === undefined) {
                    throw new Error('未选择新的角色');
                }

                // Also rename as a group member
                await renameGroupMember(oldAvatar, newAvatar, newValue);
                const renamePastChatsConfirm = renameChats !== null
                    ? renameChats
                    : silent
                        ? false
                        : await Popup.show.confirm(
                            t`角色已重命名！`,
                            `<p>${t`历史聊天仍将显示旧的角色名，是否一并更新为新名称？`}</p>
                            <i><b>${t`若存在 Sprites 文件夹，请手动重命名。`}</b></i>`,
                        ) == POPUP_RESULT.AFFIRMATIVE;

                if (renamePastChatsConfirm) {
                    await renamePastChats(oldAvatar, newAvatar, newValue);
                    await reloadCurrentChat();
                    toastr.success(t`角色已重命名并同步至历史聊天！`, t`重命名角色`);
                } else {
                    toastr.success(t`角色已重命名！`, t`重命名角色`);
                }
            }
            else {
                throw new Error('新名称的角色数据丢失？');
            }
        }
        else {
            throw new Error('无法完成角色重命名');
        }
    }
    catch (error) {
        // Reloading to prevent data corruption
        if (!silent) await Popup.show.text(t`重命名角色`, t`出现问题，页面将重新加载。`);
        else toastr.error(t`出现问题，页面将重新加载。`, t`重命名角色`);

        console.log('Renaming character error:', error);
        location.reload();
        return false;
    }

    return true;
}

async function renamePastChats(oldAvatar, newAvatar, newName) {
    const pastChats = await getPastCharacterChats();

    for (const { file_name } of pastChats) {
        try {
            const fileNameWithoutExtension = file_name.replace('.jsonl', '');
            const getChatResponse = await fetch('/api/chats/get', {
                method: 'POST',
                headers: getRequestHeaders(),
                body: JSON.stringify({
                    ch_name: newName,
                    file_name: fileNameWithoutExtension,
                    avatar_url: newAvatar,
                }),
                cache: 'no-cache',
            });

            if (getChatResponse.ok) {
                const currentChat = await getChatResponse.json();

                for (const message of currentChat) {
                    if (message.is_user || message.is_system || message.extra?.type == system_message_types.NARRATOR) {
                        continue;
                    }

                    if (message.name !== undefined) {
                        message.name = newName;
                    }
                }

                await eventSource.emit(event_types.CHARACTER_RENAMED_IN_PAST_CHAT, currentChat, oldAvatar, newAvatar);

                const saveChatResponse = await fetch('/api/chats/save', {
                    method: 'POST',
                    headers: getRequestHeaders(),
                    body: JSON.stringify({
                        ch_name: newName,
                        file_name: fileNameWithoutExtension,
                        chat: currentChat,
                        avatar_url: newAvatar,
                    }),
                    cache: 'no-cache',
                });

                if (!saveChatResponse.ok) {
                    throw new Error('无法保存聊天');
                }
            }
        } catch (error) {
            toastr.error(t`无法更新历史聊天：${file_name}`);
            console.error(error);
        }
    }
}

export function saveChatDebounced() {
    const chid = this_chid;
    const selectedGroup = selected_group;

    cancelDebouncedChatSave();

    chatSaveTimeout = setTimeout(async () => {
        if (selectedGroup !== selected_group) {
            console.warn('Chat save timeout triggered, but group changed. Aborting.');
            return;
        }

        if (chid !== this_chid) {
            console.warn('Chat save timeout triggered, but chid changed. Aborting.');
            return;
        }

        console.debug('Chat save timeout triggered');
        await saveChatConditional();
        console.debug('Chat saved');
    }, DEFAULT_SAVE_EDIT_TIMEOUT);
}

/**
 * Saves the chat to the server.
 * @param {object} [options] - Additional options.
 * @param {string} [options.chatName] The name of the chat file to save to
 * @param {object} [options.withMetadata] Additional metadata to save with the chat
 * @param {number} [options.mesId] The message ID to save the chat up to
 * @param {boolean} [options.force] Force the saving despire the integrity check result
 *
 * @returns {Promise<void>}
 */
export async function saveChat({ chatName, withMetadata, mesId, force = false } = {}) {
    if (arguments.length > 0 && typeof arguments[0] !== 'object') {
        console.trace('saveChat 使用了位置参数。请改用对象。');
        [chatName, withMetadata, mesId, force] = arguments;
    }

    const metadata = { ...chat_metadata, ...(withMetadata || {}) };
    const fileName = chatName ?? characters[this_chid]?.chat;

    if (!fileName && name2 === neutralCharacterName) {
        // TODO: Do something for a temporary chat with no character.
        return;
    }

    if (!fileName) {
        console.warn('调用 saveChat 时未提供 chat_name，并且未找到聊天文件');
        return;
    }

    characters[this_chid]['date_last_chat'] = Date.now();
    chat.forEach(function (item, i) {
        if (item['is_group']) {
            toastr.error(t`检测到使用普通 saveChat 保存群聊，已终止以防数据损坏。`);
            throw new Error('saveChat 被用于保存群聊');
        }
    });

    const trimmedChat = (mesId !== undefined && mesId >= 0 && mesId < chat.length)
        ? chat.slice(0, Number(mesId) + 1)
        : chat.slice();

    const chatToSave = [
        {
            user_name: name1,
            character_name: name2,
            create_date: chat_create_date,
            chat_metadata: metadata,
        },
        ...trimmedChat,
    ];

    try {
        const result = await fetch('/api/chats/save', {
            method: 'POST',
            cache: 'no-cache',
            headers: getRequestHeaders(),
            body: JSON.stringify({
                ch_name: characters[this_chid].name,
                file_name: fileName,
                chat: chatToSave,
                avatar_url: characters[this_chid].avatar,
                force: force,
            }),
        });

        if (result.ok) {
            return;
        }

        const errorData = await result.json();
        const isIntegrityError = errorData?.error === 'integrity' && !force;
        if (!isIntegrityError) {
            throw new Error(result.statusText);
        }

        const popupResult = await Popup.show.input(
            t`错误：保存文件时聊天完整性校验失败。`,
            t`<p>点击“确定”后，页面将重新加载以防止数据损坏。</p>
              <p>若要确认覆盖（可能会<b>导致数据丢失</b>），请在下方输入框中输入 <code>OVERWRITE</code>（需大写）后再点击“确定”。</p>`,
            '',
            { okButton: 'OK', cancelButton: false },
        );

        const forceSaveConfirmed = popupResult === 'OVERWRITE';

        if (!forceSaveConfirmed) {
            console.warn('Chat integrity check failed, and user did not confirm the overwrite. Reloading the page.');
            window.location.reload();
            return;
        }

        await saveChat({ chatName, withMetadata, mesId, force: true });
    } catch (error) {
        console.error(error);
        toastr.error(t`请检查服务器连接并重新加载页面以防数据丢失。`, t`聊天无法保存`);
    }
}

/**
 * Processes the avatar image from the input element, allowing the user to crop it if necessary.
 * @param {HTMLInputElement} input - The input element containing the avatar file.
 * @returns {Promise<void>}
 */
async function read_avatar_load(input) {
    if (input.files && input.files[0]) {
        if (selected_button == 'create') {
            create_save.avatar = input.files;
        }

        crop_data = undefined;
        const file = input.files[0];
        const fileData = await getBase64Async(file);

        if (!power_user.never_resize_avatars) {
            const dlg = new Popup('Set the crop position of the avatar image', POPUP_TYPE.CROP, '', { cropImage: fileData });
            const croppedImage = await dlg.show();

            if (!croppedImage) {
                return;
            }

            crop_data = dlg.cropData;
            $('#avatar_load_preview').attr('src', String(croppedImage));
        } else {
            $('#avatar_load_preview').attr('src', fileData);
        }

        if (menu_type == 'create') {
            return;
        }

        await createOrEditCharacter();
        await delay(DEFAULT_SAVE_EDIT_TIMEOUT);

        const formData = new FormData(/** @type {HTMLFormElement} */($('#form_create').get(0)));
        await fetch(getThumbnailUrl('avatar', formData.get('avatar_url').toString()), {
            method: 'GET',
            cache: 'reload',
        });

        const messages = $('.mes').toArray();
        for (const el of messages) {
            const $el = $(el);
            const nameMatch = $el.attr('ch_name') == formData.get('ch_name');
            if ($el.attr('is_system') == 'true' && !nameMatch) continue;
            if ($el.attr('is_user') == 'true') continue;

            if (nameMatch) {
                const previewSrc = $('#avatar_load_preview').attr('src');
                const avatar = $el.find('.avatar img');
                avatar.attr('src', default_avatar);
                await delay(1);
                avatar.attr('src', previewSrc);
            }
        }

        console.log('Avatar refreshed');
        refreshManagedChatAvatars();
    }
}

/**
 * Gets the URL for a thumbnail of a specific type and file.
 * @param {import('../src/endpoints/thumbnails.js').ThumbnailType} type The type of the thumbnail to get
 * @param {string} file The file name or path for which to get the thumbnail URL
 * @param {boolean} [t=false] Whether to add a cache-busting timestamp to the URL
 * @returns {string} The URL for the thumbnail
 */
export function getThumbnailUrl(type, file, t = false) {
    return `/thumbnail?type=${type}&file=${encodeURIComponent(file)}${t ? `&t=${Date.now()}` : ''}`;
}

export function buildAvatarList(block, entities, { templateId = 'inline_avatar_template', empty = true, interactable = false, highlightFavs = true } = {}) {
    if (empty) {
        block.empty();
    }

    for (const entity of entities) {
        const id = entity.id;

        // Populate the template
        const avatarTemplate = $(`#${templateId} .avatar`).clone();

        let this_avatar = default_avatar;
        if (entity.item.avatar !== undefined && entity.item.avatar != 'none') {
            this_avatar = getThumbnailUrl('avatar', entity.item.avatar);
        }

        avatarTemplate.attr('data-type', entity.type);
        avatarTemplate.attr('data-chid', id);
        avatarTemplate.find('img').attr('src', this_avatar).attr('alt', entity.item.name);
        avatarTemplate.attr('title', `[Character] ${entity.item.name}\nFile: ${entity.item.avatar}`);
        if (highlightFavs) {
            avatarTemplate.toggleClass('is_fav', entity.item.fav || entity.item.fav == 'true');
            avatarTemplate.find('.ch_fav').val(entity.item.fav);
        }

        // If this is a group, we need to hack slightly. We still want to keep most of the css classes and layout, but use a group avatar instead.
        if (entity.type === 'group') {
            const grpTemplate = getGroupAvatar(entity.item);

            avatarTemplate.addClass(grpTemplate.attr('class'));
            avatarTemplate.empty();
            avatarTemplate.append(grpTemplate.children());
            avatarTemplate.attr({ 'data-grid': id, 'data-chid': null });
            avatarTemplate.attr('title', `[Group] ${entity.item.name}`);
        }
        else if (entity.type === 'persona') {
            avatarTemplate.attr({ 'data-pid': id, 'data-chid': null });
            avatarTemplate.find('img').attr('src', getThumbnailUrl('persona', entity.item.avatar));
            avatarTemplate.attr('title', `[Persona] ${entity.item.name}\nFile: ${entity.item.avatar}`);
        }

        if (interactable) {
            avatarTemplate.addClass(INTERACTABLE_CONTROL_CLASS);
            avatarTemplate.toggleClass('character_select', entity.type === 'character');
            avatarTemplate.toggleClass('group_select', entity.type === 'group');
        }

        block.append(avatarTemplate);
    }
}

/**
 * Loads all the data of a shallow character.
 * @param {string|undefined} characterId Array index
 * @returns {Promise<void>} Promise that resolves when the character is unshallowed
 */
export async function unshallowCharacter(characterId) {
    if (characterId === undefined) {
        console.debug('Undefined character cannot be unshallowed');
        return;
    }

    /** @type {import('./scripts/char-data.js').v1CharData} */
    const character = characters[characterId];
    if (!character) {
        console.debug('Character not found:', characterId);
        return;
    }

    // Character is not shallow
    if (!character.shallow) {
        return;
    }

    const avatar = character.avatar;
    if (!avatar) {
        console.debug('Character has no avatar field:', characterId);
        return;
    }

    await getOneCharacter(avatar);
}

export async function getChat() {
    //console.log('/api/chats/get -- entered for -- ' + characters[this_chid].name);
    try {
        await unshallowCharacter(this_chid);

        const response = await $.ajax({
            type: 'POST',
            url: '/api/chats/get',
            data: JSON.stringify({
                ch_name: characters[this_chid].name,
                file_name: characters[this_chid].chat,
                avatar_url: characters[this_chid].avatar,
            }),
            dataType: 'json',
            contentType: 'application/json',
        });
        if (response[0] !== undefined) {
            chat.splice(0, chat.length, ...response);
            chat_create_date = chat[0]['create_date'];
            chat_metadata = chat[0]['chat_metadata'] ?? {};

            chat.shift();
        } else {
            chat_create_date = humanizedDateTime();
        }
        if (!chat_metadata['integrity']) {
            chat_metadata['integrity'] = uuidv4();
        }
        await getChatResult();
        eventSource.emit('chatLoaded', { detail: { id: this_chid, character: characters[this_chid] } });

        // Focus on the textarea if not already focused on a visible text input
        setTimeout(function () {
            if ($(document.activeElement).is('input:visible, textarea:visible')) {
                return;
            }
            $('#send_textarea').trigger('click').trigger('focus');
        }, 200);
    } catch (error) {
        await getChatResult();
        console.log(error);
    }
}

async function getChatResult() {
    name2 = characters[this_chid].name;
    let freshChat = false;
    lastChatLoadFresh = false;
    if (chat.length === 0) {
        const message = getFirstMessage();
        if (message.mes) {
            chat.push(message);
            const chatId = chat.length - 1;
            const formattedText = message?.extra?.display_text ?? message?.mes ?? '';
            const sanitizerOverrides = message?.uses_system_ui ? { MESSAGE_ALLOW_SYSTEM_UI: true } : {};
            const isReasoning = message?.extra?.type === 'reasoning';
            await prepareMessageRender(formattedText, message?.name, message?.is_system, message?.is_user, chatId, sanitizerOverrides, isReasoning);
            freshChat = true;
        }
        // Make sure the chat appears on the server
        await saveChatConditional();
    }
    await loadItemizedPrompts(getCurrentChatId());
    await printMessages();
    select_selected_character(this_chid);

    await eventSource.emit(event_types.CHAT_CHANGED, (getCurrentChatId()));
    if (freshChat) await eventSource.emit(event_types.CHAT_CREATED);

    if (chat.length === 1) {
        const chat_id = (chat.length - 1);
        await eventSource.emit(event_types.MESSAGE_RECEIVED, chat_id, 'first_message');
        await eventSource.emit(event_types.CHARACTER_MESSAGE_RENDERED, chat_id, 'first_message');
    }

    lastChatLoadFresh = freshChat;
}

function getFirstMessage() {
    const firstMes = characters[this_chid].first_mes || '';
    const alternateGreetings = characters[this_chid]?.data?.alternate_greetings;

    const message = {
        name: name2,
        is_user: false,
        is_system: false,
        send_date: getMessageTimeStamp(),
        mes: getRegexedString(firstMes, regex_placement.AI_OUTPUT),
        extra: {},
    };

    if (Array.isArray(alternateGreetings) && alternateGreetings.length > 0) {
        const swipes = [message.mes, ...(alternateGreetings.map(greeting => getRegexedString(greeting, regex_placement.AI_OUTPUT)))];

        if (!message.mes) {
            swipes.shift();
            message.mes = swipes[0];
        }

        message['swipe_id'] = 0;
        message['swipes'] = swipes;
        message['swipe_info'] = [];
    }

    return message;
}

export async function openCharacterChat(file_name) {
    await waitUntilCondition(() => !isChatSaving, debounce_timeout.extended, 10);
    await clearChat();
    characters[this_chid]['chat'] = file_name;
    chat.length = 0;
    chat_metadata = {};
    await getChat();
    $('#selected_chat_pole').val(file_name);
    await createOrEditCharacter(new CustomEvent('newChat'));
}

////////// OPTIMZED MAIN API CHANGE FUNCTION ////////////

export function changeMainAPI() {
    const selectedVal = $('#main_api').val();
    //console.log(selectedVal);
    const apiElements = {
        'koboldhorde': {
            apiStreaming: $('#NULL_SELECTOR'),
            apiSettings: $('#kobold_api-settings'),
            apiConnector: $('#kobold_horde'),
            apiPresets: $('#kobold_api-presets'),
            apiRanges: $('#range_block'),
            maxContextElem: $('#max_context_block'),
            amountGenElem: $('#amount_gen_block'),
        },
        'kobold': {
            apiStreaming: $('#streaming_kobold_block'),
            apiSettings: $('#kobold_api-settings'),
            apiConnector: $('#kobold_api'),
            apiPresets: $('#kobold_api-presets'),
            apiRanges: $('#range_block'),
            maxContextElem: $('#max_context_block'),
            amountGenElem: $('#amount_gen_block'),
        },
        'textgenerationwebui': {
            apiStreaming: $('#streaming_textgenerationwebui_block'),
            apiSettings: $('#textgenerationwebui_api-settings'),
            apiConnector: $('#textgenerationwebui_api'),
            apiPresets: $('#textgenerationwebui_api-presets'),
            apiRanges: $('#range_block_textgenerationwebui'),
            maxContextElem: $('#max_context_block'),
            amountGenElem: $('#amount_gen_block'),
        },
        'novel': {
            apiStreaming: $('#streaming_novel_block'),
            apiSettings: $('#novel_api-settings'),
            apiConnector: $('#novel_api'),
            apiPresets: $('#novel_api-presets'),
            apiRanges: $('#range_block_novel'),
            maxContextElem: $('#max_context_block'),
            amountGenElem: $('#amount_gen_block'),
        },
        'openai': {
            apiStreaming: $('#NULL_SELECTOR'),
            apiSettings: $('#openai_settings'),
            apiConnector: $('#openai_api'),
            apiPresets: $('#openai_api-presets'),
            apiRanges: $('#range_block_openai'),
            maxContextElem: $('#max_context_block'),
            amountGenElem: $('#amount_gen_block'),
        },
    };
    //console.log('--- apiElements--- ');
    //console.log(apiElements);

    //first, disable everything so the old elements stop showing
    for (const apiName in apiElements) {
        const apiObj = apiElements[apiName];
        //do not hide items to then proceed to immediately show them.
        if (selectedVal === apiName) {
            continue;
        }
        apiObj.apiSettings.css('display', 'none');
        apiObj.apiConnector.css('display', 'none');
        apiObj.apiRanges.css('display', 'none');
        apiObj.apiPresets.css('display', 'none');
        apiObj.apiStreaming.css('display', 'none');
    }

    //then, find and enable the active item.
    //This is split out of the loop so that different apis can share settings divs
    let activeItem = apiElements[selectedVal];

    activeItem.apiStreaming.css('display', 'block');
    activeItem.apiSettings.css('display', 'block');
    activeItem.apiConnector.css('display', 'block');
    activeItem.apiRanges.css('display', 'block');
    activeItem.apiPresets.css('display', 'block');

    if (selectedVal === 'openai') {
        activeItem.apiPresets.css('display', 'flex');
    }

    if (selectedVal === 'textgenerationwebui' || selectedVal === 'novel') {
        console.debug('enabling amount_gen for ooba/novel');
        activeItem.amountGenElem.find('input').prop('disabled', false);
        activeItem.amountGenElem.css('opacity', 1.0);
    }

    //custom because streaming has been moved up under response tokens, which exists inside common settings block
    if (selectedVal === 'novel') {
        $('#ai_module_block_novel').css('display', 'block');
    } else {
        $('#ai_module_block_novel').css('display', 'none');
    }

    $('#prompt_cost_block').toggle(selectedVal === 'textgenerationwebui');

    // Hide common settings for OpenAI
    console.debug('value?', selectedVal);
    if (selectedVal == 'openai') {
        console.debug('hiding settings?');
        $('#common-gen-settings-block').css('display', 'none');
    } else {
        $('#common-gen-settings-block').css('display', 'block');
    }

    main_api = selectedVal;
    setOnlineStatus('no_connection');

    if (main_api == 'koboldhorde') {
        getStatusHorde();
        getHordeModels(true);
    }
    validateDisabledSamplers();
    setupChatCompletionPromptManager(oai_settings);
    forceCharacterEditorTokenize();
}

export function setUserName(value, { toastPersonaNameChange = true } = {}) {
    name1 = value;
    if (name1 === undefined || name1 == '')
        name1 = default_user_name;
    console.log(`用户名已更新为 ${name1}`);
    $('#your_name').text(name1);
    if (toastPersonaNameChange && power_user.persona_show_notifications && !isPersonaPanelOpen()) {
        toastr.success(t`之后发送的消息将以 ${name1} 的身份显示`, t`人设已切换`);
    }
    queueGlobalSettingsSave();
}

async function doOnboarding(avatarId) {
    const template = $('#onboarding_template .onboarding').clone(true, true);
    let userName = await callGenericPopup(template, POPUP_TYPE.INPUT, currentUser?.name || name1, { rows: 2, wider: true, cancelButton: false });

    if (userName) {
        userName = String(userName).replace('\n', ' ');
        setUserName(userName);
        console.log(`Binding persona ${avatarId} to name ${userName}`);
        power_user.personas[avatarId] = userName;
        power_user.persona_descriptions[avatarId] = {
            description: '',
            position: persona_description_positions.IN_PROMPT,
        };
    }
}

function reloadLoop() {
    const MAX_RELOADS = 5;
    let reloads = Number(sessionStorage.getItem('reloads') || 0);
    if (reloads < MAX_RELOADS) {
        reloads++;
        sessionStorage.setItem('reloads', String(reloads));
        window.location.reload();
    }
}

//MARK: getSettings()
///////////////////////////////////////////
export async function getSettings() {
    const response = await fetch('/api/settings/get', {
        method: 'POST',
        headers: getRequestHeaders(),
        body: JSON.stringify({}),
        cache: 'no-cache',
    });

    if (!response.ok) {
        reloadLoop();
        toastr.error(t`多次尝试后仍无法加载设置，请稍后再试。`);
        throw new Error('获取设置时出错');
    }

    const data = await response.json();
    if (data.result != 'file not find' && data.settings) {
        settings = JSON.parse(data.settings);
        if (settings.username !== undefined && settings.username !== '') {
            name1 = settings.username;
            $('#your_name').text(name1);
        }

        accountStorage.init(settings?.accountStorage);
        await setUserControls(data.enable_accounts);

        // Allow subscribers to mutate settings
        await eventSource.emit(event_types.SETTINGS_LOADED_BEFORE, settings);

        //Load AI model config settings
        amount_gen = settings.amount_gen;
        if (settings.max_context !== undefined)
            max_context = parseInt(settings.max_context);

        swipes = settings.swipes !== undefined ? !!settings.swipes : true;  // enable swipes by default
        $('#swipes-checkbox').prop('checked', swipes); /// swipecode
        hideSwipeButtons();
        showSwipeButtons();

        // Kobold
        loadKoboldSettings(data, settings.kai_settings ?? settings, settings);

        // Novel
        loadNovelSettings(data, settings.nai_settings ?? settings);

        // TextGen
        loadTextGenSettings(data, settings);

        // OpenAI
        loadOpenAISettings(data, settings.oai_settings ?? settings);

        // Horde
        loadHordeSettings(settings);

        // Load power user settings
        await loadPowerUserSettings(settings, data);
        hydrateSmartThemeDefaults(true);

        // Apply theme toggles from power user settings
        applyPowerUserSettings();

        // Load character tags
        loadTagsSettings(settings);

        // Load background
        loadBackgroundSettings(settings);

        // Load proxy presets
        loadProxyPresets(settings);

        // Allow subscribers to mutate settings
        await eventSource.emit(event_types.SETTINGS_LOADED_AFTER, settings);

        // Set context size after loading power user (may override the max value)
        $('#max_context').val(max_context);
        $('#max_context_counter').val(max_context);

        $('#amount_gen').val(amount_gen);
        $('#amount_gen_counter').val(amount_gen);

        //Load which API we are using
        if (settings.main_api == undefined) {
            settings.main_api = 'openai';
        }

        if (settings.main_api == 'poe') {
            settings.main_api = 'openai';
        }

        main_api = settings.main_api;
        $('#main_api').val(main_api);
        $(`#main_api option[value=${main_api}]`).attr('selected', 'true');
        changeMainAPI();

        //Load User's Name and Avatar
        initUserAvatar(settings.user_avatar);
        setPersonaDescription();

        //Load the active character and group
        active_character = settings.active_character;
        active_group = settings.active_group;

        setWorldInfoSettings(settings.world_info_settings ?? settings, data);

        selected_button = settings.selected_button;

        if (data.enable_extensions) {
            const enableAutoUpdate = Boolean(data.enable_extensions_auto_update);
            const isVersionChanged = settings.currentVersion !== currentVersion;
            await loadExtensionSettings(settings, isVersionChanged, enableAutoUpdate);
            await eventSource.emit(event_types.EXTENSION_SETTINGS_LOADED);
        }

        firstRun = !!settings.firstRun;

        if (firstRun) {
            hideLoader();
            await doOnboarding(user_avatar);
            firstRun = false;
        }
    }
    await validateDisabledSamplers();
    settingsReady = true;
    await eventSource.emit(event_types.SETTINGS_LOADED);
}

//MARK: saveSettings()
export async function saveSettings(loopCounter = 0) {
    if (!settingsReady) {
        console.warn('Settings not ready, scheduling another save');
        saveSettingsDebounced();
        return;
    }

    const MAX_RETRIES = 3;
    if (TempResponseLength.isCustomized()) {
        if (loopCounter < MAX_RETRIES) {
            console.warn('Response length is currently being overridden, scheduling another save');
            saveSettingsDebounced(++loopCounter);
            return;
        }
        console.error('Response length is currently being overridden, but the save loop has reached the maximum number of retries');
        TempResponseLength.restore(null);
    }

    const payload = {
        firstRun: firstRun,
        accountStorage: accountStorage.getState(),
        currentVersion: currentVersion,
        username: name1,
        active_character: active_character,
        active_group: active_group,
        user_avatar: user_avatar,
        amount_gen: amount_gen,
        max_context: max_context,
        main_api: main_api,
        world_info_settings: getWorldInfoSettings(),
        textgenerationwebui_settings: textgen_settings,
        swipes: swipes,
        horde_settings: horde_settings,
        power_user: power_user,
        extension_settings: extension_settings,
        tags: tags,
        tag_map: tag_map,
        nai_settings: nai_settings,
        kai_settings: kai_settings,
        oai_settings: oai_settings,
        background: background_settings,
        proxies: proxies,
        selected_proxy: selected_proxy,
    };

    try {
        const result = await fetch('/api/settings/save', {
            method: 'POST',
            headers: getRequestHeaders(),
            body: JSON.stringify(payload),
            cache: 'no-cache',
        });

        if (!result.ok) {
            throw new Error(`Failed to save settings: ${result.statusText}`);
        }

        settings = payload;
        await eventSource.emit(event_types.SETTINGS_UPDATED);
    } catch (error) {
        console.error('Error saving settings:', error);
        toastr.error(t`请检查服务器连接并重新加载页面以防数据丢失。`, t`设置无法保存`);
    }
}

/**
 * Sets the generation parameters from a preset object.
 * @param {{ genamt?: number, max_length?: number }} preset Preset object
 */
export function setGenerationParamsFromPreset(preset) {
    const needsUnlock = (preset.max_length ?? max_context) > MAX_CONTEXT_DEFAULT || (preset.genamt ?? amount_gen) > MAX_RESPONSE_DEFAULT;
    $('#max_context_unlocked').prop('checked', needsUnlock).trigger('change');

    if (preset.genamt !== undefined) {
        amount_gen = preset.genamt;
        $('#amount_gen').val(amount_gen);
        $('#amount_gen_counter').val(amount_gen);
    }

    if (preset.max_length !== undefined) {
        max_context = preset.max_length;
        $('#max_context').val(max_context);
        $('#max_context_counter').val(max_context);
    }
}

// Common code for message editor done and auto-save
function updateMessage(div) {
    const mesBlock = div.closest('.mes_block');
    let text = mesBlock.find('.edit_textarea').val()
        ?? mesBlock.find('.mes_text').text();
    const mesElement = div.closest('.mes');
    const mes = chat[mesElement.attr('mesid')];

    let regexPlacement;
    if (mes.is_user) {
        regexPlacement = regex_placement.USER_INPUT;
    } else if (mes.extra?.type === 'narrator') {
        regexPlacement = regex_placement.SLASH_COMMAND;
    } else {
        regexPlacement = regex_placement.AI_OUTPUT;
    }

    // Ignore character override if sent as system
    text = getRegexedString(
        text,
        regexPlacement,
        {
            characterOverride: mes.extra?.type === 'narrator' ? undefined : mes.name,
            isEdit: true,
        },
    );


    if (power_user.trim_spaces) {
        text = text.trim();
    }

    const bias = substituteParams(extractMessageBias(text));
    text = substituteParams(text);
    if (bias) {
        text = removeMacros(text);
    }
    mes['mes'] = text;
    if (mes['swipe_id'] !== undefined) {
        mes['swipes'][mes['swipe_id']] = text;
    }

    // editing old messages
    if (!mes.extra) {
        mes.extra = {};
    }

    if (mes.is_system || mes.is_user || mes.extra.type === system_message_types.NARRATOR) {
        mes.extra.bias = bias ?? null;
    } else {
        mes.extra.bias = null;
    }

    chat_metadata['tainted'] = true;

    return { mesBlock, text, mes, bias };
}

function openMessageDelete(fromSlashCommand) {
    closeMessageEditor();
    hideSwipeButtons();
    if (fromSlashCommand || (!is_send_press) || (selected_group && !is_group_generating)) {
        $('#dialogue_del_mes').css('display', 'block');
        $('#send_form').css('display', 'none');
        $('.del_checkbox').each(function () {
            $(this).css('display', 'grid');
            $(this).parent().children('.for_checkbox').css('display', 'none');
        });
    } else {
        console.debug(`
            ERR -- could not enter del mode
            this_chid: ${this_chid}
            is_send_press: ${is_send_press}
            selected_group: ${selected_group}
            is_group_generating: ${is_group_generating}`);
    }
    this_del_mes = -1;
    is_delete_mode = true;
}

function messageEditAuto(div) {
    const { mesBlock, text, mes, bias } = updateMessage(div);

    mesBlock.find('.mes_text').val('');
    mesBlock.find('.mes_text').val(messageFormatting(
        text,
        this_edit_mes_chname,
        mes.is_system,
        mes.is_user,
        this_edit_mes_id,
        {},
        false,
    ));
    mesBlock.find('.mes_bias').empty();
    mesBlock.find('.mes_bias').append(messageFormatting(bias, '', false, false, -1, {}, false));
    saveChatDebounced();
}

async function messageEditDone(div) {
    let { mesBlock, text, mes, bias } = updateMessage(div);
    if (this_edit_mes_id == 0) {
        text = substituteParams(text);
    }

    await eventSource.emit(event_types.MESSAGE_EDITED, this_edit_mes_id);
    text = chat[this_edit_mes_id]?.mes ?? text;
    mesBlock.find('.mes_text').empty();
    mesBlock.find('.mes_edit_buttons').css('display', 'none');
    mesBlock.find('.mes_buttons').css('display', '');
    mesBlock.find('.mes_text').append(
        messageFormatting(
            text,
            this_edit_mes_chname,
            mes.is_system,
            mes.is_user,
            this_edit_mes_id,
            {},
            false,
        ),
    );
    mesBlock.find('.mes_bias').empty();
    mesBlock.find('.mes_bias').append(messageFormatting(bias, '', false, false, -1, {}, false));
    appendMediaToMessage(mes, div.closest('.mes'));
    addCopyToCodeBlocks(div.closest('.mes'));

    const reasoningEditDone = mesBlock.find('.mes_reasoning_edit_done:visible');
    if (reasoningEditDone.length > 0) {
        reasoningEditDone.trigger('click');
    }

    await eventSource.emit(event_types.MESSAGE_UPDATED, this_edit_mes_id);
    this_edit_mes_id = undefined;
    await saveChatConditional();
}

/**
 * Fetches the chat content for each chat file from the server and compiles them into a dictionary.
 * The function iterates over a provided list of chat metadata and requests the actual chat content
 * for each chat, either as an individual chat or a group chat based on the context.
 *
 * @param {Array} data - An array containing metadata about each chat such as file_name.
 * @param {boolean} isGroupChat - A flag indicating if the chat is a group chat.
 * @returns {Promise<Object>} chat_dict - A dictionary where each key is a file_name and the value is the
 * corresponding chat content fetched from the server.
 */
export async function getChatsFromFiles(data, isGroupChat) {
    const context = getContext();
    let chat_dict = {};
    let chat_list = Object.values(data).sort((a, b) => a['file_name'].localeCompare(b['file_name'])).reverse();

    let chat_promise = chat_list.map(({ file_name }) => {
        return new Promise(async (res, rej) => {
            try {
                const endpoint = isGroupChat ? '/api/chats/group/get' : '/api/chats/get';
                const requestBody = isGroupChat
                    ? JSON.stringify({ id: file_name })
                    : JSON.stringify({
                        ch_name: characters[context.characterId].name,
                        file_name: file_name.replace('.jsonl', ''),
                        avatar_url: characters[context.characterId].avatar,
                    });

                const chatResponse = await fetch(endpoint, {
                    method: 'POST',
                    headers: getRequestHeaders(),
                    body: requestBody,
                    cache: 'no-cache',
                });

                if (!chatResponse.ok) {
                    return res();
                    // continue;
                }

                const currentChat = await chatResponse.json();
                if (!isGroupChat) {
                    // remove the first message, which is metadata, only for individual chats
                    currentChat.shift();
                }
                chat_dict[file_name] = currentChat;

            } catch (error) {
                console.error(error);
            }

            return res();
        });
    });

    await Promise.all(chat_promise);

    return chat_dict;
}

/**
 * Fetches the metadata of all past chats related to a specific character based on its avatar URL.
 * The function sends a POST request to the server to retrieve all chats for the character. It then
 * processes the received data, sorts it by the file name, and returns the sorted data.
 *
 * @param {null|number} [characterId=null] - When set, the function will use this character id instead of this_chid.
 *
 * @returns {Promise<Array>} - An array containing metadata of all past chats of the character, sorted
 * in descending order by file name. Returns an empty array if the fetch request is unsuccessful or the
 * response is an object with an `error` property set to `true`.
 */
export async function getPastCharacterChats(characterId = null) {
    characterId = characterId ?? parseInt(this_chid);
    if (!characters[characterId]) return [];

    const response = await fetch('/api/characters/chats', {
        method: 'POST',
        body: JSON.stringify({ avatar_url: characters[characterId].avatar }),
        headers: getRequestHeaders(),
    });

    if (!response.ok) {
        return [];
    }

    const data = await response.json();
    if (typeof data === 'object' && data.error === true) {
        return [];
    }

    const chats = Object.values(data);
    return chats.sort((a, b) => a['file_name'].localeCompare(b['file_name'])).reverse();
}

/**
 * Helper for `displayPastChats`, to make the same info consistently available for other functions
 */
export function getCurrentChatDetails() {
    if (!characters[this_chid] && !selected_group) {
        return { sessionName: '', group: null, characterName: '', avatarImgURL: '' };
    }

    const group = selected_group ? groups.find(x => x.id === selected_group) : null;
    const currentChat = selected_group ? group?.chat_id : characters[this_chid]['chat'];
    const displayName = selected_group ? group?.name : characters[this_chid].name;
    const avatarImg = selected_group ? group?.avatar_url : getThumbnailUrl('avatar', characters[this_chid]['avatar']);
    return { sessionName: currentChat, group: group, characterName: displayName, avatarImgURL: avatarImg };
}

/**
 * Displays the past chats for a character or a group based on the selected context.
 * The function first fetches the chats, processes them, and then displays them in
 * the HTML. It also has a built-in search functionality that allows filtering the
 * displayed chats based on a search query.
 */
export async function displayPastChats() {
    $('#select_chat_div').empty();
    $('#select_chat_search').val('').off('input');

    const chatDetails = getCurrentChatDetails();
    const currentChat = chatDetails.sessionName;
    const displayName = chatDetails.characterName;
    const avatarImg = chatDetails.avatarImgURL;

    await displayChats('', currentChat, displayName, avatarImg, selected_group);

    const debouncedDisplay = debounce((searchQuery) => {
        displayChats(searchQuery, currentChat, displayName, avatarImg, selected_group);
    });

    // Define the search input listener
    $('#select_chat_search').on('input', function () {
        const searchQuery = $(this).val();
        debouncedDisplay(searchQuery);
    });

    // UX convenience: Focus the search field when the Manage Chat Files view opens.
    setTimeout(function () {
        const textSearchElement = $('#select_chat_search');
        textSearchElement.trigger('click').trigger('focus').trigger('select');
    }, 200);
}

async function displayChats(searchQuery, currentChat, displayName, avatarImg, selected_group) {
    try {
        const trimExtension = (fileName) => String(fileName).replace('.jsonl', '');

        const response = await fetch('/api/chats/search', {
            method: 'POST',
            headers: getRequestHeaders(),
            body: JSON.stringify({
                query: searchQuery,
                avatar_url: selected_group ? null : characters[this_chid].avatar,
                group_id: selected_group || null,
            }),
        });

        if (!response.ok) {
            throw new Error('搜索失败');
        }

        const filteredData = await response.json();
        $('#select_chat_div').empty();

        filteredData.sort((a, b) => sortMoments(timestampToMoment(a.last_mes), timestampToMoment(b.last_mes)));

        for (const chat of filteredData) {
            const isSelected = trimExtension(currentChat) === trimExtension(chat.file_name);
            const template = $('#past_chat_template .select_chat_block_wrapper').clone();
            template.find('.select_chat_block').attr('file_name', chat.file_name);
            template.find('.avatar img').attr('src', avatarImg);
            template.find('.select_chat_block_filename').text(chat.file_name);
            template.find('.chat_file_size').text(`(${chat.file_size},`);
            template.find('.chat_messages_num').text(`${chat.message_count} 💬)`);
            template.find('.select_chat_block_mes').text(chat.preview_message);
            template.find('.PastChat_cross').attr('file_name', chat.file_name);
            template.find('.chat_messages_date').text(timestampToMoment(chat.last_mes).format('lll'));

            if (isSelected) {
                template.find('.select_chat_block').attr('highlight', String(true));
            }

            $('#select_chat_div').append(template);
        }
    } catch (error) {
        console.error('Error loading chats:', error);
        toastr.error('Could not load chat data. Try reloading the page.');
    }
}

export function selectRightMenuWithAnimation(selectedMenuId) {
    const displayModes = {
        'rm_group_chats_block': 'flex',
        'rm_api_block': 'grid',
        'rm_characters_block': 'flex',
    };
    $('#result_info').toggle(selectedMenuId === 'rm_ch_create_block');
    document.querySelectorAll('#right-nav-panel .right_menu').forEach((menu) => {
        $(menu).css('display', 'none');

        if (selectedMenuId && selectedMenuId.replace('#', '') === menu.id) {
            const mode = displayModes[menu.id] ?? 'block';
            $(menu).css('display', mode);
            $(menu).css('opacity', 0.0);
            $(menu).transition({
                opacity: 1.0,
                duration: animation_duration,
                easing: animation_easing,
                complete: function () { },
            });
        }
    });
}

export function select_rm_info(type, charId, previousCharId = null) {
    if (!type) {
        toastr.error(t`无效流程（缺少 type）。`);
        return;
    }
    if (type !== 'group_create') {
        var displayName = String(charId).replace('.png', '');
    }

    if (type === 'char_delete') {
        toastr.warning(t`已删除角色：${displayName}`);
    }
    if (type === 'char_create') {
        toastr.success(t`已创建角色：${displayName}`);
    }
    if (type === 'group_create') {
        toastr.success(t`已创建群组`);
    }
    if (type === 'group_delete') {
        toastr.warning(t`已删除群组`);
    }

    if (type === 'char_import') {
        toastr.success(t`已导入角色：${displayName}`);
    }

    selectRightMenuWithAnimation('rm_characters_block');

    // Set a timeout so multiple flashes don't overlap
    clearTimeout(importFlashTimeout);
    importFlashTimeout = setTimeout(function () {
        if (type === 'char_import' || type === 'char_create' || type === 'char_import_no_toast') {
            // Find the page at which the character is located
            const avatarFileName = charId;
            const charData = getEntitiesList({ doFilter: true });
            const charIndex = charData.findIndex((x) => x?.item?.avatar?.startsWith(avatarFileName));

            if (charIndex === -1) {
                console.log(`Could not find character ${charId} in the list`);
                return;
            }

            try {
                const perPage = Number(accountStorage.getItem('Characters_PerPage')) || per_page_default;
                const page = Math.floor(charIndex / perPage) + 1;
                const characterEntity = charData[charIndex];
                const characterNumericId = characterEntity?.id;
                $('#rm_print_characters_pagination').pagination('go', page);

                waitUntilCondition(() => {
                    if (characterNumericId === undefined) {
                        return false;
                    }
                    if (hasCharacterCardInVirtualList(characterNumericId)) {
                        return true;
                    }
                    return document.getElementById(`CharID${characterNumericId}`) !== null;
                }).then(async () => {
                    if (characterNumericId === undefined) {
                        return;
                    }
                    const domElement = await ensureCharacterCardVisible(characterNumericId, { align: 'center', timeout: 1000 });
                    const element = domElement ? $(domElement) : $(document.getElementById(`CharID${characterNumericId}`));

                    if (!element.length) {
                        console.log(`Could not find element for character ${charId}`);
                        return;
                    }

                    const container = element.parent();
                    if (!container.length) {
                        return;
                    }

                    const parentOffset = container.offset()?.top ?? 0;
                    const elementOffset = element.offset()?.top ?? parentOffset;
                    container.scrollTop(container.scrollTop() + elementOffset - parentOffset);
                    flashHighlight(element, 5000);
                }).catch(console.error);
            } catch (e) {
                console.error(e);
            }
        }

        if (type === 'group_create') {
            // Find the page at which the character is located
            const charData = getEntitiesList({ doFilter: true });
            const charIndex = charData.findIndex((x) => String(x?.item?.id) === String(charId));

            if (charIndex === -1) {
                console.log(`Could not find group ${charId} in the list`);
                return;
            }

            const perPage = Number(accountStorage.getItem('Characters_PerPage')) || per_page_default;
            const page = Math.floor(charIndex / perPage) + 1;
            $('#rm_print_characters_pagination').pagination('go', page);
            try {
                waitUntilCondition(() => {
                    if (charId === undefined || charId === null) {
                        return false;
                    }
                    if (hasGroupCardInVirtualList(charId)) {
                        return true;
                    }
                    const escapedGrid = (typeof CSS !== 'undefined' && typeof CSS.escape === 'function')
                        ? CSS.escape(String(charId))
                        : String(charId).replace(/"/g, '\\"');
                    return document.querySelector(`#rm_print_characters_block [grid="${escapedGrid}"]`) !== null;
                }).then(async () => {
                    const domElement = await ensureGroupCardVisible(charId, { align: 'center', timeout: 1000 });
                    let element = domElement ? $(domElement) : $();
                    if (!element.length) {
                        const escapedGrid = (typeof CSS !== 'undefined' && typeof CSS.escape === 'function')
                            ? CSS.escape(String(charId))
                            : String(charId).replace(/"/g, '\\"');
                        element = $(`#rm_print_characters_block [grid="${escapedGrid}"]`);
                    }
                    if (!element.length) {
                        return;
                    }
                    const container = element.parent();
                    if (!container.length) {
                        return;
                    }
                    const parentOffset = container.offset()?.top ?? 0;
                    const elementOffset = element.offset()?.top ?? parentOffset;
                    container.scrollTop(container.scrollTop() + elementOffset - parentOffset);
                    flashHighlight(element, 5000);
                }).catch(console.error);
            } catch (e) {
                console.error(e);
            }
        }
    }, 250);

    if (previousCharId) {
        const newId = characters.findIndex((x) => x.avatar == previousCharId);
        if (newId >= 0) {
            setCharacterId(newId);
        }
    }
}

/**
 * Selects the right menu for displaying the character editor.
 * @param {number|string} chid Character array index
 * @param {object} [param1] Options for the switch
 * @param {boolean} [param1.switchMenu=true] Whether to switch the menu
 */
export function select_selected_character(chid, { switchMenu = true } = {}) {
    //character select
    //console.log('select_selected_character() -- starting with input of -- ' + chid + ' (name:' + characters[chid].name + ')');
    select_rm_create({ switchMenu });
    switchMenu && setMenuType('character_edit');
    $('#delete_button').css('display', 'flex');
    $('#export_button').css('display', 'flex');

    //create text poles
    $('#rm_button_back').css('display', 'none');
    //$("#character_import_button").css("display", "none");
    $('#create_button').attr('value', 'Save');              // what is the use case for this?
    $('#dupe_button').show();
    $('#create_button_label').css('display', 'none');
    $('#char_connections_button').show();

    // Hide the chat scenario button if we're peeking the group member defs
    $('#set_chat_scenario').toggle(!selected_group);

    // Don't update the navbar name if we're peeking the group member defs
    if (!selected_group) {
        $('#rm_button_selected_ch').children('h2').text(characters[chid].name);
    }

    $('#add_avatar_button').val('');

    $('#character_popup-button-h3').text(characters[chid].name);
    $('#character_name_pole').val(characters[chid].name);
    $('#description_textarea').val(characters[chid].description);
    $('#character_world').val(characters[chid].data?.extensions?.world || '');
    const currentCreatorNotes = characters[chid].data?.creator_notes || characters[chid].creatorcomment;
    $('#creator_notes_textarea').val(currentCreatorNotes);
    $('#creator_notes_spoiler').html(formatCreatorNotes(currentCreatorNotes, characters[chid].avatar));
    updateCharacterCardDescription(chid, currentCreatorNotes);
    $('#character_version_textarea').val(characters[chid].data?.character_version || '');
    $('#system_prompt_textarea').val(characters[chid].data?.system_prompt || '');
    $('#post_history_instructions_textarea').val(characters[chid].data?.post_history_instructions || '');
    $('#tags_textarea').val(Array.isArray(characters[chid].data?.tags) ? characters[chid].data.tags.join(', ') : '');
    $('#creator_textarea').val(characters[chid].data?.creator);
    $('#character_version_textarea').val(characters[chid].data?.character_version || '');
    $('#personality_textarea').val(characters[chid].personality);
    $('#firstmessage_textarea').val(characters[chid].first_mes);
    $('#scenario_pole').val(characters[chid].scenario);
    $('#depth_prompt_prompt').val(characters[chid].data?.extensions?.depth_prompt?.prompt ?? '');
    $('#depth_prompt_depth').val(characters[chid].data?.extensions?.depth_prompt?.depth ?? depth_prompt_depth_default);
    $('#depth_prompt_role').val(characters[chid].data?.extensions?.depth_prompt?.role ?? depth_prompt_role_default);
    $('#talkativeness_slider').val(characters[chid].talkativeness || talkativeness_default);
    $('#mes_example_textarea').val(characters[chid].mes_example);
    $('#selected_chat_pole').val(characters[chid].chat);
    $('#create_date_pole').val(characters[chid].create_date);
    $('#avatar_url_pole').val(characters[chid].avatar);
    $('#chat_import_avatar_url').val(characters[chid].avatar);
    $('#chat_import_character_name').val(characters[chid].name);
    $('#character_json_data').val(characters[chid].json_data);

    updateFavButtonState(characters[chid].fav || characters[chid].fav == 'true');

    const avatarUrl = characters[chid].avatar != 'none' ? getThumbnailUrl('avatar', characters[chid].avatar) : default_avatar;
    $('#avatar_load_preview').attr('src', avatarUrl);
    $('.open_alternate_greetings').data('chid', chid);
    $('#set_character_world').data('chid', chid);
    setWorldInfoButtonClass(chid);
    checkEmbeddedWorld(chid);

    $('#name_div').removeClass('displayBlock');
    $('#name_div').addClass('displayNone');
    $('#renameCharButton').css('display', '');

    $('#form_create').attr('actiontype', 'editcharacter');
    $('.form_create_bottom_buttons_block .chat_lorebook_button').show();

    const externalMediaState = isExternalMediaAllowed();
    $('#character_open_media_overrides').toggle(!selected_group);
    $('#character_media_allowed_icon').toggle(externalMediaState);
    $('#character_media_forbidden_icon').toggle(!externalMediaState);

    queueGlobalSettingsSave();
}

/**
 * Selects the right menu for creating a new character.
 * @param {object} [options] Options for the switch
 * @param {boolean} [options.switchMenu=true] Whether to switch the menu
 */
function select_rm_create({ switchMenu = true } = {}) {
    switchMenu && setMenuType('create');

    //console.log('select_rm_Create() -- selected button: '+selected_button);
    if (selected_button == 'create' && create_save.avatar) {
        const addAvatarInput = /** @type {HTMLInputElement} */ ($('#add_avatar_button').get(0));
        addAvatarInput.files = create_save.avatar;
        read_avatar_load(addAvatarInput);
    }

    switchMenu && selectRightMenuWithAnimation('rm_ch_create_block');

    $('#set_chat_scenario').hide();
    $('#delete_button_div').css('display', 'none');
    $('#delete_button').css('display', 'none');
    $('#export_button').css('display', 'none');
    $('#create_button_label').css('display', '');
    $('#create_button').attr('value', 'Create');
    $('#dupe_button').hide();
    $('#char_connections_button').hide();

    //create text poles
    $('#rm_button_back').css('display', '');
    $('#character_import_button').css('display', '');
    $('#character_popup-button-h3').text('Create character');
    $('#character_name_pole').val(create_save.name);
    $('#description_textarea').val(create_save.description);
    $('#character_world').val(create_save.world);
    $('#creator_notes_textarea').val(create_save.creator_notes);
    $('#creator_notes_spoiler').html(formatCreatorNotes(create_save.creator_notes, ''));
    $('#post_history_instructions_textarea').val(create_save.post_history_instructions);
    $('#system_prompt_textarea').val(create_save.system_prompt);
    $('#tags_textarea').val(create_save.tags);
    $('#creator_textarea').val(create_save.creator);
    $('#character_version_textarea').val(create_save.character_version);
    $('#personality_textarea').val(create_save.personality);
    $('#firstmessage_textarea').val(create_save.first_message);
    $('#talkativeness_slider').val(create_save.talkativeness);
    $('#scenario_pole').val(create_save.scenario);
    $('#depth_prompt_prompt').val(create_save.depth_prompt_prompt);
    $('#depth_prompt_depth').val(create_save.depth_prompt_depth);
    $('#depth_prompt_role').val(create_save.depth_prompt_role);
    $('#mes_example_textarea').val(create_save.mes_example);
    $('#character_json_data').val('');
    $('#avatar_div').css('display', 'flex');
    $('#avatar_load_preview').attr('src', default_avatar);
    $('#renameCharButton').css('display', 'none');
    $('#name_div').removeClass('displayNone');
    $('#name_div').addClass('displayBlock');
    $('.open_alternate_greetings').data('chid', -1);
    $('#set_character_world').data('chid', -1);
    setWorldInfoButtonClass(undefined, !!create_save.world);
    updateFavButtonState(false);
    checkEmbeddedWorld();

    $('#form_create').attr('actiontype', 'createcharacter');
    $('.form_create_bottom_buttons_block .chat_lorebook_button').hide();
    $('#character_open_media_overrides').hide();
}

function select_rm_characters() {
    const doFullRefresh = menu_type === 'characters';
    setMenuType('characters');
    selectRightMenuWithAnimation('rm_characters_block');
    schedulePanelTask('panel:characters', () => {
        if (menu_type !== 'characters') {
            return;
        }
        return printCharacters(doFullRefresh);
    });
}

/**
 * Sets a prompt injection to insert custom text into any outgoing prompt. For use in UI extensions.
 * @param {string} key Prompt injection id.
 * @param {string} value Prompt injection value.
 * @param {number} position Insertion position. 0 is after story string, 1 is in-chat with custom depth.
 * @param {number} depth Insertion depth. 0 represets the last message in context. Expected values up to MAX_INJECTION_DEPTH.
 * @param {number} role Extension prompt role. Defaults to SYSTEM.
 * @param {boolean} scan Should the prompt be included in the world info scan.
 * @param {(function(): Promise<boolean>|boolean)} filter Filter function to determine if the prompt should be injected.
 */
export function setExtensionPrompt(key, value, position, depth, scan = false, role = extension_prompt_roles.SYSTEM, filter = null) {
    extension_prompts[key] = {
        value: String(value),
        position: Number(position),
        depth: Number(depth),
        scan: !!scan,
        role: Number(role ?? extension_prompt_roles.SYSTEM),
        filter: filter,
    };
}

/**
 * Gets a enum value of the extension prompt role by its name.
 * @param {string} roleName The name of the extension prompt role.
 * @returns {number} The role id of the extension prompt.
 */
export function getExtensionPromptRoleByName(roleName) {
    // If the role is already a valid number, return it
    if (typeof roleName === 'number' && Object.values(extension_prompt_roles).includes(roleName)) {
        return roleName;
    }

    switch (roleName) {
        case 'system':
            return extension_prompt_roles.SYSTEM;
        case 'user':
            return extension_prompt_roles.USER;
        case 'assistant':
            return extension_prompt_roles.ASSISTANT;
    }

    // Skill issue?
    return extension_prompt_roles.SYSTEM;
}

/**
 * Removes all char A/N prompt injections from the chat.
 * To clean up when switching from groups to solo and vice versa.
 */
export function removeDepthPrompts() {
    for (const key of Object.keys(extension_prompts)) {
        if (key.startsWith(inject_ids.DEPTH_PROMPT)) {
            delete extension_prompts[key];
        }
    }
}

/**
 * Adds or updates the metadata for the currently active chat.
 * @param {Object} newValues An object with collection of new values to be added into the metadata.
 * @param {boolean} reset Should a metadata be reset by this call.
 */
export function updateChatMetadata(newValues, reset) {
    chat_metadata = reset ? { ...newValues } : { ...chat_metadata, ...newValues };
}


/**
 * Updates the state of the favorite button based on the provided state.
 * @param {boolean} state Whether the favorite button should be on or off.
 */
function updateFavButtonState(state) {
    // Update global state of the flag
    // TODO: This is bad and needs to be refactored.
    fav_ch_checked = state;
    $('#fav_checkbox').prop('checked', state);
    $('#favorite_button').toggleClass('fav_on', state);
    $('#favorite_button').toggleClass('fav_off', !state);
}

export async function setScenarioOverride() {
    if (!selected_group && (this_chid === undefined || !characters[this_chid])) {
        console.warn('setScenarioOverride() -- no selected group or character');
        return;
    }

    const metadataValue = chat_metadata['scenario'] || '';
    const isGroup = !!selected_group;

    const $template = $(await renderTemplateAsync('scenarioOverride'));
    $template.find('[data-group="true"]').toggle(isGroup);
    $template.find('[data-character="true"]').toggle(!isGroup);
    // TODO: Why does this save on every character input? Save on popup close
    $template.find('.chat_scenario').val(metadataValue).on('input', onScenarioOverrideInput);
    $template.find('.remove_scenario_override').on('click', onScenarioOverrideRemoveClick);

    await callGenericPopup($template, POPUP_TYPE.TEXT, '');
}

function onScenarioOverrideInput() {
    const value = String($(this).val());
    chat_metadata['scenario'] = value;
    saveMetadataDebounced();
}

function onScenarioOverrideRemoveClick() {
    $(this).closest('.scenario_override').find('.chat_scenario').val('').trigger('input');
}

/**
 * Displays a blocking popup with a given text and type.
 * @param {JQuery<HTMLElement>|string|Element} text - Text to display in the popup.
 * @param {string} type
 * @param {string} inputValue - Value to set the input to.
 * @param {PopupOptions} options - Options for the popup.
 * @typedef {{okButton?: string, rows?: number, wide?: boolean, wider?: boolean, large?: boolean, allowHorizontalScrolling?: boolean, allowVerticalScrolling?: boolean, cropAspect?: number }} PopupOptions - Options for the popup.
 * @returns {Promise<any>} A promise that resolves when the popup is closed.
 * @deprecated Use `callGenericPopup` instead.
 */
export function callPopup(text, type, inputValue = '', { okButton, rows, wide, wider, large, allowHorizontalScrolling, allowVerticalScrolling, cropAspect } = {}) {
    function getOkButtonText() {
        if (['text', 'char_not_selected'].includes(popup_type)) {
            $dialoguePopupCancel.css('display', 'none');
            return okButton ?? t`确定`;
        } else if (['delete_extension'].includes(popup_type)) {
            return okButton ?? t`确定`;
        } else if (['new_chat', 'confirm'].includes(popup_type)) {
            return okButton ?? t`是`;
        } else if (['input'].includes(popup_type)) {
            return okButton ?? t`保存`;
        }
        return okButton ?? t`删除`;
    }

    dialogueCloseStop = true;
    if (type) {
        popup_type = type;
    }

    const $dialoguePopup = $('#dialogue_popup');
    const $dialoguePopupCancel = $('#dialogue_popup_cancel');
    const $dialoguePopupOk = $('#dialogue_popup_ok');
    const $dialoguePopupInput = $('#dialogue_popup_input');
    const $dialoguePopupText = $('#dialogue_popup_text');
    const $shadowPopup = $('#shadow_popup');

    $dialoguePopup.toggleClass('wide_dialogue_popup', !!wide)
        .toggleClass('wider_dialogue_popup', !!wider)
        .toggleClass('large_dialogue_popup', !!large)
        .toggleClass('horizontal_scrolling_dialogue_popup', !!allowHorizontalScrolling)
        .toggleClass('vertical_scrolling_dialogue_popup', !!allowVerticalScrolling);

    $dialoguePopupCancel.css('display', 'inline-block');
    $dialoguePopupOk.text(getOkButtonText());
    $dialoguePopupInput.toggle(popup_type === 'input').val(inputValue).attr('rows', rows ?? 1);
    $dialoguePopupText.empty().append(text);
    $shadowPopup.css('display', 'block');

    if (popup_type == 'input') {
        $dialoguePopupInput.trigger('focus');
    }

    $shadowPopup.transition({
        opacity: 1,
        duration: animation_duration,
        easing: animation_easing,
    });

    return new Promise((resolve) => {
        dialogueResolve = resolve;
    });
}

export function showSwipeButtons() {
    if (chat.length === 0) {
        return;
    }

    if (
        chat[chat.length - 1].is_system ||
        !swipes ||
        Number($('.mes:last').attr('mesid')) < 0 ||
        chat[chat.length - 1].is_user ||
        (selected_group && is_group_generating)
    ) { return; }

    // swipe_id should be set if alternate greetings are added
    if (chat.length == 1 && chat[0].swipe_id === undefined) {
        return;
    }

    //had to add this to make the swipe counter work
    //(copied from the onclick functions for swipe buttons..
    //don't know why the array isn't set for non-swipe messages in Generate or addOneMessage..)
    if (chat[chat.length - 1]['swipe_id'] === undefined) {              // if there is no swipe-message in the last spot of the chat array
        chat[chat.length - 1]['swipe_id'] = 0;                        // set it to id 0
        chat[chat.length - 1]['swipes'] = [];                         // empty the array
        chat[chat.length - 1]['swipes'][0] = chat[chat.length - 1]['mes'];  //assign swipe array with last message from chat
        chat[chat.length - 1]['swipe_info'] = [];
        chat[chat.length - 1]['swipe_info'][0] = {
            'send_date': chat[chat.length - 1]['send_date'],
            'gen_started': chat[chat.length - 1]['gen_started'],
            'gen_finished': chat[chat.length - 1]['gen_finished'],
            'extra': structuredClone(chat[chat.length - 1]['extra']),
        };
    }

    const currentMessage = $('#chat').children().filter(`[mesid="${chat.length - 1}"]`);
    const swipeId = chat[chat.length - 1].swipe_id;
    const swipeCounterText = formatSwipeCounter((swipeId + 1), chat[chat.length - 1].swipes.length);
    const swipeRight = currentMessage.find('.swipe_right');
    const swipeLeft = currentMessage.find('.swipe_left');
    const swipeCounter = currentMessage.find('.swipes-counter');

    if (swipeId !== undefined && (chat[chat.length - 1].swipes.length > 1 || swipeId > 0)) {
        swipeLeft.css('display', 'flex');
    }
    //only show right when generate is off, or when next right swipe would not make a generate happen
    if (is_send_press === false || chat[chat.length - 1].swipes.length >= swipeId) {
        swipeRight.css('display', 'flex').css('opacity', '0.3');
        swipeCounter.css('opacity', '0.3');
    }
    if ((chat[chat.length - 1].swipes.length - swipeId) === 1) {
        //chevron was moved out of hardcode in HTML to class toggle dependent on last_mes or not
        //necessary for 'swipe_right' div in past messages to have no chevron if 'show swipes for all messages' is turned on
        swipeRight.css('opacity', '0.7');
        swipeCounter.css('opacity', '0.7');
    }

    //allows for writing individual swipe counters for past messages
    const lastSwipeCounter = $('.last_mes .swipes-counter');
    lastSwipeCounter.text(swipeCounterText).show();
}

export function hideSwipeButtons() {
    chatElement.find('.swipe_right').hide();
    chatElement.find('.last_mes .swipes-counter').hide();
    chatElement.find('.swipe_left').hide();
}

/**
 * Deletes a swipe from the chat.
 *
 * @param {number?} swipeId - The ID of the swipe to delete. If not provided, the current swipe will be deleted.
 * @returns {Promise<number>|undefined} - The ID of the new swipe after deletion.
 */
export async function deleteSwipe(swipeId = null) {
    if (swipeId && (isNaN(swipeId) || swipeId < 0)) {
        toastr.warning(t`无效的候选编号：${swipeId + 1}`);
        return;
    }

    const lastMessage = chat[chat.length - 1];
    if (!lastMessage || !Array.isArray(lastMessage.swipes) || !lastMessage.swipes.length) {
        toastr.warning(t`没有可删除候选的消息。`);
        return;
    }

    if (lastMessage.swipes.length <= 1) {
        toastr.warning(t`无法删除最后一个候选。`);
        return;
    }

    swipeId = swipeId ?? lastMessage.swipe_id;

    if (swipeId < 0 || swipeId >= lastMessage.swipes.length) {
        toastr.warning(t`无效的候选编号：${swipeId + 1}`);
        return;
    }

    lastMessage.swipes.splice(swipeId, 1);

    if (Array.isArray(lastMessage.swipe_info) && lastMessage.swipe_info.length) {
        lastMessage.swipe_info.splice(swipeId, 1);
    }

    // Select the next swipe, or the one before if it was the last one
    const newSwipeId = Math.min(swipeId, lastMessage.swipes.length - 1);
    syncSwipeToMes(null, newSwipeId);

    await saveChatConditional();
    await reloadCurrentChat();

    return newSwipeId;
}

export async function saveMetadata() {
    if (selected_group) {
        await editGroup(selected_group, true, false);
    }
    else {
        await saveChatConditional();
    }
}

export async function saveChatConditional() {
    try {
        await waitUntilCondition(() => !isChatSaving, DEFAULT_SAVE_EDIT_TIMEOUT, 100);
    } catch {
        console.warn('Timeout waiting for chat to save');
        return;
    }

    try {
        cancelDebouncedChatSave();

        isChatSaving = true;

        if (selected_group) {
            await saveGroupChat(selected_group, true);
        }
        else {
            await saveChat();
        }

        // Save token and prompts cache to IndexedDB storage
        saveTokenCache();
        saveItemizedPrompts(getCurrentChatId());
    } catch (error) {
        console.error('Error saving chat', error);
    } finally {
        isChatSaving = false;
    }
}

/**
 * Saves the chat to the server.
 * @param {FormData} formData Form data to send to the server.
 * @param {EventTarget} eventTarget Event target to trigger the event on.
 */
async function importCharacterChat(formData, eventTarget) {
    const fetchResult = await fetch('/api/chats/import', {
        method: 'POST',
        body: formData,
        headers: getRequestHeaders({ omitContentType: true }),
        cache: 'no-cache',
    });

    if (fetchResult.ok) {
        const data = await fetchResult.json();
        if (data.res) {
            await displayPastChats();
        }
    }

    if (eventTarget instanceof HTMLInputElement) {
        eventTarget.value = '';
    }
}

function updateViewMessageIds(startFromZero = false) {
    const mountedIds = getMountedMessageIds();
    if (!mountedIds.length) {
        return;
    }

    const baseId = startFromZero ? 0 : getFirstDisplayedMessageId();
    let offset = 0;
    const ordered = startFromZero ? mountedIds : mountedIds.slice();

    for (const mesId of ordered) {
        const element = getMessageDom(mesId);
        if (!element) {
            continue;
        }
        const targetId = startFromZero ? baseId + offset : mesId;
        offset++;
        if (Number(element.getAttribute('mesid')) !== targetId) {
            element.setAttribute('mesid', String(targetId));
            reassignMessageDomId(mesId, targetId, element);
        }
        const idDisplay = element.querySelector('.mesIDDisplay');
        if (idDisplay instanceof HTMLElement) {
            idDisplay.textContent = `#${targetId}`;
        }
    }

    forEachMountedMessage((_, element) => {
        element.classList.remove('last_mes');
    });

    const lastVisibleId = Math.max(...mountedIds);
    const lastElement = getMessageDom(lastVisibleId);
    if (lastElement) {
        lastElement.classList.add('last_mes');
    }

    updateEditArrowClasses();
}

export function getFirstDisplayedMessageId() {
    const mountedIds = getMountedMessageIds();
    if (mountedIds.length) {
        return mountedIds[0];
    }
    const fallback = Array.from(document.querySelectorAll('#chat .mes'))
        .map(el => Number(el.getAttribute('mesid')))
        .filter(Number.isFinite);
    return fallback.length ? Math.min(...fallback) : 0;
}

function updateEditArrowClasses() {
    forEachMountedMessage((_, element) => {
        element.querySelector('.mes_edit_up')?.classList.remove('disabled');
        element.querySelector('.mes_edit_down')?.classList.remove('disabled');
    });

    if (this_edit_mes_id !== undefined) {
        const currentElement = getMessageDom(this_edit_mes_id);
        if (!currentElement) {
            return;
        }
        const down = currentElement.querySelector('.mes_edit_down');
        const up = currentElement.querySelector('.mes_edit_up');
        const mountedIds = getMountedMessageIds();
        const firstId = mountedIds[0];
        const lastId = mountedIds[mountedIds.length - 1];

        if (down instanceof HTMLElement && lastId === Number(this_edit_mes_id)) {
            down.classList.add('disabled');
        }

        if (up instanceof HTMLElement && firstId === Number(this_edit_mes_id)) {
            up.classList.add('disabled');
        }
    }
}

/**
 * Closes the message editor.
 * @param {'message'|'reasoning'|'all'} what What to close. Default is 'all'.
 */
export function closeMessageEditor(what = 'all') {
    if (what === 'message' || what === 'all') {
        if (this_edit_mes_id) {
            const targetElement = getMessageDom(this_edit_mes_id);
            if (targetElement) {
                $(targetElement).find('.mes_edit_cancel').trigger('click');
            }
        }
    }
    if (what === 'reasoning' || what === 'all') {
        document.querySelectorAll('.reasoning_edit_textarea').forEach((el) => {
            const cancelButton = el.closest('.mes')?.querySelector('.mes_reasoning_edit_cancel');
            if (cancelButton instanceof HTMLElement) {
                cancelButton.click();
            }
        });
    }
}

export function setGenerationProgress(progress) {
    if (!progress) {
        $('#send_textarea').css({ 'background': '', 'transition': '' });
    }
    else {
        $('#send_textarea').css({
            'background': `linear-gradient(90deg, #008000d6 ${progress}%, transparent ${progress}%)`,
            'transition': '0.25s ease-in-out',
        });
    }
}

export function cancelTtsPlay() {
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
    }
}

function updateAlternateGreetingsHintVisibility(root) {
    const numberOfGreetings = root.find('.alternate_greetings_list .alternate_greeting').length;
    $(root).find('.alternate_grettings_hint').toggle(numberOfGreetings == 0);
}

async function openCharacterWorldPopup() {
    const chid = $('#set_character_world').data('chid');
    if (menu_type != 'create' && chid === undefined) {
        toastr.error('Does not have an Id for this character in world select menu.');
        return;
    }

    // TODO: Maybe make this utility function not use the window context?
    const fileName = getCharaFilename(chid);
    const charName = (menu_type == 'create' ? create_save.name : characters[chid]?.data?.name) || 'Nameless';
    const worldId = (menu_type == 'create' ? create_save.world : characters[chid]?.data?.extensions?.world) || '';
    const template = $('#character_world_template .character_world').clone();
    template.find('.character_name').text(charName);

    // --- Event Handlers ---
    async function handlePrimaryWorldSelect() {
        const selectedValue = $(this).val();
        const worldIndex = selectedValue !== '' ? Number(selectedValue) : NaN;
        const name = !isNaN(worldIndex) ? world_names[worldIndex] : '';
        const previousValue = $('#character_world').val();
        $('#character_world').val(name);

        console.debug('Character world selected:', name);

        if (menu_type == 'create') {
            create_save.world = name;
        } else {
            if (previousValue && !name) {
                try {
                    // Dirty hack to remove embedded lorebook from character JSON data.
                    const data = JSON.parse(String($('#character_json_data').val()));

                    if (data?.data?.character_book) {
                        data.data.character_book = undefined;
                    }

                    $('#character_json_data').val(JSON.stringify(data));
                    toastr.info(t`该角色将移除内嵌的设定集。`);
                } catch {
                    console.error('解析角色 JSON 数据失败。');
                }
            }

            await createOrEditCharacter();
        }

        setWorldInfoButtonClass(undefined, !!name);
    }

    function handleExtrasWorldSelect() {
        const selectedValues = $(this).val();
        const selectedWorlds = Array.isArray(selectedValues) ? selectedValues : [];
        let charLore = world_info.charLore ?? [];
        const tempExtraBooks = selectedWorlds.map((index) => world_names[index]).filter(Boolean);
        const existingCharIndex = charLore.findIndex((e) => e.name === fileName);

        if (menu_type == 'create') {
            create_save.extra_books = tempExtraBooks;
            return;
        }

        if (existingCharIndex === -1) {
            // Add record only if at least 1 lorebook is selected.
            if (tempExtraBooks.length > 0) {
                charLore.push({ name: fileName, extraBooks: tempExtraBooks });
            }
        } else if (tempExtraBooks.length === 0) {
            charLore.splice(existingCharIndex, 1);
        } else {
            charLore[existingCharIndex].extraBooks = tempExtraBooks;
        }

        Object.assign(world_info, { charLore: charLore });
        queueGlobalSettingsSave();
    }

    // --- Populate Dropdowns ---
    // Append to primary dropdown.
    const primarySelect = template.find('.character_world_info_selector');
    world_names.forEach((item, i) => {
        primarySelect.append(new Option(item, String(i), item === worldId, item === worldId));
    });

    // Append to extras dropdown.
    const extrasSelect = template.find('.character_extra_world_info_selector');
    const existingCharLore = world_info.charLore?.find((e) => e.name === fileName);
    world_names.forEach((item, i) => {
        const array = (menu_type == 'create' ? create_save.extra_books : existingCharLore?.extraBooks);
        const isSelected = !!array?.includes(item);
        extrasSelect.append(new Option(item, String(i), isSelected, isSelected));
    });

    const popup = new Popup(template, POPUP_TYPE.TEXT, '', {
        onOpen: function (popup) {
            const popupDialog = $(popup.dlg);

            primarySelect.on('change', handlePrimaryWorldSelect);
            extrasSelect.on('change', handleExtrasWorldSelect);

            // Not needed on mobile.
            if (!isMobile()) {
                extrasSelect.select2({
                    width: '100%',
                    placeholder: t`尚未选择额外设定集，点击此处进行选择。`,
                    allowClear: true,
                    closeOnSelect: false,
                    dropdownParent: popupDialog,
                });
            }
        },
    });

    await popup.show();
}

function openAlternateGreetings() {
    const chid = $('.open_alternate_greetings').data('chid');

    if (menu_type != 'create' && chid === undefined) {
        toastr.error('Does not have an Id for this character in editor menu.');
        return;
    } else {
        // If the character does not have alternate greetings, create an empty array
        if (characters[chid] && !Array.isArray(characters[chid].data.alternate_greetings)) {
            characters[chid].data.alternate_greetings = [];
        }
    }

    const template = $('#alternate_greetings_template .alternate_grettings').clone();
    const getArray = () => menu_type == 'create' ? create_save.alternate_greetings : characters[chid].data.alternate_greetings;
    const popup = new Popup(template, POPUP_TYPE.TEXT, '', {
        wide: true,
        large: true,
        allowVerticalScrolling: true,
        onClose: async () => {
            if (menu_type !== 'create') {
                await createOrEditCharacter();
            }
        },
    });

    for (let index = 0; index < getArray().length; index++) {
        addAlternateGreeting(template, getArray()[index], index, getArray, popup);
    }

    template.find('.add_alternate_greeting').on('click', function () {
        const array = getArray();
        const index = array.length;
        array.push('');
        addAlternateGreeting(template, '', index, getArray, popup);
        updateAlternateGreetingsHintVisibility(template);
    });

    popup.show();
    updateAlternateGreetingsHintVisibility(template);
}

/**
 * Adds an alternate greeting to the template.
 * @param {JQuery<HTMLElement>} template
 * @param {string} greeting
 * @param {number} index
 * @param {() => any[]} getArray
 * @param {Popup} popup
 */
function addAlternateGreeting(template, greeting, index, getArray, popup) {
    const greetingBlock = $('#alternate_greeting_form_template .alternate_greeting').clone();
    greetingBlock.find('.alternate_greeting_text')
        .attr('id', `alternate_greeting_${index}`)
        .on('input', async function () {
            const value = $(this).val();
            const array = getArray();
            array[index] = value;
        }).val(greeting);
    greetingBlock.find('.editor_maximize').attr('data-for', `alternate_greeting_${index}`);
    greetingBlock.find('.greeting_index').text(index + 1);
    greetingBlock.find('.delete_alternate_greeting').on('click', async function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (confirm(t`确定要删除这条备用问候语吗？`)) {
            const array = getArray();
            array.splice(index, 1);

            // We need to reopen the popup to update the index numbers
            await popup.complete(POPUP_RESULT.AFFIRMATIVE);
            openAlternateGreetings();
        }
    });
    template.find('.alternate_greetings_list').append(greetingBlock);
}

/**
 * Creates or edits a character based on the form data.
 * @param {Event} [e] Event that triggered the function call.
 */
async function createOrEditCharacter(e) {
    $('#rm_info_avatar').html('');
    const formData = new FormData(/** @type {HTMLFormElement} */($('#form_create').get(0)));
    formData.set('fav', String(fav_ch_checked));
    const isNewChat = e instanceof CustomEvent && e.type === 'newChat';

    const rawName = formData.get('ch_name');
    const characterName = typeof rawName === 'string' ? rawName.trim() : '';
    if (!characterName || characterName === '.') {
        toastr.error(t`角色名不能为空或仅为 "."。`);
        return;
    }
    formData.set('ch_name', characterName);
    $('#character_name_pole').val(characterName);

    const rawFile = formData.get('avatar');
    if (rawFile instanceof File) {
        const convertedFile = await ensureImageFormatSupported(rawFile);
        formData.set('avatar', convertedFile);
    }

    const headers = getRequestHeaders({ omitContentType: true });

    if ($('#form_create').attr('actiontype') == 'createcharacter') {
        if (String($('#character_name_pole').val()).length === 0) {
            toastr.error(t`必须填写名称`);
            return;
        }
        if (is_group_generating || is_send_press) {
            toastr.error(t`生成过程中无法创建角色，请停止请求后重试。`, t`已中止创建`);
            return;
        }
        try {
            //if the character name text area isn't empty (only posible when creating a new character)
            let url = '/api/characters/create';

            if (crop_data != undefined) {
                url += `?crop=${encodeURIComponent(JSON.stringify(crop_data))}`;
            }

            formData.delete('alternate_greetings');
            for (const value of create_save.alternate_greetings) {
                formData.append('alternate_greetings', value);
            }

            formData.append('extensions', JSON.stringify(create_save.extensions));

            const fetchResult = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: formData,
                cache: 'no-cache',
            });

            if (!fetchResult.ok) {
                throw new Error('请求结果异常');
            }

            const avatarId = await fetchResult.text();

            $('#character_cross').trigger('click'); //closes the advanced character editing popup
            const fields = [
                { id: '#character_name_pole', callback: value => create_save.name = value },
                { id: '#description_textarea', callback: value => create_save.description = value },
                { id: '#creator_notes_textarea', callback: value => create_save.creator_notes = value },
                { id: '#character_version_textarea', callback: value => create_save.character_version = value },
                { id: '#post_history_instructions_textarea', callback: value => create_save.post_history_instructions = value },
                { id: '#system_prompt_textarea', callback: value => create_save.system_prompt = value },
                { id: '#tags_textarea', callback: value => create_save.tags = value },
                { id: '#creator_textarea', callback: value => create_save.creator = value },
                { id: '#personality_textarea', callback: value => create_save.personality = value },
                { id: '#firstmessage_textarea', callback: value => create_save.first_message = value },
                { id: '#talkativeness_slider', callback: value => create_save.talkativeness = value, defaultValue: talkativeness_default },
                { id: '#scenario_pole', callback: value => create_save.scenario = value },
                { id: '#depth_prompt_prompt', callback: value => create_save.depth_prompt_prompt = value },
                { id: '#depth_prompt_depth', callback: value => create_save.depth_prompt_depth = value, defaultValue: depth_prompt_depth_default },
                { id: '#depth_prompt_role', callback: value => create_save.depth_prompt_role = value, defaultValue: depth_prompt_role_default },
                { id: '#mes_example_textarea', callback: value => create_save.mes_example = value },
                { id: '#character_json_data', callback: () => { } },
                { id: '#alternate_greetings_template', callback: value => create_save.alternate_greetings = value, defaultValue: [] },
                { id: '#character_world', callback: value => create_save.world = value },
                { id: '#_character_extensions_fake', callback: value => create_save.extensions = {} },
            ];

            fields.forEach(field => {
                const fieldValue = field.defaultValue !== undefined ? field.defaultValue : '';
                $(field.id).val(fieldValue);
                field.callback && field.callback(fieldValue);
            });

            if (Array.isArray(create_save.extra_books) && create_save.extra_books.length > 0) {
                const fileName = getCharaFilename(null, { manualAvatarKey: avatarId });
                const charLore = world_info.charLore ?? [];
                charLore.push({ name: fileName, extraBooks: create_save.extra_books });
                Object.assign(world_info, { charLore: charLore });
                queueGlobalSettingsSave();
            }
            create_save.extra_books = [];

            $('#character_popup-button-h3').text('Create character');

            create_save.avatar = null;

            $('#add_avatar_button').replaceWith(
                $('#add_avatar_button').val('').clone(true),
            );

            let oldSelectedChar = null;
            if (this_chid !== undefined) {
                oldSelectedChar = characters[this_chid].avatar;
            }

            console.log(`new avatar id: ${avatarId}`);
            createTagMapFromList('#tagList', avatarId);
            await getCharacters();

            select_rm_info('char_create', avatarId, oldSelectedChar);

            crop_data = undefined;

        } catch (error) {
            console.error('创建角色时出错', error);
            toastr.error(t`创建角色失败`);
        }
    } else {
        try {
            let url = '/api/characters/edit';

            if (crop_data != undefined) {
                url += `?crop=${encodeURIComponent(JSON.stringify(crop_data))}`;
            }

            formData.delete('alternate_greetings');
            const chid = $('.open_alternate_greetings').data('chid');
            if (characters[chid] && Array.isArray(characters[chid]?.data?.alternate_greetings)) {
                for (const value of characters[chid].data.alternate_greetings) {
                    formData.append('alternate_greetings', value);
                }
            }

            const fetchResult = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: formData,
                cache: 'no-cache',
            });

            if (!fetchResult.ok) {
                let errorMessage = '';
                try {
                    const errorText = await fetchResult.text();
                    if (errorText) {
                        try {
                            const parsed = JSON.parse(errorText);
                            errorMessage = parsed?.message || parsed?.error || parsed?.detail || '';
                        } catch {
                            errorMessage = errorText.trim();
                        }
                    }
                } catch (parseError) {
                    console.warn('Failed to read error response while updating character', parseError);
                }

                if (!errorMessage) {
                    errorMessage = `${fetchResult.status} ${fetchResult.statusText}`.trim();
                }

                throw new Error(errorMessage);
            }

            await getOneCharacter(formData.get('avatar_url'));
            favsToHotswap(); // Update fav state

            $('#add_avatar_button').replaceWith(
                $('#add_avatar_button').val('').clone(true),
            );
            $('#create_button').attr('value', 'Save');
            crop_data = undefined;
            await eventSource.emit(event_types.CHARACTER_EDITED, { detail: { id: this_chid, character: characters[this_chid] } });

            // Recreate the chat if it hasn't been used at least once (i.e. with continue).
            const message = getFirstMessage();
            const shouldRegenerateMessage =
                !isNewChat &&
                message.mes &&
                !selected_group &&
                !chat_metadata['tainted'] &&
                (chat.length === 0 || (chat.length === 1 && !chat[0].is_user && !chat[0].is_system));

            if (shouldRegenerateMessage) {
                chat.splice(0, chat.length, message);
                const messageId = (chat.length - 1);
                await eventSource.emit(event_types.MESSAGE_RECEIVED, messageId, 'first_message');
                await clearChat();
                await printMessages();
                await eventSource.emit(event_types.CHARACTER_MESSAGE_RENDERED, messageId, 'first_message');
                await saveChatConditional();
            }
        } catch (error) {
            console.error('更新角色时出错', error);
            const fallback = t`保存角色时出现问题，或者提供的图片文件格式无效，请确认图片不是 webp。`;
            const extra = error?.message && !fallback.includes(error.message) ? `\n${error.message}` : '';
            toastr.error(`${fallback}${extra}`);
        }
    }
}

/**
 * Formats a counter for a swipe view.
 * @param {number} current The current number of items.
 * @param {number} total The total number of items.
 * @returns {string} The formatted counter.
 */
function formatSwipeCounter(current, total) {
    if (isNaN(current) || isNaN(total)) {
        return '';
    }

    return `${current}\u200b/\u200b${total}`;
}

/**
 * Handles the swipe to the left event.
 * @param {JQuery.Event} _event Event.
 * @param {object} params Additional parameters.
 * @param {string} [params.source] The source of the swipe event.
 * @param {boolean} [params.repeated] Is the swipe event repeated.
 */
export function swipe_left(_event, { source, repeated } = {}) {
    if (chat.length - 1 === Number(this_edit_mes_id)) {
        closeMessageEditor();
    }
    if (isStreamingEnabled() && streamingProcessor) {
        streamingProcessor.onStopStreaming();
    }

    // Make sure ad-hoc changes to extras are saved before swiping away
    syncMesToSwipe();

    // If the user is holding down the key and we're at the first swipe, don't do anything
    if (source === 'keyboard' && repeated && chat[chat.length - 1].swipe_id === 0) {
        return;
    }

    const swipe_duration = 120;
    const swipe_range = '700px';
    chat[chat.length - 1]['swipe_id']--;

    if (chat[chat.length - 1]['swipe_id'] < 0) {
        chat[chat.length - 1]['swipe_id'] = chat[chat.length - 1]['swipes'].length - 1;
    }

    if (chat[chat.length - 1]['swipe_id'] >= 0) {
        /*$(this).parent().children('swipe_right').css('display', 'flex');
        if (chat[chat.length - 1]['swipe_id'] === 0) {
            $(this).css('display', 'none');
        }*/ // Just in case
        if (!Array.isArray(chat[chat.length - 1]['swipe_info'])) {
            chat[chat.length - 1]['swipe_info'] = [];
        }
        let this_mes_div = $(this).parent();
        let this_mes_block = $(this).parent().children('.mes_block').children('.mes_text');
        const this_mes_div_height = this_mes_div[0].scrollHeight;
        this_mes_div.css('height', this_mes_div_height);
        const this_mes_block_height = this_mes_block[0].scrollHeight;
        chat[chat.length - 1]['mes'] = chat[chat.length - 1]['swipes'][chat[chat.length - 1]['swipe_id']];
        chat[chat.length - 1]['send_date'] = chat[chat.length - 1].swipe_info[chat[chat.length - 1]['swipe_id']]?.send_date || chat[chat.length - 1].send_date; //load the last mes box with the latest generation
        chat[chat.length - 1]['extra'] = structuredClone(chat[chat.length - 1].swipe_info[chat[chat.length - 1]['swipe_id']]?.extra || chat[chat.length - 1].extra);

        if (chat[chat.length - 1].extra) {
            // if message has memory attached - remove it to allow regen
            if (chat[chat.length - 1].extra.memory) {
                delete chat[chat.length - 1].extra.memory;
            }
            // ditto for display text
            if (chat[chat.length - 1].extra.display_text) {
                delete chat[chat.length - 1].extra.display_text;
            }
        }
        $(this).parent().children('.mes_block').transition({
            x: swipe_range,
            duration: animation_duration > 0 ? swipe_duration : 0,
            easing: animation_easing,
            queue: false,
            complete: async function () {
                const is_animation_scroll = ($('#chat').scrollTop() >= ($('#chat').prop('scrollHeight') - $('#chat').outerHeight()) - 10);
                //console.log('on left swipe click calling addOneMessage');
                addOneMessage(chat[chat.length - 1], { type: 'swipe' });

                if (power_user.message_token_count_enabled) {
                    if (!chat[chat.length - 1].extra) {
                        chat[chat.length - 1].extra = {};
                    }

                    const swipeMessage = $('#chat').find(`[mesid="${chat.length - 1}"]`);
                    const tokenCountText = (chat[chat.length - 1]?.extra?.reasoning || '') + chat[chat.length - 1].mes;
                    const tokenCount = await getTokenCountAsync(tokenCountText, 0);
                    chat[chat.length - 1]['extra']['token_count'] = tokenCount;
                    swipeMessage.find('.tokenCounterDisplay').text(`${tokenCount}t`);
                }

                let new_height = this_mes_div_height - (this_mes_block_height - this_mes_block[0].scrollHeight);
                if (new_height < 103) new_height = 103;
                this_mes_div.animate({ height: new_height + 'px' }, {
                    duration: 0, //used to be 100
                    queue: false,
                    progress: function () {
                        // Scroll the chat down as the message expands

                        if (is_animation_scroll) $('#chat').scrollTop($('#chat')[0].scrollHeight);
                    },
                    complete: function () {
                        this_mes_div.css('height', 'auto');
                        // Scroll the chat down to the bottom once the animation is complete
                        if (is_animation_scroll) $('#chat').scrollTop($('#chat')[0].scrollHeight);
                    },
                });
                $(this).parent().children('.mes_block').transition({
                    x: '-' + swipe_range,
                    duration: 0,
                    easing: animation_easing,
                    queue: false,
                    complete: function () {
                        $(this).parent().children('.mes_block').transition({
                            x: '0px',
                            duration: animation_duration > 0 ? swipe_duration : 0,
                            easing: animation_easing,
                            queue: false,
                            complete: async function () {
                                appendMediaToMessage(chat[chat.length - 1], $(this).parent().children('.mes_block'));
                                await eventSource.emit(event_types.MESSAGE_SWIPED, (chat.length - 1));
                                saveChatDebounced();
                            },
                        });
                    },
                });
            },
        });

        $(this).parent().children('.avatar').transition({
            x: swipe_range,
            duration: animation_duration > 0 ? swipe_duration : 0,
            easing: animation_easing,
            queue: false,
            complete: function () {
                $(this).parent().children('.avatar').transition({
                    x: '-' + swipe_range,
                    duration: 0,
                    easing: animation_easing,
                    queue: false,
                    complete: function () {
                        $(this).parent().children('.avatar').transition({
                            x: '0px',
                            duration: animation_duration > 0 ? swipe_duration : 0,
                            easing: animation_easing,
                            queue: false,
                            complete: function () {

                            },
                        });
                    },
                });
            },
        });
    }
    if (chat[chat.length - 1]['swipe_id'] < 0) {
        chat[chat.length - 1]['swipe_id'] = 0;
    }
}

/**
 * Handles the swipe to the right event.
 * @param {JQuery.Event} [_event] Event.
 * @param {object} params Additional parameters.
 * @param {string} [params.source] The source of the swipe event.
 * @param {boolean} [params.repeated] Is the swipe event repeated.
 */
//MARK: swipe_right
export function swipe_right(_event = null, { source, repeated } = {}) {
    if (chat.length - 1 === Number(this_edit_mes_id)) {
        closeMessageEditor();
    }

    if (isHordeGenerationNotAllowed()) {
        return unblockGeneration();
    }

    // Make sure ad-hoc changes to extras are saved before swiping away
    syncMesToSwipe();

    const isPristine = !chat_metadata?.tainted;
    const swipe_duration = 200;
    const swipe_range = 700;
    //console.log(swipe_range);
    let run_generate = false;
    let run_swipe_right = false;
    if (chat[chat.length - 1]['swipe_id'] === undefined) {              // if there is no swipe-message in the last spot of the chat array
        chat[chat.length - 1]['swipe_id'] = 0;                        // set it to id 0
        chat[chat.length - 1]['swipes'] = [];                         // empty the array
        chat[chat.length - 1]['swipe_info'] = [];
        chat[chat.length - 1]['swipes'][0] = chat[chat.length - 1]['mes'];  //assign swipe array with last message from chat
        chat[chat.length - 1]['swipe_info'][0] = {
            'send_date': chat[chat.length - 1]['send_date'],
            'gen_started': chat[chat.length - 1]['gen_started'],
            'gen_finished': chat[chat.length - 1]['gen_finished'],
            'extra': structuredClone(chat[chat.length - 1]['extra']),
        };
        //assign swipe info array with last message from chat
    }
    // if swipe_right is called on the last alternate greeting in pristine chats, loop back around
    if (chat.length === 1 && chat[0]['swipe_id'] !== undefined && chat[0]['swipe_id'] === chat[0]['swipes'].length - 1 && isPristine) {
        chat[0]['swipe_id'] = 0;
    } else {
        // If the user is holding down the key and we're at the last swipe, don't do anything
        if (source === 'keyboard' && repeated && chat[chat.length - 1].swipe_id === chat[chat.length - 1].swipes.length - 1) {
            return;
        }
        // make new slot in array
        chat[chat.length - 1]['swipe_id']++;
    }
    if (chat[chat.length - 1].extra) {
        // if message has memory attached - remove it to allow regen
        if (chat[chat.length - 1].extra.memory) {
            delete chat[chat.length - 1].extra.memory;
        }
        // ditto for display text
        if (chat[chat.length - 1].extra.display_text) {
            delete chat[chat.length - 1].extra.display_text;
        }

        delete chat[chat.length - 1].extra.image;
        delete chat[chat.length - 1].extra.image_swipes;
        delete chat[chat.length - 1].extra.video;
        delete chat[chat.length - 1].extra.inline_image;
    }
    if (!Array.isArray(chat[chat.length - 1]['swipe_info'])) {
        chat[chat.length - 1]['swipe_info'] = [];
    }
    //if swipe id of last message is the same as the length of the 'swipes' array and not the greeting
    if (parseInt(chat[chat.length - 1]['swipe_id']) === chat[chat.length - 1]['swipes'].length && (chat.length !== 1 || !isPristine)) {
        delete chat[chat.length - 1].gen_started;
        delete chat[chat.length - 1].gen_finished;
        run_generate = true;
    } else if (parseInt(chat[chat.length - 1]['swipe_id']) < chat[chat.length - 1]['swipes'].length) { //otherwise, if the id is less than the number of swipes
        chat[chat.length - 1]['mes'] = chat[chat.length - 1]['swipes'][chat[chat.length - 1]['swipe_id']]; //load the last mes box with the latest generation
        chat[chat.length - 1]['send_date'] = chat[chat.length - 1]?.swipe_info[chat[chat.length - 1]['swipe_id']]?.send_date || chat[chat.length - 1]['send_date']; //update send date
        chat[chat.length - 1]['extra'] = structuredClone(chat[chat.length - 1].swipe_info[chat[chat.length - 1]['swipe_id']]?.extra || chat[chat.length - 1].extra || []);
        run_swipe_right = true; //then prepare to do normal right swipe to show next message
    }

    const currentMessage = $('#chat').children().filter(`[mesid="${chat.length - 1}"]`);
    let this_div = currentMessage.find('.swipe_right');
    let this_mes_div = this_div.parent().parent();

    if (chat[chat.length - 1]['swipe_id'] > chat[chat.length - 1]['swipes'].length) { //if we swipe right while generating (the swipe ID is greater than what we are viewing now)
        chat[chat.length - 1]['swipe_id'] = chat[chat.length - 1]['swipes'].length; //show that message slot (will be '...' while generating)
    }
    if (run_generate) {               //hide swipe arrows while generating
        this_div.css('display', 'none');
    }
    // handles animated transitions when swipe right, specifically height transitions between messages
    if (run_generate || run_swipe_right) {
        let this_mes_block = this_mes_div.find('.mes_block .mes_text');
        const this_mes_div_height = this_mes_div[0].scrollHeight;
        const this_mes_block_height = this_mes_block[0].scrollHeight;

        this_mes_div.children('.swipe_left').css('display', 'flex');
        this_mes_div.children('.mes_block').transition({        // this moves the div back and forth
            x: '-' + swipe_range,
            duration: animation_duration > 0 ? swipe_duration : 0,
            easing: animation_easing,
            queue: false,
            complete: async function () {
                const is_animation_scroll = ($('#chat').scrollTop() >= ($('#chat').prop('scrollHeight') - $('#chat').outerHeight()) - 10);
                //console.log(parseInt(chat[chat.length-1]['swipe_id']));
                //console.log(chat[chat.length-1]['swipes'].length);
                const swipeMessage = $('#chat').find('[mesid="' + (chat.length - 1) + '"]');
                if (run_generate && parseInt(chat[chat.length - 1]['swipe_id']) === chat[chat.length - 1]['swipes'].length) {
                    //shows "..." while generating
                    swipeMessage.find('.mes_text').html('...');
                    // resets the timer
                    swipeMessage.find('.mes_timer').html('');
                    swipeMessage.find('.tokenCounterDisplay').text('');
                    updateReasoningUI(swipeMessage, { reset: true });
                } else {
                    //console.log('showing previously generated swipe candidate, or "..."');
                    //console.log('onclick right swipe calling addOneMessage');
                    addOneMessage(chat[chat.length - 1], { type: 'swipe' });

                    if (power_user.message_token_count_enabled) {
                        if (!chat[chat.length - 1].extra) {
                            chat[chat.length - 1].extra = {};
                        }

                        const tokenCountText = (chat[chat.length - 1]?.extra?.reasoning || '') + chat[chat.length - 1].mes;
                        const tokenCount = await getTokenCountAsync(tokenCountText, 0);
                        chat[chat.length - 1]['extra']['token_count'] = tokenCount;
                        swipeMessage.find('.tokenCounterDisplay').text(`${tokenCount}t`);
                    }
                }
                let new_height = this_mes_div_height - (this_mes_block_height - this_mes_block[0].scrollHeight);
                if (new_height < 103) new_height = 103;


                this_mes_div.animate({ height: new_height + 'px' }, {
                    duration: 0, //used to be 100
                    queue: false,
                    progress: function () {
                        // Scroll the chat down as the message expands
                        if (is_animation_scroll) $('#chat').scrollTop($('#chat')[0].scrollHeight);
                    },
                    complete: function () {
                        this_mes_div.css('height', 'auto');
                        // Scroll the chat down to the bottom once the animation is complete
                        if (is_animation_scroll) $('#chat').scrollTop($('#chat')[0].scrollHeight);
                    },
                });
                this_mes_div.children('.mes_block').transition({
                    x: swipe_range,
                    duration: 0,
                    easing: animation_easing,
                    queue: false,
                    complete: function () {
                        this_mes_div.children('.mes_block').transition({
                            x: '0px',
                            duration: animation_duration > 0 ? swipe_duration : 0,
                            easing: animation_easing,
                            queue: false,
                            complete: async function () {
                                appendMediaToMessage(chat[chat.length - 1], swipeMessage);
                                await eventSource.emit(event_types.MESSAGE_SWIPED, (chat.length - 1));
                                if (run_generate && !is_send_press && parseInt(chat[chat.length - 1]['swipe_id']) === chat[chat.length - 1]['swipes'].length) {
                                    console.debug('caught here 2');
                                    is_send_press = true;
                                    await Generate('swipe');
                                } else {
                                    if (parseInt(chat[chat.length - 1]['swipe_id']) !== chat[chat.length - 1]['swipes'].length) {
                                        saveChatDebounced();
                                    }
                                }
                            },
                        });
                    },
                });
            },
        });
        this_mes_div.children('.avatar').transition({ // moves avatar along with swipe
            x: '-' + swipe_range,
            duration: animation_duration > 0 ? swipe_duration : 0,
            easing: animation_easing,
            queue: false,
            complete: function () {
                this_mes_div.children('.avatar').transition({
                    x: swipe_range,
                    duration: 0,
                    easing: animation_easing,
                    queue: false,
                    complete: function () {
                        this_mes_div.children('.avatar').transition({
                            x: '0px',
                            duration: animation_duration > 0 ? swipe_duration : 0,
                            easing: animation_easing,
                            queue: false,
                            complete: function () {

                            },
                        });
                    },
                });
            },
        });
    }
}

/**
 * Imports supported files dropped into the app window.
 * @param {File[]} files Array of files to process
 * @param {Map<File, string>} [data] Extra data to pass to the import function
 * @returns {Promise<void>}
 */
export async function processDroppedFiles(files, data = new Map()) {
    const allowedMimeTypes = [
        'application/json',
        'image/png',
        'application/yaml',
        'application/x-yaml',
        'text/yaml',
        'text/x-yaml',
    ];

    const allowedExtensions = [
        'charx',
        'byaf',
    ];

    const avatarFileNames = [];
    for (const file of files) {
        const extension = file.name.split('.').pop().toLowerCase();
        if (allowedMimeTypes.some(x => file.type.startsWith(x)) || allowedExtensions.includes(extension)) {
            const preservedName = data instanceof Map && data.get(file);
            const avatarFileName = await importCharacter(file, { preserveFileName: preservedName });
            if (avatarFileName !== undefined) {
                avatarFileNames.push(avatarFileName);
            }
        } else {
            toastr.warning(t`不支持的文件类型：` + file.name);
        }
    }

    if (avatarFileNames.length > 0) {
        await importCharactersTags(avatarFileNames);
        selectImportedChar(avatarFileNames[avatarFileNames.length - 1]);
    }
}

/**
 * Imports tags for the given characters
 * @param {string[]} avatarFileNames character avatar filenames whose tags are to import
 */
async function importCharactersTags(avatarFileNames) {
    await getCharacters();
    for (let i = 0; i < avatarFileNames.length; i++) {
        if (power_user.tag_import_setting !== tag_import_setting.NONE) {
            const importedCharacter = characters.find(character => character.avatar === avatarFileNames[i]);
            await importTags(importedCharacter);
        }
    }
}

/**
 * Selects the given imported char
 * @param {string} charId char to select
 */
function selectImportedChar(charId) {
    let oldSelectedChar = null;
    if (this_chid !== undefined) {
        oldSelectedChar = characters[this_chid].avatar;
    }
    select_rm_info('char_import_no_toast', charId, oldSelectedChar);
}

/**
 * Imports a character from a file.
 * @param {File} file File to import
 * @param {object} [options] - Options
 * @param {string} [options.preserveFileName] Whether to preserve original file name
 * @param {Boolean} [options.importTags=false] Whether to import tags
 * @returns {Promise<string>}
 */
async function importCharacter(file, { preserveFileName = '', importTags = false } = {}) {
    if (is_group_generating || is_send_press) {
        toastr.error(t`生成过程中无法导入角色，请停止请求后重试。`, t`已中止导入`);
        throw new Error('生成过程中无法导入角色');
    }

    const ext = file.name.match(/\.(\w+)$/);
    if (!ext || !(['json', 'png', 'yaml', 'yml', 'charx', 'byaf'].includes(ext[1].toLowerCase()))) {
        return;
    }

    const format = ext[1].toLowerCase();
    $('#character_import_file_type').val(format);
    const formData = new FormData();
    formData.append('avatar', file);
    formData.append('file_type', format);
    if (preserveFileName) formData.append('preserved_name', preserveFileName);

    try {
        const result = await fetch('/api/characters/import', {
            method: 'POST',
            body: formData,
            headers: getRequestHeaders({ omitContentType: true }),
            cache: 'no-cache',
        });

        if (!result.ok) {
            throw new Error(`Failed to import character: ${result.statusText}`);
        }

        const data = await result.json();

        if (data.error) {
            throw new Error(`Server returned an error: ${data.error}`);
        }

        if (data.file_name !== undefined) {
            $('#character_search_bar').val('').trigger('input');

            toastr.success(t`已创建角色：${String(data.file_name).replace('.png', '')}`);
            let avatarFileName = `${data.file_name}.png`;
            if (importTags) {
                await importCharactersTags([avatarFileName]);
                selectImportedChar(data.file_name);
            }
            return avatarFileName;
        }
    } catch (error) {
        console.error('导入角色时出错', error);
        toastr.error(t`该文件可能无效或已损坏。`, t`无法导入角色`);
    }
}

async function importFromURL(items, files) {
    for (const item of items) {
        if (item.type === 'text/uri-list') {
            const uriList = await new Promise((resolve) => {
                item.getAsString((uriList) => { resolve(uriList); });
            });
            const uris = uriList.split('\n').filter(uri => uri.trim() !== '');
            try {
                for (const uri of uris) {
                    const request = await fetch(uri);
                    const data = await request.blob();
                    const fileName = request.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || uri.split('/').pop() || 'file.png';
                    const file = new File([data], fileName, { type: data.type });
                    files.push(file);
                }
            } catch (error) {
                console.error('Failed to import from URL', error);
            }
        }
    }
}

export async function doNewChat({ deleteCurrentChat = false } = {}) {
    //Make a new chat for selected character
    if ((!selected_group && this_chid == undefined) || menu_type == 'create') {
        return;
    }

    //Fix it; New chat doesn't create while open create character menu
    await waitUntilCondition(() => !isChatSaving, debounce_timeout.extended, 10);
    await clearChat();
    chat.length = 0;

    chat_file_for_del = getCurrentChatDetails()?.sessionName;

    // Make it easier to find in backups
    if (deleteCurrentChat) {
        await saveChatConditional();
    }

    if (selected_group) {
        await createNewGroupChat(selected_group);
        if (deleteCurrentChat) await deleteGroupChat(selected_group, chat_file_for_del);
    }
    else {
        //RossAscends: added character name to new chat filenames and replaced Date.now() with humanizedDateTime;
        chat_metadata = {};
        characters[this_chid].chat = `${name2} - ${humanizedDateTime()}`;
        $('#selected_chat_pole').val(characters[this_chid].chat);
        await getChat();
        await createOrEditCharacter(new CustomEvent('newChat'));
        if (deleteCurrentChat) await delChat(chat_file_for_del + '.jsonl');
    }

}

/**
 * Renames a group or character chat.
 * @param {object} param Parameters for renaming chat
 * @param {string} [param.characterId] Character ID to rename chat for
 * @param {string} [param.groupId] Group ID to rename chat for
 * @param {string} param.oldFileName Old name of the chat (no JSONL extension)
 * @param {string} param.newFileName New name for the chat (no JSONL extension)
 * @param {boolean} [param.loader=true] Whether to show loader during the operation
 */
export async function renameGroupOrCharacterChat({ characterId, groupId, oldFileName, newFileName, loader }) {
    const currentChatId = getCurrentChatId();
    const body = {
        is_group: !!groupId,
        avatar_url: characters[characterId]?.avatar,
        original_file: `${oldFileName}.jsonl`,
        renamed_file: `${newFileName.trim()}.jsonl`,
    };

    if (body.original_file === body.renamed_file) {
        console.debug('聊天重命名已取消，旧名称与新名称一致');
        return;
    }
    if (equalsIgnoreCaseAndAccents(body.original_file, body.renamed_file)) {
        toastr.warning(t`名称未被接受，因为与之前相同（忽略大小写和重音）。`, t`重命名聊天`);
        return;
    }

    try {
        loader && showLoader();

        const response = await fetch('/api/chats/rename', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: getRequestHeaders(),
        });

        if (!response.ok) {
            throw new Error('Unsuccessful request.');
        }

        const data = await response.json();

        if (data.error) {
            throw new Error('Server returned an error.');
        }

        if (data.sanitizedFileName) {
            newFileName = data.sanitizedFileName;
        }

        if (groupId) {
            await renameGroupChat(groupId, oldFileName, newFileName);
        }
        else if (characterId !== undefined && String(characterId) === String(this_chid) && characters[characterId]?.chat === oldFileName) {
            characters[characterId].chat = newFileName;
            $('#selected_chat_pole').val(characters[characterId].chat);
            await createOrEditCharacter();
        }

        if (currentChatId) {
            await reloadCurrentChat();
        }
    } catch {
        loader && hideLoader();
        await delay(500);
        await callGenericPopup('An error has occurred. Chat was not renamed.', POPUP_TYPE.TEXT);
    } finally {
        loader && hideLoader();
    }
}

/**
 * Renames the currently selected chat.
 * @param {string} oldFileName Old name of the chat (no JSONL extension)
 * @param {string} newName New name for the chat (no JSONL extension)
 */
export async function renameChat(oldFileName, newName) {
    return await renameGroupOrCharacterChat({
        characterId: this_chid,
        groupId: selected_group,
        oldFileName: oldFileName,
        newFileName: newName,
        loader: true,
    });
}

/**
 * Forces the update of the chat name for a remote character.
 * @param {string|number} characterId Character ID to update chat name for
 * @param {string} newName New name for the chat
 * @returns {Promise<void>}
 */
export async function updateRemoteChatName(characterId, newName) {
    const character = characters[characterId];
    if (!character) {
        console.warn(`Character not found for ID: ${characterId}`);
        return;
    }
    character.chat = newName;
    const mergeRequest = {
        avatar: character.avatar,
        chat: newName,
    };
    const mergeResponse = await fetch('/api/characters/merge-attributes', {
        method: 'POST',
        headers: getRequestHeaders(),
        body: JSON.stringify(mergeRequest),
    });
    if (!mergeResponse.ok) {
        console.error('Failed to save extension field', mergeResponse.statusText);
    }
}


function doCharListDisplaySwitch() {
    power_user.charListGrid = !power_user.charListGrid;
    document.body.classList.toggle('charListGrid', power_user.charListGrid);
    saveSettingsDebounced();
}

/**
 * Function to handle the deletion of a character, given a specific popup type and character ID.
 * If popup type equals "del_ch", it will proceed with deletion otherwise it will exit the function.
 * It fetches the delete character route, sending necessary parameters, and in case of success,
 * it proceeds to delete character from UI and saves settings.
 * In case of error during the fetch request, it logs the error details.
 *
 * @param {string} this_chid - The character ID to be deleted.
 * @param {boolean} delete_chats - Whether to delete chats or not.
 */
export async function handleDeleteCharacter(this_chid, delete_chats) {
    if (!characters[this_chid]) {
        return;
    }

    await deleteCharacter(characters[this_chid].avatar, { deleteChats: delete_chats });
}

/**
 * Deletes a character completely, including associated chats if specified
 *
 * @param {string|string[]} characterKey - The key (avatar) of the character to be deleted
 * @param {Object} [options] - Optional parameters for the deletion
 * @param {boolean} [options.deleteChats=true] - Whether to delete associated chats or not
 * @return {Promise<void>} - A promise that resolves when the character is successfully deleted
 */
export async function deleteCharacter(characterKey, { deleteChats = true } = {}) {
    if (!Array.isArray(characterKey)) {
        characterKey = [characterKey];
    }

    for (const key of characterKey) {
        const character = characters.find(x => x.avatar == key);
        if (!character) {
            toastr.warning(t`找不到角色 ${key}，已跳过删除。`);
            continue;
        }

        const chid = characters.indexOf(character);
        const pastChats = await getPastCharacterChats(chid);

        const msg = { avatar_url: character.avatar, delete_chats: deleteChats };

        const response = await fetch('/api/characters/delete', {
            method: 'POST',
            headers: getRequestHeaders(),
            body: JSON.stringify(msg),
            cache: 'no-cache',
        });

        if (!response.ok) {
            toastr.error(`${response.status} ${response.statusText}`, t`删除角色失败`);
            continue;
        }

        accountStorage.removeItem(`AlertWI_${character.avatar}`);
        accountStorage.removeItem(`AlertRegex_${character.avatar}`);
        accountStorage.removeItem(`mediaWarningShown:${character.avatar}`);
        delete tag_map[character.avatar];
        select_rm_info('char_delete', character.name);

        if (deleteChats) {
            for (const chat of pastChats) {
                const name = chat.file_name.replace('.jsonl', '');
                await eventSource.emit(event_types.CHAT_DELETED, name);
            }
        }

        await eventSource.emit(event_types.CHARACTER_DELETED, { id: chid, character: character });
    }

    await removeCharacterFromUI();
}

/**
 * Function to delete a character from UI after character deletion API success.
 * It manages necessary UI changes such as closing advanced editing popup, unsetting
 * character ID, resetting characters array and chat metadata, deselecting character's tab
 * panel, removing character name from navigation tabs, clearing chat, fetching updated list of characters.
 * It also ensures to save the settings after all the operations.
 */
async function removeCharacterFromUI() {
    preserveNeutralChat();
    await clearChat();
    $('#character_cross').trigger('click');
    resetChatState();
    $(document.getElementById('rm_button_selected_ch')).children('h2').text('');
    restoreNeutralChat();
    await getCharacters();
    await printMessages();
    saveSettingsDebounced();
    await eventSource.emit(event_types.CHAT_CHANGED, getCurrentChatId());
}

/**
 * Creates a new assistant chat.
 * @param {object} params - Parameters for the new assistant chat
 * @param {boolean} [params.temporary=false] I need a temporary secretary
 * @returns {Promise<void>} - A promise that resolves when the new assistant chat is created
 */
export async function newAssistantChat({ temporary = false } = {}) {
    await clearChat();
    if (!temporary) {
        return openPermanentAssistantChat();
    }
    chat.splice(0, chat.length);
    chat_metadata = {};
    setCharacterName(neutralCharacterName);
    sendSystemMessage(system_message_types.ASSISTANT_NOTE);
}

/**
 * Event handler to open a navbar drawer when a drawer open button is clicked.
 * Handles click events on .drawer-opener elements.
 * Opens the drawer associated with the clicked button according to the data-target attribute.
 * @returns {void}
 */
function doDrawerOpenClick() {
    const targetDrawerID = $(this).attr('data-target');
    const drawer = $(`#${targetDrawerID}`);
    const drawerToggle = drawer.find('.drawer-toggle');
    const drawerWasOpenAlready = drawerToggle.parent().find('.drawer-content').hasClass('openDrawer');
    if (drawerWasOpenAlready || drawer.hasClass('resizing')) { return; }
    doNavbarIconClick.call(drawerToggle);
}

/**
 * Event handler to open or close a navbar drawer when a navbar icon is clicked.
 * Handles click events on .drawer-toggle elements.
 * @returns {Promise<void>}
 */
export async function doNavbarIconClick() {
    const icon = $(this).find('.drawer-icon');
    const drawer = $(this).parent().find('.drawer-content');
    const drawerWasOpenAlready = $(this).parent().find('.drawer-content').hasClass('openDrawer');
    const targetDrawerID = $(this).parent().find('.drawer-content').attr('id');

    if (!drawerWasOpenAlready) {
        const $openDrawers = $('.openDrawer:not(.pinnedOpen)');
        const $openIcons = $('.openIcon:not(.drawerPinnedOpen)');
        for (const iconEl of $openIcons) {
            $(iconEl).toggleClass('closedIcon openIcon');
        }
        for (const el of $openDrawers) {
            $(el).toggleClass('closedDrawer openDrawer');
        }
        if ($openDrawers.length && animation_duration) {
            await delay(animation_duration);
        }
        icon.toggleClass('openIcon closedIcon');
        drawer.toggleClass('openDrawer closedDrawer');

        if (targetDrawerID === 'right-nav-panel') {
            const drawerElement = drawer;
            schedulePanelTask('drawer:right-nav', () => {
                if (!drawerElement.hasClass('openDrawer')) {
                    return;
                }
                favsToHotswap();
                $('#rm_print_characters_block').trigger('scroll');
            }, { priority: 'idle', timeout: 250 });
        }

        // Set the height of "autoSetHeight" textareas within the drawer to their scroll height
        if (!CSS.supports('field-sizing', 'content')) {
            const textareas = $(this).closest('.drawer').find('.drawer-content textarea.autoSetHeight');
            for (const textarea of textareas) {
                await resetScrollHeight($(textarea));
            }
        }
    } else if (drawerWasOpenAlready) {
        icon.toggleClass('closedIcon openIcon');
        drawer.toggleClass('closedDrawer openDrawer');
    }
}

function addDebugFunctions() {
    const doBackfill = async () => {
        for (const message of chat) {
            // System messages are not counted
            if (message.is_system) {
                continue;
            }

            if (!message.extra) {
                message.extra = {};
            }

            const tokenCountText = (message?.extra?.reasoning || '') + message.mes;
            message.extra.token_count = await getTokenCountAsync(tokenCountText, 0);
        }

        await saveChatConditional();
        await reloadCurrentChat();
    };

    registerDebugFunction('forceOnboarding', 'Force onboarding', 'Forces the onboarding process to restart.', async () => {
        firstRun = true;
        await saveSettings();
        location.reload();
    });

    registerDebugFunction('backfillTokenCounts', '回填 Token 计数',
        `重新计算当前聊天中所有消息的 Token 统计，用于刷新显示。
        在切换至不同分词器的模型时非常有用。
        仅影响可视化效果，操作完成后聊天会重新加载。`, doBackfill);

    registerDebugFunction('generationTest', '发送生成请求', '使用当前选中的 API 生成文字。', async () => {
        const text = prompt('输入测试文本：', '你好');
        toastr.info('正在处理……');
        const message = await generateRaw({ prompt: text });
        alert(message);
    });
    registerDebugFunction('toggleEventTracing', '切换事件追踪', '用于查看是哪项事件触发了当前动作。', () => {
        localStorage.setItem('eventTracing', localStorage.getItem('eventTracing') === 'true' ? 'false' : 'true');
        toastr.info('Event tracing is now ' + (localStorage.getItem('eventTracing') === 'true' ? 'enabled' : 'disabled'));
    });

    registerDebugFunction('toggleRegenerateWarning', 'Toggle Ctrl+Enter regeneration confirmation', 'Toggle the warning when regenerating a message with a Ctrl+Enter hotkey.', () => {
        accountStorage.setItem('RegenerateWithCtrlEnter', accountStorage.getItem('RegenerateWithCtrlEnter') === 'true' ? 'false' : 'true');
        toastr.info('Regenerate warning is now ' + (accountStorage.getItem('RegenerateWithCtrlEnter') === 'true' ? 'disabled' : 'enabled'));
    });

    registerDebugFunction('copySetup', 'Copy ST setup to clipboard [WIP]', 'Useful data when reporting bugs', async () => {
        const getContextContents = getContext();
        const getSettingsContents = settings;
        //console.log(getSettingsContents);
        const logMessage = `
\`\`\`
API: ${getSettingsContents.main_api}
API Type: ${getSettingsContents[getSettingsContents.main_api + '_settings'].type}
API server: ${getSettingsContents.api_server}
Model: ${getContextContents.onlineStatus}
Context Template: ${power_user.context.preset}
Instruct Template: ${power_user.instruct.preset}
API Settings: ${JSON.stringify(getSettingsContents[getSettingsContents.main_api + '_settings'], null, 2)}
\`\`\`
    `;

        //console.log(getSettingsContents)
        //console.log(logMessage);

        try {
            await copyText(logMessage);
            toastr.info('已将 ST API 配置数据复制到剪贴板。');
        } catch (error) {
            toastr.error('无法复制 ST 配置到剪贴板：', error);
        }
    });
}

function initCharacterSearch() {
    const debouncedCharacterSearch = debounce((searchQuery) => {
        entitiesFilter.setFilterData(FILTER_TYPES.SEARCH, searchQuery);
    });

    const searchForm = $('#form_character_search_form');
    const searchInput = $('#character_search_bar');
    const searchButton = $('#rm_button_search');

    const storageKey = 'characterSearchFormVisible';

    searchInput.on('input', function () {
        const searchQuery = String($(this).val());
        debouncedCharacterSearch(searchQuery);
    });

    searchButton.on('click', function () {
        const newVisibility = !searchForm.is(':visible');
        searchForm.toggle(newVisibility);
        searchButton.toggleClass('active', newVisibility);
        accountStorage.setItem(storageKey, String(newVisibility));
        if (newVisibility) {
            searchInput.trigger('focus');
        }
    });

    eventSource.on(event_types.APP_READY, () => {
        const isVisible = accountStorage.getItem(storageKey) === 'true';
        searchForm.toggle(isVisible);
        searchButton.toggleClass('active', isVisible);
    });
}

function patchMessageIframeDocument(iframeId) {
    if (typeof iframeId !== 'string' || !iframeId.startsWith('message-iframe-')) {
        return;
    }

    const iframe = document.getElementById(iframeId);
    if (!(iframe instanceof HTMLIFrameElement)) {
        return;
    }

    const srcdoc = iframe.getAttribute('srcdoc') || '';
    if (!/<html[\s>]/i.test(srcdoc) || srcdoc.includes('data-st-modal-close-patch')) {
        return;
    }

    const patchScript = `<script data-st-modal-close-patch>
(function () {
    if (window.__stModalClosePatched) {
        return;
    }
    window.__stModalClosePatched = true;
    const ensureButton = (root) => {
        if (!root || !(root instanceof Element)) {
            return null;
        }
        let btn = root.querySelector('.modal-close-btn');
        if (btn) {
            return btn;
        }
        btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'modal-close-btn';
        btn.textContent = '×';
        btn.setAttribute('style', btn.getAttribute('style') || 'position:absolute;top:12px;right:12px;border:none;background:rgba(0,0,0,0.4);color:#fff;font-size:20px;width:32px;height:32px;border-radius:50%;cursor:pointer;');
        if (root.firstChild) {
            root.insertBefore(btn, root.firstChild);
        } else {
            root.appendChild(btn);
        }
        return btn;
    };

    const originalElementQuerySelector = Element.prototype.querySelector;
    const originalDocumentQuerySelector = Document.prototype.querySelector;

    Document.prototype.querySelector = function (selector) {
        const result = originalDocumentQuerySelector.call(this, selector);
        if (result || selector !== '.modal-close-btn') {
            return result;
        }
        return ensureButton(document.body);
    };

    const originalQuerySelector = Element.prototype.querySelector;
    Element.prototype.querySelector = function (selector) {
        const result = originalElementQuerySelector.call(this, selector);
        if (result || selector !== '.modal-close-btn') {
            return result;
        }
        return ensureButton(this);
    };

})();
</script>`;

    let patched = srcdoc;
    if (/<head[^>]*>/i.test(patched)) {
        patched = patched.replace(/<head([^>]*)>/i, `<head$1>${patchScript}`);
    } else if (/<body[^>]*>/i.test(patched)) {
        patched = patched.replace(/<body([^>]*)>/i, `<body$1>${patchScript}`);
    } else {
        patched = `${patchScript}${patched}`;
    }

    iframe.setAttribute('srcdoc', patched);
}

if (eventSource && typeof eventSource.on === 'function') {
    eventSource.on('message_iframe_render_started', patchMessageIframeDocument);
}

// MARK: DOM Handlers Start
jQuery(async function () {
    const $chat = $('#chat');
    setTimeout(function () {
        $('#groupControlsToggle').trigger('click');
        $('#groupCurrentMemberListToggle .inline-drawer-icon').trigger('click');
    }, 200);

    $(document).on('click', '.api_loading', () => cancelStatusCheck('Canceled because connecting was manually canceled'));

    //////////INPUT BAR FOCUS-KEEPING LOGIC/////////////
    let S_TAPreviouslyFocused = false;
    $('#send_textarea').on('focusin focus click', () => {
        S_TAPreviouslyFocused = true;
    });
    $('#send_but, #option_regenerate, #option_continue, #mes_continue, #mes_impersonate').on('click', () => {
        if (S_TAPreviouslyFocused) {
            $('#send_textarea').trigger('focus');
        }
    });
    $(document).on('click', event => {
        if ($(':focus').attr('id') !== 'send_textarea') {
            var validIDs = ['options_button', 'send_but', 'mes_impersonate', 'mes_continue', 'send_textarea', 'option_regenerate', 'option_continue'];
            if (!validIDs.includes($(event.target).attr('id'))) {
                S_TAPreviouslyFocused = false;
            }
        } else {
            S_TAPreviouslyFocused = true;
        }
    });

    /////////////////

    $('#swipes-checkbox').on('change', function () {
        swipes = !!$('#swipes-checkbox').prop('checked');
        if (swipes) {
            //console.log('toggle change calling showswipebtns');
            showSwipeButtons();
        } else {
            hideSwipeButtons();
        }
        saveSettingsDebounced();
    });

    ///// SWIPE BUTTON CLICKS ///////

    //limit swiping to only last message clicks
    $chat.on('click', '.last_mes .swipe_right', swipe_right);
    $chat.on('click', '.last_mes .swipe_left', swipe_left);

    initCharacterSearch();

    $('#mes_impersonate').on('click', function () {
        $('#option_impersonate').trigger('click');
    });

    $('#mes_continue').on('click', function () {
        $('#option_continue').trigger('click');
    });

    $('#send_but').on('click', function () {
        sendTextareaMessage();
    });

    //menu buttons setup

    $('#rm_button_settings').on('click', function () {
        selected_button = 'settings';
        selectRightMenuWithAnimation('rm_api_block');
    });
    $('#rm_button_characters').on('click', function () {
        selected_button = 'characters';
        select_rm_characters();
    });
    $('#rm_button_back').on('click', function () {
        selected_button = 'characters';
        select_rm_characters();
    });
    $('#rm_button_create').on('click', function () {
        selected_button = 'create';
        select_rm_create();
    });
    $('#rm_button_selected_ch').on('click', function () {
        if (selected_group) {
            select_group_chats(selected_group);
        } else {
            selected_button = 'character_edit';
            select_selected_character(this_chid);
        }
        $('#character_search_bar').val('').trigger('input');
    });

    $(document).on('click', '.character_select', async function () {
        const id = Number($(this).attr('data-chid'));
        await selectCharacterById(id);
    });

    $(document).on('click', '.bogus_folder_select', function () {
        const tagId = $(this).attr('tagid');
        console.debug('Bogus folder clicked', tagId);
        chooseBogusFolder($(this), tagId);
    });

    const cssAutofit = CSS.supports('field-sizing', 'content');
    if (!cssAutofit) {
        /**
         * Sets the scroll height of the edit textarea to fit the content.
         * @param {HTMLTextAreaElement} e Textarea element to auto-fit
         */
        const editTextareaResizeQueue = new Set();
        let editTextareaResizeFrame = null;

        /**
         * Resizes an editable textarea to fit its content.
         * @param {HTMLTextAreaElement} textarea
         * @returns {boolean} Whether the height changed.
         */
        function resizeEditTextarea(textarea) {
            if (!(textarea instanceof HTMLTextAreaElement)) {
                return false;
            }

            const previousHeight = textarea.style.height;
            textarea.style.height = 'auto';
            const newHeight = textarea.scrollHeight + 4;
            const newHeightPx = `${newHeight}px`;
            textarea.style.height = newHeightPx;
            return previousHeight !== newHeightPx;
        }

        function flushEditTextareaQueue() {
            editTextareaResizeFrame = null;
            if (!editTextareaResizeQueue.size) {
                return;
            }

            const hasChatElement = chatElement && chatElement.length;
            const previousScrollTop = hasChatElement ? chatElement.scrollTop() : 0;
            let shouldRestoreScroll = false;

            for (const textarea of editTextareaResizeQueue) {
                if (!(textarea instanceof HTMLTextAreaElement) || !textarea.isConnected) {
                    continue;
                }
                shouldRestoreScroll = resizeEditTextarea(textarea) || shouldRestoreScroll;
            }

            editTextareaResizeQueue.clear();

            if (shouldRestoreScroll && hasChatElement) {
                chatElement.scrollTop(previousScrollTop);
            }
        }

        function scheduleEditTextareaResize(textarea, { immediate = false } = {}) {
            if (!(textarea instanceof HTMLTextAreaElement)) {
                return;
            }

            if (immediate) {
                editTextareaResizeQueue.delete(textarea);
                const hasChatElement = chatElement && chatElement.length;
                const previousScrollTop = hasChatElement ? chatElement.scrollTop() : 0;
                const changed = resizeEditTextarea(textarea);
                if (changed && hasChatElement) {
                    chatElement.scrollTop(previousScrollTop);
                }
                return;
            }

            editTextareaResizeQueue.add(textarea);
            if (editTextareaResizeFrame === null) {
                editTextareaResizeFrame = requestAnimationFrame(flushEditTextareaQueue);
            }
        }

        document.addEventListener('input', e => {
            if (e.target instanceof HTMLTextAreaElement && e.target.classList.contains('edit_textarea')) {
                const textarea = e.target;
                const scrollbarShown = textarea.clientWidth < textarea.offsetWidth && textarea.offsetHeight >= window.innerHeight * 0.75;
                const shouldResizeImmediately = (textarea.scrollHeight > textarea.offsetHeight && !scrollbarShown) || textarea.value === '';
                scheduleEditTextareaResize(textarea, { immediate: shouldResizeImmediately });
            }
        });
    }

    const chatElementScroll = document.getElementById('chat');
    const chatScrollHandlerCore = () => {
        if (power_user.waifuMode) {
            scrollLock = true;
            return;
        }

        const scrollIsAtBottom = Math.abs(chatElementScroll.scrollHeight - chatElementScroll.clientHeight - chatElementScroll.scrollTop) < 5;

        // Resume autoscroll if the user scrolls to the bottom
        if (scrollLock && scrollIsAtBottom) {
            scrollLock = false;
        }

        // Cancel autoscroll if the user scrolls up
        if (!scrollLock && !scrollIsAtBottom) {
            scrollLock = true;
        }
    };
    const chatScrollHandler = throttle(chatScrollHandlerCore, 120);
    addManagedEventListener(chatElementScroll, 'scroll', chatScrollHandler);

    $chat.on('click', '.mes', function () {
        //when a 'delete message' parent div is clicked
        // and we are in delete mode and del_checkbox is visible
        if (!is_delete_mode || !$(this).children('.del_checkbox').is(':visible')) {
            return;
        }
        forEachMountedMessage((_, element) => {
            element.classList.remove('selected');
            const checkbox = element.querySelector('.del_checkbox');
            if (checkbox instanceof HTMLInputElement) {
                checkbox.checked = false;
            }
        });
        $(this).addClass('selected'); //sets the bg of the mes selected for deletion
        var i = Number($(this).attr('mesid')); //checks the message ID in the chat
        this_del_mes = i;
        //as long as the current message ID is less than the total chat length
        while (i < chat.length) {
            const element = getMessageDom(i);
            if (element) {
                element.classList.add('selected');
                const checkbox = element.querySelector('.del_checkbox');
                if (checkbox instanceof HTMLInputElement) {
                    checkbox.checked = true;
                }
            }
            i++;
        }
    });

    /**
     * Handles the deletion of a chat file, including group chats.
     *
     * @param {string} chatFile - The name of the chat file to delete.
     * @param {object} group - The group object if the chat is part of a group.
     * @param {boolean} [fromSlashCommand=false] - Whether the deletion was triggered from a slash command.
     * @returns {Promise<void>}
     */
    async function handleDeleteChat(chatFile, group, fromSlashCommand = false) {
        // Close past chat popup.
        $('#select_chat_cross').trigger('click');
        showLoader();
        if (group) {
            await deleteGroupChat(group, chatFile);
        } else {
            await delChat(chatFile);
        }

        if (fromSlashCommand) {  // When called from `/delchat` command, don't re-open the history view.
            $('#options').hide();  // Hide option popup menu.
            hideLoader();
        } else {  // Open the history view again after 2 seconds (delay to avoid edge cases for deleting last chat).
            setTimeout(function () {
                $('#option_select_chat').trigger('click');
                $('#options').hide();  // Hide option popup menu.
                hideLoader();
            }, 2000);
        }
    }

    $(document).on('click', '.PastChat_cross', async function (e, { fromSlashCommand = false } = {}) {
        e.stopPropagation();
        chat_file_for_del = $(this).attr('file_name');
        console.debug('detected cross click for' + chat_file_for_del);

        // Skip confirmation if called from a slash command.
        if (fromSlashCommand) {
            await handleDeleteChat(chat_file_for_del, selected_group, true);
            return;
        }

        const result = await callGenericPopup('<h3>' + t`要删除聊天文件吗？` + '</h3>', POPUP_TYPE.CONFIRM);
        if (result === POPUP_RESULT.AFFIRMATIVE) {
            await handleDeleteChat(chat_file_for_del, selected_group, false);
        }
    });

    $('#advanced_div').on('click', function () {
        if (!is_advanced_char_open) {
            is_advanced_char_open = true;
            $('#character_popup').css({ 'display': 'flex', 'opacity': 0.0 }).addClass('open');
            $('#character_popup').transition({
                opacity: 1.0,
                duration: animation_duration,
                easing: animation_easing,
            });
        } else {
            is_advanced_char_open = false;
            $('#character_popup').css('display', 'none').removeClass('open');
        }
    });

    $('#character_cross').on('click', function () {
        is_advanced_char_open = false;
        $('#character_popup').transition({
            opacity: 0,
            duration: animation_duration,
            easing: animation_easing,
        });
        setTimeout(function () { $('#character_popup').css('display', 'none'); }, animation_duration);
    });

    $('#character_popup_ok').on('click', function () {
        is_advanced_char_open = false;
        $('#character_popup').css('display', 'none');
    });

    $('#dialogue_popup_ok').on('click', async function (_e, customData) {
        const fromSlashCommand = customData?.fromSlashCommand || false;
        dialogueCloseStop = false;
        $('#shadow_popup').transition({
            opacity: 0,
            duration: animation_duration,
            easing: animation_easing,
        });
        setTimeout(function () {
            if (dialogueCloseStop) return;
            $('#shadow_popup').css('display', 'none');
            $('#dialogue_popup').removeClass('large_dialogue_popup');
            $('#dialogue_popup').removeClass('wide_dialogue_popup');
        }, animation_duration);

        if (popup_type == 'del_chat') {
            await handleDeleteChat(chat_file_for_del, selected_group, fromSlashCommand);
        }

        if (dialogueResolve) {
            if (popup_type == 'input') {
                dialogueResolve($('#dialogue_popup_input').val());
                $('#dialogue_popup_input').val('');
            }
            else {
                dialogueResolve(true);
            }

            dialogueResolve = null;
        }
    });

    $('#dialogue_popup_cancel').on('click', function (e) {
        dialogueCloseStop = false;
        $('#shadow_popup').transition({
            opacity: 0,
            duration: animation_duration,
            easing: animation_easing,
        });
        setTimeout(function () {
            if (dialogueCloseStop) return;
            $('#shadow_popup').css('display', 'none');
            $('#dialogue_popup').removeClass('large_dialogue_popup');
        }, animation_duration);

        popup_type = '';

        if (dialogueResolve) {
            dialogueResolve(false);
            dialogueResolve = null;
        }
    });

    $('#add_avatar_button').on('change', function () {
        const inputElement = /** @type {HTMLInputElement} */ (this);
        read_avatar_load(inputElement);
    });

    $('#form_create').on('submit', (e) => createOrEditCharacter(e.originalEvent));

    $('#delete_button').on('click', async function () {
        if (this_chid === undefined || !characters[this_chid]) {
            toastr.warning('No character selected.');
            return;
        }

        let deleteChats = false;

        const confirm = await Popup.show.confirm(t`要删除该角色吗？`, await renderTemplateAsync('deleteConfirm'), {
            onClose: () => { deleteChats = !!$('#del_char_checkbox').prop('checked'); },
        });
        if (!confirm) {
            return;
        }

        await deleteCharacter(characters[this_chid].avatar, { deleteChats: deleteChats });
    });

    //////// OPTIMIZED ALL CHAR CREATION/EDITING TEXTAREA LISTENERS ///////////////

    $('#character_name_pole').on('input', function () {
        if (menu_type == 'create') {
            create_save.name = String($('#character_name_pole').val());
        }
    });

    const elementsToUpdate = {
        '#description_textarea': {
            create: () => { create_save.description = String($('#description_textarea').val()); },
            edit: () => {
                if (this_chid === undefined || !characters[this_chid]) {
                    return;
                }
                const value = String($('#description_textarea').val());
                characters[this_chid].description = value;
            },
        },
        '#creator_notes_textarea': {
            create: () => { create_save.creator_notes = String($('#creator_notes_textarea').val()); },
            edit: () => {
                if (this_chid === undefined || !characters[this_chid]) {
                    return;
                }
                const value = String($('#creator_notes_textarea').val());
                const character = characters[this_chid];
                character.creatorcomment = value;
                character.data = character.data || {};
                character.data.creator_notes = value;
                $('#creator_notes_spoiler').html(formatCreatorNotes(value, character.avatar));
                updateCharacterCardDescription(this_chid, value);
            },
        },
        '#character_version_textarea': () => { create_save.character_version = String($('#character_version_textarea').val()); },
        '#system_prompt_textarea': () => { create_save.system_prompt = String($('#system_prompt_textarea').val()); },
        '#post_history_instructions_textarea': () => { create_save.post_history_instructions = String($('#post_history_instructions_textarea').val()); },
        '#creator_textarea': () => { create_save.creator = String($('#creator_textarea').val()); },
        '#tags_textarea': () => { create_save.tags = String($('#tags_textarea').val()); },
        '#personality_textarea': () => { create_save.personality = String($('#personality_textarea').val()); },
        '#scenario_pole': () => { create_save.scenario = String($('#scenario_pole').val()); },
        '#mes_example_textarea': () => { create_save.mes_example = String($('#mes_example_textarea').val()); },
        '#firstmessage_textarea': () => { create_save.first_message = String($('#firstmessage_textarea').val()); },
        '#talkativeness_slider': () => { create_save.talkativeness = Number($('#talkativeness_slider').val()); },
        '#depth_prompt_prompt': () => { create_save.depth_prompt_prompt = String($('#depth_prompt_prompt').val()); },
        '#depth_prompt_depth': () => { create_save.depth_prompt_depth = Number($('#depth_prompt_depth').val()); },
        '#depth_prompt_role': () => { create_save.depth_prompt_role = String($('#depth_prompt_role').val()); },
    };

    Object.entries(elementsToUpdate).forEach(([selector, handler]) => {
        $(selector).on('input', function () {
            if (menu_type == 'create') {
                if (typeof handler === 'function') {
                    handler();
                } else {
                    handler.create?.();
                }
            } else {
                if (typeof handler !== 'function') {
                    handler.edit?.();
                }
                saveCharacterDebounced();
            }
        });
    });

    $('#favorite_button').on('click', function () {
        updateFavButtonState(!fav_ch_checked);
        if (menu_type != 'create') {
            saveCharacterDebounced();
        }
    });

    /* $("#renameCharButton").on('click', renameCharacter); */

    $(document).on('click', '.renameChatButton', async function (e) {
        e.stopPropagation();
        const oldFileNameFull = $(this).closest('.select_chat_block_wrapper').find('.select_chat_block_filename').text();
        const oldFileName = oldFileNameFull.replace('.jsonl', '');

        const popupText = await renderTemplateAsync('chatRename');
        const newName = await callGenericPopup(popupText, POPUP_TYPE.INPUT, oldFileName);

        if (!newName || typeof newName !== 'string' || newName == oldFileName) {
            console.log('no new name found, aborting');
            return;
        }

        await renameChat(oldFileName, newName);

        await delay(250);
        $('#option_select_chat').trigger('click');
        $('#options').hide();
    });

    $(document).on('click', '.exportChatButton, .exportRawChatButton', async function (e) {
        e.stopPropagation();
        const format = $(this).data('format') || 'txt';
        await saveChatConditional();
        const filenamefull = $(this).closest('.select_chat_block_wrapper').find('.select_chat_block_filename').text();
        console.log(`exporting ${filenamefull} in ${format} format`);

        const filename = filenamefull.replace('.jsonl', '');
        const body = {
            is_group: !!selected_group,
            avatar_url: characters[this_chid]?.avatar,
            file: `${filename}.jsonl`,
            exportfilename: `${filename}.${format}`,
            format: format,
        };
        console.log(body);
        try {
            const response = await fetch('/api/chats/export', {
                method: 'POST',
                body: JSON.stringify(body),
                headers: getRequestHeaders(),
            });
            const data = await response.json();
            if (!response.ok) {
                // display error message
                console.log(data.message);
                await delay(250);
                toastr.error(`Error: ${data.message}`);
                return;
            } else {
                const mimeType = format == 'txt' ? 'text/plain' : 'application/octet-stream';
                // success, handle response data
                console.log(data);
                await delay(250);
                toastr.success(data.message);
                download(data.result, body.exportfilename, mimeType);
            }
        } catch (error) {
            // display error message
            console.log(`An error has occurred: ${error.message}`);
            await delay(250);
            toastr.error(`Error: ${error.message}`);
        }
    });


    const button = $('#options_button');
    const menu = $('#options');
    let isOptionsMenuVisible = false;

    function showMenu() {
        showBookmarksButtons();
        menu.fadeIn(animation_duration);
        optionsPopper.update();
        isOptionsMenuVisible = true;
    }

    function hideMenu() {
        menu.fadeOut(animation_duration);
        optionsPopper.update();
        isOptionsMenuVisible = false;
    }

    function isMouseOverButtonOrMenu() {
        return menu.is(':hover, :focus-within') || button.is(':hover, :focus');
    }

    button.on('click', function () {
        if (isOptionsMenuVisible) {
            hideMenu();
        } else {
            showMenu();
        }
    });
    $(document).on('click', function () {
        if (!isOptionsMenuVisible) return;
        if (!isMouseOverButtonOrMenu()) { hideMenu(); }
    });

    /* $('#set_chat_scenario').on('click', setScenarioOverride); */

    ///////////// OPTIMIZED LISTENERS FOR LEFT SIDE OPTIONS POPUP MENU //////////////////////
    $('#options [id]').on('click', async function (event, customData) {
        const fromSlashCommand = customData?.fromSlashCommand || false;
        var id = $(this).attr('id');

        // Check whether a custom prompt was provided via custom data (for example through a slash command)
        const additionalPrompt = customData?.additionalPrompt?.trim() || undefined;
        const buildOrFillAdditionalArgs = (args = {}) => ({
            ...args,
            ...(additionalPrompt !== undefined && { quiet_prompt: additionalPrompt, quietToLoud: true }),
        });

        if (id == 'option_select_chat') {
            if (this_chid === undefined && !is_send_press && !selected_group) {
                await openPermanentAssistantCard();
            }
            if ((selected_group && !is_group_generating) || (this_chid !== undefined && !is_send_press) || fromSlashCommand) {
                await displayPastChats();
                //this is just to avoid the shadow for past chat view when using /delchat
                //however, the dialog popup still gets one..
                if (!fromSlashCommand) {
                    console.log('displaying shadow');
                    $('#shadow_select_chat_popup').css('display', 'block');
                    $('#shadow_select_chat_popup').css('opacity', 0.0);
                    $('#shadow_select_chat_popup').transition({
                        opacity: 1.0,
                        duration: animation_duration,
                        easing: animation_easing,
                    });
                }
            }
        }

        else if (id == 'option_start_new_chat') {
            if ((selected_group || this_chid !== undefined) && !is_send_press) {
                let deleteCurrentChat = false;
                const result = await Popup.show.confirm(t`要开启新的聊天吗？`, await renderTemplateAsync('newChatConfirm'), {
                    onClose: () => { deleteCurrentChat = !!$('#del_chat_checkbox').prop('checked'); },
                });
                if (!result) {
                    return;
                }

                await doNewChat({ deleteCurrentChat: deleteCurrentChat });
            }
            if (!selected_group && this_chid === undefined && !is_send_press) {
                const alreadyInTempChat = this_chid === undefined && name2 === neutralCharacterName;
                await newAssistantChat({ temporary: alreadyInTempChat });
            }
        }

        else if (id == 'option_regenerate') {
            closeMessageEditor();
            if (is_send_press == false) {
                //hideSwipeButtons();

                if (selected_group) {
                    regenerateGroup();
                }
                else {
                    is_send_press = true;
                    Generate('regenerate', buildOrFillAdditionalArgs());
                }
            }
        }

        else if (id == 'option_impersonate') {
            if (is_send_press == false || fromSlashCommand) {
                is_send_press = true;
                Generate('impersonate', buildOrFillAdditionalArgs());
            }
        }

        else if (id == 'option_continue') {
            if (this_edit_mes_id) return; // don't proceed if editing a message

            if (is_send_press == false || fromSlashCommand) {
                is_send_press = true;
                Generate('continue', buildOrFillAdditionalArgs());
            }
        }

        else if (id == 'option_delete_mes') {
            setTimeout(() => openMessageDelete(fromSlashCommand), animation_duration);
        }

        else if (id == 'option_close_chat') {
            if (is_send_press == false) {
                await waitUntilCondition(() => !isChatSaving, debounce_timeout.extended, 10);
                await clearChat();
                chat.length = 0;
                resetSelectedGroup();
                setCharacterId(undefined);
                setCharacterName('');
                setActiveCharacter(null);
                setActiveGroup(null);
                this_edit_mes_id = undefined;
                chat_metadata = {};
                selected_button = 'characters';
                $('#rm_button_selected_ch').children('h2').text('');
                select_rm_characters();
                await eventSource.emit(event_types.CHAT_CHANGED, getCurrentChatId());
            } else {
                toastr.info(t`请先停止消息生成。`);
            }
        }

        else if (id === 'option_settings') {
            //var checkBox = document.getElementById("waifuMode");
            var topBar = document.getElementById('top-bar');
            var topSettingsHolder = document.getElementById('top-settings-holder');
            var divchat = document.getElementById('chat');

            //if (checkBox.checked) {
            if (topBar.style.display === 'none') {
                topBar.style.display = ''; // or "inline-block" if that's the original display value
                topSettingsHolder.style.display = ''; // or "inline-block" if that's the original display value

                divchat.style.borderRadius = '';
                divchat.style.backgroundColor = '';

            } else {

                divchat.style.borderRadius = '10px'; // Adjust the value to control the roundness of the corners
                divchat.style.backgroundColor = ''; // Set the background color to your preference

                topBar.style.display = 'none';
                topSettingsHolder.style.display = 'none';
            }
            //}
        }
        hideMenu();
    });

    $('#newChatFromManageScreenButton').on('click', async function () {
        await doNewChat({ deleteCurrentChat: false });
        $('#select_chat_cross').trigger('click');
    });

    //////////////////////////////////////////////////////////////////////////////////////////////

    //functionality for the cancel delete messages button, reverts to normal display of input form
    $('#dialogue_del_mes_cancel').on('click', function () {
        $('#dialogue_del_mes').css('display', 'none');
        $('#send_form').css('display', css_send_form_display);
        $('.del_checkbox').each(function () {
            $(this).css('display', 'none');
            $(this).parent().children('.for_checkbox').css('display', 'block');
            $(this).parent().removeClass('selected');
            $(this).prop('checked', false);
        });
        showSwipeButtons();
        this_del_mes = -1;
        is_delete_mode = false;
    });

    //confirms message deletion with the "ok" button
    $('#dialogue_del_mes_ok').on('click', async function () {
        $('#dialogue_del_mes').css('display', 'none');
        $('#send_form').css('display', css_send_form_display);
        $('.del_checkbox').each(function () {
            $(this).css('display', 'none');
            $(this).parent().children('.for_checkbox').css('display', 'block');
            $(this).parent().removeClass('selected');
            $(this).prop('checked', false);
        });
        rebuildMessageDomRegistry();

        if (this_del_mes >= 0) {
            for (let id = this_del_mes; id < chat.length; id++) {
                const element = getMessageDom(id);
                if (element) {
                    unregisterMessageDom(id, element);
                    element.remove();
                }
            }
            chat.length = this_del_mes;
            chat_metadata['tainted'] = true;
            await saveChatConditional();
            chatElement.scrollTop(chatElement[0].scrollHeight);
            await eventSource.emit(event_types.MESSAGE_DELETED, chat.length);
            const lastVisibleId = Math.max(0, ...getMountedMessageIds());
            const lastElement = getMessageDom(lastVisibleId);
            if (lastElement) {
                lastElement.classList.add('last_mes');
            }
        } else {
            console.log('this_del_mes is not >= 0, not deleting');
        }

        showSwipeButtons();
        this_del_mes = -1;
        is_delete_mode = false;
    });

    $('#main_api').on('change', async function () {
        cancelStatusCheck('Canceled because main api changed');
        changeMainAPI();
        saveSettingsDebounced();
        await eventSource.emit(event_types.MAIN_API_CHANGED, { apiId: main_api });
    });

    ////////////////// OPTIMIZED RANGE SLIDER LISTENERS////////////////

    var sliderLocked = true;
    var sliderTimer;

    $('input[type=\'range\']').on('touchstart', function () {
        // Unlock the slider after 300ms
        setTimeout(function () {
            sliderLocked = false;
            $(this).css('background-color', 'var(--SmartThemeQuoteColor)');
        }.bind(this), 300);
    });

    $('input[type=\'range\']').on('touchend', function () {
        clearTimeout(sliderTimer);
        $(this).css('background-color', '');
        sliderLocked = true;
    });

    $('input[type=\'range\']').on('touchmove', function (event) {
        if (sliderLocked) {
            event.preventDefault();
        }
    });

    const sliders = [
        {
            sliderId: '#amount_gen',
            counterId: '#amount_gen_counter',
            format: (val) => `${val}`,
            setValue: (val) => { amount_gen = Number(val); },
        },
        {
            sliderId: '#max_context',
            counterId: '#max_context_counter',
            format: (val) => `${val}`,
            setValue: (val) => { max_context = Number(val); },
        },
    ];

    for (const slider of sliders) {
        delegateLeftNav('input', slider.sliderId, function () {
            const value = $(this).val();
            const formattedValue = slider.format(value);
            slider.setValue(value);
            $(slider.counterId).val(formattedValue);
            saveSettingsDebounced();
        }, { namespace: 'coreSliders' });
    }

    //////////////////////////////////////////////////////////////

    $('#select_chat_cross').on('click', function () {
        $('#shadow_select_chat_popup').transition({
            opacity: 0,
            duration: animation_duration,
            easing: animation_easing,
        });
        setTimeout(function () { $('#shadow_select_chat_popup').css('display', 'none'); }, animation_duration);
    });

    $chat.on('pointerup', '.mes_copy', async function () {
        if (this_chid !== undefined || selected_group || name2 === neutralCharacterName) {
            try {
                const messageId = $(this).closest('.mes').attr('mesid');
                const text = chat[messageId]['mes'];
                await copyText(text);
                toastr.info('Copied!', '', { timeOut: 2000 });
            } catch (err) {
                console.error('Failed to copy: ', err);
            }
        }
    });

    //********************
    //***Message Editor***
    $chat.on('click', '.mes_edit', async function () {
        if (is_delete_mode) {
            return;
        }
        if (this_chid !== undefined || selected_group || name2 === neutralCharacterName) {
            // Previously system messages we're allowed to be edited
            /*const message = $(this).closest(".mes");

            if (message.data("isSystem")) {
                return;
            }*/

            let chatScrollPosition = $('#chat').scrollTop();
            if (this_edit_mes_id !== undefined) {
                let mes_edited = $(`#chat [mesid="${this_edit_mes_id}"]`).find('.mes_edit_done');
                if (Number(edit_mes_id) == chat.length - 1) { //if the generating swipe (...)
                    let run_edit = true;
                    if (chat[edit_mes_id]['swipe_id'] !== undefined) {
                        if (chat[edit_mes_id]['swipes'].length === chat[edit_mes_id]['swipe_id']) {
                            run_edit = false;
                        }
                    }
                    if (run_edit) {
                        hideSwipeButtons();
                    }
                }
                await messageEditDone(mes_edited);
            }
            $(this).closest('.mes_block').find('.mes_text').empty();
            $(this).closest('.mes_block').find('.mes_buttons').css('display', 'none');
            $(this).closest('.mes_block').find('.mes_edit_buttons').css('display', 'inline-flex');
            var edit_mes_id = $(this).closest('.mes').attr('mesid');
            this_edit_mes_id = edit_mes_id;

            // Also edit reasoning, if it exists
            const reasoningEdit = $(this).closest('.mes_block').find('.mes_reasoning_edit:visible');
            if (reasoningEdit.length > 0) {
                reasoningEdit.trigger('click');
            }

            var text = chat[edit_mes_id]['mes'];
            if (chat[edit_mes_id]['is_user']) {
                this_edit_mes_chname = name1;
            } else if (chat[edit_mes_id]['force_avatar']) {
                this_edit_mes_chname = chat[edit_mes_id]['name'];
            } else {
                this_edit_mes_chname = name2;
            }
            if (power_user.trim_spaces) {
                text = text.trim();
            }
            $(this)
                .closest('.mes_block')
                .find('.mes_text')
                .append(
                    '<textarea id=\'curEditTextarea\' class=\'edit_textarea mdHotkeys\'></textarea>',
                );
            $('#curEditTextarea').val(text);
            let edit_textarea = $(this)
                .closest('.mes_block')
                .find('.edit_textarea');
            if (!cssAutofit) {
                edit_textarea.height(0);
                edit_textarea.height(edit_textarea[0].scrollHeight);
            }
            edit_textarea.trigger('focus');
            const textAreaElement = /** @type {HTMLTextAreaElement} */ (edit_textarea[0]);
            // Sets the cursor at the end of the text
            textAreaElement.setSelectionRange(
                String(edit_textarea.val()).length,
                String(edit_textarea.val()).length,
            );
            if (Number(this_edit_mes_id) === chat.length - 1) {
                $('#chat').scrollTop(chatScrollPosition);
            }

            updateEditArrowClasses();
        }
    });

    $chat.on('input', '#curEditTextarea', function () {
        if (power_user.auto_save_msg_edits === true) {
            messageEditAuto($(this));
        }
    });

    $chat.on('click', '.extraMesButtonsHint', function (e) {
        const $hint = $(e.target);
        const $buttons = $hint.siblings('.extraMesButtons');

        $hint.transition({
            opacity: 0,
            duration: animation_duration,
            easing: animation_easing,
            complete: function () {
                $hint.hide();
                $buttons
                    .addClass('visible')
                    .css({
                        opacity: 0,
                        display: 'flex',
                    })
                    .transition({
                        opacity: 1,
                        duration: animation_duration,
                        easing: animation_easing,
                    });
            },
        });
    });

    $(document).on('click', function (e) {
        // Expanded options don't need to be closed
        if (power_user.expand_message_actions) {
            return;
        }

        // Check if the click was outside the relevant elements
        if (!$(e.target).closest('.extraMesButtons, .extraMesButtonsHint').length) {
            const $visibleButtons = $('.extraMesButtons.visible');

            if (!$visibleButtons.length) {
                return;
            }

            const $hiddenHints = $('.extraMesButtonsHint:hidden');

            // Transition out the .extraMesButtons first
            $visibleButtons.transition({
                opacity: 0,
                duration: animation_duration,
                easing: animation_easing,
                complete: function () {
                    // Hide the .extraMesButtons after the transition
                    $(this)
                        .hide()
                        .removeClass('visible');

                    // Transition the .extraMesButtonsHint back in
                    $hiddenHints
                        .show()
                        .transition({
                            opacity: 0.3,
                            duration: animation_duration,
                            easing: animation_easing,
                            complete: function () {
                                $(this).css('opacity', '');
                            },
                        });
                },
            });
        }
    });

    $chat.on('click', '.mes_edit_cancel', async function () {
        let text = chat[this_edit_mes_id]['mes'];

        $(this).closest('.mes_block').find('.mes_text').empty();
        $(this).closest('.mes_edit_buttons').css('display', 'none');
        $(this).closest('.mes_block').find('.mes_buttons').css('display', '');
        $(this)
            .closest('.mes_block')
            .find('.mes_text')
            .append(messageFormatting(
                text,
                this_edit_mes_chname,
                chat[this_edit_mes_id].is_system,
                chat[this_edit_mes_id].is_user,
                this_edit_mes_id,
                {},
                false,
            ));
        appendMediaToMessage(chat[this_edit_mes_id], $(this).closest('.mes'));
        addCopyToCodeBlocks($(this).closest('.mes'));

        const reasoningEditDone = $(this).closest('.mes_block').find('.mes_reasoning_edit_cancel:visible');
        if (reasoningEditDone.length > 0) {
            reasoningEditDone.trigger('click');
        }

        await eventSource.emit(event_types.MESSAGE_UPDATED, this_edit_mes_id);
        this_edit_mes_id = undefined;
    });

    $chat.on('click', '.mes_edit_up', async function () {
        if (is_send_press || this_edit_mes_id <= 0) {
            return;
        }

        hideSwipeButtons();
        const targetId = Number(this_edit_mes_id) - 1;
        const target = $(`#chat .mes[mesid="${targetId}"]`);
        const root = $(this).closest('.mes');

        if (root.length === 0 || target.length === 0) {
            return;
        }

        root.insertBefore(target);

        target.attr('mesid', this_edit_mes_id);
        root.attr('mesid', targetId);

        const temp = chat[targetId];
        chat[targetId] = chat[this_edit_mes_id];
        chat[this_edit_mes_id] = temp;

        this_edit_mes_id = targetId;
        updateViewMessageIds();
        await saveChatConditional();
        showSwipeButtons();
    });

    $chat.on('click', '.mes_edit_down', async function () {
        if (is_send_press || this_edit_mes_id >= chat.length - 1) {
            return;
        }

        hideSwipeButtons();
        const targetId = Number(this_edit_mes_id) + 1;
        const target = $(`#chat .mes[mesid="${targetId}"]`);
        const root = $(this).closest('.mes');

        if (root.length === 0 || target.length === 0) {
            return;
        }

        root.insertAfter(target);

        target.attr('mesid', this_edit_mes_id);
        root.attr('mesid', targetId);

        const temp = chat[targetId];
        chat[targetId] = chat[this_edit_mes_id];
        chat[this_edit_mes_id] = temp;

        this_edit_mes_id = targetId;
        updateViewMessageIds();
        await saveChatConditional();
        showSwipeButtons();
    });

    $chat.on('click', '.mes_edit_copy', async function () {
        const confirmation = await callGenericPopup(t`要创建此消息的副本吗？`, POPUP_TYPE.CONFIRM);
        if (!confirmation) {
            return;
        }

        hideSwipeButtons();
        const oldScroll = chatElement[0].scrollTop;
        const clone = structuredClone(chat[this_edit_mes_id]);
        clone.send_date = Date.now();
        clone.mes = $(this).closest('.mes').find('.edit_textarea').val();

        if (power_user.trim_spaces) {
            clone.mes = clone.mes.trim();
        }

        chat.splice(Number(this_edit_mes_id) + 1, 0, clone);
        addOneMessage(clone, { insertAfter: this_edit_mes_id });

        updateViewMessageIds();
        await saveChatConditional();
        chatElement[0].scrollTop = oldScroll;
        showSwipeButtons();
    });

    $chat.on('click', '.mes_edit_delete', async function (event, customData) {
        const fromSlashCommand = customData?.fromSlashCommand || false;
        const canDeleteSwipe = (Array.isArray(chat[this_edit_mes_id].swipes) && chat[this_edit_mes_id].swipes.length > 1 && !chat[this_edit_mes_id].is_user && parseInt(this_edit_mes_id) === chat.length - 1);

        let deleteOnlySwipe = false;
        if (power_user.confirm_message_delete && fromSlashCommand !== true) {
            const result = await callGenericPopup(t`确定要删除这条消息吗？`, POPUP_TYPE.CONFIRM, null, {
                okButton: canDeleteSwipe ? t`删除候选` : t`删除消息`,
                cancelButton: t`取消`,
                customButtons: canDeleteSwipe ? [t`删除消息`] : null,
            });
            if (!result) {
                return;
            }
            deleteOnlySwipe = canDeleteSwipe && result === 1; // Default button, not the custom one
        }

        const messageElement = $(this).closest('.mes');
        if (!messageElement) {
            return;
        }

        if (deleteOnlySwipe) {
            const message = chat[this_edit_mes_id];
            const swipe_id = message.swipe_id;
            await deleteSwipe(swipe_id);
            return;
        }

        chat.splice(this_edit_mes_id, 1);
        messageElement.remove();

        let startFromZero = Number(this_edit_mes_id) === 0;

        this_edit_mes_id = undefined;
        chat_metadata['tainted'] = true;

        updateViewMessageIds(startFromZero);
        saveChatDebounced();

        hideSwipeButtons();
        showSwipeButtons();

        await eventSource.emit(event_types.MESSAGE_DELETED, chat.length);
    });

    $chat.on('click', '.mes_edit_done', async function () {
        await messageEditDone($(this));
    });

    //Select chat

    //**************************CHARACTER IMPORT EXPORT*************************//
    $('#character_import_button').on('click', function () {
        $('#character_import_file').trigger('click');
    });

    $('#character_import_file').on('change', async function (e) {
        $('#rm_info_avatar').html('');

        if (!(e.target instanceof HTMLInputElement)) {
            return;
        }

        if (!e.target.files.length) {
            return;
        }

        const avatarFileNames = [];
        for (const file of e.target.files) {
            const avatarFileName = await importCharacter(file);
            if (avatarFileName !== undefined) {
                avatarFileNames.push(avatarFileName);
            }
        }

        if (avatarFileNames.length > 0) {
            await importCharactersTags(avatarFileNames);
            selectImportedChar(avatarFileNames[avatarFileNames.length - 1]);
        }

        // Clear the file input value to allow re-uploading the same file
        e.target.value = '';
    });

    $('#export_button').on('click', function () {
        isExportPopupOpen = !isExportPopupOpen;
        $('#export_format_popup').toggle(isExportPopupOpen);
        exportPopper.update();
    });

    $(document).on('click', '.export_format', async function () {
        const format = $(this).data('format');

        if (!format) {
            return;
        }

        $('#export_format_popup').hide();
        isExportPopupOpen = false;
        exportPopper.update();

        // Save before exporting
        await createOrEditCharacter();
        const body = { format, avatar_url: characters[this_chid].avatar };

        const response = await fetch('/api/characters/export', {
            method: 'POST',
            headers: getRequestHeaders(),
            body: JSON.stringify(body),
        });

        if (response.ok) {
            const filename = characters[this_chid].avatar.replace('.png', `.${format}`);
            const blob = await response.blob();
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.setAttribute('download', filename);
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(a.href);
            document.body.removeChild(a);
        }
    });
    //**************************CHAT IMPORT EXPORT*************************//
    $('#chat_import_button').on('click', function () {
        $('#chat_import_file').trigger('click');
    });

    $('#chat_import_file').on('change', async function (e) {
        const targetElement = /** @type {HTMLInputElement} */ (e.target);
        if (!(targetElement instanceof HTMLInputElement)) {
            return;
        }
        const file = targetElement.files[0];

        if (!file) {
            return;
        }

        const ext = file.name.match(/\.(\w+)$/);
        if (
            !ext ||
            (ext[1].toLowerCase() != 'json' && ext[1].toLowerCase() != 'jsonl')
        ) {
            return;
        }

        if (selected_group && file.name.endsWith('.json')) {
            toastr.warning('Only SillyTavern\'s own format is supported for group chat imports. Sorry!');
            return;
        }

        const format = ext[1].toLowerCase();
        $('#chat_import_file_type').val(format);

        const formData = new FormData(/** @type {HTMLFormElement} */($('#form_import_chat').get(0)));
        formData.append('user_name', name1);
        $('#select_chat_div').html('');

        if (selected_group) {
            await importGroupChat(formData, e.originalEvent.target);
        } else {
            await importCharacterChat(formData, e.originalEvent.target);
        }
    });

    $('#rm_button_group_chats').on('click', function () {
        selected_button = 'group_chats';
        select_group_chats();
    });

    $('#rm_button_back_from_group').on('click', function () {
        selected_button = 'characters';
        select_rm_characters();
    });

    $('#dupe_button').on('click', async function () {
        await duplicateCharacter();
    });

    $('.drawer-toggle').on('click', doNavbarIconClick);

    const handleBodyPointerDown = async (event) => {
        const clickTarget = $(event.target);

        if (isExportPopupOpen
            && clickTarget.closest('#export_button').length == 0
            && clickTarget.closest('#export_format_popup').length == 0) {
            $('#export_format_popup').hide();
            isExportPopupOpen = false;
            scheduleLowPriorityTask(() => exportPopper.update(), { priority: 'user-visible' });
        }

        const forbiddenTargets = [
            '#character_cross',
            '#avatar-and-name-block',
            '#shadow_popup',
            '.popup',
            '#world_popup',
            '.ui-widget',
            '.text_pole',
            '#toast-container',
            '.select2-results',
        ];

        for (const id of forbiddenTargets) {
            if (clickTarget.closest(id).length > 0) {
                return;
            }
        }

        // This autocloses open drawers that are not pinned if a click happens inside the app which does not target them.
        const targetParentHasOpenDrawer = clickTarget.parents('.openDrawer').length;
        if (!clickTarget.hasClass('drawer-icon') && !clickTarget.hasClass('openDrawer')) {
            const $openDrawers = $('.openDrawer').not('.pinnedOpen');
            if ($openDrawers.length && targetParentHasOpenDrawer === 0) {
                // Toggle icon and drawer classes
                $('.openIcon').not('.drawerPinnedOpen').toggleClass('closedIcon openIcon');
                $openDrawers.toggleClass('closedDrawer openDrawer');
            }
        }
    };
    addManagedEventListener(document.body, 'pointerdown', handleBodyPointerDown, {
        throttle: BODY_POINTER_THROTTLE_MS,
        passive: 'auto',
    });

    const handleInlineDrawerToggle = async (toggleElement, eventTarget) => {
        if (eventTarget.classList?.contains('text_pole')) {
            return;
        }

        const $toggle = $(toggleElement);
        const drawer = $toggle.closest('.inline-drawer');
        const icon = drawer.find('>.inline-drawer-header .inline-drawer-icon');
        const drawerContent = drawer.find('>.inline-drawer-content');

        icon.toggleClass('down up');
        icon.toggleClass('fa-circle-chevron-down fa-circle-chevron-up');
        drawer.trigger('inline-drawer-toggle');

        drawerContent.stop().slideToggle({
            complete: () => {
                $toggle.css('height', '');
            },
        });

        if (!CSS.supports('field-sizing', 'content')) {
            const textareas = drawerContent.find('textarea.autoSetHeight');
            for (const textarea of textareas) {
                await resetScrollHeight($(textarea));
            }
        }
    };

    const handleInlineDrawerMaximize = (buttonElement) => {
        const $button = $(buttonElement);
    const icon = $button.find('.inline-drawer-icon, .floating_panel_maximize');
    icon.toggleClass('fa-window-maximize fa-window-restore');
    const drawerContent = $button.closest('.drawer-content');
    drawerContent.toggleClass('maximized');
    const drawerId = drawerContent.attr('id');
    scheduleLowPriorityTask(() => resetMovableStyles(drawerId), { priority: 'user-visible' });
};

    const handleBodyClick = async (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
            return;
        }
        const opener = target.closest('.drawer-opener');
        if (opener) {
            doDrawerOpenClick.call(opener, event);
            return;
        }

        const toggle = target.closest('.inline-drawer-toggle');
        if (toggle) {
            await handleInlineDrawerToggle(toggle, target);
            return;
        }

        const maximize = target.closest('.inline-drawer-maximize');
        if (maximize) {
            handleInlineDrawerMaximize(maximize);
        }
    };
    addManagedEventListener(document.body, 'click', handleBodyClick);

    const sendFormShell = document.getElementById('form_sheld');
    if (sendFormShell) {
        addManagedEventListener(sendFormShell, 'click', (event) => {
            const target = event.target instanceof Element ? event.target.closest('.stscript_btn') : null;
            if (!target) {
                return;
            }

            if (target.classList.contains('stscript_continue') || target.classList.contains('stscript_pause')) {
                pauseScriptExecution();
                return;
            }

            if (target.classList.contains('stscript_stop')) {
                stopScriptExecution();
            }
        });
    }

    const mesStopButton = document.getElementById('mes_stop');
    if (mesStopButton) {
        addManagedEventListener(mesStopButton, 'click', () => stopGeneration());
    }

    $chat.on('click', '.mes .avatar', function () {
        const messageElement = $(this).closest('.mes');
    const avatarImg = $(this).children('img');
    const imgElement = avatarImg.get(0);
    let thumbURL = avatarImg.attr('src') || avatarImg.attr('data-avatar-src') || '';
    if (imgElement instanceof HTMLImageElement) {
        const meta = getManagedLazyImageMeta(imgElement);
        if (meta && (!thumbURL || !thumbURL.length)) {
            if (!imgElement.getAttribute('src')) {
                startLazyImageLoad(imgElement, meta);
            }
            thumbURL = meta.src || thumbURL;
        }
        if (!thumbURL || !thumbURL.length) {
            thumbURL = resolveAvatarSource(imgElement);
            if (thumbURL) {
                avatarImg.attr('data-avatar-src', thumbURL);
            }
        }
    } else if (!thumbURL || !thumbURL.length) {
        const forceAvatar = messageElement.attr('force_avatar');
        if (forceAvatar) {
            thumbURL = forceAvatar;
        } else if (messageElement.attr('is_user') === 'true') {
            thumbURL = typeof user_avatar === 'string' && user_avatar.length
                ? getThumbnailUrl('persona', user_avatar)
                : default_user_avatar;
        } else if (messageElement.attr('is_system') === 'true') {
            thumbURL = system_avatar || default_avatar;
        } else {
            thumbURL = default_avatar;
        }
    }
    const charsPath = '/characters/';
    if (typeof thumbURL !== 'string' || !thumbURL.length) {
        console.warn('Avatar zoom skipped: missing thumbnail src', { thumbURL });
        return;
    }
        const separatorIndex = thumbURL.lastIndexOf('=');
        const targetAvatarImg = separatorIndex >= 0 ? thumbURL.substring(separatorIndex + 1) : thumbURL.substring(thumbURL.lastIndexOf('/') + 1);
        const charname = targetAvatarImg.replace('.png', '');
        const isValidCharacter = characters.some(x => x.avatar === decodeURIComponent(targetAvatarImg));

        // Remove existing zoomed avatars for characters that are not the clicked character when moving UI is not enabled
        if (!power_user.movingUI) {
            $('.zoomed_avatar').each(function () {
                const currentForChar = $(this).attr('forChar');
                if (currentForChar !== charname && typeof currentForChar !== 'undefined') {
                    console.debug(`Removing zoomed avatar for character: ${currentForChar}`);
                    $(this).remove();
                }
            });
        }

        const avatarSrc = (isDataURL(thumbURL) || /^\/?img\/(?:.+)/.test(thumbURL)) ? thumbURL : charsPath + targetAvatarImg;
        if ($(`.zoomed_avatar[forChar="${charname}"]`).length) {
            console.debug('removing container as it already existed');
            $(`.zoomed_avatar[forChar="${charname}"]`).fadeOut(animation_duration, () => {
                $(`.zoomed_avatar[forChar="${charname}"]`).remove();
            });
        } else {
            console.debug('making new container from template');
            const template = $('#zoomed_avatar_template').html();
            const newElement = $(template);
            newElement.attr('forChar', charname);
            newElement.attr('id', `zoomFor_${charname}`);
            newElement.addClass('draggable');
            newElement.find('.drag-grabber').attr('id', `zoomFor_${charname}header`);

            $('body').append(newElement);
            newElement.fadeIn(animation_duration);
            const zoomedAvatarImgElement = $(`.zoomed_avatar[forChar="${charname}"] img`);
            if (messageElement.attr('is_user') == 'true' || (messageElement.attr('is_system') == 'true' && !isValidCharacter)) {
                //handle user and system avatars
                const isValidPersona = decodeURIComponent(targetAvatarImg) in power_user.personas;
                if (isValidPersona) {
                    const personaSrc = getUserAvatar(targetAvatarImg);
                    zoomedAvatarImgElement.attr('src', personaSrc);
                    zoomedAvatarImgElement.attr('data-izoomify-url', personaSrc);
                } else {
                    zoomedAvatarImgElement.attr('src', thumbURL);
                    zoomedAvatarImgElement.attr('data-izoomify-url', thumbURL);
                }
            } else if (messageElement.attr('is_user') == 'false') { //handle char avatars
                zoomedAvatarImgElement.attr('src', avatarSrc);
                zoomedAvatarImgElement.attr('data-izoomify-url', avatarSrc);
            }
            loadMovingUIState();
            $(`.zoomed_avatar[forChar="${charname}"]`).css('display', 'flex');
            dragElement(newElement);

            if (power_user.zoomed_avatar_magnification) {
                $('.zoomed_avatar_container').izoomify();
            }

            $('.zoomed_avatar, .zoomed_avatar .dragClose').on('click touchend', (e) => {
                if (e.target.closest('.dragClose')) {
                    $(`.zoomed_avatar[forChar="${charname}"]`).fadeOut(animation_duration, () => {
                        $(`.zoomed_avatar[forChar="${charname}"]`).remove();
                    });
                }
            });

            zoomedAvatarImgElement.on('dragstart', (e) => {
                console.log('saw drag on avatar!');
                e.preventDefault();
                return false;
            });
        }
    });

    document.addEventListener('click', function (e) {
        if (!(e.target instanceof HTMLElement)) return;
        if (e.target.matches('#OpenAllWIEntries')) {
            document.querySelectorAll('#world_popup_entries_list .inline-drawer').forEach((/** @type {HTMLElement} */ drawer) => {
                delay(0).then(() => toggleDrawer(drawer, true));
            });
        } else if (e.target.matches('#CloseAllWIEntries')) {
            document.querySelectorAll('#world_popup_entries_list .inline-drawer').forEach((/** @type {HTMLElement} */ drawer) => {
                toggleDrawer(drawer, false);
            });
        }
    });

    $(document).on('click', '.open_alternate_greetings', openAlternateGreetings);
    /* $('#set_character_world').on('click', openCharacterWorldPopup); */

    $(document).on('focus', 'input.auto-select, textarea.auto-select', function () {
        if (!power_user.enable_auto_select_input) return;
        const control = $(this)[0];
        if (control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement) {
            control.select();
            console.debug('Auto-selecting content of input control', control);
        }
    });

    $(document).on('keyup', function (e) {
        if (e.key === 'Escape') {
            const isEditVisible = $('#curEditTextarea').is(':visible') || $('.reasoning_edit_textarea').length > 0;
            if (isEditVisible && power_user.auto_save_msg_edits === false) {
                closeMessageEditor('all');
                $('#send_textarea').trigger('focus');
                return;
            }
            if (isEditVisible && power_user.auto_save_msg_edits === true) {
                $(`#chat .mes[mesid="${this_edit_mes_id}"] .mes_edit_done`).trigger('click');
                closeMessageEditor('reasoning');
                $('#send_textarea').trigger('focus');
                return;
            }
            if (!this_edit_mes_id && $('#mes_stop').is(':visible')) {
                $('#mes_stop').trigger('click');
                if (chat.length && Array.isArray(chat[chat.length - 1].swipes) && chat[chat.length - 1].swipe_id == chat[chat.length - 1].swipes.length) {
                    $('.last_mes .swipe_left').trigger('click');
                }
            }
        }
    });

    $('#char-management-dropdown').on('change', async (e) => {
        const targetElement = /** @type {HTMLSelectElement} */ (e.target);
        const target = $(targetElement.selectedOptions).attr('id');
        switch (target) {
            case 'set_character_world':
                await openCharacterWorldPopup();
                break;
            case 'set_chat_scenario':
                await setScenarioOverride();
                break;
            case 'renameCharButton':
                await renameCharacter();
                break;
            case 'import_character_info':
                await importEmbeddedWorldInfo();
                saveCharacterDebounced();
                break;
            case 'character_source': {
                const source = getCharacterSource(this_chid);
                if (source && isValidUrl(source)) {
                    const url = new URL(source);
                    const confirm = await Popup.show.confirm('Open Source', `<span>Do you want to open the link to ${url.hostname} in a new tab?</span><var>${url}</var>`);
                    if (confirm) {
                        window.open(source, '_blank');
                    }
                } else {
                    toastr.info(t`该角色似乎没有来源信息。`);
                }
            } break;
            case 'replace_update': {
                const confirm = await Popup.show.confirm(t`替换角色`, '<p>' + t`选择新的角色卡片替换当前角色。` + '</p>' + t`聊天记录、资源与群组关联会被保留，但角色数据的本地修改将会丢失。` + '<br />' + t`是否继续？`);
                if (confirm) {
                    async function uploadReplacementCard(e) {
                        const file = e.target.files[0];

                        if (!file) {
                            return;
                        }

                        try {
                            const chatFile = characters[this_chid]['chat'];
                            const data = new Map();
                            data.set(file, characters[this_chid].avatar);
                            await processDroppedFiles([file], data);
                            await openCharacterChat(chatFile);
                            await fetch(getThumbnailUrl('avatar', characters[this_chid].avatar), { cache: 'reload' });
                        } catch {
                            toastr.error('Failed to replace the character card.', 'Something went wrong');
                        }
                    }
                    $('#character_replace_file').off('change').on('change', uploadReplacementCard).trigger('click');
                }
            } break;
            case 'import_tags': {
                await importTags(characters[this_chid], { importSetting: tag_import_setting.ASK });
            } break;
            /*case 'delete_button':
                popup_type = "del_ch";
                callPopup(`
                        <h3>Delete the character?</h3>
                        <b>THIS IS PERMANENT!<br><br>
                        THIS WILL ALSO DELETE ALL<br>
                        OF THE CHARACTER'S CHAT FILES.<br><br></b>`
                );
                break;*/
            default:
                await eventSource.emit(event_types.CHARACTER_MANAGEMENT_DROPDOWN, target);
        }
        $('#char-management-dropdown').prop('selectedIndex', 0);
    });

    $(window).on('beforeunload', () => {
        cancelTtsPlay();
        if (streamingProcessor) {
            console.log('Page reloaded. Aborting streaming...');
            streamingProcessor.onStopStreaming();
        }
    });


    var isManualInput = false;
    var valueBeforeManualInput;

    $(document).on('input', '.range-block-counter input, .neo-range-input', function () {
        valueBeforeManualInput = $(this).val();
        console.log(valueBeforeManualInput);
    });

    $(document).on('change', '.range-block-counter input, .neo-range-input', function (e) {
        if (!(e.target instanceof HTMLElement)) {
            return;
        }
        e.target.focus();
        e.target.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
    });

    $(document).on('keydown', '.range-block-counter input, .neo-range-input', function (e) {
        const masterSelector = '#' + $(this).data('for');
        const masterElement = $(masterSelector);
        if (e.key === 'Enter') {
            let manualInput = Number($(this).val());
            if (isManualInput) {
                //disallow manual inputs outside acceptable range
                if (manualInput >= Number($(this).attr('min')) && manualInput <= Number($(this).attr('max'))) {
                    //if value is ok, assign to slider and update handle text and position
                    //newSlider.val(manualInput)
                    //handleSlideEvent.call(newSlider, null, { value: parseFloat(manualInput) }, 'manual');
                    valueBeforeManualInput = manualInput;
                    $(masterElement).val($(this).val()).trigger('input', { forced: true });
                } else {
                    //if value not ok, warn and reset to last known valid value
                    toastr.warning(`Invalid value. Must be between ${$(this).attr('min')} and ${$(this).attr('max')}`);
                    //newSlider.val(valueBeforeManualInput)
                    $(this).val(valueBeforeManualInput);
                }
            }
        }
    });

    $(document).on('keyup', '.range-block-counter input, .neo-range-input', function () {
        valueBeforeManualInput = $(this).val();
        isManualInput = true;
    });

    //trigger slider changes when user clicks away
    $(document).on('mouseup blur', '.range-block-counter input, .neo-range-input', function () {
        const masterSelector = '#' + $(this).data('for');
        const masterElement = $(masterSelector);
        let manualInput = Number($(this).val());
        if (isManualInput) {
            //if value is between correct range for the slider
            if (manualInput >= Number($(this).attr('min')) && manualInput <= Number($(this).attr('max'))) {
                valueBeforeManualInput = manualInput;
                //set the slider value to input value
                $(masterElement).val($(this).val()).trigger('input', { forced: true });
            } else {
                //if value not ok, warn and reset to last known valid value
                toastr.warning(`Invalid value. Must be between ${$(this).attr('min')} and ${$(this).attr('max')}`);
                $(this).val(valueBeforeManualInput);
            }
        }
        isManualInput = false;
    });

    $('.user_stats_button').on('click', function () {
        userStatsHandler();
    });

    $(document).on('click', '.external_import_button, #external_import_button', async () => {
        const html = await renderTemplateAsync('importCharacters');
        const input = await callGenericPopup(html, POPUP_TYPE.INPUT, '', { allowVerticalScrolling: true, wider: true, okButton: $('#popup_template').attr('popup-button-import'), rows: 4 });

        if (!input) {
            console.debug('Custom content import cancelled');
            return;
        }

        // break input into one input per line
        const inputs = String(input).split('\n').map(x => x.trim()).filter(x => x.length > 0);

        for (const url of inputs) {
            let request;

            if (isValidUrl(url)) {
                console.debug('Custom content import started for URL: ', url);
                request = await fetch('/api/content/importURL', {
                    method: 'POST',
                    headers: getRequestHeaders(),
                    body: JSON.stringify({ url }),
                });
            } else {
                console.debug('Custom content import started for Char UUID: ', url);
                request = await fetch('/api/content/importUUID', {
                    method: 'POST',
                    headers: getRequestHeaders(),
                    body: JSON.stringify({ url }),
                });
            }

            if (!request.ok) {
                toastr.info(request.statusText, 'Custom content import failed');
                console.error('Custom content import failed', request.status, request.statusText);
                return;
            }

            const data = await request.blob();
            const customContentType = request.headers.get('X-Custom-Content-Type');
            const fileName = request.headers.get('Content-Disposition').split('filename=')[1].replace(/"/g, '');
            const file = new File([data], fileName, { type: data.type });

            switch (customContentType) {
                case 'character':
                    await processDroppedFiles([file]);
                    break;
                case 'lorebook':
                    await importWorldInfo(file);
                    break;
                default:
                    toastr.warning('Unknown content type');
                    console.error('Unknown content type', customContentType);
                    break;
            }
        }
    });

    charDragDropHandler = new DragAndDropHandler('body', async (files, event) => {
        if (!files.length) {
            await importFromURL(event.originalEvent.dataTransfer.items, files);
        }
        await processDroppedFiles(files);
    }, { noAnimation: true });

    $('#open_onboarding_panel_button').on('click', async () => {
        await doOnboarding(user_avatar);
    });

    $(document).on('click', '.onboarding-close-button', async () => {
        const popups = Popup.util?.popups;
        const popup = popups && popups.length > 0 ? popups[popups.length - 1] : null;
        if (popup) {
            await popup.complete(POPUP_RESULT.CANCELLED);
        }
    });

    $('#charListGridToggle').on('click', async () => {
        doCharListDisplaySwitch();
    });

    $('#hideCharPanelAvatarButton').on('click', () => {
        $('#avatar-and-name-block').slideToggle();
    });

    $(document).on('mouseup touchend', '#show_more_messages', async function () {
        await showMoreMessages();
    });

    $(document).on('click', '.open_characters_library', async function () {
        await getCharacters();
        await eventSource.emit(event_types.OPEN_CHARACTER_LIBRARY);
    });

    // Added here to prevent execution before script.js is loaded and get rid of quirky timeouts
    await firstLoadInit();

    addManagedEventListener(window, 'beforeunload', (e) => {
        if (isChatSaving) {
            e.preventDefault();
            e.returnValue = true;
        }
    });
});
