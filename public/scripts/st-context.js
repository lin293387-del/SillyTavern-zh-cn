import {
    activateSendButtons,
    addOneMessage,
    appendMediaToMessage,
    callPopup,
    characters,
    chat,
    chat_metadata,
    CONNECT_API_MAP,
    create_save,
    deactivateSendButtons,
    event_types,
    eventSource,
    extension_prompts,
    extractMessageFromData,
    Generate,
    generateQuietPrompt,
    getCharacters,
    getCurrentChatId,
    getRequestHeaders,
    getThumbnailUrl,
    main_api,
    max_context,
    menu_type,
    messageFormatting,
    name1,
    name2,
    online_status,
    openCharacterChat,
    reloadCurrentChat,
    renameChat,
    saveChatConditional,
    saveMetadata,
    saveReply,
    saveSettingsDebounced,
    selectCharacterById,
    sendGenerationRequest,
    sendStreamingRequest,
    sendSystemMessage,
    setExtensionPrompt,
    stopGeneration,
    streamingProcessor,
    substituteParams,
    substituteParamsExtended,
    this_chid,
    updateChatMetadata,
    updateMessageBlock,
    printMessages,
    clearChat,
    unshallowCharacter,
    deleteLastMessage,
    getCharacterCardFields,
    swipe_right,
    swipe_left,
    generateRaw,
    variableService,
} from '../script.js';
import {
    extension_settings,
    ModuleWorkerWrapper,
    renderExtensionTemplate,
    renderExtensionTemplateAsync,
    saveMetadataDebounced,
    writeExtensionField,
} from './extensions.js';
import { groups, openGroupChat, selected_group, unshallowGroupMembers } from './group-chats.js';
import { addLocaleData, getCurrentLocale, t, translate } from './i18n.js';
import { hideLoader, showLoader } from './loader.js';
import { MacrosParser } from './macros.js';
import { getChatCompletionModel, oai_settings } from './openai.js';
import { callGenericPopup, Popup, POPUP_RESULT, POPUP_TYPE } from './popup.js';
import { power_user, registerDebugFunction } from './power-user.js';
import { getPresetManager } from './preset-manager.js';
import { humanizedDateTime, isMobile, shouldSendOnEnter } from './RossAscends-mods.js';
import { ScraperManager } from './scrapers.js';
import { executeSlashCommands, executeSlashCommandsWithOptions, registerSlashCommand } from './slash-commands.js';
import { SlashCommand } from './slash-commands/SlashCommand.js';
import { ARGUMENT_TYPE, SlashCommandArgument, SlashCommandNamedArgument } from './slash-commands/SlashCommandArgument.js';
import { SlashCommandParser } from './slash-commands/SlashCommandParser.js';
import { tag_map, tags } from './tags.js';
import { getTextGenServer, textgenerationwebui_settings } from './textgen-settings.js';
import { tokenizers, getTextTokens, getTokenCount, getTokenCountAsync, getTokenizerModel } from './tokenizers.js';
import { ToolManager } from './tool-calling.js';
import { VARIABLE_SCOPE, VARIABLE_EVENTS, MUTATION_REMOVE, MUTATION_SKIP } from './variable-service.js';
import { accountStorage } from './util/AccountStorage.js';
import { timestampToMoment, uuidv4 } from './utils.js';
import { getGlobalVariable, getLocalVariable, setGlobalVariable, setLocalVariable } from './variables.js';
import { convertCharacterBook, getWorldInfoPrompt, loadWorldInfo, reloadEditor, saveWorldInfo, updateWorldInfoList } from './world-info.js';
import { ChatCompletionService, TextCompletionService } from './custom-request.js';
import { ConnectionManagerRequestService } from './extensions/shared.js';
import { updateReasoningUI, parseReasoningFromString } from './reasoning.js';
import { IGNORE_SYMBOL } from './constants.js';

