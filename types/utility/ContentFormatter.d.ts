declare class ContentFormatter {
    limitContent(str: string, limitLength: number): string;
    formatPostCode(str: string): string;
    formatSimNumber(str: string): string;
    formatCardNumber(str: string): string;
    formatFloatWithoutRoundof(floatNumber: any, decimalPoint?: number): string;
    formatFloatWithRoundof(floatNumber: any, decimalPoint?: number): string;
    formatAmount(amount: any, currency?: string, decimalPoint?: number, withRoundOf?: boolean): string;
}
export declare const contentFormatter: ContentFormatter;
export {};
