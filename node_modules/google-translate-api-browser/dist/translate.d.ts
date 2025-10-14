import { TranslateOptions } from './generateRequestUrl';
import { TranslationResult } from './normaliseResponse';
export declare const setCORS: (CORSURL: string) => typeof translate;
export declare function translate(text: string, options?: Partial<TranslateOptions>): Promise<TranslationResult>;
