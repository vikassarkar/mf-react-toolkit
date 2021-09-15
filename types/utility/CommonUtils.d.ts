declare class CommonUtils {
    invalidQuery: string;
    constructor();
    getEnvName(): string;
    redirectPage(historyRef: any, route: string, urlQuery: string, state?: any): void;
    capitalizeWord(string: string): string;
    capitalizeSentence: (sentance: string) => string;
    removeWhiteSpace(string: string): string;
    getUrlQueryOject(): {};
    getUrlQueryValue(key: string): string;
    getCurrentDate(): string;
    getCurrentPage(): string;
    isCurrentPage(pageName: string): boolean;
    scrollToTop(element?: any, animate?: boolean): void;
    getUserDataFromLocalStorage(storage?: string): any;
    getUserDataFromSessionStorage(storage?: string): any;
    setUserDataInLocalStorage(value: any, storage?: string): void;
    setUserDataInSessionStorage(value: any, storage?: string): void;
}
export declare const commonUtils: CommonUtils;
export {};
