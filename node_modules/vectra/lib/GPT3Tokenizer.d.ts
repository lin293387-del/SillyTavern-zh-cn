import { Tokenizer } from "./types";
/**
 * Tokenizer that uses GPT-3's encoder.
 */
export declare class GPT3Tokenizer implements Tokenizer {
    decode(tokens: number[]): string;
    encode(text: string): number[];
}
//# sourceMappingURL=GPT3Tokenizer.d.ts.map