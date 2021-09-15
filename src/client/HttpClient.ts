import axios from 'axios';
import { HttpService } from './HttpService';

/**
 * Class for rest call services
 * should be initialize with 
 * isMock(bool), baseURL(string), Authorization(string), contentType(string), restErrorAction(fn)
 */
export class HttpClient {
    configs: any;
    rest: HttpService;

    constructor(configs: any, store: any, storeInstance: any) {
        this.configs = configs;
        const { headerConfigs, localConfigs, envConfigs } = configs;
        this.rest = new HttpService(
            headerConfigs,
            localConfigs,
            envConfigs,
            axios,
            store,
            storeInstance
        );
    }

    get(mockName: string, url: string, query: object, customHeaders: object = {}) {
    // get(mockName: string, url: string, query: Record<string, unknown>, customHeaders: Record<string, unknown> = {}) {
        return this.rest.http('get', mockName, url, '', query, customHeaders);
    }

    post(mockName: string, url: string, payload: any = {}, query: object = {}, customHeaders: object = {}) {
        return this.rest.http('post', mockName, url, payload, query, customHeaders);
    }

    put(mockName: string, url: string, payload: any = {}, query: object = {}, customHeaders: object = {}) {
        return this.rest.http('put', mockName, url, payload, query, customHeaders);
    }

    patch(mockName: string, url: string, payload: any = {}, query: object = {}, customHeaders: object = {}) {
        return this.rest.http('patch', mockName, url, payload, query, customHeaders);
    }

    delete(mockName: string, url: string, payload: any = {}, query: object = {}, customHeaders: object = {}) {
        return this.rest.http('delete', mockName, url, payload, query, customHeaders);
    }
}
