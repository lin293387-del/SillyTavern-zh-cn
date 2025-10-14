export interface StageDefinition {
    name: string;
    priority?: number;
    async?: boolean;
    emitStatus?: boolean;
}

export interface NormalizedStageDefinition {
    name: string;
    priority: number;
    async: boolean;
    emitStatus: boolean;
}

export function getBuiltinStageConfig(name: string): StageDefinition | null;

export function normalizeStageOptions(name: string, options?: StageDefinition): NormalizedStageDefinition;

export function describeStages(stages?: StageDefinition[]): Array<{
    name: string;
    priority: number;
    async: boolean;
}>;
