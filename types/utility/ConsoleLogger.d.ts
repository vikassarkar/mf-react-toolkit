declare class ConsoleLogger {
    constructor();
    log(msg: any): void;
    info(msg: any): void;
    error(msg: any): void;
}
export declare const logger: ConsoleLogger;
export {};
