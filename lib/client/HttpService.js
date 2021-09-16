"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpService = void 0;
const get_1 = __importDefault(require("lodash/get"));
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const bluebird_1 = __importDefault(require("bluebird"));
const uuid_1 = require("uuid");
class HttpService {
    constructor(headerConfigs, localConfigs, envConfigs, axios, store, storeInstance) {
        this.isMock = localConfigs.isMock;
        this.mockURL = localConfigs.mockURL;
        this.baseURL = envConfigs.baseURL;
        this.headerConfigs = headerConfigs;
        this.envConfigs = envConfigs;
        this.localConfigs = localConfigs;
        this.store = store;
        this.storeInstance = storeInstance;
        this.axios = axios;
        this.baseAction = this.storeInstance.getAvailableActions('base');
        this.notificationAction = this.storeInstance.getAvailableActions('notification');
    }
    getCustomHeaders(customHeaders) {
        const customAvailableHeader = Object.keys(customHeaders);
        const headerObj = {};
        customAvailableHeader.forEach((header) => {
            if (header !== 'cache') {
                headerObj[header] = customHeaders[header];
            }
            if (header === 'cache' && !customHeaders[header]) {
                headerObj.Pragma = 'no-cache';
                headerObj.Expires = '-1';
                headerObj['Cache-Control'] = 'no-cache, no-store';
            }
            if (header === 'cache' && customHeaders[header]) {
                delete headerObj.Pragma;
                delete headerObj.Expires;
                delete headerObj['Cache-Control'];
            }
        });
        return headerObj;
    }
    getHeaders(customHeaders) {
        const { headerConfigs } = this;
        const availableHeaders = Object.keys(headerConfigs);
        const headerObj = {};
        availableHeaders.forEach((header) => {
            if (header !== 'Tracking-Id' && header !== 'cache') {
                headerObj[header] = headerConfigs[header];
            }
            if (header === 'Tracking-Id' && (headerConfigs[header] === '00000000-0000-0000-0000-000000000000' || !headerConfigs[header])) {
                headerObj['Tracking-Id'] = (0, uuid_1.v4)();
            }
            if (header === 'cache' && !headerConfigs[header]) {
                headerObj.Pragma = 'no-cache';
                headerObj.Expires = '-1';
                headerObj['Cache-Control'] = 'no-cache, no-store';
            }
            if (header === 'cache' && headerConfigs[header]) {
                headerObj['Cache-Control'] = 'public; max-age=300';
            }
        });
        if (!(0, isEmpty_1.default)(customHeaders)) {
            const customApiHeaders = this.getCustomHeaders(customHeaders);
            return Object.assign(Object.assign({}, headerObj), { customApiHeaders });
        }
        return headerObj;
    }
    http(method, mockName, url, payload, query, customHeaders) {
        if (this.isMock) {
            return this.mockService(mockName, customHeaders);
        }
        return this.apiService(method, url, payload, query, customHeaders);
    }
    loaderAction() {
        let counter = (0, get_1.default)(this.store.getState(), 'base.loaderCounter');
        const { loaderTimeout } = this.localConfigs;
        counter = counter ? counter - 1 : counter;
        if (counter === 0) {
            setTimeout(() => {
                this.store.dispatch(this.baseAction.setLoaderCounterAction((counter)));
            }, loaderTimeout);
        }
        else {
            this.store.dispatch(this.baseAction.setLoaderCounterAction((counter)));
        }
    }
    mockService(mockName, customHeaders) {
        let loaderCounter = (0, get_1.default)(this.store.getState(), 'base.loaderCounter', 0);
        const url = `${this.mockURL}/${mockName}.json`;
        loaderCounter += 1;
        this.store.dispatch(this.baseAction.setLoaderCounterAction((loaderCounter)));
        return new bluebird_1.default((resolve, reject) => {
            this.axios.get(url, { headers: this.getHeaders(customHeaders) }).then((resp) => {
                this.loaderAction();
                resolve(resp);
            }).catch((error) => {
                this.loaderAction();
                this.store.dispatch(this.notificationAction.setErrorAction([error.response]));
                reject(error);
            });
        });
    }
    apiService(method, url, payload, query, customHeaders, attempt = 1) {
        let loaderCounter = (0, get_1.default)(this.store.getState(), 'base.loaderCounter', 0);
        const apiUrl = `${this.baseURL}/${url}`;
        loaderCounter += 1;
        this.store.dispatch(this.baseAction.setLoaderCounterAction((loaderCounter)));
        return new bluebird_1.default((resolve, reject) => {
            this.axios(this.getCallOptions(method, apiUrl, payload, query, customHeaders))
                .then((resp) => {
                this.loaderAction();
                resolve(resp);
            }).catch((error) => {
                this.loaderAction();
                if ((0, get_1.default)(error.response, 'status', '') || attempt === 2) {
                    this.store.dispatch(this.notificationAction.setErrorAction([error.response]));
                    reject(error);
                }
                else {
                    this.apiService(method, url, payload, query, customHeaders, 2);
                }
                reject(error);
            });
        });
    }
    getCallOptions(method, url, payload, query, customHeaders) {
        let queryString = '';
        if (!(0, isEmpty_1.default)(query)) {
            Object.keys(query).map((key) => {
                const keyValue = typeof query[key] === 'undefined' || query[key] === null || query[key] === 'null' ? '' : query[key];
                queryString = queryString ? `${queryString}&${key}=${keyValue}` : `${key}=${keyValue}`;
                return queryString;
            });
        }
        this.queriedUrl = `${url}${query && queryString ? '?' : ''}${queryString}`;
        if (method === 'get') {
            return {
                method,
                url: this.queriedUrl,
                headers: this.getHeaders(customHeaders)
            };
        }
        return {
            method,
            url: this.queriedUrl,
            data: payload,
            headers: this.getHeaders(customHeaders)
        };
    }
}
exports.HttpService = HttpService;
//# sourceMappingURL=HttpService.js.map