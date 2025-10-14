export interface MessageRenderingOptions {
    forceId?: number | null;
    type?: string;
}

export interface MessageRenderingEnv {
    getChat?: () => unknown[] | null | undefined;
    getMessageIndex?: (message: unknown, chat: unknown[]) => number;
    getCharacters?: () => Array<Record<string, unknown> | null | undefined> | null | undefined;
    getCurrentCharacterId?: () => number | null | undefined;
    getUserAvatar?: () => string | null | undefined;
    getSystemAvatar?: () => string | null | undefined;
    getDefaultAvatar?: () => string | null | undefined;
    getThumbnailUrl?: (type: string, id?: string | null | undefined) => string | null | undefined;
    timestampToMoment?: (timestamp: unknown) => { isValid?: () => boolean; format?: (pattern: string) => string } | null | undefined;
    messageFormatting?: (
        text: string | null | undefined,
        name?: string | null,
        isSystem?: boolean | null,
        isUser?: boolean | null,
        index?: number,
        sanitizerOverrides?: Record<string, unknown>,
        useWorker?: boolean,
    ) => string;
    formatGenerationTimer?: (
        started?: unknown,
        finished?: unknown,
        tokenCount?: unknown,
        reasoningDuration?: unknown,
        timeToFirstToken?: unknown,
    ) => Record<string, unknown> | null | undefined;
}

export interface MessageRenderingParams {
    mesId: number;
    swipeId: number;
    characterName?: string;
    isUser?: boolean;
    avatarImg?: string;
    bias?: string;
    isSystem?: boolean;
    title?: string;
    bookmarkLink?: string;
    forceAvatar?: string | boolean | null;
    timestamp?: string;
    extra?: Record<string, unknown>;
    tokenCount?: number;
    type?: string;
    timerValue?: string;
    timerTitle?: string;
    [key: string]: unknown;
}

export interface MessageRenderingResult {
    params: MessageRenderingParams;
    formattedText: string;
    timestamp: string;
    title: string;
}

export function buildMessageRenderingData(
    mes: Record<string, unknown>,
    options?: MessageRenderingOptions,
    env?: MessageRenderingEnv,
): MessageRenderingResult;
