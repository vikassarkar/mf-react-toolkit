import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import Promise from 'bluebird';
import { v4 as uuidv4 } from 'uuid';

export class HttpService {
    isMock: any;
    axios: any;
    baseAction: any;
    baseURL: any;
    envConfigs: any;
    mockURL: any;
    headerConfigs: any;
    localConfigs: any;
    store: any;
    storeInstance: any;
    notificationAction: any;
    queriedUrl: string;

    constructor(headerConfigs: any, localConfigs: any, envConfigs: any, axios: any, store: any, storeInstance: any) {
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

    getCustomHeaders(customHeaders: object) {
        const customAvailableHeader = Object.keys(customHeaders);
        const headerObj: any = {};
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

    getHeaders(customHeaders: object) {
        const { headerConfigs } = this;
        const availableHeaders: Array<string> = Object.keys(headerConfigs);
        const headerObj: any = {};
        availableHeaders.forEach((header) => {
            if (header !== 'Tracking-Id' && header !== 'cache') {
                headerObj[header] = headerConfigs[header];
            }
            if (header === 'Tracking-Id' && (headerConfigs[header] === '00000000-0000-0000-0000-000000000000' || !headerConfigs[header])) {
                headerObj['Tracking-Id'] = uuidv4();
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
        if (!_isEmpty(customHeaders)) {
            const customApiHeaders = this.getCustomHeaders(customHeaders);
            return { ...headerObj, customApiHeaders };
        }
        return headerObj;
    }

    http(method: string, mockName: string, url: string, payload: any, query: object, customHeaders: object) {
        if (this.isMock) {
            return this.mockService(mockName, customHeaders);
        }
        return this.apiService(method, url, payload, query, customHeaders);
    }

    loaderAction() {
        let counter: number = _get(this.store.getState(), 'base.loaderCounter');
        const { loaderTimeout } = this.localConfigs;
        counter = counter ? counter - 1 : counter;
        if (counter === 0) {
            setTimeout(() => {
                this.store.dispatch(this.baseAction.setLoaderCounterAction((counter)));
            }, loaderTimeout);
        } else {
            this.store.dispatch(this.baseAction.setLoaderCounterAction((counter)));
        }
    }

    mockService(mockName: string, customHeaders: object) {
        let loaderCounter: number = _get(this.store.getState(), 'base.loaderCounter', 0);
        const url: string = `${this.mockURL}/${mockName}.json`;
        loaderCounter += 1;
        this.store.dispatch(this.baseAction.setLoaderCounterAction((loaderCounter)));
        return new Promise((resolve: any, reject: any) => {
            this.axios.get(url, { headers: this.getHeaders(customHeaders) }).then((resp: any) => {
                this.loaderAction();
                resolve(resp);
            }).catch((error: any) => {
                this.loaderAction();
                this.store.dispatch(
                    this.notificationAction.setErrorAction([error.response])
                );
                reject(error);
            });
        });
    }

    apiService(method: string, url: string, payload: any, query: object, customHeaders: object, attempt: number = 1) {
        let loaderCounter: number = _get(this.store.getState(), 'base.loaderCounter', 0);
        const apiUrl: string = `${this.baseURL}/${url}`;
        loaderCounter += 1;
        this.store.dispatch(this.baseAction.setLoaderCounterAction((loaderCounter)));
        return new Promise((resolve: any, reject: any) => {
            this.axios(this.getCallOptions(method, apiUrl, payload, query, customHeaders))
                .then((resp: any) => {
                    this.loaderAction();
                    resolve(resp);
                }).catch((error: any) => {
                    this.loaderAction();
                    if (_get(error.response, 'status', '') || attempt === 2) {
                        this.store.dispatch(
                            this.notificationAction.setErrorAction([error.response])
                        );
                        reject(error);
                    } else {
                        this.apiService(method, url, payload, query, customHeaders, 2);
                    }
                    reject(error);
                });
        });
    }

    getCallOptions(method: string, url: string, payload: any, query: object, customHeaders: object) {
        let queryString: string = '';
        if (!_isEmpty(query)) {
            Object.keys(query).map((key) => {
                const keyValue: string = typeof query[key] === 'undefined' || query[key] === null || query[key] === 'null' ? '' : query[key];
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
