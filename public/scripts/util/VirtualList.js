/**
 * VirtualList 提供可复用的窗口化渲染能力，支持：
 *  - 通过 Fenwick 树维护元素高度并计算前缀高度
 *  - 根据窗口区间增量更新 DOM，配合顶部/底部占位实现虚拟滚动
 *  - 钩子可扩展到聊天记录等需要分页的场景
 */

class FenwickTree {
    constructor(size = 0) {
        this.size = 0;
        this.tree = [0];
        if (size > 0) {
            this.resize(size);
        }
    }

    resize(newSize) {
        if (newSize <= this.size) return;
        const currentLength = this.tree.length;
        this.tree.length = newSize + 1;
        for (let i = currentLength; i < this.tree.length; i++) {
            this.tree[i] = 0;
        }
        this.size = newSize;
    }

    shrink(newSize) {
        if (newSize >= this.size) return;
        this.size = newSize;
        this.tree.length = newSize + 1;
    }

    update(index, delta) {
        let i = index + 1;
        while (i <= this.size) {
            this.tree[i] += delta;
            i += i & -i;
        }
    }

    prefixSum(endExclusive) {
        let sum = 0;
        let i = Math.min(endExclusive, this.size);
        while (i > 0) {
            sum += this.tree[i];
            i -= i & -i;
        }
        return sum;
    }

    total() {
        return this.prefixSum(this.size);
    }

    lowerBound(target) {
        if (target <= 0) return 0;
        let idx = 0;
        let bit = 1 << Math.floor(Math.log2(Math.max(1, this.size)));
        let sum = 0;
        while (bit !== 0) {
            const next = idx + bit;
            if (next <= this.size && sum + this.tree[next] < target) {
                idx = next;
                sum += this.tree[next];
            }
            bit >>= 1;
        }
        return Math.min(idx, this.size - 1);
    }
}

export { FenwickTree };

class VirtualList {
    constructor({
        container,
        getItemCount,
        renderItem,
        getItemKey = (index) => String(index),
        estimatedItemHeight = 80,
        overscan = 5,
        onRangeChange = null,
        onMount = null,
        onUnmount = null,
        useSpacers = true,
    }) {
        if (!container) {
            throw new Error('VirtualList 需要提供容器元素');
        }
        this.container = container;
        this.getItemCount = getItemCount;
        this.renderItem = renderItem;
        this.getItemKey = getItemKey;
        this.estimatedItemHeight = estimatedItemHeight;
        this.overscan = overscan;
        this.onRangeChange = onRangeChange;
        this.onMount = onMount;
        this.onUnmount = onUnmount;
        this.useSpacers = useSpacers;

        this.topSpacer = document.createElement('div');
        this.bottomSpacer = document.createElement('div');
        this.topSpacer.dataset.virtualSpacer = 'top';
        this.bottomSpacer.dataset.virtualSpacer = 'bottom';
        this.topSpacer.style.height = '0px';
        this.bottomSpacer.style.height = '0px';
        this.topSpacer.style.flex = '0 0 auto';
        this.bottomSpacer.style.flex = '0 0 auto';
        this.topSpacer.style.width = '100%';
        this.bottomSpacer.style.width = '100%';
        this.topSpacer.style.pointerEvents = 'none';
        this.bottomSpacer.style.pointerEvents = 'none';

        container.innerHTML = '';
        container.append(this.topSpacer, this.bottomSpacer);

        this.rendered = new Map();
        this.currentRange = { start: 0, end: 0 };
        this.values = [];
        this.measured = [];
        this.measureQueue = new Map();
        this.fenwick = new FenwickTree(0);
        this.pendingFrame = null;
        this.pendingScrollFrame = null;
        this.scrollElement = container;
        this.scrollListener = null;
        this.spacerHeights = { top: '0px', bottom: '0px' };
        this.nextSpacerHeights = null;
        this.spacerUpdateFrame = null;
    }

    setOverscan(value) {
        this.overscan = Math.max(0, Number(value) || 0);
    }

    setEstimatedItemHeight(value) {
        this.estimatedItemHeight = Math.max(1, Number(value) || 1);
    }

