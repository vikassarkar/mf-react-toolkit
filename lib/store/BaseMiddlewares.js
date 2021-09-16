"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reducerLoggerMiddleware = exports.loggerMiddleware = void 0;
const ConsoleLogger_1 = require("../utility/ConsoleLogger");
const loggerMiddleware = (store) => ((next) => (action) => {
    let returnValue;
    const reduxErrorAction = action.type && action.type.split('/').length > 1;
    if (reduxErrorAction) {
        const baseErrorType = action.type.split('/')[0].split('__')[0];
        const scopeErrorType = action.type.split('/')[1].split('__')[0];
        ConsoleLogger_1.logger.info('Store will dispatch :');
        ConsoleLogger_1.logger.log({ type: baseErrorType, payload: action.payload });
        ConsoleLogger_1.logger.log({ type: scopeErrorType, payload: action.payload });
        returnValue = next(action);
        ConsoleLogger_1.logger.info('Store state after dispatch :');
        ConsoleLogger_1.logger.log(store.getState());
    }
    else {
        ConsoleLogger_1.logger.info('Store will dispatch :');
        ConsoleLogger_1.logger.log(action);
        returnValue = next(action);
        ConsoleLogger_1.logger.info('Store state after dispatch :');
        ConsoleLogger_1.logger.log(store.getState());
    }
    return returnValue;
});
exports.loggerMiddleware = loggerMiddleware;
const reducerLoggerMiddleware = (store) => (next) => (action) => (next(Object.assign(Object.assign({}, action), { getState: store.getState })));
exports.reducerLoggerMiddleware = reducerLoggerMiddleware;
//# sourceMappingURL=BaseMiddlewares.js.map