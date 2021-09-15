/**
 * store creation with thunk and logger middleware
 * 
 * need to import all reducers as "import * as AppServices from '../storeApi';"
 * create instance of ConfigStore "const duxstore = new ConfigStore(AppServices)
 * create Store by calling initstore method "duxstore.initstore"
 * store can be fetched as "export const store = storeInstance.getStore();"
 * actions of specific slice can be fetched as 
 * "const actions = duxStore.getAvailableActions('Login');"
 */
import { createStore, applyMiddleware, compose } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import { createLogicMiddleware } from 'redux-logic';
import _isEmpty from 'lodash/isEmpty';
import thunk from 'redux-thunk';

// import { loggerMiddleware } from './BaseMiddlewares';
import { StoragePersistance } from './StorePersistance';

/**
 * 
 * param {*} appServices - object of all widget and common services 
 * param {*} persistStore - boolean value to whitelist session data
 */
export class ConfigStore {
	store: any;
	appServices: any;
	persistStore: boolean;
	enableDevTool: boolean;
	sessionStore: StoragePersistance;
	appReducers: {};
	allReducer: (state: any, action: any) => any;
	storeInitialState: {};
	appStateLogicsArr: any[];
	reduxLogicMiddleware: any;
	allMiddlewares: any[];
	enhancer: any;
	constructor(appServices: any, sessionId: string = '', persistStore: boolean = false, enableDevTool: boolean = false) {
		const sessionKey = `__appStore${sessionId}__`;
		this.store = null;
		this.appServices = appServices;
		this.persistStore = persistStore;
		this.enableDevTool = enableDevTool;
		this.sessionStore = new StoragePersistance(sessionKey, persistStore);

		this.appReducers = this.getAllReducers(this.appServices);
		this.allReducer = this.combineReducers();
		this.storeInitialState = this.getStoreInitialState(Object.keys(this.appReducers));

		// this.appStateLogics = this.getAllStateLogics(this.appServices);
		// this.allLogics = this.combineLogics();
		// this.reduxLogicMiddleware = createLogicMiddleware(this.allLogics);

		this.appStateLogicsArr = this.getAllStateLogics(this.appServices);
		this.reduxLogicMiddleware = this.appStateLogicsArr.map((logicsChunk) =>
			createLogicMiddleware(this.combineLogics(logicsChunk)));
		// this.allMiddlewares = [thunk, ...this.reduxLogicMiddleware, loggerMiddleware];
		this.allMiddlewares = [thunk, ...this.reduxLogicMiddleware];
		this.enhancer = devToolsEnhancer({});
	}

	initStore() {
		const reducersInitState = { ...this.storeInitialState };
		const hydratingState = this.persistStore
			? this.sessionStore.getStorage() || reducersInitState
			: reducersInitState;
		const addDevtool = this.getUrlQueryValue('devTool') === 'true' && this.enableDevTool;

		this.store = addDevtool
			? createStore(
				this.allReducer, hydratingState, compose(applyMiddleware(...this.allMiddlewares), this.enhancer)
			) : createStore(
				this.allReducer, hydratingState, compose(applyMiddleware(...this.allMiddlewares))
			);
		return this.store;
	}

	resetAndHydrateStore() {
		const reducersInitState = { ...this.storeInitialState };
		const hydratingState = this.sessionStore.getStorage() || reducersInitState;
		const resetAction = {
			type: 'RESET_AND_HYDRATE',
			payload: { ...hydratingState, slice: 'root' },
		};
		this.store.dispatch(resetAction);
	}

	combineLogics(stateLogics: any) {
		const appLogics = [];
		const appStateLogics = this.objectValues(stateLogics);
		appStateLogics.forEach((logics) => {
			appLogics.push(...logics);
		});
		return [...appLogics];
	}

	combineReducers() {
		const reducers = { ...this.appReducers };
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
					nextStateForKey = this.getSliceNextState(action,
						key, previousStateForKey, sliceName, reducer);
				} else {
					nextStateForKey = reducer(previousStateForKey, action);
				}
				nextState[key] = nextStateForKey.payload || nextStateForKey;
				return nextState;
			});
			return nextState;
		};
		return stateData;
	}

	getSliceNextState(action: any, key: string, previousStateForKey: any, sliceName: string, reducer: any) {
		const spreadAction = { ...action };
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

	getErrorState(action: any, key: string, previousStateForKey: any, reducer: any) {
		let nextStateForKey;
		const spreadAction = { ...action };
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
			} else {
				nextErrorData = [nextErrorObj];
			}
			spreadAction.type = baseErrorType;
			spreadAction.payload = nextErrorData;
			nextStateForKey = reducer(previousStateForKey, spreadAction);
		} else if (scopeSlice === key) {
			spreadAction.type = scopeErrorType;
			nextStateForKey = reducer(previousStateForKey, spreadAction);
		} else {
			nextStateForKey = previousStateForKey;
		}
		return nextStateForKey;
	}

	getStoreInitialState(allReducer: any) {
		const reducerObj = {};
		allReducer.map((reducerName) => {
			const sliceConstants = this.getAvailableConstant(reducerName);
			const { initialState } = sliceConstants;
			reducerObj[reducerName] = initialState ? { ...initialState } : {};
			return reducerObj;
		});
		return reducerObj;
	}

	getAllReducers(apiRefs: any) {
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

	getAllStateLogics(apiRefs: any) {
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

	getAvailableActions(appName: any) {
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

	getAvailableConstant(appName: string) {
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

	getAvailableService(appName: string) {
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

	getAvailableApi(appName: string) {
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

	getUrlQueryValue(key: string) {
		const { search } = window.location;
		const queryString = !_isEmpty(search) ? search.substring(1) : '';
		const queriedArr = queryString.split('&');
		const filteredQuery = queriedArr.filter((IndividualQuery) => {
			const pair = IndividualQuery.split('=');
			if (pair[0] === key) {
				return pair[1];
			}
			return false;
		});
		return !_isEmpty(filteredQuery) ? filteredQuery[0].split('=')[1] : null;
	}

	objectValues = (obj: object) => {
		const arrayObj = Object.keys(obj).map((e) => (
			obj[e]
		));
		return arrayObj;
	}
}
