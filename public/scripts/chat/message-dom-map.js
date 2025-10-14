// 集中维护消息节点的属性与文本映射，避免在渲染流程中散落设置。

const ROOT_ATTRIBUTE_RULES = {
    mesid: ({ params }) => params?.mesId ?? '',
    swipeid: ({ params }) => params?.swipeId ?? 0,
    ch_name: ({ params }) => params?.characterName ?? '',
    is_user: ({ params }) => (params?.isUser ? 'true' : 'false'),
    is_system: ({ params }) => (params?.isSystem ? 'true' : 'false'),
    bookmark_link: ({ params }) => params?.bookmarkLink ?? '',
    force_avatar: ({ params }) => (params?.forceAvatar ? 'true' : 'false'),
    timestamp: ({ params }) => params?.timestamp ?? '',
    type: ({ params }) => params?.type ?? undefined,
};

const NODE_RULES = [
    {
        selector: '.avatar img',
        apply: (node, { params }) => {
            if (!(node instanceof HTMLImageElement)) return;
            node.src = params?.avatarImg ?? '';
            node.alt = params?.characterName ?? '';
        },
    },
    {
        selector: '.ch_name .name_text',
        apply: (node, { params }) => {
            node.textContent = params?.characterName ?? '';
        },
    },
    {
        selector: '.mes_bias',
        apply: (node, { params }) => {
            node.innerHTML = params?.bias ?? '';
        },
    },
    {
        selector: '.timestamp',
        apply: (node, { params, timestamp }) => {
            node.textContent = timestamp ?? '';
            const api = params?.extra?.api ?? '';
            const model = params?.extra?.model ?? '';
            const titleText = api ? (model ? `${api} - ${model}` : api) : model;
            if (titleText) {
                node.setAttribute('title', titleText);
            } else {
                node.removeAttribute('title');
            }
        },
    },
    {
        selector: '.mesIDDisplay',
        apply: (node, { params }) => {
            const mesId = params?.mesId;
            node.textContent = Number.isFinite(mesId) ? `#${mesId}` : '';
        },
    },
    {
        selector: '.tokenCounterDisplay',
        apply: (node, { params }) => {
            const tokenCount = params?.tokenCount;
            node.textContent = tokenCount ? `${tokenCount}t` : '';
        },
    },
    {
        selector: '.mes_timer',
        apply: (node, { params }) => {
            const timerValue = params?.timerValue;
            if (timerValue) {
                node.textContent = timerValue;
                const timerTitle = params?.timerTitle;
                if (timerTitle) {
                    node.setAttribute('title', timerTitle);
                } else {
                    node.removeAttribute('title');
                }
            } else {
                node.textContent = '';
                node.removeAttribute('title');
            }
        },
    },
];

/**
 * 根据渲染数据应用消息节点的属性与文本。
 * @param {Element|JQuery} element
 * @param {{params?:object, timestamp?:string, title?:string}} renderingData
 */
export function applyMessageDomMapping(element, renderingData = {}) {
    const target = element instanceof Element ? element : element?.get?.(0);
    if (!(target instanceof Element)) {
        return;
    }

    const params = renderingData?.params ?? {};
    const payload = { ...renderingData, params };

    Object.entries(ROOT_ATTRIBUTE_RULES).forEach(([name, getter]) => {
        const value = getter(payload);
        if (value === undefined || value === null || value === '') {
            target.removeAttribute(name);
            if (name === 'swipeid') {
                target.setAttribute(name, '0');
            }
        } else {
            target.setAttribute(name, `${value}`);
        }
    });

    NODE_RULES.forEach(({ selector, apply }) => {
        const node = target.querySelector(selector);
        if (node) {
            try {
                apply(node, payload);
            } catch (error) {
                console.error('applyMessageDomMapping 节点更新失败', selector, error);
            }
        }
    });

    if (renderingData?.title) {
        target.title = renderingData.title;
    } else {
        target.removeAttribute('title');
    }
}

/**
 * 根据额外状态切换常规类名（例如小系统消息、工具调用）。
 * @param {Element|JQuery} element
 * @param {{isSmallSystem?:boolean, hasToolInvocation?:boolean}} state
 */
export function applyMessageStateClasses(element, state = {}) {
    const target = element instanceof Element ? element : element?.get?.(0);
    if (!(target instanceof Element)) {
        return;
    }

    const classList = target.classList;
    if (!classList) {
        return;
    }

    if (state.isSmallSystem) {
        classList.add('smallSysMes');
    } else {
        classList.remove('smallSysMes');
    }

    if (state.hasToolInvocation) {
        classList.add('toolCall');
    } else {
        classList.remove('toolCall');
    }
}
