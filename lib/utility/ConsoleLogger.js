"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
class ConsoleLogger {
    constructor() {
        const buildType = process.env.BUILD_TYPE;
        this.log = buildType === 'production' ? () => { } : console.log;
        this.error = buildType === 'production' ? () => { } : console.error;
        this.info = buildType === 'production' ? () => { } : console.log;
    }
    log(msg) {
        this.log(msg);
    }
    info(msg) {
        this.info(msg);
    }
    error(msg) {
        this.error(msg);
    }
}
exports.logger = new ConsoleLogger();
//# sourceMappingURL=ConsoleLogger.js.map