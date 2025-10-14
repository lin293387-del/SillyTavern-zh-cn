import type { MessageRenderingResult, MessageRenderingParams } from './chat-renderer.js';

export type MessageMappingElement = Element | JQuery<Element>;

export interface MessageRenderingState extends Partial<MessageRenderingResult> {
    params?: Partial<MessageRenderingParams> | null;
}

export interface MessageStateOptions {
    isSmallSystem?: boolean;
    hasToolInvocation?: boolean;
}

export function applyMessageDomMapping(
    element: MessageMappingElement,
    renderingData?: MessageRenderingState,
): void;

export function applyMessageStateClasses(
    element: MessageMappingElement,
    state?: MessageStateOptions,
): void;
