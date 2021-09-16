"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigStore = void 0;
const redux_1 = require("redux");
const redux_devtools_extension_1 = require("redux-devtools-extension");
const redux_logic_1 = require("redux-logic");
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const redux_thunk_1 = __importDefault(require("redux-thunk"));
const StorePersistance_1 = require("./StorePersistance");
class ConfigStore {
    constructor(appServices, sessionId = '', persistStore = false, enableDevTool = false) {
        this.objectValues = (obj) => {
            const arrayObj = Object.keys(obj).map((e) => (obj[e]));
            return arrayObj;
        };
        const sessionKey = `__appStore${sessionId}__`;
        this.store = null;
        this.appServices = appServices;
        this.persistStore = persistStore;
        this.enableDevTool = enableDevTool;
        this.sessionStore = new StorePersistance_1.StoragePersistance(sessionKey, persistStore);
        this.appReducers = this.getAllReducers(this.appServices);
        this.allReducer = this.combineReducers();
        this.storeInitialState = this.getStoreInitialState(Object.keys(this.appReducers));
        this.appStateLogicsArr = this.getAllStateLogics(this.appServices);
        this.reduxLogicMiddleware = this.appStateLogicsArr.map((logicsChunk) => (0, redux_logic_1.createLogicMiddleware)(this.combineLogics(logicsChunk)));
        this.allMiddlewares = [redux_thunk_1.default, ...this.reduxLogicMiddleware];
        this.enhancer = (0, redux_devtools_extension_1.devToolsEnhancer)({});
    }
    initStore() {
        const reducersInitState = Object.assign({}, this.storeInitialState);
        const hydratingState = this.persistStore
            ? this.sessionStore.getStorage() || reducersInitState
            : reducersInitState;
        const addDevtool = this.getUrlQueryValue('devTool') === 'true' && this.enableDevTool;
        this.store = addDevtool
            ? (0, redux_1.createStore)(this.allReducer, hydratingState, (0, redux_1.compose)((0, redux_1.applyMiddleware)(...this.allMiddlewares), this.enhancer)) : (0, redux_1.createStore)(this.allReducer, hydratingState, (0, redux_1.compose)((0, redux_1.applyMiddleware)(...this.allMiddlewares)));
        return this.store;
    }
    resetAndHydrateStore() {
        const reducersInitState = Object.assign({}, this.storeInitialState);
        const hydratingState = this.sessionStore.getStorage() || reducersInitState;
        const resetAction = {
            type: 'RESET_AND_HYDRATE',
            payload: Object.assign(Object.assign({}, hydratingState), { slice: 'root' }),
        };
        this.store.dispatch(resetAction);
    }
    combineLogics(stateLogics) {
        const appLogics = [];
        const appStateLogics = this.objectValues(stateLogics);
        appStateLogics.forEach((logics) => {
            appLogics.push(...logics);
        });
        return [...appLogics];
    }
    combineReducers() {
        const reducers = Object.assign({}, this.appReducers);
        const reducerKeys = Object.keys(reducers);
        const stateData = (state, action) => {
            const newAction = action;
            const nextState = {};
            const sliceName = action && action.payload && action.payload.slice;
            if (sliceName === 'root') {
                return newAction.payload;
            }
            reducerKeys.map((reducerStr) => {
                let nextStateForKey;
                const key = reducerStr;
                const reducer = reducers[key];
                const previousStateForKey = state[key] || {};
                if (sliceName) {
                    delete newAction.payload.slice;
                    nextStateForKey = this.getSliceNextState(action, key, previousStateForKey, sliceName, reducer);
                }
                else {
                    nextStateForKey = reducer(previousStateForKey, action);
                }
                nextState[key] = nextStateForKey.payload || nextStateForKey;
                return nextState;
            });
            return nextState;
        };
        return stateData;
    }
    getSliceNextState(action, key, previousStateForKey, sliceName, reducer) {
        const spreadAction = Object.assign({}, action);
        const payLoadKeys = spreadAction.payload ? Object.keys(spreadAction.payload) : [];
        if (spreadAction.payload && payLoadKeys.some((str) => str.indexOf('payload') > -1)) {
            spreadAction.payload = spreadAction.payload.payload;
        }
        const nextStateForKey = sliceName === key ? reducer(previousStateForKey, spreadAction)
            : previousStateForKey;
        if (sliceName === key) {
            const sliceConstants = this.getAvailableConstant(sliceName);
            const { persistStore } = sliceConstants || {};
            this.sessionStore.persistStorage(sliceName, nextStateForKey, persistStore);
        }
        return nextStateForKey;
    }
    getErrorState(action, key, previousStateForKey, reducer) {
        let nextStateForKey;
        const spreadAction = Object.assign({}, action);
        const payLoadKeys = spreadAction.payload ? Object.keys(spreadAction.payload) : [];
        const baseErrorType = action.type.split('/')[0].split('__')[0];
        const baseSlice = action.type.split('/')[0].split('__')[1];
        const scopeErrorType = action.type.split('/')[1].split('__')[0];
        const scopeSlice = action.type.split('/')[1].split('__')[1];
        if (spreadAction.payload && payLoadKeys.some((str) => str.indexOf('payload') > -1)) {
            spreadAction.payload = spreadAction.payload.payload;
        }
        if (baseSlice === key) {
            let nextErrorData = [];
            const prevErrorData = previousStateForKey.error;
            const nextErrorObj = spreadAction.payload;
            if (Array.isArray(prevErrorData)) {
                prevErrorData.push(nextErrorObj);
                nextErrorData = prevErrorData;
            }
            else {
                nextErrorData = [nextErrorObj];
            }
            spreadAction.type = baseErrorType;
            spreadAction.payload = nextErrorData;
            nextStateForKey = reducer(previousStateForKey, spreadAction);
        }
        else if (scopeSlice === key) {
            spreadAction.type = scopeErrorType;
            nextStateForKey = reducer(previousStateForKey, spreadAction);
        }
        else {
            nextStateForKey = previousStateForKey;
        }
        return nextStateForKey;
    }
    getStoreInitialState(allReducer) {
        const reducerObj = {};
        allReducer.map((reducerName) => {
            const sliceConstants = this.getAvailableConstant(reducerName);
            const { initialState } = sliceConstants;
            reducerObj[reducerName] = initialState ? Object.assign({}, initialState) : {};
            return reducerObj;
        });
        return reducerObj;
    }
    getAllReducers(apiRefs) {
        const reducerMapper = {};
        const apiRef = apiRefs || this.appServices;
        const allSlicekeys = Object.keys(apiRef);
        allSlicekeys.map((moduleObj) => {
            const moduleAllExports = apiRef[moduleObj];
            const moduleExportkeys = Object.keys(moduleAllExports);
            return moduleExportkeys.map((key) => {
                const reducerObj = moduleAllExports[key];
                if (key.indexOf('Reducer') !== -1) {
                    const module = key.split('Reducer')[0];
                    reducerMapper[module] = reducerObj;
                }
                return reducerMapper;
            });
        });
        return reducerMapper;
    }
    getAllStateLogics(apiRefs) {
        const logicChunks = 20;
        const logicMapperArr = [];
        const logicMapper = {};
        const apiRef = apiRefs || this.appServices;
        const allSlicekeys = Object.keys(apiRef);
        const logicMapperMtxNumbers = Math.ceil(allSlicekeys.length / logicChunks);
        for (let i = 1; i <= logicMapperMtxNumbers; i += 1) {
            logicMapperArr.push({});
        }
        allSlicekeys.map((moduleObj, i) => {
            const moduleAllExports = apiRef[moduleObj];
            const moduleExportkeys = Object.keys(moduleAllExports);
            return moduleExportkeys.map((key) => {
                const arrayChunkNum = Math.floor(i / logicChunks);
                const logicObj = moduleAllExports[key];
                if (key.indexOf('StateLogics') !== -1) {
                    const module = key.split('StateLogics')[0];
                    logicMapper[module] = logicObj;
                    logicMapperArr[arrayChunkNum][module] = logicObj;
                }
                return logicMapper;
            });
        });
        return logicMapperArr;
    }
    getAvailableActions(appName) {
        const appActions = {};
        const availableServices = this.appServices;
        const allSlicekeys = Object.keys(availableServices);
        allSlicekeys.map((moduleObj) => {
            const moduleAllExports = availableServices[moduleObj];
            const moduleExportkeys = Object.keys(moduleAllExports);
            return moduleExportkeys.map((key) => {
                const actionObj = moduleAllExports[key];
                if (key.indexOf('Actions') !== -1) {
                    const module = key.split('Actions')[0];
                    appActions[module] = actionObj;
                }
                return appActions;
            });
        });
        return appActions[appName];
    }
    getAvailableConstant(appName) {
        const appConstants = {};
        const availableServices = this.appServices;
        const allSlicekeys = Object.keys(availableServices);
        allSlicekeys.map((moduleObj) => {
            const moduleAllExports = availableServices[moduleObj];
            const moduleExportkeys = Object.keys(moduleAllExports);
            return moduleExportkeys.map((key) => {
                const reducerObj = moduleAllExports[key];
                if (key.indexOf('Constants') !== -1) {
                    const module = key.split('Constants')[0];
                    appConstants[module] = reducerObj;
                }
                return appConstants;
            });
        });
        return appConstants[appName];
    }
    getAvailableService(appName) {
        const appServices = {};
        const availableServices = this.appServices;
        const allSlicekeys = Object.keys(availableServices);
        allSlicekeys.map((moduleObj) => {
            const moduleAllExports = availableServices[moduleObj];
            const moduleExportkeys = Object.keys(moduleAllExports);
            return moduleExportkeys.map((key) => {
                const serviceObj = moduleAllExports[key];
                if (key.indexOf('Services') !== -1) {
                    const module = key.split('Services')[0];
                    appServices[module] = serviceObj;
                }
                return appServices;
            });
        });
        return appServices[appName];
    }
    getAvailableApi(appName) {
        const appServices = {};
        const availableServices = this.appServices;
        const allSlicekeys = Object.keys(availableServices);
        allSlicekeys.map((moduleObj) => {
            const moduleAllExports = availableServices[moduleObj];
            const moduleExportkeys = Object.keys(moduleAllExports);
            return moduleExportkeys.map((key) => {
                const serviceObj = moduleAllExports[key];
                if (key.indexOf('Api') !== -1) {
                    const module = key.split('Api')[0];
                    appServices[module] = serviceObj;
                }
                return appServices;
            });
        });
        return appServices[appName];
    }
    getUrlQueryValue(key) {
        const { search } = window.location;
        const queryString = !(0, isEmpty_1.default)(search) ? search.substring(1) : '';
        const queriedArr = queryString.split('&');
        const filteredQuery = queriedArr.filter((IndividualQuery) => {
            const pair = IndividualQuery.split('=');
            if (pair[0] === key) {
                return pair[1];
            }
            return false;
        });
        return !(0, isEmpty_1.default)(filteredQuery) ? filteredQuery[0].split('=')[1] : null;
    }
}
exports.ConfigStore = ConfigStore;
//# sourceMappingURL=ConfigStore.js.map