    resetMeasurements(length = this.values.length) {
        const target = Math.max(0, Number(length) || 0);
        if (this.pendingFrame) {
            cancelAnimationFrame(this.pendingFrame);
            this.pendingFrame = null;
        }
        for (const [key, record] of Array.from(this.rendered.entries())) {
            const element = record?.element ?? null;
            if (typeof this.onUnmount === 'function' && element) {
                try {
                    this.onUnmount(record.index ?? 0, element, { key, reset: true });
                } catch (error) {
                    console.error('VirtualList onUnmount handler failed during reset', error);
                }
            }
            if (element?.isConnected) {
                element.remove();
            }
        }
        this.rendered.clear();
        this.values.length = 0;
        this.measured.length = 0;
        this.fenwick = new FenwickTree(0);
        this.measureQueue.clear();
        this.invalidateRange();
        if (this.spacerUpdateFrame !== null) {
            cancelAnimationFrame(this.spacerUpdateFrame);
            this.spacerUpdateFrame = null;
        }
        this.nextSpacerHeights = null;
        this.spacerHeights = { top: '0px', bottom: '0px' };
        if (target > 0) {
            this.ensureCapacity(target);
        }
    }

    invalidateRange() {
        this.currentRange = { start: -1, end: -1 };
    }

    ensureCapacity(length) {
        if (length <= this.values.length) {
            return;
        }
        this.fenwick.resize(length);
        for (let i = this.values.length; i < length; i++) {
            this.values[i] = this.estimatedItemHeight;
            this.measured[i] = false;
            this.fenwick.update(i, this.estimatedItemHeight);
        }
    }

    shrinkCapacity(length) {
        if (length >= this.values.length) {
            return;
        }
        for (let i = this.values.length - 1; i >= length; i--) {
            const value = this.values[i] ?? this.estimatedItemHeight;
            this.fenwick.update(i, -value);
        }
        this.values.length = length;
        this.measured.length = length;
        this.fenwick.shrink(length);
    }

    setDataLength(length) {
        if (length < 0) length = 0;
        if (length > this.values.length) {
            this.ensureCapacity(length);
        } else if (length < this.values.length) {
            this.shrinkCapacity(length);
        }
    }

    updateHeight(index, newHeight) {
        if (!Number.isFinite(newHeight) || newHeight <= 0) {
            return;
        }
        this.ensureCapacity(index + 1);
        const current = this.values[index] ?? this.estimatedItemHeight;
        const delta = newHeight - current;
        if (Math.abs(delta) < 0.5) {
            this.values[index] = newHeight;
            this.measured[index] = true;
            return;
        }
        this.values[index] = newHeight;
        this.measured[index] = true;
        this.fenwick.update(index, delta);
    }

    scheduleMeasurement(index, element, force = false) {
        if (!element) return;
        if (!force && this.measured[index] && !this.measureQueue.has(index)) {
            return;
        }
        if (force) {
            this.measured[index] = false;
        }
        this.measureQueue.set(index, element);
        if (this.pendingFrame) return;
        this.pendingFrame = requestAnimationFrame(() => this.flushMeasurements());
    }

    flushMeasurements() {
        if (this.pendingFrame) {
            cancelAnimationFrame(this.pendingFrame);
            this.pendingFrame = null;
        }
        for (const [index, element] of this.measureQueue) {
            const height = element.offsetHeight;
            this.updateHeight(index, height);
            if (element && Number.isFinite(height)) {
                element.dataset.virtualMeasuredHeight = String(height);
            }
        }
        this.measureQueue.clear();
        this.updateSpacers();
    }

    notifyItemMutated(index) {
        const key = this.getItemKey(index);
        const record = this.rendered.get(key);
        if (record) {
            this.scheduleMeasurement(index, record.element, true);
        }
    }

    measureNow(index) {
        const key = this.getItemKey(index);
        const record = this.rendered.get(key);
        if (record?.element) {
            this.updateHeight(index, record.element.offsetHeight);
        }
    }

    getHeightForIndex(index) {
        if (index < 0 || index >= this.values.length) {
            return this.estimatedItemHeight;
        }
        return this.values[index] ?? this.estimatedItemHeight;
    }

    getOffsetForIndex(index) {
        if (index <= 0) return 0;
        return this.fenwick.prefixSum(index);
    }

    getTotalHeight() {
        return this.fenwick.total();
    }

    getIndexAtOffset(offset) {
        return this.fenwick.lowerBound(offset + 1);
    }

    computeWindowFromScroll(scrollTop, viewportHeight) {
        const length = this.getItemCount ? this.getItemCount() : this.values.length;
        if (length === 0) {
            return { start: 0, end: 0 };
        }
        this.setDataLength(length);
        const startApprox = this.getIndexAtOffset(Math.max(0, scrollTop - this.estimatedItemHeight * this.overscan));
        const endApprox = this.getIndexAtOffset(scrollTop + viewportHeight + this.estimatedItemHeight * this.overscan);
        const start = Math.max(0, Math.min(startApprox, length - 1));
        const end = Math.min(length, Math.max(start + 1, endApprox + 1));
        return { start, end };
    }

