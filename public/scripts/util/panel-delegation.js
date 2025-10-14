/**
 * 面板事件委托工具，避免在 document 上绑定高频监听。
 * 默认聚焦左侧配置抽屉，也支持传入其他容器选择器。
 */

const LEFT_NAV_ROOT = '#left-nav-panel';
const ADVANCED_FORMATTING_ROOT = '#AdvancedFormatting';

/**
 * 解析根节点，允许传入选择器字符串或 jQuery 对象。
 * @param {string|JQuery} root
 * @returns {{selector: string|null, element: JQuery}}
 */
function resolveRoot(root) {
    if (!root) {
        return { selector: LEFT_NAV_ROOT, element: $(LEFT_NAV_ROOT) };
    }

    if (typeof root === 'string') {
        return { selector: root, element: $(root) };
    }

    return { selector: null, element: root };
}

/**
 * 在指定容器内绑定委托事件，并为同一命名空间的重复绑定做去重。
 * @param {string} eventType 事件类型，如 'input'
 * @param {string} selector 子元素选择器
 * @param {Function} handler 事件处理函数
 * @param {{root?: string|JQuery, namespace?: string}} options 配置项
 */
export function delegatePanelEvent(eventType, selector, handler, options = {}) {
    const { root, namespace } = options;
    const resolved = resolveRoot(root);
    const eventName = namespace ? `${eventType}.${namespace}` : eventType;

    const bind = ($root) => {
        if (!$root.length) {
            console.warn(`[delegatePanelEvent] 未找到容器，selector=${resolved.selector ?? '[jQuery对象]'}, event=${eventName}, 目标=${selector}`);
            return;
        }
        $root.off(eventName, selector);
        $root.on(eventName, selector, handler);
    };

    if (resolved.element.length) {
        bind(resolved.element);
        return;
    }

    if (resolved.selector) {
        $(function () {
            bind($(resolved.selector));
        });
        return;
    }

    console.warn('[delegatePanelEvent] 提供的根节点为空，且无法延迟绑定。');
}

/**
 * 左侧面板便捷绑定。
 * @param {string} eventType
 * @param {string} selector
 * @param {Function} handler
 * @param {{namespace?: string, root?: string|JQuery}} options
 */
export function delegateLeftNav(eventType, selector, handler, options = {}) {
    delegatePanelEvent(eventType, selector, handler, { ...options, root: options.root ?? LEFT_NAV_ROOT });
}

export const PANEL_ROOTS = {
    LEFT_NAV_ROOT,
    ADVANCED_FORMATTING_ROOT,
};

/**
 * 创建面板级的节流保存调度器。用于在高频 input/slider 事件中合并对
 * `saveSettingsDebounced` 等昂贵操作的调用。
 * @param {() => void} callback 需要延迟执行的回调
 * @returns {() => void} 调度函数
 */
export function createPanelSaveScheduler(callback) {
    let pending = false;

    return function schedulePanelSave() {
        if (pending) return;
        pending = true;
        requestAnimationFrame(() => {
            pending = false;
            callback();
        });
    };
}