export function getContext() {
    return {
        accountStorage,
        chat,
        characters,
        groups,
        name1,
        name2,
        characterId: this_chid,
        groupId: selected_group,
        chatId: selected_group
            ? groups.find(x => x.id == selected_group)?.chat_id
            : (characters[this_chid]?.chat),
        getCurrentChatId,
        getRequestHeaders,
        reloadCurrentChat,
        renameChat,
        saveSettingsDebounced,
        onlineStatus: online_status,
        maxContext: Number(max_context),
        chatMetadata: chat_metadata,
        saveMetadataDebounced,
        streamingProcessor,
        eventSource,
        eventTypes: event_types,
        addOneMessage,
        deleteLastMessage,
        generate: Generate,
        sendStreamingRequest,
        sendGenerationRequest,
        stopGeneration,
        tokenizers,
        getTextTokens,
        /** @deprecated Use getTokenCountAsync instead */
        getTokenCount,
        getTokenCountAsync,
        extensionPrompts: extension_prompts,
        setExtensionPrompt,
        updateChatMetadata,
        saveChat: saveChatConditional,
        openCharacterChat,
        openGroupChat,
        saveMetadata,
        sendSystemMessage,
        activateSendButtons,
        deactivateSendButtons,
        saveReply,
        substituteParams,
        substituteParamsExtended,
        SlashCommandParser,
        SlashCommand,
        SlashCommandArgument,
        SlashCommandNamedArgument,
        ARGUMENT_TYPE,
        executeSlashCommandsWithOptions,
        /** @deprecated Use SlashCommandParser.addCommandObject() instead */
        registerSlashCommand,
        /** @deprecated Use executeSlashCommandWithOptions instead */
        executeSlashCommands,
        timestampToMoment,
        /** @deprecated Handlebars for extensions are no longer supported. */
        registerHelper: () => { },
        registerMacro: MacrosParser.registerMacro.bind(MacrosParser),
        unregisterMacro: MacrosParser.unregisterMacro.bind(MacrosParser),
        registerFunctionTool: ToolManager.registerFunctionTool.bind(ToolManager),
        unregisterFunctionTool: ToolManager.unregisterFunctionTool.bind(ToolManager),
        isToolCallingSupported: ToolManager.isToolCallingSupported.bind(ToolManager),
        canPerformToolCalls: ToolManager.canPerformToolCalls.bind(ToolManager),
        ToolManager,
        registerDebugFunction,
        /** @deprecated Use renderExtensionTemplateAsync instead. */
        renderExtensionTemplate,
        renderExtensionTemplateAsync,
        registerDataBankScraper: ScraperManager.registerDataBankScraper.bind(ScraperManager),
        /** @deprecated Use callGenericPopup or Popup instead. */
        callPopup,
        callGenericPopup,
        showLoader,
        hideLoader,
        mainApi: main_api,
        extensionSettings: extension_settings,
        ModuleWorkerWrapper,
        getTokenizerModel,
        generateQuietPrompt,
        generateRaw,
        writeExtensionField,
        getThumbnailUrl,
        selectCharacterById,
        messageFormatting,
        shouldSendOnEnter,
        isMobile,
        t,
        translate,
        getCurrentLocale,
        addLocaleData,
        tags,
        tagMap: tag_map,
        menuType: menu_type,
        createCharacterData: create_save,
        /** @deprecated Legacy snake-case naming, compatibility with old extensions */
        event_types: event_types,
        Popup,
        POPUP_TYPE,
        POPUP_RESULT,
        chatCompletionSettings: oai_settings,
        textCompletionSettings: textgenerationwebui_settings,
        powerUserSettings: power_user,
        getCharacters,
        getCharacterCardFields,
        uuidv4,
        humanizedDateTime,
        updateMessageBlock,
        appendMediaToMessage,
        swipe: { left: swipe_left, right: swipe_right },
        variables: {
            service: variableService,
            scopes: VARIABLE_SCOPE,
            signals: VARIABLE_EVENTS,
            mutations: Object.freeze({
                skip: MUTATION_SKIP,
                remove: MUTATION_REMOVE,
            }),
            store: {
                message: Object.freeze({
                    get: (key, options = {}) => variableService.get(VARIABLE_SCOPE.MESSAGE, key, options),
                    set: (key, value, options = {}) => variableService.set(VARIABLE_SCOPE.MESSAGE, key, value, options),
                    mutate: (key, mutator, options = {}) => variableService.mutate(VARIABLE_SCOPE.MESSAGE, key, mutator, options),
                    remove: (key, options = {}) => variableService.remove(VARIABLE_SCOPE.MESSAGE, key, options),
                    transaction: (callback, options = {}) => variableService.transaction(VARIABLE_SCOPE.MESSAGE, callback, options),
                }),
                chat: Object.freeze({
                    get: (key, options = {}) => variableService.get(VARIABLE_SCOPE.CHAT, key, options),
                    set: (key, value, options = {}) => variableService.set(VARIABLE_SCOPE.CHAT, key, value, options),
                    mutate: (key, mutator, options = {}) => variableService.mutate(VARIABLE_SCOPE.CHAT, key, mutator, options),
                    remove: (key, options = {}) => variableService.remove(VARIABLE_SCOPE.CHAT, key, options),
                    transaction: (callback, options = {}) => variableService.transaction(VARIABLE_SCOPE.CHAT, callback, options),
                }),
                global: Object.freeze({
                    get: (key, options = {}) => variableService.get(VARIABLE_SCOPE.GLOBAL, key, options),
                    set: (key, value, options = {}) => variableService.set(VARIABLE_SCOPE.GLOBAL, key, value, options),
                    mutate: (key, mutator, options = {}) => variableService.mutate(VARIABLE_SCOPE.GLOBAL, key, mutator, options),
                    remove: (key, options = {}) => variableService.remove(VARIABLE_SCOPE.GLOBAL, key, options),
                    transaction: (callback, options = {}) => variableService.transaction(VARIABLE_SCOPE.GLOBAL, callback, options),
                }),
            },
            mutate: (scope, key, mutator, options = {}) => variableService.mutate(scope, key, mutator, options),
            getMonitoringSnapshot: () => variableService.getMonitoringSnapshot(),
            refreshMonitoringConfig: () => variableService.refreshMonitoringConfig(),
            local: {
                get: getLocalVariable,
                set: setLocalVariable,
            },
            global: {
                get: getGlobalVariable,
                set: setGlobalVariable,
            },
        },
        loadWorldInfo,
        saveWorldInfo,
        reloadWorldInfoEditor: reloadEditor,
        updateWorldInfoList,
        convertCharacterBook,
        getWorldInfoPrompt,
        CONNECT_API_MAP,
        getTextGenServer,
        extractMessageFromData,
        getPresetManager,
        getChatCompletionModel,
        printMessages,
        clearChat,
        ChatCompletionService,
        TextCompletionService,
        ConnectionManagerRequestService,
        updateReasoningUI,
        parseReasoningFromString,
        unshallowCharacter,
        unshallowGroupMembers,
        symbols: {
            ignore: IGNORE_SYMBOL,
        },
    };
}

export default getContext;