    setWindow(start, end) {
        const length = this.getItemCount ? this.getItemCount() : this.values.length;
        this.setDataLength(length);
        const safeStart = Math.max(0, Math.min(start, length));
        const safeEnd = Math.max(safeStart, Math.min(end, length));
        if (this.currentRange.start === safeStart && this.currentRange.end === safeEnd) {
            return;
        }
        const desiredKeys = new Set();
        const desiredElements = [];

        this.ensureSpacers();

        for (let index = safeStart; index < safeEnd; index++) {
            const key = this.getItemKey(index);
            desiredKeys.add(key);
            let record = this.rendered.get(key);
            if (!record) {
                const element = this.renderItem(index);
                if (!element) continue;
                element.dataset.virtualKey = key;
                record = { index, element };
                this.rendered.set(key, record);
                const anchor = this.resolveAnchor();
                this.container.insertBefore(element, anchor);
                if (typeof this.onMount === 'function') {
                    try {
                        this.onMount(index, element, { key });
                    } catch (error) {
                        console.error('VirtualList onMount handler failed', error);
                    }
                }
                this.scheduleMeasurement(index, element, true);
            } else {
                record.index = index;
                record.element.dataset.virtualKey = key;
                this.scheduleMeasurement(index, record.element);
            }
            desiredElements.push(record.element);
        }

        for (const [key, record] of Array.from(this.rendered.entries())) {
            if (!desiredKeys.has(key)) {
                if (typeof this.onUnmount === 'function' && record.element) {
                    try {
                        this.onUnmount(record.index, record.element, { key });
                    } catch (error) {
                        console.error('VirtualList onUnmount handler failed', error);
                    }
                }
                if (record.element?.isConnected) {
                    record.element.remove();
                }
                this.measureQueue.delete(record.index);
                this.rendered.delete(key);
            }
        }

        this.ensureSpacers();
        this.patchOrder(desiredElements);
        this.currentRange = { start: safeStart, end: safeEnd };
        this.updateSpacers();

        if (typeof this.onRangeChange === 'function') {
            this.onRangeChange(this.currentRange);
        }
    }

    ensureSpacers() {
        if (!this.topSpacer.isConnected) {
            this.container.insertBefore(this.topSpacer, this.container.firstChild);
        }
        if (!this.bottomSpacer.isConnected) {
            this.container.appendChild(this.bottomSpacer);
        }
    }

    resolveAnchor(preferred) {
        let anchor = preferred ?? this.bottomSpacer;
        if (!anchor || anchor.parentNode !== this.container) {
            if (!this.bottomSpacer.parentNode || this.bottomSpacer.parentNode !== this.container) {
                this.container.appendChild(this.bottomSpacer);
            }
            anchor = this.bottomSpacer;
        }
        return anchor;
    }

    patchOrder(desiredElements) {
        let anchor = this.resolveAnchor(this.topSpacer.nextSibling);
        for (const element of desiredElements) {
            if (element === anchor) {
                anchor = this.resolveAnchor(anchor?.nextSibling);
                continue;
            }
            const insertionPoint = this.resolveAnchor(anchor);
            this.container.insertBefore(element, insertionPoint);
            anchor = this.resolveAnchor(element.nextSibling);
        }
    }

    scheduleSpacerHeightUpdate(topHeight, bottomHeight) {
        const normalize = (value) => {
            const number = Number(value);
            if (!Number.isFinite(number) || number <= 0) {
                return '0px';
            }
            const rounded = Math.round(number * 1000) / 1000;
            return `${rounded}px`;
        };

        let topValue = normalize(topHeight);
        let bottomValue = normalize(bottomHeight);
        const parsePx = (value) => {
            const numeric = Number.parseFloat(value);
            return Number.isFinite(numeric) ? numeric : 0;
        };
        const previousTop = parsePx(this.spacerHeights.top);
        const previousBottom = parsePx(this.spacerHeights.bottom);
        const nextTop = parsePx(topValue);
        const nextBottom = parsePx(bottomValue);

        if (Math.abs(previousTop - nextTop) < 0.5) {
            topValue = this.spacerHeights.top;
        }
        if (Math.abs(previousBottom - nextBottom) < 0.5) {
            bottomValue = this.spacerHeights.bottom;
        }

        if (!this.nextSpacerHeights) {
            this.nextSpacerHeights = { top: topValue, bottom: bottomValue };
        } else {
            this.nextSpacerHeights.top = topValue;
            this.nextSpacerHeights.bottom = bottomValue;
        }

        if (this.spacerUpdateFrame === null) {
            this.spacerUpdateFrame = requestAnimationFrame(() => this.flushSpacerHeightUpdate());
        }
    }

