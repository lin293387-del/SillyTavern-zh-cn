export {};

declare global {
    interface ExtensionEventOptions {
        once?: boolean;
        capture?: boolean;
        passive?: boolean;
    }

    interface ExtensionEventEmitOptions {
        allowList?: readonly string[];
        bubbles?: boolean;
        cancelable?: boolean;
    }

    interface ExtensionEventToken {
        readonly token?: string;
        dispose(): boolean;
    }

    interface ExtensionEventsAPI {
        readonly types: Readonly<Record<string, string>>;
        readonly domEvents: Readonly<Record<string, string>>;
        on(eventName: string, handler: (...args: any[]) => any, options?: ExtensionEventOptions): ExtensionEventToken;
        off(token: string | ExtensionEventToken): boolean;
        emit(eventName: string, payload?: any, options?: ExtensionEventEmitOptions): boolean | Promise<void>;
    }

    interface ExtensionMessageDetail {
        mesId: number;
        element: Element | null;
        message?: any;
        virtual?: boolean;
        reason?: string;
    }

    interface ExtensionMessagesAPI {
        onMount(handler: (detail: ExtensionMessageDetail) => any, options?: ExtensionEventOptions): ExtensionEventToken;
        onUnmount(handler: (detail: ExtensionMessageDetail) => any, options?: ExtensionEventOptions): ExtensionEventToken;
        getElement(mesId: number): Element | null;
    }

    interface ExtensionVirtualizationDetail {
        phase: string;
        enabled?: boolean;
        mesId?: number;
        element?: Element | null;
        virtual?: boolean;
        reason?: string;
    }

    interface ExtensionVirtualizationAPI {
        readonly Phase: Readonly<Record<string, string>>;
        onPhase(phase: string, handler: (detail: ExtensionVirtualizationDetail) => any, options?: ExtensionEventOptions): ExtensionEventToken;
    }

    interface WorkerDispatchOptions {
        fallbackStrategy?: string;
        onProgress?: (detail: any) => void;
        signal?: AbortSignal;
    }

    interface ExtensionWorkerDetail {
        type: string;
        phase: string;
        taskId?: string | null;
        payload?: any;
        viaFallback?: boolean;
        result?: any;
        error?: {
            name?: string;
            message?: string;
            stack?: string;
        } | null;
    }

    interface ExtensionWorkersAPI {
        dispatch(type: string, payload: any, options?: WorkerDispatchOptions): Promise<any>;
        onTaskEvent(handler: (detail: ExtensionWorkerDetail) => any, options?: ExtensionEventOptions): ExtensionEventToken;
        registerFallback(type: string, fallback: (payload: any) => any): void;
        extendConfig(type: string, overrides?: Record<string, any>): any;
        readonly FallbackStrategy: Readonly<{
            IMMEDIATE: string;
            RETRY: string;
            ABORT: string;
        }>; 
    }

    interface PromptModuleRegistration {
        readonly id: string;
        dispose(): boolean;
    }

    interface PromptModuleConfig {
        id: string;
        label?: string;
        stage?: string;
        priority?: number;
        handler: (context: any) => any | Promise<any>;
        validator?: (context: any) => boolean | Promise<boolean>;
    }

    interface PromptModuleDescriptor {
        id: string;
        label: string;
        stage: string;
        priority: number;
    }

    interface ExtensionPromptsAPI {
        readonly stages: Readonly<{
            BEFORE_COMBINE: string;
            AFTER_COMBINE: string;
        }>;
        registerModule(config: PromptModuleConfig): PromptModuleRegistration;
        unregisterModule(id: string): boolean;
        list(): PromptModuleDescriptor[];
    }

    interface BackendStatus {
        toggles: Record<string, boolean>;
        loggingEnabled: boolean;
    }

    interface BackendToggleOptions {
        source?: string;
    }

    interface ExtensionBackendAPI {
        list(): Array<{ key: string; label: string; enabled: boolean }>;
        isEnabled(key: string): boolean;
        getLabel(key: string): string;
        getStatus(): BackendStatus;
        refresh(): Promise<BackendStatus>;
        setEnabled(key: string, enabled: boolean, options?: BackendToggleOptions): boolean;
        getLogging(): boolean;
        setLogging(enabled: boolean, options?: BackendToggleOptions): boolean;
    }

    interface CustomMacro {
        key: string;
        description?: string;
    }

    interface ExtensionMacrosAPI {
        register(key: string, value: string | ((nonce: string) => string), description?: string): string;
        unregister(key: string): boolean;
        list(): CustomMacro[];
        evaluate(content: string, env?: Record<string, any>, postProcessFn?: (value: string) => string): string;
        evaluateAsync(content: string, env?: Record<string, any>, postProcessFn?: (value: string) => string): Promise<string>;
    }

    interface RenderTemplateOptions {
        sanitize?: boolean;
        localize?: boolean;
        fullPath?: boolean;
    }

    interface TemplateCacheOptions {
        fullPath?: boolean;
    }

    interface ExtensionTemplatesAPI {
        render(templateId: string, data?: Record<string, any>, options?: RenderTemplateOptions): Promise<string>;
        renderSync(templateId: string, data?: Record<string, any>, options?: RenderTemplateOptions): string;
        clearCache(templateId?: string | null, options?: TemplateCacheOptions): boolean;
        hasCache(templateId: string, options?: TemplateCacheOptions): boolean;
    }

    interface ExtensionChatSnapshot {
        count: number;
        messages: Array<{ index: number; message: any }>;
        virtualization: {
            enabled: boolean;
            range: { start: number; end: number };
            mountedIds: number[];
        };
    }

    interface ExtensionChatAPI {
        getSnapshot(options?: { includeVirtual?: boolean }): Promise<ExtensionChatSnapshot>;
        mutateMessage(
            mesId: number,
            updater: (draft: any, context: { index: number; original: any }) => any | Promise<any>,
            options?: { rerender?: boolean; broadcast?: boolean }
        ): Promise<any>;
        sendUserMessage(payload: {
            text: string;
            bias?: any;
            insertAt?: number | null;
            compact?: boolean;
            name?: string;
            avatar?: string;
        }): Promise<any>;
    }

    interface ExtensionWorldInfoMutationContext {
        name: string;
        data: any;
        entries: any;
        setOriginal(uid: number | string, key: string, value: any): void;
        deleteOriginal(uid: number | string): void;
    }

    interface ExtensionWorldInfoMutateOptions {
        immediately?: boolean;
        refreshEditor?: boolean;
        navigation?: number;
        flash?: boolean;
        refreshList?: boolean;
    }

    interface ExtensionWorldInfoMutationResult<TResult> {
        name: string;
        book: any;
        result: TResult;
    }

    interface ExtensionWorldInfoBooksAPI {
        list(): string[];
        load(name: string, options?: { refresh?: boolean }): Promise<any | null>;
        save(name: string, book: any, options?: { immediately?: boolean; refreshList?: boolean }): Promise<any>;
        create(name: string, options?: { interactive?: boolean }): Promise<any | null>;
        delete(name: string): Promise<boolean>;
        rename(oldName: string, newName: string, options?: { overwrite?: boolean }): Promise<string>;
        duplicate(source: string, target: string, options?: { overwrite?: boolean; refreshList?: boolean }): Promise<any>;
        mutate<TResult = any>(name: string, mutator: (context: ExtensionWorldInfoMutationContext) => TResult | Promise<TResult>, options?: ExtensionWorldInfoMutateOptions): Promise<ExtensionWorldInfoMutationResult<TResult>>;
        openEditor(name: string): void;
        reloadEditor(name: string, options?: { loadIfNotSelected?: boolean }): void;
        editorState(): { visible: boolean; index: number | null; name: string | null };
        refreshList(): Promise<void>;
    }

    interface ExtensionWorldInfoEntryCreateOptions {
        immediately?: boolean;
        refreshEditor?: boolean;
        navigation?: number;
        flash?: boolean;
        updateOriginal?: boolean;
    }

    interface ExtensionWorldInfoEntryUpdateOptions {
        immediately?: boolean;
        refreshEditor?: boolean;
        navigation?: number;
        flash?: boolean;
    }

    interface ExtensionWorldInfoEntryRemoveOptions {
        immediately?: boolean;
        refreshEditor?: boolean;
        navigation?: number;
        flash?: boolean;
        silent?: boolean;
    }

    interface ExtensionWorldInfoEntryDuplicateOptions {
        immediately?: boolean;
        refreshEditor?: boolean;
        navigation?: number;
        flash?: boolean;
    }

    interface ExtensionWorldInfoEntriesAPI {
        list(book: string, options?: { refresh?: boolean }): Promise<any[]>;
        get(book: string, uid: number | string, options?: { refresh?: boolean }): Promise<any | null>;
        create(book: string, payload?: Record<string, any>, options?: ExtensionWorldInfoEntryCreateOptions): Promise<any>;
        update(book: string, uid: number | string, mutator: (entry: any, helpers: { setOriginal(key: string, value: any): void }) => any, options?: ExtensionWorldInfoEntryUpdateOptions): Promise<{ entry: any; previous: any; mutationResult: any }>;
        remove(book: string, uid: number | string, options?: ExtensionWorldInfoEntryRemoveOptions): Promise<boolean>;
        duplicate(book: string, uid: number | string, options?: ExtensionWorldInfoEntryDuplicateOptions): Promise<any>;
        move(source: string, target: string, uid: number | string, options?: { deleteOriginal?: boolean }): Promise<boolean>;
        render(book: string, uid: number | string, options?: { data?: any; entry?: any }): Promise<string | null>;
    }

    interface ExtensionWorldInfoEditorAPI {
        open(name: string): void;
        reload(name: string, options?: { loadIfNotSelected?: boolean }): void;
        state(): { visible: boolean; index: number | null; name: string | null };
        refresh(navigation?: number, flash?: boolean): void;
    }

    interface ExtensionWorldInfoAPI {
        listBooks(): string[];
        getBook(name: string): any | null;
        listEntries(name: string, options?: { sort?: boolean }): any[];
        getSettings(): any;
        updateSettings(settings: Record<string, any>, dataOverride?: any): any;
        refresh(): Promise<string[]>;
        forceActivate(entries: any): Promise<void>;
        ensureEmbeddedWorld(characterId: number): boolean;
        importEmbeddedWorldInfo(characterId: number, options?: { skipPrompt?: boolean }): Promise<void>;
        readonly books: ExtensionWorldInfoBooksAPI;
        readonly entries: ExtensionWorldInfoEntriesAPI;
        readonly editor: ExtensionWorldInfoEditorAPI;
        readonly navigation: Readonly<Record<string, number>>;
        readonly anchorPosition: Readonly<Record<string, number>>;
        readonly events: Readonly<{
            UPDATED: string;
            SETTINGS_UPDATED: string;
            FORCE_ACTIVATE: string;
        }>;
        onUpdated(handler: (...args: any[]) => any, options?: ExtensionEventOptions): ExtensionEventToken;
        onSettingsUpdated(handler: (...args: any[]) => any, options?: ExtensionEventOptions): ExtensionEventToken;
    }

    interface ExtensionSummary {
        readonly id: string;
        readonly externalId: string;
        readonly type: string;
        readonly isExternal: boolean;
        readonly isActive: boolean;
        readonly isDisabled: boolean;
        readonly displayName: string;
        readonly version: string | null;
        readonly author: string | null;
        readonly description: string;
        readonly autoUpdate: boolean;
        readonly modules: readonly string[];
        readonly optionalModules: readonly string[];
        readonly requires: readonly string[];
        readonly repository: string | null;
        readonly homepage: string | null;
        readonly manifest?: any;
    }

    interface ExtensionOperationResult {
        readonly ok: boolean;
        readonly message?: string | null;
        readonly data?: any;
        readonly updates?: readonly string[];
        readonly extension?: ExtensionSummary | null;
        readonly reloadRequired: boolean;
    }

    interface ExtensionInstallOptions {
        url: string;
        branch?: string;
        global?: boolean;
        notify?: boolean;
        includeManifest?: boolean;
    }

    interface ExtensionToggleOptions {
        reload?: boolean;
        includeManifest?: boolean;
    }

    interface ExtensionMoveOptions {
        notify?: boolean;
        refreshDetails?: boolean;
        includeManifest?: boolean;
    }

    interface ExtensionUpdateOptions {
        quiet?: boolean;
        notify?: boolean;
        refreshDetails?: boolean;
        timeout?: number;
        includeManifest?: boolean;
    }

    interface ExtensionManagerSnapshotOptions {
        includeManifest?: boolean;
    }

    interface ExtensionBranch {
        name: string;
        commit: string;
        current: boolean;
        label: string;
    }

    interface ExtensionManagerAPI {
        listInstalled(options?: ExtensionManagerSnapshotOptions): ExtensionSummary[];
        snapshot(options?: ExtensionManagerSnapshotOptions): ExtensionSummary[];
        listDiscovered(): Promise<Array<{ name: string; type: string }>>;
        getErrors(): string[];
        enable(name: string, options?: ExtensionToggleOptions): Promise<ExtensionOperationResult>;
        disable(name: string, options?: ExtensionToggleOptions): Promise<ExtensionOperationResult>;
        install(options: ExtensionInstallOptions): Promise<{ ok: boolean; data: any; extension: ExtensionSummary | null; reloadRequired: boolean }>;
        remove(name: string, options?: { notify?: boolean; reload?: boolean; includeManifest?: boolean }): Promise<{ ok: boolean; message?: string | null; extension: ExtensionSummary | null; reloadRequired: boolean }>;
        move(name: string, destination: 'global' | 'local', options?: ExtensionMoveOptions): Promise<ExtensionOperationResult>;
        switchBranch(name: string, branch: string, options?: { notify?: boolean; refreshDetails?: boolean; includeManifest?: boolean }): Promise<ExtensionOperationResult>;
        update(name: string, options?: ExtensionUpdateOptions): Promise<ExtensionOperationResult>;
        updateAll(options?: { force?: boolean; notify?: boolean }): Promise<{ ok: boolean; reloadRequired: boolean }>;
        checkUpdates(options?: { force?: boolean; notify?: boolean }): Promise<{ ok: boolean; updates: readonly string[]; reloadRequired: boolean }>;
        getBranches(name: string, options?: { notify?: boolean }): Promise<ExtensionBranch[]>;
        getVersion(name: string, options?: { signal?: AbortSignal }): Promise<any>;
        refresh(options?: { settings?: any; versionChanged?: boolean; enableAutoUpdate?: boolean; includeManifest?: boolean }): Promise<ExtensionSummary[]>;
        reloadPending(): boolean;
        clearReloadFlag(): void;
    }

    interface ExtensionCharacterSnapshot {
        index: number;
        character: any;
    }

    interface ExtensionCharactersAPI {
        list(options?: { refresh?: boolean }): Promise<ExtensionCharacterSnapshot[]>;
        get(index: number): any;
        getActive(): ExtensionCharacterSnapshot | null;
        setActive(index: number, options?: { switchMenu?: boolean }): Promise<any>;
        rename(index: number, newName: string, options?: Record<string, any>): Promise<any>;
        duplicate(index: number): Promise<ExtensionCharacterSnapshot[]>;
        remove(index: number, options?: { deleteChats?: boolean }): Promise<ExtensionCharacterSnapshot[]>;
        refresh(): Promise<ExtensionCharacterSnapshot[]>;
        readonly events: Readonly<{
            EDITED: string;
            DELETED: string;
            DUPLICATED: string;
            RENAMED: string;
            PAGE_LOADED: string;
        }>;
        on(eventName: string, handler: (...args: any[]) => any, options?: ExtensionEventOptions): ExtensionEventToken;
        onAnyChange(handler: (...args: any[]) => any, options?: ExtensionEventOptions): ExtensionEventToken;
    }

    interface ExtensionPresetsAPI {
        list(apiId: string): string[];
        getSelected(apiId: string): string | null;
        select(apiId: string, value: string): string;
        getSettings(apiId: string, name?: string): any;
        save(apiId: string, name: string, settings?: any, options?: { skipUpdate?: boolean }): Promise<any>;
        saveAs(apiId: string): Promise<string>;
        rename(apiId: string, newName: string): Promise<string>;
        remove(apiId: string, name?: string): Promise<string[]>;
        readonly events: Readonly<{
            CHANGED: string;
            DELETED: string;
        }>;
        on(eventName: string, handler: (...args: any[]) => any, options?: ExtensionEventOptions): ExtensionEventToken;
    }

    interface ExtensionUiAPI {
        toggleDrawer(selector: string | Element, expand?: boolean): boolean;
        focus(selector: string | Element): boolean;
        scrollIntoView(selector: string | Element, options?: ScrollIntoViewOptions): boolean;
        setClass(selector: string | Element, className: string, value?: boolean): boolean;
        bodyClass(className: string, value?: boolean): boolean;
        showToast(type: string, message: string, title?: string, options?: Record<string, any>): void;
        showLoader(): void;
        hideLoader(): void;
    }

    interface ExtensionVariablesAPI {
        getPowerUser(): any;
        updatePowerUser(updater: any | ((draft: any) => any | Promise<any>)): Promise<any>;
        getSettings(): any;
        updateSettings(updater: any | ((draft: any) => any | Promise<any>)): Promise<any>;
        readonly mainApi: string;
        readonly events: Readonly<{
            SETTINGS_UPDATED: string;
        }>;
        onSettingsUpdated(handler: (...args: any[]) => any, options?: ExtensionEventOptions): ExtensionEventToken;
    }

    type ExtensionErrorsMap = Readonly<{
        EXT_OK: string;
        EXT_E_TIMEOUT: string;
        EXT_E_ABORTED: string;
        EXT_E_FORBIDDEN: string;
        EXT_E_BAD_PAYLOAD: string;
        EXT_E_UNSUPPORTED: string;
        EXT_E_NOT_FOUND: string;
        EXT_E_UNAVAILABLE: string;
    }>;

    interface SillyTavernExtensions {
        readonly events: ExtensionEventsAPI;
        readonly messages: ExtensionMessagesAPI;
        readonly virtualization: ExtensionVirtualizationAPI;
        readonly workers: ExtensionWorkersAPI;
        readonly chat: ExtensionChatAPI;
        readonly worldInfo: ExtensionWorldInfoAPI;
        readonly manager: ExtensionManagerAPI;
        readonly characters: ExtensionCharactersAPI;
        readonly presets: ExtensionPresetsAPI;
        readonly ui: ExtensionUiAPI;
        readonly variables: ExtensionVariablesAPI;
        readonly prompts: ExtensionPromptsAPI;
        readonly backend: ExtensionBackendAPI;
        readonly macros: ExtensionMacrosAPI;
        readonly templates: ExtensionTemplatesAPI;
        readonly errors: ExtensionErrorsMap;
    }

    interface SillyTavernNamespace {
        libs: any;
        getContext: (...args: any[]) => any;
        extensions: SillyTavernExtensions;
    }

    var SillyTavern: SillyTavernNamespace;

    interface Window {
        SillyTavern: SillyTavernNamespace;
    }
}
