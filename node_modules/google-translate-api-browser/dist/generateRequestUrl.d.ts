import { LangKey } from './languages';
export type TranslateOptions = {
    client: 'gtx' | 'webapp';
    from: LangKey;
    to: LangKey;
    hl: LangKey;
    raw: boolean;
    tld: string;
};
export declare function generateRequestUrl(text: string, options: Partial<Omit<TranslateOptions, 'raw'>>): string;