    flushSpacerHeightUpdate() {
        if (this.spacerUpdateFrame !== null) {
            cancelAnimationFrame(this.spacerUpdateFrame);
            this.spacerUpdateFrame = null;
        }
        if (!this.nextSpacerHeights) {
            return;
        }
        const { top, bottom } = this.nextSpacerHeights;
        this.nextSpacerHeights = null;

        if (this.topSpacer && this.spacerHeights.top !== top) {
            this.topSpacer.style.height = top;
        }
        if (this.bottomSpacer && this.spacerHeights.bottom !== bottom) {
            this.bottomSpacer.style.height = bottom;
        }
        this.spacerHeights = { top, bottom };
    }

    updateSpacers() {
        const { start, end } = this.currentRange;
        if (!this.useSpacers) {
            this.scheduleSpacerHeightUpdate(0, 0);
            return;
        }
        const length = this.values.length;
        if (length === 0) {
            this.scheduleSpacerHeightUpdate(0, 0);
            return;
        }
        const topHeight = this.getOffsetForIndex(start);
        const bottomHeight = Math.max(0, this.getTotalHeight() - this.getOffsetForIndex(end));
        this.scheduleSpacerHeightUpdate(topHeight, bottomHeight);
    }

    refresh() {
        this.setWindow(this.currentRange.start, this.currentRange.end);
    }

    bindScrollElement(element) {
        this.scrollElement = element ?? this.container;
    }

    scrollToIndex(index, align = 'start') {
        if (!this.scrollElement) return;
        const clamped = Math.max(0, Math.min(index, this.values.length - 1));
        const itemHeight = this.getHeightForIndex(clamped);
        const offset = this.getOffsetForIndex(clamped);
        const viewport = this.scrollElement.clientHeight || 0;
        let target = offset;
        if (align === 'center') {
            target = offset - Math.max(0, viewport - itemHeight) / 2;
        } else if (align === 'end') {
            target = offset - Math.max(0, viewport - itemHeight);
        }
        this.scrollElement.scrollTop = Math.max(0, target);
    }

    attachScrollHandler() {
        this.bindScrollElement(this.scrollElement ?? this.container);
        if (!this.scrollElement || this.scrollListener) {
            return;
        }
        const evaluateScrollWindow = () => {
            const scrollTop = this.scrollElement.scrollTop;
            const viewportHeight = this.scrollElement.clientHeight || 0;
            const { start, end } = this.computeWindowFromScroll(scrollTop, viewportHeight);
            if (start !== this.currentRange.start || end !== this.currentRange.end) {
                this.setWindow(start, end);
            }
        };
        this.scrollListener = () => {
            if (this.pendingScrollFrame !== null) {
                return;
            }
            this.pendingScrollFrame = requestAnimationFrame(() => {
                this.pendingScrollFrame = null;
                evaluateScrollWindow();
            });
        };
        this.scrollElement.addEventListener('scroll', this.scrollListener, { passive: true });
        evaluateScrollWindow();
    }

    detachScrollHandler() {
        if (this.pendingScrollFrame !== null) {
            cancelAnimationFrame(this.pendingScrollFrame);
            this.pendingScrollFrame = null;
        }
        if (this.scrollElement && this.scrollListener) {
            this.scrollElement.removeEventListener('scroll', this.scrollListener);
        }
        this.scrollListener = null;
    }

    destroy() {
        this.detachScrollHandler();
        if (this.pendingFrame) {
            cancelAnimationFrame(this.pendingFrame);
            this.pendingFrame = null;
        }
        if (this.spacerUpdateFrame !== null) {
            cancelAnimationFrame(this.spacerUpdateFrame);
            this.spacerUpdateFrame = null;
        }
        this.nextSpacerHeights = null;
        this.measureQueue.clear();
        for (const [key, record] of Array.from(this.rendered.entries())) {
            const { element, index } = record ?? {};
            if (typeof this.onUnmount === 'function' && element) {
                try {
                    this.onUnmount(index ?? 0, element, { key, destroy: true });
                } catch (error) {
                    console.error('VirtualList onUnmount handler failed', error);
                }
            }
            if (element?.isConnected) {
                element.remove();
            }
        }
        this.rendered.clear();
        this.topSpacer.remove();
        this.bottomSpacer.remove();
    }
}

export { VirtualList };
export default VirtualList;
