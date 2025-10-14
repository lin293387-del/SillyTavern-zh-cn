export function buildMessageRenderingData(mes, options = {}, env = {}) {
    if (!mes) {
        throw new TypeError('buildMessageRenderingData 需要有效的消息对象');
    }

    const {
        getChat,
        getMessageIndex,
        getCharacters,
        getCurrentCharacterId,
        getUserAvatar,
        getSystemAvatar,
        getDefaultAvatar,
        getThumbnailUrl,
        timestampToMoment,
        messageFormatting,
        formatGenerationTimer,
    } = env;

    const chat = typeof getChat === 'function' ? (getChat() ?? []) : [];
    const characters = typeof getCharacters === 'function' ? (getCharacters() ?? []) : [];
    const thisChId = typeof getCurrentCharacterId === 'function' ? getCurrentCharacterId() : undefined;
    const userAvatar = typeof getUserAvatar === 'function' ? getUserAvatar() : undefined;
    const systemAvatar = typeof getSystemAvatar === 'function' ? getSystemAvatar() : undefined;
    const defaultAvatar = typeof getDefaultAvatar === 'function' ? getDefaultAvatar() : undefined;
    const thumbnail = typeof getThumbnailUrl === 'function' ? getThumbnailUrl : (() => undefined);
    const formatMessage = typeof messageFormatting === 'function' ? messageFormatting : ((text) => text ?? '');
    const toMoment = typeof timestampToMoment === 'function' ? timestampToMoment : (() => null);
    const formatTimer = typeof formatGenerationTimer === 'function' ? formatGenerationTimer : (() => ({}));

    const { forceId = null } = options ?? {};
    const type = options?.type ?? 'normal';

    const chatIndex = typeof getMessageIndex === 'function'
        ? getMessageIndex(mes, chat)
        : (Array.isArray(chat) ? chat.indexOf(mes) : -1);

    let formattedText = mes?.mes ?? '';
    if (mes?.extra?.display_text) {
        formattedText = mes.extra.display_text;
    }

    const momentDate = toMoment(mes?.send_date);
    const timestamp = momentDate && typeof momentDate.isValid === 'function' && momentDate.isValid()
        ? momentDate.format('LL LT')
        : '';

    let avatarImg = thumbnail('persona', userAvatar);

    if (!mes?.is_user) {
        if (mes?.force_avatar) {
            avatarImg = mes.force_avatar;
        } else if (thisChId === undefined) {
            avatarImg = systemAvatar ?? avatarImg;
        } else {
            const character = characters?.[thisChId];
            if (character?.avatar && character.avatar !== 'none') {
                avatarImg = thumbnail('avatar', character.avatar);
            } else {
                avatarImg = defaultAvatar ?? avatarImg;
            }
        }
    } else if (mes?.is_user && mes?.force_avatar) {
        avatarImg = mes.force_avatar;
    }

    const sanitizerOverrides = mes?.uses_system_ui ? { MESSAGE_ALLOW_SYSTEM_UI: true } : {};
    const formattedHtml = formatMessage(
        formattedText,
        mes?.name,
        mes?.is_system,
        mes?.is_user,
        chatIndex,
        sanitizerOverrides,
        false,
    );

    const biasHtml = formatMessage(mes?.extra?.bias ?? '', '', false, false, -1, {}, false);
    const bookmarkLink = mes?.extra?.bookmark_link ?? '';
    const timerInfo = formatTimer(
        mes?.gen_started,
        mes?.gen_finished,
        mes?.extra?.token_count,
        mes?.extra?.reasoning_duration,
        mes?.extra?.time_to_first_token,
    ) || {};

    const params = {
        mesId: forceId ?? (Array.isArray(chat) ? chat.length - 1 : 0),
        swipeId: mes?.swipe_id ?? 0,
        characterName: mes?.name,
        isUser: mes?.is_user,
        avatarImg,
        bias: biasHtml,
        isSystem: mes?.is_system,
        title: mes?.title,
        bookmarkLink,
        forceAvatar: mes?.force_avatar,
        timestamp,
        extra: mes?.extra,
        tokenCount: mes?.extra?.token_count ?? 0,
        type: mes?.extra?.type ?? '',
        ...timerInfo,
    };

    return {
        params,
        formattedText: formattedHtml,
        timestamp,
        title: mes?.title ?? '',
    };
}
