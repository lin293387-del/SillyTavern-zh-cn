export type LanguageData = {
    language: {
        didYouMean: boolean;
        iso: string;
    };
    text: {
        autoCorrected: boolean;
        value: string;
        didYouMean: boolean;
    };
};
export type TranslationResult = {
    text: string;
    pronunciation: string;
    from: LanguageData;
    raw?: any;
};
export declare function normaliseResponse(body: any, raw?: boolean): TranslationResult;
