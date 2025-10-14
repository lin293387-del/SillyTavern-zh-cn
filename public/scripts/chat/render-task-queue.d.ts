export type RenderQueueName = 'pipeline' | 'media' | 'extension' | (string & {});

export interface ScheduleRenderTaskOptions {
    queue?: RenderQueueName;
    allowDrop?: boolean;
    label?: string;
    onDrop?: () => void;
}

export interface RenderTaskQueueStats {
    length: number;
    processed: number;
    dropped: number;
    peakLength: number;
}

export interface RenderTaskMetrics {
    reason: string;
    timestamp: number;
    totalQueueLength: number;
    queueLength: number;
    peakTotalLength: number;
    totalProcessed: number;
    totalDropped: number;
    overflowCount: number;
    batches: number;
    totalDuration: number;
    lastBatchDuration: number;
    queues: Record<string, RenderTaskQueueStats>;
    [key: string]: unknown;
}

export interface RenderTaskDebugNamespace {
    snapshot: () => RenderTaskMetrics;
    subscribe: (listener: RenderTaskObserver) => void;
    unsubscribe: (listener: RenderTaskObserver) => void;
}

export type RenderTaskObserver = (snapshot: RenderTaskMetrics) => void;

export function scheduleRenderTask(
    task: () => void,
    policyOrOptions?: RenderQueueName | ScheduleRenderTaskOptions,
): void;

export function flushRenderTasks(targetQueues?: RenderQueueName[]): void;

export function getRenderTaskSnapshot(): RenderTaskMetrics;

export function subscribeRenderTaskObserver(listener: RenderTaskObserver): void;

export function unsubscribeRenderTaskObserver(listener: RenderTaskObserver): void;

export function exposeRenderTaskDebug(target?: { __renderTaskDebug__?: RenderTaskDebugNamespace } & Record<string, unknown>): void;
